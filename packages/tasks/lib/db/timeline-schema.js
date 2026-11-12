export const TIMELINE_DDL = [
  "CREATE TABLE IF NOT EXISTS task_timeline (id TEXT NOT NULL PRIMARY KEY,title TEXT NOT NULL DEFAULT '',description TEXT NOT NULL DEFAULT '',created_at INTEGER NOT NULL,updated_at INTEGER NOT NULL,deleted_at INTEGER,rev INTEGER NOT NULL DEFAULT 1 CHECK(rev>=1))",
  "CREATE INDEX IF NOT EXISTS idx_task_timeline_updated_at ON task_timeline(updated_at)",
  "CREATE TABLE IF NOT EXISTS task_timeline_link (id TEXT NOT NULL PRIMARY KEY,task_id TEXT NOT NULL UNIQUE,timeline_id TEXT NOT NULL,created_at INTEGER NOT NULL,updated_at INTEGER NOT NULL,deleted_at INTEGER,rev INTEGER NOT NULL DEFAULT 1 CHECK(rev>=1))",
  "CREATE INDEX IF NOT EXISTS idx_task_timeline_link_timeline_id ON task_timeline_link(timeline_id)",
  "CREATE INDEX IF NOT EXISTS idx_task_timeline_link_updated_at ON task_timeline_link(updated_at)",
];
