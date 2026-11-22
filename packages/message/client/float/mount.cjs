"use strict";
/**
 * 全局消息悬浮入口：可自由拖拽的浮动按钮（悬浮球式交互）。
 *
 * 数据流刻意不自己开 SSE——提示音模块（notify/notifier.cjs）已经订阅
 * `GET /workbench/api/events`，这里用它的 `subscribe()` 共用同一条事件流，
 * 否则会出现双连接与重复声音。计数以服务端为准：
 *   - 初始：message.unreadCount
 *   - message.created：+1，并按 id 去重
 *   - message.read：用事件里的 unread 覆写
 *   - 页面从隐藏转可见：重拉一次，纠正漏事件
 *
 * 位置与收起：
 *   - 位置存 `float.customPos`（"rx,ry" 归一化中心），拖拽松手时经 configSet 写一次；
 *     空串/非法值回退 `float.position` 指定的角位。
 *   - 距左右边缘 48px 内、空闲 `float.idleSeconds` 秒后，按钮半隐藏贴边；
 *     悬停/聚焦/拖拽/无交互计时未到时不收。
 *   - 半隐藏态来新消息：临时完全展开 2s（角标与弹跳可见），期间再来消息只顺延。
 *   - 拖拽过程只改 DOM，松手才落定并持久化；指针事件按 dsh-pet 的做法处理
 *     （5px 阈值、window mouseup 兜底、pointercancel 与 pointerup 同一收尾）。
 */

var styles = require("./style.cjs");
var buttons = require("./button.cjs");
var geo = require("./geometry.cjs");

var DOMAIN = "wb-addon-message";
var BASE = "/workbench/api";
var STYLE_ID = "wb-message-float-style";
var ADDON_ID = "wb-addon-message";
var INBOX_VIEW = "inbox";
var HOLD_MS = 2000;
var DRAG_THRESHOLD = 5;
var JUST_DRAGGED_MS = 120;
var POS_EPSILON = 0.001;

function readLang(doc) {
  var attr = doc && doc.documentElement && doc.documentElement.getAttribute("lang");
  return attr && attr.toLowerCase().indexOf("en") === 0 ? "en" : "zh";
}

function injectStyles(doc) {
  if (!doc || !doc.head || doc.getElementById(STYLE_ID)) return;
  var style = doc.createElement("style");
  style.id = STYLE_ID;
  style.textContent = styles().join("");
  doc.head.appendChild(style);
}

function makeCall(fetchImpl) {
  return function call(action, args) {
    return fetchImpl(BASE + "/domains/" + DOMAIN + "/actions/" + action, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(args || {}),
    })
      .then(function (res) { return res.json(); })
      .then(function (body) { return body && body.result !== undefined ? body.result : body; });
  };
}

/**
 * @param {{doc?: Document, win?: Window, fetchImpl?: Function, host?: Object, notifier?: Object}} [options]
 */
