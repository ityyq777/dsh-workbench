/**
 * 正文按需下载的端到端回归：用一个假 IMAP 服务器验证
 * 「按 UID 取 BODY.PEEK[] → 按字面量长度精确切片 → MIME 解码 → 落库 + 附件元信息」。
 * 真实服务器行为不可控，字面量切错位是这条链路最容易踩的坑，这里用假服务器把边界钉住。
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import net from "node:net";
import { DatabaseSync } from "node:sqlite";
const { ensureSchema } = await import("../lib/db/db.js");
const { createMail } = await import("../lib/domain/mail.js");
const { imapFetchBody } = await import("../lib/infra/imap.js");

const gbkChinese = Buffer.from([0xd6, 0xd0, 0xce, 0xc4]); // 「中文」

function make() {
  const db = new DatabaseSync(":memory:"); ensureSchema(db);
  const calls = [];
  const host = { call: async (n, a, o) => { calls.push([n, a, o]); return { result: { secret: "pw" } }; } };
  return { db, calls, m: createMail({ db, host, log: () => {} }) };
}

function sampleMessage() {
  const boundary = "=_mixed_1";
  const alt = "=_alt_1";
  const html = [
    "<html><head><meta charset=\"gbk\"></head><body>",
    "<p>你好&nbsp;世界</p>",
    "<p>本周限时优惠，点此查看。</p>",
    "</body></html>",
  ].join("\r\n");
  const lines = [
    "From: =?gbk?B?" + gbkChinese.toString("base64") + "?= <service@qq.com>",
    "Subject: =?gbk?B?" + gbkChinese.toString("base64") + "?=",
    "Content-Type: multipart/mixed; boundary=\"" + boundary + "\"",
    "",
    "--" + boundary,
    "Content-Type: multipart/alternative; boundary=\"" + alt + "\"",
    "",
    "--" + alt,
    "Content-Type: text/plain; charset=gbk",
    "Content-Transfer-Encoding: base64",
    "",
    gbkChinese.toString("base64"),
    "--" + alt,
    "Content-Type: text/html; charset=utf-8",
    "",
    html,
    "--" + alt + "--",
    "",
    "--" + boundary,
    "Content-Type: application/pdf",
    "Content-Disposition: attachment; filename=\"=?utf-8?B?" + Buffer.from("对账单.pdf", "utf8").toString("base64") + "?=\"",
    "Content-Transfer-Encoding: base64",
    "",
    "JVBERi0xLjQK",
    "--" + boundary + "--",
    "",
  ];
  return Buffer.from(lines.join("\r\n"), "utf8");
}

/** 极小 IMAP 服务器：只回 LOGIN / SELECT / UID FETCH / LOGOUT。 */
function fakeImap(raw, state = { connections: 0 }) {
  const server = net.createServer((sock) => {
    state.connections += 1;
    let buf = "";
    sock.write("* OK fake IMAP ready\r\n");
    sock.on("error", () => {}); // 客户端提前 destroy 时会 reset，别让它冒到 uncaughtException
    sock.on("data", (d) => {
      buf += d.toString("latin1");
      let i;
      while ((i = buf.indexOf("\r\n")) >= 0) {
        const line = buf.slice(0, i); buf = buf.slice(i + 2);
        const tag = line.split(" ")[0];
        if (/ LOGIN /.test(line)) sock.write(tag + " OK LOGIN completed\r\n");
        else if (/ SELECT /.test(line)) sock.write("* 1 EXISTS\r\n* OK [UIDVALIDITY 1] ok\r\na2 OK [READ-WRITE] SELECT completed\r\n");
        else if (/ UID FETCH /.test(line)) {
          // 字面量前刻意不加空格、正文里再塞一行像结束标记的内容，切错位就会立刻暴露。
          sock.write("* 1 FETCH (UID 1 BODY[] {" + raw.length + "}\r\n");
          sock.write(raw);
          sock.write("\r\n)\r\n" + tag + " OK FETCH completed\r\n");
        } else if (/ LOGOUT/.test(line)) { sock.write("* BYE\r\n" + tag + " OK\r\n"); sock.end(); }
        else sock.write(tag + " OK\r\n");
      }
    });
  });
  return new Promise((resolve) => server.listen(0, "127.0.0.1", () => resolve({ server, state })));
}

test("按 UID 取全文：gbk 纯文本优先、附件只留元信息、已下载不重复拉", async () => {
  const raw = sampleMessage();
  const { server, state } = await fakeImap(raw);
  const port = server.address().port;
  try {
    const { db, m, calls } = make();
    const a = m.createAccount({ name: "QQ", email: "me@qq.com", imapHost: "127.0.0.1", imapPort: port, imapTls: false, smtpHost: "127.0.0.1", secretId: "sec1" });
    db.prepare("INSERT INTO mail_message (id,account_id,mailbox,uid,subject,from_addr,date_at,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?)").run("m1", a.id, "INBOX", 1, "=?gbk?B?1tDOxA==?=", "service@qq.com", 1000, 1000, 1000);

    const r = await m.messageBody({ id: "m1" });
    assert.equal(r.ok, true);
    assert.equal(r.cached, false);
    assert.match(r.body, /中文/);
    assert.match(r.html, /限时优惠/); // 纯文本优先，但 HTML 版本仍回给界面备查
    assert.equal(r.attachments.length, 1);
    assert.equal(r.attachments[0].filename, "对账单.pdf");
    assert.equal(r.attachments[0].mime, "application/pdf");
    assert.equal(r.attachments[0].size, 9);
    assert.equal(state.connections, 1);

    const row = m.message("m1");
    assert.ok(row.bodyAt > 0);
    assert.ok(row.preview.length > 0 && row.preview.length <= 120);
    assert.match(row.preview, /中文/);
    // 列表不把正文塞进摘要
    assert.equal(m.messages({}).items[0].body, undefined);

    const second = await m.messageBody({ id: "m1" });
    assert.equal(second.cached, true);
    assert.equal(second.body, r.body);
    assert.equal(state.connections, 1, "已缓存不应再连 IMAP");
    assert.equal(calls.length, 1, "已缓存不应再租保险箱");
  } finally { server.closeAllConnections?.(); server.close(); }
});

test("超过单封上限时明确报错，不把截半封当成功", async () => {
  const big = Buffer.alloc(100000, 0x41);
  const { server } = await fakeImap(big);
  const port = server.address().port;
  try {
    await assert.rejects(
      () => imapFetchBody({ host: "127.0.0.1", port, secure: false, user: "u" }, "pw", "INBOX", 1, { maxBytes: 1024 }),
      (e) => e.code === "EMBODYTOOLARGE" && /超过单封上限/.test(e.message),
    );
  } finally { server.closeAllConnections?.(); server.close(); }
});

test("取正文失败时返回可读原因，而不是把异常抛给界面", async () => {
  const { m, db } = make();
  const a = m.createAccount({ name: "A", email: "a@test", imapHost: "127.0.0.1", imapPort: 1, imapTls: false, smtpHost: "s", secretId: "sec1" });
  db.prepare("INSERT INTO mail_message (id,account_id,mailbox,uid,subject,from_addr,date_at,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?)").run("m2", a.id, "INBOX", 3, "s", "x@y", 1000, 1000, 1000);
  const r = await m.messageBody({ id: "m2" });
  assert.equal(r.ok, false);
  assert.ok(r.message && r.message.length > 0);
  assert.equal(m.message("m2").bodyAt, 0);
});
