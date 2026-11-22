"use strict";
// 图标表：lucide 图标按需引入，用哪个引哪个——这些图标都会随本插件 client.js 打包。
var icons = require("../../../lib/icons.cjs");

var set = icons.create("wbg", {
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
  "message-square": require("lucide-react/icons/message-square").default,
}, { fallback: "info", tabIcon: true });

module.exports = { ICONS: set.ICONS, Icon: set.Icon, tabIcon: set.tabIcon };
