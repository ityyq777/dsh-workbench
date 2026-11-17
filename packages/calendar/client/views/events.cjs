"use strict";
/** 日程：近 14 天列表 + 新建 + 删除。 */
module.exports = function Events(props) {
  var h = props.h, React = props.React, api = props.api, lang = props.lang;
  var C = require("../ui/common.cjs");
  var now = Date.now();
  var load = C.useLoad(React, api, "calendar.eventsBetween", { from: now - 86400000, to: now + 14 * 86400000, limit: 200 }, []);
  var st = React.useState({ open: false, title: "", start: "", duration: 60, location: "", attendees: "" });
  var form = st[0], setForm = st[1];
  var msg = React.useState(null);
  function set(k, v) { setForm(Object.assign({}, form, { [k]: v })); }
  function openForm() {
    var d = new Date(Date.now() + 86400000); d.setHours(10, 0, 0, 0);
    var local = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    setForm({ open: true, title: "", start: local, duration: 60, location: "", attendees: "" });
  }
  function submit() {
    if (!form.title.trim()) { msg[1]({ kind: "error", text: "标题不能为空" }); return; }
    var startAt = new Date(form.start).getTime();
    if (!Number.isFinite(startAt)) { msg[1]({ kind: "error", text: "开始时间不合法" }); return; }
    var attendees = form.attendees.split(/[,，;；\n]/).map(function (s) { return s.trim(); }).filter(Boolean).map(function (email) { return { email: email }; });
    C.call(api, "calendar.eventCreate", { title: form.title.trim(), startAt: startAt, endAt: startAt + Number(form.duration || 60) * 60000, location: form.location, attendees: attendees }).then(function () { msg[1]({ kind: "ok", text: "已创建" }); setForm(Object.assign({}, form, { open: false })); load.refresh(); }).catch(function (e) { msg[1]({ kind: "error", text: C.errText(e) }); });
  }
  function remove(id) { C.call(api, "calendar.eventDelete", { id: id }).then(function () { load.refresh(); }).catch(function (e) { msg[1]({ kind: "error", text: C.errText(e) }); }); }
  var items = (load.data && load.data.items) || [];
  var groups = {};
  items.forEach(function (ev) {
    var k = new Date(ev.startAt).toLocaleDateString(lang === "en" ? "en-US" : "zh-CN", { month: "short", day: "numeric", weekday: "short" });
    (groups[k] = groups[k] || []).push(ev);
  });
  return h("div", { className: "wbca-page" },
    h("div", { className: "wbca-head" }, h("div", null, h("h2", null, "日程"), h("p", { className: "wbca-sub" }, "近 14 天；提醒通过消息插件发送")), h(C.Btn, { h: h, kind: "primary", onClick: openForm }, "新建事件")),
    h(C.Notice, { h: h, text: msg[0] && msg[0].text, kind: msg[0] && msg[0].kind }),
    form.open ? h("div", { className: "wbca-card" },
      h(C.Field, { h: h, label: "标题" }, h("input", { className: "wbca-input", value: form.title, onChange: function (e) { set("title", e.target.value); } })),
      h("div", { className: "wbca-row" },
        h(C.Field, { h: h, label: "开始" }, h("input", { className: "wbca-input", type: "datetime-local", value: form.start, onChange: function (e) { set("start", e.target.value); } })),
        h(C.Field, { h: h, label: "时长（分钟）" }, h("input", { className: "wbca-input", type: "number", min: 5, max: 1440, value: form.duration, onChange: function (e) { set("duration", e.target.value); } }))),
      h(C.Field, { h: h, label: "地点" }, h("input", { className: "wbca-input", value: form.location, onChange: function (e) { set("location", e.target.value); } })),
      h(C.Field, { h: h, label: "参与人", hint: "邮箱，用逗号分隔" }, h("input", { className: "wbca-input", value: form.attendees, onChange: function (e) { set("attendees", e.target.value); } })),
      h("div", { className: "wbca-actions" }, h(C.Btn, { h: h, kind: "primary", onClick: submit }, "保存"), h(C.Btn, { h: h, onClick: function () { set("open", false); } }, "取消"))) : null,
    load.loading ? h(C.Empty, { h: h, text: "加载中…" }) : load.error ? h(C.Notice, { h: h, kind: "error", text: load.error }) : items.length === 0 ? h(C.Empty, { h: h, text: "这段时间没有安排" }) :
      Object.keys(groups).map(function (day) { return h("section", { key: day, className: "wbca-group" }, h("h3", null, day), groups[day].map(function (ev) {
        return h("div", { key: ev.id, className: "wbca-list-row" }, h("div", { className: "wbca-time" }, new Date(ev.startAt).toLocaleTimeString(lang === "en" ? "en-US" : "zh-CN", { hour: "2-digit", minute: "2-digit", hour12: false })), h("div", { className: "wbca-main" }, h("strong", null, ev.title), h("span", { className: "wbca-muted" }, [ev.location, ev.attendees ? ev.attendees.length + " 人" : ""].filter(Boolean).join(" · "))), h("button", { type: "button", className: "wbca-icon-btn", title: "删除", onClick: function () { remove(ev.id); } }, "×"));
      })); })
  );
};
