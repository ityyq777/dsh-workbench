/**
 * 时间线维度的只读统计：当前存量（总数、空线、归属、规模、Top 排行、逾期）
 * 与可选的范围内事件分开返回，避免把「范围内没有任务」误读成「空线」。
 * 口径与 tasks.timelines 列表一致：排除软删除任务/时间线/关联与已重启任务。
 */
import { todayStr } from "../db/db.js";

const LIVE_TASK = "t.deleted_at IS NULL AND t.status!='3'";
const LIVE_ENT = "e.deleted_at IS NULL";
const MEMBERS = "task_timeline_link l JOIN task t ON t.id=l.task_id JOIN task_timeline e ON e.id=l.timeline_id";

export const TIMELINE_STATS_SCOPE = {
  includeRestarted: false,
  exclusion: "排除软删除任务、时间线与关联；已重启任务（status=3）不计入有效任务，因此与含已重启的任务总览数量不同",
  membership: "归属以 task_timeline_link 有效关联判定，不看 task.timeline_key 兼容列",
  activity: "lastActivityDate 取发布/完成/关闭日与创建/修改本地日的最大日期，计划 targetDate 不算活动",
  overdue: "overdueCount = status=0 且 targetDate 早于今天",
  empty: "空线指存活且有效任务数为 0 的时间线（含尚未添加任务、成员被移出/删除/重启）",
  trend: "趋势按日期范围统计范围内事件；存量指标不随范围变化，范围内没有任务不等于空线",
};

const DISTRIBUTION = [
  { key: "0", label: "0（空线）", min: 0, max: 0 },
  { key: "1", label: "1", min: 1, max: 1 },
  { key: "2-5", label: "2–5", min: 2, max: 5 },
  { key: "6-10", label: "6–10", min: 6, max: 10 },
  { key: "11-50", label: "11–50", min: 11, max: 50 },
  { key: "51+", label: "51 及以上", min: 51, max: Infinity },
];

