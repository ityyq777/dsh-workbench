"use strict";
/**
 * 凭据保险箱的对话框外壳。
 *
 * 键盘契约（Esc 关闭、Tab 在对话框内循环、关闭后焦点归还触发元素）与遮罩点击关闭
 * 都来自共享件 packages/addons/lib/overlay.cjs；这里只绑定保险箱自己的类名、标题栏
 * 与「处理中不关闭」的默认行为。业务内容（字段、校验、保存流程）仍留在各视图里。
 */
var createOverlay = require("../../../lib/overlay.cjs");
var stagedFactory = require("../../../lib/staged-dialog.cjs");
var GLYPHS = require("./icons.cjs").ICONS;

var Dialog = createOverlay({
  tag: "div",
  maskClass: "wbv-modal",
  dialogClass: "wbv-modal-box",
  ariaLabelledByOf: function (props) {
    return props.titleId || null;
  },
  header: function (props) {
    var h = props.h;
    if (!props.title && !props.onClose) return null;
    var Close = GLYPHS["x"];
    return h(
      "div",
      { className: "wbv-modal-head" },
      props.title ? h("h3", { className: "wbv-modal-title", id: props.titleId }, props.title) : h("span", null),
      props.onClose
        ? h(
            "button",
            {
              type: "button",
              className: "wbv-icon-btn",
              "aria-label": props.closeLabel || "关闭",
              title: props.closeLabel || "关闭",
              disabled: props.busy,
              onClick: props.onClose,
            },
            Close ? h(Close, { size: 15, strokeWidth: 2, "aria-hidden": true, focusable: false }) : "×",
          )
        : null,
    );
  },
});

/**
 * 二次确认弹层：危险操作（删除凭据/集合/分组）统一走这里，替代桌面端不可用的
 * window.confirm，并且可以带一个额外的选择项（如「组内集合改挂到」）。
 */
function ConfirmDialog(props) {
  var h = props.h;
  return h(
    Dialog,
    {
      h: h,
      React: props.React,
      title: props.title || "请确认",
      titleId: props.titleId || "wbv-confirm-title",
      onClose: props.busy ? null : props.onCancel,
      closeOnEscape: !props.busy,
      closeOnMask: !props.busy,
      busy: props.busy,
    },
    props.message ? h("p", { className: "wbv-modal-sub" }, props.message) : null,
    props.children ? h("div", { className: "wbv-modal-body" }, props.children) : null,
    h(
      "div",
      { className: "wbv-modal-foot" },
      h("button", { type: "button", className: "wbv-btn", disabled: props.busy, onClick: props.onCancel }, props.cancelText || "取消"),
      h(
        "button",
        {
          type: "button",
          className: "wbv-btn " + (props.primary ? "primary" : "danger"),
          disabled: props.busy,
          onClick: props.onConfirm,
        },
        props.busy ? props.busyText || "处理中…" : props.confirmText || "确认",
      ),
    ),
  );
}

/**
 * 分阶段的表单对话框：遮罩/键盘契约仍走 overlay.cjs，步骤条与「上一页/下一页/保存」
 * 走 lib/staged-dialog.cjs。窄小的确认类弹层继续用上面的 Dialog，不要为此拉长表单。
 */
var FormDialog = stagedFactory.createStagedDialog({
  tag: "div",
  maskClass: "wbv-modal",
  dialogClass: "wbv-modal-box",
  displayName: "VaultFormDialog",
  ariaLabelledByOf: function (props) {
    return props.titleId || null;
  },
  header: function (props) {
    var h = props.h;
    if (!props.title && !props.onClose) return null;
    var Close = GLYPHS["x"];
    return h(
      "div",
      { className: "wbv-modal-head" },
      props.title ? h("h3", { className: "wbv-modal-title", id: props.titleId }, props.title) : h("span", null),
      props.onClose
        ? h(
            "button",
            {
              type: "button",
              className: "wbv-icon-btn",
              "aria-label": props.closeLabel || "关闭",
              title: props.closeLabel || "关闭",
              disabled: !!props.submitting,
              onClick: props.onClose,
            },
            Close ? h(Close, { size: 15, strokeWidth: 2, "aria-hidden": true, focusable: false }) : "×",
          )
        : null,
    );
  },
  closeOnEscape: function (props) { return !props.submitting; },
  closeOnMask: function (props) { return !props.submitting; },
});

module.exports = { Dialog: Dialog, ConfirmDialog: ConfirmDialog, FormDialog: FormDialog };
