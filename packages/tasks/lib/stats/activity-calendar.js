/** 年度任务活动：日期字段保持本地 YYYY-MM-DD，与统计列表一致；只读 SQL 聚合。
 * 事件口径定义在 ./events.js，与难度分布的五维切换共用，避免两处漂移。 */
import { EVENTS, EVENT_TYPES } from "./events.js";
import { PLAN, planRange } from "./events.js";

const TYPES = EVENT_TYPES;
// target 是计划口径：与四类事件并列展示，但不计入 total/totals.total（活动总数只数事件）。
const zero = () => ({ publish: 0, done: 0, shutdown: 0, claimed: 0, target: 0, total: 0 });

function validDay(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  return year >= 1900 && year <= 9999 && month >= 1 && month <= 12 && day >= 1 &&
    day <= [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1];
}

export function activityFilter(activityDate, activityType) {
  if (activityDate === undefined && activityType === undefined) return null;
  if (!validDay(activityDate)) throw new Error('activityDate 必须是合法的 YYYY-MM-DD 日期（1900..9999 年）');
  const type = activityType === undefined ? 'done' : activityType;
  if (!TYPES.includes(type)) throw new Error('activityType 只支持 publish / done / shutdown / claimed');
  const event = EVENTS[type];
  return {
    date: activityDate, type,
    sql: '(' + event.condition + ' AND ' + event.date + '=?)',
    params: [activityDate],
  };
}

export function activityCalendar(db, args = {}) {
  const year = args.year;
  if (!Number.isInteger(year) || year < 1900 || year > 9999) throw new Error('year 必填，必须是 1900..9999 的整数');
  const from = year + '-01-01', to = year + '-12-31';
  const plan = planRange(from, to);
  const sql = TYPES.map(key => {
    const event = EVENTS[key];
    return "SELECT " + event.date + " AS date, '" + key + "' AS kind, COUNT(*) AS n FROM task t WHERE t.deleted_at IS NULL AND " +
      event.condition + ' AND ' + event.date + ' BETWEEN ? AND ? GROUP BY ' + event.date;
  }).concat([
    "SELECT " + PLAN.date + " AS date, '" + PLAN.key + "' AS kind, COUNT(*) AS n FROM task t WHERE " +
      plan.sql + ' GROUP BY ' + PLAN.date,
  ]).join(' UNION ALL ') + ' ORDER BY date';
  const rows = db.prepare(sql).all(...TYPES.flatMap(() => [from, to]), ...plan.params);
  const daily = new Map();
  for (const row of rows) {
    if (!validDay(row.date)) continue;
    if (!daily.has(row.date)) daily.set(row.date, { date: row.date, publish: 0, done: 0, shutdown: 0, claimed: 0, target: 0 });
    daily.get(row.date)[row.kind] = Number(row.n);
  }
  const days = [...daily.values()], totals = zero(), max = zero();
  for (const day of days) {
    let total = 0;
    for (const key of TYPES) {
      totals[key] += day[key]; max[key] = Math.max(max[key], day[key]); total += day[key];
    }
    // 计划口径单列累加：既不进 total，也不参与 max.total（活动总数保持历史口径）。
    totals.target += day.target; max.target = Math.max(max.target, day.target);
    totals.total += total; max.total = Math.max(max.total, total);
  }
  return { year, days, totals, max };
}

export function registerActivityCalendarAction(api) {
  api.action('tasks.activityCalendar', {
    description: '只读年度任务活动日历，独立于 statsReport 时间范围。排除已删除任务；publish=publish_date，done=当前 status=2 且 done_date，shutdown=当前 status=1 且 shutdown_date，claimed=当前 status IN (2,4) 且按 COALESCE(claimed_at 转本地日期, publish_date) 计——已完成任务因终态清空接取列而不写库回填，历史任务的接取日按发布日期近似，前端图例注明；target=计划口径，取未删除任务的目标计划日期 target_date，按日期计数，与事件口径分开；日期均为本地日期，不按 UTC 转换。返回 year、按日期升序且仅含有事件或有目标计划日的 days:[{date,publish,done,shutdown,claimed,target}]、totals 与 max（均含四类事件、target 及 total）；totals.total 只累加四类事件，不含 target，同一任务可贡献多类事件；max.total 是单日四类事件数之和的最大值，max.target 是单日目标计划数的最大值；空年份各值为0。',
    input: { type: 'object', required: ['year'], properties: {
      year: { type: 'integer', minimum: 1900, maximum: 9999, description: '必填公历年份，1900..9999 整数；无默认值，不接受字符串。' },
    } },
    examples: [{ year: 2024 }],
    execute: args => activityCalendar(api.db, args || {}),
    render: result => JSON.stringify(result),
  });
}
