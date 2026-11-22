"use strict";
// 宿主页面弹幕层的挂载点：读取配置/主题、订阅播放事件、维护 body 或 shell.overlay 两个落点。
// 由 client.src.cjs 在模块加载时调用一次；不依赖 React 渲染。

var overlayStyle = require("./style.cjs");
var layerModule = require("./layer.cjs");

var DOMAIN = "wb-addon-danmaku";
// 宿主 /domains/:id/actions/:action 的 action 段要完整 action 名（danmaku.configGet），
// 只写短名 configGet 会 404，导致弹幕层永远读不到用户配置、退回内置默认值。
var ACTION_PREFIX = "danmaku.";
var STYLE_ID = "wbdm-dm-styles";
var THEME_DEBOUNCE = 700;

var DEFAULTS = {
  enabled: true,
  surface: "both",
  layer: "body",
  speed: 150,
  lanes: 7,
  band: "full",
  fontSize: 15,
  opacity: 0.92,
  motion: "auto",
  pauseOnInput: true,
};

var THEME_VARS = {
  fg: ["--dsw-alias-label-primary"],
  bg: ["--dsw-alias-bg-layer-1", "--dsw-alias-bg-base", "--wb-card"],
  border: ["--dsw-alias-border-l2", "--dsw-alias-border-l3", "--wb-border"],
  accent: ["--dsw-alias-brand-primary", "--wb-accent"],
  ok: ["--dsw-alias-state-success-primary", "--wb-ok"],
  warn: ["--dsw-alias-state-warn-primary", "--wb-warn"],
  danger: ["--dsw-alias-state-error-primary", "--wb-danger"],
};

function injectStyles() {
  if (document.getElementById(STYLE_ID)) return;
  var style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = overlayStyle().join("");
  (document.head || document.documentElement).appendChild(style);
}

function call(action, args) {
  return fetch("/workbench/api/domains/" + DOMAIN + "/actions/" + encodeURIComponent(ACTION_PREFIX + action), {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(args || {}),
  }).then(function (res) {
    return res.json().catch(function () {
      return { ok: false, error: "HTTP " + res.status };
    });
  });
}

function readTheme() {
  var probe = document.body || document.documentElement;
  var cs = window.getComputedStyle(probe);
  var out = {};
  Object.keys(THEME_VARS).forEach(function (key) {
    var names = THEME_VARS[key];
    for (var i = 0; i < names.length; i += 1) {
      var value = cs.getPropertyValue(names[i]).trim();
      if (value) {
        out[key] = value;
        return;
      }
    }
  });
  var bg = out.bg || "";
  var rgb = /rgba?\(([^)]+)\)/.exec(bg);
  if (rgb) {
    var parts = rgb[1].split(",").map(function (part) {
      return parseFloat(part);
    });
    if (parts.length >= 3) {
      var l = (0.2126 * parts[0] + 0.7152 * parts[1] + 0.0722 * parts[2]) / 255;
      out.dark = l < 0.45;
    }
  }
  if (out.dark === undefined) {
    out.dark = document.documentElement.classList.contains("dark");
  }
  return out;
}

