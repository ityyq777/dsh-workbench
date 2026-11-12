import { nodeMap } from '../../db/db.js';
import { ownershipError, parseTablePath, pathFromMap } from '../model/task-ownership-path.js';
import { resolveTable, tableCatalog } from '../read/task-discovery.js';
import { insertOwnedNode } from '../../tree/task-node-write.js';

export function validateTargetArgs(db, args, api) {
  const hasId = args.tableId !== undefined && args.tableId !== null && String(args.tableId).trim() !== '';
  const hasPath = args.tablePath !== undefined && args.tablePath !== null && args.tablePath !== '';
  if (hasId && hasPath) throw ownershipError('TARGET_CONFLICT', 'tableId 与 tablePath 恰好提供一个');
  if (hasId && !['string','number'].includes(typeof args.tableId)) throw ownershipError('INVALID_TARGET_OPTIONS', 'tableId 必须是string或number');
  if (!hasId && !hasPath) {
    const query = [args.title, args.description].filter(Boolean).join(' ').trim();
    const found = query ? resolveTable(db, { query, limit: 5 }, api).candidates : [];
    const browse = found.length ? found : tableCatalog(db, api).tables.slice(0,5);
    throw ownershipError('TABLE_REQUIRED', '请先明确选择目标表。' + (found.length ? '以下是词项候选，需核对' : '以下是可浏览表，非推荐'), { candidateTables: browse.map(t => ({ id:t.id, path:t.path, description:t.description, taskCount:t.taskCount })), nextActions: ['tasks.resolveTable(' + JSON.stringify({ query: query || '任务主题' }) + ')', 'tasks.capabilities({limit:50})', '确认新建时使用 tablePath + createMissing:true + pathDescriptions；拿不准就问用户'] });
  }
  if (args.createMissing !== undefined && typeof args.createMissing !== 'boolean') throw ownershipError('INVALID_TARGET_OPTIONS', 'createMissing 必须是 boolean');
  if (hasId && (args.createMissing === true || args.pathDescriptions !== undefined)) throw ownershipError('INVALID_TARGET_OPTIONS', 'createMissing/pathDescriptions 仅用于 tablePath');
  if (args.pathDescriptions !== undefined && args.createMissing !== true) throw ownershipError('INVALID_TARGET_OPTIONS', 'pathDescriptions 仅用于 createMissing=true');
  const parts = hasPath ? parseTablePath(args.tablePath) : null;
  if (args.pathDescriptions !== undefined && (!Array.isArray(args.pathDescriptions) || args.pathDescriptions.length !== parts.length || args.pathDescriptions.some(s => typeof s !== 'string' || s.length > 2000))) throw ownershipError('INVALID_TARGET_OPTIONS', 'pathDescriptions 必须与路径等长，每项为最多2000字符的字符串');
  return { hasId, parts };
}
export function requireOwnedTable(db, id) {
  if (!['string','number'].includes(typeof id) || !String(id).trim()) throw ownershipError('TABLE_NOT_FOUND', 'tableId 不能为空');
  const row = db.prepare('SELECT * FROM task_node WHERE id=? AND deleted_at IS NULL').get(String(id));
  if (!row) throw ownershipError('TABLE_NOT_FOUND', '任务表不存在：' + id);
  if (String(row.type) !== '1') throw ownershipError('TARGET_NOT_TABLE', '目标节点不是任务表：' + id);
  pathFromMap(row.id, nodeMap(db));
  return row;
}
export function resolveTarget(db, args, validated, origin, api) {
  if (validated.hasId) return { table: requireOwnedTable(db, args.tableId), createdNodes: [] };
  const map = nodeMap(db), roots = [...map.values()].filter(n => n.deleted_at == null && String(n.parent_id) === '0');
  if (roots.length !== 1 || String(roots[0].type) !== '2') throw ownershipError('TREE_CORRUPT', '需要唯一逻辑根；请修复树后重试');
  let parent = roots[0];
  const createdNodes = [];
  for (let i=0;i<validated.parts.length;i++) {
    const name = validated.parts[i], type = i === validated.parts.length-1 ? '1' : '0';
    const matches = db.prepare('SELECT * FROM task_node WHERE parent_id=? AND name=? AND deleted_at IS NULL').all(String(parent.id),name);
    if (matches.length > 1) throw ownershipError('PATH_AMBIGUOUS', '同级路径名称不唯一：' + name, { candidates: matches.map(n => ({ id:String(n.id),type:String(n.type),path:pathFromMap(n.id,nodeMap(db)).path })) });
    let node = matches[0];
    if (node && String(node.type) !== type) throw ownershipError('PATH_TYPE_CONFLICT', '路径段 ' + name + ' 必须是' + (type === '1' ? '任务表' : '任务组'));
    if (!node) {
      if (args.createMissing !== true) throw ownershipError('PATH_NOT_FOUND', '已解析 ' + validated.parts.slice(0,i).join('/') + '；第一个缺失段：' + name);
      const description = args.pathDescriptions?.[i];
      if (typeof description !== 'string' || !description.trim()) throw ownershipError('INVALID_TARGET_OPTIONS', '新节点必须给非空职责描述：' + name);
      node = insertOwnedNode(db, parent.id, name, type, description, origin);
      const info = pathFromMap(node.id, nodeMap(db));
      createdNodes.push({ id:String(node.id),name,type,description,...info });
      api.emit('task-nodes-changed', {id:String(node.id),parentId:String(parent.id),op:'create'});
    }
    parent = node;
  }
  return { table: requireOwnedTable(db,parent.id), createdNodes };
}
