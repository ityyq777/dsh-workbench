var React = require("react"),
  ui = require("../ui/ui.cjs"),
  h = ui.h,
  tr = ui.tr;
function Stats(props) {
  var data = React.useState(null),
    error = React.useState(null),
    tick = React.useState(0),
    busy = React.useState(false),
    lang = props.lang;
  React.useEffect(
    function () {
      var active = true;
      busy[1](true);
      error[1](null);
      ui.call(props.api, "storage.stats")
        .then(function (r) {
          if (active) data[1](r);
        })
        .catch(function (e) {
          if (active) error[1](e);
        })
        .finally(function () {
          if (active) busy[1](false);
        });
      return function () {
        active = false;
      };
    },
    [props.api, tick[0]],
  );
  var s = data[0];
  return h(
    "div",
    { className: "wbi-root" },
    h(
      "div",
      { className: "wbi-row" },
      h("h2", null, h(ui.Icon, { name: "chart", size: 16 }), tr(lang, "统计", "Statistics")),
      h("span", { className: "wbi-grow" }),
      h(
        ui.Button,
        {
          icon: "refresh", disabled: busy[0],
          onClick: function () {
            tick[1](tick[0] + 1);
          },
        },
        tr(lang, "刷新", "Refresh"),
      ),
    ),
    h(ui.ErrorBox, { error: error[0] }),
    busy[0] ? h(ui.Skeleton, { lang: lang }) : null,
    s
      ? h(
          React.Fragment,
          null,
          h(
            "div",
            { className: "wbi-kpis" },
            [
              ["total", "物品记录", "Items"],
              ["tagged", "已关联标签", "Tagged"],
              ["withImages", "附有图片", "With images"],
            ].map(function (k) {
              return h(
                "div",
                { className: "wbi-card", key: k[0] },
                h("span", { className: "wbi-muted wbi-inline" }, h(ui.Icon, { name: k[0] === "total" ? "stock" : k[0] === "tagged" ? "tag" : "image" }), tr(lang, k[1], k[2])),
                h("strong", null, s[k[0]] === null ? "—" : s[k[0]]),
              );
            }),
          ),
          h(
            "p",
            { className: "wbi-notice" },
            tr(
              lang,
              "库存以文字记录，不对不同单位或范围数量进行求和。",
              "Stock is stored as text; mixed units and ranges are not summed.",
            ),
          ),
          h(
            "div",
            { className: "wbi-card" },
            h("h3", null, h(ui.Icon, { name: "clock" }), tr(lang, "最近更新", "Recently updated")),
            (s.recent || []).map(function (item) {
              return h(
                "div",
                { key: item.id, className: "wbi-row" },
                h("span", null, item.name),
                h("span", { className: "wbi-grow" }),
                h("span", { className: "wbi-muted" }, (item.stock || "—") + " " + (item.unit || "")),
              );
            }),
            !s.total
              ? h(
                  "span",
                  { className: "wbi-empty" },
                  h(ui.Icon, { name: "empty", size: 48 }),
                  tr(lang, "还没有物品，前往记录页添加", "No items yet. Add one in Records."),
                )
              : null,
          ),
        )
      : null,
  );
}
module.exports = { Stats: Stats };
