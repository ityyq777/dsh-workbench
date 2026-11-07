/**
 * 站点业务插件（DSH 原生插件）。
 * 业务全部本地；云端只备份数据。标签能力通过 host.hasDomain 探测。
 */

import { ensureSchema } from "./db.js";
import { registerSiteTreeActions } from "./tree.js";
import { registerSiteActions } from "./sites.js";

export const inject = ["workbench"];

export function setup(api) {
  ensureSchema(api.db, api.log);
  registerSiteTreeActions(api);
  registerSiteActions(api);
  api.log("sites domain ready");
}

export function apply(ctx) {
  const host = ctx.workbench;
  if (!host) throw new Error("dsh-workbench 未加载：缺少 workbench 服务");
  ctx.effect(
    () =>
      host.registerDomain({
        id: "wb-addon-sites",
        title: "站点",
        description: "站点收藏：目录树、链接与标签",
        version: "1.0.3",
        tables: ["site", "site_node", "site_node_mapping", "tag_mapping"],
        views: [{ id: "sites", title: { zh: "站点", en: "Sites" } }],
        setup,
      }),
    "sites-domain",
  );
}
