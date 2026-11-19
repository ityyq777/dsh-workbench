/** 邮件域引擎：账户、文件夹、本地邮件、SMTP 发送、IMAP 抓信头。 */
import { accountRow, messageRow, newId, now } from "../db/db.js";
import { imapList, imapRecent, imapFetchBody } from "../infra/imap.js";
import { parseMime } from "../infra/mime.js";
import { sendMail, probeSmtp } from "../infra/smtp.js";
import { classifyProbeError } from "./probe-error.js";
import { decodeWords, parseAddress } from "../infra/mime-word.js";

export function createMail({ db, host, log }) {
  const one = (sql, ...a) => db.prepare(sql).get(...a);
  const all = (sql, ...a) => db.prepare(sql).all(...a);
  const run = (sql, ...a) => db.prepare(sql).run(...a);
  const account = (id) => { const r = one("SELECT * FROM mail_account WHERE id=? AND deleted_at IS NULL", id); if (!r) throw new Error("邮箱账户不存在：" + id); return r; };
  async function password(acc) {
    if (!acc.secret_id) throw new Error("账户未绑定密码，请先在保险箱创建 secret 并绑定");
    const r = await host.call("vault.lease", { id: acc.secret_id, purpose: "mail:" + acc.id }, "plugin");
    const v = r && r.result !== undefined ? r.result : r;
    return { user: acc.username || acc.email, secret: v.secret };
  }
  function status() { return { accounts: one("SELECT COUNT(*) n FROM mail_account WHERE deleted_at IS NULL").n, messages: one("SELECT COUNT(*) n FROM mail_message").n, unread: one("SELECT COUNT(*) n FROM mail_message WHERE flags NOT LIKE '%\\Seen%'").n, mailboxes: one("SELECT COUNT(*) n FROM mail_mailbox").n }; }
  // 账户卡片上的「最近来信」由本地邮件派生，不额外加列（见设计文档第 10 节）。
  function listAccounts() {
    const last = new Map(all("SELECT account_id, MAX(date_at) AS at FROM mail_message GROUP BY account_id").map((r) => [r.account_id, r.at]));
    return { items: all("SELECT * FROM mail_account WHERE deleted_at IS NULL ORDER BY created_at").map((r) => Object.assign(accountRow(r), { lastMessageAt: last.get(r.id) || null })) };
  }
  function createAccount(input = {}) {
    const name = String(input.name || "").trim(); const email = String(input.email || "").trim();
    if (!name || !email) throw new Error("账户名称与邮箱地址必填");
    const id = newId("acc");
    run("INSERT INTO mail_account (id,name,email,imap_host,imap_port,imap_tls,smtp_host,smtp_port,smtp_tls,username,secret_id,enabled,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)", id, name, email, String(input.imapHost || ""), Number(input.imapPort) || 993, input.imapTls === false ? 0 : 1, String(input.smtpHost || ""), Number(input.smtpPort) || 465, input.smtpTls === false ? 0 : 1, String(input.username || email), String(input.secretId || ""), input.enabled === false ? 0 : 1, now(), now());
    return accountRow(account(id));
  }
  function updateAccount(input = {}) {
    const a = account(input.id);
    run("UPDATE mail_account SET name=?,email=?,imap_host=?,imap_port=?,imap_tls=?,smtp_host=?,smtp_port=?,smtp_tls=?,username=?,secret_id=?,enabled=?,updated_at=?,rev=rev+1 WHERE id=?", input.name !== undefined ? String(input.name).trim() || a.name : a.name, input.email !== undefined ? String(input.email).trim() || a.email : a.email, input.imapHost !== undefined ? String(input.imapHost) : a.imap_host, input.imapPort !== undefined ? Number(input.imapPort) : a.imap_port, input.imapTls !== undefined ? (input.imapTls ? 1 : 0) : a.imap_tls, input.smtpHost !== undefined ? String(input.smtpHost) : a.smtp_host, input.smtpPort !== undefined ? Number(input.smtpPort) : a.smtp_port, input.smtpTls !== undefined ? (input.smtpTls ? 1 : 0) : a.smtp_tls, input.username !== undefined ? String(input.username) : a.username, input.secretId !== undefined ? String(input.secretId) : a.secret_id, input.enabled !== undefined ? (input.enabled ? 1 : 0) : a.enabled, now(), a.id);
    return accountRow(account(a.id));
  }
  function deleteAccount(id) { account(id); run("UPDATE mail_account SET deleted_at=?,updated_at=? WHERE id=?", now(), now(), id); return { deleted: true, id }; }
  // 连接失败不再整条抛错：界面要按 errorClass 给不同的补救文案，抛错只剩一句 message。
  async function testAccount(id) {
    const a = account(id); const p = await password(a);
    try {
      const boxes = await imapList({ host: a.imap_host, port: a.imap_port, secure: !!a.imap_tls, user: p.user }, p.secret);
      return { ok: true, mailboxes: boxes.length, imap: a.imap_host, errorClass: "" };
    } catch (e) {
      return { ok: false, errorClass: classifyProbeError(e), imap: a.imap_host, message: String((e && e.message) || e).slice(0, 240) };
    }
  }
  /**
   * 保存前自检：用草稿参数（尚未落库）连一次 IMAP 并列出文件夹，可选再验证 SMTP 认证。
   * 密码可以明文传（仅本次调用内存里用），也可以传已有 secretId 走保险箱租约。
   */
  async function probeAccount(input = {}) {
    const imapHost = String(input.imapHost || "").trim();
    const smtpHost = String(input.smtpHost || "").trim();
    const user = String(input.username || "").trim() || String(input.email || "").trim();
    if (!imapHost) throw new Error("请先填写 IMAP 服务器");
    if (!user) throw new Error("请先填写登录名或邮箱地址");
    let secret = String(input.password || "");
    if (!secret && input.secretId) secret = (await password({ secret_id: input.secretId, id: "probe" })).secret;
    if (!secret) throw new Error("请先填写授权码");
    const out = { ok: true, imap: null, smtp: null, errorClass: "" };
    const t0 = now();
    try {
      const boxes = await imapList({ host: imapHost, port: Number(input.imapPort) || 993, secure: input.imapTls !== false, user }, secret);
      out.imap = { ok: true, mailboxes: boxes.length, ms: now() - t0 };
    } catch (e) {
      const errorClass = classifyProbeError(e);
      out.imap = { ok: false, errorClass, message: String((e && e.message) || e).slice(0, 240), ms: now() - t0 };
      out.ok = false; out.errorClass = errorClass;
    }
    if (smtpHost) {
      const t1 = now();
      try {
        await probeSmtp({ host: smtpHost, port: Number(input.smtpPort) || 465, secure: input.smtpTls !== false, user }, secret);
        out.smtp = { ok: true, ms: now() - t1 };
      } catch (e) {
        const errorClass = classifyProbeError(e);
        out.smtp = { ok: false, errorClass, message: String((e && e.message) || e).slice(0, 240), ms: now() - t1 };
        out.ok = false; if (!out.errorClass) out.errorClass = errorClass;
      }
    }
    return out;
  }
  /**
   * 老库里的信头是原串（=`=?gbk?B?…?=`、发件人 `"名字" <地址>`），这里一次性就地重解。
   * 只处理确实需要的行，且与解析结果比较过才写，重复启动不会反复改。
   */
  function backfillHeaderRows() {
    const rows = all("SELECT id, subject, from_addr, from_name, to_addr, cc_addr FROM mail_message");
    let fixed = 0;
    for (const r of rows) {
      const needSubject = String(r.subject || "").indexOf("=?") >= 0;
      const needFrom = String(r.from_addr || "").indexOf("<") >= 0 || String(r.from_addr || "").indexOf("=?") >= 0 || (!r.from_name && String(r.from_addr || "").indexOf('"') === 0);
      const needTo = String(r.to_addr || "").indexOf("=?") >= 0;
      const needCc = String(r.cc_addr || "").indexOf("=?") >= 0;
      if (!needSubject && !needFrom && !needTo && !needCc) continue;
      const subject = needSubject ? decodeWords(r.subject) : r.subject;
      const sender = needFrom ? parseAddress(r.from_addr) : { name: r.from_name || "", address: r.from_addr };
      const to = needTo ? decodeWords(r.to_addr) : r.to_addr;
      const cc = needCc ? decodeWords(r.cc_addr) : r.cc_addr;
      if (subject === r.subject && sender.address === r.from_addr && (sender.name || "") === (r.from_name || "") && to === r.to_addr && cc === r.cc_addr) continue;
      run("UPDATE mail_message SET subject=?, from_addr=?, from_name=?, to_addr=?, cc_addr=? WHERE id=?", subject, sender.address || r.from_addr, sender.name || "", to, cc, r.id);
      fixed += 1;
    }
    if (fixed && log) log("mail: 重解 " + fixed + " 条历史信头");
    return fixed;
  }

  async function syncMailboxes(id) {
    const a = account(id); const p = await password(a);
    const boxes = await imapList({ host: a.imap_host, port: a.imap_port, secure: !!a.imap_tls, user: p.user }, p.secret);
    for (const b of boxes) {
      const role = /^INBOX$/i.test(b.name) ? "inbox" : /sent/i.test(b.name) ? "sent" : /drafts/i.test(b.name) ? "drafts" : /trash|deleted/i.test(b.name) ? "trash" : "";
      run("INSERT INTO mail_mailbox (id,account_id,name,delimiter,role,updated_at) VALUES (?,?,?,?,?,?) ON CONFLICT(account_id,name) DO UPDATE SET delimiter=excluded.delimiter,role=excluded.role,updated_at=excluded.updated_at", newId("box"), a.id, b.name, b.delimiter || "/", role, now());
    }
    return { items: all("SELECT id,account_id,name,delimiter,role FROM mail_mailbox WHERE account_id=? ORDER BY name", a.id) };
  }
  function mailboxes(id) { if (id) account(id); return { items: all("SELECT id,account_id,name,delimiter,role FROM mail_mailbox WHERE (? IS NULL OR account_id=?) ORDER BY name", id || null, id || null) }; }
  async function sync(id, input = {}) {
    const a = account(id); const p = await password(a);
    const mailbox = String(input.mailbox || "INBOX");
    const r = await imapRecent({ host: a.imap_host, port: a.imap_port, secure: !!a.imap_tls, user: p.user }, p.secret, mailbox, Math.min(Number(input.limit) || 20, 50));
    let inserted = 0;
    for (const it of r.items) {
      const dateAt = Date.parse(it.date) || now();
      const exists = one("SELECT id FROM mail_message WHERE account_id=? AND mailbox=? AND uid=?", a.id, mailbox, it.uid);
      if (exists) continue;
      run("INSERT INTO mail_message (id,account_id,mailbox,uid,message_id,subject,from_addr,from_name,to_addr,cc_addr,date_at,preview,body,flags,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", newId("msg"), a.id, mailbox, it.uid, it.messageId, it.subject, it.from, it.fromName || "", it.to, it.cc, dateAt, "", "", "", now(), now());
      inserted += 1;
    }
    return { mailbox, exists: r.exists, fetched: r.items.length, inserted };
  }
  function messages(input = {}) {
    const limit = Math.min(Math.max(Number(input.limit) || 30, 1), 200);
    const cond = ["1=1"]; const args = [];
    if (input.accountId) { cond.push("account_id=?"); args.push(input.accountId); }
    if (input.mailbox) { cond.push("mailbox=?"); args.push(input.mailbox); }
    if (input.unread) cond.push("flags NOT LIKE '%\\Seen%'");
    if (input.q) { cond.push("(subject LIKE ? ESCAPE '\\' OR from_addr LIKE ? ESCAPE '\\')"); const like = "%" + String(input.q).replace(/[\\%_]/g, "\\$&") + "%"; args.push(like, like); }
    return { items: all("SELECT * FROM mail_message WHERE " + cond.join(" AND ") + " ORDER BY date_at DESC LIMIT ?", ...args, limit).map((r) => { const row = messageRow(r); delete row.body; return row; }) };
  }
  function message(id) {
    const r = one("SELECT * FROM mail_message WHERE id=?", id); if (!r) throw new Error("邮件不存在：" + id);
    const out = messageRow(r); out.attachments = all("SELECT id,filename,mime,size FROM mail_attachment WHERE message_id=?", id); return out;
  }
  /**
   * 按需取正文：本地已有（body_at>0 或本地发出的邮件）直接返回缓存；
   * 否则从 IMAP 拉整封原文、解 MIME，落 body/preview 与附件元信息。
   * 失败不抛给界面，返回 { ok:false, errorClass, message } 让阅读区给原因与重试。
   */
  async function messageBody(input = {}) {
    const id = String(input.id || "");
    const r = one("SELECT * FROM mail_message WHERE id=?", id);
    if (!r) throw new Error("邮件不存在：" + id);
    const cached = Number(r.body_at) > 0;
    const local = Number(r.uid) <= 0;
    const attachments = () => all("SELECT id,filename,mime,size FROM mail_attachment WHERE message_id=?", id);
    if (!input.force && (cached || local)) {
      return { ok: true, cached: true, body: r.body || "", html: "", preview: r.preview || "", attachments: attachments(), truncated: false };
    }
    const a = account(r.account_id);
    let p;
    try { p = await password(a); } catch (e) { return { ok: false, errorClass: "vault", message: String((e && e.message) || e).slice(0, 240) }; }
    try {
      const fetched = await imapFetchBody({ host: a.imap_host, port: a.imap_port, secure: !!a.imap_tls, user: p.user }, p.secret, r.mailbox || "INBOX", r.uid);
      const parsed = parseMime(fetched.raw);
      if (!parsed.text) throw new Error("这封邮件没有可读的纯文本正文（可能只有附件或图片）");
      const text = parsed.text.slice(0, 200000);
      const preview = text.replace(/\s+/g, " ").trim().slice(0, 120);
      run("UPDATE mail_message SET body=?,preview=?,body_at=?,updated_at=? WHERE id=?", text, preview, now(), now(), id);
      run("DELETE FROM mail_attachment WHERE message_id=?", id);
      for (const at of parsed.attachments) run("INSERT INTO mail_attachment (id,message_id,filename,mime,size) VALUES (?,?,?,?,?)", newId("att"), id, at.filename, at.mime, at.size);
      return { ok: true, cached: false, body: text, html: parsed.html, preview, attachments: attachments(), truncated: parsed.truncated || parsed.text.length > text.length };
    } catch (e) {
      return { ok: false, errorClass: classifyProbeError(e), message: String((e && e.message) || e).slice(0, 240), size: e && e.size, limit: e && e.limit };
    }
  }
  function markRead(input = {}) {
    const ids = Array.isArray(input.ids) ? input.ids : [input.id];
    for (const id of ids) { const r = one("SELECT flags FROM mail_message WHERE id=?", id); if (!r) continue; const flags = /\bSeen\b/.test(r.flags) ? r.flags : (r.flags + " \\Seen").trim(); run("UPDATE mail_message SET flags=?,updated_at=? WHERE id=?", flags, now(), id); }
    return { updated: ids.length };
  }
  function move(input = {}) { const r = one("SELECT id FROM mail_message WHERE id=?", input.id); if (!r) throw new Error("邮件不存在"); run("UPDATE mail_message SET mailbox=?,updated_at=? WHERE id=?", String(input.mailbox || "INBOX"), now(), input.id); return message(input.id); }
  function remove(input = {}) { run("DELETE FROM mail_message WHERE id=?", input.id); return { deleted: true }; }
  async function send(input = {}) {
    const a = account(input.accountId); const p = await password(a);
    const to = [].concat(input.to || []).map((s) => String(s).trim()).filter(Boolean);
    if (!to.length) throw new Error("至少一个收件人");
    const r = await sendMail({ host: a.smtp_host, port: a.smtp_port, secure: !!a.smtp_tls, user: a.username || a.email }, p.secret, { from: a.email, to, cc: input.cc || [], subject: input.subject, text: input.text });
    const mb = one("SELECT name FROM mail_mailbox WHERE account_id=? AND role='sent'", a.id) || one("SELECT name FROM mail_mailbox WHERE account_id=? ORDER BY role DESC LIMIT 1", a.id);
    run("INSERT INTO mail_message (id,account_id,mailbox,uid,message_id,subject,from_addr,from_name,to_addr,cc_addr,date_at,preview,body,flags,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", newId("msg"), a.id, mb ? mb.name : "Sent", -now(), r.messageId, String(input.subject || ""), a.email, a.name || "", to.join(", "), (input.cc || []).join(", "), now(), String(input.text || "").slice(0, 200), String(input.text || ""), "\\Seen", now(), now());
    return { sent: true, messageId: r.messageId };
  }
  function search(q, { limit = 10 } = {}) {
    const like = "%" + String(q || "").replace(/[\\%_]/g, "\\$&") + "%";
    return all("SELECT id,subject,from_addr,date_at FROM mail_message WHERE subject LIKE ? ESCAPE '\\' OR from_addr LIKE ? ESCAPE '\\' ORDER BY date_at DESC LIMIT ?", like, like, limit).map((r) => ({ id: r.id, title: r.subject, snippet: r.from_addr, at: r.date_at, view: "messages" }));
  }
  function stats() { return status(); }
  function dataQuery(input = {}) {
    const allow = ["mail_account", "mail_mailbox", "mail_message", "mail_attachment"];
    if (!allow.includes(input.table)) throw new Error("不允许查询该表");
    const limit = Math.min(Math.max(Number(input.limit) || 20, 1), 100);
    return { table: input.table, rows: all("SELECT * FROM " + input.table + " LIMIT ?", limit) };
  }
  return { status, stats, backfillHeaders: backfillHeaderRows, listAccounts, createAccount, updateAccount, deleteAccount, testAccount, probeAccount, syncMailboxes, mailboxes, sync, messages, message, messageBody, markRead, move, remove, send, search, dataQuery };
}
