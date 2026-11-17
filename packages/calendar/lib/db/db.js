/** 日历域数据层。事件时间存 UTC 毫秒，另存 IANA 时区；RRULE 只存原文。 */
let clock = () => Date.now();
export function bindClock(fn) { clock = typeof fn === "function" ? fn : () => Date.now(); }
export function now() { return clock(); }
export function newId(prefix) { return prefix + "_" + now().toString(36) + Math.random().toString(36).slice(2, 8); }
const DDL = [
  `CREATE TABLE IF NOT EXISTS calendar (id TEXT PRIMARY KEY, name TEXT NOT NULL, color TEXT NOT NULL DEFAULT '', tz TEXT NOT NULL DEFAULT 'Asia/Shanghai', created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL, deleted_at INTEGER, rev INTEGER NOT NULL DEFAULT 1)`,
  `CREATE TABLE IF NOT EXISTS calendar_event (id TEXT PRIMARY KEY, calendar_id TEXT NOT NULL, title TEXT NOT NULL, description TEXT NOT NULL DEFAULT '', location TEXT NOT NULL DEFAULT '', start_at INTEGER NOT NULL, end_at INTEGER NOT NULL, all_day INTEGER NOT NULL DEFAULT 0, tz TEXT NOT NULL DEFAULT 'Asia/Shanghai', rrule TEXT NOT NULL DEFAULT '', status TEXT NOT NULL DEFAULT 'confirmed', created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL, deleted_at INTEGER, rev INTEGER NOT NULL DEFAULT 1)`,
  `CREATE TABLE IF NOT EXISTS calendar_attendee (id TEXT PRIMARY KEY, event_id TEXT NOT NULL, name TEXT NOT NULL DEFAULT '', email TEXT NOT NULL DEFAULT '', role TEXT NOT NULL DEFAULT 'required', status TEXT NOT NULL DEFAULT 'needs-action')`,
  `CREATE TABLE IF NOT EXISTS calendar_reminder (id TEXT PRIMARY KEY, event_id TEXT NOT NULL, minutes_before INTEGER NOT NULL DEFAULT 15, channel TEXT NOT NULL DEFAULT 'message', enabled INTEGER NOT NULL DEFAULT 1, created_at INTEGER NOT NULL)`,
  "CREATE INDEX IF NOT EXISTS idx_event_start ON calendar_event(start_at)",
  "CREATE INDEX IF NOT EXISTS idx_event_calendar ON calendar_event(calendar_id)",
];
export function ensureSchema(db) { for (const sql of DDL) db.exec(sql); }
export function calRow(r) { return r ? { id: r.id, name: r.name, color: r.color, tz: r.tz, createdAt: r.created_at, updatedAt: r.updated_at } : null; }
export function eventRow(r) {
  if (!r) return null;
  return { id: r.id, calendarId: r.calendar_id, title: r.title, description: r.description, location: r.location, startAt: r.start_at, endAt: r.end_at, allDay: !!r.all_day, tz: r.tz, rrule: r.rrule, status: r.status, createdAt: r.created_at, updatedAt: r.updated_at };
}
