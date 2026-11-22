/**
 * 保险箱数据库：只保存密文与 KDF 参数，不保存口令、DEK 或明文。
 * 0.2.0 起拆表：vault_header（单行、参与同步）+ vault_device（本机）+ 使用记录。
 * 表结构见 docs/specs/46-连接器与凭据保险箱方案.md 7.3。
 */
export const VAULT_HEADER = "vault_header";
export const VAULT_DEVICE = "vault_device";
export const VAULT_GROUP = "vault_group";
export const VAULT_SECRET = "vault_secret";
export const VAULT_SET = "vault_set";
export const VAULT_GROUP_SET = "vault_group_set";
export const VAULT_SET_SECRET = "vault_set_secret";
export const VAULT_BINDING = "vault_binding";
export const VAULT_SUBJECT_TYPE = "vault_subject_type";
export const VAULT_SECRET_USAGE = "vault_secret_usage";
export const VAULT_META_LEGACY = "vault_meta_legacy";

/**
 * 0.3.0 起：集合层（set）与两张多对多关联表；schema_version 3。
 * 0.4.0 起：集合加可选 account 列（账号集合 / 普通集合由它是否为空区分）；schema_version 4。
 */
export const SCHEMA_VERSION = 4;

export const VAULT_DDL = [
  "CREATE TABLE IF NOT EXISTS vault_header (" +
    "id INTEGER PRIMARY KEY CHECK (id = 1)," +
    "schema_version INTEGER NOT NULL DEFAULT 3," +
    "salt TEXT NOT NULL," +
    "kdf TEXT NOT NULL," +
    "wrapped_dek TEXT NOT NULL," +
    "passphrase_rev INTEGER NOT NULL DEFAULT 1," +
    "created_at INTEGER NOT NULL," +
    "updated_at INTEGER NOT NULL," +
    "rev INTEGER NOT NULL DEFAULT 1" +
    ");",
  "CREATE TABLE IF NOT EXISTS vault_device (" +
    "id TEXT PRIMARY KEY," +
    "wrapped_dek_device TEXT," +
    "unlock_mode TEXT NOT NULL DEFAULT 'A'," +
    "auto_unlock INTEGER NOT NULL DEFAULT 0," +
    "reveal_policy TEXT NOT NULL DEFAULT 'session'," +
    "idle_timeout_sec INTEGER NOT NULL DEFAULT 900," +
    "last_unlock_at INTEGER," +
    "passphrase_rev_seen INTEGER NOT NULL DEFAULT 0," +
    "created_at INTEGER NOT NULL," +
    "updated_at INTEGER NOT NULL," +
    "rev INTEGER NOT NULL DEFAULT 1" +
    ");",
  "CREATE TABLE IF NOT EXISTS vault_group (" +
    "id TEXT PRIMARY KEY," +
    "name TEXT NOT NULL," +
    "description TEXT NOT NULL DEFAULT ''," +
    "color TEXT," +
    "created_at INTEGER NOT NULL," +
    "updated_at INTEGER NOT NULL," +
    "deleted_at INTEGER," +
    "rev INTEGER NOT NULL DEFAULT 1" +
    ");",
  "CREATE UNIQUE INDEX IF NOT EXISTS uk_vault_group_name ON vault_group(name) WHERE deleted_at IS NULL;",
  "CREATE TABLE IF NOT EXISTS vault_secret (" +
    "id TEXT PRIMARY KEY," +
    "name TEXT NOT NULL," +
    "kind TEXT NOT NULL," +
    "meta TEXT NOT NULL DEFAULT '{}'," +
    "ciphertext TEXT NOT NULL," +
    "created_at INTEGER NOT NULL," +
    "updated_at INTEGER NOT NULL," +
    "deleted_at INTEGER," +
    "rev INTEGER NOT NULL DEFAULT 1" +
    ");",
  "CREATE UNIQUE INDEX IF NOT EXISTS uk_vault_secret_name ON vault_secret(name) WHERE deleted_at IS NULL;",
  "CREATE INDEX IF NOT EXISTS idx_vault_secret_kind ON vault_secret(deleted_at, kind);",
  "CREATE TABLE IF NOT EXISTS vault_set (" +
    "id TEXT PRIMARY KEY," +
    "name TEXT NOT NULL," +
    "account TEXT NOT NULL DEFAULT ''," +
    "description TEXT NOT NULL DEFAULT ''," +
    "color TEXT," +
    "created_at INTEGER NOT NULL," +
    "updated_at INTEGER NOT NULL," +
    "deleted_at INTEGER," +
    "rev INTEGER NOT NULL DEFAULT 1" +
    ");",
  "CREATE UNIQUE INDEX IF NOT EXISTS uk_vault_set_name ON vault_set(name) WHERE deleted_at IS NULL;",
  "CREATE TABLE IF NOT EXISTS vault_group_set (" +
    "id TEXT PRIMARY KEY," +
    "group_id TEXT NOT NULL," +
    "set_id TEXT NOT NULL," +
    "created_at INTEGER NOT NULL," +
    "updated_at INTEGER NOT NULL," +
    "deleted_at INTEGER," +
    "rev INTEGER NOT NULL DEFAULT 1" +
    ");",
  "CREATE UNIQUE INDEX IF NOT EXISTS uk_vault_group_set ON vault_group_set(group_id, set_id) WHERE deleted_at IS NULL;",
  "CREATE INDEX IF NOT EXISTS idx_vault_group_set_group ON vault_group_set(group_id);",
  "CREATE INDEX IF NOT EXISTS idx_vault_group_set_set ON vault_group_set(set_id);",
  "CREATE TABLE IF NOT EXISTS vault_set_secret (" +
    "id TEXT PRIMARY KEY," +
    "set_id TEXT NOT NULL," +
    "secret_id TEXT NOT NULL," +
    "created_at INTEGER NOT NULL," +
    "updated_at INTEGER NOT NULL," +
    "deleted_at INTEGER," +
    "rev INTEGER NOT NULL DEFAULT 1" +
    ");",
  "CREATE UNIQUE INDEX IF NOT EXISTS uk_vault_set_secret ON vault_set_secret(set_id, secret_id) WHERE deleted_at IS NULL;",
  "CREATE INDEX IF NOT EXISTS idx_vault_set_secret_set ON vault_set_secret(set_id);",
  "CREATE INDEX IF NOT EXISTS idx_vault_set_secret_secret ON vault_set_secret(secret_id);",
  "CREATE TABLE IF NOT EXISTS vault_binding (" +
    "id TEXT PRIMARY KEY," +
    "subject_type TEXT NOT NULL," +
    "subject_id TEXT NOT NULL," +
    "group_id TEXT NOT NULL," +
    "created_at INTEGER NOT NULL," +
    "updated_at INTEGER NOT NULL," +
    "deleted_at INTEGER," +
    "rev INTEGER NOT NULL DEFAULT 1" +
    ");",
  "CREATE UNIQUE INDEX IF NOT EXISTS uk_vault_binding ON vault_binding(subject_type, subject_id, group_id) WHERE deleted_at IS NULL;",
  "CREATE INDEX IF NOT EXISTS idx_vault_binding_subject ON vault_binding(subject_type, subject_id);",
  "CREATE INDEX IF NOT EXISTS idx_vault_binding_group ON vault_binding(group_id);",
  "CREATE TABLE IF NOT EXISTS vault_subject_type (" +
    "id TEXT PRIMARY KEY," +
    "type TEXT NOT NULL," +
    "title TEXT NOT NULL," +
    "description TEXT NOT NULL DEFAULT ''," +
    "updated_at INTEGER NOT NULL," +
    "rev INTEGER NOT NULL DEFAULT 1" +
    ");",
  "CREATE UNIQUE INDEX IF NOT EXISTS uk_vault_subject_type ON vault_subject_type(type);",
  "CREATE TABLE IF NOT EXISTS vault_secret_usage (" +
    "secret_id TEXT PRIMARY KEY," +
    "last_used_at INTEGER NOT NULL" +
    ");",
];

