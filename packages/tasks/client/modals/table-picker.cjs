// Shared task-table picker: all changes stay local until the owning form submits.
"use strict";
function rows(tree, parents, out) {
  var result = out || [], prefix = parents || [];
  (tree || []).forEach(function (n) {
    if (n.deletedAt || n.deleted_at) return;
    var path = prefix.concat(String(n.name || ""));
    result.push({ id: String(n.id), name: String(n.name || ""), type: String(n.type), depth: prefix.length,
      path: path.join(" / "), groupPath: prefix.join(" / "), description: n.description || "" });
    if (String(n.type) !== "1") rows(n.children, path, result);
  });
  return result;
}
function visible(tree, query, recommended) {
  var keyword = String(query || "").trim().toLowerCase();
  var all = rows(tree), rec = all.find(function (n) { return n.type === "1" && n.id === String(recommended); });
  var shown = all.filter(function (n) { return !keyword || n.path.toLowerCase().indexOf(keyword) >= 0; });
  if (rec && shown.indexOf(rec) >= 0) shown = [rec].concat(shown.filter(function (n) { return n !== rec; }));
  return shown;
}
module.exports = function (React) {
  var h = React.createElement;
  return function TablePicker(props) {
    var qs = React.useState(""), query = qs[0], setQuery = qs[1];
    var activeState = React.useState(""), active = activeState[0], setActive = activeState[1];
    var input = React.useRef(null), list = React.useRef(null), uid = React.useId();
    var shown = visible(props.tree, query, props.recommended), options = shown.filter(function (n) { return n.type === "1"; });
    var picked = rows(props.tree).find(function (n) { return n.type === "1" && n.id === String(props.value); });
    var current = options.find(function (n) { return n.id === active; }) || options.find(function (n) { return n.id === String(props.value); }) || options[0];
    function optionId(n) { return uid + "-table-" + n.id; }
    React.useEffect(function () { if (input.current) input.current.focus(); }, []);
    React.useEffect(function () {
      if (!list.current || !current) return;
      var node = list.current.ownerDocument.getElementById(optionId(current));
      if (node && node.scrollIntoView) node.scrollIntoView({ block: "nearest" });
    }, [current && current.id, query]);
    function key(e) {
      if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); if (props.onClose) props.onClose(); return; }
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault(); e.stopPropagation();
        var at = options.indexOf(current), delta = e.key === "ArrowDown" ? 1 : -1;
        if (options.length) setActive(options[(at + delta + options.length) % options.length].id);
      }
      if (e.key === "Enter" && current) { e.preventDefault(); e.stopPropagation(); props.onChange(current.id); }
    }
    return h("div", { className: "wbt-table-picker", onKeyDown: key },
      h("input", { ref: input, className: "wbt-input", "aria-label": "搜索任务表名称或完整路径", placeholder: "搜索任务表名称或完整路径", value: query,
        role: "combobox", "aria-expanded": true, "aria-controls": uid, "aria-autocomplete": "list", "aria-activedescendant": current ? optionId(current) : undefined,
        onChange: function (e) { setQuery(e.target.value); setActive(""); } }),
      h("div", { className: "wbt-batch" }, h("div", { ref: list, id: uid, role: "listbox", "aria-label": "目标任务表", tabIndex: 0,
        "aria-activedescendant": current ? optionId(current) : undefined, className: "wbt-batch-body" },
        shown.map(function (n) {
          var table = n.type === "1", selected = n.id === String(props.value);
          return h("div", { key: n.id, title: n.path, id: table ? optionId(n) : undefined, role: table ? "option" : "presentation",
            "aria-label": table ? n.name + "，" + n.groupPath : undefined, "aria-selected": table ? selected : undefined,
            className: "wbt-bpick" + (!table ? " wbt-bgroup" : "") + (selected ? " on" : "") + (table && current && current.id === n.id ? " keyboard" : ""),
            style: { paddingLeft: 2 + n.depth * 15 + "px", cursor: table ? "pointer" : "default" },
            onClick: table ? function () { setActive(n.id); props.onChange(n.id); } : undefined },
            !table ? h("span", { "aria-hidden": true }, "▸") : null,
            h("span", { className: "wbt-bpick-main" }, h("span", { className: "wbt-bpick-name" }, n.name),
              table && n.id === String(props.recommended) ? h("span", { className: "wbt-mhint" }, "当前上下文建议") : null),
            table ? h("span", { className: "wbt-bpick-check", "aria-hidden": true }, selected ? "✓" : "") : null);
        }), !shown.length ? h("div", { className: "wbt-batch-empty" }, "没有匹配的任务表") : null)),
      h("div", { className: "wbt-picker-detail", role: "status" }, picked ? h(React.Fragment, null,
        h("div", null, "目标任务表：" + picked.path), h("div", null, "职责：" + (picked.description || "暂无职责描述"))) : "请先选择目标任务表，再确认提交。"),
      props.onClose ? h("button", { type: "button", className: "wbt-btn ghost", onClick: props.onClose }, "收起选择器") : null);
  };
};
module.exports.rows = rows;
module.exports.visible = visible;
