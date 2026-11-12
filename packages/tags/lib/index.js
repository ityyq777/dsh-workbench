/**
 * 标签业务插件（DSH 原生插件）。
 * 所有业务逻辑都在本地 SQLite 完成；云端只负责备份。
 */

import { bindClock, ensureSchema } from "./db/db.js";
import { exportTagsData, importTagsData } from "./infra/backup.js";
import { tagSync } from "./infra/sync.js";
import { registerTagActions } from "./domain/tags.js";
import { registerConfigActions } from "./infra/config.js";
import { registerDataActions } from "./infra/data.js";

export const inject = ["workbench"];

let domainApi = null;
function requireApi() {
  if (!domainApi) throw new Error("标签模块尚未初始化");
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
  registerTagActions(api);
  registerConfigActions(api);
  registerDataActions(api);
  registerActionSchemaAction(api, actionDefs, "wb-addon-tags");
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
        description: "创建与管理标签，为站点等业务提供标签归类；含统计/记录/配置/数据四个视图",
        version: "1.7.0",
        tables: ["tag", "tag_mapping"],
        sync: tagSync,
        views: [
          { id: "stats", title: { zh: "统计", en: "Stats" } },
          { id: "tags", title: { zh: "记录", en: "Records" } },
          { id: "config", title: { zh: "配置", en: "Config" } },
          { id: "data", title: { zh: "数据", en: "Data" } },
        ],
        capability: {
          taskOwnership: { boundary: "标签归类记录使用 tags.create；开发、修复标签插件的工作项使用 tasks.create。", query: "tags" },
          summary: "维护跨业务对象的标签；只做归类，不负责记录任务或站点。",
          records: [
            {
              kind: "tag",
              title: "标签",
              description: "一个可复用的主题或分类名，可挂到任务或站点上。",
              when: [
                "已有任务或站点需要一组稳定、可复用的主题分类",
                "用户明确要求创建或复用某个标签",
                "多个记录共享同一主题，且以后还会继续使用",
              ],
              notFor: [
                "一次性描述、状态词或日期不要造标签",
                "不要为了给单个对象加说明而新建标签；优先复用已有标签",
              ],
              primaryAction: "tags.create",
              keyArgs: ["name"],
              dedupe: "标签名唯一（uk_tag_name，软删除的不占位）：同名再调 tags.create 幂等返回已有 id（existing=true），不会新建第二条；tags.update 改名撞名会被拒绝并返回占用者 id。",
              relations: [
                { kind: "task", via: "tags.link(itemType=task)", description: "给任务批量挂标签。" },
                { kind: "site", via: "sites.create(tagIds) / sites.update(tagIds)", description: "站点插件存在时，由站点写入自己的标签映射。" },
              ],
              examples: [{ purpose: "先查后建", args: { name: "DSH" } }],
            },
          ],
          fields: [
            { name: "name / text", type: "string", description: "标签名。tags.create 用 name，同名幂等返回已有 id（existing=true）；查询用 text 做模糊匹配；tags.update 改名撞名会被拒绝" },
            { name: "id / tagId", type: "string|number", description: "标签 id；多数 action 两者等价，id 是首选字段" },
            { name: "tagIds", type: "string[]", description: "批量操作的标签 id 列表（tags.link / tags.unlink）" },
            { name: "itemIds", type: "string[]", description: "要挂/解标签的业务对象 id 列表；与 tagIds 做笛卡尔积写入" },
            { name: "itemType", type: "string", description: "业务对象类型，缺省 task；站点用 site。未知类型会被拒绝，task/site 之外的类型不会自动出现在站点或任务视图里" },
            { name: "pageNumber / pageSize", type: "number", description: "分页，页码从 1 开始；pageSize 上限由插件配置决定（默认 12）" },
            { name: "range / from / to", type: "7d|30d|90d|365d|all / YYYY-MM-DD", description: "仅统计类 action：range 缺省 30d；from+to 是闭区间 [from,to]，两端都含" },
          ],
          notFor: ["不要用标签代替任务标题或站点描述"],
          notes: ["标签名最大 64 字符且同一时刻唯一（软删的不占位）；存量重名在插件升级时按 created_at 最早者自动合并，映射改挂到保留者。", "备份导入遇到「不同 id、同名」的标签时按名字合并并计入 skipped。", "tags.link 的 itemType 默认 task；站点标签由站点插件写入。"],
        },
        setup,
        exportData: () => exportTagsData(requireApi()),
        importData: (raw, _ctx, options) => importTagsData(requireApi(), raw, options),
      }),
    "tags-domain",
  );
}