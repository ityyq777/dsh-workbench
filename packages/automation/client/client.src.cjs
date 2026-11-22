"use strict";
var GLYPHS = require("./ui/icons.cjs").ICONS;

// 自动化客户端：概览 / 规则 / 运行记录 / 设置 / 数据 / Action 六个视图。
(function () {
  var root = typeof window !== "undefined" ? window : null;
  var host = root && root.__WB_HOST__;
  if (!host || !host.react) {
    if (typeof console !== "undefined") console.error("[dsh-workbench-automation] 宿主前端未就绪");
    module.exports = { name: "dsh-workbench-automation", inject: [], apply: function () {} };
    return;
  }
  var React = host.react;
  var h = host.h;
  var CSS = require("./ui/styles.cjs");
  var ICONS = {
    activity: GLYPHS["activity"],
    zap: GLYPHS["zap"],
    history: GLYPHS["history"],
    sliders: GLYPHS["sliders-horizontal"],
    database: GLYPHS["database"],
    list: GLYPHS["list"],
    timer: GLYPHS["timer"],
    "alarm-clock": GLYPHS["alarm-clock"],
    radio: GLYPHS["radio"],
    hand: GLYPHS["hand"],
    play: GLYPHS["play"],
    pencil: GLYPHS["pencil"],
    power: GLYPHS["power"],
    "power-off": GLYPHS["power-off"],
    "trash-2": GLYPHS["trash-2"],
    x: GLYPHS["x"],
    "check-circle": GLYPHS["check-circle"],
    "alert-triangle": GLYPHS["alert-triangle"],
    "skip-forward": GLYPHS["skip-forward"],
    layers: GLYPHS["layers"],
    bot: GLYPHS["bot"],
    sparkles: GLYPHS["sparkles"],
    repeat: GLYPHS["repeat"],
    "calendar-clock": GLYPHS["calendar-clock"],
    hourglass: GLYPHS["hourglass"],
    clock: GLYPHS["clock"],
    send: GLYPHS["send"],
    "shield-check": GLYPHS["shield-check"],
  };
  function Icon(props) { var C = ICONS[props.name] || ICONS.zap; return h(C, { size: props.size || 14, strokeWidth: 2, "aria-hidden": "true", className: "wba-svg" }); }
  function icon(name, size) { return h(Icon, { name: name, size: size || 14 }); }
  function tabIcon(name) { return function () { return h(Icon, { name: name, size: 14 }); }; }
  function withProps(Inner, title) {
    return function Wrapped(props) {
      return h(Inner, {
        api: props.api,
        lang: props.lang === "en" ? "en" : "zh",
        h: h,
        React: React,
        title: title,
        icon: icon,
        viewParams: props.viewParams,
        onNavigate: props.onNavigate,
      });
    };
  }
  function ensureStyles() {
    if (typeof document === "undefined" || !document.head) return;
    if (document.getElementById("wb-automation-style")) return;
    var style = document.createElement("style");
    style.id = "wb-automation-style";
    style.textContent = CSS;
    document.head.appendChild(style);
  }
  ensureStyles();
  host.registerAddon({
    id: "wb-addon-automation",
    version: "0.4.3",
    icon: GLYPHS["zap"],
    views: [
      { id: "stats", icon: tabIcon("activity"), title: { zh: "概览", en: "Overview" }, component: withProps(require("./views/stats.cjs"), "概览") },
      { id: "rules", icon: tabIcon("zap"), title: { zh: "规则", en: "Rules" }, component: withProps(require("./views/rules.cjs"), "规则") },
      { id: "runs", icon: tabIcon("history"), title: { zh: "运行记录", en: "Runs" }, component: withProps(require("./views/runs.cjs"), "运行记录") },
      { id: "config", icon: tabIcon("sliders"), title: { zh: "设置", en: "Settings" }, component: withProps(require("./views/config.cjs"), "设置") },
      { id: "data", icon: tabIcon("database"), title: { zh: "数据", en: "Data" }, component: withProps(require("./views/data.cjs"), "数据") },
      { id: "actions", icon: tabIcon("list"), title: { zh: "Action", en: "Actions" }, component: withProps(require("./views/actions.cjs"), "Action") },
    ],
  });
  module.exports = { name: "dsh-workbench-automation", inject: [], apply: function () {} };
})();
