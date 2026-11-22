"use strict";
/**
 * 统计页的纯渲染件：只接收数据与回调，不持有状态。
 * 折线本体统一走 packages/addons/lib/stats-charts.cjs 的 Trend，
 * 这里只补工资插件自己的卡片外壳、口径开关与悬停提示卡。
 */

// 与 styles.cjs 里的 .wbsal-series i.s* / .wbsal-line.s* 同色，避免图例与折线不同色。
var TONE_COLOR = {
  s1: "var(--wb-accent,#2563eb)",
  s2: "var(--wb-ok,#16a34a)",
  s3: "var(--wb-warn,#d97706)",
  s4: "color-mix(in oklab,var(--wb-accent,#2563eb) 45%,var(--wb-danger,#dc2626))",
  s5: "color-mix(in oklab,var(--wb-ok,#16a34a) 55%,var(--wb-accent,#2563eb))",
  s6: "color-mix(in oklab,var(--wb-warn,#d97706) 60%,var(--wb-danger,#dc2626))",
  sum: "color-mix(in oklab,var(--wb-muted,#8b94a6) 45%,var(--wb-accent,#2563eb))",
  t1: "var(--wb-accent,#2563eb)",
  t2: "color-mix(in oklab,var(--wb-ok,#16a34a) 60%,var(--wb-muted,#8b94a6))",
  t3: "color-mix(in oklab,var(--wb-warn,#d97706) 55%,var(--wb-muted,#8b94a6))",
};

/** 分段式小开关：口径 / 金额口径 / 年份切换共用。 */
function segGroup(h, options, value, onPick, ariaLabel) {
  return h("div", { className: "wbsal-metric", role: "group", "aria-label": ariaLabel }, options.map(function (option) {
    return h("button", {
      key: option[0], type: "button", className: value === option[0] ? "on" : "",
      "aria-pressed": value === option[0],
      onClick: function () { onPick(option[0]); },
    }, option[1]);
  }));
}

/** 图例即开关：点一下隐藏对应折线，再点恢复。 */
function seriesSwitch(h, series, shown, onToggle, ariaLabel) {
  return h("div", { className: "wbsal-series", role: "group", "aria-label": ariaLabel }, series.map(function (m) {
    return h("button", {
      key: m.key, type: "button", className: shown[m.key] === false ? "off" : "",
      "aria-pressed": shown[m.key] !== false,
      title: (shown[m.key] === false ? "显示" : "隐藏") + m.label,
      onClick: function () { onToggle(m.key); },
    }, h("i", { className: m.tone }), m.label);
  }));
}

function anyShown(series, shown) {
  return series.some(function (m) { return shown[m.key] !== false; });
}

/** 悬停提示卡：标题 + 当前显示的各条线数值 + 笔数。 */
function tipCard(h, ctx) {
  if (ctx.index === null || ctx.index === undefined) return null;
  var kids = [h("strong", { key: "t" }, ctx.title)];
  (ctx.rows || []).forEach(function (row) {
    kids.push(h("div", { key: row.key, className: "wbsal-tip-row" },
      h("i", { className: row.tone }),
      h("span", null, row.label),
      h("b", null, ctx.fmt(row.value))));
  });
  if (ctx.note) kids.push(h("em", { key: "n" }, ctx.note));
  var length = ctx.length || 1;
  var ratio = length > 1 ? ctx.index / (length - 1) : 0;
  return h("div", {
    className: "wbsal-tip" + (ratio > 0.62 ? " is-right" : ""),
    style: { left: (ratio * 100) + "%" },
  }, kids);
}

/**
 * 折线卡片：标题 + 右上角图例开关 + Trend 折线 + 悬停提示 + 脚注。
 * opts: { h, F, CH, title, note, series, rows, visible, onToggle, hover, onHover,
 *         label, noteOf, tipTitle, tipRows, ariaLabel, emptyText, hint, footLeft, footRight, height }
 */
