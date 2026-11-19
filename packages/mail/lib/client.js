// 由 scripts/build-addon-clients.mjs 生成；请修改对应 client/client.src.cjs 后重新构建。
window.__ModuleLoader__ = window.__ModuleLoader__ || { modules: {}, load: function (m) { this.modules[m.id] = m.factory; } };
window.__ModuleLoader__.load({
  id: "dsh-workbench-mail",
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

// packages/addons/mail/client/ui/styles.cjs
var require_styles = __commonJS({
  "packages/addons/mail/client/ui/styles.cjs"(exports2, module2) {
    "use strict";
    module2.exports = require_client_base_styles()("wbml").concat([
      ".wbml-page{display:flex;flex-direction:column;gap:12px;padding:16px;overflow:auto;height:100%;box-sizing:border-box}",
      ".wbml-input{border:1px solid var(--wb-border,#d1d5db);border-radius:7px;padding:6px 8px;font:inherit;background:var(--wb-surface,#fff);color:inherit;min-width:120px}",
      ".wbml-actions{display:flex;gap:8px;justify-content:flex-end;margin-top:8px}",
      ".wbml-btn:disabled{opacity:1;background:color-mix(in srgb,var(--wb-muted,#6b7280) 14%,transparent);color:var(--wb-muted,#6b7280);border:1px solid var(--wb-border,#e5e7eb);cursor:not-allowed}",
      "/* \u4E09\u680F\u5DE5\u4F5C\u533A\uFF1A\u8D26\u6237\u680F 300px + \u5217\u8868\u81EA\u9002\u5E94 (+ \u9605\u8BFB\u680F 360\u2013520px) */",
      ".wbml-page.is-split{height:100%;overflow:hidden;min-height:0}",
      ".wbml-layout{display:grid;grid-template-columns:300px minmax(0,1fr);gap:12px;flex:1;min-height:0;align-items:stretch}",
      ".wbml-layout.has-detail{grid-template-columns:300px minmax(0,1fr) minmax(360px,520px)}",
      ".wbml-rail{display:flex;flex-direction:column;gap:10px;min-height:0;overflow:auto}",
      ".wbml-rail-card{display:flex;flex-direction:column;gap:10px}",
      ".wbml-rail-title{font-size:12px;font-weight:600;color:var(--wb-muted,#6b7280)}",
      ".wbml-rail-stats{display:flex;gap:16px;font-size:12px;color:var(--wb-muted,#6b7280)}",
      ".wbml-rail-stats b{font-size:15px;font-weight:650;color:inherit;margin-right:2px}",
      ".wbml-rail-tip{font-size:12px;line-height:1.6;color:var(--wb-muted,#6b7280);padding:0 2px}",
      ".wbml-pane{display:flex;flex-direction:column;min-width:0;min-height:0;border:1px solid var(--wb-border,#e5e7eb);border-radius:10px;background:var(--wb-surface,#fff);overflow:hidden}",
      ".wbml-pane-head{position:sticky;top:0;z-index:2;display:flex;align-items:baseline;justify-content:space-between;gap:10px;padding:10px 12px;border-bottom:1px solid var(--wb-border,#eef0f3);background:var(--wb-surface,#fff)}",
      ".wbml-pane-head strong{font-size:13px}",
      ".wbml-state-box{display:flex;flex-direction:column;min-height:0;overflow:auto}",
      ".wbml-state{padding:32px 16px;text-align:center;font-size:13px;color:var(--wb-muted,#6b7280)}",
      ".wbml-state-error{color:var(--wb-danger,#b91c1c)}",
      ".wbml-list{display:flex;flex-direction:column;overflow:auto;min-height:0}",
      '.wbml-list-row{position:relative;display:grid;grid-template-columns:minmax(0,1fr) auto;grid-template-areas:"who time" "line line";gap:1px 10px;padding:8px 12px 8px 15px;border:0;border-bottom:1px solid var(--wb-line,#eef0f3);background:transparent;color:inherit;font:inherit;text-align:left;cursor:pointer;min-height:56px;box-sizing:border-box}',
      ".wbml-list-row:hover{background:var(--wb-surface,#f8fafc)}",
      ".wbml-list-row.on{background:color-mix(in srgb,var(--wb-accent,#2563eb) 12%,transparent)}",
      ".wbml-list-row.unread{font-weight:600}",
      '.wbml-list-row.unread::before{content:"";position:absolute;left:0;top:10px;bottom:10px;width:3px;border-radius:0 3px 3px 0;background:var(--wb-accent,#2563eb)}',
      ".wbml-who{grid-area:who;font-size:13px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
      ".wbml-line{grid-area:line;display:flex;align-items:baseline;gap:8px;min-width:0}",
      ".wbml-subject{font-size:13px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:0 1 auto;min-width:0}",
      ".wbml-snippet{font-size:12px;color:var(--wb-muted,#6b7280);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1 1 0;min-width:0}",
      ".wbml-time{grid-area:time;font-size:11px;color:var(--wb-muted,#6b7280);white-space:nowrap}",
      ".wbml-listpane{min-height:0}",
      ".wbml-detailpane{min-height:0}",
      ".wbml-detail-head{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;padding:10px 12px;border-bottom:1px solid var(--wb-border,#eef0f3);background:var(--wb-surface,#fff)}",
      ".wbml-detail-title{display:flex;flex-direction:column;gap:4px;min-width:0}",
      ".wbml-detail-title strong{font-size:14px;line-height:1.45;overflow-wrap:anywhere}",
      ".wbml-muted{font-size:12px;color:var(--wb-muted,#6b7280);overflow-wrap:anywhere}",
      ".wbml-detail-meta{display:flex;flex-wrap:wrap;gap:14px;padding:8px 12px;border-bottom:1px solid var(--wb-line,#eef0f3);font-size:12px;color:var(--wb-muted,#6b7280)}",
      ".wbml-body{flex:1;overflow:auto;min-height:0;white-space:pre-wrap;font:inherit;font-size:13px;line-height:1.7;margin:0;padding:12px}",
      /* 正文按需下载：加载/失败/附件与重拉入口 */
      ".wbml-detail-body{flex:1;display:flex;flex-direction:column;min-height:0;overflow:hidden}",
      ".wbml-body-wrap{flex:1;display:flex;flex-direction:column;gap:8px;min-height:0;overflow:auto;padding:12px}",
      ".wbml-body-wrap .wbml-body{flex:0 1 auto;overflow:visible;padding:0}",
      ".wbml-body-fail{display:flex;flex-direction:column;gap:8px;padding:8px 0}",
      ".wbml-body-fail-text{margin:0;font-size:13px;line-height:1.6;color:var(--wb-danger,#b91c1c)}",
      ".wbml-body-note{margin:0;font-size:12px;line-height:1.6;color:var(--wb-muted,#6b7280)}",
      ".wbml-body-tools{display:flex;gap:8px;align-items:center;flex-wrap:wrap}",
      ".wbml-attach{display:flex;flex-direction:column;gap:4px;border:1px dashed var(--wb-border,#d4d4d8);border-radius:8px;padding:8px 10px}",
      ".wbml-attach-title{font-size:12px;color:var(--wb-muted,#6b7280)}",
      ".wbml-attach-list{display:flex;flex-wrap:wrap;gap:6px}",
      ".wbml-attach-item{font-size:12px;line-height:1.5;padding:2px 8px;border-radius:999px;background:var(--wb-surface,#f8fafc);border:1px solid var(--wb-border,#e5e7eb);color:inherit;overflow-wrap:anywhere}",
      "@media (max-width:1180px){.wbml-layout.has-detail{grid-template-columns:256px minmax(0,1fr) minmax(320px,420px)}}",
      "@media (max-width:900px){.wbml-page.is-split{height:auto;overflow:visible}.wbml-layout,.wbml-layout.has-detail{display:flex;flex-direction:column;gap:12px;align-items:stretch;flex:0 0 auto}.wbml-rail{flex-direction:row;align-items:stretch;overflow:visible;flex:0 0 auto}.wbml-rail-card{flex:1;flex-direction:row;flex-wrap:wrap;align-items:center;gap:8px}.wbml-rail-card .wbml-rail-title{flex-basis:100%}.wbml-rail-tip{display:none}.wbml-rail-stats{flex:1 0 auto}.wbml-pane{flex:0 0 auto;max-height:none}.wbml-listpane{max-height:62vh}.wbml-detailpane{max-height:70vh}}",
      ".wbml-icon-btn{border:0;background:transparent;color:var(--wb-muted,#6b7280);font-size:16px;cursor:pointer;padding:2px 6px}",
      /* 服务商选择器 */
      ".wbml-chips{display:flex;flex-wrap:wrap;gap:6px}",
      ".wbml-chip{border:1px solid var(--wb-border,#d1d5db);background:var(--wb-surface,#fff);color:inherit;border-radius:999px;padding:4px 12px;font-size:12px;cursor:pointer}",
      ".wbml-chip:hover{border-color:var(--wb-accent,#2563eb)}",
      ".wbml-chip:focus-visible{outline:2px solid var(--wb-accent,#2563eb);outline-offset:1px}",
      ".wbml-chip.on{background:var(--wb-accent,#2563eb);border-color:var(--wb-accent,#2563eb);color:var(--wb-on-accent,#fff)}",
      /* 账户表单 */
      ".wbml-acct-form{display:flex;flex-direction:column;gap:10px;border:1px solid var(--wb-border,#e5e7eb);border-radius:10px;background:var(--wb-surface,#fff);padding:12px}",
      ".wbml-acct-head{display:flex;align-items:center;justify-content:space-between;gap:8px}",
      ".wbml-acct-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px}",
      ".wbml-acct-foot{display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap}",
      ".wbml-check{display:flex;align-items:center;gap:6px;font-size:12px;padding-top:18px}",
      ".wbml-hint-line{margin:0;font-size:11px;line-height:1.6;color:var(--wb-muted,#6b7280)}",
      /* 保险箱门禁 */
      ".wbml-gate-wrap{display:flex;flex-direction:column;gap:8px}",
      ".wbml-gate{border:1px solid var(--wb-warn,#f59e0b);border-radius:9px;padding:10px;display:flex;flex-direction:column;gap:8px;background:color-mix(in srgb, var(--wb-warn,#f59e0b) 8%, transparent)}",
      ".wbml-gate-title{font-size:13px;font-weight:650}",
      ".wbml-gate-text{margin:0;font-size:12px;line-height:1.6;color:var(--wb-muted,#6b7280)}",
      ".wbml-gate-row{max-width:320px}",
      ".wbml-gate > .wbml-btn{align-self:flex-start;padding:0 14px}",
      /* 账户卡片 */
      ".wbml-cards{display:flex;flex-direction:column;gap:8px}",
      ".wbml-cards .wbml-card{display:flex;align-items:flex-start;gap:12px;flex-wrap:wrap}",
      ".wbml-card-main{display:flex;flex-direction:column;gap:2px;min-width:0;flex:1}",
      ".wbml-card-title{font-size:13px;font-weight:650}",
      ".wbml-card-sub{font-size:12px}",
      ".wbml-card-meta{font-size:11px;color:var(--wb-muted,#6b7280)}",
      ".wbml-card-actions{display:flex;gap:6px;flex-wrap:wrap}",
      ".wbml-card-result{display:flex;align-items:center;gap:6px;flex:1 0 100%;font-size:12px;line-height:1.6}",
      ".wbml-acct-form > .wbml-btn{align-self:flex-start}",
      /* 基础 pill / danger 按钮用固定浅色，深色主题下自己按主题 token 重算一次 */
      ".wbml-card-result .wbml-pill.ok{background:color-mix(in srgb,var(--wb-ok,#047857) 16%,transparent);color:var(--wb-ok,#047857)}",
      ".wbml-card-result .wbml-pill.error{background:color-mix(in srgb,var(--wb-danger,#b91c1c) 16%,transparent);color:var(--wb-danger,#b91c1c)}",
      ".wbml-card-actions .wbml-btn.danger{color:var(--wb-danger,#b91c1c);border-color:color-mix(in srgb,var(--wb-danger,#b91c1c) 45%,transparent)}",
      /* 凭据选择器：触发器 + 下拉面板（面板里的列表复用共享 .wbck* 样式） */
      ".wbml-picker{position:relative;display:flex;flex-direction:column;gap:6px}",
      ".wbml-picker-trigger{display:flex;align-items:center;gap:8px;width:100%;box-sizing:border-box;font:inherit;font-size:13px;padding:7px 10px;border:1px solid var(--wb-border,#d4d4d8);border-radius:8px;background:var(--wb-surface);color:inherit;cursor:pointer;text-align:left}",
      ".wbml-picker-trigger:hover:enabled{border-color:var(--wb-accent)}",
      ".wbml-picker-trigger:focus-visible{outline:2px solid var(--wb-accent);outline-offset:1px}",
      ".wbml-picker-trigger.is-set{font-weight:560}",
      ".wbml-picker-trigger.is-missing{border-color:var(--wb-warn,#b45309)}",
      ".wbml-picker-trigger:disabled{opacity:.6;cursor:not-allowed}",
      ".wbml-picker-label{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
      ".wbml-picker-caret{flex:none;font-size:11px;color:var(--wb-muted,#6b7280)}",
      ".wbml-picker-panel{margin-top:2px;padding:8px;max-height:320px;overflow:auto;border:1px solid var(--wb-border,#d4d4d8);border-radius:10px;background:var(--wb-card)}",
      ".wbml-picker-foot{font-size:11px;color:var(--wb-muted,#6b7280);text-align:right;padding:4px 2px 0}",
      ".wbml-picker-empty{display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:12px;color:var(--wb-muted,#6b7280);padding:6px 2px 0}",
      ".wbml-picker-warn{margin:0;font-size:12px;color:var(--wb-warn,#b45309)}",
      ".wbml-picker-note{margin:0;font-size:12px;line-height:1.6;color:var(--wb-muted,#6b7280);border:1px dashed var(--wb-border,#d4d4d8);border-radius:8px;padding:8px 10px}"
    ]).join("\n");
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

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/mail.mjs
var mail_exports = {};
__export(mail_exports, {
  __iconData: () => __iconData,
  default: () => Mail
});
var __iconData, Mail;
var init_mail = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/mail.mjs"() {
    init_createLucideIcon();
    __iconData = {
      name: "mail",
      size: 24,
      node: [
        ["path", { d: "m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7", key: "132q7q" }],
        ["rect", { x: "2", y: "4", width: "20", height: "16", rx: "2", key: "izxlao" }]
      ]
    };
    __iconData.node;
    Mail = createLucideIcon(__iconData);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/send.mjs
var send_exports = {};
__export(send_exports, {
  __iconData: () => __iconData2,
  default: () => Send
});
var __iconData2, Send;
var init_send = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/send.mjs"() {
    init_createLucideIcon();
    __iconData2 = {
      name: "send",
      size: 24,
      node: [
        [
          "path",
          {
            d: "M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",
            key: "1ffxy3"
          }
        ],
        ["path", { d: "m21.854 2.147-10.94 10.939", key: "12cjpa" }]
      ]
    };
    __iconData2.node;
    Send = createLucideIcon(__iconData2);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/users.mjs
var users_exports = {};
__export(users_exports, {
  __iconData: () => __iconData3,
  default: () => Users
});
var __iconData3, Users;
var init_users = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/users.mjs"() {
    init_createLucideIcon();
    __iconData3 = {
      name: "users",
      size: 24,
      node: [
        ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
        ["path", { d: "M16 3.128a4 4 0 0 1 0 7.744", key: "16gr8j" }],
        ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87", key: "kshegd" }],
        ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
      ]
    };
    __iconData3.node;
    Users = createLucideIcon(__iconData3);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/database.mjs
var database_exports = {};
__export(database_exports, {
  __iconData: () => __iconData4,
  default: () => Database
});
var __iconData4, Database;
var init_database = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/database.mjs"() {
    init_createLucideIcon();
    __iconData4 = {
      name: "database",
      size: 24,
      node: [
        ["ellipse", { cx: "12", cy: "5", rx: "9", ry: "3", key: "msslwz" }],
        ["path", { d: "M3 5V19A9 3 0 0 0 21 19V5", key: "1wlel7" }],
        ["path", { d: "M3 12A9 3 0 0 0 21 12", key: "mv7ke4" }]
      ]
    };
    __iconData4.node;
    Database = createLucideIcon(__iconData4);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/list.mjs
var list_exports = {};
__export(list_exports, {
  __iconData: () => __iconData5,
  default: () => List
});
var __iconData5, List;
var init_list = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/list.mjs"() {
    init_createLucideIcon();
    __iconData5 = {
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
    __iconData5.node;
    List = createLucideIcon(__iconData5);
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

// packages/addons/mail/client/ui/common.cjs
var require_common = __commonJS({
  "packages/addons/mail/client/ui/common.cjs"(exports2, module2) {
    "use strict";
    module2.exports = require_client_common()("wbml");
  }
});

// packages/addons/mail/client/views/messages.cjs
var require_messages = __commonJS({
  "packages/addons/mail/client/views/messages.cjs"(exports2, module2) {
    "use strict";
    module2.exports = function Messages(props) {
      var h = props.h, React = props.React, api = props.api;
      var C = require_common();
      var accounts = C.useLoad(React, api, "mail.accountList", {}, []);
      var accountId = React.useState("");
      var list = C.useLoad(React, api, "mail.messageList", { accountId: accountId[0] || void 0, limit: 50 }, [accountId[0]]);
      var sel = React.useState(null);
      var msg = React.useState(null);
      var bodyState = React.useState({ loading: false, error: "", data: null });
      var accs = accounts.data && accounts.data.items || [];
      function loadBody(m, force) {
        if (!m) return;
        bodyState[1]({ loading: true, error: "", data: null });
        C.call(api, "mail.messageBody", { id: m.id, force: !!force }).then(function(r) {
          if (r && r.ok === false) bodyState[1]({ loading: false, error: r.message || "\u6B63\u6587\u4E0B\u8F7D\u5931\u8D25", data: r });
          else bodyState[1]({ loading: false, error: "", data: r || null });
        }).catch(function(e) {
          bodyState[1]({ loading: false, error: C.errText(e), data: null });
        });
      }
      function open(m) {
        bodyState[1]({ loading: false, error: "", data: null });
        C.call(api, "mail.messageGet", { id: m.id }).then(function(d) {
          sel[1](d);
          loadBody(d);
        }).catch(function(e) {
          msg[1]({ kind: "error", text: C.errText(e) });
        });
        if (isUnread(m)) C.call(api, "mail.messageMarkRead", { id: m.id }).then(function() {
          list.refresh();
        }).catch(function() {
        });
      }
      function sync() {
        if (!accountId[0]) return;
        C.call(api, "mail.sync", { id: accountId[0], limit: 20 }).then(function(r) {
          msg[1]({ kind: "ok", text: "\u6293\u53D6 " + r.fetched + " \u5C01\uFF0C\u65B0\u589E " + r.inserted });
          list.refresh();
        }).catch(function(e) {
          msg[1]({ kind: "error", text: C.errText(e) });
        });
      }
      function isUnread(m) {
        return !/\\Seen/.test(String(m && m.flags || ""));
      }
      function senderLabel(m) {
        var name = m && m.fromName ? String(m.fromName).trim() : "";
        var addr = m && m.from ? String(m.from).trim() : "";
        if (name && name !== addr) return name;
        return addr || "\u672A\u77E5\u53D1\u4EF6\u4EBA";
      }
      function senderDetail(m) {
        var name = m && m.fromName ? String(m.fromName).trim() : "";
        var addr = m && m.from ? String(m.from).trim() : "";
        if (name && addr && name !== addr) return name + " <" + addr + ">";
        return addr || name || "\u672A\u77E5\u53D1\u4EF6\u4EBA";
      }
      function accountName(id) {
        if (!id) return "\u5168\u90E8\u8D26\u6237";
        var hit = accs.filter(function(a) {
          return a.id === id;
        })[0];
        return hit ? hit.name : "\u5168\u90E8\u8D26\u6237";
      }
      function sizeText(n) {
        var v = Number(n) || 0;
        if (v >= 1024 * 1024) return (v / (1024 * 1024)).toFixed(1) + " MB";
        if (v >= 1024) return Math.round(v / 1024) + " KB";
        return v + " B";
      }
      function attachmentsOf(current2, data) {
        var rows = data && data.attachments || current2 && current2.attachments || [];
        if (!rows.length) return null;
        return h(
          "div",
          { className: "wbml-attach" },
          h("span", { className: "wbml-attach-title" }, "\u6536\u4EF6\u7BB1\u91CC\u7684 " + rows.length + " \u4E2A\u9644\u4EF6\uFF08\u53EA\u5217\u6587\u4EF6\u540D\u4E0E\u5927\u5C0F\uFF0C\u4E0D\u4E0B\u8F7D\u5185\u5BB9\uFF09"),
          h("div", { className: "wbml-attach-list" }, rows.map(function(a, i) {
            return h("span", { key: a.id || a.filename + i, className: "wbml-attach-item", title: a.mime || "" }, String(a.filename || "\u672A\u547D\u540D\u9644\u4EF6") + (a.size ? " \xB7 " + sizeText(a.size) : ""));
          }))
        );
      }
      function bodyNode(current2) {
        var st = bodyState[0];
        if (st.loading) return h("div", { className: "wbml-state" }, "\u6B63\u6587\u4E0B\u8F7D\u4E2D\u2026");
        if (st.error) {
          return h(
            "div",
            { className: "wbml-body-fail" },
            h("p", { className: "wbml-body-fail-text" }, "\u6B63\u6587\u4E0B\u8F7D\u5931\u8D25\uFF1A" + st.error),
            h(
              "div",
              { className: "wbml-body-tools" },
              h(C.Btn, { h, kind: "primary", onClick: function() {
                loadBody(current2, true);
              } }, "\u91CD\u8BD5")
            )
          );
        }
        var data = st.data || {};
        var text = String(data.body || current2.body || "").trim();
        var attach = attachmentsOf(current2, data);
        if (!text) {
          return h(
            "div",
            { className: "wbml-body-wrap" },
            h("div", { className: "wbml-state" }, "\u8FD9\u5C01\u90AE\u4EF6\u6CA1\u6709\u53EF\u8BFB\u7684\u6B63\u6587\uFF1B\u53EF\u4EE5\u70B9\u300C\u91CD\u65B0\u4E0B\u8F7D\u6B63\u6587\u300D\u518D\u8BD5\u4E00\u6B21\u3002"),
            attach
          );
        }
        return h(
          "div",
          { className: "wbml-body-wrap" },
          h("pre", { className: "wbml-body" }, text),
          data.truncated ? h("p", { className: "wbml-body-note" }, "\u6B63\u6587\u8F83\u957F\uFF0C\u5DF2\u622A\u65AD\u663E\u793A\u3002") : null,
          attach,
          h(
            "div",
            { className: "wbml-body-tools" },
            h(C.Btn, { h, onClick: function() {
              loadBody(current2, true);
            } }, "\u91CD\u65B0\u4E0B\u8F7D\u6B63\u6587")
          )
        );
      }
      var items = list.data && list.data.items || [];
      var unread = items.filter(isUnread).length;
      var current = sel[0];
      var canSync = !!accountId[0];
      var body = list.loading ? h("div", { className: "wbml-state" }, "\u52A0\u8F7D\u4E2D\u2026") : list.error ? h("div", { className: "wbml-state wbml-state-error" }, list.error) : items.length === 0 ? h("div", { className: "wbml-state" }, accs.length ? "\u6CA1\u6709\u672C\u5730\u90AE\u4EF6\uFF1B\u5728\u5DE6\u4FA7\u70B9\u300C\u540C\u6B65\u6536\u4EF6\u7BB1\u300D\u6293\u6700\u8FD1 20 \u5C01\u3002" : "\u8FD8\u6CA1\u6709\u8D26\u6237\uFF0C\u5148\u5230\u300C\u8D26\u6237\u300D\u9875\u6DFB\u52A0\u4E00\u4E2A\u3002") : h("div", { className: "wbml-list" }, items.map(function(m) {
        var on = current && current.id === m.id;
        return h(
          "button",
          {
            key: m.id,
            type: "button",
            title: senderDetail(m) + " \xB7 " + (m.subject || "(\u65E0\u4E3B\u9898)"),
            className: "wbml-list-row" + (on ? " on" : "") + (isUnread(m) ? " unread" : ""),
            onClick: function() {
              open(m);
            }
          },
          h("span", { className: "wbml-who" }, senderLabel(m)),
          h("span", { className: "wbml-time" }, C.fmtTime(m.dateAt, props.lang)),
          h(
            "div",
            { className: "wbml-line" },
            h("span", { className: "wbml-subject" }, m.subject || "(\u65E0\u4E3B\u9898)"),
            m.preview ? h("span", { className: "wbml-snippet" }, m.preview) : null
          )
        );
      }));
      return h(
        "div",
        { className: "wbml-page is-split wb-fill" },
        h("div", { className: "wbml-head" }, h("div", null, h("h2", null, "\u90AE\u4EF6"), h("p", { className: "wbml-sub" }, "\u672C\u5730\u526F\u672C\uFF1B\u4FE1\u5934\u968F\u540C\u6B65\u62C9\u53D6\uFF0C\u6B63\u6587\u70B9\u5F00\u65F6\u4E0B\u8F7D\uFF0C\u5BC6\u7801\u4FDD\u5B58\u5728\u4FDD\u9669\u7BB1\u3002")), h(
          "div",
          { className: "wbml-row" },
          h(C.Btn, { h, onClick: list.refresh }, "\u5237\u65B0")
        )),
        h(C.Notice, { h, text: msg[0] && msg[0].text, kind: msg[0] && msg[0].kind }),
        accounts.error ? h(C.Notice, { h, kind: "error", text: accounts.error }) : null,
        h(
          "div",
          { className: "wbml-layout" + (current ? " has-detail" : "") },
          h(
            "aside",
            { className: "wbml-rail" },
            h(
              "div",
              { className: "wbml-card wbml-rail-card" },
              h("div", { className: "wbml-rail-title" }, "\u6536\u4EF6\u8D26\u6237"),
              h("select", { className: "wbml-input", value: accountId[0], onChange: function(e) {
                accountId[1](e.target.value);
                sel[1](null);
              } }, h("option", { value: "" }, "\u5168\u90E8\u8D26\u6237"), accs.map(function(a) {
                return h("option", { key: a.id, value: a.id }, a.name);
              })),
              h("div", { className: "wbml-rail-stats" }, h("span", null, h("b", null, items.length), "\u5C01\u672C\u5730"), h("span", null, h("b", null, unread), "\u5C01\u672A\u8BFB")),
              h(C.Btn, { h, kind: "primary", disabled: !canSync, onClick: sync }, "\u540C\u6B65\u6536\u4EF6\u7BB1"),
              h("p", { className: "wbml-hint" }, canSync ? "\u53EA\u6293\u6700\u8FD1 20 \u5C01\u4FE1\u5934\uFF1B\u6B63\u6587\u70B9\u5F00\u65F6\u6309\u9700\u4E0B\u8F7D\u3002" : "\u9009\u62E9\u5177\u4F53\u8D26\u6237\u540E\u53EF\u540C\u6B65\uFF1B\u300C\u5168\u90E8\u8D26\u6237\u300D\u53EA\u770B\u672C\u5730\u526F\u672C\u3002")
            ),
            h("div", { className: "wbml-rail-tip" }, "\u63D0\u793A\uFF1A\u70B9\u4E00\u5C01\u90AE\u4EF6\u4F1A\u5728\u53F3\u4FA7\u9605\u8BFB\uFF0C\u5217\u8868\u4E0D\u4F1A\u6D88\u5931\u3002")
          ),
          h(
            "section",
            { className: "wbml-pane wbml-listpane" },
            h("div", { className: "wbml-pane-head" }, h("strong", null, accountName(accountId[0])), h("span", { className: "wbml-muted" }, items.length + " \u5C01 \xB7 " + unread + " \u672A\u8BFB")),
            h("div", { className: "wbml-state-box" }, body)
          ),
          current ? h(
            "section",
            { className: "wbml-pane wbml-detailpane" },
            h(
              "div",
              { className: "wbml-detail-head" },
              h("div", { className: "wbml-detail-title" }, h("strong", null, current.subject || "(\u65E0\u4E3B\u9898)"), h("span", { className: "wbml-muted" }, senderDetail(current) + " \xB7 " + C.fmtTime(current.dateAt, props.lang))),
              h(C.Btn, { h, onClick: function() {
                sel[1](null);
              } }, "\u5173\u95ED")
            ),
            h("div", { className: "wbml-detail-meta" }, h("span", null, "\u6536\u4EF6\u4EBA\uFF1A" + (current.to || "\u2014")), h("span", null, "\u6587\u4EF6\u5939\uFF1A" + (current.mailbox || "INBOX"))),
            h("div", { className: "wbml-detail-body" }, bodyNode(current))
          ) : null
        )
      );
    };
  }
});

// packages/addons/mail/client/views/compose.cjs
var require_compose = __commonJS({
  "packages/addons/mail/client/views/compose.cjs"(exports2, module2) {
    "use strict";
    module2.exports = function Compose(props) {
      var h = props.h, React = props.React, api = props.api;
      var C = require_common();
      var accounts = C.useLoad(React, api, "mail.accountList", {}, []);
      var st = React.useState({ accountId: "", to: "", subject: "", text: "" });
      var msg = React.useState(null);
      var busy = React.useState(false);
      var accs = accounts.data && accounts.data.items || [];
      function set(k, v) {
        st[1](Object.assign({}, st[0], { [k]: v }));
      }
      function send() {
        var to = st[0].to.split(/[,，;；\n]/).map(function(s) {
          return s.trim();
        }).filter(Boolean);
        if (!st[0].accountId || !to.length) {
          msg[1]({ kind: "error", text: "\u8BF7\u9009\u62E9\u8D26\u6237\u5E76\u586B\u5199\u6536\u4EF6\u4EBA" });
          return;
        }
        busy[1](true);
        C.call(api, "mail.messageSend", { accountId: st[0].accountId, to, subject: st[0].subject, text: st[0].text }).then(function() {
          msg[1]({ kind: "ok", text: "\u5DF2\u53D1\u9001" });
          st[1](Object.assign({}, st[0], { to: "", subject: "", text: "" }));
        }).catch(function(e) {
          msg[1]({ kind: "error", text: C.errText(e) });
        }).finally(function() {
          busy[1](false);
        });
      }
      return h(
        "div",
        { className: "wbml-page" },
        h("h2", null, "\u5199\u4FE1"),
        h(C.Notice, { h, text: msg[0] && msg[0].text, kind: msg[0] && msg[0].kind }),
        h(
          "div",
          { className: "wbml-card" },
          h(C.Field, { h, label: "\u53D1\u4EF6\u8D26\u6237" }, h("select", { className: "wbml-input", value: st[0].accountId, onChange: function(e) {
            set("accountId", e.target.value);
          } }, h("option", { value: "" }, "\u8BF7\u9009\u62E9"), accs.map(function(a) {
            return h("option", { key: a.id, value: a.id }, a.name + " <" + a.email + ">");
          }))),
          h(C.Field, { h, label: "\u6536\u4EF6\u4EBA", hint: "\u591A\u4E2A\u90AE\u7BB1\u7528\u9017\u53F7\u5206\u9694" }, h("input", { className: "wbml-input", value: st[0].to, onChange: function(e) {
            set("to", e.target.value);
          } })),
          h(C.Field, { h, label: "\u4E3B\u9898" }, h("input", { className: "wbml-input", value: st[0].subject, onChange: function(e) {
            set("subject", e.target.value);
          } })),
          h(C.Field, { h, label: "\u6B63\u6587" }, h("textarea", { className: "wbml-input", rows: 10, value: st[0].text, onChange: function(e) {
            set("text", e.target.value);
          } })),
          h("div", { className: "wbml-actions" }, h(C.Btn, { h, kind: "primary", disabled: busy[0], onClick: send }, busy[0] ? "\u53D1\u9001\u4E2D\u2026" : "\u53D1\u9001"))
        )
      );
    };
  }
});

// packages/addons/mail/client/ui/provider-util.cjs
var require_provider_util = __commonJS({
  "packages/addons/mail/client/ui/provider-util.cjs"(exports2, module2) {
    "use strict";
    function domainOf(email) {
      var raw = String(email || "").trim().toLowerCase();
      var at = raw.lastIndexOf("@");
      if (at < 0) return "";
      return raw.slice(at + 1).replace(/\.+$/, "");
    }
    function localOf(email) {
      var raw = String(email || "").trim();
      var at = raw.lastIndexOf("@");
      return at < 0 ? raw : raw.slice(0, at);
    }
    function list(table) {
      return table && table.providers || [];
    }
    function providerById(table, id) {
      var arr = list(table);
      for (var i = 0; i < arr.length; i += 1) if (arr[i].id === id) return arr[i];
      return null;
    }
    function detect(table, email) {
      var domain = domainOf(email);
      if (!domain) return null;
      var best = null;
      var arr = list(table);
      for (var i = 0; i < arr.length; i += 1) {
        var domains = arr[i].domains || [];
        for (var j = 0; j < domains.length; j += 1) {
          var d = domains[j];
          if (domain !== d && domain.slice(-(d.length + 1)) !== "." + d) continue;
          if (!best || d.length > best.domain.length) best = { id: arr[i].id, domain: d };
        }
      }
      return best;
    }
    function hostOf(tpl, domain) {
      return String(tpl || "").replace("{domain}", domain);
    }
    function presetFor(table, id, email) {
      var p = providerById(table, id);
      if (!p) return null;
      var domain = domainOf(email) || p.domains && p.domains[0] || "";
      return {
        provider: p.id,
        imapHost: hostOf(p.imapHost, domain),
        imapPort: p.imapPort,
        imapTls: p.imapTls,
        smtpHost: hostOf(p.smtpHost, domain),
        smtpPort: p.smtpPort,
        smtpTls: p.smtpTls,
        username: p.usernameMode === "local" ? localOf(email) : String(email || "").trim()
      };
    }
    function labelOf(provider, lang) {
      if (!provider) return "";
      var l = provider.label || {};
      return lang === "en" ? l.en || l.zh || provider.id : l.zh || l.en || provider.id;
    }
    function hintOf(provider, lang) {
      if (!provider) return "";
      var h = provider.hint || {};
      return lang === "en" ? h.en || h.zh || "" : h.zh || h.en || "";
    }
    module2.exports = {
      domainOf,
      localOf,
      providerById,
      detect,
      presetFor,
      labelOf,
      hintOf
    };
  }
});

// packages/addons/mail/client/ui/vault-gate.cjs
var require_vault_gate = __commonJS({
  "packages/addons/mail/client/ui/vault-gate.cjs"(exports2, module2) {
    "use strict";
    function t(lang, zh, en) {
      return lang === "en" ? en : zh;
    }
    module2.exports = function VaultGate(props) {
      var h = props.h;
      var C = props.C;
      var lang = props.lang;
      var vault = props.vault || "loading";
      if (vault === "ready" || vault === "loading") return null;
      var SecretField = props.SecretField;
      var busy = !!props.busy;
      function secret(value, onChange, show, onToggle, id, autoComplete) {
        return h(SecretField, {
          h,
          value,
          onChange,
          show,
          onToggle,
          id,
          autoComplete,
          disabled: busy,
          showLabel: t(lang, "\u663E\u793A\u660E\u6587", "Show plain text"),
          hideLabel: t(lang, "\u9690\u85CF\u660E\u6587", "Hide plain text")
        });
      }
      var body;
      if (vault === "missing") {
        body = h(
          "div",
          { className: "wbml-gate" },
          h("div", { className: "wbml-gate-title" }, t(lang, "\u4FDD\u9669\u7BB1\u63D2\u4EF6\u672A\u5B89\u88C5", "Vault plugin is not installed")),
          h(
            "p",
            { className: "wbml-gate-text" },
            t(
              lang,
              "\u90AE\u4EF6\u6388\u6743\u7801\u53EA\u80FD\u4FDD\u5B58\u5728\u4FDD\u9669\u7BB1\u91CC\u3002\u5148\u5B89\u88C5\u5E76\u521D\u59CB\u5316\u300C\u51ED\u636E\u4FDD\u9669\u7BB1\u300D\u63D2\u4EF6\uFF0C\u518D\u56DE\u5230\u672C\u9875\u9009\u62E9\u51ED\u636E\u3002",
              "Mail credentials can only live in the vault. Install and initialise the Vault plugin, then come back and pick one."
            )
          ),
          h(
            "button",
            { type: "button", className: "wbml-btn", onClick: props.onRetry },
            t(lang, "\u91CD\u65B0\u68C0\u6D4B", "Check again")
          )
        );
      } else if (vault === "init") {
        body = h(
          "div",
          { className: "wbml-gate" },
          h("div", { className: "wbml-gate-title" }, t(lang, "\u4FDD\u9669\u7BB1\u8FD8\u6CA1\u6709\u4E3B\u53E3\u4EE4", "The vault has no master password yet")),
          h(
            "p",
            { className: "wbml-gate-text" },
            t(
              lang,
              "\u8BBE\u7F6E\u4E00\u4E2A\u4E3B\u53E3\u4EE4\uFF08\u81F3\u5C11 12 \u4F4D\uFF09\uFF0C\u7528\u4E8E\u52A0\u5BC6\u8FD9\u53F0\u673A\u5668\u4E0A\u7684\u6240\u6709\u51ED\u636E\u3002\u8BBE\u7F6E\u540E\u4E0D\u80FD\u627E\u56DE\uFF0C\u8BF7\u8BB0\u7262\u3002",
              "Set a master password (12+ characters) that encrypts every credential on this machine. It cannot be recovered, so keep it safe."
            )
          ),
          h("div", { className: "wbml-gate-row" }, secret(props.pass, props.onPass, props.showPass, props.onTogglePass, "wbml-vault-pass", "new-password")),
          h("div", { className: "wbml-gate-row" }, secret(props.pass2, props.onPass2, props.showPass2, props.onTogglePass2, "wbml-vault-pass2", "new-password")),
          h(
            "button",
            { type: "button", className: "wbml-btn primary", disabled: busy, onClick: props.onSubmit },
            busy ? t(lang, "\u5904\u7406\u4E2D\u2026", "Working\u2026") : t(lang, "\u521D\u59CB\u5316\u4FDD\u9669\u7BB1\u5E76\u7EE7\u7EED", "Initialize vault and continue")
          )
        );
      } else {
        body = h(
          "div",
          { className: "wbml-gate" },
          h("div", { className: "wbml-gate-title" }, t(lang, "\u4FDD\u9669\u7BB1\u5DF2\u9501\u5B9A", "The vault is locked")),
          h("p", { className: "wbml-gate-text" }, t(lang, "\u8F93\u5165\u4E3B\u53E3\u4EE4\u89E3\u9501\u540E\u5373\u53EF\u4FDD\u5B58\u8D26\u6237\u3002", "Unlock with your master password to save the account.")),
          h("div", { className: "wbml-gate-row" }, secret(props.pass, props.onPass, props.showPass, props.onTogglePass, "wbml-vault-pass", "current-password")),
          h(
            "button",
            { type: "button", className: "wbml-btn primary", disabled: busy, onClick: props.onSubmit },
            busy ? t(lang, "\u89E3\u9501\u4E2D\u2026", "Unlocking\u2026") : t(lang, "\u89E3\u9501\u5E76\u7EE7\u7EED", "Unlock and continue")
          )
        );
      }
      return h("div", { className: "wbml-gate-wrap" }, body, props.error ? h(C.Notice, { h, text: props.error, kind: "warn" }) : null);
    };
  }
});

// packages/addons/lib/filter-checklist.cjs
var require_filter_checklist = __commonJS({
  "packages/addons/lib/filter-checklist.cjs"(exports2, module2) {
    "use strict";
    var React = require("react");
    var h = React.createElement;
    var NEAR = 24;
    function nearBottom(el, threshold) {
      if (!el) return false;
      var gap = Number(threshold);
      if (!isFinite(gap) || gap < 0) gap = NEAR;
      return el.scrollTop + el.clientHeight >= el.scrollHeight - gap;
    }
    function FilterChecklist(props) {
      var items = props.items || [];
      var selected = props.selected || [];
      var disabled = props.disabled === true;
      var loading = props.loading === true;
      var hasMore = props.hasMore === true;
      var query = props.query || "";
      var total = typeof props.total === "number" ? props.total : items.length;
      var title = props.title || "\u5168\u90E8";
      var selectedText = props.selectedText || "\u5DF2\u9009";
      var clearText = props.clearText || "\u6E05\u7A7A";
      var searchPlaceholder = props.searchPlaceholder || "\u641C\u7D22";
      var emptyText = props.emptyText || "\u6682\u65E0\u6570\u636E";
      var noMatchText = props.noMatchText || "\u6CA1\u6709\u5339\u914D\u9879";
      var loadingText = props.loadingText || "\u52A0\u8F7D\u4E2D\u2026";
      var noMoreText = typeof props.noMoreText === "string" ? props.noMoreText : "\u6CA1\u6709\u66F4\u591A";
      var onToggle = props.onToggle || function() {
      };
      var onQuery = props.onQuery || function() {
      };
      var onLoadMore = props.onLoadMore;
      var onClear = props.onClear || function() {
      };
      var single = props.mode === "single";
      var onPick = typeof props.onPick === "function" ? props.onPick : onToggle;
      function toggle(id) {
        if (disabled) return;
        onToggle(id);
      }
      function scroll(e) {
        if (disabled || loading || !hasMore || !onLoadMore) return;
        if (nearBottom(e.currentTarget)) onLoadMore();
      }
      var head = h(
        "div",
        { className: "wbck-head" },
        h("span", { className: "wbck-grow" }, title + (total ? " \xB7 " + total : "")),
        !single && selected.length ? h("span", { className: "wbck-sel" }, selectedText + " " + selected.length) : null,
        !single && (selected.length || query) ? h("button", {
          type: "button",
          className: "wbck-clear",
          title: clearText,
          disabled,
          onClick: function() {
            if (disabled) return;
            onClear();
          }
        }, clearText) : null
      );
      var body;
      if (!items.length) {
        body = h("div", { className: "wbck-note", role: "status" }, loading ? loadingText : query ? noMatchText : emptyText);
      } else {
        body = items.map(function(x) {
          var on = selected.indexOf(String(x.id)) >= 0;
          if (single) {
            return h(
              "button",
              {
                key: x.id,
                type: "button",
                role: "radio",
                "aria-checked": on ? "true" : "false",
                className: "wbck-opt" + (on ? " is-on" : ""),
                disabled,
                onClick: function() {
                  if (disabled) return;
                  onPick(x.id);
                }
              },
              h("span", { className: "wbck-nm", title: x.name }, x.name),
              x.meta ? h("span", { className: "wbck-meta" }, x.meta) : null
            );
          }
          return h(
            "label",
            { key: x.id, className: "wbck-opt" + (on ? " is-on" : "") },
            h("input", {
              type: "checkbox",
              checked: on,
              disabled,
              onChange: function() {
                toggle(x.id);
              }
            }),
            h("span", { className: "wbck-nm", title: x.name }, x.name),
            x.meta ? h("span", { className: "wbck-meta" }, x.meta) : null
          );
        });
        var more = loading ? loadingText : hasMore ? "" : noMoreText;
        if (more) body = body.concat([h("div", { key: "__more", className: "wbck-more", role: "status" }, more)]);
      }
      return h(
        "div",
        { className: "wbck", "data-role": "checklist" },
        h(
          "div",
          { className: "wbck-search" },
          h("input", {
            type: "search",
            autoFocus: props.autoFocus !== false,
            className: "wbck-input",
            placeholder: searchPlaceholder,
            "aria-label": searchPlaceholder,
            value: query,
            disabled,
            onChange: function(e) {
              onQuery(e.target.value);
            }
          })
        ),
        props.beforeHead || null,
        head,
        h("div", {
          className: "wbck-list",
          onScroll: scroll,
          role: single ? "radiogroup" : void 0,
          "aria-label": single ? props.groupLabel || searchPlaceholder : void 0,
          "aria-busy": loading ? "true" : "false"
        }, body)
      );
    }
    module2.exports = FilterChecklist;
    module2.exports.nearBottom = nearBottom;
  }
});

// packages/addons/mail/client/ui/secret-picker.cjs
var require_secret_picker = __commonJS({
  "packages/addons/mail/client/ui/secret-picker.cjs"(exports2, module2) {
    "use strict";
    var FilterChecklist = require_filter_checklist();
    var PAGE = 20;
    var KIND_LABEL = {
      password: "\u5BC6\u7801",
      phone: "\u624B\u673A\u53F7",
      id_card: "\u8EAB\u4EFD\u8BC1\u53F7",
      token: "Token",
      app_password: "\u5E94\u7528\u4E13\u7528\u5BC6\u7801",
      api_key: "API Key",
      other: "\u5176\u5B83"
    };
    var KIND_LABEL_EN = {
      password: "Password",
      phone: "Phone",
      id_card: "ID card",
      token: "Token",
      app_password: "App password",
      api_key: "API key",
      other: "Other"
    };
    function t(lang, zh, en) {
      return lang === "en" ? en : zh;
    }
    function kindText(lang, kind) {
      var map = lang === "en" ? KIND_LABEL_EN : KIND_LABEL;
      return map[kind] || kind || t(lang, "\u51ED\u636E", "Credential");
    }
    function metaOf(item) {
      var m = item && item.meta;
      if (!m || typeof m !== "object") return "";
      var u = m.username || m.user || m.login || "";
      return typeof u === "string" ? u : "";
    }
    module2.exports = function SecretPicker(props) {
      var h = props.h;
      var C = props.C;
      var api = props.api;
      var lang = props.lang || "zh";
      var React = props.React || require("react");
      var vault = props.vault || "ready";
      var disabled = props.disabled === true;
      var S = React.useState;
      var openS = S(false);
      var qS = S("");
      var rowsS = S([]);
      var allS = S([]);
      var pageS = S(1);
      var loadS = S(false);
      var errS = S("");
      var knownS = S({});
      var boxRef = React.useRef ? React.useRef(null) : { current: null };
      var open = openS[0];
      var rows = rowsS[0];
      var all = allS[0];
      var value = String(props.value || "");
      function call(query) {
        return C.call(api, "vault.secretList", { q: query || "" }).then(function(r) {
          var items = (r && Array.isArray(r.items) ? r.items : []).map(function(x) {
            return { id: x.id, name: x.name, kind: x.kind, meta: x.meta };
          });
          return items;
        });
      }
      function remember(items) {
        knownS[1](function(prev) {
          var next = Object.assign({}, prev);
          items.forEach(function(x) {
            next[x.id] = x;
          });
          return next;
        });
      }
      React.useEffect(function() {
        if (vault !== "ready") return;
        var alive = true;
        loadS[1](true);
        call("").then(function(items) {
          if (!alive) return;
          allS[1](items);
          remember(items);
          loadS[1](false);
        }).catch(function(e) {
          if (!alive) return;
          loadS[1](false);
          errS[1](C.errText(e));
        });
        return function() {
          alive = false;
        };
      }, [vault]);
      React.useEffect(function() {
        if (!open) return;
        var alive = true;
        loadS[1](true);
        errS[1]("");
        var timer = setTimeout(function() {
          call(qS[0]).then(function(items) {
            if (!alive) return;
            rowsS[1](items);
            pageS[1](1);
            remember(items);
            loadS[1](false);
          }).catch(function(e) {
            if (!alive) return;
            rowsS[1]([]);
            loadS[1](false);
            errS[1](C.errText(e));
          });
        }, 180);
        return function() {
          alive = false;
          clearTimeout(timer);
        };
      }, [open, qS[0]]);
      React.useEffect(function() {
        if (!open) return;
        function onDown(e) {
          var box = boxRef.current;
          if (box && !box.contains(e.target)) openS[1](false);
        }
        function onKey(e) {
          if (e.key === "Escape") {
            e.preventDefault();
            e.stopPropagation();
            openS[1](false);
          }
        }
        document.addEventListener("mousedown", onDown);
        document.addEventListener("keydown", onKey);
        return function() {
          document.removeEventListener("mousedown", onDown);
          document.removeEventListener("keydown", onKey);
        };
      }, [open]);
      var known = knownS[0];
      var picked = known[value] || null;
      var missing = !!value && !picked && !loadS[0];
      var label = !value ? t(lang, "\u9009\u62E9\u4FDD\u9669\u7BB1\u51ED\u636E", "Choose a vault credential") : picked ? picked.name + " \xB7 " + kindText(lang, picked.kind) : t(lang, "\u51ED\u636E " + value.slice(0, 8), "Credential " + value.slice(0, 8));
      if (vault === "missing") {
        return h(
          "div",
          { className: "wbml-picker" },
          h(
            "div",
            { className: "wbml-picker-note", role: "status" },
            t(
              lang,
              "\u6CA1\u6709\u68C0\u6D4B\u5230\u51ED\u636E\u4FDD\u9669\u7BB1\uFF0C\u65E0\u6CD5\u9009\u62E9\u51ED\u636E\u3002\u5B89\u88C5\u5E76\u521D\u59CB\u5316\u4FDD\u9669\u7BB1\u540E\u5237\u65B0\u672C\u9875\u3002",
              "No vault plugin detected. Install and initialise the vault, then reload."
            )
          )
        );
      }
      if (vault === "locked" || vault === "init" || vault === "loading") {
        return h(
          "div",
          { className: "wbml-picker" },
          h(
            "div",
            { className: "wbml-picker-note", role: "status" },
            vault === "loading" ? t(lang, "\u6B63\u5728\u68C0\u67E5\u4FDD\u9669\u7BB1\u72B6\u6001\u2026", "Checking the vault\u2026") : t(
              lang,
              "\u4FDD\u9669\u7BB1\u5DF2\u9501\u5B9A\u6216\u672A\u521D\u59CB\u5316\uFF0C\u5148\u5728\u90A3\u91CC\u5EFA\u597D\u51ED\u636E\uFF1B\u89E3\u9501\u540E\u5373\u53EF\u5728\u8FD9\u91CC\u9009\u62E9\u3002",
              "The vault is locked or uninitialised \u2014 create the credential there first, then unlock to pick it."
            )
          )
        );
      }
      var shown = rows.slice(0, pageS[0] * PAGE);
      var hasMore = pageS[0] * PAGE < rows.length;
      var noRows = !loadS[0] && !rows.length;
      function pick(id) {
        var item = known[id] || null;
        openS[1](false);
        if (props.onChange) props.onChange(id, item);
      }
      function goVault() {
        openS[1](false);
        var host = typeof window !== "undefined" ? window.__WB_HOST__ : null;
        if (host && typeof host.navigateAddon === "function") host.navigateAddon("wb-addon-vault");
      }
      return h(
        "div",
        { className: "wbml-picker", ref: boxRef },
        h(
          "button",
          {
            type: "button",
            className: "wbml-picker-trigger" + (value && !missing ? " is-set" : "") + (missing ? " is-missing" : ""),
            disabled,
            "aria-haspopup": "listbox",
            "aria-expanded": open ? "true" : "false",
            onClick: function() {
              openS[1](!open);
            }
          },
          h("span", { className: "wbml-picker-label" }, label),
          h("span", { className: "wbml-picker-caret", "aria-hidden": "true" }, "\u25BE")
        ),
        missing ? h(
          "p",
          { className: "wbml-picker-warn" },
          t(lang, "\u539F\u51ED\u636E\u5DF2\u5931\u6548\uFF0C\u8BF7\u91CD\u65B0\u9009\u62E9", "The bound credential is gone \u2014 pick another one")
        ) : null,
        open ? h(
          "div",
          { className: "wbml-picker-panel", role: "dialog", "aria-label": t(lang, "\u9009\u62E9\u51ED\u636E", "Choose a credential") },
          h(FilterChecklist, {
            mode: "single",
            items: shown.map(function(x) {
              var sub = metaOf(x);
              return { id: x.id, name: x.name, meta: kindText(lang, x.kind) + (sub ? " \xB7 " + sub : "") };
            }),
            selected: value ? [value] : [],
            onPick: pick,
            query: qS[0],
            onQuery: function(v) {
              qS[1](v);
            },
            title: t(lang, "\u4FDD\u9669\u7BB1\u51ED\u636E", "Vault credentials"),
            total: rows.length,
            searchPlaceholder: t(lang, "\u641C\u7D22\u51ED\u636E\u540D\u79F0\u6216\u5907\u6CE8", "Search by name or note"),
            groupLabel: t(lang, "\u4FDD\u9669\u7BB1\u51ED\u636E", "Vault credentials"),
            loading: loadS[0],
            hasMore,
            onLoadMore: function() {
              pageS[1](pageS[0] + 1);
            },
            emptyText: t(lang, "\u8FD8\u6CA1\u6709\u51ED\u636E", "No credentials yet"),
            noMatchText: t(lang, "\u6CA1\u6709\u5339\u914D\u7684\u51ED\u636E", "No matching credential"),
            noMoreText: rows.length > PAGE ? t(lang, "\u6CA1\u6709\u66F4\u591A", "No more") : "",
            loadingText: t(lang, "\u52A0\u8F7D\u4E2D\u2026", "Loading\u2026"),
            disabled
          }),
          errS[0] ? h(C.Notice, { h, kind: "error", text: errS[0] }) : null,
          rows.length ? h(
            "div",
            { className: "wbml-picker-foot" },
            t(
              lang,
              "\u5DF2\u52A0\u8F7D " + shown.length + " / \u5171 " + rows.length,
              "Loaded " + shown.length + " of " + rows.length
            )
          ) : null,
          noRows && !qS[0] ? h(
            "div",
            { className: "wbml-picker-empty" },
            h("span", null, t(lang, "\u8FD8\u6CA1\u6709\u51ED\u636E\uFF0C\u53BB\u4FDD\u9669\u7BB1\u65B0\u5EFA", "No credentials yet \u2014 create one in the vault")),
            h(
              "button",
              { type: "button", className: "wbml-btn", onClick: goVault },
              t(lang, "\u53BB\u4FDD\u9669\u7BB1", "Open vault")
            )
          ) : null
        ) : null
      );
    };
    module2.exports.PAGE = PAGE;
    module2.exports.KIND_LABEL = KIND_LABEL;
  }
});

// packages/addons/mail/lib/domain/probe-error.js
var probe_error_exports = {};
__export(probe_error_exports, {
  ERROR_CLASSES: () => ERROR_CLASSES,
  ERROR_TEXT: () => ERROR_TEXT,
  classifyProbeError: () => classifyProbeError
});
function classifyProbeError(e) {
  const code = String(e && e.code || "");
  const msg = String(e && (e.message || e) || "");
  const s = code + " " + msg;
  if (/不支持\s*starttls/i.test(msg)) return "starttls";
  if (TLS_CODE.has(code) || /certificate|证书|self[- ]signed|wrong version number|ssl/i.test(s)) return "tls";
  if (DNS_CODE.has(code) || /getaddrinfo|enotfound|域名解析/i.test(s)) return "dns";
  if (REFUSED_CODE.has(code) || /econnrefused|连接被拒绝|connection refused/i.test(s)) return "refused";
  if (code === "ETIMEDOUT" || /超时|timed?\s?out/i.test(s)) return "timeout";
  if (AUTH_RE.test(s)) return "auth";
  return "unknown";
}
var ERROR_CLASSES, AUTH_RE, TLS_CODE, REFUSED_CODE, DNS_CODE, ERROR_TEXT;
var init_probe_error = __esm({
  "packages/addons/mail/lib/domain/probe-error.js"() {
    ERROR_CLASSES = ["auth", "dns", "refused", "timeout", "tls", "starttls", "unknown"];
    AUTH_RE = /authenticationfailed|invalid credentials|login failed|imap 登录失败|smtp (用户名|密码) 失败|\b535\b|\b5\.7\.8\b|\bauth(?:entication)? failed\b/i;
    TLS_CODE = /* @__PURE__ */ new Set([
      "ERR_TLS_CERT_ALTNAME_INVALID",
      "DEPTH_ZERO_SELF_SIGNED_CERT",
      "SELF_SIGNED_CERT_IN_CHAIN",
      "CERT_HAS_EXPIRED",
      "UNABLE_TO_VERIFY_LEAF_SIGNATURE",
      "ERR_SSL_WRONG_VERSION_NUMBER",
      "EPROTO",
      "ERR_SSL_WRONG_SSL_VERSION"
    ]);
    REFUSED_CODE = /* @__PURE__ */ new Set(["ECONNREFUSED", "ECONNRESET", "EHOSTUNREACH", "ENETUNREACH", "EADDRNOTAVAIL"]);
    DNS_CODE = /* @__PURE__ */ new Set(["ENOTFOUND", "EAI_AGAIN", "EAI_FAIL"]);
    ERROR_TEXT = {
      auth: {
        zh: "\u8D26\u53F7\u6216\u6388\u6743\u7801\u4E0D\u5BF9\u3002QQ/\u7F51\u6613/Gmail/iCloud \u9700\u8981\u300C\u6388\u6743\u7801 / App \u4E13\u7528\u5BC6\u7801\u300D\uFF0C\u4E0D\u662F\u7F51\u9875\u767B\u5F55\u5BC6\u7801\u3002",
        en: "Wrong account or password. QQ/NetEase/Gmail/iCloud need an app password, not your web login password."
      },
      dns: {
        zh: "\u670D\u52A1\u5668\u5730\u5740\u89E3\u6790\u5931\u8D25\uFF0C\u68C0\u67E5\u4E3B\u673A\u540D\u662F\u5426\u5199\u9519\uFF08\u4F8B\u5982 imap.qq.com\uFF09\u3002",
        en: "Host name could not be resolved; check the server address (for example imap.qq.com)."
      },
      refused: {
        zh: "\u7AEF\u53E3\u6CA1\u6709\u54CD\u5E94\uFF0C\u68C0\u67E5\u7AEF\u53E3\u53F7\u4E0E\u670D\u52A1\u5668\u662F\u5426\u7981\u7528\u4E86\u8BE5\u534F\u8BAE\u3002",
        en: "The port did not answer; check the port number and whether the server disables that protocol."
      },
      timeout: {
        zh: "\u8FDE\u63A5\u8D85\u65F6\uFF0C\u53EF\u80FD\u662F\u7F51\u7EDC\u6216\u9632\u706B\u5899\u62E6\u622A\u4E86 993/465/587 \u7AEF\u53E3\u3002",
        en: "Connection timed out; the network or firewall may block ports 993/465/587."
      },
      tls: {
        zh: "TLS \u63E1\u624B\u5931\u8D25\uFF0C\u68C0\u67E5\u7AEF\u53E3\u4E0E\u52A0\u5BC6\u65B9\u5F0F\u662F\u5426\u5339\u914D\uFF08993 \u7528 SSL/TLS\uFF0C587 \u7528 STARTTLS\uFF09\u3002",
        en: "TLS handshake failed; check that port and encryption match (993 uses SSL/TLS, 587 uses STARTTLS)."
      },
      starttls: {
        zh: "\u670D\u52A1\u5668\u4E0D\u652F\u6301 STARTTLS\uFF0C\u8BF7\u6539\u7528 993/465 \u7684\u9690\u5F0F TLS \u7AEF\u53E3\u3002",
        en: "The server does not support STARTTLS; use an implicit-TLS port such as 993 or 465."
      },
      unknown: {
        zh: "\u8FDE\u63A5\u5931\u8D25\uFF0C\u8BF7\u68C0\u67E5\u670D\u52A1\u5668\u5730\u5740\u3001\u7AEF\u53E3\u4E0E\u6388\u6743\u7801\u3002",
        en: "Connection failed; check the server address, port and app password."
      }
    };
  }
});

// packages/addons/mail/client/ui/provider-chips.cjs
var require_provider_chips = __commonJS({
  "packages/addons/mail/client/ui/provider-chips.cjs"(exports2, module2) {
    "use strict";
    var util = require_provider_util();
    module2.exports = function ProviderChips(props) {
      var h = props.h;
      var lang = props.lang;
      var arr = props.providers && props.providers.providers || [];
      return h(
        "div",
        { className: "wbml-chips", role: "radiogroup", "aria-label": lang === "en" ? "Mail provider" : "\u90AE\u7BB1\u670D\u52A1\u5546" },
        arr.map(function(p) {
          var on = p.id === props.value;
          return h(
            "button",
            {
              key: p.id,
              type: "button",
              role: "radio",
              "aria-checked": on ? "true" : "false",
              className: "wbml-chip" + (on ? " on" : ""),
              onClick: function() {
                props.onPick(p.id);
              }
            },
            util.labelOf(p, lang)
          );
        })
      );
    };
  }
});

// packages/addons/mail/client/ui/account-form.cjs
var require_account_form = __commonJS({
  "packages/addons/mail/client/ui/account-form.cjs"(exports2, module2) {
    "use strict";
    var util = require_provider_util();
    var VaultGate = require_vault_gate();
    var SecretPicker = require_secret_picker();
    var probe = (init_probe_error(), __toCommonJS(probe_error_exports));
    function t(lang, zh, en) {
      return lang === "en" ? en : zh;
    }
    module2.exports = function AccountForm(props) {
      var h = props.h;
      var React = props.React;
      var C = props.C;
      var api = props.api;
      var lang = props.lang;
      var SecretField = props.SecretField;
      var providers = props.providers || { providers: [] };
      var editing = props.account || null;
      var S = React.useState;
      function initial() {
        var base = util.presetFor(providers, "qq", "") || {
          provider: "qq",
          imapHost: "",
          imapPort: 993,
          imapTls: true,
          smtpHost: "",
          smtpPort: 465,
          smtpTls: true,
          username: ""
        };
        base.email = "";
        base.name = "";
        base.secretId = "";
        base.advanced = false;
        if (!editing) return base;
        return Object.assign(base, {
          provider: util.detect(providers, editing.email) ? util.detect(providers, editing.email).id : "other",
          email: editing.email || "",
          name: editing.name || "",
          username: editing.username || editing.email || "",
          imapHost: editing.imapHost || "",
          imapPort: editing.imapPort || 993,
          imapTls: editing.imapTls !== false,
          smtpHost: editing.smtpHost || "",
          smtpPort: editing.smtpPort || 465,
          smtpTls: editing.smtpTls !== false,
          secretId: editing.secretId || "",
          advanced: true
        });
      }
      var fs = S(initial);
      var f = fs[0];
      var setF = fs[1];
      var touchedS = S(!!editing);
      var vaultS = S("loading");
      var passS = S("");
      var pass2S = S("");
      var showS = S({ pass: false, pass2: false });
      var vaultErrS = S("");
      var afterS = S("");
      var probeS = S(null);
      var busyS = S({ save: false, probe: false, vault: false });
      var errS = S("");
      var noticeS = S("");
      var vault = vaultS[0];
      var busy = busyS[0];
      function upd(patch) {
        setF(function(prev) {
          return Object.assign({}, prev, patch);
        });
      }
      function setBusy(key, on) {
        setBusyState(function(prev) {
          var next = Object.assign({}, prev);
          next[key] = on;
          return next;
        });
      }
      var setBusyState = busyS[1];
      function setProbe(value) {
        probeS[1](value);
      }
      function setErr(value) {
        errS[1](value);
      }
      function setNotice(value) {
        noticeS[1](value);
      }
      function checkVault() {
        return C.call(api, "vault.status").then(function(r2) {
          var state = !r2 || !r2.initialized ? "init" : r2.locked ? "locked" : "ready";
          vaultS[1](state);
          return state;
        }).catch(function() {
          vaultS[1]("missing");
          return "missing";
        });
      }
      React.useEffect(function() {
        checkVault();
      }, []);
      function applyPreset(id, email) {
        var p = util.presetFor(providers, id, email);
        if (!p) return;
        upd({ provider: id, imapHost: p.imapHost, imapPort: p.imapPort, imapTls: p.imapTls, smtpHost: p.smtpHost, smtpPort: p.smtpPort, smtpTls: p.smtpTls, username: p.username, advanced: id === "other" });
      }
      function onPick(id) {
        touchedS[1](true);
        setProbe(null);
        applyPreset(id, f.email);
      }
      function onEmailBlur() {
        if (touchedS[0] || !f.email) return;
        var hit = util.detect(providers, f.email);
        if (hit) {
          if (hit.id !== f.provider) applyPreset(hit.id, f.email);
          else upd({ username: f.username || f.email });
        } else {
          upd({ provider: "other", advanced: true, username: f.username || f.email });
        }
      }
      function validate() {
        if (!/^\S+@\S+\.\S+$/.test(String(f.email || "").trim())) return t(lang, "\u8BF7\u586B\u5199\u6B63\u786E\u7684\u90AE\u7BB1\u5730\u5740", "Enter a valid email address");
        if (!String(f.name || "").trim()) return t(lang, "\u8BF7\u586B\u5199\u8D26\u6237\u540D\u79F0", "Enter an account name");
        if (!String(f.imapHost || "").trim()) return t(lang, "\u8BF7\u586B\u5199 IMAP \u670D\u52A1\u5668", "Enter the IMAP server");
        if (!String(f.username || "").trim()) return t(lang, "\u8BF7\u586B\u5199\u767B\u5F55\u540D", "Enter the login name");
        if (!String(f.secretId || "").trim()) {
          return t(lang, "\u8BF7\u5148\u5728\u4FDD\u9669\u7BB1\u65B0\u5EFA\u5E76\u9009\u62E9\u51ED\u636E", "Create a credential in the vault and pick it here");
        }
        var ports = [f.imapPort, f.smtpPort];
        for (var i = 0; i < ports.length; i += 1) {
          var n = Number(ports[i]);
          if (!(n >= 1 && n <= 65535)) return t(lang, "\u7AEF\u53E3\u9700\u5728 1\u201365535 \u4E4B\u95F4", "Port must be between 1 and 65535");
        }
        return "";
      }
      function persist() {
        setErr("");
        setBusy("save", true);
        var payload = {
          name: String(f.name || "").trim(),
          email: String(f.email || "").trim(),
          imapHost: String(f.imapHost || "").trim(),
          imapPort: Number(f.imapPort),
          imapTls: !!f.imapTls,
          smtpHost: String(f.smtpHost || "").trim(),
          smtpPort: Number(f.smtpPort),
          smtpTls: !!f.smtpTls,
          username: String(f.username || "").trim() || String(f.email || "").trim(),
          secretId: String(f.secretId || "").trim()
        };
        var step = editing ? C.call(api, "mail.accountUpdate", Object.assign({ id: editing.id }, payload)) : C.call(api, "mail.accountCreate", payload);
        step.then(function() {
          setBusy("save", false);
          setNotice(t(lang, "\u5DF2\u4FDD\u5B58", "Saved"));
          if (props.onSaved) props.onSaved();
        }).catch(function(e) {
          setBusy("save", false);
          setErr(C.errText(e));
        });
      }
      function submit() {
        var msg = validate();
        if (msg) {
          setErr(msg);
          return;
        }
        setErr("");
        if (vault !== "ready") {
          afterS[1]("save");
          setNotice("");
          if (vault === "loading") checkVault();
          return;
        }
        persist();
      }
      function onVaultSubmit() {
        var p = passS[0];
        if (!p) {
          vaultErrS[1](t(lang, "\u8BF7\u8F93\u5165\u4E3B\u53E3\u4EE4", "Enter the master password"));
          return;
        }
        if (vault === "init" && p !== pass2S[0]) {
          vaultErrS[1](t(lang, "\u4E24\u6B21\u8F93\u5165\u7684\u4E3B\u53E3\u4EE4\u4E0D\u4E00\u81F4", "The two passwords do not match"));
          return;
        }
        vaultErrS[1]("");
        setBusy("vault", true);
        var call = vault === "init" ? C.call(api, "vault.setup", { passphrase: p, mode: "A" }) : C.call(api, "vault.unlock", { passphrase: p });
        call.then(function() {
          setBusy("vault", false);
          passS[1]("");
          pass2S[1]("");
          vaultS[1]("ready");
          if (afterS[0] === "save") {
            afterS[1]("");
            persist();
          }
        }).catch(function(e) {
          setBusy("vault", false);
          vaultErrS[1](C.errText(e));
        });
      }
      function runProbe() {
        var msg = validate();
        if (msg) {
          setErr(msg);
          return;
        }
        setErr("");
        setBusy("probe", true);
        C.call(api, "mail.accountProbe", {
          email: f.email,
          username: f.username,
          imapHost: f.imapHost,
          imapPort: Number(f.imapPort),
          imapTls: !!f.imapTls,
          smtpHost: f.smtpHost,
          smtpPort: Number(f.smtpPort),
          smtpTls: !!f.smtpTls,
          secretId: f.secretId
        }).then(function(r2) {
          setBusy("probe", false);
          setProbe(r2);
        }).catch(function(e) {
          setBusy("probe", false);
          setErr(C.errText(e));
        });
      }
      function field(label, input, hint) {
        return h(C.Field, { h, label, hint }, input);
      }
      function textInput(key, opts) {
        var o = opts || {};
        return h("input", {
          className: "wbml-input",
          type: o.type || "text",
          value: f[key],
          placeholder: o.placeholder || "",
          autoComplete: o.autoComplete || "off",
          onChange: function(e) {
            upd(key === "imapPort" || key === "smtpPort" ? { [key]: e.target.value } : { [key]: e.target.value });
          }
        });
      }
      function tlsRow(key, label) {
        return h(
          "label",
          { className: "wbml-check" },
          h("input", {
            type: "checkbox",
            checked: !!f[key],
            onChange: function(e) {
              upd({ [key]: e.target.checked });
            }
          }),
          h("span", null, label)
        );
      }
      var provider = util.providerById(providers, f.provider);
      var probeText = "";
      if (probeS[0]) {
        var r = probeS[0];
        if (r.ok) probeText = t(lang, "\u81EA\u68C0\u901A\u8FC7\uFF1AIMAP \u767B\u5F55\u6210\u529F" + (r.imap ? "\uFF0C\u5217\u51FA " + r.imap.mailboxes + " \u4E2A\u6587\u4EF6\u5939" : "") + (r.smtp ? "\uFF1BSMTP \u8BA4\u8BC1\u6210\u529F" : ""), "Check passed: IMAP login succeeded" + (r.smtp ? " and SMTP authenticated" : ""));
        else {
          var cls = r.errorClass || "unknown";
          var tx = probe.ERROR_TEXT[cls] || probe.ERROR_TEXT.unknown;
          probeText = (lang === "en" ? tx.en : tx.zh) + " " + t(lang, "\uFF08" + cls + "\uFF09", "(" + cls + ")");
        }
      }
      return h(
        "div",
        { className: "wbml-acct-form" },
        h(
          "div",
          { className: "wbml-acct-head" },
          h("strong", null, editing ? t(lang, "\u7F16\u8F91\u8D26\u6237", "Edit account") : t(lang, "\u65B0\u589E\u8D26\u6237", "New account")),
          h("button", { type: "button", className: "wbml-icon-btn", onClick: props.onCancel, title: t(lang, "\u5173\u95ED", "Close") }, "\xD7")
        ),
        h(require_provider_chips(), { h, lang, providers, value: f.provider, onPick }),
        h(
          "div",
          { className: "wbml-acct-grid" },
          field(t(lang, "\u90AE\u7BB1\u5730\u5740", "Email address"), h("input", {
            className: "wbml-input",
            type: "email",
            value: f.email,
            placeholder: "you@example.com",
            autoComplete: "off",
            onChange: function(e) {
              upd({ email: e.target.value });
            },
            onBlur: onEmailBlur
          })),
          field(t(lang, "\u8D26\u6237\u540D\u79F0", "Account name"), textInput("name", { placeholder: t(lang, "\u4F8B\u5982 \u5DE5\u4F5C\u90AE\u7BB1", "e.g. Work mail") }))
        ),
        field(
          t(lang, "\u4FDD\u9669\u7BB1\u51ED\u636E", "Vault credential"),
          h(SecretPicker, {
            h,
            React,
            C,
            api,
            lang,
            vault,
            value: f.secretId,
            disabled: busy.save,
            onChange: function(id, item) {
              upd({ secretId: id, secretName: item ? item.name : "" });
              setProbe(null);
            }
          }),
          t(
            lang,
            "\u5148\u5728\u4FDD\u9669\u7BB1\u65B0\u5EFA\u4E00\u6761\u300C\u5E94\u7528\u4E13\u7528\u5BC6\u7801\u300D\uFF0C\u518D\u5728\u8FD9\u91CC\u9009\u7528\uFF1B\u90AE\u4EF6\u9875\u53EA\u4FDD\u5B58\u5B83\u7684 id\u3002",
            "Create an app-password entry in the vault first, then pick it here \u2014 this page only stores its id."
          )
        ),
        provider && util.hintOf(provider, lang) ? h("p", { className: "wbml-hint-line" }, util.hintOf(provider, lang)) : null,
        !f.advanced && f.imapHost ? h("p", { className: "wbml-hint-line" }, "IMAP " + f.imapHost + ":" + f.imapPort + (f.imapTls ? " TLS" : "") + " \xB7 SMTP " + (f.smtpHost || "\u2014") + ":" + f.smtpPort + (f.smtpTls ? " TLS" : " STARTTLS")) : null,
        !f.advanced ? h("button", { type: "button", className: "wbml-btn", onClick: function() {
          upd({ advanced: true });
        } }, t(lang, "\u5176\u4ED6\u8BBE\u7F6E\uFF08\u4E3B\u673A / \u7AEF\u53E3 / \u767B\u5F55\u540D\uFF09", "Advanced (hosts / ports / login name)")) : h(
          "div",
          { className: "wbml-acct-grid" },
          field(t(lang, "\u767B\u5F55\u540D", "Login name"), textInput("username", { placeholder: t(lang, "\u9ED8\u8BA4\u4E0E\u90AE\u7BB1\u76F8\u540C", "Defaults to the email") })),
          field(t(lang, "IMAP \u670D\u52A1\u5668", "IMAP server"), textInput("imapHost")),
          field(t(lang, "IMAP \u7AEF\u53E3", "IMAP port"), textInput("imapPort", { type: "number" })),
          field("", tlsRow("imapTls", t(lang, "IMAP \u9690\u5F0F TLS", "IMAP implicit TLS"))),
          field(t(lang, "SMTP \u670D\u52A1\u5668", "SMTP server"), textInput("smtpHost")),
          field(t(lang, "SMTP \u7AEF\u53E3", "SMTP port"), textInput("smtpPort", { type: "number" })),
          field("", tlsRow("smtpTls", t(lang, "SMTP \u9690\u5F0F TLS\uFF08\u5173\u6389\u8D70 STARTTLS\uFF09", "SMTP implicit TLS (off = STARTTLS)")))
        ),
        h(VaultGate, {
          h,
          C,
          lang,
          SecretField,
          vault,
          pass: passS[0],
          pass2: pass2S[0],
          showPass: showS[0].pass,
          showPass2: showS[0].pass2,
          onPass: function(v) {
            passS[1](v);
          },
          onPass2: function(v) {
            pass2S[1](v);
          },
          onTogglePass: function() {
            showS[1](Object.assign({}, showS[0], { pass: !showS[0].pass }));
          },
          onTogglePass2: function() {
            showS[1](Object.assign({}, showS[0], { pass2: !showS[0].pass2 }));
          },
          onSubmit: onVaultSubmit,
          busy: busy.vault,
          error: vaultErrS[0],
          onRetry: function() {
            checkVault();
          }
        }),
        probeS[0] ? h(C.Notice, { h, text: probeText, kind: probeS[0].ok ? "ok" : "warn" }) : null,
        errS[0] ? h(C.Notice, { h, text: errS[0], kind: "warn" }) : null,
        noticeS[0] ? h(C.Notice, { h, text: noticeS[0], kind: "ok" }) : null,
        !f.secretId ? h("p", { className: "wbml-hint-line" }, t(lang, "\u8BF7\u5148\u5728\u4FDD\u9669\u7BB1\u65B0\u5EFA\u5E76\u9009\u62E9\u51ED\u636E\uFF0C\u672A\u9009\u65F6\u4E0D\u80FD\u4FDD\u5B58\u3002", "Pick a vault credential before saving.")) : null,
        h(
          "div",
          { className: "wbml-acct-foot" },
          h(C.Btn, { h, onClick: runProbe, disabled: busy.probe || busy.save || !f.secretId }, busy.probe ? t(lang, "\u81EA\u68C0\u4E2D\u2026", "Checking\u2026") : t(lang, "\u4FDD\u5B58\u524D\u81EA\u68C0", "Check connection")),
          h(C.Btn, { h, kind: "primary", onClick: submit, disabled: busy.save || !f.secretId }, busy.save ? t(lang, "\u4FDD\u5B58\u4E2D\u2026", "Saving\u2026") : t(lang, "\u4FDD\u5B58", "Save")),
          h(C.Btn, { h, onClick: props.onCancel }, t(lang, "\u53D6\u6D88", "Cancel"))
        )
      );
    };
  }
});

// packages/addons/mail/client/ui/account-card.cjs
var require_account_card = __commonJS({
  "packages/addons/mail/client/ui/account-card.cjs"(exports2, module2) {
    "use strict";
    var probe = (init_probe_error(), __toCommonJS(probe_error_exports));
    function t(lang, zh, en) {
      return lang === "en" ? en : zh;
    }
    function resultText(res, lang) {
      if (!res) return "";
      if (res.ok) return t(lang, "\u8FDE\u63A5\u6B63\u5E38\uFF0C\u5DF2\u5217\u51FA\u6587\u4EF6\u5939", "Connected; folders listed");
      var cls = res.errorClass || "unknown";
      var text = probe.ERROR_TEXT[cls] || probe.ERROR_TEXT.unknown;
      return (lang === "en" ? text.en : text.zh) + (res.message ? "\uFF08" + res.message + "\uFF09" : "");
    }
    module2.exports = function AccountCard(props) {
      var h = props.h;
      var C = props.C;
      var lang = props.lang;
      var a = props.account || {};
      var res = props.test || null;
      var busy = !!props.busy;
      var last = a.lastMessageAt ? C.fmtTime(a.lastMessageAt, lang) : t(lang, "\u8FD8\u6CA1\u6709\u672C\u5730\u6765\u4FE1", "No local mail yet");
      return h(
        "div",
        { className: "wbml-card" },
        h(
          "div",
          { className: "wbml-card-main" },
          h("div", { className: "wbml-card-title" }, a.name || a.email),
          h("div", { className: "wbml-card-sub" }, a.email, a.username && a.username !== a.email ? " \xB7 " + a.username : ""),
          h("div", { className: "wbml-card-meta" }, (a.imapHost || "\u2014") + ":" + a.imapPort + " \xB7 " + (a.smtpHost || "\u2014") + ":" + a.smtpPort),
          h("div", { className: "wbml-card-meta" }, t(lang, "\u6700\u8FD1\u6765\u4FE1\uFF1A", "Last mail: ") + last)
        ),
        h(
          "div",
          { className: "wbml-card-actions" },
          h(C.Btn, { h, onClick: props.onEdit, disabled: busy }, t(lang, "\u7F16\u8F91", "Edit")),
          h(C.Btn, { h, onClick: props.onTest, disabled: busy }, busy ? t(lang, "\u6D4B\u8BD5\u4E2D\u2026", "Testing\u2026") : t(lang, "\u6D4B\u8BD5", "Test")),
          h(C.Btn, { h, kind: "danger", onClick: props.onDelete, disabled: busy }, t(lang, "\u5220\u9664", "Delete"))
        ),
        res ? h(
          "div",
          { className: "wbml-card-result " + (res.ok ? "ok" : "fail"), role: "status" },
          h(C.Pill, { h, kind: res.ok ? "ok" : "error" }, res.ok ? t(lang, "\u901A\u8FC7", "OK") : t(lang, "\u5931\u8D25", "Failed")),
          h("span", null, resultText(res, lang))
        ) : null
      );
    };
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/eye.mjs
var eye_exports = {};
__export(eye_exports, {
  __iconData: () => __iconData6,
  default: () => Eye
});
var __iconData6, Eye;
var init_eye = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/eye.mjs"() {
    init_createLucideIcon();
    __iconData6 = {
      name: "eye",
      size: 24,
      node: [
        [
          "path",
          {
            d: "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",
            key: "1nclc0"
          }
        ],
        ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
      ]
    };
    __iconData6.node;
    Eye = createLucideIcon(__iconData6);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/eye-off.mjs
var eye_off_exports = {};
__export(eye_off_exports, {
  __iconData: () => __iconData7,
  default: () => EyeOff
});
var __iconData7, EyeOff;
var init_eye_off = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/eye-off.mjs"() {
    init_createLucideIcon();
    __iconData7 = {
      name: "eye-off",
      size: 24,
      node: [
        [
          "path",
          {
            d: "M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",
            key: "ct8e1f"
          }
        ],
        ["path", { d: "M14.084 14.158a3 3 0 0 1-4.242-4.242", key: "151rxh" }],
        [
          "path",
          {
            d: "M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",
            key: "13bj9a"
          }
        ],
        ["path", { d: "m2 2 20 20", key: "1ooewy" }]
      ]
    };
    __iconData7.node;
    EyeOff = createLucideIcon(__iconData7);
  }
});

// packages/addons/lib/secret-field.cjs
var require_secret_field = __commonJS({
  "packages/addons/lib/secret-field.cjs"(exports2, module2) {
    "use strict";
    var Eye2 = (init_eye(), __toCommonJS(eye_exports)).default;
    var EyeOff2 = (init_eye_off(), __toCommonJS(eye_off_exports)).default;
    function SecretField(props) {
      var h = props.h;
      var show = Boolean(props.show);
      var label = show ? props.hideLabel || "\u9690\u85CF\u660E\u6587" : props.showLabel || "\u663E\u793A\u660E\u6587";
      var Ico = show ? EyeOff2 : Eye2;
      function toggle(e) {
        e.preventDefault();
        e.stopPropagation();
        var box = e.currentTarget && e.currentTarget.parentNode;
        if (props.onToggle) props.onToggle();
        var input = box && box.querySelector ? box.querySelector("input") : null;
        if (!input || !input.focus) return;
        input.focus();
        var end = String(input.value == null ? "" : input.value).length;
        if (input.setSelectionRange) {
          try {
            input.setSelectionRange(end, end);
          } catch (err) {
          }
        }
      }
      return h(
        "div",
        { className: "wb-secret-field" + (props.className ? " " + props.className : "") },
        h("input", {
          type: show ? "text" : "password",
          className: props.inputClassName || void 0,
          id: props.id || void 0,
          name: props.name || void 0,
          autoComplete: props.autoComplete || "new-password",
          autoFocus: props.autoFocus ? true : void 0,
          spellCheck: false,
          disabled: props.disabled ? true : void 0,
          "aria-label": props.ariaLabel || void 0,
          value: props.value == null ? "" : props.value,
          placeholder: props.placeholder || void 0,
          onChange: function(e) {
            if (props.onChange) props.onChange(e.target.value);
          },
          onKeyDown: props.onKeyDown || void 0
        }),
        h("button", {
          type: "button",
          className: "wb-eye",
          title: label,
          "aria-label": label,
          "aria-pressed": show ? "true" : "false",
          tabIndex: props.disabled ? -1 : void 0,
          onClick: toggle
        }, h(Ico, { size: 15, strokeWidth: 2, "aria-hidden": "true" }))
      );
    }
    module2.exports = SecretField;
  }
});

// packages/addons/mail/client/views/accounts.cjs
var require_accounts = __commonJS({
  "packages/addons/mail/client/views/accounts.cjs"(exports2, module2) {
    "use strict";
    var AccountForm = require_account_form();
    var AccountCard = require_account_card();
    var SecretField = require_secret_field();
    var providerCache = null;
    module2.exports = function Accounts(props) {
      var h = props.h;
      var React = props.React;
      var api = props.api;
      var lang = props.lang || "zh";
      var C = require_common();
      var load = C.useLoad(React, api, "mail.accountList", {}, []);
      var tableS = React.useState(providerCache);
      var openS = React.useState(null);
      var testS = React.useState({});
      var busyS = React.useState("");
      var msgS = React.useState(null);
      React.useEffect(function() {
        if (tableS[0]) return;
        C.call(api, "mail.providerList", {}).then(function(r) {
          providerCache = r;
          tableS[1](r);
        }).catch(function(e) {
          msgS[1]({ kind: "warn", text: C.errText(e) });
        });
      }, []);
      function refresh() {
        load.refresh();
      }
      function close() {
        openS[1](null);
      }
      function test(a) {
        busyS[1](a.id);
        C.call(api, "mail.accountTest", { id: a.id }).then(function(r) {
          busyS[1]("");
          testS[1](Object.assign({}, testS[0], { [a.id]: r }));
        }).catch(function(e) {
          busyS[1]("");
          msgS[1]({ kind: "warn", text: C.errText(e) });
        });
      }
      function remove(a) {
        var text = lang === "en" ? "Delete account \u201C" + (a.name || a.email) + "\u201D? The vault credential is kept." : "\u5220\u9664\u8D26\u6237\u300C" + (a.name || a.email) + "\u300D\uFF1F\u4FDD\u9669\u7BB1\u91CC\u7684\u51ED\u636E\u4F1A\u4FDD\u7559\u3002";
        if (typeof window !== "undefined" && window.confirm && !window.confirm(text)) return;
        C.call(api, "mail.accountDelete", { id: a.id }).then(function() {
          refresh();
        }).catch(function(e) {
          msgS[1]({ kind: "warn", text: C.errText(e) });
        });
      }
      var items = load.data && load.data.items || [];
      var editing = openS[0];
      var providers = tableS[0] || { providers: [] };
      var loading = load.loading || !tableS[0];
      return h(
        "div",
        { className: "wbml-page" },
        h(
          "div",
          { className: "wbml-head" },
          h("div", null, h("h2", null, lang === "en" ? "Mail accounts" : "\u90AE\u7BB1\u8D26\u6237"), h("p", { className: "wbml-sub" }, lang === "en" ? "Pick a provider, then choose an app-password credential from the vault; this page only stores its id." : "\u9009\u670D\u52A1\u5546\u3001\u518D\u4ECE\u4FDD\u9669\u7BB1\u6311\u4E00\u6761\u6388\u6743\u7801\u5373\u53EF\uFF0C\u90AE\u4EF6\u9875\u53EA\u4FDD\u5B58\u51ED\u636E id\u3002")),
          h(C.Btn, { h, kind: "primary", onClick: function() {
            openS[1]({});
          } }, lang === "en" ? "Add account" : "\u6DFB\u52A0\u8D26\u6237")
        ),
        msgS[0] ? h(C.Notice, { h, text: msgS[0].text, kind: msgS[0].kind }) : null,
        editing ? h(AccountForm, {
          h,
          React,
          api,
          C,
          lang,
          SecretField,
          providers,
          account: editing.id ? editing : null,
          onCancel: close,
          onSaved: function() {
            close();
            refresh();
          }
        }) : null,
        loading ? h(C.Empty, { h, text: lang === "en" ? "Loading\u2026" : "\u52A0\u8F7D\u4E2D\u2026" }) : items.length === 0 ? h(C.Empty, { h, text: lang === "en" ? "No accounts yet" : "\u8FD8\u6CA1\u6709\u8D26\u6237\uFF0C\u70B9\u53F3\u4E0A\u89D2\u6DFB\u52A0\u3002" }) : h(
          "div",
          { className: "wbml-cards" },
          items.map(function(a) {
            return h(AccountCard, {
              key: a.id,
              h,
              C,
              lang,
              account: a,
              test: testS[0][a.id] || null,
              busy: busyS[0] === a.id,
              onEdit: function() {
                openS[1](a);
              },
              onTest: function() {
                test(a);
              },
              onDelete: function() {
                remove(a);
              }
            });
          })
        )
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

// packages/addons/mail/client/views/data.cjs
var require_data = __commonJS({
  "packages/addons/mail/client/views/data.cjs"(exports2, module2) {
    "use strict";
    var legacy = require_legacy_data()("mail", { paged: false });
    module2.exports = require_data_view()({
      domain: "mail",
      prefix: "wbml",
      tables: ["mail_account", "mail_mailbox", "mail_message", "mail_attachment"],
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

// packages/addons/mail/client/views/actions.cjs
var require_actions = __commonJS({
  "packages/addons/mail/client/views/actions.cjs"(exports2, module2) {
    "use strict";
    module2.exports = require_action_schema_view()({
      domain: "wb-addon-mail",
      prefix: "wbml"
    }).ActionSchemaView;
  }
});

// packages/addons/mail/client/client.src.cjs
(function() {
  var root = typeof window !== "undefined" ? window : null;
  var host = root && root.__WB_HOST__;
  if (!host || !host.react) {
    module.exports = { name: "dsh-workbench-mail", inject: [], apply: function() {
    } };
    return;
  }
  var React = host.react;
  var h = host.h;
  var CSS = require_styles();
  var I = { mail: (init_mail(), __toCommonJS(mail_exports)).default, send: (init_send(), __toCommonJS(send_exports)).default, users: (init_users(), __toCommonJS(users_exports)).default, db: (init_database(), __toCommonJS(database_exports)).default, list: (init_list(), __toCommonJS(list_exports)).default };
  function Icon2(p) {
    var C = I[p.name] || I.mail;
    return h(C, { size: 14, strokeWidth: 2, className: "wbg-svg" });
  }
  function tab(n) {
    return function() {
      return h(Icon2, { name: n });
    };
  }
  function withProps(Inner, title) {
    return function(p) {
      return h(Inner, { api: p.api, lang: p.lang === "en" ? "en" : "zh", h, React, title });
    };
  }
  if (typeof document !== "undefined" && document.head && !document.getElementById("wb-mail-style")) {
    var s = document.createElement("style");
    s.id = "wb-mail-style";
    s.textContent = CSS;
    document.head.appendChild(s);
  }
  host.registerAddon({
    id: "wb-addon-mail",
    version: "0.2.6",
    icon: (init_mail(), __toCommonJS(mail_exports)).default,
    views: [
      { id: "messages", icon: tab("mail"), title: { zh: "\u90AE\u4EF6", en: "Messages" }, component: withProps(require_messages(), "\u90AE\u4EF6") },
      { id: "compose", icon: tab("send"), title: { zh: "\u5199\u4FE1", en: "Compose" }, component: withProps(require_compose(), "\u5199\u4FE1") },
      { id: "accounts", icon: tab("users"), title: { zh: "\u8D26\u6237", en: "Accounts" }, component: withProps(require_accounts(), "\u8D26\u6237") },
      { id: "data", icon: tab("db"), title: { zh: "\u6570\u636E", en: "Data" }, component: withProps(require_data(), "\u6570\u636E") },
      { id: "actions", icon: tab("list"), title: { zh: "Action", en: "Actions" }, component: withProps(require_actions(), "Action") }
    ]
  });
  module.exports = { name: "dsh-workbench-mail", inject: [], apply: function() {
  } };
})();
    return module.exports;
  },
});
