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
  const ts = now();
  const id = newId();
  db.prepare("INSERT INTO tag(id,name,created_at,updated_at,deleted_at,rev) VALUES(?,?,?,?,NULL,1)").run(id, name, ts, ts);
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
      const tomb = Object.assign({}, m, { deleted_at: ts, updated_at: ts, rev: Number(m.rev) + 1 });
      logChange(db, MAPPING_TABLE, String(m.id), "delete", tomb, origin, ts);
    }
    const tomb = Object.assign({}, row, { deleted_at: ts, updated_at: ts, rev: Number(row.rev) + 1 });
    logChange(db, TAG_TABLE, id, "delete", tomb, origin, ts);
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

function itemTypeArg(args) {
  const type = String(args && args.itemType !== undefined && args.itemType !== null ? args.itemType : "task").trim();
  if (!type) throw new Error("itemType 不能为空");
  if (type.length > 32) throw new Error("itemType 不能超过 32 个字符");
  return type;
}

function idListArg(raw, label) {
  let list = raw;
  if (typeof list === "string") list = list.split(",");
  if (!Array.isArray(list)) list = [];
  const out = [];
  for (const item of list) {
    const id = idOf(item);
    if (id && out.indexOf(id) < 0 && out.length < 500) out.push(id);
  }
  if (!out.length && label !== "tagIds") throw new Error(label + " 不能为空");
  return out;
}

function mapRow(row) {
  return {
    id: String(row.id),
    tagId: String(row.tag_id),
    itemId: String(row.item_id),
    itemType: String(row.item_type),
  };
}

function linkTags(db, args, origin, api) {
  const itemType = itemTypeArg(args);
  const tagIds = idListArg(args.tagIds, "tagIds");
  const itemIds = idListArg(args.itemIds !== undefined ? args.itemIds : args.itemId, "itemIds");
  if (!tagIds.length) throw new Error("tagIds 不能为空");
  const ts = now();
  const linked = [];
  const skipped = [];
  tx(db, function () {
    for (const itemId of itemIds) {
      for (const tagId of tagIds) {
        const tag = getTag(db, tagId);
        if (!tag) throw new Error("标签不存在：" + tagId);
        const existing = db.prepare(
          "SELECT * FROM tag_mapping WHERE tag_id=? AND item_id=? AND item_type=? AND deleted_at IS NULL",
        ).get(tagId, itemId, itemType);
        if (existing) {
          skipped.push({ itemId: itemId, tagId: tagId });
          continue;
        }
        const deleted = db.prepare(
          "SELECT * FROM tag_mapping WHERE tag_id=? AND item_id=? AND item_type=? AND deleted_at IS NOT NULL ORDER BY updated_at DESC LIMIT 1",
        ).get(tagId, itemId, itemType);
        if (deleted) {
          db.prepare("UPDATE tag_mapping SET deleted_at=NULL, updated_at=?, rev=rev+1 WHERE id=?").run(ts, String(deleted.id));
          logChange(db, MAPPING_TABLE, String(deleted.id), "upsert", {
            id: String(deleted.id), tag_id: tagId, item_id: itemId, item_type: itemType, updated_at: ts, deleted_at: null, rev: Number(deleted.rev) + 1,
          }, origin, ts);
          linked.push({ id: String(deleted.id), tagId: tagId, itemId: itemId });
        } else {
          const id = newId();
          db.prepare(
            "INSERT INTO tag_mapping(id,tag_id,item_id,item_type,created_at,updated_at,deleted_at,rev) VALUES(?,?,?,?,?,?,NULL,1)",
          ).run(id, tagId, itemId, itemType, ts, ts);
          logChange(db, MAPPING_TABLE, id, "create", {
            id: id, tag_id: tagId, item_id: itemId, item_type: itemType, created_at: ts, updated_at: ts, deleted_at: null, rev: 1,
          }, origin, ts);
          linked.push({ id: id, tagId: tagId, itemId: itemId });
        }
      }
    }
  });
  if (linked.length) api.emit("tags-changed", { op: "link", itemType: itemType, count: linked.length });
  return { itemType: itemType, linked: linked.length, skipped: skipped.length, mappings: linked, skippedMappings: skipped };
}

