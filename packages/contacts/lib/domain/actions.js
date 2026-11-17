/** 联系人 action：写操作仅 UI，读操作允许 agent。 */
const TABLES = {
  contact: ["id", "name", "org", "title", "birthday", "updated_at"],
  contact_group: ["id", "name", "color", "updated_at"],
  contact_field: ["id", "contact_id", "kind", "label", "value"],
};
function deny(origin) { if (origin !== "ui") { const e = new Error("该操作只允许 ui 调用"); e.status = 403; throw e; } }

export function registerContactActions(api, engine) {
  const defs = [];
  const action = (name, def) => {
    defs.push({ name, domain: "wb-addon-contacts", description: def.description || "", input: def.input || { type: "object", properties: {} }, examples: def.examples || [] });
    api.action(name, def);
  };
  action("contacts.status", { description: "联系人统计", input: { type: "object", properties: {} }, execute: () => engine.stats() });
  action("contacts.list", {
    description: "联系人列表，可按关键词或分组过滤",
    input: { type: "object", properties: { q: { type: "string" }, groupId: { type: "string" }, limit: { type: "number" }, offset: { type: "number" } } },
    execute: (args) => engine.list({ q: args.q, groupId: args.groupId, limit: args.limit, offset: args.offset }),
  });
  action("contacts.get", { description: "联系人详情（含字段与分组）", input: { type: "object", properties: { id: { type: "string" } }, required: ["id"] }, execute: (args) => engine.one(args.id) });
  action("contacts.create", {
    description: "新建联系人；仅 UI",
    input: { type: "object", properties: { name: { type: "string" }, org: { type: "string" }, title: { type: "string" }, note: { type: "string" }, birthday: { type: "string" }, fields: { type: "array" }, groups: { type: "array" } }, required: ["name"] },
    execute: (args, ctx) => { deny(ctx.origin); return engine.create({ name: args.name, org: args.org, title: args.title, note: args.note, birthday: args.birthday, fields: args.fields, groups: args.groups }); },
  });
  action("contacts.update", {
    description: "更新联系人；仅 UI",
    input: { type: "object", properties: { id: { type: "string" }, name: { type: "string" }, org: { type: "string" }, title: { type: "string" }, note: { type: "string" }, birthday: { type: "string" }, fields: { type: "array" }, groups: { type: "array" } }, required: ["id"] },
    execute: (args, ctx) => { deny(ctx.origin); return engine.update({ id: args.id, name: args.name, org: args.org, title: args.title, note: args.note, birthday: args.birthday, fields: args.fields, groups: args.groups }); },
  });
  action("contacts.delete", { description: "软删除联系人；仅 UI", input: { type: "object", properties: { id: { type: "string" } }, required: ["id"] }, execute: (args, ctx) => { deny(ctx.origin); return engine.remove(args.id); } });
  action("contacts.search", { description: "按姓名/组织/字段搜索联系人", input: { type: "object", properties: { q: { type: "string" }, limit: { type: "number" } }, required: ["q"] }, execute: (args) => engine.search(args.q, { limit: args.limit }) });
  action("contacts.groupList", { description: "分组列表与人数", input: { type: "object", properties: {} }, execute: () => ({ items: engine.groups() }) });
  action("contacts.groupCreate", { description: "新建分组；仅 UI", input: { type: "object", properties: { name: { type: "string" }, color: { type: "string" } }, required: ["name"] }, execute: (args, ctx) => { deny(ctx.origin); return engine.createGroup({ name: args.name, color: args.color }); } });
  action("contacts.groupDelete", { description: "删除分组；仅 UI", input: { type: "object", properties: { id: { type: "string" } }, required: ["id"] }, execute: (args, ctx) => { deny(ctx.origin); return engine.deleteGroup(args.id); } });
  action("contacts.importVcf", { description: "导入 vCard 文本；仅 UI", input: { type: "object", properties: { text: { type: "string" } }, required: ["text"] }, execute: (args, ctx) => { deny(ctx.origin); return engine.importVcf(args.text); } });
  action("contacts.exportVcf", { description: "导出 vCard 文本，可指定 id 列表", input: { type: "object", properties: { ids: { type: "array" } } }, execute: (args) => engine.exportVcf(args.ids) });
  action("contacts.dataTables", { description: "数据页白名单", input: { type: "object", properties: {} }, execute: () => ({ tables: Object.keys(TABLES), columns: TABLES }) });
  action("contacts.dataQuery", {
    description: "白名单只读查询；仅 UI",
    input: { type: "object", properties: { table: { type: "string" }, limit: { type: "number" }, offset: { type: "number" } }, required: ["table"] },
    execute: (args, ctx) => {
      deny(ctx.origin);
      const table = String(args.table || "");
      if (!TABLES[table]) throw new Error("表不在白名单：" + table);
      const limit = Math.max(1, Math.min(200, Number(args.limit) || 50));
      const offset = Math.max(0, Number(args.offset) || 0);
      return { table, rows: api.db.prepare("SELECT " + TABLES[table].join(",") + " FROM " + table + " ORDER BY rowid DESC LIMIT ? OFFSET ?").all(limit, offset) };
    },
  });
  action("contacts.actionSchema", { description: "本域 action 清单与输入 schema", input: { type: "object", properties: {} }, execute: () => ({ shellVersion: api.shellVersion || "", domains: [{ id: "wb-addon-contacts", version: (api.addon && api.addon.version) || "0.1.0" }], actions: defs }) });
}
