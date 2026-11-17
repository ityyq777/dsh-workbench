// 统计页任务清单的标题列：点击跳到记录页并按任务 ID 检索；没有导航能力时降级成纯文本。
var React = require("react"), h = React.createElement;
module.exports = function taskTitle(lang, onNavigate) {
  var en = lang === "en";
  return function (row) {
    var title = row.title == null ? "" : String(row.title);
    var id = row.id == null ? "" : String(row.id);
    if (!id || typeof onNavigate !== "function") return title;
    return h("button", {
      type: "button", className: "wbt-table-link", "data-task-id": id,
      "aria-label": (en ? "Search by task ID: " : "按任务 ID 检索：") + id,
      title: en ? "Search by task ID: " + id : "按任务 ID 检索：" + id,
      onClick: function () { onNavigate("tasks", { taskId: id }); },
    }, title);
  };
};
