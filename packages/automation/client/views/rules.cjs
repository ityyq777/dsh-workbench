"use strict";
/** 规则页：页头、过滤条、空态卡、表格与编辑器接线。 */
var C = require("../ui/common.cjs");
var copy = require("../ui/copy.cjs");
var trig = require("./trigger-fields.cjs");
var editor = require("./rule-editor.cjs");

var TRIGGER_ICON = { interval: "timer", dailyAt: "alarm-clock", event: "radio", manual: "hand" };

function emptyForm() {
  return {
    id: "",
    name: "",
    enabled: true,
    kind: "interval",
    everyMinutes: 60,
    time: "09:00",
    tz: "Asia/Shanghai",
    weekdays: "1,2,3,4,5",
    domainId: "",
    event: "",
    actionName: "message.send",
    actionArgs: '{\n  "title": "自动化提醒",\n  "body": "规则 {{rule.name}} 已运行"\n}',
    condOn: false,
    condition: '{\n  "field": "event.item.title",\n  "op": "contains",\n  "value": ""\n}',
  };
}

function formFromRule(rule) {
  var f = emptyForm();
  f.id = rule.id;
  f.name = rule.name;
  f.enabled = rule.enabled;
  f.actionName = rule.actionName;
  f.actionArgs = JSON.stringify(rule.actionArgs || {}, null, 2);
  f.condOn = Boolean(rule.condition);
  f.condition = rule.condition ? JSON.stringify(rule.condition, null, 2) : f.condition;
  var tc = rule.triggerConfig || {};
  f.kind = tc.kind || "manual";
  if (tc.kind === "interval") f.everyMinutes = tc.everyMinutes || 60;
  if (tc.kind === "dailyAt") {
    f.time = tc.time || "09:00";
    f.tz = tc.tz || "Asia/Shanghai";
    f.weekdays = (tc.weekdays || [1, 2, 3, 4, 5]).join(",");
  }
  if (tc.kind === "event") {
    f.domainId = tc.domainId || "";
    f.event = tc.event || "";
  }
  return f;
}

/** 客户端过滤：名称/action 子串 + 状态 + 触发方式；空条件视为不过滤。 */
function filterRules(rows, filters) {
  var q = String((filters && filters.q) || "").trim().toLowerCase();
  var status = (filters && filters.status) || "";
  var trigger = (filters && filters.trigger) || "";
  return rows.filter(function (r) {
    if (q && !(String(r.name).toLowerCase().indexOf(q) !== -1 || String(r.actionName).toLowerCase().indexOf(q) !== -1)) return false;
    if (status === "on" && !r.enabled) return false;
    if (status === "off" && r.enabled) return false;
    if (trigger && (r.triggerConfig && r.triggerConfig.kind ? r.triggerConfig.kind : r.triggerType) !== trigger) return false;
    return true;
  });
}

function resultKind(status) {
  if (status === "ok") return "ok";
  if (status === "error") return "error";
  if (status === "skipped") return "warn";
  return "";
}

function EmptyCard(props) {
  var h = props.h;
  var t = props.t;
  var icon = props.icon;
  return h("div", { className: "wba-empty-card" },
    icon ? h("span", { className: "wba-empty-ico" }, icon("zap", 36)) : null,
    h("p", { className: "wba-empty-title" }, props.title),
    h("p", { className: "wba-empty-body" }, props.body),
    h("div", { className: "wba-inline" },
      h(C.Btn, { h: h, kind: "primary", onClick: props.onNew }, t("common.create"))),
    h("p", { className: "wba-empty-body" }, t("rules.empty.backup")));
}

