/** 工资引擎单测：派生口径、日期校验、同日多笔、统计与软删除。 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import { bindClock, ensureSchema } from "../lib/db/db.js";
import { createSalary } from "../lib/domain/salary.js";
import { MONEY_FIELDS } from "../lib/domain/model.js";

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

test("所属期独立保存，跨年统计按选定口径归月", () => {
  const sal = fresh();
  const { item } = sal.create({ payDate: "2026-01-15", grossPay: 100, netPay: 90, note: "原备注" });
  assert.equal(item.incomePeriod, "2025-12");
  assert.equal(sal.create({ payDate: "2026-02-03", cycle: "daily", netPay: 20 }).item.incomePeriod, "2026-02-03");
  assert.equal(sal.stats({ year: 2026 }).monthly[0].netPay, 90);
  assert.equal(sal.stats({ year: 2025 }).records, 0);
  const income = sal.stats({ year: 2025, basis: "income" });
  assert.equal(income.monthly[11].netPay, 90);
  assert.equal(income.netTotal, 90);
  assert.equal(income.latestMonth.breakdown.fields.netPay, 90);
  assert.equal(sal.stats({ year: 2026, basis: "income" }).netTotal, 20);
  const changed = sal.update({ id: item.id, incomePeriod: "2025-11" }).item;
  assert.equal(changed.payDate, item.payDate);
  assert.equal(changed.note, item.note);
  assert.equal(changed.netPay, item.netPay);
  assert.equal(changed.grossPay, item.grossPay);
  assert.equal(sal.get({ id: item.id }).item.incomePeriod, "2025-11");
  assert.equal(sal.update({ id: item.id, incomePeriod: "" }).item.incomePeriod, null);
  assert.throws(() => sal.update({ id: item.id, incomePeriod: "2026-13" }), /工资所属期/);
  assert.throws(() => sal.stats({ basis: "invalid" }), /统计口径/);
});

test("旧库迁移只加列，不回填所属期或修改工资记录", () => {
  const db = new DatabaseSync(":memory:");
  ensureSchema(db);
  const sal = createSalary({ db, log: () => {} });
  const { item } = sal.create({ payDate: "2026-01-15", netPay: 80, note: "2025年12月工资" });
  db.exec("DROP INDEX idx_salary_income_period; ALTER TABLE salary_record DROP COLUMN income_period");
  const before = db.prepare("SELECT * FROM salary_record").get();
  ensureSchema(db);
  ensureSchema(db);
  const { income_period: period, ...after } = db.prepare("SELECT * FROM salary_record").get();
  assert.equal(period, null);
  assert.deepEqual(after, { ...before });
  assert.equal(sal.stats({ year: 2026 }).netTotal, 80);
  const income = sal.stats({ year: 2025, basis: "income" });
  assert.equal(income.records, 0);
  assert.equal(income.unassignedRecords, 1);
  assert.equal(sal.update({ id: item.id, note: "仅改备注" }).item.incomePeriod, null);
  sal.remove({ id: item.id });
  assert.equal(sal.stats({ year: 2025, basis: "income" }).unassignedRecords, 0);
  db.close();
});

test("用工类型：可选、可改、可清空、可筛选，不影响金额", () => {
  const sal = fresh();
  const a = sal.create({ payDate: "2026-07-15", employmentType: "probation", basePay: 1000 }).item;
  assert.equal(a.employmentType, "probation");
  assert.equal(a.grossPay, 1000);
  assert.equal(sal.create({ payDate: "2026-08-15", basePay: 100 }).item.employmentType, null);
  assert.equal(sal.list({ employmentType: "probation" }).total, 1);
  assert.equal(sal.list({ employmentType: "intern" }).total, 0);
  const changed = sal.update({ id: a.id, employmentType: "regular" }).item;
  assert.equal(changed.employmentType, "regular");
  assert.equal(changed.grossPay, 1000);
  assert.equal(sal.update({ id: a.id, employmentType: "" }).item.employmentType, null);
  assert.throws(() => sal.create({ payDate: "2026-09-15", employmentType: "boss" }), /用工类型/);
  assert.throws(() => sal.create({ payDate: "2026-09-15", employmentType: "实习" }), /用工类型/);
});

test("旧库补 employment_type 列且保留原有记录", () => {
  const db = new DatabaseSync(":memory:");
  db.exec(`CREATE TABLE salary_record (
    id TEXT PRIMARY KEY, pay_date TEXT NOT NULL, income_period TEXT, cycle TEXT NOT NULL DEFAULT 'monthly',
    ${MONEY_FIELDS.map((f) => f.column + " REAL NOT NULL DEFAULT 0").join(", ")},
    note TEXT NOT NULL DEFAULT '',
    created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL, deleted_at INTEGER, rev INTEGER NOT NULL DEFAULT 1
  )`);
  db.prepare("INSERT INTO salary_record (id,pay_date,cycle,net_pay,created_at,updated_at) VALUES (?,?,?,?,?,?)")
    .run("sal_legacy", "2026-08-15", "monthly", 1234.56, 1, 1);
  ensureSchema(db);
  const row = db.prepare("SELECT * FROM salary_record WHERE id='sal_legacy'").get();
  assert.equal(row.employment_type, null);
  assert.equal(row.net_pay, 1234.56);
  const sal = createSalary({ db, log: () => {} });
  assert.equal(sal.get({ id: "sal_legacy" }).item.employmentType, null);
  assert.equal(sal.update({ id: "sal_legacy", employmentType: "intern" }).item.employmentType, "intern");
  db.close();
});

test("年度与季度聚合：跨年出点、单笔最高与均值、空年空季不补 0", () => {
  const sal = fresh();
  sal.create({ payDate: "2025-11-15", grossPay: 8000, netPay: 7000 });
  sal.create({ payDate: "2026-07-15", basePay: 9400, incomeTax: 89.03, ...SOCIAL });
  sal.create({ payDate: "2026-08-15", grossPay: 9640, netPay: 8111.56, incomeTax: 96.24, ...SOCIAL });
  sal.create({ payDate: "2026-10-15", basePay: 8800, performancePay: 2200, performanceBonus: 800, allowance: 480, incomeTax: 175.44, ...SOCIAL });
  const s = sal.stats({ year: 2026 });

  // 年度线：只画真实有记录的年份，2025 单独一个点。
  assert.deepEqual(s.yearly.map((y) => y.bucket), ["2025", "2026"]);
  const y2025 = s.yearly[0];
  const y2026 = s.yearly[1];
  assert.equal(y2025.count, 1);
  assert.equal(y2025.netTotal, 7000);
  assert.equal(y2025.grossTotal, 8000);
  assert.equal(y2025.netMax, 7000);
  assert.equal(y2025.netAvg, 7000);
  assert.equal(y2026.count, 3);
  assert.equal(y2026.netTotal, 26662.69);
  assert.equal(y2026.grossTotal, 31320);
  assert.equal(y2026.netMax, 10672.36);
  assert.equal(y2026.grossMax, 12280);
  assert.equal(y2026.netAvg, 8887.56);
  assert.equal(y2026.grossAvg, 10440);

  // 季度线：按到账日期归集，跨年季度写成 2025-Q4 这种形态。
  assert.deepEqual(s.quarterly.map((q) => q.bucket), ["2025-Q4", "2026-Q3", "2026-Q4"]);
  assert.equal(s.quarterly[0].count, 1);
  assert.equal(s.quarterly[1].count, 2);
  assert.equal(s.quarterly[1].netTotal, 15990.33);
  assert.equal(s.quarterly[2].netTotal, 10672.36);

  // 空年空季不补 0：2024 没有任何记录，就不会出现在年度线上。
  assert.equal(s.yearly.some((y) => y.bucket === "2024"), false);
  const empty = sal.stats({ year: 2020 });
  assert.equal(empty.records, 0);
  assert.equal(empty.monthly.every((m) => m.records === 0), true);
  // 空年份仍然返回全部历史年度线，供「跨年度趋势」展示。
  assert.deepEqual(empty.yearly.map((y) => y.bucket), ["2025", "2026"]);
  assert.deepEqual(empty.quarterly.map((q) => q.bucket), ["2025-Q4", "2026-Q3", "2026-Q4"]);
});

test("年度与季度聚合跟随归月口径：到账月与所属月分别归集", () => {
  const sal = fresh();
  // 2026-01-15 发的是 2025 年 12 月的工资。
  sal.create({ payDate: "2026-01-15", incomePeriod: "2025-12", grossPay: 9000, netPay: 7600 });
  sal.create({ payDate: "2026-02-15", incomePeriod: "2026-01", grossPay: 9200, netPay: 7800 });

  const arrival = sal.stats({ year: 2026, basis: "arrival" });
  assert.deepEqual(arrival.yearly.map((y) => y.bucket), ["2026"]);
  assert.deepEqual(arrival.quarterly.map((q) => q.bucket), ["2026-Q1"]);
  assert.equal(arrival.yearly[0].netTotal, 15400);
  assert.equal(arrival.quarterly[0].count, 2);

  const income = sal.stats({ year: 2026, basis: "income" });
  assert.deepEqual(income.yearly.map((y) => y.bucket), ["2025", "2026"]);
  assert.deepEqual(income.quarterly.map((q) => q.bucket), ["2025-Q4", "2026-Q1"]);
  assert.equal(income.yearly[0].netTotal, 7600);
  assert.equal(income.yearly[1].netTotal, 7800);
  assert.equal(income.quarterly[1].count, 1);

  // 同比与分布都跟当前年份、当前口径，不串年份。
  assert.equal(arrival.priorYear, 2025);
  assert.equal(arrival.priorMonthly.length, 12);
  assert.equal(arrival.distribution.reduce((n, d) => n + d.count, 0), 2);
  assert.equal(income.distribution.reduce((n, d) => n + d.count, 0), 1);
});
