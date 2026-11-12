// Shared recent-completed/closed table cells retain native table and button semantics.
var React = require("react"), h = React.createElement;
module.exports = function recentColumns(t, lang, onNavigate) {
  var en = lang === "en";
  return [
    { key: "title", label: t.colTitle },
    { key: "difficulty", label: en ? "Difficulty" : "难度", render: function (row) {
      var n = Number(row.difficulty);
      if (!(n > 0)) return "—";
      var bounded = Math.min(5, n), full = Math.floor(bounded), half = bounded - full >= .5;
      return h("span", { className: "wbt-recent-difficulty", "aria-label": (en ? "Difficulty: " : "难度：") + n },
        h("span", { "aria-hidden": true }, "★".repeat(full) + (half ? "⯪" : "") + "☆".repeat(5 - full - (half ? 1 : 0))), " " + n);
    } },
    { key: "tableTitle", label: t.colTable, render: function (row) {
      if (row.tableDeleted || !row.tableId) return h("span", { title: en ? "Task table deleted; cannot open" : "任务表已删除，无法打开" }, row.tableTitle || (en ? "Deleted task table" : "已删除任务表"));
      if (typeof onNavigate !== "function") return row.tableTitle;
      return h("button", { type: "button", className: "wbt-table-link", "aria-label": (en ? "Open task table: " : "打开任务表：") + row.tableTitle,
        onClick: function () { onNavigate("tasks", { tableId: String(row.tableId), groupId: row.groupId == null ? null : String(row.groupId), allTableTasks: true }); }
      }, row.tableTitle);
    } },
    { key: "date", label: t.colDate, render: function (row) { return row.date || "—"; } },
  ];
};
