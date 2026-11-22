"use strict";
// 弹幕调度器：唯一的节奏来源。界面层走 SSE，桌面层走 supervisor 的 stdin。
// 渲染端只负责动画，不做选条，避免两个显示端各飘各的。

import { liveRows, mapRow } from "./db/db.js";

const LEAD_MS = 200;

function shuffled(ids) {
  const out = ids.slice();
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function createPlayer(options) {
  const { db, log, emit } = options;
  let config = options.config || {};
  let timer = null;
  let bag = [];
  let seq = 0;
  let laneSeq = 0;
  let lastId = "";
  let nextAt = 0;
  let desktop = null;
  let disposed = false;
  let idsKey = "";

  function enabledRows() {
    return liveRows(db)
      .map(mapRow)
      .filter((item) => item && item.enabled && item.body);
  }

  function bagPool(rows) {
    const pool = [];
    for (const item of rows) {
      const times = Math.min(5, Math.max(1, Number(item.chance) || 1));
      for (let i = 0; i < times; i += 1) pool.push(item.id);
    }
    return pool;
  }

  function rebuildBag(rows) {
    const key = rows.map((item) => item.id + ":" + (item.chance || 1)).join(",");
    if (key === idsKey) return;
    idsKey = key;
    bag = [];
  }

  function take(rows) {
    if (!rows.length) return null;
    if (config.order === "sequence") {
      const item = rows[seq % rows.length];
      seq += 1;
      return item;
    }
    rebuildBag(rows);
    if (!bag.length) {
      bag = shuffled(bagPool(rows));
      if (bag.length > 1 && bag[0] === lastId) {
        bag.push(bag.shift());
      }
    }
    const id = bag.shift();
    const found = rows.find((item) => item.id === id);
    return found || rows[0];
  }

  function visibleFor(surface) {
    return config.enabled !== false && (surface === "dsh" || surface === "both");
  }

  function desktopVisible() {
    return config.enabled !== false && (config.surface === "desktop" || config.surface === "both");
  }

  function payloadFor(item, preview) {
    const lanes = Math.max(1, Number(config.lanes) || 7);
    const lane = laneSeq % lanes;
    laneSeq += 1;
    return {
      id: item.id,
      body: item.body,
      tone: item.tone || "normal",
      card: item.card !== false,
      fontSize: item.fontSize || Number(config.fontSize) || 15,
      opacity: item.opacity == null ? Number(config.opacity) || 0.92 : item.opacity,
      weight: item.fontWeight || 0,
      family: item.fontFamily || "",
      band: item.band || "",
      prefix: item.prefix || "",
      lane,
      at: preview ? 0 : Date.now() + LEAD_MS,
      preview: Boolean(preview),
      speed: item.speed || Number(config.speed) || 150,
    };
  }

  function deliver(item, payload) {
    lastId = item.id;
    if (visibleFor(config.surface)) {
      emit("play", payload);
    }
    if (desktopVisible() && desktop) {
      try {
        desktop.push(payload);
      } catch (error) {
        log("danmaku desktop push failed", String((error && error.message) || error));
      }
    }
  }

  function tick() {
    if (disposed) return;
    try {
      const rows = enabledRows();
      const item = take(rows);
      if (item) deliver(item, payloadFor(item, false));
    } catch (error) {
      log("danmaku tick failed", String((error && error.message) || error));
    }
    schedule();
  }

  function schedule() {
    clearTimeout(timer);
    if (disposed) return;
    const interval = Math.min(10000, Math.max(400, Number(config.intervalMs) || 1400));
    nextAt = Date.now() + interval;
    timer = setTimeout(tick, interval);
    if (timer && typeof timer.unref === "function") timer.unref();
  }

  function start() {
    disposed = false;
    clearTimeout(timer);
    timer = setTimeout(tick, Math.min(1200, Math.max(400, Number(config.intervalMs) || 1400)));
    if (timer && typeof timer.unref === "function") timer.unref();
    nextAt = Date.now();
  }

  function stop() {
    disposed = true;
    clearTimeout(timer);
    timer = null;
  }

  function refresh(next) {
    config = Object.assign({}, config, next || {});
    idsKey = "";
    if (config.enabled === false) {
      stop();
      return;
    }
    start();
  }

  function preview(id) {
    const rows = enabledRows();
    const item = id ? rows.find((row) => row.id === id) : take(rows);
    if (!item) return null;
    const payload = payloadFor(item, true);
    deliver(item, payload);
    return { id: item.id, body: item.body, tone: item.tone, lane: payload.lane, at: payload.at };
  }

  function status() {
    const rows = enabledRows();
    return {
      running: !disposed && config.enabled !== false,
      enabled: rows.length,
      intervalMs: Number(config.intervalMs) || 1400,
      surface: config.surface || "both",
      lastId,
      nextAt: disposed ? 0 : nextAt,
    };
  }

  function attachDesktop(next) {
    desktop = next;
  }

  return { start, stop, refresh, preview, status, attachDesktop, get config() {
    return config;
  } };
}

export { LEAD_MS };
