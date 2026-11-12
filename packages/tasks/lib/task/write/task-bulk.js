import { taskTransaction } from './task-transaction.js';
import { validateTargetArgs } from './task-target.js';
import { ownershipFields, renderOwnership } from '../model/task-ownership-path.js';
/**
 * 批量写入：bulkUpdate / bulkCreate / bulkDelete。
 *
 * 复用 tasks.js 的字段校验与行写入助手；这里只管批量语义（dryRun、skipMissing、逐条 change）。
 * 与 tasks.js 是允许的循环依赖：两边都只在调用期取对方的函数，顶层不做求值。
 */

import { setMembership, touchTimelines } from "../../timeline/timeline-store.js";
import { now, idOf, todayStr, logChange, taskOut, nodeMap } from "../../db/db.js";
import { tagsAvailable, replaceTaskTags } from "../../tagging/tagging.js";
import {
  PATCH_FIELDS,
  DIFF_COLUMNS,
  STATUSES,
  STATUS_NAMES,
  asCode,
  priorityForStatus,
  clampDifficulty,
  dateArg,
  requireTable,
  checkRequiredDates,
  getTask,
  saveTaskRow,
  writeChange,
  currentTaskTagIds,
  resolveTagPatch,
  withNotices,
  tagMissingNotices,
  createTask,
  emitChange,
} from "../../tasks.js";

export function idList(argsIds) {
  const ids = Array.isArray(argsIds) ? argsIds.map(function (x) { return idOf(x); }).filter(Boolean) : [];
  const seen = new Set();
  const out = [];
  for (const id of ids) {
    if (seen.has(id)) continue;
    seen.add(id);
    out.push(id);
  }
  return out;
}

export function patchOf(raw) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) throw new Error("patch 必须是对象");
  const patch = {};
  for (const key of Object.keys(raw)) {
    if (PATCH_FIELDS.indexOf(key) >= 0) patch[key] = raw[key];
  }
  const unknown = Object.keys(raw).filter(function (k) { return PATCH_FIELDS.indexOf(k) < 0; });
  if (unknown.length) throw new Error("patch 含不支持的字段：" + unknown.join(", ") + "（可用：" + PATCH_FIELDS.join(", ") + "）");
  if (!Object.keys(patch).length) throw new Error("patch 不能为空");
  return patch;
}

export function diffRow(before, after) {
  const out = {};
  for (const pair of DIFF_COLUMNS) {
    const a = before[pair[1]];
    const b = after[pair[1]];
    if (String(a === undefined ? null : a) !== String(b === undefined ? null : b)) {
      out[pair[0]] = { from: a === undefined ? null : a, to: b === undefined ? null : b };
    }
  }
  return out;
}

/**
 * 按 patch 生成下一版任务行（不落库）。
 * 不复用 updateTask：它的 type 参数是“更新模式”，与任务字段 type 冲突。
 */
