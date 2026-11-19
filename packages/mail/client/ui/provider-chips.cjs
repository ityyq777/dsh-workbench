"use strict";
/**
 * 服务商选择器：一排 chip，选中态用 aria-checked 表达（role=radio）。
 * 只在邮件插件里用，所以留在插件内，没有抽到 packages/addons/lib。
 */
var util = require("./provider-util.cjs");

module.exports = function ProviderChips(props) {
  var h = props.h;
  var lang = props.lang;
  var arr = (props.providers && props.providers.providers) || [];
  return h(
    "div",
    { className: "wbml-chips", role: "radiogroup", "aria-label": lang === "en" ? "Mail provider" : "邮箱服务商" },
    arr.map(function (p) {
      var on = p.id === props.value;
      return h(
        "button",
        {
          key: p.id,
          type: "button",
          role: "radio",
          "aria-checked": on ? "true" : "false",
          className: "wbml-chip" + (on ? " on" : ""),
          onClick: function () {
            props.onPick(p.id);
          },
        },
        util.labelOf(p, lang),
      );
    }),
  );
};
