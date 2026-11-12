/**
 * 任务插件的配置项：白名单 schema + 本地读写。
 *
 * 配置只存覆盖项，默认值留在代码里；存放位置是已有的 meta 表
 * （键 `config.tasks.<id>`），因此不建新表、不参与云端同步，也不进入备份。
 * 读取永远宽松：表缺失/JSON 坏/取值越界都回退默认值并给出 warnings；
 * 只有 configSet 会抛错（带 id 与原因）。
 */

import { tableExists, tx } from "../db/db.js";

export const DOMAIN = "tasks";
export const SCHEMA_VERSION = 1;

const GROUPS = [
  { id: "ui", zh: "界面", en: "Interface" },
  { id: "list", zh: "列表", en: "List" },
  { id: "form", zh: "新建", en: "Create" },
  { id: "stats", zh: "统计", en: "Statistics" },
  { id: "data", zh: "数据", en: "Data" },
];

const SECTIONS = [
  { value: "trend", zh: "新增/完成/到期趋势", en: "Created / done / due trend" },
  { value: "status", zh: "状态构成", en: "Status breakdown" },
  { value: "priority", zh: "优先级分布", en: "Priority distribution" },
  { value: "difficulty", zh: "难度分布", en: "Difficulty distribution" },
  { value: "aging", zh: "逾期账龄", en: "Overdue aging" },
  { value: "overdue", zh: "逾期清单", en: "Overdue list" },
  { value: "tables", zh: "任务表排行", en: "Task tables" },
  { value: "groups", zh: "任务组排行", en: "Task groups" },
  { value: "workspaces", zh: "工作区排行", en: "Workspaces" },
  { value: "recentPublish", zh: "最近发布", en: "Recently published" },
  { value: "recentDone", zh: "最近完成", en: "Recently completed" },
  { value: "recentShutdown", zh: "最近关闭", en: "Recently closed" },
];

