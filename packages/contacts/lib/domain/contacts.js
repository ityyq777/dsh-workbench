/** 联系人域：本地联系人、分组、多值字段与 vCard 3.0 导入导出。 */
import { contactRow, groupRow, newId, now } from "../db/db.js";

const FIELD_KINDS = new Set(["email", "phone", "im", "url", "other"]);
function bad(msg) { const e = new Error(msg); e.status = 400; return e; }
function plain(v) { return v && typeof v === "object" && !Array.isArray(v); }
function str(v, max) { return String(v == null ? "" : v).trim().slice(0, max); }

function parseFields(input) {
  if (!Array.isArray(input)) return [];
  return input.slice(0, 30).map((f, i) => {
    if (!plain(f)) throw bad("fields 必须是对象数组");
    const kind = str(f.kind, 20) || "email";
    if (!FIELD_KINDS.has(kind)) throw bad("未知字段类型：" + kind);
    const value = str(f.value, 500);
    if (!value) throw bad("字段值不能为空");
    return { kind, label: str(f.label, 40), value, primary: f.primary ? 1 : 0, sort: i };
  });
}

function parseGroups(input) {
  return Array.isArray(input) ? [...new Set(input.map((x) => String(x || "")).filter(Boolean))].slice(0, 50) : [];
}

function escapeLike(q) { return String(q).replace(/[\\%_]/g, "\\$&"); }

