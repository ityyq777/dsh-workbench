/** 联系人域数据层：联系人、分组、多值字段、分组成员。 */
let clock = () => Date.now();
export function bindClock(fn) { clock = typeof fn === "function" ? fn : () => Date.now(); }
export function now() { return clock(); }
export function newId(prefix) { return prefix + "_" + now().toString(36) + Math.random().toString(36).slice(2, 8); }

const DDL = [
  `CREATE TABLE IF NOT EXISTS contact (
    id TEXT PRIMARY KEY, name TEXT NOT NULL, org TEXT NOT NULL DEFAULT '', title TEXT NOT NULL DEFAULT '',
    note TEXT NOT NULL DEFAULT '', birthday TEXT NOT NULL DEFAULT '',
    created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL, deleted_at INTEGER, rev INTEGER NOT NULL DEFAULT 1
  )`,
  `CREATE TABLE IF NOT EXISTS contact_group (
    id TEXT PRIMARY KEY, name TEXT NOT NULL, color TEXT NOT NULL DEFAULT '',
    created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL, deleted_at INTEGER, rev INTEGER NOT NULL DEFAULT 1
  )`,
  `CREATE TABLE IF NOT EXISTS contact_field (
    id TEXT PRIMARY KEY, contact_id TEXT NOT NULL, kind TEXT NOT NULL, label TEXT NOT NULL DEFAULT '',
    value TEXT NOT NULL, primary_flag INTEGER NOT NULL DEFAULT 0, sort INTEGER NOT NULL DEFAULT 0
  )`,
  `CREATE TABLE IF NOT EXISTS contact_group_member (
    id TEXT PRIMARY KEY, group_id TEXT NOT NULL, contact_id TEXT NOT NULL, created_at INTEGER NOT NULL,
    UNIQUE(group_id, contact_id)
  )`,
  "CREATE INDEX IF NOT EXISTS idx_contact_name ON contact(name)",
  "CREATE INDEX IF NOT EXISTS idx_contact_updated ON contact(updated_at)",
  "CREATE INDEX IF NOT EXISTS idx_contact_field ON contact_field(contact_id)",
  "CREATE INDEX IF NOT EXISTS idx_contact_group_member ON contact_group_member(contact_id)",
];

export function ensureSchema(db) {
  for (const sql of DDL) db.exec(sql);
}

export function contactRow(row) {
  if (!row) return null;
  return { id: row.id, name: row.name, org: row.org, title: row.title, note: row.note, birthday: row.birthday, createdAt: row.created_at, updatedAt: row.updated_at };
}
export function groupRow(row) {
  if (!row) return null;
  return { id: row.id, name: row.name, color: row.color, createdAt: row.created_at, updatedAt: row.updated_at };
}
