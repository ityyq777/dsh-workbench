import { decodeWords, parseAddress } from "./mime-word.js";
import { quote, uid, withSession, withMailbox } from "./imap-session.js";

function parseHeader(block) {
  const h = {};
  let key = "";
  for (const line of block.toString("utf8").split("\r\n")) {
    if (/^[ \t]/.test(line) && key) {
      h[key] += " " + line.trim();
      continue;
    }
    const i = line.indexOf(":");
    if (i <= 0) continue;
    key = line.slice(0, i).toLowerCase();
    h[key] = line.slice(i + 1).trim();
  }
  const sender = parseAddress(h.from || "");
  return {
    subject: decodeWords(h.subject || ""),
    from: sender.address || decodeWords(h.from || ""),
    fromName: sender.name,
    to: decodeWords(h.to || ""),
    cc: decodeWords(h.cc || ""),
    date: h.date || "",
    messageId: h["message-id"] || "",
    replyTo: decodeWords(h["reply-to"] || ""),
    threadRefs: h.references || "",
  };
}
// UID and FLAGS may follow the header literal, not necessarily precede it.
function fetchRecords({ lines, literals }) {
  const records = [];
  let rec = null,
    index = 0;
  for (const line of lines) {
    if (/^\* \d+ FETCH \(/i.test(line)) {
      rec = { meta: "", bytes: null };
      records.push(rec);
    } else if (/^(?:\* |\S+ (?:OK|NO|BAD)\b)/i.test(line)) rec = null;
    if (rec) rec.meta += " " + line;
    if (/\{\d+\}$/.test(line)) {
      if (rec) rec.bytes = literals[index];
      index++;
    }
  }
  return records
    .map(({ meta, bytes }) => ({
      uid: Number(/\bUID (\d+)\b/i.exec(meta)?.[1]),
      flags: /\bFLAGS \(([^)]*)\)/i.exec(meta)?.[1],
      bytes,
    }))
    .filter((r) => r.uid);
}
export function parseHeaders(text) {
  const lines = [],
    literals = [];
  let buf = Buffer.from(text);
  while (buf.length) {
    const p = buf.indexOf("\r\n");
    if (p < 0) break;
    const line = buf.subarray(0, p).toString("latin1");
    lines.push(line);
    buf = buf.subarray(p + 2);
    const m = /\{(\d+)\}$/.exec(line);
    if (m) {
      literals.push(buf.subarray(0, Number(m[1])));
      buf = buf.subarray(Number(m[1]));
    }
  }
  return fetchRecords({ lines, literals })
    .filter((r) => r.bytes)
    .map((r) => ({ ...parseHeader(r.bytes), uid: r.uid, flags: r.flags || "" }));
}
export function imapList(account, password) {
  return withSession(account, password, async (s) => {
    const { lines, literals } = await s.command('LIST "" "*"', { label: "列出文件夹" });
    const boxes = [];
    let index = 0;
    const unquote = (t) => (t[0] === '"' ? t.slice(1, -1).replace(/\\(["\\])/g, "$1") : t);
    for (const line of lines) {
      const lit = /\{\d+\}$/.test(line) ? literals[index++] : null;
      if (!/^\* LIST\b/i.test(line)) continue;
      const m = /^\* LIST \(([^)]*)\) (NIL|"(?:[^"\\]|\\.)*") ("(?:[^"\\]|\\.)*"|[^\s]+)$/i.exec(line);
      if (!m) throw new Error("无法完整解析文件夹列表，请保留现有目录");
      const name = lit ? lit.toString("utf8") : Buffer.from(unquote(m[3]), "latin1").toString("utf8");
      boxes.push({
        name: /^inbox$/i.test(name) ? "INBOX" : name,
        delimiter: m[2] === "NIL" ? "/" : unquote(m[2]),
        flags: m[1],
      });
    }
    return boxes;
  });
}
/**
 * 只问文件夹状态，不读任何信头：自动同步用它判断"值不值得同步"。
 *
 * 一次 STATUS 比一次 UID SEARCH ALL + FETCH 便宜得多，后台每分钟一轮也不会给服务器压力。
 * 有的服务器不实现 UIDNEXT，取不到时返回 0，调用方退回只比较 exists。
 */
export function imapProbe(account, password, mailbox = "INBOX") {
  const box = /^inbox$/i.test(String(mailbox)) ? "INBOX" : String(mailbox);
  return withSession(account, password, async (s) => {
    const { lines } = await s.command("STATUS " + quote(box) + " (MESSAGES UIDNEXT UIDVALIDITY UNSEEN)", {
      label: "查询文件夹状态",
    });
    const text = lines.join("\n");
    const num = (key) => {
      const m = new RegExp("\\b" + key + "\\s+(\\d+)", "i").exec(text);
      return m ? Number(m[1]) : 0;
    };
    return {
      mailbox: box,
      exists: num("MESSAGES"),
      uidNext: num("UIDNEXT"),
      uidValidity: num("UIDVALIDITY"),
      unseen: num("UNSEEN"),
    };
  });
}
export const MAX_MESSAGE_BYTES = 10 * 1024 * 1024;
export function imapFetchBody(account, password, mailbox = "INBOX", id, opts = {}) {
  return withMailbox(
    account,
    password,
    mailbox,
    async (s) => {
      const res = await s.command(`UID FETCH ${uid(id)} (BODY.PEEK[])`, {
        label: "取正文",
        maxLiteralBytes: opts.maxBytes || MAX_MESSAGE_BYTES,
      });
      const raw = fetchRecords(res).find((r) => r.uid === Number(id))?.bytes;
      if (!raw) throw new Error("邮件已不存在或未返回正文");
      return { raw, size: raw.length };
    },
    opts.uidValidity,
  );
}
export function imapSearchHeaders(account, password, mailbox, q, unread) {
  return withMailbox(account, password, mailbox, async (s) => {
    const label = '服务器搜索';
    const scope = unread ? 'UNSEEN ' : '';
    let search;
    if (/^[\x20-\x7e]+$/.test(q)) {
      const term = quote(q);
      search = await s.command('UID SEARCH ' + scope + 'OR SUBJECT ' + term + ' FROM ' + term, { label });
    } else {
      const marker = '{' + Buffer.byteLength(q) + '}';
      search = await s.command('UID SEARCH CHARSET UTF-8 ' + scope + 'OR SUBJECT ' + marker, {
        label, continuations: [q + ' FROM ' + marker, q],
      });
    }
    const found = search.lines.find(line => /^\* SEARCH(?: |$)/i.test(line));
    if (found === undefined) throw new Error('IMAP 未返回检索结果');
    const ids = [...new Set(found.slice(8).trim().split(/\s+/).filter(Boolean).map(uid))].sort((a,b) => b-a);
    const page = ids.slice(0, 50);
    if (!page.length) return { items: [], uidValidity: s.uidValidity, truncated: false };
    const result = await s.command(
      `UID FETCH ${page.join(',')} (UID FLAGS BODY.PEEK[HEADER.FIELDS (SUBJECT FROM TO CC DATE MESSAGE-ID REPLY-TO REFERENCES)])`,
      { label: '读取匹配信头', maxLiteralBytes: 8 * 1024 * 1024 },
    );
    const rows = new Map(fetchRecords(result).filter(r => r.bytes && page.includes(r.uid)).map(r => [r.uid, r]));
    const items = page.filter(id => rows.has(id)).map(id => {
      const r = rows.get(id);
      return { ...parseHeader(r.bytes), uid: r.uid, flags: r.flags || '' };
    });
    if (!items.length) throw new Error('服务器未返回匹配信头，请重新搜索');
    return { items, uidValidity: s.uidValidity, truncated: ids.length > page.length };
  }, undefined, true);
}
export function imapRecent(account, password, mailbox = "INBOX", limit = 20, opts = {}) {
  return withMailbox(
    account,
    password,
    mailbox,
    async (s) => {
      const search = await s.command("UID SEARCH ALL", { label: "检索邮件" });
      const found = search.lines.find((line) => /^\* SEARCH(?: |$)/i.test(line));
      if (found === undefined) throw new Error("IMAP 未返回检索结果");
      const uids = found
        .slice(8)
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .map(uid)
        .sort((a, b) => b - a);
      const older = opts.beforeUid ? uids.filter((n) => n < uid(opts.beforeUid)) : uids;
      const ids = older.slice(0, Math.min(Math.max(1, limit), 50));
      let items = [];
      if (ids.length) {
        const res = await s.command(
          `UID FETCH ${ids.join(",")} (UID FLAGS BODY.PEEK[HEADER.FIELDS (SUBJECT FROM TO CC DATE MESSAGE-ID REPLY-TO REFERENCES)])`,
          { label: "读取信头", maxLiteralBytes: 8 * 1024 * 1024 },
        );
        items = fetchRecords(res)
          .filter((r) => r.bytes && ids.includes(r.uid))
          .map((r) => ({ ...parseHeader(r.bytes), uid: r.uid, flags: r.flags || "" }));
      }
      const flags = new Map();
      const existing = new Set(uids),
        page = new Set(ids);
      const cached = (opts.cached || []).filter(
        (r) => r.uid_validity === s.uidValidity && existing.has(r.uid) && !page.has(r.uid),
      );
      for (let i = 0; i < cached.length; i += 200) {
        const set = cached.slice(i, i + 200).map((r) => uid(r.uid));
        const res = await s.command(`UID FETCH ${set.join(",")} (UID FLAGS)`, { label: "读取远端状态" });
        for (const r of fetchRecords(res)) if (r.flags != null) flags.set(r.uid, r.flags);
      }
      return {
        exists: s.exists,
        items,
        uidValidity: s.uidValidity,
        existing,
        flags,
        nextBeforeUid: older.length > ids.length ? ids.at(-1) : 0,
      };
    },
    opts.uidValidity,
  );
}
export function imapSeen(account, password, row, read) {
  return withMailbox(
    account,
    password,
    row.mailbox,
    async (s) => {
      const id = uid(row.uid);
      await s.command(`UID STORE ${id} ${read ? "+" : "-"}FLAGS.SILENT (\\Seen)`, { label: "更新已读状态" });
      const flags = fetchRecords(await s.command(`UID FETCH ${id} (UID FLAGS)`)).find((r) => r.uid === id)?.flags;
      if (flags == null || /(?:^| )\\Seen(?: |$)/i.test(flags) !== read)
        throw new Error("远端未确认已读状态，请重新同步");
      return flags;
    },
    row.uid_validity,
  );
}
export function imapMove(account, password, row, target) {
  return withMailbox(
    account,
    password,
    row.mailbox,
    async (s) => {
      const id = uid(row.uid);
      const caps = (await s.command("CAPABILITY")).lines.join(" ").toUpperCase().split(/\s+/);
      if (!(caps.includes("MOVE") && caps.includes("UIDPLUS")) && !caps.includes("IMAP4REV2"))
        throw new Error("服务器不支持可安全确认的新 UID 移动，请使用原邮箱");
      const res = await s.command(`UID MOVE ${id} ${quote(target)}`, { label: "移动邮件" });
      const map = /\[COPYUID (\d+) (\d+) (\d+)\]/i.exec(res.lines.join("\n"));
      if (!map || Number(map[2]) !== id) throw new Error("未能确认移动后的 UID，请重新同步原文件夹与目标文件夹");
      return { uidValidity: uid(map[1]), uid: uid(map[3]) };
    },
    row.uid_validity,
  );
}
