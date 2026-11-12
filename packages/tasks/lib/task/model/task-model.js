// 模型助手；与 task-bulk 的循环引用只在调用期取值，顶层不求值。
import {
  idOf,
  dateText,
  logChange,
  taskOut,
  nodeMap,
} from "../../db/db.js";
// task-query 循环依赖仅在调用期读取 tasks 的函数/常量。
import { configValues } from "../../infra/config.js";
import {
  normalizeTagIds,
  normalizeTagNames,
  requireTagRows,
  availableTagsText,
  tagIdsByNames,
  ensureTagsByNames,
} from "../../tagging/tagging.js";
/**
 * 标签名校验：默认（form.autoCreateTags=true）未知名字会被补建；
 * 关掉开关后未知名字直接报错，并把可用标签列出来，调用方一次就能改成已存在的名字。
 */
export function requireKnownTagNames(db, tagNames) {
  if (!tagNames || !tagNames.length) return;
  const values = configValues(db);
  if (values["form.autoCreateTags"] !== false) return;
  const missing = tagIdsByNames(db, tagNames).missing;
  if (missing.length) {
    throw new Error(
      "标签不存在：" + missing.join("、") + "。" + availableTagsText(db, 20) +
      "。当前 form.autoCreateTags=false（写入时不自动创建标签）：可改用上面已有的标签名，" +
      "或在配置页打开「自动创建未知标签」（tasks.configSet key=form.autoCreateTags value=true）",
    );
  }
}

/**
 * 标签域（dsh-workbench-tags）是可选能力：没装时任务照常读写，只是忽略标签参数，
 * 并在回执里带一条 notices，让调用方知道「标签没处理」而不是「任务没写成」。
 */
export const TAG_DOMAIN_NOTICE = {
  code: "tag_domain_missing",
  field: "tags",
  message: "标签模块没有安装，无法处理标签数据；本次已忽略 tags/tagIds/addTags/removeTags",
};

function hasTagArgs(source) {
  return source.tagIds !== undefined || source.tags !== undefined
    || source.addTagIds !== undefined || source.addTags !== undefined
    || source.removeTagIds !== undefined || source.removeTags !== undefined;
}

export function tagMissingNotices(source, available) {
  return available || !hasTagArgs(source) ? [] : [Object.assign({}, TAG_DOMAIN_NOTICE)];
}

export function withNotices(result, notices) {
  if (notices && notices.length) result.notices = notices;
  return result;
}

export const STATUSES = ["0", "1", "2", "3", "4"];
const SOURCES = { TASK_TABLE: "0", TASK_TIMELINE: "1", TASK_RESTART: "2" };
const PUT_TYPES = { STATUS: "0", PRIORITY: "1", TITLE: "2", DESCRIPTION: "3", REVIEW: "4", CLAIM: "5" };
export const STATUS_NAMES = { ACTIVE: "0", SHUTDOWN: "1", DONE: "2", RESTARTED: "3", CLAIMED: "4", open: "0", done: "2" };

export function asCode(value, names, allowed, label) {
  if (value === undefined || value === null || value === "") return null;
  let s = String(value);
  if (names && names[s] !== undefined) s = names[s];
  if (allowed.indexOf(s) < 0) throw new Error(label + " 取值非法：" + value);
  return s;
}

export function sourceCode(value) {
  if (value === undefined || value === null || value === "") return "0";
  if (SOURCES[String(value)] !== undefined) return SOURCES[String(value)];
  const s = String(value);
  if (["0", "1", "2"].indexOf(s) < 0) throw new Error("source 取值非法：" + value);
  return s;
}

export function putTypeCode(value) {
  if (value === undefined || value === null || value === "") return null;
  if (PUT_TYPES[String(value)] !== undefined) return PUT_TYPES[String(value)];
  const s = String(value);
  if (["0", "1", "2", "3", "4"].indexOf(s) < 0) throw new Error("type 取值非法：" + value);
  return s;
}

export { priorityForStatus } from "./task-priority.js";

