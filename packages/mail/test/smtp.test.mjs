import test from 'node:test';
import assert from 'node:assert/strict';
import tls from 'node:tls';
import { once } from 'node:events';
import { testTls } from './tls-fixture.mjs';
import { sendMail, probeSmtp } from '../lib/infra/smtp.js';

async function smtpFixture(t, refuse=false) {
  const sessions=[];
  const server=tls.createServer(testTls(), socket=>{
    socket.setNoDelay(true);
    // 客户端主动断链时 socket 可能 emit ECONNRESET：这里吞掉错误，避免 once() 的
    // rejected promise 变成进程级 unhandledRejection（并行跑整个目录时曾因此偶发失败）。
    socket.on('error',()=>{});
    const s={commands:[],data:[],closed:once(socket,'close').catch(()=>undefined)}; sessions.push(s);
    let buffer='', body=false;
    socket.setEncoding('utf8'); socket.write('220 local smtp ready\r\n');
    socket.on('data',chunk=>{
      buffer+=chunk;
      while(buffer.includes('\r\n')) {
        const end=buffer.indexOf('\r\n'),line=buffer.slice(0,end); buffer=buffer.slice(end+2);
        if(body){if(line!=='.'){s.data.push(line);continue;} body=false;socket.write('250 accepted\r\n');continue;}
        s.commands.push(line);
        if(line.startsWith('EHLO')){socket.write('250-localhost\r\n');setTimeout(()=>socket.write('250-SIZE 9000\r\n250 AUTH LOGIN\r\n'),15);}
        else if(line==='AUTH LOGIN') socket.write('334 user\r\n');
        else if(line==='dXNlcg==') socket.write('334 pass\r\n');
        else if(line==='cGFzcw==') socket.write('235 authenticated\r\n');
        else if(line.startsWith('MAIL FROM')) socket.write('250 sender\r\n');
        else if(line.startsWith('RCPT TO')) socket.write(refuse?'550 denied\r\n':'250 recipient\r\n');
        else if(line==='DATA'){body=true;socket.write('354 start\r\n');}
        else if(line==='QUIT') socket.end('221 bye\r\n');
        else socket.write('500 unknown\r\n');
      }
    });
  });
  server.listen(0,'127.0.0.1'); await once(server,'listening');
  t.after(()=>new Promise(resolve=>server.close(resolve)));
  return {sessions,account:{host:'localhost',port:server.address().port,secure:true,user:'user'}};
}
const msg={from:'from@test',to:['to@test'],cc:['cc@test'],text:'hello',subject:'test',inReplyTo:'<parent@test>',references:'<parent@test>'};
test('fragmented multiline EHLO preserves AUTH and full RCPT/DATA conversation',async t=>{
  const {account,sessions}=await smtpFixture(t);
  assert.deepEqual(await probeSmtp(account,'pass'),{ok:true,auth:true});
  const result=await sendMail(account,'pass',msg);
  assert.deepEqual(sessions[1].commands,['EHLO dsh-workbench','AUTH LOGIN','dXNlcg==','cGFzcw==','MAIL FROM:<from@test>','RCPT TO:<to@test>','RCPT TO:<cc@test>','DATA','QUIT']);
  assert.ok(sessions[1].data.includes('Message-ID: '+result.messageId)); assert.ok(sessions[1].data.includes('In-Reply-To: <parent@test>'));
});
test('recipient refusal rejects and closes TCP connection without sending message',async t=>{
  const {account,sessions}=await smtpFixture(t,true);
  await assert.rejects(sendMail(account,'pass',msg),/550 denied/);
  await sessions[0].closed; assert.ok(!sessions[0].commands.includes('DATA'));
});
