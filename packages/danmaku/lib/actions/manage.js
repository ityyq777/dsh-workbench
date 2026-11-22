"use strict";

import { findLive, liveRows, mapRow, newId, now, tx } from "../db/db.js";

export const TONES = ["normal", "accent", "success", "warn", "danger"];
export const BANDS = ["", "full", "upper", "lower"];
export const FAMILIES = ["", "rounded", "serif", "mono"];
export const WEIGHTS = [400, 500, 600, 700];
export const MAX_BODY = 100;
const STEP = 10;

function fail(message) {
  throw new Error(message);
}

function normalizeBody(raw) {
  if (typeof raw !== "string") fail("body 需要字符串");
  const text = raw.replace(/\s+/g, " ").trim();
  if (!text) fail("body 不能为空");
  if (Array.from(text).length > MAX_BODY) fail(`body 不能超过 ${MAX_BODY} 个字符`);
  return text;
}

function readRange(raw, field, min, max, fallback, integer) {
  if (raw === undefined) return fallback;
  if (raw === null || raw === "") return null;
  const n = Number(raw);
  if (!Number.isFinite(n)) fail(`${field} 需要数字`);
  if (integer ? !Number.isInteger(n) : false) fail(`${field} 需要整数`);
  if (n < min || n > max) fail(`${field} 需在 ${min}–${max} 之间`);
  return n;
}

function readChoice(raw, field, allowed, fallback) {
  if (raw === undefined) return fallback;
  const text = raw === null ? "" : String(raw);
  if (allowed.indexOf(text) < 0) fail(`${field} 只接受：${allowed.filter(Boolean).join(" / ") || "空"}`);
  return text;
}

function readPrefix(raw, fallback) {
  if (raw === undefined) return fallback;
  if (raw === null) return "";
  if (typeof raw !== "string") fail("prefix 需要字符串");
  const text = raw.replace(/[\r\n\t]/g, " ").trim();
  if (Array.from(text).length > 8) fail("prefix 不能超过 8 个字符");
  return text;
}

function readStyle(args, item) {
  const base = item || {};
  return {
    fontSize: readRange(args.fontSize, "fontSize", 10, 48, base.fontSize === undefined ? null : base.fontSize, true),
    speed: readRange(args.speed, "speed", 30, 800, base.speed === undefined ? null : base.speed, true),
    opacity: readRange(args.opacity, "opacity", 0.15, 1, base.opacity === undefined ? null : base.opacity, false),
    fontWeight: readRange(args.fontWeight, "fontWeight", 300, 800, base.fontWeight === undefined ? null : base.fontWeight, true),
    fontFamily: readChoice(args.fontFamily, "fontFamily", FAMILIES, base.fontFamily === undefined ? "" : base.fontFamily),
    band: readChoice(args.band, "band", BANDS, base.band === undefined ? "" : base.band),
    prefix: readPrefix(args.prefix, base.prefix === undefined ? "" : base.prefix),
    chance: readRange(args.chance, "chance", 1, 5, base.chance === undefined ? 1 : base.chance, true) || 1,
  };
}

function readCard(raw, fallback) {
  if (raw === undefined || raw === null) return typeof fallback === "boolean" ? fallback : true;
  if (typeof raw !== "boolean") fail("card 需要布尔值");
  return raw;
}

function readTone(raw, fallback) {
  if (raw === undefined || raw === null) return fallback || "normal";
  if (typeof raw !== "string" || TONES.indexOf(raw) < 0) fail("tone 只接受：" + TONES.join(" / "));
  return raw;
}

export function listItems(db) {
  const rows = liveRows(db).map(mapRow);
  const paused = rows.filter((item) => !item.enabled).length;
  return { items: rows, total: rows.length, paused, enabled: rows.length - paused };
}

function nextOrder(db) {
  const row = db.prepare("SELECT MAX(sort_order) AS m FROM danmaku WHERE deleted_at IS NULL").get();
  const max = Number(row && row.m);
  return (Number.isFinite(max) ? max : 0) + STEP;
}

function assertUnique(db, body, exceptId) {
  const row = db.prepare("SELECT id FROM danmaku WHERE lower(body) = lower(?) AND deleted_at IS NULL").get(body);
  if (row && row.id !== exceptId) fail("这条弹幕已在库里，无需重复添加");
}

