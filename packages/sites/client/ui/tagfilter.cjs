// 站点列表的标签筛选下拉：关键词搜索 + 滚动分页 + 已选列表。
// 从 client.src.cjs 拆出，避免主文件继续膨胀。
var React = require("react");
var h = React.createElement;
var useState = React.useState;
var useEffect = React.useEffect;
var useCallback = React.useCallback;

module.exports = function TagFilter(props) {
  var api = props.api;
  var text = props.text;
  var Icon = props.Icon;
  var ids = props.ids || [];
  var onChange = props.onChange;
  var visible = props.visible !== false;

  var [open, setOpen] = useState(false);
  var [query, setQuery] = useState("");
  var [rows, setRows] = useState([]);
  var [total, setTotal] = useState(0);
  var [page, setPage] = useState(0);
  var [hasMore, setHasMore] = useState(false);
  var [loading, setLoading] = useState(false);
  var [names, setNames] = useState({});

  var load = useCallback(function (q, pageNumber, append) {
    setLoading(true);
    return api.call("siteTags.search", { text: q || "", pageNumber: pageNumber, pageSize: 20 }).then(function (r) {
      setLoading(false);
      if (!r || !r.ok) return;
      var out = r.result || {};
      var records = out.records || [];
      setRows(function (prev) { return append ? prev.concat(records) : records; });
      setTotal(out.total || 0);
      setPage(out.current || pageNumber);
      setHasMore(!!out.hasNext || (out.current || pageNumber) * 20 < (out.total || 0));
      setNames(function (prev) {
        var next = Object.assign({}, prev);
        records.forEach(function (x) { next[String(x.id)] = x.name; });
        return next;
      });
    }).catch(function () { setLoading(false); });
  }, [api]);

  useEffect(function () {
    if (!open) return undefined;
    var timer = setTimeout(function () { load(query, 1, false); }, query ? 200 : 0);
    return function () { clearTimeout(timer); };
  }, [open, query, load, props.reloadKey]);

  useEffect(function () {
    if (!open) return undefined;
    function onKey(e) { if (e.key === "Escape") setOpen(false); }
    document.addEventListener("keydown", onKey);
    return function () { document.removeEventListener("keydown", onKey); };
  }, [open]);

  if (!visible) return null;

  function toggle(id) {
    var key = String(id);
    var next = ids.slice();
    var i = next.indexOf(key);
    if (i >= 0) next.splice(i, 1); else next.push(key);
    onChange(next);
  }

  return h("div", { className: "wbs-tagfilter" },
    h("button", {
      className: "wbs-btn" + (ids.length ? " on" : ""),
      onClick: function (e) { e.stopPropagation(); setOpen(!open); },
    }, h(Icon, { name: "tag", size: 13 }), text("tagFilter") + (ids.length ? " · " + ids.length : ""), h(Icon, { name: "chevron-down", size: 12 })),
    open ? h("div", { className: "wbs-tagmenu", style: { width: 260 }, onClick: function (e) { e.stopPropagation(); } },
      h("div", { style: { padding: "2px 4px 6px" } },
        h("input", {
          className: "wbs-input", autoFocus: true, value: query,
          placeholder: text("tagSearchPlaceholder"),
          onChange: function (e) { setQuery(e.target.value); },
        })
      ),
      ids.length ? h("div", { style: { padding: "0 4px 4px", display: "flex", flexDirection: "column", gap: 3 } },
        h("div", { className: "wbs-tagmenu-head" }, h("span", null, text("tagSelected") + " " + ids.length)),
        ids.map(function (id) {
          return h("button", { key: id, className: "wbs-mini", style: { justifyContent: "space-between" }, onClick: function () { toggle(id); } },
            h("span", { style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, names[String(id)] || ("#" + id)),
            h("span", null, "×"));
        })
      ) : null,
      h("div", { className: "wbs-tagmenu-head" },
        h("span", null, text("allTags") + (total ? " · " + total : "")),
        h("span", { className: "wbs-grow" }),
        h("button", { className: "wbs-mini", title: text("clear"), onClick: function () { onChange([]); setQuery(""); } }, h(Icon, { name: "x", size: 12 }), text("clear"))
      ),
      h("div", {
        style: { maxHeight: 240, overflow: "auto" },
        onScroll: function (e) {
          var el = e.currentTarget;
          if (!hasMore || loading) return;
          if (el.scrollTop + el.clientHeight >= el.scrollHeight - 24) load(query, (page || 1) + 1, true);
        },
      },
        rows.length ? rows.map(function (t) {
          var on = ids.indexOf(String(t.id)) >= 0;
          return h("label", { key: t.id, className: "wbs-tagopt" },
            h("input", { type: "checkbox", checked: on, onChange: function () { toggle(t.id); } }),
            h("span", null, t.name));
        }) : h("div", { className: "wbs-note", style: { padding: 6 } }, loading ? text("loadingMore") : (query ? text("tagNoMatch") : text("allTags"))),
        rows.length ? h("div", { className: "wbs-note", style: { padding: 6, textAlign: "center" } }, loading ? text("loadingMore") : (hasMore ? "" : text("noMore"))) : null
      )
    ) : null
  );
};
