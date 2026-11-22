"use strict";
/**
 * 全局消息悬浮按钮：纯 DOM（不依赖 React），浮层在插件页之外常驻。
 *
 * 图标用 lucide `message-square` 的同款几何内联绘制：这里在 React 之外，
 * 拿不到宿主 react，也不想为一张图标把 lucide 运行时打进消息插件。
 */

var ICON_PATH =
  "M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z";
var PULSE_MS = 600;

function label(lang, count) {
  var n = count > 0 ? count : 0;
  if (lang === "en") return n > 0 ? "Messages, " + n + " unread" : "Messages, no unread";
  return n > 0 ? "消息，" + n + " 条未读" : "消息，无未读";
}

function text(count) {
  return count > 99 ? "99+" : String(count);
}

/**
 * @param {{doc?: Document, lang?: string, onActivate?: Function, onClick?: Function}} options
 * @returns {{el: HTMLElement, setCount: Function, pulse: Function, setPosition: Function, setLang: Function,
 *   setPoint: Function, setCollapsed: Function, setDragging: Function, setReady: Function, destroy: Function}}
 */
function createButton(options) {
  var doc = options.doc || document;
  var lang = options.lang === "en" ? "en" : "zh";
  var onActivate = typeof options.onActivate === "function" ? options.onActivate : function () {};
  // 挂载层要自己判断「这次点击该展开还是跳转」，所以允许覆盖默认的点击行为。
  var onClick = typeof options.onClick === "function" ? options.onClick : null;
  var count = 0;
  var pulseTimer = null;

  var btn = doc.createElement("button");
  btn.type = "button";
  btn.className = "wbm-float-btn";
  // 外壳对全局 button 有圆角规则，内联再钉一次，保证始终是圆形按钮。
  btn.style.borderRadius = "50%";
  // 容器整体不吃点击，但按钮本身必须收事件；内联避免被宿主浮层规则覆盖。
  btn.style.pointerEvents = "auto";
  btn.setAttribute("data-pos", "bottom-right");
  btn.setAttribute("aria-label", label(lang, 0));
  btn.setAttribute("title", label(lang, 0));

  var svg = doc.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", "1.7");
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("stroke-linejoin", "round");
  svg.setAttribute("aria-hidden", "true");
  var path = doc.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", ICON_PATH);
  svg.appendChild(path);
  btn.appendChild(svg);

  var badge = doc.createElement("span");
  badge.className = "wbm-float-badge";
  badge.setAttribute("aria-hidden", "true");
  btn.appendChild(badge);

  function announce(next) {
    var text_ = label(lang, next);
    btn.setAttribute("aria-label", text_);
    btn.setAttribute("title", text_);
  }

  function setCount(next) {
    var n = Number(next);
    count = isFinite(n) && n > 0 ? Math.floor(n) : 0;
    badge.textContent = text(count);
    if (count > 0) btn.setAttribute("data-unread", "1");
    else btn.removeAttribute("data-unread");
    announce(count);
    return count;
  }

  function pulse() {
    if (!btn || typeof btn.setAttribute !== "function") return;
    // 连续消息合并为一次：动画进行中不再重启，避免队列堆积。
    if (btn.getAttribute("data-pulse") === "1") return;
    btn.setAttribute("data-pulse", "1");
    if (typeof setTimeout !== "function") return;
    pulseTimer = setTimeout(function () {
      pulseTimer = null;
      btn.removeAttribute("data-pulse");
    }, PULSE_MS);
  }

  function setPosition(pos) {
    btn.setAttribute("data-pos", pos === "bottom-left" ? "bottom-left" : "bottom-right");
  }

  function setLang(next) {
    lang = next === "en" ? "en" : "zh";
    announce(count);
  }

  // 位置一律由挂载层算好像素坐标传进来：样式不再写死 right/bottom，
  // 这样自由拖拽、贴边半隐、窗口缩放都只是改 left/top。
  function setPoint(x, y) {
    btn.style.left = Math.round(x) + "px";
    btn.style.top = Math.round(y) + "px";
  }

  function setCollapsed(on) {
    if (on) btn.setAttribute("data-collapsed", "1");
    else btn.removeAttribute("data-collapsed");
  }

  function setDragging(on) {
    if (on) btn.setAttribute("data-dragging", "1");
    else btn.removeAttribute("data-dragging");
  }

  // 首次定位后打开 left/top 过渡，避免从 (0,0) 滑到目标位置。
  function setReady() {
    btn.setAttribute("data-ready", "1");
  }

  btn.addEventListener("click", function (event) {
    if (event && typeof event.preventDefault === "function") event.preventDefault();
    if (onClick) {
      onClick(event);
      return;
    }
    onActivate();
  });

  function destroy() {
    if (pulseTimer && typeof clearTimeout === "function") clearTimeout(pulseTimer);
    pulseTimer = null;
    if (btn.parentNode) btn.parentNode.removeChild(btn);
  }

  return {
    el: btn,
    setCount: setCount,
    pulse: pulse,
    setPosition: setPosition,
    setLang: setLang,
    setPoint: setPoint,
    setCollapsed: setCollapsed,
    setDragging: setDragging,
    setReady: setReady,
    destroy: destroy,
  };
}

module.exports = { createButton: createButton, ICON_PATH: ICON_PATH, PULSE_MS: PULSE_MS };
