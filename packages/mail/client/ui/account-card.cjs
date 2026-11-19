"use strict";
/** 账户卡片：一行摘要 + 编辑/测试/删除，自检结果只活在这张卡片上。 */
var probe = require("../../lib/domain/probe-error.js");

function t(lang, zh, en) {
  return lang === "en" ? en : zh;
}

function resultText(res, lang) {
  if (!res) return "";
  if (res.ok) return t(lang, "连接正常，已列出文件夹", "Connected; folders listed");
  var cls = res.errorClass || "unknown";
  var text = probe.ERROR_TEXT[cls] || probe.ERROR_TEXT.unknown;
  return (lang === "en" ? text.en : text.zh) + (res.message ? "（" + res.message + "）" : "");
}

module.exports = function AccountCard(props) {
  var h = props.h;
  var C = props.C;
  var lang = props.lang;
  var a = props.account || {};
  var res = props.test || null;
  var busy = !!props.busy;
  var last = a.lastMessageAt ? C.fmtTime(a.lastMessageAt, lang) : t(lang, "还没有本地来信", "No local mail yet");
  return h(
    "div",
    { className: "wbml-card" },
    h(
      "div",
      { className: "wbml-card-main" },
      h("div", { className: "wbml-card-title" }, a.name || a.email),
      h("div", { className: "wbml-card-sub" }, a.email, a.username && a.username !== a.email ? " · " + a.username : ""),
      h("div", { className: "wbml-card-meta" }, (a.imapHost || "—") + ":" + a.imapPort + " · " + (a.smtpHost || "—") + ":" + a.smtpPort),
      h("div", { className: "wbml-card-meta" }, t(lang, "最近来信：", "Last mail: ") + last),
    ),
    h(
      "div",
      { className: "wbml-card-actions" },
      h(C.Btn, { h: h, onClick: props.onEdit, disabled: busy }, t(lang, "编辑", "Edit")),
      h(C.Btn, { h: h, onClick: props.onTest, disabled: busy }, busy ? t(lang, "测试中…", "Testing…") : t(lang, "测试", "Test")),
      h(C.Btn, { h: h, kind: "danger", onClick: props.onDelete, disabled: busy }, t(lang, "删除", "Delete")),
    ),
    res
      ? h(
          "div",
          { className: "wbml-card-result " + (res.ok ? "ok" : "fail"), role: "status" },
          h(C.Pill, { h: h, kind: res.ok ? "ok" : "error" }, res.ok ? t(lang, "通过", "OK") : t(lang, "失败", "Failed")),
          h("span", null, resultText(res, lang)),
        )
      : null,
  );
};
