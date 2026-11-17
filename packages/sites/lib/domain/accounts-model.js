/**
 * 站点账号的模型层：表结构、行读取、掩码与外联关系维护。
 *
 * 纯数据形状与查询，不放 action 注册；敏感字段已整体交给凭据保险箱（见 accounts.js / vault-link.js），
 * 本模块只认「哪些字段存在」的标记，不接触密文，也不接触明文。
 */

import { newId, logChange, SITE_TABLE } from "../db/db.js";

export const ACCOUNT_TABLE = "site_account";
export const EXTERNAL_TABLE = "site_account_external";

export const MAX_KEY = 60;
export const MAX_ACCOUNT = 200;
export const MAX_REMARK = 2000;
export const MAX_PHONE = 40;
export const MAX_IDENTITY = 40;

export { ACCOUNT_DDL, EXTERNAL_DDL } from "../db/accounts-schema.js";

export const SENSITIVE_FIELDS = ["password", "phone", "identity"];

/* ------------------------------------------------------------------ 读取 */

export function liveAccount(db, id) {
  return db
    .prepare("SELECT * FROM " + ACCOUNT_TABLE + " WHERE id=? AND deleted_at IS NULL")
    .get(String(id));
}

export function siteOf(db, siteId) {
  return db.prepare("SELECT * FROM " + SITE_TABLE + " WHERE id=? AND deleted_at IS NULL").get(String(siteId));
}

export function textOf(value, max, label) {
  const s = value == null ? "" : String(value).trim();
  if (s.length > max) throw new Error(label + "最多 " + max + " 个字符");
  return s;
}

export function keyOf(value) {
  const s = textOf(value, MAX_KEY, "账号标识");
  if (!s) throw new Error("账号标识（accountKey）不能为空");
  return s;
}

export function assertKeyUnique(db, siteId, key, exceptId) {
  const row = db
    .prepare(
      "SELECT id FROM " + ACCOUNT_TABLE + " WHERE site_id=? AND account_key=? AND deleted_at IS NULL AND id<>?",
    )
    .get(String(siteId), String(key), String(exceptId || ""));
  if (row) throw new Error("该站点已存在相同标识的账号：" + key);
}

/** 外联关系（未删除）中，native 账号都还在某个站点里。 */
export function externalRefsOfSite(db, siteId) {
  return db
    .prepare(
      "SELECT e.id, e.native_account_id, e.external_account_id, n.site_id AS native_site, n.account_key AS native_key, n.deleted_at AS native_deleted" +
        " FROM " + EXTERNAL_TABLE + " e JOIN " + ACCOUNT_TABLE + " n ON n.id=e.native_account_id" +
        " JOIN " + ACCOUNT_TABLE + " t ON t.id=e.external_account_id" +
        " WHERE e.deleted_at IS NULL AND t.site_id=? AND t.deleted_at IS NULL AND n.deleted_at IS NULL",
    )
    .all(String(siteId));
}

export function countAccounts(db, siteId) {
  const row = db
    .prepare("SELECT COUNT(*) AS n FROM " + ACCOUNT_TABLE + " WHERE site_id=? AND deleted_at IS NULL")
    .get(String(siteId));
  return Number(row ? row.n : 0);
}

/** 删站守卫：站点仍有未删除账号时拒绝删除。 */
export function assertNoAccounts(db, siteId) {
  const n = countAccounts(db, siteId);
  if (n > 0) throw new Error("无法删除：该站点仍存在 " + n + " 个账号，请先删除其账号");
}

/** bindable 关闭守卫：本站账号被其他站点外联引用时拒绝关闭。 */
export function assertBindableUnused(db, siteId) {
  const rows = externalRefsOfSite(db, siteId);
  if (rows.length > 0) throw new Error("无法关闭外联：本站点有 " + rows.length + " 个账号正被其他站点引用");
}

export function externalsOf(db, accountId) {
  return db
    .prepare(
      "SELECT e.*, a.account_key AS account_key, a.site_id AS site_id, s.site_name AS site_name FROM " +
        EXTERNAL_TABLE + " e JOIN " + ACCOUNT_TABLE + " a ON a.id=e.external_account_id" +
        " JOIN site s ON s.id=a.site_id" +
        " WHERE e.native_account_id=? AND e.deleted_at IS NULL AND a.deleted_at IS NULL ORDER BY e.created_at ASC",
    )
    .all(String(accountId))
    .map((r) => ({
      id: String(r.id),
      externalAccountId: String(r.external_account_id),
      accountKey: String(r.account_key || ""),
      siteId: String(r.site_id),
      siteName: String(r.site_name || ""),
    }));
}

/**
 * 行 → 对外账号形状。
 * entry = { fields:Set, ids:{} }，来自 vault-link.flagsOfSite；没有 entry 视为三个字段都未保存。
 */
