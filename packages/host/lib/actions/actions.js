import { actionErrorText, schemaChoices } from "./action-output.js";
import { createTaskTargets } from "./task-targets.js";
import { createCapabilities } from "./capabilities.js";
export function createActions({ domains, SHELL_VERSION, publicInfo, audit, clock, emit, db }) {
    /** 宿主内置的元 action 归属域（不参与备份，也不是业务插件）。 */
    const META_DOMAIN = "wb-shell";
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
    function renderAuditList(meta) {
        const lines = [
            "审计日志 " + meta.total + " 条（返回 " + meta.returned + " 条 · 第 " + meta.page + " 页 · 每页 " + meta.pageSize + "）",
        ];
        if (!meta.records.length)
            lines.push("（没有符合条件的记录）");
        for (const r of meta.records) {
            lines.push("");
            lines.push("#" + r.id + " " + r.time + " · " + r.actor + " · " + r.action + (r.ok ? "" : " ✗ 失败") +
                (r.durationMs ? " · " + r.durationMs + "ms" : ""));
            if (r.target)
                lines.push("  目标：" + r.target);
            if (r.error)
                lines.push("  错误：" + String(r.error).slice(0, 500));
            if (r.args)
                lines.push("  参数：" + String(r.args).slice(0, 300));
        }
        return lines.join("\n");
    }
    function renderAuditRecord(r) {
        const lines = [
            "#" + r.id + " " + r.time,
            "入口：" + r.actor + " · 域：" + (r.domain || "（未知）") + " · " + (r.ok ? "成功" : "失败") + " · " + r.durationMs + "ms",
            "action：" + r.action,
        ];
        if (r.target)
            lines.push("目标：" + r.target);
        if (r.error)
            lines.push("错误：" + r.error);
        lines.push("", "参数：", r.args ? prettyJson(r.args) : "（无）", "", "结果：", r.result ? prettyJson(r.result) : "（无）");
        return lines.join("\n");
    }
    function prettyJson(text) {
        try {
            return JSON.stringify(JSON.parse(text), null, 2);
        }
        catch {
            return String(text);
        }
    }
    function renderAuditStats(s) {
        const lines = ["最近 " + s.rangeDays + " 天：共 " + s.total + " 条，失败 " + s.failed + " 条"];
        if (s.byAction.length) {
            lines.push("", "按 action：");
            for (const a of s.byAction)
                lines.push("  " + a.action + " × " + a.count + (a.failed ? "（失败 " + a.failed + "）" : ""));
        }
        if (s.byActor.length) {
            lines.push("", "按入口：");
            for (const a of s.byActor)
                lines.push("  " + a.actor + " × " + a.count);
        }
        if (s.byDay.length) {
            lines.push("", "按天：");
            for (const d of s.byDay)
                lines.push("  " + d.day + " × " + d.count + (d.failed ? "（失败 " + d.failed + "）" : ""));
        }
        return lines.join("\n");
    }
    /** 旧版 Workbench 顶层 schema 里的“通用字段”，多数 action 并不接受。 */
    const TRAP_FIELDS = ["due_at", "note", "tags", "tagIds", "dirIds", "parentId", "deadline", "start_at", "assignee", "limit"];
    const taskTargets = createTaskTargets(db, domains, invoke);
    META_ACTIONS.set("capabilities.setTaskTarget", taskTargets.setAction);
    const { capabilityListMeta, renderCapabilityList, capabilityGetMeta, renderCapability } = createCapabilities({ domains, SHELL_VERSION, actionEntry, taskTargets });
    function findActionDef(name) {
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
        };
    }
    /** actions.list：把已注册 action 的“真实入参”暴露给 agent，避免按顶层通用 schema 猜字段。 */
    function listActionsMeta(args) {
        const raw = args.domain === undefined || args.domain === null ? "" : String(args.domain).trim();
        const matchDomain = (domainId) => !raw || domainId === raw || domainId === "wb-addon-" + raw;
        const matchAction = (name, domainId) => !raw || matchDomain(domainId) || name === raw || name.split(".")[0] === raw;
        const all = [];
        for (const rec of domains.values()) {
            for (const [name, def] of rec.actions) {
                if (matchAction(name, rec.def.id))
                    all.push(actionEntry(name, rec.def.id, def));
            }
        }
        for (const [name, def] of META_ACTIONS) {
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
                actionCount: rec.actions.size,
            };
        });
        if (ids.has(META_DOMAIN)) {
            domainsOut.push({
                id: META_DOMAIN,
                title: "宿主元 action（能力发现与审计）",
                version: SHELL_VERSION,
                enabled: true,
                error: null,
                actionCount: 4 + META_ACTIONS.size,
            });
        }
        const detail = args.detail === true;
        return {
            shellVersion: SHELL_VERSION,
            domains: domainsOut,
            actions: detail
                ? all
                : all.map((a) => ({ name: a.name, domain: a.domain, description: a.description, required: a.required, params: a.params })),
        };
    }
    function renderActionList(meta) {
        const lines = ["工作台 " + meta.shellVersion + " · " + meta.domains.length + " 个域 · " + meta.actions.length + " 个 action"];
        for (const d of meta.domains) {
            lines.push("", "[" + d.id + "] " + d.title + " v" + d.version + (d.enabled ? "" : "（未启用：" + d.error + "）"));
            for (const a of meta.actions) {
                if (a.domain !== d.id)
                    continue;
                lines.push("  " + a.name + (a.description ? " — " + a.description : ""));
                const params = a.params ?? [];
                lines.push("    参数：" +
                    (params.length
                        ? params.map((p) => (a.required.indexOf(p) >= 0 ? p : p + "?")).join(", ")
                        : "无（直接调用即可）"));
            }
        }
        lines.push("", '查看完整 JSON Schema 与示例：Workbench({ action: "actions.help", args: { action: "<name>" } })');
        return lines.join("\n");
    }
    /** actions.help：单个 action 的完整 schema + 参数说明 + 示例。 */
    function helpActionMeta(args) {
        const name = String(args.action ?? args.name ?? "").trim();
        if (!name)
            throw new Error("缺少 action；先用 actions.list 查看可用 action");
        const found = findActionDef(name);
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
    function renderActionHelp(help) {
        const lines = [help.name + " · " + help.domain, help.description || "（无描述）", "", "参数："];
        if (!help.params.length)
            lines.push("  无");
        for (const p of help.params) {
            lines.push("  " + p.name + (p.required ? "*" : "") + " (" + p.type + ")" + (p.description ? " — " + p.description : "") +
                (Array.isArray(p.enum) ? "；可选值：" + p.enum.join(" / ") : ""));
        }
        lines.push(...schemaChoices(help.input));
        lines.push("", "JSON Schema：", JSON.stringify(help.input, null, 2));
        if (help.examples.length) {
            lines.push("", "示例：");
            for (const ex of help.examples) {
                lines.push("  Workbench(" + JSON.stringify({ action: help.name, args: ex }) + ")");
            }
        }
        return lines.join("\n");
    }
    function actionNames() {
        const out = [];
        for (const rec of domains.values()) {
            for (const [action, def] of rec.actions) {
                out.push({ name: action, domainId: rec.def.id, description: def.description });
            }
        }
        for (const [name, def] of META_ACTIONS) {
            out.push({ name, domainId: META_DOMAIN, description: def.description });
        }
        out.push({ name: "capabilities.list", domainId: META_DOMAIN, description: "列出各业务插件记录什么、首选哪个 action" });
        out.push({ name: "capabilities.get", domainId: META_DOMAIN, description: "查看单个业务插件的完整能力清单与 action 列表" });
        out.push({ name: "actions.list", domainId: META_DOMAIN, description: "列出已安装业务域的 action、参数与必填项" });
        out.push({ name: "actions.help", domainId: META_DOMAIN, description: "查看单个 action 的完整 JSON Schema、参数说明与示例" });
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
            if (audited) {
                const target = findActionDef(action);
                audit.record({
                    action,
                    domain: target ? target.domainId : "",
                    actor: origin,
                    ok: false,
                    error: String((e && e.message) || e),
                    args,
                    durationMs: clock.now() - started,
                });
            }
            throw e;
        }
    }
    async function invokeAction(action, args, origin) {
        if (action === "capabilities.list") {
            const result = await capabilityListMeta(args);
            return { result, text: renderCapabilityList(result), domainId: META_DOMAIN };
        }
        if (action === "capabilities.get") {
            const result = await capabilityGetMeta(args);
            return { result, text: renderCapability(result), domainId: META_DOMAIN };
        }
        if (action === "actions.list") {
            const result = listActionsMeta(args);
            return { result, text: renderActionList(result), domainId: META_DOMAIN };
        }
        if (action === "actions.help") {
            const result = helpActionMeta(args);
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
            const result = await def.execute(args, {
                origin,
                emit: (event, data) => emit("domain-event", { domainId: rec.def.id, event, data: data ?? null }),
            });
            return {
                result,
                text: def.render ? def.render(result) : JSON.stringify(result),
                domainId: rec.def.id,
            };
        }
        throw new Error("没有业务插件注册 action：" + action);
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
        const meta = listActionsMeta({ detail: true, ...(wanted ? { domain: wanted } : {}) });
        const actions = meta.actions.map((entry) => {
            const found = findActionDef(entry.name);
            const examples = found && Array.isArray(found.def.examples) ? found.def.examples : [];
            return { ...entry, examples };
        });
        return { shellVersion: meta.shellVersion, domains: meta.domains, actions };
    }
    return { invoke, actionNames, installTool, schemaSnapshot };
}
