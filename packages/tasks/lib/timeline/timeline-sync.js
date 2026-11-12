/** Legacy keys are candidates only. Membership comes exclusively from stable link rows. */
function fail(code) { throw Object.assign(new Error(code), { code }); }
function projectTask(db, id) {
  const link = db.prepare('SELECT * FROM task_timeline_link WHERE task_id=?').get(id);
  if (!link) return; // preserve unapproved historical candidates
  const live = db.prepare('SELECT e.id FROM task_timeline e JOIN task_timeline_link l ON l.timeline_id=e.id JOIN task t ON t.id=l.task_id WHERE l.task_id=? AND e.deleted_at IS NULL AND l.deleted_at IS NULL AND t.deleted_at IS NULL').get(id);
  db.prepare('UPDATE task SET timeline_key=? WHERE id=?').run(live?.id ?? null, id);
}
export function normalizeTimelineTask({db,row,local}) {
  const result = {...row};
  // 旧客户端仍可能发送已删除的任务手动排序列。
  delete result.sort;
  const hasTimelineKey = Object.hasOwn(row, "timeline_key");
  if (!hasTimelineKey && local) result.timeline_key = local.timeline_key;
  // 旧客户端不认识接取列：incoming 缺这三列时保留本地值，绝不用 undefined 清空；
  // 显式传 null 视为新值（例如对方已释放），交给整行覆盖逻辑。
  for (const column of ["owner", "claimed_at", "claim_token"]) {
    if (!Object.hasOwn(row, column) && local) result[column] = local[column];
  }
  // Derived fields are not persisted as task columns. Never use them to create membership.
  delete result.timeline_id; delete result.timelineId; delete result.timelineKey;
  const link = db.prepare('SELECT * FROM task_timeline_link WHERE task_id=?').get(row.id);
  if (link) {
    // Incoming dual writes can precede the corresponding link update; the link remains authoritative.
    const entity = db.prepare('SELECT deleted_at FROM task_timeline WHERE id=?').get(link.timeline_id);
    result.timeline_key = row.deleted_at == null && link.deleted_at == null && entity && entity.deleted_at == null ? link.timeline_id : null;
    if (hasTimelineKey && row.timeline_key !== result.timeline_key && (!local || Number(row.updated_at) >= Number(local.updated_at))) {
      // Keep the incoming hint for explicit review; do not silently reinterpret it as membership.
      const key = "task_timeline_migration:sync-candidate:" + JSON.stringify([row.id,row.updated_at,row.timeline_key ?? null]);
      const value = JSON.stringify({taskId:row.id,timelineKey:row.timeline_key ?? null,updatedAt:row.updated_at,reason:"INCOMING_KEY_DIFFERS_FROM_LINK",requiresApproval:true});
      db.prepare("INSERT INTO meta(k,v) VALUES(?,?) ON CONFLICT(k) DO NOTHING").run(key,value);
    }
  }
  return result;
}
export function normalizeTimelineLink({row}) {
  if (typeof row.id !== 'string' || !row.id || row.id !== row.task_id) fail('TIMELINE_LINK_ID_MISMATCH');
  if (typeof row.timeline_id !== 'string' || !row.timeline_id) fail('TIMELINE_REFERENCE_INVALID');
  // Out-of-order parents are retained but hidden by activeTimeline's three-way live join.
  return row;
}
export function afterTimelineTask({db,row}) { projectTask(db,row.id); }
export function afterTimelineLink({db,row}) { projectTask(db,row.task_id); }
export function afterTimelineEntity({db,row}) {
  for (const link of db.prepare('SELECT task_id FROM task_timeline_link WHERE timeline_id=?').all(row.id)) projectTask(db,link.task_id);
}
