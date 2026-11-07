/**
 * 数据备份：宿主只做三件事——收集各业务插件导出的数据、打成 ZIP、按 manifest 路由回去。
 * 各业务插件自己负责数据格式、解析与校验；宿主不解释 modules/<id>.json。
 */
import { createHash } from "node:crypto";
import { zipCreate, zipRead } from "./zip.js";
export const BACKUP_FORMAT_VERSION = 1;
export class BackupError extends Error {
    code;
    constructor(message, code = "invalid") {
        super(message);
        this.name = "BackupError";
        this.code = code;
    }
}
export function normalizeImportPolicy(value) {
    return value === "skip" || value === "overwrite" || value === "newest" ? value : "newest";
}
function sha256(buf) {
    return createHash("sha256").update(buf).digest("hex");
}
function stamp(d) {
    const p = (n) => String(n).padStart(2, "0");
    return d.getFullYear() + p(d.getMonth() + 1) + p(d.getDate()) + "-" + p(d.getHours()) + p(d.getMinutes()) + p(d.getSeconds());
}
function contextOf(manifest) {
    return {
        shellVersion: manifest.shellVersion,
        formatVersion: manifest.formatVersion,
        exportedAt: manifest.exportedAt,
    };
}
function validateManifest(value) {
    if (!value || typeof value !== "object")
        throw new BackupError("备份包缺少 manifest.json 或格式不正确");
    if (value.kind !== "dsh-workbench-backup")
        throw new BackupError("不是个人工作台备份文件");
    if (!Number.isInteger(value.formatVersion))
        throw new BackupError("备份包缺少格式版本");
    if (value.formatVersion !== BACKUP_FORMAT_VERSION) {
        throw new BackupError("备份格式版本 " + value.formatVersion + " 不兼容，当前工作台只支持版本 " + BACKUP_FORMAT_VERSION +
            "。请升级工作台，或使用对应版本导出。", "incompatible");
    }
    if (typeof value.exportedAt !== "string" || Number.isNaN(Date.parse(value.exportedAt))) {
        throw new BackupError("备份包缺少有效的导出时间");
    }
    if (typeof value.shellVersion !== "string" || !value.shellVersion)
        throw new BackupError("备份包缺少壳版本");
    if (!Array.isArray(value.modules))
        throw new BackupError("备份包缺少模块清单");
    if (value.modules.length > 100)
        throw new BackupError("备份包模块数超过上限");
    const seen = new Set();
    const modules = value.modules.map((raw) => {
        if (!raw || typeof raw !== "object")
            throw new BackupError("模块清单格式不正确");
        const id = String(raw.id || "");
        const title = String(raw.title || id);
        const version = String(raw.version || "");
        const file = String(raw.file || "");
        const size = Number(raw.size);
        const digest = String(raw.sha256 || "");
        if (!/^[a-z][a-z0-9_-]{2,63}$/.test(id))
            throw new BackupError("模块 id 不合法：" + id);
        if (seen.has(id))
            throw new BackupError("模块 id 重复：" + id);
        seen.add(id);
        if (!file || file.startsWith("/") || file.includes("\\") || file.split("/").some((p) => p === ".." || p === ".")) {
            throw new BackupError("模块文件路径不合法：" + file);
        }
        if (!Number.isInteger(size) || size < 0)
            throw new BackupError("模块文件大小不合法：" + id);
        if (!/^[a-f0-9]{64}$/.test(digest))
            throw new BackupError("模块校验值不合法：" + id);
        return { id, title, version, file, size, sha256: digest };
    });
    return {
        kind: "dsh-workbench-backup",
        formatVersion: value.formatVersion,
        shellVersion: value.shellVersion,
        exportedAt: value.exportedAt,
        modules,
    };
}
/** 导出选中的业务模块；任一模块失败则整体失败，避免产出缺数据的备份。 */
export async function createBackup(opts) {
    const wanted = opts.moduleIds && opts.moduleIds.length ? new Set(opts.moduleIds) : null;
    const selected = opts.domains.filter((d) => d.enabled && (!wanted || wanted.has(d.def.id)));
    if (!selected.length)
        throw new BackupError("没有可导出的模块");
    if (wanted) {
        const known = new Set(opts.domains.map((d) => d.def.id));
        for (const id of wanted)
            if (!known.has(id))
                throw new BackupError("模块未安装：" + id);
    }
    const exportedAt = new Date().toISOString();
    const shellVersion = opts.shellVersion;
    const manifestBase = {
        kind: "dsh-workbench-backup",
        formatVersion: BACKUP_FORMAT_VERSION,
        shellVersion,
        exportedAt,
    };
    const modules = [];
    const files = [];
    for (const rec of selected) {
        const def = rec.def;
        if (!def.exportData)
            throw new BackupError("模块未实现数据导出：" + def.title, "export");
        let data;
        try {
            data = await def.exportData({ shellVersion, formatVersion: BACKUP_FORMAT_VERSION, exportedAt });
        }
        catch (e) {
            throw new BackupError("模块「" + def.title + "」导出失败：" + String((e && e.message) || e), "export");
        }
        const text = typeof data === "string" ? data : JSON.stringify(data);
        if (!text)
            throw new BackupError("模块「" + def.title + "」没有可导出的数据", "export");
        const buf = Buffer.from(text, "utf8");
        const file = "modules/" + def.id + ".json";
        files.push({ name: file, data: buf });
        modules.push({
            id: def.id,
            title: def.title,
            version: def.version,
            file,
            size: buf.length,
            sha256: sha256(buf),
        });
    }
    const manifest = { ...manifestBase, modules };
    files.unshift({ name: "manifest.json", data: Buffer.from(JSON.stringify(manifest, null, 2), "utf8") });
    const now = new Date();
    return { filename: "dsh-workbench-backup-" + stamp(now) + ".zip", buffer: zipCreate(files), manifest };
}
/** 解压并逐模块分发导入；单个模块失败不会阻断其他模块。 */
export async function importBackup(opts) {
    let files;
    try {
        files = zipRead(opts.buffer);
    }
    catch (e) {
        throw new BackupError("无法读取备份压缩包：" + String((e && e.message) || e));
    }
    const manifestBuf = files.get("manifest.json");
    if (!manifestBuf)
        throw new BackupError("备份包缺少 manifest.json");
    let rawManifest;
    try {
        rawManifest = JSON.parse(manifestBuf.toString("utf8"));
    }
    catch {
        throw new BackupError("备份包 manifest.json 不是有效 JSON");
    }
    const manifest = validateManifest(rawManifest);
    const ctx = contextOf(manifest);
    const byId = new Map();
    for (const rec of opts.domains)
        byId.set(rec.def.id, rec);
    const results = [];
    const seen = new Set();
    for (const item of manifest.modules) {
        const policy = normalizeImportPolicy(opts.policies ? opts.policies[item.id] : undefined);
        const base = {
            id: item.id,
            title: item.title,
            moduleVersion: item.version,
            status: "failed",
            policy,
        };
        if (seen.has(item.id)) {
            results.push({ ...base, status: "skipped", message: "模块清单重复，已跳过" });
            continue;
        }
        seen.add(item.id);
        const rec = byId.get(item.id);
        if (!rec) {
            results.push({ ...base, status: "skipped", message: "当前未安装该模块，已跳过" });
            continue;
        }
        if (!rec.enabled || !rec.def.importData) {
            results.push({ ...base, status: "failed", message: rec.error || "模块未启用或未实现数据导入" });
            continue;
        }
        const data = files.get(item.file);
        if (!data) {
            results.push({ ...base, status: "failed", message: "备份包缺少模块文件：" + item.file });
            continue;
        }
        if (data.length !== item.size || sha256(data) !== item.sha256) {
            results.push({ ...base, status: "failed", message: "模块文件校验失败：" + item.file });
            continue;
        }
        let report;
        try {
            report = await rec.def.importData(data.toString("utf8"), ctx, { policy });
        }
        catch (e) {
            results.push({ ...base, status: "failed", message: String((e && e.message) || e) });
            continue;
        }
        const imported = Number(report && report.imported) || 0;
        const failed = Number(report && report.failed) || 0;
        const skipped = Number(report && report.skipped) || 0;
        const status = failed > 0 ? (imported > 0 ? "partial" : "failed") : report && report.ok ? "ok" : imported > 0 ? "partial" : "failed";
        results.push({
            ...base,
            status,
            imported,
            skipped,
            failed,
            message: report && report.message ? String(report.message) : undefined,
        });
    }
    const summary = { total: results.length, ok: 0, partial: 0, failed: 0, skipped: 0 };
    for (const r of results)
        summary[r.status] += 1;
    return {
        ok: summary.failed === 0 && summary.partial === 0,
        shellVersion: manifest.shellVersion,
        formatVersion: manifest.formatVersion,
        exportedAt: manifest.exportedAt,
        summary,
        results,
    };
}
