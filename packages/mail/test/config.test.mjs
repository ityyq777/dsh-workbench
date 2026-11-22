/**
 * 邮件配置项：默认值、读写容错、action 契约。
 * 配置存宿主 meta 表（键 config.mail.<id>），读永远宽松、写严格报错。
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import {
  configState,
  configValues,
  loadConfig,
  registerConfigActions,
  resetConfig,
  writeConfig,
} from '../lib/infra/config.js';

function db() {
  const d = new DatabaseSync(':memory:');
  d.exec('CREATE TABLE meta(k TEXT PRIMARY KEY, v TEXT NOT NULL)');
  return d;
}

function register(database) {
  const actions = new Map();
  registerConfigActions({ action: (name, def) => actions.set(name, def), db: database });
  return actions;
}

test('未配置时十项都取默认值，且没有任何覆盖项', () => {
  const d = db();
  const state = configState(d);
  assert.deepEqual(state.values, {
    'images.remote': true,
    'display.html': true,
    'display.mailTheme': 'original',
    'read.autoSeen': true,
    'list.pageSize': 20,
    'autosync.enabled': true,
    'autosync.mode': 'interval',
    'autosync.intervalSec': 300,
    'autosync.notify': true,
    'debug.fetch': false,
  });
  assert.deepEqual(state.overrides, {});
  assert.deepEqual(state.warnings, []);
  assert.equal(state.table, 'meta');
  assert.equal(state.items.length, 10);
  const theme = state.items.find((item) => item.id === 'display.mailTheme');
  assert.equal(theme.type, 'multi');
  assert.deepEqual(theme.values, ['original', 'app']);
  assert.equal(theme.default, 'original');
  assert.deepEqual(
    state.groups.map((g) => g.id),
    ['images', 'display', 'read', 'list', 'autosync', 'debug'],
  );
  // 声明了 surface/apply：mount = 下次挂载视图时生效，background = 后台立即生效。
  for (const item of state.items) {
    assert.equal(item.surface, 'ui');
    assert.ok(['mount', 'background'].includes(item.apply), item.id + ' 的 apply 取值不在约定内');
    if (item.group === 'autosync') assert.equal(item.apply, 'background');
    else assert.equal(item.apply, 'mount');
    assert.ok(item.zh && item.hintZh, item.id + ' 需要中文说明');
  }
});

test('坏了的值不炸：未知键、非法 JSON、越界数字都回退默认并给 warnings', () => {
  const d = db();
  const put = d.prepare('INSERT INTO meta(k,v) VALUES(?,?)');
  put.run('config.mail.images.remote', 'false');
  put.run('config.mail.list.pageSize', '999');
  put.run('config.mail.read.autoSeen', 'not-json');
  put.run('config.mail.nope', 'true');
  const loaded = loadConfig(d);
  assert.equal(loaded.values['images.remote'], false);
  assert.equal(loaded.values['list.pageSize'], 20);
  assert.equal(loaded.values['read.autoSeen'], true);
  assert.deepEqual(Object.keys(loaded.overrides), ['images.remote']);
  const codes = loaded.warnings.map((w) => w.code).sort();
  assert.deepEqual(codes, ['config_bad_json', 'config_invalid', 'config_unknown_key']);
});

test('meta 表不存在时按默认值继续（老库/未初始化）', () => {
  const d = new DatabaseSync(':memory:');
  assert.equal(configValues(d)['list.pageSize'], 20);
});

test('写入校验类型与范围，事务内一次落库', () => {
  const d = db();
  const ok = writeConfig(d, { 'images.remote': false, 'list.pageSize': 30 });
  assert.deepEqual(ok.changed.sort(), ['images.remote', 'list.pageSize']);
  assert.equal(ok.values['images.remote'], false);
  assert.equal(ok.values['list.pageSize'], 30);
  assert.deepEqual(configState(d).overrides, { 'images.remote': false, 'list.pageSize': 30 });

  assert.throws(() => writeConfig(d, { 'list.pageSize': 5 }), /10–50/);
  assert.throws(() => writeConfig(d, { 'images.remote': 'yes' }), /true\/false/);
  assert.throws(() => writeConfig(d, { unknown: 1 }), /未知配置项/);
  assert.throws(() => writeConfig(d, {}), /没有要保存/);
  // 失败不留半截状态。
  assert.equal(configValues(d)['list.pageSize'], 30);
});

test('重置回默认值，可按单项重置', () => {
  const d = db();
  writeConfig(d, { 'images.remote': false, 'list.pageSize': 40 });
  const one = resetConfig(d, ['images.remote']);
  assert.deepEqual(one.reset, ['images.remote']);
  assert.equal(one.values['images.remote'], true);
  assert.equal(one.values['list.pageSize'], 40);
  const all = resetConfig(d, []);
  assert.equal(all.reset.length, 10);
  assert.deepEqual(all.values, configValues(d));
  assert.deepEqual(configState(d).overrides, {});
  assert.throws(() => resetConfig(d, ['nope']), /未知配置项/);
});

test('三个 action 可注册并返回 agent 可读的结果', async () => {
  const d = db();
  const actions = register(d);
  assert.deepEqual([...actions.keys()].sort(), ['mail.configGet', 'mail.configReset', 'mail.configSet']);
  const got = await actions.get('mail.configGet').execute();
  assert.equal(got.values['images.remote'], true);
  assert.match(actions.get('mail.configGet').render(got), /邮件配置 10 项/);

  const set = await actions.get('mail.configSet').execute({ values: { 'images.remote': false } });
  assert.deepEqual(set.changed, ['images.remote']);
  assert.equal(set.values['images.remote'], false);

  const reset = await actions.get('mail.configReset').execute({});
  assert.equal(reset.values['images.remote'], true);
});
