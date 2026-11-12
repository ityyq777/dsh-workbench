// Timeline reads and whole-line merges. No dependency on action registration.
import { timelineIdArg, requireTimeline, activeTimeline, setMembership, touchTimelines } from "./timeline-store.js";
import { idOf, nodeMap, taskOut, now } from "../db/db.js";
import { taskTransaction } from "../task/write/task-transaction.js";
import { getTask } from "../task/model/task-model.js";

const LIVE = "t.deleted_at IS NULL AND t.status!='3' AND l.deleted_at IS NULL AND e.deleted_at IS NULL";
const MEMBERS = "task t JOIN task_timeline_link l ON l.task_id=t.id JOIN task_timeline e ON e.id=l.timeline_id";
export const TIMELINE_PAGE_SCHEMA = {
  pageNumber: { type: "integer", minimum: 1, default: 1 },
  pageSize: { type: "integer", minimum: 1, maximum: 200, default: 20 },
};
function pagination(args) {
  const current = args.pageNumber === undefined ? 1 : args.pageNumber;
  const size = args.pageSize === undefined ? 20 : args.pageSize;
  if (!Number.isSafeInteger(current) || current < 1) throw new Error("pageNumber 必须为正整数");
  if (!Number.isSafeInteger(size) || size < 1 || size > 200) throw new Error("pageSize 必须为 1..200 整数");
  if (!Number.isSafeInteger((current - 1) * size)) throw new Error("pageNumber 过大");
  return { current, size, offset: (current - 1) * size };
}

/** lastActivityDate: latest publish/done/shutdown or local creation/update day;
 * target_date is a plan, not an activity. Closed tasks count only in taskCount.
 * One statement includes the filtered total even on an empty/out-of-range page.
 */
export function timelines(db, args) {
  const { current, size, offset } = pagination(args);
  if (args.includeSingletons !== undefined && typeof args.includeSingletons !== "boolean") throw new Error("includeSingletons 必须为布尔值");
  const titleKey = String(args.titleKey ?? "").trim();
  const rows = db.prepare(
    "WITH eligible AS (SELECT t.*,l.timeline_id FROM " + MEMBERS + " WHERE " + LIVE + "), " +
    "counts AS (SELECT timeline_id,COUNT(*) AS taskCount,SUM(status='0') AS openCount,SUM(status='2') AS doneCount,MIN(publish_date) AS firstPublishDate," +
    "MAX(MAX(COALESCE(publish_date,''),COALESCE(done_date,''),COALESCE(shutdown_date,''),COALESCE(date(created_at/1000.0,'unixepoch','localtime'),''),COALESCE(date(updated_at/1000.0,'unixepoch','localtime'),''))) AS lastActivityDate FROM eligible GROUP BY timeline_id), " +
    "grouped AS (SELECT e.id AS timelineKey,e.id AS timelineId,e.title,e.description,e.updated_at AS timelineUpdatedAt,COALESCE(c.taskCount,0) AS taskCount,COALESCE(c.openCount,0) AS openCount,COALESCE(c.doneCount,0) AS doneCount,c.firstPublishDate,c.lastActivityDate FROM task_timeline e LEFT JOIN counts c ON c.timeline_id=e.id WHERE e.deleted_at IS NULL), " +
    "filtered AS (SELECT * FROM grouped WHERE taskCount>=? AND (instr(lower(title),lower(?))>0 OR instr(lower(COALESCE(description,'')),lower(?))>0)), " +
    "page AS (SELECT * FROM filtered ORDER BY lastActivityDate DESC,timelineKey ASC LIMIT ? OFFSET ?) " +
    "SELECT page.*,totals.total FROM (SELECT COUNT(*) AS total FROM filtered) totals LEFT JOIN page ON 1=1 ORDER BY page.lastActivityDate DESC,page.timelineKey ASC"
  ).all(args.includeSingletons === true ? 0 : 2,titleKey,titleKey,size,offset);
  return { records: rows.filter(r => r.timelineKey !== null).map(({ total, ...row }) => ({ ...row })), total: Number(rows[0].total), current, size };
}

