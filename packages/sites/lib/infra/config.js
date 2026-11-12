/**
 * 站点插件的配置项：白名单 schema + 本地读写。
 *
 * 配置只存覆盖项，默认值留在代码里；存放位置是已有的 meta 表
 * （键 `config.sites.<id>`），不建新表、不参与云端同步，也不进入备份。
 * 读取永远宽松：表缺失/JSON 坏/取值越界都回退默认值并给出 warnings；
 * 只有 configSet 会抛错（带 id 与原因）。
 */

import { tableExists, tx } from "../db/db.js";

export const DOMAIN = "sites";
export const SCHEMA_VERSION = 1;

const GROUPS = [
  { id: "ui", zh: "界面", en: "Interface" },
  { id: "list", zh: "列表", en: "List" },
  { id: "form", zh: "新建", en: "Create" },
  { id: "stats", zh: "统计", en: "Statistics" },
  { id: "data", zh: "数据", en: "Data" },
  { id: "vault", zh: "账号保险箱", en: "Account vault" },
];

const SECTIONS = [
  { value: "links", zh: "链接数量分布", en: "Link count" },
  { value: "fresh", zh: "新鲜度", en: "Freshness" },
  { value: "nodes", zh: "目录分布", en: "Directory distribution" },
  { value: "trend", zh: "新增趋势", en: "Creation trend" },
  { value: "topTags", zh: "Top 标签", en: "Top tags" },
  { value: "stale", zh: "陈旧站点", en: "Stale sites" },
  { value: "dup", zh: "重复 URL", en: "Duplicate URLs" },
  { value: "orphan", zh: "无目录站点", en: "Sites without directory" },
  { value: "emptyNodes", zh: "空目录", en: "Empty directories" },
];

