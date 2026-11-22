"use strict";
var GLYPHS = require("./ui/icons.cjs").ICONS;

/**
 * 弹幕插件客户端入口：
 * 1) 立刻把整个 DSH 窗口的弹幕层挂到 body（不依赖 React、也不依赖工作台视图是否打开）；
 * 2) 注册弹幕库/配置/数据/Action 四个视图。
 */
var styles = require("./styles.cjs");
var overlay = require("./overlay/mount.cjs");

var STYLE_ID = "wbdm-styles";

function injectStyles() {
  if (document.getElementById(STYLE_ID)) return;
  var style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = styles().join("\n");
  (document.head || document.documentElement).appendChild(style);
}

injectStyles();
if (document.body) overlay.mount();
else document.addEventListener("DOMContentLoaded", function () {
  overlay.mount();
});

var ADDON_ID = "wb-addon-danmaku";

function hasAddon(host) {
  try {
    var list = host.addons || [];
    for (var i = 0; i < list.length; i += 1) {
      if (list[i] && list[i].id === ADDON_ID) return true;
    }
  } catch (error) {
    return false;
  }
  return false;
}

// 必须逐个静态 require：构建脚本只内联静态依赖，动态拼接的 require 会留到浏览器里执行，
// 而浏览器端没有可用的模块解析器，会在 registerAddon 之前抛错，表现为视图一直加载不出来。
var icons = {
  megaphone: GLYPHS["megaphone"],
  list: GLYPHS["list"],
  settings: GLYPHS["settings"],
  database: GLYPHS["database"],
  play: GLYPHS["play"],
};

// 视图标签（view-tabs）只认 function 类型的图标，lucide 的默认导出是 forwardRef 对象，
// 这里包一层普通函数组件，标签才会显示图标。
function makeTab(React) {
  return function tab(name) {
    var Icon = icons[name];
    return function TabIcon(props) {
      return React.createElement(Icon, props);
    };
  };
}

function definition(host) {
  var tab = makeTab(host.react);
  return {
    id: ADDON_ID,
    version: "0.2.7",
    icon: tab("megaphone"),
    views: [
      {
        id: "library",
        icon: tab("list"),
        title: { zh: "弹幕库", en: "Library" },
        component: require("./views/library.cjs"),
      },
      {
        id: "config",
        icon: tab("settings"),
        title: { zh: "配置", en: "Settings" },
        component: require("./views/config.cjs"),
      },
      {
        id: "data",
        icon: tab("database"),
        title: { zh: "数据", en: "Data" },
        component: require("./views/data.cjs"),
      },
      {
        id: "actions",
        icon: tab("play"),
        title: { zh: "Action", en: "Actions" },
        component: require("./views/actions.cjs"),
      },
    ],
  };
}

var tries = 0;
function boot() {
  var host = window.__WB_HOST__;
  if (!host || typeof host.registerAddon !== "function" || !host.react) {
    if (tries < 120) {
      tries += 1;
      window.setTimeout(boot, 150);
    }
    return;
  }
  if (hasAddon(host)) return;
  host.registerAddon(definition(host));
  // 工作台壳热更新或重新挂载时会清空注册表，隔一会儿再补一次，避免视图又回到“正在加载”。
  [300, 900, 1800, 3600].forEach(function (delay) {
    window.setTimeout(function () {
      var h = window.__WB_HOST__;
      if (h && typeof h.registerAddon === "function" && !hasAddon(h)) h.registerAddon(definition(h));
    }, delay);
  });
}

boot();

module.exports = { name: "dsh-workbench-danmaku", inject: [], apply: function () {} };
