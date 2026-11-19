// 事件趋势折线图的交互纯逻辑：图例开关、量程重算、命中索引、提示层定位。
// 抽在独立文件里是为了：① charts.cjs 已经 460+ 行，逼近 600 行红线；
// ② 这些规则可以脱离 React 与 SVG 做单测（scripts/test-task-trend-interaction.mjs）。
// 本文件不引用 React，也不碰 DOM。

/** 序列是否隐藏（hidden 以 key 为键，缺失即显示）。 */
function isVisible(hidden, key) {
  return !(hidden && hidden[key]);
}

/** 按可见性过滤序列，保持调用方给定顺序。 */
function visibleSeries(series, hidden) {
  return (series || []).filter(function (s) { return s && isVisible(hidden, s.key); });
}

/**
 * 量程：只按可见序列算最大值，再上浮 15% 取整。
 * 隐藏掉「发布」的尖峰后，其余四条不会被压成一条平线。
 */
function rangeMax(data, series, hidden) {
  if (!data || !data.length) return 1;
  var list = visibleSeries(series, hidden);
  var max = 1;
  (data || []).forEach(function (d) {
    list.forEach(function (s) { max = Math.max(max, Number(d[s.key] || 0)); });
  });
  return Math.ceil(max * 1.15) || 1;
}

/**
 * 图例点击：返回新的 hidden 对象。
 * 最后一条可见序列不允许关掉（否则整张图空掉）——此时原样返回并给 blocked: true。
 */
function toggle(hidden, series, key) {
  var next = Object.assign({}, hidden);
  if (isVisible(hidden, key)) {
    if (visibleSeries(series, hidden).length <= 1) return { hidden: hidden, blocked: true };
    next[key] = true;
  } else {
    delete next[key];
  }
  return { hidden: next, blocked: false };
}

/** 命中索引：把 0..1 的比例换算成桶下标，越界夹到两端。 */
function indexAt(ratio, length) {
  if (!length) return 0;
  var i = Math.round(Number(ratio) * (length - 1));
  if (!isFinite(i)) return 0;
  return Math.min(length - 1, Math.max(0, i));
}

/** 键盘左右移动；到头就停，不循环（循环会让用户分不清首尾）。 */
function moveIndex(index, delta, length) {
  if (!length) return 0;
  if (index === null || index === undefined || index < 0) return delta > 0 ? 0 : length - 1;
  return Math.min(length - 1, Math.max(0, index + delta));
}

/**
 * 提示层横向定位：按容器百分比摆，靠边时换锚点，避免溢出卡片。
 * ratio 是桶中心相对绘图区（不含左侧刻度）的比例，这里换算成整宽百分比。
 */
function tipAnchor(ratio, plotLeftPct, plotWidthPct) {
  var r = Math.min(1, Math.max(0, Number(ratio) || 0));
  var left = plotLeftPct + r * plotWidthPct;
  var flip = left > 72 ? "right" : left < 18 ? "left" : "center";
  return { left: Math.round(left * 100) / 100, flip: flip };
}

/** 提示层 CSS：只算 transform，不写死像素宽度。 */
function tipTransform(flip) {
  if (flip === "right") return "translateX(-100%)";
  if (flip === "left") return "translateX(0)";
  return "translateX(-50%)";
}

/** 该桶下可见序列的取值行（隐藏序列不列出来）。 */
function tipRows(data, series, hidden, index) {
  var row = (data || [])[index];
  if (!row) return [];
  return visibleSeries(series, hidden).map(function (s) {
    return { key: s.key, label: s.label, color: s.color, value: Number(row[s.key] || 0) };
  });
}

/** 屏幕阅读器汇总：只念可见序列的合计。 */
function summaryText(data, series, hidden, sep) {
  var list = visibleSeries(series, hidden);
  return list.map(function (s) {
    return s.label + " " + (data || []).reduce(function (n, d) { return n + Number(d[s.key] || 0); }, 0);
  }).join(sep || "，");
}

module.exports = {
  isVisible: isVisible,
  visibleSeries: visibleSeries,
  rangeMax: rangeMax,
  toggle: toggle,
  indexAt: indexAt,
  moveIndex: moveIndex,
  tipAnchor: tipAnchor,
  tipTransform: tipTransform,
  tipRows: tipRows,
  summaryText: summaryText,
};
