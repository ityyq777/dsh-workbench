// 标签下拉的按需分页查询：从 tagging.js 拆出，避免单文件持续膨胀。
import { STATUS_FIELDS, countsOf, tagsAvailable } from "./tagging.js";

/** 标签下拉的分页上限；客户端每次只多拉一页。 */
export const TAG_OPTIONS_MAX = 100;

export function escapeLike(text) {
  return String(text).replace(/[\\%_]/g, function (m) { return "\\" + m; });
}

export function untaggedCounts(db) {
  const row = db.prepare(
    "SELECT " + STATUS_FIELDS.map(function (p) {
      return p[1] === null
        ? "COUNT(*) AS total"
        : "SUM(CASE WHEN status='" + p[1] + "' THEN 1 ELSE 0 END) AS " + p[0];
    }).join(", ") + " FROM task " +
      "WHERE deleted_at IS NULL AND NOT EXISTS (" +
      "SELECT 1 FROM tag_mapping m WHERE m.item_type='task' AND m.item_id=task.id AND m.deleted_at IS NULL)",
  ).get();
  return countsOf(row);
}

const TAG_COUNT_SELECT =
  "SELECT g.id AS id, g.name AS name, " +
  STATUS_FIELDS.map(function (p) {
    return p[1] === null
      ? "COUNT(t.id) AS total"
      : "SUM(CASE WHEN t.status='" + p[1] + "' THEN 1 ELSE 0 END) AS " + p[0];
  }).join(", ") + " " +
  "FROM tag g " +
  "LEFT JOIN tag_mapping m ON m.tag_id=g.id AND m.item_type='task' AND m.deleted_at IS NULL " +
  "LEFT JOIN task t ON t.id=m.item_id AND t.deleted_at IS NULL ";

/**
 * 标签下拉的按需分页：text 模糊匹配名称（% _ \ 转义），按 total DESC, name ASC, id ASC 稳定排序。
 * 与 tagNavStats 的区别：不一次性返回全量，供「搜索 + 滚动加载」的下拉使用。
 */
export function tagOptions(db, api, args) {
  const opt = args || {};
  const pageSize = Math.max(1, Math.min(TAG_OPTIONS_MAX, Math.floor(Number(opt.pageSize) || 20)));
  const pageNumber = Math.max(1, Math.floor(Number(opt.pageNumber) || 1));
  const text = String(opt.text == null ? "" : opt.text).trim();
  if (!tagsAvailable(db, api)) {
    return { available: false, text: text, tags: [], pageNumber: pageNumber, pageSize: pageSize, total: 0, hasMore: false, untagged: { total: 0, open: 0, shutdown: 0, done: 0, restarted: 0 } };
  }
  const like = text ? "%" + escapeLike(text) + "%" : null;
  const where = "g.deleted_at IS NULL" + (like ? " AND g.name LIKE ? ESCAPE '\\'" : "");
  const countArgs = like ? [like] : [];
  const total = Number(db.prepare("SELECT COUNT(*) AS n FROM tag g WHERE " + where).get(...countArgs).n || 0);
  const offset = (pageNumber - 1) * pageSize;
  const rows = db
    .prepare(TAG_COUNT_SELECT + " WHERE " + where + " GROUP BY g.id, g.name ORDER BY total DESC, g.name ASC, g.id ASC LIMIT ? OFFSET ?")
    .all(...countArgs, pageSize, offset);
  const tags = rows.map(function (row) {
    return Object.assign({ id: String(row.id), name: String(row.name || "") }, countsOf(row));
  });
  return {
    available: true,
    text: text,
    tags: tags,
    pageNumber: pageNumber,
    pageSize: pageSize,
    total: total,
    hasMore: offset + tags.length < total,
    untagged: untaggedCounts(db),
  };
}


/** 把 tasks.tagOptions 的 action 注册从 tasks.js 里拆出来，控制单文件规模。 */
export function registerTagOptionsAction(action, db, api, migrateLegacyTypes) {
  action("tasks.tagOptions", {
    description:
      "标签下拉的按需分页：按名称模糊匹配（中文子串、ASCII 大小写不敏感，% _ \\ 按字面匹配），" +
      "排序 total DESC, name ASC, id ASC；返回 total / hasMore 供滚动加载。标签域未安装时 available=false",
    input: {
      type: "object",
      properties: {
        text: { type: "string", description: "名称关键词；trim 后为空表示不筛选" },
        pageNumber: { type: "number", description: "默认 1" },
        pageSize: { type: "number", description: "默认 20，上限 100" },
      },
    },
    examples: [{ text: "工作", pageSize: 20 }, { pageNumber: 2, pageSize: 20 }],
    execute: function (args) {
      try {
        migrateLegacyTypes(db, api, "migrate");
      } catch (e) {
        /* ignore */
      }
      return tagOptions(db, api, args || {});
    },
    render: function (r) {
      if (!r.available) return "标签域未安装";
      return "标签 " + r.tags.length + " 个（共 " + r.total + "，第 " + r.pageNumber + " 页）" + (r.hasMore ? "，还有更多" : "");
    },
  });
}
