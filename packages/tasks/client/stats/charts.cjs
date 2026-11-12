// 统计页通用自绘图表（无第三方图表库）。
// 每个业务包各存一份，避免 npm 安装后跨包相对引用失效。
var React = require("react");
var h = React.createElement;

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
    ".@-stats{display:flex;flex-direction:column;gap:14px;padding:4px 2px 24px;color:var(--dsw-alias-label-primary,#1f2329)}",
    ".@-stoolbar{display:flex;align-items:center;gap:8px;flex-wrap:wrap}",
    ".@-seg{display:inline-flex;border:1px solid var(--dsw-alias-border-l2,#e5e6eb);border-radius:9px;overflow:hidden;background:var(--dsw-alias-bg-layer-1,#fff)}",
    ".@-seg button{appearance:none;border:0;background:transparent;color:var(--dsw-alias-label-secondary,#646a73);font-size:12px;padding:6px 10px;cursor:pointer;white-space:nowrap}",
    ".@-seg button.@-on{background:var(--dsw-alias-brand-primary,#4f6ef7);color:var(--dsw-alias-label-primary-inverted,#fff)}",
    ".@-range{display:inline-flex;align-items:center;gap:4px;border:1px solid var(--dsw-alias-border-l2,#e5e6eb);border-radius:9px;padding:2px 6px;background:var(--dsw-alias-bg-layer-1,#fff)}",
    ".@-range:focus-within{border-color:var(--dsw-alias-brand-primary,#4f6ef7)}",
    ".@-date{appearance:none;border:0;background:transparent;color:var(--dsw-alias-label-secondary,#646a73);font-family:inherit;font-size:12px;padding:4px 2px;width:116px;outline:none}",
    ".@-date::-webkit-calendar-picker-indicator{opacity:.55;cursor:pointer}",
    ".@-dash{color:var(--dsw-alias-label-tertiary,#8f959e);font-size:12px}",
    ".@-clear{appearance:none;border:0;background:transparent;color:var(--dsw-alias-label-tertiary,#8f959e);font-size:14px;line-height:1;padding:2px 4px;cursor:pointer;border-radius:4px}",
    ".@-clear:hover{color:var(--dsw-alias-state-error-primary,#d9534f);background:var(--dsw-alias-bg-skeleton,#f2f3f5)}",
    ".@-hint{font-size:11px;color:var(--dsw-alias-state-error-primary,#d9534f);white-space:nowrap}",
    ".@-ghost{appearance:none;border:1px solid var(--dsw-alias-border-l2,#e5e6eb);background:var(--dsw-alias-bg-layer-1,#fff);color:var(--dsw-alias-label-secondary,#646a73);border-radius:8px;font-size:12px;padding:6px 10px;cursor:pointer}",
    ".@-ghost:hover{border-color:var(--dsw-alias-brand-primary,#4f6ef7);color:var(--dsw-alias-brand-primary,#4f6ef7)}",
    ".@-muted{color:var(--dsw-alias-label-tertiary,#8f959e);font-size:12px}",
    ".@-sgrid{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:12px}",
    ".@-scard{grid-column:span 6;min-width:0;background:var(--dsw-alias-bg-layer-1,#fff);border:1px solid var(--dsw-alias-border-l2,#e5e6eb);border-radius:12px;padding:14px 16px}",
    ".@-span-3{grid-column:span 3}.@-span-4{grid-column:span 4}.@-span-6{grid-column:span 6}.@-span-8{grid-column:span 8}.@-span-12{grid-column:span 12}",
    ".@-chead{display:flex;align-items:baseline;gap:8px;margin-bottom:10px;flex-wrap:wrap}",
    ".@-ctitle{font-size:13px;font-weight:600;color:var(--dsw-alias-label-primary,#1f2329)}",
    ".@-cnote{font-size:11px;color:var(--dsw-alias-label-tertiary,#8f959e)}",
    ".@-kpis{grid-column:span 12;display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:12px}",
    ".@-kpi{background:var(--dsw-alias-bg-layer-1,#fff);border:1px solid var(--dsw-alias-border-l2,#e5e6eb);border-radius:12px;padding:12px 14px;min-width:0}",
    ".@-kpi-l{font-size:12px;color:var(--dsw-alias-label-tertiary,#8f959e);display:flex;align-items:center;gap:6px}",
    ".@-kpi-v{font-size:26px;line-height:1.25;font-weight:650;margin-top:4px;font-variant-numeric:tabular-nums}",
    ".@-kpi-u{font-size:12px;font-weight:400;color:var(--dsw-alias-label-tertiary,#8f959e);margin-left:3px}",
    ".@-kpi-h{font-size:11px;color:var(--dsw-alias-label-tertiary,#8f959e);margin-top:3px}",
    ".@-kpi.@-danger .@-kpi-v{color:var(--dsw-alias-state-error-primary,#d9534f)}",
    ".@-kpi.@-warn .@-kpi-v{color:var(--dsw-alias-state-warn-primary,#d99100)}",
    ".@-kpi.@-ok .@-kpi-v{color:var(--dsw-alias-state-success-primary,#2f9e6e)}",
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
    ".@-table-scroll{max-width:100%;overflow-x:auto}.@-table{width:100%;border-collapse:collapse;font-size:12px}",
    ".@-table th{text-align:left;font-weight:500;color:var(--dsw-alias-label-tertiary,#8f959e);padding:6px 8px;border-bottom:1px solid var(--dsw-alias-border-l2,#e5e6eb);white-space:nowrap}",
    ".@-table td{padding:7px 8px;border-bottom:1px solid var(--dsw-alias-border-l1,#f2f3f5);color:var(--dsw-alias-label-secondary,#646a73);vertical-align:top}",
    ".@-table tr:last-child td{border-bottom:0}",
    ".@-table th.@-num,.@-table td.@-num{text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap}",
    ".@-empty{padding:26px 8px;text-align:center;color:var(--dsw-alias-label-tertiary,#8f959e);font-size:12px}",
    ".@-err{display:flex;align-items:center;gap:10px;background:color-mix(in srgb,var(--dsw-alias-state-error-primary,#d9534f) 8%,transparent);border:1px solid color-mix(in srgb,var(--dsw-alias-state-error-primary,#d9534f) 30%,transparent);color:var(--dsw-alias-state-error-primary,#d9534f);border-radius:10px;padding:10px 12px;font-size:12px}",
    ".@-warn{grid-column:span 12;border:1px dashed var(--dsw-alias-state-warn-primary,#d99100);border-radius:10px;padding:9px 12px;font-size:12px;color:var(--dsw-alias-state-warn-primary,#d99100);background:color-mix(in srgb,var(--dsw-alias-state-warn-primary,#d99100) 6%,transparent)}",
    ".@-sk{height:14px;border-radius:6px;background:var(--dsw-alias-bg-skeleton,#f2f3f5);margin:7px 0;animation:@-pulse 1.2s ease-in-out infinite}",
    "@keyframes @-pulse{0%,100%{opacity:.55}50%{opacity:1}}",
    "@media (max-width:900px){.@-scard{grid-column:span 12}.@-span-3,.@-span-4,.@-span-6,.@-span-8{grid-column:span 12}.@-kpis{grid-template-columns:repeat(2,minmax(0,1fr))}}",
    "@media (max-width:600px){.@-stats{padding-bottom:16px}.@-hist{height:130px}.@-kpi-v{font-size:22px}}",
    "@media (prefers-reduced-motion:reduce){.@-sk{animation:none}}",
  ].join("\n").replace(/@-/g, prefix + "-");
}

