/**
 * 保险箱 action 契约：所有写操作按 origin 门禁，agent 永远拿不到明文。
 * 分组与关联对 plugin 开放，业务模块用自身标识注册，不需要依赖 sites。
 */
import { KINDS } from "./secret-input.js";
import { createSets } from "./sets.js";
import { registerSetActions } from "./actions-sets.js";

function only(ctx, allowed, action) {
  const origin = ctx && ctx.origin ? ctx.origin : "agent";
  if (!allowed.includes(origin)) throw new Error(action + " 不允许 " + origin + " 调用");
}

export function registerVaultActions(api, vault, groups) {
  const sets = createSets({ db: api.db });
  api.action("vault.status", {
    description: "只读：保险箱是否初始化、是否锁定、解锁模式、凭据/分组数量与同步状态；不含任何密文。",
    input: { type: "object", properties: {}, additionalProperties: false },
    execute: (_args, ctx) => {
      only(ctx, ["ui", "agent", "plugin"], "vault.status");
      return vault.status();
    },
  });

  api.action("vault.setup", {
    origins: ["ui"],
    description: "首次初始化保险箱：设置口令与解锁模式 A/B/C，默认 A（每次启动锁定）。口令包裹会上云。",
    input: {
      type: "object",
      properties: {
        passphrase: { type: "string", description: "主口令，至少 12 个字符" },
        mode: { type: "string", enum: ["A", "B", "C"], description: "解锁模式，默认 A" },
      },
      required: ["passphrase"],
      additionalProperties: false,
    },
    examples: [{ passphrase: "correct horse battery", mode: "A" }],
    execute: (args, ctx) => {
      only(ctx, ["ui"], "vault.setup");
      return vault.setup(args);
    },
  });

  api.action("vault.unlock", {
    origins: ["ui"],
    description: "用主口令解锁保险箱；连续 5 次失败锁定 5 分钟。",
    input: {
      type: "object",
      properties: { passphrase: { type: "string", description: "主口令" } },
      required: ["passphrase"],
      additionalProperties: false,
    },
    execute: (args, ctx) => {
      only(ctx, ["ui"], "vault.unlock");
      return vault.unlock(args);
    },
  });

  api.action("vault.lock", {
    origins: ["ui", "plugin"],
    description: "立即清除内存中的 DEK；插件后台可用它主动锁定。",
    input: { type: "object", properties: {}, additionalProperties: false },
    execute: (_args, ctx) => {
      only(ctx, ["ui", "plugin"], "vault.lock");
      vault.lock();
      return { ok: true };
    },
  });

  api.action("vault.setUnlockMode", {
    origins: ["ui"],
    description: "切换解锁模式：A 全锁 / B 自动解锁但查看需口令 / C 自动解锁且查看免口令。",
    input: {
      type: "object",
      properties: {
        mode: { type: "string", enum: ["A", "B", "C"] },
        passphrase: { type: "string", description: "锁定状态下切换 B/C 需要主口令" },
      },
      required: ["mode"],
      additionalProperties: false,
    },
    execute: (args, ctx) => {
      only(ctx, ["ui"], "vault.setUnlockMode");
      return vault.setUnlockMode(args);
    },
  });

  api.action("vault.changePassphrase", {
    origins: ["ui"],
    description: "修改主口令：只重包 DEK 并让 passphrase_rev 加一，不重新加密所有 secret。",
    input: {
      type: "object",
      properties: {
        oldPassphrase: { type: "string" },
        newPassphrase: { type: "string", description: "至少 12 个字符" },
      },
      required: ["oldPassphrase", "newPassphrase"],
      additionalProperties: false,
    },
    execute: (args, ctx) => {
      only(ctx, ["ui"], "vault.changePassphrase");
      return vault.changePassphrase(args);
    },
  });

  api.action("vault.secretList", {
    description: "只读：列出凭据名称/类型/集合归属/备注/最近使用时间，永远不含明文。",
    input: {
      type: "object",
      properties: {
        q: { type: "string", description: "按名称或备注模糊搜索" },
        kind: { type: "string", enum: KINDS },
        groupId: { type: "string", description: "只看某个分组（经集合关联）" },
        setId: { type: "string", description: "只看某个凭据集合" },
      },
      additionalProperties: false,
    },
    execute: (args, ctx) => {
      only(ctx, ["ui", "agent"], "vault.secretList");
      return vault.listSecrets(args);
    },
  });

  api.action("vault.secretCreate", {
    origins: ["ui"],
    description: "新增凭据；secret 只在内存加密后落库，审计中该字段显示为 ***。",
    input: {
      type: "object",
      properties: {
        name: { type: "string", description: "唯一名称，1–100 字" },
        kind: { type: "string", enum: KINDS },
        secret: { type: "string", description: "明文密码/token，不会落审计" },
        meta: { type: "object", description: "非敏感备注：用户名、URL、过期提醒" },
        groupId: { type: "string", description: "所属分组，可空；写入时自动挂到该组的默认集合" },
        setId: { type: "string", description: "直接指定凭据集合，优先于 groupId" },
      },
      required: ["name", "kind", "secret"],
      additionalProperties: false,
    },
    examples: [{ name: "sspai-basic", kind: "password", secret: "app-password", meta: { username: "me" } }],
    execute: (args, ctx) => {
      only(ctx, ["ui"], "vault.secretCreate");
      return vault.createSecret(args);
    },
  });

  api.action("vault.secretUpdate", {
    origins: ["ui"],
    description: "更新名称/类型/备注或轮换明文；改名称或类型会重加密，改归属不会。",
    input: {
      type: "object",
      properties: {
        id: { type: "string" },
        name: { type: "string" },
        kind: { type: "string", enum: KINDS },
        secret: { type: "string", description: "留空表示不轮换" },
        meta: { type: "object" },
        groupId: { type: "string", description: "再挂到某个分组的默认集合（不改动已有集合）" },
        setId: { type: "string", description: "指定集合；P2 起可用" },
      },
      required: ["id"],
      additionalProperties: false,
    },
    execute: (args, ctx) => {
      only(ctx, ["ui"], "vault.secretUpdate");
      return vault.updateSecret(args);
    },
  });

  api.action("vault.secretDelete", {
    origins: ["ui"],
    description: "软删除凭据；已绑定它的连接器会在下次运行时提示凭据失效。",
    input: {
      type: "object",
      properties: { id: { type: "string" } },
      required: ["id"],
      additionalProperties: false,
    },
    execute: (args, ctx) => {
      only(ctx, ["ui"], "vault.secretDelete");
      return vault.deleteSecret(args);
    },
  });

  registerSetActions({ api, sets, groups, vault, only, KINDS });

  api.action("vault.secretReveal", {
    origins: ["ui"],
    description: "在界面上显示一条凭据明文；B 模式必须再输口令，agent/plugin 一律拒绝。",
    input: {
      type: "object",
      properties: {
        id: { type: "string" },
        passphrase: { type: "string", description: "B 模式必需" },
      },
      required: ["id"],
      additionalProperties: false,
    },
    execute: (args, ctx) => {
      only(ctx, ["ui"], "vault.secretReveal");
      return vault.reveal(args);
    },
  });

  api.action("vault.lease", {
    origins: ["plugin"],
    description: "后台插件租用凭据明文，ttl 30–300 秒；只允许 plugin origin，传 subject 时校验绑定。",
    input: {
      type: "object",
      properties: {
        id: { type: "string" },
        purpose: { type: "string", description: "用途，写入审计" },
        ttlSeconds: { type: "number", description: "30–300，默认 60" },
        subjectType: { type: "string", description: "调用方业务类型；与 subjectId 一起校验绑定" },
        subjectId: { type: "string", description: "调用方业务对象 id" },
      },
      required: ["id"],
      additionalProperties: false,
    },
    execute: (args, ctx) => {
      only(ctx, ["plugin"], "vault.lease");
      return vault.lease(args);
    },
  });

  api.action("vault.rotateDeviceKey", {
    origins: ["ui"],
    description: "重写自动解锁的 device key 包裹；B/C 模式可用，需要主口令。",
    input: {
      type: "object",
      properties: { passphrase: { type: "string" } },
      required: ["passphrase"],
      additionalProperties: false,
    },
    execute: (args, ctx) => {
      only(ctx, ["ui"], "vault.rotateDeviceKey");
      return vault.rotateDeviceKey(args);
    },
  });

  api.action("vault.groupList", {
    description: "只读：分组列表（含凭据数、关联对象数）；不含密文。",
    input: {
      type: "object",
      properties: { q: { type: "string", description: "按组名/描述搜索" } },
      additionalProperties: false,
    },
    execute: (args, ctx) => {
      only(ctx, ["ui", "agent", "plugin"], "vault.groupList");
      return groups.groupList(args);
    },
  });

  api.action("vault.groupCreate", {
    origins: ["ui"],
    description: "新建凭据分组；组名唯一。",
    input: {
      type: "object",
      properties: {
        name: { type: "string", description: "1–60 字" },
        description: { type: "string" },
        color: { type: "string", description: "可选色标" },
      },
      required: ["name"],
      additionalProperties: false,
    },
    execute: (args, ctx) => {
      only(ctx, ["ui"], "vault.groupCreate");
      return groups.groupCreate(args);
    },
  });

  api.action("vault.groupUpdate", {
    origins: ["ui"],
    description: "改名/描述/色标；不改动组内凭据的密文。",
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
      only(ctx, ["ui"], "vault.groupUpdate");
      return groups.groupUpdate(args);
    },
  });

  api.action("vault.groupDelete", {
    origins: ["ui"],
    description: "软删除分组：组内凭据移到 moveTo，未指定则移出分组；组上的绑定一并软删。",
    input: {
      type: "object",
      properties: {
        id: { type: "string" },
        moveTo: { type: "string", description: "可选，接收凭据的分组 id" },
      },
      required: ["id"],
      additionalProperties: false,
    },
    execute: (args, ctx) => {
      only(ctx, ["ui"], "vault.groupDelete");
      return groups.groupDelete(args);
    },
  });

  api.action("vault.subjectRegister", {
    origins: ["plugin"],
    description: "业务插件注册自己的关联类型（幂等），供组详情页显示可读标题。",
    input: {
      type: "object",
      properties: {
        type: { type: "string", description: "小写标识，如 site" },
        title: { type: "string", description: "展示名，如 站点" },
        description: { type: "string" },
      },
      required: ["type", "title"],
      additionalProperties: false,
    },
    execute: (args, ctx) => {
      only(ctx, ["plugin"], "vault.subjectRegister");
      return groups.subjectRegister(args);
    },
  });

  api.action("vault.bind", {
    origins: ["ui", "plugin"],
    description: "把业务对象关联到凭据分组（重复绑定幂等）；vault 不校验对象是否存在。",
    input: {
      type: "object",
      properties: {
        subjectType: { type: "string" },
        subjectId: { type: "string" },
        groupId: { type: "string" },
      },
      required: ["subjectType", "subjectId", "groupId"],
      additionalProperties: false,
    },
    execute: (args, ctx) => {
      only(ctx, ["ui", "plugin"], "vault.bind");
      return groups.bind(args);
    },
  });

  api.action("vault.unbind", {
    origins: ["ui", "plugin"],
    description: "解除一个业务对象与分组的关联（软删）。",
    input: {
      type: "object",
      properties: {
        subjectType: { type: "string" },
        subjectId: { type: "string" },
        groupId: { type: "string" },
      },
      required: ["subjectType", "subjectId", "groupId"],
      additionalProperties: false,
    },
    execute: (args, ctx) => {
      only(ctx, ["ui", "plugin"], "vault.unbind");
      return groups.unbind(args);
    },
  });

  api.action("vault.bindingsOf", {
    description: "只读：某个业务对象关联了哪些分组（含组名、凭据数）。",
    input: {
      type: "object",
      properties: { subjectType: { type: "string" }, subjectId: { type: "string" } },
      required: ["subjectType", "subjectId"],
      additionalProperties: false,
    },
    execute: (args, ctx) => {
      only(ctx, ["ui", "agent", "plugin"], "vault.bindingsOf");
      return groups.bindingsOf(args);
    },
  });

  api.action("vault.subjectsOf", {
    description: "只读：某个分组关联了哪些业务对象。",
    input: {
      type: "object",
      properties: {
        groupId: { type: "string" },
        limit: { type: "number" },
        offset: { type: "number" },
      },
      required: ["groupId"],
      additionalProperties: false,
    },
    execute: (args, ctx) => {
      only(ctx, ["ui", "agent"], "vault.subjectsOf");
      return groups.subjectsOf(args);
    },
  });

  api.action("vault.subjectSecrets", {
    origins: ["plugin"],
    description: "后台插件只读：某个业务对象经分组可见的凭据清单（不含明文），拿到 id 后再 lease。",
    input: {
      type: "object",
      properties: { subjectType: { type: "string" }, subjectId: { type: "string" } },
      required: ["subjectType", "subjectId"],
      additionalProperties: false,
    },
    execute: (args, ctx) => {
      only(ctx, ["plugin"], "vault.subjectSecrets");
      return groups.subjectSecrets(args);
    },
  });

  api.action("vault.bindingPurge", {
    origins: ["plugin"],
    description: "插件卸载/业务对象删除时清理自己的绑定引用（硬删）。",
    input: {
      type: "object",
      properties: { subjectType: { type: "string" }, subjectId: { type: "string" } },
      required: ["subjectType"],
      additionalProperties: false,
    },
    execute: (args, ctx) => {
      only(ctx, ["plugin"], "vault.bindingPurge");
      return groups.bindingPurge(args);
    },
  });

  api.action("vault.syncStatus", {
    description: "只读：同步 schema 版本、口令修订号与同步表清单；不含密文，冲突列表在宿主同步页。",
    input: { type: "object", properties: {}, additionalProperties: false },
    execute: (_args, ctx) => {
      only(ctx, ["ui", "agent"], "vault.syncStatus");
      const status = vault.status();
      return {
        schemaVersion: status.schemaVersion,
        passphraseRev: status.passphraseRev,
        cloudSync: true,
        tables: ["vault_header", "vault_secret", "vault_group", "vault_binding", "vault_subject_type"],
        localOnly: ["vault_device", "vault_secret_usage"],
        pending: null,
        conflicts: null,
        note: "同步状态与冲突在宿主的同步页查看；device key 与使用记录不上云。",
      };
    },
  });

  api.action("vault.dataTables", {
    origins: ["ui"],
    description: "只读：数据页表清单。",
    input: { type: "object", properties: {}, additionalProperties: false },
    execute: (_args, ctx) => {
      only(ctx, ["ui"], "vault.dataTables");
      return {
        tables: [
          {
            name: "vault_secret",
            columns: ["id", "name", "kind", "meta", "ciphertext", "created_at", "updated_at", "deleted_at", "rev"],
          },
          { name: "vault_group", columns: ["id", "name", "description", "color", "created_at", "updated_at"] },
          {
            name: "vault_binding",
            columns: ["id", "subject_type", "subject_id", "group_id", "created_at", "updated_at"],
          },
          {
            name: "vault_set",
            columns: ["id", "name", "description", "color", "created_at", "updated_at", "deleted_at", "rev"],
          },
          {
            name: "vault_group_set",
            columns: ["id", "group_id", "set_id", "created_at", "updated_at", "deleted_at", "rev"],
          },
          {
            name: "vault_set_secret",
            columns: ["id", "set_id", "secret_id", "created_at", "updated_at", "deleted_at", "rev"],
          },
        ],
      };
    },
  });

  api.action("vault.dataQuery", {
    origins: ["ui"],
    description: "只读：数据页查询；密文列一律掩码。",
    input: {
      type: "object",
      properties: {
        table: {
          type: "string",
          enum: ["vault_secret", "vault_group", "vault_binding", "vault_set", "vault_group_set", "vault_set_secret"],
        },
        limit: { type: "number", description: "默认 50，上限 200" },
        offset: { type: "number", description: "默认 0" },
      },
      required: ["table"],
      additionalProperties: false,
    },
    execute: (args, ctx) => {
      only(ctx, ["ui"], "vault.dataQuery");
      const table = String(args.table);
      const limit = Math.max(1, Math.min(200, Number(args.limit) || 50));
      const offset = Math.max(0, Number(args.offset) || 0);
      if (table === "vault_secret") {
        const rows = api.db
          .prepare(
            "SELECT id, name, kind, meta, ciphertext, created_at, updated_at, deleted_at, rev " +
              "FROM vault_secret ORDER BY updated_at DESC LIMIT ? OFFSET ?",
          )
          .all(limit, offset);
        return {
          table,
          rows: rows.map((row) => ({ ...row, ciphertext: "***" })),
          limit,
          offset,
        };
      }
      const safe = {
        vault_group: "vault_group",
        vault_binding: "vault_binding",
        vault_set: "vault_set",
        vault_group_set: "vault_group_set",
        vault_set_secret: "vault_set_secret",
      }[table];
      if (!safe) throw new Error("不支持的数据表：" + table);
      const rows = api.db
        .prepare("SELECT * FROM " + safe + " ORDER BY updated_at DESC LIMIT ? OFFSET ?")
        .all(limit, offset);
      return { table, rows, limit, offset };
    },
  });
}
