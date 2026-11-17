"use strict";
var C = require("../ui/common.cjs");
module.exports = function ItemsView(props) {
  var h = props.h, api = props.api, React = props.React, lang = props.lang || "zh";
  var qS = React.useState(""), srcS = React.useState(""), selS = React.useState(null);
  var s = C.useLoad(React, api, "connector.itemList", { q: qS[0], sourceId: srcS[0], limit: 100 }, [qS[0], srcS[0]]);
  var srcs = C.useLoad(React, api, "connector.sourceList", {}, []);
  var list = (s.data && s.data.items) || [];
  var sources = (srcs.data && srcs.data.sources) || [];
  return h("div", { className: "wbc-wrap" },
    h("div", { className: "wbc-head" }, h("div", null, h("h2", { className: "wbc-title" }, "内容"), h("p", { className: "wbc-sub" }, "按 external_id 去重；点标题看摘要与原始字段。")), h(C.Btn, { h: h, onClick: s.refresh }, "刷新")),
    h("div", { className: "wbc-row" },
      h(C.Field, { h: h, label: "搜索" }, h("input", { value: qS[0], onChange: function (e) { qS[1](e.target.value); }, placeholder: "标题 / 摘要 / 作者" })),
      h(C.Field, { h: h, label: "来源" }, h("select", { value: srcS[0], onChange: function (e) { srcS[1](e.target.value); } }, h("option", { value: "" }, "全部来源"), sources.map(function (x) { return h("option", { key: x.id, value: x.id }, x.name); })))),
    s.error ? h(C.Notice, { h: h, kind: "error", text: s.error }) : null,
    s.loading ? h(C.Empty, { h: h, text: "加载中…" }) : list.length === 0 ? h(C.Empty, { h: h, text: "还没有内容；新建来源后等一次抓取，或用 Webhook 推送。" }) : h("div", { className: "wbc-card" },
      h("table", { className: "wbc-table" }, h("thead", null, h("tr", null, h("th", null, "标题"), h("th", null, "来源"), h("th", null, "发布"), h("th", null, "抓取"))), h("tbody", null, list.map(function (it) {
        return h("tr", { key: it.id }, h("td", null, h("a", { className: "wbc-link", href: it.url || "#", target: "_blank", rel: "noreferrer", onClick: function (e) { if (!it.url) { e.preventDefault(); selS[1](it); } } }, it.title || "(无标题)")), h("td", null, it.sourceName || it.source_id), h("td", null, C.fmtTime(it.publishedAt, lang)), h("td", null, C.fmtTime(it.fetchedAt, lang)));
      })))),
    selS[0] ? h("div", { className: "wbc-card" }, h("div", { className: "wbc-head" }, h("strong", null, selS[0].title), h(C.Btn, { h: h, onClick: function () { selS[1](null); } }, "关闭")), h("p", { className: "wbc-sub" }, selS[0].summary || ""), h(C.Json, { h: h, value: selS[0] })) : null
  );
};
