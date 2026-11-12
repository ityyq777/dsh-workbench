export const AUDIT_LIMITS = {
    /** 保留期（天），可用 meta.audit.retentionDays 覆盖 */
    retentionDays: 90,
    /** 单字段文本上限 */
    maxText: 2000,
    /** 参数整体 JSON 上限 */
    maxArgs: 12_000,
    /** 结果摘要上限 */
    maxResult: 4_000,
    /** 默认页大小与上限 */
    pageSize: 50,
    maxPageSize: 200,
    /** 每写入多少条做一次惰性清理 */
    pruneEvery: 200,
};
/** 敏感键名：命中即脱敏。宁可多脱，不可漏脱。 */
const SECRET_KEY = /(pass(word|wd)?|pwd|token|secret|credential|authorization|cookie|api[_-]?key|access[_-]?key|private[_-]?key|vault|encrypted|seed[_-]?phrase)/i;
/** 只读 action：最后一段命中即视为读，默认不记。 */
const READ_SUFFIX = new Set([
    "list",
    "get",
    "search",
    "stats",
    "statsreport",
    "help",
    "report",
    "history",
    "changelog",
    "timeline",
    "timelinerefactor",
    "preview",
    "tree",
    "schema",
    "nav",
    "breakdown",
    "export",
    "data",
    "config",
    "configget",
    "view",
]);
/** 从参数里挑一个「目标」，让一行日志能被人快速定位到记录。 */
const TARGET_KEYS = [
    "id",
    "ids",
    "taskId",
    "siteId",
    "tagId",
    "nodeId",
    "tableId",
    "titleKey",
    "name",
    "title",
];
export function isReadAction(action) {
    const tail = String(action || "")
        .toLowerCase()
        .split(".")
        .pop();
    return READ_SUFFIX.has(tail || "");
}
/** 递归脱敏：敏感键名换 ***，长字符串截断，深度/宽度封顶。 */
export function redactValue(value, depth = 0) {
    if (depth > 6)
        return "[max-depth]";
    if (value === null || value === undefined)
        return value;
    if (typeof value === "string") {
        return value.length > AUDIT_LIMITS.maxText
            ? value.slice(0, AUDIT_LIMITS.maxText) + "…(" + value.length + " chars)"
            : value;
    }
    if (typeof value === "number" || typeof value === "boolean")
        return value;
    if (typeof value === "bigint")
        return String(value);
    if (typeof value === "function")
        return "[function]";
    if (Array.isArray(value)) {
        return value.slice(0, 50).map((item) => redactValue(item, depth + 1));
    }
    if (typeof value === "object") {
        const out = {};
        let count = 0;
        for (const [key, item] of Object.entries(value)) {
            if (count++ >= 60) {
                out["…"] = "更多字段已省略";
                break;
            }
            out[key] = SECRET_KEY.test(key) ? "***" : redactValue(item, depth + 1);
        }
        return out;
    }
    return String(value);
}
/** 序列化脱敏后的值；超长时改为 truncated 包装，绝不写半截 JSON。 */
export function encodeAuditJson(value, limit = AUDIT_LIMITS.maxArgs) {
    if (value === undefined)
        return null;
    let json;
    try {
        json = JSON.stringify(redactValue(value));
    }
    catch {
        return JSON.stringify("[unserializable]");
    }
    if (json === undefined || json === "null")
        return null;
    if (json.length <= limit)
        return json;
    return JSON.stringify({ truncated: true, chars: json.length, preview: json.slice(0, limit) });
}
export function auditTargetOf(args) {
    if (!args || typeof args !== "object" || Array.isArray(args))
        return null;
    const obj = args;
    for (const key of TARGET_KEYS) {
        if (!Object.prototype.hasOwnProperty.call(obj, key))
            continue;
        const value = obj[key];
        if (typeof value === "string" || typeof value === "number") {
            const text = String(value).trim();
            if (text)
                return key + "=" + text.slice(0, 120);
        }
        if (Array.isArray(value) && value.length) {
            const text = value
                .slice(0, 5)
                .map((x) => String(x))
                .join(",");
            if (text)
                return key + "=" + text.slice(0, 120);
        }
    }
    return null;
}
function getMeta(db, key) {
    try {
        const row = db.prepare("SELECT v FROM meta WHERE k = ?").get(key);
        return row && row.v !== undefined && row.v !== null ? String(row.v) : "";
    }
    catch {
        return "";
    }
}
export function setAuditMeta(db, key, value) {
    db.prepare("INSERT INTO meta(k, v) VALUES(?, ?) ON CONFLICT(k) DO UPDATE SET v = excluded.v").run(key, String(value));
}
/** 把毫秒时间戳或 YYYY-MM-DD 归一成毫秒；endOfDay 用于 until。 */
function toMillis(value, endOfDay = false) {
    if (value === undefined || value === null || value === "")
        return null;
    if (typeof value === "number")
        return Number.isFinite(value) ? value : null;
    const text = String(value).trim();
    if (/^\d+$/.test(text))
        return Number(text);
    const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(text);
    if (dateOnly) {
        const ms = Date.UTC(Number(dateOnly[1]), Number(dateOnly[2]) - 1, Number(dateOnly[3]), endOfDay ? 23 : 0, endOfDay ? 59 : 0, endOfDay ? 59 : 0, endOfDay ? 999 : 0);
        return Number.isFinite(ms) ? ms : null;
    }
    const parsed = Date.parse(text);
    return Number.isFinite(parsed) ? parsed : null;
}
function clampInt(value, fallback, min, max) {
    const n = Math.floor(Number(value));
    if (!Number.isFinite(n))
        return fallback;
    return Math.max(min, Math.min(max, n));
}
function recordOf(row) {
    return {
        id: row.id,
        at: row.at,
        time: new Date(Number(row.at)).toISOString(),
        actor: row.actor,
        action: row.action,
        domain: row.domain,
        ok: Number(row.ok) === 1,
        error: row.error,
        target: row.target,
        args: row.args,
        result: row.result,
        durationMs: Number(row.duration_ms),
    };
}
export class AuditLog {
    db;
    now;
    writes = 0;
    constructor(db, now) {
        this.db = db;
        this.now = now;
    }
    ensureSchema() {
        this.db.exec(`
      CREATE TABLE IF NOT EXISTS audit_log (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        at          INTEGER NOT NULL,
        actor       TEXT    NOT NULL,
        action      TEXT    NOT NULL,
        domain      TEXT    NOT NULL,
        ok          INTEGER NOT NULL,
        error       TEXT,
        target      TEXT,
        args        TEXT,
        result      TEXT,
        duration_ms INTEGER NOT NULL DEFAULT 0
      );
      CREATE INDEX IF NOT EXISTS idx_audit_at     ON audit_log(at);
      CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_log(action);
      CREATE INDEX IF NOT EXISTS idx_audit_ok     ON audit_log(ok);
    `);
    }
    /** 是否记录只读 action（默认关闭，meta.audit.recordReads=1 打开）。 */
    recordsReads() {
        const raw = getMeta(this.db, "audit.recordReads").trim().toLowerCase();
        return raw === "1" || raw === "true" || raw === "yes" || raw === "on";
    }
    retentionDays() {
        const raw = Number(getMeta(this.db, "audit.retentionDays"));
        return Number.isFinite(raw) && raw > 0 ? Math.min(3650, Math.floor(raw)) : AUDIT_LIMITS.retentionDays;
    }
    /** 写一条审计；任何失败都吞掉并返回 null，绝不影响业务。 */
    record(input) {
        try {
            const action = String(input.action || "").trim();
            if (!action)
                return null;
            // 自举元 action 与审计自身不记
            if (action.startsWith("audit.") || action.startsWith("actions.") || action.startsWith("capabilities.")) {
                return null;
            }
            if (!input.force && isReadAction(action) && !this.recordsReads())
                return null;
            const at = Number.isFinite(Number(input.at)) ? Number(input.at) : this.now();
            const error = input.error && String(input.error).length > AUDIT_LIMITS.maxText
                ? String(input.error).slice(0, AUDIT_LIMITS.maxText) + "…"
                : input.error
                    ? String(input.error)
                    : null;
            const info = this.db
                .prepare(`INSERT INTO audit_log(at, actor, action, domain, ok, error, target, args, result, duration_ms)
           VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
                .run(at, String(input.actor || "other").slice(0, 40), action.slice(0, 120), String(input.domain || "").slice(0, 120), input.ok ? 1 : 0, error, auditTargetOf(input.args), encodeAuditJson(input.args, AUDIT_LIMITS.maxArgs), encodeAuditJson(input.result, AUDIT_LIMITS.maxResult), Math.max(0, Math.floor(Number(input.durationMs) || 0)));
            this.writes += 1;
            if (this.writes % AUDIT_LIMITS.pruneEvery === 0) {
                try {
                    this.prune(this.retentionDays());
                }
                catch {
                    /* 惰性清理失败不影响写入 */
                }
            }
            return Number(info.lastInsertRowid);
        }
        catch {
            return null;
        }
    }
    list(query = {}) {
        const where = [];
        const params = [];
        const action = query.action ? String(query.action).trim() : "";
        if (action) {
            where.push("action = ?");
            params.push(action);
        }
        const prefix = query.actionPrefix ? String(query.actionPrefix).trim() : "";
        if (prefix) {
            where.push("action LIKE ?");
            params.push(prefix.replace(/[%_]/g, (m) => "\\" + m) + "%");
        }
        const actor = query.actor ? String(query.actor).trim() : "";
        if (actor) {
            where.push("actor = ?");
            params.push(actor);
        }
        const domain = query.domain ? String(query.domain).trim() : "";
        if (domain) {
            where.push("domain = ?");
            params.push(domain);
        }
        if (query.ok !== undefined && query.ok !== null && query.ok !== "") {
            const raw = String(query.ok).toLowerCase();
            const ok = raw === "1" || raw === "true" || raw === "yes" ? 1 : raw === "0" || raw === "false" || raw === "no" ? 0 : null;
            if (ok !== null) {
                where.push("ok = ?");
                params.push(ok);
            }
        }
        const q = query.q ? String(query.q).trim() : "";
        if (q) {
            where.push("(action LIKE ? OR target LIKE ? OR error LIKE ?)");
            const like = "%" + q.replace(/[%_]/g, (m) => "\\" + m) + "%";
            params.push(like, like, like);
        }
        const target = query.target ? String(query.target).trim() : "";
        if (target) {
            where.push("target LIKE ?");
            params.push("%" + target.replace(/[%_]/g, (m) => "\\" + m) + "%");
        }
        const since = toMillis(query.since);
        if (since !== null) {
            where.push("at >= ?");
            params.push(since);
        }
        const until = toMillis(query.until, true);
        if (until !== null) {
            where.push("at <= ?");
            params.push(until);
        }
        const whereSql = where.length ? " WHERE " + where.join(" AND ") : "";
        const page = clampInt(query.page, 1, 1, 100_000);
        const pageSize = clampInt(query.pageSize, AUDIT_LIMITS.pageSize, 1, AUDIT_LIMITS.maxPageSize);
        const totalRow = this.db
            .prepare("SELECT COUNT(*) AS n FROM audit_log" + whereSql)
            .get(...params);
        const total = Number(totalRow && totalRow.n ? totalRow.n : 0);
        const rows = this.db
            .prepare("SELECT * FROM audit_log" + whereSql + " ORDER BY at DESC, id DESC LIMIT ? OFFSET ?")
            .all(...params, pageSize, (page - 1) * pageSize);
        return {
            records: rows.map(recordOf),
            total,
            returned: rows.length,
            page,
            pageSize,
            pageable: true,
        };
    }
    get(id) {
        const row = this.db.prepare("SELECT * FROM audit_log WHERE id = ?").get(Number(id));
        return row ? recordOf(row) : null;
    }
    stats(rangeDays = 30) {
        const days = clampInt(rangeDays, 30, 1, 3650);
        const since = this.now() - days * 86_400_000;
        const totals = this.db
            .prepare("SELECT COUNT(*) AS n, COALESCE(SUM(CASE WHEN ok = 0 THEN 1 ELSE 0 END), 0) AS failed FROM audit_log WHERE at >= ?")
            .get(since);
        const byAction = this.db
            .prepare(`SELECT action, COUNT(*) AS n, COALESCE(SUM(CASE WHEN ok = 0 THEN 1 ELSE 0 END), 0) AS failed
         FROM audit_log WHERE at >= ? GROUP BY action ORDER BY n DESC, action ASC LIMIT 30`)
            .all(since);
        const byActor = this.db
            .prepare(`SELECT actor, COUNT(*) AS n FROM audit_log WHERE at >= ? GROUP BY actor ORDER BY n DESC LIMIT 10`)
            .all(since);
        const byDay = this.db
            .prepare(`SELECT strftime('%Y-%m-%d', at / 1000, 'unixepoch', 'localtime') AS day,
                COUNT(*) AS n, COALESCE(SUM(CASE WHEN ok = 0 THEN 1 ELSE 0 END), 0) AS failed
         FROM audit_log WHERE at >= ? GROUP BY day ORDER BY day DESC LIMIT 60`)
            .all(since);
        return {
            rangeDays: days,
            since,
            total: Number(totals && totals.n ? totals.n : 0),
            failed: Number(totals && totals.failed ? totals.failed : 0),
            byAction: byAction.map((r) => ({ action: r.action, count: Number(r.n), failed: Number(r.failed) })),
            byActor: byActor.map((r) => ({ actor: r.actor, count: Number(r.n) })),
            byDay: byDay.map((r) => ({ day: r.day, count: Number(r.n), failed: Number(r.failed) })),
        };
    }
    prune(retentionDays) {
        const days = retentionDays === undefined || retentionDays === null || retentionDays === ""
            ? this.retentionDays()
            : clampInt(retentionDays, this.retentionDays(), 1, 3650);
        const cutoff = this.now() - days * 86_400_000;
        const info = this.db.prepare("DELETE FROM audit_log WHERE at < ?").run(cutoff);
        return { deleted: Number(info.changes || 0), retentionDays: days, cutoff };
    }
}
