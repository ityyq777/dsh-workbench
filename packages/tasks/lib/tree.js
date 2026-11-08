/**
 * 任务树 action：邻接表 + 路径枚举 + sort + depth。
 *
 * 对外仍保持旧前端契约：根节点 id=1、parent=0、type='2'（ROOT_GROUP），
 * 叶子节点 type='1'（TABLE），组节点 type='0'（GROUP）。
 */

import {
  now,
  newId,
  idOf,
  todayStr,
  tx,
  logChange,
  rowNode,
  childrenOf,
  treeRoot,
  pickFreeId,
  insertNode,
} from "./db.js";

const NODE_TYPES = { GROUP: "0", TABLE: "1", ROOT_GROUP: "2" };
const TYPE_NAMES = { 组: "0", 任务组: "0", 表: "1", 任务表: "1" };

function typeCode(value) {
  if (value === undefined || value === null || value === "") return "0";
  if (NODE_TYPES[String(value)] !== undefined) return NODE_TYPES[String(value)];
  if (TYPE_NAMES[String(value)] !== undefined) return TYPE_NAMES[String(value)];
  const s = String(value);
  if (s === "0" || s === "1") return s;
  throw new Error("节点类型非法：" + value);
}

function nodeById(db, id, includeDeleted) {
  const key = idOf(id);
  if (!key) return null;
  const sql = "SELECT * FROM task_node WHERE id=?" + (includeDeleted ? "" : " AND deleted_at IS NULL");
  return db.prepare(sql).get(key) || null;
}

function subtreeRows(db, node) {
  return db.prepare(
    "SELECT * FROM task_node WHERE deleted_at IS NULL AND path LIKE ? ORDER BY depth ASC, sort ASC, id ASC",
  ).all(String(node.path) + "%");
}

function withChildren(db, row, seen) {
  if (!row) return null;
  const mark = String(row.id);
  if (seen.has(mark)) return rowNode(row, []);
  seen.add(mark);
  const kids = childrenOf(db, row.id, false);
  const children = kids.map(function (kid) {
    return withChildren(db, kid, seen);
  });
  return rowNode(row, children);
}

function directChildren(db, row) {
  return childrenOf(db, row.id, false).map(function (kid) {
    return rowNode(kid, []);
  });
}

function rootRow(db) {
  return treeRoot(db);
}

function treeAction(db) {
  const root = rootRow(db);
  if (!root) return [];
  return [withChildren(db, root, new Set())];
}

function childrenAction(db, args) {
  const id = idOf(args.id !== undefined ? args.id : args.nodeId);
  if (!id || id === "0") {
    const root = rootRow(db);
    return root ? [withChildren(db, root, new Set())] : [];
  }
  const node = nodeById(db, id, false);
  if (!node) return [];
  return directChildren(db, node);
}

function multipleChildrenAction(db, args) {
  let ids = args.ids;
  if (typeof ids === "string") ids = ids.split(",").map(function (s) { return s.trim(); });
  if (!Array.isArray(ids)) ids = [];
  const out = [];
  for (const raw of ids) {
    const id = idOf(raw);
    if (!id || id === "0") {
      const root = rootRow(db);
      if (root) out.push({ id: "0", children: [withChildren(db, root, new Set())] });
      continue;
    }
    const node = nodeById(db, id, false);
    out.push({ id: id, children: node ? directChildren(db, node) : [] });
  }
  return out;
}

function pathAction(db, args) {
  const id = idOf(args.id !== undefined ? args.id : args.nodeId);
  const node = nodeById(db, id, true);
  if (!node) return [];
  const chain = [];
  let cur = node;
  let guard = 0;
  const seen = new Set();
  while (cur && guard++ < 200) {
    const key = String(cur.id);
    if (seen.has(key)) throw new Error("任务树存在环：" + key);
    seen.add(key);
    chain.push({ id: key, name: String(cur.name || ""), type: String(cur.type || "0") });
    if (String(cur.parent_id) === "0") break;
    cur = db.prepare("SELECT * FROM task_node WHERE id=?").get(String(cur.parent_id));
  }
  chain.reverse();
  return chain;
}

