/**
 * 标签 action：纯本地读写，所有方法都不做网络请求。
 *
 * 对齐 _archive/sheepone-system/sheepone-tag：
 *  - GET /tag（分页、按 update_time desc）
 *  - POST /tag（name 非空、重名拒绝）
 *  - DELETE /tag?id=（物理删改软删）
 *  - 前端额外依赖 GET /tag/search（旧后端缺失），这里补成本地搜索
 * tag_mapping 预留给后续 site 模块：tag_id × item_id × item_type。
 */

import {
  TAG_TABLE,
  MAPPING_TABLE,
  now,
  newId,
  idOf,
  tx,
  logChange,
  rowTag,
  formatTime,
} from "./db.js";

const DEFAULT_PAGE_SIZE = 18;
const MAX_PAGE_SIZE = 200;
const MAX_NAME = 64;

function pageArgs(args) {
  const rawPage = args.pageNumber !== undefined ? args.pageNumber : args.current !== undefined ? args.current : args.page;
  const rawSize = args.pageSize !== undefined ? args.pageSize : args.size;
  let pageNumber = Number(rawPage === undefined || rawPage === null || rawPage === "" ? 1 : rawPage);
  let pageSize = Number(rawSize === undefined || rawSize === null || rawSize === "" ? DEFAULT_PAGE_SIZE : rawSize);
  if (!Number.isFinite(pageNumber)) pageNumber = 1;
  if (!Number.isFinite(pageSize)) pageSize = DEFAULT_PAGE_SIZE;
  pageNumber = Math.floor(pageNumber);
  pageSize = Math.floor(pageSize);
  if (pageNumber < 1) throw new Error("pageNumber 必须从 1 开始");
  if (pageSize < 1) throw new Error("pageSize 必须大于 0");
  if (pageSize > MAX_PAGE_SIZE) pageSize = MAX_PAGE_SIZE;
  return { pageNumber: pageNumber, pageSize: pageSize };
}

function textArg(args) {
  const v = args.text !== undefined ? args.text : args.keyword !== undefined ? args.keyword : args.q;
  return String(v === undefined || v === null ? "" : v).trim();
}

function getTag(db, id) {
  const key = idOf(id);
  if (!key) return null;
  return db.prepare("SELECT * FROM tag WHERE id=? AND deleted_at IS NULL").get(key) || null;
}

function getTagByName(db, name) {
  return db.prepare("SELECT * FROM tag WHERE name=? AND deleted_at IS NULL").get(String(name)) || null;
}

function listTags(db, args) {
  const { pageNumber, pageSize } = pageArgs(args || {});
  const text = textArg(args || {});
  const where = text ? "deleted_at IS NULL AND instr(lower(name), lower(?)) > 0" : "deleted_at IS NULL";
  const countStmt = db.prepare("SELECT COUNT(*) AS n FROM tag WHERE " + where);
  const total = Number((text ? countStmt.get(text) : countStmt.get()).n || 0);
  const rows = text
    ? db.prepare("SELECT * FROM tag WHERE " + where + " ORDER BY updated_at DESC, created_at DESC LIMIT ? OFFSET ?").all(text, pageSize, (pageNumber - 1) * pageSize)
    : db.prepare("SELECT * FROM tag WHERE " + where + " ORDER BY updated_at DESC, created_at DESC LIMIT ? OFFSET ?").all(pageSize, (pageNumber - 1) * pageSize);
  return {
    current: pageNumber,
    size: pageSize,
    total: total,
    pages: total ? Math.ceil(total / pageSize) : 0,
    pageable: true,
    records: rows.map(rowTag),
    text: text,
  };
}

function createTag(db, args, origin, api) {
  const name = String(args && args.name !== undefined && args.name !== null ? args.name : "").trim();
  if (!name) throw new Error("标签名称不能为空");
  if (name.length > MAX_NAME) throw new Error("标签名称不能超过 " + MAX_NAME + " 个字符");
  if (getTagByName(db, name)) throw new Error("标签已存在");
  const ts = now();
  const id = newId();
  try {
    db.prepare("INSERT INTO tag(id,name,created_at,updated_at,deleted_at,rev) VALUES(?,?,?,?,NULL,1)").run(id, name, ts, ts);
  } catch (e) {
    if (String((e && e.message) || e).indexOf("UNIQUE") >= 0) throw new Error("标签已存在");
    throw e;
  }
  const row = getTag(db, id);
  logChange(db, TAG_TABLE, id, "upsert", rowTag(row), origin, ts);
  api.emit("tags-changed", { id: id, op: "create", name: name });
  return { id: id, tag: rowTag(row) };
}

