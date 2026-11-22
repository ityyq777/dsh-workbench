import test from 'node:test';
import assert from 'node:assert/strict';
import detailPane from '../client/views/detail-pane.cjs';
const h = (type, props, ...children) => ({ type, props: props || {}, children });
const walk = n => typeof n === 'object' && n ? [n, ...n.children.flatMap(walk)] : [];
const text = n => typeof n === 'string' ? n : n?.children?.map(text).join('') || '';
const message = { id: 'm2', subject: '长主题'.repeat(100), fromName: 'Alice', from: 'alice@example.org', to: '团队 <team@example.org>', cc: 'Bob <bob@example.org>', mailbox: 'INBOX' };
function show(options = {}) { return detailPane(h, { current: message, accountLabel: '工作 <me@example.org>', time: '10:00', expanded: false, ...options }, null, '正文'); }
test('保留返回和翻信动作，展开切换后标题与原正文仍在', () => {
  const ops = []; const action = name => () => ops.push(name);
  const pane = show({ back: action('back'), toggle: action('expand'), next: action('next') });
  const buttons = walk(pane).filter(n => n.type === 'button' || n.props.disabled !== undefined);
  for (const label of ['展开阅读', '下一封', '返回列表']) buttons.find(n => text(n) === label).props.onClick();
  assert.deepEqual(ops, ['expand', 'next', 'back']);
  assert.equal(buttons.find(n => text(n) === '上一封').props.disabled, true);
  const expanded = show({ expanded: true });
  assert.match(expanded.props.className, /is-expanded/);
  assert.equal(walk(expanded).find(n => n.type === 'button').props['aria-pressed'], true);
  assert.equal(text(walk(expanded).find(n => n.type === 'h3')), message.subject);
  assert.ok(text(expanded).endsWith('正文'));
});
test('信头常显发件人实际地址和账户，收件与抄送用原生可键盘展开的列表', () => {
  const nodes = walk(show());
  assert.equal(text(nodes.find(n => n.props.className === 'wbml-read-sender')), 'Alice<alice@example.org>');
  assert.ok(nodes.some(n => text(n) === '收件账户：工作 <me@example.org>'));
  const details = nodes.find(n => n.type === 'details');
  assert.equal(details.props.open, undefined);
  assert.equal(details.children[0].type, 'summary');
  assert.ok(text(details).includes(message.to) && text(details).includes(message.cc));
  const onlyTo = show({ current: { ...message, cc: '' } });
  assert.equal(walk(onlyTo).some(n => n.type === 'details'), false);
  assert.ok(walk(onlyTo).some(n => text(n) === '收件人：' + message.to));
  for (const to of ['a@example.org, b@example.org', 'x'.repeat(65) + '@example.org']) {
    assert.equal(text(walk(show({ current: { ...message, to, cc: '' } })).find(n => n.type === 'summary')), '收件人');
  }
  assert.equal(walk(show({ current: { id:'local' } })).some(n => n.type === 'details'), false);
});
