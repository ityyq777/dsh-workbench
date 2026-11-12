/**
 * 任务记录业务插件（DSH 原生插件）。
 *
 * 所有业务逻辑都在本地 SQLite 完成；云端只负责备份。
 * 宿主由 dsh-workbench 提供，通过 ctx.workbench.registerDomain 注册。
 */

import { registerActivityCalendarAction } from "./stats/activity-calendar.js";
import { registerTimelineStatsAction } from "./stats/timeline-stats.js";
import { DIFFICULTY_GUIDANCE } from "./task/model/task-difficulty.js";
import { bindClock, ensureSchema } from "./db/db.js";
import { exportTasksData, importTasksData } from "./infra/backup.js";
import { taskSync } from "./infra/sync.js";
import { registerTaskActions } from "./tasks.js";
import { registerTreeActions } from "./tree/tree.js";
import { registerOverviewAction } from "./stats/overview.js";
import { registerConfigActions } from "./infra/config.js";
import { registerDataActions } from "./infra/data.js";
import { registerPublisherCommand } from "./publisher/command.js";
import { commandCatalog } from "./publisher/catalog.js";

export const inject = ["workbench"];

let domainApi = null;
function requireApi() {
  if (!domainApi) throw new Error("任务模块尚未初始化");
  return domainApi;
}


/**
 * 只读「Action」页的数据源完全由插件自己维护：注册时记录 action 定义，
 * 再由本插件注册的 <域>.actionSchema 返回，不经过宿主 schema 接口。
 */
function trackActions(api) {
  const defs = new Map();
  const rawAction = typeof api.action === "function" ? api.action.bind(api) : null;
  if (rawAction) {
    api.action = function (name, def) {
      defs.set(name, def || {});
      return rawAction(name, def);
    };
  }
  return defs;
}

/**
 * 只读命令目录：「命令」页与 agent 都用它发现本插件注册了哪些斜杠命令。
 * 数据来自 publisher/catalog.js 的同一份数组，页面不重复维护文案。
 */
function registerCommandsAction(api) {
  api.action("tasks.commands", {
    description: "只读：返回本插件注册的斜杠命令目录（名称、用途、用法、输入提示、字符上限、示例、说明，含只读提示词模板），供「命令」页渲染；不执行命令、不写库、不产生审计",
    input: { type: "object", properties: {}, additionalProperties: false },
    examples: [{}],
    execute: () => {
      const commands = commandCatalog();
      return { count: commands.length, commands: commands };
    },
  });
}

function registerActionSchemaAction(api, defs, domain) {
  const prefix = domain.replace(/^wb-addon-/, "");
  api.action(prefix + ".actionSchema", {
    description: "只读：返回本插件运行时注册的 action schema（供「Action」页渲染；不执行任何 action、不写库、不产生审计）",
    input: { type: "object", properties: {}, additionalProperties: false },
    execute: () => ({
      shellVersion: api.shellVersion || "",
      domains: [{ id: domain, version: api.addon && api.addon.version ? api.addon.version : "" }],
      actions: Array.from(defs, ([name, def]) => ({
        name: name,
        domain: domain,
        description: typeof def.description === "string" ? def.description : "",
        input: def.input && typeof def.input === "object" ? def.input : { type: "object", properties: {} },
        examples: Array.isArray(def.examples) ? def.examples : [],
      })),
    }),
  });
}

/** 旧 addon 形态的初始化函数，单测/兼容直接调用。 */
export function setup(api) {
  domainApi = api;
  if (typeof api.now === "function") bindClock(api.now);
  ensureSchema(api.db, api.log);
  const actionDefs = trackActions(api);
  registerTaskActions(api);
  registerActivityCalendarAction(api);
  registerTimelineStatsAction(api);
  registerTreeActions(api);
  registerOverviewAction(api);
  registerConfigActions(api);
  registerDataActions(api);
  registerCommandsAction(api);
  registerActionSchemaAction(api, actionDefs, "wb-addon-tasks");
  api.log("tasks domain ready", api.addon.version);
}

