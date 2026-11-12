// Timeline navigation keeps its list mounted while independently paging members.
"use strict";
module.exports = function (deps) {
  var React = deps.React, h = React.createElement, COPY = deps.COPY;
  var controls = require("../timeline/timeline-controls.cjs")(React), AddMembers = require("../timeline/timeline-add-members.cjs")(React);
  var Merge = require("../timeline/timeline-merge.cjs")(React);
  var CSS = require("../timeline/timeline-styles.cjs");
  var MemberRows = require("../timeline/timeline-member-rows.cjs")(React, deps.statusInfo);
  var splitTitle = require("../timeline/timeline-title.cjs");
  var Highlight = require("../ui/highlight.cjs")(React);
  function result(r) { if (!r || !r.ok) throw new Error(r && r.error || "Request failed"); return r.result; }
  function pageData(r) { return { records: r.records || [], total: Number(r.total) || 0 }; }
  function Pager(p) {
    return h("nav", { className: "wbt-timeline-pager", "aria-label": p.label },
      h("button", { className: "wbt-btn", disabled: p.busy || p.page <= 1, onClick: function () { p.set(p.page - 1); }, "aria-label": p.t.timelinePrevious }, "‹"),
      h("span", null, p.t.page + " " + p.page + " / " + Math.max(1, Math.ceil(p.total / 20)) + " · " + p.t.total + " " + p.total),
      h("button", { className: "wbt-btn", disabled: p.busy || p.page * 20 >= p.total, onClick: function () { p.set(p.page + 1); }, "aria-label": p.t.timelineNext }, "›"));
  }
  function TimelineView(props) {
    var lang = props.lang === "en" ? "en" : "zh", t = COPY[lang], api = props.api;
    var tr = require("../timeline/timeline-copy.cjs")(t);
    var queryS = React.useState(""), query = queryS[0], setQuery = queryS[1];
    var draftS = React.useState(""), draft = draftS[0], setDraft = draftS[1];
    var singleS = React.useState(true), single = singleS[0], setSingle = singleS[1];
    var pageS = React.useState(1), page = pageS[0], setPage = pageS[1];
    var dataS = React.useState({ records: [], total: 0 }), data = dataS[0], setData = dataS[1];
    var busyS = React.useState(true), busy = busyS[0], setBusy = busyS[1];
    var errorS = React.useState(""), error = errorS[0], setError = errorS[1];
    var activeS = React.useState(null), active = activeS[0], setActive = activeS[1];
    var memberPageS = React.useState(1), memberPage = memberPageS[0], setMemberPage = memberPageS[1];
    var membersS = React.useState({ records: [], total: 0 }), members = membersS[0], setMembers = membersS[1];
    var memberBusyS = React.useState(false), memberBusy = memberBusyS[0], setMemberBusy = memberBusyS[1];
    var memberErrorS = React.useState(""), memberError = memberErrorS[0], setMemberError = memberErrorS[1];
    var refreshS = React.useState(0), refresh = refreshS[0], setRefresh = refreshS[1];
    var multiS = React.useState(false), multi = multiS[0], setMulti = multiS[1];
    var selectedS = React.useState([]), selected = selectedS[0], setSelected = selectedS[1];
    var mergeS = React.useState(false), merge = mergeS[0], setMerge = mergeS[1];
    var detailS = React.useState(null), detail = detailS[0], setDetail = detailS[1];
    var treeS = React.useState([]), tree = treeS[0], setTree = treeS[1];
    var listRef = React.useRef(null), mergeButton = React.useRef(null), detailTrigger = React.useRef(null);
    var createdRef = React.useRef(null);
    var activeKey = active && active.timelineKey;
    var heading = splitTitle(active && active.title);
    var editorS = React.useState(null), editor = editorS[0], setEditor = editorS[1];
    var addS = React.useState(false), adding = addS[0], setAdding = addS[1];
    var deleteS = React.useState(false), deleting = deleteS[0], setDeleting = deleteS[1];
    var writeS = React.useState(false), writing = writeS[0], setWriting = writeS[1];
    React.useEffect(function () { deps.injectCss(); }, []);
    React.useEffect(function () {
      var cancelled = false; setBusy(true); setError("");
      api.call("tasks.timelines", { titleKey: query, includeSingletons: single, pageNumber: page, pageSize: 20 }).then(result).then(function (r) {
        if (cancelled) return;
        var next = pageData(r); setData(next); setBusy(false);
        if (page > 1 && !next.records.length) { setPage(Math.max(1, Math.ceil(next.total / 20))); return; }
        setActive(function (old) { var created = createdRef.current; createdRef.current = null; return next.records.find(function (x) { return (created || old) && x.timelineKey === (created || old).timelineKey; }) || created || next.records[0] || null; });
      }).catch(function (e) { if (!cancelled) { setBusy(false); setError(String(e.message || e)); } });
      return function () { cancelled = true; };
    }, [api, query, single, page, refresh]);
    React.useEffect(function () { setMemberPage(1); }, [activeKey]);
    React.useEffect(function () {
      var cancelled = false; setMemberError(""); setMembers({ records: [], total: 0 });
      if (!activeKey) { setMemberBusy(false); return; }
      setMemberBusy(true);
      api.call("tasks.timeline", { timelineKey: activeKey, pageNumber: memberPage, pageSize: 20 }).then(result).then(function (r) {
        if (cancelled) return; var next = pageData(r); setMembers(next); setMemberBusy(false);
        if (memberPage > 1 && !next.records.length) setMemberPage(Math.max(1, Math.ceil(next.total / 20)));
      }).catch(function (e) { if (!cancelled) { setMemberBusy(false); setMemberError(String(e.message || e)); } });
      return function () { cancelled = true; };
    }, [api, activeKey, memberPage, refresh]);
    React.useEffect(function () {
      if (!detail) return; var cancelled = false;
      api.call("taskNodes.tree", {}).then(result).then(function (r) { if (!cancelled) setTree(Array.isArray(r) ? r : []); }).catch(function () {});
      return function () { cancelled = true; };
    }, [api, !!detail]);
    function reload() { setRefresh(function (n) { return n + 1; }); }
    function choose(item, toggle) {
      if (busy) return;
      setActive(item); setMemberPage(1);
      if (toggle && item.taskCount > 0) setSelected(function (old) { return old.some(function (x) { return x.timelineKey === item.timelineKey; }) ? old.filter(function (x) { return x.timelineKey !== item.timelineKey; }) : old.concat(item); });
    }
    function keyboard(e, index) {
      if (e.target.type === "checkbox") return;
      var next = index;
      if (e.key === "ArrowDown") next = Math.min(data.records.length - 1, index + 1);
      else if (e.key === "ArrowUp") next = Math.max(0, index - 1);
      else if (e.key === "Home") next = 0;
      else if (e.key === "End") next = data.records.length - 1;
      else if (e.key === " " || e.key === "Enter") { e.preventDefault(); choose(data.records[index], multi); return; }
      else return;
      e.preventDefault(); choose(data.records[next], false);
      var node = listRef.current && listRef.current.querySelectorAll('[role="option"]')[next];
      if (node) { node.focus({ preventScroll: true }); node.scrollIntoView({ block: "nearest" }); }
    }
    function closeDetail() { setDetail(null); if (detailTrigger.current) detailTrigger.current.focus({ preventScroll: true }); }
    function closeMerge() { setMerge(false); if (mergeButton.current) mergeButton.current.focus({ preventScroll: true }); }
    return h("div", { className: "wbt-root wbt-timeline-view" }, h("style", null, CSS),
      h("div", { className: "wbt-timeline-toolbar" },
        h("div", { className: "wbt-timeline-toolbar-main" },
          h("form", { className: "wbt-timeline-search", onSubmit: function (e) { e.preventDefault(); setPage(1); setQuery(draft.trim()); } },
            h("input", { className: "wbt-input", value: draft, "aria-label": t.timelineSearch, placeholder: t.timelineSearch, onChange: function (e) { setDraft(e.target.value); } }),
            h("button", { className: "wbt-btn", type: "submit" }, t.timelineSearchButton)),
          h("label", { className: "wbt-timeline-single" }, h("input", { type: "checkbox", "aria-label": t.timelineSingletons, checked: single, onChange: function (e) { setSingle(e.target.checked); setPage(1); } }), t.timelineSingletons)),
        h("div", { className: "wbt-timeline-toolbar-actions" },
          h("button", { className: "wbt-btn primary", onClick: function () { setEditor({}); } }, tr("新建时间线")),
          h("button", { className: "wbt-btn", onClick: function () { setMulti(!multi); setSelected([]); }, "aria-pressed": multi }, multi ? t.cancelSelect : t.select),
          multi ? h("button", { ref: mergeButton, className: "wbt-btn", disabled: selected.length < 2 || busy, onClick: function () { setMerge(true); } }, t.timelineMerge + " (" + selected.length + ")") : null,
          h("button", { className: "wbt-btn", disabled: busy, onClick: reload }, t.refresh))),
      h("div", { className: "wbt-timeline-columns" },
        h("section", { className: "wbt-timeline-left", "aria-label": t.timeline },
          error ? h("p", { role: "alert", className: "wbt-err" }, t.error + error) : null,
          h("div", { ref: listRef, className: "wbt-timeline-list", role: "listbox", "aria-label": t.timeline, "aria-multiselectable": multi, "aria-busy": busy }, data.records.map(function (item, i) {
            var excerpt = String(item.description || "").trim().split(/\r?\n/)[0];
            var isActive = activeKey === item.timelineKey, checked = selected.some(function (x) { return x.timelineKey === item.timelineKey; });
            return h("div", { key: item.timelineKey, role: "option", tabIndex: isActive || !activeKey && i === 0 ? 0 : -1, "aria-selected": multi ? checked : isActive, "aria-current": isActive ? "true" : undefined,
              className: "wbt-timeline-option" + (isActive ? " current" : ""), onClick: function () { choose(item, multi); setDeleting(false); }, onKeyDown: function (e) { keyboard(e, i); } },
              h("div", { className: "wbt-timeline-option-title" }, multi ? h("input", { type: "checkbox", checked: checked, disabled: busy || !item.taskCount, "aria-label": item.title || tr("未命名时间线"), onClick: function (e) { e.stopPropagation(); }, onChange: function () { choose(item, true); } }) : null, h("strong", null, h(Highlight, { text: item.title || tr("未命名时间线"), keyword: query }))),
              excerpt ? h("span", { className: "wbt-timeline-excerpt", title: item.description }, h(Highlight, { text: Array.from(excerpt).slice(0, 90).join(""), keyword: query })) : null,
               h("span", null, t.timelineTasks + " " + item.taskCount + " · " + t.timelineOpen + " " + item.openCount + " · " + t.timelineDone + " " + item.doneCount + " · " + t.timelineActivity + " " + (item.lastActivityDate || "—")));
          })),
          busy ? h("p", { role: "status" }, t.loading) : !error && !data.records.length ? h("p", { className: "wbt-empty", role: "status" }, query ? t.timelineSearchEmpty.replace("{query}", function () { return query; }) : t.timelineEmpty) : null,
          h(Pager, { t: t, label: t.timeline, busy: busy, page: page, total: data.total, set: setPage })),
        h("section", { className: "wbt-timeline-right", "aria-label": t.timelineMembers, "aria-busy": memberBusy },
          heading.eyebrow ? h("div", { className: "wbt-timeline-eyebrow" }, heading.eyebrow) : null,
           h("h3", null, active ? heading.title || tr("未命名时间线") : t.timelineMembers),
          active ? h("div", { className: "wbt-timeline-summary" }, h("div", { className: "wbt-desc wbt-timeline-desc" }, active.description || tr("暂无描述")),
             h("div", { className: "wbt-timeline-actions" },
            h("button", { className: "wbt-btn primary", onClick: function () { setEditor(active); } }, tr("编辑时间线")),
            h("button", { className: "wbt-btn", onClick: function () { setAdding(true); } }, tr("添加已有任务")),
            h("button", { className: "wbt-timeline-id", title: tr("复制 ID") + " · " + activeKey, "aria-label": tr("复制 ID"), onClick: function () { navigator.clipboard.writeText(activeKey).catch(function (e) { setMemberError(String(e)); }); } }, h("code", null, activeKey), h("span", { "aria-hidden": true }, "⧉")),
             h("button", { className: "wbt-btn wbt-act-del", onClick: function () { setDeleting(true); } }, tr("删除时间线"))),
            deleting ? h("div", { role: "alert", className: "wbt-timeline-confirm" }, tr("删除时间线将移出全部成员，保留任务及重启链。"),
              h("button", { className: "wbt-btn", disabled: writing, onClick: function () { setDeleting(false); } }, tr("取消删除")),
              h("button", { className: "wbt-btn", disabled: writing, onClick: function () { setWriting(true); api.call("taskTimelines.delete", { timelineId: activeKey }).then(result).then(function () { setDeleting(false); setSelected([]); reload(); }).catch(function (e) { setMemberError(String(e.message || e)); }).finally(function () { setWriting(false); }); } }, tr("确认删除时间线"))) : null) : null,

          memberError ? h("p", { role: "alert", className: "wbt-err" }, t.error + memberError) : null,
          memberBusy ? h("p", { role: "status" }, t.loading) : h(MemberRows, { rows: members.records, lang: lang, disabled: writing,
             onOpen: function (task, e) { detailTrigger.current = e.currentTarget; setDetail(task); },
             onRemove: function (task) { setWriting(true); api.call("taskTimelines.detach", { taskId: task.id }).then(result).then(function () { createdRef.current = active; reload(); }).catch(function (e) { setMemberError(String(e.message || e)); }).finally(function () { setWriting(false); }); } }),
           !memberBusy && !memberError && !members.records.length ? h("p", { className: "wbt-empty" }, active ? tr("暂无可显示成员") : t.timelineEmpty) : null,
          active ? h("div", { className: "wbt-timeline-member-footer" }, h("span", null, t.timelineOrder), h(Pager, { t: t, label: t.timelineMembers, busy: memberBusy, page: memberPage, total: members.total, set: setMemberPage })) : null)),
      editor ? h(controls.Editor, { api: api, t: t, item: editor.timelineKey ? editor : null, onClose: function () { setEditor(null); }, onSaved: function (line) { setEditor(null); setSingle(true); setDraft(""); setQuery(""); setPage(1); createdRef.current = Object.assign({}, line, { timelineKey: line.timelineId || line.timelineKey || line.id }); setActive(createdRef.current); reload(); } }) : null,
      adding && active ? h(AddMembers, { api: api, t: t, timelineId: activeKey, onClose: function () { setAdding(false); }, onSaved: function () { setAdding(false); createdRef.current = active; reload(); } }) : null,
      merge ? h(Merge, { api: api, t: t, items: selected, onClose: closeMerge, onMerged: function () { closeMerge(); setSelected([]); setMulti(false); reload(); } }) : null,
      detail ? h(deps.EditModal, { key: detail.id, api: api, t: t, lang: lang, task: detail, tree: tree, onClose: closeDetail, onSaved: function () { closeDetail(); reload(); } }) : null);
  }
  return TimelineView;
};
