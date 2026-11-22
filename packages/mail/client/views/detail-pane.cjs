"use strict";
const C = require("../ui/common.cjs");
const styles = require("../ui/reader-styles.cjs");

module.exports = function detailPane(h, options, tools, content) {
  const { current, back, toggle, previous, next, expanded, accountLabel, time } = options;
  const subject = current.subject || "(无主题)";
  const sender = current.fromName || current.from || "未知发件人";
  const action = (label, onClick) => h(C.Btn, { h, onClick, disabled: !onClick }, label);
  return h("section", { className: "wbml-pane wbml-detailpane" + (expanded ? " is-expanded" : ""), "aria-label": "邮件详情" },
    h("style", null, styles),
    h("nav", { className: "wbml-read-bar", "aria-label": "阅读导航" },
      action("返回列表", back),
      h("button", { className: "wbml-btn wbml-expand", type: "button", onClick: toggle, "aria-pressed": expanded }, expanded ? "收起阅读" : "展开阅读"),
      h("div", { className: "wbml-reader-nav" }, action("上一封", previous), action("下一封", next))),
    h("div", { className: "wbml-read-scroll", key: current.id },
      h("header", { className: "wbml-read-header" },
        h("h3", null, subject),
        h("div", { className: "wbml-read-sender" }, h("strong", null, sender),
          current.from && current.from !== sender ? h("span", null, "<" + current.from + ">") : null),
        h("div", null, "收件账户：" + accountLabel),
        h("div", { className: "wbml-read-stamp" }, time, current.mailbox ? " · " + current.mailbox : ""),
        current.to && !current.cc && current.to.length <= 64 && !/[,;\n]/.test(current.to.replace(/"(?:\\.|[^"\\])*"/g, ''))
          ? h("div", null, "收件人：" + current.to)
          : current.to || current.cc ? h("details", null,
          h("summary", null, current.cc ? "收件人和抄送" : "收件人"),
          current.to ? h("div", null, "收件人：" + current.to) : null,
          current.cc ? h("div", null, "抄送：" + current.cc) : null) : null),
      tools, content));
};
