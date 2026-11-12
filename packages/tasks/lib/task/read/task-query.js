/** 列表查询。与 tasks.js 的循环依赖只在函数调用期读取，顶层不求值。 */
import { idOf, addDays, todayStr, nodeMap, taskOut } from "../../db/db.js";
import { asCode, STATUS_NAMES, STATUSES, requireTable, dateArg, withNotices, tagMissingNotices } from "../../tasks.js";
import { dateRangeFilter } from "./task-publish-filter.js";
import { activityFilter } from "../../stats/activity-calendar.js";
import { clampPriority } from "../model/task-priority.js";
import { clampDifficulty } from "../model/task-model.js";
import { attachWorkspaces } from "../../workspace/workspace-store.js";
import { LEGACY_TYPE_TAGS, tagsAvailable, normalizeTagIds, normalizeTagNames, tagIdsByNames, attachTags, migrateLegacyTypes } from "../../tagging/tagging.js";

/**
 * 旧页签参数已移除：tab 与 filterRestarted 不再有实现，传入时明确抛错并给出
 * 迁移映射，避免调用方以为「传了还在生效」。
 */
const LEGACY_TAB_HINT = {
  0: "statuses:[0] 且 priorityMin=8、priorityMax=10（新口径的紧急任务只含优先级 8..10）",
  1: "tags:['工作']（旧类型页签已迁成同名标签）",
  2: "tags:['生活']",
  3: "tags:['学习']",
  4: "tags:['开发']",
  5: "statuses:[1]（要看已重启传 statuses:[3]）",
  6: "statuses:[0]",
  7: "statuses:[2]",
  8: "statuses:[]（全部状态，含已重启）",
  9: "statuses:[4]",
};
function rejectLegacyArgs(args) {
  if (args.tab !== undefined && args.tab !== null && String(args.tab).trim() !== "") {
    const key = Number(args.tab);
    const hint = LEGACY_TAB_HINT[key] || "statuses（0..4 整数数组，空数组=全部状态）";
    throw new Error("tab 参数已移除：状态筛选统一走 statuses。tab=" + args.tab + " 的等价写法是 " + hint);
  }
  if (args.filterRestarted !== undefined && args.filterRestarted !== null) {
    throw new Error("filterRestarted 参数已移除：状态筛选统一走 statuses；需要含已重启请传 statuses:[0,1,2,3,4] 或空数组（全部状态）");
  }
}

