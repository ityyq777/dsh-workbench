// 站点列表的标签筛选下拉：交互与已选置顶见 lib/tag-filter.cjs，这里只注入站点域的差异。
// 从 client.src.cjs 拆出，避免主文件继续膨胀。
var React = require("react");
var h = React.createElement;
var createTagFilter = require("../../../lib/tag-filter.cjs");

module.exports = createTagFilter({
  action: "siteTags.search",
  stopPropagation: true,
  classes: { root: "wbs-tagfilter", btn: "wbs-btn", btnOn: "on", menu: "wbs-tagmenu" },
  menuStyle: { width: 260 },
  enabled: function (props) {
    return props.visible !== false;
  },
  text: function (props) {
    var text = props.text || function () {
      return "";
    };
    return {
      label: text("tagFilter"),
      selected: text("tagSelected"),
      all: text("allTags"),
      clear: text("clear"),
      searchPlaceholder: text("tagSearchPlaceholder"),
      empty: text("noTags"),
      noMatch: text("tagNoMatch"),
      loading: text("loadingMore"),
      noMore: text("noMore"),
      remove: text("tagSelected"),
    };
  },
  icon: function (props, name, size) {
    return h(props.Icon, { name: name, size: size });
  },
  caret: function (props) {
    return h(props.Icon, { name: "chevron-down", size: 12 });
  },
  mapPage: function (out, pageNumber) {
    var current = out.current || pageNumber;
    return {
      rows: out.records || [],
      total: out.total || 0,
      page: current,
      hasMore: !!out.hasNext || current * 20 < (out.total || 0),
    };
  },
  renderSelected: function (ctx) {
    if (!ctx.ids.length) return null;
    return h(
      "div",
      { style: { padding: "0 4px 4px" } },
      h("div", { className: "wbs-tagmenu-head" }, h("span", null, ctx.text.selected + " " + ctx.ids.length)),
      ctx.ids.map(function (id) {
        return h(
          "button",
          {
            key: id,
            className: "wbs-mini",
            style: { justifyContent: "space-between" },
            onClick: function () {
              ctx.toggle(id);
            },
          },
          h(
            "span",
            { style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } },
            ctx.names[String(id)] || "#" + id,
          ),
          h("span", null, "×"),
        );
      }),
    );
  },
});
