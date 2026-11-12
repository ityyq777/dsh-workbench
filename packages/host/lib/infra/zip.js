/**
 * 最小 ZIP 读写实现（宿主备份用）。
 *
 * 不引入第三方依赖：写 ZIP 时用 deflateRaw，读时支持 store/deflate。
 * 只接受本项目导出的备份包，因此刻意拒绝加密、ZIP64、data descriptor
 * 和所有可疑路径，避免把压缩包当文件系统入口。
 */
import { deflateRawSync, inflateRawSync } from "node:zlib";
const DEFAULT_LIMITS = {
    maxEntries: 200,
    maxEntryBytes: 32 * 1024 * 1024,
    maxTotalBytes: 64 * 1024 * 1024,
};
const CRC_TABLE = (() => {
    const table = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
        let c = n;
        for (let k = 0; k < 8; k++)
            c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
        table[n] = c >>> 0;
    }
    return table;
})();
function crc32(buf) {
    let c = 0xffffffff;
    for (let i = 0; i < buf.length; i++)
        c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
    return (c ^ 0xffffffff) >>> 0;
}
function assertSafeName(name) {
    if (!name || name.length > 255)
        throw new Error("ZIP 条目名长度非法");
    if (name.includes("\\") || name.includes("\0"))
        throw new Error("ZIP 条目名包含非法字符：" + name);
    if (name.startsWith("/") || /^[a-zA-Z]:/.test(name))
        throw new Error("ZIP 条目名不能是绝对路径：" + name);
    const parts = name.split("/");
    if (parts.some((p) => p === "" || p === "." || p === "..")) {
        throw new Error("ZIP 条目名包含非法路径：" + name);
    }
}
/** 生成一个 ZIP。文件名在条目里使用 UTF-8。 */
export function zipCreate(entries) {
    if (!Array.isArray(entries) || !entries.length)
        throw new Error("ZIP 至少需要一个文件");
    if (entries.length > DEFAULT_LIMITS.maxEntries)
        throw new Error("ZIP 文件数超过上限");
    const seen = new Set();
    const locals = [];
    const centrals = [];
    let offset = 0;
    let total = 0;
    for (const entry of entries) {
        assertSafeName(entry.name);
        if (seen.has(entry.name))
            throw new Error("ZIP 条目重名：" + entry.name);
        seen.add(entry.name);
        const data = Buffer.isBuffer(entry.data) ? entry.data : Buffer.from(entry.data);
        if (data.length > DEFAULT_LIMITS.maxEntryBytes)
            throw new Error("ZIP 单文件超过上限：" + entry.name);
        total += data.length;
        if (total > DEFAULT_LIMITS.maxTotalBytes)
            throw new Error("ZIP 总大小超过上限");
        const crc = crc32(data);
        const compressed = deflateRawSync(data);
        const method = compressed.length < data.length ? 8 : 0;
        const body = method === 8 ? compressed : data;
        const name = Buffer.from(entry.name, "utf8");
        const flags = 0x0800; // UTF-8 文件名
        const time = 0;
        const date = 0x0021; // 1980-01-01
        const local = Buffer.alloc(30 + name.length);
        local.writeUInt32LE(0x04034b50, 0);
        local.writeUInt16LE(20, 4);
        local.writeUInt16LE(flags, 6);
        local.writeUInt16LE(method, 8);
        local.writeUInt16LE(time, 10);
        local.writeUInt16LE(date, 12);
        local.writeUInt32LE(crc, 14);
        local.writeUInt32LE(body.length, 18);
        local.writeUInt32LE(data.length, 22);
        local.writeUInt16LE(name.length, 26);
        local.writeUInt16LE(0, 28);
        name.copy(local, 30);
        locals.push(local, body);
        const central = Buffer.alloc(46 + name.length);
        central.writeUInt32LE(0x02014b50, 0);
        central.writeUInt16LE(20, 4);
        central.writeUInt16LE(20, 6);
        central.writeUInt16LE(flags, 8);
        central.writeUInt16LE(method, 10);
        central.writeUInt16LE(time, 12);
        central.writeUInt16LE(date, 14);
        central.writeUInt32LE(crc, 16);
        central.writeUInt32LE(body.length, 20);
        central.writeUInt32LE(data.length, 24);
        central.writeUInt16LE(name.length, 28);
        central.writeUInt16LE(0, 30);
        central.writeUInt16LE(0, 32);
        central.writeUInt16LE(0, 34);
        central.writeUInt16LE(0, 36);
        central.writeUInt32LE(0, 38);
        central.writeUInt32LE(offset, 42);
        name.copy(central, 46);
        centrals.push(central);
        offset += local.length + body.length;
        if (offset > 0xffffffff)
            throw new Error("ZIP 超过 4GB 上限");
    }
    const centralBuf = Buffer.concat(centrals);
    const eocd = Buffer.alloc(22);
    eocd.writeUInt32LE(0x06054b50, 0);
    eocd.writeUInt16LE(0, 4);
    eocd.writeUInt16LE(0, 6);
    eocd.writeUInt16LE(entries.length, 8);
    eocd.writeUInt16LE(entries.length, 10);
    eocd.writeUInt32LE(centralBuf.length, 12);
    eocd.writeUInt32LE(offset, 16);
    eocd.writeUInt16LE(0, 20);
    return Buffer.concat([...locals, centralBuf, eocd]);
}
/** 读取 ZIP 为 Map<path, Buffer>；只接受本项目的备份包格式。 */
export function zipRead(input, limits = {}) {
    const lim = { ...DEFAULT_LIMITS, ...limits };
    const buf = Buffer.isBuffer(input) ? input : Buffer.from(input);
    if (buf.length < 22)
        throw new Error("不是有效的 ZIP：文件太小");
    let eocd = -1;
    const start = Math.max(0, buf.length - 22 - 65535);
    for (let i = buf.length - 22; i >= start; i--) {
        if (buf.readUInt32LE(i) === 0x06054b50) {
            eocd = i;
            break;
        }
    }
    if (eocd < 0)
        throw new Error("不是有效的 ZIP：找不到中央目录");
    const disk = buf.readUInt16LE(eocd + 4);
    const cdDisk = buf.readUInt16LE(eocd + 6);
    const count = buf.readUInt16LE(eocd + 8);
    const total = buf.readUInt16LE(eocd + 10);
    const cdSize = buf.readUInt32LE(eocd + 12);
    const cdOffset = buf.readUInt32LE(eocd + 16);
    if (disk !== 0 || cdDisk !== 0)
        throw new Error("不支持分卷 ZIP");
    if (count === 0xffff || total === 0xffff || cdSize === 0xffffffff || cdOffset === 0xffffffff) {
        throw new Error("不支持 ZIP64");
    }
    if (count !== total)
        throw new Error("ZIP 中央目录计数不一致");
    if (count > lim.maxEntries)
        throw new Error("ZIP 文件数超过上限");
    if (cdOffset + cdSize > buf.length)
        throw new Error("ZIP 中央目录越界");
    const out = new Map();
    let cursor = cdOffset;
    let totalBytes = 0;
    for (let i = 0; i < count; i++) {
        if (cursor + 46 > buf.length || buf.readUInt32LE(cursor) !== 0x02014b50) {
            throw new Error("ZIP 中央目录损坏");
        }
        const flags = buf.readUInt16LE(cursor + 8);
        const method = buf.readUInt16LE(cursor + 10);
        const crc = buf.readUInt32LE(cursor + 16);
        const compSize = buf.readUInt32LE(cursor + 20);
        const size = buf.readUInt32LE(cursor + 24);
        const nameLen = buf.readUInt16LE(cursor + 28);
        const extraLen = buf.readUInt16LE(cursor + 30);
        const commentLen = buf.readUInt16LE(cursor + 32);
        const localOffset = buf.readUInt32LE(cursor + 42);
        const nameStart = cursor + 46;
        const nameEnd = nameStart + nameLen;
        if (nameEnd > buf.length)
            throw new Error("ZIP 条目名越界");
        const name = buf.subarray(nameStart, nameEnd).toString("utf8");
        assertSafeName(name);
        if (out.has(name))
            throw new Error("ZIP 条目重名：" + name);
        if (flags & 0x0001)
            throw new Error("不支持加密 ZIP");
        if (flags & 0x0008)
            throw new Error("不支持 data descriptor ZIP");
        if (method !== 0 && method !== 8)
            throw new Error("不支持的 ZIP 压缩方法：" + method);
        if (size > lim.maxEntryBytes)
            throw new Error("ZIP 单文件超过上限：" + name);
        if (compSize > lim.maxEntryBytes + 1024)
            throw new Error("ZIP 压缩条目异常：" + name);
        if (localOffset + 30 > buf.length || buf.readUInt32LE(localOffset) !== 0x04034b50) {
            throw new Error("ZIP 本地文件头损坏：" + name);
        }
        const localNameLen = buf.readUInt16LE(localOffset + 26);
        const localExtraLen = buf.readUInt16LE(localOffset + 28);
        const dataStart = localOffset + 30 + localNameLen + localExtraLen;
        const dataEnd = dataStart + compSize;
        if (dataEnd > buf.length)
            throw new Error("ZIP 条目数据越界：" + name);
        const body = buf.subarray(dataStart, dataEnd);
        let data;
        try {
            data = method === 8 ? inflateRawSync(body) : Buffer.from(body);
        }
        catch (e) {
            throw new Error("ZIP 解压失败：" + name + "（" + String((e && e.message) || e) + "）");
        }
        if (data.length !== size)
            throw new Error("ZIP 条目大小不符：" + name);
        if (crc32(data) !== crc)
            throw new Error("ZIP 条目校验失败：" + name);
        totalBytes += data.length;
        if (totalBytes > lim.maxTotalBytes)
            throw new Error("ZIP 解压后总大小超过上限");
        out.set(name, data);
        cursor = nameEnd + extraLen + commentLen;
    }
    return out;
}
