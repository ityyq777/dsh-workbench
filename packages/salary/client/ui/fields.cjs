"use strict";
/** 字段分组、金额格式化与实时汇总；记录页表单与详情共用。 */
var GROUPS = [
  { id: "income", title: "收入项", hint: "计入应发税前工资", keys: ["basePay", "performancePay", "positionPay", "allowance", "performanceBonus", "otherPay", "holidayOvertime"] },
  { id: "pretax", title: "税前扣款", hint: "先从收入中扣除", keys: ["sickDeduction", "personalDeduction", "otherDeduction"] },
  { id: "social", title: "社保与个税", hint: "再从应发中扣除", keys: ["pension", "medical", "unemployment", "housingFund", "incomeTax", "postTaxDeduction"] },
];

var LABELS = {
  basePay: "基本工资", performancePay: "绩效工资", positionPay: "岗位工资", allowance: "补贴",
  performanceBonus: "绩效奖惩", otherPay: "其他收入", holidayOvertime: "法定假期加班工资",
  sickDeduction: "病假扣款", personalDeduction: "事假扣款", otherDeduction: "其他扣款",
  grossPay: "应发税前工资", pension: "养老", medical: "医疗", unemployment: "失业",
  housingFund: "公积金", incomeTax: "个税", postTaxDeduction: "税后扣除", netPay: "实发工资",
};

var KEYS = ["basePay", "performancePay", "positionPay", "allowance", "performanceBonus", "otherPay", "holidayOvertime", "sickDeduction", "personalDeduction", "otherDeduction", "grossPay", "pension", "medical", "unemployment", "housingFund", "incomeTax", "postTaxDeduction", "netPay"];
var INCOME_KEYS = GROUPS[0].keys;
var PRETAX_KEYS = GROUPS[1].keys;
var SOCIAL_KEYS = ["pension", "medical", "unemployment", "housingFund"];
var TAX_KEYS = ["incomeTax", "postTaxDeduction"];

function num(value) {
  var n = Number(String(value === undefined || value === null ? "" : value).replace(/,/g, "").trim());
  return Number.isFinite(n) ? n : 0;
}

function fmtAmount(n) {
  return (Math.round((Number(n) || 0) * 100) / 100).toFixed(2);
}

function money(n) {
  if (n === null || n === undefined || n === "" || !Number.isFinite(Number(n))) return "—";
  return Number(n).toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function sumValues(values, keys) {
  var total = 0;
  for (var i = 0; i < keys.length; i += 1) total += num(values[keys[i]]);
  return Math.round((total + Number.EPSILON) * 100) / 100;
}

function totals(values) {
  var income = sumValues(values, INCOME_KEYS);
  var preTax = sumValues(values, PRETAX_KEYS);
  var social = sumValues(values, SOCIAL_KEYS);
  var tax = sumValues(values, TAX_KEYS);
  var gross = Math.max(Math.round((income - preTax) * 100) / 100, 0);
  var net = Math.max(Math.round((gross - social - tax) * 100) / 100, 0);
  return { income: income, preTax: preTax, social: social, tax: tax, gross: gross, net: net };
}

function blankValues() {
  var values = {};
  for (var i = 0; i < KEYS.length; i += 1) values[KEYS[i]] = "";
  return values;
}

var WEEKDAYS = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
function weekday(dateStr) {
  var parts = String(dateStr || "").split("-").map(Number);
  if (parts.length !== 3 || !parts[0]) return "";
  return WEEKDAYS[new Date(Date.UTC(parts[0], parts[1] - 1, parts[2])).getUTCDay()] || "";
}

function monthLabel(period) {
  var parts = String(period || "").split("-");
  return parts.length === 2 ? parts[0] + "年" + Number(parts[1]) + "月" : period;
}

/** 发薪日对应的所属月份，返回 YYYY-MM。 */
function incomePeriod(payDate) {
  var parts = String(payDate || "").split("-").map(Number);
  if (parts.length !== 3 || !parts[0] || !parts[1]) return "";
  var year = parts[0];
  var month = parts[1] - 1;
  if (month === 0) { month = 12; year -= 1; }
  return year + "-" + String(month).padStart(2, "0");
}

function incomeLabel(payDate) {
  return monthLabel(incomePeriod(payDate));
}

/** 新记录的默认备注：月结写「X年X月工资」，日结留空。 */
function defaultNote(payDate, cycle) {
  if (!payDate || cycle === "daily") return "";
  var label = incomeLabel(payDate);
  return label ? label + "工资" : "";
}

module.exports = {
  GROUPS: GROUPS, KEYS: KEYS, LABELS: LABELS,
  INCOME_KEYS: INCOME_KEYS, PRETAX_KEYS: PRETAX_KEYS, SOCIAL_KEYS: SOCIAL_KEYS, TAX_KEYS: TAX_KEYS,
  num: num, money: money, fmtAmount: fmtAmount, sumValues: sumValues, totals: totals,
  blankValues: blankValues, weekday: weekday, monthLabel: monthLabel,
  incomePeriod: incomePeriod, incomeLabel: incomeLabel, defaultNote: defaultNote,
};
