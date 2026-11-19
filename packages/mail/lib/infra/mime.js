/**
 * 正文 MIME 解析：拆 multipart、解 base64 / quoted-printable、按 charset 转文本，
 * 并把附件收成元信息（文件名 / MIME / 解码后大小），不保留附件字节。
 * 只做「把一封信变成可读纯文本」这一件事；信头编码字仍走 mime-word.js。
 */
import { decoderFor, decodeWords } from "./mime-word.js";

const DEFAULT_CHARSET = "utf-8";
const MAX_PARTS = 200;
const MAX_DEPTH = 6;
const MAX_TEXT_CHARS = 400000;
const TEXT_TYPES = new Set(["text/plain", "text/html"]);

/** 头与体之间的空行：先找 CRLFCRLF，再退回 LFLF。返回字节偏移。 */
export function findHeaderEnd(buf) {
  for (let i = 0; i + 1 < buf.length; i += 1) {
    if (buf[i] === 13 && buf[i + 1] === 10 && buf[i + 2] === 13 && buf[i + 3] === 10) {
      return { headerEnd: i, bodyStart: i + 4 };
    }
    if (buf[i] === 10 && buf[i + 1] === 10) return { headerEnd: i, bodyStart: i + 2 };
  }
  return { headerEnd: buf.length, bodyStart: buf.length };
}

/** 信头块 → 小写键的 map；续行（行首空白）合并回上一项。 */
export function parseHeaderBlock(text) {
  const map = {};
  let key = "";
  for (const line of String(text || "").split(/\r?\n/)) {
    if (/^[ \t]/.test(line) && key) {
      map[key] += " " + line.trim();
      continue;
    }
    const idx = line.indexOf(":");
    if (idx <= 0) continue;
    key = line.slice(0, idx).trim().toLowerCase();
    map[key] = line.slice(idx + 1).trim();
  }
  return map;
}

function splitUnquoted(input, sep) {
  const out = [];
  let cur = "";
  let quote = false;
  for (let i = 0; i < input.length; i += 1) {
    const ch = input[i];
    if (ch === '"') quote = !quote;
    if (ch === sep && !quote) {
      out.push(cur);
      cur = "";
      continue;
    }
    cur += ch;
  }
  out.push(cur);
  return out;
}

/** `text/html; charset="gbk"` → { value: "text/html", params: { charset: "gbk" } }。 */
export function parseParams(headerValue) {
  const segments = splitUnquoted(String(headerValue || ""), ";");
  const value = String(segments.shift() || "").trim().toLowerCase();
  const params = {};
  for (const segment of segments) {
    const eq = segment.indexOf("=");
    if (eq <= 0) continue;
    let key = segment.slice(0, eq).trim().toLowerCase();
    let raw = segment.slice(eq + 1).trim();
    if (raw.length >= 2 && raw[0] === '"' && raw[raw.length - 1] === '"') {
      raw = raw.slice(1, -1).replace(/\\(.)/g, "$1");
    }
    const extended = key.endsWith("*");
    if (extended) key = key.slice(0, -1);
    params[key] = extended ? decodeRfc2231(raw) : raw;
  }
  return { value, params };
}

function percentBytes(text) {
  const out = [];
  const s = String(text || "");
  for (let i = 0; i < s.length; i += 1) {
    if (s[i] === "%" && /^[0-9A-Fa-f]{2}$/.test(s.slice(i + 1, i + 3))) {
      out.push(parseInt(s.slice(i + 1, i + 3), 16));
      i += 2;
      continue;
    }
    out.push(s.charCodeAt(i) & 0xff);
  }
  return Buffer.from(out);
}

/** RFC 2231：`utf-8''%E4%B8%AD`；没有 charset 段时按原文返回。 */
function decodeRfc2231(value) {
  const m = /^([\w-]*)'[^']*'(.*)$/.exec(value);
  if (!m) return value;
  return toText(percentBytes(m[2]), m[1] || DEFAULT_CHARSET);
}

function toText(buf, charset) {
  const decoder = decoderFor(String(charset || "").trim() || DEFAULT_CHARSET);
  if (decoder) {
    try {
      return decoder.decode(buf);
    } catch {
      /* 落到下面兜底 */
    }
  }
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(buf);
  } catch {
    return buf.toString("latin1");
  }
}

