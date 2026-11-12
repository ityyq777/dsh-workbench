// Browser entry; generated output is lib/client.js.
var host = window.__WB_HOST__;
if (host) {
  var styleId = "wb-addon-storage-style";
  if (!document.getElementById(styleId)) {
    var style = document.createElement("style");
    style.id = styleId;
    style.textContent = require("./ui/styles.cjs");
    document.head.appendChild(style);
  }
  var h = require("react").createElement, Icon = require("./ui/icons.cjs").Icon;
  function tabIcon(name) { return function StorageTabIcon() { return h(Icon, { name: name, size: 14 }); }; }
  host.registerAddon({
    id: "wb-addon-storage",
    version: "1.5.1",
    views: [
      { id: "stats", icon: tabIcon("chart"), title: { zh: "统计", en: "Statistics" }, component: require("./views/stats.cjs").Stats },
      { id: "storage", icon: tabIcon("list"), title: { zh: "记录", en: "Records" }, component: require("./views/records.cjs").Records },
      { id: "config", icon: tabIcon("settings"), title: { zh: "配置", en: "Config" }, component: require("./views/config.cjs").ConfigView },
      { id: "data", icon: tabIcon("database"), title: { zh: "数据", en: "Data" }, component: require("./views/data.cjs").DataView },
      { id: "actions", icon: tabIcon("code-2"), title: { zh: "Action", en: "Actions" }, component: require("./views/actions.cjs").ActionSchemaView },
    ],
  });
} else console.error("[wb-addon-storage] Missing workbench host");
module.exports = { name: "dsh-workbench-storage", inject: [], apply: function () {} };
