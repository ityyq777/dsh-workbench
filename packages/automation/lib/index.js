/**
 * 自动化业务插件：定时、域事件或手动触发白名单 action。
 *
 * 允许调用的 action 由用户在设置页勾选（默认空），vault、automation、audit 与任何
 * 删除/备份类 action 是硬底线，永远不可启用。规则参与备份导入导出，运行记录只在本机。
 */

import { bindClock, ensureSchema } from "./db/db.js";
import { createAutomation } from "./domain/rules.js";
import { registerActions } from "./domain/actions.js";

export const inject = ["workbench"];

let engine = null;
let hostCtx = null;

export function setup(api) {
  if (typeof api.now === "function") bindClock(api.now);
  ensureSchema(api.db);
  // 可选复用宿主「自动化任务」服务：拿不到时 action 执行方式照常工作，只关闭 AI 执行方式。
  const getSchedule = () => (hostCtx ? hostCtx.get("schedule", false) : null);
  engine = createAutomation({ db: api.db, host: api, log: api.log, getSchedule });
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
  hostCtx = ctx;
  ctx.effect(() => () => {
    if (engine) engine.stop();
  }, "automation-timer");
  ctx.effect(
    () =>
      host.registerDomain({
        id: "wb-addon-automation",
        title: "自动化",
        description: "两种执行方式：按时间/域事件调用白名单 action（确定性、不耗 token），或交给宿主「自动化任务」在会话里由 AI 执行",
        version: "0.4.3",
        category: "auto",
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
          summary: "工作台内的自动化：execMode=action 时按时间或域事件调用用户勾选的 action（确定性、不耗 token）；execMode=agent 时把提示词交给宿主「自动化任务」，按时投进会话由 AI 执行（每次一次模型请求）。",
          records: [
            {
              kind: "rule",
              title: "自动化规则（action）",
              description: "一条“触发条件 + 已启用 action + 参数模板”的规则，由插件内定时器或域事件驱动。",
              when: [
                "每天固定时间汇总或提醒",
                "某个域事件发生后调用另一个域的 action",
                "需要保留每次运行的成败与错误",
              ],
              notFor: ["不要用它执行 vault、audit 或删除/备份类 action", "不要用它替代任务管理"],
              primaryAction: "automation.ruleCreate",
              keyArgs: ["name", "execMode", "triggerConfig", "actionName", "actionArgs"],
            },
            {
              kind: "agent-rule",
              title: "自动化规则（交给 AI）",
              description: "execMode=agent：把提示词登记到宿主「自动化任务」，按时投递到会话，由 agent 自己决定怎么执行。",
              when: ["需要理解、判断或多步操作，无法用固定 action 参数表达", "结果要回到某个会话里继续对话"],
              notFor: ["不要用它做高频轮询：每次投递都会产生一次模型请求", "不支持域事件触发，只有时间触发"],
              primaryAction: "automation.ruleCreate",
              keyArgs: ["name", "execMode", "agent"],
            },
          ],
          fields: [
            { name: "name", type: "string", description: "规则名称，1–80 字；AI 规则同时用作宿主任务标题" },
            { name: "execMode", type: "string", description: "action（默认，调工作台 action）或 agent（交给宿主「自动化任务」投递给 AI）" },
            { name: "triggerConfig", type: "object", description: "execMode=action：kind=interval(everyMinutes) / dailyAt(time,tz,weekdays) / event(domainId,event) / manual" },
            { name: "condition", type: "object", description: "execMode=action：{field,op,value}，op=eq/neq/contains/gt/lt；不满足记 skipped" },
            { name: "actionName", type: "string", description: "execMode=action 时必填：已启用的 action，如 message.send、tasks.create" },
            { name: "actionArgs", type: "object", description: "execMode=action：参数模板，支持 {{event.field}} 与 {{item.field}}" },
            {
              name: "agent",
              type: "object",
              description: "execMode=agent 时必填：{prompt, timing, target}；timing.kind=every(≥60s)/daily/weekly/cron/rrule/at/after，target.kind=new_once/new/session",
            },
          ],
          notFor: ["不允许调用 vault.*、automation.*、audit.* 或 delete/backup 类 action（硬底线，不可配置）"],
          notes: [
            "允许调用的 action 在设置页勾选，默认空；只对本机生效，不随备份迁移。",
            "规则参与备份导入导出；运行记录只在本机，不参与云同步。",
            "AI 规则的定时、暂停/恢复、投递历史由宿主「自动化任务」服务负责，规则页显示的是宿主实时状态。",
            "AI 规则的回执只代表 prompt 进了目标会话，不代表执行成功；每次投递都会触发一次模型请求。",
            "宿主任务 id 不能跨机器迁移：导入 AI 规则时会重新登记任务，投递历史不随之迁移。",
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
