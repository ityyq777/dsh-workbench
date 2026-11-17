/**
 * 保险箱密码学：scrypt 派生 KEK，AES-256-GCM 包裹 DEK / 加密 secret。
 * 密文格式与 sites 现有实现一致：v1:<b64 iv>:<b64 tag>:<b64 ct>。
 */
import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  scryptSync,
} from "node:crypto";
import { chmodSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join } from "node:path";

export const KDF_DEFAULT = { N: 32768, r: 8, p: 1, keylen: 32 };

export function deriveKey(passphrase, salt, kdf = KDF_DEFAULT) {
  const N = Number(kdf.N) || KDF_DEFAULT.N;
  const r = Number(kdf.r) || KDF_DEFAULT.r;
  const p = Number(kdf.p) || KDF_DEFAULT.p;
  return scryptSync(String(passphrase), Buffer.from(salt, "base64"), Number(kdf.keylen) || 32, {
    N,
    r,
    p,
    maxmem: 128 * 1024 * 1024,
  });
}

export function seal(key, plaintext, aad = "") {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  if (aad) cipher.setAAD(Buffer.from(aad, "utf8"));
  const ct = Buffer.concat([cipher.update(Buffer.from(plaintext)), cipher.final()]);
  const tag = cipher.getAuthTag();
  return "v1:" + iv.toString("base64") + ":" + tag.toString("base64") + ":" + ct.toString("base64");
}

export function open(key, payload, aad = "") {
  const parts = String(payload || "").split(":");
  if (parts.length !== 4 || parts[0] !== "v1") throw new Error("密文格式不支持");
  const iv = Buffer.from(parts[1], "base64");
  const tag = Buffer.from(parts[2], "base64");
  const ct = Buffer.from(parts[3], "base64");
  const decipher = createDecipheriv("aes-256-gcm", key, iv);
  if (aad) decipher.setAAD(Buffer.from(aad, "utf8"));
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(ct), decipher.final()]);
}

export function secretAad(id, name, kind) {
  return "vault:" + String(id) + ":" + String(name) + ":" + String(kind);
}

export function wbHome() {
  return process.env.WB_HOME || join(homedir(), ".dsh", "workbench");
}

export function deviceKeyPath() {
  return join(wbHome(), "vault-device.key");
}

export function readDeviceKey() {
  const path = deviceKeyPath();
  if (!existsSync(path)) return null;
  const buf = readFileSync(path);
  return buf.length === 32 ? buf : null;
}

export function writeDeviceKey(key) {
  const path = deviceKeyPath();
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, key, { mode: 0o600 });
  chmodSync(path, 0o600);
}

export function removeDeviceKey() {
  const path = deviceKeyPath();
  if (existsSync(path)) rmSync(path);
}
