/**
 * 任务子插件：schema 入口（ensureSchema）。
 *
 * 具体实现按职责拆到 db-core.js（通用/建表）与 db-legacy.js（旧库迁移），
 * 本文件只保留迁移编排，并对调用方保持原有导出面。
 */
import { tableExists, columnsOf, hasColumn, metaSet, now, createSchema, seedDefaultTree } from "./db-core.js";
import {
  migrateLegacy,
  migrateCurrentTasks,
  ensureTaskColumns,
  ensureNodeColumns,
  normalizePriorities,
} from "./db-legacy.js";

export * from "./db-core.js";
export { migrateLegacy, migrateCurrentTasks, ensureTaskColumns, ensureNodeColumns, normalizePriorities } from "./db-legacy.js";

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
    droppedTypeColumn: false,
    droppedSortColumn: false,
    droppedDependencyTable: false,
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
      ensureTaskColumns(db, report);
      ensureNodeColumns(db, report);
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

  // 5.0.0 起任务依赖整体移除：旧库把 task_dep 表 DROP 掉，不再保留墓碑行。
  if (tableExists(db, "task_dep")) {
    db.exec("DROP TABLE IF EXISTS task_dep");
    report.droppedDependencyTable = true;
  }

  // 旧库补列/删列必须先完成，再补建当前 schema 的索引。
  ensureTaskColumns(db, report);
  ensureNodeColumns(db, report);
  createSchema(db);
  if (hasColumn(db, "task", "created_at")) {
    try {
      db.exec("CREATE INDEX IF NOT EXISTS idx_task_dedupe ON task(dedupe_key) WHERE dedupe_key IS NOT NULL");
    } catch (e) {
      if (log) log("[tasks] 索引补建失败：" + String((e && e.message) || e));
    }
  }
  seedDefaultTree(db);
  if (hasColumn(db, "task", "priority") && hasColumn(db, "task", "status")) {
    try {
      normalizePriorities(db, report);
    } catch (e) {
      if (log) log("[tasks] 优先级回填失败：" + String((e && e.message) || e));
    }
  }
  metaSet(db, "task_schema_version", "6");
  metaSet(db, "task_migration_report", JSON.stringify(report));
  if (log) log("[tasks] migration", report);
  return report;
}
