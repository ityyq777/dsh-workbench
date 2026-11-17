import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";

const require = createRequire(import.meta.url);
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const h = React.createElement;
const C = require("../client/ui/common.cjs");
const copy = require("../client/ui/copy.cjs");
const layoutCss = require("../client/ui/layout-styles.cjs");
const styles = require("../client/ui/styles.cjs");
const Rules = require("../client/views/rules.cjs");
const Editor = require("../client/views/rule-editor.cjs");
const Trigger = require("../client/views/trigger-fields.cjs");
const Runs = require("../client/views/runs.cjs");

const dir = path.join(process.cwd(), "packages/addons/automation/client");
const t = (key, vars) => copy.t("zh", key, vars);
const noop = () => {};

function rulesBody(over) {
  return renderToStaticMarkup(h(Rules.RulesBody, Object.assign({
    h, t, lang: "zh", rows: [], hasRules: false, loading: false, error: "",
    filters: {}, onFilter: noop, onClear: noop, onNew: noop, onRun: noop,
    onEdit: noop, onToggle: noop, onDelete: noop,
  }, over)));
}

test("规则页空态只渲染一张空态卡，不渲染表格", () => {
  const html = rulesBody({});
  assert.ok(html.includes("wba-empty-card"));
  assert.ok(!html.includes("<table"), "空态不应渲染表格");
  assert.ok(html.includes(t("rules.empty.title")));
});

test("过滤后为空显示“没有匹配的规则”且仍不渲染表格", () => {
  const html = rulesBody({ hasRules: true, filters: { q: "zzz" } });
  assert.ok(html.includes(t("rules.empty.filtered")));
  assert.ok(!html.includes("<table"));
});

test("加载中渲染骨架，不渲染表格", () => {
  const html = rulesBody({ loading: true });
  assert.ok(html.includes("wba-skel"));
  assert.ok(!html.includes("<table"));
});

test("规则列表渲染六列与图标操作", () => {
  const html = rulesBody({
    hasRules: true,
    rows: [
      { id: "rule_1", name: "每日提醒", enabled: true, triggerType: "schedule", triggerConfig: { kind: "interval", everyMinutes: 90 }, actionName: "message.send", lastRun: { status: "ok", startedAt: 1700000000000 } },
      { id: "rule_2", name: "事件规则", enabled: false, triggerType: "event", triggerConfig: { kind: "event", domainId: "wb-addon-tags", event: "tag.created" }, actionName: "tasks.create", lastRun: null },
    ],
  });
  assert.ok(html.includes("<table"));
  assert.ok(html.includes(t("rules.col.lastRun")));
  assert.ok(html.includes("每 90 分钟"));
  assert.ok(html.includes("事件 wb-addon-tags/tag.created"));
  assert.ok(html.includes("wba-icon-btn"));
  assert.ok(html.includes(t("rules.status.off")));
});

test("四类触发只渲染各自的字段", () => {
  const base = Rules.emptyForm();
  const render = (kind) => renderToStaticMarkup(h(Trigger.TriggerFields, { h, t, form: Object.assign({}, base, { kind }), set: noop, errs: {} }));
  const interval = render("interval");
  assert.ok(interval.includes('type="number"'));
  assert.ok(!interval.includes('type="time"'));
  const daily = render("dailyAt");
  assert.ok(daily.includes('type="time"'));
  assert.ok(daily.includes("wba-chips"));
  assert.ok(!daily.includes('type="number"'));
  const event = render("event");
  assert.ok(event.includes("wba-domain-hints"));
  assert.ok(event.includes('list="wba-event-hints"'));
  assert.ok(!event.includes('type="time"'));
  const manual = render("manual");
  assert.ok(manual.includes(t("trigger.manualHint")));
  assert.ok(!manual.includes('type="number"'));
  assert.ok(!manual.includes('type="time"'));
  // 分段器四选一，当前类型 aria-pressed=true
  [["interval", 0], ["dailyAt", 0], ["event", 0], ["manual", 1]].forEach(() => {});
  assert.equal((manual.match(/aria-pressed="true"/g) || []).length, 1);
});

test("切换触发类型保留已填内容：payload 只取当前类型但其它值不丢", () => {
  const form = Object.assign(Rules.emptyForm(), {
    kind: "interval", everyMinutes: 240, time: "07:30", tz: "Asia/Tokyo",
    domainId: "wb-addon-message", event: "message.sent", actionName: "message.send",
  });
  const interval = Editor.buildPayload(form);
  assert.equal(interval.triggerType, "schedule");
  assert.deepEqual(interval.triggerConfig, { kind: "interval", everyMinutes: 240 });
  const daily = Editor.buildPayload(Object.assign({}, form, { kind: "dailyAt" }));
  assert.equal(daily.triggerConfig.time, "07:30");
  assert.equal(daily.triggerConfig.tz, "Asia/Tokyo");
  assert.deepEqual(daily.triggerConfig.weekdays, [1, 2, 3, 4, 5]);
  const evt = Editor.buildPayload(Object.assign({}, form, { kind: "event" }));
  assert.equal(evt.triggerType, "event");
  assert.deepEqual(evt.triggerConfig, { kind: "event", domainId: "wb-addon-message", event: "message.sent" });
  const manual = Editor.buildPayload(Object.assign({}, form, { kind: "manual" }));
  assert.equal(manual.triggerType, "manual");
  // 切回 interval 时原值仍在
  assert.equal(Editor.buildPayload(Object.assign({}, form, { kind: "interval" })).triggerConfig.everyMinutes, 240);
});

