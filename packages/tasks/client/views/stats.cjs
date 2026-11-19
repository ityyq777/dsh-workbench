// 任务统计视图：一次拉取 tasks.statsReport，区块化渲染。
var React = require("react");
var h = React.createElement;
var charts = require("../stats/charts.cjs");
var configView = require("./config.cjs");
var recentColumns = require("../item/recent-columns.cjs");
var taskTitle = require("../stats/task-link.cjs");
var rankingName = require("../item/ranking-name.cjs");
var Heatmap = require("../stats/heatmap.cjs");
var Today = require("../stats/today.cjs");
var TimelineSection = require("../stats/timeline-section.cjs").TimelineSection;
var listState = require("../stats/list-state.cjs");

var COPY = {
  zh: {
    title: "任务统计", range7: "近 7 天", range30: "近 30 天", range90: "近 90 天", range365: "近 1 年", rangeAll: "全部",
    secToday: "今日", secTodayNote: "服务端当日快照，不随上方时间范围变化",
    secHealth: "总体健康度", secHealthNote: "存量口径；「范围内」两项跟随时间范围",
    secActivity: "活动与趋势", secActivityNote: "事件趋势跟随时间范围，年度活动覆盖整年",
    secDist: "分布", secDistNote: "当前存量结构，点柱形可下钻到记录页",
    secRisk: "风险", secRiskNote: "当前存量；账龄与清单同一口径",
    secRank: "排行", secRankNote: "按任务表 / 任务组 / 工作区聚合",
    refresh: "刷新", asOf: "截至", retry: "重试", loadFail: "统计服务未就绪，请升级插件后重试",
    rangeFrom: "起始日期", rangeTo: "终止日期", rangeClear: "清除自定义范围",
    rangeCustom: "自定义日期范围", rangeIncomplete: "请选择完整的起始与终止日期",
    rangeInvalid: "起始日期不能晚于终止日期",
    total: "总任务", active: "已开启", overdue: "逾期", completion: "完成率",
    dueToday: "今日到期", dueNext7: "未来 7 天到期", newInRange: "范围内新增", avgCycle: "平均完成周期",
    days: "天", current: "当前", inRange: "范围内", ofTotal: "占总量", ofActive: "占已开启",
    eventTrend: "事件趋势", eventTrendNote: "与年度活动同口径；按日 / 周 / 月分桶，目标按计划完成日期统计",
    publish: "发布", target: "目标", evShutdown: "关闭", evClaimed: "接取",
    created: "新增", done: "完成", due: "到期",
    status: "状态构成", statusNote: "当前存量",
    priority: "优先级分布", priorityNote: "当前存量；不含已关闭/已完成；点柱形查看任务",
    pickHint: "点击柱形查看对应任务",
    difficulty: "难度分布", difficultyNote: "当前存量；包含未设置", difficultyMissing: "未填难度 {n} 条", difficultyMissingLink: "查看并补齐难度",
    difficultyDimension: "难度分布口径", dimAll: "全部", dimDone: "完成", dimPublish: "发布", dimClaimed: "接取", dimShutdown: "关闭",
    difficultyNoteRange: "年度活动口径 {from} ~ {to}；包含未设置",
    aging: "逾期账龄", agingNote: "当前逾期任务",
    overdueList: "逾期清单", overdueNote: "按账龄降序",
    tables: "任务表排行", tablesNote: "按已开启 + 逾期权重",
    groups: "任务组排行", groupsNote: "一级任务组",
    workspaces: "工作区排行", workspacesNote: "存量口径；任务可挂多个工作区，各行合计可能大于任务总数",
    noWorkspaceRow: "未关联工作区", noWorkspaceNote: "正常状态：这些任务没有归属任何工作区", noWorkspacesEmpty: "还没有工作区，也没有未关联工作区的任务",
    colName: "名称", colTotal: "总数", colOpen: "已开启", colOverdue: "逾期", colDone: "已完成", colRate: "完成率",
    colTitle: "任务", colTarget: "计划完成", colAge: "逾期天数", colTable: "任务表",
    recentTasks: "最近任务", recentTasksNote: "切换维度查看最近发布 / 完成 / 关闭 / 接取的任务",
    recentTabPublish: "最近发布", recentTabDone: "最近完成", recentTabShutdown: "最近关闭", recentTabClaimed: "最近接取",
    recentPublish: "最近发布", recentPublishNote: "按发布日期倒序", noRecentPublish: "还没有发布的任务",
    recentDone: "最近完成", recentDoneNote: "按完成日期倒序", recentShutdown: "最近关闭", recentShutdownNote: "按关闭日期倒序",
    colDate: "日期", noRecentDone: "还没有已完成的任务", noRecentShutdown: "还没有已关闭的任务",
    noRecentClaimed: "还没有已接取的任务（接取时间只记录 5.2.15 之后的操作）",
    noOverdue: "没有逾期任务", noData: "还没有任务。在「记录」里创建后，这里会自动汇总",
    open: "已开启", claimed: "已接取", shutdown: "已关闭", restarted: "已重启",
  },
  en: {
    title: "Task stats", range7: "7 days", range30: "30 days", range90: "90 days", range365: "1 year", rangeAll: "All",
    secToday: "Today", secTodayNote: "Server-side snapshot for today; the range above does not affect it",
    secHealth: "Health", secHealthNote: "Current stock; the two in-range figures follow the range above",
    secActivity: "Activity & trend", secActivityNote: "The event trend follows the range; annual activity covers the whole year",
    secDist: "Distribution", secDistNote: "Current stock; click a bar to list matching tasks",
    secRisk: "Risk", secRiskNote: "Current stock; aging and the overdue list share one scope",
    secRank: "Rankings", secRankNote: "Grouped by task table / group / workspace",
    refresh: "Refresh", asOf: "As of", retry: "Retry", loadFail: "Stats service not ready. Upgrade the plugin and retry.",
    rangeFrom: "Start date", rangeTo: "End date", rangeClear: "Clear custom range",
    rangeCustom: "Custom date range", rangeIncomplete: "Pick both start and end dates",
    rangeInvalid: "Start date must not be after end date",
    total: "Tasks", active: "Active", overdue: "Overdue", completion: "Completion",
    dueToday: "Due today", dueNext7: "Due next 7d", newInRange: "New in range", avgCycle: "Avg cycle",
    days: "d", current: "Current", inRange: "In range", ofTotal: "of total", ofActive: "of active",
    eventTrend: "Event trend", eventTrendNote: "Same scope as annual activity; bucketed by day / week / month, target by planned date",
    publish: "Published", target: "Target", evShutdown: "Closed", evClaimed: "Claimed",
    created: "Created", done: "Done", due: "Due",
    status: "Status", statusNote: "Current",
    priority: "Priority", priorityNote: "Current; excludes closed/completed; click a bar to list tasks",
    pickHint: "Click a bar to list matching tasks",
    difficulty: "Difficulty", difficultyNote: "Current; includes unset", difficultyMissing: "{n} tasks without difficulty", difficultyMissingLink: "Review missing difficulty",
    difficultyDimension: "Difficulty scope", dimAll: "All", dimDone: "Done", dimPublish: "Published", dimClaimed: "Claimed", dimShutdown: "Closed",
    difficultyNoteRange: "Annual activity scope {from} ~ {to}; includes unset",
    aging: "Overdue aging", agingNote: "Current overdue",
    overdueList: "Overdue list", overdueNote: "Oldest first",
    tables: "Task tables", tablesNote: "Weighted by active + overdue",
    groups: "Task groups", groupsNote: "First-level groups",
    workspaces: "Workspaces", workspacesNote: "Current stock; a task can sit in several workspaces, so rows may add up to more than the total",
    noWorkspaceRow: "No workspace", noWorkspaceNote: "Normal state: these tasks belong to no workspace", noWorkspacesEmpty: "No workspaces and no tasks without one yet",
    colName: "Name", colTotal: "Total", colOpen: "Active", colOverdue: "Overdue", colDone: "Done", colRate: "Completion",
    colTitle: "Task", colTarget: "Target", colAge: "Days late", colTable: "Table",
    recentTasks: "Recent tasks", recentTasksNote: "Switch the dimension: recently published / completed / closed / claimed",
    recentTabPublish: "Published", recentTabDone: "Completed", recentTabShutdown: "Closed", recentTabClaimed: "Claimed",
    recentPublish: "Recently published", recentPublishNote: "Newest publication first", noRecentPublish: "No published tasks yet",
    recentDone: "Recently completed", recentDoneNote: "Newest completion first", recentShutdown: "Recently closed", recentShutdownNote: "Newest closure first",
    colDate: "Date", noRecentDone: "No completed tasks yet", noRecentShutdown: "No closed tasks yet",
    noRecentClaimed: "No claimed tasks yet (claim time is only recorded after 5.2.15)",
    noOverdue: "No overdue tasks", noData: "No tasks yet. Create one in Tasks and the summary appears here.",
    open: "Active", shutdown: "Closed", restarted: "Restarted",
  },
};

