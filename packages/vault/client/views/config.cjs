"use strict";
/** 保险箱设置：解锁模式、改主口令、device key 轮换。 */
var C = require("../ui/common.cjs");
var AskPassphrase = require("../ui/ask-passphrase.cjs");

var MODES = [
  { id: "A", title: "A 全锁（推荐）", desc: "每次 DSH 启动后需要输入主口令；明文只在当前进程内存。" },
  { id: "B", title: "B 自动解锁，查看需口令", desc: "启动时用本机 device key 自动解锁；每次查看/编辑凭据再输主口令。" },
  { id: "C", title: "C 自动解锁，查看免口令", desc: "启动自动解锁，界面上可直接查看明文；适合单人受控机器。" },
];

module.exports = function ConfigView(props) {
  var h = props.h;
  var api = props.api;
  var React = props.React;
  var st = React.useState(null);
  var mode = React.useState("A");
  var oldPass = React.useState("");
  var newPass = React.useState("");
  var msg = React.useState("");
  var busy = React.useState(false);
  var tick = React.useState(0);
  var askS = React.useState(null); // { kind: "mode" | "rotate", value, busy, error }

  React.useEffect(function () {
    C.call(api, "vault.status").then(function (s) {
      st[1](s);
      if (s && s.unlockMode) mode[1](s.unlockMode);
    }).catch(function (e) { msg[1](C.errText(e)); });
  }, [tick[0]]);

  function run(p) {
    busy[1](true); msg[1]("");
    p.then(function () { busy[1](false); tick[1](tick[0] + 1); })
      .catch(function (e) { busy[1](false); msg[1](C.errText(e)); });
  }

  function applyMode() {
    var target = mode[0];
    if (target === "B" || target === "C") {
      if (!st[0] || st[0].locked) { askS[1]({ kind: "mode", value: "", busy: false, error: "" }); return; }
    }
    run(C.call(api, "vault.setUnlockMode", { mode: target }));
  }

  function confirmAsk() {
    var a = askS[0];
    if (!a || !a.value) return;
    askS[1](Object.assign({}, a, { busy: true, error: "" }));
    var p = a.kind === "mode"
      ? C.call(api, "vault.setUnlockMode", { mode: mode[0], passphrase: a.value })
      : C.call(api, "vault.rotateDeviceKey", { passphrase: a.value });
    p.then(function () { askS[1](null); busy[1](false); tick[1](tick[0] + 1); })
      .catch(function (e) { askS[1](Object.assign({}, a, { busy: false, error: C.errText(e) })); });
  }

  function changePass() {
    if (newPass[0].length < 10) return msg[1]("新口令至少 10 个字符");
    run(C.call(api, "vault.changePassphrase", { oldPassphrase: oldPass[0], newPassphrase: newPass[0] }));
    oldPass[1](""); newPass[1]("");
  }

  function rotate() {
    askS[1]({ kind: "rotate", value: "", busy: false, error: "" });
  }

  var status = st[0];
  var modal = askS[0] ? h(AskPassphrase, {
    h: h, C: C,
    title: askS[0].kind === "mode" ? "切换到 " + mode[0] + " 模式" : "轮换 device key",
    hint: askS[0].kind === "mode" ? "切换解锁模式需要验证主口令。" : "旧 device key 文件会被覆盖，之后用新 key 自动解锁。",
    value: askS[0].value, busy: askS[0].busy, error: askS[0].error,
    onChange: function (v) { askS[1](Object.assign({}, askS[0], { value: v })); },
    show: askS[0].show, onToggle: function () { askS[1](Object.assign({}, askS[0], { show: !askS[0].show })); },
    onCancel: function () { if (!askS[0].busy) askS[1](null); },
    onConfirm: confirmAsk,
  }) : null;

  return h("div", { className: "wbv" },
    h("h2", null, "保险箱设置"),
    h(C.Notice, { h: h, kind: "error", text: msg[0] }),
    h("div", { className: "wbv-card" },
      h("h3", null, "解锁模式"),
      MODES.map(function (m) {
        return h("label", { key: m.id, className: "wbv-row", style: { padding: "6px 0", alignItems: "flex-start", cursor: "pointer" } },
          h("input", { type: "radio", name: "vault-mode", checked: mode[0] === m.id, onChange: function () { mode[1](m.id); } }),
          h("span", null, h("strong", null, m.title), h("br"), h("span", { className: "wbv-muted" }, m.desc)));
      }),
      h("div", { className: "wbv-row" },
        h("span", { className: "wbv-muted" }, status ? "当前：" + status.unlockMode + (status.locked ? "（已锁定）" : "（已解锁）") : ""),
        h("span", { className: "wbv-grow" }),
        h(C.Btn, { h: h, kind: "primary", disabled: busy[0], onClick: applyMode }, busy[0] ? "应用中…" : "应用模式"))),
    h("div", { className: "wbv-card" },
      h("h3", null, "修改主口令"),
      h("p", { className: "wbv-muted" }, "只重包 DEK，不会重新加密所有凭据；device key 不受影响。"),
      h("div", { className: "wbv-row" },
        h(C.Field, { h: h, label: "当前口令" }, h("input", { type: "password", value: oldPass[0], onChange: function (e) { oldPass[1](e.target.value); } })),
        h(C.Field, { h: h, label: "新口令（至少 10 位）" }, h("input", { type: "password", value: newPass[0], onChange: function (e) { newPass[1](e.target.value); } }))),
      h(C.Btn, { h: h, disabled: busy[0], onClick: changePass }, "修改口令")),
    h("div", { className: "wbv-card" },
      h("h3", null, "Device key"),
      h("p", { className: "wbv-muted" }, "B/C 模式用来在启动时自动解锁。key 文件位于 $WB_HOME/vault-device.key，权限 0600；删除它等同回到锁定状态。"),
      h(C.Btn, { h: h, disabled: busy[0] || !status || status.unlockMode === "A", onClick: rotate }, "轮换 device key"))  , modal);
};

