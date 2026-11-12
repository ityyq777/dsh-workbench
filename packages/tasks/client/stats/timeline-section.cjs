// 时间线统计区块：一次拉取 tasks.timelineStats，排行、分布与逾期独立成卡。
// 成员明细按需调用 tasks.timeline，不在排行里逐条预取。
var React = require("react");
var h = React.createElement;

var COPY = {
  zh: {
    title: "时间线", note: "当前存量；已重启任务不计入，无时间线不是错误",
    lines: "时间线", withTasks: "有任务", empty: "空线", emptyRatio: "空线占比",
    tasks: "有效任务", coverage: "归属覆盖率", unassigned: "未归属 {n} 条",
    distribution: "规模分布", distributionNote: "按每条线有效任务数",
    ranking: "时间线排行", rankingNote: "全量聚合后取前 100，同数按 id 升序",
    overdue: "逾期时间线", overdueNote: "按逾期任务数降序",
    trend: "范围内趋势", trendNote: "只统计范围内事件，不改变存量",
    colName: "时间线", colTotal: "任务", colOpen: "已开启", colDone: "已完成", colShutdown: "已关闭", colRate: "完成率", colOverdue: "逾期", colActivity: "最近活动",
    members: "成员", memberEmpty: "没有有效成员",
    loadFail: "时间线统计暂不可用", noData: "还没有时间线。在「时间线」里创建后会出现在这里",
    noOverdue: "没有逾期时间线",
    newLines: "新增时间线", newTasks: "新增任务", doneTasks: "完成任务",
  },
  en: {
    title: "Timelines", note: "Current stock; restarted tasks excluded, no timeline is not an error",
    lines: "Timelines", withTasks: "With tasks", empty: "Empty", emptyRatio: "Empty share",
    tasks: "Active tasks", coverage: "Coverage", unassigned: "{n} unassigned",
    distribution: "Size distribution", distributionNote: "By active tasks per line",
    ranking: "Timeline ranking", rankingNote: "Full aggregation, top 100, ties by id",
    overdue: "Overdue timelines", overdueNote: "By overdue count",
    trend: "In-range trend", trendNote: "Events only; stock unchanged",
    colName: "Timeline", colTotal: "Tasks", colOpen: "Active", colDone: "Done", colShutdown: "Closed", colRate: "Completion", colOverdue: "Overdue", colActivity: "Last activity",
    members: "Members", memberEmpty: "No active members",
    loadFail: "Timeline stats unavailable", noData: "No timelines yet. Create one and it appears here.",
    noOverdue: "No overdue timelines",
    newLines: "New timelines", newTasks: "New tasks", doneTasks: "Done tasks",
  },
};

function text(lang) { return COPY[lang === "en" ? "en" : "zh"]; }
function fmt(v) { return v === null || v === undefined ? "—" : v; }

