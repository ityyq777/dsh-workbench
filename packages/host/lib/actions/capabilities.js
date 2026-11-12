import { renderTaskTarget } from "./task-targets.js";
export function createCapabilities({ domains, SHELL_VERSION, actionEntry, taskTargets }) {
    function findDomain(raw) {
        const key = String(raw ?? "").trim();
        if (!key)
            return null;
        for (const rec of domains.values()) {
            if (rec.def.id === key ||
                rec.def.id === "wb-addon-" + key ||
                rec.def.id.replace(/^wb-addon-/, "") === key) {
                return rec;
            }
        }
        return null;
    }
    /** 归一化能力依赖：声明了 requires 却没装对应域时，能力清单必须说出来，否则 agent 会照描述传参。 */
    function normalizeRequires(declared, warnings) {
        const requires = [];
        for (const raw of Array.isArray(declared?.requires) ? declared.requires : []) {
            const id = String(raw ?? "").trim();
            if (!id)
                continue;
            if (requires.indexOf(id) >= 0)
                continue;
            requires.push(id);
        }
        const missing = requires.filter((id) => !domains.has(id) && !domains.has("wb-addon-" + id));
        if (missing.length) {
            warnings.push("依赖未安装：" + missing.join("、") + "；相关参数（如 tagIds/tags）会报错，其余功能正常");
        }
        return { requires, missing };
    }
    /** 取业务域的能力清单；未声明时回退到域描述，保留 action 列表供 agent 自行判断。 */
    function capabilityOf(rec) {
        const declared = rec.def.capability;
        if (!declared) {
            return {
                summary: rec.def.description ?? rec.def.title,
                records: [],
                notFor: [],
                notes: [],
                fields: [],
                requires: [],
                missingRequires: [],
                source: "fallback",
                warnings: [],
            };
        }
        const warnings = [];
        const seen = new Set();
        const records = [];
        for (const raw of Array.isArray(declared.records) ? declared.records : []) {
            if (!raw || typeof raw !== "object")
                continue;
            const kind = String(raw.kind ?? "").trim();
            if (!kind) {
                warnings.push("存在缺少 kind 的记录声明，已忽略");
                continue;
            }
            if (seen.has(kind)) {
                warnings.push("记录类型重复：" + kind + "（只保留第一条）");
                continue;
            }
            seen.add(kind);
            const primaryAction = String(raw.primaryAction ?? "").trim();
            if (!primaryAction) {
                warnings.push(kind + "：缺少 primaryAction");
            }
            else if (!rec.actions.has(primaryAction)) {
                warnings.push(kind + "：primaryAction 未注册：" + primaryAction);
            }
            records.push({
                kind,
                title: String(raw.title ?? kind),
                description: String(raw.description ?? ""),
                when: Array.isArray(raw.when)
                    ? raw.when.filter((x) => typeof x === "string" && x.trim())
                    : [],
                notFor: Array.isArray(raw.notFor) ? raw.notFor : [],
                primaryAction,
                keyArgs: Array.isArray(raw.keyArgs) ? raw.keyArgs : [],
                dedupe: String(raw.dedupe ?? ""),
                relations: Array.isArray(raw.relations) ? raw.relations : [],
                examples: Array.isArray(raw.examples) ? raw.examples : [],
            });
        }
        // 字段字典：agent 最容易踩的坑是「方向/枚举/默认值」看不见（例如把 priority 当成越小越紧急）。
        const fields = [];
        const fieldNames = new Set();
        for (const raw of Array.isArray(declared.fields) ? declared.fields : []) {
            if (!raw || typeof raw !== "object")
                continue;
            const name = String(raw.name ?? "").trim();
            if (!name) {
                warnings.push("存在缺少 name 的字段声明，已忽略");
                continue;
            }
            if (fieldNames.has(name)) {
                warnings.push("字段重复：" + name + "（只保留第一条）");
                continue;
            }
            fieldNames.add(name);
            fields.push({
                name,
                type: String(raw.type ?? ""),
                description: String(raw.description ?? ""),
            });
        }
        if (!fields.length) {
            warnings.push("未声明字段字典（capability.fields）；agent 只能看到字段名，容易误解方向与枚举");
        }
        const deps = normalizeRequires(declared, warnings);
        return {
            summary: String(declared.summary ?? "").trim() || rec.def.description || rec.def.title,
            records,
            notFor: Array.isArray(declared.notFor) ? declared.notFor : [],
            notes: Array.isArray(declared.notes) ? declared.notes : [],
            fields,
            requires: deps.requires,
            missingRequires: deps.missing,
            source: "declared",
            warnings,
        };
    }
    /** capabilities.list：聚合各插件“记录什么、首选哪个 action”，给 agent 做统一发现。 */
    async function capabilityListMeta(args) {
        const kind = args.kind === undefined || args.kind === null ? "" : String(args.kind).trim();
        const out = [];
        for (const rec of domains.values()) {
            const cap = capabilityOf(rec);
            if (kind && !cap.records.some((r) => r.kind === kind))
                continue;
            out.push({
                id: rec.def.id,
                title: rec.def.title,
                version: rec.def.version,
                enabled: rec.error === null,
                error: rec.error,
                summary: cap.summary,
                source: cap.source,
                actionCount: rec.actions.size,
                requires: cap.requires ?? [],
                missingRequires: cap.missingRequires ?? [],
                records: cap.records.map((r) => ({
                    kind: r.kind,
                    title: r.title,
                    description: r.description,
                    primaryAction: r.primaryAction,
                })),
                taskOwnership: await taskTargets.get(rec),
                warnings: cap.warnings,
            });
        }
        return { shellVersion: SHELL_VERSION, kind, domains: out };
    }
    function renderCapabilityList(meta) {
        const lines = [
            "工作台 " + meta.shellVersion + " · " + meta.domains.length + " 个域" + (meta.kind ? "（kind=" + meta.kind + "）" : ""),
        ];
        for (const d of meta.domains) {
            lines.push("", "[" + d.id + "] " + d.title + " v" + d.version + (d.enabled ? "" : "（未启用：" + d.error + "）"));
            lines.push("  " + d.summary);
            if (d.taskOwnership)
                lines.push(renderTaskTarget(d.taskOwnership));
            if (!d.records.length) {
                lines.push("  （未声明能力清单；可用 action 见 actions.list）");
            }
            else {
                for (const r of d.records) {
                    lines.push("  " + r.kind + " → " + r.primaryAction + "：" + r.description);
                }
            }
            for (const w of d.warnings ?? [])
                lines.push("  ⚠ " + w);
        }
        lines.push("", '查看单个域的完整能力与 action 列表：Workbench({ action: "capabilities.get", args: { domain: "tasks" } })');
        return lines.join("\n");
    }
    /** capabilities.get：单个业务域的完整能力清单 + action 摘要（字段细节仍走 actions.help）。 */
    async function capabilityGetMeta(args) {
        const name = String(args.domain ?? args.id ?? "").trim();
        if (!name)
            throw new Error("缺少 domain；先用 capabilities.list 查看可用业务域");
        const rec = findDomain(name);
        if (!rec)
            throw new Error("没有该业务域：" + name + "；先用 capabilities.list 查看");
        const cap = capabilityOf(rec);
        return {
            shellVersion: SHELL_VERSION,
            domain: {
                id: rec.def.id,
                title: rec.def.title,
                description: rec.def.description ?? "",
                version: rec.def.version,
                enabled: rec.error === null,
                error: rec.error,
            },
            capability: {
                summary: cap.summary,
                taskOwnership: await taskTargets.get(rec),
                records: cap.records,
                notFor: cap.notFor,
                notes: cap.notes,
                fields: cap.fields ?? [],
                requires: cap.requires ?? [],
                missingRequires: cap.missingRequires ?? [],
            },
            source: cap.source,
            actions: [...rec.actions].map(([action, def]) => actionEntry(action, rec.def.id, def)),
            warnings: cap.warnings,
        };
    }
    function renderCapability(meta) {
        const d = meta.domain;
        const cap = meta.capability;
        const lines = [
            "[" + d.id + "] " + d.title + " v" + d.version + (d.enabled ? "" : "（未启用：" + d.error + "）"),
            cap.summary,
        ];
        if (cap.taskOwnership)
            lines.push(renderTaskTarget(cap.taskOwnership));
        if (Array.isArray(cap.requires) && cap.requires.length) {
            const missing = Array.isArray(cap.missingRequires) ? cap.missingRequires : [];
            lines.push("依赖：" +
                cap.requires
                    .map((id) => id + (missing.indexOf(id) >= 0 ? "（未安装）" : ""))
                    .join("、"));
        }
        if (meta.source === "fallback") {
            lines.push("", "该域未声明能力清单；以下 action 仍可直接调用。");
        }
        if (!cap.records.length) {
            lines.push("", "记录类型：未声明");
        }
        else {
            lines.push("", "记录类型：");
            for (const r of cap.records) {
                lines.push("- " + r.kind + " · " + r.title + " → " + r.primaryAction);
                if (r.description)
                    lines.push("  " + r.description);
                if (r.when.length) {
                    lines.push("  何时记录：");
                    for (const w of r.when)
                        lines.push("    - " + w);
                }
                if (r.notFor.length) {
                    lines.push("  不要记录：");
                    for (const w of r.notFor)
                        lines.push("    - " + w);
                }
                if (r.keyArgs.length)
                    lines.push("  常用参数：" + r.keyArgs.join(", "));
                if (r.dedupe)
                    lines.push("  去重：" + r.dedupe);
                if (r.relations.length) {
                    lines.push("  关系：");
                    for (const rel of r.relations) {
                        lines.push("    - " + rel.kind + " via " + rel.via + "：" + rel.description);
                    }
                }
                if (r.examples.length) {
                    lines.push("  示例：");
                    for (const ex of r.examples) {
                        const example = JSON.stringify({ action: r.primaryAction, args: ex.args ?? ex });
                        lines.push("    Workbench(" + example + ")" + (ex.purpose ? " // " + ex.purpose : ""));
                    }
                }
            }
        }
        if (cap.notFor.length) {
            lines.push("", "这个域不适合：");
            for (const w of cap.notFor)
                lines.push("  - " + w);
        }
        if (cap.notes.length) {
            lines.push("", "约束：");
            for (const w of cap.notes)
                lines.push("  - " + w);
        }
        const capFields = cap.fields ?? [];
        if (capFields.length) {
            lines.push("", "字段字典（方向/范围/默认值以此为准）：");
            for (const f of capFields) {
                lines.push("  " + f.name + (f.type ? " · " + f.type : "") + (f.description ? " — " + f.description : ""));
            }
        }
        lines.push("", "可用 action（" + meta.actions.length + "）：");
        for (const a of meta.actions)
            lines.push("  " + a.name + (a.description ? " — " + a.description : ""));
        lines.push("", '字段细节：Workbench({ action: "actions.help", args: { action: "<name>" } })');
        if (meta.warnings.length) {
            lines.push("", "⚠ 校验提示：");
            for (const w of meta.warnings)
                lines.push("  - " + w);
        }
        return lines.join("\n");
    }
    return { capabilityListMeta, renderCapabilityList, capabilityGetMeta, renderCapability };
}
