"use strict";
var C = require("../ui/common.cjs");
module.exports = function RunsView(props) {
  var h = props.h, api = props.api, React = props.React, lang = props.lang || "zh";
  var s = C.useLoad(React, api, "connector.runList", { limit: 50 }, []);
  var rows = (s.data && s.data.runs) || [];
  return h("div", { className: "wbc-wrap" },
    h("div", { className: "wbc-head" }, h("div", null, h("h2", { className: "wbc-title" }, "运行记录"), h("p", { className: "wbc-sub" }, "每次抓取/推送的计数与错误；失败会指数退避。")), h(C.Btn, { h: h, onClick: s.refresh }, "刷新")),
    s.error ? h(C.Notice, { h: h, kind: "error", text: s.error }) : null,
    s.loading ? h(C.Empty, { h: h, text: "加载中…" }) : rows.length === 0 ? h(C.Empty, { h: h, text: "还没有运行记录。" }) : h("div", { className: "wbc-card" },
      h("table", { className: "wbc-table" }, h("thead", null, h("tr", null, h("th", null, "开始"), h("th", null, "来源"), h("th", null, "触发"), h("th", null, "状态"), h("th", null, "抓取/新增/更新/跳过"), h("th", null, "错误"))), h("tbody", null, rows.map(function (r) {
        return h("tr", { key: r.id }, h("td", null, C.fmtTime(r.startedAt, lang)), h("td", null, r.sourceName || r.source_id), h("td", null, r.trigger), h("td", null, h(C.Pill, { h: h, kind: r.status === "ok" ? "ok" : "error" }, r.status)), h("td", null, [r.fetched, r.inserted, r.updated, r.skipped].join(" / ")), h("td", { className: "wbc-muted" }, r.error || "—"));
      }))))
  );
};
