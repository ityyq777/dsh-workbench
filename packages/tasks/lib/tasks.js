/**
 * 任务 action：纯本地读写。所有方法都不做网络请求。
 *
 * 兼容旧 addon 的 tasks.list/create/update/complete/delete/stats，
 * 同时提供 docs/09 约定的 tasks.* 全量 action。
 */

import {
  now,
  newId,
  idOf,
  todayStr,
  addDays,
  dateText,
  tx,
  logChange,
  taskOut,
  nodeMap,
  pathForTable,
} from "./db.js";

const STATUSES = ["0", "1", "2", "3"];
const TASK_TYPES = ["0", "1", "2", "3"];
const SOURCES = { TASK_TABLE: "0", TASK_TIMELINE: "1", TASK_RESTART: "2" };
const PUT_TYPES = { STATUS: "0", PRIORITY: "1", TITLE: "2", DESCRIPTION: "3" };
const TABS = {
  EMERGENCY: 0, WORK: 1, LIFE: 2, STUDY: 3, DEV: 4,
  SHUTDOWN: 5, ACTIVE: 6, DONE: 7, OVERVIEW: 8,
};
const TYPE_NAMES = { WORK: "0", LIFE: "1", STUDY: "2", DEV: "3" };
const STATUS_NAMES = { ACTIVE: "0", SHUTDOWN: "1", DONE: "2", RESTARTED: "3", open: "0", done: "2" };

function asCode(value, names, allowed, label) {
  if (value === undefined || value === null || value === "") return null;
  let s = String(value);
  if (names && names[s] !== undefined) s = names[s];
  if (allowed.indexOf(s) < 0) throw new Error(label + " 取值非法：" + value);
  return s;
}

function sourceCode(value) {
  if (value === undefined || value === null || value === "") return "0";
  if (SOURCES[String(value)] !== undefined) return SOURCES[String(value)];
  const s = String(value);
  if (["0", "1", "2"].indexOf(s) < 0) throw new Error("source 取值非法：" + value);
  return s;
}

function putTypeCode(value) {
  if (value === undefined || value === null || value === "") return null;
  if (PUT_TYPES[String(value)] !== undefined) return PUT_TYPES[String(value)];
  const s = String(value);
  if (["0", "1", "2", "3"].indexOf(s) < 0) throw new Error("type 取值非法：" + value);
  return s;
}

function tabCode(value) {
  if (value === undefined || value === null || value === "") return 0;
  if (TABS[String(value)] !== undefined) return TABS[String(value)];
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0 || n > 8) throw new Error("tab 取值非法：" + value);
  return Math.floor(n);
}

function clampPriority(value, fallback) {
  if (value === undefined || value === null || value === "") return fallback;
  const n = Number(value);
  if (!Number.isFinite(n)) throw new Error("priority 必须是数字");
  const v = Math.round(n);
  if (v < 0 || v > 10) throw new Error("priority 必须在 0..10");
  return v;
}

function clampDifficulty(value, fallback) {
  if (value === undefined || value === null || value === "") return fallback;
  const n = Number(value);
  if (!Number.isFinite(n)) throw new Error("difficulty 必须是数字");
  if (n < 0 || n > 5) throw new Error("difficulty 必须在 0..5");
  return n;
}

function dateArg(value, label) {
  if (value === undefined || value === null || value === "") return null;
  const d = dateText(value);
  if (!d) throw new Error(label + " 不是有效日期：" + value);
  return d;
}

function getTask(db, id) {
  const key = idOf(id);
  if (!key) return null;
  return db.prepare("SELECT * FROM task WHERE id=? AND deleted_at IS NULL").get(key) || null;
}

function defaultTable(db) {
  const row = db.prepare(
    "SELECT * FROM task_node WHERE type='1' AND deleted_at IS NULL ORDER BY depth ASC, sort ASC LIMIT 1",
  ).get();
  if (!row) throw new Error("还没有任务表，请先在任务树中新建任务表");
  return row;
}

function requireTable(db, tableId) {
  const key = idOf(tableId);
  if (!key) throw new Error("tableId 不能为空");
  const row = db.prepare("SELECT * FROM task_node WHERE id=? AND deleted_at IS NULL").get(key);
  if (!row) throw new Error("任务表不存在：" + key);
  if (String(row.type) !== "1") throw new Error("目标节点不是任务表：" + key);
  return row;
}

