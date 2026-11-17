"use strict";
var C = require("../ui/common.cjs");

function defaults(driver) {
  var out = {};
  var fields = (driver && driver.configFields) || [];
  fields.forEach(function (f) { if (f.default !== undefined) out[f.name] = f.default; else if (f.type === "boolean") out[f.name] = false; else out[f.name] = ""; });
  return out;
}

function SourceForm(props) {
  var h = props.h, C = props.C, f = props.form, d = props.driver;
  var drivers = props.drivers, secrets = props.secrets;
  var setField = props.setField, setConfig = props.setConfig, save = props.save;
  function driver(id) { return drivers.filter(function (x) { return x.id === id; })[0] || null; }
  return h("div", { className: "wbc-card" },
        h("div", { className: "wbc-head" }, h("strong", null, f.id ? "编辑来源" : "新建来源"), h(C.Btn, { h: h, onClick: function () { props.onCancel(); } }, "取消")),
        h("div", { className: "wbc-form" },
          h(C.Field, { h: h, label: "名称" }, h("input", { value: f.name, maxLength: 80, onChange: function (e) { setField("name", e.target.value); }, placeholder: "例如：少数派 RSS" })),
          h(C.Field, { h: h, label: "类型" }, h("select", { value: f.driver, onChange: function (e) { var nd = driver(e.target.value); setField("driver", e.target.value); setField("config", defaults(nd)); } }, drivers.map(function (x) { return h("option", { key: x.id, value: x.id }, x.title); }))),
          h(C.Field, { h: h, label: "抓取间隔（秒）", hint: f.driver === "webhook" ? "Webhook 固定为推送，0" : "最少 60；0 表示只手动" }, h("input", { type: "number", min: 0, value: f.scheduleSec, onChange: function (e) { setField("scheduleSec", e.target.value); } })),
          h(C.Field, { h: h, label: "新内容投递" }, h("select", { value: f.sink, onChange: function (e) { setField("sink", e.target.value); } }, h("option", { value: "message" }, "消息域"), h("option", { value: "none" }, "只入库不投递"))),
          h(C.Field, { h: h, label: "启用" }, h("select", { value: f.enabled ? "1" : "0", onChange: function (e) { setField("enabled", e.target.value === "1"); } }, h("option", { value: "1" }, "启用"), h("option", { value: "0" }, "停用"))),
          h(C.Field, { h: h, label: "凭据" }, h("select", { value: f.secretId || "", onChange: function (e) { setField("secretId", e.target.value); } }, h("option", { value: "" }, "不绑定"), secrets.map(function (x) { return h("option", { key: x.id, value: x.id }, x.name + " (" + x.kind + ")"); })))
        ),
        d ? h("div", { className: "wbc-form", style: { marginTop: "10px" } }, (d.configFields || []).map(function (cf) {
          var val = f.config[cf.name] === undefined ? "" : f.config[cf.name];
          if (cf.type === "select") return h(C.Field, { h: h, key: cf.name, label: cf.label || cf.name, hint: cf.placeholder || "" }, h("select", { value: val || (cf.default || ""), onChange: function (e) { setConfig(cf.name, e.target.value); } }, (cf.options || []).map(function (op) { return h("option", { key: op, value: op }, op); })));
          if (cf.type === "boolean") return h(C.Field, { h: h, key: cf.name, label: cf.label || cf.name }, h("select", { value: val ? "1" : "0", onChange: function (e) { setConfig(cf.name, e.target.value === "1", "boolean"); } }, h("option", { value: "1" }, "是"), h("option", { value: "0" }, "否")));
          return h(C.Field, { h: h, key: cf.name, label: cf.label || cf.name, hint: cf.placeholder || "" }, h("input", { type: cf.type === "number" ? "number" : "text", value: val, onChange: function (e) { setConfig(cf.name, e.target.value, cf.type); } }));
        })) : null,
        h("div", { className: "wbc-row", style: { marginTop: "10px" } }, h(C.Btn, { h: h, kind: "primary", onClick: save, disabled: props.busy || !f.name.trim() }, props.busy ? "保存中…" : "保存"))
      );
}