function createMount(options) {
  var opts = options || {};
  var doc = opts.doc || (typeof document !== "undefined" ? document : null);
  var win = opts.win || (typeof window !== "undefined" ? window : null);
  var host = opts.host || (win && win.__WB_HOST__) || null;
  var notifier = opts.notifier || null;
  var fetchImpl = opts.fetchImpl || (win && win.fetch ? win.fetch.bind(win) : null);
  var call = fetchImpl ? makeCall(fetchImpl) : null;

  var state = {
    mounted: false,
    root: null,
    btn: null,
    unsubscribe: null,
    seen: new Set(),
    count: 0,
    enabled: true,
    corner: "bottom-right",
    idleSeconds: 3,
    edgeSnap: true,
    customText: "",
    hasCustom: false,
    rx: 0.5,
    ry: 0.5,
    lift: 0,
    size: geo.SIZE,
    collapsed: false,
    side: "right",
    x: 0,
    y: 0,
    hovered: false,
    focused: false,
    dragging: false,
    pressed: false,
    pressX: 0,
    pressY: 0,
    startX: 0,
    startY: 0,
    expandedByPress: false,
    justDraggedUntil: 0,
    holdUntil: 0,
    idleTimer: null,
    onVisible: null,
    onResize: null,
    onWindowUp: null,
  };

  function now() {
    return Date.now ? Date.now() : new Date().getTime();
  }

  // 计时器统一走 win（测试可以注入假定时器）；Node 下顺手 unref，避免拖住测试进程。
  function later(fn, ms) {
    var setter = win && typeof win.setTimeout === "function" ? win.setTimeout.bind(win) : setTimeout;
    var timer = setter(fn, Math.max(0, ms || 0));
    if (timer && typeof timer.unref === "function") timer.unref();
    return timer;
  }

  function cancel(timer) {
    if (timer === null || timer === undefined) return;
    var clearer = win && typeof win.clearTimeout === "function" ? win.clearTimeout.bind(win) : clearTimeout;
    clearer(timer);
  }

  function disarm() {
    cancel(state.idleTimer);
    state.idleTimer = null;
  }

  function hostOverlay() {
    return doc && doc.querySelector ? doc.querySelector("[data-shell-overlay]") : null;
  }

  function metrics() {
    var vp = geo.viewport(doc, win);
    var size = geo.sizeOf(state.btn && state.btn.el, vp.width);
    var origin = { x: 0, y: 0 };
    if (state.root && typeof state.root.getBoundingClientRect === "function") {
      var rect = state.root.getBoundingClientRect();
      origin.x = Number(rect && rect.left) || 0;
      origin.y = Number(rect && rect.top) || 0;
    }
    return { width: vp.width, height: vp.height, size: size, origin: origin };
  }

  // 底部输入区：DSH 的会话输入框固定在主区底部，浮层直接贴底会压在发送按钮上。
  // 找不到就保持贴底，找到就把按钮抬到它上方（高度按实际测量，夹在 48–140px）。
  function liftAboveComposer() {
    if (!state.btn) return;
    state.lift = 0;
    if (!doc || typeof doc.querySelector !== "function") {
      state.btn.el.removeAttribute("data-lift");
      return;
    }
    var composer = doc.querySelector("[data-shell-composer], .dsh-composer, [contenteditable=true], .wb-composer");
    if (!composer || typeof composer.getBoundingClientRect !== "function") {
      state.btn.el.removeAttribute("data-lift");
      return;
    }
    var rect = composer.getBoundingClientRect();
    var height = rect && rect.height > 0 ? rect.height : 0;
    if (!height) {
      state.btn.el.removeAttribute("data-lift");
      return;
    }
    var lift = Math.min(Math.max(Math.round(height + 12), 48), 140);
    state.lift = lift;
    state.btn.el.setAttribute("data-lift", "1");
    state.btn.el.style.setProperty("--wbm-float-lift", lift + "px");
  }

  function place() {
    if (!state.root || !doc) return;
    var target = hostOverlay() || doc.body;
    if (target && state.root.parentNode !== target) target.appendChild(state.root);
  }

  // 展开态位置：自定义坐标优先，否则用配置里的角位。
  function basePoint(m) {
    if (state.hasCustom) return geo.pointOf(state.rx, state.ry, m.width, m.height, m.size);
    return geo.cornerPoint(state.corner, m.width, m.height, m.size, state.lift, geo.marginOf(m.width));
  }

  function paint(point, m) {
    state.x = point.x;
    state.y = point.y;
    state.size = m.size;
    if (!state.btn) return;
    state.btn.setPoint(point.x - m.origin.x, point.y - m.origin.y);
  }

  function render() {
    if (!state.btn) return;
    var m = metrics();
    if (state.collapsed) {
      var base = basePoint(m);
      var top = geo.clamp(base.y, 0, Math.max(0, m.height - m.size));
      paint(geo.collapsedPoint(state.side, m.size, m.width, top), m);
    } else {
      paint(basePoint(m), m);
    }
    state.btn.setCollapsed(state.collapsed);
    if (!state.dragging) state.btn.setReady();
  }

  function expand() {
    if (!state.collapsed) return;
    state.collapsed = false;
    render();
  }

  function collapse() {
    if (!state.enabled || state.collapsed || !state.edgeSnap || state.idleSeconds <= 0) return;
    if (state.hovered || state.focused || state.dragging || state.pressed) return;
    var m = metrics();
    var base = basePoint(m);
    if (!geo.nearEdge(base.x, m.size, m.width)) return;
    state.side = geo.sideOf(base.x, m.size, m.width);
    state.collapsed = true;
    render();
    disarm();
  }

  function arm(ms) {
    disarm();
    if (!state.enabled || !state.edgeSnap || state.idleSeconds <= 0) return;
    var delay = ms === undefined ? state.idleSeconds * 1000 : ms;
    state.idleTimer = later(function () {
      state.idleTimer = null;
      tick();
    }, delay);
  }

  function tick() {
    if (!state.mounted) return;
    var wait = state.holdUntil - now();
    if (wait > 0) {
      arm(wait);
      return;
    }
    if (state.hovered || state.focused || state.dragging || state.pressed) return;
    collapse();
  }

  // 拖拽落定后只写一次配置；位移小于 1‰ 视为没动，避免无意义写库。
  function persist() {
    if (!call) return;
    var last = geo.parsePos(state.customText);
    if (last && Math.abs(last.rx - state.rx) < POS_EPSILON && Math.abs(last.ry - state.ry) < POS_EPSILON) return;
    var text = geo.formatPos(state.rx, state.ry);
    state.customText = text;
    state.hasCustom = true;
    Promise.resolve(call("message.configSet", { values: { "float.customPos": text } })).catch(function () {});
  }

  function applyConfig(values) {
    if (!values) return;
    if (values["float.enabled"] !== undefined) state.enabled = values["float.enabled"] !== false;
    if (values["float.position"]) {
      state.corner = values["float.position"];
      if (!state.hasCustom) state.collapsed = false;
    }
    if (values["float.idleSeconds"] !== undefined) {
      state.idleSeconds = geo.clamp(Number(values["float.idleSeconds"]) || 0, 0, 60);
    }
    if (values["float.edgeSnap"] !== undefined) state.edgeSnap = values["float.edgeSnap"] !== false;
    if (values["float.customPos"] !== undefined) {
      var text = values["float.customPos"] === null || values["float.customPos"] === undefined
        ? ""
        : String(values["float.customPos"]);
      var parsed = geo.parsePos(text);
      state.customText = text;
      state.hasCustom = !!parsed;
      if (parsed) {
        state.rx = parsed.rx;
        state.ry = parsed.ry;
      } else {
        state.collapsed = false;
      }
    }
    if (!state.btn) return;
    state.btn.setPosition(state.corner);
    liftAboveComposer();
    state.btn.el.style.display = state.enabled ? "" : "none";
    if (!state.enabled) {
      state.count = 0;
      state.btn.setCount(0);
      state.collapsed = false;
      disarm();
    }
    place();
    render();
    if (state.enabled) arm();
    else disarm();
  }

  function applyCount(next) {
    state.count = next > 0 ? Math.floor(next) : 0;
    if (state.btn) state.btn.setCount(state.count);
    return state.count;
  }

  function activate() {
    if (host && typeof host.navigateAddon === "function") {
      try {
        if (host.navigateAddon(ADDON_ID, INBOX_VIEW) !== false) return;
      } catch (e) {
        /* 旧宿主可能只接受一个参数，落到下面的提示 */
      }
    }
    if (typeof console !== "undefined" && console.info) {
      console.info("[dsh-workbench-message] 当前宿主不支持跳转到消息收件箱，请在左侧导航打开「消息」");
    }
  }

  function detachWindowUp() {
    if (!state.onWindowUp || !win || typeof win.removeEventListener !== "function") return;
    win.removeEventListener("mouseup", state.onWindowUp);
    state.onWindowUp = null;
  }

  function eventPoint(event) {
    return {
      x: event && typeof event.clientX === "number" ? event.clientX : 0,
      y: event && typeof event.clientY === "number" ? event.clientY : 0,
    };
  }

  function onDown(event) {
    if (!state.enabled || !state.btn) return;
    // 只响应主键；右键/中键不进入拖拽（避免和上下文菜单抢行为）。
    if (event && typeof event.button === "number" && event.button !== 0) return;
    var m = metrics();
    var point = eventPoint(event);
    state.pressed = true;
    state.dragging = false;
    state.pressX = point.x;
    state.pressY = point.y;
    state.startX = state.x;
    state.startY = state.y;
    state.size = m.size;
    disarm();
    if (state.collapsed) {
      // 半隐藏态按下先整体露出来，再决定是点击（只展开）还是拖拽。
      expand();
      state.expandedByPress = true;
      state.startX = state.x;
      state.startY = state.y;
    }
    if (typeof state.btn.el.setPointerCapture === "function" && event && event.pointerId !== undefined) {
      try {
        state.btn.el.setPointerCapture(event.pointerId);
      } catch (err) {
        /* 捕获失败不影响 window 级兜底 */
      }
    }
    if (win && typeof win.addEventListener === "function" && !state.onWindowUp) {
      state.onWindowUp = function () { endPress(); };
      win.addEventListener("mouseup", state.onWindowUp);
    }
  }

  function onMove(event) {
    if (!state.pressed) return;
    var point = eventPoint(event);
    var dx = point.x - state.pressX;
    var dy = point.y - state.pressY;
    if (!state.dragging) {
      if (Math.sqrt(dx * dx + dy * dy) < DRAG_THRESHOLD) return;
      state.dragging = true;
      state.expandedByPress = false;
      state.holdUntil = 0;
      disarm();
      if (state.btn) state.btn.setDragging(true);
    }
    var m = metrics();
    paint(geo.clampPoint(state.startX + dx, state.startY + dy, m.size, m.width, m.height), m);
  }

  // pointerup / pointercancel / window mouseup 都走这里，收尾只做一次。
  function endPress() {
    if (!state.pressed) return;
    state.pressed = false;
    detachWindowUp();
    if (!state.dragging) return;
    state.dragging = false;
    if (state.btn) state.btn.setDragging(false);
    var m = metrics();
    var ratio = geo.ratioOf(state.x, state.y, m.width, m.height, m.size);
    state.rx = ratio.rx;
    state.ry = ratio.ry;
    state.hasCustom = true;
    state.collapsed = false;
    render();
    persist();
    state.justDraggedUntil = now() + JUST_DRAGGED_MS;
    arm();
  }

  function onClick() {
    if (!state.enabled) return;
    if (now() < state.justDraggedUntil) return;
    if (state.expandedByPress) {
      state.expandedByPress = false;
      expand();
      arm();
      return;
    }
    if (state.collapsed) {
      expand();
      arm();
      return;
    }
    activate();
  }

  function onEnter() {
    state.hovered = true;
    expand();
    disarm();
  }

  function onLeave() {
    state.hovered = false;
    var wait = state.holdUntil - now();
    arm(wait > 0 ? wait : state.idleSeconds * 1000);
  }

  function onFocus() {
    state.focused = true;
    expand();
    disarm();
  }

  function onBlur() {
    state.focused = false;
    arm();
  }

  function onResize() {
    if (!state.mounted) return;
    var m = metrics();
    // 收起态的半隐位置不是用户选的位置，按它反推会把手动坐标慢慢拉向边缘；
    // 只在完整显示时按当前像素回写归一化坐标。
    if (state.hasCustom && !state.collapsed) {
      var ratio = geo.ratioOf(state.x, state.y, m.width, m.height, m.size);
      state.rx = ratio.rx;
      state.ry = ratio.ry;
    }
    if (state.collapsed) state.side = geo.sideOf(basePoint(m).x, m.size, m.width);
    render();
  }

  function onEvent(event, data) {
    if (!state.btn || !state.mounted) return;
    if (event === "config") {
      applyConfig(data && data.values);
      return;
    }
    if (event === "message.read") {
      // 服务端权威值：标记已读的响应里带着最新未读数。
      if (data && typeof data.unread === "number") applyCount(data.unread);
      return;
    }
    if (event !== "message.created") return;
    var message = data && data.message;
    if (!message || !message.id) return;
    if (state.seen.has(message.id)) return;
    state.seen.add(message.id);
    if (state.seen.size > 500) state.seen.clear();
    applyCount(state.count + 1);
    if (state.btn) state.btn.pulse();
    // 半隐藏时新消息要能被看见：临时展开 2s，连续消息只顺延、不重复展开。
    if (state.collapsed) {
      state.collapsed = false;
      render();
    }
    state.holdUntil = now() + HOLD_MS;
    if (!state.hovered && !state.focused && !state.dragging) arm(HOLD_MS);
  }

  function refreshCount() {
    if (!call) return Promise.resolve(state.count);
    return call("message.unreadCount", {})
      .then(function (body) {
        var unread = body && typeof body.unread === "number" ? body.unread : null;
        return unread === null ? state.count : applyCount(unread);
      })
      .catch(function () { return state.count; });
  }

  function loadConfig() {
    if (!call) return Promise.resolve(state.enabled);
    return call("message.configGet", {})
      .then(function (body) {
        applyConfig(body && body.values);
        return state.enabled;
      })
      .catch(function () { return state.enabled; });
  }

  function bind() {
    var el = state.btn.el;
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", endPress);
    el.addEventListener("pointercancel", endPress);
    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointerleave", onLeave);
    el.addEventListener("focus", onFocus);
    el.addEventListener("blur", onBlur);
    if (win && typeof win.addEventListener === "function") {
      state.onResize = onResize;
      win.addEventListener("resize", state.onResize);
      state.onVisible = function () {
        if (doc.visibilityState === "visible") refreshCount();
      };
      win.addEventListener("visibilitychange", state.onVisible);
    }
  }

  function mount() {
    if (state.mounted || !doc) return state;
    injectStyles(doc);

    var root = doc.createElement("div");
    root.className = "wbm-float-root";
    root.setAttribute("data-message-float", "1");
    // 宿主浮层容器的 `.overlayLayer>*{pointer-events:auto}` 与样式表规则同权重，
    // 谁后注入谁生效；内联压住，保证浮层容器永远不吃页面点击。
    root.style.pointerEvents = "none";

    var btn = buttons.createButton({
      doc: doc,
      lang: readLang(doc),
      onClick: onClick,
    });
    root.appendChild(btn.el);
    state.root = root;
    state.btn = btn;
    state.mounted = true;
    place();
    liftAboveComposer();
    render();
    bind();

    if (notifier && typeof notifier.subscribe === "function") state.unsubscribe = notifier.subscribe(onEvent);

    loadConfig().then(function () {
      // 关闭悬浮入口时不必再拉未读数。
      if (state.enabled) refreshCount();
    });
    return state;
  }

  function destroy() {
    if (state.unsubscribe) state.unsubscribe();
    state.unsubscribe = null;
    disarm();
    state.holdUntil = 0;
    detachWindowUp();
    if (win && typeof win.removeEventListener === "function") {
      if (state.onResize) win.removeEventListener("resize", state.onResize);
      if (state.onVisible) win.removeEventListener("visibilitychange", state.onVisible);
    }
    state.onResize = null;
    state.onVisible = null;
    if (state.btn) state.btn.destroy();
    if (state.root && state.root.parentNode) state.root.parentNode.removeChild(state.root);
    state.btn = null;
    state.root = null;
    state.mounted = false;
  }

  return {
    mount: mount,
    destroy: destroy,
    refreshCount: refreshCount,
    applyConfig: applyConfig,
    readState: function () {
      return {
        mounted: state.mounted,
        count: state.count,
        enabled: state.enabled,
        position: state.corner,
        collapsed: state.collapsed,
        side: state.side,
        custom: state.hasCustom,
        customText: state.customText,
        idleSeconds: state.idleSeconds,
        edgeSnap: state.edgeSnap,
        seen: state.seen.size,
      };
    },
  };
}

module.exports = { createMount: createMount, STYLE_ID: STYLE_ID, DOMAIN: DOMAIN, HOLD_MS: HOLD_MS };
