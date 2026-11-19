/** 工资引擎单测：派生口径、日期校验、同日多笔、统计与软删除。 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import { bindClock, ensureSchema } from "../lib/db/db.js";
import { createSalary } from "../lib/domain/salary.js";

function fresh() {
  bindClock(() => Date.UTC(2026, 10, 18, 1, 0, 0));
  const db = new DatabaseSync(":memory:");
  ensureSchema(db);
  return createSalary({ db, log: () => {} });
}

const SOCIAL = { pension: 739.2, medical: 184.8, unemployment: 46.2, housingFund: 462 };

test("完整月结工资推导应发与实发", () => {
  const sal = fresh();
  const { item } = sal.create({
    payDate: "2026-10-15",
    cycle: "monthly",
    basePay: 8800,
    performancePay: 2200,
    performanceBonus: 800,
    allowance: 480,
    incomeTax: 175.44,
    ...SOCIAL,
    note: "2026年10月工资条",
  });
  assert.equal(item.grossPay, 12280);
  assert.equal(item.netPay, 10672.36);
  assert.equal(item.payDate, "2026-10-15");
  assert.equal(item.cycle, "monthly");
});

test("只记得应发与实发时显式值优先", () => {
  const sal = fresh();
  const { item } = sal.create({
    payDate: "2026-08-15",
    grossPay: 9640,
    netPay: 8111.56,
    incomeTax: 96.24,
    ...SOCIAL,
    note: "收入构成截图未显示",
  });
  assert.equal(item.basePay, 0);
  assert.equal(item.grossPay, 9640);
  assert.equal(item.netPay, 8111.56);
});

test("日结同日多笔，列表倒序且支持筛选", () => {
  const sal = fresh();
  sal.create({ payDate: "2026-10-15", cycle: "daily", basePay: 300 });
  sal.create({ payDate: "2026-10-15", cycle: "daily", basePay: 260 });
  sal.create({ payDate: "2026-10-16", cycle: "daily", basePay: 280 });
  const all = sal.list({});
  assert.equal(all.total, 3);
  assert.equal(all.items[0].payDate, "2026-10-16");
  const sameDay = sal.list({ from: "2026-10-15", to: "2026-10-15" });
  assert.equal(sameDay.total, 2);
  assert.equal(sal.list({ cycle: "monthly" }).total, 0);
  assert.equal(sal.list({ year: 2026 }).total, 3);
  assert.equal(sal.list({ year: 2025 }).total, 0);
});

test("部分更新后重算汇总，未传字段保留", () => {
  const sal = fresh();
  const { item } = sal.create({ payDate: "2026-10-15", basePay: 1000, incomeTax: 10, pension: 40 });
  assert.equal(item.grossPay, 1000);
  assert.equal(item.netPay, 950);
  const updated = sal.update({ id: item.id, allowance: 500, note: "补补贴" }).item;
  assert.equal(updated.basePay, 1000);
  assert.equal(updated.grossPay, 1500);
  assert.equal(updated.netPay, 1450);
  assert.equal(updated.note, "补补贴");
});

test("日期与金额校验", () => {
  const sal = fresh();
  assert.throws(() => sal.create({ payDate: "2026-02-30" }), /YYYY-MM-DD/);
  assert.throws(() => sal.create({ payDate: "2026-13-01" }), /YYYY-MM-DD/);
  assert.throws(() => sal.create({ payDate: "" }), /不能为空/);
  assert.throws(() => sal.create({ payDate: "2026-10-15", incomeTax: -1 }), /不能为负数/);
  assert.throws(() => sal.create({ payDate: "2026-10-15", basePay: "abc" }), /不是合法金额/);
  const bonus = sal.create({ payDate: "2026-10-15", performanceBonus: -200, basePay: 1000 }).item;
  assert.equal(bonus.performanceBonus, -200);
  assert.equal(bonus.grossPay, 800);
});

test("年度统计：月桶求和、月均、环比与最近月构成", () => {
  const sal = fresh();
  sal.create({ payDate: "2026-07-15", basePay: 9400, incomeTax: 89.03, ...SOCIAL });
  sal.create({ payDate: "2026-08-15", grossPay: 9640, netPay: 8111.56, incomeTax: 96.24, ...SOCIAL });
  sal.create({ payDate: "2026-09-15", grossPay: 9720, netPay: 8189.17, incomeTax: 98.63, ...SOCIAL });
  sal.create({ payDate: "2026-10-15", basePay: 8800, performancePay: 2200, performanceBonus: 800, allowance: 480, incomeTax: 175.44, ...SOCIAL });
  const s = sal.stats({ year: 2026 });
  assert.equal(s.records, 4);
  assert.equal(s.months, 4);
  assert.equal(s.monthly[9].netPay, 10672.36);
  assert.equal(s.monthly[9].records, 1);
  assert.equal(s.monthly[0].records, 0);
  assert.equal(s.netTotal, 34851.86);
  assert.equal(s.grossTotal, 41040);
  assert.equal(s.incomeTaxTotal, 459.34);
  assert.equal(s.latest.payDate, "2026-10-15");
  assert.equal(s.latestMonth.month, 10);
  assert.equal(s.latestMonth.breakdown.fields.basePay, 8800);
  assert.equal(s.mom.amount, 2483.19);
  assert.equal(s.previousMonth.month, 9);
  assert.equal(s.avgNetPay, 8712.97);
  assert.deepEqual(s.social, { pension: 2956.8, medical: 739.2, unemployment: 184.8, housingFund: 1848 });
  assert.equal(s.socialTotal, 5728.8);
  assert.equal(s.monthly[6].pension, 739.2);
  assert.equal(s.monthly[9].housingFund, 462);
  assert.equal(s.monthly[6].basePay, 9400);
  assert.equal(s.monthly[6].performancePay, 0);
  assert.equal(s.monthly[9].basePay, 8800);
  assert.equal(s.monthly[9].performancePay, 2200);
  assert.equal(s.monthly[6].allowance, 0);
  assert.equal(s.monthly[8].allowance, 0);
  assert.equal(s.monthly[9].allowance, 480);
  assert.equal(s.monthly[9].performanceBonus, 800);
  assert.equal(s.monthly[7].performanceBonus, 0);
});

test("软删除后不再返回，dataQuery 白名单", () => {
  const sal = fresh();
  const { item } = sal.create({ payDate: "2026-10-15", netPay: 100 });
  assert.deepEqual(sal.remove({ id: item.id }), { deleted: true, id: item.id });
  assert.equal(sal.list({}).total, 0);
  assert.throws(() => sal.get({ id: item.id }), /不存在/);
  assert.throws(() => sal.dataQuery({ table: "sqlite_master" }), /不允许/);
  assert.equal(sal.dataQuery({ table: "salary_record" }).rows.length, 1);
});

test("status 返回最近一笔与今年累计", () => {
  const sal = fresh();
  sal.create({ payDate: "2026-09-15", netPay: 100 });
  sal.create({ payDate: "2026-10-15", netPay: 200 });
  sal.create({ payDate: "2025-12-15", netPay: 50 });
  const s = sal.status();
  assert.equal(s.records, 3);
  assert.equal(s.latestDate, "2026-10-15");
  assert.equal(s.latestNetPay, 200);
  assert.equal(s.currentYear, 2026);
  assert.equal(s.currentYearNetPay, 300);
});
