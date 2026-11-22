"use strict";
// 图标表：lucide 图标按需引入，用哪个引哪个——这些图标都会随本插件 client.js 打包。
var icons = require("../../../lib/icons.cjs");

// 装饰性图标不进 Tab 顺序；空态图例外允许 48。
function sizeOf(props) {
  if (props.name === "empty" && props.size === 48) return 48;
  return [11, 14, 16].indexOf(props.size) >= 0 ? props.size : 14;
}

var set = icons.create("wbi", {
  box: require("lucide-react/icons/box").default,
  plus: require("lucide-react/icons/plus").default,
  search: require("lucide-react/icons/search").default,
  refresh: require("lucide-react/icons/refresh-cw").default,
  pencil: require("lucide-react/icons/pencil").default,
  trash: require("lucide-react/icons/trash-2").default,
  sort: require("lucide-react/icons/arrow-up-down").default,
  image: require("lucide-react/icons/image").default,
  clock: require("lucide-react/icons/clock").default,
  tag: require("lucide-react/icons/tag").default,
  stock: require("lucide-react/icons/package").default,
  chart: require("lucide-react/icons/chart-column").default,
  list: require("lucide-react/icons/list").default,
  settings: require("lucide-react/icons/settings").default,
  database: require("lucide-react/icons/database").default,
  "code-2": require("lucide-react/icons/code-xml").default,
  download: require("lucide-react/icons/download").default,
  empty: require("lucide-react/icons/package-open").default,
  brand: require("lucide-react/icons/factory").default,
  unit: require("lucide-react/icons/ruler").default,
  location: require("lucide-react/icons/map-pin").default,
  check: require("lucide-react/icons/check-square").default,
  close: require("lucide-react/icons/x").default,
  table: require("lucide-react/icons/table").default,
  reset: require("lucide-react/icons/rotate-ccw").default,
}, { fallback: "box", focusable: true, sizeOf: sizeOf });

module.exports = { ICONS: set.ICONS, Icon: set.Icon };
