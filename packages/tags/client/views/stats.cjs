// 标签统计视图：一次拉取 tags.statsReport，区块化渲染。
var React = require("react");
var h = React.createElement;
var charts = require("../stats/charts.cjs");
var configView = require("./config.cjs");
var TopTags = require("../stats/top-tags.cjs").TopTags;

var COPY = {
  zh: {
    range7: "近 7 天", range30: "近 30 天", range90: "近 90 天", range365: "近 1 年", rangeAll: "全部",
    refresh: "刷新", asOf: "截至", retry: "重试", loadFail: "统计服务未就绪，请升级插件后重试",
    rangeFrom: "起始日期", rangeTo: "终止日期", rangeClear: "清除自定义范围",
    rangeCustom: "自定义日期范围", rangeIncomplete: "请选择完整的起始与终止日期",
    rangeInvalid: "起始日期不能晚于终止日期",
    tags: "标签总数", used: "已使用", mappings: "关联总数", items: "覆盖对象",
    avgPerItem: "平均每对象", newTags: "范围内新增标签", newMappings: "范围内新增关联",
    times: "条", current: "当前", inRange: "范围内", ofTotal: "占总量",
    usage: "使用次数分布", usageNote: "按标签的关联条数分桶",
    bin0: "0 次", bin1: "1–2 次", bin2: "3–5 次", bin3: "6–10 次", bin4: ">10 次",
    types: "关联对象类型", typesNote: "条数=关联条数，对象=去重对象；物品即储物模块中的物件",
    trend: "新增标签 / 关联趋势", trendNote: "包含后来解除的关联（历史新增）",
    newTagSeries: "新增标签", newMapSeries: "新增关联",
    stale: "沉睡标签", staleNote: "从未使用或 90 天未使用",
    recent: "最近使用", recentNote: "按最近使用时间降序",
    colName: "标签", colCount: "使用次数", colLast: "最近使用", colShare: "占比",
    never: "从未使用", noStale: "没有沉睡标签", noRecent: "还没有使用记录",
    noData: "还没有标签。在「标签」页创建后，这里会自动汇总",
    typeSite: "站点", typeTask: "任务", typeStorage: "物品", typeOther: "其他",
  },
  en: {
    range7: "7 days", range30: "30 days", range90: "90 days", range365: "1 year", rangeAll: "All",
    refresh: "Refresh", asOf: "As of", retry: "Retry", loadFail: "Stats service not ready. Upgrade the plugin and retry.",
    rangeFrom: "Start date", rangeTo: "End date", rangeClear: "Clear custom range",
    rangeCustom: "Custom date range", rangeIncomplete: "Pick both start and end dates",
    rangeInvalid: "Start date must not be after end date",
    tags: "Tags", used: "Used", mappings: "Mappings", items: "Objects",
    avgPerItem: "Avg per object", newTags: "New tags", newMappings: "New mappings",
    times: "", current: "Current", inRange: "In range", ofTotal: "of total",
    usage: "Usage distribution", usageNote: "Tags bucketed by mapping count",
    bin0: "0", bin1: "1–2", bin2: "3–5", bin3: "6–10", bin4: ">10",
    types: "Object types", typesNote: "Links vs distinct objects; Items are storage-module records",
    trend: "New tags / mappings", trendNote: "Includes mappings later removed",
    newTagSeries: "Tags", newMapSeries: "Mappings",
    stale: "Stale tags", staleNote: "Never used or unused for 90 days",
    recent: "Recently used", recentNote: "Most recent first",
    colName: "Tag", colCount: "Uses", colLast: "Last used", colShare: "Share",
    never: "Never", noStale: "No stale tags", noRecent: "No usage yet",
    noData: "No tags yet. Create one on the Tags page and the summary appears here.",
    typeSite: "Sites", typeTask: "Tasks", typeStorage: "Items", typeOther: "Other",
  },
};

var RANGES = ["7d", "30d", "90d", "365d", "all"];

var CFG_FALLBACK = { "stats.range": "30d", "stats.top": 10, "stats.showKpi": true };

function TagsStatsView(props) {
  var lang = props.lang === "en" ? "en" : "zh";
  var cfg = configView.useConfig(props.api, CFG_FALLBACK);
  if (!cfg.ready) {
    return h("div", { style: { padding: "48px", textAlign: "center", fontSize: "12.5px", opacity: .6 } }, lang === "en" ? "Loading…" : "载入中…");
  }
  return h(TagsStatsBody, Object.assign({}, props, { cfg: cfg.values }));
}

