"use strict";
var C = require("./common.cjs");
function size(n) {
  return n >= 1048576 ? (n / 1048576).toFixed(1) + " MiB" : n >= 1024 ? Math.ceil(n / 1024) + " KiB" : n + " B";
}
function save(file) {
  var binary = atob(file.base64), bytes = Uint8Array.from(binary, function(c) { return c.charCodeAt(0); });
  if (bytes.length !== file.size) throw new Error("附件传输不完整，请重试");
  var url = URL.createObjectURL(new Blob([bytes], {type:"application/octet-stream"}));
  var a = document.createElement("a");
  try {
    a.href = url;
    a.download = String(file.filename || "附件").split(/[\\/]/).pop().replace(/[\u0000-\u001f\u007f<>:"|?*\u202a-\u202e\u2066-\u2069]/g, "_").replace(/^[. ]+|[. ]+$/g, "") || "附件";
    document.body.appendChild(a); a.click();
  } finally { a.remove(); setTimeout(function () { URL.revokeObjectURL(url); }, 30000); }
}
module.exports = function Attachments(props) {
  var h = props.h, items = props.items || [];
  var busy = props.React.useState(""), error = props.React.useState("");
  if (!items.length) return null;
  async function download(item) {
    busy[1](item.id); error[1]("");
    try { save(await C.call(props.api, "mail.attachmentDownload", {id:item.id})); }
    catch (e) { error[1](C.errText(e)); }
    finally { busy[1](""); }
  }
  return h("div", {className:"wbml-attach"},
    h("strong", {className:"wbml-attach-title"}, "附件（" + items.length + "）"),
    h("div", {className:"wbml-attach-list"}, items.map(function(item) {
      return h("div", {className:"wbml-row",key:item.id},
        h("span", {title:item.mime}, item.filename + " · " + (item.section ? "传输 " : "") + size(item.size)),
        h(C.Btn, {h:h,disabled:!!busy[0] || props.localOnly || !item.section, onClick:function() { download(item); }}, props.localOnly ? "仅附件信息" : !item.section ? "请重新下载正文" : busy[0] === item.id ? "下载中…" : "保存附件"));
    })), h(C.Notice, {h:h,kind:"error",text:error[0]}));
};
