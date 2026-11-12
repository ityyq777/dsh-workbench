/** 归属路径校验和邻接链派生；纯函数，不依赖任务业务模块。 */
export function ownershipError(code, message, details = {}) {
  const candidateTables = (details.candidateTables || []).slice(0,5);
  const nextActions = details.nextActions || ['tasks.capabilities({limit:50})', 'tasks.resolveTable({query:"任务主题"})', '确认后使用 tablePath + createMissing:true + pathDescriptions；拿不准就问用户'];
  const error = new Error(code + '：' + message + '；未执行本次写入。' + (candidateTables.length ? ' 候选：' + JSON.stringify(candidateTables) : '') + ' 下一步：' + nextActions.join('；') + (details.candidates ? ' 冲突：' + JSON.stringify(details.candidates) : ''));
  error.code = code;
  error.details = { code, message, candidateTables, nextActions, retryable: false, ...details };
  return error;
}
export function pathFromMap(id, map) {
  const chain = [], seen = new Set();
  let cur = map.get(String(id));
  if (!cur) throw ownershipError('TABLE_NOT_FOUND', '任务表不存在：' + id);
  while (cur) {
    const key = String(cur.id);
    if (seen.has(key)) throw ownershipError('TREE_CORRUPT', '任务树存在环：' + key);
    if (cur.deleted_at != null) throw ownershipError('TREE_CORRUPT', '任务树含已删除节点：' + key);
    if (String(cur.type) === '2' && String(cur.parent_id) !== '0') throw ownershipError('TREE_CORRUPT', '逻辑根不能挂在其它节点下');
    seen.add(key); chain.unshift(cur);
    if (String(cur.parent_id) === '0') {
      if (String(cur.type) !== '2') throw ownershipError('TREE_CORRUPT', '祖先链未终止于逻辑根');
      break;
    }
    cur = map.get(String(cur.parent_id));
    if (!cur) throw ownershipError('TREE_CORRUPT', '任务树祖先缺失');
    if (!['0', '2'].includes(String(cur.type))) throw ownershipError('TREE_CORRUPT', '任务表不能充当祖先');
  }
  const roots = [...map.values()].filter(n => n.deleted_at == null && String(n.parent_id) === '0');
  if (roots.length !== 1 || String(roots[0].id) !== String(chain[0].id)) throw ownershipError('TREE_CORRUPT', '需要唯一逻辑根');
  const pathSegments = chain.map(n => ({ id: String(n.id), name: String(n.name), type: String(n.type), description: String(n.description || '') }));
  const names = pathSegments.slice(1).map(n => n.name);
  return { path: pathSegments.map(n => n.name).join(' / '), tablePath: names.some(n => n.includes('/')) ? names : names.join('/'), pathSegments };
}
