// 任务列表的标签筛选下拉：交互与已选置顶见 lib/tag-filter.cjs，这里只注入任务域的差异。
// 从 client.src.cjs 拆出，避免单文件持续膨胀；esbuild 会把它内联进 lib/client.js。
var React = require("react");
var h = React.createElement;
var createTagFilter = require("../../../lib/tag-filter.cjs");

module.exports = createTagFilter({
  action: "tasks.tagOptions",
  // 标签是 tasks 的可选子插件：探针确认后端是否启用标签域。
  probe: {
    action: "tasks.tagOptions",
    args: { pageSize: 1 },
    available: function (out) {
      return !!(out && out.available);
    },
  },
  classes: { root: "wbt-tagfilter", btn: "wbt-btn ghost", btnOn: "on", menu: "wbt-tagmenu" },
  menuRole: "menu",
  dedupe: false,
  text: function (props) {
    var t = props.t || {};
    return {
      label: t.tagFilter,
      selected: t.tagSelected,
      all: t.allTags,
      clear: t.clear,
      searchPlaceholder: t.tagSearchPlaceholder,
      empty: t.noTags,
      noMatch: t.tagNoMatch,
      loading: t.loadingMore,
      noMore: t.noMore,
      remove: t.tagRemove,
    };
  },
  icon: function (props, name, size) {
    return h(props.Icon, { name: name, size: size });
  },
  caret: function (props) {
    return h(props.Icon, { name: "down", size: 12 });
  },
  items: function (rows) {
    return rows.map(function (x) {
      return { id: x.id, name: x.name, meta: x.total };
    });
  },
  mapPage: function (out, pageNumber) {
    return {
      rows: out.tags || [],
      total: out.total || 0,
      page: out.pageNumber || pageNumber,
      hasMore: !!out.hasMore,
    };
  },
  renderSelected: function (ctx) {
    if (!ctx.ids.length) return null;
    return h(
      "div",
      { className: "wbt-tagsel" },
      h(
        "div",
        { className: "wbt-tagmenu-head" },
        h("span", null, ctx.text.selected + " " + ctx.ids.length),
        h("span", { className: "wbt-grow" }),
      ),
      h(
        "div",
        { className: "wbt-tagsel-list" },
        ctx.ids.map(function (id) {
          return h(
            "button",
            {
              key: id,
              className: "wbt-tagselitem",
              title: ctx.text.remove,
              onClick: function () {
                ctx.toggle(id);
              },
            },
            h("span", { className: "wbt-tagnm" }, ctx.names[String(id)] || "#" + id),
            h("span", { className: "wbt-tagx" }, "×"),
          );
        }),
      ),
    );
  },
});