export function outAccount(db, row, entry) {
  const fields = (entry && entry.fields) || new Set();
  const hasPassword = fields.has("password");
  const hasPhone = fields.has("phone");
  const hasIdentity = fields.has("identity");
  return {
    id: String(row.id),
    siteId: String(row.site_id),
    accountKey: String(row.account_key || ""),
    account: String(row.account || ""),
    hasPassword: hasPassword,
    hasPhone: hasPhone,
    hasIdentity: hasIdentity,
    vaultSetId: String((entry && entry.setId) || row.vault_set_id || ""),
    vaultInvalid: Boolean(entry && entry.invalid),
    phoneNumber: hasPhone ? "已保存" : "",
    identityCard: hasIdentity ? "已保存" : "",
    remark: String(row.remark || ""),
    externals: externalsOf(db, row.id),
    createdAt: Number(row.created_at) || 0,
    updatedAt: Number(row.updated_at) || 0,
  };
}

export function listAccounts(db, siteId, flags) {
  const site = siteOf(db, siteId);
  if (!site) throw new Error("站点不存在：" + (siteId || "(空)"));
  const rows = db
    .prepare("SELECT * FROM " + ACCOUNT_TABLE + " WHERE site_id=? AND deleted_at IS NULL ORDER BY created_at ASC, id ASC")
    .all(String(site.id));
  return {
    siteId: String(site.id),
    siteName: String(site.site_name || ""),
    total: rows.length,
    accounts: rows.map((row) => outAccount(db, row, flags && flags.get(String(row.id)))),
  };
}

/* ------------------------------------------------------------------ 写入 */

export function insertRelation(db, nativeId, externalId, ts, origin) {
  const existing = db
    .prepare(
      "SELECT * FROM " + EXTERNAL_TABLE + " WHERE native_account_id=? AND external_account_id=? AND deleted_at IS NULL",
    )
    .get(String(nativeId), String(externalId));
  if (existing) return String(existing.id);
  const row = {
    id: newId(),
    native_account_id: String(nativeId),
    external_account_id: String(externalId),
    created_at: ts,
    updated_at: ts,
    deleted_at: null,
    rev: 1,
  };
  db.prepare(
    "INSERT INTO " + EXTERNAL_TABLE + "(id,native_account_id,external_account_id,created_at,updated_at,deleted_at,rev) VALUES(?,?,?,?,?,?,?)",
  ).run(row.id, row.native_account_id, row.external_account_id, ts, ts, null, 1);
  logChange(db, EXTERNAL_TABLE, row.id, "create", row, origin, ts);
  return row.id;
}

export function assertLinkable(db, nativeId, externalId) {
  if (String(nativeId) === String(externalId)) throw new Error("不能把账号外联到自己");
  const native = liveAccount(db, nativeId);
  if (!native) throw new Error("引用方账号不存在：" + nativeId);
  const external = liveAccount(db, externalId);
  if (!external) throw new Error("被引用账号不存在：" + externalId);
  if (String(native.site_id) === String(external.site_id)) throw new Error("不能外联同一站点内的账号");
  const targetSite = siteOf(db, external.site_id);
  if (!targetSite) throw new Error("被引用账号所属站点不存在");
  if (Number(targetSite.bindable) === 0) throw new Error("被引用站点已关闭外联（bindable=0），不能作为外联目标");
  if (!String(external.account_key || "").trim()) throw new Error("被引用账号没有标识（accountKey），不能作为外联目标");
  return { native, external };
}

/** 整体替换某账号的外联集合。 */
export function replaceExternals(db, nativeId, ids, ts, origin) {
  const wanted = new Set((ids || []).map((v) => String(v)));
  const current = db
    .prepare("SELECT * FROM " + EXTERNAL_TABLE + " WHERE native_account_id=? AND deleted_at IS NULL")
    .all(String(nativeId));
  for (const row of current) {
    if (!wanted.has(String(row.external_account_id))) {
      db.prepare("UPDATE " + EXTERNAL_TABLE + " SET deleted_at=?, updated_at=?, rev=rev+1 WHERE id=?").run(ts, ts, String(row.id));
      logChange(db, EXTERNAL_TABLE, String(row.id), "delete", null, origin, ts);
    }
  }
  for (const id of wanted) {
    const exists = db
      .prepare(
        "SELECT id FROM " + EXTERNAL_TABLE + " WHERE native_account_id=? AND external_account_id=? AND deleted_at IS NULL",
      )
      .get(String(nativeId), id);
    if (exists) continue;
    assertLinkable(db, nativeId, id);
    insertRelation(db, nativeId, id, ts, origin);
  }
}

/** 账号敏感字段在 vault 里的字段名（与 site.<siteId>.<accountId>.<field> 对应）。 */
export function sensitiveInputOf(args) {
  const out = [];
  if (args.password !== undefined) out.push({ field: "password", value: String(args.password == null ? "" : args.password) });
  if (args.phoneNumber !== undefined) out.push({ field: "phone", value: String(args.phoneNumber == null ? "" : args.phoneNumber) });
  if (args.identityCard !== undefined) out.push({ field: "identity", value: String(args.identityCard == null ? "" : args.identityCard) });
  return out;
}
