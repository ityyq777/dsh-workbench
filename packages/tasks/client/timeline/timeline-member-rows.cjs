"use strict";
// Shared by the full page and task dialog. Callbacks receive the task and original event.
module.exports = function createMemberRows(React, statusInfo) {
  var h = React.createElement;
  return function MemberRows(props) {
    var lang = props.lang === "en" ? "en" : "zh";
    return h("ol", { className: "wbt-timeline-members" }, (props.rows || []).map(function (task) {
      var status = statusInfo(task.status), title = task.title || (lang === "en" ? "Untitled task" : "未命名任务");
      var remove = lang === "en" ? "Remove from timeline: " + title : "从时间线移出：" + title;
      return h("li", { key: task.id, className: "wbt-timeline-member-row" },
        h("time", { className: "wbt-timeline-date", dateTime: task.publishDate || undefined }, task.publishDate || "—"),
        h("span", { className: "wbt-timeline-node", "aria-hidden": true }),
        h("button", { type: "button", className: "wbt-timeline-member", title: title, "aria-label": title + " · " + (task.publishDate || "") + " · " + status[lang], onClick: function (event) { if (props.onOpen) props.onOpen(task, event); } }, title),
        h("span", { className: "wbt-badge " + status.cls }, status[lang]),
        props.onRemove ? h("button", { type: "button", className: "wbt-timeline-remove", disabled: props.disabled, title: remove, "aria-label": remove, onClick: function (event) { props.onRemove(task, event); } }, h("svg", { width: 14, height: 14, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, "aria-hidden": true }, h("path", { d: "M5 12h14" }))) : null);
    }));
  };
};
