/**
 * 站点域到凭据保险箱的调用桥。
 *
 * sites 不持有任何密钥，也不直接读写 vault_* 表；所有动作走 vault 的 plugin 接口。
 * 0.3.0 起一个账号 = 一个集合（集合名就是 accountId），密码/手机号/证件号是集合里的三条凭据；
 * 站点行只记 vault_set_id，用来发现「集合被删」这种失效状态。
 */

let bridge = null;

export const ACCOUNT_FIELDS = [
  { field: "password", kind: "password", label: "密码" },
  { field: "phone", kind: "phone", label: "手机号" },
  { field: "identity", kind: "id_card", label: "身份证号" },
];

export function bindVault(bridgeFn) {
  bridge = typeof bridgeFn === "function" ? bridgeFn : null;
}

export function vaultInstalled() {
  return Boolean(bridge);
}

function call(action, args) {
  if (!bridge) throw new Error("需要安装凭据保险箱插件（wb-addon-vault）后才能保存密码/手机号/证件号");
  return Promise.resolve(bridge(action, args || {})).then(function (reply) {
    if (reply && reply.ok === true) return reply.result;
    if (reply && reply.ok === false) throw new Error(reply.error || "凭据保险箱请求失败");
    return reply;
  });
}

export async function vaultStatus() {
  if (!bridge) {
    return { installed: false, enabled: false, unlocked: false, initialized: false, locked: true };
  }
  const status = await call("vault.status", {});
  return {
    installed: true,
    enabled: Boolean(status.initialized),
    unlocked: !status.locked,
    initialized: Boolean(status.initialized),
    locked: Boolean(status.locked),
    unlockMode: status.unlockMode,
    idleMinutes: Math.round((Number(status.idleTimeoutSec) || 900) / 60),
    remainingMs: Number(status.idleTimeoutSec) > 0 && !status.locked ? Number(status.idleTimeoutSec) * 1000 : 0,
    passphraseMinLength: 12,
  };
}

export async function requireVault() {
  let status;
  try {
    status = await vaultStatus();
  } catch (error) {
    throw new Error("凭据保险箱不可用：" + (error && error.message ? error.message : String(error)));
  }
  if (!status.installed) throw new Error("需要安装凭据保险箱插件（wb-addon-vault）后才能保存密码/手机号/证件号");
  if (!status.initialized) throw new Error("请先在凭据保险箱里设置主口令，再保存密码/手机号/证件号");
  if (status.locked) throw new Error("凭据保险箱已锁定，请先解锁后再保存密码/手机号/证件号");
  return status;
}

/** 站点这一「类凭据」对应的组；未关联时给出可操作的中文错误。 */
export async function groupOfSite(siteId) {
  const result = await call("vault.bindingsOf", { subjectType: "site", subjectId: String(siteId) });
  const item = (result && result.items && result.items[0]) || null;
  if (!item) throw new Error("本站点尚未关联凭据组：请先在站点详情里创建并关联「站点账号」凭据组");
  return String(item.groupId);
}

/** 集合名即 accountId；凭据名形如 `<accountId> · 密码`。 */
export function accountSecretName(accountId, field) {
  const spec = ACCOUNT_FIELDS.find((item) => item.field === field);
  if (!spec) throw new Error("未知的敏感字段：" + field);
  return String(accountId) + " · " + spec.label;
}

/** 该站点经分组可见的凭据清单（不含明文），meta 里带 accountId/field。 */
export async function secretsOfSite(siteId) {
  const result = await call("vault.subjectSecrets", { subjectType: "site", subjectId: String(siteId) });
  return (result && result.items) || [];
}

/** 读写某个账号的集合；不存在返回 null。 */
export async function accountSet(siteId, accountId) {
  const reply = await call("vault.pluginSetGet", {
    subjectType: "site",
    subjectId: String(siteId),
    setName: String(accountId),
  });
  return (reply && reply.set) || null;
}

/** 把账号的若干敏感字段写进集合（按集合名幂等建集合）；返回集合 id。 */
export async function upsertAccountSecrets(siteId, accountId, values) {
  const groupId = await groupOfSite(siteId);
  let setId = "";
  for (const spec of ACCOUNT_FIELDS) {
    if (values[spec.field] === undefined) continue;
    const text = String(values[spec.field] == null ? "" : values[spec.field]);
    if (!text) continue;
    const reply = await call("vault.pluginSecretUpsert", {
      subjectType: "site",
      subjectId: String(siteId),
      groupId,
      setName: String(accountId),
      name: accountSecretName(accountId, spec.field),
      kind: spec.kind,
      secret: text,
      meta: { siteId: String(siteId), accountId: String(accountId), field: spec.field },
    });
    if (reply && reply.setId) setId = String(reply.setId);
  }
  return { setId };
}

/** 摘掉账号集合里的一个字段（凭据不再属于任何集合时才被软删）。 */
export async function deleteAccountField(siteId, accountId, field) {
  const groupId = await groupOfSite(siteId);
  return call("vault.pluginSecretDelete", {
    subjectType: "site",
    subjectId: String(siteId),
    groupId,
    setName: String(accountId),
    name: accountSecretName(accountId, field),
  });
}

/** 删账号时清空集合里的三条凭据。 */
export async function deleteAccountSecrets(siteId, accountId) {
  for (const spec of ACCOUNT_FIELDS) {
    try {
      await deleteAccountField(siteId, accountId, spec.field);
    } catch {
      /* 尽力而为：保险箱未装/锁定不阻塞删账号 */
    }
  }
}

/**
 * 列表/详情用：accountId → { fields:Set, ids:{}, setId, invalid }。
 * fields 只能来自 meta 聚合（凭据名不可推测）；invalid 表示行上记的集合已经不存在。
 */
export async function flagsOfSite(db, siteId) {
  const map = new Map();
  for (const row of db
    .prepare("SELECT id, vault_set_id FROM site_account WHERE site_id=? AND deleted_at IS NULL")
    .all(String(siteId))) {
    map.set(String(row.id), {
      fields: new Set(),
      ids: {},
      setId: row.vault_set_id ? String(row.vault_set_id) : "",
      invalid: false,
    });
  }
  if (!vaultInstalled()) return map;
  let items = [];
  try {
    items = await secretsOfSite(siteId);
  } catch {
    return map;
  }
  for (const item of items) {
    const meta = item && item.meta && typeof item.meta === "object" ? item.meta : {};
    const accountId = String(meta.accountId || "");
    const field = String(meta.field || "");
    if (!accountId || !field) continue;
    if (!map.has(accountId)) map.set(accountId, { fields: new Set(), ids: {}, setId: "", invalid: false });
    const entry = map.get(accountId);
    entry.fields.add(field);
    entry.ids[field] = String(item.id || "");
  }
  let live = null;
  try {
    const result = await call("vault.setList", {});
    live = new Set(((result && result.items) || []).map((set) => String(set.id)));
  } catch {
    live = null;
  }
  if (live) {
    for (const entry of map.values()) {
      if (entry.setId && !live.has(entry.setId)) entry.invalid = true;
    }
  }
  return map;
}
