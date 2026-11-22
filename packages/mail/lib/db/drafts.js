export function ensureDraftSchema(db) {
  db.exec('CREATE TABLE IF NOT EXISTS mail_draft (key TEXT PRIMARY KEY, payload TEXT NOT NULL, updated_at INTEGER NOT NULL)');
}
