// 时间线成员预览：弹窗壳 + 与任务列表完全相同的卡片（TaskItem），操作按钮一并复用。
// 卡片动作由调用方以 cardProps 传入，避免在这里另起一套交互。
"use strict";
module.exports = function createTaskPreview(React, TaskItem) {
  var h = React.createElement;
  function TaskPreview(props) {
    var t = props.t, task = props.task;
    var titleId = "wbt-preview-title";
    // 不用 hooks：该组件会被测试直接当纯函数调用（不在 React 渲染期），ref 改从事件里取遮罩。
    function onKey(e) {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        props.onClose();
        return;
      }
      if (e.key !== "Tab") return;
      var mask = e.currentTarget;
      var box = mask && mask.querySelector ? mask.querySelector('[role="dialog"]') : null;
      if (!box) return;
      // 预览可能叠在时间线弹窗之上，Tab 必须只在预览自己的控件里循环。
      var nodes = Array.from(box.querySelectorAll('button:not(:disabled),input:not(:disabled),textarea:not(:disabled),select:not(:disabled),a[href],[tabindex="0"]')).filter(function (node) { return node.getClientRects().length > 0; });
      var first = nodes[0], last = nodes[nodes.length - 1];
      if (!first) { e.preventDefault(); if (box.focus) box.focus(); }
      else if (e.shiftKey && (document.activeElement === first || document.activeElement === box)) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
    return h("div", {
      className: "wbt-modal-mask",
      onKeyDownCapture: onKey,
      onMouseDown: function (e) { if (e.target === e.currentTarget) props.onClose(); },
    },
      h("div", {
        tabIndex: -1,
        className: "wbt-modal wide wbt-preview",
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": titleId,
        "aria-label": t.previewLabel,
      },
        h("div", { className: "wbt-modal-head wbt-preview-head" },
          h("h3", { id: titleId }, String(task.title || "").trim() || t.previewUntitled),
          h("button", { type: "button", className: "wbt-icon", title: t.close, "aria-label": t.close, autoFocus: true, onClick: props.onClose }, "×")
        ),
        h("div", { className: "wbt-preview-body" }, h(TaskItem, props.cardProps))
      )
    );
  }
  return TaskPreview;
};
