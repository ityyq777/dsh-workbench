/**
 * 集合与后台写入 action：分组 ⊃ 集合 ⊃ 凭据三层里属于集合的部分。
 * 与 actions.js 分文件只为把单个文件保持在 600 行以内；契约不拆。
 */
export function registerSetActions({ api, sets, groups, vault, only, KINDS }) {
  api.action("vault.setList", {
    description: "只读：凭据集合列表，带凭据数与挂靠分组；可按名称/描述搜索、按分组过滤。",
    input: {
      type: "object",
      properties: {
        q: { type: "string", description: "按集合名或描述模糊搜索" },
        groupId: { type: "string", description: "只看某个分组下的集合" },
      },
      additionalProperties: false,
    },
    execute: (args, ctx) => {
      only(ctx, ["ui", "agent", "plugin"], "vault.setList");
      return sets.listSets(args);
    },
  });

  api.action("vault.setGet", {
    description: "只读：单个集合及其凭据清单（id/名称/类型/更新时间），不含明文。",
    input: {
      type: "object",
      properties: { id: { type: "string" } },
      required: ["id"],
      additionalProperties: false,
    },
    execute: (args, ctx) => {
      only(ctx, ["ui", "agent", "plugin"], "vault.setGet");
      return sets.getSet(args);
    },
  });

  api.action("vault.setCreate", {
    description: "新建凭据集合；名称全局唯一。",
    input: {
      type: "object",
      properties: {
        name: { type: "string", description: "集合名，1–100 字，全局唯一" },
        description: { type: "string", description: "用途说明" },
        color: { type: "string", description: "主题色 token 名或色值，可空" },
      },
      required: ["name"],
      additionalProperties: false,
    },
    execute: (args, ctx) => {
      only(ctx, ["ui"], "vault.setCreate");
      return sets.createSet(args);
    },
  });

  api.action("vault.setUpdate", {
    description: "改集合的名称/描述/颜色；改名不影响已有凭据（归属不进 AAD）。",
    input: {
      type: "object",
      properties: {
        id: { type: "string" },
        name: { type: "string" },
        description: { type: "string" },
        color: { type: "string" },
      },
      required: ["id"],
      additionalProperties: false,
    },
    execute: (args, ctx) => {
      only(ctx, ["ui"], "vault.setUpdate");
      return sets.updateSet(args);
    },
  });

  api.action("vault.setDelete", {
    description: "软删集合：只解除与分组、凭据的关联，凭据本身保留。",
    input: {
      type: "object",
      properties: { id: { type: "string" } },
      required: ["id"],
      additionalProperties: false,
    },
    execute: (args, ctx) => {
      only(ctx, ["ui"], "vault.setDelete");
      return sets.deleteSet(args.id);
    },
  });

  function pluginBoundOrThrow(args, ctx, action) {
    only(ctx, ["ui", "plugin"], action);
    if ((ctx && ctx.origin) === "plugin") assertSetInBoundGroups(args, args.setId);
  }

  api.action("vault.setAttachSecret", {
    description: "把一条凭据加进集合（幂等）；plugin 只能操作自己已绑定组下的集合。",
    input: {
      type: "object",
      properties: {
        setId: { type: "string" },
        secretId: { type: "string" },
        subjectType: { type: "string", description: "plugin 调用时必填" },
        subjectId: { type: "string", description: "plugin 调用时必填" },
      },
      required: ["setId", "secretId"],
      additionalProperties: false,
    },
    execute: (args, ctx) => {
      pluginBoundOrThrow(args, ctx, "vault.setAttachSecret");
      const row = api.db
        .prepare("SELECT 1 FROM vault_secret WHERE id = ? AND deleted_at IS NULL")
        .get(String(args.secretId || ""));
      if (!row) throw new Error("凭据不存在：" + args.secretId);
      const res = sets.linkSecret(args.setId, args.secretId);
      return { ok: true, setId: String(args.setId), secretId: String(args.secretId), existing: res.existing };
    },
  });

  api.action("vault.setDetachSecret", {
    description: "把一条凭据移出集合（幂等），凭据本身保留。",
    input: {
      type: "object",
      properties: {
        setId: { type: "string" },
        secretId: { type: "string" },
        subjectType: { type: "string", description: "plugin 调用时必填" },
        subjectId: { type: "string", description: "plugin 调用时必填" },
      },
      required: ["setId", "secretId"],
      additionalProperties: false,
    },
    execute: (args, ctx) => {
      pluginBoundOrThrow(args, ctx, "vault.setDetachSecret");
      return sets.unlinkSecret(args.setId, args.secretId);
    },
  });

  api.action("vault.groupAttachSet", {
    description: "把一个集合挂到分组下（幂等），组内凭据可见性随集合扩展。",
    input: {
      type: "object",
      properties: { groupId: { type: "string" }, setId: { type: "string" } },
      required: ["groupId", "setId"],
      additionalProperties: false,
    },
    execute: (args, ctx) => {
      only(ctx, ["ui"], "vault.groupAttachSet");
      return sets.linkGroupSet(args.groupId, args.setId);
    },
  });

  api.action("vault.groupDetachSet", {
    description: "把集合从分组下摘掉（幂等）；其它分组仍在用则不影响。",
    input: {
      type: "object",
      properties: { groupId: { type: "string" }, setId: { type: "string" } },
      required: ["groupId", "setId"],
      additionalProperties: false,
    },
    execute: (args, ctx) => {
      only(ctx, ["ui"], "vault.groupDetachSet");
      return sets.unlinkGroupSet(args.groupId, args.setId);
    },
  });

  function boundGroups(args) {
    const subjectType = String(args.subjectType || "");
    const subjectId = String(args.subjectId || "");
    if (!subjectType || !subjectId) throw new Error("subjectType 与 subjectId 必填");
    const result = groups.bindingsOf({ subjectType, subjectId });
    if (!result.items.length) throw new Error("该对象未绑定任何凭据组，无法写入");
    return result.items;
  }

  /** 插件只能碰自己 subject 已绑定组挂着的集合。 */
  function assertSetInBoundGroups(args, setId) {
    const items = boundGroups(args);
    const visible = new Set();
    for (const item of items) {
      for (const set of sets.setsOfGroup(item.groupId)) visible.add(set.id);
    }
    if (!visible.has(String(setId))) throw new Error("该集合不属于此对象已绑定的凭据组");
    return items;
  }

  /** 在 subject 已绑定组内按名称找集合；找不到就建并把集合挂到唯一的绑定组上。 */
  function ensureSetForSubject(args) {
    const setName = String(args.setName || "").trim();
    if (!setName) throw new Error("setName 必填");
    const items = boundGroups(args);
    if (args.groupId && !items.some((item) => item.groupId === String(args.groupId))) {
      throw new Error("该凭据组未绑定到此对象");
    }
    for (const item of items) {
      const existing = sets.setsOfGroup(item.groupId).find((set) => set.name === setName);
      if (existing) return existing;
    }
    const groupId = args.groupId ? String(args.groupId) : items.length === 1 ? items[0].groupId : "";
    if (!groupId) throw new Error("对象绑定了多个凭据组，需指定 groupId");
    if (!items.some((item) => item.groupId === groupId)) throw new Error("该凭据组未绑定到此对象");
    const created = sets.ensureSet(setName);
    sets.linkGroupSet(groupId, created.id);
    return created;
  }

  api.action("vault.pluginSecretUpsert", {
    description:
      "后台插件写：在自己 subject 已绑定的凭据组内按 setName 幂等建/取集合，再全局按 name 幂等写一条凭据并加入集合；不返回明文。",
    input: {
      type: "object",
      properties: {
        subjectType: { type: "string", description: "业务对象类型，如 site" },
        subjectId: { type: "string", description: "业务对象 id" },
        setName: { type: "string", description: "集合名（业务侧账号 id），组内幂等" },
        groupId: { type: "string", description: "绑定多个组时指定挂靠组，可省略" },
        name: { type: "string", description: "凭据名（全局唯一），如 <accountId> · 密码" },
        kind: { type: "string", enum: KINDS },
        secret: { type: "string", description: "明文，落库前加密" },
        meta: { type: "object", description: "非敏感元数据，禁止 password/token 等键名" },
      },
      required: ["subjectType", "subjectId", "setName", "name", "secret"],
      additionalProperties: false,
    },
    execute: (args, ctx) => {
      only(ctx, ["plugin"], "vault.pluginSecretUpsert");
      const set = ensureSetForSubject(args);
      return vault.writeSecretToSet({ ...args, setId: set.id });
    },
  });

  api.action("vault.pluginSecretDelete", {
    description: "后台插件写：把自己 subject 的某条凭据从指定集合摘出；不再属于任何集合时软删。",
    input: {
      type: "object",
      properties: {
        subjectType: { type: "string" },
        subjectId: { type: "string" },
        setName: { type: "string", description: "集合名（业务侧账号 id）" },
        name: { type: "string" },
      },
      required: ["subjectType", "subjectId", "setName", "name"],
      additionalProperties: false,
    },
    execute: (args, ctx) => {
      only(ctx, ["plugin"], "vault.pluginSecretDelete");
      const set = ensureSetForSubject(args);
      return vault.detachSecretFromSet({ setId: set.id, name: args.name });
    },
  });

  api.action("vault.pluginSetGet", {
    description: "后台插件读：取业务侧的集合（按 setName 在自己已绑定的组内查找），不存在返回空。",
    input: {
      type: "object",
      properties: {
        subjectType: { type: "string" },
        subjectId: { type: "string" },
        setName: { type: "string" },
      },
      required: ["subjectType", "subjectId", "setName"],
      additionalProperties: false,
    },
    execute: (args, ctx) => {
      only(ctx, ["plugin"], "vault.pluginSetGet");
      const setName = String(args.setName || "").trim();
      if (!setName) throw new Error("setName 必填");
      for (const item of boundGroups(args)) {
        const found = sets.setsOfGroup(item.groupId).find((set) => set.name === setName);
        if (found) return { set: found, groupId: item.groupId };
      }
      return { set: null };
    },
  });
}
