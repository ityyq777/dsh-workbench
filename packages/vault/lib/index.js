/**
 * wb-addon-vault：独立凭据保险箱域。
 * 明文只在 UI reveal 或 plugin lease 时短暂出现；agent 永远拿不到。
 * 0.3.0：集合层（分组 ⊃ 集合 ⊃ 凭据）+ 七种通用凭据类型；密文与口令包裹上云，device key 与使用记录留本机。
 * 0.3.1：凭据表单明文支持小眼睛临时显示；主口令/删除确认改用应用内弹层（桌面端不支持 window.prompt）。
 * 0.3.3：备注两栏合并为单个「备注」（meta.note）；新建分组改弹窗并可直接勾选集合。
 * 0.3.4：集合选择改用共享 filter-checklist（关键字搜索 + 滚动分页），任务/站点/储物标签筛选同步复用。
 * 0.3.6：口令输入框统一用共享的明文切换控件（lib/secret-field.cjs），初始化页主/确认口令、解锁页与口令弹层都能点小眼睛看明文，各自独立切换。
 * 0.3.5：修复「保存凭据后列表不新增」——客户端 unwrap 对 ok:false 抛错、锁定态在凭据页提示并可内联解锁、写成功后无条件刷新列表。
 */
import { ensureSchema, bindClock } from "./db/db.js";
import { createVault } from "./domain/vault.js";
import { createGroups } from "./domain/groups.js";
import { registerVaultActions } from "./domain/actions.js";

export const name = "dsh-workbench-vault";
export const inject = ["workbench"];

export function apply(ctx) {
  const host = ctx.workbench;
  if (!host) throw new Error("wb-addon-vault 依赖 workbench 宿主");
  ctx.effect(() => host.registerDomain(createDomain(host)), "vault-domain");
}

