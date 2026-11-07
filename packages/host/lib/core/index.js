/** ./core/index.js 出口：存储、schema、仓储。宿主与云端共享此层语义。 */
export { openDb, uuidv7, monoNow } from "./db.js";
export { SCHEMA_SQL, SYNCED_TABLES } from "./schema.js";
export * from "./repo.js";
