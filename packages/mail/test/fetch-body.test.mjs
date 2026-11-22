import { test } from 'node:test';
import assert from 'node:assert/strict';
import tls from 'node:tls';
import { once } from 'node:events';
import { DatabaseSync } from 'node:sqlite';
import { ensureSchema } from '../lib/db/db.js';
import { createMail } from '../lib/domain/mail.js';
import { testTls } from './tls-fixture.mjs';

const sample = Buffer.from([0, 255, 128, 0, 13, 10, 41]);
const html = Buffer.from('<p>优惠</p>\r\na2 OK FETCH completed');
const text = Buffer.from([0xd6, 0xd0, 0xce, 0xc4]).toString('base64');
const textPart = `("TEXT" "PLAIN" ("CHARSET" "gbk") NIL NIL "BASE64" ${text.length} 1)`;
const htmlPart = `("TEXT" "HTML" ("CHARSET" "utf-8") NIL NIL "8BIT" ${html.length} 2)`;
const attach = (name, n) => `("APPLICATION" "PDF" NIL NIL NIL "BASE64" ${n} NIL ("ATTACHMENT" ("FILENAME" "${name}")))`;
const pdf = attach('=?utf-8?B?' + Buffer.from('对账单.pdf').toString('base64') + '?=', sample.toString('base64').length);
const big = attach('large.pdf', 16 * 1024 * 1024);
const mixed = `((${textPart}${htmlPart} "ALTERNATIVE")${big}${pdf} "MIXED")`;

async function fixture(t, structure, bodies) {
  const db = new DatabaseSync(':memory:'); ensureSchema(db);
  const requests = [], leases = [];
  const state = { validity: 8, structure };
  const server = tls.createServer(testTls(), sock => {
    sock.on('error', () => {});
    sock.write('* OK ready\r\n'); let input = '';
    sock.on('data', data => {
      input += data.toString('latin1'); let i;
      while ((i = input.indexOf('\r\n')) >= 0) {
        const line = input.slice(0, i); input = input.slice(i + 2);
        const tag = line.split(' ')[0];
        if (line.includes(' SELECT ')) sock.write(`* 1 EXISTS\r\n* OK [UIDVALIDITY ${state.validity}] ok\r\n`);
        else if (line.includes(' UID FETCH ')) {
          requests.push(line.slice(tag.length + 1));
          sock.write('* 99 FETCH (UID 99 FLAGS (\\Seen))\r\n');
          if (line.includes('BODYSTRUCTURE')) sock.write(`* 1 FETCH (BODYSTRUCTURE ${state.structure} UID 1)\r\n`);
          else {
            const section = /BODY\.PEEK\[([\d.]+)\]/.exec(line)?.[1];
            if (!bodies[section]) { sock.write(`${tag} NO unavailable\r\n`); continue; }
            const bytes = Buffer.from(bodies[section]);
            sock.write(`* 1 FETCH (BODY[${section}] {${bytes.length}}\r\n`);
            sock.write(bytes); sock.write(' UID 1)\r\n');
          }
        }
        sock.write(`${tag} OK completed\r\n`);
      }
    });
  });
  server.listen(0, '127.0.0.1'); await once(server, 'listening');
  t.after(() => {server.close(); db.close();});
  const m = createMail({db, host:{call:async name=>{leases.push(name); return {result:{secret:'pw'}};}}});
  const a = m.createAccount({ name: 'test', email: 'me@example.org', imapHost:'127.0.0.1', imapPort:server.address().port, imapTls:true, smtpHost:'s',secretId:'sec'});
  db.prepare('INSERT INTO mail_message(id,account_id,mailbox,uid,uid_validity,date_at,created_at,updated_at) VALUES(?,?,?,1,8,1,1,1)').run('m1', a.id,'INBOX');
  return {m,requests,leases,state,db};
}

test('16 MiB 附件不影响短正文；GBK、嵌套多版本和读取缓存', async t => {
  const {m,requests,leases} = await fixture(t,mixed,{'1.1':text,'1.2':html,3:sample.toString('base64')});
  const r = await m.messageBody({id:'m1'});
  assert.equal(r.ok,true,r.message); assert.equal(r.body,'中文'); assert.equal(r.html,html.toString());
  assert.deepEqual(requests,['UID FETCH 1 (UID BODYSTRUCTURE)','UID FETCH 1 (UID BODY.PEEK[1.1])','UID FETCH 1 (UID BODY.PEEK[1.2])']);
  assert.deepEqual(r.attachments.map(a=>[a.section,a.filename]),[['2','large.pdf'],['3','对账单.pdf']]);
  assert.equal(m.message('m1').preview,'中文'); assert.equal(m.messages({}).items[0].body,undefined);
  assert.equal((await m.messageBody({id:'m1'})).cached,true); assert.equal(leases.length,1);
  const file = await m.attachmentDownload({id:r.attachments[1].id});
  assert.equal(file.size,sample.length); assert.deepEqual(Buffer.from(file.base64,'base64'),sample);
  assert.deepEqual(requests.slice(3),['UID FETCH 1 (UID BODYSTRUCTURE)','UID FETCH 1 (UID BODY.PEEK[3])']);
});

