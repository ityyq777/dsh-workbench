/**
 * 任务 ↔ 标签域（wb-addon-tags）的适配层。
 *
 * 与 sites 的做法保持一致：tag 表归标签域所有，任务侧只读写
 * tag_mapping 中 item_type='task' 的行；标签域未安装时整块标签能力降级，
 * 任务照常读写，只是没有标签。
 *
 * 唯一一次「代写标签」是迁移：把旧的「工作/生活/学习/开发」类型补成同名
 * 标签，否则老任务会集体变成未打标签。迁移用 meta 标记，只跑一次。
 */

import { idOf, newId, logChange, tableExists, metaGet, metaSet, tx } from "../db/db.js";

export const TAG_ITEM_TYPE = "task";

/** 旧 type 0..3 对应的标签名；也是 tab 1..4 的兼容标签。 */
export const LEGACY_TYPE_TAGS = { "0": "工作", "1": "生活", "2": "学习", "3": "开发" };

const MIGRATION_KEY = "tags_from_types_v1";

export function tagsAvailable(db, api) {
  return !!api && typeof api.hasDomain === "function" && api.hasDomain("wb-addon-tags") &&
    tableExists(db, "tag_mapping") && tableExists(db, "tag");
}

export function normalizeTagIds(raw) {
  let ids = raw;
  if (typeof ids === "string") ids = ids.split(",");
  if (!Array.isArray(ids)) return [];
  const out = [];
  for (const v of ids) {
    const id = idOf(v);
    if (id && out.indexOf(id) < 0) out.push(id);
  }
  return out;
}

/** 标签名列表 → 小写后的去重名字数组（用于按名字过滤/建标签）。 */
export function normalizeTagNames(raw) {
  let names = raw;
  if (typeof names === "string") names = names.split(/[,，]/);
  if (!Array.isArray(names)) return [];
  const out = [];
  for (const v of names) {
    const name = String(v === undefined || v === null ? "" : v).trim();
    if (name && out.indexOf(name) < 0) out.push(name);
  }
  return out;
}

/**
 * 「可用标签」提示：报错时把候选标签列出来，让调用方一次就能改对，
 * 而不是只知道「标签不存在」还要再调一次 tasks.tags 才能看到有哪些。
 */
export function availableTagsText(db, limit) {
  const max = Number.isFinite(Number(limit)) ? Math.max(1, Math.min(50, Math.floor(Number(limit)))) : 20;
  const totalRow = db.prepare("SELECT COUNT(*) AS n FROM tag WHERE deleted_at IS NULL").get();
  const total = Number((totalRow && totalRow.n) || 0);
  if (!total) return "当前还没有任何标签（先 tags.create，或打开 form.autoCreateTags 让写入时自动创建）";
  const rows = db.prepare("SELECT id, name FROM tag WHERE deleted_at IS NULL ORDER BY name ASC LIMIT ?").all(max);
  const listed = rows.map(function (r) { return String(r.name) + "(" + String(r.id) + ")"; }).join("、");
  return "可用标签（共 " + total + " 个" + (total > rows.length ? "，只列前 " + rows.length + " 个" : "") + "）：" + listed;
}

export function requireTagRows(db, tagIds) {
  const rows = [];
  const missing = [];
  for (const id of tagIds) {
    const row = db.prepare("SELECT * FROM tag WHERE id=? AND deleted_at IS NULL").get(id);
    if (!row) missing.push(String(id));
    else rows.push(row);
  }
  if (missing.length) {
    throw new Error(
      "标签 id 不存在：" + missing.join("、") + "。" + availableTagsText(db, 20) +
      "。tagIds / addTagIds 必须是已存在的标签 id，不会按 id 自动创建；按名字挂标签请改用 tags / addTags",
    );
  }
  return rows;
}

export function tagIdsByNames(db, names) {
  const ids = [];
  const missing = [];
  for (const name of names) {
    const row = db.prepare("SELECT id FROM tag WHERE name=? AND deleted_at IS NULL ORDER BY created_at ASC LIMIT 1").get(name);
    if (row) ids.push(String(row.id));
    else missing.push(name);
  }
  return { ids: ids, missing: missing };
}

