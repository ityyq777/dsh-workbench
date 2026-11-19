/**
 * 连接自检的失败归类。
 *
 * 界面只给用户一句「连不上」没有意义：授权码错、域名解析失败、端口不通、TLS 版本
 * 不对，用户要做的事完全不同。这里把底层异常收敛成固定几类，文案在客户端按类出。
 * 判定顺序有讲究：先看协议层显式信号（STARTTLS 不支持、证书），再按 errno 走。
 */
export const ERROR_CLASSES = ["auth", "dns", "refused", "timeout", "tls", "starttls", "unknown"];

const AUTH_RE = /authenticationfailed|invalid credentials|login failed|imap 登录失败|smtp (用户名|密码) 失败|\b535\b|\b5\.7\.8\b|\bauth(?:entication)? failed\b/i;
const TLS_CODE = new Set([
  "ERR_TLS_CERT_ALTNAME_INVALID",
  "DEPTH_ZERO_SELF_SIGNED_CERT",
  "SELF_SIGNED_CERT_IN_CHAIN",
  "CERT_HAS_EXPIRED",
  "UNABLE_TO_VERIFY_LEAF_SIGNATURE",
  "ERR_SSL_WRONG_VERSION_NUMBER",
  "EPROTO",
  "ERR_SSL_WRONG_SSL_VERSION",
]);
const REFUSED_CODE = new Set(["ECONNREFUSED", "ECONNRESET", "EHOSTUNREACH", "ENETUNREACH", "EADDRNOTAVAIL"]);
const DNS_CODE = new Set(["ENOTFOUND", "EAI_AGAIN", "EAI_FAIL"]);

/** 把异常收敛成 ERROR_CLASSES 里的一类；不认识的一律 unknown。 */
export function classifyProbeError(e) {
  const code = String((e && e.code) || "");
  const msg = String((e && (e.message || e)) || "");
  const s = code + " " + msg;
  if (/不支持\s*starttls/i.test(msg)) return "starttls";
  if (TLS_CODE.has(code) || /certificate|证书|self[- ]signed|wrong version number|ssl/i.test(s)) return "tls";
  if (DNS_CODE.has(code) || /getaddrinfo|enotfound|域名解析/i.test(s)) return "dns";
  if (REFUSED_CODE.has(code) || /econnrefused|连接被拒绝|connection refused/i.test(s)) return "refused";
  if (code === "ETIMEDOUT" || /超时|timed?\s?out/i.test(s)) return "timeout";
  if (AUTH_RE.test(s)) return "auth";
  return "unknown";
}

/** 归类 → 中英文案；客户端只用这份表，避免两处各写一套说法。 */
export const ERROR_TEXT = {
  auth: {
    zh: "账号或授权码不对。QQ/网易/Gmail/iCloud 需要「授权码 / App 专用密码」，不是网页登录密码。",
    en: "Wrong account or password. QQ/NetEase/Gmail/iCloud need an app password, not your web login password.",
  },
  dns: {
    zh: "服务器地址解析失败，检查主机名是否写错（例如 imap.qq.com）。",
    en: "Host name could not be resolved; check the server address (for example imap.qq.com).",
  },
  refused: {
    zh: "端口没有响应，检查端口号与服务器是否禁用了该协议。",
    en: "The port did not answer; check the port number and whether the server disables that protocol.",
  },
  timeout: {
    zh: "连接超时，可能是网络或防火墙拦截了 993/465/587 端口。",
    en: "Connection timed out; the network or firewall may block ports 993/465/587.",
  },
  tls: {
    zh: "TLS 握手失败，检查端口与加密方式是否匹配（993 用 SSL/TLS，587 用 STARTTLS）。",
    en: "TLS handshake failed; check that port and encryption match (993 uses SSL/TLS, 587 uses STARTTLS).",
  },
  starttls: {
    zh: "服务器不支持 STARTTLS，请改用 993/465 的隐式 TLS 端口。",
    en: "The server does not support STARTTLS; use an implicit-TLS port such as 993 or 465.",
  },
  unknown: {
    zh: "连接失败，请检查服务器地址、端口与授权码。",
    en: "Connection failed; check the server address, port and app password.",
  },
};