// 纯渲染：输入统计回执与展开状态，输出卡片数组，便于无浏览器断言。
function buildSection(data, ctx) {
  var ch = ctx.ch, t = ctx.t, lang = ctx.lang;
  var members = ctx.members || {}, openId = ctx.openId || "", toggle = ctx.toggle || function () {};
  var totals = data.totals || {};
  var rows = (data.top && data.top.records) || [];
  var children = [];
  children.push(h(ch.Card, { key: "tl", span: 12, title: t.title, note: t.note },
    h("div", { className: "wbt-kpis" },
      h(ch.Kpi, { label: t.lines, value: fmt(totals.timelines), hint: t.emptyRatio + " " + fmt(totals.emptyRatio) + (totals.emptyRatio === null ? "" : "%"), lang: lang }),
      h(ch.Kpi, { label: t.withTasks, value: fmt(totals.timelinesWithTasks), hint: t.empty + " " + fmt(totals.emptyTimelines), lang: lang }),
      h(ch.Kpi, { label: t.empty, value: fmt(totals.emptyTimelines), tone: totals.emptyTimelines > 0 ? "warn" : "", hint: t.emptyRatio + " " + fmt(totals.emptyRatio) + (totals.emptyRatio === null ? "" : "%"), lang: lang }),
      h(ch.Kpi, { label: t.coverage, value: totals.coverage === null || totals.coverage === undefined ? "—" : ch.pct(totals.coverage / 100), hint: t.unassigned.replace("{n}", String(fmt(totals.unassignedTasks))) + " / " + fmt(totals.tasks), lang: lang }),
    ),
    totals.timelines === 0 ? h(ch.Empty, { text: t.noData }) : null,
    totals.timelines > 0 ? h("table", { className: "wbt-table", "data-ranking": t.ranking },
      h("thead", null, h("tr", null,
        h("th", null, t.colName), h("th", null, t.colTotal), h("th", null, t.colOpen), h("th", null, t.colDone),
        h("th", null, t.colShutdown), h("th", null, t.colRate), h("th", null, t.colOverdue), h("th", null, t.colActivity))),
      h("tbody", null, rows.map(function (line) {
        var memberRows = members[line.id];
        var expanded = openId === line.id;
        return h(React.Fragment, { key: line.id },
          h("tr", null,
            h("td", null, h("button", {
              type: "button", className: "wbt-btn ghost", "aria-expanded": expanded,
              onClick: function () { toggle(line); },
            }, line.title || line.id)),
            h("td", { className: "num" }, line.taskCount),
            h("td", { className: "num" }, line.openCount),
            h("td", { className: "num" }, line.doneCount),
            h("td", { className: "num" }, line.shutdownCount),
            h("td", { className: "num" }, line.doneRate === null || line.doneRate === undefined ? "—" : ch.pct(line.doneRate / 100)),
            h("td", { className: "num" }, line.overdueCount),
            h("td", null, line.lastActivityDate || "—")),
          expanded ? h("tr", { key: line.id + "-members" }, h("td", { colSpan: 8 },
            h("div", { className: "wbt-tl-members" },
              h("strong", null, t.members + "："),
              memberRows === undefined ? h("span", null, "…")
                : memberRows.length === 0 ? h("span", null, t.memberEmpty)
                  : h("span", null, memberRows.map(function (task) { return task.title; }).join("、"))))) : null);
      })),
      h("caption", null, (data.top && data.top.truncated ? (lang === "en" ? "Showing the first " + rows.length + ". " : "仅显示前 " + rows.length + " 条。") : "") + t.rankingNote)) : null,
  ));

  if (totals.timelines > 0) {
    children.push(h(ch.Card, { key: "tldist", span: 6, title: t.distribution, note: t.distributionNote },
      h(ch.Histogram, { data: data.distribution || [], lang: lang, color: ch.colors[3] })));
    var overdue = (data.overdue && data.overdue.lines) || [];
    children.push(h(ch.Card, { key: "tloverdue", span: 6, title: t.overdue, note: t.overdueNote },
      h(ch.DataTable, {
        rows: overdue, lang: lang, empty: t.noOverdue,
        columns: [
          { key: "title", label: t.colName },
          { key: "taskCount", label: t.colTotal, num: true },
          { key: "overdueCount", label: t.colOverdue, num: true },
          { key: "lastActivityDate", label: t.colActivity },
        ],
      })));
  }
  if (data.trend) {
    children.push(h(ch.Card, { key: "tltrend", span: 12, title: t.trend, note: t.trendNote },
      h("div", { className: "wbt-kpis" },
        h(ch.Kpi, { label: t.newLines, value: data.trend.newTimelines, hint: data.trend.from + " ~ " + data.trend.to, lang: lang }),
        h(ch.Kpi, { label: t.newTasks, value: data.trend.newTasks, lang: lang }),
        h(ch.Kpi, { label: t.doneTasks, value: data.trend.doneTasks, lang: lang }),
      )));
  }
  return children;
}

function TimelineSection(props) {
  var api = props.api;
  var ch = props.ch;
  var lang = props.lang;
  var t = text(lang);
  var state = React.useState(null);
  var data = state[0], setData = state[1];
  var failPair = React.useState("");
  var err = failPair[0], setErr = failPair[1];
  var openPair = React.useState("");
  var openId = openPair[0], setOpenId = openPair[1];
  var memberPair = React.useState({});
  var members = memberPair[0], setMembers = memberPair[1];

  var load = React.useCallback(function () {
    return Promise.resolve(api.call("tasks.timelineStats", { topLimit: 100 }))
      .then(function (r) { return r && r.result !== undefined ? r.result : r; })
      .then(function (d) { setData(d || null); setErr(""); })
      .catch(function (e) { setErr(String((e && e.message) || e || "load failed")); });
  }, [api]);

  React.useEffect(function () { if (props.active !== false) load(); }, [load, props.active]);

  React.useEffect(function () {
    if (props.active === false || !api || typeof api.subscribe !== "function") return undefined;
    var timer = null;
    var off = api.subscribe(function (payload) {
      var ev = payload && payload.event;
      if (ev !== "tasks-changed" && ev !== "task-timelines-changed") return;
      if (timer) clearTimeout(timer);
      timer = setTimeout(function () { load(); }, 800);
    });
    return function () { if (timer) clearTimeout(timer); if (typeof off === "function") off(); };
  }, [api, load, props.active]);

  function toggle(line) {
    var next = openId === line.id ? "" : line.id;
    setOpenId(next);
    if (!next || members[next]) return;
    Promise.resolve(api.call("tasks.timeline", { timelineId: line.id, pageNumber: 1, pageSize: 100 }))
      .then(function (r) { return r && r.result !== undefined ? r.result : r; })
      .then(function (r) { setMembers(function (prev) { var copy = Object.assign({}, prev); copy[next] = (r && r.records) || []; return copy; }); })
      .catch(function () { setMembers(function (prev) { var copy = Object.assign({}, prev); copy[next] = []; return copy; }); });
  }

  if (err && !data) {
    return h(ch.Card, { key: "tlerr", span: 12, title: t.title }, h(ch.Empty, { text: t.loadFail }));
  }
  if (!data) return h(ch.Card, { key: "tlsk", span: 12, title: t.title }, h(ch.Skeleton, {}));
  return h(React.Fragment, null, buildSection(data, { ch: ch, t: t, lang: lang, members: members, openId: openId, toggle: toggle }));
}

module.exports = { TimelineSection: TimelineSection, buildSection: buildSection, text: text };
