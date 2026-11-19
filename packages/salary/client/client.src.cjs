"use strict";
(function () {
  var root = typeof window !== "undefined" ? window : null;
  var host = root && root.__WB_HOST__;
  if (!host || !host.react) {
    if (typeof console !== "undefined") console.error("[dsh-workbench-salary] 宿主前端未就绪");
    module.exports = { name: "dsh-workbench-salary", inject: [], apply: function () {} };
    return;
  }
  var React = host.react;
  var h = host.h;
  var CSS = require("./ui/styles.cjs");
  var ICONS = {
    records: require("lucide-react/icons/wallet").default,
    stats: require("lucide-react/icons/chart-column").default,
    data: require("lucide-react/icons/database").default,
    actions: require("lucide-react/icons/list").default,
  };
  function Icon(props) { var C = ICONS[props.name] || ICONS.records; return h(C, { size: props.size || 14, strokeWidth: 2, "aria-hidden": "true", className: "wbsal-svg" }); }
  function tabIcon(name) { return function () { return h(Icon, { name: name, size: 14 }); }; }
  function withProps(Inner, title) { return function Wrapped(props) { return h(Inner, { api: props.api, lang: props.lang === "en" ? "en" : "zh", h: h, React: React, title: title }); }; }
  function ensureStyles() {
    if (typeof document === "undefined" || !document.head) return;
    if (document.getElementById("wb-salary-style")) return;
    var style = document.createElement("style");
    style.id = "wb-salary-style";
    style.textContent = CSS;
    document.head.appendChild(style);
  }
  ensureStyles();
  host.registerAddon({
    id: "wb-addon-salary",
    version: "0.2.4",
    icon: require("lucide-react/icons/wallet").default,
    views: [
      { id: "stats", icon: tabIcon("stats"), title: { zh: "统计", en: "Stats" }, component: withProps(require("./views/stats.cjs"), "统计") },
      { id: "records", icon: tabIcon("records"), title: { zh: "记录", en: "Records" }, component: withProps(require("./views/records.cjs"), "记录") },
      { id: "data", icon: tabIcon("data"), title: { zh: "数据", en: "Data" }, component: withProps(require("./views/data.cjs"), "数据") },
      { id: "actions", icon: tabIcon("actions"), title: { zh: "Action", en: "Actions" }, component: withProps(require("./views/actions.cjs"), "Action") },
    ],
  });
  module.exports = { name: "dsh-workbench-salary", inject: [], apply: function () {} };
})();
