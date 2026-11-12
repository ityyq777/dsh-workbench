/**
 * 标签插件的数据页：只读浏览本插件负责的表。
 *
 * 设计见 docs/specs/21-数据页设计.md。两个 action：
 * - tags.dataTables：表清单 + 列元信息 + 行数；
 * - tags.dataQuery：分页/排序/关键字过滤，只读，表名与排序列走白名单。
 *
 * 刻意不提供任意 SQL、导出与写操作；meta 与 sync_* 平台表不在此暴露。
 */

import { DOMAIN } from "./config.js";

export const SCHEMA_VERSION = 1;

const TABLES = [
  { name: "tag", zh: "标签", en: "Tags" },
  { name: "tag_mapping", zh: "标签关联", en: "Tag mappings" },
];

const COLUMN_LABELS = {
  id: { zh: "ID", en: "ID" },
  name: { zh: "名称", en: "Name" },
  tag_id: { zh: "标签 ID", en: "Tag ID" },
  item_id: { zh: "对象 ID", en: "Item ID" },
  item_type: { zh: "对象类型", en: "Item type" },
  created_at: { zh: "创建时间", en: "Created at" },
  updated_at: { zh: "更新时间", en: "Updated at" },
  deleted_at: { zh: "删除时间", en: "Deleted at" },
  rev: { zh: "版本号", en: "Rev" },
};

const SYSTEM_COLUMNS = new Set(["rev", "created_at", "updated_at", "deleted_at"]);
const PAGE_SIZES = [10, 25, 50, 100, 200];
const BOOL_COLUMNS = new Set(["bindable", "deleted"]);
const MAX_SEARCH = 100;
const MAX_FILTERS = 20;

function labelOf(name) {
  const hit = COLUMN_LABELS[name];
  return hit ? { zh: hit.zh, en: hit.en } : { zh: name, en: name };
}

function kindOf(name, declared) {
  const type = String(declared || "").toUpperCase();
  if (BOOL_COLUMNS.has(name)) return "bool";
  if (name === "id" || name.endsWith("_id")) return "id";
  if (name === "path") return "path";
  if (name.endsWith("_at") && type === "INTEGER") return "timestamp";
  if (name.endsWith("_date")) return "date";
  if (type === "INTEGER" || type === "REAL") return "number";
  return "text";
}

function pickPageSize(input) {
  const n = Math.floor(Number(input));
  if (!Number.isFinite(n) || n <= 0) return 50;
  let best = PAGE_SIZES[0];
  for (const size of PAGE_SIZES) if (Math.abs(size - n) < Math.abs(best - n)) best = size;
  return best;
}

function likeEscape(text) {
  return String(text).slice(0, MAX_SEARCH).replace(/[\\%_]/g, function (m) { return "\\" + m; });
}

/** 逐列值筛选：{列名: 值}；列名必须是真实列，值按包含匹配（CAST 成文本 LIKE）。 */
function normalizeFilters(raw, names) {
  if (raw === undefined || raw === null) return [];
  if (typeof raw !== "object" || Array.isArray(raw)) throw new Error("filters 需要是 {列名: 值} 对象");
  const keys = Object.keys(raw);
  if (keys.length > MAX_FILTERS) throw new Error("列筛选最多 " + MAX_FILTERS + " 列");
  const out = [];
  for (const key of keys) {
    const column = String(key);
    if (names.indexOf(column) < 0) throw new Error("未知筛选列：" + column);
    const value = raw[key];
    if (value === undefined || value === null) continue;
    const text = String(value).trim().slice(0, MAX_SEARCH);
    if (!text) continue;
    out.push({ column: column, value: text });
  }
  return out;
}

function toPlain(row) {
  const out = {};
  for (const key of Object.keys(row)) {
    const value = row[key];
    out[key] = typeof value === "bigint" ? Number(value) : value;
  }
  return out;
}

