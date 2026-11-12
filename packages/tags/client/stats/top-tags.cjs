// Top 标签榜：单行单按钮，方向键移动焦点，Enter/Space 使用原生按钮激活。
var React = require("react");
var h = React.createElement;
function TopTags(props) {
  var rows = props.rows || [];
  var en = props.lang === "en";
  var activePair = React.useState(0);
  var active = Math.min(activePair[0], Math.max(0, rows.length - 1));
  var setActive = activePair[1];
  var max = rows.reduce(function (n, row) { return Math.max(n, Number(row.count) || 0); }, 0);
  function move(event, index) {
    var next = index;
    if (event.key === "ArrowDown") next = Math.min(rows.length - 1, index + 1);
    else if (event.key === "ArrowUp") next = Math.max(0, index - 1);
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = rows.length - 1;
    else return;
    event.preventDefault();
    setActive(next);
    var buttons = event.currentTarget.parentElement.querySelectorAll("button");
    if (buttons[next]) buttons[next].focus();
  }
  return h("section", { className: "wbg-scard wbg-top-card", "aria-label": en ? "Top 100 tags" : "Top 100 标签" },
    h("div", { className: "wbg-chead" },
      h("span", { className: "wbg-ctitle" }, en ? "Top 100 tags" : "Top 100 标签"),
      h("span", { className: "wbg-cnote" }, en ? props.total + " tags total" : "共 " + props.total + " 个标签")),
    h("div", { className: "wbg-top-scroll" },
      h("div", { className: "wbg-top-head", "aria-hidden": true },
        h("span", null, "#"), h("span", null, en ? "Tag" : "标签"), h("span", null, en ? "Uses" : "次数")),
      h("div", { className: "wbg-top-rows" }, rows.map(function (row, index) {
        return h("button", {
          key: row.id, type: "button", className: "wbg-top-row", tabIndex: index === active ? 0 : -1,
          "aria-label": en ? "Rank " + (index + 1) + ", " + row.name + ", " + row.count + " uses" : "第" + (index + 1) + "名，" + row.name + "，" + row.count + "次",
          onFocus: function () { setActive(index); },
          onKeyDown: function (event) { move(event, index); },
          onClick: function () { if (props.onSelect) props.onSelect(row); },
        },
          h("span", { className: "wbg-top-rank" }, index + 1),
          h("span", { className: "wbg-top-name", title: row.name },
            h("span", { className: "wbg-top-fill", "aria-hidden": true, style: { width: (max > 0 ? Math.max(0, Number(row.count) / max) * (rows.length === 1 ? 50 : 90) : 0) + "%" } }),
            h("span", { className: "wbg-top-label" }, row.name)),
          h("span", { className: "wbg-top-count" }, row.count));
      })),
    ));
}
module.exports = { TopTags: TopTags };
