/**
 * 消息子插件：表结构与通用行转换。
 *
 * 只依赖 api.db（node:sqlite DatabaseSync），不 import 宿主模块。
 * 消息只在本机保存：apply 里显式 `sync: { tables: [] }`（默认按行同步），
 * 也不提供 exportData/importData，因此不会进入备份包。
 */

export const MESSAGE_TABLE = "message";

export const MESSAGE_DDL = [
  "CREATE TABLE IF NOT EXISTS message (" +
    "id TEXT PRIMARY KEY," +
    "title TEXT NOT NULL," +
    "body TEXT NOT NULL DEFAULT ''," +
    "level TEXT NOT NULL DEFAULT 'info'," +
    "source TEXT NOT NULL DEFAULT ''," +
    "audience TEXT NOT NULL DEFAULT 'all'," +
    "dedupe_key TEXT," +
    "meta TEXT NOT NULL DEFAULT ''," +
    "created_at INTEGER NOT NULL," +
    "read_at INTEGER," +
    "deleted_at INTEGER," +
    "rev INTEGER NOT NULL DEFAULT 1" +
    ");",
];

export const MESSAGE_INDEX_DDL = [
  // 去重键只在存活行之间唯一：软删掉的旧消息不占位。
  "CREATE UNIQUE INDEX IF NOT EXISTS uk_message_dedupe ON message(dedupe_key) WHERE dedupe_key IS NOT NULL AND deleted_at IS NULL;",
  "CREATE INDEX IF NOT EXISTS idx_message_created ON message(deleted_at, created_at DESC);",
  "CREATE INDEX IF NOT EXISTS idx_message_unread ON message(deleted_at, read_at);",
];

let clockNow = null;
let lastTs = 0;

/** 宿主注入同步时钟；未注入时退回本地单调时钟，保证同一毫秒内创建的多条消息有序。 */
export function bindClock(fn) {
  clockNow = typeof fn === "function" ? fn : null;
}

export function now() {
  if (clockNow) return clockNow();
  const t = Date.now();
  lastTs = t > lastTs ? t : lastTs + 1;
  return lastTs;
}

export function newId(prefix) {
  const head = prefix || "msg";
  let tail = "";
  for (let i = 0; i < 8; i += 1) tail += Math.floor(Math.random() * 36).toString(36);
  return head + "_" + now().toString(36) + "_" + tail;
}

export function tableExists(db, name) {
  try {
    return !!db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name=?").get(String(name));
  } catch {
    return false;
  }
}

export function tx(db, fn) {
  db.exec("BEGIN IMMEDIATE");
  try {
    const result = fn();
    db.exec("COMMIT");
    return result;
  } catch (error) {
    try {
      db.exec("ROLLBACK");
    } catch {
      /* ignore rollback failure */
    }
    throw error;
  }
}

/** 行 → 对外对象。时间统一用毫秒时间戳，由客户端本地化显示。 */
export function rowMessage(row) {
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    body: row.body || "",
    level: row.level || "info",
    source: row.source || "",
    audience: row.audience || "all",
    dedupeKey: row.dedupe_key || null,
    meta: row.meta || "",
    createdAt: row.created_at,
    readAt: row.read_at || null,
    read: !!row.read_at,
    rev: row.rev,
  };
}

export function ensureSchema(db, log) {
  const logger = typeof log === "function" ? log : function () {};
  for (const sql of MESSAGE_DDL) db.exec(sql);
  for (const sql of MESSAGE_INDEX_DDL) {
    try {
      db.exec(sql);
    } catch (error) {
      logger("message addon: 索引创建失败：" + String((error && error.message) || error));
    }
  }
}
