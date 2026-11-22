import test from 'node:test';
import assert from 'node:assert/strict';
import { registerMailActions } from '../lib/domain/actions.js';

// 服务端 action 现在统一过保险箱门禁（api.call("vault.status")），execute 一律是异步的。
function register(vaultStatus = { locked: false, initialized: true }, set = { id: 'set1', account: 'me@test', secrets: [{ id: 'sec1' }] }) {
  const actions = new Map();
  const handlers = new Proxy({}, { get: (_, method) => (...inputs) => ({ method, inputs }) });
  const call = async (name) => {
    if (name === 'vault.status') {
      if (vaultStatus instanceof Error) throw vaultStatus;
      return { result: vaultStatus };
    }
    if (name === 'vault.setGet') return { result: set };
    throw new Error('unexpected action ' + name);
  };
  registerMailActions({ action: (name, def) => actions.set(name, def), call }, handlers);
  return actions;
}

const draft = { key: 'remember', accountId: 'a1', to: 'one@test', cc: 'two@test', subject: '主题', text: '正文', mode: 'replyAll', originId: 'origin' };
const send = { accountId: 'a1', to: ['one@test'], cc: ['two@test'], subject: 'Re: 主题', text: '回复', mode: 'reply', originId: 'origin' };
const list = { accountId: 'a1', mailbox: 'Archive', unifiedInbox: false, unread: false, q: '%', limit: 3, cursor: 'opaque' };
const page = { mailbox: 'Archive', limit: 4, beforeUid: 20, uidValidity: 42 };

test('每个新参数显式声明并交给对应服务，未声明参数不透传', async () => {
  const actions = register();
  const cases = [
    ['mail.messageList', 'messages', list, [list]],
    ['mail.sync', 'sync', { id: 'a1', ...page }, ['a1', page]],
    ['mail.messageMarkRead', 'markRead', { id: 'm', ids: ['m'], read: false }],
    ['mail.messageSend', 'send', send],
    ['mail.messageBody', 'messageBody', { id: 'm', force: false }],
    ['mail.messageMove', 'move', { id: 'm', mailbox: 'Archive' }],
    ['mail.messageDelete', 'remove', { id: 'm' }],
    ['mail.attachmentDownload', 'attachmentDownload', { id: 'att' }],
    ['mail.draftList', 'draftList', {}, []],
    ['mail.draftGet', 'draftGet', { key: 'k' }],
    ['mail.draftSave', 'draftSave', draft],
    ['mail.draftDelete', 'draftDelete', { key: 'k' }],
  ];
  for (const [name, method, args, inputs = [args]] of cases) {
    const def = actions.get(name);
    assert.deepEqual(Object.keys(def.input.properties).sort(), Object.keys(args).sort(), name);
    assert.deepEqual(await def.execute({ ...args, extra: 'ignored' }, { origin: 'ui' }), { method, inputs }, name);
  }
  assert.deepEqual(actions.get('mail.messageSend').input.properties.mode.enum, ['new', 'reply', 'replyAll', 'forward']);
  assert.equal(actions.get('mail.sync').input.properties.uidValidity.type, 'integer');
});

test('草稿与附件硬锁只留给界面；发信支持 agent 但默认不给', async () => {
  const actions = register();
  for (const suffix of ['attachmentDownload', 'draftList', 'draftGet', 'draftSave', 'draftDelete']) {
    const name = `mail.${suffix}`, def = actions.get(name);
    assert.deepEqual(def.origins, ['ui'], name);
    for (const origin of ['agent', 'plugin', 'sync', undefined]) {
      await assert.rejects(() => def.execute({ id: 'x', key: 'x', origin: 'ui' }, { origin }), /界面/, name);
    }
  }
  const sendDef = actions.get('mail.messageSend');
  assert.deepEqual(sendDef.origins, ['ui', 'agent']);
  assert.deepEqual(sendDef.originsDefault, ['ui']);
  assert.deepEqual((await sendDef.execute(send, { origin: 'agent' })).inputs, [send]);
  await assert.rejects(() => sendDef.execute(send, { origin: 'plugin' }), /界面/);
});

test('保险箱锁定时读接口一律 VAULT_LOCKED，无隐私的动作仍放行', async () => {
  const locked = register({ locked: true, initialized: true });
  for (const name of ['mail.status', 'mail.accountList', 'mail.mailboxList', 'mail.messageList', 'mail.messageGet', 'mail.messageBody', 'mail.attachmentDownload', 'mail.draftList', 'mail.draftGet', 'mail.dataQuery', 'mail.dataTables', 'mail.serverSearch', 'mail.sync', 'mail.messageDelete']) {
    const def = locked.get(name);
    await assert.rejects(
      () => def.execute({ id: 'm', key: 'k', q: 'x', accountId: 'a', mailbox: 'INBOX', table: 'mail_message', force: false }, { origin: 'ui' }),
      (e) => e.code === 'VAULT_LOCKED' && /保险箱已锁定/.test(e.message) && /解锁/.test(e.message),
      name,
    );
  }
  // 服务商预设表与本域 action 清单不含邮件内容，锁定态下照常可用。
  for (const name of ['mail.providerList', 'mail.actionSchema']) {
    const def = locked.get(name);
    const out = await def.execute({}, { origin: 'ui' });
    assert.ok(out && typeof out === 'object', name);
  }
  // 保险箱未安装（api.call 抛错）与状态读不到都按锁定处理。
  const broken = register(new Error('业务插件未注册该 action：vault.status'));
  await assert.rejects(() => broken.get('mail.status').execute({}, { origin: 'ui' }), (e) => e.code === 'VAULT_LOCKED');
  const empty = register({});
  await assert.rejects(() => empty.get('mail.status').execute({}, { origin: 'ui' }), (e) => e.code === 'VAULT_LOCKED');
});

test('账户先选账号集合：集合必填，邮箱由集合账号带出，凭据必须属于该集合', async () => {
  const actions = register();
  const create = actions.get('mail.accountCreate');
  await assert.rejects(() => create.execute({ name: 'A', email: 'x@test' }, { origin: 'ui' }), /账号集合/);
  await assert.rejects(() => create.execute({ name: 'A', email: 'x@test', accountSetId: 'set1', secretId: 'nope' }, { origin: 'ui' }), /不在这个账号集合/);
  const ok = await create.execute({ name: 'A', email: 'x@test', accountSetId: 'set1', secretId: 'sec1' }, { origin: 'ui' });
  assert.equal(ok.inputs[0].email, 'me@test', '邮箱地址由集合账号覆盖');
  assert.equal(ok.inputs[0].accountSetId, 'set1');
  assert.equal(ok.inputs[0].secretId, 'sec1');

  const emptySet = register({ locked: false, initialized: true }, { id: 'set2', account: '', secrets: [] });
  await assert.rejects(() => emptySet.get('mail.accountCreate').execute({ name: 'A', email: 'x@test', accountSetId: 'set2' }, { origin: 'ui' }), /没有填写账号/);

  const missing = register({ locked: false, initialized: true }, {});
  await assert.rejects(() => missing.get('mail.accountCreate').execute({ name: 'A', email: 'x@test', accountSetId: 'set3' }, { origin: 'ui' }), /所选账号集合不存在/);
  assert.equal(actions.get('mail.accountCreate').input.properties.accountSetId.type, 'string');
  assert.deepEqual(actions.get('mail.accountCreate').input.required, ['name', 'email', 'accountSetId']);
});
