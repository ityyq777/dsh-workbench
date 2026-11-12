/**
 * 接取（claim）/ 批量接取（claimBatch）/ 抢夺（grab）。
 *
 * 并发语义是 CAS 抢占：一律用带 `status=` 条件的 UPDATE，读 `run().changes`
 * 判断是否抢到，不做「先 SELECT 判断、再 UPDATE」的两步写法。SELECT 只用于
 * 返回回执与失败原因，不参与抢锁决策。
 */
import { randomUUID } from "node:crypto";
import { now, idOf, logChange } from "../../db/db.js";
import { ownershipError } from "../model/task-ownership-path.js";
import { getTask, outOne, emitChange } from "../model/task-model.js";

import { taskTransaction } from "./task-transaction.js";

const OWNER_MAX = 120;
const STATUS_CLAIMED = "4";
const STATUS_OPEN = "0";
const CLAIMABLE = ["0"];
const GRABBABLE = ["0", "4"];

function claimError(code, message, extra) {
  const error = new Error(message);
  error.code = code;
  if (extra) Object.assign(error, extra);
  return error;
}

function normalizeOwner(value) {
  if (value === undefined || value === null || value === "") return "local";
  if (typeof value !== "string") throw claimError("INVALID_OWNER", "owner 必须是字符串");
  const owner = value.trim();
  if (!owner) return "local";
  if (owner.length > OWNER_MAX) throw claimError("INVALID_OWNER", "owner 最多 " + OWNER_MAX + " 个字符");
  return owner;
}

function loadRow(db, id) {
  return db.prepare("SELECT * FROM task WHERE id=?").get(id) || null;
}

function notFoundMessage(id) {
  return "任务不存在：" + id;
}

function notClaimableError(id, row) {
  const status = String(row.status);
  return claimError("TASK_NOT_CLAIMABLE", "任务 " + id + " 当前状态是 " + status + "，只有「已开启」的任务可以接取", {
    status: status,
    nextActions: ["tasks.get({id:\"" + id + "\"}) 查看当前状态", "换一个已开启的任务", "如果是别人已接取，请先与该 owner 协商"],
  });
}

function failReason(row) {
  if (!row) return "not_found";
  if (row.deleted_at) return "deleted";
  if (String(row.status) === STATUS_CLAIMED) return "already_claimed";
  return "not_claimable";
}

/** 单条 CAS：WHERE status='0' AND deleted_at IS NULL，changes===1 才算抢到。 */
export function claimTask(db, args, origin, api) {
  const id = idOf(args.id || args.taskId);
  if (!id) throw claimError("INVALID_ID", "任务 id 不能为空");
  const owner = normalizeOwner(args.owner);
  const cur = loadRow(db, id);
  if (!cur || cur.deleted_at) throw claimError("TASK_NOT_FOUND", notFoundMessage(id), { id: id });
  const ts = now();
  const token = randomUUID();
  const result = db.prepare(
    "UPDATE task SET status=?,owner=?,claimed_at=?,claim_token=?,updated_at=?,rev=rev+1 " +
    "WHERE id=? AND status=? AND deleted_at IS NULL",
  ).run(STATUS_CLAIMED, owner, ts, token, ts, id, STATUS_OPEN);
  if (result.changes !== 1) {
    const after = loadRow(db, id);
    if (!after || after.deleted_at) throw claimError("TASK_NOT_FOUND", notFoundMessage(id), { id: id });
    throw notClaimableError(id, after);
  }
  const row = Object.assign({}, cur, {
    status: STATUS_CLAIMED, owner: owner, claimed_at: ts, claim_token: token, updated_at: ts, rev: Number(cur.rev) + 1,
  });
  writeClaimChange(db, row, origin, api, ts, "claim");
  return { claimed: true, id: id, task: outOne(db, row), previousStatus: STATUS_OPEN, owner: owner, claimToken: token };
}

function writeClaimChange(db, row, origin, api, ts, kind) {
  logChange(db, "task", row.id, "update", row, origin, ts);
  emitChange(api, row.id, kind || "tasks-changed");
}

function previewBatch(db, ids) {
  const claimed = [], failed = [];
  for (const id of ids) {
    const row = loadRow(db, id);
    if (row && !row.deleted_at && String(row.status) === STATUS_OPEN) claimed.push({ id: id, title: String(row.title || "") });
    else failed.push({ id: id, reason: failReason(row), status: row ? String(row.status) : undefined });
  }
  return { claimed: claimed, failed: failed };
}

