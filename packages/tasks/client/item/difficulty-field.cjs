// Shared difficulty input: zero/empty means unset; preserve existing half-star values.
"use strict";
module.exports = function (React) {
  var h = React.createElement;
  return function difficultyField(t, value, onChange, id) {
    var n = Number(value) || 0, full = Math.floor(n), half = n - full >= 0.5;
    var stars = "★".repeat(full) + (half ? "⯪" : "") + "☆".repeat(Math.max(0, 5 - full - (half ? 1 : 0)));
    return h("div", { className: "wbt-field full" },
      h("label", { htmlFor: id }, t.difficulty + " (0–5)"),
      h("div", { className: "wbt-row" },
        h("input", { id: id, className: "wbt-input", type: "number", min: 0, max: 5, step: 0.5,
          "aria-label": t.difficulty, "aria-describedby": id + "-hint", placeholder: t.difficultyUnsetHint, value: value,
          onChange: function (e) { var raw = e.target.value; onChange(raw === "" ? "" : Math.max(0, Math.min(5, Number(raw) || 0))); } }),
        h("span", { className: "wbt-stars", "aria-hidden": true }, n > 0 ? stars : t.difficultyUnset),
        h("b", null, n.toFixed(1))),
      h("small", { id: id + "-hint" }, t.difficultyUnsetHint),
      h("details", null, h("summary", null, t.difficultyGuideTitle), h("p", null, t.difficultyGuide)));
  };
};
