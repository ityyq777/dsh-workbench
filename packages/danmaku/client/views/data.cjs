"use strict";
module.exports = require("../../../lib/data-view.cjs")({
  domain: "danmaku",
  prefix: "wbdm",
  tables: ["danmaku"],
  useConfig: require("./config.cjs").useConfig,
});
