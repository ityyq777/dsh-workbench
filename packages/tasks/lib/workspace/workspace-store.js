/**
 * 工作区实体的读写与任务关联。
 *
 * 口径：任何一方（link / workspace / task）已软删，关联就不可见；
 * 删除工作区不删任务，删除任务会连带软删它的关联行；不做级联硬删。
 */
import { logChange, now } from '../db/db-core.js';

export function workspaceError(code, message, details = {}) {
  return Object.assign(new Error(message), { code, ...details });
}

export function workspaceOut(row) {
  if (!row) return null;
  return {
    id: String(row.id),
    title: String(row.title || ''),
    name: String(row.name || ''),
    description: String(row.description || ''),
    dir: row.dir === null || row.dir === undefined ? null : String(row.dir),
    createdAt: Number(row.created_at),
    updatedAt: Number(row.updated_at),
    deletedAt: row.deleted_at === null || row.deleted_at === undefined ? null : Number(row.deleted_at),
    rev: Number(row.rev),
  };
}

export function linkId(workspaceId, taskId) {
  return String(workspaceId) + ':' + String(taskId);
}

/**
 * 目录只做保存与回显：非空时必须是本机绝对路径。
 * POSIX 以 / 开头；Windows 接受 X:\ / X:/ 与 UNC（\\host\share）。
 */
export function normalizeDir(value) {
  if (value === undefined || value === null) return null;
  const dir = String(value).trim();
  if (!dir) return null;
  const absolute = dir.startsWith('/') || /^[A-Za-z]:[\\/]/.test(dir) || dir.startsWith('\\\\');
  if (!absolute) throw workspaceError('WORKSPACE_DIR_INVALID', 'dir 必须是本机绝对路径（POSIX 以 / 开头，或 Windows 盘符 X:\\ / UNC）：' + dir);
  return dir;
}

export function requireWorkspace(db, id) {
  const key = id === undefined || id === null ? '' : String(id).trim();
  if (!key) throw workspaceError('WORKSPACE_ID_REQUIRED', '必须提供工作区 id');
  const row = db.prepare('SELECT * FROM task_workspace WHERE id=?').get(key);
  if (!row) throw workspaceError('WORKSPACE_NOT_FOUND', '工作区不存在：' + key, { id: key });
  if (row.deleted_at !== null) throw workspaceError('WORKSPACE_DELETED', '工作区已删除：' + key, { id: key });
  return row;
}

export function taskCount(db, workspaceId) {
  return db.prepare(
    'SELECT COUNT(*) AS n FROM task_workspace_link l JOIN task t ON t.id=l.task_id WHERE l.workspace_id=? AND l.deleted_at IS NULL AND t.deleted_at IS NULL',
  ).get(String(workspaceId)).n;
}

// 批量取任务的工作区，避免列表页 N+1。
export function workspacesForTasks(db, taskIds) {
  const ids = (Array.isArray(taskIds) ? taskIds : [taskIds]).map(String).filter(Boolean);
  const map = new Map();
  if (!ids.length) return map;
  const rows = db.prepare(
    'SELECT l.task_id,e.* FROM task_workspace_link l JOIN task_workspace e ON e.id=l.workspace_id JOIN task t ON t.id=l.task_id WHERE l.deleted_at IS NULL AND e.deleted_at IS NULL AND t.deleted_at IS NULL AND l.task_id IN (' + ids.map(() => '?').join(',') + ') ORDER BY e.updated_at DESC,e.id ASC',
  ).all(...ids);
  for (const row of rows) {
    const key = String(row.task_id);
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(workspaceOut(row));
  }
  return map;
}

export function attachWorkspaces(db, records) {
  const list = Array.isArray(records) ? records : [records];
  const map = workspacesForTasks(db, list.map((t) => t.id));
  for (const t of list) t.workspaces = map.get(String(t.id)) || [];
  return records;
}

function writeLink(db, workspaceId, taskId, ts, origin, api, op) {
  const id = linkId(workspaceId, taskId);
  const old = db.prepare('SELECT * FROM task_workspace_link WHERE id=?').get(id);
  const row = {
    id,
    workspace_id: String(workspaceId),
    task_id: String(taskId),
    created_at: old ? old.created_at : ts,
    updated_at: ts,
    deleted_at: null,
    rev: (old ? Number(old.rev) : 0) + 1,
  };
  db.prepare(
    'INSERT INTO task_workspace_link(id,workspace_id,task_id,created_at,updated_at,deleted_at,rev) VALUES(?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET workspace_id=excluded.workspace_id,task_id=excluded.task_id,updated_at=excluded.updated_at,deleted_at=excluded.deleted_at,rev=excluded.rev',
  ).run(...Object.values(row));
  logChange(db, 'task_workspace_link', id, op, row, origin, ts);
  api.emit('tasks-changed', { id: String(taskId), op: 'workspace' });
  api.emit('task-workspaces-changed', { id, workspaceId: String(workspaceId), taskId: String(taskId), op });
  return row;
}

