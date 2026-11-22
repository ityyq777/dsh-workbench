"use strict";
/** 自动化插件样式：共享基础件（前缀 wba） + 本插件版式层 + 共享开关控件 + 共享数字输入。 */
// 布尔开关外观走 lib/switch.cjs 的 wbctl-* 规则，重复追加无害。
var SW = require("../../../lib/switch.cjs");
// 数字输入框外观走 lib/number-field.cjs 的 wbctl-num* 规则，重复追加无害。
var NF = require("../../../lib/number-field.cjs");
module.exports =
  require("../../../lib/client-base-styles.cjs")("wba").join("\n") +
  "\n" +
  require("./layout-styles.cjs") +
  "\n" +
  SW.styles.join("\n") +
  "\n" +
  NF.styles.join("\n");
