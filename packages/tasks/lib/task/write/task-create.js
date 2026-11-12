import { timelineIdArg, requireTimeline, activeTimeline, timelineError, setMembership } from "../../timeline/timeline-store.js";
import { difficultyMissingNotices, cleanDifficultyReceipt } from "../model/task-difficulty.js";
// 与 task-bulk 的循环引用只在调用期取值，顶层不求值。
import {
  now,
  newId,
  idOf,
  todayStr,
} from "../../db/db.js";
// task-query 循环依赖仅在调用期读取 tasks 的函数/常量。
import { priorityForCreate } from "../model/task-priority.js";
import {
  tagsAvailable,
  normalizeTagIds,
  normalizeTagNames,
  requireTagRows,
  ensureTagsByNames,
  replaceTaskTags,
  attachTags,
} from "../../tagging/tagging.js";
import { requireKnownTagNames, tagMissingNotices, withNotices, STATUSES, STATUS_NAMES, asCode, sourceCode, clampDifficulty, dateArg, getTask, insertTaskRow, saveTaskRow, outOne, writeChange, checkRequiredDates } from "../model/task-model.js";
import { taskTransaction } from './task-transaction.js';
import { setTaskWorkspaces, attachWorkspaces } from '../../workspace/workspace-store.js';
import { validateTargetArgs, resolveTarget, requireOwnedTable } from './task-target.js';
import { ownershipError, ownershipFields } from '../model/task-ownership-path.js';
// 标题不做唯一性校验：允许与其它任务同名，调用方用 id 区分（与标签名唯一是两条规则）。
export function createTask(db, args, origin, api, opts) {
  if (!opts?.skipTx) return taskTransaction(db, api, buffered => createTask(db, args, origin, buffered, {skipTx:true}));
  const validated = validateTargetArgs(db, args, api);
  const title = String(args.title === undefined || args.title === null ? "" : args.title).trim();
  if (!title) throw new Error("title 不能为空");
  const dedupeKey = String(args.dedupeKey === undefined || args.dedupeKey === null ? "" : args.dedupeKey).trim() || null;
  if (dedupeKey) {
    const matches = db.prepare("SELECT * FROM task WHERE dedupe_key=? AND deleted_at IS NULL ORDER BY created_at ASC").all(dedupeKey);
    if (matches.length > 1) throw ownershipError('DEDUPE_AMBIGUOUS', '幂等键对应多个存活任务：' + dedupeKey);
    const existing = matches[0];
    if (existing) {
      requireOwnedTable(db, existing.table_id);
      const task = outOne(db, existing);
      attachTags(db, api, task);
      const same = validated.hasId ? String(args.tableId) === task.tableId : JSON.stringify(validated.parts) === JSON.stringify(task.pathSegments.slice(1).map(n=>n.name));
      const notices = [...tagMissingNotices(args, tagsAvailable(db, api)), ...difficultyMissingNotices(args, task.difficulty)];
      cleanDifficultyReceipt(task);
      if (!same) notices.push({code:'DEDUPE_TARGET_MISMATCH',message:'返回已有任务实际归属，未移动任务或创建请求路径节点；纠正请调用 tasks.update(' + JSON.stringify({id:task.id,tableId:'目标表id'}) + ')'});
      return withNotices({ id: String(existing.id), task, ...ownershipFields(task), deduped: true, existing: true, createdNodes: [] }, notices);
    }
  }
  const source = sourceCode(args.source);
  let status = asCode(args.status, STATUS_NAMES, STATUSES, "status");
  if (status === null) status = "0";
  if (status === "3") throw new Error("创建任务时不能直接使用 RESTARTED 状态");
  if (source === "2") status = "0";

  const publishDate = dateArg(args.publishDate, "publishDate") || todayStr();
  const targetDate = dateArg(args.targetDate, "targetDate") || publishDate;
  let doneDate = dateArg(args.doneDate, "doneDate");
  let shutdownDate = dateArg(args.shutdownDate, "shutdownDate");
  let difficulty = clampDifficulty(args.difficulty, null);
  let priority = priorityForCreate(status, args.priority, source);

  if (status === "0") {
    if (difficulty !== null) {
      /* ACTIVE 也允许保留难度，兼容直接调用 */
    }
  } else if (status === "2") {
    if (!doneDate) doneDate = todayStr();
    if (difficulty === null) difficulty = 0;
    if (doneDate < publishDate) throw new Error("doneDate 不能早于 publishDate");
  } else if (status === "1") {
    if (!shutdownDate) shutdownDate = todayStr();
    if (shutdownDate < publishDate) throw new Error("shutdownDate 不能早于 publishDate");
  }
  // 关闭/完成的任务同样清零（见 priorityForStatus）；开启任务缺省 P1，不再有「P0 开启」。
  if (targetDate < publishDate) throw new Error("targetDate 不能早于 publishDate");

  let timelineKey = timelineIdArg(args, false);
  if (source === "0" && timelineKey) throw timelineError("TIMELINE_SOURCE_CONFLICT", "普通任务不接受时间线，请使用 source=1 或 taskTimelines.attach");
  let restartKey = idOf(args.restartKey || args.originTaskId);
  if (source === "1") {
    if (!timelineKey) throw timelineError("TIMELINE_ID_REQUIRED", "时间线任务必须提供 timelineId");
    requireTimeline(db, timelineKey);
  }
  if (source === "2") {
    if (!restartKey) throw new Error("重启任务必须提供 restartKey（原任务 id）");
    const originTask = getTask(db, restartKey);
    if (!originTask) throw new Error("原任务不存在：" + restartKey);
    const inherited = activeTimeline(db,restartKey);
    if (!inherited) throw timelineError('TIMELINE_REQUIRED_FOR_RESTART','请先手动建立并关联时间线，再重启',{taskId:restartKey,reason:'NO_ACTIVE_MEMBERSHIP',nextActions:['taskTimelines.create','taskTimelines.attach','tasks.create']});
    if (timelineKey && timelineKey !== inherited.id) throw timelineError('TIMELINE_INHERITANCE_CONFLICT','重启必须继承原任务时间线');
    timelineKey = inherited.id;
  }

  const { table, createdNodes } = resolveTarget(db, args, validated, origin, api);
  const tagIds = args.tagIds === undefined || args.tagIds === null ? null : normalizeTagIds(args.tagIds);
  // 允许直接传标签名（如 ["工作","紧急"]），缺失的标签按名补建。
  const tagNames = normalizeTagNames(args.tags);
  const tagOn = tagsAvailable(db, api);
  if (tagOn) {
    requireKnownTagNames(db, tagNames);
    if (tagIds) requireTagRows(db, tagIds);
  }

  const id = newId();
  if (source === "0") {
    timelineKey = null;
    restartKey = id;
  } else if (source === "1") {
    restartKey = id;
  } else {
    restartKey = restartKey;
  }

  const ts = now();
  const row = {
    id,
    title,
    description: String(args.description === undefined || args.description === null ? "" : args.description),
    status,
    priority,
    difficulty,
    review: String(args.review === undefined || args.review === null ? "" : args.review),
    table_id: String(table.id),
    timeline_key: timelineKey || null,
    restart_key: restartKey || null,
    publish_date: publishDate,
    target_date: targetDate,
    done_date: doneDate,
    shutdown_date: shutdownDate,
    dedupe_key: dedupeKey,
    created_at: ts,
    updated_at: ts,
    deleted_at: null,
    rev: 1,
  };
  checkRequiredDates(row);

  const body = function () {
    if (source === "2") {
      const active = db.prepare(
        "SELECT * FROM task WHERE restart_key=? AND status IN ('0','4') AND deleted_at IS NULL",
      ).all(restartKey);
      const shutdownTs = now();
      for (const old of active) {
        const next = Object.assign({}, old, { status: "1", priority: 0, shutdown_date: todayStr(), owner: null, claimed_at: null, claim_token: null, updated_at: shutdownTs, rev: Number(old.rev) + 1 });
        saveTaskRow(db, next);
        writeChange(db, next, "update", origin, api, shutdownTs);
      }
      const shutdown = db.prepare(
        "SELECT * FROM task WHERE restart_key=? AND status='1' AND deleted_at IS NULL",
      ).all(restartKey);
      for (const old of shutdown) {
        const next = Object.assign({}, old, { status: "3", priority: 0, updated_at: shutdownTs, rev: Number(old.rev) + 1 });
        saveTaskRow(db, next);
        writeChange(db, next, "update", origin, api, shutdownTs);
      }
    }
    insertTaskRow(db, row);
    if (timelineKey) setMembership(db,id,timelineKey,origin,api,{ts,project:false,touched:opts?.touchedTimelines});
    if ((tagIds || tagNames.length) && tagOn) {
      const all = (tagIds || []).slice();
      for (const tagId of ensureTagsByNames(db, tagNames, ts, origin)) {
        if (all.indexOf(tagId) < 0) all.push(tagId);
      }
      replaceTaskTags(db, id, all, ts, origin);
    }
    if (args.workspaceIds !== undefined && args.workspaceIds !== null) {
      setTaskWorkspaces(db, id, args.workspaceIds, ts, origin, api);
    }
    writeChange(db, row, "create", origin, api, ts);
  };
  // skipTx 供 bulkCreate 在外层事务里复用；单条创建仍自己开事务。
  body();

  const task = outOne(db, row);
  attachTags(db, api, task);
  attachWorkspaces(db, [task]);
  return withNotices({ id: id, task: cleanDifficultyReceipt(task), ...ownershipFields(task), createdNodes, deduped: false }, [...tagMissingNotices(args, tagOn), ...difficultyMissingNotices(args, difficulty)]);
}
