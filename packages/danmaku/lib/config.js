"use strict";
// 配置项定义与读写：配置不建表，沿用宿主 meta 表的 `config.<domain>.<id>` 键。

import { tableExists } from "./db/db.js";

export const DOMAIN = "wb-addon-danmaku";
export const SCHEMA_VERSION = 1;

export const GROUPS = [
  { id: "player", zh: "播放", en: "Playback" },
  { id: "look", zh: "外观", en: "Appearance" },
  { id: "desktop", zh: "桌面", en: "Desktop" },
];

export const ITEMS = [
  {
    id: "enabled",
    group: "player",
    type: "bool",
    surface: "ui",
    apply: "runtime",
    default: true,
    zh: "启用弹幕",
    en: "Enabled",
    hintZh: "关掉后界面层和桌面层都不再出现弹幕，库里的内容保留。",
    hintEn: "Turns off both the in-app and desktop layers; the library is kept.",
  },
  {
    id: "surface",
    group: "player",
    type: "enum",
    surface: "ui",
    apply: "runtime",
    default: "dsh",
    zh: "显示位置",
    en: "Surface",
    values: [
      { value: "dsh", zh: "仅 DSH 窗口", en: "DSH window only" },
      { value: "desktop", zh: "仅桌面", en: "Desktop only" },
      { value: "both", zh: "DSH 窗口 + 桌面", en: "Both" },
      { value: "none", zh: "都不显示", en: "Nowhere" },
    ],
    hintZh: "DSH 窗口层始终跟随应用；选「桌面」或「两端」会启动独立透明窗覆盖所有屏幕，首次可能需要下载 Electron 运行时。",
    hintEn: "The DSH layer follows the app window; Desktop or Both starts a transparent always-on-top layer (may download the Electron runtime on first use).",
  },
  {
    id: "intervalMs",
    group: "player",
    type: "int",
    surface: "ui",
    apply: "runtime",
    default: 1400,
    min: 400,
    max: 10000,
    zh: "出现间隔（毫秒）",
    en: "Interval (ms)",
    hintZh: "两条弹幕之间的间隔；库越小越密。",
    hintEn: "Gap between two danmaku; a small library feels denser.",
  },
  {
    id: "order",
    group: "player",
    type: "enum",
    surface: "ui",
    apply: "runtime",
    default: "shuffle",
    zh: "轮播顺序",
    en: "Order",
    values: [
      { value: "shuffle", zh: "随机（每轮不重复）", en: "Shuffle (no repeat per round)" },
      { value: "sequence", zh: "按列表顺序", en: "List order" },
    ],
    hintZh: "随机模式用洗牌袋：一轮内每条只出现一次。",
    hintEn: "Shuffle uses a bag: each line appears once per round.",
  },
  {
    id: "speed",
    group: "look",
    type: "int",
    surface: "ui",
    apply: "runtime",
    default: 150,
    min: 40,
    max: 500,
    zh: "滚动速度（像素/秒）",
    en: "Speed (px/s)",
    hintZh: "速度恒定，长句停留更久，不会被「挤快」。",
    hintEn: "Constant speed, so longer lines take longer to cross.",
  },
  {
    id: "lanes",
    group: "look",
    type: "int",
    surface: "ui",
    apply: "runtime",
    default: 7,
    min: 1,
    max: 12,
    zh: "泳道数",
    en: "Lanes",
    hintZh: "同时最多这么多行；屏幕矮时会自动压缩行高。",
    hintEn: "How many rows can be in flight; lane height shrinks on short screens.",
  },
  {
    id: "band",
    group: "look",
    type: "enum",
    surface: "ui",
    apply: "runtime",
    default: "full",
    zh: "分布区域",
    en: "Band",
    values: [
      { value: "full", zh: "整屏", en: "Whole screen" },
      { value: "upper", zh: "上半屏", en: "Upper half" },
      { value: "lower", zh: "下半屏", en: "Lower half" },
    ],
    hintZh: "只想当氛围时用整屏；不想压住内容时用上半屏或下半屏。",
    hintEn: "Whole screen is ambient; a half band keeps content readable.",
  },
  {
    id: "fontSize",
    group: "look",
    type: "int",
    surface: "ui",
    apply: "runtime",
    default: 15,
    min: 11,
    max: 28,
    zh: "字号（像素）",
    en: "Font size (px)",
    hintZh: "配合透明度使用，桌面层会一起跟随。",
    hintEn: "Works with opacity; the desktop layer follows too.",
  },
  {
    id: "opacity",
    group: "look",
    type: "number",
    surface: "ui",
    apply: "runtime",
    default: 0.92,
    min: 0.2,
    max: 1,
    zh: "不透明度",
    en: "Opacity",
    hintZh: "0.2 很淡，1 完全不透明。",
    hintEn: "0.2 is faint, 1 is fully opaque.",
  },
  {
    id: "motion",
    group: "look",
    type: "enum",
    surface: "ui",
    apply: "runtime",
    default: "auto",
    zh: "动效",
    en: "Motion",
    values: [
      { value: "auto", zh: "跟随系统（减少动态时静止淡出）", en: "Follow system (fade when reduced motion)" },
      { value: "off", zh: "直接淡出", en: "Always fade" },
    ],
    hintZh: "系统开启「减少动态效果」时，弹幕改为原地淡入淡出。",
    hintEn: "With reduced motion, lines fade in place instead of flying.",
  },
  {
    id: "pauseOnInput",
    group: "look",
    type: "bool",
    surface: "ui",
    apply: "runtime",
    default: true,
    zh: "打字时暂停",
    en: "Pause while typing",
    hintZh: "在输入框里打字时暂停，停手 3 秒或移开焦点后自动继续；只是点一下输入框不会暂停。",
    hintEn: "Pauses while you type, resumes 3s after you stop or when focus leaves. Clicking an input alone does not pause.",
  },
  {
    id: "desktopDisplays",
    group: "desktop",
    type: "enum",
    surface: "ui",
    apply: "desktop",
    default: "all",
    zh: "覆盖屏幕",
    en: "Displays",
    values: [
      { value: "all", zh: "全部屏幕", en: "All displays" },
      { value: "primary", zh: "仅主屏", en: "Primary only" },
    ],
    hintZh: "每块屏幕开一个透明窗，均置顶、鼠标穿透。修改后自动重启桌面层。",
    hintEn: "One transparent window per display; restart applies changes.",
  },
];

