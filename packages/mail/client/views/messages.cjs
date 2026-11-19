"use strict";
module.exports = function Messages(props) {
  var h = props.h, React = props.React, api = props.api;
  var C = require("../ui/common.cjs");
  var accounts = C.useLoad(React, api, "mail.accountList", {}, []);
  var accountId = React.useState("");
  var list = C.useLoad(React, api, "mail.messageList", { accountId: accountId[0] || undefined, limit: 50 }, [accountId[0]]);
  var sel = React.useState(null);
  var msg = React.useState(null);
  // 正文是打开邮件时才下载的：loading/error/data 三态单独放，避免整页重载列表。
  var bodyState = React.useState({ loading: false, error: "", data: null });
  var accs = (accounts.data && accounts.data.items) || [];
  function loadBody(m, force) {
    if (!m) return;
    bodyState[1]({ loading: true, error: "", data: null });
    C.call(api, "mail.messageBody", { id: m.id, force: !!force }).then(function (r) {
      if (r && r.ok === false) bodyState[1]({ loading: false, error: r.message || "正文下载失败", data: r });
      else bodyState[1]({ loading: false, error: "", data: r || null });
    }).catch(function (e) { bodyState[1]({ loading: false, error: C.errText(e), data: null }); });
  }
  function open(m) {
    bodyState[1]({ loading: false, error: "", data: null });
    C.call(api, "mail.messageGet", { id: m.id }).then(function (d) { sel[1](d); loadBody(d); }).catch(function (e) { msg[1]({ kind: "error", text: C.errText(e) }); });
    // 点开即标记已读：未读态来自 IMAP 的 \Seen 标记（服务端按 flags 判定），读完要能自己消掉。
    if (isUnread(m)) C.call(api, "mail.messageMarkRead", { id: m.id }).then(function () { list.refresh(); }).catch(function () {});
  }
  function sync() {
    if (!accountId[0]) return;
    C.call(api, "mail.sync", { id: accountId[0], limit: 20 }).then(function (r) { msg[1]({ kind: "ok", text: "抓取 " + r.fetched + " 封，新增 " + r.inserted }); list.refresh(); }).catch(function (e) { msg[1]({ kind: "error", text: C.errText(e) }); });
  }
  function isUnread(m) { return !/\\Seen/.test(String((m && m.flags) || "")); }
  function senderLabel(m) {
    var name = m && m.fromName ? String(m.fromName).trim() : "";
    var addr = m && m.from ? String(m.from).trim() : "";
    if (name && name !== addr) return name;
    return addr || "未知发件人";
  }
  function senderDetail(m) {
    var name = m && m.fromName ? String(m.fromName).trim() : "";
    var addr = m && m.from ? String(m.from).trim() : "";
    if (name && addr && name !== addr) return name + " <" + addr + ">";
    return addr || name || "未知发件人";
  }
  function accountName(id) {
    if (!id) return "全部账户";
    var hit = accs.filter(function (a) { return a.id === id; })[0];
    return hit ? hit.name : "全部账户";
  }
  function sizeText(n) {
    var v = Number(n) || 0;
    if (v >= 1024 * 1024) return (v / (1024 * 1024)).toFixed(1) + " MB";
    if (v >= 1024) return Math.round(v / 1024) + " KB";
    return v + " B";
  }
  function attachmentsOf(current, data) {
    var rows = (data && data.attachments) || (current && current.attachments) || [];
    if (!rows.length) return null;
    return h("div", { className: "wbml-attach" },
      h("span", { className: "wbml-attach-title" }, "收件箱里的 " + rows.length + " 个附件（只列文件名与大小，不下载内容）"),
      h("div", { className: "wbml-attach-list" }, rows.map(function (a, i) {
        return h("span", { key: a.id || (a.filename + i), className: "wbml-attach-item", title: a.mime || "" }, String(a.filename || "未命名附件") + (a.size ? " · " + sizeText(a.size) : ""));
      })));
  }
  function bodyNode(current) {
    var st = bodyState[0];
    if (st.loading) return h("div", { className: "wbml-state" }, "正文下载中…");
    if (st.error) {
      return h("div", { className: "wbml-body-fail" },
        h("p", { className: "wbml-body-fail-text" }, "正文下载失败：" + st.error),
        h("div", { className: "wbml-body-tools" },
          h(C.Btn, { h: h, kind: "primary", onClick: function () { loadBody(current, true); } }, "重试")));
    }
    var data = st.data || {};
    var text = String(data.body || current.body || "").trim();
    var attach = attachmentsOf(current, data);
    if (!text) {
      return h("div", { className: "wbml-body-wrap" },
        h("div", { className: "wbml-state" }, "这封邮件没有可读的正文；可以点「重新下载正文」再试一次。"),
        attach);
    }
    return h("div", { className: "wbml-body-wrap" },
      h("pre", { className: "wbml-body" }, text),
      data.truncated ? h("p", { className: "wbml-body-note" }, "正文较长，已截断显示。") : null,
      attach,
      h("div", { className: "wbml-body-tools" },
        h(C.Btn, { h: h, onClick: function () { loadBody(current, true); } }, "重新下载正文")));
  }
  var items = (list.data && list.data.items) || [];
  var unread = items.filter(isUnread).length;
  var current = sel[0];
  var canSync = !!accountId[0];
  var body = list.loading
    ? h("div", { className: "wbml-state" }, "加载中…")
    : list.error
      ? h("div", { className: "wbml-state wbml-state-error" }, list.error)
      : items.length === 0
        ? h("div", { className: "wbml-state" }, accs.length ? "没有本地邮件；在左侧点「同步收件箱」抓最近 20 封。" : "还没有账户，先到「账户」页添加一个。")
        : h("div", { className: "wbml-list" }, items.map(function (m) {
          var on = current && current.id === m.id;
          return h("button", {
            key: m.id, type: "button", title: senderDetail(m) + " · " + (m.subject || "(无主题)"),
            className: "wbml-list-row" + (on ? " on" : "") + (isUnread(m) ? " unread" : ""),
            onClick: function () { open(m); },
          },
            h("span", { className: "wbml-who" }, senderLabel(m)),
            h("span", { className: "wbml-time" }, C.fmtTime(m.dateAt, props.lang)),
            h("div", { className: "wbml-line" },
              h("span", { className: "wbml-subject" }, m.subject || "(无主题)"),
              m.preview ? h("span", { className: "wbml-snippet" }, m.preview) : null));
        }));
  return h("div", { className: "wbml-page is-split wb-fill" },
    h("div", { className: "wbml-head" }, h("div", null, h("h2", null, "邮件"), h("p", { className: "wbml-sub" }, "本地副本；信头随同步拉取，正文点开时下载，密码保存在保险箱。")), h("div", { className: "wbml-row" },
      h(C.Btn, { h: h, onClick: list.refresh }, "刷新"))),
    h(C.Notice, { h: h, text: msg[0] && msg[0].text, kind: msg[0] && msg[0].kind }),
    accounts.error ? h(C.Notice, { h: h, kind: "error", text: accounts.error }) : null,
    h("div", { className: "wbml-layout" + (current ? " has-detail" : "") },
      h("aside", { className: "wbml-rail" },
        h("div", { className: "wbml-card wbml-rail-card" },
          h("div", { className: "wbml-rail-title" }, "收件账户"),
          h("select", { className: "wbml-input", value: accountId[0], onChange: function (e) { accountId[1](e.target.value); sel[1](null); } }, h("option", { value: "" }, "全部账户"), accs.map(function (a) { return h("option", { key: a.id, value: a.id }, a.name); })),
          h("div", { className: "wbml-rail-stats" }, h("span", null, h("b", null, items.length), "封本地"), h("span", null, h("b", null, unread), "封未读")),
          h(C.Btn, { h: h, kind: "primary", disabled: !canSync, onClick: sync }, "同步收件箱"),
          h("p", { className: "wbml-hint" }, canSync ? "只抓最近 20 封信头；正文点开时按需下载。" : "选择具体账户后可同步；「全部账户」只看本地副本。")),
        h("div", { className: "wbml-rail-tip" }, "提示：点一封邮件会在右侧阅读，列表不会消失。")),
      h("section", { className: "wbml-pane wbml-listpane" },
        h("div", { className: "wbml-pane-head" }, h("strong", null, accountName(accountId[0])), h("span", { className: "wbml-muted" }, items.length + " 封 · " + unread + " 未读")),
        h("div", { className: "wbml-state-box" }, body)),
      current ? h("section", { className: "wbml-pane wbml-detailpane" },
        h("div", { className: "wbml-detail-head" },
          h("div", { className: "wbml-detail-title" }, h("strong", null, current.subject || "(无主题)"), h("span", { className: "wbml-muted" }, senderDetail(current) + " · " + C.fmtTime(current.dateAt, props.lang))),
          h(C.Btn, { h: h, onClick: function () { sel[1](null); } }, "关闭")),
        h("div", { className: "wbml-detail-meta" }, h("span", null, "收件人：" + (current.to || "—")), h("span", null, "文件夹：" + (current.mailbox || "INBOX"))),
        h("div", { className: "wbml-detail-body" }, bodyNode(current))) : null)
  );
};
