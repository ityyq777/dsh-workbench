import { actionErrorText } from "./action-output.js";
import { renderActionHelp, renderActionList, renderAuditList, renderAuditRecord, renderAuditStats } from "./action-render.js";
import { createTaskTargets } from "./task-targets.js";
import { createCapabilities } from "./capabilities.js";
import { AGENT_LOCKED_ACTIONS, createAgentAccess } from "./agent-access.js";
import { BUILTIN_ACTIONS } from "./builtin-actions.js";
export function createActions({ domains, SHELL_VERSION, publicInfo, audit, clock, emit, db, search }) {
    /** 宿主内置的元 action 归属域（不参与备份，也不是业务插件）。 */
    const META_DOMAIN = "wb-shell";
    /** agent 可调用开关：声明默认值 + 本机 meta 覆盖（只在本机生效，不进备份/同步）。 */
    const agentAccess = createAgentAccess(db);
    /** 权限开关拦下的错误：都要进审计，且即使 action 属于「默认不记」的类别也不例外。 */
    function isPolicyDenied(error) {
        const code = String(error?.code ?? "");
        return code === "ACTION_AGENT_DISABLED" || code === "ACTION_UI_ONLY";
    }
    /** 被本机关闭的 action，agent 硬调时的结构化错误。 */
    function agentDisabledError(action) {
        const error = new Error("该 action 已被本机设置禁止 agent 调用（界面仍可执行）：" + action);
        error.code = "ACTION_AGENT_DISABLED";
        error.details = { action };
        return error;
    }
    /** 开关只能从界面改：agent 调用一律拒绝，保证它没法给自己解锁。 */
    function uiOnlyError() {
        const error = new Error("该 action 只允许在界面中执行；agent 不能修改 action 的调用权限");
        error.code = "ACTION_UI_ONLY";
        return error;
    }
    /** agent 视角下某个 action 是否可见/可调（ui 恒为 true，不受开关影响）。 */
    function agentVisible(name, def) {
        return agentAccess.effective(name, def);
    }
    /** 分发前拦截：agent 调不到被关闭的 action；未知 action 仍走原来的报错。 */
    function assertAgentAllowed(action, origin) {
        if (origin !== "agent")
            return;
        if (AGENT_LOCKED_ACTIONS.has(action))
            throw agentDisabledError(action);
        const found = findActionDef(action);
        if (found && !agentVisible(action, found.def))
            throw agentDisabledError(action);
    }
    /**
     * 宿主元 action：与业务域共用同一套 schema 发现（actions.list/help）与分发、审计链路，
     * 但不需要注册成插件域，统一归在 wb-shell 下。
     */
    const META_ACTIONS = new Map();
    META_ACTIONS.set("audit.list", {
        description: "查询本机审计日志：谁在何时通过哪个入口（agent/ui/sync）调了哪个 action、成功与否、耗时与目标。只读 action 默认不记；参数里的密码/token/保险箱值一律脱敏为 ***。",
        input: {
            type: "object",
            properties: {
                action: { type: "string", description: "精确匹配 action 名，如 tasks.update" },
                actionPrefix: { type: "string", description: "按 action 前缀过滤，如 tasks. 或 tags." },
                actor: { type: "string", description: "入口过滤：agent / ui / sync / other" },
                domain: { type: "string", description: "业务域 id 过滤，如 wb-addon-tasks" },
                ok: { type: ["boolean", "string", "number"], description: "只看成功（true/1）或只看失败（false/0）" },
                q: { type: "string", description: "在 action / target / error 中模糊搜索" },
                target: { type: "string", description: "目标过滤，如 id=01a1… 或任务 id / 标签名" },
                since: { type: ["number", "string"], description: "起始时间：毫秒时间戳或 YYYY-MM-DD" },
                until: { type: ["number", "string"], description: "结束时间：毫秒时间戳或 YYYY-MM-DD（含当天）" },
                page: { type: "number", description: "页码，从 1 开始" },
                pageSize: { type: "number", description: "每页条数，默认 50，上限 200" },
            },
            required: [],
        },
        examples: [{ pageSize: 20, ok: "false" }, { actionPrefix: "tasks.", since: "2026-11-01" }],
        execute: (args) => audit.list(args),
        render: (result) => renderAuditList(result),
    });
    META_ACTIONS.set("audit.get", {
        description: "按 id 查看一条审计记录的完整内容（参数与结果摘要已脱敏、超长已截断）。",
        input: {
            type: "object",
            properties: { id: { type: "number", description: "audit.list 返回的记录 id" } },
            required: ["id"],
        },
        examples: [{ id: 1 }],
        execute: (args) => {
            const id = Number(args.id);
            if (!Number.isFinite(id) || id <= 0)
                throw new Error("id 必须是正整数");
            const record = audit.get(id);
            if (!record)
                throw new Error("没有该审计记录：" + id);
            return record;
        },
        render: (result) => renderAuditRecord(result),
    });
    META_ACTIONS.set("audit.stats", {
        description: "审计统计：区间内总数、失败数、按 action / 入口 / 天的分布。用于回答「这几天改了什么、失败多不多」。",
        input: {
            type: "object",
            properties: { rangeDays: { type: ["number", "string"], description: "统计最近多少天，默认 30，范围 1..3650" } },
            required: [],
        },
        examples: [{ rangeDays: 7 }],
        execute: (args) => audit.stats(args.rangeDays ?? 30),
        render: (result) => renderAuditStats(result),
    });
    META_ACTIONS.set("audit.prune", {
        description: "按保留期清理旧审计（默认 90 天，可用 meta.audit.retentionDays 调整）。删除不可恢复，日常无需调用。",
        input: {
            type: "object",
            properties: { retentionDays: { type: "number", description: "保留天数，1..3650；省略则用当前配置" } },
            required: [],
        },
        examples: [{ retentionDays: 30 }],
        execute: (args) => audit.prune(args.retentionDays),
        render: (result) => "已清理 " + result.deleted + " 条审计（保留 " + result.retentionDays + " 天，截止 " + new Date(result.cutoff).toISOString() + "）",
    });
    META_ACTIONS.set("actions.setAgentAccess", {
        description: "（仅界面）打开/关闭某个 action 的 agent 可调用开关。开关只存本机 meta，不参与备份与云同步；" +
            "关闭后 agent 在 actions.list / actions.help / capabilities.* / *.actionSchema 中都看不到该 action，" +
            "硬调会得到 ACTION_AGENT_DISABLED；界面（origin=ui）的调用完全不受影响。agent 永远不能调用本 action。",
        // 开关自身永久对 agent 关闭：否则「先解锁开关、再解锁一切」就绕过了整套限制。
        agentEnabled: false,
        input: {
            type: "object",
            properties: {
                action: { type: "string", description: "要调整的 action 名，如 tasks.update / mail.messageBody" },
                agentEnabled: { type: "boolean", description: "true=允许 agent 调用；false=只允许界面调用" },
                domain: { type: "string", description: "可选：所属业务域 id（wb-addon-tasks 或 tasks），传了就校验归属" },
            },
            required: ["action", "agentEnabled"],
        },
        examples: [{ action: "tasks.update", agentEnabled: false }],
        execute: (args, ctx) => {
            if (ctx.origin !== "ui")
                throw uiOnlyError();
            const name = String(args.action ?? "").trim();
            if (!name)
                throw new Error("缺少 action");
            if (typeof args.agentEnabled !== "boolean")
                throw new Error("agentEnabled 必须是布尔值 true / false");
            const found = findActionDef(name);
            if (!found)
                throw new Error("没有该 action：" + name);
            const domain = args.domain === undefined || args.domain === null ? "" : String(args.domain).trim();
            if (domain && domain !== found.domainId && domain !== found.domainId.replace(/^wb-addon-/, "")) {
                throw new Error("action " + name + " 属于 " + found.domainId + "，不是 " + domain);
            }
            const changed = agentAccess.set(name, found.def, args.agentEnabled);
            const out = {
                action: name,
                domain: found.domainId,
                agentEnabled: changed.agentEnabled,
                source: changed.source,
                declared: agentAccess.declaredValue(name, found.def),
                locked: agentAccess.locked(name, found.def),
            };
            // 开关本身是安全相关操作：actions.* 默认不进审计，这里显式留一条。
            audit.record({
                action: "actions.setAgentAccess",
                domain: META_DOMAIN,
                actor: ctx.origin,
                ok: true,
                args: { action: name, agentEnabled: args.agentEnabled },
                result: out,
                durationMs: 0,
                force: true,
            });
            return out;
        },
        render: (result) => (result.agentEnabled ? "已允许" : "已禁止") +
            " agent 调用 " +
            result.action +
            "（来源：" +
            (result.source === "meta" ? "本机覆盖" : "action 定义的默认值") +
            "）",
    });
    /** 旧版 Workbench 顶层 schema 里的“通用字段”，多数 action 并不接受。 */
    const TRAP_FIELDS = ["due_at", "note", "tags", "tagIds", "dirIds", "parentId", "deadline", "start_at", "assignee", "limit"];
    const taskTargets = createTaskTargets(db, domains, invoke);
    META_ACTIONS.set("capabilities.setTaskTarget", taskTargets.setAction);
    const { capabilityListMeta, renderCapabilityList, capabilityGetMeta, renderCapability } = createCapabilities({ domains, SHELL_VERSION, actionEntry, taskTargets, agentVisible });
    function findActionDef(name) {
        const builtin = BUILTIN_ACTIONS.get(name);
        if (builtin)
            return { def: builtin, domainId: META_DOMAIN };
        const meta = META_ACTIONS.get(name);
        if (meta)
            return { def: meta, domainId: META_DOMAIN };
        for (const rec of domains.values()) {
            const def = rec.actions.get(name);
            if (def)
                return { def, domainId: rec.def.id };
        }
        return null;
    }
    function actionParams(def) {
        const input = (def.input ?? {});
        const props = input && typeof input === "object" && input.properties && typeof input.properties === "object"
            ? input.properties
            : {};
        const required = input && Array.isArray(input.required) ? input.required : [];
        return { props, required: required.filter((key) => Object.prototype.hasOwnProperty.call(props, key)) };
    }
    function actionEntry(name, domainId, def) {
        const { props, required } = actionParams(def);
        return {
            name,
            domain: domainId,
            description: def.description ?? "",
            required,
            params: Object.keys(props),
            input: def.input ?? { type: "object", properties: {} },
            // UI 的 Action 页据此区分三种状态：允许 / 默认关闭（可开）/ 永远关闭（agentLocked 安全锁定）。
            agentEnabled: agentAccess.effective(name, def),
            agentLocked: agentAccess.locked(name, def),
        };
    }
    /** actions.list：把已注册 action 的“真实入参”暴露给 agent，避免按顶层通用 schema 猜字段。 */
    function listActionsMeta(args, origin = "ui") {
        const raw = args.domain === undefined || args.domain === null ? "" : String(args.domain).trim();
        const matchDomain = (domainId) => !raw || domainId === raw || domainId === "wb-addon-" + raw;
        const matchAction = (name, domainId) => !raw || matchDomain(domainId) || name === raw || name.split(".")[0] === raw;
        const all = [];
        for (const rec of domains.values()) {
            for (const [name, def] of rec.actions) {
                // agent 视图只列出它真能调用的 action；被本机关闭的不出现（ui 仍看全量）。
                if (origin === "agent" && !agentVisible(name, def))
                    continue;
                if (matchAction(name, rec.def.id))
                    all.push(actionEntry(name, rec.def.id, def));
            }
        }
        for (const [name, def] of META_ACTIONS) {
            if (origin === "agent" && !agentVisible(name, def))
                continue;
            if (matchAction(name, META_DOMAIN))
                all.push(actionEntry(name, META_DOMAIN, def));
        }
        for (const [name, def] of BUILTIN_ACTIONS) {
            if (origin === "agent" && !agentVisible(name, def))
                continue;
            if (matchAction(name, META_DOMAIN))
                all.push(actionEntry(name, META_DOMAIN, def));
        }
        const ids = new Set(all.map((a) => a.domain));
        const domainsOut = [...domains.values()]
            .filter((rec) => ids.has(rec.def.id))
            .map((rec) => {
            const info = publicInfo(rec);
            return {
                id: info.id,
                title: info.title,
                version: info.version,
                enabled: info.enabled,
                error: info.error,
                // agent 视图只数它看得到的；ui 保持原有的域内 action 总数。
                actionCount: origin === "agent" ? all.filter((a) => a.domain === info.id).length : rec.actions.size,
            };
        });
        if (ids.has(META_DOMAIN)) {
            domainsOut.push({
                id: META_DOMAIN,
                title: "宿主元 action（能力发现与审计）",
                version: SHELL_VERSION,
                enabled: true,
                error: null,
                actionCount: all.filter((a) => a.domain === META_DOMAIN).length,
            });
        }
        const detail = args.detail === true;
        return {
            shellVersion: SHELL_VERSION,
            domains: domainsOut,
            actions: detail
                ? all
                : all.map((a) => ({
                    name: a.name,
                    domain: a.domain,
                    description: a.description,
                    required: a.required,
                    params: a.params,
                    agentEnabled: a.agentEnabled,
                    agentLocked: a.agentLocked,
                })),
        };
    }
    /** actions.help：单个 action 的完整 schema + 参数说明 + 示例。 */
    function helpActionMeta(args, origin = "ui") {
        const name = String(args.action ?? args.name ?? "").trim();
        if (!name)
            throw new Error("缺少 action；先用 actions.list 查看可用 action");
        const found = findActionDef(name);
        // help 也是 agent 的发现入口：关掉的 action 连参数都不给它看，和调用保持同一套错误。
        if (origin === "agent" && (AGENT_LOCKED_ACTIONS.has(name) || (found && !agentVisible(name, found.def)))) {
            throw agentDisabledError(name);
        }
        if (!found)
            throw new Error("没有该 action：" + name + "；先用 actions.list 查看可用 action");
        const entry = actionEntry(name, found.domainId, found.def);
        const { props } = actionParams(found.def);
        const params = Object.keys(props).map((key) => ({
            name: key,
            type: Array.isArray(props[key]?.type) ? props[key].type.join("|") : (props[key]?.type ?? "any"),
            required: entry.required.indexOf(key) >= 0,
            description: props[key]?.description ?? "",
            enum: props[key]?.enum,
        }));
        return {
            name,
            domain: entry.domain,
            description: entry.description,
            input: entry.input,
            params,
            examples: found.def.examples ?? [],
        };
    }
    function actionNames() {
        const out = [];
        for (const rec of domains.values()) {
            for (const [action, def] of rec.actions) {
                out.push({ name: action, domainId: rec.def.id, description: def.description });
            }
        }
        // 元 action 与内置 action 按名字去重后一起暴露：界面路由据此找到归属域。
        const seen = new Set(out.map((entry) => entry.name));
        for (const map of [META_ACTIONS, BUILTIN_ACTIONS]) {
            for (const [name, def] of map) {
                if (seen.has(name))
                    continue;
                seen.add(name);
                out.push({ name, domainId: META_DOMAIN, description: def.description });
            }
        }
        return out;
    }
    async function invoke(action, args, origin) {
        // 审计只在分发外层做一次：成功按实际 domainId 记，失败记下错误后原样抛出。
        // 能力发现与审计自身不记录，避免自举递归和噪声。
        const audited = !/^(capabilities|actions|audit)\./.test(action);
        const started = clock.now();
        try {
            const out = await invokeAction(action, args, origin);
            if (audited) {
                audit.record({
                    action,
                    domain: out.domainId,
                    actor: origin,
                    ok: true,
                    args,
                    result: out.result,
                    durationMs: clock.now() - started,
                });
            }
            return out;
        }
        catch (e) {
            // 被权限开关拦下的调用一律留痕（即使 action 本身属于「默认不记」的那几类）。
            const deniedByPolicy = isPolicyDenied(e);
            if (audited || deniedByPolicy) {
                const target = findActionDef(action);
                audit.record({
                    action,
                    domain: target ? target.domainId : "",
                    actor: origin,
                    ok: false,
                    error: String((e && e.message) || e),
                    args,
                    durationMs: clock.now() - started,
                    force: deniedByPolicy || undefined,
                });
            }
            throw e;
        }
    }
    async function invokeAction(action, args, origin) {
        // 入口一处拦截：agent 调不到被本机关闭的 action（含永久锁死的开关自身）；
        // ui/sync/plugin 的语义完全不变。拦截失败同样会进 invoke() 的审计。
        assertAgentAllowed(action, origin);
        if (action === "capabilities.list") {
            const result = await capabilityListMeta(args, origin);
            return { result, text: renderCapabilityList(result), domainId: META_DOMAIN };
        }
        if (action === "capabilities.get") {
            const result = await capabilityGetMeta(args, origin);
            return { result, text: renderCapability(result), domainId: META_DOMAIN };
        }
        if (action === "actions.list") {
            const result = listActionsMeta(args, origin);
            return { result, text: renderActionList(result), domainId: META_DOMAIN };
        }
        if (action === "actions.help") {
            const result = helpActionMeta(args, origin);
            return { result, text: renderActionHelp(result), domainId: META_DOMAIN };
        }
        const meta = META_ACTIONS.get(action);
        if (meta) {
            const result = await meta.execute(args, {
                origin,
                emit: (event, data) => emit("domain-event", { domainId: META_DOMAIN, event, data: data ?? null }),
            });
            return {
                result,
                text: meta.render ? meta.render(result) : JSON.stringify(result),
                domainId: META_DOMAIN,
            };
        }
        for (const rec of domains.values()) {
            const def = rec.actions.get(action);
            if (!def)
                continue;
            const raw = await def.execute(args, {
                origin,
                emit: (event, data) => emit("domain-event", { domainId: rec.def.id, event, data: data ?? null }),
            });
            const result = decorateSchemaResult(action, raw, origin);
            return {
                result,
                text: def.render ? def.render(result) : JSON.stringify(result),
                domainId: rec.def.id,
            };
        }
        throw new Error("没有业务插件注册 action：" + action);
    }
    /**
     * 插件自己的 `<域>.actionSchema` 结果由宿主补齐 agent 开关状态：
     * ui 看全量并带 agentEnabled（Action 页据此渲染开关），agent 只看到自己仍能调用的。
     */
    function decorateSchemaResult(action, result, origin) {
        if (!/\.actionSchema$/.test(action))
            return result;
        if (!result || typeof result !== "object" || !Array.isArray(result.actions))
            return result;
        const found = findActionDef(action);
        const rec = found && found.domainId !== META_DOMAIN ? domains.get(found.domainId) : null;
        const actions = result.actions.map((entry) => {
            const name = entry && typeof entry.name === "string" ? entry.name : "";
            const def = name && rec ? (rec.actions.get(name) ?? META_ACTIONS.get(name)) : name ? META_ACTIONS.get(name) : null;
            if (!name || !def)
                return entry;
            return {
                ...entry,
                agentEnabled: agentAccess.effective(name, def),
                agentLocked: agentAccess.locked(name, def),
            };
        });
        // 插件自己列的 schema 常常漏掉 actionSchema 自身等条目：宿主补全，UI 才能逐个配置开关。
        if (origin !== "agent" && rec) {
            const domainId = found ? found.domainId : rec.def.id;
            const listed = new Set(actions.map((entry) => entry?.name));
            for (const [name, def] of rec.actions) {
                if (!listed.has(name))
                    actions.push(actionEntry(name, domainId, def));
            }
        }
        return {
            ...result,
            actions: origin === "agent" ? actions.filter((entry) => entry.agentEnabled !== false) : actions,
        };
    }
    function installTool(ctx) {
        // ── Agent 工具：Workbench（单工具多 action，action 由已注册业务域动态提供）──
        ctx.tools?.register({
            name: "Workbench",
            timeoutMs: 60_000,
            description: "个人工作台。action 由已安装业务插件提供（tasks.* / taskNodes.* / tags.* / sites.* / siteTags.* / siteNodes.*），" +
                "宿主另提供 capabilities.list / capabilities.get 查看各插件记录什么、任务归属显式配置及首选 action；capabilities.setTaskTarget 配置 domain→tableId。" +
                "物品用 storage.create，开发工作用 tasks.create；创建任务前用 tasks.capabilities / tasks.resolveTable 明确目标，不能默认第一张表。" +
                "actions.list / actions.help 用于自举：先 actions.list 看有哪些 action，再 actions.help 看真实字段。" +
                "审计留痕可直接查 audit.list / audit.get / audit.stats（本机行为账本：谁在何时调了什么、成功与否，参数已脱敏）。" +
                "入参统一放进 args；不要再按旧版顶层字段（due_at / tags / parentId 等）猜参数。" +
                "被本机在 Action 页关闭 agent 访问的 action 不会出现在 actions.list 中，直接调用返回 ACTION_AGENT_DISABLED（界面仍可正常使用）；" +
                "安装或卸载业务插件请使用 DSH 的插件管理，不在本工具里做。",
            parameters: {
                type: "object",
                properties: {
                    action: {
                        type: "string",
                        description: "action 名，如 capabilities.list / capabilities.get / actions.list / tasks.list / tasks.create / tags.create / sites.list",
                    },
                    args: {
                        type: "object",
                        description: "该 action 的入参对象；字段名与类型以 actions.help 的返回为准",
                        additionalProperties: true,
                    },
                },
                required: ["action"],
                // 兼容旧调用：未放进 args 的顶层字段仍会被采纳（但会按 action 的真实 schema 校验并提示被忽略项）
                additionalProperties: true,
            },
            output: {
                schema: { type: "object", properties: { text: { type: "string" } } },
                render: (_a, v) => [{ type: "text", text: v.text }],
            },
            execute: async (args) => {
                const raw = String(args.action || "");
                try {
                    if (!raw)
                        return { text: "错误：缺少 action（先调用 actions.list）" };
                    // 兼容旧工具调用：无命名空间的 list/create/... 映射到 tasks.*
                    const action = raw.indexOf(".") >= 0 ? raw : "tasks." + raw;
                    const flat = { ...args };
                    delete flat.action;
                    const nested = flat.args;
                    delete flat.args;
                    const payload = {};
                    if (nested && typeof nested === "object" && !Array.isArray(nested)) {
                        Object.assign(payload, nested);
                    }
                    for (const [key, value] of Object.entries(flat)) {
                        if (Object.prototype.hasOwnProperty.call(payload, key) && JSON.stringify(payload[key]) !== JSON.stringify(value)) {
                            return { text: "错误：参数 " + key + " 同时出现在 args 和顶层且值不同，请只传一处" };
                        }
                        payload[key] = value;
                    }
                    // 旧版 Workbench schema 里有一批“看起来通用、实际没人接”的字段：若该 action 的
                    // 真实 schema 不声明它们，就明确提示已忽略，而不是静默丢参。
                    const known = new Set();
                    const found = findActionDef(action);
                    if (found)
                        for (const key of Object.keys(actionParams(found.def).props))
                            known.add(key);
                    const ignored = [];
                    for (const key of TRAP_FIELDS) {
                        if (Object.prototype.hasOwnProperty.call(payload, key) && !known.has(key)) {
                            ignored.push(key + "=" + JSON.stringify(payload[key]));
                            delete payload[key];
                        }
                    }
                    const r = await invoke(action, payload, "agent");
                    const warning = ignored.length
                        ? "⚠ " + action + " 不接受这些参数，已忽略：\n  " + ignored.join("\n  ") +
                            "\n（真实字段名以 actions.help 为准）\n\n"
                        : "";
                    return { text: warning + r.text };
                }
                catch (e) {
                    return { text: "错误：" + actionErrorText(e) };
                }
            },
        });
    }
    /**
     * 只读 schema 快照：给 /workbench/api/schema 的 Action 页调试用。
     * 与 actions.list(detail=true) 同源（同一份 actionEntry + 注册表），额外带上每个 action 的示例；
     * 只读取运行时注册，不执行任何 action、不写库、不产生审计记录。
     */
    function schemaSnapshot(domain) {
        const wanted = String(domain ?? "").trim();
        // 只读快照给 Action 页调试用：界面要看到全量 action 及每个的 agent 开关状态。
        const meta = listActionsMeta({ detail: true, ...(wanted ? { domain: wanted } : {}) }, "ui");
        const actions = meta.actions.map((entry) => {
            const found = findActionDef(entry.name);
            const examples = found && Array.isArray(found.def.examples) ? found.def.examples : [];
            return {
                ...entry,
                examples,
                agentEnabled: entry.agentEnabled ?? (found ? agentVisible(entry.name, found.def) : true),
                agentLocked: found ? agentAccess.locked(entry.name, found.def) : false,
            };
        });
        return { shellVersion: meta.shellVersion, domains: meta.domains, actions };
    }
    META_ACTIONS.set("search.query", {
        description: "跨域搜索：并行调用已注册的搜索提供者（任务/标签/站点/连接器等），统一排序返回。单域超时 500ms 或失败不影响其他域，partial=true 并给出 failed。空查询返回空结果。",
        input: {
            type: "object",
            properties: {
                q: { type: "string", description: "查询词，1–100 字" },
                domains: { type: "array", items: { type: "string" }, description: "限定业务域 id；省略搜索全部已注册 provider" },
                limit: { type: "number", description: "返回上限，默认 20，最大 50" },
            },
            required: ["q"],
        },
        examples: [{ q: "工作台", limit: 10 }],
        execute: (args) => search.query(args),
        render: (result) => {
            if (!result.items.length)
                return "没有命中" + (result.partial ? "（部分域失败：" + result.failed.join("、") + "）" : "");
            return result.items.map((x) => "[" + x.domainId + "] " + x.title + (x.snippet ? " — " + String(x.snippet).slice(0, 120) : "")).join("\n");
        },
    });
    META_ACTIONS.set("search.providers", {
        description: "列出已注册的跨域搜索提供者，供 UI 做域筛选。",
        input: { type: "object", properties: {}, additionalProperties: false },
        execute: () => ({ domains: search.list() }),
    });
    return { invoke, actionNames, installTool, schemaSnapshot };
}
