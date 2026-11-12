/**
 * 任务子插件：旧库迁移（MPTT 旧表、type 列、优先级回填）。
 *
 * 从 db.js 拆出，纯结构调整，行为不变（2026-11-09）。
 */
import { quoteIdent, dropIndexesFor, now, newId, idOf, todayStr, dateText, timeMs, tableExists, columnsOf, hasColumn, metaGet, metaSet, tx, logChange, insertNode, createSchema, seedDefaultTree } from "./db-core.js";

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
      legacyType: validType(t.type),
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

export function migrateLegacy(db, report) {
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
      "INSERT INTO task(id,title,description,status,priority,difficulty,table_id,timeline_key,restart_key,publish_date,target_date,done_date,shutdown_date,created_at,updated_at,deleted_at,rev) " +
        "VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
    );
    const legacyTypes = {};
    for (const t of plan.taskRows) {
      if (t.legacyType !== undefined && t.legacyType !== null) legacyTypes[String(t.id)] = String(t.legacyType);
      ins.run(t.id, t.title, t.description, t.status, t.priority, t.difficulty, t.table_id, t.timeline_key, t.restart_key, t.publish_date, t.target_date, t.done_date, t.shutdown_date, t.created_at, t.updated_at, null, t.rev);
    }
    // type 列已废弃；旧类型的映射留给标签迁移（tagging.migrateLegacyTypes）消费。
    if (Object.keys(legacyTypes).length) metaSet(db, "legacy_task_types", JSON.stringify(legacyTypes));
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

