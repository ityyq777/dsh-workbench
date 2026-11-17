"use strict";
module.exports = function Compose(props) {
  var h = props.h, React = props.React, api = props.api;
  var C = require("../ui/common.cjs");
  var accounts = C.useLoad(React, api, "mail.accountList", {}, []);
  var st = React.useState({ accountId: "", to: "", subject: "", text: "" });
  var msg = React.useState(null); var busy = React.useState(false);
  var accs = (accounts.data && accounts.data.items) || [];
  function set(k, v) { st[1](Object.assign({}, st[0], { [k]: v })); }
  function send() {
    var to = st[0].to.split(/[,，;；\n]/).map(function (s) { return s.trim(); }).filter(Boolean);
    if (!st[0].accountId || !to.length) { msg[1]({ kind: "error", text: "请选择账户并填写收件人" }); return; }
    busy[1](true);
    C.call(api, "mail.messageSend", { accountId: st[0].accountId, to: to, subject: st[0].subject, text: st[0].text }).then(function () { msg[1]({ kind: "ok", text: "已发送" }); st[1](Object.assign({}, st[0], { to: "", subject: "", text: "" })); }).catch(function (e) { msg[1]({ kind: "error", text: C.errText(e) }); }).finally(function () { busy[1](false); });
  }
  return h("div", { className: "wbm-page" }, h("h2", null, "写信"), h(C.Notice, { h: h, text: msg[0] && msg[0].text, kind: msg[0] && msg[0].kind }),
    h("div", { className: "wbm-card" },
      h(C.Field, { h: h, label: "发件账户" }, h("select", { className: "wbm-input", value: st[0].accountId, onChange: function (e) { set("accountId", e.target.value); } }, h("option", { value: "" }, "请选择"), accs.map(function (a) { return h("option", { key: a.id, value: a.id }, a.name + " <" + a.email + ">"); }))),
      h(C.Field, { h: h, label: "收件人", hint: "多个邮箱用逗号分隔" }, h("input", { className: "wbm-input", value: st[0].to, onChange: function (e) { set("to", e.target.value); } })),
      h(C.Field, { h: h, label: "主题" }, h("input", { className: "wbm-input", value: st[0].subject, onChange: function (e) { set("subject", e.target.value); } })),
      h(C.Field, { h: h, label: "正文" }, h("textarea", { className: "wbm-input", rows: 10, value: st[0].text, onChange: function (e) { set("text", e.target.value); } })),
      h("div", { className: "wbm-actions" }, h(C.Btn, { h: h, kind: "primary", disabled: busy[0], onClick: send }, busy[0] ? "发送中…" : "发送"))));
};
