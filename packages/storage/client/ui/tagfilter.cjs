// 储物列表的标签筛选下拉：交互与已选置顶见 lib/tag-filter.cjs，这里只注入储物域的差异。
// 与任务、站点两处共用同一套交互契约（200ms 防抖、每页 20、触底阈值 24px、
// 已选置顶、Esc 关闭、三态文案）。
var React = require("react");
var h = React.createElement;
var ui = require("./ui.cjs");
var createTagFilter = require("../../../lib/tag-filter.cjs");

module.exports = createTagFilter({
  action: "storageTags.search",
  stopPropagation: true,
  classes: { root: "wbi-tagfilter", btn: "wbi-btn", btnOn: "wbi-tagon", menu: "wbi-tagmenu" },
  menuRole: "menu",
  enabled: function (props) {
    return props.enabled !== false;
  },
  // 已选标签可能不在当前页甚至不在当前搜索词里，按 id 补名字。
  names: { action: "storageTags.byIds" },
  text: function (props) {
    var lang = props.lang;
    return {
      label: ui.tr(lang, "标签筛选", "Tag filter"),
      selected: ui.tr(lang, "已选", "Selected"),
      all: ui.tr(lang, "全部标签", "All tags"),
      clear: ui.tr(lang, "清空", "Clear"),
      searchPlaceholder: ui.tr(lang, "搜索标签名称", "Search tag names"),
      empty: ui.tr(lang, "暂无标签", "No tags yet"),
      noMatch: ui.tr(lang, "没有匹配的标签", "No matching tags"),
      loading: ui.tr(lang, "加载中…", "Loading…"),
      noMore: ui.tr(lang, "没有更多", "No more"),
      remove: ui.tr(lang, "移除", "Remove"),
    };
  },
  icon: function (props, name, size) {
    return h(ui.Icon, { name: name, size: size });
  },
  caret: "▾",
  mapPage: function (out, pageNumber) {
    var pages = out.pages || 0;
    var current = out.current || pageNumber;
    return { rows: out.records || [], total: out.total || 0, page: current, hasMore: current < pages };
  },
  renderSelected: function (ctx) {
    if (!ctx.ids.length) return null;
    return h(
      "div",
      { className: "wbi-tagsel" },
      h(
        "div",
        { className: "wbi-tagmenu-head" },
        h("span", null, ctx.text.selected + " " + ctx.ids.length),
      ),
      h(
        "div",
        { className: "wbi-tagsel-list" },
        ctx.ids.map(function (id) {
          return h(
            "button",
            {
              key: id,
              type: "button",
              className: "wbi-tagselitem",
              title: ctx.text.remove,
              onClick: function () {
                ctx.toggle(id);
              },
            },
            h("span", { className: "wbi-tagnm" }, ctx.names[String(id)] || "#" + id),
            h("span", { className: "wbi-tagx" }, "×"),
          );
        }),
      ),
    );
  },
});
