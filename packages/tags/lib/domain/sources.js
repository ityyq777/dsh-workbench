/**
 * 标签域：业务对象「来源注册」（tag_source）与 tag_mapping 写入门禁。
 *
 * 契约（docs/specs/25-标签域解耦审计与改造.md 「来源注册契约」）：
 *  - tag_mapping.item_type 必须先由使用方注册，同一 source 只能有**一个**活跃归属；
 *  - 注册不抛错：重复来源照样写入，但回执带 conflict/conflicts/message，由调用方决定怎么处理；
 *  - 写入门禁落在库层（BEFORE INSERT/UPDATE 触发器）：即使业务插件绕过 action 直接写 SQL
 *    也会被 ABORT；action 层（tags.link / tags.unlink）在此之前先给出结构化错误码；
 *  - tag_source 只存在本机 meta 库，不参与同步与备份（与工作区配置一致）。
 */

import { MAPPING_TABLE, now, newId, tx, tableExists } from "../db/db.js";

export const SOURCE_TABLE = "tag_source";

const MAX_SOURCE = 32;
const MAX_OWNER = 64;
const IDENT = /^[A-Za-z0-9][A-Za-z0-9_.:-]*$/;

/** 内置来源：本插件 seed 一次；业务插件也会在自己的 ensureSchema 里幂等补登记。 */
export const BUILTIN_SOURCES = [
  { source: "task", owner: "wb-addon-tasks", title: "任务" },
  { source: "storage", owner: "wb-addon-storage", title: "储物" },
  { source: "site", owner: "wb-addon-sites", title: "站点" },
];

export const SOURCE_TABLE_DDL = [
  "CREATE TABLE IF NOT EXISTS tag_source (" +
    "id TEXT PRIMARY KEY," +
    "source TEXT NOT NULL," +
    "owner TEXT NOT NULL," +
    "title TEXT," +
    "created_at INTEGER NOT NULL," +
    "updated_at INTEGER NOT NULL," +
    "deleted_at INTEGER," +
    "rev INTEGER NOT NULL DEFAULT 1" +
    ");",
];

export const SOURCE_INDEX_DDL = [
  "CREATE UNIQUE INDEX IF NOT EXISTS uk_tag_source ON tag_source(source, owner) WHERE deleted_at IS NULL;",
  "CREATE INDEX IF NOT EXISTS idx_tag_source_source ON tag_source(source) WHERE deleted_at IS NULL;",
];

/**
 * 写入门禁：同一个 item_type 必须恰好有一条活跃注册行。
 * 0 条 = 未注册；≥2 条 = 来源标识重复（同一个 source 被两个 owner 抢）。
 * 用 ABORT 让整条语句（含外层事务）回滚，错误信息带来源标识，便于上层翻成可读文案。
 */
export const SOURCE_TRIGGER_DDL = [
  "DROP TRIGGER IF EXISTS trg_tag_mapping_source_ins;",
  "DROP TRIGGER IF EXISTS trg_tag_mapping_source_upd;",
  "CREATE TRIGGER trg_tag_mapping_source_ins BEFORE INSERT ON tag_mapping " +
    "WHEN (SELECT COUNT(*) FROM tag_source WHERE source=NEW.item_type AND deleted_at IS NULL) <> 1 " +
    "BEGIN SELECT RAISE(ABORT, '标签来源未注册或重复，无法操作：' || NEW.item_type); END;",
  "CREATE TRIGGER trg_tag_mapping_source_upd BEFORE UPDATE ON tag_mapping " +
    "WHEN (SELECT COUNT(*) FROM tag_source WHERE source=NEW.item_type AND deleted_at IS NULL) <> 1 " +
    "BEGIN SELECT RAISE(ABORT, '标签来源未注册或重复，无法操作：' || NEW.item_type); END;",
];

function coded(code, message) {
  return Object.assign(new Error(message), { code: code });
}

function sourceArg(args) {
  const raw = args && args.source !== undefined && args.source !== null ? args.source : args && args.itemType;
  const source = String(raw === undefined || raw === null ? "" : raw).trim();
  if (!source) throw new Error("source 不能为空");
  if (source.length > MAX_SOURCE) throw new Error("source 不能超过 " + MAX_SOURCE + " 个字符");
  if (!IDENT.test(source)) throw new Error("source 只能是字母数字与 _ . : - 组成的标识符：" + source);
  return source;
}

function ownerArg(args) {
  const owner = String(args && args.owner !== undefined && args.owner !== null ? args.owner : "").trim();
  if (!owner) throw new Error("owner 不能为空");
  if (owner.length > MAX_OWNER) throw new Error("owner 不能超过 " + MAX_OWNER + " 个字符");
  if (!IDENT.test(owner)) throw new Error("owner 只能是字母数字与 _ . : - 组成的标识符：" + owner);
  return owner;
}