export function clampDifficulty(value, fallback) {
  if (value === undefined || value === null || value === "") return fallback;
  const n = Number(value);
  if (!Number.isFinite(n)) throw new Error("difficulty 必须是数字");
  if (n < 0 || n > 5) throw new Error("difficulty 必须在 0..5");
  return n;
}

export function dateArg(value, label) {
  if (value === undefined || value === null || value === "") return null;
  const d = dateText(value);
  if (!d) throw new Error(label + " 不是有效日期：" + value);
  return d;
}

export function getTask(db, id) {
  const key = idOf(id);
  if (!key) return null;
  return db.prepare("SELECT * FROM task WHERE id=? AND deleted_at IS NULL").get(key) || null;
}

export function defaultTable(db) {
  const row = db.prepare(
    "SELECT * FROM task_node WHERE type='1' AND deleted_at IS NULL ORDER BY depth ASC, sort ASC LIMIT 1",
  ).get();
  if (!row) throw new Error("还没有任务表，请先在任务树中新建任务表");
  return row;
}

import { requireOwnedTable } from '../write/task-target.js';
export function requireTable(db, tableId) {
  return requireOwnedTable(db, tableId);
}

export function insertTaskRow(db, row) {
  db.prepare(
    "INSERT INTO task(id,title,description,status,priority,difficulty,review,table_id,timeline_key,restart_key,publish_date,target_date,done_date,shutdown_date,dedupe_key,created_at,updated_at,deleted_at,rev) " +
      "VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
  ).run(
    String(row.id),
    String(row.title),
    String(row.description || ""),
    String(row.status),
    Number(row.priority || 0),
    row.difficulty === undefined ? null : row.difficulty,
    String(row.review || ""),
    String(row.table_id),
    row.timeline_key === undefined ? null : row.timeline_key,
    row.restart_key === undefined ? null : row.restart_key,
    String(row.publish_date),
    String(row.target_date),
    row.done_date === undefined ? null : row.done_date,
    row.shutdown_date === undefined ? null : row.shutdown_date,
    row.dedupe_key === undefined ? null : row.dedupe_key,
    Number(row.created_at),
    Number(row.updated_at),
    row.deleted_at === undefined ? null : row.deleted_at,
    Number(row.rev || 1),
  );
}

export function saveTaskRow(db, row) {
  db.prepare(
    "UPDATE task SET title=?,description=?,status=?,priority=?,difficulty=?,review=?,table_id=?,timeline_key=?,restart_key=?,publish_date=?,target_date=?,done_date=?,shutdown_date=?,dedupe_key=?,owner=?,claimed_at=?,claim_token=?,updated_at=?,deleted_at=?,rev=? WHERE id=?",
  ).run(
    String(row.title),
    String(row.description || ""),
    String(row.status),
    Number(row.priority || 0),
    row.difficulty === undefined ? null : row.difficulty,
    String(row.review || ""),
    String(row.table_id),
    row.timeline_key === undefined ? null : row.timeline_key,
    row.restart_key === undefined ? null : row.restart_key,
    String(row.publish_date),
    String(row.target_date),
    row.done_date === undefined ? null : row.done_date,
    row.shutdown_date === undefined ? null : row.shutdown_date,
    row.dedupe_key === undefined ? null : row.dedupe_key,
    row.owner === undefined ? null : row.owner,
    row.claimed_at === undefined ? null : row.claimed_at,
    row.claim_token === undefined ? null : row.claim_token,
    Number(row.updated_at),
    row.deleted_at === undefined ? null : row.deleted_at,
    Number(row.rev || 1),
    String(row.id),
  );
}

export function outOne(db, row) {
  return taskOut(row, nodeMap(db));
}

export function emitChange(api, id, op, kind) {
  api.emit(kind || "tasks-changed", { id: String(id), op: op });
}

export function writeChange(db, row, op, origin, api, ts, kind) {
  logChange(db, "task", row.id, op, op === "delete" ? null : row, origin, ts);
  emitChange(api, row.id, op, kind);
}

