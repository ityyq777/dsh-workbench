import { bindClock, ensureSchema } from "./db/db.js";
import { registerStorageActions } from "./domain/storage.js";
import { registerConfigActions } from "./infra/config.js";
import { registerDataActions } from "./infra/data.js";
import { exportStorageData, importStorageData } from "./infra/backup.js";
export const inject = ["workbench"];
export const storageSync = { tables: [{ name: "storage", mode: "row" }] };
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
  bindClock(typeof api.now === "function" ? api.now : null);
  ensureSchema(api.db);
  const actionDefs = trackActions(api);
  registerStorageActions(api);
  registerConfigActions(api);
  registerDataActions(api);
  registerActionSchemaAction(api, actionDefs, "wb-addon-storage");
  api.log("storage domain ready");
}
export function apply(ctx) {
  const host = ctx.workbench;
  if (!host) throw new Error("dsh-workbench 未加载：缺少 workbench 服务");
  let domainApi;
  ctx.effect(
    () =>
      host.registerDomain({
        id: "wb-addon-storage",
        title: "储物",
        description: "储物：记录物品名称、品牌、单位、库存文本、存放位置、图片URL、备注与可选标签",
        version: "1.5.1",
        tables: ["storage"],
        sync: storageSync,
        backupAfter: ["wb-addon-tags"],
        views: [
          { id: "stats", title: { zh: "统计", en: "Statistics" } },
          { id: "storage", title: { zh: "记录", en: "Records" } },
          { id: "config", title: { zh: "配置", en: "Config" } },
          { id: "data", title: { zh: "数据", en: "Data" } },
        ],
        capability: {
          taskOwnership: { boundary: "物品登记使用 storage.create；开发、修复 storage 功能的工作项使用 tasks.create，不把物品记成任务。", query: "storage" },
          summary: "记录储物条目，库存可为 1~2 等文本，可记录存放位置；图片只保存HTTP(S) URL，不上传。标签为可选能力。",
          requires: [],
          records: [
            {
              kind: "storage",
              title: "储物",
              description: "储物条目：物品与当前库存文本",
              when: ["用户记录储物条目"],
              notFor: ["库存流水、自动扣减、文件上传"],
              primaryAction: "storage.create",
              keyArgs: ["name", "brand", "unit", "stock", "location", "imgList", "remark", "tagIds"],
              dedupe: "先用 storage.list 按名称查询",
              relations: [{ kind: "tag", via: "tagIds", description: "可选标签，需标签插件启用" }],
              examples: [{ purpose: "记录物品", args: { name: "电池", stock: "1~2", unit: "盒", location: "储物柜 A 层" } }],
            },
          ],
          fields: [
            { name: "name", type: "string", description: "必填物品名称" },
            { name: "stock", type: "string", description: "库存文本，支持范围" },
            { name: "location", type: "string", description: "存放位置，最多200字" },
            { name: "imgList", type: "string[]", description: "HTTP(S)图片URL" },
            { name: "remark", type: "string", description: "保存的备注" },
          ],
          notes: ["标签映射同步归标签域；物品行同步归本域。"],
          warnings: [],
        },
        setup: (api) => {
          domainApi = api;
          setup(api);
        },
        exportData: () => exportStorageData(domainApi),
        importData: (raw, _ctx, options) => importStorageData(domainApi, raw, options),
      }),
    "storage-domain",
  );
}
