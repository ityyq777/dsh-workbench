"use strict";
/**
 * 明文输入框 + 小眼睛：默认 type=password，点一下临时切到 text。
 * 只影响视觉，不改变加密与 reveal 边界。
 */
var Eye = require("lucide-react/icons/eye").default;
var EyeOff = require("lucide-react/icons/eye-off").default;

function SecretField(props) {
  var h = props.h;
  var show = Boolean(props.show);
  var label = show ? "隐藏明文" : "显示明文";
  var Ico = show ? EyeOff : Eye;
  return h("div", { className: "wbv-secret-field" },
    h("input", {
      type: show ? "text" : "password",
      autoComplete: "new-password",
      spellCheck: false,
      value: props.value,
      placeholder: props.placeholder,
      onChange: function (e) { props.onChange(e.target.value); },
    }),
    h("button", {
      type: "button",
      className: "wbv-eye",
      title: label,
      "aria-label": label,
      "aria-pressed": show ? "true" : "false",
      onClick: function (e) { e.preventDefault(); e.stopPropagation(); props.onToggle(); },
    }, h(Ico, { size: 15, strokeWidth: 2, "aria-hidden": "true" })));
}

module.exports = SecretField;
