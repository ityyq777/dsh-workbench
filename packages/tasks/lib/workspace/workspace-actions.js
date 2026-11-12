/**
 * 工作区 action 面：taskWorkspaces.*（独立实体）与 tasks.workspaces（任务视角）。
 *
 * 工作区目录只保存与回显，不校验存在性、不解析符号链接、不据此创建会话。
 */
import { now, newId } from '../db/db.js';
import { taskTransaction } from '../task/write/task-transaction.js';
import {
  workspaceError, workspaceOut, requireWorkspace, taskCount,
  workspacesForTasks, attachTasks, detachTasks, removeWorkspace, normalizeDir,
} from './workspace-store.js';

function text(value) {
  return value === undefined || value === null ? '' : String(value);
}

function renderWorkspace(w) {
  const dir = w.dir ? '（dir=' + w.dir + '）' : '（未设置目录）';
  return '工作区：' + (w.title || w.name || w.id) + dir + ' id=' + w.id;
}

export function registerWorkspaceActions(api) {
  const db = api.db;
  const action = api.action;

  action('taskWorkspaces.create', {
    description: '新建工作区（id/title 必填，name/description/dir 可选）。dir 只接受本机绝对路径，仅保存与回显，不校验存在性、不解析符号链接；标题允许重名，用 id 区分。',
    input: {
      type: 'object',
      required: ['title'],
      properties: {
        title: { type: 'string', description: '工作区标题，非空' },
        name: { type: 'string', description: '工作区标识/简称，可空；展示优先标题' },
        description: { type: 'string', description: '详细说明；非本机工作区用它解释为什么没有实际路径' },
        dir: { type: 'string', description: '本机绝对路径（POSIX / 开头，或 Windows X:\\ / UNC），可空' },
      },
      additionalProperties: false,
    },
    examples: [{ title: 'dsh-workbench 插件开发', name: 'workbench', dir: '/Users/yyq/code/dsh-workbench' }],
    execute: function (args) {
      const title = text(args.title).trim();
      if (!title) throw workspaceError('WORKSPACE_TITLE_REQUIRED', 'title 不能为空');
      const ts = now();
      const row = {
        id: newId(),
        title,
        name: text(args.name),
        description: text(args.description),
        dir: normalizeDir(args.dir),
        created_at: ts,
        updated_at: ts,
        deleted_at: null,
        rev: 1,
      };
      db.prepare('INSERT INTO task_workspace(id,title,name,description,dir,created_at,updated_at,deleted_at,rev) VALUES(?,?,?,?,?,?,?,?,?)').run(...Object.values(row));
      api.emit('task-workspaces-changed', { id: row.id, op: 'create' });
      return { workspace: workspaceOut(row), taskCount: 0 };
    },
    render: function (r) { return renderWorkspace(r.workspace); },
  });

  action('taskWorkspaces.get', {
    description: '按 id 取工作区（含 taskCount）。已删除的工作区返回 WORKSPACE_DELETED。',
    input: { type: 'object', required: ['id'], properties: { id: { type: 'string' } }, additionalProperties: false },
    examples: [{ id: '工作区id' }],
    execute: function (args) {
      const row = requireWorkspace(db, args.id);
      return { workspace: workspaceOut(row), taskCount: taskCount(db, row.id) };
    },
    render: function (r) { return renderWorkspace(r.workspace) + '，挂 ' + r.taskCount + ' 个任务'; },
  });

  action('taskWorkspaces.update', {
    description: '更新工作区字段（只改传入的字段，不改任务关联）。dir 传 null 或空串表示清空目录；非空必须是本机绝对路径。',
    input: {
      type: 'object',
      required: ['id'],
      properties: {
        id: { type: 'string' },
        title: { type: 'string' },
        name: { type: 'string' },
        description: { type: 'string' },
        dir: { type: ['string', 'null'], description: 'l: 传 null 清空' },
      },
      additionalProperties: false,
    },
    examples: [{ id: '工作区id', dir: '/Users/yyq/code/dsh-tasks' }],
    execute: function (args) {
      const cur = requireWorkspace(db, args.id);
      const next = Object.assign({}, cur);
      if (args.title !== undefined) {
        const title = text(args.title).trim();
        if (!title) throw workspaceError('WORKSPACE_TITLE_REQUIRED', 'title 不能为空');
        next.title = title;
      }
      if (args.name !== undefined) next.name = text(args.name);
      if (args.description !== undefined) next.description = text(args.description);
      if (args.dir !== undefined) next.dir = normalizeDir(args.dir);
      next.updated_at = now();
      next.rev = Number(cur.rev) + 1;
      db.prepare('UPDATE task_workspace SET title=?,name=?,description=?,dir=?,updated_at=?,rev=? WHERE id=?').run(next.title, next.name, next.description, next.dir, next.updated_at, next.rev, next.id);
      api.emit('task-workspaces-changed', { id: String(next.id), op: 'update' });
      return { workspace: workspaceOut(next) };
    },
    render: function (r) { return renderWorkspace(r.workspace); },
  });

  action('taskWorkspaces.delete', {
    description: '删除工作区：软删实体并同事务软删全部任务关联，任务本身不动。dryRun=true 只返回将影响的关联数与任务数，不写库。',
    input: { type: 'object', required: ['id'], properties: { id: { type: 'string' }, dryRun: { type: 'boolean', description: '只预览影响面' } }, additionalProperties: false },
    examples: [{ id: '工作区id' }, { id: '工作区id', dryRun: true }],
    execute: function (args, ctx) {
      if (args.dryRun) return removeWorkspace(db, args.id, ctx.origin, api, now(), true);
      return taskTransaction(db, api, (buffered) => removeWorkspace(db, args.id, ctx.origin, buffered, now(), false));
    },
    render: function (r) {
      return (r.dryRun ? '预览删除工作区：' : '已删除工作区：') + r.id + '，影响 ' + r.affectedLinks + ' 条关联、' + r.affectedTasks + ' 个任务';
    },
  });

  action('taskWorkspaces.list', {
    description: '列出工作区：keyword 同时匹配 title/name/description；directoryOnly=true 只看设置了 dir 的；默认按 updated_at 倒序，上限 100。每条带 taskCount（已删任务不计）。',
    input: {
      type: 'object',
      properties: {
        keyword: { type: 'string' },
        directoryOnly: { type: 'boolean' },
        pageNumber: { type: 'number', description: '从 1 开始' },
        pageSize: { type: 'number', description: '默认 50，上限 100' },
      },
      additionalProperties: false,
    },
    examples: [{ keyword: 'workbench' }, { directoryOnly: true, pageSize: 100 }],
    execute: function (args) {
      const keyword = text(args.keyword).trim();
      const where = ['w.deleted_at IS NULL'];
      const params = [];
      if (keyword) {
        const like = '%' + keyword.replace(/[\\%_]/g, '\\$&') + '%';
        where.push("(w.title LIKE ? ESCAPE '\\' OR w.name LIKE ? ESCAPE '\\' OR w.description LIKE ? ESCAPE '\\')");
        params.push(like, like, like);
      }
      if (args.directoryOnly) where.push("w.dir IS NOT NULL AND w.dir<>''");
      const pageSize = Math.min(100, Math.max(1, Math.trunc(Number(args.pageSize) || 50)));
      const pageNumber = Math.max(1, Math.trunc(Number(args.pageNumber) || 1));
      const base = ' FROM task_workspace w WHERE ' + where.join(' AND ');
      const total = db.prepare('SELECT COUNT(*) AS n' + base).get(...params).n;
      const rows = db.prepare('SELECT w.*' + base + ' ORDER BY w.updated_at DESC,w.id ASC LIMIT ? OFFSET ?').all(...params, pageSize, (pageNumber - 1) * pageSize);
      const records = rows.map(function (row) {
        const w = workspaceOut(row);
        w.taskCount = taskCount(db, row.id);
        return w;
      });
      return { records, total, returned: records.length, pageNumber, pageSize, filter: { keyword: keyword || null, directoryOnly: Boolean(args.directoryOnly) } };
    },
    render: function (r) {
      const lines = ['工作区 ' + r.total + ' 个（返回 ' + r.returned + '）'];
      for (const w of r.records) lines.push('- ' + (w.title || w.name || w.id) + ' · ' + w.taskCount + ' 个任务' + (w.dir ? ' · ' + w.dir : ''));
      return lines.join('\n');
    },
  });

  action('taskWorkspaces.attach', {
    description: '把任务挂到工作区：逐条幂等，已挂的进 existing，任务不存在/已删进 failed（reason=not_found），不整批报错。',
    input: {
      type: 'object',
      required: ['workspaceId', 'taskIds'],
      properties: {
        workspaceId: { type: 'string' },
        taskIds: { type: 'array', items: { type: 'string' }, description: '任务 id 列表' },
      },
      additionalProperties: false,
    },
    examples: [{ workspaceId: '工作区id', taskIds: ['任务id'] }],
    execute: function (args, ctx) {
      return taskTransaction(db, api, (buffered) => attachTasks(db, args.workspaceId, args.taskIds, now(), ctx.origin, buffered));
    },
    render: function (r) {
      return '已挂 ' + r.attached.length + ' 条，已存在 ' + r.existing.length + ' 条，失败 ' + r.failed.length + ' 条';
    },
  });

  action('taskWorkspaces.detach', {
    description: '从工作区摘除任务：幂等；本来没挂的进 missing，不报错。只解除关联，任务与工作区都保留。',
    input: {
      type: 'object',
      required: ['workspaceId', 'taskIds'],
      properties: {
        workspaceId: { type: 'string' },
        taskIds: { type: 'array', items: { type: 'string' } },
      },
      additionalProperties: false,
    },
    examples: [{ workspaceId: '工作区id', taskIds: ['任务id'] }],
    execute: function (args, ctx) {
      return taskTransaction(db, api, (buffered) => detachTasks(db, args.workspaceId, args.taskIds, now(), ctx.origin, buffered));
    },
    render: function (r) { return '已摘除 ' + r.detached.length + ' 条，未关联 ' + r.missing.length + ' 条'; },
  });

  action('tasks.workspaces', {
    description: '取某个任务关联的工作区列表（含 dir）。已删工作区或已删关联不会出现。',
    input: { type: 'object', properties: { id: { type: 'string' }, taskId: { type: ['string', 'number'] } }, additionalProperties: false },
    examples: [{ id: '任务id' }],
    execute: function (args) {
      const id = text(args.id || args.taskId).trim();
      if (!id) throw workspaceError('TASK_ID_REQUIRED', '必须提供任务 id');
      const task = db.prepare('SELECT id FROM task WHERE id=? AND deleted_at IS NULL').get(id);
      if (!task) throw workspaceError('TASK_NOT_FOUND', '任务不存在：' + id, { id });
      return { taskId: id, workspaces: workspacesForTasks(db, [id]).get(id) || [] };
    },
    render: function (r) {
      if (!r.workspaces.length) return '任务 ' + r.taskId + ' 未关联工作区';
      return '任务 ' + r.taskId + ' 关联 ' + r.workspaces.length + ' 个工作区：' + r.workspaces.map((w) => w.title || w.name || w.id).join('、');
    },
  });
}
