/**
 * 0.2.x → 0.3.0 数据迁移：把「分组直属凭据」收进集合，并把站点专属 kind 收口。
 * 只有解锁拿到 DEK 后才能重加密，因此入口是 unlock() 成功之后。
 * 整批一个事务：任一步失败回滚，schema_version 保持 2，下次解锁重试。
 * 0.4.0 起迁移完成直接标 SCHEMA_VERSION（4）：account 列已由 ensureSchema 的 migrateV4 补齐。
 */
import { SCHEMA_VERSION, hasColumn, headerGet, headerSet, now, tx } from "../db/db.js";
import { open, seal, secretAad } from "../infra/crypto.js";
import { createSets } from "./sets.js";

const SITE_NAME = /^site\.[^.]+\.([^.]+)\.([^.]+)$/;
const FIELD_KIND = { password: "password", phone: "phone", identity: "id_card" };
const FIELD_LABEL = { password: "密码", phone: "手机号", identity: "身份证号" };

function uniqueSecretName(db, base) {
  let name = base;
  let n = 2;
  while (db.prepare("SELECT 1 FROM vault_secret WHERE name = ? AND deleted_at IS NULL").get(name)) {
    name = base + " #" + n;
    n += 1;
  }
  return name;
}

export function migrateToV3({ db, dek, log = () => {} }) {
  const head = headerGet(db);
  if (!head) return { migrated: false, reason: "uninitialized" };
  if (Number(head.schema_version || 0) >= 3) return { migrated: false, reason: "current" };
  if (!dek) return { migrated: false, reason: "locked" };

  const sets = createSets({ db });
  const hasGroupColumn = hasColumn(db, "vault_secret", "group_id");
  const stats = { groups: 0, sets: 0, linked: 0, converted: 0, orphaned: 0 };

  tx(db, () => {
    const defaultSets = new Map();

    function defaultSetOf(groupId) {
      if (!groupId) return null;
      if (!defaultSets.has(groupId)) {
        const row = sets.ensureDefaultSet(groupId);
        defaultSets.set(groupId, row.id);
        stats.sets += 1;
        stats.groups += 1;
      }
      return defaultSets.get(groupId);
    }

    // 1) 旧分组仍持有的直属凭据 → 「<组名> · 默认」集合
    if (hasGroupColumn) {
      const groupIds = db
        .prepare("SELECT DISTINCT group_id FROM vault_secret WHERE group_id IS NOT NULL AND deleted_at IS NULL")
        .all()
        .map((row) => row.group_id);
      for (const groupId of groupIds) {
        const setId = defaultSetOf(groupId);
        if (!setId) continue;
        const rows = db
          .prepare("SELECT id FROM vault_secret WHERE group_id = ? AND deleted_at IS NULL")
          .all(groupId);
        for (const row of rows) {
          const res = sets.linkSecret(setId, row.id);
          if (!res.existing) stats.linked += 1;
        }
      }

      // 2) 站点专属 kind 收口：解析长名、重加密、并入 accountId 集合
      const siteRows = db
        .prepare("SELECT * FROM vault_secret WHERE kind = 'site-account' AND deleted_at IS NULL")
        .all();
      let orphanSetId = null;
      for (const row of siteRows) {
        const groupId = row.group_id || null;
        const match = SITE_NAME.exec(String(row.name || ""));
        let setId = groupId ? defaultSetOf(groupId) : null;
        let kind = "other";
        let nextName = null;
        let plain = null;
        try {
          plain = open(dek, row.ciphertext, secretAad(row.id, row.name, "site-account"));
        } catch (error) {
          log("迁移失败：无法解密 site-account " + row.id, String(error && error.message));
          stats.orphaned += 1;
          if (!setId) {
            if (!orphanSetId) {
              orphanSetId = sets.ensureSet("迁移收件箱").id;
              stats.sets += 1;
            }
            setId = orphanSetId;
          }
          db.prepare(
            "UPDATE vault_secret SET kind = 'other', updated_at = ?, rev = rev + 1 WHERE id = ?",
          ).run(now(), row.id);
          if (setId) sets.linkSecret(setId, row.id);
          continue;
        }

        if (match) {
          const accountId = match[1];
          const field = match[2];
          kind = FIELD_KIND[field] || "other";
          const base = accountId + " · " + (FIELD_LABEL[field] || "其它");
          nextName = uniqueSecretName(db, base);
          const accountSet = sets.ensureSet(accountId);
          stats.sets += 1;
          if (groupId) sets.linkGroupSet(groupId, accountSet.id);
          setId = accountSet.id;
        } else {
          log("迁移提示：site-account 名称无法解析，归入默认集合", String(row.name));
          nextName = uniqueSecretName(db, String(row.name || row.id).replace(/^site\./, "站点 · "));
        }

        const ciphertext = seal(dek, plain, secretAad(row.id, nextName, kind));
        db.prepare(
          "UPDATE vault_secret SET name = ?, kind = ?, ciphertext = ?, updated_at = ?, rev = rev + 1 WHERE id = ?",
        ).run(nextName, kind, ciphertext, now(), row.id);
        stats.converted += 1;
        if (setId) sets.linkSecret(setId, row.id);
      }
    }

    // 3) 收口：去掉凭据上的单列归属
    if (hasGroupColumn) db.exec("ALTER TABLE vault_secret DROP COLUMN group_id");
    headerSet(db, { schema_version: SCHEMA_VERSION });
  });

  log("保险箱已迁移到 schema " + SCHEMA_VERSION, JSON.stringify(stats));
  return { migrated: true, ...stats };
}
