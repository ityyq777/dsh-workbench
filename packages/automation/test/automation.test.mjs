import { test } from "node:test";
import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";

const { ensureSchema } = await import("../lib/db/db.js");
const { createAutomation } = await import("../lib/domain/rules.js");

const DEFAULT_ALLOW = ["message.send", "tasks.create", "tags.create", "sites.create", "connector.sourceRun"];

// 允许清单默认空，测试按需显式启用，避免依赖隐式授权。
function make(allow = DEFAULT_ALLOW, options = {}) {
  const db = new DatabaseSync(":memory:");
  ensureSchema(db);
  const calls = [];
  const host = {
    async call(action, args) {
      calls.push({ action, args });
      return { result: { ok: true, action } };
    },
  };
  const engine = createAutomation({ db, host, getSchedule: options.getSchedule || (() => null) });
  if (allow.length) engine.saveConfig({ allowedActions: allow });
  return { db, engine, calls };
}

/** 宿主 schedule 的替身：只实现工作台用到的六个方法。 */
function makeSchedule() {
  const tasks = new Map();
  const created = [];
  let seq = 0;
  const stamp = () => "2030-01-01T09:00:00Z";
  return {
    created,
    tasks,
    async create(request) {
      const id = "sched_" + ++seq;
      const entry = {
        status: "active",
        target: request.target || { kind: "new_once" },
        record: { id, kind: request.timing.kind, title: request.title, prompt: request.prompt, scheduledAt: stamp() },
        updatedAt: "2030-01-01T00:00:00Z",
      };
      tasks.set(id, entry);
      created.push(request);
      return entry;
    },
    async edit(request) {
      const entry = tasks.get(request.id);
      if (!entry) return { id: request.id, code: "schedule_not_found" };
      if (request.action === "delete") {
        tasks.delete(request.id);
        return { id: request.id, action: "delete" };
      }
      const patch = request.patch || {};
      if (patch.title) entry.record.title = patch.title;
      if (patch.prompt) entry.record.prompt = patch.prompt;
      if (patch.active === false) entry.status = "paused";
      if (patch.active === true) entry.status = "active";
      return entry;
    },
    async catalog() {
      return [...tasks.values()];
    },
    async run(request) {
      const entry = tasks.get(request.id);
      if (!entry) return { id: request.id, code: "schedule_not_found" };
      return entry;
    },
    async history(request) {
      return { id: request.id, records: [{ deliveredAt: stamp() }], earlierRecordsUnavailable: false, earlierRecordsPruned: false };
    },
    deliveryLimits() {
      return { newSessionIntervalSeconds: 60 };
    },
  };
}

const wait = () => new Promise((resolve) => setTimeout(resolve, 20));

const AGENT = {
  prompt: "汇总今天的任务并提醒我",
  timing: { kind: "daily", daily: { time: "09:00", time_zone: "Asia/Shanghai" } },
  target: { kind: "new_once" },
};

test("手动规则渲染模板并调用白名单 action", async () => {
  const { engine, calls } = make();
  const rule = await engine.createRule({
    name: "问候",
    triggerType: "manual",
    actionName: "message.send",
    actionArgs: { title: "Hi {{item.title}}", body: "规则 {{rule.name}}" },
  });
  const out = await engine.runRule(rule.id, "manual", { item: { title: "世界" } });
  assert.equal(out.ok, true);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].action, "message.send");
  assert.equal(calls[0].args.title, "Hi 世界");
  assert.equal(calls[0].args.body, "规则 问候");
  assert.equal(engine.stats().total, 1);
});

test("条件不满足记 skipped 且不调用 action", async () => {
  const { engine, calls } = make();
  const rule = await engine.createRule({
    name: "只有高优先级",
    triggerType: "manual",
    actionName: "message.send",
    actionArgs: { title: "x" },
    condition: { field: "event.item.title", op: "contains", value: "重要" },
  });
  const out = await engine.runRule(rule.id, "manual", { item: { title: "普通" } });
  assert.equal(out.skipped, true);
  assert.equal(calls.length, 0);
  assert.equal(engine.runList({})[0].status, "skipped");
});

