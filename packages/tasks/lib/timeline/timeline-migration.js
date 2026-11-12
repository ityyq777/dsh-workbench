import { createHash } from 'node:crypto';
import { metaSet } from '../db/db.js';
import { taskTransaction } from '../task/write/task-transaction.js';
import { timelineError, timelineChange } from './timeline-store.js';
// The same pure classifier drives preview and apply. No startup backfill.
export function classifyTimelineHistory(rows) {
  const groups=new Map(),invalid=[];
  for(const row of rows) {
    const key=row.timeline_key;
    if(key===null || key===undefined || String(key)==='') {invalid.push(row);continue;}
    const id=String(key); if(!groups.has(id)) groups.set(id,[]); groups.get(id).push(row);
  }
  return {invalid,groups:[...groups].map(([key,members])=>({key,members,classification:members.length===1&&String(members[0].id)===key?'ambiguousSelfId':'legacyGrouped',restartOnlyCandidate:members.length>1&&new Set(members.map(r=>r.restart_key)).size===1}))};
}
function syncReviewCandidates(db) {
  return db.prepare("SELECT k,v FROM meta WHERE substr(k,1,?)=? ORDER BY k").all('task_timeline_migration:sync-candidate:'.length,'task_timeline_migration:sync-candidate:').map(row=>{
    try {
      const value=JSON.parse(row.v);
      if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('invalid candidate');
      return {recordKey:row.k,taskId:value.taskId,timelineKey:value.timelineKey,updatedAt:value.updatedAt,reason:value.reason,requiresApproval:true,approved:false};
    } catch { return {recordKey:row.k,reason:'INVALID_SYNC_CANDIDATE',raw:row.v,requiresApproval:true,approved:false}; }
  });
}
function plan(db,args) {
  const rows=db.prepare('SELECT * FROM task ORDER BY id').all();
  const entities=db.prepare('SELECT * FROM task_timeline ORDER BY id').all();
  const links=db.prepare('SELECT * FROM task_timeline_link ORDER BY id').all();
  const snapshotHash=createHash('sha256').update(JSON.stringify({rows,entities,links})).digest('hex');
  if(args.approvedKeys!==undefined && (!Array.isArray(args.approvedKeys)||args.approvedKeys.some(k=>typeof k!=='string'||!k))) throw timelineError('MIGRATION_APPROVAL_INVALID','approvedKeys 必须为非空字符串数组');
  const approved=new Set(args.approvedKeys||[]),classified=classifyTimelineHistory(rows),pendingEntities=[],pendingLinks=[],conflicts=[];
  let existingIdentical=0;
  for(const key of approved) if(!classified.groups.some(g=>g.key===key)) conflicts.push({key,reason:'UNKNOWN_APPROVED_KEY'});
  for(const group of classified.groups) {
    if(!approved.has(group.key)) continue;
    const members=group.members,live=members.filter(r=>r.deleted_at===null).sort((left,right)=>String(left.publish_date).localeCompare(String(right.publish_date))||String(left.id).localeCompare(String(right.id)));
    const created=Math.min(...members.map(r=>r.created_at)),updated=Math.max(...members.map(r=>r.updated_at));
    const entity={id:group.key,title:live[0]?.title||'未命名时间线',description:'',created_at:created,updated_at:updated,deleted_at:live.length?null:updated,rev:1};
    const old=entities.find(e=>e.id===group.key);
    if(old) {
      if(Object.keys(entity).every(k=>old[k]===entity[k])) existingIdentical++;
      else conflicts.push({key:group.key,reason:'ENTITY_ALREADY_CHANGED'});
    } else pendingEntities.push(entity);
    for(const task of members) {
      const link={id:task.id,task_id:task.id,timeline_id:group.key,created_at:task.created_at,updated_at:task.updated_at,deleted_at:task.deleted_at,rev:1};
      const oldLink=links.find(l=>l.task_id===task.id);
      if(oldLink) {
        if(Object.keys(link).every(k=>oldLink[k]===link[k])) existingIdentical++;
        else conflicts.push({key:group.key,taskId:task.id,reason:'MEMBERSHIP_ALREADY_CHANGED'});
      } else pendingLinks.push(link);
    }
  }
  const report={dryRun:true,snapshotHash,scanned:rows.length,live:rows.filter(r=>r.deleted_at===null).length,deleted:rows.filter(r=>r.deleted_at!==null).length,distinctKeys:classified.groups.length,ordinaryOrAmbiguousSelf:classified.groups.filter(g=>g.classification==='ambiguousSelfId').length,approvedSelf:classified.groups.filter(g=>g.classification==='ambiguousSelfId'&&approved.has(g.key)).length,legacyGrouped:classified.groups.filter(g=>g.classification==='legacyGrouped').length,restartOnlyCandidates:classified.groups.filter(g=>g.restartOnlyCandidate).length,emptyInvalidKeys:classified.invalid.map(r=>({id:r.id,key:r.timeline_key})),wouldCreateTimelines:pendingEntities.length,wouldCreateLiveLinks:pendingLinks.filter(l=>l.deleted_at===null).length,wouldCreateTombstoneLinks:pendingLinks.filter(l=>l.deleted_at!==null).length,existingIdentical,conflicts,skipped:classified.groups.filter(g=>!approved.has(g.key)).length,wouldLog:pendingEntities.length+pendingLinks.length,sourceCount:rows.length,targetCount:{timelines:entities.length,links:links.length},candidates:classified.groups.map(g=>({key:g.key,classification:g.classification,restartOnlyCandidate:g.restartOnlyCandidate,approved:approved.has(g.key),members:g.members.map(r=>({id:r.id,timelineKey:r.timeline_key,createdAt:r.created_at,updatedAt:r.updated_at,rev:r.rev,deletedAt:r.deleted_at}))}))};
  // Sync hints are review-only, never merged into historical approvedKeys or the apply plan.
  report.syncCandidates=syncReviewCandidates(db);
  return {report,pendingEntities,pendingLinks};
}
export function migrateTimelines(db,args,origin,api) {
  if(args.dryRun!==false) return plan(db,args).report;
  if(!Array.isArray(args.approvedKeys)||!args.snapshotHash) throw timelineError('MIGRATION_APPROVAL_REQUIRED','apply 必须明确 approvedKeys 和 snapshotHash');
  return taskTransaction(db,api,buffered=>{
    const {report,pendingEntities,pendingLinks}=plan(db,args);
    if(report.snapshotHash!==args.snapshotHash) throw timelineError('MIGRATION_SNAPSHOT_CHANGED','快照已变化，请重新 dryRun');
    if(report.conflicts.length) throw timelineError('MIGRATION_CONFLICT','存在冲突，未写入',{conflicts:report.conflicts});
    for(const row of pendingEntities) {db.prepare('INSERT INTO task_timeline(id,title,description,created_at,updated_at,deleted_at,rev) VALUES(?,?,?,?,?,?,?)').run(...Object.values(row));timelineChange(db,'task_timeline',row,origin,buffered,'create');}
    for(const row of pendingLinks) {db.prepare('INSERT INTO task_timeline_link(id,task_id,timeline_id,created_at,updated_at,deleted_at,rev) VALUES(?,?,?,?,?,?,?)').run(...Object.values(row));timelineChange(db,'task_timeline_link',row,origin,buffered,'create');}
    const result={...report,dryRun:false,createdTimelines:pendingEntities.length,createdLinks:pendingLinks.length,migrationVersion:1,createdEntityIds:pendingEntities.map(r=>r.id),createdLinkIds:pendingLinks.map(r=>r.id)};
    if(pendingEntities.length||pendingLinks.length) metaSet(db,'task_timeline_migration:'+report.snapshotHash,JSON.stringify(result));
    return result;
  });
}
