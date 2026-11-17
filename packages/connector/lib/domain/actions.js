/**
 * 连接器 action 契约：写入/绑定/运行只允许 ui；后台调度与 automation 走 plugin。
 */
const DRIVER_IDS = ["rss", "webhook"];

function gate(ctx, allowed, action) {
  const origin = (ctx && ctx.origin) || "agent";
  if (!allowed.includes(origin)) throw new Error(action + " 不允许 " + origin + " 调用");
}

const JSON_CONFIG = {
  type: "object",
  description: "driver 的配置（不含 token/密码；敏感值用 vault 绑定）",
  additionalProperties: true,
};

export function registerConnectorActions(api, connector) {
  api.action("connector.status", {
    description: "只读：连接器是否就绪、可用 driver、来源与条目计数。",
    input: { type: "object", properties: {}, additionalProperties: false },
    execute: (_args, ctx) => {
      gate(ctx, ["ui", "agent"], "connector.status");
      return { ready: true, drivers: connector.listSources().drivers, stats: connector.stats(), due: connector.dueCount() };
    },
  });

  api.action("connector.driverList", {
    description: "只读：可用 driver 及配置字段（RSS/Webhook）。",
    input: { type: "object", properties: {}, additionalProperties: false },
    execute: (_args, ctx) => {
      gate(ctx, ["ui", "agent"], "connector.driverList");
      return { drivers: connector.drivers() };
    },
  });

  api.action("connector.sourceList", {
    description: "只读：列出来源定义、最近运行状态与投递开关；不返回 cursor/secret。",
    input: {
      type: "object",
      properties: { q: { type: "string", description: "按名称/驱动过滤" } },
      additionalProperties: false,
    },
    execute: (args, ctx) => {
      gate(ctx, ["ui", "agent"], "connector.sourceList");
      return connector.listSources(args);
    },
  });

  api.action("connector.sourceGet", {
    description: "只读：单个来源定义与状态。",
    input: {
      type: "object",
      properties: { id: { type: "string" } },
      required: ["id"],
      additionalProperties: false,
    },
    execute: (args, ctx) => {
      gate(ctx, ["ui", "agent"], "connector.sourceGet");
      return connector.sourceGet(args);
    },
  });

  api.action("connector.sourceCreate", {
    description: "新增来源：rss 填 url，webhook 先建来源再绑定 vault token。",
    input: {
      type: "object",
      properties: {
        name: { type: "string", description: "1–80 字，唯一" },
        driver: { type: "string", enum: DRIVER_IDS },
        config: JSON_CONFIG,
        scheduleSec: { type: "number", description: "抓取间隔，最少 60；webhook 固定 0" },
        sink: { type: "string", enum: ["none", "message"], description: "新条目的投递目标" },
        sinkConfig: { type: "object" },
        enabled: { type: "boolean", description: "默认 true" },
        secretId: { type: "string", description: "vault 凭据 id（webhook token）" },
      },
      required: ["name", "driver"],
      additionalProperties: false,
    },
    examples: [{ name: "少数派 RSS", driver: "rss", config: { url: "https://sspai.com/feed", limit: 20 }, scheduleSec: 900, sink: "message" }],
    execute: (args, ctx) => {
      gate(ctx, ["ui"], "connector.sourceCreate");
      return connector.sourceCreate(args);
    },
  });

  api.action("connector.sourceUpdate", {
    description: "更新来源；config 整体替换，不传则保留。",
    input: {
      type: "object",
      properties: {
        id: { type: "string" },
        name: { type: "string" },
        driver: { type: "string", enum: DRIVER_IDS },
        config: JSON_CONFIG,
        scheduleSec: { type: "number" },
        sink: { type: "string", enum: ["none", "message"] },
        sinkConfig: { type: "object" },
        enabled: { type: "boolean" },
        secretId: { type: "string", description: "传空串清除绑定" },
      },
      required: ["id"],
      additionalProperties: false,
    },
    execute: (args, ctx) => {
      gate(ctx, ["ui"], "connector.sourceUpdate");
      return connector.sourceUpdate(args);
    },
  });

  api.action("connector.sourceDelete", {
    description: "软删除来源；本机条目与运行记录保留，不再调度。",
    input: {
      type: "object",
      properties: { id: { type: "string" } },
      required: ["id"],
      additionalProperties: false,
    },
    execute: (args, ctx) => {
      gate(ctx, ["ui"], "connector.sourceDelete");
      return connector.sourceDelete(args);
    },
  });

  api.action("connector.sourceBind", {
    description: "把来源绑定到 vault 凭据（webhook token / 后续 IMAP 密码）；只写本机 state。",
    input: {
      type: "object",
      properties: {
        id: { type: "string" },
        secretId: { type: "string", description: "传空串解绑" },
      },
      required: ["id"],
      additionalProperties: false,
    },
    execute: (args, ctx) => {
      gate(ctx, ["ui"], "connector.sourceBind");
      return connector.sourceBind(args);
    },
  });

  api.action("connector.sourceDelivery", {
    description: "开关新条目投递；默认开，关闭后只入库不打扰。",
    input: {
      type: "object",
      properties: { id: { type: "string" }, enabled: { type: "boolean" } },
      required: ["id", "enabled"],
      additionalProperties: false,
    },
    execute: (args, ctx) => {
      gate(ctx, ["ui"], "connector.sourceDelivery");
      return connector.sourceDelivery(args);
    },
  });

  api.action("connector.sourceRun", {
    description: "立即抓取一个来源；同时最多一个运行。force 可运行已停用来源。",
    input: {
      type: "object",
      properties: {
        id: { type: "string" },
        force: { type: "boolean", description: "停用来源也运行" },
      },
      required: ["id"],
      additionalProperties: false,
    },
    execute: (args, ctx) => {
      gate(ctx, ["ui", "plugin"], "connector.sourceRun");
      return connector.sourceRun({ id: args.id, force: args.force });
    },
  });

  api.action("connector.itemList", {
    description: "只读：按来源/关键词列出抓取条目（倒序，上限 200）。",
    input: {
      type: "object",
      properties: {
        sourceId: { type: "string" },
        q: { type: "string" },
        limit: { type: "number", description: "默认 50，上限 200" },
        offset: { type: "number" },
      },
      additionalProperties: false,
    },
    execute: (args, ctx) => {
      gate(ctx, ["ui", "agent"], "connector.itemList");
      return connector.listItems(args);
    },
  });

  api.action("connector.runList", {
    description: "只读：最近运行记录与错误。",
    input: {
      type: "object",
      properties: { sourceId: { type: "string" }, limit: { type: "number", description: "默认 20，上限 100" } },
      additionalProperties: false,
    },
    execute: (args, ctx) => {
      gate(ctx, ["ui", "agent"], "connector.runList");
      return connector.listRuns(args);
    },
  });

  api.action("connector.stats", {
    description: "只读：来源/条目/错误来源与最近一次运行。",
    input: { type: "object", properties: {}, additionalProperties: false },
    execute: (_args, ctx) => {
      gate(ctx, ["ui", "agent"], "connector.stats");
      return connector.stats();
    },
  });

  api.action("connector.dataTables", {
    description: "只读：数据页表清单；state/item/run 仅本机。",
    input: { type: "object", properties: {}, additionalProperties: false },
    execute: (_args, ctx) => {
      gate(ctx, ["ui"], "connector.dataTables");
      return {
        tables: [
          { name: "connector_source", columns: ["id", "name", "driver", "config", "enabled", "schedule_sec", "sink", "sink_config", "updated_at"] },
          { name: "connector_source_state", columns: ["source_id", "secret_id", "cursor", "next_run_at", "last_run_at", "last_status", "last_error", "fail_count", "delivery_enabled"] },
          { name: "connector_item", columns: ["id", "source_id", "external_id", "title", "url", "published_at", "fetched_at", "hash"] },
          { name: "connector_run", columns: ["id", "source_id", "trigger", "started_at", "finished_at", "status", "fetched", "inserted", "updated", "skipped", "error"] },
        ],
      };
    },
  });

  api.action("connector.dataQuery", {
    description: "只读：白名单表查询；cursor/secret_id 等本机列正常显示，不含明文凭据。",
    input: {
      type: "object",
      properties: {
        table: { type: "string", enum: ["connector_source", "connector_source_state", "connector_item", "connector_run"] },
        limit: { type: "number", description: "默认 50，上限 200" },
        offset: { type: "number" },
      },
      required: ["table"],
      additionalProperties: false,
    },
    execute: (args, ctx) => {
      gate(ctx, ["ui"], "connector.dataQuery");
      const table = String(args.table);
      const limit = Math.max(1, Math.min(200, Number(args.limit) || 50));
      const offset = Math.max(0, Number(args.offset) || 0);
      const order = table === "connector_item" ? "published_at DESC, fetched_at DESC" : table === "connector_run" ? "started_at DESC" : "updated_at DESC";
      const rows = api.db.prepare("SELECT * FROM " + table + " ORDER BY " + order + " LIMIT ? OFFSET ?").all(limit, offset);
      return { table, rows, limit, offset };
    },
  });
}
