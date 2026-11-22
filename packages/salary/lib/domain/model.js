/** 工资字段、金额校验与派生口径：日期维度，日结/月结共用一套金额字段。 */

/**
 * 18 个金额字段。group 决定表单分组：
 * income 收入项 / pretax 税前扣款 / social 社保与个税 / total 汇总。
 * signed 只给「绩效奖惩」：它是净额，负数表示扣罚。
 */
export const MONEY_FIELDS = [
  { key: "basePay", column: "base_pay", label: "基本工资", group: "income" },
  { key: "performancePay", column: "performance_pay", label: "绩效工资", group: "income" },
  { key: "positionPay", column: "position_pay", label: "岗位工资", group: "income" },
  { key: "allowance", column: "allowance", label: "补贴", group: "income" },
  { key: "performanceBonus", column: "performance_bonus", label: "绩效奖惩", group: "income", signed: true },
  { key: "otherPay", column: "other_pay", label: "其他收入", group: "income" },
  { key: "holidayOvertime", column: "holiday_overtime", label: "法定假期加班工资", group: "income" },
  { key: "sickDeduction", column: "sick_deduction", label: "病假扣款", group: "pretax" },
  { key: "personalDeduction", column: "personal_deduction", label: "事假扣款", group: "pretax" },
  { key: "otherDeduction", column: "other_deduction", label: "其他扣款", group: "pretax" },
  { key: "grossPay", column: "gross_pay", label: "应发税前工资", group: "total" },
  { key: "pension", column: "pension", label: "养老", group: "social" },
  { key: "medical", column: "medical", label: "医疗", group: "social" },
  { key: "unemployment", column: "unemployment", label: "失业", group: "social" },
  { key: "housingFund", column: "housing_fund", label: "公积金", group: "social" },
  { key: "incomeTax", column: "income_tax", label: "个税", group: "social" },
  { key: "postTaxDeduction", column: "post_tax_deduction", label: "税后扣除", group: "social" },
  { key: "netPay", column: "net_pay", label: "实发工资", group: "total" },
];

const keysOf = (group) => MONEY_FIELDS.filter((f) => f.group === group).map((f) => f.key);

export const INCOME_KEYS = keysOf("income");
export const PRETAX_KEYS = keysOf("pretax");
export const SOCIAL_KEYS = ["pension", "medical", "unemployment", "housingFund"];
export const TAX_KEYS = ["incomeTax", "postTaxDeduction"];
export const CYCLE_VALUES = ["monthly", "daily"];
export const CYCLE_LABELS = { monthly: "月结", daily: "日结" };

/**
 * 用工类型：与结算方式（月结/日结）相互独立。
 * 只用于分类与统计切片，不参与金额推导；旧记录可为空（未设置）。
 */
export const EMPLOYMENT_TYPES = [
  { value: "temp", label: "临时" },
  { value: "parttime", label: "兼职" },
  { value: "side", label: "外快" },
  { value: "intern", label: "实习" },
  { value: "probation", label: "试用" },
  { value: "regular", label: "正式" },
];
export const EMPLOYMENT_VALUES = EMPLOYMENT_TYPES.map((t) => t.value);
export const EMPLOYMENT_LABELS = Object.fromEntries(EMPLOYMENT_TYPES.map((t) => [t.value, t.label]));

/** 空串/null 表示未设置；其它值必须在枚举内。 */
export function normalizeEmploymentType(value) {
  if (value === undefined || value === null || value === "") return null;
  const v = String(value).trim().toLowerCase();
  if (!EMPLOYMENT_VALUES.includes(v)) {
    throw new Error("用工类型只支持：" + EMPLOYMENT_TYPES.map((t) => t.label + "（" + t.value + "）").join("、"));
  }
  return v;
}

export function round2(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

export function hasValue(value) {
  return value !== undefined && value !== null && value !== "";
}

/** 读取一个金额：空值返回 undefined（交给调用方补 0）；非法或负收入抛错。 */
export function amount(value, key, label) {
  if (!hasValue(value)) return undefined;
  const n = Number(value);
  if (!Number.isFinite(n)) throw new Error((label || key) + "不是合法金额");
  const field = MONEY_FIELDS.find((f) => f.key === key);
  if (n < 0 && !(field && field.signed)) throw new Error((label || key) + "不能为负数");
  return round2(n);
}

export function sumKeys(source, keys) {
  let total = 0;
  for (const key of keys) total += Number(source[key]) || 0;
  return round2(total);
}

/** 由明细推导应发与实发；社保/个税/税后扣除从 gross 里继续扣。 */
export function derivedTotals(row) {
  const income = sumKeys(row, INCOME_KEYS);
  const preTax = sumKeys(row, PRETAX_KEYS);
  const social = sumKeys(row, SOCIAL_KEYS);
  const gross = round2(Math.max(income - preTax, 0));
  const tax = Number(row.incomeTax) || 0;
  const postTax = Number(row.postTaxDeduction) || 0;
  const net = round2(Math.max(gross - social - tax - postTax, 0));
  return { income, preTax, social, gross, net, deductions: round2(preTax + social + tax + postTax) };
}

/** 已知应发（可能被手工覆盖）时推导实发。 */
export function netFromGross(row) {
  const gross = Number(row.grossPay) || 0;
  const social = sumKeys(row, SOCIAL_KEYS);
  const tax = Number(row.incomeTax) || 0;
  const postTax = Number(row.postTaxDeduction) || 0;
  return round2(Math.max(gross - social - tax - postTax, 0));
}

export function isValidDate(text) {
  const s = String(text || "");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const [y, m, d] = s.split("-").map(Number);
  if (y < 2000 || y > 2100 || m < 1 || m > 12 || d < 1 || d > 31) return false;
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d;
}

export function requireDate(text, label) {
  const s = String(text || "").trim();
  if (!s) throw new Error((label || "日期") + "不能为空");
  if (!isValidDate(s)) throw new Error((label || "日期") + "必须是合法的 YYYY-MM-DD（2000–2100）");
  return s;
}

export function normalizeCycle(value) {
  const c = String(value || "monthly").toLowerCase();
  if (!CYCLE_VALUES.includes(c)) throw new Error("类型只支持 monthly（月结）或 daily（日结）");
  return c;
}

export function emptyMoney() {
  const row = {};
  for (const f of MONEY_FIELDS) row[f.key] = 0;
  return row;
}
