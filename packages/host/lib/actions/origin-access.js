/**
 * 来源全集，按固定顺序。
 * 这里刻意不从 @wb/sdk 运行时导入：宿主打包产物要能独立安装，不依赖 SDK 包在运行时存在。
 * 与 SDK 的 ALL_ACTION_ORIGINS 保持一致（types 层由 tsc 保证，值完全相同）。
 */
export const ALL_ACTION_ORIGINS = ["ui", "plugin", "agent", "sync"];
/**
 * 省略 origins 时的默认值：界面、插件、agent 三种来源默认都允许。
 * sync 不在默认里——云同步只能执行显式声明了 sync 的 action，
 * 否则一台设备上的旧版本客户端就能替另一台设备改数据。
 */
const DEFAULT_ORIGINS = ALL_ACTION_ORIGINS.filter((origin) => origin !== "sync");
/** meta 键前缀：一个 action 一行，值是来源数组的 JSON 文本。 */
export const ORIGIN_ACCESS_KEY_PREFIX = "config.wb-shell.actionOrigins.";
const KNOWN = new Set(ALL_ACTION_ORIGINS);
export function originAccessKey(action) {
    return ORIGIN_ACCESS_KEY_PREFIX + action;
}
/** 归一：去掉未知值与重复项，并固定成 ui/plugin/agent/sync 的先后顺序，便于比较与展示。 */
export function normalizeOrigins(input) {
    if (!Array.isArray(input))
        return null;
    const picked = new Set();
    for (const item of input)
        if (typeof item === "string" && KNOWN.has(item))
            picked.add(item);
    if (picked.size === 0)
        return null;
    return ALL_ACTION_ORIGINS.filter((origin) => picked.has(origin));
}
function writeMeta(handle, key, value) {
    if (value === null) {
        handle.prepare("DELETE FROM meta WHERE k = ?").run(key);
        return;
    }
    handle.prepare("INSERT INTO meta(k, v) VALUES(?, ?) ON CONFLICT(k) DO UPDATE SET v = excluded.v").run(key, value);
}
export function createOriginAccess(db, options = {}) {
    // 宿主一定给 db；这里留空值是给「无库」的测试与降级路径用：没有库就只有声明默认值。
    const store = db ?? null;
    const pinned = new Map();
    for (const [action, origins] of Object.entries(options.pinned ?? {})) {
        pinned.set(action, normalizeOrigins(origins) ?? []);
    }
    /** action 自身支持的上界：没写 origins 时取默认的 ui/plugin/agent（不含 sync）。 */
    function declaredValue(def) {
        const value = normalizeOrigins(def && def.origins);
        return value ?? DEFAULT_ORIGINS.slice();
    }
    /**
     * 默认启用的来源：写了 originsDefault 就取它（与上界取交集），没写就等于上界。
     * 「支持 agent 但默认不给」写成 origins: ["ui","agent"] + originsDefault: ["ui"]。
     */
    function defaultEnabled(action, def) {
        const fixed = pinned.get(action);
        if (fixed)
            return fixed;
        const supported = declaredValue(def);
        const value = normalizeOrigins(def && def.originsDefault);
        if (value === null)
            return supported;
        return supported.filter((origin) => value.includes(origin));
    }
    /** 本机覆盖；没写过返回 null，读失败或值无效返回 failed（调用方按关闭处理）。 */
    function override(action) {
        if (!store)
            return { value: null, failed: false };
        let raw = "";
        try {
            const row = store.prepare("SELECT v FROM meta WHERE k = ?").get(originAccessKey(action));
            raw = row && row.v !== undefined && row.v !== null ? String(row.v).trim() : "";
        }
        catch {
            return { value: null, failed: true };
        }
        if (raw === "")
            return { value: null, failed: false };
        let parsed;
        try {
            parsed = JSON.parse(raw);
        }
        catch {
            return { value: null, failed: true };
        }
        const value = normalizeOrigins(parsed);
        return value === null ? { value: null, failed: true } : { value, failed: false };
    }
    /**
     * 生效值：声明值是上界，本机覆盖只能在其中取舍。
     * 读不到覆盖 → 用声明默认值（originsDefault）；覆盖读坏 → 空集合（fail closed，什么都拒绝）。
     */
    function effective(action, def) {
        const fixed = pinned.get(action);
        if (fixed)
            return fixed;
        const supported = declaredValue(def);
        const own = override(action);
        if (own.failed)
            return [];
        if (own.value === null)
            return defaultEnabled(action, def);
        // 与声明值取交集：即使 meta 里被人手写了 agent，声明不支持也不会生效。
        const narrowed = supported.filter((origin) => own.value.includes(origin));
        return narrowed;
    }
    function allows(action, def, origin) {
        return effective(action, def).includes(origin);
    }
    /**
     * 改配置：只允许在 action 声明的范围内取舍。
     * 与声明值相同时删掉覆盖行（不留脏 meta），否则写入归一后的数组。
     */
    function set(action, def, origins) {
        if (pinned.has(action))
            throw new Error("该 action 的允许来源被固定，不能修改：" + action);
        const next = normalizeOrigins(origins);
        if (next === null)
            throw new Error("origins 至少要包含一个来源（ui / plugin / agent / sync）");
        const base = declaredValue(def);
        const unsupported = next.filter((origin) => !base.includes(origin));
        if (unsupported.length > 0) {
            throw new Error("该 action 本身不支持这些来源：" + unsupported.join("、") + "；它支持的来源是 " + base.join("、"));
        }
        // 与「默认值」相同就删掉覆盖行：默认值可能是 originsDefault，不一定是上界。
        const preset = defaultEnabled(action, def);
        if (next.length === preset.length && next.every((origin, index) => origin === preset[index])) {
            writeMeta(store, originAccessKey(action), null);
            return { origins: preset, source: "declared" };
        }
        writeMeta(store, originAccessKey(action), JSON.stringify(next));
        return { origins: next, source: "meta" };
    }
    return { declaredValue, defaultEnabled, override, effective, allows, set };
}
