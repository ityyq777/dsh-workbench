/**
 * 站点子插件：schema、迁移、通用行转换。
 *
 * 全部业务数据在本地 SQLite；云端只负责备份。
 * 目录树使用邻接表 + 路径枚举（path）+ sort + depth，根节点是虚拟的 0，不落库。
 * 标签本体与 tag_mapping 归 wb-addon-tags 所有；本插件只读写 item_type='site' 的映射。
 */

export const SITE_TABLE = "site";
export const NODE_TABLE = "site_node";
export const NODE_MAPPING_TABLE = "site_node_mapping";

export const SITE_DDL = [
  "CREATE TABLE IF NOT EXISTS site (" +
    "id TEXT PRIMARY KEY," +
    "site_name TEXT NOT NULL DEFAULT '未命名'," +
    "description TEXT NOT NULL DEFAULT ''," +
    "bindable INTEGER NOT NULL DEFAULT 1," +
    "site_link TEXT," +
    "created_at INTEGER NOT NULL," +
    "updated_at INTEGER NOT NULL," +
    "deleted_at INTEGER," +
    "rev INTEGER NOT NULL DEFAULT 1" +
    ");",
  "CREATE INDEX IF NOT EXISTS idx_site_updated_at ON site(updated_at);",
  "CREATE INDEX IF NOT EXISTS idx_site_created_at ON site(created_at);",
  "CREATE INDEX IF NOT EXISTS idx_site_name ON site(site_name);",
];

export const NODE_DDL = [
  "CREATE TABLE IF NOT EXISTS site_node (" +
    "id TEXT PRIMARY KEY," +
    "name TEXT NOT NULL," +
    "parent_id TEXT NOT NULL DEFAULT '0'," +
    "path TEXT NOT NULL," +
    "sort INTEGER NOT NULL DEFAULT 0," +
    "depth INTEGER NOT NULL DEFAULT 0," +
    "created_at INTEGER NOT NULL," +
    "updated_at INTEGER NOT NULL," +
    "deleted_at INTEGER," +
    "rev INTEGER NOT NULL DEFAULT 1" +
    ");",
  "CREATE INDEX IF NOT EXISTS idx_site_node_parent ON site_node(parent_id);",
  "CREATE INDEX IF NOT EXISTS idx_site_node_path ON site_node(path);",
  "CREATE INDEX IF NOT EXISTS idx_site_node_sort ON site_node(parent_id, sort);",
];

export const NODE_MAPPING_DDL = [
  "CREATE TABLE IF NOT EXISTS site_node_mapping (" +
    "id TEXT PRIMARY KEY," +
    "site_id TEXT NOT NULL," +
    "node_id TEXT NOT NULL," +
    "created_at INTEGER NOT NULL," +
    "updated_at INTEGER NOT NULL," +
    "deleted_at INTEGER," +
    "rev INTEGER NOT NULL DEFAULT 1" +
    ");",
  "CREATE INDEX IF NOT EXISTS idx_site_node_mapping_site ON site_node_mapping(site_id);",
  "CREATE INDEX IF NOT EXISTS idx_site_node_mapping_node ON site_node_mapping(node_id);",
  "CREATE UNIQUE INDEX IF NOT EXISTS uk_site_node_mapping ON site_node_mapping(site_id, node_id) WHERE deleted_at IS NULL;",
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

export function metaGet(db, key) {
  try {
    const row = db.prepare("SELECT v FROM meta WHERE k=?").get(String(key));
    return row ? String(row.v) : null;
  } catch {
    return null;
  }
}

export function metaSet(db, key, value) {
  db.prepare("INSERT INTO meta(k,v) VALUES(?,?) ON CONFLICT(k) DO UPDATE SET v=excluded.v").run(String(key), String(value));
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
  const n = Number(ms);
  if (!Number.isFinite(n) || n <= 0) return "";
  const d = new Date(n);
  const pad = function (x) { return String(x).padStart(2, "0"); };
  return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()) + " " + pad(d.getHours()) + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds());
}

export function parseLinks(raw) {
  if (!raw) return [];
  try {
    const data = typeof raw === "string" ? JSON.parse(raw) : raw;
    if (!Array.isArray(data)) return [];
    return data.map(function (item) {
      const x = item && typeof item === "object" ? item : {};
      return {
        description: x.description === undefined || x.description === null ? "" : String(x.description),
        link: x.link === undefined || x.link === null ? "" : String(x.link),
        isDefault: x.isDefault === true || x.is_default === true,
      };
    });
  } catch {
    return [];
  }
}

