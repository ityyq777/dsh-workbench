/**
 * 邮件插件的配置项：白名单 schema + 本地读写。
 *
 * 与消息、自动化等插件同一套范式：配置只存覆盖项，默认值留在代码里；存放位置是宿主的
 * meta 表（键 `config.mail.<id>`），不建新表、不进同步、不进备份。账户与密码类信息
 * 一律不进这里——凭据仍由保险箱托管。
 * 读取永远宽松（表缺失/JSON 坏/取值越界都回退默认值并给 warnings），只有写入会抛错。
 *
 * `apply` 声明生效时机：`mount` 要等视图重新挂载才生效；`background` 写完就由后台重新排期
 * （自动同步用），界面不必刷新。
 */

export const DOMAIN = "mail";
export const SCHEMA_VERSION = 1;

const GROUPS = [
  { id: "images", zh: "图片", en: "Images" },
  { id: "display", zh: "显示", en: "Display" },
  { id: "read", zh: "阅读", en: "Reading" },
  { id: "list", zh: "列表", en: "List" },
  { id: "autosync", zh: "自动同步", en: "Auto-sync" },
  { id: "debug", zh: "诊断", en: "Diagnostics" },
];

const ITEMS = [
  {
    id: "images.remote", group: "images", type: "bool", surface: "ui", apply: "mount", default: true,
    zh: "默认加载远程图片", en: "Show remote images",
    hintZh: "打开即按原信显示图片；关闭后图片换成占位，每封可临时点「显示图片」。注意加载远程图片会让发件方知道你何时、从哪个 IP 读了这封信。",
    hintEn: "Images load as the sender wrote them. When off, images are blocked and you can reveal them per mail. Loading remote images tells the sender when and from which IP you read it.",
  },
  {
    id: "display.html", group: "display", type: "bool", surface: "ui", apply: "mount", default: true,
    zh: "优先原信排版", en: "Prefer HTML layout",
    hintZh: "用原文的 HTML 排版显示（沙箱内渲染，样式不外泄）；关闭后统一按纯文本显示。",
    hintEn: "Render the original HTML inside a sandbox; turn off to always show plain text.",
  },
  {
    id: "display.mailTheme", group: "display", type: "multi", surface: "ui", apply: "mount", default: "original",
    values: ["original", "app"],
    zh: "正文配色", en: "Mail colour scheme",
    hintZh: "original 表示按发件方原设计配色（浅色邮件用浅纸面、深色邮件用深色纸面）；app 表示正文跟随界面主题。单封邮件也可以在阅读区页头临时切换。",
    hintEn: "original keeps the sender's own colour scheme; app follows the app theme. Each mail can also be toggled in the reader header.",
  },
  {
    id: "read.autoSeen", group: "read", type: "bool", surface: "ui", apply: "mount", default: true,
    zh: "打开即标为已读", en: "Mark as read on open",
    hintZh: "打开一封信即回写已读；关闭后需要手动点「标为已读」。",
    hintEn: "Opening a mail marks it read; when off you mark it read manually.",
  },
  {
    id: "list.pageSize", group: "list", type: "int", surface: "ui", apply: "mount", default: 20, min: 10, max: 50,
    zh: "每次加载封数", en: "Messages per page",
    hintZh: "列表一次加载多少封，也作为每次抓取新信的封数（10–50）。",
    hintEn: "How many mails load at a time and how many are fetched per sync (10–50).",
  },
  {
    id: "autosync.enabled", group: "autosync", type: "bool", surface: "ui", apply: "background", default: true,
    zh: "自动收取新邮件", en: "Fetch new mail automatically",
    hintZh: "默认开启：邮件插件在后台按下面的方式检查收件箱，发现新信就抓取信头并提醒。保险箱锁着时不会执行——后台同步不需要、也不会保存你的密码明文。",
    hintEn: "On by default: the mail add-on checks the inbox in the background and fetches new messages. Nothing runs while the credential vault is locked; the background never caches your password.",
  },
  {
    id: "autosync.mode", group: "autosync", type: "multi", surface: "ui", apply: "background", default: "interval",
    values: ["interval", "idle"],
    valueLabels: {
      interval: { zh: "定时循环", en: "Interval" },
      idle: { zh: "IMAP 推送", en: "IMAP push (IDLE)" },
    },
    zh: "同步方式", en: "Sync method",
    hintZh: "定时循环：每隔一段时间连一次服务器，兼容所有邮箱；IMAP 推送：保持一条长连接让服务器主动通知，收信更快，但少数服务商不支持或会掐断连接。",
    hintEn: "Interval reconnects every few minutes and works everywhere; IMAP push keeps one long-lived connection so the server tells us immediately (a few providers do not support it).",
  },
  {
    id: "autosync.intervalSec", group: "autosync", type: "int", surface: "ui", apply: "background", default: 300, min: 60, max: 1800,
    zh: "定时间隔（秒）", en: "Interval (seconds)",
    hintZh: "定时循环的间隔，60–1800 秒。太短会被服务商限流；IMAP 推送模式下它仍是兜底检查周期。",
    hintEn: "Seconds between checks, 60–1800. Very short intervals may be throttled; in IMAP push mode this stays as a safety net.",
  },
  {
    id: "autosync.notify", group: "autosync", type: "bool", surface: "ui", apply: "background", default: true,
    zh: "新邮件通知到消息中心", en: "Notify new mail in messages",
    hintZh: "装了消息插件时，自动抓到的新邮件会在消息中心留一条提醒（同一批新信只提醒一次）。",
    hintEn: "When the messages add-on is installed, each batch of new mail leaves one notice there.",
  },
  {
    id: "debug.fetch", group: "debug", type: "bool", surface: "ui", apply: "mount", default: false,
    zh: "记录正文取数细节", en: "Log body fetch details",
    hintZh: "打开后，读取正文分段时会把 section、服务器声明尺寸、实际字节数与响应 key 打到宿主日志，用于排查「正文下载失败」。默认关闭。",
    hintEn: "When on, every body segment logs its section, declared size, actual bytes and response key. Off by default.",
  },
];

