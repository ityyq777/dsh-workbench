/**
 * 任务子插件：schema、迁移、通用行转换。
 *
 * 只依赖 api.db（node:sqlite DatabaseSync）。不 import 宿主模块。
 */

export const TASK_TABLE = "task";
export const NODE_TABLE = "task_node";

export const TASK_DDL = [
  "CREATE TABLE IF NOT EXISTS task (" +
    "id TEXT PRIMARY KEY," +
    "title TEXT NOT NULL," +
    "description TEXT NOT NULL DEFAULT ''," +
    "status TEXT NOT NULL DEFAULT '0'," +
    "type TEXT NOT NULL DEFAULT '0'," +
    "priority INTEGER NOT NULL DEFAULT 0," +
    "difficulty REAL," +
    "table_id TEXT NOT NULL," +
    "timeline_key TEXT," +
    "restart_key TEXT," +
    "publish_date TEXT NOT NULL," +
    "target_date TEXT NOT NULL," +
    "done_date TEXT," +
    "shutdown_date TEXT," +
    "created_at INTEGER NOT NULL," +
    "updated_at INTEGER NOT NULL," +
    "deleted_at INTEGER," +
    "rev INTEGER NOT NULL DEFAULT 1" +
    ");",
  "CREATE INDEX IF NOT EXISTS idx_task_table_id ON task(table_id);",
  "CREATE INDEX IF NOT EXISTS idx_task_status ON task(status);",
  "CREATE INDEX IF NOT EXISTS idx_task_updated_at ON task(updated_at);",
  "CREATE INDEX IF NOT EXISTS idx_task_timeline ON task(timeline_key);",
  "CREATE INDEX IF NOT EXISTS idx_task_restart ON task(restart_key);",
  "CREATE INDEX IF NOT EXISTS idx_task_open ON task(status, target_date) WHERE deleted_at IS NULL;",
];

export const NODE_DDL = [
  "CREATE TABLE IF NOT EXISTS task_node (" +
    "id TEXT PRIMARY KEY," +
    "name TEXT NOT NULL," +
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

export function now() {
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

function quoteIdent(name) {
  return '"' + String(name).replace(/"/g, '""') + '"';
}

function dropIndexesFor(db, table) {
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
  const p = payload === undefined ? null : typeof payload === "string" ? payload : JSON.stringify(payload);
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
    type: String(row.type || "0"),
    priority: Number(row.priority || 0),
    difficulty: row.difficulty === null || row.difficulty === undefined ? null : Number(row.difficulty),
    tableId: String(row.table_id || ""),
    timelineKey: row.timeline_key === null || row.timeline_key === undefined ? null : String(row.timeline_key),
    restartKey: row.restart_key === null || row.restart_key === undefined ? null : String(row.restart_key),
    publishDate: row.publish_date || null,
    targetDate: row.target_date || null,
    doneDate: row.done_date || null,
    shutdownDate: row.shutdown_date || null,
    path: [],
  };
}

export function rowNode(row, children) {
  if (!row) return null;
  return {
    id: String(row.id),
    name: String(row.name || ""),
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
      return { id: String(n.id), name: String(n.name || ""), type: String(n.type || "0") };
    });
  }
  const out = [];
  for (const part of ids) {
    const n = map.get(part);
    if (n) out.push({ id: String(n.id), name: String(n.name || ""), type: String(n.type || "0") });
  }
  return out;
}

export function taskOut(row, map) {
  const t = rowTask(row);
  if (!t) return null;
  t.path = pathForTable(t.tableId, map || new Map());
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
    "INSERT INTO task_node(id,name,type,parent_id,path,sort,depth,created_at,updated_at,deleted_at,rev) " +
      "VALUES(?,?,?,?,?,?,?,?,?,?,?)",
  ).run(
    String(row.id),
    String(row.name),
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

function legacyName(base, ts) {
  const d = new Date(ts);
  const pad = function (n) {
    return String(n).padStart(2, "0");
  };
  let name = base + "_legacy_" + d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()) + "_" + pad(d.getHours()) + pad(d.getMinutes()) + pad(d.getSeconds());
  let i = 1;
  while (tableExists(name)) {
    name = base + "_legacy_" + (i++);
  }
  return name;
}

