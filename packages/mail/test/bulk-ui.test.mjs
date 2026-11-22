import test from 'node:test';
import assert from 'node:assert/strict';
import bulk from '../client/views/bulk.cjs';

function message(id, overrides = {}) {
  return { id, uid: 1, uidValidity: 9, accountId: id, mailbox: 'INBOX', flags: '', ...overrides };
}
const active = () => true;

test('确认范围固定在发起页：新来信、已读和未知远端身份均不扩大范围', () => {
  const list = [message('a'), message('b', { flags: '\\Seen' }), message('c', { uid: -1 }), message('d', { uidValidity: 0 })];
  const read = bulk.snapshot(list, 'read', new Set());
  const trash = bulk.snapshot(list, 'trash', new Set(['b', 'c', 'd']));
  list.push(message('later')); list[0].uid++;
  assert.deepEqual(read.map(x => [x.id, x.uid]), [['a', 1]]);
  assert.deepEqual(trash.map(x => x.id), ['b']);
});

test('按原账户逐封移入废纸篓，部分失败后只重试失败项', async () => {
  const list = [message('a'), message('b')], calls = [];
  let offline = true;
  const api = { call(n, { id }) {
    if (n === 'mail.messageGet') return list.find(x => x.id === id);
    assert.equal(n, 'mail.messageDelete'); calls.push(id);
    if (id === 'a' && offline) return { ok: false, error: 'offline' };
    return { trashed: true };
  } };
  const first = await bulk.executeBatch(api, 'trash', list, active);
  assert.deepEqual(first.done, ['b']); assert.equal(first.failed[0].error, 'offline');
  offline = false;
  assert.deepEqual((await bulk.executeBatch(api, 'trash', first.failed.map(f => f.item), active)).done, ['a']);
  assert.deepEqual(calls, ['a', 'b', 'a']);
});

test('执行前核对远端身份，已读为幂等成功，缺回执为失败', async () => {
  const targets = ['local','moved','already','denied','ok'].map(id => message(id));
  const called = [];
  const changes = { local: { uid: -1 }, moved: { mailbox: 'Archive' }, already: { flags: '\\Seen' } };
  const result = await bulk.executeBatch({ call(n, args) {
    if (n === 'mail.messageGet') return message(args.id, changes[args.id]);
    assert.equal(n, 'mail.messageMarkRead'); assert.equal(args.read, true); called.push(args.id);
    return { updated: args.id === 'denied' ? 0 : 1 };
  } }, 'read', targets, active);
  assert.deepEqual(called, ['denied', 'ok']); assert.deepEqual(result.done, ['already', 'ok']);
  assert.deepEqual(result.failed.map(f => f.item.id), ['local', 'moved', 'denied']);
});

test('交互：勾选后取消零写入，确认冻结集合，切页清空选择', async () => {
  const slots = [], calls = [];
  let index = 0;
  const React = { useState(v) { const i = index++; if (!(i in slots)) slots[i] = v;
    return [slots[i], f => { slots[i] = f(slots[i]); }]; },
    useRef(v) { return slots[index++] ||= { current: v }; }, useEffect(){ } };
  const h = (type, props, ...children) => ({ type, props: props || {}, children });
  const list = [message('a'), message('b')];
  const render = (scope = 'page1') => { index = 0; return bulk.useBulk({ React, h, items: list, scope, accounts: [], refresh() {},
    api: { call(n, { id }) { calls.push([n, id]); return n === 'mail.messageGet' ? message(id) : { trashed: true }; } } }); };
  const btn = (ui, title) => ui.toolbar.children.find(node => node?.children?.[0] === title)?.props;
  let ui = render(); btn(ui, '选择邮件').onClick(); ui = render();
  ui.wrapRow(list[0], {}).children[0].props.onChange({ target: { checked: true } });
  ui = render(); btn(ui, '选中邮件移入废纸篓（1）').onClick(); ui = render();
  assert.equal(ui.locked(), true); btn(ui, '取消').onClick(); assert.deepEqual(calls, []);
  ui = render(); btn(ui, '本页全选').onClick(); ui = render(); btn(ui, '选中邮件移入废纸篓（2）').onClick();
  list.push(message('new')); ui = render(); await btn(ui, '确认移入废纸篓').onClick();
  assert.deepEqual(calls.filter(([n]) => n === 'mail.messageDelete').map(([,id]) => id), ['a','b']);
  ui = render(); btn(ui, '选择邮件').onClick(); ui = render(); btn(ui, '本页全选').onClick();
  ui = render('page2'); assert.ok(btn(ui, '选择邮件')); assert.equal(ui.wrapRow(list[0], 'row'), 'row');
});

test('离开筛选范围后停止派发；未读服务器搜索只移除成功项', async () => {
  let live = true;
  const calls = [];
  await bulk.executeBatch({ call(n) { calls.push(n); live = false; return message('a'); } }, 'trash', [message('a'),message('b')], () => live);
  assert.deepEqual(calls, ['mail.messageGet']);
  const server = { data: { items: [message('a'),message('b')], truncated: true } };
  assert.deepEqual(bulk.updateSearch(server, 'read', ['a'], true).data.items.map(x => x.id), ['b']);
  assert.equal(bulk.updateSearch(server, 'read', ['a'], false).data.items[0].flags, '\\Seen');
  assert.equal(server.data.items[0].flags, '');
});
