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
