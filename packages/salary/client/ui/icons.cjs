"use strict";
// 图标表：用哪个引哪个，图标随本插件 client.js 打包（共享层只放渲染工厂）。
var icons = require("../../../lib/icons.cjs");

var set = icons.create("wbsal", {
  "chart-column": require("lucide-react/icons/chart-column").default,
  "database": require("lucide-react/icons/database").default,
  "list": require("lucide-react/icons/list").default,
  "wallet": require("lucide-react/icons/wallet").default,
});

module.exports = { ICONS: set.ICONS, Icon: set.Icon };