function deleteTag(db, args, origin, api) {
  const id = idOf(args && args.id);
  if (!id) throw new Error("id 不能为空");
  const row = getTag(db, id);
  if (!row) return { id: id, deleted: true, missing: true, removedMappings: 0 };
  const ts = now();
  const mappings = db.prepare("SELECT * FROM tag_mapping WHERE tag_id=? AND deleted_at IS NULL").all(id);
  tx(db, function () {
    db.prepare("UPDATE tag SET deleted_at=?, updated_at=?, rev=rev+1 WHERE id=?").run(ts, ts, id);
    db.prepare("UPDATE tag_mapping SET deleted_at=?, updated_at=?, rev=rev+1 WHERE tag_id=? AND deleted_at IS NULL").run(ts, ts, id);
    for (const m of mappings) {
      logChange(db, MAPPING_TABLE, String(m.id), "delete", null, origin, ts);
    }
    logChange(db, TAG_TABLE, id, "delete", null, origin, ts);
  });
  api.emit("tags-changed", { id: id, op: "delete", name: String(row.name || "") });
  return { id: id, deleted: true, missing: false, removedMappings: mappings.length };
}

function byIds(db, args) {
  let ids = args && args.ids !== undefined ? args.ids : args && args.id;
  if (typeof ids === "string") ids = ids.split(",");
  if (!Array.isArray(ids)) ids = [];
  const clean = [];
  for (const raw of ids) {
    const id = idOf(raw);
    if (id && clean.indexOf(id) < 0 && clean.length < 500) clean.push(id);
  }
  if (!clean.length) return { records: [] };
  const marks = clean.map(function () { return "?"; }).join(",");
  const rows = db.prepare("SELECT * FROM tag WHERE deleted_at IS NULL AND id IN (" + marks + ") ORDER BY updated_at DESC").all(...clean);
  return { records: rows.map(rowTag) };
}

function renderList(result) {
  const r = result || {};
  const records = Array.isArray(r.records) ? r.records : [];
  if (!records.length) return "没有标签（共 0 个）";
  const lines = ["标签：共 " + r.total + " 个，第 " + r.current + "/" + (r.pages || 1) + " 页"];
  for (const t of records) {
    lines.push("- " + t.name + " | id=" + t.id + " | 创建于 " + t.createTime);
  }
  return lines.join("\n");
}

function renderOne(result) {
  const t = result && result.tag;
  if (t) return "已创建标签：" + t.name + "（" + t.id + "）";
  return JSON.stringify(result, null, 2);
}

export function registerTagActions(api) {
  const action = api.action;

  action("tags.list", {
    description: "分页列出标签，按更新时间倒序；text 可按名称模糊搜索",
    input: {
      type: "object",
      properties: {
        pageNumber: { type: "number", description: "页码，从 1 开始，默认 1" },
        pageSize: { type: "number", description: "每页数量，默认 18，最大 200" },
        text: { type: "string", description: "标签名称模糊搜索" },
      },
    },
    execute: function (args, ctx) {
      return listTags(api.db, args);
    },
    render: renderList,
  });

  action("tags.search", {
    description: "按名称搜索标签（tags.list 的别名，兼容旧 /tag/search）",
    input: {
      type: "object",
      properties: {
        text: { type: "string", description: "标签名称关键字" },
        pageNumber: { type: "number" },
        pageSize: { type: "number" },
      },
    },
    execute: function (args, ctx) {
      return listTags(api.db, args);
    },
    render: renderList,
  });

  action("tags.create", {
    description: "创建标签；名称为空或重名会报错",
    input: {
      type: "object",
      required: ["name"],
      properties: { name: { type: "string", description: "标签名称，最大 64 字符" } },
    },
    execute: function (args, ctx) {
      return createTag(api.db, args, ctx.origin, api);
    },
    render: renderOne,
  });

  action("tags.delete", {
    description: "软删除标签，并清理该标签的 tag_mapping 关联；数据保留可恢复",
    input: {
      type: "object",
      required: ["id"],
      properties: { id: { type: "string", description: "标签 id" } },
    },
    execute: function (args, ctx) {
      return deleteTag(api.db, args, ctx.origin, api);
    },
    render: function (r) {
      if (r && r.missing) return "标签不存在或已删除：" + r.id;
      return "已删除标签：" + ((r && r.id) || "");
    },
  });

  action("tags.byIds", {
    description: "按 id 批量取标签，供业务模块聚合展示",
    input: {
      type: "object",
      properties: { ids: { type: "array", items: { type: "string" } } },
    },
    execute: function (args, ctx) {
      return byIds(api.db, args);
    },
    render: function (r) {
      const records = (r && r.records) || [];
      return records.length ? records.map(function (t) { return t.name + "(" + t.id + ")"; }).join(", ") : "没有匹配的标签";
    },
  });
}

export { listTags, createTag, deleteTag };