export function applyPatchRow(db, cur, patch, ts) {
  const next = Object.assign({}, cur);
  if ("title" in patch) {
    const title = String(patch.title === null || patch.title === undefined ? "" : patch.title).trim();
    if (!title) throw new Error("title 不能为空");
    next.title = title;
  }
  if ("description" in patch) next.description = String(patch.description === null || patch.description === undefined ? "" : patch.description);
  if ("status" in patch) next.status = asCode(patch.status, STATUS_NAMES, STATUSES, "status");
  if (next.status === "4") {
    const error = new Error("状态「已接取」不能通过 bulkUpdate 直接写入，请使用 tasks.claimBatch 接取");
    error.code = "CLAIM_REQUIRED";
    throw error;
  }
  if ("priority" in patch) next.priority = priorityForStatus(next.status, patch.priority, Number(cur.priority) || 1);
  if ("difficulty" in patch) next.difficulty = clampDifficulty(patch.difficulty, null);
  if ("review" in patch) next.review = String(patch.review === null || patch.review === undefined ? "" : patch.review);
  if ("tableId" in patch) next.table_id = String(requireTable(db, patch.tableId).id);
  if ("publishDate" in patch) next.publish_date = dateArg(patch.publishDate, "publishDate") || String(cur.publish_date);
  if ("targetDate" in patch) next.target_date = dateArg(patch.targetDate, "targetDate") || String(cur.target_date);
  if ("doneDate" in patch) next.done_date = dateArg(patch.doneDate, "doneDate");
  if ("shutdownDate" in patch) next.shutdown_date = dateArg(patch.shutdownDate, "shutdownDate");
  // tagIds 不是 task 列，由 bulkUpdate 在行写入后同步 tag_mapping。
  if (next.status === "2" && !next.done_date) next.done_date = todayStr();
  if (next.status === "2" && (next.difficulty === null || next.difficulty === undefined)) next.difficulty = 0;
  if (next.status !== "0" && next.status !== "4") next.priority = 0;
  else if (!next.priority) next.priority = 1;
  if (next.status === "1" || next.status === "2") { next.owner = null; next.claimed_at = null; next.claim_token = null; }
  if (next.status === "1" && !next.shutdown_date) next.shutdown_date = todayStr();
  checkRequiredDates(next);
  next.updated_at = ts;
  next.rev = Number(cur.rev) + 1;
  return next;
}

export function bulkUpdate(db, args, origin, api, opts) {
  if (!opts?.skipTx) return taskTransaction(db, api, buffered => bulkUpdate(db,args,origin,buffered,{skipTx:true}), args.dryRun === true);
  const ids = idList(args.ids);
  if (!ids.length) throw new Error("ids 不能为空");
  const patch = patchOf(args.patch);
  const wantsTagWrite = patch.tagIds !== undefined || patch.tags !== undefined
    || patch.addTagIds !== undefined || patch.addTags !== undefined
    || patch.removeTagIds !== undefined || patch.removeTags !== undefined;
  const tagWritable = tagsAvailable(db, api);
  const dryRun = args.dryRun === true;
  const skipMissing = args.skipMissing === true;
  const ts = now();
  const changes = [];
  const missing = [];
  const plan = function () {
    for (const id of ids) {
      const cur = getTask(db, id);
      if (!cur) {
        if (skipMissing) {
          missing.push(id);
          continue;
        }
        throw new Error("任务不存在：" + id + "（可用 skipMissing:true 忽略）");
      }
      const next = applyPatchRow(db, cur, patch, ts);
      // 标签名只在真正写入时补建；dryRun 只认已存在的同名标签。
      const desired = wantsTagWrite && tagWritable ? resolveTagPatch(db, cur, patch, ts, origin, dryRun) : null;
      const diff = diffRow(cur, next);
      if (desired) diff.tagIds = { from: currentTaskTagIds(db, id), to: desired };
      const task = taskOut(next,nodeMap(db));
      changes.push({ id: id, changes: diff, task, ...ownershipFields(task) });
      if (!dryRun) {
        saveTaskRow(db, next);
        if (desired) replaceTaskTags(db, id, desired, ts, origin);
        writeChange(db, next, "update", origin, api, ts);
      }
    }
  };
  plan();
  return withNotices({
    dryRun: dryRun,
    updated: dryRun ? 0 : changes.length,
    wouldUpdate: dryRun ? changes.length : undefined,
    changes: changes,
    missing: missing,
  }, tagMissingNotices(patch, tagWritable));
}

