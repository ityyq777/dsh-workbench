/**
 * 消息域：统一发送入口（agent / 子插件 / 界面共用）、收件箱查询、未读计数与保留清理。
 *
 * 只认 api.db、api.now、api.emit、api.action，不 import 任何业务插件；
 * 其他插件调用本域只能走宿主 `host.invoke("message.send", args, origin)`。
 */

import { MESSAGE_TABLE, newId, now, rowMessage } from "../db/db.js";
import { configValues } from "../infra/config.js";

export const LEVELS = ["info", "success", "warning", "error"];
export const AUDIENCES = ["user", "agent", "all"];
export const MAX_ROWS = 5000;
const PRUNE_LIMIT = 200;

function fail(message) {
  throw new Error(message);
}

function readString(args, key, max, options) {
  const opts = options || {};
  const raw = args ? args[key] : undefined;
  if (raw === undefined || raw === null) {
    if (opts.required) fail(key + " 必填");
    return opts.fallback === undefined ? "" : opts.fallback;
  }
  if (typeof raw !== "string") fail(key + " 需要字符串");
  const text = raw.trim();
  if (opts.required && !text) fail(key + " 不能为空");
  if (text.length > max) fail(key + " 不能超过 " + max + " 个字符");
  return text;
}

/** 读字符串值本身（供静态扫描能识别 input.<key> 的字段使用）。 */
function readText(raw, max, key) {
  if (raw === undefined || raw === null) return "";
  if (typeof raw !== "string") fail(key + " 需要字符串");
  const text = raw.trim();
  if (text.length > max) fail(key + " 不能超过 " + max + " 个字符");
  return text;
}

function readEnum(args, key, values, fallback) {
  const raw = args ? args[key] : undefined;
  if (raw === undefined || raw === null || raw === "") return fallback;
  if (typeof raw !== "string" || values.indexOf(raw) < 0) fail(key + " 只接受：" + values.join(" / "));
  return raw;
}

/** 把 meta（对象或字符串）压成不超过 2000 字节的 JSON 字符串。 */
function readMeta(raw) {
  if (raw === undefined || raw === null || raw === "") return "";
  let text;
  if (typeof raw === "string") {
    text = raw.trim();
  } else if (typeof raw === "object") {
    try {
      text = JSON.stringify(raw);
    } catch {
      fail("meta 无法序列化");
    }
  } else {
    fail("meta 需要对象或 JSON 字符串");
  }
  if (!text) return "";
  if (Buffer.byteLength(text, "utf8") > 2000) fail("meta 不能超过 2000 字节");
  return text;
}

export function normalizeSend(args) {
  const input = args || {};
  const title = readString(input, "title", 120, { required: true });
  const body = readString(input, "body", 4000, {});
  const level = readEnum(input, "level", LEVELS, "info");
  const audience = readEnum(input, "audience", AUDIENCES, "all");
  const source = readString(input, "source", 40, {});
  const dedupeKey = readString(input, "dedupeKey", 120, {});
  return {
    title: title,
    body: body,
    level: level,
    audience: audience,
    source: source,
    dedupeKey: dedupeKey || null,
    meta: readMeta(input.meta),
  };
}

function findDedupe(db, key) {
  if (!key) return null;
  return db.prepare("SELECT * FROM " + MESSAGE_TABLE + " WHERE dedupe_key=? AND deleted_at IS NULL").get(key) || null;
}

/** 清理：已读超过保留天数的物理删除，以及总量超过上限时从最旧的已读开始删；单次最多 200 条。 */
export function pruneMessages(db, values, ts) {
  const at = typeof ts === "number" ? ts : now();
  let removed = 0;
  const days = Number(values && values["retention.readDays"]);
  if (Number.isFinite(days) && days > 0) {
    const cutoff = at - days * 86400000;
    const result = db
      .prepare(
        "DELETE FROM " + MESSAGE_TABLE +
          " WHERE id IN (SELECT id FROM " + MESSAGE_TABLE +
          " WHERE deleted_at IS NULL AND read_at IS NOT NULL AND read_at < ? ORDER BY read_at LIMIT " + PRUNE_LIMIT + ")",
      )
      .run(cutoff);
    removed += Number(result.changes || 0);
  }
  const total = db.prepare("SELECT COUNT(*) AS n FROM " + MESSAGE_TABLE + " WHERE deleted_at IS NULL").get().n;
  const overflow = Number(total) - MAX_ROWS;
  if (overflow > 0) {
    const result = db
      .prepare(
        "DELETE FROM " + MESSAGE_TABLE +
          " WHERE id IN (SELECT id FROM " + MESSAGE_TABLE +
          " WHERE deleted_at IS NULL AND read_at IS NOT NULL ORDER BY read_at LIMIT " + Math.min(overflow, PRUNE_LIMIT) + ")",
      )
      .run();
    removed += Number(result.changes || 0);
  }
  return removed;
}

