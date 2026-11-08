/**
 * 任务模块的备份导出/导入。
 *
 * 模块自己的数据格式由模块决定；宿主只做 zip、manifest 与路由。
 * 导入采用按 updated_at 的 LWW 合并：本地更新或同时间戳的行跳过。
 * 所有行（含软删）都会导出，保证删除标记也能随备份恢复。
 */

import { NODE_TABLE, TASK_TABLE, logChange, tableExists, tx } from "./db.js";

const SCHEMA_VERSION = 1;

function asText(value, fallback) {
  if (value === undefined || value === null) return fallback === undefined ? "" : fallback;
  return String(value);
}

function asInt(value, fallback) {
  const n = Number(value);
  return Number.isFinite(n) ? Math.trunc(n) : fallback;
}

function asNumOrNull(value) {
  if (value === undefined || value === null || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function asTextOrNull(value) {
  if (value === undefined || value === null) return null;
  const s = String(value);
  return s === "" ? null : s;
}

function taskValues(row) {
  const id = asText(row && row.id).trim();
  if (!id) throw new Error("task.id 为空");
  const title = asText(row.title);
  if (!title) throw new Error("task.title 为空：" + id);
  const updated = asInt(row.updated_at, Date.now());
  return [
    id,
    title,
    asText(row.description),
    asText(row.status, "0"),
    asText(row.type, "0"),
    asInt(row.priority, 0),
    asNumOrNull(row.difficulty),
    asText(row.table_id),
    asTextOrNull(row.timeline_key),
    asTextOrNull(row.restart_key),
    asText(row.publish_date),
    asText(row.target_date),
    asTextOrNull(row.done_date),
    asTextOrNull(row.shutdown_date),
    asInt(row.sort, 0),
    asTextOrNull(row.dedupe_key),
    asInt(row.created_at, updated),
    updated,
    row.deleted_at === null || row.deleted_at === undefined ? null : asInt(row.deleted_at, updated),
    Math.max(1, asInt(row.rev, 1)),
  ];
}

function depValues(row) {
  const id = asText(row && row.id).trim();
  if (!id) throw new Error("task_dep.id 为空");
  const taskId = asText(row.task_id).trim();
  const dependsOn = asText(row.depends_on_id).trim();
  if (!taskId || !dependsOn) throw new Error("task_dep 关联为空：" + id);
  const updated = asInt(row.updated_at, Date.now());
  return [
    id,
    taskId,
    dependsOn,
    asInt(row.created_at, updated),
    updated,
    row.deleted_at === null || row.deleted_at === undefined ? null : asInt(row.deleted_at, updated),
    Math.max(1, asInt(row.rev, 1)),
  ];
}

function nodeValues(row) {
  const id = asText(row && row.id).trim();
  if (!id) throw new Error("task_node.id 为空");
  const updated = asInt(row.updated_at, Date.now());
  return [
    id,
    asText(row.name, "未命名"),
    asText(row.type, "0"),
    asText(row.parent_id, "0"),
    asText(row.path),
    asInt(row.sort, 0),
    asInt(row.depth, 0),
    asInt(row.created_at, updated),
    updated,
    row.deleted_at === null || row.deleted_at === undefined ? null : asInt(row.deleted_at, updated),
    Math.max(1, asInt(row.rev, 1)),
  ];
}

export function exportTasksData(api) {
  const db = api.db;
  const tasks = tableExists(db, TASK_TABLE) ? db.prepare("SELECT * FROM task ORDER BY created_at ASC, id ASC").all() : [];
  const nodes = tableExists(db, NODE_TABLE) ? db.prepare("SELECT * FROM task_node ORDER BY depth ASC, sort ASC, id ASC").all() : [];
  const taskDeps = tableExists(db, "task_dep") ? db.prepare("SELECT * FROM task_dep ORDER BY task_id ASC, depends_on_id ASC").all() : [];
  return { schemaVersion: SCHEMA_VERSION, tasks, taskNodes: nodes, taskDeps };
}

function policyOf(options) {
  const p = options && options.policy;
  return p === "skip" || p === "overwrite" ? p : "newest";
}

export function importTasksData(api, raw, options) {
  const db = api.db;
  const policy = policyOf(options);
  let data;
  try {
    data = JSON.parse(String(raw || "{}"));
  } catch {
    return { ok: false, imported: 0, skipped: 0, failed: 0, message: "任务备份不是有效 JSON" };
  }
  if (!data || Number(data.schemaVersion) !== SCHEMA_VERSION) {
    return { ok: false, imported: 0, skipped: 0, failed: 0, message: "任务备份版本不兼容：需要 " + SCHEMA_VERSION };
  }
  if (!Array.isArray(data.tasks) || !Array.isArray(data.taskNodes)) {
    return { ok: false, imported: 0, skipped: 0, failed: 0, message: "任务备份结构不完整" };
  }

  const taskUpsert = db.prepare(
    "INSERT INTO task(id,title,description,status,type,priority,difficulty,table_id,timeline_key,restart_key,publish_date,target_date,done_date,shutdown_date,sort,dedupe_key,created_at,updated_at,deleted_at,rev) " +
      "VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) " +
      "ON CONFLICT(id) DO UPDATE SET title=excluded.title,description=excluded.description,status=excluded.status,type=excluded.type,priority=excluded.priority,difficulty=excluded.difficulty,table_id=excluded.table_id,timeline_key=excluded.timeline_key,restart_key=excluded.restart_key,publish_date=excluded.publish_date,target_date=excluded.target_date,done_date=excluded.done_date,shutdown_date=excluded.shutdown_date,sort=excluded.sort,dedupe_key=excluded.dedupe_key,created_at=excluded.created_at,updated_at=excluded.updated_at,deleted_at=excluded.deleted_at,rev=excluded.rev " +
      "WHERE ? = 1 OR excluded.updated_at > task.updated_at",
  );
  const depUpsert = db.prepare(
    "INSERT INTO task_dep(id,task_id,depends_on_id,created_at,updated_at,deleted_at,rev) " +
      "VALUES(?,?,?,?,?,?,?) " +
      "ON CONFLICT(id) DO UPDATE SET task_id=excluded.task_id,depends_on_id=excluded.depends_on_id,created_at=excluded.created_at,updated_at=excluded.updated_at,deleted_at=excluded.deleted_at,rev=excluded.rev " +
      "WHERE ? = 1 OR excluded.updated_at > task_dep.updated_at",
  );
  const nodeUpsert = db.prepare(
    "INSERT INTO task_node(id,name,type,parent_id,path,sort,depth,created_at,updated_at,deleted_at,rev) " +
      "VALUES(?,?,?,?,?,?,?,?,?,?,?) " +
      "ON CONFLICT(id) DO UPDATE SET name=excluded.name,type=excluded.type,parent_id=excluded.parent_id,path=excluded.path,sort=excluded.sort,depth=excluded.depth,created_at=excluded.created_at,updated_at=excluded.updated_at,deleted_at=excluded.deleted_at,rev=excluded.rev " +
      "WHERE ? = 1 OR excluded.updated_at > task_node.updated_at",
  );

  let imported = 0;
  let skipped = 0;
  let failed = 0;
  const errors = [];
  const taskExists = db.prepare("SELECT 1 FROM task WHERE id = ?");
  const nodeExists = db.prepare("SELECT 1 FROM task_node WHERE id = ?");
  const depExists = db.prepare("SELECT 1 FROM task_dep WHERE id = ?");
  const force = policy === "overwrite" ? 1 : 0;

  for (const row of data.tasks) {
    try {
      const values = taskValues(row);
      if (policy === "skip" && taskExists.get(values[0])) {
        skipped += 1;
        continue;
      }
      const result = taskUpsert.run(...values, force);
      if (result.changes > 0) {
        imported += 1;
        logChange(db, TASK_TABLE, values[0], "upsert", row, "import", values[17]);
      } else {
        skipped += 1;
      }
    } catch (e) {
      failed += 1;
      if (errors.length < 5) errors.push(String((e && e.message) || e));
    }
  }
  for (const row of data.taskDeps || []) {
    try {
      const values = depValues(row);
      if (policy === "skip" && depExists.get(values[0])) {
        skipped += 1;
        continue;
      }
      const result = depUpsert.run(...values, force);
      if (result.changes > 0) {
        imported += 1;
        logChange(db, "task_dep", values[0], "upsert", row, "import", values[4]);
      } else {
        skipped += 1;
      }
    } catch (e) {
      failed += 1;
      if (errors.length < 5) errors.push(String((e && e.message) || e));
    }
  }
  for (const row of data.taskNodes) {
    try {
      const values = nodeValues(row);
      if (policy === "skip" && nodeExists.get(values[0])) {
        skipped += 1;
        continue;
      }
      const result = nodeUpsert.run(...values, force);
      if (result.changes > 0) {
        imported += 1;
        logChange(db, NODE_TABLE, values[0], "upsert", row, "import", values[8]);
      } else {
        skipped += 1;
      }
    } catch (e) {
      failed += 1;
      if (errors.length < 5) errors.push(String((e && e.message) || e));
    }
  }

  if (imported > 0) {
    api.emit("tasks-changed", { source: "import" });
    api.emit("task-nodes-changed", { source: "import" });
  }
  return {
    ok: failed === 0,
    imported,
    skipped,
    failed,
    message: failed ? "部分任务行导入失败：" + errors.join("；") : undefined,
  };
}
