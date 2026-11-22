/** 自动化规则：单触发 + 单动作 + 可选条件；不做循环与分支。 */
import { newId, now, parseJson, ruleRow, runRow, metaGet, metaSet } from "../db/db.js";
import { nextDailyAt, validTimeZone } from "./time.js";
import { checkAction, normalizeAllowedList } from "./whitelist.js";
import { createAgentBridge } from "./agent.js";
import { createAgentRules } from "./agent-rules.js";

const OPS = new Set(["eq", "neq", "contains", "gt", "lt"]);
const SEGMENT = /^[A-Za-z_][A-Za-z0-9_]*$/;
const DEFAULT_CONFIG = { maxRules: 50, perHour: 60, allowedActions: [] };

function bad(message) {
  const error = new Error(message);
  error.status = 400;
  return error;
}

function plainObject(value) {
  return value && typeof value === "object" && !Array.isArray(value);
}

function assertPath(path) {
  const text = String(path || "").trim();
  const parts = text.split(".");
  if (!text || parts.length > 3 || parts.some((p) => !SEGMENT.test(p) || p === "__proto__" || p === "prototype" || p === "constructor")) {
    throw bad("字段路径不合法：" + text);
  }
  return parts;
}

export function pickPath(root, path) {
  const parts = assertPath(path);
  let cur = root;
  for (const part of parts) {
    if (cur == null || typeof cur !== "object") return undefined;
    if (!Object.prototype.hasOwnProperty.call(cur, part)) return undefined;
    cur = cur[part];
  }
  return cur;
}

export function render(value, context) {
  if (typeof value === "string") {
    return value.replace(/\{\{\s*([A-Za-z0-9_.]+)\s*\}\}/g, (_, path) => {
      const got = pickPath(context, path);
      if (got == null) return "";
      return typeof got === "object" ? JSON.stringify(got).slice(0, 2000) : String(got);
    });
  }
  if (Array.isArray(value)) return value.slice(0, 50).map((item) => render(item, context));
  if (plainObject(value)) {
    const out = {};
    for (const key of Object.keys(value).slice(0, 50)) {
      if (key === "__proto__" || key === "constructor" || key === "prototype") continue;
      out[key] = render(value[key], context);
    }
    return out;
  }
  return value;
}

export function conditionPass(condition, context) {
  if (!condition) return true;
  if (!plainObject(condition) || !condition.field) return false;
  if (!OPS.has(condition.op)) return false;
  const left = pickPath(context, condition.field);
  const right = condition.value;
  if (condition.op === "eq") return left === right;
  if (condition.op === "neq") return left !== right;
  if (condition.op === "contains") return String(left == null ? "" : left).includes(String(right == null ? "" : right));
  if (right == null || left == null) return false;
  if (condition.op === "gt") return Number(left) > Number(right);
  return Number(left) < Number(right);
}

function normalizeTrigger(input) {
  const config = plainObject(input.triggerConfig) ? input.triggerConfig : {};
  const kind = config.kind || input.triggerType || "manual";
  if (kind === "interval") {
    const every = Number(config.everyMinutes);
    if (!Number.isInteger(every) || every < 1 || every > 10080) throw bad("间隔需为 1–10080 分钟");
    return { triggerType: "schedule", config: { kind: "interval", everyMinutes: every } };
  }
  if (kind === "dailyAt") {
    const time = String(config.time || "");
    if (!/^\d{2}:\d{2}$/.test(time)) throw bad("每日时间格式应为 HH:MM");
    const [h, m] = time.split(":").map(Number);
    if (h > 23 || m > 59) throw bad("每日时间不合法");
    const tz = String(config.tz || "Asia/Shanghai");
    if (!validTimeZone(tz)) throw bad("时区不合法：" + tz);
    const weekdays = Array.isArray(config.weekdays) && config.weekdays.length ? config.weekdays.map(Number) : [1, 2, 3, 4, 5, 6, 7];
    if (weekdays.some((d) => !Number.isInteger(d) || d < 1 || d > 7)) throw bad("weekdays 需为 1–7");
    return { triggerType: "schedule", config: { kind: "dailyAt", time, tz, weekdays } };
  }
  if (kind === "event") {
    const domainId = String(config.domainId || "");
    const event = String(config.event || "");
    if (!domainId || !event) throw bad("事件规则需要 domainId 与 event");
    return { triggerType: "event", config: { kind: "event", domainId, event } };
  }
  if (kind === "manual") return { triggerType: "manual", config: { kind: "manual" } };
  throw bad("未知触发类型：" + kind);
}

