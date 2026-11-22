import { test } from "node:test";
import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
const { ensureSchema } = await import("../lib/db/db.js");
const { createMail } = await import("../lib/domain/mail.js");

function make() {
  const db = new DatabaseSync(":memory:"); ensureSchema(db);
  const calls = [];
  const host = { call: async (n, a, o) => { calls.push([n, a, o]); return { result: { secret: "pw" } }; } };
  return { db, calls, m: createMail({ db, host, log: () => {} }) };
}
function seedMessage(db, accountId) {
  db.prepare("INSERT INTO mail_message (id,account_id,mailbox,uid,subject,from_addr,date_at,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?)").run("msg1", accountId, "INBOX", 1, "你好", "a@b.test", 1000, 1000, 1000);
}

test("账户 CRUD 与状态", () => {
  const { m } = make();
  const a = m.createAccount({ name: "主邮箱", email: "me@test", imapHost: "imap.test", smtpHost: "smtp.test", secretId: "sec1" });
  assert.equal(a.name, "主邮箱");
  assert.equal(m.status().accounts, 1);
  const u = m.updateAccount({ id: a.id, name: "改名" });
  assert.equal(u.name, "改名");
  m.deleteAccount(a.id);
  assert.equal(m.listAccounts().items.length, 0);
});

test("账户绑定账号集合：account_set_id 落库、回显，改其它字段不清集合", () => {
  const { m } = make();
  const a = m.createAccount({ name: "A", email: "a@test", accountSetId: "set_1", imapHost: "i", smtpHost: "s" });
  assert.equal(a.accountSetId, "set_1");
  assert.equal(m.updateAccount({ id: a.id, accountSetId: "set_2" }).accountSetId, "set_2");
  assert.equal(m.updateAccount({ id: a.id, name: "改名" }).accountSetId, "set_2");
  assert.equal(m.listAccounts().items[0].accountSetId, "set_2");
});

test("远端邮件不能在没有凭据时假装已读、移动或删除", async () => {
  const { m, db } = make();
  const a = m.createAccount({ name: "A", email: "a@test", imapHost: "i", smtpHost: "s" });
  seedMessage(db, a.id);
  assert.equal(m.messages({}).items.length, 1);
  assert.equal(m.messages({ q: "你好" }).items.length, 1);
  await assert.rejects(() => m.markRead({ id: "msg1" }));
  await assert.rejects(() => m.move({ id: "msg1", mailbox: "Archive" }));
  await assert.rejects(() => m.remove({ id: "msg1" }));
  assert.equal(m.messages({ unread: true }).items.length, 1);
  assert.equal(m.message("msg1").mailbox, "INBOX");
});

test("已有远端缓存的账户可以轮换凭据，但不能把旧 UID 改绑到新邮箱", () => {
  const { db, m } = make();
  const a = m.createAccount({ name: "A", email: "a@test", imapHost: "imap.test" });
  seedMessage(db, a.id);
  for (const patch of [{ imapHost: "other.test" }, { username: "other" }, { imapPort: 1993 }]) {
    assert.throws(() => m.updateAccount({ id: a.id, ...patch }), /新建账户/);
  }
  assert.equal(m.updateAccount({ id: a.id, secretId: "rotated" }).secretId, "rotated");
});

test("消息详情与 dataQuery 白名单", () => {
  const { m, db } = make();
  const a = m.createAccount({ name: "A", email: "a@test", imapHost: "i", smtpHost: "s" });
  seedMessage(db, a.id);
  assert.equal(m.message("msg1").subject, "你好");
  assert.equal(m.dataQuery({ table: "mail_message" }).rows.length, 1);
  assert.throws(() => m.dataQuery({ table: "sqlite_master" }), /不允许/);
  assert.throws(() => m.message("nope"), /不存在/);
});

test("正文按需下载：本地已缓存时不重复联网，本地副本直接返回", async () => {
  const { m, db, calls } = make();
  const a = m.createAccount({ name: "A", email: "a@test", imapHost: "i", smtpHost: "s" });
  db.prepare("INSERT INTO mail_message (id,account_id,mailbox,uid,subject,from_addr,date_at,preview,body,body_at,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)").run("cached1", a.id, "INBOX", 7, "已下载", "x@y", 1, "预览", "完整正文", 123, 1, 1);
  const hit = await m.messageBody({ id: "cached1" });
  assert.equal(hit.ok, true);
  assert.equal(hit.cached, true);
  assert.equal(hit.body, "完整正文");
  assert.equal(calls.length, 0, "已缓存不应再租保险箱/连 IMAP");
  // 本地发出的邮件 uid<=0：没有 IMAP UID，也不该联网
  db.prepare("INSERT INTO mail_message (id,account_id,mailbox,uid,subject,from_addr,date_at,preview,body,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?)").run("local1", a.id, "Sent", -1, "自己发的", "a@test", 2, "", "本地写下的内容", 2, 2);
  const local = await m.messageBody({ id: "local1" });
  assert.equal(local.ok, true);
  assert.equal(local.cached, true);
  assert.equal(local.body, "本地写下的内容");
  await assert.rejects(() => m.messageBody({ id: "nope" }), /不存在/);
});