const ITEMS = [
  {
    id: "ui.bodyMode", group: "ui", type: "enum", surface: "ui", apply: "mount", default: "markdown",
    zh: "正文显示模式", en: "Body display mode",
    hintZh: "任务正文初始模式；每块可独立临时切换，默认 Markdown；储物描述仍跟随此配置", hintEn: "Initial task body mode (Markdown by default); each block can toggle independently. Storage descriptions follow this setting",
    values: [{ value: "markdown", zh: "Markdown", en: "Markdown" }, { value: "text", zh: "纯文本", en: "Plain text" }],
  },
  {
    id: "ui.listView", group: "ui", type: "enum", surface: "ui", apply: "mount", default: "list",
    zh: "列表形态", en: "List style",
    hintZh: "记录页默认用列表还是卡片", hintEn: "List or card layout in Records",
    values: [
      { value: "list", zh: "列表", en: "List" },
      { value: "card", zh: "卡片", en: "Cards" },
    ],
  },
  {
    id: "ui.defaultPreset", group: "ui", type: "enum", surface: "ui", apply: "mount", default: "",
    zh: "默认快捷筛选", en: "Default quick filter",
    hintZh: "打开记录页时自动套用的快捷查询预设；「全部」表示不套用（有会话筛选记忆时以记忆为准）",
    hintEn: "Quick filter applied when Records opens; All means none (session memory wins when present)",
    values: [
      { value: "", zh: "全部", en: "All" },
      { value: "urgent", zh: "紧急任务 P8–10", en: "Urgent (P8–10)" },
      { value: "hard", zh: "高难度 D4–5", en: "Hard (D4–5)" },
      { value: "overdue", zh: "已逾期", en: "Overdue" },
      { value: "dueToday", zh: "今日到期", en: "Due today" },
      { value: "recentDone", zh: "近 7 天完成", en: "Done in 7 days" },
      { value: "claimed", zh: "已接取", en: "Claimed" },
    ],
  },
  {
    id: "ui.expandDepth", group: "ui", type: "int", surface: "ui", apply: "mount", default: 2, min: 0, max: 9,
    zh: "默认展开层级", en: "Default tree depth",
    hintZh: "左侧任务树初始展开到第几层（0 只展开根）", hintEn: "Initial tree depth (0 = root only)",
  },
  {
    id: "list.pageSize", group: "list", type: "enum", surface: "ui", apply: "mount", default: 12,
    zh: "每页条数", en: "Page size",
    hintZh: "记录页每页显示多少条", hintEn: "Rows per page in Records",
    values: [
      { value: 6, zh: "6 条", en: "6" },
      { value: 12, zh: "12 条", en: "12" },
      { value: 24, zh: "24 条", en: "24" },
      { value: 48, zh: "48 条", en: "48" },
    ],
  },
  {
    id: "list.sort", group: "list", type: "enum", surface: "ui", apply: "mount", default: "auto",
    zh: "默认排序", en: "Default sort",
    hintZh: "auto 表示沿用记录页的默认排序", hintEn: "auto keeps the default Records order",
    values: [
      { value: "auto", zh: "自动（默认）", en: "Auto (default)" },
      { value: "priority", zh: "优先级升序", en: "Priority asc" },
      { value: "-priority", zh: "优先级降序", en: "Priority desc" },
      { value: "target", zh: "目标日期升序", en: "Target asc" },
      { value: "-target", zh: "目标日期降序", en: "Target desc" },
      { value: "publish", zh: "发布日期升序", en: "Published asc" },
      { value: "-publish", zh: "发布日期降序", en: "Published desc" },
      { value: "updated", zh: "更新时间升序", en: "Updated asc" },
      { value: "-updated", zh: "更新时间降序", en: "Updated desc" },
      { value: "created", zh: "创建时间升序", en: "Created asc" },
      { value: "-created", zh: "创建时间降序", en: "Created desc" },
    ],
  },
  {
    id: "form.defaultPriority", group: "form", type: "int", surface: "ui", apply: "mount", default: 1, min: 0, max: 10,
    zh: "默认优先级", en: "Default priority",
    hintZh: "新建任务表单里的初始优先级", hintEn: "Initial priority in the create form",
  },
  {
    id: "form.defaultDifficulty", group: "form", type: "int", surface: "ui", apply: "mount", default: 0, min: 0, max: 5,
    zh: "默认难度", en: "Default difficulty",
    hintZh: "兼容旧配置；新建任务默认未设置（0），请按实际改动填写", hintEn: "Legacy setting; new tasks start unset (0), assess the actual change",
  },
  {
    id: "form.defaultTargetOffset", group: "form", type: "int", surface: "ui", apply: "mount", default: 0, min: -365, max: 365,
    zh: "目标日期偏移", en: "Target date offset",
    hintZh: "新建表单的目标日期相对今天的天数，0 表示当天", hintEn: "Target date offset in days from today (0 = today)",
  },
  {
    id: "form.autoCreateTags", group: "form", type: "bool", surface: "api", apply: "api", default: true,
    zh: "自动创建未知标签", en: "Auto-create unknown tags",
    hintZh: "关闭后，写入任务时遇到不存在的标签名会直接报错", hintEn: "When off, unknown tag names cause an error instead of being created",
  },
  {
    id: "stats.range", group: "stats", type: "enum", surface: "ui", apply: "mount", default: "30d",
    zh: "默认时间范围", en: "Default range",
    hintZh: "打开统计页时默认选择的时间范围", hintEn: "Range selected when opening Stats",
    values: [
      { value: "7d", zh: "近 7 天", en: "7 days" },
      { value: "30d", zh: "近 30 天", en: "30 days" },
      { value: "90d", zh: "近 90 天", en: "90 days" },
      { value: "365d", zh: "近 1 年", en: "1 year" },
      { value: "all", zh: "全部", en: "All" },
    ],
  },
  {
    id: "stats.top", group: "stats", type: "int", surface: "ui", apply: "mount", default: 10, min: 5, max: 20,
    zh: "榜单条数", en: "Ranking size",
    hintZh: "排行/清单最多显示多少条（5–20）", hintEn: "Rows shown in rankings and lists (5–20)",
  },
  {
    id: "stats.weekStartsOn", group: "stats", type: "enum", surface: "api", apply: "api", default: 1,
    zh: "每周起始日", en: "Week starts on",
    hintZh: "按周分桶时，一周从哪天开始", hintEn: "First day of week when bucketing by week",
    values: [
      { value: 1, zh: "周一", en: "Monday" },
      { value: 0, zh: "周日", en: "Sunday" },
    ],
  },
  {
    id: "stats.sections", group: "stats", type: "multi", surface: "ui", apply: "mount",
    default: SECTIONS.map((s) => s.value),
    zh: "显示的区块", en: "Visible sections",
    hintZh: "统计页展示哪些区块；KPI 由下一项单独控制", hintEn: "Sections rendered on Stats; KPIs are controlled separately",
    values: SECTIONS,
  },
  {
    id: "stats.recentPublishLimit", group: "stats", type: "int", surface: "ui", apply: "mount", default: 10, min: 1, max: 50,
    zh: "最近发布条数", en: "Recently published rows",
    hintZh: "「最近发布」区块显示多少条（1–50）", hintEn: "Rows in Recently published (1–50)",
  },
  {
    id: "stats.recentDoneLimit", group: "stats", type: "int", surface: "ui", apply: "mount", default: 10, min: 1, max: 50,
    zh: "最近完成条数", en: "Recently completed rows",
    hintZh: "「最近完成」区块显示多少条（1–50）", hintEn: "Rows in Recently completed (1–50)",
  },
  {
    id: "stats.recentShutdownLimit", group: "stats", type: "int", surface: "ui", apply: "mount", default: 10, min: 1, max: 50,
    zh: "最近关闭条数", en: "Recently closed rows",
    hintZh: "「最近关闭」区块显示多少条（1–50）", hintEn: "Rows in Recently closed (1–50)",
  },
  {
    id: "ui.confirmDelete", group: "ui", type: "bool", surface: "ui", apply: "mount", default: true,
    zh: "删除前确认", en: "Confirm before delete",
    hintZh: "删除任务或任务单元时弹出确认框", hintEn: "Ask before deleting tasks or task units",
  },
  {
    id: "stats.showKpi", group: "stats", type: "bool", surface: "ui", apply: "mount", default: true,
    zh: "显示 KPI", en: "Show KPIs",
    hintZh: "统计页顶部那排数字卡片", hintEn: "The KPI row at the top of Stats",
  },
  {
    id: "data.pageSize", group: "data", type: "enum", surface: "ui", apply: "mount", default: 50,
    zh: "数据页每页条数", en: "Data rows per page",
    hintZh: "「数据」视图默认每页显示多少行", hintEn: "Default rows per page in the Data view",
    values: [
      { value: 10, zh: "10 行", en: "10" },
      { value: 25, zh: "25 行", en: "25" },
      { value: 50, zh: "50 行", en: "50" },
      { value: 100, zh: "100 行", en: "100" },
      { value: 200, zh: "200 行", en: "200" },
    ],
  },
  {
    id: "data.showSystemColumns", group: "data", type: "bool", surface: "ui", apply: "mount", default: false,
    zh: "显示系统列", en: "Show system columns",
    hintZh: "是否显示 rev / created_at / updated_at / deleted_at", hintEn: "Show rev / created_at / updated_at / deleted_at",
  },
  {
    id: "data.includeDeleted", group: "data", type: "bool", surface: "ui", apply: "mount", default: false,
    zh: "包含已删除行", en: "Include deleted rows",
    hintZh: "默认只显示未软删的行", hintEn: "Deleted rows are hidden by default",
  },
];

