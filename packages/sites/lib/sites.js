/**
 * 站点 action：站点本体、站点-目录映射、站点-标签映射。
 *
 * 业务全部本地。标签本体归 wb-addon-tags，本插件只读写 tag_mapping(item_type='site')；
 * 跨 addon 不互相调用 action，因此标签查询在这里直接读同一张本地表。
 */

import {
  now,
  newId,
  idOf,
  tx,
  logChange,
  formatTime,
  parseLinks,
  encodeLinks,
  rowSite,
  nodeById,
  subtreeRows,
  childrenOf,
  hasTagDomain,
  SITE_TABLE,
  NODE_MAPPING_TABLE,
} from "./db.js";

const PAGE_SIZE_DEFAULT = 16;
const PAGE_SIZE_MAX = 200;
const TAG_SEARCH_SIZE_DEFAULT = 10;
const TAG_SEARCH_SIZE_MAX = 100;

function clampPageNumber(v) {
  const n = Number(v);
  return Number.isFinite(n) && n >= 1 ? Math.floor(n) : 1;
}

function clampPageSize(v, fallback, max) {
  const n = Number(v);
  if (!Number.isFinite(n) || n <= 0) return fallback;
  return Math.min(Math.floor(n), max);
}

function pageInfo(total, pageNumber, pageSize) {
  const pages = total > 0 ? Math.ceil(total / pageSize) : 0;
  const current = pages > 0 ? Math.min(pageNumber, pages) : 1;
  return {
    current: current,
    size: pageSize,
    total: total,
    pages: pages,
    pageable: { pageNumber: current, pageSize: pageSize, offset: (current - 1) * pageSize },
  };
}

function normalizeTagIds(value) {
  if (value === undefined || value === null) return [];
  const raw = Array.isArray(value) ? value : String(value).split(",");
  const seen = new Set();
  const out = [];
  for (const item of raw) {
    const id = idOf(item).trim();
    if (!id || seen.has(id)) continue;
    seen.add(id);
    out.push(id);
  }
  return out;
}

function normalizeLinks(value) {
  if (!Array.isArray(value)) return [];
  return value.map(function (item) {
    const x = item && typeof item === "object" ? item : {};
    return {
      description: x.description === undefined || x.description === null ? "" : String(x.description).trim(),
      link: x.link === undefined || x.link === null ? "" : String(x.link).trim(),
      isDefault: x.isDefault === true || x.is_default === true,
    };
  });
}

function tagRow(row) {
  return {
    id: String(row.id),
    name: String(row.name || ""),
    createTime: formatTime(row.created_at),
    updateTime: formatTime(row.updated_at),
  };
}

function tagsOn(api, db) {
  if (!hasTagDomain(db)) return false;
  if (api && typeof api.hasAddon === "function") return api.hasAddon("wb-addon-tags") === true;
  // 旧壳没有 hasAddon 时退回表探测；客户端还会用 host.addons 再判一次。
  return true;
}

function siteTagsOf(db, siteId, tagsAvailable) {
  if (!tagsAvailable || !hasTagDomain(db)) return [];
  return db.prepare(
    "SELECT t.* FROM tag_mapping m JOIN tag t ON t.id=m.tag_id " +
      "WHERE m.item_type='site' AND m.item_id=? AND m.deleted_at IS NULL AND t.deleted_at IS NULL " +
      "ORDER BY t.updated_at DESC, t.id ASC",
  ).all(String(siteId)).map(tagRow);
}

function siteDirsOf(db, siteId) {
  const mappings = db.prepare(
    "SELECT * FROM site_node_mapping WHERE site_id=? AND deleted_at IS NULL ORDER BY node_id ASC",
  ).all(String(siteId));
  const out = [];
  for (const m of mappings) {
    const node = nodeById(db, m.node_id, false);
    if (!node) continue;
    const segments = String(node.path || "").split("/").filter(Boolean);
    const path = [];
    for (const seg of segments) {
      const row = nodeById(db, seg, false);
      if (row) path.push({ id: String(row.id), name: String(row.name), parent: String(row.parent_id || "0") });
    }
    out.push({ id: String(node.id), path: path });
  }
  return out;
}

