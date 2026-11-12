// Today uses the server's local date and snapshot; never derive it from range or browser time.
var React = require("react"), h = React.createElement;
// title labels the accessible section; clock retains the server-time tooltip.
var COPY = {
  zh: { title: "今日", published: "今日发布", claimed: "今日接取", done: "今日完成", shutdown: "今日关闭", average: "平均难度", sample: "样本数", noSample: "无样本", clock: "以服务端当前时间为准" },
  en: { title: "Today", published: "Published today", claimed: "Claimed today", done: "Completed today", shutdown: "Closed today", average: "Avg difficulty", sample: "samples", noSample: "No samples", clock: "Based on the server's current time" },
};
var css = ".wbt-today{margin:12px 0}";
function Today(props) {
  var data = props.today;
  // An older server has no daily snapshot: omit the card rather than invent zero activity.
  if (!data || typeof data !== "object") return null;
  var lang = props.lang === "en" ? "en" : "zh", t = COPY[lang];
  var sample = Number.isFinite(data.avgSample) && data.avgSample > 0 ? data.avgSample : 0;
  var average = sample && Number.isFinite(data.avgDifficultyDone) ? data.avgDifficultyDone.toFixed(1) : "—";
  var metrics = ["published", "claimed", "done", "shutdown"].map(function (key) {
    var value = Number.isFinite(data[key]) ? data[key] : 0;
    return { key: key, label: t[key], value: value, aria: lang === "zh" ? t[key] + value + "条" : t[key] + ": " + value + " tasks" };
  });
  metrics.push({ key: "average", label: t.average, value: average,
    aria: t.average + (lang === "zh" ? "" : ": ") + average + ", " + (sample ? t.sample + " " + sample : t.noSample), sample: sample });
  return h("section", { className: "wbt-today", "aria-label": t.title, "aria-description": data.date, title: t.clock },
    h("style", null, css),
    h("div", { className: "wbt-kpis" }, metrics.map(function (metric) {
      return h("div", { key: metric.key, className: "wbt-kpi", role: "group", "aria-label": metric.aria },
        h("div", { className: "wbt-kpi-l", "aria-hidden": true }, metric.label),
        h("div", { className: "wbt-kpi-v", "aria-hidden": true }, metric.value,
          metric.sample !== undefined ? h("span", { className: "wbt-kpi-u" }, "±" + metric.sample) : null));
    })));
}
module.exports = Today;
