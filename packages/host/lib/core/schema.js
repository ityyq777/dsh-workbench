/**
 * 工作台本地库 schema（平台级表）。
 *
 * 业务表（task / tag / site 等）不在这里：它们由子插件的 migrations 创建/演进，
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

-- 冲突展示（LWW 输方的版本留档，绝不静默吞数据）
CREATE TABLE IF NOT EXISTS conflict_shadow (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  table_name TEXT NOT NULL,
  row_id TEXT NOT NULL,
  kind TEXT NOT NULL DEFAULT 'pull',
  resolution TEXT NOT NULL DEFAULT 'server',
  local_payload TEXT,
  server_payload TEXT,
  server_updated_at INTEGER,
  local_updated_at INTEGER,
  resolved_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_conflict_resolved ON conflict_shadow(resolved_at);

-- 单行/单表连续失败的死信；不阻塞其他表同步
CREATE TABLE IF NOT EXISTS sync_dead_letter (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  table_name TEXT NOT NULL,
  row_id TEXT NOT NULL,
  op TEXT NOT NULL,
  payload TEXT,
  error TEXT NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 1,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_dead_letter_table ON sync_dead_letter(table_name, row_id);

-- 同步水位/账号绑定/时钟/最后状态。v 用 TEXT 存储，兼容旧库的 INTEGER 亲和性。
CREATE TABLE IF NOT EXISTS sync_state (
  k TEXT PRIMARY KEY, v TEXT NOT NULL
);

-- 会话级记录模式：只影响本机当前会话，不参与同步/备份。
CREATE TABLE IF NOT EXISTS session_mode (
  session_id TEXT PRIMARY KEY,
  enabled INTEGER NOT NULL DEFAULT 0,
  updated_at INTEGER NOT NULL
);
`;
