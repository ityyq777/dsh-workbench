import net from "node:net";
import tls from "node:tls";
import { once } from "node:events";

export function quote(s) {
  if (/[\r\n\0]/.test(String(s))) throw new Error("IMAP 参数含非法字符");
  return '"' + String(s).replace(/["\\]/g, "\\$&") + '"';
}
export function uid(n) {
  n = Number(n);
  if (!Number.isInteger(n) || n < 1 || n > 4294967295) throw new Error("IMAP UID 无效");
  return n;
}
// Read protocol lines and binary literals separately; body bytes cannot complete a command.
function channel(socket) {
  const iter = socket.iterator({ destroyOnReturn: false });
  let buf = Buffer.alloc(0),
    seq = 0;
  async function fill() {
    const { value, done } = await iter.next();
    if (done) throw new Error("IMAP 连接关闭");
    buf = buf.length ? Buffer.concat([buf, value]) : value;
  }
  async function line() {
    let i;
    while ((i = buf.indexOf("\r\n")) < 0) {
      if (buf.length > 8 * 1024 * 1024) throw new Error("IMAP 响应行过大");
      await fill();
    }
    const out = buf.toString("latin1", 0, i);
    buf = buf.subarray(i + 2);
    return out;
  }
  async function literal(n) {
    const parts = [];
    while (n) {
      if (!buf.length) await fill();
      const size = Math.min(buf.length, n);
      parts.push(buf.subarray(0, size));
      buf = buf.subarray(size);
      n -= size;
    }
    return Buffer.concat(parts);
  }
  // 发一行原始命令：IDLE 这类「服务器先回续传、再由客户端结束」的交互要自己控标签与时机。
  function write(text) {
    if (/[\r\n\0]/.test(text)) throw new Error("IMAP 命令格式错误");
    socket.write(text + "\r\n");
  }
  function nextTag() {
    return "a" + ++seq;
  }
  async function command(cmd, { label = "请求", maxLiteralBytes = 1024 * 1024, continuations = [] } = {}) {
    if (/[\r\n\0]/.test(cmd)) throw new Error("IMAP 命令格式错误");
    const tag = nextTag();
    write(tag + " " + cmd);
    let continuation = 0;
    const lines = [],
      literals = [];
    let total = 0,
      textBytes = 0;
    for (;;) {
      const text = await line();
      lines.push(text);
      textBytes += text.length + 2;
      if (textBytes > 16 * 1024 * 1024) throw new Error("IMAP 响应过大");
      if (/^\+(?: |$)/.test(text)) {
        if (continuation >= continuations.length) throw new Error("IMAP 请求了意外续传");
        write(continuations[continuation++]);
        continue;
      }
      if (text.startsWith(tag + " ")) {
        if (!/^\S+ OK\b/i.test(text)) {
          // 服务器原文必须带进错误：163 的「Unsafe Login. Please contact kefu@188.com」
          // 之类只有原文才能判断原因，光一句「打开文件夹失败」谁也修不了。
          const detail = text.replace(/^\S+\s+/, "").trim();
          const error = new Error("IMAP " + label + "失败" + (detail ? "：" + detail : ""));
          error.code = "EIMAP";
          error.detail = detail;
          throw error;
        }
        if (continuation !== continuations.length) throw new Error("IMAP 搜索请求未完整发送");
        return { lines, literals };
      }
      if (/^\* BYE\b/i.test(text)) throw new Error("IMAP 服务器关闭连接");
      const m = /\{(\d+)\}$/.exec(text);
      if (m) {
        const n = Number(m[1]);
        total += n;
        if (total > maxLiteralBytes)
          throw Object.assign(new Error("邮件内容超过单封上限"), {
            code: "EMBODYTOOLARGE",
            size: total,
            limit: maxLiteralBytes,
          });
        literals.push(await literal(n));
      }
    }
  }
  return {
    command,
    line,
    nextTag,
    write,
    release: async () => {
      if (buf.length) throw new Error("STARTTLS 响应异常");
      await iter.return();
    },
  };
}

/**
 * 登录后声明客户端身份（RFC 2971 的 ID 命令）。
 *
 * 网易 163/126/yeah.net（Coremail）在 LOGIN 之后、任何 SELECT/EXAMINE 之前要求客户端先发 ID，
 * 否则一律回 `Unsafe Login. Please contact kefu@188.com for help`，表现为「能登录、打不开文件夹」。
 * 但先读 CAPABILITY 再决定发不发：有不支持 ID 的服务器把未知命令当成非法请求，直接 `* BYE` 断连。
 * ID 被拒也不影响后续命令，交给各条命令自己报错。
 */
async function announceClient(s, account) {
  let caps = "";
  try {
    const { lines } = await s.command("CAPABILITY", { label: "读取服务器能力" });
    caps = lines.join(" ");
  } catch {
    return;
  }
  if (!/(?:^|\s)ID(?:\s|$)/.test(caps.replace(/^\* CAPABILITY\s+/im, " "))) return;
  const fields = [
    ["name", "DSH Workbench Mail"],
    ["version", "1.0.0"],
    ["vendor", "dsh-workbench"],
    ["support-email", account.user || "workbench@localhost"],
  ];
  try {
    await s.command("ID (" + fields.map(([k, v]) => quote(k) + " " + quote(v)).join(" ") + ")", {
      label: "声明客户端身份",
    });
  } catch {
    /* 服务器广告了 ID 却拒绝时，后续命令自己会给出真实错误 */
  }
}

/**
 * 建立一条已登录的 IMAP 连接并交回连接对象，调用方自己决定何时关闭。
 *
 * `idle: true` 用于 IMAP IDLE：不设 15 秒空闲超时（空等服务器推送是正常状态），
 * 由调用方用 25 分钟重发与自己的超时控制兜底。
 */
export async function connectSession(account, password, opts = {}) {
  const host = account.host,
    port = account.port;
  const idle = opts.idle === true;
  const timeoutMs = Number(opts.timeoutMs) > 0 ? Number(opts.timeoutMs) : 15000;
  const options = {
    host,
    port,
    servername: net.isIP(host) ? undefined : host,
    rejectUnauthorized: true,
    minVersion: "TLSv1.2",
  };
  let socket;
  function arm() {
    // IDLE 期间服务器可能长时间不发任何字节，超时会误杀；只保留 TCP 层的 keepalive。
    if (idle) {
      socket.setTimeout(0);
      socket.setKeepAlive(true, 60000);
      return;
    }
    socket.setTimeout(timeoutMs, () => socket.destroy(new Error("IMAP 连接超时")));
  }
  try {
    socket = account.secure ? tls.connect(options) : net.connect({ host, port });
    arm();
    await once(socket, account.secure ? "secureConnect" : "connect");
    let s = channel(socket);
    const greeting = await s.line();
    if (!/^\* (OK|PREAUTH)\b/i.test(greeting)) throw new Error("IMAP 问候失败");
    if (!account.secure) {
      await s.command("STARTTLS", { label: "STARTTLS 升级" });
      await s.release();
      socket = tls.connect({ ...options, socket });
      arm();
      await once(socket, "secureConnect");
      s = channel(socket);
    }
    if (!account.secure || !/^\* PREAUTH\b/i.test(greeting))
      await s.command("LOGIN " + quote(account.user) + " " + quote(password), { label: "登录" });
    await announceClient(s, account);
    return {
      s,
      socket,
      close: async () => {
        try {
          socket.destroy();
        } catch {
          /* 关闭失败不影响调用方 */
        }
      },
    };
  } catch (error) {
    try {
      socket?.destroy();
    } catch {
      /* ignore */
    }
    throw error;
  }
}
export async function withSession(account, password, fn) {
  const conn = await connectSession(account, password);
  try {
    return await fn(conn.s);
  } finally {
    await conn.close();
  }
}
export function withMailbox(account, password, mailbox, fn, expectedUidValidity, readOnly = false) {
  return withSession(account, password, async (s) => {
    const { lines } = await s.command((readOnly ? "EXAMINE " : "SELECT ") + quote(mailbox), { label: "打开文件夹" });
    const text = lines.join("\n");
    s.uidValidity = Number(/\[UIDVALIDITY (\d+)\]/i.exec(text)?.[1]);
    if (!s.uidValidity || (expectedUidValidity != null && s.uidValidity !== Number(expectedUidValidity)))
      throw new Error("文件夹 UIDVALIDITY 已变化或未知，请重新同步");
    const count = /^\* (\d+) EXISTS\b/im.exec(text);
    if (!count) throw new Error("IMAP 文件夹未返回邮件数");
    s.exists = Number(count[1]);
    return fn(s);
  });
}
