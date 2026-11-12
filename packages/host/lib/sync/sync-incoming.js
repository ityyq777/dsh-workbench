import { applyRemoteUpsert, writeConflict } from "../core/index.js";
/** All inbound paths, including manual resolution, share atomic domain validation. */
export function incomingTransaction(db, fn) {
    db.exec("SAVEPOINT sync_incoming");
    try {
        const result = fn();
        db.exec("RELEASE sync_incoming");
        return result;
    }
    catch (error) {
        db.exec("ROLLBACK TO sync_incoming; RELEASE sync_incoming");
        throw error;
    }
}
export function applyIncoming(db, table, input, serverTs, repair, force = false) {
    return incomingTransaction(db, () => {
        const local = db.prepare("SELECT * FROM " + table.name + " WHERE id=?").get(String(input.id));
        const context = { db, row: input, local: local ?? null };
        const row = table.normalizeIncoming?.(context) ?? input;
        if (row.id !== input.id)
            throw new Error("SYNC_ROW_ID_CHANGED");
        const keys = table.uniqueKeys;
        if (keys?.length && (table.uniquePolicy ?? "lww-tombstone") === "lww-tombstone" && row.deleted_at === null) {
            for (const key of keys) {
                if (!key.length || key.some(c => row[c] == null))
                    continue;
                const other = db.prepare("SELECT * FROM " + table.name + " WHERE deleted_at IS NULL AND " + key.map(c => c + "=?").join(" AND ") + " AND id<>? ORDER BY updated_at DESC LIMIT 1")
                    .get(...key.map(c => row[c]), String(row.id));
                if (!other)
                    continue;
                const localTs = Number(other.updated_at) || 0, remoteTs = Number(row.updated_at) || serverTs;
                if (localTs > remoteTs) {
                    writeConflict(db, table.name, row.id, "unique", "local", other, row, remoteTs, localTs);
                    return false;
                }
                const ts = Math.max(localTs, remoteTs);
                db.prepare("UPDATE " + table.name + " SET deleted_at=?,updated_at=?,rev=rev+1 WHERE id=?").run(ts, ts, other.id);
                const tomb = db.prepare("SELECT * FROM " + table.name + " WHERE id=?").get(other.id);
                repair?.(tomb);
                writeConflict(db, table.name, row.id, "unique", "server", other, row, remoteTs, localTs);
            }
        }
        let applied;
        if (force) {
            const cols = Object.keys(row);
            db.prepare("DELETE FROM " + table.name + " WHERE id=?").run(row.id);
            db.prepare("INSERT INTO " + table.name + " (" + cols.join(",") + ") VALUES(" + cols.map(() => "?").join(",") + ")").run(...cols.map(c => row[c]));
            applied = true;
        }
        else
            applied = applyRemoteUpsert(db, table.name, row, serverTs);
        if (applied)
            table.afterApply?.({ db, row, local: local ?? null });
        return applied;
    });
}
