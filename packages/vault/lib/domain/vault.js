/**
 * 保险箱核心：KDF 包裹 DEK、DEK 加密 secret，DEK 只在内存。
 * 0.2.0：口令包裹存单行 vault_header（随云同步），device key 与使用记录留本机。
 * A/B/C 三种 unlock_mode 共用同一套表；切换失败保持原模式。
 */
import { randomBytes } from "node:crypto";
import {
  KDF_DEFAULT,
  deriveKey,
  open,
  readDeviceKey,
  removeDeviceKey,
  seal,
  secretAad,
  writeDeviceKey,
} from "../infra/crypto.js";
import {
  SCHEMA_VERSION,
  deviceGet,
  deviceSet,
  headerGet,
  headerSet,
  newId,
  now,
  secretRow,
  touchUsage,
  tx,
  usageMap,
} from "../db/db.js";
import { createSets } from "./sets.js";
import { migrateToV3 } from "./migrate.js";
import { assertKind, assertMeta, assertSecretName } from "./secret-input.js";

const MODES = new Set(["A", "B", "C"]);
const SYNC_NOTE =
  "vault_header（口令包裹）与 vault_secret/vault_group/vault_binding 的结构和密文会随云同步上传；" +
  "device key 与 last_used_at 只留本机。";

function parseKdf(raw) {
  try {
    const value = JSON.parse(String(raw || "{}"));
    return { ...KDF_DEFAULT, ...value };
  } catch {
    return { ...KDF_DEFAULT };
  }
}

function parseJson(raw, fallback) {
  try {
    return JSON.parse(String(raw));
  } catch {
    return fallback;
  }
}

function validateMode(mode) {
  const value = String(mode || "").toUpperCase();
  if (!MODES.has(value)) throw new Error("unlockMode 必须是 A/B/C");
  return value;
}

function assertPassphrase(passphrase) {
  const value = String(passphrase || "");
  if (value.length < 12) throw new Error("口令至少 12 个字符");
  return value;
}

