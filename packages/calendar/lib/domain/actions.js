/** 日历 action：读取允许 agent，写操作仅 UI；提醒走 message.send。 */
const obj = (properties, required = []) => ({ type: "object", properties, required, additionalProperties: false });
const str = (description) => ({ type: "string", description });
const num = (description) => ({ type: "number", description });
const bool = (description) => ({ type: "boolean", description });

export function registerCalendarActions(api, cal) {
  const defs = [];
  const action = (name, def) => { defs.push({ name, description: def.description, input: def.input }); api.action(name, def); };
  action("calendar.status", {
    description: "只读：日历数量、事件数量与未来 7 天数量",
    input: obj({}),
    execute: () => cal.status(),
  });
  action("calendar.stats", {
    description: "只读：日历首页统计（总数/未来 7 天/即将开始）",
    input: obj({}),
    execute: () => cal.stats(),
  });
  action("calendar.calendarList", {
    description: "只读：列出本地日历",
    input: obj({}),
    execute: () => cal.listCalendars(),
  });
  action("calendar.calendarCreate", {
    description: "创建本地日历（仅 UI）",
    input: obj({ name: str("日历名称，必填"), color: str("颜色，可选"), tz: str("IANA 时区，默认 Asia/Shanghai") }, ["name"]),
    execute: (args, ctx) => { if (ctx && ctx.origin && ctx.origin !== "ui") throw new Error("该操作只允许在界面中执行"); return cal.createCalendar({ name: args.name, color: args.color, tz: args.tz }) },
  });
  action("calendar.calendarUpdate", {
    description: "更新日历名称/颜色/时区（仅 UI）",
    input: obj({ id: str("日历 id"), name: str("新名称"), color: str("新颜色"), tz: str("新时区") }, ["id"]),
    execute: (args, ctx) => { if (ctx && ctx.origin && ctx.origin !== "ui") throw new Error("该操作只允许在界面中执行"); return cal.updateCalendar({ id: args.id, name: args.name, color: args.color, tz: args.tz }) },
  });
  action("calendar.calendarDelete", {
    description: "软删除日历（仅 UI；不再出现在列表，事件保留）",
    input: obj({ id: str("日历 id") }, ["id"]),
    execute: (args, ctx) => { if (ctx && ctx.origin && ctx.origin !== "ui") throw new Error("该操作只允许在界面中执行"); return cal.deleteCalendar(args.id) },
  });
  action("calendar.eventsBetween", {
    description: "只读：查询时间范围内的事件（毫秒时间戳，默认今天前后一天到未来 7 天）",
    input: obj({ from: num("起始毫秒时间戳"), to: num("结束毫秒时间戳"), calendarId: str("限定日历 id"), limit: num("1–500，默认 100") }),
    execute: (args) => cal.eventsBetween({ from: args.from, to: args.to, calendarId: args.calendarId, limit: args.limit }),
  });
  action("calendar.eventGet", {
    description: "只读：事件详情（含参与人与提醒）",
    input: obj({ id: str("事件 id") }, ["id"]),
    execute: (args) => cal.event(args.id),
  });
  action("calendar.eventCreate", {
    description: "创建事件（仅 UI）；startAt/endAt 为 UTC 毫秒，可带参与人与提醒",
    input: obj({ calendarId: str("日历 id，缺省用第一个"), title: str("标题，必填"), description: str("描述"), location: str("地点"), startAt: num("开始毫秒时间戳"), endAt: num("结束毫秒时间戳，默认开始 +1h"), allDay: bool("是否全天"), tz: str("IANA 时区"), rrule: str("RRULE 原文，不展开"), attendees: { type: "array", description: "[{name,email,role,status}]" }, reminders: { type: "array", description: "[{minutesBefore,channel,enabled}]" } }, ["title", "startAt"]),
    execute: (args, ctx) => { if (ctx && ctx.origin && ctx.origin !== "ui") throw new Error("该操作只允许在界面中执行"); return cal.createEvent({ calendarId: args.calendarId, title: args.title, description: args.description, location: args.location, startAt: args.startAt, endAt: args.endAt, allDay: args.allDay, tz: args.tz, rrule: args.rrule, attendees: args.attendees, reminders: args.reminders }) },
  });
  action("calendar.eventUpdate", {
    description: "更新事件字段（仅 UI；不传的字段保持原值）",
    input: obj({ id: str("事件 id"), title: str("标题"), description: str("描述"), location: str("地点"), startAt: num("开始毫秒时间戳"), endAt: num("结束毫秒时间戳"), allDay: bool("全天"), tz: str("时区"), rrule: str("RRULE 原文"), status: { type: "string", enum: ["confirmed", "tentative", "cancelled"] } }, ["id"]),
    execute: (args, ctx) => { if (ctx && ctx.origin && ctx.origin !== "ui") throw new Error("该操作只允许在界面中执行"); return cal.updateEvent({ id: args.id, title: args.title, description: args.description, location: args.location, startAt: args.startAt, endAt: args.endAt, allDay: args.allDay, tz: args.tz, rrule: args.rrule, status: args.status }) },
  });
  action("calendar.eventDelete", {
    description: "软删除事件（仅 UI）",
    input: obj({ id: str("事件 id") }, ["id"]),
    execute: (args, ctx) => { if (ctx && ctx.origin && ctx.origin !== "ui") throw new Error("该操作只允许在界面中执行"); return cal.deleteEvent(args.id) },
  });
  action("calendar.eventRemind", {
    description: "通过消息插件发送一次事件提醒（仅 UI）",
    input: obj({ id: str("事件 id"), minutesBefore: num("提前分钟数，默认 15") }, ["id"]),
    execute: (args, ctx) => { if (ctx && ctx.origin && ctx.origin !== "ui") throw new Error("该操作只允许在界面中执行"); return cal.remind({ id: args.id, minutesBefore: args.minutesBefore }) },
  });
  action("calendar.dataTables", {
    description: "只读：日历域可浏览的表与列",
    input: obj({}),
    execute: () => ({ tables: [
      { name: "calendar", columns: ["id", "name", "color", "tz", "created_at", "updated_at"] },
      { name: "calendar_event", columns: ["id", "calendar_id", "title", "start_at", "end_at", "tz", "rrule", "status", "updated_at"] },
      { name: "calendar_attendee", columns: ["id", "event_id", "name", "email", "role", "status"] },
      { name: "calendar_reminder", columns: ["id", "event_id", "minutes_before", "channel", "enabled"] },
    ] }),
  });
  action("calendar.dataQuery", {
    description: "只读：白名单表查询（仅 UI；limit ≤ 100）",
    input: obj({ table: { type: "string", enum: ["calendar", "calendar_event", "calendar_attendee", "calendar_reminder"] }, limit: num("1–100，默认 20") }, ["table"]),
    execute: (args, ctx) => { if (ctx && ctx.origin && ctx.origin !== "ui") throw new Error("该操作只允许在界面中执行"); return cal.dataQuery({ table: args.table, limit: args.limit }) },
  });
  action("calendar.actionSchema", {
    description: "只读：本插件注册的 action 清单",
    input: obj({}),
    execute: () => ({
      shellVersion: api.shellVersion || "",
      domains: [{ id: "wb-addon-calendar", version: (api.addon && api.addon.version) || "0.1.0" }],
      actions: defs.filter((d) => d.name !== "calendar.actionSchema").map((d) => ({ ...d, domain: "wb-addon-calendar", examples: d.examples || [] })),
    }),
  });
}
