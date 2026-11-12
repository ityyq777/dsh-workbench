/**
 * 斜杠命令目录：`/命令` 页与 `tasks.commands` 的唯一事实来源。
 *
 * 只放元信息（名称、用途、用法、输入提示、示例、字符上限与说明），
 * 命令正文一律由 `buildBrief` 现场生成——例如发布命令的 SOP 正文仍在 brief.js，
 * 目录里不复制一份，避免两处文字随版本漂移。
 *
 * 新增一个斜杠命令：在 TASK_COMMANDS 里加一条，再把 handler 的注册交给 command.js 的循环，
 * 页面、tasks.commands 与注册逻辑会自动跟上。
 */
import { buildPublisherBrief, MAX_REQUIREMENT_LENGTH } from "./brief.js";

/** 只读模板里替换需求与会话 id 的占位符；页面提示「换回你的原话/当前会话 id」即为此。 */
export const TEMPLATE_PLACEHOLDERS = {
  requirement: "{需求描述}",
  sessionId: "<sessionId>",
};

export const TASK_COMMANDS = [
  {
    name: "wb-task-publisher",
    title: { zh: "发布任务", en: "Publish task" },
    summary: {
      zh: "按调研、润色、归属、时间线、标签、查重的固定流程发布任务",
      en: "Publish a task through the fixed flow: research, polish, ownership, timeline, tags, dedupe",
    },
    usage: {
      zh: "/wb-task-publisher <需求描述>",
      en: "/wb-task-publisher <requirement>",
    },
    inputHint: {
      zh: "<需求描述，可附截图/文档>",
      en: "<requirement; screenshots or docs allowed>",
    },
    attachments: true,
    limit: { field: { zh: "需求描述", en: "requirement" }, max: MAX_REQUIREMENT_LENGTH },
    examples: [
      { text: "/wb-task-publisher 记录页筛选栏加一组常用筛选快捷按钮" },
      { text: "/wb-task-publisher 时间线页支持按成员任务状态过滤（可附截图）" },
      { text: "/wb-task-publisher 修复配置页重置按钮不生效（附复现步骤）" },
    ],
    sentText: {
      zh: "已把发布引导送入下一轮：先调研现状，再润色、判归属与时间线、选标签、查重，缺任务表/时间线/工作区会自行补齐，最后发布并在回执说明标签与自建内容。",
      en: "Publisher guidance sent to the next turn: research, polish, ownership, timeline, tags, dedupe — missing tables, timelines or workspaces are created without asking — then publish, listing tags and anything it created.",
    },
    notes: {
      zh: "命令会把你的原话与发布 SOP 送入下一轮模型：先调研现状，再润色、判归属与时间线、按维度选标签、查重，缺任务表 / 时间线 / 工作区时会自行补齐、不再追着你确认，并在回执里列出最终标签（标注沿用或新建）与「本次自建」内容。可以在需求后附截图或文档。",
      en: "The command sends your words plus the publishing SOP into the next model turn: research the current state, polish, decide ownership and timeline, pick tags by dimension, check for duplicates, missing tables, timelines or workspaces are created without asking and listed in the receipt along with the final tags. Screenshots or docs can be attached.",
    },
    buildBrief: (options) => buildPublisherBrief(options),
  },
];

/** 按名称取目录条目；找不到返回 undefined。 */
export function findCommand(name) {
  const key = String(name || "");
  return TASK_COMMANDS.find((entry) => entry.name === key);
}

/** 投影成可序列化的纯数据（去掉 buildBrief 等函数），供 tasks.commands 与页面使用。 */
export function commandCatalog() {
  return TASK_COMMANDS.map((entry) => ({
    name: entry.name,
    title: entry.title,
    summary: entry.summary,
    usage: entry.usage,
    inputHint: entry.inputHint,
    attachments: entry.attachments !== false,
    limit: entry.limit ? { field: entry.limit.field, max: entry.limit.max } : null,
    examples: (entry.examples || []).map((item) => item.text),
    notes: entry.notes,
    // 模板由 buildBrief 现场渲染，不另存一份正文：预览时需求与会话 id 用占位符、生成时间用 <生成时间>。
    template: renderTemplate(entry),
  }));
}

/** 用占位符渲染命令正文；没有 buildBrief 的条目没有模板。 */
function renderTemplate(entry) {
  if (typeof entry.buildBrief !== "function") return "";
  return entry.buildBrief({
    requirement: TEMPLATE_PLACEHOLDERS.requirement,
    sessionId: TEMPLATE_PLACEHOLDERS.sessionId,
    preview: true,
  });
}

/**
 * 命令的多行用法说明（空输入时回给用户）：第一行用法，随后示例，末段说明。
 * @param {object} entry TASK_COMMANDS 条目
 * @param {"zh"|"en"} lang 语言
 */
export function usageText(entry, lang) {
  const zh = lang !== "en";
  const pick = (value) => (zh ? value.zh : value.en);
  const lines = [(zh ? "用法：" : "Usage: ") + pick(entry.usage), "", zh ? "示例：" : "Examples:"];
  for (const item of entry.examples || []) lines.push("  " + item.text);
  lines.push("", pick(entry.notes));
  return lines.join("\n");
}
