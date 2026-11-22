"use strict";
/**
 * 「交给 AI」的时间字段：7 种由宿主调度的时间类型。
 *
 * 与 action 模式的时间（interval/dailyAt/event/manual）完全独立：这里生成的是
 * 宿主 ScheduleTiming 请求结构（内层 snake_case），真正的时间计算、时区换算与
 * 投递都由宿主「自动化任务」服务负责，本插件只做表单与描述。
 */
var NF = require("../../../lib/number-field.cjs");
var copy = require("../ui/copy.cjs");
var trig = require("./trigger-fields.cjs");

/** 间隔与延迟的取值范围（分钟）：只用于提示与校验，不在输入期夹取。 */
var EVERY = { min: 1, max: 43200, integer: true };
var AFTER = { min: 1, max: 525600, integer: true };

var KINDS = [
  ["every", "repeat", "agent.every"],
  ["daily", "alarm-clock", "agent.daily"],
  ["weekly", "calendar-clock", "agent.weekly"],
  ["cron", "clock", "agent.cron"],
  ["rrule", "repeat", "agent.rrule"],
  ["at", "calendar-clock", "agent.at"],
  ["after", "hourglass", "agent.after"],
];

/** <input type="time"> 给的是 HH:MM，宿主要求 HH:mm:ss。 */
function hhmm(value) {
  var s = String(value || "").trim();
  return /^\d{2}:\d{2}$/.test(s) ? s + ":00" : s;
}

/** 表单字段 → 宿主 ScheduleTiming 请求结构。 */
function buildTiming(form) {
  var kind = form.pKind || "daily";
  var tz = form.pTz || "Asia/Shanghai";
  if (kind === "every") return { kind: "every", every_seconds: (Number(form.pEvery) || 60) * 60 };
  if (kind === "after") return { kind: "after", after_seconds: (Number(form.pAfter) || 60) * 60 };
  if (kind === "daily") return { kind: "daily", daily: { time: hhmm(form.pTime), time_zone: tz } };
  if (kind === "weekly") {
    return { kind: "weekly", weekly: { time: hhmm(form.pTime), time_zone: tz, weekdays: trig.daysOf(form.pWeekdays) } };
  }
  if (kind === "cron") return { kind: "cron", cron: { expression: String(form.pCron || "").trim().replace(/\s+/g, " "), time_zone: tz } };
  if (kind === "at") return { kind: "at", at: { date: String(form.pDate || "").trim(), time: hhmm(form.pTime), time_zone: tz } };
  return { kind: "rrule", rrule: String(form.pRrule || "").replace(/\r\n/g, "\n") };
}

/** 只校验当前类型用到的字段，其它类型的残留值不影响保存。 */
function validateTiming(form, t) {
  var errs = {};
  var kind = form.pKind || "daily";
  if (kind === "every") {
    var every = Number(form.pEvery);
    if (!isFinite(every) || every < EVERY.min || every > EVERY.max) errs.pEvery = t("agent.everyHint");
  }
  if (kind === "after") {
    var after = Number(form.pAfter);
    if (!isFinite(after) || after < AFTER.min || after > AFTER.max) errs.pAfter = t("agent.afterHint");
  }
  if (kind === "daily" || kind === "weekly" || kind === "at") {
    if (!/^\d{2}:\d{2}$/.test(String(form.pTime || ""))) errs.pTime = t("trigger.time");
  }
  if (kind === "weekly" && trig.daysOf(form.pWeekdays).length === 0) errs.pWeekdays = t("trigger.weekdaysHint");
  if (kind === "at" && !/^\d{4}-\d{2}-\d{2}$/.test(String(form.pDate || ""))) errs.pDate = t("agent.date");
  if (kind === "cron") {
    var expr = String(form.pCron || "").trim();
    if (expr.split(/\s+/).filter(Boolean).length !== 5) errs.pCron = t("agent.cronHint");
  }
  if (kind === "rrule" && !/^DTSTART[^\n]*\nRRULE:/i.test(String(form.pRrule || "").replace(/\r\n/g, "\n"))) {
    errs.pRrule = t("agent.rruleHint");
  }
  return errs;
}