function rowSource(row) {
  return {
    id: String(row.id),
    source: String(row.source),
    owner: String(row.owner),
    title: String(row.title || ""),
    createdAt: Number(row.created_at || 0),
    updatedAt: Number(row.updated_at || 0),
  };
}

export function hasSourceTable(db) {
  return tableExists(db, SOURCE_TABLE);
}

/** 某个 source 的活跃注册行（按创建时间升序）。表不存在时返回空数组。 */
export function sourceRows(db, source) {
  if (!hasSourceTable(db)) return [];
  return db
    .prepare("SELECT * FROM tag_source WHERE source=? AND deleted_at IS NULL ORDER BY created_at ASC, id ASC")
    .all(String(source));
}

/**
 * 写入前门禁（action 层）：返回 {ok, row} 或抛带 code 的错误。
 * 标签域表还没建（只装了业务插件的老库）时不拦，保持既有行为。
 */
export function sourceGate(db, source) {
  if (!hasSourceTable(db)) return { ok: true, skipped: "no_table", row: null };
  const rows = sourceRows(db, source);
  if (!rows.length) {
    throw coded(
      "TAG_SOURCE_UNREGISTERED",
      "标签来源未注册，无法操作（来源：" + source + "）；先调用 tags.registerSource 注册该来源",
    );
  }
  if (rows.length > 1) {
    const owners = rows.map(function (r) {
      return String(r.owner);
    });
    throw coded(
      "TAG_SOURCE_DUPLICATED",
      "标签来源标识重复，无法操作（来源：" + source + "；归属：" + owners.join("、") + "）；请先清理 tag_source 中的重复注册",
    );
  }
  return { ok: true, row: rows[0] };
}

/** 幂等补一条来源行（业务插件 ensureSchema / 备份导入用）。表不存在则跳过。 */
export function ensureSourceRow(db, source, owner, title) {
  if (!hasSourceTable(db)) return { ok: false, missing: true, created: false };
  const src = String(source || "").trim();
  const own = String(owner || "").trim();
  if (!src || !own) return { ok: false, created: false };
  const hit = db
    .prepare("SELECT id FROM tag_source WHERE source=? AND owner=? AND deleted_at IS NULL")
    .get(src, own);
  if (hit) return { ok: true, created: false, id: String(hit.id) };
  const ts = now();
  const id = newId();
  db.prepare(
    "INSERT INTO tag_source(id,source,owner,title,created_at,updated_at,deleted_at,rev) VALUES(?,?,?,?,?,?,NULL,1)",
  ).run(id, src, own, String(title || ""), ts, ts);
  return { ok: true, created: true, id: id };
}

/**
 * 确保 source 至少有一条活跃注册：已有任意活跃行就跳过（不覆盖人工行）。
 * 备份导入旧数据时用，避免触发器把「历史 item_type」整批拦掉。
 */
export function ensureSourceRegistered(db, source, title) {
  if (!hasSourceTable(db)) return { ok: false, missing: true, created: false };
  const src = String(source === undefined || source === null ? "" : source).trim();
  if (!src) return { ok: false, created: false };
  if (sourceRows(db, src).length) return { ok: true, created: false };
  return ensureSourceRow(db, src, "legacy", title || "");
}

/** 老库兜底：既有 tag_mapping 里出现、但没有活跃注册的 item_type 补一行 owner='legacy'。 */
export function backfillLegacySources(db, log) {
  const logger = typeof log === "function" ? log : function () {};
  if (!hasSourceTable(db) || !tableExists(db, MAPPING_TABLE)) return { added: 0 };
  const rows = db.prepare("SELECT DISTINCT item_type FROM tag_mapping").all();
  const ts = now();
  let added = 0;
  for (const row of rows) {
    const type = String(row.item_type === undefined || row.item_type === null ? "" : row.item_type).trim();
    if (!type || type.length > MAX_SOURCE) continue;
    if (sourceRows(db, type).length) continue;
    try {
      db.prepare(
        "INSERT INTO tag_source(id,source,owner,title,created_at,updated_at,deleted_at,rev) VALUES(?,?,?,?,?,?,NULL,1)",
      ).run(newId(), type, "legacy", "", ts, ts);
      added += 1;
    } catch (e) {
      logger("tag addon: 补登 legacy 来源失败（" + type + "）：" + String((e && e.message) || e));
    }
  }
  if (added) logger("tag addon: 已为 " + added + " 个既有映射对象类型补登 legacy 来源");
  return { added: added };
}

