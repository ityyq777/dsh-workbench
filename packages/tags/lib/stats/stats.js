// 标签统计报表：只读聚合，不写库、不发事件。
// 契约见 docs/specs/18-统计报表设计.md §5。

function pad(n) {
  return String(n).padStart(2, "0");
}
function dayStr(d) {
  return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
}
function startOfDay(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
function addDays(d, n) {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  x.setDate(x.getDate() + n);
  return x;
}
function parseDay(value) {
  const s = String(value || "");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
  const p = s.split("-").map(Number);
  const d = new Date(p[0], p[1] - 1, p[2]);
  if (d.getFullYear() !== p[0] || d.getMonth() !== p[1] - 1 || d.getDate() !== p[2]) return null;
  return d;
}
function diffDays(from, to) {
  const a = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate());
  const b = Date.UTC(to.getFullYear(), to.getMonth(), to.getDate());
  return Math.round((b - a) / 86400000);
}
function round(n, digits) {
  if (!Number.isFinite(n)) return 0;
  const f = Math.pow(10, digits === undefined ? 1 : digits);
  return Math.round(n * f) / f;
}
import { configValues } from "../infra/config.js";

function hasTable(db, name) {
  return !!db.prepare("SELECT 1 AS x FROM sqlite_master WHERE type='table' AND name=?").get(name);
}

const TYPE_LABELS = { site: "站点", task: "任务", storage: "物品" };

function resolveRange(db, args) {
  const today = startOfDay(new Date());
  let from;
  let to = today;
  if (args.from || args.to) {
    if (!args.from || !args.to) throw new Error("from 与 to 必须同时提供");
    from = parseDay(args.from);
    to = parseDay(args.to);
    if (!from || !to) throw new Error("from/to 必须是合法的 YYYY-MM-DD 日期");
    if (from > to) throw new Error("from 不能晚于 to");
  } else {
    const range = String(args.range || "30d");
    if (["7d", "30d", "90d", "365d", "all"].indexOf(range) < 0) {
      throw new Error("不支持的时间范围：" + range);
    }
    if (range === "all") {
      const row = db.prepare(
        "SELECT date(MIN(created_at)/1000,'unixepoch','localtime') AS d FROM tag WHERE deleted_at IS NULL",
      ).get();
      const earliest = row && row.d ? parseDay(row.d) : null;
      from = earliest || addDays(today, -29);
    } else {
      from = addDays(today, -(parseInt(range, 10) - 1));
    }
  }
  const days = diffDays(from, to) + 1;
  const bucket = days <= 120 ? "day" : days <= 730 ? "week" : "month";
  return { from: dayStr(from), to: dayStr(to), days: days, bucket: bucket };
}

function bucketKeys(range) {
  const from = parseDay(range.from);
  const to = parseDay(range.to);
  const keys = [];
  const index = Object.create(null);
  for (let d = from; d <= to; d = addDays(d, 1)) {
    let key;
    if (range.bucket === "week") {
      const wd = (d.getDay() + 6) % 7;
      key = dayStr(addDays(d, -wd));
    } else if (range.bucket === "month") {
      key = dayStr(d).slice(0, 7);
    } else {
      key = dayStr(d);
    }
    if (!(key in index)) {
      index[key] = keys.length;
      keys.push(key);
    }
  }
  return { keys: keys, index: index };
}

function bucketOf(day, range) {
  const d = parseDay(day);
  if (!d) return "";
  if (range.bucket === "week") {
    const wd = (d.getDay() + 6) % 7;
    return dayStr(addDays(d, -wd));
  }
  if (range.bucket === "month") return day.slice(0, 7);
  return day;
}

export function quickStats(db) {
  const tags = Number(db.prepare("SELECT COUNT(*) AS n FROM tag WHERE deleted_at IS NULL").get().n || 0);
  const mappings = Number(db.prepare("SELECT COUNT(*) AS n FROM tag_mapping WHERE deleted_at IS NULL").get().n || 0);
  const used = Number(db.prepare(
    "SELECT COUNT(DISTINCT m.tag_id) AS n FROM tag_mapping m JOIN tag t ON t.id=m.tag_id AND t.deleted_at IS NULL WHERE m.deleted_at IS NULL",
  ).get().n || 0);
  const items = Number(db.prepare(
    "SELECT COUNT(DISTINCT m.item_type || char(31) || m.item_id) AS n FROM tag_mapping m WHERE m.deleted_at IS NULL",
  ).get().n || 0);
  return { tags: tags, used: used, unused: Math.max(0, tags - used), mappings: mappings, items: items };
}

