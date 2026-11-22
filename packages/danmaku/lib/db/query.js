/**
 * 弹幕表的数据访问：校验、去重、软删与排序。
 *
 * 所有写操作都在调用方（action）里包事务；这里只做单条 SQL 与行转换，
 * 方便被调度器和数据页共用。
 */

import { newId, now, rowDanmaku } from "./db.js";

export const MAX_BODY = 100;
export const TONES = ["normal", "accent", "success", "warn", "danger"];

/** 清掉控制字符、合并空白，按码点截断到 MAX_BODY，避免代理对被截断。 */
export function sanitizeBody(raw) {
  const text = String(raw == null ? "" : raw)
    .replace(/[\u0000-\u001f\u007f]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const chars = Array.from(text);
  if (chars.length <= MAX_BODY) return text;
  return chars.slice(0, MAX_BODY).join("").trim();
}

export function normalizeTone(raw) {
  const tone = String(raw == null ? "" : raw).trim();
  if (!tone) return "normal";
  if (TONES.indexOf(tone) < 0) throw new Error("未知的弹幕颜色：" + tone);
  return tone;
}

export function listAll(db, options) {
  const enabledOnly = !!(options && options.enabledOnly);
  const where = enabledOnly ? "deleted_at IS NULL AND enabled = 1" : "deleted_at IS NULL";
  return db
    .prepare("SELECT * FROM danmaku WHERE " + where + " ORDER BY sort_order ASC, created_at ASC")
    .all()
    .map(rowDanmaku);
}

export function getById(db, id) {
  return rowDanmaku(db.prepare("SELECT * FROM danmaku WHERE id = ?").get(String(id || "")));
}

export function findLiveByBody(db, body) {
  return rowDanmaku(
    db.prepare("SELECT * FROM danmaku WHERE body = ? AND deleted_at IS NULL LIMIT 1").get(String(body || "")),
  );
}

export function stats(db) {
  const row = db
    .prepare(
      "SELECT COUNT(*) AS total, SUM(CASE WHEN deleted_at IS NULL AND enabled = 1 THEN 1 ELSE 0 END) AS enabled, " +
        "SUM(CASE WHEN deleted_at IS NULL AND enabled = 0 THEN 1 ELSE 0 END) AS paused, " +
        "SUM(CASE WHEN deleted_at IS NOT NULL THEN 1 ELSE 0 END) AS deleted FROM danmaku",
    )
    .get();
  return {
    total: Number(row && row.total) || 0,
    enabled: Number(row && row.enabled) || 0,
    paused: Number(row && row.paused) || 0,
    deleted: Number(row && row.deleted) || 0,
  };
}

function nextSortOrder(db) {
  const row = db.prepare("SELECT COALESCE(MAX(sort_order), 0) AS n FROM danmaku").get();
  return (Number(row && row.n) || 0) + 10;
}

export function createItem(db, input) {
  const body = sanitizeBody(input && input.body);
  if (!body) throw new Error("弹幕内容不能为空");
  const tone = normalizeTone(input && input.tone);
  const existing = findLiveByBody(db, body);
  if (existing) return { item: existing, duplicated: true };
  const ts = now();
  const row = {
    id: newId("dm"),
    body,
    tone,
    enabled: !input || input.enabled !== false,
    sortOrder: nextSortOrder(db),
  };
  db.prepare(
    "INSERT INTO danmaku (id, body, tone, enabled, sort_order, created_at, updated_at, deleted_at, rev) " +
      "VALUES (?, ?, ?, ?, ?, ?, ?, NULL, 1)",
  ).run(row.id, row.body, row.tone, row.enabled ? 1 : 0, row.sortOrder, ts, ts);
  return { item: getById(db, row.id), duplicated: false };
}

export function updateItem(db, input) {
  const id = String((input && input.id) || "").trim();
  if (!id) throw new Error("缺少弹幕 id");
  const current = getById(db, id);
  if (!current || current.deletedAt) throw new Error("弹幕不存在或已删除：" + id);
  const patch = {};
  if (input.body !== undefined) {
    const body = sanitizeBody(input.body);
    if (!body) throw new Error("弹幕内容不能为空");
    const other = findLiveByBody(db, body);
    if (other && other.id !== id) throw new Error("已存在相同内容的弹幕：" + body);
    patch.body = body;
  }
  if (input.tone !== undefined) patch.tone = normalizeTone(input.tone);
  if (input.enabled !== undefined) patch.enabled = input.enabled !== false;
  const keys = Object.keys(patch);
  if (!keys.length) return { item: current, changed: false };
  const sql = keys.map((key) => key + " = ?").join(", ");
  const values = keys.map((key) => (typeof patch[key] === "boolean" ? (patch[key] ? 1 : 0) : patch[key]));
  db.prepare("UPDATE danmaku SET " + sql + ", updated_at = ?, rev = rev + 1 WHERE id = ?").run(
    ...values,
    now(),
    id,
  );
  return { item: getById(db, id), changed: true };
}

export function removeItem(db, id) {
  const current = getById(db, id);
  if (!current || current.deletedAt) return { removed: false };
  db.prepare("UPDATE danmaku SET deleted_at = ?, updated_at = ?, rev = rev + 1 WHERE id = ?").run(
    now(),
    now(),
    current.id,
  );
  return { removed: true, id: current.id, body: current.body };
}

/** ids 必须是当前全部未删除弹幕的一个完整排列，避免调序把别人漏掉。 */
export function reorderItems(db, ids) {
  const live = listAll(db);
  const want = (ids || []).map((id) => String(id || "").trim()).filter(Boolean);
  const liveIds = live.map((item) => item.id);
  if (want.length !== liveIds.length || new Set(want).size !== want.length) {
    throw new Error("排序列表必须包含全部 " + liveIds.length + " 条弹幕且不能重复");
  }
  for (const id of want) {
    if (liveIds.indexOf(id) < 0) throw new Error("排序列表里有不属于当前弹幕库的 id：" + id);
  }
  const ts = now();
  const update = db.prepare("UPDATE danmaku SET sort_order = ?, updated_at = ?, rev = rev + 1 WHERE id = ?");
  want.forEach((id, index) => update.run((index + 1) * 10, ts, id));
  return listAll(db);
}

export function liveCount(db) {
  const row = db.prepare("SELECT COUNT(*) AS n FROM danmaku WHERE deleted_at IS NULL").get();
  return Number(row && row.n) || 0;
}
