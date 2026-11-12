/**
 * 任务模块的备份导出/导入。
 *
 * 模块自己的数据格式由模块决定；宿主只做 zip、manifest 与路由。
 * 导入采用按 updated_at 的 LWW 合并：本地更新或同时间戳的行跳过。
 * 所有行（含软删）都会导出，保证删除标记也能随备份恢复。
 */

import { logChange, tableExists, tx } from "../db/db.js";
import { LEGACY_TYPE_TAGS, addTaskTagByName, tagsAvailable } from "../tagging/tagging.js";

const SCHEMA_VERSION = 5;

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
    asInt(row.priority, 0),
    asNumOrNull(row.difficulty),
    asText(row.review),
    asText(row.table_id),
    row.timeline_key === undefined || row.timeline_key === null ? null : String(row.timeline_key),
    asTextOrNull(row.restart_key),
    asText(row.publish_date),
    asText(row.target_date),
    asTextOrNull(row.done_date),
    asTextOrNull(row.shutdown_date),
    asTextOrNull(row.dedupe_key),
    asTextOrNull(row.owner),
    row.claimed_at === undefined || row.claimed_at === null ? null : asInt(row.claimed_at, 0),
    asTextOrNull(row.claim_token),
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
    asText(row.description),
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

function workspaceValues(row) {
  return [identity(row.id, "task_workspace.id"), asText(row.title), asText(row.name), asText(row.description),
    asTextOrNull(row.dir), ...stamps(row)];
}
function workspaceLinkValues(row) {
  const workspaceId = identity(row.workspace_id, "task_workspace_link.workspace_id");
  const taskId = identity(row.task_id, "task_workspace_link.task_id");
  const expected = workspaceId + ":" + taskId;
  if (identity(row.id, "task_workspace_link.id") !== expected) throw new Error("WORKSPACE_LINK_ID_MISMATCH: link.id 必须等于 workspace_id + ':' + task_id");
  return [expected, workspaceId, taskId, ...stamps(row)];
}

const DEFINITIONS = [
  ["task_node", "taskNodes", "id,name,description,type,parent_id,path,sort,depth,created_at,updated_at,deleted_at,rev", nodeValues],
  ["task_timeline", "taskTimelines", "id,title,description,created_at,updated_at,deleted_at,rev", timelineValues],
  ["task", "tasks", "id,title,description,status,priority,difficulty,review,table_id,timeline_key,restart_key,publish_date,target_date,done_date,shutdown_date,dedupe_key,owner,claimed_at,claim_token,created_at,updated_at,deleted_at,rev", taskValues],
  ["task_timeline_link", "taskTimelineLinks", "id,task_id,timeline_id,created_at,updated_at,deleted_at,rev", linkValues],
  ["task_workspace", "taskWorkspaces", "id,title,name,description,dir,created_at,updated_at,deleted_at,rev", workspaceValues],
  ["task_workspace_link", "taskWorkspaceLinks", "id,workspace_id,task_id,created_at,updated_at,deleted_at,rev", workspaceLinkValues],
];

function identity(value, field) {
  if (typeof value !== "string" || !value.length) throw new Error(field + " 必须为非空字符串");
  return value; // 不 trim、不数值化：001 和 1 是不同实体。
}
function stamps(row) {
  for (const key of ["created_at", "updated_at", "rev"]) {
    if (!Number.isSafeInteger(row[key]) || (key === "rev" && row[key] < 1)) throw new Error("非法时间线字段：" + key);
  }
  if (row.deleted_at != null && !Number.isSafeInteger(row.deleted_at)) throw new Error("非法 deleted_at");
  return [row.created_at, row.updated_at, row.deleted_at ?? null, row.rev];
}
function timelineValues(row) {
  return [identity(row.id, "task_timeline.id"), asText(row.title), asText(row.description), ...stamps(row)];
}
function linkValues(row) {
  const taskId = identity(row.task_id, "task_timeline_link.task_id");
  if (identity(row.id, "task_timeline_link.id") !== taskId) throw new Error("TIMELINE_LINK_ID_MISMATCH: link.id 必须等于 task_id");
  return [taskId, taskId, identity(row.timeline_id, "task_timeline_link.timeline_id"), ...stamps(row)];
}

export function exportTasksData(api) {
  return tx(api.db, () => {
    const timelineMigrationRecords = tableExists(api.db, "meta") ? api.db.prepare("SELECT k,v FROM meta WHERE k LIKE ? ORDER BY k").all("task_timeline_migration:%") : [];
    const data = { schemaVersion: SCHEMA_VERSION, timelineMigrationVersion: 1, timelineMigrationRecords };
    for (const [table, key] of DEFINITIONS) {
      data[key] = tableExists(api.db, table) ? api.db.prepare("SELECT * FROM " + table + " ORDER BY id ASC").all() : [];
    }
    return data;
  });
}