const ITEMS = [
  {
    id: "list.pageSize", group: "list", type: "enum", surface: "ui", apply: "mount", default: 16,
    zh: "每页条数", en: "Page size",
    hintZh: "记录页每页显示多少个站点", hintEn: "Sites per page in Records",
    values: [
      { value: 8, zh: "8 个", en: "8" },
      { value: 16, zh: "16 个", en: "16" },
      { value: 24, zh: "24 个", en: "24" },
      { value: 32, zh: "32 个", en: "32" },
      { value: 48, zh: "48 个", en: "48" },
    ],
  },
  {
    id: "list.sortColumn", group: "list", type: "enum", surface: "ui", apply: "mount", default: "update_time",
    zh: "默认排序列", en: "Default sort column",
    hintZh: "记录页默认按哪一列排序", hintEn: "Column used for the default order",
    values: [
      { value: "update_time", zh: "更新时间", en: "Updated" },
      { value: "create_time", zh: "创建时间", en: "Created" },
      { value: "site_name", zh: "站点名称", en: "Name" },
    ],
  },
  {
    id: "list.sortOrder", group: "list", type: "enum", surface: "ui", apply: "mount", default: "desc",
    zh: "默认排序方向", en: "Default sort order",
    hintZh: "配合上一项使用", hintEn: "Used together with the column above",
    values: [
      { value: "desc", zh: "降序", en: "Descending" },
      { value: "asc", zh: "升序", en: "Ascending" },
    ],
  },
  {
    id: "form.defaultBindable", group: "form", type: "bool", surface: "ui", apply: "mount", default: true,
    zh: "新增默认可绑定", en: "Bindable by default",
    hintZh: "新建站点表单里「可绑定」的初始状态", hintEn: "Initial Bindable state in the create form",
  },
  {
    id: "form.maxLinks", group: "form", type: "int", surface: "api", apply: "api", default: 10, min: 1, max: 50,
    zh: "链接数上限", en: "Max links",
    hintZh: "一个站点最多保存多少条链接（1–50）", hintEn: "Links allowed per site (1–50)",
  },
  {
    id: "ui.confirmDelete", group: "ui", type: "bool", surface: "ui", apply: "mount", default: true,
    zh: "删除前确认", en: "Confirm before delete",
    hintZh: "关闭后删除站点不再弹确认框", hintEn: "When off, deleting a site skips the confirm dialog",
  },
  {
    id: "ui.toastDuration", group: "ui", type: "int", surface: "ui", apply: "mount", default: 2600, min: 800, max: 8000,
    zh: "提示停留时长", en: "Toast duration",
    hintZh: "操作提示的停留毫秒数（800–8000）", hintEn: "How long a toast stays, in ms (800–8000)",
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
    id: "stats.staleDays", group: "stats", type: "int", surface: "api", apply: "api", default: 90, min: 7, max: 3650,
    zh: "陈旧阈值（天）", en: "Stale after (days)",
    hintZh: "新鲜度分桶的最后一档阈值（7–3650）", hintEn: "Threshold for the oldest freshness bucket (7–3650)",
  },
  {
    id: "stats.duplicateLimit", group: "stats", type: "int", surface: "api", apply: "api", default: 5, min: 1, max: 20,
    zh: "重复 URL 组数", en: "Duplicate groups",
    hintZh: "重复 URL 清单最多列几组（1–20）", hintEn: "How many duplicate groups to list (1–20)",
  },
  {
    id: "stats.sections", group: "stats", type: "multi", surface: "ui", apply: "mount",
    default: SECTIONS.map(function (s) { return s.value; }),
    zh: "显示的区块", en: "Visible sections",
    hintZh: "统计页展示哪些区块；KPI 由下一项单独控制", hintEn: "Sections rendered on Stats; KPIs are controlled separately",
    values: SECTIONS,
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
  {
    id: "vault.idleMinutes", group: "vault", type: "int", surface: "ui", apply: "mount", default: 15, min: 1, max: 120,
    zh: "自动锁定（分钟）", en: "Auto lock (minutes)",
    hintZh: "账号保险箱解锁后，空闲多少分钟自动锁定并清空内存密钥", hintEn: "Lock the vault and wipe the in-memory key after this many idle minutes",
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
    if (!item) throw new Error("未知配置项：" + id + "（可用 sites.configOptions 查看全部）");
    prepared.push({ id: id, value: coerceValue(item, raw[id]) });
  }
  const ts = Date.now();
  tx(db, function () {
    for (const row of prepared) metaSet(db, keyOf(row.id), JSON.stringify(row.value));
  });
  const values = Object.create(null);
  for (const p of prepared) values[p.id] = p.value;
  return {
    changed: prepared.map(function (r) { return r.id; }),
    values: values,
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

export function registerConfigActions(api) {
  const db = api.db;
  ensureMeta(db);

  api.action("sites.configGet", {
    description: "读取站点插件的全部配置项（含默认值、覆盖值、校验告警）；配置只存本地 meta 表，不参与云端同步",
    input: { type: "object", properties: {} },
    execute: function () { return configState(db); },
    render: function (s) {
      const lines = ["站点配置（" + s.items.length + " 项）"];
      for (const item of s.items) lines.push("- " + item.id + " = " + JSON.stringify(s.values[item.id]) + (s.overrides[item.id] === undefined ? "（默认）" : ""));
      for (const w of s.warnings || []) lines.push("! " + w.message);
      return lines.join("\n");
    },
  });

  api.action("sites.configSet", {
    description: "保存一项或多项配置（白名单校验，整批原子）；值非法会报错并指出配置 id",
    input: { type: "object", properties: { values: { type: "object", description: "要保存的配置项，键为配置 id、值为新值", additionalProperties: true } }, required: ["values"] },
    examples: [{ values: { "list.pageSize": 24, "stats.staleDays": 60 } }],
    execute: function (args, ctx) { return writeValues(db, args && args.values, ctx && ctx.origin); },
    render: function (r) { return "已保存站点配置：" + renderItems(r.changed); },
  });

  api.action("sites.configReset", {
    description: "删除配置覆盖项，恢复默认值；ids 省略时重置全部",
    input: { type: "object", properties: { ids: { type: "array", items: { type: "string" }, description: "要重置的配置 id" } } },
    execute: function (args) { return resetValues(db, args && args.ids); },
    render: function (r) { return "已恢复默认：" + renderItems(r.reset); },
  });

  api.action("sites.configOptions", {
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
