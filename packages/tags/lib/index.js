/**
 * 标签业务插件（DSH 原生插件）。
 * 所有业务逻辑都在本地 SQLite 完成；云端只负责备份。
 */

import { bindClock, ensureSchema } from "./db.js";
import { exportTagsData, importTagsData } from "./backup.js";
import { tagSync } from "./sync.js";
import { registerTagActions } from "./tags.js";

export const inject = ["workbench"];

let domainApi = null;
function requireApi() {
  if (!domainApi) throw new Error("标签模块尚未初始化");
  return domainApi;
}

export function setup(api) {
  domainApi = api;
  if (typeof api.now === "function") bindClock(api.now);
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
        version: "1.3.1",
        tables: ["tag", "tag_mapping"],
        sync: tagSync,
        views: [{ id: "tags", title: { zh: "标签", en: "Tags" } }],
        capability: {
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
              dedupe: "没有内置去重；先用 tags.list / tags.search 查重名，再决定是否创建。",
              relations: [
                { kind: "task", via: "tags.link(itemType=task)", description: "给任务批量挂标签。" },
                { kind: "site", via: "sites.create(tagIds) / sites.update(tagIds)", description: "站点插件存在时，由站点写入自己的标签映射。" },
              ],
              examples: [{ purpose: "先查后建", args: { name: "DSH" } }],
            },
          ],
          notFor: ["不要用标签代替任务标题或站点描述"],
          notes: ["标签名最大 64 字符；重名会报错。", "tags.link 的 itemType 默认 task；站点标签由站点插件写入。"],
        },
        setup,
        exportData: () => exportTagsData(requireApi()),
        importData: (raw, _ctx, options) => importTagsData(requireApi(), raw, options),
      }),
    "tags-domain",
  );
}