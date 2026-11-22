/** 工资 action：读、写都允许 agent（用户口述后可直接落库）；数据页查询仅 UI。 */
import { EMPLOYMENT_VALUES, MONEY_FIELDS } from "./model.js";
import { COLUMNS } from "../db/db.js";

const obj = (properties, required = []) => ({ type: "object", properties, required, additionalProperties: false });
const str = (description) => ({ type: "string", description });
const num = (description) => ({ type: "number", description });

const ALL_GROUPS = ["income", "pretax", "social", "total"];

function moneyProps(groups) {
  const props = {};
  for (const field of MONEY_FIELDS.filter((f) => groups.includes(f.group))) {
    const hint = field.signed ? "（可为负数，表示扣罚）" : "（默认 0）";
    const tail = field.group === "total" ? "；不传则按明细推导" : "";
    props[field.key] = num(field.label + hint + tail);
  }
  return props;
}

function amountsFrom(args) {
  return {
    basePay: args.basePay,
    performancePay: args.performancePay,
    positionPay: args.positionPay,
    allowance: args.allowance,
    performanceBonus: args.performanceBonus,
    otherPay: args.otherPay,
    holidayOvertime: args.holidayOvertime,
    sickDeduction: args.sickDeduction,
    personalDeduction: args.personalDeduction,
    otherDeduction: args.otherDeduction,
    grossPay: args.grossPay,
    pension: args.pension,
    medical: args.medical,
    unemployment: args.unemployment,
    housingFund: args.housingFund,
    incomeTax: args.incomeTax,
    postTaxDeduction: args.postTaxDeduction,
    netPay: args.netPay,
  };
}

const MONEY_SCHEMA = moneyProps(ALL_GROUPS);

export function registerSalaryActions(api, salary) {
  const defs = [];
  const action = (name, def) => {
    defs.push({ name, description: def.description, input: def.input });
    api.action(name, def);
  };

  action("salary.status", {
    description: "只读：工资记录数、最近一笔日期与实发、今年累计实发",
    input: obj({}),
    execute: () => salary.status(),
  });
  action("salary.stats", {
    description: "只读：年度工资统计（按月聚合的实发/应发/个税/社保、月均、环比、最近月构成）",
    input: obj({
      year: num("年份 2000–2100，默认今年"),
      basis: { type: "string", enum: ["arrival", "income"], description: "arrival 按到账月（默认）；income 按所属月，未归属不计入" },
    }),
    execute: (args) => salary.stats({ year: args.year, basis: args.basis }),
  });
  action("salary.recordList", {
    description: "只读：按日期倒序列出工资记录，可按年、日期区间、结算方式、用工类型筛选",
    input: obj({
      year: num("只取该年（按发薪日期）"),
      from: str("开始日期 YYYY-MM-DD（含）"),
      to: str("结束日期 YYYY-MM-DD（含）"),
      cycle: { type: "string", enum: ["monthly", "daily"], description: "结算方式：月结 / 日结" },
      employmentType: { type: "string", enum: EMPLOYMENT_VALUES, description: "用工类型：临时/兼职/外快/实习/试用/正式（temp/parttime/side/intern/probation/regular）" },
      limit: num("1–500，默认 200"),
    }),
    execute: (args) => salary.list({ year: args.year, from: args.from, to: args.to, cycle: args.cycle, employmentType: args.employmentType, limit: args.limit }),
  });
  action("salary.recordGet", {
    description: "只读：单笔工资详情（全部收入项与扣款项）",
    input: obj({ id: str("工资记录 id") }, ["id"]),
    execute: (args) => salary.get({ id: args.id }),
  });
  action("salary.recordCreate", {
    description: "新增一笔工资（会写库，agent 可直接调用）：按发薪日期记录日结/月结工资，金额缺省 0，应发与实发默认由明细推导",
    input: obj({
      payDate: str("发薪日期 YYYY-MM-DD，必填；月结通常取当月 15 号"),
      incomePeriod: str("工资所属期 YYYY-MM 或 YYYY-MM-DD；空串表示未归属；不传则月结取上月、日结取到账日"),
      cycle: { type: "string", enum: ["monthly", "daily"], description: "结算方式：月结 monthly（默认）/ 日结 daily" },
      employmentType: { type: "string", enum: EMPLOYMENT_VALUES, description: "用工类型：临时/兼职/外快/实习/试用/正式（temp/parttime/side/intern/probation/regular）；可选，不传为未设置" },
      ...MONEY_SCHEMA,
      note: str("备注，可选"),
    }, ["payDate"]),
    execute: (args) => salary.create({ payDate: args.payDate, incomePeriod: args.incomePeriod, cycle: args.cycle, employmentType: args.employmentType, note: args.note, ...amountsFrom(args) }),
  });
  action("salary.recordUpdate", {
    description: "修改一笔工资（会写库；只覆盖传入字段，金额改动后重算应发与实发）",
    input: obj({
      id: str("工资记录 id，必填"),
      payDate: str("发薪日期 YYYY-MM-DD"),
      incomePeriod: str("工资所属期 YYYY-MM 或 YYYY-MM-DD；空串清除，不传保留原值"),
      cycle: { type: "string", enum: ["monthly", "daily"], description: "结算方式：月结 / 日结" },
      employmentType: { type: "string", enum: EMPLOYMENT_VALUES, description: "用工类型：临时/兼职/外快/实习/试用/正式（temp/parttime/side/intern/probation/regular）；传空串清除" },
      ...MONEY_SCHEMA,
      note: str("备注"),
    }, ["id"]),
    execute: (args) => salary.update({ id: args.id, payDate: args.payDate, incomePeriod: args.incomePeriod, cycle: args.cycle, employmentType: args.employmentType, note: args.note, ...amountsFrom(args) }),
  });
  action("salary.recordDelete", {
    description: "软删除一笔工资（会写库；记录不再出现在列表与统计中）",
    input: obj({ id: str("工资记录 id") }, ["id"]),
    execute: (args) => salary.remove({ id: args.id }),
  });
  action("salary.dataTables", {
    description: "只读：工资域可浏览的表与列",
    input: obj({}),
    execute: () => ({
      tables: [{
        name: "salary_record",
        columns: COLUMNS,
      }],
    }),
  });
  action("salary.dataQuery", {
    origins: ["ui", "agent"],
    originsDefault: ["ui"],
    description: "只读：白名单表查询（仅 UI；limit ≤ 100）",
    input: obj({ table: { type: "string", enum: ["salary_record"] }, limit: num("1–100，默认 20") }, ["table"]),
    execute: (args, ctx) => {
      if (ctx && ctx.origin && ctx.origin !== "ui" && ctx.origin !== "agent") throw new Error("该操作只允许在界面中执行");
      return salary.dataQuery({ table: args.table, limit: args.limit });
    },
  });
  action("salary.actionSchema", {
    description: "只读：本插件注册的 action 清单",
    input: obj({}),
    execute: () => ({
      shellVersion: api.shellVersion || "",
      domains: [{ id: "wb-addon-salary", version: (api.addon && api.addon.version) || "0.4.0" }],
      actions: defs.filter((d) => d.name !== "salary.actionSchema").map((d) => ({ ...d, domain: "wb-addon-salary", examples: [] })),
    }),
  });

  return defs;
}
