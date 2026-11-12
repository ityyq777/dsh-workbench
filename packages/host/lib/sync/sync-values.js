export function stableStringify(value) {
    if (value === null)
        return "null";
    if (Array.isArray(value))
        return "[" + value.map((v) => stableStringify(v)).join(",") + "]";
    if (typeof value === "object") {
        const obj = value;
        return "{" + Object.keys(obj).sort().map((k) => JSON.stringify(k) + ":" + stableStringify(obj[k])).join(",") + "}";
    }
    return JSON.stringify(value);
}
export function parseObject(raw) {
    if (typeof raw !== "string" || !raw)
        return null;
    try {
        const v = JSON.parse(raw);
        return v && typeof v === "object" && !Array.isArray(v) ? v : null;
    }
    catch {
        return null;
    }
}