function insertTaskRow(db, row) {
  db.prepare(
    "INSERT INTO task(id,title,description,status,type,priority,difficulty,table_id,timeline_key,restart_key,publish_date,target_date,done_date,shutdown_date,created_at,updated_at,deleted_at,rev) " +
      "VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
  ).run(
    String(row.id),
    String(row.title),
    String(row.description || ""),
    String(row.status),
    String(row.type),
    Number(row.priority || 0),
    row.difficulty === undefined ? null : row.difficulty,
    String(row.table_id),
    row.timeline_key === undefined ? null : row.timeline_key,
    row.restart_key === undefined ? null : row.restart_key,
    String(row.publish_date),
    String(row.target_date),
    row.done_date === undefined ? null : row.done_date,
    row.shutdown_date === undefined ? null : row.shutdown_date,
    Number(row.created_at),
    Number(row.updated_at),
    row.deleted_at === undefined ? null : row.deleted_at,
    Number(row.rev || 1),
  );
}

function saveTaskRow(db, row) {
  db.prepare(
    "UPDATE task SET title=?,description=?,status=?,type=?,priority=?,difficulty=?,table_id=?,timeline_key=?,restart_key=?,publish_date=?,target_date=?,done_date=?,shutdown_date=?,updated_at=?,deleted_at=?,rev=? WHERE id=?",
  ).run(
    String(row.title),
    String(row.description || ""),
    String(row.status),
    String(row.type),
    Number(row.priority || 0),
    row.difficulty === undefined ? null : row.difficulty,
    String(row.table_id),
    row.timeline_key === undefined ? null : row.timeline_key,
    row.restart_key === undefined ? null : row.restart_key,
    String(row.publish_date),
    String(row.target_date),
    row.done_date === undefined ? null : row.done_date,
    row.shutdown_date === undefined ? null : row.shutdown_date,
    Number(row.updated_at),
    row.deleted_at === undefined ? null : row.deleted_at,
    Number(row.rev || 1),
    String(row.id),
  );
}

function outOne(db, row) {
  return taskOut(row, nodeMap(db));
}

function emitChange(api, id, op, kind) {
  api.emit(kind || "tasks-changed", { id: String(id), op: op });
}

function writeChange(db, row, op, origin, api, ts, kind) {
  logChange(db, "task", row.id, op, op === "delete" ? null : row, origin, ts);
  emitChange(api, row.id, op, kind);
}

function checkRequiredDates(row) {
  if (!row.publish_date) throw new Error("publishDate 不能为空");
  if (!row.target_date) throw new Error("targetDate 不能为空");
  if (row.target_date < row.publish_date) throw new Error("targetDate 不能早于 publishDate");
  if (row.done_date && row.done_date < row.publish_date) throw new Error("doneDate 不能早于 publishDate");
  if (row.shutdown_date && row.shutdown_date < row.publish_date) throw new Error("shutdownDate 不能早于 publishDate");
}

