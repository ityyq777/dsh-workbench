// 归属选择的纯数据规则；不执行任何写操作。
"use strict";
var limits = require('../../shared/tree/limits.cjs');
function tables(nodes, parents) {
  var out = [], prefix = parents || [];
  (nodes || []).forEach(function (n) {
    if (n.deletedAt || n.deleted_at) return;
    var path = prefix.concat(String(n.name || ""));
    if (String(n.type) === "1") out.push({ id: String(n.id), name: n.name, path: path.join(" / "), description: n.description || "" });
    else out = out.concat(tables(n.children, path));
  });
  return out;
}
function preview(tree, path, descriptions) {
  var parts = String(path || "").split("/").map(function (s) { return s.trim(); });
  if (!path || path.length > limits.PATH_LEN_MAX || parts.length > limits.PATH_MAX || parts.some(function (s) { return !s || s === "." || s === ".." || s.length > limits.NAME_MAX; })) return { error: "请输入相对于根的有效路径；每段 1–" + limits.NAME_MAX + " 字符，最多 " + limits.PATH_MAX + " 段、总长 " + limits.PATH_LEN_MAX + " 字符，不含首尾斜杠。", nodes: [] };
  var roots = (tree || []).filter(function (n) { return String(n.type) === "2" && !n.deletedAt && !n.deleted_at; });
  if (roots.length !== 1) return { error: "任务树缺少唯一有效根，请刷新或修复任务树后重试。", nodes: [] };
  var level = roots[0].children || [], nodes = [], error = "";
  parts.forEach(function (name, i) {
    var matches = level.filter(function (n) { return n.name === name && !n.deletedAt && !n.deleted_at; });
    var type = i === parts.length - 1 ? "1" : "0", existing = matches[0];
    if (matches.length > 1) error = "同级名称存在歧义，请选择已有任务表或修正路径。";
    if (existing && String(existing.type) !== type) error = "路径类型冲突：中间节点必须为组，末段必须为表，不能在表下建节点。";
    if (!existing && !String(descriptions[i] || "").trim()) error = error || "请填写每个新节点的职责描述。";
    if (String(descriptions[i] || "").length > 2000) error = "职责描述最多 2000 字。";
    nodes.push({ name: name, type: type, existing: !!existing });
    level = existing ? existing.children || [] : [];
  });
  return { parts: parts, nodes: nodes, error: error, path: (roots[0] ? roots[0].name + " / " : "") + parts.join(" / ") };
}
function receipt(result) {
  var task = result && (result.task || result) || {};
  var path = task.pathSegments;
  var text = Array.isArray(path) ? path.map(function (p) { return p.name || p; }).join(" / ") : "";
  if (!text) text = Array.isArray(task.tablePath) ? task.tablePath.join(" / ") : task.tablePath || task.tableName || "";
  return (task.deduped || result && result.deduped ? "已存在" : "已保存") + (text ? " · 已放入 " + text : "") + "；可在编辑中纠正归属";
}
module.exports = { tables: tables, preview: preview, receipt: receipt };
