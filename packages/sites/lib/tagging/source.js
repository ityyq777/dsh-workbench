/**
 * 标签来源（`tag_mapping.item_type`）的业务侧适配。
 *
 * 契约见 `docs/specs/25-标签域解耦审计与改造.md`「6. 来源注册与映射写入门禁」：
 *  - 标签域（`wb-addon-tags` ≥ 1.7.1）用 `tag_source` 登记「哪个插件在用哪个 item_type」，
 *    并在 `tag_mapping` 上装触发器：来源未注册（0 条）或重复（≥2 条）时拒绝一切写入；
 *  - 业务域负责启动时幂等登记自己的来源，写入前先判、写入异常时翻成统一可读文案。
 *
 * 标签域未安装或版本过低（没有 `tag_source` 表）时整块跳过，保持既有降级行为。
 */
import { now, newId, tableExists } from "../db/db.js";

export const TAG_SOURCE = "site";
export const TAG_SOURCE_OWNER = "wb-addon-sites";
export const TAG_SOURCE_TITLE = "站点";

function coded(code, message) {
  return Object.assign(new Error(message), { code: code });
}

/** 该来源的活跃注册行；没有 `tag_source` 表时返回空数组。 */
export function tagSourceRows(db, source) {
  if (!tableExists(db, "tag_source")) return [];
  return db
    .prepare("SELECT * FROM tag_source WHERE source=? AND deleted_at IS NULL ORDER BY created_at ASC, id ASC")
    .all(String(source));
}

/** 恰好 1 条活跃注册才算 ready；`missing` 表示标签域还没建 `tag_source`（老版本），此时不做门禁。 */
export function tagSourceReady(db, source) {
  if (!tableExists(db, "tag_source")) return { ok: false, missing: true, count: 0, owners: [] };
  const rows = tagSourceRows(db, source);
  return {
    ok: rows.length === 1,
    missing: false,
    count: rows.length,
    owners: rows.map(function (r) { return String(r.owner); }),
  };
}

/** 幂等登记本域来源；`tag_source` 不存在时跳过（老标签插件不认识来源注册）。 */
export function ensureTagSource(db, source, owner, title) {
  if (!tableExists(db, "tag_source")) return { ok: false, missing: true, created: false };
  const src = String(source === undefined || source === null ? "" : source).trim();
  const own = String(owner === undefined || owner === null ? "" : owner).trim();
  if (!src || !own) return { ok: false, created: false };
  const hit = db.prepare("SELECT id FROM tag_source WHERE source=? AND owner=? AND deleted_at IS NULL").get(src, own);
  if (hit) return { ok: true, created: false, id: String(hit.id) };
  const ts = now();
  const id = newId();
  db.prepare(
    "INSERT INTO tag_source(id,source,owner,title,created_at,updated_at,deleted_at,rev) VALUES(?,?,?,?,?,?,NULL,1)",
  ).run(id, src, own, String(title || ""), ts, ts);
  return { ok: true, created: true, id: id };
}

/** 按当前注册状态给出统一错误：0 条 = 未注册，≥2 条 = 标识重复。 */
export function tagSourceError(db, source) {
  const state = tagSourceReady(db, source);
  if (state.count === 0) {
    return coded(
      "TAG_SOURCE_UNREGISTERED",
      "标签来源未注册，无法操作（来源：" + source + "）；先调用 tags.registerSource 注册该来源",
    );
  }
  return coded(
    "TAG_SOURCE_DUPLICATED",
    "标签来源标识重复，无法操作（来源：" + source + "；归属：" + state.owners.join("、") +
      "）；请先清理 tag_source 中的重复注册",
  );
}

/**
 * 写入 `tag_mapping` 的统一入口：先判门禁，执行中触发器的原始错误翻成统一文案。
 * `source` 省略时用本域默认来源。注册由启动时的 `ensureXxxTagSource` 负责，这里不补登记——
 * 否则「被人工注销」会被静默覆盖，门禁也就失效了。
 */
export function withTagSource(db, source, fn) {
  const src = String(source || TAG_SOURCE);
  // 先判后写：注册由启动时 ensureXxxTagSource 负责，这里只判定，不替调用方补登记。
  if (!tagSourceReady(db, src).ok && !tagSourceReady(db, src).missing) throw tagSourceError(db, src);
  try {
    return fn();
  } catch (e) {
    const msg = String((e && e.message) || "");
    if (msg.indexOf("标签来源") >= 0) throw tagSourceError(db, src);
    throw e;
  }
}
