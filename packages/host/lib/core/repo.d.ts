import type { DatabaseSync } from "node:sqlite";
/** 变更来源：ui/agent 本地写要进 change log；sync 回写不进（循环防护，05 文档）。 */
export type WriteOrigin = "ui" | "agent" | "sync";
/**
 * 平台同步层：只做「表无关」的事情。
 * 具体业务（任务增删改查）属于子插件，壳不 import、不硬编码。
 */
declare function tableExists(db: DatabaseSync, tableName: string): boolean;
/**
 * 应用一条远端 upsert（pull 路径）：行级 LWW —— 仅当服务端 updated_at 更大才覆盖；
 * 相等则以本地为准。输方（本地更新）写 conflict_shadow 供 UI 展示。
 * 表不存在（对应 addon 尚未安装）时直接跳过：数据仍在云端，安装后下次 pull 会补回。
 */
export declare function applyRemoteUpsert(db: DatabaseSync, tableName: string, remote: Record<string, unknown>, serverUpdatedAt: number): void;
/** 应用一条远端 delete（pull 路径）：本地打墓碑，不进 change log；表不存在则跳过。 */
export declare function applyRemoteDelete(db: DatabaseSync, tableName: string, rowId: string): void;
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
/** 记录已同步水位。 */
export declare function setSyncState(db: DatabaseSync, key: string, value: number): void;
export declare function getSyncState(db: DatabaseSync, key: string): number;
/** 供子插件宿主 API 复用：判断表是否存在。 */
export { tableExists };