function createAction(db, args, origin, api) {
  const parentId = idOf(args.parentId !== undefined ? args.parentId : args.parent);
  const parent = nodeById(db, parentId, false);
  if (!parent) throw new Error("父节点不存在：" + (parentId || "(空)"));
  if (String(parent.type) === "1") throw new Error("任务表下面不能再建节点");
  const type = typeCode(args.type);
  if (type === "2") throw new Error("不能创建第二个根节点");
  const name = String(args.name === undefined || args.name === null || args.name === "" ? "未命名" : args.name).trim();
  if (!name) throw new Error("name 不能为空");
  if (name.length > 20) throw new Error("name 不能超过 20 个字符");
  const ts = now();
  const id = newId();
  const max = db.prepare("SELECT MAX(sort) AS m FROM task_node WHERE parent_id=? AND deleted_at IS NULL").get(String(parent.id));
  const sort = max && max.m !== null ? Number(max.m) + 1 : 0;
  const row = {
    id,
    name,
    type,
    parent_id: String(parent.id),
    path: String(parent.path || "/" + parent.id + "/") + id + "/",
    sort,
    depth: Number(parent.depth) + 1,
    created_at: ts,
    updated_at: ts,
    deleted_at: null,
    rev: 1,
  };
  tx(db, function () {
    insertNode(db, row);
    logChange(db, "task_node", id, "create", row, origin, ts);
  });
  api.emit("task-nodes-changed", { id: id, parentId: String(parent.id), op: "create" });
  return { node: rowNode(row, []) };
}

function renameAction(db, args, origin, api) {
  const id = idOf(args.id !== undefined ? args.id : args.nodeId);
  const node = nodeById(db, id, false);
  if (!node) throw new Error("节点不存在：" + (id || "(空)"));
  const name = String(args.name === undefined || args.name === null ? "" : args.name).trim();
  if (!name) throw new Error("name 不能为空");
  if (name.length > 20) throw new Error("name 不能超过 20 个字符");
  if (name === String(node.name)) throw new Error("新名称与旧名称相同");
  const ts = now();
  tx(db, function () {
    db.prepare("UPDATE task_node SET name=?, updated_at=?, rev=rev+1 WHERE id=?").run(name, ts, id);
    logChange(db, "task_node", id, "upsert", Object.assign({}, node, { name: name, updated_at: ts, rev: Number(node.rev) + 1 }), origin, ts);
  });
  api.emit("task-nodes-changed", { id: id, op: "rename" });
  return { node: rowNode(Object.assign({}, node, { name: name, updated_at: ts, rev: Number(node.rev) + 1 }), []) };
}

function resort(db, parentId, ts, origin) {
  const rows = db.prepare(
    "SELECT * FROM task_node WHERE parent_id=? AND deleted_at IS NULL ORDER BY sort ASC, id ASC",
  ).all(String(parentId));
  let i = 0;
  for (const row of rows) {
    if (Number(row.sort) !== i) {
      const next = Object.assign({}, row, { sort: i, updated_at: ts, rev: Number(row.rev) + 1 });
      db.prepare("UPDATE task_node SET sort=?, updated_at=?, rev=rev+1 WHERE id=?").run(i, ts, String(row.id));
      logChange(db, "task_node", String(row.id), "upsert", next, origin, ts);
    }
    i++;
  }
}

