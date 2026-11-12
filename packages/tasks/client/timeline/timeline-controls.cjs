// Explicit entity controls shared by task dialogs and the timeline navigation.
"use strict";
function result(r) { if (!r || !r.ok) throw Error(r && r.error || "请求失败"); return r.result; }
module.exports = function (React) {
  var h = React.createElement;
  // 受控候选列表：不用原生 select，避免展开浮层越出弹窗；列表限高内部滚动，键盘可操作。
  function Picker(p) {
    var tr = require("./timeline-copy.cjs")(p.t);
    var ds = React.useState({ records: [], total: 0 }), data = ds[0], setData = ds[1];
    var ps = React.useState(1), page = ps[0], setPage = ps[1];
    var qs = React.useState(""), query = qs[0], setQuery = qs[1];
    var es = React.useState(""), error = es[0], setError = es[1];
    var bs = React.useState(false), busy = bs[0], setBusy = bs[1];
    var rs = React.useState(0), retry = rs[0], setRetry = rs[1];
    var as = React.useState(-1), active = as[0], setActive = as[1];
    var list = React.useRef(null);
    React.useEffect(function () {
      var cancelled = false; setBusy(true); setError("");
      p.api.call("tasks.timelines", { includeSingletons: true, titleKey: query, pageNumber: page, pageSize: 20 }).then(result).then(function (r) {
        if (!cancelled) { setData(r); setActive(-1); setBusy(false); }
      }).catch(function (e) { if (!cancelled) { setError(String(e.message || e)); setBusy(false); } });
      return function () { cancelled = true; };
    }, [p.api, page, query, retry]);
    var rows = data.records || [], pages = Math.max(1, Math.ceil(data.total / 20));
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
    function onKeyDown(e) {
      var base = focusedIndex() >= 0 ? focusedIndex() : active;
      if (e.key === "ArrowDown") { e.preventDefault(); move(base + 1); }
      else if (e.key === "ArrowUp") { e.preventDefault(); move(base <= 0 ? 0 : base - 1); }
      else if (e.key === "Home") { e.preventDefault(); move(0); }
      else if (e.key === "End") { e.preventDefault(); move(rows.length - 1); }
      else if (e.key === "Enter") {
        if (document.activeElement && document.activeElement.getAttribute("role") === "option") return;
        e.preventDefault(); choose(rows[active < 0 ? 0 : active]);
      }
    }
    return h("div", { className: "wbt-timeline-picker" },
      h("label", { className: "wbt-field" }, tr("搜索已有时间线"),
        h("input", { className: "wbt-input", "aria-label": tr("搜索已有时间线"), value: query, onChange: function (e) { setQuery(e.target.value); setPage(1); } })),
      h("div", { className: "wbt-picker-selected", role: "status" }, p.value ? tr("已选时间线") + "：" + (p.title || p.value) : tr("尚未选择时间线")),
      h("div", { ref: list, className: "wbt-picker-list", role: "listbox", "aria-label": tr("选择已有时间线"), "aria-busy": busy ? "true" : "false", onKeyDown: onKeyDown },
        busy ? h("p", { className: "wbt-picker-note" }, tr("加载中…")) : null,
        error ? h("div", { className: "wbt-picker-note wbt-err", role: "alert" }, error, h("button", { type: "button", className: "wbt-btn", onClick: function () { setRetry(retry + 1); } }, tr("重试"))) : null,
        !busy && !error && !rows.length ? h("p", { className: "wbt-picker-note" }, query ? tr("没有匹配的时间线，可在下方新建。") : tr("暂无时间线，可在下方新建。")) : null,
        !busy && !error ? rows.map(function (row, index) {
          var id = row.timelineId || row.timelineKey, selected = id === p.value;
          return h("button", { key: id, type: "button", role: "option", "aria-selected": selected ? "true" : "false", "data-id": id, title: row.title || tr("未命名时间线"), tabIndex: index === active ? 0 : -1, className: "wbt-picker-opt" + (selected ? " selected" : ""), onMouseEnter: function () { setActive(index); }, onClick: function () { choose(row); } },
            h("span", { className: "wbt-picker-opt-title" }, row.title || tr("未命名时间线")),
            h("span", { className: "wbt-picker-opt-count" }, row.taskCount + tr(" 个任务")));
        }) : null),
      h("div", { className: "wbt-timeline-pager" }, h("button", { type: "button", className: "wbt-btn", disabled: busy || page <= 1, onClick: function () { setPage(page - 1); } }, tr("上一页")),
        h("span", null, page + " / " + pages),
        h("button", { type: "button", className: "wbt-btn", disabled: busy || page >= pages, onClick: function () { setPage(page + 1); } }, tr("下一页"))));
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
    return h("div", { className: "wbt-modal-mask", onKeyDown: function (e) { if (e.key === "Escape" && !busy) { e.stopPropagation(); p.onClose(); } } }, h("div", { className: "wbt-modal", role: "dialog", "aria-modal": true, "aria-label": item ? tr("编辑时间线") : tr("新建时间线") },
      h("div", { className: "wbt-modal-head" }, h("h3", null, item ? tr("编辑时间线") : tr("新建时间线"))),
      h("label", { className: "wbt-field" }, tr("时间线标题"), h("input", { className: "wbt-input", autoFocus: true, value: title, placeholder: tr("未命名时间线"), onChange: function (e) { setTitle(e.target.value); } })),
      h("label", { className: "wbt-field" }, tr("时间线描述"), h("textarea", { className: "wbt-textarea", value: description, onChange: function (e) { setDescription(e.target.value); } })),
      error ? h("p", { role: "alert", className: "wbt-err" }, error) : null,
      h("div", { className: "wbt-modal-foot" }, h("button", { className: "wbt-btn", disabled: busy, onClick: p.onClose }, tr("取消")), h("button", { className: "wbt-btn primary", disabled: busy, onClick: save }, busy ? tr("保存中…") : tr("保存时间线")))));
  }
  return { Picker: Picker, Editor: Editor, result: result };
};
