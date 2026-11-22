import { visibleDraft } from '../db/visibility.js';

const modes = new Set(['new', 'reply', 'replyAll', 'forward']);
function keyOf(input) {
  const key = String(input.key || '');
  if (!/^[\w:.-]{1,220}$/.test(key)) throw new Error('无效草稿编号');
  return key;
}
function parentId(value) {
  const id = String(value || '').trim().replace(/^<([^<>]+)>$/, '$1');
  return /^[^<>@\s\x00-\x1f]+@[^<>@\s\x00-\x1f]+$/.test(id) && id.length <= 250 ? '<' + id + '>' : '';
}
export function createComposer({ db, message, account }) {
  function context(input, accountId) {
    const mode = String(input.mode || 'new');
    if (!modes.has(mode)) throw new Error('写信模式无效');
    if (mode === 'new' && !input.originId) return null;
    if (mode === 'new' || !input.originId) throw new Error('原信与写信模式不匹配');
    const original = message(String(input.originId));
    if (!original || original.accountId !== accountId) throw new Error('请使用原邮件账户发送');
    return original;
  }
  function thread(input, accountId) {
    const original = context(input, accountId);
    if (!original || input.mode === 'forward') return {};
    const id = parentId(original.messageId);
    if (!id) return {};
    const refs = (String(original.references || '').match(/<[^<>\s]+>/g) || []).map(parentId).filter(Boolean);
    return { inReplyTo: id, references: [...new Set([...refs.filter(x => x !== id), id])].slice(-20).join(' ') };
  }
  function draftGet(input) {
    const row = db.prepare(`SELECT payload FROM mail_draft d WHERE key=? AND ${visibleDraft}`).get(keyOf(input));
    return { draft: row ? JSON.parse(row.payload) : null };
  }
  function draftSave(input) {
    const key = keyOf(input);
    const draft = { key, mode: input.mode || 'new' };
    for (const field of ['accountId', 'originId', 'to', 'cc', 'subject', 'text']) draft[field] = String(input[field] || '');
    if (draft.accountId) account(draft.accountId);
    context(draft, draft.accountId);
    db.prepare('INSERT INTO mail_draft(key,payload,updated_at) VALUES (?,?,?) ON CONFLICT(key) DO UPDATE SET payload=excluded.payload, updated_at=excluded.updated_at').run(key, JSON.stringify(draft), Date.now());
    return { saved: true, key };
  }
  function draftList() {
    return { items: db.prepare(`SELECT key,json_extract(payload,'$.subject') AS subject,json_extract(payload,'$.mode') AS mode,updated_at AS updatedAt FROM mail_draft d WHERE ${visibleDraft} ORDER BY updated_at DESC,key`).all() };
  }
  function draftDelete(input) { const key = keyOf(input); db.prepare('DELETE FROM mail_draft WHERE key=?').run(key); return { deleted: true, key }; }
  return { thread, draftGet, draftSave, draftList, draftDelete };
}
