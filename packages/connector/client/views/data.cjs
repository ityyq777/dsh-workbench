"use strict";
/** 数据页：与 tasks/sites 共用只读浏览器；旧 dataQuery 由兼容层适配分页。 */
var legacy = require("../../../lib/legacy-data.cjs")("connector", { paged: true });

module.exports = require("../../../lib/data-view.cjs")({
  domain: "connector",
  prefix: "wbc",
  tables: ["connector_source", "connector_source_state", "connector_item", "connector_run"],
  useConfig: function (api, fallback) { return { values: fallback, ready: true }; },
  tablesLoader: legacy.tablesLoader,
  query: legacy.query,
}).DataView;