var RANGES = ["7d", "30d", "90d", "365d", "all"];

// 清单卡片的入参：缺键 → 能力降级提示；键存在但为空 → 真正的空态。
function listProps(data, key, lang, rest) {
  var st = listState.listState(data, key);
  return Object.assign({ rows: st.rows, missing: st.missing, missingText: listState.missingText(lang, key) }, rest);
}

// 优先级 0（已关闭/已完成）不画；难度未设置保留并提供补齐入口。
function visibleBins(list) {
  return (list || []).filter(function (b) { return !b.hidden; });
}

// 柱形点击→任务列表：单值桶直接映射成区间上下限，未设置桶走 difficultyMissing。
// 传空参数让 task-filter-model.navigation 走「全局范围」分支，顺带清掉表/组/关键词/标签/日期。
function priorityPicker(onNavigate) {
  if (typeof onNavigate !== "function") return null;
  return function (bin) {
    var n = Number(bin && bin.key);
    if (!Number.isInteger(n) || n < 1 || n > 10) return;
    onNavigate("tasks", { priorityMin: n, priorityMax: n });
  };
}

// 维度页签下的柱形跳转要带上同一事件区间，否则跳过去看到的数字会对不上。
function difficultyPicker(onNavigate, dimension, range) {
  if (typeof onNavigate !== "function") return null;
  return function (bin) {
    var key = bin && bin.key;
    if (key === "unset") { onNavigate("tasks", { difficultyMissing: true }); return; }
    var n = Number(key);
    if (!(n >= 0.5 && n <= 5)) return;
    if (!dimension || dimension === "all") {
      onNavigate("tasks", { difficultyMin: n, difficultyMax: n });
      return;
    }
    var params = { filterRoot: true, difficultyMin: n, difficultyMax: n };
    if (range && range.from && range.to) {
      params[dimension + "From"] = range.from;
      params[dimension + "To"] = range.to;
    }
    onNavigate("tasks", params);
  };
}

