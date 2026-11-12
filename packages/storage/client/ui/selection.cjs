var React = require("react"), ui = require("./ui.cjs"), h = ui.h, tr = ui.tr;
// Scope keys make a view change invalidate selection during render, before effects/responses.
function useSelection(scope, rows, blocked) {
  var mode = React.useState(false), state = React.useState({ scope: scope, ids: [] }), anchor = React.useRef(null);
  var ids = state[0].scope === scope ? state[0].ids : [];
  function set(next) { state[1]({ scope: scope, ids: next }); }
  function exit() { mode[1](false); set([]); anchor.current = null; }
  React.useEffect(function () { set([]); anchor.current = null; }, [scope]);
  React.useEffect(function () {
    function key(e) { if (e.key === "Escape" && !e.defaultPrevented && !blocked) exit(); }
    document.addEventListener("keydown", key);
    return function () { document.removeEventListener("keydown", key); };
  }, [scope, blocked]);
  return { mode: mode[0], ids: ids, exit: exit,
    enter: function () { set([]); anchor.current = null; mode[1](true); },
    all: function () { if (!blocked) set(rows.map(function (r) { return r.id; })); },
    toggle: function (id, shift) {
      if (blocked) return;
      var next = new Set(ids), add = !next.has(id), range = [id];
      if (shift && anchor.current && anchor.current.scope === scope) {
        var a = rows.findIndex(function (r) { return r.id === anchor.current.id; });
        var b = rows.findIndex(function (r) { return r.id === id; });
        if (a >= 0 && b >= 0) range = rows.slice(Math.min(a,b), Math.max(a,b)+1).map(function(r) { return r.id; });
      }
      range.forEach(function (v) { if (add) next.add(v); else next.delete(v); });
      anchor.current = { scope: scope, id: id }; set(Array.from(next));
    }
  };
}
function SelectionBar(p) {
  return h("div", { className: "wbi-selbar", role: "toolbar", "aria-label": tr(p.lang,"批量操作","Bulk actions") },
    h("span", { role: "status" }, tr(p.lang,"已选 ","Selected ") + p.selection.ids.length),
    h(ui.Button, { className: "wbi-btn wbi-btn-sm", disabled: p.busy || p.loading, onClick: p.selection.all }, tr(p.lang,"全选本页","Select page")),
    h(ui.Button, { className: "wbi-btn wbi-btn-sm", disabled: p.busy, onClick: p.selection.exit }, tr(p.lang,"退出","Exit")),
    h("div", { className: "wbi-bulk-actions" }, p.children));
}
function DeleteConfirmation(p) {
  return h(ui.Modal, { title: tr(p.lang,"批量删除物品","Delete selected items"), onClose: p.busy ? null : p.onClose },
    h(ui.ErrorBox, { error: p.error }),
    h("p", null, tr(p.lang,"将软删除以下物品。共 ","Soft-delete these items. Total: ") + p.items.length + tr(p.lang," 条", " items")),
    h("ul", null, p.items.slice(0,10).map(function (item) { return h("li", { key: item.id }, item.name); })),
    p.items.length > 10 ? h("p", null, tr(p.lang,"仅展示前 10 条","Showing first 10 items")) : null,
    h("p", { className: "wbi-muted" }, tr(p.lang,"标签可用时同时移除关联，不可用时保留。","Tag links are removed when tags are available, otherwise preserved.")),
    h("div", { className: "wbi-formfoot" },
      h(ui.Button, { className: "wbi-btn wbi-btn-sm", disabled: p.busy, onClick: p.onClose }, tr(p.lang,"取消","Cancel")),
      h(ui.Button, { className: "wbi-btn wbi-btn-sm wbi-danger", disabled: p.busy, onClick: p.onConfirm }, p.busy ? tr(p.lang,"删除中…","Deleting…") : tr(p.lang,"确认删除","Confirm delete"))));
}
module.exports = { useSelection: useSelection, SelectionBar: SelectionBar, DeleteConfirmation: DeleteConfirmation };
