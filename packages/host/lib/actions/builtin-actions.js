/**
 * 四个由 invokeAction 最前面特殊分发的内置 action（注册表里没有它们的 execute，
 * 也不能放进 META_ACTIONS，否则会被 META 通用分发吃掉）。
 * 仍然要出现在 actions.list({ domain: "wb-shell" }) 里：界面要看得见、能配置它们的 agent 开关。
 */
export const BUILTIN_ACTIONS = new Map([
    [
        "capabilities.list",
        {
            description: "列出每个业务插件记录什么、任务归属与首选 action；可按 domain 过滤。",
            input: {
                type: "object",
                properties: { domain: { type: "string", description: "只看某个业务域 id，如 wb-addon-tasks" } },
            },
            execute: () => {
                throw new Error("内置 action 由宿主特殊分发");
            },
        },
    ],
    [
        "capabilities.get",
        {
            description: "查看单个业务插件的完整能力清单（记录内容、warnings、首选 action 与 action 列表）。",
            input: {
                type: "object",
                properties: { domain: { type: "string", description: "业务域 id，如 wb-addon-tasks" } },
                required: ["domain"],
            },
            execute: () => {
                throw new Error("内置 action 由宿主特殊分发");
            },
        },
    ],
    [
        "actions.list",
        {
            description: "列出已安装业务域的 action、参数与必填项；domain 过滤、detail=true 给全量 schema。",
            input: {
                type: "object",
                properties: {
                    domain: { type: "string", description: "按域过滤（也可传 wb-shell 只看宿主 action）" },
                    detail: { type: "boolean", description: "true 时返回每个 action 的完整 input schema" },
                },
            },
            execute: () => {
                throw new Error("内置 action 由宿主特殊分发");
            },
        },
    ],
    [
        "actions.help",
        {
            description: "查看单个 action 的完整 JSON Schema、参数说明与示例。",
            input: {
                type: "object",
                properties: { action: { type: "string", description: "action 名，如 tasks.create" } },
                required: ["action"],
            },
            execute: () => {
                throw new Error("内置 action 由宿主特殊分发");
            },
        },
    ],
]);
