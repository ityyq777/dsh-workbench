"use strict";
// 桌面层进程管理：拉起 helper、转发播放消息、退避重启、托盘停止/恢复。

import { spawn } from "node:child_process";
import { createInterface } from "node:readline";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { resolveElectron } from "./runtime.js";

const HELPER_DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "runtime", "electron-helper");
const MAX_RESTARTS = 5;
const READY_TIMEOUT = 25000;

function desktopWanted(values) {
  return values.enabled !== false && (values.surface === "desktop" || values.surface === "both");
}

function notices(values) {
  return {
    fontSize: Number(values.fontSize) || 15,
    opacity: Number(values.opacity) || 0.92,
    lanes: Number(values.lanes) || 7,
    band: values.band || "full",
    speed: Number(values.speed) || 150,
    motion: values.motion || "auto",
    surface: values.surface || "both",
  };
}

export function createSupervisor(options) {
  const opts = options || {};
  const log = typeof opts.log === "function" ? opts.log : () => {};
  const onEvent = typeof opts.onEvent === "function" ? opts.onEvent : () => {};
  const helperDir = opts.helperDir || HELPER_DIR;
  const version = opts.version || "";

  const state = {
    phase: "stopped",
    suppressed: false,
    themeSynced: false,
    protocol: 0,
    displays: 0,
    pid: 0,
    error: "",
    restarts: 0,
    electron: "",
  };
  const config = notices({});
  let theme = null;
  let child = null;
  let reader = null;
  let launching = false;
  let wantOn = false;
  let backoff = 1000;
  let retryTimer = null;
  let readyTimer = null;
  let disposed = false;

  function status() {
    return {
      phase: state.phase,
      suppressed: state.suppressed,
      themeSynced: state.themeSynced,
      protocol: state.protocol,
      displays: state.displays,
      pid: state.pid,
      error: state.error,
      restarts: state.restarts,
      electron: state.electron,
    };
  }

  function send(message) {
    if (!child || !child.stdin || child.stdin.destroyed) return false;
    try {
      child.stdin.write(JSON.stringify(message) + "\n");
      return true;
    } catch (error) {
      return false;
    }
  }

  function configPayload() {
    return { type: "config", config: notices(config) };
  }

  function displaysPayload() {
    return { type: "displays", mode: config.desktopDisplays === "primary" ? "primary" : "all" };
  }

  function sendBootstrap() {
    send(configPayload());
    send(displaysPayload());
    if (theme) {
      state.themeSynced = send({ type: "theme", colors: theme });
    }
  }

  function clearReady() {
    if (readyTimer) clearTimeout(readyTimer);
    readyTimer = null;
  }

  function kill(reason) {
    if (!child) return;
    const target = child;
    try {
      target.kill();
    } catch (error) {
      /* 已退出 */
    }
    setTimeout(() => {
      if (child === target) {
        try {
          target.kill("SIGKILL");
        } catch (error) {
          /* 已退出 */
        }
      }
    }, 2500).unref?.();
    log("danmaku desktop: 结束桌面层（" + (reason || "stop") + "）");
  }

  function fail(error) {
    state.error = String((error && error.message) || error || "桌面层失败");
    state.phase = "error";
    wantOn = false;
    launching = false;
    clearReady();
    log("danmaku desktop: " + state.error);
    onEvent("desktop-error", { error: state.error });
  }

  function scheduleRetry(reason) {
    if (disposed || state.suppressed || !wantOn) {
      state.phase = "stopped";
      return;
    }
    if (retryTimer) return;
    if (state.restarts >= MAX_RESTARTS) {
      fail(new Error(reason || "桌面层反复退出，已停止重试"));
      return;
    }
    const delay = backoff;
    backoff = Math.min(30000, backoff * 2);
    state.restarts += 1;
    state.phase = "retrying";
    retryTimer = setTimeout(() => {
      retryTimer = null;
      if (!disposed && wantOn && !state.suppressed) void launch();
    }, delay);
    if (retryTimer && typeof retryTimer.unref === "function") retryTimer.unref();
    log("danmaku desktop: " + (reason || "退出") + "，" + delay + "ms 后重试（第 " + state.restarts + " 次）");
  }

  function onLine(line) {
    let message;
    try {
      message = JSON.parse(line);
    } catch (error) {
      return;
    }
    if (!message || typeof message !== "object") return;
    if (message.type === "ready") {
      clearReady();
      state.phase = "running";
      state.protocol = Number(message.protocol) || 0;
      state.displays = Number(message.displays) || 0;
      state.pid = child && child.pid ? child.pid : 0;
      state.error = "";
      state.restarts = 0;
      backoff = 1000;
      sendBootstrap();
      log("danmaku desktop: 已就绪（protocol " + state.protocol + "，" + state.displays + " 块屏幕）");
      onEvent("desktop-ready", { displays: state.displays, protocol: state.protocol });
    } else if (message.type === "displays") {
      state.displays = Number(message.count) || 0;
      onEvent("desktop-displays", { displays: state.displays });
    } else if (message.type === "tray") {
      const action = String(message.action || "");
      if (action === "quit" || action === "pause") {
        state.suppressed = true;
        wantOn = false;
        kill("tray-" + action);
        state.phase = "stopped";
      }
      onEvent("desktop-tray", { action });
    } else if (message.type === "log") {
      log("danmaku helper: " + String(message.message || ""));
    } else if (message.type === "error") {
      state.error = String(message.message || "helper 报错");
      onEvent("desktop-error", { error: state.error });
    }
  }

  function spawnHelper(exe) {
    const env = Object.assign({}, process.env);
    delete env.ELECTRON_RUN_AS_NODE;
    delete env.ELECTRON_NO_ATTACH_CONSOLE;
    env.DSH_DANMAKU_HOST_PID = String(process.pid);
    state.phase = "starting";
    try {
      child = spawn(exe, [helperDir], { cwd: helperDir, env, stdio: ["pipe", "pipe", "pipe"], windowsHide: true });
    } catch (error) {
      child = null;
      launching = false;
      fail(error);
      return;
    }
    state.pid = child.pid || 0;
    let stderr = "";
    child.stderr.on("data", (chunk) => {
      stderr = (stderr + chunk.toString()).slice(-3000);
    });
    reader = createInterface({ input: child.stdout });
    reader.on("line", onLine);
    child.on("error", (error) => {
      fail(error);
    });
    child.on("exit", (code, signal) => {
      if (reader) reader.close();
      reader = null;
      child = null;
      state.pid = 0;
      state.protocol = 0;
      launching = false;
      clearReady();
      if (disposed || state.suppressed || !wantOn) {
        state.phase = "stopped";
        return;
      }
      const detail = stderr.trim().split("\n").slice(-3).join(" | ");
      if (detail) log("danmaku helper stderr: " + detail);
      scheduleRetry("桌面层退出 code=" + code + (signal ? " signal=" + signal : ""));
    });
    readyTimer = setTimeout(() => {
      if (state.phase !== "running") {
        state.error = "桌面层启动超时";
        kill("timeout");
      }
    }, READY_TIMEOUT);
    if (readyTimer && typeof readyTimer.unref === "function") readyTimer.unref();
    launching = false;
  }

  async function launch() {
    if (disposed || launching || child || state.suppressed || !wantOn) return;
    launching = true;
    state.phase = "resolving";
    state.error = "";
    try {
      const runtime = await resolveElectron({ log, version: version || undefined });
      state.electron = runtime.version || state.electron;
      if (disposed || !wantOn || state.suppressed) {
        launching = false;
        return;
      }
      spawnHelper(runtime.exe);
    } catch (error) {
      launching = false;
      fail(error);
    }
  }

  function sync() {
    if (disposed) return;
    const wanted = wantOn && !state.suppressed;
    if (wanted) {
      if (!child && !launching) void launch();
      else if (child) {
        send(configPayload());
        send(displaysPayload());
      }
      return;
    }
    clearReady();
    kill("sync-off");
    state.phase = "stopped";
  }

  function applyConfig(values, opts2) {
    const next = notices(values || {});
    Object.assign(config, next, { desktopDisplays: (values && values.desktopDisplays) || config.desktopDisplays || "all" });
    wantOn = desktopWanted(values || {});
    if (state.suppressed && opts2 && opts2.force) state.suppressed = false;
    sync();
  }

  function themeUpdate(colors) {
    theme = colors || null;
    if (!theme) return;
    state.themeSynced = send({ type: "theme", colors: theme });
  }

  function push(payload) {
    if (state.phase !== "running") return;
    if (!send({ type: "play", payload })) return;
  }

  return {
    status,
    applyConfig,
    theme: themeUpdate,
    push,
    sync,
    restart() {
      state.suppressed = false;
      state.error = "";
      state.restarts = 0;
      backoff = 1000;
      wantOn = desktopWanted(config);
      kill("restart");
      setTimeout(sync, 250).unref?.();
    },
    suppress() {
      state.suppressed = true;
      wantOn = false;
      kill("suppress");
      state.phase = "stopped";
    },
    resume() {
      state.suppressed = false;
      state.error = "";
      state.restarts = 0;
      backoff = 1000;
      wantOn = desktopWanted(config);
      state.phase = "stopped";
      sync();
    },
    dispose() {
      disposed = true;
      wantOn = false;
      if (retryTimer) clearTimeout(retryTimer);
      retryTimer = null;
      clearReady();
      kill("dispose");
    },
  };
}

export { HELPER_DIR, MAX_RESTARTS };