export function listTasks(db, args, api) {
  const activity = activityFilter(args.activityDate, args.activityType);
  const ranges = [
    dateRangeFilter(args.publishFrom, args.publishTo, "publish"),
    dateRangeFilter(args.doneFrom, args.doneTo, "done"),
    dateRangeFilter(args.shutdownFrom, args.shutdownTo, "shutdown"),
    dateRangeFilter(args.claimedFrom, args.claimedTo, "claimed"),
  ];
  rejectLegacyArgs(args);
  const multiStatus = args.statuses !== undefined || args.urgent !== undefined;
  if (args.statuses !== undefined && (!Array.isArray(args.statuses) ||
      args.statuses.some(s => !Number.isInteger(s) || s < 0 || s > 4))) {
    throw new Error("statuses 必须是 0/1/2/3/4 整数数组");
  }
  if (args.urgent !== undefined && typeof args.urgent !== "boolean") throw new Error("urgent 必须是布尔值");
  const statuses = [...new Set(args.statuses || [])];
  const urgent = args.urgent === true;
  // 第一次打开列表时把旧「类型」补成标签；幂等，失败不阻断列表。
  try {
    migrateLegacyTypes(db, api, "migrate");
  } catch (e) {
    /* ignore */
  }
  const where = ["t.deleted_at IS NULL"];
  const params = [];
  const listNotices = ranges.flatMap(range => range.notices);
  // 四组事件日期共用闭区间；claimed 没有独立列（终态清空接取列），按 COALESCE(claimed_at 本地日, 发布日) 兜底。
  const DATE_FIELDS = {
    publish: { column: "substr(t.publish_date,1,10)", status: null },
    done: { column: "substr(t.done_date,1,10)", status: "t.status='2'" },
    shutdown: { column: "substr(t.shutdown_date,1,10)", status: "t.status='1'" },
    claimed: {
      column: "COALESCE(strftime('%Y-%m-%d', t.claimed_at/1000, 'unixepoch', 'localtime'), substr(t.publish_date,1,10))",
      status: "t.status IN ('2','4')",
    },
  };
  for (const [index, kind] of ["publish", "done", "shutdown", "claimed"].entries()) {
    const from = ranges[index][kind + "From"], to = ranges[index][kind + "To"];
    const spec = DATE_FIELDS[kind];
    if ((from || to) && spec.status) where.push(spec.status);
    if (from) { where.push(spec.column + ">=?"); params.push(from); }
    if (to) { where.push(spec.column + "<=?"); params.push(to); }
  }
  if (activity) { where.push(activity.sql); params.push(...activity.params); }

  const titleKey = args.titleKey === undefined || args.titleKey === null ? "" : String(args.titleKey).trim();
  if (titleKey) {
    const key = titleKey.replace(/[\\%_]/g, "\\$&");
    where.push("(t.title LIKE ? ESCAPE '\\' OR t.description LIKE ? ESCAPE '\\' OR t.review LIKE ? ESCAPE '\\')");
    params.push("%" + key + "%", "%" + key + "%", "%" + key + "%");
  }

  const tableId = idOf(args.tableId);
  const groupId = idOf(args.groupId);
  if (tableId && tableId !== "0") {
    requireTable(db, tableId);
    where.push("t.table_id=?");
    params.push(tableId);
  } else if (groupId && groupId !== "0") {
    const group = db.prepare("SELECT * FROM task_node WHERE id=? AND deleted_at IS NULL").get(groupId);
    if (!group) throw new Error("任务组不存在：" + groupId);
    const prefix = String(group.path || "") + "%";
    const tables = db.prepare("SELECT id FROM task_node WHERE type='1' AND deleted_at IS NULL AND path LIKE ?").all(prefix);
    if (!tables.length) {
      where.push("1=0");
    } else {
      where.push("t.table_id IN (" + tables.map(function () { return "?"; }).join(",") + ")");
      for (const t of tables) params.push(String(t.id));
    }
  }

  const tableKey = args.tableKey === undefined || args.tableKey === null ? "" : String(args.tableKey).trim();
  if (tableKey) {
    const key = tableKey.replace(/[\\%_]/g, "\\$&");
    where.push(
      "EXISTS (SELECT 1 FROM task_node n WHERE n.id=t.table_id AND n.deleted_at IS NULL AND (n.name LIKE ? ESCAPE '\\' OR n.description LIKE ? ESCAPE '\\'))",
    );
    params.push("%" + key + "%", "%" + key + "%");
  }

  const workspaceIds = Array.isArray(args.workspaceIds)
    ? [...new Set(args.workspaceIds.map(function (v) { return String(v).trim(); }).filter(Boolean))]
    : [];
  const noWorkspace = args.noWorkspace === true;
  if (workspaceIds.length && noWorkspace) {
    throw new Error("workspaceIds 与 noWorkspace 互斥：要么按工作区筛，要么只看未关联工作区的任务");
  }
  if (workspaceIds.length) {
    where.push(
      "EXISTS (SELECT 1 FROM task_workspace_link wl JOIN task_workspace w ON w.id=wl.workspace_id " +
      "WHERE wl.task_id=t.id AND wl.deleted_at IS NULL AND w.deleted_at IS NULL AND wl.workspace_id IN (" +
      workspaceIds.map(function () { return "?"; }).join(",") + "))",
    );
    for (const id of workspaceIds) params.push(id);
  } else if (noWorkspace) {
    where.push(
      "NOT EXISTS (SELECT 1 FROM task_workspace_link wl JOIN task_workspace w ON w.id=wl.workspace_id " +
      "WHERE wl.task_id=t.id AND wl.deleted_at IS NULL AND w.deleted_at IS NULL)",
    );
  }

  // 旧前端的 checkedTypes（0..3）仍接受，按旧类型名映射成标签过滤。
  const checkedTypes = Array.isArray(args.checkedTypes) ? args.checkedTypes.map(String) : [];
  for (const c of checkedTypes) {
    if (!(c in LEGACY_TYPE_TAGS)) throw new Error("checkedTypes 取值非法：" + c);
  }
  const tagAvailable = tagsAvailable(db, api);
  let filterTagIds = normalizeTagIds(args.tagIds);
  const filterTagNames = normalizeTagNames(args.tags);
  for (const c of checkedTypes) {
    const name = LEGACY_TYPE_TAGS[c];
    if (filterTagNames.indexOf(name) < 0) filterTagNames.push(name);
  }
  if (filterTagNames.length) {
    if (!tagAvailable) {
      // 可选能力缺失：不报错，按「筛不到任何任务」处理，并在回执里说明原因。
      listNotices.push(tagMissingNotices({ tags: [] }, false)[0]);
      where.push("1=0");
    }
    const resolved = tagAvailable ? tagIdsByNames(db, filterTagNames) : { ids: [] };
    for (const id of resolved.ids) if (filterTagIds.indexOf(id) < 0) filterTagIds.push(id);
    if (!resolved.ids.length) where.push("1=0");
  }

/**
 * 区间端点校验：复用优先级/难度各自的 clamp，但把错误归到具体字段名上。
 * agent 只看到 schema，报错里没有字段名就无法判断是 min 还是 max 传错。
 */
function rangeArg(clamp, value, label, span) {
  try {
    return clamp(value, null);
  } catch (e) {
    throw new Error(label + " 必须是 " + span + " 内的数字");
  }
}

  // 额外过滤：与 tab/tableId/groupId 条件是 AND 关系。
  if (args.status !== undefined && args.status !== null && args.status !== "") {
    where.push("t.status=?");
    params.push(asCode(args.status, STATUS_NAMES, STATUSES, "status"));
  }
  const difficultyMissing = args.difficultyMissing === true;
  if (difficultyMissing) where.push("(t.difficulty IS NULL OR t.difficulty=0)");
  const priorityMin = rangeArg(clampPriority, args.priorityMin, "priorityMin", "0..10");
  const priorityMax = rangeArg(clampPriority, args.priorityMax, "priorityMax", "0..10");
  if (priorityMin !== null) {
    where.push("t.priority>=?");
    params.push(priorityMin);
  }
  if (priorityMax !== null) {
    where.push("t.priority<=?");
    params.push(priorityMax);
  }
  // 难度区间：NULL 视作未设置（0），所以凡是下界为 0 的区间都要显式把 NULL 算进来，
  // 否则「难度 ≤3」会把未填难度的任务整批漏掉。0 是合法端点，1..5 才是可选档位。
  const difficultyMin = rangeArg(clampDifficulty, args.difficultyMin, "difficultyMin", "0..5");
  const difficultyMax = rangeArg(clampDifficulty, args.difficultyMax, "difficultyMax", "0..5");
  if (difficultyMin !== null && difficultyMax !== null) {
    if (difficultyMin <= 0) {
      where.push("(t.difficulty IS NULL OR t.difficulty BETWEEN ? AND ?)");
      params.push(difficultyMin, difficultyMax);
    } else {
      where.push("t.difficulty BETWEEN ? AND ?");
      params.push(difficultyMin, difficultyMax);
    }
  } else if (difficultyMin !== null) {
    if (difficultyMin <= 0) where.push("(t.difficulty IS NULL OR t.difficulty>=?)");
    else where.push("t.difficulty>=?");
    params.push(difficultyMin);
  } else if (difficultyMax !== null) {
    where.push("(t.difficulty IS NULL OR t.difficulty<=?)");
    params.push(difficultyMax);
  }
  const targetFrom = dateArg(args.targetFrom, "targetFrom");
  if (targetFrom) {
    where.push("t.target_date>=?");
    params.push(targetFrom);
  }
  const targetTo = dateArg(args.targetTo, "targetTo");
  if (targetTo) {
    where.push("t.target_date<=?");
    params.push(targetTo);
  }
  if (filterTagIds.length && !tagAvailable) {
    if (!listNotices.some(n => n.code === "tag_domain_missing")) listNotices.push(tagMissingNotices({ tags: [] }, false)[0]);
    where.push("1=0");
  } else if (filterTagIds.length) {
    where.push("EXISTS (SELECT 1 FROM tag_mapping tm WHERE tm.item_type='task' AND tm.item_id=t.id AND tm.deleted_at IS NULL AND tm.tag_id IN (" + filterTagIds.map(function () { return "?"; }).join(",") + "))");
    for (const id of filterTagIds) params.push(id);
  }

  if (multiStatus) {
    const alternatives = [];
    if (statuses.length) {
      alternatives.push("t.status IN (" + statuses.map(() => "?").join(",") + ")");
      params.push(...statuses.map(String));
    }
    if (urgent) {
      alternatives.push("(t.status='0' AND (t.priority>=6 OR t.target_date<=?))");
      params.push(addDays(todayStr(), 2));
    }
    if (alternatives.length) where.push("(" + alternatives.join(" OR ") + ")");
  }

  // 分页语义（2026-11-08 明确化）：
  // - pageSize 夹在 1..200，请求值超出时按上限截断并在 filter.pageSize 回显实际值；
  // - total 永远是筛选后的真实总数（不受 LIMIT 影响），returned 是本页实际返回条数；
  // - 未分页时最多返回 MAX_UNPAGED 条，被截断时 truncated=true。
  const MAX_PAGE_SIZE = 200;
  const MAX_UNPAGED = 500;
  const wantPaging = args.pageNumber !== undefined || args.pageSize !== undefined;
  const pageable = wantPaging;
  let pageNumber = 1;
  let pageSize = 0;
  let limitSql = "";
  let pageSizeRequested = null;
  if (pageable) {
    pageNumber = Math.max(1, Math.floor(Number(args.pageNumber) || 1));
    const rawSize = Number(args.pageSize);
    pageSizeRequested = Number.isFinite(rawSize) && rawSize > 0 ? Math.floor(rawSize) : null;
    pageSize = Math.max(1, Math.min(MAX_PAGE_SIZE, pageSizeRequested || 12));
    limitSql = " LIMIT ? OFFSET ?";
  } else {
    limitSql = " LIMIT " + MAX_UNPAGED;
  }

  const SORTS = {
    priority: "t.priority", target: "t.target_date", publish: "t.publish_date",
    updated: "t.updated_at", created: "t.created_at",
  };
  let order = "";
  if (args.sort !== undefined && args.sort !== null && String(args.sort).trim() !== "") {
    let key = String(args.sort).trim();
    let dir = "ASC";
    if (key.charAt(0) === "-") {
      dir = "DESC";
      key = key.slice(1);
    }
    const col = SORTS[key];
    if (!col) throw new Error("sort 取值非法：" + args.sort + "（可用 priority / target / publish / updated / created，前缀 - 表示降序）");
    if (args.order !== undefined && String(args.order).trim() !== "") {
      const o = String(args.order).trim().toUpperCase();
      if (o !== "ASC" && o !== "DESC") throw new Error("order 只能是 asc 或 desc");
      dir = o;
    }
    order = " ORDER BY " + col + " " + dir + ", t.id " + dir;
  } else {
    order = pageable
      ? " ORDER BY t.publish_date DESC, t.id DESC"
      : " ORDER BY t.priority DESC, t.target_date ASC, t.publish_date DESC, t.id ASC";
  }
  const base = " FROM task t WHERE " + where.join(" AND ");
  const total = db.prepare("SELECT COUNT(*) AS n" + base).get(...params).n;
  const queryParams = params.slice();
  if (pageable) {
    queryParams.push(pageSize, (pageNumber - 1) * pageSize);
  }
  const rows = db.prepare("SELECT t.*" + base + order + limitSql).all(...queryParams);
  const map = nodeMap(db);
  const records = rows.map(function (r) {
    return taskOut(r, map);
  });
  attachTags(db, api, records);
  attachWorkspaces(db, records);
  const returned = records.length;
  const truncated = returned < total;
  const filter = {
    pageNumber: pageable ? pageNumber : 1,
    pageSize: pageable ? pageSize : null,
    pageable: pageable,
    totalPages: pageable && pageSize ? Math.max(1, Math.ceil(total / pageSize)) : 1,
    total: total,
    returned: returned,
    truncated: truncated,
  };
  // 请求的 pageSize 超过上限时明确回显被截断，别让调用方以为按 500 取了 500 条。
  if (pageable && pageSizeRequested !== null && pageSizeRequested > pageSize) {
    filter.pageSizeRequested = pageSizeRequested;
    filter.pageSizeCapped = true;
  }
  if (activity) { filter.activityDate = activity.date; filter.activityType = activity.type; }
  if (titleKey) filter.titleKey = titleKey;
  if (tableId && tableId !== "0") filter.tableId = tableId;
  if (tableKey) filter.tableKey = tableKey;
  if (groupId && groupId !== "0") filter.groupId = groupId;
  if (args.status !== undefined && args.status !== null && args.status !== "") filter.status = String(args.status);
  if (filterTagIds.length) filter.tagIds = filterTagIds.slice();
  if (filterTagNames.length) filter.tags = filterTagNames.slice();
  if (workspaceIds.length) filter.workspaceIds = workspaceIds.slice();
  if (noWorkspace) filter.noWorkspace = true;
  if (difficultyMissing) filter.difficultyMissing = true;
  if (priorityMin !== null) filter.priorityMin = priorityMin;
  if (priorityMax !== null) filter.priorityMax = priorityMax;
  if (difficultyMin !== null) filter.difficultyMin = difficultyMin;
  if (difficultyMax !== null) filter.difficultyMax = difficultyMax;
  for (const range of ranges) for (const [key, value] of Object.entries(range)) {
    if (key !== "notices" && value) filter[key] = value;
  }
  if (multiStatus) { filter.statuses = statuses; filter.urgent = urgent; }
  if (targetFrom) filter.targetFrom = targetFrom;
  if (targetTo) filter.targetTo = targetTo;
  if (args.sort) filter.sort = String(args.sort) + (args.order ? " " + String(args.order) : "");
  return withNotices({
    records,
    current: pageable ? pageNumber : 1,
    size: pageable ? pageSize : returned,
    total: total,
    returned: returned,
    truncated: truncated,
    pageable,
    pageSize: pageable ? pageSize : null,
    filter,
  }, listNotices);
}
