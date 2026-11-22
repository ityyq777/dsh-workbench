/** 单次投递的提示词上限：够写清楚一件任务，又不至于把会话塞爆。 */
export const MAX_AGENT_RUN_PROMPT = 8000;
/** 每个来源每小时最多新建多少次会话（进程内计数，重启归零，只用于防抖与防跑飞）。 */
export const AGENT_RUN_PER_HOUR = 10;
/** 全局同时存在的运行中请求上限：新会话彼此独立，这里只限制并发建会话的数量。 */
export const AGENT_RUN_MAX_CONCURRENT = 2;
const SOURCE_RE = /^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$/;
/**
 * 造 host.agentRun 的 action 定义。计数与并发都留在闭包里，宿主重启即归零。
 */
export function createAgentRun(deps) {
    const now = deps.now ?? (() => Date.now());
    const newRequestId = deps.newRequestId ?? (() => "agentrun-" + Math.random().toString(36).slice(2) + "-" + now().toString(36));
    /** source → 最近一次窗口内的调用时间戳；窗口是滑动的一小时。 */
    const windows = new Map();
    let active = 0;
    function sessionController() {
        const controller = deps.getSessionController();
        if (!controller || typeof controller.create !== "function" || typeof controller.prompt !== "function") {
            throw new Error("当前宿主没有加载会话服务（sessionController），无法新建 agent 会话；" +
                "host.agentRun 需要 DSH 的会话控制器与 agents 服务");
        }
        return controller;
    }
    function sourceOf(raw) {
        const value = typeof raw === "string" ? raw.trim() : "";
        if (!value)
            return "unknown";
        if (!SOURCE_RE.test(value))
            throw new Error("source 只能是 1-64 位字母数字与 . _ -（一般传自己的域 id）");
        return value;
    }
    /** 滑动窗口计数：先清掉一小时前的记录，再看是否超限。 */
    function checkRate(source) {
        const at = now();
        const kept = (windows.get(source) ?? []).filter((ts) => at - ts < 3600_000);
        if (kept.length >= AGENT_RUN_PER_HOUR) {
            const waitMinutes = Math.max(1, Math.ceil((3600_000 - (at - kept[0])) / 60_000));
            throw new Error("来源 " + source + " 一小时内已新建 " + kept.length + " 个 agent 会话（上限 " + AGENT_RUN_PER_HOUR + "），约 " + waitMinutes + " 分钟后再试");
        }
        kept.push(at);
        windows.set(source, kept);
    }
    return {
        description: "新建一个 DSH agent 会话，并把提示词投递进去。默认只允许插件（plugin）来源调用，界面与 agent 都调不到；" +
            "需要在界面手动调用时，在 Action 页把 ui 打开。返回的 accepted 只表示提示词已进入会话收件箱，不表示执行成功。",
        // 只给插件用：agent 不能给自己开新会话再让新会话干活（自我放大回路）。
        origins: ["plugin"],
        input: {
            type: "object",
            properties: {
                prompt: {
                    type: "string",
                    description: "要投给新会话的提示词（必填，≤ " + MAX_AGENT_RUN_PROMPT + " 字）",
                },
                source: {
                    type: "string",
                    description: "调用方自己的域 id（如 wb-addon-automation），用于限流分桶与排查；省略记作 unknown",
                },
                cwd: { type: "string", description: "新会话的工作目录；省略用宿主默认目录" },
                agentPreset: { type: "string", description: "新会话使用的 agent 预设 id；省略用宿主默认预设" },
            },
            required: ["prompt"],
        },
        examples: [
            {
                prompt: "整理今天新增的任务，按优先级给出建议，并把结论写进任务备注。",
                source: "wb-addon-automation",
            },
        ],
        render: (result) => "已新建会话 " + result.sessionId + "（提示词已进收件箱；accepted 不表示执行成功）",
        async execute(args) {
            const prompt = typeof args.prompt === "string" ? args.prompt.trim() : "";
            if (!prompt)
                throw new Error("缺少 prompt：要投给新会话的提示词");
            if (prompt.length > MAX_AGENT_RUN_PROMPT) {
                throw new Error("prompt 过长（" + prompt.length + " 字），上限 " + MAX_AGENT_RUN_PROMPT + " 字");
            }
            const source = sourceOf(args.source);
            const cwd = typeof args.cwd === "string" && args.cwd.trim() ? args.cwd.trim() : undefined;
            const agentPreset = typeof args.agentPreset === "string" && args.agentPreset.trim() ? args.agentPreset.trim() : undefined;
            const controller = sessionController();
            checkRate(source);
            if (active >= AGENT_RUN_MAX_CONCURRENT) {
                throw new Error("同时进行中的 agent 会话创建已有 " + active + " 个（上限 " + AGENT_RUN_MAX_CONCURRENT + "），请稍后再试");
            }
            active += 1;
            try {
                // 先建会话：cwd 与 agentPreset 都由宿主会话控制器校验，插件不重复实现。
                const created = await controller.create(cwd || agentPreset ? { cwd, agentPreset } : {});
                const sessionId = String(created && created.sessionId ? created.sessionId : "");
                if (!sessionId)
                    throw new Error("宿主没有返回新会话 id，agent 会话创建失败");
                // 再投递：mode=queue 表示排队（新会话此刻空闲），requestId 作幂等键。
                await controller.prompt({
                    sessionId,
                    content: [{ type: "text", text: prompt }],
                    mode: "queue",
                    requestId: newRequestId(),
                });
                return { sessionId, accepted: true };
            }
            catch (error) {
                const message = error instanceof Error ? error.message : String(error);
                throw new Error("新建 agent 会话失败：" + message);
            }
            finally {
                active -= 1;
            }
        },
    };
}