module.exports = function SourcesView(props) {
  var h = props.h, api = props.api, React = props.React, lang = props.lang || "zh";
  var s = C.useLoad(React, api, "connector.sourceList", {}, []);
  var drvS = React.useState([]), secS = React.useState([]);
  var rows = (s.data && s.data.sources) || [];
  var formS = React.useState(null), busyS = React.useState(false), msgS = React.useState(""), bindS = React.useState({});

  React.useEffect(function () {
    C.call(api, "connector.driverList").then(function (r) { drvS[1]((r && r.drivers) || []); }).catch(function () {});
    C.call(api, "vault.secretList").then(function (r) { secS[1]((r && r.items) || []); }).catch(function () { secS[1]([]); });
  }, []);

  var drivers = drvS[0], secrets = secS[0];
  function driver(id) { return drivers.filter(function (d) { return d.id === id; })[0] || null; }
  function startCreate() { var d = drivers[0]; formS[1]({ id: "", name: "", driver: d ? d.id : "rss", config: defaults(d), scheduleSec: 900, sink: "message", enabled: true, secretId: "" }); msgS[1](""); }
  function startEdit(src) {
    formS[1]({ id: src.id, name: src.name, driver: src.driver, config: Object.assign({}, src.config), scheduleSec: src.scheduleSec, sink: src.sink, enabled: src.enabled, secretId: (src.state && src.state.secretId) || "" });
    msgS[1]("");
  }
  function setField(k, v) { formS[1](function (f) { var n = Object.assign({}, f); n[k] = v; return n; }); }
  function setConfig(k, v, type) {
    var val = v;
    if (type === "number") val = v === "" ? "" : Number(v);
    if (type === "boolean") val = Boolean(v);
    formS[1](function (f) { var n = Object.assign({}, f); n.config = Object.assign({}, f.config); n.config[k] = val; return n; });
  }
  function save() {
    var f = formS[0]; if (!f) return;
    busyS[1](true); msgS[1]("");
    var payload = { name: f.name.trim(), driver: f.driver, config: f.config, scheduleSec: Number(f.scheduleSec) || 0, sink: f.sink, enabled: f.enabled, secretId: f.secretId };
    var p = f.id ? C.call(api, "connector.sourceUpdate", Object.assign({ id: f.id }, payload)) : C.call(api, "connector.sourceCreate", payload);
    p.then(function () { busyS[1](false); formS[1](null); s.refresh(); }).catch(function (e) { busyS[1](false); msgS[1](C.errText(e)); });
  }
  function run(src) {
    busyS[1](true); msgS[1]("");
    C.call(api, "connector.sourceRun", { id: src.id }).then(function (r) { busyS[1](false); msgS[1]("运行完成：" + JSON.stringify(r)); s.refresh(); }).catch(function (e) { busyS[1](false); msgS[1](C.errText(e)); });
  }
  function bind(src) {
    var secretId = bindS[0][src.id] !== undefined ? bindS[0][src.id] : ((src.state && src.state.secretId) || "");
    busyS[1](true); msgS[1]("");
    C.call(api, "connector.sourceBind", { id: src.id, secretId: secretId }).then(function () { busyS[1](false); s.refresh(); }).catch(function (e) { busyS[1](false); msgS[1](C.errText(e)); });
  }
  function toggle(src) {
    busyS[1](true);
    C.call(api, "connector.sourceDelivery", { id: src.id, enabled: !(src.state && src.state.deliveryEnabled) }).then(function () { busyS[1](false); s.refresh(); }).catch(function (e) { busyS[1](false); msgS[1](C.errText(e)); });
  }
  function del(src) {
    if (!window.confirm("删除来源「" + src.name + "」？本机条目会保留。")) return;
    busyS[1](true);
    C.call(api, "connector.sourceDelete", { id: src.id }).then(function () { busyS[1](false); s.refresh(); }).catch(function (e) { busyS[1](false); msgS[1](C.errText(e)); });
  }

  var f = formS[0], d = f ? driver(f.driver) : null;
  return h("div", { className: "wbc-wrap" },
    h("div", { className: "wbc-head" }, h("div", null, h("h2", { className: "wbc-title" }, "来源"), h("p", { className: "wbc-sub" }, "一个来源一条定义；RSS 定时抓取，Webhook 等待外部推送。")), h("div", { className: "wbc-row" }, h(C.Btn, { h: h, onClick: s.refresh }, "刷新"), h(C.Btn, { h: h, kind: "primary", onClick: startCreate, disabled: drivers.length === 0 }, "新建来源"))),
    msgS[0] ? h(C.Notice, { h: h, kind: msgS[0].indexOf("完成") >= 0 ? "ok" : "error", text: msgS[0] }) : null,
    s.error ? h(C.Notice, { h: h, kind: "error", text: s.error }) : null,
    f ? h(SourceForm, { h: h, C: C, form: f, driver: d, drivers: drivers, secrets: secrets, setField: setField, setConfig: setConfig, save: save, busy: busyS[0], onCancel: function () { formS[1](null); } }) : null,
    s.loading ? h(C.Empty, { h: h, text: "加载中…" }) : rows.length === 0 ? h(C.Empty, { h: h, text: "还没有来源。" }) : rows.map(function (src) {
      var st = src.state || {};
      return h("div", { key: src.id, className: "wbc-card" },
        h("div", { className: "wbc-head" },
          h("div", null, h("div", { className: "wbc-row" }, h("strong", null, src.name), h(C.Pill, { h: h }, src.driver), h(C.Pill, { h: h, kind: src.enabled ? "ok" : "warn" }, src.enabled ? "启用" : "停用"), st.lastStatus === "error" ? h(C.Pill, { h: h, kind: "error" }, "错误") : null),
            h("p", { className: "wbc-sub" }, (src.scheduleSec ? "每 " + src.scheduleSec + " 秒" : "仅手动/推送") + " · " + (src.sink === "message" ? "投递到消息" : "只入库") + (st.secretId ? " · 已绑定凭据" : " · 未绑定凭据"))),
          h("div", { className: "wbc-row" }, h(C.Btn, { h: h, onClick: function () { run(src); }, disabled: busyS[0] }, "立即运行"), h(C.Btn, { h: h, onClick: function () { toggle(src); }, disabled: busyS[0] }, st.deliveryEnabled ? "关闭投递" : "开启投递"), h(C.Btn, { h: h, onClick: function () { startEdit(src); } }, "编辑"), h(C.Btn, { h: h, kind: "danger", onClick: function () { del(src); } }, "删除"))),
        h("div", { className: "wbc-grid", style: { marginTop: "8px" } },
          h("div", { className: "wbc-sub" }, "上次运行：", C.fmtTime(st.lastRunAt, lang)),
          h("div", { className: "wbc-sub" }, "下次：", st.nextRunAt ? C.fmtTime(st.nextRunAt, lang) : "—"),
          h("div", { className: "wbc-sub" }, "失败次数：", st.failCount || 0),
          st.lastError ? h("div", { className: "wbc-sub" }, "错误：", st.lastError) : null),
        h("div", { className: "wbc-row", style: { marginTop: "8px" } }, h("span", { className: "wbc-sub" }, "凭据"), h("select", { value: bindS[0][src.id] !== undefined ? bindS[0][src.id] : (st.secretId || ""), onChange: function (e) { var n = Object.assign({}, bindS[0]); n[src.id] = e.target.value; bindS[1](n); } }, h("option", { value: "" }, "不绑定"), secrets.map(function (x) { return h("option", { key: x.id, value: x.id }, x.name); })), h(C.Btn, { h: h, onClick: function () { bind(src); }, disabled: busyS[0] }, "保存绑定")),
        h(C.Json, { h: h, value: src.config })
      );
    })
  );
};

module.exports.SourceForm = SourceForm;
