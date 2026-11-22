"use strict";
/**
 * 统计页：年度 / 季度 / 月度三条时间轴，加社保个税、同比与单笔分布。
 * 折线、直方图与骨架一律取 packages/addons/lib/stats-charts.cjs，
 * 本文件只负责取数、口径切换与卡片编排。
 */
module.exports = function Stats(props) {
  var h = props.h, React = props.React, api = props.api;
  var C = require("../ui/common.cjs");
  var F = require("../ui/fields.cjs");
  var P = require("./stats-parts.cjs");
  var charts = require("../../../lib/stats-charts.cjs");
  // 图表基件按自己的前缀注入样式：.wbsalc-*，与页面外壳的 .wbsal-* 互不干扰。
  var ch = React.useMemo(function () { return charts.makeCharts("wbsalc"); }, []);

  var yearState = React.useState(props.initialYear || new Date().getFullYear());
  var year = yearState[0], setYear = yearState[1];
  var basisState = React.useState(props.initialBasis || "arrival");
  var basis = basisState[0], setBasis = basisState[1];
  var basisLabel = basis === "income" ? "按所属月" : "按到账月";
  // 趋势金额口径：合计/最高/均值三条线都要跟着实发/应发切换。
  var amountState = React.useState(props.initialAmount || "net");
  var amount = amountState[0], setAmount = amountState[1];
  var amountLabel = amount === "gross" ? "应发" : "实发";
  var load = C.useLoad(React, api, "salary.stats", { year: year, basis: basis }, [year, basis]);
  var data = load.data;

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
  var recordedMonths = monthly.filter(function (bucket) { return bucket.records > 0; });

  // 六条月度线：实发 / 应发 / 基本 / 绩效 / 补贴 / 绩效奖惩，各自可单独开关。
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
  function toggleIn(state, series) {
    return function (key) {
      var next = {};
      series.forEach(function (m) { next[m.key] = state[0][m.key] !== false; });
      next[key] = !next[key];
      state[1](next);
    };
  }

  function round2(value) { return Math.round((Number(value) || 0) * 100) / 100; }
  function deductOf(bucket) {
    return round2((Number(bucket.pension) || 0) + (Number(bucket.medical) || 0) + (Number(bucket.unemployment) || 0)
      + (Number(bucket.housingFund) || 0) + (Number(bucket.incomeTax) || 0));
  }
  function seriesValue(m, bucket) {
    if (typeof m.get === "function") return m.get(bucket);
    return Number(bucket[m.key]) || 0;
  }
  var DEDUCT_TOTAL_ALL = round2(((data && data.socialTotal) || 0) + ((data && data.incomeTaxTotal) || 0));
  var DEDUCT_SERIES = F.SOCIAL_KEYS.map(function (key, index) {
    return { key: key, label: F.LABELS[key], tone: "s" + (index + 1) };
  }).concat([
    { key: "incomeTax", label: "个税", tone: "s5" },
    { key: "deductTotal", label: "合计", tone: "sum", get: deductOf },
  ]);
  var socialState = React.useState(Object.assign({ pension: true, medical: true, unemployment: true, housingFund: true, incomeTax: true, deductTotal: true }, props.initialSocialVisible || {}));
  var socialVisible = socialState[0];

  // 每组图各记一份悬停月份（1–12），互不干扰；画图时再换算成折线里的下标，
  // 这样「只连接有记录的月份」不会让 external 传入的月份号错位。
  var hoverState = React.useState(typeof props.initialHover === "number" ? props.initialHover : null);
  var socialHoverState = React.useState(typeof props.initialSocialHover === "number" ? props.initialSocialHover : null);
  var yearHoverState = React.useState(null);
  var quarterHoverState = React.useState(null);
  var yoyHoverState = React.useState(null);

  function monthIndexOf(value) {
    if (typeof value !== "number") return null;
    for (var i = 0; i < recordedMonths.length; i += 1) {
      if (recordedMonths[i].month === value) return i;
    }
    return null;
  }
  function monthOfIndex(index) {
    if (index === null || index === undefined || !recordedMonths[index]) return null;
    return recordedMonths[index].month;
  }

  function sumSeries() {
    return [
      { key: "total", label: "合计", tone: "s1" },
      { key: "max", label: "单笔最高", tone: "s3" },
      { key: "avg", label: "单笔均值", tone: "s2" },
    ];
  }
  var SUM_SERIES = sumSeries();
  var yearVisibleState = React.useState({ total: true, max: true, avg: true });
  var quarterVisibleState = React.useState({ total: true, max: true, avg: true });
  var yoyVisibleState = React.useState({ now: true, prior: true });
  var YOY_SERIES = [
    { key: "now", label: year + " 年", tone: "s1" },
    { key: "prior", label: (year - 1) + " 年", tone: "s2" },
  ];

  /** 把后端的年度/季度聚合摊平成折线要的 {bucket,total,max,avg}。 */
  function flatten(list, suffix) {
    return (list || []).map(function (item) {
      return {
        bucket: item.bucket,
        count: item.count || 0,
        total: Number(item[amount + "Total"] !== undefined ? item[amount + "Total"] : 0) || 0,
        max: Number(item[amount + "Max"] !== undefined ? item[amount + "Max"] : 0) || 0,
        avg: Number(item[amount + "Avg"] !== undefined ? item[amount + "Avg"] : 0) || 0,
        suffix: suffix,
      };
    });
  }
  var yearlyRows = flatten(data && data.yearly, "年");
  var quarterRows = flatten(data && data.quarterly, "");
  // 去年同月按月份号对齐；后端只给有记录的月份，不能按下标直接取。
  var priorByMonth = {};
  ((data && data.priorMonthly) || []).forEach(function (item) { priorByMonth[item.month] = item; });
  var yoyRows = (data && data.monthly || []).map(function (bucket) {
    var prior = priorByMonth[bucket.month] || {};
    return {
      bucket: bucket.period || year + "-" + String(bucket.month).padStart(2, "0"),
      month: bucket.month,
      count: bucket.records || 0,
      now: amount === "gross" ? Number(bucket.grossPay) || 0 : Number(bucket.netPay) || 0,
      prior: amount === "gross" ? Number(prior.grossPay) || 0 : Number(prior.netPay) || 0,
      priorRecords: prior.records || 0,
    };
  }).filter(function (row) { return row.count > 0 || row.prior > 0; });

  function money(v) { return F.money(v); }
  // 纵轴刻度用「万」收口，避免四位数金额把坐标轴撑爆。
  function axisFmt(v) {
    var n = Number(v) || 0;
    if (Math.abs(n) >= 10000) return Number((n / 10000).toFixed(1)) + "万";
    return String(Math.round(n));
  }
  function monthLabel(bucket) { return String(bucket).slice(5) + " 月"; }
  function quarterLabel(bucket) { return String(bucket).replace("-Q", " Q"); }

  var yearNet = Number(data && data.netTotal) || 0;
  var yearGross = Number(data && data.grossTotal) || 0;
  var yearTax = Number(data && data.incomeTaxTotal) || 0;
  var yearSocial = Number(data && data.socialTotal) || 0;
  var yearMax = 0, yearMin = null;
  recordedMonths.forEach(function (bucket) {
    var value = Number(bucket.netPay) || 0;
    if (value > yearMax) yearMax = value;
    if (value > 0 && (yearMin === null || value < yearMin)) yearMin = value;
  });
  var mom = data && data.mom;
  var momText = mom && mom.percent !== null && mom.percent !== undefined
    ? (mom.percent >= 0 ? "+" : "") + mom.percent + "%"
    : "—";

  var body;
  if (load.loading || (data && (data.year !== year || data.basis !== basis))) {
    body = h("div", { className: "wbsal-card" }, h(ch.Skeleton, { text: "加载中…" }));
  } else if (!data) {
    body = h("div", { className: "wbsal-card wbsal-empty" },
      h("strong", null, "统计加载失败"),
      h("span", null, load.error || "请稍后重试"),
      h("div", { className: "wbsal-empty-actions" }, h(C.Btn, { h: h, onClick: function () { load.refresh(); } }, "重试")));
  } else {
    var hasYear = data.records > 0;
    var latest = data.latestMonth;
    var latestBreakdown = latest && latest.breakdown ? latest.breakdown : null;
    var deductionTotal = Number(data.deductionTotal) || 0;
    var sections = [];

    // ① 年度趋势：跨全部有记录的年份，不随顶部年份切换而变。
    sections.push(P.trendCard({
      h: h, CH: ch, lang: props.lang, title: "年度趋势",
      note: "全部年份 · 三条线均按" + amountLabel,
      series: SUM_SERIES, rows: yearlyRows, visible: yearVisibleState[0],
      onToggle: toggleIn(yearVisibleState, SUM_SERIES),
      hover: yearHoverState[0], onHover: yearHoverState[1],
      fmt: money,
      label: function (row) { return row.bucket + " 年"; },
      tipTitle: function (row) { return row.bucket + " 年 · " + amountLabel; },
      tipRows: function (row) {
        return [
          { key: "total", label: "合计", tone: "s1", value: row.total },
          { key: "max", label: "单笔最高", tone: "s3", value: row.max },
          { key: "avg", label: "单笔均值", tone: "s2", value: row.avg },
        ];
      },
      tipNote: function (row) { return "共 " + row.count + " 笔"; },
      ariaLabel: "年度合计、单笔最高与单笔均值折线图",
      emptyText: "还没有跨年度的工资记录",
      allOffHint: "三条线都关掉了，点上方「合计 / 单笔最高 / 单笔均值」任意一个恢复显示",
      footLeft: "每条线可点上方标签单独开关 · 鼠标移到某一年看合计、最高与均值",
      footRight: "单位：元 · " + basisLabel,
      height: 200,
    }));

    // ② 季度趋势：只画真实有记录的季度，未过完的季度不补 0。
    sections.push(P.trendCard({
      h: h, CH: ch, lang: props.lang, title: "季度趋势",
      note: "最近 8 个有记录的季度",
      series: SUM_SERIES, rows: quarterRows, visible: quarterVisibleState[0],
      onToggle: toggleIn(quarterVisibleState, SUM_SERIES),
      hover: quarterHoverState[0], onHover: quarterHoverState[1],
      fmt: money,
      label: function (row) { return quarterLabel(row.bucket); },
      tipTitle: function (row) { return quarterLabel(row.bucket) + " · " + amountLabel; },
      tipRows: function (row) {
        return [
          { key: "total", label: "合计", tone: "s1", value: row.total },
          { key: "max", label: "单笔最高", tone: "s3", value: row.max },
          { key: "avg", label: "单笔均值", tone: "s2", value: row.avg },
        ];
      },
      tipNote: function (row) { return "共 " + row.count + " 笔"; },
      ariaLabel: "季度合计、单笔最高与单笔均值折线图",
      emptyText: "还没有带日期的工资记录",
      allOffHint: "三条线都关掉了，点上方「合计 / 单笔最高 / 单笔均值」任意一个恢复显示",
      footLeft: "季度按" + (basis === "income" ? "工资所属期" : "到账日期") + "归集 · 未来季度不画 0",
      footRight: "单位：元 · " + amountLabel,
      height: 200,
    }));

    if (hasYear) {
      // ③ KPI：年度四个口径 + 最高/最低单月。
      sections.push(h("div", { key: "kpi", className: "wbsal-kpis" },
        P.kpi(h, "年度实发合计", money(yearNet), data.records + " 笔 · 覆盖 " + data.months + " 个月"),
        P.kpi(h, "年度应发合计", money(yearGross), "个税 " + money(yearTax) + " · 五险一金 " + money(yearSocial)),
        P.kpi(h, "月均实发", money(data.avgNetPay), "单笔最高 " + money(yearMax)),
        P.kpi(h, "社保与个税", money(DEDUCT_TOTAL_ALL), yearGross ? "占应发 " + Math.round((DEDUCT_TOTAL_ALL / yearGross) * 100) + "%" : "无应发记录"),
        P.kpi(h, "环比上月", momText, data.previousMonth ? F.monthLabel(data.previousMonth.period) + " → " + F.monthLabel((data.latestMonth || {}).period || "") : "暂无上月数据"),
        P.kpi(h, "最高 / 最低单月", money(yearMax) + " / " + money(yearMin === null ? 0 : yearMin), data.peakMonth ? "峰值 " + F.monthLabel(data.peakMonth.period) : "暂无记录")));

      // ④ 月度柱状图：保留原有六口径切换。
      sections.push(h("div", { key: "bar", className: "wbsal-card wbsal-section" },
        h("div", { className: "wbsal-section-head" },
          h("h3", null, "月度" + metricLabel + "分布"),
          h("div", { className: "wbsal-section-tools" },
            h("span", { className: "wbsal-section-note" }, "最高 " + (data.peakMonth ? F.monthLabel(data.peakMonth.period) : "—")),
            P.segGroup(h, METRICS.map(function (m) { return [m.key, m.label]; }), metric, setMetric, "柱状图口径"))),
        P.barChart({
          h: h, F: F, rows: monthly, value: function (bucket) { return Number(bucket[metric]) || 0; },
          metricLabel: metricLabel, basisLabel: basisLabel + " · " + year + " 年",
        })));

      // ⑤ 月度六线：六条线可单独开关。
      sections.push(P.trendCard({
        h: h, CH: ch, lang: props.lang, title: "月度趋势对比",
        note: "六条口径线",
        series: LINE_SERIES, rows: recordedMonths, visible: visible,
        onToggle: toggleIn(visibleState, LINE_SERIES),
        hover: monthIndexOf(hoverState[0]),
        onHover: function (index) { hoverState[1](monthOfIndex(index)); },
        fmt: money,
        label: function (row) { return F.monthLabel(row.period || year + "-" + String(row.month).padStart(2, "0")); },
        tipTitle: function (row) { return F.monthLabel(row.period || year + "-" + String(row.month).padStart(2, "0")) + " 收入面"; },
        tipRows: function (row) {
          return LINE_SERIES.map(function (m) { return { key: m.key, label: m.label, tone: m.tone, value: seriesValue(m, row) }; });
        },
        tipNote: function (row) { return "共 " + row.records + " 笔"; },
        ariaLabel: "月度实发/应发/基本/绩效/补贴/绩效奖惩折线图",
        emptyText: year + " 年还没有工资记录",
        allOffHint: "六条线都关掉了，点上方的「实发 / 应发 / 基本 / 绩效 / 补贴 / 绩效奖惩」任意一个恢复显示",
        footLeft: "六条线可单独开关 · 鼠标移到某个月份看该月全部维度",
        footRight: "单位：元 · 仅连接有记录的月份",
        height: 220,
      }));

      // ⑥ 社保与个税：五条分项线 + 合计虚线。
      sections.push(h("div", { key: "social", className: "wbsal-card wbsal-section" },
        h("div", { className: "wbsal-section-head" },
          h("h3", null, "社保与个税"),
          h("div", { className: "wbsal-section-tools" },
            h("span", { className: "wbsal-section-note" }, "年度合计 " + money(DEDUCT_TOTAL_ALL)),
            P.seriesSwitch(h, DEDUCT_SERIES, socialVisible, toggleIn(socialState, DEDUCT_SERIES), "社保与个税折线显示开关"))),
        h("div", { className: "wbsal-social" }, F.SOCIAL_KEYS.concat(["incomeTax"]).map(function (key) {
          var amount = key === "incomeTax" ? yearTax : Number((data.social || {})[key]) || 0;
          var share = DEDUCT_TOTAL_ALL ? Math.round((amount / DEDUCT_TOTAL_ALL) * 100) : 0;
          return h("div", { key: key, className: "wbsal-social-item" },
            h("span", null, F.LABELS[key]),
            h("b", null, money(amount)),
            h("em", null, "占社保与个税 " + share + "%"));
        })),
        h("div", { className: "wbsal-linechart" }, h(ch.Trend, {
          data: recordedMonths, series: DEDUCT_SERIES.map(function (m) { return { key: m.key, label: m.label, className: m.tone, color: P.TONE_COLOR[m.tone] }; }),
          lang: props.lang, height: 200, showLegend: false,
          visible: socialVisible, active: monthIndexOf(socialHoverState[0]),
          onHover: function (index) { socialHoverState[1](monthOfIndex(index)); },
          format: money,
          label: function (row) { return F.monthLabel(row.period || year + "-" + String(row.month).padStart(2, "0")); },
          note: function (row) { return row.records + " 笔"; },
          aria: "月度养老/医疗/失业/公积金/个税折线图",
          emptyText: "还没有社保与个税记录",
        })),
        P.anyShown(DEDUCT_SERIES, socialVisible) ? null
          : h("div", { className: "wbsal-chart-hint" }, "所有线都关掉了，点上方「养老 / 医疗 / 失业 / 公积金 / 个税 / 合计」任意一个恢复显示"),
        h("div", { className: "wbsal-chart-foot" },
          h("span", null, "五条分项线 + 合计线可单独开关 · 合计为五项之和"),
          h("span", null, "单位：元 · " + basisLabel))));

      // ⑦ 同比：今年 vs 去年同月，按实发/应发口径。
      sections.push(P.trendCard({
        h: h, CH: ch, lang: props.lang, title: "同比对照",
        note: year + " 年 vs " + (year - 1) + " 年",
        series: YOY_SERIES, rows: yoyRows, visible: yoyVisibleState[0],
        onToggle: toggleIn(yoyVisibleState, YOY_SERIES),
        hover: yoyHoverState[0], onHover: yoyHoverState[1],
        fmt: money,
        label: function (row) { return row.month + " 月"; },
        tipTitle: function (row) { return row.month + " 月 · " + amountLabel + "同比"; },
        tipRows: function (row) {
          return [
            { key: "now", label: year + " 年", tone: "s1", value: row.now },
            { key: "prior", label: (year - 1) + " 年", tone: "s2", value: row.prior },
          ];
        },
        tipNote: function (row) { return "今年 " + row.count + " 笔 · 去年 " + row.priorRecords + " 笔"; },
        ariaLabel: "今年与去年同月实发对照折线图",
        emptyText: "这两年都还没有工资记录",
        allOffHint: "两条线都关掉了，点上方年份标签恢复显示",
        footLeft: "去年同月按同口径汇总 · 只画两年里至少有一笔的月份",
        footRight: "单位：元 · " + amountLabel,
        height: 200,
      }));

      // ⑧ 单笔分布：看看收入落在哪些档。
      sections.push(h("div", { key: "dist", className: "wbsal-card wbsal-section" },
        h("div", { className: "wbsal-section-head" },
          h("h3", null, "单笔实发分布"),
          h("span", { className: "wbsal-section-note" }, "共 " + data.records + " 笔")),
        h(ch.Histogram, {
          data: (data.distribution || []).map(function (item) { return { key: item.key, label: item.label, count: item.count || 0 }; }),
          lang: props.lang,
          aria: "单笔实发金额分布直方图",
        }),
        h("div", { className: "wbsal-chart-foot" },
          h("span", null, "按单笔实发金额分五档，档位固定便于跨年对比"),
          h("span", null, "计数单位：笔"))));

      // ⑨ 最近月构成：收入项与扣款项两栏。
      if (latest && latestBreakdown) {
        sections.push(h("div", { key: "comp", className: "wbsal-card wbsal-section" },
          h("div", { className: "wbsal-section-head" },
            h("h3", null, F.monthLabel(latest.period) + " 收入与扣款构成"),
            h("span", { className: "wbsal-section-note" }, "共 " + latest.records + " 笔")),
          h("div", { className: "wbsal-comp-grid" },
            h("div", null,
              h("div", { className: "wbsal-group-title" }, "收入项 · 合计 " + money(latestBreakdown.income)),
              P.compRows(h, F, latestBreakdown.fields, F.INCOME_KEYS, latestBreakdown.income, false)),
            h("div", null,
              h("div", { className: "wbsal-group-title" }, "扣款项 · 合计 " + money(deductionTotal)),
              P.compRows(h, F, latestBreakdown.fields, F.PRETAX_KEYS.concat(F.SOCIAL_KEYS, F.TAX_KEYS), deductionTotal, true)))));
      }
    } else {
      sections.push(h("div", { key: "empty", className: "wbsal-card wbsal-empty" },
        h("strong", null, year + " 年还没有工资记录"),
        h("span", null, "上面两张跨年度趋势仍按全部历史数据展示；换一个年份或先记一笔工资。")));
    }
    body = h("div", { className: "wbsal-stack" }, sections);
  }

  return h("div", { className: "wbsal-page" },
    h("div", { className: "wbsal-toolbar wbsal-toolbar-plain" },
      h("div", { className: "wbsal-toolbar-end" },
        h("div", { className: "wbsal-metric", role: "group", "aria-label": "工资归月口径" },
          [["arrival", "按到账月"], ["income", "按所属月"]].map(function (option) {
            return h("button", {
              key: option[0], type: "button", "aria-pressed": basis === option[0],
              className: basis === option[0] ? "on" : "",
              onClick: function () { setBasis(option[0]); hoverState[1](null); socialHoverState[1](null); },
            }, option[1]);
          })),
        P.segGroup(h, [["net", "实发"], ["gross", "应发"]], amount, setAmount, "趋势金额口径"),
        h("div", { className: "wbsal-seg" },
          h(C.Btn, { h: h, kind: "ghost", onClick: function () { setYear(Math.max(2000, year - 1)); } }, "‹"),
          h("span", { className: "wbsal-seg-year" }, year + " 年"),
          h(C.Btn, { h: h, kind: "ghost", onClick: function () { setYear(Math.min(2100, year + 1)); } }, "›")))),
    basis === "income" && data && data.year === year && data.basis === basis && data.unassignedRecords > 0
      ? h(C.Notice, { h: h, text: "全部年份共 " + data.unassignedRecords + " 笔工资未填写所属期，未计入所属月统计。" })
      : null,
    data && (data.year !== year || data.basis !== basis) ? null : body,
    load.error ? h(C.Notice, { h: h, kind: "error", text: load.error }) : null);
};
