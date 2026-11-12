/**
 * 标签插件的配置项：白名单 schema + 本地读写。
 *
 * 配置只存覆盖项，默认值留在代码里；存放位置是已有的 meta 表
 * （键 `config.tags.<id>`），不建新表、不参与云端同步，也不进入备份。
 * 读取永远宽松：表缺失/JSON 坏/取值越界都回退默认值并给出 warnings；
 * 只有 configSet 会抛错（带 id 与原因）。
 */

import { tableExists, tx } from "../db/db.js";

export const DOMAIN = "tags";
export const SCHEMA_VERSION = 1;

const GROUPS = [
  { id: "ui", zh: "界面", en: "Interface" },
  { id: "list", zh: "列表", en: "List" },
  { id: "form", zh: "新建与重命名", en: "Create & rename" },
  { id: "stats", zh: "统计", en: "Statistics" },
  { id: "data", zh: "数据", en: "Data" },
];

const SECTIONS = [
  { value: "usage", zh: "使用分布", en: "Usage distribution" },
  { value: "top", zh: "Top 100 标签", en: "Top 100 tags" },
  { value: "types", zh: "对象类型", en: "Object types" },
  { value: "trend", zh: "使用趋势", en: "Usage trend" },
  { value: "stale", zh: "沉睡标签", en: "Dormant tags" },
  { value: "recent", zh: "最近使用", en: "Recently used" },
];

const ITEMS = [
  {
    id: "list.pageSize", group: "list", type: "enum", surface: "ui", apply: "mount", default: 18,
    zh: "每页条数", en: "Page size",
    hintZh: "记录页每页显示多少个标签", hintEn: "Tags per page in Records",
    values: [
      { value: 12, zh: "12 个", en: "12" },
      { value: 18, zh: "18 个", en: "18" },
      { value: 24, zh: "24 个", en: "24" },
      { value: 36, zh: "36 个", en: "36" },
      { value: 48, zh: "48 个", en: "48" },
    ],
  },
  {
    id: "form.maxNameLength", group: "form", type: "int", surface: "api", apply: "api", default: 64, min: 8, max: 128,
    zh: "名称长度上限", en: "Max name length",
    hintZh: "新建与重命名时允许的最大字符数（8–128）", hintEn: "Characters allowed when creating or renaming (8–128)",
  },
  {
    id: "ui.confirmDelete", group: "ui", type: "bool", surface: "ui", apply: "mount", default: true,
    zh: "删除前确认", en: "Confirm before delete",
    hintZh: "关闭后点击删除立即生效，不再出现二次确认", hintEn: "When off, delete applies immediately without a second click",
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
    id: "stats.top", group: "stats", type: "int", surface: "ui", apply: "mount", default: 10, min: 5, max: 100,
    zh: "榜单条数", en: "Ranking size",
    hintZh: "清单条数（5–100），沉睡最多 20、最近使用最多 10；Top 100 标签独立显示", hintEn: "List size (5–100), dormant up to 20, recent up to 10; Top 100 tags is independent",
  },
  {
    id: "stats.staleDays", group: "stats", type: "int", surface: "api", apply: "api", default: 90, min: 7, max: 3650,
    zh: "沉睡阈值（天）", en: "Dormant after (days)",
    hintZh: "多少天未使用算沉睡（7–3650）", hintEn: "Days without use before a tag counts as dormant (7–3650)",
  },
  {
    id: "stats.staleIncludeUnused", group: "stats", type: "bool", surface: "api", apply: "api", default: true,
    zh: "沉睡含从未使用", en: "Include never-used tags",
    hintZh: "关闭后，从未使用过的标签不进入沉睡清单", hintEn: "When off, never-used tags are excluded from the dormant list",
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
    if (!item) throw new Error("未知配置项：" + id + "（可用 tags.configOptions 查看全部）");
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

  api.action("tags.configGet", {
    description: "读取标签插件的全部配置项（含默认值、覆盖值、校验告警）；配置只存本地 meta 表，不参与云端同步",
    input: { type: "object", properties: {} },
    execute: function () { return configState(db); },
    render: function (s) {
      const lines = ["标签配置（" + s.items.length + " 项）"];
      for (const item of s.items) lines.push("- " + item.id + " = " + JSON.stringify(s.values[item.id]) + (s.overrides[item.id] === undefined ? "（默认）" : ""));
      for (const w of s.warnings || []) lines.push("! " + w.message);
      return lines.join("\n");
    },
  });

  api.action("tags.configSet", {
    description: "保存一项或多项配置（白名单校验，整批原子）；值非法会报错并指出配置 id",
    input: { type: "object", properties: { values: { type: "object", description: "要保存的配置项，键为配置 id、值为新值", additionalProperties: true } }, required: ["values"] },
    examples: [{ values: { "list.pageSize": 24, "stats.staleDays": 60 } }],
    execute: function (args, ctx) { return writeValues(db, args && args.values, ctx && ctx.origin); },
    render: function (r) { return "已保存标签配置：" + renderItems(r.changed); },
  });

  api.action("tags.configReset", {
    description: "删除配置覆盖项，恢复默认值；ids 省略时重置全部",
    input: { type: "object", properties: { ids: { type: "array", items: { type: "string" }, description: "要重置的配置 id" } } },
    execute: function (args) { return resetValues(db, args && args.ids); },
    render: function (r) { return "已恢复默认：" + renderItems(r.reset); },
  });

  api.action("tags.configOptions", {
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