test("事件规则按 domainId/event 匹配", async () => {
  const { engine, calls } = make();
  await engine.createRule({
    name: "连接器新内容",
    triggerType: "event",
    triggerConfig: { kind: "event", domainId: "wb-addon-connector", event: "item.created" },
    actionName: "message.send",
    actionArgs: { title: "{{item.title}}", body: "{{item.url}}" },
  });
  engine.onEvent({ domainId: "other", event: "item.created", data: { item: { title: "no" } } });
  engine.onEvent({ domainId: "wb-addon-connector", event: "item.created", data: { item: { title: "新闻", url: "https://e.test" } } });
  await wait();
  assert.equal(calls.length, 1);
  assert.equal(calls[0].args.title, "新闻");
});

test("拒绝 vault 与删除类 action", async () => {
  const { engine } = make();
  await assert.rejects(engine.createRule({ name: "坏", actionName: "vault.secretReveal" }), /不允许/);
  await assert.rejects(engine.createRule({ name: "坏", actionName: "tasks.delete" }), /不允许/);
  await assert.rejects(engine.createRule({ name: "坏", actionName: "unknown.action" }), /未在设置中启用/);
});

test("默认不允许任何 action，勾选后才能创建规则", async () => {
  const { engine } = make([]);
  assert.deepEqual(engine.config().allowedActions, []);
  await assert.rejects(engine.createRule({ name: "空", actionName: "message.send" }), /未在设置中启用/);
  engine.saveConfig({ allowedActions: ["message.send"] });
  const rule = await engine.createRule({ name: "勾选后", triggerType: "manual", actionName: "message.send" });
  assert.equal(rule.actionName, "message.send");
});

test("允许清单去重排序，硬底线与非法名写入被拒", () => {
  const { engine } = make([]);
  const saved = engine.saveConfig({ allowedActions: ["tasks.create", "message.send", "tasks.create"] });
  assert.deepEqual(saved.allowedActions, ["message.send", "tasks.create"]);
  assert.throws(() => engine.saveConfig({ allowedActions: ["vault.secretReveal"] }), /不允许/);
  assert.throws(() => engine.saveConfig({ allowedActions: ["automation.ruleRun"] }), /不允许/);
  assert.throws(() => engine.saveConfig({ allowedActions: ["not a name"] }), /不合法/);
  assert.throws(() => engine.saveConfig({ allowedActions: ["tasks.delete"] }), /不允许/);
});

test("收紧配置后老规则执行记 skipped 且不调用 action", async () => {
  const { engine, calls } = make();
  const rule = await engine.createRule({ name: "老规则", triggerType: "manual", actionName: "message.send", actionArgs: { title: "x" } });
  engine.saveConfig({ allowedActions: [] });
  const out = await engine.runRule(rule.id);
  assert.equal(out.skipped, true);
  assert.equal(out.reason, "disabled");
  assert.equal(calls.length, 0);
  assert.equal(engine.runList({})[0].status, "skipped");
  assert.equal(engine.stats().staleCount, 1);
});

test("导出只含规则，导入按 id 跳过", async () => {
  const { engine } = make();
  const rule = await engine.createRule({ name: "导出", triggerType: "manual", actionName: "message.send" });
  const out = engine.exportData();
  assert.equal(out.rules.length, 1);
  assert.equal(out.runs, undefined);
  // 宿主交给域的是一段 JSON 文本，导入必须能解析字符串。
  const imported = await engine.importData(JSON.stringify(out));
  assert.equal(imported.imported, 0);
  assert.equal(imported.skipped, 1);
  assert.ok(rule.id);
});

test("导入新机器的规则会重新创建", async () => {
  const source = make();
  await source.engine.createRule({ name: "要去备份的", triggerType: "manual", actionName: "message.send", actionArgs: { title: "x" } });
  const exported = await source.engine.exportData();
  const target = make();
  const report = await target.engine.importData(JSON.stringify(exported));
  assert.equal(report.imported, 1);
  assert.equal(target.engine.listRules().length, 1);
});

