/**
 * 「交给 AI」执行方式：把一条规则映射成宿主「自动化任务」里的任务。
 *
 * 与 action 执行方式的区别：工作台只负责表单与本地快照，真正的定时、投递、
 * 暂停/恢复、投递历史全部由宿主 schedule 服务负责（每到一个时间点把 prompt
 * 投进目标会话，由 agent 自己决定怎么做）。
 *
 * 本模块只做三件事：校验并规范化输入、调用宿主服务、把宿主错误码翻成中文。
 */

/** 宿主支持且工作台表单开放的时间类型。 */
export const TIMING_KINDS = ["every", "daily", "weekly", "cron", "rrule", "at", "after"];
/** 投递目标类型。 */
export const TARGET_KINDS = ["new_once", "new", "session"];
/** 提示词上限，超过直接报错而不是悄悄截断。 */
export const MAX_PROMPT = 4000;
/** 宿主任务标题上限（与 dsh-schedule 的 MAX_TITLE_LENGTH 一致）。 */
export const MAX_TITLE = 120;

const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TZ_RE = /^(UTC|[A-Za-z][A-Za-z0-9_+-]*(?:\/[A-Za-z0-9_+-]+)+)$/;
const CRON_RE = /^\s*\S+\s+\S+\s+\S+\s+\S+\s+\S+\s*$/;
const ISO_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d{1,3})?)?(Z|[+-]\d{2}:\d{2})$/;

/** 宿主错误码 → 中文说明。 */
const MESSAGES = {
  invalid_rule: "时间或目标不被宿主接受",
  invalid_prompt: "任务名称或提示词不被宿主接受",
  invalid_timing: "时间设置不被宿主接受",
  unsupported_timezone: "宿主不支持这个时区",
  subagent_session: "目标会话是子代理会话，不能作为投递目标",
  schedule_not_found: "宿主任务已不存在（可能已在「自动化任务」里删除）",
  schedule_conflict: "宿主任务刚被别处修改，请刷新后重试",
  schedule_execution_pending: "该任务正在执行，稍后再试",
  invalid_input: "输入不合法",
};

function bad(message) {
  const error = new Error(message);
  error.status = 400;
  return error;
}

function plainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function text(value, max) {
  const out = String(value == null ? "" : value).trim();
  return max > 0 ? out.slice(0, max) : out;
}

function positiveInt(value, fallback) {
  const num = Number(value);
  return Number.isSafeInteger(num) && num > 0 ? num : fallback;
}

