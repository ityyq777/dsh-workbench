/** 工资域数据层：pay_date 存 YYYY-MM-DD，金额 REAL 两位小数；软删除 + rev。 */
import { MONEY_FIELDS } from "../domain/model.js";

let clock = () => Date.now();
export function bindClock(fn) { clock = typeof fn === "function" ? fn : () => Date.now(); }
export function now() { return clock(); }
export function newId(prefix) { return prefix + "_" + now().toString(36) + Math.random().toString(36).slice(2, 8); }

export const MONEY_COLUMNS = MONEY_FIELDS.map((f) => f.column);

const DDL = [
  `CREATE TABLE IF NOT EXISTS salary_record (
    id TEXT PRIMARY KEY,
    pay_date TEXT NOT NULL,
    income_period TEXT,
    cycle TEXT NOT NULL DEFAULT 'monthly',
    employment_type TEXT,
    ${MONEY_FIELDS.map((f) => f.column + " REAL NOT NULL DEFAULT 0").join(",\n    ")},
    note TEXT NOT NULL DEFAULT '',
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    deleted_at INTEGER,
    rev INTEGER NOT NULL DEFAULT 1
  )`,
  "CREATE INDEX IF NOT EXISTS idx_salary_pay_date ON salary_record(pay_date)",
  "CREATE INDEX IF NOT EXISTS idx_salary_deleted ON salary_record(deleted_at)",
];

export function ensureSchema(db) {
  for (const sql of DDL) db.exec(sql);
  if (!db.prepare("PRAGMA table_info(salary_record)").all().some((col) => col.name === "income_period")) {
    db.exec("ALTER TABLE salary_record ADD COLUMN income_period TEXT");
  }
  if (!db.prepare("PRAGMA table_info(salary_record)").all().some((col) => col.name === "employment_type")) {
    db.exec("ALTER TABLE salary_record ADD COLUMN employment_type TEXT");
  }
  db.exec("CREATE INDEX IF NOT EXISTS idx_salary_income_period ON salary_record(income_period)");
}

export function salaryRow(r) {
  if (!r) return null;
  const out = { id: r.id, payDate: r.pay_date, incomePeriod: r.income_period ?? null, cycle: r.cycle, employmentType: r.employment_type ?? null };
  for (const field of MONEY_FIELDS) out[field.key] = Number(r[field.column]) || 0;
  out.note = r.note || "";
  out.createdAt = r.created_at;
  out.updatedAt = r.updated_at;
  out.rev = r.rev;
  return out;
}

export const COLUMNS = ["id", "pay_date", "income_period", "cycle", "employment_type", ...MONEY_COLUMNS, "note", "created_at", "updated_at", "rev"];