test('内联图片：解析 Content-ID 与 disposition，html 落库后重复打开只读本地', async t => {
  const png = Buffer.from([0x89, 0x50, 0x4e, 0x47]).toString('base64');
  const inline = `("IMAGE" "PNG" ("NAME" "logo.png") "<logo@example.org>" NIL "BASE64" ${png.length} NIL ("INLINE" ("FILENAME" "logo.png")))`;
  const {m,requests} = await fixture(t, `(${htmlPart}${inline} "MIXED")`, {'1': html, '2': png});
  const r = await m.messageBody({id:'m1'});
  assert.equal(r.ok,true,r.message);
  assert.equal(r.html,html.toString());
  assert.equal(r.htmlStale, undefined);
  const image = r.attachments.find(a => a.mime === 'image/png');
  assert.equal(image.contentId,'logo@example.org');
  assert.equal(m.message('m1').html, html.toString());
  assert.equal(m.message('m1').attachments.find(a => a.id === image.id).contentId, 'logo@example.org');
  assert.equal(image.inline, true);
  const before = requests.length;
  const again = await m.messageBody({id:'m1'});
  assert.equal(again.cached,true); assert.equal(again.html, html.toString()); assert.equal(again.htmlStale,false);
  assert.equal(requests.length,before,'命中缓存不得再连 IMAP');
});

test('纯附件：正文为空，读信仅列元信息；UIDVALIDITY 改变禁止保存',async t=>{
  const {m,requests,state} = await fixture(t,pdf,{1:sample.toString('base64')});
  const r = await m.messageBody({id:'m1'}); assert.equal(r.ok,true,r.message);
  assert.equal(r.body,''); assert.equal(r.attachments[0].section,'1'); assert.equal(requests.length,1);
  assert.equal((await m.messageBody({id:'m1'})).cached,true);
  state.validity++; await assert.rejects(m.attachmentDownload({id:r.attachments[0].id}),/UIDVALIDITY/);
  assert.equal(requests.length,1);
});

test('本地副本只列附件信息，下载不申请保险箱租约或发出远端请求',async t=>{
  const {m,requests,leases,db} = await fixture(t,pdf,{});
  const r = await m.messageBody({id:'m1'}); assert.equal(r.ok,true,r.message);
  db.prepare('UPDATE mail_message SET uid=-1,uid_validity=0 WHERE id=?').run('m1');
  await assert.rejects(m.attachmentDownload({id:r.attachments[0].id}),/远端身份/);
  assert.equal(leases.length,1); assert.equal(requests.length,1);
});

test('声明长度与字面量不符：不再整封失败，按实际字节读入并标截断',async t=>{
  const {m} = await fixture(t,textPart,{1:'AAAA'});
  const r = await m.messageBody({id:'m1'}); assert.equal(r.ok,true,r.message);
  assert.equal(r.truncated,true,'声明比实际长要留截断标记');
  assert.ok(m.message('m1').bodyAt>0,'正文已落库，重复打开读缓存');
});

test('截断标记随正文缓存持久化，重新打开不伪报完整',async t=>{
  const long = 'x'.repeat(200001);
  const {m,requests} = await fixture(t,`("TEXT" "PLAIN" NIL NIL NIL "7BIT" ${long.length} 1)`,{1:long});
  const r = await m.messageBody({id:'m1'}); assert.equal(r.ok,true,r.message);
  assert.equal(r.truncated,true); assert.equal(r.body.length,200000);
  const again = await m.messageBody({id:'m1'}); assert.equal(again.cached,true); assert.equal(again.truncated,true);
  assert.equal(m.message('m1').bodyTruncated,true); assert.equal(requests.length,2);
});

test('超过保存上限：用户点保存也不传输字节',async t=>{
  const {m,requests} = await fixture(t,attach('big.pdf',33*1024*1024),{});
  const r = await m.messageBody({id:'m1'}); assert.equal(r.ok,true,r.message);
  await assert.rejects(m.attachmentDownload({id:r.attachments[0].id}),/32 MiB/);
  assert.equal(requests.filter(x=>x.includes('BODY.PEEK')).length,0);
});
