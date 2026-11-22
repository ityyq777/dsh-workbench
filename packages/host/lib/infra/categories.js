/** 栏目顺序即首页展示顺序。 */
export const HOME_CATEGORIES = [
    { id: "work", title: "工作与计划", titleEn: "Work & Planning" },
    { id: "comm", title: "沟通与消息", titleEn: "Communication" },
    { id: "assets", title: "资产与资料", titleEn: "Assets & Docs" },
    { id: "finance", title: "财务", titleEn: "Finance" },
    { id: "auto", title: "自动化与集成", titleEn: "Automation & Integrations" },
    { id: "other", title: "其他", titleEn: "Other", fallback: true },
];
/** 兜底栏目 id。 */
export const FALLBACK_CATEGORY_ID = "other";
const KNOWN_CATEGORY_IDS = new Set(HOME_CATEGORIES.map((c) => c.id));
/**
 * 把插件声明的栏目解析成宿主认可的 id。
 * - 命中：原样返回；
 * - 未声明 / 空串 / 非字符串：落兜底，status=missing；
 * - 未知 id：落兜底，status=unknown（调用方据此打日志）。
 */
export function resolveCategory(raw) {
    const declared = typeof raw === "string" ? raw.trim() : "";
    if (!declared)
        return { id: FALLBACK_CATEGORY_ID, status: "missing" };
    if (KNOWN_CATEGORY_IDS.has(declared))
        return { id: declared, status: "ok" };
    return { id: FALLBACK_CATEGORY_ID, status: "unknown", declared };
}
/** /workbench/api/domains 返回的栏目定义（含中英文名与兜底标记）。 */
export function publicCategories() {
    return HOME_CATEGORIES.map((c) => ({
        id: c.id,
        title: c.titleEn ? { zh: c.title, en: c.titleEn } : { zh: c.title },
        fallback: c.fallback === true,
    }));
}
