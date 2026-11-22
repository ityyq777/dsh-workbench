/**
 * wb-addon-connector：把外部内容接入工作台。
 * 只有来源定义参与云同步；cursor、secret_id、条目与运行记录都留在本机。
 */
import { ensureSchema, bindClock } from "./db/db.js";
import { createConnector } from "./domain/connector.js";
import { registerConnectorActions } from "./domain/actions.js";

export const name = "dsh-workbench-connector";
export const inject = ["workbench"];

export function apply(ctx) {
  const host = ctx.workbench;
  if (!host) throw new Error("wb-addon-connector 依赖 workbench 宿主");
  ctx.effect(() => host.registerDomain(createDomain(host)), "connector-domain");
}

export function createDomain(host) {
  let connector = null;
  let schemas = [];

  return {
    id: "wb-addon-connector",
    title: "连接器",
    description: "把 RSS、Webhook 等外部内容接进工作台；来源定义可同步，凭据与本机状态不出机器。",
    version: "0.1.7",
    category: "auto",
    tables: ["connector_source", "connector_source_state", "connector_item", "connector_run"],
    sync: {
      tables: [{ name: "connector_source", mode: "row", uniqueKeys: [["id"]], uniquePolicy: "lww-tombstone" }],
    },
    views: [
      { id: "stats", title: "概览", icon: "activity" },
      { id: "sources", title: "来源", icon: "rss" },
      { id: "items", title: "内容", icon: "inbox" },
      { id: "runs", title: "运行记录", icon: "history" },
      { id: "config", title: "设置", icon: "sliders" },
      { id: "data", title: "数据", icon: "database" },
      { id: "actions", title: "Action 清单", icon: "list" },
    ],
    capability: {
      summary: "把 RSS/Atom 与 Webhook 内容接入工作台，按去重后投递到消息域。",
      records: [
        {
          kind: "connector_source",
          table: "connector_source",
          title: "连接器来源",
          description: "一条外部来源定义（RSS 地址或 Webhook），含调度与投递方式；不含明文凭据。",
          when: ["订阅一个 RSS/Atom 源", "让外部系统通过 Webhook 推送消息", "把外部内容转成工作台消息"],
          primaryAction: "connector.sourceCreate",
        },
        {
          kind: "connector_item",
          table: "connector_item",
          title: "连接器内容",
          description: "从来源抓到或推送进来的一条内容，按 external_id 去重。",
          when: ["查看已抓取内容", "排查某条内容为何没投递"],
          primaryAction: "connector.itemList",
        },
      ],
      fields: [
        { name: "name", type: "string", description: "来源名称，全局唯一" },
        { name: "driver", type: "rss|webhook", description: "来源类型" },
        { name: "config", type: "object", description: "非敏感配置（URL、条数上限等）" },
        { name: "sink", type: "none|message", description: "新内容投递目标" },
      ],
      notFor: ["邮件收发", "日历同步", "把外部条目直接写进任务表"],
      notes: ["只有来源定义参与云同步；新设备首次拉取后需要重新绑定凭据。"],
    },
    setup(api) {
      ensureSchema(api.db);
      bindClock(() => api.now());
      connector = createConnector({ db: api.db, host, log: api.log, emit: api.emit });
      const register = api.action.bind(api);
      api.action = (actionName, def) => {
        schemas.push({ name: actionName, domain: "wb-addon-connector", description: def.description, input: def.input, examples: def.examples });
        register(actionName, def);
      };
      registerConnectorActions(api, connector);
      api.action = register;
      api.action("connector.actionSchema", {
        description: "只读：本域 action 清单与输入 schema（插件自证）。",
        input: { type: "object", properties: {}, additionalProperties: false },
        execute: () => ({ shellVersion: api.shellVersion || "", domains: [{ id: "wb-addon-connector", version: (api.addon && api.addon.version) || "0.1.2" }], actions: schemas }),
      });
      if (typeof api.registerSearchProvider === "function") {
        api.registerSearchProvider({
          domainId: "wb-addon-connector",
          search(q, { limit }) {
            const like = "%" + String(q).replace(/[\\%_]/g, "\\$&") + "%";
            const rows = api.db
              .prepare("SELECT id,title,summary,url,published_at FROM connector_item WHERE title LIKE ? ESCAPE '\\' OR summary LIKE ? ESCAPE '\\' ORDER BY COALESCE(published_at,0) DESC LIMIT ?")
              .all(like, like, Math.max(1, Math.min(50, Number(limit) || 20)));
            return rows.map((r) => ({ id: r.id, title: r.title, snippet: String(r.summary || "").slice(0, 160), url: r.url || undefined, view: "items", at: r.published_at || undefined }));
          },
        });
      }
      if (typeof api.registerHook === "function") {
        api.registerHook("inbound", async (req) => {
          try {
            const out = await connector.handleInbound(req);
            return { status: 200, body: { ok: true, ...out } };
          } catch (error) {
            const status = Number((error && error.status) || 400);
            const headers = status === 429 ? { "retry-after": "60" } : {};
            return { status, headers, body: { ok: false, error: String((error && error.message) || error) } };
          }
        });
      }
      connector.startSchedule();
      return () => connector.stopSchedule();
    },
    exportData() {
      return connector.exportData();
    },
    importData(data) {
      return connector.importData(data);
    },
  };
}
