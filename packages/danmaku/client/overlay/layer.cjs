"use strict";
// 宿主页面弹幕层：泳道调度 + CSS transform 动画。
// 只负责"把一条弹幕画出来"，节奏由宿主 lib/player.js 决定。

var chipStyle = require("./chip-style.cjs");

var ACTIVE_LIMIT = 160;
var FAMILY = {
  rounded: '\"SF Pro Rounded\", \"PingFang SC\", \"Hiragino Sans GB\", system-ui, sans-serif',
  serif: 'Georgia, \"Songti SC\", \"Noto Serif CJK SC\", serif',
  mono: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
};
var LATE_LIMIT = 2000;

function num(value, fallback) {
  var n = Number(value);
  return isFinite(n) ? n : fallback;
}

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

function createWebLayer(options) {
  var root = options.root;
  var doc = root.ownerDocument;
  var win = doc.defaultView || window;
  var field = doc.createElement("div");
  field.className = "wbdm-dm-field";
  root.appendChild(field);

  var config = { speed: 150, lanes: 7, band: "full", fontSize: 15, opacity: 1, motion: "auto", enabled: true };
  var timers = new Set();
  var anims = new Set();
  var paused = false;
  var reduced = false;
  var disposed = false;

  try {
    reduced = win.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch (error) {
    reduced = false;
  }

  function metrics(bandOverride) {
    var vw = field.clientWidth || win.innerWidth || 1200;
    var vh = field.clientHeight || win.innerHeight || 800;
    var lanes = clamp(Math.round(num(config.lanes, 7)), 1, 12);
    var bandTop = 6;
    var bandBottom = vh * 0.92;
    var band = bandOverride || config.band;
    if (band === "upper") bandBottom = vh * 0.5;
    else if (band === "lower") {
      bandTop = vh * 0.45;
      bandBottom = vh * 0.92;
    }
    var available = Math.max(120, bandBottom - bandTop);
    return { vw: vw, lanes: lanes, laneH: clamp(available / lanes, 24, 4000), top: bandTop };
  }

  function removeChip(el, anim) {
    if (anim) {
      anims.delete(anim);
      try {
        anim.cancel();
      } catch (error) {
        /* 动画已结束 */
      }
    }
    if (el && el.parentNode) el.parentNode.removeChild(el);
  }

  function spawn(payload) {
    if (disposed || !config.enabled) return;
    if (!payload || !payload.body) return;
    if (anims.size >= ACTIVE_LIMIT) return;
    var m = metrics(payload.band);
    var made = chipStyle.buildChip(doc, payload, config);
    var el = made.el;
    field.appendChild(el);

    var width = el.offsetWidth || 120;
    var lane = Math.abs(Math.floor(num(payload.lane, 0))) % m.lanes;
    var height = el.offsetHeight || 30;
    el.style.top = Math.round(m.top + lane * m.laneH + Math.max(0, (m.laneH - height) / 2)) + "px";

    var still = reduced || config.motion === "off";
    var anim;
    if (still) {
      el.style.left = "6%";
      anim = el.animate(
        [
          { opacity: 0, transform: "translateY(6px)" },
          { opacity: made.style.opacity, transform: "translateY(0)", offset: 0.12 },
          { opacity: made.style.opacity, offset: 0.82 },
          { opacity: 0, transform: "translateY(-6px)" },
        ],
        { duration: 4200, easing: "ease-out", fill: "forwards" },
      );
    } else {
      var speed = made.style.speed;
      var startX = m.vw + 8;
      var endX = -(width + 8);
      var duration = Math.max(1200, ((startX - endX) / speed) * 1000);
      anim = el.animate(
        [
          { transform: "translate3d(" + startX + "px,0,0)" },
          { transform: "translate3d(" + endX + "px,0,0)" },
        ],
        { duration: duration, easing: "linear", fill: "forwards" },
      );
    }
    anims.add(anim);
    if (paused) anim.pause();
    anim.onfinish = function () {
      removeChip(el, anim);
    };
    anim.oncancel = function () {
      anims.delete(anim);
    };
  }

  function schedule(payload) {
    if (disposed) return;
    if (payload.preview) {
      spawn(payload);
      return;
    }
    var at = num(payload.at, 0);
    var delay = at > 0 ? at - Date.now() : 0;
    if (at > 0 && delay < -LATE_LIMIT) return;
    if (delay <= 0) {
      spawn(payload);
      return;
    }
    var timer = win.setTimeout(function () {
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
        /* 已结束的动画忽略 */
      }
    });
  }

  function setVar(name, value) {
    if (value === undefined || value === null || value === "") return;
    root.style.setProperty(name, String(value));
  }

  function update(next) {
    var cfg = next || {};
    config = {
      speed: num(cfg.speed, config.speed),
      lanes: num(cfg.lanes, config.lanes),
      band: typeof cfg.band === "string" ? cfg.band : config.band,
      fontSize: num(cfg.fontSize, config.fontSize),
      opacity: num(cfg.opacity, config.opacity),
      motion: typeof cfg.motion === "string" ? cfg.motion : config.motion,
      enabled: cfg.enabled === undefined ? config.enabled : Boolean(cfg.enabled),
    };
    setVar("--wbdm-font-size", clamp(config.fontSize, 11, 28) + "px");
    setVar("--wbdm-opacity", String(clamp(config.opacity, 0.2, 1)));
  }

  function applyTheme(theme) {
    if (!theme) return;
    setVar("--wbdm-fg", theme.fg);
    setVar("--wbdm-bg", theme.bg);
    setVar("--wbdm-border", theme.border);
    setVar("--wbdm-accent", theme.accent);
    setVar("--wbdm-ok", theme.ok);
    setVar("--wbdm-warn", theme.warn);
    setVar("--wbdm-danger", theme.danger);
    if (theme.bg) {
      setVar("--wbdm-chip-bg", "color-mix(in srgb, " + theme.bg + " 74%, transparent)");
    }
    if (theme.dark) setVar("--wbdm-shadow", "rgba(0,0,0,.45)");
    else setVar("--wbdm-shadow", "rgba(0,0,0,.12)");
  }

  function destroy() {
    disposed = true;
    timers.forEach(function (timer) {
      win.clearTimeout(timer);
    });
    timers.clear();
    anims.forEach(function (anim) {
      try {
        anim.cancel();
      } catch (error) {
        /* 已结束 */
      }
    });
    anims.clear();
    if (field.parentNode) field.parentNode.removeChild(field);
  }

  return {
    play: schedule,
    update: update,
    theme: applyTheme,
    pause: setPaused,
    destroy: destroy,
    get size() {
      return anims.size;
    },
  };
}

module.exports = { createWebLayer: createWebLayer };
