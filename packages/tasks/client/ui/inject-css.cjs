"use strict";
/**
 * 任务插件全局样式（含时间线样式）单点注入。
 *
 * 独立成模块的原因：插槽贡献组件会渲染在**别的插件**的界面里（如邮件详情工具条），
 * 那时任务视图可能一次都没打开过，样式还没注入。贡献组件自己调一次这个函数即可，
 * 与客户端入口共用同一个 style 元素与同一份 CSS，不会产生第二份源。
 */
var CSS = require("./styles.cjs") + "\n" + require("../timeline/timeline-styles.cjs");

module.exports = function injectTasksCss() {
  if (typeof document === "undefined") return;
  var old = document.getElementById("wb-addon-tasks-v2-css");
  if (old) { old.textContent = CSS; return; }
  var s = document.createElement("style");
  s.id = "wb-addon-tasks-v2-css";
  s.setAttribute("data-wb-addon", "wb-addon-tasks");
  s.textContent = CSS;
  document.head.appendChild(s);
};
