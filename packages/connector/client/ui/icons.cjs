"use strict";
// 图标表：用哪个引哪个，图标随本插件 client.js 打包（共享层只放渲染工厂）。
var icons = require("../../../lib/icons.cjs");

var set = icons.create("wbc", {
  "activity": require("lucide-react/icons/activity").default,
  "database": require("lucide-react/icons/database").default,
  "history": require("lucide-react/icons/history").default,
  "inbox": require("lucide-react/icons/inbox").default,
  "list": require("lucide-react/icons/list").default,
  "rss": require("lucide-react/icons/rss").default,
  "sliders-horizontal": require("lucide-react/icons/sliders-horizontal").default,
});

module.exports = { ICONS: set.ICONS, Icon: set.Icon };
