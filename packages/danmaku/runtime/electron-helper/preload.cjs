"use strict";
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("danmakuBridge", {
  onMessage(handler) {
    if (typeof handler !== "function") return;
    ipcRenderer.on("danmaku:msg", (event, message) => handler(message));
  },
  platform: process.platform,
});