/** 建表 + seed 内置来源 + legacy 兜底 + 写入门禁触发器；幂等，可每次启动跑。 */
export function ensureSourceSchema(db, log) {
  const logger = typeof log === "function" ? log : function () {};
  for (const sql of SOURCE_TABLE_DDL) db.exec(sql);
  for (const sql of SOURCE_INDEX_DDL) {
    try {
      db.exec(sql);
    } catch (e) {
      logger("tag addon: 来源表索引创建失败：" + String((e && e.message) || e));
    }
  }
  for (const item of BUILTIN_SOURCES) {
    try {
      ensureSourceRow(db, item.source, item.owner, item.title);
    } catch (e) {
      logger("tag addon: 内置来源登记失败（" + item.source + "）：" + String((e && e.message) || e));
    }
  }
  backfillLegacySources(db, logger);
  for (const sql of SOURCE_TRIGGER_DDL) {
    try {
      db.exec(sql);
    } catch (e) {
      logger("tag addon: 映射写入门禁触发器创建失败：" + String((e && e.message) || e));
    }
  }
}

/**
 * 注册来源：幂等；重复来源**不抛错**，照常写入并在回执里给出 conflict/conflicts/message。
 */
export function registerSource(db, args, origin, api) {
  ensureSourceSchema(db, api && api.log);
  const source = sourceArg(args);
  const owner = ownerArg(args);
  const rawTitle = args && args.title !== undefined && args.title !== null ? args.title : "";
  const title = String(rawTitle).trim().slice(0, 64);
  const before = sourceRows(db, source);
  const self = before.filter(function (r) {
    return String(r.owner) === owner;
  })[0];
  let created = false;
  if (!self) {
    const ts = now();
    db.prepare(
      "INSERT INTO tag_source(id,source,owner,title,created_at,updated_at,deleted_at,rev) VALUES(?,?,?,?,?,?,NULL,1)",
    ).run(newId(), source, owner, title, ts, ts);
    created = true;
  }
  const rows = sourceRows(db, source);
  const conflicts = rows
    .filter(function (r) {
      return String(r.owner) !== owner;
    })
    .map(rowSource);
  const result = {
    ok: true,
    source: source,
    owner: owner,
    created: created,
    existing: !created,
    conflict: conflicts.length > 0,
    conflicts: conflicts,
    sources: rows.map(rowSource),
  };
  if (conflicts.length) {
    const owners = rows.map(function (r) {
      return String(r.owner);
    });
    result.message =
      "来源标识重复：" + source + "（" + owners.join("、") + "），相关 CRUD 会被拒绝；先清理 tag_source 中的重复注册";
  }
  if (created && api && typeof api.emit === "function") {
    api.emit("tag-sources-changed", { op: "register", source: source, owner: owner });
  }
  return result;
}

/** 注销来源：省略 owner 时注销该 source 的全部活跃行；仍有未删除映射时拒绝。 */
export function unregisterSource(db, args, origin, api) {
  ensureSourceSchema(db, api && api.log);
  const source = sourceArg(args);
  const owner = args && args.owner !== undefined && args.owner !== null && String(args.owner).trim() ? ownerArg(args) : "";
  const rows = sourceRows(db, source).filter(function (r) {
    return !owner || String(r.owner) === owner;
  });
  const remaining = sourceRows(db, source).map(rowSource);
  if (!rows.length) {
    return { ok: true, source: source, removed: 0, missing: true, sources: remaining };
  }
  let live = 0;
  if (tableExists(db, MAPPING_TABLE)) {
    const hit = db
      .prepare("SELECT COUNT(*) AS n FROM tag_mapping WHERE item_type=? AND deleted_at IS NULL")
      .get(source);
    live = Number((hit && hit.n) || 0);
  }
  if (live > 0) {
    throw coded(
      "TAG_SOURCE_IN_USE",
      "来源 " + source + " 仍有 " + live + " 条标签关联，先解除关联再注销",
    );
  }
  const ts = now();
  tx(db, function () {
    for (const row of rows) {
      db.prepare("UPDATE tag_source SET deleted_at=?, updated_at=?, rev=rev+1 WHERE id=?").run(ts, ts, String(row.id));
    }
  });
  if (api && typeof api.emit === "function") {
    api.emit("tag-sources-changed", { op: "unregister", source: source, owner: owner, removed: rows.length });
  }
  return {
    ok: true,
    source: source,
    removed: rows.length,
    missing: false,
    sources: sourceRows(db, source).map(rowSource),
  };
}

/**
 * 来源总览：每个 source 一行，带 conflict（同 source 多个 owner）、registered、mappings（未删除映射数）。
 * 未注册但仍有映射的 item_type 也列出来（registered=false），方便定位「谁在乱写」。
 */