export function createVault({ db, log = () => {} }) {
  const sets = createSets({ db });
  const state = {
    dek: null,
    lastActivity: 0,
    failures: 0,
    lockUntil: 0,
  };

  function initialized() {
    return Boolean(headerGet(db));
  }

  function touch() {
    if (!state.dek) return;
    const device = deviceGet(db);
    const idle = Number((device && device.idle_timeout_sec) || 900);
    if (idle > 0 && state.lastActivity && now() - state.lastActivity > idle * 1000) {
      lock();
      throw new Error("保险箱已因空闲锁定");
    }
    state.lastActivity = now();
  }

  function lock() {
    state.dek = null;
    state.lastActivity = 0;
  }

  function requireUnlocked() {
    touch();
    if (!state.dek) throw new Error("保险箱已锁定，请先解锁");
    return state.dek;
  }

  function checkPassphrase(passphrase) {
    const head = headerGet(db);
    if (!head) throw new Error("保险箱未初始化");
    try {
      const kek = deriveKey(String(passphrase || ""), head.salt, parseKdf(head.kdf));
      open(kek, head.wrapped_dek, "vault:dek");
      return true;
    } catch {
      throw new Error("口令错误");
    }
  }

  function groupExists(groupId) {
    if (!groupId) return true;
    return Boolean(db.prepare("SELECT 1 FROM vault_group WHERE id = ? AND deleted_at IS NULL").get(String(groupId)));
  }

  function tryAutoUnlock() {
    if (state.dek || !initialized()) return false;
    const device = deviceGet(db);
    if (!device || Number(device.auto_unlock) !== 1) return false;
    if (device.unlock_mode !== "B" && device.unlock_mode !== "C") return false;
    const deviceKey = readDeviceKey();
    if (!device.wrapped_dek_device || !deviceKey) return false;
    const head = headerGet(db);
    try {
      state.dek = open(deviceKey, device.wrapped_dek_device, "vault:device");
      state.lastActivity = now();
      deviceSet(db, { last_unlock_at: now(), passphrase_rev_seen: head.passphrase_rev });
      return true;
    } catch (error) {
      log("自动解锁失败", String(error && error.message));
      return false;
    }
  }

  /** 解锁后检查 schema_version：2 → 3 一次性迁移；失败回滚并保持 2。 */
  function runMigration() {
    const head = headerGet(db);
    if (!head || Number(head.schema_version || 0) >= SCHEMA_VERSION) return "";
    try {
      const result = migrateToV3({ db, dek: state.dek, log });
      return result.migrated ? "保险箱已升级到集合层（schema 3）。" : "";
    } catch (error) {
      log("保险箱迁移失败，已回滚", String(error && error.message));
      return "保险箱升级失败，已回滚；下次解锁会重试。";
    }
  }

  function status() {
    if (initialized()) {
      tryAutoUnlock();
      if (state.dek) {
        try {
          touch();
        } catch {
          /* 空闲锁定由 touch 处理，status 只回报 */
        }
      }
    }
    const head = headerGet(db);
    const device = deviceGet(db) || {};
    const count = initialized()
      ? Number(db.prepare("SELECT COUNT(*) AS n FROM vault_secret WHERE deleted_at IS NULL").get()?.n || 0)
      : 0;
    const groupCount = initialized()
      ? Number(db.prepare("SELECT COUNT(*) AS n FROM vault_group WHERE deleted_at IS NULL").get()?.n || 0)
      : 0;
    return {
      initialized: initialized(),
      locked: !state.dek,
      unlockMode: device.unlock_mode || "A",
      revealPolicy: device.reveal_policy || "session",
      autoUnlock: Number(device.auto_unlock) === 1,
      idleTimeoutSec: Number(device.idle_timeout_sec || 900),
      secretCount: count,
      groupCount,
      lastUnlockAt: Number(device.last_unlock_at || 0) || null,
      passphraseRev: head ? Number(head.passphrase_rev || 1) : 0,
      schemaVersion: head ? Number(head.schema_version || 2) : 0,
      cloudSync: true,
      syncNote: SYNC_NOTE,
    };
  }

  function setup(args = {}) {
    if (initialized()) throw new Error("保险箱已初始化");
    const passphrase = assertPassphrase(args.passphrase);
    const mode = validateMode(args.mode || "A");
    const salt = randomBytes(16);
    const dek = randomBytes(32);
    const kdf = { ...KDF_DEFAULT };
    const kek = deriveKey(passphrase, salt.toString("base64"), kdf);
    const wrapped = seal(kek, dek, "vault:dek");
    const ts = now();
    const deviceKey = mode === "A" ? null : randomBytes(32);
    const wrappedDevice = deviceKey ? seal(deviceKey, dek, "vault:device") : null;

    tx(db, () => {
      headerSet(db, {
        schema_version: SCHEMA_VERSION,
        salt: salt.toString("base64"),
        kdf: JSON.stringify(kdf),
        wrapped_dek: wrapped,
        passphrase_rev: 1,
        created_at: ts,
      });
      deviceSet(db, {
        wrapped_dek_device: wrappedDevice,
        unlock_mode: mode,
        auto_unlock: mode === "A" ? 0 : 1,
        reveal_policy: mode === "B" ? "passphrase" : "session",
        idle_timeout_sec: 900,
        last_unlock_at: ts,
        passphrase_rev_seen: 1,
        created_at: ts,
      });
    });
    if (deviceKey) writeDeviceKey(deviceKey);
    state.dek = dek;
    state.lastActivity = ts;
    return { ok: true, unlockMode: mode, cloudSync: true, syncNote: SYNC_NOTE };
  }

  function unlock(args = {}) {
    if (!initialized()) throw new Error("保险箱未初始化");
    if (state.dek) {
      state.lastActivity = now();
      return { ok: true };
    }
    if (state.lockUntil > now()) {
      const left = Math.ceil((state.lockUntil - now()) / 1000);
      throw new Error("口令错误次数过多，请 " + left + " 秒后重试");
    }
    const passphrase = String(args.passphrase || "");
    const head = headerGet(db);
    const device = deviceGet(db) || { passphrase_rev_seen: head.passphrase_rev };
    try {
      const kek = deriveKey(passphrase, head.salt, parseKdf(head.kdf));
      state.dek = open(kek, head.wrapped_dek, "vault:dek");
      state.failures = 0;
      state.lastActivity = now();
      deviceSet(db, { last_unlock_at: now(), passphrase_rev_seen: head.passphrase_rev });
      const notice = runMigration();
      if (Number(head.passphrase_rev) > Number(device.passphrase_rev_seen || 0)) {
        return { ok: true, notice: "口令已在其他设备修改，本机已采用新口令。" + (notice ? " " + notice : "") };
      }
      return notice ? { ok: true, notice } : { ok: true };
    } catch (error) {
      state.failures += 1;
      if (state.failures >= 5) {
        state.failures = 0;
        state.lockUntil = now() + 5 * 60 * 1000;
      }
      if (Number(head.passphrase_rev) > Number(device.passphrase_rev_seen || 0)) {
        throw new Error("口令已在其他设备修改，请使用新口令");
      }
      throw new Error("口令错误");
    }
  }

  function listSecrets(args = {}) {
    const q = String(args.q || "").trim();
    const kind = String(args.kind || "").trim();
    const groupId = args.groupId == null ? "" : String(args.groupId);
    // 谓词自带表别名前缀：历史实现事后给每个谓词拼 "s."，带括号的 OR 条件会被拼成
    // "s.(name LIKE ? OR meta LIKE ?)" 而报 SQLite 语法错误（搜索框一输入就失败）。
    const where = ["s.deleted_at IS NULL"];
    const params = [];
    if (q) {
      where.push("(s.name LIKE ? OR s.meta LIKE ?)");
      params.push("%" + q + "%", "%" + q + "%");
    }
    if (kind) {
      where.push("s.kind = ?");
      params.push(kind);
    }
    const setId = args.setId == null ? "" : String(args.setId);
    let join = "";
    if (groupId) {
      join =
        "JOIN vault_set_secret ss_g ON ss_g.secret_id = s.id AND ss_g.deleted_at IS NULL " +
        "JOIN vault_group_set gs_g ON gs_g.set_id = ss_g.set_id AND gs_g.deleted_at IS NULL AND gs_g.group_id = ? ";
      params.unshift(groupId);
    } else if (setId) {
      join =
        "JOIN vault_set_secret ss_s ON ss_s.secret_id = s.id AND ss_s.deleted_at IS NULL AND ss_s.set_id = ? ";
      params.unshift(setId);
    }
    const rows = db
      .prepare(
        "SELECT DISTINCT s.* FROM vault_secret s " + join + "WHERE " + where.join(" AND ") +
          " ORDER BY s.updated_at DESC",
      )
      .all(...params);
    const usage = usageMap(db);
    return {
      items: rows.map((row) => ({
        ...secretRow(row, usage),
        meta: parseJson(row.meta, {}),
        setIds: sets.setIdsOfSecret(row.id),
      })),
    };
  }

  function createSecret(args = {}) {
    const dek = requireUnlocked();
    const name = assertSecretName(args.name);
    const kind = assertKind(args.kind);
    const secret = String(args.secret ?? "");
    if (!secret) throw new Error("secret 不能为空");
    const meta = assertMeta(args.meta);
    const groupId = args.groupId == null || args.groupId === "" ? null : String(args.groupId);
    if (!groupExists(groupId)) throw new Error("分组不存在：" + groupId);
    const id = newId("sec");
    const ts = now();
    const ciphertext = seal(dek, secret, secretAad(id, name, kind));
    let setRow = null;
    if (args.setId) {
      const wanted = db.prepare("SELECT * FROM vault_set WHERE id = ? AND deleted_at IS NULL").get(String(args.setId));
      if (!wanted) throw new Error("集合不存在：" + args.setId);
      setRow = wanted;
    } else if (groupId) {
      setRow = sets.ensureDefaultSet(groupId);
    }
    try {
      db.prepare(
        "INSERT INTO vault_secret(id, name, kind, meta, ciphertext, created_at, updated_at, rev) " +
          "VALUES(?, ?, ?, ?, ?, ?, ?, 1)",
      ).run(id, name, kind, meta, ciphertext, ts, ts);
    } catch (error) {
      const msg = String(error && error.message);
      if (msg.includes("UNIQUE")) throw new Error("已有同名 secret：" + name);
      throw error;
    }
    if (setRow) sets.linkSecret(setRow.id, id);
    return { id, ok: true, setId: setRow ? setRow.id : null };
  }

  function updateSecret(args = {}) {
    const dek = requireUnlocked();
    const id = String(args.id || "");
    const row = db.prepare("SELECT * FROM vault_secret WHERE id = ? AND deleted_at IS NULL").get(id);
    if (!row) throw new Error("secret 不存在：" + id);
    const name = args.name == null ? row.name : assertSecretName(args.name);
    const kind = args.kind == null ? row.kind : assertKind(args.kind);
    const meta = args.meta == null ? row.meta : assertMeta(args.meta);
    let ciphertext = row.ciphertext;
    if (args.secret != null && String(args.secret) !== "") {
      ciphertext = seal(dek, String(args.secret), secretAad(id, name, kind));
    } else if (name !== row.name || kind !== row.kind) {
      const plain = open(dek, row.ciphertext, secretAad(id, row.name, row.kind));
      ciphertext = seal(dek, plain, secretAad(id, name, kind));
    }
    const ts = now();
    try {
      db.prepare(
        "UPDATE vault_secret SET name = ?, kind = ?, meta = ?, ciphertext = ?, updated_at = ?, rev = rev + 1 " +
          "WHERE id = ?",
      ).run(name, kind, meta, ciphertext, ts, id);
    } catch (error) {
      const msg = String(error && error.message);
      if (msg.includes("UNIQUE")) throw new Error("已有同名 secret：" + name);
      throw error;
    }
    if (args.groupId) {
      const target = sets.ensureDefaultSet(String(args.groupId));
      sets.linkSecret(target.id, id);
      return { ok: true, setId: target.id };
    }
    return { ok: true };
  }

  function deleteSecret(args = {}) {
    requireUnlocked();
    const id = String(args.id || "");
    const ts = now();
    const info = db.prepare(
      "UPDATE vault_secret SET deleted_at = ?, updated_at = ?, rev = rev + 1 WHERE id = ? AND deleted_at IS NULL",
    ).run(ts, ts, id);
    if (!info.changes) throw new Error("secret 不存在：" + id);
    sets.detachSecretEverywhere(id);
    return { ok: true };
  }

  function reveal(args = {}) {
    const dek = requireUnlocked();
    const id = String(args.id || "");
    const device = deviceGet(db) || {};
    const mode = device.unlock_mode || "A";
    const policy = device.reveal_policy || "session";
    if (mode === "B" || policy === "passphrase") {
      const passphrase = String(args.passphrase || "");
      if (!passphrase) throw new Error("当前模式查看凭据需要口令");
      checkPassphrase(passphrase);
    }
    const row = db.prepare("SELECT * FROM vault_secret WHERE id = ? AND deleted_at IS NULL").get(id);
    if (!row) throw new Error("secret 不存在：" + id);
    const secret = open(dek, row.ciphertext, secretAad(row.id, row.name, row.kind)).toString("utf8");
    touchUsage(db, id);
    return { secret, id: row.id, name: row.name, kind: row.kind };
  }

  function lease(args = {}) {
    const dek = requireUnlocked();
    const id = String(args.id || "");
    const subjectType = String(args.subjectType || "");
    const subjectId = String(args.subjectId || "");
    if (subjectType && subjectId) {
      const bound = db
        .prepare("SELECT 1 FROM vault_binding WHERE subject_type = ? AND subject_id = ? AND deleted_at IS NULL LIMIT 1")
        .get(subjectType, subjectId);
      if (!bound) throw new Error("该对象未绑定任何凭据组，无法租用：" + subjectType + "/" + subjectId);
    }
    const ttl = Math.max(30, Math.min(300, Number(args.ttlSeconds) || 60));
    const row = db.prepare("SELECT * FROM vault_secret WHERE id = ? AND deleted_at IS NULL").get(id);
    if (!row) throw new Error("secret 不存在：" + id);
    const secret = open(dek, row.ciphertext, secretAad(row.id, row.name, row.kind)).toString("utf8");
    touchUsage(db, id);
    return {
      secret,
      id: row.id,
      name: row.name,
      kind: row.kind,
      setId: sets.setIdsOfSecret(row.id)[0] || null,
      expiresAt: now() + ttl * 1000,
      purpose: String(args.purpose || ""),
    };
  }

  function changePassphrase(args = {}) {
    requireUnlocked();
    const oldPassphrase = String(args.oldPassphrase || "");
    checkPassphrase(oldPassphrase);
    const next = assertPassphrase(args.newPassphrase);
    const head = headerGet(db);
    const salt = randomBytes(16);
    const kek = deriveKey(next, salt.toString("base64"), KDF_DEFAULT);
    const wrapped = seal(kek, state.dek, "vault:dek");
    const passphraseRev = Number(head.passphrase_rev || 1) + 1;
    tx(db, () => {
      headerSet(db, {
        schema_version: SCHEMA_VERSION,
        salt: salt.toString("base64"),
        kdf: JSON.stringify(KDF_DEFAULT),
        wrapped_dek: wrapped,
        passphrase_rev: passphraseRev,
      });
      deviceSet(db, { passphrase_rev_seen: passphraseRev });
    });
    return { ok: true, passphraseRev };
  }

  function setUnlockMode(args = {}) {
    if (!initialized()) throw new Error("保险箱未初始化");
    const mode = validateMode(args.mode);
    const before = deviceGet(db);
    try {
      if (!state.dek) {
        if (!args.passphrase) throw new Error("保险箱已锁定，切换模式需要口令");
        unlock({ passphrase: args.passphrase });
      }
      if (mode === "A") {
        removeDeviceKey();
        deviceSet(db, { wrapped_dek_device: null, unlock_mode: "A", auto_unlock: 0, reveal_policy: "session" });
      } else {
        const deviceKey = readDeviceKey() || randomBytes(32);
        const wrapped = seal(deviceKey, state.dek, "vault:device");
        writeDeviceKey(deviceKey);
        deviceSet(db, {
          wrapped_dek_device: wrapped,
          unlock_mode: mode,
          auto_unlock: 1,
          reveal_policy: mode === "B" ? "passphrase" : "session",
        });
      }
      return { ok: true, unlockMode: mode };
    } catch (error) {
      if (before) deviceSet(db, before);
      throw error;
    }
  }

  function rotateDeviceKey(args = {}) {
    if (!initialized()) throw new Error("保险箱未初始化");
    const device = deviceGet(db) || {};
    if ((device.unlock_mode || "A") === "A") throw new Error("A 模式没有 device key");
    if (!state.dek) throw new Error("保险箱已锁定");
    checkPassphrase(String(args.passphrase || ""));
    const deviceKey = randomBytes(32);
    const wrapped = seal(deviceKey, state.dek, "vault:device");
    writeDeviceKey(deviceKey);
    deviceSet(db, { wrapped_dek_device: wrapped });
    return { ok: true };
  }

  /**
   * 供受绑定约束的 plugin 写接口使用：按 (groupId, name) 幂等写入一条凭据。
   * 绑定/授权校验在 action 层完成，这里只负责加密落库。
   */
  /** 往指定集合幂等写一条凭据（全局按 name 去重）；调用方负责先校验归属权限。 */
  function writeSecretToSet(args = {}) {
    const dek = requireUnlocked();
    const name = assertSecretName(args.name);
    const kind = assertKind(args.kind || "other");
    const secret = String(args.secret ?? "");
    if (!secret) throw new Error("secret 不能为空");
    const meta = assertMeta(args.meta);
    const setId = String(args.setId || "");
    if (!setId) throw new Error("setId 必填");

    const setRow = db.prepare("SELECT * FROM vault_set WHERE id = ? AND deleted_at IS NULL").get(setId);
    if (!setRow) throw new Error("集合不存在：" + setId);
    const row = db.prepare("SELECT * FROM vault_secret WHERE name = ? AND deleted_at IS NULL").get(name);
    const ts = now();
    if (row) {
      const ciphertext = seal(dek, secret, secretAad(row.id, name, kind));
      db.prepare(
        "UPDATE vault_secret SET kind = ?, meta = ?, ciphertext = ?, updated_at = ?, rev = rev + 1 WHERE id = ?",
      ).run(kind, meta, ciphertext, ts, row.id);
      sets.linkSecret(setId, row.id);
      return { id: row.id, setId, created: false, updated: true };
    }
    const id = newId("sec");
    const ciphertext = seal(dek, secret, secretAad(id, name, kind));
    db.prepare(
      "INSERT INTO vault_secret(id, name, kind, meta, ciphertext, created_at, updated_at, rev) " +
        "VALUES(?, ?, ?, ?, ?, ?, ?, 1)",
    ).run(id, name, kind, meta, ciphertext, ts, ts);
    sets.linkSecret(setId, id);
    return { id, setId, created: true, updated: false };
  }

  /** 把集合里的某条凭据摘出来；不再属于任何集合时才软删，避免误删别处还在用的凭据。 */
  function detachSecretFromSet(args = {}) {
    requireUnlocked();
    const setId = String(args.setId || "");
    if (!setId) throw new Error("setId 必填");
    const name = assertSecretName(args.name);
    const row = db.prepare("SELECT * FROM vault_secret WHERE name = ? AND deleted_at IS NULL").get(name);
    if (!row) return { ok: true, removed: false };
    sets.unlinkSecret(setId, row.id);
    if (!sets.setIdsOfSecret(row.id).length) {
      const ts = now();
      db.prepare("UPDATE vault_secret SET deleted_at = ?, updated_at = ?, rev = rev + 1 WHERE id = ?").run(ts, ts, row.id);
      return { ok: true, removed: true, deleted: true };
    }
    return { ok: true, removed: true, deleted: false };
  }

  function exportData() {
    return {
      formatVersion: 1,
      exportedAt: new Date(now()).toISOString(),
      secrets: [],
      groups: [],
      bindings: [],
      note: "保险箱密文与 KDF 参数不进入备份；换机请重新录入凭据。",
    };
  }

  function importData() {
    return { ok: true, imported: 0, skipped: 0, failed: 0, message: "保险箱不导入密文" };
  }

  return {
    status,
    setup,
    unlock,
    lock,
    listSecrets,
    createSecret,
    updateSecret,
    deleteSecret,
    writeSecretToSet,
    detachSecretFromSet,
    reveal,
    lease,
    changePassphrase,
    setUnlockMode,
    rotateDeviceKey,
    exportData,
    importData,
    initialized,
    mode: () => (deviceGet(db) || {}).unlock_mode || "A",
  };
}
