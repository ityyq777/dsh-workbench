/** 邮件 action：读允许 agent；写/发信/同步/自检仅 UI。 */
import { PROVIDER_SCHEMA, PROVIDERS } from "./providers.js";
const S = (d) => ({ type: "string", description: d });
const N = (d) => ({ type: "number", description: d });
const B = (d) => ({ type: "boolean", description: d });
const A = (d) => ({ type: "array", description: d });
const obj = (p, r = []) => ({ type: "object", properties: p, required: r, additionalProperties: false });
const deny = (origin) => { if (origin && origin !== "ui" && origin !== "agent") throw new Error("该操作只允许在界面中执行"); };
// 保险箱锁定门禁：本地缓存里的发件人、主题、正文同样是隐私数据，锁定期间读写一律拒绝。
// 只有不含邮件内容的动作（服务商预设表、本域 action 清单）放行。
const VAULT_LOCKED = "VAULT_LOCKED";
const PUBLIC_ACTIONS = new Set(["mail.providerList", "mail.actionSchema"]);
const lockedError = () => {
  const e = new Error("保险箱已锁定，邮件内容不可查看；请先在「保险箱」页解锁后重试");
  e.code = VAULT_LOCKED;
  return e;
};
// 预设表是服务端唯一一份数据：客户端选服务商、识别域名、填主机都读 mail.providerList。
const providerTable = () => ({ schema: PROVIDER_SCHEMA, providers: PROVIDERS });

