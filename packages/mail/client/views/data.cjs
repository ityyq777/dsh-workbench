"use strict";
/** 数据页：与 tasks/sites 共用只读浏览器；旧 dataQuery 由兼容层适配分页。 */
var legacy = require("../../../lib/legacy-data.cjs")("mail", { paged: false });

module.exports = require("../../../lib/data-view.cjs")({
  domain: "mail",
  prefix: "wbm",
  tables: ["mail_account", "mail_mailbox", "mail_message", "mail_attachment"],
  useConfig: function (api, fallback) { return { values: fallback, ready: true }; },
  tablesLoader: legacy.tablesLoader,
  query: legacy.query,
}).DataView;
