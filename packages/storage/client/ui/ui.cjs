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
function Button(props) {
  var attrs = Object.assign({ type: "button", className: "wbi-btn" }, props);
  delete attrs.icon; delete attrs.iconOnly;
  if (props.icon) {
    attrs["aria-label"] = props["aria-label"] || props.children;
    attrs.title = props.title || attrs["aria-label"];
    attrs.className += props.iconOnly ? " wbi-icon-only" : " wbi-icon-text";
  }
  return h("button", attrs, props.icon ? h(Icon, { name: props.icon }) : null,
    props.iconOnly ? null : props.icon ? h("span", { className: "wbi-btn-label" }, props.children) : props.children);
}
function Skeleton(props) {
  var label = props.label || tr(props.lang, "读取中…", "Loading…");
  return h("div", { className: "wbi-root wbi-grid wbi-skeleton", role: "status", "aria-label": label, "aria-busy": true },
    h("span", { className: "wbi-sr" }, label),
    [0,1,2].map(function (i) { return h("div", { key: i, className: "wbi-card wbi-skeleton-card", "aria-hidden": true },
      h("div", { className: "wbi-sk" }), h("div", { className: "wbi-sk" }), h("div", { className: "wbi-sk" })); }));
}
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
function Modal(props) {
  var ref = React.useRef(null);
  React.useEffect(function () {
    var previous = document.activeElement;
    if (ref.current) ref.current.focus();
    return function () {
      if (previous && previous.isConnected) previous.focus();
    };
  }, []);
  function key(e) {
    if (e.key === "Escape") {
      // Consume before closing: React may flush and replace document listeners immediately.
      e.preventDefault();
      e.stopPropagation();
      if (props.onClose) props.onClose();
      return;
    }
    if (e.key !== "Tab") return;
    var els = ref.current.querySelectorAll(
      "button:not(:disabled),input:not(:disabled),textarea:not(:disabled),select:not(:disabled),a[href]",
    );
    if (!els.length) {
      e.preventDefault();
      return;
    }
    var first = els[0],
      last = els[els.length - 1];
    if (e.shiftKey && (document.activeElement === first || document.activeElement === ref.current)) {
      e.preventDefault();
      last.focus();
    }
    if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
  return h(
    "div",
    {
      className: "wbi-mask",
      onMouseDown: function (e) {
        if (e.target === e.currentTarget && props.onClose) props.onClose();
      },
    },
    h(
      "section",
      {
        className: "wbi-modal",
        role: "dialog",
        "aria-modal": true,
        "aria-label": props.title,
        ref: ref,
        tabIndex: -1,
        onKeyDown: key,
      },
      h(
        "header",
        { className: "wbi-row" },
        h("h2", null, props.title),
        h("span", { className: "wbi-grow" }),
        h(Button, { icon: "close", iconOnly: true, onClick: props.onClose, disabled: !props.onClose, "aria-label": "关闭 / Close" }, "×"),
      ),
      props.children,
    ),
  );
}
module.exports = { Icon: Icon, Skeleton: Skeleton, h: h, call: call, tr: tr, Button: Button, ErrorBox: ErrorBox, Modal: Modal, safeImage: safeImage };
