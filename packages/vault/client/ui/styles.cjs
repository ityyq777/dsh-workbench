"use strict";
/**
 * 凭据保险箱界面样式。
 *
 * 约定：
 * 1. 颜色、边框、阴影、遮罩只用主题 token（--wb-*、--dsw-alias-*），不写死色值，
 *    浅色/深色都由宿主主题派生；hover/focus/disabled 三态在两种主题下都要可辨。
 * 2. 结构类按「页头 → 工具条 → 卡片/指标 → 表格 → 空态 → 弹层」排，视图只组合这些类，
 *    不再各页自己写行内样式。
 * 3. 共享件（secret-field / vault-lock / filter-checklist / icon-label）的样式在文件末尾合并，
 *    本文件不再重复定义它们的类。
 */
module.exports = [
  /* ---------- 根容器与文字 ---------- */
  ".wbv{display:flex;flex-direction:column;gap:14px;min-height:100%;padding:2px;font-size:13px;line-height:1.5;color:inherit}",
  ".wbv h2,.wbv h3{margin:0}",
  ".wbv-muted{color:var(--wb-muted)}",
  ".wbv-row{display:flex;align-items:center;gap:8px;flex-wrap:wrap}",
  ".wbv-inline{display:inline-flex;align-items:center;gap:6px;flex-wrap:wrap}",
  ".wbv-grow{flex:1 1 auto;min-width:0}",
  ".wbv-stack{display:flex;flex-direction:column;gap:10px;min-width:0}",

  /* ---------- 页头 ---------- */
  ".wbv-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;flex-wrap:wrap}",
  ".wbv-head-main{display:flex;flex-direction:column;gap:3px;min-width:0}",
  ".wbv-title-row{display:flex;align-items:center;gap:8px;flex-wrap:wrap;min-width:0}",
  ".wbv-title{display:flex;align-items:center;gap:8px;margin:0;font-size:17px;font-weight:650;line-height:1.25}",
  ".wbv-sub{margin:0;font-size:12px;color:var(--wb-muted);max-width:76ch}",
  ".wbv-head-actions{display:flex;align-items:center;gap:8px;flex-wrap:wrap}",

  /* ---------- 工具条 ---------- */
  ".wbv-toolbar{display:flex;align-items:center;gap:8px;flex-wrap:wrap}",
  ".wbv-toolbar>.wbv-search{flex:0 1 260px;width:260px;max-width:100%}",
  ".wbv-toolbar>.wbv-select{flex:0 0 auto;width:auto;min-width:120px}",
  ".wbv-toolbar-tail{flex:1 1 auto}",

  /* ---------- 按钮 ---------- */
  ".wbv-btn{display:inline-flex;align-items:center;justify-content:center;gap:5px;min-height:30px;padding:0 11px;border:1px solid var(--wb-border);border-radius:8px;background:var(--wb-card);color:inherit;font:inherit;font-size:12.5px;white-space:nowrap;cursor:pointer;transition:background 140ms ease,border-color 140ms ease,color 140ms ease}",
  ".wbv-btn:hover:enabled{background:color-mix(in srgb,var(--wb-accent) 8%,var(--wb-card));border-color:color-mix(in srgb,var(--wb-accent) 52%,var(--wb-border))}",
  ".wbv-btn:active:enabled{background:color-mix(in srgb,var(--wb-accent) 14%,var(--wb-card))}",
  ".wbv-btn:focus-visible{outline:2px solid var(--wb-accent);outline-offset:2px}",
  ".wbv-btn:disabled{opacity:.45;cursor:not-allowed}",
  ".wbv-btn.primary{background:var(--wb-accent);border-color:var(--wb-accent);color:var(--dsw-alias-label-primary-inverted,#fff);font-weight:600}",
  ".wbv-btn.primary:hover:enabled{background:color-mix(in srgb,var(--wb-accent) 86%,var(--wb-muted));border-color:transparent}",
  ".wbv-btn.primary:active:enabled{background:color-mix(in srgb,var(--wb-accent) 78%,var(--wb-muted))}",
  ".wbv-btn.danger{color:var(--wb-danger);border-color:color-mix(in srgb,var(--wb-danger) 42%,var(--wb-border))}",
  ".wbv-btn.danger:hover:enabled{background:color-mix(in srgb,var(--wb-danger) 10%,var(--wb-card));border-color:color-mix(in srgb,var(--wb-danger) 60%,var(--wb-border))}",
  ".wbv-btn.ghost{min-height:26px;padding:0 6px;background:transparent;border-color:transparent;color:var(--wb-muted)}",
  ".wbv-btn.ghost:hover:enabled{background:color-mix(in srgb,var(--wb-accent) 10%,transparent);border-color:transparent;color:var(--wb-accent)}",
  ".wbv-btn.wbv-delete{color:var(--wb-danger)}",
  ".wbv-btn.ghost.wbv-delete:hover:enabled{background:color-mix(in srgb,var(--wb-danger) 10%,transparent);color:var(--wb-danger)}",
  ".wbv-icon-btn{display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;padding:0;border:1px solid transparent;border-radius:8px;background:transparent;color:var(--wb-muted);cursor:pointer;flex:none}",
  ".wbv-icon-btn:hover:enabled{background:color-mix(in srgb,var(--wb-accent) 10%,transparent);color:var(--wb-accent)}",
  ".wbv-icon-btn:focus-visible{outline:2px solid var(--wb-accent);outline-offset:2px}",
  ".wbv-icon-btn:disabled{opacity:.45;cursor:not-allowed}",

  /* ---------- 表单 ---------- */
  ".wbv-field{display:flex;flex-direction:column;gap:5px;min-width:0}",
  ".wbv-row>.wbv-field{flex:1 1 200px}",
  ".wbv-label{font-size:11.5px;font-weight:600;color:var(--wb-muted)}",
  ".wbv-hint{font-size:11px;color:var(--wb-muted);line-height:1.45}",
  ".wbv-input,.wbv-select,.wbv-textarea{box-sizing:border-box;width:100%;min-height:30px;padding:5px 9px;border:1px solid var(--wb-border);border-radius:8px;background:var(--wb-surface);color:inherit;font:inherit;font-size:12.5px}",
  ".wbv-input::placeholder,.wbv-textarea::placeholder{color:var(--wb-muted);opacity:.8}",
  ".wbv-input:focus-visible,.wbv-select:focus-visible,.wbv-textarea:focus-visible{outline:2px solid var(--wb-accent);outline-offset:1px;border-color:transparent}",
  ".wbv-input:disabled,.wbv-select:disabled,.wbv-textarea:disabled{opacity:.6;cursor:not-allowed}",
  ".wbv-textarea{min-height:76px;resize:vertical}",
  ".wbv input[type=checkbox],.wbv input[type=radio]{accent-color:var(--wb-accent);width:15px;height:15px;margin:0;flex:none;cursor:pointer}",
  ".wbv-check-list{display:flex;flex-wrap:wrap;gap:6px 14px;margin:2px 0}",
  ".wbv-check{display:inline-flex;align-items:center;gap:6px;font-size:12px;cursor:pointer;min-height:24px}",
  ".wbv-check:has(input:disabled){opacity:.6;cursor:not-allowed}",
  ".wbv-choice{display:flex;align-items:flex-start;gap:9px;padding:9px 10px;border:1px solid var(--wb-border);border-radius:9px;background:var(--wb-surface);cursor:pointer}",
  ".wbv-choice:hover{border-color:color-mix(in srgb,var(--wb-accent) 45%,var(--wb-border))}",
  ".wbv-choice:has(input:checked){border-color:var(--wb-accent);background:color-mix(in srgb,var(--wb-accent) 8%,var(--wb-surface))}",
  ".wbv-form-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px}",
  ".wbv-form-actions{display:flex;align-items:center;justify-content:flex-end;gap:8px;flex-wrap:wrap;margin-top:12px}",
  ".wbv-choice-text{display:flex;flex-direction:column;gap:2px;min-width:0}",
  ".wbv-choice-title{font-size:12.5px;font-weight:600}",
  ".wbv-choice-desc{font-size:11.5px;color:var(--wb-muted);line-height:1.45}",

  /* ---------- 提示 ---------- */
  ".wbv-notice{border:1px solid color-mix(in srgb,var(--wb-accent) 35%,var(--wb-border));border-radius:9px;padding:8px 11px;font-size:12px;line-height:1.5;background:color-mix(in srgb,var(--wb-accent) 7%,transparent);color:inherit}",
  ".wbv-notice.error{border-color:color-mix(in srgb,var(--wb-danger) 45%,var(--wb-border));background:color-mix(in srgb,var(--wb-danger) 9%,transparent);color:var(--wb-danger)}",
  ".wbv-notice.ok{border-color:color-mix(in srgb,var(--wb-ok) 45%,var(--wb-border));background:color-mix(in srgb,var(--wb-ok) 9%,transparent);color:var(--wb-ok)}",
  ".wbv-notice.warn{border-color:color-mix(in srgb,var(--wb-warn) 45%,var(--wb-border));background:color-mix(in srgb,var(--wb-warn) 9%,transparent);color:var(--wb-warn)}",

  /* ---------- 卡片与指标 ---------- */
  ".wbv-card{border:1px solid var(--wb-border);border-radius:12px;background:var(--wb-card);padding:14px;min-width:0}",
  ".wbv-card-head{display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;margin-bottom:10px}",
  ".wbv-card-title{font-size:13.5px;font-weight:650;margin:0}",
  ".wbv-card-actions{display:flex;align-items:center;gap:8px;flex-wrap:wrap}",
  ".wbv-stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px}",
  ".wbv-stat{display:flex;flex-direction:column;gap:3px;padding:12px 14px;border:1px solid var(--wb-border);border-radius:12px;background:var(--wb-surface);min-width:0}",
  ".wbv-stat-label{font-size:11px;font-weight:600;color:var(--wb-muted)}",
  ".wbv-stat-value{font-size:22px;font-weight:650;line-height:1.15;font-variant-numeric:tabular-nums}",
  ".wbv-stat-hint{font-size:11px;color:var(--wb-muted);line-height:1.4}",

  /* ---------- 表格 ---------- */
  ".wbv-table-wrap{max-width:100%;overflow:auto;border:1px solid var(--wb-border);border-radius:10px;background:var(--wb-card)}",
  ".wbv-table-wrap:focus-visible{outline:2px solid var(--wb-accent);outline-offset:2px}",
  ".wbv-table{width:100%;border-collapse:collapse;font-size:12.5px}",
  ".wbv-table th{position:sticky;top:0;z-index:1;padding:9px 12px;text-align:left;white-space:nowrap;font-size:11px;font-weight:600;letter-spacing:.02em;color:var(--wb-muted);background:var(--wb-surface);border-bottom:1px solid var(--wb-line)}",
  ".wbv-table td{padding:10px 12px;text-align:left;vertical-align:middle;border-bottom:1px solid var(--wb-line)}",
  ".wbv-table tbody tr:last-child td{border-bottom:none}",
  ".wbv-table tbody tr:hover{background:color-mix(in srgb,var(--wb-accent) 5%,transparent)}",
  ".wbv-table .wbv-right{text-align:right}",
  ".wbv-table td.wbv-table-empty{padding:26px 12px;text-align:center;color:var(--wb-muted)}",
  ".wbv-table code{font-size:11px;color:var(--wb-muted)}",
  ".wbv-table .wbv-actions{display:flex;align-items:center;gap:2px;justify-content:flex-end;flex-wrap:wrap}",
  ".wbv-table .wbv-cell-main{font-weight:600}",
  ".wbv-table .wbv-cell-sub{font-size:11px;color:var(--wb-muted)}",

  /* ---------- 空态 ---------- */
  ".wbv-empty{padding:26px 16px;text-align:center;color:var(--wb-muted);font-size:12.5px;border:1px dashed var(--wb-border);border-radius:12px}",
  ".wbv-empty-card{display:flex;flex-direction:column;align-items:center;gap:8px;padding:28px 16px;text-align:center;border:1px dashed var(--wb-border);border-radius:12px;background:var(--wb-card)}",
  ".wbv-empty-icon{display:inline-flex;color:var(--wb-muted)}",
  ".wbv-empty-title{font-size:14px;font-weight:600}",
  ".wbv-empty-actions{display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin-top:2px}",

  /* ---------- 弹层 ---------- */
  ".wbv-modal{position:fixed;inset:0;z-index:50;display:flex;align-items:center;justify-content:center;padding:18px;background:color-mix(in srgb,var(--wb-muted) 45%,transparent)}",
  ".wbv-modal-box{display:flex;flex-direction:column;gap:12px;width:min(540px,100%);max-height:88vh;padding:16px;border:1px solid var(--wb-border);border-radius:14px;background:var(--wb-card);box-shadow:0 18px 50px color-mix(in srgb,var(--wb-muted) 32%,transparent);outline:none}",
  ".wbv-modal-box:focus-visible{outline:2px solid var(--wb-accent);outline-offset:2px}",
  ".wbv-modal-head{display:flex;align-items:flex-start;justify-content:space-between;gap:10px}",
  ".wbv-modal-title{margin:0;font-size:15px;font-weight:650;line-height:1.3}",
  ".wbv-modal-sub{margin:0;font-size:12px;color:var(--wb-muted);line-height:1.5}",
  ".wbv-modal-body{display:flex;flex-direction:column;gap:12px;min-height:0;overflow:auto}",
  ".wbv-modal-foot{display:flex;align-items:center;justify-content:flex-end;gap:8px;flex-wrap:wrap;padding-top:2px}",
  ".wbv-modal-foot .wbv-grow{flex:1 1 auto}",

  /* ---------- 分栏、列表、标签 ---------- */
  ".wbv-split{display:grid;grid-template-columns:minmax(240px,.9fr) minmax(0,1.6fr);gap:12px;align-items:start}",
  ".wbv-list{display:flex;flex-direction:column;gap:6px;min-width:0}",
  ".wbv-item{display:flex;flex-direction:column;gap:3px;padding:9px 10px;border:1px solid var(--wb-border);border-radius:10px;background:var(--wb-card);cursor:pointer;text-align:left;color:inherit;font:inherit}",
  ".wbv-item:hover{border-color:color-mix(in srgb,var(--wb-accent) 45%,var(--wb-border));background:color-mix(in srgb,var(--wb-accent) 5%,var(--wb-card))}",
  ".wbv-item:focus-visible{outline:2px solid var(--wb-accent);outline-offset:1px}",
  ".wbv-item.on{border-color:var(--wb-accent);box-shadow:inset 3px 0 0 var(--wb-accent)}",
  ".wbv-item-top{display:flex;align-items:center;gap:8px;min-width:0}",
  ".wbv-item-title{font-weight:600;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
  ".wbv-item-sub{font-size:11px;color:var(--wb-muted);line-height:1.4}",
  ".wbv-dot{display:inline-block;width:8px;height:8px;border-radius:50%;flex:none;background:var(--wb-accent)}",
  ".wbv-chips{display:flex;align-items:center;gap:6px;flex-wrap:wrap}",
  ".wbv-chip{display:inline-flex;align-items:center;gap:5px;padding:2px 8px;border:1px solid var(--wb-border);border-radius:999px;background:var(--wb-surface);font-size:11px;line-height:1.6;max-width:100%}",
  ".wbv-chip>span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
  /* ---------- 共享选择器（凭据多选，内核见 lib/search-picker.cjs） ---------- */
  ".wbv-picker{position:relative;display:inline-flex;flex-wrap:wrap;align-items:center;gap:6px;min-width:0;max-width:100%}",
  ".wbv-picker-btn{display:inline-flex;align-items:center;gap:6px;min-height:30px;padding:0 10px;border:1px solid var(--wb-border);border-radius:8px;background:var(--wb-card);color:inherit;font:inherit;font-size:12.5px;max-width:100%;cursor:pointer;transition:background 140ms ease,border-color 140ms ease,color 140ms ease}",
  ".wbv-picker-btn:hover:enabled{background:color-mix(in srgb,var(--wb-accent) 8%,var(--wb-card));border-color:color-mix(in srgb,var(--wb-accent) 52%,var(--wb-border))}",
  ".wbv-picker-btn:focus-visible{outline:2px solid var(--wb-accent);outline-offset:2px}",
  ".wbv-picker-btn.on{border-color:color-mix(in srgb,var(--wb-accent) 60%,var(--wb-border));color:var(--wb-accent)}",
  ".wbv-picker-btn:disabled{opacity:.45;cursor:not-allowed}",
  ".wbv-picker-menu{position:absolute;z-index:40;top:calc(100% + 4px);left:0;box-sizing:border-box;min-width:300px;max-width:min(420px,88vw);padding:8px;border:1px solid var(--wb-border);border-radius:10px;background:var(--wb-card);box-shadow:0 14px 34px color-mix(in srgb,var(--wb-muted) 30%,transparent)}",
  ".wbv-pill{display:inline-flex;align-items:center;gap:4px;padding:1px 8px;border-radius:999px;font-size:11px;line-height:1.7;background:color-mix(in srgb,var(--wb-muted) 14%,transparent);color:inherit;white-space:nowrap}",
  ".wbv-pill.ok{background:color-mix(in srgb,var(--wb-ok) 16%,transparent);color:var(--wb-ok)}",
  ".wbv-pill.warn{background:color-mix(in srgb,var(--wb-warn) 18%,transparent);color:var(--wb-warn)}",
  ".wbv-pill.bad{background:color-mix(in srgb,var(--wb-danger) 16%,transparent);color:var(--wb-danger)}",

  /* ---------- 明文与代码块 ---------- */
  ".wbv-secret{font-family:ui-monospace,Menlo,Consolas,monospace;font-size:12.5px;word-break:break-all;padding:10px 12px;border:1px solid var(--wb-border);border-radius:9px;background:var(--wb-surface)}",
  ".wbv-code{font-family:ui-monospace,Menlo,Consolas,monospace;font-size:11px;white-space:pre-wrap;word-break:break-word;padding:10px;border:1px solid var(--wb-border);border-radius:9px;background:var(--wb-surface);max-height:320px;overflow:auto}",
  ".wbv-scroll{max-height:220px;overflow:auto;padding:8px;border:1px solid var(--wb-border);border-radius:9px}",

  /* ---------- 窄屏 ---------- */
  "@media (max-width:900px){.wbv-split{grid-template-columns:1fr}.wbv-head{flex-direction:column;align-items:stretch}.wbv-head-actions{justify-content:flex-start}.wbv-toolbar>.wbv-search{flex:1 1 100%;width:100%}}",
].concat(require("../../../lib/stepper.cjs").styles, require("../../../lib/staged-dialog.cjs").styles).concat(require("../../../lib/vault-lock.cjs").create({ prefix: "wbv" }).styles()).concat(require("../../../lib/filter-checklist-styles.cjs")).concat(require("../../../lib/client-base-styles.cjs").secretFieldStyles, require("../../../lib/icon-label.cjs").styles);
