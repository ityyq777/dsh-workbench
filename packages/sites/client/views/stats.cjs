// 站点统计视图：一次拉取 sites.statsReport，区块化渲染。
var React = require("react");
var h = React.createElement;
var charts = require("../stats/charts.cjs");
var configView = require("./config.cjs");

var COPY = {
  zh: {
    range7: "近 7 天", range30: "近 30 天", range90: "近 90 天", range365: "近 1 年", rangeAll: "全部",
    refresh: "刷新", asOf: "截至", retry: "重试", loadFail: "统计服务未就绪，请升级插件后重试",
    rangeFrom: "起始日期", rangeTo: "终止日期", rangeClear: "清除自定义范围",
    rangeCustom: "自定义日期范围", rangeIncomplete: "请选择完整的起始与终止日期",
    rangeInvalid: "起始日期不能晚于终止日期",
    sites: "站点总数", bindable: "可绑定", tagged: "有标签", coverage: "标签覆盖率",
    nodes: "目录数", noLink: "无链接", multiLink: "多链接", newSites: "范围内新增站点",
    current: "当前", inRange: "范围内", ofTotal: "占总量",
    links: "链接健康", linksNote: "按站点链接数分桶",
    freshness: "更新新鲜度", freshnessNote: "距最近一次更新",
    nodeDist: "目录分布", nodeNote: "含子树站点数",
    topTags: "标签 Top", topTagsNote: "按关联站点数排序",
    trend: "新增站点 / 目录趋势", trendNote: "按自然日 / 周 / 月分桶",
    siteSeries: "新增站点", nodeSeries: "新增目录",
    stale: "最久未更新", staleNote: "按未更新天数降序",
    duplicates: "重复 URL", duplicatesNote: "归一化后计数 > 1",
    orphans: "无目录站点", orphansNote: "缺少目录映射",
    emptyNodes: "空目录", emptyNodesNote: "含子树 0 个站点",
    colName: "名称", colSubtree: "子树站点", colShare: "占比", colDirect: "直接", colDepth: "层级",
    colUpdated: "最近更新", colAge: "未更新天数", colUrl: "URL", colSites: "站点",
    noStale: "没有陈旧站点", noDup: "没有重复 URL", noOrphan: "所有站点都已归档", noEmpty: "没有空目录",
    noData: "还没有站点。在「站点」页收藏后，这里会自动汇总",
    noTagDomain: "标签插件未启用，标签相关区块已隐藏",
  },
  en: {
    range7: "7 days", range30: "30 days", range90: "90 days", range365: "1 year", rangeAll: "All",
    refresh: "Refresh", asOf: "As of", retry: "Retry", loadFail: "Stats service not ready. Upgrade the plugin and retry.",
    rangeFrom: "Start date", rangeTo: "End date", rangeClear: "Clear custom range",
    rangeCustom: "Custom date range", rangeIncomplete: "Pick both start and end dates",
    rangeInvalid: "Start date must not be after end date",
    sites: "Sites", bindable: "Bindable", tagged: "Tagged", coverage: "Tag coverage",
    nodes: "Folders", noLink: "No link", multiLink: "Multi-link", newSites: "New sites",
    current: "Current", inRange: "In range", ofTotal: "of total",
    links: "Link health", linksNote: "Sites by link count",
    freshness: "Freshness", freshnessNote: "Since last update",
    nodeDist: "Folder distribution", nodeNote: "Sites in subtree",
    topTags: "Top tags", topTagsNote: "By linked sites",
    trend: "New sites / folders", trendNote: "Bucketed by day / week / month",
    siteSeries: "Sites", nodeSeries: "Folders",
    stale: "Stalest sites", staleNote: "Oldest update first",
    duplicates: "Duplicate URLs", duplicatesNote: "Normalized count > 1",
    orphans: "Sites without folder", orphansNote: "Missing folder mapping",
    emptyNodes: "Empty folders", emptyNodesNote: "0 sites in subtree",
    colName: "Name", colSubtree: "Sites", colShare: "Share", colDirect: "Direct", colDepth: "Depth",
    colUpdated: "Updated", colAge: "Days idle", colUrl: "URL", colSites: "Sites",
    noStale: "No stale sites", noDup: "No duplicate URLs", noOrphan: "All sites are filed", noEmpty: "No empty folders",
    noData: "No sites yet. Save one on the Sites page and the summary appears here.",
    noTagDomain: "Tag plugin is not enabled; tag blocks are hidden.",
  },
};

