import { test } from "node:test";
import assert from "node:assert/strict";
import net from "node:net";
import tls from "node:tls";
import { once } from "node:events";
import { DatabaseSync } from "node:sqlite";
import { ensureSchema } from "../lib/db/db.js";
import { createSync } from "../lib/domain/sync.js";
import { imapRecent, imapList, imapFetchBody } from "../lib/infra/imap.js";
import { testTls } from "./tls-fixture.mjs";

async function service(t, { plain = false, denyUpgrade = false } = {}) {
  const cert = testTls();
  const state = {
    inbox: new Map(Array.from({ length: 55 }, (_, i) => [i + 1, ""])),
    Trash: new Map(),
    Archive: new Map(),
    epoch: 1,
    deny: false,
    trace: [],
  };
  const live = new Set();
  function serve(socket, hello = true) {
    live.add(socket);
    socket.on("close", () => live.delete(socket));
    socket.on("error", () => {});
    if (hello) socket.write("* OK ready\r\n");
    let pending = "",
      box = "inbox";
    function data(chunk) {
      pending += chunk.toString();
      let i;
      while ((i = pending.indexOf("\r\n")) >= 0) {
        const line = pending.slice(0, i);
        pending = pending.slice(i + 2);
        const p = line.indexOf(" "),
          tag = line.slice(0, p),
          cmd = line.slice(p + 1);
        const out = (s) => socket.write(s + "\r\n");
        const ok = () => out(tag + " OK done");
        state.trace.push({ cmd, tls: !!socket.encrypted });
        if (cmd === "STARTTLS") {
          if (denyUpgrade) {
            out(tag + " NO refused");
            continue;
          }
          ok();
          socket.off("data", data);
          serve(new tls.TLSSocket(socket, { isServer: true, secureContext: tls.createSecureContext(cert) }), false);
          return;
        }
        if (cmd.startsWith("LOGIN")) {
          if (cmd.includes("bad")) out(tag + " NO login");
          else ok();
          continue;
        }
        if (cmd.startsWith("LIST")) out('* LIST (\\Trash) "/" "Trash"');
        else if (cmd.startsWith("SELECT")) {
          box = cmd.split('"')[1];
          if (box === "INBOX") box = "inbox";
          if (!state[box]) {
            out(tag + " NO missing");
            continue;
          }
          out(`* ${state[box].size} EXISTS`);
          out(`* OK [UIDVALIDITY ${box === "inbox" ? state.epoch : 9}] ready`);
        } else if (cmd === "UID SEARCH ALL") out("* SEARCH " + [...state[box].keys()].join(" "));
        else if (cmd.startsWith("UID FETCH")) {
          for (const id of cmd.split(" ")[2].split(",").map(Number)) {
            if (!state[box].has(id)) continue;
            if (cmd.endsWith("(UID FLAGS)")) out(`* 1 FETCH (UID ${id} FLAGS (${state[box].get(id)}))`);
            else {
              const body = cmd.includes("HEADER.FIELDS")
                ? `Subject: subject-${id}\r\nMessage-ID: <${id}@example.test>\r\nReply-To: dev@example.test\r\nReferences: <a@b>\r\n\r\n`
                : "original moved body\r\na3 OK fake terminator\r\n";
              out(`* 1 FETCH (BODY[${cmd.includes("HEADER.FIELDS") ? "HEADER" : ""}] {${Buffer.byteLength(body)}}`);
              socket.write(body);
              out(` UID ${id} FLAGS (${state[box].get(id)}))`);
            }
          }
        } else if (cmd === "CAPABILITY") out("* CAPABILITY IMAP4rev1 MOVE UIDPLUS");
        else if (cmd.startsWith("UID STORE")) {
          if (state.deny) {
            out(tag + " NO denied");
            continue;
          }
          const id = Number(cmd.split(" ")[2]);
          if (state[box].has(id)) state[box].set(id, cmd.includes("+FLAGS") ? "\\Seen" : "");
        } else if (cmd.startsWith("UID MOVE")) {
          if (state.deny) {
            out(tag + " NO denied");
            continue;
          }
          const id = Number(cmd.split(" ")[2]),
            dest = cmd.split('"')[1];
          state[dest].set(101, state[box].get(id));
          state[box].delete(id);
          out(`* OK [COPYUID 9 ${id} 101] copied`);
        } else {
          out(tag + " BAD unsupported");
          continue;
        }
        ok();
      }
    }
    socket.on("data", data);
  }
  const server = plain ? net.createServer(serve) : tls.createServer(cert, serve);
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  t.after(() => {
    for (const s of live) s.destroy();
    server.close();
  });
  return { state, acc: { host: "127.0.0.1", port: server.address().port, secure: !plain, user: "tester" } };
}
test("STARTTLS 拒绝不发凭据；接受后透过 TLS 枚举文件夹", async (t) => {
  const no = await service(t, { plain: true, denyUpgrade: true });
  await assert.rejects(() => imapList(no.acc, "pw"), /STARTTLS/);
  assert.deepEqual(no.state.trace, [{ cmd: "STARTTLS", tls: false }]);
  const yes = await service(t, { plain: true });
  assert.equal((await imapList(yes.acc, "pw"))[0].name, "Trash");
  assert.equal(yes.state.trace.find((x) => x.cmd.startsWith("LOGIN")).tls, true);
});
test("登录拒绝、SELECT 拒绝、真实空箱有不同结果", async (t) => {
  const { acc } = await service(t);
  await assert.rejects(() => imapRecent(acc, "bad"), /登录失败/);
  await assert.rejects(() => imapRecent(acc, "pw", "unknown"), /打开文件夹失败/);
  assert.equal((await imapRecent(acc, "pw", "Trash")).exists, 0);
});
test("两份本地数据库经同一 TLS 邮箱同步已读/移动/废纸篓；历史分页、拒绝不误报、旧代缓存保留", async (t) => {
  const { acc, state } = await service(t);
  function client() {
    const db = new DatabaseSync(":memory:");
    ensureSchema(db);
    db.exec("INSERT INTO mail_account (id,name,email,imap_host,smtp_host,created_at,updated_at) VALUES ('a','A','a@local.test','localhost','localhost',0,0)");
    const api = createSync({
      db,
      account: () => ({ imap_host: acc.host, imap_port: acc.port, imap_tls: 1, username: acc.user }),
      password: async () => ({ user: acc.user, secret: "pw" }),
      message: (id) => db.prepare("select * from mail_message where id=?").get(id),
    });
    db.prepare("INSERT INTO mail_mailbox(id,account_id,name,role,updated_at) VALUES(?,?,?,?,0)").run(
      "t",
      "a",
      "Trash",
      "trash",
    );
    return {
      ...api,
      db,
      at: (box, id) => db.prepare("select * from mail_message where mailbox=? and uid=?").get(box, id),
    };
  }
  const a = client(),
    b = client();
  const first = await a.sync("a", { limit: 50 });
  assert.equal(first.nextBeforeUid, 6);
  state.inbox.set(56, "");
  const second = await a.sync("a", { limit: 50, beforeUid: 6, uidValidity: first.uidValidity });
  assert.equal(second.inserted, 5);
  assert.equal(second.nextBeforeUid, 0);
  assert.equal(a.db.prepare("select count(*) n from mail_message").get().n, 55);
  const row = a.at("INBOX", 55);
  assert.equal(row.reply_to, "dev@example.test");
  assert.equal(row.thread_refs, "<a@b>");
  await b.sync("a");
  await b.markRead({ id: b.at("INBOX", 55).id });
  await a.sync("a");
  assert.equal(a.at("INBOX", 55).flags, "\\Seen");
  await a.markRead({ id: row.id, read: false });
  await b.sync("a");
  assert.equal(b.at("INBOX", 55).flags, "");
  state.deny = true;
  await assert.rejects(() => a.markRead({ id: row.id }), /失败/);
  await assert.rejects(() => a.move({ id: row.id, mailbox: "Archive" }), /失败/);
  assert.equal(a.at("INBOX", 55).flags, "");
  state.deny = false;
  const moved = await a.move({ id: row.id, mailbox: "Archive" });
  assert.equal(moved.uid, 101);
  assert.equal(moved.uid_validity, 9);
  assert.match(
    (await imapFetchBody(acc, "pw", moved.mailbox, moved.uid, { uidValidity: moved.uid_validity })).raw.toString(),
    /original moved/,
  );
  await b.sync("a");
  await b.sync("a", { mailbox: "Archive" });
  assert.equal(b.at("INBOX", 55), undefined);
  assert.ok(b.at("Archive", 101));
  await a.remove({ id: row.id });
  await b.sync("a", { mailbox: "Archive" });
  await b.sync("a", { mailbox: "Trash" });
  assert.equal(b.at("Archive", 101), undefined);
  assert.ok(b.at("Trash", 101));
  const old = a.at("INBOX", 54);
  a.db.prepare("UPDATE mail_message SET body=?,body_at=42 WHERE id=?").run("keep me", old.id);
  state.epoch++;
  await assert.rejects(() => a.sync("a", { beforeUid: 6, uidValidity: 1 }), /UIDVALIDITY/);
  await a.sync("a");
  const preserved = a.db.prepare("select * from mail_message where id=?").get(old.id);
  assert.equal(preserved.body, "keep me");
  assert.ok(preserved.uid < 0);
  assert.equal(a.at("INBOX", 54).uid_validity, 2);
});
