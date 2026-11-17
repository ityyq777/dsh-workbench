/** 邮件 action：读允许 agent；写/发信/同步仅 UI。 */
const S = (d) => ({ type: "string", description: d });
const N = (d) => ({ type: "number", description: d });
const B = (d) => ({ type: "boolean", description: d });
const A = (d) => ({ type: "array", description: d });
const obj = (p, r = []) => ({ type: "object", properties: p, required: r, additionalProperties: false });
const deny = (origin) => { if (origin && origin !== "ui") throw new Error("该操作只允许在界面中执行"); };

export function registerMailActions(api, mail) {
  const defs = [];
  const action = (name, def) => { defs.push({ name, description: def.description, input: def.input }); api.action(name, def); };
  action("mail.status", { description: "只读：账户/邮件/未读/文件夹数量", input: obj({}), execute: () => mail.status() });
  action("mail.accountList", { description: "只读：邮箱账户列表（不含密码）", input: obj({}), execute: () => mail.listAccounts() });
  action("mail.accountCreate", { description: "新建邮箱账户（仅 UI）；secretId 为保险箱凭据 id", input: obj({ name: S("账户名，必填"), email: S("邮箱地址，必填"), imapHost: S("IMAP 主机"), imapPort: N("IMAP 端口，默认 993"), imapTls: B("IMAP 是否 TLS"), smtpHost: S("SMTP 主机"), smtpPort: N("SMTP 端口，默认 465"), smtpTls: B("SMTP 是否 TLS"), username: S("登录名，默认邮箱地址"), secretId: S("保险箱 secret id"), enabled: B("是否启用") }, ["name", "email"]), execute: (args, ctx) => { deny(ctx.origin); return mail.createAccount({ name: args.name, email: args.email, imapHost: args.imapHost, imapPort: args.imapPort, imapTls: args.imapTls, smtpHost: args.smtpHost, smtpPort: args.smtpPort, smtpTls: args.smtpTls, username: args.username, secretId: args.secretId, enabled: args.enabled }); } });
  action("mail.accountUpdate", { description: "更新邮箱账户（仅 UI）", input: obj({ id: S("账户 id"), name: S("名称"), email: S("邮箱"), imapHost: S("IMAP 主机"), imapPort: N("IMAP 端口"), imapTls: B("IMAP TLS"), smtpHost: S("SMTP 主机"), smtpPort: N("SMTP 端口"), smtpTls: B("SMTP TLS"), username: S("登录名"), secretId: S("secret id"), enabled: B("是否启用") }, ["id"]), execute: (args, ctx) => { deny(ctx.origin); return mail.updateAccount({ id: args.id, name: args.name, email: args.email, imapHost: args.imapHost, imapPort: args.imapPort, imapTls: args.imapTls, smtpHost: args.smtpHost, smtpPort: args.smtpPort, smtpTls: args.smtpTls, username: args.username, secretId: args.secretId, enabled: args.enabled }); } });
  action("mail.accountDelete", { description: "软删除邮箱账户（仅 UI）", input: obj({ id: S("账户 id") }, ["id"]), execute: (args, ctx) => { deny(ctx.origin); return mail.deleteAccount(args.id); } });
  action("mail.accountTest", { description: "测试 IMAP 登录并列出文件夹（仅 UI）", input: obj({ id: S("账户 id") }, ["id"]), execute: (args, ctx) => { deny(ctx.origin); return mail.testAccount(args.id); } });
  action("mail.mailboxList", { description: "只读：文件夹列表，可按账户过滤", input: obj({ accountId: S("账户 id") }), execute: (args) => mail.mailboxes(args.accountId) });
  action("mail.mailboxSync", { description: "从 IMAP 同步文件夹（仅 UI）", input: obj({ id: S("账户 id") }, ["id"]), execute: (args, ctx) => { deny(ctx.origin); return mail.syncMailboxes(args.id); } });
  action("mail.messageList", { description: "只读：邮件列表，支持账户/文件夹/未读/关键词", input: obj({ accountId: S("账户 id"), mailbox: S("文件夹名"), unread: B("只看未读"), q: S("关键词"), limit: N("1–200，默认 30") }), execute: (args) => mail.messages({ accountId: args.accountId, mailbox: args.mailbox, unread: args.unread, q: args.q, limit: args.limit }) });
  action("mail.messageGet", { description: "只读：邮件详情", input: obj({ id: S("邮件 id") }, ["id"]), execute: (args) => mail.message(args.id) });
  action("mail.messageSend", { description: "通过 SMTP 发信（仅 UI）", input: obj({ accountId: S("账户 id，必填"), to: A("收件人数组"), cc: A("抄送数组"), subject: S("主题"), text: S("正文") }, ["accountId", "to"]), execute: (args, ctx) => { deny(ctx.origin); return mail.send({ accountId: args.accountId, to: args.to, cc: args.cc, subject: args.subject, text: args.text }); } });
  action("mail.messageMarkRead", { description: "标记已读（仅 UI）", input: obj({ id: S("邮件 id"), ids: A("批量邮件 id") }), execute: (args, ctx) => { deny(ctx.origin); return mail.markRead({ id: args.id, ids: args.ids }); } });
  action("mail.messageMove", { description: "移动邮件到文件夹（仅 UI）", input: obj({ id: S("邮件 id"), mailbox: S("目标文件夹") }, ["id", "mailbox"]), execute: (args, ctx) => { deny(ctx.origin); return mail.move({ id: args.id, mailbox: args.mailbox }); } });
  action("mail.messageDelete", { description: "删除本地邮件副本（仅 UI）", input: obj({ id: S("邮件 id") }, ["id"]), execute: (args, ctx) => { deny(ctx.origin); return mail.remove({ id: args.id }); } });
  action("mail.sync", { description: "从 IMAP 抓取最近邮件头（仅 UI）", input: obj({ id: S("账户 id"), mailbox: S("文件夹，默认 INBOX"), limit: N("1–50，默认 20") }, ["id"]), execute: (args, ctx) => { deny(ctx.origin); return mail.sync(args.id, { mailbox: args.mailbox, limit: args.limit }); } });
  action("mail.dataTables", { description: "只读：邮件域表清单", input: obj({}), execute: () => ({ tables: [{ name: "mail_account", columns: ["id", "name", "email", "imap_host", "smtp_host", "secret_id", "enabled"] }, { name: "mail_mailbox", columns: ["id", "account_id", "name", "role"] }, { name: "mail_message", columns: ["id", "account_id", "mailbox", "uid", "subject", "from_addr", "date_at", "flags"] }, { name: "mail_attachment", columns: ["id", "message_id", "filename", "mime", "size"] }] }) });
  action("mail.dataQuery", { description: "只读：白名单表查询（仅 UI）", input: obj({ table: S("表名"), limit: N("1–100") }, ["table"]), execute: (args, ctx) => { deny(ctx.origin); return mail.dataQuery ? mail.dataQuery({ table: args.table, limit: args.limit }) : { rows: [] }; } });
  action("mail.actionSchema", { description: "只读：本域 action 清单与输入 schema", input: obj({}), execute: () => ({ shellVersion: api.shellVersion || "", domains: [{ id: "wb-addon-mail", version: (api.addon && api.addon.version) || "0.1.0" }], actions: defs.filter((d) => d.name !== "mail.actionSchema").map((d) => ({ ...d, domain: "wb-addon-mail", examples: d.examples || [] })) }) });
}
