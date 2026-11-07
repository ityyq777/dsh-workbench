/**
 * 标签子插件：表结构、迁移与通用行转换。
 *
 * 只依赖 api.db（node:sqlite DatabaseSync），不 import 宿主模块。
 * 表名沿用 _archive/sheepone_v2 的口径：
 *  - tag(id, name, is_deleted, update_time, create_time)
 *  - tag_mapping(id, tag_id, item_id, item_type, is_deleted, update_time, create_time)
 * 落地时统一为平台行级同步列 created_at / updated_at / deleted_at / rev；
 * 上面的 v2 列名只在 ensureSchema 的旧表迁移里识别。
 */

export const TAG_TABLE = "tag";
export const MAPPING_TABLE = "tag_mapping";

export const TAG_TABLE_DDL = [
  "CREATE TABLE IF NOT EXISTS tag (" +
    "id TEXT PRIMARY KEY," +
    "name TEXT NOT NULL," +
    "created_at INTEGER NOT NULL," +
    "updated_at INTEGER NOT NULL," +
    "deleted_at INTEGER," +
    "rev INTEGER NOT NULL DEFAULT 1" +
    ");",
  "CREATE TABLE IF NOT EXISTS tag_mapping (" +
    "id TEXT PRIMARY KEY," +
    "tag_id TEXT NOT NULL," +
    "item_id TEXT NOT NULL," +
    "item_type TEXT NOT NULL," +
    "created_at INTEGER NOT NULL," +
    "updated_at INTEGER NOT NULL," +
    "deleted_at INTEGER," +
    "rev INTEGER NOT NULL DEFAULT 1" +
    ");",
];

export const TAG_INDEX_DDL = [
  "CREATE UNIQUE INDEX IF NOT EXISTS uk_tag_name ON tag(name) WHERE deleted_at IS NULL;",
  "CREATE INDEX IF NOT EXISTS idx_tag_updated_at ON tag(updated_at);",
  "CREATE INDEX IF NOT EXISTS idx_tag_created_at ON tag(created_at);",
  "CREATE INDEX IF NOT EXISTS idx_tag_mapping_tag ON tag_mapping(tag_id) WHERE deleted_at IS NULL;",
  "CREATE INDEX IF NOT EXISTS idx_tag_mapping_item ON tag_mapping(item_type, item_id) WHERE deleted_at IS NULL;",
  "CREATE UNIQUE INDEX IF NOT EXISTS uk_tag_mapping ON tag_mapping(tag_id, item_id, item_type) WHERE deleted_at IS NULL;",
];

let lastTs = 0;

export function now() {
  const t = Date.now();
  if (t <= lastTs) {
    lastTs += 1;
    return lastTs;
  }
  lastTs = t;
  return t;
}

export function newId() {
  const bytes = new Uint8Array(16);
  globalThis.crypto.getRandomValues(bytes);
  let ts = Date.now();
  for (let i = 5; i >= 0; i--) {
    bytes[i] = ts % 256;
    ts = Math.floor(ts / 256);
  }
  bytes[6] = (bytes[6] & 0x0f) | 0x70;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, function (b) {
    return b.toString(16).padStart(2, "0");
  }).join("");
  return hex.slice(0, 8) + "-" + hex.slice(8, 12) + "-" + hex.slice(12, 16) + "-" + hex.slice(16, 20) + "-" + hex.slice(20);
}

export function idOf(v) {
  if (v === undefined || v === null || v === "") return "";
  return String(v);
}

export function tableExists(db, name) {
  try {
    return !!db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name=?").get(String(name));
  } catch {
    return false;
  }
}

