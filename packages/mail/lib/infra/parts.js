import { withMailbox } from "./imap-session.js";
import { describeParts, fetchValue } from "./parts-structure.js";
import { decodePartText, decodeTransfer, htmlToText } from "./mime.js";

const MAX_TEXT_TRANSFER = 1024 * 1024;
const MAX_ATTACHMENT_TRANSFER = 32 * 1024 * 1024;
const MAX_TEXT_CHARS = 200000;
// 自愈重试的硬上限：服务器不认 partial 或声明的长度比预算大时，允许单个 literal 读到
// 这个尺寸再截断，避免「一封邮件整封打不开」；落库仍然按 MAX_TEXT_TRANSFER 截断。
const SEGMENT_RETRY_LIMIT = 4 * 1024 * 1024;

/** 诊断开关（宿主 meta 的 debug.fetch）：只打印定位所需的字段，默认关闭时不输出。 */
let fetchDebug = null;
export function setFetchDebug(fn) {
  fetchDebug = typeof fn === "function" ? fn : null;
}

function diag(event) {
  if (!fetchDebug) return;
  let on = false;
  try {
    on = fetchDebug() === true;
  } catch {
    on = false;
  }
  if (!on) return;
  // 诊断日志绝不能影响阅读：序列化失败就只留段落名。
  try {
    console.warn("[mail.fetch] " + JSON.stringify(event));
  } catch {
    console.warn("[mail.fetch] " + String(event && event.section));
  }
}

function frameError(message) {
  const e = new Error(message);
  e.code = "EFRAME";
  return e;
}

/**
 * 读一个分段，返回 { bytes, truncated }。
 *
 * 服务器声明尺寸与真实字节不一致是常见现场（QQ IMAP 尤其）：声明偏大、偏小，或者干脆
 * 不认 `<0.N>` 直接返回整段。这里宁可截断也要把正文读出来，并用 truncated 标出「不是
 * 完整内容」，让界面和日志都能看出来；只有连一个字节都拿不到才算失败。
 */
async function readSegment(s, uid, part, max) {
  const declared = Math.min(max, part.size);
  const key = `BODY[${part.section}]`;
  const partial = part.size > max;
  const cmd = `UID FETCH ${uid} (UID BODY.PEEK[${part.section}]${partial ? `<0.${max}>` : ""})`;
  const send = async (cap) => {
    try {
      return await s.command(cmd, { maxLiteralBytes: cap, label: "读取邮件分段" });
    } catch (e) {
      // 服务器不认 partial 时会把整段发过来，按预算读会被判超限；换更大的上限再试一次。
      if (e && e.code === "EMBODYTOOLARGE") return null;
      throw e;
    }
  };
  let response = await send(max);
  let oversized = false;
  if (!response) {
    oversized = true;
    response = await send(Math.min(Math.max(part.size, max), SEGMENT_RETRY_LIMIT));
  }
  if (!response) throw frameError("服务器返回的正文超过单封上限，请在原邮箱查看");

  // partial 被忽略时响应 key 不带 <0>，两种都试，别把「服务器不认 partial」当成分段不存在。
  let val = null;
  let usedKey = key + (partial ? "<0>" : "");
  let ignoredPartial = false;
  try {
    val = fetchValue(response, uid, usedKey);
  } catch (e) {
    if (!partial) throw e;
    val = fetchValue(response, uid, key);
    usedKey = key;
    ignoredPartial = true;
  }
  if (val == null || Array.isArray(val)) throw frameError("分段不存在，请重新同步该邮件");
  let bytes = Buffer.isBuffer(val) ? val : Buffer.from(val, "latin1");

  // 比声明长：多出来的通常是括号后的 CRLF 或服务器补的换行，按声明长度截断即可。
  if (bytes.length >= declared) {
    const actual = bytes.length;
    if (bytes.length > declared) bytes = bytes.subarray(0, declared);
    diag({ section: part.section, declared, actual, key: usedKey, partial, ignoredPartial, oversized, truncated: false });
    return { bytes, truncated: false };
  }

  // 比声明短：先按整段重试一次（只在没走 partial 时有意义），仍然短就接受并标记截断。
  if (!partial) {
    try {
      const again = await s.command(`UID FETCH ${uid} (UID BODY.PEEK[${part.section}])`, {
        maxLiteralBytes: Math.min(Math.max(part.size, max), SEGMENT_RETRY_LIMIT),
        label: "重试完整分段",
      });
      const val2 = fetchValue(again, uid, key);
      if (val2 != null && !Array.isArray(val2)) {
        const bytes2 = Buffer.isBuffer(val2) ? val2 : Buffer.from(val2, "latin1");
        if (bytes2.length > bytes.length) {
          bytes = bytes2.length >= declared ? bytes2.subarray(0, declared) : bytes2;
          if (bytes.length >= declared) {
            diag({ section: part.section, declared, actual: bytes2.length, key, partial, ignoredPartial, oversized, retried: true, truncated: false });
            return { bytes, truncated: false };
          }
        }
      }
    } catch {
      // 重试失败不影响已经拿到的字节。
    }
  }
  diag({ section: part.section, declared, actual: bytes.length, key: usedKey, partial, ignoredPartial, oversized, retried: !partial, truncated: true });
  return { bytes, truncated: true };
}

