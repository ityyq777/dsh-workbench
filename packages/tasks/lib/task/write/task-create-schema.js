import limits from '../../../shared/tree/limits.cjs';
const { NAME_MAX, PATH_MAX, PATH_LEN_MAX } = limits;
import { DIFFICULTY_SCHEMA } from "../model/task-difficulty.js";
/** 单条与批量创建共用的完整参数契约。 */
export const TASK_CREATE_SCHEMA = {
      type: "object",
      required: ["title"],
      oneOf: [{required:["tableId"],not:{required:["tablePath"]}},{required:["tablePath"],not:{required:["tableId"]}}],
      properties: {
        title: { type: "string", description: "标题；只 trim + 非空校验，不做重名判重（标题不唯一，用 id 区分）" },
        description: { type: "string" },
        review: { type: "string", description: "完成后的感受/复盘（自由文本，默认空）" },
        tableId: { type: ["string", "number"], description: "目标存活任务表 id；与 tablePath 恰选一个，无默认表" },
        tablePath: { type: ['string','array'], maxLength: PATH_LEN_MAX, maxItems: PATH_MAX, items: {type:'string', maxLength: NAME_MAX}, description: `从逻辑根下一层起的精确名称路径；斜杠分隔字符串或字符串数组（名称含斜杠必须用数组）；禁止空段/点段，最多${PATH_MAX}段、每段${NAME_MAX}字符、总长${PATH_LEN_MAX}（JS length）` },
        createMissing: {type:'boolean',description:'仅tablePath可用；true时事务内建缺失组/表，默认false，不自动推断授权'},
        pathDescriptions: {type:'array',items:{type:'string'},description:'仅createMissing=true可用，长度与路径段相同；每个新节点职责描述必须非空且最多2000字符，已有节点不覆盖'},
        status: { type: ["string", "number"], description: "0=已开启/1=已关闭/2=已完成（不能直接创建 RESTARTED）；source=2 固定为 0；关闭/完成时优先级自动清零，不必手工传 0" },
        priority: { type: "number", description: "1..10（重启需优先级 >0，source=2 缺省 1，显式 0 报错；普通开启同样缺省 1；关闭/完成自动清零，不必手工传 0）" },
        difficulty: DIFFICULTY_SCHEMA,
        publishDate: { type: "string", description: "YYYY-MM-DD，缺省今天" },
        targetDate: { type: "string", description: "YYYY-MM-DD，缺省同 publishDate" },
        doneDate: { type: "string" },
        shutdownDate: { type: "string" },
        source: { type: ["string", "number"], description: "0 普通 / 1 时间线 / 2 重启（固定开启状态，priority 必须 1–10，缺省 1，不能传 0）" },
        timelineId: { type: ["string", "number"], description: "source=1 必须指定已有有效线；source=0 不可传；source=2 仅可等于原任务有效归属，无归属报 TIMELINE_REQUIRED_FOR_RESTART 且零写" },
        timelineKey: { type: ["string", "number"], description: "deprecated：timelineId 别名，同时传必须相同；source=1 二者至少一个" },
        restartKey: { type: ["string", "number"], description: "source=2 必填：原任务 id" },
        originTaskId: { type: ["string", "number"], description: "restartKey 的别名" },
        workspaceIds: { type: "array", items: { type: "string" }, description: "创建时关联的工作区 id：可多个；任一不存在/已删除则整条创建回滚；空数组或不传表示不关联" },
        tagIds: { type: "array", items: { type: "string" }, description: "创建时挂标签（需要标签域；未安装时忽略并在回执 notices 说明）；id 必须已存在，否则报错并列出可用标签" },
        tags: { type: "array", items: { type: "string" }, description: "创建时按标签名挂标签；默认自动创建未知名字，form.autoCreateTags=false 时未知名字报错并列出可用标签；标签域未安装时忽略并回执 notices" },
        dedupeKey: { type: "string", description: "幂等键：同键未删除任务存在时直接返回已有任务（deduped:true）" },
      },
    };
