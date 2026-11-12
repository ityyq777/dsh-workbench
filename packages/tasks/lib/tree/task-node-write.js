/** 节点无事务助手：调用者必须持有最外层 BEGIN IMMEDIATE，事件由调用者提交后发送。 */
import limits from '../../shared/tree/limits.cjs';
const { NAME_MAX } = limits;
import { nodeMap, newId, now, insertNode, logChange } from '../db/db.js';
import { ownershipError, pathFromMap } from '../task/model/task-ownership-path.js';
export function validateNodePlacement(db, parentId, name, excludeId = '') {
  const map = nodeMap(db), parent = map.get(String(parentId));
  if (!parent || parent.deleted_at != null) throw ownershipError('TREE_CORRUPT', '父节点不存在或已删除：' + parentId);
  if (!['0', '2'].includes(String(parent.type))) throw ownershipError('PATH_TYPE_CONFLICT', '任务表下面不能再建节点');
  pathFromMap(parent.id, map);
  if (!name || name.length > NAME_MAX) throw ownershipError('INVALID_PATH', `节点名称不能为空且最多 ${NAME_MAX} 个字符`);
  const matches = db.prepare('SELECT * FROM task_node WHERE parent_id=? AND name=? AND deleted_at IS NULL AND id<>?').all(String(parentId), name, String(excludeId));
  if (matches.length) throw ownershipError('PATH_AMBIGUOUS', '同一父节点下已存在同名节点：' + name, { candidates: matches.map(n => ({ id: String(n.id), type: String(n.type), path: pathFromMap(n.id, map).path })) });
  return parent;
}
export function insertOwnedNode(db, parentId, name, type, description, origin) {
  const parent = validateNodePlacement(db, parentId, name);
  if (!['0','1'].includes(String(type))) throw ownershipError('PATH_TYPE_CONFLICT', '只能新建组或任务表');
  if (typeof description !== 'string' || description.length > 2000) throw ownershipError('INVALID_PATH', 'description 必须是最多2000字符的字符串');
  const ts = now(), id = newId();
  const max = db.prepare('SELECT MAX(sort) AS m FROM task_node WHERE parent_id=? AND deleted_at IS NULL').get(String(parent.id));
  const parentChain = pathFromMap(parent.id, nodeMap(db)).pathSegments;
  const row = { id, name, description, type: String(type), parent_id: String(parent.id), path: '/' + parentChain.map(n => n.id).concat(id).join('/') + '/', sort: max.m == null ? 0 : Number(max.m)+1, depth: parentChain.length, created_at: ts, updated_at: ts, deleted_at: null, rev: 1 };
  insertNode(db, row); logChange(db, 'task_node', id, 'create', row, origin, ts);
  return row;
}
