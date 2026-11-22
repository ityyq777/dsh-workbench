"use strict";
// 消息插件客户端入口：收件箱 / 统计 / 配置 / 数据 / Action 五个视图，
// 并在加载时启动提示音监听（只监听本域事件，不订阅其他插件的数据）。
(function () {
  var root = typeof window !== "undefined" ? window : null;
  var host = root && root.__WB_HOST__;
  if (!host || !host.react) {
    if (typeof console !== "undefined") console.error("[dsh-workbench-message] 宿主前端未就绪，无法注册插件界面");
    module.exports = { name: "dsh-workbench-message", inject: [], apply: function () {} };
    return;
  }
  var React = host.react;
  var h = host.h;

  // 图标与视图标签图标统一收在 ui/icons.cjs，与其它插件共用 lib/icons.cjs 的映射。
  var icons = require("./ui/icons.cjs"), ICONS = icons.ICONS, Icon = icons.Icon, tabIcon = icons.tabIcon;

  var COPY = require("./ui/copy.cjs");
  var CSS = require("./ui/styles.cjs");
  var configView = require("./views/config.cjs");
  var inboxFactory = require("./views/inbox.cjs");
  var statsFactory = require("./views/stats.cjs");
  var DataView = require("./views/data.cjs").DataView;
  var ActionSchemaView = require("./views/actions.cjs").ActionSchemaView;
  var notifier = require("./notify/notifier.cjs");
  var floatMount = require("./float/mount.cjs");

  var InboxView = inboxFactory({ React: React });
  var StatsView = statsFactory({ React: React });

  function langOf(props) {
    return props.lang === "en" ? "en" : "zh";
  }

  function withCopy(Inner, extra) {
    return function Wrapped(props) {
      var lang = langOf(props);
      var view = Object.assign(
        { api: props.api, lang: lang, t: COPY[lang], Icon: Icon },
        typeof extra === "function" ? extra(props) : extra || {},
      );
      return h(Inner, view);
    };
  }

  var Inbox = withCopy(InboxView, null);
  var Stats = withCopy(StatsView, null);
  var Config = withCopy(configView.ConfigView, null);

  function ensureStyles() {
    if (typeof document === "undefined" || !document.head) return;
    if (document.getElementById("wb-message-style")) return;
    var style = document.createElement("style");
    style.id = "wb-message-style";
    style.textContent = CSS;
    document.head.appendChild(style);
  }

  ensureStyles();

  host.registerAddon({
    id: "wb-addon-message",
    version: "0.1.9",
    icon: ICONS["message-square"],
    views: [
      { id: "stats", icon: tabIcon("chart"), title: { zh: "统计", en: "Stats" }, component: Stats },
      { id: "inbox", icon: tabIcon("inbox"), title: { zh: "收件箱", en: "Inbox" }, component: Inbox },
      { id: "config", icon: tabIcon("settings"), title: { zh: "配置", en: "Config" }, component: Config },
      { id: "data", icon: tabIcon("database"), title: { zh: "数据", en: "Data" }, component: DataView },
      { id: "actions", icon: tabIcon("list"), title: { zh: "Action", en: "Actions" }, component: ActionSchemaView },
    ],
  });

  // 提示音监听随前端加载启动：只响应 message.created，配置由 message.configGet 提供。
  try {
    notifier.start();
  } catch (e) {
    if (typeof console !== "undefined") console.warn("[dsh-workbench-message] 提示音启动失败", e);
  }

  // 全局消息悬浮入口：任意页面右下角的常驻按钮，与提示音共用同一条事件流。
  // 挂在客户端加载时而不是某个视图里，切页面不重建；出错只降级，不能拖垮插件注册。
  try {
    floatMount.createMount({ doc: typeof document !== "undefined" ? document : null, win: root, host: host, notifier: notifier }).mount();
  } catch (e) {
    if (typeof console !== "undefined") console.warn("[dsh-workbench-message] 悬浮入口启动失败", e);
  }

  module.exports = {
    name: "dsh-workbench-message",
    inject: [],
    apply: function () {},
  };
})();
