/**
 * 凭据分组与业务对象关联：vault 持有引用，业务插件用自身标识注册绑定。
 * 不碰密文；subject_id 由调用方负责，vault 不校验业务对象是否存在。
 */
import { bindingRow, groupRow, newId, now, tx } from "../db/db.js";
import { createSets } from "./sets.js";

function parseJson(value, fallback) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function assertGroupName(name) {
  const value = String(name || "").trim();
  if (!value || value.length > 60) throw new Error("组名必填，最多 60 字");
  return value;
}

function assertSubjectType(type) {
  const value = String(type || "").trim();
  if (!/^[a-z][a-z0-9_-]{1,39}$/.test(value)) throw new Error("subjectType 必须是 2–40 位小写标识");
  return value;
}

function assertSubjectId(id) {
  const value = String(id || "").trim();
  if (!value || value.length > 120) throw new Error("subjectId 必填，最多 120 字");
  return value;
}

export function createGroups({ db }) {
  const sets = createSets({ db });
  function groupOrThrow(id) {
    const row = db.prepare("SELECT * FROM vault_group WHERE id = ? AND deleted_at IS NULL").get(String(id || ""));
    if (!row) throw new Error("分组不存在：" + id);
    return row;
  }

  function groupList(args = {}) {
    const q = String(args.q || "").trim();
    const where = ["deleted_at IS NULL"];
    const params = [];
    if (q) {
      where.push("(name LIKE ? OR description LIKE ?)");
      params.push("%" + q + "%", "%" + q + "%");
    }
    const rows = db
      .prepare("SELECT * FROM vault_group WHERE " + where.join(" AND ") + " ORDER BY name COLLATE NOCASE")
      .all(...params);
    const items = rows.map((row) => {
      const secretCount = Number(
        db
          .prepare(
            "SELECT COUNT(DISTINCT k.id) AS n FROM vault_secret k " +
              "JOIN vault_set_secret ss ON ss.secret_id = k.id AND ss.deleted_at IS NULL " +
              "JOIN vault_group_set gs ON gs.set_id = ss.set_id AND gs.deleted_at IS NULL " +
              "WHERE gs.group_id = ? AND k.deleted_at IS NULL",
          )
          .get(row.id)?.n || 0,
      );
      const setCount = sets.setsOfGroup(row.id).length;
      const bindingCount = Number(
        db.prepare("SELECT COUNT(*) AS n FROM vault_binding WHERE group_id = ? AND deleted_at IS NULL").get(row.id)?.n || 0,
      );
      return { ...groupRow(row), secretCount, setCount, bindingCount };
    });
    return { items };
  }

  function groupCreate(args = {}) {
    const name = assertGroupName(args.name);
    const description = String(args.description || "").slice(0, 200);
    const color = args.color ? String(args.color).slice(0, 20) : null;
    const id = newId("grp");
    const ts = now();
    try {
      db.prepare(
        "INSERT INTO vault_group(id, name, description, color, created_at, updated_at, rev) VALUES(?, ?, ?, ?, ?, ?, 1)",
      ).run(id, name, description, color, ts, ts);
    } catch (error) {
      const msg = String(error && error.message);
      if (msg.includes("UNIQUE")) throw new Error("已有同名分组：" + name);
      throw error;
    }
    return { id, ok: true };
  }

  function groupUpdate(args = {}) {
    const row = groupOrThrow(args.id);
    const name = args.name == null ? row.name : assertGroupName(args.name);
    const description = args.description == null ? row.description : String(args.description).slice(0, 200);
    const color = args.color === undefined ? row.color : args.color ? String(args.color).slice(0, 20) : null;
    try {
      db.prepare(
        "UPDATE vault_group SET name = ?, description = ?, color = ?, updated_at = ?, rev = rev + 1 WHERE id = ?",
      ).run(name, description, color, now(), row.id);
    } catch (error) {
      const msg = String(error && error.message);
      if (msg.includes("UNIQUE")) throw new Error("已有同名分组：" + name);
      throw error;
    }
    return { ok: true };
  }

  function groupDelete(args = {}) {
    const row = groupOrThrow(args.id);
    const ts = now();
    let moveTo = null;
    if (args.moveTo != null && args.moveTo !== "") {
      const target = groupOrThrow(args.moveTo);
      if (target.id === row.id) throw new Error("不能移动到被删除的分组自身");
      moveTo = target.id;
    }
    tx(db, () => {
      sets.relinkGroup(row.id, moveTo);
      db.prepare(
        "UPDATE vault_binding SET deleted_at = ?, updated_at = ?, rev = rev + 1 WHERE group_id = ? AND deleted_at IS NULL",
      ).run(ts, ts, row.id);
      db.prepare("UPDATE vault_group SET deleted_at = ?, updated_at = ?, rev = rev + 1 WHERE id = ?").run(ts, ts, row.id);
    });
    return { ok: true };
  }

  function subjectRegister(args = {}) {
    const type = assertSubjectType(args.type);
    const title = String(args.title || "").trim().slice(0, 80);
    if (!title) throw new Error("title 必填");
    const description = String(args.description || "").slice(0, 200);
    const ts = now();
    const existing = db.prepare("SELECT id FROM vault_subject_type WHERE type = ?").get(type);
    if (existing) {
      db.prepare(
        "UPDATE vault_subject_type SET title = ?, description = ?, updated_at = ?, rev = rev + 1 WHERE id = ?",
      ).run(title, description, ts, existing.id);
    } else {
      db.prepare(
        "INSERT INTO vault_subject_type(id, type, title, description, updated_at, rev) VALUES(?, ?, ?, ?, ?, 1)",
      ).run(newId("sub"), type, title, description, ts);
    }
    return { ok: true };
  }

  function bind(args = {}) {
    const subjectType = assertSubjectType(args.subjectType);
    const subjectId = assertSubjectId(args.subjectId);
    const groupId = String(args.groupId || "");
    groupOrThrow(groupId);
    const existing = db
      .prepare(
        "SELECT * FROM vault_binding WHERE subject_type = ? AND subject_id = ? AND group_id = ? AND deleted_at IS NULL",
      )
      .get(subjectType, subjectId, groupId);
    if (existing) return { id: existing.id, ok: true, existing: true };
    const ts = now();
    const id = newId("bnd");
    try {
      db.prepare(
        "INSERT INTO vault_binding(id, subject_type, subject_id, group_id, created_at, updated_at, rev) " +
          "VALUES(?, ?, ?, ?, ?, ?, 1)",
      ).run(id, subjectType, subjectId, groupId, ts, ts);
    } catch (error) {
      const msg = String(error && error.message);
      if (msg.includes("UNIQUE")) {
        const row = db
          .prepare("SELECT * FROM vault_binding WHERE subject_type = ? AND subject_id = ? AND group_id = ?")
          .get(subjectType, subjectId, groupId);
        if (row) {
          db.prepare(
            "UPDATE vault_binding SET deleted_at = NULL, updated_at = ?, rev = rev + 1 WHERE id = ?",
          ).run(ts, row.id);
          return { id: row.id, ok: true, existing: true };
        }
      }
      throw error;
    }
    return { id, ok: true };
  }

  function unbind(args = {}) {
    const subjectType = assertSubjectType(args.subjectType);
    const subjectId = assertSubjectId(args.subjectId);
    const groupId = args.groupId == null ? "" : String(args.groupId);
    const ts = now();
    const where = ["subject_type = ?", "subject_id = ?", "deleted_at IS NULL"];
    const params = [subjectType, subjectId];
    if (groupId) {
      where.push("group_id = ?");
      params.push(groupId);
    }
    const info = db
      .prepare("UPDATE vault_binding SET deleted_at = ?, updated_at = ?, rev = rev + 1 WHERE " + where.join(" AND "))
      .run(ts, ts, ...params);
    return { ok: true, removed: Number(info.changes || 0) };
  }

  function bindingsOf(args = {}) {
    const subjectType = assertSubjectType(args.subjectType);
    const subjectId = assertSubjectId(args.subjectId);
    const rows = db
      .prepare(
        "SELECT b.*, g.name AS group_name, g.color AS group_color FROM vault_binding b " +
          "LEFT JOIN vault_group g ON g.id = b.group_id " +
          "WHERE b.subject_type = ? AND b.subject_id = ? AND b.deleted_at IS NULL ORDER BY g.name COLLATE NOCASE",
      )
      .all(subjectType, subjectId);
    return {
      items: rows.map((row) => ({
        ...bindingRow(row),
        groupName: row.group_name || "",
        groupColor: row.group_color || null,
        secretCount: Number(
          db
            .prepare(
              "SELECT COUNT(DISTINCT k.id) AS n FROM vault_secret k " +
                "JOIN vault_set_secret ss ON ss.secret_id = k.id AND ss.deleted_at IS NULL " +
                "JOIN vault_group_set gs ON gs.set_id = ss.set_id AND gs.deleted_at IS NULL " +
                "WHERE gs.group_id = ? AND k.deleted_at IS NULL",
            )
            .get(row.group_id)?.n || 0,
        ),
      })),
    };
  }

  function subjectsOf(args = {}) {
    const groupId = String(args.groupId || "");
    groupOrThrow(groupId);
    const limit = Math.max(1, Math.min(200, Number(args.limit) || 100));
    const offset = Math.max(0, Number(args.offset) || 0);
    const rows = db
      .prepare(
        "SELECT b.subject_type, b.subject_id, t.title FROM vault_binding b " +
          "LEFT JOIN vault_subject_type t ON t.type = b.subject_type " +
          "WHERE b.group_id = ? AND b.deleted_at IS NULL ORDER BY b.updated_at DESC LIMIT ? OFFSET ?",
      )
      .all(groupId, limit, offset);
    return {
      items: rows.map((row) => ({
        subjectType: row.subject_type,
        subjectId: row.subject_id,
        title: row.title || "",
      })),
      limit,
      offset,
    };
  }

  function bindingPurge(args = {}) {
    const subjectType = assertSubjectType(args.subjectType);
    const subjectId = args.subjectId == null ? "" : String(args.subjectId);
    const where = ["subject_type = ?"];
    const params = [subjectType];
    if (subjectId) {
      where.push("subject_id = ?");
      params.push(subjectId);
    }
    const info = db.prepare("DELETE FROM vault_binding WHERE " + where.join(" AND ")).run(...params);
    return { ok: true, removed: Number(info.changes || 0) };
  }

  function subjectSecrets(args = {}) {
    const subjectType = assertSubjectType(args.subjectType);
    const subjectId = assertSubjectId(args.subjectId);
    const rows = db
      .prepare(
        "SELECT DISTINCT s.*, ss.set_id AS set_id FROM vault_secret s " +
          "JOIN vault_set_secret ss ON ss.secret_id = s.id AND ss.deleted_at IS NULL " +
          "JOIN vault_group_set gs ON gs.set_id = ss.set_id AND gs.deleted_at IS NULL " +
          "JOIN vault_binding b ON b.group_id = gs.group_id " +
          "WHERE b.subject_type = ? AND b.subject_id = ? AND b.deleted_at IS NULL AND s.deleted_at IS NULL " +
          "AND gs.group_id = b.group_id ORDER BY s.name COLLATE NOCASE",
      )
      .all(subjectType, subjectId);
    return {
      items: rows.map((row) => ({
        id: row.id,
        name: row.name,
        kind: row.kind,
        setId: row.set_id || null,
        meta: parseJson(row.meta, {}),
      })),
    };
  }

  return {
    groupList,
    groupCreate,
    groupUpdate,
    groupDelete,
    subjectRegister,
    bind,
    unbind,
    bindingsOf,
    subjectsOf,
    bindingPurge,
    subjectSecrets,
  };
}