function prepareBackup(data) {
  if (!data || ![1, 2, 3, 4, 5].includes(Number(data.schemaVersion))) throw new Error("任务备份版本不兼容：需要 1、2、3、4 或 5");
  const droppedDeps = !Array.isArray(data.taskDeps) ? 0 : data.taskDeps.length;
  const legacy = Number(data.schemaVersion) === 1;
  const prepared = [];
  for (const [table, key, columnText, convert] of DEFINITIONS) {
    if (legacy && (table === "task_timeline" || table === "task_timeline_link")) continue;
    // 5 之前的备份没有工作区两张表，缺键按空数组处理，不阻断恢复。
    const rows = key === "taskDeps" ? [] : (data[key] === undefined && table === "task_workspace" || data[key] === undefined && table === "task_workspace_link" ? [] : data[key]);
    if (!Array.isArray(rows)) throw new Error("任务备份结构不完整：" + key);
    const columns = columnText.split(",");
    const ids = new Set();
    const values = rows.map(row => {
      if (!row || typeof row !== "object" || Array.isArray(row)) throw new Error("非法备份行：" + table);
      const v = convert(row);
      if (ids.has(v[0])) throw new Error("备份行 ID 重复：" + table + "/" + v[0]);
      ids.add(v[0]);
      return { row: Object.fromEntries(columns.map((col, i) => [col, v[i]])), original: row };
    });
    prepared.push({ table, columns, values });
  }
  const migrationRecords = legacy ? [] : (data.timelineMigrationRecords ?? []);
  if (!Array.isArray(migrationRecords) || migrationRecords.some(r => !r || typeof r.k !== "string" || !r.k.startsWith("task_timeline_migration:") || typeof r.v !== "string")) throw new Error("非法时间线迁移记录");
  return { legacy, prepared, migrationRecords, droppedDeps };
}

function legacyCandidates(tasks) {
  const groups = new Map();
  for (const task of tasks) {
    const key = task.timeline_key;
    if (key === null || key === undefined || key === "") continue;
    const list = groups.get(String(key)) || [];
    list.push(String(task.id)); groups.set(String(key), list);
  }
  return [...groups].map(([timelineKey, taskIds]) => ({ timelineKey, taskIds,
    reason: taskIds.length === 1 && taskIds[0] === timelineKey ? "ambiguousSelfId" : "legacyGrouped",
    requiresApproval: true }));
}

// 校验合并后的引用，而非只看输入包；newest/skip 可能保留本地墓碑。
function validateLinks(db, ids) {
  for (const id of ids) {
    const link = db.prepare("SELECT * FROM task_timeline_link WHERE id=?").get(id);
    if (!link) continue;
    const task = db.prepare("SELECT * FROM task WHERE id=?").get(link.task_id);
    const timeline = db.prepare("SELECT * FROM task_timeline WHERE id=?").get(link.timeline_id);
    if (!task || !timeline) throw new Error("TIMELINE_REFERENCE_NOT_FOUND: " + id + " -> " + link.timeline_id);
    // 墓碑父行保留完整同步状态；活性由 task/link/entity 三方 join 决定，导入不复活。
  }
}