function softDeleteLink(db, row, ts, origin, api) {
  const next = Object.assign({}, row, { deleted_at: ts, updated_at: ts, rev: Number(row.rev) + 1 });
  db.prepare('UPDATE task_workspace_link SET deleted_at=?,updated_at=?,rev=? WHERE id=?').run(ts, ts, next.rev, row.id);
  logChange(db, 'task_workspace_link', row.id, 'delete', next, origin, ts);
  api.emit('tasks-changed', { id: String(row.task_id), op: 'workspace' });
  api.emit('task-workspaces-changed', { id: row.id, workspaceId: String(row.workspace_id), taskId: String(row.task_id), op: 'delete' });
}

/**
 * 用 ids 整体替换某个任务的关联；调用方负责事务。
 * 未传/空数组 = 不关联任何工作区。任一 id 不存在或已删 -> 整体报错（调用方事务回滚）。
 */
export function setTaskWorkspaces(db, taskId, ids, ts, origin, api) {
  const desired = [...new Set((Array.isArray(ids) ? ids : []).map((x) => String(x).trim()).filter(Boolean))];
  for (const id of desired) requireWorkspace(db, id);
  const current = db.prepare('SELECT * FROM task_workspace_link WHERE task_id=? AND deleted_at IS NULL').all(String(taskId));
  const keep = new Set(desired);
  for (const row of current) {
    if (!keep.has(String(row.workspace_id))) softDeleteLink(db, row, ts, origin, api);
  }
  const existing = new Set(current.map((r) => String(r.workspace_id)));
  for (const id of desired) {
    if (!existing.has(id)) writeLink(db, id, taskId, ts, origin, api, 'create');
  }
  return desired;
}

export function attachTasks(db, workspaceId, taskIds, ts, origin, api) {
  const workspace = requireWorkspace(db, workspaceId);
  const wanted = [...new Set((Array.isArray(taskIds) ? taskIds : []).map((x) => String(x).trim()).filter(Boolean))];
  const attached = [];
  const existing = [];
  const failed = [];
  for (const taskId of wanted) {
    const task = db.prepare('SELECT * FROM task WHERE id=?').get(taskId);
    if (!task || task.deleted_at !== null) {
      failed.push({ taskId, reason: 'not_found' });
      continue;
    }
    const id = linkId(workspace.id, taskId);
    const link = db.prepare('SELECT * FROM task_workspace_link WHERE id=?').get(id);
    if (link && link.deleted_at === null) {
      existing.push(taskId);
      continue;
    }
    writeLink(db, workspace.id, taskId, ts, origin, api, link ? 'update' : 'create');
    attached.push(taskId);
  }
  return { workspace: workspaceOut(workspace), attached, existing, failed };
}

export function detachTasks(db, workspaceId, taskIds, ts, origin, api) {
  const workspace = requireWorkspace(db, workspaceId);
  const wanted = [...new Set((Array.isArray(taskIds) ? taskIds : []).map((x) => String(x).trim()).filter(Boolean))];
  const detached = [];
  const missing = [];
  for (const taskId of wanted) {
    const link = db.prepare('SELECT * FROM task_workspace_link WHERE id=?').get(linkId(workspace.id, taskId));
    if (!link || link.deleted_at !== null) {
      missing.push(taskId);
      continue;
    }
    softDeleteLink(db, link, ts, origin, api);
    detached.push(taskId);
  }
  return { workspace: workspaceOut(workspace), detached, missing };
}

/**
 * 删工作区：软删实体与全部关联，任务本身不动。
 * dryRun 只统计将要影响的行，不写库（调用方不需要事务）。
 */
export function removeWorkspace(db, workspaceId, origin, api, ts = now(), dryRun = false) {
  const workspace = requireWorkspace(db, workspaceId);
  const links = db.prepare('SELECT * FROM task_workspace_link WHERE workspace_id=? AND deleted_at IS NULL').all(String(workspace.id));
  const affectedTasks = [...new Set(links.map((l) => String(l.task_id)))];
  if (!dryRun) {
    for (const link of links) softDeleteLink(db, link, ts, origin, api);
    const next = Object.assign({}, workspace, { deleted_at: ts, updated_at: ts, rev: Number(workspace.rev) + 1 });
    db.prepare('UPDATE task_workspace SET deleted_at=?,updated_at=?,rev=? WHERE id=?').run(ts, ts, next.rev, workspace.id);
    logChange(db, 'task_workspace', workspace.id, 'delete', next, origin, ts);
    api.emit('task-workspaces-changed', { id: String(workspace.id), op: 'delete' });
    api.emit('tasks-changed', { id: String(workspace.id), op: 'workspace' });
  }
  return { ok: true, dryRun, id: String(workspace.id), workspace: workspaceOut(workspace), affectedLinks: links.length, affectedTasks: affectedTasks.length, taskIds: affectedTasks };
}

// 删任务时连带软删关联；调用方负责事务。
export function clearTaskWorkspaces(db, taskId, origin, api, ts = now()) {
  const links = db.prepare('SELECT * FROM task_workspace_link WHERE task_id=? AND deleted_at IS NULL').all(String(taskId));
  for (const link of links) softDeleteLink(db, link, ts, origin, api);
  return links.length;
}