const BY_ID = new Map(ITEMS.map((item) => [item.id, item]));

/** 枚举项的中文/英文标签：界面与回执都从这里取，避免两处各写一份。 */
export function valueLabels(item, id) {
  const labels = (item && item.valueLabels) || {};
  return labels[id] || { zh: id, en: id };
}

// 配置写入后要让后台重新排期（例如把间隔从 5 分钟改成 15 分钟），
// 由装配层注册回调，配置模块本身不反向依赖自动同步。
const changeListeners = [];

export function onConfigChange(fn) {
  if (typeof fn !== "function") throw new Error("onConfigChange 需要函数");
  changeListeners.push(fn);
  return function () {
    const index = changeListeners.indexOf(fn);
    if (index >= 0) changeListeners.splice(index, 1);
  };
}

function notifyChange(changed) {
  for (const fn of changeListeners.slice()) {
    try {
      fn(changed);
    } catch {
      // 回调失败不影响配置已落盘的事实，丢弃异常即可。
    }
  }
}

function label(item) {
  return item.zh + "（" + item.id + "）";
}

function coerceValue(item, raw) {
  if (item.type === "bool") {
    if (typeof raw !== "boolean") throw new Error(label(item) + " 需要 true/false");
    return raw;
  }
  if (item.type === "multi") {
    const value = String(raw == null ? "" : raw);
    if (!Array.isArray(item.values) || !item.values.includes(value)) {
      throw new Error(label(item) + " 只能是 " + (item.values || []).join(" / "));
    }
    return value;
  }
  if (item.type === "int" || item.type === "number") {
    const value = Number(raw);
    if (!Number.isFinite(value)) throw new Error(label(item) + " 需要数字");
    const min = item.min === undefined ? -Infinity : item.min;
    const max = item.max === undefined ? Infinity : item.max;
    if (value < min || value > max) throw new Error(label(item) + " 需要在 " + min + "–" + max + " 之间");
    return item.type === "int" ? Math.round(value) : value;
  }
  throw new Error(label(item) + " 的类型不受支持：" + item.type);
}

function tableExists(db, name) {
  try {
    return !!db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name=?").get(String(name));
  } catch {
    return false;
  }
}

function tx(db, fn) {
  db.exec("BEGIN IMMEDIATE");
  try {
    const result = fn();
    db.exec("COMMIT");
    return result;
  } catch (error) {
    try {
      db.exec("ROLLBACK");
    } catch {
      /* ignore rollback failure */
    }
    throw error;
  }
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
  // 普通对象即可：键只来自白名单 ITEMS，未知键在下面被跳过，不会污染原型。
  const overrides = {};
  const values = {};
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
    valueLabels: item.valueLabels,
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
    if (!item) throw new Error("未知配置项：" + id + "（可用 mail.configGet 查看全部）");
    prepared.push({ id: id, value: coerceValue(item, raw[id]) });
  }
  tx(db, function () {
    for (const row of prepared) metaSet(db, keyOf(row.id), JSON.stringify(row.value));
  });
  notifyChange(prepared.map((row) => row.id));
  return {
    changed: prepared.map((row) => row.id),
    values: loadConfig(db).values,
    warnings: loadConfig(db).warnings,
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
  notifyChange(targets.slice());
  return { reset: targets.slice(), values: loadConfig(db).values, warnings: loadConfig(db).warnings, state: configState(db) };
}

export function registerConfigActions(api) {
  const action = api.action;
  action("mail.configGet", {
    description: "只读：邮件插件的配置项定义与当前值（远程图片、HTML 排版、打开即已读、每次加载封数、自动同步）",
    input: { type: "object", properties: {}, additionalProperties: false },
    execute: () => configState(api.db),
    render: (r) =>
      "邮件配置 " + Object.keys(r.values || {}).length + " 项；覆盖 " + Object.keys(r.overrides || {}).length + " 项" +
      (r.warnings && r.warnings.length ? "；warnings " + r.warnings.length : "") + "。",
  });
  action("mail.configSet", {
    description: "写入邮件插件的配置覆盖项（类型与范围校验，越界抛错）；配置存本地 meta 表，不进同步与备份，也不含账户凭据",
    input: {
      type: "object",
      properties: {
        values: { type: "object", description: "要写入的配置项，如 {\"images.remote\": false, \"list.pageSize\": 30}" },
      },
      required: ["values"],
    },
    examples: [{ purpose: "关闭远程图片并改成每次 30 封", args: { values: { "images.remote": false, "list.pageSize": 30 } } }],
    execute: (args) => writeConfig(api.db, args.values),
    render: (r) => "已更新邮件配置：" + (r.changed || []).join("、"),
  });
  action("mail.configReset", {
    description: "清除邮件配置覆盖项，回退默认值；不传 ids 表示全部重置",
    input: {
      type: "object",
      properties: { ids: { type: "array", items: { type: "string" }, description: "要重置的配置项 id 列表" } },
    },
    execute: (args) => resetConfig(api.db, args.ids),
    render: (r) => "已重置 " + (r.reset || []).length + " 个邮件配置项。",
  });
}
