"use strict";
module.exports = function Accounts(props) {
  var h = props.h, React = props.React, api = props.api;
  var C = require("../ui/common.cjs");
  var load = C.useLoad(React, api, "mail.accountList", {}, []);
  var form = React.useState({ open: false, name: "", email: "", imapHost: "", imapPort: 993, smtpHost: "", smtpPort: 465, username: "", secretId: "" });
  var msg = React.useState(null);
  function set(k, v) { form[1](Object.assign({}, form[0], { [k]: v })); }
  function add() { C.call(api, "mail.accountCreate", form[0]).then(function () { form[1]({ open: false, name: "", email: "", imapHost: "", imapPort: 993, smtpHost: "", smtpPort: 465, username: "", secretId: "" }); load.refresh(); }).catch(function (e) { msg[1]({ kind: "error", text: C.errText(e) }); }); }
  function test(id) { C.call(api, "mail.accountTest", { id: id }).then(function (r) { msg[1]({ kind: "ok", text: "连接成功，发现 " + r.mailboxes + " 个文件夹" }); }).catch(function (e) { msg[1]({ kind: "error", text: C.errText(e) }); }); }
  function del(id) { C.call(api, "mail.accountDelete", { id: id }).then(function () { load.refresh(); }).catch(function (e) { msg[1]({ kind: "error", text: C.errText(e) }); }); }
  var items = (load.data && load.data.items) || [];
  return h("div", { className: "wbm-page" }, h("div", { className: "wbm-head" }, h("div", null, h("h2", null, "邮箱账户"), h("p", { className: "wbm-sub" }, "密码只存保险箱，账户保存 secretId")), h(C.Btn, { h: h, kind: "primary", onClick: function () { set("open", !form[0].open); } }, "添加账户")),
    h(C.Notice, { h: h, text: msg[0] && msg[0].text, kind: msg[0] && msg[0].kind }),
    form[0].open ? h("div", { className: "wbm-card" }, h("div", { className: "wbm-row" },
      h(C.Field, { h: h, label: "名称" }, h("input", { className: "wbm-input", value: form[0].name, onChange: function (e) { set("name", e.target.value); } })),
      h(C.Field, { h: h, label: "邮箱" }, h("input", { className: "wbm-input", value: form[0].email, onChange: function (e) { set("email", e.target.value); } })),
      h(C.Field, { h: h, label: "IMAP 主机" }, h("input", { className: "wbm-input", value: form[0].imapHost, onChange: function (e) { set("imapHost", e.target.value); } })),
      h(C.Field, { h: h, label: "SMTP 主机" }, h("input", { className: "wbm-input", value: form[0].smtpHost, onChange: function (e) { set("smtpHost", e.target.value); } })),
      h(C.Field, { h: h, label: "保险箱 secret id" }, h("input", { className: "wbm-input", value: form[0].secretId, onChange: function (e) { set("secretId", e.target.value); } }))),
      h("div", { className: "wbm-actions" }, h(C.Btn, { h: h, kind: "primary", onClick: add }, "保存"))) : null,
    load.loading ? h(C.Empty, { h: h, text: "加载中…" }) : items.length === 0 ? h(C.Empty, { h: h, text: "还没有账户" }) :
      h("div", { className: "wbm-list" }, items.map(function (a) { return h("div", { key: a.id, className: "wbm-list-row" }, h("div", { className: "wbm-main" }, h("strong", null, a.name), h("span", { className: "wbm-muted" }, a.email + " · IMAP " + a.imapHost)), h(C.Btn, { h: h, onClick: function () { test(a.id); } }, "测试"), h("button", { type: "button", className: "wbm-icon-btn", onClick: function () { del(a.id); } }, "×")); }))
  );
};
