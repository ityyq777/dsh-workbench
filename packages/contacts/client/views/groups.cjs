"use strict";
var C = require("../ui/common.cjs");
module.exports = function GroupsView(props) {
  var h = props.h, api = props.api, React = props.React;
  var list = C.useLoad(React, api, "contacts.groupList", {}, []);
  var name = React.useState(""); var color = React.useState("#11a89b"); var msg = React.useState("");
  function create() {
    C.call(api, "contacts.groupCreate", { name: name[0], color: color[0] }).then(function () { name[1](""); list.refresh(); }).catch(function (e) { msg[1](C.errText(e)); });
  }
  function remove(g) { if (typeof window !== "undefined" && !window.confirm("删除分组「" + g.name + "」？联系人本身不会被删除。")) return; C.call(api, "contacts.groupDelete", { id: g.id }).then(function () { list.refresh(); }).catch(function (e) { msg[1](C.errText(e)); }); }
  var rows = (list.data && list.data.items) || [];
  return h("div", { className: "wbct-wrap" },
    h("h2", null, "分组"),
    h(C.Notice, { h: h, text: msg[0] }),
    h("div", { className: "wbct-panel" },
      h("div", { className: "wbct-row" },
        h("input", { className: "wbct-input", placeholder: "新分组名称", value: name[0], onChange: function (e) { name[1](e.target.value); } }),
        h("input", { className: "wbct-input", type: "color", value: color[0], onChange: function (e) { color[1](e.target.value); }, style: { width: "48px" } }),
        h(C.Btn, { h: h, kind: "primary", onClick: create }, "新建"))),
    rows.length === 0 && !list.loading ? h(C.Empty, { h: h, text: "还没有分组" }) : null,
    h("div", { className: "wbct-table-wrap" }, h("table", { className: "wbct-table" },
      h("thead", null, h("tr", null, ["名称", "颜色", "人数", "操作"].map(function (x) { return h("th", { key: x }, x); }))),
      h("tbody", null, rows.map(function (g) {
        return h("tr", { key: g.id }, h("td", null, h(C.Pill, { h: h }, g.name)), h("td", null, g.color || "—"), h("td", null, g.count || 0), h("td", null, h(C.Btn, { h: h, kind: "danger", onClick: function () { remove(g); } }, "删除")));
      })))));
};