/** quoted-printable：`=XX` 还原字节，行尾 `=` 是软换行。 */
export function decodeQuotedPrintable(buf) {
  const out = [];
  for (let i = 0; i < buf.length; i += 1) {
    const b = buf[i];
    if (b !== 0x3d) {
      out.push(b);
      continue;
    }
    if (buf[i + 1] === 13 && buf[i + 2] === 10) {
      i += 2;
      continue;
    }
    if (buf[i + 1] === 10) {
      i += 1;
      continue;
    }
    const hex = String.fromCharCode(buf[i + 1] || 0) + String.fromCharCode(buf[i + 2] || 0);
    if (/^[0-9A-Fa-f]{2}$/.test(hex)) {
      out.push(parseInt(hex, 16));
      i += 2;
      continue;
    }
    out.push(b);
  }
  return Buffer.from(out);
}

function decodeTransfer(buf, encoding) {
  const enc = String(encoding || "").trim().toLowerCase();
  if (enc === "base64") {
    const clean = buf.toString("latin1").replace(/[^A-Za-z0-9+/=]/g, "");
    return Buffer.from(clean, "base64");
  }
  if (enc === "quoted-printable") return decodeQuotedPrintable(buf);
  return buf;
}

function decodedSize(buf, encoding) {
  const enc = String(encoding || "").trim().toLowerCase();
  if (enc === "base64") {
    const s = buf.toString("latin1");
    let chars = 0;
    let pad = 0;
    for (let i = 0; i < s.length; i += 1) {
      if (s[i] === "=") pad += 1;
      else if (/[A-Za-z0-9+/]/.test(s[i])) chars += 1;
    }
    return Math.max(0, Math.floor(chars / 4) * 3 - pad);
  }
  if (enc === "quoted-printable") return decodeQuotedPrintable(buf).length;
  return buf.length;
}

function charsetOf(ct, type, buf) {
  const declared = String(ct.params.charset || "").trim();
  if (declared) return declared;
  if (type === "text/html") {
    const head = buf.subarray(0, 2048).toString("latin1");
    const m = /<meta[^>]+charset\s*=\s*["']?([\w-]+)/i.exec(head);
    if (m) return m[1];
  }
  return DEFAULT_CHARSET;
}

/**
 * 按 boundary 切分段：boundary 行本身与收尾的 `--` 都不进入分段内容。
 * latin1 与字节一一对应，所以字符串下标可直接当字节偏移用。
 */
export function splitMultipart(body, boundary) {
  const marker = "--" + String(boundary);
  const flat = body.toString("latin1");
  const segments = [];
  let idx = flat.indexOf(marker);
  while (idx >= 0) {
    const after = idx + marker.length;
    if (flat.slice(after, after + 2) === "--") break;
    const lineEnd = flat.indexOf("\n", after);
    if (lineEnd < 0) break;
    const start = lineEnd + 1;
    const next = flat.indexOf(marker, start);
    let end = next < 0 ? body.length : next;
    if (end > start && body[end - 1] === 10) end -= 1;
    if (end > start && body[end - 1] === 13) end -= 1;
    if (end > start) segments.push(body.subarray(start, end));
    if (next < 0) break;
    idx = next;
  }
  return segments;
}

function collectFromSegment(segment, out, depth) {
  const { headerEnd, bodyStart } = findHeaderEnd(segment);
  const headers = parseHeaderBlock(segment.subarray(0, headerEnd).toString("latin1"));
  collectPart(headers, segment.subarray(bodyStart), out, depth);
}

function collectPart(headers, body, out, depth) {
  if (out.parts >= MAX_PARTS || depth > MAX_DEPTH) return;
  out.parts += 1;
  const ct = parseParams(headers["content-type"] || "");
  const type = (ct.value || "text/plain").toLowerCase();
  if (type.startsWith("multipart/") && ct.params.boundary) {
    for (const segment of splitMultipart(body, ct.params.boundary)) collectFromSegment(segment, out, depth + 1);
    return;
  }
  const disp = parseParams(headers["content-disposition"] || "");
  const filenameRaw = disp.params.filename || ct.params.name || "";
  const filename = filenameRaw ? decodeWords(filenameRaw) : "";
  const encoding = String(headers["content-transfer-encoding"] || "").trim();
  const attachment = disp.value === "attachment" || (!!filename && !TEXT_TYPES.has(type));
  if (attachment) {
    out.attachments.push({
      filename: filename || "附件 " + (out.attachments.length + 1),
      mime: type,
      size: decodedSize(body, encoding),
    });
    return;
  }
  if (!TEXT_TYPES.has(type)) return;
  const decoded = decodeTransfer(body, encoding);
  const text = toText(decoded, charsetOf(ct, type, decoded));
  if (type === "text/plain") {
    if (!text.trim()) return;
    out.text = out.text ? out.text.replace(/\s+$/, "") + "\n\n" + text : text;
    return;
  }
  out.html = out.html ? out.html + "\n" + text : text;
}

const ENTITIES = {
  nbsp: " ",
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  mdash: "—",
  ndash: "–",
  hellip: "…",
  middot: "·",
  copy: "©",
  reg: "®",
  times: "×",
  divide: "÷",
  laquo: "«",
  raquo: "»",
  ldquo: "“",
  rdquo: "”",
  lsquo: "‘",
  rsquo: "’",
  yen: "¥",
  bull: "•",
  deg: "°",
};

function decodeEntities(text) {
  return String(text).replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z][a-zA-Z0-9]*);/g, (whole, code) => {
    if (code[0] === "#") {
      const point = code[1] === "x" || code[1] === "X" ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
      if (!Number.isFinite(point) || point <= 0 || point > 0x10ffff) return whole;
      return String.fromCodePoint(point);
    }
    const key = code.toLowerCase();
    return Object.prototype.hasOwnProperty.call(ENTITIES, key) ? ENTITIES[key] : whole;
  });
}

