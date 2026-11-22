"use strict";
// 「Action」页的数据源：只返回运行时注册的 schema，不执行 action、不写库。

export function registerSchemaAction(api, defs, domain) {
  const prefix = domain.replace(/^wb-addon-/, "");
  api.action(prefix + ".actionSchema", {
    description: "只读：返回本插件运行时注册的 action schema（供「Action」页渲染）",
    input: { type: "object", properties: {}, additionalProperties: false },
    execute: () => ({
      shellVersion: api.shellVersion || "",
      domains: [{ id: domain, version: api.addon && api.addon.version ? api.addon.version : "" }],
      actions: Array.from(defs, ([name, def]) => ({
        name,
        domain,
        description: typeof def.description === "string" ? def.description : "",
        input: def.input && typeof def.input === "object" ? def.input : { type: "object", properties: {} },
        examples: Array.isArray(def.examples) ? def.examples : [],
      })),
    }),
    render: (r) => `弹幕插件 ${r.actions.length} 个 action`,
  });
}

export function trackActions(api) {
  const defs = new Map();
  const raw = typeof api.action === "function" ? api.action.bind(api) : null;
  if (raw) {
    api.action = function (name, def) {
      defs.set(name, def || {});
      return raw(name, def);
    };
  }
  return defs;
}
