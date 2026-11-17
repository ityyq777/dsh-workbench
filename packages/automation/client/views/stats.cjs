"use strict";
/** 概览：5 张 KPI 卡、白名单 chips（允许/拒绝）、触发方式说明与新建入口。 */
var C = require("../ui/common.cjs");
var copy = require("../ui/copy.cjs");

var DENIED = ["vault.*", "automation.*", "audit.*", "*.delete", "*.backup"];

function kpiRows(s) {
  var today = (s && s.today) || {};
  return [
    ["total", "layers", (s && s.total) || 0, "stats.kpi.total", "stats.kpi.totalHint"],
    ["enabled", "power", (s && s.enabled) || 0, "stats.kpi.enabled", "stats.kpi.enabledHint"],
    ["ok", "check-circle", today.ok || 0, "stats.kpi.ok", "stats.kpi.okHint"],
    ["error", "alert-triangle", today.error || 0, "stats.kpi.error", "stats.kpi.errorHint"],
    ["skipped", "skip-forward", today.skipped || 0, "stats.kpi.skipped", "stats.kpi.skippedHint"],
  ];
}

function StatsBody(props) {
  var h = props.h;
  var t = props.t;
  var icon = props.icon;
  return h("div", { className: "wba-panel" },
    h("div", { className: "wba-cards" }, kpiRows(props.s).map(function (k) {
      return h("div", { key: k[0], className: "wba-card" },
        h("div", { className: "wba-card-top" },
          h("span", { className: "wba-card-label" }, t(k[3])),
          icon ? h("span", { className: "wba-card-ico" }, icon(k[1], 18)) : null),
        h("div", { className: "wba-card-num" }, String(k[2])),
        h("p", { className: "wba-card-hint" }, t(k[4])));
    })),
    h("div", { className: "wba-panel" },
      h("div", { className: "wba-panel-h" },
        h("p", { className: "wba-panel-title" }, t("stats.allowed")),
        h("span", { className: "wba-hint" }, t("stats.allowedHint"))),
      h("div", { className: "wba-pills" }, (props.actions || []).map(function (a) {
        return h("span", { key: a, className: "wba-chip static" }, h("code", null, a));
      }))),
    h("div", { className: "wba-panel" },
      h("div", { className: "wba-panel-h" },
        h("p", { className: "wba-panel-title" }, t("stats.denied")),
        h("span", { className: "wba-hint" }, t("stats.deniedHint"))),
      h("div", { className: "wba-pills" }, DENIED.map(function (a) {
        return h("span", { key: a, className: "wba-chip static wba-mono" }, a);
      }))),
    h("div", { className: "wba-panel" },
      h("p", { className: "wba-panel-title" }, t("stats.triggers")),
      h("div", { className: "wba-kv" }, ["interval", "dailyAt", "event", "manual"].map(function (k) {
        return [h("b", { key: k + "-k" }, t("trigger." + k)), h("span", { key: k + "-v" }, t("stats.trigger." + k))];
      }))));
}

module.exports = function StatsView(props) {
  var h = props.h;
  var api = props.api;
  var React = props.React;
  var lang = props.lang === "en" ? "en" : "zh";
  var t = function (key, vars) { return copy.t(lang, key, vars); };
  var stats = C.useLoad(React, api, "automation.stats", {}, []);
  var opts = C.useLoad(React, api, "automation.actionOptions", {}, []);
  var s = stats.data || { total: 0, enabled: 0, today: {} };
  return h("div", { className: "wba-wrap" },
    h("div", { className: "wba-head" },
      h("div", null,
        h("h2", { className: "wba-title" }, t("stats.title")),
        h("p", { className: "wba-sub" }, t("stats.subtitle"))),
      h("div", { className: "wba-row" },
        h(C.Btn, { h: h, onClick: function () { stats.refresh(); opts.refresh(); } }, t("common.refresh")),
        h(C.Btn, { h: h, kind: "primary", onClick: function () { if (props.onNavigate) props.onNavigate("rules", { new: true }); } }, t("common.create")))),
    stats.error ? h(C.Notice, { h: h, kind: "error", text: stats.error }) : null,
    stats.loading
      ? h("div", { className: "wba-cards" }, [0, 1, 2, 3, 4].map(function (i) {
          return h("div", { key: i, className: "wba-card" }, h("div", { className: "wba-skel" }));
        }))
      : h(StatsBody, { h: h, t: t, icon: props.icon, s: s, actions: (opts.data && opts.data.actions) || [] }));
};

module.exports.StatsBody = StatsBody;
module.exports.DENIED = DENIED;