export function sendMessage(api, args) {
  const db = api.db;
  const input = normalizeSend(args);
  const existing = findDedupe(db, input.dedupeKey);
  if (existing) return { message: rowMessage(existing), deduped: true, pruned: 0 };
  const ts = now();
  const id = newId("msg");
  db.prepare(
    "INSERT INTO " + MESSAGE_TABLE +
      " (id,title,body,level,source,audience,dedupe_key,meta,created_at,read_at,deleted_at,rev) VALUES (?,?,?,?,?,?,?,?,?,NULL,NULL,1)",
  ).run(id, input.title, input.body, input.level, input.source, input.audience, input.dedupeKey, input.meta, ts);
  const message = rowMessage(db.prepare("SELECT * FROM " + MESSAGE_TABLE + " WHERE id=?").get(id));
  const pruned = pruneMessages(db, configValues(db), ts);
  if (typeof api.emit === "function") api.emit("message.created", { version: 1, message: message });
  return { message: message, deduped: false, pruned: pruned };
}

function buildFilter(args) {
  const input = args || {};
  const where = ["deleted_at IS NULL"];
  const params = [];
  if (input.unreadOnly === true) where.push("read_at IS NULL");
  const levels = Array.isArray(input.levels) ? input.levels : input.level ? [input.level] : [];
  if (levels.length) {
    for (const level of levels) {
      if (LEVELS.indexOf(level) < 0) fail("level 只接受：" + LEVELS.join(" / "));
    }
    where.push("level IN (" + levels.map(() => "?").join(",") + ")");
    params.push(...levels);
  }
  const source = readString(input, "source", 40, {});
  if (source) {
    where.push("source = ?");
    params.push(source);
  }
  const audience = readEnum(input, "audience", AUDIENCES, "");
  if (audience) {
    where.push("audience = ?");
    params.push(audience);
  }
  const text = readText(input.text, 120, "text");
  if (text) {
    where.push("(instr(lower(title), lower(?)) > 0 OR instr(lower(body), lower(?)) > 0)");
    params.push(text, text);
  }
  if (typeof input.since === "number") {
    where.push("created_at >= ?");
    params.push(input.since);
  }
  if (typeof input.before === "number") {
    where.push("created_at < ?");
    params.push(input.before);
  }
  return { where: where.join(" AND "), params: params };
}

function pageOf(args) {
  const input = args || {};
  const pageSize = Math.max(1, Math.min(100, Number(input.pageSize) || 20));
  const pageNumber = Math.max(1, Number(input.pageNumber) || 1);
  return { pageSize: pageSize, pageNumber: pageNumber };
}

export function unreadSummary(db) {
  const unread = db.prepare("SELECT COUNT(*) AS n FROM " + MESSAGE_TABLE + " WHERE deleted_at IS NULL AND read_at IS NULL").get().n;
  const byLevel = db
    .prepare("SELECT level, COUNT(*) AS n FROM " + MESSAGE_TABLE + " WHERE deleted_at IS NULL AND read_at IS NULL GROUP BY level")
    .all();
  const latest = db
    .prepare("SELECT * FROM " + MESSAGE_TABLE + " WHERE deleted_at IS NULL AND read_at IS NULL ORDER BY created_at DESC LIMIT 1")
    .get();
  return {
    unread: Number(unread),
    byLevel: byLevel.map((row) => ({ level: row.level, count: Number(row.n) })),
    latest: latest ? rowMessage(latest) : null,
  };
}

export function listMessages(api, args) {
  const db = api.db;
  const filter = buildFilter(args);
  const page = pageOf(args);
  const total = db.prepare("SELECT COUNT(*) AS n FROM " + MESSAGE_TABLE + " WHERE " + filter.where).get(...filter.params).n;
  const rows = db
    .prepare(
      "SELECT * FROM " + MESSAGE_TABLE + " WHERE " + filter.where +
        " ORDER BY created_at DESC, id DESC LIMIT ? OFFSET ?",
    )
    .all(...filter.params, page.pageSize, (page.pageNumber - 1) * page.pageSize);
  const unread = unreadSummary(db);
  return {
    records: rows.map(rowMessage),
    total: Number(total),
    pageNumber: page.pageNumber,
    pageSize: page.pageSize,
    unread: unread.unread,
  };
}

