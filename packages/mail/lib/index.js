/** wb-addon-mail：邮箱账户、文件夹、本地邮件、SMTP 发信与 IMAP 抓信。 */
import { bindClock, ensureSchema } from "./db/db.js";
import { createMail } from "./domain/mail.js";
import { registerMailActions } from "./domain/actions.js";

export const inject = ["workbench"];
let engine = null;

export function setup(api) {
  if (typeof api.now === "function") bindClock(api.now);
  ensureSchema(api.db);
  engine = createMail({ db: api.db, host: api, log: api.log });
  registerMailActions(api, engine);
  if (typeof api.registerSearchProvider === "function") api.registerSearchProvider({ domainId: "wb-addon-mail", search: (q, opts) => engine.search(q, opts) });
  api.log("mail domain ready", api.addon.version);
}

export function apply(ctx) {
  const host = ctx.workbench;
  if (!host) throw new Error("dsh-workbench 未加载：缺少 workbench 服务");
  ctx.effect(() => host.registerDomain({
    id: "wb-addon-mail",
    title: "邮件",
    description: "IMAP 收信头 + SMTP 发信；密码存保险箱；本地副本与搜索",
    version: "0.1.1",
    tables: ["mail_account", "mail_mailbox", "mail_message", "mail_attachment"],
    sync: { tables: [] },
    views: [
      { id: "messages", title: { zh: "邮件", en: "Messages" } },
      { id: "compose", title: { zh: "写信", en: "Compose" } },
      { id: "accounts", title: { zh: "账户", en: "Accounts" } },
      { id: "data", title: { zh: "数据", en: "Data" } },
      { id: "actions", title: { zh: "Action", en: "Actions" } },
    ],
    capability: {
      taskOwnership: { boundary: "发信用 mail.messageSend；需要跟进的处理项用 tasks.create。", query: "mail" },
      summary: "本地邮件客户端：IMAP 抓取最近邮件头、SMTP 发信，密码由保险箱托管。",
      records: [{ kind: "message", title: "邮件", description: "账户、文件夹、主题/发件人/日期、本地正文副本。", when: ["查看最近邮件", "发送纯文本邮件"], notFor: ["完整附件下载", "OAuth2 登录"], primaryAction: "mail.messageSend", keyArgs: ["accountId", "to", "subject", "text"] }],
      fields: [{ name: "accountId", type: "string", description: "账户 id" }, { name: "to", type: "array", description: "收件人邮箱数组" }, { name: "subject", type: "string", description: "主题" }, { name: "text", type: "string", description: "纯文本正文" }],
      notFor: ["不做 OAuth2", "不做附件上传/下载", "不参与云同步"],
      notes: ["密码/应用专用密码必须存保险箱，账户只保存 secretId。", "IMAP 只抓最近邮件头与信封，不下载完整正文/附件；发信仅纯文本。"],
    },
    exportData: () => ({ accounts: engine.listAccounts().items, mailboxes: engine.mailboxes().items, messages: engine.messages({ limit: 200 }).items }),
    importData: (payload) => { const d = payload && typeof payload === "object" ? payload : {}; let imported = 0; for (const a of Array.isArray(d.accounts) ? d.accounts : []) { try { engine.createAccount(a); imported += 1; } catch { /* skip */ } } return { imported }; },
    setup,
  }), "mail-domain");
}
export const MAIL_DOMAIN = "wb-addon-mail";