function createTask(db, args, origin, api) {
  const title = String(args.title === undefined || args.title === null ? "" : args.title).trim();
  if (!title) throw new Error("title 不能为空");
  const table = args.tableId === undefined || args.tableId === null || args.tableId === ""
    ? defaultTable(db)
    : requireTable(db, args.tableId);
  const source = sourceCode(args.source);
  let status = asCode(args.status, STATUS_NAMES, STATUSES, "status");
  if (status === null) status = "0";
  if (status === "3") throw new Error("创建任务时不能直接使用 RESTARTED 状态");
  if (source === "2") status = "0";

  const type = asCode(args.type, TYPE_NAMES, TASK_TYPES, "type") || "0";
  const publishDate = dateArg(args.publishDate, "publishDate") || todayStr();
  const targetDate = dateArg(args.targetDate, "targetDate") || publishDate;
  let doneDate = dateArg(args.doneDate, "doneDate");
  let shutdownDate = dateArg(args.shutdownDate, "shutdownDate");
  let difficulty = clampDifficulty(args.difficulty, null);
  let priority = clampPriority(args.priority, 0);

  if (status === "0") {
    if (difficulty !== null) {
      /* ACTIVE 也允许保留难度，兼容直接调用 */
    }
  } else if (status === "2") {
    if (!doneDate) doneDate = todayStr();
    if (difficulty === null) difficulty = 0;
    if (doneDate < publishDate) throw new Error("doneDate 不能早于 publishDate");
  } else if (status === "1") {
    if (!shutdownDate) shutdownDate = todayStr();
    if (shutdownDate < publishDate) throw new Error("shutdownDate 不能早于 publishDate");
  }
  if (targetDate < publishDate) throw new Error("targetDate 不能早于 publishDate");

  let timelineKey = idOf(args.timelineKey);
  let restartKey = idOf(args.restartKey || args.originTaskId);
  if (source === "1") {
    if (!timelineKey) throw new Error("时间线任务必须提供 timelineKey");
  }
  if (source === "2") {
    if (!restartKey) throw new Error("重启任务必须提供 restartKey（原任务 id）");
    const originTask = getTask(db, restartKey);
    if (!originTask) throw new Error("原任务不存在：" + restartKey);
    if (!timelineKey) timelineKey = idOf(originTask.timeline_key) || restartKey;
  }

  const id = newId();
  if (source === "0") {
    timelineKey = id;
    restartKey = id;
  } else if (source === "1") {
    restartKey = id;
  } else {
    restartKey = restartKey;
  }

  const ts = now();
  const row = {
    id,
    title,
    description: String(args.description === undefined || args.description === null ? "" : args.description),
    status,
    type,
    priority,
    difficulty,
    table_id: String(table.id),
    timeline_key: timelineKey || null,
    restart_key: restartKey || null,
    publish_date: publishDate,
    target_date: targetDate,
    done_date: doneDate,
    shutdown_date: shutdownDate,
    created_at: ts,
    updated_at: ts,
    deleted_at: null,
    rev: 1,
  };
  checkRequiredDates(row);

  tx(db, function () {
    if (source === "2") {
      const active = db.prepare(
        "SELECT * FROM task WHERE restart_key=? AND status='0' AND deleted_at IS NULL",
      ).all(restartKey);
      const shutdownTs = now();
      for (const old of active) {
        const next = Object.assign({}, old, { status: "1", shutdown_date: todayStr(), updated_at: shutdownTs, rev: Number(old.rev) + 1 });
        saveTaskRow(db, next);
        writeChange(db, next, "update", origin, api, shutdownTs);
      }
      const shutdown = db.prepare(
        "SELECT * FROM task WHERE restart_key=? AND status='1' AND deleted_at IS NULL",
      ).all(restartKey);
      for (const old of shutdown) {
        const next = Object.assign({}, old, { status: "3", updated_at: shutdownTs, rev: Number(old.rev) + 1 });
        saveTaskRow(db, next);
        writeChange(db, next, "update", origin, api, shutdownTs);
      }
    }
    insertTaskRow(db, row);
    writeChange(db, row, "create", origin, api, ts);
  });

  return { id: id, task: outOne(db, row) };
}

function updateTask(db, args, origin, api) {
  const id = idOf(args.id || args.taskId);
  const cur = getTask(db, id);
  if (!cur) throw new Error("任务不存在：" + (id || "(空)"));
  const ts = now();
  const next = Object.assign({}, cur);
  const type = putTypeCode(args.type);

  if (type === "0") {
    if (args.status === undefined) throw new Error("STATUS 更新缺少 status");
    next.status = asCode(args.status, STATUS_NAMES, STATUSES, "status");
    const date = dateArg(args.date || args.doneDate || args.shutdownDate, "date");
    if (next.status === "2") {
      next.done_date = date || todayStr();
      next.difficulty = clampDifficulty(args.difficulty, cur.difficulty === null ? 0 : Number(cur.difficulty));
      if (next.done_date < String(cur.publish_date)) throw new Error("doneDate 不能早于 publishDate");
    } else if (next.status === "1") {
      next.shutdown_date = date || todayStr();
      if (next.shutdown_date < String(cur.publish_date)) throw new Error("shutdownDate 不能早于 publishDate");
    }
  } else if (type === "1") {
    next.priority = clampPriority(args.priority, Number(cur.priority));
  } else if (type === "2") {
    const title = String(args.title === undefined || args.title === null ? "" : args.title).trim();
    if (!title) throw new Error("title 不能为空");
    next.title = title;
  } else if (type === "3") {
    next.description = String(args.description === undefined || args.description === null ? "" : args.description);
  } else {
    if (args.title !== undefined) {
      const title = String(args.title === null ? "" : args.title).trim();
      if (!title) throw new Error("title 不能为空");
      next.title = title;
    }
    if (args.description !== undefined) next.description = String(args.description === null ? "" : args.description);
    if (args.status !== undefined) next.status = asCode(args.status, STATUS_NAMES, STATUSES, "status");
    if (args.priority !== undefined) next.priority = clampPriority(args.priority, Number(cur.priority));
    if (args.type !== undefined && args.type !== null) next.type = asCode(args.type, TYPE_NAMES, TASK_TYPES, "type");
    if (args.difficulty !== undefined) next.difficulty = clampDifficulty(args.difficulty, null);
    if (args.publishDate !== undefined) next.publish_date = dateArg(args.publishDate, "publishDate") || String(cur.publish_date);
    if (args.targetDate !== undefined) next.target_date = dateArg(args.targetDate, "targetDate") || String(cur.target_date);
    if (args.doneDate !== undefined) next.done_date = dateArg(args.doneDate, "doneDate");
    if (args.shutdownDate !== undefined) next.shutdown_date = dateArg(args.shutdownDate, "shutdownDate");
    if (args.tableId !== undefined) {
      const table = requireTable(db, args.tableId);
      next.table_id = String(table.id);
    }
  }

  if (next.status === "2" && next.done_date === null) next.done_date = todayStr();
  if (next.status === "2" && (next.difficulty === null || next.difficulty === undefined)) next.difficulty = 0;
  if (next.status === "1" && next.shutdown_date === null) next.shutdown_date = todayStr();
  checkRequiredDates(next);
  next.updated_at = ts;
  next.rev = Number(cur.rev) + 1;
  saveTaskRow(db, next);
  writeChange(db, next, "update", origin, api, ts);
  return { task: outOne(db, next) };
}

