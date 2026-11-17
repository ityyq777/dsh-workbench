/**
 * 连接器四表：source 参与云同步，state/item/run 只在本机。
 * 详见 docs/specs/46-连接器与凭据保险箱方案.md 第 8 节。
 */
export const CONNECTOR_DDL = [
  "CREATE TABLE IF NOT EXISTS connector_source (" +
    "id TEXT PRIMARY KEY," +
    "name TEXT NOT NULL," +
    "driver TEXT NOT NULL," +
    "config TEXT NOT NULL DEFAULT '{}'," +
    "enabled INTEGER NOT NULL DEFAULT 1," +
    "schedule_sec INTEGER NOT NULL DEFAULT 900," +
    "sink TEXT NOT NULL DEFAULT 'none'," +
    "sink_config TEXT NOT NULL DEFAULT '{}'," +
    "created_at INTEGER NOT NULL," +
    "updated_at INTEGER NOT NULL," +
    "deleted_at INTEGER," +
    "rev INTEGER NOT NULL DEFAULT 1" +
    ");",
  "CREATE UNIQUE INDEX IF NOT EXISTS uk_connector_source_name ON connector_source(name) WHERE deleted_at IS NULL;",
  "CREATE INDEX IF NOT EXISTS idx_connector_source_due ON connector_source(deleted_at, enabled);",
  "CREATE TABLE IF NOT EXISTS connector_source_state (" +
    "source_id TEXT PRIMARY KEY," +
    "secret_id TEXT," +
    "cursor TEXT NOT NULL DEFAULT ''," +
    "next_run_at INTEGER NOT NULL DEFAULT 0," +
    "last_run_at INTEGER," +
    "last_status TEXT NOT NULL DEFAULT 'idle'," +
    "last_error TEXT," +
    "fail_count INTEGER NOT NULL DEFAULT 0," +
    "delivery_enabled INTEGER NOT NULL DEFAULT 0," +
    "updated_at INTEGER NOT NULL" +
    ");",
  "CREATE TABLE IF NOT EXISTS connector_item (" +
    "id TEXT PRIMARY KEY," +
    "source_id TEXT NOT NULL," +
    "external_id TEXT NOT NULL," +
    "title TEXT NOT NULL DEFAULT ''," +
    "url TEXT NOT NULL DEFAULT ''," +
    "summary TEXT NOT NULL DEFAULT ''," +
    "content TEXT NOT NULL DEFAULT ''," +
    "author TEXT NOT NULL DEFAULT ''," +
    "published_at INTEGER," +
    "fetched_at INTEGER NOT NULL," +
    "hash TEXT NOT NULL DEFAULT ''," +
    "raw TEXT NOT NULL DEFAULT ''," +
    "created_at INTEGER NOT NULL," +
    "updated_at INTEGER NOT NULL" +
    ");",
  "CREATE UNIQUE INDEX IF NOT EXISTS uk_connector_item_ext ON connector_item(source_id, external_id);",
  "CREATE INDEX IF NOT EXISTS idx_connector_item_time ON connector_item(source_id, published_at DESC, fetched_at DESC);",
  "CREATE TABLE IF NOT EXISTS connector_run (" +
    "id TEXT PRIMARY KEY," +
    "source_id TEXT NOT NULL," +
    "trigger TEXT NOT NULL DEFAULT 'manual'," +
    "started_at INTEGER NOT NULL," +
    "finished_at INTEGER," +
    "status TEXT NOT NULL DEFAULT 'running'," +
    "fetched INTEGER NOT NULL DEFAULT 0," +
    "inserted INTEGER NOT NULL DEFAULT 0," +
    "updated INTEGER NOT NULL DEFAULT 0," +
    "skipped INTEGER NOT NULL DEFAULT 0," +
    "error TEXT" +
    ");",
  "CREATE INDEX IF NOT EXISTS idx_connector_run_source ON connector_run(source_id, started_at DESC);",
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

export function newId(prefix) {
  let tail = "";
  for (let i = 0; i < 10; i += 1) tail += Math.floor(Math.random() * 36).toString(36);
  return String(prefix || "id") + "_" + now().toString(36) + "_" + tail;
}

export function ensureSchema(db) {
  for (const sql of CONNECTOR_DDL) db.exec(sql);
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

export function parseJson(raw, fallback) {
  try {
    return JSON.parse(String(raw));
  } catch {
    return fallback;
  }
}

export function sourceRow(row, state) {
  return {
    id: row.id,
    name: row.name,
    driver: row.driver,
    config: parseJson(row.config, {}),
    enabled: Boolean(row.enabled),
    scheduleSec: row.schedule_sec,
    sink: row.sink,
    sinkConfig: parseJson(row.sink_config, {}),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    rev: row.rev,
    state: state
      ? {
          secretId: state.secret_id || null,
          cursor: state.cursor || "",
          nextRunAt: state.next_run_at || 0,
          lastRunAt: state.last_run_at || null,
          lastStatus: state.last_status || "idle",
          lastError: state.last_error || "",
          failCount: state.fail_count || 0,
          deliveryEnabled: Boolean(state.delivery_enabled),
        }
      : null,
  };
}

export function itemRow(row) {
  return {
    id: row.id,
    sourceId: row.source_id,
    externalId: row.external_id,
    title: row.title,
    url: row.url,
    summary: row.summary,
    content: row.content,
    author: row.author,
    publishedAt: row.published_at || null,
    fetchedAt: row.fetched_at,
    hash: row.hash,
  };
}
