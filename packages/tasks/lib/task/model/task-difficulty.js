/** 难度语义唯一真源：action schema、能力引导和字段说明共用。 */
export const DIFFICULTY_GUIDANCE = "0/null = 未设置（不是最简单）；1–5 数值越大越难：1 = 改文案/样式等单点小改，2 = 单模块内的局部功能，3 = 跨 2–3 个模块或带数据读取变更，4 = 涉及存储/迁移/同步/构建链路，5 = 跨进程架构重构或需多阶段验证。依据改动文件数、是否涉及数据迁移与测试面判定；兼容 0.5 档。create/update 建议填写 1–5，未完成任务也可保存；已完成任务应填写，但不做硬必填。";
export const DIFFICULTY_SCHEMA = { type: ["number", "null"], minimum: 0, maximum: 5, description: DIFFICULTY_GUIDANCE };

export function difficultyMissingNotices(args, difficulty) {
  const hasContext = String(args.description ?? "").trim() || [args.tags, args.tagIds].some(values => Array.isArray(values) && values.length);
  return hasContext && !(Number(difficulty) > 0)
    ? [{ code: "difficulty_missing", field: "difficulty", message: "建议填写 1–5 难度；0 会被统计为未设置" }]
    : [];
}

export function cleanDifficultyReceipt(task) {
  if (task.difficulty === null || task.difficulty === undefined) delete task.difficulty;
  return task;
}
