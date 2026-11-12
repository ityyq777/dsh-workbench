"use strict";
var h = require("react").createElement;

// 站点插件自带 lucide-react 图标；每个图标按需引入，随 client.js 一起打包。
var ICONS = {
  "x": require("lucide-react/icons/x").default,
  "plus": require("lucide-react/icons/plus").default,
  "check": require("lucide-react/icons/check").default,
  "edit": require("lucide-react/icons/pencil").default,
  "trash": require("lucide-react/icons/trash-2").default,
  "folder": require("lucide-react/icons/folder").default,
  "folder-open": require("lucide-react/icons/folder-open").default,
  "folder-plus": require("lucide-react/icons/folder-plus").default,
  "folder-tree": require("lucide-react/icons/folder-tree").default,
  "house": require("lucide-react/icons/house").default,
  "link": require("lucide-react/icons/link-2").default,
  "tag": require("lucide-react/icons/tag").default,
  "star": require("lucide-react/icons/star").default,
  "search": require("lucide-react/icons/search").default,
  "refresh": require("lucide-react/icons/refresh-cw").default,
  "chevron-left": require("lucide-react/icons/chevron-left").default,
  "chevron-right": require("lucide-react/icons/chevron-right").default,
  "chevron-down": require("lucide-react/icons/chevron-down").default,
  "arrow-up": require("lucide-react/icons/arrow-up").default,
  "arrow-down": require("lucide-react/icons/arrow-down").default,
  "arrow-up-down": require("lucide-react/icons/arrow-up-down").default,
  "key": require("lucide-react/icons/key-round").default,
  "lock": require("lucide-react/icons/lock").default,
  "eye": require("lucide-react/icons/eye").default,
  "eye-off": require("lucide-react/icons/eye-off").default,
  "chart": require("lucide-react/icons/chart-column").default,
  "settings": require("lucide-react/icons/settings").default,
  "database": require("lucide-react/icons/database").default,
  "code-2": require("lucide-react/icons/code-xml").default,
  "globe": require("lucide-react/icons/globe").default,
  "copy": require("lucide-react/icons/copy").default,
};
// 统一的小尺寸图标调用方式，保持各视图里的 Icon({ name, size }) 不变。
function Icon(props) {
  var C = ICONS[props.name];
  if (!C) return null;
  return h(C, {
    size: props.size || 14,
    strokeWidth: props.strokeWidth || 2,
    "aria-hidden": "true",
    className: "wbs-svg" + (props.className ? " " + props.className : ""),
  });
}

// 标签页标题左侧图标：与储物/任务/标签保持同语义、同尺寸。
function tabIcon(name) { return function SitesTabIcon() { return h(Icon, { name: name, size: 14 }); }; }

module.exports = { ICONS: ICONS, Icon: Icon, tabIcon: tabIcon };
