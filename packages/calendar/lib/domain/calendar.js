/** 日历域引擎：本地日历、事件、参与人、提醒；RRULE 只存原文，不展开。 */
import { calRow, eventRow, newId, now } from "../db/db.js";

export function createCalendar({ db, host, log }) {
  const one = (sql, ...args) => db.prepare(sql).get(...args);
  const all = (sql, ...args) => db.prepare(sql).all(...args);
  const run = (sql, ...args) => db.prepare(sql).run(...args);

  function cal(id) {
    const row = one("SELECT * FROM calendar WHERE id=? AND deleted_at IS NULL", id);
    if (!row) throw new Error("日历不存在：" + id);
    return row;
  }
  function event(id) {
    const row = one("SELECT * FROM calendar_event WHERE id=? AND deleted_at IS NULL", id);
    if (!row) throw new Error("事件不存在：" + id);
    const out = eventRow(row);
    out.attendees = all("SELECT id,name,email,role,status FROM calendar_attendee WHERE event_id=? ORDER BY rowid", id);
    out.reminders = all("SELECT id,minutes_before,channel,enabled FROM calendar_reminder WHERE event_id=? ORDER BY minutes_before", id).map((r) => ({ id: r.id, minutesBefore: r.minutes_before, channel: r.channel, enabled: !!r.enabled }));
    return out;
  }

  function status() {
    return { version: "0.1.0", calendars: one("SELECT COUNT(*) n FROM calendar WHERE deleted_at IS NULL").n, events: one("SELECT COUNT(*) n FROM calendar_event WHERE deleted_at IS NULL").n, upcoming: one("SELECT COUNT(*) n FROM calendar_event WHERE deleted_at IS NULL AND start_at>=?", now()).n };
  }
  function listCalendars() {
    return { items: all("SELECT * FROM calendar WHERE deleted_at IS NULL ORDER BY created_at").map(calRow) };
  }
  function createCalendar(input = {}) {
    const name = String(input.name || "").trim();
    if (!name) throw new Error("日历名称不能为空");
    const id = newId("cal");
    run("INSERT INTO calendar (id,name,color,tz,created_at,updated_at) VALUES (?,?,?,?,?,?)", id, name, String(input.color || ""), String(input.tz || "Asia/Shanghai"), now(), now());
    log("[calendar] calendar created", id);
    return calRow(cal(id));
  }
  function updateCalendar(input = {}) {
    const row = cal(input.id);
    run("UPDATE calendar SET name=?,color=?,tz=?,updated_at=?,rev=rev+1 WHERE id=?", input.name !== undefined ? String(input.name).trim() || row.name : row.name, input.color !== undefined ? String(input.color) : row.color, input.tz !== undefined ? String(input.tz) : row.tz, now(), row.id);
    return calRow(cal(row.id));
  }
  function deleteCalendar(id) {
    cal(id);
    run("UPDATE calendar SET deleted_at=?,updated_at=? WHERE id=?", now(), now(), id);
    return { deleted: true, id };
  }

  function eventsBetween(input = {}) {
    const from = Number(input.from ?? now() - 86400000);
    const to = Number(input.to ?? now() + 7 * 86400000);
    if (!Number.isFinite(from) || !Number.isFinite(to) || to < from) throw new Error("时间范围不合法");
    const limit = Math.min(Math.max(Number(input.limit) || 100, 1), 500);
    const rows = input.calendarId
      ? all("SELECT * FROM calendar_event WHERE deleted_at IS NULL AND calendar_id=? AND start_at<? AND end_at>=? ORDER BY start_at LIMIT ?", input.calendarId, to, from, limit)
      : all("SELECT * FROM calendar_event WHERE deleted_at IS NULL AND start_at<? AND end_at>=? ORDER BY start_at LIMIT ?", to, from, limit);
    return { items: rows.map(eventRow), from, to };
  }
  function createEvent(input = {}) {
    const calendarId = String(input.calendarId || "");
    if (!calendarId) {
      const first = one("SELECT id FROM calendar WHERE deleted_at IS NULL ORDER BY created_at LIMIT 1");
      if (!first) throw new Error("请先创建日历");
      input = { ...input, calendarId: first.id };
    }
    cal(input.calendarId);
    const title = String(input.title || "").trim();
    if (!title) throw new Error("事件标题不能为空");
    const startAt = Number(input.startAt);
    const endAt = Number(input.endAt ?? startAt + 3600000);
    if (!Number.isFinite(startAt) || !Number.isFinite(endAt) || endAt < startAt) throw new Error("事件时间不合法");
    const id = newId("evt");
    db.exec("BEGIN");
    try {
      run("INSERT INTO calendar_event (id,calendar_id,title,description,location,start_at,end_at,all_day,tz,rrule,status,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)", id, input.calendarId, title, String(input.description || ""), String(input.location || ""), startAt, endAt, input.allDay ? 1 : 0, String(input.tz || "Asia/Shanghai"), String(input.rrule || ""), String(input.status || "confirmed"), now(), now());
      for (const a of Array.isArray(input.attendees) ? input.attendees.slice(0, 50) : []) {
        if (!a || (!a.email && !a.name)) continue;
        run("INSERT INTO calendar_attendee (id,event_id,name,email,role,status) VALUES (?,?,?,?,?,?)", newId("att"), id, String(a.name || ""), String(a.email || ""), String(a.role || "required"), String(a.status || "needs-action"));
      }
      for (const m of Array.isArray(input.reminders) ? input.reminders.slice(0, 5) : []) {
        run("INSERT INTO calendar_reminder (id,event_id,minutes_before,channel,enabled,created_at) VALUES (?,?,?,?,?,?)", newId("rem"), id, Number(m.minutesBefore ?? m.minutes_before ?? 15), String(m.channel || "message"), m.enabled === false ? 0 : 1, now());
      }
      db.exec("COMMIT");
    } catch (e) { db.exec("ROLLBACK"); throw e; }
    return event(id);
  }
  function updateEvent(input = {}) {
    const old = event(input.id);
    run("UPDATE calendar_event SET title=?,description=?,location=?,start_at=?,end_at=?,all_day=?,tz=?,rrule=?,status=?,updated_at=?,rev=rev+1 WHERE id=?", input.title !== undefined ? String(input.title).trim() || old.title : old.title, input.description !== undefined ? String(input.description) : old.description, input.location !== undefined ? String(input.location) : old.location, input.startAt !== undefined ? Number(input.startAt) : old.startAt, input.endAt !== undefined ? Number(input.endAt) : old.endAt, input.allDay !== undefined ? (input.allDay ? 1 : 0) : (old.allDay ? 1 : 0), input.tz !== undefined ? String(input.tz) : old.tz, input.rrule !== undefined ? String(input.rrule) : old.rrule, input.status !== undefined ? String(input.status) : old.status, now(), old.id);
    return event(old.id);
  }
  function deleteEvent(id) {
    event(id);
    run("UPDATE calendar_event SET deleted_at=?,updated_at=? WHERE id=?", now(), now(), id);
    return { deleted: true, id };
  }
  async function remind(input = {}) {
    const ev = event(input.id);
    const minutes = Number(input.minutesBefore ?? 15);
    const text = `${ev.title} 将在 ${minutes} 分钟后开始` + (ev.location ? `（${ev.location}）` : "");
    const r = await host.call("message.send", { title: "日历提醒", body: text, level: "info", source: "calendar", dedupeKey: "cal:" + ev.id + ":" + minutes }, "plugin");
    return { sent: true, result: r && r.result !== undefined ? r.result : r, eventId: ev.id };
  }
  function stats() {
    const from = now();
    const to = from + 7 * 86400000;
    return { ...status(), next7d: one("SELECT COUNT(*) n FROM calendar_event WHERE deleted_at IS NULL AND start_at>=? AND start_at<?", from, to).n, calendars: one("SELECT COUNT(*) n FROM calendar WHERE deleted_at IS NULL").n };
  }
  function search(q, { limit = 10 } = {}) {
    const like = "%" + String(q || "").replace(/[\\%_]/g, "\\$&") + "%";
    return all("SELECT id,title,description,start_at FROM calendar_event WHERE deleted_at IS NULL AND (title LIKE ? ESCAPE '\\' OR description LIKE ? ESCAPE '\\' OR location LIKE ? ESCAPE '\\') ORDER BY start_at DESC LIMIT ?", like, like, like, limit).map((r) => ({ id: r.id, title: r.title, snippet: r.description || "", at: r.start_at, view: "events" }));
  }
  function dataQuery(input = {}) {
    const allow = ["calendar", "calendar_event", "calendar_attendee", "calendar_reminder"];
    if (!allow.includes(input.table)) throw new Error("不允许查询该表");
    const limit = Math.min(Math.max(Number(input.limit) || 20, 1), 100);
    return { table: input.table, rows: all("SELECT * FROM " + input.table + " LIMIT ?", limit) };
  }
  return { status, listCalendars, createCalendar, updateCalendar, deleteCalendar, eventsBetween, event, createEvent, updateEvent, deleteEvent, remind, stats, search, dataQuery };
}