test("JSON 非法：红框、错误文案、保存禁用", () => {
  const form = Object.assign(Rules.emptyForm(), { actionArgs: '{"title": ' });
  const html = renderToStaticMarkup(h(Editor.RuleEditor, {
    h, C, t, React, form, initial: form, set: noop, busy: false, actions: ["message.send"], onClose: noop, onSave: noop,
  }));
  assert.ok(html.includes('aria-invalid="true"'));
  assert.ok(html.includes("wba-code err"));
  assert.ok(html.includes(t("editor.jsonInvalid", { msg: "x" }).split("：")[0]));
  assert.ok(html.includes('disabled=""'), "非法 JSON 时保存按钮应禁用");
});

test("合法表单保存按钮可用，条件关闭时 payload.condition 为 null", () => {
  const form = Object.assign(Rules.emptyForm(), { name: "每日提醒" });
  const html = renderToStaticMarkup(h(Editor.RuleEditor, {
    h, C, t, React, form, initial: form, set: noop, busy: false, actions: ["message.send"], onClose: noop, onSave: noop,
  }));
  assert.ok(!html.includes('disabled=""'));
  const payload = Editor.buildPayload(form);
  assert.equal(payload.condition, null);
  assert.equal(payload.triggerType, "schedule");
  assert.deepEqual(payload.actionArgs, { title: "自动化提醒", body: "规则 {{rule.name}} 已运行" });
});

test("条件开启但 JSON 非法时同样禁用保存", () => {
  const form = Object.assign(Rules.emptyForm(), { condOn: true, condition: "[]" });
  const html = renderToStaticMarkup(h(Editor.RuleEditor, {
    h, C, t, React, form, initial: form, set: noop, busy: false, actions: ["message.send"], onClose: noop, onSave: noop,
  }));
  assert.ok(html.includes(t("editor.conditionObject")));
  assert.ok(html.includes('disabled=""'));
});

test("编辑器是模态盒子，宽度用 min(760px, calc(100vw - 32px))", () => {
  assert.ok(layoutCss.includes("width:min(760px,calc(100vw - 32px))"));
  assert.ok(layoutCss.includes("max-height:90vh"));
  assert.ok(layoutCss.includes(".wba-modal-foot{position:sticky"));
});

test("运行记录：按规则/状态过滤，空态不渲染表格", () => {
  const rows = [
    { id: "run_1", ruleId: "rule_1", trigger: "schedule", status: "ok", startedAt: 1700000000000, finishedAt: 1700000000300, result: '{"sent":1}', error: "" },
  ];
  const html = renderToStaticMarkup(h(Runs.RunsBody, {
    h, t, lang: "zh", rows, rules: [{ id: "rule_1", name: "每日提醒" }], loading: false, error: "",
    ruleId: "", status: "", expanded: "run_1", ruleName: () => "每日提醒", onRule: noop, onStatus: noop, onExpand: noop,
  }));
  assert.ok(html.includes("300ms"));
  assert.ok(html.includes(t("runs.detail.id")));
  assert.ok(html.includes(t("runs.limitNote")));
  const empty = renderToStaticMarkup(h(Runs.RunsBody, {
    h, t, lang: "zh", rows: [], rules: [], loading: false, error: "", expanded: "", ruleName: () => "", onRule: noop, onStatus: noop, onExpand: noop,
  }));
  assert.ok(empty.includes("wba-empty-card"));
  assert.ok(!empty.includes("<table"));
});

test("i18n 字典 zh/en 全量对称", () => {
  const zh = Object.keys(copy.DICT.zh).sort();
  const en = Object.keys(copy.DICT.en).sort();
  assert.deepEqual(zh, en);
  assert.equal(copy.t("en", "rules.title"), "Rules");
  assert.equal(copy.t("zh", "rules.confirm.delete", { name: "A" }), '删除规则「A」？删除后不可恢复。');
});

test("样式：版式层无字面色值，源码用到的每个 wba-* 类都有定义", () => {
  assert.ok(!/#[0-9a-fA-F]{3,8}\b/.test(layoutCss), "版式层禁止字面色值");
  assert.ok(!/rgba?\(/.test(layoutCss), "版式层禁止 rgba()");
  const files = ["client.src.cjs"].concat(
    fs.readdirSync(path.join(dir, "views")).map((f) => path.join("views", f)),
    fs.readdirSync(path.join(dir, "ui")).map((f) => path.join("ui", f)),
  );
  const used = new Set();
  for (const rel of files) {
    const file = path.join(dir, rel);
    const text = fs.readFileSync(file, "utf8");
    for (const m of text.matchAll(/className:\s*"([^"]+)"/g)) {
      m[1].split(/\s+/).filter((c) => c.startsWith("wba-")).forEach((c) => used.add(c));
    }
  }
  const missing = [...used].filter((c) => !styles.includes("." + c));
  assert.deepEqual(missing, [], "未定义的样式类：" + missing.join(", "));
});
