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
  tableExists,
  timeMs,
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
    "INSERT INTO task(id,title,description,status,type,priority,difficulty,table_id,timeline_key,restart_key,publish_date,target_date,done_date,shutdown_date,sort,dedupe_key,created_at,updated_at,deleted_at,rev) " +
      "VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
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
    Number(row.sort || 0),
    row.dedupe_key === undefined ? null : row.dedupe_key,
    Number(row.created_at),
    Number(row.updated_at),
    row.deleted_at === undefined ? null : row.deleted_at,
    Number(row.rev || 1),
  );
}

function saveTaskRow(db, row) {
  db.prepare(
    "UPDATE task SET title=?,description=?,status=?,type=?,priority=?,difficulty=?,table_id=?,timeline_key=?,restart_key=?,publish_date=?,target_date=?,done_date=?,shutdown_date=?,sort=?,dedupe_key=?,updated_at=?,deleted_at=?,rev=? WHERE id=?",
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
    Number(row.sort || 0),
    row.dedupe_key === undefined ? null : row.dedupe_key,
    Number(row.updated_at),
    row.deleted_at === undefined ? null : row.deleted_at,
    Number(row.rev || 1),
    String(row.id),
  );
}

function outOne(db, row) {
  return taskOut(row, nodeMap(db));
}

const TAG_ITEM_TYPE = "task";

function tagsAvailable(db, api) {
  return !!api && typeof api.hasDomain === "function" && api.hasDomain("wb-addon-tags") &&
    tableExists(db, "tag_mapping") && tableExists(db, "tag");
}

function normalizeTagIds(raw) {
  let ids = raw;
  if (typeof ids === "string") ids = ids.split(",");
  if (!Array.isArray(ids)) return [];
  const out = [];
  for (const v of ids) {
    const id = idOf(v);
    if (id && out.indexOf(id) < 0) out.push(id);
  }
  return out;
}

function requireTagRows(db, tagIds) {
  const rows = [];
  for (const id of tagIds) {
    const row = db.prepare("SELECT * FROM tag WHERE id=? AND deleted_at IS NULL").get(id);
    if (!row) throw new Error("标签不存在：" + id);
    rows.push(row);
  }
  return rows;
}

/** 用 tagIds 全量替换某任务的标签；软删复用旧 mapping，避免每次写都新增历史行。 */
function replaceTaskTags(db, taskId, tagIds, ts, origin) {
  const current = db.prepare(
    "SELECT * FROM tag_mapping WHERE item_type=? AND item_id=? AND deleted_at IS NULL",
  ).all(TAG_ITEM_TYPE, String(taskId));
  const byTag = new Map();
  for (const m of current) byTag.set(String(m.tag_id), m);
  const wanted = new Set(tagIds.map(String));
  for (const m of current) {
    if (wanted.has(String(m.tag_id))) continue;
    db.prepare("UPDATE tag_mapping SET deleted_at=?, updated_at=?, rev=rev+1 WHERE id=?").run(ts, ts, String(m.id));
    logChange(db, "tag_mapping", String(m.id), "delete", null, origin, ts);
  }
  for (const tagId of tagIds) {
    if (byTag.has(String(tagId))) continue;
    const deleted = db.prepare(
      "SELECT * FROM tag_mapping WHERE item_type=? AND item_id=? AND tag_id=? AND deleted_at IS NOT NULL ORDER BY updated_at DESC LIMIT 1",
    ).get(TAG_ITEM_TYPE, String(taskId), String(tagId));
    if (deleted) {
      db.prepare("UPDATE tag_mapping SET deleted_at=NULL, updated_at=?, rev=rev+1 WHERE id=?").run(ts, String(deleted.id));
      logChange(db, "tag_mapping", String(deleted.id), "upsert", {
        id: String(deleted.id), tag_id: String(tagId), item_id: String(taskId), item_type: TAG_ITEM_TYPE,
        updated_at: ts, deleted_at: null, rev: Number(deleted.rev) + 1,
      }, origin, ts);
      continue;
    }
    const id = newId();
    db.prepare(
      "INSERT INTO tag_mapping(id,tag_id,item_id,item_type,created_at,updated_at,deleted_at,rev) VALUES(?,?,?,?,?,?,?,?)",
    ).run(id, String(tagId), String(taskId), TAG_ITEM_TYPE, ts, ts, null, 1);
    logChange(db, "tag_mapping", id, "create", {
      id: id, tag_id: String(tagId), item_id: String(taskId), item_type: TAG_ITEM_TYPE,
      created_at: ts, updated_at: ts, deleted_at: null, rev: 1,
    }, origin, ts);
  }
}

function tagsForTasks(db, ids) {
  const map = new Map();
  if (!ids.length) return map;
  const marks = ids.map(function () { return "?"; }).join(",");
  const rows = db.prepare(
    "SELECT m.item_id AS item_id, t.id AS id, t.name AS name FROM tag_mapping m JOIN tag t ON t.id=m.tag_id " +
      "WHERE m.item_type=? AND m.deleted_at IS NULL AND t.deleted_at IS NULL AND m.item_id IN (" + marks + ") " +
      "ORDER BY t.name ASC",
  ).all(...[TAG_ITEM_TYPE].concat(ids.map(String)));
  for (const row of rows) {
    const key = String(row.item_id);
    if (!map.has(key)) map.set(key, []);
    map.get(key).push({ id: String(row.id), name: String(row.name || "") });
  }
  return map;
}

/** 给 taskOut 结果补 tags / tagIds；标签域未安装时不动。 */
function attachTags(db, api, records) {
  const list = Array.isArray(records) ? records : [records];
  if (!tagsAvailable(db, api)) return records;
  const map = tagsForTasks(db, list.map(function (t) { return t.id; }));
  for (const t of list) {
    const tags = map.get(String(t.id)) || [];
    t.tags = tags;
    t.tagIds = tags.map(function (x) { return x.id; });
  }
  return records;
}

/** 上游依赖（本任务依赖谁）与下游（谁依赖本任务），软删行忽略。 */
function depRows(db, taskId, direction) {
  const col = direction === "up" ? "task_id" : "depends_on_id";
  const other = direction === "up" ? "depends_on_id" : "task_id";
  return db.prepare(
    "SELECT d.*, t.title AS title, t.status AS status FROM task_dep d JOIN task t ON t.id=d." + other + " " +
      "WHERE d." + col + "=? AND d.deleted_at IS NULL AND t.deleted_at IS NULL ORDER BY d.created_at ASC",
  ).all(String(taskId));
}

function wouldCycle(db, taskId, dependsOnId) {
  // 若 dependsOn 的上游里已经存在 taskId，则新增会成环。
  const seen = new Set();
  const stack = [String(dependsOnId)];
  while (stack.length) {
    const cur = stack.pop();
    if (cur === String(taskId)) return true;
    if (seen.has(cur)) continue;
    seen.add(cur);
    for (const row of depRows(db, cur, "up")) stack.push(String(row.depends_on_id));
  }
  return false;
}

