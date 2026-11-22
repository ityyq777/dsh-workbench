// 站点统计页图表：基件统一由 lib/stats-charts.cjs 提供，这里只注入站点用到的图标表。
"use strict";

var lib = require("../../../lib/stats-charts.cjs");
var G = require("../ui/icons.cjs").ICONS;

var ICONS = {
  "refresh": G["refresh"],
  "globe": G["globe"],
  "link": G["link"],
  "tag": G["tag"],
  "pie": G["pie-chart"],
  "folder": G["folder-tree"],
  "unlink": G["unlink"],
  "layers": G["layers"],
  "plus": G["plus"],
};

module.exports = {
  colors: lib.colors,
  makeCharts: function (prefix) {
    return lib.makeCharts(prefix, { icons: ICONS });
  },
};
