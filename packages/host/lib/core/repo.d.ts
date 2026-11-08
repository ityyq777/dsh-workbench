import type { DatabaseSync } from "node:sqlite";
/** 变更来源：ui/agent 本地写要进 change log；sync 回写不进（循环防护，05 文档）。 */
export type WriteOrigin = "ui" | "agent" | "sync";
/**
 * 平台同步层：只做「表无关」的事情。
 * 具体业务（任务增删改查）属于子插件，壳不 import、不硬编码。
 */
declare function tableExists(db: DatabaseSync, tableName: string): boolean;
export declare function writeConflict(db: DatabaseSync, tableName: string, rowId: string, kind: string, resolution: string, local: Record<string, unknown> | null, server: Record<string, unknown> | null, serverUpdatedAt: number | null, localUpdatedAt: number | null): void;
/**
 * 应用一条远端 upsert（pull 路径）：严格行级 LWW。
 *  - 本地 updated_at 更大：保留本地，写 conflict_shadow；
 *  - 相等：payload 相同则幂等，不同则以服务端为准并写 shadow；
 *  - 远端更大：整行替换。
 * 表不存在（对应插件未安装）时直接跳过：数据仍在云端，安装后 snapshot 补回。
 */
export declare function applyRemoteUpsert(db: DatabaseSync, tableName: string, remote: Record<string, unknown>, serverUpdatedAt: number): boolean;
/**
 * 应用一条远端墓碑。v2 的 delete 事件带完整行 payload，走同一套 LWW；
 * 旧协议没有 payload 时退化为本地打墓碑（仍用远端事件时间，而不是本机时间）。
 */
export declare function applyRemoteDelete(db: DatabaseSync, tableName: string, rowId: string, remote?: Record<string, unknown> | null, serverUpdatedAt?: number): boolean;
/** 记录一条死信（单行/单表失败，不阻塞其他表）。 */
export declare function recordDeadLetter(db: DatabaseSync, tableName: string, rowId: string, op: string, payload: string | null, error: string): void;
/** 读取待推送的变更尾部（seq > afterSeq），按 seq 升序。 */
export declare function pendingChanges(db: DatabaseSync, afterSeq: number, limit?: number): {
    seq: number;
    table_name: string;
    row_id: string;
    op: string;
    payload: string | null;
    origin: string;
    updated_at: number;
}[];
/** 记录已同步水位（数字；v1 兼容）。 */
export declare function setSyncState(db: DatabaseSync, key: string, value: number): void;
export declare function getSyncState(db: DatabaseSync, key: string): number;
/** 文本水位：账号 id / epoch / 时间戳等统一入口。 */
export declare function setSyncStateText(db: DatabaseSync, key: string, value: string): void;
export declare function getSyncStateText(db: DatabaseSync, key: string): string;
export declare function deleteSyncState(db: DatabaseSync, key: string): void;
/** 供子插件宿主 API 复用：判断表是否存在。 */
export { tableExists };
