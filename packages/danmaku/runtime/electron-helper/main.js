"use strict";
// 桌面弹幕层：独立 Electron 应用，由插件宿主以子进程拉起。
// 一块屏幕一个透明窗：无边框、置顶、鼠标穿透、不抢焦点；通过 stdin/stdout 与宿主通信。

const { app, BrowserWindow, Menu, Tray, nativeImage, nativeTheme, screen, shell } = require("electron");
const path = require("node:path");
const readline = require("node:readline");

const PROTOCOL = 1;
const TRAY_ICON =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAl0lEQVR4nO2WQQ6AIAwEuxv//2WMJw0KodBSDc5N0J2NSFDk52d1oLg3eeTDSdzs4QR5NYcT5NU8SjDQtE3pHAagGis50VrgGqolK4FXLQE/UwDZWh7XrWPVXJmzBYtOSjA0OCM03HIpwbAyZ/0WHvPY85CVXCtw+R/YOkK7RCUYKbcoMPyNMFI+UsBsizJSrsXzgJJ12QHfjhdE/XkhOAAAAABJRU5ErkJggg==";

const state = {
  config: { fontSize: 15, opacity: 0.92, lanes: 7, band: "full", speed: 150, motion: "auto" },
  theme: null,
  mode: "all",
  paused: false,
  windows: [],
  tray: null,
};

function host(message) {
  try {
    process.stdout.write(JSON.stringify(message) + "\n");
  } catch (error) {
    /* 宿主已退出 */
  }
}

function broadcast(message) {
  for (const win of state.windows) {
    if (win && !win.isDestroyed()) win.webContents.send("danmaku:msg", message);
  }
}

function destroyWindows() {
  for (const win of state.windows) {
    try {
      win.destroy();
    } catch (error) {
      /* 已销毁 */
    }
  }
  state.windows = [];
}

function initPayload() {
  return { type: "init", config: state.config, theme: state.theme, paused: state.paused, mode: state.mode };
}

function createWindows() {
  destroyWindows();
  const displays = state.mode === "primary" ? [screen.getPrimaryDisplay()] : screen.getAllDisplays();
  displays.forEach((display, index) => {
    const bounds = display.bounds;
    const win = new BrowserWindow({
      x: bounds.x,
      y: bounds.y,
      width: bounds.width,
      height: bounds.height,
      transparent: true,
      frame: false,
      alwaysOnTop: true,
      skipTaskbar: true,
      hasShadow: false,
      focusable: false,
      resizable: false,
      movable: false,
      minimizable: false,
      maximizable: false,
      fullscreenable: false,
      enableLargerThanScreen: true,
      show: false,
      backgroundColor: "#00000000",
      webPreferences: {
        preload: path.join(__dirname, "preload.cjs"),
        contextIsolation: true,
        nodeIntegration: false,
        backgroundThrottling: false,
        sandbox: false,
      },
    });
    win.__displayId = display.id;
    win.__index = index;
    win.setAlwaysOnTop(true, "screen-saver");
    if (typeof win.setVisibleOnAllWorkspaces === "function") {
      win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
    }
    win.setIgnoreMouseEvents(true, { forward: true });
    win.loadFile(path.join(__dirname, "index.html"));
    win.webContents.once("did-finish-load", () => {
      if (win.isDestroyed()) return;
      win.webContents.send("danmaku:msg", initPayload());
      if (!state.paused) {
        try {
          win.showInactive();
        } catch (error) {
          win.show();
        }
      }
    });
    state.windows.push(win);
  });
  host({ type: "displays", count: state.windows.length });
}

function buildTray() {
  if (state.tray) {
    state.tray.destroy();
    state.tray = null;
  }
  let image;
  try {
    image = nativeImage.createFromDataURL(TRAY_ICON);
    if (process.platform === "darwin") image.setTemplateImage(true);
  } catch (error) {
    image = nativeImage.createEmpty();
  }
  state.tray = new Tray(image);
  state.tray.setToolTip("DSH 弹幕");
  state.tray.setContextMenu(
    Menu.buildFromTemplate([
      { label: state.paused ? "继续弹幕" : "暂停弹幕", click: togglePause },
      { type: "separator" },
      { label: "打开 DeepSeek Harness", click: openHost },
      { type: "separator" },
      {
        label: "退出桌面弹幕",
        click: () => {
          host({ type: "tray", action: "quit" });
          app.quit();
        },
      },
    ]),
  );
}

function togglePause() {
  state.paused = !state.paused;
  broadcast({ type: "pause", paused: state.paused });
  if (state.paused) {
    for (const win of state.windows) if (!win.isDestroyed()) win.hide();
  } else {
    for (const win of state.windows) if (!win.isDestroyed()) win.showInactive();
  }
  buildTray();
  host({ type: "tray", action: state.paused ? "pause" : "resume" });
}

function openHost() {
  const exe = process.env.DSH_DESKTOP_NODE_EXECUTABLE || "";
  const match = /^(.*?DeepSeek Harness\.app)\/Contents\//.exec(exe);
  if (match) {
    shell.openPath(match[1]);
    return;
  }
  shell.openExternal("http://127.0.0.1:3080/").catch(() => {
    /* 由宿主页面自己处理 */
  });
}

function onLine(line) {
  let message;
  try {
    message = JSON.parse(line);
  } catch (error) {
    return;
  }
  if (!message || typeof message !== "object") return;
  if (message.type === "config") {
    state.config = Object.assign({}, state.config, message.config || {});
    broadcast({ type: "config", config: state.config });
  } else if (message.type === "theme") {
    state.theme = message.colors || null;
    broadcast({ type: "theme", colors: state.theme });
  } else if (message.type === "displays") {
    state.mode = message.mode === "primary" ? "primary" : "all";
    createWindows();
  } else if (message.type === "play") {
    if (!state.paused) broadcast({ type: "play", payload: message.payload || {} });
  } else if (message.type === "pause") {
    state.paused = Boolean(message.paused);
    broadcast({ type: "pause", paused: state.paused });
    buildTray();
  } else if (message.type === "ping") {
    host({ type: "pong", at: Date.now() });
  }
}

app.on("window-all-closed", () => {
  /* 关闭窗口不退出：托盘还在 */
});

app.on("before-quit", () => {
  destroyWindows();
});

app.whenReady().then(() => {
  if (process.platform === "darwin" && app.dock) app.dock.hide();
  nativeTheme.on("updated", () => {
    host({ type: "log", level: "info", message: "nativeTheme updated dark=" + nativeTheme.shouldUseDarkColors });
  });
  createWindows();
  buildTray();
  const rl = readline.createInterface({ input: process.stdin });
  rl.on("line", onLine);
  rl.on("close", () => {
    // 宿主进程结束时 stdin 会关闭，桌面层跟着退出，避免留下无主透明窗。
    try {
      app.quit();
    } catch (error) {
      process.exit(0);
    }
  });
  host({ type: "ready", protocol: PROTOCOL, displays: state.windows.length, electron: process.versions.electron });
});
