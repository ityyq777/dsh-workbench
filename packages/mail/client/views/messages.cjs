"use strict";
module.exports = function Messages(props) {
  var h = props.h, React = props.React, api = props.api;
  var C = require("../ui/common.cjs");
  var accounts = C.useLoad(React, api, "mail.accountList", {}, []);
  var accountId = React.useState("");
  var list = C.useLoad(React, api, "mail.messageList", { accountId: accountId[0] || undefined, limit: 50 }, [accountId[0]]);
  var sel = React.useState(null);
  var msg = React.useState(null);
  var accs = (accounts.data && accounts.data.items) || [];
  function open(id) { C.call(api, "mail.messageGet", { id: id }).then(function (d) { sel[1](d); }).catch(function (e) { msg[1]({ kind: "error", text: C.errText(e) }); }); }
  function sync() {
    if (!accountId[0]) { msg[1]({ kind: "error", text: "先在左侧选择一个账户" }); return; }
    C.call(api, "mail.sync", { id: accountId[0], limit: 20 }).then(function (r) { msg[1]({ kind: "ok", text: "抓取 " + r.fetched + " 封，新增 " + r.inserted }); list.refresh(); }).catch(function (e) { msg[1]({ kind: "error", text: C.errText(e) }); });
  }
  var items = (list.data && list.data.items) || [];
  var unread = items.filter(function (m) { return !m.seen; }).length;
  var current = sel[0];
  return h("div", { className: "wbm-page" },
    h("div", { className: "wbm-head" }, h("div", null, h("h2", null, "邮件"), h("p", { className: "wbm-sub" }, "本地副本；IMAP 只抓信头，密码保存在保险箱。")), h("div", { className: "wbm-row" },
      h(C.Btn, { h: h, onClick: list.refresh }, "刷新"))),
    h(C.Notice, { h: h, text: msg[0] && msg[0].text, kind: msg[0] && msg[0].kind }),
    accounts.error ? h(C.Notice, { h: h, kind: "error", text: accounts.error }) : null,
    h("div", { className: "wbm-layout" + (current ? " has-detail" : "") },
      h("aside", { className: "wbm-rail" },
        h("div", { className: "wbm-card wbm-rail-card" },
          h("div", { className: "wbm-rail-title" }, "收件账户"),
          h("select", { className: "wbm-input", value: accountId[0], onChange: function (e) { accountId[1](e.target.value); sel[1](null); } }, h("option", { value: "" }, "全部账户"), accs.map(function (a) { return h("option", { key: a.id, value: a.id }, a.name); })),
          h("div", { className: "wbm-rail-stats" }, h("span", null, h("b", null, items.length), " 封本地"), h("span", null, h("b", null, unread), " 封未读")),
          h(C.Btn, { h: h, kind: "primary", onClick: sync }, "同步收件箱"),
          h("p", { className: "wbm-hint" }, "只抓最近 20 封信头；正文按需下载。")),
        h("div", { className: "wbm-rail-tip" }, "提示：点开一封邮件会在右侧阅读，列表不会消失。")),
      h("section", { className: "wbm-pane wbm-listpane" },
        h("div", { className: "wbm-pane-head" }, h("strong", null, "邮件列表"), h("span", { className: "wbm-muted" }, items.length + " 封")),
        list.loading ? h(C.Empty, { h: h, text: "加载中…" }) : list.error ? h(C.Notice, { h: h, kind: "error", text: list.error }) : items.length === 0 ? h(C.Empty, { h: h, text: "没有本地邮件；先在账户页同步。" }) :
          h("div", { className: "wbm-list" }, items.map(function (m) {
            return h("button", { key: m.id, type: "button", className: "wbm-list-row" + (current && current.id === m.id ? " on" : "") + (m.seen ? "" : " unread"), onClick: function () { open(m.id); } },
              h("span", { className: "wbm-dot" }),
              h("div", { className: "wbm-main" },
                h("strong", { className: "wbm-subject" }, m.subject || "(无主题)"),
                h("span", { className: "wbm-muted" }, (m.from || "未知发件人") + " · " + (m.mailbox || "INBOX")),
                m.preview ? h("span", { className: "wbm-snippet" }, m.preview) : null),
              h("span", { className: "wbm-time" }, C.fmtTime(m.dateAt, props.lang)));
          }))),
      current ? h("section", { className: "wbm-pane wbm-detailpane" },
        h("div", { className: "wbm-detail-head" },
          h("div", { className: "wbm-detail-title" }, h("strong", null, current.subject || "(无主题)"), h("span", { className: "wbm-muted" }, (current.from || "") + " · " + C.fmtTime(current.dateAt, props.lang))),
          h(C.Btn, { h: h, onClick: function () { sel[1](null); } }, "关闭")),
        h("div", { className: "wbm-detail-meta" }, h("span", null, "收件人：", (current.to || "—")), h("span", null, "邮箱：", current.mailbox || "INBOX")),
        h("pre", { className: "wbm-body" }, current.body || current.preview || "(正文未下载)")) : null)
  );
};
