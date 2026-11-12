/** Storage owns its rows; tags owns tag and tag_mapping. */
import { randomUUID } from "node:crypto";
export const newId = randomUUID;
let clock = null,
  last = 0;
export function bindClock(fn) {
  clock = fn;
}
export function now() {
  return clock ? clock() : (last = Math.max(Date.now(), last + 1));
}
export function tableExists(db, name) {
  return !!db.prepare("SELECT 1 FROM sqlite_master WHERE type='table' AND name=?").get(name);
}
export function hasColumn(db, table, column) {
  return db
    .prepare("PRAGMA table_info(" + table + ")")
    .all()
    .some((c) => c.name === column);
}
export function ensureSchema(db) {
  db.exec(
    "CREATE TABLE IF NOT EXISTS storage (id TEXT PRIMARY KEY,name TEXT NOT NULL,brand TEXT NOT NULL DEFAULT '',unit TEXT NOT NULL DEFAULT '',stock TEXT NOT NULL DEFAULT '',location TEXT NOT NULL DEFAULT '',img_list TEXT NOT NULL DEFAULT '[]',remark TEXT NOT NULL DEFAULT '',created_at INTEGER NOT NULL,updated_at INTEGER NOT NULL,deleted_at INTEGER,rev INTEGER NOT NULL DEFAULT 1); CREATE INDEX IF NOT EXISTS idx_storage_updated ON storage(updated_at); CREATE INDEX IF NOT EXISTS idx_storage_name ON storage(name);",
  );
  // 1.5.1 起新增 location：老库的 CREATE TABLE IF NOT EXISTS 不会补列，用 PRAGMA 判列后幂等 ALTER。
  if (!hasColumn(db, "storage", "location")) {
    db.exec("ALTER TABLE storage ADD COLUMN location TEXT NOT NULL DEFAULT ''");
  }
}
export function tx(db, fn) {
  db.exec("BEGIN IMMEDIATE");
  try {
    const result = fn();
    db.exec("COMMIT");
    return result;
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}
export function logChange(db, table, id, op, origin, ts) {
  if (origin === "sync") return;
  const row = db.prepare("SELECT * FROM " + table + " WHERE id=?").get(id);
  db.prepare("INSERT INTO sync_change_log(table_name,row_id,op,payload,origin,updated_at) VALUES(?,?,?,?,?,?)").run(
    table,
    id,
    op,
    JSON.stringify(row),
    origin || "ui",
    ts,
  );
}
export function tagsOn(api) {
  const has =
    typeof api.hasDomain === "function"
      ? api.hasDomain("wb-addon-tags")
      : typeof api.hasAddon === "function" && api.hasAddon("wb-addon-tags");
  return !!has && tableExists(api.db, "tag") && tableExists(api.db, "tag_mapping");
}
export function idsOf(value) {
  if (value === undefined) return [];
  if (!Array.isArray(value)) throw new Error("标签 id 需要数组");
  return [...new Set(value.map((v) => String(v).trim()).filter(Boolean))];
}
export function imagesOf(value) {
  if (!Array.isArray(value) || value.length > 50) throw new Error("imgList 需要最多 50 个 HTTP(S) 图片 URL");
  return value.map((v) => {
    if (typeof v !== "string") throw new Error("图片 URL 必须是字符串");
    const text = v.trim();
    let u;
    try {
      u = new URL(text);
    } catch {
      throw new Error("图片 URL 无效");
    }
    if (!["http:", "https:"].includes(u.protocol) || u.username || u.password)
      throw new Error("图片只支持 HTTP(S) URL");
    return text;
  });
}
export function fieldsOf(args, old = {}) {
  const out = {};
  const input = { name: args.name, brand: args.brand, unit: args.unit, stock: args.stock, location: args.location, remark: args.remark };
  for (const key of ["name", "brand", "unit", "stock", "location", "remark"]) {
    const v = input[key] === undefined ? old[key] || "" : input[key];
    if (typeof v !== "string") throw new Error(key + " 必须是字符串");
    out[key] = v.trim();
    if (out[key].length > (key === "remark" ? 10000 : 200)) throw new Error(key + " 过长");
  }
  if (!out.name) throw new Error("物品名称不能为空");
  out.img_list = JSON.stringify(imagesOf(args.imgList === undefined ? JSON.parse(old.img_list || "[]") : args.imgList));
  return out;
}
export function rowStorage(api, row) {
  if (!row) return null;
  const tags = tagsOn(api)
    ? api.db
        .prepare(
          "SELECT t.id,t.name FROM tag t JOIN tag_mapping m ON m.tag_id=t.id WHERE m.item_type='storage' AND m.item_id=? AND m.deleted_at IS NULL AND t.deleted_at IS NULL ORDER BY t.name,t.id",
        )
        .all(row.id)
        .map((t) => ({ ...t }))
    : [];
  return {
    id: row.id,
    name: row.name,
    brand: row.brand,
    unit: row.unit,
    stock: row.stock,
    location: row.location || "",
    imgList: JSON.parse(row.img_list),
    remark: row.remark,
    tags,
    tagIds: tags.map((t) => t.id),
    createTime: new Date(row.created_at).toISOString(),
    updateTime: new Date(row.updated_at).toISOString(),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
export function pageInfo(total, page, size) {
  const pages = Math.ceil(total / size),
    current = Math.min(Math.max(1, Math.floor(Number(page) || 1)), Math.max(1, pages));
  return {
    total,
    current,
    size,
    pages,
    pageable: { pageNumber: current, pageSize: size, offset: (current - 1) * size },
  };
}
export function sizeOf(value, fallback = 16, max = 200) {
  const n = Number(value);
  return Number.isFinite(n) && n >= 1 ? Math.min(max, Math.floor(n)) : fallback;
}
