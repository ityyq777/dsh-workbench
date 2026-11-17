"use strict";
var C = require("../ui/common.cjs");
module.exports = function StatsView(props) {
  var h = props.h, api = props.api, React = props.React, lang = props.lang || "zh";
  var s = C.useLoad(React, api, "connector.stats", {}, []);
  var d = s.data || {};
  return h("div", { className: "wbc-wrap" },
    h("div", { className: "wbc-head" }, h("div", null, h("h2", { className: "wbc-title" }, "连接器概览"), h("p", { className: "wbc-sub" }, "RSS 与 Webhook 内容接入；来源定义可同步，凭据和本机状态不出机器。")), h(C.Btn, { h: h, onClick: s.refresh }, "刷新")),
    s.error ? h(C.Notice, { h: h, kind: "error", text: s.error }) : null,
    h("div", { className: "wbc-grid" },
      h("div", { className: "wbc-card" }, h("div", { className: "wbc-kpi" }, d.sources || 0), h("div", { className: "wbc-kpi-label" }, "来源")),
      h("div", { className: "wbc-card" }, h("div", { className: "wbc-kpi" }, d.enabled || 0), h("div", { className: "wbc-kpi-label" }, "启用中")),
      h("div", { className: "wbc-card" }, h("div", { className: "wbc-kpi" }, d.items || 0), h("div", { className: "wbc-kpi-label" }, "已抓取内容")),
      h("div", { className: "wbc-card" }, h("div", { className: "wbc-kpi" }, d.errorSources || 0), h("div", { className: "wbc-kpi-label" }, "错误来源"))),
    h("div", { className: "wbc-card" },
      h("div", { className: "wbc-row" }, h("strong", null, "最近一次运行"), d.lastRun ? h(C.Pill, { h: h, kind: d.lastRun.status === "ok" ? "ok" : "error" }, d.lastRun.status) : h("span", { className: "wbc-muted" }, "还没有运行记录")),
      d.lastRun ? h("p", { className: "wbc-sub" }, C.fmtTime(d.lastRun.startedAt, lang)) : null),
    h("div", { className: "wbc-card" }, h("strong", null, "开始使用"), h("ol", { className: "wbc-sub" }, h("li", null, "先到「凭据」建立并解锁保险箱（Webhook token 需要）。"), h("li", null, "在「来源」新建 RSS 或 Webhook 来源。"), h("li", null, "按需开启投递，新内容会进入消息域。")))
  );
};
