/**
 * 站点账号保险箱：敏感字段（password / phone_number / identity_card）的加解密与口令管理。
 *
 * 设计见 docs/specs/22-站点模块迁移二期.md §3：
 * - 口令经 scrypt 派生 32 字节密钥；盐与校验值存 meta 表，**密钥不落库、不同步**；
 * - 字段密文格式 `v1:<b64 iv>:<b64 tag>:<b64 ct>`（AES-256-GCM，随机 12 字节 IV）；
 * - 解锁后的密钥只存在宿主内存，空闲超时或手动 lock 即清除；
 * - 锁定状态下任何写入敏感列的操作都会失败，界面只能看到掩码。
 *
 * 明文只允许在界面进程（origin === "ui"）且解锁时出现；agent 调用一律返回掩码。
 */

import { randomBytes, scrypt as scryptCb, createHmac, createCipheriv, createDecipheriv } from "node:crypto";
import { promisify } from "node:util";
import { metaGet, metaSet } from "../db/db.js";

const scrypt = promisify(scryptCb);

const SALT_KEY = "sites.vault.salt";
const VERIFIER_KEY = "sites.vault.verifier";
const VERIFIER_TEXT = "sites-vault-v1";
const PREFIX = "v1:";
const IV_BYTES = 12;
const TAG_BYTES = 16;
const KEY_BYTES = 32;
const SCRYPT = { N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 };
const MIN_PASSPHRASE = 8;
const DEFAULT_IDLE_MINUTES = 15;
const MAX_FAILS = 5;

/** 解锁态只存在内存：key 为 Buffer，lastUsed 为毫秒时间戳。 */
let secretKey = null;
let lastUsed = 0;
let failCount = 0;
let blockedUntil = 0;

function b64(buf) {
  return Buffer.from(buf).toString("base64");
}

function unb64(text) {
  return Buffer.from(String(text), "base64");
}

export function isEncrypted(value) {
  return typeof value === "string" && value.startsWith(PREFIX);
}

/** 掩码：固定长度，不泄露原值长度。 */
export function maskSecret() {
  return "••••••";
}

/** 中段掩码：138****8000 / 1101**********1234。 */
export function maskMiddle(value) {
  const s = String(value || "");
  if (!s) return "";
  if (s.length <= 4) return "*".repeat(s.length);
  if (s.length <= 8) return s.slice(0, 2) + "*".repeat(s.length - 4) + s.slice(-2);
  const head = s.slice(0, Math.min(4, Math.floor(s.length / 3)));
  const tail = s.slice(-Math.min(4, Math.floor(s.length / 4)));
  return head + "*".repeat(Math.max(4, s.length - head.length - tail.length)) + tail;
}

export function vaultEnabled(db) {
  return Boolean(metaGet(db, SALT_KEY) && metaGet(db, VERIFIER_KEY));
}

function idleMs(db) {
  let minutes = DEFAULT_IDLE_MINUTES;
  try {
    const row = db.prepare("SELECT v FROM meta WHERE k='config.sites.vault.idleMinutes'").get();
    const n = row ? Number(row.v) : NaN;
    if (Number.isFinite(n) && n >= 1 && n <= 120) minutes = n;
  } catch {
    /* 配置缺失时用默认值 */
  }
  return minutes * 60 * 1000;
}

function expireIfIdle(db) {
  if (!secretKey) return;
  if (Date.now() - lastUsed > idleMs(db)) {
    secretKey = null;
    lastUsed = 0;
  }
}

export function vaultStatus(db) {
  expireIfIdle(db);
  const enabled = vaultEnabled(db);
  const unlocked = Boolean(secretKey);
  const remainingMs = unlocked ? Math.max(0, idleMs(db) - (Date.now() - lastUsed)) : 0;
  return {
    enabled,
    unlocked,
    idleMinutes: Math.round(idleMs(db) / 60000),
    remainingMs,
    passphraseMinLength: MIN_PASSPHRASE,
  };
}

async function derive(passphrase, salt) {
  const buf = await scrypt(String(passphrase), salt, KEY_BYTES, SCRYPT);
  return Buffer.from(buf);
}

function verifierOf(key) {
  return createHmac("sha256", key).update(VERIFIER_TEXT).digest("hex");
}

function checkPassphraseShape(passphrase) {
  const s = String(passphrase == null ? "" : passphrase);
  if (s.length < MIN_PASSPHRASE) throw new Error("口令至少 " + MIN_PASSPHRASE + " 位");
  if (s.length > 200) throw new Error("口令过长（最多 200 位）");
  return s;
}

/** 首次设置口令：写盐与校验值，并立即解锁。 */
export async function setupVault(db, passphrase) {
  if (vaultEnabled(db)) throw new Error("账号保险箱已设置；如要更换口令请使用 sites.vault.rekey");
  const p = checkPassphraseShape(passphrase);
  const salt = randomBytes(16);
  const key = await derive(p, salt);
  metaSet(db, SALT_KEY, b64(salt));
  metaSet(db, VERIFIER_KEY, verifierOf(key));
  secretKey = key;
  lastUsed = Date.now();
  failCount = 0;
  blockedUntil = 0;
  return vaultStatus(db);
}