export function createContacts({ db, host, log = () => {} }) {
  function loadFields(id) {
    return db.prepare("SELECT id,kind,label,value,primary_flag,sort FROM contact_field WHERE contact_id=? ORDER BY sort,rowid").all(id).map((r) => ({ id: r.id, kind: r.kind, label: r.label, value: r.value, primary: !!r.primary_flag }));
  }
  function loadGroups(id) {
    return db.prepare("SELECT g.id,g.name,g.color FROM contact_group_member m JOIN contact_group g ON g.id=m.group_id WHERE m.contact_id=? AND g.deleted_at IS NULL ORDER BY g.name").all(id).map(groupRow);
  }
  function one(id) {
    const row = db.prepare("SELECT * FROM contact WHERE id=? AND deleted_at IS NULL").get(String(id || ""));
    if (!row) return null;
    return Object.assign(contactRow(row), { fields: loadFields(row.id), groups: loadGroups(row.id) });
  }
  function list(input = {}) {
    const q = str(input.q, 100);
    const limit = Math.max(1, Math.min(200, Number(input.limit) || 50));
    const offset = Math.max(0, Number(input.offset) || 0);
    let rows;
    if (input.groupId) {
      rows = db.prepare("SELECT c.* FROM contact c JOIN contact_group_member m ON m.contact_id=c.id WHERE c.deleted_at IS NULL AND m.group_id=? ORDER BY c.name LIMIT ? OFFSET ?").all(String(input.groupId), limit, offset);
    } else if (q) {
      const like = "%" + escapeLike(q) + "%";
      rows = db.prepare("SELECT DISTINCT c.* FROM contact c LEFT JOIN contact_field f ON f.contact_id=c.id WHERE c.deleted_at IS NULL AND (c.name LIKE ? ESCAPE '\\' OR c.org LIKE ? ESCAPE '\\' OR f.value LIKE ? ESCAPE '\\') ORDER BY c.name LIMIT ? OFFSET ?").all(like, like, like, limit, offset);
    } else {
      rows = db.prepare("SELECT * FROM contact WHERE deleted_at IS NULL ORDER BY name LIMIT ? OFFSET ?").all(limit, offset);
    }
    return { items: rows.map((r) => Object.assign(contactRow(r), { fields: loadFields(r.id), groups: loadGroups(r.id) })) };
  }
  function writeFields(id, fields) {
    db.prepare("DELETE FROM contact_field WHERE contact_id=?").run(id);
    const stmt = db.prepare("INSERT INTO contact_field(id,contact_id,kind,label,value,primary_flag,sort) VALUES(?,?,?,?,?,?,?)");
    for (const f of fields) stmt.run(newId("cf"), id, f.kind, f.label, f.value, f.primary, f.sort);
  }
  function writeGroups(id, groupIds) {
    db.prepare("DELETE FROM contact_group_member WHERE contact_id=?").run(id);
    const stmt = db.prepare("INSERT OR IGNORE INTO contact_group_member(id,group_id,contact_id,created_at) VALUES(?,?,?,?)");
    for (const g of groupIds) if (db.prepare("SELECT id FROM contact_group WHERE id=? AND deleted_at IS NULL").get(g)) stmt.run(newId("cgm"), g, id, now());
  }
  function create(input) {
    const data = plain(input) ? input : {};
    const name = str(data.name, 120);
    if (!name) throw bad("联系人姓名不能为空");
    const fields = parseFields(data.fields);
    const groups = parseGroups(data.groups);
    const id = newId("ct");
    const ts = now();
    db.exec("BEGIN");
    try {
      db.prepare("INSERT INTO contact(id,name,org,title,note,birthday,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?)").run(id, name, str(data.org, 120), str(data.title, 120), str(data.note, 4000), str(data.birthday, 10), ts, ts);
      writeFields(id, fields); writeGroups(id, groups);
      db.exec("COMMIT");
    } catch (e) { db.exec("ROLLBACK"); throw e; }
    return one(id);
  }
  function update(input) {
    const data = plain(input) ? input : {};
    const existing = one(data.id);
    if (!existing) throw bad("联系人不存在");
    const name = data.name === undefined ? existing.name : str(data.name, 120);
    if (!name) throw bad("联系人姓名不能为空");
    const ts = now();
    db.exec("BEGIN");
    try {
      db.prepare("UPDATE contact SET name=?,org=?,title=?,note=?,birthday=?,updated_at=?,rev=rev+1 WHERE id=?").run(
        name,
        data.org === undefined ? existing.org : str(data.org, 120),
        data.title === undefined ? existing.title : str(data.title, 120),
        data.note === undefined ? existing.note : str(data.note, 4000),
        data.birthday === undefined ? existing.birthday : str(data.birthday, 10),
        ts, existing.id,
      );
      if (data.fields !== undefined) writeFields(existing.id, parseFields(data.fields));
      if (data.groups !== undefined) writeGroups(existing.id, parseGroups(data.groups));
      db.exec("COMMIT");
    } catch (e) { db.exec("ROLLBACK"); throw e; }
    return one(existing.id);
  }
  function remove(id) {
    const existing = one(id);
    if (!existing) throw bad("联系人不存在");
    db.prepare("UPDATE contact SET deleted_at=?, updated_at=?, rev=rev+1 WHERE id=?").run(now(), now(), existing.id);
    return { id: existing.id, deleted: true };
  }
  function groups() {
    const rows = db.prepare("SELECT * FROM contact_group WHERE deleted_at IS NULL ORDER BY name").all();
    return rows.map((r) => Object.assign(groupRow(r), { count: db.prepare("SELECT COUNT(*) AS n FROM contact_group_member m JOIN contact c ON c.id=m.contact_id WHERE m.group_id=? AND c.deleted_at IS NULL").get(r.id).n }));
  }
  function createGroup(input) {
    const name = str(input && input.name, 80);
    if (!name) throw bad("分组名称不能为空");
    const id = newId("cg");
    const ts = now();
    db.prepare("INSERT INTO contact_group(id,name,color,created_at,updated_at) VALUES(?,?,?,?,?)").run(id, name, str(input.color, 20), ts, ts);
    return groupRow(db.prepare("SELECT * FROM contact_group WHERE id=?").get(id));
  }
  function deleteGroup(id) {
    const row = db.prepare("SELECT * FROM contact_group WHERE id=? AND deleted_at IS NULL").get(String(id || ""));
    if (!row) throw bad("分组不存在");
    db.prepare("UPDATE contact_group SET deleted_at=?, updated_at=? WHERE id=?").run(now(), now(), row.id);
    return { id: row.id, deleted: true };
  }
  function stats() {
    return { contacts: db.prepare("SELECT COUNT(*) AS n FROM contact WHERE deleted_at IS NULL").get().n, groups: groups().length, fields: db.prepare("SELECT COUNT(*) AS n FROM contact_field").get().n };
  }
  function search(q, { limit = 20 } = {}) {
    const text = str(q, 100);
    if (!text) return [];
    return list({ q: text, limit }).items.map((c) => ({ id: c.id, title: c.name, snippet: [c.org, c.title, ...c.fields.map((f) => f.value)].filter(Boolean).join(" · ").slice(0, 160), view: "contacts", at: c.updatedAt }));
  }

  // ── vCard 3.0 ──
  function parseVcf(text) {
    const raw = String(text || "").replace(/\r\n/g, "\n").replace(/\n[ \t]/g, "");
    const cards = raw.split(/BEGIN:VCARD/i).slice(1);
    const out = [];
    for (const card of cards) {
      const body = card.split(/END:VCARD/i)[0];
      const c = { name: "", org: "", title: "", note: "", fields: [] };
      for (const line of body.split("\n")) {
        const idx = line.indexOf(":");
        if (idx < 0) continue;
        const head = line.slice(0, idx);
        const value = line.slice(idx + 1).replace(/\\n/g, "\n").replace(/\\,/g, ",").trim();
        const prop = head.split(";")[0].toUpperCase();
        if (prop === "FN") c.name = value;
        else if (prop === "N" && !c.name) c.name = value.split(";").filter(Boolean).slice(1, 2).concat(value.split(";")[0]).filter(Boolean).join(" ") || value;
        else if (prop === "ORG") c.org = value.split(";")[0];
        else if (prop === "TITLE") c.title = value;
        else if (prop === "NOTE") c.note = value;
        else if (prop === "EMAIL") c.fields.push({ kind: "email", value });
        else if (prop === "TEL") c.fields.push({ kind: "phone", value });
        else if (prop === "URL") c.fields.push({ kind: "url", value });
      }
      if (c.name && c.fields.length) out.push(c);
    }
    return out;
  }
  function importVcf(text) {
    const cards = parseVcf(text).slice(0, 500);
    let imported = 0, skipped = 0;
    for (const c of cards) {
      try { create(c); imported += 1; } catch { skipped += 1; }
    }
    return { imported, skipped };
  }
  function exportVcf(ids) {
    const rows = Array.isArray(ids) && ids.length ? ids.map(one).filter(Boolean) : list({ limit: 200 }).items;
    const lines = [];
    for (const c of rows) {
      lines.push("BEGIN:VCARD", "VERSION:3.0", "FN:" + c.name);
      if (c.org) lines.push("ORG:" + c.org);
      if (c.title) lines.push("TITLE:" + c.title);
      for (const f of c.fields) lines.push((f.kind === "email" ? "EMAIL" : f.kind === "phone" ? "TEL" : f.kind === "url" ? "URL" : "X-" + f.kind.toUpperCase()) + ":" + f.value);
      if (c.note) lines.push("NOTE:" + c.note.replace(/\n/g, "\\n"));
      lines.push("END:VCARD");
    }
    return { vcf: lines.join("\r\n"), count: rows.length };
  }

  return { list, one, create, update, remove, groups, createGroup, deleteGroup, stats, search, importVcf, exportVcf, parseVcf };
}