/** HTML → 可读纯文本：去脚本/样式、块级标签转换行、解实体、收敛空白。 */
export function htmlToText(html) {
  let text = String(html == null ? "" : html);
  text = text.replace(/<!--[\s\S]*?-->/g, "");
  text = text.replace(/<(script|style|head|title)\b[\s\S]*?<\/\1\s*>/gi, " ");
  text = text.replace(/<br\s*\/?>/gi, "\n");
  text = text.replace(/<\/(p|div|tr|li|h[1-6]|table|section|article|blockquote|pre|ul|ol)\s*>/gi, "\n");
  text = text.replace(/<(p|div|tr|li|h[1-6]|table|section|article|blockquote|pre|ul|ol)\b[^>]*>/gi, "\n");
  text = text.replace(/<td\b[^>]*>/gi, " ");
  text = text.replace(/<[^>]+>/g, "");
  text = decodeEntities(text);
  text = text.replace(/\r\n?/g, "\n");
  text = text.replace(/[\u00a0\t ]+/g, " ");
  text = text.replace(/ *\n */g, "\n");
  text = text.replace(/\n{3,}/g, "\n\n");
  return text.trim();
}

/**
 * 解析整封信：返回 { text, html, attachments, truncated }。
 * text 优先取 text/plain；没有纯文本时从 html 提正文（营销邮件常见）。
 */
export function parseMime(raw) {
  const buf = Buffer.isBuffer(raw) ? raw : Buffer.from(raw || "");
  const { headerEnd, bodyStart } = findHeaderEnd(buf);
  const headers = parseHeaderBlock(buf.subarray(0, headerEnd).toString("latin1"));
  const out = { text: "", html: "", attachments: [], parts: 0 };
  collectPart(headers, buf.subarray(bodyStart), out, 0);
  let text = out.text.trim();
  if (!text && out.html) text = htmlToText(out.html);
  let truncated = false;
  if (text.length > MAX_TEXT_CHARS) {
    text = text.slice(0, MAX_TEXT_CHARS) + "\n\n……（正文过长，已截断）";
    truncated = true;
  }
  return { text, html: out.html, attachments: out.attachments, truncated };
}
