"use strict";
/** 基础样式 + 邮件列表/阅读面板专属规则。 */
module.exports = require("../../../lib/client-base-styles.cjs")("wbm").concat([
  ".wbm-page{display:flex;flex-direction:column;gap:12px;padding:16px;overflow:auto;height:100%;box-sizing:border-box}",
  ".wbm-input{border:1px solid var(--wb-border,#d1d5db);border-radius:7px;padding:6px 8px;font:inherit;background:var(--wb-surface,#fff);color:inherit;min-width:120px}",
  ".wbm-actions{display:flex;gap:8px;justify-content:flex-end;margin-top:8px}",
  ".wbm-list{display:flex;flex-direction:column;gap:2px}",
  ".wbm-list-row{display:flex;align-items:center;gap:10px;padding:8px;border:0;border-bottom:1px solid var(--wb-border,#eef0f3);background:transparent;color:inherit;font:inherit;text-align:left;cursor:pointer}",
  ".wbm-main{display:flex;flex-direction:column;gap:2px;min-width:0;flex:1}",
  ".wbm-time{font-size:11px;color:var(--wb-muted,#6b7280);white-space:nowrap}",
  ".wbm-body{white-space:pre-wrap;font:inherit;font-size:13px;line-height:1.6;margin:8px 0 0}",
  ".wbm-icon-btn{border:0;background:transparent;color:var(--wb-muted,#6b7280);font-size:16px;cursor:pointer;padding:2px 6px}",
]);
