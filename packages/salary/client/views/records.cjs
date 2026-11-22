"use strict";
/**
 * 工资记录页：KPI、筛选、按月分组、表格行展开详情、内联表单。
 * 只调本插件 action；金额格式与汇总口径统一走 ui/fields.cjs。
 */
var staged = require("../../../lib/staged-dialog.cjs");
var salaryCommon = require("../ui/common.cjs");
// 金额输入统一走校验型控件：键入不被改写，非法只红字提示并禁止保存。
var NF = require("../../../lib/number-field.cjs");
// 记一笔/编辑工资改为分三步：基础信息 → 金额明细 → 汇总确认。
// 遮罩、Esc、Tab 循环、关闭后焦点归位仍来自 lib/overlay.cjs（经由分阶段外壳），
// 步骤条与逐步校验来自 lib/staged-dialog.cjs，宽度统一 880px，窄屏回落单列。
var FormDialog = staged.createStagedDialog({
  maskClass: "wbsal-mask",
  dialogClass: "wbsal-modal",
  displayName: "SalaryFormDialog",
  ariaLabelOf: function (props) { return props["aria-label"] || props.title; },
  header: function (props) {
    var h = props.h;
    var C = salaryCommon;
    return h(
      "div",
      { className: "wbsal-form-head" },
      h(
        "div",
        null,
        h("div", { className: "wbsal-eyebrow" }, props.eyebrow || ""),
        h("h3", null, props.title),
      ),
      h(
        C.Btn,
        { h: h, kind: "ghost", onClick: props.onClose, disabled: !!props.submitting },
        "关闭",
      ),
    );
  },
  closeOnEscape: function (props) { return !props.submitting; },
  closeOnMask: function (props) { return !props.submitting; },
});

