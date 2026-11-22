import { newId, now } from "../db/db.js";
import { readBodyParts, readAttachment } from "../infra/parts.js";
import { classifyProbeError } from "./probe-error.js";
import { visibleMessage } from "../db/visibility.js";

export function createParts({ db, account, password }) {
  const message = (id) => visibleMessage(db, id);
  // 对外统一驼峰字段：inline 表示正文内联图，contentId 用于把 cid: 引用映射回本地附件。
  const attachments = id => db.prepare("SELECT id,filename,mime,size,section,content_id,inline FROM mail_attachment WHERE message_id=? ORDER BY rowid").all(id)
    .map(a => ({ id: a.id, filename: a.filename, mime: a.mime, size: a.size, section: a.section, contentId: a.content_id || "", inline: !!a.inline }));
  function unchanged(row) {
    const current = message(row.id);
    if (current.uid !== row.uid || current.uid_validity !== row.uid_validity || current.mailbox !== row.mailbox || current.account_id !== row.account_id) throw new Error("邮件位置已改变，请重新打开");
  }
  async function connection(msg) {
    if (!(msg.uid > 0 && msg.uid_validity > 0)) throw new Error("本地邮件没有可确认的远端身份，无法下载分段");
    const a = account(msg.account_id);
    let p;
    try { p = await password(a); }
    catch (e) { throw Object.assign(new Error(String(e.message || e)), { code: "EVAULT" }); }
    unchanged(msg);
    if (account(a.id).rev !== a.rev) throw new Error("账户配置已变更，请重试");
    return { account: { host: a.imap_host, port: a.imap_port, secure: !!a.imap_tls, user: p.user }, secret: p.secret };
  }
  async function messageBody(input = {}) {
    const id = String(input.id || ""), row = message(id), existing = attachments(id);
    // 缓存命中只看正文：老版本（html_at=0）先按纯文本返回，同时用 htmlStale 提示客户端后台补拉一次富文本，
    // 补拉成功后重复打开就完全读本地；这样已缓存邮件不会因为升级而卡住或重复联网。
    if (row.uid <= 0 || (!input.force && row.body_at && (!row.uid_validity || existing.every(a => a.section)))) {
      return { ok: true, cached: true, body: row.body, preview: row.preview, html: row.html || "", htmlStale: !row.html_at, attachments: existing, truncated: !!row.body_truncated };
    }
    try {
      const parsed = await readBodyParts(await connection(row), row);
      unchanged(row);
      const preview = parsed.text.replace(/\s+/g, " ").trim().slice(0, 120);
      db.exec("SAVEPOINT mail_body_parts");
      try {
        db.prepare("UPDATE mail_message SET body=?,html=?,preview=?,body_truncated=?,body_at=?,html_at=?,updated_at=? WHERE id=?").run(parsed.text, parsed.html || "", preview, Number(parsed.truncated), now(), now(), now(), id);
        const prior = new Map(attachments(id).map(a => [a.section, a]));
        db.prepare("DELETE FROM mail_attachment WHERE message_id=?").run(id);
        const insert = db.prepare("INSERT INTO mail_attachment(id,message_id,filename,mime,size,section,content_id,inline) VALUES(?,?,?,?,?,?,?,?)");
        for (const a of parsed.attachments) {
          const old = prior.get(a.section);
          const same = old?.filename === a.filename && old.mime === a.mime && old.size === a.size;
          insert.run(same ? old.id : newId("att"), id, a.filename, a.mime, a.size, a.section, a.contentId || "", a.inline ? 1 : 0);
        }
        db.exec("RELEASE mail_body_parts");
      } catch (e) { db.exec("ROLLBACK TO mail_body_parts; RELEASE mail_body_parts"); throw e; }
      return { ok: true, cached: false, body: parsed.text, html: parsed.html, preview, attachments: attachments(id), truncated: parsed.truncated };
    } catch (e) {
      return { ok: false, errorClass: e.code === "EVAULT" ? "vault" : classifyProbeError(e), message: String(e.message || e).slice(0, 240) };
    }
  }
  async function attachmentDownload(input = {}) {
    const stored = db.prepare("SELECT * FROM mail_attachment WHERE id=?").get(String(input.id || ""));
    if (!stored?.section) throw new Error("附件不存在或索引过期，请重新下载正文");
    const row = message(stored.message_id);
    const file = await readAttachment(await connection(row), row, stored);
    unchanged(row);
    return file;
  }
  return { messageBody, attachmentDownload };
}
