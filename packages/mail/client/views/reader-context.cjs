"use strict";
function neighbor(order, live, id, step) {
  const start = order.indexOf(id);
  if (start < 0) return null;
  const byId = new Map(live.map(m => [m.id, m]));
  for (let i = start + step; i >= 0 && i < order.length; i += step) {
    if (byId.has(order[i])) return byId.get(order[i]);
  }
  return null;
}
function capture(pane, items, id) {
  const box = pane?.querySelector('.wbml-state-box'), list = pane?.querySelector('.wbml-list');
  const host = pane?.closest('.wb-immersive-main');
  return { order: items.map(m => m.id), id, box: box?.scrollTop || 0, list: list?.scrollTop || 0, host: host?.scrollTop || 0 };
}
function restore(pane, saved) {
  if (!pane) return;
  const row = Array.from(pane.querySelectorAll('[data-mail-id]')).find(el => el.dataset.mailId === String(saved.id));
  (row || pane).focus({ preventScroll: true });
  for (const [node, top] of [[pane.querySelector('.wbml-state-box'), saved.box], [pane.querySelector('.wbml-list'), saved.list], [pane.closest('.wb-immersive-main'), saved.host]]) {
    if (node) node.scrollTop = top;
  }
}
function accountLabel(accounts, m) {
  const a = accounts.find(it => it.id === m.accountId);
  if (!a) return m.accountName || '未知账户';
  return a.name && a.email && a.name !== a.email ? a.name + ' <' + a.email + '>' : a.email || a.name || '未知账户';
}
module.exports = { neighbor, capture, restore, accountLabel };
