"use strict";
/**
 * 主口令输入弹层。
 *
 * 桌面端 webview 不支持 window.prompt（点了没反应），所有需要口令的操作统一走这里。
 * 外壳用 ui/dialog.cjs（共享 overlay 提供 Esc 关闭、Tab 框内循环与关闭后焦点归还），
 * 输入框用共享的明文切换控件 lib/secret-field.cjs；弹层本身不持有状态，显示状态由
 * 调用方传入（测试会把它当纯函数直接渲染）。
 */
var SecretField = require("../../../lib/secret-field.cjs");
var Dialog = require("./dialog.cjs").Dialog;

module.exports = function AskPassphraseModal(props) {
  var h = props.h;
  var C = props.C;
  return h(
    Dialog,
    {
      h: h,
      React: props.React,
      title: props.title || "输入主口令",
      titleId: "wbv-ask-passphrase-title",
      onClose: props.busy ? null : props.onCancel,
      closeOnEscape: !props.busy,
      closeOnMask: !props.busy,
      busy: props.busy,
      // 首焦点交给输入框（下面 SecretField 的 autoFocus），不要落在对话框容器上。
      autoFocus: false,
    },
    props.hint ? h("p", { className: "wbv-modal-sub" }, props.hint) : null,
    h(
      "div",
      { className: "wbv-modal-body" },
      h(
        C.Field,
        { h: h, label: props.label || "主口令" },
        h(SecretField, {
          h: h,
          autoFocus: true,
          autoComplete: "current-password",
          value: props.value,
          disabled: props.busy,
          show: props.show,
          ariaLabel: props.label || "主口令",
          onChange: props.onChange,
          onToggle: props.onToggle,
          onKeyDown: function (e) {
            if (e.key === "Enter" && props.value && !props.busy) props.onConfirm();
          },
        }),
      ),
      props.error ? h(C.Notice, { h: h, kind: "error", text: props.error }) : null,
    ),
    h(
      "div",
      { className: "wbv-modal-foot" },
      h(C.Btn, { h: h, disabled: props.busy, onClick: props.onCancel }, "取消"),
      h(C.Btn, { h: h, kind: "primary", disabled: props.busy || !props.value, onClick: props.onConfirm }, props.busy ? "处理中…" : "确认"),
    ),
  );
};
