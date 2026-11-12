import limits from '../../shared/tree/limits.cjs';
const { NAME_MAX } = limits;
import { taskTransaction } from '../task/write/task-transaction.js';
import { insertOwnedNode, validateNodePlacement } from './task-node-write.js';
import { pathFromMap } from '../task/model/task-ownership-path.js';
import { nodeMap } from '../db/db.js';
/**
 * 任务树 action：邻接表 + 路径枚举 + sort + depth。
 *
 * 对外仍保持旧前端契约：根节点 id=1、parent=0、type='2'（ROOT_GROUP），
 * 叶子节点 type='1'（TABLE），组节点 type='0'（GROUP）。
 */

import {
  now,
  idOf,
  tx,
  logChange,
  rowNode,
  childrenOf,
  treeRoot,
} from "../db/db.js";

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

function nodeDescription(value) {
  if (value === undefined || value === null) return "";
  const text = String(value);
  if (text.length > 2000) throw new Error("description 不能超过 2000 个字符");
  return text;
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
    chain.push({
      id: key,
      name: String(cur.name || ""),
      type: String(cur.type || "0"),
      description: String(cur.description || ""),
    });
    if (String(cur.parent_id) === "0") break;
    cur = db.prepare("SELECT * FROM task_node WHERE id=?").get(String(cur.parent_id));
  }
  chain.reverse();
  return chain;
}

function createAction(db, args, origin, api) {
  return taskTransaction(db,api,buffered => {
    const parentId = idOf(args.parentId !== undefined ? args.parentId : args.parent);
    const name = String(args.name === undefined || args.name === null || args.name === "" ? "未命名" : args.name).trim();
    const row = insertOwnedNode(db,parentId,name,typeCode(args.type),nodeDescription(args.description),origin);
    buffered.emit('task-nodes-changed',{id:row.id,parentId,op:'create'});
    return {node:rowNode(row,[])};
  });
}

