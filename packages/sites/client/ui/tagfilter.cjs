// 站点列表的标签筛选下拉：关键词搜索 + 滚动分页 + 已选列表。
// 从 client.src.cjs 拆出，避免主文件继续膨胀。
var React = require("react");
var h = React.createElement;
var useState = React.useState;
var useEffect = React.useEffect;
var useCallback = React.useCallback;
var FilterChecklist = require("../../../lib/filter-checklist.cjs");

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
      setRows(function (prev) {
        if (!append) return records;
        var seen = {};
        var out = [];
        prev.concat(records).forEach(function (x) {
          var key = String(x.id);
          if (seen[key]) return;
          seen[key] = true;
          out.push(x);
        });
        return out;
      });
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
      h(FilterChecklist, {
        beforeHead: ids.length ? h("div", { style: { padding: "0 4px 4px" } },
          h("div", { className: "wbs-tagmenu-head" }, h("span", null, text("tagSelected") + " " + ids.length)),
          ids.map(function (id) {
            return h("button", { key: id, className: "wbs-mini", style: { justifyContent: "space-between" }, onClick: function () { toggle(id); } },
              h("span", { style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, names[String(id)] || ("#" + id)),
              h("span", null, "×"));
          })
        ) : null,
        items: rows.map(function (x) { return { id: x.id, name: x.name }; }),
        selected: ids,
        onToggle: toggle,
        query: query,
        onQuery: setQuery,
        title: text("allTags"),
        total: total,
        clearText: text("clear"),
        onClear: function () { onChange([]); setQuery(""); },
        searchPlaceholder: text("tagSearchPlaceholder"),
        loading: loading,
        hasMore: hasMore,
        onLoadMore: function () { load(query, (page || 1) + 1, true); },
        emptyText: text("noTags"),
        noMatchText: text("tagNoMatch"),
        loadingText: text("loadingMore"),
        noMoreText: text("noMore"),
      })
    ) : null
  );
};