export function registerDataActions(api) {
  const db = api.db;

  function columnsOf(table) {
    let info = [];
    try {
      info = db.prepare("PRAGMA table_info(" + table + ")").all();
    } catch (e) {
      info = [];
    }
    return info.map(function (c) {
      return {
        name: c.name,
        type: String(c.type || ""),
        kind: kindOf(c.name, c.type),
        label: labelOf(c.name),
        system: SYSTEM_COLUMNS.has(c.name),
        pk: !!c.pk,
      };
    });
  }

  function countsOf(table, hasDeleted) {
    if (!hasDeleted) {
      const row = db.prepare("SELECT COUNT(*) AS n FROM " + table).get();
      const n = Number(row && row.n) || 0;
      return { count: n, deletedCount: 0 };
    }
    const row = db.prepare(
      "SELECT COUNT(*) AS total, SUM(CASE WHEN deleted_at IS NULL THEN 1 ELSE 0 END) AS live FROM " + table,
    ).get();
    const total = Number(row && row.total) || 0;
    const live = row && row.live === null ? 0 : Number(row && row.live) || 0;
    return { count: live, deletedCount: Math.max(0, total - live) };
  }

  /**
   * 表结构统计（「表索引」视图）：行数、列数、主键、索引、最近写入。
   * 只读 PRAGMA 与 COUNT/MAX，不做任何写操作；表缺失时返回零值而不是报错，
   * 这样单个表迁移失败不会让整页不可用。
   */
  function tableStatsOf(table) {
    const out = { rows: 0, primaryKey: [], indexes: [], lastWrite: null };
    try {
      out.rows = Number(db.prepare("SELECT COUNT(*) AS n FROM " + table).get().n) || 0;
    } catch (e) {
      /* 表缺失：保持 0 */
    }
    let info = [];
    try {
      info = db.prepare("PRAGMA table_info(" + table + ")").all();
    } catch (e) {
      info = [];
    }
    out.columnCount = info.length;
    out.primaryKey = info
      .filter(function (c) { return Number(c.pk) > 0; })
      .sort(function (colA, colB) { return Number(colA.pk) - Number(colB.pk); })
      .map(function (c) { return c.name; });
    try {
      out.indexes = db.prepare("PRAGMA index_list(" + table + ")").all().map(function (ix) {
        let cols = [];
        try {
          cols = db.prepare("PRAGMA index_info(" + JSON.stringify(String(ix.name)) + ")").all().map(function (c) { return c.name; });
        } catch (e) {
          cols = [];
        }
        return { name: String(ix.name), unique: Number(ix.unique) === 1, origin: String(ix.origin || "c"), columns: cols };
      });
    } catch (e) {
      out.indexes = [];
    }
    const stampCols = ["updated_at", "created_at", "publish_date", "done_date", "target_date"];
    for (let i = 0; i < stampCols.length; i += 1) {
      const hit = info.filter(function (c) { return c.name === stampCols[i]; })[0];
      if (!hit) continue;
      try {
        const row = db.prepare("SELECT MAX(" + hit.name + ") AS v FROM " + table).get();
        const v = row && row.v;
        if (v !== null && v !== undefined && String(v) !== "") {
          out.lastWrite = { column: hit.name, at: v };
          break;
        }
      } catch (e) {
        /* 单列统计失败不影响其它信息 */
      }
    }
    return out;
  }

  function tablesPayload(rawArgs) {
    const args = rawArgs || {};
    const withStats = args.stats === true;
    const warnings = [];
    const tables = TABLES.map(function (t) {
      const columns = columnsOf(t.name);
      let counts = { count: 0, deletedCount: 0 };
      if (!columns.length) {
        warnings.push({ code: "table_missing", message: "数据表不存在：" + t.name });
      } else {
        try {
          counts = countsOf(t.name, columns.some(function (c) { return c.name === "deleted_at"; }));
        } catch (e) {
          warnings.push({ code: "count_failed", message: t.name + " 行数统计失败：" + String(e && e.message || e) });
        }
      }
      const row = { name: t.name, label: { zh: t.zh, en: t.en }, count: counts.count, deletedCount: counts.deletedCount, columns };
      if (withStats && columns.length) row.stats = tableStatsOf(t.name);
      return row;
    });
    return { domain: DOMAIN, schemaVersion: SCHEMA_VERSION, tables, warnings };
  }

  function findTable(name) {
    return TABLES.filter(function (t) { return t.name === name; })[0] || null;
  }

  function queryPayload(raw) {
    const args = raw || {};
    const named = String(args.table || "");
    const table = findTable(named);
    if (!table) throw new Error("未知数据表：" + named);

    const columns = columnsOf(table.name);
    if (!columns.length) {
      return {
        domain: DOMAIN, table: table.name, columns: [], rows: [],
        page: 1, pageSize: pickPageSize(args.pageSize), pages: 1, total: 0,
        sort: "id", order: "desc", includeDeleted: !!args.includeDeleted,
        search: "", filters: [], queryMs: 0,
        warnings: [{ code: "table_missing", message: "数据表不存在：" + table.name }],
      };
    }

    const names = columns.map(function (c) { return c.name; });
    const hasDeleted = names.indexOf("deleted_at") >= 0;
    const fallbackSort = names.indexOf("created_at") >= 0 ? "created_at" : (names.indexOf("id") >= 0 ? "id" : names[0]);
    let sort = String(args.sort || fallbackSort);
    if (names.indexOf(sort) < 0) throw new Error("未知排序列：" + sort);
    const order = String(args.order || "desc").toLowerCase() === "asc" ? "asc" : "desc";

    const pageSize = pickPageSize(args.pageSize);
    const includeDeleted = !!args.includeDeleted;
    const search = typeof args.search === "string" ? args.search.trim().slice(0, MAX_SEARCH) : "";
    const filters = normalizeFilters(args.filters, names);

    const where = [];
    const params = [];
    if (!includeDeleted && hasDeleted) where.push("deleted_at IS NULL");
    if (search) {
      const textCols = columns.filter(function (c) { return String(c.type).toUpperCase() === "TEXT"; });
      if (textCols.length) {
        where.push("(" + textCols.map(function (c) { return c.name + " LIKE ? ESCAPE '\\'"; }).join(" OR ") + ")");
        const hit = "%" + likeEscape(search) + "%";
        for (let i = 0; i < textCols.length; i++) params.push(hit);
      }
    }
    for (let i = 0; i < filters.length; i++) {
      where.push("CAST(" + filters[i].column + " AS TEXT) LIKE ? ESCAPE '\\'");
      params.push("%" + likeEscape(filters[i].value) + "%");
    }
    const whereSql = where.length ? " WHERE " + where.join(" AND ") : "";
    const started = (typeof performance !== "undefined" && performance.now ? performance.now() : Date.now());

    const countStmt = db.prepare("SELECT COUNT(*) AS n FROM " + table.name + whereSql);
    const total = Number(countStmt.get.apply(countStmt, params).n) || 0;
    const pages = Math.max(1, Math.ceil(total / pageSize));
    let page = Math.floor(Number(args.page)) || 1;
    if (page < 1) page = 1;
    if (page > pages) page = pages;

    const offset = (page - 1) * pageSize;
    const stmt = db.prepare(
      "SELECT * FROM " + table.name + whereSql + " ORDER BY " + sort + " " + order.toUpperCase() + " LIMIT ? OFFSET ?",
    );
    const rows = stmt.all.apply(stmt, params.concat([pageSize, offset])).map(toPlain);
    const ended = (typeof performance !== "undefined" && performance.now ? performance.now() : Date.now());

    return {
      domain: DOMAIN,
      schemaVersion: SCHEMA_VERSION,
      table: table.name,
      columns: columns.map(function (c) {
        return { name: c.name, type: c.type, kind: c.kind, label: c.label, system: c.system };
      }),
      rows,
      page,
      pageSize,
      pages,
      total,
      sort,
      order,
      includeDeleted,
      search,
      filters,
      queryMs: Math.max(0, Math.round(ended - started)),
    };
  }

  const tableNames = TABLES.map(function (t) { return t.name; });

  api.action("tags.dataTables", {
    description: "列出标签插件负责的数据表、列元信息与行数（只读，供「数据」视图使用）",
    input: {
      type: "object",
      properties: {
        stats: { type: "boolean", description: "true 时附带每表结构统计：行数、列数、主键、索引、最近写入（表索引视图用）" },
      },
    },
    examples: [{}],
    execute: function (args) { return tablesPayload(args); },
    render: function (r) {
      return r.tables.map(function (t) { return t.name + " " + t.count + " 行"; }).join("、");
    },
  });

  api.action("tags.dataQuery", {
    description: "只读分页查询标签插件的数据表：白名单表名/排序列，支持关键字过滤、逐列值筛选与包含已删除行",
    input: {
      type: "object",
      required: ["table"],
      properties: {
        table: { type: "string", enum: tableNames, description: "表名，必须是本插件负责的表" },
        page: { type: "number", description: "页码，从 1 开始，越界自动夹取" },
        pageSize: { type: "number", enum: PAGE_SIZES, description: "每页条数，默认 50，超出就近取档" },
        sort: { type: "string", description: "排序列名，必须是该表真实列；默认 created_at（无则 id）" },
        order: { type: "string", enum: ["asc", "desc"], description: "排序方向，默认 desc" },
        search: { type: "string", description: "关键字，匹配所有 TEXT 列的包含关系，最长 100 字" },
        filters: {
          type: "object",
          description: "逐列值筛选：{列名: 值}，按包含匹配（列值转文本后 LIKE），与其他条件 AND；列名必须是该表真实列，最多 20 列",
          additionalProperties: { type: "string" },
        },
        includeDeleted: { type: "boolean", description: "是否包含已软删除的行，默认 false" },
      },
    },
    examples: [
      { table: "task", page: 1, pageSize: 50, sort: "created_at", order: "desc" },
      { table: "task", search: "发布", includeDeleted: true },
      { table: "task", filters: { id: "01" } },
    ],
    execute: function (args) { return queryPayload(args || {}); },
    render: function (r) {
      var line = r.table + " 第 " + r.page + "/" + r.pages + " 页，共 " + r.total + " 行";
      if (r.filters && r.filters.length) {
        line += "；列筛选：" + r.filters.map(function (f) { return f.column + " 含 \"" + f.value + "\""; }).join(" · ");
      }
      return line;
    },
  });
}
