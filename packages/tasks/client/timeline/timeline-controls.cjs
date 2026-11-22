// Explicit entity controls shared by task dialogs and the timeline navigation.
"use strict";
var createOverlay = require("../../../lib/overlay.cjs");
function result(r) { if (!r || !r.ok) throw Error(r && r.error || "请求失败"); return r.result; }
module.exports = function (React) {
  var h = React.createElement;
  var EditorOverlay = createOverlay({
    maskClass: "wbt-modal-mask",
    dialogClass: "wbt-modal",
    ariaLabelOf: function (p) {
      var tr = require("./timeline-copy.cjs")(p.t);
      return p.item ? tr("编辑时间线") : tr("新建时间线");
    },
    // 表单弹窗点遮罩容易误关，保持原有行为：只有 Esc 与取消按钮关闭。
    closeOnMask: false,
  });
  // 受控候选列表：不用原生 select，避免展开浮层越出弹窗；列表限高内部滚动，键盘可操作。
  function Picker(p) {
    var tr = require("./timeline-copy.cjs")(p.t);
    var PAGE_SIZE = 20;
    var ds = React.useState({ records: [], total: 0 }), data = ds[0], setData = ds[1];
    var ps = React.useState(1), page = ps[0], setPage = ps[1];
    var qs = React.useState(""), query = qs[0], setQuery = qs[1];
    var es = React.useState(""), error = es[0], setError = es[1];
    var bs = React.useState(false), busy = bs[0], setBusy = bs[1];
    var ms = React.useState(false), more = ms[0], setMore = ms[1];
    var rs = React.useState(0), retry = rs[0], setRetry = rs[1];
    var as = React.useState(-1), active = as[0], setActive = as[1];
    var list = React.useRef(null);
    var loading = React.useRef(false);
    // 滚动分页：换关键词重置到第 1 页，往下滚到底自动续下一页，不再放「上一页/下一页」。
    React.useEffect(function () {
      var cancelled = false, first = page <= 1;
      if (first) setBusy(true); else setMore(true);
      setError(""); loading.current = true;
      p.api.call("tasks.timelines", { includeSingletons: true, titleKey: query, pageNumber: page, pageSize: PAGE_SIZE }).then(result).then(function (r) {
        if (cancelled) return;
        loading.current = false;
        setData(function (prev) {
          if (first) return r;
          return { records: (prev.records || []).concat(r.records || []), total: r.total };
        });
        setActive(-1); setBusy(false); setMore(false);
      }).catch(function (e) {
        if (cancelled) return;
        loading.current = false; setError(String(e.message || e)); setBusy(false); setMore(false);
      });
      return function () { cancelled = true; };
    }, [p.api, page, query, retry]);
    var rows = data.records || [], pages = Math.max(1, Math.ceil(data.total / PAGE_SIZE));
    function choose(row) { if (row) p.onChange(row.timelineId || row.timelineKey, row.title || ""); }
    function optionAt(index) { var nodes = list.current ? list.current.querySelectorAll('[role="option"]') : []; return nodes[index]; }
    function move(next) {
      if (!rows.length) return;
      var index = Math.max(0, Math.min(rows.length - 1, next));
      setActive(index); var node = optionAt(index); if (node) node.focus();
    }
    function focusedIndex() {
      var nodes = list.current ? list.current.querySelectorAll('[role="option"]') : [];
      return Array.prototype.indexOf.call(nodes, document.activeElement);
    }
    function loadMore() {
      if (loading.current || busy || more || page >= pages) return;
      setPage(page + 1);
    }
    function onScroll(e) {
      var el = e.currentTarget;
      if (!el || !el.scrollHeight) return;
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 48) loadMore();
    }
    function onKeyDown(e) {
      var base = focusedIndex() >= 0 ? focusedIndex() : active;
      if (e.key === "ArrowDown") { e.preventDefault(); move(base + 1); loadMore(); }
      else if (e.key === "ArrowUp") { e.preventDefault(); move(base <= 0 ? 0 : base - 1); }
      else if (e.key === "Home") { e.preventDefault(); move(0); }
      else if (e.key === "End") { e.preventDefault(); move(rows.length - 1); loadMore(); }
      else if (e.key === "Enter") {
        if (document.activeElement && document.activeElement.getAttribute("role") === "option") return;
        e.preventDefault(); choose(rows[active < 0 ? 0 : active]);
      }
    }
    return h("div", { className: "wbt-timeline-picker" },
      h("label", { className: "wbt-field" }, tr("搜索已有时间线"),
        h("input", { className: "wbt-input", "aria-label": tr("搜索已有时间线"), value: query,
          onChange: function (e) { setQuery(e.target.value); setPage(1); } })),
      h("div", { className: "wbt-picker-selected", role: "status" }, p.value ? tr("已选时间线") + "：" + (p.title || p.value) : tr("尚未选择时间线")),
      h("div", { ref: list, className: "wbt-picker-list", role: "listbox", "aria-label": tr("选择已有时间线"), "aria-busy": busy ? "true" : "false", onKeyDown: onKeyDown, onScroll: onScroll },
        busy ? h("p", { className: "wbt-picker-note" }, tr("加载中…")) : null,
        error ? h("div", { className: "wbt-picker-note wbt-err", role: "alert" }, error, h("button", { type: "button", className: "wbt-btn", onClick: function () { setRetry(retry + 1); } }, tr("重试"))) : null,
        !busy && !error && !rows.length ? h("p", { className: "wbt-picker-note" }, query ? tr("没有匹配的时间线，可在下方新建。") : tr("暂无时间线，可在下方新建。")) : null,
        !busy && !error ? rows.map(function (row, index) {
          var id = row.timelineId || row.timelineKey, selected = id === p.value;
          return h("button", { key: id, type: "button", role: "option", "aria-selected": selected ? "true" : "false", "data-id": id, title: row.title || tr("未命名时间线"), tabIndex: index === active ? 0 : -1, className: "wbt-picker-opt" + (selected ? " selected" : ""), onMouseEnter: function () { setActive(index); }, onClick: function () { choose(row); } },
            h("span", { className: "wbt-picker-opt-title" }, row.title || tr("未命名时间线")),
            h("span", { className: "wbt-picker-opt-count" }, row.taskCount + tr(" 个任务")));
        }) : null,
        more ? h("p", { className: "wbt-picker-note" }, tr("加载更多…")) : null,
        !busy && !error && rows.length && page >= pages ? h("p", { className: "wbt-picker-note" }, tr("已到最后一条")) : null));
  }
  function Editor(p) {
    var tr = require("./timeline-copy.cjs")(p.t);
    var item = p.item, pending = React.useRef(false);
    var ts = React.useState(item && item.title || ""), title = ts[0], setTitle = ts[1];
    var ds = React.useState(item && item.description || ""), description = ds[0], setDescription = ds[1];
    var bs = React.useState(false), busy = bs[0], setBusy = bs[1];
    var es = React.useState(""), error = es[0], setError = es[1];
    function save() {
      if (pending.current) return; pending.current = true; setBusy(true); setError("");
      var args = { title: title, description: description };
      if (item) args.timelineId = item.timelineId || item.timelineKey || item.id;
      p.api.call(item ? "taskTimelines.update" : "taskTimelines.create", args).then(result).then(function (r) { p.onSaved(r.timeline); }).catch(function (e) { pending.current = false; setError(String(e.message || e)); setBusy(false); });
    }
    return h(EditorOverlay, { onClose: p.onClose, closeOnEscape: !busy, closeOnMask: false, autoFocus: false },
      h("div", { className: "wbt-modal-head" }, h("h3", null, item ? tr("编辑时间线") : tr("新建时间线"))),
      h("label", { className: "wbt-field" }, tr("时间线标题"), h("input", { className: "wbt-input", autoFocus: true, value: title, placeholder: tr("未命名时间线"), onChange: function (e) { setTitle(e.target.value); } })),
      h("label", { className: "wbt-field" }, tr("时间线描述"), h("textarea", { className: "wbt-textarea", value: description, onChange: function (e) { setDescription(e.target.value); } })),
      error ? h("p", { role: "alert", className: "wbt-err" }, error) : null,
      h("div", { className: "wbt-modal-foot" }, h("button", { className: "wbt-btn", disabled: busy, onClick: p.onClose }, tr("取消")), h("button", { className: "wbt-btn primary", disabled: busy, onClick: save }, busy ? tr("保存中…") : tr("保存时间线"))));
  }
  return { Picker: Picker, Editor: Editor, result: result };
};
