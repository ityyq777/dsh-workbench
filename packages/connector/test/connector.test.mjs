import { test } from "node:test";
import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";

const { ensureSchema } = await import("../lib/db/db.js");
const { createConnector } = await import("../lib/domain/connector.js");

const calls = [];
const secrets = new Map([["sec1", "tok-123"]]);

const host = {
  async call(action, args) {
    calls.push({ action, args });
    if (action === "vault.secretList") return { result: { items: [...secrets.keys()].map((id) => ({ id, name: "token" })) } };
    if (action === "vault.lease") return { result: { secret: secrets.get(args.id) || "" } };
    if (action === "message.send") return { result: { ok: true, id: "m1" } };
    return { result: { ok: true } };
  },
};

function make() {
  const db = new DatabaseSync(":memory:");
  ensureSchema(db);
  const c = createConnector({ db, host });
  return { db, c };
}

test("RSS 来源抓取、去重与投递", async () => {
  const { db, c } = make();
  globalThis.fetch = async () => ({
    ok: true,
    status: 200,
    async text() {
      return `<?xml version="1.0"?><rss><channel><item><title>Hello &amp; world</title><link>https://e.test/1</link><description><![CDATA[<p>Body</p>]]></description><pubDate>Wed, 12 Nov 2025 10:00:00 GMT</pubDate><guid>g1</guid></item></channel></rss>`;
    },
  });
  const { id } = c.sourceCreate({ name: "feed", driver: "rss", config: { url: "https://e.test/feed.xml", limit: 10 }, scheduleSec: 900, sink: "message" });
  const r = await c.sourceRun({ id });
  assert.equal(r.fetched, 1);
  assert.equal(r.inserted, 1);
  const items = c.listItems({}).items;
  assert.equal(items.length, 1);
  assert.equal(items[0].title, "Hello & world");
  assert.ok(calls.some((x) => x.action === "message.send" && x.args.dedupeKey.includes(id)));
  const again = await c.sourceRun({ id });
  assert.equal(again.skipped, 1);
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM connector_item").get().n, 1);
  assert.equal(c.listSources({}).sources[0].state.deliveryEnabled, true);
});

test("Webhook 入站校验 token、去重、投递", async () => {
  const { c } = make();
  const { id } = c.sourceCreate({ name: "hook", driver: "webhook", config: {} });
  await c.sourceBind({ id, secretId: "sec1" });
  const req = {
    headers: { "x-webhook-token": "tok-123" },
    query: { source: id },
    body: Buffer.from(JSON.stringify({ id: "evt-1", title: "Deploy", body: "done", url: "https://e.test/d" })),
  };
  const out = await c.handleInbound(req);
  assert.equal(out.ok, true);
  assert.equal(out.kind, "inserted");
  const items = c.listItems({ sourceId: id }).items;
  assert.equal(items[0].title, "Deploy");
  await assert.rejects(() => c.handleInbound({ ...req, headers: { "x-webhook-token": "bad" } }), /token 无效/);
});

test("导出只含来源定义，导入跳过同名/同 id", () => {
  const { c } = make();
  c.sourceCreate({ name: "a", driver: "rss", config: { url: "https://a.test/rss" }, scheduleSec: 0 });
  const dump = c.exportData();
  assert.equal(dump.sources.length, 1);
  assert.equal(dump.sources[0].cursor, undefined);
  assert.equal(dump.sources[0].secretId, undefined);
  const imported = c.importData(dump);
  assert.equal(imported.imported, 0);
  assert.equal(imported.skipped, 1);
});

test("HMAC 验签、时间窗、重放与 IP 允许列表", async () => {
  const { createHmac } = await import("node:crypto");
  const { c } = make();
  const { id } = c.sourceCreate({
    name: "hmac-hook",
    driver: "webhook",
    config: { authMode: "hmac", ratePerMin: 0, ipAllowlist: "10.0.0.0/8", trustProxy: true },
  });
  await c.sourceBind({ id, secretId: "sec1" });
  const body = JSON.stringify({ id: "h1", title: "HMAC", body: "ok" });
  const ts = Date.now();
  const sig = createHmac("sha256", "tok-123").update(ts + "." + body).digest("hex");
  const req = {
    headers: { "x-webhook-timestamp": String(ts), "x-webhook-signature": "sha256=" + sig, "x-forwarded-for": "10.1.2.3" },
    query: { source: id },
    remoteAddress: "127.0.0.1",
    body: Buffer.from(body),
  };
  const out = await c.handleInbound(req);
  assert.equal(out.kind, "inserted");
  await assert.rejects(() => c.handleInbound(req), /重放/);
  const bad = { ...req, headers: { ...req.headers, "x-forwarded-for": "192.168.1.1" } };
  await assert.rejects(() => c.handleInbound(bad), /IP/);
  const old = { ...req, headers: { ...req.headers, "x-webhook-timestamp": String(ts - 3600_000), "x-webhook-signature": sig } };
  await assert.rejects(() => c.handleInbound(old), /时间戳/);
});

test("Webhook 限流返回 429", async () => {
  const { c } = make();
  const { id } = c.sourceCreate({ name: "rate-hook", driver: "webhook", config: { ratePerMin: 1 } });
  await c.sourceBind({ id, secretId: "sec1" });
  const req = { headers: { "x-webhook-token": "tok-123" }, query: { source: id }, remoteAddress: "127.0.0.1", body: Buffer.from('{"id":"r1"}') };
  await c.handleInbound(req);
  await assert.rejects(() => c.handleInbound(req), /每分钟/);
});