export function markReadMessages(api, args) {
  const db = api.db;
  const input = args || {};
  const ids = Array.isArray(input.ids) ? input.ids.map((id) => String(id)).filter(Boolean) : [];
  const all = input.all === true;
  if (!ids.length && !all && typeof input.before !== "number") fail("需要 ids、all:true 或 before 其中一个");
  const ts = now();
  let updated = 0;
  if (ids.length) {
    const stmt = db.prepare("UPDATE " + MESSAGE_TABLE + " SET read_at=? WHERE id=? AND deleted_at IS NULL AND read_at IS NULL");
    for (const id of ids) updated += Number(stmt.run(ts, id).changes || 0);
  } else if (all) {
    updated = Number(db.prepare("UPDATE " + MESSAGE_TABLE + " SET read_at=? WHERE deleted_at IS NULL AND read_at IS NULL").run(ts).changes || 0);
  } else {
    updated = Number(
      db.prepare("UPDATE " + MESSAGE_TABLE + " SET read_at=? WHERE deleted_at IS NULL AND read_at IS NULL AND created_at <= ?").run(ts, input.before).changes || 0,
    );
  }
  const unread = unreadSummary(db);
  if (updated && typeof api.emit === "function") api.emit("message.read", { version: 1, updated: updated, unread: unread.unread, ids: ids });
  return { updated: updated, unread: unread.unread, at: ts };
}

function dayKey(ts) {
  return new Date(ts).toISOString().slice(0, 10);
}

export function messageStats(api, args) {
  const db = api.db;
  const input = args || {};
  const days = Math.max(1, Math.min(90, Number(input.days) || 14));
  const ts = now();
  const start = ts - days * 86400000;
  const total = Number(db.prepare("SELECT COUNT(*) AS n FROM " + MESSAGE_TABLE + " WHERE deleted_at IS NULL").get().n);
  const unread = unreadSummary(db);
  const byLevel = db
    .prepare("SELECT level, COUNT(*) AS n, SUM(CASE WHEN read_at IS NULL THEN 1 ELSE 0 END) AS unread FROM " + MESSAGE_TABLE + " WHERE deleted_at IS NULL GROUP BY level")
    .all()
    .map((row) => ({ level: row.level, total: Number(row.n), unread: Number(row.unread || 0) }));
  const bySource = db
    .prepare("SELECT source, COUNT(*) AS n FROM " + MESSAGE_TABLE + " WHERE deleted_at IS NULL GROUP BY source ORDER BY n DESC LIMIT 10")
    .all()
    .map((row) => ({ source: row.source || "（未标注）", total: Number(row.n) }));
  const rows = db.prepare("SELECT created_at FROM " + MESSAGE_TABLE + " WHERE deleted_at IS NULL AND created_at >= ?").all(start);
  const buckets = new Map();
  for (let i = days - 1; i >= 0; i -= 1) buckets.set(dayKey(ts - i * 86400000), 0);
  for (const row of rows) {
    const key = dayKey(row.created_at);
    if (buckets.has(key)) buckets.set(key, buckets.get(key) + 1);
  }
  const oldestUnread = db
    .prepare("SELECT * FROM " + MESSAGE_TABLE + " WHERE deleted_at IS NULL AND read_at IS NULL ORDER BY created_at ASC LIMIT 1")
    .get();
  return {
    generatedAt: ts,
    days: days,
    totals: { total: total, unread: unread.unread, read: total - unread.unread },
    byLevel: LEVELS.map((level) => {
      const hit = byLevel.find((row) => row.level === level);
      return { level: level, total: hit ? hit.total : 0, unread: hit ? hit.unread : 0 };
    }),
    bySource: bySource,
    trend: Array.from(buckets, ([date, count]) => ({ date: date, count: count })),
    oldestUnread: oldestUnread ? rowMessage(oldestUnread) : null,
  };
}

