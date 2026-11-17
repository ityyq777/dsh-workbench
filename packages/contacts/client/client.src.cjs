"use strict";
// 联系人客户端：联系人 / 分组 / 导入导出 / 设置 / 数据 / Action 六个视图。
(function () {
  var root = typeof window !== "undefined" ? window : null;
  var host = root && root.__WB_HOST__;
  if (!host || !host.react) {
    if (typeof console !== "undefined") console.error("[dsh-workbench-contacts] 宿主前端未就绪");
    module.exports = { name: "dsh-workbench-contacts", inject: [], apply: function () {} };
    return;
  }
  var React = host.react;
  var h = host.h;
  var CSS = require("./ui/styles.cjs");
  var ICONS = {
    users: require("lucide-react/icons/users").default,
    folder: require("lucide-react/icons/folder").default,
    upload: require("lucide-react/icons/upload").default,
    sliders: require("lucide-react/icons/sliders-horizontal").default,
    database: require("lucide-react/icons/database").default,
    list: require("lucide-react/icons/list").default,
  };
  function Icon(props) { var C = ICONS[props.name] || ICONS.users; return h(C, { size: props.size || 14, strokeWidth: 2, "aria-hidden": "true", className: "wbg-svg" }); }
  function tabIcon(name) { return function () { return h(Icon, { name: name, size: 14 }); }; }
  function withProps(Inner, title) { return function Wrapped(props) { return h(Inner, { api: props.api, lang: props.lang === "en" ? "en" : "zh", h: h, React: React, title: title }); }; }
  function ensureStyles() {
    if (typeof document === "undefined" || !document.head) return;
    if (document.getElementById("wb-contacts-style")) return;
    var style = document.createElement("style");
    style.id = "wb-contacts-style";
    style.textContent = CSS;
    document.head.appendChild(style);
  }
  ensureStyles();
  host.registerAddon({
    id: "wb-addon-contacts",
    version: "0.1.1",
    icon: require("lucide-react/icons/users").default,
    views: [
      { id: "contacts", icon: tabIcon("users"), title: { zh: "联系人", en: "Contacts" }, component: withProps(require("./views/contacts.cjs"), "联系人") },
      { id: "groups", icon: tabIcon("folder"), title: { zh: "分组", en: "Groups" }, component: withProps(require("./views/groups.cjs"), "分组") },
      { id: "importExport", icon: tabIcon("upload"), title: { zh: "导入导出", en: "Import / Export" }, component: withProps(require("./views/importExport.cjs"), "导入导出") },
      { id: "config", icon: tabIcon("sliders"), title: { zh: "设置", en: "Settings" }, component: withProps(require("./views/config.cjs"), "设置") },
      { id: "data", icon: tabIcon("database"), title: { zh: "数据", en: "Data" }, component: withProps(require("./views/data.cjs"), "数据") },
      { id: "actions", icon: tabIcon("list"), title: { zh: "Action", en: "Actions" }, component: withProps(require("./views/actions.cjs"), "Action") },
    ],
  });
  module.exports = { name: "dsh-workbench-contacts", inject: [], apply: function () {} };
})();
