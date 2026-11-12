// 统计清单的状态判定：后端没返回该键 → 能力降级提示；键存在但为空 → 真正的空态。
// 旧后端没有 capabilities.lists 时退回按键存在性判断，避免把版本不一致伪装成「没有数据」。
var LISTS = ["overdue", "recentPublish", "recentDone", "recentShutdown"];

var COPY = {
  zh: "统计接口未返回「{key}」清单，前后端版本可能不一致；请重启插件服务后重试",
  en: "Stats API did not return the \"{key}\" list; frontend and backend versions may differ. Restart the plugin service and retry.",
};

function listState(data, key) {
  if (LISTS.indexOf(key) < 0) throw new Error("unknown list: " + key);
  var lists = data && data.lists;
  var declared = data && data.capabilities && Array.isArray(data.capabilities.lists) ? data.capabilities.lists : null;
  var missing = !lists || !Object.prototype.hasOwnProperty.call(lists, key);
  if (!missing && declared && declared.indexOf(key) < 0) missing = true;
  var rows = !missing && Array.isArray(lists[key]) ? lists[key] : [];
  return { key: key, missing: missing, rows: rows };
}

function missingText(lang, key) {
  return (lang === "en" ? COPY.en : COPY.zh).replace("{key}", key);
}

module.exports = { LISTS: LISTS, listState: listState, missingText: missingText };