export function bulkCreate(db, args, origin, api) {
  const records = Array.isArray(args.records) ? args.records : [];
  if (!records.length) throw new Error("records 不能为空");
  const dryRun = args.dryRun === true;
  return taskTransaction(db,api,buffered => {
    // 先校验每条目标，保证无目标不受前一条记录的临时写入影响。
    for (const rec of records) validateTargetArgs(db,rec || {},buffered);
    const touchedTimelines = new Set();
    const results = records.map(rec => createTask(db, rec || {}, origin, buffered, {skipTx:true,touchedTimelines}));
    touchTimelines(db,touchedTimelines,origin,buffered);
    const actual = results.filter(r=>!r.deduped).length;
    const createdNodes = results.flatMap(r=>r.createdNodes || []);
    return { dryRun, created:dryRun ? 0 : actual, wouldCreate:dryRun ? actual : undefined,
      deduped: results.length-actual, results, tasks:results.map(r=>r.task),
      createdNodes:dryRun ? [] : createdNodes, wouldCreateNodes:dryRun ? createdNodes.map(n=>({...n,temporary:true})) : undefined,
      temporaryIds:dryRun ? [...createdNodes.map(n=>n.id),...results.filter(r=>!r.deduped).map(r=>r.id)] : undefined,
      notices:results.flatMap(r=>r.notices || []),
    };
  },dryRun);
}

export function bulkDelete(db, args, origin, api) {
  const ids = idList(args.ids);
  if (!ids.length) throw new Error("ids 不能为空");
  const dryRun = args.dryRun === true;
  const skipMissing = args.skipMissing === true;
  const ts = now();
  const deleted = [];
  const missing = [];
  const items = [];
  const plan = function (buffered = api) {
    const touched = new Set();
    for (const id of ids) {
      const cur = getTask(db, id);
      if (!cur) {
        if (skipMissing) {
          missing.push(id);
          continue;
        }
        throw new Error("任务不存在：" + id + "（可用 skipMissing:true 忽略）");
      }
      deleted.push(id);
      items.push({ id: id, title: String(cur.title || "") });
      if (!dryRun) {
        setMembership(db,id,null,origin,buffered,{ts,project:false,touched});
        const next = Object.assign({}, cur, { timeline_key:null, deleted_at: ts, updated_at: ts, rev: Number(cur.rev) + 1 });
        saveTaskRow(db, next);
        logChange(db, "task", next.id, "delete", null, origin, ts);
        emitChange(buffered, next.id, "delete");
      }
    }
    if (!dryRun) touchTimelines(db,touched,origin,buffered,ts);
  };
  if (dryRun) plan();
  else taskTransaction(db, api, plan);
  return {
    dryRun: dryRun,
    deleted: dryRun ? 0 : deleted.length,
    wouldDelete: dryRun ? deleted.length : undefined,
    ids: deleted,
    items: items,
    missing: missing,
  };
}

export function renderBulkUpdate(r) {
  const lines = [r.dryRun ? "预览：将更新 " + r.wouldUpdate + " 条任务（未写库）" : "已更新 " + r.updated + " 条任务"];
  for (const c of r.changes) {
    const parts = Object.keys(c.changes).map(function (k) {
      return k + " " + String(c.changes[k].from) + "→" + String(c.changes[k].to);
    });
    lines.push("- " + renderOwnership({task:c.task,dryRun:r.dryRun}, "已更新") + (parts.length ? "：" + parts.join("，") : "（无变化）"));
  }
  if (r.missing && r.missing.length) lines.push("跳过不存在的 id：" + r.missing.join(", "));
  return lines.join("\n");
}

export function renderBulkCreate(r) {
  const lines = [r.dryRun ? "预览：将创建 " + r.wouldCreate + " 条任务（未写库）" : "已创建 " + r.created + " 条任务"];
  for (const result of r.results || r.tasks.map(task=>({task}))) lines.push("- " + renderOwnership({...result,dryRun:r.dryRun}));
  return lines.join("\n");
}

export function renderBulkDelete(r) {
  const lines = [r.dryRun ? "预览：将删除 " + r.wouldDelete + " 条任务（未写库）" : "已删除 " + r.deleted + " 条任务"];
  for (const it of r.items) lines.push("- " + it.title + "（id=" + it.id + "）");
  if (r.missing && r.missing.length) lines.push("跳过不存在的 id：" + r.missing.join(", "));
  return lines.join("\n");
}
