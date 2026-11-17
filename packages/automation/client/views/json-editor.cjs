"use strict";
/** JSON 编辑器：等宽文本域 + 实时解析结果 + 模板变量插入（光标处）。 */
var VARS = ["{{rule.name}}", "{{rule.id}}", "{{event.at}}", "{{event.item.title}}", "{{item.title}}", "{{item.url}}"];

function parseJsonSafe(text) {
  var raw = String(text == null ? "" : text).trim();
  if (!raw) return { ok: true, value: undefined, error: "" };
  try {
    return { ok: true, value: JSON.parse(raw), error: "" };
  } catch (e) {
    return { ok: false, value: undefined, error: e && e.message ? e.message : String(e) };
  }
}

function formatJson(text) {
  var r = parseJsonSafe(text);
  if (!r.ok) return null;
  return JSON.stringify(r.value, null, 2);
}

function JsonEditor(props) {
  var h = props.h;
  var t = props.t;
  var React = props.React;
  var value = props.value;
  var onChange = props.onChange;
  var ref = React.useRef(null);
  var vars = props.vars === false ? [] : props.vars || VARS;
  function insert(text) {
    var el = ref.current;
    if (!el) {
      onChange(value + text);
      return;
    }
    var start = typeof el.selectionStart === "number" ? el.selectionStart : value.length;
    var end = typeof el.selectionEnd === "number" ? el.selectionEnd : start;
    onChange(value.slice(0, start) + text + value.slice(end));
    if (typeof window !== "undefined" && typeof window.requestAnimationFrame === "function") {
      window.requestAnimationFrame(function () {
        try {
          el.focus();
          el.setSelectionRange(start + text.length, start + text.length);
        } catch (e) {
          /* 只读环境忽略 */
        }
      });
    }
  }
  return h("div", { className: "wba-block" },
    h("div", { className: "wba-inline" },
      h("span", { className: "wba-label" }, props.label || ""),
      props.action ? h("span", { className: "wba-grow" }) : null,
      props.action || null),
    vars.length ? h("div", { className: "wba-inline" },
      h("span", { className: "wba-hint" }, t("editor.insertVar")),
      h("div", { className: "wba-chips" }, vars.map(function (v) {
        return h("button", {
          key: v,
          type: "button",
          className: "wba-chip",
          onClick: function () { insert(v); },
        }, v);
      }))) : null,
    h("textarea", {
      ref: ref,
      className: "wba-code" + (props.small ? " sm" : "") + (props.invalid ? " err" : ""),
      value: value,
      spellCheck: false,
      autoComplete: "off",
      "aria-invalid": props.invalid ? "true" : "false",
      "aria-label": props.label || "JSON",
      onChange: function (e) { onChange(e.target.value); },
      onKeyDown: function (e) {
        if (e.key === "Tab") {
          e.preventDefault();
          insert("  ");
        }
      },
    }),
    h("div", { className: "wba-code-err", "aria-live": "polite" }, props.invalid ? props.error || t("editor.jsonInvalid", { msg: "JSON" }) : ""),
    props.hint ? h("span", { className: "wba-hint" }, props.hint) : null);
}

module.exports = { JsonEditor: JsonEditor, parseJsonSafe: parseJsonSafe, formatJson: formatJson, VARS: VARS };
