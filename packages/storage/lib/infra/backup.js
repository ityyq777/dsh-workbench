import { fieldsOf, tableExists, tx, logChange } from "../db/db.js";
export const SCHEMA_VERSION = 1;
export function exportStorageData(api) {
  const db = api.db;
  const tagMappings = tableExists(db, "tag_mapping")
    ? db.prepare("SELECT * FROM tag_mapping WHERE item_type='storage' ORDER BY created_at,id").all()
    : [];
  const tagReferences =
    tableExists(db, "tag") && tableExists(db, "tag_mapping")
      ? db
          .prepare(
            "SELECT id,name FROM tag WHERE id IN (SELECT tag_id FROM tag_mapping WHERE item_type='storage') ORDER BY id",
          )
          .all()
      : [];
  return {
    schemaVersion: SCHEMA_VERSION,
    storage: db.prepare("SELECT * FROM storage ORDER BY created_at,id").all(),
    tagMappings,
    tagReferences,
  };
}
function stamp(value, label, nullable = false) {
  if (nullable && value === null) return null;
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 0 || value > 8640000000000000)
    throw new Error(label + " 必须是非负整数时间戳");
  return value;
}
function identity(value, label) {
  if (typeof value !== "string" || !value.trim()) throw new Error(label + " 必填");
  return value;
}
function system(row) {
  return {
    id: identity(row.id, "id"),
    created_at: stamp(row.created_at, "created_at"),
    updated_at: stamp(row.updated_at, "updated_at"),
    deleted_at: stamp(row.deleted_at, "deleted_at", true),
    rev: Math.max(1, stamp(row.rev, "rev")),
  };
}
export function importStorageData(api, raw, options = {}) {
  const db = api.db,
    policy = options.policy || "newest";
  let imported = 0,
    skipped = 0;
  try {
    if (!["newest", "skip", "overwrite"].includes(policy)) throw new Error("未知导入策略");
    const data = JSON.parse(String(raw));
    if (
      !data ||
      data.schemaVersion !== SCHEMA_VERSION ||
      !Array.isArray(data.storage) ||
      !Array.isArray(data.tagMappings)
    )
      throw new Error("物品备份版本或结构不兼容");
    // v1 backups without snapshots remain supported, but only by exact tag id.
    const references = new Map();
    if (data.tagReferences !== undefined) {
      if (!Array.isArray(data.tagReferences)) throw new Error("标签快照必须是数组");
      for (const ref of data.tagReferences) {
        if (!ref || typeof ref !== "object") throw new Error("标签快照无效");
        const id = identity(ref.id, "标签快照 id"),
          name = identity(ref.name, "标签快照 name");
        if (references.has(id)) throw new Error("标签快照 id 重复");
        references.set(id, name);
      }
    }
    const rows = data.storage.map((row) => {
      if (!row || typeof row !== "object") throw new Error("物品行无效");
      const fields = fieldsOf({ ...row, imgList: JSON.parse(row.img_list) });
      return { ...system(row), ...fields };
    });
    const seen = new Set();
    for (const row of rows) {
      if (seen.has(row.id)) throw new Error("备份含重复物品 id");
      seen.add(row.id);
    }
    const mappings = [];
    for (const row of data.tagMappings) {
      if (!row || typeof row !== "object") throw new Error("标签映射无效");
      if (row.item_type !== "storage") {
        skipped++;
        continue;
      }
      mappings.push({
        ...system(row),
        tag_id: identity(row.tag_id, "tag_id"),
        item_id: identity(row.item_id, "item_id"),
        item_type: "storage",
      });
    }
    const mappingIds = new Set(),
      pairs = new Set();
    for (const row of mappings) {
      if (mappingIds.has(row.id)) throw new Error("备份含重复映射 id");
      mappingIds.add(row.id);
      const key = JSON.stringify([row.item_id, row.tag_id]);
      if (row.deleted_at === null && pairs.has(key)) throw new Error("备份含重复有效标签映射");
      if (row.deleted_at === null) pairs.add(key);
    }
    const hasMappings = tableExists(db, "tag_mapping");
    if (mappings.length && (!hasMappings || !tableExists(db, "tag")))
      throw new Error("恢复标签映射需要先安装标签插件并恢复标签备份");
    tx(db, () => {
      function apply(table, row) {
        const old = db.prepare("SELECT * FROM " + table + " WHERE id=?").get(row.id);
        if (
          table === "tag_mapping" &&
          old &&
          (old.item_type !== "storage" || old.item_id !== row.item_id || old.tag_id !== row.tag_id)
        )
          throw new Error("标签映射 id 冲突，拒绝覆盖其他关联");
        if (old && (policy === "skip" || (policy === "newest" && old.updated_at >= row.updated_at))) {
          skipped++;
          return;
        }
        const keys = Object.keys(row);
        db.prepare(
          "INSERT INTO " +
            table +
            " (" +
            keys.join(",") +
            ") VALUES (" +
            keys.map(() => "?").join(",") +
            ") ON CONFLICT(id) DO UPDATE SET " +
            keys
              .filter((k) => k !== "id")
              .map((k) => k + "=excluded." + k)
              .join(","),
        ).run(...keys.map((k) => row[k]));
        logChange(db, table, row.id, row.deleted_at === null ? "upsert" : "delete", "import", row.updated_at);
        imported++;
      }
      for (const row of rows) apply("storage", row);
      for (const row of mappings) {
        const item = db.prepare("SELECT * FROM storage WHERE id=?").get(row.item_id);
        let tag = db.prepare("SELECT * FROM tag WHERE id=?").get(row.tag_id);
        if (data.tagReferences !== undefined) {
          const name = references.get(row.tag_id);
          if (!name) throw new Error("标签映射缺少名称快照");
          // The tags importer merges active names into an existing canonical id.
          if (!tag || tag.name !== name || (row.deleted_at === null && tag.deleted_at !== null))
            tag = db.prepare("SELECT * FROM tag WHERE name=? AND deleted_at IS NULL").get(name);
          if (!tag) throw new Error("标签快照找不到对应标签，请先恢复标签备份");
          row.tag_id = tag.id;
        }
        if (!tag && data.tagReferences === undefined)
          throw new Error("旧版物品备份没有标签名称快照，找不到原 tag_id；请先恢复原标签，或从源库重新导出备份");
        if (!item || !tag) throw new Error("标签映射引用不存在的物品或标签");
        const old = db.prepare("SELECT * FROM tag_mapping WHERE id=?").get(row.id);
        if (old && (old.item_type !== "storage" || old.item_id !== row.item_id || old.tag_id !== row.tag_id))
          throw new Error("标签映射 id 冲突，拒绝覆盖其他关联");
        if (row.deleted_at === null) {
          const linked = db
            .prepare(
              "SELECT * FROM tag_mapping WHERE item_type='storage' AND item_id=? AND tag_id=? AND deleted_at IS NULL AND id<>?",
            )
            .get(row.item_id, row.tag_id, row.id);
          // Canonicalization may collapse two source relationships into one.
          if (linked) {
            skipped++;
            continue;
          }
        }
        apply("tag_mapping", row);
      }
    });
    if (imported) api.emit("storage-changed", { source: "import" });
    return { ok: true, imported, skipped, failed: 0 };
  } catch (error) {
    return { ok: false, imported: 0, skipped, failed: 1, message: String(error.message || error) };
  }
}