async function withStructure(conn, msg, fn) {
  const uid = Number(msg.uid);
  if (!Number.isSafeInteger(uid) || uid < 1) throw new Error("邮件没有有效远端 UID");
  if (!(Number(msg.uid_validity) > 0)) throw new Error("缺少 UIDVALIDITY，请先同步邮件所在文件夹");
  return withMailbox(conn.account, conn.secret, msg.mailbox, async (s) => {
    const response = await s.command(`UID FETCH ${uid} (UID BODYSTRUCTURE)`, { maxLiteralBytes: 256 * 1024, label: "取得邮件结构" });
    const parts = describeParts(fetchValue(response, uid, "BODYSTRUCTURE"));
    return fn(parts, (part, max) => readSegment(s, uid, part, max));
  }, Number(msg.uid_validity) || undefined);
}

export function readBodyParts(conn, msg) {
  return withStructure(conn, msg, async (parts, fetch) => {
    const attachments = parts.filter(p => !p.text);
    let budget = MAX_TEXT_TRANSFER, truncated = false;
    const text = [], html = [];
    const textParts = parts.filter(p => p.text).sort((a,b) => Number(a.mime === 'text/html') - Number(b.mime === 'text/html'));
    for (const p of textParts) {
      if (!budget) { truncated = true; break; }
      const got = await fetch(p, budget);
      truncated ||= got.truncated || got.bytes.length < p.size;
      budget -= got.bytes.length;
      (p.mime === 'text/html' ? html : text).push(decodePartText(p, got.bytes));
    }
    const htmlText = html.join("\n");
    const full = text.join("\n\n").trim() || htmlToText(htmlText);
    return { text: full.slice(0, MAX_TEXT_CHARS), html: htmlText.slice(0, MAX_TEXT_CHARS), attachments, truncated: truncated || full.length > MAX_TEXT_CHARS };
  });
}

export function readAttachment(conn, msg, stored) {
  return withStructure(conn, msg, async (parts, fetch) => {
    const part = parts.find(p => !p.text && p.section === stored.section && p.mime === stored.mime && p.filename === stored.filename && p.size === stored.size);
    if (!part) throw new Error("附件结构已改变，请重新下载正文再保存");
    if (part.size > MAX_ATTACHMENT_TRANSFER) throw new Error("单附件超过 32 MiB 传输上限，请在原邮箱下载");
    if (!/^(7bit|8bit|binary|base64|quoted-printable)$/i.test(part.encoding)) throw new Error("未知附件传输编码，无法保证文件完整");
    const got = await fetch(part, MAX_ATTACHMENT_TRANSFER);
    const bytes = decodeTransfer(got.bytes, part.encoding);
    return { filename: part.filename, mime: part.mime, base64: bytes.toString("base64"), size: bytes.length };
  });
}
