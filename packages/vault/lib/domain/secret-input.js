/**
 * 凭据输入的通用校验：类型、名称、非敏感元数据。
 * 抽出来是为了让 vault.js 保持在 600 行预算内，也是 schema 与实现同口径的单一来源。
 */
export const KINDS = ["password", "phone", "id_card", "token", "app_password", "api_key", "other"];
export const KIND_SET = new Set(KINDS);

const META_BAD = /(pass(word|wd)?|pwd|token|secret|api[_-]?key|private[_-]?key|credential)/i;

export function assertSecretName(name) {
  const value = String(name || "").trim();
  if (!value || value.length > 100) throw new Error("名称必填，最多 100 字");
  return value;
}

export function assertKind(kind) {
  const value = String(kind || "other");
  if (!KIND_SET.has(value)) throw new Error("kind 必须是 " + KINDS.join("/"));
  return value;
}

export function assertMeta(meta) {
  if (meta == null) return "{}";
  if (typeof meta !== "object" || Array.isArray(meta)) throw new Error("meta 必须是对象");
  for (const [key, value] of Object.entries(meta)) {
    if (META_BAD.test(key) && value !== "" && value != null) {
      throw new Error("meta 不能保存密码/token 等敏感值：" + key);
    }
  }
  const text = JSON.stringify(meta);
  if (text.length > 4000) throw new Error("meta 最多 4000 字节");
  return text;
}