export function listSources(db) {
  const counts = new Map();
  if (tableExists(db, MAPPING_TABLE)) {
    const rows = db
      .prepare("SELECT item_type, COUNT(*) AS n FROM tag_mapping WHERE deleted_at IS NULL GROUP BY item_type")
      .all();
    for (const row of rows) counts.set(String(row.item_type), Number(row.n || 0));
  }
  const grouped = new Map();
  if (hasSourceTable(db)) {
    const rows = db
      .prepare("SELECT * FROM tag_source WHERE deleted_at IS NULL ORDER BY source ASC, created_at ASC, id ASC")
      .all();
    for (const row of rows) {
      const source = String(row.source);
      if (!grouped.has(source)) grouped.set(source, []);
      grouped.get(source).push(rowSource(row));
    }
  }
  const names = new Set([...grouped.keys(), ...counts.keys()]);
  const sources = [];
  for (const source of Array.from(names).sort()) {
    const owners = grouped.get(source) || [];
    sources.push({
      source: source,
      registered: owners.length === 1,
      conflict: owners.length > 1,
      owners: owners,
      mappings: counts.get(source) || 0,
    });
  }
  const conflicts = sources
    .filter(function (s) {
      return s.conflict;
    })
    .map(function (s) {
      return s.source;
    });
  const unregistered = sources
    .filter(function (s) {
      return s.owners.length === 0;
    })
    .map(function (s) {
      return s.source;
    });
  return {
    table: hasSourceTable(db),
    total: sources.length,
    sources: sources,
    conflicts: conflicts,
    unregistered: unregistered,
    mappings: Array.from(counts.values()).reduce(function (a, b) {
      return a + b;
    }, 0),
  };
}

function renderSources(result) {
  const r = result || {};
  const rows = Array.isArray(r.sources) ? r.sources : [];
  if (!rows.length) return "还没有任何来源注册";
  const lines = ["来源：" + rows.length + " 个" + (r.conflicts && r.conflicts.length ? "（重复：" + r.conflicts.join("、") + "）" : "")];
  for (const item of rows) {
    const owners = item.owners.map(function (o) {
      return o.owner;
    });
    const mark = item.conflict ? "重复" : item.registered ? "正常" : "未注册";
    lines.push("- " + item.source + " | " + mark + " | " + (owners.length ? owners.join("、") : "—") + " | 映射 " + item.mappings);
  }
  return lines.join("\n");
}

export function registerSourceActions(api) {
  const action = api.action;

  action("tags.registerSource", {
    description:
      "注册业务对象来源（tag_mapping.item_type）：幂等；同一 source 已有其他 owner 时不报错，回执带 conflict:true 与 conflicts，此时该来源的标签映射 CRUD 会被拒绝",
    input: {
      type: "object",
      required: ["source", "owner"],
      properties: {
        source: { type: "string", description: "来源标识（= tag_mapping.item_type），如 task / storage / site；字母数字与 _ . : - 组成，≤32 字符" },
        owner: { type: "string", description: "归属插件 id，如 wb-addon-tasks；≤64 字符" },
        title: { type: "string", description: "可选展示名" },
      },
    },
    examples: [{ source: "task", owner: "wb-addon-tasks", title: "任务" }],
    execute: function (args, ctx) {
      return registerSource(api.db, args || {}, (ctx && ctx.origin) || "ui", api);
    },
    render: function (r) {
      if (r && r.conflict) return r.message;
      return r && r.created ? "已注册来源：" + r.source + "（" + r.owner + "）" : "来源已注册：" + r.source + "（" + r.owner + "）";
    },
  });

  action("tags.unregisterSource", {
    description: "注销来源注册（软删）：省略 owner 时注销该 source 的全部活跃行；该来源仍有未删除标签关联时拒绝，返回 TAG_SOURCE_IN_USE",
    input: {
      type: "object",
      required: ["source"],
      properties: {
        source: { type: "string", description: "来源标识（= tag_mapping.item_type）" },
        owner: { type: "string", description: "只注销某个归属；省略则注销该来源全部活跃行" },
      },
    },
    examples: [{ source: "legacy", owner: "legacy" }],
    execute: function (args, ctx) {
      return unregisterSource(api.db, args || {}, (ctx && ctx.origin) || "ui", api);
    },
    render: function (r) {
      if (!r) return "未注销";
      if (r.missing) return "没有匹配的活跃来源：" + r.source;
      return "已注销来源：" + r.source + "（" + r.removed + " 条）";
    },
  });

  action("tags.sources", {
    description:
      "列出全部来源注册：每个 source 给出 registered / conflict / owners / 未删除映射数；未注册但仍有映射的 item_type 也会列出，便于定位违规写入",
    input: { type: "object", properties: {} },
    execute: function () {
      return listSources(api.db);
    },
    render: renderSources,
  });
}