export function registerMailActions(api, mail) {
  const defs = [];
  // 保险箱未安装、状态读不到或明确 locked，都按锁定处理（fail-closed）。
  async function requireVaultUnlocked() {
    let st;
    try {
      st = await api.call("vault.status", {}, "plugin");
    } catch {
      throw lockedError();
    }
    const v = st && st.result !== undefined ? st.result : st;
    if (!v || v.locked !== false) throw lockedError();
  }
  // 0.6.0：账户先选保险箱里的「账号集合」，邮箱地址与授权码都从集合来。
  // 集合由保险箱插件提供，这里只做只读校验；保险箱锁定/未安装时先被 requireVaultUnlocked 拦下。
  async function readAccountSet(accountSetId, secretId) {
    const id = String(accountSetId || "").trim();
    if (!id) throw new Error("请先选择账号集合（保险箱「集合与账号」里的账号集合）");
    let raw;
    try {
      raw = await api.call("vault.setGet", { id }, "plugin");
    } catch (e) {
      throw new Error("读取账号集合失败：" + (e && e.message ? e.message : "保险箱不可用"));
    }
    const set = raw && raw.result !== undefined ? raw.result : raw;
    if (!set || !set.id) throw new Error("所选账号集合不存在，请重新选择");
    const account = String(set.account || "").trim();
    if (!account) throw new Error("所选集合没有填写账号，请先到保险箱给它填上账号");
    const secrets = Array.isArray(set.secrets) ? set.secrets : [];
    const sid = String(secretId || "").trim();
    if (sid && !secrets.some((x) => x && x.id === sid)) throw new Error("所选凭据不在这个账号集合里，请重新选择");
    return { id: set.id, account };
  }
  const action = (name, def) => {
    const run = def.execute;
    const execute = PUBLIC_ACTIONS.has(name) ? run : (args, ctx) => requireVaultUnlocked().then(() => run(args, ctx));
    defs.push({ name, description: def.description, input: def.input });
    api.action(name, { ...def, execute });
  };
  // 原有动作保留宿主的本机访问开关；草稿与附件使用不可解锁的策略。
  const uiOnly = (name, description, input, run) => action(name, {
    origins: ["ui"], description, input,
    execute: (args, ctx) => {
      if (ctx?.origin !== "ui") throw new Error("该操作只允许在界面中执行");
      return run(args);
    },
  });
  const mode = { ...S("撰写模式，默认 new；回复和转发须指定原信 originId 与原账户 accountId"), enum: ["new", "reply", "replyAll", "forward"] };
  const draftKey = S("本地草稿 key");
  const sendFields = { accountId: S("账户 id"), to: { ...A("收件人数组"), items: S("邮箱地址") }, cc: { ...A("抄送数组"), items: S("邮箱地址") }, subject: S("主题"), text: S("正文"), mode, originId: S("回复或转发时必填的原信 id") };
  const outgoing = (args) => ({ accountId: args.accountId, to: args.to, cc: args.cc, subject: args.subject, text: args.text, mode: args.mode, originId: args.originId });
  const upload = obj({ filename: S("文件名"), mime: S("媒体类型"), secretBase64: S("私密文件内容的 Base64，不写审计或留档") }, ["filename", "secretBase64"]);
  const result = "status：archived 已接收并留档、accepted 已接收未留档、rejected 明确拒收、not_sent 未提交、unknown 回执丢失须人工核对。";
  uiOnly("mail.composeSend", "发送邮件，可选附件合计最多 10 个、8 MiB（仅 UI，不可解锁）。" + result, obj({ ...sendFields,
    uploads: { ...A("浏览器选择的本机文件"), items: upload, maxItems: 10 },
    originalAttachmentIds: { ...A("转发时明确选中的原附件 id"), items: S("原信附件 id"), maxItems: 10 },
  }, ["accountId", "to"]), args => mail.composeSend({ ...outgoing(args), uploads: args.uploads, originalAttachmentIds: args.originalAttachmentIds }));
  uiOnly("mail.deliveryList", "查看最近未归档的投递记录（仅 UI，不可解锁）", obj({}), () => mail.deliveryList());
  uiOnly("mail.deliveryArchive", "补记服务器已接收的本地已发送记录；不调用 SMTP，不保存附件字节（仅 UI，不可解锁）", obj({ id: S("投递记录 id") }, ["id"]), args => mail.deliveryArchive({ id: args.id }));
  uiOnly("mail.serverSearch", "指定一个账户和文件夹，从 IMAP 搜索主题或发件人并缓存至多 50 封信头（仅 UI，不可解锁）", obj({ accountId: S("账户 id"), mailbox: S("远端文件夹名"), q: S("主题或发件人关键词"), unread: B("只看未读") }, ["accountId", "mailbox", "q"]), args => mail.serverSearch({ accountId: args.accountId, mailbox: args.mailbox, q: args.q, unread: args.unread }));
  action("mail.status", { description: "只读：账户/邮件/未读/文件夹数量", input: obj({}), execute: () => mail.status() });
  action("mail.accountList", { description: "只读：邮箱账户列表（不含密码，含 lastMessageAt）", input: obj({}), execute: () => mail.listAccounts() });
  action("mail.providerList", { description: "只读：邮箱服务商预设（QQ/网易/微软/Gmail/iCloud/其他）与域名识别规则；客户端选服务商、自动填主机都读这份表", input: obj({}), execute: () => providerTable() });
  action("mail.accountCreate", { origins: ["ui", "agent"],
    originsDefault: ["ui"], description: "新建邮箱账户（仅 UI）：先选保险箱「集合与账号」里的账号集合，邮箱地址由集合账号带出；secretId 必须是该集合里的凭据", input: obj({ name: S("账户名，必填"), email: S("邮箱地址，由所选集合的账号带出，界面不手填"), accountSetId: S("保险箱账号集合 id，必填"), imapHost: S("IMAP 主机"), imapPort: N("IMAP 端口，默认 993"), imapTls: B("IMAP 是否 TLS"), smtpHost: S("SMTP 主机"), smtpPort: N("SMTP 端口，默认 465"), smtpTls: B("SMTP 是否 TLS"), username: S("登录名，默认集合账号"), secretId: S("账号集合内的保险箱凭据 id"), enabled: B("是否启用") }, ["name", "email", "accountSetId"]), execute: async (args, ctx) => { deny(ctx.origin); const set = await readAccountSet(args.accountSetId, args.secretId); return mail.createAccount({ name: args.name, email: set.account, accountSetId: set.id, imapHost: args.imapHost, imapPort: args.imapPort, imapTls: args.imapTls, smtpHost: args.smtpHost, smtpPort: args.smtpPort, smtpTls: args.smtpTls, username: args.username, secretId: args.secretId, enabled: args.enabled }); } });
  action("mail.accountUpdate", { origins: ["ui", "agent"],
    originsDefault: ["ui"], description: "更新邮箱账户（仅 UI）：账号集合必填，邮箱地址由所选集合的账号带出；secretId 必须是该集合里的凭据", input: obj({ id: S("账户 id"), name: S("名称"), email: S("邮箱，由所选集合的账号带出"), accountSetId: S("保险箱账号集合 id，必填"), imapHost: S("IMAP 主机"), imapPort: N("IMAP 端口"), imapTls: B("IMAP TLS"), smtpHost: S("SMTP 主机"), smtpPort: N("SMTP 端口"), smtpTls: B("SMTP TLS"), username: S("登录名"), secretId: S("账号集合内的凭据 id"), enabled: B("是否启用") }, ["id", "accountSetId"]), execute: async (args, ctx) => { deny(ctx.origin); const set = await readAccountSet(args.accountSetId, args.secretId); return mail.updateAccount({ id: args.id, name: args.name, email: set.account, accountSetId: set.id, imapHost: args.imapHost, imapPort: args.imapPort, imapTls: args.imapTls, smtpHost: args.smtpHost, smtpPort: args.smtpPort, smtpTls: args.smtpTls, username: args.username, secretId: args.secretId, enabled: args.enabled }); } });
  action("mail.accountDelete", { origins: ["ui", "agent"],
    originsDefault: ["ui"], description: "软删除邮箱账户并隐藏其本地数据，不清除缓存或修改远端邮箱（仅 UI）", input: obj({ id: S("账户 id") }, ["id"]), execute: (args, ctx) => { deny(ctx.origin); return mail.deleteAccount(args.id); } });
  action("mail.accountTest", { origins: ["ui", "agent"],
    originsDefault: ["ui"], description: "测试 IMAP 登录并列出文件夹（仅 UI）；返回 ok/errorClass(auth|dns|refused|timeout|tls|starttls|unknown)", input: obj({ id: S("账户 id") }, ["id"]), execute: (args, ctx) => { deny(ctx.origin); return mail.testAccount(args.id); } });
  action("mail.accountProbe", { origins: ["ui", "agent"],
    originsDefault: ["ui"], description: "保存前自检（仅 UI）：用草稿参数登录 IMAP 列文件夹、可选验证 SMTP 认证，不落库；password 只在本进程内存里用一次", input: obj({ email: S("邮箱地址"), username: S("登录名，默认邮箱地址"), imapHost: S("IMAP 主机，必填"), imapPort: N("IMAP 端口，默认 993"), imapTls: B("IMAP 是否隐式 TLS"), smtpHost: S("SMTP 主机，可选"), smtpPort: N("SMTP 端口，默认 465"), smtpTls: B("SMTP 是否隐式 TLS（false 走 STARTTLS）"), password: S("授权码，仅本次调用使用"), secretId: S("已保存的保险箱 secret id（可不传 password）") }, ["imapHost"]), execute: (args, ctx) => { deny(ctx.origin); return mail.probeAccount({ email: args.email, username: args.username, imapHost: args.imapHost, imapPort: args.imapPort, imapTls: args.imapTls, smtpHost: args.smtpHost, smtpPort: args.smtpPort, smtpTls: args.smtpTls, password: args.password, secretId: args.secretId }); } });
  action("mail.mailboxList", { description: "只读：文件夹列表，可按账户过滤", input: obj({ accountId: S("账户 id") }), execute: (args) => mail.mailboxes(args.accountId) });
  action("mail.mailboxSync", { origins: ["ui", "agent"],
    originsDefault: ["ui"], description: "从 IMAP 同步文件夹（仅 UI）", input: obj({ id: S("账户 id") }, ["id"]), execute: (args, ctx) => { deny(ctx.origin); return mail.syncMailboxes(args.id); } });
  action("mail.messageList", {
    description: "只读：列出本地邮件，可切换统一收件箱；关键词仅匹配本地主题或发件人。返回 items、hasMore、nextCursor，邮件带来源账户及本地已知附件名。",
    input: obj({ accountId: S("账户 id"), mailbox: S("文件夹名"), unifiedInbox: B("仅合并启用账户的收件箱；不得同时指定账户或文件夹"), unread: B("只看未读"), q: S("本地主题或发件人关键词"), limit: N("1–200，默认 30"), cursor: S("上一页的 nextCursor，须沿用相同筛选条件") }),
    execute: (args) => mail.messages({ accountId: args.accountId, mailbox: args.mailbox, unifiedInbox: args.unifiedInbox, unread: args.unread, q: args.q, limit: args.limit, cursor: args.cursor }),
  });
  action("mail.messageGet", { description: "只读：邮件详情", input: obj({ id: S("邮件 id") }, ["id"]), execute: (args) => mail.message(args.id) });
  action("mail.messageBody", { description: "只读：按需下载并解码邮件正文（纯文本优先，HTML 邮件自动提正文），返回 body/html/preview/attachments；已在本地缓存时不重复拉取，force=true 强制重拉", input: obj({ id: S("邮件 id"), force: B("强制重新下载并解析") }, ["id"]), execute: (args) => mail.messageBody({ id: args.id, force: args.force }) });
  uiOnly("mail.attachmentDownload", "下载指定附件（仅 UI，不可解锁）；仅取其分段，传输上限 32 MiB，返回 filename/mime/base64/size，不写宿主文件。", obj({ id: S("附件 id，来自邮件详情 attachments，不是邮件 id") }, ["id"]), (args) => mail.attachmentDownload({ id: args.id }));
  uiOnly("mail.draftList", "列出本机草稿摘要（仅 UI，不可解锁）", obj({}), () => mail.draftList());
  uiOnly("mail.draftGet", "读取本机草稿；不存在时 draft 为 null（仅 UI，不可解锁）", obj({ key: draftKey }, ["key"]), (args) => mail.draftGet({ key: args.key }));
  uiOnly("mail.draftSave", "新建或覆盖本机草稿，不发信（仅 UI，不可解锁）", obj({
    key: draftKey, accountId: S("账户 id"), to: S("收件人编辑框原文"), cc: S("抄送编辑框原文"), subject: S("主题"), text: S("正文"), mode, originId: S("原邮件 id"),
  }, ["key"]), (args) => mail.draftSave({ key: args.key, accountId: args.accountId, to: args.to, cc: args.cc, subject: args.subject, text: args.text, mode: args.mode, originId: args.originId }));
  uiOnly("mail.draftDelete", "删除指定本机草稿，不影响原信（仅 UI，不可解锁）", obj({ key: draftKey }, ["key"]), (args) => mail.draftDelete({ key: args.key }));
  action("mail.messageSend", { origins: ["ui", "agent"],
    originsDefault: ["ui"], description: "通过 SMTP 发送纯文本邮件；回复继承原信会话，转发不携带附件（默认仅 UI）。" + result, input: obj({ accountId: S("账户 id，必填"), to: A("收件人数组"), cc: A("抄送数组"), subject: S("主题"), text: S("正文"), mode, originId: S("原信 id；回复、全部回复或转发时必填") }, ["accountId", "to"]), execute: (args, ctx) => { deny(ctx.origin); return mail.send({ accountId: args.accountId, to: args.to, cc: args.cc, subject: args.subject, text: args.text, mode: args.mode, originId: args.originId }); } });
  action("mail.messageMarkRead", { origins: ["ui", "agent"],
    originsDefault: ["ui"], description: "同步设置已读或未读（默认仅 UI），id 或 ids 至少一项", input: { ...obj({ id: S("邮件 id"), ids: A("批量邮件 id"), read: B("true 已读、false 未读，默认 true") }), anyOf: [{ required: ["id"] }, { required: ["ids"] }] }, execute: (args, ctx) => { deny(ctx.origin); return mail.markRead({ id: args.id, ids: args.ids, read: args.read }); } });
  action("mail.messageMove", { origins: ["ui", "agent"],
    originsDefault: ["ui"], description: "移动邮件至同一账户的文件夹；同步原邮箱（默认仅 UI）", input: obj({ id: S("邮件 id"), mailbox: S("目标文件夹") }, ["id", "mailbox"]), execute: (args, ctx) => { deny(ctx.origin); return mail.move({ id: args.id, mailbox: args.mailbox }); } });
  action("mail.messageDelete", { origins: ["ui", "agent"],
    originsDefault: ["ui"], description: "将邮件移入废纸篓，不执行永久删除（默认仅 UI）", input: obj({ id: S("邮件 id") }, ["id"]), execute: (args, ctx) => { deny(ctx.origin); return mail.remove({ id: args.id }); } });
  action("mail.sync", { origins: ["ui", "agent"],
    originsDefault: ["ui"], description: "从 IMAP 抓一页邮件头和状态（默认仅 UI）；续页时须一起传入上一页的 nextBeforeUid 与 uidValidity，nextBeforeUid 为 0 表示到底。", input: { ...obj({ id: S("账户 id"), mailbox: S("文件夹，默认 INBOX"), limit: N("1–50，默认 20"), beforeUid: { type: "integer", minimum: 1, description: "上一页的 nextBeforeUid（不含）" }, uidValidity: { type: "integer", minimum: 1, description: "上一页的 uidValidity，防止跨代误读" } }, ["id"]), dependentRequired: { beforeUid: ["uidValidity"], uidValidity: ["beforeUid"] } }, execute: (args, ctx) => { deny(ctx.origin); return mail.sync(args.id, { mailbox: args.mailbox, limit: args.limit, beforeUid: args.beforeUid, uidValidity: args.uidValidity }); } });
  action("mail.dataTables", { description: "只读：邮件域表清单", input: obj({}), execute: () => ({ tables: [{ name: "mail_account", columns: ["id", "name", "email", "imap_host", "smtp_host", "secret_id", "enabled"] }, { name: "mail_mailbox", columns: ["id", "account_id", "name", "role"] }, { name: "mail_message", columns: ["id", "account_id", "mailbox", "uid", "subject", "from_addr", "date_at", "flags"] }, { name: "mail_attachment", columns: ["id", "message_id", "filename", "mime", "size"] }] }) });
  action("mail.dataQuery", { origins: ["ui", "agent"],
    originsDefault: ["ui"], description: "只读：白名单表查询（仅 UI）", input: obj({ table: S("表名"), limit: N("1–100") }, ["table"]), execute: (args, ctx) => { deny(ctx.origin); return mail.dataQuery ? mail.dataQuery({ table: args.table, limit: args.limit }) : { rows: [] }; } });
  action("mail.actionSchema", { description: "只读：本域 action 清单与输入 schema", input: obj({}), execute: () => ({ shellVersion: api.shellVersion || "", domains: [{ id: "wb-addon-mail", version: (api.addon && api.addon.version) || "0.4.2" }], actions: defs.filter((d) => d.name !== "mail.actionSchema").map((d) => ({ ...d, domain: "wb-addon-mail", examples: d.examples || [] })) }) });
}
