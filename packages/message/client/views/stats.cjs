"use strict";
/**
 * 统计视图：总量/未读/已读、按级别与来源分布、最近 14 天趋势。
 * 数据来自本插件注册的 message.stats（只读）。
 */
module.exports = function (deps) {
  var React = deps.React;
  var h = React.createElement;

  function fmt(template, vars) {
    return String(template).replace(/\{(\w+)\}/g, function (m, key) {
      return vars[key] === undefined ? m : String(vars[key]);
    });
  }

  function unwrap(r) {
    return r && r.result !== undefined ? r.result : r;
  }

  return function StatsView(props) {
    var api = props.api;
    var t = props.t;
    var lang = props.lang;
    var dataS = React.useState(null);
    var data = dataS[0];
    var setData = dataS[1];
    var busyS = React.useState(true);
    var busy = busyS[0];
    var setBusy = busyS[1];
    var errS = React.useState("");
    var error = errS[0];
    var setError = errS[1];
    var tickS = React.useState(0);
    var tick = tickS[0];
    var setTick = tickS[1];

    React.useEffect(function () {
      var alive = true;
      setBusy(true);
      Promise.resolve(api.call("message.stats", { days: 14 }))
        .then(function (r) {
          if (!alive) return;
          if (r && r.ok === false) throw new Error((r && r.error) || t.loadFail);
          setData(unwrap(r) || null);
          setError("");
        })
        .catch(function (e) {
          if (!alive) return;
          setError(String((e && e.message) || e) || t.loadFail);
        })
        .then(function () { if (alive) setBusy(false); });
      return function () { alive = false; };
    }, [api, tick]);

    if (busy && !data) return h("div", { className: "wbm-empty", role: "status", "aria-busy": "true" }, t.loading);
    if (error) return h("div", { className: "wbm-err", role: "alert" }, h("span", null, error), h("button", { type: "button", className: "wbm-btn", onClick: function () { setTick(tick + 1); } }, t.retry));
    if (!data) return h("div", { className: "wbm-empty" }, t.noData);

    var totals = data.totals || { total: 0, unread: 0, read: 0 };
    var maxLevel = Math.max(1, (data.byLevel || []).reduce(function (max, row) { return Math.max(max, row.total); }, 0));
    var maxTrend = Math.max(1, (data.trend || []).reduce(function (max, row) { return Math.max(max, row.count); }, 0));

    return h(
      "div",
      { className: "wbm-root wbm-stats" },
      h(
        "div",
        { className: "wbm-cards" },
        h("div", { className: "wbm-kpi" }, h("b", null, String(totals.total)), h("span", null, t.statTotal)),
        h("div", { className: "wbm-kpi" }, h("b", null, String(totals.unread)), h("span", null, t.statUnread)),
        h("div", { className: "wbm-kpi" }, h("b", null, String(totals.read)), h("span", null, t.statRead)),
        h(
          "div",
          { className: "wbm-kpi" },
          h("b", { style: { fontSize: "13px" } }, data.oldestUnread ? new Date(data.oldestUnread.createdAt).toLocaleDateString(lang === "en" ? "en-US" : "zh-CN") : "—"),
          h("span", null, t.statOldest),
        ),
      ),
      h(
        "div",
        { className: "wbm-section" },
        h("h3", null, t.byLevel),
        h(
          "div",
          { className: "wbm-bars" },
          (data.byLevel || []).map(function (row) {
            return h(
              "div",
              { className: "wbm-bar", key: row.level },
              h("span", null, (t.level && t.level[row.level]) || row.level),
              h("span", { className: "wbm-bar-track" }, h("span", { className: "wbm-bar-fill lv-" + row.level, style: { width: Math.round((row.total / maxLevel) * 100) + "%" } })),
              h("span", null, String(row.total)),
            );
          }),
        ),
      ),
      h(
        "div",
        { className: "wbm-section" },
        h("h3", null, t.bySource),
        (data.bySource || []).length
          ? h(
              "div",
              { className: "wbm-bars" },
              data.bySource.map(function (row) {
                var max = Math.max(1, data.bySource[0].total);
                return h(
                  "div",
                  { className: "wbm-bar", key: row.source },
                  h("span", null, row.source || t.noSource),
                  h("span", { className: "wbm-bar-track" }, h("span", { className: "wbm-bar-fill", style: { width: Math.round((row.total / max) * 100) + "%" } })),
                  h("span", null, String(row.total)),
                );
              }),
            )
          : h("div", { className: "wbm-note" }, t.noData),
      ),
      h(
        "div",
        { className: "wbm-section" },
        h("h3", null, fmt(t.trend, { days: data.days })),
        h(
          "div",
          { className: "wbm-trend" },
          (data.trend || []).map(function (row) {
            return h(
              "div",
              { className: "wbm-trend-col", key: row.date, title: row.date + " · " + row.count },
              h("span", { className: "wbm-trend-bar", style: { height: Math.max(2, Math.round((row.count / maxTrend) * 56)) + "px" } }),
              h("span", null, row.date.slice(5)),
            );
          }),
        ),
        h("div", { className: "wbm-note" }, t.statsHint),
      ),
    );
  };
};
