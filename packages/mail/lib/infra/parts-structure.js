import { decodeWords } from "./mime-word.js";
import { decodeRfc2231 } from "./mime.js";

// Decode FETCH records, not merely the first literal: unsolicited FETCHes, including
// FLAGS, may precede the requested message and a server can put UID after BODY.
export function fetchValue(response, uid, key) {
  let literal = 0;
  const records = [];
  let record;
  for (const line of response.lines) {
    if (/^\* \d+ FETCH \(/i.test(line)) { record = []; records.push(record); }
    else if (/^(?:\* |\S+ (?:OK|NO|BAD)\b)/i.test(line)) record = null;
    if (record) {
      const source = record.length ? line : line.replace(/^\* \d+ FETCH /i, "");
      const re = /\s+|\(|\)|"(?:[^"\\]|\\.)*"|\{\d+\}$|[^\s()"{}]+/gy;
      let offset = 0;
      while (offset < source.length) {
        const tok = re.exec(source);
        if (!tok) throw new Error("无法解析 IMAP 分段响应");
        offset = re.lastIndex;
        const v = tok[0];
        if (/^\s/.test(v)) continue;
        if (v[0] === "{") record.push({ value: response.literals[literal++] });
        else if (v[0] === '"') record.push({ value: v.slice(1, -1).replace(/\\(.)/g, "$1") });
        else record.push(v);
        if (record.length > 32768) throw new Error("邮件结构条目过多");
      }
    } else if (/\{\d+\}$/.test(line)) literal++;
  }
  for (const tokens of records) {
    const stack = [[]];
    for (const t of tokens) {
      if (t === "(") {
        if (stack.length > 32) throw new Error("邮件结构嵌套过深");
        const list = []; stack.at(-1).push(list); stack.push(list);
      } else if (t === ")") {
        if (stack.length < 2) throw new Error("邮件结构括号不匹配");
        stack.pop();
      } else stack.at(-1).push(typeof t === "string" ? (/^NIL$/i.test(t) ? null : t) : t.value);
    }
    if (stack.length !== 1) throw new Error("邮件结构不完整");
    const row = stack[0][0]; const fields = new Map();
    for (let i = 0; i < row.length; i += 2) fields.set(String(row[i]).toUpperCase(), row[i + 1]);
    if (Number(fields.get("UID")) === uid && fields.has(key)) return fields.get(key);
  }
  throw new Error("邮件或分段不存在，请重新同步文件夹");
}

function parameters(list) {
  const p = Object.create(null);
  if (Array.isArray(list)) for (let i = 1; i < list.length; i += 2) p[String(list[i - 1]).toLowerCase()] = String(list[i]);
  return p;
}

// RFC 3501 BODYSTRUCTURE: extension fields start after different mandatory
// fields for basic, text/*, message/rfc822, and multipart nodes.
export function describeParts(root) {
  const leaves = [];
  function visit(node, path) {
    if (!Array.isArray(node) || !node.length) throw new Error("邮件没有可识别的 MIME 结构");
    if (Array.isArray(node[0])) {
      for (let i = 0; Array.isArray(node[i]); i++) visit(node[i], path ? `${path}.${i + 1}` : String(i + 1));
      return;
    }
    const type = String(node[0]).toLowerCase(), mime = `${type}/${String(node[1]).toLowerCase()}`;
    const params = parameters(node[2]);
    const disposition = node[type === "text" ? 9 : mime === "message/rfc822" ? 11 : 8];
    const dp = parameters(disposition?.[1]);
    const dispositionType = String(disposition?.[0] || "").toLowerCase();
    const name = decodeWords(decodeRfc2231(dp['filename*'] || dp.filename || params['name*'] || params.name || ""));
    const section = path || "1";
    const text = !name && dispositionType !== "attachment" && ["text/plain", "text/html"].includes(mime);
    const size = Number(node[6]);
    if (!Number.isSafeInteger(size) || size < 0) throw new Error("邮件分段大小无效");
    // Content-ID 是必然字段（body-fld-id），内联图靠它把正文里的 cid: 映射回本地分段。
    const contentId = String(node[3] == null ? "" : node[3]).trim().replace(/^</, "").replace(/>$/, "");
    const inline = !!contentId || dispositionType === "inline";
    leaves.push({ section, mime, text, inline, contentId, filename: name || (contentId ? `内联图片 ${section}` : `附件 ${section}`), size, encoding: String(node[5] || "7bit"), charset: params.charset });
  }
  visit(root, ""); return leaves;
}