function quoteIdent(name) {
  return '"' + String(name).replace(/"/g, '""') + '"';
}

export function columnsOf(db, name) {
  if (!tableExists(db, name)) return [];
  try {
    return db.prepare("PRAGMA table_info(" + quoteIdent(name) + ")").all().map(function (r) {
      return String(r.name);
    });
  } catch {
    return [];
  }
}

export function hasColumn(db, table, column) {
  return columnsOf(db, table).indexOf(column) >= 0;
}

export function tx(db, fn) {
  db.exec("BEGIN IMMEDIATE");
  try {
    const result = fn();
    db.exec("COMMIT");
    return result;
  } catch (e) {
    try {
      db.exec("ROLLBACK");
    } catch {
      /* ignore rollback failure */
    }
    throw e;
  }
}

export function logChange(db, table, rowId, op, payload, origin, ts) {
  if (String(origin || "ui") === "sync") return;
  const p = payload === undefined ? null : typeof payload === "string" ? payload : JSON.stringify(payload);
  db.prepare(
    "INSERT INTO sync_change_log(table_name,row_id,op,payload,origin,updated_at) VALUES(?,?,?,?,?,?)",
  ).run(String(table), String(rowId), String(op), p, String(origin || "ui"), Number(ts || now()));
}

export function formatTime(ms) {
  if (!ms) return "";
  const d = new Date(Number(ms));
  if (Number.isNaN(d.getTime())) return "";
  return (
    d.getFullYear() +
    "-" +
    String(d.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(d.getDate()).padStart(2, "0") +
    " " +
    String(d.getHours()).padStart(2, "0") +
    ":" +
    String(d.getMinutes()).padStart(2, "0")
  );
}

export function rowTag(row) {
  if (!row) return null;
  return {
    id: String(row.id),
    name: String(row.name || ""),
    createTime: formatTime(row.created_at),
    updateTime: formatTime(row.updated_at),
    createdAt: Number(row.created_at || 0),
    updatedAt: Number(row.updated_at || 0),
  };
}

/**
 * v2 表使用 is_deleted/update_time/create_time；如果导入的是这种结构，
 * 先改名保留，再按平台列重建并搬数据。旧表保留为 tag_legacy_v2_<ts>。
 */
function migrateV2(db, log) {
  const plans = [];
  for (const table of [TAG_TABLE, MAPPING_TABLE]) {
    if (!tableExists(db, table)) continue;
    if (hasColumn(db, table, "updated_at")) continue;
    if (!hasColumn(db, table, "update_time")) {
      log("tag addon: 跳过未知结构表 " + table);
      continue;
    }
    const legacy = table + "_legacy_v2_" + Date.now();
    db.exec("ALTER TABLE " + quoteIdent(table) + " RENAME TO " + quoteIdent(legacy));
    const indexes = db
      .prepare("SELECT name FROM sqlite_master WHERE type='index' AND tbl_name=? AND name NOT LIKE 'sqlite_%'")
      .all(legacy);
    for (const idx of indexes) db.exec("DROP INDEX IF EXISTS " + quoteIdent(idx.name));
    plans.push({ table: table, legacy: legacy });
    log("tag addon: 检测到 v2 表 " + table + "，已改名为 " + legacy);
  }
  return plans;
}

function copyV2Rows(db, plan, log) {
  try {
    if (plan.table === TAG_TABLE) {
      db.exec(
        "INSERT INTO tag(id,name,created_at,updated_at,deleted_at,rev) " +
          "SELECT id,name,create_time,update_time,CASE WHEN is_deleted<>0 THEN update_time ELSE NULL END,1 FROM " +
          quoteIdent(plan.legacy),
      );
    } else {
      db.exec(
        "INSERT INTO tag_mapping(id,tag_id,item_id,item_type,created_at,updated_at,deleted_at,rev) " +
          "SELECT id,tag_id,item_id,item_type,create_time,update_time,CASE WHEN is_deleted<>0 THEN update_time ELSE NULL END,1 FROM " +
          quoteIdent(plan.legacy),
      );
    }
  } catch (e) {
    log("tag addon: 旧表数据搬迁失败（已保留原表 " + plan.legacy + "）：" + String((e && e.message) || e));
  }
}

export function ensureSchema(db, log) {
  const logger = typeof log === "function" ? log : function () {};
  const plans = migrateV2(db, logger);
  for (const sql of TAG_TABLE_DDL) db.exec(sql);
  for (const plan of plans) copyV2Rows(db, plan, logger);
  for (const sql of TAG_INDEX_DDL) {
    try {
      db.exec(sql);
    } catch (e) {
      logger("tag addon: 索引创建失败（可能旧数据重名）：" + String((e && e.message) || e));
    }
  }
}
