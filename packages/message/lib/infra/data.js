/**
 * 消息插件的数据页：只读浏览本插件负责的表（message）。
 *
 * 两个 action（消息数据页的数据源，不经过宿主统一接口）：
 * - message.dataTables：表清单 + 列元信息 + 行数/索引统计；
 * - message.dataQuery：分页/排序/关键字过滤，只读，表名与排序列走白名单。
 *
 * 刻意不提供任意 SQL、导出与写操作。
 */

import { DOMAIN } from "./config.js";

export const SCHEMA_VERSION = 1;

const TABLES = [{ name: "message", zh: "消息", en: "Messages" }];

const COLUMN_LABELS = {
  id: { zh: "ID", en: "ID" },
  title: { zh: "标题", en: "Title" },
  body: { zh: "正文", en: "Body" },
  level: { zh: "级别", en: "Level" },
  source: { zh: "来源", en: "Source" },
  audience: { zh: "收件人", en: "Audience" },
  dedupe_key: { zh: "去重键", en: "Dedupe key" },
  meta: { zh: "附加信息", en: "Meta" },
  created_at: { zh: "创建时间", en: "Created at" },
  read_at: { zh: "已读时间", en: "Read at" },
  deleted_at: { zh: "删除时间", en: "Deleted at" },
  rev: { zh: "版本号", en: "Rev" },
};

const SYSTEM_COLUMNS = new Set(["rev", "created_at", "read_at", "deleted_at"]);
const PAGE_SIZES = [10, 25, 50, 100, 200];
const MAX_SEARCH = 100;
const MAX_FILTERS = 20;

function labelOf(name) {
  const hit = COLUMN_LABELS[name];
  return hit ? { zh: hit.zh, en: hit.en } : { zh: name, en: name };
}

function kindOf(name, declared) {
  const type = String(declared || "").toUpperCase();
  if (name === "id" || name.endsWith("_id")) return "id";
  if (name.endsWith("_at") && type === "INTEGER") return "timestamp";
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
  return String(text).slice(0, MAX_SEARCH).replace(/[\\%_]/g, (m) => "\\" + m);
}

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
    if (text) out.push({ column: column, value: text });
  }
  return out;
}

function toPlain(row) {
  const out = {};
  for (const key of Object.keys(row)) out[key] = typeof row[key] === "bigint" ? Number(row[key]) : row[key];
  return out;
}

