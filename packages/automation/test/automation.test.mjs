import { test } from "node:test";
import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";

const { ensureSchema } = await import("../lib/db/db.js");
const { createAutomation } = await import("../lib/domain/rules.js");

function make() {
  const db = new DatabaseSync(":memory:");
  ensureSchema(db);
  const calls = [];
  const host = {
    async call(action, args) {
      calls.push({ action, args });
      return { result: { ok: true, action } };
    },
  };
  const engine = createAutomation({ db, host });
  return { db, engine, calls };
}

const wait = () => new Promise((resolve) => setTimeout(resolve, 20));

test("手动规则渲染模板并调用白名单 action", async () => {
  const { engine, calls } = make();
  const rule = engine.createRule({
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
  const rule = engine.createRule({
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
  engine.createRule({
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

test("拒绝 vault 与删除类 action", () => {
  const { engine } = make();
  assert.throws(() => engine.createRule({ name: "坏", actionName: "vault.secretReveal" }), /不允许/);
  assert.throws(() => engine.createRule({ name: "坏", actionName: "tasks.delete" }), /不允许/);
  assert.throws(() => engine.createRule({ name: "坏", actionName: "unknown.action" }), /白名单/);
});

test("导出只含规则，导入按 id 跳过", () => {
  const { engine } = make();
  const rule = engine.createRule({ name: "导出", triggerType: "manual", actionName: "message.send" });
  const out = engine.exportData();
  assert.equal(out.rules.length, 1);
  assert.equal(out.runs, undefined);
  const imported = engine.importData(out);
  assert.equal(imported.imported, 0);
  assert.ok(rule.id);
});

test("定时规则到期后执行并重算下一次", async () => {
  const { db, engine, calls } = make();
  const rule = engine.createRule({ name: "定时", triggerType: "interval", triggerConfig: { kind: "interval", everyMinutes: 60 }, actionName: "message.send", actionArgs: { title: "tick" } });
  db.prepare("UPDATE automation_rule SET next_run_at=? WHERE id=?").run(Date.now() - 1000, rule.id);
  await engine.tick();
  assert.equal(calls.length, 1);
  assert.equal(calls[0].args.title, "tick");
  const after = db.prepare("SELECT next_run_at,last_status FROM automation_rule WHERE id=?").get(rule.id);
  assert.ok(after.next_run_at > Date.now());
  assert.equal(after.last_status, "ok");
});
