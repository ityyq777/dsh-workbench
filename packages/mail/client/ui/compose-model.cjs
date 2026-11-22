'use strict';
const labels = { new: '写信', reply: '回复', replyAll: '全部回复', forward: '转发' };
// Split only outside display-name quotes and angle brackets; never quietly drop invalid manual input.
function addresses(value, strict) {
  const out = []; let token = '', quoted = false, angle = false, escaped = false;
  function add() {
    const s = token.trim(); token = ''; if (!s) return;
    const hit = /<([^<>]+)>$/.exec(s); const addr = (hit ? hit[1] : s).trim();
    if (!/^[^\s<>,;@\x00-\x1f]+@[^\s<>,;@\x00-\x1f]+$/.test(addr)) {
      if (strict) throw new Error('邮箱地址格式无效：' + s); return;
    }
    out.push(addr);
  }
  for (const c of String(value || '')) {
    if (!quoted && !angle && /[,，;；\n]/.test(c)) { add(); continue; }
    token += c;
    if (escaped) { escaped = false; continue; }
    if (quoted && c === '\\') escaped = true;
    else if (c === '"') quoted = !quoted;
    else if (!quoted && c === '<') angle = true;
    else if (!quoted && c === '>') angle = false;
  }
  add(); return out;
}
function unique(list, seen) {
  return list.filter(a => { const key = a.toLowerCase(); if (seen.has(key)) return false; seen.add(key); return true; });
}
function initial(mode, m, body, accounts) {
  if (!m) return { key:'new', mode:'new', originId:'', accountId:'', to:'', cc:'', subject:'', text:'' };
  const self = new Set(accounts.map(a => a.email.toLowerCase())); const seen = new Set(self);
  const senders = addresses(m.from); const fromSelf = senders.length && senders.every(a => self.has(a.toLowerCase()));
  const forward = mode === 'forward'; const replyTo = addresses(m.replyTo);
  const primary = fromSelf ? addresses(m.to) : replyTo.length ? replyTo : senders;
  const to = forward ? [] : unique(mode === 'replyAll' ? primary.concat(addresses(m.to)) : primary, seen);
  const cc = mode === 'replyAll' ? unique(addresses(m.cc), seen) : [];
  const prefix = forward ? 'Fwd:' : 'Re:'; const subject = m.subject || '';
  return { key:mode + ':' + m.id, accountId:m.accountId, originId:m.id, mode, to:to.join(', '), cc:cc.join(', '),
    subject:(forward ? /^(fwd?|转发):/i : /^(re|回复):/i).test(subject) ? subject : prefix + ' ' + subject,
    text:forward ? '\n\n---------- 转发邮件 ----------\n发件人：' + m.from + '\n收件人：' + m.to + '\n主题：' + subject + '\n\n' + body : '' };
}
module.exports = { labels, addresses, unique, initial };