function listTasks(db, args) {
  const tab = tabCode(args.tab);
  const where = ["t.deleted_at IS NULL"];
  const params = [];

  if (args.titleKey !== undefined && String(args.titleKey).trim() !== "") {
    const key = String(args.titleKey).trim().replace(/[\\%_]/g, "\\$&");
    where.push("t.title LIKE ? ESCAPE '\\'");
    params.push("%" + key + "%");
  }

  const tableId = idOf(args.tableId);
  const groupId = idOf(args.groupId);
  if (tableId && tableId !== "0") {
    requireTable(db, tableId);
    where.push("t.table_id=?");
    params.push(tableId);
  } else if (groupId && groupId !== "0") {
    const group = db.prepare("SELECT * FROM task_node WHERE id=? AND deleted_at IS NULL").get(groupId);
    if (!group) throw new Error("任务组不存在：" + groupId);
    const prefix = String(group.path || "") + "%";
    const tables = db.prepare("SELECT id FROM task_node WHERE type='1' AND deleted_at IS NULL AND path LIKE ?").all(prefix);
    if (!tables.length) {
      return { records: [], current: 1, size: 0, total: 0, pageable: false };
    }
    where.push("t.table_id IN (" + tables.map(function () { return "?"; }).join(",") + ")");
    for (const t of tables) params.push(String(t.id));
  }

  const filterRestarted = args.filterRestarted === undefined ? true : Boolean(args.filterRestarted);
  let checkedTypes = Array.isArray(args.checkedTypes) ? args.checkedTypes.map(String) : [];
  if (checkedTypes.length === 0) checkedTypes = TASK_TYPES.slice();
  for (const c of checkedTypes) {
    if (TASK_TYPES.indexOf(c) < 0) throw new Error("checkedTypes 取值非法：" + c);
  }

  if (tab === 0) {
    where.push("(t.priority >= 6 OR t.target_date <= ?)");
    where.push("t.status='0'");
    params.push(addDays(todayStr(), 2));
  } else if (tab >= 1 && tab <= 4) {
    where.push("t.status='0'");
    where.push("t.type=?");
    params.push(String(tab - 1));
  } else if (tab === 5) {
    where.push(filterRestarted ? "t.status='1'" : "t.status='3'");
  } else if (tab === 6) {
    where.push("t.status='0'");
  } else if (tab === 7) {
    where.push("t.status='2'");
  } else if (tab === 8) {
    if (filterRestarted) where.push("t.status!='3'");
  }

  if (tab >= 5) {
    where.push("t.type IN (" + checkedTypes.map(function () { return "?"; }).join(",") + ")");
    for (const c of checkedTypes) params.push(c);
  }

  const pageable = tab > 4 && tab < 9;
  let pageNumber = 1;
  let pageSize = 0;
  let limitSql = "";
  if (pageable) {
    pageNumber = Math.max(1, Math.floor(Number(args.pageNumber) || 1));
    pageSize = Math.max(1, Math.min(200, Math.floor(Number(args.pageSize) || 12)));
    limitSql = " LIMIT ? OFFSET ?";
  } else {
    limitSql = " LIMIT 500";
  }

  const order = pageable
    ? " ORDER BY t.publish_date DESC, t.id DESC"
    : " ORDER BY t.priority DESC, t.target_date ASC, t.publish_date DESC, t.id ASC";
  const base = " FROM task t WHERE " + where.join(" AND ");
  const total = db.prepare("SELECT COUNT(*) AS n" + base).get(...params).n;
  const queryParams = params.slice();
  if (pageable) {
    queryParams.push(pageSize, (pageNumber - 1) * pageSize);
  }
  const rows = db.prepare("SELECT t.*" + base + order + limitSql).all(...queryParams);
  const map = nodeMap(db);
  const records = rows.map(function (r) {
    return taskOut(r, map);
  });
  return {
    records,
    current: pageable ? pageNumber : 1,
    size: records.length,
    total: pageable ? total : records.length,
    pageable,
  };
}