/**
 * 按名字取标签 id；没有就建。标签名唯一（uk_tag_name），并发撞索引时回查已有 id，
 * 避免把「另一端刚建好的同名标签」当成失败。
 */
export function ensureTagIdByName(db, name, ts, origin) {
  const sql = "SELECT * FROM tag WHERE name=? AND deleted_at IS NULL ORDER BY created_at ASC LIMIT 1";
  const hit = db.prepare(sql).get(name);
  if (hit) return String(hit.id);
  const id = newId();
  try {
    db.prepare(
      "INSERT INTO tag(id,name,created_at,updated_at,deleted_at,rev) VALUES(?,?,?,?,?,?)",
    ).run(id, name, ts, ts, null, 1);
  } catch (e) {
    const again = db.prepare(sql).get(name);
    if (again) return String(again.id);
    throw e;
  }
  logChange(db, "tag", id, "create", {
    id: id, name: name, created_at: ts, updated_at: ts, deleted_at: null, rev: 1,
  }, origin, ts);
  return id;
}

/** 按名字取标签；没有就建。仅用于新建/更新任务时直接传标签名。 */
export function ensureTagsByNames(db, names, ts, origin) {
  const ids = [];
  for (const name of names) ids.push(ensureTagIdByName(db, name, ts, origin));
  return ids;
}

/** 用 tagIds 全量替换某任务的标签；软删复用旧 mapping，避免每次写都新增历史行。 */
export function replaceTaskTags(db, taskId, tagIds, ts, origin) {
  const current = db.prepare(
    "SELECT * FROM tag_mapping WHERE item_type=? AND item_id=? AND deleted_at IS NULL",
  ).all(TAG_ITEM_TYPE, String(taskId));
  const byTag = new Map();
  for (const m of current) byTag.set(String(m.tag_id), m);
  const wanted = new Set(tagIds.map(String));
  for (const m of current) {
    if (wanted.has(String(m.tag_id))) continue;
    db.prepare("UPDATE tag_mapping SET deleted_at=?, updated_at=?, rev=rev+1 WHERE id=?").run(ts, ts, String(m.id));
    logChange(db, "tag_mapping", String(m.id), "delete", null, origin, ts);
  }
  for (const tagId of tagIds) {
    if (byTag.has(String(tagId))) continue;
    const deleted = db.prepare(
      "SELECT * FROM tag_mapping WHERE item_type=? AND item_id=? AND tag_id=? AND deleted_at IS NOT NULL ORDER BY updated_at DESC LIMIT 1",
    ).get(TAG_ITEM_TYPE, String(taskId), String(tagId));
    if (deleted) {
      db.prepare("UPDATE tag_mapping SET deleted_at=NULL, updated_at=?, rev=rev+1 WHERE id=?").run(ts, String(deleted.id));
      logChange(db, "tag_mapping", String(deleted.id), "upsert", {
        id: String(deleted.id), tag_id: String(tagId), item_id: String(taskId), item_type: TAG_ITEM_TYPE,
        updated_at: ts, deleted_at: null, rev: Number(deleted.rev) + 1,
      }, origin, ts);
      continue;
    }
    const id = newId();
    db.prepare(
      "INSERT INTO tag_mapping(id,tag_id,item_id,item_type,created_at,updated_at,deleted_at,rev) VALUES(?,?,?,?,?,?,?,?)",
    ).run(id, String(tagId), String(taskId), TAG_ITEM_TYPE, ts, ts, null, 1);
    logChange(db, "tag_mapping", id, "create", {
      id: id, tag_id: String(tagId), item_id: String(taskId), item_type: TAG_ITEM_TYPE,
      created_at: ts, updated_at: ts, deleted_at: null, rev: 1,
    }, origin, ts);
  }
}

export function tagsForTasks(db, ids) {
  const map = new Map();
  if (!ids.length) return map;
  const marks = ids.map(function () { return "?"; }).join(",");
  const rows = db.prepare(
    "SELECT m.item_id AS item_id, t.id AS id, t.name AS name FROM tag_mapping m JOIN tag t ON t.id=m.tag_id " +
      "WHERE m.item_type=? AND m.deleted_at IS NULL AND t.deleted_at IS NULL AND m.item_id IN (" + marks + ") " +
      "ORDER BY t.name ASC",
  ).all(...[TAG_ITEM_TYPE].concat(ids.map(String)));
  for (const row of rows) {
    const key = String(row.item_id);
    if (!map.has(key)) map.set(key, []);
    map.get(key).push({ id: String(row.id), name: String(row.name || "") });
  }
  return map;
}