function linkDep(db, args, origin, api) {
  const id = idOf(args.id || args.taskId);
  const dependsOn = idOf(args.dependsOn || args.dependsOnId);
  if (!id) throw new Error("缺少 id");
  if (!dependsOn) throw new Error("缺少 dependsOn");
  if (id === dependsOn) throw new Error("任务不能依赖自己");
  if (!getTask(db, id)) throw new Error("任务不存在：" + id);
  if (!getTask(db, dependsOn)) throw new Error("被依赖的任务不存在：" + dependsOn);
  if (wouldCycle(db, id, dependsOn)) throw new Error("会形成循环依赖：" + id + " → " + dependsOn);
  const ts = now();
  const existing = db.prepare(
    "SELECT * FROM task_dep WHERE task_id=? AND depends_on_id=? AND deleted_at IS NULL",
  ).get(id, dependsOn);
  if (existing) return { linked: false, existing: true, id: id, dependsOn: dependsOn };
  const deleted = db.prepare(
    "SELECT * FROM task_dep WHERE task_id=? AND depends_on_id=? AND deleted_at IS NOT NULL ORDER BY updated_at DESC LIMIT 1",
  ).get(id, dependsOn);
  if (deleted) {
    db.prepare("UPDATE task_dep SET deleted_at=NULL, updated_at=?, rev=rev+1 WHERE id=?").run(ts, String(deleted.id));
    logChange(db, "task_dep", String(deleted.id), "upsert", {
      id: String(deleted.id), task_id: id, depends_on_id: dependsOn, updated_at: ts, deleted_at: null, rev: Number(deleted.rev) + 1,
    }, origin, ts);
    api.emit("tasks-changed", { id: id, op: "link" });
    return { linked: true, revived: true, id: id, dependsOn: dependsOn };
  }
  const depId = newId();
  db.prepare(
    "INSERT INTO task_dep(id,task_id,depends_on_id,created_at,updated_at,deleted_at,rev) VALUES(?,?,?,?,?,?,?)",
  ).run(depId, id, dependsOn, ts, ts, null, 1);
  logChange(db, "task_dep", depId, "create", {
    id: depId, task_id: id, depends_on_id: dependsOn, created_at: ts, updated_at: ts, deleted_at: null, rev: 1,
  }, origin, ts);
  api.emit("tasks-changed", { id: id, op: "link" });
  return { linked: true, id: id, dependsOn: dependsOn };
}

function unlinkDep(db, args, origin, api) {
  const id = idOf(args.id || args.taskId);
  const dependsOn = idOf(args.dependsOn || args.dependsOnId);
  if (!id || !dependsOn) throw new Error("缺少 id 或 dependsOn");
  const row = db.prepare(
    "SELECT * FROM task_dep WHERE task_id=? AND depends_on_id=? AND deleted_at IS NULL",
  ).get(id, dependsOn);
  if (!row) return { unlinked: false, missing: true, id: id, dependsOn: dependsOn };
  const ts = now();
  db.prepare("UPDATE task_dep SET deleted_at=?, updated_at=?, rev=rev+1 WHERE id=?").run(ts, ts, String(row.id));
  logChange(db, "task_dep", String(row.id), "delete", null, origin, ts);
  api.emit("tasks-changed", { id: id, op: "unlink" });
  return { unlinked: true, id: id, dependsOn: dependsOn };
}

function depView(db, args) {
  const id = idOf(args.id || args.taskId);
  if (!id) throw new Error("缺少 id");
  const cur = getTask(db, id);
  if (!cur) throw new Error("任务不存在：" + id);
  const upstream = depRows(db, id, "up").map(function (r) {
    return { id: String(r.depends_on_id), title: String(r.title || ""), status: String(r.status || "0") };
  });
  const downstream = depRows(db, id, "down").map(function (r) {
    return { id: String(r.task_id), title: String(r.title || ""), status: String(r.status || "0") };
  });
  const blocked = upstream.some(function (x) { return x.status === "0" || x.status === "1" || x.status === "3"; });
  return { id: id, task: outOne(db, cur), dependsOn: upstream, blocks: downstream, blocked: blocked };
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

function createTask(db, args, origin, api, opts) {
  const title = String(args.title === undefined || args.title === null ? "" : args.title).trim();
  if (!title) throw new Error("title 不能为空");
  const table = args.tableId === undefined || args.tableId === null || args.tableId === ""
    ? defaultTable(db)
    : requireTable(db, args.tableId);
  const dedupeKey = String(args.dedupeKey === undefined || args.dedupeKey === null ? "" : args.dedupeKey).trim() || null;
  if (dedupeKey) {
    const existing = db.prepare(
      "SELECT * FROM task WHERE dedupe_key=? AND deleted_at IS NULL ORDER BY created_at ASC LIMIT 1",
    ).get(dedupeKey);
    if (existing) {
      const task = outOne(db, existing);
      attachTags(db, api, task);
      return { id: String(existing.id), task: task, deduped: true, existing: true };
    }
  }
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

  const tagIds = args.tagIds === undefined || args.tagIds === null ? null : normalizeTagIds(args.tagIds);
  if (tagIds && tagsAvailable(db, api)) {
    requireTagRows(db, tagIds);
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
    sort: Number.isFinite(Number(args.sort)) ? Math.round(Number(args.sort)) : 0,
    dedupe_key: dedupeKey,
    created_at: ts,
    updated_at: ts,
    deleted_at: null,
    rev: 1,
  };
  checkRequiredDates(row);

  const body = function () {
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
    if (tagIds && tagsAvailable(db, api)) replaceTaskTags(db, id, tagIds, ts, origin);
    writeChange(db, row, "create", origin, api, ts);
  };
  // skipTx 供 bulkCreate 在外层事务里复用；单条创建仍自己开事务。
  if (opts && opts.skipTx) body();
  else tx(db, body);

  const task = outOne(db, row);
  attachTags(db, api, task);
  return { id: id, task: task, deduped: false };
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
    if (args.sort !== undefined) {
      const sort = Number(args.sort);
      if (!Number.isFinite(sort)) throw new Error("sort 必须是数字");
      next.sort = Math.round(sort);
    }
  }

  if (next.status === "2" && next.done_date === null) next.done_date = todayStr();
  if (next.status === "2" && (next.difficulty === null || next.difficulty === undefined)) next.difficulty = 0;
  if (next.status === "1" && next.shutdown_date === null) next.shutdown_date = todayStr();
  checkRequiredDates(next);
  next.updated_at = ts;
  next.rev = Number(cur.rev) + 1;
  const tagIds = args.tagIds === undefined || args.tagIds === null ? null : normalizeTagIds(args.tagIds);
  if (tagIds && !tagsAvailable(db, api)) throw new Error("标签域未安装，无法写 tagIds");
  if (tagIds) requireTagRows(db, tagIds);
  saveTaskRow(db, next);
  if (tagIds) replaceTaskTags(db, String(next.id), tagIds, ts, origin);
  writeChange(db, next, "update", origin, api, ts);
  const task = outOne(db, next);
  attachTags(db, api, task);
  return { task: task };
}

