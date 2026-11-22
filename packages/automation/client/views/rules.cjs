"use strict";
/** 规则页：页头、过滤条、空态卡、表格与编辑器接线。 */
var C = require("../ui/common.cjs");
var copy = require("../ui/copy.cjs");
var trig = require("./trigger-fields.cjs");
var atiming = require("./agent-timing.cjs");
var editor = require("./rule-editor.cjs");
var AgentHistory = require("./agent-history.cjs");

var TRIGGER_ICON = { interval: "timer", dailyAt: "alarm-clock", event: "radio", manual: "hand" };

function emptyForm() {
  return {
    id: "",
    name: "",
    enabled: true,
    execMode: "action",
    // action 模式
    kind: "interval",
    everyMinutes: 60,
    time: "09:00",
    tz: "Asia/Shanghai",
    weekdays: "1,2,3,4,5",
    domainId: "",
    event: "",
    actionName: "",
    actionArgs: "{}",
    condOn: false,
    condition: '{\n  "field": "event.item.title",\n  "op": "contains",\n  "value": ""\n}',
    // agent 模式
    prompt: "",
    pKind: "every",
    pEvery: 60,
    pAfter: 60,
    pTime: "09:00",
    pTz: "Asia/Shanghai",
    pWeekdays: "1,2,3,4,5",
    pCron: "0 9 * * *",
    pRrule: "DTSTART;TZID=Asia/Shanghai:20260101T090000\nRRULE:FREQ=DAILY",
    pDate: "",
    targetKind: "new_once",
    targetCwd: "",
    targetPreset: "",
    targetSession: "",
  };
}

/** 时间快照 → 表单字段；宿主记录与本地快照都是请求结构，字段名一致。 */
function timingToForm(f, timing) {
  var ti = timing && typeof timing === "object" ? timing : {};
  f.pKind = ti.kind || "every";
  if (ti.kind === "every") f.pEvery = Math.max(1, Math.round((ti.every_seconds || 3600) / 60));
  if (ti.kind === "after") f.pAfter = Math.max(1, Math.round((ti.after_seconds || 60) / 60));
  if (ti.kind === "daily" && ti.daily) {
    f.pTime = String(ti.daily.time || "09:00").slice(0, 5);
    f.pTz = ti.daily.time_zone || "Asia/Shanghai";
  }
  if (ti.kind === "weekly" && ti.weekly) {
    f.pTime = String(ti.weekly.time || "09:00").slice(0, 5);
    f.pTz = ti.weekly.time_zone || "Asia/Shanghai";
    f.pWeekdays = (ti.weekly.weekdays || [1, 2, 3, 4, 5]).join(",");
  }
  if (ti.kind === "cron" && ti.cron) {
    f.pCron = ti.cron.expression || f.pCron;
    f.pTz = ti.cron.time_zone || "Asia/Shanghai";
  }
  if (ti.kind === "rrule") f.pRrule = ti.rrule || f.pRrule;
  if (ti.kind === "at") {
    var at = ti.at;
    if (typeof at === "string") {
      f.pDate = at.slice(0, 10);
      f.pTime = at.slice(11, 16) || f.pTime;
    } else if (at && typeof at === "object") {
      f.pDate = at.date || "";
      f.pTime = String(at.time || "09:00").slice(0, 5);
      f.pTz = at.time_zone || f.pTz;
    }
  }
}

