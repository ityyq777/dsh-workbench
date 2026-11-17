"use strict";
/**
 * 消息提示音：模块级常驻（client.src.cjs 的 apply 里启动），不依赖 React。
 *
 * 为什么自己订阅事件：宿主桥 `window.__WB_HOST__` 只暴露 react/jsx/registerAddon，
 * 不向插件模块提供 api 对象，所以提示音走工作台自己的 HTTP 契约：
 *   GET  /workbench/api/events                      （SSE，domain-event 里取 message.created）
 *   POST /workbench/api/domains/wb-addon-message/actions/message.configGet
 *
 * 声音用 WebAudio 现场合成，不打包音频文件；浏览器要求用户手势后才能出声，
 * 因此在第一次 pointerdown 时解锁 AudioContext（capture + once，不影响页面点击）。
 */

var DOMAIN = "wb-addon-message";
var BASE = "/workbench/api";
var CFG_TTL = 30000;
var SUPPRESS_MS = 5000;
var LEVELS = ["info", "success", "warning", "error"];

var state = {
  running: false,
  source: null,
  cfg: { at: 0, values: null },
  audio: null,
  lastKey: "",
  lastAt: 0,
};

function unwrap(r) {
  return r && r.result !== undefined ? r.result : r;
}

function call(action, args) {
  return fetch(BASE + "/domains/" + DOMAIN + "/actions/" + action, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(args || {}),
  })
    .then(function (r) { return r.json(); })
    .then(unwrap);
}

function loadConfig(force) {
  var fresh = state.cfg.values && Date.now() - state.cfg.at < CFG_TTL;
  if (!force && fresh) return Promise.resolve(state.cfg.values);
  return call("message.configGet")
    .then(function (body) {
      if (!body || !body.values) return state.cfg.values || {};
      state.cfg = { at: Date.now(), values: body.values };
      return body.values;
    })
    .catch(function () { return state.cfg.values || {}; });
}

function ensureAudio() {
  if (state.audio) return state.audio;
  var Ctor = (typeof window !== "undefined" && (window.AudioContext || window.webkitAudioContext)) || null;
  if (!Ctor) return null;
  try {
    state.audio = new Ctor();
  } catch (e) {
    state.audio = null;
  }
  return state.audio;
}

function unlock() {
  var audio = ensureAudio();
  if (audio && audio.state === "suspended" && typeof audio.resume === "function") audio.resume();
}

function installUnlock() {
  if (typeof document === "undefined" || !document.addEventListener) return;
  document.addEventListener("pointerdown", unlock, { once: true, capture: true, passive: true });
}

function inWindow(from, to, date) {
  var minutes = date.getHours() * 60 + date.getMinutes();
  var parse = function (text) {
    var parts = String(text || "").split(":");
    var h = Number(parts[0]);
    var m = Number(parts[1]);
    if (!Number.isFinite(h) || !Number.isFinite(m)) return null;
    return h * 60 + m;
  };
  var start = parse(from);
  var end = parse(to);
  if (start === null || end === null) return false;
  if (start === end) return true;
  if (start < end) return minutes >= start && minutes < end;
  return minutes >= start || minutes < end;
}

function isQuiet(values, date) {
  if (!values || values["quiet.enabled"] !== true) return false;
  return inWindow(values["quiet.from"], values["quiet.to"], date);
}

function passQuiet(values, level) {
  var levels = values && Array.isArray(values["quiet.levels"]) ? values["quiet.levels"] : ["warning", "error"];
  return levels.indexOf(level) >= 0;
}

function playTone(level, volume) {
  var audio = ensureAudio();
  if (!audio) return false;
  unlock();
  var pattern;
  var freq;
  if (level === "error") {
    freq = 520;
    pattern = [130, 70, 130, 70, 130];
  } else if (level === "warning") {
    freq = 660;
    pattern = [110, 60, 110, 60, 110];
  } else {
    freq = 880;
    pattern = [90, 60, 90];
  }
  var gain = Math.max(0, Math.min(1, Number(volume === undefined ? 0.4 : volume))) * 0.22;
  var t = audio.currentTime + 0.01;
  for (var i = 0; i < pattern.length; i += 1) {
    var dur = pattern[i] / 1000;
    if (i % 2 === 0) {
      var osc = audio.createOscillator();
      var amp = audio.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      amp.gain.setValueAtTime(0.0001, t);
      amp.gain.exponentialRampToValueAtTime(Math.max(0.0002, gain), t + 0.012);
      amp.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      osc.connect(amp);
      amp.connect(audio.destination);
      osc.start(t);
      osc.stop(t + dur + 0.02);
    }
    t += dur;
  }
  return true;
}

/** 依据配置与页面状态判断是否发声；返回 true 表示已播放。 */
function maybePlay(values, message) {
  if (!values) return false;
  if (values["sound.enabled"] === false) return false;
  if (!message || message.audience === "agent") return false;
  var hidden = typeof document !== "undefined" && document.visibilityState === "hidden";
  if (hidden && values["sound.whileHidden"] !== true) return false;
  var level = LEVELS.indexOf(message.level) >= 0 ? message.level : "info";
  if (isQuiet(values, new Date()) && !passQuiet(values, level)) return false;
  return playTone(level, values["sound.volume"]);
}

function handleEvent(payload) {
  if (!payload || payload.domainId !== DOMAIN || payload.event !== "message.created") return;
  var message = payload.data && payload.data.message;
  if (!message || !message.id) return;
  var now = Date.now();
  if (state.lastKey === message.id && now - state.lastAt < SUPPRESS_MS) return;
  state.lastKey = message.id;
  state.lastAt = now;
  loadConfig(false).then(function (values) { maybePlay(values, message); });
}

function start() {
  if (state.running) return;
  state.running = true;
  installUnlock();
  if (typeof window === "undefined" || typeof window.EventSource !== "function") return;
  try {
    state.source = new window.EventSource(BASE + "/events");
    state.source.addEventListener("domain-event", function (event) {
      try {
        handleEvent(JSON.parse(event.data));
      } catch (e) {
        /* 单条事件解析失败不影响后续 */
      }
    });
  } catch (e) {
    state.source = null;
  }
  loadConfig(true);
}

function stop() {
  state.running = false;
  if (state.source && typeof state.source.close === "function") state.source.close();
  state.source = null;
}

/** 配置页「试听」：绕过免打扰/静音开关，只验证声音本身。 */
function preview(level) {
  var lv = LEVELS.indexOf(level) >= 0 ? level : "info";
  return loadConfig(false).then(function (values) {
    return playTone(lv, values["sound.volume"] === undefined ? 0.4 : values["sound.volume"]);
  });
}

module.exports = { start: start, stop: stop, preview: preview, refreshConfig: function () { return loadConfig(true); } };