function moveAction(db, args, origin, api) {
  const sourceId = idOf(args.sourceId !== undefined ? args.sourceId : args.nodeToMoveId);
  const targetId = idOf(args.targetId !== undefined ? args.targetId : args.newParentId);
  const moveType = Number(args.moveType === undefined ? 0 : args.moveType);
  if (moveType !== 0 && moveType !== 2) throw new Error("moveType 只能是 0（作为子节点）或 2（作为同级）");
  const source = nodeById(db, sourceId, false);
  const target = nodeById(db, targetId, false);
  if (!source) throw new Error("要移动的节点不存在：" + (sourceId || "(空)"));
  if (!target) throw new Error("目标节点不存在：" + (targetId || "(空)"));
  if (String(source.id) === String(target.id)) throw new Error("不能移动到自己");
  if (String(source.parent_id) === "0") throw new Error("根节点不能移动");
  if (moveType === 2 && String(target.parent_id) === "0") throw new Error("不能把节点移动到根节点同级");
  if (String(target.path).indexOf(String(source.path)) === 0) throw new Error("不能移动到自己的子树中");

  const newParent = moveType === 0 ? target : nodeById(db, target.parent_id, false);
  if (!newParent) throw new Error("目标父节点不存在");
  if (String(newParent.type) === "1") throw new Error("任务表下面不能再挂节点");

  const oldParentId = String(source.parent_id);
  const siblings = db.prepare(
    "SELECT * FROM task_node WHERE parent_id=? AND deleted_at IS NULL AND id<>? ORDER BY sort ASC, id ASC",
  ).all(String(newParent.id), String(source.id));
  let newSort;
  if (moveType === 0) {
    newSort = siblings.length;
  } else {
    const idx = siblings.findIndex(function (n) { return String(n.id) === String(target.id); });
    newSort = idx < 0 ? siblings.length : idx + 1;
  }

  const newPath = String(newParent.path) + String(source.id) + "/";
  const delta = Number(newParent.depth) + 1 - Number(source.depth);
  const ts = now();
  const subtree = subtreeRows(db, source);

  tx(db, function () {
    for (const row of subtree) {
      const nextPath = String(row.id) === String(source.id)
        ? newPath
        : newPath + String(row.path).slice(String(source.path).length);
      const nextDepth = Number(row.depth) + delta;
      db.prepare(
        "UPDATE task_node SET parent_id=?, path=?, depth=?, sort=?, updated_at=?, rev=rev+1 WHERE id=?",
      ).run(
        String(row.id) === String(source.id) ? String(newParent.id) : String(row.parent_id),
        nextPath,
        nextDepth,
        String(row.id) === String(source.id) ? newSort : Number(row.sort),
        ts,
        String(row.id),
      );
      logChange(db, "task_node", String(row.id), "upsert", Object.assign({}, row, {
        parent_id: String(row.id) === String(source.id) ? String(newParent.id) : String(row.parent_id),
        path: nextPath,
        depth: nextDepth,
        sort: String(row.id) === String(source.id) ? newSort : Number(row.sort),
        updated_at: ts,
        rev: Number(row.rev) + 1,
      }), origin, ts);
    }

    const ordered = db.prepare(
      "SELECT * FROM task_node WHERE parent_id=? AND deleted_at IS NULL AND id<>? ORDER BY sort ASC, id ASC",
    ).all(String(newParent.id), String(source.id));
    ordered.splice(Math.max(0, Math.min(newSort, ordered.length)), 0, { id: String(source.id) });
    let i = 0;
    for (const row of ordered) {
      if (String(row.id) === String(source.id)) { i++; continue; }
      if (Number(row.sort) !== i) {
        const next = Object.assign({}, row, { sort: i, updated_at: ts, rev: Number(row.rev) + 1 });
        db.prepare("UPDATE task_node SET sort=?, updated_at=?, rev=rev+1 WHERE id=?").run(i, ts, String(row.id));
        logChange(db, "task_node", String(row.id), "upsert", next, origin, ts);
      }
      i++;
    }
    resort(db, oldParentId, ts, origin);
  });
  api.emit("task-nodes-changed", { id: String(source.id), parentId: String(newParent.id), op: "move" });
  return { ok: true, node: rowNode(nodeById(db, source.id, false), []) };
}

