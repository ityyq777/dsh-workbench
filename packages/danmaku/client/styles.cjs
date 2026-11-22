"use strict";
/**
 * 弹幕插件的页面样式。
 * 基础类名来自共享 baseStyles("wbdm")，这里只补弹幕专属的排版与控件外观；
 * 颜色一律走主题 token，浅色/深色都由 DSH 主题驱动。
 */
var baseStyles = require("../../lib/client-base-styles.cjs");
// 共享开关控件的样式（wbctl-*），随本插件样式表一起注入。
var SW = require("../../lib/switch.cjs");
// 共享数字输入控件的样式（wbctl-num*），同样随本插件样式表注入。
var NF = require("../../lib/number-field.cjs");

function pageStyles() {
  return [
    /* 页面骨架：hero 一行，下面是卡片 */
    ".wbdm-wrap{display:flex;flex-direction:column;gap:14px;padding:18px 20px 28px;height:100%;box-sizing:border-box;overflow:auto}",
    ".wbdm-hero{display:flex;align-items:flex-end;justify-content:space-between;gap:18px;flex-wrap:wrap}",
    ".wbdm-hero-main{min-width:0}",

    /* 右侧指标卡 */
    ".wbdm-kpis{display:flex;gap:8px;flex-wrap:wrap}",
    ".wbdm-kpi{min-width:82px;padding:8px 12px;border:1px solid var(--wb-border,#e5e7eb);border-radius:10px;background:var(--wb-card,#fff)}",
    ".wbdm-kpi-v{font-size:19px;font-weight:700;line-height:1.15;letter-spacing:-.01em}",
    ".wbdm-kpi-l{margin-top:3px;font-size:11px;color:var(--wb-muted,#6b7280)}",

    /* 卡片 */
    ".wbdm-card{border:1px solid var(--wb-border,#e5e7eb);border-radius:12px;background:var(--wb-card,#fff);padding:14px 16px}",
    ".wbdm-card-h{display:flex;align-items:baseline;justify-content:space-between;gap:12px;margin-bottom:10px}",
    ".wbdm-card-t{font-size:13px;font-weight:650}",
    ".wbdm-card-s{font-size:11px;color:var(--wb-muted,#6b7280)}",

    /* 添加区 */
    ".wbdm-textarea{display:block;width:100%;box-sizing:border-box;min-height:62px;padding:10px 12px;border:1px solid var(--wb-border,#e5e7eb);border-radius:10px;background:var(--wb-surface,#fff);color:inherit;font:inherit;font-size:13px;line-height:1.55;resize:vertical}",
    ".wbdm-textarea::placeholder{color:var(--wb-muted,#9ca3af)}",
    ".wbdm-textarea:focus{outline:none;border-color:var(--wb-accent,#2563eb);box-shadow:0 0 0 3px rgba(37,99,235,.14)}",
    ".wbdm-tones{display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-right:auto}",
    ".wbdm-tone{display:inline-flex;align-items:center;gap:5px;padding:3px 10px;border:1px solid var(--wb-border,#e5e7eb);border-radius:999px;background:transparent;color:var(--wb-muted,#6b7280);font-size:11px;line-height:1.6;cursor:pointer}",
    ".wbdm-tone:hover{border-color:var(--wb-accent,#2563eb);color:var(--wb-accent,#2563eb)}",
    ".wbdm-tone.on{border-color:var(--wb-accent,#2563eb);color:var(--wb-accent,#2563eb);background:rgba(37,99,235,.08)}",
    ".wbdm-dot{width:6px;height:6px;border-radius:50%;background:var(--wb-muted,#6b7280);flex:none}",
    ".wbdm-dot.accent{background:var(--wb-accent,#2563eb)}",
    ".wbdm-dot.success{background:var(--wb-ok,#16a34a)}",
    ".wbdm-dot.warn{background:var(--wb-warn,#d97706)}",
    ".wbdm-dot.danger{background:var(--wb-danger,#dc2626)}",
    ".wbdm-counter{font-size:11px;color:var(--wb-muted,#6b7280);font-variant-numeric:tabular-nums}",

    /* 按钮 */
    ".wbdm-btn{display:inline-flex;align-items:center;justify-content:center;gap:5px;padding:5px 12px;border:1px solid var(--wb-border,#e5e7eb);border-radius:8px;background:var(--wb-card,#fff);color:inherit;font-size:12px;line-height:1.6;cursor:pointer}",
    ".wbdm-btn:hover{border-color:var(--wb-accent,#2563eb);color:var(--wb-accent,#2563eb)}",
    ".wbdm-btn.primary{border-color:var(--wb-accent,#2563eb);background:var(--wb-accent,#2563eb);color:#fff}",
    ".wbdm-btn.primary:hover{opacity:.9;color:#fff}",
    ".wbdm-btn:disabled{opacity:.45;cursor:not-allowed}",
    ".wbdm-btn.primary:disabled{background:var(--wb-border,#e5e7eb);border-color:var(--wb-border,#e5e7eb);color:var(--wb-muted,#6b7280)}",
    ".wbdm-btn.ghost{border-color:transparent;background:transparent;color:var(--wb-muted,#6b7280)}",

    /* 清单 */
    ".wbdm-list{display:flex;flex-direction:column}",
    ".wbdm-item{display:flex;align-items:center;gap:10px;padding:10px 8px;border-top:1px solid var(--wb-line,#eef0f3);min-width:0}",
    ".wbdm-item:first-child{border-top:0}",
    ".wbdm-item:hover{background:rgba(127,127,127,.06);border-radius:8px}",
    ".wbdm-order{flex:none;width:18px;text-align:right;font-size:11px;color:var(--wb-muted,#9ca3af);font-variant-numeric:tabular-nums}",
    ".wbdm-body{flex:1 1 auto;min-width:0;font-size:13px;line-height:1.45;overflow-wrap:anywhere}",
    ".wbdm-item.off .wbdm-body{color:var(--wb-muted,#9ca3af);text-decoration:line-through}",
    ".wbdm-tag{display:inline-flex;align-items:center;gap:4px;flex:none;padding:1px 8px;border:1px solid var(--wb-border,#e5e7eb);border-radius:999px;font-size:11px;color:var(--wb-muted,#6b7280)}",
    ".wbdm-item-edit{flex:1 1 auto;min-width:0;padding:4px 8px;border:1px solid var(--wb-accent,#2563eb);border-radius:8px;background:var(--wb-surface,#fff);color:inherit;font:inherit;font-size:13px}",
    ".wbdm-item-edit:focus{outline:none;box-shadow:0 0 0 3px rgba(37,99,235,.14)}",
    ".wbdm-ops{display:flex;align-items:center;gap:2px;flex:none;opacity:.55;transition:opacity .15s}",
    ".wbdm-item:hover .wbdm-ops,.wbdm-ops:focus-within{opacity:1}",
    ".wbdm-icon-btn{display:inline-flex;align-items:center;justify-content:center;width:26px;height:26px;border:0;border-radius:7px;background:transparent;color:var(--wb-muted,#6b7280);cursor:pointer}",
    ".wbdm-icon-btn:hover{background:rgba(127,127,127,.12);color:var(--wb-accent,#2563eb)}",
    ".wbdm-icon-btn.danger:hover{color:var(--wb-danger,#dc2626)}",
    ".wbdm-icon-btn:disabled{opacity:.3;cursor:not-allowed}",

    /* 开关外观统一由 lib/switch.cjs 的 wbctl-* 规则提供，见文件末尾追加 */
    // 行内小开关（添加卡里的「卡片背景」）
    ".wbdm-inline-label{white-space:nowrap}",
    // 行内「卡片/纯文字」标签：点一下切换该条弹幕是否有底
    ".wbdm-cardtag{flex:none;padding:1px 8px;border:1px solid var(--wb-border,#e5e7eb);border-radius:999px;background:none;",
    "font:inherit;font-size:11px;color:var(--wb-muted,#6b7280);cursor:pointer;transition:color .12s,border-color .12s,background .12s}",
    ".wbdm-cardtag:hover{color:var(--wb-accent,#2563eb);border-color:var(--wb-accent,#2563eb)}",
    ".wbdm-cardtag.plain{color:var(--wb-muted,#9ca3af);border-style:dashed}",

    /* 空态与提示 */
    ".wbdm-empty-card{display:flex;flex-direction:column;align-items:center;gap:8px;padding:26px 16px;border:1px dashed var(--wb-border,#e5e7eb);border-radius:10px;color:var(--wb-muted,#6b7280);font-size:12px;text-align:center}",
    ".wbdm-empty-icon{display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:50%;background:rgba(37,99,235,.1);color:var(--wb-accent,#2563eb)}",
    ".wbdm-notice{margin:0}",

    /* 配置页：分组卡 + 行式布局 */
    ".wbdm-crow{display:grid;grid-template-columns:minmax(150px,260px) minmax(0,1fr);align-items:center;gap:14px;padding:10px 0;border-top:1px solid var(--wb-line,#eef0f3)}",
    ".wbdm-crow:first-child{border-top:0}",
    ".wbdm-clabel{font-size:12px;font-weight:550}",
    ".wbdm-chint{margin-top:2px;font-size:11px;color:var(--wb-muted,#6b7280);line-height:1.5}",
    ".wbdm-ctl{display:flex;align-items:center;gap:8px;min-width:0}",
    ".wbdm-input,.wbdm-select{box-sizing:border-box;padding:5px 9px;border:1px solid var(--wb-border,#e5e7eb);border-radius:8px;background:var(--wb-surface,#fff);color:inherit;font:inherit;font-size:12px}",
    ".wbdm-input{width:100%;max-width:280px}",
    /* 数字项改用共享控件（wbctl-num*）后，这里只给它一个与其它控件一致的窄宽度。 */
    ".wbdm-crow .wbctl-num .wbctl-num-input{width:120px}",
    ".wbdm-select{min-width:140px;max-width:280px}",
    ".wbdm-input:focus,.wbdm-select:focus{outline:none;border-color:var(--wb-accent,#2563eb);box-shadow:0 0 0 3px rgba(37,99,235,.14)}",

    /* 桌面层状态 */
    ".wbdm-status{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:8px;margin:2px 0 12px}",
    ".wbdm-status-cell{padding:8px 10px;border:1px solid var(--wb-border,#e5e7eb);border-radius:9px;background:var(--wb-surface,#fff)}",
    ".wbdm-status-k{font-size:11px;color:var(--wb-muted,#6b7280)}",
    ".wbdm-status-v{margin-top:2px;font-size:12px;font-weight:550}",
    ".wbdm-status-actions{display:flex;gap:8px;flex-wrap:wrap}",

    /* 页面标题、指标卡数值（库页/配置页共用） */
    ".wbdm-page-title{font-size:17px;font-weight:680;letter-spacing:-.01em}",
    ".wbdm-page-sub{margin-top:3px;font-size:12px;color:var(--wb-muted,#6b7280)}",
    ".wbdm-kpi-v,.wbdm-kpi-n{font-size:19px;font-weight:700;line-height:1.15;letter-spacing:-.01em}",
    ".wbdm-kpi-n.ok{color:var(--wb-ok,#16a34a)}",
    ".wbdm-kpi-n.warn{color:var(--wb-warn,#d97706)}",

    /* 颜色胶囊（详情面板复用添加区样式） */
    ".wbdm-tone-chip{display:inline-flex;align-items:center;gap:5px;padding:3px 10px;border:1px solid var(--wb-border,#e5e7eb);border-radius:999px;background:transparent;color:var(--wb-muted,#6b7280);font-size:11px;line-height:1.6;cursor:pointer}",
    ".wbdm-tone-chip:hover{border-color:var(--wb-accent,#2563eb);color:var(--wb-accent,#2563eb)}",
    ".wbdm-tone-chip.on{border-color:var(--wb-accent,#2563eb);color:var(--wb-accent,#2563eb);background:rgba(37,99,235,.08)}",

    /* 清单行：正文可点开详情 */
    "button.wbdm-body{padding:0;border:0;background:none;color:inherit;font:inherit;text-align:left;cursor:pointer}",
    "button.wbdm-body:hover{color:var(--wb-accent,#2563eb)}",
    ".wbdm-meta{flex:none;font-size:10px;color:var(--wb-muted,#9ca3af);font-variant-numeric:tabular-nums}",

    /* 详情面板 */
    ".wbdm-modal{position:fixed;inset:0;z-index:900;display:flex;align-items:center;justify-content:center;padding:24px;background:rgba(15,17,21,.42)}",
    ".wbdm-modal-card{display:flex;flex-direction:column;width:min(620px,100%);max-height:min(86vh,820px);border:1px solid var(--wb-border,#e5e7eb);border-radius:14px;background:var(--wb-card,#fff);box-shadow:0 18px 60px rgba(0,0,0,.28);overflow:hidden}",
    ".wbdm-modal-h{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;padding:16px 18px 12px;border-bottom:1px solid var(--wb-line,#eef0f3)}",
    ".wbdm-modal-t{font-size:15px;font-weight:660}",
    ".wbdm-modal-s{margin-top:2px;font-size:11px;color:var(--wb-muted,#6b7280)}",
    ".wbdm-modal-body{padding:4px 18px 14px;overflow:auto}",
    ".wbdm-modal-foot{display:flex;justify-content:flex-end;gap:8px;padding:12px 18px;border-top:1px solid var(--wb-line,#eef0f3);background:var(--wb-surface,#fff)}",
    ".wbdm-section{padding:12px 0 6px;border-top:1px solid var(--wb-line,#eef0f3)}",
    ".wbdm-section:first-child{border-top:0}",
    ".wbdm-section-t{margin-bottom:6px;font-size:11px;font-weight:650;letter-spacing:.02em;color:var(--wb-muted,#6b7280)}",
    ".wbdm-card-action{margin-left:auto}",
    ".wbdm-crow-label{display:block;min-width:0}",
    ".wbdm-crow-t{display:block;font-size:12px;font-weight:550}",
    ".wbdm-crow-h{display:block;margin-top:2px;font-size:10px;color:var(--wb-muted,#9ca3af);line-height:1.45}",

    /* 详情面板顶部的实时预览舞台 */
    ".wbdm-preview{position:relative;margin:12px 16px 0;border:1px solid var(--wb-border,#e5e7eb);border-radius:12px;background:var(--wb-surface,#f8fafc);overflow:hidden}",
    ".wbdm-preview-stage{position:relative;height:132px;overflow:hidden}",
    ".wbdm-preview-hint{position:absolute;right:12px;bottom:8px;font-size:10px;letter-spacing:.02em;color:var(--wb-muted,#9ca3af);pointer-events:none}",

    /* 深色：卡片底色更贴近主题表面 */
    "@media (prefers-color-scheme:dark){.wbdm-kpi,.wbdm-card,.wbdm-status-cell{background:var(--wb-surface,#16181d)}}",
  ];
}

module.exports = function styles() {
  // 共享开关与数字输入样式追加在页面样式之后，重复追加无害（规则完全一致）。
  return baseStyles("wbdm").concat(pageStyles(), SW.styles, NF.styles);
};
module.exports.pageStyles = pageStyles;
