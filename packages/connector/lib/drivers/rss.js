/**
 * RSS/Atom driver：不引入 XML 依赖，按 item/entry 边界做够用的解析。
 * 只负责把外部内容变成 {externalId,title,url,summary,content,author,publishedAt}。
 */
import { createHash } from "node:crypto";

function decodeEntities(text) {
  return String(text)
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&amp;/g, "&");
}

function stripTags(text) {
  return decodeEntities(String(text).replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
}

function tag(block, name) {
  const m = new RegExp("<" + name + "(?:\\s[^>]*)?>([\\s\\S]*?)</" + name + ">", "i").exec(block);
  return m ? m[1].trim() : "";
}

function attr(block, name) {
  const m = new RegExp("<link[^>]*\\b" + name + "=[\"']([^\"']+)[\"']", "i").exec(block);
  return m ? decodeEntities(m[1]) : "";
}

function linkOf(block) {
  const text = tag(block, "link");
  if (text && !text.startsWith("<")) return decodeEntities(text);
  return attr(block, "href") || attr(block, "url");
}

function dateOf(block) {
  const raw = tag(block, "pubDate") || tag(block, "published") || tag(block, "updated") || tag(block, "dc:date");
  if (!raw) return null;
  const t = Date.parse(stripTags(raw));
  return Number.isFinite(t) ? t : null;
}

function hash(text) {
  return createHash("sha1").update(String(text)).digest("hex").slice(0, 16);
}

export const rssDriver = {
  id: "rss",
  title: "RSS / Atom",
  secretFields: [],
  configFields: [
    { name: "url", label: "Feed URL", type: "url", required: true, placeholder: "https://example.com/feed.xml" },
    { name: "limit", label: "单次最多条数", type: "number", default: 20, min: 1, max: 100 },
  ],
  validate(config) {
    const url = String(config.url || "").trim();
    if (!/^https?:\/\//i.test(url)) throw new Error("RSS url 必须是 http(s) 地址");
    const limit = Number(config.limit || 20);
    if (!Number.isFinite(limit) || limit < 1 || limit > 100) throw new Error("limit 必须在 1–100");
    return { url, limit: Math.floor(limit) };
  },
  async fetch({ config, signal }) {
    const url = String(config.url || "");
    const limit = Math.min(100, Number(config.limit || 20));
    const res = await fetch(url, {
      signal,
      headers: { "user-agent": "dsh-workbench-connector/0.1 (+rss)", accept: "application/rss+xml, application/atom+xml, application/xml, text/xml, */*" },
    });
    if (!res.ok) throw new Error("RSS HTTP " + res.status);
    const xml = await res.text();
    if (xml.length > 4 * 1024 * 1024) throw new Error("RSS 超过 4MB，已拒绝");
    const blocks = xml.match(/<(item|entry)\b[\s\S]*?<\/\1>/gi) || [];
    const items = blocks.slice(0, limit).map((block) => {
      const title = stripTags(tag(block, "title")) || "(无标题)";
      const link = linkOf(block);
      const guid = stripTags(tag(block, "guid") || tag(block, "id")) || link || title;
      const description = tag(block, "description") || tag(block, "summary") || tag(block, "content");
      const content = tag(block, "content:encoded") || description;
      const author = stripTags(tag(block, "author") || tag(block, "dc:creator"));
      return {
        externalId: hash(guid).slice(0, 24),
        title,
        url: link,
        summary: stripTags(description).slice(0, 2000),
        content: stripTags(content).slice(0, 20000),
        author,
        publishedAt: dateOf(block),
        raw: block.slice(0, 20000),
      };
    });
    return { items, cursor: "", meta: { bytes: xml.length, blocks: blocks.length } };
  },
};

export { decodeEntities, stripTags, hash };
