// 创建/重启表单独立模块；宿主相关工具由入口注入，避免循环依赖。
function initialPriority(source, origin, fallback) {
  var original = Number(origin && origin.priority);
  if (source === "2" && Number.isInteger(original) && original >= 1 && original <= 10) return original;
  var n = Number(fallback);
  return Number.isFinite(n) ? Math.min(10, Math.max(1, Math.floor(n))) : 1;
}
function clampInputPriority(value) {
  if (String(value).trim() === "" || Number(value) === 0 || !Number.isFinite(Number(value))) return value;
  return Math.min(10, Math.max(1, Math.floor(Number(value))));
}
function validatePriority(value, source, t) {
  var n = Number(value);
  return String(value).trim() !== "" && Number.isInteger(n) && n >= 1 && n <= 10 ? "" :
    (source === "2" ? t.restartPriorityError : t.activePriorityError);
}
module.exports = function createModal(deps) {
  var React = deps.React, h = React.createElement;
  var TimelinePicker = require("../timeline/timeline-controls.cjs")(React).Picker;
  var WorkspaceSelect = require("../workspace/workspace-select.cjs")(React).WorkspaceSelect;
  var difficultyField = require("../item/difficulty-field.cjs")(React);
  var ownership = require("./ownership.cjs"), fields = require("./ownership-fields.cjs")(React);
  var allTables = deps.allTables, tagNames = deps.tagNames, splitTags = deps.splitTags;
  var today = deps.today, addDays = deps.addDays, hostHasAddon = deps.hostHasAddon;
  function CreateModal(props) {
    var t = props.t, tr = require("../timeline/timeline-copy.cjs")(props.t);
    var source = String(props.source || "0");
    var origin = props.originTask || null;
    var tables = ownership.tables(props.tree);
    var initTags = origin ? tagNames(origin).join(", ") : "";
    // 每次打开都重新确认，来源任务及树选择仅作建议。
    var defaults = props.defaults || {};
    var initPriority = initialPriority(source, origin, defaults.priority);
    var initDifficulty = Math.max(0, Math.min(5, Number(defaults.difficulty) || 0));
    var initOffset = Math.floor(Number(defaults.targetOffset));
    if (!(initOffset >= 0)) initOffset = 0;
    var f = React.useState({
      title: "", description: "", timelineId: source === "1" && origin ? origin.timelineId || "" : "",
      tags: initTags, status: "0", priority: initPriority, difficulty: initDifficulty,
      publishDate: today(), targetDate: addDays(initOffset), doneDate: today(), shutdownDate: today(),
      tableId: "", newPath: false, tablePath: "", pathDescriptions: [], confirmed: false, workspaceIds: [],
    });
    var form = f[0], setForm = f[1];
    var busy = React.useState(false);
    var isBusy = busy[0], setBusy = busy[1];
    var err = React.useState("");
    var error = err[0], setError = err[1];
    var submission = React.useState({ pending: false })[0];
    function requestClose() { if (!submission.pending) props.onClose(); }
    function onModalKey(e) {
      if (e.key !== "Escape" || (e.target && e.target.closest && e.target.closest(".wbt-table-picker"))) return;
      e.preventDefault(); e.stopPropagation(); requestClose();
    }
    var active = source === "2" || form.status === "0";
    var priorityError = active ? validatePriority(form.priority, source, t) : "";

    var plan = ownership.preview(props.tree, form.tablePath, form.pathDescriptions);
    var targetValid = form.newPath ? !plan.error && form.confirmed : tables.some(function (x) { return x.id === form.tableId; });
    React.useEffect(function () {
      if (form.tableId && !tables.some(function (x) { return x.id === form.tableId; })) {
        setForm(function (prev) { return Object.assign({}, prev, { tableId: "" }); });
        setError("目标任务表已失效，请重新选择；已填写内容已保留。");
      }
    }, [props.tree, form.tableId]);
    function setMany(patch) { setForm(function (prev) { return Object.assign({}, prev, patch); }); }
    function set(k, v) {
      var next = Object.assign({}, form);
      next[k] = k === "priority" ? clampInputPriority(v) : v;
      setForm(next);
    }
    function failed(message) {
      var text = String(message || "create failed");
      if (/TABLE_NOT_FOUND|TARGET_NOT_TABLE|TREE_CORRUPT/.test(text)) setMany({ tableId: "" });
      setError(text); submission.pending = false; setBusy(false);
    }
    function capabilityError(message) {
      var reason = String(message || "归属能力检查失败");
      var upgrade = /unknown.*action|action.*not.*found|未注册|不存在.*action|未知.*action/i.test(reason);
      return new Error((upgrade ? "归属能力不可用，请完整升级任务插件与宿主并重启；已保留表单。" : "归属能力检查失败，已保留表单：") + reason);
    }
    function submit() {
      if (priorityError || isBusy || submission.pending) return;
      if (source === "2" && !(origin && origin.timelineId)) { setError(tr("请先手动建立并关联时间线，再重启")); return; }
      if (source === "1" && !form.timelineId) { setError(tr("请选择已有时间线")); return; }
      if (!String(form.title).trim()) { setError(t.needTitle); return; }
      if (!targetValid) { setError(form.newPath ? plan.error || "请确认新建路径" : t.needTable); return; }
      if (!form.publishDate || !form.targetDate) { setError(t.needDate); return; }
      submission.pending = true; setBusy(true); setError("");
      var args = {
        title: String(form.title).trim(),
        description: String(form.description || ""),
        tags: splitTags(form.tags), status: source === "2" ? "0" : String(form.status),
        priority: active ? Number(form.priority) : 0,
        difficulty: Number(form.difficulty) || 0,
        publishDate: form.publishDate,
        targetDate: form.targetDate,
        source: source === "2" ? "2" : form.timelineId ? "1" : "0",
      };
      if (form.workspaceIds && form.workspaceIds.length) args.workspaceIds = form.workspaceIds.slice();
      if (form.newPath) Object.assign(args, { tablePath: plan.parts, createMissing: true, pathDescriptions: plan.parts.map(function (_, i) { return form.pathDescriptions[i] || ""; }) });
      else args.tableId = String(form.tableId);
      if (source === "2" && origin) args.restartKey = String(origin.id);
      else if (form.timelineId) args.timelineId = form.timelineId;
      if (args.status === "2") {
        args.doneDate = form.doneDate || today();
      }
      if (args.status === "1") args.shutdownDate = form.shutdownDate || today();
      props.api.call("tasks.capabilities", { limit: 1 }).then(function (cap) {
        if (!cap || !cap.ok) throw capabilityError(cap && cap.error);
        return props.api.call("tasks.create", args);
      }, function (e) { throw capabilityError(e && e.message || e); }).then(function (r) {
        if (!r || !r.ok) { failed(r && r.error); return; }
        props.onCreated(r.result);
      }).catch(function (e) { failed(e && e.message || e); });
    }

    var title = source === "2" ? t.restartTitle : source === "1" ? tr("向已有时间线添加任务") : t.newTask;
    return h("div", { className: "wbt-modal-mask", onKeyDownCapture: onModalKey, onMouseDown: function (e) { if (e.target === e.currentTarget) requestClose(); } },
      h("div", { className: "wbt-modal" },
        h("div", { className: "wbt-modal-head" }, h("h3", null, title), h("button", { className: "wbt-icon", disabled: isBusy, onClick: requestClose }, "×")),
        source === "2" ? h("div", { className: "wbt-mhint" }, t.restartPriorityHint) : null,
        source !== "0" && origin ? h("div", { className: "wbt-mhint" }, "来源：" + (origin.title || origin.id) + (source === "2" ? tr(" · 自动继承原时间线") : "")) : null,
        source === "2" && !(origin && origin.timelineId) ? h("p", { className: "wbt-err", role: "alert" }, tr("请先手动建立并关联时间线，再重启")) : null,
        source !== "2" ? h(TimelinePicker, { api: props.api, t: t, value: form.timelineId, onChange: function (value) { set("timelineId", value); }, disabled: isBusy }) : null,
        h("div", { className: "wbt-form" },
          h("label", { className: "wbt-field full" }, h("span", null, t.titleField + " *"), h("input", { className: "wbt-input", value: form.title, onChange: function (e) { set("title", e.target.value); }, autoFocus: true })),
          h("label", { className: "wbt-field full" }, h("span", null, t.desc), h("textarea", { className: "wbt-textarea", rows: 2, value: form.description, onChange: function (e) { set("description", e.target.value); } })),
          hostHasAddon("wb-addon-tags") ? h("label", { className: "wbt-field full" }, h("span", null, t.tags), h("input", { className: "wbt-input", value: form.tags, placeholder: t.tagPlaceholder, onChange: function (e) { set("tags", e.target.value); } })) : null,
          h(WorkspaceSelect, { api: props.api, lang: props.lang, value: form.workspaceIds, onChange: function (ids) { set("workspaceIds", ids); } }),
          h("label", { className: "wbt-field" }, h("span", null, t.status), h("select", { className: "wbt-select", value: source === "2" ? "0" : form.status, disabled: source === "2", onChange: function (e) { set("status", e.target.value); } },
            h("option", { value: "0" }, "已开启"), h("option", { value: "2" }, "已完成"), h("option", { value: "1" }, "已关闭"))),
          h("label", { className: "wbt-field" }, h("span", null, t.priority + "（1–10）"), h("input", { className: "wbt-input", type: "number", min: 1, max: 10, step: 1, disabled: !active, "aria-invalid": !!priorityError, "aria-describedby": priorityError ? "wbt-create-priority-error" : undefined, value: form.priority, onChange: function (e) { set("priority", e.target.value); } })),
          fields({ form: form, set: set, setMany: setMany, tree: props.tree, recommended: props.defaultTableId || (origin && origin.tableId) }),
          h("label", { className: "wbt-field" }, h("span", null, t.publishDate), h("input", { className: "wbt-input", type: "date", value: form.publishDate, onChange: function (e) { set("publishDate", e.target.value); } })),
          h("label", { className: "wbt-field" }, h("span", null, t.targetDate), h("input", { className: "wbt-input", type: "date", value: form.targetDate, onChange: function (e) { set("targetDate", e.target.value); } })),
          (source !== "2" && form.status === "2") ? h("label", { className: "wbt-field" }, h("span", null, t.doneDate), h("input", { className: "wbt-input", type: "date", value: form.doneDate, onChange: function (e) { set("doneDate", e.target.value); } })) : null,
          difficultyField(t, form.difficulty, function (value) { set("difficulty", value); }, "wbt-create-difficulty"),
          (source !== "2" && form.status === "1") ? h("label", { className: "wbt-field" }, h("span", null, t.shutdownDate), h("input", { className: "wbt-input", type: "date", value: form.shutdownDate, onChange: function (e) { set("shutdownDate", e.target.value); } })) : null
        ),
        priorityError ? h("div", { id: "wbt-create-priority-error", className: "wbt-err", role: "alert" }, priorityError) : null,
        error ? h("div", { className: "wbt-err" }, error) : null,
        h("div", { className: "wbt-modal-foot" },
          h("button", { className: "wbt-btn ghost", disabled: isBusy, onClick: requestClose }, t.cancel),
          h("button", { className: "wbt-btn primary", disabled: isBusy || !!priorityError || !targetValid || (source === "2" && !(origin && origin.timelineId)), onClick: submit }, isBusy ? "…" : t.create)
        )
      )
    );
  }

  return CreateModal;
};