export function checkRequiredDates(row) {
  if (!row.publish_date) throw new Error("publishDate 不能为空");
  if (!row.target_date) throw new Error("targetDate 不能为空");
  if (row.target_date < row.publish_date) throw new Error("targetDate 不能早于 publishDate");
  if (row.done_date && row.done_date < row.publish_date) throw new Error("doneDate 不能早于 publishDate");
  if (row.shutdown_date && row.shutdown_date < row.publish_date) throw new Error("shutdownDate 不能早于 publishDate");
}

/** 当前任务挂着的标签 id（未删除）。 */
export function currentTaskTagIds(db, taskId) {
  return db.prepare("SELECT tag_id FROM tag_mapping WHERE item_type='task' AND item_id=? AND deleted_at IS NULL")
    .all(String(taskId)).map(function (r) { return String(r.tag_id); });
}

/**
 * 把「整体替换」与「增量增删」统一成一个期望标签集合。
 * 返回 null 表示这次不动标签。
 */
export function resolveTagPatch(db, cur, source, ts, origin, dryRun) {
  const hasReplace = source.tagIds !== undefined || source.tags !== undefined;
  const hasMerge = source.addTagIds !== undefined || source.addTags !== undefined
    || source.removeTagIds !== undefined || source.removeTags !== undefined;
  if (!hasReplace && !hasMerge) return null;
  if (hasReplace && hasMerge) throw new Error("tags/tagIds 是整体替换，不能与 addTags/removeTags 同时使用");
  if (hasReplace) {
    const ids = source.tagIds === undefined || source.tagIds === null ? [] : normalizeTagIds(source.tagIds);
    const names = source.tags === undefined || source.tags === null ? [] : normalizeTagNames(source.tags);
    requireKnownTagNames(db, names);
    if (ids.length) requireTagRows(db, ids);
    const out = ids.slice();
    const nameIds = dryRun ? tagIdsByNames(db, names).ids : ensureTagsByNames(db, names, ts, origin);
    for (const id of nameIds) if (out.indexOf(id) < 0) out.push(id);
    return out;
  }
  const addIds = source.addTagIds === undefined || source.addTagIds === null ? [] : normalizeTagIds(source.addTagIds);
  const addNames = source.addTags === undefined || source.addTags === null ? [] : normalizeTagNames(source.addTags);
  const rmIds = source.removeTagIds === undefined || source.removeTagIds === null ? [] : normalizeTagIds(source.removeTagIds);
  const rmNames = source.removeTags === undefined || source.removeTags === null ? [] : normalizeTagNames(source.removeTags);
  requireKnownTagNames(db, addNames.concat(rmNames));
  if (addIds.length) requireTagRows(db, addIds);
  const add = addIds.slice();
  const addByName = dryRun ? tagIdsByNames(db, addNames).ids : ensureTagsByNames(db, addNames, ts, origin);
  for (const id of addByName) if (add.indexOf(id) < 0) add.push(id);
  const drop = rmIds.slice();
  for (const id of (tagIdsByNames(db, rmNames).ids || [])) if (drop.indexOf(id) < 0) drop.push(id);
  const set = currentTaskTagIds(db, cur.id);
  for (const id of add) if (set.indexOf(id) < 0) set.push(id);
  return set.filter(function (id) { return drop.indexOf(id) < 0; });
}
/** bulk* 系列允许直接写的字段（与 tasks.update 的自由字段一致）。 */
export const PATCH_FIELDS = [
  "title", "description", "status", "priority", "difficulty", "review",
  "publishDate", "targetDate", "doneDate", "shutdownDate", "tableId", "tagIds", "tags",
  "addTagIds", "addTags", "removeTagIds", "removeTags",
];

export const DIFF_COLUMNS = [
  ["title", "title"], ["description", "description"], ["status", "status"],
  ["priority", "priority"], ["difficulty", "difficulty"], ["review", "review"], ["tableId", "table_id"],
  ["publishDate", "publish_date"], ["targetDate", "target_date"],
  ["doneDate", "done_date"], ["shutdownDate", "shutdown_date"],
];
