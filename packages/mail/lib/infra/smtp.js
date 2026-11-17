/** 最小 SMTP 客户端：隐式 TLS / STARTTLS、AUTH LOGIN、纯文本正文。 */
import net from "node:net";
import tls from "node:tls";

function connect(host, port, secure, timeout = 15000) {
  return new Promise((resolve, reject) => {
    const socket = secure ? tls.connect({ host, port, servername: host }) : net.connect({ host, port });
    const timer = setTimeout(() => { socket.destroy(); reject(new Error("SMTP 连接超时")); }, timeout);
    const onErr = (e) => { clearTimeout(timer); reject(e); };
    socket.once("error", onErr);
    socket.once(secure ? "secureConnect" : "connect", () => { clearTimeout(timer); socket.off("error", onErr); resolve(socket); });
  });
}

function reader(socket) {
  let buf = "";
  const lines = [];
  const waiters = [];
  socket.setEncoding("utf8");
  const flush = () => {
    let idx;
    while ((idx = buf.indexOf("\r\n")) >= 0) {
      const line = buf.slice(0, idx); buf = buf.slice(idx + 2); lines.push(line);
      if (waiters.length) waiters.shift()(lines.splice(0));
    }
  };
  socket.on("data", (d) => { buf += d; flush(); });
  socket.on("error", (e) => { while (waiters.length) waiters.shift()(null, e); });
  socket.on("close", () => { while (waiters.length) waiters.shift()(null, new Error("SMTP 连接关闭")); });
  return function read(timeout = 15000) {
    return new Promise((resolve, reject) => {
      const t = setTimeout(() => reject(new Error("SMTP 响应超时")), timeout);
      waiters.push((batch, err) => { clearTimeout(t); if (err) reject(err); else resolve(batch || []); });
      if (lines.length) { clearTimeout(t); waiters.pop(); resolve(lines.splice(0)); }
    });
  };
}

function code(batch) {
  if (!batch || !batch.length) return 0;
  const last = batch[batch.length - 1] || "";
  const m = /^(\d{3})/.exec(last);
  return m ? Number(m[1]) : 0;
}

async function expect(read, ok, label) {
  const batch = await read();
  const c = code(batch);
  if (!ok.includes(c)) throw new Error(label + " 失败：" + (batch || []).join(" | "));
  return batch;
}

export async function sendMail(account, password, msg) {
  let socket = await connect(account.host, account.port, !!account.secure);
  let read = reader(socket);
  await expect(read, [220], "SMTP 问候");
  const cmd = async (line, ok, label) => { socket.write(line + "\r\n"); return expect(read, ok, label); };
  let ehlo = await cmd("EHLO dsh-workbench", [250], "EHLO");
  if (!account.secure) {
    const caps = (ehlo || []).join("\n").toUpperCase();
    if (!caps.includes("STARTTLS")) throw new Error("服务器不支持 STARTTLS");
    await cmd("STARTTLS", [220], "STARTTLS");
    socket = tls.connect({ socket, servername: account.host });
    read = reader(socket);
    ehlo = await cmd("EHLO dsh-workbench", [250], "EHLO(TLS)");
  }
  const caps = (ehlo || []).join("\n").toUpperCase();
  if (caps.includes("AUTH") && account.user) {
    await cmd("AUTH LOGIN", [334], "AUTH LOGIN");
    await cmd(Buffer.from(account.user).toString("base64"), [334], "SMTP 用户名");
    await cmd(Buffer.from(password || "").toString("base64"), [235], "SMTP 密码");
  }
  const from = msg.from || account.user;
  await cmd("MAIL FROM:<" + from + ">", [250], "MAIL FROM");
  for (const addr of [].concat(msg.to || [], msg.cc || []).filter(Boolean)) await cmd("RCPT TO:<" + addr + ">", [250, 251], "RCPT TO");
  await cmd("DATA", [354], "DATA");
  const headers = [
    "From: " + from, "To: " + [].concat(msg.to || []).join(", "), msg.cc && msg.cc.length ? "Cc: " + msg.cc.join(", ") : "",
    "Subject: =?UTF-8?B?" + Buffer.from(msg.subject || "(无主题)").toString("base64") + "?=",
    "Date: " + new Date().toUTCString(), "MIME-Version: 1.0", "Content-Type: text/plain; charset=utf-8", "Content-Transfer-Encoding: base64",
  ].filter(Boolean).join("\r\n");
  const data = headers + "\r\n\r\n" + Buffer.from(msg.text || "").toString("base64") + "\r\n";
  socket.write(data.replace(/^/gm, (m, offset) => "").replace(/\r\n\./g, "\r\n..") + ".\r\n");
  await expect(read, [250], "DATA 结束");
  try { await cmd("QUIT", [221], "QUIT"); } catch { /* 忽略 */ }
  socket.destroy();
  return { sent: true, messageId: newIdLike() };
}
function newIdLike() { return Date.now().toString(36) + "." + Math.random().toString(36).slice(2, 10) + "@dsh-workbench"; }
