export function clampPriority(value, fallback) {
  if (value === undefined || value === null || value === "") return fallback;
  const n = Number(value);
  if (!Number.isFinite(n)) throw new Error("priority 必须是数字");
  const v = Math.round(n);
  if (v < 0 || v > 10) throw new Error("priority 必须在 0..10");
  return v;
}

/**
 * 优先级状态机（唯一入口）：
 * - 已开启（status=0）：P1..P10，显式传 0 是错误（0 只表示「没有优先级」）；
 * - 已关闭/已完成/已重启：一律 P0，写入什么都被忽略；
 * - 已接取（4）：仍持有 P1..P10，与已开启同规；
 * - 开启但历史值为 0（旧数据）且本次没有显式传值：回落到 P1。
 */
export function priorityForStatus(status, requested, fallback) {
  // 已接取（4）仍持有优先级，按「开启类」处理。
  if (status !== "0" && status !== "4") return 0;
  if (requested !== undefined && requested !== null && requested !== "" && Number(requested) === 0) {
    throw new Error("已开启任务的优先级必须在 1..10（0 仅用于已完成/已关闭）");
  }
  const p = clampPriority(requested, fallback);
  return p > 0 ? p : 1;
}

/** 重启创建的默认值固定 P1；调用方可显式传入原任务有效优先级。 */
export function priorityForCreate(status, requested, source) {
  if (source === "2" && requested !== undefined && requested !== null && requested !== "" && Number(requested) === 0) {
    throw new Error("重启任务的优先级必须是 1–10；已完成/已关闭任务才用 0");
  }
  return priorityForStatus(status, requested, 1);
}
