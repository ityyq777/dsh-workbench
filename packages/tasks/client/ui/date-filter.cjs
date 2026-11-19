// 任务筛选的日期范围控件：外观与交互统一走共享日期选择器（lib/date-picker.cjs），
// 这里只保留任务域自己的文案（发布/完成/关闭/目标）与 normalize 等工具函数的再导出。
var React = require("react"), h = React.createElement;
var DP = require("../../../lib/date-picker.cjs");

var NAMES = {
  zh: { publish: "发布", done: "完成", shutdown: "关闭", target: "目标" },
  en: { publish: "Publication", done: "Completion", shutdown: "Closure", target: "Target" },
};

function DateFilter(props) {
  var en = props.lang === "en";
  var names = en ? NAMES.en : NAMES.zh;
  var name = names[props.kind] || names.publish;
  return h(DP.RangePicker, {
    React: React, h: h,
    prefix: "wbt",
    lang: props.lang,
    label: name + (en ? " date range" : "时间范围"),
    placeholder: en ? "Choose date range" : "选择日期范围",
    value: props.value || { from: "", to: "" },
    onChange: function (next) { props.onChange({ from: next.from, to: next.to }); },
  });
}

module.exports = {
  DateFilter: DateFilter,
  normalize: DP.normalizeRange,
  validDate: DP.validDate,
  today: DP.todayISO,
  shift: DP.shiftDate,
};
