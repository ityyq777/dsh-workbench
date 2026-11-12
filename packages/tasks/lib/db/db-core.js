/**
 * 任务子插件：schema、迁移、通用行转换。
 *
 * 只依赖 api.db（node:sqlite DatabaseSync）。不 import 宿主模块。
 */

import { TIMELINE_DDL } from "./timeline-schema.js";
import { WORKSPACE_DDL } from "./workspace-schema.js";
export const TASK_TABLE = "task";
export const NODE_TABLE = "task_node";

export const TASK_DDL = [
  "CREATE TABLE IF NOT EXISTS task (" +
    "id TEXT PRIMARY KEY," +
    "title TEXT NOT NULL," +
    "description TEXT NOT NULL DEFAULT ''," +
    "status TEXT NOT NULL DEFAULT '0'," +
    "priority INTEGER NOT NULL DEFAULT 0," +
    "difficulty REAL," +
    "review TEXT NOT NULL DEFAULT ''," +
    "table_id TEXT NOT NULL," +
    "timeline_key TEXT," +
    "restart_key TEXT," +
    "publish_date TEXT NOT NULL," +
    "target_date TEXT NOT NULL," +
    "done_date TEXT," +
    "shutdown_date TEXT," +
    "dedupe_key TEXT," +
    "created_at INTEGER NOT NULL," +
    "updated_at INTEGER NOT NULL," +
    "deleted_at INTEGER," +
    "rev INTEGER NOT NULL DEFAULT 1," +
    "owner TEXT," +
    "claimed_at INTEGER," +
    "claim_token TEXT" +
    ");",
  "CREATE INDEX IF NOT EXISTS idx_task_table_id ON task(table_id);",
  "CREATE INDEX IF NOT EXISTS idx_task_status ON task(status);",
  "CREATE INDEX IF NOT EXISTS idx_task_updated_at ON task(updated_at);",
  "CREATE INDEX IF NOT EXISTS idx_task_timeline ON task(timeline_key);",
  "CREATE INDEX IF NOT EXISTS idx_task_restart ON task(restart_key);",
  "CREATE INDEX IF NOT EXISTS idx_task_open ON task(status, target_date) WHERE deleted_at IS NULL;",
  "CREATE INDEX IF NOT EXISTS idx_task_dedupe ON task(dedupe_key) WHERE dedupe_key IS NOT NULL;",
  "CREATE INDEX IF NOT EXISTS idx_task_created_at ON task(created_at);",
  "CREATE INDEX IF NOT EXISTS idx_task_done_date ON task(done_date);",
];

export const NODE_DDL = [
  "CREATE TABLE IF NOT EXISTS task_node (" +
    "id TEXT PRIMARY KEY," +
    "name TEXT NOT NULL," +
    "description TEXT NOT NULL DEFAULT ''," +
    "type TEXT NOT NULL," +
    "parent_id TEXT NOT NULL DEFAULT '0'," +
    "path TEXT NOT NULL," +
    "sort INTEGER NOT NULL DEFAULT 0," +
    "depth INTEGER NOT NULL DEFAULT 0," +
    "created_at INTEGER NOT NULL," +
    "updated_at INTEGER NOT NULL," +
    "deleted_at INTEGER," +
    "rev INTEGER NOT NULL DEFAULT 1" +
    ");",
  "CREATE INDEX IF NOT EXISTS idx_task_node_parent ON task_node(parent_id);",
  "CREATE INDEX IF NOT EXISTS idx_task_node_path ON task_node(path);",
  "CREATE INDEX IF NOT EXISTS idx_task_node_sort ON task_node(parent_id, sort);",
  "CREATE INDEX IF NOT EXISTS idx_task_node_type ON task_node(type);",
];

let lastTs = 0;
let clockNow = null;

/** 宿主注入同步时钟；未注入时退回本地单调时钟。 */
export function bindClock(fn) {
  clockNow = typeof fn === "function" ? fn : null;
}

export function now() {
  if (clockNow) return clockNow();
  const t = Date.now();
  if (t <= lastTs) {
    lastTs += 1;
    return lastTs;
  }
  lastTs = t;
  return t;
}

