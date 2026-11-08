/**
 * 站点目录树 action：邻接表 + 路径枚举 + sort + depth。
 *
 * 与任务树不同，站点树没有物理根节点：根 id=0 是虚拟节点。
 * 前端契约保持归档版本：
 * - children?id=0 返回根下的目录数组；
 * - 节点字段同时给 parent 与 parentId；
 * - moveType 0=作为目标子节点，2=作为目标同级之后；
 * - 删除节点只软删子树与映射，不删站点。
 */

import {
  now,
  newId,
  idOf,
  tx,
  logChange,
  rowNode,
  childrenOf,
  nodeById,
  subtreeRows,
  insertNode,
} from "./db.js";

const NAME_MAX = 40;

function directChildren(db, parentId) {
  return childrenOf(db, parentId).map(function (row) {
    return rowNode(row, []);
  });
}

function withChildren(db, row, seen) {
  if (!row) return null;
  const key = String(row.id);
  if (seen.has(key)) return rowNode(row, []);
  seen.add(key);
  const kids = childrenOf(db, row.id).map(function (kid) {
    return withChildren(db, kid, seen);
  });
  return rowNode(row, kids);
}

function treeAction(db) {
  return childrenOf(db, "0").map(function (row) {
    return withChildren(db, row, new Set());
  });
}

function childrenAction(db, args) {
  const id = idOf(args.id !== undefined ? args.id : args.nodeId);
  if (!id || id === "0") return directChildren(db, "0");
  const node = nodeById(db, id, false);
  if (!node) return [];
  return directChildren(db, node.id);
}

function multipleChildrenAction(db, args) {
  let ids = args.ids;
  if (typeof ids === "string") ids = ids.split(",");
  if (!Array.isArray(ids)) ids = [];
  const out = [];
  for (const raw of ids) {
    const id = idOf(raw).trim();
    if (!id || id === "0") {
      out.push({ id: "0", children: directChildren(db, "0") });
      continue;
    }
    const node = nodeById(db, id, false);
    out.push({ id: id, children: node ? directChildren(db, node.id) : [] });
  }
  return out;
}

function pathChildrenAction(db, args) {
  const id = idOf(args.id !== undefined ? args.id : args.nodeId);
  if (!id || id === "0") return [{ id: "0", children: directChildren(db, "0") }];
  const node = nodeById(db, id, false);
  if (!node) return [];
  const segments = String(node.path || "").split("/").filter(Boolean);
  const levels = [{ id: "0", children: directChildren(db, "0") }];
  let current = "0";
  for (const seg of segments) {
    const row = nodeById(db, seg, false);
    if (!row) break;
    levels.push({ id: String(row.id), children: directChildren(db, row.id) });
    current = String(row.id);
  }
  // 如果旧数据里 path 缺失，至少保证目标节点所在层被返回。
  if (current !== String(node.id)) {
    levels.push({ id: String(node.id), children: directChildren(db, node.id) });
  }
  return levels;
}

function nameOf(value) {
  const name = String(value === undefined || value === null || String(value).trim() === "" ? "未命名" : value).trim();
  if (!name) throw new Error("目录名不能为空");
  if (name.length > NAME_MAX) throw new Error("目录名不能超过 " + NAME_MAX + " 个字符");
  return name;
}

function createAction(db, args, origin, api) {
  const parentId = idOf(args.parentId !== undefined ? args.parentId : args.parent);
  const parent = parentId && parentId !== "0" ? nodeById(db, parentId, false) : null;
  if (parentId && parentId !== "0" && !parent) throw new Error("父目录不存在：" + parentId);
  const name = nameOf(args.name);
  const ts = now();
  const id = newId();
  const max = db.prepare(
    "SELECT MAX(sort) AS m FROM site_node WHERE parent_id=? AND deleted_at IS NULL",
  ).get(parentId && parentId !== "0" ? String(parent.id) : "0");
  const sort = max && max.m !== null ? Number(max.m) + 1 : 0;
  const row = {
    id: id,
    name: name,
    parent_id: parent ? String(parent.id) : "0",
    path: parent ? String(parent.path) + id + "/" : "/" + id + "/",
    sort: sort,
    depth: parent ? Number(parent.depth) + 1 : 0,
    created_at: ts,
    updated_at: ts,
    deleted_at: null,
    rev: 1,
  };
  tx(db, function () {
    insertNode(db, row);
    logChange(db, "site_node", id, "create", row, origin, ts);
  });
  api.emit("site-nodes-changed", { id: id, parentId: row.parent_id, op: "create" });
  return { node: rowNode(row, []) };
}

