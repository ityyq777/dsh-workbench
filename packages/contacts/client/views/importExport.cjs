"use strict";
var C = require("../ui/common.cjs");
module.exports = function ImportExportView(props) {
  var h = props.h, api = props.api, React = props.React;
  var text = React.useState(""); var out = React.useState(""); var msg = React.useState("");
  function doImport() {
    C.call(api, "contacts.importVcf", { text: text[0] }).then(function (r) { msg[1]("导入 " + r.imported + " 条，跳过 " + r.skipped + " 条"); }).catch(function (e) { msg[1](C.errText(e)); });
  }
  function doExport() {
    C.call(api, "contacts.exportVcf", {}).then(function (r) { out[1](r.vcf); msg[1]("导出 " + r.count + " 条"); }).catch(function (e) { msg[1](C.errText(e)); });
  }
  return h("div", { className: "wbct-wrap" },
    h("h2", null, "导入 / 导出"),
    h(C.Notice, { h: h, text: msg[0] }),
    h("div", { className: "wbct-panel" },
      h("h3", null, "导入 vCard"),
      h("p", { className: "wbct-muted" }, "粘贴 vCard 3.0 文本；每张卡片需有 FN 与至少一个 EMAIL/TEL/URL。最多 500 条。"),
      h("textarea", { className: "wbct-input wbct-code", rows: 8, value: text[0], onChange: function (e) { text[1](e.target.value); }, placeholder: "BEGIN:VCARD..." }),
      h(C.Btn, { h: h, kind: "primary", onClick: doImport }, "导入")),
    h("div", { className: "wbct-panel" },
      h("h3", null, "导出 vCard"),
      h(C.Btn, { h: h, onClick: doExport }, "导出全部（最多 200 条）"),
      h("textarea", { className: "wbct-input wbct-code", rows: 10, value: out[0], readOnly: true })));
};
