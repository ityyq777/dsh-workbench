/** wb-addon-contacts：本地联系人、分组与 vCard 导入导出。 */
import { bindClock, ensureSchema } from "./db/db.js";
import { createContacts } from "./domain/contacts.js";
import { registerContactActions } from "./domain/actions.js";

export const inject = ["workbench"];
let engine = null;

export function setup(api) {
  if (typeof api.now === "function") bindClock(api.now);
  ensureSchema(api.db);
  engine = createContacts({ db: api.db, host: api, log: api.log });
  registerContactActions(api, engine);
  if (typeof api.registerSearchProvider === "function") {
    api.registerSearchProvider({ domainId: "wb-addon-contacts", search: (q, opts) => engine.search(q, opts) });
  }
  api.log("contacts domain ready", api.addon.version);
}

export function apply(ctx) {
  const host = ctx.workbench;
  if (!host) throw new Error("dsh-workbench 未加载：缺少 workbench 服务");
  ctx.effect(() => host.registerDomain({
    id: "wb-addon-contacts",
    title: "联系人",
    description: "本地联系人、分组、多值字段与 vCard 导入导出；支持跨域搜索",
    version: "0.1.6",
    category: "comm",
    tables: ["contact", "contact_group", "contact_field", "contact_group_member"],
    sync: { tables: [] },
    views: [
      { id: "contacts", title: { zh: "联系人", en: "Contacts" } },
      { id: "groups", title: { zh: "分组", en: "Groups" } },
      { id: "importExport", title: { zh: "导入导出", en: "Import / Export" } },
      { id: "config", title: { zh: "设置", en: "Settings" } },
      { id: "data", title: { zh: "数据", en: "Data" } },
      { id: "actions", title: { zh: "Action", en: "Actions" } },
    ],
    capability: {
      taskOwnership: { boundary: "联系人用 contacts.create；跟进联系人的工作项用 tasks.create。", query: "contacts" },
      summary: "保存本地联系人与分组，支持 vCard 导入导出；不提供邮件发送或日历。",
      records: [{ kind: "contact", title: "联系人", description: "姓名 + 邮箱/电话等字段 + 分组。", when: ["需要长期保存某人的联系方式", "从 vCard 批量导入"], notFor: ["一次性地址", "把联系人当任务"], primaryAction: "contacts.create", keyArgs: ["name", "fields", "groups"] }],
      fields: [
        { name: "name", type: "string", description: "姓名，必填" },
        { name: "fields", type: "array", description: "[{kind:email|phone|im|url|other,label,value,primary}]" },
        { name: "groups", type: "array", description: "分组 id 列表" },
      ],
      notFor: ["不做 CardDAV 同步", "不做邮件发送"],
      notes: ["只在本机保存，不参与云同步；备份包含联系人与分组。", "vCard 导入最多 500 条，导出默认最多 200 条。"],
    },
    exportData: () => ({ contacts: engine.list({ limit: 200 }).items, groups: engine.groups() }),
    importData: (payload) => {
      const data = payload && typeof payload === "object" ? payload : {};
      let imported = 0;
      for (const c of Array.isArray(data.contacts) ? data.contacts : []) {
        try { engine.create(c); imported += 1; } catch { /* 跳过非法 */ }
      }
      return { imported };
    },
    setup,
  }), "contacts-domain");
}

export const CONTACTS_DOMAIN = "wb-addon-contacts";
