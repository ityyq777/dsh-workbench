/** 最小 IMAP 客户端：LIST 文件夹、SELECT、抓最近 20 封邮件头。仅 TLS / STARTTLS。 */
import net from "node:net";
import tls from "node:tls";

function connect(host, port, secure, timeout = 15000) {
  return new Promise((resolve, reject) => {
    const s = secure ? tls.connect({ host, port, servername: host }) : net.connect({ host, port });
    const t = setTimeout(() => { s.destroy(); reject(new Error("IMAP 连接超时")); }, timeout);
    s.once("error", (e) => { clearTimeout(t); reject(e); });
    s.once(secure ? "secureConnect" : "connect", () => { clearTimeout(t); resolve(s); });
  });
}
function client(socket) {
  let buf = ""; const waiters = [];
  socket.setEncoding("utf8");
  socket.on("data", (d) => {
    buf += d;
    for (let i = 0; i < waiters.length; i += 1) {
      const w = waiters[i];
      if (buf.includes(w.needle)) { const out = buf; buf = ""; waiters.splice(i, 1); w.resolve(out); i -= 1; }
    }
  });
  socket.on("error", (e) => { while (waiters.length) waiters.shift().reject(e); });
  socket.on("close", () => { while (waiters.length) waiters.shift().reject(new Error("IMAP 连接关闭")); });
  return {
    waitFor(needle, timeout = 15000) { return new Promise((resolve, reject) => { const t = setTimeout(() => reject(new Error("IMAP 响应超时")), timeout); waiters.push({ needle, resolve: (v) => { clearTimeout(t); resolve(v); }, reject: (e) => { clearTimeout(t); reject(e); } }); if (buf.includes(needle)) { const out = buf; buf = ""; const w = waiters.pop(); w.resolve(out); } }); },
    cmd(tag, line) { socket.write(tag + " " + line + "\r\n"); return this.waitFor(tag + " "); },
    raw() { return socket.write.bind(socket); },
  };
}
const quote = (s) => '"' + String(s).replace(/["\\]/g, (c) => "\\" + c) + '"';
function parseList(text) {
  const out = [];
  for (const line of text.split("\r\n")) {
    const m = /^\* LIST \(([^)]*)\) ("(?:[^"\\]|\\.)*"|NIL) ("(?:[^"\\]|\\.)*")$/.exec(line);
    if (!m) continue;
    const name = JSON.parse(m[3].replace(/\\"/g, '"'));
    out.push({ name, delimiter: m[2] === "NIL" ? "/" : JSON.parse(m[2]), flags: m[1] });
  }
  return out;
}
function parseHeaders(text) {
  const out = []; const re = /UID (\d+)[\s\S]*?\{(\d+)\}\r\n/g;
  let m;
  while ((m = re.exec(text))) {
    const start = re.lastIndex;
    const block = text.slice(start, start + Number(m[2]));
    re.lastIndex = start + Number(m[2]);
    const h = {};
    let key = "";
    for (const line of block.split("\r\n")) {
      if (/^[ \t]/.test(line) && key) { h[key] += " " + line.trim(); continue; }
      const i = line.indexOf(":"); if (i <= 0) continue;
      key = line.slice(0, i).toLowerCase(); h[key] = line.slice(i + 1).trim();
    }
    out.push({ uid: Number(m[1]), subject: h.subject || "", from: h.from || "", to: h.to || "", cc: h.cc || "", date: h.date || "", messageId: h["message-id"] || "" });
  }
  return out;
}

export async function imapList(account, password) {
  const socket = await connect(account.host, account.port, !!account.secure);
  const c = client(socket);
  await c.waitFor("* OK");
  let tag = "a1";
  const login = await c.cmd(tag, "LOGIN " + quote(account.user) + " " + quote(password));
  if (!/a1 OK/.test(login)) throw new Error("IMAP 登录失败：" + login.split("\r\n").find((l) => /^a1 /.test(l)));
  tag = "a2";
  const list = await c.cmd(tag, 'LIST "" "*"');
  await c.cmd("a3", "LOGOUT").catch(() => {});
  socket.destroy();
  return parseList(list);
}

export async function imapRecent(account, password, mailbox = "INBOX", limit = 20) {
  const socket = await connect(account.host, account.port, !!account.secure);
  const c = client(socket);
  await c.waitFor("* OK");
  await c.cmd("a1", "LOGIN " + quote(account.user) + " " + quote(password));
  const sel = await c.cmd("a2", "SELECT " + quote(mailbox));
  const exists = Number((/\* (\d+) EXISTS/.exec(sel) || [])[1] || 0);
  const from = Math.max(1, exists - Math.min(limit, 50) + 1);
  const text = exists === 0 ? "" : await c.cmd("a3", "FETCH " + from + ":" + exists + " (UID FLAGS INTERNALDATE BODY.PEEK[HEADER.FIELDS (SUBJECT FROM TO CC DATE MESSAGE-ID)])");
  await c.cmd("a4", "LOGOUT").catch(() => {});
  socket.destroy();
  const items = parseHeaders(text);
  return { exists, items: items.slice(-limit) };
}