export function migrateCurrentTasks(db, report) {
  const old = db.prepare("SELECT * FROM tasks").all();
  const ts = now();
  tx(db, function () {
    createSchema(db);
    seedDefaultTree(db);
    const table = db.prepare("SELECT * FROM task_node WHERE type='1' AND deleted_at IS NULL ORDER BY depth ASC, sort ASC LIMIT 1").get();
    const tableId = table ? String(table.id) : "3";
    const ins = db.prepare(
      "INSERT INTO task(id,title,description,status,priority,difficulty,table_id,timeline_key,restart_key,publish_date,target_date,done_date,shutdown_date,created_at,updated_at,deleted_at,rev) " +
        "VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
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

/**
 * 任务「类型」已迁到标签域，task.type 列彻底删除。
 * 删列前先把仍有效的旧取值记到 meta.legacy_task_types，供标签迁移消费。
 */
function dropTaskTypeColumn(db, report) {
  if (!tableExists(db, "task") || !hasColumn(db, "task", "type")) return;
  const rows = db.prepare("SELECT id, type FROM task WHERE type IS NOT NULL AND type<>''").all();
  const legacy = {};
  for (const row of rows) {
    const code = String(row.type);
    if (code === "0" || code === "1" || code === "2" || code === "3") legacy[String(row.id)] = code;
  }
  if (Object.keys(legacy).length) {
    let merged = legacy;
    const prev = metaGet(db, "legacy_task_types");
    if (prev) {
      try {
        merged = Object.assign({}, JSON.parse(String(prev)), legacy);
      } catch (e) {
        merged = legacy;
      }
    }
    metaSet(db, "legacy_task_types", JSON.stringify(merged));
  }
  try {
    db.exec("ALTER TABLE task DROP COLUMN type");
  } catch (e) {
    // 老 SQLite 不支持 DROP COLUMN：重建表。
    const cols = columnsOf(db, "task").filter(function (c) { return c !== "type"; });
    const tmp = "task_drop_type_tmp";
    db.exec("DROP TABLE IF EXISTS " + quoteIdent(tmp));
    db.exec("ALTER TABLE task RENAME TO " + quoteIdent(tmp));
    dropIndexesFor(db, tmp);
    createSchema(db);
    db.exec(
      "INSERT INTO task(" + cols.join(",") + ") SELECT " + cols.join(",") + " FROM " + quoteIdent(tmp),
    );
    db.exec("DROP TABLE " + quoteIdent(tmp));
  }
  report.droppedTypeColumn = true;
}

/** 旧库补 task_node.description（表描述）；新库由 NODE_DDL 直接建好。 */
export function ensureNodeColumns(db, report) {
  if (!tableExists(db, "task_node")) return;
  if (hasColumn(db, "task_node", "description")) return;
  db.exec("ALTER TABLE task_node ADD COLUMN description TEXT NOT NULL DEFAULT ''");
  if (report) report.nodeDescriptionAdded = true;
}

/** 原子删除任务手动排序；失败时恢复索引与列，保留所有任务数据。 */
function dropTaskSortColumn(db, report) {
  if (!hasColumn(db, "task", "sort")) return;
  db.exec("SAVEPOINT task_drop_sort");
  try {
    db.exec("DROP INDEX IF EXISTS idx_task_sort");
    db.exec("ALTER TABLE task DROP COLUMN sort");
    db.exec("RELEASE task_drop_sort");
  } catch (error) {
    db.exec("ROLLBACK TO task_drop_sort");
    db.exec("RELEASE task_drop_sort");
    throw new Error("任务排序列迁移失败，原数据与索引已保留：" + error.message, { cause: error });
  }
  report.droppedSortColumn = true;
}

export function ensureTaskColumns(db, report) {
  if (!tableExists(db, "task") || !hasColumn(db, "task", "created_at")) return;
  dropTaskSortColumn(db, report || {});
  if (!hasColumn(db, "task", "dedupe_key")) db.exec("ALTER TABLE task ADD COLUMN dedupe_key TEXT");
  if (!hasColumn(db, "task", "review")) db.exec("ALTER TABLE task ADD COLUMN review TEXT NOT NULL DEFAULT ''");
  if (!hasColumn(db, "task", "owner")) db.exec("ALTER TABLE task ADD COLUMN owner TEXT");
  if (!hasColumn(db, "task", "claimed_at")) db.exec("ALTER TABLE task ADD COLUMN claimed_at INTEGER");
  if (!hasColumn(db, "task", "claim_token")) db.exec("ALTER TABLE task ADD COLUMN claim_token TEXT");
  dropTaskTypeColumn(db, report || {});
}

/**
 * 已完成任务不再需要优先级：一次性把历史库里 status=2 的 priority 清零。
 *
 * 新写入由 tasks.js 保证（create/update/bulkUpdate 都会把 DONE 的 priority 归一为 0），
 * 这里只修历史数据。改动走 sync_change_log（origin=migrate），云端能收到这次修正；
 * meta 标记保证只跑一次，之后用户手动改库也不会被反复覆盖。
 */
/**
 * 优先级不变量回填（幂等，每次启动都跑）：
 * - 非 ACTIVE（已关闭/已完成/已重启）一律 P0；
 * - ACTIVE 不允许 P0，历史遗留的 0 值回落到 P1。
 * 只处理未删除行，避免给墓碑行涨 rev；独立库没有 sync_change_log 时跳过变更日志。
 */
export function normalizePriorities(db, report) {
  const ts = now();
  let cleared = 0;
  let raised = 0;
  try {
    tx(db, function () {
      const updateOne = db.prepare("UPDATE task SET priority=?, updated_at=?, rev=? WHERE id=?");
      const load = db.prepare("SELECT * FROM task WHERE id=?");
      function apply(rows, value) {
        for (const row of rows) {
          const id = String(row.id);
          const rev = Number(row.rev || 0) + 1;
          updateOne.run(value, ts, rev, id);
          const full = load.get(id);
          if (full) {
            try {
              logChange(db, "task", id, "update", full, "migrate", ts);
            } catch (e) {
              /* 独立库（单测/导出）没有 sync_change_log：照常回填，跳过变更日志 */
            }
          }
        }
        return rows.length;
      }
      cleared = apply(
        db.prepare("SELECT id, rev FROM task WHERE status<>'0' AND priority<>0 AND deleted_at IS NULL").all(),
        0,
      );
      raised = apply(
        db.prepare("SELECT id, rev FROM task WHERE status='0' AND priority=0 AND deleted_at IS NULL").all(),
        1,
      );
    });
  } catch (e) {
    if (report) report.prioritiesError = String((e && e.message) || e);
    return { cleared: 0, raised: 0 };
  }
  if (report) {
    report.prioritiesCleared = cleared;
    report.prioritiesRaised = raised;
  }
  return { cleared, raised };
}
