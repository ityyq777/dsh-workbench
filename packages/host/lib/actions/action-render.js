/**
 * 宿主元 action 的纯文本渲染：审计列表/记录/统计、action 列表、action 帮助。
 *
 * 单独成文件的原因：actions.ts 已贴近单文件 600 行上限，而这些函数只做字符串拼装，
 * 不读库、不发事件、不依赖注册表，拆出来后既便于单测，也让动作注册表保持可读。
 */
import { schemaChoices } from "./action-output.js";
export function renderAuditList(meta) {
    const lines = [
        "审计日志 " + meta.total + " 条（返回 " + meta.returned + " 条 · 第 " + meta.page + " 页 · 每页 " + meta.pageSize + "）",
    ];
    if (!meta.records.length)
        lines.push("（没有符合条件的记录）");
    for (const r of meta.records) {
        lines.push("");
        lines.push("#" + r.id + " " + r.time + " · " + r.actor + " · " + r.action + (r.ok ? "" : " ✗ 失败") +
            (r.durationMs ? " · " + r.durationMs + "ms" : ""));
        if (r.target)
            lines.push("  目标：" + r.target);
        if (r.error)
            lines.push("  错误：" + String(r.error).slice(0, 500));
        if (r.args)
            lines.push("  参数：" + String(r.args).slice(0, 300));
    }
    return lines.join("\n");
}
export function renderAuditRecord(r) {
    const lines = [
        "#" + r.id + " " + r.time,
        "入口：" + r.actor + " · 域：" + (r.domain || "（未知）") + " · " + (r.ok ? "成功" : "失败") + " · " + r.durationMs + "ms",
        "action：" + r.action,
    ];
    if (r.target)
        lines.push("目标：" + r.target);
    if (r.error)
        lines.push("错误：" + r.error);
    lines.push("", "参数：", r.args ? prettyJson(r.args) : "（无）", "", "结果：", r.result ? prettyJson(r.result) : "（无）");
    return lines.join("\n");
}
function prettyJson(text) {
    try {
        return JSON.stringify(JSON.parse(text), null, 2);
    }
    catch {
        return String(text);
    }
}
export function renderAuditStats(s) {
    const lines = ["最近 " + s.rangeDays + " 天：共 " + s.total + " 条，失败 " + s.failed + " 条"];
    if (s.byAction.length) {
        lines.push("", "按 action：");
        for (const a of s.byAction)
            lines.push("  " + a.action + " × " + a.count + (a.failed ? "（失败 " + a.failed + "）" : ""));
    }
    if (s.byActor.length) {
        lines.push("", "按入口：");
        for (const a of s.byActor)
            lines.push("  " + a.actor + " × " + a.count);
    }
    if (s.byDay.length) {
        lines.push("", "按天：");
        for (const d of s.byDay)
            lines.push("  " + d.day + " × " + d.count + (d.failed ? "（失败 " + d.failed + "）" : ""));
    }
    return lines.join("\n");
}
export function renderActionList(meta) {
    const lines = ["工作台 " + meta.shellVersion + " · " + meta.domains.length + " 个域 · " + meta.actions.length + " 个 action"];
    for (const d of meta.domains) {
        lines.push("", "[" + d.id + "] " + d.title + " v" + d.version + (d.enabled ? "" : "（未启用：" + d.error + "）"));
        for (const a of meta.actions) {
            if (a.domain !== d.id)
                continue;
            lines.push("  " + a.name + (a.description ? " — " + a.description : ""));
            const params = a.params ?? [];
            lines.push("    参数：" +
                (params.length
                    ? params.map((p) => (a.required.indexOf(p) >= 0 ? p : p + "?")).join(", ")
                    : "无（直接调用即可）"));
        }
    }
    lines.push("", '查看完整 JSON Schema 与示例：Workbench({ action: "actions.help", args: { action: "<name>" } })');
    return lines.join("\n");
}
export function renderActionHelp(help) {
    const lines = [help.name + " · " + help.domain, help.description || "（无描述）", "", "参数："];
    if (!help.params.length)
        lines.push("  无");
    for (const p of help.params) {
        lines.push("  " + p.name + (p.required ? "*" : "") + " (" + p.type + ")" + (p.description ? " — " + p.description : "") +
            (Array.isArray(p.enum) ? "；可选值：" + p.enum.join(" / ") : ""));
    }
    lines.push(...schemaChoices(help.input));
    lines.push("", "JSON Schema：", JSON.stringify(help.input, null, 2));
    if (help.examples.length) {
        lines.push("", "示例：");
        for (const ex of help.examples) {
            lines.push("  Workbench(" + JSON.stringify({ action: help.name, args: ex }) + ")");
        }
    }
    return lines.join("\n");
}
