/**
 * 站点账号（site_account）与账号外联（site_account_external）。
 *
 * 设计见 docs/specs/48-站点账号接入凭据分组与迁移方案.md（直接切换版）：
 * - 账号的密码/手机号/证件号不再进 site_account，写入即进 vault，按「站点 = 一类凭据 = 一个组」组织；
 * - sites 只通过 vault 的 plugin 接口读写，不接触密钥与密文；
 * - 列表只回掩码与 has 标记；界面显形由前端拿 secretIds 调 vault.secretReveal；
 * - 三条挂靠规则：删站守卫、bindable 关闭守卫、删账号双向清外联。
 */

import { now, newId, idOf, tx, logChange } from "../db/db.js";
import {
  ACCOUNT_TABLE,
  EXTERNAL_TABLE,
  MAX_ACCOUNT,
  MAX_REMARK,
  MAX_PHONE,
  MAX_IDENTITY,
  liveAccount,
  siteOf,
  textOf,
  keyOf,
  assertKeyUnique,
  outAccount,
  listAccounts,
  sensitiveInputOf,
  assertLinkable,
  replaceExternals,
  insertRelation,
} from "./accounts-model.js";
import {
  vaultInstalled,
  vaultStatus,
  requireVault,
  flagsOfSite,
  upsertAccountSecrets,
  setAccountOf,
  deleteAccountField,
  deleteAccountSecrets,
} from "../infra/vault-link.js";

export {
  ACCOUNT_TABLE,
  EXTERNAL_TABLE,
  ACCOUNT_DDL,
  EXTERNAL_DDL,
  SENSITIVE_FIELDS,
  listAccounts,
  outAccount,
  externalsOf,
  liveAccount,
  assertNoAccounts,
  assertBindableUnused,
} from "./accounts-model.js";

function assertFieldLength(field, value) {
  if (field === "phone" && value.length > MAX_PHONE) throw new Error("手机号最多 " + MAX_PHONE + " 个字符");
  if (field === "identity" && value.length > MAX_IDENTITY) throw new Error("身份证最多 " + MAX_IDENTITY + " 个字符");
  if (field === "password" && value.length > 256) throw new Error("密码最多 256 个字符");
}

/** 账号在 vault 里的三个字段是否已保存（缺省视为未保存）。 */
async function accountEntry(db, row) {
  const flags = await flagsOfSite(db, row.site_id);
  return flags.get(String(row.id)) || { fields: new Set(), ids: {}, setId: "", invalid: false };
}

/** 站点行记住账号的凭据集合，便于列表发现「集合被删」。 */
function rememberSet(db, accountId, setId, origin) {
  const ts = now();
  db.prepare("UPDATE " + ACCOUNT_TABLE + " SET vault_set_id=?, updated_at=?, rev=rev+1 WHERE id=?").run(
    String(setId),
    ts,
    accountId,
  );
  const row = db.prepare("SELECT * FROM " + ACCOUNT_TABLE + " WHERE id=?").get(accountId);
  logChange(db, ACCOUNT_TABLE, accountId, "upsert", row, origin, ts);
}

export async function createAccount(db, args, origin) {
  const siteId = String(idOf(args.siteId));
  const site = siteOf(db, siteId);
  if (!site) throw new Error("站点不存在：" + (siteId || "(空)"));
  const key = keyOf(args.accountKey);
  assertKeyUnique(db, siteId, key, "");
  const account = textOf(args.account, MAX_ACCOUNT, "登录名");
  const remark = textOf(args.remark, MAX_REMARK, "备注");
  const fields = sensitiveInputOf(args).filter((item) => item.value.length > 0);
  for (const item of fields) assertFieldLength(item.field, item.value);
  if (fields.length) await requireVault();

  const ts = now();
  const id = newId();
  tx(db, function () {
    db.prepare(
      "INSERT INTO " + ACCOUNT_TABLE +
        "(id,site_id,account_key,account,remark,created_at,updated_at,deleted_at,rev) VALUES(?,?,?,?,?,?,?,?,?)",
    ).run(id, siteId, key, account, remark, ts, ts, null, 1);
    logChange(db, ACCOUNT_TABLE, id, "create", {
      id: id,
      site_id: siteId,
      account_key: key,
      account: account,
      remark: remark,
      created_at: ts,
      updated_at: ts,
      deleted_at: null,
      rev: 1,
    }, origin, ts);
    if (Array.isArray(args.externalAccountIds)) replaceExternals(db, id, args.externalAccountIds, ts, origin);
  });

  if (!fields.length) return { id: id, accountKey: key };
  try {
    const values = {};
    for (const item of fields) values[item.field] = item.value;
    const writtenSet = await upsertAccountSecrets(siteId, id, values, account);
    if (writtenSet.setId) rememberSet(db, id, writtenSet.setId, origin);
  } catch (error) {
    // 敏感字段未能全部落进保险箱：撤掉刚插入的账号，避免“半条账号”。
    await deleteAccountSecrets(siteId, id);
    db.prepare("DELETE FROM " + ACCOUNT_TABLE + " WHERE id=?").run(id);
    throw error;
  }
  return { id: id, accountKey: key };
}

