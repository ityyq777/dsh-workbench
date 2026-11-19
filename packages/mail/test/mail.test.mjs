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

test("本地邮件列表/搜索/已读/移动/删除", () => {
  const { m, db } = make();
  const a = m.createAccount({ name: "A", email: "a@test", imapHost: "i", smtpHost: "s" });
  seedMessage(db, a.id);
  assert.equal(m.messages({}).items.length, 1);
  assert.equal(m.messages({ q: "你好" }).items.length, 1);
  m.markRead({ id: "msg1" });
  assert.equal(m.messages({ unread: true }).items.length, 0);
  m.move({ id: "msg1", mailbox: "Archive" });
  assert.equal(m.message("msg1").mailbox, "Archive");
  m.remove({ id: "msg1" });
  assert.equal(m.messages({}).items.length, 0);
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
