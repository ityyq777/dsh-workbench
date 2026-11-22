"use strict";
var GLYPHS = require("./ui/icons.cjs").ICONS;

(function () {
  var root = typeof window !== "undefined" ? window : null;
  var host = root && root.__WB_HOST__;
  if (!host || !host.react) {
    if (typeof console !== "undefined") console.error("[dsh-workbench-calendar] 宿主前端未就绪");
    module.exports = { name: "dsh-workbench-calendar", inject: [], apply: function () {} };
    return;
  }
  var React = host.react;
  var h = host.h;
  var CSS = require("./ui/styles.cjs");
  var ICONS = {
    calendar: GLYPHS["calendar-days"],
    grid: GLYPHS["calendar"],
    sliders: GLYPHS["sliders-horizontal"],
    database: GLYPHS["database"],
    list: GLYPHS["list"],
  };
  function Icon(props) { var C = ICONS[props.name] || ICONS.calendar; return h(C, { size: props.size || 14, strokeWidth: 2, "aria-hidden": "true", className: "wbg-svg" }); }
  function tabIcon(name) { return function () { return h(Icon, { name: name, size: 14 }); }; }
  function withProps(Inner, title) { return function Wrapped(props) { return h(Inner, { api: props.api, lang: props.lang === "en" ? "en" : "zh", h: h, React: React, title: title }); }; }
  function ensureStyles() {
    if (typeof document === "undefined" || !document.head) return;
    if (document.getElementById("wb-calendar-style")) return;
    var style = document.createElement("style");
    style.id = "wb-calendar-style";
    style.textContent = CSS;
    document.head.appendChild(style);
  }
  ensureStyles();
  host.registerAddon({
    id: "wb-addon-calendar",
    version: "0.1.8",
    icon: GLYPHS["calendar-days"],
    views: [
      { id: "events", icon: tabIcon("calendar"), title: { zh: "日程", en: "Agenda" }, component: withProps(require("./views/events.cjs"), "日程") },
      { id: "calendars", icon: tabIcon("grid"), title: { zh: "日历", en: "Calendars" }, component: withProps(require("./views/calendars.cjs"), "日历") },
      { id: "config", icon: tabIcon("sliders"), title: { zh: "设置", en: "Settings" }, component: withProps(require("./views/config.cjs"), "设置") },
      { id: "data", icon: tabIcon("database"), title: { zh: "数据", en: "Data" }, component: withProps(require("./views/data.cjs"), "数据") },
      { id: "actions", icon: tabIcon("list"), title: { zh: "Action", en: "Actions" }, component: withProps(require("./views/actions.cjs"), "Action") },
    ],
  });
  module.exports = { name: "dsh-workbench-calendar", inject: [], apply: function () {} };
})();
