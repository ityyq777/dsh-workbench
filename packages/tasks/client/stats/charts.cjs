// 统计页通用自绘图表（无第三方图表库）。
// 每个业务包各存一份，避免 npm 安装后跨包相对引用失效。
var React = require("react");
var h = React.createElement;
var DP = require("../../../lib/date-picker.cjs");
var LIB = require("../../../lib/stats-charts.cjs");

// 全部取自 DSH 主题 token（--dsw-alias-*），深浅色主题下自动切换，不要写死色值。
var COLORS = [
  "var(--dsw-alias-state-business-primary, #4f6ef7)",
  "var(--dsw-alias-state-success-primary, #2f9e6e)",
  "var(--dsw-alias-state-warn-primary, #d99100)",
  "var(--dsw-alias-state-error-primary, #d9534f)",
  "var(--dsw-alias-state-done-primary, #7c5cff)",
  "var(--dsw-alias-state-idle-primary, #8f959e)",
];

// 按状态含义取色，不依赖序列位置；零值项仍与图例使用同一颜色。
var STATUS_COLORS = { "0": COLORS[0], "1": COLORS[3], "2": COLORS[1], "4": COLORS[2] };

function css(prefix) {
  return [
    ".@-table-link{border:0;padding:0;background:none;font:inherit;color:var(--dsw-alias-brand-primary,#4f6ef7);text-align:left;cursor:pointer}.@-table-link:hover{text-decoration:underline}.@-table-link:focus-visible{outline:2px solid currentColor;outline-offset:3px}.@-recent-difficulty{white-space:nowrap}.@-recent-reason{opacity:.65}",
    ".@-stats{display:flex;flex-direction:column;gap:18px;padding:4px 2px 24px;color:var(--dsw-alias-label-primary,#1f2329)}",
    ".@-stoolbar{display:flex;align-items:center;gap:8px;flex-wrap:wrap}",
    ".@-seg{display:inline-flex;border:1px solid var(--dsw-alias-border-l2,#e5e6eb);border-radius:9px;overflow:hidden;background:var(--dsw-alias-bg-layer-1,#fff)}",
    ".@-seg button{appearance:none;border:0;background:transparent;color:var(--dsw-alias-label-secondary,#646a73);font-size:12px;padding:6px 10px;cursor:pointer;white-space:nowrap}",
    ".@-seg button.@-on{background:var(--dsw-alias-brand-primary,#4f6ef7);color:var(--dsw-alias-label-primary-inverted,#fff)}",
    ".@-range{display:inline-flex;align-items:center;gap:4px}",
    ".@-date{appearance:none;border:0;background:transparent;color:var(--dsw-alias-label-secondary,#646a73);font-family:inherit;font-size:12px;padding:4px 2px;width:116px;outline:none}",
    ".@-date::-webkit-calendar-picker-indicator{opacity:.55;cursor:pointer}",
    ".@-dash{color:var(--dsw-alias-label-tertiary,#8f959e);font-size:12px}",
    ".@-clear{appearance:none;border:0;background:transparent;color:var(--dsw-alias-label-tertiary,#8f959e);font-size:14px;line-height:1;padding:2px 4px;cursor:pointer;border-radius:4px}",
    ".@-clear:hover{color:var(--dsw-alias-state-error-primary,#d9534f);background:var(--dsw-alias-bg-skeleton,#f2f3f5)}",
    ".@-hint{font-size:11px;color:var(--dsw-alias-state-error-primary,#d9534f);white-space:nowrap}",
    ".@-ghost{appearance:none;border:1px solid var(--dsw-alias-border-l2,#e5e6eb);background:var(--dsw-alias-bg-layer-1,#fff);color:var(--dsw-alias-label-secondary,#646a73);border-radius:8px;font-size:12px;padding:6px 10px;cursor:pointer}",
    ".@-ghost:hover{border-color:var(--dsw-alias-brand-primary,#4f6ef7);color:var(--dsw-alias-brand-primary,#4f6ef7)}",
    ".@-muted{color:var(--dsw-alias-label-tertiary,#8f959e);font-size:12px}",
    // 难度分布的口径切换：轻量 tablist，视觉上与页首时间范围分段保持一致。
    ".@-dims{display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin:0 0 8px}",
    ".@-dims button{appearance:none;border:1px solid transparent;background:transparent;color:inherit;font:inherit;font-size:11.5px;padding:3px 8px;border-radius:6px;cursor:pointer;opacity:.7;white-space:nowrap}",
    ".@-dims button:hover{background:var(--dsw-alias-bg-skeleton,#f2f3f5);opacity:1}",
    ".@-dims button[aria-selected=true]{border-color:var(--dsw-alias-border-l2,#e5e6eb);background:var(--dsw-alias-bg-skeleton,#f2f3f5);font-weight:600;opacity:1}",
    ".@-dims button:focus-visible{outline:2px solid var(--dsw-alias-brand-primary,#4f6ef7);outline-offset:1px}",
    ".@-sgrid{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:12px}",
    // 分区容器：把 12 栅格切成「一眼看清 → 结构 → 风险 → 排行 → 明细」几段，
    // 每段自己一条标题带，卡片之间仍按 span 排；段与段之间用更大的间距制造阅读停顿。
    ".@-sect{grid-column:span 12;display:flex;flex-direction:column;gap:8px;min-width:0}",
    ".@-sect-head{display:flex;align-items:baseline;gap:10px;flex-wrap:wrap;padding:2px 2px 0}",
    ".@-sect-title{margin:0;font-size:13px;font-weight:650;letter-spacing:.2px;color:var(--dsw-alias-label-primary,#1f2329)}",
    ".@-sect-note{font-size:11px;color:var(--dsw-alias-label-tertiary,#8f959e)}",
    ".@-sect-body{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:12px;min-width:0}",
    ".@-scard{grid-column:span 6;min-width:0;background:var(--dsw-alias-bg-layer-1,#fff);border:1px solid var(--dsw-alias-border-l2,#e5e6eb);border-radius:12px;padding:14px 16px}",
    ".@-span-3{grid-column:span 3}.@-span-4{grid-column:span 4}.@-span-6{grid-column:span 6}.@-span-8{grid-column:span 8}.@-span-12{grid-column:span 12}",
    ".@-chead{display:flex;align-items:baseline;gap:8px;margin-bottom:10px;flex-wrap:wrap}",
    ".@-ctitle{font-size:13px;font-weight:600;color:var(--dsw-alias-label-primary,#1f2329)}",
    ".@-cnote{font-size:11px;color:var(--dsw-alias-label-tertiary,#8f959e)}",
    ".@-kpis{grid-column:span 12;display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:12px}",
    // 核心指标与次级指标分两行：核心 4 张给足字号，次级 4 张收紧，避免 8 张 KPI 抢同一层的视觉重量。
    ".@-kpis-main{grid-template-columns:repeat(4,minmax(0,1fr))}",
    ".@-kpis-sub{grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}",
    ".@-kpi-lg{padding:14px 16px}",
    ".@-kpi-lg .@-kpi-v{font-size:30px}",
    ".@-kpi-sm{padding:9px 12px}",
    ".@-kpi-sm .@-kpi-l{font-size:11.5px}",
    ".@-kpi-sm .@-kpi-v{font-size:19px}",
    ".@-kpi-sm .@-kpi-h{font-size:10.5px;margin-top:1px}",
    ".@-kpi{background:var(--dsw-alias-bg-layer-1,#fff);border:1px solid var(--dsw-alias-border-l2,#e5e6eb);border-radius:12px;padding:12px 14px;min-width:0}",
    ".@-kpi-l{font-size:12px;color:var(--dsw-alias-label-tertiary,#8f959e);display:flex;align-items:center;gap:6px}",
    ".@-kpi-v{font-size:26px;line-height:1.25;font-weight:650;margin-top:4px;font-variant-numeric:tabular-nums}",
    ".@-kpi-u{font-size:12px;font-weight:400;color:var(--dsw-alias-label-tertiary,#8f959e);margin-left:3px}",
    ".@-kpi-h{font-size:11px;color:var(--dsw-alias-label-tertiary,#8f959e);margin-top:3px}",
    ".@-kpi.@-kpi-tone-danger .@-kpi-v{color:var(--dsw-alias-state-error-primary,#d9534f)}",
    ".@-kpi.@-kpi-tone-warn .@-kpi-v{color:var(--dsw-alias-state-warn-primary,#d99100)}",
    ".@-kpi.@-kpi-tone-ok .@-kpi-v{color:var(--dsw-alias-state-success-primary,#2f9e6e)}",
    ".@-donut{display:flex;align-items:center;gap:16px;flex-wrap:wrap}",
    ".@-donut svg{flex:0 0 auto}",
    ".@-legend{display:flex;flex-direction:column;gap:7px;min-width:120px;flex:1}",
    ".@-leg{display:flex;align-items:center;gap:7px;font-size:12px;color:var(--dsw-alias-label-secondary,#646a73)}",
    ".@-dot{width:8px;height:8px;border-radius:50%;flex:0 0 auto}",
    ".@-leg b{margin-left:auto;font-weight:600;color:var(--dsw-alias-label-primary,#1f2329);font-variant-numeric:tabular-nums}",
    ".@-bars{display:flex;flex-direction:column;gap:9px}",
    ".@-bar{display:grid;grid-template-columns:minmax(72px,1.2fr) 3fr auto;gap:8px;align-items:center;font-size:12px}",
    ".@-bar-l{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--dsw-alias-label-secondary,#646a73)}",
    ".@-bar-t{display:block;height:8px;border-radius:6px;background:var(--dsw-alias-bg-skeleton,#f2f3f5);overflow:hidden}",
    ".@-bar-f{display:block;height:100%;border-radius:6px;background:var(--dsw-alias-state-business-primary,#4f6ef7);min-width:2px}",
    ".@-bar-v{font-variant-numeric:tabular-nums;color:var(--dsw-alias-label-primary,#1f2329);font-weight:600;min-width:34px;text-align:right}",
    ".@-stack{display:flex;flex-direction:column;gap:10px}",
    ".@-srow-l{font-size:12px;color:var(--dsw-alias-label-secondary,#646a73);margin-bottom:4px;display:flex}",
    ".@-srow-l b{margin-left:auto;color:var(--dsw-alias-label-primary,#1f2329);font-variant-numeric:tabular-nums}",
    ".@-strack{display:flex;height:10px;border-radius:6px;overflow:hidden;background:var(--dsw-alias-bg-skeleton,#f2f3f5)}",
    ".@-seg-f{height:100%}",
    ".@-hist{display:flex;align-items:flex-end;gap:8px;height:150px;padding-top:16px}",
    ".@-hbar{flex:1;display:flex;flex-direction:column;justify-content:flex-end;align-items:center;gap:5px;min-width:0;height:100%}",
    ".@-hbar-v{font-size:11px;color:var(--dsw-alias-label-secondary,#646a73);font-variant-numeric:tabular-nums}",
    ".@-hbar-f{width:100%;max-width:44px;border-radius:5px 5px 0 0;background:var(--dsw-alias-state-business-primary,#4f6ef7);min-height:2px}",
    ".@-hbar-l{font-size:11px;color:var(--dsw-alias-label-tertiary,#8f959e);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}",
    ".@-hbar-link{cursor:pointer;border-radius:6px;padding-top:2px}",
    ".@-hbar-link:hover{background:var(--dsw-alias-bg-skeleton,#f2f3f5)}",
    ".@-hbar-link:hover .@-hbar-l,.@-hbar-link:focus-visible .@-hbar-l{color:var(--dsw-alias-brand-primary,#4f6ef7)}",
    ".@-hbar-link:focus-visible{outline:2px solid var(--dsw-alias-brand-primary,#4f6ef7);outline-offset:2px}",
    ".@-trend{width:100%;height:auto;display:block}",
    ".@-tlegend{display:flex;gap:14px;flex-wrap:wrap;margin-top:6px;font-size:11px;color:var(--dsw-alias-label-tertiary,#8f959e)}",
    ".@-trend-wrap{position:relative}",
    ".@-trend-box{position:relative;border-radius:10px}",
    ".@-trend-box:focus-visible{outline:2px solid var(--dsw-alias-brand-primary,#4f6ef7);outline-offset:2px}",
    ".@-trend-tip{position:absolute;top:4px;z-index:3;pointer-events:none;display:flex;flex-direction:column;gap:2px;min-width:104px;padding:6px 8px;border:1px solid var(--dsw-alias-border-l2,#e5e6eb);border-radius:8px;background:var(--dsw-alias-bg-layer-1,#fff);box-shadow:0 6px 20px color-mix(in srgb,var(--dsw-alias-label-primary,#1f2329) 16%,transparent);font-size:11px;color:var(--dsw-alias-label-primary,#1f2329)}",
    ".@-tip-day{font-size:11.5px;margin-bottom:2px}",
    ".@-tip-row{display:flex;align-items:center;gap:6px;white-space:nowrap}",
    ".@-tip-name{color:var(--dsw-alias-label-secondary,#646a73)}",
    ".@-tip-row b{margin-left:auto;font-variant-numeric:tabular-nums}",
    ".@-tlegend-item{display:inline-flex;align-items:center;gap:5px;appearance:none;border:0;background:none;padding:2px 0;font:inherit;font-size:11px;color:inherit;cursor:pointer;border-radius:4px}",
    ".@-tlegend-item:hover:not(:disabled){color:var(--dsw-alias-label-primary,#1f2329)}",
    ".@-tlegend-item[aria-pressed=false]{opacity:.45}",
    ".@-tlegend-item[aria-pressed=false] .@-dot{background:transparent;border:1px solid currentColor}",
    ".@-tlegend-item:disabled{cursor:default}",
    ".@-tlegend-item:focus-visible{outline:2px solid var(--dsw-alias-brand-primary,#4f6ef7);outline-offset:2px}",
    ".@-dot-off{width:8px;height:8px;border-radius:50%;border:1px solid;flex:0 0 auto}",
    ".@-table-scroll{max-width:100%;overflow-x:auto}.@-table{width:100%;border-collapse:collapse;font-size:12px}",
    ".@-table th{text-align:left;font-weight:500;color:var(--dsw-alias-label-tertiary,#8f959e);padding:6px 8px;border-bottom:1px solid var(--dsw-alias-border-l2,#e5e6eb);white-space:nowrap}",
    ".@-table td{padding:7px 8px;border-bottom:1px solid var(--dsw-alias-border-l1,#f2f3f5);color:var(--dsw-alias-label-secondary,#646a73);vertical-align:top}",
    ".@-table tr:last-child td{border-bottom:0}",
    ".@-table th.@-num,.@-table td.@-num{text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap}",
    ".@-empty{padding:26px 8px;text-align:center;color:var(--dsw-alias-label-tertiary,#8f959e);font-size:12px}",
    ".@-err{display:flex;align-items:center;gap:10px;background:color-mix(in srgb,var(--dsw-alias-state-error-primary,#d9534f) 8%,transparent);border:1px solid color-mix(in srgb,var(--dsw-alias-state-error-primary,#d9534f) 30%,transparent);color:var(--dsw-alias-state-error-primary,#d9534f);border-radius:10px;padding:10px 12px;font-size:12px}",
    ".@-warnbar{grid-column:span 12;border:1px dashed var(--dsw-alias-state-warn-primary,#d99100);border-radius:10px;padding:9px 12px;font-size:12px;color:var(--dsw-alias-state-warn-primary,#d99100);background:color-mix(in srgb,var(--dsw-alias-state-warn-primary,#d99100) 6%,transparent)}",
    ".@-sk{height:14px;border-radius:6px;background:var(--dsw-alias-bg-skeleton,#f2f3f5);margin:7px 0;animation:@-pulse 1.2s ease-in-out infinite}",
    "@keyframes @-pulse{0%,100%{opacity:.55}50%{opacity:1}}",
    "@media (max-width:900px){.@-scard{grid-column:span 12}.@-span-3,.@-span-4,.@-span-6,.@-span-8{grid-column:span 12}.@-kpis,.@-kpis-main,.@-kpis-sub{grid-template-columns:repeat(2,minmax(0,1fr))}}",
    "@media (max-width:600px){.@-stats{padding-bottom:16px;gap:14px}.@-hist{height:130px}.@-kpi-v{font-size:22px}.@-kpi-lg .@-kpi-v{font-size:24px}.@-kpi-sm .@-kpi-v{font-size:18px}}",
    "@media (prefers-reduced-motion:reduce){.@-sk{animation:none}}",
    require("../../../lib/date-picker-styles.cjs")(prefix),
  ].join("\n").replace(/@-/g, prefix + "-");
}