test("定时规则到期后执行并重算下一次", async () => {
  const { db, engine, calls } = make();
  const rule = await engine.createRule({ name: "定时", triggerType: "interval", triggerConfig: { kind: "interval", everyMinutes: 60 }, actionName: "message.send", actionArgs: { title: "tick" } });
  db.prepare("UPDATE automation_rule SET next_run_at=? WHERE id=?").run(Date.now() - 1000, rule.id);
  await engine.tick();
  assert.equal(calls.length, 1);
  assert.equal(calls[0].args.title, "tick");
  const after = db.prepare("SELECT next_run_at,last_status FROM automation_rule WHERE id=?").get(rule.id);
  assert.ok(after.next_run_at > Date.now());
  assert.equal(after.last_status, "ok");
});

test("AI 规则把定时交给宿主并保留本地快照", async () => {
  const schedule = makeSchedule();
  const { engine, calls } = make(DEFAULT_ALLOW, { getSchedule: () => schedule });
  const rule = await engine.createRule({ name: "每日汇总", execMode: "agent", agent: AGENT });
  assert.equal(rule.execMode, "agent");
  assert.ok(rule.scheduleId);
  assert.equal(schedule.created.length, 1);
  assert.equal(schedule.created[0].title, "每日汇总");
  assert.equal(schedule.created[0].prompt, AGENT.prompt);
  assert.equal(schedule.created[0].timing.kind, "daily");
  // AI 规则不进本地执行队列，也不会调用 workbench action。
  assert.equal(calls.length, 0);
  const live = await engine.listRulesLive();
  assert.equal(live[0].scheduleStatus, "active");
  assert.equal(live[0].enabled, true);
  assert.equal(live[0].agent.scheduledAt, "2030-01-01T09:00:00Z");
});

test("宿主没有 schedule 时拒绝创建 AI 规则", async () => {
  const { engine } = make();
  await assert.rejects(engine.createRule({ name: "无宿主", execMode: "agent", agent: AGENT }), /自动化任务/);
  assert.equal(engine.listRules().length, 0);
});

test("AI 规则校验时间与提示词", async () => {
  const schedule = makeSchedule();
  const { engine } = make(DEFAULT_ALLOW, { getSchedule: () => schedule });
  await assert.rejects(
    engine.createRule({ name: "太快", execMode: "agent", agent: { ...AGENT, timing: { kind: "every", every_seconds: 30 } } }),
    /不能小于 1 分钟/,
  );
  await assert.rejects(engine.createRule({ name: "空", execMode: "agent", agent: { ...AGENT, prompt: "  " } }), /提示词/);
  await assert.rejects(
    engine.createRule({ name: "无星期", execMode: "agent", agent: { ...AGENT, timing: { kind: "weekly", weekly: { time: "09:00", time_zone: "Asia/Shanghai", weekdays: [] } } } }),
    /至少选择一个星期/,
  );
  assert.equal(schedule.created.length, 0);
});

test("AI 规则暂停、立即执行与删除都转发给宿主", async () => {
  const schedule = makeSchedule();
  const { engine } = make(DEFAULT_ALLOW, { getSchedule: () => schedule });
  const rule = await engine.createRule({ name: "转发", execMode: "agent", agent: AGENT });
  const paused = await engine.updateRule({ id: rule.id, enabled: false });
  assert.equal(paused.enabled, false);
  assert.equal(schedule.tasks.get(rule.scheduleId).status, "paused");
  const out = await engine.runRule(rule.id);
  assert.equal(out.ok, true);
  assert.equal(out.delivered, true);
  await engine.deleteRule(rule.id);
  assert.equal(schedule.tasks.has(rule.scheduleId), false);
  assert.equal(engine.listRules().length, 0);
});

test("AI 规则不能切换执行方式", async () => {
  const schedule = makeSchedule();
  const { engine } = make(DEFAULT_ALLOW, { getSchedule: () => schedule });
  const rule = await engine.createRule({ name: "锁定", execMode: "agent", agent: AGENT });
  await assert.rejects(engine.updateRule({ id: rule.id, execMode: "action" }), /不能切换执行方式/);
});

test("宿主任务被删除后列表标记为缺失", async () => {
  const schedule = makeSchedule();
  const { engine } = make(DEFAULT_ALLOW, { getSchedule: () => schedule });
  const rule = await engine.createRule({ name: "丢任务", execMode: "agent", agent: AGENT });
  schedule.tasks.delete(rule.scheduleId);
  const live = await engine.listRulesLive();
  assert.equal(live[0].scheduleMissing, true);
  assert.equal(live[0].enabled, false);
});
