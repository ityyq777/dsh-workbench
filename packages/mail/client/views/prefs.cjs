"use strict";
/**
 * 阅读侧偏好：把配置项（lib/infra/config.js 的 ITEMS）收敛成视图直接能用的形状。
 * 单独成文件是为了让 messages.cjs 只关心布局；配置读不到时这里兜默认值，
 * 保证列表与阅读区永远有可用取值。
 */
var useConfig = require("./config.cjs").useConfig;

/** 与 lib/infra/config.js 的默认值保持一致。 */
var PREFS = { "images.remote": true, "display.html": true, "read.autoSeen": true, "list.pageSize": 20, "display.mailTheme": "original" };

function clampPageSize(value) {
  var n = Math.round(Number(value));
  if (!Number.isFinite(n)) n = PREFS["list.pageSize"];
  return Math.min(Math.max(n, 10), 50);
}

/** 读配置并给出 { 配置项: 值 } + pageSize（已夹到 10–50）。 */
function usePrefs(React, api) {
  var cfg = useConfig(React, api, PREFS);
  var prefs = Object.assign({}, PREFS, cfg.values || {});
  prefs.pageSize = clampPageSize(prefs["list.pageSize"]);
  return prefs;
}

/** 正文取材：HTML 是否启用、要展示的附件（去掉内联图）、有没有纯文本兜底。 */
function readBody(prefs, data, current) {
  var html = prefs["display.html"] === false ? "" : data.html || current.html || "";
  var all = data.attachments || current.attachments || [];
  return { html: html, files: all.filter(function (a) { return !a.inline; }), hasText: !!(data.body || current.body) };
}

module.exports = { PREFS: PREFS, clampPageSize: clampPageSize, usePrefs: usePrefs, readBody: readBody };
