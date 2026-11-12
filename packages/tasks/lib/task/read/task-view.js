/**
 * 任务 action 的文本渲染与历史查询：不碰写入路径，方便单独阅读与测试。
 */

import { idOf } from "../../db/db.js";

export function taskHistory(db, args) {
  const id = idOf(args.id || args.taskId);
  if (!id) throw new Error("缺少 id");
  const limit = Math.max(1, Math.min(500, Number(args.limit) || 50));
  const rows = db.prepare(
    "SELECT op, payload, origin, updated_at FROM sync_change_log WHERE table_name='task' AND row_id=? ORDER BY updated_at DESC LIMIT ?",
  ).all(id, limit);
  const entries = rows.map(function (r) {
    let payload = null;
    try { payload = r.payload ? JSON.parse(String(r.payload)) : null; } catch (e) { payload = String(r.payload || ""); }
    return { op: String(r.op), origin: r.origin || null, at: r.updated_at, payload: payload };
  });
  return { id: String(id), count: entries.length, entries: entries };
}

export function changelog(db, args) {
  const limit = Math.max(1, Math.min(1000, Number(args.limit) || 100));
  const since = args.since ? String(args.since) : null;
  const tables = Array.isArray(args.tables) && args.tables.length ? args.tables.map(String) : ["task", "tag_mapping"];
  const where = ["table_name IN (" + tables.map(function () { return "?"; }).join(",") + ")"];
  const params = tables.slice();
  if (since) { where.push("updated_at>=?"); params.push(since); }
  params.push(limit);
  const stmt = db.prepare(
    "SELECT table_name, row_id, op, origin, updated_at FROM sync_change_log WHERE " + where.join(" AND ") + " ORDER BY updated_at DESC LIMIT ?",
  );
  const rows = stmt.all.apply(stmt, params);
  return { since: since, count: rows.length, entries: rows.map(function (r) {
    return { table: r.table_name, rowId: r.row_id, op: r.op, origin: r.origin || null, at: r.updated_at };
  }) };
}


const STATUS_TEXT = { "0": "已开启", "1": "已关闭", "2": "已完成", "3": "已重启", "4": "已接取" };

function tagNames(tags) {
  return (Array.isArray(tags) ? tags : []).map(function (tag) {
    return typeof tag === "string" ? tag : String(tag && tag.name ? tag.name : (tag && tag.id ? tag.id : ""));
  }).filter(Boolean);
}

/** tasks.get 的回执：让 agent 一眼看到完整描述与归属路径，而不是只看标题和优先级。 */
export function renderTaskDetail(result) {
  const task = result && result.task;
  if (!task) return "任务不存在";
  const segments = Array.isArray(task.pathSegments) && task.pathSegments.length
    ? task.pathSegments.map(function (p) { return p.name; }).join(" / ")
    : "(无完整祖先链)";
  const lines = [
    "任务：" + task.title,
    "id：" + task.id + " · 状态：" + (STATUS_TEXT[task.status] || "未知") + "（" + task.status + "） · 优先级：P" + task.priority
      + " · 难度：" + (task.difficulty === null || task.difficulty === undefined ? "未设置" : task.difficulty),
    "归属：" + (task.tablePath || segments) + "（tableId=" + task.tableId + "） · 表职责：" + (task.tableDescription || "未填写"),
    "时间线：" + (task.timelineId ? (task.timelineTitle || task.timelineId) + "（timelineId=" + task.timelineId + "）" : "未关联"),
    "日期：发布 " + (task.publishDate || "-") + " · 目标 " + (task.targetDate || "-") + " · 完成 " + (task.doneDate || "-") + " · 关闭 " + (task.shutdownDate || "-"),
    "标签：" + (tagNames(task.tags).join("、") || "无"),
  ];
  const workspaces = Array.isArray(task.workspaces) ? task.workspaces : [];
  lines.push("工作区：" + (workspaces.length
    ? workspaces.map(function (w) { return String(w.title || w.id) + (w.dir ? "（dir=" + w.dir + "）" : ""); }).join("、")
    : "无"));
  if (task.ownershipDiagnostic) lines.push("归属诊断：" + task.ownershipDiagnostic.code + " " + task.ownershipDiagnostic.message);
  if (task.review) lines.push("复盘：" + task.review);
  lines.push("描述：", task.description || "(空)");
  return lines.join("\n");
}

