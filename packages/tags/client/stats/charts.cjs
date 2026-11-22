// 标签统计页图表：基件统一由 lib/stats-charts.cjs 提供。
// 这里只补两处插件差异：TopList 两栏布局相关样式，以及数据项 note 在图例/提示里的展示。
"use strict";

var lib = require("../../../lib/stats-charts.cjs");

// 标签页独有的样式（TopList 两栏、备注、ghost 按钮沿用本地既有外观）。
var EXTRA_STYLES = [
    ".@-ghost{appearance:none;border:1px solid var(--dsw-alias-border-l2,#e5e6eb);background:var(--dsw-alias-bg-layer-1,#fff);color:var(--dsw-alias-label-secondary,#646a73);border-radius:8px;font-size:12px;padding:6px 10px;cursor:pointer}",
    ".@-stats-columns{display:flex;gap:12px;align-items:flex-start}",
    ".@-top-column{flex:0 0 32%;min-width:0}.@-stats-main{flex:1;min-width:0}",
    ".@-top-scroll{max-height:min(64vh,720px);overflow-y:auto;overscroll-behavior:contain}",
    ".@-top-head,.@-top-row{display:grid;grid-template-columns:28px minmax(0,1fr) 44px;gap:6px;align-items:center;height:28px;box-sizing:border-box;font-size:12px;text-align:left}",
    ".@-top-head{position:sticky;top:0;z-index:1;background:var(--dsw-alias-bg-layer-1,#fff);color:var(--dsw-alias-label-tertiary,#8f959e);border-bottom:1px solid var(--dsw-alias-border-l2,#e5e6eb)}",
    ".@-top-row{appearance:none;width:100%;padding:0;border:0;background:transparent;color:inherit;cursor:pointer;font-family:inherit}",
    ".@-top-row:hover{background:var(--dsw-alias-bg-skeleton,#f2f3f5)}.@-top-row:focus-visible{outline:2px solid var(--dsw-alias-brand-primary,#4f6ef7);outline-offset:-2px}",
    ".@-top-name{position:relative;min-width:0;height:24px;line-height:24px}.@-top-label{position:relative;display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
    ".@-top-fill{position:absolute;left:0;top:3px;bottom:3px;border-radius:3px;background:color-mix(in srgb,var(--dsw-alias-brand-primary,#4f6ef7) 14%,transparent)}",
    ".@-top-rank{color:var(--dsw-alias-label-tertiary,#8f959e);font-variant-numeric:tabular-nums}.@-top-count{text-align:right;font-variant-numeric:tabular-nums}",
    ".@-stats-main>.@-span-6:first-child{grid-column:span 12}",
    ".@-leg-note{font-style:normal;font-size:11px;color:var(--dsw-alias-label-tertiary,#8f959e);margin-left:2px}",
    // ghost 按钮在本页沿用原inline-block外观，避免基件的 inline-flex 改变基线对齐。
    ".@-ghost{display:inline-block}",
];

module.exports = {
  colors: lib.colors,
  makeCharts: function (prefix) {
    return lib.makeCharts(prefix, { styles: EXTRA_STYLES, showNote: true });
  },
};
