/** 工资域引擎：日期维度的 CRUD、年度统计与数据浏览；同日允许多笔（日结）。 */
import { newId, now, salaryRow } from "../db/db.js";
import {
  MONEY_FIELDS,
  amount,
  derivedTotals,
  hasValue,
  netFromGross,
  normalizeCycle,
  normalizeEmploymentType,
  requireDate,
  round2,
  sumKeys,
  PRETAX_KEYS,
  SOCIAL_KEYS,
} from "./model.js";

const PAD = (n) => String(n).padStart(2, "0");
const MONTH_OF = (date) => Number(String(date).slice(5, 7));

function incomePeriod(value, payDate, cycle) {
  if (value === null || value === "") return null;
  if (value !== undefined) {
    if (typeof value === "string" && /^\d{4}-\d{2}$/.test(value)) {
      requireDate(`${value}-01`, "工资所属期");
      return value;
    }
    return requireDate(value, "工资所属期");
  }
  if (cycle === "daily") return payDate;
  const year = Number(payDate.slice(0, 4));
  const month = MONTH_OF(payDate);
  return month === 1 ? (year === 2000 ? null : `${year - 1}-12`) : `${year}-${PAD(month - 1)}`;
}

function yearNumber(value) {
  const year = Number(value) || new Date(now()).getFullYear();
  if (!Number.isInteger(year) || year < 2000 || year > 2100) throw new Error("年份必须在 2000–2100 之间");
  return year;
}

