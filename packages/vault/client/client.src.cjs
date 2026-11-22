"use strict";
var GLYPHS = require("./ui/icons.cjs").ICONS;

// 凭据保险箱客户端：首页 / 凭据 / 分组与关联 / 设置 / 数据 / Action 六个视图。
// 只调用本插件注册的 vault.* action。
(function () {
  var root = typeof window !== "undefined" ? window : null;
  var host = root && root.__WB_HOST__;
  if (!host || !host.react) {
    if (typeof console !== "undefined") console.error("[dsh-workbench-vault] 宿主前端未就绪，无法注册插件界面");
    module.exports = { name: "dsh-workbench-vault", inject: [], apply: function () {} };
    return;
  }
  var React = host.react;
  var h = host.h;
  var CSS_ARR = require("./ui/styles.cjs");
  var CSS = Array.isArray(CSS_ARR) ? CSS_ARR.join("\n") : String(CSS_ARR || "");

  var ICONS = {
    shield: GLYPHS["shield"],
    key: GLYPHS["key-round"],
    folder: GLYPHS["folder"],
    sliders: GLYPHS["sliders-horizontal"],
    database: GLYPHS["database"],
    list: GLYPHS["list"],
    layers: GLYPHS["layers"],
  };

  function Icon(props) {
    var C = ICONS[props.name] || ICONS.shield;
    return h(C, { size: props.size || 14, strokeWidth: 2, "aria-hidden": "true", className: "wbg-svg" });
  }

  function tabIcon(name) {
    return function () { return h(Icon, { name: name, size: 14 }); };
  }

  function withProps(Inner, title) {
    return function Wrapped(props) {
      return h(Inner, {
        api: props.api,
        lang: props.lang === "en" ? "en" : "zh",
        h: h,
        React: React,
        title: title,
      });
    };
  }

  function ensureStyles() {
    if (typeof document === "undefined" || !document.head) return;
    if (document.getElementById("wb-vault-style")) return;
    var style = document.createElement("style");
    style.id = "wb-vault-style";
    style.textContent = CSS;
    document.head.appendChild(style);
  }

  ensureStyles();

  host.registerAddon({
    id: "wb-addon-vault",
    version: "0.4.2",
    icon: GLYPHS["shield-check"],
    views: [
      { id: "status", icon: tabIcon("shield"), title: { zh: "保险箱", en: "Vault" }, component: withProps(require("./views/status.cjs"), "保险箱") },
      { id: "secrets", icon: tabIcon("key"), title: { zh: "凭据", en: "Secrets" }, component: withProps(require("./views/secrets.cjs"), "凭据") },
      { id: "sets", icon: tabIcon("layers"), title: { zh: "集合与账号", en: "Sets & Accounts" }, component: withProps(require("./views/sets.cjs"), "集合与账号") },
      { id: "groups", icon: tabIcon("folder"), title: { zh: "分组与关联", en: "Groups" }, component: withProps(require("./views/groups.cjs"), "分组与关联") },
      { id: "config", icon: tabIcon("sliders"), title: { zh: "设置", en: "Settings" }, component: withProps(require("./views/config.cjs"), "设置") },
      { id: "data", icon: tabIcon("database"), title: { zh: "数据", en: "Data" }, component: withProps(require("./views/data.cjs"), "数据") },
      { id: "actions", icon: tabIcon("list"), title: { zh: "Action", en: "Actions" }, component: withProps(require("./views/actions.cjs"), "Action") },
    ],
  });

  module.exports = { name: "dsh-workbench-vault", inject: [], apply: function () {} };
})();
