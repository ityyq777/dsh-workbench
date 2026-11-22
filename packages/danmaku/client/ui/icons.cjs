"use strict";
// 图标表：用哪个引哪个，图标随本插件 client.js 打包（共享层只放渲染工厂）。
var icons = require("../../../lib/icons.cjs");

var set = icons.create("wbdm", {
  "arrow-down": require("lucide-react/icons/arrow-down").default,
  "arrow-up": require("lucide-react/icons/arrow-up").default,
  "check": require("lucide-react/icons/check").default,
  "database": require("lucide-react/icons/database").default,
  "eye": require("lucide-react/icons/eye").default,
  "list": require("lucide-react/icons/list").default,
  "megaphone": require("lucide-react/icons/megaphone").default,
  "monitor": require("lucide-react/icons/monitor").default,
  "pencil": require("lucide-react/icons/pencil").default,
  "play": require("lucide-react/icons/play").default,
  "plus": require("lucide-react/icons/plus").default,
  "power": require("lucide-react/icons/power").default,
  "refresh-cw": require("lucide-react/icons/refresh-cw").default,
  "settings": require("lucide-react/icons/settings").default,
  "trash-2": require("lucide-react/icons/trash-2").default,
  "x": require("lucide-react/icons/x").default,
});

module.exports = { ICONS: set.ICONS, Icon: set.Icon };
