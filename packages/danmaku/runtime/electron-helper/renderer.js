"use strict";
// 桌面层的渲染进程：只做动画。节奏与内容全部来自宿主，窗口本身不读配置、不选条。
(function () {
  var field = document.getElementById("field");
  var bridge = window.danmakuBridge || null;
  var cfg = { fontSize: 15, opacity: 0.92, lanes: 7, band: "full", speed: 150, motion: "auto" };
  var FAMILY = {
    rounded: '"SF Pro Rounded", "PingFang SC", system-ui, sans-serif',
    serif: 'Georgia, "Songti SC", serif',
    mono: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  };
  var paused = false;
  var timers = new Set();
  var anims = new Set();
  var reduced = false;
  try {
    reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch (error) {
    reduced = false;
  }

  function num(value, fallback) {
    var n = Number(value);
    return isFinite(n) ? n : fallback;
  }

  function clamp(n, min, max) {
    return Math.min(max, Math.max(min, n));
  }

  function applyTheme(colors) {
    var root = document.documentElement;
    var theme = colors || {};
    var dark = theme.dark === true;
    function set(name, value) {
      if (value) root.style.setProperty(name, value);
    }
    set("--fg", theme.fg || (dark ? "#e5e7eb" : "#111827"));
    set("--bd", theme.border || (dark ? "rgba(255,255,255,.18)" : "rgba(0,0,0,.14)"));
    set("--accent", theme.accent);
    set("--ok", theme.ok);
    set("--warn", theme.warn);
    set("--danger", theme.danger);
    root.style.setProperty("--chip", dark ? "rgba(24,26,31,.72)" : "rgba(255,255,255,.74)");
    root.style.setProperty("--op", String(clamp(num(cfg.opacity, 0.92), 0.2, 1)));
  }

  function metrics(bandOverride) {
    var vw = field.clientWidth || window.innerWidth;
    var vh = field.clientHeight || window.innerHeight;
    var lanes = clamp(Math.round(num(cfg.lanes, 7)), 1, 12);
    var top = 6;
    var bottom = vh * 0.92;
    var band = bandOverride || cfg.band;
    if (band === "upper") bottom = vh * 0.5;
    else if (band === "lower") {
      top = vh * 0.45;
      bottom = vh * 0.92;
    }
    var available = Math.max(120, bottom - top);
    return { vw: vw, lanes: lanes, laneH: clamp(available / lanes, 24, 4000), top: top };
  }

  function removeChip(el, anim) {
    anims.delete(anim);
    try {
      anim.cancel();
    } catch (error) {
      /* 已结束 */
    }
    if (el.parentNode) el.parentNode.removeChild(el);
  }

  function spawn(payload) {
    if (paused) return;
    if (anims.size > 160) return;
    var m = metrics(payload.band);
    var el = document.createElement("span");
    el.className = "chip tone-" + (payload.tone || "normal") + (payload.card === false ? " plain" : "");
    var text = document.createElement("span");
    text.textContent = (payload.prefix ? payload.prefix + " " : "") + String(payload.body || "").slice(0, 140);
    el.appendChild(text);
    el.style.fontSize = clamp(num(payload.fontSize, num(cfg.fontSize, 15)), 10, 48) + "px";
    if (num(payload.weight, 0)) el.style.fontWeight = String(clamp(num(payload.weight, 400), 300, 800));
    var family = FAMILY[payload.family];
    if (family) el.style.fontFamily = family;
    field.appendChild(el);

    var width = el.offsetWidth || 120;
    var lane = Math.abs(Math.floor(num(payload.lane, 0))) % m.lanes;
    var height = el.offsetHeight || 30;
    el.style.top = Math.round(m.top + lane * m.laneH + Math.max(0, (m.laneH - height) / 2)) + "px";

    var still = reduced || cfg.motion === "off";
    var anim;
    if (still) {
      el.style.left = "6%";
      anim = el.animate(
        [
          { opacity: 0, transform: "translateY(6px)" },
          { opacity: num(cfg.opacity, 0.92), transform: "translateY(0)", offset: 0.12 },
          { opacity: num(cfg.opacity, 0.92), offset: 0.82 },
          { opacity: 0, transform: "translateY(-6px)" },
        ],
        { duration: 4200, easing: "ease-out", fill: "forwards" },
      );
    } else {
      var speed = clamp(num(payload.speed, cfg.speed), 30, 600);
      var startX = m.vw + 8;
      var endX = -(width + 8);
      var duration = Math.max(1200, ((startX - endX) / speed) * 1000);
      anim = el.animate(
        [{ transform: "translate3d(" + startX + "px,0,0)" }, { transform: "translate3d(" + endX + "px,0,0)" }],
        { duration: duration, easing: "linear", fill: "forwards" },
      );
    }
    anims.add(anim);
    anim.onfinish = function () {
      removeChip(el, anim);
    };
  }

  function schedule(payload) {
    var at = num(payload.at, 0);
    var delay = at > 0 ? at - Date.now() : 0;
    if (at > 0 && delay < -2000) return;
    if (delay <= 0) {
      spawn(payload);
      return;
    }
    var timer = window.setTimeout(function () {
      timers.delete(timer);
      spawn(payload);
    }, delay);
    timers.add(timer);
  }

  function setPaused(next) {
    paused = Boolean(next);
    anims.forEach(function (anim) {
      try {
        if (paused) anim.pause();
        else anim.play();
      } catch (error) {
        /* 已结束 */
      }
    });
  }

  function onMessage(message) {
    if (!message || typeof message !== "object") return;
    if (message.type === "init") {
      cfg = Object.assign(cfg, message.config || {});
      applyTheme(message.theme);
      setPaused(Boolean(message.paused));
    } else if (message.type === "config") {
      cfg = Object.assign(cfg, message.config || {});
      applyTheme(null);
    } else if (message.type === "theme") {
      applyTheme(message.colors);
    } else if (message.type === "play") {
      schedule(message.payload || {});
    } else if (message.type === "pause") {
      setPaused(message.paused);
    }
  }

  if (bridge) bridge.onMessage(onMessage);
  applyTheme(null);
  window.addEventListener("resize", function () {
    field.style.width = window.innerWidth + "px";
    field.style.height = window.innerHeight + "px";
  });
})();