function enrichSite(db, row, tagsAvailable) {
  const site = rowSite(row);
  site.tags = siteTagsOf(db, site.id, tagsAvailable);
  site.tagIds = site.tags.map(function (t) { return t.id; });
  site.dirs = siteDirsOf(db, site.id);
  return site;
}

function resolveSort(args) {
  const column = String(args.sortColumn || args.sort_column || "update_time");
  const order = String(args.sortOrder || args.sort_order || "desc").toLowerCase();
  let col = "s.updated_at";
  if (column === "site_name" || column === "siteName" || column === "name") col = "s.site_name";
  else if (column === "create_time" || column === "createTime" || column === "created_at") col = "s.created_at";
  else if (column === "update_time" || column === "updateTime" || column === "updated_at" || column === "updateTime") col = "s.updated_at";
  const dir = order === "asc" || order === "ascend" ? "ASC" : "DESC";
  return col + " " + dir + ", s.id ASC";
}

function listSites(db, args, tagsAvailable) {
  const pageNumber = clampPageNumber(args.pageNumber !== undefined ? args.pageNumber : args.current);
  const pageSize = clampPageSize(args.pageSize !== undefined ? args.pageSize : args.size, PAGE_SIZE_DEFAULT, PAGE_SIZE_MAX);
  const nodeId = idOf(args.nodeId !== undefined ? args.nodeId : args.dirId);
  const text = String(args.text || args.titleKey || "").trim();
  const tagIds = normalizeTagIds(args.tagIds);
  const where = ["s.deleted_at IS NULL"];
  const params = [];

  if (nodeId && nodeId !== "0") {
    const node = nodeById(db, nodeId, false);
    if (!node) {
      const info = pageInfo(0, pageNumber, pageSize);
      return Object.assign({ records: [] }, info);
    }
    const ids = subtreeRows(db, node).map(function (r) { return String(r.id); });
    if (!ids.length) {
      const info = pageInfo(0, pageNumber, pageSize);
      return Object.assign({ records: [] }, info);
    }
    where.push("EXISTS (SELECT 1 FROM " + NODE_MAPPING_TABLE + " m WHERE m.site_id=s.id AND m.deleted_at IS NULL AND m.node_id IN (" + ids.map(function () { return "?"; }).join(",") + "))");
    for (const id of ids) params.push(id);
  }

  if (tagIds.length) {
    if (!tagsAvailable || !hasTagDomain(db)) {
      const info = pageInfo(0, pageNumber, pageSize);
      return Object.assign({ records: [] }, info);
    }
    where.push("EXISTS (SELECT 1 FROM tag_mapping tm WHERE tm.item_type='site' AND tm.item_id=s.id AND tm.deleted_at IS NULL AND tm.tag_id IN (" + tagIds.map(function () { return "?"; }).join(",") + "))");
    for (const id of tagIds) params.push(id);
  }

  if (text) {
    where.push("(instr(lower(s.site_name), lower(?)) > 0 OR instr(lower(s.description), lower(?)) > 0)");
    params.push(text, text);
  }

  const whereSql = " WHERE " + where.join(" AND ");
  const countStmt = db.prepare("SELECT COUNT(*) AS n FROM " + SITE_TABLE + " s" + whereSql);
  const countRow = countStmt.get(...params);
  const total = Number(countRow && countRow.n ? countRow.n : 0);
  const info = pageInfo(total, pageNumber, pageSize);
  const rowsStmt = db.prepare(
    "SELECT s.* FROM " + SITE_TABLE + " s" + whereSql + " ORDER BY " + resolveSort(args) + " LIMIT ? OFFSET ?",
  );
  const rows = rowsStmt.all(...params.concat([pageSize, (info.current - 1) * pageSize]));
  return Object.assign({ records: rows.map(function (r) { return enrichSite(db, r, tagsAvailable); }) }, info);
}

