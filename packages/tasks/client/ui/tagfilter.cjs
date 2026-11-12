// 任务列表的标签筛选下拉：搜索 + 滚动分页 + 已选置顶。
// 从 client.src.cjs 拆出，避免单文件持续膨胀；esbuild 会把它内联进 lib/client.js。
var React = require("react");
var h = React.createElement;

module.exports = function TagFilter(props) {
  var api = props.api;
  var t = props.t;
  var Icon = props.Icon;
  var ids = props.ids || [];
  var onChange = props.onChange;
  var availS = React.useState(true);
  var available = availS[0], setAvailable = availS[1];
  var openS = React.useState(false);
  var open = openS[0], setOpen = openS[1];

  var queryS = React.useState("");
  var query = queryS[0], setQuery = queryS[1];
  var optsS = React.useState({ tags: [], total: 0, pageNumber: 0, hasMore: false });
  var opts = optsS[0], setOpts = optsS[1];
  var loadingS = React.useState(false);
  var loading = loadingS[0], setLoading = loadingS[1];
  var namesS = React.useState({});
  var names = namesS[0], setNames = namesS[1];

  // 每次只取一页；搜索词变化时回到第 1 页，滚动到底再追加下一页。
  var load = React.useCallback(function (text, pageNumber, append) {
    setLoading(true);
    return api.call("tasks.tagOptions", { text: text || "", pageNumber: pageNumber, pageSize: 20 }).then(function (r) {
      setLoading(false);
      if (!r || !r.ok) return;
      var out = r.result || {};
      setOpts(function (prev) {
        var tags = append ? (prev.tags || []).concat(out.tags || []) : (out.tags || []);
        return { tags: tags, total: out.total || 0, pageNumber: out.pageNumber || pageNumber, hasMore: !!out.hasMore };
      });
      setNames(function (prev) {
        var next = Object.assign({}, prev);
        (out.tags || []).forEach(function (x) { next[String(x.id)] = x.name; });
        return next;
      });
    }).catch(function () { setLoading(false); });
  }, [api]);

  React.useEffect(function () {
    if (!open) return;
    var timer = setTimeout(function () { load(query, 1, false); }, query ? 200 : 0);
    return function () { clearTimeout(timer); };
  }, [open, query, load, props.reloadKey]);

  React.useEffect(function () {
    api.call("tasks.tagOptions", { pageSize: 1 }).then(function (r) {
      if (r && r.ok) setAvailable(!!(r.result && r.result.available));
    }).catch(function () {});
  }, [api]);

  function toggle(id) {
    var key = String(id);
    var next = ids.slice();
    var idx = next.indexOf(key);
    if (idx >= 0) next.splice(idx, 1); else next.push(key);
    onChange(next);
  }

  if (!available) return null;
  return h("div", { className: "wbt-tagfilter" },
    h("button", {
      className: "wbt-btn ghost" + (ids.length ? " on" : ""),
      "aria-expanded": open ? "true" : "false",
      onClick: function () { setOpen(!open); },
    }, h(Icon, { name: "tag", size: 13 }), t.tagFilter + (ids.length ? " · " + ids.length : ""), h(Icon, { name: "down", size: 12 })),
    open ? h("div", { className: "wbt-tagmenu", role: "menu" },
    h("div", { className: "wbt-tagsearch" },
      h("input", {
        className: "wbt-input", autoFocus: true, placeholder: t.tagSearchPlaceholder, value: query,
        onChange: function (e) { setQuery(e.target.value); },
        onKeyDown: function (e) { if (e.key === "Escape") { e.stopPropagation(); setOpen(false); } },
      })
    ),
    ids.length ? h("div", { className: "wbt-tagsel" },
      h("div", { className: "wbt-tagmenu-head" }, h("span", null, t.tagSelected + " " + ids.length), h("span", { className: "wbt-grow" })),
      h("div", { className: "wbt-tagsel-list" }, ids.map(function (id) {
        return h("button", { key: id, className: "wbt-tagselitem", title: t.tagRemove, onClick: function () { toggle(id); } },
          h("span", { className: "wbt-tagnm" }, names[String(id)] || ("#" + id)), h("span", { className: "wbt-tagx" }, "×"));
      }))
    ) : null,
    h("div", { className: "wbt-tagmenu-head" },
      h("span", null, t.allTags + (opts.total ? " · " + opts.total : "")),
      h("span", { className: "wbt-grow" }),
      h("button", { className: "wbt-mini", onClick: function () { onChange([]); setQuery(""); } }, t.clear)
    ),
    h("div", {
      className: "wbt-taglist",
      onScroll: function (e) {
        var el = e.currentTarget;
        if (!opts.hasMore || loading) return;
        if (el.scrollTop + el.clientHeight >= el.scrollHeight - 24) load(query, (opts.pageNumber || 1) + 1, true);
      },
    },
      opts.tags.length ? opts.tags.map(function (x) {
        var on = ids.indexOf(String(x.id)) >= 0;
        return h("label", { key: x.id, className: "wbt-tagopt" },
          h("input", { type: "checkbox", checked: on, onChange: function () { toggle(x.id); } }),
          h("span", { className: "wbt-tagnm" }, x.name),
          h("span", { className: "wbt-tagcnt" }, x.total)
        );
      }) : h("div", { className: "wbt-note" }, loading ? t.loadingMore : (query ? t.tagNoMatch : t.noTags)),
      opts.tags.length ? h("div", { className: "wbt-tagmore" }, loading ? t.loadingMore : (opts.hasMore ? "" : t.noMore)) : null
    )
    ) : null
  );
};