/** 解锁：口令错误只返回统一错误，不区分「未设置/口令错」。 */
export async function unlockVault(db, passphrase) {
  if (!vaultEnabled(db)) throw new Error("尚未设置账号保险箱口令，请先调用 sites.vault.setup");
  const nowMs = Date.now();
  if (blockedUntil > nowMs) {
    const secs = Math.ceil((blockedUntil - nowMs) / 1000);
    throw new Error("口令错误次数过多，请 " + secs + " 秒后再试");
  }
  const salt = unb64(metaGet(db, SALT_KEY));
  const key = await derive(String(passphrase == null ? "" : passphrase), salt);
  if (verifierOf(key) !== String(metaGet(db, VERIFIER_KEY))) {
    failCount += 1;
    if (failCount >= MAX_FAILS) {
      blockedUntil = Date.now() + Math.min(60000, 1000 * 2 ** (failCount - MAX_FAILS + 1));
      failCount = 0;
    }
    throw new Error("口令不正确");
  }
  secretKey = key;
  lastUsed = Date.now();
  failCount = 0;
  blockedUntil = 0;
  return vaultStatus(db);
}

export function lockVault() {
  secretKey = null;
  lastUsed = 0;
  return { enabled: true, unlocked: false };
}

/** 取当前密钥；锁定或空闲超时则抛错。 */
export function requireKey(db) {
  expireIfIdle(db);
  if (!secretKey) throw new Error("账号保险箱未解锁：请先在界面解锁，或调用 sites.vault.unlock");
  lastUsed = Date.now();
  return secretKey;
}

export function encryptField(db, value) {
  const s = value == null ? "" : String(value);
  if (!s) return "";
  const key = requireKey(db);
  const iv = randomBytes(IV_BYTES);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const ct = Buffer.concat([cipher.update(s, "utf8"), cipher.final()]);
  return PREFIX + b64(iv) + ":" + b64(cipher.getAuthTag()) + ":" + b64(ct);
}

/** 解密；非密文（历史明文）原样返回，便于兼容与排障。 */
export function decryptField(db, value) {
  const s = value == null ? "" : String(value);
  if (!s) return "";
  if (!isEncrypted(s)) return s;
  const key = requireKey(db);
  const parts = s.slice(PREFIX.length).split(":");
  if (parts.length !== 3) throw new Error("密文格式不正确");
  const iv = unb64(parts[0]);
  const tag = unb64(parts[1]);
  const ct = unb64(parts[2]);
  if (tag.length !== TAG_BYTES) throw new Error("密文校验段损坏");
  const decipher = createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(ct), decipher.final()]).toString("utf8");
}

/** 改口令：先用旧口令派生旧密钥解密全部行，再用新密钥重新加密（调用方负责事务）。 */
export async function rekeyVault(db, oldPassphrase, newPassphrase) {
  if (!vaultEnabled(db)) throw new Error("尚未设置账号保险箱口令");
  const next = checkPassphraseShape(newPassphrase);
  const salt = unb64(metaGet(db, SALT_KEY));
  const oldKey = await derive(String(oldPassphrase == null ? "" : oldPassphrase), salt);
  if (verifierOf(oldKey) !== String(metaGet(db, VERIFIER_KEY))) throw new Error("原口令不正确");
  const rows = db
    .prepare("SELECT id,password,phone_number,identity_card FROM site_account")
    .all();
  const plain = rows.map((row) => ({
    id: String(row.id),
    password: decryptWith(oldKey, row.password),
    phone: decryptWith(oldKey, row.phone_number),
    identity: decryptWith(oldKey, row.identity_card),
  }));
  const nextSalt = randomBytes(16);
  const newKey = await derive(next, nextSalt);
  const upd = db.prepare("UPDATE site_account SET password=?, phone_number=?, identity_card=? WHERE id=?");
  for (const item of plain) {
    upd.run(encryptWith(newKey, item.password), encryptWith(newKey, item.phone), encryptWith(newKey, item.identity), item.id);
  }
  metaSet(db, SALT_KEY, b64(nextSalt));
  metaSet(db, VERIFIER_KEY, verifierOf(newKey));
  secretKey = newKey;
  lastUsed = Date.now();
  return vaultStatus(db);
}

function encryptWith(key, value) {
  const s = value == null ? "" : String(value);
  if (!s) return "";
  const iv = randomBytes(IV_BYTES);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const ct = Buffer.concat([cipher.update(s, "utf8"), cipher.final()]);
  return PREFIX + b64(iv) + ":" + b64(cipher.getAuthTag()) + ":" + b64(ct);
}

function decryptWith(key, value) {
  const s = value == null ? "" : String(value);
  if (!s) return "";
  if (!isEncrypted(s)) return s;
  const parts = s.slice(PREFIX.length).split(":");
  if (parts.length !== 3) throw new Error("密文格式不正确");
  const decipher = createDecipheriv("aes-256-gcm", key, unb64(parts[0]));
  decipher.setAuthTag(unb64(parts[1]));
  return Buffer.concat([decipher.update(unb64(parts[2])), decipher.final()]).toString("utf8");
}

/** 测试用：清除内存态（不影响库里已存的口令）。 */
export function resetVaultMemory() {
  secretKey = null;
  lastUsed = 0;
  failCount = 0;
  blockedUntil = 0;
}
