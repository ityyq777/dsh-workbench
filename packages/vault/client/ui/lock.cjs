"use strict";
/**
 * 凭据保险箱锁定守卫：实现在 packages/addons/lib/vault-lock.cjs，
 * 这里只绑定保险箱自己的前缀、图标与默认文案，凭据 / 集合 / 分组三页共用。
 */
module.exports = require("../../../lib/vault-lock.cjs").create({
  prefix: "wbv",
  Icon: require("./icons.cjs").ICONS.lock,
  title: { zh: "保险箱已锁定", en: "Vault is locked" },
  hint: {
    zh: "请先在「保险箱」页解锁；解锁后本页会自动恢复列表与详情。",
    en: "Unlock it on the Vault page first; this page recovers automatically once unlocked.",
  },
});