function getSite(db, args, tagsAvailable) {
  const id = idOf(args.id !== undefined ? args.id : args.siteId);
  if (!id) return null;
  const row = db.prepare("SELECT * FROM " + SITE_TABLE + " WHERE id=? AND deleted_at IS NULL").get(id);
  return row ? enrichSite(db, row, tagsAvailable) : null;
}

function validateSiteName(value) {
  const name = String(value === undefined || value === null ? "" : value).trim();
  if (!name) throw new Error("站点名称不能为空");
  if (name.length > 200) throw new Error("站点名称不能超过 200 个字符");
  return name;
}

function validateDescription(value) {
  const text = String(value === undefined || value === null ? "" : value).trim();
  if (text.length > 2000) throw new Error("站点描述不能超过 2000 个字符");
  return text;
}

function normalizeDirIds(db, value) {
  const ids = normalizeTagIds(value);
  const nodes = [];
  for (const id of ids) {
    const node = nodeById(db, id, false);
    if (!node) throw new Error("目录不存在：" + id);
    nodes.push(node);
  }
  if (!nodes.length) throw new Error("站点至少需要关联一个目录");
  return nodes;
}

function validateTagIds(db, tagIds, tagsAvailable) {
  if (!tagIds.length || !tagsAvailable) return [];
  const rows = [];
  for (const id of tagIds) {
    const row = db.prepare("SELECT * FROM tag WHERE id=? AND deleted_at IS NULL").get(id);
    if (!row) throw new Error("标签不存在：" + id);
    rows.push(row);
  }
  return rows;
}

function reviveOrInsertMapping(db, table, idKey, where, values, ts) {
  // 仅用于 site_node_mapping / tag_mapping 的软删复用，避免每次编辑都新增历史行。
  return null;
}