/** 列表里的时间描述：入参是宿主记录或本地快照（内层 snake_case）。 */
function timingText(timing, t) {
  var c = timing || {};
  if (c.kind === "every") {
    var mins = Math.round((Number(c.every_seconds) || 60) / 60);
    return mins % 60 === 0 && mins >= 60
      ? t("agent.text.everyHours", { n: mins / 60 })
      : t("agent.text.every", { n: mins });
  }
  if (c.kind === "after") {
    return t("agent.text.after", { n: Math.round((Number(c.after_seconds) || 60) / 60) });
  }
  if (c.kind === "daily" && c.daily) return t("agent.text.daily", { time: String(c.daily.time || "").slice(0, 5), tz: c.daily.time_zone || "" });
  if (c.kind === "weekly" && c.weekly) {
    var days = (Array.isArray(c.weekly.weekdays) ? c.weekly.weekdays : [])
      .map(function (d) { return t("trigger.wd." + d); })
      .join("、");
    return t("agent.text.weekly", { days: days, time: String(c.weekly.time || "").slice(0, 5), tz: c.weekly.time_zone || "" });
  }
  if (c.kind === "cron" && c.cron) return t("agent.text.cron", { expr: c.cron.expression || "", tz: c.cron.time_zone || "" });
  if (c.kind === "rrule") {
    var m = String(c.rrule || "").match(/RRULE:([^\n]*)/i);
    return t("agent.text.rrule", { expr: m ? m[1] : "" });
  }
  if (c.kind === "at") {
    var at = c.at;
    if (typeof at === "string") return t("agent.text.at", { at: at });
    if (at && at.date) return t("agent.text.at", { at: at.date + " " + String(at.time || "").slice(0, 5) + "（" + (at.time_zone || "") + "）" });
  }
  return t("agent.text.missing");
}

