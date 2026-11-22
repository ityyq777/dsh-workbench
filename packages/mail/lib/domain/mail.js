/** 邮件域引擎：账户、文件夹、本地邮件、SMTP 发送、IMAP 抓信头。 */
import { accountRow, messageRow, newId, now } from "../db/db.js";
import { imapList, imapProbe } from "../infra/imap.js";
import { createSync } from "./sync.js";
import { createComposer } from "./compose.js";
import { createParts } from "./parts.js";
import { listMessages } from "./list.js";
import { probeSmtp } from "../infra/smtp.js";
import { createDelivery } from "./delivery.js";
import { createAttachmentLoader } from "./send-attachments.js";
import { classifyProbeError } from "./probe-error.js";
import { decodeWords, parseAddress } from "../infra/mime-word.js";
import { activeAccount, visibleMessage } from "../db/visibility.js";

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
  function status() {
    const visible = activeAccount('m.account_id');
    return {
      accounts: one("SELECT COUNT(*) n FROM mail_account WHERE deleted_at IS NULL").n,
      messages: one(`SELECT COUNT(*) n FROM mail_message m WHERE ${visible}`).n,
      unread: one(`SELECT COUNT(*) n FROM mail_message m WHERE ${visible} AND flags NOT LIKE '%\\Seen%'`).n,
      mailboxes: one(`SELECT COUNT(*) n FROM mail_mailbox m WHERE ${visible}`).n,
    };
  }
  // 账户卡片上的「最近来信」由本地邮件派生，不额外加列（见设计文档第 10 节）。
  function listAccounts() {
    const last = new Map(all("SELECT account_id, MAX(date_at) AS at FROM mail_message GROUP BY account_id").map((r) => [r.account_id, r.at]));
    return { items: all("SELECT * FROM mail_account WHERE deleted_at IS NULL ORDER BY created_at").map((r) => Object.assign(accountRow(r), { lastMessageAt: last.get(r.id) || null })) };
  }
  function createAccount(input = {}) {
    const name = String(input.name || "").trim(); const email = String(input.email || "").trim();
    if (!name || !email) throw new Error("账户名称与邮箱地址必填");
    const id = newId("acc");
    // 0.6.0：账户先绑一个「集合与账号」，邮箱地址由集合账号带出（这里仍保留入参，便于导入与老数据）。
    run("INSERT INTO mail_account (id,name,email,account_set_id,imap_host,imap_port,imap_tls,smtp_host,smtp_port,smtp_tls,username,secret_id,enabled,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", id, name, email, String(input.accountSetId || ""), String(input.imapHost || ""), Number(input.imapPort) || 993, input.imapTls === false ? 0 : 1, String(input.smtpHost || ""), Number(input.smtpPort) || 465, input.smtpTls === false ? 0 : 1, String(input.username || email), String(input.secretId || ""), input.enabled === false ? 0 : 1, now(), now());
    return accountRow(account(id));
  }
  function updateAccount(input = {}) {
    const a = account(input.id);
    const endpointChanged = (input.imapHost !== undefined && String(input.imapHost).trim().toLowerCase() !== a.imap_host.toLowerCase()) || (input.imapPort !== undefined && Number(input.imapPort) !== a.imap_port);
    const loginChanged = input.username !== undefined && String(input.username || input.email || a.email) !== (a.username || a.email);
    if ((endpointChanged || loginChanged || (!a.username && input.email && input.email !== a.email)) && one("SELECT 1 FROM mail_message WHERE account_id=? AND uid>0 UNION ALL SELECT 1 FROM mail_mailbox WHERE account_id=? LIMIT 1", a.id, a.id)) {
      throw new Error("此账户已有远端邮件缓存。更换 IMAP 主机或登录名请新建账户，以免误操作其他邮箱。");
    }
    run("UPDATE mail_account SET name=?,email=?,account_set_id=?,imap_host=?,imap_port=?,imap_tls=?,smtp_host=?,smtp_port=?,smtp_tls=?,username=?,secret_id=?,enabled=?,updated_at=?,rev=rev+1 WHERE id=?", input.name !== undefined ? String(input.name).trim() || a.name : a.name, input.email !== undefined ? String(input.email).trim() || a.email : a.email, input.accountSetId !== undefined ? String(input.accountSetId) : a.account_set_id, input.imapHost !== undefined ? String(input.imapHost) : a.imap_host, input.imapPort !== undefined ? Number(input.imapPort) : a.imap_port, input.imapTls !== undefined ? (input.imapTls ? 1 : 0) : a.imap_tls, input.smtpHost !== undefined ? String(input.smtpHost) : a.smtp_host, input.smtpPort !== undefined ? Number(input.smtpPort) : a.smtp_port, input.smtpTls !== undefined ? (input.smtpTls ? 1 : 0) : a.smtp_tls, input.username !== undefined ? String(input.username) : a.username, input.secretId !== undefined ? String(input.secretId) : a.secret_id, input.enabled !== undefined ? (input.enabled ? 1 : 0) : a.enabled, now(), a.id);
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
    const current = account(id);
    if (current.rev !== a.rev) throw new Error("账户配置已更改，请重新同步文件夹");
    const live = new Set();
    db.exec("SAVEPOINT mail_refresh_boxes");
    try {
    for (const b of boxes) {
      if (String(b.flags || "").toLowerCase().split(/[\s,]+/).includes("\\noselect")) continue;
      live.add(b.name);
      const flags = String(b.flags || "").toLowerCase().split(/[\s,]+/);
      const role = /^INBOX$/i.test(b.name) ? "inbox" : flags.includes("\\trash") ? "trash" : flags.includes("\\sent") ? "sent" : flags.includes("\\drafts") ? "drafts" : /^(trash|deleted items|deleted messages)$/i.test(b.name) ? "trash" : /^(sent|sent items|sent messages)$/i.test(b.name) ? "sent" : /^drafts$/i.test(b.name) ? "drafts" : "";
      run("INSERT INTO mail_mailbox (id,account_id,name,delimiter,role,updated_at) VALUES (?,?,?,?,?,?) ON CONFLICT(account_id,name) DO UPDATE SET delimiter=excluded.delimiter,role=excluded.role,updated_at=excluded.updated_at", newId("box"), a.id, b.name, b.delimiter || "/", role, now());
    }
    for (const row of all("SELECT name FROM mail_mailbox WHERE account_id=?", a.id)) {
      if (!live.has(row.name)) run("DELETE FROM mail_mailbox WHERE account_id=? AND name=?", a.id, row.name);
    }
    db.exec("RELEASE mail_refresh_boxes");
    } catch (e) {
      db.exec("ROLLBACK TO mail_refresh_boxes; RELEASE mail_refresh_boxes");
      throw e;
    }
    return { items: all("SELECT id,account_id,name,delimiter,role FROM mail_mailbox WHERE account_id=? ORDER BY name", a.id) };
  }
  function mailboxes(id) {
    if (id) account(id);
    const stored = all(`SELECT id,account_id,name,delimiter,role FROM mail_mailbox m WHERE ${activeAccount('m.account_id')} AND (? IS NULL OR account_id=?) ORDER BY name`, id || null, id || null);
    const local = all(`SELECT DISTINCT account_id, mailbox AS name FROM mail_message m
      WHERE ${activeAccount('m.account_id')} AND uid<=0 AND (? IS NULL OR account_id=?) AND NOT EXISTS
      (SELECT 1 FROM mail_mailbox b WHERE b.account_id=m.account_id AND b.name=m.mailbox) ORDER BY mailbox`, id || null, id || null);
    return { items: [...stored, ...local.map(r => ({ ...r, id: `local:${r.account_id}:${r.name}`, localOnly: true, delimiter: "/", role: "" }))] };
  }
  const messages = (input) => listMessages(db, input);
  function message(id) {
    const r = visibleMessage(db, id);
    const out = messageRow(r);
    // 详情直接带富文本正文与内联图标记：打开邮件即可按原信渲染，不必等正文分段下载。
    out.html = r.html || ""; out.htmlAt = r.html_at || 0;
    out.attachments = all("SELECT id,filename,mime,size,section,content_id,inline FROM mail_attachment WHERE message_id=?", id)
      .map(a => ({ id: a.id, filename: a.filename, mime: a.mime, size: a.size, section: a.section, contentId: a.content_id || "", inline: !!a.inline }));
    return out;
  }
  const composer = createComposer({ db, message, account });
  const syncOps = createSync({ db, account, password, message });
  const parts = createParts({ db, account, password });
  const loadAttachments = createAttachmentLoader({ message, attachmentDownload: parts.attachmentDownload });
  const delivery = createDelivery({ db, account, password, thread: composer.thread, loadAttachments });
  // 后台自动同步要自己开连接（IDLE 常驻、定时探测）：这里把账户参数与一次租借到的明文
  // 打包给调用方，用完即弃，不在内存里留密码。
  async function sessionFor(id) {
    const a = account(id);
    const p = await password(a);
    return { account: { host: a.imap_host, port: a.imap_port, secure: !!a.imap_tls, user: p.user }, secret: p.secret };
  }
  /**
   * 轻量探测：只发一次 STATUS 判断远端有没有新信，不读任何信头。
   * 与本地最大 uid 比较后，调用方才知道值不值得走一次完整 mail.sync。
   */
  async function probeRecent(id, mailbox = "INBOX") {
    const box = /^inbox$/i.test(String(mailbox)) ? "INBOX" : String(mailbox);
    const s = await sessionFor(id);
    const remote = await imapProbe(s.account, s.secret, box);
    const local = one(
      "SELECT COUNT(*) n, COALESCE(MAX(uid),0) uid FROM mail_message WHERE account_id=? AND mailbox=? AND uid>0",
      id,
      box,
    );
    return { ...remote, localCount: local.n, localUid: local.uid };
  }
  function search(q, { limit = 10 } = {}) {    const like = "%" + String(q || "").replace(/[\\%_]/g, "\\$&") + "%";
    return all(`SELECT id,subject,from_addr,date_at FROM mail_message m WHERE ${activeAccount('m.account_id')} AND (subject LIKE ? ESCAPE '\\' OR from_addr LIKE ? ESCAPE '\\') ORDER BY date_at DESC LIMIT ?`, like, like, limit).map((r) => ({ id: r.id, title: r.subject, snippet: r.from_addr, at: r.date_at, view: "messages" }));
  }
  function stats() { return status(); }
  function dataQuery(input = {}) {
    const allow = ["mail_account", "mail_mailbox", "mail_message", "mail_attachment"];
    if (!allow.includes(input.table)) throw new Error("不允许查询该表");
    const limit = Math.min(Math.max(Number(input.limit) || 20, 1), 100);
    const where = input.table === 'mail_account' ? 'r.deleted_at IS NULL' : input.table === 'mail_attachment'
      ? `EXISTS (SELECT 1 FROM mail_message m WHERE m.id=r.message_id AND ${activeAccount('m.account_id')})`
      : activeAccount('r.account_id');
    return { table: input.table, rows: all(`SELECT r.* FROM ${input.table} r WHERE ${where} LIMIT ?`, limit) };
  }
  return { status, stats, backfillHeaders: backfillHeaderRows, listAccounts, createAccount, updateAccount, deleteAccount, testAccount, probeAccount, syncMailboxes, mailboxes, ...syncOps, messages, message, ...parts, ...composer, ...delivery, sessionFor, probeRecent, search, dataQuery };
}
