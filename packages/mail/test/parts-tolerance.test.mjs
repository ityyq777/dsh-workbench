/** 正文分段容错：服务器声明尺寸与真实字节不一致时也要能读出来，且截断要可观测。
 *
 * 用真实 TLS 假 IMAP 服务器模拟四种现场：短 literal、长 literal、服务器忽略 partial、
 * 多段共享 1 MiB 预算。断言都不再硬失败，truncated 标记与诊断日志正确。
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import tls from 'node:tls';
import { once } from 'node:events';
import { DatabaseSync } from 'node:sqlite';
import { ensureSchema } from '../lib/db/db.js';
import { createMail } from '../lib/domain/mail.js';
import { setFetchDebug } from '../lib/infra/parts.js';
import { testTls } from './tls-fixture.mjs';

const KiB = 1024;
const textPart = (declared) => `("TEXT" "PLAIN" ("CHARSET" "utf-8") NIL NIL "8BIT" ${declared} 1)`;

async function fixture(t, structure, bodies, opts = {}) {
  const db = new DatabaseSync(':memory:');
  ensureSchema(db);
  const requests = [];
  const state = { structure };
  const server = tls.createServer(testTls(), (sock) => {
    sock.on('error', () => {});
    sock.write('* OK ready\r\n');
    let input = '';
    sock.on('data', (data) => {
      input += data.toString('latin1');
      let i;
      while ((i = input.indexOf('\r\n')) >= 0) {
        const line = input.slice(0, i);
        input = input.slice(i + 2);
        const tag = line.split(' ')[0];
        if (line.includes(' SELECT ')) sock.write('* 1 EXISTS\r\n* OK [UIDVALIDITY 8] ok\r\n');
        else if (line.includes(' UID FETCH ')) {
          requests.push(line.slice(tag.length + 1));
          if (line.includes('BODYSTRUCTURE')) sock.write(`* 1 FETCH (BODYSTRUCTURE ${state.structure} UID 1)\r\n`);
          else {
            const partial = /BODY\.PEEK\[([\d.]+)\]<0\.(\d+)>/.exec(line);
            const section = (partial || /BODY\.PEEK\[([\d.]+)\]/.exec(line))?.[1];
            if (!bodies[section]) {
              sock.write(`${tag} NO unavailable\r\n`);
              continue;
            }
            let bytes = Buffer.from(bodies[section]);
            // 真正的 partial 服务器会只回前 N 字节，并把 <0> 写回 key；这里默认模拟「忽略 partial」。
            if (partial && opts.honorPartial) bytes = bytes.subarray(0, Number(partial[2]));
            const key = `BODY[${section}]` + (partial && opts.echoPartialKey !== false ? '<0>' : '');
            sock.write(`* 1 FETCH (${key} {${bytes.length}}\r\n`);
            sock.write(bytes);
            sock.write(' UID 1)\r\n');
          }
        }
        sock.write(`${tag} OK completed\r\n`);
      }
    });
  });
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.after(() => {
    server.close();
    db.close();
  });
  const m = createMail({ db, host: { call: async () => ({ result: { secret: 'pw' } }) } });
  const a = m.createAccount({ name: 'test', email: 'me@example.org', imapHost: '127.0.0.1', imapPort: server.address().port, imapTls: true, smtpHost: 's', secretId: 'sec' });
  db.prepare('INSERT INTO mail_message(id,account_id,mailbox,uid,uid_validity,date_at,created_at,updated_at) VALUES(?,?,?,1,8,1,1,1)').run('m1', a.id, 'INBOX');
  return { m, requests, state };
}

function captureLog(sink) {
  const original = console.warn;
  console.warn = (...args) => sink.push(args.join(' '));
  return () => {
    console.warn = original;
  };
}

test('短 literal：声明比实际长时接受已读字节并标 truncated，不再整封失败', async (t) => {
  const body = Buffer.from('只有二十个字节的正文', 'utf8');
  const { m } = await fixture(t, `(${textPart(body.length + 80)} "MIXED")`, { 1: body });
  const r = await m.messageBody({ id: 'm1' });
  assert.equal(r.ok, true, r.message);
  assert.equal(r.body, '只有二十个字节的正文');
  assert.equal(r.truncated, true, '字节不够要留下截断标记');
  // 落库后重复打开直接读缓存，不再联网。
  const again = await m.messageBody({ id: 'm1' });
  assert.equal(again.cached, true);
  assert.equal(again.truncated, true);
});

test('长 literal：实际比声明长时按声明长度截断，后续分段照常读取', async (t) => {
  const first = Buffer.from('abcd' + 'x'.repeat(36), 'utf8');
  const second = Buffer.from('第二段正文', 'utf8');
  const structure = `((${textPart(4)}${textPart(second.length)} "ALTERNATIVE") "MIXED")`;
  const { m } = await fixture(t, structure, { '1.1': first, '1.2': second });
  const r = await m.messageBody({ id: 'm1' });
  assert.equal(r.ok, true, r.message);
  assert.equal(r.body, 'abcd\n\n第二段正文');
  assert.equal(r.truncated, false, '多出来的字节按声明截断即可，不算截断');
});

test('服务器忽略 partial：响应 key 不带 <0> 时自动按整段处理', async (t) => {
  const body = Buffer.from('短正文', 'utf8');
  // 声明 1.5 MiB 超过 1 MiB 文本预算，会走 <0.1048576> 分段；服务器实际只回这几个字节且忽略 partial。
  const { m, requests } = await fixture(t, `(${textPart(1536 * KiB)} "MIXED")`, { 1: body });
  const r = await m.messageBody({ id: 'm1' });
  assert.equal(r.ok, true, r.message);
  assert.equal(r.body, '短正文');
  assert.equal(r.truncated, true);
  assert.match(requests.join('\n'), /BODY\.PEEK\[1\]<0\.1048576>/, '先按预算请求 partial');
});

test('多段共享预算：第二段被预算切开时也读得出来并整体标 truncated', async (t) => {
  const first = Buffer.from('a'.repeat(700 * KiB), 'utf8');
  const second = Buffer.from('b'.repeat(700 * KiB), 'utf8');
  const structure = `((${textPart(first.length)}${textPart(second.length)} "ALTERNATIVE") "MIXED")`;
  const { m } = await fixture(t, structure, { '1.1': first, '1.2': second });
  const r = await m.messageBody({ id: 'm1' });
  assert.equal(r.ok, true, r.message);
  assert.equal(r.truncated, true);
  assert.ok(r.body.length > 0);
  assert.ok(Buffer.byteLength(r.body, 'utf8') <= 1024 * KiB, '正文仍受 1 MiB 预算约束');
});

test('诊断开关：打开时记录 section/声明尺寸/实际字节/响应 key，关闭时一条都不打', async (t) => {
  const body = Buffer.from('诊断用正文', 'utf8');
  const sink = [];
  const { m } = await fixture(t, `(${textPart(body.length + 40)} "MIXED")`, { 1: body });

  setFetchDebug(() => true);
  const stop = captureLog(sink);
  try {
    const r = await m.messageBody({ id: 'm1' });
    assert.equal(r.ok, true, r.message);
  } finally {
    stop();
    setFetchDebug(null);
  }
  const lines = sink.filter((line) => line.includes('[mail.fetch]'));
  assert.equal(lines.length, 1, '每读一个分段打一条');
  const event = JSON.parse(lines[0].slice(lines[0].indexOf('{')));
  assert.equal(event.section, '1');
  assert.equal(event.declared, body.length + 40, '记录服务器声明的尺寸');
  assert.equal(event.actual, body.length, '记录真实读到的字节数');
  assert.equal(event.key, 'BODY[1]');
  assert.equal(event.truncated, true);

  // 默认关闭：同样的邮件再读一次（换一封），不应产生任何诊断日志。
  const sink2 = [];
  const second = await fixture(t, `(${textPart(10)} "MIXED")`, { 1: Buffer.from('x') });
  const stop2 = captureLog(sink2);
  try {
    await second.m.messageBody({ id: 'm1' });
  } finally {
    stop2();
  }
  assert.equal(sink2.filter((line) => line.includes('[mail.fetch]')).length, 0);
});
