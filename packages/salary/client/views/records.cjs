"use strict";
/**
 * 工资记录页：KPI、筛选、按月分组、表格行展开详情、内联表单。
 * 只调本插件 action；金额格式与汇总口径统一走 ui/fields.cjs。
 */
module.exports = function Records(props) {
  var h = props.h, React = props.React, api = props.api, lang = props.lang;
  var C = require("../ui/common.cjs");
  var DP = require("../../../lib/date-picker.cjs");
  var F = require("../ui/fields.cjs");

  var status = C.useLoad(React, api, "salary.status", {}, []);
  var filterState = React.useState({ year: String(new Date().getFullYear()), cycle: "" });
  var filter = filterState[0], setFilter = filterState[1];
  var list = C.useLoad(React, api, "salary.recordList", {
    year: filter.year ? Number(filter.year) : undefined,
    cycle: filter.cycle || undefined,
    limit: 400,
  }, [filter.year, filter.cycle]);
  var openState = React.useState(props.initialOpenId || "");
  var openId = openState[0], setOpenId = openState[1];
  var confirmState = React.useState("");
  var confirmId = confirmState[0], setConfirmId = confirmState[1];
  var formState = React.useState(props.initialForm || null);
  var form = formState[0], setForm = formState[1];
  var msgState = React.useState(null);
  var msg = msgState[0], setMsg = msgState[1];
  var savingState = React.useState(false);
  var saving = savingState[0], setSaving = savingState[1];

  // 编辑/新增改为弹层：Esc 关闭、禁止背景滚动；document 不存在时（脚本渲染测试）跳过。
  var modalOpen = !!form;
  React.useEffect(function () {
    if (!modalOpen || typeof document === "undefined" || typeof document.addEventListener !== "function" || !document.body) return undefined;
    function onKey(event) { if (event.key === "Escape") closeForm(); }
    document.addEventListener("keydown", onKey);
    var previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return function () {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [modalOpen, form && form.mode, form && form.id]);

  function reloadAll() {
    status.refresh();
    list.refresh();
  }

  function pickDate(cycle) {
    var now = new Date();
    var year = now.getFullYear();
    var month = String(now.getMonth() + 1).padStart(2, "0");
    return cycle === "monthly" ? year + "-" + month + "-15" : year + "-" + month + "-" + String(now.getDate()).padStart(2, "0");
  }

  function openCreate() {
    setConfirmId("");
    setOpenId("");
    setMsg(null);
    var payDate = pickDate("monthly");
    setForm({ mode: "create", id: "", payDate: payDate, cycle: "monthly", note: F.defaultNote(payDate, "monthly"), values: F.blankValues(), lockGross: false });
  }

  function openEdit(item) {
    var values = F.blankValues();
    F.KEYS.forEach(function (key) { values[key] = key === "grossPay" || key === "netPay" ? F.fmtAmount(item[key]) : item[key] ? F.fmtAmount(item[key]) : ""; });
    var incomeZero = F.INCOME_KEYS.every(function (key) { return !F.num(item[key]); });
    setConfirmId("");
    setOpenId("");
    setMsg(null);
    setForm({ mode: "edit", id: item.id, payDate: item.payDate, cycle: item.cycle || "monthly", note: item.note || "", values: values, lockGross: incomeZero && F.num(item.grossPay) > 0 });
  }

  function closeForm() {
    setForm(null);
    setMsg(null);
  }

  function setField(key, value) {
    setForm(function (prev) {
      var next = Object.assign({}, prev, { note: prev.note });
      next[key] = value;
      if (key === "payDate" && !prev.cycleLocked) {
        var same = String(value).slice(5) === "15";
        if (same) next.cycle = "monthly";
      }
      // 备注没被手改过时，跟着发薪日自动填「所属月份工资」。
      if (key === "payDate" && (!prev.note || prev.note === F.defaultNote(prev.payDate, prev.cycle))) {
        next.note = F.defaultNote(value, next.cycle);
      }
      return next;
    });
  }

  function setValue(key, value) {
    setForm(function (prev) {
      var values = Object.assign({}, prev.values);
      values[key] = value;
      return Object.assign({}, prev, { values: values });
    });
  }

  function recalcFromDetail() {
    setForm(function (prev) {
      var computed = F.totals(prev.values);
      var values = Object.assign({}, prev.values, { grossPay: F.fmtAmount(computed.gross), netPay: F.fmtAmount(computed.net) });
      return Object.assign({}, prev, { values: values, lockGross: false });
    });
  }

  function submit() {
    if (!form) return;
    var computed = F.totals(form.values);
    var payload = {
      payDate: form.payDate,
      cycle: form.cycle,
      note: form.note || "",
    };
    F.KEYS.forEach(function (key) {
      if (key === "grossPay" && form.lockGross) { payload.grossPay = F.num(form.values.grossPay); return; }
      if (key === "grossPay" || key === "netPay") { payload[key] = F.num(form.values[key]) || computed[key === "grossPay" ? "gross" : "net"]; return; }
      payload[key] = F.num(form.values[key]);
    });
    setSaving(true);
    var request = form.mode === "edit"
      ? C.call(api, "salary.recordUpdate", Object.assign({ id: form.id }, payload))
      : C.call(api, "salary.recordCreate", payload);
    request.then(function () {
      setSaving(false);
      closeForm();
      reloadAll();
      setMsg({ kind: "ok", text: "已保存" });
    }).catch(function (e) {
      setSaving(false);
      setMsg({ kind: "error", text: C.errText(e) });
    });
  }

  function remove(id) {
    C.call(api, "salary.recordDelete", { id: id }).then(function () {
      setConfirmId("");
      if (openId === id) setOpenId("");
      reloadAll();
      setMsg({ kind: "ok", text: "已删除" });
    }).catch(function (e) { setMsg({ kind: "error", text: C.errText(e) }); });
  }

  var items = (list.data && list.data.items) || [];
  var groups = {};
  items.forEach(function (item) {
    var period = String(item.payDate).slice(0, 7);
    (groups[period] = groups[period] || []).push(item);
  });
  var periods = Object.keys(groups).sort().reverse();
  var total = Number(list.data && list.data.total) || items.length;
  var currentYear = new Date().getFullYear();
  var yearOptions = ["", String(currentYear + 1), String(currentYear), String(currentYear - 1), String(currentYear - 2)];
  var latest = status.data || {};


  function amountInput(key, disabled) {
    return h("input", {
      className: "wbsal-input", type: "number", step: "0.01",
      min: key === "performanceBonus" ? undefined : "0",
      value: form.values[key],
      disabled: disabled,
      onChange: function (e) { setValue(key, e.target.value); },
      onBlur: function () { setValue(key, F.fmtAmount(F.num(form.values[key]))); },
    });
  }

  function renderForm() {
    var computed = F.totals(form.values);
    var lockedGross = form.lockGross;
    var sameDayCount = items.filter(function (item) { return item.payDate === form.payDate && item.id !== form.id; }).length;
    return h("div", { className: "wbsal-card wbsal-form wbsal-form-modal" },
      h("div", { className: "wbsal-form-head" },
        h("div", null,
          h("div", { className: "wbsal-eyebrow" }, form.mode === "edit" ? "EDIT RECORD" : "NEW RECORD"),
          h("h3", null, form.mode === "edit" ? "编辑工资" : "记一笔工资")),
        h(C.Btn, { h: h, kind: "ghost", onClick: closeForm }, "关闭")),
      h("div", { className: "wbsal-form-meta" },
        h(C.Field, { h: h, label: "发薪日期", hint: F.incomeLabel(form.payDate) ? "对应 " + F.incomeLabel(form.payDate) + " 工资" : "月结" },
          h(DP.DatePicker, { React: React, h: h, prefix: "wbsal", lang: lang, label: "发薪日期", value: form.payDate, onChange: function (next) { setField("payDate", next); } })),
        h(C.Field, { h: h, label: "类型", hint: "月结" },
          h("select", { className: "wbsal-input", value: form.cycle, onChange: function (e) { setField("cycle", e.target.value); } },
            h("option", { value: "monthly" }, "月结"), h("option", { value: "daily" }, "日结"))),
        h(C.Field, { h: h, label: "备注" }, h("input", { className: "wbsal-input", value: form.note, onChange: function (e) { setField("note", e.target.value); } }))),
      sameDayCount > 0 ? h(C.Notice, { h: h, text: "该日已有 " + sameDayCount + " 笔记录；保存会新增一条，不会覆盖。" }) : null,
      F.GROUPS.map(function (group) {
        return h("div", { key: group.id, className: "wbsal-form-group" },
          h("div", { className: "wbsal-group-head" },
            h("div", { className: "wbsal-group-title" }, group.title),
            h("span", null, group.hint)),
          h("div", { className: "wbsal-form-grid" }, group.keys.map(function (key) {
            return h(C.Field, { key: key, h: h, label: F.LABELS[key] }, amountInput(key, false));
          })));
      }),
      h("div", { className: "wbsal-form-group" },
        h("div", { className: "wbsal-group-head" },
          h("div", { className: "wbsal-group-title" }, "汇总"),
          h("span", null, "默认按明细实时计算，也可以直接改")),
        h("div", { className: "wbsal-form-grid" },
          h(C.Field, { h: h, label: "应发税前工资" }, amountInput("grossPay", lockedGross)),
          h(C.Field, { h: h, label: "实发工资" }, amountInput("netPay", false)))),
      h("div", { className: "wbsal-summary" },
        h("div", null, h("span", null, "收入合计"), h("b", null, F.money(computed.income))),
        h("div", null, h("span", null, "税前扣款"), h("b", null, F.money(computed.preTax))),
        h("div", null, h("span", null, "社保公积金"), h("b", null, F.money(computed.social))),
        h("div", null, h("span", null, "个税+税后"), h("b", null, F.money(computed.tax))),
        h("div", null, h("span", null, "应发"), h("b", null, F.money(F.num(form.values.grossPay)))),
        h("div", null, h("span", null, "实发"), h("b", null, F.money(F.num(form.values.netPay)))),
        lockedGross ? h("div", { className: "wbsal-lock" },
          h("span", { className: "wbsal-muted" }, "这条历史记录只有汇总值，应发已锁定，避免被明细重算清零。"),
          h(C.Btn, { h: h, onClick: recalcFromDetail }, "按明细重算")) : null),
      h(C.Notice, { h: h, kind: msg && msg.kind, text: msg && msg.text }),
      h("div", { className: "wbsal-form-actions" },
        h(C.Btn, { h: h, kind: "primary", onClick: submit, disabled: saving }, saving ? "保存中…" : (form.mode === "edit" ? "保存修改" : "保存")),
        h(C.Btn, { h: h, kind: "ghost", onClick: closeForm }, "取消")));
  }

  function renderModal() {
    return h("div", {
      className: "wbsal-mask",
      onClick: function (event) { if (event.target === event.currentTarget) closeForm(); },
    }, h("div", {
      className: "wbsal-modal",
      role: "dialog",
      "aria-modal": "true",
      "aria-label": form.mode === "edit" ? "编辑工资" : "记一笔工资",
    }, renderForm()));
  }

  function renderDetail(item) {
    var blocks = F.GROUPS.map(function (group) {
      return h("div", { key: group.id, className: "wbsal-detail-block" },
        h("div", { className: "wbsal-group-title" }, group.title),
        h("div", { className: "wbsal-fields" }, group.keys.map(function (key) {
          return h("div", { key: key }, h("span", null, F.LABELS[key]), h("b", null, F.money(item[key])));
        })));
    });
    blocks.push(h("div", { key: "sum", className: "wbsal-detail-block" },
      h("div", { className: "wbsal-group-title" }, "汇总"),
      h("div", { className: "wbsal-fields" },
        h("div", { className: "wbsal-field-sum" }, h("span", null, "应发税前"), h("b", null, F.money(item.grossPay))),
        h("div", { className: "wbsal-field-sum" }, h("span", null, "社保公积金"), h("b", null, F.money(F.sumValues(item, F.SOCIAL_KEYS)))),
        h("div", { className: "wbsal-field-sum" }, h("span", null, "个税+税后"), h("b", null, F.money(F.sumValues(item, F.TAX_KEYS)))),
        h("div", { className: "wbsal-field-sum" }, h("span", null, "实发工资"), h("b", null, F.money(item.netPay))))));
    return h("div", { className: "wbsal-detail" },
      blocks,
      h("div", { className: "wbsal-detail-foot" },
        h("div", { className: "wbsal-muted" },
          (item.note ? "备注：" + item.note + " · " : "") + "更新于 " + C.fmtTime(item.updatedAt, lang)),
        h("div", { className: "wbsal-detail-actions" },
          h(C.Btn, { h: h, onClick: function () { openEdit(item); } }, "编辑"),
          confirmId === item.id
            ? h("span", { className: "wbsal-confirm" },
              h("span", { className: "wbsal-danger" }, "确认删除？"),
              h(C.Btn, { h: h, kind: "danger", onClick: function () { remove(item.id); } }, "删除"),
              h(C.Btn, { h: h, kind: "ghost", onClick: function () { setConfirmId(""); } }, "取消"))
            : h(C.Btn, { h: h, kind: "danger", onClick: function () { setConfirmId(item.id); } }, "删除"))));
  }

  function renderRow(item) {
    var expanded = openId === item.id;
    var rows = [h("tr", {
      key: item.id,
      className: "wbsal-record-row" + (expanded ? " open" : ""),
      onClick: function () { setOpenId(expanded ? "" : item.id); setConfirmId(""); },
    },
      h("td", { className: "left" }, h("span", { className: "wbsal-date" }, h("b", null, String(item.payDate).slice(5)), h("span", null, F.weekday(item.payDate)))),
      h("td", { className: "left" }, h(C.Pill, { h: h, kind: item.cycle === "daily" ? "warn" : "ok" }, item.cycle === "daily" ? "日结" : "月结")),
      h("td", null, h("span", { className: "wbsal-net" }, F.money(item.netPay))),
      h("td", { className: "wbsal-opt" }, F.money(item.grossPay)),
      h("td", { className: "wbsal-opt hide-md" }, F.money(F.sumValues(item, F.SOCIAL_KEYS))),
      h("td", { className: "wbsal-opt hide-md" }, F.money(item.incomeTax)),
      h("td", null, h("span", { className: "wbsal-caret" }, "›"))),
    expanded ? h("tr", { key: item.id + "-detail" }, h("td", { className: "wbsal-detail-cell", colSpan: 7 }, renderDetail(item))) : null];
    return rows;
  }

  var body;
  if (list.loading) body = h(C.Empty, { h: h, text: "加载中…" });
  else if (list.error) body = h(C.Notice, { h: h, kind: "error", text: list.error });
  else if (items.length === 0) {
    body = h("div", { className: "wbsal-empty" },
      h("div", null, filter.year || filter.cycle ? "这个筛选条件下没有记录" : "还没有工资记录，先记一笔"),
      h("div", { className: "wbsal-empty-actions" },
        filter.year || filter.cycle
          ? h(C.Btn, { h: h, onClick: function () { setFilter({ year: "", cycle: "" }); } }, "清除筛选")
          : null,
        h(C.Btn, { h: h, kind: "primary", onClick: openCreate }, "＋ 记一笔")));
  } else {
    body = h("div", { className: "wbsal-months" }, periods.map(function (period) {
      var rows = groups[period];
      var sum = rows.reduce(function (acc, item) { return acc + (Number(item.netPay) || 0); }, 0);
      return h("section", { key: period },
        h("div", { className: "wbsal-month" },
          h("div", { className: "wbsal-month-title" },
            h("strong", null, F.monthLabel(period)),
            h("span", null, "发薪月 · " + rows.length + " 笔")),
          h("div", { className: "wbsal-month-total" }, "实发合计", h("b", null, F.money(sum)))),
        h("div", { className: "wbsal-table-wrap" },
          h("table", { className: "wbsal-table" },
            h("thead", null, h("tr", null,
              h("th", { className: "left" }, "发薪日"),
              h("th", { className: "left" }, "类型"),
              h("th", null, "实发"),
              h("th", null, "应发"),
              h("th", { className: "hide-md" }, "社保公积金"),
              h("th", { className: "hide-md" }, "个税"),
              h("th", null, ""))),
            h("tbody", null, rows.map(renderRow)))));
    }));
  }

  return h("div", { className: "wbsal-page" },
    h("div", { className: "wbsal-toolbar" },
      h(C.Field, { h: h, label: "年份" }, h("select", { className: "wbsal-input", value: filter.year, onChange: function (e) { setFilter(Object.assign({}, filter, { year: e.target.value })); } },
        yearOptions.map(function (value) { return h("option", { key: value || "all", value: value }, value ? value + " 年" : "全部年份"); }))),
      h(C.Field, { h: h, label: "类型" }, h("select", { className: "wbsal-input", value: filter.cycle, onChange: function (e) { setFilter(Object.assign({}, filter, { cycle: e.target.value })); } },
        h("option", { value: "" }, "全部"), h("option", { value: "monthly" }, "月结"), h("option", { value: "daily" }, "日结"))),
      h("div", { className: "wbsal-toolbar-end" },
        h("span", { className: "wbsal-toolbar-count" }, "共 ", h("b", null, total), " 笔"),
        h(C.Btn, { h: h, kind: "primary", onClick: openCreate }, "＋ 记一笔"))),
    h(C.Notice, { h: h, kind: msg && msg.kind, text: msg && !form ? msg.text : "" }),
    body,
    form ? renderModal() : null);
};
