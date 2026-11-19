"use strict";
/** 统计页：年度切换、KPI、12 月柱状图、折线对比、社保与个税、最近月构成。 */
module.exports = function Stats(props) {
  var h = props.h, React = props.React, api = props.api;
  var C = require("../ui/common.cjs");
  var F = require("../ui/fields.cjs");
  var yearState = React.useState(new Date().getFullYear());
  var year = yearState[0], setYear = yearState[1];
  var load = C.useLoad(React, api, "salary.stats", { year: year }, [year]);
  var data = load.data;
  // 柱状图口径：实发 / 基本 / 绩效 / 应发，交互方式与任务插件统计页的口径切换一致。
  var METRICS = [
    { key: "netPay", label: "实发" },
    { key: "basePay", label: "基本" },
    { key: "performancePay", label: "绩效" },
    { key: "allowance", label: "补贴" },
    { key: "performanceBonus", label: "绩效奖惩" },
    { key: "grossPay", label: "应发" },
  ];
  var metricState = React.useState(props.initialMetric || "netPay");
  var metric = metricState[0], setMetric = metricState[1];
  var metricLabel = "实发";
  METRICS.forEach(function (m) { if (m.key === metric) metricLabel = m.label; });
  var monthly = (data && data.monthly) || [];
  function metricValue(bucket) { return Number(bucket[metric]) || 0; }
  var maxNet = 1;
  monthly.forEach(function (bucket) { if (metricValue(bucket) > maxNet) maxNet = metricValue(bucket); });
  var topMonth = -1;
  monthly.forEach(function (bucket, i) { if (metricValue(bucket) > 0 && (topMonth < 0 || metricValue(bucket) > metricValue(monthly[topMonth]))) topMonth = i; });

  // 折线图：六条线（实发/应发/基本/绩效/补贴/绩效奖惩）各自可勾选显示，默认全开。
  var LINE_SERIES = [
    { key: "netPay", label: "实发", tone: "s1" },
    { key: "grossPay", label: "应发", tone: "s2" },
    { key: "basePay", label: "基本", tone: "s3" },
    { key: "performancePay", label: "绩效", tone: "s4" },
    { key: "allowance", label: "补贴", tone: "s5" },
    { key: "performanceBonus", label: "绩效奖惩", tone: "s6" },
  ];
  var visibleState = React.useState(Object.assign({ netPay: true, grossPay: true, basePay: true, performancePay: true, allowance: true, performanceBonus: true }, props.initialVisible || {}));
  var visible = visibleState[0];
  function toggleSeries(key) {
    var next = {};
    LINE_SERIES.forEach(function (m) { next[m.key] = !!visible[m.key]; });
    next[key] = !next[key];
    visibleState[1](next);
  }
  // 社保与个税：养老 / 医疗 / 失业 / 公积金 / 个税 五条线，虚线合计为五项之和。
  function round2(value) { return Math.round((Number(value) || 0) * 100) / 100; }
  function deductOf(bucket) {
    return round2((Number(bucket.pension) || 0) + (Number(bucket.medical) || 0) + (Number(bucket.unemployment) || 0)
      + (Number(bucket.housingFund) || 0) + (Number(bucket.incomeTax) || 0));
  }
  function seriesValue(m, bucket) {
    if (typeof m.get === "function") return m.get(bucket);
    return Number(bucket[m.key]) || 0;
  }
  var DEDUCT_TOTAL_ALL = round2((data && data.socialTotal) + (data && data.incomeTaxTotal));
  var DEDUCT_SERIES = F.SOCIAL_KEYS.map(function (key, index) {
    return { key: key, label: F.LABELS[key], tone: "s" + (index + 1) };
  }).concat([
    { key: "incomeTax", label: "个税", tone: "s5" },
    { key: "deductTotal", label: "合计", tone: "sum", get: deductOf },
  ]);
  var socialVisibleState = React.useState(Object.assign({ pension: true, medical: true, unemployment: true, housingFund: true, incomeTax: true, deductTotal: true }, props.initialSocialVisible || {}));
  var socialVisible = socialVisibleState[0];
  function toggleSocial(key) {
    var next = {};
    DEDUCT_SERIES.forEach(function (m) { next[m.key] = !!socialVisible[m.key]; });
    next[key] = !next[key];
    socialVisibleState[1](next);
  }
  // 悬停某个月份时给出该月全部维度数值：两条折线图各记一份悬停状态
  var hoverState = React.useState(props.initialHover || null);
  var hover = hoverState[0], setHover = hoverState[1];
  var socialHoverState = React.useState(props.initialSocialHover || null);
  var socialHover = socialHoverState[0], setSocialHover = socialHoverState[1];
  var recordedMonths = monthly.filter(function (bucket) { return bucket.records > 0; });
  var LPAD = { l: 62, r: 16, t: 14, b: 30 };
  var LW = 1000, LH = 250;
  var plotW = LW - LPAD.l - LPAD.r;
  var plotH = LH - LPAD.t - LPAD.b;
  function plotX(month) { return LPAD.l + ((month - 1) / 11) * plotW; }
  function gridLabel(value) {
    if (value >= 100 || value === 0) return Math.round(value).toLocaleString("zh-CN");
    return Number(value.toFixed(1)).toLocaleString("zh-CN");
  }
  // 刻度步长取 1/2/2.5/5×10^n，纵轴上下量级都能保持整刻度
  function niceStep(raw) {
    if (!(raw > 0)) return 1;
    var exp = Math.pow(10, Math.floor(Math.log(raw) / Math.LN10));
    var norm = raw / exp;
    var mult = norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 2.5 ? 2.5 : norm <= 5 ? 5 : 10;
    return mult * exp;
  }
  // 两张折线图共用一套几何：纵轴只按「当前显示的线」取值，
  // 这样只留一条低量级的线（如补贴 480）时不会被隐藏的应发（12,280）撑成一条贴地直线
  function renderChart(series, shown, ariaLabel, activeMonth, onHover) {
    var max = 0;
    recordedMonths.forEach(function (bucket) {
      series.forEach(function (m) {
        if (!shown[m.key]) return;
        var v = seriesValue(m, bucket);
        if (v > max) max = v;
      });
    });
    var step = niceStep(Math.max(max, 1) / 5);
    var axisMax = step * 5;
    function plotY(value) { return LPAD.t + plotH * (1 - Math.min(1, (Number(value) || 0) / axisMax)); }
    var children = [];
    // 每个月一整列透明热区：鼠标移进来就展示该月全部维度，移出去收起
    if (onHover) {
      var slot = plotW / 12;
      children.push(h("rect", {
        key: "hit-area", x: LPAD.l - slot / 2, y: LPAD.t, width: plotW + slot, height: plotH,
        className: "wbsal-hit-area", onMouseLeave: function () { onHover(null); },
      }));
      recordedMonths.forEach(function (bucket) {
        children.push(h("rect", {
          key: "hit" + bucket.month,
          x: plotX(bucket.month) - slot / 2, y: LPAD.t, width: slot, height: plotH,
          className: "wbsal-hit", onMouseEnter: function () { onHover(bucket.month); },
        }));
      });
    }
    [1, 0.8, 0.6, 0.4, 0.2, 0].forEach(function (ratio) {
      var value = axisMax * ratio;
      var y = plotY(value);
      children.push(h("line", { key: "g" + ratio, x1: LPAD.l, y1: y, x2: LW - LPAD.r, y2: y, className: "wbsal-line-gridline" }));
      children.push(h("text", { key: "gt" + ratio, x: LPAD.l - 10, y: y + 4, textAnchor: "end" }, gridLabel(value)));
    });
    monthly.forEach(function (bucket) {
      children.push(h("text", { key: "x" + bucket.month, x: plotX(bucket.month), y: LH - 10, textAnchor: "middle" }, bucket.month));
    });
    if (activeMonth) {
      children.push(h("line", {
        key: "crosshair", x1: plotX(activeMonth), y1: LPAD.t, x2: plotX(activeMonth), y2: LPAD.t + plotH,
        className: "wbsal-crosshair",
      }));
    }
    series.forEach(function (m) {
      if (!shown[m.key] || recordedMonths.length === 0) return;
      var points = recordedMonths.map(function (bucket) {
        return { month: bucket.month, value: seriesValue(m, bucket) };
      });
      if (points.length > 1) {
        children.push(h("polyline", {
          key: "line" + m.key,
          className: "wbsal-line " + m.tone,
          points: points.map(function (pt) { return plotX(pt.month) + "," + plotY(pt.value); }).join(" "),
        }));
      }
      points.forEach(function (pt) {
        children.push(h("circle", {
          key: "dot" + m.key + pt.month, className: "wbsal-line-dot " + m.tone + (pt.month === activeMonth ? " is-hot" : ""),
          cx: plotX(pt.month), cy: plotY(pt.value), r: pt.month === activeMonth ? 5 : 3.6,
        }, h("title", null, pt.month + " 月 · " + m.label + " " + F.money(pt.value))));
      });
    });
    return h("svg", { viewBox: "0 0 " + LW + " " + LH, role: "img", "aria-label": ariaLabel }, children);
  }
  // 图例即开关：点一下隐藏对应折线，再点恢复
  function seriesSwitch(series, shown, onToggle, ariaLabel) {
    return h("div", { className: "wbsal-series", role: "group", "aria-label": ariaLabel }, series.map(function (m) {
      return h("button", {
        key: m.key, type: "button", className: shown[m.key] ? "on" : "off",
        "aria-pressed": !!shown[m.key],
        title: (shown[m.key] ? "隐藏" : "显示") + m.label,
        onClick: function () { onToggle(m.key); },
      }, h("i", { className: m.tone }), m.label);
    }));
  }
  function anyShown(series, shown) { return series.some(function (m) { return shown[m.key]; }); }

  // 悬停提示卡：列出该月「当前显示的每条线」的数值，右侧月份改成左对齐防止溢出
  function renderTip(series, shown, month) {
    if (!month) return null;
    var bucket = null;
    monthly.forEach(function (b) { if (b.month === month) bucket = b; });
    if (!bucket) return null;
    var kids = [h("strong", { key: "m" }, F.monthLabel(bucket.period))];
    series.forEach(function (m) {
      if (!shown[m.key]) return;
      kids.push(h("div", { key: m.key, className: "wbsal-tip-row" },
        h("i", { className: m.tone }),
        h("span", null, m.label),
        h("b", null, F.money(seriesValue(m, bucket)))));
    });
    kids.push(h("em", { key: "n" }, bucket.records + " 笔记录"));
    return h("div", {
      className: "wbsal-tip" + (month >= 8 ? " is-right" : ""),
      style: { left: ((plotX(month) / LW) * 100) + "%" },
    }, kids);
  }

  function signed(amount) {
    var n = Number(amount) || 0;
    return (n > 0 ? "+" : n < 0 ? "-" : "") + F.money(Math.abs(n));
  }
  function kpi(label, value, sub) {
    return h("div", { className: "wbsal-card wbsal-kpi" }, h("span", null, label), h("strong", null, value), h("em", null, sub));
  }
  function compRows(keys, total, deduction) {
    var rows = keys.filter(function (key) { return (data.latestMonth.breakdown.fields[key] || 0) !== 0; });
    if (rows.length === 0) return null;
    return h("div", { className: "wbsal-comp" }, rows.map(function (key) {
      var amount = data.latestMonth.breakdown.fields[key] || 0;
      var percent = total ? Math.max(2, Math.min(100, Math.round((Math.abs(amount) / total) * 100))) : 0;
      return h("div", { key: key, className: "wbsal-comp-row" },
        h("span", null, F.LABELS[key]),
        h("div", { className: "wbsal-comp-track" }, h("div", { className: "wbsal-comp-fill" + (deduction ? " deduction" : ""), style: { width: percent + "%" } })),
        h("span", { className: "wbsal-comp-value" }, h("b", null, F.money(amount)), " · " + percent + "%"));
    }));
  }

  var body;
  if (load.loading) body = h(C.Empty, { h: h, text: "加载中…" });
  else if (load.error) body = h(C.Notice, { h: h, kind: "error", text: load.error });
  else if (!data || data.records === 0) {
    body = h("div", { className: "wbsal-empty" },
      h("div", null, year + " 年还没有工资记录；换个年份，或先去工资记录页记一笔"));
  } else {
    var latestBreakdown = data.latestMonth && data.latestMonth.breakdown;
    var deductionTotal = latestBreakdown ? latestBreakdown.preTax + latestBreakdown.social + latestBreakdown.tax : 0;
    var chartMax = Math.max(1, maxNet);
    body = h("div", { className: "wbsal-section" },
      h("div", { className: "wbsal-kpis" },
        kpi("最近实发", data.latest ? F.money(data.latest.netPay) : "—", data.latest ? data.latest.payDate + " · 最近一笔" : "还没有记录"),
        kpi("月均实发", F.money(data.avgNetPay), "按有记录的月份平均"),
        kpi("年度实发合计", F.money(data.netTotal), data.records + " 笔 · 覆盖 " + data.months + " 个月"),
        kpi("年度应发", F.money(data.grossTotal), "税前"),
        kpi("年度个税", F.money(data.incomeTaxTotal), "工资薪金预扣"),
        kpi("年度五险一金", F.money(data.socialTotal), "养老 / 医疗 / 失业 / 公积金")),

      // 环比 / 最近月份 / 最近一笔：紧贴月度趋势图上方，先给结论再看图
      h("div", { className: "wbsal-kpis" },
        kpi("环比", data.mom ? signed(data.mom.amount) : "—",
          data.mom ? (data.mom.percent === null ? "上月为 0" : (data.mom.percent > 0 ? "+" : "") + data.mom.percent + "% · 最近两个月") : "至少需要两个月记录"),
        kpi("最近月份", data.latestMonth ? F.monthLabel(data.latestMonth.period) : "—", data.latestMonth ? data.latestMonth.records + " 笔" : ""),
        kpi("最近一笔", data.latest ? data.latest.payDate : "—", data.latest ? (data.latest.cycle === "daily" ? "日结" : "月结") + " · " + F.money(data.latest.netPay) : "")),

      h("div", { className: "wbsal-card wbsal-section" },
        h("div", { className: "wbsal-section-head" },
          h("h3", null, "月度" + metricLabel + "趋势"),
          h("div", { className: "wbsal-section-tools" },
            h("div", { className: "wbsal-metric", role: "group", "aria-label": "图表统计口径" }, METRICS.map(function (m) {
              return h("button", {
                key: m.key, type: "button", className: m.key === metric ? "on" : "",
                "aria-pressed": m.key === metric,
                onClick: function () { setMetric(m.key); },
              }, m.label);
            })),
            h("span", { className: "wbsal-section-note" }, "最高 " + F.monthLabel(monthly[topMonth] ? monthly[topMonth].period : "") + " · " + F.money(maxNet)))),
        h("div", { className: "wbsal-chart" }, monthly.map(function (bucket, i) {
          var value = metricValue(bucket);
          var ratio = value > 0 ? value / chartMax : 0;
          var height = Math.round(Math.max(ratio * 150, value > 0 ? 6 : 0));
          return h("div", {
            key: bucket.month, className: "wbsal-bar",
            title: bucket.month + " 月 · 基本 " + F.money(bucket.basePay) + " / 绩效 " + F.money(bucket.performancePay) + " / 补贴 " + F.money(bucket.allowance) + " / 绩效奖惩 " + F.money(bucket.performanceBonus) + " / 应发 " + F.money(bucket.grossPay) + " / 实发 " + F.money(bucket.netPay),
          },
            h("div", { className: "wbsal-bar-value" }, value > 0 ? Math.round(value).toLocaleString("zh-CN") : ""),
            h("div", { className: "wbsal-bar-fill" + (i === topMonth ? " top" : ""), style: { height: height + "px" } }),
            h("div", { className: "wbsal-bar-label" }, ""));
        })),
        h("div", { className: "wbsal-axis" }, monthly.map(function (bucket) { return h("span", { key: bucket.month }, bucket.month); })),
        h("div", { className: "wbsal-chart-foot" },
          h("span", { className: "wbsal-legend" }, h("i", null), "有记录月份", h("i", { className: "soft" }), "其他月份"),
          h("span", null, "单位：元 · 按发薪日期归属月份 · 当前口径 " + metricLabel))),

      h("div", { className: "wbsal-card wbsal-section" },
        h("div", { className: "wbsal-section-head" },
          h("h3", null, "月度趋势对比"),
          seriesSwitch(LINE_SERIES, visible, toggleSeries, "折线显示开关")),
        h("div", { className: "wbsal-linechart" },
          renderChart(LINE_SERIES, visible, "月度实发/应发/基本/绩效/补贴/绩效奖惩折线图", hover, setHover),
          renderTip(LINE_SERIES, visible, hover)),
        anyShown(LINE_SERIES, visible) ? null
          : h("div", { className: "wbsal-chart-hint" }, "六条线都关掉了，点上方「实发 / 应发 / 基本 / 绩效 / 补贴 / 绩效奖惩」任意一个恢复显示"),
        h("div", { className: "wbsal-chart-foot" },
          h("span", null, "六条线可点上方标签单独开关 · 鼠标移到某个月份看该月全部维度"),
          h("span", null, "单位：元 · 仅连接有记录的月份"))),

      h("div", { className: "wbsal-card wbsal-section" },
        h("div", { className: "wbsal-section-head" },
          h("h3", null, "社保与个税"),
          h("span", null, "年度合计 " + F.money(DEDUCT_TOTAL_ALL) + " · 占应发 " + (data.grossTotal ? Math.round((DEDUCT_TOTAL_ALL / data.grossTotal) * 100) : 0) + "%")),
        h("div", { className: "wbsal-social" }, F.SOCIAL_KEYS.concat(["incomeTax"]).map(function (key) {
          var amount = key === "incomeTax" ? (data.incomeTaxTotal || 0) : ((data.social && data.social[key]) || 0);
          var share = DEDUCT_TOTAL_ALL ? Math.round((amount / DEDUCT_TOTAL_ALL) * 100) : 0;
          return h("div", { key: key, className: "wbsal-social-item" },
            h("span", null, F.LABELS[key]),
            h("b", null, F.money(amount)),
            h("em", null, "占社保与个税 " + share + "%"));
        })),
        h("div", { className: "wbsal-social-foot" }, seriesSwitch(DEDUCT_SERIES, socialVisible, toggleSocial, "社保与个税折线显示开关")),
        h("div", { className: "wbsal-linechart" },
          renderChart(DEDUCT_SERIES, socialVisible, "月度养老/医疗/失业/公积金/个税折线图", socialHover, setSocialHover),
          renderTip(DEDUCT_SERIES, socialVisible, socialHover)),
        anyShown(DEDUCT_SERIES, socialVisible) ? null
          : h("div", { className: "wbsal-chart-hint" }, "所有线都关掉了，点上方「养老 / 医疗 / 失业 / 公积金 / 个税 / 合计」任意一个恢复显示"),
        h("div", { className: "wbsal-chart-foot" },
          h("span", null, "五条线 + 虚线合计（五项之和）可单独开关 · 鼠标移到某个月份看该月分项"),
          h("span", null, "单位：元 · 仅连接有记录的月份"))),

      data.latestMonth ? h("div", { className: "wbsal-card wbsal-section" },
        h("div", { className: "wbsal-section-head" },
          h("h3", null, F.monthLabel(data.latestMonth.period) + " 收入与扣款构成"),
          h("span", null, "共 " + data.latestMonth.records + " 笔")),
        h("div", { className: "wbsal-comp-grid" },
          h("div", null,
            h("div", { className: "wbsal-group-title" }, "收入项 · 合计 " + F.money(latestBreakdown.income)),
            compRows(F.INCOME_KEYS, latestBreakdown.income, false)),
          h("div", null,
            h("div", { className: "wbsal-group-title" }, "扣款项 · 合计 " + F.money(deductionTotal)),
            compRows(F.PRETAX_KEYS.concat(F.SOCIAL_KEYS, F.TAX_KEYS), deductionTotal, true)))) : null);
  }

  return h("div", { className: "wbsal-page" },
    h("div", { className: "wbsal-toolbar wbsal-toolbar-plain" },
      h("div", { className: "wbsal-toolbar-end" },
        h("div", { className: "wbsal-seg" },
          h(C.Btn, { h: h, kind: "ghost", onClick: function () { setYear(Math.max(2000, year - 1)); } }, "‹"),
          h("span", { className: "wbsal-seg-year" }, year + " 年"),
          h(C.Btn, { h: h, kind: "ghost", onClick: function () { setYear(Math.min(2100, year + 1)); } }, "›")))),
    body);
};
