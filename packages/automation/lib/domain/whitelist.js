/** 自动化白名单：硬底线（不可配置）+ 本机允许列表的规范化与校验。 */

/** 永远不允许被自动化调用的 action。 */
export const DENIED = /^(vault|automation|audit)\.|\.(delete|backup)/i;
export const DENIED_PATTERNS = ["vault.*", "automation.*", "audit.*", "*.delete", "*.backup"];
const SEGMENT = /^[A-Za-z_][A-Za-z0-9_]*$/;

export function isDenied(name) {
  return DENIED.test(String(name || ""));
}

export function validActionName(name) {
  const text = String(name || "").trim();
  const parts = text.split(".");
  if (parts.length < 2 || parts.length > 3) return false;
  return parts.every((part) => SEGMENT.test(part));
}

/**
 * 规范化允许列表：去空白、去重、按字母序。
 * strict=true 时遇到非法名或命中硬底线直接抛错（用于写入配置）；
 * strict=false 时静默丢弃（用于读取已有配置，避免脏数据让整页崩掉）。
 */
export function normalizeAllowedList(input, strict = false) {
  const rows = Array.isArray(input) ? input : [];
  const seen = new Set();
  for (const row of rows) {
    const name = String(row || "").trim();
    if (!name) continue;
    if (isDenied(name)) {
      if (strict) {
        const error = new Error("该 action 不允许被自动化调用：" + name);
        error.status = 400;
        throw error;
      }
      continue;
    }
    if (!validActionName(name)) {
      if (strict) {
        const error = new Error("action 名称不合法：" + name);
        error.status = 400;
        throw error;
      }
      continue;
    }
    seen.add(name);
  }
  return Array.from(seen).sort();
}

/** 建规则 / 执行前校验 action 是否可用；返回中文原因或空字符串。 */
export function checkAction(name, allowed) {
  const action = String(name || "").trim();
  if (!action) return "缺少 actionName";
  if (isDenied(action)) return "该 action 不允许被自动化调用：" + action;
  if (!Array.isArray(allowed) || !allowed.includes(action)) return "action 未在设置中启用：" + action;
  return "";
}
