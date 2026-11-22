// 创建/重启表单独立模块；宿主相关工具由入口注入，避免循环依赖。
// 版式走共享分阶段外壳（lib/staged-dialog.cjs + lib/stepper.cjs）：
// 内容（含计划字段）→ 标签 → 任务表 → 时间线 → 工作区，
// 每一步只放一组信息，保存前再整体复核。
var NF = require("../../../lib/number-field.cjs");
var staged = require("../../../lib/staged-dialog.cjs");
var FilterChecklist = require("../../../lib/filter-checklist.cjs");

// 这里只是把「默认值」（配置/来源任务）归一成合法初值，不涉及用户键入；
// 用户键入的值一律原样保留，只在提交时校验。
function initialPriority(source, origin, fallback) {
  var original = Number(origin && origin.priority);
  if (source === "2" && Number.isInteger(original) && original >= 1 && original <= 10) return original;
  var n = Number(fallback);
  return Number.isFinite(n) ? Math.min(10, Math.max(1, Math.floor(n))) : 1;
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
  var DP = require("../../../lib/date-picker.cjs");
  var allTables = deps.allTables, tagNames = deps.tagNames, splitTags = deps.splitTags;
  var today = deps.today, addDays = deps.addDays, hostHasAddon = deps.hostHasAddon;
  // 分阶段对话框：外壳换行、Esc/遮罩关闭与焦点循环都交给共享层，
  // 忙时禁止关闭，避免保存中被 Esc 打断。
  var StagedDialog = staged.createStagedDialog({
    React: React, tag: "div", displayName: "TaskCreateDialog",
    maskClass: "wbt-modal-mask", dialogClass: "wbt-modal",
    header: function (p) {
      return h("div", { className: "wbt-modal-head" },
        h("h3", null, p.title),
        h("button", { type: "button", className: "wbt-icon", disabled: !!p.submitting, onClick: p.onClose, "aria-label": p.closeLabel }, "×"));
    },
    closeOnEscape: function (p) { return !p.submitting; },
    closeOnMask: function (p) { return !p.submitting; },
    // 表选择器内部自己用 Esc 收面板，别把它一起关掉。
    onKeyDown: function (e) {
      if (e.key === "Escape" && e.target && e.target.closest && e.target.closest(".wbt-table-picker")) {
        e.stopPropagation();
        return true;
      }
      return false;
    },
  });
  function CreateModal(props) {
    var t = props.t, tr = require("../timeline/timeline-copy.cjs")(props.t);
    var source = String(props.source || "0");
    var origin = props.originTask || null;
    var tables = ownership.tables(props.tree);
    var initTags = origin ? tagNames(origin).join(", ") : "";
    // 每次打开都重新确认，来源任务及树选择仅作建议。
    var defaults = props.defaults || {};
    var initPriority = initialPriority(source, origin, defaults.priority);
    // 配置里的默认难度同样只做初值归一，用户之后键入的值不再夹取。
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
    var active = source === "2" || form.status === "0";
    var priorityError = active ? validatePriority(form.priority, source, t) : "";
    // 难度沿用「留空=未设置」，但非法键入（越界/非数字）只提示、不允许保存。
    var difficultyCheck = NF.validateNumber(form.difficulty, { min: 0, max: 5, step: 0.5, allowEmpty: true, lang: props.lang });

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
      next[k] = v;
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
      if (!difficultyCheck.ok) { setError(difficultyCheck.error); return; }
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
        difficulty: difficultyCheck.value || 0,
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
    var timelineSection = h("div", { className: "wbt-create-tl full" },
      h("div", { className: "wbt-create-tl-head" },
        h("span", null, t.timeline),
        source === "1" ? h("span", { className: "wbt-create-tl-hint" }, tr("向已有时间线添加任务")) : null),
      h(TimelinePicker, { api: props.api, t: t, value: form.timelineId, onChange: function (value) { set("timelineId", value); }, disabled: isBusy })
    );

    // 第一步同时承担「内容」与「计划」：标题、描述、状态、优先级、难度与日期都在这屏。
    function stepContent(h2) {
      return h2("div", { className: "wbctl-form" },
        origin ? h2("div", { className: "wbt-mhint full" },
          "来源：" + (origin.title || origin.id) + (source === "2" ? tr(" · 自动继承原时间线") : "")) : null,
        h2("label", { className: "wbt-field full" }, h2("span", null, t.titleField + " *"),
          h2("input", { className: "wbt-input", value: form.title, onChange: function (e) { set("title", e.target.value); } })),
        h2("label", { className: "wbt-field full" }, h2("span", null, t.desc),
          h2("textarea", { className: "wbt-textarea", rows: 3, value: form.description, onChange: function (e) { set("description", e.target.value); } })),
        source === "2" ? h2("div", { className: "wbt-mhint full" }, t.restartPriorityHint) : null,
        h2("label", { className: "wbt-field" }, h2("span", null, t.status),
          h2("select", { className: "wbt-select", value: source === "2" ? "0" : form.status, disabled: source === "2", onChange: function (e) { set("status", e.target.value); } },
            h2("option", { value: "0" }, "已开启"), h2("option", { value: "2" }, "已完成"), h2("option", { value: "1" }, "已关闭"))),
        h2("div", { className: "wbt-field" }, h2("span", { className: "wbt-field-label" }, t.priority + "（1–10）"),
          h2(NF.NumberField, { h: h2, lang: props.lang, value: form.priority, min: 1, max: 10, integer: true, disabled: !active, hint: false, ariaLabel: t.priority,
            // 键入即写入草稿；合法性由下面的 priorityError 实时判定，绝不回写夹取后的值。
            onDraft: function (raw) { set("priority", raw); },
            onCommit: function (next) { set("priority", String(next)); } })),
        priorityError ? h2("div", { className: "wbt-err full", role: "alert" }, priorityError) : null,
        difficultyField(t, form.difficulty, function (value) { set("difficulty", value); }, "wbt-create-difficulty", props.lang),
        h2("label", { className: "wbt-field" }, h2("span", null, t.publishDate),
          h2(DP.DatePicker, { React: React, h: h2, prefix: "wbt", lang: props.lang, label: t.publishDate, value: form.publishDate, onChange: function (next) { set("publishDate", next); } })),
        h2("label", { className: "wbt-field" }, h2("span", null, t.targetDate),
          h2(DP.DatePicker, { React: React, h: h2, prefix: "wbt", lang: props.lang, label: t.targetDate, value: form.targetDate, onChange: function (next) { set("targetDate", next); } })),
        (source !== "2" && form.status === "2") ? h2("label", { className: "wbt-field" }, h2("span", null, t.doneDate),
          h2(DP.DatePicker, { React: React, h: h2, prefix: "wbt", lang: props.lang, label: t.doneDate, value: form.doneDate, onChange: function (next) { set("doneDate", next); } })) : null,
        (source !== "2" && form.status === "1") ? h2("label", { className: "wbt-field" }, h2("span", null, t.shutdownDate),
          h2(DP.DatePicker, { React: React, h: h2, prefix: "wbt", lang: props.lang, label: t.shutdownDate, value: form.shutdownDate, onChange: function (next) { set("shutdownDate", next); } })) : null);
    }
    // 标签选择：搜索走 tasks.tagOptions（200ms 防抖 + 触底加载），清单用共享 FilterChecklist；
    // 草稿仍是一行逗号分隔文本，提交时才 splitTags，所以新建标签直接输名字即可。
    function TagPicker(p2) {
      var h2 = p2.h;
      var names = splitTags(p2.value);
      var qs = React.useState(""), query = qs[0], setQuery = qs[1];
      var rs = React.useState([]), rows = rs[0], setRows = rs[1];
      var ts = React.useState(0), total = ts[0], setTotal = ts[1];
      var ps = React.useState(1), page = ps[0], setPage = ps[1];
      var hs = React.useState(false), hasMore = hs[0], setHasMore = hs[1];
      var ls = React.useState(false), loading = ls[0], setLoading = ls[1];
      var ds = React.useState(""), draft = ds[0], setDraft = ds[1];
      var seq = React.useRef(0);
      React.useEffect(function () {
        var mine = ++seq.current;
        setLoading(true);
        var timer = setTimeout(function () {
          p2.api.call("tasks.tagOptions", { query: query, pageNumber: 1, pageSize: 30 }).then(function (r) {
            if (mine !== seq.current) return;
            var out = r && r.ok ? r.result : {};
            var list = out.tags || [];
            setRows(list); setTotal(out.total || list.length); setPage(1); setHasMore(!!out.hasMore); setLoading(false);
          }).catch(function () {
            if (mine !== seq.current) return;
            setRows([]); setTotal(0); setHasMore(false); setLoading(false);
          });
        }, 200);
        return function () { clearTimeout(timer); };
      }, [p2.api, query]);
      function loadMore() {
        if (loading || !hasMore) return;
        var mine = seq.current, next = page + 1;
        setLoading(true);
        p2.api.call("tasks.tagOptions", { query: query, pageNumber: next, pageSize: 30 }).then(function (r) {
          if (mine !== seq.current) return;
          var out = r && r.ok ? r.result : {};
          setRows(rows.concat(out.tags || [])); setPage(next); setHasMore(!!out.hasMore); setLoading(false);
        }).catch(function () { if (mine === seq.current) setLoading(false); });
      }
      function emit(next) { p2.onChange(next.join(", ")); }
      function toggle(name) {
        emit(names.indexOf(name) >= 0 ? names.filter(function (x) { return x !== name; }) : names.concat([name]));
      }
      function toggleId(id) {
        var row = rows.filter(function (x) { return String(x.id) === String(id); })[0];
        if (row) toggle(String(row.name));
      }
      function addDraft() {
        var parts = splitTags(draft);
        if (!parts.length) return;
        var next = names.slice();
        parts.forEach(function (name2) { if (next.indexOf(name2) < 0) next.push(name2); });
        emit(next); setDraft("");
      }
      var selectedIds = rows.filter(function (x) { return names.indexOf(String(x.name)) >= 0; }).map(function (x) { return String(x.id); });
      return h2("div", { className: "wbt-tagpick" },
        names.length ? h2("div", { className: "wbt-tagchips", role: "group", "aria-label": t.tagSelected }, names.map(function (name2) {
          return h2("button", { key: name2, type: "button", className: "wbt-tagchip", title: t.tagRemove, onClick: function () { toggle(name2); } },
            h2("span", null, name2), h2("span", { className: "wbt-tagchip-x", "aria-hidden": true }, "×"));
        })) : h2("p", { className: "wbctl-note" }, t.tagNoPick),
        h2(FilterChecklist, {
          items: rows.map(function (x) { return { id: String(x.id), name: x.name, meta: x.total }; }),
          selected: selectedIds, onToggle: toggleId, onClear: function () { emit([]); },
          query: query, onQuery: setQuery, loading: loading, hasMore: hasMore, onLoadMore: loadMore, total: total,
          title: t.allTags || "全部标签", selectedText: t.tagSelected || "已选", clearText: t.clear || "清空",
          searchPlaceholder: t.tagSearchExisting || "搜索已有标签", emptyText: t.noTags || "暂无标签",
          noMatchText: t.tagNoMatch || "没有匹配的标签", loadingText: t.loadingMore || "加载中…", noMoreText: t.noMore || "没有更多",
          autoFocus: false,
        }),
        h2("div", { className: "wbt-tagnew" },
          h2("input", { className: "wbt-input", value: draft, placeholder: t.tagNewPlaceholder, "aria-label": t.tagNewPlaceholder,
            onChange: function (e) { setDraft(e.target.value); },
            onKeyDown: function (e) { if (e.key === "Enter") { e.preventDefault(); addDraft(); } } }),
          h2("button", { type: "button", className: "wbt-btn", disabled: !splitTags(draft).length, onClick: addDraft }, t.tagAdd || "添加")));
    }
    function stepTags(h2) {
      // 标签步只放选择器本身：顶上已经写了「标签」标题，再加一行「多个用逗号分隔」的旧说明
      // 既跟现在的勾选清单对不上，也白占一屏高度。
      return h2("div", { className: "wbctl-form" },
        h2("div", { className: "full" }, h2(TagPicker, { h: h2, api: props.api, t: t, value: form.tags, onChange: function (next) { set("tags", next); } })));
    }
    function stepTable(h2) {
      return h2("div", { className: "wbctl-form" },
        h2("div", { className: "full" },
          fields({ form: form, set: set, setMany: setMany, tree: props.tree, recommended: props.defaultTableId || (origin && origin.tableId) })));
    }
    function stepTimeline(h2) {
      if (source === "2") {
        return h2("div", { className: "wbctl-form" },
          h2("p", { className: "wbt-mhint full" }, tr("继承来源任务的时间线")),
          !(origin && origin.timelineId) ? h2("p", { className: "wbt-err full", role: "alert" }, tr("请先手动建立并关联时间线，再重启")) : null);
      }
      return h2("div", { className: "wbctl-form" }, timelineSection);
    }
    function stepWorkspace(h2) {
      return h2("div", { className: "wbctl-form" },
        h2(WorkspaceSelect, { api: props.api, lang: props.lang, value: form.workspaceIds, onChange: function (ids) { set("workspaceIds", ids); } }));
    }
    var steps = [
      {
        key: "content", label: t.stepContent, hint: t.stepContentHint, render: stepContent,
        validate: function () {
          if (!String(form.title).trim()) return t.needTitle;
          if (priorityError) return priorityError;
          if (!difficultyCheck.ok) return difficultyCheck.error;
          if (!form.publishDate || !form.targetDate) return t.needDate;
          return "";
        },
      },
    ];
    if (hostHasAddon("wb-addon-tags")) {
      steps.push({ key: "tags", label: t.stepTags, hint: t.stepTagsHint, render: stepTags });
    }
    steps.push({
      key: "table", label: t.stepTable, hint: t.stepTableHint, render: stepTable,
      validate: function () { return targetValid ? "" : (form.newPath ? plan.error || "请确认新建路径" : t.needTable); },
    });
    steps.push({
      key: "timeline", label: t.stepTimeline, hint: t.stepTimelineHint, render: stepTimeline,
      validate: function () {
        if (source === "2" && !(origin && origin.timelineId)) return tr("请先手动建立并关联时间线，再重启");
        if (source === "1" && !form.timelineId) return tr("请选择已有时间线");
        return "";
      },
    });
    steps.push({ key: "workspace", label: t.stepWorkspace, hint: t.stepWorkspaceHint, render: stepWorkspace });

    return h(StagedDialog, {
      title: title, closeLabel: t.cancel, steps: steps,
      submitting: isBusy, error: error,
      onClose: requestClose, onSubmit: submit,
      submitText: t.create, cancelText: t.cancel, nextText: t.nextStep || "下一步", backText: t.prevStep || "上一步",
      stepsLabel: t.createSteps || "创建步骤",
    });
  }

  return CreateModal;
};
