"use strict";
var h = require("react").createElement;
var safeImage = require("./ui.cjs").safeImage;
function images(value) {
  try {
    var list = typeof value === "string" ? JSON.parse(value) : value;
    if (!Array.isArray(list) || !list.length) return [];
    var urls = list.map(function (url) { return typeof url === "string" ? safeImage(url) : ""; });
    return urls.every(Boolean) ? urls : [];
  } catch (_) { return []; }
}
function text(value) { return value == null ? "NULL" : String(value); }
function picture(url, index, lang) {
  return h("img", { key: index, src: url, alt: (lang === "en" ? "Image " : "图片 ") + (index + 1), loading: "lazy", referrerPolicy: "no-referrer" });
}
module.exports = {
  img_list: {
    render: function (ctx) {
      var urls = images(ctx.value);
      if (!urls.length) return h("span", { className: "v" }, text(ctx.value));
      return h("button", {
        type: "button", className: ctx.prefix + "-btn " + ctx.prefix + "-images",
        "aria-label": (ctx.lang === "en" ? "Preview images: " : "预览图片：") + urls.length,
        onClick: function (e) { e.stopPropagation(); ctx.openDetail(); },
      }, urls.slice(0, 3).map(function (url, i) { return picture(url, i, ctx.lang); }),
      urls.length > 3 ? h("span", null, "+" + (urls.length - 3)) : null);
    },
    detail: function (ctx) {
      var urls = images(ctx.value);
      return urls.length ? h("div", { className: ctx.prefix + "-gallery" }, urls.map(function (url, i) { return picture(url, i, ctx.lang); }))
        : h("pre", null, text(ctx.value));
    },
  },
  stock: {
    kind: "text", type: "TEXT",
    render: function (ctx) { return h("span", { className: "v" }, text(ctx.value)); },
  },
  remark: {
    render: function (ctx) {
      var value = text(ctx.value);
      return h("span", { className: "v", title: value }, value.length > 80 ? value.slice(0, 80) + "…" : value);
    },
  },
};
