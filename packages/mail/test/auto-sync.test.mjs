/**
 * 邮件自动同步：保险箱闸门、判新逻辑、通知去重、IDLE 协议解析。
 *
 * 前半段用假引擎跑纯逻辑（不打网络），后半段起一个最小 IMAP 服务器验 IDLE 的
 * `+ idling` / `* n EXISTS` / `* BYE` 三种响应。
 */
import test from "node:test";
import assert from "node:assert/strict";
import tls from "node:tls";
import { once } from "node:events";
import { DatabaseSync } from "node:sqlite";
import { createAutoSync } from "../lib/domain/auto-sync.js";
import { openIdle } from "../lib/infra/imap-idle.js";
import { testTls } from "./tls-fixture.mjs";

function makeDb() {
  const db = new DatabaseSync(":memory:");
  db.exec("CREATE TABLE meta(k TEXT PRIMARY KEY, v TEXT NOT NULL)");
  db.exec("CREATE TABLE mail_account(id TEXT PRIMARY KEY, name TEXT, email TEXT, enabled INTEGER DEFAULT 1, deleted_at TEXT)");
  db.exec("CREATE TABLE mail_message(id TEXT PRIMARY KEY, account_id TEXT, mailbox TEXT, uid INTEGER, subject TEXT, from_name TEXT, from_addr TEXT)");
  db.prepare("INSERT INTO mail_account(id,name,email,enabled) VALUES (?,?,?,1)").run("a1", "工作", "me@example.com");
  return db;
}

function makeEngine(overrides = {}) {
  const calls = { probe: 0, sync: [], session: 0 };
  const engine = {
    calls,
    probeRecent: async () => {
      calls.probe += 1;
      return overrides.probe ? overrides.probe() : { uidNext: 6, localUid: 3, exists: 5, localCount: 3 };
    },
    sync: async (id, args) => {
      calls.sync.push({ id, args });
      return overrides.sync ? overrides.sync() : { inserted: 2, mailbox: "INBOX", exists: 5 };
    },
    sessionFor: async () => {
      calls.session += 1;
      return { account: { host: "127.0.0.1", port: 1, secure: true, user: "u" }, secret: "p" };
    },
  };
  return engine;
}

function makeApi({ locked = false, hasMessage = true, onCall = null } = {}) {
  const sent = [];
  const events = [];
  const api = {
    sent,
    events,
    action: () => {},
    call: async (name, args) => {
      if (name === "vault.status") return { locked };
      if (name === "message.send") {
        sent.push(args);
        return { ok: true };
      }
      if (onCall) return onCall(name, args);
      return {};
    },
    emit: (event, data) => events.push({ event, data }),
    hasDomain: (id) => (id === "wb-addon-message" ? hasMessage : false),
  };
  return api;
}

function cfgOf(over = {}) {
  return { enabled: true, mode: "interval", intervalSec: 300, pageSize: 20, notify: true, ...over };
}

test("保险箱锁着时整轮跳过，既不探测也不连服务器", async () => {
  const db = makeDb();
  const engine = makeEngine();
  const api = makeApi({ locked: true });
  const sync = createAutoSync({ db, engine, api, log: () => {} });
  const r = await sync.syncNew({ id: "a1", name: "工作" }, cfgOf());
  assert.equal(r.locked, true);
  assert.equal(r.inserted, 0);
  assert.equal(engine.calls.probe, 0, "锁定状态不得发起 IMAP 探测");
  assert.equal(api.sent.length, 0);
  assert.equal(sync.statusReport().skippedLocked, 1);
});

test("远端没有新信时不走完整同步", async () => {
  const db = makeDb();
  const engine = makeEngine({ probe: () => ({ uidNext: 0, localUid: 0, exists: 5, localCount: 5 }) });
  const api = makeApi();
  const sync = createAutoSync({ db, engine, api, log: () => {} });
  assert.deepEqual(await sync.syncNew({ id: "a1", name: "工作" }, cfgOf()), { inserted: 0, exists: 5 });
  assert.equal(engine.calls.sync.length, 0, "没有新信不应该抓信头");
  assert.equal(api.events.length, 0);
});

test("有新信时按 uidNext 判定，抓到插入后发事件并推消息中心", async () => {
  const db = makeDb();
  db.prepare("INSERT INTO mail_message(id,account_id,mailbox,uid,subject,from_name,from_addr) VALUES (?,?,?,?,?,?,?)").run(
    "m9",
    "a1",
    "INBOX",
    9,
    "季度复盘",
    "王五",
    "w@example.com",
  );
  const engine = makeEngine();
  const api = makeApi();
  const sync = createAutoSync({ db, engine, api, log: () => {} });
  const r = await sync.syncNew({ id: "a1", name: "工作" }, cfgOf());
  assert.equal(r.inserted, 2);
  assert.deepEqual(engine.calls.sync, [{ id: "a1", args: { mailbox: "INBOX", limit: 20 } }]);
  assert.deepEqual(api.events[0], { event: "mail.synced", data: { accountId: "a1", mailbox: "INBOX", inserted: 2, exists: 5 } });
  assert.equal(api.sent.length, 1);
  assert.match(api.sent[0].title, /新邮件（工作）：季度复盘/);
  assert.match(api.sent[0].dedupeKey, /^mail:new:a1:9$/, "同一批新信只提醒一次，键取最大 uid");
});

