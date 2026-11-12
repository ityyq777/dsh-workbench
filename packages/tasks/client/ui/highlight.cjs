// 记录页 / 时间线页的既有入口：保持 (React) → Highlight 的调用方式与 wbt-hit 类名，
// 实现统一走 packages/addons/lib/highlight.cjs，避免与 Action 页各写一份。
"use strict";
module.exports = function (React) {
  return require("../../../lib/highlight.cjs")(React)("wbt");
};