function formFromRule(rule) {
  var f = emptyForm();
  f.id = rule.id;
  f.name = rule.name;
  f.enabled = rule.enabled;
  f.execMode = rule.execMode === "agent" ? "agent" : "action";
  if (f.execMode === "agent") {
    var snap = rule.agent && typeof rule.agent === "object" ? rule.agent : {};
    f.prompt = String(snap.prompt || "");
    timingToForm(f, snap.timing);
    var target = snap.target && typeof snap.target === "object" ? snap.target : {};
    f.targetKind = target.kind || "new_once";
    f.targetSession = target.sessionId || "";
    var create = target.create && typeof target.create === "object" ? target.create : {};
    f.targetCwd = create.cwd || "";
    f.targetPreset = create.agentPreset || "";
    return f;
  }
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

/** 客户端过滤：名称/action/提示词子串 + 状态 + 触发方式 + 执行方式；空条件视为不过滤。 */
function filterRules(rows, filters) {
  var q = String((filters && filters.q) || "").trim().toLowerCase();
  var status = (filters && filters.status) || "";
  var trigger = (filters && filters.trigger) || "";
  var mode = (filters && filters.mode) || "";
  return rows.filter(function (r) {
    if (q) {
      var hit = String(r.name).toLowerCase().indexOf(q) !== -1 ||
        String(r.actionName || "").toLowerCase().indexOf(q) !== -1 ||
        String((r.agent && r.agent.prompt) || "").toLowerCase().indexOf(q) !== -1;
      if (!hit) return false;
    }
    if (status === "on" && !r.enabled) return false;
    if (status === "off" && r.enabled) return false;
    if (mode === "agent" && r.execMode !== "agent") return false;
    if (mode === "action" && r.execMode === "agent") return false;
    if (trigger) {
      var kind = r.execMode === "agent" ? "agent" : (r.triggerConfig && r.triggerConfig.kind) || r.triggerType;
      if (kind !== trigger) return false;
    }
    return true;
  });
}

function resultKind(status) {
  if (status === "ok") return "ok";
  if (status === "error") return "error";
  if (status === "skipped") return "warn";
  return "";
}

function scheduleKind(status) {
  if (status === "active") return "ok";
  if (status === "paused") return "warn";
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
      props.noActions
        ? h(C.Btn, { h: h, kind: "primary", onClick: props.onSettings }, t("rules.empty.noActionCta"))
        : h(C.Btn, { h: h, kind: "primary", onClick: props.onNew }, t("common.create"))),
    h("p", { className: "wba-empty-body" }, props.noActions ? t("rules.empty.noActionHint") : t("rules.empty.backup")));
}

/** 一行规则：action 规则看上次执行，AI 规则看宿主调度状态与上次投递。 */
function RuleRow(props) {
  var h = props.h;
  var t = props.t;
  var icon = props.icon;
  var r = props.rule;
  var agentRule = r.execMode === "agent";
  var snap = r.agent && typeof r.agent === "object" ? r.agent : {};
  var kind = agentRule ? "agent" : (r.triggerConfig && r.triggerConfig.kind) || r.triggerType || "manual";
  var last = r.lastRun;
  var deliveredAt = snap.lastDeliveryAt;
  return h("tr", null,
    h("td", null,
      h("div", { className: "wba-strong wba-ellipsis", title: r.name }, r.name),
      h("div", { className: "wba-mono" }, r.id)),
    h("td", { className: "wba-nowrap" },
      h("span", { className: "wba-inline" },
        icon ? icon(agentRule ? "bot" : TRIGGER_ICON[kind] || "zap", 13) : null,
        agentRule ? atiming.timingText(snap.timing, t) : trig.triggerText(r, t))),
    h("td", null, agentRule
      ? h("span", { className: "wba-inline" },
          h(C.Pill, { h: h, kind: "" }, t("rules.agentAction")),
          h("span", { className: "wba-ellipsis" , title: snap.prompt || "" }, String(snap.prompt || "").slice(0, 48)))
      : h("span", { className: "wba-inline" },
          h("code", { className: "wba-ellipsis", title: r.actionName }, r.actionName),
          props.allowed.indexOf(r.actionName) === -1 ? h(C.Pill, { h: h, kind: "warn" }, t("rules.actionDisabled")) : null)),
    h("td", null, agentRule
      ? h(C.Pill, { h: h, kind: r.scheduleMissing ? "error" : scheduleKind(r.scheduleStatus) }, t("rules.schedule." + (r.scheduleMissing ? "missing" : r.scheduleStatus || "paused")))
      : h(C.Pill, { h: h, kind: r.enabled ? "ok" : "" }, r.enabled ? t("rules.status.on") : t("rules.status.off"))),
    h("td", { className: "wba-nowrap" }, agentRule
      ? h("span", null, deliveredAt ? C.fmtTime(deliveredAt, props.lang) : t("common.none"))
      : h("div", { className: "wba-inline" },
          h("span", null, last ? C.fmtTime(last.startedAt, props.lang) : t("common.none")),
          last ? h(C.Pill, { h: h, kind: resultKind(last.status) }, t("run.status." + last.status) || last.status) : null)),
    h("td", null, h("div", { className: "wba-actions" },
      agentRule ? h("button", { type: "button", className: "wba-icon-btn", title: t("rules.history"), onClick: function () { props.onHistory(r); } }, icon ? icon("send", 14) : "✉") : null,
      h("button", { type: "button", className: "wba-icon-btn", title: t("common.run"), disabled: props.runningId === r.id || (agentRule && r.scheduleMissing), onClick: function () { props.onRun(r); } }, icon ? icon("play", 14) : "▶"),
      h("button", { type: "button", className: "wba-icon-btn", title: t("common.edit"), onClick: function () { props.onEdit(r); } }, icon ? icon("pencil", 14) : "✎"),
      h("button", { type: "button", className: "wba-icon-btn", title: r.enabled ? t("common.disable") : t("common.enable"), onClick: function () { props.onToggle(r); } }, icon ? icon(r.enabled ? "power-off" : "power", 14) : "⏻"),
      h("button", { type: "button", className: "wba-icon-btn danger", title: t("common.delete"), onClick: function () { props.onDelete(r); } }, icon ? icon("trash-2", 14) : "🗑"))));
}

