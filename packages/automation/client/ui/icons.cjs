"use strict";
// 图标表：用哪个引哪个，图标随本插件 client.js 打包（共享层只放渲染工厂）。
var icons = require("../../../lib/icons.cjs");

var set = icons.create("wba", {
  "activity": require("lucide-react/icons/activity").default,
  "bot": require("lucide-react/icons/bot").default,
  "calendar-clock": require("lucide-react/icons/calendar-clock").default,
  "clock": require("lucide-react/icons/clock").default,
  "hourglass": require("lucide-react/icons/hourglass").default,
  "repeat": require("lucide-react/icons/repeat").default,
  "send": require("lucide-react/icons/send").default,
  "sparkles": require("lucide-react/icons/sparkles").default,
  "alarm-clock": require("lucide-react/icons/alarm-clock").default,
  "alert-triangle": require("lucide-react/icons/alert-triangle").default,
  "check-circle": require("lucide-react/icons/check-circle").default,
  "database": require("lucide-react/icons/database").default,
  "hand": require("lucide-react/icons/hand").default,
  "history": require("lucide-react/icons/history").default,
  "layers": require("lucide-react/icons/layers").default,
  "list": require("lucide-react/icons/list").default,
  "pencil": require("lucide-react/icons/pencil").default,
  "play": require("lucide-react/icons/play").default,
  "power": require("lucide-react/icons/power").default,
  "power-off": require("lucide-react/icons/power-off").default,
  "radio": require("lucide-react/icons/radio").default,
  "shield-check": require("lucide-react/icons/shield-check").default,
  "skip-forward": require("lucide-react/icons/skip-forward").default,
  "sliders-horizontal": require("lucide-react/icons/sliders-horizontal").default,
  "timer": require("lucide-react/icons/timer").default,
  "trash-2": require("lucide-react/icons/trash-2").default,
  "x": require("lucide-react/icons/x").default,
  "zap": require("lucide-react/icons/zap").default,
});

module.exports = { ICONS: set.ICONS, Icon: set.Icon };
