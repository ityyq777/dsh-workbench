/**
 * 站点业务插件（DSH 原生插件）。
 * 业务全部本地；云端只备份数据。标签能力通过 host.hasDomain 探测。
 */

import { bindClock, ensureSchema } from "./db.js";
import { exportSitesData, importSitesData } from "./backup.js";
import { siteSync } from "./sync.js";
import { registerSiteTreeActions } from "./tree.js";
import { registerSiteActions } from "./sites.js";

export const inject = ["workbench"];

let domainApi = null;
function requireApi() {
  if (!domainApi) throw new Error("站点模块尚未初始化");
  return domainApi;
}

export function setup(api) {
  domainApi = api;
  if (typeof api.now === "function") bindClock(api.now);
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
        version: "1.3.1",
        tables: ["site", "site_node", "site_node_mapping", "tag_mapping"],
        sync: siteSync,
        views: [{ id: "sites", title: { zh: "站点", en: "Sites" } }],
        capability: {
          summary: "记录值得再次访问的站点（URL + 目录 + 标签），不记录本地开发地址和内网临时页面。",
          records: [
            {
              kind: "site",
              title: "站点",
              description: "一个可收藏的网站或页面，归入至少一个目录，可选标签。",
              when: [
                "用户明确说收藏 / 记录这个站点",
                "会话中产出了以后还会访问的外部站点或文档入口",
                "站点与当前任务相关，且不是一次性搜索结果",
              ],
              notFor: [
                "localhost、127.0.0.1、内网 IP、临时调试地址",
                "一次性的搜索结果页、登录页、未确认可访问的链接",
                "没有目录归属的站点；sites.create 要求 dirIds",
              ],
              primaryAction: "sites.create",
              keyArgs: ["siteName", "description", "siteLinks", "dirIds", "tagIds", "bindable"],
              dedupe: "没有 dedupeKey；先用 sites.list 按标题/URL 查重，再决定创建。",
              relations: [
                { kind: "tag", via: "tagIds / sites.update", description: "用标签做主题归类；标签需先存在。" },
                { kind: "siteNode", via: "dirIds", description: "站点必须归入至少一个目录；先查目录树拿 id。" },
              ],
              examples: [
                {
                  purpose: "收藏一个外部文档站点",
                  args: {
                    siteName: "DSH 文档",
                    description: "DeepSeek Harness 使用文档",
                    siteLinks: [{ link: "https://example.com/docs", description: "文档首页", isDefault: true }],
                    dirIds: ["1"],
                  },
                },
              ],
            },
          ],
          notFor: ["不要用它记录本地页面或未验证的链接"],
          notes: [
            "sites.create 必填 siteName 与 dirIds；没有目录时先创建目录。",
            "siteLinks 的元素结构为 { link, description, isDefault }。",
          ],
        },
        setup,
        exportData: () => exportSitesData(requireApi()),
        importData: (raw, _ctx, options) => importSitesData(requireApi(), raw, options),
      }),
    "sites-domain",
  );
}