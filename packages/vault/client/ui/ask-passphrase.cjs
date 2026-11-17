"use strict";
/**
 * 主口令输入弹层。
 * 桌面端 webview 不支持 window.prompt（点了没反应），所有需要口令的操作统一走这里。
 */
module.exports = function AskPassphraseModal(props) {
  var h = props.h, C = props.C;
  return h("div", { className: "wbv-modal", onClick: function () { if (!props.busy) props.onCancel(); } },
    h("div", { className: "wbv-modal-box", onClick: function (e) { e.stopPropagation(); } },
      h("h3", null, props.title || "输入主口令"),
      props.hint ? h("p", { className: "wbv-sub" }, props.hint) : null,
      h(C.Field, { h: h, label: props.label || "主口令" },
        h("input", {
          type: "password",
          autoFocus: true,
          autoComplete: "current-password",
          value: props.value,
          disabled: props.busy,
          onChange: function (e) { props.onChange(e.target.value); },
          onKeyDown: function (e) { if (e.key === "Enter" && props.value && !props.busy) props.onConfirm(); },
        })),
      props.error ? h(C.Notice, { h: h, kind: "error", text: props.error }) : null,
      h("div", { className: "wbv-row", style: { justifyContent: "flex-end" } },
        h(C.Btn, { h: h, disabled: props.busy, onClick: props.onCancel }, "取消"),
        h(C.Btn, { h: h, kind: "primary", disabled: props.busy || !props.value, onClick: props.onConfirm }, props.busy ? "处理中…" : "确认"))));
};