let clock = null;
let last = 0;

export function bindClock(fn) {
  clock = typeof fn === "function" ? fn : null;
}

export function now() {
  if (clock) return clock();
  const t = Date.now();
  last = t > last ? t : last + 1;
  return last;
}

export function newId(prefix = "sec") {
  let tail = "";
  for (let i = 0; i < 10; i += 1) tail += Math.floor(Math.random() * 36).toString(36);
  return prefix + "_" + now().toString(36) + "_" + tail;
}

export function hasColumn(db, table, column) {
  return tableExists(db, table) && columnNames(db, table).includes(String(column));
}

export function tableExists(db, table) {
  return Boolean(db.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = ?").get(String(table)));
}

export function columnNames(db, table) {
  return db.prepare("PRAGMA table_info(" + String(table) + ")").all().map((row) => row.name);
}

export function ensureSchema(db) {
  for (const sql of VAULT_DDL) db.exec(sql);
  migrateV1(db);
  migrateV4(db);
}

/**
 * 0.3.x → 0.4.0：给 vault_set 补 account 列（纯结构升级，不需要 DEK）。
 * 只把已经到 3 的库升到 4；schema_version=2 的旧库仍由解锁后的 migrateToV3 整批迁移，
 * 否则会跳过 0.3.0 的数据搬家，只剩空壳结构。
 */
export function migrateV4(db) {
  if (tableExists(db, "vault_set") && !hasColumn(db, "vault_set", "account")) {
    db.exec("ALTER TABLE vault_set ADD COLUMN account TEXT NOT NULL DEFAULT ''");
  }
  const head = headerGet(db);
  if (!head) return;
  const version = Number(head.schema_version || 0);
  if (version >= 3 && version < SCHEMA_VERSION) headerSet(db, { schema_version: SCHEMA_VERSION });
}

/**
 * 0.1.0 → 0.2.0：vault_meta(KV) 拆成单行 vault_header + 本机 vault_device，
 * last_used_at 搬到 vault_secret_usage。幂等；不改密文本体，解锁前也能跑。
 */
export function migrateV1(db) {
  if (!tableExists(db, "vault_meta")) return;
  if (headerGet(db)) return;
  const rows = db.prepare("SELECT key, value FROM vault_meta").all();
  if (!rows.length) return;
  const meta = {};
  for (const row of rows) meta[row.key] = String(row.value);
  if (!meta.schema_version || !meta.salt || !meta.wrapped_dek) return;

  tx(db, () => {
    ensureGroupColumn(db);
    const ts = Number(meta.created_at) || now();
    db.prepare(
      "INSERT INTO vault_header(id, schema_version, salt, kdf, wrapped_dek, passphrase_rev, created_at, updated_at, rev) " +
        "VALUES(1, 2, ?, ?, ?, 1, ?, ?, 1)",
    ).run(meta.salt, meta.kdf || "{}", meta.wrapped_dek, ts, now());
    db.prepare(
      "INSERT INTO vault_device(id, wrapped_dek_device, unlock_mode, auto_unlock, reveal_policy, idle_timeout_sec, " +
        "last_unlock_at, passphrase_rev_seen, created_at, updated_at, rev) VALUES('local', ?, ?, ?, ?, ?, ?, 1, ?, ?, 1)",
    ).run(
      meta.wrapped_dek_device || null,
      meta.unlock_mode || "A",
      meta.auto_unlock === "1" ? 1 : 0,
      meta.reveal_policy || "session",
      Number(meta.idle_timeout_sec) || 900,
      Number(meta.last_unlock_at) || null,
      ts,
      now(),
    );
    db.exec(
      "INSERT INTO vault_secret_usage(secret_id, last_used_at) " +
        "SELECT id, last_used_at FROM vault_secret WHERE last_used_at IS NOT NULL",
    );
    db.exec("ALTER TABLE vault_meta RENAME TO " + VAULT_META_LEGACY);
  });
}

function ensureGroupColumn(db) {
  if (!tableExists(db, "vault_secret")) return;
  if (!columnNames(db, "vault_secret").includes("group_id")) {
    db.exec("ALTER TABLE vault_secret ADD COLUMN group_id TEXT");
  }
}

export function headerGet(db) {
  return db.prepare("SELECT * FROM vault_header WHERE id = 1").get() || null;
}

export function headerSet(db, patch = {}) {
  const cur = headerGet(db) || {};
  const next = {
    schema_version: patch.schema_version ?? cur.schema_version ?? SCHEMA_VERSION,
    salt: patch.salt ?? cur.salt,
    kdf: patch.kdf ?? cur.kdf,
    wrapped_dek: patch.wrapped_dek ?? cur.wrapped_dek,
    passphrase_rev: patch.passphrase_rev ?? cur.passphrase_rev ?? 1,
    created_at: cur.created_at ?? patch.created_at ?? now(),
    updated_at: now(),
    rev: Number(cur.rev || 0) + 1,
  };
  db.prepare(
    "INSERT INTO vault_header(id, schema_version, salt, kdf, wrapped_dek, passphrase_rev, created_at, updated_at, rev) " +
      "VALUES(1, ?, ?, ?, ?, ?, ?, ?, ?) " +
      "ON CONFLICT(id) DO UPDATE SET schema_version = excluded.schema_version, salt = excluded.salt, " +
      "kdf = excluded.kdf, wrapped_dek = excluded.wrapped_dek, passphrase_rev = excluded.passphrase_rev, " +
      "updated_at = excluded.updated_at, rev = excluded.rev",
  ).run(
    next.schema_version,
    next.salt,
    next.kdf,
    next.wrapped_dek,
    next.passphrase_rev,
    next.created_at,
    next.updated_at,
    next.rev,
  );
  return next;
}

export function deviceGet(db) {
  return db.prepare("SELECT * FROM vault_device WHERE id = 'local'").get() || null;
}

export function deviceSet(db, patch = {}) {
  const cur = deviceGet(db) || {};
  const next = {
    wrapped_dek_device: patch.wrapped_dek_device !== undefined ? patch.wrapped_dek_device : cur.wrapped_dek_device ?? null,
    unlock_mode: patch.unlock_mode ?? cur.unlock_mode ?? "A",
    auto_unlock: patch.auto_unlock !== undefined ? Number(patch.auto_unlock ? 1 : 0) : Number(cur.auto_unlock || 0),
    reveal_policy: patch.reveal_policy ?? cur.reveal_policy ?? "session",
    idle_timeout_sec: patch.idle_timeout_sec ?? cur.idle_timeout_sec ?? 900,
    last_unlock_at: patch.last_unlock_at !== undefined ? patch.last_unlock_at : cur.last_unlock_at ?? null,
    passphrase_rev_seen: patch.passphrase_rev_seen ?? cur.passphrase_rev_seen ?? 0,
    created_at: cur.created_at ?? patch.created_at ?? now(),
    updated_at: now(),
    rev: Number(cur.rev || 0) + 1,
  };
  db.prepare(
    "INSERT INTO vault_device(id, wrapped_dek_device, unlock_mode, auto_unlock, reveal_policy, idle_timeout_sec, " +
      "last_unlock_at, passphrase_rev_seen, created_at, updated_at, rev) " +
      "VALUES('local', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) " +
      "ON CONFLICT(id) DO UPDATE SET wrapped_dek_device = excluded.wrapped_dek_device, " +
      "unlock_mode = excluded.unlock_mode, auto_unlock = excluded.auto_unlock, " +
      "reveal_policy = excluded.reveal_policy, idle_timeout_sec = excluded.idle_timeout_sec, " +
      "last_unlock_at = excluded.last_unlock_at, passphrase_rev_seen = excluded.passphrase_rev_seen, " +
      "updated_at = excluded.updated_at, rev = excluded.rev",
  ).run(
    next.wrapped_dek_device,
    next.unlock_mode,
    next.auto_unlock,
    next.reveal_policy,
    next.idle_timeout_sec,
    next.last_unlock_at,
    next.passphrase_rev_seen,
    next.created_at,
    next.updated_at,
    next.rev,
  );
  return next;
}

export function touchUsage(db, secretId) {
  db.prepare(
    "INSERT INTO vault_secret_usage(secret_id, last_used_at) VALUES(?, ?) " +
      "ON CONFLICT(secret_id) DO UPDATE SET last_used_at = excluded.last_used_at",
  ).run(String(secretId), now());
}

export function usageMap(db) {
  const out = {};
  for (const row of db.prepare("SELECT secret_id, last_used_at FROM vault_secret_usage").all()) {
    out[row.secret_id] = row.last_used_at;
  }
  return out;
}

export function tx(db, fn) {
  db.exec("BEGIN IMMEDIATE");
  try {
    const value = fn();
    db.exec("COMMIT");
    return value;
  } catch (error) {
    try {
      db.exec("ROLLBACK");
    } catch {
      /* ignore */
    }
    throw error;
  }
}

export function secretRow(row, usage = {}) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    kind: row.kind,
    meta: row.meta || "{}",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    lastUsedAt: usage[row.id] || null,
    rev: row.rev,
  };
}

export function setRow(row) {
  if (!row) return null;
  const account = String(row.account || "");
  return {
    id: row.id,
    name: row.name,
    account,
    // 账号集合 / 普通集合由 account 是否为空推导，不存冗余列。
    type: account ? "account" : "common",
    description: row.description || "",
    color: row.color || null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    rev: row.rev,
  };
}

export function groupSetRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    groupId: row.group_id,
    setId: row.set_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    rev: row.rev,
  };
}

export function setSecretRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    setId: row.set_id,
    secretId: row.secret_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    rev: row.rev,
  };
}

export function groupRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    description: row.description || "",
    color: row.color || null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    rev: row.rev,
  };
}

export function bindingRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    subjectType: row.subject_type,
    subjectId: row.subject_id,
    groupId: row.group_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    rev: row.rev,
  };
}