export async function updateAccount(db, args, origin) {
  const id = String(idOf(args.id));
  const existing = liveAccount(db, id);
  if (!existing) throw new Error("账号不存在：" + (id || "(空)"));
  if (args.siteId !== undefined && String(idOf(args.siteId)) !== String(existing.site_id)) {
    throw new Error("账号不能更换所属站点");
  }
  const key = args.accountKey !== undefined ? keyOf(args.accountKey) : String(existing.account_key || "");
  if (key !== String(existing.account_key || "")) assertKeyUnique(db, existing.site_id, key, id);
  const account = args.account !== undefined ? textOf(args.account, MAX_ACCOUNT, "登录名") : String(existing.account || "");
  const remark = args.remark !== undefined ? textOf(args.remark, MAX_REMARK, "备注") : String(existing.remark || "");
  const fields = sensitiveInputOf(args);
  for (const item of fields) if (item.value.length > 0) assertFieldLength(item.field, item.value);
  if (fields.length) await requireVault();

  // 先写保险箱，再改本地行：保险箱失败时本地行保持原样。
  let writtenSet = { setId: "" };
  for (const item of fields) {
    if (item.value.length === 0) await deleteAccountField(existing.site_id, id, item.field);
    else {
      const result = await upsertAccountSecrets(existing.site_id, id, { [item.field]: item.value });
      if (result.setId) writtenSet = result;
    }
  }
  if (writtenSet.setId && !existing.vault_set_id) rememberSet(db, id, writtenSet.setId, origin);
  // 登录名变了：集合上的「账号」展示值跟着改（集合不存在时静默忽略）。
  if (account !== String(existing.account || "")) await setAccountOf(existing.site_id, id, account);

  const ts = now();
  tx(db, function () {
    db.prepare(
      "UPDATE " + ACCOUNT_TABLE + " SET account_key=?, account=?, remark=?, updated_at=?, rev=rev+1 WHERE id=?",
    ).run(key, account, remark, ts, id);
    const row = db.prepare("SELECT * FROM " + ACCOUNT_TABLE + " WHERE id=?").get(id);
    logChange(db, ACCOUNT_TABLE, id, "upsert", row, origin, ts);
    if (Array.isArray(args.externalAccountIds)) replaceExternals(db, id, args.externalAccountIds, ts, origin);
  });
  return { ok: true, id: id };
}

export async function deleteAccount(db, args, origin) {
  const id = String(idOf(args.id));
  const existing = liveAccount(db, id);
  if (!existing) return { ok: true, deleted: false, missing: true };
  const ts = now();
  let cleared = 0;
  tx(db, function () {
    const rels = db
      .prepare(
        "SELECT * FROM " + EXTERNAL_TABLE + " WHERE deleted_at IS NULL AND (native_account_id=? OR external_account_id=?)",
      )
      .all(id, id);
    for (const rel of rels) {
      db.prepare("UPDATE " + EXTERNAL_TABLE + " SET deleted_at=?, updated_at=?, rev=rev+1 WHERE id=?").run(ts, ts, String(rel.id));
      logChange(db, EXTERNAL_TABLE, String(rel.id), "delete", null, origin, ts);
      cleared++;
    }
    db.prepare("UPDATE " + ACCOUNT_TABLE + " SET deleted_at=?, updated_at=?, rev=rev+1 WHERE id=?").run(ts, ts, id);
    logChange(db, ACCOUNT_TABLE, id, "delete", null, origin, ts);
  });
  // 凭据清理尽力而为：保险箱未装/锁定不应阻塞删账号。
  if (vaultInstalled()) await deleteAccountSecrets(existing.site_id, id);
  return { ok: true, deleted: true, clearedRelations: cleared };
}

export function linkAccounts(db, args, origin) {
  const nativeId = String(idOf(args.nativeAccountId));
  const externalId = String(idOf(args.externalAccountId));
  assertLinkable(db, nativeId, externalId);
  const ts = now();
  let relId = "";
  tx(db, function () {
    relId = insertRelation(db, nativeId, externalId, ts, origin);
  });
  return { ok: true, relationId: relId };
}