/** bulk* 系列允许直接写的字段（与 tasks.update 的自由字段一致）。 */
const PATCH_FIELDS = [
  "title", "description", "status", "type", "priority", "difficulty",
  "publishDate", "targetDate", "doneDate", "shutdownDate", "tableId", "sort", "tagIds",
];

const DIFF_COLUMNS = [
  ["title", "title"], ["description", "description"], ["status", "status"], ["type", "type"],
  ["priority", "priority"], ["difficulty", "difficulty"], ["tableId", "table_id"],
  ["publishDate", "publish_date"], ["targetDate", "target_date"],
  ["doneDate", "done_date"], ["shutdownDate", "shutdown_date"], ["sort", "sort"],
];

function idList(argsIds) {
  const ids = Array.isArray(argsIds) ? argsIds.map(function (x) { return idOf(x); }).filter(Boolean) : [];
  const seen = new Set();
  const out = [];
  for (const id of ids) {
    if (seen.has(id)) continue;
    seen.add(id);
    out.push(id);
  }
  return out;
}

function patchOf(raw) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) throw new Error("patch 必须是对象");
  const patch = {};
  for (const key of Object.keys(raw)) {
    if (PATCH_FIELDS.indexOf(key) >= 0) patch[key] = raw[key];
  }
  const unknown = Object.keys(raw).filter(function (k) { return PATCH_FIELDS.indexOf(k) < 0; });
  if (unknown.length) throw new Error("patch 含不支持的字段：" + unknown.join(", ") + "（可用：" + PATCH_FIELDS.join(", ") + "）");
  if (!Object.keys(patch).length) throw new Error("patch 不能为空");
  return patch;
}

function diffRow(before, after) {
  const out = {};
  for (const pair of DIFF_COLUMNS) {
    const a = before[pair[1]];
    const b = after[pair[1]];
    if (String(a === undefined ? null : a) !== String(b === undefined ? null : b)) {
      out[pair[0]] = { from: a === undefined ? null : a, to: b === undefined ? null : b };
    }
  }
  return out;
}

/**
 * 按 patch 生成下一版任务行（不落库）。
 * 不复用 updateTask：它的 type 参数是“更新模式”，与任务字段 type 冲突。
 */
function applyPatchRow(db, cur, patch, ts) {
  const next = Object.assign({}, cur);
  if ("title" in patch) {
    const title = String(patch.title === null || patch.title === undefined ? "" : patch.title).trim();
    if (!title) throw new Error("title 不能为空");
    next.title = title;
  }
  if ("description" in patch) next.description = String(patch.description === null || patch.description === undefined ? "" : patch.description);
  if ("status" in patch) next.status = asCode(patch.status, STATUS_NAMES, STATUSES, "status");
  if ("type" in patch) next.type = asCode(patch.type, TYPE_NAMES, TASK_TYPES, "type") || String(cur.type);
  if ("priority" in patch) next.priority = clampPriority(patch.priority, Number(cur.priority));
  if ("difficulty" in patch) next.difficulty = clampDifficulty(patch.difficulty, null);
  if ("tableId" in patch) next.table_id = String(requireTable(db, patch.tableId).id);
  if ("publishDate" in patch) next.publish_date = dateArg(patch.publishDate, "publishDate") || String(cur.publish_date);
  if ("targetDate" in patch) next.target_date = dateArg(patch.targetDate, "targetDate") || String(cur.target_date);
  if ("doneDate" in patch) next.done_date = dateArg(patch.doneDate, "doneDate");
  if ("shutdownDate" in patch) next.shutdown_date = dateArg(patch.shutdownDate, "shutdownDate");
  if ("sort" in patch) {
    const sort = Number(patch.sort);
    if (!Number.isFinite(sort)) throw new Error("sort 必须是数字");
    next.sort = Math.round(sort);
  }
  // tagIds 不是 task 列，由 bulkUpdate 在行写入后同步 tag_mapping。
  if (next.status === "2" && !next.done_date) next.done_date = todayStr();
  if (next.status === "2" && (next.difficulty === null || next.difficulty === undefined)) next.difficulty = 0;
  if (next.status === "1" && !next.shutdown_date) next.shutdown_date = todayStr();
  checkRequiredDates(next);
  next.updated_at = ts;
  next.rev = Number(cur.rev) + 1;
  return next;
}

function bulkUpdate(db, args, origin, api) {
  const ids = idList(args.ids);
  if (!ids.length) throw new Error("ids 不能为空");
  const patch = patchOf(args.patch);
  const tagIds = patch.tagIds === undefined ? null : normalizeTagIds(patch.tagIds);
  if (tagIds && !tagsAvailable(db, api)) throw new Error("标签域未安装，无法写 tagIds");
  if (tagIds) requireTagRows(db, tagIds);
  const dryRun = args.dryRun === true;
  const skipMissing = args.skipMissing === true;
  const ts = now();
  const changes = [];
  const missing = [];
  const plan = function () {
    for (const id of ids) {
      const cur = getTask(db, id);
      if (!cur) {
        if (skipMissing) {
          missing.push(id);
          continue;
        }
        throw new Error("任务不存在：" + id + "（可用 skipMissing:true 忽略）");
      }
      const next = applyPatchRow(db, cur, patch, ts);
      const diff = diffRow(cur, next);
      if (tagIds) diff.tagIds = { from: "（原标签）", to: tagIds };
      changes.push({ id: id, changes: diff });
      if (!dryRun) {
        saveTaskRow(db, next);
        if (tagIds) replaceTaskTags(db, id, tagIds, ts, origin);
        writeChange(db, next, "update", origin, api, ts);
      }
    }
  };
  if (dryRun) plan();
  else tx(db, plan);
  return {
    dryRun: dryRun,
    updated: dryRun ? 0 : changes.length,
    wouldUpdate: dryRun ? changes.length : undefined,
    changes: changes,
    missing: missing,
  };
}

