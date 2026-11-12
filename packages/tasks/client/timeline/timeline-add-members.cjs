"use strict";
module.exports = function (React) {
  var h = React.createElement, result = require("./timeline-controls.cjs")(React).result;
  return function AddMembers(p) {
    var tr = require("./timeline-copy.cjs")(p.t);
    var qs = React.useState(""), query = qs[0], setQuery = qs[1];
    var ds = React.useState({ records: [], total: 0 }), data = ds[0], setData = ds[1];
    var ps = React.useState(1), page = ps[0], setPage = ps[1];
    var ss = React.useState([]), selected = ss[0], setSelected = ss[1];
    var es = React.useState(""), error = es[0], setError = es[1];
    var bs = React.useState(false), busy = bs[0], setBusy = bs[1];
    React.useEffect(function () {
      var cancelled = false; setError("");
      p.api.call("tasks.list", { titleKey: query, pageNumber: page, pageSize: 20, statuses: [] }).then(result).then(function (r) { if (!cancelled) setData(r); }).catch(function (e) { if (!cancelled) setError(String(e.message || e)); });
      return function () { cancelled = true; };
    }, [p.api, query, page]);
    function submit() {
      if (busy || !selected.length) return; setBusy(true);
      p.api.call("tasks.timelineRefactor", { ids: selected, timelineId: p.timelineId }).then(result).then(p.onSaved).catch(function (e) { setError(String(e.message || e)); setBusy(false); });
    }
    return h("div", { className: "wbt-modal-mask" }, h("div", { className: "wbt-modal", role: "dialog", "aria-modal": true, "aria-label": tr("添加已有任务") },
      h("h3", null, tr("添加已有任务")), h("p", null, tr("选中的任务将关联到此时间线；原有关联会被替换。")),
      h("input", { className: "wbt-input", "aria-label": tr("搜索已有任务"), value: query, onChange: function (e) { setQuery(e.target.value); setPage(1); } }),
      h("div", { style: { maxHeight: "40vh", overflow: "auto" } }, (data.records || []).map(function (x) { return h("label", { key: x.id, className: "wbt-bpick" }, h("input", { type: "checkbox", checked: selected.indexOf(x.id) >= 0, onChange: function (e) { setSelected(e.target.checked ? selected.concat(x.id) : selected.filter(function (id) { return id !== x.id; })); } }), x.title); })),
      h("div", { className: "wbt-timeline-pager" }, h("button", { disabled: page <= 1, onClick: function () { setPage(page - 1); } }, tr("上一页")), h("span", null, page), h("button", { disabled: page * 20 >= data.total, onClick: function () { setPage(page + 1); } }, tr("下一页"))),
      error ? h("p", { role: "alert" }, error) : null,
      h("div", { className: "wbt-modal-foot" }, h("button", { className: "wbt-btn", disabled: busy, onClick: p.onClose }, tr("取消")), h("button", { className: "wbt-btn primary", disabled: busy || !selected.length, onClick: submit }, tr("关联任务 (") + selected.length + ")"))));
  };
};
