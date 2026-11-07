/**
 * 工作台本地库 schema（平台级表）。
 *
 * 业务表（tasks/habits/...）不在这里：它们由子插件的 migrations 创建/演进，
 * 壳本身不感知任何具体业务。这样「任务记录」才能真正装/卸。
 */
export const SCHEMA_SQL = `
PRAGMA journal_mode=WAL;

CREATE TABLE IF NOT EXISTS meta (
  k TEXT PRIMARY KEY, v TEXT NOT NULL
);

-- 通用变更日志：写事务内追加；未推送尾部即待同步队列
CREATE TABLE IF NOT EXISTS sync_change_log (
  seq INTEGER PRIMARY KEY AUTOINCREMENT,
  table_name TEXT NOT NULL,
  row_id TEXT NOT NULL,
  op TEXT NOT NULL,
  payload TEXT,
  origin TEXT NOT NULL,
  updated_at INTEGER NOT NULL
);

-- 冲突展示（LWW 输方的服务端版本留档，绝不静默吞数据）
CREATE TABLE IF NOT EXISTS conflict_shadow (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  table_name TEXT NOT NULL,
  row_id TEXT NOT NULL,
  local_payload TEXT,
  server_payload TEXT,
  resolved_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS sync_state (
  k TEXT PRIMARY KEY, v INTEGER NOT NULL
);
`;
/** 参与同步的表清单（协议级；业务域 tables 用于声明与文档，最终白名单由宿主汇总）。 */
export const SYNCED_TABLES = new Set([
    "tasks",
    "habits",
    "task",
    "task_node",
    "tag",
    "tag_mapping",
    "site",
    "site_node",
    "site_node_mapping",
]);
