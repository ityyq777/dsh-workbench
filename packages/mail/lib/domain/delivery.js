import { randomUUID } from 'node:crypto';
import { now } from '../db/db.js';
import { activeAccount } from '../db/visibility.js';
import { sendMail } from '../infra/smtp.js';

export function createDelivery({ db, account, password, thread, loadAttachments }) {
  const inFlight = new Set();
  const unsaved = new Map();
  const visible = activeAccount('d.account_id');
  const record = (id) => db.prepare(`SELECT d.* FROM mail_delivery d WHERE id=? AND ${visible}`).get(id);
  const update = (id, status, reason = '') => db.prepare('UPDATE mail_delivery SET status=?,reason=? WHERE id=?').run(status, reason, id);

  function deliveryArchive({ id }) {
    const row = record(id);
    if (row?.status === 'archived') return { archived: true, messageId: row.message_id };
    if (!row || inFlight.has(id) || (row.status !== 'accepted' && unsaved.get(id)?.status !== 'accepted')) {
      throw new Error('只有收到 SMTP 接收回执的邮件才能补记');
    }
    const d = JSON.parse(row.payload);
    db.exec('SAVEPOINT mail_delivery_archive');
    try {
      const a = account(row.account_id);
      const box = db.prepare("SELECT name FROM mail_mailbox WHERE account_id=? AND role='sent' ORDER BY name LIMIT 1").get(a.id)?.name || 'Sent';
      const stamp = row.created_at;
      db.prepare(`INSERT INTO mail_message (id,account_id,mailbox,uid,message_id,subject,from_addr,from_name,to_addr,cc_addr,date_at,preview,body,body_at,flags,created_at,updated_at,thread_refs)
        VALUES (?,?,?,(SELECT MIN(0,COALESCE(MIN(uid),0))-1 FROM mail_message WHERE account_id=? AND mailbox=?),?,?,?,?,?,?,?,?,?,?,?,?,?,?)`)
        .run(id, a.id, box, a.id, box, row.message_id, d.subject, d.from, d.fromName, d.to.join(', '), d.cc.join(', '), stamp, d.text.slice(0, 200), d.text, stamp, '\\Seen', stamp, now(), d.references || '');
      const insert = db.prepare('INSERT INTO mail_attachment(id,message_id,filename,mime,size) VALUES(?,?,?,?,?)');
      for (const f of d.attachments) insert.run('att_' + randomUUID(), id, f.filename, f.mime, f.size);
      db.prepare("UPDATE mail_delivery SET status='archived',reason='',payload='{}' WHERE id=?").run(id);
      db.exec('RELEASE mail_delivery_archive');
      unsaved.delete(id);
      return { archived: true, messageId: row.message_id };
    } catch (e) {
      db.exec('ROLLBACK TO mail_delivery_archive; RELEASE mail_delivery_archive');
      throw e;
    }
  }

  function deliveryList() {
    const rows = db.prepare(`SELECT d.id, d.account_id AS accountId, d.message_id AS messageId, d.status, d.reason,
      json_extract(d.payload,'$.subject') AS subject, d.created_at AS at
      FROM mail_delivery d WHERE d.status<>'archived' AND ${visible} ORDER BY d.created_at DESC,d.id DESC LIMIT 100`).all();
    return { items: rows.map(row => ({ ...row, ...unsaved.get(row.id), status: inFlight.has(row.id) ? 'sending' : unsaved.get(row.id)?.status || (row.status === 'pending' ? 'unknown' : row.status) })) };
  }

  async function deliver(input, withFiles) {
    const a = account(input.accountId);
    const addresses = (value) => [].concat(value || []).map(s => String(s).trim()).filter(Boolean);
    const to = addresses(input.to), cc = addresses(input.cc);
    if (!to.length) throw new Error('至少一个收件人');
    if (![a.email, ...to, ...cc].every(addr => /^[^\s<>,;@\x00-\x1f]+@[^\s<>,;@\x00-\x1f]+$/.test(addr))) throw new Error('邮箱地址格式无效');
    const refs = thread(input, a.id);
    const files = withFiles ? await loadAttachments(input, a.id) : [];
    const p = await password(a);
    const guard = () => {
      if (account(a.id).rev !== a.rev) throw new Error('邮箱账户配置已变更，请重试');
      if (input.originId) thread(input, a.id);
    };
    guard();
    const id = 'delivery_' + randomUUID(), messageId = '<' + randomUUID() + '@dsh-workbench>';
    const payload = { ...refs, to, cc, subject: String(input.subject || ''), text: String(input.text || ''), from: a.email, fromName: a.name || '',
      attachments: files.map(({ filename, mime, size }) => ({ filename, mime, size })) };
    db.prepare("INSERT INTO mail_delivery(id,account_id,message_id,status,payload,created_at) VALUES(?,?,?,'pending',?,?)")
      .run(id, a.id, messageId, JSON.stringify(payload), now());
    inFlight.add(id);
    const base = { id, messageId };
    function saveOutcome(status, reason = '') {
      try { update(id, status, reason); } catch { unsaved.set(id, { status, reason }); }
    }
    try {
      await sendMail({ host: a.smtp_host, port: a.smtp_port, secure: !!a.smtp_tls, user: p.user }, p.secret,
        { ...payload, attachments: files, messageId }, guard);
    } catch (e) {
      const status = e.deliveryUnknown ? 'unknown' : e.smtpCode >= 400 && e.smtpCode < 600 ? 'rejected' : 'not_sent';
      const reason = String(e.message || e).slice(0, 240);
      saveOutcome(status, reason);
      return { ...base, sent: false, status, reason };
    } finally { inFlight.delete(id); }
    saveOutcome('accepted');
    try {
      deliveryArchive({ id });
      return { ...base, sent: true, archived: true, status: 'archived' };
    } catch {
      return { ...base, sent: true, archived: false, status: 'accepted' };
    }
  }
  return { send: (input = {}) => deliver(input, false), composeSend: (input = {}) => deliver(input, true), deliveryList, deliveryArchive };
}