module.exports = function Records(props) {
  var h = props.h, React = props.React, api = props.api, lang = props.lang;
  var C = require("../ui/common.cjs");
  var DP = require("../../../lib/date-picker.cjs");
  var F = require("../ui/fields.cjs");

  var status = C.useLoad(React, api, "salary.status", {}, []);
  var filterState = React.useState({ year: String(new Date().getFullYear()), cycle: "", employmentType: "" });
  var filter = filterState[0], setFilter = filterState[1];
  var list = C.useLoad(React, api, "salary.recordList", {
    year: filter.year ? Number(filter.year) : undefined,
    cycle: filter.cycle || undefined,
    employmentType: filter.employmentType || undefined,
    limit: 400,
  }, [filter.year, filter.cycle, filter.employmentType]);
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
  // 记录哪些金额项当前不合法：只要有一项非法就禁止保存，避免提交半截数据。
  var badState = React.useState({});
  var badKeys = badState[0], setBadKeys = badState[1];
  var moneyInvalid = Object.keys(badKeys).length > 0;

  // 编辑/新增改为弹层：Esc 关闭、禁止背景滚动；document 不存在时（脚本渲染测试）跳过。
  var modalOpen = !!form;
  React.useEffect(function () {
    if (!modalOpen || typeof document === "undefined" || typeof document.addEventListener !== "function" || !document.body) return undefined;
    var previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return function () {
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
    setBadKeys({});
    var payDate = pickDate("monthly");
    setForm({ mode: "create", id: "", payDate: payDate, incomePeriod: defaultPeriod(payDate, "monthly"), cycle: "monthly", employmentType: "", note: F.defaultNote(payDate, "monthly"), values: F.blankValues(), lockGross: false });
  }

  function openEdit(item) {
    var values = F.blankValues();
    F.KEYS.forEach(function (key) { values[key] = key === "grossPay" || key === "netPay" ? F.fmtAmount(item[key]) : item[key] ? F.fmtAmount(item[key]) : ""; });
    var incomeZero = F.INCOME_KEYS.every(function (key) { return !F.num(item[key]); });
    setBadKeys({});
    setConfirmId("");
    setOpenId("");
    setMsg(null);
    setForm({ mode: "edit", id: item.id, payDate: item.payDate, incomePeriod: item.incomePeriod || "", cycle: item.cycle || "monthly", employmentType: item.employmentType || "", note: item.note || "", values: values, original: item, lockGross: incomeZero && F.num(item.grossPay) > 0 });
  }

  function defaultPeriod(payDate, cycle) {
    return cycle === "daily" ? payDate : payDate === "" || payDate.startsWith("2000-01-") ? "" : F.incomePeriod(payDate);
  }

  function closeForm() {
    setForm(null);
    setMsg(null);
    setBadKeys({});
  }

  function setField(key, value) {
    setForm(function (prev) {
      var next = Object.assign({}, prev);
      next[key] = value;
      if (key === "incomePeriod") next.periodTouched = true;
      if (key === "note") next.noteTouched = true;
      if (prev.mode === "create" && (key === "payDate" || key === "cycle")) {
        if (!prev.periodTouched) next.incomePeriod = defaultPeriod(next.payDate, next.cycle);
        else if (key === "cycle" && next.cycle !== prev.cycle && prev.incomePeriod) {
          next.incomePeriod = next.cycle === "monthly" ? prev.incomePeriod.slice(0, 7) : "";
        }
      }
      if (prev.mode === "create" && !next.noteTouched) {
        next.note = next.cycle === "monthly" && next.incomePeriod ? F.monthLabel(next.incomePeriod.slice(0, 7)) + "工资" : "";
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

  // 失焦/回车校验后维护非法集合；键入期也算一次，保证按钮即时反映。
  function markAmount(key, ok) {
    setBadKeys(function (prev) {
      var known = !!prev[key];
      if (known === !ok) return prev;
      var next = Object.assign({}, prev);
      if (ok) delete next[key];
      else next[key] = true;
      return next;
    });
  }

  // 提交前逐项复核，任何一项非法都只提示、不写库。
  function firstBadAmount() {
    var keys = F.KEYS;
    for (var i = 0; i < keys.length; i += 1) {
      var check = NF.validateNumber(form.values[keys[i]], amountRules(keys[i]));
      if (!check.ok) return { key: keys[i], error: check.error };
    }
    return null;
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
    var bad = firstBadAmount();
    if (bad) { setMsg({ kind: "error", text: F.LABELS[bad.key] + "：" + bad.error }); return; }
    var computed = F.totals(form.values);
    var payload = {
      payDate: form.payDate,
      cycle: form.cycle,
      incomePeriod: form.incomePeriod || "",
      employmentType: form.employmentType || "",
      note: form.note || "",
    };
    // 只改日期、所属期或备注时，不将金额重新提交给后端。
    var moneyChanged = !form.original || F.KEYS.some(function (key) { return F.num(form.values[key]) !== F.num(form.original[key]); });
    if (moneyChanged) F.KEYS.forEach(function (key) {
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


  // 绩效奖惩允许负数，其余金额不能为负（与后端校验口径一致）；空值表示不填。
  function amountRules(key) {
    return { min: key === "performanceBonus" ? undefined : 0, step: 0.01, allowEmpty: true, lang: lang };
  }

  function amountInput(key, disabled) {
    return h(NF.NumberField, {
      h: h, lang: lang, wide: true, className: "wbsal-amount",
      value: form.values[key], disabled: disabled, hint: false,
      min: amountRules(key).min, step: 0.01, allowEmpty: true, ariaLabel: F.LABELS[key],
      onDraft: function (raw) { setValue(key, raw); markAmount(key, NF.validateNumber(raw, amountRules(key)).ok); },
      onCommit: function (next) { setValue(key, next === null ? "" : String(next)); markAmount(key, true); },
    });
  }

  function renderModal() {
    var label = form.mode === "edit" ? "编辑工资" : "记一笔工资";
    var computed = F.totals(form.values);
    var lockedGross = form.lockGross;
    var sameDayCount = items.filter(function (item) { return item.payDate === form.payDate && item.id !== form.id; }).length;
    function groupsBlock(hh, groups) {
      return hh("div", { className: "wbsal-steps-groups" }, groups.map(function (group) {
        return hh("div", { key: group.id, className: "wbsal-form-group" },
          hh("div", { className: "wbsal-group-head" },
            hh("div", { className: "wbsal-group-title" }, group.title),
            hh("span", null, group.hint)),
          hh("div", { className: "wbsal-form-grid" }, group.keys.map(function (key) {
            return hh(C.Field, { key: key, h: hh, label: F.LABELS[key] }, amountInput(key, false));
          })));
      }));
    }
    return h(FormDialog, {
      h: h,
      React: React,
      title: label,
      eyebrow: form.mode === "edit" ? "EDIT RECORD" : "NEW RECORD",
      // 测试按步渲染校验金额控件，正常打开仍从第一步开始。
      initialStep: props.initialStep,
      submitting: saving,
      error: msg && msg.kind === "error" ? msg.text : "",
      onClose: saving ? null : closeForm,
      onSubmit: submit,
      submitText: form.mode === "edit" ? "保存修改" : "保存",
      cancelText: "取消",
      nextText: "下一步",
      backText: "上一步",
      steps: [
        {
          key: "basic",
          label: "基础信息",
          hint: "日期与归属",
          render: function (hh) {
            return hh("div", { className: "wbsal-form-meta" },
              hh(C.Field, { h: hh, label: "到账日" },
                hh(DP.DatePicker, { React: React, h: hh, prefix: "wbsal", lang: lang, label: "到账日", value: form.payDate, onChange: function (next) { setField("payDate", next); } })),
              hh(C.Field, { h: hh, label: "结算方式" },
                hh("select", { className: "wbsal-input", value: form.cycle, onChange: function (e) { setField("cycle", e.target.value); } },
                  hh("option", { value: "monthly" }, "月结"), hh("option", { value: "daily" }, "日结"))),
              hh(C.Field, { h: hh, label: "用工类型" },
                hh("select", { className: "wbsal-input", value: form.employmentType, onChange: function (e) { setField("employmentType", e.target.value); } },
                  F.EMPLOYMENT_TYPES.map(function (t) { return hh("option", { key: t.value || "none", value: t.value }, t.label); }))),
              hh(C.Field, { h: hh, label: "工资所属期" },
                hh((form.incomePeriod ? form.incomePeriod.length === 10 : form.cycle === "daily") ? DP.DatePicker : DP.MonthPicker, {
                  React: React, h: hh, prefix: "wbsal", lang: lang, label: "工资所属期",
                  placeholder: "未归属", value: form.incomePeriod || "",
                  onChange: function (next) { setField("incomePeriod", next); },
                })),
              hh(C.Field, { h: hh, label: "备注" },
                hh("input", { className: "wbsal-input", value: form.note, onChange: function (e) { setField("note", e.target.value); } })));
          },
        },
        {
          key: "amount",
          label: "金额明细",
          hint: "按分组填收入与扣款",
          render: function (hh) { return groupsBlock(hh, F.GROUPS); },
          validate: function () {
            var bad = firstBadAmount();
            return bad ? F.LABELS[bad.key] + "：" + bad.error : "";
          },
        },
        {
          key: "summary",
          label: "汇总确认",
          hint: "默认按明细实时计算",
          render: function (hh) {
            return hh("div", { className: "wbsal-steps-groups" },
              hh("div", { className: "wbsal-form-group" },
                hh("div", { className: "wbsal-group-head" },
                  hh("div", { className: "wbsal-group-title" }, "汇总"),
                  hh("span", null, "默认按明细实时计算，也可以直接改")),
                hh("div", { className: "wbsal-form-grid" },
                  hh(C.Field, { h: hh, label: "应发税前工资" }, amountInput("grossPay", lockedGross)),
                  hh(C.Field, { h: hh, label: "实发工资" }, amountInput("netPay", false)))),
              sameDayCount > 0 ? hh(C.Notice, { h: hh, text: "该日已有 " + sameDayCount + " 笔记录；保存会新增一条，不会覆盖。" }) : null,
              hh("div", { className: "wbsal-summary" },
                hh("div", null, hh("span", null, "收入合计"), hh("b", null, F.money(computed.income))),
                hh("div", null, hh("span", null, "税前扣款"), hh("b", null, F.money(computed.preTax))),
                hh("div", null, hh("span", null, "社保公积金"), hh("b", null, F.money(computed.social))),
                hh("div", null, hh("span", null, "个税+税后"), hh("b", null, F.money(computed.tax))),
                hh("div", null, hh("span", null, "应发"), hh("b", null, F.money(F.num(form.values.grossPay)))),
                hh("div", null, hh("span", null, "实发"), hh("b", null, F.money(F.num(form.values.netPay)))),
                lockedGross ? hh("div", { className: "wbsal-lock" },
                  hh("span", { className: "wbsal-muted" }, "这条历史记录只有汇总值，应发已锁定，避免被明细重算清零。"),
                  hh(C.Btn, { h: hh, onClick: recalcFromDetail }, "按明细重算")) : null));
          },
        },
      ],
    });
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
          "用工类型：" + F.employmentLabel(item.employmentType) + " · 结算方式：" + (item.cycle === "daily" ? "日结" : "月结") + " · 工资所属期：" + (item.incomePeriod ? F.monthLabel(item.incomePeriod) : "未归属") + " · " +
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
      h("td", { className: "left" }, h(C.Pill, { h: h, kind: item.cycle === "daily" ? "warn" : "ok" }, item.cycle === "daily" ? "日结" : "月结"),
        h("div", { className: "wbsal-muted" }, item.incomePeriod ? F.monthLabel(item.incomePeriod) : "未归属")),
      h("td", { className: "left" }, h(C.Pill, { h: h, kind: item.employmentType === "regular" ? "ok" : item.employmentType === "probation" ? "warn" : "" }, F.employmentLabel(item.employmentType))),
      h("td", null, h("span", { className: "wbsal-net" }, F.money(item.netPay))),
      h("td", { className: "wbsal-opt" }, F.money(item.grossPay)),
      h("td", { className: "wbsal-opt hide-md" }, F.money(F.sumValues(item, F.SOCIAL_KEYS))),
      h("td", { className: "wbsal-opt hide-md" }, F.money(item.incomeTax)),
      h("td", null, h("span", { className: "wbsal-caret" }, "›"))),
    expanded ? h("tr", { key: item.id + "-detail" }, h("td", { className: "wbsal-detail-cell", colSpan: 8 }, renderDetail(item))) : null];
    return rows;
  }

  var body;
  if (list.loading) body = h(C.Empty, { h: h, text: "加载中…" });
  else if (list.error) body = h(C.Notice, { h: h, kind: "error", text: list.error });
  else if (items.length === 0) {
    body = h("div", { className: "wbsal-empty" },
      h("div", null, filter.year || filter.cycle || filter.employmentType ? "这个筛选条件下没有记录" : "还没有工资记录，先记一笔"),
      h("div", { className: "wbsal-empty-actions" },
        filter.year || filter.cycle || filter.employmentType
          ? h(C.Btn, { h: h, onClick: function () { setFilter({ year: "", cycle: "", employmentType: "" }); } }, "清除筛选")
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
              h("th", { className: "left" }, "结算"),
              h("th", { className: "left" }, "用工类型"),
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
      h(C.Field, { h: h, label: "结算方式" }, h("select", { className: "wbsal-input", value: filter.cycle, onChange: function (e) { setFilter(Object.assign({}, filter, { cycle: e.target.value })); } },
        h("option", { value: "" }, "全部"), h("option", { value: "monthly" }, "月结"), h("option", { value: "daily" }, "日结"))),
      h(C.Field, { h: h, label: "用工类型" }, h("select", { className: "wbsal-input", value: filter.employmentType, onChange: function (e) { setFilter(Object.assign({}, filter, { employmentType: e.target.value })); } },
        h("option", { value: "" }, "全部"), F.EMPLOYMENT_TYPES.slice(1).map(function (t) { return h("option", { key: t.value, value: t.value }, t.label); }))),
      h("div", { className: "wbsal-toolbar-end" },
        h("span", { className: "wbsal-toolbar-count" }, "共 ", h("b", null, total), " 笔"),
        h(C.Btn, { h: h, kind: "primary", onClick: openCreate }, "＋ 记一笔"))),
    h(C.Notice, { h: h, kind: msg && msg.kind, text: msg && !form ? msg.text : "" }),
    body,
    form ? renderModal() : null);
};