test("列表不返回大字段 body，详情才带", async () => {
  const { m, db } = make();
  const a = m.createAccount({ name: "A", email: "a@test", imapHost: "i", smtpHost: "s" });
  db.prepare("INSERT INTO mail_message (id,account_id,mailbox,uid,subject,from_addr,date_at,preview,body,body_at,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)").run("big1", a.id, "INBOX", 9, "s", "x@y", 1, "预览", "很长的正文", 1, 1, 1);
  const row = m.messages({}).items[0];
  assert.equal(row.preview, "预览");
  assert.equal(row.body, undefined);
  assert.equal(m.message("big1").body, "很长的正文");
  assert.equal(m.message("big1").bodyAt, 1);
});

test("老库升级：补 html/content_id 列且不动既有正文缓存", () => {
  const db = new DatabaseSync(":memory:");
  db.exec("CREATE TABLE mail_account (id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL, imap_host TEXT NOT NULL DEFAULT '', imap_port INTEGER NOT NULL DEFAULT 993, imap_tls INTEGER NOT NULL DEFAULT 1, smtp_host TEXT NOT NULL DEFAULT '', smtp_port INTEGER NOT NULL DEFAULT 465, smtp_tls INTEGER NOT NULL DEFAULT 1, username TEXT NOT NULL DEFAULT '', secret_id TEXT NOT NULL DEFAULT '', enabled INTEGER NOT NULL DEFAULT 1, created_at INTEGER NOT NULL DEFAULT 0, updated_at INTEGER NOT NULL DEFAULT 0, rev INTEGER NOT NULL DEFAULT 0)");
  db.exec("CREATE TABLE mail_message (id TEXT PRIMARY KEY, account_id TEXT NOT NULL, mailbox TEXT NOT NULL, uid INTEGER NOT NULL DEFAULT 0, message_id TEXT NOT NULL DEFAULT '', subject TEXT NOT NULL DEFAULT '', from_addr TEXT NOT NULL DEFAULT '', to_addr TEXT NOT NULL DEFAULT '', cc_addr TEXT NOT NULL DEFAULT '', date_at INTEGER NOT NULL DEFAULT 0, preview TEXT NOT NULL DEFAULT '', body TEXT NOT NULL DEFAULT '', body_at INTEGER NOT NULL DEFAULT 0, flags TEXT NOT NULL DEFAULT '', created_at INTEGER NOT NULL DEFAULT 0, updated_at INTEGER NOT NULL DEFAULT 0)");
  db.exec("CREATE TABLE mail_attachment (id TEXT PRIMARY KEY, message_id TEXT NOT NULL, filename TEXT NOT NULL DEFAULT '', mime TEXT NOT NULL DEFAULT '', size INTEGER NOT NULL DEFAULT 0)");
  db.prepare("INSERT INTO mail_account (id,name,email) VALUES ('a1','旧库','old@test')").run();
  db.prepare("INSERT INTO mail_message (id,account_id,mailbox,uid,subject,body,body_at) VALUES ('m_old','a1','INBOX',5,'旧信','旧正文',7)").run();
  ensureSchema(db);
  const col = (t, c) => db.prepare(`PRAGMA table_info(${t})`).all().map(x => x.name).includes(c);
  for (const [t, c] of [["mail_message", "html"], ["mail_message", "html_at"], ["mail_attachment", "content_id"], ["mail_attachment", "inline"]]) {
    assert.equal(col(t, c), true, `${t}.${c} 应被补上`);
  }
  const row = db.prepare("SELECT body,html,html_at FROM mail_message WHERE id='m_old'").get();
  assert.equal(row.body, "旧正文");
  assert.equal(row.html, "");
  assert.equal(row.html_at, 0, "老缓存标记为未解析 HTML，供界面补拉一次");
  db.close();
});
