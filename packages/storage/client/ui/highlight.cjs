// 储物记录页的搜索高亮：只做「按字面量把命中片段包成 mark.wbi-hit」，
// 匹配逻辑统一走 packages/addons/lib/highlight.cjs（与任务页同一份实现，
// 大小写口径与 storage.list 的 instr(lower()) 对齐），这里只换类名前缀。
"use strict";
module.exports = function (React) {
  return require("../../../lib/highlight.cjs")(React)("wbi");
};
