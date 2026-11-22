"use strict";
// Electron 运行时解析：优先复用 ~/.dsh/electron（dsh-pet 等下载过的），
// 缺失时用 @electron/get 下载一次到 ~/.dsh/danmaku-electron。

import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { homedir } from "node:os";
import { join } from "node:path";

export const DEFAULT_ELECTRON_VERSION = "43.3.0";
const MIRROR = process.env.DSH_DANMAKU_ELECTRON_MIRROR || "https://npmmirror.com/mirrors/electron/";
const REL = {
  darwin: "Electron.app/Contents/MacOS/Electron",
  win32: "electron.exe",
  linux: "electron",
};

function home() {
  return process.env.DSH_HOME || join(homedir(), ".dsh");
}

function rel() {
  return REL[process.platform] || REL.linux;
}

export function electronCandidates() {
  const out = [];
  if (process.env.DSH_DANMAKU_ELECTRON_PATH) out.push(process.env.DSH_DANMAKU_ELECTRON_PATH);
  out.push(join(home(), "electron", rel()));
  out.push(join(home(), "danmaku-electron", rel()));
  if (process.env.DSH_DANMAKU_ELECTRON_HOME) out.push(join(process.env.DSH_DANMAKU_ELECTRON_HOME, rel()));
  return out;
}

export function localElectron() {
  for (const candidate of electronCandidates()) {
    if (existsSync(candidate)) {
      let version = "";
      try {
        version = readFileSync(join(candidate, "..", "..", "..", "version"), "utf8").trim();
      } catch (error) {
        version = "";
      }
      return { exe: candidate, version, downloaded: false };
    }
  }
  return null;
}

function requireFromProfile(name) {
  const roots = [process.env.DSH_PROFILE_DIR, join(home(), "profiles", "desktop")].filter(Boolean);
  for (const root of roots) {
    try {
      const require = createRequire(join(root, "package.json"));
      return require(name);
    } catch (error) {
      /* 试下一个根 */
    }
  }
  return null;
}

async function loadModule(name) {
  try {
    const mod = await import(name);
    return mod.default || mod;
  } catch (error) {
    const fallback = requireFromProfile(name);
    if (!fallback) throw error;
    return fallback.default || fallback;
  }
}

async function downloadRuntime(version, log) {
  const target = join(home(), "danmaku-electron");
  const getter = await loadModule("@electron/get");
  const downloadArtifact = getter.downloadArtifact || (getter.default && getter.default.downloadArtifact);
  if (typeof downloadArtifact !== "function") {
    throw new Error("找不到 @electron/get 的 downloadArtifact（无法下载 Electron 运行时）");
  }
  const mirror = MIRROR.endsWith("/") ? MIRROR : MIRROR + "/";
  log("danmaku desktop: 下载 Electron " + version + " 到 " + target);
  const zip = await downloadArtifact({
    version: "v" + version,
    artifactName: "electron",
    mirrorOptions: { mirror },
    downloadOptions: { quiet: true },
  });
  const extractor = await loadModule("@electron-internal/extract-zip");
  const extract = extractor.default || extractor;
  if (typeof extract !== "function") throw new Error("找不到 @electron-internal/extract-zip");
  await extract(zip, { dir: target });
  const exe = join(target, rel());
  if (!existsSync(exe)) throw new Error("Electron 解压后缺少可执行文件：" + exe);
  return { exe, version, downloaded: true };
}

export async function resolveElectron(options) {
  const opts = options || {};
  const log = typeof opts.log === "function" ? opts.log : () => {};
  const version = opts.version || DEFAULT_ELECTRON_VERSION;
  const local = localElectron();
  if (local) return local;
  return downloadRuntime(version, log);
}
