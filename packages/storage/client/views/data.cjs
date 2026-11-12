"use strict";
module.exports = require("../../../lib/data-view.cjs")({
  domain: "storage",
  Icon: require("../ui/icons.cjs").Icon,
  Skeleton: require("../ui/ui.cjs").Skeleton,
  prefix: "wbi",
  tables: ["storage"],
  useConfig: require("./config.cjs").useConfig,
  columns: require("../ui/data-columns.cjs"),
});