function makeCharts(prefix) {
  if (typeof document !== "undefined" && !document.getElementById(prefix + "-charts-css")) {
    var el = document.createElement("style");
    el.id = prefix + "-charts-css";
    el.textContent = css(prefix);
    document.head.appendChild(el);
  }

  // 与站点/标签统计页完全一致的基础图元，统一来自 lib/stats-charts.cjs，避免三处各改一遍。
  var base = LIB.primitives(prefix);
  var num = base.num, pct = base.pct, timeText = base.timeText, dateText = base.dateText;
  var Donut = base.Donut, BarList = base.BarList, StackedRows = base.StackedRows;
  var ErrorBar = base.ErrorBar, Empty = base.Empty, Skeleton = base.Skeleton;


  function Card(props) {
    var cls = prefix + "-scard" + (props.span ? " " + prefix + "-span-" + props.span : "");
    return h("section", { className: cls },
      (props.title || props.right) ? h("div", { className: prefix + "-chead" },
        h("span", { className: prefix + "-ctitle" }, props.title),
        props.note ? h("span", { className: prefix + "-cnote" }, props.note) : null,
        props.right ? h("span", { style: { marginLeft: "auto" } }, props.right) : null,
      ) : null,
      props.children,
    );
  }

  // 分区容器：一条标题带 + 一个 12 栅格主体。区块标题用 h2，保证读屏与键盘用户能按标题跳读整页。
  function Section(props) {
    var body = props.children || [];
    var list = Array.isArray(body) ? body.filter(function (n) { return n !== null && n !== undefined && n !== false; }) : body;
    if (Array.isArray(list) && !list.length) return null;
    return h("section", { className: prefix + "-sect", "aria-label": props.title },
      h("div", { className: prefix + "-sect-head" },
        h("h2", { className: prefix + "-sect-title" }, props.title),
        props.note ? h("span", { className: prefix + "-sect-note" }, props.note) : null,
        props.right ? h("span", { className: prefix + "-sect-note", style: { marginLeft: "auto" } }, props.right) : null,
      ),
      h("div", { className: prefix + "-sect-body" }, list),
    );
  }

  function Kpi(props) {
    var tone = props.tone ? " " + prefix + "-kpi-tone-" + props.tone : "";
    var size = props.size === "lg" || props.size === "sm" ? " " + prefix + "-kpi-" + props.size : "";
    return h("div", { className: prefix + "-kpi" + size + tone },
      h("div", { className: prefix + "-kpi-l" }, props.label),
      h("div", { className: prefix + "-kpi-v" },
        props.value === null || props.value === undefined ? "—" : (typeof props.value === "number" ? num(props.lang, props.value) : props.value),
        props.unit ? h("span", { className: prefix + "-kpi-u" }, props.unit) : null,
      ),
      props.hint ? h("div", { className: prefix + "-kpi-h" }, props.hint) : null,
    );
  }




  function Trend(props) {
    var data = props.data || [];
    var series = props.series || [];
    // 与共享 Trend 同口径：按容器真实像素宽做 viewBox，避免 SVG 整体放大坐标轴文字。
    var size = base.useWidth();
    var width = Math.max(260, size[1] || 640);
    var height = props.height || 200;
    var left = 30, right = 10, top = 12, bottom = 24;
    var pw = width - left - right, ph = height - top - bottom;
    var ix = require("./trend-interaction.cjs");
    var hiddenS = React.useState({});
    var activeS = React.useState(null);
    var hidden = hiddenS[0];
    var active = activeS[0];
    var visible = ix.visibleSeries(series, hidden);
    // 量程只按可见序列算：关掉「发布」的尖峰后其余四条不会被压平。
    var max = ix.rangeMax(data, series, hidden);
    function x(i) { return left + (data.length <= 1 ? pw / 2 : (i / (data.length - 1)) * pw); }
    function y(v) { return top + ph - (Number(v || 0) / max) * ph; }
    var ticks = [];
    for (var t = 0; t <= 3; t++) ticks.push(Math.round((max / 3) * t));
    var labelIdx = [];
    if (data.length) {
      var step = Math.max(1, Math.floor(data.length / 5));
      for (var i = 0; i < data.length; i += step) labelIdx.push(i);
      if (labelIdx[labelIdx.length - 1] !== data.length - 1) labelIdx.push(data.length - 1);
    }
    var aria = ix.summaryText(data, series, hidden, "，");
    // 命中带：每个桶一条透明矩形，宽度取相邻间距，覆盖整个绘图高度。
    var band = data.length > 1 ? pw / (data.length - 1) : pw;
    function bandBox(i) {
      var bx = Math.max(left, x(i) - band / 2);
      return { x: bx, width: Math.max(1, Math.min(width - right, x(i) + band / 2) - bx) };
    }
    var tipLeftPct = (left / width) * 100, tipWidthPct = (pw / width) * 100;
    var activeRow = active !== null && data[active] ? data[active] : null;
    var anchor = activeRow ? ix.tipAnchor((x(active) - left) / pw, tipLeftPct, tipWidthPct) : null;
    var tip = activeRow ? h("div", {
      className: prefix + "-trend-tip",
      style: { left: anchor.left + "%", transform: ix.tipTransform(anchor.flip) },
    },
      h("b", { className: prefix + "-tip-day" }, String(activeRow.bucket)),
      ix.tipRows(data, series, hidden, active).map(function (r) {
        return h("span", { key: r.key, className: prefix + "-tip-row" },
          h("span", { className: prefix + "-dot", style: { background: r.color } }),
          h("span", { className: prefix + "-tip-name" }, r.label),
          h("b", null, num(props.lang, r.value)));
      })) : null;
    return h("div", { className: prefix + "-trend-wrap", ref: size[0] },
      h("div", {
        className: prefix + "-trend-box",
        role: "group",
        tabIndex: 0,
        "aria-label": props.aria || aria,
        onMouseLeave: function () { activeS[1](null); },
        onBlur: function () { activeS[1](null); },
        onKeyDown: function (e) {
          if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
            e.preventDefault();
            activeS[1](ix.moveIndex(active, e.key === "ArrowRight" ? 1 : -1, data.length));
          } else if (e.key === "Escape") {
            activeS[1](null);
          }
        },
      },
      h("svg", { className: prefix + "-trend", viewBox: "0 0 " + width + " " + height, width: width, height: height, "aria-hidden": "true" },
        ticks.map(function (v, i) {
          return h("g", { key: "t" + i },
            h("line", { x1: left, x2: width - right, y1: y(v), y2: y(v), stroke: "var(--dsw-alias-border-l1,#f2f3f5)", strokeWidth: 1 }),
            h("text", { x: left - 6, y: y(v) + 3, textAnchor: "end", fontSize: 11, fill: "var(--dsw-alias-label-tertiary,#8f959e)" }, num(props.lang, v)),
          );
        }),
        activeRow ? h("line", {
          className: prefix + "-trend-guide",
          x1: x(active), x2: x(active), y1: top, y2: top + ph,
          stroke: "var(--dsw-alias-border-l2,#c9cdd4)", strokeWidth: 1, strokeDasharray: "3 3",
        }) : null,
        visible.map(function (s, si) {
          var pts = data.map(function (d, i) { return x(i) + "," + y(d[s.key]); }).join(" ");
          return h("g", { key: s.key },
            h("polyline", { points: pts, fill: "none", stroke: s.color || COLORS[si % COLORS.length], strokeWidth: 2, strokeLinejoin: "round", strokeLinecap: "round" }),
            data.map(function (d, i) {
              // 数据点多时仍全部渲染，只是不画点；命中带保证每个日期都能取值。
              if (data.length > 40 && i % 3 !== 0 && i !== active) return null;
              return h("circle", { key: i, cx: x(i), cy: y(d[s.key]), r: i === active ? 4 : 2.4, fill: s.color || COLORS[si % COLORS.length] });
            }),
          );
        }),
        labelIdx.map(function (i) {
          // 末点标签靠右对齐，否则「11-10」会被 viewBox 右边界裁成「11-1C」。
          var textAnchor = i === data.length - 1 ? "end" : "middle";
          return h("text", { key: "x" + i, x: x(i), y: height - 6, textAnchor: textAnchor, fontSize: 9, fill: "var(--dsw-alias-label-tertiary,#8f959e)" }, String(data[i].bucket).slice(5));
        }),
        data.map(function (d, i) {
          var box = bandBox(i);
          return h("rect", {
            key: "h" + i, x: box.x, y: top, width: box.width, height: ph + 8, fill: "transparent",
            style: { cursor: "crosshair" },
            onMouseEnter: function () { activeS[1](i); },
            onTouchStart: function () { activeS[1](i); },
          });
        }),
      ),
      tip),
      h("div", { className: prefix + "-tlegend" }, series.map(function (s, i) {
        var on = ix.isVisible(hidden, s.key);
        var last = on && ix.visibleSeries(series, hidden).length <= 1;
        return h("button", {
          key: s.key, type: "button", className: prefix + "-tlegend-item",
          "aria-pressed": on ? "true" : "false", disabled: last,
          title: last ? (props.lang === "en" ? "At least one series stays visible" : "至少要保留一条曲线") : undefined,
          onClick: function () {
            var r = ix.toggle(hidden, series, s.key);
            if (!r.blocked) hiddenS[1](r.hidden);
          },
        },
          h("span", { className: prefix + "-dot" + (on ? "" : " " + prefix + "-dot-off"), style: on ? { background: s.color || COLORS[i % COLORS.length] } : { borderColor: s.color || COLORS[i % COLORS.length] } }),
          s.label,
        );
      })),
    );
  }

  // 传 onSelect 才会变成可点击分桶（统计页优先级/难度分布用）；逾期账龄等图表不传，
  // 仍保持 role=img 的纯展示语义，键盘也不进入 tab 序列。
  function Histogram(props) {
    var data = props.data || [];
    var max = data.reduce(function (m, d) { return Math.max(m, Number(d.count || 0)); }, 0) || 1;
    var interactive = typeof props.onSelect === "function";
    var hint = props.selectHint || "";
    return h("div", { className: prefix + "-hist", role: interactive ? "group" : "img", "aria-label": props.aria || data.map(function (d) { return d.label + " " + d.count; }).join("，") },
      data.map(function (d, i) {
        var count = Number(d.count || 0), canPick = interactive && count > 0;
        return h("div", {
          key: d.key || d.label || i,
          className: prefix + "-hbar" + (canPick ? " " + prefix + "-hbar-link" : ""),
          title: canPick && hint ? d.label + "：" + count + " · " + hint : d.label + "：" + count,
          role: canPick ? "button" : undefined,
          tabIndex: canPick ? 0 : undefined,
          "aria-label": canPick ? d.label + "：" + count + (hint ? "，" + hint : "") : undefined,
          onClick: canPick ? function () { props.onSelect(d); } : undefined,
          onKeyDown: canPick ? function (e) {
            if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") { e.preventDefault(); props.onSelect(d); }
          } : undefined,
        },
          h("span", { className: prefix + "-hbar-v" }, num(props.lang, d.count)),
          h("span", { className: prefix + "-hbar-f", style: { height: Math.max(2, (count / max) * 100) + "%", background: d.color || props.color || COLORS[0] } }),
          h("span", { className: prefix + "-hbar-l" }, d.label),
        );
      }),
    );
  }

  function DataTable(props) {
    var cols = props.columns || [];
    var rows = props.rows || [];
    if (props.missing) return h(Missing, { text: props.missingText });
    if (!rows.length) return h("div", { className: prefix + "-empty" }, props.empty || "暂无数据");
    return h("div", { className: prefix + "-table-scroll", tabIndex: 0, role: "region", "aria-label": props.lang === "en" ? "Data table" : "数据表格" }, h("table", { className: prefix + "-table" },
      h("thead", null, h("tr", null, cols.map(function (c) { return h("th", { key: c.key, className: c.num ? prefix + "-num" : "" }, c.label); }))),
      h("tbody", null, rows.map(function (row, ri) {
        return h("tr", { key: row.id || row.key || ri }, cols.map(function (c) {
          return h("td", { key: c.key, className: c.num ? prefix + "-num" : "" }, c.render ? c.render(row) : row[c.key]);
        }));
      })),
    ));
  }

  function DateRangePicker(props) {
    var custom = props.custom || null;
    var from = custom && custom.from ? custom.from : "";
    var to = custom && custom.to ? custom.to : "";
    return h("div", { className: prefix + "-stoolbar" },
      (props.options || []).length ? h("div", { className: prefix + "-seg", role: "group", "aria-label": props.aria || "时间范围" }, (props.options || []).map(function (o) {
        return h("button", {
          key: o.key, type: "button", className: o.key === props.value ? prefix + "-on" : "",
          "aria-pressed": !!props.value && o.key === props.value,
          onClick: function () { props.onChange(o.key); },
        }, o.label);
      })) : null,
      h("div", { className: prefix + "-range", role: "group", "aria-label": props.customAria || "自定义日期范围" },
        h(DP.RangePicker, {
          React: React, h: h, prefix: prefix, lang: props.lang, label: props.customAria || "自定义日期范围",
          value: { from: from, to: to }, max: props.today || undefined, clearable: false,
          onChange: function (next) {
            if (typeof props.onCustomChange !== "function") return;
            props.onCustomChange({ from: next.from, to: next.to });
          },
        }),
        (from || to) ? h("button", {
          type: "button", className: prefix + "-clear", "aria-label": props.clearLabel || "清除自定义范围",
          title: props.clearLabel || "清除自定义范围",
          onClick: function () { if (props.onCustomClear) props.onCustomClear(); },
        }, "×") : null,
      ),
      props.customHint ? h("span", { className: prefix + "-hint", role: "status" }, props.customHint) : null,
    );
  }

  // Statistics retain presets, refresh and generated time around the reusable picker.
  function RangeSwitch(props) {
    return h("div", { className: prefix + "-stoolbar" },
      h(DateRangePicker, props),
      h("button", { type: "button", className: prefix + "-ghost", disabled: !!props.loading, onClick: props.onRefresh }, props.refreshLabel || "刷新"),
      h("span", { className: prefix + "-muted" }, props.generatedAt ? (props.timeLabel || "截至") + " " + timeText(props.generatedAt) : ""),
      props.right ? h("span", { style: { marginLeft: "auto" } }, props.right) : null,
    );
  }

  function Missing(props) {
    return h("div", { className: prefix + "-empty " + prefix + "-missing", role: "status" }, props.text || "暂无数据");
  }




  function Warnings(props) {
    var items = props.items || [];
    if (!items.length) return null;
    return h("div", { className: prefix + "-warnbar", role: "status" }, items.map(function (w) { return w.message; }).join("；"));
  }

  return {
    Section: Section, Card: Card, Kpi: Kpi, Donut: Donut, BarList: BarList, StackedRows: StackedRows,
    Trend: Trend, Histogram: Histogram, DataTable: DataTable, RangeSwitch: RangeSwitch, DateRangePicker: DateRangePicker,
    Empty: Empty, Missing: Missing, Skeleton: Skeleton, ErrorBar: ErrorBar, Warnings: Warnings,
    num: num, pct: pct, timeText: timeText, dateText: dateText, colors: COLORS, statusColors: STATUS_COLORS,
  };
}

module.exports = { makeCharts: makeCharts };
