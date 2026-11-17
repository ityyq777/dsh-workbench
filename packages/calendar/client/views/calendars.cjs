"use strict";
module.exports = function Calendars(props) {
  var h = props.h, React = props.React, api = props.api;
  var C = require("../ui/common.cjs");
  var load = C.useLoad(React, api, "calendar.calendarList", {}, []);
  var name = React.useState("");
  var msg = React.useState(null);
  function add() {
    if (!name[0].trim()) return;
    C.call(api, "calendar.calendarCreate", { name: name[0].trim() }).then(function () { name[1](""); load.refresh(); }).catch(function (e) { msg[1]({ kind: "error", text: C.errText(e) }); });
  }
  function del(id) { C.call(api, "calendar.calendarDelete", { id: id }).then(function () { load.refresh(); }).catch(function (e) { msg[1]({ kind: "error", text: C.errText(e) }); }); }
  var items = (load.data && load.data.items) || [];
  return h("div", { className: "wbca-page" },
    h("div", { className: "wbca-head" }, h("div", null, h("h2", null, "日历"), h("p", { className: "wbca-sub" }, "本地日历；事件默认写入第一个")), null),
    h("div", { className: "wbca-row" }, h("input", { className: "wbca-input", placeholder: "新日历名称", value: name[0], onChange: function (e) { name[1](e.target.value); }, onKeyDown: function (e) { if (e.key === "Enter") add(); } }), h(C.Btn, { h: h, kind: "primary", onClick: add }, "添加")),
    h(C.Notice, { h: h, text: msg[0] && msg[0].text, kind: msg[0] && msg[0].kind }),
    load.loading ? h(C.Empty, { h: h, text: "加载中…" }) : load.error ? h(C.Notice, { h: h, kind: "error", text: load.error }) : items.length === 0 ? h(C.Empty, { h: h, text: "还没有日历" }) :
      h("div", { className: "wbca-list" }, items.map(function (c) { return h("div", { key: c.id, className: "wbca-list-row" }, h("span", { className: "wbca-dot", style: { background: c.color || "#11a89b" } }), h("div", { className: "wbca-main" }, h("strong", null, c.name), h("span", { className: "wbca-muted" }, c.tz)), h("button", { type: "button", className: "wbca-icon-btn", title: "删除", onClick: function () { del(c.id); } }, "×")); }))
  );
};
