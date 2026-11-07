/**
 * 任务记录业务插件（DSH 原生插件）。
 *
 * 所有业务逻辑都在本地 SQLite 完成；云端只负责备份。
 * 宿主由 dsh-workbench 提供，通过 ctx.workbench.registerDomain 注册。
 */

import { ensureSchema } from "./db.js";
import { exportTasksData, importTasksData } from "./backup.js";
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
        version: "2.1.1",
        tables: ["task", "task_node"],
        views: [{ id: "tasks", title: { zh: "任务记录", en: "Tasks" } }],
        setup,
        exportData: () => exportTasksData(requireApi()),
        importData: (raw, _ctx, options) => importTasksData(requireApi(), raw, options),
      }),
    "tasks-domain",
  );
}