import { newId, now } from '../db/db.js';
import { taskTransaction } from '../task/write/task-transaction.js';
import { timelineIdArg, requireTimeline, timelineOut, timelineError, timelineChange, setMembership } from './timeline-store.js';
import { migrateTimelines } from './timeline-migration.js';
export const TIMELINE_ID_SCHEMA = {
  timelineId:{type:['string','number'],description:'已手动创建的时间线 id，保留原字符串'},
  timelineKey:{type:['string','number'],description:'deprecated：timelineId 的兼容别名；同时传值必须相同'},
};
export const TIMELINE_ID_REQUIRED = [{required:['timelineId']},{required:['timelineKey']}];
export function createTimeline(db,args,origin,api) {
  return taskTransaction(db,api,buffered=>{
    const id = args.id === undefined ? newId() : String(args.id);
    if (!id) throw timelineError('TIMELINE_ID_REQUIRED','id 不能为空');
    const existing = db.prepare('SELECT * FROM task_timeline WHERE id=?').get(id);
    if (existing) throw timelineError(existing.deleted_at === null ? 'TIMELINE_EXISTS':'TIMELINE_DELETED','时间线 id 已存在，不能隐式恢复');
    const ts=now(),row={id,title:String(args.title??'').trim()||'未命名时间线',description:String(args.description??''),created_at:ts,updated_at:ts,deleted_at:null,rev:1};
    db.prepare('INSERT INTO task_timeline(id,title,description,created_at,updated_at,deleted_at,rev) VALUES(?,?,?,?,?,?,?)').run(...Object.values(row));
    timelineChange(db,'task_timeline',row,origin,buffered,'create');
    return {timeline:timelineOut(row)};
  });
}
export function updateTimeline(db,args,origin,api) {
  return taskTransaction(db,api,buffered=>{
    const row = requireTimeline(db,timelineIdArg(args));
    const title=args.title===undefined?row.title:String(args.title).trim()||'未命名时间线';
    const description=args.description===undefined?row.description:String(args.description);
    const changed=title!==row.title||description!==row.description;
    if(changed) {
      Object.assign(row,{title,description,updated_at:now(),rev:row.rev+1});
      db.prepare('UPDATE task_timeline SET title=?,description=?,updated_at=?,rev=? WHERE id=?').run(title,description,row.updated_at,row.rev,row.id);
      timelineChange(db,'task_timeline',row,origin,buffered);
    }
    return {timeline:timelineOut(row),changed};
  });
}
export function deleteTimeline(db,args,origin,api) {
  const plan=buffered=>{
    const row=requireTimeline(db,timelineIdArg(args));
    const links=db.prepare('SELECT * FROM task_timeline_link WHERE timeline_id=? AND deleted_at IS NULL').all(row.id);
    if(args.dryRun===true) return {dryRun:true,timelineId:row.id,affectedTasks:links.length,wouldDetach:links.length};
    const ts=now(),touched=new Set();
    for(const link of links) setMembership(db,link.task_id,null,origin,buffered,{ts,touched});
    Object.assign(row,{deleted_at:ts,updated_at:ts,rev:row.rev+1});
    db.prepare('UPDATE task_timeline SET deleted_at=?,updated_at=?,rev=? WHERE id=?').run(ts,ts,row.rev,row.id);
    timelineChange(db,'task_timeline',row,origin,buffered,'delete');
    return {timelineId:row.id,affectedTasks:links.length,detached:links.length};
  };
  return args.dryRun===true?plan(api):taskTransaction(db,api,plan);
}
export function membershipAction(db,args,origin,api,detach=false) {
  return taskTransaction(db,api,buffered=>{
    const taskId=String(args.taskId??'');
    if(!taskId || !db.prepare('SELECT id FROM task WHERE id=? AND deleted_at IS NULL').get(taskId)) throw timelineError('TASK_NOT_FOUND','任务不存在：'+taskId);
    const id=detach?null:timelineIdArg(args);
    const changed=setMembership(db,taskId,id,origin,buffered);
    return {taskId,timelineId:id,timelineKey:id,changed};
  });
}
export function registerEntityTimelineActions(api) {
  const input=properties=>({type:'object',properties});
  const identified=properties=>({...input({...TIMELINE_ID_SCHEMA,...properties}),anyOf:TIMELINE_ID_REQUIRED});
  api.action('taskTimelines.create',{description:'独立手动创建空时间线；不自动添加任务，同 id 墓碑不能隐式恢复。',input:input({id:{type:['string','number']},title:{type:'string'},description:{type:'string'}}),execute:(args,ctx)=>createTimeline(api.db,args||{},ctx.origin,api)});
  api.action('taskTimelines.get',{description:'读取有效时间线实体，空线也可读取；未知/已删除返回明确错误。',input:identified({}),execute:args=>({timeline:timelineOut(requireTimeline(api.db,timelineIdArg(args||{})))})});
  api.action('taskTimelines.update',{description:'仅修改时间线标题/描述；相同值不更新版本，不修改成员任务。',input:identified({title:{type:'string'},description:{type:'string'}}),execute:(args,ctx)=>updateTimeline(api.db,args||{},ctx.origin,api)});
  api.action('taskTimelines.delete',{description:'软删除时间线并同事务移出所有成员，旧兼容列清空，任务和重启链保留；dryRun 不写入。',input:identified({dryRun:{type:'boolean',default:false}}),execute:(args,ctx)=>deleteTimeline(api.db,args||{},ctx.origin,api)});
  api.action('taskTimelines.attach',{description:'把已有任务加入已有有效时间线或换线；复用确定 link.id=taskId，重复加入幂等，双写旧兼容列。',input:{...identified({taskId:{type:['string','number']}}),required:['taskId']},execute:(args,ctx)=>membershipAction(api.db,args||{},ctx.origin,api)});
  api.action('taskTimelines.detach',{description:'软删任务的成员关系并清空旧兼容列，保留任务与空线；重复移出幂等。',input:{...input({taskId:{type:['string','number']}}),required:['taskId']},execute:(args,ctx)=>membershipAction(api.db,args||{},ctx.origin,api,true)});
  api.action('taskTimelines.migrate',{description:'审阅历史分组；默认 dryRun 且零回填。apply 必须明确 dryRun=false、approvedKeys 与最新 snapshotHash，仅补缺失实体/成员，冲突整批回滚，不覆盖已有实体/归属/墓碑。',input:{...input({dryRun:{type:'boolean',default:true},approvedKeys:{type:'array',items:{type:'string'}},snapshotHash:{type:'string'}}),if:{properties:{dryRun:{const:false}},required:['dryRun']},then:{required:['approvedKeys','snapshotHash']}},execute:(args,ctx)=>migrateTimelines(api.db,args||{},ctx.origin,api)});
}
