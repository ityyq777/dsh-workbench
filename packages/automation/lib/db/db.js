/** 自动化域 SQLite：规则、运行记录与少量本机配置。 */
let clock = () => Date.now();

export function bindClock(fn) {
  if (typeof fn === "function") clock = fn;
}
export function now() {
  return Number(clock());
}
export function newId(prefix) {
  return prefix + "_" + now().toString(36) + "_" + Math.random().toString(36).slice(2, 10);
}

export function ensureSchema(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS automation_rule (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      enabled INTEGER NOT NULL DEFAULT 1,
      trigger_type TEXT NOT NULL,
      trigger_config TEXT NOT NULL DEFAULT '{}',
      condition TEXT NOT NULL DEFAULT '',
      action_name TEXT NOT NULL,
      action_args TEXT NOT NULL DEFAULT '{}',
      next_run_at INTEGER,
      last_run_at INTEGER,
      last_status TEXT NOT NULL DEFAULT 'never',
      run_count INTEGER NOT NULL DEFAULT 0,
      error_count INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      deleted_at INTEGER,
      rev INTEGER NOT NULL DEFAULT 1
    );
    CREATE INDEX IF NOT EXISTS idx_automation_rule_due ON automation_rule(enabled, next_run_at);
    CREATE TABLE IF NOT EXISTS automation_run (
      id TEXT PRIMARY KEY,
      rule_id TEXT NOT NULL,
      trigger TEXT NOT NULL,
      status TEXT NOT NULL,
      started_at INTEGER NOT NULL,
      finished_at INTEGER,
      result TEXT NOT NULL DEFAULT '',
      error TEXT NOT NULL DEFAULT ''
    );
    CREATE INDEX IF NOT EXISTS idx_automation_run_rule ON automation_run(rule_id, started_at);
    CREATE TABLE IF NOT EXISTS automation_meta (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);
}

export function parseJson(raw, fallback) {
  try {
    return JSON.parse(String(raw));
  } catch {
    return fallback;
  }
}

export function tx(db, fn) {
  db.exec("BEGIN");
  try {
    const out = fn();
    db.exec("COMMIT");
    return out;
  } catch (error) {
    try {
      db.exec("ROLLBACK");
    } catch {
      /* ignore */
    }
    throw error;
  }
}

export function ruleRow(row) {
  return {
    id: row.id,
    name: row.name,
    enabled: Boolean(row.enabled),
    triggerType: row.trigger_type,
    triggerConfig: parseJson(row.trigger_config, {}),
    condition: parseJson(row.condition, null),
    actionName: row.action_name,
    actionArgs: parseJson(row.action_args, {}),
    nextRunAt: row.next_run_at || 0,
    lastRunAt: row.last_run_at || null,
    lastStatus: row.last_status,
    runCount: row.run_count || 0,
    errorCount: row.error_count || 0,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    rev: row.rev,
  };
}

export function runRow(row) {
  return {
    id: row.id,
    ruleId: row.rule_id,
    trigger: row.trigger,
    status: row.status,
    startedAt: row.started_at,
    finishedAt: row.finished_at || null,
    result: row.result || "",
    error: row.error || "",
  };
}

export function metaGet(db, key) {
  const row = db.prepare("SELECT value FROM automation_meta WHERE key=?").get(key);
  return row ? row.value : null;
}

export function metaSet(db, key, value) {
  db.prepare(
    "INSERT INTO automation_meta(key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value",
  ).run(String(key), String(value));
}
