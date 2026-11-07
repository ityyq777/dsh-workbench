/**
 * 标签业务插件（DSH 原生插件）。
 * 所有业务逻辑都在本地 SQLite 完成；云端只负责备份。
 */

import { ensureSchema } from "./db.js";
import { registerTagActions } from "./tags.js";

export const inject = ["workbench"];

export function setup(api) {
  ensureSchema(api.db, api.log);
  registerTagActions(api);
  api.log("tags domain ready", api.addon.version);
}

export function apply(ctx) {
  const host = ctx.workbench;
  if (!host) throw new Error("dsh-workbench 未加载：缺少 workbench 服务");
  ctx.effect(
    () =>
      host.registerDomain({
        id: "wb-addon-tags",
        title: "标签",
        description: "创建与管理标签，为站点等业务提供标签归类",
        version: "1.0.0",
        tables: ["tag", "tag_mapping"],
        views: [{ id: "tags", title: { zh: "标签", en: "Tags" } }],
        setup,
      }),
    "tags-domain",
  );
}
