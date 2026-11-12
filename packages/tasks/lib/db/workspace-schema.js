/**
 * 工作区实体与任务关联的 DDL。
 *
 * 任务与工作区是多对多：一个任务可挂 0..n 个工作区，一个工作区可挂 0..n 个任务。
 * link 的 id 是确定性的 workspace_id + ":" + task_id（多设备同步幂等），
 * 唯一索引只覆盖存活行，软删后允许重新建立同一条关联。
 */
export const WORKSPACE_DDL = [
  "CREATE TABLE IF NOT EXISTS task_workspace (id TEXT NOT NULL PRIMARY KEY,title TEXT NOT NULL DEFAULT '',name TEXT NOT NULL DEFAULT '',description TEXT NOT NULL DEFAULT '',dir TEXT,created_at INTEGER NOT NULL,updated_at INTEGER NOT NULL,deleted_at INTEGER,rev INTEGER NOT NULL DEFAULT 1 CHECK(rev>=1))",
  "CREATE INDEX IF NOT EXISTS idx_task_workspace_updated_at ON task_workspace(updated_at)",
  "CREATE TABLE IF NOT EXISTS task_workspace_link (id TEXT NOT NULL PRIMARY KEY,workspace_id TEXT NOT NULL,task_id TEXT NOT NULL,created_at INTEGER NOT NULL,updated_at INTEGER NOT NULL,deleted_at INTEGER,rev INTEGER NOT NULL DEFAULT 1 CHECK(rev>=1))",
  "CREATE UNIQUE INDEX IF NOT EXISTS uk_task_workspace_link ON task_workspace_link(workspace_id,task_id) WHERE deleted_at IS NULL",
  "CREATE INDEX IF NOT EXISTS idx_task_workspace_link_task_id ON task_workspace_link(task_id)",
  "CREATE INDEX IF NOT EXISTS idx_task_workspace_link_workspace_id ON task_workspace_link(workspace_id)",
];