function trendCard(opts) {
  var h = opts.h, CH = opts.CH;
  var rows = opts.rows || [];
  var series = (opts.series || []).map(function (s) {
    return { key: s.key, label: s.label, className: s.tone, color: s.color || TONE_COLOR[s.tone] || undefined };
  });
  var shown = opts.visible || {};
  var empty = rows.length === 0;
  // 悬停下标只在合法范围内生效，tipTitle/tipRows 传回调时也要防越界取到 undefined。
  var idx = typeof opts.hover === "number" && opts.hover >= 0 && opts.hover < rows.length ? opts.hover : null;
  var row = idx === null ? null : rows[idx];
  return h("div", { className: "wbsal-card wbsal-section" },
    h("div", { className: "wbsal-section-head" },
      h("h3", null, opts.title),
      h("div", { className: "wbsal-section-tools" },
        opts.note ? h("span", { className: "wbsal-section-note" }, opts.note) : null,
        seriesSwitch(h, opts.series || [], shown, opts.onToggle, (opts.title || "折线") + "显示开关"))),
    empty
      ? h(CH.Empty, { text: opts.emptyText || "还没有可画的记录" })
      : h("div", { className: "wbsal-linechart" },
        h(CH.Trend, {
          data: rows.map(function (row) { return row; }),
          series: series,
          lang: opts.lang,
          height: opts.height || 210,
          showLegend: false,
          visible: shown,
          active: idx,
          onHover: opts.onHover,
          format: opts.fmt,
          label: opts.label,
          note: opts.noteOf,
          aria: opts.ariaLabel,
          emptyText: opts.emptyText,
        }),
        empty || idx === null ? null : tipCard(h, {
          index: idx,
          length: rows.length,
          title: opts.tipTitle ? opts.tipTitle(row) : "",
          rows: opts.tipRows ? opts.tipRows(row) : [],
          note: opts.tipNote ? opts.tipNote(row) : "",
          fmt: opts.fmt,
        })),
    !empty && anyShown(opts.series || [], shown) ? null
      : h("div", { className: "wbsal-chart-hint" }, opts.allOffHint || "所有线都关掉了，点上方的标签任意一个恢复显示"),
    h("div", { className: "wbsal-chart-foot" },
      h("span", null, opts.footLeft || ""),
      h("span", null, opts.footRight || "")),
  );
}

/** 月度口径柱状图：保留插件自己的柱子与口径切换（非 SVG 基件）。 */
function barChart(opts) {
  var h = opts.h, F = opts.F;
  var rows = opts.rows || [];
  var values = rows.map(function (b) { return opts.value(b); });
  var max = Math.max(1, Math.max.apply(null, values));
  var topIndex = -1;
  values.forEach(function (v, i) { if (v > 0 && (topIndex < 0 || v > values[topIndex])) topIndex = i; });
  var top = rows[topIndex];
  return h("div", null,
    h("div", { className: "wbsal-chart" }, rows.map(function (bucket, i) {
      var value = values[i];
      var ratio = value > 0 ? value / max : 0;
      var height = Math.round(Math.max(ratio * 150, value > 0 ? 6 : 0));
      return h("div", {
        key: bucket.month, className: "wbsal-bar",
        title: bucket.month + " 月 · 基本 " + F.money(bucket.basePay) + " / 绩效 " + F.money(bucket.performancePay)
          + " / 补贴 " + F.money(bucket.allowance) + " / 绩效奖惩 " + F.money(bucket.performanceBonus)
          + " / 应发 " + F.money(bucket.grossPay) + " / 实发 " + F.money(bucket.netPay),
      },
        h("div", { className: "wbsal-bar-value" }, value > 0 ? Math.round(value).toLocaleString("zh-CN") : ""),
        h("div", { className: "wbsal-bar-fill" + (i === topIndex ? " top" : ""), style: { height: height + "px" } }),
        h("div", { className: "wbsal-bar-label" }, ""));
    })),
    h("div", { className: "wbsal-axis" }, rows.map(function (bucket) { return h("span", { key: bucket.month }, bucket.month); })),
    h("div", { className: "wbsal-chart-foot" },
      h("span", { className: "wbsal-legend" }, h("i", null), "最高月", h("i", { className: "soft" }), "其他月份"),
      h("span", null, top ? "最高 " + F.monthLabel(top.period) + " · " + F.money(Math.max(0, values[topIndex] || 0)) : "")),
    h("div", { className: "wbsal-chart-foot" },
      h("span", null, "柱高按" + opts.metricLabel + "取值，悬停看该月全部维度"),
      h("span", null, "单位：元 · " + opts.basisLabel)));
}

function kpi(h, label, value, sub) {
  return h("div", { className: "wbsal-card wbsal-kpi" }, h("span", null, label), h("strong", null, value), h("em", null, sub));
}

function compRows(h, F, fields, keys, total, deduction) {
  var rows = keys.filter(function (key) { return (fields[key] || 0) !== 0; });
  if (rows.length === 0) return null;
  return h("div", { className: "wbsal-comp" }, rows.map(function (key) {
    var amount = fields[key] || 0;
    var percent = total ? Math.max(2, Math.min(100, Math.round((Math.abs(amount) / total) * 100))) : 0;
    return h("div", { key: key, className: "wbsal-comp-row" },
      h("span", null, F.LABELS[key]),
      h("div", { className: "wbsal-comp-track" }, h("div", { className: "wbsal-comp-fill" + (deduction ? " deduction" : ""), style: { width: percent + "%" } })),
      h("span", { className: "wbsal-comp-value" }, h("b", null, F.money(amount)), " · " + percent + "%"));
  }));
}

module.exports = {
  TONE_COLOR: TONE_COLOR,
  segGroup: segGroup,
  seriesSwitch: seriesSwitch,
  anyShown: anyShown,
  trendCard: trendCard,
  barChart: barChart,
  kpi: kpi,
  compRows: compRows,
};
