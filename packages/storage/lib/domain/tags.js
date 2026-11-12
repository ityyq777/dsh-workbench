import { idsOf, tagsOn, now, newId, logChange, pageInfo, sizeOf } from "../db/db.js";
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
export function replaceTags(api, itemId, ids, origin, ts = now()) {
  if (ids === null) return 0;
  const db = api.db;
  if (!tagsOn(api)) return 0;
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