const BY_ID = Object.create(null);
for (const item of ITEMS) BY_ID[item.id] = item;

function keyOf(id) {
  return "config." + DOMAIN + "." + id;
}

function ensureMeta(db) {
  if (!tableExists(db, "meta")) {
    db.exec("CREATE TABLE IF NOT EXISTS meta (k TEXT PRIMARY KEY, v TEXT NOT NULL);");
  }
}

function metaSet(db, key, value) {
  db.prepare("INSERT INTO meta(k,v) VALUES(?,?) ON CONFLICT(k) DO UPDATE SET v=excluded.v").run(String(key), String(value));
}

function metaDelete(db, key) {
  db.prepare("DELETE FROM meta WHERE k=?").run(String(key));
}

function metaRows(db) {
  try {
    return db.prepare("SELECT k,v FROM meta WHERE k LIKE ?").all("config." + DOMAIN + ".%");
  } catch (e) {
    return [];
  }
}

function optionsOf(item) {
  return (item.values || []).map(function (o) {
    return { value: o.value, zh: o.zh, en: o.en };
  });
}

function publicItem(item) {
  const out = {
    id: item.id, group: item.group, surface: item.surface, apply: item.apply,
    type: item.type, default: item.default, zh: item.zh, en: item.en,
    hintZh: item.hintZh || "", hintEn: item.hintEn || "",
  };
  if (item.values) out.options = optionsOf(item);
  if (item.min !== undefined) out.min = item.min;
  if (item.max !== undefined) out.max = item.max;
  return out;
}