export function newId() {
  const bytes = new Uint8Array(16);
  globalThis.crypto.getRandomValues(bytes);
  let ts = Date.now();
  for (let i = 5; i >= 0; i--) {
    bytes[i] = ts % 256;
    ts = Math.floor(ts / 256);
  }
  bytes[6] = (bytes[6] & 0x0f) | 0x70;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, function (b) {
    return b.toString(16).padStart(2, "0");
  }).join("");
  return hex.slice(0, 8) + "-" + hex.slice(8, 12) + "-" + hex.slice(12, 16) + "-" + hex.slice(16, 20) + "-" + hex.slice(20);
}

export function idOf(v) {
  if (v === undefined || v === null || v === "") return "";
  return String(v);
}

export function todayStr() {
  const d = new Date();
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}

export function addDays(dateText, days) {
  const d = new Date(String(dateText) + "T00:00:00");
  d.setDate(d.getDate() + Number(days || 0));
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}

export function dateText(value) {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value === "number") {
    if (!Number.isFinite(value)) return null;
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return null;
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }
  const s = String(value).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  const normalized = s.replace(" ", "T");
  const d = new Date(normalized);
  if (!Number.isNaN(d.getTime())) {
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }
  return /^\d{4}-\d{2}-\d{2}/.test(s) ? s.slice(0, 10) : null;
}

export function timeMs(value, fallback) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (value === undefined || value === null || value === "") return fallback;
  const s = String(value).trim();
  const d = new Date(s.replace(" ", "T"));
  if (!Number.isNaN(d.getTime())) return d.getTime();
  const d2 = new Date(s);
  if (!Number.isNaN(d2.getTime())) return d2.getTime();
  return fallback;
}

export function tableExists(db, name) {
  try {
    return !!db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name=?").get(String(name));
  } catch {
    return false;
  }
}

