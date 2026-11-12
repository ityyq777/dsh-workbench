/** 归属路径：从邻接链派生展示信息；不修改历史 ID path。 */
import limits from '../../../shared/tree/limits.cjs';
const { NAME_MAX, PATH_MAX, PATH_LEN_MAX } = limits;
import { ownershipError } from "../../db/ownership-path.js";
export { ownershipError, pathFromMap } from "../../db/ownership-path.js";
export function parseTablePath(value) {
  if (typeof value !== 'string' && !Array.isArray(value)) throw ownershipError('INVALID_PATH', 'tablePath 必须为字符串或字符串数组');
  const raw = Array.isArray(value) ? value : value.split('/');
  if (!raw.length || raw.length > PATH_MAX || raw.some(s => typeof s !== 'string') || raw.join('/').length > PATH_LEN_MAX) throw ownershipError('INVALID_PATH', `路径最多 ${PATH_MAX} 段、总长 ${PATH_LEN_MAX} 字符，且必须是字符串段`);
  const parts = raw.map(s => s.trim());
  if (parts.some(s => !s || s === '.' || s === '..' || s.length > NAME_MAX)) throw ownershipError('INVALID_PATH', `禁止空段、点段、首尾斜杠；每段最多 ${NAME_MAX} 字符`);
  return parts;
}
export function ownershipFields(task) {
  return { tableId: task.tableId, tablePath: task.tablePath, pathSegments: task.pathSegments, tableDescription: task.tableDescription };
}
export function renderOwnership(result, verb = '已创建') {
  const task = result.task;
  const path = (task.pathSegments || []).map(n => n.name).join(' / ');
  if (result.dryRun) return '预览（未写入）：' + task.title + ' → ' + path + (result.deduped ? '（复用已有任务）' : '（新建记录及节点 ID 为临时值）');
  return (result.deduped ? '任务已存在' : verb + '任务') + '：' + task.title + '（id=' + task.id + '）。已放入 ' + path + ' 表；若不属于，请告诉我目标表或新节点名。纠正：tasks.update({id:' + JSON.stringify(task.id) + ',tableId:"目标表id"})' + (result.notices?.length ? '\n' + result.notices.map(n => n.code + '：' + n.message).join('；') : '');
}