function normalizeCondition(input) {
  if (input == null || input === "") return null;
  if (typeof input === "string") {
    const trimmed = input.trim();
    if (!trimmed) return null;
    try {
      input = JSON.parse(trimmed);
    } catch {
      throw bad("条件必须是 JSON 对象");
    }
  }
  if (!plainObject(input) || !input.field || !OPS.has(input.op)) throw bad("条件需要 field 与 op(eq/neq/contains/gt/lt)");
  assertPath(input.field);
  return { field: String(input.field), op: String(input.op), value: input.value };
}

function normalizeAction(name, args, allowed) {
  const action = String(name || "").trim();
  const problem = checkAction(action, allowed);
  if (problem) throw bad(problem);
  const actionArgs = args == null ? {} : args;
  if (!plainObject(actionArgs)) throw bad("actionArgs 必须是对象");
  const json = JSON.stringify(actionArgs);
  if (json.length > 20000) throw bad("actionArgs 超过 20KB");
  return { action, actionArgs };
}

function nextAt(triggerType, config, from) {
  if (triggerType === "schedule") {
    if (config.kind === "interval") return from + config.everyMinutes * 60000;
    if (config.kind === "dailyAt") return nextDailyAt(from, config.time, config.tz, config.weekdays);
  }
  return null;
}

