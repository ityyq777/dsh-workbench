/**
 * Webhook driver：外部系统 POST 到 /workbench/hooks/connector/inbound?source=<id>。
 * token 从 vault 租用，不写进 config；默认只允许本机回环，公网必须反代。
 * 支持 token 与 HMAC-SHA256 两种鉴权，带时间窗、重放缓存、IP 允许列表与按来源限流。
 */
import { createHash, createHmac, timingSafeEqual } from "node:crypto";

const MAX_BODY = 256 * 1024;
const rateBySource = new Map();
const seenBySource = new Map();

function hash(text) {
  return createHash("sha1").update(String(text)).digest("hex").slice(0, 24);
}

function text(value, max) {
  return String(value == null ? "" : value).slice(0, max);
}

function fail(message, status) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function safeEqual(a, b) {
  const left = Buffer.from(String(a || ""));
  const right = Buffer.from(String(b || ""));
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

function ipv4ToInt(ip) {
  const parts = String(ip).split(".");
  if (parts.length !== 4) return null;
  let out = 0;
  for (const part of parts) {
    const n = Number(part);
    if (!Number.isInteger(n) || n < 0 || n > 255) return null;
    out = out * 256 + n;
  }
  return out;
}

function ipAllowed(ip, list) {
  if (!list) return true;
  const entries = list.split(",").map((x) => x.trim()).filter(Boolean);
  if (entries.length === 0) return true;
  for (const entry of entries) {
    if (entry === ip) return true;
    const [base, bitsRaw] = entry.split("/");
    if (bitsRaw === undefined) continue;
    const bits = Number(bitsRaw);
    const a = ipv4ToInt(ip);
    const b = ipv4ToInt(base);
    if (a == null || b == null || !Number.isInteger(bits) || bits < 0 || bits > 32) continue;
    const mask = bits === 0 ? 0 : (0xffffffff << (32 - bits)) >>> 0;
    if ((a & mask) === (b & mask)) return true;
  }
  return false;
}

function requestIp(req, config) {
  if (config.trustProxy) {
    const fwd = req.headers["x-forwarded-for"];
    const first = Array.isArray(fwd) ? fwd[0] : fwd;
    if (first) return String(first).split(",")[0].trim();
    const real = req.headers["x-real-ip"];
    if (real) return String(Array.isArray(real) ? real[0] : real).trim();
  }
  return String(req.remoteAddress || "");
}

function checkRate(source, config) {
  const limit = config.ratePerMin;
  if (!limit || limit <= 0) return;
  const now = Date.now();
  const key = source.id;
  const recent = (rateBySource.get(key) || []).filter((t) => now - t < 60000);
  if (recent.length >= limit) {
    rateBySource.set(key, recent);
    throw fail("webhook 超过每分钟 " + limit + " 次", 429);
  }
  recent.push(now);
  rateBySource.set(key, recent);
}

function checkReplay(source, config, signature, timestamp) {
  const key = source.id + ":" + timestamp + ":" + signature;
  const now = Date.now();
  const map = seenBySource.get(source.id) || new Map();
  for (const [k, t] of map) if (now - t > config.windowSec * 1000) map.delete(k);
  if (map.has(key)) throw fail("webhook 重放：签名已使用", 409);
  map.set(key, now);
  if (map.size > 5000) map.delete(map.keys().next().value);
  seenBySource.set(source.id, map);
}

function verifyToken(req, config, secret) {
  const provided = String(req.headers[config.header] || req.query.token || "");
  if (!secret || !safeEqual(provided, secret)) throw fail("webhook token 无效", 401);
}

function verifyHmac(req, config, secret, raw) {
  const tsRaw = req.headers[config.timestampHeader];
  const sigRaw = req.headers[config.signatureHeader];
  const timestamp = String(Array.isArray(tsRaw) ? tsRaw[0] : tsRaw || "");
  const signature = String(Array.isArray(sigRaw) ? sigRaw[0] : sigRaw || "").replace(/^sha256=/i, "");
  if (!timestamp || !signature) throw fail("缺少 " + config.timestampHeader + " 或 " + config.signatureHeader, 401);
  const ts = Number(timestamp);
  if (!Number.isFinite(ts)) throw fail("时间戳不是毫秒数", 401);
  const skew = Math.abs(Date.now() - ts);
  if (skew > config.windowSec * 1000) throw fail("时间戳超出 " + config.windowSec + " 秒窗口", 401);
  if (!secret) throw fail("webhook 未绑定 HMAC 密钥", 401);
  const expected = createHmac("sha256", String(secret)).update(timestamp + "." + raw).digest("hex");
  if (!safeEqual(signature.toLowerCase(), expected)) throw fail("webhook 签名无效", 401);
  checkReplay({ id: config.__sourceId || "" }, config, signature, timestamp);
}

export const webhookDriver = {
  id: "webhook",
  title: "Webhook",
  secretFields: ["token"],
  configFields: [
    { name: "authMode", label: "鉴权方式", type: "select", options: ["token", "hmac"], default: "token" },
    { name: "header", label: "token 请求头", type: "text", default: "x-webhook-token" },
    { name: "timestampHeader", label: "HMAC 时间戳头", type: "text", default: "x-webhook-timestamp" },
    { name: "signatureHeader", label: "HMAC 签名头", type: "text", default: "x-webhook-signature" },
    { name: "windowSec", label: "时间窗（秒）", type: "number", default: 300, min: 60, max: 900 },
    { name: "ipAllowlist", label: "IP 允许列表", type: "text", default: "", placeholder: "127.0.0.1, 10.0.0.0/8；空表示不限制" },
    { name: "ratePerMin", label: "每分钟上限", type: "number", default: 60, min: 0, max: 6000 },
    { name: "trustProxy", label: "信任反代转发头", type: "boolean", default: false },
    { name: "allowPublic", label: "允许非回环（仍建议反代）", type: "boolean", default: false },
  ],
  validate(config) {
    const authMode = config.authMode === "hmac" ? "hmac" : "token";
    const header = String(config.header || "x-webhook-token").toLowerCase();
    const timestampHeader = String(config.timestampHeader || "x-webhook-timestamp").toLowerCase();
    const signatureHeader = String(config.signatureHeader || "x-webhook-signature").toLowerCase();
    const windowSec = Math.max(60, Math.min(900, Number(config.windowSec) || 300));
    const ratePerMin = Math.max(0, Math.min(6000, Number(config.ratePerMin == null ? 60 : config.ratePerMin) || 0));
    const ipAllowlist = String(config.ipAllowlist || "").slice(0, 1000);
    return {
      authMode,
      header,
      timestampHeader,
      signatureHeader,
      windowSec,
      ratePerMin,
      ipAllowlist,
      trustProxy: Boolean(config.trustProxy),
      allowPublic: Boolean(config.allowPublic),
    };
  },
  async fetch() {
    return { items: [], cursor: "", meta: { push: true } };
  },
  parseHook({ req, secret, source }) {
    const config = source.config || {};
    const ip = requestIp(req, config);
    if (!ipAllowed(ip, config.ipAllowlist)) throw fail("来源 IP 不在允许列表：" + ip, 403);
    checkRate(source, config);
    const raw = Buffer.from(req.body || []).toString("utf8");
    if (raw.length > MAX_BODY) throw fail("webhook body 超过 256KB", 413);
    if (config.authMode === "hmac") {
      verifyHmac(req, Object.assign({}, config, { __sourceId: source.id }), secret, raw);
    } else {
      verifyToken(req, config, secret);
    }
    let data;
    try {
      data = JSON.parse(raw || "{}");
    } catch {
      data = { title: raw.slice(0, 200), body: raw };
    }
    const title = text(data.title || data.subject || "Webhook 消息", 200) || "Webhook 消息";
    const body = text(data.body || data.content || data.text || "", 20000);
    const url = text(data.url || data.link || "", 2000);
    const externalId = text(data.id || data.guid || "", 120) || hash(raw).slice(0, 24);
    return {
      externalId,
      title,
      url,
      summary: body.slice(0, 2000),
      content: body,
      author: text(data.author || data.from || "", 200),
      publishedAt: Number(data.publishedAt || data.timestamp || 0) || null,
      raw: raw.slice(0, 20000),
    };
  },
};

export { ipAllowed, requestIp };
