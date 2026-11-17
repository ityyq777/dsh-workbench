/**
 * 消息插件的配置项：白名单 schema + 本地读写。
 *
 * 与四个业务插件同一套范式：配置只存覆盖项，默认值留在代码里；存放位置是宿主的
 * meta 表（键 `config.message.<id>`），不建新表、不进同步、不进备份。
 * 读取永远宽松（表缺失/JSON 坏/取值越界都回退默认值并给 warnings），只有写入会抛错。
 */

import { tableExists, tx } from "../db/db.js";

export const DOMAIN = "message";
export const SCHEMA_VERSION = 1;

const GROUPS = [
  { id: "sound", zh: "提示音", en: "Sound" },
  { id: "quiet", zh: "免打扰", en: "Quiet hours" },
  { id: "retention", zh: "保留期", en: "Retention" },
  { id: "list", zh: "列表", en: "List" },
];

const ITEMS = [
  {
    id: "sound.enabled", group: "sound", type: "bool", surface: "ui", apply: "mount", default: true,
    zh: "新消息提示音", en: "Sound for new messages",
    hintZh: "关闭后收到新消息不再发声（未读数照常增加）", hintEn: "When off, new messages stay silent (unread count still grows)",
  },
  {
    id: "sound.volume", group: "sound", type: "number", surface: "ui", apply: "mount", default: 0.4, min: 0, max: 1,
    zh: "音量", en: "Volume",
    hintZh: "0 到 1 之间，默认 0.4", hintEn: "Between 0 and 1, default 0.4",
  },
  {
    id: "sound.whileHidden", group: "sound", type: "bool", surface: "ui", apply: "mount", default: false,
    zh: "窗口不在前台也响", en: "Play while hidden",
    hintZh: "关闭时只在工作台可见时发声，避免后台突然响", hintEn: "When off, only sound while the workbench is visible",
  },
  {
    id: "quiet.enabled", group: "quiet", type: "bool", surface: "ui", apply: "mount", default: false,
    zh: "启用免打扰", en: "Enable quiet hours",
    hintZh: "开启后时间段内不发声，消息照常入库", hintEn: "Inside the window messages are stored silently",
  },
  {
    id: "quiet.from", group: "quiet", type: "time", surface: "ui", apply: "mount", default: "22:00",
    zh: "免打扰开始", en: "Quiet from",
    hintZh: "24 小时制 HH:MM；跨零点自动按夜间区间处理", hintEn: "24h HH:MM; windows crossing midnight are handled",
  },
  {
    id: "quiet.to", group: "quiet", type: "time", surface: "ui", apply: "mount", default: "08:00",
    zh: "免打扰结束", en: "Quiet until",
    hintZh: "等于开始时间表示全天免打扰", hintEn: "Same as start means all day",
  },
  {
    id: "quiet.levels", group: "quiet", type: "multi", surface: "ui", apply: "mount", default: ["warning", "error"],
    zh: "免打扰仍响的级别", en: "Levels that still sound",
    hintZh: "默认只放行警告与错误", hintEn: "By default only warning and error are let through",
    values: [
      { value: "info", zh: "提示", en: "Info" },
      { value: "success", zh: "成功", en: "Success" },
      { value: "warning", zh: "警告", en: "Warning" },
      { value: "error", zh: "错误", en: "Error" },
    ],
  },
  {
    id: "retention.readDays", group: "retention", type: "int", surface: "api", apply: "api", default: 30, min: 0, max: 3650,
    zh: "已读保留天数", en: "Keep read messages (days)",
    hintZh: "已读消息超过该天数自动清理；未读永不按时间清理，0 表示不按时间清理", hintEn: "Read messages older than this are pruned; unread never expires by time, 0 disables",
  },
  {
    id: "list.pageSize", group: "list", type: "enum", surface: "ui", apply: "mount", default: 20,
    zh: "每页条数", en: "Page size",
    hintZh: "收件箱每页显示多少条", hintEn: "Messages per page in Inbox",
    values: [
      { value: 12, zh: "12 条", en: "12" },
      { value: 20, zh: "20 条", en: "20" },
      { value: 50, zh: "50 条", en: "50" },
    ],
  },
];

const BY_ID = new Map(ITEMS.map((item) => [item.id, item]));

function label(item) {
  return item.zh + "（" + item.id + "）";
}

function coerceValue(item, raw) {
  if (item.type === "bool") {
    if (typeof raw !== "boolean") throw new Error(label(item) + " 需要 true/false");
    return raw;
  }
  if (item.type === "int" || item.type === "number") {
    const value = Number(raw);
    if (!Number.isFinite(value)) throw new Error(label(item) + " 需要数字");
    const min = item.min === undefined ? -Infinity : item.min;
    const max = item.max === undefined ? Infinity : item.max;
    if (value < min || value > max) throw new Error(label(item) + " 需要在 " + min + "–" + max + " 之间");
    return item.type === "int" ? Math.round(value) : value;
  }
  if (item.type === "enum") {
    const values = (item.values || []).map((option) => option.value);
    const hit = values.indexOf(raw);
    if (hit < 0) throw new Error(label(item) + " 只接受：" + values.join(" / "));
    return values[hit];
  }
  if (item.type === "multi") {
    if (!Array.isArray(raw)) throw new Error(label(item) + " 需要数组");
    const values = (item.values || []).map((option) => option.value);
    const seen = [];
    for (const entry of raw) {
      if (values.indexOf(entry) < 0) throw new Error(label(item) + " 含未知取值：" + entry);
      if (seen.indexOf(entry) < 0) seen.push(entry);
    }
    return seen;
  }
  if (item.type === "time") {
    if (typeof raw !== "string" || !/^([01]\d|2[0-3]):[0-5]\d$/.test(raw)) throw new Error(label(item) + " 需要 HH:MM");
    return raw;
  }
  if (item.type === "string") {
    if (typeof raw !== "string") throw new Error(label(item) + " 需要字符串");
    const max = item.maxLength || 200;
    if (raw.length > max) throw new Error(label(item) + " 不能超过 " + max + " 个字符");
    return raw;
  }
  throw new Error(label(item) + " 的类型不受支持：" + item.type);
}