function RulesBody(props) {
  var h = props.h;
  var t = props.t;
  var icon = props.icon;
  var rows = props.rows;
  var filters = props.filters || {};
  return h("div", { className: "wba-panel" },
    h("div", { className: "wba-toolbar" },
      h("label", { className: "wba-field" },
        h("span", { className: "wba-label" }, t("common.search")),
        h("input", {
          className: "wba-input",
          type: "search",
          value: filters.q || "",
          placeholder: t("rules.searchPh"),
          onChange: function (e) { props.onFilter({ q: e.target.value }); },
        })),
      h("label", { className: "wba-field" },
        h("span", { className: "wba-label" }, t("rules.filterStatus")),
        h("select", { className: "wba-input", value: filters.status || "", onChange: function (e) { props.onFilter({ status: e.target.value }); } },
          h("option", { value: "" }, t("common.all")),
          h("option", { value: "on" }, t("rules.status.on")),
          h("option", { value: "off" }, t("rules.status.off")))),
      h("label", { className: "wba-field" },
        h("span", { className: "wba-label" }, t("rules.filterTrigger")),
        h("select", { className: "wba-input", value: filters.trigger || "", onChange: function (e) { props.onFilter({ trigger: e.target.value }); } },
          h("option", { value: "" }, t("common.all")),
          ["interval", "dailyAt", "event", "manual"].map(function (k) {
            return h("option", { key: k, value: k }, t("trigger." + k));
          }))),
      h("span", { className: "wba-grow" }),
      h(C.Btn, { h: h, onClick: props.onClear }, t("common.clear"))),
    props.error ? h(C.Notice, { h: h, kind: "error", text: props.error }) : null,
    props.loading
      ? h("div", { className: "wba-table-wrap" },
          h("div", { className: "wba-skel-row" }, [1, 2, 3, 4, 5].map(function (i) { return h("div", { key: i, className: "wba-skel" }); })),
          h("div", { className: "wba-skel-row" }, [1, 2, 3, 4, 5].map(function (i) { return h("div", { key: i, className: "wba-skel" }); })),
          h("div", { className: "wba-skel-row" }, [1, 2, 3, 4, 5].map(function (i) { return h("div", { key: i, className: "wba-skel" }); })))
      : rows.length === 0
        ? h(EmptyCard, {
            h: h,
            t: t,
            icon: icon,
            title: props.hasRules ? t("rules.empty.filtered") : t("rules.empty.title"),
            body: props.hasRules ? t("rules.empty.filteredBody") : t("rules.empty.body"),
            onNew: props.onNew,
          })
        : h("div", { className: "wba-table-wrap" },
            h("table", { className: "wba-table" },
              h("thead", null, h("tr", null,
                ["name", "trigger", "action", "status", "lastRun", "ops"].map(function (k) {
                  return h("th", { key: k }, t("rules.col." + k));
                }))),
              h("tbody", null, rows.map(function (r) {
                var kind = (r.triggerConfig && r.triggerConfig.kind) || r.triggerType || "manual";
                var last = r.lastRun;
                var cells = [
                  h("td", null,
                    h("div", { className: "wba-strong wba-ellipsis", title: r.name }, r.name),
                    h("div", { className: "wba-mono" }, r.id)),
                  h("td", { className: "wba-nowrap" },
                    h("span", { className: "wba-inline" },
                      icon ? icon(TRIGGER_ICON[kind] || "zap", 13) : null,
                      trig.triggerText(r, t))),
                  h("td", null, h("code", { className: "wba-ellipsis", title: r.actionName }, r.actionName)),
                  h("td", null, h(C.Pill, { h: h, kind: r.enabled ? "ok" : "" }, r.enabled ? t("rules.status.on") : t("rules.status.off"))),
                  h("td", { className: "wba-nowrap" },
                    h("div", { className: "wba-inline" },
                      h("span", null, last ? C.fmtTime(last.startedAt, props.lang) : t("common.none")),
                      last ? h(C.Pill, { h: h, kind: resultKind(last.status) }, t("run.status." + last.status) || last.status) : null)),
                  h("td", null, h("div", { className: "wba-actions" },
                    h("button", { type: "button", className: "wba-icon-btn", title: t("common.run"), disabled: props.runningId === r.id, onClick: function () { props.onRun(r); } }, icon ? icon("play", 14) : "▶"),
                    h("button", { type: "button", className: "wba-icon-btn", title: t("common.edit"), onClick: function () { props.onEdit(r); } }, icon ? icon("pencil", 14) : "✎"),
                    h("button", { type: "button", className: "wba-icon-btn", title: r.enabled ? t("common.disable") : t("common.enable"), onClick: function () { props.onToggle(r); } }, icon ? icon(r.enabled ? "power-off" : "power", 14) : "⏻"),
                    h("button", { type: "button", className: "wba-icon-btn danger", title: t("common.delete"), onClick: function () { props.onDelete(r); } }, icon ? icon("trash-2", 14) : "🗑"))),
                ];
                return h("tr", { key: r.id }, cells);
              })))));
}

