"use strict";
/** 基础样式见 packages/addons/lib/client-base-styles.cjs；数字输入外观来自共享控件。 */
var NF = require("../../../lib/number-field.cjs");
module.exports = require("../../../lib/client-base-styles.cjs")("wbc")
  .concat(NF.styles)
  .concat([
    /* 来源表单里数字项校验失败时的提示行，颜色取主题 token。 */
    ".wbc-form-err{margin:6px 0 0;color:var(--wb-danger,#b91c1c)}",
  ]);
