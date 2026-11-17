"use strict";
var C = require("../ui/common.cjs");

function empty() { return { id: "", name: "", org: "", title: "", note: "", birthday: "", fieldsText: "", groups: [] }; }
function fieldsText(fields) { return (fields || []).map(function (f) { return f.kind + ":" + f.value; }).join("\n"); }
function fromContact(c) { return { id: c.id, name: c.name, org: c.org, title: c.title, note: c.note, birthday: c.birthday, fieldsText: fieldsText(c.fields), groups: (c.groups || []).map(function (g) { return g.id; }) }; }
function parseFields(text) {
  return String(text || "").split(/\n+/).map(function (line) { return line.trim(); }).filter(Boolean).map(function (line) {
    var i = line.indexOf(":");
    if (i < 0) return { kind: "email", value: line };
    return { kind: line.slice(0, i).trim() || "email", value: line.slice(i + 1).trim() };
  }).filter(function (f) { return f.value; });
}

module.exports = function ContactsView(props) {
  var h = props.h, api = props.api, React = props.React;
  var q = React.useState("");
  var form = React.useState(null);
  var msg = React.useState("");
  var list = C.useLoad(React, api, "contacts.list", { q: q[0] || undefined, limit: 100 }, [q[0]]);
  var groups = C.useLoad(React, api, "contacts.groupList", {}, []);
  var f = form[0];
  function set(k, v) { var n = Object.assign({}, f); n[k] = v; form[1](n); }
  function fail(e) { msg[1](C.errText(e)); }
  function save() {
    var payload = { id: f.id || undefined, name: f.name, org: f.org, title: f.title, note: f.note, birthday: f.birthday, fields: parseFields(f.fieldsText), groups: f.groups };
    C.call(api, f.id ? "contacts.update" : "contacts.create", payload).then(function () { form[1](null); list.refresh(); msg[1]("已保存"); }).catch(fail);
  }
  function remove(c) {
    if (typeof window !== "undefined" && !window.confirm("删除联系人「" + c.name + "」？")) return;
    C.call(api, "contacts.delete", { id: c.id }).then(function () { list.refresh(); }).catch(fail);
  }
  var rows = (list.data && list.data.items) || [];
  var gs = (groups.data && groups.data.items) || [];
  function toggleGroup(id) { var cur = f.groups || []; set("groups", cur.indexOf(id) >= 0 ? cur.filter(function (x) { return x !== id; }) : cur.concat([id])); }
  return h("div", { className: "wbct-wrap" },
    h("div", { className: "wbct-head" }, h("h2", null, "联系人"), h("div", { className: "wbct-row" },
      h(C.Btn, { h: h, kind: "primary", onClick: function () { form[1](empty()); msg[1](""); } }, "新建联系人"),
      h(C.Btn, { h: h, onClick: list.refresh }, "刷新"))),
    h(C.Notice, { h: h, text: msg[0] }),
    h(C.Field, { h: h, label: "搜索" }, h("input", { className: "wbct-input", value: q[0], placeholder: "姓名 / 组织 / 邮箱 / 电话", onChange: function (e) { q[1](e.target.value); } })),
    list.error ? h(C.Notice, { h: h, kind: "error", text: list.error }) : null,
    rows.length === 0 && !list.loading ? h(C.Empty, { h: h, text: "还没有联系人；新建一个或从 vCard 导入。" }) : null,
    h("div", { className: "wbct-table-wrap" }, h("table", { className: "wbct-table" },
      h("thead", null, h("tr", null, ["姓名", "组织 / 职位", "联系方式", "分组", "更新时间", "操作"].map(function (x) { return h("th", { key: x }, x); }))),
      h("tbody", null, rows.map(function (c) {
        return h("tr", { key: c.id },
          h("td", null, h("b", null, c.name)),
          h("td", null, [c.org, c.title].filter(Boolean).join(" / ") || "—"),
          h("td", null, h("div", { className: "wbct-muted" }, (c.fields || []).map(function (x) { return x.kind + ": " + x.value; }).join("；") || "—")),
          h("td", null, (c.groups || []).map(function (g) { return h(C.Pill, { h: h, key: g.id }, g.name); })),
          h("td", null, C.fmtTime(c.updatedAt, props.lang)),
          h("td", null, h("div", { className: "wbct-row" },
            h(C.Btn, { h: h, onClick: function () { form[1](fromContact(c)); } }, "编辑"),
            h(C.Btn, { h: h, kind: "danger", onClick: function () { remove(c); } }, "删除"))));
      })))),
    f ? h("div", { className: "wbct-panel" },
      h("h3", null, f.id ? "编辑联系人" : "新建联系人"),
      h("div", { className: "wbct-grid" },
        h(C.Field, { h: h, label: "姓名" }, h("input", { className: "wbct-input", value: f.name, onChange: function (e) { set("name", e.target.value); } })),
        h(C.Field, { h: h, label: "组织" }, h("input", { className: "wbct-input", value: f.org, onChange: function (e) { set("org", e.target.value); } })),
        h(C.Field, { h: h, label: "职位" }, h("input", { className: "wbct-input", value: f.title, onChange: function (e) { set("title", e.target.value); } })),
        h(C.Field, { h: h, label: "生日 YYYY-MM-DD" }, h("input", { className: "wbct-input", value: f.birthday, onChange: function (e) { set("birthday", e.target.value); } }))),
      h(C.Field, { h: h, label: "联系方式（每行 kind:value，kind=email/phone/im/url）" }, h("textarea", { className: "wbct-input wbct-code", rows: 4, value: f.fieldsText, onChange: function (e) { set("fieldsText", e.target.value); } })),
      h(C.Field, { h: h, label: "备注" }, h("textarea", { className: "wbct-input", rows: 3, value: f.note, onChange: function (e) { set("note", e.target.value); } })),
      h(C.Field, { h: h, label: "分组" }, h("div", { className: "wbct-pills" }, gs.map(function (g) { return h("label", { key: g.id, className: "wbct-check" }, h("input", { type: "checkbox", checked: (f.groups || []).indexOf(g.id) >= 0, onChange: function () { toggleGroup(g.id); } }), g.name); }))),
      h("div", { className: "wbct-row" }, h(C.Btn, { h: h, kind: "primary", onClick: save }, "保存"), h(C.Btn, { h: h, onClick: function () { form[1](null); } }, "取消"))) : null);
};
