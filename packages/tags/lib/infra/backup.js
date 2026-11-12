/**
 * 标签模块的备份导出/导入。
 *
 * tag 本体归标签模块；tag_mapping 中 site/storage 的行归各业务模块，
 * 这里排除掉，避免同一映射在两个模块的备份里重复出现。
 */

import { MAPPING_TABLE, TAG_TABLE, logChange, tableExists } from "../db/db.js";

const SCHEMA_VERSION = 1;

function asText(value, fallback) {
  if (value === undefined || value === null) return fallback === undefined ? "" : fallback;
  return String(value);
}

function asInt(value, fallback) {
  const n = Number(value);
  return Number.isFinite(n) ? Math.trunc(n) : fallback;
}

function tagValues(row) {
  const id = asText(row && row.id).trim();
  if (!id) throw new Error("tag.id 为空");
  const name = asText(row.name).trim();
  if (!name) throw new Error("tag.name 为空：" + id);
  const updated = asInt(row.updated_at, Date.now());
  return [
    id,
    name,
    asInt(row.created_at, updated),
    updated,
    row.deleted_at === null || row.deleted_at === undefined ? null : asInt(row.deleted_at, updated),
    Math.max(1, asInt(row.rev, 1)),
  ];
}

function mappingValues(row) {
  const id = asText(row && row.id).trim();
  const tagId = asText(row && row.tag_id).trim();
  const itemId = asText(row && row.item_id).trim();
  const itemType = asText(row && row.item_type).trim();
  if (!id || !tagId || !itemId || !itemType) throw new Error("tag_mapping 字段不完整：" + (id || "?"));
  const updated = asInt(row.updated_at, Date.now());
  return [
    id,
    tagId,
    itemId,
    itemType,
    asInt(row.created_at, updated),
    updated,
    row.deleted_at === null || row.deleted_at === undefined ? null : asInt(row.deleted_at, updated),
    Math.max(1, asInt(row.rev, 1)),
  ];
}

export function exportTagsData(api) {
  const db = api.db;
  const tags = tableExists(db, TAG_TABLE) ? db.prepare("SELECT * FROM tag ORDER BY created_at ASC, id ASC").all() : [];
  const mappings = tableExists(db, MAPPING_TABLE)
    ? db
        .prepare("SELECT * FROM tag_mapping WHERE item_type NOT IN ('site','storage') ORDER BY created_at ASC, id ASC")
        .all()
    : [];
  return { schemaVersion: SCHEMA_VERSION, tags, mappings };
}

function policyOf(options) {
  const p = options && options.policy;
  return p === "skip" || p === "overwrite" ? p : "newest";
}

/**
 * 标签名唯一化后的导入规范化：备份里可能带着「不同 id、同一个名字」的标签。
 * 以库里已有（否则备份中 created_at 最早）的同名标签为准，把重复标签的映射改挂
 * 到保留者上、跳过该标签行；否则唯一索引会让整条导入失败。软删行不占名字，原样保留。
 */
function canonicalizeTagNames(db, data) {
  const keep = new Map();
  if (tableExists(db, TAG_TABLE)) {
    for (const row of db
      .prepare("SELECT id,name FROM tag WHERE deleted_at IS NULL ORDER BY created_at ASC, id ASC")
      .all()) {
      const name = String(row.name);
      if (!keep.has(name)) keep.set(name, String(row.id));
    }
  }
  const ordered = data.tags.slice().sort(function (a, b) {
    return Number(a.created_at || 0) - Number(b.created_at || 0) || String(a.id).localeCompare(String(b.id));
  });
  const keptRows = [];
  const remap = new Map();
  let mergedTags = 0;
  for (const row of ordered) {
    const id = asText(row && row.id).trim();
    const name = asText(row && row.name).trim();
    const deleted = row.deleted_at !== null && row.deleted_at !== undefined;
    if (!id || !name || deleted) {
      keptRows.push(row);
      continue;
    }
    const keeper = keep.get(name);
    if (keeper && keeper !== id) {
      remap.set(id, keeper);
      mergedTags += 1;
      continue;
    }
    keep.set(name, id);
    keptRows.push(row);
  }

  const seen = new Set();
  if (tableExists(db, MAPPING_TABLE)) {
    for (const m of db.prepare("SELECT tag_id,item_id,item_type FROM tag_mapping WHERE deleted_at IS NULL").all()) {
      seen.add([String(m.tag_id), String(m.item_id), String(m.item_type)].join("\u0001"));
    }
  }
  const mappings = [];
  let mergedMappings = 0;
  for (const row of data.mappings) {
    const rawTagId = asText(row && row.tag_id).trim();
    if (remap.has(rawTagId)) row.tag_id = remap.get(rawTagId);
    const deleted = row.deleted_at !== null && row.deleted_at !== undefined;
    if (!deleted) {
      const key = [asText(row.tag_id).trim(), asText(row.item_id).trim(), asText(row.item_type).trim()].join("\u0001");
      if (seen.has(key)) {
        mergedMappings += 1;
        continue;
      }
      seen.add(key);
    }
    mappings.push(row);
  }
  return { tags: keptRows, mappings: mappings, mergedTags: mergedTags, mergedMappings: mergedMappings };
}

