import { test } from 'node:test';
import assert from 'node:assert/strict';
import shortcuts from '../client/views/folder-shortcuts.cjs';

function render(folders, selected, onChange) {
  const h = (tag, props, children) => ({ tag, props, children });
  return shortcuts({ h, folders, selected, accountId: 'a', onChange });
}
const box = (name, role, extra = {}) => ({ name, role, account_id: 'a', ...extra });

test('快捷导航使用当前账户实际角色，名称本地化不影响路由', () => {
  const calls = [];
  const nav = render([box('回收站', 'trash'), box('寄件备份', 'sent'), box('草稿', 'drafts'), box('INBOX', 'inbox'), box('收据', ''), box('其他账户', 'sent', { account_id: 'b' })], 'INBOX', name => calls.push(name));
  assert.deepEqual(nav.children.map(x => x.children), ['收件箱', '草稿箱', '已发送', '废纸篓']);
  assert.equal(nav.children[0].props['aria-current'], 'page');
  nav.children[0].props.onClick();
  nav.children[2].props.onClick();
  assert.deepEqual(calls, ['寄件备份']);
});

test('本地已发送与远端已发送分开，同名其他账户文件夹不会泄漏', () => {
  const nav = render([box('Sent', '', { localOnly: true }), box('发件箱', 'sent')], 'Sent');
  assert.deepEqual(nav.children.map(x => x.children), ['已发送 · Sent（仅本地）', '已发送 · 发件箱']);
  assert.equal(nav.children[0].props['aria-current'], 'page');
  assert.equal(render([box('Archive', ''), box('Sent', 'sent', {account_id: 'b'})], 'INBOX'), null);
});