function typeLabel(item) {
  return item.id + "（" + item.type + "）";
}

/** 校验并规整一个值；失败时抛错（消息里带 id 与原因）。 */
export function coerceValue(item, raw) {
  if (!item) throw new Error("未知配置项：" + String(raw));
  const label = item.id;
  if (raw === undefined) throw new Error("配置项缺少值：" + label);
  if (item.type === "bool") {
    if (typeof raw !== "boolean") throw new Error(label + " 需要布尔值");
    return raw;
  }
  if (item.type === "int") {
    const n = Number(raw);
    if (!Number.isInteger(n)) throw new Error(label + " 需要整数");
    if (item.min !== undefined && n < item.min) throw new Error(label + " 不能小于 " + item.min);
    if (item.max !== undefined && n > item.max) throw new Error(label + " 不能大于 " + item.max);
    return n;
  }
  if (item.type === "enum") {
    const allowed = (item.values || []).map(function (o) { return o.value; });
    if (allowed.indexOf(raw) < 0) throw new Error(label + " 取值非法：" + JSON.stringify(raw));
    return raw;
  }
  if (item.type === "multi") {
    if (!Array.isArray(raw)) throw new Error(label + " 需要数组");
    const allowed = (item.values || []).map(function (o) { return o.value; });
    const seen = [];
    for (const v of raw) {
      if (allowed.indexOf(v) < 0) throw new Error(label + " 含非法取值：" + JSON.stringify(v));
      if (seen.indexOf(v) < 0) seen.push(v);
    }
    if (!seen.length) throw new Error(label + " 至少保留一项");
    return seen;
  }
  if (item.type === "string") {
    if (typeof raw !== "string") throw new Error(label + " 需要字符串");
    const max = item.maxLength || 200;
    if (raw.length > max) throw new Error(label + " 不能超过 " + max + " 个字符");
    return raw;
  }
  throw new Error(label + " 的类型不受支持：" + item.type);
}

/**
 * 读取配置：返回覆盖项 + 合并默认值后的值 + warnings。
 * 坏 JSON、非法值、未知/已废弃 id 都不会抛错。
 */
export function loadConfig(db) {
  const overrides = Object.create(null);
  const values = Object.create(null);
  const warnings = [];
  for (const item of ITEMS) values[item.id] = item.default;
  let rows = [];
  try {
    rows = metaRows(db);
  } catch (e) {
    warnings.push({ code: "config_unreadable", message: "配置表不可读，使用默认值" });
    rows = [];
  }
  const prefix = "config." + DOMAIN + ".";
  for (const row of rows) {
    const id = String(row.k).slice(prefix.length);
    const item = BY_ID[id];
    if (!item) {
      warnings.push({ code: "config_unknown_key", id: id, message: "未知配置项已忽略：" + id });
      continue;
    }
    let parsed;
    try {
      parsed = JSON.parse(String(row.v));
    } catch (e) {
      warnings.push({ code: "config_bad_json", id: id, message: "配置值不是合法 JSON，已回退默认：" + id });
      continue;
    }
    try {
      const v = coerceValue(item, parsed);
      overrides[id] = v;
      values[id] = v;
    } catch (e) {
      warnings.push({ code: "config_invalid", id: id, message: String((e && e.message) || e) + "，已回退默认" });
    }
  }
  return { values: values, overrides: overrides, warnings: warnings };
}

/** 服务端只关心值。 */
export function configValues(db) {
  return loadConfig(db).values;
}

export function configState(db) {
  const loaded = loadConfig(db);
  return {
    domain: DOMAIN,
    schemaVersion: SCHEMA_VERSION,
    groups: GROUPS,
    items: ITEMS.map(publicItem),
    values: loaded.values,
    overrides: loaded.overrides,
    warnings: loaded.warnings,
    table: "meta",
  };
}