function selectedTasks(db, args) {
  const ids = Array.isArray(args.ids) ? args.ids.map(String) : [];
  if (!ids.length) return [];
  const marks = ids.map(function () { return "?"; }).join(",");
  const rows = db.prepare("SELECT * FROM task WHERE deleted_at IS NULL AND id IN (" + marks + ")").all(...ids);
  const map = nodeMap(db);
  return rows.map(function (r) { return taskOut(r, map); });
}

function timelineTasks(db, args) {
  const key = idOf(args.timelineKey);
  if (!key) return [];
  const rows = db.prepare("SELECT * FROM task WHERE timeline_key=? AND status!='3' AND deleted_at IS NULL ORDER BY publish_date ASC, id ASC").all(key);
  const map = nodeMap(db);
  return rows.map(function (r) { return taskOut(r, map); });
}

function restartTasks(db, args) {
  const key = idOf(args.restartKey);
  if (!key) return [];
  const rows = db.prepare("SELECT * FROM task WHERE restart_key=? AND deleted_at IS NULL ORDER BY publish_date ASC, id ASC").all(key);
  const map = nodeMap(db);
  return rows.map(function (r) { return taskOut(r, map); });
}

function timelineRefactor(db, args, origin, api) {
  const ids = Array.isArray(args.ids) ? args.ids.map(String) : [];
  const key = idOf(args.timelineKey);
  if (!ids.length) throw new Error("ids 不能为空");
  if (!key) throw new Error("timelineKey 不能为空");
  const ts = now();
  const changed = [];
  tx(db, function () {
    for (const id of ids) {
      const cur = getTask(db, id);
      if (!cur) throw new Error("任务不存在：" + id);
      const next = Object.assign({}, cur, { timeline_key: key, updated_at: ts, rev: Number(cur.rev) + 1 });
      saveTaskRow(db, next);
      writeChange(db, next, "update", origin, api, ts);
      changed.push(id);
    }
  });
  return { updated: changed.length, ids: changed };
}

function migrateTasks(db, args, origin, api) {
  const ids = Array.isArray(args.ids) ? args.ids.map(String) : [];
  if (!ids.length) throw new Error("ids 不能为空");
  const table = requireTable(db, args.tableId);
  const ts = now();
  const changed = [];
  tx(db, function () {
    for (const id of ids) {
      const cur = getTask(db, id);
      if (!cur) throw new Error("任务不存在：" + id);
      const next = Object.assign({}, cur, { table_id: String(table.id), updated_at: ts, rev: Number(cur.rev) + 1 });
      saveTaskRow(db, next);
      writeChange(db, next, "update", origin, api, ts);
      changed.push(id);
    }
  });
  return { updated: changed.length, ids: changed, tableId: String(table.id) };
}

function sweepShutdown(db, args, origin, api) {
  const day = dateArg(args.date, "date") || todayStr();
  const rows = db.prepare(
    "SELECT * FROM task WHERE status='0' AND target_date<=? AND deleted_at IS NULL",
  ).all(day);
  const ts = now();
  const ids = [];
  tx(db, function () {
    for (const cur of rows) {
      const next = Object.assign({}, cur, { status: "1", shutdown_date: day, updated_at: ts, rev: Number(cur.rev) + 1 });
      saveTaskRow(db, next);
      writeChange(db, next, "update", origin, api, ts);
      ids.push(String(cur.id));
    }
  });
  return { updated: ids.length, ids: ids, date: day };
}

