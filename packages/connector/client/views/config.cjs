"use strict";
var C = require("../ui/common.cjs");
module.exports = function ConfigView(props) {
  var h = props.h, api = props.api, React = props.React;
  var st = C.useLoad(React, api, "connector.status", {}, []);
  var v = C.useLoad(React, api, "vault.status", {}, []);
  var d = st.data || {}, vault = v.data || {};
  return h("div", { className: "wbc-wrap" },
    h("div", { className: "wbc-head" }, h("div", null, h("h2", { className: "wbc-title" }, "设置与说明"), h("p", { className: "wbc-sub" }, "连接器的调度、投递与凭据边界。")), h(C.Btn, { h: h, onClick: function () { st.refresh(); v.refresh(); } }, "刷新")),
    st.error ? h(C.Notice, { h: h, kind: "error", text: st.error }) : null,
    h("div", { className: "wbc-card" }, h("strong", null, "调度"), h("ul", { className: "wbc-sub" }, h("li", null, "宿主每 15 秒检查一次，单次最多运行 3 个到期来源。"), h("li", null, "每个来源间隔最少 60 秒，最长 7 天；0 表示只手动或推送。"), h("li", null, "失败按 60/120/240…秒指数退避，上限约 1 小时；连续失败会写 last_error。"), h("li", null, "当前到期：", String(d.due || 0), " 个。"))),
    h("div", { className: "wbc-card" }, h("strong", null, "凭据边界"), h("p", { className: "wbc-sub" }, "token 只存在 vault；连接器通过 plugin 租约在内存里取用，列表与数据页都不会回显明文。"), h("div", { className: "wbc-row" }, h("span", null, "保险箱："), h(C.Pill, { h: h, kind: vault.unlocked ? "ok" : "warn" }, vault.unlocked ? "已解锁" : "已锁定"), h("span", { className: "wbc-muted" }, vault.unlockMode ? "模式 " + vault.unlockMode : "未初始化"), h("span", { className: "wbc-muted" }, "到「保险箱」视图创建/解锁凭据"))),
    h("div", { className: "wbc-card" }, h("strong", null, "Webhook 入口"), h("p", { className: "wbc-sub" }, "默认只允许本机回环；公网请用反向代理转到 127.0.0.1，不要直接暴露端口。"), h("pre", { className: "wbc-json" }, "POST /workbench/hooks/connector/inbound?source=<sourceId>\nHeader: x-webhook-token: <token>\nBody: {\"id\":\"可选\",\"title\":\"…\",\"body\":\"…\",\"url\":\"…\"}")),
    h("div", { className: "wbc-card" }, h("strong", null, "Driver"), ((st.data && st.data.drivers) || []).map(function (x) { return h("div", { key: x, className: "wbc-sub" }, "· " + x); }))
  );
};