function mount() {
  if (window.__WB_DANMAKU_MOUNTED__) return window.__WB_DANMAKU_MOUNTED__;
  injectStyles();

  var root = document.createElement("div");
  root.className = "wbdm-dm-root";
  root.setAttribute("data-danmaku-root", "1");
  root.setAttribute("aria-hidden", "true");
  document.body.appendChild(root);

  var layer = layerModule.createWebLayer({ root: root });
  var config = Object.assign({}, DEFAULTS);
  var surface = null;
  var sse = null;
  var retries = 0;
  var configLoaded = false;
  var themeTimer = null;
  var lastThemeKey = "";
  var typingTimer = null;
  var TYPING_IDLE_MS = 3000;

  function place(nextLayer) {
    var target = document.body;
    var mode = "body";
    if (nextLayer === "overlay") {
      var host = document.querySelector("[data-shell-overlay]");
      if (host) {
        target = host;
        mode = "overlay";
      }
    }
    root.setAttribute("data-layer", mode);
    if (root.parentNode !== target) target.appendChild(root);
  }

  function apply(values) {
    if (!values) return;
    config = Object.assign(config, values);
    layer.update(config);
    surface = config.surface || "both";
    var visible = config.enabled !== false && surface !== "desktop" && surface !== "none";
    root.style.display = visible ? "" : "none";
    root.style.zIndex = config.layer === "overlay" ? "" : "780";
    if (visible) place(config.layer);
  }

  function refresh() {
    return call("configGet", {})
      .then(function (res) {
        var result = res && res.result ? res.result : res;
        if (res && res.ok && result && result.values) {
          retries = 0;
          configLoaded = true;
          apply(result.values);
          return;
        }
        throw new Error((res && res.error) || "配置读取失败");
      })
      .catch(function () {
        if (retries < 5) {
          retries += 1;
          window.setTimeout(refresh, 1500 * retries);
        }
      });
  }

  function syncTheme() {
    window.clearTimeout(themeTimer);
    themeTimer = window.setTimeout(function () {
      var theme = readTheme();
      var key = JSON.stringify(theme);
      if (key === lastThemeKey) return;
      lastThemeKey = key;
      layer.theme(theme);
      call("theme", { colors: theme }).catch(function () {
        /* 桌面层没运行时忽略 */
      });
    }, THEME_DEBOUNCE);
  }

  function editableFrom(target) {
    if (!target || !target.closest) return null;
    return target.closest('input, textarea, [contenteditable=""], [contenteditable="true"], [contenteditable="plaintext-only"]');
  }

  // 暂停只跟“正在打字”有关：点进输入框但没输入时不暂停，停手一段时间后自动继续。
  function onTyping(event) {
    if (!configLoaded || !config.pauseOnInput) return;
    if (!editableFrom(event.target)) return;
    window.clearTimeout(typingTimer);
    layer.pause(true);
    typingTimer = window.setTimeout(function () {
      typingTimer = null;
      layer.pause(false);
    }, TYPING_IDLE_MS);
  }

  function onFocusOut(event) {
    if (!configLoaded || !config.pauseOnInput) return;
    if (!editableFrom(event.target)) return;
    window.clearTimeout(typingTimer);
    typingTimer = null;
    window.setTimeout(function () {
      layer.pause(false);
    }, 120);
  }

  function onVisible() {
    if (document.hidden) layer.pause(true);
    else {
      layer.pause(false);
      refresh();
    }
  }

  function connect() {
    if (sse) return;
    sse = new EventSource("/workbench/api/events");
    // 宿主用具名事件 domain-event 推送（不是默认 message），必须 addEventListener，
    // 否则 onmessage 永远收不到 play/changed。
    sse.addEventListener("domain-event", function (event) {
      var payload;
      try {
        payload = JSON.parse(event.data);
      } catch (error) {
        return;
      }
      if (!payload || payload.domainId !== DOMAIN) return;
      if (payload.event === "play") {
        layer.play(payload.data || {});
      } else if (payload.event === "changed") {
        refresh();
      }
    });
    sse.onopen = function () {
      if (!configLoaded) {
        retries = 0;
        refresh();
      }
    };
    sse.onerror = function () {
      /* EventSource 自带重连 */
    };
  }

  document.addEventListener("input", onTyping, true);
  document.addEventListener("focusout", onFocusOut, true);
  document.addEventListener("visibilitychange", onVisible);
  try {
    var mq = window.matchMedia("(prefers-color-scheme: dark)");
    if (mq && mq.addEventListener) mq.addEventListener("change", syncTheme);
  } catch (error) {
    /* 老版本忽略 */
  }
  var themeObserver = new MutationObserver(syncTheme);
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "style", "data-theme"] });

  function destroy() {
    if (sse) sse.close();
    themeObserver.disconnect();
    layer.destroy();
    if (root.parentNode) root.parentNode.removeChild(root);
    document.removeEventListener("input", onTyping, true);
    document.removeEventListener("focusout", onFocusOut, true);
    document.removeEventListener("visibilitychange", onVisible);
    window.__WB_DANMAKU_MOUNTED__ = null;
  }

  var api = { refresh: refresh, destroy: destroy, layer: layer, root: root };
  window.__WB_DANMAKU_MOUNTED__ = api;

  syncTheme();
  refresh();
  connect();
  return api;
}

module.exports = { mount: mount, call: call, DOMAIN: DOMAIN };
