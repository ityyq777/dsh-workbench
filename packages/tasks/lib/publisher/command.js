/**
 * 任务插件注册的斜杠命令：把「用户原话 + 各自 SOP」送进下一轮模型。
 * 命令本身不建任务、不写业务数据；无 commands 服务（ACP/无 UI）时静默跳过。
 *
 * 命令的元信息与正文生成函数都在 catalog.js：这里只做注册循环，
 * 新增命令时改目录即可，不用再写一遍 register 调用。
 */
import { TASK_COMMANDS, usageText } from "./catalog.js";

export const PUBLISHER_COMMAND = TASK_COMMANDS[0].name;

export const PUBLISHER_USAGE = usageText(TASK_COMMANDS[0], "zh");

function newMessageId() {
  const c = globalThis.crypto;
  if (c && typeof c.randomUUID === "function") return c.randomUUID();
  return "msg-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 10);
}

/** 取当前会话 id；拿不到时用 unknown，仅用于 dedupeKey 提示。 */
function sessionIdOf(agent) {
  return String((agent && agent.session && agent.session.id) || (agent && agent.id) || "");
}

/** 注册目录里的全部命令，返回清理函数。commands 服务缺失时返回空清理函数且不报错。 */
export function registerPublisherCommand(ctx) {
  let commands;
  try {
    commands = ctx && typeof ctx.get === "function" ? ctx.get("commands") : undefined;
  } catch {
    commands = undefined;
  }
  if (!commands || typeof commands.register !== "function") return () => {};

  const disposes = TASK_COMMANDS.map((entry) =>
    commands.register({
      name: entry.name,
      description: entry.title.zh + "：" + entry.summary.zh,
      input: { hint: entry.inputHint.zh, attachments: entry.attachments !== false },
      // 正文由 followup 带入模型历史，命令日志里不再重复记一遍。
      recordInput: false,
      handler: ({ agent, rawInput, attachments } = {}) => {
        const requirement = typeof rawInput === "string" ? rawInput.trim() : "";
        if (requirement.length === 0) {
          return { kind: "success", text: usageText(entry, "zh") };
        }
        const limit = entry.limit;
        if (limit && requirement.length > limit.max) {
          return {
            kind: "error",
            text:
              limit.field.zh + "约 " + requirement.length + " 字符，超过 " + limit.max +
              " 字符上限。请精简需求，或把长材料作为附件随命令发送。",
          };
        }
        if (!agent || typeof agent.followup !== "function") {
          return { kind: "error", text: "当前会话无法接收下一轮消息，" + entry.title.zh + "引导没有送出。" };
        }
        const brief = entry.buildBrief({
          requirement,
          sessionId: sessionIdOf(agent),
          now: new Date(),
        });
        const extra = Array.isArray(attachments) ? attachments : [];
        const content = extra.length > 0
          ? [...extra, { type: "text", text: brief }]
          : [{ type: "text", text: brief }];
        try {
          agent.followup({ id: newMessageId(), role: "user", content, source: { kind: "user" } });
        } catch (error) {
          const message = error && error.message ? error.message : String(error);
          return { kind: "error", text: entry.title.zh + "引导送入失败：" + message };
        }
        return { kind: "success", text: entry.sentText.zh };
      },
    }),
  );
  return () => {
    for (const dispose of disposes) if (typeof dispose === "function") dispose();
  };
}
