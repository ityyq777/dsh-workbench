"use strict";
/** 保险箱首页：初始化 / 解锁 / 状态 / 快速锁定。 */
var C = require("../ui/common.cjs");
var AskPassphrase = require("../ui/ask-passphrase.cjs");

module.exports = function StatusView(props) {
  var h = props.h;
  var api = props.api;
  var lang = props.lang || "zh";
  var React = props.React;
  var st = React.useState({ loading: true, data: null, error: "" });
  var status = st[0].data;
  var error = st[0].error;
  var busy = React.useState(false);
  var pass = React.useState("");
  var pass2 = React.useState("");
  var mode = React.useState("A");
  var msg = React.useState("");
  var askS = React.useState(null); // { value, busy, error }
  var refreshTick = React.useState(0);
  var refresh = function () { refreshTick[1](refreshTick[0] + 1); };

  React.useEffect(function () {
    var alive = true;
    C.call(api, "vault.status").then(function (data) {
      if (alive) st[1]({ loading: false, data: data, error: "" });
    }).catch(function (e) {
      if (alive) st[1]({ loading: false, data: null, error: C.errText(e) });
    });
    return function () { alive = false; };
  }, [refreshTick[0]]);

  function run(fn) {
    busy[1](true);
    msg[1]("");
    return fn().then(function () {
      pass[1](""); pass2[1](""); busy[1](false); refresh();
    }).catch(function (e) {
      msg[1](C.errText(e)); busy[1](false);
    });
  }

  if (st[0].loading) return h("div", { className: "wbv" }, h(C.Empty, { h: h, text: "正在读取保险箱状态…" }));

  if (error) {
    function confirmAsk() {
    var a = askS[0];
    if (!a || !a.value) return;
    askS[1](Object.assign({}, a, { busy: true, error: "" }));
    busy[1](true); msg[1]("");
    C.call(api, "vault.unlock", { passphrase: a.value }).then(function () {
      return C.call(api, "vault.setUnlockMode", { mode: "A" });
    }).then(function () {
      askS[1](null); busy[1](false); refresh();
    }).catch(function (e) {
      askS[1](Object.assign({}, a, { busy: false, error: C.errText(e) }));
    });
  }

  var modal = askS[0] ? h(AskPassphrase, {
    h: h, C: C,
    title: "切回 A 模式",
    hint: "切换后下次启动需要重新解锁，请验证主口令。",
    value: askS[0].value, busy: askS[0].busy, error: askS[0].error,
    onChange: function (v) { askS[1](Object.assign({}, askS[0], { value: v })); },
    onCancel: function () { if (!askS[0].busy) askS[1](null); },
    onConfirm: confirmAsk,
  }) : null;

  return h("div", { className: "wbv" },
      h("h2", null, "凭据保险箱"),
      h(C.Notice, { h: h, kind: "error", text: error }),
      h(C.Btn, { h: h, onClick: refresh }, "重试"));
  }

  if (!status || !status.initialized) {
    function confirmAsk() {
    var a = askS[0];
    if (!a || !a.value) return;
    askS[1](Object.assign({}, a, { busy: true, error: "" }));
    busy[1](true); msg[1]("");
    C.call(api, "vault.unlock", { passphrase: a.value }).then(function () {
      return C.call(api, "vault.setUnlockMode", { mode: "A" });
    }).then(function () {
      askS[1](null); busy[1](false); refresh();
    }).catch(function (e) {
      askS[1](Object.assign({}, a, { busy: false, error: C.errText(e) }));
    });
  }

  var modal = askS[0] ? h(AskPassphrase, {
    h: h, C: C,
    title: "切回 A 模式",
    hint: "切换后下次启动需要重新解锁，请验证主口令。",
    value: askS[0].value, busy: askS[0].busy, error: askS[0].error,
    onChange: function (v) { askS[1](Object.assign({}, askS[0], { value: v })); },
    onCancel: function () { if (!askS[0].busy) askS[1](null); },
    onConfirm: confirmAsk,
  }) : null;

  return h("div", { className: "wbv" },
      h("h2", null, "初始化凭据保险箱"),
      h("p", { className: "wbv-muted" }, "口令只用于派生密钥，不会落库；忘记口令无法恢复已保存的凭据。口令包裹与密文会随云同步上传，云端没有口令解不开。"),
      h(C.Notice, { h: h, kind: "info", text: "默认 A 模式：每次启动后需要重新解锁。可稍后在设置里改成自动解锁。" }),
      h("div", { className: "wbv-card wbv-row" },
        h(C.Field, { h: h, label: "主口令（至少 12 位）" },
          h("input", { type: "password", value: pass[0], autoComplete: "new-password", onChange: function (e) { pass[1](e.target.value); } })),
        h(C.Field, { h: h, label: "确认口令" },
          h("input", { type: "password", value: pass2[0], autoComplete: "new-password", onChange: function (e) { pass2[1](e.target.value); } })),
        h(C.Field, { h: h, label: "解锁模式" },
          h("select", { value: mode[0], onChange: function (e) { mode[1](e.target.value); } },
            h("option", { value: "A" }, "A 全锁（推荐）"),
            h("option", { value: "B" }, "B 自动解锁，查看凭据再输口令"),
            h("option", { value: "C" }, "C 自动解锁，查看免口令（不建议）")))),
      h(C.Notice, { h: h, kind: "error", text: msg[0] }),
      h("div", { className: "wbv-row" },
        h(C.Btn, { h: h, kind: "primary", disabled: busy[0], onClick: function () {
          if (pass[0].length < 12) return msg[1]("口令至少 12 个字符");
          if (pass[0] !== pass2[0]) return msg[1]("两次输入不一致");
          run(function () { return C.call(api, "vault.setup", { passphrase: pass[0], mode: mode[0] }); });
        } }, busy[0] ? "初始化中…" : "创建保险箱")));
  }

  if (status.locked) {
    function confirmAsk() {
    var a = askS[0];
    if (!a || !a.value) return;
    askS[1](Object.assign({}, a, { busy: true, error: "" }));
    busy[1](true); msg[1]("");
    C.call(api, "vault.unlock", { passphrase: a.value }).then(function () {
      return C.call(api, "vault.setUnlockMode", { mode: "A" });
    }).then(function () {
      askS[1](null); busy[1](false); refresh();
    }).catch(function (e) {
      askS[1](Object.assign({}, a, { busy: false, error: C.errText(e) }));
    });
  }

  var modal = askS[0] ? h(AskPassphrase, {
    h: h, C: C,
    title: "切回 A 模式",
    hint: "切换后下次启动需要重新解锁，请验证主口令。",
    value: askS[0].value, busy: askS[0].busy, error: askS[0].error,
    onChange: function (v) { askS[1](Object.assign({}, askS[0], { value: v })); },
    onCancel: function () { if (!askS[0].busy) askS[1](null); },
    onConfirm: confirmAsk,
  }) : null;

  return h("div", { className: "wbv" },
      h("h2", null, "保险箱已锁定"),
      h("p", { className: "wbv-muted" }, "输入主口令解锁。解锁状态只保存在当前进程内存，空闲超时会自动锁定。"),
      h("div", { className: "wbv-card wbv-row" },
        h(C.Field, { h: h, label: "主口令" },
          h("input", { type: "password", value: pass[0], autoComplete: "current-password", onChange: function (e) { pass[1](e.target.value); } })),
        h(C.Btn, { h: h, kind: "primary", disabled: busy[0], onClick: function () {
          if (!pass[0]) return msg[1]("请输入口令");
          run(function () { return C.call(api, "vault.unlock", { passphrase: pass[0] }); });
        } }, busy[0] ? "解锁中…" : "解锁")),
      h(C.Notice, { h: h, kind: "error", text: msg[0] }),
      h("p", { className: "wbv-muted" }, "模式：" + modeName(status.unlockMode) + "；连续失败 5 次会锁定 5 分钟。"));
  }

  var modeText = modeName(status.unlockMode);
  function confirmAsk() {
    var a = askS[0];
    if (!a || !a.value) return;
    askS[1](Object.assign({}, a, { busy: true, error: "" }));
    busy[1](true); msg[1]("");
    C.call(api, "vault.unlock", { passphrase: a.value }).then(function () {
      return C.call(api, "vault.setUnlockMode", { mode: "A" });
    }).then(function () {
      askS[1](null); busy[1](false); refresh();
    }).catch(function (e) {
      askS[1](Object.assign({}, a, { busy: false, error: C.errText(e) }));
    });
  }

  var modal = askS[0] ? h(AskPassphrase, {
    h: h, C: C,
    title: "切回 A 模式",
    hint: "切换后下次启动需要重新解锁，请验证主口令。",
    value: askS[0].value, busy: askS[0].busy, error: askS[0].error,
    onChange: function (v) { askS[1](Object.assign({}, askS[0], { value: v })); },
    onCancel: function () { if (!askS[0].busy) askS[1](null); },
    onConfirm: confirmAsk,
  }) : null;

  return h("div", { className: "wbv" },
    h("div", { className: "wbv-row" }, h("h2", { className: "wbv-grow" }, "凭据保险箱"), h("span", { className: "wbv-pill ok" }, "已解锁")),
    h("div", { className: "wbv-grid" },
      h("div", { className: "wbv-card" }, h("div", { className: "wbv-muted" }, "凭据数量"), h("div", { className: "wbv-kpi" }, status.secretCount || 0)),
      h("div", { className: "wbv-card" }, h("div", { className: "wbv-muted" }, "分组数量"), h("div", { className: "wbv-kpi" }, status.groupCount || 0)),
      h("div", { className: "wbv-card" }, h("div", { className: "wbv-muted" }, "解锁模式"), h("div", { className: "wbv-kpi" }, status.unlockMode), h("div", { className: "wbv-muted" }, modeText)),
      h("div", { className: "wbv-card" }, h("div", { className: "wbv-muted" }, "上次解锁"), h("div", null, C.fmtTime(status.lastUnlockAt, lang)))),
    h(C.Notice, { h: h, kind: "info", text: "agent 只能看到名称和备注；查看明文必须由你在界面上操作。" }),
    h("div", { className: "wbv-row" },
      h(C.Btn, { h: h, onClick: function () { run(function () { return C.call(api, "vault.lock"); }); } }, "立即锁定"),
      h(C.Btn, { h: h, onClick: function () { askS[1]({ value: "", busy: false, error: "" }); } }, "切回 A 模式")),
    h(C.Notice, { h: h, kind: "error", text: msg[0] }),
    modal);
};


function modeName(mode) {
  if (mode === "B") return "启动自动解锁，查看凭据需口令";
  if (mode === "C") return "启动自动解锁，查看免口令";
  return "全锁：每次启动需解锁";
}
