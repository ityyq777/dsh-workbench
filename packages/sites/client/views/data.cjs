"use strict";
module.exports = require("../../../lib/data-view.cjs")({
  domain: "sites",
  prefix: "wbs",
  tables: ["site","site_node","site_node_mapping","site_account","site_account_external"],
  useConfig: require("./config.cjs").useConfig,
});