/** 给 taskOut 结果补 tags / tagIds；标签域未安装时补空数组，方便前端直接用。 */
export function attachTags(db, api, records) {
  const list = Array.isArray(records) ? records : [records];
  const available = tagsAvailable(db, api);
  const map = available ? tagsForTasks(db, list.map(function (t) { return t.id; })) : new Map();
  for (const t of list) {
    if (!available) {
      // 标签域未安装：省略 tags/tagIds，别让调用方以为「这个任务真的没有标签」。
      delete t.tags;
      delete t.tagIds;
      continue;
    }
    const tags = map.get(String(t.id)) || [];
    t.tags = tags;
    t.tagIds = tags.map(function (x) { return x.id; });
  }
  return records;
}

/** 给一个任务补一个标签（按名，缺标签就建）；已有映射则跳过。导入旧备份时用。 */
export function addTaskTagByName(db, taskId, name, ts, origin) {
  const ids = ensureTagsByNames(db, [name], ts, origin);
  const tagId = ids[0];
  const exists = db.prepare(
    "SELECT 1 AS ok FROM tag_mapping WHERE item_type=? AND item_id=? AND tag_id=? AND deleted_at IS NULL",
  ).get(TAG_ITEM_TYPE, String(taskId), String(tagId));
  if (exists) return false;
  const id = newId();
  db.prepare(
    "INSERT INTO tag_mapping(id,tag_id,item_id,item_type,created_at,updated_at,deleted_at,rev) VALUES(?,?,?,?,?,?,?,?)",
  ).run(id, String(tagId), String(taskId), TAG_ITEM_TYPE, ts, ts, null, 1);
  logChange(db, "tag_mapping", id, "create", {
    id: id, tag_id: String(tagId), item_id: String(taskId), item_type: TAG_ITEM_TYPE,
    created_at: ts, updated_at: ts, deleted_at: null, rev: 1,
  }, origin, ts);
  return true;
}

export const STATUS_FIELDS = [
  ["total", null],
  ["open", "0"],
  ["shutdown", "1"],
  ["done", "2"],
  ["restarted", "3"],
];

export function countsOf(row) {
  const out = { total: 0, open: 0, shutdown: 0, done: 0, restarted: 0 };
  for (const pair of STATUS_FIELDS) out[pair[0]] = Number((row && row[pair[0]]) || 0);
  return out;
}

/** 左栏标签导航：所有标签 + 各自任务数，末尾附「未打标签」计数。 */
export function tagNavStats(db, api) {
  if (!tagsAvailable(db, api)) {
    return { available: false, tags: [], untagged: { total: 0, open: 0, shutdown: 0, done: 0, restarted: 0 } };
  }
  const rows = db.prepare(
    "SELECT g.id AS id, g.name AS name, " +
      STATUS_FIELDS.map(function (p) {
        return p[1] === null
          ? "COUNT(t.id) AS total"
          : "SUM(CASE WHEN t.status='" + p[1] + "' THEN 1 ELSE 0 END) AS " + p[0];
      }).join(", ") + " " +
      "FROM tag g " +
      "LEFT JOIN tag_mapping m ON m.tag_id=g.id AND m.item_type='task' AND m.deleted_at IS NULL " +
      "LEFT JOIN task t ON t.id=m.item_id AND t.deleted_at IS NULL " +
      "WHERE g.deleted_at IS NULL GROUP BY g.id, g.name " +
      "ORDER BY total DESC, g.name ASC",
  ).all();
  const tags = rows.map(function (row) {
    return Object.assign({ id: String(row.id), name: String(row.name || "") }, countsOf(row));
  });
  const untaggedRow = db.prepare(
    "SELECT " + STATUS_FIELDS.map(function (p) {
      return p[1] === null
        ? "COUNT(*) AS total"
        : "SUM(CASE WHEN status='" + p[1] + "' THEN 1 ELSE 0 END) AS " + p[0];
    }).join(", ") + " FROM task " +
      "WHERE deleted_at IS NULL AND NOT EXISTS (" +
      "SELECT 1 FROM tag_mapping m WHERE m.item_type='task' AND m.item_id=task.id AND m.deleted_at IS NULL)",
  ).get();
  return { available: true, tags: tags, untagged: countsOf(untaggedRow) };
}

