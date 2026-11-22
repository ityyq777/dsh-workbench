"use strict";
// 图标表：用哪个引哪个，图标随本插件 client.js 打包（共享层只放渲染工厂）。
var icons = require("../../../lib/icons.cjs");

var set = icons.create("wbct", {
  "database": require("lucide-react/icons/database").default,
  "folder": require("lucide-react/icons/folder").default,
  "list": require("lucide-react/icons/list").default,
  "sliders-horizontal": require("lucide-react/icons/sliders-horizontal").default,
  "upload": require("lucide-react/icons/upload").default,
  "users": require("lucide-react/icons/users").default,
});

module.exports = { ICONS: set.ICONS, Icon: set.Icon };