const ITEM_BY_ID = new Map(ITEMS.map((item) => [item.id, item]));

function keyOf(id) {
  return `config.${DOMAIN}.${id}`;
}

function metaRows(db) {
  if (!tableExists(db, "meta")) return [];
  return db.prepare(`SELECT k, v FROM meta WHERE k LIKE 'config.${DOMAIN}.%'`).all();
}

function metaSet(db, key, value) {
  db.prepare("INSERT INTO meta(k, v) VALUES(?, ?) ON CONFLICT(k) DO UPDATE SET v = excluded.v").run(key, String(value));
}

function metaDelete(db, key) {
  db.prepare("DELETE FROM meta WHERE k = ?").run(key);
}

function coerce(item, raw) {
  if (raw === undefined || raw === null) return { value: item.default, warning: "" };
  if (item.type === "bool") {
    if (typeof raw === "boolean") return { value: raw };
    const text = String(raw).toLowerCase();
    if (text === "true" || text === "1" || text === "on") return { value: true };
    if (text === "false" || text === "0" || text === "off") return { value: false };
    return { value: item.default, warning: `${item.id}: 需要布尔值` };
  }
  if (item.type === "int" || item.type === "number") {
    const num = Number(raw);
    if (!Number.isFinite(num)) return { value: item.default, warning: `${item.id}: 需要数字` };
    const min = item.min === undefined ? num : item.min;
    const max = item.max === undefined ? num : item.max;
    const bounded = Math.min(max, Math.max(min, num));
    return { value: item.type === "int" ? Math.round(bounded) : bounded };
  }
  if (item.type === "enum") {
    const allowed = (item.values || []).map((option) => option.value);
    return allowed.includes(raw) ? { value: raw } : { value: item.default, warning: `${item.id}: 取值不在选项内` };
  }
  return { value: String(raw) };
}

export function publicItem(item) {
  return {
    id: item.id,
    group: item.group,
    type: item.type,
    surface: item.surface,
    default: item.default,
    min: item.min,
    max: item.max,
    values: item.values,
    zh: item.zh,
    en: item.en,
    hintZh: item.hintZh,
    hintEn: item.hintEn,
  };
}

export function loadConfig(db) {
  const stored = new Map();
  const warnings = [];
  for (const row of metaRows(db)) {
    const id = row.k.slice(`config.${DOMAIN}.`.length);
    if (!id) continue;
    try {
      stored.set(id, JSON.parse(row.v));
    } catch (error) {
      warnings.push(`${id}: 已存值不是合法 JSON，使用默认值`);
    }
  }
  const values = {};
  const overrides = {};
  for (const item of ITEMS) {
    const raw = stored.get(item.id);
    const got = coerce(item, raw);
    values[item.id] = got.value;
    if (got.warning) warnings.push(got.warning);
    if (raw !== undefined) overrides[item.id] = got.value;
  }
  return { values, overrides, warnings };
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

export function itemById(id) {
  return ITEM_BY_ID.get(id) || null;
}

export function writeConfig(db, patch) {
  if (!patch || typeof patch !== "object") throw new Error("values 必须是对象");
  const changed = [];
  for (const [id, raw] of Object.entries(patch)) {
    const item = ITEM_BY_ID.get(id);
    if (!item) continue;
    const got = coerce(item, raw);
    if (got.warning) throw new Error(got.warning);
    const current = loadConfig(db).values[id];
    if (JSON.stringify(current) === JSON.stringify(got.value)) continue;
    metaSet(db, keyOf(id), JSON.stringify(got.value));
    changed.push(id);
  }
  return { changed, state: configState(db) };
}

export function resetConfig(db, ids) {
  const targets = Array.isArray(ids) && ids.length ? ids : ITEMS.map((item) => item.id);
  for (const id of targets) {
    if (ITEM_BY_ID.has(id)) metaDelete(db, keyOf(id));
  }
  return configState(db);
}