function pick(obj, keys) {
  if (!obj) return undefined;
  for (const k of keys) {
    if (obj[k] !== undefined && obj[k] !== null && obj[k] !== "") return obj[k];
  }
  return undefined;
}

function validStatus(v) {
  const s = String(v);
  return ["0", "1", "2", "3"].indexOf(s) >= 0 ? s : "0";
}

function validType(v) {
  const s = String(v);
  return ["0", "1", "2", "3"].indexOf(s) >= 0 ? s : "0";
}

function clampPriority(v) {
  const n = Number(v);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(10, Math.round(n)));
}

function clampDifficulty(v) {
  if (v === undefined || v === null || v === "") return null;
  const n = Number(v);
  if (!Number.isFinite(n)) return null;
  return Math.max(0, Math.min(5, n));
}

function buildLegacyPlan(oldNodes, oldTasks, ts, report) {
  const byId = new Map();
  for (const n of oldNodes || []) {
    if (n && n.id !== undefined && n.id !== null) byId.set(String(n.id), n);
  }

  const rootOld = byId.get("1");
  if (rootOld) {
    const p = String(rootOld.parent === undefined || rootOld.parent === null ? "0" : rootOld.parent);
    if (p !== "0" && byId.has(p)) {
      throw new Error("旧 task_node 的 id=1 不是根节点，无法安全迁移");
    }
  }

  const rows = [];
  const children = new Map();
  function addChild(parent, node) {
    if (!children.has(parent)) children.set(parent, []);
    children.get(parent).push(node);
  }

  for (const n of oldNodes || []) {
    const id = String(n.id);
    if (id === "1") {
      addChild("0", n);
      continue;
    }
    let parent = n.parent === undefined || n.parent === null ? "0" : String(n.parent);
    if (parent === "0" || !byId.has(parent)) {
      report.orphanNodes += 1;
      parent = "1";
    }
    n.__parent = parent;
    addChild(parent, n);
  }

  let syntheticRoot = null;
  if (!rootOld) {
    syntheticRoot = {
      id: "1",
      name: "全部任务组",
      type: "2",
      parent: "0",
      __parent: "0",
      create_time: ts,
      update_time: ts,
    };
    addChild("0", syntheticRoot);
  }

  const seen = new Set();
  function walk(id, parentPath, depth, sort) {
    if (seen.has(id)) throw new Error("旧 task_node 存在环：" + id);
    seen.add(id);
    const old = id === "1" && syntheticRoot ? syntheticRoot : byId.get(id);
    if (!old) return;
    const type = id === "1" ? "2" : String(old.type) === "1" ? "1" : "0";
    const name = String(old.name || (id === "1" ? "全部任务组" : "未命名"));
    const path = parentPath + id + "/";
    const created = timeMs(pick(old, ["create_time", "created_at"]), ts);
    const updated = timeMs(pick(old, ["update_time", "updated_at"]), created);
    rows.push({
      id,
      name,
      type,
      parent_id: id === "1" ? "0" : String(old.__parent || "1"),
      path,
      sort,
      depth,
      created_at: created,
      updated_at: updated,
      deleted_at: null,
      rev: 1,
    });
    const kids = (children.get(id) || []).slice().sort(function (a, b) {
      const al = Number(a.lft);
      const bl = Number(b.lft);
      if (Number.isFinite(al) && Number.isFinite(bl) && al !== bl) return al - bl;
      return String(a.id).localeCompare(String(b.id), "en");
    });
    let i = 0;
    for (const kid of kids) {
      walk(String(kid.id), path, depth + 1, i++);
    }
  }

  const rootChildren = (children.get("0") || []).filter(function (n) {
    return String(n.id) === "1";
  });
  if (!rootChildren.length) throw new Error("旧 task_node 没有可用的根节点");
  walk("1", "/", 0, 0);

  const leftover = Array.from(byId.keys()).filter(function (id) {
    return !seen.has(id);
  });
  if (leftover.length) {
    throw new Error("旧 task_node 存在不可达节点：" + leftover.slice(0, 10).join(","));
  }

  const tableRows = rows.filter(function (r) {
    return r.type === "1";
  });
  let defaultTable = tableRows[0];
  if (!defaultTable) {
    const used = new Set(rows.map(function (r) {
      return r.id;
    }));
    let groupId = "2";
    while (used.has(groupId)) groupId = String(Number(groupId) + 1);
    const group = {
      id: groupId,
      name: "默认任务组",
      type: "0",
      parent_id: "1",
      path: "/1/" + groupId + "/",
      sort: rows.filter(function (r) {
        return r.parent_id === "1";
      }).length,
      depth: 1,
      created_at: ts,
      updated_at: ts,
      deleted_at: null,
      rev: 1,
    };
    rows.push(group);
    used.add(groupId);
    let tableId = String(Number(groupId) + 1);
    while (used.has(tableId)) tableId = String(Number(tableId) + 1);
    defaultTable = {
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
    rows.push(defaultTable);
  }

  const tableIds = new Set(rows.filter(function (r) {
    return r.type === "1";
  }).map(function (r) {
    return r.id;
  }));

  const taskRows = [];
  for (const t of oldTasks || []) {
    const id = String(t.id);
    let tableId = idOf(t.table_id);
    if (!tableIds.has(tableId)) {
      report.orphanTasks += 1;
      tableId = defaultTable.id;
    }
    const publish = dateText(pick(t, ["publish_date", "publishDate"])) || dateText(pick(t, ["create_time", "created_at"])) || todayStr();
    const target = dateText(pick(t, ["target_date", "targetDate"])) || publish;
    const status = validStatus(t.status);
    const timelineRaw = pick(t, ["timeline_key", "timelineKey"]);
    const restartRaw = pick(t, ["restart_key", "restartKey"]);
    const created = timeMs(pick(t, ["create_time", "created_at"]), ts);
    const updated = timeMs(pick(t, ["update_time", "updated_at"]), created);
    taskRows.push({
      id,
      title: String(t.title || ""),
      description: String(t.description === undefined || t.description === null ? "" : t.description),
      status,
      type: validType(t.type),
      priority: clampPriority(t.priority),
      difficulty: clampDifficulty(t.difficulty),
      table_id: tableId,
      timeline_key: timelineRaw === undefined || timelineRaw === null || Number(timelineRaw) === 0 ? id : String(timelineRaw),
      restart_key: restartRaw === undefined || restartRaw === null || Number(restartRaw) === 0 ? id : String(restartRaw),
      publish_date: publish,
      target_date: target,
      done_date: dateText(t.done_date),
      shutdown_date: dateText(t.shutdown_date),
      created_at: created,
      updated_at: updated,
      deleted_at: null,
      rev: 1,
    });
  }

  return { rows, taskRows, defaultTableId: defaultTable.id };
}

function migrateLegacy(db, report) {
  const oldTasks = tableExists(db, "task") ? db.prepare("SELECT * FROM task").all() : [];
  const oldNodes = tableExists(db, "task_node") ? db.prepare("SELECT * FROM task_node").all() : [];
  const ts = now();
  const plan = buildLegacyPlan(oldNodes, oldTasks, ts, report);
  tx(db, function () {
    if (tableExists(db, "task")) {
      const name = legacyName("task", ts);
      db.exec("ALTER TABLE task RENAME TO " + quoteIdent(name));
      dropIndexesFor(db, name);
      report.legacyTask = name;
    }
    if (tableExists(db, "task_node")) {
      const name = legacyName("task_node", ts);
      db.exec("ALTER TABLE task_node RENAME TO " + quoteIdent(name));
      dropIndexesFor(db, name);
      report.legacyNode = name;
    }
    createSchema(db);
    for (const row of plan.rows) insertNode(db, row);
    const ins = db.prepare(
      "INSERT INTO task(id,title,description,status,type,priority,difficulty,table_id,timeline_key,restart_key,publish_date,target_date,done_date,shutdown_date,created_at,updated_at,deleted_at,rev) " +
        "VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
    );
    for (const t of plan.taskRows) {
      ins.run(t.id, t.title, t.description, t.status, t.type, t.priority, t.difficulty, t.table_id, t.timeline_key, t.restart_key, t.publish_date, t.target_date, t.done_date, t.shutdown_date, t.created_at, t.updated_at, null, t.rev);
    }
  });
  report.source = "legacy_mptt";
  report.nodes = plan.rows.length;
  report.tasks = plan.taskRows.length;
  report.defaultTableId = plan.defaultTableId;
}

function mapOldPriority(v) {
  const n = Number(v);
  if (n === 1) return 8;
  if (n === 2) return 6;
  if (n === 3) return 4;
  return clampPriority(n);
}

function migrateCurrentTasks(db, report) {
  const old = db.prepare("SELECT * FROM tasks").all();
  const ts = now();
  tx(db, function () {
    createSchema(db);
    seedDefaultTree(db);
    const table = db.prepare("SELECT * FROM task_node WHERE type='1' AND deleted_at IS NULL ORDER BY depth ASC, sort ASC LIMIT 1").get();
    const tableId = table ? String(table.id) : "3";
    const ins = db.prepare(
      "INSERT INTO task(id,title,description,status,type,priority,difficulty,table_id,timeline_key,restart_key,publish_date,target_date,done_date,shutdown_date,created_at,updated_at,deleted_at,rev) " +
        "VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
    );
    const used = new Set();
    for (const t of old) {
      let id = String(t.id);
      if (used.has(id)) id = newId();
      used.add(id);
      const updated = timeMs(t.updated_at, ts);
      const publish = dateText(updated) || todayStr();
      const target = dateText(t.due_at) || publish;
      const done = String(t.status) === "done";
      const tags = String(t.tags || "[]");
      if (tags && tags !== "[]") report.droppedTags += 1;
      ins.run(
        id,
        String(t.title || ""),
        String(t.note === undefined || t.note === null ? "" : t.note),
        done ? "2" : "0",
        "0",
        mapOldPriority(t.priority),
        null,
        tableId,
        id,
        id,
        publish,
        target,
        done ? dateText(updated) : null,
        null,
        updated,
        updated,
        t.deleted_at === undefined || t.deleted_at === null ? null : Number(t.deleted_at),
        Number(t.rev) || 1,
      );
    }
    const name = legacyName("tasks", ts);
    db.exec("ALTER TABLE tasks RENAME TO " + quoteIdent(name));
    dropIndexesFor(db, name);
    report.legacyTasks = name;
  });
  report.source = "workbench_tasks";
  report.tasks = old.length;
  report.defaultTableId = db.prepare("SELECT id FROM task_node WHERE type='1' AND deleted_at IS NULL LIMIT 1").get().id;
}

export function ensureSchema(db, log) {
  if (!tableExists(db, "meta")) {
    db.exec("CREATE TABLE IF NOT EXISTS meta (k TEXT PRIMARY KEY, v TEXT NOT NULL);");
  }
  const report = {
    at: new Date(now()).toISOString(),
    source: "existing",
    tasks: 0,
    nodes: 0,
    orphanNodes: 0,
    orphanTasks: 0,
    droppedTags: 0,
  };

  const hasTask = tableExists(db, "task");
  const hasNode = tableExists(db, "task_node");
  const hasTasks = tableExists(db, "tasks");

  if (hasTask) {
    const cols = columnsOf(db, "task");
    const isNew = cols.indexOf("created_at") >= 0 && cols.indexOf("updated_at") >= 0 && cols.indexOf("rev") >= 0;
    const isLegacy = cols.indexOf("create_time") >= 0 || (cols.indexOf("table_id") >= 0 && cols.indexOf("description") >= 0 && cols.indexOf("created_at") < 0);
    if (!isNew && !isLegacy) throw new Error("检测到未知的 task 表结构，拒绝自动迁移");
    if (isLegacy) {
      migrateLegacy(db, report);
    } else {
      if (hasNode && columnsOf(db, "task_node").indexOf("parent_id") < 0) {
        throw new Error("task 是新表，但 task_node 仍是旧 MPTT 表，拒绝混合迁移");
      }
      createSchema(db);
      seedDefaultTree(db);
      report.tasks = db.prepare("SELECT COUNT(*) AS n FROM task").get().n;
      report.nodes = db.prepare("SELECT COUNT(*) AS n FROM task_node").get().n;
    }
  } else if (hasNode) {
    migrateLegacy(db, report);
  } else if (hasTasks) {
    migrateCurrentTasks(db, report);
  } else {
    createSchema(db);
    seedDefaultTree(db);
    report.source = "fresh";
  }

  createSchema(db);
  seedDefaultTree(db);
  metaSet(db, "task_schema_version", "2");
  metaSet(db, "task_migration_report", JSON.stringify(report));
  if (log) log("[tasks] migration", report);
  return report;
}
