/** wb-addon-salary：按日期记录日结/月结工资、收入项、扣款项与实发统计。 */
import { bindClock, ensureSchema } from "./db/db.js";
import { createSalary } from "./domain/salary.js";
import { registerSalaryActions } from "./domain/actions.js";

export const inject = ["workbench"];
let engine = null;

export function setup(api) {
  if (typeof api.now === "function") bindClock(api.now);
  ensureSchema(api.db);
  engine = createSalary({ db: api.db, host: api, log: api.log });
  registerSalaryActions(api, engine);
  api.log("salary domain ready", api.addon.version);
}

const VIEWS = [
  { id: "records", title: { zh: "工资记录", en: "Records" } },
  { id: "stats", title: { zh: "统计", en: "Stats" } },
  { id: "data", title: { zh: "数据", en: "Data" } },
  { id: "actions", title: { zh: "Action", en: "Actions" } },
];

export function apply(ctx) {
  const host = ctx.workbench;
  if (!host) throw new Error("dsh-workbench 未加载：缺少 workbench 服务");
  ctx.effect(() => host.registerDomain({
    id: "wb-addon-salary",
    title: "工资",
    description: "按日期记录日结/月结工资：用工类型、收入项、税前扣款、社保公积金、个税与实发",
    version: "0.4.5",
    category: "finance",
    tables: ["salary_record"],
    sync: { tables: [] },
    views: VIEWS,
    capability: {
      summary: "记录每一笔工资的日期、用工类型（实习/试用/正式等）、结算方式与全部金额明细，按年/按月统计实发、应发、个税与社保；不做报销与支出流水。",
      records: [{
        kind: "record",
        title: "工资记录",
        description: "一笔工资（日结或月结）：发薪日期、收入项、税前扣款、社保公积金、个税、应发与实发。",
        when: ["记录某天/某月的工资", "查询、比较一段时间的收入", "补录历史工资条"],
        notFor: ["报销与日常支出（用 storage）", "任务、日程与提醒"],
        primaryAction: "salary.recordCreate",
        keyArgs: ["payDate", "netPay"],
      }],
      fields: [
        { name: "payDate", type: "string", description: "发薪日期 YYYY-MM-DD；月结通常取当月 15 号" },
        { name: "incomePeriod", type: "string", description: "工资所属期：YYYY-MM 或 YYYY-MM-DD，可独立修改" },
        { name: "cycle", type: "string", description: "monthly 月结（默认）/ daily 日结" },
        { name: "netPay", type: "number", description: "实发工资" },
        { name: "grossPay", type: "number", description: "应发税前工资" },
        { name: "basePay", type: "number", description: "基本工资" },
        { name: "performancePay", type: "number", description: "绩效工资" },
        { name: "allowance", type: "number", description: "补贴" },
        { name: "incomeTax", type: "number", description: "个税" },
      ],
      notFor: ["不做工资条 OCR", "不做多公司并行核算", "不存姓名等身份信息"],
      notes: [
        "同日允许多笔；统计可按到账月或所属月聚合，未归属的旧记录仅纳入到账口径。",
        "金额在本机 SQLite 保存，随宿主备份；不参与云同步。",
        "agent 可新增、修改、软删除工资记录；删除后不再出现在列表与统计。",
      ],
    },
    exportData: () => ({ records: engine.dump() }),
    importData: (payload) => {
      let data = payload;
      if (typeof data === "string") {
        try { data = JSON.parse(data); } catch { data = {}; }
      }
      const records = data && Array.isArray(data.records) ? data.records : [];
      let imported = 0;
      let failed = 0;
      for (const item of records) {
        try { engine.create({ ...item, incomePeriod: item.incomePeriod ?? null }); imported += 1; } catch { failed += 1; }
      }
      return { imported, failed };
    },
    setup,
  }), "salary-domain");
}

export const SALARY_DOMAIN = "wb-addon-salary";
