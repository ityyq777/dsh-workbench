"use strict";
/** 数据页：与 tasks/sites 共用只读浏览器；旧 dataQuery 由兼容层适配分页。 */
var legacy = require("../../../lib/legacy-data.cjs")("vault", { paged: true });

module.exports = require("../../../lib/data-view.cjs")({
  domain: "vault",
  prefix: "wbv",
  tables: ["vault_secret", "vault_group", "vault_set", "vault_group_set", "vault_set_secret", "vault_binding"],
  useConfig: function (api, fallback) { return { values: fallback, ready: true }; },
  tablesLoader: legacy.tablesLoader,
  query: legacy.query,
}).DataView;
