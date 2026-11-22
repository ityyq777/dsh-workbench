"use strict";
/**
 * 悬浮球的几何计算：位置统一用「归一化中心坐标」(rx, ry) 保存，
 * 像素坐标每次都按当前视口与按钮实际尺寸换算，所以窗口缩放、换显示器不会漂。
 *
 * 这里只放纯函数，不碰 DOM 事件，方便 scripts/test-message-float.mjs 直接测。
 * 边界规则：
 *   - 拖拽/缩放时按钮必须完整留在视口内（clampPoint），
 *   - 收起时按需求允许半个圆移出视口，但命中区仍有一半可见；
 *   - 距左右边缘 EDGE_ZONE 以内算「位于边缘」，才触发空闲自动收起。
 */

var MIN_VISIBLE = 24;
var EDGE_ZONE = 48;
var EDGE_INSET = 20;
var EDGE_INSET_NARROW = 12;
var NARROW_WIDTH = 640;
var SIZE = 46;
var SIZE_NARROW = 40;
var FALLBACK_WIDTH = 1280;
var FALLBACK_HEIGHT = 800;

function clamp(value, min, max) {
  if (!isFinite(value)) return min;
  if (max < min) return min;
  return Math.min(Math.max(value, min), max);
}

function viewport(doc, win) {
  var el = doc && doc.documentElement;
  var width = Number(el && el.clientWidth) || Number(win && win.innerWidth) || FALLBACK_WIDTH;
  var height = Number(el && el.clientHeight) || Number(win && win.innerHeight) || FALLBACK_HEIGHT;
  return { width: width > 0 ? width : FALLBACK_WIDTH, height: height > 0 ? height : FALLBACK_HEIGHT };
}

function sizeOf(el, viewportWidth) {
  var rect = null;
  if (el && typeof el.getBoundingClientRect === "function") {
    try {
      rect = el.getBoundingClientRect();
    } catch (e) {
      rect = null;
    }
  }
  var size = rect && Number(rect.width) > 0 ? Number(rect.width) : 0;
  if (!size) size = viewportWidth <= NARROW_WIDTH ? SIZE_NARROW : SIZE;
  return size;
}

function marginOf(viewportWidth) {
  return viewportWidth <= NARROW_WIDTH ? EDGE_INSET_NARROW : EDGE_INSET;
}

/** 默认角位的左上角像素坐标（右下 / 左下，lift 是避开输入框的抬高量）。 */
function cornerPoint(corner, viewportWidth, viewportHeight, size, lift, margin) {
  var inset = margin === undefined ? marginOf(viewportWidth) : margin;
  var x = corner === "bottom-left" ? inset : viewportWidth - inset - size;
  var y = viewportHeight - inset - size - (Number(lift) || 0);
  return { x: clamp(x, 0, Math.max(0, viewportWidth - size)), y: clamp(y, 0, Math.max(0, viewportHeight - size)) };
}

/** 解析配置里的 "rx,ry"；空串、缺逗号、非数字、越界都返回 null（调用方回退默认角）。 */
function parsePos(text) {
  if (typeof text !== "string") return null;
  var raw = text.trim();
  if (!raw) return null;
  var parts = raw.split(",");
  if (parts.length !== 2) return null;
  var rx = Number(parts[0]);
  var ry = Number(parts[1]);
  if (!isFinite(rx) || !isFinite(ry)) return null;
  if (rx < 0 || rx > 1 || ry < 0 || ry > 1) return null;
  return { rx: rx, ry: ry };
}

/** 写成 "rx,ry"（4 位小数），拖拽落定时只写一次配置。 */
function formatPos(rx, ry) {
  return Number(rx).toFixed(4) + "," + Number(ry).toFixed(4);
}

/** 归一化中心 → 左上角像素坐标。 */
function pointOf(rx, ry, viewportWidth, viewportHeight, size) {
  return {
    x: clamp(Number(rx) * viewportWidth - size / 2, 0, Math.max(0, viewportWidth - size)),
    y: clamp(Number(ry) * viewportHeight - size / 2, 0, Math.max(0, viewportHeight - size)),
  };
}

/** 左上角像素坐标 → 归一化中心（夹取后再换算，保证写进配置的值一定合法）。 */
function ratioOf(x, y, viewportWidth, viewportHeight, size) {
  var p = clampPoint(x, y, size, viewportWidth, viewportHeight);
  return {
    rx: clamp((p.x + size / 2) / viewportWidth, 0, 1),
    ry: clamp((p.y + size / 2) / viewportHeight, 0, 1),
  };
}

/** 拖拽/缩放时保持按钮完整可见（不整只丢出视口）。 */
function clampPoint(x, y, size, viewportWidth, viewportHeight) {
  return {
    x: clamp(x, 0, Math.max(0, viewportWidth - size)),
    y: clamp(y, 0, Math.max(0, viewportHeight - size)),
  };
}

function gaps(left, size, viewportWidth) {
  return { left: left, right: viewportWidth - left - size };
}

/** 是否「位于页面边缘」：左或右至少一侧进入 EDGE_ZONE。 */
function nearEdge(left, size, viewportWidth) {
  var g = gaps(left, size, viewportWidth);
  return g.left <= EDGE_ZONE || g.right <= EDGE_ZONE;
}

/** 就近选择要停靠的一侧。 */
function sideOf(left, size, viewportWidth) {
  var g = gaps(left, size, viewportWidth);
  return g.left <= g.right ? "left" : "right";
}

/** 收起态：半个圆移出视口，只留一半可点。 */
function collapsedPoint(side, size, viewportWidth, y) {
  return {
    x: side === "left" ? -size / 2 : viewportWidth - size / 2,
    y: y,
  };
}

module.exports = {
  MIN_VISIBLE: MIN_VISIBLE,
  EDGE_ZONE: EDGE_ZONE,
  NARROW_WIDTH: NARROW_WIDTH,
  SIZE: SIZE,
  SIZE_NARROW: SIZE_NARROW,
  clamp: clamp,
  viewport: viewport,
  sizeOf: sizeOf,
  marginOf: marginOf,
  cornerPoint: cornerPoint,
  parsePos: parsePos,
  formatPos: formatPos,
  pointOf: pointOf,
  ratioOf: ratioOf,
  clampPoint: clampPoint,
  nearEdge: nearEdge,
  sideOf: sideOf,
  collapsedPoint: collapsedPoint,
};