function TimingFields(props) {
  var h = props.h;
  var t = props.t;
  var icon = props.icon;
  var lang = props.lang;
  var form = props.form;
  var set = props.set;
  var errs = props.errs || {};
  var kind = form.pKind || "daily";
  var days = trig.daysOf(form.pWeekdays);
  // 数字框的合法性要报给上层，非法草稿不允许保存（与 action 模式同一套约定）。
  function reportValid(ok) {
    if (typeof props.onValidChange === "function") props.onValidChange(ok);
  }
  function toggleDay(day) {
    var list = trig.daysOf(form.pWeekdays);
    var i = list.indexOf(day);
    if (i === -1) list.push(day);
    else list.splice(i, 1);
    list.sort(function (a, b) { return a - b; });
    set("pWeekdays", list.join(","));
  }
  var tzOptions = trig.TZ_LIST.indexOf(form.pTz) === -1 ? [form.pTz].concat(trig.TZ_LIST) : trig.TZ_LIST;

  return h("div", { className: "wba-block" },
    h("div", { className: "wba-seg", role: "group" },
      KINDS.map(function (k) {
        return h("button", {
          key: k[0],
          type: "button",
          "aria-pressed": kind === k[0],
          onClick: function () {
            reportValid(true);
            set("pKind", k[0]);
          },
        }, icon ? h("span", { className: "wba-inline" }, icon(k[1], 12), t(k[2])) : t(k[2]));
      })),
    kind === "every" ? h("label", { className: "wba-field" },
      h("span", { className: "wba-label" }, t("agent.every")),
      h(NF.NumberField, {
        h: h,
        lang: lang,
        value: form.pEvery,
        min: EVERY.min,
        max: EVERY.max,
        integer: EVERY.integer,
        className: "wba-num",
        hint: false,
        ariaLabel: t("agent.every"),
        onCommit: function (next) { set("pEvery", next); },
        onValidChange: function (ok) { reportValid(ok); },
      }),
      errs.pEvery ? h("span", { className: "wba-err-text" }, errs.pEvery) : h("span", { className: "wba-hint" }, t("agent.everyHint"))) : null,
    kind === "after" ? h("label", { className: "wba-field" },
      h("span", { className: "wba-label" }, t("agent.after")),
      h(NF.NumberField, {
        h: h,
        lang: lang,
        value: form.pAfter,
        min: AFTER.min,
        max: AFTER.max,
        integer: AFTER.integer,
        className: "wba-num",
        hint: false,
        ariaLabel: t("agent.after"),
        onCommit: function (next) { set("pAfter", next); },
        onValidChange: function (ok) { reportValid(ok); },
      }),
      errs.pAfter ? h("span", { className: "wba-err-text" }, errs.pAfter) : h("span", { className: "wba-hint" }, t("agent.afterHint"))) : null,
    kind === "daily" || kind === "weekly" || kind === "at"
      ? h("div", { className: (kind === "at" ? "wba-grid-3" : "wba-grid-2") },
          kind === "at" ? h("label", { className: "wba-field" },
            h("span", { className: "wba-label" }, t("agent.date")),
            h("input", {
              className: "wba-input" + (errs.pDate ? " err" : ""),
              type: "date",
              value: form.pDate,
              onChange: function (e) { set("pDate", e.target.value); },
            }),
            errs.pDate ? h("span", { className: "wba-err-text" }, errs.pDate) : null) : null,
          h("label", { className: "wba-field" },
            h("span", { className: "wba-label" }, t("trigger.time")),
            h("input", {
              className: "wba-input" + (errs.pTime ? " err" : ""),
              type: "time",
              value: form.pTime,
              onChange: function (e) { set("pTime", e.target.value); },
            }),
            errs.pTime ? h("span", { className: "wba-err-text" }, errs.pTime) : null),
          h("label", { className: "wba-field" },
            h("span", { className: "wba-label" }, t("trigger.tz")),
            h("select", { className: "wba-input", value: form.pTz, onChange: function (e) { set("pTz", e.target.value); } },
              tzOptions.map(function (z) { return h("option", { key: z, value: z }, z); }))),
          kind === "weekly" ? h("div", { className: "wba-field wba-span-2" },
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
            h("span", { className: "wba-hint" }, t("trigger.weekdaysHint"))) : null)
      : null,
    kind === "cron" ? h("div", { className: "wba-grid-2" },
      h("label", { className: "wba-field" },
        h("span", { className: "wba-label" }, t("agent.cron")),
        h("input", {
          className: "wba-input" + (errs.pCron ? " err" : ""),
          value: form.pCron,
          placeholder: t("agent.cronPh"),
          spellCheck: false,
          onChange: function (e) { set("pCron", e.target.value); },
        }),
        errs.pCron ? h("span", { className: "wba-err-text" }, errs.pCron) : h("span", { className: "wba-hint" }, t("agent.cronHint"))),
      h("label", { className: "wba-field" },
        h("span", { className: "wba-label" }, t("trigger.tz")),
        h("select", { className: "wba-input", value: form.pTz, onChange: function (e) { set("pTz", e.target.value); } },
          tzOptions.map(function (z) { return h("option", { key: z, value: z }, z); })))) : null,
    kind === "rrule" ? h("label", { className: "wba-field" },
      h("span", { className: "wba-label" }, t("agent.rrule")),
      h("textarea", {
        className: "wba-code sm" + (errs.pRrule ? " err" : ""),
        value: form.pRrule,
        placeholder: t("agent.rrulePh"),
        spellCheck: false,
        onChange: function (e) { set("pRrule", e.target.value); },
      }),
      errs.pRrule ? h("span", { className: "wba-err-text" }, errs.pRrule) : h("span", { className: "wba-hint" }, t("agent.rruleHint"))) : null);
}

module.exports = {
  KINDS: KINDS,
  buildTiming: buildTiming,
  validateTiming: validateTiming,
  timingText: timingText,
  TimingFields: TimingFields,
};
