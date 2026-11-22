"use strict";
/** AI 规则的宿主投递历史：只读列表 + 逐页往前翻。 */
var createOverlay = require("../../../lib/overlay.cjs");
var C = require("../ui/common.cjs");
var copy = require("../ui/copy.cjs");

var HistoryOverlay = createOverlay({
  maskClass: "wba-modal",
  dialogClass: "wba-modal-box",
  ariaLabelOf: function (props) {
    return props.t("hist.title");
  },
  closeOnMask: true,
  autoFocusDialog: false,
});

var LIMIT = 20;

function when(rec, lang) {
  var ts = rec && (rec.deliveredAt || rec.scheduledAt);
  if (!ts) return "";
  var ms = Date.parse(ts);
  return isNaN(ms) ? String(ts) : C.fmtTime(ms, lang);
}

function AgentHistory(props) {
  var h = props.h;
  var api = props.api;
  var React = props.React;
  var icon = props.icon;
  var lang = props.lang === "en" ? "en" : "zh";
  var t = function (key, vars) { return copy.t(lang, key, vars); };
  var rule = props.rule;
  // 游标是「上一页最旧一条」的消息 id；宿主按它往前翻，不需要我们自己算时间。
  var cursorS = React.useState("");
  var state = C.useLoad(React, api, "automation.ruleHistory", { id: rule.id, limit: LIMIT, before: cursorS[0] || undefined }, [rule.id, cursorS[0]]);
  var data = state.data || {};
  var records = data.records || [];
  var missing = Boolean(rule.scheduleMissing) || (data.earlierRecordsUnavailable && records.length === 0);
  var oldest = records.length ? records[records.length - 1].messageId : "";
  var canOlder = records.length === LIMIT && Boolean(oldest);

  return h(HistoryOverlay, { t: t, onClose: props.onClose },
    h("div", { className: "wba-modal-head" },
      h("h3", null, t("hist.title") + " · " + rule.name),
      h("button", { type: "button", className: "wba-icon-btn", title: t("common.close"), onClick: props.onClose }, icon ? icon("x", 15) : "×")),
    h("div", { className: "wba-modal-body" },
      h("p", { className: "wba-sub" }, t("hist.subtitle")),
      state.error ? h(C.Notice, { h: h, kind: "error", text: state.error }) : null,
      missing
        ? h("p", { className: "wba-sub" }, t("hist.missing"))
        : state.loading && records.length === 0
          ? h("div", { className: "wba-hist" }, [1, 2, 3].map(function (i) { return h("div", { key: i, className: "wba-skel" }); }))
          : records.length === 0
            ? h("p", { className: "wba-sub" }, t("hist.empty"))
            : h("div", { className: "wba-hist" },
                h("p", { className: "wba-sub" }, t("hist.records", { n: records.length })),
                records.map(function (rec, i) {
                  return h("div", { key: rec.messageId || i, className: "wba-hist-row" },
                    h("div", { className: "wba-inline" },
                      icon ? icon("send", 13) : null,
                      h("span", { className: "wba-nowrap" }, when(rec, lang)),
                      h("code", { className: "wba-mono wba-ellipsis", title: rec.targetSessionId }, rec.targetSessionId || "")),
                    rec.prompt ? h("pre", { className: "wba-pre" }, rec.prompt) : null);
                }),
                data.earlierRecordsPruned ? h("p", { className: "wba-sub" }, t("hist.pruned")) : null,
                canOlder
                  ? h(C.Btn, { h: h, onClick: function () { cursorS[1](oldest); } }, t("common.more"))
                  : null)),
    h("div", { className: "wba-modal-foot" },
      h("span", { className: "wba-grow" }),
      h(C.Btn, { h: h, onClick: props.onClose }, t("common.close"))));
}

module.exports = AgentHistory;
module.exports.AgentHistory = AgentHistory;