function writeValues(db, raw, origin) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) throw new Error("values 需要 { 配置项: 值 } 形式");
  const ids = Object.keys(raw);
  if (!ids.length) throw new Error("没有要保存的配置项");
  const prepared = [];
  for (const id of ids) {
    const item = BY_ID[id];
    if (!item) throw new Error("未知配置项：" + id + "（可用 tasks.configOptions 查看全部）");
    prepared.push({ id: id, value: coerceValue(item, raw[id]) });
  }
  const ts = Date.now();
  tx(db, function () {
    for (const row of prepared) metaSet(db, keyOf(row.id), JSON.stringify(row.value));
  });
  return {
    changed: prepared.map(function (r) { return r.id; }),
    values: (function () { const v = Object.create(null); for (const p of prepared) v[p.id] = p.value; return v; })(),
    state: configState(db),
    updatedAt: ts,
    origin: String(origin || "ui"),
  };
}

function resetValues(db, ids) {
  let targets = ids;
  if (targets === undefined || targets === null || !Array.isArray(targets) || !targets.length) {
    targets = ITEMS.map(function (i) { return i.id; });
  }
  for (const id of targets) {
    if (!BY_ID[id]) throw new Error("未知配置项：" + id);
  }
  tx(db, function () {
    for (const id of targets) metaDelete(db, keyOf(id));
  });
  return { reset: targets, state: configState(db) };
}

function renderItems(items) {
  return items.join(", ");
}

function configItemSchema() {
  return {
    type: "object",
    description: "要保存的配置项，键为配置 id、值为新值",
    additionalProperties: true,
  };
}

export function registerConfigActions(api) {
  const db = api.db;
  ensureMeta(db);

  api.action("tasks.configGet", {
    description: "读取任务插件的全部配置项（含默认值、覆盖值、校验告警）；配置只存本地 meta 表，不参与云端同步",
    input: { type: "object", properties: {} },
    execute: function () { return configState(db); },
    render: function (s) {
      const lines = ["任务配置（" + s.items.length + " 项）"];
      for (const item of s.items) lines.push("- " + item.id + " = " + JSON.stringify(s.values[item.id]) + (s.overrides[item.id] === undefined ? "（默认）" : ""));
      for (const w of s.warnings || []) lines.push("! " + w.message);
      return lines.join("\n");
    },
  });

  api.action("tasks.configSet", {
    description: "保存一项或多项配置（白名单校验，整批原子）；值非法会报错并指出配置 id",
    input: { type: "object", properties: { values: configItemSchema() }, required: ["values"] },
    examples: [{ values: { "list.pageSize": 24, "stats.range": "90d" } }],
    execute: function (args, ctx) {
      const res = writeValues(db, args && args.values, ctx && ctx.origin);
      return res;
    },
    render: function (r) { return "已保存任务配置：" + renderItems(r.changed); },
  });

  api.action("tasks.configReset", {
    description: "删除配置覆盖项，恢复默认值；ids 省略时重置全部",
    input: {
      type: "object",
      properties: { ids: { type: "array", items: { type: "string" }, description: "要重置的配置 id" } },
    },
    execute: function (args) { return resetValues(db, args && args.ids); },
    render: function (r) { return "已恢复默认：" + renderItems(r.reset); },
  });

  api.action("tasks.configOptions", {
    description: "列出可配置项、类型与默认值（给 agent 查 id 用）",
    input: { type: "object", properties: {} },
    execute: function () {
      const s = configState(db);
      return { domain: DOMAIN, groups: s.groups, items: s.items };
    },
    render: function (r) {
      const lines = ["可配置项 " + r.items.length + " 个"];
      for (const item of r.items) {
        lines.push("- " + item.id + "（" + item.type + "，" + item.surface + "）默认 " + JSON.stringify(item.default) + (item.options ? "，可选 " + item.options.map(function (o) { return o.value; }).join("/") : ""));
      }
      return lines.join("\n");
    },
  });
}

export const CONFIG_GROUPS = GROUPS;
export const CONFIG_ITEMS = ITEMS;
