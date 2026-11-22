/** 邮件域数据层：账户、文件夹、邮件、附件；密码只存 vault secretId。 */
import { ensureDraftSchema } from "./drafts.js";
import { ensureDeliverySchema } from "./delivery.js";
let clock = () => Date.now();
export function bindClock(fn) { clock = typeof fn === "function" ? fn : () => Date.now(); }
export function now() { return clock(); }
export function newId(p) { return p + "_" + now().toString(36) + Math.random().toString(36).slice(2, 8); }
const DDL = [
  `CREATE TABLE IF NOT EXISTS mail_account (id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL, account_set_id TEXT NOT NULL DEFAULT '', imap_host TEXT NOT NULL, imap_port INTEGER NOT NULL DEFAULT 993, imap_tls INTEGER NOT NULL DEFAULT 1, smtp_host TEXT NOT NULL, smtp_port INTEGER NOT NULL DEFAULT 465, smtp_tls INTEGER NOT NULL DEFAULT 1, username TEXT NOT NULL DEFAULT '', secret_id TEXT NOT NULL DEFAULT '', enabled INTEGER NOT NULL DEFAULT 1, created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL, deleted_at INTEGER, rev INTEGER NOT NULL DEFAULT 1)`,
  `CREATE TABLE IF NOT EXISTS mail_mailbox (id TEXT PRIMARY KEY, account_id TEXT NOT NULL, name TEXT NOT NULL, delimiter TEXT NOT NULL DEFAULT '/', role TEXT NOT NULL DEFAULT '', updated_at INTEGER NOT NULL, UNIQUE(account_id, name))`,
  `CREATE TABLE IF NOT EXISTS mail_message (id TEXT PRIMARY KEY, account_id TEXT NOT NULL, mailbox TEXT NOT NULL, uid INTEGER NOT NULL, message_id TEXT NOT NULL DEFAULT '', subject TEXT NOT NULL DEFAULT '', from_addr TEXT NOT NULL DEFAULT '', from_name TEXT NOT NULL DEFAULT '', to_addr TEXT NOT NULL DEFAULT '', cc_addr TEXT NOT NULL DEFAULT '', date_at INTEGER NOT NULL, preview TEXT NOT NULL DEFAULT '', body TEXT NOT NULL DEFAULT '', body_at INTEGER NOT NULL DEFAULT 0, html TEXT NOT NULL DEFAULT '', html_at INTEGER NOT NULL DEFAULT 0, flags TEXT NOT NULL DEFAULT '', created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL, UNIQUE(account_id, mailbox, uid))`,
  `CREATE TABLE IF NOT EXISTS mail_attachment (id TEXT PRIMARY KEY, message_id TEXT NOT NULL, filename TEXT NOT NULL, mime TEXT NOT NULL DEFAULT '', size INTEGER NOT NULL DEFAULT 0, content_id TEXT NOT NULL DEFAULT '', inline INTEGER NOT NULL DEFAULT 0)`,
  "CREATE INDEX IF NOT EXISTS idx_mail_msg_box ON mail_message(account_id, mailbox, date_at)",
  "CREATE INDEX IF NOT EXISTS idx_mail_attachment_message ON mail_attachment(message_id)",
  "CREATE INDEX IF NOT EXISTS idx_mail_msg_search ON mail_message(subject)",
];
function hasColumn(db, table, column) {
  return db.prepare("PRAGMA table_info(" + table + ")").all().some((c) => c.name === column);
}
export function ensureSchema(db) {
  for (const sql of DDL) db.exec(sql);
  ensureDraftSchema(db);
  ensureDeliverySchema(db);
  for (const [table, column, type] of [
    // 0.6.0 起账户先绑一个「集合与账号」，邮箱地址由集合的账号带出。
    ["mail_account", "account_set_id", "TEXT NOT NULL DEFAULT ''"],
    ["mail_message", "body_truncated", "INTEGER NOT NULL DEFAULT 0"],
    ["mail_message", "uid_validity", "INTEGER NOT NULL DEFAULT 0"],
    ["mail_message", "reply_to", "TEXT NOT NULL DEFAULT ''"],
    ["mail_message", "thread_refs", "TEXT NOT NULL DEFAULT ''"],
    ["mail_attachment", "section", "TEXT NOT NULL DEFAULT ''"],
    // 0.5.0 起正文里的 HTML 单独落库：html_at>0 表示解析过 HTML（可能是空串），
    // 老缓存 html_at=0 会被当成"没解析过富文本"重拉一次，之后走本地缓存。
    ["mail_message", "html", "TEXT NOT NULL DEFAULT ''"],
    ["mail_message", "html_at", "INTEGER NOT NULL DEFAULT 0"],
    // Content-ID 用于把 cid: 内联图映射回本地附件分段；inline 标记 BODYSTRUCTURE 的 inline。
    ["mail_attachment", "content_id", "TEXT NOT NULL DEFAULT ''"],
    ["mail_attachment", "inline", "INTEGER NOT NULL DEFAULT 0"],
  ]) {
    if (!hasColumn(db, table, column)) db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${type}`);
  }
  // 0.2.3 起 from_name 单独存发件人显示名（from_addr 只放地址）：老库的 CREATE TABLE IF NOT EXISTS 不会补列。
  if (!hasColumn(db, "mail_message", "from_name")) {
    db.exec("ALTER TABLE mail_message ADD COLUMN from_name TEXT NOT NULL DEFAULT ''");
  }
  // 0.2.5 起 body_at 记录正文下载时间：0 表示还没拉过，重复打开不再重复联网。
  if (!hasColumn(db, "mail_message", "body_at")) {
    db.exec("ALTER TABLE mail_message ADD COLUMN body_at INTEGER NOT NULL DEFAULT 0");
  }
}
export function accountRow(r) { return r ? { id: r.id, name: r.name, email: r.email, accountSetId: r.account_set_id || "", imapHost: r.imap_host, imapPort: r.imap_port, imapTls: !!r.imap_tls, smtpHost: r.smtp_host, smtpPort: r.smtp_port, smtpTls: !!r.smtp_tls, username: r.username, secretId: r.secret_id, enabled: !!r.enabled, createdAt: r.created_at, updatedAt: r.updated_at } : null; }
export function messageRow(r) { return r ? { id: r.id, accountId: r.account_id, mailbox: r.mailbox, uid: r.uid, uidValidity: r.uid_validity, replyTo: r.reply_to, references: r.thread_refs, messageId: r.message_id, subject: r.subject, from: r.from_addr, fromName: r.from_name, to: r.to_addr, cc: r.cc_addr, dateAt: r.date_at, preview: r.preview, body: r.body, bodyAt: r.body_at, bodyTruncated: !!r.body_truncated, flags: r.flags, createdAt: r.created_at } : null; }
