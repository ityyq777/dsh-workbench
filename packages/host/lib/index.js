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
import { openDb, setSyncStateText } from "./core/index.js";
import { SyncClock, } from "./sync/sync.js";
import { AuditLog } from "./infra/audit.js";
import { createActions } from "./actions/actions.js";
import { installNetwork } from "./infra/network.js";
export const name = "dsh-workbench";
export const inject = ["webServer", "tools", "connection"];
/** 本地库与云端配置路径（05 文档约定目录）。 */
const WB_HOME = process.env.WB_HOME ?? join(homedir(), ".dsh", "workbench");
const CLOUD_DEFAULT = process.env.WB_CLOUD_URL ?? "http://127.0.0.1:8791";
/** 宿主 API 版本：业务插件用它做兼容判断。 */
export const SHELL_VERSION = "0.6.5";
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
        "3. 用对应 records[].primaryAction 写入，不要猜 action 名。任务创建前先 tasks.capabilities / tasks.resolveTable，明确选择 tableId 或 tablePath；capabilities.get 中的有效显式映射优先，不按第一项自动选。",
        "4. 写入前查重：任务先 tasks.list（titleKey），站点先 sites.list，标签先 tags.list / tags.search。已存在就复用并补关联，不重复创建。",
        "5. 只新增，不修改、不删除工作台已有数据。",
        "6. 任务回执必须保留完整目录路径、表名和任务 id，并提示可纠正归属；多条可简洁合并，但不能省略归属。失败只提示一次，不得当成成功，不阻塞主任务。",
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
    // 审计日志：本机行为账本；表初始化与过期清理失败都不应影响宿主启动。
    const audit = new AuditLog(state.db, () => clock.now());
    try {
        audit.ensureSchema();
        audit.prune();
    }
    catch (e) {
        log("审计日志初始化失败", e);
    }
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
    const { invoke, actionNames, installTool, schemaSnapshot } = createActions({ domains, SHELL_VERSION, publicInfo, audit, clock, emit, db: state.db });
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
    const { runSync } = installNetwork({ ctx, state, saveCreds, clock, domains, emit, subscribers, listDomains, SHELL_VERSION, sessionModeOf, setSessionMode, audit, backupDomains, actionNames, invoke, log, schemaSnapshot });
    installTool(ctx);
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
