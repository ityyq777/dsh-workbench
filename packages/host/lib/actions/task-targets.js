import { getSyncStateText, setSyncStateText } from "../core/index.js";
import { actionErrorText } from "./action-output.js";
const PREFIX = "capability.taskTarget:";
/** Environment-local explicit mapping. No task schema or business rows are written here. */
export function createTaskTargets(db, domains, invoke) {
    function domainOf(raw) {
        const name = String(raw ?? "").trim();
        const domain = domains.get(name) || domains.get("wb-addon-" + name);
        if (!domain)
            throw new Error("DOMAIN_NOT_FOUND：没有该业务域；先调用 capabilities.list");
        return domain;
    }
    async function target(tableId) {
        const tasks = domains.get("wb-addon-tasks");
        if (!tasks || tasks.error || !tasks.actions.has("tasks.capabilities"))
            throw new Error("TASKS_UNAVAILABLE：任务发现能力不可用");
        const { result } = await invoke("tasks.capabilities", { tableId }, "agent");
        const table = result?.tables?.find((t) => String(t.id) === tableId);
        if (!table || !table.tablePath || !Array.isArray(table.pathSegments) || !table.pathSegments.length) {
            throw new Error("TABLE_NOT_FOUND：目标表不存在或路径无效");
        }
        return table;
    }
    async function get(rec) {
        const guidance = rec.def.capability?.taskOwnership;
        const tableId = getSyncStateText(db, PREFIX + rec.def.id) || null;
        const nextActions = [{ action: "tasks.resolveTable", args: { query: guidance?.query || rec.def.title } }];
        const base = { boundary: guidance?.boundary || "业务记录使用本域 action；开发/修复工作项使用 tasks.create。一次性问答与临时查询不建任务。", nextActions,
            configureAction: "capabilities.setTaskTarget", domain: rec.def.id };
        if (!tableId)
            return { ...base, configured: false, status: "unconfigured", message: "未配置任务归属；先 resolve 候选，由用户明确选择后配置。", tableId: null };
        try {
            const table = await target(tableId);
            return { ...base, configured: true, status: "configured", tableId, path: table.path, tablePath: table.tablePath,
                pathSegments: table.pathSegments, description: table.description, message: "显式配置优先；创建任务仍须传 tableId。" };
        }
        catch (error) {
            return { ...base, configured: false, status: "invalid", tableId: null, configuredTableId: tableId,
                message: "未配置有效任务归属；原映射失效，不使用同名表替代。", reason: actionErrorText(error) };
        }
    }
    const setAction = {
        description: "显式保存 domain→任务 tableId 映射，仅配置开发工作项归属，不改变业务记录职责、不创建表、不移动任务。tableId=null 清除；目标必须是存活且完整路径的任务表。配置保存在本机宿主 storage，不随业务数据同步。",
        input: { type: "object", properties: {
                domain: { type: "string", description: "已安装域 id 或简称，如 storage" },
                tableId: { type: ["string", "number", "null"], description: "tasks.capabilities/resolveTable 返回且经明确选择的目标表 id；null 清除配置" },
            }, required: ["domain", "tableId"] },
        examples: [{ domain: "storage", tableId: null }],
        async execute(args) {
            const rec = domainOf(args.domain);
            if (!Object.prototype.hasOwnProperty.call(args, "tableId"))
                throw new Error("TABLE_REQUIRED：必须显式提供 tableId；清除用 null");
            if (args.tableId !== null) {
                if (!["string", "number"].includes(typeof args.tableId) || !String(args.tableId).trim())
                    throw new Error("INVALID_TABLE_ID：tableId 必须是非空 string/number，清除用 null");
                await target(String(args.tableId).trim());
            }
            setSyncStateText(db, PREFIX + rec.def.id, args.tableId === null ? "" : String(args.tableId).trim());
            return get(rec);
        },
        render: (result) => renderTaskTarget(result),
    };
    return { get, setAction };
}
export function renderTaskTarget(value) {
    const lines = ["任务归属指引：" + value.boundary, value.message];
    if (value.configured)
        lines.push("目标：" + (value.pathSegments || []).map((p) => p.name).join(" / ") + "（tableId=" + value.tableId + "）；职责：" + (value.description || "未填写"));
    if (value.reason)
        lines.push("原因：" + value.reason);
    for (const action of value.nextActions || [])
        lines.push("下一步：Workbench(" + JSON.stringify(action) + ")");
    lines.push("配置入口：capabilities.setTaskTarget({domain:" + JSON.stringify(value.domain) + ",tableId:<明确选择的表id>})；null 可清除。");
    return lines.join("\n");
}
