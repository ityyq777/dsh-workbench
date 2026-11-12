var React = require("react"), h = React.createElement, model = require("./heatmap-model.cjs");
function ActivityFilter(props) {
  if (!props.value) return null;
  var t = model.COPY[props.lang === "en" ? "en" : "zh"];
  return h("span",{className:"wbt-row","data-activity-filter":true},
    h("span",null,t.filter+" · "+props.value.activityDate+" · "+t[props.value.activityType]),
    h("button",{type:"button",className:"wbt-btn ghost",onClick:props.onClear},t.clear));
}
module.exports = { ActivityFilter:ActivityFilter, params:model.activityParams };
