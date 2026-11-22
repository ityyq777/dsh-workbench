"use strict";
/**
 * 凭据保险箱的页面骨架件：页头、工具条、卡片、指标、表格、空态与表单控件。
 *
 * 只做结构组合，样式全部来自 ui/styles.cjs 的 .wbv-* 类，颜色由主题 token 派生；
 * 命名刻意避开 Button/Skeleton/Modal，避免和共享层控件重名（pnpm test:shared-ui 会拦）。
 * 图标由调用方传入，本文件不 require 图标库。
 */

function PageHead(props) {
  var h = props.h;
  return h(
    "div",
    { className: "wbv-head" },
    h(
      "div",
      { className: "wbv-head-main" },
      h("div", { className: "wbv-title-row" }, h("h2", { className: "wbv-title" }, props.title), props.pill || null),
      props.sub ? h("p", { className: "wbv-sub" }, props.sub) : null,
    ),
    props.actions ? h("div", { className: "wbv-head-actions" }, props.actions) : null,
  );
}

function Toolbar(props) {
  var h = props.h;
  return h("div", { className: "wbv-toolbar" }, props.children);
}

function Card(props) {
  var h = props.h;
  return h(
    "section",
    { className: "wbv-card" + (props.className ? " " + props.className : "") },
    props.title || props.actions
      ? h(
          "div",
          { className: "wbv-card-head" },
          props.title ? h("h3", { className: "wbv-card-title" }, props.title) : h("span", null),
          props.actions ? h("div", { className: "wbv-card-actions" }, props.actions) : null,
        )
      : null,
    props.children,
  );
}

function Stat(props) {
  var h = props.h;
  return h(
    "div",
    { className: "wbv-stat" },
    h("div", { className: "wbv-stat-label" }, props.label),
    h("div", { className: "wbv-stat-value" }, props.value),
    props.hint ? h("div", { className: "wbv-stat-hint" }, props.hint) : null,
  );
}

function EmptyState(props) {
  var h = props.h;
  var Icon = props.icon;
  return h(
    "div",
    { className: "wbv-empty-card" },
    Icon ? h("span", { className: "wbv-empty-icon" }, h(Icon, { size: 22, strokeWidth: 1.6, "aria-hidden": true, focusable: false })) : null,
    props.title ? h("div", { className: "wbv-empty-title" }, props.title) : null,
    props.hint ? h("div", { className: "wbv-muted" }, props.hint) : null,
    props.children ? h("div", { className: "wbv-empty-actions" }, props.children) : null,
  );
}

/**
 * 表格：表头固定、行悬停高亮、空数据时在表格内显示提示，避免整页跳动。
 * columns: [{ key, label, align?, width? }]；renderRow(row, index) 返回一个 <tr>。
 */
function DataTable(props) {
  var h = props.h;
  var cols = props.columns || [];
  var rows = props.rows || [];
  return h(
    "div",
    { className: "wbv-table-wrap", role: "region", "aria-label": props.label || "数据表", tabIndex: 0 },
    h(
      "table",
      { className: "wbv-table" },
      h(
        "thead",
        null,
        h(
          "tr",
          null,
          cols.map(function (c) {
            return h(
              "th",
              { key: c.key, scope: "col", className: c.align === "right" ? "wbv-right" : undefined, style: c.width ? { width: c.width } : null },
              c.label,
            );
          }),
        ),
      ),
      h(
        "tbody",
        null,
        rows.length
          ? rows.map(function (row, i) {
              return props.renderRow(row, i);
            })
          : h("tr", null, h("td", { className: "wbv-table-empty", colSpan: cols.length || 1 }, props.empty || "暂无数据")),
      ),
    ),
  );
}

// 表单控件：统一挂 .wbv-input/.wbv-select/.wbv-textarea，占位符与焦点环由样式表统一。
function control(tag) {
  return function Control(props) {
    var h = props.h;
    var rest = {};
    for (var k in props) {
      if (k !== "h" && k !== "className") rest[k] = props[k];
    }
    rest.className = ("wbv-" + tag + " " + (props.className || "")).trim();
    return h(tag, rest);
  };
}

module.exports = {
  PageHead: PageHead,
  Toolbar: Toolbar,
  Card: Card,
  Stat: Stat,
  EmptyState: EmptyState,
  DataTable: DataTable,
  Input: control("input"),
  Select: control("select"),
  Textarea: control("textarea"),
};