test("没装消息插件或关了通知时不推消息，但事件照发", async () => {
  const db = makeDb();
  const engine = makeEngine();
  const noMessage = makeApi({ hasMessage: false });
  const a = createAutoSync({ db, engine, api: noMessage, log: () => {} });
  await a.syncNew({ id: "a1", name: "工作" }, cfgOf());
  assert.equal(noMessage.events.length, 1, "事件是界面刷新的唯一信号，与消息插件无关");
  assert.equal(noMessage.sent.length, 0);

  const db2 = makeDb();
  const quiet = makeApi();
  const b = createAutoSync({ db: db2, engine, api: quiet, log: () => {} });
  await b.syncNew({ id: "a1", name: "工作" }, cfgOf({ notify: false }));
  assert.equal(quiet.sent.length, 0);
});

test("探测失败抛给调用方，由调度器退避重试", async () => {
  const db = makeDb();
  const engine = makeEngine({
    probe: () => {
      throw new Error("IMAP 连接超时");
    },
  });
  const sync = createAutoSync({ db, engine, api: makeApi(), log: () => {} });
  // syncNew 自己不吞异常：定时循环与 IDLE 循环都在外层接住并退避，界面手动同步也能看到原因。
  await assert.rejects(() => sync.syncNew({ id: "a1", name: "工作" }, cfgOf()), /IMAP 连接超时/);
});

test("默认配置：自动同步开启、定时循环、5 分钟、通知开", async () => {
  const db = makeDb();
  const sync = createAutoSync({ db, engine: makeEngine(), api: makeApi(), log: () => {} });
  const s = sync.statusReport();
  assert.equal(s.enabled, true);
  assert.equal(s.mode, "interval");
  assert.equal(s.intervalSec, 300);
  assert.equal(s.running, false, "start() 之前不排期");
});

/* ---------------- IDLE 协议 ---------------- */

async function idleServer(t, script) {
  const cert = testTls();
  const trace = [];
  const sockets = new Set();
  const server = tls.createServer({ key: cert.key, cert: cert.cert }, (socket) => {
    sockets.add(socket);
    socket.on("close", () => sockets.delete(socket));
    socket.on("error", () => {});
    socket.write("* OK ready\r\n");
    let pending = "";
    let idleTag = "";
    socket.on("data", (chunk) => {
      pending += chunk.toString();
      let i;
      while ((i = pending.indexOf("\r\n")) >= 0) {
        const line = pending.slice(0, i);
        pending = pending.slice(i + 2);
        // DONE 是不带标签的续传结束命令，其余命令都是「标签 + 空格 + 命令」。
        const space = line.indexOf(" ");
        const tag = space < 0 ? "" : line.slice(0, space);
        const cmd = space < 0 ? line : line.slice(space + 1);
        trace.push(cmd);
        const out = (s) => socket.write(s + "\r\n");
        if (cmd.startsWith("LOGIN")) out(tag + " OK logged in");
        else if (cmd.startsWith("SELECT")) {
          out("* 3 EXISTS");
          out("* OK [UIDVALIDITY 7] done");
          out(tag + " OK selected");
        } else if (cmd === "IDLE") {
          idleTag = tag;
          out("+ idling");
          script(socket, out, tag);
        } else if (cmd === "DONE") out(idleTag + " OK idle done");
        else out(tag + " OK done");
      }
    });
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  t.after(() => {
    for (const s of sockets) s.destroy();
    server.close();
  });
  return { port: server.address().port, trace };
}

test("IDLE：服务器报 EXISTS 时立刻返回新邮件数", async (t) => {
  const { port, trace } = await idleServer(t, (socket) => {
    setTimeout(() => socket.write("* 4 EXISTS\r\n"), 30);
  });
  const watcher = await openIdle({ host: "127.0.0.1", port, secure: true, user: "u" }, "p", "INBOX");
  t.after(() => watcher.close());
  const sel = await watcher.select();
  assert.deepEqual(sel, { exists: 3, uidValidity: 7 });
  const r = await watcher.waitForNew({ timeoutMs: 2000 });
  assert.equal(r.exists, 4);
  assert.equal(r.timedOut, false);
  assert.ok(trace.includes("IDLE"), "必须真的发过 IDLE 命令");
});

test("IDLE：服务器 BYE 时抛出可重连的错误", async (t) => {
  const { port } = await idleServer(t, (socket) => {
    setTimeout(() => socket.write("* BYE going away\r\n"), 30);
  });
  const watcher = await openIdle({ host: "127.0.0.1", port, secure: true, user: "u" }, "p");
  t.after(() => watcher.close());
  await assert.rejects(() => watcher.waitForNew({ timeoutMs: 2000 }), /IMAP 服务器关闭连接/);
});

test("IDLE：什么都没发生时按超时结束，交给调用方重连", async (t) => {
  const { port } = await idleServer(t, () => {});
  const watcher = await openIdle({ host: "127.0.0.1", port, secure: true, user: "u" }, "p");
  t.after(() => watcher.close());
  const r = await watcher.waitForNew({ timeoutMs: 80 });
  assert.equal(r.timedOut, true);
  assert.equal(r.exists, 0);
});
