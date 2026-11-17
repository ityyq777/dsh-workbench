"use strict";
module.exports = require("../../../lib/data-view.cjs")({
  domain: "message",
  prefix: "wbm",
  tables: ["message"],
  useConfig: require("./config.cjs").useConfig,
});