/** 统计页的「标签 × 状态」分组；多标签任务会出现在多个分组里。 */
export function tagBreakdown(db, api) {
  const nav = tagNavStats(db, api);
  if (!nav.available) return { rows: [], untagged: nav.untagged };
  const rows = nav.tags.map(function (x) {
    return { key: x.id, label: x.name, total: x.total, open: x.open, done: x.done, shutdown: x.shutdown, restarted: x.restarted };
  });
  if (nav.untagged.total > 0) {
    rows.push({
      key: "untagged", label: "未打标签", total: nav.untagged.total, open: nav.untagged.open,
      done: nav.untagged.done, shutdown: nav.untagged.shutdown, restarted: nav.untagged.restarted,
    });
  }
  return { rows: rows, untagged: nav.untagged };
}

/**
 * 把旧类型迁移成标签（幂等）：
 * 1) 工作/生活/学习/开发 四个标签缺失就补建；
 * 2) meta.legacy_task_types（删 type 列前记下的 {taskId: "0".."3"}）里的任务补标签；
 * 3) 写入 meta 标记，之后不再执行。
 * 标签域未安装时直接跳过，等装好标签域后的第一次调用再补。
 */
export function migrateLegacyTypes(db, api, origin) {
  if (!tagsAvailable(db, api)) return { migrated: false, reason: "标签域未安装" };
  if (metaGet(db, MIGRATION_KEY)) return { migrated: false, reason: "已迁移" };
  let legacy = {};
  const raw = metaGet(db, "legacy_task_types");
  if (raw) {
    try {
      legacy = JSON.parse(String(raw)) || {};
    } catch (e) {
      legacy = {};
    }
  }
  let tagsCreated = 0;
  let mappings = 0;
  const ts = Date.now();
  tx(db, function () {
    for (const code of Object.keys(LEGACY_TYPE_TAGS)) {
      const name = LEGACY_TYPE_TAGS[code];
      const taskIds = Object.keys(legacy).filter(function (id) {
        return String(legacy[id]) === code;
      });
      if (!taskIds.length) continue;
      const existed = db.prepare("SELECT 1 AS ok FROM tag WHERE name=? AND deleted_at IS NULL").get(name);
      const tagId = ensureTagIdByName(db, name, ts, origin || "migrate");
      const tag = { id: tagId, name: name };
      if (!existed) tagsCreated += 1;
      for (const taskId of taskIds) {
        const alive = db.prepare("SELECT 1 AS ok FROM task WHERE id=? AND deleted_at IS NULL").get(String(taskId));
        if (!alive) continue;
        const exists = db.prepare(
          "SELECT 1 AS ok FROM tag_mapping WHERE item_type=? AND item_id=? AND tag_id=? AND deleted_at IS NULL",
        ).get(TAG_ITEM_TYPE, String(taskId), String(tag.id));
        if (exists) continue;
        const id = newId();
        db.prepare(
          "INSERT INTO tag_mapping(id,tag_id,item_id,item_type,created_at,updated_at,deleted_at,rev) VALUES(?,?,?,?,?,?,?,?)",
        ).run(id, String(tag.id), String(taskId), TAG_ITEM_TYPE, ts, ts, null, 1);
        logChange(db, "tag_mapping", id, "create", {
          id: id, tag_id: String(tag.id), item_id: String(taskId), item_type: TAG_ITEM_TYPE,
          created_at: ts, updated_at: ts, deleted_at: null, rev: 1,
        }, origin || "migrate", ts);
        mappings += 1;
      }
    }
    metaSet(db, MIGRATION_KEY, String(ts));
  });
  return { migrated: true, tagsCreated: tagsCreated, mappings: mappings };
}
