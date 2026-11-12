// 站点统计报表：只读聚合，不写库、不发事件。
// 契约见 docs/specs/18-统计报表设计.md §6。
import { parseLinks } from "../db/db.js";
import { configValues } from "../infra/config.js";

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
function hasTable(db, name) {
  return !!db.prepare("SELECT 1 AS x FROM sqlite_master WHERE type='table' AND name=?").get(name);
}
function hasTagDomain(db) {
  return hasTable(db, "tag") && hasTable(db, "tag_mapping");
}

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
        "SELECT date(MIN(created_at)/1000,'unixepoch','localtime') AS d FROM site WHERE deleted_at IS NULL",
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

function parseLinksSafe(raw) {
  if (!raw) return { links: [], invalid: false };
  try {
    const data = typeof raw === "string" ? JSON.parse(raw) : raw;
    if (!Array.isArray(data)) return { links: [], invalid: true };
    return { links: parseLinks(data), invalid: false };
  } catch {
    return { links: [], invalid: true };
  }
}

function normalizeUrl(raw) {
  const text = String(raw || "").trim();
  if (!text) return "";
  try {
    const u = new URL(text);
    const pathname = u.pathname.replace(/\/+$/, "");
    return (u.protocol + "//" + u.host + pathname + u.search).toLowerCase();
  } catch {
    return text.replace(/\/+$/, "").toLowerCase();
  }
}

