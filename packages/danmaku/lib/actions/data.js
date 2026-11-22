"use strict";
// 数据页的两个只读 action：表清单与分页查询，表名/列名全走白名单。

import { DOMAIN } from "../config.js";

const TABLES = [{ name: "danmaku", zh: "弹幕", en: "Danmaku" }];

const COLUMN_LABELS = {
  id: { zh: "ID", en: "ID" },
  body: { zh: "内容", en: "Body" },
  tone: { zh: "颜色", en: "Tone" },
  enabled: { zh: "启用", en: "Enabled" },
  card: { zh: "卡片背景", en: "Card" },
  font_size: { zh: "字号", en: "Font size" },
  speed: { zh: "速度", en: "Speed" },
  opacity: { zh: "不透明度", en: "Opacity" },
  font_weight: { zh: "字重", en: "Weight" },
  font_family: { zh: "字体", en: "Typeface" },
  band: { zh: "泳道区域", en: "Lane area" },
  prefix: { zh: "前缀", en: "Prefix" },
  chance: { zh: "权重", en: "Chance" },
  sort_order: { zh: "顺序", en: "Sort order" },
  created_at: { zh: "创建时间", en: "Created at" },
  updated_at: { zh: "更新时间", en: "Updated at" },
  deleted_at: { zh: "删除时间", en: "Deleted at" },
  rev: { zh: "版本号", en: "Rev" },
};

const SYSTEM_COLUMNS = new Set(["rev", "created_at", "updated_at", "deleted_at"]);
const PAGE_SIZES = [10, 25, 50, 100, 200];
const MAX_TEXT = 100;

function labelOf(name) {
  const hit = COLUMN_LABELS[name];
  return hit ? { zh: hit.zh, en: hit.en } : { zh: name, en: name };
}

function kindOf(name, declared) {
  const type = String(declared || "").toUpperCase();
  if (name === "id" || name.endsWith("_id")) return "id";
  if (name.endsWith("_at") && type === "INTEGER") return "timestamp";
  if (name === "card" || name === "enabled") return "bool";
  if (type === "INTEGER" || type === "REAL") return "number";
  return "text";
}

function pickPageSize(raw) {
  const n = Math.floor(Number(raw));
  if (!Number.isFinite(n) || n <= 0) return 50;
  let best = PAGE_SIZES[0];
  for (const size of PAGE_SIZES) if (Math.abs(size - n) < Math.abs(best - n)) best = size;
  return best;
}

function likeEscape(text) {
  return String(text).slice(0, MAX_TEXT).replace(/[\\%_]/g, (match) => "\\" + match);
}

function toPlain(row) {
  const out = {};
  for (const key of Object.keys(row)) out[key] = typeof row[key] === "bigint" ? Number(row[key]) : row[key];
  return out;
}

export function registerDataActions(api) {
  const db = api.db;

  function columnList(table) {
    try {
      return db.prepare("PRAGMA table_info(" + table + ")").all().map((column) => ({
        name: column.name,
        type: String(column.type || ""),
        kind: kindOf(column.name, column.type),
        label: labelOf(column.name),
        system: SYSTEM_COLUMNS.has(column.name),
        pk: Boolean(column.pk),
      }));
    } catch (error) {
      return [];
    }
  }

  function tableMeta() {
    return TABLES.map((def) => {
      const columns = columnList(def.name);
      let count = 0;
      let deletedCount = 0;
      try {
        const row = db
          .prepare("SELECT COUNT(*) AS total, SUM(CASE WHEN deleted_at IS NULL THEN 1 ELSE 0 END) AS live FROM " + def.name)
          .get();
        count = Number(row && row.live) || 0;
        deletedCount = Math.max(0, (Number(row && row.total) || 0) - count);
      } catch (error) {
        count = 0;
      }
      return { name: def.name, label: { zh: def.zh, en: def.en }, columns, count, deletedCount };
    });
  }

  api.action("danmaku.dataTables", {
    description: "只读：弹幕插件负责的表清单、列元信息与行数",
    input: { type: "object", properties: {}, additionalProperties: false },
    execute: () => ({ domain: DOMAIN, tables: tableMeta() }),
    render: (r) => `弹幕数据表 ${r.tables.map((t) => t.name + "(" + t.count + ")").join("、")}`,
  });

  api.action("danmaku.dataQuery", {
    description: "只读：分页查询弹幕表；表名、排序列、筛选列都走白名单",
    input: {
      type: "object",
      properties: {
        table: { type: "string", description: "表名，目前只有 danmaku" },
        page: { type: "number", description: "页码，从 1 开始，默认 1" },
        pageSize: { type: "number", description: "每页数量，取 10/25/50/100/200 中最近的值，默认 50" },
        sort: { type: "string", description: "排序列名（必须是真实列）" },
        order: { type: "string", enum: ["asc", "desc"], description: "排序方向，默认 desc" },
        search: { type: "string", description: "按弹幕内容模糊搜索" },
        filters: { type: "object", description: "逐列包含筛选：{列名: 值}" },
        includeDeleted: { type: "boolean", description: "包含已软删的行" },
      },
      required: ["table"],
      additionalProperties: false,
    },
    execute: (args) => {
      const def = TABLES.find((row) => row.name === String(args.table || ""));
      if (!def) throw new Error("未知数据表：" + String(args.table || ""));
      const columns = columnList(def.name);
      const names = columns.map((column) => column.name);
      const pageSize = pickPageSize(args.pageSize === undefined ? 50 : args.pageSize);
      const page = Math.max(1, Number(args.page) || 1);
      const order = args.order === "asc" ? "asc" : "desc";
      const sort = args.sort && names.indexOf(String(args.sort)) >= 0 ? String(args.sort) : "created_at";
      const where = [];
      const params = [];
      if (args.includeDeleted !== true) where.push("deleted_at IS NULL");
      const search = String(args.search || "").trim().slice(0, MAX_TEXT);
      if (search) {
        where.push("instr(lower(body), lower(?)) > 0");
        params.push(search);
      }
      const filters = args.filters && typeof args.filters === "object" && !Array.isArray(args.filters) ? args.filters : {};
      for (const key of Object.keys(filters)) {
        if (names.indexOf(key) < 0) throw new Error("未知筛选列：" + key);
        const value = filters[key];
        if (value === undefined || value === null) continue;
        const text = String(value).trim().slice(0, MAX_TEXT);
        if (!text) continue;
        where.push("CAST(" + key + " AS TEXT) LIKE ? ESCAPE '\\'");
        params.push("%" + likeEscape(text) + "%");
      }
      const whereSql = where.length ? where.join(" AND ") : "1=1";
      const total = Number(db.prepare("SELECT COUNT(*) AS n FROM " + def.name + " WHERE " + whereSql).get(...params).n);
      const rows = db
        .prepare(
          "SELECT * FROM " + def.name + " WHERE " + whereSql + " ORDER BY " + sort + " " + order + ", id " + order + " LIMIT ? OFFSET ?",
        )
        .all(...params, pageSize, (page - 1) * pageSize)
        .map(toPlain);
      return {
        table: def.name,
        columns,
        rows,
        total,
        page,
        pageSize,
        pages: Math.max(1, Math.ceil(total / pageSize)),
        sort,
        order,
      };
    },
    render: (r) => `表 ${r.table} 共 ${r.total} 行，第 ${r.page}/${r.pages} 页返回 ${r.rows.length} 行`,
  });
}
