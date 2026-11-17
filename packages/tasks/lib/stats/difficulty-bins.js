// 难度分布的维度归一与分桶：统计页把「当前存量」与「按事件区间」两种口径统一成一张柱图，
// 分桶规则（0.5 步进、0 与空归「未设置」）与事件口径的区间接入都放这里，stats.js 只负责取数编排。
import { eventRange } from "./events.js";

export const DIFFICULTY_DIMENSIONS = ["all", "done", "publish", "claimed", "shutdown"];

export function normalizeDimension(value) {
  const dimension = value === undefined || value === null || value === "" ? "all" : String(value);
  if (DIFFICULTY_DIMENSIONS.indexOf(dimension) < 0) {
    throw new Error("dimension 只支持 all / done / publish / claimed / shutdown");
  }
  return dimension;
}

export function buildDifficultyBins(rows) {
  // 难度是 0.5 步进的单值（0.5–5），一值一桶；0/空值单独归到「未设置」。
  const bins = [];
  for (let i = 1; i <= 10; i += 1) {
    const v = i / 2;
    bins.push({ key: String(v), label: String(v), count: 0 });
  }
  let unset = 0;
  for (const row of rows) {
    const n = Number(row.n || 0);
    const d = Number(row.difficulty);
    if (row.difficulty === null || row.difficulty === undefined || !(d > 0)) {
      unset += n;
      continue;
    }
    const idx = Math.min(10, Math.max(1, Math.round(d * 2)));
    bins[idx - 1].count += n;
  }
  // 未填写必须可见，便于从统计巡检并补齐难度。
  bins.push({ key: "unset", label: "未设置", count: unset });
  return bins;
}

/** dimension=all 走当前存量；其余四维与年度活动日历同口径、只统计区间内的任务。 */
export function difficultyBinsFor(db, dimension, range) {
  if (dimension === "all") {
    return buildDifficultyBins(db.prepare(
      "SELECT difficulty, COUNT(*) AS n FROM task WHERE deleted_at IS NULL GROUP BY difficulty",
    ).all());
  }
  const slice = eventRange(dimension, range.from, range.to);
  return buildDifficultyBins(db.prepare(
    "SELECT difficulty, COUNT(*) AS n FROM task t WHERE " + slice.sql + " GROUP BY difficulty",
  ).all(slice.params[0], slice.params[1]));
}
