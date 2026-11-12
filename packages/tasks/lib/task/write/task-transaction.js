import { ownershipError } from '../model/task-ownership-path.js';
/** 事务期间只收集事件；成功 COMMIT 后通知，失败/dryRun 不发送。 */
export function taskTransaction(db, api, body, dryRun = false) {
  const events = [], buffered = Object.create(api);
  buffered.emit = (kind,payload) => events.push([kind,payload]);
  let begun = false, result;
  try {
    db.exec('BEGIN IMMEDIATE'); begun = true;
    result = body(buffered);
    db.exec(dryRun ? 'ROLLBACK' : 'COMMIT'); begun = false;
  } catch (error) {
    if (begun) { try { db.exec('ROLLBACK'); } catch {} }
    if (/SQLITE_BUSY|database is locked/.test(String(error.message))) throw ownershipError('DATABASE_BUSY', '数据库繁忙，请稍后以相同 dedupeKey 重试', { retryable: true });
    throw error;
  }
  if (!dryRun) for (const [kind,payload] of events) api.emit(kind,payload);
  return result;
}
