"use strict";
module.exports = require("../../../lib/data-view.cjs")({
  domain: "tags",
  prefix: "wbg",
  tables: ["tag","tag_mapping"],
  useConfig: require("./config.cjs").useConfig,
});
