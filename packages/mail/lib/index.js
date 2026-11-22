/** wb-addon-mail：邮箱账户、文件夹、本地邮件、SMTP 发信与 IMAP 抓信。 */
import { bindClock, ensureSchema } from "./db/db.js";
import { createMail } from "./domain/mail.js";
import { registerMailActions } from "./domain/actions.js";
import { createAutoSync, registerAutoSyncActions } from "./domain/auto-sync.js";
import { loadConfig, onConfigChange, registerConfigActions } from "./infra/config.js";
import { setFetchDebug } from "./infra/parts.js";

export const inject = ["workbench"];
let engine = null;
let autoSync = null;

export function setup(api) {
  if (typeof api.now === "function") bindClock(api.now);
  ensureSchema(api.db);
  engine = createMail({ db: api.db, host: api, log: api.log });
  registerMailActions(api, engine);
  registerConfigActions(api);
  autoSync = createAutoSync({ db: api.db, engine, api, log: api.log });
  registerAutoSyncActions(api, autoSync);
  // 改开关、方式或间隔后立刻重新排期：不必重启宿主，也不必等下一轮。
  onConfigChange(() => autoSync.restart());
  autoSync.start();
  // 正文字段诊断只看配置项 debug.fetch；读配置失败时按关闭处理，绝不因为诊断拖累阅读。
  setFetchDebug(() => {
    try {
      return loadConfig(api.db).values["debug.fetch"] === true;
    } catch {
      return false;
    }
  });
  try {
    engine.backfillHeaders();
  } catch (e) {
    api.log("mail: 历史信头重解失败", String(e && e.message ? e.message : e));
  }
  if (typeof api.registerSearchProvider === "function") api.registerSearchProvider({ domainId: "wb-addon-mail", search: (q, opts) => engine.search(q, opts) });
  api.log("mail domain ready", api.addon.version);
  return () => {
    if (autoSync) autoSync.stop();
  };
}

export function apply(ctx) {
  const host = ctx.workbench;
  if (!host) throw new Error("dsh-workbench 未加载：缺少 workbench 服务");
  ctx.effect(() => host.registerDomain({
    id: "wb-addon-mail",
    title: "邮件",
    description: "安全 IMAP 收信与文件夹同步，按需读正文、下载附件，保存本地草稿并通过 SMTP 回复或转发。",
    version: "0.6.0",
    category: "comm",
    // mail_draft 含私有未发正文，不加入宿主通用表清单或同步回退。
    tables: ["mail_account", "mail_mailbox", "mail_message", "mail_attachment"],
    sync: { tables: [] },
    // 提供落点：邮件详情动作条渲染 item.actions，别的插件可以把按钮挂进来。
    slots: ["item.actions"],
    slotHosts: ["item.actions"],
    views: [
      { id: "messages", title: { zh: "邮件", en: "Messages" } },
      { id: "compose", title: { zh: "写信", en: "Compose" } },
      { id: "accounts", title: { zh: "账户", en: "Accounts" } },
      { id: "data", title: { zh: "数据", en: "Data" } },
      { id: "actions", title: { zh: "Action", en: "Actions" } },
    ],
    capability: {
      requires: ["wb-addon-vault"],
      taskOwnership: { boundary: "发信用 mail.messageSend；需要跟进的处理项用 tasks.create。", query: "mail" },
      summary: "账户先绑保险箱里的账号集合，邮箱地址由集合账号带出，授权码只从该集合里选；按账户和文件夹浏览，支持本地搜索与界面按需服务器搜索；与原邮箱同步已读、移动和废纸篓，按需取正文与附件，从原信回复、全部回复或转发。",
      records: [{ kind: "message", title: "邮件", description: "账户、文件夹、信头和本地正文副本。", when: ["查看邮件", "发送纯文本邮件", "回复或转发原信"], notFor: ["附件上传", "OAuth2 登录"], primaryAction: "mail.messageSend", keyArgs: ["accountId", "to", "subject", "text"] }, { kind: "draft", title: "本地邮件草稿", description: "本机保存的待发邮件，只能从界面访问。", when: ["保存未发内容"], notFor: ["跨设备同步草稿"], primaryAction: "mail.draftSave", keyArgs: ["key", "text"] }],
      fields: [{ name: "accountId", type: "string", description: "账户 id" }, { name: "to", type: "array", description: "收件人邮箱数组" }, { name: "subject", type: "string", description: "主题" }, { name: "text", type: "string", description: "纯文本正文" }],
      notFor: ["不做 OAuth2", "agent 不可发送附件", "不永久删除远端邮件", "不参与工作台云同步"],
      notes: ["0.6.0 起账户先选保险箱「集合与账号」里的账号集合：邮箱地址由集合账号带出，授权码只能从同一个集合里选，账户行只存 account_set_id 与 secret_id。", "密码由保险箱托管；IMAP 仅在隐式 TLS 或 STARTTLS 成功后认证。", "默认搜索本地已同步信头；界面可指定账户和远端文件夹搜索主题和发件人。", "列表展示本地已知附件名。批量移入废纸篓和本页全部已读按确认时列出的账户与邮件执行。打开邮件不会自动下载附件。草稿仅存本机；界面可显式选取附件，agent 的 mail.messageSend 只发送纯文本。"],
    },
    exportData: () => ({ accounts: engine.listAccounts().items, mailboxes: engine.mailboxes().items, messages: engine.messages({ limit: 200 }).items }),
    importData: (payload) => { const d = payload && typeof payload === "object" ? payload : {}; let imported = 0; for (const a of Array.isArray(d.accounts) ? d.accounts : []) { try { engine.createAccount(a); imported += 1; } catch { /* skip */ } } return { imported }; },
    setup,
  }), "mail-domain");
}
export const MAIL_DOMAIN = "wb-addon-mail";