export function createSalary({ db, host, log }) {
  const one = (sql, ...args) => db.prepare(sql).get(...args);
  const all = (sql, ...args) => db.prepare(sql).all(...args);
  const run = (sql, ...args) => db.prepare(sql).run(...args);

  function record(id) {
    const row = one("SELECT * FROM salary_record WHERE id=? AND deleted_at IS NULL", String(id || ""));
    if (!row) throw new Error("工资记录不存在：" + id);
    return salaryRow(row);
  }

  function moneyInput(input) {
    const out = {};
    for (const field of MONEY_FIELDS) {
      const value = amount(input[field.key], field.key, field.label);
      out[field.key] = value === undefined ? 0 : value;
    }
    return out;
  }

  function status() {
    const year = new Date(now()).getFullYear();
    const total = one("SELECT COUNT(*) n FROM salary_record WHERE deleted_at IS NULL").n;
    const latest = one("SELECT * FROM salary_record WHERE deleted_at IS NULL ORDER BY pay_date DESC, created_at DESC LIMIT 1");
    const y = one("SELECT COUNT(*) n, COALESCE(SUM(net_pay),0) net FROM salary_record WHERE deleted_at IS NULL AND substr(pay_date,1,4)=?", String(year));
    return {
      version: "0.4.0",
      records: total,
      latestDate: latest ? latest.pay_date : "",
      latestNetPay: latest ? round2(latest.net_pay) : 0,
      currentYear: year,
      currentYearRecords: y.n,
      currentYearNetPay: round2(y.net),
    };
  }

  function list(input = {}) {
    const where = ["deleted_at IS NULL"];
    const params = [];
    if (hasValue(input.year)) {
      where.push("substr(pay_date,1,4)=?");
      params.push(String(yearNumber(input.year)));
    }
    if (hasValue(input.from)) {
      where.push("pay_date>=?");
      params.push(requireDate(input.from, "开始日期"));
    }
    if (hasValue(input.to)) {
      where.push("pay_date<=?");
      params.push(requireDate(input.to, "结束日期"));
    }
    if (hasValue(input.cycle)) {
      where.push("cycle=?");
      params.push(normalizeCycle(input.cycle));
    }
    if (hasValue(input.employmentType)) {
      where.push("employment_type=?");
      params.push(normalizeEmploymentType(input.employmentType));
    }
    const clause = where.join(" AND ");
    const limit = Math.min(Math.max(Number(input.limit) || 200, 1), 500);
    const rows = all(`SELECT * FROM salary_record WHERE ${clause} ORDER BY pay_date DESC, created_at DESC LIMIT ?`, ...params, limit);
    const total = one(`SELECT COUNT(*) n FROM salary_record WHERE ${clause}`, ...params).n;
    return { items: rows.map(salaryRow), total, year: hasValue(input.year) ? Number(input.year) : null, from: input.from || "", to: input.to || "" };
  }

  function get(input = {}) {
    return { item: record(input.id) };
  }

  function create(input = {}) {
    const payDate = requireDate(input.payDate, "发薪日期");
    const cycle = normalizeCycle(input.cycle);
    const employmentType = normalizeEmploymentType(input.employmentType);
    const period = incomePeriod(input.incomePeriod, payDate, cycle);
    const money = moneyInput(input);
    const gross = hasValue(input.grossPay) ? money.grossPay : derivedTotals(money).gross;
    const net = hasValue(input.netPay) ? money.netPay : round2(Math.max(gross - sumKeys(money, SOCIAL_KEYS) - money.incomeTax - money.postTaxDeduction, 0));
    const id = newId("sal");
    const columns = MONEY_FIELDS.map((f) => f.column);
    const values = MONEY_FIELDS.map((f) => (f.key === "grossPay" ? gross : f.key === "netPay" ? net : money[f.key]));
    const placeholders = Array.from({ length: columns.length + 8 }, () => "?").join(", ");
    run(
      `INSERT INTO salary_record (id, pay_date, income_period, cycle, employment_type, ${columns.join(", ")}, note, created_at, updated_at) VALUES (${placeholders})`,
      id,
      payDate,
      period,
      cycle,
      employmentType,
      ...values,
      String(input.note === undefined ? "" : input.note).trim(),
      now(),
      now(),
    );
    log("[salary] created", id, payDate, net);
    return { item: record(id) };
  }

  function update(input = {}) {
    const row = record(input.id);
    const patch = {};
    if (input.payDate !== undefined) patch.payDate = requireDate(input.payDate, "发薪日期");
    if (input.incomePeriod !== undefined) patch.incomePeriod = incomePeriod(input.incomePeriod);
    if (input.cycle !== undefined) patch.cycle = normalizeCycle(input.cycle);
    if (input.employmentType !== undefined) patch.employmentType = normalizeEmploymentType(input.employmentType);
    if (input.note !== undefined) patch.note = String(input.note || "").trim();
    let moneyChanged = false;
    for (const field of MONEY_FIELDS) {
      if (!hasValue(input[field.key])) continue;
      patch[field.key] = amount(input[field.key], field.key, field.label);
      if (field.group !== "total") moneyChanged = true;
    }
    const merged = { ...row, ...patch };
    const derived = derivedTotals(merged);
    if (!hasValue(input.grossPay) && moneyChanged) merged.grossPay = derived.gross;
    if (!hasValue(input.netPay) && (moneyChanged || hasValue(input.grossPay))) merged.netPay = netFromGross(merged);
    const assignments = MONEY_FIELDS.map((f) => f.column + "=?");
    run(
      `UPDATE salary_record SET pay_date=?, income_period=?, cycle=?, employment_type=?, ${assignments.join(", ")}, note=?, updated_at=?, rev=rev+1 WHERE id=? AND deleted_at IS NULL`,
      merged.payDate,
      merged.incomePeriod,
      merged.cycle,
      merged.employmentType ?? null,
      ...MONEY_FIELDS.map((f) => merged[f.key]),
      merged.note,
      now(),
      row.id,
    );
    return { item: record(row.id) };
  }

  function remove(input = {}) {
    const row = record(input.id);
    run("UPDATE salary_record SET deleted_at=?, updated_at=? WHERE id=?", now(), now(), row.id);
    return { deleted: true, id: row.id };
  }

  function breakdown(rows) {
    const fields = {};
    for (const field of MONEY_FIELDS) fields[field.key] = round2(rows.reduce((sum, r) => sum + (Number(r[field.key]) || 0), 0));
    const totals = derivedTotals(fields);
    return { fields, income: totals.income, preTax: totals.preTax, social: totals.social, tax: fields.incomeTax, net: totals.net };
  }

  function stats(input = {}) {
    const year = yearNumber(input.year);
    const basis = input.basis ?? "arrival";
    if (basis !== "arrival" && basis !== "income") throw new Error("统计口径须为 arrival 或 income");
    const dateColumn = basis === "income" ? "income_period" : "pay_date";
    const groupDate = (row) => basis === "income" ? row.incomePeriod : row.payDate;
    const rows = all(`SELECT * FROM salary_record WHERE deleted_at IS NULL AND ${dateColumn}>=? AND ${dateColumn}<? ORDER BY ${dateColumn}, pay_date, created_at, id`, `${year}-01`, `${year + 1}-01`).map(salaryRow);
    const unassignedRecords = basis === "income" ? one("SELECT COUNT(*) n FROM salary_record WHERE deleted_at IS NULL AND income_period IS NULL").n : null;
    const monthly = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      period: `${year}-${PAD(i + 1)}`,
      records: 0,
      basePay: 0,
      performancePay: 0,
      allowance: 0,
      performanceBonus: 0,
      netPay: 0,
      grossPay: 0,
      incomeTax: 0,
      socialTotal: 0,
      pension: 0,
      medical: 0,
      unemployment: 0,
      housingFund: 0,
    }));
    for (const row of rows) {
      const bucket = monthly[MONTH_OF(groupDate(row)) - 1];
      bucket.records += 1;
      bucket.basePay = round2(bucket.basePay + row.basePay);
      bucket.performancePay = round2(bucket.performancePay + row.performancePay);
      bucket.allowance = round2(bucket.allowance + row.allowance);
      bucket.performanceBonus = round2(bucket.performanceBonus + row.performanceBonus);
      bucket.netPay = round2(bucket.netPay + row.netPay);
      bucket.grossPay = round2(bucket.grossPay + row.grossPay);
      bucket.incomeTax = round2(bucket.incomeTax + row.incomeTax);
      bucket.socialTotal = round2(bucket.socialTotal + sumKeys(row, SOCIAL_KEYS));
      for (const key of SOCIAL_KEYS) bucket[key] = round2(bucket[key] + row[key]);
    }
    const monthsWithData = monthly.filter((b) => b.records > 0);
    const latestMonth = monthsWithData.length ? monthsWithData[monthsWithData.length - 1] : null;
    const previousMonth = monthsWithData.length > 1 ? monthsWithData[monthsWithData.length - 2] : null;
    const netTotal = round2(rows.reduce((sum, r) => sum + r.netPay, 0));
    const grossTotal = round2(rows.reduce((sum, r) => sum + r.grossPay, 0));
    const incomeTaxTotal = round2(rows.reduce((sum, r) => sum + r.incomeTax, 0));
    const socialTotal = round2(rows.reduce((sum, r) => sum + sumKeys(r, SOCIAL_KEYS), 0));
    const social = {};
    for (const key of SOCIAL_KEYS) social[key] = round2(rows.reduce((sum, r) => sum + r[key], 0));
    const deductionTotal = round2(
      rows.reduce(
        (sum, r) => sum + sumKeys(r, PRETAX_KEYS) + sumKeys(r, SOCIAL_KEYS) + r.incomeTax + r.postTaxDeduction,
        0,
      ),
    );
    const latest = rows.length ? rows[rows.length - 1] : null;
    const diff = latestMonth && previousMonth ? round2(latestMonth.netPay - previousMonth.netPay) : null;
    const mom = latestMonth && previousMonth
      ? { amount: diff, percent: previousMonth.netPay ? round2((diff / previousMonth.netPay) * 100) : null }
      : null;
    const latestRows = latestMonth ? rows.filter((r) => MONTH_OF(groupDate(r)) === latestMonth.month) : [];
    // 年度/季度跨期聚合：口径与 monthly 完全一致（arrival 用 pay_date、income 用 income_period），
    // 只对真实存在的年份/季度出点，空年空季不补 0，避免把「还没到的季度」画成 0。
    const datedRows = all(
      `SELECT * FROM salary_record WHERE deleted_at IS NULL AND ${dateColumn} IS NOT NULL ORDER BY ${dateColumn}, id`,
    ).map(salaryRow);
    const quarterOf = (date) => `${String(date).slice(0, 4)}-Q${Math.floor((Number(String(date).slice(5, 7)) - 1) / 3) + 1}`;
    const aggregate = (bucketOf) => {
      const map = new Map();
      for (const row of datedRows) {
        const bucket = bucketOf(basis === "income" ? row.incomePeriod : row.payDate);
        if (!bucket) continue;
        const acc = map.get(bucket) || { bucket, count: 0, netTotal: 0, grossTotal: 0, netMax: 0, grossMax: 0 };
        acc.count += 1;
        acc.netTotal = round2(acc.netTotal + row.netPay);
        acc.grossTotal = round2(acc.grossTotal + row.grossPay);
        acc.netMax = round2(Math.max(acc.netMax, row.netPay));
        acc.grossMax = round2(Math.max(acc.grossMax, row.grossPay));
        map.set(bucket, acc);
      }
      return [...map.values()]
        .sort((a, b) => (a.bucket < b.bucket ? -1 : a.bucket > b.bucket ? 1 : 0))
        .map((item) => ({ ...item, netAvg: round2(item.netTotal / item.count), grossAvg: round2(item.grossTotal / item.count) }));
    };
    const yearly = aggregate((date) => String(date).slice(0, 4));
    // 季度折线默认展示最近 8 个有记录的季度，数据不足时就是实际有几个画几个。
    const quarterly = aggregate(quarterOf).slice(-8);
    // 同比：上一年同期 12 个月的实发/应发，用于「今年 vs 去年」对照线。
    const priorYear = year - 1;
    const priorRows = all(
      `SELECT * FROM salary_record WHERE deleted_at IS NULL AND ${dateColumn}>=? AND ${dateColumn}<? ORDER BY ${dateColumn}, id`,
      `${priorYear}-01`,
      `${priorYear + 1}-01`,
    ).map(salaryRow);
    const priorMonthly = Array.from({ length: 12 }, (_, i) => ({ month: i + 1, records: 0, netPay: 0, grossPay: 0 }));
    for (const row of priorRows) {
      const bucket = priorMonthly[MONTH_OF(groupDate(row)) - 1];
      bucket.records += 1;
      bucket.netPay = round2(bucket.netPay + row.netPay);
      bucket.grossPay = round2(bucket.grossPay + row.grossPay);
    }
    // 单笔实发分布：按当前年份、当前口径的记录分档，档位边界写死便于核对。
    const DIST_BUCKETS = [
      { key: "lt5k", label: "5k 以下", upper: 5000 },
      { key: "5to8k", label: "5k–8k", upper: 8000 },
      { key: "8to12k", label: "8k–12k", upper: 12000 },
      { key: "12to20k", label: "12k–20k", upper: 20000 },
      { key: "gte20k", label: "20k 以上", upper: null },
    ];
    const distribution = DIST_BUCKETS.map((b, i) => ({ key: b.key, label: b.label, lower: i === 0 ? 0 : DIST_BUCKETS[i - 1].upper, upper: b.upper, count: 0 }));
    for (const row of rows) {
      const value = Math.max(0, row.netPay);
      const hit = distribution.find((d) => d.upper === null || value < d.upper);
      if (hit) hit.count += 1;
    }
    const peakMonth = monthsWithData.length
      ? monthsWithData.reduce((best, b) => (b.netPay > best.netPay ? b : best), monthsWithData[0])
      : null;
    const lowestMonth = monthsWithData.length
      ? monthsWithData.reduce((worst, b) => (b.netPay < worst.netPay ? b : worst), monthsWithData[0])
      : null;
    return {
      year,
      basis,
      unassignedRecords,
      records: rows.length,
      months: monthsWithData.length,
      netTotal,
      grossTotal,
      incomeTaxTotal,
      socialTotal,
      social,
      deductionTotal,
      avgNetPay: monthsWithData.length ? round2(netTotal / monthsWithData.length) : 0,
      monthly,
      latest,
      latestMonth: latestMonth ? { ...latestMonth, breakdown: breakdown(latestRows) } : null,
      previousMonth,
      mom,
      yearly,
      quarterly,
      priorYear,
      priorMonthly,
      distribution,
      peakMonth: peakMonth ? { month: peakMonth.month, period: peakMonth.period, netPay: peakMonth.netPay } : null,
      lowestMonth: lowestMonth ? { month: lowestMonth.month, period: lowestMonth.period, netPay: lowestMonth.netPay } : null,
    };
  }

  function dump() {
    return all("SELECT * FROM salary_record WHERE deleted_at IS NULL ORDER BY pay_date, created_at").map(salaryRow);
  }

  function dataQuery(input = {}) {
    if (input.table !== "salary_record") throw new Error("不允许查询该表");
    const limit = Math.min(Math.max(Number(input.limit) || 20, 1), 100);
    return { table: input.table, rows: all("SELECT * FROM salary_record LIMIT ?", limit).map(salaryRow) };
  }

  return { status, list, get, create, update, remove, stats, dump, dataQuery, record };
}
