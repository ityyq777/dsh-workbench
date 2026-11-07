/**
 * 站点模块的备份导出/导入。
 *
 * 站点本体、目录树、站点-目录映射，以及 item_type='site' 的标签映射归本模块。
 * 标签本体归标签模块；这里只引用已有 tag.id。
 */

import {
  NODE_MAPPING_TABLE,
  NODE_TABLE,
  SITE_TABLE,
  logChange,
  tableExists,
} from "./db.js";

const SCHEMA_VERSION = 1;
const TAG_MAPPING_TABLE = "tag_mapping";

function asText(value, fallback) {
  if (value === undefined || value === null) return fallback === undefined ? "" : fallback;
  return String(value);
}

function asInt(value, fallback) {
  const n = Number(value);
  return Number.isFinite(n) ? Math.trunc(n) : fallback;
}

function siteValues(row) {
  const id = asText(row && row.id).trim();
  if (!id) throw new Error("site.id 为空");
  const updated = asInt(row.updated_at, Date.now());
  const links = row.site_link === undefined || row.site_link === null ? null : String(row.site_link);
  return [
    id,
    asText(row.site_name, "未命名"),
    asText(row.description),
    asInt(row.bindable, 1) === 0 ? 0 : 1,
    links,
    asInt(row.created_at, updated),
    updated,
    row.deleted_at === null || row.deleted_at === undefined ? null : asInt(row.deleted_at, updated),
    Math.max(1, asInt(row.rev, 1)),
  ];
}

function nodeValues(row) {
  const id = asText(row && row.id).trim();
  if (!id) throw new Error("site_node.id 为空");
  const updated = asInt(row.updated_at, Date.now());
  return [
    id,
    asText(row.name, "未命名"),
    asText(row.parent_id, "0"),
    asText(row.path),
    asInt(row.sort, 0),
    asInt(row.depth, 0),
    asInt(row.created_at, updated),
    updated,
    row.deleted_at === null || row.deleted_at === undefined ? null : asInt(row.deleted_at, updated),
    Math.max(1, asInt(row.rev, 1)),
  ];
}

function nodeMappingValues(row) {
  const id = asText(row && row.id).trim();
  const siteId = asText(row && row.site_id).trim();
  const nodeId = asText(row && row.node_id).trim();
  if (!id || !siteId || !nodeId) throw new Error("site_node_mapping 字段不完整：" + (id || "?"));
  const updated = asInt(row.updated_at, Date.now());
  return [
    id,
    siteId,
    nodeId,
    asInt(row.created_at, updated),
    updated,
    row.deleted_at === null || row.deleted_at === undefined ? null : asInt(row.deleted_at, updated),
    Math.max(1, asInt(row.rev, 1)),
  ];
}

function tagMappingValues(row) {
  const id = asText(row && row.id).trim();
  const tagId = asText(row && row.tag_id).trim();
  const itemId = asText(row && row.item_id).trim();
  if (!id || !tagId || !itemId) throw new Error("tag_mapping 字段不完整：" + (id || "?"));
  const updated = asInt(row.updated_at, Date.now());
  return [
    id,
    tagId,
    itemId,
    "site",
    asInt(row.created_at, updated),
    updated,
    row.deleted_at === null || row.deleted_at === undefined ? null : asInt(row.deleted_at, updated),
    Math.max(1, asInt(row.rev, 1)),
  ];
}

export function exportSitesData(api) {
  const db = api.db;
  const hasTagMapping = tableExists(db, TAG_MAPPING_TABLE);
  return {
    schemaVersion: SCHEMA_VERSION,
    sites: tableExists(db, SITE_TABLE) ? db.prepare("SELECT * FROM site ORDER BY created_at ASC, id ASC").all() : [],
    nodes: tableExists(db, NODE_TABLE) ? db.prepare("SELECT * FROM site_node ORDER BY depth ASC, sort ASC, id ASC").all() : [],
    nodeMappings: tableExists(db, NODE_MAPPING_TABLE)
      ? db.prepare("SELECT * FROM site_node_mapping ORDER BY created_at ASC, id ASC").all()
      : [],
    tagMappings: hasTagMapping
      ? db.prepare("SELECT * FROM tag_mapping WHERE item_type='site' ORDER BY created_at ASC, id ASC").all()
      : [],
  };
}

function policyOf(options) {
  const p = options && options.policy;
  return p === "skip" || p === "overwrite" ? p : "newest";
}