function bulkCreate(db, args, origin, api) {
  const records = Array.isArray(args.records) ? args.records : [];
  if (!records.length) throw new Error("records 不能为空");
  const dryRun = args.dryRun === true;
  if (dryRun) {
    // 真校验、真 id、但不落库：开事务跑一遍再回滚；用空 emit 避免给 UI 推送假事件。
    const silentApi = { emit: function () {} };
    db.exec("BEGIN IMMEDIATE");
    try {
      const created = records.map(function (rec) {
        return createTask(db, rec || {}, origin, silentApi, { skipTx: true });
      });
      db.exec("ROLLBACK");
      return {
        dryRun: true,
        created: 0,
        wouldCreate: created.length,
        tasks: created.map(function (c) { return c.task; }),
      };
    } catch (e) {
      try {
        db.exec("ROLLBACK");
      } catch {
        /* ignore */
      }
      throw e;
    }
  }
  const created = tx(db, function () {
    return records.map(function (rec) {
      return createTask(db, rec || {}, origin, api, { skipTx: true });
    });
  });
  return {
    dryRun: false,
    created: created.length,
    tasks: created.map(function (c) { return c.task; }),
  };
}

function bulkDelete(db, args, origin, api) {
  const ids = idList(args.ids);
  if (!ids.length) throw new Error("ids 不能为空");
  const dryRun = args.dryRun === true;
  const skipMissing = args.skipMissing === true;
  const ts = now();
  const deleted = [];
  const missing = [];
  const items = [];
  const plan = function () {
    for (const id of ids) {
      const cur = getTask(db, id);
      if (!cur) {
        if (skipMissing) {
          missing.push(id);
          continue;
        }
        throw new Error("任务不存在：" + id + "（可用 skipMissing:true 忽略）");
      }
      deleted.push(id);
      items.push({ id: id, title: String(cur.title || "") });
      if (!dryRun) {
        const next = Object.assign({}, cur, { deleted_at: ts, updated_at: ts, rev: Number(cur.rev) + 1 });
        saveTaskRow(db, next);
        logChange(db, "task", next.id, "delete", null, origin, ts);
        emitChange(api, next.id, "delete");
      }
    }
  };
  if (dryRun) plan();
  else tx(db, plan);
  return {
    dryRun: dryRun,
    deleted: dryRun ? 0 : deleted.length,
    wouldDelete: dryRun ? deleted.length : undefined,
    ids: deleted,
    items: items,
    missing: missing,
  };
}

function renderBulkUpdate(r) {
  const lines = [r.dryRun ? "预览：将更新 " + r.wouldUpdate + " 条任务（未写库）" : "已更新 " + r.updated + " 条任务"];
  for (const c of r.changes) {
    const parts = Object.keys(c.changes).map(function (k) {
      return k + " " + String(c.changes[k].from) + "→" + String(c.changes[k].to);
    });
    lines.push("- " + c.id + (parts.length ? "：" + parts.join("，") : "（无变化）"));
  }
  if (r.missing && r.missing.length) lines.push("跳过不存在的 id：" + r.missing.join(", "));
  return lines.join("\n");
}

function renderBulkCreate(r) {
  const lines = [r.dryRun ? "预览：将创建 " + r.wouldCreate + " 条任务（未写库）" : "已创建 " + r.created + " 条任务"];
  for (const t of r.tasks) lines.push("- " + t.title + "（id=" + t.id + "）");
  return lines.join("\n");
}

function renderBulkDelete(r) {
  const lines = [r.dryRun ? "预览：将删除 " + r.wouldDelete + " 条任务（未写库）" : "已删除 " + r.deleted + " 条任务"];
  for (const it of r.items) lines.push("- " + it.title + "（id=" + it.id + "）");
  if (r.missing && r.missing.length) lines.push("跳过不存在的 id：" + r.missing.join(", "));
  return lines.join("\n");
}