function RulesBody(props) {
  var h = props.h;
  var t = props.t;
  var icon = props.icon;
  var rows = props.rows;
  var filters = props.filters || {};
  var allowed = props.allowed || [];
  var orphans = Number((props.agentStatus && props.agentStatus.orphans && props.agentStatus.orphans.length) || 0);
  var offline = props.agentStatus && props.agentStatus.available === false;
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
          }),
          h("option", { value: "agent" }, t("rules.agentAction")))),
      h("label", { className: "wba-field" },
        h("span", { className: "wba-label" }, t("rules.exec.mode")),
        h("select", { className: "wba-input", value: filters.mode || "", onChange: function (e) { props.onFilter({ mode: e.target.value }); } },
          h("option", { value: "" }, t("common.all")),
          h("option", { value: "action" }, t("editor.mode.action")),
          h("option", { value: "agent" }, t("editor.mode.agent")))),
      h("span", { className: "wba-grow" }),
      h(C.Btn, { h: h, onClick: props.onClear }, t("common.clear"))),
    props.error ? h(C.Notice, { h: h, kind: "error", text: props.error }) : null,
    offline ? h(C.Notice, { h: h, kind: "warn", text: t("rules.agentOffline") }) : null,
    orphans > 0 ? h(C.Notice, { h: h, kind: "warn", text: t("rules.orphans", { n: orphans }) }) : null,
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
            title: props.hasRules ? t("rules.empty.filtered") : (props.noActions ? t("rules.empty.noActionTitle") : t("rules.empty.title")),
            body: props.hasRules ? t("rules.empty.filteredBody") : (props.noActions ? t("rules.empty.noActionBody") : t("rules.empty.body")),
            noActions: !props.hasRules && props.noActions,
            onNew: props.onNew,
            onSettings: props.onSettings,
          })
        : h("div", { className: "wba-table-wrap" },
            h("table", { className: "wba-table" },
              h("thead", null, h("tr", null,
                ["name", "trigger", "action", "status", "lastRun", "ops"].map(function (k) {
                  return h("th", { key: k }, t("rules.col." + k));
                }))),
              h("tbody", null, rows.map(function (r) {
                return h(RuleRow, {
                  key: r.id,
                  h: h,
                  t: t,
                  icon: icon,
                  lang: props.lang,
                  rule: r,
                  allowed: allowed,
                  runningId: props.runningId,
                  onRun: props.onRun,
                  onEdit: props.onEdit,
                  onToggle: props.onToggle,
                  onDelete: props.onDelete,
                  onHistory: props.onHistory,
                });
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
  // 宿主服务是否可用、有没有游离任务：进页面就知道，决定能不能新建 AI 规则。
  var status = C.useLoad(React, api, "automation.agentStatus", {}, []);
  var formS = React.useState(null);
  var initS = React.useState(null);
  var busyS = React.useState(false);
  var msgS = React.useState("");
  var filterS = React.useState({ q: "", status: "", trigger: "", mode: "" });
  var runningS = React.useState("");
  var historyS = React.useState(null);
  var all = (list.data && list.data.items) || [];
  var rows = filterRules(all, filterS[0]);
  var actions = (opts.data && opts.data.actions) || [];
  var agentStatus = status.data || null;
  var form = formS[0];

  React.useEffect(function () {
    if (props.viewParams && props.viewParams.new && !formS[0]) openNew();
  }, [props.viewParams]);

  function fail(e) {
    msgS[1](C.errText(e));
  }
  function reload() {
    list.refresh();
    status.refresh();
  }
  function openNew() {
    var f = emptyForm();
    if (agentStatus && agentStatus.available === false) f.execMode = "action";
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
        reload();
        msgS[1](t("common.saved"));
      })
      .catch(function (e) {
        busyS[1](false);
        fail(e);
      });
  }
  function remove(rule) {
    if (typeof window !== "undefined" && !window.confirm(t("rules.confirm.delete", { name: rule.name }))) return;
    C.call(api, "automation.ruleDelete", { id: rule.id }).then(reload).catch(fail);
  }
  function run(rule) {
    runningS[1](rule.id);
    msgS[1]("");
    C.call(api, "automation.ruleRun", { id: rule.id })
      .then(function (r) {
        runningS[1]("");
        msgS[1](r && r.skipped ? "skipped: " + (r.reason || "") : t("common.saved"));
        reload();
      })
      .catch(function (e) {
        runningS[1]("");
        fail(e);
      });
  }
  function toggle(rule) {
    C.call(api, "automation.ruleUpdate", { id: rule.id, enabled: !rule.enabled }).then(reload).catch(fail);
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
        h(C.Btn, { h: h, onClick: reload }, t("common.refresh")),
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
      allowed: actions,
      agentStatus: agentStatus,
      noActions: actions.length === 0,
      onSettings: function () { if (props.onNavigate) props.onNavigate("config"); },
      filters: filterS[0],
      runningId: runningS[0],
      onFilter: function (patch) { filterS[1](Object.assign({}, filterS[0], patch)); },
      onClear: function () { filterS[1]({ q: "", status: "", trigger: "", mode: "" }); },
      onNew: openNew,
      onRun: run,
      onEdit: function (r) {
        var f = formFromRule(r);
        initS[1](f);
        formS[1](f);
      },
      onToggle: toggle,
      onDelete: remove,
      onHistory: function (r) { historyS[1](r); },
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
      agentAvailable: !(agentStatus && agentStatus.available === false),
      onClose: function () { formS[1](null); },
      onSave: save,
    }) : null,
    historyS[0] ? h(AgentHistory, {
      h: h,
      api: api,
      React: React,
      t: t,
      lang: lang,
      icon: props.icon,
      rule: historyS[0],
      onClose: function () { historyS[1](null); },
    }) : null);
};

module.exports.filterRules = filterRules;
module.exports.RulesBody = RulesBody;
module.exports.RuleRow = RuleRow;
module.exports.emptyForm = emptyForm;
module.exports.formFromRule = formFromRule;
module.exports.timingToForm = timingToForm;
