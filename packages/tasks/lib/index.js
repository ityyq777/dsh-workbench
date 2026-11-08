/**
 * 任务记录业务插件（DSH 原生插件）。
 *
 * 所有业务逻辑都在本地 SQLite 完成；云端只负责备份。
 * 宿主由 dsh-workbench 提供，通过 ctx.workbench.registerDomain 注册。
 */

import { bindClock, ensureSchema } from "./db.js";
import { exportTasksData, importTasksData } from "./backup.js";
import { taskSync } from "./sync.js";
import { registerTaskActions } from "./tasks.js";
import { registerTreeActions } from "./tree.js";

export const inject = ["workbench"];

let domainApi = null;
function requireApi() {
  if (!domainApi) throw new Error("任务模块尚未初始化");
  return domainApi;
}

/** 旧 addon 形态的初始化函数，单测/兼容直接调用。 */
export function setup(api) {
  domainApi = api;
  if (typeof api.now === "function") bindClock(api.now);
  ensureSchema(api.db, api.log);
  registerTaskActions(api);
  registerTreeActions(api);
  api.log("tasks domain ready", api.addon.version);
}

export function apply(ctx) {
  const host = ctx.workbench;
  if (!host) throw new Error("dsh-workbench 未加载：缺少 workbench 服务");
  ctx.effect(
    () =>
      host.registerDomain({
        id: "wb-addon-tasks",
        title: "任务记录",
        description: "任务树 + 9 个视图：紧急/工作/生活/学习/开发/已开启/已关闭/已完成/总览",
        version: "2.4.1",
        tables: ["task", "task_dep", "task_node"],
        sync: taskSync,
        views: [{ id: "tasks", title: { zh: "任务记录", en: "Tasks" } }],
        capability: {
          summary: "记录可执行、可交付的工作项（任务），支持任务树、时间线、重启链与依赖。",
          records: [
            {
              kind: "task",
              title: "任务",
              description: "一个有明确结果的工作项；可以归入任务表、时间线或重启链，并挂标签。",
              when: [
                "一个工作项已经完成，或已经有明确下一步，值得进入工作台继续跟进",
                "用户明确说“记一下 / 建个任务 / 加到工作台 / 以后要做”",
                "会话中发现需要后续处理、但当前不立即完成的动作",
              ],
              notFor: [
                "纯信息查询或一次性问答，没有可执行结果",
                "没有明确标题或完成标准的模糊想法；先描述清楚再记",
              ],
              primaryAction: "tasks.create",
              keyArgs: ["title", "description", "type", "priority", "targetDate", "tagIds", "dedupeKey"],
              dedupe: "同 dedupeKey 的未删除任务会被复用；自动记录建议使用稳定键，如 dsh-session:<id>。",
              relations: [
                { kind: "taskNode", via: "tableId", description: "需要归组时先查任务表；缺省使用默认任务表。" },
                { kind: "tag", via: "tagIds / tags.link", description: "用标签做主题归类；标签需先创建或查询。" },
              ],
              examples: [
                {
                  purpose: "记录一次已完成的工作项",
                  args: {
                    title: "整理工作台能力清单",
                    description: "梳理各插件 action 与记录边界",
                    type: 3,
                    priority: 6,
                    targetDate: "2026-11-08",
                  },
                },
              ],
            },
          ],
          notFor: ["不要用它保存聊天记录、日志或临时笔记"],
          notes: [
            "date 字段均为 YYYY-MM-DD；source=1/2 时分别需要 timelineKey / restartKey。",
            "status 0 进行中 / 1 已关闭 / 2 已完成；不要直接创建 RESTARTED（3）。",
          ],
        },
        setup,
        exportData: () => exportTasksData(requireApi()),
        importData: (raw, _ctx, options) => importTasksData(requireApi(), raw, options),
      }),
    "tasks-domain",
  );
}