export function timelineTasks(db, args) {
  const key = timelineIdArg(args, false);
  const paged = args.pageNumber !== undefined || args.pageSize !== undefined;
  const { current, size, offset } = pagination(args);
  if (!key) return paged ? { records: [], total: 0, current, size } : [];
  const where = " WHERE l.timeline_id=? AND " + LIVE;
  const rows = db.prepare("SELECT t.* FROM " + MEMBERS + where + " ORDER BY t.publish_date ASC,t.id ASC" + (paged ? " LIMIT ? OFFSET ?" : "")).all(...(paged ? [key,size,offset] : [key]));
  const map = nodeMap(db);
  const records = rows.map(r => taskOut(r, map));
  if (!paged) return records;
  const total = Number(db.prepare("SELECT COUNT(*) AS total FROM " + MEMBERS + where).get(key).total);
  return { records, total, current, size };
}

export function timelineRefactor(db, args, origin, api) {
  const key = timelineIdArg(args, false);
  if (!key) throw new Error("timelineKey 不能为空");
  const byKeys = args.timelineKeys !== undefined;
  if (byKeys && args.ids !== undefined) throw new Error("ids 与 timelineKeys 互斥");
  const input = byKeys ? args.timelineKeys : args.ids;
  if (!Array.isArray(input) || !input.length || input.some(x => !idOf(x))) throw new Error((byKeys ? "timelineKeys" : "ids") + " 不能为空");
  const selection = [...new Set(input.map(idOf))];
  if (byKeys && !selection.includes(key)) throw new Error("timelineKey 必须属于 timelineKeys");
  const dryRun = args.dryRun === true;
  const plan = (transactionApi = api) => {
    requireTimeline(db,key);
    let rows;
    if (byKeys) {
      // json_each avoids SQLite's bind-variable ceiling without chunking or list caps.
      rows = db.prepare("SELECT t.*,l.timeline_id AS entity_id FROM " + MEMBERS + " WHERE " + LIVE + " AND l.timeline_id IN (SELECT value FROM json_each(?)) ORDER BY t.publish_date ASC,t.id ASC").all(JSON.stringify(selection));
      const found = new Set(rows.map(r => r.entity_id));
      for (const selected of selection) if (!found.has(selected)) throw new Error("时间线不存在或没有有效任务：" + selected);
    } else {
      rows = selection.map(id => {
        const row = getTask(db,id);
        if (!row) throw new Error("任务不存在：" + id);
        return row;
      });
    }
    // Preserve the existing explicit-id receipt and update semantics.
    const changed = rows.filter(r => (byKeys ? r.entity_id : activeTimeline(db,r.id)?.id) !== key);
    if (!dryRun) {
      const ts = now();
      const touched = new Set();
      for (const cur of changed) setMembership(db,cur.id,key,origin,transactionApi,{ts,touched});
      touchTimelines(db,touched,origin,transactionApi,ts);
    }
    const receipt = { timelineId: key, timelineKey: key, ...(dryRun ? { dryRun:true, updated:0, wouldUpdate:changed.length } : { updated:changed.length }) };
    return byKeys ? { ...receipt, timelineKeys:selection, total:rows.length, selectedCount:rows.length } : { ...receipt, ids:rows.map(r => String(r.id)) };
  };
  if (dryRun) return plan();
  return taskTransaction(db, api, plan);
}

export function registerTimelineActions(api) {
  api.action("tasks.timelines", {
    description: "分页列出时间线，默认20条、过滤单任务线；排除已重启和已删除任务。按独立实体标题或描述的字面子串搜索（不搜索成员任务标题）；includeSingletons=true 包含单成员及空线；openCount仅status0，doneCount仅status2。lastActivityDate为发布/完成/关闭日与创建/修改时间的本地日最大值，不计计划targetDate；按最近活动倒序、timelineKey正序稳定排序。返回{records,total,current,size}。",
    input: { type:"object", properties: { titleKey:{type:"string",description:"时间线实体标题或描述的字面子串搜索，ASCII 大小写不敏感，不搜索成员任务标题"}, ...TIMELINE_PAGE_SCHEMA, includeSingletons:{type:"boolean",default:false,description:"true 包含单成员及空线；默认仅列至少两个可见成员的线"} } },
    execute: args => timelines(api.db,args || {}),
    render: result => "时间线 " + result.total + " 条",
  });
}