export function unlinkAccounts(db, args, origin) {
  const nativeId = String(idOf(args.nativeAccountId));
  const externalId = String(idOf(args.externalAccountId));
  const row = db
    .prepare(
      "SELECT * FROM " + EXTERNAL_TABLE + " WHERE native_account_id=? AND external_account_id=? AND deleted_at IS NULL",
    )
    .get(nativeId, externalId);
  if (!row) return { ok: true, deleted: false, missing: true };
  const ts = now();
  tx(db, function () {
    db.prepare("UPDATE " + EXTERNAL_TABLE + " SET deleted_at=?, updated_at=?, rev=rev+1 WHERE id=?").run(ts, ts, String(row.id));
    logChange(db, EXTERNAL_TABLE, String(row.id), "delete", null, origin, ts);
  });
  return { ok: true, deleted: true };
}

export function cascadeGroups(db, args) {
  const exclude = args && args.excludeSiteId !== undefined ? String(idOf(args.excludeSiteId)) : "";
  const rows = db
    .prepare(
      "SELECT a.id, a.account_key, a.site_id, s.site_name FROM " + ACCOUNT_TABLE + " a" +
        " JOIN site s ON s.id=a.site_id" +
        " WHERE a.deleted_at IS NULL AND s.deleted_at IS NULL AND s.bindable=1 AND TRIM(a.account_key)<>''" +
        " ORDER BY s.site_name ASC, a.account_key ASC",
    )
    .all();
  const groups = [];
  const index = new Map();
  for (const row of rows) {
    const siteId = String(row.site_id);
    if (exclude && siteId === exclude) continue;
    if (!index.has(siteId)) {
      const group = { siteId: siteId, siteName: String(row.site_name || ""), accounts: [] };
      index.set(siteId, group);
      groups.push(group);
    }
    index.get(siteId).accounts.push({ id: String(row.id), accountKey: String(row.account_key || "") });
  }
  return { total: groups.length, groups: groups };
}

export async function getAccount(db, id, origin) {
  const row = liveAccount(db, id);
  if (!row) throw new Error("账号不存在：" + (id || "(空)"));
  const entry = await accountEntry(db, row);
  const base = outAccount(db, row, entry);
  const isUi = String(origin || "") === "ui";
  const status = await vaultStatus();
  return {
    account: base,
    masked: true,
    reveal: "vault",
    secretIds: isUi ? entry.ids : undefined,
    vault: status,
    reason: isUi
      ? "明文经凭据保险箱显形；锁定状态下请先解锁"
      : "明文仅界面可查看；agent 只能拿到掩码与是否已保存",
  };
}

/* --------------------------------------------------------------- 渲染文本 */

function renderAccounts(r) {
  if (!r || !r.accounts) return "站点不存在";
  const lines = ["站点账号 · " + r.siteName + "（" + r.total + " 个）"];
  for (const a of r.accounts) {
    const bits = [a.accountKey];
    if (a.account) bits.push("登录名=" + a.account);
    if (a.hasPassword) bits.push("密码=已保存");
    if (a.hasPhone) bits.push("手机=已保存");
    if (a.hasIdentity) bits.push("证件=已保存");
    if (a.externals.length) bits.push("外联=" + a.externals.map((x) => x.siteName + " · " + x.accountKey).join("，"));
    lines.push("- " + bits.join(" · "));
  }
  if (!r.accounts.length) lines.push("（暂无账号）");
  return lines.join("\n");
}

/* --------------------------------------------------------------- 注册 */