module.exports = function RulesView(props) {
  var h = props.h;
  var api = props.api;
  var React = props.React;
  var lang = props.lang === "en" ? "en" : "zh";
  var t = function (key, vars) { return copy.t(lang, key, vars); };
  var list = C.useLoad(React, api, "automation.ruleList", {}, []);
  var opts = C.useLoad(React, api, "automation.actionOptions", {}, []);
  var formS = React.useState(null);
  var initS = React.useState(null);
  var busyS = React.useState(false);
  var msgS = React.useState("");
  var filterS = React.useState({ q: "", status: "", trigger: "" });
  var runningS = React.useState("");
  var all = (list.data && list.data.items) || [];
  var rows = filterRules(all, filterS[0]);
  var actions = (opts.data && opts.data.actions) || ["message.send"];
  var form = formS[0];

  React.useEffect(function () {
    if (props.viewParams && props.viewParams.new && !formS[0]) openNew();
  }, [props.viewParams]);

  function fail(e) {
    msgS[1](C.errText(e));
  }
  function openNew() {
    var f = emptyForm();
    initS[1](f);
    formS[1](f);
    msgS[1]("");
  }
  function save(payload) {
    busyS[1](true);
    msgS[1]("");
    var action = payload.id ? "automation.ruleUpdate" : "automation.ruleCreate";
    C.call(api, action, payload)
      .then(function () {
        busyS[1](false);
        formS[1](null);
        list.refresh();
        msgS[1](t("common.saved"));
      })
      .catch(function (e) {
        busyS[1](false);
        fail(e);
      });
  }
  function remove(rule) {
    if (typeof window !== "undefined" && !window.confirm(t("rules.confirm.delete", { name: rule.name }))) return;
    C.call(api, "automation.ruleDelete", { id: rule.id }).then(function () { list.refresh(); }).catch(fail);
  }
  function run(rule) {
    runningS[1](rule.id);
    msgS[1]("");
    C.call(api, "automation.ruleRun", { id: rule.id })
      .then(function (r) {
        runningS[1]("");
        msgS[1](r && r.skipped ? "skipped: " + (r.reason || "") : t("common.saved"));
        list.refresh();
      })
      .catch(function (e) {
        runningS[1]("");
        fail(e);
      });
  }
  function toggle(rule) {
    C.call(api, "automation.ruleUpdate", { id: rule.id, enabled: !rule.enabled }).then(function () { list.refresh(); }).catch(fail);
  }
  function setForm(k, v) {
    var next = Object.assign({}, formS[0]);
    next[k] = v;
    formS[1](next);
  }

  return h("div", { className: "wba-wrap" },
    h("div", { className: "wba-head" },
      h("div", null,
        h("h2", { className: "wba-title" }, t("rules.title")),
        h("p", { className: "wba-sub" }, t("rules.subtitle"))),
      h("div", { className: "wba-row" },
        h(C.Btn, { h: h, onClick: list.refresh }, t("common.refresh")),
        h(C.Btn, { h: h, kind: "primary", onClick: openNew }, t("common.create")))),
    h(C.Notice, { h: h, text: msgS[0], kind: "info" }),
    h(RulesBody, {
      h: h,
      t: t,
      lang: lang,
      icon: props.icon,
      rows: rows,
      hasRules: all.length > 0,
      loading: list.loading,
      error: list.error,
      filters: filterS[0],
      runningId: runningS[0],
      onFilter: function (patch) { filterS[1](Object.assign({}, filterS[0], patch)); },
      onClear: function () { filterS[1]({ q: "", status: "", trigger: "" }); },
      onNew: openNew,
      onRun: run,
      onEdit: function (r) {
        var f = formFromRule(r);
        initS[1](f);
        formS[1](f);
      },
      onToggle: toggle,
      onDelete: remove,
    }),
    form ? h(editor.RuleEditor, {
      h: h,
      C: C,
      t: t,
      React: React,
      lang: lang,
      icon: props.icon,
      form: form,
      initial: initS[0],
      set: setForm,
      busy: busyS[0],
      actions: actions,
      onClose: function () { formS[1](null); },
      onSave: save,
    }) : null);
};

module.exports.filterRules = filterRules;
module.exports.RulesBody = RulesBody;
module.exports.emptyForm = emptyForm;
module.exports.formFromRule = formFromRule;
