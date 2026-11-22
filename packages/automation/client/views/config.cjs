"use strict";
/** 设置：限流编辑卡 + 允许调用的 action 多选 + 运行约束列表卡。 */
var C = require("../ui/common.cjs");
var copy = require("../ui/copy.cjs");
var picker = require("./action-picker.cjs");
// 数字项统一使用共享数字输入控件（范围只作提示，非法红字且不提交）。
var NF = require("../../../lib/number-field.cjs");

var CONSTRAINTS = ["strategy", "concurrency", "event", "condition", "backup", "safety"];

function ConfigBody(props) {
  var h = props.h;
  var t = props.t;
  var icon = props.icon;
  var form = props.form || {};
  var catalog = props.catalog || { items: [], error: "", loading: false };
  return h("div", { className: "wba-stack" },
    h("div", { className: "wba-panel" },
    h("div", { className: "wba-panel-h" },
      h("p", { className: "wba-panel-title" }, t("config.limit.title")),
      props.saved && !props.dirty ? h(C.Pill, { h: h, kind: "ok" }, t("common.saved")) : null),
    h("div", { className: "wba-grid-2" },
      h("label", { className: "wba-field" },
        h("span", { className: "wba-label" }, t("config.limit.maxRules")),
        h(NF.NumberField, {
          h: h,
          lang: props.lang,
          value: form.maxRules === undefined ? "" : form.maxRules,
          min: 1,
          max: 500,
          integer: true,
          ariaLabel: t("config.limit.maxRules"),
          onCommit: function (next) { props.onChange("maxRules", next); },
        })),
      h("label", { className: "wba-field" },
        h("span", { className: "wba-label" }, t("config.limit.perHour")),
        h(NF.NumberField, {
          h: h,
          lang: props.lang,
          value: form.perHour === undefined ? "" : form.perHour,
          min: 1,
          max: 600,
          integer: true,
          ariaLabel: t("config.limit.perHour"),
          onCommit: function (next) { props.onChange("perHour", next); },
        }))),
    h("p", { className: "wba-sub" }, t("config.limit.hint")),
    h("div", { className: "wba-inline" },
      h(C.Btn, {
        h: h,
        kind: "primary",
        disabled: props.busy || !props.dirty,
        onClick: function () { props.onSave({ maxRules: Number(form.maxRules), perHour: Number(form.perHour), allowedActions: form.allowedActions || [] }); },
      }, props.busy ? t("common.loading") : t("common.save")),
      props.dirty ? null : h("span", { className: "wba-hint" }, t("config.limit.unchanged"))),
    h("hr", { className: "wba-sep" }),
    h("div", { className: "wba-panel-h" },
      h("p", { className: "wba-panel-title" }, t("config.constraints.title")),
      icon ? h("span", { className: "wba-card-ico" }, icon("shield-check", 16)) : null),
    h("ul", { className: "wba-list" }, CONSTRAINTS.map(function (k) {
      return h("li", { key: k }, t("config.c." + k));
    }))),
    h(picker.ActionPicker, {
      h: h,
      t: t,
      icon: icon,
      React: props.React,
      items: catalog.items,
      error: catalog.error,
      loading: catalog.loading,
      selected: form.allowedActions || [],
      onChange: function (list) { props.onChange("allowedActions", list); },
    }));
}

module.exports = function ConfigView(props) {
  var h = props.h;
  var api = props.api;
  var React = props.React;
  var lang = props.lang === "en" ? "en" : "zh";
  var t = function (key, vars) { return copy.t(lang, key, vars); };
  var cfg = C.useLoad(React, api, "automation.configGet", {}, []);
  var catalog = C.useLoad(React, api, "automation.actionCatalog", {}, []);
  var formS = React.useState(null);
  var busyS = React.useState(false);
  var msgS = React.useState(null);
  var savedS = React.useState(false);

  React.useEffect(function () {
    if (cfg.data && !formS[0]) {
      formS[1]({
        maxRules: String(cfg.data.maxRules),
        perHour: String(cfg.data.perHour),
        allowedActions: (cfg.data.allowedActions || []).slice(),
      });
    }
  }, [cfg.data]);

  var form = formS[0] || { maxRules: "", perHour: "", allowedActions: [] };
  var base = cfg.data || {};
  var dirty = String(form.maxRules) !== String(base.maxRules) ||
    String(form.perHour) !== String(base.perHour) ||
    (form.allowedActions || []).join(",") !== (base.allowedActions || []).join(",");

  function save(payload) {
    busyS[1](true);
    msgS[1](null);
    C.call(api, "automation.configSet", payload)
      .then(function () {
        busyS[1](false);
        savedS[1](true);
        msgS[1]({ kind: "ok", text: t("common.saved") });
        cfg.refresh();
      })
      .catch(function (e) {
        busyS[1](false);
        msgS[1]({ kind: "error", text: C.errText(e) });
      });
  }

  return h("div", { className: "wba-wrap" },
    h("div", { className: "wba-head" },
      h("div", null,
        h("h2", { className: "wba-title" }, t("config.title")),
        h("p", { className: "wba-sub" }, t("config.subtitle"))),
      h("div", { className: "wba-row" },
        h(C.Btn, { h: h, onClick: function () { cfg.refresh(); catalog.refresh(); } }, t("common.refresh")))),
    msgS[0] ? h(C.Notice, { h: h, kind: msgS[0].kind, text: msgS[0].text }) : null,
    cfg.error ? h(C.Notice, { h: h, kind: "error", text: cfg.error }) : null,
    cfg.loading && !cfg.data
      ? h("div", { className: "wba-panel" }, h("div", { className: "wba-skel" }), h("div", { className: "wba-skel" }))
      : h(ConfigBody, {
          h: h,
          lang: lang,
          t: t,
          icon: props.icon,
          form: form,
          React: React,
          busy: busyS[0],
          dirty: dirty,
          saved: savedS[0],
          catalog: { items: (catalog.data && catalog.data.items) || [], error: (catalog.data && catalog.data.error) || (catalog.error || ""), loading: catalog.loading && !catalog.data },
          onChange: function (k, v) { formS[1](Object.assign({}, form, { [k]: v })); },
          onSave: save,
        }));
};

module.exports.ConfigBody = ConfigBody;
module.exports.CONSTRAINTS = CONSTRAINTS;
