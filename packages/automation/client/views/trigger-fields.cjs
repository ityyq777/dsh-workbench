"use strict";
/** 触发类型分段器与四类触发字段；切换类型只改 form.kind，四组字段值各自保留。 */
var copy = require("../ui/copy.cjs");

var TZ_LIST = ["Asia/Shanghai", "UTC", "Asia/Tokyo", "Europe/London", "America/New_York"];
var DOMAIN_HINTS = ["wb-addon-connector", "wb-addon-message", "wb-addon-tasks", "wb-addon-sites"];
var EVENT_HINTS = ["item.created", "message.sent", "task.created", "site.created"];

function daysOf(value) {
  return String(value || "")
    .split(",")
    .map(function (x) { return Number(String(x).trim()); })
    .filter(function (n) { return n >= 1 && n <= 7; });
}

/** 列表里的触发描述；rule.triggerConfig 优先，回落到 triggerType。 */
function triggerText(rule, t) {
  var c = (rule && rule.triggerConfig) || {};
  var kind = c.kind || (rule && rule.triggerType) || "manual";
  if (kind === "interval") {
    var n = Number(c.everyMinutes) || 60;
    return n % 60 === 0 && n >= 60 ? t("trigger.interval.textHours", { n: n / 60 }) : t("trigger.interval.text", { n: n });
  }
  if (kind === "dailyAt") return t("trigger.daily.text", { time: c.time || "09:00", tz: c.tz || "UTC" });
  if (kind === "event") return t("trigger.event.text", { domain: c.domainId || "?", event: c.event || "?" });
  return t("trigger.manual.text");
}

function TriggerFields(props) {
  var h = props.h;
  var t = props.t;
  var form = props.form;
  var set = props.set;
  var errs = props.errs || {};
  var icon = props.icon;
  function unitOf(minutes) {
    var n = Number(minutes) || 60;
    return n >= 60 && n % 60 === 0 ? 60 : 1;
  }
  function changeUnit(unit) {
    var n = Number(form.everyMinutes) || 60;
    if (unit === 60) set("everyMinutes", Math.max(1, Math.min(10080, Math.round(n / 60) * 60)));
    else set("everyMinutes", Math.max(1, Math.min(10080, n)));
  }
  function toggleDay(day) {
    var days = daysOf(form.weekdays);
    var i = days.indexOf(day);
    if (i === -1) days.push(day);
    else days.splice(i, 1);
    days.sort(function (a, b) { return a - b; });
    set("weekdays", days.join(","));
  }
  var kinds = [
    ["interval", "timer", t("trigger.interval")],
    ["dailyAt", "alarm-clock", t("trigger.dailyAt")],
    ["event", "radio", t("trigger.event")],
    ["manual", "hand", t("trigger.manual")],
  ];
  var unit = unitOf(form.everyMinutes);
  var days = daysOf(form.weekdays);
  return h("div", { className: "wba-block" },
    h("div", { className: "wba-seg", role: "group" },
      kinds.map(function (k) {
        return h("button", {
          key: k[0],
          type: "button",
          "aria-pressed": form.kind === k[0],
          onClick: function () { set("kind", k[0]); },
        }, icon ? h("span", { className: "wba-inline" }, icon(k[1], 12), k[2]) : k[2]);
      })),
    form.kind === "interval" ? h("div", { className: "wba-grid-2" },
      h("label", { className: "wba-field" },
        h("span", { className: "wba-label" }, t("trigger.every")),
        h("div", { className: "wba-inline" },
          h("input", {
            className: "wba-input wba-w-120" + (errs.everyMinutes ? " err" : ""),
            type: "number",
            min: 1,
            max: 10080,
            step: unit,
            value: form.everyMinutes,
            "aria-label": t("trigger.every"),
            onChange: function (e) { set("everyMinutes", e.target.value); },
          }),
          h("select", {
            className: "wba-input wba-w-96",
            value: unit,
            "aria-label": t("trigger.minutes"),
            onChange: function (e) { changeUnit(Number(e.target.value)); },
          },
            h("option", { value: 1 }, t("trigger.minutes")),
            h("option", { value: 60 }, t("trigger.hours")))),
        errs.everyMinutes ? h("span", { className: "wba-err-text" }, errs.everyMinutes) : h("span", { className: "wba-hint" }, t("trigger.intervalHint")))) : null,
    form.kind === "dailyAt" ? h("div", { className: "wba-grid-3" },
      h("label", { className: "wba-field" },
        h("span", { className: "wba-label" }, t("trigger.time")),
        h("input", { className: "wba-input" + (errs.time ? " err" : ""), type: "time", value: form.time, onChange: function (e) { set("time", e.target.value); } }),
        errs.time ? h("span", { className: "wba-err-text" }, errs.time) : null),
      h("label", { className: "wba-field" },
        h("span", { className: "wba-label" }, t("trigger.tz")),
        h("select", { className: "wba-input", value: form.tz, onChange: function (e) { set("tz", e.target.value); } },
          (TZ_LIST.indexOf(form.tz) === -1 ? [form.tz].concat(TZ_LIST) : TZ_LIST).map(function (z) {
            return h("option", { key: z, value: z }, z);
          }))),
      h("div", { className: "wba-field" },
        h("span", { className: "wba-label" }, t("trigger.weekdays")),
        h("div", { className: "wba-chips" },
          copy.WEEKDAYS.map(function (d) {
            return h("button", {
              key: d,
              type: "button",
              className: "wba-chip",
              "aria-pressed": days.indexOf(d) !== -1,
              onClick: function () { toggleDay(d); },
            }, t("trigger.wd." + d));
          })),
        h("span", { className: "wba-hint" }, t("trigger.weekdaysHint")))) : null,
    form.kind === "event" ? h("div", { className: "wba-grid-2" },
      h("label", { className: "wba-field" },
        h("span", { className: "wba-label" }, t("trigger.domain")),
        h("input", {
          className: "wba-input" + (errs.domainId ? " err" : ""),
          value: form.domainId,
          list: "wba-domain-hints",
          placeholder: "wb-addon-connector",
          onChange: function (e) { set("domainId", e.target.value); },
        }),
        h("datalist", { id: "wba-domain-hints" }, DOMAIN_HINTS.map(function (d) { return h("option", { key: d, value: d }); })),
        errs.domainId ? h("span", { className: "wba-err-text" }, errs.domainId) : h("span", { className: "wba-hint" }, t("trigger.eventHint"))),
      h("label", { className: "wba-field" },
        h("span", { className: "wba-label" }, t("trigger.eventName")),
        h("input", {
          className: "wba-input" + (errs.event ? " err" : ""),
          value: form.event,
          list: "wba-event-hints",
          placeholder: "item.created",
          onChange: function (e) { set("event", e.target.value); },
        }),
        h("datalist", { id: "wba-event-hints" }, EVENT_HINTS.map(function (d) { return h("option", { key: d, value: d }); })),
        errs.event ? h("span", { className: "wba-err-text" }, errs.event) : null)) : null,
    form.kind === "manual" ? h("p", { className: "wba-sub" }, t("trigger.manualHint")) : null);
}

module.exports = { TriggerFields: TriggerFields, triggerText: triggerText, daysOf: daysOf, TZ_LIST: TZ_LIST };
