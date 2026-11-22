/**
 * IMAP IDLE 的最小封装：一条常驻连接 + 一次"等新信"。
 *
 * 只负责协议本身（SELECT / IDLE / DONE / 25 分钟重发留给调用方），重连、退避、保险箱闸门都在
 * domain/auto-sync.js。服务器的 `* BYE`、连接断开都以异常抛出，让调用方决定重连。
 */
import { connectSession, quote } from "./imap-session.js";

/** RFC 2177 要求 29 分钟内重发 IDLE，这里留 4 分钟余量。 */
export const IDLE_REFRESH_MS = 25 * 60 * 1000;

function withTimeout(promise, ms, message) {
  let timer = null;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(Object.assign(new Error(message), { code: "IDLE_TIMEOUT" })), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

export async function openIdle(account, password, mailbox = "INBOX") {
  const box = /^inbox$/i.test(String(mailbox)) ? "INBOX" : String(mailbox);
  const conn = await connectSession(account, password, { idle: true });
  const s = conn.s;
  async function select() {
    const { lines } = await s.command("SELECT " + quote(box), { label: "打开文件夹" });
    const text = lines.join("\n");
    return {
      exists: Number(/^\* (\d+) EXISTS\b/im.exec(text)?.[1] || 0),
      uidValidity: Number(/\[UIDVALIDITY (\d+)\]/i.exec(text)?.[1] || 0),
    };
  }
  // 同一时刻只挂一个待读：超时只是"不再等"，那条没回来的读不能作废——
  // 否则 DONE 的响应会被上一条被放弃的读吞掉，收尾要白等一个超时。
  let reading = null;
  function nextLine() {
    if (!reading) {
      reading = s.line().then(
        (line) => {
          reading = null;
          return line;
        },
        (error) => {
          reading = null;
          throw error;
        },
      );
    }
    return reading;
  }
  // DONE 之后的收尾响应只是礼节：读不到也不能让整条连接卡住。
  async function drain(tag, ms) {
    try {
      for (;;) {
        const line = await withTimeout(nextLine(), ms, "IMAP IDLE 收尾超时");
        if (line.startsWith(tag + " ")) return true;
        if (/^\* BYE\b/i.test(line)) return false;
      }
    } catch {
      return false;
    }
  }
  /**
   * 等一次服务器事件。
   *
   * 返回 `{ exists, timedOut }`：`exists > 0` 表示服务器报了新邮件数；`timedOut` 表示
   * 25 分钟什么都没发生，调用方应 DONE 并重连（连接可能已被中间设备掐断）。
   */
  async function waitForNew({ timeoutMs = IDLE_REFRESH_MS } = {}) {
    const tag = s.nextTag();
    s.write(tag + " IDLE");
    const first = await withTimeout(nextLine(), 15000, "IMAP IDLE 未获响应");
    if (!/^\+/.test(first)) throw new Error("IMAP 服务器不支持 IDLE");
    let exists = 0;
    let timedOut = false;
    try {
      for (;;) {
        const line = await withTimeout(nextLine(), timeoutMs, "IMAP IDLE 等待超时");
        if (/^\* BYE\b/i.test(line)) throw new Error("IMAP 服务器关闭连接");
        const m = /^\* (\d+) EXISTS\b/i.exec(line);
        if (m) {
          exists = Number(m[1]);
          break;
        }
        // 服务器自己结束了 IDLE（例如 NO/BAD），交给收尾逻辑处理。
        if (line.startsWith(tag + " ")) break;
      }
    } catch (error) {
      if (!error || error.code !== "IDLE_TIMEOUT") throw error;
      timedOut = true;
    }
    s.write("DONE");
    await drain(tag, 5000);
    return { exists, timedOut };
  }
  return { select, waitForNew, close: conn.close };
}
