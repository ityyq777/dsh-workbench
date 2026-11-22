"use strict";
/**
 * 保险箱锁定门禁：邮件四个数据视图（邮件 / 写信 / 账户 / 数据）共用。
 *
 * 锁定期间整页替换成锁定卡：真正的视图组件不挂载，于是列表与详情不存在、已选邮件被清空、
 * 在途请求的响应随卸载作废；解锁后轮询（4 秒）自动恢复，不需要刷新页面。
 * 解锁判断只认服务端 vault.status，实现在 packages/addons/lib/vault-lock.cjs。
 */
var Lock = require("../../../lib/vault-lock.cjs").create({
  prefix: "wbml",
  wrapClass: "wbml-page",
  Icon: require("./icons.cjs").ICONS.lock,
  title: { zh: "保险箱已锁定，邮件暂不可查看", en: "The vault is locked" },
  hint: {
    zh: "锁定期间不显示发件人、主题、正文与附件。请先在「保险箱」页解锁；解锁后本页会自动恢复。",
    en: "Sender, subject, body and attachments stay hidden while the vault is locked. Unlock it on the Vault page and this page recovers automatically.",
  },
});

/** 给视图包一层门禁：始终先读解锁状态，只有服务端确认未锁定才挂载真正的视图。 */
function gate(Inner, h, React, C) {
  return function Guarded(props) {
    var guard = Lock.use({ React: React, api: props.api, C: C });
    if (guard.locked) return h(Lock.Panel, { h: h, C: C, lang: props.lang, error: guard.error });
    return h(Inner, props);
  };
}

module.exports = { lock: Lock, gate: gate };
