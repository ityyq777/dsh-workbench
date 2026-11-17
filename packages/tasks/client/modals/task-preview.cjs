// 时间线成员预览：弹窗壳 + 与任务列表完全相同的卡片（TaskItem），操作按钮一并复用。
// 卡片动作由调用方以 cardProps 传入，避免在这里另起一套交互。
"use strict";
module.exports = function createTaskPreview(React, TaskItem) {
  var h = React.createElement;
  function TaskPreview(props) {
    var t = props.t, task = props.task;
    var titleId = "wbt-preview-title";
    function onKey(e) {
      if (e.key !== "Escape") return;
      e.preventDefault();
      e.stopPropagation();
      props.onClose();
    }
    return h("div", {
      className: "wbt-modal-mask",
      onKeyDownCapture: onKey,
      onMouseDown: function (e) { if (e.target === e.currentTarget) props.onClose(); },
    },
      h("div", {
        className: "wbt-modal wide wbt-preview",
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": titleId,
        "aria-label": t.previewLabel,
      },
        h("div", { className: "wbt-modal-head" },
          h("h3", { id: titleId }, String(task.title || "").trim() || t.previewUntitled),
          h("button", { type: "button", className: "wbt-icon", title: t.close, "aria-label": t.close, onClick: props.onClose }, "×")
        ),
        h("div", { className: "wbt-preview-body" }, h(TaskItem, props.cardProps)),
        h("div", { className: "wbt-modal-foot" },
          h("button", { type: "button", className: "wbt-btn ghost", autoFocus: true, onClick: props.onClose }, t.close)
        )
      )
    );
  }
  return TaskPreview;
};
