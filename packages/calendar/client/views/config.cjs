"use strict";
module.exports = function Config(props) {
  var h = props.h, React = props.React, api = props.api;
  var C = require("../ui/common.cjs");
  var s = C.useLoad(React, api, "calendar.stats", {}, []);
  return h("div", { className: "wbca-page" },
    h("h2", null, "设置与说明"),
    s.error ? h(C.Notice, { h: h, kind: "error", text: s.error }) : h("div", { className: "wbca-cards" },
      h("div", { className: "wbca-card" }, h("div", { className: "wbca-muted" }, "日历"), h("strong", { className: "wbca-big" }, s.data ? s.data.calendars : "—")),
      h("div", { className: "wbca-card" }, h("div", { className: "wbca-muted" }, "事件"), h("strong", { className: "wbca-big" }, s.data ? s.data.events : "—")),
      h("div", { className: "wbca-card" }, h("div", { className: "wbca-muted" }, "未来 7 天"), h("strong", { className: "wbca-big" }, s.data ? s.data.next7d : "—"))),
    h("div", { className: "wbca-card" },
      h("h3", null, "边界"),
      h("ul", { className: "wbca-ul" },
        h("li", null, "只在本机保存，不参与云同步；备份包含日历与事件。"),
        h("li", null, "RRULE 只存原文，不展开重复事件。"),
        h("li", null, "不连接 CalDAV；需要远端日历时通过连接器另行扩展。"),
        h("li", null, "提醒通过 message.send 发送，不做系统级通知。"))),
    h("div", { className: "wbca-card" }, h("h3", null, "当前数据"), h(C.Json, { h: h, value: s.data || {} }))
  );
};