export function createItem(db, args) {
  const body = normalizeBody(args.body);
  const tone = readTone(args.tone, "normal");
  const card = readCard(args.card, true);
  const style = readStyle(args, null);
  assertUnique(db, body, "");
  const ts = now();
  const id = newId("dm");
  const order = nextOrder(db);
  db.prepare(
    `INSERT INTO danmaku(id, body, tone, enabled, card, font_size, speed, opacity, font_weight, font_family, band, prefix, chance, sort_order, created_at, updated_at, rev)
     VALUES(?, ?, ?, 1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
  ).run(
    id,
    body,
    tone,
    card ? 1 : 0,
    style.fontSize,
    style.speed,
    style.opacity,
    style.fontWeight,
    style.fontFamily,
    style.band,
    style.prefix,
    style.chance,
    order,
    ts,
    ts,
  );
  return { item: findLive(db, id) };
}

export function updateItem(db, args) {
  const id = String(args.id || "");
  if (!id) fail("id 必填");
  const item = findLive(db, id);
  if (!item) fail("弹幕不存在或已删除");
  const fields = [];
  const params = [];
  if (args.body !== undefined) {
    const body = normalizeBody(args.body);
    assertUnique(db, body, id);
    fields.push("body = ?");
    params.push(body);
  }
  if (args.tone !== undefined) {
    fields.push("tone = ?");
    params.push(readTone(args.tone, item.tone));
  }
  if (args.enabled !== undefined) {
    if (typeof args.enabled !== "boolean") fail("enabled 需要布尔值");
    fields.push("enabled = ?");
    params.push(args.enabled ? 1 : 0);
  }
  if (args.card !== undefined) {
    fields.push("card = ?");
    params.push(readCard(args.card, item.card) ? 1 : 0);
  }
  const styleFields = [
    ["font_size", "fontSize"],
    ["speed", "speed"],
    ["opacity", "opacity"],
    ["font_weight", "fontWeight"],
    ["font_family", "fontFamily"],
    ["band", "band"],
    ["prefix", "prefix"],
    ["chance", "chance"],
  ];
  const style = readStyle(args, item);
  for (const [column, key] of styleFields) {
    if (args[key] === undefined) continue;
    fields.push(column + " = ?");
    params.push(style[key] === "" ? null : style[key]);
  }
  if (!fields.length) return { item };
  fields.push("updated_at = ?", "rev = rev + 1");
  params.push(now());
  params.push(id);
  db.prepare("UPDATE danmaku SET " + fields.join(", ") + " WHERE id = ? AND deleted_at IS NULL").run(...params);
  return { item: findLive(db, id) };
}

export function removeItem(db, args) {
  const id = String(args.id || "");
  if (!id) fail("id 必填");
  const item = findLive(db, id);
  if (!item) fail("弹幕不存在或已删除");
  const ts = now();
  db.prepare("UPDATE danmaku SET deleted_at = ?, updated_at = ?, rev = rev + 1 WHERE id = ?").run(ts, ts, id);
  return { id };
}

export function reorderItems(db, args) {
  const ids = Array.isArray(args.ids) ? args.ids.map((id) => String(id)) : [];
  if (!ids.length) fail("ids 必填且不能为空");
  const known = new Map(liveRows(db).map((row) => [row.id, row]));
  const ts = now();
  tx(db, () => {
    ids.forEach((id, index) => {
      if (!known.has(id)) return;
      db.prepare("UPDATE danmaku SET sort_order = ?, updated_at = ?, rev = rev + 1 WHERE id = ?").run(index * STEP, ts, id);
    });
  });
  return listItems(db);
}

export function registerManageActions(api, deps) {
  const db = api.db;

  api.action("danmaku.list", {
    description: "弹幕库列表：按 sort_order 返回未删除的弹幕，以及启用/停用计数",
    input: { type: "object", properties: {}, additionalProperties: false },
    execute: () => listItems(db),
    render: (r) => `弹幕库 ${r.total} 条（启用 ${r.enabled}）`,
  });

  api.action("danmaku.create", {
    description: "新增一条弹幕；同一内容（忽略大小写）在库中唯一，重复会报错",
    input: {
      type: "object",
      properties: {
        body: { type: "string", description: "弹幕内容，空白折叠，最长 100 字" },
        tone: { type: "string", enum: TONES, description: "颜色主题，默认 normal" },
        card: { type: "boolean", description: "是否带卡片背景，默认 true；false 时只显示文字" },
        fontSize: { type: "integer", minimum: 10, maximum: 48, description: "字号像素；省略或 null = 跟随全局" },
        speed: { type: "integer", minimum: 30, maximum: 800, description: "滚动速度 px/s；省略或 null = 跟随全局" },
        opacity: { type: "number", minimum: 0.15, maximum: 1, description: "不透明度；省略或 null = 跟随全局" },
        fontWeight: { type: "integer", enum: WEIGHTS, description: "字重 400/500/600/700；省略 = 跟随全局" },
        fontFamily: { type: "string", enum: FAMILIES, description: "字体：空 = 系统，rounded = 圆体，serif = 衬线，mono = 等宽" },
        band: { type: "string", enum: BANDS, description: "泳道区域：空 = 跟随全局，full/upper/lower" },
        prefix: { type: "string", description: "可选前缀（如 emoji），最多 8 字" },
        chance: { type: "integer", minimum: 1, maximum: 5, description: "轮播权重 1–5，越大越常出现" },
      },
      required: ["body"],
      additionalProperties: false,
    },
    execute: (args) => {
      const out = createItem(db, args);
      deps.changed("create", out.item.id);
      return out;
    },
    render: (r) => `已添加弹幕：${r.item.body}`,
  });

  api.action("danmaku.update", {
    description: "修改一条弹幕的内容、外观（颜色/背景/字号/字重/字体/透明度）、动效（速度/泳道）、轮播（前缀/权重）或启停；只传要改的字段",
    input: {
      type: "object",
      properties: {
        id: { type: "string", description: "弹幕 id" },
        body: { type: "string", description: "新内容，最长 100 字" },
        tone: { type: "string", enum: TONES, description: "颜色主题" },
        card: { type: "boolean", description: "是否带卡片背景" },
        enabled: { type: "boolean", description: "是否参与轮播" },
        fontSize: { type: "integer", minimum: 10, maximum: 48, description: "字号像素；null = 跟随全局" },
        speed: { type: "integer", minimum: 30, maximum: 800, description: "滚动速度 px/s；null = 跟随全局" },
        opacity: { type: "number", minimum: 0.15, maximum: 1, description: "不透明度；null = 跟随全局" },
        fontWeight: { type: "integer", enum: WEIGHTS, description: "字重；省略 = 不变" },
        fontFamily: { type: "string", enum: FAMILIES, description: "字体，空 = 系统" },
        band: { type: "string", enum: BANDS, description: "泳道区域，空 = 跟随全局" },
        prefix: { type: "string", description: "前缀，最多 8 字" },
        chance: { type: "integer", minimum: 1, maximum: 5, description: "轮播权重" },
      },
      required: ["id"],
      additionalProperties: false,
    },
    execute: (args) => {
      const out = updateItem(db, args);
      deps.changed("update", out.item.id);
      return out;
    },
    render: (r) => `已保存弹幕：${r.item.body}`,
  });

  api.action("danmaku.remove", {
    description: "软删除一条弹幕；删除后不再参与轮播，相同内容之后可以重新添加",
    input: {
      type: "object",
      properties: { id: { type: "string", description: "弹幕 id" } },
      required: ["id"],
      additionalProperties: false,
    },
    execute: (args) => {
      const out = removeItem(db, args);
      deps.changed("remove", out.id);
      return out;
    },
    render: (r) => `已删除弹幕 ${r.id}`,
  });

  api.action("danmaku.reorder", {
    description: "按传入的 id 顺序重排弹幕库（决定「按列表顺序」轮播的次序）",
    input: {
      type: "object",
      properties: {
        ids: { type: "array", items: { type: "string" }, description: "完整的目标顺序；未知 id 会被忽略" },
      },
      required: ["ids"],
      additionalProperties: false,
    },
    execute: (args) => {
      const out = reorderItems(db, args);
      deps.changed("reorder", "");
      return out;
    },
    render: (r) => `弹幕顺序已更新，共 ${r.total} 条`,
  });

  api.action("danmaku.preview", {
    description: "立刻让一条弹幕（默认随机一条启用中的）在界面层和桌面层各预览一次，不改库",
    input: {
      type: "object",
      properties: { id: { type: "string", description: "要预览的弹幕 id；省略则随机一条" } },
      additionalProperties: false,
    },
    execute: (args) => {
      const out = deps.player.preview(args.id ? String(args.id) : "");
      if (!out) fail("没有启用中的弹幕可预览");
      return out;
    },
    render: (r) => `已预览：${r.body}`,
  });
}
