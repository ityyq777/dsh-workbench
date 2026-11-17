import { idsOf, tagsOn, now, newId, logChange, pageInfo, sizeOf, tableExists } from "../db/db.js";
import { TAG_SOURCE, TAG_SOURCE_OWNER, TAG_SOURCE_TITLE, ensureTagSource, withTagSource } from "../tagging/source.js";
export function validateTags(api, value) {
  const ids = idsOf(value);
  if (!tagsOn(api)) {
    if (ids.length) throw new Error("标签插件未安装或已禁用，无法修改标签");
    return null;
  }
  for (const id of ids)
    if (!api.db.prepare("SELECT 1 FROM tag WHERE id=? AND deleted_at IS NULL").get(id))
      throw new Error("标签不存在：" + id);
  return ids;
}
/**
 * 启动时幂等登记本域来源（`tag_mapping.item_type='storage'`）。
 * 标签域未装或版本过低时静默跳过；重复注册不阻断启动，写入门禁在写入时给出可读错误。
 */
export function ensureStorageTagSource(db, log) {
  if (!tableExists(db, "tag_source")) return { ok: false, skipped: "no_table" };
  try {
    const r = ensureTagSource(db, TAG_SOURCE, TAG_SOURCE_OWNER, TAG_SOURCE_TITLE);
    const hit = db.prepare("SELECT COUNT(*) AS n FROM tag_source WHERE source=? AND deleted_at IS NULL").get(TAG_SOURCE);
    const count = Number((hit && hit.n) || 0);
    if (count !== 1 && typeof log === "function") {
      log("标签来源登记异常（" + TAG_SOURCE + "）：当前 " + count + " 条活跃注册，标签写入会被拒绝");
    }
    return { ok: count === 1, count: count, created: !!(r && r.created) };
  } catch (e) {
    if (typeof log === "function") log("标签来源登记失败：" + String((e && e.message) || e));
    return { ok: false, error: String((e && e.message) || e) };
  }
}

/** 全量替换某条储物记录的标签（写入门禁：来源必须恰好注册一次）。 */
export function replaceTags(api, itemId, ids, origin, ts = now()) {
  if (ids === null) return 0;
  if (!tagsOn(api)) return 0;
  return withTagSource(api.db, TAG_SOURCE, function () {
    return writeTags(api, itemId, ids, origin, ts);
  });
}

function writeTags(api, itemId, ids, origin, ts) {
  const db = api.db;
  const current = db.prepare("SELECT * FROM tag_mapping WHERE item_type='storage' AND item_id=?").all(itemId);
  let removed = 0;
  for (const row of current)
    if (row.deleted_at === null && !ids.includes(row.tag_id)) {
      db.prepare("UPDATE tag_mapping SET deleted_at=?,updated_at=?,rev=rev+1 WHERE id=?").run(ts, ts, row.id);
      logChange(db, "tag_mapping", row.id, "delete", origin, ts);
      removed++;
    }
  for (const tagId of ids) {
    const matches = current.filter((r) => r.tag_id === tagId);
    if (matches.some((r) => r.deleted_at === null)) continue;
    const old = matches.sort((a, b) => b.updated_at - a.updated_at)[0];
    const id = old ? old.id : newId();
    if (old) db.prepare("UPDATE tag_mapping SET deleted_at=NULL,updated_at=?,rev=rev+1 WHERE id=?").run(ts, id);
    else
      db.prepare(
        "INSERT INTO tag_mapping(id,tag_id,item_id,item_type,created_at,updated_at,deleted_at,rev) VALUES(?,?,?,'storage',?,?,NULL,1)",
      ).run(id, tagId, itemId, ts, ts);
    logChange(db, "tag_mapping", id, "upsert", origin, ts);
  }
  return removed;
}
export function searchTags(api, args) {
  const text = String(args.text || "").trim(),
    size = sizeOf(args.pageSize, 10, 100);
  if (!tagsOn(api)) return { ...pageInfo(0, args.pageNumber, size), records: [], text };
  const where = " WHERE deleted_at IS NULL AND instr(lower(name),lower(?))>0";
  const total = Number(api.db.prepare("SELECT COUNT(*) n FROM tag" + where).get(text).n);
  const page = pageInfo(total, args.pageNumber, size);
  const records = api.db
    .prepare("SELECT id,name FROM tag" + where + " ORDER BY updated_at DESC,id LIMIT ? OFFSET ?")
    .all(text, size, page.pageable.offset)
    .map((r) => ({ ...r }));
  return { ...page, records, text };
}
export function tagsByIds(api, args) {
  const ids = idsOf(args.ids).slice(0, 500);
  if (!tagsOn(api) || !ids.length) return { records: [] };
  return {
    records: api.db
      .prepare(
        "SELECT id,name FROM tag WHERE deleted_at IS NULL AND id IN (" +
          ids.map(() => "?").join(",") +
          ") ORDER BY name,id",
      )
      .all(...ids)
      .map((r) => ({ ...r })),
  };
}