var RANGES = ["7d", "30d", "90d", "365d", "all"];

var CFG_FALLBACK = { "stats.range": "30d", "stats.top": 10, "stats.showKpi": true };

function SitesStatsView(props) {
  var lang = props.lang === "en" ? "en" : "zh";
  var cfg = configView.useConfig(props.api, CFG_FALLBACK);
  if (!cfg.ready) {
    return h("div", { style: { padding: "48px", textAlign: "center", fontSize: "12.5px", opacity: .6 } }, lang === "en" ? "Loading…" : "载入中…");
  }
  return h(SitesStatsBody, Object.assign({}, props, { cfg: cfg.values }));
}

function SitesStatsBody(props) {
  var lang = props.lang === "en" ? "en" : "zh";
  var t = COPY[lang];
  var api = props.api;
  var cfg = props.cfg || {};
  var cfgRange = RANGES.indexOf(cfg["stats.range"]) >= 0 ? cfg["stats.range"] : "30d";
  var cfgTop = Math.floor(Number(cfg["stats.top"]));
  if (!(cfgTop >= 5)) cfgTop = 10;
  if (cfgTop > 20) cfgTop = 20;
  var cfgSections = Array.isArray(cfg["stats.sections"]) ? cfg["stats.sections"] : null;
  function sectionOn(key) { return !cfgSections || cfgSections.indexOf(key) >= 0; }
  var ch = React.useMemo(function () { return charts.makeCharts("wbs"); }, []);
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
    var args = { top: cfgTop };
    if (customOk) { args.from = customFrom; args.to = customTo; } else { args.range = range; }
    return Promise.resolve(api.call("sites.statsReport", args))
      .then(function (r) { return r && r.result !== undefined ? r.result : r; })
      .then(function (d) { if (id === req.current) { setData(d); setErr(""); } })
      .catch(function (e) { if (id === req.current) setErr(String((e && e.message) || e || "load failed")); })
      .then(function () { if (id === req.current) setLoading(false); });
  }, [api, range, customOk, customFrom, customTo]);

  React.useEffect(function () { load(false); }, [load]);

  React.useEffect(function () {
    if (!api || typeof api.subscribe !== "function") return undefined;
    var timer = null;
    var pending = false;
    var off = api.subscribe(function (payload) {
      var ev = payload && payload.event;
      if (ev !== "sites-changed" && ev !== "site-nodes-changed" && ev !== "tags-changed") return;
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
    var tagMissing = rates.tagCoverage === null || rates.tagCoverage === undefined;
    children.push(h("div", { key: "kpi", className: "wbs-kpis" },
      h(ch.Kpi, { label: t.sites, icon: "globe", value: totals.sites, hint: t.current, lang: lang }),
      h(ch.Kpi, { label: t.bindable, icon: "link", value: totals.bindable, hint: ch.pct(rates.bindableRatio) + " " + t.ofTotal, lang: lang }),
      h(ch.Kpi, { label: t.tagged, icon: "tag", value: tagMissing ? "—" : totals.tagged, hint: tagMissing ? t.noTagDomain : ch.pct(rates.tagCoverage) + " " + t.ofTotal, lang: lang }),
      h(ch.Kpi, { label: t.coverage, icon: "pie", value: tagMissing ? "—" : ch.pct(rates.tagCoverage), hint: t.current, tone: tagMissing ? "" : "ok", lang: lang }),
      h(ch.Kpi, { label: t.nodes, icon: "folder", value: totals.nodes, hint: t.current, lang: lang }),
      h(ch.Kpi, { label: t.noLink, icon: "unlink", value: totals.noLink, hint: ch.pct(rates.linkCoverage) + " " + t.ofTotal, tone: totals.noLink > 0 ? "warn" : "", lang: lang }),
      h(ch.Kpi, { label: t.multiLink, icon: "layers", value: totals.multiLink, hint: t.current, lang: lang }),
      h(ch.Kpi, { label: t.newSites, icon: "plus", value: totals.newSites, hint: t.inRange, lang: lang }),
    ));

    if (totals.sites === 0 && totals.nodes === 0) {
      children.push(h(ch.Card, { key: "empty", span: 12 }, h(ch.Empty, { text: t.noData })));
    } else {
      children.push(h(ch.Card, { key: "links", span: 4, title: t.links, note: t.linksNote },
        h(ch.Donut, {
          data: (b.links || []).map(function (x, i) { return { key: x.key, label: x.label, count: x.count, color: ch.colors[i] }; }),
          total: totals.sites, lang: lang, centerLabel: t.sites,
          aria: (b.links || []).map(function (x) { return x.label + " " + x.count; }).join("，"),
        })));
      children.push(h(ch.Card, { key: "fresh", span: 4, title: t.freshness, note: t.freshnessNote },
        h(ch.Histogram, { data: b.freshness || [], lang: lang, color: ch.colors[2] })));
      children.push(h(ch.Card, { key: "nodes", span: 4, title: t.nodeDist, note: t.nodeNote },
        h(ch.BarList, {
          data: ((data.rankings && data.rankings.topNodes) || []).map(function (x) {
            return { key: x.id, label: x.name, value: x.subtree, title: x.name };
          }),
          lang: lang, color: ch.colors[0],
        })));
      children.push(h(ch.Card, { key: "trend", span: 8, title: t.trend, note: t.trendNote },
        h(ch.Trend, {
          data: data.trend || [], lang: lang,
          series: [
            { key: "sites", label: t.siteSeries, color: ch.colors[0] },
            { key: "nodes", label: t.nodeSeries, color: ch.colors[1] },
          ],
        })));
      children.push(h(ch.Card, { key: "topTags", span: 4, title: t.topTags, note: t.topTagsNote },
        tagMissing ? h(ch.Empty, { text: t.noTagDomain }) : h(ch.BarList, {
          data: ((data.rankings && data.rankings.topTags) || []).map(function (x) {
            return { key: x.id, label: x.name, value: x.count, title: x.name };
          }),
          lang: lang, color: ch.colors[4],
        })));
      children.push(h(ch.Card, { key: "stale", span: 6, title: t.stale, note: t.staleNote },
        h(ch.DataTable, {
          rows: (data.lists && data.lists.stale) || [], lang: lang, empty: t.noStale,
          columns: [
            { key: "name", label: t.colName },
            { key: "ageDays", label: t.colAge, num: true },
            { key: "updatedAt", label: t.colUpdated, render: function (r) { return ch.dateText(r.updatedAt); } },
          ],
        })));
      children.push(h(ch.Card, { key: "dup", span: 6, title: t.duplicates, note: t.duplicatesNote },
        h(ch.DataTable, {
          rows: (data.lists && data.lists.duplicates) || [], lang: lang, empty: t.noDup,
          columns: [
            { key: "url", label: t.colUrl, render: function (r) { return h("span", { title: r.url }, String(r.url).slice(0, 46) + (String(r.url).length > 46 ? "…" : "")); } },
            { key: "sites", label: t.colSites, render: function (r) { return (r.sites || []).map(function (s) { return s.name; }).join("、"); } },
          ],
        })));
      children.push(h(ch.Card, { key: "orphan", span: 6, title: t.orphans, note: t.orphansNote },
        h(ch.DataTable, {
          rows: (data.lists && data.lists.orphanSites) || [], lang: lang, empty: t.noOrphan,
          columns: [{ key: "name", label: t.colName }],
        })));
      children.push(h(ch.Card, { key: "emptyNodes", span: 6, title: t.emptyNodes, note: t.emptyNodesNote },
        h(ch.DataTable, {
          rows: (data.lists && data.lists.emptyNodes) || [], lang: lang, empty: t.noEmpty,
          columns: [
            { key: "name", label: t.colName },
            { key: "depth", label: t.colDepth, num: true },
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

  return h("div", { className: "wbs-stats" },
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
    h("div", { className: "wbs-sgrid" }, children),
  );
}

module.exports = { SitesStatsView: SitesStatsView };
