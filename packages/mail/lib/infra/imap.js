/** 最小 IMAP 客户端：LIST 文件夹、SELECT、抓最近 20 封邮件头。仅 TLS / STARTTLS。 */
import net from "node:net";
import tls from "node:tls";
import { decodeWords, parseAddress } from "./mime-word.js";

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
export function parseHeaders(text) {
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
    const sender = parseAddress(h.from || "");
    out.push({
      uid: Number(m[1]),
      subject: decodeWords(h.subject || ""),
      from: sender.address || decodeWords(h.from || ""),
      fromName: sender.name,
      to: decodeWords(h.to || ""),
      cc: decodeWords(h.cc || ""),
      date: h.date || "",
      messageId: h["message-id"] || "",
    });
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

/**
 * 字节流：正文可能是 gbk 原始字节或 base64/附件二进制，不能像信头那样按 utf8 字符串拼。
 * 这里按 Buffer 累计，定位 `{N}` 后精确切出 N 字节，避免大正文下响应错位。
 */
function byteStream(socket, label = "IMAP") {
  const chunks = [];
  let total = 0;
  let flat = null;
  let pending = null;
  let failure = null;
  const wake = () => { if (pending) { const p = pending; pending = null; p(); } };
  socket.on("data", (d) => { chunks.push(d); total += d.length; flat = null; wake(); });
  socket.on("error", (e) => { failure = e; wake(); });
  socket.on("close", () => { failure = failure || new Error("IMAP 连接关闭"); wake(); });
  const buffer = () => { if (!flat) flat = Buffer.concat(chunks, total); return flat; };
  const tick = 120;
  async function waitFor(pattern, timeout, from = 0) {
    const started = Date.now();
    for (;;) {
      const text = buffer().toString("latin1", from);
      const m = pattern.exec(text);
      if (m) { m.index += from; return m; }
      if (failure) throw failure;
      if (Date.now() - started > timeout) throw new Error(label + "响应超时");
      await new Promise((resolve) => { pending = resolve; setTimeout(resolve, tick); });
    }
  }
  async function waitBytes(length, timeout) {
    const started = Date.now();
    for (;;) {
      if (total >= length) return;
      if (failure) throw failure;
      if (Date.now() - started > timeout) throw new Error(label + "响应超时");
      await new Promise((resolve) => { pending = resolve; setTimeout(resolve, tick); });
    }
  }
  return { buffer, waitFor, waitBytes, write: (text) => socket.write(text) };
}

function formatBytes(n) {
  const v = Number(n) || 0;
  if (v >= 1024 * 1024) return (v / (1024 * 1024)).toFixed(1) + " MB";
  if (v >= 1024) return Math.round(v / 1024) + " KB";
  return v + " B";
}

/** 单封正文上限：超过就明确告知，不把大附件邮件整封拉下来卡住连接。 */
export const MAX_MESSAGE_BYTES = 10 * 1024 * 1024;

/**
 * 按 UID 取整封原文（BODY.PEEK[]，不置 \Seen）。返回 { raw: Buffer, size }。
 * 不改变信头同步路径；正文只在用户打开邮件时按需调用。
 */
export async function imapFetchBody(account, password, mailbox = "INBOX", uid, opts = {}) {
  const id = Number(uid);
  if (!Number.isInteger(id) || id <= 0) throw new Error("这封邮件是本地副本，没有可下载的 IMAP UID");
  const limit = Math.max(64 * 1024, Number(opts.maxBytes) || MAX_MESSAGE_BYTES);
  const timeout = Number(opts.timeout) || 30000;
  const socket = await connect(account.host, account.port, !!account.secure, 15000);
  const s = byteStream(socket, "IMAP ");
  try {
    await s.waitFor(/^\* (OK|PREAUTH)/m, 15000);
    s.write("a1 LOGIN " + quote(account.user) + " " + quote(password) + "\r\n");
    const login = await s.waitFor(/^a1 (OK|NO|BAD)[^\r\n]*/m, timeout);
    if (!/^a1 OK/.test(login[0])) throw new Error("IMAP 登录失败：" + login[0]);
    s.write("a2 SELECT " + quote(mailbox) + "\r\n");
    const selected = await s.waitFor(/^a2 (OK|NO|BAD)[^\r\n]*/m, timeout);
    if (!/^a2 OK/.test(selected[0])) throw new Error("IMAP 打开文件夹失败：" + selected[0]);
    s.write("a3 UID FETCH " + id + " (BODY.PEEK[])\r\n");
    const literal = await s.waitFor(/BODY\[\][^{]*\{(\d+)\}\r\n/, timeout);
    const size = Number(literal[1]);
    if (size > limit) {
      const err = new Error("邮件原文 " + formatBytes(size) + "，超过单封上限 " + formatBytes(limit) + "，未下载正文");
      err.code = "EMBODYTOOLARGE";
      err.size = size;
      err.limit = limit;
      throw err;
    }
    const literalStart = literal.index + literal[0].length;
    await s.waitBytes(literalStart + size, timeout);
    const raw = s.buffer().subarray(literalStart, literalStart + size);
    const done = await s.waitFor(/^a3 (OK|NO|BAD)[^\r\n]*/m, timeout, literalStart + size);
    if (!/^a3 OK/.test(done[0])) throw new Error("IMAP 取正文失败：" + done[0]);
    try { s.write("a4 LOGOUT\r\n"); } catch { /* 连接已断就不用再登出 */ }
    socket.destroy();
    return { raw, size };
  } catch (e) {
    socket.destroy();
    throw e;
  }
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