export function statsReport(db, args) {
  const input = args || {};
  const range = resolveRange(db, input);
  const top = Math.max(1, Math.min(100, Math.floor(Number(input.top) || 10)));
  const listTop = Math.min(top, 20);
  const requestedTopTags = Number(input.topTagsLimit);
  const topTagsLimit = input.topTagsLimit == null || !Number.isFinite(requestedTopTags)
    ? 100 : Math.max(1, Math.min(200, Math.floor(requestedTopTags)));
  const warnings = [];

  if (!hasTable(db, "tag") || !hasTable(db, "tag_mapping")) {
    return {
      generatedAt: Date.now(),
      range: range,
      totals: null,
      rates: null,
      breakdowns: null,
      trend: [],
      rankings: null,
      lists: null,
      warnings: [{ code: "tag_domain_missing", message: "标签数据表不存在，统计不可用" }],
    };
  }

  const totalTags = Number(db.prepare("SELECT COUNT(*) AS n FROM tag WHERE deleted_at IS NULL").get().n || 0);
  const mappings = Number(db.prepare("SELECT COUNT(*) AS n FROM tag_mapping WHERE deleted_at IS NULL").get().n || 0);
  const used = Number(db.prepare(
    "SELECT COUNT(DISTINCT m.tag_id) AS n FROM tag_mapping m JOIN tag t ON t.id=m.tag_id AND t.deleted_at IS NULL WHERE m.deleted_at IS NULL",
  ).get().n || 0);
  const items = Number(db.prepare(
    "SELECT COUNT(DISTINCT m.item_type || char(31) || m.item_id) AS n FROM tag_mapping m WHERE m.deleted_at IS NULL",
  ).get().n || 0);

  const usageRows = db.prepare(
    "SELECT t.id, t.name, COUNT(m.id) AS cnt, MAX(m.updated_at) AS last " +
      "FROM tag t LEFT JOIN tag_mapping m ON m.tag_id=t.id AND m.deleted_at IS NULL " +
      "WHERE t.deleted_at IS NULL GROUP BY t.id ORDER BY t.id ASC",
  ).all();
  const usageBins = [
    { key: "0", label: "0 次", count: 0 },
    { key: "1-2", label: "1–2 次", count: 0 },
    { key: "3-5", label: "3–5 次", count: 0 },
    { key: "6-10", label: "6–10 次", count: 0 },
    { key: "10+", label: ">10 次", count: 0 },
  ];
  const tagRows = usageRows.map(function (row) {
    const count = Number(row.cnt || 0);
    if (count === 0) usageBins[0].count += 1;
    else if (count <= 2) usageBins[1].count += 1;
    else if (count <= 5) usageBins[2].count += 1;
    else if (count <= 10) usageBins[3].count += 1;
    else usageBins[4].count += 1;
    return {
      id: String(row.id),
      name: String(row.name || ""),
      count: count,
      lastUsedAt: row.last === null || row.last === undefined ? null : Number(row.last),
    };
  });

  const typeRows = db.prepare(
    "SELECT item_type, COUNT(*) AS mappings, COUNT(DISTINCT item_id) AS items FROM tag_mapping WHERE deleted_at IS NULL GROUP BY item_type",
  ).all();
  const itemTypes = [];
  let otherMappings = 0;
  let otherItems = 0;
  for (const row of typeRows) {
    const key = String(row.item_type || "");
    if (!(key in TYPE_LABELS)) {
      otherMappings += Number(row.mappings || 0);
      otherItems += Number(row.items || 0);
      continue;
    }
    itemTypes.push({
      key: key,
      label: TYPE_LABELS[key],
      mappings: Number(row.mappings || 0),
      items: Number(row.items || 0),
    });
  }
  if (otherMappings > 0) {
    itemTypes.push({ key: "other", label: "其他", mappings: otherMappings, items: otherItems });
    warnings.push({ code: "item_type_unknown", message: otherMappings + " 条关联的对象类型未知，已归入「其他」" });
  }

  const newTags = Number(db.prepare(
    "SELECT COUNT(*) AS n FROM tag WHERE deleted_at IS NULL AND date(created_at/1000,'unixepoch','localtime') BETWEEN ? AND ?",
  ).get(range.from, range.to).n || 0);
  const newMappings = Number(db.prepare(
    "SELECT COUNT(*) AS n FROM tag_mapping WHERE deleted_at IS NULL AND date(created_at/1000,'unixepoch','localtime') BETWEEN ? AND ?",
  ).get(range.from, range.to).n || 0);

  const keys = bucketKeys(range);
  const trend = keys.keys.map(function (key) {
    return { bucket: key, tags: 0, mappings: 0 };
  });
  const tagTrend = db.prepare(
    "SELECT date(created_at/1000,'unixepoch','localtime') AS d, COUNT(*) AS n FROM tag " +
      "WHERE deleted_at IS NULL AND date(created_at/1000,'unixepoch','localtime') BETWEEN ? AND ? GROUP BY d",
  ).all(range.from, range.to);
  const mapTrend = db.prepare(
    "SELECT date(created_at/1000,'unixepoch','localtime') AS d, COUNT(*) AS n FROM tag_mapping " +
      "WHERE deleted_at IS NULL AND date(created_at/1000,'unixepoch','localtime') BETWEEN ? AND ? GROUP BY d",
  ).all(range.from, range.to);
  for (const row of tagTrend) {
    const key = bucketOf(String(row.d || ""), range);
    if (key in keys.index) trend[keys.index[key]].tags += Number(row.n || 0);
  }
  for (const row of mapTrend) {
    const key = bucketOf(String(row.d || ""), range);
    if (key in keys.index) trend[keys.index[key]].mappings += Number(row.n || 0);
  }

  const sortedByCount = tagRows.slice().sort(function (a, b) {
    return b.count - a.count || (b.lastUsedAt || 0) - (a.lastUsedAt || 0) || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
  });
  const topTags = sortedByCount.slice(0, topTagsLimit).map(function (row) {
    return {
      id: row.id,
      name: row.name,
      count: row.count,
      share: mappings > 0 ? round(row.count / mappings, 3) : 0,
      lastUsedAt: row.lastUsedAt,
    };
  });

  const cfg = configValues(db);
  const staleDays = Number(cfg["stats.staleDays"]) || 90;
  const staleBefore = Date.now() - staleDays * 86400000;
  const includeUnused = cfg["stats.staleIncludeUnused"] !== false;
  const stale = tagRows.filter(function (row) {
    if (row.count === 0) return includeUnused;
    return !row.lastUsedAt || row.lastUsedAt < staleBefore;
  }).sort(function (a, b) {
    if (a.count === 0 && b.count !== 0) return -1;
    if (b.count === 0 && a.count !== 0) return 1;
    return (a.lastUsedAt || 0) - (b.lastUsedAt || 0);
  }).slice(0, listTop).map(function (row) {
    return { id: row.id, name: row.name, count: row.count, lastUsedAt: row.lastUsedAt };
  });

  const recent = tagRows.filter(function (row) { return !!row.lastUsedAt; })
    .sort(function (a, b) { return (b.lastUsedAt || 0) - (a.lastUsedAt || 0); })
    .slice(0, Math.min(top, 10))
    .map(function (row) { return { id: row.id, name: row.name, count: row.count, lastUsedAt: row.lastUsedAt }; });

  return {
    generatedAt: Date.now(),
    range: range,
    totals: {
      tags: totalTags,
      used: used,
      unused: Math.max(0, totalTags - used),
      mappings: mappings,
      items: items,
      avgPerItem: items > 0 ? round(mappings / items, 2) : 0,
      newTags: newTags,
      newMappings: newMappings,
    },
    rates: {
      usedRatio: totalTags > 0 ? round(used / totalTags, 3) : 0,
      orphanRatio: totalTags > 0 ? round(Math.max(0, totalTags - used) / totalTags, 3) : 0,
    },
    breakdowns: { usage: usageBins, itemTypes: itemTypes },
    rankings: { topTags: topTags },
    trend: trend,
    lists: { stale: stale, recent: recent },
    warnings: warnings,
  };
}

export function renderStats(r) {
  if (!r || !r.totals) return "标签统计暂无数据";
  const t = r.totals;
  return "标签 " + t.tags + " 个：已用 " + t.used + "、未用 " + t.unused + "；关联 " + t.mappings +
    " 条，覆盖 " + t.items + " 个对象；近 " + r.range.days + " 天新增 " + t.newTags + " 个标签。";
}
