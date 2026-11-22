"use strict";
/**
 * 邮箱账户页：服务商预设 + 保险箱凭据选择 + 保存前自检 + 卡片式编辑。
 * 设计见 docs/specs/51-邮箱账户接入流程设计.md。
 */
var AccountForm = require("../ui/account-form.cjs");
var AccountCard = require("../ui/account-card.cjs");
var SecretField = require("../../../lib/secret-field.cjs");

var providerCache = null;

module.exports = function Accounts(props) {
  var h = props.h;
  var React = props.React;
  var api = props.api;
  var lang = props.lang || "zh";
  var C = require("../ui/common.cjs");
  var load = C.useLoad(React, api, "mail.accountList", {}, []);
  var tableS = React.useState(providerCache);
  var openS = React.useState(null); // null 关闭；{} 新建；account 编辑
  var testS = React.useState({});
  var busyS = React.useState("");
  var msgS = React.useState(null);
  var setNameS = React.useState({});

  // 账户只存集合 id，卡片上的集合名要现查一次；读不到就退化成「未绑定/已失效」，不挡页面。
  React.useEffect(function () {
    C.call(api, "vault.setList", { type: "account", q: "" })
      .then(function (r) {
        var map = {};
        ((r && r.items) || []).forEach(function (x) { map[x.id] = x.name; });
        setNameS[1](map);
      })
      .catch(function () { setNameS[1]({}); });
  }, []);

  React.useEffect(function () {
    if (tableS[0]) return;
    C.call(api, "mail.providerList", {})
      .then(function (r) {
        providerCache = r;
        tableS[1](r);
      })
      .catch(function (e) {
        msgS[1]({ kind: "warn", text: C.errText(e) });
      });
  }, []);

  function refresh() {
    load.refresh();
  }
  function close() {
    openS[1](null);
  }
  function test(a) {
    busyS[1](a.id);
    C.call(api, "mail.accountTest", { id: a.id })
      .then(function (r) {
        busyS[1]("");
        testS[1](Object.assign({}, testS[0], { [a.id]: r }));
      })
      .catch(function (e) {
        busyS[1]("");
        msgS[1]({ kind: "warn", text: C.errText(e) });
      });
  }
  function remove(a) {
    var text = lang === "en" ? "Delete account “" + (a.name || a.email) + "”? The vault credential is kept." : "删除账户「" + (a.name || a.email) + "」？保险箱里的凭据会保留。";
    if (typeof window !== "undefined" && window.confirm && !window.confirm(text)) return;
    C.call(api, "mail.accountDelete", { id: a.id })
      .then(function () {
        refresh();
      })
      .catch(function (e) {
        msgS[1]({ kind: "warn", text: C.errText(e) });
      });
  }

  var items = (load.data && load.data.items) || [];
  var editing = openS[0];
  var providers = tableS[0] || { providers: [] };
  var loading = load.loading || !tableS[0];

  return h(
    "div",
    { className: "wbml-page" },
    h(
      "div",
      { className: "wbml-head" },
      h("div", null, h("h2", null, lang === "en" ? "Mail accounts" : "邮箱账户"), h("p", { className: "wbml-sub" }, lang === "en" ? "Pick a provider, then choose an app-password credential from the vault; this page only stores its id." : "先选保险箱里的账号集合，账号自动带出，再从集合里挑一条授权码；邮件页只保存凭据 id。")),
      h(C.Btn, { h: h, kind: "primary", onClick: function () { openS[1]({}); } }, lang === "en" ? "Add account" : "添加账户"),
    ),
    msgS[0] ? h(C.Notice, { h: h, text: msgS[0].text, kind: msgS[0].kind }) : null,
    editing
      ? h(AccountForm, {
          h: h,
          React: React,
          api: api,
          C: C,
          lang: lang,
          SecretField: SecretField,
          providers: providers,
          account: editing.id ? editing : null,
          onCancel: close,
          onSaved: function () {
            close();
            refresh();
          },
        })
      : null,
    loading
      ? h(C.Empty, { h: h, text: lang === "en" ? "Loading…" : "加载中…" })
      : items.length === 0
        ? h(C.Empty, { h: h, text: lang === "en" ? "No accounts yet" : "还没有账户，点右上角添加。" })
        : h(
            "div",
            { className: "wbml-cards" },
            items.map(function (a) {
              return h(AccountCard, {
                key: a.id,
                h: h,
                C: C,
                lang: lang,
                account: a,
                accountSetName: setNameS[0][a.accountSetId] || "",
                test: testS[0][a.id] || null,
                busy: busyS[0] === a.id,
                onEdit: function () { openS[1](a); },
                onTest: function () { test(a); },
                onDelete: function () { remove(a); },
              });
            }),
          ),
  );
};
