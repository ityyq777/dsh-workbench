"use strict";
module.exports = require("../../../lib/data-view.cjs")({
  domain: "tasks",
  prefix: "wbt",
  tables: ["task","task_node"],
  useConfig: require("./config.cjs").useConfig,
});
