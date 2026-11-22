import { test } from "node:test";
import assert from "node:assert/strict";
import tls from "node:tls";
import { once } from "node:events";
import { imapList } from "../lib/infra/imap.js";
import { withMailbox } from "../lib/infra/imap-session.js";
import { testTls } from "./tls-fixture.mjs";

/**
 * 网易 163/126/yeah.net（Coremail）在 LOGIN 之后要求客户端先发 IMAP ID 声明身份，
 * 否则 SELECT 一律回 `Unsafe Login. Please contact kefu@188.com for help`。
 * 这里用假服务器复现三种情况：广告了 ID 就该发、没广告就绝不能发（否则可能被直接 BYE）、
 * 被拒时错误里必须带上服务器原文。
 */
async function service(t, { advertiseId = true, unsafeLogin = false } = {}) {
  const cert = testTls();
  const trace = [];
  const live = new Set();
  function serve(socket) {
    live.add(socket);
    socket.on("close", () => live.delete(socket));
    socket.on("error", () => {});
    socket.write("* OK ready\r\n");
    let pending = "";
    socket.on("data", (chunk) => {
      pending += chunk.toString();
      let i;
      while ((i = pending.indexOf("\r\n")) >= 0) {
        const line = pending.slice(0, i);
        pending = pending.slice(i + 2);
        const p = line.indexOf(" ");
        const tag = line.slice(0, p);
        const cmd = line.slice(p + 1);
        trace.push(cmd);
        const out = (s) => socket.write(s + "\r\n");
        if (cmd.startsWith("LOGIN")) out(tag + " OK logged in");
        else if (cmd === "CAPABILITY") {
          out("* CAPABILITY " + (advertiseId ? "IMAP4rev1 ID MOVE" : "IMAP4rev1 MOVE"));
          out(tag + " OK capability done");
        }
        else if (cmd.startsWith("ID ")) out(tag + " OK id done");
        else if (cmd.startsWith("LIST")) {
          out('* LIST (\\Trash) "/" "Trash"');
          out(tag + " OK list done");
        }
        else if (cmd.startsWith("SELECT") || cmd.startsWith("EXAMINE")) {
          if (unsafeLogin) out(tag + " NO Unsafe Login. Please contact kefu@188.com for help");
          else {
            out("* 0 EXISTS");
            out("* OK [UIDVALIDITY 1] ready");
            out(tag + " OK done");
          }
        } else out(tag + " OK done");
      }
    });
  }
  const server = tls.createServer(cert, serve);
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  t.after(() => {
    for (const s of live) s.destroy();
    server.close();
  });
  return { trace, acc: { host: "127.0.0.1", port: server.address().port, secure: true, user: "tester" } };
}

test("服务器广告 ID 时，登录后先声明客户端身份再发别的命令", async (t) => {
  const { acc, trace } = await service(t);
  await imapList(acc, "pw");
  const id = trace.find((cmd) => cmd.startsWith("ID "));
  assert.ok(id, "应当发送 IMAP ID");
  assert.equal(
    id,
    'ID ("name" "DSH Workbench Mail" "version" "1.0.0" "vendor" "dsh-workbench" "support-email" "tester")',
  );
  // 顺序：登录 → 读能力 → 声明身份 → 业务命令。
  assert.equal(trace[0].startsWith("LOGIN"), true);
  assert.equal(trace[1], "CAPABILITY");
  assert.equal(trace[2].startsWith("ID "), true);
  assert.equal(trace[3].startsWith("LIST"), true);
});

test("服务器没广告 ID 时不发 ID，避免被当成非法命令断连", async (t) => {
  const { acc, trace } = await service(t, { advertiseId: false });
  await imapList(acc, "pw");
  assert.equal(trace.some((cmd) => cmd.startsWith("ID ")), false);
});

test("SELECT 被拒时错误带上服务器原文，能直接看出是 Unsafe Login", async (t) => {
  const { acc } = await service(t, { unsafeLogin: true });
  await assert.rejects(
    () => withMailbox(acc, "pw", "INBOX", async () => null),
    (error) => /打开文件夹失败/.test(error.message) && /Unsafe Login/.test(error.message),
  );
});
