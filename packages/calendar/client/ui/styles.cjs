"use strict";
/** 基础样式 + 日历页面专属规则。 */
module.exports = require("../../../lib/client-base-styles.cjs")("wbca").concat([
  ".wbca-page{display:flex;flex-direction:column;gap:12px;padding:16px;overflow:auto;height:100%;box-sizing:border-box}",
  ".wbca-input{border:1px solid var(--wb-border,#d1d5db);border-radius:7px;padding:6px 8px;font:inherit;background:var(--wb-surface,#fff);color:inherit;min-width:120px}",
  ".wbca-actions{display:flex;gap:8px;justify-content:flex-end;margin-top:8px}",
  ".wbca-list{display:flex;flex-direction:column;gap:2px}",
  ".wbca-list-row{display:flex;align-items:center;gap:10px;padding:8px;border-bottom:1px solid var(--wb-border,#eef0f3)}",
  ".wbca-main{display:flex;flex-direction:column;gap:2px;min-width:0;flex:1}",
  ".wbca-time{font-variant-numeric:tabular-nums;font-size:12px;color:var(--wb-muted,#6b7280);min-width:44px}",
  ".wbca-dot{width:9px;height:9px;border-radius:50%;background:#11a89b;flex:none}",
  ".wbca-big{font-size:22px;font-weight:700}",
  ".wbca-cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:10px}",
  ".wbca-group h3{font-size:12px;color:var(--wb-muted,#6b7280);margin:10px 0 2px}",
  ".wbca-icon-btn{border:0;background:transparent;color:var(--wb-muted,#6b7280);font-size:16px;line-height:1;cursor:pointer;padding:2px 6px;border-radius:6px}",
  ".wbca-icon-btn:hover{background:#fef2f2;color:#b91c1c}",
  ".wbca-ul{margin:6px 0 0;padding-left:18px;font-size:12px;line-height:1.7}",
]);
