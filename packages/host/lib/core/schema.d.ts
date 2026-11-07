/**
 * 工作台本地库 schema（平台级表）。
 *
 * 业务表（tasks/habits/...）不在这里：它们由子插件的 migrations 创建/演进，
 * 壳本身不感知任何具体业务。这样「任务记录」才能真正装/卸。
 */
export declare const SCHEMA_SQL = "\nPRAGMA journal_mode=WAL;\n\nCREATE TABLE IF NOT EXISTS meta (\n  k TEXT PRIMARY KEY, v TEXT NOT NULL\n);\n\n-- \u901A\u7528\u53D8\u66F4\u65E5\u5FD7\uFF1A\u5199\u4E8B\u52A1\u5185\u8FFD\u52A0\uFF1B\u672A\u63A8\u9001\u5C3E\u90E8\u5373\u5F85\u540C\u6B65\u961F\u5217\nCREATE TABLE IF NOT EXISTS sync_change_log (\n  seq INTEGER PRIMARY KEY AUTOINCREMENT,\n  table_name TEXT NOT NULL,\n  row_id TEXT NOT NULL,\n  op TEXT NOT NULL,\n  payload TEXT,\n  origin TEXT NOT NULL,\n  updated_at INTEGER NOT NULL\n);\n\n-- \u51B2\u7A81\u5C55\u793A\uFF08LWW \u8F93\u65B9\u7684\u670D\u52A1\u7AEF\u7248\u672C\u7559\u6863\uFF0C\u7EDD\u4E0D\u9759\u9ED8\u541E\u6570\u636E\uFF09\nCREATE TABLE IF NOT EXISTS conflict_shadow (\n  id INTEGER PRIMARY KEY AUTOINCREMENT,\n  table_name TEXT NOT NULL,\n  row_id TEXT NOT NULL,\n  local_payload TEXT,\n  server_payload TEXT,\n  resolved_at INTEGER NOT NULL\n);\n\nCREATE TABLE IF NOT EXISTS sync_state (\n  k TEXT PRIMARY KEY, v INTEGER NOT NULL\n);\n";
/** 参与同步的表清单（协议级；业务域 tables 用于声明与文档，最终白名单由宿主汇总）。 */
export declare const SYNCED_TABLES: Set<string>;
