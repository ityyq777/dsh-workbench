export const ACCOUNT_DDL = [
  "CREATE TABLE IF NOT EXISTS site_account (" +
    "id TEXT PRIMARY KEY," +
    "site_id TEXT NOT NULL," +
    "account_key TEXT NOT NULL DEFAULT ''," +
    "account TEXT NOT NULL DEFAULT ''," +
    "password TEXT NOT NULL DEFAULT ''," +
    "phone_number TEXT NOT NULL DEFAULT ''," +
    "identity_card TEXT NOT NULL DEFAULT ''," +
    "remark TEXT NOT NULL DEFAULT ''," +
    "created_at INTEGER NOT NULL," +
    "updated_at INTEGER NOT NULL," +
    "deleted_at INTEGER," +
    "rev INTEGER NOT NULL DEFAULT 1" +
    ");",
  "CREATE INDEX IF NOT EXISTS idx_site_account_site ON site_account(site_id);",
  "CREATE INDEX IF NOT EXISTS idx_site_account_key ON site_account(site_id, account_key);",
];

export const EXTERNAL_DDL = [
  "CREATE TABLE IF NOT EXISTS site_account_external (" +
    "id TEXT PRIMARY KEY," +
    "native_account_id TEXT NOT NULL," +
    "external_account_id TEXT NOT NULL," +
    "created_at INTEGER NOT NULL," +
    "updated_at INTEGER NOT NULL," +
    "deleted_at INTEGER," +
    "rev INTEGER NOT NULL DEFAULT 1" +
    ");",
  "CREATE INDEX IF NOT EXISTS idx_sae_native ON site_account_external(native_account_id);",
  "CREATE INDEX IF NOT EXISTS idx_sae_external ON site_account_external(external_account_id);",
];

