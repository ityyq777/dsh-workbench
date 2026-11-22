/** automation action 注册：写操作仅 UI，读操作允许 agent。 */
import { DENIED_PATTERNS, isDenied } from "./whitelist.js";

const TABLE_WHITELIST = {
  automation_rule: ["id", "name", "enabled", "exec_mode", "trigger_type", "schedule_id", "last_status", "run_count", "error_count", "next_run_at", "updated_at"],
  automation_run: ["id", "rule_id", "trigger", "status", "started_at", "finished_at", "error"],
};

function deny(origin, allow) {
  if (!allow.includes(origin)) {
    const error = new Error("该操作只允许 " + allow.join("/") + " 调用");
    error.status = 403;
    throw error;
  }
}

export function registerActions(api, engine) {
  const defs = [];
  const action = (name, def) => {
    defs.push({ name, domain: "wb-addon-automation", description: def.description || "", input: def.input || { type: "object", properties: {} }, examples: def.examples || [] });
    api.action(name, def);
  };

  action("automation.status", {
    description: "自动化域状态：规则数量、启用数、今日运行与配置",
    input: { type: "object", properties: {} },
    execute: () => engine.stats(),
  });

  action("automation.ruleList", {
    description: "列出自动化规则及最近一次运行；「交给 AI」规则会附带宿主任务的实时状态",
    input: { type: "object", properties: {} },
    execute: async () => ({ items: await engine.listRulesLive() }),
  });

  action("automation.ruleGet", {
    description: "读取一条规则详情",
    input: { type: "object", properties: { id: { type: "string" } }, required: ["id"] },
    execute: (args) => engine.getRule(args.id),
  });

  action("automation.ruleCreate", {
    origins: ["ui", "agent", "plugin"],
    originsDefault: ["ui", "agent", "plugin"],
    description: "创建规则；写操作仅 UI。execMode=action 时直接调用白名单 action，execMode=agent 时由宿主「自动化任务」按时把提示词投给会话",
    input: {
      type: "object",
      properties: {
        name: { type: "string", description: "规则名称，1–80 字；AI 规则同时作为宿主任务标题（≤120 字）" },
        enabled: { type: "boolean" },
        execMode: { type: "string", enum: ["action", "agent"], description: "执行方式：action=调用工作台 action（默认），agent=交给 AI 在会话里执行" },
        triggerType: { type: "string", enum: ["schedule", "event", "manual"] },
        triggerConfig: { type: "object", description: "execMode=action 时使用：kind=interval/dailyAt/event/manual" },
        condition: { type: "object" },
        actionName: { type: "string", description: "execMode=action 时必填：已在设置中启用的 action" },
        actionArgs: { type: "object" },
        agent: {
          type: "object",
          description: "execMode=agent 时必填：{prompt, timing, target}。timing.kind=every/daily/weekly/cron/rrule/at/after；target.kind=new_once/new/session",
          properties: {
            prompt: { type: "string", description: "每次投递给 agent 的指令" },
            timing: { type: "object", description: "宿主 ScheduleTiming 结构" },
            target: { type: "object", description: "宿主 ScheduleTargetRequest 结构" },
          },
        },
      },
      required: ["name"],
    },
    execute: async (args, ctx) => {
      deny(ctx.origin, ["ui", "agent"]);
      return engine.createRule({
        name: args.name,
        enabled: args.enabled,
        execMode: args.execMode,
        triggerType: args.triggerType,
        triggerConfig: args.triggerConfig,
        condition: args.condition,
        actionName: args.actionName,
        actionArgs: args.actionArgs,
        agent: args.agent,
      });
    },
  });

  action("automation.ruleUpdate", {
    origins: ["ui", "agent"],
    originsDefault: ["ui"],
    description: "局部更新规则；写操作仅 UI。AI 规则的改动会同步到宿主任务；执行方式创建后不可修改",
    input: {
      type: "object",
      properties: {
        id: { type: "string" },
        name: { type: "string" },
        enabled: { type: "boolean" },
        execMode: { type: "string", enum: ["action", "agent"], description: "只能传入与现有值相同的执行方式，用于防止误改；不同会被拒绝" },
        triggerType: { type: "string", enum: ["schedule", "event", "manual"] },
        triggerConfig: { type: "object" },
        condition: { type: "object" },
        actionName: { type: "string" },
        actionArgs: { type: "object" },
        agent: {
          type: "object",
          description: "execMode=agent 时整体替换：{prompt, timing, target}",
          properties: {
            prompt: { type: "string" },
            timing: { type: "object" },
            target: { type: "object" },
          },
        },
      },
      required: ["id"],
    },
    execute: async (args, ctx) => {
      deny(ctx.origin, ["ui", "agent"]);
      return engine.updateRule({
        id: args.id,
        name: args.name,
        enabled: args.enabled,
        execMode: args.execMode,
        triggerType: args.triggerType,
        triggerConfig: args.triggerConfig,
        condition: args.condition,
        actionName: args.actionName,
        actionArgs: args.actionArgs,
        agent: args.agent,
      });
    },
  });

  action("automation.ruleDelete", {
    origins: ["ui", "agent"],
    originsDefault: ["ui"],
    description: "软删规则；仅 UI",
    input: { type: "object", properties: { id: { type: "string" } }, required: ["id"] },
    execute: (args, ctx) => {
      deny(ctx.origin, ["ui", "agent"]);
      return engine.deleteRule(args.id);
    },
  });

  action("automation.ruleRun", {
    origins: ["ui", "agent"],
    originsDefault: ["ui"],
    description: "立即执行一次规则；action 规则仍受白名单、条件和频率限制，AI 规则会请求宿主立即投递一次",
    input: { type: "object", properties: { id: { type: "string" } }, required: ["id"] },
    execute: (args, ctx) => {
      deny(ctx.origin, ["ui", "agent"]);
      return engine.runRule(args.id, "manual", {});
    },
  });

  action("automation.ruleHistory", {
    description: "AI 规则的宿主投递记录（最近在前）；回执只表示 prompt 进了会话收件箱，不代表执行成功",
    input: {
      type: "object",
      properties: {
        id: { type: "string", description: "规则 id" },
        limit: { type: "number", description: "1–100，默认 20" },
        before: { type: "string", description: "上一页最旧一条的消息 id，用于翻页" },
      },
      required: ["id"],
    },
    execute: async (args) => {
      const rule = engine.getRule(args.id);
      if (!rule) throw new Error("规则不存在");
      if (rule.execMode !== "agent" || !rule.scheduleId) return { id: args.id, records: [], earlierRecordsUnavailable: false, earlierRecordsPruned: false };
      return engine.agentHistory(rule.scheduleId, args.limit, args.before);
    },
  });

  action("automation.agentStatus", {
    description: "宿主「自动化任务」能力：能否使用 AI 执行方式、最小间隔、标题上限、以及未纳入工作台的宿主任务",
    input: { type: "object", properties: {} },
    execute: () => engine.agentStatus(),
  });

  action("automation.runList", {
    description: "运行记录列表",
    input: { type: "object", properties: { ruleId: { type: "string" }, limit: { type: "number" } } },
    execute: (args) => ({ items: engine.runList({ ruleId: args.ruleId, limit: args.limit }) }),
  });

  action("automation.runGet", {
    description: "单条运行记录",
    input: { type: "object", properties: { id: { type: "string" } }, required: ["id"] },
    execute: (args) => engine.runGet(args.id),
  });

  action("automation.stats", {
    description: "首页卡片统计",
    input: { type: "object", properties: {} },
    execute: () => engine.stats(),
  });

  action("automation.configGet", {
    description: "读取自动化配置",
    input: { type: "object", properties: {} },
    execute: () => engine.config(),
  });

  action("automation.configSet", {
    origins: ["ui", "agent"],
    originsDefault: ["ui"],
    description: "修改最大规则数、每小时上限与允许调用的 action；仅 UI",
    input: {
      type: "object",
      properties: {
        maxRules: { type: "number" },
        perHour: { type: "number" },
        allowedActions: { type: "array", items: { type: "string" } },
      },
    },
    execute: (args, ctx) => {
      deny(ctx.origin, ["ui", "agent"]);
      const patch = {};
      if (args && args.maxRules !== undefined) patch.maxRules = args.maxRules;
      if (args && args.perHour !== undefined) patch.perHour = args.perHour;
      if (args && args.allowedActions !== undefined) patch.allowedActions = args.allowedActions;
      return engine.saveConfig(patch);
    },
  });

  action("automation.actionOptions", {
    description: "本机已启用的 action 清单、硬底线、action 触发类型与执行方式",
    input: { type: "object", properties: {} },
    execute: () => ({ actions: engine.config().allowedActions, denied: DENIED_PATTERNS, triggers: ["interval", "dailyAt", "event", "manual"], execModes: ["action", "agent"] }),
  });

  action("automation.actionCatalog", {
    description: "列出宿主全部可被自动化调用的 action（过滤硬底线与 automation 自身）",
    input: { type: "object", properties: {} },
    execute: async () => {
      try {
        const res = await api.call("actions.list", {}, "plugin");
        const rows = Array.isArray(res && res.actions) ? res.actions : [];
        const items = rows
          .map((row) => ({
            name: String((row && row.name) || ""),
            domain: String((row && row.domain) || ""),
            description: String((row && row.description) || ""),
            origins: row && Array.isArray(row.origins) ? row.origins : [],
          }))
          .filter((row) => row.name && !isDenied(row.name))
          .sort((a, b) => a.name.localeCompare(b.name));
        return { items, error: "" };
      } catch (error) {
        // actions.list 不可用时退化为空候选，设置页仍可手动添加。
        return { items: [], error: String((error && error.message) || error) };
      }
    },
  });

  action("automation.actionSchema", {
    description: "自证 action 清单与输入 schema（供 Action 页读取）",
    input: { type: "object", properties: {} },
    execute: () => ({ shellVersion: api.shellVersion || "", domains: [{ id: "wb-addon-automation", version: (api.addon && api.addon.version) || "0.2.0" }], actions: defs }),
  });

  action("automation.dataTables", {
    description: "数据表白名单与列",
    input: { type: "object", properties: {} },
    execute: () => ({ tables: Object.keys(TABLE_WHITELIST), columns: TABLE_WHITELIST }),
  });

  action("automation.dataQuery", {
    origins: ["ui", "agent"],
    originsDefault: ["ui"],
    description: "只读查询白名单表；仅 UI",
    input: {
      type: "object",
      properties: { table: { type: "string" }, limit: { type: "number" }, offset: { type: "number" } },
      required: ["table"],
    },
    execute: (args, ctx) => {
      deny(ctx.origin, ["ui", "agent"]);
      const table = String(args.table || "");
      if (!TABLE_WHITELIST[table]) throw new Error("表不在白名单：" + table);
      const limit = Math.max(1, Math.min(200, Number(args.limit) || 50));
      const offset = Math.max(0, Number(args.offset) || 0);
      const cols = TABLE_WHITELIST[table].join(",");
      return { table, rows: api.db.prepare("SELECT " + cols + " FROM " + table + " ORDER BY rowid DESC LIMIT ? OFFSET ?").all(limit, offset) };
    },
  });
}
