// 工作区筛选下拉：与标签筛选同款交互（搜索、已选置顶、清空、滚动分页），数据源是本插件 action taskWorkspaces.list。
var React = require("react");
var h = React.createElement;
var PAGE_SIZE = 20;
module.exports = function WorkspaceFilter(props) {
  var api = props.api, t = props.t, Icon = props.Icon;
  var ids = props.ids || [], noWorkspace = props.noWorkspace === true;
  var openState = React.useState(false), open = openState[0], setOpen = openState[1];
  var queryState = React.useState(""), query = queryState[0], setQuery = queryState[1];
  var viewState = React.useState({ records: [], total: 0, page: 0, hasMore: false }), view = viewState[0], setView = viewState[1];
  var loadingState = React.useState(false), loading = loadingState[0], setLoading = loadingState[1];
  var errorState = React.useState(""), error = errorState[0], setError = errorState[1];
  var namesState = React.useState({}), names = namesState[0], setNames = namesState[1];
  // 服务端不返回 hasMore，用 页码 × 页长 < total 自行推导。
  var load = React.useCallback(function (keyword, pageNumber, append) {
    setLoading(true); setError("");
    return api.call("taskWorkspaces.list", { keyword: keyword || "", pageNumber: pageNumber, pageSize: PAGE_SIZE }).then(function (res) {
      setLoading(false);
      if (!res || res.ok === false) { setError((res && res.error) || "list failed"); return; }
      var out = res.result || {}, records = out.records || [], page = out.pageNumber || pageNumber, total = out.total || 0;
      setView(function (prev) {
        return { records: append ? prev.records.concat(records) : records, total: total, page: page, hasMore: page * PAGE_SIZE < total };
      });
      if (!records.length) return;
      setNames(function (prev) {
        var next = Object.assign({}, prev);
        records.forEach(function (ws) { next[String(ws.id)] = String(ws.title || ws.name || ws.id); });
        return next;
      });
    }).catch(function (e) { setLoading(false); setError(String((e && e.message) || e)); });
  }, [api]);
  React.useEffect(function () {
    if (!open) return undefined;
    var timer = setTimeout(function () { load(query, 1, false); }, query ? 200 : 0);
    return function () { clearTimeout(timer); };
  }, [open, query, load, props.reloadKey]);
  function onScroll(e) {
    var el = e && e.target;
    if (!el || !view.hasMore || loading) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 24) load(query, view.page + 1, true);
  }
  function name(id) { return names[String(id)] || String(id); }
  var caption = t.workspaceFilter + (ids.length ? " · " + ids.length : "") + (noWorkspace && !ids.length ? " · " + t.noWorkspace : "");
  var head = h("button", { type: "button", className: "wbt-btn ghost" + (ids.length || noWorkspace ? " on" : ""), "aria-expanded": open, title: caption,
    onClick: function () { setOpen(!open); } },
    Icon ? h(Icon, { name: "folder", size: 13 }) : null, caption, Icon ? h(Icon, { name: "down", size: 12 }) : null);
  if (!open) return h("div", { className: "wbt-tagfilter wbt-wsfilter" }, head);
  var records = view.records || [];
  var menu = h("div", { className: "wbt-tagmenu wbt-wsmenu", role: "menu" },
    h("div", { className: "wbt-tagsearch" }, h("input", { className: "wbt-input", autoFocus: true, value: query, placeholder: t.workspaceSearchPlaceholder,
      "aria-label": t.workspaceSearchPlaceholder, onChange: function (e) { setQuery(e.target.value); }, onKeyDown: function (e) { if (e.key === "Escape") setOpen(false); } })),
    ids.length ? h("div", { className: "wbt-tagsel" },
      h("div", { className: "wbt-tagmenu-head" }, t.workspaceSelected + " " + ids.length),
      h("div", { className: "wbt-tagsel-list" }, ids.map(function (id) {
        return h("button", { key: String(id), type: "button", className: "wbt-tagselitem", title: t.workspaceRemove, onClick: function () { props.onToggle(String(id)); } },
          h("span", { className: "wbt-tagnm" }, name(id)), h("span", { className: "wbt-tagx" }, "×"));
      }))) : null,
    h("div", { className: "wbt-tagmenu-head" }, t.allWorkspaces + " " + view.total, h("span", { className: "wbt-grow" }),
      h("button", { type: "button", className: "wbt-mini", onClick: function () { setQuery(""); props.onClear(); } }, t.clear)),
    records.length ? h("div", { className: "wbt-taglist", onScroll: onScroll }, records.map(function (ws) {
      var id = String(ws.id), checked = ids.indexOf(id) >= 0;
      return h("label", { key: id, className: "wbt-tagopt" },
        h("input", { type: "checkbox", checked: checked, onChange: function () { props.onToggle(id); } }),
        h("span", { className: "wbt-tagnm" }, String(ws.title || ws.name || id)),
        h("span", { className: "wbt-tagcnt" }, String(ws.taskCount || 0)));
    })) : h("div", { className: "wbt-note" }, loading ? t.loadingMore : error ? error : query ? t.workspaceNoMatch : t.noWorkspaces),
    error && records.length ? h("div", { className: "wbt-note" }, error) : null,
    h("label", { className: "wbt-tagopt wbt-wsnone" }, h("input", { type: "checkbox", checked: noWorkspace, onChange: function () { props.onToggleNoWorkspace(); } }),
      h("span", { className: "wbt-tagnm" }, t.noWorkspace)),
    h("div", { className: "wbt-tagmore" }, loading ? t.loadingMore : view.hasMore ? "" : t.noMore));
  return h("div", { className: "wbt-tagfilter wbt-wsfilter" }, head, menu);
};