function stats(db) {
  const day = todayStr();
  const row = db.prepare(
    "SELECT " +
      "SUM(CASE WHEN status='0' AND deleted_at IS NULL THEN 1 ELSE 0 END) AS active, " +
      "SUM(CASE WHEN status='1' AND deleted_at IS NULL THEN 1 ELSE 0 END) AS shutdown, " +
      "SUM(CASE WHEN status='2' AND deleted_at IS NULL THEN 1 ELSE 0 END) AS done, " +
      "SUM(CASE WHEN status='3' AND deleted_at IS NULL THEN 1 ELSE 0 END) AS restarted, " +
      "SUM(CASE WHEN status='0' AND deleted_at IS NULL AND target_date<? THEN 1 ELSE 0 END) AS overdue, " +
      "SUM(CASE WHEN status='0' AND deleted_at IS NULL AND target_date=? THEN 1 ELSE 0 END) AS today " +
      "FROM task",
  ).get(day, day);
  return {
    open: row.active || 0,
    active: row.active || 0,
    shutdown: row.shutdown || 0,
    done: row.done || 0,
    restarted: row.restarted || 0,
    overdue: row.overdue || 0,
    today: row.today || 0,
  };
}

function removeTask(db, args, origin, api) {
  const cur = getTask(db, args.id || args.taskId);
  if (!cur) throw new Error("任务不存在：" + (args.id || args.taskId));
  const ts = now();
  const next = Object.assign({}, cur, { deleted_at: ts, updated_at: ts, rev: Number(cur.rev) + 1 });
  saveTaskRow(db, next);
  logChange(db, "task", next.id, "delete", null, origin, ts);
  emitChange(api, next.id, "delete");
  return { ok: true, id: String(next.id) };
}

function completeTask(db, args, origin, api) {
  return updateTask(db, {
    id: args.id || args.taskId,
    type: "STATUS",
    status: "2",
    date: args.date || todayStr(),
    difficulty: args.difficulty === undefined ? 0 : args.difficulty,
  }, origin, api);
}

function renderArray(rows) {
  const list = Array.isArray(rows) ? rows : [];
  return renderList({ records: list, total: list.length });
}

function renderList(result) {
  const lines = ["任务 " + result.records.length + " 条（total " + result.total + "）"];
  for (const t of result.records) {
    const mark = t.status === "2" ? "[x]" : t.status === "1" ? "[-]" : t.status === "3" ? "[~]" : "[ ]";
    const path = (t.path || []).map(function (p) { return p.name; }).join(" / ");
    lines.push("- " + mark + " " + t.title + "（P" + t.priority + "，target " + (t.targetDate || "-") + "，id=" + t.id + (path ? "，" + path : "") + "）");
  }
  return lines.join("\n");
}