function renameAction(db, args, origin, api) {
  const id = idOf(args.id !== undefined ? args.id : args.nodeId);
  const node = nodeById(db, id, false);
  if (!node) throw new Error("目录不存在：" + (id || "(空)"));
  const name = nameOf(args.name);
  if (name === String(node.name)) return { node: rowNode(node, []), unchanged: true };
  const ts = now();
  tx(db, function () {
    db.prepare("UPDATE site_node SET name=?, updated_at=?, rev=rev+1 WHERE id=?").run(name, ts, id);
    logChange(db, "site_node", id, "upsert", Object.assign({}, node, {
      name: name,
      updated_at: ts,
      rev: Number(node.rev) + 1,
    }), origin, ts);
  });
  api.emit("site-nodes-changed", { id: id, op: "rename" });
  return { node: rowNode(Object.assign({}, node, {
    name: name,
    updated_at: ts,
    rev: Number(node.rev) + 1,
  }), []) };
}

function resort(db, parentId, ts, origin) {
  const rows = db.prepare(
    "SELECT * FROM site_node WHERE parent_id=? AND deleted_at IS NULL ORDER BY sort ASC, id ASC",
  ).all(String(parentId));
  let i = 0;
  for (const row of rows) {
    if (Number(row.sort) !== i) {
      const next = Object.assign({}, row, { sort: i, updated_at: ts, rev: Number(row.rev) + 1 });
      db.prepare("UPDATE site_node SET sort=?, updated_at=?, rev=rev+1 WHERE id=?").run(i, ts, String(row.id));
      logChange(db, "site_node", String(row.id), "upsert", next, origin, ts);
    }
    i++;
  }
}

