import { setMembership } from "../../timeline/timeline-store.js";
import { taskTransaction } from "./task-transaction.js";
// 与 task-bulk 的循环引用只在调用期取值，顶层不求值。
import {
  now,
  idOf,
  todayStr,
  tx,
  logChange,
  taskOut,
  nodeMap,
} from "../../db/db.js";
// task-query 循环依赖仅在调用期读取 tasks 的函数/常量。
import { listTasks } from "../read/task-query.js";
import { todayActivity } from "../../stats/stats-today.js";
import { csvCell } from "../read/task-view.js";
import { bulkUpdate } from "./task-bulk.js";
import {
  tagsAvailable,
  attachTags,
} from "../../tagging/tagging.js";
import { TAG_DOMAIN_NOTICE, withNotices, dateArg, getTask, saveTaskRow, emitChange, writeChange } from "../model/task-model.js";
import { clearTaskWorkspaces, attachWorkspaces } from "../../workspace/workspace-store.js";
import { updateTask } from "./task-update.js";
export function selectedTasks(db, args) {
  const ids = Array.isArray(args.ids) ? args.ids.map(String) : [];
  if (!ids.length) return [];
  const marks = ids.map(function () { return "?"; }).join(",");
  const rows = db.prepare("SELECT * FROM task WHERE deleted_at IS NULL AND id IN (" + marks + ")").all(...ids);
  const map = nodeMap(db);
  return rows.map(function (r) { return taskOut(r, map); });
}

export { timelineTasks, timelineRefactor } from "../../timeline/task-timelines.js";

export function restartTasks(db, args) {
  const key = idOf(args.restartKey);
  if (!key) return [];
  const rows = db.prepare("SELECT * FROM task WHERE restart_key=? AND deleted_at IS NULL ORDER BY publish_date ASC, id ASC").all(key);
  const map = nodeMap(db);
  return rows.map(function (r) { return taskOut(r, map); });
}


export function migrateTasks(db, args, origin, api) {
  const result = bulkUpdate(db,{ids:args.ids,patch:{tableId:args.tableId},dryRun:args.dryRun},origin,api);
  return {...result, ids:result.changes.map(c=>c.id), tableId:String(args.tableId), tasks:result.changes.map(c=>c.task)};
}

export function sweepShutdown(db, args, origin, api) {
  const day = dateArg(args.date, "date") || todayStr();
  const rows = db.prepare(
    "SELECT * FROM task WHERE status='0' AND target_date<=? AND deleted_at IS NULL",
  ).all(day);
  const dryRun = args.dryRun === true;
  const ts = now();
  const ids = [];
  const items = rows.map(function (cur) {
    return { id: String(cur.id), title: String(cur.title || ""), targetDate: cur.target_date || null };
  });
  if (dryRun) return { dryRun: true, updated: 0, wouldUpdate: rows.length, ids: rows.map(function (r) { return String(r.id); }), items: items, date: day };
  tx(db, function () {
    for (const cur of rows) {
      const next = Object.assign({}, cur, { status: "1", priority: 0, shutdown_date: day, updated_at: ts, rev: Number(cur.rev) + 1 });
      saveTaskRow(db, next);
      writeChange(db, next, "update", origin, api, ts);
      ids.push(String(cur.id));
    }
  });
  return { updated: ids.length, ids: ids, items: items, date: day };
}

export function stats(db, args, api) {
  const a = args || {};
  const day = todayStr();
  const row = db.prepare(
    "SELECT " +
      "SUM(CASE WHEN status='0' AND deleted_at IS NULL THEN 1 ELSE 0 END) AS active, " +
      "SUM(CASE WHEN status='1' AND deleted_at IS NULL THEN 1 ELSE 0 END) AS shutdown, " +
      "SUM(CASE WHEN status='2' AND deleted_at IS NULL THEN 1 ELSE 0 END) AS done, " +
      "SUM(CASE WHEN status='3' AND deleted_at IS NULL THEN 1 ELSE 0 END) AS restarted, " +
      "SUM(CASE WHEN status='0' AND deleted_at IS NULL AND target_date<? THEN 1 ELSE 0 END) AS overdue, " +
      "SUM(CASE WHEN status='0' AND deleted_at IS NULL AND target_date=? THEN 1 ELSE 0 END) AS today " +
      "FROM task",
  ).get(day, day);
  const base = {
    open: row.active || 0,
    active: row.active || 0,
    shutdown: row.shutdown || 0,
    done: row.done || 0,
    restarted: row.restarted || 0,
    overdue: row.overdue || 0,
    today: row.today || 0,
    todayActivity: todayActivity(db, day),
  };
  const groupBy = a.groupBy === undefined || a.groupBy === null || a.groupBy === "" ? null : String(a.groupBy);
  if (!groupBy) return base;
  const COLS = { tableId: "t.table_id", status: "t.status", priority: "t.priority" };
  const col = COLS[groupBy];
  const byTag = groupBy === "tag" || groupBy === "tags";
  if (!col && !byTag) throw new Error("groupBy 只支持 tag / tableId / status / priority");
  const where = ["t.deleted_at IS NULL"];
  const params = [];
  const from = dateArg(a.from, "from");
  const to = dateArg(a.to, "to");
  if (from) { where.push("t.target_date>=?"); params.push(from); }
  if (to) { where.push("t.target_date<=?"); params.push(to); }
  if (byTag) {
    if (!tagsAvailable(db, api)) {
      return withNotices(Object.assign({}, base, { groups: [], available: false }), [Object.assign({}, TAG_DOMAIN_NOTICE)]);
    }
    const tagStmt = db.prepare(
      "SELECT g.id AS k, g.name AS label, COUNT(DISTINCT t.id) AS n FROM task t " +
        "JOIN tag_mapping m ON m.item_type='task' AND m.item_id=t.id AND m.deleted_at IS NULL " +
        "JOIN tag g ON g.id=m.tag_id AND g.deleted_at IS NULL WHERE " + where.join(" AND ") +
        " GROUP BY g.id, g.name ORDER BY n DESC",
    );
    const tagRows = tagStmt.all.apply(tagStmt, params);
    const untaggedStmt = db.prepare(
      "SELECT COUNT(*) AS n FROM task t WHERE " + where.join(" AND ") +
        " AND NOT EXISTS (SELECT 1 FROM tag_mapping m WHERE m.item_type='task' AND m.item_id=t.id AND m.deleted_at IS NULL)",
    );
    const untagged = Number(untaggedStmt.get.apply(untaggedStmt, params).n || 0);
    const groups = tagRows.map(function (g) {
      return { key: String(g.k), label: String(g.label || ""), count: Number(g.n || 0) };
    });
    if (untagged > 0) groups.push({ key: "untagged", label: "未打标签", count: untagged });
    return Object.assign({}, base, { groupBy: "tag", from: from, to: to, groups: groups });
  }
  const stmt = db.prepare("SELECT " + col + " AS k, COUNT(*) AS n FROM task t WHERE " + where.join(" AND ") + " GROUP BY " + col + " ORDER BY n DESC");
  const rows = stmt.all.apply(stmt, params);
  const map = groupBy === "tableId" ? nodeMap(db) : null;
  const groups = rows.map(function (g) {
    let label = null;
    if (map && g.k) {
      const n = map[String(g.k)];
      label = n ? String(n.title || "") : null;
    }
    if (groupBy === "status") label = ({ "0": "ACTIVE", "1": "SHUTDOWN", "2": "DONE", "3": "RESTARTED" })[String(g.k)] || String(g.k);
    return { key: g.k === null || g.k === undefined ? null : String(g.k), label: label, count: g.n };
  });
  return Object.assign({}, base, { groupBy: groupBy, from: from, to: to, groups: groups });
}

