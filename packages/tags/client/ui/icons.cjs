"use strict";
// 图标表：lucide 图标按需引入，用哪个引哪个——这些图标都会随本插件 client.js 打包。
var icons = require("../../../lib/icons.cjs");

var set = icons.create("wbg", {
  search: require("lucide-react/icons/search").default,
  x: require("lucide-react/icons/x").default,
  plus: require("lucide-react/icons/plus").default,
  trash: require("lucide-react/icons/trash-2").default,
  pencil: require("lucide-react/icons/pencil").default,
  check: require("lucide-react/icons/check").default,
  refresh: require("lucide-react/icons/refresh-cw").default,
  chart: require("lucide-react/icons/chart-column").default,
  settings: require("lucide-react/icons/settings").default,
  database: require("lucide-react/icons/database").default,
  tags: require("lucide-react/icons/tags").default,
  "code-2": require("lucide-react/icons/code-xml").default,
  tag: require("lucide-react/icons/tag").default,
}, { tabIcon: true });

module.exports = { ICONS: set.ICONS, Icon: set.Icon, tabIcon: set.tabIcon };