export function createAutomation({ db, host, log = () => {}, getSchedule = () => null }) {
  let timer = null;
  let ticking = false;
  let active = 0;
  // 「交给 AI」执行方式：定时与投递交给宿主 schedule，本机只存表单与快照。
  const agent = createAgentBridge({ getSchedule, log });
  // 「交给 AI」规则的宿主登记与对账单独成模块，规则引擎只负责 action 模式。
  const agentRules = createAgentRules({ db, agent, log, plainObject, bad, getRule, listRules });

  function config() {
    const raw = metaGet(db, "config");
    const parsed = raw ? parseJson(raw, {}) : {};
    const next = Object.assign({}, DEFAULT_CONFIG, plainObject(parsed) ? parsed : {});
    // 读取时静默清洗，保证老数据或手改配置不会让页面直接报错。
    next.allowedActions = normalizeAllowedList(next.allowedActions, false);
    return next;
  }

  function saveConfig(patch) {
    const next = Object.assign({}, config(), patch);
    next.maxRules = Math.max(1, Math.min(500, Number(next.maxRules) || DEFAULT_CONFIG.maxRules));
    next.perHour = Math.max(1, Math.min(600, Number(next.perHour) || DEFAULT_CONFIG.perHour));
    if (patch && Object.prototype.hasOwnProperty.call(patch, "allowedActions")) {
      next.allowedActions = normalizeAllowedList(patch.allowedActions, true);
    }
    metaSet(db, "config", JSON.stringify(next));
    return next;
  }

  function getRule(id) {
    const row = db.prepare("SELECT * FROM automation_rule WHERE id=? AND deleted_at IS NULL").get(String(id || ""));
    return row ? ruleRow(row) : null;
  }

  function listRules() {
    const rows = db.prepare("SELECT * FROM automation_rule WHERE deleted_at IS NULL ORDER BY updated_at DESC LIMIT 200").all();
    return rows.map((row) => {
      const last = db.prepare("SELECT * FROM automation_run WHERE rule_id=? ORDER BY started_at DESC LIMIT 1").get(row.id);
      return Object.assign(ruleRow(row), { lastRun: last ? runRow(last) : null });
    });
  }

  async function createRule(input) {
    const data = plainObject(input) ? input : {};
    const name = String(data.name || "").trim().slice(0, 80);
    if (!name) throw bad("规则名称不能为空");
    if (listRules().length >= config().maxRules) throw bad("规则数量已达上限");
    if (data.execMode === "agent") return agentRules.createAgentRule(data, name);
    const trigger = normalizeTrigger(data);
    const action = normalizeAction(data.actionName, data.actionArgs, config().allowedActions);
    const condition = normalizeCondition(data.condition);
    const id = newId("rule");
    const ts = now();
    const next = data.enabled === false ? null : nextAt(trigger.triggerType, trigger.config, ts);
    db.prepare(
      "INSERT INTO automation_rule(id,name,enabled,trigger_type,trigger_config,condition,action_name,action_args,next_run_at,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?)",
    ).run(id, name, data.enabled === false ? 0 : 1, trigger.triggerType, JSON.stringify(trigger.config), condition ? JSON.stringify(condition) : "", action.action, JSON.stringify(action.actionArgs), next, ts, ts);
    return getRule(id);
  }

  async function updateRule(input) {
    const data = plainObject(input) ? input : {};
    const existing = getRule(data.id);
    if (!existing) throw bad("规则不存在");
    if (data.execMode && data.execMode !== existing.execMode) throw bad("规则创建后不能切换执行方式，请新建一条规则");
    const name = String((data.name == null ? existing.name : data.name) || "").trim().slice(0, 80);
    if (!name) throw bad("规则名称不能为空");
    if (existing.execMode === "agent") return agentRules.updateAgentRule(existing, data, name);
    const merged = Object.assign({}, existing, data);
    const trigger = normalizeTrigger({ triggerType: merged.triggerType, triggerConfig: merged.triggerConfig });
    const action = normalizeAction(merged.actionName, merged.actionArgs, config().allowedActions);
    const condition = normalizeCondition(merged.condition);
    const enabled = merged.enabled !== false;
    const ts = now();
    const next = enabled ? nextAt(trigger.triggerType, trigger.config, ts) : null;
    db.prepare(
      "UPDATE automation_rule SET name=?,enabled=?,trigger_type=?,trigger_config=?,condition=?,action_name=?,action_args=?,next_run_at=?,updated_at=?,rev=rev+1 WHERE id=?",
    ).run(name, enabled ? 1 : 0, trigger.triggerType, JSON.stringify(trigger.config), condition ? JSON.stringify(condition) : "", action.action, JSON.stringify(action.actionArgs), next, ts, existing.id);
    return getRule(existing.id);
  }

  async function deleteRule(id) {
    const existing = getRule(id);
    if (!existing) throw bad("规则不存在");
    if (existing.scheduleId) {
      try {
        await agent.remove(existing.scheduleId);
      } catch (error) {
        // 宿主任务删不掉（服务未加载/权限）时仍然删本地规则，避免页面卡住。
        log("删除宿主任务失败：" + (error && error.message));
      }
    }
    db.prepare("UPDATE automation_rule SET enabled=0, deleted_at=?, next_run_at=NULL, updated_at=?, rev=rev+1 WHERE id=?").run(now(), now(), existing.id);
    return { id: existing.id, deleted: true };
  }

  function record(rule, trigger, status, result, error, startedAt) {
    const finished = now();
    db.prepare("INSERT INTO automation_run(id,rule_id,trigger,status,started_at,finished_at,result,error) VALUES(?,?,?,?,?,?,?,?)").run(
      newId("run"), rule.id, trigger, status, startedAt, finished, String(result || "").slice(0, 4000), String(error || "").slice(0, 1000),
    );
    if (status === "skipped") {
      db.prepare("UPDATE automation_rule SET last_run_at=?, last_status=? WHERE id=?").run(finished, status, rule.id);
      return;
    }
    const errorInc = status === "error" ? 1 : 0;
    db.prepare("UPDATE automation_rule SET last_run_at=?, last_status=?, run_count=run_count+1, error_count=error_count+? WHERE id=?").run(finished, status, errorInc, rule.id);
  }

  function setNext(rule) {
    if (rule.triggerType !== "schedule") return;
    db.prepare("UPDATE automation_rule SET next_run_at=? WHERE id=?").run(nextAt(rule.triggerType, rule.triggerConfig, now()), rule.id);
  }

  async function execute(rule, trigger, payload) {
    const context = { event: payload || {}, item: (payload && payload.item) || {}, rule: { id: rule.id, name: rule.name }, now: now() };
    if (!conditionPass(rule.condition, context)) {
      record(rule, trigger, "skipped", "", "条件不满足", now());
      if (trigger === "schedule") setNext(rule);
      return { skipped: true, reason: "condition" };
    }
    const since = now() - 3600000;
    const used = db.prepare("SELECT COUNT(*) AS n FROM automation_run WHERE rule_id=? AND started_at>=? AND status!='skipped'").get(rule.id, since).n;
    if (used >= config().perHour) {
      record(rule, trigger, "skipped", "", "超过每小时上限", now());
      if (trigger === "schedule") setNext(rule);
      return { skipped: true, reason: "rate" };
    }
    if (active >= 2) {
      record(rule, trigger, "skipped", "", "并发已满", now());
      if (trigger === "schedule") setNext(rule);
      return { skipped: true, reason: "busy" };
    }
    // 执行时复核：配置收紧后，老规则立即停跑而不是继续调用。
    const allowedNow = config().allowedActions;
    if (checkAction(rule.actionName, allowedNow)) {
      record(rule, trigger, "skipped", "", "action 未启用：" + rule.actionName, now());
      if (trigger === "schedule") setNext(rule);
      return { skipped: true, reason: "disabled" };
    }
    active += 1;
    const started = now();
    try {
      const args = render(rule.actionArgs, context);
      const response = await host.call(rule.actionName, args);
      const result = JSON.stringify(response && response.result !== undefined ? response.result : response);
      record(rule, trigger, "ok", result, "", started);
      return { ok: true };
    } catch (error) {
      const message = String((error && error.message) || error);
      record(rule, trigger, "error", "", message, started);
      log("automation " + rule.name + " failed: " + message);
      return { ok: false, error: message };
    } finally {
      active -= 1;
      if (trigger === "schedule") setNext(rule);
    }
  }

  async function runRule(id, trigger = "manual", payload) {
    const rule = getRule(id);
    if (!rule) throw bad("规则不存在");
    if (rule.execMode === "agent") {
      if (!rule.scheduleId) throw bad("规则还没有关联宿主任务，请删除后重建");
      const out = await agent.run(rule.scheduleId);
      if (out.status === "missing") throw bad("宿主任务已不存在（可能已在「自动化任务」里删除）");
      if (out.status === "pending") return { skipped: true, reason: "busy" };
      return { ok: true, delivered: true };
    }
    return execute(rule, trigger, payload);
  }

  function runList(input) {
    const ruleId = input && input.ruleId ? String(input.ruleId) : "";
    const limit = Math.max(1, Math.min(200, Number(input && input.limit) || 50));
    const rows = ruleId
      ? db.prepare("SELECT * FROM automation_run WHERE rule_id=? ORDER BY started_at DESC LIMIT ?").all(ruleId, limit)
      : db.prepare("SELECT * FROM automation_run ORDER BY started_at DESC LIMIT ?").all(limit);
    return rows.map(runRow);
  }

  function runGet(id) {
    const row = db.prepare("SELECT * FROM automation_run WHERE id=?").get(String(id || ""));
    return row ? runRow(row) : null;
  }

  function stats() {
    const total = db.prepare("SELECT COUNT(*) AS n FROM automation_rule WHERE deleted_at IS NULL").get().n;
    const enabled = db.prepare("SELECT COUNT(*) AS n FROM automation_rule WHERE deleted_at IS NULL AND enabled=1").get().n;
    const today = now() - 86400000;
    const runs = db.prepare("SELECT status, COUNT(*) AS n FROM automation_run WHERE started_at>=? GROUP BY status").all(today);
    const map = {};
    for (const row of runs) map[row.status] = row.n;
    const cfg = config();
    const stale = db.prepare("SELECT action_name FROM automation_rule WHERE deleted_at IS NULL AND exec_mode='action'").all()
      .filter((row) => checkAction(row.action_name, cfg.allowedActions)).length;
    const agentRuleCount = db.prepare("SELECT COUNT(*) AS n FROM automation_rule WHERE deleted_at IS NULL AND exec_mode='agent'").get().n;
    const agentEnabled = db.prepare("SELECT COUNT(*) AS n FROM automation_rule WHERE deleted_at IS NULL AND exec_mode='agent' AND enabled=1").get().n;
    return { total, enabled, today: map, config: cfg, staleCount: stale, agentRules: agentRuleCount, agentEnabled };
  }

  async function tick() {
    if (ticking) return;
    ticking = true;
    try {
      const due = db.prepare("SELECT * FROM automation_rule WHERE deleted_at IS NULL AND enabled=1 AND exec_mode='action' AND next_run_at IS NOT NULL AND next_run_at<=? ORDER BY next_run_at ASC LIMIT 3").all(now());
      for (const row of due) await execute(ruleRow(row), "schedule", { at: now() });
    } finally {
      ticking = false;
    }
  }

  function onEvent(event) {
    if (!plainObject(event) || !event.domainId || !event.event) return;
    const rows = db.prepare("SELECT * FROM automation_rule WHERE deleted_at IS NULL AND enabled=1 AND trigger_type='event' LIMIT 200").all();
    for (const row of rows) {
      const rule = ruleRow(row);
      if (rule.triggerConfig.domainId === event.domainId && rule.triggerConfig.event === event.event) {
        void execute(rule, "event", event.data || {});
      }
    }
  }

  function start() {
    if (timer) return;
    timer = setInterval(() => void tick(), 30000);
    if (typeof timer.unref === "function") timer.unref();
  }

  function stop() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  function exportData() {
    return {
      rules: listRules().map((rule) => {
        // 宿主任务 id 只在本机有效，导出时去掉，导入时按表单重建。
        const { scheduleId, lastRun, rev, ...rest } = rule;
        return rest;
      }),
    };
  }

  async function importData(payload) {
    let data = payload;
    if (typeof payload === "string") {
      try {
        data = JSON.parse(payload);
      } catch {
        return { ok: false, imported: 0, skipped: 0, failed: 0, message: "备份内容不是合法 JSON" };
      }
    }
    const rules = data && Array.isArray(data.rules) ? data.rules : [];
    let imported = 0;
    let skipped = 0;
    let failed = 0;
    for (const item of rules.slice(0, 500)) {
      if (!item || !item.id || getRule(item.id)) {
        skipped += 1;
        continue;
      }
      try {
        // AI 规则会在这里重新向宿主登记一次任务（宿主任务 id 不可迁移）。
        await createRule(item);
        imported += 1;
      } catch (error) {
        failed += 1;
        log("导入规则失败 " + item.id + "：" + (error && error.message));
      }
    }
    return { ok: failed === 0, imported, skipped, failed, message: failed ? failed + " 条规则导入失败" : "" };
  }

  return {
    config,
    saveConfig,
    getRule,
    listRules,
    createRule,
    updateRule,
    deleteRule,
    runRule,
    runList,
    runGet,
    stats,
    tick,
    onEvent,
    start,
    stop,
    exportData,
    importData,
    listRulesLive: () => agentRules.listRulesLive(),
    agentStatus: () => agentRules.agentStatus(),
    agentHistory: (scheduleId, limit, before) => agentRules.agentHistory(scheduleId, limit, before),
  };
}