function moveAction(db, args, origin, api) {
  const sourceId = idOf(args.sourceId !== undefined ? args.sourceId : args.nodeToMoveId);
  const targetId = idOf(args.targetId !== undefined ? args.targetId : args.newParentId);
  const moveType = Number(args.moveType === undefined ? 0 : args.moveType);
  if (moveType !== 0 && moveType !== 2) throw new Error("moveType 只能是 0（作为子目录）或 2（作为同级）");
  const source = nodeById(db, sourceId, false);
  const target = nodeById(db, targetId, false);
  if (!source) throw new Error("要移动的目录不存在：" + (sourceId || "(空)"));
  if (!target) throw new Error("目标目录不存在：" + (targetId || "(空)"));
  if (String(source.id) === String(target.id)) throw new Error("不能移动到自己");
  if (String(target.path).indexOf(String(source.path)) === 0) throw new Error("不能移动到自己的子树中");

  const newParent = moveType === 0
    ? target
    : (String(target.parent_id) === "0" ? null : nodeById(db, target.parent_id, false));
  const newParentId = newParent ? String(newParent.id) : "0";
  if (moveType === 2 && !newParent && String(target.parent_id) === "0") {
    // 允许移动到根级；newParent 为 null 就是根。
  }

  const siblings = db.prepare(
    "SELECT * FROM site_node WHERE parent_id=? AND deleted_at IS NULL AND id<>? ORDER BY sort ASC, id ASC",
  ).all(newParentId, String(source.id));
  let newSort;
  if (moveType === 0) {
    newSort = siblings.length;
  } else {
    const idx = siblings.findIndex(function (n) { return String(n.id) === String(target.id); });
    newSort = idx < 0 ? siblings.length : idx + 1;
  }

  const oldParentId = String(source.parent_id);
  const newPath = newParent ? String(newParent.path) + String(source.id) + "/" : "/" + String(source.id) + "/";
  const newDepth = newParent ? Number(newParent.depth) + 1 : 0;
  const delta = newDepth - Number(source.depth);
  const ts = now();
  const subtree = subtreeRows(db, source);

  tx(db, function () {
    for (const row of subtree) {
      const isSource = String(row.id) === String(source.id);
      const nextPath = isSource ? newPath : newPath + String(row.path).slice(String(source.path).length);
      const nextDepth = Number(row.depth) + delta;
      db.prepare(
        "UPDATE site_node SET parent_id=?, path=?, depth=?, sort=?, updated_at=?, rev=rev+1 WHERE id=?",
      ).run(
        isSource ? newParentId : String(row.parent_id),
        nextPath,
        nextDepth,
        isSource ? newSort : Number(row.sort),
        ts,
        String(row.id),
      );
      logChange(db, "site_node", String(row.id), "upsert", Object.assign({}, row, {
        parent_id: isSource ? newParentId : String(row.parent_id),
        path: nextPath,
        depth: nextDepth,
        sort: isSource ? newSort : Number(row.sort),
        updated_at: ts,
        rev: Number(row.rev) + 1,
      }), origin, ts);
    }

    const ordered = db.prepare(
      "SELECT * FROM site_node WHERE parent_id=? AND deleted_at IS NULL AND id<>? ORDER BY sort ASC, id ASC",
    ).all(newParentId, String(source.id));
    ordered.splice(Math.max(0, Math.min(newSort, ordered.length)), 0, { id: String(source.id) });
    let i = 0;
    for (const row of ordered) {
      if (String(row.id) === String(source.id)) { i++; continue; }
      if (Number(row.sort) !== i) {
        const next = Object.assign({}, row, { sort: i, updated_at: ts, rev: Number(row.rev) + 1 });
        db.prepare("UPDATE site_node SET sort=?, updated_at=?, rev=rev+1 WHERE id=?").run(i, ts, String(row.id));
        logChange(db, "site_node", String(row.id), "upsert", next, origin, ts);
      }
      i++;
    }
    resort(db, oldParentId, ts, origin);
  });
  api.emit("site-nodes-changed", { id: String(source.id), parentId: newParentId, op: "move" });
  return { ok: true, node: rowNode(nodeById(db, source.id, false), []) };
}

function deleteAction(db, args, origin, api) {
  const id = idOf(args.id !== undefined ? args.id : args.nodeId);
  const node = nodeById(db, id, false);
  if (!node) throw new Error("目录不存在：" + (id || "(空)"));
  const rows = subtreeRows(db, node);
  const ids = rows.map(function (r) { return String(r.id); });
  const ts = now();
  let removedMappings = 0;
  tx(db, function () {
    for (const nodeId of ids) {
      const mappings = db.prepare(
        "SELECT * FROM site_node_mapping WHERE node_id=? AND deleted_at IS NULL",
      ).all(nodeId);
      for (const m of mappings) {
        const tomb = Object.assign({}, m, { deleted_at: ts, updated_at: ts, rev: Number(m.rev) + 1 });
        db.prepare("UPDATE site_node_mapping SET deleted_at=?, updated_at=?, rev=rev+1 WHERE id=?").run(ts, ts, String(m.id));
        logChange(db, "site_node_mapping", String(m.id), "delete", tomb, origin, ts);
        removedMappings++;
      }
    }
    for (const row of rows) {
      const tomb = Object.assign({}, row, { deleted_at: ts, updated_at: ts, rev: Number(row.rev) + 1 });
      db.prepare("UPDATE site_node SET deleted_at=?, updated_at=?, rev=rev+1 WHERE id=?").run(ts, ts, String(row.id));
      logChange(db, "site_node", String(row.id), "delete", tomb, origin, ts);
    }
  });
  api.emit("site-nodes-changed", { id: id, op: "delete" });
  return { ok: true, deletedNodes: rows.length, removedMappings: removedMappings };
}

function renderTree(rows) {
  function walk(nodes, depth) {
    const out = [];
    for (const n of nodes) {
      out.push("  ".repeat(depth) + "- " + n.name + " (id=" + n.id + ")");
      if (n.children && n.children.length) out.push.apply(out, walk(n.children, depth + 1));
    }
    return out;
  }
  return walk(rows || [], 0).join("\n");
}