export function importTagsData(api, raw, options) {
  const db = api.db;
  const policy = policyOf(options);
  let data;
  try {
    data = JSON.parse(String(raw || "{}"));
  } catch {
    return { ok: false, imported: 0, skipped: 0, failed: 0, message: "标签备份不是有效 JSON" };
  }
  if (!data || Number(data.schemaVersion) !== SCHEMA_VERSION) {
    return { ok: false, imported: 0, skipped: 0, failed: 0, message: "标签备份版本不兼容：需要 " + SCHEMA_VERSION };
  }
  if (!Array.isArray(data.tags) || !Array.isArray(data.mappings)) {
    return { ok: false, imported: 0, skipped: 0, failed: 0, message: "标签备份结构不完整" };
  }
  const normalized = canonicalizeTagNames(db, data);
  data = Object.assign({}, data, { tags: normalized.tags, mappings: normalized.mappings });

  const tagUpsert = db.prepare(
    "INSERT INTO tag(id,name,created_at,updated_at,deleted_at,rev) VALUES(?,?,?,?,?,?) " +
      "ON CONFLICT(id) DO UPDATE SET name=excluded.name,created_at=excluded.created_at,updated_at=excluded.updated_at,deleted_at=excluded.deleted_at,rev=excluded.rev " +
      "WHERE ? = 1 OR excluded.updated_at > tag.updated_at",
  );
  const mappingUpsert = db.prepare(
    "INSERT INTO tag_mapping(id,tag_id,item_id,item_type,created_at,updated_at,deleted_at,rev) VALUES(?,?,?,?,?,?,?,?) " +
      "ON CONFLICT(id) DO UPDATE SET tag_id=excluded.tag_id,item_id=excluded.item_id,item_type=excluded.item_type,created_at=excluded.created_at,updated_at=excluded.updated_at,deleted_at=excluded.deleted_at,rev=excluded.rev " +
      "WHERE ? = 1 OR excluded.updated_at > tag_mapping.updated_at",
  );

  let imported = 0;
  // 重名标签/映射在规范化阶段就被合并掉了，计入 skipped 便于对账。
  let skipped = normalized.mergedTags + normalized.mergedMappings;
  let failed = 0;
  const errors = [];
  const tagExists = db.prepare("SELECT 1 FROM tag WHERE id = ?");
  const mappingExists = db.prepare("SELECT 1 FROM tag_mapping WHERE id = ?");
  const force = policy === "overwrite" ? 1 : 0;

  for (const row of data.tags) {
    try {
      const values = tagValues(row);
      if (policy === "skip" && tagExists.get(values[0])) {
        skipped += 1;
        continue;
      }
      const result = tagUpsert.run(...values, force);
      if (result.changes > 0) {
        imported += 1;
        logChange(db, TAG_TABLE, values[0], "upsert", row, "import", values[3]);
      } else {
        skipped += 1;
      }
    } catch (e) {
      failed += 1;
      if (errors.length < 5) errors.push(String((e && e.message) || e));
    }
  }
  for (const row of data.mappings) {
    try {
      if (["site", "storage"].includes(String(row.item_type))) {
        skipped += 1;
        continue;
      }
      const values = mappingValues(row);
      if (policy === "skip" && mappingExists.get(values[0])) {
        skipped += 1;
        continue;
      }
      const result = mappingUpsert.run(...values, force);
      if (result.changes > 0) {
        imported += 1;
        logChange(db, MAPPING_TABLE, values[0], "upsert", row, "import", values[5]);
      } else {
        skipped += 1;
      }
    } catch (e) {
      failed += 1;
      if (errors.length < 5) errors.push(String((e && e.message) || e));
    }
  }

  if (imported > 0) api.emit("tags-changed", { source: "import" });
  return {
    ok: failed === 0,
    imported,
    skipped,
    failed,
    merged: normalized.mergedTags,
    message: failed ? "部分标签行导入失败：" + errors.join("；") : undefined,
  };
}
