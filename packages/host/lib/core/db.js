import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { SCHEMA_SQL } from "./schema.js";
/** 打开（或创建）工作台本地库并跑基线 schema。单进程权威，WAL。 */
export function openDb(file) {
    mkdirSync(dirname(file), { recursive: true });
    const db = new DatabaseSync(file);
    db.exec(SCHEMA_SQL);
    return db;
}
/** UUIDv7：时间有序主键。demo 简化实现（48bit ms + rand）。 */
export function uuidv7() {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    const ms = Date.now();
    bytes[0] = (ms / 2 ** 40) & 0xff;
    bytes[1] = (ms / 2 ** 32) & 0xff;
    bytes[2] = (ms / 2 ** 24) & 0xff;
    bytes[3] = (ms / 2 ** 16) & 0xff;
    bytes[4] = (ms / 2 ** 8) & 0xff;
    bytes[5] = ms & 0xff;
    bytes[6] = (bytes[6] & 0x0f) | 0x70;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const h = [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
    return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}
/** 单调化时间戳：防时钟回拨导致的乱序覆盖（07 失败模式清单）。 */
let lastTs = 0;
export function monoNow() {
    const wall = Date.now();
    lastTs = Math.max(wall, lastTs + 1);
    return lastTs;
}
