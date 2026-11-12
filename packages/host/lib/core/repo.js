import { monoNow } from "./db.js";
/**
 * 平台同步层：只做「表无关」的事情。
 * 具体业务（任务增删改查）属于子插件，壳不 import、不硬编码。
 */
function tableExists(db, tableName) {
    return Boolean(db.prepare("SELECT 1 FROM sqlite_master WHERE type='table' AND name=?").get(tableName));
}
function stableStringify(value) {
    if (value === null)
        return "null";
    if (Array.isArray(value))
        return "[" + value.map((v) => stableStringify(v)).join(",") + "]";
    if (typeof value === "object") {
        const obj = value;
        return "{" + Object.keys(obj).sort().map((k) => JSON.stringify(k) + ":" + stableStringify(obj[k])).join(",") + "}";
    }
    return JSON.stringify(value);
}
export function writeConflict(db, tableName, rowId, kind, resolution, local, server, serverUpdatedAt, localUpdatedAt) {
    db.prepare("INSERT INTO conflict_shadow(table_name,row_id,kind,resolution,local_payload,server_payload,server_updated_at,local_updated_at,resolved_at) " +
        "VALUES(?,?,?,?,?,?,?,?,?)").run(tableName, rowId, kind, resolution, local ? JSON.stringify(local) : null, server ? JSON.stringify(server) : null, serverUpdatedAt, localUpdatedAt, monoNow());
}
/**
 * 应用一条远端 upsert（pull 路径）：严格行级 LWW。
 *  - 本地 updated_at 更大：保留本地，写 conflict_shadow；
 *  - 相等：payload 相同则幂等，不同则以服务端为准并写 shadow；
 *  - 远端更大：整行替换。
 * 表不存在（对应插件未安装）时直接跳过：数据仍在云端，安装后 snapshot 补回。
 */
export function applyRemoteUpsert(db, tableName, remote, serverUpdatedAt) {
    if (!tableExists(db, tableName))
        return false;
    const rowId = String(remote.id ?? "");
    if (!rowId)
        return false;
    const cur = db.prepare("SELECT * FROM " + tableName + " WHERE id=?").get(rowId);
    if (cur) {
        const localUpdatedAt = Number(cur.updated_at) || 0;
        if (localUpdatedAt > serverUpdatedAt) {
            writeConflict(db, tableName, rowId, "pull", "local", cur, remote, serverUpdatedAt, localUpdatedAt);
            return false;
        }
        if (localUpdatedAt === serverUpdatedAt && stableStringify(cur) !== stableStringify(remote)) {
            writeConflict(db, tableName, rowId, "pull-equal", "server", cur, remote, serverUpdatedAt, localUpdatedAt);
        }
    }
    const cols = Object.keys(remote);
    // 通用整行替换：先删后插保证列集合与服务端一致（列由业务插件建表，同步方不感知）。
    db.exec("SAVEPOINT core_remote_row");
    try {
        db.prepare("DELETE FROM " + tableName + " WHERE id=?").run(rowId);
        const placeholders = cols.map(() => "?").join(",");
        db.prepare("INSERT INTO " + tableName + " (" + cols.join(",") + ") VALUES(" + placeholders + ")").run(...cols.map((c) => remote[c]));
        db.exec("RELEASE core_remote_row");
    }
    catch (error) {
        db.exec("ROLLBACK TO core_remote_row; RELEASE core_remote_row");
        throw error;
    }
    return true;
}
/**
 * 应用一条远端墓碑。v2 的 delete 事件带完整行 payload，走同一套 LWW；
 * 旧协议没有 payload 时退化为本地打墓碑（仍用远端事件时间，而不是本机时间）。
 */
export function applyRemoteDelete(db, tableName, rowId, remote, serverUpdatedAt) {
    if (!tableExists(db, tableName))
        return false;
    if (remote && remote.id !== undefined) {
        return applyRemoteUpsert(db, tableName, remote, Number(serverUpdatedAt ?? remote.updated_at ?? Date.now()));
    }
    const ts = Number(serverUpdatedAt ?? Date.now());
    db.prepare("UPDATE " + tableName + " SET deleted_at=?, updated_at=? WHERE id=? AND updated_at<=?").run(ts, ts, rowId, ts);
    return true;
}
/** 记录一条死信（单行/单表失败，不阻塞其他表）。 */
export function recordDeadLetter(db, tableName, rowId, op, payload, error) {
    const now = monoNow();
    const existing = db
        .prepare("SELECT id,attempts FROM sync_dead_letter WHERE table_name=? AND row_id=? AND op=?")
        .get(tableName, rowId, op);
    if (existing) {
        db.prepare("UPDATE sync_dead_letter SET payload=?,error=?,attempts=?,updated_at=? WHERE id=?").run(payload, error, existing.attempts + 1, now, existing.id);
    }
    else {
        db.prepare("INSERT INTO sync_dead_letter(table_name,row_id,op,payload,error,attempts,created_at,updated_at) VALUES(?,?,?,?,?,1,?,?)").run(tableName, rowId, op, payload, error, now, now);
    }
    db.exec("DELETE FROM sync_dead_letter WHERE id NOT IN (SELECT id FROM sync_dead_letter ORDER BY id DESC LIMIT 1000)");
}
/** 读取待推送的变更尾部（seq > afterSeq），按 seq 升序。 */
export function pendingChanges(db, afterSeq, limit = 200) {
    return db.prepare("SELECT * FROM sync_change_log WHERE seq>? ORDER BY seq ASC LIMIT ?").all(afterSeq, limit);
}
/** 记录已同步水位（数字；v1 兼容）。 */
export function setSyncState(db, key, value) {
    setSyncStateText(db, key, String(value));
}
export function getSyncState(db, key) {
    const raw = getSyncStateText(db, key);
    const n = Number(raw);
    return Number.isFinite(n) ? n : 0;
}
/** 文本水位：账号 id / epoch / 时间戳等统一入口。 */
export function setSyncStateText(db, key, value) {
    db.prepare("INSERT INTO sync_state(k,v) VALUES(?,?) ON CONFLICT(k) DO UPDATE SET v=excluded.v").run(key, value);
}
export function getSyncStateText(db, key) {
    const row = db.prepare("SELECT v FROM sync_state WHERE k=?").get(key);
    return row && row.v !== null && row.v !== undefined ? String(row.v) : "";
}
export function deleteSyncState(db, key) {
    db.prepare("DELETE FROM sync_state WHERE k=?").run(key);
}
/** 供子插件宿主 API 复用：判断表是否存在。 */
export { tableExists };