function makeCharts(prefix) {
  if (typeof document !== "undefined" && !document.getElementById(prefix + "-charts-css")) {
    var el = document.createElement("style");
    el.id = prefix + "-charts-css";
    el.textContent = css(prefix);
    document.head.appendChild(el);
  }

  function num(lang, n) {
    var v = Number(n);
    if (!isFinite(v)) return "—";
    try {
      return new Intl.NumberFormat(lang === "en" ? "en-US" : "zh-CN").format(v);
    } catch (e) {
      return String(v);
    }
  }
  function pct(v, digits) {
    if (v === null || v === undefined || !isFinite(Number(v))) return "—";
    return (Number(v) * 100).toFixed(digits === undefined ? 1 : digits) + "%";
  }
  function timeText(ms) {
    if (!ms) return "";
    var d = new Date(Number(ms));
    function p(n) { return String(n).padStart(2, "0"); }
    return p(d.getHours()) + ":" + p(d.getMinutes()) + ":" + p(d.getSeconds());
  }
  function dateText(ms) {
    if (!ms) return "—";
    var d = new Date(Number(ms));
    function p(n) { return String(n).padStart(2, "0"); }
    return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate());
  }

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

  function Kpi(props) {
    var tone = props.tone ? " " + prefix + "-" + props.tone : "";
    return h("div", { className: prefix + "-kpi" + tone },
      h("div", { className: prefix + "-kpi-l" }, props.label),
      h("div", { className: prefix + "-kpi-v" },
        props.value === null || props.value === undefined ? "—" : (typeof props.value === "number" ? num(props.lang, props.value) : props.value),
        props.unit ? h("span", { className: prefix + "-kpi-u" }, props.unit) : null,
      ),
      props.hint ? h("div", { className: prefix + "-kpi-h" }, props.hint) : null,
    );
  }

  function Donut(props) {
    var data = (props.data || []).filter(function (d) { return Number(d.count) > 0; });
    var total = Number(props.total || 0);
    var size = props.size || 168;
    var r = size / 2 - 16;
    var c = 2 * Math.PI * r;
    var offset = 0;
    var aria = props.aria || data.map(function (d) { return d.label + " " + d.count; }).join("，");
    return h("div", { className: prefix + "-donut" },
      h("svg", { width: size, height: size, viewBox: "0 0 " + size + " " + size, role: "img", "aria-label": aria },
        h("circle", { cx: size / 2, cy: size / 2, r: r, fill: "none", stroke: "var(--dsw-alias-bg-skeleton,#f2f3f5)", strokeWidth: 18 }),
        total > 0 ? data.map(function (d, i) {
          var len = (Number(d.count) / total) * c;
          var seg = h("circle", {
            key: d.key || d.label || i,
            cx: size / 2, cy: size / 2, r: r, fill: "none",
            stroke: d.color || COLORS[i % COLORS.length], strokeWidth: 18,
            strokeDasharray: len + " " + (c - len),
            strokeDashoffset: -offset,
            transform: "rotate(-90 " + size / 2 + " " + size / 2 + ")",
            strokeLinecap: "butt",
          }, h("title", null, d.label + "：" + d.count));
          offset += len;
          return seg;
        }) : null,
        h("text", { x: size / 2, y: size / 2 - 2, textAnchor: "middle", fill: "var(--dsw-alias-label-primary,#1f2329)", fontSize: 24, fontWeight: 650 }, num(props.lang, total)),
        h("text", { x: size / 2, y: size / 2 + 18, textAnchor: "middle", fill: "var(--dsw-alias-label-tertiary,#8f959e)", fontSize: 11 }, props.centerLabel || ""),
      ),
      h("div", { className: prefix + "-legend" }, (props.data || []).map(function (d, i) {
        return h("div", { key: d.key || d.label || i, className: prefix + "-leg" },
          h("span", { className: prefix + "-dot", style: { background: d.color || COLORS[i % COLORS.length] } }),
          h("span", null, d.label),
          h("b", null, num(props.lang, d.count)),
        );
      })),
    );
  }

  function BarList(props) {
    var data = props.data || [];
    var max = Number(props.max || 0) || data.reduce(function (m, d) { return Math.max(m, Number(d.value || 0)); }, 0) || 1;
    return h("div", { className: prefix + "-bars" }, data.map(function (d, i) {
      var v = Number(d.value || 0);
      return h("div", { key: d.key || d.label || i, className: prefix + "-bar" },
        h("span", { className: prefix + "-bar-l", title: d.title || d.label }, d.label),
        h("span", { className: prefix + "-bar-t" }, h("span", { className: prefix + "-bar-f", style: { width: Math.max(2, (v / max) * 100) + "%", background: d.color || props.color || COLORS[0] } })),
        h("span", { className: prefix + "-bar-v" }, props.format ? props.format(v) : num(props.lang, v)),
      );
    }));
  }

  function StackedRows(props) {
    var rows = props.rows || [];
    var keys = props.keys || [];
    return h("div", { className: prefix + "-stack" }, rows.map(function (row, ri) {
      var total = Number(row.total || 0) || 1;
      return h("div", { key: row.key || ri },
        h("div", { className: prefix + "-srow-l" }, h("span", null, row.label), h("b", null, num(props.lang, row.total))),
        h("div", { className: prefix + "-strack" }, keys.map(function (k, i) {
          var v = Number((row.parts && row.parts[k.key]) || 0);
          if (v <= 0) return null;
          return h("span", {
            key: k.key, className: prefix + "-seg-f", title: k.label + " " + v,
            style: { width: (v / total) * 100 + "%", background: k.color || COLORS[i % COLORS.length] },
          });
        })),
      );
    }));
  }

  function Trend(props) {
    var data = props.data || [];
    var series = props.series || [];
    var width = 640;
    var height = props.height || 200;
    var left = 30, right = 10, top = 12, bottom = 24;
    var pw = width - left - right, ph = height - top - bottom;
    var max = 1;
    data.forEach(function (d) { series.forEach(function (s) { max = Math.max(max, Number(d[s.key] || 0)); }); });
    max = Math.ceil(max * 1.15) || 1;
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
    var aria = series.map(function (s) {
      return s.label + " " + data.reduce(function (n, d) { return n + Number(d[s.key] || 0); }, 0);
    }).join("，");
    return h("div", null,
      h("svg", { className: prefix + "-trend", viewBox: "0 0 " + width + " " + height, role: "img", "aria-label": props.aria || aria },
        ticks.map(function (v, i) {
          return h("g", { key: "t" + i },
            h("line", { x1: left, x2: width - right, y1: y(v), y2: y(v), stroke: "var(--dsw-alias-border-l1,#f2f3f5)", strokeWidth: 1 }),
            h("text", { x: left - 5, y: y(v) + 3, textAnchor: "end", fontSize: 9, fill: "var(--dsw-alias-label-tertiary,#8f959e)" }, num(props.lang, v)),
          );
        }),
        series.map(function (s, si) {
          var pts = data.map(function (d, i) { return x(i) + "," + y(d[s.key]); }).join(" ");
          return h("g", { key: s.key },
            h("polyline", { points: pts, fill: "none", stroke: s.color || COLORS[si % COLORS.length], strokeWidth: 2, strokeLinejoin: "round", strokeLinecap: "round" }),
            data.map(function (d, i) {
              if (data.length > 40 && i % 3 !== 0) return null;
              return h("circle", { key: i, cx: x(i), cy: y(d[s.key]), r: 2.4, fill: s.color || COLORS[si % COLORS.length] },
                h("title", null, d.bucket + "：" + s.label + " " + (d[s.key] || 0)));
            }),
          );
        }),
        labelIdx.map(function (i) {
          return h("text", { key: "x" + i, x: x(i), y: height - 6, textAnchor: "middle", fontSize: 9, fill: "var(--dsw-alias-label-tertiary,#8f959e)" }, String(data[i].bucket).slice(5));
        }),
      ),
      h("div", { className: prefix + "-tlegend" }, series.map(function (s, i) {
        return h("span", { key: s.key, style: { display: "inline-flex", alignItems: "center", gap: 5 } },
          h("span", { className: prefix + "-dot", style: { background: s.color || COLORS[i % COLORS.length] } }),
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
    function setDate(key, value, input) {
      if (input && input.validity && input.validity.badInput) {
        if (props.onInvalidInput) props.onInvalidInput();
        return;
      }
      if (typeof props.onCustomChange !== "function") return;
      var next = { from: from, to: to };
      next[key] = value;
      props.onCustomChange(next);
    }
    return h("div", { className: prefix + "-stoolbar" },
      (props.options || []).length ? h("div", { className: prefix + "-seg", role: "group", "aria-label": props.aria || "时间范围" }, (props.options || []).map(function (o) {
        return h("button", {
          key: o.key, type: "button", className: o.key === props.value ? prefix + "-on" : "",
          "aria-pressed": !!props.value && o.key === props.value,
          onClick: function () { props.onChange(o.key); },
        }, o.label);
      })) : null,
      h("div", { className: prefix + "-range", role: "group", "aria-label": props.customAria || "自定义日期范围" },
        h("input", {
          type: "date", className: prefix + "-date", value: from,
          max: to && (!props.today || to < props.today) ? to : props.today || undefined,
          "aria-label": props.fromLabel || "起始日期", title: props.fromLabel || "起始日期",
          onChange: function (e) { setDate("from", e.target.value, e.target); },
        }),
        h("span", { className: prefix + "-dash", "aria-hidden": "true" }, "–"),
        h("input", {
          type: "date", className: prefix + "-date", value: to,
          min: from || undefined, max: props.today || undefined,
          "aria-label": props.toLabel || "终止日期", title: props.toLabel || "终止日期",
          onChange: function (e) { setDate("to", e.target.value, e.target); },
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

  function Empty(props) {
    return h("div", { className: prefix + "-empty" }, props.text || "暂无数据");
  }

  function Skeleton() {
    return h("div", { className: prefix + "-sgrid" },
      h("div", { className: prefix + "-kpis" }, [0, 1, 2, 3].map(function (i) {
        return h("div", { key: i, className: prefix + "-kpi" },
          h("div", { className: prefix + "-sk", style: { width: "40%" } }),
          h("div", { className: prefix + "-sk", style: { width: "65%", height: 26 } }),
        );
      })),
      [0, 1].map(function (i) {
        return h("div", { key: "c" + i, className: prefix + "-scard " + prefix + "-span-6" },
          h("div", { className: prefix + "-sk", style: { width: "30%" } }),
          h("div", { className: prefix + "-sk", style: { height: 120 } }),
        );
      }),
    );
  }

  function ErrorBar(props) {
    return h("div", { className: prefix + "-err", role: "alert" },
      h("span", null, props.message),
      props.onRetry ? h("button", { type: "button", className: prefix + "-ghost", onClick: props.onRetry }, props.retryLabel || "重试") : null,
    );
  }

  function Warnings(props) {
    var items = props.items || [];
    if (!items.length) return null;
    return h("div", { className: prefix + "-warn", role: "status" }, items.map(function (w) { return w.message; }).join("；"));
  }

  return {
    Card: Card, Kpi: Kpi, Donut: Donut, BarList: BarList, StackedRows: StackedRows,
    Trend: Trend, Histogram: Histogram, DataTable: DataTable, RangeSwitch: RangeSwitch, DateRangePicker: DateRangePicker,
    Empty: Empty, Missing: Missing, Skeleton: Skeleton, ErrorBar: ErrorBar, Warnings: Warnings,
    num: num, pct: pct, timeText: timeText, dateText: dateText, colors: COLORS, statusColors: STATUS_COLORS,
  };
}

module.exports = { makeCharts: makeCharts };
