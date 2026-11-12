/** Preserve actionable business errors in both text-only Workbench and UI RPC. */
export function actionErrorText(error) {
    const e = error;
    const message = String(e?.message ?? error);
    const code = e?.code === undefined ? "" : String(e.code);
    const headline = code && !message.includes(code) ? code + "：" + message : message;
    return headline + (e?.details === undefined ? "" : "\n详细信息：" + JSON.stringify(e.details, null, 2));
}
/** Runtime validation belongs to each action; expose nested combinators in human help too. */
export function schemaChoices(schema, path = "args") {
    if (!schema || typeof schema !== "object")
        return [];
    const lines = [];
    if (Array.isArray(schema.oneOf)) {
        lines.push(path + " 必须恰好满足一个分支（oneOf，不能同时提供互斥目标）：");
        schema.oneOf.forEach((branch, i) => {
            lines.push("  " + (i + 1) + ". " + (branch.description || branch.title || "必填 " + (branch.required || []).join("、")) + "；约束 " + JSON.stringify(branch));
        });
    }
    for (const [name, child] of Object.entries(schema.properties || {}))
        lines.push(...schemaChoices(child, path + "." + name));
    if (schema.items)
        lines.push(...schemaChoices(schema.items, path + "[]"));
    return lines;
}