export function registerAccountActions(api) {
  const db = api.db;
  const action = api.action;

  action("sites.accounts.list", {
    description: "列出某站点的账号；密码/手机号/证件号只返回是否已保存，明文经凭据保险箱在界面显形。",
    input: {
      type: "object",
      properties: { siteId: { type: ["string", "number"], description: "站点 id，必填" } },
      required: ["siteId"],
    },
    execute: async function (args) {
      const flags = await flagsOfSite(db, args.siteId);
      const result = listAccounts(db, args.siteId, flags);
      result.vault = await vaultStatus();
      return result;
    },
    render: renderAccounts,
  });

  action("sites.accounts.get", {
    description:
      "取单个账号。敏感字段永远以 has 标记返回；界面调用额外返回 secretIds（字段→凭据 id），显形请调 vault.secretReveal。",
    input: {
      type: "object",
      properties: { id: { type: ["string", "number"], description: "账号 id，必填" } },
      required: ["id"],
    },
    execute: function (args, ctx) { return getAccount(db, args.id, ctx && ctx.origin); },
    render: function (r) {
      if (!r || !r.account) return "账号不存在";
      const a = r.account;
      const head = a.accountKey + (a.account ? "（" + a.account + "）" : "");
      const saved = [a.hasPassword ? "密码" : "", a.hasPhone ? "手机" : "", a.hasIdentity ? "证件" : ""].filter(Boolean);
      return head + (saved.length ? " · 已保存：" + saved.join("、") : " · 未保存敏感字段");
    },
  });

  action("sites.accounts.create", {
    description:
      "为站点新增账号。accountKey 必填且同站点内唯一；password/phoneNumber/identityCard 会写入凭据保险箱，需先安装并解锁保险箱、且本站点已关联凭据组。",
    input: {
      type: "object",
      properties: {
        siteId: { type: ["string", "number"] },
        accountKey: { type: "string", description: "站点内唯一标识，必填，≤60 字" },
        account: { type: "string", description: "登录名，可空" },
        password: { type: "string", description: "敏感：写入凭据保险箱" },
        phoneNumber: { type: "string", description: "敏感：写入凭据保险箱" },
        identityCard: { type: "string", description: "敏感：写入凭据保险箱" },
        remark: { type: "string", description: "备注，可空，≤2000 字" },
        externalAccountIds: { type: "array", items: { type: ["string", "number"] }, description: "外联账号 id 列表" },
      },
      required: ["siteId", "accountKey"],
    },
    execute: function (args, ctx) { return createAccount(db, args, ctx && ctx.origin); },
    render: function (r) { return "账号已创建：" + r.accountKey; },
  });

  action("sites.accounts.update", {
    description:
      "更新账号字段。accountKey 变更需保持同站点唯一；siteId 不可更改；password/phoneNumber/identityCard 传空串表示清空、传值表示重设（写入凭据保险箱，需解锁）；externalAccountIds 给定时整体替换外联集合。",
    input: {
      type: "object",
      properties: {
        id: { type: ["string", "number"] },
        accountKey: { type: "string" },
        account: { type: "string" },
        password: { type: "string" },
        phoneNumber: { type: "string" },
        identityCard: { type: "string" },
        remark: { type: "string" },
        externalAccountIds: { type: "array", items: { type: ["string", "number"] } },
      },
      required: ["id"],
    },
    execute: function (args, ctx) { return updateAccount(db, args, ctx && ctx.origin); },
    render: function () { return "账号已更新"; },
  });

  action("sites.accounts.delete", {
    description: "删除账号（软删），清除其外联关系，并尽力清理保险箱里对应的凭据。",
    input: {
      type: "object",
      properties: { id: { type: ["string", "number"] } },
      required: ["id"],
    },
    execute: function (args, ctx) { return deleteAccount(db, args, ctx && ctx.origin); },
    render: function (r) {
      return r && r.deleted === false ? "账号不存在（可能已删除）" : "账号已删除" + (r && r.clearedRelations ? "，清除外联 " + r.clearedRelations + " 条" : "");
    },
  });

  action("sites.accounts.link", {
    description: "建立外联：nativeAccountId 引用 externalAccountId。两端必须是不同站点、被引用账号有 accountKey、且被引用站点 bindable=1。重复调用幂等。",
    input: {
      type: "object",
      properties: {
        nativeAccountId: { type: ["string", "number"] },
        externalAccountId: { type: ["string", "number"] },
      },
      required: ["nativeAccountId", "externalAccountId"],
    },
    execute: function (args, ctx) { return linkAccounts(db, args, ctx && ctx.origin); },
    render: function (r) { return "外联已建立（" + r.relationId + "）"; },
  });

  action("sites.accounts.unlink", {
    description: "解除外联关系；关系不存在时返回 ok（幂等）。",
    input: {
      type: "object",
      properties: {
        nativeAccountId: { type: ["string", "number"] },
        externalAccountId: { type: ["string", "number"] },
      },
      required: ["nativeAccountId", "externalAccountId"],
    },
    execute: function (args, ctx) { return unlinkAccounts(db, args, ctx && ctx.origin); },
    render: function (r) { return r && r.deleted ? "外联已解除" : "外联关系不存在"; },
  });

  action("sites.accounts.cascade", {
    description: "外联候选：按站点分组返回可被外联的账号（站点 bindable=1 且账号有 accountKey），可用 excludeSiteId 排除当前站点。",
    input: {
      type: "object",
      properties: { excludeSiteId: { type: ["string", "number"] } },
    },
    execute: function (args) { return cascadeGroups(db, args || {}); },
    render: function (r) {
      const lines = ["外联候选：" + r.total + " 个站点"];
      for (const g of r.groups) lines.push("- " + g.siteName + "：" + g.accounts.map((a) => a.accountKey).join("，"));
      return lines.join("\n");
    },
  });
}
