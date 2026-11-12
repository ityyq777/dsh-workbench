// 排行名称使用原生按钮，保留表格语义及键盘操作。
var React = require("react"), h = React.createElement;
module.exports = function rankingName(t, lang, onNavigate, kind) {
  var en = lang === "en", table = kind === "table", workspace = kind === "workspace";
  return { key: "title", label: t.colName, render: function (row) {
    var none = workspace && row.id === "__none__";
    if (!row.id || row.id === "__missing__" || row.id === "__ungrouped__") {
      return h("span", { title: en ? "Deleted task table / unfiled; cannot open" : "已删除任务表/未归档，无法打开" }, row.title);
    }
    if (typeof onNavigate !== "function") return row.title;
    var base = none
      ? (en ? "Open tasks without workspace: " : "打开未关联工作区的任务：")
      : en
        ? (table ? "Open task table: " : workspace ? "Open tasks in workspace: " : "Open task group: ")
        : (table ? "打开任务表：" : workspace ? "打开工作区任务：" : "打开任务组：");
    return h("button", {
      type: "button", className: "wbt-table-link" + (none ? " wbt-muted-link" : ""),
      title: workspace ? (row.dir || "") : undefined,
      "aria-label": base + row.title,
      onClick: function () {
        if (none) {
          onNavigate("tasks", { noWorkspace: true, workspaceIds: [], tableId: null, groupId: null });
          return;
        }
        onNavigate("tasks", workspace
          ? { workspaceIds: [String(row.id)], noWorkspace: false, tableId: null, groupId: null }
          : table
            ? { tableId: String(row.id), groupId: row.groupId == null ? null : String(row.groupId), allTableTasks: true }
            : { groupId: String(row.id), tableId: null });
      },
    }, row.title);
  } };
};
