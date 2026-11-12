"use strict";
var h = require("react").createElement;

// 任务插件自带 lucide-react 图标；每个图标按需引入，随 client.js 一起打包。
var ICONS = {
  "filter": require("lucide-react/icons/sliders-horizontal").default,
  "chart": require("lucide-react/icons/chart-column").default,
  "settings": require("lucide-react/icons/settings").default,
  "database": require("lucide-react/icons/database").default,
  "calendar": require("lucide-react/icons/calendar-days").default,
  "code-2": require("lucide-react/icons/code-xml").default,
  "terminal": require("lucide-react/icons/terminal").default,
  "pilcrow": require("lucide-react/icons/pilcrow").default,
  "plus": require("lucide-react/icons/plus").default,
  "minus": require("lucide-react/icons/minus").default,
  "check": require("lucide-react/icons/check").default,
  "stop": require("lucide-react/icons/square").default,
  "restart": require("lucide-react/icons/rotate-ccw").default,
  "timeline": require("lucide-react/icons/list-tree").default,
  "tree": require("lucide-react/icons/folder-tree").default,
  "search": require("lucide-react/icons/search").default,
  "grid": require("lucide-react/icons/layout-grid").default,
  "list": require("lucide-react/icons/list").default,
  "select": require("lucide-react/icons/square-check-big").default,
  "left": require("lucide-react/icons/chevron-left").default,
  "right": require("lucide-react/icons/chevron-right").default,
  "folder": require("lucide-react/icons/folder").default,
  "folderOpen": require("lucide-react/icons/folder-open").default,
  "table": require("lucide-react/icons/table-2").default,
  "house": require("lucide-react/icons/house").default,
  "folderPlus": require("lucide-react/icons/folder-plus").default,
  "filePlus": require("lucide-react/icons/file-plus").default,
  "pencil": require("lucide-react/icons/pencil").default,
  "trash": require("lucide-react/icons/trash-2").default,
  "close": require("lucide-react/icons/x").default,
  "down": require("lucide-react/icons/chevron-down").default,
  "tag": require("lucide-react/icons/tag").default,
  "clock": require("lucide-react/icons/clock").default,
  "refresh": require("lucide-react/icons/refresh-cw").default,
};
// 统一的小尺寸图标调用方式，保持各视图里的 Icon({ name, size }) 不变。
function Icon(props) {
  var C = ICONS[props.name];
  if (!C) return null;
  return h(C, { size: props.size || 14, strokeWidth: 2, "aria-hidden": "true", className: "wbt-svg" });
}

module.exports = { ICONS: ICONS, Icon: Icon };
