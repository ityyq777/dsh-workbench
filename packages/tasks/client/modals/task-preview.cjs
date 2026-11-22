// 时间线成员预览：弹窗壳 + 与任务列表完全相同的卡片（TaskItem），操作按钮一并复用。
// 卡片动作由调用方以 cardProps 传入，避免在这里另起一套交互；外壳用 lib/overlay。
"use strict";
var createOverlay = require("../../../lib/overlay.cjs");

module.exports = function createTaskPreview(React, TaskItem) {
  var h = React.createElement;
  var Overlay = createOverlay({
    maskClass: "wbt-modal-mask",
    dialogClass: "wbt-modal wide wbt-preview",
    ariaLabelledByOf: function () {
      return "wbt-preview-title";
    },
    // 关闭按钮自己带 autoFocus，外壳不要抢首焦点。
    autoFocusDialog: false,
  });

  function TaskPreview(props) {
    var t = props.t, task = props.task;
    return h(
      Overlay,
      { onClose: props.onClose, autoFocus: false },
      h(
        "div",
        { className: "wbt-modal-head wbt-preview-head" },
        h("h3", { id: "wbt-preview-title" }, String(task.title || "").trim() || t.previewUntitled),
        h("button", { type: "button", className: "wbt-icon", title: t.close, "aria-label": t.close, autoFocus: true, onClick: props.onClose }, "×"),
      ),
      h("div", { className: "wbt-preview-body" }, h(TaskItem, props.cardProps)),
    );
  }
  return TaskPreview;
};
