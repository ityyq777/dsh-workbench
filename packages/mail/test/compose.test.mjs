import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { createComposer } from '../lib/domain/compose.js';
import { ensureSchema } from '../lib/db/db.js';
import { encodeMessage } from '../lib/infra/smtp.js';
import model from '../client/ui/compose-model.cjs';

const original = { id:'m1', accountId:'b', messageId:'<m@sender.test>', references:'<older@sender.test>', subject:'invoice', from:'A@sender.test', replyTo:'help@sender.test', to:'"Li, Me" <b@local.test>, BOB@example.test', cc:'bob@example.test, c@example.test, A@local.test' };
const accounts = [{email:'a@local.test'},{email:'b@local.test'}];
test('reply selects original identity and Reply-To; reply-all deduplicates across fields and own identities',()=>{
  const reply = model.initial('reply',original,'',accounts);
  assert.equal(reply.accountId,'b'); assert.equal(reply.to,'help@sender.test'); assert.equal(reply.cc,'');
  const all = model.initial('replyAll',original,'',accounts);
  assert.equal(all.to,'help@sender.test, BOB@example.test'); assert.equal(all.cc,'c@example.test');
  assert.equal(model.initial('reply',{...original,from:'b@local.test'},'',accounts).to,'BOB@example.test');
  assert.throws(()=>model.addresses('valid@test, broken',true));
});
test('forward includes original text and has no implicit recipients or reply prefix',()=>{
  const d = model.initial('forward',original,'invoice details',accounts);
  assert.equal(d.to,''); assert.equal(d.cc,''); assert.equal(d.subject,'Fwd: invoice'); assert.match(d.text,/invoice details/);
});
function setup(db) {return createComposer({db,message:id=>{assert.equal(id,original.id);return original;},account:id=>assert.equal(id,'b')});}
test('draft survives reopening editor/service; closing another draft cannot overwrite it',()=>{
  const db = new DatabaseSync(':memory:'); ensureSchema(db);
  db.exec("INSERT INTO mail_account (id,name,email,imap_host,smtp_host,created_at,updated_at) VALUES ('b','B','b@local.test','localhost','localhost',0,0)");
  db.exec("INSERT INTO mail_message (id,account_id,mailbox,uid,date_at,created_at,updated_at) VALUES ('m1','b','INBOX',1,0,0,0)");
  const one = setup(db);
  const draft = {...model.initial('reply',original,'',accounts), text:'unfinished'};
  one.draftSave(draft); one.draftSave({...model.initial(), text:'separate compose'});
  const two = setup(db); assert.deepEqual(two.draftGet({key:draft.key}).draft,draft); assert.equal(two.draftList().items.length,2);
  two.draftDelete({key:draft.key}); assert.equal(two.draftGet({key:draft.key}).draft,null); assert.equal(two.draftGet({key:'new'}).draft.text,'separate compose'); db.close();
});
test('outgoing reply references real parent; local and wire message IDs identical; forward not threaded',()=>{
  const db = new DatabaseSync(':memory:'); const svc=setup(db);
  assert.throws(()=>svc.thread({mode:'reply',originId:'m1'},'a'),/原邮件账户/);
  assert.throws(()=>svc.thread({mode:'reply'},'b'),/原信/);
  const t=svc.thread({mode:'replyAll',originId:'m1'},'b');
  const sent=encodeMessage('b@local.test',{...t,to:['sender@test'],cc:['team@test'],text:'正文'});
  assert.ok(sent.data.includes('Message-ID: '+sent.messageId+'\r\n')); assert.ok(sent.data.includes('In-Reply-To: <m@sender.test>\r\n'));
  assert.ok(sent.data.includes('References: <older@sender.test>\r\n <m@sender.test>\r\n')); assert.ok(sent.data.includes('Cc: team@test\r\n'));
  assert.deepEqual(svc.thread({mode:'forward',originId:'m1'},'b'),{}); db.close();
});
