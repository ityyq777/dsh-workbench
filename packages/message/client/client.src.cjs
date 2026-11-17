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

  var ICONS = {
    bell: require("lucide-react/icons/bell").default,
    "bell-off": require("lucide-react/icons/bell-off").default,
    inbox: require("lucide-react/icons/inbox").default,
    mail: require("lucide-react/icons/mail").default,
    "mail-open": require("lucide-react/icons/mail-open").default,
    chart: require("lucide-react/icons/chart-column").default,
    settings: require("lucide-react/icons/settings").default,
    database: require("lucide-react/icons/database").default,
    list: require("lucide-react/icons/list").default,
    check: require("lucide-react/icons/check").default,
    "check-check": require("lucide-react/icons/check-check").default,
    search: require("lucide-react/icons/search").default,
    refresh: require("lucide-react/icons/refresh-cw").default,
    plus: require("lucide-react/icons/plus").default,
    volume: require("lucide-react/icons/volume-2").default,
    mute: require("lucide-react/icons/volume-x").default,
    moon: require("lucide-react/icons/moon").default,
    clock: require("lucide-react/icons/clock").default,
    info: require("lucide-react/icons/info").default,
    success: require("lucide-react/icons/circle-check").default,
    warning: require("lucide-react/icons/triangle-alert").default,
    error: require("lucide-react/icons/circle-alert").default,
    reset: require("lucide-react/icons/rotate-ccw").default,
    play: require("lucide-react/icons/play").default,
  };

  function Icon(props) {
    var C = ICONS[props.name] || ICONS.info;
    return h(C, { size: props.size || 14, strokeWidth: 2, "aria-hidden": "true", className: "wbg-svg" });
  }

  function tabIcon(name) {
    return function () { return h(Icon, { name: name, size: 14 }); };
  }

  var COPY = require("./ui/copy.cjs");
  var CSS = require("./ui/styles.cjs");
  var configView = require("./views/config.cjs");
  var inboxFactory = require("./views/inbox.cjs");
  var statsFactory = require("./views/stats.cjs");
  var DataView = require("./views/data.cjs").DataView;
  var ActionSchemaView = require("./views/actions.cjs").ActionSchemaView;
  var notifier = require("./notify/notifier.cjs");

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
    version: "0.1.0",
    icon: require("lucide-react/icons/message-square").default,
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

  module.exports = {
    name: "dsh-workbench-message",
    inject: [],
    apply: function () {},
  };
})();
