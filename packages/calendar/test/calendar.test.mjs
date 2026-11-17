import { test } from "node:test";
import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
const { ensureSchema } = await import("../lib/db/db.js");
const { createCalendar } = await import("../lib/domain/calendar.js");

function make() {
  const db = new DatabaseSync(":memory:");
  ensureSchema(db);
  const calls = [];
  const host = { call: async (name, args) => { calls.push([name, args]); return { result: { id: "m1" } }; } };
  return { db, calls, cal: createCalendar({ db, host, log: () => {} }) };
}

test("日历与事件 CRUD", () => {
  const { cal } = make();
  const c = cal.createCalendar({ name: "工作" });
  const ev = cal.createEvent({ calendarId: c.id, title: "周会", startAt: 1000, endAt: 2000, attendees: [{ email: "a@b.test" }], reminders: [{ minutesBefore: 10 }] });
  assert.equal(ev.title, "周会");
  assert.equal(ev.attendees.length, 1);
  assert.equal(ev.reminders[0].minutesBefore, 10);
  assert.equal(cal.eventsBetween({ from: 0, to: 3000 }).items.length, 1);
  const up = cal.updateEvent({ id: ev.id, title: "周会（改）" });
  assert.equal(up.title, "周会（改）");
  cal.deleteEvent(ev.id);
  assert.equal(cal.eventsBetween({ from: 0, to: 3000 }).items.length, 0);
});

test("默认日历与时间校验", () => {
  const { cal } = make();
  assert.throws(() => cal.createEvent({ title: "x", startAt: 1 }), /请先创建日历/);
  const c = cal.createCalendar({ name: "默认" });
  const ev = cal.createEvent({ title: "x", startAt: 10 });
  assert.equal(ev.calendarId, c.id);
  assert.equal(ev.endAt, 10 + 3600000);
  assert.throws(() => cal.createEvent({ title: "y", startAt: 20, endAt: 10 }), /时间不合法/);
});

test("提醒走 message.send 并带 dedupeKey", async () => {
  const { cal, calls } = make();
  cal.createCalendar({ name: "默认" });
  const ev = cal.createEvent({ title: "面试", startAt: 5000, location: "线上" });
  const r = await cal.remind({ id: ev.id, minutesBefore: 30 });
  assert.equal(r.sent, true);
  assert.equal(calls[0][0], "message.send");
  assert.equal(calls[0][1].dedupeKey, "cal:" + ev.id + ":30");
});

test("数据查询白名单与 limit", () => {
  const { cal } = make();
  cal.createCalendar({ name: "A" });
  assert.equal(cal.dataQuery({ table: "calendar" }).rows.length, 1);
  assert.throws(() => cal.dataQuery({ table: "sqlite_master" }), /不允许/);
});

test("搜索标题/描述/地点", () => {
  const { cal } = make();
  cal.createCalendar({ name: "A" });
  cal.createEvent({ title: "评审", startAt: 1, description: "工作台", location: "会议室" });
  assert.equal(cal.search("评审").length, 1);
  assert.equal(cal.search("工作台").length, 1);
  assert.equal(cal.search("会议室").length, 1);
});