var CFG_FALLBACK = { "stats.range": "30d", "stats.top": 10, "stats.showKpi": true, "stats.recentPublishLimit": 10, "stats.recentDoneLimit": 10, "stats.recentShutdownLimit": 10, "stats.recentClaimedLimit": 10 };

function TasksStatsView(props) {
  var lang = props.lang === "en" ? "en" : "zh";
  var cfg = configView.useConfig(props.api, CFG_FALLBACK);
  if (!cfg.ready) {
    return h("div", { style: { padding: "48px", textAlign: "center", fontSize: "12.5px", opacity: .6 } }, lang === "en" ? "Loading…" : "载入中…");
  }
  return h(TasksStatsBody, Object.assign({}, props, { cfg: cfg.values }));
}

function TasksStatsBody(props) {
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
  var ch = React.useMemo(function () { return charts.makeCharts("wbt"); }, []);
  var rangePair = React.useState(cfgRange);
  var range = rangePair[0], setRange = rangePair[1];
  // 难度分布口径：默认「全部」= 现有存量口径，删掉数据依赖，切换只重取一次 statsReport。
  var dimPair = React.useState("all");
  var dimension = dimPair[0], setDimension = dimPair[1];
  // 「最近任务」卡的维度切换：只换行数据与空态，不写配置、不持久化。
  var recentPair = React.useState("publish");
  var recentType = recentPair[0], setRecentType = recentPair[1];
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

  function cfgLimit(key) {
    var n = Number(cfg[key]);
    if (!Number.isFinite(n)) return 10;
    return Math.max(1, Math.min(50, Math.floor(n)));
  }

  var load = React.useCallback(function (silent) {
    // 起止日期只填了一半或顺序颠倒时先不发请求，保留上一份结果，避免闪回预设范围。
    if ((customFrom || customTo) && !customOk) return Promise.resolve();
    var id = ++req.current;
    if (!silent) setLoading(true);
    var args = {
      dimension: dimension,
      top: cfgTop,
      recentPublishLimit: cfgLimit("stats.recentPublishLimit"),
      recentDoneLimit: cfgLimit("stats.recentDoneLimit"),
      recentShutdownLimit: cfgLimit("stats.recentShutdownLimit"),
      recentClaimedLimit: cfgLimit("stats.recentClaimedLimit"),
    };
    if (customOk) { args.from = customFrom; args.to = customTo; } else { args.range = range; }
    return Promise.resolve(api.call("tasks.statsReport", args))
      .then(function (r) { return r && r.result !== undefined ? r.result : r; })
      .then(function (d) {
        if (id !== req.current) return;
        setData(d); setErr("");
      })
      .catch(function (e) {
        if (id !== req.current) return;
        setErr(String((e && e.message) || e || "load failed"));
      })
      .then(function () { if (id === req.current) setLoading(false); });
  }, [api, range, dimension, customOk, customFrom, customTo, cfgTop, cfg]);

  React.useEffect(function () { if (props.active !== false) load(true); }, [load, props.active]);

  React.useEffect(function () {
    if (props.active === false || !api || typeof api.subscribe !== "function") return undefined;
    var timer = null;
    var pending = false;
    var off = api.subscribe(function (payload) {
      var ev = payload && payload.event;
      if (ev !== "tasks-changed" && ev !== "task-nodes-changed") return;
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
  }, [api, load, props.active]);

  var options = RANGES.map(function (key) {
    return { key: key, label: t["range" + (key === "all" ? "All" : key.replace("d", ""))] };
  });

  // 页面按「先结论后明细」分区：今日 → 健康度 → 活动 → 分布 → 风险 → 排行 → 明细。
  // 分区只承担视觉与读屏层级，区块开关仍是卡片粒度的 stats.sections。
  var children = [];
  var totals = data ? data.totals || {} : {};
  var rates = data ? data.rates || {} : {};
  var b = data ? data.breakdowns || {} : {};

  if (!data && loading) children.push(h(ch.Skeleton, { key: "sk" }));
  if (!data && !loading && err) {
    children.push(h(ch.Card, { key: "err", span: 12 }, h(ch.Empty, { text: t.loadFail })));
  }

  // ① 今日：服务端当日快照，独立于存量与上方时间范围；存量归零时也照常显示。
  if (data) {
    children.push(h(ch.Section, { key: "today", title: t.secToday, note: t.secTodayNote },
      data.today ? h(Today, { today: data.today, lang: lang }) : null));
  }

  if (data && totals.total === 0) {
    children.push(h(ch.Card, { key: "empty", span: 12 }, h(ch.Empty, { text: t.noData })));
  }

  if (data && totals.total > 0) {
    // ② 健康度：4 张核心指标给足字号，4 张次级指标收一行，避免 8 张 KPI 抢同一层视觉重量。
    if (cfg["stats.showKpi"] !== false) {
      children.push(h(ch.Section, { key: "health", title: t.secHealth, note: t.secHealthNote }, [
        h("div", { key: "kpiMain", className: "wbt-kpis wbt-kpis-main" },
          h(ch.Kpi, { label: t.total, value: totals.total, hint: t.current, size: "lg", lang: lang }),
          h(ch.Kpi, { label: t.active, value: totals.active, hint: t.ofTotal + " " + ch.pct(totals.total ? totals.active / totals.total : 0), size: "lg", lang: lang }),
          h(ch.Kpi, { label: t.overdue, value: totals.overdue, hint: t.ofActive + " " + ch.pct(rates.overdue), tone: totals.overdue > 0 ? "danger" : "", size: "lg", lang: lang }),
          h(ch.Kpi, { label: t.completion, value: ch.pct(rates.completion), hint: totals.done + " / " + totals.total, tone: "ok", size: "lg", lang: lang }),
        ),
        h("div", { key: "kpiSub", className: "wbt-kpis wbt-kpis-sub" },
          h(ch.Kpi, { label: t.dueToday, value: totals.dueToday, hint: t.current, tone: totals.dueToday > 0 ? "warn" : "", size: "sm", lang: lang }),
          h(ch.Kpi, { label: t.dueNext7, value: totals.dueNext7, hint: t.current, size: "sm", lang: lang }),
          h(ch.Kpi, { label: t.newInRange, value: totals.newInRange, hint: t.inRange, size: "sm", lang: lang }),
          h(ch.Kpi, { label: t.avgCycle, value: rates.avgCycleDays === null || rates.avgCycleDays === undefined ? "—" : rates.avgCycleDays, unit: t.days, hint: t.inRange, size: "sm", lang: lang }),
        ),
      ]));
    }

    // ③ 活动与趋势：事件趋势跟随时间范围；年度活动热力图按整年，两者同口径同配色。
    var activity = [];
    if (sectionOn("eventTrend")) {
      activity.push(h(ch.Card, { key: "eventTrend", span: 12, title: t.eventTrend, note: t.eventTrendNote },
        h(ch.Trend, {
          data: data.eventTrend || [], lang: lang,
          // 顺序按用户要求：发布 → 目标 → 接取 → 关闭 → 完成；
          // 颜色跟着含义走不跟着位置走（换序不换色），否则读者要重新认一遍颜色。
          series: [
            { key: "publish", label: t.publish, color: ch.colors[0] },
            { key: "target", label: t.target, color: ch.colors[5] },
            { key: "claimed", label: t.evClaimed, color: ch.colors[2] },
            { key: "shutdown", label: t.evShutdown, color: ch.colors[3] },
            { key: "done", label: t.done, color: ch.colors[1] },
          ],
        })));
    }
    activity.push(h(Heatmap, { key: "heatmap", api: api, lang: lang, active: props.active, onNavigate: props.onNavigate }));
    children.push(h(ch.Section, { key: "activity", title: t.secActivity, note: t.secActivityNote }, activity));

    // ④ 分布：状态 / 优先级 / 难度三张结构图等宽一行。
    var dist = [];
    if (sectionOn("status")) {
      var statusData = (b.status || []).filter(function (s) { return Object.prototype.hasOwnProperty.call(ch.statusColors, s.key); }).map(function (s) {
        return { key: s.key, label: String(s.key) === "0" ? t.open : String(s.key) === "1" ? t.shutdown : String(s.key) === "4" ? t.claimed : t.colDone, count: s.count, color: ch.statusColors[s.key] };
      });
      var statusTotal = statusData.reduce(function (sum, s) { return sum + Number(s.count || 0); }, 0);
      dist.push(h(ch.Card, { key: "status", span: 4, title: t.status, note: t.statusNote },
        h(ch.Donut, {
          data: statusData,
          total: statusTotal, lang: lang, centerLabel: t.total,
          aria: t.total + " " + statusTotal + "; " + statusData.map(function (s) { return s.label + " " + s.count; }).join("; "),
        })));
    }
    if (sectionOn("priority")) {
      dist.push(h(ch.Card, { key: "priority", span: 4, title: t.priority, note: t.priorityNote },
        h(ch.Histogram, { data: visibleBins(b.priority), lang: lang, color: ch.colors[0], onSelect: priorityPicker(props.onNavigate), selectHint: lang === "en" ? "click to list" : "点击查看任务" })));
    }
    if (sectionOn("difficulty")) {
      var missingBin = (b.difficulty || []).find(function (bin) { return bin.key === "unset"; });
      var dims = [["all", t.dimAll], ["done", t.dimDone], ["publish", t.dimPublish], ["claimed", t.dimClaimed], ["shutdown", t.dimShutdown]];
      var rangeBox = data.range || {};
      var diffNote = dimension === "all" ? t.difficultyNote
        : t.difficultyNoteRange.replace("{from}", String(rangeBox.from || "")).replace("{to}", String(rangeBox.to || ""));
      dist.push(h(ch.Card, { key: "difficulty", span: 4, title: t.difficulty, note: diffNote },
        h("div", { className: "wbt-dims", role: "tablist", "aria-label": t.difficultyDimension },
          dims.map(function (item) {
            return h("button", {
              key: item[0], type: "button", role: "tab", className: "wbt-dims-tab",
              "aria-selected": dimension === item[0],
              onClick: function () { setDimension(item[0]); },
            }, item[1]);
          })),
        h(ch.Histogram, { data: (b.difficulty || []).map(function (bin) { return bin.key === "unset" ? Object.assign({}, bin, { label: lang === "en" ? "Unset" : "未设置" }) : bin; }), lang: lang, color: ch.colors[4], onSelect: difficultyPicker(props.onNavigate, dimension, dims.length ? (data.range || null) : null), selectHint: lang === "en" ? "click to list" : "点击查看任务" }),
        h("p", null, t.difficultyMissing.replace("{n}", String(missingBin ? missingBin.count : 0)), " ",
          typeof props.onNavigate === "function" ? h("button", { type: "button", className: "wbt-btn ghost", onClick: function () { props.onNavigate("tasks", { difficultyMissing: true }); } }, t.difficultyMissingLink) : null)));
    }
    children.push(h(ch.Section, { key: "distribution", title: t.secDist, note: t.secDistNote }, dist));

    // ⑤ 风险：逾期账龄与逾期清单并排，方便一眼对上「多老了」和「是哪些」。
    var risk = [];
    if (sectionOn("aging")) {
      risk.push(h(ch.Card, { key: "aging", span: 6, title: t.aging, note: t.agingNote },
        h(ch.Histogram, { data: data.aging || [], lang: lang, color: ch.colors[2] })));
    }
    if (sectionOn("overdue")) {
      risk.push(h(ch.Card, { key: "overdue", span: 6, title: t.overdueList, note: t.overdueNote },
        h(ch.DataTable, listProps(data, "overdue", lang, {
          lang: lang, empty: t.noOverdue,
          columns: [
            { key: "title", label: t.colTitle, render: taskTitle(lang, props.onNavigate) },
            { key: "targetDate", label: t.colTarget },
            { key: "daysOverdue", label: t.colAge, num: true },
            { key: "tableTitle", label: t.colTable },
          ],
        }))));
    }
    children.push(h(ch.Section, { key: "risk", title: t.secRisk, note: t.secRiskNote }, risk));

    // ⑥ 排行：任务表与任务组并排，工作区整行（一行一句口径说明，窄屏也不挤）。
    var rank = [];
    if (sectionOn("tables")) {
      rank.push(h(ch.Card, { key: "tables", span: 6, title: t.tables, note: t.tablesNote },
        h(ch.DataTable, {
          rows: (data.rankings && data.rankings.tables) || [], lang: lang,
          columns: [
            rankingName(t, lang, props.onNavigate, "table"),
            { key: "total", label: t.colTotal, num: true },
            { key: "open", label: t.colOpen, num: true },
            { key: "overdue", label: t.colOverdue, num: true },
            { key: "completion", label: t.colRate, num: true, render: function (r) { return ch.pct(r.completion); } },
          ],
        })));
    }
    if (sectionOn("groups")) {
      rank.push(h(ch.Card, { key: "groups", span: 6, title: t.groups, note: t.groupsNote },
        h(ch.DataTable, {
          rows: (data.rankings && data.rankings.groups) || [], lang: lang,
          columns: [
            rankingName(t, lang, props.onNavigate, "group"),
            { key: "total", label: t.colTotal, num: true },
            { key: "open", label: t.colOpen, num: true },
            { key: "overdue", label: t.colOverdue, num: true },
            { key: "completion", label: t.colRate, num: true, render: function (r) { return ch.pct(r.completion); } },
          ],
        })));
    }
    if (sectionOn("workspaces")) {
      var wsRows = ((data.rankings && data.rankings.workspaces) || []).slice();
      var noneRow = data.rankings && data.rankings.noWorkspace;
      if (noneRow && (wsRows.length || noneRow.total > 0)) {
        wsRows.push(Object.assign({}, noneRow, { title: t.noWorkspaceRow }));
      }
      rank.push(h(ch.Card, { key: "workspaces", span: 12, title: t.workspaces, note: t.workspacesNote },
        h(ch.DataTable, {
          rows: wsRows, lang: lang, empty: t.noWorkspacesEmpty,
          columns: [
            rankingName(t, lang, props.onNavigate, "workspace"),
            { key: "total", label: t.colTotal, num: true },
            { key: "open", label: t.colOpen, num: true },
            { key: "overdue", label: t.colOverdue, num: true },
            { key: "completion", label: t.colRate, num: true, render: function (r) { return ch.pct(r.completion); } },
          ],
        })));
    }
    children.push(h(ch.Section, { key: "rank", title: t.secRank, note: t.secRankNote }, rank));

    // ⑦ 时间线：区块自带卡片标题，不再套一层分区标题，避免同一句话出现两次。
    if (sectionOn("timeline")) {
      children.push(h(TimelineSection, { key: "timeline", api: api, lang: lang, active: props.active, ch: ch }));
    }

    // ⑧ 明细：最近任务四维度共用一张整行卡。
    if (sectionOn("recent")) {
      var recentCols = recentColumns(t, lang, props.onNavigate);
      var recentTabs = [
        ["publish", t.recentTabPublish, "recentPublish", t.noRecentPublish],
        ["done", t.recentTabDone, "recentDone", t.noRecentDone],
        ["shutdown", t.recentTabShutdown, "recentShutdown", t.noRecentShutdown],
        ["claimed", t.recentTabClaimed, "recentClaimed", t.noRecentClaimed],
      ];
      var recentTab = recentTabs[0];
      recentTabs.forEach(function (item) { if (item[0] === recentType) recentTab = item; });
      children.push(h(ch.Card, { key: "recent", span: 12, title: t.recentTasks, note: t.recentTasksNote },
        h("div", { className: "wbt-dims", role: "tablist", "aria-label": t.recentTasks },
          recentTabs.map(function (item) {
            return h("button", {
              key: item[0], type: "button", role: "tab", className: "wbt-dims-tab",
              "aria-selected": recentType === item[0],
              onClick: function () { setRecentType(item[0]); },
            }, item[1]);
          })),
        h(ch.DataTable, listProps(data, recentTab[2], lang, { lang: lang, empty: recentTab[3], columns: recentCols }))));
    }
  }

  if (data) children.push(h(ch.Warnings, { key: "warn", items: data.warnings || [] }));

  return h("div", { className: "wbt-stats" },
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
    h("div", { className: "wbt-sgrid" }, children),
  );
}

module.exports = { TasksStatsView: TasksStatsView };
