// 共享难度输入（0–5，步长 0.5）：留空表示未设置（0），不是最简单；保留既有半档数值。
// 走统一数字控件：只做红字提示，绝不悄悄改写用户键入的值。
"use strict";
var NF = require("../../../lib/number-field.cjs");

module.exports = function (React) {
  var h = React.createElement;
  // lang 为可选第 5 参：仅影响提示文案语言，缺省按中文。
  return function difficultyField(t, value, onChange, id, lang) {
    var n = Number(value) || 0, full = Math.floor(n), half = n - full >= 0.5;
    var stars = "★".repeat(full) + (half ? "⯪" : "") + "☆".repeat(Math.max(0, 5 - full - (half ? 1 : 0)));
    return h("div", { className: "wbt-field full" },
      h("span", { className: "wbt-field-label" }, t.difficulty + " (0–5)"),
      h("div", { className: "wbt-row" },
        h(NF.NumberField, {
          h: h, lang: lang, value: value, min: 0, max: 5, step: 0.5, allowEmpty: true,
          ariaLabel: t.difficulty, placeholder: t.difficultyUnsetHint, hint: false,
          className: "wbt-difficulty-num",
          // 键入期同步草稿，让 ★ 预览即时更新；提交只在失焦/回车且合法时发生。
          onDraft: function (raw) { onChange(raw); },
          onCommit: function (next) { onChange(next === null ? "" : String(next)); },
        }),
        h("span", { className: "wbt-stars", "aria-hidden": true }, n > 0 ? stars : t.difficultyUnset),
        h("b", null, n.toFixed(1))),
      h("small", { id: id + "-hint" }, t.difficultyUnsetHint),
      h("details", null, h("summary", null, t.difficultyGuideTitle), h("p", null, t.difficultyGuide)));
  };
};