function deleteAction(db, args, origin, api) {
  const id = idOf(args.id !== undefined ? args.id : args.nodeId);
  const node = nodeById(db, id, false);
  if (!node) throw new Error("节点不存在：" + (id || "(空)"));
  if (String(node.parent_id) === "0") throw new Error("不能删除根节点");
  const rows = subtreeRows(db, node);
  const tableIds = rows.filter(function (r) { return String(r.type) === "1"; }).map(function (r) { return String(r.id); });
  let taskCount = 0;
  const ts = now();
  tx(db, function () {
    if (tableIds.length) {
      const marks = tableIds.map(function () { return "?"; }).join(",");
      const tasks = db.prepare("SELECT * FROM task WHERE deleted_at IS NULL AND table_id IN (" + marks + ")").all(...tableIds);
      for (const t of tasks) {
        const tomb = Object.assign({}, t, { deleted_at: ts, updated_at: ts, rev: Number(t.rev) + 1 });
        db.prepare("UPDATE task SET deleted_at=?, updated_at=?, rev=rev+1 WHERE id=?").run(ts, ts, String(t.id));
        logChange(db, "task", String(t.id), "delete", tomb, origin, ts);
        api.emit("tasks-changed", { id: String(t.id), op: "delete" });
        taskCount++;
      }
    }
    for (const row of rows) {
      const tomb = Object.assign({}, row, { deleted_at: ts, updated_at: ts, rev: Number(row.rev) + 1 });
      db.prepare("UPDATE task_node SET deleted_at=?, updated_at=?, rev=rev+1 WHERE id=?").run(ts, ts, String(row.id));
      logChange(db, "task_node", String(row.id), "delete", tomb, origin, ts);
    }
  });
  api.emit("task-nodes-changed", { id: id, op: "delete" });
  return { ok: true, deletedNodes: rows.length, deletedTasks: taskCount };
}

function renderTree(rows) {
  function walk(nodes, depth) {
    const out = [];
    for (const n of nodes) {
      out.push("  ".repeat(depth) + "- " + n.name + " (" + n.type + ", id=" + n.id + ")");
      if (n.children && n.children.length) out.push.apply(out, walk(n.children, depth + 1));
    }
    return out;
  }
  return walk(rows || [], 0).join("\n");
}

export function registerTreeActions(api) {
  const db = api.db;
  const action = api.action;

  action("taskNodes.tree", {
    description: "取完整任务树（根 id=1，含 children）",
    input: { type: "object", properties: {} },
    execute: function () { return treeAction(db); },
    render: renderTree,
  });

  action("taskNodes.children", {
    description: "取某节点的直接子节点；id=0 返回根节点整棵树",
    input: { type: "object", properties: { id: { type: ["string", "number"] } } },
    execute: function (args) { return childrenAction(db, args || {}); },
    render: renderTree,
  });

  action("taskNodes.multipleChildren", {
    description: "一次取多个节点的直接子节点，返回 [{id,children}]",
    input: { type: "object", properties: { ids: { type: "array", items: { type: ["string", "number"] } } } },
    execute: function (args) { return multipleChildrenAction(db, args || {}); },
    render: function (rows) {
      return (rows || []).map(function (r) { return r.id + ": " + r.children.length + " 个直接子节点"; }).join("\n");
    },
  });

  action("taskNodes.path", {
    description: "取根到某节点的路径（含 id/name/type）",
    input: { type: "object", properties: { id: { type: ["string", "number"] } } },
    execute: function (args) { return pathAction(db, args || {}); },
    render: function (rows) {
      return (rows || []).map(function (r) { return r.name; }).join(" / ");
    },
  });

  action("taskNodes.create", {
    description: "在任务组/根节点下新建 GROUP 或 TABLE 节点",
    input: {
      type: "object",
      properties: {
        parentId: { type: ["string", "number"] },
        type: { type: ["string", "number"] },
        name: { type: "string" },
      },
    },
    execute: function (args, ctx) { return createAction(db, args || {}, ctx.origin, api); },
    render: function (r) { return "已新建节点：" + r.node.name + "（id=" + r.node.id + "）"; },
  });

  action("taskNodes.rename", {
    description: "重命名任务组/任务表",
    input: { type: "object", properties: { id: { type: ["string", "number"] }, name: { type: "string" } } },
    execute: function (args, ctx) { return renameAction(db, args || {}, ctx.origin, api); },
    render: function (r) { return "已重命名为：" + r.node.name; },
  });

  action("taskNodes.move", {
    description: "移动节点；moveType=0 作为目标子节点，2 作为目标同级（目标之后）",
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
    render: function (r) { return "已移动节点：" + r.node.id; },
  });

  action("taskNodes.delete", {
    description: "删除节点及其子树；子树内任务表下的任务会被软删",
    input: { type: "object", properties: { id: { type: ["string", "number"] } } },
    execute: function (args, ctx) { return deleteAction(db, args || {}, ctx.origin, api); },
    render: function (r) { return "已删除 " + r.deletedNodes + " 个节点、" + r.deletedTasks + " 条任务"; },
  });
}
