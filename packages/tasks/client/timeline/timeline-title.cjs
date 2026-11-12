"use strict";
// Preserve ordinary titles; only a nonempty last pipe-delimited parent becomes an eyebrow.
module.exports = function splitTitle(value) {
  var text = String(value || "").trim(), at = Math.max(text.lastIndexOf("|"), text.lastIndexOf("｜"));
  return at > 0 && text.slice(at + 1).trim() ? { eyebrow: text.slice(0, at).trim(), title: text.slice(at + 1).trim() } : { eyebrow: "", title: text };
};
