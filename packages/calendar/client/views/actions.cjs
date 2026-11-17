"use strict";
/** Action 页：与 tasks/sites 共用只读 schema 浏览器。 */
module.exports = require("../../../lib/action-schema-view.cjs")({
  domain: "wb-addon-calendar",
  prefix: "wbca",
}).ActionSchemaView;
