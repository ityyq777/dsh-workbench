/**
 * 消息业务插件（DSH 原生插件）。
 *
 * 定位：工作台内统一的「消息发送入口」——agent、子插件、界面都调用 message.send；
 * 消息只落本机 SQLite（显式 sync:{tables:[]}，也不提供备份导入导出），
 * 有新消息时由客户端 notifier 播放提示音。
 *
 * 与其他插件保持弱耦合：本插件不 import 任何业务插件；其他插件调用本域只能走
 * 宿主的 host.invoke("message.send", args)，或用客户端 api.call 的前缀路由。
 */

import { bindClock, ensureSchema, now, rowMessage } from "./db/db.js";
import { configValues, registerConfigActions } from "./infra/config.js";
import { registerDataActions } from "./infra/data.js";
import { pruneMessages, registerMessageActions } from "./domain/messages.js";

export const inject = ["workbench"];

let domainApi = null;
function requireApi() {
  if (!domainApi) throw new Error("消息模块尚未初始化");
  return domainApi;
}

/** 只读「Action」页的数据源由插件自己维护，不经过宿主 schema 接口。 */
function trackActions(api) {
  const defs = new Map();
  const rawAction = typeof api.action === "function" ? api.action.bind(api) : null;
  if (rawAction) {
    api.action = function (name, def) {
      defs.set(name, def || {});
      return rawAction(name, def);
    };
  }
  return defs;
}

function registerActionSchemaAction(api, defs, domain) {
  const prefix = domain.replace(/^wb-addon-/, "");
  api.action(prefix + ".actionSchema", {
    description: "只读：返回本插件运行时注册的 action schema（供「Action」页渲染；不执行任何 action、不写库、不产生审计）",
    input: { type: "object", properties: {}, additionalProperties: false },
    execute: () => ({
      shellVersion: api.shellVersion || "",
      domains: [{ id: domain, version: api.addon && api.addon.version ? api.addon.version : "" }],
      actions: Array.from(defs, ([name, def]) => ({
        name: name,
        domain: domain,
        description: typeof def.description === "string" ? def.description : "",
        input: def.input && typeof def.input === "object" ? def.input : { type: "object", properties: {} },
        examples: Array.isArray(def.examples) ? def.examples : [],
      })),
    }),
  });
}

export function setup(api) {
  domainApi = api;
  if (typeof api.now === "function") bindClock(api.now);
  ensureSchema(api.db, api.log);
  const actionDefs = trackActions(api);
  registerMessageActions(api);
  registerConfigActions(api);
  registerDataActions(api);
  registerActionSchemaAction(api, actionDefs, "wb-addon-message");
  // 启动时先按保留策略清一次，避免长期不开工作台后积压。
  try {
    const pruned = pruneMessages(api.db, configValues(api.db), now());
    if (pruned) api.log("message addon: 启动清理 " + pruned + " 条");
  } catch (error) {
    api.log("message addon: 启动清理失败：" + String((error && error.message) || error));
  }
  api.log("message domain ready", api.addon.version);
}

export function apply(ctx) {
  const host = ctx.workbench;
  if (!host) throw new Error("dsh-workbench 未加载：缺少 workbench 服务");
  ctx.effect(
    () =>
      host.registerDomain({
        id: "wb-addon-message",
        title: "消息",
        description: "统一消息入口：子插件与 agent 都能发消息，含未读计数、提示音与保留期清理；含统计、收件箱、配置、数据与 Action 五个视图",
        version: "0.1.0",
        tables: ["message"],
        // 只在本机保存：显式声明不同步任何表（不写 sync 时宿主默认按行同步）。
        sync: { tables: [] },
        views: [
          { id: "stats", title: { zh: "统计", en: "Stats" } },
          { id: "inbox", title: { zh: "收件箱", en: "Inbox" } },
          { id: "config", title: { zh: "配置", en: "Config" } },
          { id: "data", title: { zh: "数据", en: "Data" } },
          { id: "actions", title: { zh: "Action", en: "Actions" } },
        ],
        capability: {
          taskOwnership: { boundary: "发消息用 message.send；开发、修复消息插件的工作项用 tasks.create。", query: "message" },
          summary: "工作台内统一的消息入口；只负责消息本身，不负责任务、站点或储存记录。",
          records: [
            {
              kind: "message",
              title: "消息",
              description: "一条发给用户或 agent 的通知，含级别、来源与可选的去重键。",
              when: [
                "某个动作完成、失败或需要用户注意，且不应打断当前操作",
                "子插件愿意在失败时留下可回看的痕迹",
                "同一条通知可能重复触发，需要 dedupeKey 抑制重复",
              ],
              notFor: [
                "不要用消息代替任务或日志；需要后续跟进时仍建任务",
                "不要高频发送无害提示，避免淹没真正需要注意的消息",
              ],
              primaryAction: "message.send",
              keyArgs: ["title", "body", "level", "source"],
              dedupe: "dedupeKey 相同且未删除时幂等返回已有消息（deduped=true），不会新建第二条。",
              relations: [
                { kind: "agent", via: "message.send(audience=agent)", description: "给 agent 留一条待处理通知。" },
                { kind: "plugin", via: "host.invoke(\"message.send\", args, \"ui\")", description: "子插件通过宿主调用，不 import 本插件。" },
              ],
              examples: [{ purpose: "成功通知", args: { title: "备份完成", level: "success", source: "host" } }],
            },
          ],
          fields: [
            { name: "title", type: "string", description: "标题，必填，最多 120 字" },
            { name: "body", type: "string", description: "正文，最多 4000 字" },
            { name: "level", type: "string", description: "info / success / warning / error，默认 info" },
            { name: "source", type: "string", description: "来源标识，最多 40 字，建议用插件名" },
            { name: "audience", type: "string", description: "user / agent / all，默认 all" },
            { name: "dedupeKey", type: "string", description: "去重键，最多 120 字" },
            { name: "meta", type: "object", description: "附加 JSON，最多 2000 字节" },
            { name: "unreadOnly / levels / text / since / before", type: "boolean|string[]|string|number", description: "message.list 的过滤条件" },
            { name: "ids / all / before", type: "string[]|boolean|number", description: "message.markRead 的三种标记方式" },
          ],
          notFor: ["不要用它承载需要长期跟进的事项（那是任务）", "不要在插件加载期反复发送启动成功之类的噪音"],
          notes: [
            "消息只在本机保存：不参与同步，也不进入备份包，换机后不会带过去。",
            "已读消息默认保留 30 天（可配置），未读不按时间清理；总量上限 5000 条，超出从最旧的已读开始删。",
            "提示音由客户端播放，可在配置页关闭、调音量并设置免打扰时间段。",
          ],
        },
        setup,
      }),
    "message-domain",
  );
}

// 便于测试与外部引用：域 id、版本、导出面保持一致。
export const MESSAGE_DOMAIN = "wb-addon-message";
export { rowMessage, requireApi };
