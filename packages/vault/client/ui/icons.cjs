"use strict";
// 图标表：用哪个引哪个，图标随本插件 client.js 打包（共享层只放渲染工厂）。
var icons = require("../../../lib/icons.cjs");

var set = icons.create("wbv", {
  "database": require("lucide-react/icons/database").default,
  "eye": require("lucide-react/icons/eye").default,
  "folder": require("lucide-react/icons/folder").default,
  "key-round": require("lucide-react/icons/key-round").default,
  "layers": require("lucide-react/icons/layers").default,
  "list": require("lucide-react/icons/list").default,
  "lock": require("lucide-react/icons/lock").default,
  "lock-open": require("lucide-react/icons/lock-open").default,
  "pencil": require("lucide-react/icons/pencil").default,
  "plus": require("lucide-react/icons/plus").default,
  "refresh-cw": require("lucide-react/icons/refresh-cw").default,
  "shield": require("lucide-react/icons/shield").default,
  "shield-check": require("lucide-react/icons/shield-check").default,
  "shield-plus": require("lucide-react/icons/shield-plus").default,
  "sliders-horizontal": require("lucide-react/icons/sliders-horizontal").default,
  "trash-2": require("lucide-react/icons/trash-2").default,
  "x": require("lucide-react/icons/x").default,
});

module.exports = { ICONS: set.ICONS, Icon: set.Icon };
