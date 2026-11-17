"use strict";
/** 数据页：与 tasks/sites 共用只读浏览器；旧 dataQuery 由兼容层适配分页。 */
var legacy = require("../../../lib/legacy-data.cjs")("calendar", { paged: false });

module.exports = require("../../../lib/data-view.cjs")({
  domain: "calendar",
  prefix: "wbca",
  tables: ["calendar", "calendar_event", "calendar_attendee", "calendar_reminder"],
  useConfig: function (api, fallback) { return { values: fallback, ready: true }; },
  tablesLoader: legacy.tablesLoader,
  query: legacy.query,
}).DataView;