function metaRows(db) {
  if (!tableExists(db, "meta")) return [];
  try {
    return db.prepare("SELECT k,v FROM meta WHERE k LIKE ?").all("config." + DOMAIN + ".%");
  } catch {
    return [];
  }
}

function metaSet(db, key, value) {
  db.prepare("INSERT INTO meta(k,v) VALUES(?,?) ON CONFLICT(k) DO UPDATE SET v=excluded.v").run(String(key), String(value));
}

function metaDelete(db, key) {
  db.prepare("DELETE FROM meta WHERE k=?").run(String(key));
}

function keyOf(id) {
  return "config." + DOMAIN + "." + id;
}

export function loadConfig(db) {
  const overrides = Object.create(null);
  const values = Object.create(null);
  const warnings = [];
  for (const item of ITEMS) values[item.id] = item.default;
  const rows = metaRows(db);
  const prefix = "config." + DOMAIN + ".";
  for (const row of rows) {
    const id = String(row.k).slice(prefix.length);
    const item = BY_ID.get(id);
    if (!item) {
      warnings.push({ code: "config_unknown_key", id: id, message: "未知配置项已忽略：" + id });
      continue;
    }
    let parsed = null;
    try {
      parsed = JSON.parse(String(row.v));
    } catch {
      warnings.push({ code: "config_bad_json", id: id, message: "配置值不是合法 JSON，已回退默认：" + id });
      continue;
    }
    try {
      const value = coerceValue(item, parsed);
      overrides[id] = value;
      values[id] = value;
    } catch (error) {
      warnings.push({ code: "config_invalid", id: id, message: String((error && error.message) || error) + "，已回退默认" });
    }
  }
  return { values: values, overrides: overrides, warnings: warnings };
}

export function configValues(db) {
  return loadConfig(db).values;
}

function publicItem(item) {
  return {
    id: item.id,
    group: item.group,
    type: item.type,
    surface: item.surface,
    apply: item.apply,
    default: item.default,
    zh: item.zh,
    en: item.en,
    hintZh: item.hintZh,
    hintEn: item.hintEn,
    min: item.min,
    max: item.max,
    values: item.values,
  };
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

export function writeConfig(db, raw) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) throw new Error("values 需要 { 配置项: 值 } 形式");
  const ids = Object.keys(raw);
  if (!ids.length) throw new Error("没有要保存的配置项");
  const prepared = [];
  for (const id of ids) {
    const item = BY_ID.get(id);
    if (!item) throw new Error("未知配置项：" + id + "（可用 message.configGet 查看全部）");
    prepared.push({ id: id, value: coerceValue(item, raw[id]) });
  }
  tx(db, function () {
    for (const row of prepared) metaSet(db, keyOf(row.id), JSON.stringify(row.value));
  });
  return {
    changed: prepared.map((row) => row.id),
    values: loadConfig(db).values,
    state: configState(db),
  };
}

export function resetConfig(db, ids) {
  const targets = Array.isArray(ids) && ids.length ? ids : ITEMS.map((item) => item.id);
  for (const id of targets) {
    if (!BY_ID.has(id)) throw new Error("未知配置项：" + id);
  }
  tx(db, function () {
    for (const id of targets) metaDelete(db, keyOf(id));
  });
  return { reset: targets.slice(), values: loadConfig(db).values, state: configState(db) };
}

export function registerConfigActions(api) {
  const action = api.action;
  action("message.configGet", {
    description: "只读：消息插件的配置项定义、当前值与覆盖项（含提示音、免打扰、保留期、列表分页）",
    input: { type: "object", properties: {}, additionalProperties: false },
    execute: () => configState(api.db),
    render: (r) =>
      "消息配置 " + Object.keys(r.values || {}).length + " 项；覆盖 " + Object.keys(r.overrides || {}).length + " 项" +
      (r.warnings && r.warnings.length ? "；warnings " + r.warnings.length : "") + "。",
  });
  action("message.configSet", {
    description: "写入配置覆盖项（值会做类型与范围校验，越界抛错）；配置存本地 meta 表，不进同步与备份",
    input: {
      type: "object",
      properties: {
        values: { type: "object", description: "要写入的配置项，如 {\"sound.enabled\": false, \"quiet.from\": \"22:30\"}" },
      },
      required: ["values"],
    },
    examples: [{ purpose: "关闭提示音并设置免打扰", args: { values: { "sound.enabled": false, "quiet.enabled": true, "quiet.from": "22:30" } } }],
    execute: (args) => writeConfig(api.db, args.values),
    render: (r) => "已更新消息配置：" + (r.changed || []).join("、"),
  });
  action("message.configReset", {
    description: "清除配置覆盖项，回退默认值；不传 ids 表示全部重置",
    input: {
      type: "object",
      properties: { ids: { type: "array", items: { type: "string" }, description: "要重置的配置项 id 列表" } },
    },
    execute: (args) => resetConfig(api.db, args.ids),
    render: (r) => "已重置 " + (r.reset || []).length + " 个配置项。",
  });
}