/** 规范化时间设置，返回宿主 ScheduleTiming 请求结构（snake_case）。 */
export function normalizeTiming(raw) {
  if (!plainObject(raw)) throw bad("AI 规则需要填写时间设置");
  const kind = text(raw.kind, 16);
  if (!TIMING_KINDS.includes(kind)) throw bad("不支持的时间类型：" + (kind || "空"));
  if (kind === "every") {
    const seconds = positiveInt(raw.every_seconds, 0);
    if (seconds < 60) throw bad("间隔不能小于 1 分钟");
    if (seconds > 30 * 86400) throw bad("间隔不能超过 30 天");
    return { kind, every_seconds: seconds };
  }
  if (kind === "after") {
    const seconds = positiveInt(raw.after_seconds, 0);
    if (!seconds) throw bad("延迟秒数必须是正整数");
    if (seconds > 365 * 86400) throw bad("延迟不能超过一年");
    return { kind, after_seconds: seconds };
  }
  if (kind === "at") {
    const at = raw.at;
    if (typeof at === "string" && ISO_RE.test(at.trim())) return { kind, at: at.trim() };
    if (plainObject(at)) {
      const date = text(at.date, 10);
      const time = text(at.time, 8);
      const zone = text(at.time_zone, 64);
      if (!DATE_RE.test(date) || !TIME_RE.test(time) || !TZ_RE.test(zone)) {
        throw bad("一次性时间需要合法的日期、时间和时区");
      }
      return { kind, at: { date, time: time.length === 5 ? time + ":00" : time, time_zone: zone } };
    }
    throw bad("一次性时间需要 ISO 字符串或 {date,time,time_zone}");
  }
  if (kind === "daily") {
    const daily = plainObject(raw.daily) ? raw.daily : {};
    const time = text(daily.time, 8);
    const zone = text(daily.time_zone, 64);
    if (!TIME_RE.test(time) || !TZ_RE.test(zone)) throw bad("每天执行需要合法的 HH:MM 与时区");
    return { kind, daily: { time: time.length === 5 ? time + ":00" : time, time_zone: zone } };
  }
  if (kind === "weekly") {
    const weekly = plainObject(raw.weekly) ? raw.weekly : {};
    const time = text(weekly.time, 8);
    const zone = text(weekly.time_zone, 64);
    const days = Array.isArray(weekly.weekdays)
      ? [...new Set(weekly.weekdays.map((day) => Number(day)))]
          .filter((day) => Number.isInteger(day) && day >= 1 && day <= 7)
          .sort((a, b) => a - b)
      : [];
    if (!TIME_RE.test(time) || !TZ_RE.test(zone)) throw bad("每周执行需要合法的 HH:MM 与时区");
    if (!days.length) throw bad("每周执行至少选择一个星期");
    return { kind, weekly: { time: time.length === 5 ? time + ":00" : time, time_zone: zone, weekdays: days } };
  }
  if (kind === "cron") {
    const cron = plainObject(raw.cron) ? raw.cron : {};
    const expression = text(cron.expression, 120);
    const zone = text(cron.time_zone, 64);
    if (!CRON_RE.test(expression)) throw bad("cron 需要 5 段表达式：分 时 日 月 周");
    if (!TZ_RE.test(zone)) throw bad("cron 需要合法时区");
    return { kind, cron: { expression: expression.replace(/\s+/g, " "), time_zone: zone } };
  }
  const rrule = text(raw.rrule, 2000);
  if (!/^DTSTART[^\n]*\nRRULE:/i.test(rrule.replace(/\r\n/g, "\n"))) {
    throw bad("rrule 需要一行 DTSTART 和一行 RRULE");
  }
  return { kind: "rrule", rrule: rrule.replace(/\r\n/g, "\n") };
}

/** 规范化投递目标，返回宿主 ScheduleTargetRequest。 */
export function normalizeTarget(raw) {
  if (raw == null || raw === "") return { kind: "new_once" };
  if (!plainObject(raw)) throw bad("投递目标格式不正确");
  const kind = text(raw.kind, 16) || "new_once";
  if (!TARGET_KINDS.includes(kind)) throw bad("不支持的投递目标：" + kind);
  if (kind === "session") {
    const sessionId = text(raw.sessionId, 200);
    if (!sessionId) throw bad("投递到已有会话需要填写会话 id");
    return { kind, sessionId };
  }
  const create = plainObject(raw.create) ? raw.create : {};
  const spec = {};
  const cwd = text(create.cwd, 500);
  const preset = text(create.agentPreset, 120);
  if (cwd) spec.cwd = cwd;
  if (preset) spec.agentPreset = preset;
  return Object.keys(spec).length ? { kind, create: spec } : { kind };
}

/** 校验一条 AI 规则的可编辑部分，返回 {prompt, timing, target}。 */
export function normalizeAgent(raw) {
  if (!plainObject(raw)) throw bad("AI 规则需要提示词与时间设置");
  const prompt = text(raw.prompt, 0);
  if (!prompt) throw bad("AI 规则需要填写提示词（投递给 agent 的指令）");
  if (prompt.length > MAX_PROMPT) throw bad("提示词不能超过 " + MAX_PROMPT + " 字");
  return { prompt, timing: normalizeTiming(raw.timing), target: normalizeTarget(raw.target) };
}

/** 把宿主记录翻成前端要展示的摘要（时间描述由前端按 record 拼）。 */
export function recordSummary(entry) {
  if (!plainObject(entry)) return null;
  const record = plainObject(entry.record) ? entry.record : {};
  return {
    scheduleId: record.id || "",
    title: record.title || "",
    prompt: record.prompt || "",
    kind: record.kind || "",
    timing: record,
    status: entry.status || "",
    target: entry.target || null,
    scheduledAt: record.scheduledAt || "",
    lastDeliveryAt: entry.lastDelivery && entry.lastDelivery.deliveredAt ? entry.lastDelivery.deliveredAt : "",
    executionActive: Boolean(entry.executionActive),
    updatedAt: entry.updatedAt || "",
    missing: false,
  };
}

