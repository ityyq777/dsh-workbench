import { applyIncoming } from "./sync-incoming.js";
import { parseObject, stableStringify } from "./sync-values.js";
export * from "./sync-types.js";
export { listConflicts, resolveConflict } from "./sync-conflicts.js";
import { getSyncState, getSyncStateText, recordDeadLetter, writeConflict, setSyncState, setSyncStateText, tableExists } from "../core/index.js";
export class SyncHttpError extends Error {
    status;
    code;
    body;
    constructor(status, code, message, body = {}) {
        super(message);
        this.name = "SyncHttpError";
        this.status = status;
        this.code = code;
        this.body = body;
    }
}
/** 服务端时钟校准 + 本地单调递增时钟。 */
export class SyncClock {
    offset = 0;
    last = 0;
    calibrate(serverTime, t1, t2) {
        this.offset = Math.round(serverTime - (t1 + t2) / 2);
    }
    now() {
        const wall = Date.now() + this.offset;
        this.last = Math.max(wall, this.last + 1);
        return this.last;
    }
    getOffset() {
        return this.offset;
    }
}
const SESSION_LIMIT = 200;
const PUSH_BATCH = 200;
const PULL_BATCH = 300;
const TREE_RETRY = 3;
function keyOf(userId, table, kind) {
    return kind + ":" + userId + ":" + table;
}
/** 宿主 v2 同步引擎。所有业务差异都在 DomainSyncTable.reconcile 中，引擎只做协议与平台语义。 */
export class SyncEngine {
    db;
    domains;
    transport;
    clock;
    userId;
    deviceId;
    epoch;
    onEvent;
    running = false;
    sessionId = "";
    constructor(opts) {
        this.db = opts.db;
        this.domains = opts.domains;
        this.transport = opts.transport;
        this.clock = opts.clock;
        this.userId = opts.userId;
        this.deviceId = opts.deviceId;
        this.epoch = opts.epoch;
        this.onEvent = opts.onEvent;
    }
    isRunning() {
        return this.running;
    }
    emit(event, data) {
        try {
            this.onEvent?.(event, data);
        }
        catch {
            /* ignore */
        }
    }
    bindings() {
        const out = new Map();
        for (const domain of this.domains) {
            const declared = domain.sync?.tables;
            if (declared && declared.length) {
                for (const table of declared) {
                    if (out.has(table.name))
                        continue;
                    out.set(table.name, { domainId: domain.id, table });
                }
                continue;
            }
            for (const name of domain.tables ?? []) {
                if (out.has(name))
                    continue;
                out.set(name, { domainId: domain.id, table: { name, mode: "row" } });
            }
        }
        return out;
    }
    tableExists(table) {
        return tableExists(this.db, table);
    }
    readRows(table) {
        if (!this.tableExists(table))
            return [];
        return this.db.prepare("SELECT * FROM " + table + " ORDER BY id ASC").all();
    }
    replaceRows(table, rows) {
        if (!this.tableExists(table))
            return;
        this.db.exec("BEGIN IMMEDIATE");
        try {
            this.db.prepare("DELETE FROM " + table).run();
            for (const row of rows) {
                const cols = Object.keys(row);
                if (!cols.length)
                    continue;
                const stmt = this.db.prepare("INSERT INTO " + table + " (" + cols.join(",") + ") VALUES(" + cols.map(() => "?").join(",") + ")");
                stmt.run(...cols.map((c) => (row[c] === undefined ? null : row[c])));
            }
            this.db.exec("COMMIT");
        }
        catch (e) {
            try {
                this.db.exec("ROLLBACK");
            }
            catch {
                /* ignore */
            }
            throw e;
        }
    }
    maxSeq(table) {
        const row = this.db
            .prepare("SELECT MAX(seq) AS n FROM sync_change_log WHERE table_name=?")
            .get(table);
        return row?.n ?? 0;
    }
    hasChanges(table, after) {
        return Boolean(this.db
            .prepare("SELECT 1 FROM sync_change_log WHERE table_name=? AND seq>? LIMIT 1")
            .get(table, after));
    }
    enqueueRepair(table, row) {
        if (!this.tableExists(table) || !row || !row.id)
            return;
        const payload = stableStringify(row);
        const op = row.deleted_at !== null && row.deleted_at !== undefined ? "delete" : "upsert";
        this.db
            .prepare("INSERT INTO sync_change_log(table_name,row_id,op,payload,origin,updated_at) VALUES(?,?,?,?,?,?)")
            .run(table, String(row.id), op, payload, "sync-repair", Number(row.updated_at) || this.clock.now());
    }
    localRow(table, rowId) {
        if (!this.tableExists(table))
            return null;
        const row = this.db.prepare("SELECT * FROM " + table + " WHERE id=?").get(rowId);
        return row ?? null;
    }
    applyRemoteRow(table, binding, row, serverTs) {
        return applyIncoming(this.db, binding.table, row, serverTs, tomb => this.enqueueRepair(table, tomb));
    }
    /** 把本地 change log 中的条目补成完整行 payload；旧数据 delete payload=null 时从当前行/墓碑补齐。 */
    changePayload(table, rowId, updatedAt, payload) {
        const parsed = parseObject(payload);
        if (parsed && parsed.id !== undefined)
            return parsed;
        const row = this.localRow(table, rowId);
        if (row)
            return row;
        return { id: rowId, updated_at: updatedAt, deleted_at: updatedAt, rev: 0 };
    }
    report(partial) {
        const now = this.clock.now();
        setSyncStateText(this.db, "last_sync_at", String(now));
        setSyncStateText(this.db, "last_sync_ok", partial.ok ? "1" : "0");
        setSyncStateText(this.db, "last_sync_error", partial.error ?? "");
        setSyncStateText(this.db, "failed_tables", JSON.stringify(partial.failed_tables ?? []));
    }
    status() {
        const failedRaw = getSyncStateText(this.db, "failed_tables");
        let failed = [];
        try {
            const v = JSON.parse(failedRaw);
            if (Array.isArray(v))
                failed = v.map(String);
        }
        catch {
            /* ignore */
        }
        const conflicts = this.db
            .prepare("SELECT COUNT(*) AS n FROM conflict_shadow")
            .get();
        const dead = this.db
            .prepare("SELECT COUNT(*) AS n FROM sync_dead_letter")
            .get();
        return {
            running: this.running,
            user_id: getSyncStateText(this.db, "account_user_id"),
            device_id: this.deviceId,
            epoch: this.epoch,
            clock_offset: Number(getSyncStateText(this.db, "clock_offset")) || 0,
            last_sync_at: Number(getSyncStateText(this.db, "last_sync_at")) || 0,
            last_sync_ok: getSyncStateText(this.db, "last_sync_ok") === "1",
            last_sync_error: getSyncStateText(this.db, "last_sync_error"),
            failed_tables: failed,
            conflicts: conflicts.n,
            dead_letters: dead.n,
        };
    }
    ensureAccount() {
        const cur = getSyncStateText(this.db, "account_user_id");
        if (!cur) {
            setSyncStateText(this.db, "account_user_id", this.userId);
            return;
        }
        if (cur !== this.userId) {
            throw new Error("本地数据已绑定账号 " + cur + "；切换账号请使用新的 WB_HOME 数据目录");
        }
    }
    async run() {
        if (this.running) {
            return {
                ok: false,
                pushed: 0,
                pulled: 0,
                tables: [],
                failed_tables: [],
                error: "sync already running",
                repaired: 0,
                started_at: this.clock.now(),
                finished_at: this.clock.now(),
            };
        }
        this.running = true;
        const startedAt = this.clock.now();
        const tables = this.bindings();
        const report = {
            ok: true,
            pushed: 0,
            pulled: 0,
            tables: [...tables.keys()],
            failed_tables: [],
            repaired: 0,
            started_at: startedAt,
            finished_at: startedAt,
        };
        this.emit("sync-status", { phase: "open", running: true });
        try {
            this.ensureAccount();
            const t1 = Date.now();
            const opened = await this.transport.open(2, this.deviceId);
            this.clock.calibrate(opened.server_time, t1, Date.now());
            setSyncStateText(this.db, "clock_offset", String(this.clock.getOffset()));
            this.sessionId = opened.session_id;
            const versions = opened.tables ?? {};
            const tablesOpen = [];
            for (const [name, binding] of tables) {
                tablesOpen.push({ name, mode: binding.table.mode });
            }
            const treeTables = [...tables.entries()].filter(([, b]) => b.table.mode === "tree");
            const rowTables = [...tables.entries()].filter(([, b]) => b.table.mode !== "tree");
            // B 类先做整表收敛，再处理 A 类行；避免树节点引用尚未同步的行。
            for (const [name, binding] of treeTables) {
                try {
                    await this.syncTreeTable(name, binding, versions[name]?.version ?? 0);
                    this.emit("sync-status", { phase: "table", table: name, mode: "tree" });
                }
                catch (e) {
                    const msg = String((e && e.message) || e);
                    report.failed_tables.push(name);
                    recordDeadLetter(this.db, name, "*", "table", null, msg);
                    this.emit("sync-status", { phase: "table-error", table: name, error: msg });
                }
            }
            for (const [name, binding] of rowTables) {
                try {
                    const r = await this.syncRowTable(name, binding);
                    report.pushed += r.pushed;
                    report.pulled += r.pulled;
                    report.repaired += r.repaired;
                    this.emit("sync-status", { phase: "table", table: name, mode: "row" });
                }
                catch (e) {
                    const msg = String((e && e.message) || e);
                    report.failed_tables.push(name);
                    recordDeadLetter(this.db, name, "*", "table", null, msg);
                    this.emit("sync-status", { phase: "table-error", table: name, error: msg });
                }
            }
            report.ok = report.failed_tables.length === 0;
            if (!report.ok)
                report.error = "部分表同步失败：" + report.failed_tables.join(", ");
        }
        catch (e) {
            report.ok = false;
            report.error = String((e && e.message) || e);
        }
        finally {
            report.finished_at = this.clock.now();
            this.report(report);
            this.emit("sync-status", {
                phase: "done",
                running: false,
                ok: report.ok,
                pushed: report.pushed,
                pulled: report.pulled,
                failed_tables: report.failed_tables,
                error: report.error ?? "",
            });
            this.emit("sync-done", {
                ok: report.ok,
                pushed: report.pushed,
                pulled: report.pulled,
                failed_tables: report.failed_tables,
                error: report.error ?? "",
            });
            this.running = false;
            try {
                await this.transport.close({
                    session_id: this.sessionId,
                    success: report.ok,
                    cursors: this.snapshotCursors([...tables.keys()]),
                });
            }
            catch {
                /* close 幂等；网络失败不影响本轮结果 */
            }
            this.sessionId = "";
        }
        return report;
    }
    snapshotCursors(tables) {
        const out = {};
        for (const table of tables) {
            out[table] = getSyncState(this.db, keyOf(this.userId, table, "pull_cursor"));
        }
        return out;
    }
    async syncRowTable(table, binding) {
        let pushed = 0;
        let pulled = 0;
        let repaired = 0;
        if (!this.tableExists(table)) {
            throw new Error("表不存在：" + table + "（业务插件未初始化？）");
        }
        const backfillKey = keyOf(this.userId, table, "backfill_done");
        const pullKey = keyOf(this.userId, table, "pull_cursor");
        const pushKey = keyOf(this.userId, table, "push_after");
        if (getSyncStateText(this.db, backfillKey) !== "1") {
            const snap = await this.transport.snapshot({ session_id: this.sessionId, table });
            const remoteIds = new Set();
            for (const row of snap.rows ?? []) {
                const id = String(row.id ?? "");
                if (!id)
                    continue;
                remoteIds.add(id);
                const applied = this.applyRemoteRow(table, binding, row, Number(row.updated_at) || 0);
                if (!applied) {
                    const local = this.localRow(table, String(row.id));
                    if (local) {
                        this.enqueueRepair(table, local);
                        repaired++;
                    }
                }
            }
            for (const row of this.readRows(table)) {
                if (!remoteIds.has(String(row.id))) {
                    this.enqueueRepair(table, row);
                    repaired++;
                }
            }
            setSyncState(this.db, pullKey, snap.cursor ?? 0);
            setSyncStateText(this.db, backfillKey, "1");
            this.emit("sync-status", { phase: "backfill", table, rows: snap.rows?.length ?? 0 });
        }
        // push 本地尾部（包含 backfill 补进来的 repair）
        for (;;) {
            const after = getSyncState(this.db, pushKey);
            const changes = this.db
                .prepare("SELECT * FROM sync_change_log WHERE table_name=? AND seq>? ORDER BY seq ASC LIMIT ?")
                .all(table, after, PUSH_BATCH);
            if (!changes.length)
                break;
            const sent = changes.map((c) => {
                const payload = this.changePayload(table, c.row_id, c.updated_at, c.payload);
                return {
                    client_seq: c.seq,
                    table_name: c.table_name,
                    row_id: c.row_id,
                    op: c.op === "delete" ? "delete" : "upsert",
                    payload,
                    updated_at: Number(payload.updated_at) || c.updated_at,
                };
            });
            const res = await this.transport.push({
                session_id: this.sessionId,
                client_epoch: this.epoch,
                changes: sent,
            });
            let handled = 0;
            for (const r of res.results ?? []) {
                const seq = Number(r.client_seq) || 0;
                if (r.status === "conflict" && r.current) {
                    const local = this.localRow(table, r.row_id);
                    const serverTs = Number(r.current.updated_at) || 0;
                    if (local) {
                        writeConflict(this.db, table, r.row_id, "push", "server", local, r.current, serverTs, Number(local.updated_at) || 0);
                    }
                    this.applyRemoteRow(table, binding, r.current, serverTs);
                }
                else if (r.status === "invalid") {
                    recordDeadLetter(this.db, table, r.row_id, "upsert", null, r.error ?? "invalid");
                }
                handled = Math.max(handled, seq);
            }
            const advance = Math.max(after, handled, Math.min(res.accepted_up_to ?? 0, sent[sent.length - 1].client_seq));
            setSyncState(this.db, pushKey, advance);
            pushed += sent.length;
            if (changes.length < PUSH_BATCH)
                break;
        }
        // pull 远端变更（按表游标；不看全局游标）
        let cursor = getSyncState(this.db, pullKey);
        for (;;) {
            const page = await this.transport.pull({
                session_id: this.sessionId,
                cursors: { [table]: cursor },
                limit: PULL_BATCH,
            });
            if (page.min_seq > 0 && cursor + 1 < page.min_seq) {
                // 云端日志已被截断，单表重新 snapshot 重建游标，避免永久缺口。
                const snap = await this.transport.snapshot({ session_id: this.sessionId, table });
                for (const row of snap.rows ?? []) {
                    const applied = this.applyRemoteRow(table, binding, row, Number(row.updated_at) || 0);
                    if (!applied) {
                        const local = this.localRow(table, String(row.id));
                        if (local) {
                            this.enqueueRepair(table, local);
                            repaired++;
                        }
                    }
                }
                cursor = snap.cursor ?? 0;
                setSyncState(this.db, pullKey, cursor);
                break;
            }
            let pageMax = cursor;
            for (const e of page.entries ?? []) {
                pageMax = Math.max(pageMax, Number(e.server_seq) || 0);
                if (e.op === "reset")
                    continue;
                if (e.device_id === this.deviceId)
                    continue;
                const applied = this.applyEntry(table, binding, e);
                if (!applied) {
                    repaired++;
                    const row = this.localRow(table, e.row_id);
                    if (row)
                        this.enqueueRepair(table, row);
                }
                pulled++;
            }
            cursor = Math.max(cursor, Number(page.next_cursors?.[table] ?? pageMax));
            setSyncState(this.db, pullKey, cursor);
            if (!page.has_more)
                break;
            if (!(page.entries ?? []).length)
                break;
        }
        return { pushed, pulled, repaired };
    }
    applyEntry(table, binding, entry) {
        if (entry.op === "delete") {
            const payload = entry.payload ?? this.localRow(table, entry.row_id);
            if (!payload)
                return false;
            return this.applyRemoteRow(table, binding, { ...payload, id: entry.row_id,
                updated_at: entry.updated_at, deleted_at: payload.deleted_at ?? entry.updated_at }, entry.updated_at);
        }
        if (entry.payload) {
            return this.applyRemoteRow(table, binding, entry.payload, Number(entry.payload.updated_at) || entry.updated_at);
        }
        return false;
    }
    async syncTreeTable(table, binding, remoteVersion) {
        if (!binding.table.reconcile) {
            throw new Error("树表缺少 reconcile：" + table);
        }
        if (!this.tableExists(table))
            throw new Error("表不存在：" + table);
        const versionKey = keyOf(this.userId, table, "table_version");
        const pushKey = keyOf(this.userId, table, "push_after");
        const pullKey = keyOf(this.userId, table, "pull_cursor");
        const backfillKey = keyOf(this.userId, table, "backfill_done");
        const localVersion = Number(getSyncStateText(this.db, versionKey)) || 0;
        const backfilled = getSyncStateText(this.db, backfillKey) === "1";
        const after = getSyncState(this.db, pushKey);
        const dirty = this.hasChanges(table, after);
        if (backfilled && localVersion === remoteVersion && !dirty)
            return;
        // 版本一致但有本地改动：以服务端版本为 base 整表推上去。
        if (backfilled && localVersion === remoteVersion && dirty) {
            const rows = this.readRows(table);
            const maxBefore = this.maxSeq(table);
            try {
                const full = await this.transport.full({
                    session_id: this.sessionId,
                    table,
                    base_version: remoteVersion,
                    rows,
                });
                setSyncStateText(this.db, versionKey, String(full.version));
                setSyncState(this.db, pullKey, Math.max(getSyncState(this.db, pullKey), full.cursor));
                setSyncState(this.db, pushKey, maxBefore);
                return;
            }
            catch (e) {
                if (!(e instanceof SyncHttpError) || e.code !== "version_conflict")
                    throw e;
                // 版本被别人推进：走 snapshot/reconcile。
            }
        }
        let lastError = null;
        for (let attempt = 0; attempt < TREE_RETRY; attempt++) {
            const snap = await this.transport.snapshot({ session_id: this.sessionId, table });
            const localRows = this.readRows(table);
            const result = await binding.table.reconcile(snap.rows ?? [], localRows);
            const rows = Array.isArray(result?.rows) ? result.rows : localRows;
            this.replaceRows(table, rows);
            for (const dirtyTable of result?.dirtyRowTables ?? []) {
                for (const row of this.readRows(dirtyTable))
                    this.enqueueRepair(dirtyTable, row);
            }
            const maxBefore = this.maxSeq(table);
            try {
                const full = await this.transport.full({
                    session_id: this.sessionId,
                    table,
                    base_version: snap.version,
                    rows,
                });
                setSyncStateText(this.db, versionKey, String(full.version));
                setSyncState(this.db, pullKey, Math.max(getSyncState(this.db, pullKey), full.cursor));
                setSyncState(this.db, pushKey, maxBefore);
                setSyncStateText(this.db, backfillKey, "1");
                return;
            }
            catch (e) {
                lastError = e;
                if (!(e instanceof SyncHttpError) || e.code !== "version_conflict")
                    throw e;
            }
        }
        throw lastError instanceof Error ? lastError : new Error("树表同步失败：" + table);
    }
}