export function registerSiteTreeActions(api) {
  const db = api.db;
  const action = api.action;

  action("siteNodes.tree", {
    description: "取完整站点目录树（虚拟根 0，不返回根行）",
    input: { type: "object", properties: {} },
    execute: function () { return treeAction(db); },
    render: renderTree,
  });

  action("siteNodes.children", {
    description: "取某目录的直接子目录；id=0 返回根下目录",
    input: { type: "object", properties: { id: { type: ["string", "number"] } } },
    execute: function (args) { return childrenAction(db, args || {}); },
    render: renderTree,
  });

  action("siteNodes.multipleChildren", {
    description: "一次取多个目录的直接子目录，返回 [{id,children}]",
    input: { type: "object", properties: { ids: { type: "array", items: { type: ["string", "number"] } } } },
    execute: function (args) { return multipleChildrenAction(db, args || {}); },
    render: function (rows) {
      return (rows || []).map(function (r) { return r.id + ": " + r.children.length + " 个直接子目录"; }).join("\n");
    },
  });

  action("siteNodes.pathChildren", {
    description: "取根到目标目录沿途各层的直接子目录，返回 [{id,children}]",
    input: { type: "object", properties: { id: { type: ["string", "number"] } } },
    execute: function (args) { return pathChildrenAction(db, args || {}); },
    render: function (rows) {
      return (rows || []).map(function (r) { return r.id + ": " + r.children.length + " 个直接子目录"; }).join("\n");
    },
  });

  action("siteNodes.path", {
    description: "取根到某目录的路径（含 id/name）",
    input: { type: "object", properties: { id: { type: ["string", "number"] } } },
    execute: function (args) {
      const id = idOf(args && (args.id !== undefined ? args.id : args.nodeId));
      const node = nodeById(db, id, false);
      if (!node) return [];
      const rows = String(node.path || "").split("/").filter(Boolean).map(function (seg) {
        return nodeById(db, seg, false);
      }).filter(Boolean);
      return rows.map(function (r) {
        return { id: String(r.id), name: String(r.name), parent: String(r.parent_id || "0") };
      });
    },
    render: function (rows) { return (rows || []).map(function (r) { return r.name; }).join(" / "); },
  });

  action("siteNodes.create", {
    description: "新建站点目录；parentId=0 表示根下，name 缺省为“未命名”",
    input: {
      type: "object",
      properties: {
        parentId: { type: ["string", "number"] },
        parent: { type: ["string", "number"] },
        name: { type: "string" },
      },
    },
    execute: function (args, ctx) { return createAction(db, args || {}, ctx.origin, api); },
    render: function (r) { return "已新建目录：" + r.node.name + "（id=" + r.node.id + "）"; },
  });

  action("siteNodes.rename", {
    description: "重命名站点目录",
    input: { type: "object", properties: { id: { type: ["string", "number"] }, name: { type: "string" } } },
    execute: function (args, ctx) { return renameAction(db, args || {}, ctx.origin, api); },
    render: function (r) { return r.unchanged ? "目录名未变化" : "已重命名为：" + r.node.name; },
  });

  action("siteNodes.move", {
    description: "移动目录；moveType=0 作为目标子目录，2 作为目标同级（目标之后）",
    input: {
      type: "object",
      properties: {
        sourceId: { type: ["string", "number"] },
        nodeToMoveId: { type: ["string", "number"] },
        targetId: { type: ["string", "number"] },
        newParentId: { type: ["string", "number"] },
        moveType: { type: ["number", "string"] },
      },
    },
    execute: function (args, ctx) { return moveAction(db, args || {}, ctx.origin, api); },
    render: function (r) { return "已移动目录：" + r.node.id; },
  });

  action("siteNodes.delete", {
    description: "删除目录及其子树；同步清理子树内目录与站点的映射，不删除站点",
    input: { type: "object", properties: { id: { type: ["string", "number"] } } },
    execute: function (args, ctx) { return deleteAction(db, args || {}, ctx.origin, api); },
    render: function (r) { return "已删除 " + r.deletedNodes + " 个目录、清理 " + r.removedMappings + " 条目录映射"; },
  });
}
