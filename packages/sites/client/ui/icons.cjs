"use strict";
// 图标表：lucide 图标按需引入，用哪个引哪个——这些图标都会随本插件 client.js 打包。
var icons = require("../../../lib/icons.cjs");

var set = icons.create("wbs", {
  x: require("lucide-react/icons/x").default,
  plus: require("lucide-react/icons/plus").default,
  check: require("lucide-react/icons/check").default,
  edit: require("lucide-react/icons/pencil").default,
  trash: require("lucide-react/icons/trash-2").default,
  folder: require("lucide-react/icons/folder").default,
  "folder-open": require("lucide-react/icons/folder-open").default,
  "folder-plus": require("lucide-react/icons/folder-plus").default,
  "folder-tree": require("lucide-react/icons/folder-tree").default,
  house: require("lucide-react/icons/house").default,
  link: require("lucide-react/icons/link-2").default,
  tag: require("lucide-react/icons/tag").default,
  star: require("lucide-react/icons/star").default,
  search: require("lucide-react/icons/search").default,
  refresh: require("lucide-react/icons/refresh-cw").default,
  "chevron-left": require("lucide-react/icons/chevron-left").default,
  "chevron-right": require("lucide-react/icons/chevron-right").default,
  "chevron-down": require("lucide-react/icons/chevron-down").default,
  "arrow-up": require("lucide-react/icons/arrow-up").default,
  "arrow-down": require("lucide-react/icons/arrow-down").default,
  "arrow-up-down": require("lucide-react/icons/arrow-up-down").default,
  key: require("lucide-react/icons/key-round").default,
  lock: require("lucide-react/icons/lock").default,
  eye: require("lucide-react/icons/eye").default,
  "eye-off": require("lucide-react/icons/eye-off").default,
  chart: require("lucide-react/icons/chart-column").default,
  settings: require("lucide-react/icons/settings").default,
  database: require("lucide-react/icons/database").default,
  "code-2": require("lucide-react/icons/code-xml").default,
  globe: require("lucide-react/icons/globe").default,
  copy: require("lucide-react/icons/copy").default,
}, { classNameAppend: true, tabIcon: true });

module.exports = { ICONS: set.ICONS, Icon: set.Icon, tabIcon: set.tabIcon };
