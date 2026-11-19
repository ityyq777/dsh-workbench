/**
 * 信头文本解码：RFC 2047 编码字（=?gbk?B?…?=）与地址解析。
 * 只处理信头，正文 MIME（multipart / 附件）不在这一层。
 * 未知 charset 不抛错：原串保留，并可从 decodeWordsInfo().unknown 查到。
 */

/** charset 别名 → TextDecoder 标签。gbk / gb2312 / gb18030 统一走 gb18030（超集）。 */
const CHARSETS = {
  "utf-8": "utf-8",
  utf8: "utf-8",
  "us-ascii": "utf-8",
  ascii: "utf-8",
  "iso-8859-1": "iso-8859-1",
  latin1: "iso-8859-1",
  "iso-8859-15": "iso-8859-15",
  gbk: "gb18030",
  cp936: "gb18030",
  "x-gbk": "gb18030",
  gb2312: "gb18030",
  "x-gb2312": "gb18030",
  gb18030: "gb18030",
  big5: "big5",
  "big-5": "big5",
  cp950: "big5",
};

const WORD_RE = /=\?([^?\s]+)\?([BbQq])\?([^?]*)\?=/g;

export function decoderFor(charset) {
  const label = CHARSETS[String(charset || "").trim().toLowerCase()];
  if (!label) return null;
  try {
    return new TextDecoder(label);
  } catch {
    return null;
  }
}

/** Q 编码（RFC 2047 §4.2）：`_` 是空格，`=XX` 是单字节。 */
function qBytes(text) {
  const out = [];
  const s = String(text || "");
  for (let i = 0; i < s.length; i += 1) {
    const ch = s[i];
    if (ch === "_") {
      out.push(0x20);
      continue;
    }
    if (ch === "=" && i + 2 < s.length && /^[0-9A-Fa-f]{2}$/.test(s.slice(i + 1, i + 3))) {
      out.push(parseInt(s.slice(i + 1, i + 3), 16));
      i += 2;
      continue;
    }
    out.push(ch.charCodeAt(0) & 0xff);
  }
  return Buffer.from(out);
}

function bBytes(text) {
  const clean = String(text || "").replace(/\s+/g, "");
  try {
    return Buffer.from(clean, "base64");
  } catch {
    return null;
  }
}

/** 解一个编码字；charset 未知或解码失败返回 null（调用方保留原串）。 */
function decodeWord(match) {
  const charset = match[1];
  const encoding = match[2].toUpperCase();
  const payload = match[3];
  const decoder = decoderFor(charset);
  if (!decoder) return null;
  const bytes = encoding === "B" ? bBytes(payload) : qBytes(payload);
  if (!bytes) return null;
  try {
    return decoder.decode(bytes);
  } catch {
    return null;
  }
}

/**
 * 解一段信头文本：相邻编码字之间只允许空白，拼接时丢掉这段空白（RFC 2047 §6.2）。
 * `=?utf-8?Q?…?= =?utf-8?Q?…?=` 会拼成一句话，不会每个词之间塞空格。
 */
export function decodeWordsInfo(input) {
  const source = String(input == null ? "" : input);
  if (source.indexOf("=?") < 0) return { text: source, unknown: [] };
  const pieces = [];
  const unknown = [];
  let cursor = 0;
  let prevWasWord = false;
  let m;
  WORD_RE.lastIndex = 0;
  while ((m = WORD_RE.exec(source))) {
    const between = source.slice(cursor, m.index);
    const decoded = decodeWord(m);
    if (decoded == null) {
      pieces.push(between + m[0]);
      prevWasWord = false;
      if (unknown.indexOf(m[1]) < 0) unknown.push(m[1]);
    } else {
      if (!(prevWasWord && /^[ \t\r\n]*$/.test(between))) pieces.push(between);
      pieces.push(decoded);
      prevWasWord = true;
    }
    cursor = WORD_RE.lastIndex;
  }
  pieces.push(source.slice(cursor));
  return { text: pieces.join(""), unknown };
}

export function decodeWords(input) {
  return decodeWordsInfo(input).text;
}

/** 是否还有没解掉的编码字（用于测试与排错）。 */
export function hasEncodedWord(text) {
  return /=\?[^?\s]+\?[BbQq]\?[^?]*\?=/.test(String(text == null ? "" : text));
}

function cleanName(raw) {
  let s = String(raw == null ? "" : raw).trim();
  if (s.length >= 2 && s[0] === '"' && s[s.length - 1] === '"') s = s.slice(1, -1).replace(/\\(.)/g, "$1");
  return decodeWords(s).replace(/\s+/g, " ").trim();
}

/**
 * 拆地址：`"名称" <a@b>` / `名称 <a@b>` / `a@b` 三种形式。
 * 名称先解 RFC 2047 再去引号；拆不出来时整串当名称，保证不丢内容。
 */
export function parseAddress(raw) {
  const value = String(raw == null ? "" : raw).trim();
  if (!value) return { name: "", address: "" };
  const angle = /^(.*?)\s*<([^<>]*)>\s*$/.exec(value);
  if (angle) {
    const address = angle[2].trim();
    return { name: cleanName(angle[1]), address };
  }
  if (value.indexOf("@") >= 0) return { name: "", address: value.replace(/^[<"']+|[>"']+$/g, "") };
  return { name: cleanName(value), address: "" };
}

/** 列表里要显示的名字：有名称且不与地址重复就用名称，否则用地址。 */
export function displayName(parsed, fallback) {
  const name = (parsed && parsed.name) || "";
  const address = (parsed && parsed.address) || "";
  if (name && name !== address) return name;
  return address || name || String(fallback || "");
}

/** 地址列表（To / Cc）：逐个解码，保留原始分隔符。 */
export function decodeAddressList(raw) {
  return decodeWords(raw);
}
