/**
 * 站点业务插件（DSH 原生插件）。
 * 业务全部本地；云端只备份数据。标签能力通过 host.hasDomain 探测。
 */

import { bindClock, ensureSchema } from "./db/db.js";
import { exportSitesData, importSitesData } from "./infra/backup.js";
import { siteSync } from "./infra/sync.js";
import { registerSiteTreeActions } from "./tree/tree.js";
import { registerOverviewAction } from "./stats/overview.js";
import { registerSiteActions } from "./domain/sites.js";
import { registerAccountActions } from "./domain/accounts.js";
import { registerConfigActions } from "./infra/config.js";
import { registerDataActions } from "./infra/data.js";

export const inject = ["workbench"];

let domainApi = null;
function requireApi() {
  if (!domainApi) throw new Error("站点模块尚未初始化");
  return domainApi;
}

/**
 * 只读「Action」页的数据源完全由插件自己维护：注册时记录 action 定义，
 * 再由本插件注册的 <域>.actionSchema 返回，不经过宿主 schema 接口。
 */
function trackActions(api) {
  const defs = new Map();
  const rawAction = typeof api.action === "function" ? api.action.bind(api) : null;
  if (rawAction) {
    api.action = function (name, def) {
      defs.set(name, def || {});
      return rawAction(name, def);
    };
  }
  return defs;
}

function registerActionSchemaAction(api, defs, domain) {
  const prefix = domain.replace(/^wb-addon-/, "");
  api.action(prefix + ".actionSchema", {
    description: "只读：返回本插件运行时注册的 action schema（供「Action」页渲染；不执行任何 action、不写库、不产生审计）",
    input: { type: "object", properties: {}, additionalProperties: false },
    execute: () => ({
      shellVersion: api.shellVersion || "",
      domains: [{ id: domain, version: api.addon && api.addon.version ? api.addon.version : "" }],
      actions: Array.from(defs, ([name, def]) => ({
        name: name,
        domain: domain,
        description: typeof def.description === "string" ? def.description : "",
        input: def.input && typeof def.input === "object" ? def.input : { type: "object", properties: {} },
        examples: Array.isArray(def.examples) ? def.examples : [],
      })),
    }),
  });
}

export function setup(api) {
  domainApi = api;
  if (typeof api.now === "function") bindClock(api.now);
  ensureSchema(api.db, api.log);
  const actionDefs = trackActions(api);
  registerSiteTreeActions(api);
  registerOverviewAction(api);
  registerSiteActions(api);
  registerAccountActions(api);
  registerConfigActions(api);
  registerDataActions(api);
  registerActionSchemaAction(api, actionDefs, "wb-addon-sites");
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
        description: "站点收藏：目录树、链接与标签（标签需安装标签插件）；含统计/记录/配置/数据四个视图",
        version: "1.10.0",
        tables: ["site", "site_node", "site_node_mapping", "tag_mapping", "site_account", "site_account_external"],
        sync: siteSync,
        views: [
          { id: "stats", title: { zh: "统计", en: "Stats" } },
          { id: "sites", title: { zh: "记录", en: "Records" } },
          { id: "config", title: { zh: "配置", en: "Config" } },
          { id: "data", title: { zh: "数据", en: "Data" } },
        ],
        capability: {
          taskOwnership: { boundary: "站点收藏记录使用 sites.create；开发、修复站点插件的工作项使用 tasks.create。", query: "sites" },
          summary: "记录值得再次访问的站点（URL + 目录 + 标签），不记录本地开发地址和内网临时页面。",
          requires: ["wb-addon-tags"],
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
                { kind: "siteNode", via: "dirIds", description: "先 siteNodes.overview 再 sites.create 选 dirIds，不要凭感觉选目录；各层 folder 均可直接放站点，count 为子树去重站点数。overview 默认返回目录全文描述，可用 maxDescriptionLength 精简。" },
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
          fields: [
            { name: "siteName", type: "string", description: "站点标题（必填，新建站点时不能为空）" },
            { name: "description", type: "string", description: "站点说明/备注，可空" },
            { name: "siteLinks", type: "array", description: "链接列表，元素是 url 字符串；缺省表示还没有链接；健康度检查以这些 url 为准" },
            { name: "dirIds", type: "string[]", description: "所属站点目录 id 列表；写入时整体替换该站点的目录映射，传空数组等于移出所有目录" },
            { name: "nodeId / dirId", type: "string|number", description: "查询时按目录子树过滤；0 或省略表示全部目录" },
            { name: "tagIds", type: "string[]", description: "站点标签 id 列表；写入时整体替换，查询时命中任一即可" },
            { name: "bindable", type: "0|1", description: "是否允许被绑定/展示（缺省取插件配置 form.defaultBindable）；0 表示只在列表里留着但不参与绑定" },
            { name: "text / titleKey", type: "string", description: "关键词，匹配站点标题与描述" },
            { name: "pageNumber / pageSize", type: "number", description: "分页，页码从 1 开始；pageSize 有上限（默认 12，最大 200）" },
            { name: "sortColumn / sortOrder", type: "string", description: "排序列：site_name / create_time / update_time（缺省 update_time）；方向 asc|desc（缺省 desc）。未知列名会回落到 update_time" },
            { name: "range / from / to", type: "7d|30d|90d|365d|all / YYYY-MM-DD", description: "仅统计类 action：range 缺省 30d；from+to 是闭区间 [from,to]，两端都含" },
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