function listTasks(db, args, api) {
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

  // 额外过滤：与 tab/tableId/groupId 条件是 AND 关系。
  if (args.status !== undefined && args.status !== null && args.status !== "") {
    where.push("t.status=?");
    params.push(asCode(args.status, STATUS_NAMES, STATUSES, "status"));
  }
  const priorityMin = clampPriority(args.priorityMin, null);
  if (priorityMin !== null) {
    where.push("t.priority>=?");
    params.push(priorityMin);
  }
  const priorityMax = clampPriority(args.priorityMax, null);
  if (priorityMax !== null) {
    where.push("t.priority<=?");
    params.push(priorityMax);
  }
  const targetFrom = dateArg(args.targetFrom, "targetFrom");
  if (targetFrom) {
    where.push("t.target_date>=?");
    params.push(targetFrom);
  }
  const targetTo = dateArg(args.targetTo, "targetTo");
  if (targetTo) {
    where.push("t.target_date<=?");
    params.push(targetTo);
  }
  const tagIds = normalizeTagIds(args.tagIds);
  if (tagIds.length) {
    where.push("EXISTS (SELECT 1 FROM tag_mapping tm WHERE tm.item_type='task' AND tm.item_id=t.id AND tm.deleted_at IS NULL AND tm.tag_id IN (" + tagIds.map(function () { return "?"; }).join(",") + "))");
    for (const id of tagIds) params.push(id);
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

  const SORTS = {
    priority: "t.priority", target: "t.target_date", publish: "t.publish_date",
    updated: "t.updated_at", created: "t.created_at", manual: "t.sort",
  };
  let order = "";
  if (args.sort !== undefined && args.sort !== null && String(args.sort).trim() !== "") {
    let key = String(args.sort).trim();
    let dir = "ASC";
    if (key.charAt(0) === "-") {
      dir = "DESC";
      key = key.slice(1);
    }
    const col = SORTS[key];
    if (!col) throw new Error("sort 取值非法：" + args.sort + "（可用 priority / target / publish / updated / created / manual，前缀 - 表示降序）");
    if (args.order !== undefined && String(args.order).trim() !== "") {
      const o = String(args.order).trim().toUpperCase();
      if (o !== "ASC" && o !== "DESC") throw new Error("order 只能是 asc 或 desc");
      dir = o;
    }
    order = " ORDER BY " + col + " " + dir + ", t.id " + dir;
  } else {
    order = pageable
      ? " ORDER BY t.publish_date DESC, t.id DESC"
      : " ORDER BY t.priority DESC, t.target_date ASC, t.publish_date DESC, t.id ASC";
  }
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
  attachTags(db, api, records);
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
  const dryRun = args.dryRun === true;
  const ts = now();
  const changed = [];
  const plan = function () {
    for (const id of ids) {
      const cur = getTask(db, id);
      if (!cur) throw new Error("任务不存在：" + id);
      changed.push(id);
      if (dryRun) continue;
      const next = Object.assign({}, cur, { timeline_key: key, updated_at: ts, rev: Number(cur.rev) + 1 });
      saveTaskRow(db, next);
      writeChange(db, next, "update", origin, api, ts);
    }
  };
  if (dryRun) plan();
  else tx(db, plan);
  return dryRun
    ? { dryRun: true, updated: 0, wouldUpdate: changed.length, ids: changed, timelineKey: key }
    : { updated: changed.length, ids: changed, timelineKey: key };
}

function migrateTasks(db, args, origin, api) {
  const ids = Array.isArray(args.ids) ? args.ids.map(String) : [];
  if (!ids.length) throw new Error("ids 不能为空");
  const table = requireTable(db, args.tableId);
  const dryRun = args.dryRun === true;
  const ts = now();
  const changed = [];
  const plan = function () {
    for (const id of ids) {
      const cur = getTask(db, id);
      if (!cur) throw new Error("任务不存在：" + id);
      changed.push(id);
      if (dryRun) continue;
      const next = Object.assign({}, cur, { table_id: String(table.id), updated_at: ts, rev: Number(cur.rev) + 1 });
      saveTaskRow(db, next);
      writeChange(db, next, "update", origin, api, ts);
    }
  };
  if (dryRun) plan();
  else tx(db, plan);
  return dryRun
    ? { dryRun: true, updated: 0, wouldUpdate: changed.length, ids: changed, tableId: String(table.id) }
    : { updated: changed.length, ids: changed, tableId: String(table.id) };
}

function sweepShutdown(db, args, origin, api) {
  const day = dateArg(args.date, "date") || todayStr();
  const rows = db.prepare(
    "SELECT * FROM task WHERE status='0' AND target_date<=? AND deleted_at IS NULL",
  ).all(day);
  const dryRun = args.dryRun === true;
  const ts = now();
  const ids = [];
  const items = rows.map(function (cur) {
    return { id: String(cur.id), title: String(cur.title || ""), targetDate: cur.target_date || null };
  });
  if (dryRun) return { dryRun: true, updated: 0, wouldUpdate: rows.length, ids: rows.map(function (r) { return String(r.id); }), items: items, date: day };
  tx(db, function () {
    for (const cur of rows) {
      const next = Object.assign({}, cur, { status: "1", shutdown_date: day, updated_at: ts, rev: Number(cur.rev) + 1 });
      saveTaskRow(db, next);
      writeChange(db, next, "update", origin, api, ts);
      ids.push(String(cur.id));
    }
  });
  return { updated: ids.length, ids: ids, items: items, date: day };
}

function stats(db, args) {
  const a = args || {};
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
  const base = {
    open: row.active || 0,
    active: row.active || 0,
    shutdown: row.shutdown || 0,
    done: row.done || 0,
    restarted: row.restarted || 0,
    overdue: row.overdue || 0,
    today: row.today || 0,
  };
  const groupBy = a.groupBy === undefined || a.groupBy === null || a.groupBy === "" ? null : String(a.groupBy);
  if (!groupBy) return base;
  const COLS = { type: "t.type", tableId: "t.table_id", status: "t.status", priority: "t.priority" };
  const col = COLS[groupBy];
  if (!col) throw new Error("groupBy 只支持 type / tableId / status / priority");
  const where = ["t.deleted_at IS NULL"];
  const params = [];
  const from = dateArg(a.from, "from");
  const to = dateArg(a.to, "to");
  if (from) { where.push("t.target_date>=?"); params.push(from); }
  if (to) { where.push("t.target_date<=?"); params.push(to); }
  const stmt = db.prepare("SELECT " + col + " AS k, COUNT(*) AS n FROM task t WHERE " + where.join(" AND ") + " GROUP BY " + col + " ORDER BY n DESC");
  const rows = stmt.all.apply(stmt, params);
  const map = groupBy === "tableId" ? nodeMap(db) : null;
  const groups = rows.map(function (g) {
    let label = null;
    if (map && g.k) {
      const n = map[String(g.k)];
      label = n ? String(n.title || "") : null;
    }
    if (groupBy === "status") label = ({ "0": "ACTIVE", "1": "SHUTDOWN", "2": "DONE", "3": "RESTARTED" })[String(g.k)] || String(g.k);
    return { key: g.k === null || g.k === undefined ? null : String(g.k), label: label, count: g.n };
  });
  return Object.assign({}, base, { groupBy: groupBy, from: from, to: to, groups: groups });
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

function taskHistory(db, args) {
  const id = idOf(args.id || args.taskId);
  if (!id) throw new Error("缺少 id");
  const limit = Math.max(1, Math.min(500, Number(args.limit) || 50));
  const rows = db.prepare(
    "SELECT op, payload, origin, updated_at FROM sync_change_log WHERE table_name='task' AND row_id=? ORDER BY updated_at DESC LIMIT ?",
  ).all(id, limit);
  const entries = rows.map(function (r) {
    let payload = null;
    try { payload = r.payload ? JSON.parse(String(r.payload)) : null; } catch (e) { payload = String(r.payload || ""); }
    return { op: String(r.op), origin: r.origin || null, at: r.updated_at, payload: payload };
  });
  return { id: String(id), count: entries.length, entries: entries };
}

function changelog(db, args) {
  const limit = Math.max(1, Math.min(1000, Number(args.limit) || 100));
  const since = args.since ? String(args.since) : null;
  const tables = Array.isArray(args.tables) && args.tables.length ? args.tables.map(String) : ["task", "tag_mapping", "task_dep"];
  const where = ["table_name IN (" + tables.map(function () { return "?"; }).join(",") + ")"];
  const params = tables.slice();
  if (since) { where.push("updated_at>=?"); params.push(since); }
  params.push(limit);
  const stmt = db.prepare(
    "SELECT table_name, row_id, op, origin, updated_at FROM sync_change_log WHERE " + where.join(" AND ") + " ORDER BY updated_at DESC LIMIT ?",
  );
  const rows = stmt.all.apply(stmt, params);
  return { since: since, count: rows.length, entries: rows.map(function (r) {
    return { table: r.table_name, rowId: r.row_id, op: r.op, origin: r.origin || null, at: r.updated_at };
  }) };
}

function csvCell(v) {
  const s = v === null || v === undefined ? "" : String(v);
  return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
}

function exportTasks(db, args, api) {
  const format = String(args.format || "json").toLowerCase();
  if (["json", "markdown", "md", "csv"].indexOf(format) < 0) throw new Error("format 只支持 json / markdown / csv");
  let records;
  if (Array.isArray(args.ids) && args.ids.length) {
    const idStmt = db.prepare("SELECT * FROM task WHERE deleted_at IS NULL AND id IN (" + args.ids.map(function () { return "?"; }).join(",") + ")");
    const rows = idStmt.all.apply(idStmt, args.ids.map(String));
    records = rows.map(function (row) { return taskOut(row, nodeMap(db)); });
    attachTags(db, api, records);
  } else {
    const listed = listTasks(db, Object.assign({}, args, { pageNumber: undefined, pageSize: undefined }), api);
    records = listed.records;
  }
  if (format === "json") {
    return { format: "json", count: records.length, content: JSON.stringify({ exportedAt: now(), count: records.length, tasks: records }, null, 2) };
  }
  if (format === "csv") {
    const cols = ["id", "title", "status", "type", "priority", "difficulty", "tableId", "publishDate", "targetDate", "doneDate", "shutdownDate", "createdAt", "updatedAt", "tags"];
    const lines = [cols.join(",")];
    for (const t of records) {
      lines.push(cols.map(function (c) {
        if (c === "tags") return csvCell((t.tags || []).map(function (g) { return g.name; }).join("|"));
        return csvCell(t[c]);
      }).join(","));
    }
    return { format: "csv", count: records.length, content: lines.join("\n") };
  }
  const lines = ["| id | 标题 | 状态 | P | 目标日期 | 标签 |", "| --- | --- | --- | --- | --- | --- |"];
  for (const t of records) {
    lines.push("| " + t.id + " | " + String(t.title).replace(/\|/g, "\\|") + " | " + t.status + " | " + t.priority + " | " + (t.targetDate || "") + " | " + (t.tags || []).map(function (g) { return g.name; }).join(", ") + " |");
  }
  return { format: "markdown", count: records.length, content: lines.join("\n") };
}

function reorderTasks(db, args, origin, api) {
  const ids = idList(args.ids);
  if (!ids.length) throw new Error("ids 不能为空");
  const step = Number(args.step) || 100;
  const base = args.base === undefined ? 0 : Number(args.base);
  const dryRun = args.dryRun === true;
  const ts = now();
  const plan = ids.map(function (id, i) { return { id: id, sort: Math.round(base + i * step) }; });
  const items = [];
  for (const p of plan) {
    const cur = getTask(db, p.id);
    if (!cur) throw new Error("任务不存在：" + p.id);
    items.push({ id: String(cur.id), title: String(cur.title || ""), sort: p.sort });
  }
  if (dryRun) return { dryRun: true, updated: 0, wouldUpdate: items.length, items: items };
  tx(db, function () {
    for (const it of items) {
      const cur = getTask(db, it.id);
      const next = Object.assign({}, cur, { sort: it.sort, updated_at: ts, rev: Number(cur.rev) + 1 });
      saveTaskRow(db, next);
      writeChange(db, next, "update", origin, api, ts);
    }
  });
  return { dryRun: false, updated: items.length, items: items };
}

function taskDeps(db, args) {
  return depView(db, { id: args.id || args.taskId });
}

function taskLink(db, args, origin, api) {
  const id = idOf(args.id || args.taskId);
  const on = idOf(args.dependsOnId || args.on || args.dependsOn);
  if (!id || !on) throw new Error("需要 id 与 dependsOnId");
  return linkDep(db, { id: id, dependsOn: on }, origin, api);
}

function taskUnlink(db, args, origin, api) {
  const id = idOf(args.id || args.taskId);
  const on = idOf(args.dependsOnId || args.on || args.dependsOn);
  if (!id || !on) throw new Error("需要 id 与 dependsOnId");
  return unlinkDep(db, { id: id, dependsOn: on }, origin, api);
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

  function getTaskAction(args) {
    const id = idOf(args.id || args.taskId);
    if (!id) throw new Error("缺少 id");
    const cur = getTask(db, id);
    if (!cur) throw new Error("任务不存在：" + id);
    const task = outOne(db, cur);
    attachTags(db, api, task);
    return { task: task };
  }

  const PATCH_SCHEMA = {
    type: "object",
    description: "要写入的字段；未列出的字段会被拒绝",
    properties: {
      title: { type: "string" },
      description: { type: "string" },
      status: { type: ["string", "number"], description: "0/ACTIVE、1/SHUTDOWN、2/DONE、3/RESTARTED；也接受 open/done" },
      type: { type: ["string", "number"], description: "任务类型 0 工作 / 1 生活 / 2 学习 / 3 开发" },
      priority: { type: "number", description: "0..10" },
      difficulty: { type: ["number", "null"], description: "0..5" },
      publishDate: { type: "string", description: "YYYY-MM-DD" },
      targetDate: { type: "string", description: "YYYY-MM-DD" },
      doneDate: { type: ["string", "null"], description: "YYYY-MM-DD" },
      shutdownDate: { type: ["string", "null"], description: "YYYY-MM-DD" },
      tableId: { type: ["string", "number"], description: "目标任务表 id" },
      sort: { type: "number", description: "手动排序值（配合 tasks.reorder）" },
      tagIds: { type: "array", items: { type: "string" }, description: "用这批标签整体替换当前标签（需要标签域）" },
    },
    additionalProperties: false,
  };

  action("tasks.list", {
    description: "按 tab/任务表/任务组/标题/状态/优先级/目标日期筛选任务；sort 支持 priority/target/publish/updated/created（前缀 - 降序）",
    input: {
      type: "object",
      properties: {
        tab: { type: ["number", "string"], description: "0 紧急 / 1 工作 / 2 生活 / 3 学习 / 4 开发 / 5 已关闭 / 6 进行中 / 7 已完成 / 8 总览（默认 0）" },
        titleKey: { type: "string", description: "标题模糊匹配" },
        tableId: { type: ["string", "number", "null"], description: "只看某个任务表" },
        groupId: { type: ["string", "number", "null"], description: "只看某个任务组下的所有任务表" },
        pageNumber: { type: "number", description: "tab 5..8 分页页码，从 1 开始" },
        pageSize: { type: "number", description: "tab 5..8 每页条数（默认 12，最大 200）" },
        filterRestarted: { type: "boolean", description: "已关闭 tab 默认 true：true 看 SHUTDOWN，false 看 RESTARTED" },
        checkedTypes: { type: "array", items: { type: "string" }, description: "任务类型过滤（0..3）" },
        status: { type: ["string", "number"], description: "直接按状态过滤（与 tab 条件 AND）" },
        priorityMin: { type: "number", description: "最低优先级（含）" },
        priorityMax: { type: "number", description: "最高优先级（含）" },
        targetFrom: { type: "string", description: "targetDate >= 该日期" },
        targetTo: { type: "string", description: "targetDate <= 该日期" },
        tagIds: { type: "array", items: { type: "string" }, description: "任一标签命中（AND 到其他条件）" },
        sort: { type: "string", description: "priority / target / publish / updated / created / manual；前缀 - 表示降序" },
        order: { type: "string", enum: ["asc", "desc"], description: "配合 sort 指定方向" },
      },
    },
    examples: [{ tab: 8, priorityMin: 6, sort: "-priority", pageSize: 50 }, { tagIds: ["3"], status: "open" }],
    execute: function (args) { return listTasks(db, args || {}, api); },
    render: renderList,
  });

  action("tasks.get", {
    description: "按 id 取单个任务（含任务树路径）",
    input: {
      type: "object",
      properties: {
        id: { type: "string", description: "任务 id" },
        taskId: { type: ["string", "number"], description: "id 的别名" },
      },
    },
    examples: [{ id: "1001" }],
    execute: function (args) { return getTaskAction(args || {}); },
    render: function (r) { return "任务：" + r.task.title + "（id=" + r.task.id + "，status=" + r.task.status + "，P" + r.task.priority + "）"; },
  });

  action("tasks.create", {
    description: "创建任务；source=0 普通任务，1 时间线任务，2 重启任务。date 字段均为 YYYY-MM-DD",
    input: {
      type: "object",
      required: ["title"],
      properties: {
        title: { type: "string" },
        description: { type: "string" },
        tableId: { type: ["string", "number"], description: "任务表 id，缺省用默认任务表" },
        type: { type: ["string", "number"], description: "0 工作 / 1 生活 / 2 学习 / 3 开发" },
        status: { type: ["string", "number"], description: "0/1/2（不能直接创建 RESTARTED）" },
        priority: { type: "number", description: "0..10" },
        difficulty: { type: ["number", "null"], description: "0..5" },
        publishDate: { type: "string", description: "YYYY-MM-DD，缺省今天" },
        targetDate: { type: "string", description: "YYYY-MM-DD，缺省同 publishDate" },
        doneDate: { type: "string" },
        shutdownDate: { type: "string" },
        source: { type: ["string", "number"], description: "0 普通 / 1 时间线 / 2 重启" },
        timelineKey: { type: ["string", "number"], description: "source=1 必填" },
        restartKey: { type: ["string", "number"], description: "source=2 必填：原任务 id" },
        originTaskId: { type: ["string", "number"], description: "restartKey 的别名" },
        tagIds: { type: "array", items: { type: "string" }, description: "创建时挂标签（需要标签域）" },
        dedupeKey: { type: "string", description: "幂等键：同键未删除任务存在时直接返回已有任务（deduped:true）" },
        sort: { type: "number", description: "手动排序值（默认 0）" },
      },
    },
    examples: [{ title: "整理发布清单", priority: 7, targetDate: "2026-11-10" }],
    execute: function (args, ctx) { return createTask(db, args || {}, ctx.origin, api); },
    render: function (r) { return "已创建任务：" + r.task.title + "（id=" + r.id + "）"; },
  });

  action("tasks.update", {
    description: "更新单个任务。两种用法：①type 作为更新模式（0 状态/1 优先级/2 标题/3 描述）；②省略 type 直接传字段。批量请用 tasks.bulkUpdate",
    input: {
      type: "object",
      required: ["id"],
      properties: {
        id: { type: "string" },
        taskId: { type: ["string", "number"] },
        type: { type: ["string", "number"], description: "更新模式 0/1/2/3（不是任务类型；要改任务类型请省略 type 传字段或改完再更新）" },
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
        sort: { type: "number" },
        tagIds: { type: "array", items: { type: "string" } },
      },
    },
    examples: [{ id: "1001", status: "done" }],
    execute: function (args, ctx) { return updateTask(db, args || {}, ctx.origin, api); },
    render: function (r) { return "已更新任务：" + r.task.title + "（id=" + r.task.id + "）"; },
  });

  action("tasks.bulkUpdate", {
    description: "按 id 批量更新任务（同一 patch）；dryRun:true 只返回将变更的预览，不写库",
    input: {
      type: "object",
      required: ["ids", "patch"],
      properties: {
        ids: { type: "array", items: { type: "string" }, description: "任务 id 列表" },
        patch: PATCH_SCHEMA,
        dryRun: { type: "boolean", description: "true 时只预览，不写库、不发事件" },
        skipMissing: { type: "boolean", description: "true 时忽略不存在的 id（默认报错）" },
      },
    },
    examples: [
      { ids: ["1001", "1002"], patch: { status: "done", priority: 6 }, dryRun: true },
      { ids: ["1001", "1002"], patch: { targetDate: "2026-11-15" } },
    ],
    execute: function (args, ctx) { return bulkUpdate(db, args || {}, ctx.origin, api); },
    render: renderBulkUpdate,
  });

  action("tasks.bulkCreate", {
    description: "一次创建多条任务（单事务，全成或全不成）；dryRun:true 只校验预览，不写库",
    input: {
      type: "object",
      required: ["records"],
      properties: {
        records: {
          type: "array",
          description: "每条字段同 tasks.create",
          items: { type: "object", additionalProperties: true },
        },
        dryRun: { type: "boolean", description: "true 时只校验预览，不写库、不发事件" },
      },
    },
    examples: [
      { records: [{ title: "任务 A", priority: 6 }, { title: "任务 B", targetDate: "2026-11-12" }], dryRun: true },
    ],
    execute: function (args, ctx) { return bulkCreate(db, args || {}, ctx.origin, api); },
    render: renderBulkCreate,
  });

  action("tasks.bulkDelete", {
    description: "按 id 批量软删除任务（保留同步墓碑）；dryRun:true 只返回将删除的清单",
    input: {
      type: "object",
      properties: {
        ids: { type: "array", items: { type: "string" }, description: "任务 id 列表" },
        dryRun: { type: "boolean", description: "true 时只预览，不写库" },
        skipMissing: { type: "boolean", description: "true 时忽略不存在的 id（默认报错）" },
      },
      required: ["ids"],
    },
    examples: [{ ids: ["1001", "1002"], dryRun: true }],
    execute: function (args, ctx) { return bulkDelete(db, args || {}, ctx.origin, api); },
    render: renderBulkDelete,
  });

  action("tasks.history", {
    description: "读单个任务的变更历史（来自 sync_change_log，倒序）",
    input: {
      type: "object",
      properties: {
        id: { type: "string" },
        taskId: { type: ["string", "number"] },
        limit: { type: "number", description: "默认 50，最大 500" },
      },
    },
    examples: [{ id: "1001", limit: 20 }],
    execute: function (args) { return taskHistory(db, args || {}); },
    render: function (r) { return "任务 " + r.id + " 变更 " + r.count + " 条"; },
  });

  action("tasks.changelog", {
    description: "增量读变更日志（task / tag_mapping / task_dep），可按 since 与表过滤",
    input: {
      type: "object",
      properties: {
        since: { type: "string", description: "只返回该时间点之后的记录（ISO 或 YYYY-MM-DD）" },
        tables: { type: "array", items: { type: "string" }, description: "默认 task / tag_mapping / task_dep" },
        limit: { type: "number", description: "默认 100，最大 1000" },
      },
    },
    examples: [{ since: "2026-11-07T00:00:00.000Z", limit: 200 }],
    execute: function (args) { return changelog(db, args || {}); },
    render: function (r) { return "变更 " + r.count + " 条" + (r.since ? "（since " + r.since + "）" : ""); },
  });

  action("tasks.export", {
    description: "导出任务：format=json|csv|markdown；可按 ids 或复用 tasks.list 的过滤条件",
    input: {
      type: "object",
      properties: {
        format: { type: "string", enum: ["json", "csv", "markdown"], description: "默认 json" },
        ids: { type: "array", items: { type: "string" } },
        tab: { type: ["number", "string"] },
        status: { type: ["string", "number"] },
        tagIds: { type: "array", items: { type: "string" } },
      },
    },
    examples: [{ format: "csv", tab: 8 }, { format: "markdown", ids: ["1001", "1002"] }],
    execute: function (args) { return exportTasks(db, args || {}, api); },
    render: function (r) { return "已导出 " + r.count + " 条任务（" + r.format + "）"; },
  });

  action("tasks.reorder", {
    description: "按给定 id 顺序重排 sort（默认步长 100）；配合 tasks.list 的 sort=manual 使用；支持 dryRun",
    input: {
      type: "object",
      required: ["ids"],
      properties: {
        ids: { type: "array", items: { type: "string" }, description: "期望的排序，从前往后" },
        step: { type: "number", description: "相邻间隔，默认 100" },
        base: { type: "number", description: "起始值，默认 0" },
        dryRun: { type: "boolean" },
      },
    },
    examples: [{ ids: ["1001", "1002"], step: 100, dryRun: true }],
    execute: function (args, ctx) { return reorderTasks(db, args || {}, ctx.origin, api); },
    render: function (r) { return r.dryRun ? "预览：将重排 " + r.wouldUpdate + " 条任务" : "已重排 " + r.updated + " 条任务"; },
  });

  action("tasks.depends", {
    description: "查看任务依赖：dependsOn（上游）/ blocks（下游）/ blocked（是否被未完成上游阻塞）",
    input: { type: "object", properties: { id: { type: "string" }, taskId: { type: ["string", "number"] } } },
    examples: [{ id: "1001" }],
    execute: function (args) { return taskDeps(db, args || {}); },
    render: function (r) { return "任务 " + r.task.id + " 依赖 " + r.dependsOn.length + " 条，被 " + r.blocks.length + " 条依赖" + (r.blocked ? "（阻塞中）" : ""); },
  });

  action("tasks.link", {
    description: "新增任务依赖：任务 id 阻塞于 dependsOnId（会拒绝自依赖与成环）",
    input: {
      type: "object",
      required: ["id", "dependsOnId"],
      properties: {
        id: { type: "string" },
        dependsOnId: { type: "string" },
      },
    },
    examples: [{ id: "1002", dependsOnId: "1001" }],
    execute: function (args, ctx) { return taskLink(db, args || {}, ctx.origin, api); },
    render: function (r) { return r.linked ? "已建立依赖：" + r.id + " ← " + r.dependsOn : "依赖已存在"; },
  });

  action("tasks.unlink", {
    description: "删除任务依赖（软删）",
    input: {
      type: "object",
      required: ["id", "dependsOnId"],
      properties: {
        id: { type: "string" },
        dependsOnId: { type: "string" },
      },
    },
    examples: [{ id: "1002", dependsOnId: "1001" }],
    execute: function (args, ctx) { return taskUnlink(db, args || {}, ctx.origin, api); },
    render: function (r) { return r.unlinked ? "已删除依赖" : "依赖不存在"; },
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
    description: "把一批任务归并到同一条时间线；dryRun:true 只返回将影响的 id",
    input: {
      type: "object",
      properties: {
        ids: { type: "array", items: { type: "string" } },
        timelineKey: { type: ["string", "number"] },
        dryRun: { type: "boolean" },
      },
    },
    execute: function (args, ctx) { return timelineRefactor(db, args || {}, ctx.origin, api); },
    render: function (r) {
      return r.dryRun ? "预览：将归并 " + r.wouldUpdate + " 条任务到时间线 " + r.timelineKey : "已归并 " + r.updated + " 条任务到时间线 " + r.timelineKey;
    },
  });

  action("tasks.migrate", {
    description: "把一批任务迁移到另一个任务表；dryRun:true 只返回将影响的 id",
    input: {
      type: "object",
      properties: {
        ids: { type: "array", items: { type: "string" } },
        tableId: { type: ["string", "number"] },
        dryRun: { type: "boolean" },
      },
    },
    execute: function (args, ctx) { return migrateTasks(db, args || {}, ctx.origin, api); },
    render: function (r) {
      return r.dryRun ? "预览：将迁移 " + r.wouldUpdate + " 条任务到任务表 " + r.tableId : "已迁移 " + r.updated + " 条任务到任务表 " + r.tableId;
    },
  });

  action("tasks.sweepShutdown", {
    description: "把 targetDate 已过的 ACTIVE 任务批量关闭（默认今天）；dryRun:true 先看会影响哪些任务",
    input: {
      type: "object",
      properties: {
        date: { type: "string", description: "截止日期 YYYY-MM-DD，默认今天" },
        dryRun: { type: "boolean", description: "true 时只返回将关闭的任务清单" },
      },
    },
    examples: [{ dryRun: true }, { date: "2026-11-07" }],
    execute: function (args, ctx) { return sweepShutdown(db, args || {}, ctx.origin, api); },
    render: function (r) {
      if (r.dryRun) {
        const lines = ["预览：将关闭 " + r.wouldUpdate + " 条到期任务（" + r.date + "）"];
        for (const it of r.items) lines.push("- " + it.title + "（target " + it.targetDate + "，id=" + it.id + "）");
        return lines.join("\n");
      }
      return "已关闭 " + r.updated + " 条到期任务（" + r.date + "）";
    },
  });

  action("tasks.stats", {
    description: "任务统计：默认 6 个计数器；groupBy=type/tableId/status/priority 时额外返回 groups（可按 from/to 限定 targetDate）",
    input: {
      type: "object",
      properties: {
        groupBy: { type: "string", enum: ["type", "tableId", "status", "priority"] },
        from: { type: "string", description: "targetDate >= 该日期" },
        to: { type: "string", description: "targetDate <= 该日期" },
      },
    },
    examples: [{ groupBy: "priority" }, { groupBy: "type", from: "2026-11-01", to: "2026-11-30" }],
    execute: function (args) { return stats(db, args || {}); },
    render: function (s) {
      const base = "进行中 " + s.active + " / 已关闭 " + s.shutdown + " / 已完成 " + s.done + " / 已重启 " + s.restarted + " / 逾期 " + s.overdue;
      if (!s.groupBy) return base;
      return base + "\n" + s.groupBy + " 分布：" + s.groups.map(function (g) { return (g.label || g.key || "-") + "=" + g.count; }).join("，");
    },
  });

  action("tasks.delete", {
    description: "软删除单个任务（保留同步墓碑）；批量请用 tasks.bulkDelete",
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