export function encodeLinks(links) {
  const list = Array.isArray(links) ? links : [];
  const clean = [];
  let defaultSeen = false;
  for (const item of list) {
    const x = item && typeof item === "object" ? item : {};
    const link = x.link === undefined || x.link === null ? "" : String(x.link).trim();
    const description = x.description === undefined || x.description === null ? "" : String(x.description).trim();
    let isDefault = x.isDefault === true;
    if (isDefault && defaultSeen) isDefault = false;
    if (isDefault) defaultSeen = true;
    clean.push({ description: description, link: link, isDefault: isDefault });
  }
  return clean.length ? JSON.stringify(clean) : null;
}

export function defaultLinkOf(links) {
  const list = Array.isArray(links) ? links : [];
  for (const l of list) {
    if (l && l.isDefault && l.link) return String(l.link);
  }
  for (const l of list) {
    if (l && l.link) return String(l.link);
  }
  return "";
}

export function rowSite(row, links) {
  if (!row) return null;
  const siteLinks = Array.isArray(links) ? links : parseLinks(row.site_link);
  return {
    id: String(row.id),
    key: String(row.id),
    siteName: String(row.site_name || ""),
    description: row.description === undefined || row.description === null ? "" : String(row.description),
    bindable: Number(row.bindable) === 0 ? 0 : 1,
    siteLinks: siteLinks,
    defaultLink: defaultLinkOf(siteLinks),
    createTime: formatTime(row.created_at),
    updateTime: formatTime(row.updated_at),
    createdAt: Number(row.created_at),
    updatedAt: Number(row.updated_at),
    tags: [],
    dirs: [],
  };
}

export function rowNode(row, children) {
  if (!row) return null;
  return {
    id: String(row.id),
    name: String(row.name || ""),
    parent: String(row.parent_id || "0"),
    parentId: String(row.parent_id || "0"),
    path: String(row.path || ""),
    sort: Number(row.sort || 0),
    depth: Number(row.depth || 0),
    children: Array.isArray(children) ? children : [],
  };
}

export function childrenOf(db, parentId) {
  return db.prepare(
    "SELECT * FROM site_node WHERE parent_id=? AND deleted_at IS NULL ORDER BY sort ASC, id ASC",
  ).all(String(parentId));
}

export function nodeById(db, id, includeDeleted) {
  const key = idOf(id);
  if (!key) return null;
  const sql = "SELECT * FROM site_node WHERE id=?" + (includeDeleted ? "" : " AND deleted_at IS NULL");
  return db.prepare(sql).get(key) || null;
}

export function subtreeRows(db, node) {
  return db.prepare(
    "SELECT * FROM site_node WHERE deleted_at IS NULL AND path LIKE ? ORDER BY depth ASC, sort ASC, id ASC",
  ).all(String(node.path) + "%");
}

export function subtreeIds(db, node) {
  return subtreeRows(db, node).map(function (r) { return String(r.id); });
}

export function insertNode(db, row) {
  db.prepare(
    "INSERT INTO site_node(id,name,parent_id,path,sort,depth,created_at,updated_at,deleted_at,rev) " +
      "VALUES(?,?,?,?,?,?,?,?,?,?)",
  ).run(
    String(row.id),
    String(row.name),
    String(row.parent_id || "0"),
    String(row.path),
    Number(row.sort || 0),
    Number(row.depth || 0),
    Number(row.created_at || now()),
    Number(row.updated_at || row.created_at || now()),
    row.deleted_at === undefined ? null : row.deleted_at,
    Number(row.rev || 1),
  );
}

export function ensureSchema(db, log) {
  if (!tableExists(db, "meta")) {
    db.exec("CREATE TABLE IF NOT EXISTS meta (k TEXT PRIMARY KEY, v TEXT NOT NULL);");
  }
  // 目前没有旧版 site 表；若检测到旧结构，拒绝混用而不是静默破坏数据。
  if (tableExists(db, SITE_TABLE)) {
    const cols = columnsOf(db, SITE_TABLE);
    if (cols.indexOf("created_at") < 0 || cols.indexOf("updated_at") < 0 || cols.indexOf("rev") < 0) {
      throw new Error("检测到旧版 site 表结构，当前迁移器尚未覆盖，请先备份 workbench.db");
    }
  }
  if (tableExists(db, NODE_TABLE)) {
    const cols = columnsOf(db, NODE_TABLE);
    if (cols.indexOf("parent_id") < 0 || cols.indexOf("path") < 0) {
      throw new Error("检测到旧版 site_node（MPTT）表结构，当前迁移器尚未覆盖，请先备份 workbench.db");
    }
  }
  for (const sql of SITE_DDL) db.exec(sql);
  for (const sql of NODE_DDL) db.exec(sql);
  for (const sql of NODE_MAPPING_DDL) db.exec(sql);
  if (log) log("sites schema ready");
}

export function hasTagDomain(db) {
  return tableExists(db, "tag") && tableExists(db, "tag_mapping");
}
