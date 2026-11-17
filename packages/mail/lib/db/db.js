/** 邮件域数据层：账户、文件夹、邮件、附件；密码只存 vault secretId。 */
let clock = () => Date.now();
export function bindClock(fn) { clock = typeof fn === "function" ? fn : () => Date.now(); }
export function now() { return clock(); }
export function newId(p) { return p + "_" + now().toString(36) + Math.random().toString(36).slice(2, 8); }
const DDL = [
  `CREATE TABLE IF NOT EXISTS mail_account (id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL, imap_host TEXT NOT NULL, imap_port INTEGER NOT NULL DEFAULT 993, imap_tls INTEGER NOT NULL DEFAULT 1, smtp_host TEXT NOT NULL, smtp_port INTEGER NOT NULL DEFAULT 465, smtp_tls INTEGER NOT NULL DEFAULT 1, username TEXT NOT NULL DEFAULT '', secret_id TEXT NOT NULL DEFAULT '', enabled INTEGER NOT NULL DEFAULT 1, created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL, deleted_at INTEGER, rev INTEGER NOT NULL DEFAULT 1)`,
  `CREATE TABLE IF NOT EXISTS mail_mailbox (id TEXT PRIMARY KEY, account_id TEXT NOT NULL, name TEXT NOT NULL, delimiter TEXT NOT NULL DEFAULT '/', role TEXT NOT NULL DEFAULT '', updated_at INTEGER NOT NULL, UNIQUE(account_id, name))`,
  `CREATE TABLE IF NOT EXISTS mail_message (id TEXT PRIMARY KEY, account_id TEXT NOT NULL, mailbox TEXT NOT NULL, uid INTEGER NOT NULL, message_id TEXT NOT NULL DEFAULT '', subject TEXT NOT NULL DEFAULT '', from_addr TEXT NOT NULL DEFAULT '', to_addr TEXT NOT NULL DEFAULT '', cc_addr TEXT NOT NULL DEFAULT '', date_at INTEGER NOT NULL, preview TEXT NOT NULL DEFAULT '', body TEXT NOT NULL DEFAULT '', flags TEXT NOT NULL DEFAULT '', created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL, UNIQUE(account_id, mailbox, uid))`,
  `CREATE TABLE IF NOT EXISTS mail_attachment (id TEXT PRIMARY KEY, message_id TEXT NOT NULL, filename TEXT NOT NULL, mime TEXT NOT NULL DEFAULT '', size INTEGER NOT NULL DEFAULT 0)`,
  "CREATE INDEX IF NOT EXISTS idx_mail_msg_box ON mail_message(account_id, mailbox, date_at)",
  "CREATE INDEX IF NOT EXISTS idx_mail_msg_search ON mail_message(subject)",
];
export function ensureSchema(db) { for (const sql of DDL) db.exec(sql); }
export function accountRow(r) { return r ? { id: r.id, name: r.name, email: r.email, imapHost: r.imap_host, imapPort: r.imap_port, imapTls: !!r.imap_tls, smtpHost: r.smtp_host, smtpPort: r.smtp_port, smtpTls: !!r.smtp_tls, username: r.username, secretId: r.secret_id, enabled: !!r.enabled, createdAt: r.created_at, updatedAt: r.updated_at } : null; }
export function messageRow(r) { return r ? { id: r.id, accountId: r.account_id, mailbox: r.mailbox, uid: r.uid, messageId: r.message_id, subject: r.subject, from: r.from_addr, to: r.to_addr, cc: r.cc_addr, dateAt: r.date_at, preview: r.preview, body: r.body, flags: r.flags, createdAt: r.created_at } : null; }