function renameAction(db, args, origin, api, inside = false) {
  if (!inside) return taskTransaction(db,api,buffered => renameAction(db,args,origin,buffered,true));
  const write = (_db,body) => body();
  const id = idOf(args.id !== undefined ? args.id : args.nodeId);
  const node = nodeById(db, id, false);
  if (!node) throw new Error("节点不存在：" + (id || "(空)"));
  const name = String(args.name === undefined || args.name === null ? "" : args.name).trim();
  if (!name) throw new Error("name 不能为空");
  if (name.length > NAME_MAX) throw new Error(`name 不能超过 ${NAME_MAX} 个字符`);
  if (name === String(node.name)) throw new Error("新名称与旧名称相同");
  pathFromMap(node.id,nodeMap(db));
  if (String(node.parent_id) !== '0') validateNodePlacement(db,node.parent_id,name,node.id);
  const ts = now();
  write(db, function () {
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

function moveAction(db, args, origin, api, inside = false) {
  if (!inside) return taskTransaction(db,api,buffered => moveAction(db,args,origin,buffered,true));
  const write = (_db,body) => body();
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

  const sourceChain = pathFromMap(source.id,nodeMap(db));
  const parentChain = pathFromMap(newParent.id,nodeMap(db));
  if (parentChain.pathSegments.some(n=>n.id === String(source.id))) throw new Error('不能移动到自己的子树中');
  validateNodePlacement(db,newParent.id,source.name,source.id);
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

  write(db, function () {
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

/** 按关键词同时匹配节点名称与描述（表描述命中即可定位表）。 */
function searchNodesAction(db, args) {
  const keyword = String(args.keyword === undefined || args.keyword === null ? "" : args.keyword).trim();
  if (!keyword) throw new Error("keyword 不能为空");
  const limit = Math.min(200, Math.max(1, Number(args.limit) || 20));
  const withTasks = args.includeTasks !== false;
  const like = "%" + keyword.replace(/[\\%_]/g, function (c) { return "\\" + c; }) + "%";
  const rows = db.prepare(
    "SELECT * FROM task_node WHERE deleted_at IS NULL AND (name LIKE ? ESCAPE '\\' OR description LIKE ? ESCAPE '\\') ORDER BY depth ASC, sort ASC, id ASC LIMIT ?",
  ).all(like, like, limit);
  const nodes = rows.map(function (row) {
    const out = {
      id: String(row.id),
      name: String(row.name || ""),
      type: String(row.type || "0"),
      description: String(row.description || ""),
      depth: Number(row.depth || 0),
      path: pathAction(db, { id: row.id }),
      taskCount: countTasksUnder(db, row),
    };
    if (withTasks && String(row.type) === "1") {
      out.tasks = db.prepare(
        "SELECT id, title, status, priority FROM task WHERE table_id=? AND deleted_at IS NULL ORDER BY publish_date DESC, id DESC LIMIT ?",
      ).all(String(row.id), limit);
    }
    return out;
  });
  return { keyword, total: nodes.length, nodes };
}

/** 某节点子树（含自身）下的任务数。 */
function countTasksUnder(db, node) {
  const row = db.prepare(
    "SELECT COUNT(*) AS n FROM task t JOIN task_node n ON n.id=t.table_id " +
      "WHERE t.deleted_at IS NULL AND n.deleted_at IS NULL AND n.path LIKE ?",
  ).get(String(node.path) + "%");
  return row ? Number(row.n || 0) : 0;
}

function updateNodeAction(db, args, origin, api, inside = false) {
  if (!inside) return taskTransaction(db,api,buffered => updateNodeAction(db,args,origin,buffered,true));
  const write = (_db,body) => body();
  const id = idOf(args.id !== undefined ? args.id : args.nodeId);
  const node = nodeById(db, id, false);
  if (!node) throw new Error("节点不存在：" + (id || "(空)"));
  pathFromMap(node.id,nodeMap(db));
  const hasName = args.name !== undefined;
  const hasDesc = args.description !== undefined;
  if (!hasName && !hasDesc) throw new Error("需要至少提供 name 或 description");
  const next = Object.assign({}, node);
  if (hasName) {
    const name = String(args.name === null ? "" : args.name).trim();
    if (!name) throw new Error("name 不能为空");
    if (name.length > NAME_MAX) throw new Error(`name 不能超过 ${NAME_MAX} 个字符`);
    if (name !== String(node.name)) {
      if (String(node.parent_id) !== '0') validateNodePlacement(db,node.parent_id,name,node.id);
      next.name = name;
    }
  }
  if (hasDesc) next.description = nodeDescription(args.description);
  const nameChanged = String(next.name) !== String(node.name);
  const descChanged = String(next.description || "") !== String(node.description || "");
  if (!nameChanged && !descChanged) return { ok: true, changed: false, node: rowNode(node, []) };
  const ts = now();
  next.updated_at = ts;
  next.rev = Number(node.rev) + 1;
  write(db, function () {
    db.prepare("UPDATE task_node SET name=?, description=?, updated_at=?, rev=rev+1 WHERE id=?").run(
      String(next.name),
      String(next.description || ""),
      ts,
      id,
    );
    logChange(db, "task_node", id, "upsert", next, origin, ts);
  });
  api.emit("task-nodes-changed", { id: id, op: "update" });
  return { ok: true, changed: true, node: rowNode(next, []) };
}

function renderTree(rows) {
  function walk(nodes, depth) {
    const out = [];
    for (const n of nodes) {
      const desc = String(n.description || "").trim();
      const brief = desc.length > 60 ? desc.slice(0, 60) + "…" : desc;
      out.push(
        "  ".repeat(depth) + "- " + n.name + (brief ? "（" + brief + "）" : "") + " (" + n.type + ", id=" + n.id + ")",
      );
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
    input: { type: "object", properties: { id: { type: ["string", "number"] }, nodeId: { type: ["string", "number"], description: "id 的别名" } } },
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
    input: { type: "object", properties: { id: { type: ["string", "number"] }, nodeId: { type: ["string", "number"], description: "id 的别名" } } },
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
        name: { type: "string", maxLength: NAME_MAX, description: `名称最多 ${NAME_MAX} 个字符（JS length）` },
        description: { type: "string", description: "表/组描述，可多行；表描述可用于按关键词定位表，最长 2000 字" },
      },
    },
    execute: function (args, ctx) { return createAction(db, args || {}, ctx.origin, api); },
    render: function (r) { return "已新建节点：" + r.node.name + "（id=" + r.node.id + "）"; },
  });

  action("taskNodes.rename", {
    description: "重命名任务组/任务表",
    input: { type: "object", properties: { id: { type: ["string", "number"] }, nodeId: { type: ["string", "number"], description: "id 的别名" }, name: { type: "string", maxLength: NAME_MAX, description: `名称最多 ${NAME_MAX} 个字符（JS length）` } } },
    execute: function (args, ctx) { return renameAction(db, args || {}, ctx.origin, api); },
    render: function (r) { return "已重命名为：" + r.node.name; },
  });

  action("taskNodes.update", {
    description: "更新任务组/任务表的名称与描述（可只传其一；description 传空串即清空）",
    input: {
      type: "object",
      properties: {
        id: { type: ["string", "number"] },
        nodeId: { type: ["string", "number"], description: "id 的别名" },
        name: { type: "string", maxLength: NAME_MAX, description: `新名称，最多 ${NAME_MAX} 个字符（JS length）；不传则不改` },
        description: { type: "string", description: "新描述，可多行空串清空；不传则不改，≤2000 字" },
      },
    },
    execute: function (args, ctx) { return updateNodeAction(db, args || {}, ctx.origin, api); },
    render: function (r) {
      if (!r) return "";
      return (r.changed ? "已更新节点：" : "节点无变化：") + r.node.name + (r.node.description ? "（" + String(r.node.description).slice(0, 60) + "）" : "");
    },
  });

  action("taskNodes.search", {
    description: "按关键词同时匹配节点名称与描述，返回命中的表/组（含路径、描述、任务数；表默认附带其下任务）",
    input: {
      type: "object",
      properties: {
        keyword: { type: "string", description: "关键词，匹配 name 与 description" },
        limit: { type: "number", description: "最多返回多少个节点，默认 20，最大 200" },
        includeTasks: { type: "boolean", description: "命中任务表时是否附带其下任务，默认 true" },
      },
      required: ["keyword"],
    },
    execute: function (args) { return searchNodesAction(db, args || {}); },
    render: function (r) {
      if (!r) return "";
      if (!r.nodes.length) return "未命中任务表/组：" + r.keyword;
      return r.nodes.map(function (n) {
        const names = (n.path || []).map(function (p) { return p.name; }).join(" / ");
        return "- " + n.name + "（" + n.taskCount + " 条任务）" + (n.description ? "：" + String(n.description).slice(0, 80) : "") + "\n  路径：" + names + " · id=" + n.id;
      }).join("\n");
    },
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
    input: { type: "object", properties: { id: { type: ["string", "number"] }, nodeId: { type: ["string", "number"], description: "id 的别名" } } },
    execute: function (args, ctx) { return deleteAction(db, args || {}, ctx.origin, api); },
    render: function (r) { return "已删除 " + r.deletedNodes + " 个节点、" + r.deletedTasks + " 条任务"; },
  });
}
