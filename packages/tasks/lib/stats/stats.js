// 任务统计报表：只读聚合，不写库、不发事件。
// 契约见 docs/specs/18-统计报表设计.md §4。

import { configValues } from "../infra/config.js";
import { todayActivity } from "./stats-today.js";

const STATUS_LABELS = {
  "0": "已开启",
  "1": "已关闭",
  "2": "已完成",
  "3": "已重启",
  "4": "已接取",
};

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
        "SELECT date(MIN(created_at)/1000,'unixepoch','localtime') AS d FROM task WHERE deleted_at IS NULL",
      ).get();
      const earliest = row && row.d ? parseDay(row.d) : null;
      from = earliest || addDays(today, -29);
    } else {
      from = addDays(today, -(parseInt(range, 10) - 1));
    }
  }
  const days = diffDays(from, to) + 1;
  const bucket = days <= 120 ? "day" : days <= 730 ? "week" : "month";
  const cfg = configValues(db);
  const weekStartsOn = Number(cfg["stats.weekStartsOn"]) === 0 ? 0 : 1;
  return { from: dayStr(from), to: dayStr(to), days: days, bucket: bucket, weekStartsOn: weekStartsOn };
}

function bucketKeys(range) {
  const from = parseDay(range.from);
  const to = parseDay(range.to);
  const keys = [];
  const index = Object.create(null);
  for (let d = from; d <= to; d = addDays(d, 1)) {
    let key;
    if (range.bucket === "week") {
      const ws = Number(range.weekStartsOn) === 0 ? 0 : 1;
      const wd = (d.getDay() - ws + 7) % 7;
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
    const ws = Number(range.weekStartsOn) === 0 ? 0 : 1;
    const wd = (d.getDay() - ws + 7) % 7;
    return dayStr(addDays(d, -wd));
  }
  if (range.bucket === "month") return day.slice(0, 7);
  return day;
}

function loadNodes(db) {
  const rows = db.prepare(
    "SELECT id,name,parent_id,path FROM task_node WHERE deleted_at IS NULL",
  ).all();
  const map = Object.create(null);
  for (const row of rows) map[String(row.id)] = row;
  return map;
}

function nodePathTitle(node, map) {
  if (!node) return "";
  const segments = String(node.path || "").split("/").filter(Boolean);
  const names = [];
  for (const id of segments) {
    const n = map[id];
    if (n) names.push(String(n.name));
  }
  return names.length ? names.join(" / ") : String(node.name || "");
}

function groupOf(node, map) {
  if (!node) return null;
  const segments = String(node.path || "").split("/").filter(Boolean);
  if (segments.length >= 2 && segments[0] === "1") {
    const gid = segments.length >= 3 ? segments[1] : segments[1];
    return map[gid] || null;
  }
  let cur = node;
  let guard = 0;
  while (cur && String(cur.parent_id) !== "1" && guard < 50) {
    cur = map[String(cur.parent_id)];
    guard += 1;
  }
  if (cur && String(cur.id) === "1") return null;
  return cur || null;
}

function zeroTrend(range) {
  const keys = bucketKeys(range).keys;
  return keys.map(function (key) {
    return { bucket: key, created: 0, done: 0, due: 0 };
  });
}

function fillTrend(trend, range, field, rows) {
  const index = bucketKeys(range).index;
  for (const row of rows) {
    const key = bucketOf(String(row.d || ""), range);
    if (!(key in index)) continue;
    trend[index[key]][field] += Number(row.n || 0);
  }
}

export function statsReport(db, args, api) {
  const input = args || {};
  const range = resolveRange(db, input);
  const top = Math.max(1, Math.min(20, Number(input.top) || 10));
  const today = dayStr(startOfDay(new Date()));
  const tomorrow = dayStr(addDays(startOfDay(new Date()), 1));
  const next7 = dayStr(addDays(startOfDay(new Date()), 7));
  const warnings = [];

  const total = Number(db.prepare("SELECT COUNT(*) AS n FROM task WHERE deleted_at IS NULL").get().n || 0);
  const statusRows = db.prepare(
    "SELECT status, COUNT(*) AS n FROM task WHERE deleted_at IS NULL GROUP BY status",
  ).all();
  const statusCount = Object.create(null);
  for (const row of statusRows) statusCount[String(row.status)] = Number(row.n || 0);
  const active = statusCount["0"] || 0;
  const shutdown = statusCount["1"] || 0;
  const done = statusCount["2"] || 0;
  const restarted = statusCount["3"] || 0;
  // 已接取单列，不并入已开启：两个口径相加不会超过总数。
  const claimed = statusCount["4"] || 0;

  // 逾期/今日到期/未来 7 天都覆盖已接取（4），文案注明「含已接取」。
  const overdue = Number(db.prepare(
    "SELECT COUNT(*) AS n FROM task WHERE deleted_at IS NULL AND status IN ('0','4') AND target_date IS NOT NULL AND target_date<>'' AND target_date<?",
  ).get(today).n || 0);
  const dueToday = Number(db.prepare(
    "SELECT COUNT(*) AS n FROM task WHERE deleted_at IS NULL AND status IN ('0','4') AND target_date=?",
  ).get(today).n || 0);
  const dueNext7 = Number(db.prepare(
    "SELECT COUNT(*) AS n FROM task WHERE deleted_at IS NULL AND status IN ('0','4') AND target_date>=? AND target_date<=?",
  ).get(tomorrow, next7).n || 0);

  const trend = zeroTrend(range);
  fillTrend(trend, range, "created", db.prepare(
    "SELECT date(created_at/1000,'unixepoch','localtime') AS d, COUNT(*) AS n FROM task " +
      "WHERE deleted_at IS NULL AND date(created_at/1000,'unixepoch','localtime') BETWEEN ? AND ? GROUP BY d",
  ).all(range.from, range.to));
  fillTrend(trend, range, "done", db.prepare(
    "SELECT done_date AS d, COUNT(*) AS n FROM task WHERE deleted_at IS NULL AND done_date IS NOT NULL AND done_date<>'' " +
      "AND done_date BETWEEN ? AND ? GROUP BY done_date",
  ).all(range.from, range.to));
  fillTrend(trend, range, "due", db.prepare(
    "SELECT target_date AS d, COUNT(*) AS n FROM task WHERE deleted_at IS NULL AND target_date IS NOT NULL AND target_date<>'' " +
      "AND target_date BETWEEN ? AND ? GROUP BY target_date",
  ).all(range.from, range.to));
  const newInRange = trend.reduce(function (n, row) { return n + row.created; }, 0);
  const doneInRange = trend.reduce(function (n, row) { return n + row.done; }, 0);

  const cycleRow = db.prepare(
    "SELECT AVG(julianday(done_date) - julianday(date(created_at/1000,'unixepoch','localtime'))) AS v FROM task " +
      "WHERE deleted_at IS NULL AND status='2' AND done_date IS NOT NULL AND done_date<>'' AND done_date BETWEEN ? AND ?",
  ).get(range.from, range.to);
  const leadRow = db.prepare(
    "SELECT AVG(julianday(done_date) - julianday(publish_date)) AS v FROM task " +
      "WHERE deleted_at IS NULL AND status='2' AND done_date IS NOT NULL AND done_date<>'' AND done_date BETWEEN ? AND ? " +
      "AND publish_date IS NOT NULL AND publish_date<>''",
  ).get(range.from, range.to);

  const doneMissing = Number(db.prepare(
    "SELECT COUNT(*) AS n FROM task WHERE deleted_at IS NULL AND status='2' AND (done_date IS NULL OR done_date='')",
  ).get().n || 0);
  if (doneMissing > 0) {
    warnings.push({
      code: "done_date_missing",
      message: doneMissing + " 个已完成任务缺少完成日期，未计入完成趋势与周期均值",
    });
  }

  const openZero = db.prepare(
    "SELECT COUNT(*) AS n FROM task WHERE deleted_at IS NULL AND status='0' AND priority=0",
  ).get().n || 0;
  if (openZero > 0) {
    warnings.push({
      code: "priority_zero_open",
      message: openZero + " 个已开启任务优先级为 0（应为 1..10），请用 tasks.update 修正或运行优先级回填",
    });
  }

  const priorityRows = db.prepare(
    "SELECT priority, COUNT(*) AS n FROM task WHERE deleted_at IS NULL GROUP BY priority",
  ).all();
  // 单值分桶：0..10 各自一桶，不再合并区间——区间会把「9 和 10」糊在一起，看不出真实分布。
  // 0 桶只可能是历史数据或异常数据（已开启任务应为 1..10，关闭/完成为 0），
  // 图表不画它，但数据照常下发并标 hidden，导出与数据质量检查仍能拿到全量口径。
  const priorityBins = [];
  for (let p = 0; p <= 10; p += 1) {
    priorityBins.push({ key: String(p), label: String(p), count: 0, hidden: p === 0 });
  }
  for (const row of priorityRows) {
    const n = Number(row.n || 0);
    const p = Math.max(0, Math.min(10, Math.round(Number(row.priority) || 0)));
    priorityBins[p].count += n;
  }

  const difficultyRows = db.prepare(
    "SELECT difficulty, COUNT(*) AS n FROM task WHERE deleted_at IS NULL GROUP BY difficulty",
  ).all();
  // 难度是 0.5 步进的单值（0.5–5），同样一值一桶；0/空值单独归到「未设置」。
  const difficultyBins = [];
  for (let i = 1; i <= 10; i += 1) {
    const v = i / 2;
    difficultyBins.push({ key: String(v), label: String(v), count: 0 });
  }
  let difficultyUnset = 0;
  for (const row of difficultyRows) {
    const n = Number(row.n || 0);
    const d = Number(row.difficulty);
    if (row.difficulty === null || row.difficulty === undefined || !(d > 0)) {
      difficultyUnset += n;
      continue;
    }
    const idx = Math.min(10, Math.max(1, Math.round(d * 2)));
    difficultyBins[idx - 1].count += n;
  }
  // 未填写必须可见，便于从统计巡检并补齐难度。
  difficultyBins.push({ key: "unset", label: "未设置", count: difficultyUnset });

  const overdueRows = db.prepare(
    "SELECT id,title,target_date,table_id FROM task WHERE deleted_at IS NULL AND status IN ('0','4') " +
      "AND target_date IS NOT NULL AND target_date<>'' AND target_date<? ORDER BY target_date ASC, id ASC LIMIT ?",
  ).all(today, Math.min(top, 10));
  const nodeMap = loadNodes(db);
  const overdueList = overdueRows.map(function (row) {
    const table = nodeMap[String(row.table_id)];
    return {
      id: String(row.id),
      title: String(row.title || ""),
      targetDate: String(row.target_date || ""),
      daysOverdue: Math.max(0, diffDays(parseDay(String(row.target_date)), startOfDay(new Date()))),
      tableTitle: table ? String(table.name) : "已删除任务表",
    };
  });

  function limitOf(value) {
    const n = Number(value);
    return Number.isFinite(n) ? Math.max(1, Math.min(50, Math.floor(n))) : 10;
  }
  const recentPublishLimit = limitOf(input.recentPublishLimit);
  const recentDoneLimit = limitOf(input.recentDoneLimit);
  const recentShutdownLimit = limitOf(input.recentShutdownLimit);
  const recentTable = function (tableId) {
    const table = nodeMap[String(tableId)];
    return {
      tableId: table ? String(table.id) : null,
      groupId: table ? String(table.parent_id || "1") : null,
      tableTitle: table ? String(table.name) : "已删除任务表",
      tableDeleted: !table,
    };
  };
  const todayStart = startOfDay(new Date());
  const recentPublishRows = db.prepare(
    "SELECT id,title,publish_date,table_id,difficulty FROM task WHERE deleted_at IS NULL " +
      "ORDER BY (publish_date IS NULL OR publish_date=''), publish_date DESC, updated_at DESC, id DESC LIMIT ?",
  ).all(recentPublishLimit);
  const recentPublish = recentPublishRows.map(function (row) {
    const day = parseDay(String(row.publish_date || ""));
    return {
      id: String(row.id),
      title: String(row.title || ""),
      date: String(row.publish_date || ""),
      daysAgo: day ? Math.max(0, diffDays(day, todayStart)) : null,
      difficulty: Number(row.difficulty) || 0,
      ...recentTable(row.table_id),
    };
  });
  const recentDoneRows = db.prepare(
    "SELECT id,title,done_date,table_id,difficulty FROM task WHERE deleted_at IS NULL AND status='2' " +
      "ORDER BY (done_date IS NULL OR done_date=''), done_date DESC, updated_at DESC, id DESC LIMIT ?",
  ).all(recentDoneLimit);
  const recentDone = recentDoneRows.map(function (row) {
    const day = parseDay(String(row.done_date || ""));
    return {
      id: String(row.id),
      title: String(row.title || ""),
      date: String(row.done_date || ""),
      daysAgo: day ? Math.max(0, diffDays(day, todayStart)) : null,
      difficulty: Number(row.difficulty) || 0,
      ...recentTable(row.table_id),
    };
  });
  const recentShutdownRows = db.prepare(
    "SELECT id,title,shutdown_date,table_id,difficulty FROM task WHERE deleted_at IS NULL AND status='1' " +
      "ORDER BY (shutdown_date IS NULL OR shutdown_date=''), shutdown_date DESC, updated_at DESC, id DESC LIMIT ?",
  ).all(recentShutdownLimit);
  const recentShutdown = recentShutdownRows.map(function (row) {
    const day = parseDay(String(row.shutdown_date || ""));
    return {
      id: String(row.id),
      title: String(row.title || ""),
      date: String(row.shutdown_date || ""),
      daysAgo: day ? Math.max(0, diffDays(day, todayStart)) : null,
      difficulty: Number(row.difficulty) || 0,
      ...recentTable(row.table_id),
    };
  });

  const agingBins = [
    { key: "1-3", label: "1–3 天", count: 0 },
    { key: "4-7", label: "4–7 天", count: 0 },
    { key: "8-14", label: "8–14 天", count: 0 },
    { key: "15-30", label: "15–30 天", count: 0 },
    { key: "30+", label: ">30 天", count: 0 },
  ];
  const agingRows = db.prepare(
    "SELECT target_date FROM task WHERE deleted_at IS NULL AND status IN ('0','4') AND target_date IS NOT NULL AND target_date<>'' AND target_date<?",
  ).all(today);
  for (const row of agingRows) {
    const age = Math.max(1, diffDays(parseDay(String(row.target_date)), startOfDay(new Date())));
    if (age <= 3) agingBins[0].count += 1;
    else if (age <= 7) agingBins[1].count += 1;
    else if (age <= 14) agingBins[2].count += 1;
    else if (age <= 30) agingBins[3].count += 1;
    else agingBins[4].count += 1;
  }

  // 工作区排行是「存量」口径：任务按存活关联在每个工作区各计一次，所以各行合计会大于任务总数。
  // 只认「关联存活 + 工作区存活」，与 tasks.list 的 workspaceIds / noWorkspace 过滤保持同一条件。
  const workspaceAgg = Object.create(null);
  for (const ws of db.prepare(
    "SELECT id,title,name,dir FROM task_workspace WHERE deleted_at IS NULL",
  ).all()) {
    workspaceAgg[String(ws.id)] = {
      id: String(ws.id),
      title: String(ws.title || ""),
      name: String(ws.name || ""),
      dir: ws.dir === null || ws.dir === undefined ? "" : String(ws.dir),
      total: 0, open: 0, overdue: 0, done: 0,
    };
  }
  const workspaceOfTask = Object.create(null);
  for (const link of db.prepare(
    "SELECT workspace_id,task_id FROM task_workspace_link WHERE deleted_at IS NULL",
  ).all()) {
    const wsId = String(link.workspace_id);
    if (!workspaceAgg[wsId]) continue; // 工作区已删：任务回落到「未关联工作区」
    const taskId = String(link.task_id);
    if (!workspaceOfTask[taskId]) workspaceOfTask[taskId] = [];
    workspaceOfTask[taskId].push(wsId);
  }
  const noWorkspaceAgg = {
    id: "__none__", title: "未关联工作区", name: "", dir: "",
    total: 0, open: 0, overdue: 0, done: 0,
  };

  const allTasks = db.prepare(
    "SELECT id,status,target_date,table_id FROM task WHERE deleted_at IS NULL",
  ).all();
  const tableAgg = Object.create(null);
  const groupAgg = Object.create(null);
  for (const row of allTasks) {
    const tableId = row.table_id === null || row.table_id === undefined ? "" : String(row.table_id);
    const tableNode = tableId ? nodeMap[tableId] : null;
    const tableKey = tableNode ? tableId : "__missing__";
    if (!tableAgg[tableKey]) {
      tableAgg[tableKey] = {
        id: tableKey,
        title: tableNode ? String(tableNode.name) : (tableId ? "已删除任务表" : "未归档"),
        path: tableNode ? nodePathTitle(tableNode, nodeMap) : "",
        total: 0, open: 0, overdue: 0, done: 0,
      };
    }
    const isOpen = String(row.status) === "0";
    const isDone = String(row.status) === "2";
    const isOverdue =
      (isOpen || String(row.status) === "4") &&
      !!row.target_date &&
      String(row.target_date) < today;

    const t = tableAgg[tableKey];
    t.total += 1;
    if (isOpen) t.open += 1;
    if (isDone) t.done += 1;
    if (isOverdue) t.overdue += 1;

    const groupNode = groupOf(tableNode, nodeMap);
    const groupKey = groupNode ? String(groupNode.id) : "__ungrouped__";
    if (!groupAgg[groupKey]) {
      groupAgg[groupKey] = {
        id: groupKey,
        title: groupNode ? String(groupNode.name) : "未归档",
        total: 0, open: 0, overdue: 0, done: 0,
      };
    }
    const g = groupAgg[groupKey];
    g.total += 1;
    if (isOpen) g.open += 1;
    if (isDone) g.done += 1;
    if (isOverdue) g.overdue += 1;

    const wsIds = workspaceOfTask[String(row.id)] || [];
    if (!wsIds.length) {
      noWorkspaceAgg.total += 1;
      if (isOpen) noWorkspaceAgg.open += 1;
      if (isDone) noWorkspaceAgg.done += 1;
      if (isOverdue) noWorkspaceAgg.overdue += 1;
    } else {
      for (const wsId of wsIds) {
        const bucket = workspaceAgg[wsId];
        if (!bucket) continue;
        bucket.total += 1;
        if (isOpen) bucket.open += 1;
        if (isDone) bucket.done += 1;
        if (isOverdue) bucket.overdue += 1;
      }
    }
  }
  function withCompletion(item) {
    item.completion = item.total > 0 ? round(item.done / item.total, 3) : 0;
    return item;
  }
  function rank(list) {
    return list.map(withCompletion).sort(function (a, b) {
      return (b.open + b.overdue) - (a.open + a.overdue) || b.total - a.total;
    }).slice(0, top);
  }

  const totals = {
    total: total,
    active: active,
    shutdown: shutdown,
    done: done,
    restarted: restarted,
    claimed: claimed,
    overdue: overdue,
    dueToday: dueToday,
    dueNext7: dueNext7,
    newInRange: newInRange,
  };
  const rates = {
    completion: total > 0 ? round(done / total, 3) : 0,
    // 逾期率分母用「开启+已接取」，与逾期分子口径一致。
    overdue: active + claimed > 0 ? round(overdue / (active + claimed), 3) : 0,
    restart: total > 0 ? round(restarted / total, 3) : 0,
    shutdown: total > 0 ? round(shutdown / total, 3) : 0,
    avgLeadDays: leadRow && Number.isFinite(Number(leadRow.v)) ? round(Number(leadRow.v), 1) : null,
    avgCycleDays: cycleRow && Number.isFinite(Number(cycleRow.v)) ? round(Number(cycleRow.v), 1) : null,
  };

  return {
    generatedAt: Date.now(),
    range: range,
    today: todayActivity(db, today),
    totals: totals,
    rates: rates,
    breakdowns: {
      status: ["0", "1", "2", "4"].map(function (key) {
        return { key: key, label: STATUS_LABELS[key], count: statusCount[key] || 0 };
      }),
      priority: priorityBins,
      difficulty: difficultyBins,
    },
    trend: trend,
    aging: agingBins,
    rankings: {
      tables: rank(Object.keys(tableAgg).map(function (k) { return tableAgg[k]; })),
      groups: rank(Object.keys(groupAgg).map(function (k) { return groupAgg[k]; })),
      workspaces: rank(Object.keys(workspaceAgg).map(function (k) { return workspaceAgg[k]; })),
      noWorkspace: withCompletion(noWorkspaceAgg),
    },
    lists: { overdue: overdueList, recentPublish: recentPublish, recentDone: recentDone, recentShutdown: recentShutdown },
    // 能力标记：前端据此区分「后端未返回某清单」与「清单确实为空」，旧后端缺该字段时按键存在性判断。
    capabilities: { lists: ["overdue", "recentPublish", "recentDone", "recentShutdown"] },
    warnings: warnings,
  };
}

export function renderStats(r) {
  if (!r || !r.totals) return "任务统计暂无数据";
  const t = r.totals;
  return "任务 " + t.total + " 个：已开启 " + t.active + "、已完成 " + t.done + "、已关闭 " + t.shutdown +
    "、已重启 " + t.restarted + "；逾期 " + t.overdue + "；近 " + r.range.days + " 天完成 " +
    r.trend.reduce(function (n, x) { return n + x.done; }, 0) + "、新增 " + t.newInRange + "。";
}