export function createDomain(host) {
  let vault = null;
  let groups = null;
  let schemas = [];

  return {
    id: "wb-addon-vault",
    title: "凭据保险箱",
    description: "集中保存密码、授权码与 token；按分组授权给业务模块，加密落库、密文可同步。",
    version: "0.4.2",
    category: "assets",
    tables: [
      "vault_header",
      "vault_device",
      "vault_group",
      "vault_secret",
      "vault_set",
      "vault_group_set",
      "vault_set_secret",
      "vault_binding",
      "vault_subject_type",
      "vault_secret_usage",
    ],
    sync: {
      tables: [
        { name: "vault_header", mode: "row", uniqueKeys: [["id"]], uniquePolicy: "lww" },
        { name: "vault_secret", mode: "row", uniqueKeys: [["id"], ["name"]], uniquePolicy: "lww-tombstone" },
        { name: "vault_group", mode: "row", uniqueKeys: [["id"], ["name"]], uniquePolicy: "lww-tombstone" },
        {
          name: "vault_binding",
          mode: "row",
          uniqueKeys: [["id"], ["subject_type", "subject_id", "group_id"]],
          uniquePolicy: "lww-tombstone",
        },
        { name: "vault_subject_type", mode: "row", uniqueKeys: [["id"], ["type"]], uniquePolicy: "lww-tombstone" },
        { name: "vault_set", mode: "row", uniqueKeys: [["id"], ["name"]], uniquePolicy: "lww-tombstone" },
        {
          name: "vault_group_set",
          mode: "row",
          uniqueKeys: [["id"], ["group_id", "set_id"]],
          uniquePolicy: "lww-tombstone",
        },
        {
          name: "vault_set_secret",
          mode: "row",
          uniqueKeys: [["id"], ["set_id", "secret_id"]],
          uniquePolicy: "lww-tombstone",
        },
      ],
    },
    views: [
      { id: "status", title: "保险箱", icon: "shield" },
      { id: "secrets", title: "凭据", icon: "key" },
      { id: "sets", title: "集合与账号", icon: "layers" },
      { id: "groups", title: "分组与关联", icon: "folder" },
      { id: "config", title: "设置", icon: "sliders" },
      { id: "data", title: "数据", icon: "database" },
      { id: "actions", title: "Action 清单", icon: "list" },
    ],
    capability: {
      summary:
        "保存连接器/站点需要的密码、手机号、证件号与 token；分组挂集合，集合可标一个账号（可重复、可留空）再装凭据，明文只向 UI 或 plugin 租约暴露。",
      records: [
        {
          kind: "set",
          table: "vault_set",
          title: "集合与账号",
          description:
            "凭据容器，可标一个账号（可重复、可留空）：有账号的是账号集合，留空的是普通集合，条目只按 id 区分；一个集合能挂到多个分组，也能装多条凭据，删除只断关联。",
          when: ["同一个业务账号要复用多条凭据", "一份凭据要给多个分组使用"],
          primaryAction: "vault.setList",
        },
        {
          kind: "secret",
          table: "vault_secret",
          title: "凭据",
          description: "一条加密凭据（密码/手机号/证件号/token），可加入多个集合，列表只显示名称与备注。",
          when: ["需要保存邮箱密码或授权码", "连接器要绑定一个 token", "想在 agent 面前隐藏明文"],
          primaryAction: "vault.secretCreate",
        },
        {
          kind: "group",
          table: "vault_group",
          title: "凭据分组",
          description: "把多条凭据收成一组，业务对象通过 vault_binding 关联到组，而不是逐条绑定。",
          when: ["一个站点/邮箱要复用多条凭据", "按用途（邮件、订阅、支付）归类"],
          primaryAction: "vault.groupCreate",
        },
      ],
      fields: [
        { name: "name", type: "string", description: "唯一名称" },
        {
          name: "kind",
          type: "password|phone|id_card|token|app_password|api_key|other",
          description: "凭据类型；密码/手机号/证件号/Token/授权码/API Key/其它",
        },
        { name: "groupId", type: "string", description: "所属分组，可空；写入时自动挂到该组的默认集合" },
        { name: "setId", type: "string", description: "直接指定所属集合，优先于 groupId" },
        { name: "account", type: "string", description: "集合上的账号，可空、可重复；留空即普通集合" },
        { name: "meta", type: "object", description: "非敏感备注（用户名、URL、过期提醒）" },
      ],
      notFor: ["浏览器密码自动填充", "跨设备同步明文", "给 agent 读取明文"],
      notes: [
        "vault_header/vault_secret/vault_group/vault_set/vault_group_set/vault_set_secret/vault_binding/vault_subject_type 随云同步；device key 与 last_used_at 只留本机。",
        "同步上去的是 KDF 参数与密文，云端没有口令也解不开；换机重新输入口令即可解锁。",
        "备份仍不导出密文，换机靠同步或重新录入。",
        "旧版分组的直属凭据在首次解锁时迁移进「<组名> · 默认」集合；站点专属类型收口为通用类型。",
        "0.4.0 起集合带可空账号：有账号的是账号集合，留空的是普通集合；账号允许重复，条目身份只由集合 id 承担。",
      ],
    },
    setup(api) {
      ensureSchema(api.db);
      bindClock(() => api.now());
      vault = createVault({ db: api.db, log: api.log });
      groups = createGroups({ db: api.db });
      const register = api.action.bind(api);
      api.action = (actionName, def) => {
        schemas.push({ name: actionName, domain: "wb-addon-vault", description: def.description, input: def.input, examples: def.examples });
        register(actionName, def);
      };
      registerVaultActions(api, vault, groups);
      api.action = register;
      const origTool = api.tool.bind(api);
      api.tool = (toolName, def) => origTool(toolName, def);
      api.action("vault.actionSchema", {
        description: "只读：本域 action 清单与输入 schema（插件自证，不读宿主统一接口）。",
        input: { type: "object", properties: {}, additionalProperties: false },
        execute: () => ({ shellVersion: api.shellVersion || "", domains: [{ id: "wb-addon-vault", version: (api.addon && api.addon.version) || "0.3.6" }], actions: schemas }),
      });
      void host;
    },
    exportData() {
      return {
        formatVersion: 1,
        exportedAt: new Date().toISOString(),
        note: "保险箱密文与 KDF 参数不进入备份；换机请重新输入口令（或等云同步），不要靠备份还原密文。",
        secrets: [],
        groups: [],
        bindings: [],
      };
    },
    importData() {
      return 0;
    },
  };
}
