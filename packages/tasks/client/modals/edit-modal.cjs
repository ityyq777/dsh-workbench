// 编辑任务独立组件；依赖由入口注入，保持原有 props 接口，无循环依赖。
"use strict";
var NF = require("../../../lib/number-field.cjs");
module.exports = function createEditModal(React, statusInfo, stars) {
  var h = React.createElement;
  var difficultyField = require("../item/difficulty-field.cjs")(React);
  var WorkspaceSelect = require("../workspace/workspace-select.cjs")(React).WorkspaceSelect;
  var ownership = require("./ownership.cjs"), fields = require("./ownership-fields.cjs")(React);
  var DP = require("../../../lib/date-picker.cjs");
  // 任务编辑弹窗：按状态收敛可编辑字段。
  // 所有状态均可编辑难度；0/null 表示未设置。
  // 已完成（2）：标题、描述、感受、难度；优先级完成即清零，不再可改。
  function EditModal(props) {
    var t = props.t;
    var task = props.task;
    var done = String(task.status) === "2";
    var canPriority = !done;
    var fs = React.useState({
      tableId: "",
      title: String(task.title || ""),
      description: String(task.description || ""),
      review: String(task.review || ""),
      priority: String(task.priority === null || task.priority === undefined ? 0 : task.priority),
      difficulty: Number(task.difficulty || 0),
      targetDate: String(task.targetDate || ""),
      workspaceIds: (task.workspaces || []).map(function (w) { return String(w.id); }),
    });
    var form = fs[0], setForm = fs[1];
    var bs = React.useState(false);
    var isBusy = bs[0], setBusy = bs[1];
    var es = React.useState("");
    var err = es[0], setErr = es[1];
    var submission = React.useState({ pending: false })[0];
    function requestClose() { if (!submission.pending) props.onClose(); }
    function onModalKey(e) {
      if (e.key !== "Escape" || (e.target && e.target.closest && e.target.closest(".wbt-table-picker"))) return;
      e.preventDefault(); e.stopPropagation(); requestClose();
    }
    function failed(message) {
      var text = String(message || "update failed");
      if (/TABLE_NOT_FOUND|TARGET_NOT_TABLE|TREE_CORRUPT/.test(text)) set("tableId", "");
      submission.pending = false; setBusy(false); setErr(text);
    }
    React.useEffect(function () {
      if (form.tableId && !ownership.tables(props.tree).some(function (x) { return x.id === form.tableId; })) {
        setForm(function (prev) { return Object.assign({}, prev, { tableId: "" }); });
        setErr("所选目标已失效，已清空；请重新选择纠正目标。");
      }
    }, [props.tree, form.tableId]);
    function set(k, v) {
      setForm(function (prev) { var next = Object.assign({}, prev); next[k] = v; return next; });
    }
    var titleOk = String(form.title).trim().length > 0;
    // 优先级 1–10 整数、难度 0–5 半档：只提示，不夹取；非法时禁止保存。
    // 已关闭任务的优先级由后端清零，编辑时保留 0 合法，避免一改标题就被迫抬高优先级。
    var priorityCheck = canPriority
      ? NF.validateNumber(form.priority, { min: String(task.status) === "1" ? 0 : 1, max: 10, integer: true, lang: props.lang })
      : { ok: true, value: 0, error: "" };
    var difficultyCheck = NF.validateNumber(form.difficulty, { min: 0, max: 5, step: 0.5, allowEmpty: true, lang: props.lang });
    function submit() {
      if (isBusy || submission.pending) return;
      if (!titleOk) { setErr(t.needTitle); return; }
      if (!priorityCheck.ok) { setErr(priorityCheck.error); return; }
      if (!difficultyCheck.ok) { setErr(difficultyCheck.error); return; }
      var patch = { id: task.id, title: String(form.title).trim(), description: String(form.description || "") };
      if (form.tableId && form.tableId !== String(task.tableId || "")) {
        if (!ownership.tables(props.tree).some(function (x) { return x.id === form.tableId; })) { setErr("目标已失效，请重新选择"); return; }
        patch.tableId = form.tableId;
      }
      if (canPriority) {
        patch.priority = priorityCheck.value;
        // 计划完成日期只处理非空值；留空表示不改动（后端空串会回落到原值）。
        if (String(form.targetDate || "").trim()) patch.targetDate = String(form.targetDate).trim();
      }
      patch.difficulty = difficultyCheck.value || 0;
      patch.workspaceIds = (form.workspaceIds || []).slice();
      if (String(form.review) !== String(task.review || "")) patch.review = String(form.review);
      submission.pending = true; setBusy(true);
      setErr("");
      props.api.call("tasks.update", patch).then(function (r) {
        setBusy(false);
        if (r && r.ok) props.onSaved(r.result);
        else failed(r && r.error);
      }).catch(function (e) { failed((e && e.message) || e); });
    }
    var st = statusInfo(task.status);
    return h("div", { className: "wbt-modal-mask", onKeyDownCapture: onModalKey, onMouseDown: function (e) { if (e.target === e.currentTarget) requestClose(); } },
      h("div", { className: "wbt-modal" },
        h("div", { className: "wbt-modal-head" },
          h("h3", null, t.editTitle),
          h("span", { className: "wbt-badge " + st.cls }, props.lang === "en" ? st.en : st.zh),
          h("button", { className: "wbt-icon", disabled: isBusy, onClick: requestClose }, "×")
        ),
        h("div", { className: "wbt-mhint" }, done ? t.editHintDone : t.editHintOpen),
        fields({ edit: true, form: form, set: set, tree: props.tree, currentId: task.tableId, current: (ownership.tables(props.tree).find(function (x) { return x.id === String(task.tableId); }) || {}).path || (Array.isArray(task.pathSegments) ? task.pathSegments.map(function (x) { return x.name || x; }).join(" / ") : task.tablePath || task.tableName || "原任务表已不可用") }),
        h("label", { className: "wbt-field" },
          h("span", null, t.titleField + " *"),
          h("input", { className: "wbt-input", value: form.title, autoFocus: true, onChange: function (e) { set("title", e.target.value); } })
        ),
        h("label", { className: "wbt-field" },
          h("span", null, t.desc),
          h("textarea", { className: "wbt-textarea", rows: 4, value: form.description, onChange: function (e) { set("description", e.target.value); } })
        ),
        h("label", { className: "wbt-field" },
          h("span", null, t.review + " · " + t.reviewHint),
          h("textarea", { className: "wbt-textarea", rows: 3, placeholder: t.reviewPlaceholder, value: form.review, onChange: function (e) { set("review", e.target.value); } })
        ),
        canPriority ? h("label", { className: "wbt-field" },
          h("span", null, t.targetDate),
          h(DP.DatePicker, { React: React, h: h, prefix: "wbt", lang: props.lang, label: t.targetDate, value: form.targetDate, onChange: function (next) { set("targetDate", next); } })
        ) : null,
        canPriority ? h("div", { className: "wbt-field" },
          h("span", { className: "wbt-field-label" }, t.priority + "（1–10）"),
          h(NF.NumberField, { h: h, lang: props.lang, value: form.priority, min: 1, max: 10, integer: true, hint: false, ariaLabel: t.priority,
            // 键入即写草稿，合法性交给 priorityCheck（保存按钮据此禁用），绝不夹取。
            onDraft: function (raw) { set("priority", raw); },
            onCommit: function (next) { set("priority", String(next)); } })
        ) : null,
        difficultyField(t, form.difficulty, function (value) { set("difficulty", value); }, "wbt-edit-difficulty", props.lang),
        h(WorkspaceSelect, { api: props.api, lang: props.lang, value: form.workspaceIds, onChange: function (ids) { set("workspaceIds", ids); } }),
        err ? h("div", { className: "wbt-err" }, err) : null,
        h("div", { className: "wbt-modal-foot" },
          h("button", { className: "wbt-btn ghost", disabled: isBusy, onClick: requestClose }, t.cancel),
          h("button", { className: "wbt-btn primary", disabled: isBusy || !titleOk || !priorityCheck.ok || !difficultyCheck.ok, onClick: submit }, isBusy ? "…" : t.save)
        )
      )
    );
  }

  return EditModal;
};