"use strict";
/** 运行记录：规则/状态过滤、表格、行内展开详情、空态与骨架。 */
var C = require("../ui/common.cjs");
var copy = require("../ui/copy.cjs");

var LIMIT = 200;

function cost(run) {
  if (!run || !run.finishedAt) return "—";
  var ms = Math.max(0, Number(run.finishedAt) - Number(run.startedAt));
  return ms < 1000 ? ms + "ms" : (ms / 1000).toFixed(1) + "s";
}

function resultKind(status) {
  if (status === "ok") return "ok";
  if (status === "error") return "error";
  if (status === "skipped") return "warn";
  return "";
}

function asText(value) {
  if (value === null || value === undefined || value === "") return "";
  if (typeof value === "string") return value;
  try {
    return JSON.stringify(value, null, 2);
  } catch (e) {
    return String(value);
  }
}

function summary(run) {
  var text = run.error ? run.error : asText(run.result);
  return String(text).replace(/\s+/g, " ").slice(0, 80) || "—";
}

function RunsBody(props) {
  var h = props.h;
  var t = props.t;
  var icon = props.icon;
  var rows = props.rows;
  return h("div", { className: "wba-panel" },
    h("div", { className: "wba-toolbar" },
      h("label", { className: "wba-field" },
        h("span", { className: "wba-label" }, t("runs.filterRule")),
        h("select", { className: "wba-input", value: props.ruleId || "", onChange: function (e) { props.onRule(e.target.value); } },
          h("option", { value: "" }, t("common.all")),
          (props.rules || []).map(function (r) { return h("option", { key: r.id, value: r.id }, r.name); }))),
      h("label", { className: "wba-field" },
        h("span", { className: "wba-label" }, t("runs.filterStatus")),
        h("select", { className: "wba-input", value: props.status || "", onChange: function (e) { props.onStatus(e.target.value); } },
          h("option", { value: "" }, t("common.all")),
          ["ok", "error", "skipped"].map(function (k) { return h("option", { key: k, value: k }, k); }))),
      h("span", { className: "wba-grow" }),
      h("span", { className: "wba-mono" }, t("runs.limitNote"))),
    props.error ? h(C.Notice, { h: h, kind: "error", text: props.error }) : null,
    props.loading
      ? h("div", { className: "wba-table-wrap" },
          [0, 1, 2].map(function (i) {
            return h("div", { key: i, className: "wba-skel-row" }, [1, 2, 3, 4, 5].map(function (j) { return h("div", { key: j, className: "wba-skel" }); }));
          }))
      : rows.length === 0
        ? h("div", { className: "wba-empty-card" },
            icon ? h("span", { className: "wba-empty-ico" }, icon("history", 34)) : null,
            h("p", { className: "wba-empty-title" }, t("runs.empty.title")),
            h("p", { className: "wba-empty-body" }, t("runs.empty.body")))
        : h("div", { className: "wba-table-wrap" },
            h("table", { className: "wba-table" },
              h("thead", null, h("tr", null,
                ["status", "rule", "trigger", "start", "cost", "summary"].map(function (k) {
                  return h("th", { key: k }, t("runs.col." + k));
                }))),
              h("tbody", null, rows.map(function (r) {
                var open = props.expanded === r.id;
                return [
                  h("tr", {
                    key: r.id,
                    className: open ? "wba-row-open wba-clickable" : "wba-clickable",
                    style: { cursor: "pointer" },
                    onClick: function () { props.onExpand(open ? "" : r.id); },
                  },
                    h("td", null, h(C.Pill, { h: h, kind: resultKind(r.status) }, t("run.status." + r.status) || r.status)),
                    h("td", { className: "wba-ellipsis" }, props.ruleName ? props.ruleName(r.ruleId) : r.ruleId),
                    h("td", { className: "wba-nowrap" }, r.trigger ? t("trigger." + r.trigger) || r.trigger : "—"),
                    h("td", { className: "wba-nowrap" }, C.fmtTime(r.startedAt, props.lang)),
                    h("td", { className: "wba-nowrap" }, cost(r)),
                    h("td", null, h("span", { className: "wba-ellipsis", title: r.error || summary(r) }, summary(r)))),
                  open ? h("tr", { key: r.id + "-detail" },
                    h("td", { colSpan: 6, className: "wba-detail-cell" },
                      h("p", { className: "wba-section-title" }, t("runs.detail.title")),
                      h("div", { className: "wba-kv" },
                        h("b", null, t("runs.detail.id")), h("code", null, r.id),
                        h("b", null, t("runs.detail.trigger")), h("span", null, r.trigger ? t("trigger." + r.trigger) || r.trigger : "—"),
                        h("b", null, t("runs.detail.start")), h("span", null, C.fmtTime(r.startedAt, props.lang)),
                        h("b", null, t("runs.detail.finish")), h("span", null, r.finishedAt ? C.fmtTime(r.finishedAt, props.lang) : "—"),
                        h("b", null, t("runs.detail.cost")), h("span", null, cost(r)),
                        h("b", null, t("runs.detail.error")),
                        h("span", { className: r.error ? "wba-err-text" : "" }, r.error || t("runs.detail.noError"))),
                      h("p", { className: "wba-section-title" }, t("runs.detail.result")),
                      h("pre", { className: "wba-pre" }, asText(r.result) || "—"))) : null,
                ];
              })))));
}

module.exports = function RunsView(props) {
  var h = props.h;
  var api = props.api;
  var React = props.React;
  var lang = props.lang === "en" ? "en" : "zh";
  var t = function (key, vars) { return copy.t(lang, key, vars); };
  var runs = C.useLoad(React, api, "automation.runList", { limit: LIMIT }, []);
  var rules = C.useLoad(React, api, "automation.ruleList", {}, []);
  var filterS = React.useState({ ruleId: "", status: "" });
  var expandS = React.useState("");
  var ruleList = (rules.data && rules.data.items) || [];
  var names = {};
  ruleList.forEach(function (r) { names[r.id] = r.name; });
  var rows = ((runs.data && runs.data.items) || []).filter(function (r) {
    if (filterS[0].ruleId && r.ruleId !== filterS[0].ruleId) return false;
    if (filterS[0].status && r.status !== filterS[0].status) return false;
    return true;
  });

  return h("div", { className: "wba-wrap" },
    h("div", { className: "wba-head" },
      h("div", null,
        h("h2", { className: "wba-title" }, t("runs.title")),
        h("p", { className: "wba-sub" }, t("runs.subtitle"))),
      h("div", { className: "wba-row" },
        h(C.Btn, { h: h, onClick: runs.refresh }, t("common.refresh")))),
    h(RunsBody, {
      h: h,
      t: t,
      lang: lang,
      icon: props.icon,
      rows: rows,
      rules: ruleList,
      ruleId: filterS[0].ruleId,
      status: filterS[0].status,
      expanded: expandS[0],
      loading: runs.loading,
      error: runs.error,
      ruleName: function (id) { return names[id] || id; },
      onRule: function (v) { filterS[1](Object.assign({}, filterS[0], { ruleId: v })); },
      onStatus: function (v) { filterS[1](Object.assign({}, filterS[0], { status: v })); },
      onExpand: function (id) { expandS[1](id); },
    }));
};

module.exports.RunsBody = RunsBody;
module.exports.cost = cost;
module.exports.LIMIT = LIMIT;