function replaceDirMappings(db, siteId, nodes, ts, origin) {
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

function replaceTagMappings(db, siteId, tags, ts, origin, tagsAvailable) {
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

function createSite(db, args, origin, api, tagsAvailable) {
  const siteName = validateSiteName(args.siteName !== undefined ? args.siteName : args.name);
  const description = validateDescription(args.description);
  const links = normalizeLinks(args.siteLinks !== undefined ? args.siteLinks : args.links);
  const nodes = normalizeDirIds(db, args.dirIds !== undefined ? args.dirIds : args.dirIds);
  const tags = validateTagIds(db, normalizeTagIds(args.tagIds), tagsAvailable);
  const bindable = args.bindable === 0 || args.bindable === "0" || args.bindable === false ? 0 : 1;
  const ts = now();
  const id = newId();
  const row = {
    id: id,
    site_name: siteName,
    description: description,
    bindable: bindable,
    site_link: encodeLinks(links),
    created_at: ts,
    updated_at: ts,
    deleted_at: null,
    rev: 1,
  };
  tx(db, function () {
    db.prepare(
      "INSERT INTO " + SITE_TABLE + "(id,site_name,description,bindable,site_link,created_at,updated_at,deleted_at,rev) VALUES(?,?,?,?,?,?,?,?,?)",
    ).run(id, row.site_name, row.description, row.bindable, row.site_link, ts, ts, null, 1);
    logChange(db, SITE_TABLE, id, "create", row, origin, ts);
    replaceDirMappings(db, id, nodes, ts, origin);
    replaceTagMappings(db, id, tags, ts, origin, tagsAvailable);
  });
  api.emit("sites-changed", { id: id, op: "create" });
  return { site: enrichSite(db, db.prepare("SELECT * FROM " + SITE_TABLE + " WHERE id=?").get(id), tagsAvailable) };
}

function updateSite(db, args, origin, api, tagsAvailable) {
  const id = idOf(args.id !== undefined ? args.id : args.siteId);
  const existing = db.prepare("SELECT * FROM " + SITE_TABLE + " WHERE id=? AND deleted_at IS NULL").get(id);
  if (!existing) throw new Error("站点不存在：" + (id || "(空)"));
  const siteName = validateSiteName(args.siteName !== undefined ? args.siteName : existing.site_name);
  const description = validateDescription(args.description !== undefined ? args.description : existing.description);
  const links = args.siteLinks !== undefined || args.links !== undefined
    ? normalizeLinks(args.siteLinks !== undefined ? args.siteLinks : args.links)
    : parseLinks(existing.site_link);
  const nodes = args.dirIds !== undefined && args.dirIds !== null ? normalizeDirIds(db, args.dirIds) : null;
  const tags = args.tagIds !== undefined && args.tagIds !== null && tagsAvailable ? validateTagIds(db, normalizeTagIds(args.tagIds), tagsAvailable) : null;
  const bindable = args.bindable === undefined
    ? Number(existing.bindable) === 0 ? 0 : 1
    : (args.bindable === 0 || args.bindable === "0" || args.bindable === false ? 0 : 1);
  const ts = now();
  tx(db, function () {
    db.prepare(
      "UPDATE " + SITE_TABLE + " SET site_name=?, description=?, bindable=?, site_link=?, updated_at=?, rev=rev+1 WHERE id=?",
    ).run(siteName, description, bindable, encodeLinks(links), ts, id);
    logChange(db, SITE_TABLE, id, "upsert", Object.assign({}, existing, {
      site_name: siteName,
      description: description,
      bindable: bindable,
      site_link: encodeLinks(links),
      updated_at: ts,
      rev: Number(existing.rev) + 1,
    }), origin, ts);
    if (nodes) replaceDirMappings(db, id, nodes, ts, origin);
    if (tags) replaceTagMappings(db, id, tags, ts, origin, tagsAvailable);
  });
  api.emit("sites-changed", { id: id, op: "update" });
  return { site: enrichSite(db, db.prepare("SELECT * FROM " + SITE_TABLE + " WHERE id=?").get(id), tagsAvailable) };
}

function deleteSite(db, args, origin, api) {
  const id = idOf(args.id !== undefined ? args.id : args.siteId);
  const existing = db.prepare("SELECT * FROM " + SITE_TABLE + " WHERE id=? AND deleted_at IS NULL").get(id);
  if (!existing) return { ok: true, deleted: false, missing: true };
  const ts = now();
  let removedNodeMappings = 0;
  let removedTagMappings = 0;
  tx(db, function () {
    db.prepare("UPDATE " + SITE_TABLE + " SET deleted_at=?, updated_at=?, rev=rev+1 WHERE id=?").run(ts, ts, id);
    logChange(db, SITE_TABLE, id, "delete", null, origin, ts);
    const dirs = db.prepare(
      "SELECT * FROM " + NODE_MAPPING_TABLE + " WHERE site_id=? AND deleted_at IS NULL",
    ).all(id);
    for (const m of dirs) {
      db.prepare("UPDATE " + NODE_MAPPING_TABLE + " SET deleted_at=?, updated_at=?, rev=rev+1 WHERE id=?").run(ts, ts, String(m.id));
      logChange(db, NODE_MAPPING_TABLE, String(m.id), "delete", null, origin, ts);
      removedNodeMappings++;
    }
    if (hasTagDomain(db)) {
      const tags = db.prepare(
        "SELECT * FROM tag_mapping WHERE item_type='site' AND item_id=? AND deleted_at IS NULL",
      ).all(id);
      for (const m of tags) {
        db.prepare("UPDATE tag_mapping SET deleted_at=?, updated_at=?, rev=rev+1 WHERE id=?").run(ts, ts, String(m.id));
        logChange(db, "tag_mapping", String(m.id), "delete", null, origin, ts);
        removedTagMappings++;
      }
    }
  });
  api.emit("sites-changed", { id: id, op: "delete" });
  return { ok: true, deleted: true, removedNodeMappings: removedNodeMappings, removedTagMappings: removedTagMappings };
}

function searchTags(db, args, tagsAvailable) {
  const pageNumber = clampPageNumber(args.pageNumber !== undefined ? args.pageNumber : args.current);
  const pageSize = clampPageSize(args.pageSize !== undefined ? args.pageSize : args.size, TAG_SEARCH_SIZE_DEFAULT, TAG_SEARCH_SIZE_MAX);
  const text = String(args.text || "").trim();
  if (!tagsAvailable || !hasTagDomain(db)) {
    return Object.assign({ records: [], text: text }, pageInfo(0, pageNumber, pageSize));
  }
  const where = ["deleted_at IS NULL"];
  const params = [];
  if (text) {
    where.push("instr(lower(name), lower(?)) > 0");
    params.push(text);
  }
  const whereSql = " WHERE " + where.join(" AND ");
  const countSql = "SELECT COUNT(*) AS n FROM tag" + whereSql;
  const countRow = db.prepare(countSql).get(...params);
  const total = Number(countRow && countRow.n ? countRow.n : 0);
  const info = pageInfo(total, pageNumber, pageSize);
  const rowsSql = "SELECT * FROM tag" + whereSql + " ORDER BY updated_at DESC, created_at DESC LIMIT ? OFFSET ?";
  const rows = db.prepare(rowsSql).all(...params.concat([pageSize, (info.current - 1) * pageSize]));
  return Object.assign({ records: rows.map(tagRow), text: text }, info);
}

function tagsByIds(db, args, tagsAvailable) {
  const ids = normalizeTagIds(args.ids !== undefined ? args.ids : args.tagIds).slice(0, 500);
  if (!ids.length || !tagsAvailable || !hasTagDomain(db)) return { records: [] };
  const sql = "SELECT * FROM tag WHERE deleted_at IS NULL AND id IN (" + ids.map(function () { return "?"; }).join(",") + ") ORDER BY updated_at DESC, id ASC";
  return { records: db.prepare(sql).all(...ids).map(tagRow) };
}

function renderList(r) {
  if (!r || !r.records || !r.records.length) return "共 " + (r ? r.total : 0) + " 个站点";
  return r.records.map(function (s) {
    return "- " + s.siteName + "（id=" + s.id + "，默认链接=" + (s.defaultLink || "无") + "）";
  }).join("\n");
}

function renderSite(r) {
  if (!r || !r.site) return "站点不存在";
  const s = r.site;
  return s.siteName + "（id=" + s.id + "，目录 " + s.dirs.length + " 个，标签 " + s.tags.length + " 个）";
}

export function registerSiteActions(api) {
  const db = api.db;
  const action = api.action;
  const tagsAvailable = function () { return tagsOn(api, db); };

  action("sites.capabilities", {
    description: "站点子插件能力：标签是否可用（依赖标签子插件已安装且启用）",
    input: { type: "object", properties: {} },
    execute: function () { return { tags: tagsAvailable() }; },
    render: function (r) { return r && r.tags ? "标签能力：可用" : "标签能力：不可用（标签子插件未安装）"; },
  });

  action("sites.list", {
    description: "分页查询站点；可按目录子树、标签、标题/描述关键字过滤",
    input: {
      type: "object",
      properties: {
        nodeId: { type: ["string", "number"] },
        text: { type: "string" },
        tagIds: { type: "array", items: { type: ["string", "number"] } },
        pageNumber: { type: "number" },
        pageSize: { type: "number" },
        sortColumn: { type: "string" },
        sortOrder: { type: "string" },
      },
    },
    execute: function (args) { return listSites(db, args || {}, tagsAvailable()); },
    render: renderList,
  });

  action("sites.get", {
    description: "按 id 取单个站点（含目录路径与标签）",
    input: { type: "object", properties: { id: { type: ["string", "number"] } } },
    execute: function (args) { return getSite(db, args || {}, tagsAvailable()); },
    render: function (r) { return r ? renderSite({ site: r }) : "站点不存在"; },
  });

  action("sites.create", {
    description: "创建站点，并关联目录与标签",
    input: {
      type: "object",
      properties: {
        siteName: { type: "string" },
        description: { type: "string" },
        siteLinks: { type: "array" },
        dirIds: { type: "array", items: { type: ["string", "number"] } },
        tagIds: { type: "array", items: { type: ["string", "number"] } },
        bindable: { type: ["number", "boolean"] },
      },
      required: ["siteName", "dirIds"],
    },
    execute: function (args, ctx) { return createSite(db, args || {}, ctx.origin, api, tagsAvailable()); },
    render: renderSite,
  });

  action("sites.update", {
    description: "更新站点；传入 dirIds/tagIds 时会同步替换对应映射",
    input: {
      type: "object",
      properties: {
        id: { type: ["string", "number"] },
        siteName: { type: "string" },
        description: { type: "string" },
        siteLinks: { type: "array" },
        dirIds: { type: "array", items: { type: ["string", "number"] } },
        tagIds: { type: "array", items: { type: ["string", "number"] } },
        bindable: { type: ["number", "boolean"] },
      },
      required: ["id"],
    },
    execute: function (args, ctx) { return updateSite(db, args || {}, ctx.origin, api, tagsAvailable()); },
    render: renderSite,
  });

  action("sites.delete", {
    description: "软删站点，并清理它的目录映射与标签映射",
    input: { type: "object", properties: { id: { type: ["string", "number"] } } },
    execute: function (args, ctx) { return deleteSite(db, args || {}, ctx.origin, api); },
    render: function (r) {
      if (!r || !r.deleted) return "站点不存在或已删除";
      return "已删除站点，清理目录映射 " + r.removedNodeMappings + " 条、标签映射 " + r.removedTagMappings + " 条";
    },
  });

  action("sites.stats", {
    description: "站点总数、有关联标签的站点数、目录数",
    input: { type: "object", properties: {} },
    execute: function () {
      const total = Number(db.prepare("SELECT COUNT(*) AS n FROM site WHERE deleted_at IS NULL").get().n || 0);
      const tagged = tagsAvailable() && hasTagDomain(db)
        ? Number(db.prepare("SELECT COUNT(DISTINCT item_id) AS n FROM tag_mapping WHERE item_type='site' AND deleted_at IS NULL").get().n || 0)
        : 0;
      const nodes = Number(db.prepare("SELECT COUNT(*) AS n FROM site_node WHERE deleted_at IS NULL").get().n || 0);
      return { total: total, tagged: tagged, nodes: nodes };
    },
    render: function (r) { return "站点 " + r.total + " 个，其中 " + r.tagged + " 个有标签；目录 " + r.nodes + " 个"; },
  });

  action("siteTags.search", {
    description: "搜索标签（供站点表单使用，直接读本地 tag 表）",
    input: {
      type: "object",
      properties: {
        text: { type: "string" },
        pageNumber: { type: "number" },
        pageSize: { type: "number" },
      },
    },
    execute: function (args) { return searchTags(db, args || {}, tagsAvailable()); },
    render: function (r) { return (r.records || []).map(function (t) { return t.name; }).join("、") || "无匹配标签"; },
  });

  action("siteTags.byIds", {
    description: "按 id 批量取标签（供站点列表拼装标签）",
    input: { type: "object", properties: { ids: { type: "array", items: { type: ["string", "number"] } } } },
    execute: function (args) { return tagsByIds(db, args || {}, tagsAvailable()); },
    render: function (r) { return (r.records || []).map(function (t) { return t.name; }).join("、") || "无标签"; },
  });
}
