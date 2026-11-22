import { newId, now } from "../db/db.js";
import { normalizeAgent } from "./agent.js";

/** 「交给 AI」规则：宿主任务的登记、对账与能力探测；本地表只存快照。 */
export function createAgentRules({ db, agent, log, plainObject, bad, getRule, listRules }) {
  /** 拉一次宿主 catalog，把状态与快照回写到规则；不动 updated_at，避免打乱本机排序。 */
  async function listRulesLive() {
    const rules = listRules();
    if (!rules.some((rule) => rule.execMode === "agent" && rule.scheduleId)) return rules;
    const catalog = await agent.catalog();
    if (!catalog.ok) return rules.map((rule) => Object.assign(rule, { agentOnline: false }));
    return rules.map((rule) => {
      if (rule.execMode !== "agent") return rule;
      const live = catalog.map.get(rule.scheduleId);
      if (!live) {
        db.prepare("UPDATE automation_rule SET enabled=0, next_run_at=NULL WHERE id=? AND enabled=1").run(rule.id);
        return Object.assign(rule, { enabled: false, scheduleMissing: true, agentOnline: true, scheduleStatus: "missing" });
      }
      const prev = plainObject(rule.agent) ? rule.agent : {};
      const snapshot = {
        ...prev,
        title: live.title || rule.name,
        prompt: live.prompt || prev.prompt || "",
        kind: live.kind || prev.kind || "",
        timing: prev.timing || null,
        target: live.target || prev.target || { kind: "new_once" },
        status: live.status,
        scheduledAt: live.scheduledAt,
        lastDeliveryAt: live.lastDeliveryAt || "",
        executionActive: live.executionActive,
      };
      const nextRunAt = live.scheduledAt ? Date.parse(live.scheduledAt) || null : null;
      if (JSON.stringify(snapshot) !== JSON.stringify(prev) || rule.nextRunAt !== nextRunAt) {
        db.prepare("UPDATE automation_rule SET enabled=?, agent_json=?, next_run_at=? WHERE id=?").run(
          live.status === "active" ? 1 : 0,
          JSON.stringify(snapshot),
          nextRunAt,
          rule.id,
        );
      }
      return Object.assign(rule, {
        name: live.title || rule.name,
        enabled: live.status === "active",
        agent: snapshot,
        agentOnline: true,
        scheduleMissing: false,
        scheduleStatus: live.status,
        nextRunAt,
      });
    });
  }

  /** 新建「交给 AI」规则：先建宿主任务，再落本地行；本地失败则回滚宿主任务。 */
  async function createAgentRule(data, name) {
    const agentConfig = normalizeAgent(data.agent);
    const entry = await agent.create({
      title: name,
      prompt: agentConfig.prompt,
      timing: agentConfig.timing,
      target: agentConfig.target,
    });
    const record = plainObject(entry && entry.record) ? entry.record : {};
    const scheduleId = String(record.id || "");
    if (!scheduleId) throw bad("宿主没有返回任务 id，规则未保存");
    const status = String((entry && entry.status) || "active");
    const snapshot = {
      ...agentConfig,
      title: name,
      kind: record.kind || agentConfig.timing.kind,
      status,
      scheduledAt: record.scheduledAt || "",
      lastDeliveryAt: (entry && entry.lastDelivery && entry.lastDelivery.deliveredAt) || "",
      executionActive: Boolean(entry && entry.executionActive),
    };
    const nextRunAt = record.scheduledAt ? Date.parse(record.scheduledAt) || null : null;
    const id = newId("rule");
    const ts = now();
    try {
      db.prepare(
        "INSERT INTO automation_rule(id,name,enabled,exec_mode,agent_json,schedule_id,trigger_type,trigger_config,condition,action_name,action_args,next_run_at,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
      ).run(
        id,
        name,
        status === "active" ? 1 : 0,
        "agent",
        JSON.stringify(snapshot),
        scheduleId,
        "agent",
        JSON.stringify({ kind: "agent", timing: agentConfig.timing, target: agentConfig.target }),
        "",
        "",
        "{}",
        nextRunAt,
        ts,
        ts,
      );
    } catch (error) {
      // 本地写失败就把刚建好的宿主任务删掉，避免留下看不见的孤儿任务。
      try {
        await agent.remove(scheduleId);
      } catch (cleanupError) {
        log("回滚宿主任务失败：" + (cleanupError && cleanupError.message));
      }
      throw error;
    }
    return getRule(id);
  }

  /** 编辑「交给 AI」规则：只把真正变化的字段发成宿主 patch，空 patch 直接返回。 */
  async function updateAgentRule(existing, data, name) {
    if (!existing.scheduleId) throw bad("规则还没有关联宿主任务，请删除后重建");
    const prev = plainObject(existing.agent) ? existing.agent : {};
    const next = data.agent ? normalizeAgent(data.agent) : normalizeAgent(prev);
    const enabled = data.enabled == null ? existing.enabled : data.enabled !== false;
    const patch = {};
    if (name !== existing.name) patch.title = name;
    if (next.prompt !== prev.prompt) patch.prompt = next.prompt;
    if (JSON.stringify(next.timing) !== JSON.stringify(prev.timing)) patch.timing = next.timing;
    if (JSON.stringify(next.target) !== JSON.stringify(prev.target)) patch.target = next.target;
    if (enabled !== existing.enabled) patch.active = enabled;
    if (!Object.keys(patch).length) return existing;
    const out = await agent.update(existing.scheduleId, patch);
    const record = plainObject(out && out.record) ? out.record : {};
    const status = String((out && out.status) || prev.status || "active");
    const snapshot = {
      ...prev,
      prompt: next.prompt,
      timing: next.timing,
      target: next.target,
      title: name,
      kind: record.kind || prev.kind || next.timing.kind,
      status,
      scheduledAt: record.scheduledAt || prev.scheduledAt || "",
      lastDeliveryAt: (out && out.lastDelivery && out.lastDelivery.deliveredAt) || prev.lastDeliveryAt || "",
      executionActive: Boolean(out && out.executionActive),
    };
    const nextRunAt = record.scheduledAt ? Date.parse(record.scheduledAt) || null : null;
    db.prepare(
      "UPDATE automation_rule SET name=?,enabled=?,agent_json=?,trigger_config=?,next_run_at=?,updated_at=?,rev=rev+1 WHERE id=?",
    ).run(
      name,
      status === "active" ? 1 : 0,
      JSON.stringify(snapshot),
      JSON.stringify({ kind: "agent", timing: snapshot.timing, target: snapshot.target }),
      nextRunAt,
      now(),
      existing.id,
    );
    return getRule(existing.id);
  }

  /** 宿主能力与「未纳入工作台」的任务：判断能不能用 AI 执行方式，并给出提示。 */
  async function agentStatus() {
    if (!agent.available()) {
      return { available: false, minEverySeconds: 60, maxTitle: 120, newSessionIntervalSeconds: 60, tasks: 0, orphans: [] };
    }
    let limits = { available: true, minEverySeconds: 60, maxTitle: 120, newSessionIntervalSeconds: 60 };
    try {
      limits = agent.limits();
    } catch (error) {
      log("读取宿主限制失败：" + (error && error.message));
    }
    const known = new Set(
      db.prepare("SELECT schedule_id FROM automation_rule WHERE deleted_at IS NULL AND schedule_id IS NOT NULL AND schedule_id!=''").all().map((row) => row.schedule_id),
    );
    const catalog = await agent.catalog();
    const orphans = catalog.ok
      ? [...catalog.map.values()]
          .filter((entry) => !known.has(entry.scheduleId))
          .slice(0, 50)
          .map((entry) => ({
            scheduleId: entry.scheduleId,
            title: entry.title,
            kind: entry.kind,
            status: entry.status,
            scheduledAt: entry.scheduledAt,
          }))
      : [];
    return { ...limits, tasks: catalog.ok ? catalog.map.size : 0, orphans };
  }

  function agentHistory(scheduleId, limit, before) {
    return agent.history(scheduleId, limit, before);
  }

  return { listRulesLive, createAgentRule, updateAgentRule, agentStatus, agentHistory };
}