/**
 * 宿主 schedule 桥接。所有方法在宿主没加载 schedule 时统一报错，
 * 由上层决定是拒绝请求（改写规则）还是降级（只读展示）。
 */
export function createAgentBridge({ getSchedule, log = () => {} }) {
  function service() {
    const schedule = getSchedule();
    if (!schedule || typeof schedule.create !== "function") {
      throw bad("当前宿主没有加载「自动化任务」服务，无法使用「交给 AI」执行方式（需要 DSH 内置 schedule 插件）");
    }
    return schedule;
  }

  /** 宿主异常 → 中文 400；已经是本模块抛出的错误原样透传。 */
  function wrap(error) {
    if (error && Number(error.status) > 0) throw error;
    const code = text(error && error.code, 40);
    const known = MESSAGES[code];
    if (!known) throw error;
    const detail = text(error && error.message, 300);
    log("agent schedule " + code + ": " + detail);
    throw bad(known + (detail ? "：" + detail : ""));
  }

  async function call(fn) {
    try {
      return await fn();
    } catch (error) {
      wrap(error);
    }
  }

  return {
    available() {
      const schedule = getSchedule();
      return Boolean(schedule && typeof schedule.create === "function");
    },
    limits() {
      const schedule = service();
      let newSessionIntervalSeconds = 60;
      try {
        const limits = schedule.deliveryLimits();
        if (limits && Number(limits.newSessionIntervalSeconds) > 0) {
          newSessionIntervalSeconds = Number(limits.newSessionIntervalSeconds);
        }
      } catch (error) {
        log("agent deliveryLimits failed: " + (error && error.message));
      }
      return { available: true, minEverySeconds: 60, maxTitle: MAX_TITLE, maxPrompt: MAX_PROMPT, newSessionIntervalSeconds };
    },
    async create(input) {
      const schedule = service();
      return call(() =>
        schedule.create({ title: input.title, prompt: input.prompt, timing: input.timing, target: input.target }),
      );
    },
    async update(scheduleId, patch) {
      const schedule = service();
      const out = await call(() =>
        schedule.edit({ id: scheduleId, action: "update", patch }),
      );
      if (out && out.code === "schedule_not_found") throw bad(MESSAGES.schedule_not_found);
      if (out && out.code === "schedule_conflict") throw bad(MESSAGES.schedule_conflict);
      return out;
    },
    async remove(scheduleId) {
      const schedule = service();
      const out = await call(() => schedule.edit({ id: scheduleId, action: "delete" }));
      if (out && out.code === "schedule_not_found") return { removed: false };
      return { removed: true };
    },
    async run(scheduleId) {
      const schedule = service();
      const out = await call(() => schedule.run({ id: scheduleId }));
      if (out && out.code === "schedule_not_found") return { status: "missing" };
      if (out && out.code === "schedule_execution_pending") return { status: "pending" };
      return { status: "delivered", entry: out };
    },
    /** 全量宿主任务，按 id 建索引；失败返回 {ok:false,error} 而不是抛错。 */
    async catalog() {
      const schedule = service();
      try {
        const entries = await schedule.catalog();
        const map = new Map();
        for (const entry of Array.isArray(entries) ? entries : []) {
          const summary = recordSummary(entry);
          if (summary && summary.scheduleId) map.set(summary.scheduleId, summary);
        }
        return { ok: true, map };
      } catch (error) {
        log("agent catalog failed: " + (error && error.message));
        return { ok: false, error: text(error && error.message, 300), map: new Map() };
      }
    },
    async history(scheduleId, limit, before) {
      const schedule = service();
      const request = { id: scheduleId, limit: Math.min(Math.max(positiveInt(limit, 20), 1), 100) };
      if (before) request.before = before;
      const page = await call(() => schedule.history(request));
      return {
        id: (page && page.id) || scheduleId,
        records: Array.isArray(page && page.records) ? page.records : [],
        earlierRecordsUnavailable: Boolean(page && page.earlierRecordsUnavailable),
        earlierRecordsPruned: Boolean(page && page.earlierRecordsPruned),
      };
    },
  };
}