function unlinkTags(db, args, origin, api) {
  const itemType = itemTypeArg(args);
  const itemIds = idListArg(args.itemIds !== undefined ? args.itemIds : args.itemId, "itemIds");
  const tagIds = args.tagIds === undefined ? [] : idListArg(args.tagIds, "tagIds");
  const ts = now();
  const where = ["item_type=?", "deleted_at IS NULL"];
  const params = [itemType];
  where.push("item_id IN (" + itemIds.map(function () { return "?"; }).join(",") + ")");
  for (const x of itemIds) params.push(x);
  if (tagIds.length) {
    where.push("tag_id IN (" + tagIds.map(function () { return "?"; }).join(",") + ")");
    for (const x of tagIds) params.push(x);
  }
  const stmt = db.prepare("SELECT * FROM tag_mapping WHERE " + where.join(" AND "));
  const rows = stmt.all.apply(stmt, params);
  if (!rows.length) return { itemType: itemType, unlinked: 0, missing: true };
  tx(db, function () {
    for (const row of rows) {
      db.prepare("UPDATE tag_mapping SET deleted_at=?, updated_at=?, rev=rev+1 WHERE id=?").run(ts, ts, String(row.id));
      logChange(db, MAPPING_TABLE, String(row.id), "delete", null, origin, ts);
    }
  });
  api.emit("tags-changed", { op: "unlink", itemType: itemType, count: rows.length });
  return { itemType: itemType, unlinked: rows.length, missing: false, mappings: rows.map(mapRow) };
}

function tagsOfItems(db, args) {
  const itemType = itemTypeArg(args);
  const itemIds = args.itemId !== undefined || args.itemIds !== undefined
    ? idListArg(args.itemIds !== undefined ? args.itemIds : args.itemId, "itemIds")
    : [];
  const tagId = args.tagId === undefined || args.tagId === null ? null : idOf(args.tagId);
  const where = ["m.item_type=?", "m.deleted_at IS NULL", "t.deleted_at IS NULL"];
  const params = [itemType];
  if (itemIds.length) {
    where.push("m.item_id IN (" + itemIds.map(function () { return "?"; }).join(",") + ")");
    for (const x of itemIds) params.push(x);
  }
  if (tagId) {
    where.push("m.tag_id=?");
    params.push(tagId);
  }
  const rows = db.prepare(
    "SELECT m.item_id, t.id AS tag_id, t.name FROM tag_mapping m JOIN tag t ON t.id=m.tag_id WHERE " + where.join(" AND ") + " ORDER BY t.name",
  ).all(...params);
  const map = {};
  const order = [];
  for (const row of rows) {
    const key = String(row.item_id);
    if (!map[key]) { map[key] = []; order.push(key); }
    map[key].push({ id: String(row.tag_id), name: String(row.name) });
  }
  return {
    itemType: itemType,
    count: order.length,
    items: order.map(function (key) { return { itemId: key, tags: map[key] }; }),
  };
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

  action("tags.link", {
    description: "批量给业务对象挂标签：tagIds × itemIds 笛卡尔积写入 tag_mapping（itemType 默认 task，site 由站点插件自行写入）",
    input: {
      type: "object",
      required: ["tagIds", "itemIds"],
      properties: {
        tagIds: { type: "array", items: { type: "string" } },
        itemIds: { type: "array", items: { type: "string" } },
        itemType: { type: "string", description: "默认 task" },
      },
    },
    examples: [{ tagIds: ["3", "4"], itemIds: ["1001", "1002"], itemType: "task" }],
    execute: function (args, ctx) { return linkTags(api.db, args || {}, ctx.origin, api); },
    render: function (r) { return "已关联 " + r.linked + " 条标签映射（跳过已存在 " + r.skipped + " 条）"; },
  });

  action("tags.unlink", {
    description: "批量解除标签关联（软删）：可给 tagIds 精确解除，不给则清空这些对象的全部标签",
    input: {
      type: "object",
      required: ["itemIds"],
      properties: {
        tagIds: { type: "array", items: { type: "string" } },
        itemIds: { type: "array", items: { type: "string" } },
        itemType: { type: "string", description: "默认 task" },
      },
    },
    examples: [{ tagIds: ["3"], itemIds: ["1001"], itemType: "task" }],
    execute: function (args, ctx) { return unlinkTags(api.db, args || {}, ctx.origin, api); },
    render: function (r) { return r.missing ? "没有匹配的标签关联" : "已解除 " + r.unlinked + " 条标签关联"; },
  });

  action("tags.itemsOf", {
    description: "反查标签：给 itemType（+ itemIds / tagId）返回每个对象的标签列表",
    input: {
      type: "object",
      properties: {
        itemType: { type: "string", description: "默认 task" },
        itemIds: { type: "array", items: { type: "string" } },
        itemId: { type: "string", description: "单个对象 id" },
        tagId: { type: "string", description: "只看某个标签" },
      },
    },
    examples: [{ itemType: "task", itemIds: ["1001", "1002"] }, { itemType: "task", tagId: "3" }],
    execute: function (args) { return tagsOfItems(api.db, args || {}); },
    render: function (r) {
      if (!r.items.length) return "没有匹配的标签关联";
      return r.items.map(function (it) {
        return it.itemId + "：" + it.tags.map(function (t) { return t.name; }).join(", ");
      }).join("\n");
    },
  });
}

export { linkTags, unlinkTags, tagsOfItems };

export { listTags, createTag, deleteTag };
