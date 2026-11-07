import { DatabaseSync } from "node:sqlite";
/** 打开（或创建）工作台本地库并跑基线 schema。单进程权威，WAL。 */
export declare function openDb(file: string): DatabaseSync;
/** UUIDv7：时间有序主键。demo 简化实现（48bit ms + rand）。 */
export declare function uuidv7(): string;
export declare function monoNow(): number;