function intArg(value, fallback, min, max, name) {
  if (value === undefined || value === null) return fallback;
  const n = Number(value);
  if (!Number.isInteger(n) || n < min || n > max) throw new Error(name + " 必须是 " + min + ".." + max + " 的整数");
  return n;
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
function dateArg(value, name) {
  if (value === undefined || value === null || value === "") return null;
  const text = String(value);
  if (!DATE_RE.test(text)) throw new Error(name + " 必须是 YYYY-MM-DD");
  const parsed = new Date(text + "T00:00:00");
  if (Number.isNaN(parsed.getTime())) throw new Error(name + " 不是有效日期");
  return text;
}

function rangeArgs(args) {
  const from = dateArg(args.from, "from");
  const to = dateArg(args.to, "to");
  if ((from && !to) || (!from && to)) throw new Error("from 与 to 必须同时提供");
  if (!from) return null;
  const swapped = from > to;
  return { from: swapped ? to : from, to: swapped ? from : to, swapped };
}

function ratio(part, whole) {
  return whole > 0 ? Math.round((part / whole) * 1000) / 10 : null;
}

function distributionOf(lines) {
  const counts = new Map(DISTRIBUTION.map((bin) => [bin.key, 0]));
  for (const line of lines) {
    const bin = DISTRIBUTION.find((item) => line.taskCount >= item.min && line.taskCount <= item.max);
    counts.set(bin.key, counts.get(bin.key) + 1);
  }
  return DISTRIBUTION.map((bin) => ({ key: bin.key, label: bin.label, count: counts.get(bin.key) }));
}

function trendOf(db, range) {
  const inRange = "substr(?,1,10) BETWEEN ? AND ?";
  const newTimelines = Number(db.prepare(
    "SELECT COUNT(*) AS n FROM task_timeline WHERE deleted_at IS NULL AND date(created_at/1000.0,'unixepoch','localtime') BETWEEN ? AND ?",
  ).get(range.from, range.to).n);
  const newTasks = Number(db.prepare(
    "SELECT COUNT(*) AS n FROM task t WHERE " + LIVE_TASK + " AND substr(COALESCE(publish_date,''),1,10) BETWEEN ? AND ?",
  ).get(range.from, range.to).n);
  const doneTasks = Number(db.prepare(
    "SELECT COUNT(*) AS n FROM task t WHERE " + LIVE_TASK + " AND t.status='2' AND substr(COALESCE(done_date,''),1,10) BETWEEN ? AND ?",
  ).get(range.from, range.to).n);
  void inRange;
  return { from: range.from, to: range.to, swapped: range.swapped === true, newTimelines, newTasks, doneTasks };
}

export function timelineStats(db, args = {}) {
  const topLimit = intArg(args.topLimit, 100, 1, 100, "topLimit");
  const range = rangeArgs(args);
  const today = todayStr();
  const totalsRow = db.prepare(
    "SELECT (SELECT COUNT(*) FROM task_timeline WHERE deleted_at IS NULL) AS timelines, " +
    "(SELECT COUNT(*) FROM task t WHERE " + LIVE_TASK + ") AS tasks, " +
    "(SELECT COUNT(*) FROM " + MEMBERS + " WHERE l.deleted_at IS NULL AND " + LIVE_ENT + " AND " + LIVE_TASK + ") AS assignedTasks, " +
    "(SELECT COUNT(DISTINCT l.timeline_id) FROM " + MEMBERS + " WHERE l.deleted_at IS NULL AND " + LIVE_ENT + " AND " + LIVE_TASK + ") AS linesWithTasks",
  ).get();
  const lines = db.prepare(
    "WITH eligible AS (SELECT l.timeline_id AS tid,t.status AS status,t.target_date AS target_date,t.publish_date AS publish_date,t.done_date AS done_date,t.shutdown_date AS shutdown_date,t.created_at AS created_at,t.updated_at AS updated_at FROM " + MEMBERS + " WHERE l.deleted_at IS NULL AND " + LIVE_ENT + " AND " + LIVE_TASK + "), " +
    "counts AS (SELECT tid,COUNT(*) AS taskCount,SUM(CASE WHEN status='0' THEN 1 ELSE 0 END) AS openCount,SUM(CASE WHEN status='2' THEN 1 ELSE 0 END) AS doneCount,SUM(CASE WHEN status='1' THEN 1 ELSE 0 END) AS shutdownCount,SUM(CASE WHEN status='0' AND target_date IS NOT NULL AND target_date<>'' AND substr(target_date,1,10)<? THEN 1 ELSE 0 END) AS overdueCount,MAX(MAX(COALESCE(substr(publish_date,1,10),''),COALESCE(substr(done_date,1,10),''),COALESCE(substr(shutdown_date,1,10),''),COALESCE(date(created_at/1000.0,'unixepoch','localtime'),''),COALESCE(date(updated_at/1000.0,'unixepoch','localtime'),''))) AS lastActivityDate FROM eligible GROUP BY tid) " +
    "SELECT e.id AS id,e.title AS title,COALESCE(c.taskCount,0) AS taskCount,COALESCE(c.openCount,0) AS openCount,COALESCE(c.doneCount,0) AS doneCount,COALESCE(c.shutdownCount,0) AS shutdownCount,COALESCE(c.overdueCount,0) AS overdueCount,c.lastActivityDate AS lastActivityDate " +
    "FROM task_timeline e LEFT JOIN counts c ON c.tid=e.id WHERE " + LIVE_ENT + " ORDER BY taskCount DESC,e.id ASC",
  ).all(today);
  const rows = lines.map((line) => ({
    id: String(line.id),
    title: String(line.title || ""),
    taskCount: Number(line.taskCount),
    openCount: Number(line.openCount),
    doneCount: Number(line.doneCount),
    shutdownCount: Number(line.shutdownCount),
    overdueCount: Number(line.overdueCount),
    doneRate: line.taskCount > 0 ? Math.round((Number(line.doneCount) / Number(line.taskCount)) * 1000) / 10 : null,
    lastActivityDate: line.lastActivityDate || null,
  }));
  const withTasks = rows.filter((line) => line.taskCount > 0);
  const top = withTasks.slice(0, topLimit);
  const totals = {
    timelines: Number(totalsRow.timelines),
    timelinesWithTasks: Number(totalsRow.linesWithTasks),
    emptyTimelines: Number(totalsRow.timelines) - Number(totalsRow.linesWithTasks),
    emptyRatio: ratio(Number(totalsRow.timelines) - Number(totalsRow.linesWithTasks), Number(totalsRow.timelines)),
    tasks: Number(totalsRow.tasks),
    assignedTasks: Number(totalsRow.assignedTasks),
    unassignedTasks: Number(totalsRow.tasks) - Number(totalsRow.assignedTasks),
    coverage: ratio(Number(totalsRow.assignedTasks), Number(totalsRow.tasks)),
  };
  return {
    generatedAt: new Date().toISOString(),
    scope: TIMELINE_STATS_SCOPE,
    totals,
    invariants: {
      assignedPlusUnassigned: totals.assignedTasks + totals.unassignedTasks === totals.tasks,
      linesPlusEmpty: totals.timelinesWithTasks + totals.emptyTimelines === totals.timelines,
    },
    top: { limit: topLimit, returned: top.length, truncated: withTasks.length > top.length, records: top },
    distribution: distributionOf(rows),
    overdue: {
      lines: rows.filter((line) => line.overdueCount > 0).slice(0, topLimit),
      lineCount: rows.filter((line) => line.overdueCount > 0).length,
      taskCount: rows.reduce((sum, line) => sum + line.overdueCount, 0),
    },
    ...(range ? { trend: trendOf(db, range) } : {}),
  };
}

export function renderTimelineStats(result) {
  const t = result.totals;
  const pieces = [
    "时间线 " + t.timelines + " 条（有任务 " + t.timelinesWithTasks + "、空线 " + t.emptyTimelines + (t.emptyRatio === null ? "" : "，" + t.emptyRatio + "%") + "）",
    "有效任务 " + t.tasks + "：" + t.assignedTasks + " 已归属 / " + t.unassignedTasks + " 未归属" + (t.coverage === null ? "" : "（覆盖率 " + t.coverage + "%）"),
  ];
  const lines = ["时间线统计：" + pieces.join("；")];
  if (result.top.records.length) {
    lines.push("Top" + result.top.returned + (result.top.truncated ? "/" + t.timelinesWithTasks + "（已截断）" : "") + "："
      + result.top.records.map((line) => line.title + "=" + line.taskCount + "（已开启 " + line.openCount + "/完成 " + line.doneCount + "/关闭 " + line.shutdownCount + "）").join("，"));
  }
  if (result.overdue.taskCount) lines.push("逾期任务 " + result.overdue.taskCount + " 个，分布在 " + result.overdue.lineCount + " 条时间线");
  if (result.trend) lines.push("趋势 " + result.trend.from + "~" + result.trend.to + "：新增时间线 " + result.trend.newTimelines + "、新增任务 " + result.trend.newTasks + "、完成 " + result.trend.doneTasks);
  return lines.join("\n");
}

export function registerTimelineStatsAction(api) {
  api.action("tasks.timelineStats", {
    description: "只读时间线统计：当前存量 + 可选范围内趋势。" + TIMELINE_STATS_SCOPE.exclusion + "。" + TIMELINE_STATS_SCOPE.membership + "。返回 totals（时间线总数/有任务线/空线/空线占比/有效任务/已归属/未归属/覆盖率）、top（全量聚合后按任务数降序取前 topLimit，同数按 id 升序，含状态构成与完成率）、distribution（0/1/2–5/6–10/11–50/51+）、overdue（逾期行与合计）与 invariants（已归属+未归属=有效任务；有任务线+空线=时间线总数）。传 from/to（YYYY-MM-DD，同时提供、反序自动交换）时另返回 trend（范围内新增时间线、新增任务、完成任务）。" + TIMELINE_STATS_SCOPE.activity + "。",
    input: {
      type: "object",
      properties: {
        topLimit: { type: "integer", minimum: 1, maximum: 100, description: "排行条数，默认 100；只影响 top.records，不影响 totals 与 distribution" },
        from: { type: "string", description: "趋势起始日 YYYY-MM-DD，与 to 同时提供" },
        to: { type: "string", description: "趋势结束日 YYYY-MM-DD，与 from 同时提供" },
      },
    },
    examples: [{}, { from: "2026-10-01", to: "2026-10-31", topLimit: 20 }],
    execute: (args) => timelineStats(api.db, args || {}),
    render: renderTimelineStats,
  });
}