export function registerTaskActions(api) {
  const db = api.db;
  const action = api.action;

  action("tasks.list", {
    description: "按 tab/任务表/任务组/标题筛选任务，返回分页结果与任务树路径",
    input: {
      type: "object",
      properties: {
        tab: { type: ["number", "string"] },
        titleKey: { type: "string" },
        tableId: { type: ["string", "number", "null"] },
        groupId: { type: ["string", "number", "null"] },
        pageNumber: { type: "number" },
        pageSize: { type: "number" },
        filterRestarted: { type: "boolean" },
        checkedTypes: { type: "array", items: { type: "string" } },
      },
    },
    execute: function (args) { return listTasks(db, args || {}); },
    render: renderList,
  });

  action("tasks.create", {
    description: "创建任务；source=0 普通任务，1 时间线任务，2 重启任务",
    input: {
      type: "object",
      required: ["title"],
      properties: {
        title: { type: "string" },
        description: { type: "string" },
        tableId: { type: ["string", "number"] },
        type: { type: ["string", "number"] },
        status: { type: ["string", "number"] },
        priority: { type: "number" },
        difficulty: { type: ["number", "null"] },
        publishDate: { type: "string" },
        targetDate: { type: "string" },
        doneDate: { type: "string" },
        shutdownDate: { type: "string" },
        source: { type: ["string", "number"] },
        timelineKey: { type: ["string", "number"] },
        restartKey: { type: ["string", "number"] },
      },
    },
    execute: function (args, ctx) { return createTask(db, args || {}, ctx.origin, api); },
    render: function (r) { return "已创建任务：" + r.task.title + "（id=" + r.id + "）"; },
  });

  action("tasks.update", {
    description: "按 type 更新任务单字段，也支持直接传字段；type=0 状态、1 优先级、2 标题、3 描述",
    input: {
      type: "object",
      required: ["id"],
      properties: {
        id: { type: "string" },
        taskId: { type: ["string", "number"] },
        type: { type: ["string", "number"] },
        status: { type: ["string", "number"] },
        date: { type: "string" },
        priority: { type: "number" },
        title: { type: "string" },
        description: { type: "string" },
        difficulty: { type: ["number", "null"] },
        publishDate: { type: "string" },
        targetDate: { type: "string" },
        doneDate: { type: "string" },
        shutdownDate: { type: "string" },
        tableId: { type: ["string", "number"] },
      },
    },
    execute: function (args, ctx) { return updateTask(db, args || {}, ctx.origin, api); },
    render: function (r) { return "已更新任务：" + r.task.title + "（id=" + r.task.id + "）"; },
  });

  action("tasks.selected", {
    description: "按 id 列表批量取任务",
    input: { type: "object", properties: { ids: { type: "array", items: { type: "string" } } } },
    execute: function (args) { return selectedTasks(db, args || {}); },
    render: function (rows) { return "选中任务 " + rows.length + " 条"; },
  });

  action("tasks.timeline", {
    description: "取某条时间线上的任务",
    input: { type: "object", properties: { timelineKey: { type: ["string", "number"] } } },
    execute: function (args) { return timelineTasks(db, args || {}); },
    render: renderArray,
  });

  action("tasks.restart", {
    description: "取某条重启链上的任务",
    input: { type: "object", properties: { restartKey: { type: ["string", "number"] } } },
    execute: function (args) { return restartTasks(db, args || {}); },
    render: renderArray,
  });

  action("tasks.timelineRefactor", {
    description: "把一批任务归并到同一条时间线",
    input: { type: "object", properties: { ids: { type: "array", items: { type: "string" } }, timelineKey: { type: ["string", "number"] } } },
    execute: function (args, ctx) { return timelineRefactor(db, args || {}, ctx.origin, api); },
    render: function (r) { return "已归并 " + r.updated + " 条任务到时间线 " + r.timelineKey; },
  });

  action("tasks.migrate", {
    description: "把一批任务迁移到另一个任务表",
    input: { type: "object", properties: { ids: { type: "array", items: { type: "string" } }, tableId: { type: ["string", "number"] } } },
    execute: function (args, ctx) { return migrateTasks(db, args || {}, ctx.origin, api); },
    render: function (r) { return "已迁移 " + r.updated + " 条任务到任务表 " + r.tableId; },
  });

  action("tasks.sweepShutdown", {
    description: "把 targetDate 已过的 ACTIVE 任务批量关闭（默认今天）",
    input: { type: "object", properties: { date: { type: "string" } } },
    execute: function (args, ctx) { return sweepShutdown(db, args || {}, ctx.origin, api); },
    render: function (r) { return "已关闭 " + r.updated + " 条到期任务（" + r.date + "）"; },
  });

  action("tasks.stats", {
    description: "任务统计",
    input: { type: "object", properties: {} },
    execute: function () { return stats(db); },
    render: function (s) { return "进行中 " + s.active + " / 已关闭 " + s.shutdown + " / 已完成 " + s.done + " / 已重启 " + s.restarted + " / 逾期 " + s.overdue; },
  });

  action("tasks.delete", {
    description: "软删除单个任务（保留同步墓碑）",
    input: { type: "object", properties: { id: { type: "string" } } },
    execute: function (args, ctx) { return removeTask(db, args || {}, ctx.origin, api); },
    render: function (r) { return "已删除任务：" + r.id; },
  });

  action("tasks.complete", {
    description: "把任务标记为完成（兼容旧 action）",
    input: { type: "object", properties: { id: { type: "string" }, difficulty: { type: "number" } } },
    execute: function (args, ctx) { return completeTask(db, args || {}, ctx.origin, api); },
    render: function (r) { return "已完成任务：" + r.task.title; },
  });
}
