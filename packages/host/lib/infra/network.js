import { actionErrorText } from "../actions/action-output.js";
import { randomUUID } from "node:crypto";
import { getSyncStateText, setSyncStateText } from "../core/index.js";
import { SyncEngine, SyncHttpError, listConflicts, resolveConflict } from "../sync/sync.js";
import { createBackup, importBackup, normalizeImportPolicy } from "./backup.js";
export function installNetwork({ ctx, state, saveCreds, clock, domains, emit, subscribers, listDomains, SHELL_VERSION, sessionModeOf, setSessionMode, audit, backupDomains, actionNames, invoke, log, schemaSnapshot }) {
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
    /** 云端健康检查缓存：首页/账号页共用，避免同步事件风暴时反复探测。 */
    let cloudHealthCache = null;
    /** 轻量探测云端是否可达；结果缓存 10s，失败不抛异常。 */
    async function cloudHealth() {
        const now = Date.now();
        if (cloudHealthCache && now - cloudHealthCache.at < 10_000)
            return cloudHealthCache.value;
        const started = now;
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 3_000);
        let value;
        try {
            const res = await fetch(state.cloudUrl + "/v1/health", { signal: controller.signal });
            value = {
                reachable: res.ok,
                status: res.status,
                checked_at: Date.now(),
                latency_ms: Date.now() - started,
            };
        }
        catch (e) {
            value = {
                reachable: false,
                status: 0,
                checked_at: Date.now(),
                latency_ms: Date.now() - started,
                error: String((e && e.message) || e),
            };
        }
        finally {
            clearTimeout(timer);
        }
        cloudHealthCache = { at: now, value };
        return value;
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
                if (p === "/audit" && m === "GET") {
                    // 审计页数据：列表 + 可选统计。参数与 audit.list 保持一致，便于同一套筛选复用到 UI。
                    try {
                        const q = url.searchParams;
                        const pick = (key) => (q.get(key) === null ? undefined : String(q.get(key)));
                        const result = audit.list({
                            action: pick("action"),
                            actionPrefix: pick("actionPrefix"),
                            actor: pick("actor"),
                            domain: pick("domain"),
                            ok: pick("ok"),
                            q: pick("q"),
                            target: pick("target"),
                            since: pick("since"),
                            until: pick("until"),
                            page: pick("page"),
                            pageSize: pick("pageSize"),
                        });
                        const stats = q.get("stats") === "1" ? audit.stats(pick("rangeDays") ?? 30) : null;
                        return send(200, { ok: true, shellVersion: SHELL_VERSION, ...result, stats });
                    }
                    catch (e) {
                        return send(500, { ok: false, error: String((e && e.message) || e) });
                    }
                }
                if (p === "/schema" && m === "GET") {
                    // 只读 schema 快照：Action 页用它渲染运行时注册，不经过 action 执行链路。
                    try {
                        const domain = String(url.searchParams.get("domain") ?? "").trim();
                        return send(200, { ok: true, readonly: true, ...schemaSnapshot(domain || undefined) });
                    }
                    catch (e) {
                        return send(500, { ok: false, error: String((e && e.message) || e) });
                    }
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
                    const cloud = state.creds
                        ? await cloudHealth()
                        : { reachable: null, status: 0, checked_at: 0 };
                    return send(200, {
                        ok: true,
                        logged_in: Boolean(state.creds),
                        ...engine.status(),
                        running: syncBusy,
                        cloud,
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
                    const ok = resolveConflict(state.db, Number(conflictM[1]), action, clock.now(), syncDomains());
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
                        cloudHealthCache = null;
                        emit("account-changed", { logged_in: true });
                        void runSync().catch((e) => log("登录后首轮同步失败", e));
                    }
                    return send(r.ok ? 200 : 401, r);
                }
                if (p === "/account/logout" && m === "POST") {
                    state.creds = null;
                    saveCreds(null);
                    cloudHealthCache = null;
                    emit("account-changed", { logged_in: false });
                    return send(200, { ok: true });
                }
                return send(404, { ok: false, error: "no route " + m + " " + p });
            }
            catch (e) {
                return send(500, { ok: false, error: actionErrorText(e) });
            }
        },
    }, "workbench-http"), "workbench-http");
    return { runSync };
}
