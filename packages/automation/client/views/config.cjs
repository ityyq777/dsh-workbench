"use strict";
/** 设置：限流编辑卡 + 运行约束列表卡。 */
var C = require("../ui/common.cjs");
var copy = require("../ui/copy.cjs");

var CONSTRAINTS = ["strategy", "concurrency", "event", "condition", "backup", "safety"];

function ConfigBody(props) {
  var h = props.h;
  var t = props.t;
  var icon = props.icon;
  var form = props.form || {};
  return h("div", { className: "wba-panel" },
    h("div", { className: "wba-panel-h" },
      h("p", { className: "wba-panel-title" }, t("config.limit.title")),
      props.saved && !props.dirty ? h(C.Pill, { h: h, kind: "ok" }, t("common.saved")) : null),
    h("div", { className: "wba-grid-2" },
      h("label", { className: "wba-field" },
        h("span", { className: "wba-label" }, t("config.limit.maxRules")),
        h("input", {
          className: "wba-input",
          type: "number",
          min: 1,
          max: 500,
          value: form.maxRules,
          "aria-label": t("config.limit.maxRules"),
          onChange: function (e) { props.onChange("maxRules", e.target.value); },
        })),
      h("label", { className: "wba-field" },
        h("span", { className: "wba-label" }, t("config.limit.perHour")),
        h("input", {
          className: "wba-input",
          type: "number",
          min: 1,
          max: 600,
          value: form.perHour,
          "aria-label": t("config.limit.perHour"),
          onChange: function (e) { props.onChange("perHour", e.target.value); },
        }))),
    h("p", { className: "wba-sub" }, t("config.limit.hint")),
    h("div", { className: "wba-inline" },
      h(C.Btn, {
        h: h,
        kind: "primary",
        disabled: props.busy || !props.dirty,
        onClick: function () { props.onSave({ maxRules: Number(form.maxRules), perHour: Number(form.perHour) }); },
      }, props.busy ? t("common.loading") : t("common.save")),
      props.dirty ? null : h("span", { className: "wba-hint" }, t("config.limit.unchanged"))),
    h("hr", { className: "wba-sep" }),
    h("div", { className: "wba-panel-h" },
      h("p", { className: "wba-panel-title" }, t("config.constraints.title")),
      icon ? h("span", { className: "wba-card-ico" }, icon("shield-check", 16)) : null),
    h("ul", { className: "wba-list" }, CONSTRAINTS.map(function (k) {
      return h("li", { key: k }, t("config.c." + k));
    })));
}

module.exports = function ConfigView(props) {
  var h = props.h;
  var api = props.api;
  var React = props.React;
  var lang = props.lang === "en" ? "en" : "zh";
  var t = function (key, vars) { return copy.t(lang, key, vars); };
  var cfg = C.useLoad(React, api, "automation.configGet", {}, []);
  var formS = React.useState(null);
  var busyS = React.useState(false);
  var msgS = React.useState(null);
  var savedS = React.useState(false);

  React.useEffect(function () {
    if (cfg.data && !formS[0]) {
      formS[1]({ maxRules: String(cfg.data.maxRules), perHour: String(cfg.data.perHour) });
    }
  }, [cfg.data]);

  var form = formS[0] || { maxRules: "", perHour: "" };
  var base = cfg.data || {};
  var dirty = String(form.maxRules) !== String(base.maxRules) || String(form.perHour) !== String(base.perHour);

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
        h(C.Btn, { h: h, onClick: cfg.refresh }, t("common.refresh")))),
    msgS[0] ? h(C.Notice, { h: h, kind: msgS[0].kind, text: msgS[0].text }) : null,
    cfg.error ? h(C.Notice, { h: h, kind: "error", text: cfg.error }) : null,
    cfg.loading && !cfg.data
      ? h("div", { className: "wba-panel" }, h("div", { className: "wba-skel" }), h("div", { className: "wba-skel" }))
      : h(ConfigBody, {
          h: h,
          t: t,
          icon: props.icon,
          form: form,
          busy: busyS[0],
          dirty: dirty,
          saved: savedS[0],
          onChange: function (k, v) { formS[1](Object.assign({}, form, { [k]: v })); },
          onSave: save,
        }));
};

module.exports.ConfigBody = ConfigBody;
module.exports.CONSTRAINTS = CONSTRAINTS;