export function csvCell(v) {
  const s = v === null || v === undefined ? "" : String(v);
  return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
}


export function renderArray(rows) {
  const list = Array.isArray(rows) ? rows : [];
  return renderList({ records: list, total: list.length });
}

export const SORT_NOTES = {
  priority: "优先级降序：数值越大越紧急",
  "-priority": "优先级降序：数值越大越紧急",
  target: "目标日期升序：越早越前",
  "-target": "目标日期降序：越晚越前",
  publish: "发布日期升序",
  "-publish": "发布日期降序",
  updated: "更新时间升序",
  "-updated": "更新时间降序（最近改动的在前）",
  created: "创建时间升序",
  "-created": "创建时间降序（最新的在前）",
};

export function renderList(result) {
  const lines = [];
  const f = result.filter;
  if (f) {
    const parts = [];
    if (Array.isArray(f.statuses)) {
      const picked = f.statuses.concat(f.urgent ? ["紧急"] : []);
      parts.push("状态多选=" + (picked.length ? picked.join(" OR ") : "全部（含已重启）"));
    } else if (f.urgent) {
      parts.push("状态多选=紧急");
    }
    if (f.titleKey) parts.push("关键词=\"" + f.titleKey + "\"（标题或描述）");
    if (f.tableId) parts.push("任务表=" + f.tableId);
    if (f.groupId) parts.push("任务组=" + f.groupId);
    if (f.status !== undefined) parts.push("状态=" + f.status);
    if (f.tags && f.tags.length) parts.push("标签名=" + f.tags.join(","));
    if (f.tagIds && f.tagIds.length) parts.push("标签 id=" + f.tagIds.join(","));
    if (f.workspaceIds && f.workspaceIds.length) parts.push("工作区 id=" + f.workspaceIds.join(","));
    if (f.noWorkspace) parts.push("未关联工作区");
    if (f.difficultyMissing) parts.push("难度未设置（NULL/0）");
    if (f.priorityMin !== undefined) parts.push("P>=" + f.priorityMin);
    if (f.priorityMax !== undefined) parts.push("P<=" + f.priorityMax);
    if (f.difficultyMin !== undefined && f.difficultyMax !== undefined) parts.push("难度" + f.difficultyMin + "–" + f.difficultyMax);
    else if (f.difficultyMin !== undefined) parts.push("难度>=" + f.difficultyMin);
    else if (f.difficultyMax !== undefined) parts.push("难度<=" + f.difficultyMax);
    if (f.publishFrom) parts.push("发布日>=" + f.publishFrom);
    if (f.publishTo) parts.push("发布日<=" + f.publishTo);
    if (f.doneFrom) parts.push("完成日>=" + f.doneFrom);
    if (f.doneTo) parts.push("完成日<=" + f.doneTo);
    if (f.shutdownFrom) parts.push("关闭日>=" + f.shutdownFrom);
    if (f.shutdownTo) parts.push("关闭日<=" + f.shutdownTo);
    if (f.targetFrom) parts.push("target>=" + f.targetFrom);
    if (f.targetTo) parts.push("target<=" + f.targetTo);
    if (f.sort) parts.push("排序=" + f.sort + (SORT_NOTES[f.sort] ? "（" + SORT_NOTES[f.sort] + "）" : ""));
    if (f.pageable) parts.push("第 " + f.pageNumber + "/" + f.totalPages + " 页，每页 " + f.pageSize);
    if (f.pageSizeCapped) parts.push("pageSize 超过上限 200，已按 200 截断");
    lines.push("筛选：" + parts.join(" · "));
  }
  const returned = result.returned === undefined ? result.records.length : result.returned;
  lines.push(
    "任务 " + returned + " 条（total " + result.total + (result.truncated ? "，已截断：只返回前 " + returned + " 条" : "") + "）",
  );
  for (const t of result.records) {
    const mark = t.status === "2" ? "[x]" : t.status === "1" ? "[-]" : t.status === "3" ? "[~]" : t.status === "4" ? "[>]" : "[ ]";
    const path = (t.path || []).map(function (p) { return p.name; }).join(" / ");
    lines.push("- " + mark + " " + t.title + "（P" + t.priority + "，target " + (t.targetDate || "-") + "，id=" + t.id + (path ? "，" + path : "") + "）");
  }
  return lines.join("\n");
}
