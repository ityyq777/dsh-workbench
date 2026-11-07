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
import { openDb } from "./core/index.js";
import { runSyncRound } from "./sync.js";
export const name = "dsh-workbench";
export const inject = ["webServer", "tools", "connection"];
/** 本地库与云端配置路径（05 文档约定目录）。 */
const WB_HOME = process.env.WB_HOME ?? join(homedir(), ".dsh", "workbench");
const CLOUD_DEFAULT = process.env.WB_CLOUD_URL ?? "http://127.0.0.1:8791";
/** 宿主 API 版本：业务插件用它做兼容判断。 */
export const SHELL_VERSION = "0.2.0";
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
export function apply(ctx) {
    const state = { db: openDb(join(WB_HOME, "workbench.db")), creds: loadCreds(), cloudUrl: CLOUD_DEFAULT };
    const subscribers = new Set();
    const domains = new Map();
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
    function actionNames() {
        const out = [];
        for (const rec of domains.values()) {
            for (const [action, def] of rec.actions) {
                out.push({ name: action, domainId: rec.def.id, description: def.description });
            }
        }
        return out;
    }
    async function invoke(action, args, origin) {
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
                    const client = {
                        push: (changes) => cloudFetch("/v1/sync/push", { method: "POST", json: { changes } }),
                        pull: (cursor) => cloudFetch("/v1/sync/pull?cursor=" + cursor),
                    };
                    const r = await runSyncRound(state.db, client, state.creds.deviceId);
                    emit("sync-done", r);
                    return send(200, { ok: true, ...r });
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
        description: "个人工作台。action 由已安装业务插件提供（任务 tasks.* / 标签 tags.* / 站点 sites.* / 站点目录 siteNodes.*）。" +
            "安装或卸载业务插件请使用 DSH 的插件管理，不在本工具里做。",
        parameters: {
            type: "object",
            properties: {
                action: {
                    type: "string",
                    description: "action 名，如 tasks.list / tasks.create / tags.create / sites.list",
                },
                id: { type: "string", description: "记录 id" },
                title: { type: "string" },
                name: { type: "string" },
                note: { type: "string" },
                description: { type: "string" },
                status: { type: "string" },
                priority: { type: "number" },
                due_at: { type: ["number", "null"] },
                tags: { type: "array", items: { type: "string" } },
                tagIds: { type: "array", items: { type: "string" } },
                dirIds: { type: "array", items: { type: "string" } },
                parentId: { type: "string" },
                limit: { type: "number" },
            },
            required: ["action"],
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
                    return { text: "错误：缺少 action" };
                // 兼容旧工具调用：无命名空间的 list/create/... 映射到 tasks.*
                const action = raw.indexOf(".") >= 0 ? raw : "tasks." + raw;
                const payload = { ...args };
                delete payload.action;
                const r = await invoke(action, payload, "agent");
                return { text: r.text };
            }
            catch (e) {
                return { text: "错误：" + String((e && e.message) || e) };
            }
        },
    });
    // ── 后台同步循环：30s 周期 + 登录后立即一轮（07 文档）──
    let timer;
    const startLoop = () => {
        if (timer)
            clearInterval(timer);
        timer = setInterval(async () => {
            if (!state.creds)
                return;
            try {
                const client = {
                    push: (changes) => cloudFetch("/v1/sync/push", { method: "POST", json: { changes } }),
                    pull: (cursor) => cloudFetch("/v1/sync/pull?cursor=" + cursor),
                };
                const r = await runSyncRound(state.db, client, state.creds.deviceId);
                if (r.pushed || r.pulled)
                    emit("sync-done", r);
            }
            catch {
                /* 离线静默（指数退避在 demo 省略） */
            }
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
