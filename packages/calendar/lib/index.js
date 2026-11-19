/** wb-addon-calendar：本地日历、事件、参与人与提醒。 */
import { bindClock, ensureSchema } from "./db/db.js";
import { createCalendar } from "./domain/calendar.js";
import { registerCalendarActions } from "./domain/actions.js";

export const inject = ["workbench"];
let engine = null;

export function setup(api) {
  if (typeof api.now === "function") bindClock(api.now);
  ensureSchema(api.db);
  engine = createCalendar({ db: api.db, host: api, log: api.log });
  registerCalendarActions(api, engine);
  if (typeof api.registerSearchProvider === "function") {
    api.registerSearchProvider({ domainId: "wb-addon-calendar", search: (q, opts) => engine.search(q, opts) });
  }
  api.log("calendar domain ready", api.addon.version);
}

export function apply(ctx) {
  const host = ctx.workbench;
  if (!host) throw new Error("dsh-workbench 未加载：缺少 workbench 服务");
  ctx.effect(() => host.registerDomain({
    id: "wb-addon-calendar",
    title: "日历",
    description: "本地日历、事件、参与人、提醒；RRULE 只存原文，提醒复用消息插件",
    version: "0.1.2",
    tables: ["calendar", "calendar_event", "calendar_attendee", "calendar_reminder"],
    sync: { tables: [] },
    views: [
      { id: "events", title: { zh: "日程", en: "Agenda" } },
      { id: "calendars", title: { zh: "日历", en: "Calendars" } },
      { id: "config", title: { zh: "设置", en: "Settings" } },
      { id: "data", title: { zh: "数据", en: "Data" } },
      { id: "actions", title: { zh: "Action", en: "Actions" } },
    ],
    capability: {
      taskOwnership: { boundary: "日程用 calendar.eventCreate；需要跟进的行动项用 tasks.create。", query: "calendar" },
      summary: "保存本地日历与事件，支持参与人、提醒和跨域搜索；不做 CalDAV 同步。",
      records: [{ kind: "event", title: "日程", description: "标题、起止时间、时区、地点、参与人、提醒。", when: ["安排会议或日程", "查询某段时间的安排"], notFor: ["任务", "邮件"], primaryAction: "calendar.eventCreate", keyArgs: ["title", "startAt", "endAt"] }],
      fields: [
        { name: "title", type: "string", description: "事件标题，必填" },
        { name: "startAt", type: "number", description: "开始 UTC 毫秒" },
        { name: "endAt", type: "number", description: "结束 UTC 毫秒，默认开始 +1h" },
        { name: "tz", type: "string", description: "IANA 时区" },
      ],
      notFor: ["不做 CalDAV 同步", "不展开 RRULE"],
      notes: ["只在本机保存，不参与云同步；备份包含日历与事件。", "提醒通过 message.send 发送，不新建通知通道。"],
    },
    exportData: () => ({ calendars: engine.listCalendars().items, events: engine.eventsBetween({ from: 0, to: Number.MAX_SAFE_INTEGER, limit: 500 }).items }),
    importData: (payload) => {
      const data = payload && typeof payload === "object" ? payload : {};
      let imported = 0;
      for (const e of Array.isArray(data.events) ? data.events : []) {
        try { engine.createEvent(e); imported += 1; } catch { /* 跳过非法 */ }
      }
      return { imported };
    },
    setup,
  }), "calendar-domain");
}

export const CALENDAR_DOMAIN = "wb-addon-calendar";
