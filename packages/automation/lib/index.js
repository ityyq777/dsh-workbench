/**
 * 自动化业务插件：定时、域事件或手动触发白名单 action。
 *
 * 规则只允许调用 message.send / tasks.create / tags.create / sites.create /
 * connector.sourceRun，禁止 vault、automation、audit 与任何删除/备份类 action。
 * 规则参与备份导入导出，运行记录只在本机。
 */

import { bindClock, ensureSchema } from "./db/db.js";
import { createAutomation } from "./domain/rules.js";
import { registerActions } from "./domain/actions.js";

export const inject = ["workbench"];

let engine = null;

export function setup(api) {
  if (typeof api.now === "function") bindClock(api.now);
  ensureSchema(api.db);
  engine = createAutomation({ db: api.db, host: api, log: api.log });
  registerActions(api, engine);
  if (typeof api.on === "function") {
    api.on("domain-event", (event) => engine.onEvent(event));
  }
  engine.start();
  api.log("automation domain ready", api.addon.version);
}

export function apply(ctx) {
  const host = ctx.workbench;
  if (!host) throw new Error("dsh-workbench 未加载：缺少 workbench 服务");
  ctx.effect(() => () => {
    if (engine) engine.stop();
  }, "automation-timer");
  ctx.effect(
    () =>
      host.registerDomain({
        id: "wb-addon-automation",
        title: "自动化",
        description: "把定时、域事件或手动操作接到工作台 action：白名单、模板、条件、限频与运行记录",
        version: "0.2.1",
        tables: ["automation_rule", "automation_run", "automation_meta"],
        // 规则可随备份迁移；运行记录只在本机，因此不参与云同步。
        sync: { tables: [] },
        views: [
          { id: "stats", title: { zh: "概览", en: "Overview" } },
          { id: "rules", title: { zh: "规则", en: "Rules" } },
          { id: "runs", title: { zh: "运行记录", en: "Runs" } },
          { id: "config", title: { zh: "设置", en: "Settings" } },
          { id: "data", title: { zh: "数据", en: "Data" } },
          { id: "actions", title: { zh: "Action", en: "Actions" } },
        ],
        capability: {
          taskOwnership: { boundary: "真正的定时/事件触发用 automation；需要人跟进的事项仍用 tasks.create。", query: "automation" },
          summary: "工作台内的轻量自动化：按时间或域事件调用白名单 action，不执行任意代码。",
          records: [
            {
              kind: "rule",
              title: "自动化规则",
              description: "一条“触发条件 + 白名单 action + 参数模板”的规则。",
              when: [
                "每天固定时间汇总或提醒",
                "某个域事件发生后调用另一个域的 action",
                "需要保留每次运行的成败与错误",
              ],
              notFor: ["不要用它执行 vault、audit 或删除/备份类 action", "不要用它替代任务管理"],
              primaryAction: "automation.ruleCreate",
              keyArgs: ["name", "triggerConfig", "actionName", "actionArgs"],
            },
          ],
          fields: [
            { name: "name", type: "string", description: "规则名称，1–80 字" },
            { name: "triggerConfig", type: "object", description: "kind=interval(everyMinutes) / dailyAt(time,tz,weekdays) / event(domainId,event) / manual" },
            { name: "condition", type: "object", description: "{field,op,value}，op=eq/neq/contains/gt/lt；不满足记 skipped" },
            { name: "actionName", type: "string", description: "白名单 action，如 message.send、tasks.create" },
            { name: "actionArgs", type: "object", description: "参数模板，支持 {{event.field}} 与 {{item.field}}" },
          ],
          notFor: ["不允许调用 vault.*、automation.*、audit.* 或 delete/backup 类 action"],
          notes: [
            "规则参与备份导入导出；运行记录只在本机，不参与云同步。",
            "每规则每小时默认最多 60 次，全局并发 2；超限记 skipped。",
            "定时规则由插件内 30 秒定时器驱动，不依赖宿主调度器。",
          ],
        },
        exportData: () => engine.exportData(),
        importData: (payload) => engine.importData(payload),
        setup,
      }),
    "automation-domain",
  );
}

export const AUTOMATION_DOMAIN = "wb-addon-automation";
