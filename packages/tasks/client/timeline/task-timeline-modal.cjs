"use strict";
module.exports = function (React, statusInfo) {
  var h = React.createElement, controls = require("./timeline-controls.cjs")(React);
  var MemberRows = require("./timeline-member-rows.cjs")(React, statusInfo);
  var splitTitle = require("./timeline-title.cjs");
  var CSS = require("./timeline-styles.cjs");
  return function TaskTimelineModal(p) {
    var tr = require("./timeline-copy.cjs")(p.t), lang = p.t && p.t.timeline === "Timeline" ? "en" : "zh";
    var ts = React.useState(p.task), task = ts[0], setTask = ts[1];
    var ms = React.useState([]), members = ms[0], setMembers = ms[1];
    var es = React.useState(""), error = es[0], setError = es[1];
    var bs = React.useState(true), busy = bs[0], setBusy = bs[1];
    var vs = React.useState(""), value = vs[0], setValue = vs[1];
    var ls = React.useState(""), selectedTitle = ls[0], setSelectedTitle = ls[1];
    var ns = React.useState(false), creating = ns[0], setCreating = ns[1];
    var rs = React.useState(0), revision = rs[0], setRevision = rs[1];
    var ds = React.useState(false), expanded = ds[0], setExpanded = ds[1];
    var cs = React.useState(null), removing = cs[0], setRemoving = cs[1];
    var ps = React.useState(1), page = ps[0], setPage = ps[1];
    var ks = React.useState(false), picking = ks[0], setPicking = ks[1];
    var dialog = React.useRef(null), pending = React.useRef(false);
    React.useEffect(function () {
      var previous = typeof document !== "undefined" ? document.activeElement : null;
      if (dialog.current) dialog.current.focus();
      return function () { if (previous && previous.isConnected && previous.focus) previous.focus(); };
    }, []);
    React.useEffect(function () {
      var cancelled = false; setBusy(true); setError("");
      p.api.call("tasks.get", { id: p.task.id }).then(controls.result).then(function (r) {
        var current = r.task;
        if (cancelled) return; setTask(current);
        return require("./timeline-members.cjs")(p.api, current).then(function (rows) {
          if (!cancelled) { setMembers(rows); setPage(function (n) { return Math.min(n, Math.max(1, Math.ceil(rows.length / 20))); }); setBusy(false); }
        });
      }).catch(function (e) { if (!cancelled) { setError(String(e.message || e)); setBusy(false); } });
      return function () { cancelled = true; };
    }, [p.api, p.task.id, revision]);
    function change(action, args) {
      if (busy || pending.current) return; pending.current = true; setBusy(true); setError("");
      p.api.call(action, args).then(controls.result).then(function () {
        pending.current = false; setValue(""); setSelectedTitle(""); setRemoving(null); setPicking(false);
        setRevision(function (n) { return n + 1; });
        if (p.onChanged) p.onChanged();
      }).catch(function (e) { pending.current = false; setError(String(e.message || e)); setBusy(false); });
    }
    function onKeyDown(e) {
      if (e.key === "Escape") { if (creating) return; e.stopPropagation(); if (removing) setRemoving(null); else p.onClose(); }
      if (e.key !== "Tab" || !dialog.current) return;
      var dialogs = dialog.current.parentElement.querySelectorAll('[role="dialog"]');
      var activeDialog = creating ? dialogs[dialogs.length - 1] : dialog.current;
      var nodes = Array.from(activeDialog.querySelectorAll('button:not(:disabled),input:not(:disabled),textarea:not(:disabled),[tabindex="0"]')).filter(function (node) { return node.getClientRects().length > 0; });
      var first = nodes[0], last = nodes[nodes.length - 1];
      if (!first) { e.preventDefault(); dialog.current.focus(); }
      else if (e.shiftKey && (document.activeElement === first || document.activeElement === dialog.current)) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
    var title = splitTitle(task.timelineTitle || tr("未命名时间线"));
    var pages = Math.max(1, Math.ceil(members.length / 20));
    var linked = !!task.timelineId;
    var showPicker = !linked || picking;
    var newButton = h("button", { type: "button", className: "wbt-btn", disabled: busy, onClick: function () { setCreating(true); } }, tr("新建时间线"));
    var summaryBlock = h("header", { className: "wbt-timeline-summary" },
      title.eyebrow ? h("div", { className: "wbt-timeline-eyebrow" }, title.eyebrow) : null,
      h("h4", null, title.title),
      h("div", { className: "wbt-desc wbt-timeline-desc" + (expanded ? " expanded" : "") }, task.timelineDescription || tr("暂无描述")),
      task.timelineDescription ? h("button", { type: "button", className: "wbt-btn ghost", "aria-expanded": expanded, onClick: function () { setExpanded(!expanded); } }, tr(expanded ? "收起描述" : "展开描述")) : null);
    var membersBlock = h("section", { className: "wbt-timeline-member-section", "aria-label": tr("成员") },
      h("div", { className: "wbt-timeline-actions" }, h("strong", null, tr("成员"), " ", members.length),
        h("button", { type: "button", className: "wbt-btn ghost", "aria-expanded": picking, disabled: busy, onClick: function () { setPicking(!picking); } }, tr(picking ? "收起更换" : "更换时间线")),
        h("button", { type: "button", className: "wbt-btn ghost", disabled: busy, onClick: function () { setRemoving(task); } }, tr("移出当前任务")),
        h("button", { type: "button", className: "wbt-btn", disabled: busy, onClick: function () { p.onCreateTimeline(task); } }, tr("添加新任务"))),
      removing ? h("div", { className: "wbt-timeline-confirm", role: "alert" },
        h("p", null, tr("确认移出任务？"), " ", removing.title, " · ", tr("仅解除关联，任务仍保留。")),
        h("div", { className: "wbt-timeline-actions" },
          h("button", { type: "button", className: "wbt-btn", disabled: busy, onClick: function () { setRemoving(null); } }, tr("取消")),
          h("button", { type: "button", className: "wbt-btn wbt-act-del", disabled: busy, onClick: function () { change("taskTimelines.detach", { taskId: removing.id }); } }, tr("确认移出")))) : null,
      h("div", { className: "wbt-timeline-member-scroll" }, members.length ? h(MemberRows, { rows: members.slice((page - 1) * 20, page * 20), lang: lang, disabled: busy, onOpen: p.onOpen, onRemove: setRemoving }) : h("p", { className: "wbt-empty" }, tr("暂无可显示成员"))),
      h("div", { className: "wbt-timeline-pager" }, h("span", null, tr("按发布时间正序排列")),
        h("button", { type: "button", className: "wbt-btn", disabled: busy || page <= 1, onClick: function () { setPage(page - 1); } }, tr("上一页")),
        h("span", null, page + " / " + pages),
        h("button", { type: "button", className: "wbt-btn", disabled: busy || page >= pages, onClick: function () { setPage(page + 1); } }, tr("下一页"))));
    var linkedBody = h(React.Fragment, null, summaryBlock, membersBlock);
    var unlinkedBody = h("div", { className: "wbt-timeline-empty" }, h("strong", null, tr("当前未关联时间线")), h("p", null, tr("选择已有时间线，或新建一条；关闭弹窗不会自动关联。")));
    var attachButton = h("button", { type: "button", className: "wbt-btn primary", disabled: busy || !value, title: busy ? tr("加载中…") : !value ? tr("请选择已有时间线；无匹配时可新建") : selectedTitle, onClick: function () { change("taskTimelines.attach", { taskId: task.id, timelineId: value }); } }, tr("关联所选时间线"));
    return h("div", { className: "wbt-modal-mask", onKeyDown: onKeyDown },
      h("style", null, CSS),
      h("div", { ref: dialog, tabIndex: -1, className: "wbt-modal wide wbt-timeline-modal", role: "dialog", "aria-modal": true, "aria-label": tr("任务时间线") },
        h("div", { className: "wbt-modal-head" }, h("h3", null, tr("任务时间线")), h("button", { type: "button", className: "wbt-icon", "aria-label": tr("关闭"), onClick: p.onClose }, "×")),
        h("div", { className: "wbt-timeline-modal-body", "aria-busy": busy },
          error ? h("p", { className: "wbt-err", role: "alert" }, error, h("button", { type: "button", className: "wbt-btn", onClick: function () { setRevision(revision + 1); } }, tr("重试"))) : null,
          busy && !members.length ? h("p", { role: "status" }, tr("加载中…")) : null,
          linked ? linkedBody : unlinkedBody,
          showPicker ? h("section", { className: "wbt-timeline-pick", "aria-label": tr("选择已有时间线") },
            h(controls.Picker, { api: p.api, t: p.t, value: value, title: selectedTitle, onChange: function (id, label) { setValue(id); setSelectedTitle(label || ""); }, disabled: busy })) : null),
        h("div", { className: "wbt-modal-foot wbt-timeline-actions" },
          h("span", { className: "wbt-timeline-selected", role: "status" }, value ? tr("已选时间线") + "：" + (selectedTitle || value) : linked ? tr("更换或移出时间线") : tr("尚未选择时间线")),
          newButton,
          showPicker ? attachButton : null)),
      creating ? h(controls.Editor, { api: p.api, t: p.t, onClose: function () { setCreating(false); if (dialog.current) dialog.current.focus(); }, onSaved: function (line) { setCreating(false); setValue(line.timelineId || line.id || line.timelineKey); setSelectedTitle(line.title || ""); if (dialog.current) dialog.current.focus(); } }) : null);
  };
};
