"use strict";
/** 自动化插件样式：共享基础件（前缀 wba） + 本插件版式层。 */
module.exports = require("../../../lib/client-base-styles.cjs")("wba").join("\n") + "\n" + require("./layout-styles.cjs");