export function statsReport(db, args) {
  const input = args || {};
  const range = resolveRange(db, input);
  const top = Math.max(1, Math.min(20, Number(input.top) || 10));
  const warnings = [];
  const tagsAvailable = hasTagDomain(db);

  const sites = db.prepare(
    "SELECT id,site_name,description,bindable,site_link,created_at,updated_at FROM site WHERE deleted_at IS NULL ORDER BY id ASC",
  ).all();
  const totalSites = sites.length;
  let bindable = 0;
  let withLink = 0;
  let noLink = 0;
  let multiLink = 0;
  let invalidLinks = 0;
  const cfg = configValues(db);
  const staleDays = Number(cfg["stats.staleDays"]) || 90;
  const duplicateLimit = Number(cfg["stats.duplicateLimit"]) || 5;
  const freshnessBins = [
    { key: "7d", label: "0–7 天", count: 0 },
    { key: "30d", label: "8–30 天", count: 0 },
    { key: "stale", label: "31–" + staleDays + " 天", count: 0 },
    { key: "stale+", label: ">" + staleDays + " 天", count: 0 },
  ];
  const today = startOfDay(new Date());
  const stale = [];
  const urlGroups = Object.create(null);
  for (const row of sites) {
    if (Number(row.bindable) !== 0) bindable += 1;
    const parsed = parseLinksSafe(row.site_link);
    if (parsed.invalid) invalidLinks += 1;
    const count = parsed.links.filter(function (l) { return !!String(l.link || "").trim(); }).length;
    if (count === 0) noLink += 1;
    else if (count === 1) withLink += 1;
    else { withLink += 1; multiLink += 1; }
    const age = Math.max(0, diffDays(parseDay(dayStr(new Date(Number(row.updated_at) || 0))), today));
    if (age <= 7) freshnessBins[0].count += 1;
    else if (age <= 30) freshnessBins[1].count += 1;
    else if (age <= staleDays) freshnessBins[2].count += 1;
    else freshnessBins[3].count += 1;
    stale.push({
      id: String(row.id),
      name: String(row.site_name || ""),
      updatedAt: Number(row.updated_at || 0),
      ageDays: age,
    });
    for (const link of parsed.links) {
      const url = normalizeUrl(link.link);
      if (!url) continue;
      if (!urlGroups[url]) urlGroups[url] = [];
      urlGroups[url].push({ id: String(row.id), name: String(row.site_name || "") });
    }
  }
  if (invalidLinks > 0) {
    warnings.push({ code: "site_link_invalid", message: invalidLinks + " 个站点的链接 JSON 无法解析，按 0 链接统计" });
  }

  const nodes = db.prepare(
    "SELECT id,name,parent_id,path,sort,depth FROM site_node WHERE deleted_at IS NULL ORDER BY depth ASC, sort ASC, id ASC",
  ).all();
  const mappings = db.prepare(
    "SELECT site_id,node_id FROM site_node_mapping WHERE deleted_at IS NULL",
  ).all();
  const nodeMap = Object.create(null);
  for (const n of nodes) nodeMap[String(n.id)] = n;
  const directMap = Object.create(null);
  const siteIdsWithNode = new Set();
  const mappingNodeIds = [];
  for (const m of mappings) {
    const nid = String(m.node_id);
    if (!nodeMap[nid]) continue;
    directMap[nid] = (directMap[nid] || 0) + 1;
    siteIdsWithNode.add(String(m.site_id));
    mappingNodeIds.push({ siteId: String(m.site_id), node: nodeMap[nid] });
  }
  const nodeBreakdown = nodes.map(function (n) {
    const path = String(n.path || "");
    let subtree = 0;
    const seen = new Set();
    for (const m of mappingNodeIds) {
      if (String(m.node.path || "").indexOf(path) === 0 && !seen.has(m.siteId)) {
        seen.add(m.siteId);
        subtree += 1;
      }
    }
    return {
      id: String(n.id),
      name: String(n.name || ""),
      path: path,
      depth: Number(n.depth || 0),
      direct: directMap[String(n.id)] || 0,
      subtree: subtree,
    };
  });
  const emptyNodes = nodeBreakdown.filter(function (n) { return n.subtree === 0; }).map(function (n) {
    return { id: n.id, name: n.name, path: n.path, depth: n.depth };
  });

  let tagged = null;
  let untagged = null;
  let topTags = null;
  if (tagsAvailable) {
    tagged = Number(db.prepare(
      "SELECT COUNT(DISTINCT m.item_id) AS n FROM tag_mapping m JOIN site s ON s.id=m.item_id AND s.deleted_at IS NULL " +
        "WHERE m.item_type='site' AND m.deleted_at IS NULL",
    ).get().n || 0);
    untagged = Math.max(0, totalSites - tagged);
    topTags = db.prepare(
      "SELECT t.id, t.name, COUNT(DISTINCT m.item_id) AS n FROM tag t " +
        "JOIN tag_mapping m ON m.tag_id=t.id AND m.deleted_at IS NULL AND m.item_type='site' " +
        "JOIN site s ON s.id=m.item_id AND s.deleted_at IS NULL " +
        "WHERE t.deleted_at IS NULL GROUP BY t.id ORDER BY n DESC, t.id ASC LIMIT ?",
    ).all(top).map(function (row) {
      return {
        id: String(row.id),
        name: String(row.name || ""),
        count: Number(row.n || 0),
        share: totalSites > 0 ? round(Number(row.n || 0) / totalSites, 3) : 0,
      };
    });
  } else {
    warnings.push({ code: "tag_domain_missing", message: "标签插件未启用，标签相关区块已隐藏" });
  }

  const newSites = Number(db.prepare(
    "SELECT COUNT(*) AS n FROM site WHERE deleted_at IS NULL AND date(created_at/1000,'unixepoch','localtime') BETWEEN ? AND ?",
  ).get(range.from, range.to).n || 0);
  const newNodeRows = db.prepare(
    "SELECT COUNT(*) AS n FROM site_node WHERE deleted_at IS NULL AND date(created_at/1000,'unixepoch','localtime') BETWEEN ? AND ?",
  ).get(range.from, range.to);
  const newNodes = Number(newNodeRows.n || 0);

  const keys = bucketKeys(range);
  const trend = keys.keys.map(function (key) {
    return { bucket: key, sites: 0, nodes: 0 };
  });
  const siteTrend = db.prepare(
    "SELECT date(created_at/1000,'unixepoch','localtime') AS d, COUNT(*) AS n FROM site " +
      "WHERE deleted_at IS NULL AND date(created_at/1000,'unixepoch','localtime') BETWEEN ? AND ? GROUP BY d",
  ).all(range.from, range.to);
  const nodeTrend = db.prepare(
    "SELECT date(created_at/1000,'unixepoch','localtime') AS d, COUNT(*) AS n FROM site_node " +
      "WHERE deleted_at IS NULL AND date(created_at/1000,'unixepoch','localtime') BETWEEN ? AND ? GROUP BY d",
  ).all(range.from, range.to);
  for (const row of siteTrend) {
    const key = bucketOf(String(row.d || ""), range);
    if (key in keys.index) trend[keys.index[key]].sites += Number(row.n || 0);
  }
  for (const row of nodeTrend) {
    const key = bucketOf(String(row.d || ""), range);
    if (key in keys.index) trend[keys.index[key]].nodes += Number(row.n || 0);
  }

  const duplicates = Object.keys(urlGroups)
    .filter(function (url) { return urlGroups[url].length > 1; })
    .sort(function (a, b) { return urlGroups[b].length - urlGroups[a].length; })
    .slice(0, duplicateLimit)
    .map(function (url) {
      return { url: url, sites: urlGroups[url].slice(0, 5) };
    });

  const orphanSites = sites.filter(function (s) {
    return !siteIdsWithNode.has(String(s.id));
  }).slice(0, top).map(function (s) {
    return { id: String(s.id), name: String(s.site_name || "") };
  });

  const staleList = stale.slice().sort(function (a, b) {
    return b.ageDays - a.ageDays || a.id.localeCompare(b.id);
  }).slice(0, top);

  const sortedNodes = nodeBreakdown.slice().sort(function (a, b) {
    return b.subtree - a.subtree || a.depth - b.depth;
  }).slice(0, top).map(function (n) {
    return {
      id: n.id,
      name: n.name,
      subtree: n.subtree,
      share: totalSites > 0 ? round(n.subtree / totalSites, 3) : 0,
    };
  });

  return {
    generatedAt: Date.now(),
    range: range,
    totals: {
      sites: totalSites,
      bindable: bindable,
      unbindable: totalSites - bindable,
      nodes: nodes.length,
      tagged: tagged,
      untagged: untagged,
      withLink: withLink,
      noLink: noLink,
      multiLink: multiLink,
      newSites: newSites,
      newNodes: newNodes,
    },
    rates: {
      tagCoverage: tagsAvailable && totalSites > 0 ? round(tagged / totalSites, 3) : null,
      linkCoverage: totalSites > 0 ? round(withLink / totalSites, 3) : 0,
      bindableRatio: totalSites > 0 ? round(bindable / totalSites, 3) : 0,
    },
    breakdowns: {
      nodes: nodeBreakdown,
      links: [
        { key: "0", label: "无链接", count: noLink },
        { key: "1", label: "1 个", count: withLink - multiLink },
        { key: "2+", label: "≥2 个", count: multiLink },
      ],
      freshness: freshnessBins,
    },
    rankings: {
      topNodes: sortedNodes,
      topTags: topTags,
    },
    trend: trend,
    lists: {
      stale: staleList,
      duplicates: duplicates,
      orphanSites: orphanSites,
      emptyNodes: emptyNodes,
    },
    warnings: warnings,
  };
}

export function renderStats(r) {
  if (!r || !r.totals) return "站点统计暂无数据";
  const t = r.totals;
  const coverage = r.rates && r.rates.tagCoverage !== null && r.rates.tagCoverage !== undefined
    ? (r.rates.tagCoverage * 100).toFixed(1) + "%"
    : "标签不可用";
  return "站点 " + t.sites + " 个：可绑定 " + t.bindable + "、有标签 " + (t.tagged === null ? "—" : t.tagged) +
    "（" + coverage + "）、无链接 " + t.noLink + "；目录 " + t.nodes + " 个，空目录 " +
    (r.lists && r.lists.emptyNodes ? r.lists.emptyNodes.length : 0) + " 个。";
}
