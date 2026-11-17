// 储物列表的标签筛选下拉：关键词搜索 + 滚动分页 + 已选置顶。
// 与任务、站点两处标签查询控件共用同一套交互契约（200ms 防抖、每页 20、触底阈值 24px、
// 已选置顶、Esc 关闭、三态文案），差异只允许出现在「是否展示使用计数」。
var React = require("react");
var ui = require("./ui.cjs");
var FilterChecklist = require("../../../lib/filter-checklist.cjs");
var h = React.createElement,
  tr = ui.tr;

module.exports = function TagFilter(props) {
  var api = props.api,
    lang = props.lang,
    enabled = props.enabled !== false,
    ids = props.ids || [],
    onChange = props.onChange;
  var openS = React.useState(false),
    open = openS[0],
    setOpen = openS[1];
  var queryS = React.useState(""),
    query = queryS[0],
    setQuery = queryS[1];
  var optsS = React.useState({ tags: [], total: 0, pageNumber: 0, hasMore: false }),
    opts = optsS[0],
    setOpts = optsS[1];
  var loadingS = React.useState(false),
    loading = loadingS[0],
    setLoading = loadingS[1];
  var namesS = React.useState({}),
    names = namesS[0],
    setNames = namesS[1];
  var seq = React.useRef(0);

  // 每次只取一页；搜索词变化回到第 1 页，滚动到底再追加下一页。
  var load = React.useCallback(
    function (text, pageNumber, append) {
      var mine = ++seq.current;
      setLoading(true);
      return api
        .call("storageTags.search", { text: text || "", pageNumber: pageNumber, pageSize: 20 })
        .then(function (r) {
          if (mine !== seq.current) return;
          setLoading(false);
          if (!r || !r.ok) return;
          var out = r.result || {},
            records = out.records || [],
            current = out.current || pageNumber,
            pages = out.pages || 0;
          setOpts(function (prev) {
            var list = append ? (prev.tags || []).slice() : [];
            var seen = {};
            list.forEach(function (x) {
              seen[String(x.id)] = true;
            });
            records.forEach(function (x) {
              if (!seen[String(x.id)]) list.push(x);
            });
            return { tags: list, total: out.total || 0, pageNumber: current, hasMore: current < pages };
          });
          setNames(function (prev) {
            var next = Object.assign({}, prev);
            records.forEach(function (x) {
              next[String(x.id)] = x.name;
            });
            return next;
          });
        })
        .catch(function () {
          if (mine === seq.current) setLoading(false);
        });
    },
    [api],
  );

  // 展开或改搜索词时重取第一页；空关键词不防抖，立刻给出全量首页。
  React.useEffect(
    function () {
      if (!open) return undefined;
      var timer = setTimeout(
        function () {
          load(query, 1, false);
        },
        query ? 200 : 0,
      );
      return function () {
        clearTimeout(timer);
      };
    },
    [open, query, load, props.reloadKey],
  );

  // 已选标签可能不在当前页甚至不在当前搜索词里，单独按 id 补名字，保证已选置顶可读。
  React.useEffect(
    function () {
      if (!open || !ids.length) return;
      var wanted = ids.filter(function (id) {
        return !names[String(id)];
      });
      if (!wanted.length) return;
      api
        .call("storageTags.byIds", { ids: wanted })
        .then(function (r) {
          if (!r || !r.ok) return;
          var next = {};
          ((r.result && r.result.records) || []).forEach(function (x) {
            next[String(x.id)] = x.name;
          });
          if (!Object.keys(next).length) return;
          setNames(function (prev) {
            return Object.assign({}, prev, next);
          });
        })
        .catch(function () {});
    },
    [open, ids.join(",")],
  );

  React.useEffect(
    function () {
      if (!open) return undefined;
      function onKey(e) {
        if (e.key === "Escape") setOpen(false);
      }
      document.addEventListener("keydown", onKey);
      return function () {
        document.removeEventListener("keydown", onKey);
      };
    },
    [open],
  );

  function toggle(id) {
    var key = String(id),
      next = ids.slice(),
      i = next.indexOf(key);
    if (i >= 0) next.splice(i, 1);
    else next.push(key);
    onChange(next);
  }

  if (!enabled) return null;
  return h(
    "div",
    { className: "wbi-tagfilter" },
    h(
      "button",
      {
        type: "button",
        className: "wbi-btn" + (ids.length ? " wbi-tagon" : ""),
        "aria-expanded": open ? "true" : "false",
        onClick: function (e) {
          e.stopPropagation();
          setOpen(!open);
        },
      },
      h(ui.Icon, { name: "tag", size: 13 }),
      tr(lang, "标签筛选", "Tag filter") + (ids.length ? " · " + ids.length : ""),
      "▾",
    ),
    open
      ? h(
          "div",
          { className: "wbi-tagmenu", role: "menu", onClick: function (e) { e.stopPropagation(); } },
          h(FilterChecklist, {
            beforeHead: ids.length
              ? h(
                  "div",
                  { className: "wbi-tagsel" },
                  h("div", { className: "wbi-tagmenu-head" }, h("span", null, tr(lang, "已选", "Selected") + " " + ids.length)),
                  h(
                    "div",
                    { className: "wbi-tagsel-list" },
                    ids.map(function (id) {
                      return h(
                        "button",
                        {
                          key: id,
                          type: "button",
                          className: "wbi-tagselitem",
                          title: tr(lang, "移除", "Remove"),
                          onClick: function () {
                            toggle(id);
                          },
                        },
                        h("span", { className: "wbi-tagnm" }, names[String(id)] || "#" + id),
                        h("span", { className: "wbi-tagx" }, "×"),
                      );
                    }),
                  ),
                )
              : null,
            items: opts.tags.map(function (x) {
              return { id: x.id, name: x.name };
            }),
            selected: ids,
            onToggle: toggle,
            query: query,
            onQuery: setQuery,
            title: tr(lang, "全部标签", "All tags"),
            total: opts.total,
            selectedText: tr(lang, "已选", "Selected"),
            clearText: tr(lang, "清空", "Clear"),
            onClear: function () {
              onChange([]);
              setQuery("");
            },
            searchPlaceholder: tr(lang, "搜索标签名称", "Search tag names"),
            loading: loading,
            hasMore: opts.hasMore,
            onLoadMore: function () {
              load(query, (opts.pageNumber || 1) + 1, true);
            },
            emptyText: tr(lang, "暂无标签", "No tags yet"),
            noMatchText: tr(lang, "没有匹配的标签", "No matching tags"),
            loadingText: tr(lang, "加载中…", "Loading…"),
            noMoreText: tr(lang, "没有更多", "No more"),
          }),
        )
      : null,
  );
};
