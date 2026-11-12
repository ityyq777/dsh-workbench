import { now, tx, logChange } from "../db/db.js";
import { replaceTags } from "./tags.js";

// Caller owns the transaction. Tags unavailable: preserve mappings, as storage.delete does.
export function deleteRow(api, id, origin, ts) {
  const db = api.db;
  if (!db.prepare("SELECT 1 FROM storage WHERE id=? AND deleted_at IS NULL").get(id)) return null;
  db.prepare("UPDATE storage SET deleted_at=?,updated_at=?,rev=rev+1 WHERE id=?").run(ts, ts, id);
  const removedTagMappings = replaceTags(api, id, [], origin, ts);
  logChange(db, "storage", id, "delete", origin, ts);
  return { removedTagMappings };
}

export function bulkDelete(api, args, origin) {
  if (!Array.isArray(args.ids)) throw new Error("ids 必填，必须是数组");
  if (args.ids.length > 500) throw new Error("ids 最多500项");
  const ids = [...new Set(args.ids.map((id) => {
    if ((typeof id !== "string" && typeof id !== "number") ||
        (typeof id === "number" && !Number.isFinite(id)) || !String(id).trim())
      throw new Error("ids 只能包含非空字符串或有限数值 id");
    return String(id).trim();
  }))];
  const result = tx(api.db, () => {
    const deletedIds = [], ts = now();
    for (const id of ids) if (deleteRow(api, id, origin, ts)) deletedIds.push(id);
    return { deleted: deletedIds.length, skipped: ids.length - deletedIds.length, ids: deletedIds };
  });
  if (result.deleted) api.emit("storage-changed", { ids: result.ids, op: "delete" });
  return result;
}
