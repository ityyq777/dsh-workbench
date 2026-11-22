"use strict";
/** 允许调用的 action 多选：搜索、按域分组、手动添加与硬底线说明。 */
var C = require("../ui/common.cjs");
var copy = require("../ui/copy.cjs");

var DENIED = /^(vault|automation|audit)\.|\.(delete|backup)$/i;
var NAME = /^[A-Za-z_][A-Za-z0-9_]*(\.[A-Za-z_][A-Za-z0-9_]*){1,2}$/;

/** 候选过滤：name / domain / description 子串，大小写不敏感。 */
function filterCatalog(items, q) {
  var text = String(q || "").trim().toLowerCase();
  if (!text) return items || [];
  return (items || []).filter(function (row) {
    return String(row.name).toLowerCase().indexOf(text) !== -1 ||
      String(row.domain || "").toLowerCase().indexOf(text) !== -1 ||
      String(row.description || "").toLowerCase().indexOf(text) !== -1;
  });
}

/** 按域分组，保持输入顺序；没有域的项归到 other。 */
function groupByDomain(items) {
  var order = [];
  var map = {};
  (items || []).forEach(function (row) {
    var key = String(row.domain || "other");
    if (!map[key]) {
      map[key] = [];
      order.push(key);
    }
    map[key].push(row);
  });
  return order.map(function (key) { return { domain: key, items: map[key] }; });
}

function ActionPicker(props) {
  var h = props.h;
  var t = props.t;
  var icon = props.icon;
  var React = props.React;
  var qS = React.useState("");
  var manualS = React.useState("");
  var items = props.items || [];
  var selected = props.selected || [];
  var loading = Boolean(props.loading);
  var error = props.error || "";
  var rows = filterCatalog(items, qS[0]);
  var groups = groupByDomain(rows);
  var known = {};
  items.forEach(function (row) { known[row.name] = true; });
  // 已启用但已不在候选里的 action（插件卸载/改名）也要能看见并取消。
  var extra = selected.filter(function (name) { return !known[name]; });
  if (extra.length) groups.push({ domain: "__extra", items: extra.map(function (name) { return { name: name, domain: "", description: "" }; }) });

  function has(name) { return selected.indexOf(name) !== -1; }

  function toggle(name, on) {
    var next = selected.filter(function (x) { return x !== name; });
    if (on) next.push(name);
    next.sort();
    props.onChange(next);
  }

  function addManual() {
    var name = manualS[0].trim();
    if (!name) return;
    if (!NAME.test(name) || DENIED.test(name)) {
      manualS[1](name);
      return;
    }
    if (!has(name)) toggle(name, true);
    manualS[1]("");
  }

  var manualBad = manualS[0].trim() ? !NAME.test(manualS[0].trim()) || DENIED.test(manualS[0].trim()) : false;

  return h("div", { className: "wba-panel" },
    h("div", { className: "wba-panel-h" },
      h("p", { className: "wba-panel-title" }, t("config.allowed.title")),
      icon ? h("span", { className: "wba-card-ico" }, icon("list-checks", 16)) : null),
    h("p", { className: "wba-sub" }, t("config.allowed.hint")),
    h("div", { className: "wba-inline" },
      h("label", { className: "wba-field wba-grow" },
        h("span", { className: "wba-label" }, t("common.search")),
        h("input", {
          className: "wba-input",
          type: "search",
          value: qS[0],
          placeholder: t("config.allowed.search"),
          "aria-label": t("config.allowed.search"),
          onChange: function (e) { qS[1](e.target.value); },
        })),
      h("span", { className: "wba-hint" }, t("config.allowed.selected", { n: selected.length })),
      h(C.Btn, { h: h, disabled: !selected.length, onClick: function () { props.onChange([]); } }, t("common.clear"))),
    error ? h(C.Notice, { h: h, kind: "error", text: error }) : null,
    loading
      ? h("div", { className: "wba-skel" })
      : groups.length === 0
        ? h("p", { className: "wba-hint" }, t("config.allowed.empty"))
        : h("div", { className: "wba-picker" }, groups.map(function (group) {
            return h("div", { key: group.domain, className: "wba-picker-group" },
              h("p", { className: "wba-picker-domain" }, group.domain === "__extra" ? t("config.allowed.extra") : group.domain),
              group.items.map(function (row) {
                return h("label", { key: row.name, className: "wba-check wba-picker-row", title: row.description || row.name },
                  h("input", { type: "checkbox", checked: has(row.name), onChange: function (e) { toggle(row.name, e.target.checked); } }),
                  h("code", null, row.name),
                  row.description ? h("span", { className: "wba-hint wba-ellipsis" }, row.description) : null);
              }));
          })),
    h("div", { className: "wba-inline" },
      h("label", { className: "wba-field wba-grow" },
        h("span", { className: "wba-label" }, t("config.allowed.manual")),
        h("input", {
          className: "wba-input" + (manualBad ? " err" : ""),
          value: manualS[0],
          placeholder: "namespace.action",
          "aria-label": t("config.allowed.manual"),
          onChange: function (e) { manualS[1](e.target.value); },
        })),
      h(C.Btn, { h: h, disabled: !manualS[0].trim() || manualBad, onClick: addManual }, t("config.allowed.add"))),
    manualBad ? h("span", { className: "wba-err-text" }, t("config.allowed.invalid")) : null,
    h("p", { className: "wba-hint" }, t("config.allowed.deniedNote")));
}

module.exports = { ActionPicker: ActionPicker, filterCatalog: filterCatalog, groupByDomain: groupByDomain };