export function claimBatch(db, args, origin, api) {
  const raw = Array.isArray(args.ids) ? args.ids : [];
  const ids = [];
  const seen = new Set();
  for (const value of raw) {
    const id = idOf(value);
    if (!id || seen.has(id)) continue;
    seen.add(id);
    ids.push(id);
  }
  if (!ids.length) throw claimError("INVALID_ID", "ids 不能为空");
  const owner = normalizeOwner(args.owner);
  if (args.dryRun === true) {
    const preview = previewBatch(db, ids);
    return {
      dryRun: true,
      requested: ids.length,
      claimed: preview.claimed,
      failed: preview.failed,
      counts: countOf(preview.claimed, preview.failed),
    };
  }
  const claimed = [], failed = [];
  taskTransaction(db, api, function (buffered) {
    const ts = now();
    for (const id of ids) {
      const cur = loadRow(db, id);
      if (!cur || cur.deleted_at) {
        failed.push({ id: id, reason: failReason(cur), status: cur ? String(cur.status) : undefined });
        continue;
      }
      const token = randomUUID();
      const result = db.prepare(
        "UPDATE task SET status=?,owner=?,claimed_at=?,claim_token=?,updated_at=?,rev=rev+1 " +
        "WHERE id=? AND status=? AND deleted_at IS NULL",
      ).run(STATUS_CLAIMED, owner, ts, token, ts, id, STATUS_OPEN);
      if (result.changes !== 1) {
        const after = loadRow(db, id);
        failed.push({ id: id, reason: failReason(after), status: after ? String(after.status) : undefined });
        continue;
      }
      const row = Object.assign({}, cur, {
        status: STATUS_CLAIMED, owner: owner, claimed_at: ts, claim_token: token, updated_at: ts, rev: Number(cur.rev) + 1,
      });
      logChange(db, "task", row.id, "update", row, origin, ts);
      claimed.push({ id: id, task: outOne(db, row), previousStatus: STATUS_OPEN });
    }
    // 整批只发一次变更事件；事件在事务提交后由 taskTransaction 统一发出。
    if (claimed.length) buffered.emit("tasks-changed", { op: "claimBatch", ids: claimed.map(function (x) { return x.id; }), count: claimed.length });
  });
  return { requested: ids.length, claimed: claimed, failed: failed, counts: countOf(claimed, failed) };
}

function countOf(claimed, failed) {
  const counts = { claimed: claimed.length, alreadyClaimed: 0, notClaimable: 0, notFound: 0, deleted: 0, busy: 0 };
  for (const item of failed) {
    if (item.reason === "already_claimed") counts.alreadyClaimed += 1;
    else if (item.reason === "not_found") counts.notFound += 1;
    else if (item.reason === "deleted") counts.deleted += 1;
    else if (item.reason === "busy") counts.busy += 1;
    else counts.notClaimable += 1;
  }
  return counts;
}

/** 抢夺：只允许从「已开启」「已接取」覆盖，返回被覆盖的 owner/token 供审计。 */
export function grabTask(db, args, origin, api) {
  const id = idOf(args.id || args.taskId);
  if (!id) throw claimError("INVALID_ID", "任务 id 不能为空");
  const owner = normalizeOwner(args.owner);
  const cur = loadRow(db, id);
  if (!cur || cur.deleted_at) throw claimError("TASK_NOT_FOUND", notFoundMessage(id), { id: id });
  if (GRABBABLE.indexOf(String(cur.status)) < 0) {
    throw claimError("TASK_NOT_CLAIMABLE", "任务 " + id + " 当前状态是 " + cur.status + "，无法抢夺", {
      status: String(cur.status),
      nextActions: ["tasks.get({id:\"" + id + "\"}) 查看当前状态", "已关闭/已完成/已重启的任务不能抢夺"],
    });
  }
  const ts = now();
  const token = randomUUID();
  const result = db.prepare(
    "UPDATE task SET status=?,owner=?,claimed_at=?,claim_token=?,updated_at=?,rev=rev+1 " +
    "WHERE id=? AND status IN ('0','4') AND deleted_at IS NULL",
  ).run(STATUS_CLAIMED, owner, ts, token, ts, id);
  if (result.changes !== 1) {
    const after = loadRow(db, id);
    throw claimError("TASK_CLAIM_LOST", "任务 " + id + " 在抢夺过程中被其他会话改写，请重新读取后再试", {
      status: after ? String(after.status) : null,
      retryable: true,
    });
  }
  const row = Object.assign({}, cur, {
    status: STATUS_CLAIMED, owner: owner, claimed_at: ts, claim_token: token, updated_at: ts, rev: Number(cur.rev) + 1,
  });
  writeClaimChange(db, row, origin, api, ts, "grab");
  return {
    grabbed: true,
    id: id,
    task: outOne(db, row),
    previousStatus: String(cur.status),
    previousOwner: cur.owner === undefined || cur.owner === null ? null : String(cur.owner),
    previousClaimToken: cur.claim_token === undefined || cur.claim_token === null ? null : String(cur.claim_token),
    owner: owner,
    claimToken: token,
    reason: args.reason === undefined || args.reason === null ? null : String(args.reason),
  };
}

/** 自动化写路径的 ABA 防护：token 必须与当前接取记录一致。 */
export function assertClaimToken(db, id, token) {
  const cur = getTask(db, id);
  if (!cur) throw claimError("TASK_NOT_FOUND", notFoundMessage(id), { id: id });
  if (String(cur.status) !== STATUS_CLAIMED || String(cur.claim_token || "") !== String(token || "")) {
    throw claimError("TASK_CLAIM_LOST", "任务的接取凭据已失效（已释放、已转移或已进入终态），请重新 tasks.get 后再写", {
      status: String(cur.status),
      retryable: true,
    });
  }
}

/** 进入终态（关闭/完成/重启）时清空接取字段，保持列不变量。 */
export function clearClaimFields(row) {
  const next = Object.assign({}, row);
  next.owner = null;
  next.claimed_at = null;
  next.claim_token = null;
  return next;
}

export { claimError, ownershipError };
