/**
 * 邮箱服务商预设：QQ / 网易 / 微软 / Gmail / iCloud / 其他通用邮箱。
 *
 * 这里是唯一一份主机与端口数据：服务端经 mail.providerList 把它交给客户端，
 * 客户端不复制常量（加服务商只改本文件）。
 *
 * 主机模板里的 {domain} 会按用户邮箱的域名替换（网易 163/126/yeah/188 共用一条预设）。
 * IMAP 目前只有隐式 TLS（lib/infra/imap.js 不做 STARTTLS 升级），所以预设一律 993 + TLS。
 */
export const PROVIDER_SCHEMA = 1;

export const PROVIDERS = [
  {
    id: "qq",
    label: { zh: "QQ 邮箱", en: "QQ Mail" },
    domains: ["qq.com", "foxmail.com", "vip.qq.com"],
    imapHost: "imap.qq.com",
    imapPort: 993,
    imapTls: true,
    smtpHost: "smtp.qq.com",
    smtpPort: 465,
    smtpTls: true,
    usernameMode: "full",
    secretKind: "app_password",
    hint: {
      zh: "在 QQ 邮箱「设置 → 账号 → POP3/IMAP/SMTP 服务」开启服务并获取 16 位授权码；网页登录密码不能用于客户端。",
      en: "Enable POP3/IMAP/SMTP in QQ Mail settings and use the 16-character authorization code, not your login password.",
    },
    helpUrl: "https://service.mail.qq.com/detail/0/75",
  },
  {
    id: "netease",
    label: { zh: "网易邮箱", en: "NetEase Mail" },
    domains: ["163.com", "126.com", "yeah.net", "188.com"],
    imapHost: "imap.{domain}",
    imapPort: 993,
    imapTls: true,
    smtpHost: "smtp.{domain}",
    smtpPort: 465,
    smtpTls: true,
    usernameMode: "full",
    secretKind: "app_password",
    hint: {
      zh: "在网易邮箱「设置 → POP3/SMTP/IMAP」开启服务，并使用「客户端授权密码」，不是登录密码。",
      en: "Enable POP3/SMTP/IMAP in NetEase Mail settings and use the client authorization password.",
    },
    helpUrl: "https://help.mail.163.com/faqDetail.do?code=d7a5dc8471cd0c0e8b4b8f4f8e49998b374173cfe9171305fa1ce630d7f67ac2",
  },
  {
    id: "microsoft",
    label: { zh: "微软邮箱", en: "Microsoft Mail" },
    domains: ["outlook.com", "hotmail.com", "live.com", "msn.com", "outlook.cn"],
    imapHost: "outlook.office365.com",
    imapPort: 993,
    imapTls: true,
    smtpHost: "smtp-mail.outlook.com",
    smtpPort: 587,
    smtpTls: false,
    usernameMode: "full",
    secretKind: "app_password",
    hint: {
      zh: "微软已对多数账户停用基础认证：请先在账户安全设置里创建「应用密码」；若仍失败，需要 OAuth（当前版本不支持）。",
      en: "Microsoft disabled basic auth for most accounts: create an app password first. If it still fails, OAuth is required (not supported yet).",
    },
    helpUrl: "https://support.microsoft.com/account-billing/using-app-passwords-with-apps-that-don-t-support-two-step-verification-5896ed9b-4263-e681-128a-a6f2979a7944",
  },
  {
    id: "gmail",
    label: { zh: "Gmail", en: "Gmail" },
    domains: ["gmail.com", "googlemail.com"],
    imapHost: "imap.gmail.com",
    imapPort: 993,
    imapTls: true,
    smtpHost: "smtp.gmail.com",
    smtpPort: 465,
    smtpTls: true,
    usernameMode: "full",
    secretKind: "app_password",
    hint: {
      zh: "需先开启两步验证，再生成 16 位「应用专用密码」；直接填账号密码会被拒绝。",
      en: "Turn on 2-Step Verification and create a 16-character app password; your normal password is rejected.",
    },
    helpUrl: "https://support.google.com/accounts/answer/185833",
  },
  {
    id: "icloud",
    label: { zh: "iCloud 邮箱", en: "iCloud Mail" },
    domains: ["icloud.com", "me.com", "mac.com"],
    imapHost: "imap.mail.me.com",
    imapPort: 993,
    imapTls: true,
    smtpHost: "smtp.mail.me.com",
    smtpPort: 587,
    smtpTls: false,
    usernameMode: "local",
    secretKind: "app_password",
    hint: {
      zh: "登录名是 Apple ID 主名（不含 @icloud.com）；需在 Apple ID 安全设置里生成「App 专用密码」。",
      en: "The login name is your Apple ID name without @icloud.com; create an app-specific password in Apple ID security settings.",
    },
    helpUrl: "https://support.apple.com/zh-cn/102654",
  },
  {
    id: "other",
    label: { zh: "其他通用邮箱", en: "Other" },
    domains: [],
    imapHost: "",
    imapPort: 993,
    imapTls: true,
    smtpHost: "",
    smtpPort: 465,
    smtpTls: true,
    usernameMode: "full",
    secretKind: "app_password",
    hint: {
      zh: "自行填写 IMAP / SMTP 主机与端口。IMAP 目前只支持 993 隐式 TLS。",
      en: "Fill in the IMAP / SMTP hosts yourself. IMAP currently supports implicit TLS on 993 only.",
    },
    helpUrl: "",
  },
];

const BY_ID = new Map(PROVIDERS.map((p) => [p.id, p]));

export function providerById(id) {
  return BY_ID.get(String(id || "")) || null;
}

export function domainOf(email) {
  const raw = String(email || "").trim().toLowerCase();
  const at = raw.lastIndexOf("@");
  if (at < 0) return "";
  return raw.slice(at + 1).replace(/\.+$/, "");
}

export function localOf(email) {
  const raw = String(email || "").trim();
  const at = raw.lastIndexOf("@");
  return at < 0 ? raw : raw.slice(0, at);
}

/** 域名 → 预设：精确命中优先，再做后缀命中，多个命中取最长域名。 */
export function detectProvider(email) {
  const domain = domainOf(email);
  if (!domain) return null;
  let best = null;
  for (const p of PROVIDERS) {
    for (const d of p.domains) {
      if (domain !== d && !domain.endsWith("." + d)) continue;
      if (!best || d.length > best.domain.length) best = { provider: p, domain: d };
    }
  }
  return best ? { id: best.provider.id, domain: best.domain } : null;
}

/** 按预设算出可直接落库的字段；域名缺失时用预设第一条域名兜底。 */
export function presetFor(providerId, email) {
  const p = providerById(providerId);
  if (!p) return null;
  const domain = domainOf(email) || p.domains[0] || "";
  const host = (tpl) => String(tpl || "").replace("{domain}", domain);
  return {
    provider: p.id,
    imapHost: host(p.imapHost),
    imapPort: p.imapPort,
    imapTls: p.imapTls,
    smtpHost: host(p.smtpHost),
    smtpPort: p.smtpPort,
    smtpTls: p.smtpTls,
    username: p.usernameMode === "local" ? localOf(email) : String(email || "").trim(),
  };
}