export function registerDataActions(api) {
  const db = api.db;

  function tableMeta() {
    return TABLES.map((def) => {
      const table = def.name;
      let columns = [];
      try {
        columns = db.prepare("PRAGMA table_info(" + table + ")").all().map((c) => ({
          name: c.name,
          type: String(c.type || ""),
          kind: kindOf(c.name, c.type),
          label: labelOf(c.name),
          system: SYSTEM_COLUMNS.has(c.name),
          pk: !!c.pk,
        }));
      } catch {
        columns = [];
      }
      let count = 0;
      let deletedCount = 0;
      try {
        const row = db
          .prepare("SELECT COUNT(*) AS total, SUM(CASE WHEN deleted_at IS NULL THEN 1 ELSE 0 END) AS live FROM " + table)
          .get();
        count = Number(row && row.live) || 0;
        deletedCount = Math.max(0, (Number(row && row.total) || 0) - count);
      } catch {
        count = 0;
      }
      return { name: table, label: { zh: def.zh, en: def.en }, columns: columns, count: count, deletedCount: deletedCount };
    });
  }

  function tableStats() {
    return TABLES.map((def) => {
      const out = { rows: 0, columnCount: 0, primaryKey: [], indexes: [], lastWrite: null };
      try {
        const info = db.prepare("PRAGMA table_info(" + def.name + ")").all();
        out.columnCount = info.length;
        out.primaryKey = info.filter((c) => c.pk).map((c) => c.name);
        out.rows = Number(db.prepare("SELECT COUNT(*) AS n FROM " + def.name).get().n) || 0;
        out.indexes = db.prepare("PRAGMA index_list(" + def.name + ")").all().map((ix) => ({
          name: ix.name,
          unique: !!ix.unique,
          origin: ix.origin || "c",
        }));
        const last = db.prepare("SELECT MAX(created_at) AS ts FROM " + def.name).get();
        out.lastWrite = last && last.ts ? Number(last.ts) : null;
      } catch {
        /* 表缺失：保持零值 */
      }
      return { name: def.name, stats: out };
    });
  }

  api.action("message.dataTables", {
    description: "只读：消息插件负责的表清单、列元信息、行数与索引统计",
    input: { type: "object", properties: { stats: { type: "boolean", description: "附带索引/主键统计" } } },
    execute: (args) => {
      const tables = tableMeta();
      if (args && args.stats === true) {
        const stats = tableStats();
        for (const table of tables) {
          const hit = stats.find((row) => row.name === table.name);
          table.stats = hit ? hit.stats : null;
        }
      }
      return { domain: DOMAIN, tables: tables };
    },
    render: (r) => "消息数据表 " + r.tables.length + " 张：" + r.tables.map((t) => t.name + "(" + t.count + ")").join("、"),
  });

  api.action("message.dataQuery", {
    description: "只读：分页查询消息表；表名/排序列/筛选列都走白名单",
    input: {
      type: "object",
      properties: {
        table: { type: "string", description: "表名，目前只有 message" },
        page: { type: "number", description: "页码，从 1 开始，默认 1" },
        pageSize: { type: "number", description: "每页数量，取 10/25/50/100/200 中最近的值，默认 50" },
        sort: { type: "string", description: "排序列名（必须是真实列）" },
        order: { type: "string", enum: ["asc", "desc"], description: "排序方向，默认 desc" },
        search: { type: "string", description: "标题/正文/来源模糊搜索" },
        filters: { type: "object", description: "逐列包含筛选：{列名: 值}" },
        includeDeleted: { type: "boolean", description: "包含已软删的行" },
      },
      required: ["table"],
    },
    execute: (args) => {
      const input = args || {};
      const def = TABLES.find((row) => row.name === String(input.table || ""));
      if (!def) throw new Error("未知数据表：" + String(input.table || ""));
      const columns = tableMeta().find((row) => row.name === def.name).columns;
      const names = columns.map((col) => col.name);
      const pageSize = pickPageSize(input.pageSize === undefined ? 50 : input.pageSize);
      const page = Math.max(1, Number(input.page) || 1);
      const order = input.order === "asc" ? "asc" : "desc";
      const sort = input.sort && names.indexOf(String(input.sort)) >= 0 ? String(input.sort) : "created_at";
      const where = [];
      const params = [];
      if (input.includeDeleted !== true) where.push("deleted_at IS NULL");
      const search = String(input.search || "").trim().slice(0, MAX_SEARCH);
      if (search) {
        where.push("(instr(lower(title), lower(?)) > 0 OR instr(lower(body), lower(?)) > 0 OR instr(lower(source), lower(?)) > 0)");
        params.push(search, search, search);
      }
      for (const item of normalizeFilters(input.filters, names)) {
        where.push("CAST(" + item.column + " AS TEXT) LIKE ? ESCAPE '\\'");
        params.push("%" + likeEscape(item.value) + "%");
      }
      const whereSql = where.length ? where.join(" AND ") : "1=1";
      const total = Number(db.prepare("SELECT COUNT(*) AS n FROM " + def.name + " WHERE " + whereSql).get(...params).n);
      const rows = db
        .prepare("SELECT * FROM " + def.name + " WHERE " + whereSql + " ORDER BY " + sort + " " + order + ", id " + order + " LIMIT ? OFFSET ?")
        .all(...params, pageSize, (page - 1) * pageSize)
        .map(toPlain);
      return {
        table: def.name,
        columns: columns,
        rows: rows,
        total: total,
        page: page,
        pageSize: pageSize,
        pages: Math.max(1, Math.ceil(total / pageSize)),
        sort: sort,
        order: order,
      };
    },
    render: (r) => "表 " + r.table + " 共 " + r.total + " 行，第 " + r.page + "/" + r.pages + " 页返回 " + r.rows.length + " 行。",
  });
}