export function importSitesData(api, raw, options) {
  const db = api.db;
  const policy = policyOf(options);
  let data;
  try {
    data = JSON.parse(String(raw || "{}"));
  } catch {
    return { ok: false, imported: 0, skipped: 0, failed: 0, message: "站点备份不是有效 JSON" };
  }
  if (!data || Number(data.schemaVersion) !== SCHEMA_VERSION) {
    return { ok: false, imported: 0, skipped: 0, failed: 0, message: "站点备份版本不兼容：需要 " + SCHEMA_VERSION };
  }
  if (!Array.isArray(data.sites) || !Array.isArray(data.nodes) || !Array.isArray(data.nodeMappings) || !Array.isArray(data.tagMappings)) {
    return { ok: false, imported: 0, skipped: 0, failed: 0, message: "站点备份结构不完整" };
  }

  const siteUpsert = db.prepare(
    "INSERT INTO site(id,site_name,description,bindable,site_link,created_at,updated_at,deleted_at,rev) VALUES(?,?,?,?,?,?,?,?,?) " +
      "ON CONFLICT(id) DO UPDATE SET site_name=excluded.site_name,description=excluded.description,bindable=excluded.bindable,site_link=excluded.site_link,created_at=excluded.created_at,updated_at=excluded.updated_at,deleted_at=excluded.deleted_at,rev=excluded.rev " +
      "WHERE ? = 1 OR excluded.updated_at > site.updated_at",
  );
  const nodeUpsert = db.prepare(
    "INSERT INTO site_node(id,name,parent_id,path,sort,depth,created_at,updated_at,deleted_at,rev) VALUES(?,?,?,?,?,?,?,?,?,?) " +
      "ON CONFLICT(id) DO UPDATE SET name=excluded.name,parent_id=excluded.parent_id,path=excluded.path,sort=excluded.sort,depth=excluded.depth,created_at=excluded.created_at,updated_at=excluded.updated_at,deleted_at=excluded.deleted_at,rev=excluded.rev " +
      "WHERE ? = 1 OR excluded.updated_at > site_node.updated_at",
  );
  const nodeMappingUpsert = db.prepare(
    "INSERT INTO site_node_mapping(id,site_id,node_id,created_at,updated_at,deleted_at,rev) VALUES(?,?,?,?,?,?,?) " +
      "ON CONFLICT(id) DO UPDATE SET site_id=excluded.site_id,node_id=excluded.node_id,created_at=excluded.created_at,updated_at=excluded.updated_at,deleted_at=excluded.deleted_at,rev=excluded.rev " +
      "WHERE ? = 1 OR excluded.updated_at > site_node_mapping.updated_at",
  );
  const hasTagMapping = tableExists(db, TAG_MAPPING_TABLE);
  const tagMappingUpsert = hasTagMapping
    ? db.prepare(
        "INSERT INTO tag_mapping(id,tag_id,item_id,item_type,created_at,updated_at,deleted_at,rev) VALUES(?,?,?,?,?,?,?,?) " +
          "ON CONFLICT(id) DO UPDATE SET tag_id=excluded.tag_id,item_id=excluded.item_id,item_type=excluded.item_type,created_at=excluded.created_at,updated_at=excluded.updated_at,deleted_at=excluded.deleted_at,rev=excluded.rev " +
          "WHERE ? = 1 OR excluded.updated_at > tag_mapping.updated_at",
      )
    : null;

  let imported = 0;
  let skipped = 0;
  let failed = 0;
  const errors = [];
  const exists = {
    [SITE_TABLE]: db.prepare("SELECT 1 FROM site WHERE id = ?"),
    [NODE_TABLE]: db.prepare("SELECT 1 FROM site_node WHERE id = ?"),
    [NODE_MAPPING_TABLE]: db.prepare("SELECT 1 FROM site_node_mapping WHERE id = ?"),
  };
  if (hasTagMapping) exists[TAG_MAPPING_TABLE] = db.prepare("SELECT 1 FROM tag_mapping WHERE id = ?");
  const force = policy === "overwrite" ? 1 : 0;

  function apply(stmt, table, values, tsIndex, row) {
    if (!stmt) {
      skipped += 1;
      return;
    }
    if (policy === "skip" && exists[table] && exists[table].get(values[0])) {
      skipped += 1;
      return;
    }
    const result = stmt.run(...values, force);
    if (result.changes > 0) {
      imported += 1;
      logChange(db, table, values[0], "upsert", row, "import", values[tsIndex]);
    } else {
      skipped += 1;
    }
  }

  for (const row of data.sites) {
    try {
      apply(siteUpsert, SITE_TABLE, siteValues(row), 6, row);
    } catch (e) {
      failed += 1;
      if (errors.length < 5) errors.push(String((e && e.message) || e));
    }
  }
  for (const row of data.nodes) {
    try {
      apply(nodeUpsert, NODE_TABLE, nodeValues(row), 7, row);
    } catch (e) {
      failed += 1;
      if (errors.length < 5) errors.push(String((e && e.message) || e));
    }
  }
  for (const row of data.nodeMappings) {
    try {
      apply(nodeMappingUpsert, NODE_MAPPING_TABLE, nodeMappingValues(row), 4, row);
    } catch (e) {
      failed += 1;
      if (errors.length < 5) errors.push(String((e && e.message) || e));
    }
  }
  for (const row of data.tagMappings) {
    try {
      if (String(row.item_type) !== "site") {
        skipped += 1;
        continue;
      }
      apply(tagMappingUpsert, TAG_MAPPING_TABLE, tagMappingValues(row), 5, row);
    } catch (e) {
      failed += 1;
      if (errors.length < 5) errors.push(String((e && e.message) || e));
    }
  }

  if (imported > 0) {
    api.emit("sites-changed", { source: "import" });
    api.emit("site-nodes-changed", { source: "import" });
  }
  return {
    ok: failed === 0,
    imported,
    skipped,
    failed,
    message: failed ? "部分站点行导入失败：" + errors.join("；") : undefined,
  };
}