function TagsStatsBody(props) {
  var lang = props.lang === "en" ? "en" : "zh";
  var t = COPY[lang];
  var api = props.api;
  var cfg = props.cfg || {};
  var cfgRange = RANGES.indexOf(cfg["stats.range"]) >= 0 ? cfg["stats.range"] : "30d";
  var cfgTop = Math.floor(Number(cfg["stats.top"]));
  if (!(cfgTop >= 5)) cfgTop = 10;
  if (cfgTop > 100) cfgTop = 100;
  var cfgSections = Array.isArray(cfg["stats.sections"]) ? cfg["stats.sections"] : null;
  function sectionOn(key) { return !cfgSections || cfgSections.indexOf(key) >= 0; }
  var ch = React.useMemo(function () { return charts.makeCharts("wbg"); }, []);
  var rangePair = React.useState(cfgRange);
  var range = rangePair[0], setRange = rangePair[1];
  var dataPair = React.useState(null);
  var data = dataPair[0], setData = dataPair[1];
  var errPair = React.useState("");
  var err = errPair[0], setErr = errPair[1];
  var loadPair = React.useState(true);
  var loading = loadPair[0], setLoading = loadPair[1];
  var req = React.useRef(0);
  var customPair = React.useState(null);
  var custom = customPair[0], setCustom = customPair[1];
  var todayDay = React.useMemo(function () {
    var d = new Date();
    function p(n) { return String(n).padStart(2, "0"); }
    return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate());
  }, []);
  var customFrom = custom && custom.from ? custom.from : "";
  var customTo = custom && custom.to ? custom.to : "";
  var customOk = !!(customFrom && customTo && customFrom <= customTo);
  var customHint = "";
  if (!customOk && (customFrom || customTo)) {
    customHint = customFrom && customTo ? t.rangeInvalid : t.rangeIncomplete;
  }

  var load = React.useCallback(function (silent) {
    // 起止日期只填了一半或顺序颠倒时先不发请求，保留上一份结果，避免闪回预设范围。
    if ((customFrom || customTo) && !customOk) return Promise.resolve();
    var id = ++req.current;
    if (!silent) setLoading(true);
    var args = { top: cfgTop, topTagsLimit: 100 };
    if (customOk) { args.from = customFrom; args.to = customTo; } else { args.range = range; }
    return Promise.resolve(api.call("tags.statsReport", args))
      .then(function (r) { return r && r.result !== undefined ? r.result : r; })
      .then(function (d) { if (id === req.current) { setData(d); setErr(""); } })
      .catch(function (e) { if (id === req.current) setErr(String((e && e.message) || e || "load failed")); })
      .then(function () { if (id === req.current) setLoading(false); });
  }, [api, range, customOk, customFrom, customTo, cfgTop]);

  React.useEffect(function () { load(false); }, [load]);

  React.useEffect(function () {
    if (!api || typeof api.subscribe !== "function") return undefined;
    var timer = null;
    var pending = false;
    var off = api.subscribe(function (payload) {
      var ev = payload && payload.event;
      if (ev !== "tags-changed" && ev !== "tasks-changed" && ev !== "sites-changed" && ev !== "storage-changed") return;
      if (typeof document !== "undefined" && document.visibilityState && document.visibilityState !== "visible") {
        pending = true;
        return;
      }
      if (timer) clearTimeout(timer);
      timer = setTimeout(function () { load(true); }, 800);
    });
    function onVisible() {
      if (typeof document !== "undefined" && document.visibilityState === "visible" && pending) {
        pending = false;
        load(true);
      }
    }
    if (typeof document !== "undefined") document.addEventListener("visibilitychange", onVisible);
    return function () {
      if (timer) clearTimeout(timer);
      if (typeof document !== "undefined") document.removeEventListener("visibilitychange", onVisible);
      if (typeof off === "function") off();
    };
  }, [api, load]);

  var options = RANGES.map(function (key) {
    return { key: key, label: t["range" + (key === "all" ? "All" : key.replace("d", ""))] };
  });

  var children = [];
  if (!data && loading) children.push(h(ch.Skeleton, { key: "sk" }));
  if (!data && !loading && err) children.push(h(ch.Card, { key: "err", span: 12 }, h(ch.Empty, { text: t.loadFail })));
  if (data && data.totals) {
    var totals = data.totals;
    var rates = data.rates || {};
    var b = data.breakdowns || {};
    var usageLabel = { "0": t.bin0, "1-2": t.bin1, "3-5": t.bin2, "6-10": t.bin3, "10+": t.bin4 };
    var usageData = (b.usage || []).map(function (row) { return Object.assign({}, row, { label: usageLabel[row.key] || row.label }); });
    var typeName = { site: t.typeSite, task: t.typeTask, storage: t.typeStorage, other: t.typeOther };
    var types = b.itemTypes || [];
    var donutData = types.map(function (x, i) {
      var items = Number(x.items) || 0;
      return {
        key: x.key, label: typeName[x.key] || x.label, count: x.mappings,
        note: lang === "en" ? items + " objects" : items + " 对象", color: ch.colors[i],
      };
    });
    var donutAria = types.map(function (x) {
      var items = Number(x.items) || 0;
      return lang === "en"
        ? (typeName[x.key] || x.label) + " " + x.mappings + " links, " + items + " objects"
        : (typeName[x.key] || x.label) + " " + x.mappings + " 条关联，" + items + " 个对象";
    }).join(lang === "en" ? "; " : "；");
    children.push(h("div", { key: "kpi", className: "wbg-kpis" },
      h(ch.Kpi, { label: t.tags, value: totals.tags, hint: t.current, lang: lang }),
      h(ch.Kpi, { label: t.used, value: totals.used, hint: ch.pct(rates.usedRatio) + " " + t.ofTotal, tone: "ok", lang: lang }),
      h(ch.Kpi, { label: t.mappings, value: totals.mappings, hint: t.current, lang: lang }),
      h(ch.Kpi, { label: t.items, value: totals.items, hint: t.current, lang: lang }),
      h(ch.Kpi, { label: t.avgPerItem, value: totals.avgPerItem, unit: t.times, hint: t.current, lang: lang }),
      h(ch.Kpi, { label: t.newTags, value: totals.newTags, hint: t.inRange, lang: lang }),
      h(ch.Kpi, { label: t.newMappings, value: totals.newMappings, hint: t.inRange, lang: lang }),
      h(ch.Kpi, { label: t.stale, value: (data.lists && data.lists.stale ? data.lists.stale.length : 0), hint: t.current, lang: lang }),
    ));

    if (totals.tags === 0) {
      children.push(h(ch.Card, { key: "empty", span: 12 }, h(ch.Empty, { text: t.noData })));
    } else {
      children.push(h(ch.Card, { key: "usage", span: 6, title: t.usage, note: t.usageNote },
        h(ch.Histogram, { data: usageData, lang: lang, color: ch.colors[0] })));
      children.push(h(TopTags, {
        key: "top", rows: ((data.rankings && data.rankings.topTags) || []).slice(0, 100), total: totals.tags, lang: lang,
        onSelect: function (row) { if (props.onNavigate) props.onNavigate("tags", { text: row.name }); },
      }));
      children.push(h(ch.Card, { key: "types", span: 4, title: t.types, note: t.typesNote },
        h(ch.Donut, {
          data: donutData,
          total: totals.mappings, lang: lang, centerLabel: t.mappings,
          aria: donutAria,
        })));
      children.push(h(ch.Card, { key: "trend", span: 8, title: t.trend, note: t.trendNote },
        h(ch.Trend, {
          data: data.trend || [], lang: lang,
          series: [
            { key: "tags", label: t.newTagSeries, color: ch.colors[0] },
            { key: "mappings", label: t.newMapSeries, color: ch.colors[1] },
          ],
        })));
      children.push(h(ch.Card, { key: "stale", span: 6, title: t.stale, note: t.staleNote },
        h(ch.DataTable, {
          rows: (data.lists && data.lists.stale) || [], lang: lang, empty: t.noStale,
          columns: [
            { key: "name", label: t.colName },
            { key: "count", label: t.colCount, num: true },
            { key: "lastUsedAt", label: t.colLast, render: function (r) { return r.lastUsedAt ? ch.dateText(r.lastUsedAt) : t.never; } },
          ],
        })));
      children.push(h(ch.Card, { key: "recent", span: 6, title: t.recent, note: t.recentNote },
        h(ch.DataTable, {
          rows: (data.lists && data.lists.recent) || [], lang: lang, empty: t.noRecent,
          columns: [
            { key: "name", label: t.colName },
            { key: "count", label: t.colCount, num: true },
            { key: "lastUsedAt", label: t.colLast, render: function (r) { return ch.dateText(r.lastUsedAt); } },
          ],
        })));
    }
    children.push(h(ch.Warnings, { key: "warn", items: data.warnings || [] }));
  }

  children = children.filter(function (node) {
    var k = node && node.key;
    if (!k || k === "sk" || k === "err" || k === "warn" || k === "empty") return true;
    if (k === "kpi") return cfg["stats.showKpi"] !== false;
    return sectionOn(k);
  });

  return h("div", { className: "wbg-stats" },
    h(ch.RangeSwitch, {
      options: options, value: customFrom || customTo ? null : range,
      onChange: function (key) { setCustom(null); setRange(key); },
      custom: { from: customFrom, to: customTo },
      onCustomChange: function (next) { setCustom({ from: next.from || "", to: next.to || "" }); },
      onCustomClear: function () { setCustom(null); },
      customHint: customHint, today: todayDay,
      fromLabel: t.rangeFrom, toLabel: t.rangeTo, clearLabel: t.rangeClear, customAria: t.rangeCustom,
      onRefresh: function () { load(false); },
      loading: loading, generatedAt: data && data.generatedAt, refreshLabel: t.refresh, timeLabel: t.asOf,
    }),
    err && data ? h(ch.ErrorBar, { message: err, onRetry: function () { load(false); }, retryLabel: t.retry }) : null,
    h("div", { className: "wbg-sgrid" }, children.filter(function (node) { return node.key === "kpi"; })),
    h("div", { className: "wbg-stats-columns" },
      children.some(function (node) { return node.key === "top"; })
        ? h("div", { className: "wbg-top-column" }, children.filter(function (node) { return node.key === "top"; })) : null,
      h("div", { className: "wbg-sgrid wbg-stats-main" }, children.filter(function (node) { return node.key !== "top" && node.key !== "kpi"; })),
    ),
  );
}

module.exports = { TagsStatsView: TagsStatsView };
