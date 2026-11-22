"use strict";
// 弹幕气泡的样式计算：网页层、详情面板预览共用，避免两处各写一份漂移。
// 桌面透明窗是独立运行时，样式仍由 runtime/electron-helper/renderer.js 内联维护。

var FAMILY = {
  rounded: '"SF Pro Rounded", "PingFang SC", "Hiragino Sans GB", system-ui, sans-serif',
  serif: 'Georgia, "Songti SC", "Noto Serif CJK SC", serif',
  mono: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
};

var TEXT_LIMIT = 140;

function num(value, fallback) {
  if (value === "" || value === null || value === undefined) return fallback;
  var n = Number(value);
  return isFinite(n) ? n : fallback;
}

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

function textOf(payload) {
  var prefix = payload && payload.prefix ? payload.prefix + " " : "";
  return prefix + String((payload && payload.body) || "").slice(0, TEXT_LIMIT);
}

/**
 * 把一条播放 payload 收敛成实际落到气泡上的样式。
 * config 提供全局兜底（字号/速度/不透明度），payload 里的单条设置优先。
 */
function styleOf(payload, config) {
  var base = config || {};
  var p = payload || {};
  return {
    text: textOf(p),
    plain: p.card === false,
    fontSize: clamp(num(p.fontSize, num(base.fontSize, 15)), 10, 48),
    fontWeight: clamp(num(p.weight, 0) || 480, 300, 800),
    fontFamily: FAMILY[p.family] || "",
    opacity: clamp(num(p.opacity, num(base.opacity, 1)), 0.15, 1),
    speed: clamp(num(p.speed, num(base.speed, 150)), 30, 800),
  };
}

/** 建一个和真实弹幕完全同构的气泡元素（含 tone / 纯文字类名）。 */
function buildChip(doc, payload, config) {
  var style = styleOf(payload, config);
  var el = doc.createElement("span");
  el.className =
    "wbdm-dm-chip wbdm-dm-tone-" + (payload && payload.tone ? payload.tone : "normal") + (style.plain ? " wbdm-dm-plain" : "");
  el.style.fontSize = style.fontSize + "px";
  el.style.fontWeight = String(style.fontWeight);
  if (style.fontFamily) el.style.fontFamily = style.fontFamily;
  el.style.opacity = String(style.opacity);
  el.textContent = style.text;
  return { el: el, style: style };
}

module.exports = {
  FAMILY: FAMILY,
  textOf: textOf,
  styleOf: styleOf,
  buildChip: buildChip,
};