export function importTasksData(api, raw, options) {
  const db = api.db;
  const policy = ["skip", "overwrite"].includes(options?.policy) ? options.policy : "newest";
  let data, plan;
  try { data = JSON.parse(String(raw || "{}")); plan = prepareBackup(data); }
  catch (error) { return { ok: false, imported: 0, skipped: 0, failed: 1, message: error.message, errors: [error.message] }; }
  const counts = {};
  const importedTaskIds = new Set();
  let imported = 0, skipped = 0;
  try {
    tx(db, () => {
      const changed = [];
      const affectedTasks = new Set();
      const affectedTimelines = new Set();
      for (const { table, columns, values } of plan.prepared) {
        counts[table] = { imported: 0, skipped: 0 };
        const select = db.prepare("SELECT * FROM " + table + " WHERE id=?");
        const upsert = db.prepare("INSERT INTO " + table + " (" + columns.join(",") + ") VALUES(" + columns.map(() => "?").join(",") + ") ON CONFLICT(id) DO UPDATE SET " + columns.slice(1).map(c => c + "=excluded." + c).join(","));
        for (const { row, original } of values) {
          const local = select.get(row.id);
          if (local && (policy === "skip" || (policy === "newest" && local.updated_at >= row.updated_at) || columns.every(c => local[c] === row[c]))) {
            counts[table].skipped++; skipped++; continue;
          }
          upsert.run(...columns.map(c => row[c]));
          if (table === "task" || table === "task_timeline_link") affectedTasks.add(table === "task" ? row.id : row.task_id);
          if (table === "task_timeline") affectedTimelines.add(row.id);
          counts[table].imported++; imported++;
          if (table === "task") importedTaskIds.add(row.id);
          changed.push({ table, row, original, local, columns });
        }
      }
      for (const id of affectedTimelines) {
        for (const link of db.prepare("SELECT task_id FROM task_timeline_link WHERE timeline_id=?").all(id)) affectedTasks.add(link.task_id);
      }
      validateLinks(db, affectedTasks);
      // v1 不把 key 翻译为关系；已有新版归属不被旧备份覆盖。v2 同样以最终 link 为准。
      for (const id of affectedTasks) {
        const link = db.prepare("SELECT * FROM task_timeline_link WHERE task_id=?").get(id);
        if (!link) continue;
        const timeline = db.prepare("SELECT * FROM task_timeline WHERE id=?").get(link.timeline_id);
        const task = db.prepare("SELECT * FROM task WHERE id=?").get(id);
        const key = link.deleted_at == null && timeline && timeline.deleted_at == null && task && task.deleted_at == null ? link.timeline_id : null;
        if (!task || task.timeline_key === key) continue;
        const taskChange = changed.find(record => record.table === "task" && record.row.id === id);
        const local = taskChange?.local;
        const projected = { ...task, timeline_key: key };
        // overwrite 同一旧包可能临时写回旧 key；最终业务内容相同时恢复本地版本，避免反复 bump。
        const unchanged = local && Object.keys(projected).filter(c => c !== "updated_at" && c !== "rev").every(c => projected[c] === local[c]);
        const updated = unchanged ? local.updated_at : Math.max(task.updated_at, local?.updated_at ?? 0, link.updated_at, timeline?.updated_at ?? 0) + 1;
        const rev = unchanged ? local.rev : Math.max(task.rev, local?.rev ?? 0) + 1;
        db.prepare("UPDATE task SET timeline_key=?,updated_at=?,rev=? WHERE id=?").run(key, updated, rev, id);
        if (!taskChange) {
          const stored = { ...projected, updated_at: updated, rev };
          logChange(db, "task", id, stored.deleted_at == null ? "upsert" : "delete", stored, "import", updated);
        }
      }
      for (const record of plan.migrationRecords) {
        const existing = db.prepare("SELECT v FROM meta WHERE k=?").get(record.k);
        if (existing && existing.v !== record.v) throw new Error("TIMELINE_MIGRATION_RECORD_CONFLICT: " + record.k);
        if (!existing) db.prepare("INSERT INTO meta(k,v) VALUES(?,?)").run(record.k, record.v);
      }
      for (const { table, row, original, local, columns } of changed) {
        const stored = db.prepare("SELECT * FROM " + table + " WHERE id=?").get(row.id);
        if (local && columns.every(c => local[c] === stored[c])) {
          counts[table].imported--; counts[table].skipped++; imported--; skipped++; continue;
        }
        logChange(db, table, row.id, stored.deleted_at == null ? "upsert" : "delete", stored, "import", stored.updated_at);
        if (table === "task") {
          const legacyName = LEGACY_TYPE_TAGS[String(original.type)];
          if (legacyName && tagsAvailable(db, api)) addTaskTagByName(db, row.id, legacyName, row.updated_at, "import");
        }
      }
    });
  } catch (error) {
    return { ok: false, imported: 0, skipped: 0, failed: 1, rolledBack: true, message: error.message, errors: [error.message] };
  }
  if (imported > 0) {
    api.emit?.("tasks-changed", { source: "import" });
    api.emit?.("task-nodes-changed", { source: "import" });
    api.emit?.("task-timelines-changed", { source: "import" });
  }
  // 接取列不变量：旧备份没有 owner/claim_token，status=4 的行恢复后需要人工补齐。
  const claimBroken = [];
  for (const id of importedTaskIds) {
    const row = db.prepare("SELECT id,status,owner,claim_token FROM task WHERE id=?").get(id);
    if (!row || String(row.status) !== "4") continue;
    if (!row.owner || !row.claim_token) claimBroken.push(String(row.id));
  }
  return { ok: true, imported, skipped, failed: 0, tables: counts,
    claimWarnings: claimBroken.length ? [{
      code: "CLAIM_FIELDS_MISSING",
      message: "恢复的 " + claimBroken.length + " 条任务状态为「已接取」但缺少 owner/claim_token（旧备份无此列）：请用 tasks.get 核对后重新接取或关闭",
      ids: claimBroken,
    }] : [],
    timelineCandidates: plan.legacy ? legacyCandidates(data.tasks) : [],
    message: plan.droppedDeps
      ? "5.0.0 起任务依赖已移除，备份中的 " + plan.droppedDeps + " 条 taskDeps 已忽略" + (plan.legacy ? "；历史时间线候选需用户批准，未自动实体化" : "")
      : plan.legacy ? "旧字段已保留；历史时间线候选需用户批准，未自动实体化" : "任务备份已原子恢复" };
}