export function quoteIdent(name) {
  return '"' + String(name).replace(/"/g, '""') + '"';
}

export function dropIndexesFor(db, table) {
  const rows = db.prepare("SELECT name FROM sqlite_master WHERE type='index' AND tbl_name=? AND name NOT LIKE 'sqlite_%'").all(String(table));
  for (const row of rows) {
    db.exec("DROP INDEX IF EXISTS " + quoteIdent(row.name));
  }
}

export function columnsOf(db, name) {
  if (!tableExists(db, name)) return [];
  try {
    return db.prepare("PRAGMA table_info(" + quoteIdent(name) + ")").all().map(function (r) {
      return String(r.name);
    });
  } catch {
    return [];
  }
}

export function hasColumn(db, table, column) {
  return columnsOf(db, table).indexOf(column) >= 0;
}

export function metaGet(db, key) {
  try {
    const row = db.prepare("SELECT v FROM meta WHERE k=?").get(String(key));
    return row ? String(row.v) : null;
  } catch {
    return null;
  }
}

export function metaSet(db, key, value) {
  db.prepare("INSERT INTO meta(k,v) VALUES(?,?) ON CONFLICT(k) DO UPDATE SET v=excluded.v").run(String(key), String(value));
}

export function tx(db, fn) {
  db.exec("BEGIN IMMEDIATE");
  try {
    const result = fn();
    db.exec("COMMIT");
    return result;
  } catch (e) {
    try {
      db.exec("ROLLBACK");
    } catch {
      /* ignore rollback failure */
    }
    throw e;
  }
}

export function logChange(db, table, rowId, op, payload, origin, ts) {
  if (String(origin || "ui") === "sync") return;
  let value = payload;
  if (String(op) === "delete" && (value === undefined || value === null)) {
    try {
      const row = db.prepare("SELECT * FROM " + String(table) + " WHERE id=?").get(String(rowId));
      if (row) value = row;
    } catch (err) {
      // 表不存在或列不匹配时仍记录墓碑时间和 id。
    }
  }
  const p = value === undefined ? null : typeof value === "string" ? value : JSON.stringify(value);
  db.prepare(
    "INSERT INTO sync_change_log(table_name,row_id,op,payload,origin,updated_at) VALUES(?,?,?,?,?,?)",
  ).run(String(table), String(rowId), String(op), p, String(origin || "ui"), Number(ts || now()));
}

export function rowTask(row) {
  if (!row) return null;
  return {
    id: String(row.id),
    title: String(row.title || ""),
    description: String(row.description || ""),
    status: String(row.status || "0"),
    priority: Number(row.priority || 0),
    difficulty: row.difficulty === null || row.difficulty === undefined ? null : Number(row.difficulty),
    review: String(row.review || ""),
    tableId: String(row.table_id || ""),
    timelineKey: row.timeline_key === null || row.timeline_key === undefined ? null : String(row.timeline_key),
    restartKey: row.restart_key === null || row.restart_key === undefined ? null : String(row.restart_key),
    publishDate: row.publish_date || null,
    targetDate: row.target_date || null,
    doneDate: row.done_date || null,
    shutdownDate: row.shutdown_date || null,
    dedupeKey: row.dedupe_key === null || row.dedupe_key === undefined ? null : String(row.dedupe_key),
    claimedBy: row.owner === null || row.owner === undefined ? null : String(row.owner),
    claimedAt: row.claimed_at === null || row.claimed_at === undefined ? null : Number(row.claimed_at),
    claimToken: row.claim_token === null || row.claim_token === undefined ? null : String(row.claim_token),
    path: [],
  };
}

export function rowNode(row, children) {
  if (!row) return null;
  return {
    id: String(row.id),
    name: String(row.name || ""),
    description: String(row.description || ""),
    type: String(row.type || "0"),
    parent: String(row.parent_id || "0"),
    parentId: String(row.parent_id || "0"),
    path: String(row.path || ""),
    sort: Number(row.sort || 0),
    depth: Number(row.depth || 0),
    children: Array.isArray(children) ? children : [],
  };
}

export function nodeMap(db) {
  const rows = db.prepare("SELECT * FROM task_node").all();
  const map = new Map();
  for (const row of rows) map.set(String(row.id), row);
  map.timelines = new Map(db.prepare('SELECT l.task_id,e.* FROM task_timeline_link l JOIN task_timeline e ON e.id=l.timeline_id JOIN task t ON t.id=l.task_id WHERE l.deleted_at IS NULL AND e.deleted_at IS NULL AND t.deleted_at IS NULL').all().map(r=>[String(r.task_id),r]));
  return map;
}

export function pathForTable(tableId, map) {
  const id = idOf(tableId);
  const node = map.get(id);
  if (!node) return [];
  const ids = String(node.path || "").split("/").filter(Boolean);
  if (!ids.length) {
    const chain = [];
    let cur = node;
    let guard = 0;
    while (cur && guard++ < 100) {
      chain.push(cur);
      if (String(cur.parent_id) === "0") break;
      cur = map.get(String(cur.parent_id));
    }
    chain.reverse();
    return chain.map(function (n) {
      return { id: String(n.id), name: String(n.name || ""), type: String(n.type || "0"), description: String(n.description || "") };
    });
  }
  const out = [];
  for (const part of ids) {
    const n = map.get(part);
    if (n) out.push({ id: String(n.id), name: String(n.name || ""), type: String(n.type || "0"), description: String(n.description || "") });
  }
  return out;
}

import { pathFromMap } from './ownership-path.js';
export function taskOut(row, map) {
  const t = rowTask(row);
  if (!t) return null;
  const nodes = map || new Map();
  const timeline = nodes.timelines?.get(String(row.id));
  t.timelineId = t.timelineKey = timeline?.id ?? null;
  t.timelineTitle = timeline?.title ?? null;
  t.timelineDescription = timeline?.description ?? null;
  t.path = pathForTable(t.tableId, nodes);
  const table = nodes.get(String(t.tableId));
  t.tableId = String(t.tableId || "");
  t.tableName = table ? String(table.name || "") : "";
  t.tableDescription = table ? String(table.description || "") : "";
  try { const derived = pathFromMap(t.tableId, nodes); t.tablePath = derived.tablePath; t.pathSegments = derived.pathSegments; }
  catch (error) { t.tablePath = null; t.pathSegments = []; t.ownershipDiagnostic = { code:error.code, message:error.message }; }
  return t;
}

export function childrenOf(db, parentId, includeDeleted) {
  const where = includeDeleted ? "" : " AND deleted_at IS NULL";
  return db.prepare(
    "SELECT * FROM task_node WHERE parent_id=?" + where + " ORDER BY sort ASC, id ASC",
  ).all(String(parentId));
}

export function allNodes(db, includeDeleted) {
  const where = includeDeleted ? "" : " WHERE deleted_at IS NULL";
  return db.prepare("SELECT * FROM task_node" + where + " ORDER BY sort ASC, id ASC").all();
}

export function treeRoot(db) {
  const root = db.prepare("SELECT * FROM task_node WHERE parent_id='0' AND deleted_at IS NULL ORDER BY id ASC LIMIT 1").get();
  return root || null;
}

export function pickFreeId(db, start) {
  let n = Math.max(1, Number(start) || 1);
  for (let i = 0; i < 10000; i++) {
    const id = String(n + i);
    if (!db.prepare("SELECT 1 AS x FROM task_node WHERE id=?").get(id)) return id;
  }
  return newId();
}

export function insertNode(db, row) {
  db.prepare(
    "INSERT INTO task_node(id,name,description,type,parent_id,path,sort,depth,created_at,updated_at,deleted_at,rev) " +
      "VALUES(?,?,?,?,?,?,?,?,?,?,?,?)",
  ).run(
    String(row.id),
    String(row.name),
    String(row.description === undefined || row.description === null ? "" : row.description),
    String(row.type),
    String(row.parent_id || "0"),
    String(row.path),
    Number(row.sort || 0),
    Number(row.depth || 0),
    Number(row.created_at || now()),
    Number(row.updated_at || row.created_at || now()),
    row.deleted_at === undefined ? null : row.deleted_at,
    Number(row.rev || 1),
  );
}

export function createSchema(db) {
  for (const sql of TASK_DDL) db.exec(sql);
  for (const sql of NODE_DDL) db.exec(sql);
  for (const sql of TIMELINE_DDL) db.exec(sql);
  for (const sql of WORKSPACE_DDL) db.exec(sql);
}

export function seedDefaultTree(db) {
  const ts = now();
  let root = db.prepare("SELECT * FROM task_node WHERE id='1'").get();
  if (!root) {
    root = {
      id: "1",
      name: "全部任务组",
      type: "2",
      parent_id: "0",
      path: "/1/",
      sort: 0,
      depth: 0,
      created_at: ts,
      updated_at: ts,
      deleted_at: null,
      rev: 1,
    };
    insertNode(db, root);
  } else if (String(root.type) !== "2" && String(root.parent_id) === "0") {
    db.prepare("UPDATE task_node SET type='2', path='/1/', depth=0, updated_at=? WHERE id='1'").run(ts);
  }

  const table = db.prepare("SELECT * FROM task_node WHERE type='1' AND deleted_at IS NULL ORDER BY depth ASC, sort ASC LIMIT 1").get();
  if (!table) {
    const groupId = pickFreeId(db, 2);
    const group = {
      id: groupId,
      name: "默认任务组",
      type: "0",
      parent_id: "1",
      path: "/1/" + groupId + "/",
      sort: 0,
      depth: 1,
      created_at: ts,
      updated_at: ts,
      deleted_at: null,
      rev: 1,
    };
    insertNode(db, group);
    const tableId = pickFreeId(db, Number(groupId) + 1);
    const tableNode = {
      id: tableId,
      name: "默认任务表",
      type: "1",
      parent_id: groupId,
      path: group.path + tableId + "/",
      sort: 0,
      depth: 2,
      created_at: ts,
      updated_at: ts,
      deleted_at: null,
      rev: 1,
    };
    insertNode(db, tableNode);
  }
}
