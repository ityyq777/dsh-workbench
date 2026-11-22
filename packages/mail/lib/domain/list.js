import { messageRow } from '../db/db.js';
import { activeAccount } from '../db/visibility.js';

function decode(cursor, scope) {
  try {
    const [date, id, key] = JSON.parse(Buffer.from(cursor, 'base64url').toString());
    if (!Number.isSafeInteger(date) || typeof id !== 'string' || !id || key !== scope) throw new Error();
    return [date, id];
  } catch { throw new Error('邮件分页游标无效，请刷新列表'); }
}

export function listMessages(db, input = {}) {
  const { accountId = '', mailbox = '', q = '', unread = false, unifiedInbox = false } = input;
  if (unifiedInbox && (accountId || mailbox)) throw new Error('统一收件箱不接受单独的账户或文件夹筛选');
  const scope = JSON.stringify([accountId, mailbox, q, !!unread, !!unifiedInbox]);
  const cond = [activeAccount('m.account_id')], args = [];
  if (unifiedInbox) cond.push(`m.uid>0 AND m.mailbox='INBOX' COLLATE NOCASE AND EXISTS (SELECT 1 FROM mail_account a WHERE a.id=m.account_id AND a.enabled=1)`);
  const limit = Math.min(200, Math.max(1, Math.trunc(Number(input.limit) || 30)));
  if (accountId) { cond.push('account_id=?'); args.push(accountId); }
  if (mailbox) { cond.push('mailbox=?'); args.push(mailbox); }
  if (unread) cond.push("flags NOT LIKE '%\\Seen%'");
  if (q) {
    const pattern = '%' + String(q).replace(/[\\%_]/g, '\\$&') + '%';
    cond.push("(subject LIKE ? ESCAPE '\\' OR from_addr LIKE ? ESCAPE '\\')"); args.push(pattern, pattern);
  }
  if (input.cursor) { cond.push('(date_at,id)<(?,?)'); args.push(...decode(input.cursor, scope)); }
  const rows = db.prepare(`SELECT id,account_id,mailbox,uid,uid_validity,message_id,subject,from_addr,from_name,to_addr,cc_addr,date_at,preview,body_at,flags,created_at,
    (SELECT att.filename FROM mail_attachment att WHERE att.message_id=m.id ORDER BY att.rowid LIMIT 1) AS attachment_name,
    (SELECT a.name FROM mail_account a WHERE a.id=m.account_id) AS account_name
    FROM mail_message m WHERE ${cond.join(' AND ')} ORDER BY date_at DESC,id DESC LIMIT ?`).all(...args, limit + 1);
  const hasMore = rows.length > limit;
  if (hasMore) rows.pop();
  const tail = rows.at(-1);
  const items = rows.map(r => { const m = messageRow(r); delete m.body; return { ...m, accountName: r.account_name, hasAttachment: r.attachment_name != null ? true : null, attachmentName: r.attachment_name || '' }; });
  return { items, hasMore, nextCursor: hasMore ? Buffer.from(JSON.stringify([tail.date_at,tail.id,scope])).toString('base64url') : null };
}
