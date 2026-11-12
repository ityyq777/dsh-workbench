var React = require("react");
// Public lucide-react ./icons/* exports keep the bundle scoped to these glyphs.
var ICONS = {
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
};
function Icon(props) {
  var size = props.name === "empty" && props.size === 48 ? 48 : [11,14,16].includes(props.size) ? props.size : 14;
  return React.createElement(ICONS[props.name] || ICONS.box, { size: size, strokeWidth: 2,
    "aria-hidden": true, focusable: false, className: "wbi-svg" });
}
module.exports = { ICONS: ICONS, Icon: Icon };