export function removeTask(db, args, origin, api, skipTx = false) {
  if (!skipTx) return taskTransaction(db,api,buffered=>removeTask(db,args,origin,buffered,true));
  const cur = getTask(db, args.id || args.taskId);
  if (!cur) throw new Error("任务不存在：" + (args.id || args.taskId));
  const ts = now();
  setMembership(db,cur.id,null,origin,api,{ts,project:false});
  const next = Object.assign({}, cur, { timeline_key:null, deleted_at: ts, updated_at: ts, rev: Number(cur.rev) + 1 });
  saveTaskRow(db, next);
  // 删除任务连带软删它的工作区关联，避免 link 变成指向已删任务的孤儿行。
  clearTaskWorkspaces(db, next.id, origin, api, ts);
  logChange(db, "task", next.id, "delete", null, origin, ts);
  emitChange(api, next.id, "delete");
  return { ok: true, id: String(next.id) };
}

export function completeTask(db, args, origin, api) {
  return updateTask(db, {
    id: args.id || args.taskId,
    type: "STATUS",
    status: "2",
    date: args.date || todayStr(),
    difficulty: args.difficulty === undefined ? 0 : args.difficulty,
  }, origin, api);
}

export function exportTasks(db, args, api) {
  const format = String(args.format || "json").toLowerCase();
  if (["json", "markdown", "md", "csv"].indexOf(format) < 0) throw new Error("format 只支持 json / markdown / csv");
  let records;
  let feedback = {};
  if (Array.isArray(args.ids) && args.ids.length) {
    const idStmt = db.prepare("SELECT * FROM task WHERE deleted_at IS NULL AND id IN (" + args.ids.map(function () { return "?"; }).join(",") + ")");
    const rows = idStmt.all.apply(idStmt, args.ids.map(String));
    records = rows.map(function (row) { return taskOut(row, nodeMap(db)); });
    attachTags(db, api, records);
    attachWorkspaces(db, records);
  } else {
    const listed = listTasks(db, Object.assign({}, args, { pageNumber: undefined, pageSize: undefined }), api);
    records = listed.records;
    feedback = withNotices({ filter: listed.filter }, listed.notices);
  }
  if (format === "json") {
    return { ...feedback, format: "json", count: records.length, content: JSON.stringify({ exportedAt: now(), count: records.length, tasks: records }, null, 2) };
  }
  if (format === "csv") {
    const cols = ["id", "title", "status", "priority", "difficulty", "tableId", "publishDate", "targetDate", "doneDate", "shutdownDate", "createdAt", "updatedAt", "tags", "workspaces"];
    const lines = [cols.join(",")];
    for (const t of records) {
      lines.push(cols.map(function (c) {
        if (c === "tags") return csvCell((t.tags || []).map(function (g) { return g.name; }).join("|"));
        if (c === "workspaces") return csvCell((t.workspaces || []).map(function (w) { return w.title; }).join("|"));
        return csvCell(t[c]);
      }).join(","));
    }
    return { ...feedback, format: "csv", count: records.length, content: lines.join("\n") };
  }
  const lines = ["| id | 标题 | 状态 | P | 目标日期 | 标签 | 工作区 |", "| --- | --- | --- | --- | --- | --- | --- |"];
  for (const t of records) {
    lines.push("| " + t.id + " | " + String(t.title).replace(/\|/g, "\\|") + " | " + t.status + " | " + t.priority + " | " + (t.targetDate || "") + " | " + (t.tags || []).map(function (g) { return g.name; }).join(", ") + " | " + (t.workspaces || []).map(function (w) { return w.title; }).join(", ") + " |");
  }
  return { ...feedback, format: "markdown", count: records.length, content: lines.join("\n") };
}

