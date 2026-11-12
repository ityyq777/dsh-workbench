/**
 * 站点映射维护：站点-目录（site_node_mapping）与站点-标签（tag_mapping）。
 *
 * 编辑时按集合差异增删，软删过的历史行优先复活，避免每改一次就多一条墓碑。
 */

import { newId, logChange, hasTagDomain, NODE_MAPPING_TABLE } from "../db/db.js";

function reviveOrInsertMapping(db, table, idKey, where, values, ts) {
  // 仅用于 site_node_mapping / tag_mapping 的软删复用，避免每次编辑都新增历史行。
  return null;
}

export function replaceDirMappings(db, siteId, nodes, ts, origin) {
  const current = db.prepare(
    "SELECT * FROM " + NODE_MAPPING_TABLE + " WHERE site_id=? AND deleted_at IS NULL",
  ).all(String(siteId));
  const byNode = new Map();
  for (const m of current) byNode.set(String(m.node_id), m);
  const wanted = new Set(nodes.map(function (n) { return String(n.id); }));

  for (const m of current) {
    if (wanted.has(String(m.node_id))) continue;
    db.prepare("UPDATE " + NODE_MAPPING_TABLE + " SET deleted_at=?, updated_at=?, rev=rev+1 WHERE id=?").run(ts, ts, String(m.id));
    logChange(db, NODE_MAPPING_TABLE, String(m.id), "delete", null, origin, ts);
  }

  for (const node of nodes) {
    const existing = byNode.get(String(node.id));
    if (existing) continue;
    const deleted = db.prepare(
      "SELECT * FROM " + NODE_MAPPING_TABLE + " WHERE site_id=? AND node_id=? AND deleted_at IS NOT NULL ORDER BY updated_at DESC LIMIT 1",
    ).get(String(siteId), String(node.id));
    if (deleted) {
      db.prepare("UPDATE " + NODE_MAPPING_TABLE + " SET deleted_at=NULL, updated_at=?, rev=rev+1 WHERE id=?").run(ts, String(deleted.id));
      logChange(db, NODE_MAPPING_TABLE, String(deleted.id), "upsert", {
        id: String(deleted.id), site_id: String(siteId), node_id: String(node.id),
        updated_at: ts, deleted_at: null, rev: Number(deleted.rev) + 1,
      }, origin, ts);
      continue;
    }
    const id = newId();
    db.prepare(
      "INSERT INTO " + NODE_MAPPING_TABLE + "(id,site_id,node_id,created_at,updated_at,deleted_at,rev) VALUES(?,?,?,?,?,?,?)",
    ).run(id, String(siteId), String(node.id), ts, ts, null, 1);
    logChange(db, NODE_MAPPING_TABLE, id, "create", {
      id: id, site_id: String(siteId), node_id: String(node.id), created_at: ts, updated_at: ts, deleted_at: null, rev: 1,
    }, origin, ts);
  }
}

export function replaceTagMappings(db, siteId, tags, ts, origin, tagsAvailable) {
  if (!tagsAvailable || !hasTagDomain(db)) return;
  const current = db.prepare(
    "SELECT * FROM tag_mapping WHERE item_type='site' AND item_id=? AND deleted_at IS NULL",
  ).all(String(siteId));
  const byTag = new Map();
  for (const m of current) byTag.set(String(m.tag_id), m);
  const wanted = new Set(tags.map(function (t) { return String(t.id); }));

  for (const m of current) {
    if (wanted.has(String(m.tag_id))) continue;
    db.prepare("UPDATE tag_mapping SET deleted_at=?, updated_at=?, rev=rev+1 WHERE id=?").run(ts, ts, String(m.id));
    logChange(db, "tag_mapping", String(m.id), "delete", null, origin, ts);
  }

  for (const tag of tags) {
    const existing = byTag.get(String(tag.id));
    if (existing) continue;
    const deleted = db.prepare(
      "SELECT * FROM tag_mapping WHERE item_type='site' AND item_id=? AND tag_id=? AND deleted_at IS NOT NULL ORDER BY updated_at DESC LIMIT 1",
    ).get(String(siteId), String(tag.id));
    if (deleted) {
      db.prepare("UPDATE tag_mapping SET deleted_at=NULL, updated_at=?, rev=rev+1 WHERE id=?").run(ts, String(deleted.id));
      logChange(db, "tag_mapping", String(deleted.id), "upsert", {
        id: String(deleted.id), tag_id: String(tag.id), item_id: String(siteId), item_type: "site",
        updated_at: ts, deleted_at: null, rev: Number(deleted.rev) + 1,
      }, origin, ts);
      continue;
    }
    const id = newId();
    db.prepare(
      "INSERT INTO tag_mapping(id,tag_id,item_id,item_type,created_at,updated_at,deleted_at,rev) VALUES(?,?,?,?,?,?,?,?)",
    ).run(id, String(tag.id), String(siteId), "site", ts, ts, null, 1);
    logChange(db, "tag_mapping", id, "create", {
      id: id, tag_id: String(tag.id), item_id: String(siteId), item_type: "site",
      created_at: ts, updated_at: ts, deleted_at: null, rev: 1,
    }, origin, ts);
  }
}
