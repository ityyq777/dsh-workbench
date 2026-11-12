import { logChange, now } from '../db/db-core.js';
export { TIMELINE_DDL } from "../db/timeline-schema.js";
export function timelineError(code, message, details = {}) { return Object.assign(new Error(message), {code, ...details}); }
export function timelineIdArg(args, required = true) {
  const a = args.timelineId == null ? null : String(args.timelineId);
  const b = args.timelineKey == null ? null : String(args.timelineKey);
  if (a !== null && b !== null && a !== b) throw timelineError('TIMELINE_PARAMETER_CONFLICT','timelineId 与 timelineKey 不一致');
  const id = a ?? b;
  if (required && !id) throw timelineError('TIMELINE_ID_REQUIRED','必须提供 timelineId（兼容 timelineKey）');
  return id || null;
}
export function requireTimeline(db, id) {
  const row = db.prepare('SELECT * FROM task_timeline WHERE id=?').get(String(id));
  if (!row) throw timelineError('TIMELINE_NOT_FOUND','时间线不存在：' + id);
  if (row.deleted_at !== null) throw timelineError('TIMELINE_DELETED','时间线已删除：' + id);
  return row;
}
export function activeTimeline(db, taskId) {
  return db.prepare('SELECT e.* FROM task_timeline e JOIN task_timeline_link l ON l.timeline_id=e.id JOIN task t ON t.id=l.task_id WHERE l.task_id=? AND l.deleted_at IS NULL AND e.deleted_at IS NULL AND t.deleted_at IS NULL').get(String(taskId)) || null;
}
export function timelineOut(row) {
  return {id:row.id,timelineId:row.id,timelineKey:row.id,title:row.title,description:row.description,createdAt:row.created_at,updatedAt:row.updated_at,deletedAt:row.deleted_at,rev:row.rev};
}
export function timelineChange(db, table, row, origin, api, op = 'update') {
  logChange(db,table,row.id,op,row,origin,row.updated_at);
  api.emit('tasks-changed',{id:row.id,op});
  api.emit('task-timelines-changed',{id:row.id,op});
}
export function touchTimelines(db, ids, origin, api, ts = now()) {
  for (const id of new Set(ids)) {
    if (!id) continue;
    const row = db.prepare('SELECT * FROM task_timeline WHERE id=? AND deleted_at IS NULL').get(id);
    if (!row) continue;
    row.updated_at=ts; row.rev++;
    db.prepare('UPDATE task_timeline SET updated_at=?,rev=? WHERE id=?').run(ts,row.rev,id);
    timelineChange(db,'task_timeline',row,origin,api);
  }
}
// Caller owns the transaction. A shared touched set batches entity rev changes.
export function setMembership(db, taskId, timelineId, origin, api, {ts=now(), touched, project=true} = {}) {
  if (timelineId !== null) requireTimeline(db,timelineId);
  const old = db.prepare('SELECT * FROM task_timeline_link WHERE task_id=?').get(String(taskId));
  if ((!old || old.deleted_at !== null) && timelineId === null) return false;
  if (old && old.deleted_at === null && old.timeline_id === timelineId) return false;
  const row = {id:String(taskId),task_id:String(taskId),timeline_id:timelineId ?? old.timeline_id,created_at:old?.created_at ?? ts,updated_at:ts,deleted_at:timelineId === null ? ts : null,rev:(old?.rev ?? 0)+1};
  db.prepare('INSERT INTO task_timeline_link(id,task_id,timeline_id,created_at,updated_at,deleted_at,rev) VALUES(?,?,?,?,?,?,?) ON CONFLICT(task_id) DO UPDATE SET timeline_id=excluded.timeline_id,updated_at=excluded.updated_at,deleted_at=excluded.deleted_at,rev=excluded.rev').run(...Object.values(row));
  timelineChange(db,'task_timeline_link',row,origin,api,old?'update':'create');
  if (project) {
    db.prepare('UPDATE task SET timeline_key=?,updated_at=?,rev=rev+1 WHERE id=?').run(timelineId,ts,String(taskId));
    const task = db.prepare('SELECT * FROM task WHERE id=?').get(String(taskId));
    if (task) { logChange(db,'task',task.id,'update',task,origin,ts); api.emit('tasks-changed',{id:task.id,op:'update'}); }
  }
  const ids = [old?.deleted_at === null ? old.timeline_id : null,timelineId];
  if (touched) { for(const id of ids) if(id) touched.add(id); }
  else touchTimelines(db,ids,origin,api,ts);
  return true;
}