export function registerMessageActions(api) {
  const action = api.action;
  action("message.send", {
    description:
      "发送一条消息到工作台消息中心（agent、子插件、界面共用入口）。level 越严重越显眼；dedupeKey 相同且未删除时幂等返回已有消息（deduped=true）。写入只落本机库，不参与同步与备份。",
    input: {
      type: "object",
      properties: {
        title: { type: "string", description: "消息标题，必填，最多 120 字" },
        body: { type: "string", description: "正文，最多 4000 字，可空" },
        level: { type: "string", enum: LEVELS, description: "级别：info（默认）/ success / warning / error" },
        source: { type: "string", description: "来源标识，最多 40 字，建议用插件名或任务 id（如 tasks、sites）" },
        audience: { type: "string", enum: AUDIENCES, description: "收件人：user（给人看）/ agent（给 agent 看）/ all（默认）" },
        dedupeKey: { type: "string", description: "去重键，最多 120 字；同一键在未删除前只保留一条" },
        meta: { type: "object", description: "附加 JSON，最多 2000 字节，如 {taskId, url}" },
      },
      required: ["title"],
    },
    examples: [
      { purpose: "最小调用", args: { title: "备份完成", body: "本次导出 18 个域", level: "success", source: "host" } },
      { purpose: "幂等重试", args: { title: "同步失败", level: "error", source: "host", dedupeKey: "sync-failed-2026-11-12" } },
    ],
    execute: (args) => sendMessage(api, args),
    render: (r) => {
      const m = r.message || {};
      return "已" + (r.deduped ? "命中已有" : "发送") + "消息「" + m.title + "」(" + m.level + ", " + m.id + ")" + (r.pruned ? "，顺带清理 " + r.pruned + " 条旧消息" : "") + "。";
    },
  });

  action("message.list", {
    description: "分页列出消息，按创建时间倒序；可按未读、级别、来源、收件人、关键词与时间区间过滤",
    input: {
      type: "object",
      properties: {
        unreadOnly: { type: "boolean", description: "只看未读" },
        level: { type: "string", enum: LEVELS, description: "按单个级别过滤" },
        levels: { type: "array", items: { type: "string", enum: LEVELS }, description: "按多个级别过滤" },
        source: { type: "string", description: "按来源精确过滤" },
        audience: { type: "string", enum: AUDIENCES, description: "按收件人过滤" },
        text: { type: "string", description: "标题或正文模糊搜索" },
        since: { type: "number", description: "创建时间下限（毫秒时间戳，含）" },
        before: { type: "number", description: "创建时间上限（毫秒时间戳，不含）" },
        pageNumber: { type: "number", description: "页码，从 1 开始，默认 1" },
        pageSize: { type: "number", description: "每页数量，默认 20，最大 100" },
      },
    },
    execute: (args) => listMessages(api, args),
    render: (r) =>
      "消息 " + r.total + " 条（未读 " + r.unread + "），第 " + r.pageNumber + " 页返回 " + r.records.length + " 条：" +
      r.records.slice(0, 5).map((m) => "[" + m.level + "] " + m.title).join("；"),
  });

  action("message.unreadCount", {
    description: "未读消息计数：总数、按级别分布与最新一条未读",
    input: { type: "object", properties: {}, additionalProperties: false },
    execute: () => unreadSummary(api.db),
    render: (r) => "未读 " + r.unread + " 条" + (r.latest ? "，最新：「" + r.latest.title + "」" : "") + "。",
  });

  action("message.markRead", {
    description: "把消息标记为已读：传 ids、all:true 或 before（毫秒时间戳）三者之一",
    input: {
      type: "object",
      properties: {
        ids: { type: "array", items: { type: "string" }, description: "要标记的消息 id 列表" },
        all: { type: "boolean", description: "全部标记为已读" },
        before: { type: "number", description: "把该时间（毫秒时间戳）及之前创建的消息标记为已读" },
      },
    },
    execute: (args) => markReadMessages(api, args),
    render: (r) => "已标记 " + r.updated + " 条为已读，剩余未读 " + r.unread + " 条。",
  });

  action("message.stats", {
    description: "消息统计：总量、未读、按级别/来源分布与最近 N 天趋势（默认 14 天）",
    input: {
      type: "object",
      properties: { days: { type: "number", description: "趋势天数，1–90，默认 14" } },
    },
    execute: (args) => messageStats(api, args),
    render: (r) =>
      "消息共 " + r.totals.total + " 条（未读 " + r.totals.unread + "）；来源 " + r.bySource.length + " 个；统计 " + r.days + " 天。",
  });
}
