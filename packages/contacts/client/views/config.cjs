"use strict";
var C = require("../ui/common.cjs");
module.exports = function ConfigView(props) {
  var h = props.h, api = props.api, React = props.React;
  var st = C.useLoad(React, api, "contacts.status", {}, []);
  return h("div", { className: "wbct-wrap" },
    h("h2", null, "设置"),
    st.error ? h(C.Notice, { h: h, kind: "error", text: st.error }) : null,
    h("div", { className: "wbct-panel" },
      h("h3", null, "数据"),
      h("p", null, "联系人 " + ((st.data && st.data.contacts) || 0) + " 个，分组 " + ((st.data && st.data.groups) || 0) + " 个，字段 " + ((st.data && st.data.fields) || 0) + " 个。"),
      h("p", null, "联系人只在本机保存，不参与云同步；备份包含联系人与分组。")),
    h("div", { className: "wbct-panel" },
      h("h3", null, "导入导出"),
      h("p", null, "vCard 3.0；导入按 FN 与 EMAIL/TEL/URL 识别，空姓名或空联系方式会跳过。"),
      h("p", { className: "wbct-muted" }, "CardDAV 同步不在本插件；由连接器驱动另行处理。")));
};
