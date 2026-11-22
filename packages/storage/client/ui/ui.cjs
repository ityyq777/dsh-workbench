var React = require("react");
var h = React.createElement, Icon = require("./icons.cjs").Icon;
function call(api, name, args) {
  return api.call(name, args || {}).then(function (r) {
    if (!r || r.ok !== true) throw new Error((r && r.error) || "请求失败");
    return r.result;
  });
}
function tr(lang, zh, en) {
  return lang === "en" ? en : zh;
}
var createButton = require("../../../lib/button.cjs");
var createSkeleton = require("../../../lib/skeleton.cjs");
var createOverlay = require("../../../lib/overlay.cjs");

var Button = createButton({ prefix: "wbi", Icon: Icon });

var Skeleton = createSkeleton({
  prefix: "wbi",
  text: function (lang) {
    return tr(lang, "读取中…", "Loading…");
  },
});

function ErrorBox(props) {
  return props.error
    ? h("div", { className: "wbi-error", role: "alert" }, String(props.error.message || props.error))
    : null;
}
function safeImage(url) {
  try {
    var u = new URL(url);
    return /^(https?:)$/.test(u.protocol) && !u.username && !u.password ? u.href : "";
  } catch (_) {
    return "";
  }
}
// 对话框外壳（遮罩、Esc、焦点循环与归位）来自 lib/overlay.cjs，标题栏沿用储物自己的样式。
var Modal = createOverlay({
  tag: "section",
  maskClass: "wbi-mask",
  dialogClass: "wbi-modal",
  ariaLabelOf: function (props) {
    return props.title;
  },
  header: function (props) {
    return h(
      "header",
      { className: "wbi-row" },
      h("h2", null, props.title),
      h("span", { className: "wbi-grow" }),
      h(Button, { icon: "close", iconOnly: true, onClick: props.onClose, disabled: !props.onClose, "aria-label": "关闭 / Close" }, "×"),
    );
  },
});
module.exports = { Icon: Icon, Skeleton: Skeleton, h: h, call: call, tr: tr, Button: Button, ErrorBox: ErrorBox, Modal: Modal, safeImage: safeImage };
