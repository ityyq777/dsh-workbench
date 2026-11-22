/**
 * 弹幕业务插件（DSH 原生插件）。
 *
 * 定位：把用户自己维护的一份弹幕清单，持续轮播在整个 DSH 界面（body 固定层），
 * 并可选叠加到整个桌面（独立 Electron helper 透明置顶窗）。
 *
 * 节奏只由宿主调度器决定（lib/player.js），两个显示端都只是渲染器：
 * 界面层走 SSE domain-event，桌面层走 helper 的 stdin。这样两端看到同一条弹幕、
 * 同一时刻出现，不会各飘各的。
 *
 * 与其他插件弱耦合：不 import 任何业务插件；agent 通过 danmaku.* action 操作弹幕库。
 */

import { bindClock, ensureSchema } from "./db/db.js";
import { DOMAIN, loadConfig } from "./config.js";
import { createPlayer } from "./player.js";
import { createSupervisor } from "./desktop/supervisor.js";
import { registerManageActions } from "./actions/manage.js";
import { registerConfigActions } from "./actions/config.js";
import { registerDataActions } from "./actions/data.js";
import { registerSchemaAction, trackActions } from "./actions/schema.js";

export const inject = ["workbench"];

const TABLES = ["danmaku"];

export function setup(api) {
  const log = (message, detail) => {
    if (typeof api.log === "function") api.log(String(message), detail === undefined ? "" : String(detail));
  };
  if (typeof api.now === "function") bindClock(api.now);

  let schemaError = "";
  try {
    ensureSchema(api.db, api.log);
  } catch (error) {
    schemaError = String((error && error.message) || error);
    log("danmaku schema 初始化失败：", schemaError);
  }

  const emit = (event, data) => {
    try {
      api.emit(event, data);
    } catch (error) {
      /* 宿主事件通道不可用时不影响播放 */
    }
  };

  let config = loadConfig(api.db, log);
  const player = createPlayer({ db: api.db, log, emit, config: config.values });
  const desktop = createSupervisor({
    log,
    version: "",
    onEvent: (event, data) => emit(event, data),
  });
  player.attachDesktop(desktop);

  function changed(reason, id) {
    try {
      config = loadConfig(api.db, log);
      player.refresh(config.values);
      desktop.applyConfig(config.values);
    } catch (error) {
      log("danmaku 配置刷新失败：", String((error && error.message) || error));
    }
    emit("changed", { reason: reason || "changed", id: id || "" });
  }

  const deps = { db: api.db, player, desktop, log, changed };
  const actionDefs = trackActions(api);
  registerManageActions(api, deps);
  registerConfigActions(api, deps);
  registerDataActions(api);
  registerSchemaAction(api, actionDefs, DOMAIN);

  // 按当前配置启动调度器；桌面层只在 surface 需要时起步，失败也不影响界面层。
  try {
    player.start();
  } catch (error) {
    log("danmaku 调度器启动失败：", String((error && error.message) || error));
  }
  try {
    desktop.applyConfig(config.values);
  } catch (error) {
    log("danmaku 桌面层启动失败：", String((error && error.message) || error));
  }

  api.log("danmaku domain ready", api.addon.version);
  return function dispose() {
    try {
      player.stop();
    } catch (error) {
      /* 已停止 */
    }
    try {
      desktop.dispose();
    } catch (error) {
      /* 已释放 */
    }
  };
}

export function apply(ctx) {
  const host = ctx.workbench;
  if (!host) throw new Error("dsh-workbench 未加载：缺少 workbench 服务");
  ctx.effect(
    () =>
      host.registerDomain({
        id: DOMAIN,
        title: "弹幕",
        description:
          "把自建弹幕轮播在整个 DSH 界面，并可叠加到整个桌面；单一宿主调度、SSE 与 Electron helper 双投递，含弹幕库/配置/数据/Action 四个视图",
        version: "0.2.6",
        category: "comm",
        tables: TABLES,
        sync: { tables: [] },
        views: [
          { id: "library", title: { zh: "弹幕库", en: "Library" } },
          { id: "config", title: { zh: "配置", en: "Config" } },
          { id: "data", title: { zh: "数据", en: "Data" } },
          { id: "actions", title: { zh: "Action", en: "Actions" } },
        ],
        capability: {
          taskOwnership: {
            boundary: "维护弹幕清单与显示效果用 danmaku.*；开发或修复弹幕插件本身的工作项用 tasks.create。",
            query: "danmaku",
          },
          summary: "个人弹幕清单的维护与轮播：只管「飘在界面/桌面上的那句短话」，不负责任务、消息或站点。",
          records: [
            {
              kind: "danmaku",
              title: "弹幕",
              description: "一条会被轮播的短句，含语气色、启用开关与排序。",
              when: ["想常驻提醒自己的一句话", "需要显眼但不会打断操作的提示"],
              notFor: ["需要留待处理的事项仍建任务", "给用户的通知走 message.send，不占用弹幕"],
              primaryAction: "danmaku.create",
              keyArgs: ["body", "tone", "enabled"],
              dedupe: "同一内容（忽略大小写与首尾空白）在未删除时唯一，重复创建会被拒绝。",
              relations: [
                { kind: "plugin", via: 'host.invoke("danmaku.create", args, "ui")', description: "子插件或 agent 维护弹幕清单。" },
              ],
              examples: [{ purpose: "加一条提醒", args: { body: "先喝水再继续", tone: "accent" } }],
            },
          ],
          fields: [
            { name: "body", type: "string", description: "弹幕正文，最长 100 字" },
            { name: "tone", type: "string", description: "语气色：normal/accent/success/warn/danger" },
            { name: "enabled", type: "boolean", description: "是否参与轮播" },
          ],
          notFor: ["不要在弹幕里放长文或链接，弹幕只适合一句话"],
          notes: ["轮播节奏与是否显示桌面层由配置决定；预览不会写库。"],
        },
        setup,
      }),
    "danmaku-domain",
  );
}
