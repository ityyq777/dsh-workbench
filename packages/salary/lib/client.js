// 由 scripts/build-addon-clients.mjs 生成；请修改对应 client/client.src.cjs 后重新构建。
window.__ModuleLoader__ = window.__ModuleLoader__ || { modules: {}, load: function (m) { this.modules[m.id] = m.factory; } };
window.__ModuleLoader__.load({
  id: "dsh-workbench-salary",
  factory: function (require) {
    var module = { exports: {} };
    var exports = module.exports;
"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res, err) => function __init() {
  if (err) throw err[0];
  try {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  } catch (e) {
    throw err = [e], e;
  }
};
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/addons/lib/client-base-styles.cjs
var require_client_base_styles = __commonJS({
  "packages/addons/lib/client-base-styles.cjs"(exports2, module2) {
    "use strict";
    var SECRET_FIELD = [
      ".wb-secret-field{position:relative;display:flex;align-items:center;min-width:0}",
      ".wb-secret-field input{flex:1 1 auto;min-width:0;padding-right:34px}",
      ".wb-eye{position:absolute;right:4px;display:inline-flex;align-items:center;justify-content:center;background:transparent;border:0;border-radius:6px;padding:4px;color:var(--wb-muted,#6b7280);cursor:pointer}",
      ".wb-eye:hover:not(:disabled){color:var(--wb-accent,#2563eb);background:color-mix(in srgb, var(--wb-accent,#2563eb) 12%, transparent)}",
      ".wb-eye:focus-visible{outline:2px solid var(--wb-accent,#2563eb);outline-offset:1px}",
      ".wb-eye:disabled{opacity:.45;cursor:not-allowed}"
    ];
    module2.exports = function baseStyles(prefix) {
      var p = String(prefix || "wb");
      var s = "." + p;
      return SECRET_FIELD.concat([
        s + "-wrap{display:flex;flex-direction:column;gap:12px;padding:16px;overflow:auto;height:100%;box-sizing:border-box}",
        s + "-head{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap}",
        s + "-title{font-size:16px;font-weight:650;margin:0}",
        s + "-sub{font-size:12px;color:var(--wb-muted,#6b7280);margin:2px 0 0}",
        s + "-row{display:flex;gap:8px;align-items:center;flex-wrap:wrap}",
        s + "-card{border:1px solid var(--wb-border,#e5e7eb);border-radius:10px;background:var(--wb-surface,#fff);padding:12px}",
        s + "-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px}",
        s + "-kpi{font-size:22px;font-weight:700;line-height:1.2}" + s + "-kpi-label{font-size:12px;color:var(--wb-muted,#6b7280)}",
        s + "-table{width:100%;border-collapse:collapse;font-size:12px}" + s + "-table th," + s + "-table td{padding:7px 8px;border-bottom:1px solid var(--wb-border,#eef0f3);text-align:left;vertical-align:top}",
        s + "-table th{font-weight:600;color:var(--wb-muted,#6b7280);white-space:nowrap}",
        s + "-btn{border:1px solid var(--wb-border,#d1d5db);background:var(--wb-surface,#fff);color:inherit;border-radius:7px;padding:5px 10px;font-size:12px;cursor:pointer}",
        s + "-btn:hover:not(:disabled){border-color:var(--wb-accent,#2563eb)}" + s + "-btn:disabled{opacity:.5;cursor:default}",
        s + "-btn.primary{background:var(--wb-accent,#2563eb);border-color:var(--wb-accent,#2563eb);color:#fff}",
        s + "-btn.danger{color:#b91c1c;border-color:#fecaca}",
        s + "-field{display:flex;flex-direction:column;gap:4px;font-size:12px}" + s + "-label{font-weight:600}",
        s + "-field input," + s + "-field select," + s + "-field textarea{border:1px solid var(--wb-border,#d1d5db);border-radius:7px;padding:6px 8px;font:inherit;background:var(--wb-surface,#fff);color:inherit;min-width:0}",
        s + "-hint{color:var(--wb-muted,#6b7280);font-size:11px}" + s + "-notice{padding:8px 10px;border-radius:8px;font-size:12px;background:#eff6ff;color:#1e40af}",
        s + "-notice.error{background:#fef2f2;color:#b91c1c}" + s + "-notice.ok{background:#ecfdf5;color:#047857}",
        s + "-empty{padding:18px;text-align:center;color:var(--wb-muted,#6b7280);font-size:12px;border:1px dashed var(--wb-border,#e5e7eb);border-radius:8px}",
        s + "-pill{display:inline-block;padding:1px 7px;border-radius:999px;font-size:11px;background:#f3f4f6;color:#374151}",
        s + "-pill.ok{background:#ecfdf5;color:#047857}" + s + "-pill.error{background:#fef2f2;color:#b91c1c}" + s + "-pill.warn{background:#fffbeb;color:#b45309}",
        s + "-json{margin:0;padding:8px;background:#f8fafc;border-radius:8px;font-size:11px;max-height:240px;overflow:auto}",
        s + "-muted{color:var(--wb-muted,#6b7280)}" + s + "-link{color:var(--wb-accent,#2563eb);cursor:pointer;text-decoration:none}",
        s + "-form{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px}"
      ]);
    };
    module2.exports.secretFieldStyles = SECRET_FIELD;
  }
});

// packages/addons/lib/date-picker-styles.cjs
var require_date_picker_styles = __commonJS({
  "packages/addons/lib/date-picker-styles.cjs"(exports2, module2) {
    "use strict";
    module2.exports = function datePickerStyles(prefix) {
      var p = String(prefix || "wb");
      return [
        ".{p}-dp,.{p}-dr{position:relative;min-width:0}",
        ".{p}-dp-field{display:flex;align-items:center;gap:6px;min-width:0}",
        ".{p}-dp-trigger{display:flex;align-items:center;gap:8px;min-width:0;width:100%;padding:8px 10px;border:1px solid var(--wb-border);border-radius:8px;background:var(--wb-surface);color:var(--wb-text,inherit);font:inherit;text-align:left;cursor:pointer;transition:border-color .15s,box-shadow .15s}",
        ".{p}-dp-trigger:hover{border-color:var(--wb-accent)}",
        ".{p}-dp-trigger:focus-visible{outline:2px solid var(--wb-accent);outline-offset:1px}",
        ".{p}-dp-trigger[disabled]{opacity:.55;cursor:not-allowed}",
        ".{p}-dp-glyph{width:13px;height:13px;flex:none;border:1.5px solid currentColor;border-radius:3px;position:relative;opacity:.72}",
        '.{p}-dp-glyph::before{content:"";position:absolute;left:-1.5px;right:-1.5px;top:3px;border-top:1.5px solid currentColor}',
        '.{p}-dp-glyph::after{content:"";position:absolute;left:3px;top:-3px;width:1.5px;height:3px;background:currentColor;box-shadow:4px 0 currentColor}',
        ".{p}-dp-value{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-variant-numeric:tabular-nums}",
        ".{p}-dp-value.is-empty{color:var(--wb-muted)}",
        ".{p}-dp-clear{flex:none;width:22px;height:22px;padding:0;border:0;border-radius:50%;background:color-mix(in srgb,var(--wb-muted) 14%,transparent);color:var(--wb-muted);font:inherit;line-height:1;cursor:pointer}",
        ".{p}-dp-clear:hover{color:var(--wb-danger);background:color-mix(in srgb,var(--wb-danger) 16%,transparent)}",
        ".{p}-dp-pop{position:absolute;z-index:40;top:calc(100% + 6px);left:0;width:272px;padding:10px;border:1px solid var(--wb-border);border-radius:12px;background:var(--wb-card);box-shadow:0 16px 40px color-mix(in srgb,var(--wb-text,var(--wb-border)) 18%,transparent);animation:{p}-dp-in .14s ease-out}",
        ".{p}-dp-head{display:flex;align-items:center;gap:6px;margin-bottom:8px}",
        ".{p}-dp-title{flex:1;text-align:center;font-size:13px;font-weight:600;font-variant-numeric:tabular-nums}",
        ".{p}-dp-nav{width:26px;height:26px;padding:0;border:1px solid var(--wb-border);border-radius:7px;background:transparent;color:inherit;font:inherit;line-height:1;cursor:pointer}",
        ".{p}-dp-nav:hover{border-color:var(--wb-accent);color:var(--wb-accent)}",
        ".{p}-dp-weekdays,.{p}-dp-grid{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:2px}",
        ".{p}-dp-weekdays{margin-bottom:4px;font-size:11px;color:var(--wb-muted);text-align:center}",
        ".{p}-dp-day{min-width:0;height:30px;padding:0;border:0;border-radius:7px;background:transparent;color:inherit;font:inherit;font-variant-numeric:tabular-nums;cursor:pointer}",
        ".{p}-dp-day:hover{background:color-mix(in srgb,var(--wb-accent) 12%,transparent)}",
        ".{p}-dp-day.is-between{background:color-mix(in srgb,var(--wb-accent) 16%,transparent);border-radius:0}",
        ".{p}-dp-day.is-today{box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--wb-accent) 55%,transparent)}",
        ".{p}-dp-day.is-on{background:var(--wb-accent);color:var(--wb-on-accent,inherit);font-weight:600}",
        ".{p}-dp-day:disabled{opacity:.35;cursor:not-allowed}",
        ".{p}-dp-day:focus-visible{outline:2px solid var(--wb-accent);outline-offset:-2px}",
        ".{p}-dp-foot{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:8px;padding-top:8px;border-top:1px solid var(--wb-line)}",
        ".{p}-dp-acts{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px}",
        ".{p}-dp-link{padding:4px 8px;border:0;border-radius:6px;background:color-mix(in srgb,var(--wb-muted) 12%,transparent);color:inherit;font:inherit;font-size:12px;cursor:pointer}",
        ".{p}-dp-link:hover{background:color-mix(in srgb,var(--wb-accent) 16%,transparent);color:var(--wb-accent)}",
        ".{p}-dp-hint{margin:6px 0 0;font-size:11px;color:var(--wb-muted)}",
        ".{p}-dp-pop.is-months{width:248px}",
        ".{p}-dp-months{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:4px;margin-bottom:6px}",
        ".{p}-dp-months .{p}-dp-day{height:34px}",
        "@keyframes {p}-dp-in{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:none}}"
      ].join("\n").replace(/\{p\}/g, p);
    };
  }
});

// packages/addons/salary/client/ui/styles.cjs
var require_styles = __commonJS({
  "packages/addons/salary/client/ui/styles.cjs"(exports2, module2) {
    "use strict";
    var BASE = require_client_base_styles()("wbsal");
    var PAGE = [
      /* 页面骨架 */
      ".wbsal-page{display:flex;flex-direction:column;gap:18px;padding:22px 24px 48px;box-sizing:border-box;width:100%;min-height:100%}",
      ".wbsal-head{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;flex-wrap:wrap}",
      ".wbsal-head-main{display:flex;flex-direction:column;gap:4px;min-width:0}",
      ".wbsal-eyebrow{font-size:10.5px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--wb-muted,#8b94a6)}",
      ".wbsal-head h2,.wbsal-page h2{font-size:21px;font-weight:650;margin:0;letter-spacing:-.01em;color:var(--wb-text,inherit)}",
      ".wbsal-sub{margin:0;font-size:12.5px;color:var(--wb-muted,#8b94a6)}",
      ".wbsal-head-actions{display:flex;align-items:center;gap:8px;flex-wrap:wrap}",
      ".wbsal-toolbar{display:flex;align-items:flex-end;gap:14px;flex-wrap:wrap;padding:12px 14px;border:1px solid var(--wb-border,#e2e6ec);border-radius:12px;background:var(--wb-surface,#fff)}",
      ".wbsal-toolbar .wbsal-field{gap:5px}",
      ".wbsal-toolbar-count{margin-left:auto;font-size:12px;color:var(--wb-muted,#8b94a6)}",
      ".wbsal-toolbar-count b{font-variant-numeric:tabular-nums;color:var(--wb-text,inherit)}",
      ".wbsal-toolbar-plain{background:transparent;border:0;padding:0;justify-content:flex-end}",
      ".wbsal-toolbar-end{margin-left:auto;display:flex;align-items:center;gap:10px;flex-wrap:wrap}",
      ".wbsal-toolbar-end .wbsal-toolbar-count{margin-left:0}",
      /* KPI */
      ".wbsal-kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(186px,1fr));gap:12px}",
      ".wbsal-card{border:1px solid var(--wb-border,#e2e6ec);border-radius:12px;padding:14px 16px;background:var(--wb-card,#fff);box-sizing:border-box;min-width:0}",
      ".wbsal-kpi{display:flex;flex-direction:column;gap:2px}",
      ".wbsal-kpi-head{display:flex;align-items:center;gap:7px;margin-bottom:6px}",
      ".wbsal-kpi-icon{display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;border-radius:8px;background:color-mix(in srgb,var(--wb-accent,#2563eb) 12%,transparent);color:var(--wb-accent,#2563eb);flex:0 0 auto}",
      ".wbsal-kpi span{display:block;font-size:12px;color:var(--wb-muted,#8b94a6)}",
      ".wbsal-kpi strong{display:block;font-size:24px;font-weight:680;font-variant-numeric:tabular-nums;line-height:1.15;letter-spacing:-.01em;color:var(--wb-text,inherit)}",
      ".wbsal-kpi em{display:block;font-size:11.5px;font-style:normal;color:var(--wb-muted,#8b94a6);margin-top:4px}",
      ".wbsal-kpi em b{font-weight:600;color:var(--wb-ok,#15803d);font-variant-numeric:tabular-nums}",
      ".wbsal-kpi em b.neg{color:var(--wb-danger,#b91c1c)}",
      /* 按钮与输入 */
      ".wbsal-btn{display:inline-flex;align-items:center;gap:5px;border:1px solid var(--wb-border,#d1d5db);background:var(--wb-surface,#fff);color:var(--wb-text,inherit);border-radius:9px;padding:6px 12px;font-size:12.5px;line-height:1.4;cursor:pointer;transition:border-color .12s,background .12s,color .12s}",
      ".wbsal-btn:hover:not(:disabled){border-color:var(--wb-accent,#2563eb);color:var(--wb-accent,#2563eb)}",
      ".wbsal-btn:disabled{opacity:.5;cursor:default}",
      ".wbsal-btn.primary{background:var(--wb-accent,#2563eb);border-color:var(--wb-accent,#2563eb);color:#fff}",
      ".wbsal-btn.primary:hover:not(:disabled){filter:brightness(1.06);color:#fff}",
      ".wbsal-btn.danger{color:var(--wb-danger,#b91c1c);border-color:color-mix(in srgb,var(--wb-danger,#b91c1c) 35%,transparent)}",
      ".wbsal-btn.danger:hover:not(:disabled){background:color-mix(in srgb,var(--wb-danger,#b91c1c) 10%,transparent);color:var(--wb-danger,#b91c1c)}",
      ".wbsal-btn.ghost{border-color:transparent;background:color-mix(in srgb,var(--wb-muted,#8b94a6) 11%,transparent);color:var(--wb-text,inherit)}",
      ".wbsal-btn.ghost:hover:not(:disabled){background:color-mix(in srgb,var(--wb-accent,#2563eb) 12%,transparent);color:var(--wb-accent,#2563eb)}",
      ".wbsal-input{border:1px solid var(--wb-border,#d1d5db);border-radius:8px;padding:7px 9px;font:inherit;font-size:12.5px;background:var(--wb-surface,#fff);color:var(--wb-text,inherit);min-width:88px;box-sizing:border-box}",
      ".wbsal-input:focus{outline:2px solid color-mix(in srgb,var(--wb-accent,#2563eb) 45%,transparent);outline-offset:1px;border-color:var(--wb-accent,#2563eb)}",
      ".wbsal-field{display:flex;flex-direction:column;gap:4px;font-size:12px;min-width:0}",
      ".wbsal-label{font-size:11.5px;font-weight:600;color:var(--wb-muted,#8b94a6)}",
      ".wbsal-hint{font-size:11px;color:var(--wb-muted,#8b94a6)}",
      ".wbsal-muted{font-size:12px;color:var(--wb-muted,#8b94a6)}",
      ".wbsal-danger{color:var(--wb-danger,#b91c1c);font-size:12px}",
      /* 月份分组 + 记录表 */
      ".wbsal-months{display:flex;flex-direction:column;gap:10px}",
      ".wbsal-month{display:flex;align-items:baseline;justify-content:space-between;gap:12px;padding:2px 2px 0}",
      ".wbsal-month-title{display:flex;align-items:baseline;gap:8px}",
      ".wbsal-month-title strong{font-size:13.5px;font-weight:650;color:var(--wb-text,inherit)}",
      ".wbsal-month-title span{font-size:11.5px;color:var(--wb-muted,#8b94a6)}",
      ".wbsal-month-total{font-size:12px;color:var(--wb-muted,#8b94a6)}",
      ".wbsal-month-total b{font-size:13px;color:var(--wb-text,inherit);font-variant-numeric:tabular-nums;margin-left:4px}",
      ".wbsal-table-wrap{border:1px solid var(--wb-border,#e2e6ec);border-radius:12px;background:var(--wb-card,#fff);overflow:hidden}",
      ".wbsal-table{width:100%;border-collapse:collapse;font-size:12.5px}",
      ".wbsal-table th,.wbsal-table td{padding:10px 14px;text-align:right;border-bottom:1px solid var(--wb-line,#eef0f4);font-variant-numeric:tabular-nums;white-space:nowrap}",
      ".wbsal-table th{font-size:11px;font-weight:600;letter-spacing:.04em;color:var(--wb-muted,#8b94a6);background:var(--wb-surface,#fff);padding-top:9px;padding-bottom:9px}",
      ".wbsal-table th:first-child,.wbsal-table td:first-child,.wbsal-table th.left,.wbsal-table td.left{text-align:left}",
      ".wbsal-table tbody tr:last-child td{border-bottom:0}",
      ".wbsal-record td{height:44px}",
      ".wbsal-record-row{cursor:pointer;transition:background .12s}",
      ".wbsal-record-row:hover td{background:color-mix(in srgb,var(--wb-accent,#2563eb) 5%,transparent)}",
      ".wbsal-record-row.open td{background:color-mix(in srgb,var(--wb-accent,#2563eb) 7%,transparent)}",
      ".wbsal-date{display:flex;align-items:baseline;gap:7px}",
      ".wbsal-date b{font-weight:600;font-variant-numeric:tabular-nums}",
      ".wbsal-date span{font-size:11.5px;color:var(--wb-muted,#8b94a6)}",
      ".wbsal-net{font-weight:680;font-size:13px;color:var(--wb-text,inherit)}",
      ".wbsal-opt{color:var(--wb-muted,#8b94a6)}",
      ".wbsal-caret{display:inline-block;width:14px;color:var(--wb-muted,#8b94a6);transition:transform .15s}",
      ".wbsal-record-row.open .wbsal-caret{transform:rotate(90deg)}",
      ".wbsal-detail-cell{padding:0 14px 16px !important;background:color-mix(in srgb,var(--wb-accent,#2563eb) 4%,transparent)}",
      ".wbsal-detail{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px 24px}",
      ".wbsal-detail-block{display:flex;flex-direction:column;gap:6px;min-width:0}",
      ".wbsal-group-title{font-size:11px;font-weight:600;letter-spacing:.04em;color:var(--wb-muted,#8b94a6);text-transform:uppercase}",
      ".wbsal-fields{display:flex;flex-direction:column;gap:5px;font-size:12px}",
      ".wbsal-fields div{display:flex;align-items:baseline;justify-content:space-between;gap:10px;padding-bottom:4px;border-bottom:1px dashed var(--wb-line,#eef0f4)}",
      ".wbsal-fields div:last-child{border-bottom:0}",
      ".wbsal-fields span{color:var(--wb-muted,#8b94a6)}",
      ".wbsal-fields b{font-weight:600;font-variant-numeric:tabular-nums}",
      ".wbsal-field-sum b{font-size:13.5px}",
      ".wbsal-detail-foot{grid-column:1/-1;display:flex;align-items:center;gap:10px;flex-wrap:wrap;justify-content:space-between;border-top:1px solid var(--wb-line,#eef0f4);padding-top:10px}",
      ".wbsal-detail-actions{display:flex;align-items:center;gap:8px;flex-wrap:wrap}",
      ".wbsal-confirm{display:inline-flex;align-items:center;gap:8px;padding:3px 8px 3px 10px;border-radius:999px;background:color-mix(in srgb,var(--wb-danger,#b91c1c) 10%,transparent)}",
      /* 表单 */
      ".wbsal-form{display:flex;flex-direction:column;gap:16px}",
      ".wbsal-mask{position:fixed;inset:0;z-index:60;display:flex;align-items:flex-start;justify-content:center;padding:38px 18px;overflow:auto;background:transparent;backdrop-filter:brightness(.62) blur(3px);-webkit-backdrop-filter:brightness(.62) blur(3px)}",
      "@supports not ((backdrop-filter:blur(1px)) or (-webkit-backdrop-filter:blur(1px))){.wbsal-mask{background:color-mix(in oklab,currentColor 34%,transparent)}}",
      ".wbsal-modal{width:min(960px,100%);margin:auto 0;animation:wbsal-pop .16s ease-out}",
      "@keyframes wbsal-pop{from{opacity:0;transform:translateY(10px) scale(.99)}to{opacity:1;transform:none}}",
      ".wbsal-form-modal{margin-top:0;max-height:calc(100vh - 76px);overflow:auto;box-shadow:0 24px 64px color-mix(in oklab,currentColor 22%,transparent)}",
      ".wbsal-form-modal .wbsal-form-head{position:sticky;top:-14px;z-index:1;margin:-14px -16px 0;padding:14px 16px;background:var(--wb-card,#fff);border-bottom:1px solid var(--wb-line,#eef0f4)}",
      ".wbsal-form-head{display:flex;align-items:center;justify-content:space-between;gap:10px}",
      ".wbsal-form-head h3{font-size:14px;font-weight:650;margin:0}",
      ".wbsal-form-meta{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px}",
      ".wbsal-form-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px 12px}",
      ".wbsal-form-group{display:flex;flex-direction:column;gap:8px;padding-top:12px;border-top:1px solid var(--wb-line,#eef0f4)}",
      ".wbsal-form-group:first-of-type{border-top:0;padding-top:0}",
      ".wbsal-group-head{display:flex;align-items:baseline;justify-content:space-between;gap:10px}",
      ".wbsal-group-head span{font-size:11px;color:var(--wb-muted,#8b94a6)}",
      ".wbsal-summary{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:12px;padding:14px;border:1px solid var(--wb-border,#e2e6ec);border-radius:12px;background:color-mix(in srgb,var(--wb-accent,#2563eb) 5%,transparent)}",
      ".wbsal-summary div span{display:block;font-size:11px;color:var(--wb-muted,#8b94a6);margin-bottom:3px}",
      ".wbsal-summary div b{font-size:15px;font-variant-numeric:tabular-nums;font-weight:650}",
      ".wbsal-summary .wbsal-lock{grid-column:1/-1;display:flex;align-items:center;gap:8px;flex-wrap:wrap}",
      ".wbsal-form-actions{display:flex;align-items:center;gap:10px;flex-wrap:wrap}",
      /* 统计 */
      ".wbsal-seg{display:inline-flex;align-items:center;gap:6px;padding:4px;border:1px solid var(--wb-border,#e2e6ec);border-radius:10px;background:var(--wb-surface,#fff)}",
      ".wbsal-seg .wbsal-btn{border-color:transparent;background:transparent}",
      ".wbsal-seg .wbsal-btn.primary{background:var(--wb-accent,#2563eb);color:#fff}",
      ".wbsal-seg-year{font-size:13px;font-weight:650;font-variant-numeric:tabular-nums;min-width:64px;text-align:center}",
      ".wbsal-section{display:flex;flex-direction:column;gap:12px}",
      ".wbsal-section-head{display:flex;align-items:baseline;justify-content:space-between;gap:10px}",
      ".wbsal-section-head h3{font-size:13.5px;font-weight:650;margin:0}",
      ".wbsal-section-head span{font-size:11.5px;color:var(--wb-muted,#8b94a6)}",
      ".wbsal-section-tools{display:flex;align-items:center;gap:12px;flex-wrap:wrap}",
      // 图表口径切换：与任务插件统计页一致的分段式小控件，选中态用 aria-pressed 表达。
      ".wbsal-metric{display:inline-flex;align-items:center;gap:2px;padding:2px;border:1px solid var(--wb-border,#e2e6ec);border-radius:8px;background:var(--wb-surface,#fff)}",
      ".wbsal-metric button{appearance:none;border:0;background:transparent;color:var(--wb-muted,#8b94a6);font:inherit;font-size:11.5px;padding:4px 8px;border-radius:6px;cursor:pointer;white-space:nowrap}",
      ".wbsal-metric button:hover{background:color-mix(in srgb,var(--wb-muted) 12%,transparent);color:var(--wb-text,#20242c)}",
      ".wbsal-metric button.on,.wbsal-metric button[aria-pressed=true]{background:var(--wb-accent,#2563eb);color:var(--wb-on-accent,#fff);font-weight:600}",
      ".wbsal-metric button:focus-visible{outline:2px solid var(--wb-accent,#2563eb);outline-offset:1px}",
      ".wbsal-chart{display:flex;align-items:flex-end;gap:8px;height:210px;padding:8px 2px 0;border-bottom:1px solid var(--wb-line,#eef0f4)}",
      ".wbsal-bar{flex:1 1 0;min-width:14px;display:flex;flex-direction:column;justify-content:flex-end;align-items:center;gap:5px;height:100%}",
      ".wbsal-bar-value{font-size:10.5px;line-height:1;color:var(--wb-muted,#8b94a6);font-variant-numeric:tabular-nums;white-space:nowrap}",
      ".wbsal-bar-fill{width:72%;max-width:42px;border-radius:6px 6px 2px 2px;background:color-mix(in srgb,var(--wb-accent,#2563eb) 38%,transparent);transition:background .12s}",
      ".wbsal-bar-fill.top{background:var(--wb-accent,#2563eb)}",
      ".wbsal-bar:hover .wbsal-bar-fill{background:color-mix(in srgb,var(--wb-accent,#2563eb) 70%,transparent)}",
      ".wbsal-axis{display:flex;gap:8px;padding-top:7px}",
      ".wbsal-axis span{flex:1 1 0;text-align:center;font-size:10.5px;color:var(--wb-muted,#8b94a6);font-variant-numeric:tabular-nums}",
      ".wbsal-chart-foot{display:flex;align-items:center;justify-content:space-between;gap:10px;font-size:11.5px;color:var(--wb-muted,#8b94a6)}",
      ".wbsal-legend{display:inline-flex;align-items:center;gap:6px}",
      ".wbsal-legend i{width:8px;height:8px;border-radius:2px;background:var(--wb-accent,#2563eb);display:inline-block}",
      ".wbsal-legend i.soft{background:color-mix(in srgb,var(--wb-accent,#2563eb) 38%,transparent)}",
      ".wbsal-series{display:flex;align-items:center;gap:6px;flex-wrap:wrap}",
      ".wbsal-series button{display:inline-flex;align-items:center;gap:6px;padding:5px 10px;border:1px solid var(--wb-border,#e2e6ee);border-radius:999px;background:var(--wb-surface,#fff);color:var(--wb-fg,inherit);font-size:12px;line-height:1;cursor:pointer;transition:opacity .12s,border-color .12s,background .12s}",
      ".wbsal-series button:hover{border-color:color-mix(in srgb,var(--wb-accent,#2563eb) 45%,var(--wb-border,#e2e6ee))}",
      ".wbsal-series button.off{opacity:.45;color:var(--wb-muted,#8b94a6)}",
      ".wbsal-series button.off i{filter:grayscale(1)}",
      ".wbsal-series i{width:14px;height:3px;border-radius:2px;display:inline-block;background:var(--wb-muted,#8b94a6)}",
      ".wbsal-series i.s1,.wbsal-line-dot.s1{background:var(--wb-accent,#2563eb)}",
      ".wbsal-series i.s2,.wbsal-line-dot.s2{background:var(--wb-ok,#16a34a)}",
      ".wbsal-series i.s3,.wbsal-line-dot.s3{background:var(--wb-warn,#d97706)}",
      ".wbsal-series i.s4,.wbsal-line-dot.s4{background:color-mix(in oklab,var(--wb-accent,#2563eb) 45%,var(--wb-danger,#dc2626))}",
      ".wbsal-series i.s5,.wbsal-line-dot.s5{background:color-mix(in oklab,var(--wb-ok,#16a34a) 55%,var(--wb-accent,#2563eb))}",
      ".wbsal-series i.s6,.wbsal-line-dot.s6{background:color-mix(in oklab,var(--wb-warn,#d97706) 60%,var(--wb-danger,#dc2626))}",
      ".wbsal-series i.sum,.wbsal-line-dot.sum{background:color-mix(in oklab,var(--wb-muted,#8b94a6) 45%,var(--wb-accent,#2563eb))}",
      ".wbsal-line.sum{stroke:color-mix(in oklab,var(--wb-muted,#8b94a6) 45%,var(--wb-accent,#2563eb));stroke-dasharray:7 4}",
      ".wbsal-line-dot.sum{fill:color-mix(in oklab,var(--wb-muted,#8b94a6) 45%,var(--wb-accent,#2563eb))}",
      ".wbsal-linechart{width:100%;padding:10px 2px 0;position:relative}",
      ".wbsal-hit{fill:transparent;cursor:crosshair}",
      ".wbsal-hit-area{fill:transparent}",
      ".wbsal-crosshair{stroke:color-mix(in srgb,var(--wb-accent,#2563eb) 55%,transparent);stroke-width:1;stroke-dasharray:3 3;vector-effect:non-scaling-stroke}",
      ".wbsal-line-dot.is-hot{stroke:var(--wb-card,#fff);stroke-width:2}",
      ".wbsal-tip{position:absolute;top:6px;transform:translateX(-50%);z-index:3;pointer-events:none;min-width:170px;padding:9px 11px;border:1px solid var(--wb-border,#e2e6ee);border-radius:10px;background:var(--wb-card,#fff);box-shadow:0 8px 22px rgba(15,23,42,.16)}",
      ".wbsal-tip.is-right{transform:translateX(-100%)}",
      ".wbsal-tip strong{display:block;font-size:12px;color:var(--wb-muted,#8b94a6);font-weight:600;margin-bottom:6px}",
      ".wbsal-tip-row{display:flex;align-items:center;gap:7px;font-size:12px;line-height:1.7}",
      ".wbsal-tip-row i{width:14px;height:3px;border-radius:2px;background:var(--wb-muted,#8b94a6);flex:0 0 auto}",
      ".wbsal-tip-row span{color:var(--wb-muted,#8b94a6)}",
      ".wbsal-tip-row b{margin-left:auto;font-variant-numeric:tabular-nums;font-weight:650}",
      ".wbsal-tip-row i.s1{background:var(--wb-accent,#2563eb)}",
      ".wbsal-tip-row i.s2{background:var(--wb-ok,#16a34a)}",
      ".wbsal-tip-row i.s3{background:var(--wb-warn,#d97706)}",
      ".wbsal-tip-row i.s4{background:color-mix(in oklab,var(--wb-accent,#2563eb) 45%,var(--wb-danger,#dc2626))}",
      ".wbsal-tip-row i.s5{background:color-mix(in oklab,var(--wb-ok,#16a34a) 55%,var(--wb-accent,#2563eb))}",
      ".wbsal-tip-row i.s6{background:color-mix(in oklab,var(--wb-warn,#d97706) 60%,var(--wb-danger,#dc2626))}",
      ".wbsal-tip-row i.sum{background:color-mix(in oklab,var(--wb-muted,#8b94a6) 45%,var(--wb-accent,#2563eb))}",
      ".wbsal-tip em{display:block;margin-top:5px;font-size:11px;font-style:normal;color:var(--wb-muted,#8b94a6)}",
      ".wbsal-chart-hint{margin-top:8px;padding:10px 12px;border-radius:8px;background:color-mix(in srgb,var(--wb-muted,#8b94a6) 10%,transparent);color:var(--wb-muted,#8b94a6);font-size:12px}",
      ".wbsal-social-foot{display:flex;align-items:center;justify-content:flex-end;gap:10px;margin-top:14px;flex-wrap:wrap}",
      ".wbsal-linechart svg{display:block;width:100%;height:auto;overflow:visible}",
      ".wbsal-linechart text{fill:var(--wb-muted,#8b94a6);font-size:11px;font-variant-numeric:tabular-nums}",
      ".wbsal-line-gridline{stroke:var(--wb-line,#eef0f4);stroke-width:1;vector-effect:non-scaling-stroke}",
      ".wbsal-line{fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;vector-effect:non-scaling-stroke}",
      ".wbsal-line.s1{stroke:var(--wb-accent,#2563eb)}",
      ".wbsal-line.s2{stroke:var(--wb-ok,#16a34a)}",
      ".wbsal-line.s3{stroke:var(--wb-warn,#d97706)}",
      ".wbsal-line.s4{stroke:color-mix(in oklab,var(--wb-accent,#2563eb) 45%,var(--wb-danger,#dc2626))}",
      ".wbsal-line.s5{stroke:color-mix(in oklab,var(--wb-ok,#16a34a) 55%,var(--wb-accent,#2563eb))}",
      ".wbsal-line.s6{stroke:color-mix(in oklab,var(--wb-warn,#d97706) 60%,var(--wb-danger,#dc2626))}",
      ".wbsal-line-dot{stroke:none}",
      ".wbsal-line-dot.s1{fill:var(--wb-accent,#2563eb)}",
      ".wbsal-line-dot.s2{fill:var(--wb-ok,#16a34a)}",
      ".wbsal-line-dot.s3{fill:var(--wb-warn,#d97706)}",
      ".wbsal-line-dot.s4{fill:color-mix(in oklab,var(--wb-accent,#2563eb) 45%,var(--wb-danger,#dc2626))}",
      ".wbsal-line-dot.s5{fill:color-mix(in oklab,var(--wb-ok,#16a34a) 55%,var(--wb-accent,#2563eb))}",
      ".wbsal-line-dot.s6{fill:color-mix(in oklab,var(--wb-warn,#d97706) 60%,var(--wb-danger,#dc2626))}",
      ".wbsal-comp{display:flex;flex-direction:column;gap:7px}",
      ".wbsal-comp-row{display:grid;grid-template-columns:92px minmax(60px,1fr) 132px;gap:10px;align-items:center;font-size:12px}",
      ".wbsal-comp-row span:first-child{color:var(--wb-text,inherit)}",
      ".wbsal-comp-track{height:7px;border-radius:999px;background:var(--wb-line,#eef0f4);overflow:hidden}",
      ".wbsal-comp-fill{height:100%;border-radius:999px;background:var(--wb-accent,#2563eb)}",
      ".wbsal-comp-fill.deduction{background:var(--wb-warn,#b45309)}",
      ".wbsal-comp-value{text-align:right;font-variant-numeric:tabular-nums;color:var(--wb-muted,#8b94a6)}",
      ".wbsal-comp-value b{color:var(--wb-text,inherit);font-weight:600}",
      ".wbsal-comp-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:20px}",
      ".wbsal-table th.num,.wbsal-table td.num{text-align:right}",
      ".wbsal-table tbody tr:hover td{background:color-mix(in srgb,var(--wb-accent,#2563eb) 4%,transparent)}",
      /* 空态 */
      ".wbsal-empty{display:flex;flex-direction:column;align-items:center;gap:10px;padding:44px 16px;border:1px dashed var(--wb-border,#e2e6ec);border-radius:12px;color:var(--wb-muted,#8b94a6);font-size:12.5px;text-align:center}",
      ".wbsal-empty-actions{display:flex;gap:8px;justify-content:center;margin-top:2px}",
      ".wbsal-inline-actions{display:flex;gap:8px;align-items:center;flex-wrap:wrap}",
      /* 五险一金 */
      ".wbsal-social{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px 14px}",
      ".wbsal-social-item{border:1px solid var(--wb-line,#eef0f4);border-radius:10px;padding:10px 12px;display:flex;flex-direction:column;gap:3px;background:color-mix(in srgb,var(--wb-muted,#8b94a6) 5%,transparent)}",
      ".wbsal-social-item span{font-size:11px;color:var(--wb-muted,#8b94a6)}",
      ".wbsal-social-item b{font-size:15px;font-weight:650;font-variant-numeric:tabular-nums}",
      ".wbsal-social-item em{font-size:11px;font-style:normal;color:var(--wb-muted,#8b94a6)}",
      /* 共享组件在深色主题下的覆盖：base 里 notice/pill/json 写死了浅色，这里改成 token */
      ".wbsal-notice{padding:9px 11px;border-radius:9px;font-size:12px;background:color-mix(in srgb,var(--wb-accent,#2563eb) 10%,transparent);color:var(--wb-text,inherit);border:1px solid color-mix(in srgb,var(--wb-accent,#2563eb) 18%,transparent)}",
      ".wbsal-notice.ok{background:color-mix(in srgb,var(--wb-ok,#15803d) 12%,transparent);color:var(--wb-ok,#15803d);border-color:color-mix(in srgb,var(--wb-ok,#15803d) 22%,transparent)}",
      ".wbsal-notice.error{background:color-mix(in srgb,var(--wb-danger,#b91c1c) 12%,transparent);color:var(--wb-danger,#b91c1c);border-color:color-mix(in srgb,var(--wb-danger,#b91c1c) 22%,transparent)}",
      ".wbsal-pill{display:inline-flex;align-items:center;padding:1px 7px;border-radius:999px;font-size:11px;font-weight:600;line-height:1.7;background:color-mix(in srgb,var(--wb-muted,#8b94a6) 14%,transparent);color:var(--wb-muted,#8b94a6)}",
      ".wbsal-pill.ok{background:color-mix(in srgb,var(--wb-ok,#15803d) 13%,transparent);color:var(--wb-ok,#15803d)}",
      ".wbsal-pill.warn{background:color-mix(in srgb,var(--wb-warn,#b45309) 15%,transparent);color:var(--wb-warn,#b45309)}",
      ".wbsal-pill.error{background:color-mix(in srgb,var(--wb-danger,#b91c1c) 13%,transparent);color:var(--wb-danger,#b91c1c)}",
      ".wbsal-json{margin:0;padding:10px;border-radius:9px;background:color-mix(in srgb,var(--wb-muted,#8b94a6) 8%,transparent);font-size:11.5px;line-height:1.6;max-height:240px;overflow:auto;color:var(--wb-text,inherit)}",
      /* 说明页 */
      ".wbsal-card h3{margin:0 0 10px;font-size:14px;font-weight:600;letter-spacing:-0.01em}",
      ".wbsal-page > .wbsal-card + .wbsal-card{margin-top:14px}",
      ".wbsal-row{display:flex;flex-wrap:wrap;gap:12px;align-items:flex-end}",
      /* 响应式 */
      "@media (max-width:1100px){.wbsal-detail{grid-template-columns:repeat(2,minmax(0,1fr))}}",
      "@media (max-width:900px){.wbsal-table th.hide-md,.wbsal-table td.hide-md{display:none}}",
      "@media (max-width:760px){.wbsal-detail{grid-template-columns:minmax(0,1fr)}.wbsal-page{padding:16px 14px 36px}.wbsal-table th,.wbsal-table td{padding:9px 10px}.wbsal-opt,.wbsal-table th.opt{display:none}.wbsal-comp-row{grid-template-columns:80px minmax(50px,1fr) 112px}.wbsal-chart{height:170px}}"
    ];
    var DATE = require_date_picker_styles()("wbsal");
    module2.exports = BASE.concat(PAGE, [DATE]).join("\n");
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/shared/src/utils/toKebabCase.mjs
var toKebabCase;
var init_toKebabCase = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/shared/src/utils/toKebabCase.mjs"() {
    toKebabCase = (string) => string?.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/shared/src/utils/toLucideIconData.mjs
function toLucideIconData(iconName, iconNode, aliases = []) {
  if (iconNode == null) {
    throw new Error("[lucide]: iconNode is required when icon name is used");
  }
  return {
    name: toKebabCase(iconName),
    size: 24,
    node: iconNode,
    ...aliases.length > 0 ? { aliases } : {}
  };
}
var init_toLucideIconData = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/shared/src/utils/toLucideIconData.mjs"() {
    init_toKebabCase();
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/shared/src/utils/toCamelCase.mjs
var toCamelCase;
var init_toCamelCase = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/shared/src/utils/toCamelCase.mjs"() {
    toCamelCase = (string) => {
      let out = "";
      let upperNext = false;
      for (const ch of string) {
        if (ch === "-" || ch === "_" || ch <= " ") {
          upperNext = out.length > 0;
          continue;
        }
        if (out.length === 0) {
          out += ch.toLowerCase();
        } else {
          out += upperNext ? ch.toUpperCase() : ch;
        }
        upperNext = false;
      }
      return out;
    };
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/shared/src/utils/toPascalCase.mjs
var toPascalCase;
var init_toPascalCase = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/shared/src/utils/toPascalCase.mjs"() {
    init_toCamelCase();
    toPascalCase = (string) => {
      const camelCase = toCamelCase(string);
      return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
    };
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/shared/src/utils/mergeClasses.mjs
var mergeClasses;
var init_mergeClasses = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/shared/src/utils/mergeClasses.mjs"() {
    mergeClasses = (...classes) => classes.filter((className, index, array) => {
      return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
    }).join(" ").trim();
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/shared/src/build/defaultAttributes.mjs
var defaultAttributes;
var init_defaultAttributes = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/shared/src/build/defaultAttributes.mjs"() {
    defaultAttributes = {
      xmlns: "http://www.w3.org/2000/svg",
      width: 24,
      height: 24,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": 2,
      "stroke-linecap": "round",
      "stroke-linejoin": "round"
    };
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/shared/src/build/buildLucideIconNode.mjs
function isDefined(value) {
  return value !== null && value !== void 0;
}
function buildLucideIconNode(icon, params = {}) {
  const attributeNames = params.attributeNames ?? {};
  const getAttributeName = (attributeName) => attributeNames[attributeName] ?? attributeName;
  const viewBoxWidth = icon.size ?? icon.width ?? defaultAttributes["width"];
  const viewBoxHeight = icon.size ?? icon.height ?? defaultAttributes["height"];
  const aliasClassNames = icon.aliases?.filter((alias) => typeof alias === "string" && alias.trim() !== "").map((alias) => `lucide-${alias}`) ?? [];
  const iconClassNames = [...icon.name ? [`lucide-${icon.name}`] : [], ...aliasClassNames];
  const classNamesFromClassName = params.className?.split(" ").filter(Boolean) ?? [];
  const className = params.includeDefaultClasses === false ? mergeClasses(...classNamesFromClassName) : mergeClasses("lucide", ...iconClassNames, ...classNamesFromClassName);
  const calculatedStrokeWidth = params.absoluteStrokeWidth ? Number(params.strokeWidth ?? defaultAttributes["stroke-width"]) * Number(icon.size ?? icon.width ?? defaultAttributes["width"]) / Number(params.size ?? params.width ?? defaultAttributes["width"]) : params.strokeWidth ?? defaultAttributes["stroke-width"];
  const attributes = {
    ...Object.entries(defaultAttributes).reduce((attrs, [attrName, value]) => {
      attrs[getAttributeName(attrName)] = value;
      return attrs;
    }, {}),
    ..."color" in params && params.color && {
      [getAttributeName("stroke")]: params.color
    },
    ..."size" in params && isDefined(params.size) && {
      [getAttributeName("width")]: params.size,
      [getAttributeName("height")]: params.size
    },
    ..."width" in params && isDefined(params.width) && {
      [getAttributeName("width")]: params.width
    },
    ..."height" in params && isDefined(params.height) && {
      [getAttributeName("height")]: params.height
    },
    [getAttributeName("stroke-width")]: calculatedStrokeWidth,
    ...className && {
      [getAttributeName("class")]: className
    },
    [getAttributeName("viewBox")]: `0 0 ${viewBoxWidth} ${viewBoxHeight}`,
    ...params.hasA11yProp === false ? {
      [getAttributeName("aria-hidden")]: "true"
    } : {},
    ..."attributes" in params && params.attributes
  };
  return [
    "svg",
    attributes,
    icon.node.map((child) => {
      const [name, attrs, children] = child;
      const nextAttrs = params.nonScalingStroke ? { [getAttributeName("vector-effect")]: "non-scaling-stroke", ...attrs } : attrs;
      return children ? [name, nextAttrs, children] : [name, nextAttrs];
    })
  ];
}
var init_buildLucideIconNode = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/shared/src/build/buildLucideIconNode.mjs"() {
    init_defaultAttributes();
    init_mergeClasses();
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/shared/src/build/buildLucideIconForReact.mjs
function buildLucideIconForReact(icon, params = {}) {
  return buildLucideIconNode(icon, {
    ...params,
    attributeNames: {
      ...params.attributeNames,
      class: "className",
      "stroke-width": "strokeWidth",
      "stroke-linecap": "strokeLinecap",
      "stroke-linejoin": "strokeLinejoin",
      "vector-effect": "vectorEffect"
    }
  });
}
var init_buildLucideIconForReact = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/shared/src/build/buildLucideIconForReact.mjs"() {
    init_buildLucideIconNode();
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/shared/src/utils/hasA11yProp.mjs
var hasA11yProp;
var init_hasA11yProp = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/shared/src/utils/hasA11yProp.mjs"() {
    hasA11yProp = (props) => {
      for (const prop in props) {
        if (prop.startsWith("aria-") || prop === "role" || prop === "title") {
          return true;
        }
      }
      return false;
    };
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/context.mjs
var import_react, LucideContext, useLucideContext;
var init_context = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/context.mjs"() {
    "use strict";
    "use client";
    import_react = require("react");
    LucideContext = (0, import_react.createContext)({});
    useLucideContext = () => (0, import_react.useContext)(LucideContext);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/Icon.mjs
var import_react2, Icon;
var init_Icon = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/Icon.mjs"() {
    "use strict";
    "use client";
    import_react2 = require("react");
    init_mergeClasses();
    init_buildLucideIconForReact();
    init_hasA11yProp();
    init_context();
    Icon = (0, import_react2.forwardRef)(
      ({
        color,
        size,
        width,
        height,
        strokeWidth,
        absoluteStrokeWidth,
        nonScalingStroke,
        className = "",
        children,
        iconNode = [],
        icon = {
          node: iconNode,
          aliases: [],
          size: 24
        },
        ...rest
      }, ref) => {
        const {
          size: contextSize = 24,
          strokeWidth: contextStrokeWidth = 2,
          absoluteStrokeWidth: contextAbsoluteStrokeWidth = false,
          nonScalingStroke: contextNonScalingStroke = false,
          color: contextColor = "currentColor",
          className: contextClass = ""
        } = useLucideContext() ?? {};
        const hasAccessibleProp = Boolean(children) || hasA11yProp(rest);
        const [name, svgAttributes, builtIconNode = []] = buildLucideIconForReact(icon, {
          color: color ?? contextColor,
          width: width ?? size ?? contextSize,
          height: height ?? size ?? contextSize,
          strokeWidth: strokeWidth ?? contextStrokeWidth,
          absoluteStrokeWidth: absoluteStrokeWidth ?? contextAbsoluteStrokeWidth,
          nonScalingStroke: nonScalingStroke ?? contextNonScalingStroke,
          className: mergeClasses(contextClass, className),
          hasA11yProp: hasAccessibleProp,
          attributes: rest
        });
        return (0, import_react2.createElement)(
          name,
          {
            ref,
            ...svgAttributes
          },
          [
            ...builtIconNode.map(([tag, attrs]) => (0, import_react2.createElement)(tag, attrs)),
            ...Array.isArray(children) ? children : [children]
          ]
        );
      }
    );
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/createLucideIcon.mjs
function createLucideIcon(iconDataOrName, iconNode = [], aliases = []) {
  const iconData = typeof iconDataOrName === "string" ? toLucideIconData(iconDataOrName, iconNode, aliases) : iconDataOrName;
  const Component = (0, import_react3.forwardRef)(
    ({ className, ...props }, ref) => (0, import_react3.createElement)(Icon, {
      ref,
      icon: iconData,
      className,
      ...props
    })
  );
  if (iconData.name) {
    Component.displayName = toPascalCase(iconData.name);
  }
  return Component;
}
var import_react3;
var init_createLucideIcon = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/createLucideIcon.mjs"() {
    import_react3 = require("react");
    init_toLucideIconData();
    init_toPascalCase();
    init_Icon();
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/wallet.mjs
var wallet_exports = {};
__export(wallet_exports, {
  __iconData: () => __iconData,
  default: () => Wallet
});
var __iconData, Wallet;
var init_wallet = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/wallet.mjs"() {
    init_createLucideIcon();
    __iconData = {
      name: "wallet",
      size: 24,
      node: [
        [
          "path",
          {
            d: "M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1",
            key: "18etb6"
          }
        ],
        ["path", { d: "M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4", key: "xoc0q4" }]
      ]
    };
    __iconData.node;
    Wallet = createLucideIcon(__iconData);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/chart-column.mjs
var chart_column_exports = {};
__export(chart_column_exports, {
  __iconData: () => __iconData2,
  default: () => ChartColumn
});
var __iconData2, ChartColumn;
var init_chart_column = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/chart-column.mjs"() {
    init_createLucideIcon();
    __iconData2 = {
      name: "chart-column",
      size: 24,
      node: [
        ["path", { d: "M3 3v16a2 2 0 0 0 2 2h16", key: "c24i48" }],
        ["path", { d: "M18 17V9", key: "2bz60n" }],
        ["path", { d: "M13 17V5", key: "1frdt8" }],
        ["path", { d: "M8 17v-3", key: "17ska0" }]
      ],
      aliases: ["bar-chart-3"]
    };
    __iconData2.node;
    ChartColumn = createLucideIcon(__iconData2);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/database.mjs
var database_exports = {};
__export(database_exports, {
  __iconData: () => __iconData3,
  default: () => Database
});
var __iconData3, Database;
var init_database = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/database.mjs"() {
    init_createLucideIcon();
    __iconData3 = {
      name: "database",
      size: 24,
      node: [
        ["ellipse", { cx: "12", cy: "5", rx: "9", ry: "3", key: "msslwz" }],
        ["path", { d: "M3 5V19A9 3 0 0 0 21 19V5", key: "1wlel7" }],
        ["path", { d: "M3 12A9 3 0 0 0 21 12", key: "mv7ke4" }]
      ]
    };
    __iconData3.node;
    Database = createLucideIcon(__iconData3);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/list.mjs
var list_exports = {};
__export(list_exports, {
  __iconData: () => __iconData4,
  default: () => List
});
var __iconData4, List;
var init_list = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/list.mjs"() {
    init_createLucideIcon();
    __iconData4 = {
      name: "list",
      size: 24,
      node: [
        ["path", { d: "M3 5h.01", key: "18ugdj" }],
        ["path", { d: "M3 12h.01", key: "nlz23k" }],
        ["path", { d: "M3 19h.01", key: "noohij" }],
        ["path", { d: "M8 5h13", key: "1pao27" }],
        ["path", { d: "M8 12h13", key: "1za7za" }],
        ["path", { d: "M8 19h13", key: "m83p4d" }]
      ]
    };
    __iconData4.node;
    List = createLucideIcon(__iconData4);
  }
});

// packages/addons/lib/client-common.cjs
var require_client_common = __commonJS({
  "packages/addons/lib/client-common.cjs"(exports2, module2) {
    "use strict";
    module2.exports = function createCommon(prefix) {
      var p = String(prefix || "wb");
      function unwrap(r) {
        if (r && r.ok === false) {
          var error = new Error(r.error || r.message || "\u64CD\u4F5C\u5931\u8D25");
          if (r.code !== void 0) error.code = r.code;
          error.payload = r;
          throw error;
        }
        return r && r.result !== void 0 ? r.result : r;
      }
      function call(api, action, args) {
        return Promise.resolve(api.call(action, args || {})).then(unwrap);
      }
      function errText(e) {
        if (!e) return "\u64CD\u4F5C\u5931\u8D25";
        if (typeof e === "string") return e;
        return e.message || e.error || String(e);
      }
      function fmtTime(ts, lang) {
        if (!ts) return "\u2014";
        try {
          return new Date(ts).toLocaleString(lang === "en" ? "en-US" : "zh-CN", { hour12: false });
        } catch (e) {
          return String(ts);
        }
      }
      function Btn(props) {
        var h = props.h;
        return h(
          "button",
          {
            type: props.type || "button",
            className: p + "-btn" + (props.kind ? " " + props.kind : ""),
            disabled: props.disabled,
            onClick: props.onClick,
            title: props.title
          },
          props.children
        );
      }
      function Field(props) {
        var h = props.h;
        return h(
          "label",
          { className: p + "-field" },
          h("span", { className: p + "-label" }, props.label),
          props.children,
          props.hint ? h("span", { className: p + "-hint" }, props.hint) : null
        );
      }
      function Notice(props) {
        var h = props.h;
        if (!props.text) return null;
        return h("div", { className: p + "-notice " + (props.kind || "info") }, props.text);
      }
      function Empty(props) {
        var h = props.h;
        return h("div", { className: p + "-empty" }, props.text || "\u6682\u65E0\u6570\u636E");
      }
      function Pill(props) {
        var h = props.h;
        return h("span", { className: p + "-pill " + (props.kind || "") }, props.children);
      }
      function Json(props) {
        var h = props.h;
        var text;
        try {
          text = JSON.stringify(props.value, null, 2);
        } catch (e) {
          text = String(props.value);
        }
        return h("pre", { className: p + "-json" }, text);
      }
      function useLoad(React, api, action, args, deps) {
        var s = React.useState({ loading: true, data: null, error: "" });
        var tick = React.useState(0);
        var refresh = function() {
          tick[1](tick[0] + 1);
        };
        React.useEffect(
          function() {
            var alive = true;
            s[1]({ loading: true, data: null, error: "" });
            call(api, action, args).then(function(data) {
              if (alive) s[1]({ loading: false, data, error: "" });
            }).catch(function(e) {
              if (alive) s[1]({ loading: false, data: null, error: errText(e) });
            });
            return function() {
              alive = false;
            };
          },
          (deps || []).concat([tick[0]])
        );
        return { loading: s[0].loading, data: s[0].data, error: s[0].error, refresh };
      }
      return {
        unwrap,
        call,
        errText,
        fmtTime,
        Btn,
        Field,
        Notice,
        Empty,
        Pill,
        Json,
        useLoad
      };
    };
  }
});

// packages/addons/salary/client/ui/common.cjs
var require_common = __commonJS({
  "packages/addons/salary/client/ui/common.cjs"(exports2, module2) {
    "use strict";
    module2.exports = require_client_common()("wbsal");
  }
});

// packages/addons/salary/client/ui/fields.cjs
var require_fields = __commonJS({
  "packages/addons/salary/client/ui/fields.cjs"(exports2, module2) {
    "use strict";
    var GROUPS = [
      { id: "income", title: "\u6536\u5165\u9879", hint: "\u8BA1\u5165\u5E94\u53D1\u7A0E\u524D\u5DE5\u8D44", keys: ["basePay", "performancePay", "positionPay", "allowance", "performanceBonus", "otherPay", "holidayOvertime"] },
      { id: "pretax", title: "\u7A0E\u524D\u6263\u6B3E", hint: "\u5148\u4ECE\u6536\u5165\u4E2D\u6263\u9664", keys: ["sickDeduction", "personalDeduction", "otherDeduction"] },
      { id: "social", title: "\u793E\u4FDD\u4E0E\u4E2A\u7A0E", hint: "\u518D\u4ECE\u5E94\u53D1\u4E2D\u6263\u9664", keys: ["pension", "medical", "unemployment", "housingFund", "incomeTax", "postTaxDeduction"] }
    ];
    var LABELS = {
      basePay: "\u57FA\u672C\u5DE5\u8D44",
      performancePay: "\u7EE9\u6548\u5DE5\u8D44",
      positionPay: "\u5C97\u4F4D\u5DE5\u8D44",
      allowance: "\u8865\u8D34",
      performanceBonus: "\u7EE9\u6548\u5956\u60E9",
      otherPay: "\u5176\u4ED6\u6536\u5165",
      holidayOvertime: "\u6CD5\u5B9A\u5047\u671F\u52A0\u73ED\u5DE5\u8D44",
      sickDeduction: "\u75C5\u5047\u6263\u6B3E",
      personalDeduction: "\u4E8B\u5047\u6263\u6B3E",
      otherDeduction: "\u5176\u4ED6\u6263\u6B3E",
      grossPay: "\u5E94\u53D1\u7A0E\u524D\u5DE5\u8D44",
      pension: "\u517B\u8001",
      medical: "\u533B\u7597",
      unemployment: "\u5931\u4E1A",
      housingFund: "\u516C\u79EF\u91D1",
      incomeTax: "\u4E2A\u7A0E",
      postTaxDeduction: "\u7A0E\u540E\u6263\u9664",
      netPay: "\u5B9E\u53D1\u5DE5\u8D44"
    };
    var KEYS = ["basePay", "performancePay", "positionPay", "allowance", "performanceBonus", "otherPay", "holidayOvertime", "sickDeduction", "personalDeduction", "otherDeduction", "grossPay", "pension", "medical", "unemployment", "housingFund", "incomeTax", "postTaxDeduction", "netPay"];
    var INCOME_KEYS = GROUPS[0].keys;
    var PRETAX_KEYS = GROUPS[1].keys;
    var SOCIAL_KEYS = ["pension", "medical", "unemployment", "housingFund"];
    var TAX_KEYS = ["incomeTax", "postTaxDeduction"];
    function num(value) {
      var n = Number(String(value === void 0 || value === null ? "" : value).replace(/,/g, "").trim());
      return Number.isFinite(n) ? n : 0;
    }
    function fmtAmount(n) {
      return (Math.round((Number(n) || 0) * 100) / 100).toFixed(2);
    }
    function money(n) {
      if (n === null || n === void 0 || n === "" || !Number.isFinite(Number(n))) return "\u2014";
      return Number(n).toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    function sumValues(values, keys) {
      var total = 0;
      for (var i = 0; i < keys.length; i += 1) total += num(values[keys[i]]);
      return Math.round((total + Number.EPSILON) * 100) / 100;
    }
    function totals(values) {
      var income = sumValues(values, INCOME_KEYS);
      var preTax = sumValues(values, PRETAX_KEYS);
      var social = sumValues(values, SOCIAL_KEYS);
      var tax = sumValues(values, TAX_KEYS);
      var gross = Math.max(Math.round((income - preTax) * 100) / 100, 0);
      var net = Math.max(Math.round((gross - social - tax) * 100) / 100, 0);
      return { income, preTax, social, tax, gross, net };
    }
    function blankValues() {
      var values = {};
      for (var i = 0; i < KEYS.length; i += 1) values[KEYS[i]] = "";
      return values;
    }
    var WEEKDAYS = ["\u5468\u65E5", "\u5468\u4E00", "\u5468\u4E8C", "\u5468\u4E09", "\u5468\u56DB", "\u5468\u4E94", "\u5468\u516D"];
    function weekday(dateStr) {
      var parts = String(dateStr || "").split("-").map(Number);
      if (parts.length !== 3 || !parts[0]) return "";
      return WEEKDAYS[new Date(Date.UTC(parts[0], parts[1] - 1, parts[2])).getUTCDay()] || "";
    }
    function monthLabel(period) {
      var parts = String(period || "").split("-");
      return parts.length === 2 ? parts[0] + "\u5E74" + Number(parts[1]) + "\u6708" : period;
    }
    function incomePeriod(payDate) {
      var parts = String(payDate || "").split("-").map(Number);
      if (parts.length !== 3 || !parts[0] || !parts[1]) return "";
      var year = parts[0];
      var month = parts[1] - 1;
      if (month === 0) {
        month = 12;
        year -= 1;
      }
      return year + "-" + String(month).padStart(2, "0");
    }
    function incomeLabel(payDate) {
      return monthLabel(incomePeriod(payDate));
    }
    function defaultNote(payDate, cycle) {
      if (!payDate || cycle === "daily") return "";
      var label = incomeLabel(payDate);
      return label ? label + "\u5DE5\u8D44" : "";
    }
    module2.exports = {
      GROUPS,
      KEYS,
      LABELS,
      INCOME_KEYS,
      PRETAX_KEYS,
      SOCIAL_KEYS,
      TAX_KEYS,
      num,
      money,
      fmtAmount,
      sumValues,
      totals,
      blankValues,
      weekday,
      monthLabel,
      incomePeriod,
      incomeLabel,
      defaultNote
    };
  }
});

// packages/addons/salary/client/views/stats.cjs
var require_stats = __commonJS({
  "packages/addons/salary/client/views/stats.cjs"(exports2, module2) {
    "use strict";
    module2.exports = function Stats(props) {
      var h = props.h, React = props.React, api = props.api;
      var C = require_common();
      var F = require_fields();
      var yearState = React.useState((/* @__PURE__ */ new Date()).getFullYear());
      var year = yearState[0], setYear = yearState[1];
      var load = C.useLoad(React, api, "salary.stats", { year }, [year]);
      var data = load.data;
      var METRICS = [
        { key: "netPay", label: "\u5B9E\u53D1" },
        { key: "basePay", label: "\u57FA\u672C" },
        { key: "performancePay", label: "\u7EE9\u6548" },
        { key: "allowance", label: "\u8865\u8D34" },
        { key: "performanceBonus", label: "\u7EE9\u6548\u5956\u60E9" },
        { key: "grossPay", label: "\u5E94\u53D1" }
      ];
      var metricState = React.useState(props.initialMetric || "netPay");
      var metric = metricState[0], setMetric = metricState[1];
      var metricLabel = "\u5B9E\u53D1";
      METRICS.forEach(function(m) {
        if (m.key === metric) metricLabel = m.label;
      });
      var monthly = data && data.monthly || [];
      function metricValue(bucket) {
        return Number(bucket[metric]) || 0;
      }
      var maxNet = 1;
      monthly.forEach(function(bucket) {
        if (metricValue(bucket) > maxNet) maxNet = metricValue(bucket);
      });
      var topMonth = -1;
      monthly.forEach(function(bucket, i) {
        if (metricValue(bucket) > 0 && (topMonth < 0 || metricValue(bucket) > metricValue(monthly[topMonth]))) topMonth = i;
      });
      var LINE_SERIES = [
        { key: "netPay", label: "\u5B9E\u53D1", tone: "s1" },
        { key: "grossPay", label: "\u5E94\u53D1", tone: "s2" },
        { key: "basePay", label: "\u57FA\u672C", tone: "s3" },
        { key: "performancePay", label: "\u7EE9\u6548", tone: "s4" },
        { key: "allowance", label: "\u8865\u8D34", tone: "s5" },
        { key: "performanceBonus", label: "\u7EE9\u6548\u5956\u60E9", tone: "s6" }
      ];
      var visibleState = React.useState(Object.assign({ netPay: true, grossPay: true, basePay: true, performancePay: true, allowance: true, performanceBonus: true }, props.initialVisible || {}));
      var visible = visibleState[0];
      function toggleSeries(key) {
        var next = {};
        LINE_SERIES.forEach(function(m) {
          next[m.key] = !!visible[m.key];
        });
        next[key] = !next[key];
        visibleState[1](next);
      }
      function round2(value) {
        return Math.round((Number(value) || 0) * 100) / 100;
      }
      function deductOf(bucket) {
        return round2((Number(bucket.pension) || 0) + (Number(bucket.medical) || 0) + (Number(bucket.unemployment) || 0) + (Number(bucket.housingFund) || 0) + (Number(bucket.incomeTax) || 0));
      }
      function seriesValue(m, bucket) {
        if (typeof m.get === "function") return m.get(bucket);
        return Number(bucket[m.key]) || 0;
      }
      var DEDUCT_TOTAL_ALL = round2((data && data.socialTotal) + (data && data.incomeTaxTotal));
      var DEDUCT_SERIES = F.SOCIAL_KEYS.map(function(key, index) {
        return { key, label: F.LABELS[key], tone: "s" + (index + 1) };
      }).concat([
        { key: "incomeTax", label: "\u4E2A\u7A0E", tone: "s5" },
        { key: "deductTotal", label: "\u5408\u8BA1", tone: "sum", get: deductOf }
      ]);
      var socialVisibleState = React.useState(Object.assign({ pension: true, medical: true, unemployment: true, housingFund: true, incomeTax: true, deductTotal: true }, props.initialSocialVisible || {}));
      var socialVisible = socialVisibleState[0];
      function toggleSocial(key) {
        var next = {};
        DEDUCT_SERIES.forEach(function(m) {
          next[m.key] = !!socialVisible[m.key];
        });
        next[key] = !next[key];
        socialVisibleState[1](next);
      }
      var hoverState = React.useState(props.initialHover || null);
      var hover = hoverState[0], setHover = hoverState[1];
      var socialHoverState = React.useState(props.initialSocialHover || null);
      var socialHover = socialHoverState[0], setSocialHover = socialHoverState[1];
      var recordedMonths = monthly.filter(function(bucket) {
        return bucket.records > 0;
      });
      var LPAD = { l: 62, r: 16, t: 14, b: 30 };
      var LW = 1e3, LH = 250;
      var plotW = LW - LPAD.l - LPAD.r;
      var plotH = LH - LPAD.t - LPAD.b;
      function plotX(month) {
        return LPAD.l + (month - 1) / 11 * plotW;
      }
      function gridLabel(value) {
        if (value >= 100 || value === 0) return Math.round(value).toLocaleString("zh-CN");
        return Number(value.toFixed(1)).toLocaleString("zh-CN");
      }
      function niceStep(raw) {
        if (!(raw > 0)) return 1;
        var exp = Math.pow(10, Math.floor(Math.log(raw) / Math.LN10));
        var norm = raw / exp;
        var mult = norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 2.5 ? 2.5 : norm <= 5 ? 5 : 10;
        return mult * exp;
      }
      function renderChart(series, shown, ariaLabel, activeMonth, onHover) {
        var max = 0;
        recordedMonths.forEach(function(bucket) {
          series.forEach(function(m) {
            if (!shown[m.key]) return;
            var v = seriesValue(m, bucket);
            if (v > max) max = v;
          });
        });
        var step = niceStep(Math.max(max, 1) / 5);
        var axisMax = step * 5;
        function plotY(value) {
          return LPAD.t + plotH * (1 - Math.min(1, (Number(value) || 0) / axisMax));
        }
        var children = [];
        if (onHover) {
          var slot = plotW / 12;
          children.push(h("rect", {
            key: "hit-area",
            x: LPAD.l - slot / 2,
            y: LPAD.t,
            width: plotW + slot,
            height: plotH,
            className: "wbsal-hit-area",
            onMouseLeave: function() {
              onHover(null);
            }
          }));
          recordedMonths.forEach(function(bucket) {
            children.push(h("rect", {
              key: "hit" + bucket.month,
              x: plotX(bucket.month) - slot / 2,
              y: LPAD.t,
              width: slot,
              height: plotH,
              className: "wbsal-hit",
              onMouseEnter: function() {
                onHover(bucket.month);
              }
            }));
          });
        }
        [1, 0.8, 0.6, 0.4, 0.2, 0].forEach(function(ratio) {
          var value = axisMax * ratio;
          var y = plotY(value);
          children.push(h("line", { key: "g" + ratio, x1: LPAD.l, y1: y, x2: LW - LPAD.r, y2: y, className: "wbsal-line-gridline" }));
          children.push(h("text", { key: "gt" + ratio, x: LPAD.l - 10, y: y + 4, textAnchor: "end" }, gridLabel(value)));
        });
        monthly.forEach(function(bucket) {
          children.push(h("text", { key: "x" + bucket.month, x: plotX(bucket.month), y: LH - 10, textAnchor: "middle" }, bucket.month));
        });
        if (activeMonth) {
          children.push(h("line", {
            key: "crosshair",
            x1: plotX(activeMonth),
            y1: LPAD.t,
            x2: plotX(activeMonth),
            y2: LPAD.t + plotH,
            className: "wbsal-crosshair"
          }));
        }
        series.forEach(function(m) {
          if (!shown[m.key] || recordedMonths.length === 0) return;
          var points = recordedMonths.map(function(bucket) {
            return { month: bucket.month, value: seriesValue(m, bucket) };
          });
          if (points.length > 1) {
            children.push(h("polyline", {
              key: "line" + m.key,
              className: "wbsal-line " + m.tone,
              points: points.map(function(pt) {
                return plotX(pt.month) + "," + plotY(pt.value);
              }).join(" ")
            }));
          }
          points.forEach(function(pt) {
            children.push(h("circle", {
              key: "dot" + m.key + pt.month,
              className: "wbsal-line-dot " + m.tone + (pt.month === activeMonth ? " is-hot" : ""),
              cx: plotX(pt.month),
              cy: plotY(pt.value),
              r: pt.month === activeMonth ? 5 : 3.6
            }, h("title", null, pt.month + " \u6708 \xB7 " + m.label + " " + F.money(pt.value))));
          });
        });
        return h("svg", { viewBox: "0 0 " + LW + " " + LH, role: "img", "aria-label": ariaLabel }, children);
      }
      function seriesSwitch(series, shown, onToggle, ariaLabel) {
        return h("div", { className: "wbsal-series", role: "group", "aria-label": ariaLabel }, series.map(function(m) {
          return h("button", {
            key: m.key,
            type: "button",
            className: shown[m.key] ? "on" : "off",
            "aria-pressed": !!shown[m.key],
            title: (shown[m.key] ? "\u9690\u85CF" : "\u663E\u793A") + m.label,
            onClick: function() {
              onToggle(m.key);
            }
          }, h("i", { className: m.tone }), m.label);
        }));
      }
      function anyShown(series, shown) {
        return series.some(function(m) {
          return shown[m.key];
        });
      }
      function renderTip(series, shown, month) {
        if (!month) return null;
        var bucket = null;
        monthly.forEach(function(b) {
          if (b.month === month) bucket = b;
        });
        if (!bucket) return null;
        var kids = [h("strong", { key: "m" }, F.monthLabel(bucket.period))];
        series.forEach(function(m) {
          if (!shown[m.key]) return;
          kids.push(h(
            "div",
            { key: m.key, className: "wbsal-tip-row" },
            h("i", { className: m.tone }),
            h("span", null, m.label),
            h("b", null, F.money(seriesValue(m, bucket)))
          ));
        });
        kids.push(h("em", { key: "n" }, bucket.records + " \u7B14\u8BB0\u5F55"));
        return h("div", {
          className: "wbsal-tip" + (month >= 8 ? " is-right" : ""),
          style: { left: plotX(month) / LW * 100 + "%" }
        }, kids);
      }
      function signed(amount) {
        var n = Number(amount) || 0;
        return (n > 0 ? "+" : n < 0 ? "-" : "") + F.money(Math.abs(n));
      }
      function kpi(label, value, sub) {
        return h("div", { className: "wbsal-card wbsal-kpi" }, h("span", null, label), h("strong", null, value), h("em", null, sub));
      }
      function compRows(keys, total, deduction) {
        var rows = keys.filter(function(key) {
          return (data.latestMonth.breakdown.fields[key] || 0) !== 0;
        });
        if (rows.length === 0) return null;
        return h("div", { className: "wbsal-comp" }, rows.map(function(key) {
          var amount = data.latestMonth.breakdown.fields[key] || 0;
          var percent = total ? Math.max(2, Math.min(100, Math.round(Math.abs(amount) / total * 100))) : 0;
          return h(
            "div",
            { key, className: "wbsal-comp-row" },
            h("span", null, F.LABELS[key]),
            h("div", { className: "wbsal-comp-track" }, h("div", { className: "wbsal-comp-fill" + (deduction ? " deduction" : ""), style: { width: percent + "%" } })),
            h("span", { className: "wbsal-comp-value" }, h("b", null, F.money(amount)), " \xB7 " + percent + "%")
          );
        }));
      }
      var body;
      if (load.loading) body = h(C.Empty, { h, text: "\u52A0\u8F7D\u4E2D\u2026" });
      else if (load.error) body = h(C.Notice, { h, kind: "error", text: load.error });
      else if (!data || data.records === 0) {
        body = h(
          "div",
          { className: "wbsal-empty" },
          h("div", null, year + " \u5E74\u8FD8\u6CA1\u6709\u5DE5\u8D44\u8BB0\u5F55\uFF1B\u6362\u4E2A\u5E74\u4EFD\uFF0C\u6216\u5148\u53BB\u5DE5\u8D44\u8BB0\u5F55\u9875\u8BB0\u4E00\u7B14")
        );
      } else {
        var latestBreakdown = data.latestMonth && data.latestMonth.breakdown;
        var deductionTotal = latestBreakdown ? latestBreakdown.preTax + latestBreakdown.social + latestBreakdown.tax : 0;
        var chartMax = Math.max(1, maxNet);
        body = h(
          "div",
          { className: "wbsal-section" },
          h(
            "div",
            { className: "wbsal-kpis" },
            kpi("\u6700\u8FD1\u5B9E\u53D1", data.latest ? F.money(data.latest.netPay) : "\u2014", data.latest ? data.latest.payDate + " \xB7 \u6700\u8FD1\u4E00\u7B14" : "\u8FD8\u6CA1\u6709\u8BB0\u5F55"),
            kpi("\u6708\u5747\u5B9E\u53D1", F.money(data.avgNetPay), "\u6309\u6709\u8BB0\u5F55\u7684\u6708\u4EFD\u5E73\u5747"),
            kpi("\u5E74\u5EA6\u5B9E\u53D1\u5408\u8BA1", F.money(data.netTotal), data.records + " \u7B14 \xB7 \u8986\u76D6 " + data.months + " \u4E2A\u6708"),
            kpi("\u5E74\u5EA6\u5E94\u53D1", F.money(data.grossTotal), "\u7A0E\u524D"),
            kpi("\u5E74\u5EA6\u4E2A\u7A0E", F.money(data.incomeTaxTotal), "\u5DE5\u8D44\u85AA\u91D1\u9884\u6263"),
            kpi("\u5E74\u5EA6\u4E94\u9669\u4E00\u91D1", F.money(data.socialTotal), "\u517B\u8001 / \u533B\u7597 / \u5931\u4E1A / \u516C\u79EF\u91D1")
          ),
          // 环比 / 最近月份 / 最近一笔：紧贴月度趋势图上方，先给结论再看图
          h(
            "div",
            { className: "wbsal-kpis" },
            kpi(
              "\u73AF\u6BD4",
              data.mom ? signed(data.mom.amount) : "\u2014",
              data.mom ? data.mom.percent === null ? "\u4E0A\u6708\u4E3A 0" : (data.mom.percent > 0 ? "+" : "") + data.mom.percent + "% \xB7 \u6700\u8FD1\u4E24\u4E2A\u6708" : "\u81F3\u5C11\u9700\u8981\u4E24\u4E2A\u6708\u8BB0\u5F55"
            ),
            kpi("\u6700\u8FD1\u6708\u4EFD", data.latestMonth ? F.monthLabel(data.latestMonth.period) : "\u2014", data.latestMonth ? data.latestMonth.records + " \u7B14" : ""),
            kpi("\u6700\u8FD1\u4E00\u7B14", data.latest ? data.latest.payDate : "\u2014", data.latest ? (data.latest.cycle === "daily" ? "\u65E5\u7ED3" : "\u6708\u7ED3") + " \xB7 " + F.money(data.latest.netPay) : "")
          ),
          h(
            "div",
            { className: "wbsal-card wbsal-section" },
            h(
              "div",
              { className: "wbsal-section-head" },
              h("h3", null, "\u6708\u5EA6" + metricLabel + "\u8D8B\u52BF"),
              h(
                "div",
                { className: "wbsal-section-tools" },
                h("div", { className: "wbsal-metric", role: "group", "aria-label": "\u56FE\u8868\u7EDF\u8BA1\u53E3\u5F84" }, METRICS.map(function(m) {
                  return h("button", {
                    key: m.key,
                    type: "button",
                    className: m.key === metric ? "on" : "",
                    "aria-pressed": m.key === metric,
                    onClick: function() {
                      setMetric(m.key);
                    }
                  }, m.label);
                })),
                h("span", { className: "wbsal-section-note" }, "\u6700\u9AD8 " + F.monthLabel(monthly[topMonth] ? monthly[topMonth].period : "") + " \xB7 " + F.money(maxNet))
              )
            ),
            h("div", { className: "wbsal-chart" }, monthly.map(function(bucket, i) {
              var value = metricValue(bucket);
              var ratio = value > 0 ? value / chartMax : 0;
              var height = Math.round(Math.max(ratio * 150, value > 0 ? 6 : 0));
              return h(
                "div",
                {
                  key: bucket.month,
                  className: "wbsal-bar",
                  title: bucket.month + " \u6708 \xB7 \u57FA\u672C " + F.money(bucket.basePay) + " / \u7EE9\u6548 " + F.money(bucket.performancePay) + " / \u8865\u8D34 " + F.money(bucket.allowance) + " / \u7EE9\u6548\u5956\u60E9 " + F.money(bucket.performanceBonus) + " / \u5E94\u53D1 " + F.money(bucket.grossPay) + " / \u5B9E\u53D1 " + F.money(bucket.netPay)
                },
                h("div", { className: "wbsal-bar-value" }, value > 0 ? Math.round(value).toLocaleString("zh-CN") : ""),
                h("div", { className: "wbsal-bar-fill" + (i === topMonth ? " top" : ""), style: { height: height + "px" } }),
                h("div", { className: "wbsal-bar-label" }, "")
              );
            })),
            h("div", { className: "wbsal-axis" }, monthly.map(function(bucket) {
              return h("span", { key: bucket.month }, bucket.month);
            })),
            h(
              "div",
              { className: "wbsal-chart-foot" },
              h("span", { className: "wbsal-legend" }, h("i", null), "\u6709\u8BB0\u5F55\u6708\u4EFD", h("i", { className: "soft" }), "\u5176\u4ED6\u6708\u4EFD"),
              h("span", null, "\u5355\u4F4D\uFF1A\u5143 \xB7 \u6309\u53D1\u85AA\u65E5\u671F\u5F52\u5C5E\u6708\u4EFD \xB7 \u5F53\u524D\u53E3\u5F84 " + metricLabel)
            )
          ),
          h(
            "div",
            { className: "wbsal-card wbsal-section" },
            h(
              "div",
              { className: "wbsal-section-head" },
              h("h3", null, "\u6708\u5EA6\u8D8B\u52BF\u5BF9\u6BD4"),
              seriesSwitch(LINE_SERIES, visible, toggleSeries, "\u6298\u7EBF\u663E\u793A\u5F00\u5173")
            ),
            h(
              "div",
              { className: "wbsal-linechart" },
              renderChart(LINE_SERIES, visible, "\u6708\u5EA6\u5B9E\u53D1/\u5E94\u53D1/\u57FA\u672C/\u7EE9\u6548/\u8865\u8D34/\u7EE9\u6548\u5956\u60E9\u6298\u7EBF\u56FE", hover, setHover),
              renderTip(LINE_SERIES, visible, hover)
            ),
            anyShown(LINE_SERIES, visible) ? null : h("div", { className: "wbsal-chart-hint" }, "\u516D\u6761\u7EBF\u90FD\u5173\u6389\u4E86\uFF0C\u70B9\u4E0A\u65B9\u300C\u5B9E\u53D1 / \u5E94\u53D1 / \u57FA\u672C / \u7EE9\u6548 / \u8865\u8D34 / \u7EE9\u6548\u5956\u60E9\u300D\u4EFB\u610F\u4E00\u4E2A\u6062\u590D\u663E\u793A"),
            h(
              "div",
              { className: "wbsal-chart-foot" },
              h("span", null, "\u516D\u6761\u7EBF\u53EF\u70B9\u4E0A\u65B9\u6807\u7B7E\u5355\u72EC\u5F00\u5173 \xB7 \u9F20\u6807\u79FB\u5230\u67D0\u4E2A\u6708\u4EFD\u770B\u8BE5\u6708\u5168\u90E8\u7EF4\u5EA6"),
              h("span", null, "\u5355\u4F4D\uFF1A\u5143 \xB7 \u4EC5\u8FDE\u63A5\u6709\u8BB0\u5F55\u7684\u6708\u4EFD")
            )
          ),
          h(
            "div",
            { className: "wbsal-card wbsal-section" },
            h(
              "div",
              { className: "wbsal-section-head" },
              h("h3", null, "\u793E\u4FDD\u4E0E\u4E2A\u7A0E"),
              h("span", null, "\u5E74\u5EA6\u5408\u8BA1 " + F.money(DEDUCT_TOTAL_ALL) + " \xB7 \u5360\u5E94\u53D1 " + (data.grossTotal ? Math.round(DEDUCT_TOTAL_ALL / data.grossTotal * 100) : 0) + "%")
            ),
            h("div", { className: "wbsal-social" }, F.SOCIAL_KEYS.concat(["incomeTax"]).map(function(key) {
              var amount = key === "incomeTax" ? data.incomeTaxTotal || 0 : data.social && data.social[key] || 0;
              var share = DEDUCT_TOTAL_ALL ? Math.round(amount / DEDUCT_TOTAL_ALL * 100) : 0;
              return h(
                "div",
                { key, className: "wbsal-social-item" },
                h("span", null, F.LABELS[key]),
                h("b", null, F.money(amount)),
                h("em", null, "\u5360\u793E\u4FDD\u4E0E\u4E2A\u7A0E " + share + "%")
              );
            })),
            h("div", { className: "wbsal-social-foot" }, seriesSwitch(DEDUCT_SERIES, socialVisible, toggleSocial, "\u793E\u4FDD\u4E0E\u4E2A\u7A0E\u6298\u7EBF\u663E\u793A\u5F00\u5173")),
            h(
              "div",
              { className: "wbsal-linechart" },
              renderChart(DEDUCT_SERIES, socialVisible, "\u6708\u5EA6\u517B\u8001/\u533B\u7597/\u5931\u4E1A/\u516C\u79EF\u91D1/\u4E2A\u7A0E\u6298\u7EBF\u56FE", socialHover, setSocialHover),
              renderTip(DEDUCT_SERIES, socialVisible, socialHover)
            ),
            anyShown(DEDUCT_SERIES, socialVisible) ? null : h("div", { className: "wbsal-chart-hint" }, "\u6240\u6709\u7EBF\u90FD\u5173\u6389\u4E86\uFF0C\u70B9\u4E0A\u65B9\u300C\u517B\u8001 / \u533B\u7597 / \u5931\u4E1A / \u516C\u79EF\u91D1 / \u4E2A\u7A0E / \u5408\u8BA1\u300D\u4EFB\u610F\u4E00\u4E2A\u6062\u590D\u663E\u793A"),
            h(
              "div",
              { className: "wbsal-chart-foot" },
              h("span", null, "\u4E94\u6761\u7EBF + \u865A\u7EBF\u5408\u8BA1\uFF08\u4E94\u9879\u4E4B\u548C\uFF09\u53EF\u5355\u72EC\u5F00\u5173 \xB7 \u9F20\u6807\u79FB\u5230\u67D0\u4E2A\u6708\u4EFD\u770B\u8BE5\u6708\u5206\u9879"),
              h("span", null, "\u5355\u4F4D\uFF1A\u5143 \xB7 \u4EC5\u8FDE\u63A5\u6709\u8BB0\u5F55\u7684\u6708\u4EFD")
            )
          ),
          data.latestMonth ? h(
            "div",
            { className: "wbsal-card wbsal-section" },
            h(
              "div",
              { className: "wbsal-section-head" },
              h("h3", null, F.monthLabel(data.latestMonth.period) + " \u6536\u5165\u4E0E\u6263\u6B3E\u6784\u6210"),
              h("span", null, "\u5171 " + data.latestMonth.records + " \u7B14")
            ),
            h(
              "div",
              { className: "wbsal-comp-grid" },
              h(
                "div",
                null,
                h("div", { className: "wbsal-group-title" }, "\u6536\u5165\u9879 \xB7 \u5408\u8BA1 " + F.money(latestBreakdown.income)),
                compRows(F.INCOME_KEYS, latestBreakdown.income, false)
              ),
              h(
                "div",
                null,
                h("div", { className: "wbsal-group-title" }, "\u6263\u6B3E\u9879 \xB7 \u5408\u8BA1 " + F.money(deductionTotal)),
                compRows(F.PRETAX_KEYS.concat(F.SOCIAL_KEYS, F.TAX_KEYS), deductionTotal, true)
              )
            )
          ) : null
        );
      }
      return h(
        "div",
        { className: "wbsal-page" },
        h(
          "div",
          { className: "wbsal-toolbar wbsal-toolbar-plain" },
          h(
            "div",
            { className: "wbsal-toolbar-end" },
            h(
              "div",
              { className: "wbsal-seg" },
              h(C.Btn, { h, kind: "ghost", onClick: function() {
                setYear(Math.max(2e3, year - 1));
              } }, "\u2039"),
              h("span", { className: "wbsal-seg-year" }, year + " \u5E74"),
              h(C.Btn, { h, kind: "ghost", onClick: function() {
                setYear(Math.min(2100, year + 1));
              } }, "\u203A")
            )
          )
        ),
        body
      );
    };
  }
});

// packages/addons/lib/date-picker.cjs
var require_date_picker = __commonJS({
  "packages/addons/lib/date-picker.cjs"(exports2, module2) {
    "use strict";
    var ReactDefault = require("react");
    var MONTH_EN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    function pad(n) {
      return String(n).padStart(2, "0");
    }
    function todayISO() {
      var d = /* @__PURE__ */ new Date();
      return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
    }
    function validDate(value) {
      if (!value) return false;
      if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
      var d = /* @__PURE__ */ new Date(value + "T00:00:00Z");
      return isFinite(d.getTime()) && d.toISOString().slice(0, 10) === value && value.slice(0, 4) !== "0000";
    }
    function toUTC(iso) {
      return /* @__PURE__ */ new Date(iso + "T00:00:00Z");
    }
    function shiftDate(iso, days) {
      var d = toUTC(iso);
      d.setUTCDate(d.getUTCDate() + days);
      return d.toISOString().slice(0, 10);
    }
    function shiftMonth(month, delta) {
      var d = toUTC(month + "-01");
      d.setUTCMonth(d.getUTCMonth() + delta);
      return d.toISOString().slice(0, 7);
    }
    function monthKey(iso) {
      return (iso || todayISO()).slice(0, 7);
    }
    function monthLabel(month, en) {
      return en ? month.slice(0, 4) + "-" + month.slice(5) : month.slice(0, 4) + "\u5E74" + Number(month.slice(5)) + "\u6708";
    }
    function daysInMonth(month) {
      return new Date(Date.UTC(Number(month.slice(0, 4)), Number(month.slice(5)), 0)).getUTCDate();
    }
    function normalizeRange(value) {
      var from = value && validDate(value.from) ? value.from : "";
      var to = value && validDate(value.to) ? value.to : "";
      if (from && to && from > to) return { from: to, to: from, swapped: true };
      return { from, to, swapped: false };
    }
    function clampDay(iso, min, max) {
      if (min && iso < min) return false;
      if (max && iso > max) return false;
      return true;
    }
    function ctx(props) {
      var R = props && props.React || ReactDefault;
      return { R, h: props && props.h || R.createElement };
    }
    function usePopover(R, open, setOpen, root) {
      R.useEffect(function() {
        if (!open) return void 0;
        function onDoc(ev) {
          if (root.current && !root.current.contains(ev.target)) setOpen(false);
        }
        function onKey(ev) {
          if (ev.key === "Escape") setOpen(false);
        }
        if (typeof document !== "undefined" && typeof document.addEventListener === "function") {
          document.addEventListener("mousedown", onDoc);
          document.addEventListener("keydown", onKey);
          return function() {
            document.removeEventListener("mousedown", onDoc);
            document.removeEventListener("keydown", onKey);
          };
        }
        return void 0;
      }, [open]);
    }
    function Calendar(props) {
      var h = props.h, p = props.prefix, en = props.lang === "en";
      var month = props.month, cells = [];
      var offset = toUTC(month + "-01").getUTCDay();
      var count = daysInMonth(month);
      var i;
      for (i = 0; i < offset; i++) cells.push(h("span", { key: "e" + i, "aria-hidden": "true" }));
      for (i = 1; i <= count; i++) {
        var day = month + "-" + pad(i);
        var disabled = !clampDay(day, props.min, props.max);
        var selected = props.isSelected ? props.isSelected(day) : false;
        var between = props.isBetween ? props.isBetween(day) : false;
        cells.push(h("button", {
          key: day,
          type: "button",
          disabled,
          "data-day": day,
          "aria-label": day,
          "aria-pressed": selected,
          "aria-current": day === todayISO() ? "date" : void 0,
          className: p + "-dp-day" + (selected ? " is-on" : "") + (between ? " is-between" : "") + (day === todayISO() ? " is-today" : ""),
          onClick: props.onPick.bind(null, day),
          onKeyDown: function(ev) {
            var delta = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[ev.key];
            if (!delta) return;
            ev.preventDefault();
            var next = shiftDate(ev.currentTarget.getAttribute("data-day"), delta);
            if (clampDay(next, props.min, props.max)) props.onMove(monthKey(next), next);
          }
        }, i));
      }
      return h(
        "div",
        { className: p + "-dp-cal", role: "group", "aria-label": en ? "Calendar" : "\u65E5\u5386" },
        h(
          "div",
          { className: p + "-dp-head" },
          h("button", { type: "button", className: p + "-dp-nav", "aria-label": en ? "Previous month" : "\u4E0A\u4E2A\u6708", onClick: function() {
            props.onMove(shiftMonth(month, -1), "");
          } }, "\u2039"),
          h("strong", { className: p + "-dp-title", "aria-live": "polite" }, monthLabel(month, en)),
          h("button", { type: "button", className: p + "-dp-nav", "aria-label": en ? "Next month" : "\u4E0B\u4E2A\u6708", onClick: function() {
            props.onMove(shiftMonth(month, 1), "");
          } }, "\u203A")
        ),
        h(
          "div",
          { className: p + "-dp-weekdays", "aria-hidden": "true" },
          (en ? ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"] : ["\u65E5", "\u4E00", "\u4E8C", "\u4E09", "\u56DB", "\u4E94", "\u516D"]).map(function(w) {
            return h("span", { key: w }, w);
          })
        ),
        h("div", { className: p + "-dp-grid" }, cells)
      );
    }
    function DatePicker(props) {
      var c = ctx(props), R = c.R, h = c.h;
      var p = props.prefix, en = props.lang === "en";
      var value = validDate(props.value) ? props.value : "";
      var openS = R.useState(!!props.defaultOpen), open = openS[0], setOpen = openS[1];
      var monthS = R.useState(monthKey(value || props.max || todayISO())), month = monthS[0], setMonth = monthS[1];
      var root = R.useRef(null);
      usePopover(R, open, setOpen, root);
      function pick(day) {
        if (props.onChange) props.onChange(day);
        setOpen(false);
      }
      function toggle() {
        setMonth(monthKey(validDate(props.value) ? props.value : props.max || todayISO()));
        setOpen(!open);
      }
      return h(
        "div",
        { className: p + "-dp" + (props.className ? " " + props.className : ""), ref: root },
        h(
          "div",
          { className: p + "-dp-field" },
          h(
            "button",
            {
              type: "button",
              className: p + "-dp-trigger",
              disabled: !!props.disabled,
              "aria-haspopup": "dialog",
              "aria-expanded": open,
              "aria-label": (props.label ? props.label + ": " : "") + (value || props.placeholder || (en ? "Pick a date" : "\u9009\u62E9\u65E5\u671F")),
              onClick: toggle
            },
            h("span", { className: p + "-dp-glyph", "aria-hidden": "true" }),
            h("span", { className: p + "-dp-value" + (value ? "" : " is-empty") }, value || props.placeholder || (en ? "Pick a date" : "\u9009\u62E9\u65E5\u671F"))
          ),
          value && !props.disabled && props.clearable !== false ? h("button", { type: "button", className: p + "-dp-clear", "aria-label": en ? "Clear date" : "\u6E05\u9664\u65E5\u671F", onClick: function() {
            if (props.onChange) props.onChange("");
          } }, "\xD7") : null
        ),
        open ? h(
          "div",
          { className: p + "-dp-pop", role: "dialog", "aria-modal": "false", "aria-label": props.label || (en ? "Pick a date" : "\u9009\u62E9\u65E5\u671F") },
          h(Calendar, { h, prefix: p, lang: props.lang, month, min: props.min, max: props.max, onMove: function(m) {
            setMonth(m);
          }, isSelected: function(d) {
            return d === value;
          }, onPick: pick }),
          h(
            "div",
            { className: p + "-dp-foot" },
            h("button", { type: "button", className: p + "-dp-link", onClick: function() {
              pick(todayISO());
            } }, en ? "Today" : "\u4ECA\u5929"),
            props.min || props.max ? h("span", { className: p + "-dp-hint" }, [props.min, props.max].filter(Boolean).join(" \u2014 ")) : null
          )
        ) : null
      );
    }
    function RangePicker(props) {
      var c = ctx(props), R = c.R, h = c.h;
      var p = props.prefix, en = props.lang === "en";
      var range = normalizeRange(props.value);
      var from = range.from, to = range.to;
      var openS = R.useState(!!props.defaultOpen), open = openS[0], setOpen = openS[1];
      var startS = R.useState(""), start = startS[0], setStart = startS[1];
      var monthS = R.useState(monthKey(from || to || props.max || todayISO())), month = monthS[0], setMonth = monthS[1];
      var root = R.useRef(null);
      usePopover(R, open, setOpen, root);
      function apply(next) {
        if (typeof props.onChange === "function") props.onChange(normalizeRange(next));
        setStart("");
        setOpen(false);
      }
      function pick(day) {
        if (!start) {
          setStart(day);
          return;
        }
        apply({ from: start, to: day });
      }
      function toggle() {
        setStart("");
        setMonth(monthKey(from || to || props.max || todayISO()));
        setOpen(!open);
      }
      var summary = from && to ? from + " \u2014 " + to : from ? from + (en ? " onward" : " \u8D77") : to ? (en ? "Until " : "\u622A\u81F3 ") + to : props.placeholder || (en ? "Choose date range" : "\u9009\u62E9\u65E5\u671F\u8303\u56F4");
      return h(
        "div",
        { className: p + "-dr" + (props.className ? " " + props.className : ""), ref: root },
        h(
          "div",
          { className: p + "-dp-field" },
          h(
            "button",
            {
              type: "button",
              className: p + "-dp-trigger",
              "aria-haspopup": "dialog",
              "aria-expanded": open,
              "aria-label": (props.label || (en ? "Date range" : "\u65E5\u671F\u8303\u56F4")) + ": " + summary,
              onClick: toggle
            },
            h("span", { className: p + "-dp-glyph", "aria-hidden": "true" }),
            h("span", { className: p + "-dp-value" + (from || to ? "" : " is-empty") }, summary)
          ),
          (from || to) && props.clearable !== false ? h("button", { type: "button", className: p + "-dp-clear", "aria-label": en ? "Clear range" : "\u6E05\u9664\u8303\u56F4", onClick: function() {
            apply({ from: "", to: "" });
          } }, "\xD7") : null
        ),
        open ? h(
          "div",
          { className: p + "-dp-pop", role: "dialog", "aria-modal": "false", "aria-label": props.label || (en ? "Date range" : "\u65E5\u671F\u8303\u56F4") },
          h(Calendar, {
            h,
            prefix: p,
            lang: props.lang,
            month,
            min: props.min,
            max: props.max,
            onMove: function(m) {
              setMonth(m);
            },
            isSelected: function(d) {
              return start ? d === start : d === from || d === to;
            },
            isBetween: function(d) {
              return start ? start < d && d < (to || "") : !!(from && to && d > from && d < to);
            },
            onPick: pick
          }),
          h(
            "p",
            { className: p + "-dp-hint", role: "status" },
            start ? en ? "Start " + start + " \xB7 pick the end date" : "\u8D77\u59CB " + start + " \xB7 \u8BF7\u9009\u62E9\u7ED3\u675F\u65E5\u671F" : en ? "Pick start, then end date" : "\u5148\u9009\u5F00\u59CB\u65E5\u671F\uFF0C\u518D\u9009\u7ED3\u675F\u65E5\u671F"
          ),
          start ? h(
            "div",
            { className: p + "-dp-acts" },
            h("button", { type: "button", className: p + "-dp-link", onClick: function() {
              apply({ from: start, to: "" });
            } }, en ? "Only start" : "\u4EC5\u8D77\u59CB\u65E5\u671F"),
            h("button", { type: "button", className: p + "-dp-link", onClick: function() {
              apply({ from: "", to: start });
            } }, en ? "Only end" : "\u4EC5\u622A\u6B62\u65E5\u671F")
          ) : null,
          h(
            "div",
            { className: p + "-dp-foot" },
            h("button", { type: "button", className: p + "-dp-link", onClick: function() {
              setOpen(false);
              setStart("");
            } }, en ? "Cancel" : "\u53D6\u6D88")
          )
        ) : null
      );
    }
    function MonthPicker(props) {
      var c = ctx(props), R = c.R, h = c.h;
      var p = props.prefix, en = props.lang === "en";
      var value = /^\d{4}-\d{2}$/.test(props.value || "") ? props.value : "";
      var base = value || monthKey(props.max || todayISO());
      var openS = R.useState(!!props.defaultOpen), open = openS[0], setOpen = openS[1];
      var yearS = R.useState(Number(base.slice(0, 4))), year = yearS[0], setYear = yearS[1];
      var root = R.useRef(null);
      usePopover(R, open, setOpen, root);
      function pick(month) {
        if (props.onChange) props.onChange(month);
        setOpen(false);
      }
      var months = [];
      for (var m = 1; m <= 12; m++) {
        var key = year + "-" + pad(m);
        months.push(h("button", {
          key,
          type: "button",
          "data-month": key,
          "aria-pressed": key === value,
          className: p + "-dp-day" + (key === value ? " is-on" : "") + (key === monthKey(todayISO()) ? " is-today" : ""),
          onClick: pick.bind(null, key)
        }, en ? MONTH_EN[m - 1] : m + "\u6708"));
      }
      return h(
        "div",
        { className: p + "-dp" + (props.className ? " " + props.className : ""), ref: root },
        h(
          "div",
          { className: p + "-dp-field" },
          h(
            "button",
            {
              type: "button",
              className: p + "-dp-trigger",
              "aria-haspopup": "dialog",
              "aria-expanded": open,
              "aria-label": (props.label || (en ? "Pick a month" : "\u9009\u62E9\u6708\u4EFD")) + ": " + (value ? monthLabel(value, en) : ""),
              onClick: function() {
                setYear(Number((value || base).slice(0, 4)));
                setOpen(!open);
              }
            },
            h("span", { className: p + "-dp-glyph", "aria-hidden": "true" }),
            h("span", { className: p + "-dp-value" + (value ? "" : " is-empty") }, value ? monthLabel(value, en) : props.placeholder || (en ? "Pick a month" : "\u9009\u62E9\u6708\u4EFD"))
          ),
          value && props.clearable !== false ? h("button", { type: "button", className: p + "-dp-clear", "aria-label": en ? "Clear month" : "\u6E05\u9664\u6708\u4EFD", onClick: function() {
            if (props.onChange) props.onChange("");
          } }, "\xD7") : null
        ),
        open ? h(
          "div",
          { className: p + "-dp-pop is-months", role: "dialog", "aria-modal": "false", "aria-label": props.label || (en ? "Pick a month" : "\u9009\u62E9\u6708\u4EFD") },
          h(
            "div",
            { className: p + "-dp-head" },
            h("button", { type: "button", className: p + "-dp-nav", "aria-label": en ? "Previous year" : "\u4E0A\u4E00\u5E74", onClick: function() {
              setYear(year - 1);
            } }, "\u2039"),
            h("strong", { className: p + "-dp-title", "aria-live": "polite" }, en ? String(year) : year + "\u5E74"),
            h("button", { type: "button", className: p + "-dp-nav", "aria-label": en ? "Next year" : "\u4E0B\u4E00\u5E74", onClick: function() {
              setYear(year + 1);
            } }, "\u203A")
          ),
          h("div", { className: p + "-dp-months" }, months),
          h(
            "div",
            { className: p + "-dp-foot" },
            h("button", { type: "button", className: p + "-dp-link", onClick: function() {
              pick(monthKey(todayISO()));
            } }, en ? "This month" : "\u672C\u6708"),
            h("button", { type: "button", className: p + "-dp-link", onClick: function() {
              setOpen(false);
            } }, en ? "Cancel" : "\u53D6\u6D88")
          )
        ) : null
      );
    }
    function InlineCalendar(props) {
      var c = ctx(props), R = c.R, h = c.h;
      var p = props.prefix;
      var value = validDate(props.value) ? props.value : "";
      var monthS = R.useState(monthKey(props.month || value || props.max || todayISO())), month = monthS[0], setMonth = monthS[1];
      return h(
        "div",
        { className: p + "-dp is-inline" },
        h(Calendar, {
          h,
          prefix: p,
          lang: props.lang,
          month,
          min: props.min,
          max: props.max,
          onMove: function(m) {
            setMonth(m);
            if (props.onMonthChange) props.onMonthChange(m);
          },
          isSelected: function(d) {
            return d === value;
          },
          isBetween: props.isBetween,
          onPick: function(d) {
            if (props.onChange) props.onChange(d);
          }
        }),
        props.footer ? h("div", { className: p + "-dp-foot" }, props.footer) : null
      );
    }
    module2.exports = {
      DatePicker,
      RangePicker,
      MonthPicker,
      InlineCalendar,
      todayISO,
      validDate,
      shiftDate,
      shiftMonth,
      normalizeRange,
      monthLabel,
      daysInMonth
    };
  }
});

// packages/addons/salary/client/views/records.cjs
var require_records = __commonJS({
  "packages/addons/salary/client/views/records.cjs"(exports2, module2) {
    "use strict";
    module2.exports = function Records(props) {
      var h = props.h, React = props.React, api = props.api, lang = props.lang;
      var C = require_common();
      var DP = require_date_picker();
      var F = require_fields();
      var status = C.useLoad(React, api, "salary.status", {}, []);
      var filterState = React.useState({ year: String((/* @__PURE__ */ new Date()).getFullYear()), cycle: "" });
      var filter = filterState[0], setFilter = filterState[1];
      var list = C.useLoad(React, api, "salary.recordList", {
        year: filter.year ? Number(filter.year) : void 0,
        cycle: filter.cycle || void 0,
        limit: 400
      }, [filter.year, filter.cycle]);
      var openState = React.useState(props.initialOpenId || "");
      var openId = openState[0], setOpenId = openState[1];
      var confirmState = React.useState("");
      var confirmId = confirmState[0], setConfirmId = confirmState[1];
      var formState = React.useState(props.initialForm || null);
      var form = formState[0], setForm = formState[1];
      var msgState = React.useState(null);
      var msg = msgState[0], setMsg = msgState[1];
      var savingState = React.useState(false);
      var saving = savingState[0], setSaving = savingState[1];
      var modalOpen = !!form;
      React.useEffect(function() {
        if (!modalOpen || typeof document === "undefined" || typeof document.addEventListener !== "function" || !document.body) return void 0;
        function onKey(event) {
          if (event.key === "Escape") closeForm();
        }
        document.addEventListener("keydown", onKey);
        var previous = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return function() {
          document.removeEventListener("keydown", onKey);
          document.body.style.overflow = previous;
        };
      }, [modalOpen, form && form.mode, form && form.id]);
      function reloadAll() {
        status.refresh();
        list.refresh();
      }
      function pickDate(cycle) {
        var now = /* @__PURE__ */ new Date();
        var year = now.getFullYear();
        var month = String(now.getMonth() + 1).padStart(2, "0");
        return cycle === "monthly" ? year + "-" + month + "-15" : year + "-" + month + "-" + String(now.getDate()).padStart(2, "0");
      }
      function openCreate() {
        setConfirmId("");
        setOpenId("");
        setMsg(null);
        var payDate = pickDate("monthly");
        setForm({ mode: "create", id: "", payDate, cycle: "monthly", note: F.defaultNote(payDate, "monthly"), values: F.blankValues(), lockGross: false });
      }
      function openEdit(item) {
        var values = F.blankValues();
        F.KEYS.forEach(function(key) {
          values[key] = key === "grossPay" || key === "netPay" ? F.fmtAmount(item[key]) : item[key] ? F.fmtAmount(item[key]) : "";
        });
        var incomeZero = F.INCOME_KEYS.every(function(key) {
          return !F.num(item[key]);
        });
        setConfirmId("");
        setOpenId("");
        setMsg(null);
        setForm({ mode: "edit", id: item.id, payDate: item.payDate, cycle: item.cycle || "monthly", note: item.note || "", values, lockGross: incomeZero && F.num(item.grossPay) > 0 });
      }
      function closeForm() {
        setForm(null);
        setMsg(null);
      }
      function setField(key, value) {
        setForm(function(prev) {
          var next = Object.assign({}, prev, { note: prev.note });
          next[key] = value;
          if (key === "payDate" && !prev.cycleLocked) {
            var same = String(value).slice(5) === "15";
            if (same) next.cycle = "monthly";
          }
          if (key === "payDate" && (!prev.note || prev.note === F.defaultNote(prev.payDate, prev.cycle))) {
            next.note = F.defaultNote(value, next.cycle);
          }
          return next;
        });
      }
      function setValue(key, value) {
        setForm(function(prev) {
          var values = Object.assign({}, prev.values);
          values[key] = value;
          return Object.assign({}, prev, { values });
        });
      }
      function recalcFromDetail() {
        setForm(function(prev) {
          var computed = F.totals(prev.values);
          var values = Object.assign({}, prev.values, { grossPay: F.fmtAmount(computed.gross), netPay: F.fmtAmount(computed.net) });
          return Object.assign({}, prev, { values, lockGross: false });
        });
      }
      function submit() {
        if (!form) return;
        var computed = F.totals(form.values);
        var payload = {
          payDate: form.payDate,
          cycle: form.cycle,
          note: form.note || ""
        };
        F.KEYS.forEach(function(key) {
          if (key === "grossPay" && form.lockGross) {
            payload.grossPay = F.num(form.values.grossPay);
            return;
          }
          if (key === "grossPay" || key === "netPay") {
            payload[key] = F.num(form.values[key]) || computed[key === "grossPay" ? "gross" : "net"];
            return;
          }
          payload[key] = F.num(form.values[key]);
        });
        setSaving(true);
        var request = form.mode === "edit" ? C.call(api, "salary.recordUpdate", Object.assign({ id: form.id }, payload)) : C.call(api, "salary.recordCreate", payload);
        request.then(function() {
          setSaving(false);
          closeForm();
          reloadAll();
          setMsg({ kind: "ok", text: "\u5DF2\u4FDD\u5B58" });
        }).catch(function(e) {
          setSaving(false);
          setMsg({ kind: "error", text: C.errText(e) });
        });
      }
      function remove(id) {
        C.call(api, "salary.recordDelete", { id }).then(function() {
          setConfirmId("");
          if (openId === id) setOpenId("");
          reloadAll();
          setMsg({ kind: "ok", text: "\u5DF2\u5220\u9664" });
        }).catch(function(e) {
          setMsg({ kind: "error", text: C.errText(e) });
        });
      }
      var items = list.data && list.data.items || [];
      var groups = {};
      items.forEach(function(item) {
        var period = String(item.payDate).slice(0, 7);
        (groups[period] = groups[period] || []).push(item);
      });
      var periods = Object.keys(groups).sort().reverse();
      var total = Number(list.data && list.data.total) || items.length;
      var currentYear = (/* @__PURE__ */ new Date()).getFullYear();
      var yearOptions = ["", String(currentYear + 1), String(currentYear), String(currentYear - 1), String(currentYear - 2)];
      var latest = status.data || {};
      function amountInput(key, disabled) {
        return h("input", {
          className: "wbsal-input",
          type: "number",
          step: "0.01",
          min: key === "performanceBonus" ? void 0 : "0",
          value: form.values[key],
          disabled,
          onChange: function(e) {
            setValue(key, e.target.value);
          },
          onBlur: function() {
            setValue(key, F.fmtAmount(F.num(form.values[key])));
          }
        });
      }
      function renderForm() {
        var computed = F.totals(form.values);
        var lockedGross = form.lockGross;
        var sameDayCount = items.filter(function(item) {
          return item.payDate === form.payDate && item.id !== form.id;
        }).length;
        return h(
          "div",
          { className: "wbsal-card wbsal-form wbsal-form-modal" },
          h(
            "div",
            { className: "wbsal-form-head" },
            h(
              "div",
              null,
              h("div", { className: "wbsal-eyebrow" }, form.mode === "edit" ? "EDIT RECORD" : "NEW RECORD"),
              h("h3", null, form.mode === "edit" ? "\u7F16\u8F91\u5DE5\u8D44" : "\u8BB0\u4E00\u7B14\u5DE5\u8D44")
            ),
            h(C.Btn, { h, kind: "ghost", onClick: closeForm }, "\u5173\u95ED")
          ),
          h(
            "div",
            { className: "wbsal-form-meta" },
            h(
              C.Field,
              { h, label: "\u53D1\u85AA\u65E5\u671F", hint: F.incomeLabel(form.payDate) ? "\u5BF9\u5E94 " + F.incomeLabel(form.payDate) + " \u5DE5\u8D44" : "\u6708\u7ED3" },
              h(DP.DatePicker, { React, h, prefix: "wbsal", lang, label: "\u53D1\u85AA\u65E5\u671F", value: form.payDate, onChange: function(next) {
                setField("payDate", next);
              } })
            ),
            h(
              C.Field,
              { h, label: "\u7C7B\u578B", hint: "\u6708\u7ED3" },
              h(
                "select",
                { className: "wbsal-input", value: form.cycle, onChange: function(e) {
                  setField("cycle", e.target.value);
                } },
                h("option", { value: "monthly" }, "\u6708\u7ED3"),
                h("option", { value: "daily" }, "\u65E5\u7ED3")
              )
            ),
            h(C.Field, { h, label: "\u5907\u6CE8" }, h("input", { className: "wbsal-input", value: form.note, onChange: function(e) {
              setField("note", e.target.value);
            } }))
          ),
          sameDayCount > 0 ? h(C.Notice, { h, text: "\u8BE5\u65E5\u5DF2\u6709 " + sameDayCount + " \u7B14\u8BB0\u5F55\uFF1B\u4FDD\u5B58\u4F1A\u65B0\u589E\u4E00\u6761\uFF0C\u4E0D\u4F1A\u8986\u76D6\u3002" }) : null,
          F.GROUPS.map(function(group) {
            return h(
              "div",
              { key: group.id, className: "wbsal-form-group" },
              h(
                "div",
                { className: "wbsal-group-head" },
                h("div", { className: "wbsal-group-title" }, group.title),
                h("span", null, group.hint)
              ),
              h("div", { className: "wbsal-form-grid" }, group.keys.map(function(key) {
                return h(C.Field, { key, h, label: F.LABELS[key] }, amountInput(key, false));
              }))
            );
          }),
          h(
            "div",
            { className: "wbsal-form-group" },
            h(
              "div",
              { className: "wbsal-group-head" },
              h("div", { className: "wbsal-group-title" }, "\u6C47\u603B"),
              h("span", null, "\u9ED8\u8BA4\u6309\u660E\u7EC6\u5B9E\u65F6\u8BA1\u7B97\uFF0C\u4E5F\u53EF\u4EE5\u76F4\u63A5\u6539")
            ),
            h(
              "div",
              { className: "wbsal-form-grid" },
              h(C.Field, { h, label: "\u5E94\u53D1\u7A0E\u524D\u5DE5\u8D44" }, amountInput("grossPay", lockedGross)),
              h(C.Field, { h, label: "\u5B9E\u53D1\u5DE5\u8D44" }, amountInput("netPay", false))
            )
          ),
          h(
            "div",
            { className: "wbsal-summary" },
            h("div", null, h("span", null, "\u6536\u5165\u5408\u8BA1"), h("b", null, F.money(computed.income))),
            h("div", null, h("span", null, "\u7A0E\u524D\u6263\u6B3E"), h("b", null, F.money(computed.preTax))),
            h("div", null, h("span", null, "\u793E\u4FDD\u516C\u79EF\u91D1"), h("b", null, F.money(computed.social))),
            h("div", null, h("span", null, "\u4E2A\u7A0E+\u7A0E\u540E"), h("b", null, F.money(computed.tax))),
            h("div", null, h("span", null, "\u5E94\u53D1"), h("b", null, F.money(F.num(form.values.grossPay)))),
            h("div", null, h("span", null, "\u5B9E\u53D1"), h("b", null, F.money(F.num(form.values.netPay)))),
            lockedGross ? h(
              "div",
              { className: "wbsal-lock" },
              h("span", { className: "wbsal-muted" }, "\u8FD9\u6761\u5386\u53F2\u8BB0\u5F55\u53EA\u6709\u6C47\u603B\u503C\uFF0C\u5E94\u53D1\u5DF2\u9501\u5B9A\uFF0C\u907F\u514D\u88AB\u660E\u7EC6\u91CD\u7B97\u6E05\u96F6\u3002"),
              h(C.Btn, { h, onClick: recalcFromDetail }, "\u6309\u660E\u7EC6\u91CD\u7B97")
            ) : null
          ),
          h(C.Notice, { h, kind: msg && msg.kind, text: msg && msg.text }),
          h(
            "div",
            { className: "wbsal-form-actions" },
            h(C.Btn, { h, kind: "primary", onClick: submit, disabled: saving }, saving ? "\u4FDD\u5B58\u4E2D\u2026" : form.mode === "edit" ? "\u4FDD\u5B58\u4FEE\u6539" : "\u4FDD\u5B58"),
            h(C.Btn, { h, kind: "ghost", onClick: closeForm }, "\u53D6\u6D88")
          )
        );
      }
      function renderModal() {
        return h("div", {
          className: "wbsal-mask",
          onClick: function(event) {
            if (event.target === event.currentTarget) closeForm();
          }
        }, h("div", {
          className: "wbsal-modal",
          role: "dialog",
          "aria-modal": "true",
          "aria-label": form.mode === "edit" ? "\u7F16\u8F91\u5DE5\u8D44" : "\u8BB0\u4E00\u7B14\u5DE5\u8D44"
        }, renderForm()));
      }
      function renderDetail(item) {
        var blocks = F.GROUPS.map(function(group) {
          return h(
            "div",
            { key: group.id, className: "wbsal-detail-block" },
            h("div", { className: "wbsal-group-title" }, group.title),
            h("div", { className: "wbsal-fields" }, group.keys.map(function(key) {
              return h("div", { key }, h("span", null, F.LABELS[key]), h("b", null, F.money(item[key])));
            }))
          );
        });
        blocks.push(h(
          "div",
          { key: "sum", className: "wbsal-detail-block" },
          h("div", { className: "wbsal-group-title" }, "\u6C47\u603B"),
          h(
            "div",
            { className: "wbsal-fields" },
            h("div", { className: "wbsal-field-sum" }, h("span", null, "\u5E94\u53D1\u7A0E\u524D"), h("b", null, F.money(item.grossPay))),
            h("div", { className: "wbsal-field-sum" }, h("span", null, "\u793E\u4FDD\u516C\u79EF\u91D1"), h("b", null, F.money(F.sumValues(item, F.SOCIAL_KEYS)))),
            h("div", { className: "wbsal-field-sum" }, h("span", null, "\u4E2A\u7A0E+\u7A0E\u540E"), h("b", null, F.money(F.sumValues(item, F.TAX_KEYS)))),
            h("div", { className: "wbsal-field-sum" }, h("span", null, "\u5B9E\u53D1\u5DE5\u8D44"), h("b", null, F.money(item.netPay)))
          )
        ));
        return h(
          "div",
          { className: "wbsal-detail" },
          blocks,
          h(
            "div",
            { className: "wbsal-detail-foot" },
            h(
              "div",
              { className: "wbsal-muted" },
              (item.note ? "\u5907\u6CE8\uFF1A" + item.note + " \xB7 " : "") + "\u66F4\u65B0\u4E8E " + C.fmtTime(item.updatedAt, lang)
            ),
            h(
              "div",
              { className: "wbsal-detail-actions" },
              h(C.Btn, { h, onClick: function() {
                openEdit(item);
              } }, "\u7F16\u8F91"),
              confirmId === item.id ? h(
                "span",
                { className: "wbsal-confirm" },
                h("span", { className: "wbsal-danger" }, "\u786E\u8BA4\u5220\u9664\uFF1F"),
                h(C.Btn, { h, kind: "danger", onClick: function() {
                  remove(item.id);
                } }, "\u5220\u9664"),
                h(C.Btn, { h, kind: "ghost", onClick: function() {
                  setConfirmId("");
                } }, "\u53D6\u6D88")
              ) : h(C.Btn, { h, kind: "danger", onClick: function() {
                setConfirmId(item.id);
              } }, "\u5220\u9664")
            )
          )
        );
      }
      function renderRow(item) {
        var expanded = openId === item.id;
        var rows = [
          h(
            "tr",
            {
              key: item.id,
              className: "wbsal-record-row" + (expanded ? " open" : ""),
              onClick: function() {
                setOpenId(expanded ? "" : item.id);
                setConfirmId("");
              }
            },
            h("td", { className: "left" }, h("span", { className: "wbsal-date" }, h("b", null, String(item.payDate).slice(5)), h("span", null, F.weekday(item.payDate)))),
            h("td", { className: "left" }, h(C.Pill, { h, kind: item.cycle === "daily" ? "warn" : "ok" }, item.cycle === "daily" ? "\u65E5\u7ED3" : "\u6708\u7ED3")),
            h("td", null, h("span", { className: "wbsal-net" }, F.money(item.netPay))),
            h("td", { className: "wbsal-opt" }, F.money(item.grossPay)),
            h("td", { className: "wbsal-opt hide-md" }, F.money(F.sumValues(item, F.SOCIAL_KEYS))),
            h("td", { className: "wbsal-opt hide-md" }, F.money(item.incomeTax)),
            h("td", null, h("span", { className: "wbsal-caret" }, "\u203A"))
          ),
          expanded ? h("tr", { key: item.id + "-detail" }, h("td", { className: "wbsal-detail-cell", colSpan: 7 }, renderDetail(item))) : null
        ];
        return rows;
      }
      var body;
      if (list.loading) body = h(C.Empty, { h, text: "\u52A0\u8F7D\u4E2D\u2026" });
      else if (list.error) body = h(C.Notice, { h, kind: "error", text: list.error });
      else if (items.length === 0) {
        body = h(
          "div",
          { className: "wbsal-empty" },
          h("div", null, filter.year || filter.cycle ? "\u8FD9\u4E2A\u7B5B\u9009\u6761\u4EF6\u4E0B\u6CA1\u6709\u8BB0\u5F55" : "\u8FD8\u6CA1\u6709\u5DE5\u8D44\u8BB0\u5F55\uFF0C\u5148\u8BB0\u4E00\u7B14"),
          h(
            "div",
            { className: "wbsal-empty-actions" },
            filter.year || filter.cycle ? h(C.Btn, { h, onClick: function() {
              setFilter({ year: "", cycle: "" });
            } }, "\u6E05\u9664\u7B5B\u9009") : null,
            h(C.Btn, { h, kind: "primary", onClick: openCreate }, "\uFF0B \u8BB0\u4E00\u7B14")
          )
        );
      } else {
        body = h("div", { className: "wbsal-months" }, periods.map(function(period) {
          var rows = groups[period];
          var sum = rows.reduce(function(acc, item) {
            return acc + (Number(item.netPay) || 0);
          }, 0);
          return h(
            "section",
            { key: period },
            h(
              "div",
              { className: "wbsal-month" },
              h(
                "div",
                { className: "wbsal-month-title" },
                h("strong", null, F.monthLabel(period)),
                h("span", null, "\u53D1\u85AA\u6708 \xB7 " + rows.length + " \u7B14")
              ),
              h("div", { className: "wbsal-month-total" }, "\u5B9E\u53D1\u5408\u8BA1", h("b", null, F.money(sum)))
            ),
            h(
              "div",
              { className: "wbsal-table-wrap" },
              h(
                "table",
                { className: "wbsal-table" },
                h("thead", null, h(
                  "tr",
                  null,
                  h("th", { className: "left" }, "\u53D1\u85AA\u65E5"),
                  h("th", { className: "left" }, "\u7C7B\u578B"),
                  h("th", null, "\u5B9E\u53D1"),
                  h("th", null, "\u5E94\u53D1"),
                  h("th", { className: "hide-md" }, "\u793E\u4FDD\u516C\u79EF\u91D1"),
                  h("th", { className: "hide-md" }, "\u4E2A\u7A0E"),
                  h("th", null, "")
                )),
                h("tbody", null, rows.map(renderRow))
              )
            )
          );
        }));
      }
      return h(
        "div",
        { className: "wbsal-page" },
        h(
          "div",
          { className: "wbsal-toolbar" },
          h(C.Field, { h, label: "\u5E74\u4EFD" }, h(
            "select",
            { className: "wbsal-input", value: filter.year, onChange: function(e) {
              setFilter(Object.assign({}, filter, { year: e.target.value }));
            } },
            yearOptions.map(function(value) {
              return h("option", { key: value || "all", value }, value ? value + " \u5E74" : "\u5168\u90E8\u5E74\u4EFD");
            })
          )),
          h(C.Field, { h, label: "\u7C7B\u578B" }, h(
            "select",
            { className: "wbsal-input", value: filter.cycle, onChange: function(e) {
              setFilter(Object.assign({}, filter, { cycle: e.target.value }));
            } },
            h("option", { value: "" }, "\u5168\u90E8"),
            h("option", { value: "monthly" }, "\u6708\u7ED3"),
            h("option", { value: "daily" }, "\u65E5\u7ED3")
          )),
          h(
            "div",
            { className: "wbsal-toolbar-end" },
            h("span", { className: "wbsal-toolbar-count" }, "\u5171 ", h("b", null, total), " \u7B14"),
            h(C.Btn, { h, kind: "primary", onClick: openCreate }, "\uFF0B \u8BB0\u4E00\u7B14")
          )
        ),
        h(C.Notice, { h, kind: msg && msg.kind, text: msg && !form ? msg.text : "" }),
        body,
        form ? renderModal() : null
      );
    };
  }
});

// packages/addons/lib/legacy-data.cjs
var require_legacy_data = __commonJS({
  "packages/addons/lib/legacy-data.cjs"(exports2, module2) {
    "use strict";
    function unwrap(r) {
      return r && r.result !== void 0 ? r.result : r;
    }
    function rowsOf(body) {
      if (!body) return [];
      if (Array.isArray(body)) return body;
      if (Array.isArray(body.rows)) return body.rows;
      if (Array.isArray(body.items)) return body.items;
      return [];
    }
    function textOf(value) {
      if (value === null || value === void 0) return "";
      return typeof value === "object" ? JSON.stringify(value) : String(value);
    }
    function columnsOf(rows) {
      if (!rows.length) return [];
      return Object.keys(rows[0]).map(function(name) {
        return { name, type: "TEXT", system: false };
      });
    }
    function tableNames(body) {
      var list = body && Array.isArray(body.tables) ? body.tables : [];
      return list.map(function(t) {
        if (typeof t === "string") return { name: t };
        return { name: t.name, count: t.count, columns: t.columns };
      }).filter(function(t) {
        return t.name;
      });
    }
    function compare(a, b) {
      if (typeof a === "number" && typeof b === "number") return a - b;
      var sa = textOf(a), sb = textOf(b);
      var na = Number(sa), nb = Number(sb);
      if (sa !== "" && sb !== "" && Number.isFinite(na) && Number.isFinite(nb)) return na - nb;
      return sa.localeCompare(sb, "zh-CN");
    }
    module2.exports = function createLegacyData(domain, options) {
      options = options || {};
      var paged = options.paged !== false;
      var maxRows = Math.max(1, Number(options.maxRows) || 2e3);
      var pageLimit = Math.min(200, maxRows);
      function tablesLoader(api) {
        return api.call(domain + ".dataTables").then(function(r) {
          if (r && r.ok === false) throw new Error(r.error || "dataTables failed");
          var body = unwrap(r);
          return { tables: tableNames(body) };
        });
      }
      function fetchAll(api, table) {
        var rows = [];
        var offset = 0;
        function next() {
          var args = { table, limit: pageLimit };
          if (paged) args.offset = offset;
          return api.call(domain + ".dataQuery", args).then(function(r) {
            if (r && r.ok === false) throw new Error(r.error || "dataQuery failed");
            var batch = rowsOf(unwrap(r));
            rows = rows.concat(batch);
            if (!paged || batch.length < pageLimit || rows.length >= maxRows) return rows.slice(0, maxRows);
            offset += batch.length;
            return next();
          });
        }
        return next();
      }
      function query(api, args) {
        return fetchAll(api, args.table).then(function(all) {
          var search = String(args.search || "").trim().toLowerCase();
          var filters = args.filters && typeof args.filters === "object" ? args.filters : {};
          var filterKeys = Object.keys(filters).slice(0, 20);
          var colNames = all.length ? Object.keys(all[0]) : [];
          var includeDeleted = args.includeDeleted === true;
          var rows = all.filter(function(row) {
            if (!includeDeleted && row.deleted_at) return false;
            if (search) {
              var hit = colNames.some(function(c) {
                return textOf(row[c]).toLowerCase().indexOf(search) >= 0;
              });
              if (!hit) return false;
            }
            return filterKeys.every(function(c) {
              return textOf(row[c]).toLowerCase().indexOf(textOf(filters[c]).toLowerCase()) >= 0;
            });
          });
          var sort = String(args.sort || "");
          var order = args.order === "asc" ? "asc" : "desc";
          if (sort && colNames.indexOf(sort) >= 0) {
            rows = rows.slice().sort(function(a, b) {
              var d = compare(a[sort], b[sort]);
              return order === "asc" ? d : -d;
            });
          }
          var pageSize = Math.max(1, Math.min(200, Number(args.pageSize) || 50));
          var total = rows.length;
          var pages = Math.max(1, Math.ceil(total / pageSize));
          var page = Math.max(1, Math.min(pages, Number(args.page) || 1));
          var start = (page - 1) * pageSize;
          var started = Date.now();
          return {
            table: args.table,
            columns: columnsOf(all),
            rows: rows.slice(start, start + pageSize),
            page,
            pageSize,
            pages,
            total,
            sort,
            order,
            search,
            filters,
            includeDeleted,
            queryMs: Math.max(0, Date.now() - started)
          };
        });
      }
      return { tablesLoader, query };
    };
  }
});

// packages/addons/lib/data-copy.cjs
var require_data_copy = __commonJS({
  "packages/addons/lib/data-copy.cjs"(exports2, module2) {
    "use strict";
    var COPY = {
      zh: {
        title: "\u6570\u636E",
        subtitle: "\u53EA\u8BFB\u6D4F\u89C8\u672C\u63D2\u4EF6\u8D1F\u8D23\u7684\u8868\uFF1B\u7CFB\u7EDF\u5217\u4E0E\u5DF2\u5220\u9664\u884C\u9ED8\u8BA4\u9690\u85CF",
        tables: "\u8868",
        rows: "\u884C",
        deleted: "\u5DF2\u5220\u9664",
        rowCount: "\u5171 {n} \u884C",
        deletedCount: "\u5176\u4E2D {n} \u884C\u5DF2\u5220\u9664",
        search: "\u641C\u7D22\u6240\u6709\u6587\u672C\u5217\u2026",
        pageSize: "\u6BCF\u9875",
        includeDeleted: "\u542B\u5DF2\u5220\u9664",
        showSystem: "\u7CFB\u7EDF\u5217",
        refresh: "\u5237\u65B0",
        loading: "\u8F7D\u5165\u4E2D\u2026",
        empty: "\u8FD9\u5F20\u8868\u8FD8\u6CA1\u6709\u6570\u636E",
        emptyTable: "\u6CA1\u6709\u53EF\u5C55\u793A\u7684\u8868",
        loadFail: "\u6570\u636E\u670D\u52A1\u4E0D\u53EF\u7528\uFF08\u63D2\u4EF6\u7248\u672C\u8FC7\u65E7\uFF1F\uFF09",
        retry: "\u91CD\u8BD5",
        queryFail: "\u67E5\u8BE2\u5931\u8D25\uFF1A",
        noRows: "\u6CA1\u6709\u5339\u914D\u7684\u884C",
        prev: "\u4E0A\u4E00\u9875",
        next: "\u4E0B\u4E00\u9875",
        pageInfo: "\u7B2C {page} / {pages} \u9875",
        jump: "\u8DF3\u8F6C",
        total: "\u5171 {n} \u884C",
        copied: "\u5DF2\u590D\u5236",
        copy: "\u590D\u5236",
        close: "\u5173\u95ED",
        drawerTitle: "{column} \xB7 \u7B2C {row} \u884C",
        nullText: "NULL",
        emptyText: "\u7A7A",
        yes: "\u662F",
        no: "\u5426",
        json: "JSON",
        queryTime: "{n} ms",
        sortAsc: "\u5347\u5E8F",
        sortDesc: "\u964D\u5E8F",
        filterCol: "\u7B5B\u9009\u2026",
        filterClear: "\u6E05\u9664\u7B5B\u9009",
        index: "\u8868\u7D22\u5F15",
        indexSub: "\u5F53\u524D\u9009\u4E2D\u8868\u7684\u7D22\u5F15\uFF08\u53EA\u8BFB\uFF09\uFF1B\u884C\u6570\u4E3A\u6240\u5C5E\u8868\u603B\u884C\u6570\uFF0C\u4E0D\u662F\u7D22\u5F15\u6761\u76EE\u6570",
        idxName: "\u7D22\u5F15\u540D",
        idxColumns: "\u5217",
        idxType: "\u7C7B\u578B",
        idxSource: "\u6765\u6E90",
        idxUnique: "\u552F\u4E00",
        idxNormal: "\u666E\u901A",
        idxAuto: "\u81EA\u52A8",
        idxCreated: "\u663E\u5F0F\u521B\u5EFA",
        idxCount: "\u5171 {n} \u4E2A\u7D22\u5F15",
        idxNoExtra: "\u8BE5\u8868\u9664\u4E3B\u952E\u5916\u6CA1\u6709\u989D\u5916\u7D22\u5F15",
        idxRowsHelp: "\u6240\u5C5E\u8868\u603B\u884C\u6570\uFF08\u542B\u5DF2\u5220\u9664\u884C\uFF09\uFF0C\u4E0D\u662F\u7D22\u5F15\u6761\u76EE\u6570",
        idxTable: "\u8868",
        idxRows: "\u884C\u6570",
        idxCols: "\u5217\u6570",
        idxKey: "\u4E3B\u952E",
        idxIndexes: "\u7D22\u5F15",
        idxLastWrite: "\u6700\u8FD1\u5199\u5165",
        idxNone: "\u65E0",
        idxEmpty: "\u5F53\u524D\u8868\u6CA1\u6709\u53EF\u7528\u7684\u7D22\u5F15\u7EDF\u8BA1",
        idxTables: "\u8868",
        idxAt: "\u7EDF\u8BA1\u65F6\u95F4"
      },
      en: {
        title: "Data",
        subtitle: "Read-only view of this plugin's tables; system and deleted rows are hidden by default",
        tables: "Tables",
        rows: "rows",
        deleted: "deleted",
        rowCount: "{n} rows",
        deletedCount: "{n} deleted",
        search: "Search all text columns\u2026",
        pageSize: "Rows",
        includeDeleted: "Deleted",
        showSystem: "System",
        refresh: "Refresh",
        loading: "Loading\u2026",
        empty: "This table has no rows yet",
        emptyTable: "No tables to show",
        loadFail: "Data service unavailable (plugin too old?)",
        retry: "Retry",
        queryFail: "Query failed: ",
        noRows: "No matching rows",
        prev: "Previous",
        next: "Next",
        pageInfo: "Page {page} / {pages}",
        jump: "Jump",
        total: "{n} rows",
        copied: "Copied",
        copy: "Copy",
        close: "Close",
        drawerTitle: "{column} \xB7 row {row}",
        nullText: "NULL",
        emptyText: "empty",
        yes: "Yes",
        no: "No",
        json: "JSON",
        queryTime: "{n} ms",
        sortAsc: "ascending",
        sortDesc: "descending",
        filterCol: "Filter\u2026",
        filterClear: "Clear filter",
        index: "Table index",
        indexSub: "Indexes of the selected table (read-only); rows are the table total, not index entries",
        idxName: "Index name",
        idxColumns: "Columns",
        idxType: "Type",
        idxSource: "Source",
        idxUnique: "Unique",
        idxNormal: "Normal",
        idxAuto: "Automatic",
        idxCreated: "Explicit",
        idxCount: "{n} indexes",
        idxNoExtra: "This table has no indexes other than its primary key",
        idxRowsHelp: "Total table rows (including deleted rows), not index entries",
        idxTable: "Table",
        idxRows: "Rows",
        idxCols: "Cols",
        idxKey: "Primary key",
        idxIndexes: "Indexes",
        idxLastWrite: "Last write",
        idxNone: "\u2014",
        idxEmpty: "No index statistics available for this table",
        idxTables: "Tables",
        idxAt: "Generated"
      }
    };
    module2.exports = COPY;
  }
});

// packages/addons/lib/visual-tokens.cjs
var require_visual_tokens = __commonJS({
  "packages/addons/lib/visual-tokens.cjs"(exports2, module2) {
    module2.exports = `
:where(.wbt-root,.wbi-root,.wbi-cfg,.wbt-data,.wbs-data,.wbg-data,.wbi-data,.wb-desc){--wb-radius-sm:8px;--wb-radius-card:12px;--wb-space-sm:8px;--wb-space-md:14px;--wb-border:var(--dsw-alias-border-l2,color-mix(in oklab,currentColor 16%,transparent));--wb-description-bg:color-mix(in oklab,var(--dsw-alias-brand-primary,#5b7fd6) 7%,transparent);--wb-description-line:color-mix(in oklab,var(--dsw-alias-brand-primary,#5b7fd6) 34%,transparent);--wb-motion:140ms;--wb-btn-bg:transparent;--wb-btn-hover-bg:color-mix(in oklab,currentColor 6%,transparent);--wb-btn-active-bg:color-mix(in oklab,currentColor 11%,transparent);--wb-btn-primary-bg:var(--dsw-alias-brand-primary,#2563eb);--wb-btn-primary-fg:var(--dsw-alias-label-primary-inverted,#fff);--wb-btn-danger-fg:var(--dsw-alias-state-error-primary,#b91c1c);--wb-btn-size-sm:32px;--wb-btn-focus:2px solid var(--dsw-alias-brand-primary,#2563eb);--wb-btn-focus-offset:2px}
.wb-desc{background:var(--wb-description-bg);border-left-color:var(--wb-description-line);border-radius:0 var(--wb-radius-sm) var(--wb-radius-sm) 0}
`;
  }
});

// packages/addons/lib/data-style.cjs
var require_data_style = __commonJS({
  "packages/addons/lib/data-style.cjs"(exports2, module2) {
    "use strict";
    module2.exports = function(DOMAIN, PREFIX) {
      var P = PREFIX + "-data";
      var CSS = [
        require_visual_tokens(),
        "." + P + "-search:has(.wbi-svg) input{padding-left:30px}." + P + "-search>.wbi-svg{position:absolute;left:10px;top:50%;transform:translateY(-50%)}",
        "." + P + "-btn{transition:background var(--wb-motion),border-color var(--wb-motion)}",
        "@media(max-width:480px){." + P + "-head>." + P + "-btn:has(.wbi-svg){width:32px;height:32px;padding:0;justify-content:center}." + P + "-head>." + P + "-btn:has(.wbi-svg) ." + P + "-btnlabel{display:none}}",
        "." + P + "{--cfg-line:var(--wb-border);--cfg-surface:var(--wb-surface,var(--dsw-alias-bg-layer-1,transparent));--cfg-muted:var(--dsw-alias-label-secondary,color-mix(in oklab,currentColor 62%,transparent));--cfg-faint:var(--dsw-alias-label-tertiary,color-mix(in oklab,currentColor 42%,transparent));--cfg-hover:var(--dsw-alias-interactive-bg-hover,color-mix(in oklab,currentColor 5%,transparent));display:grid;grid-template-columns:216px minmax(0,1fr);gap:16px;width:100%;min-width:0;color:inherit;font-size:13px;align-items:start}",
        "." + P + "-side{position:sticky;top:12px;display:flex;flex-direction:column;gap:3px;border:1px solid var(--cfg-line);border-radius:var(--wb-radius-card);background:var(--cfg-surface);padding:8px;box-shadow:0 1px 2px color-mix(in oklab,currentColor 3%,transparent)}",
        "." + P + "-sidetitle{display:flex;align-items:center;justify-content:space-between;padding:6px 10px 8px;font-size:11px;font-weight:660;letter-spacing:.6px;text-transform:uppercase;color:var(--cfg-faint)}",
        "." + P + "-stab{display:flex;flex-direction:column;gap:3px;align-items:stretch;border:1px solid transparent;background:transparent;border-radius:9px;padding:8px 10px;font:inherit;color:inherit;text-align:left;cursor:pointer;position:relative;transition:background .12s ease,border-color .12s ease}",
        "." + P + "-stab:hover{background:var(--cfg-hover)}",
        "." + P + "-stab:focus-visible{outline:2px solid var(--dsw-alias-brand-primary,currentColor);outline-offset:2px}",
        "." + P + "-stab.on{background:color-mix(in oklab,currentColor 6%,transparent);border-color:var(--cfg-line)}",
        "." + P + "-stab.on::before{content:'';position:absolute;left:-1px;top:9px;bottom:9px;width:2px;border-radius:2px;background:var(--dsw-alias-brand-primary,currentColor)}",
        "." + P + "-stabname{display:flex;align-items:center;gap:6px;font-size:12.5px;font-weight:600;line-height:1.4;min-width:0}",
        "." + P + "-stabname span:first-child{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
        "." + P + "-sidetable{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:10.5px;color:var(--cfg-muted);margin-top:3px;letter-spacing:.2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
        "." + P + "-sidecount{margin-left:auto;font-size:10.5px;font-variant-numeric:tabular-nums;color:var(--cfg-muted);background:color-mix(in oklab,currentColor 8%,transparent);border-radius:999px;padding:1px 7px;flex:none}",
        "." + P + "-main{display:flex;flex-direction:column;gap:10px;min-width:0;border:1px solid var(--cfg-line);border-radius:var(--wb-radius-card);background:var(--cfg-surface);padding:14px 16px 12px;box-shadow:0 1px 2px color-mix(in oklab,currentColor 3%,transparent)}",
        "." + P + "-head{display:flex;align-items:flex-start;gap:12px;flex-wrap:wrap}",
        "." + P + "-headmain{min-width:0;flex:1}",
        "." + P + "-head h2{margin:0;font-size:16px;font-weight:660;letter-spacing:.1px;display:flex;align-items:center;gap:8px;flex-wrap:wrap}",
        "." + P + "-code{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11px;font-weight:500;color:var(--cfg-muted);background:color-mix(in oklab,currentColor 6%,transparent);border-radius:6px;padding:2px 6px}",
        "." + P + "-sub{font-size:11.5px;color:var(--cfg-muted);line-height:1.55;margin-top:4px}",
        "." + P + "-toolbar{display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding:2px 0 4px}",
        "." + P + "-search{position:relative;flex:1;min-width:180px;max-width:340px}",
        "." + P + "-search input{width:100%;border:1px solid var(--cfg-line);background:var(--dsw-alias-bg-base,transparent);color:inherit;border-radius:9px;padding:8px 11px;font:inherit;font-size:12.5px;outline:none;transition:border-color .15s ease,box-shadow .15s ease}",
        "." + P + "-search input:hover{border-color:color-mix(in oklab,currentColor 28%,var(--cfg-line))}",
        "." + P + "-search input:focus{border-color:var(--dsw-alias-brand-primary,currentColor);box-shadow:0 0 0 3px color-mix(in oklab,var(--dsw-alias-brand-primary,currentColor) 14%,transparent)}",
        "." + P + "-select{border:1px solid var(--cfg-line);background:var(--dsw-alias-bg-base,transparent);color:inherit;border-radius:9px;padding:7px 10px;font:inherit;font-size:12px;outline:none}",
        "." + P + "-select:focus{border-color:var(--dsw-alias-brand-primary,currentColor);box-shadow:0 0 0 3px color-mix(in oklab,var(--dsw-alias-brand-primary,currentColor) 14%,transparent)}",
        "." + P + "-switch{position:relative;display:inline-flex;align-items:center;gap:7px;cursor:pointer;font-size:12px;color:var(--cfg-muted);user-select:none;padding:4px 2px}",
        "." + P + "-switch input{position:absolute;inset:0;width:100%;height:100%;margin:0;opacity:0;cursor:pointer}",
        "." + P + "-track{position:relative;width:34px;height:20px;border-radius:999px;background:color-mix(in oklab,currentColor 18%,transparent);transition:background .16s ease;flex:none}",
        "." + P + "-track::after{content:'';position:absolute;top:2px;left:2px;width:16px;height:16px;border-radius:50%;background:var(--dsw-alias-label-primary,currentColor);transition:transform .16s ease,background .16s ease}",
        "." + P + "-switch input:checked+." + P + "-track{background:var(--dsw-alias-brand-primary,currentColor)}",
        "." + P + "-switch input:checked+." + P + "-track::after{transform:translateX(14px);background:var(--dsw-alias-label-primary-inverted,var(--dsw-alias-bg-base))}",
        "." + P + "-switch input:focus-visible+." + P + "-track{outline:2px solid var(--dsw-alias-brand-primary,currentColor);outline-offset:2px}",
        "." + P + "-btn{display:inline-flex;align-items:center;gap:5px;border:1px solid var(--cfg-line);background:transparent;color:var(--cfg-muted);border-radius:8px;padding:6px 10px;font:inherit;font-size:11.5px;cursor:pointer;white-space:nowrap;transition:background .12s ease,color .12s ease}",
        "." + P + "-btn:hover{background:var(--cfg-hover);color:var(--dsw-alias-label-primary,inherit)}",
        "." + P + "-btn:focus-visible{outline:2px solid var(--dsw-alias-brand-primary,currentColor);outline-offset:2px}",
        "." + P + "-btn:disabled{opacity:.45;cursor:not-allowed}",
        "." + P + "-btn[aria-busy='true']{opacity:.6}",
        "." + P + "-tablewrap{overflow:auto;max-height:calc(100vh - 300px);border:1px solid var(--cfg-line);border-radius:11px;background:var(--dsw-alias-bg-base,transparent)}",
        "." + P + "-table{border-collapse:separate;border-spacing:0;width:max-content;min-width:100%;font-size:12.5px}",
        "." + P + "-table th{position:sticky;top:0;z-index:2;background:var(--cfg-surface);border-bottom:1px solid var(--cfg-line);padding:0;text-align:left;font-weight:600;white-space:nowrap}",
        "." + P + "-thbtn{display:flex;align-items:baseline;gap:6px;width:100%;border:0;background:transparent;color:inherit;font:inherit;font-size:11.5px;font-weight:660;letter-spacing:.2px;padding:9px 12px;cursor:pointer;text-align:left;white-space:nowrap}",
        "." + P + "-thbtn:hover{background:var(--cfg-hover)}",
        "." + P + "-thbtn:focus-visible{outline:2px solid var(--dsw-alias-brand-primary,currentColor);outline-offset:-2px}",
        "." + P + "-coltype{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:9.5px;font-weight:500;color:var(--cfg-faint);letter-spacing:.3px}",
        "." + P + "-sortmark{color:var(--dsw-alias-brand-primary,currentColor);font-size:10px}",
        "." + P + "-rownum{position:sticky;left:0;z-index:1;background:var(--cfg-surface);color:var(--cfg-faint);text-align:right;font-variant-numeric:tabular-nums;font-size:10.5px;padding:0 8px;width:1%;white-space:nowrap;border-right:1px solid color-mix(in oklab,currentColor 7%,transparent)}",
        "." + P + "-table thead ." + P + "-rownum{z-index:3}",
        "." + P + "-cell{padding:7px 12px;border-bottom:1px solid color-mix(in oklab,currentColor 6%,transparent);max-width:340px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;cursor:default;vertical-align:top}",
        "." + P + "-table tbody tr:hover ." + P + "-cell{background:var(--cfg-hover)}",
        "." + P + "-table tbody tr:nth-child(even) ." + P + "-cell,." + P + "-table tbody tr:nth-child(even) ." + P + "-rownum{background:color-mix(in oklab,currentColor 2.5%,transparent)}",
        "." + P + "-cell.num{text-align:right;font-variant-numeric:tabular-nums}",
        "." + P + "-cell.mono{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11.5px}",
        "." + P + "-cell.null{color:var(--cfg-faint);font-style:italic}",
        "." + P + "-cell.json .v{color:var(--dsw-alias-brand-primary,inherit)}",
        "." + P + "-tr.deleted ." + P + "-cell,." + P + "-tr.deleted ." + P + "-rownum{opacity:.55}",
        "." + P + "-tr.deleted ." + P + "-cell .v{text-decoration:line-through;text-decoration-color:color-mix(in oklab,currentColor 35%,transparent)}",
        "." + P + "-delbadge{display:inline-block;margin-left:6px;font-size:9.5px;line-height:1.5;padding:0 5px;border-radius:999px;background:color-mix(in oklab,var(--dsw-alias-state-error-primary,currentColor) 14%,transparent);color:var(--dsw-alias-state-error-primary,inherit);vertical-align:middle}",
        "." + P + "-foot{display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding-top:2px;font-size:11.5px;color:var(--cfg-muted)}",
        "." + P + "-grow{flex:1}",
        "." + P + "-pageinfo{font-variant-numeric:tabular-nums}",
        "." + P + "-jump{width:56px;border:1px solid var(--cfg-line);background:var(--dsw-alias-bg-base,transparent);color:inherit;border-radius:7px;padding:4px 7px;font:inherit;font-size:11.5px;text-align:right;outline:none}",
        "." + P + "-jump:focus{border-color:var(--dsw-alias-brand-primary,currentColor)}",
        "." + P + "-empty{border:1px dashed var(--cfg-line);border-radius:11px;padding:44px 16px;text-align:center;font-size:12.5px;color:var(--cfg-muted)}",
        "." + P + "-err{display:flex;align-items:center;gap:10px;flex-wrap:wrap;border:1px solid color-mix(in oklab,var(--dsw-alias-state-error-primary,currentColor) 32%,var(--cfg-line));border-radius:10px;padding:9px 12px;color:var(--dsw-alias-state-error-primary,inherit);font-size:12px;line-height:1.5}",
        "." + P + "-skwrap{display:flex;flex-direction:column;gap:1px;padding:2px}",
        "." + P + "-sk{height:26px;border-radius:4px;background:var(--dsw-alias-bg-skeleton,color-mix(in oklab,currentColor 6%,transparent));animation:" + PREFIX + "-data-pulse 1.4s ease-in-out infinite}",
        "@keyframes " + PREFIX + "-data-pulse{0%,100%{opacity:.6}50%{opacity:1}}",
        "." + P + "-toast{position:fixed;left:50%;bottom:26px;transform:translateX(-50%);z-index:40;background:var(--dsw-alias-bg-layer-1,var(--cfg-surface));border:1px solid var(--cfg-line);border-radius:999px;padding:7px 14px;font-size:12px;color:var(--dsw-alias-label-primary,inherit);box-shadow:0 6px 24px color-mix(in oklab,currentColor 18%,transparent)}",
        "." + P + "-mask{position:fixed;inset:0;z-index:30;background:color-mix(in oklab,currentColor 26%,transparent)}",
        "." + P + "-drawer{position:fixed;top:0;right:0;bottom:0;z-index:31;width:min(520px,92vw);display:flex;flex-direction:column;gap:12px;background:var(--dsw-alias-bg-layer-1,var(--cfg-surface));border-left:1px solid var(--cfg-line);box-shadow:-8px 0 28px color-mix(in oklab,currentColor 16%,transparent);padding:18px 20px}",
        "." + P + "-drawer h3{margin:0;font-size:14px;font-weight:660;display:flex;align-items:center;gap:8px;flex-wrap:wrap}",
        "." + P + "-drawer pre{margin:0;flex:1;overflow:auto;border:1px solid var(--cfg-line);border-radius:10px;background:var(--dsw-alias-bg-base,transparent);padding:12px 14px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12px;line-height:1.65;white-space:pre-wrap;word-break:break-word}",
        "." + P + "-drawerfoot{display:flex;gap:8px;justify-content:flex-end}",
        "." + P + "-sr{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}",
        "@media (max-width:900px){." + P + "{grid-template-columns:minmax(0,1fr)}." + P + "-side{position:static;flex-direction:row;flex-wrap:wrap;gap:6px;padding:6px}." + P + "-sidetitle{display:none}." + P + "-stab{padding:6px 10px;flex:none}." + P + "-sidecount{display:none}." + P + "-tablewrap{max-height:calc(100vh - 260px)}}",
        "@media (prefers-reduced-motion:reduce){." + P + " *,." + P + "-track,." + P + "-track::after,." + P + "-sk,." + P + "-drawer{transition:none;animation:none}}",
        "." + P + "-idxsub{font-size:11.5px;color:var(--cfg-muted);line-height:1.55}",
        "." + P + "-idxsum{display:flex;gap:16px;flex-wrap:wrap;font-size:11.5px;color:var(--cfg-muted)}",
        "." + P + "-idxsum b{font-weight:660;color:var(--dsw-alias-label-primary,inherit);font-variant-numeric:tabular-nums}",
        "." + P + "-idxtable{width:100%;table-layout:fixed}." + P + "-idxtable ." + P + "-cell{white-space:normal;overflow-wrap:anywhere;max-width:none}." + P + "-idxtable th:first-child{width:30%}." + P + "-idxtable th:nth-child(2){width:28%}",
        "." + P + "-idxtags{display:flex;flex-wrap:wrap;gap:4px;max-width:280px}",
        "." + P + "-idxchip{display:inline-block;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:10px;line-height:1.6;border-radius:999px;padding:0 7px;background:color-mix(in oklab,currentColor 7%,transparent);color:var(--cfg-muted);white-space:nowrap}",
        "." + P + "-idxchip.u{background:color-mix(in oklab,var(--dsw-alias-brand-primary,currentColor) 15%,transparent);color:var(--dsw-alias-brand-primary,inherit)}",
        "." + P + "-idxnone{color:var(--cfg-faint)}",
        "." + P + "-frow th{padding:0 8px 6px;border-bottom:1px solid var(--cfg-line)}",
        "." + P + "-fcell{position:relative;display:block;min-width:96px}",
        "." + P + "-finput{width:100%;box-sizing:border-box;border:1px solid transparent;border-radius:6px;background:color-mix(in oklab,currentColor 4%,transparent);color:inherit;font:inherit;font-size:11.5px;padding:3px 18px 3px 6px;min-width:0}",
        "." + P + "-finput:hover{background:color-mix(in oklab,currentColor 7%,transparent)}",
        "." + P + "-finput:focus{outline:none;border-color:var(--dsw-alias-brand-primary,currentColor);background:var(--cfg-surface)}",
        "." + P + "-fclear{position:absolute;right:2px;top:50%;transform:translateY(-50%);border:0;background:transparent;color:var(--cfg-muted);cursor:pointer;font-size:13px;line-height:1;padding:2px 4px;border-radius:4px}",
        "." + P + "-fclear:hover{color:inherit;background:var(--cfg-hover)}",
        "." + P + "-emptycell{padding:22px 12px;text-align:center;color:var(--cfg-muted)}",
        "." + P + " *{box-sizing:border-box}",
        "." + P + "-tabs{display:flex;gap:6px;border-bottom:1px solid var(--cfg-line);padding-bottom:9px}",
        "." + P + "-tabs [aria-selected=true]{background:var(--cfg-hover);color:inherit;font-weight:660}",
        "." + P + "-images{display:flex;gap:5px;align-items:center}",
        "." + P + "-images img{width:36px;height:36px;object-fit:cover;border-radius:5px}",
        "." + P + "-gallery{display:flex;flex-direction:column;gap:12px;overflow:auto;flex:1}",
        "." + P + "-gallery img{width:100%;height:auto;object-fit:contain;border-radius:8px}"
      ].join("\n");
      if (DOMAIN === "storage") {
        var buttons = "." + P + " :is(button)";
        CSS += buttons + "{border:none;background:var(--wb-btn-bg);min-height:var(--wb-btn-size-sm);min-width:var(--wb-btn-size-sm)}" + buttons + ":enabled:hover{background:var(--wb-btn-hover-bg)}" + buttons + ":enabled:active{background:var(--wb-btn-active-bg)}" + buttons + ":disabled{background:var(--wb-btn-bg);color:var(--cfg-muted)}" + buttons + ":focus-visible{outline:var(--wb-btn-focus);outline-offset:var(--wb-btn-focus-offset)}." + P + "-fcell:has(button) input{padding-right:34px}";
      }
      function injectCss() {
        if (typeof document === "undefined") return;
        var old = document.getElementById("wb-addon-" + DOMAIN + "-data-css");
        if (old) {
          old.textContent = CSS;
          return;
        }
        var style = document.createElement("style");
        style.id = "wb-addon-" + DOMAIN + "-data-css";
        style.setAttribute("data-wb-addon", "wb-addon-" + DOMAIN);
        style.textContent = CSS;
        document.head.appendChild(style);
      }
      return injectCss;
    };
  }
});

// packages/addons/lib/data-view.cjs
var require_data_view = __commonJS({
  "packages/addons/lib/data-view.cjs"(exports2, module2) {
    "use strict";
    var React = require("react");
    var h = React.createElement;
    var COPY = require_data_copy();
    module2.exports = function createDataView(options) {
      var DOMAIN = options.domain;
      function icon(name) {
        return options.Icon ? h(options.Icon, { name }) : null;
      }
      var P = options.prefix + "-data";
      var configView = { useConfig: options.useConfig };
      var columnHooks = options.columns || {};
      var injectCss = require_data_style()(DOMAIN, options.prefix);
      var CFG_FALLBACK = {
        "data.pageSize": 50,
        "data.showSystemColumns": false,
        "data.includeDeleted": false
      };
      var PAGE_SIZES = [10, 25, 50, 100, 200];
      function unwrap(r) {
        return r && r.result !== void 0 ? r.result : r;
      }
      function fmt(template, vars) {
        return String(template).replace(/\{(\w+)\}/g, function(m, key) {
          return vars[key] === void 0 ? m : String(vars[key]);
        });
      }
      function pad2(n) {
        return n < 10 ? "0" + n : String(n);
      }
      function timeText(ms) {
        var d = new Date(Number(ms));
        if (!Number.isFinite(d.getTime())) return String(ms);
        return d.getFullYear() + "-" + pad2(d.getMonth() + 1) + "-" + pad2(d.getDate()) + " " + pad2(d.getHours()) + ":" + pad2(d.getMinutes());
      }
      function looksJson(value) {
        var text = String(value).trim();
        if (!text || text[0] !== "{" && text[0] !== "[") return false;
        try {
          JSON.parse(text);
          return true;
        } catch (e) {
          return false;
        }
      }
      function rawText(value, col) {
        if (value === null || value === void 0) return "";
        return String(value);
      }
      function DataView(props) {
        var api = props.api;
        var lang = props.lang === "en" ? "en" : "zh";
        var t = Object.assign({}, COPY[lang], { indexSub: fmt(COPY[lang].indexSub, { tables: options.tables.join(" / "), domain: DOMAIN }) });
        var cfgWrap = configView.useConfig(api, CFG_FALLBACK);
        var cfg = cfgWrap.values;
        var tablesS = React.useState(null);
        var tables = tablesS[0], setTables = tablesS[1];
        var activeS = React.useState("");
        var active = activeS[0], setActive = activeS[1];
        var dataS = React.useState(null);
        var data = dataS[0], setData = dataS[1];
        var loadingS = React.useState(false);
        var loadingRows = loadingS[0], setLoadingRows = loadingS[1];
        var loadingTablesS = React.useState(true);
        var loadingTables = loadingTablesS[0], setLoadingTables = loadingTablesS[1];
        var errorS = React.useState("");
        var error = errorS[0], setError = errorS[1];
        var pageS = React.useState(1);
        var page = pageS[0], setPage = pageS[1];
        var sizeS = React.useState(0);
        var pageSize = sizeS[0], setPageSize = sizeS[1];
        var sortS = React.useState("");
        var sort = sortS[0], setSort = sortS[1];
        var orderS = React.useState("desc");
        var order = orderS[0], setOrder = orderS[1];
        var searchDraftS = React.useState("");
        var searchDraft = searchDraftS[0], setSearchDraft = searchDraftS[1];
        var searchS = React.useState("");
        var search = searchS[0], setSearch = searchS[1];
        var filterDraftS = React.useState({});
        var filterDraft = filterDraftS[0], setFilterDraft = filterDraftS[1];
        var filtersS = React.useState({});
        var filters = filtersS[0], setFilters = filtersS[1];
        var includeDeletedS = React.useState(null);
        var includeDeletedRaw = includeDeletedS[0], setIncludeDeleted = includeDeletedS[1];
        var showSystemS = React.useState(null);
        var showSystemRaw = showSystemS[0], setShowSystem = showSystemS[1];
        var drawerS = React.useState(null);
        var drawer = drawerS[0], setDrawer = drawerS[1];
        var toastS = React.useState("");
        var toast = toastS[0], setToast = toastS[1];
        var filtersKey = JSON.stringify(filters);
        var reqRef = React.useRef(0);
        var toastTimer = React.useRef(null);
        var refreshS = React.useState(0);
        function refresh() {
          loadTables();
          refreshS[1](function(n) {
            return n + 1;
          });
        }
        var indexReqRef = React.useRef(0);
        var indexS = React.useState(null);
        var index = indexS[0], setIndex = indexS[1];
        var indexBusyS = React.useState(false);
        var indexBusy = indexBusyS[0], setIndexBusy = indexBusyS[1];
        var cfgSize = Number(cfg["data.pageSize"]) || 50;
        var size = pageSize || (PAGE_SIZES.indexOf(cfgSize) >= 0 ? cfgSize : 50);
        var includeDeleted = includeDeletedRaw === null ? cfg["data.includeDeleted"] === true : includeDeletedRaw;
        var showSystem = showSystemRaw === null ? cfg["data.showSystemColumns"] === true : showSystemRaw;
        function say(text) {
          setToast(text);
          if (toastTimer.current) clearTimeout(toastTimer.current);
          toastTimer.current = setTimeout(function() {
            setToast("");
          }, 1600);
        }
        function loadTables() {
          setLoadingTables(true);
          Promise.resolve((options.tablesLoader || function(a) {
            return a.call(DOMAIN + ".dataTables");
          })(api)).then(function(r) {
            if (r && r.ok === false) throw new Error(r && r.error || t.loadFail);
            var body = unwrap(r);
            if (!body || !Array.isArray(body.tables)) throw new Error(t.loadFail);
            setTables(body.tables);
            setError("");
            if (!active && body.tables.length) setActive(body.tables[0].name);
          }).catch(function(e) {
            setError(String(e && e.message || e) || t.loadFail);
          }).then(function() {
            setLoadingTables(false);
          });
        }
        React.useEffect(function() {
          injectCss();
          loadTables();
          return function() {
            indexReqRef.current++;
            if (toastTimer.current) clearTimeout(toastTimer.current);
          };
        }, []);
        function selectTable(name) {
          if (name === active) return;
          reqRef.current++;
          setActive(name);
          setData(null);
          setDrawer(null);
          setError("");
          setLoadingRows(true);
          setPage(1);
          setSort("");
          setOrder("desc");
          setSearch("");
          setSearchDraft("");
          setFilterDraft({});
          setFilters({});
        }
        React.useEffect(function() {
          if (searchDraft === search) return void 0;
          var timer = setTimeout(function() {
            setSearch(searchDraft);
            setPage(1);
          }, 280);
          return function() {
            clearTimeout(timer);
          };
        }, [searchDraft]);
        React.useEffect(function() {
          if (JSON.stringify(filterDraft) === JSON.stringify(filters)) return void 0;
          var timer = setTimeout(function() {
            setFilters(filterDraft);
            setPage(1);
          }, 280);
          return function() {
            clearTimeout(timer);
          };
        }, [filterDraft]);
        React.useEffect(function() {
          if (!active || !cfgWrap.ready || index) return void 0;
          var req = ++reqRef.current;
          setLoadingRows(true);
          var args = { table: active, page, pageSize: size, order, includeDeleted };
          if (sort) args.sort = sort;
          if (search) args.search = search;
          if (Object.keys(filters).length) args.filters = filters;
          Promise.resolve((options.query || function(a, q) {
            return a.call(DOMAIN + ".dataQuery", q);
          })(api, args)).then(function(r) {
            if (req !== reqRef.current) return;
            if (r && r.ok === false) throw new Error(r && r.error || t.queryFail);
            var body = unwrap(r);
            if (!body) throw new Error(t.queryFail);
            setData(body);
            setError("");
            if (body.page !== page) setPage(body.page);
          }).catch(function(e) {
            if (req !== reqRef.current) return;
            setError(String(e && e.message || e) || t.queryFail);
          }).then(function() {
            if (req === reqRef.current) setLoadingRows(false);
          });
          return function() {
            reqRef.current++;
          };
        }, [active, page, size, sort, order, search, includeDeleted, cfgWrap.ready, filtersKey, refreshS[0], !!index]);
        React.useEffect(function() {
          if (!drawer) return void 0;
          function onKey(e) {
            if (e.key === "Escape") setDrawer(null);
          }
          document.addEventListener("keydown", onKey);
          return function() {
            document.removeEventListener("keydown", onKey);
          };
        }, [drawer]);
        var current = null;
        if (tables) {
          for (var i = 0; i < tables.length; i++) if (tables[i].name === active) current = tables[i];
        }
        function leaveIndex() {
          indexReqRef.current++;
          setIndex(null);
          setIndexBusy(false);
          setError("");
        }
        function loadIndex() {
          reqRef.current++;
          setError("");
          var req = ++indexReqRef.current;
          setIndex([]);
          setIndexBusy(true);
          Promise.resolve(api.call(DOMAIN + ".dataTables", { stats: true })).then(function(r) {
            if (req !== indexReqRef.current) return;
            if (r && r.ok === false) throw new Error(r.error || t.loadFail);
            var payload = unwrap(r) || {};
            var rows = (payload.tables || []).map(function(tb) {
              return { table: tb, stats: tb.stats || null };
            });
            setIndex(rows);
            setError("");
            setIndexBusy(false);
          }).catch(function(e) {
            if (req !== indexReqRef.current) return;
            setError(String(e.message || e));
            setIndex([]);
            setIndexBusy(false);
          });
        }
        function renderIndex() {
          var row = (index || []).filter(function(r) {
            return r.table.name === active;
          })[0];
          var tb = row ? row.table : current;
          var st = row && row.stats;
          var indexes = st ? st.indexes || [] : [];
          var hasExtra = indexes.some(function(ix) {
            return ix.origin !== "pk";
          });
          var count = st && st.rows !== void 0 ? st.rows : tb && tb.count;
          return h(
            "div",
            { className: P + "-idx" },
            h(
              "div",
              { className: P + "-head" },
              h(
                "div",
                { className: P + "-headmain" },
                h("h2", null, icon("database"), tableLabel(tb), h("span", { className: P + "-code" }, active)),
                h("div", { className: P + "-idxsub" }, t.indexSub)
              ),
              h("button", {
                type: "button",
                className: P + "-btn",
                "aria-label": t.refresh,
                title: t.refresh,
                "aria-busy": indexBusy ? "true" : "false",
                onClick: function() {
                  loadIndex();
                }
              }, icon("refresh"), h("span", { className: P + "-btnlabel" }, t.refresh))
            ),
            st ? h(
              "div",
              { className: P + "-idxsum" },
              h("span", null, t.idxRows, " ", h("b", null, String(count))),
              h("span", null, t.idxCols, " ", h("b", null, String(st.columnCount === void 0 ? (tb.columns || []).length : st.columnCount))),
              h("span", null, fmt(t.idxCount, { n: indexes.length }))
            ) : null,
            indexBusy ? options.Skeleton ? h(options.Skeleton, { lang, label: t.loading }) : h("div", { className: P + "-empty", role: "status", "aria-busy": "true" }, t.loading) : !st ? h("div", { className: P + "-empty" }, t.idxEmpty) : !hasExtra ? h("div", { className: P + "-empty" }, t.idxNoExtra) : h(
              "div",
              { className: P + "-tablewrap" },
              h(
                "table",
                { className: P + "-table " + P + "-idxtable" },
                h("thead", null, h(
                  "tr",
                  null,
                  [t.idxName, t.idxColumns, t.idxType, t.idxSource, t.idxRows].map(function(label) {
                    return h("th", { scope: "col", key: label }, h("span", { className: P + "-thbtn" }, label));
                  })
                )),
                h("tbody", null, indexes.map(function(ix) {
                  return h(
                    "tr",
                    { className: P + "-tr", key: ix.name },
                    h("td", { className: P + "-cell mono" }, ix.name),
                    h("td", { className: P + "-cell mono" }, (ix.columns || []).join(", ") || t.idxNone),
                    h("td", { className: P + "-cell" }, ix.origin === "pk" ? t.idxKey : ix.unique ? t.idxUnique : t.idxNormal),
                    h("td", { className: P + "-cell" }, /^sqlite_autoindex_/.test(ix.name) ? t.idxAuto : t.idxCreated),
                    h("td", { className: P + "-cell num", title: t.idxRowsHelp }, String(count))
                  );
                }))
              )
            )
          );
        }
        function tableLabel(tb) {
          if (!tb || !tb.label) return "";
          return lang === "en" ? tb.label.en || tb.label.zh : tb.label.zh || tb.label.en;
        }
        function colLabel(col) {
          if (!col.label) return col.name;
          return lang === "en" ? col.label.en || col.label.zh : col.label.zh || col.label.en;
        }
        function visibleColumns() {
          var cols = data && data.columns ? data.columns.map(function(col) {
            var hook = columnHooks[col.name];
            return hook && hook.kind ? Object.assign({}, col, { kind: hook.kind, type: hook.type || col.type }) : col;
          }) : [];
          return cols.filter(function(c) {
            return showSystem || !c.system;
          });
        }
        function toggleSort(name) {
          if (sort !== name) {
            setSort(name);
            setOrder("desc");
            return;
          }
          if (order === "desc") {
            setOrder("asc");
            return;
          }
          setSort("");
          setOrder("desc");
        }
        function ariaSort(name) {
          if (sort !== name) return "none";
          return order === "asc" ? "ascending" : "descending";
        }
        function copyCell(value) {
          var text = value === null || value === void 0 ? "" : String(value);
          try {
            if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text);
            else {
              var ta = document.createElement("textarea");
              ta.value = text;
              ta.style.position = "fixed";
              ta.style.opacity = "0";
              document.body.appendChild(ta);
              ta.select();
              document.execCommand("copy");
              document.body.removeChild(ta);
            }
            say(t.copied);
          } catch (e) {
          }
        }
        function cellText(col, value) {
          if (value === null || value === void 0) return null;
          if (col.kind === "bool") return value ? t.yes : t.no;
          if (col.kind === "timestamp") return timeText(value);
          return String(value);
        }
        function cellClass(col, value) {
          var cls = P + "-cell";
          if (value === null || value === void 0) return cls + " null";
          if (col.kind === "number") return cls + " num";
          if (col.kind === "id" || col.kind === "path") return cls + " mono";
          if (col.kind === "text" && looksJson(value)) return cls + " json";
          return cls;
        }
        function cellTitle(col, value) {
          if (value === null || value === void 0) return t.nullText;
          if (col.kind === "timestamp") return String(value);
          if (col.kind === "bool") return value ? "1" : "0";
          return String(value);
        }
        function renderCell(row, col) {
          var value = row[col.name];
          var hook = columnHooks[col.name];
          function openDetail() {
            setDrawer({ column: colLabel(col), name: col.name, row: (data.page - 1) * data.pageSize + row.__i + 1, value });
          }
          var text = cellText(col, value);
          var content;
          if (text === null) content = h("span", { className: "v" }, t.nullText);
          else if (text === "") content = h("span", { className: "v" }, '""');
          else content = h("span", { className: "v" }, text);
          if (hook && hook.render) content = hook.render({ value, row, col, lang, prefix: P, openDetail });
          return h("td", {
            key: col.name,
            className: cellClass(col, value),
            title: cellTitle(col, value),
            onClick: function() {
              copyCell(value);
            },
            onDoubleClick: openDetail
          }, content);
        }
        function activeFilterCount() {
          var n = 0;
          for (var k in filters) if (Object.prototype.hasOwnProperty.call(filters, k)) n++;
          return n;
        }
        function filterCell(col) {
          var val = filterDraft[col.name] === void 0 ? "" : filterDraft[col.name];
          return h(
            "th",
            { key: col.name, scope: "col", className: P + "-fth" },
            h(
              "span",
              { className: P + "-fcell" },
              h("input", {
                className: P + "-finput",
                type: "search",
                value: val,
                placeholder: t.filterCol,
                "aria-label": t.filterCol + " " + colLabel(col),
                title: colLabel(col) + " \xB7 " + t.filterCol,
                onChange: function(e) {
                  var v = e.target.value;
                  setFilterDraft(function(prev) {
                    var next = Object.assign({}, prev);
                    if (v) next[col.name] = v;
                    else delete next[col.name];
                    return next;
                  });
                }
              }),
              val ? h("button", {
                type: "button",
                className: P + "-fclear",
                title: t.filterClear,
                "aria-label": t.filterClear + " " + colLabel(col),
                onClick: function() {
                  setFilterDraft(function(prev) {
                    var next = Object.assign({}, prev);
                    delete next[col.name];
                    return next;
                  });
                }
              }, "\xD7") : null
            )
          );
        }
        function renderRows() {
          if (loadingRows && !data && options.Skeleton) return h(options.Skeleton, { lang, label: t.loading });
          if (loadingRows && !data) {
            return h(
              "div",
              { className: P + "-skwrap", "aria-busy": "true" },
              h("span", { className: P + "-sr" }, t.loading),
              [0, 1, 2, 3, 4, 5, 6, 7].map(function(i2) {
                return h("div", { key: i2, className: P + "-sk" });
              })
            );
          }
          if (error) {
            return h(
              "div",
              { className: P + "-err", role: "alert" },
              h("span", null, t.queryFail + error),
              h("button", { type: "button", className: P + "-btn", onClick: refresh }, t.retry)
            );
          }
          if (!data) return h("div", { className: P + "-empty" }, t.empty);
          var cols = visibleColumns();
          var rows = data.rows || [];
          var narrowing = !!search || activeFilterCount() > 0;
          return h(
            "div",
            { className: P + "-tablewrap" },
            h(
              "table",
              { className: P + "-table" },
              h(
                "thead",
                null,
                h(
                  "tr",
                  null,
                  h("th", { className: P + "-rownum", scope: "col" }, "#"),
                  cols.map(function(col) {
                    return h(
                      "th",
                      { key: col.name, scope: "col", "aria-sort": ariaSort(col.name) },
                      h(
                        "button",
                        {
                          type: "button",
                          className: P + "-thbtn",
                          title: colLabel(col) + " \xB7 " + col.type,
                          onClick: function() {
                            toggleSort(col.name);
                          }
                        },
                        h("span", null, colLabel(col)),
                        h("span", { className: P + "-coltype" }, String(col.type || "").toLowerCase()),
                        sort === col.name ? h("span", { className: P + "-sortmark", "aria-hidden": "true" }, order === "asc" ? "\u25B2" : "\u25BC") : null
                      )
                    );
                  })
                ),
                h(
                  "tr",
                  { className: P + "-frow" },
                  h("th", { className: P + "-rownum", scope: "col" }, ""),
                  cols.map(filterCell)
                )
              ),
              h("tbody", null, rows.length ? rows.map(function(row, idx) {
                row.__i = idx;
                var deleted = row.deleted_at !== null && row.deleted_at !== void 0;
                return h(
                  "tr",
                  { key: row.id || idx, className: P + "-tr" + (deleted ? " deleted" : "") },
                  h("td", { className: P + "-rownum" }, (data.page - 1) * data.pageSize + idx + 1),
                  cols.map(function(col) {
                    var cell = renderCell(row, col);
                    if (deleted && col.name === "id") {
                      return React.cloneElement(cell, { key: col.name }, cell.props.children, h("span", { className: P + "-delbadge" }, t.deleted));
                    }
                    return cell;
                  })
                );
              }) : h("tr", null, h("td", { className: P + "-emptycell", colSpan: cols.length + 1 }, narrowing ? t.noRows : t.empty)))
            )
          );
        }
        function renderFoot() {
          var pages = data ? data.pages : 1;
          var total = data ? data.total : 0;
          return h(
            "div",
            { className: P + "-foot" },
            h("span", null, fmt(t.total, { n: total })),
            h("span", { className: P + "-grow" }),
            h("button", { type: "button", className: P + "-btn", disabled: !data || page <= 1, onClick: function() {
              setPage(Math.max(1, page - 1));
            } }, "\u2039 " + t.prev),
            h("span", { className: P + "-pageinfo" }, fmt(t.pageInfo, { page: data ? data.page : 1, pages })),
            h("button", { type: "button", className: P + "-btn", disabled: !data || page >= pages, onClick: function() {
              setPage(Math.min(pages, page + 1));
            } }, t.next + " \u203A"),
            h("input", {
              className: P + "-jump",
              type: "number",
              min: 1,
              max: pages,
              "aria-label": t.jump,
              onKeyDown: function(e) {
                if (e.key === "Enter") {
                  var n = Math.floor(Number(e.target.value));
                  if (n >= 1) setPage(Math.min(pages, n));
                }
              }
            }),
            data && data.queryMs !== void 0 ? h("span", null, fmt(t.queryTime, { n: data.queryMs })) : null
          );
        }
        if (!tables && loadingTables && options.Skeleton) return h(options.Skeleton, { lang, label: t.loading });
        if (!tables && loadingTables) {
          return h("div", { className: P + "-skwrap", "aria-busy": "true" }, h("span", { className: P + "-sr" }, t.loading), [0, 1, 2, 3].map(function(i2) {
            return h("div", { key: i2, className: P + "-sk" });
          }));
        }
        if (!tables) {
          return h("div", { className: P + "-err", role: "alert" }, h("span", null, t.loadFail), h("button", { type: "button", className: P + "-btn", onClick: loadTables }, t.retry));
        }
        if (!tables.length) return h("div", { className: P + "-empty" }, t.emptyTable);
        return h(
          "div",
          { className: P },
          h(
            "div",
            { className: P + "-side" },
            h("div", { className: P + "-sidetitle" }, h("span", null, icon("table"), t.tables), h("span", null, String(tables.length))),
            tables.map(function(tb) {
              return h(
                "button",
                {
                  key: tb.name,
                  type: "button",
                  className: P + "-stab" + (tb.name === active ? " on" : ""),
                  "aria-pressed": tb.name === active,
                  onClick: function() {
                    selectTable(tb.name);
                  }
                },
                h(
                  "span",
                  { className: P + "-stabname" },
                  h("span", null, tableLabel(tb)),
                  h("span", { className: P + "-sidecount" }, tb.count === void 0 || tb.count === null ? "" : String(tb.count))
                ),
                h("span", { className: P + "-sidetable" }, tb.name)
              );
            })
          ),
          h(
            "div",
            { className: P + "-main" },
            h(
              "div",
              { className: P + "-tabs", role: "tablist", "aria-label": t.title },
              h("button", { type: "button", role: "tab", className: P + "-btn", "aria-selected": !index, onClick: leaveIndex }, icon("list"), lang === "en" ? "Row data" : "\u884C\u6570\u636E"),
              h("button", { type: "button", role: "tab", className: P + "-btn", "aria-selected": !!index, onClick: loadIndex }, icon("database"), t.index)
            ),
            index && error ? h("div", { className: P + "-err", role: "alert" }, error) : null,
            index ? renderIndex() : [
              h(
                "div",
                { className: P + "-head" },
                h(
                  "div",
                  { className: P + "-headmain" },
                  h("h2", null, icon("database"), tableLabel(current), h("span", { className: P + "-code" }, active)),
                  h(
                    "div",
                    { className: P + "-sub" },
                    current && data && data.total !== void 0 ? fmt(t.rowCount, { n: data.total }) : "",
                    current && current.deletedCount ? " \xB7 " + fmt(t.deletedCount, { n: current.deletedCount }) : "",
                    " \xB7 " + t.subtitle
                  )
                ),
                h("button", {
                  type: "button",
                  className: P + "-btn",
                  "aria-label": t.refresh,
                  title: t.refresh,
                  "aria-busy": loadingRows ? "true" : "false",
                  onClick: refresh
                }, icon("refresh"), h("span", { className: P + "-btnlabel" }, t.refresh))
              ),
              h(
                "div",
                { className: P + "-toolbar" },
                h(
                  "div",
                  { className: P + "-search" },
                  icon("search"),
                  h("input", {
                    type: "search",
                    value: searchDraft,
                    placeholder: t.search,
                    "aria-label": t.search,
                    onChange: function(e) {
                      setSearchDraft(e.target.value);
                    }
                  })
                ),
                h(
                  "label",
                  { className: P + "-switch" },
                  h("input", { type: "checkbox", checked: includeDeleted, onChange: function(e) {
                    setIncludeDeleted(e.target.checked);
                    setPage(1);
                  } }),
                  h("span", { className: P + "-track" }),
                  h("span", null, t.includeDeleted)
                ),
                h(
                  "label",
                  { className: P + "-switch" },
                  h("input", { type: "checkbox", checked: showSystem, onChange: function(e) {
                    setShowSystem(e.target.checked);
                  } }),
                  h("span", { className: P + "-track" }),
                  h("span", null, t.showSystem)
                ),
                h("span", { className: P + "-grow" }),
                h(
                  "label",
                  { style: { display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "11.5px", color: "var(--cfg-muted)" } },
                  h("span", null, t.pageSize),
                  h("select", {
                    className: P + "-select",
                    value: size,
                    onChange: function(e) {
                      setPageSize(Number(e.target.value));
                      setPage(1);
                    }
                  }, PAGE_SIZES.map(function(n) {
                    return h("option", { key: n, value: n }, String(n));
                  }))
                )
              ),
              renderRows(),
              renderFoot()
            ]
          ),
          drawer ? h(
            "div",
            null,
            h("div", { className: P + "-mask", onClick: function() {
              setDrawer(null);
            } }),
            h(
              "aside",
              { className: P + "-drawer", role: "dialog", "aria-modal": "true", "aria-label": drawer.column },
              h("h3", null, fmt(t.drawerTitle, { column: drawer.column, row: drawer.row }), h("span", { className: P + "-code" }, drawer.name)),
              columnHooks[drawer.name] && columnHooks[drawer.name].detail ? columnHooks[drawer.name].detail({ value: drawer.value, lang, prefix: P }) : h("pre", null, drawerText(drawer.value)),
              h(
                "div",
                { className: P + "-drawerfoot" },
                h("button", { type: "button", className: P + "-btn", onClick: function() {
                  copyCell(drawer.value);
                } }, t.copy),
                h("button", { type: "button", className: P + "-btn", onClick: function() {
                  setDrawer(null);
                } }, t.close)
              )
            )
          ) : null,
          toast ? h("div", { className: P + "-toast", role: "status" }, toast) : null
        );
      }
      function drawerText(value) {
        if (value === null || value === void 0) return "NULL";
        if (typeof value === "string" && looksJson(value)) {
          try {
            return JSON.stringify(JSON.parse(value), null, 2);
          } catch (e) {
            return value;
          }
        }
        if (typeof value === "object") {
          try {
            return JSON.stringify(value, null, 2);
          } catch (e) {
            return String(value);
          }
        }
        return String(value);
      }
      return { DataView, DOMAIN };
    };
  }
});

// packages/addons/salary/client/views/data.cjs
var require_data = __commonJS({
  "packages/addons/salary/client/views/data.cjs"(exports2, module2) {
    "use strict";
    var legacy = require_legacy_data()("salary", { paged: false });
    module2.exports = require_data_view()({
      domain: "salary",
      prefix: "wbsal",
      tables: ["salary_record"],
      useConfig: function(api, fallback) {
        return { values: fallback, ready: true };
      },
      tablesLoader: legacy.tablesLoader,
      query: legacy.query
    }).DataView;
  }
});

// packages/addons/lib/highlight.cjs
var require_highlight = __commonJS({
  "packages/addons/lib/highlight.cjs"(exports2, module2) {
    "use strict";
    module2.exports = function(React) {
      var h = React.createElement;
      function sourceOf(keyword) {
        var pattern = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        return pattern.replace(/[a-zA-Z]/g, function(letter) {
          return "[" + letter.toLowerCase() + letter.toUpperCase() + "]";
        });
      }
      return function createHighlight(prefix) {
        var className = String(prefix || "wb") + "-hit";
        function hit(rawText, rawKeyword) {
          var text = rawText == null ? "" : String(rawText);
          var keyword = rawKeyword == null ? "" : String(rawKeyword);
          if (!keyword) return text;
          var matcher, match, end = 0, parts = [];
          try {
            matcher = new RegExp(sourceOf(keyword), "g");
          } catch (error) {
            return text;
          }
          while (match = matcher.exec(text)) {
            if (match.index > end) parts.push(text.slice(end, match.index));
            parts.push(h("mark", { className, key: match.index }, match[0]));
            end = match.index + match[0].length;
            if (!match[0]) matcher.lastIndex += 1;
          }
          if (!parts.length) return text;
          if (end < text.length) parts.push(text.slice(end));
          return parts;
        }
        function Highlight(props) {
          return hit(props.text, props.keyword);
        }
        Highlight.hit = hit;
        return Highlight;
      };
    };
  }
});

// packages/addons/lib/action-schema-style.cjs
var require_action_schema_style = __commonJS({
  "packages/addons/lib/action-schema-style.cjs"(exports2, module2) {
    "use strict";
    module2.exports = function(PREFIX, DOMAIN) {
      var P = PREFIX + "-as";
      var CSS = [
        "." + P + "{display:flex;flex-direction:column;gap:12px;width:100%;min-width:0;font-size:13px;color:inherit}",
        "." + P + "-head{display:flex;align-items:center;gap:8px;flex-wrap:wrap}",
        "." + P + "-title{font-size:15px;font-weight:660;margin:0}",
        "." + P + "-badge{display:inline-flex;align-items:center;gap:4px;border:1px solid var(--wb-border,#e3e5e9);border-radius:999px;padding:1px 8px;font-size:11px;color:var(--dsw-alias-label-secondary,currentColor);font-variant-numeric:tabular-nums}",
        "." + P + "-mono{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11.5px}",
        "." + P + "-toolbar{display:flex;align-items:center;gap:8px;flex-wrap:wrap}",
        "." + P + "-search{position:relative;flex:1 1 220px;min-width:0;display:flex;align-items:center}",
        "." + P + "-search input{width:100%;border:1px solid var(--wb-border,#e3e5e9);border-radius:8px;background:var(--wb-surface,var(--dsw-alias-bg-layer-1,transparent));color:inherit;font:inherit;padding:6px 10px 6px 30px}",
        "." + P + "-search input:focus-visible{outline:2px solid var(--dsw-alias-brand-primary,#4f6ef7);outline-offset:1px}",
        "." + P + "-search .wbi-svg{position:absolute;left:10px;top:50%;transform:translateY(-50%);color:var(--dsw-alias-label-tertiary,inherit)}",
        "." + P + " select{border:1px solid var(--wb-border,#e3e5e9);border-radius:8px;background:var(--wb-surface,var(--dsw-alias-bg-layer-1,transparent));color:inherit;font:inherit;padding:6px 8px}",
        "." + P + " select:focus-visible{outline:2px solid var(--dsw-alias-brand-primary,#4f6ef7);outline-offset:1px}",
        "." + P + "-list{display:flex;flex-direction:column;gap:8px}",
        "." + P + "-card{border:1px solid var(--wb-border,#e3e5e9);border-radius:10px;padding:10px 12px;background:var(--wb-surface,var(--dsw-alias-bg-layer-1,transparent));display:flex;flex-direction:column;gap:8px;min-width:0}",
        "." + P + "-cardhead{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:start;gap:8px}",
        "." + P + "-cardmeta{display:flex;align-items:center;flex-wrap:wrap;gap:8px;min-width:0;min-height:24px}",
        "." + P + "-cardhead code{font-weight:640;overflow-wrap:anywhere;min-width:0}",
        "." + P + "-hintline{margin:0;color:var(--dsw-alias-label-tertiary,inherit);font-size:11.5px;line-height:1.5}",
        "." + P + "-toggle{display:inline-flex;align-items:center;gap:6px;min-height:24px;padding:0 2px;border:0;background:transparent;font:inherit;font-size:11.5px;color:var(--wb-muted);cursor:pointer}",
        "." + P + "-track{display:inline-flex;align-items:center;box-sizing:border-box;width:30px;height:18px;padding:2px;border:1px solid var(--wb-muted);border-radius:999px;background:var(--wb-surface);color:var(--wb-muted)}",
        "." + P + "-track::before{content:'';width:12px;height:12px;border-radius:50%;background:currentColor;transition:transform .15s ease}",
        "." + P + "-toggle[aria-checked=true] ." + P + "-track{background:var(--wb-accent);border-color:var(--wb-accent);color:var(--wb-card)}",
        "." + P + "-toggle[aria-checked=true] ." + P + "-track::before{transform:translateX(12px)}",
        "." + P + "-toggle:hover:not(:disabled) ." + P + "-track{outline:1px solid var(--wb-accent)}",
        "." + P + "-toggle:focus-visible{outline:2px solid var(--wb-accent);outline-offset:2px}",
        "." + P + "-toggle:disabled{opacity:.6;cursor:progress}",
        "@media(prefers-reduced-motion:reduce){." + P + "-track::before{transition:none}}",
        // 安全约束（不可放开）：用警示色描边，和可切换的开关区分开。
        "." + P + "-locked{border-color:var(--wb-warn,#b7791f);color:var(--wb-warn,#b7791f)}",
        "." + P + "-desc{margin:0;color:var(--dsw-alias-label-secondary,inherit);line-height:1.55;font-size:12.5px}",
        // 搜索命中：用品牌色透明度叠加而不是写死浅色，深浅主题都可读；继承文字颜色、不覆盖 ::selection。
        "." + P + " mark." + P + "-hit{background:color-mix(in oklab,var(--dsw-alias-brand-primary,#4f6ef7) 22%,transparent);color:inherit;border-radius:2px;padding:0;font:inherit;box-decoration-break:clone;-webkit-box-decoration-break:clone}",
        "." + P + "-table{width:100%;border-collapse:collapse;font-size:12px;table-layout:auto}",
        "." + P + "-table th{text-align:left;font-weight:620;font-size:11px;letter-spacing:.4px;text-transform:uppercase;color:var(--dsw-alias-label-tertiary,inherit);padding:4px 8px 4px 0;white-space:nowrap}",
        "." + P + "-table td{padding:4px 8px 4px 0;vertical-align:top;border-top:1px solid color-mix(in oklab,currentColor 8%,transparent);line-height:1.5}",
        "." + P + "-req{color:var(--dsw-alias-state-error-primary,#d9534f);font-weight:620}",
        "." + P + "-opt{color:var(--dsw-alias-label-tertiary,inherit)}",
        "." + P + "-none{color:var(--dsw-alias-label-tertiary,inherit);font-size:12px}",
        "." + P + "-example{position:relative;display:flex;flex-direction:column;gap:4px}",
        "." + P + "-examplehead{display:flex;align-items:center;justify-content:space-between;gap:8px}",
        "." + P + "-pre{margin:0;padding:8px 10px;border-radius:8px;background:var(--dsw-alias-bg-skeleton,#f2f3f5);color:inherit;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11.5px;line-height:1.5;overflow:auto;max-height:280px;white-space:pre-wrap;word-break:break-word}",
        "." + P + "-copy{border:1px solid var(--wb-border,#e3e5e9);border-radius:7px;background:transparent;color:inherit;font:inherit;font-size:11.5px;padding:2px 8px;cursor:pointer}",
        "." + P + "-copy:hover{background:var(--dsw-alias-interactive-bg-hover,color-mix(in oklab,currentColor 5%,transparent))}",
        "." + P + "-copy:focus-visible{outline:2px solid var(--dsw-alias-brand-primary,#4f6ef7);outline-offset:2px}",
        "." + P + " details>summary{cursor:pointer;font-size:11.5px;color:var(--dsw-alias-label-secondary,inherit);width:max-content}",
        "." + P + " details>summary:focus-visible{outline:2px solid var(--dsw-alias-brand-primary,#4f6ef7);outline-offset:2px}",
        "." + P + "-empty{padding:24px;text-align:center;border:1px dashed var(--wb-border,#e3e5e9);border-radius:10px;color:var(--dsw-alias-label-tertiary,inherit)}",
        "." + P + "-error{padding:12px;border:1px solid var(--dsw-alias-state-error-primary,#d9534f);border-radius:10px;color:var(--dsw-alias-state-error-primary,#d9534f);display:flex;gap:10px;align-items:center}",
        "." + P + "-toast{position:sticky;bottom:8px;align-self:flex-start;border-radius:999px;padding:3px 10px;background:var(--dsw-alias-bg-skeleton,#f2f3f5);font-size:11.5px}",
        "@media(max-width:600px){." + P + "-table thead{display:none}." + P + "-table td{display:block;border-top:0;padding:2px 0}." + P + "-table tr{display:block;border-top:1px solid color-mix(in oklab,currentColor 8%,transparent);padding:4px 0}}"
      ].join("\n");
      return function injectCss() {
        if (typeof document === "undefined") return;
        var id = "wb-addon-" + DOMAIN + "-actions-css";
        var old = document.getElementById(id);
        if (old) {
          old.textContent = CSS;
          return;
        }
        var style = document.createElement("style");
        style.id = id;
        style.setAttribute("data-wb-addon", "wb-addon-" + DOMAIN);
        style.textContent = CSS;
        document.head.appendChild(style);
      };
    };
  }
});

// packages/addons/lib/action-schema-view.cjs
var require_action_schema_view = __commonJS({
  "packages/addons/lib/action-schema-view.cjs"(exports2, module2) {
    "use strict";
    var React = require("react");
    var createHighlight = require_highlight()(React);
    var h = React.createElement;
    var COPY = {
      zh: {
        title: "Action",
        hint: "\u8FD0\u884C\u65F6\u6CE8\u518C \xB7 \u53EA\u8BFB",
        switchHint: "agent \u5F00\u5173\u843D\u672C\u673A\u3001\u5373\u6539\u5373\u751F\u6548\uFF1B\u754C\u9762\u64CD\u4F5C\u4E0D\u53D7\u5F71\u54CD\u3002",
        hostHint: "\u5BBF\u4E3B action \u7684 agent \u5F00\u5173\uFF1B\u6807\u300C\u4EC5\u754C\u9762 \xB7 \u5B89\u5168\u7EA6\u675F\u300D\u7684\u4E0D\u53EF\u653E\u5F00\u3002",
        agentSwitch: "agent \u53EF\u7528",
        agentLocked: "\u4EC5\u754C\u9762 \xB7 \u5B89\u5168\u7EA6\u675F",
        agentLockedHint: "\u8BE5 action \u53EA\u80FD\u5728\u754C\u9762\u6267\u884C\uFF08\u5B89\u5168\u7EA6\u675F\uFF09\uFF0Cagent \u5F00\u5173\u4E0D\u53EF\u653E\u5F00",
        agentSaving: "\u4FDD\u5B58\u4E2D\u2026",
        agentOnToast: "\u5DF2\u5141\u8BB8 agent \u8C03\u7528",
        agentOffToast: "\u5DF2\u7981\u6B62 agent \u8C03\u7528",
        agentFail: "\u5207\u6362 agent \u5F00\u5173\u5931\u8D25",
        domain: "\u57DF",
        versionLabel: "\u7248\u672C",
        shell: "\u5BBF\u4E3B",
        count: function(shown, total) {
          return shown + " / " + total + " \u4E2A action";
        },
        search: "\u641C\u7D22\u540D\u79F0\u3001\u63CF\u8FF0\u3001\u53C2\u6570\uFF08\u547D\u4E2D\u5904\u9AD8\u4EAE\uFF09",
        filterReq: "\u5FC5\u586B\u7B5B\u9009",
        all: "\u5168\u90E8",
        onlyRequired: "\u542B\u5FC5\u586B\u9879",
        onlyOptional: "\u65E0\u5FC5\u586B\u9879",
        filterType: "\u53C2\u6570\u7C7B\u578B",
        allTypes: "\u5168\u90E8\u7C7B\u578B",
        colName: "\u53C2\u6570",
        colType: "\u7C7B\u578B",
        colReq: "\u5FC5\u586B",
        colExtra: "\u9ED8\u8BA4 / \u679A\u4E3E / \u7EA6\u675F",
        colDesc: "\u8BF4\u660E",
        required: "\u5FC5\u586B",
        optional: "\u53EF\u9009",
        noParams: "\u65E0\u53C2\u6570",
        paramCount: function(n) {
          return n + " \u4E2A\u53C2\u6570";
        },
        examples: "\u793A\u4F8B",
        noExamples: "\u65E0\u793A\u4F8B",
        copy: "\u590D\u5236",
        copied: "\u5DF2\u590D\u5236",
        raw: "\u539F\u59CB JSON Schema",
        loading: "\u8F7D\u5165\u4E2D\u2026",
        loadFail: "\u8BFB\u53D6 action schema \u5931\u8D25",
        retry: "\u91CD\u8BD5",
        empty: "\u6CA1\u6709\u5339\u914D\u7684 action",
        emptyRegistry: "\u8BE5\u57DF\u6CA1\u6709\u6CE8\u518C action",
        envelope: "\u9ED8\u8BA4",
        enumLabel: "\u679A\u4E3E",
        range: "\u8303\u56F4",
        length: "\u957F\u5EA6",
        pattern: "\u6B63\u5219",
        format: "\u683C\u5F0F",
        items: "\u5143\u7D20\u6570"
      },
      en: {
        title: "Actions",
        hint: "runtime registry \xB7 read-only",
        switchHint: "The agent switch is stored locally and applies immediately; UI actions are unaffected.",
        hostHint: "Agent switch for host actions; items marked UI-only (security) cannot be opened up.",
        agentSwitch: "Agent callable",
        agentLocked: "UI only \xB7 security",
        agentLockedHint: "This action can only run from the UI (security constraint); the agent switch cannot be opened",
        agentSaving: "Saving\u2026",
        agentOnToast: "Agent calls allowed",
        agentOffToast: "Agent calls blocked",
        agentFail: "Failed to change the agent switch",
        domain: "Domain",
        versionLabel: "Version",
        shell: "Host",
        count: function(shown, total) {
          return shown + " / " + total + " actions";
        },
        search: "Search name, description, params (matches highlighted)",
        filterReq: "Required",
        all: "All",
        onlyRequired: "Has required",
        onlyOptional: "No required",
        filterType: "Param type",
        allTypes: "All types",
        colName: "Param",
        colType: "Type",
        colReq: "Required",
        colExtra: "Default / enum / constraints",
        colDesc: "Description",
        required: "required",
        optional: "optional",
        noParams: "No parameters",
        paramCount: function(n) {
          return n + " params";
        },
        examples: "Examples",
        noExamples: "No examples",
        copy: "Copy",
        copied: "Copied",
        raw: "Raw JSON Schema",
        loading: "Loading\u2026",
        loadFail: "Failed to read action schema",
        retry: "Retry",
        empty: "No matching action",
        emptyRegistry: "This domain has no registered action",
        envelope: "Default",
        enumLabel: "Enum",
        range: "Range",
        length: "Length",
        pattern: "Pattern",
        format: "Format",
        items: "Items"
      }
    };
    function typeLabel(schema) {
      if (!schema || typeof schema !== "object") return "";
      if (Array.isArray(schema.type)) return schema.type.join(" | ");
      if (typeof schema.type === "string") {
        if (schema.type === "array" && schema.items) {
          var inner = typeLabel(schema.items);
          return inner ? inner + "[]" : "array";
        }
        return schema.type;
      }
      if (Array.isArray(schema.oneOf)) return schema.oneOf.map(typeLabel).filter(Boolean).join(" | ");
      if (Array.isArray(schema.anyOf)) return schema.anyOf.map(typeLabel).filter(Boolean).join(" | ");
      return "";
    }
    function typeNames(schema) {
      var label = typeLabel(schema);
      if (!label) return [];
      return label.split("|").map(function(x) {
        return x.trim().replace(/\[\]$/, "");
      }).filter(Boolean);
    }
    function scalar(value) {
      if (typeof value === "string") return JSON.stringify(value);
      return String(value);
    }
    function extraText(schema, t) {
      if (!schema || typeof schema !== "object") return "";
      var parts = [];
      if (Object.prototype.hasOwnProperty.call(schema, "default")) {
        parts.push(t.envelope + " " + scalar(schema.default));
      }
      if (Array.isArray(schema.enum)) {
        parts.push(t.enumLabel + " " + schema.enum.map(scalar).join(" / "));
      }
      if (typeof schema.minimum === "number" || typeof schema.maximum === "number") {
        var lo = typeof schema.minimum === "number" ? schema.minimum : null;
        var hi = typeof schema.maximum === "number" ? schema.maximum : null;
        if (lo !== null && hi !== null) parts.push(t.range + " \u2265" + lo + " \u4E14 \u2264" + hi);
        else if (lo !== null) parts.push(t.range + " \u2265" + lo);
        else parts.push(t.range + " \u2264" + hi);
      }
      if (typeof schema.minLength === "number" || typeof schema.maxLength === "number") {
        parts.push(t.length + " " + (schema.minLength ?? 0) + "\u2013" + (schema.maxLength ?? "\u221E"));
      }
      if (typeof schema.minItems === "number" || typeof schema.maxItems === "number") {
        parts.push(t.items + " " + (schema.minItems ?? 0) + "\u2013" + (schema.maxItems ?? "\u221E"));
      }
      if (typeof schema.pattern === "string") parts.push(t.pattern + " " + schema.pattern);
      if (typeof schema.format === "string") parts.push(t.format + " " + schema.format);
      return parts.join(" \xB7 ");
    }
    function paramRows(action) {
      var input = action && action.input && typeof action.input === "object" ? action.input : {};
      var props = input.properties && typeof input.properties === "object" ? input.properties : {};
      var required = Array.isArray(input.required) ? input.required : [];
      return Object.keys(props).map(function(key) {
        var schema = props[key] && typeof props[key] === "object" ? props[key] : {};
        return {
          name: key,
          schema,
          type: typeLabel(schema),
          types: typeNames(schema),
          required: required.indexOf(key) >= 0,
          description: typeof schema.description === "string" ? schema.description : ""
        };
      });
    }
    module2.exports = function createActionSchemaView(options) {
      var raw = String(options.domain || "");
      var SOURCE = options.source === "actions.list" ? "actions.list" : "actionSchema";
      var DOMAIN = SOURCE === "actions.list" ? raw : raw.indexOf("wb-addon-") === 0 ? raw : "wb-addon-" + raw;
      var LIST_DOMAIN = options.listDomain ? String(options.listDomain) : DOMAIN;
      var prefix = options.prefix;
      var P = prefix + "-as";
      var Icon2 = options.Icon || null;
      var injectCss = require_action_schema_style()(prefix, DOMAIN);
      var Highlight = createHighlight(P);
      function icon(name, size) {
        return Icon2 ? h(Icon2, { name, size: size || 14 }) : null;
      }
      function plainCopy(text) {
        if (typeof document === "undefined") return;
        var area = document.createElement("textarea");
        area.value = text;
        area.setAttribute("readonly", "readonly");
        area.style.position = "fixed";
        area.style.opacity = "0";
        document.body.appendChild(area);
        area.select();
        try {
          document.execCommand("copy");
        } catch (e) {
        }
        document.body.removeChild(area);
      }
      function ActionSchemaView(props) {
        var lang = props.lang === "en" ? "en" : "zh";
        var t = COPY[lang];
        var api = props.api;
        var snapState = React.useState(null);
        var snap = snapState[0], setSnap = snapState[1];
        var errState = React.useState("");
        var err = errState[0], setErr = errState[1];
        var loadingState = React.useState(true);
        var loading = loadingState[0], setLoading = loadingState[1];
        var reloadState = React.useState(0);
        var reload = reloadState[0], setReload = reloadState[1];
        var queryState = React.useState("");
        var query = queryState[0], setQuery = queryState[1];
        var reqState = React.useState("all");
        var reqMode = reqState[0], setReqMode = reqState[1];
        var typeState = React.useState("");
        var typePick = typeState[0], setTypePick = typeState[1];
        var toastState = React.useState("");
        var toast = toastState[0], setToast = toastState[1];
        var savingState = React.useState("");
        var saving = savingState[0], setSaving = savingState[1];
        React.useEffect(function() {
          injectCss();
        }, []);
        React.useEffect(function() {
          var alive = true;
          setLoading(true);
          setErr("");
          var pending;
          var actionName = SOURCE === "actions.list" ? "actions.list" : DOMAIN.replace(/^wb-addon-/, "") + ".actionSchema";
          var callArgs = SOURCE === "actions.list" ? { detail: true, domain: LIST_DOMAIN } : void 0;
          if (api && typeof api.call === "function") {
            pending = Promise.resolve(api.call(actionName, callArgs)).then(function(r) {
              if (r && r.ok === false) return r;
              return r && r.result || r;
            });
          } else {
            pending = Promise.reject(new Error("no call api"));
          }
          Promise.resolve(pending).then(function(r) {
            if (!alive) return;
            if (!r || r.ok === false) {
              setSnap(null);
              setErr(String(r && (r.error || r.text) || t.loadFail));
            } else {
              setSnap(r);
            }
            setLoading(false);
          }, function(e) {
            if (!alive) return;
            setSnap(null);
            setErr(String(e && e.message || e || t.loadFail));
            setLoading(false);
          });
          return function() {
            alive = false;
          };
        }, [reload]);
        function copy(text) {
          var done = function() {
            setToast(t.copied);
          };
          if (typeof navigator !== "undefined" && navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
            navigator.clipboard.writeText(text).then(done, function() {
              plainCopy(text);
              done();
            });
            return;
          }
          plainCopy(text);
          done();
        }
        function setAgent(action, next) {
          var name = action.name;
          setSaving(name);
          setToast("");
          var fail = function(e) {
            setSaving("");
            setToast(t.agentFail + "\uFF1A" + String(e && e.message || e || ""));
          };
          var done = function(r) {
            setSaving("");
            var payload = r && typeof r === "object" && Object.prototype.hasOwnProperty.call(r, "result") ? r.result : r;
            if (r && r.ok === false) {
              setToast(t.agentFail + "\uFF1A" + String(r.error || r.text || ""));
              return;
            }
            var value = payload && typeof payload.agentEnabled === "boolean" ? payload.agentEnabled : next;
            setSnap(function(prev) {
              if (!prev || !Array.isArray(prev.actions)) return prev;
              return Object.assign({}, prev, {
                actions: prev.actions.map(function(a) {
                  if (!a || a.name !== name) return a;
                  return Object.assign({}, a, { agentEnabled: value });
                })
              });
            });
            setToast(value ? t.agentOnToast : t.agentOffToast);
          };
          if (!api || typeof api.call !== "function") {
            fail(new Error("no call api"));
            return;
          }
          Promise.resolve(api.call("actions.setAgentAccess", { action: name, agentEnabled: next })).then(done, fail);
        }
        var all = snap && Array.isArray(snap.actions) ? snap.actions.filter(function(a) {
          return a && a.domain === DOMAIN;
        }) : [];
        var info = snap && Array.isArray(snap.domains) ? snap.domains.filter(function(d) {
          return d && d.id === DOMAIN;
        })[0] || null : null;
        var typeOptions = [];
        all.forEach(function(a) {
          paramRows(a).forEach(function(row) {
            row.types.forEach(function(name) {
              if (typeOptions.indexOf(name) < 0) typeOptions.push(name);
            });
          });
        });
        typeOptions.sort();
        var kw = String(query || "").trim();
        var q = kw.toLowerCase();
        var visible = all.filter(function(a) {
          var rows = paramRows(a);
          if (q) {
            var hay = [a.name || "", a.description || ""].concat(rows.map(function(row) {
              return row.name + " " + row.type + " " + row.description;
            })).join(" ").toLowerCase();
            if (hay.indexOf(q) < 0) return false;
          }
          var hasRequired = rows.some(function(row) {
            return row.required;
          });
          if (reqMode === "required" && !hasRequired) return false;
          if (reqMode === "optional" && hasRequired) return false;
          if (typePick && !rows.some(function(row) {
            return row.types.indexOf(typePick) >= 0;
          })) return false;
          return true;
        });
        function paramRow(row) {
          var extra = extraText(row.schema, t);
          return h(
            "tr",
            { key: row.name },
            h("td", { className: P + "-mono" }, Highlight.hit(row.name, kw)),
            h("td", { className: P + "-mono" }, Highlight.hit(row.type, kw)),
            h("td", { className: row.required ? P + "-req" : P + "-opt" }, row.required ? t.required : t.optional),
            // extra（默认 / 枚举 / 约束）不在过滤 haystack 里，因此也不高亮，保持「显示即命中」口径。
            h("td", { className: P + "-mono" }, extra),
            h("td", null, Highlight.hit(row.description, kw))
          );
        }
        function agentSwitch(action) {
          if (action.agentLocked === true) {
            return h("span", {
              className: P + "-badge " + P + "-locked",
              title: t.agentLockedHint,
              "data-agent-locked": action.name
            }, t.agentLocked);
          }
          if (typeof action.agentEnabled !== "boolean") return null;
          var busy = saving === action.name;
          return h(
            "button",
            {
              className: P + "-toggle",
              "data-agent-row": action.name,
              type: "button",
              role: "switch",
              "aria-checked": action.agentEnabled,
              disabled: busy,
              "data-agent-toggle": action.name,
              "aria-label": t.agentSwitch + " \xB7 " + action.name,
              onClick: function() {
                setAgent(action, !action.agentEnabled);
              }
            },
            h("span", { className: P + "-track", "aria-hidden": true }),
            h("span", null, busy ? t.agentSaving : t.agentSwitch)
          );
        }
        function card(action) {
          var rows = paramRows(action);
          var examples = Array.isArray(action.examples) ? action.examples : [];
          return h(
            "div",
            { className: P + "-card", key: action.name },
            h(
              "div",
              { className: P + "-cardhead" },
              h(
                "div",
                { className: P + "-cardmeta" },
                h("code", { className: P + "-mono" }, Highlight.hit(action.name, kw)),
                h("span", { className: P + "-badge" }, rows.length ? t.paramCount(rows.length) : t.noParams),
                rows.some(function(row) {
                  return row.required;
                }) ? h("span", { className: P + "-badge " + P + "-req" }, t.required) : null
              ),
              agentSwitch(action)
            ),
            action.description ? h("p", { className: P + "-desc" }, Highlight.hit(action.description, kw)) : null,
            rows.length ? h(
              "table",
              { className: P + "-table" },
              h("thead", null, h(
                "tr",
                null,
                h("th", null, t.colName),
                h("th", null, t.colType),
                h("th", null, t.colReq),
                h("th", null, t.colExtra),
                h("th", null, t.colDesc)
              )),
              h("tbody", null, rows.map(paramRow))
            ) : h("div", { className: P + "-none" }, t.noParams),
            h(
              "div",
              { className: P + "-example" },
              h(
                "div",
                { className: P + "-examplehead" },
                h("span", { className: P + "-none" }, t.examples),
                examples.length ? h("button", {
                  type: "button",
                  className: P + "-copy",
                  "data-copy-example": action.name,
                  onClick: function() {
                    copy(JSON.stringify(examples.length === 1 ? examples[0] : examples, null, 2));
                  }
                }, t.copy) : null
              ),
              examples.length ? examples.map(function(example, index) {
                return h("pre", { className: P + "-pre", key: index }, JSON.stringify(example, null, 2));
              }) : h("div", { className: P + "-none" }, t.noExamples)
            ),
            h(
              "details",
              null,
              h("summary", null, t.raw),
              h("pre", { className: P + "-pre" }, JSON.stringify(action.input || {}, null, 2))
            )
          );
        }
        var body;
        if (loading) {
          body = h("div", { className: P + "-empty", role: "status" }, t.loading);
        } else if (err) {
          body = h(
            "div",
            { className: P + "-error", role: "alert" },
            h("span", null, t.loadFail + "\uFF1A" + err),
            h("button", { type: "button", className: P + "-copy", onClick: function() {
              setReload(reload + 1);
            } }, t.retry)
          );
        } else if (!all.length) {
          body = h("div", { className: P + "-empty" }, t.emptyRegistry);
        } else if (!visible.length) {
          body = h("div", { className: P + "-empty" }, t.empty);
        } else {
          body = h("div", { className: P + "-list" }, visible.map(card));
        }
        return h(
          "div",
          { className: P },
          h(
            "div",
            { className: P + "-head" },
            h("h3", { className: P + "-title" }, t.title),
            h("span", { className: P + "-badge" }, t.domain + " " + DOMAIN),
            info && info.version ? h("span", { className: P + "-badge" }, t.versionLabel + " v" + info.version) : null,
            snap && snap.shellVersion ? h("span", { className: P + "-badge" }, t.shell + " v" + snap.shellVersion) : null,
            h("span", { className: P + "-badge" }, t.count(visible.length, all.length)),
            h("span", { className: P + "-none" }, t.hint)
          ),
          h("p", { className: P + "-hintline" }, SOURCE === "actions.list" ? t.hostHint : t.switchHint),
          snap ? h(
            "div",
            { className: P + "-toolbar" },
            h(
              "label",
              { className: P + "-search" },
              icon("search", 14),
              h("input", {
                type: "search",
                value: query,
                placeholder: t.search,
                "aria-label": t.search,
                onChange: function(e) {
                  setQuery(e.target.value);
                }
              })
            ),
            h(
              "label",
              { className: P + "-none" },
              t.filterReq + " ",
              h(
                "select",
                { value: reqMode, "aria-label": t.filterReq, onChange: function(e) {
                  setReqMode(e.target.value);
                } },
                h("option", { value: "all" }, t.all),
                h("option", { value: "required" }, t.onlyRequired),
                h("option", { value: "optional" }, t.onlyOptional)
              )
            ),
            h(
              "label",
              { className: P + "-none" },
              t.filterType + " ",
              h(
                "select",
                { value: typePick, "aria-label": t.filterType, onChange: function(e) {
                  setTypePick(e.target.value);
                } },
                h("option", { value: "" }, t.allTypes),
                typeOptions.map(function(name) {
                  return h("option", { value: name, key: name }, name);
                })
              )
            )
          ) : null,
          body,
          toast ? h("div", { className: P + "-toast", role: "status" }, toast) : null
        );
      }
      return { ActionSchemaView, DOMAIN, typeLabel, paramRows };
    };
  }
});

// packages/addons/salary/client/views/actions.cjs
var require_actions = __commonJS({
  "packages/addons/salary/client/views/actions.cjs"(exports2, module2) {
    "use strict";
    module2.exports = require_action_schema_view()({
      domain: "wb-addon-salary",
      prefix: "wbsal"
    }).ActionSchemaView;
  }
});

// packages/addons/salary/client/client.src.cjs
(function() {
  var root = typeof window !== "undefined" ? window : null;
  var host = root && root.__WB_HOST__;
  if (!host || !host.react) {
    if (typeof console !== "undefined") console.error("[dsh-workbench-salary] \u5BBF\u4E3B\u524D\u7AEF\u672A\u5C31\u7EEA");
    module.exports = { name: "dsh-workbench-salary", inject: [], apply: function() {
    } };
    return;
  }
  var React = host.react;
  var h = host.h;
  var CSS = require_styles();
  var ICONS = {
    records: (init_wallet(), __toCommonJS(wallet_exports)).default,
    stats: (init_chart_column(), __toCommonJS(chart_column_exports)).default,
    data: (init_database(), __toCommonJS(database_exports)).default,
    actions: (init_list(), __toCommonJS(list_exports)).default
  };
  function Icon2(props) {
    var C = ICONS[props.name] || ICONS.records;
    return h(C, { size: props.size || 14, strokeWidth: 2, "aria-hidden": "true", className: "wbsal-svg" });
  }
  function tabIcon(name) {
    return function() {
      return h(Icon2, { name, size: 14 });
    };
  }
  function withProps(Inner, title) {
    return function Wrapped(props) {
      return h(Inner, { api: props.api, lang: props.lang === "en" ? "en" : "zh", h, React, title });
    };
  }
  function ensureStyles() {
    if (typeof document === "undefined" || !document.head) return;
    if (document.getElementById("wb-salary-style")) return;
    var style = document.createElement("style");
    style.id = "wb-salary-style";
    style.textContent = CSS;
    document.head.appendChild(style);
  }
  ensureStyles();
  host.registerAddon({
    id: "wb-addon-salary",
    version: "0.2.4",
    icon: (init_wallet(), __toCommonJS(wallet_exports)).default,
    views: [
      { id: "stats", icon: tabIcon("stats"), title: { zh: "\u7EDF\u8BA1", en: "Stats" }, component: withProps(require_stats(), "\u7EDF\u8BA1") },
      { id: "records", icon: tabIcon("records"), title: { zh: "\u8BB0\u5F55", en: "Records" }, component: withProps(require_records(), "\u8BB0\u5F55") },
      { id: "data", icon: tabIcon("data"), title: { zh: "\u6570\u636E", en: "Data" }, component: withProps(require_data(), "\u6570\u636E") },
      { id: "actions", icon: tabIcon("actions"), title: { zh: "Action", en: "Actions" }, component: withProps(require_actions(), "Action") }
    ]
  });
  module.exports = { name: "dsh-workbench-salary", inject: [], apply: function() {
  } };
})();
    return module.exports;
  },
});
