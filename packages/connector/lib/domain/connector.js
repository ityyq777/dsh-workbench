/**
 * 连接器核心：来源定义、调度、抓取、去重、投递。
 * 只写自己的四张表；向 message/tasks 投递一律走 host.call（plugin origin）。
 */
import { createHash } from "node:crypto";
import { driverById, driverList, DRIVERS } from "../drivers/index.js";
import {
  itemRow,
  newId,
  now,
  parseJson,
  sourceRow,
  tx,
} from "../db/db.js";

const MAX_ITEMS = 5000;
const MAX_BACKOFF_MS = 6 * 60 * 60 * 1000;
const LOOPBACK = new Set(["127.0.0.1", "::1", "::ffff:127.0.0.1"]);

function hashOf(item) {
  return createHash("sha1")
    .update([item.title, item.url, item.summary, item.content].join("\n"))
    .digest("hex")
    .slice(0, 20);
}

function text(value, max) {
  return String(value == null ? "" : value).slice(0, max);
}

function resultOf(reply) {
  if (reply && reply.result !== undefined) return reply.result;
  return reply;
}

export function createConnector({ db, host, log = () => {}, emit = null }) {
  const inFlight = new Set();
  let timer = null;

  function call(action, args) {
    if (!host || typeof host.call !== "function") throw new Error("宿主版本过旧：缺少 host.call");
    return host.call(action, args || {}).then(resultOf);
  }

  function listSources(args = {}) {
    const q = String(args.q || "").trim();
    const where = ["s.deleted_at IS NULL"];
    const params = [];
    if (q) {
      where.push("(s.name LIKE ? OR s.driver LIKE ?)");
      params.push("%" + q + "%", "%" + q + "%");
    }
    const rows = db
      .prepare(
        "SELECT s.*, st.secret_id, st.cursor, st.next_run_at, st.last_run_at, st.last_status, st.last_error, " +
          "st.fail_count, st.delivery_enabled FROM connector_source s " +
          "LEFT JOIN connector_source_state st ON st.source_id = s.id " +
          "WHERE " + where.join(" AND ") + " ORDER BY s.updated_at DESC",
      )
      .all(...params);
    return { sources: rows.map((row) => sourceRow(row, row)), drivers: DRIVERS.map((d) => d.id) };
  }

  function sourceGet(args = {}) {
    const id = String(args.id || "");
    const row = db.prepare("SELECT * FROM connector_source WHERE id = ? AND deleted_at IS NULL").get(id);
    if (!row) throw new Error("来源不存在：" + id);
    const state = db.prepare("SELECT * FROM connector_source_state WHERE source_id = ?").get(id);
    return { source: sourceRow(row, state) };
  }

  function ensureSchedule(value, driver) {
    const n = Number(value == null ? 900 : value);
    if (!Number.isFinite(n)) throw new Error("scheduleSec 必须是数字");
    if (n !== 0 && n < 60) throw new Error("scheduleSec 至少 60 秒；0 表示只手动/推送");
    if (n > 7 * 24 * 3600) throw new Error("scheduleSec 不能超过 7 天");
    if (driver.id === "webhook" && n !== 0) return 0;
    return Math.floor(n);
  }

  function sourceCreate(args = {}) {
    const name = text(args.name, 80).trim();
    if (!name) throw new Error("name 不能为空");
    const driver = driverById(String(args.driver || ""));
    if (!driver) throw new Error("未知 driver：" + args.driver);
    const config = driver.validate(args.config || {});
    const schedule = ensureSchedule(args.scheduleSec, driver);
    const sink = ["none", "message"].includes(String(args.sink || "none")) ? String(args.sink || "none") : "none";
    const sinkConfig = args.sinkConfig && typeof args.sinkConfig === "object" ? args.sinkConfig : {};
    const id = newId("src");
    const ts = now();
    try {
      tx(db, () => {
        db.prepare(
          "INSERT INTO connector_source(id,name,driver,config,enabled,schedule_sec,sink,sink_config,created_at,updated_at,rev) " +
            "VALUES(?,?,?,?,?,?,?,?,?,?,1)",
        ).run(id, name, driver.id, JSON.stringify(config), args.enabled === false ? 0 : 1, schedule, sink, JSON.stringify(sinkConfig), ts, ts);
        db.prepare(
          "INSERT INTO connector_source_state(source_id,secret_id,cursor,next_run_at,delivery_enabled,updated_at) " +
            "VALUES(?,?,?,?,?,?)",
        ).run(id, args.secretId ? String(args.secretId) : null, "", ts + schedule * 1000, 1, ts);
      });
    } catch (error) {
      if (String(error && error.message).includes("UNIQUE")) throw new Error("已有同名来源：" + name);
      throw error;
    }
    return { id, ok: true };
  }

  function sourceUpdate(args = {}) {
    const id = String(args.id || "");
    const row = db.prepare("SELECT * FROM connector_source WHERE id = ? AND deleted_at IS NULL").get(id);
    if (!row) throw new Error("来源不存在：" + id);
    const driver = driverById(args.driver ? String(args.driver) : row.driver);
    if (!driver) throw new Error("未知 driver：" + (args.driver || row.driver));
    const config = args.config == null ? parseJson(row.config, {}) : driver.validate(args.config);
    const schedule = args.scheduleSec == null ? row.schedule_sec : ensureSchedule(args.scheduleSec, driver);
    const name = args.name == null ? row.name : text(args.name, 80).trim();
    if (!name) throw new Error("name 不能为空");
    const sink = args.sink == null ? row.sink : ["none", "message"].includes(String(args.sink)) ? String(args.sink) : "none";
    const sinkConfig = args.sinkConfig == null ? row.sink_config : JSON.stringify(args.sinkConfig || {});
    const enabled = args.enabled == null ? row.enabled : args.enabled ? 1 : 0;
    const ts = now();
    try {
      db.prepare(
        "UPDATE connector_source SET name=?,driver=?,config=?,enabled=?,schedule_sec=?,sink=?,sink_config=?,updated_at=?,rev=rev+1 WHERE id=?",
      ).run(name, driver.id, JSON.stringify(config), enabled, schedule, sink, sinkConfig, ts, id);
    } catch (error) {
      if (String(error && error.message).includes("UNIQUE")) throw new Error("已有同名来源：" + name);
      throw error;
    }
    if (args.secretId !== undefined || args.scheduleSec !== undefined || args.enabled !== undefined) {
      const state = db.prepare("SELECT * FROM connector_source_state WHERE source_id = ?").get(id);
      db.prepare(
        "UPDATE connector_source_state SET secret_id=?, next_run_at=?, last_status=?, updated_at=? WHERE source_id=?",
      ).run(
        args.secretId === undefined ? state?.secret_id ?? null : args.secretId ? String(args.secretId) : null,
        args.enabled === false ? 0 : ts + schedule * 1000,
        args.enabled === false ? "paused" : state?.last_status || "idle",
        ts,
        id,
      );
    }
    return { ok: true };
  }

  function sourceDelete(args = {}) {
    const id = String(args.id || "");
    const info = db.prepare("UPDATE connector_source SET deleted_at=?, updated_at=?, rev=rev+1 WHERE id=? AND deleted_at IS NULL").run(now(), now(), id);
    if (!info.changes) throw new Error("来源不存在：" + id);
    db.prepare("UPDATE connector_source_state SET next_run_at=0, updated_at=? WHERE source_id=?").run(now(), id);
    return { ok: true };
  }

  async function sourceBind(args = {}) {
    const id = String(args.id || "");
    sourceGet({ id });
    const secretId = args.secretId ? String(args.secretId) : null;
    if (secretId) {
      const r = await call("vault.secretList", {});
      const found = ((r && r.items) || []).some((x) => x.id === secretId);
      if (!found) throw new Error("凭据不存在：" + secretId);
    }
    db.prepare("UPDATE connector_source_state SET secret_id=?, updated_at=? WHERE source_id=?").run(secretId, now(), id);
    return { ok: true, secretId };
  }

  function sourceDelivery(args = {}) {
    const id = String(args.id || "");
    sourceGet({ id });
    const enabled = args.enabled === false ? 0 : 1;
    db.prepare("UPDATE connector_source_state SET delivery_enabled=?, updated_at=? WHERE source_id=?").run(enabled, now(), id);
    return { ok: true, deliveryEnabled: Boolean(enabled) };
  }

  async function lease(source) {
    const secretId = source.state && source.state.secretId;
    if (!secretId) return "";
    const r = await call("vault.lease", { id: secretId, purpose: "connector:" + source.name, ttlSeconds: 60 });
    return String((r && r.secret) || "");
  }

  function beginRun(sourceId, trigger) {
    const id = newId("run");
    db.prepare(
      "INSERT INTO connector_run(id,source_id,trigger,started_at,status) VALUES(?,?,?,?,'running')",
    ).run(id, sourceId, trigger, now());
    return id;
  }

  function finishRun(id, patch) {
    db.prepare(
      "UPDATE connector_run SET finished_at=?, status=?, fetched=?, inserted=?, updated=?, skipped=?, error=? WHERE id=?",
    ).run(
      now(),
      patch.status || "ok",
      patch.fetched || 0,
      patch.inserted || 0,
      patch.updated || 0,
      patch.skipped || 0,
      patch.error ? String(patch.error).slice(0, 500) : null,
      id,
    );
  }

  function upsertItem(sourceId, item) {
    const externalId = text(item.externalId || item.url || item.title, 200);
    if (!externalId) return "skipped";
    const hash = hashOf(item);
    const existing = db
      .prepare("SELECT id, hash FROM connector_item WHERE source_id=? AND external_id=?")
      .get(sourceId, externalId);
    const ts = now();
    if (existing && existing.hash === hash) return "skipped";
    if (existing) {
      db.prepare(
        "UPDATE connector_item SET title=?,url=?,summary=?,content=?,author=?,published_at=?,fetched_at=?,hash=?,raw=?,updated_at=? WHERE id=?",
      ).run(
        text(item.title, 300),
        text(item.url, 2000),
        text(item.summary, 2000),
        text(item.content, 20000),
        text(item.author, 200),
        item.publishedAt || null,
        ts,
        hash,
        text(item.raw, 20000),
        ts,
        existing.id,
      );
      return "updated";
    }
    db.prepare(
      "INSERT INTO connector_item(id,source_id,external_id,title,url,summary,content,author,published_at,fetched_at,hash,raw,created_at,updated_at) " +
        "VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
    ).run(
      newId("item"),
      sourceId,
      externalId,
      text(item.title, 300),
      text(item.url, 2000),
      text(item.summary, 2000),
      text(item.content, 20000),
      text(item.author, 200),
      item.publishedAt || null,
      ts,
      hash,
      text(item.raw, 20000),
      ts,
      ts,
    );
    return "inserted";
  }

  async function deliver(source, item) {
    if (!source.state || !source.state.deliveryEnabled || source.sink === "none") return;
    try {
      if (source.sink === "message") {
        await call("message.send", {
          title: "[" + source.name + "] " + text(item.title, 120),
          body: [text(item.summary, 1000), item.url].filter(Boolean).join("\n"),
          level: "info",
          source: "connector",
          audience: "user",
          dedupeKey: "connector:" + source.id + ":" + item.externalId,
        });
      }
    } catch (e) {
      log("投递失败", source.name, String(e && e.message));
    }
  }

  async function sourceRun(args = {}, trigger = "manual") {
    const source = sourceGet({ id: args.id }).source;
    if (!source.enabled && !args.force) throw new Error("来源已停用；force=true 可强制运行");
    if (inFlight.has(source.id)) return { ok: false, busy: true, message: "该来源正在运行" };
    inFlight.add(source.id);
    const runId = beginRun(source.id, trigger === "schedule" ? "schedule" : "manual");
    const driver = driverById(source.driver);
    let counts = { fetched: 0, inserted: 0, updated: 0, skipped: 0 };
    try {
      if (!driver) throw new Error("未知 driver：" + source.driver);
      const secret = await lease(source);
      const res = await driver.fetch({
        config: source.config,
        secret,
        cursor: source.state ? source.state.cursor : "",
        signal: AbortSignal.timeout(25000),
      });
      const items = Array.isArray(res.items) ? res.items.slice(0, MAX_ITEMS) : [];
      counts.fetched = items.length;
      for (const item of items) {
        const kind = upsertItem(source.id, item);
        counts[kind] += 1;
        if (kind !== "skipped") {
          if (typeof emit === "function") {
            emit("item.created", {
              sourceId: source.id,
              sourceName: source.name,
              driver: source.driver,
              item: { externalId: item.externalId, title: item.title, url: item.url, summary: item.summary, author: item.author, publishedAt: item.publishedAt },
              at: now(),
            });
          }
          await deliver(source, item);
        }
      }
      const ts = now();
      db.prepare(
        "UPDATE connector_source_state SET cursor=?, last_run_at=?, last_status='ok', last_error=NULL, fail_count=0, next_run_at=?, updated_at=? WHERE source_id=?",
      ).run(String(res.cursor || ""), ts, source.scheduleSec > 0 ? ts + source.scheduleSec * 1000 : 0, ts, source.id);
      finishRun(runId, { status: "ok", ...counts });
      return { ok: true, runId, ...counts, cursor: res.cursor || "" };
    } catch (error) {
      const msg = String((error && error.message) || error);
      const state = db.prepare("SELECT fail_count FROM connector_source_state WHERE source_id=?").get(source.id);
      const failCount = Number(state?.fail_count || 0) + 1;
      const delay = Math.min((source.scheduleSec || 900) * 1000 * Math.pow(2, Math.min(failCount, 6)), MAX_BACKOFF_MS);
      const ts = now();
      db.prepare(
        "UPDATE connector_source_state SET last_run_at=?, last_status='error', last_error=?, fail_count=?, next_run_at=?, updated_at=? WHERE source_id=?",
      ).run(ts, msg.slice(0, 500), failCount, source.enabled ? ts + delay : 0, ts, source.id);
      finishRun(runId, { status: "error", ...counts, error: msg });
      throw error;
    } finally {
      inFlight.delete(source.id);
    }
  }

  async function handleInbound(req) {
    const sourceId = String((req.query && req.query.source) || (req.headers && req.headers["x-connector-source"]) || "");
    if (!sourceId) throw new Error("缺少 source");
    const source = sourceGet({ id: sourceId }).source;
    if (!source.enabled) throw new Error("来源已停用");
    if (source.driver !== "webhook") throw new Error("来源不是 webhook");
    const driver = driverById("webhook");
    const secret = await lease(source);
    const item = driver.parseHook({ req, secret, source });
    const runId = beginRun(source.id, "webhook");
    try {
      const kind = upsertItem(source.id, item);
      if (kind !== "skipped") {
        if (typeof emit === "function") {
          emit("item.created", {
            sourceId: source.id,
            sourceName: source.name,
            driver: source.driver,
            item: { externalId: item.externalId, title: item.title, url: item.url, summary: item.summary, author: item.author, publishedAt: item.publishedAt },
            at: now(),
          });
        }
        await deliver(source, item);
      }
      db.prepare(
        "UPDATE connector_source_state SET last_run_at=?, last_status='ok', last_error=NULL, fail_count=0, updated_at=? WHERE source_id=?",
      ).run(now(), now(), source.id);
      finishRun(runId, { status: "ok", fetched: 1, inserted: kind === "inserted" ? 1 : 0, updated: kind === "updated" ? 1 : 0, skipped: kind === "skipped" ? 1 : 0 });
      return { ok: true, kind, id: item.externalId };
    } catch (error) {
      finishRun(runId, { status: "error", fetched: 1, error: String(error && error.message) });
      throw error;
    }
  }

  function listItems(args = {}) {
    const where = [];
    const params = [];
    if (args.sourceId) {
      where.push("source_id = ?");
      params.push(String(args.sourceId));
    }
    if (args.q) {
      where.push("(title LIKE ? OR summary LIKE ? OR author LIKE ?)");
      const q = "%" + String(args.q) + "%";
      params.push(q, q, q);
    }
    const limit = Math.max(1, Math.min(200, Number(args.limit) || 50));
    const offset = Math.max(0, Number(args.offset) || 0);
    const rows = db
      .prepare(
        "SELECT * FROM connector_item" + (where.length ? " WHERE " + where.join(" AND ") : "") +
          " ORDER BY COALESCE(published_at, fetched_at) DESC LIMIT ? OFFSET ?",
      )
      .all(...params, limit, offset);
    const total = db
      .prepare("SELECT COUNT(*) AS n FROM connector_item" + (where.length ? " WHERE " + where.join(" AND ") : ""))
      .get(...params);
    return { items: rows.map(itemRow), total: Number(total?.n || 0), limit, offset };
  }

  function listRuns(args = {}) {
    const limit = Math.max(1, Math.min(100, Number(args.limit) || 20));
    const rows = args.sourceId
      ? db.prepare("SELECT * FROM connector_run WHERE source_id=? ORDER BY started_at DESC LIMIT ?").all(String(args.sourceId), limit)
      : db.prepare("SELECT * FROM connector_run ORDER BY started_at DESC LIMIT ?").all(limit);
    return {
      runs: rows.map((r) => ({
        id: r.id,
        sourceId: r.source_id,
        trigger: r.trigger,
        startedAt: r.started_at,
        finishedAt: r.finished_at,
        status: r.status,
        fetched: r.fetched,
        inserted: r.inserted,
        updated: r.updated,
        skipped: r.skipped,
        error: r.error || "",
      })),
    };
  }

  function stats() {
    const sources = db.prepare("SELECT COUNT(*) AS n, SUM(enabled) AS on_ FROM connector_source WHERE deleted_at IS NULL").get();
    const items = db.prepare("SELECT COUNT(*) AS n FROM connector_item").get();
    const errors = db.prepare("SELECT COUNT(*) AS n FROM connector_source_state WHERE last_status='error'").get();
    const last = db.prepare("SELECT * FROM connector_run ORDER BY started_at DESC LIMIT 1").get();
    return {
      sources: Number(sources?.n || 0),
      enabled: Number(sources?.on_ || 0),
      items: Number(items?.n || 0),
      errorSources: Number(errors?.n || 0),
      lastRun: last ? { id: last.id, status: last.status, startedAt: last.started_at, sourceId: last.source_id } : null,
    };
  }

  async function tick() {
    const rows = db
      .prepare(
        "SELECT s.* FROM connector_source s JOIN connector_source_state st ON st.source_id=s.id " +
          "WHERE s.deleted_at IS NULL AND s.enabled=1 AND s.schedule_sec>0 AND st.next_run_at>0 AND st.next_run_at<=? LIMIT 3",
      )
      .all(now());
    for (const row of rows) {
      if (inFlight.has(row.id)) continue;
      try {
        await sourceRun({ id: row.id }, "schedule");
      } catch (e) {
        log("定时抓取失败", row.name, String(e && e.message));
      }
    }
  }

  function startSchedule() {
    if (timer) return;
    timer = setInterval(() => {
      tick().catch((e) => log("调度器异常", String(e && e.message)));
    }, 15000);
    if (timer.unref) timer.unref();
  }

  function stopSchedule() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  function exportData() {
    const rows = db.prepare("SELECT * FROM connector_source WHERE deleted_at IS NULL ORDER BY created_at").all();
    return {
      formatVersion: 1,
      exportedAt: new Date(now()).toISOString(),
      note: "只导出来源定义；cursor、secret_id、条目与运行记录不进入备份。",
      sources: rows.map((r) => ({
        id: r.id,
        name: r.name,
        driver: r.driver,
        config: parseJson(r.config, {}),
        enabled: Boolean(r.enabled),
        scheduleSec: r.schedule_sec,
        sink: r.sink,
        sinkConfig: parseJson(r.sink_config, {}),
        createdAt: r.created_at,
        updatedAt: r.updated_at,
      })),
    };
  }

  function importData(data) {
    const sources = Array.isArray(data?.sources) ? data.sources : [];
    let imported = 0;
    let skipped = 0;
    for (const s of sources) {
      if (!s || !s.id || !s.name || !driverById(s.driver)) {
        skipped += 1;
        continue;
      }
      const exists = db.prepare("SELECT id FROM connector_source WHERE id=?").get(String(s.id));
      if (exists) {
        skipped += 1;
        continue;
      }
      const driver = driverById(s.driver);
      let config;
      try {
        config = driver.validate(s.config || {});
      } catch {
        skipped += 1;
        continue;
      }
      const ts = now();
      tx(db, () => {
        db.prepare(
          "INSERT INTO connector_source(id,name,driver,config,enabled,schedule_sec,sink,sink_config,created_at,updated_at,rev) VALUES(?,?,?,?,?,?,?,?,?,?,1)",
        ).run(String(s.id), text(s.name, 80), driver.id, JSON.stringify(config), s.enabled === false ? 0 : 1, Number(s.scheduleSec) || 900, s.sink === "message" ? "message" : "none", JSON.stringify(s.sinkConfig || {}), Number(s.createdAt) || ts, ts);
        db.prepare(
          "INSERT OR IGNORE INTO connector_source_state(source_id,secret_id,cursor,next_run_at,delivery_enabled,updated_at) VALUES(?,?,?,?,?,?)",
        ).run(String(s.id), null, "", 0, 1, ts);
      });
      imported += 1;
    }
    return { ok: true, imported, skipped };
  }

  function dueCount() {
    const row = db
      .prepare(
        "SELECT COUNT(*) AS n FROM connector_source s JOIN connector_source_state st ON st.source_id=s.id " +
          "WHERE s.deleted_at IS NULL AND s.enabled=1 AND s.schedule_sec>0 AND st.next_run_at>0 AND st.next_run_at<=?",
      )
      .get(now());
    return Number(row?.n || 0);
  }

  return {
    drivers: driverList,
    listSources,
    sourceGet,
    sourceCreate,
    sourceUpdate,
    sourceDelete,
    sourceBind,
    sourceDelivery,
    sourceRun,
    handleInbound,
    listItems,
    listRuns,
    stats,
    tick,
    startSchedule,
    stopSchedule,
    dueCount,
    exportData,
    importData,
  };
}
