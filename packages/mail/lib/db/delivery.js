export function ensureDeliverySchema(db) {
  db.exec(`CREATE TABLE IF NOT EXISTS mail_delivery (
    id TEXT PRIMARY KEY, account_id TEXT NOT NULL, message_id TEXT NOT NULL,
    status TEXT NOT NULL, payload TEXT NOT NULL, reason TEXT NOT NULL DEFAULT '',
    created_at INTEGER NOT NULL
  ); CREATE INDEX IF NOT EXISTS idx_mail_delivery_date ON mail_delivery(created_at DESC)`);
}
