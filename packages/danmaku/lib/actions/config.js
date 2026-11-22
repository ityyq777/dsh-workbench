"use strict";

import { configState, loadConfig, resetConfig, writeConfig } from "../config.js";

export function registerConfigActions(api, deps) {
  const db = api.db;

  api.action("danmaku.configGet", {
    description: "读取弹幕插件配置：分组、全部配置项（含中文说明）、当前值、用户覆盖与告警",
    input: { type: "object", properties: {}, additionalProperties: false },
    execute: () => configState(db),
    render: (r) => `弹幕配置 ${Object.keys(r.values).length} 项，覆盖 ${Object.keys(r.overrides).length} 项`,
  });

  api.action("danmaku.configSet", {
    description: "写入弹幕配置；值会做类型与范围校验，写入后立即影响调度节奏与显示层",
    input: {
      type: "object",
      properties: {
        values: { type: "object", description: '要写入的配置项，如 {"intervalMs": 1200, "surface": "both"}' },
      },
      required: ["values"],
      additionalProperties: false,
    },
    execute: (args) => {
      const out = writeConfig(db, args.values);
      if (out.changed.length) deps.changed("config", out.changed.join(","));
      return { changed: out.changed, values: out.state.values, overrides: out.state.overrides };
    },
    render: (r) => (r.changed.length ? `已更新配置：${r.changed.join("、")}` : "配置没有变化"),
  });

  api.action("danmaku.configReset", {
    description: "把弹幕配置恢复默认；不传 ids 时恢复全部配置项",
    input: {
      type: "object",
      properties: {
        ids: { type: "array", items: { type: "string" }, description: "要恢复默认的配置项 id 列表" },
      },
      additionalProperties: false,
    },
    execute: (args) => {
      const state = resetConfig(db, args.ids);
      deps.changed("config-reset", "");
      return { values: state.values, overrides: state.overrides };
    },
    render: () => "弹幕配置已恢复默认",
  });

  api.action("danmaku.theme", {
    description: "由界面层上报当前 DSH 主题色，桌面透明窗据此换色；不写库",
    input: {
      type: "object",
      properties: {
        colors: {
          type: "object",
          description: "形如 {fg,bg,border,accent,ok,warn,danger,dark} 的 CSS 颜色",
          additionalProperties: true,
        },
      },
      required: ["colors"],
      additionalProperties: false,
    },
    execute: (args) => {
      const colors = args.colors && typeof args.colors === "object" ? args.colors : {};
      deps.desktop.theme(colors);
      return { synced: deps.desktop.status().themeSynced };
    },
    render: (r) => (r.synced ? "桌面主题已同步" : "桌面层尚未启动，主题已缓存"),
  });

  api.action("danmaku.desktop", {
    description: "桌面弹幕层控制：status 查询状态，restart 重启，stop 本次停止，resume 恢复",
    input: {
      type: "object",
      properties: {
        op: {
          type: "string",
          enum: ["status", "restart", "stop", "resume"],
          description: "操作；默认 status",
        },
      },
      additionalProperties: false,
    },
    execute: (args) => {
      const op = args.op || "status";
      if (op === "restart") deps.desktop.restart();
      else if (op === "stop") deps.desktop.suppress();
      else if (op === "resume") deps.desktop.resume();
      return deps.desktop.status();
    },
    render: (r) => `桌面弹幕：${r.phase}`,
  });

  api.action("danmaku.status", {
    description: "弹幕运行状态：调度器节奏、下一个播放时间、启用条数与当前显示端",
    input: { type: "object", properties: {}, additionalProperties: false },
    execute: () => {
      const values = loadConfig(db).values;
      return Object.assign({ config: values }, deps.player.status(), { desktop: deps.desktop.status() });
    },
    render: (r) => `弹幕运行中 ${r.enabled} 条，间隔 ${r.intervalMs}ms`,
  });
}
