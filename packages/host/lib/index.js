/**
 * dsh-workbench：个人工作台 DSH 宿主插件。
 *
 * 只负责平台能力：本地 SQLite、账号/同步、HTTP 桥、SSE、Workbench 工具、
 * 业务域注册中心。任务/标签/站点是独立的 DSH 插件，通过 ctx.workbench
 * 注册自己的 action 与视图，宿主不 import 它们。
 *
 * 契约要点（已验证）：named export name/inject/apply；绝不 default export
 * （cordis-plugin-loader unwrapExports 优先取 exports.default，裸函数会丢具名 inject）。
 */
import { homedir } from "node:os";
import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync } from "node:fs";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { getSyncStateText, openDb, setSyncStateText } from "./core/index.js";
import { listConflicts, resolveConflict, SyncClock, SyncEngine, SyncHttpError, } from "./sync.js";
import { createBackup, importBackup, normalizeImportPolicy, } from "./backup.js";
export const name = "dsh-workbench";
export const inject = ["webServer", "tools", "connection"];
/** 本地库与云端配置路径（05 文档约定目录）。 */
const WB_HOME = process.env.WB_HOME ?? join(homedir(), ".dsh", "workbench");
const CLOUD_DEFAULT = process.env.WB_CLOUD_URL ?? "http://127.0.0.1:8791";
/** 宿主 API 版本：业务插件用它做兼容判断。 */
export const SHELL_VERSION = "0.5.1";
const DOMAIN_ID_RE = /^[a-z][a-z0-9_-]{2,63}$/;
const ACTION_RE = /^[a-z][a-z0-9_-]*(?:\.[a-z][a-z0-9_-]*)+$/i;
function loadCreds() {
    try {
        return JSON.parse(readFileSync(join(WB_HOME, "cloud-creds.json"), "utf8"));
    }
    catch {
        return null;
    }
}
function saveCreds(creds) {
    mkdirSync(WB_HOME, { recursive: true });
    if (creds) {
        writeFileSync(join(WB_HOME, "cloud-creds.json"), JSON.stringify(creds), { mode: 0o600 });
    }
    else if (existsSync(join(WB_HOME, "cloud-creds.json"))) {
        rmSync(join(WB_HOME, "cloud-creds.json"));
    }
}
/** 会话记录模式：只影响当前会话，不参与同步/备份。 */
function sessionModeOf(db, sessionId) {
    try {
        const row = db.prepare("SELECT enabled FROM session_mode WHERE session_id = ?").get(sessionId);
        return !!row && Number(row.enabled) === 1;
    }
    catch {
        return false;
    }
}
function setSessionMode(db, sessionId, enabled, now) {
    db.prepare("INSERT INTO session_mode(session_id, enabled, updated_at) VALUES(?, ?, ?) " +
        "ON CONFLICT(session_id) DO UPDATE SET enabled = excluded.enabled, updated_at = excluded.updated_at").run(sessionId, enabled ? 1 : 0, now);
}
const RECORD_COMMAND_HELP = [
    "用法：/record on|off|status",
    "",
    "/record on      开启本会话的记录模式",
    "/record off     关闭本会话的记录模式",
    "/record status  查看当前状态",
    "",
    "记录模式下，我只把完成的可交付内容记成任务、站点或标签；",
    "不记录聊天、日志、临时笔记、密钥和本地地址。",
].join("\n");
function recordPrompt(sessionId) {
    return [
        "## 个人工作台账：记录模式",
        "",
        "本会话已开启记录模式。完成本轮主要任务后，如果产生了可复用的交付物，请顺手记到个人工作台；这只是收尾动作，不能打断或改变主任务。",
        "",
        "记录流程：",
        "1. 先调用 Workbench，action 为 capabilities.list；需要某个域的字段细节时用 capabilities.get，再按需 actions.help。",
        "2. 只记录同时满足 when 且不满足 notFor 的内容；没有命中就不写，不要为了有记录而凑数。",
        "3. 用对应 records[].primaryAction 写入，不要猜 action 名。",
        "4. 写入前查重：任务先 tasks.list（titleKey），站点先 sites.list，标签先 tags.list / tags.search。已存在就复用并补关联，不重复创建。",
        "5. 只新增，不修改、不删除工作台已有数据。",
        "6. 多条记录合并成一行回执，例如“已记录：任务 #42、标签 #7”；失败只提示一次，不阻塞主任务。",
        "7. plan mode 下不要写入。",
        "",
        "记录边界：",
        "- 任务：已完成的可交付项，或明确的下一步；不记纯问答、一次性查询、模糊想法。",
        "- 站点：以后还会访问的外部站点；排除 localhost、127.0.0.1、内网地址、临时页、搜索结果页。",
        "- 标签：可复用的主题分类；不记一次性描述、状态词、日期。",
        "- 不记录聊天内容、日志、临时笔记、token/密钥/密码，以及用户明确拒绝记录的内容。",
        "- 模式只作用于当前会话，不自动传给子 agent。",
        "",
        "去重键：任务用 dsh-session:" + sessionId + ":<稳定 slug>，每个条目一个键，不要整个会话共用一个键。",
        "当前会话：" + sessionId,
    ].join("\n");
}
export function apply(ctx) {
    const state = { db: openDb(join(WB_HOME, "workbench.db")), creds: loadCreds(), cloudUrl: CLOUD_DEFAULT };
    const subscribers = new Set();
    const domains = new Map();
    const clock = new SyncClock();
    const emit = (event, data) => {
        for (const s of subscribers) {
            try {
                s(event, data);
            }
            catch {
                /* 单个订阅者断开不影响其他订阅者 */
            }
        }
    };
    const log = (...args) => console.warn("[dsh-workbench]", ...args);
    function publicInfo(rec) {
        return {
            id: rec.def.id,
            title: rec.def.title,
            description: rec.def.description,
            version: rec.def.version,
            enabled: rec.error === null,
            error: rec.error,
            tables: rec.def.tables ?? [],
            views: rec.def.views ?? [],
            sync: {
                tables: rec.def.sync?.tables?.map((t) => ({ name: t.name, mode: t.mode })) ??
                    (rec.def.tables ?? []).map((name) => ({ name, mode: "row" })),
            },
            backup: {
                export: typeof rec.def.exportData === "function",
                import: typeof rec.def.importData === "function",
            },
        };
    }
    function registerAction(rec, action, def) {
        if (!ACTION_RE.test(action)) {
            throw new Error("非法 action 名（应形如 tasks.list）：" + action);
        }
        rec.actions.set(action, def);
    }
    function registerDomain(def) {
        if (!def || !DOMAIN_ID_RE.test(String(def.id || ""))) {
            log("registerDomain 非法 id", def && def.id);
            return () => { };
        }
        if (domains.has(def.id)) {
            log("业务域已注册，忽略重复注册", def.id);
            return () => { };
        }
        const rec = { def, actions: new Map(), error: null, dispose: null };
        domains.set(def.id, rec);
        const setupApi = {
            addon: { id: def.id, version: def.version, dir: "" },
            db: state.db,
            shellVersion: SHELL_VERSION,
            hasDomain: (id) => domains.has(id),
            hasAddon: (id) => domains.has(id),
            action: (name, actionDef) => registerAction(rec, name, actionDef),
            tool: (name, actionDef) => registerAction(rec, name, actionDef),
            emit: (event, data) => emit("domain-event", { domainId: def.id, event, data: data ?? null }),
            now: () => clock.now(),
            markSyncDirty: (table) => {
                if (table)
                    setSyncStateText(state.db, "dirty:" + def.id + ":" + table, String(clock.now()));
            },
            log: (...args) => log("[" + def.id + "]", ...args),
        };
        try {
            const result = def.setup?.(setupApi);
            if (result && typeof result.then === "function") {
                void result
                    .then((dispose) => {
                    if (typeof dispose === "function")
                        rec.dispose = dispose;
                    emit("domains-changed", listDomains());
                })
                    .catch((e) => {
                    rec.error = String((e && e.message) || e);
                    log("业务域异步初始化失败", def.id, e);
                    emit("domains-changed", listDomains());
                });
            }
            else if (typeof result === "function") {
                rec.dispose = result;
            }
        }
        catch (e) {
            rec.error = String((e && e.message) || e);
            log("业务域初始化失败", def.id, e);
        }
        emit("domains-changed", listDomains());
        return () => {
            const live = domains.get(def.id);
            if (live !== rec)
                return;
            try {
                rec.dispose?.();
            }
            catch (e) {
                log("业务域清理失败", def.id, e);
            }
            domains.delete(def.id);
            emit("domains-changed", listDomains());
        };
    }
    function listDomains() {
        return [...domains.values()].map(publicInfo);
    }
    function backupDomains() {
        return [...domains.values()].map((rec) => ({ def: rec.def, enabled: rec.error === null, error: rec.error }));
    }
    /** 宿主内置的元 action 归属域（不参与备份，也不是业务插件）。 */
    const META_DOMAIN = "wb-shell";
    /** 旧版 Workbench 顶层 schema 里的“通用字段”，多数 action 并不接受。 */
    const TRAP_FIELDS = ["due_at", "note", "tags", "tagIds", "dirIds", "parentId", "deadline", "start_at", "assignee", "limit"];
    function findDomain(raw) {
        const key = String(raw ?? "").trim();
        if (!key)
            return null;
        for (const rec of domains.values()) {
            if (rec.def.id === key ||
                rec.def.id === "wb-addon-" + key ||
                rec.def.id.replace(/^wb-addon-/, "") === key) {
                return rec;
            }
        }
        return null;
    }
    /** 取业务域的能力清单；未声明时回退到域描述，保留 action 列表供 agent 自行判断。 */
    function capabilityOf(rec) {
        const declared = rec.def.capability;
        if (!declared) {
            return {
                summary: rec.def.description ?? rec.def.title,
                records: [],
                notFor: [],
                notes: [],
                source: "fallback",
                warnings: [],
            };
        }
        const warnings = [];
        const seen = new Set();
        const records = [];
        for (const raw of Array.isArray(declared.records) ? declared.records : []) {
            if (!raw || typeof raw !== "object")
                continue;
            const kind = String(raw.kind ?? "").trim();
            if (!kind) {
                warnings.push("存在缺少 kind 的记录声明，已忽略");
                continue;
            }
            if (seen.has(kind)) {
                warnings.push("记录类型重复：" + kind + "（只保留第一条）");
                continue;
            }
            seen.add(kind);
            const primaryAction = String(raw.primaryAction ?? "").trim();
            if (!primaryAction) {
                warnings.push(kind + "：缺少 primaryAction");
            }
            else if (!rec.actions.has(primaryAction)) {
                warnings.push(kind + "：primaryAction 未注册：" + primaryAction);
            }
            records.push({
                kind,
                title: String(raw.title ?? kind),
                description: String(raw.description ?? ""),
                when: Array.isArray(raw.when)
                    ? raw.when.filter((x) => typeof x === "string" && x.trim())
                    : [],
                notFor: Array.isArray(raw.notFor) ? raw.notFor : [],
                primaryAction,
                keyArgs: Array.isArray(raw.keyArgs) ? raw.keyArgs : [],
                dedupe: String(raw.dedupe ?? ""),
                relations: Array.isArray(raw.relations) ? raw.relations : [],
                examples: Array.isArray(raw.examples) ? raw.examples : [],
            });
        }
        return {
            summary: String(declared.summary ?? "").trim() || rec.def.description || rec.def.title,
            records,
            notFor: Array.isArray(declared.notFor) ? declared.notFor : [],
            notes: Array.isArray(declared.notes) ? declared.notes : [],
            source: "declared",
            warnings,
        };
    }
    /** capabilities.list：聚合各插件“记录什么、首选哪个 action”，给 agent 做统一发现。 */
    function capabilityListMeta(args) {
        const kind = args.kind === undefined || args.kind === null ? "" : String(args.kind).trim();
        const out = [];
        for (const rec of domains.values()) {
            const cap = capabilityOf(rec);
            if (kind && !cap.records.some((r) => r.kind === kind))
                continue;
            out.push({
                id: rec.def.id,
                title: rec.def.title,
                version: rec.def.version,
                enabled: rec.error === null,
                error: rec.error,
                summary: cap.summary,
                source: cap.source,
                actionCount: rec.actions.size,
                records: cap.records.map((r) => ({
                    kind: r.kind,
                    title: r.title,
                    description: r.description,
                    primaryAction: r.primaryAction,
                })),
                warnings: cap.warnings,
            });
        }
        return { shellVersion: SHELL_VERSION, kind, domains: out };
    }
    function renderCapabilityList(meta) {
        const lines = [
            "工作台 " + meta.shellVersion + " · " + meta.domains.length + " 个域" + (meta.kind ? "（kind=" + meta.kind + "）" : ""),
        ];
        for (const d of meta.domains) {
            lines.push("", "[" + d.id + "] " + d.title + " v" + d.version + (d.enabled ? "" : "（未启用：" + d.error + "）"));
            lines.push("  " + d.summary);
            if (!d.records.length) {
                lines.push("  （未声明能力清单；可用 action 见 actions.list）");
            }
            else {
                for (const r of d.records) {
                    lines.push("  " + r.kind + " → " + r.primaryAction + "：" + r.description);
                }
            }
            for (const w of d.warnings ?? [])
                lines.push("  ⚠ " + w);
        }
        lines.push("", '查看单个域的完整能力与 action 列表：Workbench({ action: "capabilities.get", args: { domain: "tasks" } })');
        return lines.join("\n");
    }
    /** capabilities.get：单个业务域的完整能力清单 + action 摘要（字段细节仍走 actions.help）。 */
    function capabilityGetMeta(args) {
        const name = String(args.domain ?? args.id ?? "").trim();
        if (!name)
            throw new Error("缺少 domain；先用 capabilities.list 查看可用业务域");
        const rec = findDomain(name);
        if (!rec)
            throw new Error("没有该业务域：" + name + "；先用 capabilities.list 查看");
        const cap = capabilityOf(rec);
        return {
            shellVersion: SHELL_VERSION,
            domain: {
                id: rec.def.id,
                title: rec.def.title,
                description: rec.def.description ?? "",
                version: rec.def.version,
                enabled: rec.error === null,
                error: rec.error,
            },
            capability: {
                summary: cap.summary,
                records: cap.records,
                notFor: cap.notFor,
                notes: cap.notes,
            },
            source: cap.source,
            actions: [...rec.actions].map(([action, def]) => actionEntry(action, rec.def.id, def)),
            warnings: cap.warnings,
        };
    }
    function renderCapability(meta) {
        const d = meta.domain;
        const cap = meta.capability;
        const lines = [
            "[" + d.id + "] " + d.title + " v" + d.version + (d.enabled ? "" : "（未启用：" + d.error + "）"),
            cap.summary,
        ];
        if (meta.source === "fallback") {
            lines.push("", "该域未声明能力清单；以下 action 仍可直接调用。");
        }
        if (!cap.records.length) {
            lines.push("", "记录类型：未声明");
        }
        else {
            lines.push("", "记录类型：");
            for (const r of cap.records) {
                lines.push("- " + r.kind + " · " + r.title + " → " + r.primaryAction);
                if (r.description)
                    lines.push("  " + r.description);
                if (r.when.length) {
                    lines.push("  何时记录：");
                    for (const w of r.when)
                        lines.push("    - " + w);
                }
                if (r.notFor.length) {
                    lines.push("  不要记录：");
                    for (const w of r.notFor)
                        lines.push("    - " + w);
                }
                if (r.keyArgs.length)
                    lines.push("  常用参数：" + r.keyArgs.join(", "));
                if (r.dedupe)
                    lines.push("  去重：" + r.dedupe);
                if (r.relations.length) {
                    lines.push("  关系：");
                    for (const rel of r.relations) {
                        lines.push("    - " + rel.kind + " via " + rel.via + "：" + rel.description);
                    }
                }
                if (r.examples.length) {
                    lines.push("  示例：");
                    for (const ex of r.examples) {
                        const example = JSON.stringify({ action: r.primaryAction, args: ex.args ?? ex });
                        lines.push("    Workbench(" + example + ")" + (ex.purpose ? " // " + ex.purpose : ""));
                    }
                }
            }
        }
        if (cap.notFor.length) {
            lines.push("", "这个域不适合：");
            for (const w of cap.notFor)
                lines.push("  - " + w);
        }
        if (cap.notes.length) {
            lines.push("", "约束：");
            for (const w of cap.notes)
                lines.push("  - " + w);
        }
        lines.push("", "可用 action（" + meta.actions.length + "）：");
        for (const a of meta.actions)
            lines.push("  " + a.name + (a.description ? " — " + a.description : ""));
        lines.push("", '字段细节：Workbench({ action: "actions.help", args: { action: "<name>" } })');
        if (meta.warnings.length) {
            lines.push("", "⚠ 校验提示：");
            for (const w of meta.warnings)
                lines.push("  - " + w);
        }
        return lines.join("\n");
    }
    function findActionDef(name) {
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
        out.push({ name: "capabilities.list", domainId: META_DOMAIN, description: "列出各业务插件记录什么、首选哪个 action" });
        out.push({ name: "capabilities.get", domainId: META_DOMAIN, description: "查看单个业务插件的完整能力清单与 action 列表" });
        out.push({ name: "actions.list", domainId: META_DOMAIN, description: "列出已安装业务域的 action、参数与必填项" });
        out.push({ name: "actions.help", domainId: META_DOMAIN, description: "查看单个 action 的完整 JSON Schema、参数说明与示例" });
        return out;
    }
    async function invoke(action, args, origin) {
        if (action === "capabilities.list") {
            const result = capabilityListMeta(args);
            return { result, text: renderCapabilityList(result), domainId: META_DOMAIN };
        }
        if (action === "capabilities.get") {
            const result = capabilityGetMeta(args);
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
    const host = {
        db: state.db,
        shellVersion: SHELL_VERSION,
        registerDomain,
        hasDomain: (id) => domains.has(id),
        listDomains,
        invoke,
        actionNames,
        emit,
        log,
    };
    ctx.provide?.("workbench", host);
    // ── 会话记录模式：命令开关 + 动态 prompt section + 客户端 HTTP 状态 ──
    const trackOn = (scope, dispose) => {
        if (typeof dispose === "function" && typeof scope.effect === "function")
            scope.effect(() => dispose);
    };
    const installService = (deps, fn) => {
        if (typeof ctx.inject === "function") {
            try {
                ctx.inject(deps, fn);
                return;
            }
            catch (e) {
                log("注入服务失败", deps.join(","), e);
            }
        }
        try {
            fn(ctx);
        }
        catch (e) {
            log("安装会话记录模式失败", deps.join(","), e);
        }
    };
    installService(["systemPrompt"], (scope) => {
        const sp = scope.systemPrompt;
        if (!sp || typeof sp.section !== "function")
            return;
        let order = 510;
        try {
            order = sp.getSectionOrder("PLAN_POLICY") + 10;
        }
        catch {
            /* 老版本没有命名 order 时退回 510 */
        }
        const dispose = sp.section({
            name: "workbench:record-mode",
            order,
            text: (context) => {
                const sid = String(context?.agent?.session?.id ?? context?.agent?.id ?? "");
                return sid && sessionModeOf(state.db, sid) ? recordPrompt(sid) : "";
            },
        });
        trackOn(scope, dispose);
    });
    installService(["commands"], (scope) => {
        const commands = scope.commands;
        if (!commands || typeof commands.register !== "function")
            return;
        const dispose = commands.register({
            name: "record",
            description: "开启或关闭本会话的个人工作台记录模式",
            input: { hint: "[on|off|status]" },
            handler: ({ agent, rawInput }) => {
                const sid = String(agent?.session?.id ?? agent?.id ?? "");
                if (!sid)
                    return { kind: "error", text: "无法确定当前会话，记录模式没有变化。" };
                const arg = String(rawInput ?? "").trim().toLowerCase();
                if (arg === "on" || arg === "off") {
                    const enabled = arg === "on";
                    setSessionMode(state.db, sid, enabled, clock.now());
                    emit("record-mode", { sessionId: sid, enabled });
                    return {
                        kind: "success",
                        text: enabled
                            ? "记录模式已开启（仅本会话）。后续我只把完成的可交付内容记到工作台，不记聊天、日志、密钥和本地地址。"
                            : "记录模式已关闭。之后只有你明确说“记一下”时，我才会写入工作台。",
                    };
                }
                if (arg === "status") {
                    const enabled = sessionModeOf(state.db, sid);
                    return {
                        kind: "success",
                        text: enabled
                            ? "记录模式：已开启（仅本会话）。\n只记录完成的可交付项；不记聊天、日志、临时笔记、密钥和本地地址。关闭用 /record off。"
                            : "记录模式：未开启。\n开启用 /record on；开启后我只记录完成的可交付内容。",
                    };
                }
                return { kind: "success", text: RECORD_COMMAND_HELP };
            },
        });
        trackOn(scope, dispose);
    });
    /** 云端 fetch 封装（带 access token；401 时尝试 refresh 一次）。 */
    async function cloudFetch(path, init, retry = true) {
        const headers = {
            "content-type": "application/json",
            ...init?.headers,
        };
        if (state.creds)
            headers.authorization = "Bearer " + state.creds.accessToken;
        const res = await fetch(state.cloudUrl + path, {
            ...init,
            headers,
            body: init?.json ? JSON.stringify(init.json) : init?.body,
        });
        if (res.status === 401 && retry && state.creds?.refreshToken) {
            const r = await fetch(state.cloudUrl + "/v1/auth/refresh", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ refresh_token: state.creds.refreshToken }),
            }).then((x) => x.json());
            if (r.ok) {
                state.creds = {
                    accessToken: r.accessToken,
                    refreshToken: r.refreshToken,
                    userId: r.userId,
                    deviceId: r.deviceId,
                };
                saveCreds(state.creds);
                return cloudFetch(path, init, false);
            }
            state.creds = null;
            saveCreds(null);
        }
        return res.json();
    }
    /** 把 /v1/sync/* 的错误响应转成可判别的 SyncHttpError。 */
    async function syncCall(path, json) {
        const r = await cloudFetch(path, { method: "POST", json });
        if (r && r.ok === false) {
            const code = String(r.code ?? "sync_error");
            const status = code === "version_conflict" || code === "sync_locked" || code.startsWith("session_") ? 409 : Number(r.status) || 400;
            throw new SyncHttpError(status, code, String(r.error ?? code), r);
        }
        return r;
    }
    const syncTransport = {
        open: (protocol, deviceId) => syncCall("/v1/sync/open", { protocol, device_id: deviceId }),
        push: (body) => syncCall("/v1/sync/push", body),
        pull: (body) => syncCall("/v1/sync/pull", body),
        snapshot: (body) => syncCall("/v1/sync/snapshot", body),
        full: (body) => syncCall("/v1/sync/full", body),
        close: (body) => syncCall("/v1/sync/close", body),
    };
    function syncDomains() {
        return [...domains.values()].map((rec) => ({
            id: rec.def.id,
            tables: rec.def.tables,
            sync: rec.def.sync,
        }));
    }
    function ensureSyncIdentity() {
        if (!state.creds)
            throw new Error("not logged in");
        const bound = getSyncStateText(state.db, "account_user_id");
        if (!bound)
            setSyncStateText(state.db, "account_user_id", state.creds.userId);
        let epoch = getSyncStateText(state.db, "sync_epoch");
        if (!epoch) {
            epoch = randomUUID();
            setSyncStateText(state.db, "sync_epoch", epoch);
        }
        return { userId: state.creds.userId, deviceId: state.creds.deviceId, epoch };
    }
    let syncBusy = false;
    async function runSync() {
        if (syncBusy)
            return { ok: false, error: "sync already running", skipped: true };
        syncBusy = true;
        try {
            const identity = ensureSyncIdentity();
            const engine = new SyncEngine({
                db: state.db,
                domains: syncDomains(),
                transport: syncTransport,
                clock,
                userId: identity.userId,
                deviceId: identity.deviceId,
                epoch: identity.epoch,
                onEvent: emit,
            });
            const report = await engine.run();
            return report;
        }
        finally {
            syncBusy = false;
        }
    }
    // ── HTTP：/workbench/api/*（同域 cookie 之外的连接门由 host connection.requestRejection 兜底）──
    ctx.effect?.(() => ctx.webServer?.register({
        kind: "prefix",
        path: "/workbench/api",
        handler: async (req, res) => {
            const rejection = ctx.connection?.requestRejection?.(req);
            if (rejection !== undefined) {
                res.statusCode = rejection;
                res.end(JSON.stringify({ ok: false, error: "connection rejected" }));
                return;
            }
            const url = new URL(req.url ?? "", "http://local");
            const p = url.pathname.replace(/^\/workbench\/api/, "");
            const m = req.method ?? "GET";
            const bodyOf = async () => {
                const chunks = [];
                for await (const c of req)
                    chunks.push(c);
                try {
                    return JSON.parse(Buffer.concat(chunks).toString() || "{}");
                }
                catch {
                    return {};
                }
            };
            const rawBodyOf = async (maxBytes = 64 * 1024 * 1024) => {
                const chunks = [];
                let total = 0;
                for await (const c of req) {
                    const buf = c;
                    total += buf.length;
                    if (total > maxBytes)
                        throw new Error("请求体超过上限（" + Math.round(maxBytes / 1024 / 1024) + "MB）");
                    chunks.push(buf);
                }
                return Buffer.concat(chunks);
            };
            const send = (code, obj) => {
                res.writeHead(code, { "content-type": "application/json" });
                res.end(JSON.stringify(obj));
            };
            try {
                if (p === "/events" && m === "GET") {
                    res.writeHead(200, {
                        "content-type": "text/event-stream",
                        "cache-control": "no-cache",
                        connection: "keep-alive",
                    });
                    const sub = (event, data) => res.write("event: " + event + "\ndata: " + JSON.stringify(data) + "\n\n");
                    subscribers.add(sub);
                    req.on?.("close", () => subscribers.delete(sub));
                    return;
                }
                if (p === "/domains" && m === "GET") {
                    return send(200, { ok: true, domains: listDomains(), shellVersion: SHELL_VERSION });
                }
                if (p === "/record" && m === "GET") {
                    const sid = String(url.searchParams.get("sessionId") ?? "").trim();
                    if (!sid)
                        return send(400, { ok: false, error: "缺少 sessionId" });
                    return send(200, { ok: true, sessionId: sid, enabled: sessionModeOf(state.db, sid) });
                }
                if (p === "/record" && m === "POST") {
                    const body = await bodyOf();
                    const sid = String(body?.sessionId ?? "").trim();
                    if (!sid || sid.length > 200)
                        return send(400, { ok: false, error: "sessionId 不合法" });
                    if (typeof body?.enabled !== "boolean")
                        return send(400, { ok: false, error: "enabled 必须是布尔值" });
                    const enabled = body.enabled === true;
                    setSessionMode(state.db, sid, enabled, clock.now());
                    emit("record-mode", { sessionId: sid, enabled });
                    return send(200, { ok: true, sessionId: sid, enabled });
                }
                if (p === "/backup/export" && m === "GET") {
                    try {
                        const raw = url.searchParams.get("modules");
                        const ids = raw && raw !== "all" ? raw.split(",").map((x) => x.trim()).filter(Boolean) : null;
                        const backup = await createBackup({ domains: backupDomains(), shellVersion: SHELL_VERSION, moduleIds: ids });
                        res.writeHead(200, {
                            "content-type": "application/zip",
                            "content-disposition": "attachment; filename=\"" + backup.filename + "\"",
                            "content-length": backup.buffer.length,
                            "cache-control": "no-store",
                        });
                        res.end(backup.buffer);
                        return;
                    }
                    catch (e) {
                        return send(500, { ok: false, error: String((e && e.message) || e) });
                    }
                }
                if (p === "/backup/import" && m === "POST") {
                    try {
                        const buf = await rawBodyOf();
                        const policies = {};
                        const rawPolicy = req.headers?.["x-wb-backup-policy"];
                        if (typeof rawPolicy === "string" && rawPolicy) {
                            try {
                                const parsed = JSON.parse(rawPolicy);
                                if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
                                    for (const key of Object.keys(parsed))
                                        policies[key] = normalizeImportPolicy(parsed[key]);
                                }
                            }
                            catch {
                                // 策略头损坏时按默认 newest 处理，不阻断备份导入
                            }
                        }
                        const result = await importBackup({ buffer: buf, domains: backupDomains(), policies });
                        emit("backup-imported", { summary: result.summary, exportedAt: result.exportedAt });
                        return send(200, result);
                    }
                    catch (e) {
                        const err = e;
                        const code = err && err.code ? err.code : "invalid";
                        return send(code === "incompatible" ? 422 : 400, {
                            ok: false,
                            code,
                            error: String((e && e.message) || e),
                        });
                    }
                }
                const actionM = /^\/domains\/([^/]+)\/actions\/([^/]+)$/.exec(p);
                if (actionM && m === "POST") {
                    const id = decodeURIComponent(actionM[1]);
                    const action = decodeURIComponent(actionM[2]);
                    const owner = actionNames().find((a) => a.name === action);
                    if (!owner || owner.domainId !== id) {
                        return send(404, { ok: false, error: "业务插件未注册该 action：" + action });
                    }
                    const body = await bodyOf();
                    const r = await invoke(action, body, "ui");
                    return send(200, { ok: true, result: r.result, text: r.text });
                }
                if (p === "/sync/now" && m === "POST") {
                    if (!state.creds)
                        return send(400, { ok: false, error: "not logged in" });
                    const r = await runSync();
                    return send(200, { ok: true, ...r });
                }
                if (p === "/sync/status" && m === "GET") {
                    const identity = state.creds ? ensureSyncIdentity() : null;
                    const engine = new SyncEngine({
                        db: state.db,
                        domains: syncDomains(),
                        transport: syncTransport,
                        clock,
                        userId: identity?.userId ?? "",
                        deviceId: identity?.deviceId ?? "",
                        epoch: identity?.epoch ?? "",
                        onEvent: emit,
                    });
                    return send(200, {
                        ok: true,
                        logged_in: Boolean(state.creds),
                        ...engine.status(),
                    });
                }
                if (p === "/sync/conflicts" && m === "GET") {
                    const limit = Number(url.searchParams.get("limit") ?? "100");
                    return send(200, { ok: true, conflicts: listConflicts(state.db, limit) });
                }
                const conflictM = /^\/sync\/conflicts\/(\d+)\/resolve$/.exec(p);
                if (conflictM && m === "POST") {
                    const body = await bodyOf();
                    const action = String(body.action ?? "");
                    if (action !== "keep_local" && action !== "keep_server" && action !== "dismiss") {
                        return send(400, { ok: false, error: "action 必须是 keep_local/keep_server/dismiss" });
                    }
                    const ok = resolveConflict(state.db, Number(conflictM[1]), action, clock.now());
                    return send(ok ? 200 : 404, { ok });
                }
                if (p === "/account" && m === "GET") {
                    if (!state.creds)
                        return send(200, { ok: true, logged_in: false });
                    const me = await cloudFetch("/v1/me");
                    return send(200, { ok: true, logged_in: true, user: me.user, devices: me.devices });
                }
                if (p === "/account/login" && m === "POST") {
                    const b = await bodyOf();
                    const deviceId = state.creds?.deviceId ?? "shell-" + Math.random().toString(36).slice(2, 10);
                    const r = await cloudFetch(b.signup ? "/v1/auth/signup" : "/v1/auth/login", {
                        method: "POST",
                        json: { email: b.email, password: b.password, device_id: deviceId, device_name: "DSH Web" },
                    });
                    if (r.ok) {
                        state.creds = {
                            accessToken: r.accessToken,
                            refreshToken: r.refreshToken,
                            userId: r.userId,
                            deviceId: r.deviceId,
                        };
                        saveCreds(state.creds);
                        emit("account-changed", { logged_in: true });
                        void runSync().catch((e) => log("登录后首轮同步失败", e));
                    }
                    return send(r.ok ? 200 : 401, r);
                }
                if (p === "/account/logout" && m === "POST") {
                    state.creds = null;
                    saveCreds(null);
                    emit("account-changed", { logged_in: false });
                    return send(200, { ok: true });
                }
                return send(404, { ok: false, error: "no route " + m + " " + p });
            }
            catch (e) {
                return send(500, { ok: false, error: String((e && e.message) || e) });
            }
        },
    }, "workbench-http"), "workbench-http");
    // ── Agent 工具：Workbench（单工具多 action，action 由已注册业务域动态提供）──
    ctx.tools?.register({
        name: "Workbench",
        timeoutMs: 60_000,
        description: "个人工作台。action 由已安装业务插件提供（tasks.* / taskNodes.* / tags.* / sites.* / siteTags.* / siteNodes.*），" +
            "宿主另提供 capabilities.list / capabilities.get 查看各插件记录什么、首选哪个 action；" +
            "actions.list / actions.help 用于自举：先 actions.list 看有哪些 action，再 actions.help 看真实字段。" +
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
                return { text: "错误：" + String((e && e.message) || e) };
            }
        },
    });
    // ── 后台同步循环：30s 周期；登录后立即一轮；离线静默 ──
    let timer;
    const startLoop = () => {
        if (timer)
            clearInterval(timer);
        timer = setInterval(() => {
            if (!state.creds)
                return;
            void runSync().catch((e) => log("后台同步失败", String((e && e.message) || e)));
        }, 30_000);
    };
    startLoop();
    ctx.effect?.(() => () => {
        if (timer)
            clearInterval(timer);
        for (const rec of domains.values()) {
            try {
                rec.dispose?.();
            }
            catch {
                /* ignore */
            }
        }
        domains.clear();
    }, "wb-sync-loop");
}
