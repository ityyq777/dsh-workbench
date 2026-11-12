import { now, newId, tx, logChange, tagsOn, idsOf, fieldsOf, rowStorage, pageInfo, sizeOf } from "../db/db.js";
import { validateTags, replaceTags, searchTags, tagsByIds } from "./tags.js";
import { configValues } from "../infra/config.js";
import { deleteRow, bulkDelete } from "./deletion.js";
const SORT = { name: "name", brand: "brand", stock: "stock", location: "location", create_time: "created_at", update_time: "updated_at" };
function requireId(id) {
  if (id === undefined || id === null || !String(id).trim()) throw new Error("id 必填");
  return String(id);
}
function get(api, id) {
  return rowStorage(api, api.db.prepare("SELECT * FROM storage WHERE id=? AND deleted_at IS NULL").get(requireId(id)));
}
function list(api, args) {
  const db = api.db,
    config = configValues(db),
    where = ["s.deleted_at IS NULL"],
    params = [];
  const text = String(args.text || "").trim();
  if (text) {
    where.push(
      "(instr(lower(s.name),lower(?))>0 OR instr(lower(s.brand),lower(?))>0 OR instr(lower(s.location),lower(?))>0 OR instr(lower(s.remark),lower(?))>0)",
    );
    params.push(text, text, text, text);
  }
  const tagIds = idsOf(args.tagIds === undefined ? args.tags : args.tagIds);
  if (tagIds.length) {
    if (!tagsOn(api)) throw new Error("标签插件未安装或已禁用，无法按标签过滤");
    where.push(
      "EXISTS (SELECT 1 FROM tag_mapping m JOIN tag t ON t.id=m.tag_id WHERE m.item_type='storage' AND m.item_id=s.id AND m.deleted_at IS NULL AND t.deleted_at IS NULL AND m.tag_id IN (" +
        tagIds.map(() => "?").join(",") +
        "))",
    );
    params.push(...tagIds);
  }
  const column = args.sortColumn === undefined ? config["list.sortColumn"] : args.sortColumn;
  if (!Object.hasOwn(SORT, column)) throw new Error("未知排序列：" + column);
  const order = args.sortOrder === undefined ? config["list.sortOrder"] : args.sortOrder;
  if (!["asc", "desc"].includes(order)) throw new Error("排序方向只能是 asc/desc");
  const sql = " FROM storage s WHERE " + where.join(" AND ");
  const total = Number(db.prepare("SELECT COUNT(*) n" + sql).get(...params).n);
  const size = sizeOf(args.pageSize, config["list.pageSize"]),
    page = pageInfo(total, args.pageNumber, size);
  const rows = db
    .prepare("SELECT s.*" + sql + " ORDER BY s." + SORT[column] + " " + order + ",s.id ASC LIMIT ? OFFSET ?")
    .all(...params, size, page.pageable.offset);
  return { ...page, records: rows.map((r) => rowStorage(api, r)) };
}
function save(api, args, origin, update) {
  const db = api.db,
    id = update ? requireId(args.id) : newId();
  tx(db, () => {
    const old = update ? db.prepare("SELECT * FROM storage WHERE id=? AND deleted_at IS NULL").get(id) : null;
    if (update && !old) throw new Error("物品不存在或已删除");
    const fields = fieldsOf(args, old || {}),
      ts = now();
    const rawTags = args.tagIds === undefined ? args.tags : args.tagIds;
    const tags = rawTags === undefined ? null : validateTags(api, rawTags);
    if (update)
      db.prepare(
        "UPDATE storage SET name=?,brand=?,unit=?,stock=?,location=?,img_list=?,remark=?,updated_at=?,rev=rev+1 WHERE id=?",
      ).run(fields.name, fields.brand, fields.unit, fields.stock, fields.location, fields.img_list, fields.remark, ts, id);
    else
      db.prepare(
        "INSERT INTO storage(id,name,brand,unit,stock,location,img_list,remark,created_at,updated_at,deleted_at,rev) VALUES(?,?,?,?,?,?,?,?,?,?,NULL,1)",
      ).run(id, fields.name, fields.brand, fields.unit, fields.stock, fields.location, fields.img_list, fields.remark, ts, ts);
    replaceTags(api, id, tags, origin, ts);
    logChange(db, "storage", id, update ? "upsert" : "create", origin, ts);
  });
  api.emit("storage-changed", { id, op: update ? "update" : "create" });
  return { ok: true, storage: get(api, id) };
}
function remove(api, args, origin) {
  const id = requireId(args.id),
    db = api.db;
  const result = tx(db, () => {
    const row = deleteRow(api, id, origin, now());
    return { ok: true, deleted: !!row, removedTagMappings: row ? row.removedTagMappings : 0 };
  });
  if (result.deleted) api.emit("storage-changed", { id, op: "delete" });
  return result;
}
function stats(api) {
  const rows = api.db.prepare("SELECT * FROM storage WHERE deleted_at IS NULL ORDER BY updated_at DESC,id").all();
  const tagged = tagsOn(api)
    ? Number(
        api.db
          .prepare(
            "SELECT COUNT(DISTINCT s.id) n FROM storage s JOIN tag_mapping m ON m.item_id=s.id AND m.item_type='storage' JOIN tag t ON t.id=m.tag_id WHERE s.deleted_at IS NULL AND m.deleted_at IS NULL AND t.deleted_at IS NULL",
          )
          .get().n,
      )
    : 0;
  return {
    total: rows.length,
    tagged,
    withImages: rows.filter((r) => JSON.parse(r.img_list).length).length,
    brands: new Set(rows.map((r) => r.brand).filter(Boolean)).size,
    units: new Set(rows.map((r) => r.unit).filter(Boolean)).size,
    recent: rows.slice(0, 8).map((r) => rowStorage(api, r)),
  };
}
const idSchema = { type: ["string", "number"] };
const tagsSchema = {
  type: "array",
  items: idSchema,
  description: "已有标签 id；整体替换。标签不可用时空数组保留映射，非空数组报错",
};
const fields = {
  name: { type: "string", description: "物品名称，非空，最多200字；创建必填，更新省略时保留原值" },
  brand: { type: "string" },
  unit: { type: "string" },
  location: { type: "string", description: "存放位置，最多200字；默认空串，更新省略时保留原值" },
  stock: { type: "string", description: "库存文本，支持 1~2，不做数值计算" },
  imgList: { type: "array", items: { type: "string" }, description: "最多50个 HTTP(S) 图片URL，仅预览，不上传" },
  remark: { type: "string", description: "备注，最多10000字" },
  tagIds: tagsSchema,
  tags: { ...tagsSchema, description: "tagIds 的兼容别名；同时传入时 tagIds 优先" },
};
export function registerStorageActions(api) {
  const action = (name, description, properties, required, execute) =>
    api.action(name, {
      description,
      input: { type: "object", properties, required },
      execute: (args = {}, ctx = {}) => execute(args, ctx),
      render: (r) => JSON.stringify(r),
    });
  action("storage.capabilities", "探测可选标签插件；储物独立可用", {}, [], () => ({ tags: tagsOn(api) }));
  action(
    "storage.list",
    "分页查询物品，关键词匹配名称/品牌/位置/备注，标签命中任一",
    {
      text: { type: "string" },
      tagIds: tagsSchema,
      tags: fields.tags,
      pageNumber: { type: "number" },
      pageSize: { type: "number", description: "默认读取配置，最大200" },
      sortColumn: { type: "string", enum: Object.keys(SORT) },
      sortOrder: { type: "string", enum: ["asc", "desc"] },
    },
    [],
    (args) => list(api, args),
  );
  action("storage.get", "读取未删除的单个物品；不存在返回null", { id: idSchema }, ["id"], (args) => get(api, args.id));
  action("storage.create", "事务创建物品与可选标签，写同步日志", fields, ["name"], (args, ctx) =>
    save(api, args, ctx.origin, false),
  );
  action(
    "storage.update",
    "事务更新物品和传入的标签；省略字段保留原值",
    { id: idSchema, ...fields },
    ["id"],
    (args, ctx) => save(api, args, ctx.origin, true),
  );
  action(
    "storage.delete",
    "事务软删物品；标签可用时软删本物品映射，不可用时保留映射",
    { id: idSchema },
    ["id"],
    (args, ctx) => remove(api, args, ctx.origin),
  );
  action(
    "storage.bulkDelete",
    "单事务批量软删物品及标签可用时的映射，逐行写同步墓碑；失败整体回滚。去重后不存在或已删计 skipped；返回 {deleted,skipped,ids}，ids 为实际删除的 id。标签不可用保留映射",
    { ids: { type: "array", maxItems: 500, items: idSchema, description: "必填，最多500项；非空字符串或有限数值 id，转字符串并去首尾空格后去重；空数组为无操作" } },
    ["ids"],
    (args, ctx) => bulkDelete(api, args, ctx.origin),
  );
  action("storage.stats", "物品数、标签覆盖、图片覆盖、品牌数、单位数与最近更新", {}, [], () => stats(api));
  action(
    "storageTags.search",
    "分页搜索现有标签，标签不可用时返回空结果",
    { text: { type: "string" }, pageNumber: { type: "number" }, pageSize: { type: "number" } },
    [],
    (args) => searchTags(api, args),
  );
  action(
    "storageTags.byIds",
    "按标签 id 批量读取；标签不可用时返回空结果",
    { ids: { type: "array", items: idSchema } },
    [],
    (args) => tagsByIds(api, args),
  );
}