export function apply(ctx) {
  const host = ctx.workbench;
  if (!host) throw new Error("dsh-workbench 未加载：缺少 workbench 服务");
  ctx.effect(
    () =>
      host.registerDomain({
        id: "wb-addon-tasks",
        title: "任务",
        description: "任务树 + 统计/记录/时间线/配置/数据五个视图：紧急/已关闭/已开启/已完成/总览，可按标签筛选（需安装标签插件），附统计报表与只读数据浏览",
        version: "5.2.6",
        tables: ["task", "task_node", "task_timeline", "task_timeline_link", "task_workspace", "task_workspace_link"],
        sync: taskSync,
        views: [
          { id: "stats", title: { zh: "统计", en: "Stats" } },
          { id: "tasks", title: { zh: "记录", en: "Records" } },
          { id: "timeline", title: { zh: "时间线", en: "Timeline" } },
          { id: "config", title: { zh: "配置", en: "Config" } },
          { id: "data", title: { zh: "数据", en: "Data" } },
        ],
        capability: {
          summary: "记录可执行、可交付的工作项（任务），支持任务树、时间线、重启链与工作区关联。",
          records: [
            {
              kind: "task",
              title: "任务",
              description: "一个有明确结果的工作项；可以归入任务表、时间线或重启链，并挂标签。",
              when: [
                "一个工作项已经完成，或已经有明确下一步，值得进入工作台继续跟进",
                "用户明确说“记一下 / 建个任务 / 加到工作台 / 以后要做”",
                "会话中发现需要后续处理、但当前不立即完成的动作",
              ],
              notFor: [
                "纯信息查询或一次性问答，没有可执行结果",
                "没有明确标题或完成标准的模糊想法；先描述清楚再记",
              ],
              primaryAction: "tasks.create",
              keyArgs: ["tableId", "tablePath", "createMissing", "pathDescriptions", "title", "description", "priority", "difficulty", "targetDate", "tags", "tagIds", "dedupeKey"],
              dedupe: "同 dedupeKey 的未删除任务会被复用；自动记录建议使用稳定键，如 dsh-session:<id>。",
              relations: [
                { kind: "taskNode", via: "tableId", description: "先调用 taskNodes.overview 查看全文描述、类型、路径与子树计数，再用 tasks.create 的 tableId 选表；group/root_group 只能装子节点，table 才能直接放任务。创建必须显式tableId或tablePath且互斥；无默认表。优先tasks.capabilities/resolveTable核对职责；新路径授权后用createMissing+pathDescriptions。" },
                { kind: "tag", via: "tags / tagIds", description: "用标签做主题归类（工作/生活/学习/开发 已是标签）；传标签名会自动建。" },
                { kind: "taskWorkspace", via: "workspaceIds", description: "工作区是本机目录或逻辑分组（可空目录），与任务多对多；先用 taskWorkspaces.list 选，创建时传 workspaceIds。" },
              ],
              examples: [
                {
                  purpose: "记录一次已完成的工作项",
                  args: {
                    tableId: "已核对的任务表id",
                    title: "整理工作台能力清单",
                    description: "梳理各插件 action 与记录边界",
                    tags: ["开发"],
                    priority: 6,
                    difficulty: 3,
                    targetDate: "2026-11-08",
                  },
                },
              ],
            },
          ],
          fields: [
            { name: "includeSingletons / timelineKeys", type: "boolean / string[]", description: "tasks.timelines默认20条且只显示多任务线；timelineKeys用于timelineRefactor整线合并，与ids互斥，目标必须在所选keys中；dryRun返回wouldUpdate及total完整计数，无list上限。" },
            { name: "lastActivityDate", type: "YYYY-MM-DD", description: "时间线有效成员发布/完成/关闭日及创建/修改本地日最大值；不含计划targetDate，排除已重启和已删除成员；openCount仅status0，doneCount仅status2。" },
            { name: "statuses / urgent", type: "integer[] / boolean", description: "list/非ids export：statuses 为 0/1/2/3/4 整数数组，与 urgent 取 OR，再与其他筛选 AND。紧急为开启且(priority>=6或targetDate<=今天+2)。不传 statuses/urgent 时不过滤状态，返回全部状态（含已重启）；空数组且 urgent=false 同样为全部；缺少另一参数时默认 []/false。旧参数 tab、filterRestarted 已移除，传入会报错。" },
            { name: "publishFrom / publishTo / doneFrom / doneTo / shutdownFrom / shutdownTo / claimedFrom / claimedTo", type: "YYYY-MM-DD", description: "list/非ids export 四组闭区间，两端独立可选，空串不筛，真实日期校验；日期前10位与其他条件AND。完成范围要求状态2，关闭范围要求状态1，接取范围要求状态 IN (2,4) 且按 COALESCE(claimed_at 本地日, 发布日) 比较（历史任务按发布日近似）；完成与关闭范围同时非空则交集为空。反序交换后filter回显并返回publish_range_swapped/done_range_swapped/shutdown_range_swapped/claimed_range_swapped notice。" },
            { name: "year", type: "integer 1900..9999", description: "tasks.activityCalendar 必填年份：独立年度稀疏日历，publish/done/shutdown 三类事件计数及 totals/max（含 total）" },
            { name: "activityDate / activityType", type: "YYYY-MM-DD / publish|done|shutdown", description: "list/非ids export 活动日筛选；type 缺省 done，有 type 必须有日期。单类事件，与既有条件 AND；与日历同口径，完整日点击请传 statuses=[]" },
            { name: "status", type: "0|1|2|3", description: "0=已开启 ACTIVE、1=已关闭 SHUTDOWN、2=已完成 DONE、3=已重启 RESTARTED（创建时不允许 3）；也接受 open/done。别按“0=未开始”理解：0 是在办" },
            { name: "priority", type: "1..10（关闭/完成为 0）", description: "数值越大越紧急，不是越小越急；已开启任务必须 P1..P10（显式传 0 会报错，缺省 P1）；已关闭/已完成/已重启一律 P0，传值被忽略；>=6 满足紧急谓词；参数优先级 min/max 同样是数值越大越急" },
            { name: "difficulty", type: "0..5", description: DIFFICULTY_GUIDANCE },
            { name: "sort", type: "string", description: "priority / target（targetDate）/ publish（publishDate）/ updated / created；前缀 - 表示降序，例如 sort=-priority 才是最紧急在前；不传时未分页按 priority 降序，分页（传 pageNumber/pageSize）按 publishDate 降序" },
            { name: "order", type: "asc|desc", description: "显式指定排序方向，覆盖 sort 前缀" },
            { name: "targetDate", type: "YYYY-MM-DD", description: "目标日期（截止）；缺省表示未定；targetFrom/targetTo 按它过滤，target<今天且未完成即视为逾期" },
            { name: "publishDate", type: "YYYY-MM-DD", description: "发布日期，缺省为创建当天" },
            { name: "doneDate", type: "YYYY-MM-DD|null", description: "完成日期，改成已完成时自动补今天" },
            { name: "shutdownDate", type: "YYYY-MM-DD|null", description: "关闭日期，改成已关闭时自动补今天" },
            { name: "titleKey", type: "string", description: "关键词，字面包含匹配标题、描述、感受（OR）；%/_/反斜杠按普通字符，ASCII 大小写不敏感；list 与非 ids 导出共用" },
            { name: "tableKey", type: "string", description: "任务表关键词，同时匹配表名与表描述" },
            { name: "tableId / groupId", type: "string|number", description: "按任务表 / 任务组过滤；groupId 含义是该组下所有任务表" },
            { name: "tags / tagIds", type: "string[]", description: "写入时是整体替换（会覆盖原有标签，批量套用最危险）；读取时是“命中任一”过滤。tags 传标签名，不存在会自动建" },
            { name: "addTags / removeTags / addTagIds / removeTagIds", type: "string[]", description: "增量加/减标签，保留其余标签；不能与 tags/tagIds 同时传" },
            { name: "pageNumber / pageSize", type: "number", description: "页码从 1 开始，每页默认 12、上限 200（超出按 200 截断，filter.pageSizeCapped=true）；传 pageNumber 或 pageSize 即分页。返回 total=真实总数、returned=本页条数、truncated=是否还有未返回的；未分页最多 500 条，超出时 truncated=true" },
            { name: "title", type: "string", description: "任务标题，仅 trim + 非空校验；标题不唯一，允许与其它任务重名，用 id 区分（标签名唯一、任务节点名同级唯一，别混）" },
            { name: "type", type: "0|1|2|3|4", description: "仅 tasks.update 使用：0=改状态 1=改优先级 2=改标题 3=改描述 4=改感受；这是“更新模式”，不是任务类型（任务没有类型字段，用标签表达）" },
            { name: "review", type: "string", description: "完成后的感受/复盘自由文本，通常随完成一起写入" },
            { name: "range / from / to", type: "7d|30d|90d|365d|all / YYYY-MM-DD", description: "仅统计类 action：range 是快捷区间（缺省 30d），from+to 手动区间是闭区间 [from,to]，两端都含；同时传时以 from/to 为准" },
            { name: "dedupeKey", type: "string", description: "去重键：同键的未删除任务会被复用而不是新建，自动记录建议用 dsh-session:<id>" },
            { name: "source / timelineId / timelineKey / restartKey", type: "0|1|2 / string", description: "来源：0=无时间线普通任务；1=加入手动创建的有效时间线，需要timelineId（timelineKey为deprecated兼容别名）；2=重启，需restartKey且原任务已有有效归属，自动继承同一线；无归属先手动建线并关联，失败零写。重启固定开启、优先级1–10缺省1。" },
          ],
          notFor: ["不要用它保存聊天记录、日志或临时笔记"],
          notes: [
            "已有开发/修复/设计任务核对完整路径和职责后选择；确认新子模块形态、无合适表且获授权才建路径，不每条新建。一次性问答不建任务；物品登记走storage.create，开发storage功能才走tasks。多候选询问用户，绝不按热度/首项自动选择。",
            "先 taskNodes.overview 再 tasks.create，不要凭感觉选表；overview 默认描述全文，maxDescriptionLength 可选，count 为未删除任务的子树总数（所有状态）。",
            "date 字段均为 YYYY-MM-DD；source=1 需有效 timelineId（兼容 timelineKey）；source=2 需 restartKey 且原任务已有有效时间线。",
            "状态机：0 已开启 → 1 已关闭（补 shutdownDate）/ 2 已完成（补 doneDate）；1 或 2 可回到 0 继续办理（优先级自动回落到 1）。3 已重启不在创建时使用：重启老任务时先把它置 3，再建 source=2 的新任务。",
            "restart_key = 重启链的链首任务 id：普通任务等于自身 id，source=2 的新任务继承原任务；同一 restart_key 的任务按 publishDate 组成一条重启链，用 tasks.restart 读取。",
            "时间线必须用taskTimelines.create手动创建；普通任务timelineId为null，source=1/attach仅关联现有实体。timelineKey是timelineId的deprecated兼容别名，不再以自身id占位。重启强制继承同一有效线，无关联先提示建立并关联。历史key仅保留待审阅，不自动回填；tasks.timeline读取关联成员，timelineRefactor移动已有关系。",
            "优先级不变量：已开启任务 P1..P10（创建默认 1，显式 0 报错）；重启需优先级 >0（source=2 缺省 1，显式 0 报错）；UI 重启继承原任务有效优先级，原值为 0 则回落配置默认并限制到 1–10；改成已完成/已关闭自动清零，不必手工传 0；关闭/完成/已重启一律 P0，写入 0..10 都会被忽略。旧库启动时自动回填（关闭态清零、开启态 0→1），幂等。",
            "标签域是可选能力：未安装时不阻断任务读写，写入忽略 tags/tagIds/addTags/removeTags 并在回执带 notices（code=tag_domain_missing）；读侧省略 tags 字段、按标签筛选返回空结果、tasks.tags available=false。",
            "任务标题不唯一：允许同名，用 id 区分；与「标签名唯一」「任务节点名同级唯一」是不同规则。",
            "任务没有「类型」字段：工作/生活/学习/开发 已迁成同名标签，用 tags 或 tagIds 归类。",
            "标签写入规则：tags/addTags 传名字，默认自动创建未知名字（配置 form.autoCreateTags 关掉后改为报错并列出可用标签）；tagIds/addTagIds 传 id，必须已存在，否则报错并列出可用标签；create/update/bulkCreate/bulkUpdate 共用同一套校验。",
            "标签下拉用 tasks.tagOptions（text 模糊匹配、pageNumber/pageSize 分页，返回 total/hasMore）按需取数；tasks.tags 会一次返回全部标签及计数，只适合导航/统计这类需要全量的场景。",
          ],
        },
        setup,
        exportData: () => exportTasksData(requireApi()),
        importData: (raw, _ctx, options) => importTasksData(requireApi(), raw, options),
      }),
    "tasks-domain",
  );
  // 斜杠命令：缺少 commands 服务时 registerPublisherCommand 内部静默跳过，
  // 不影响插件加载（ACP/无 UI 环境没有该服务）。
  ctx.effect(() => registerPublisherCommand(ctx), "tasks-publisher-command");
}