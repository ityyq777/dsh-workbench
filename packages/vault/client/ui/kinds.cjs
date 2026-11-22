"use strict";
/**
 * 凭据类型口径：后端 7 种通用类型（vault.js KINDS），界面全部可手工新建。
 * 不再有业务专属类型（site-account 已在 0.3.0 迁移中收口）。
 */
var KIND_LABEL = {
  password: "密码",
  phone: "手机号",
  id_card: "身份证号",
  token: "Token",
  app_password: "授权码",
  api_key: "API Key",
  other: "其它",
};

var CREATABLE_KINDS = ["password", "phone", "id_card", "token", "app_password", "api_key", "other"];

/** 历史数据可能仍带旧类型（迁移前只读）；保留当前值，避免下拉回落时改写 kind（kind 进 AAD 会重加密）。 */
function kindOptions(current) {
  return current && CREATABLE_KINDS.indexOf(current) === -1 ? [current].concat(CREATABLE_KINDS) : CREATABLE_KINDS;
}

module.exports = { KIND_LABEL: KIND_LABEL, CREATABLE_KINDS: CREATABLE_KINDS, kindOptions: kindOptions };
