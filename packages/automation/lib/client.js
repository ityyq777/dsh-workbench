// 由 scripts/build-addon-clients.mjs 生成；请修改对应 client/client.src.cjs 后重新构建。
window.__ModuleLoader__ = window.__ModuleLoader__ || { modules: {}, load: function (m) { this.modules[m.id] = m.factory; } };
window.__ModuleLoader__.load({
  id: "dsh-workbench-automation",
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
    module2.exports = function baseStyles(prefix) {
      var p = String(prefix || "wb");
      var s = "." + p;
      return [
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
      ];
    };
  }
});

// packages/addons/automation/client/ui/layout-styles.cjs
var require_layout_styles = __commonJS({
  "packages/addons/automation/client/ui/layout-styles.cjs"(exports2, module2) {
    "use strict";
    module2.exports = [
      // 页面分区
      ".wba-panel{border:1px solid var(--wb-border);border-radius:12px;padding:16px;background:var(--wb-surface);display:flex;flex-direction:column;gap:12px}",
      ".wba-panel-h{display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap}",
      ".wba-panel-title{font-size:14px;font-weight:650;margin:0}",
      ".wba-sub{font-size:12px;color:var(--wb-muted);margin:0;line-height:1.5}",
      ".wba-sep{height:1px;background:var(--wb-border);border:0;margin:0}",
      // 表格容器与行
      ".wba-table-wrap{overflow-x:auto;border:1px solid var(--wb-border);border-radius:12px;background:var(--wb-surface)}",
      ".wba-table-wrap .wba-table{border-collapse:separate;border-spacing:0}",
      ".wba-table tbody tr{transition:background 120ms ease}",
      ".wba-table tbody tr:hover{background:var(--wb-line)}",
      ".wba-table td{vertical-align:middle}",
      ".wba-table code{font-size:11px;color:var(--wb-muted)}",
      ".wba-table tr.wba-row-open{background:var(--wb-line)}",
      ".wba-detail-cell{padding:12px 14px!important;background:color-mix(in oklab,var(--wb-line) 45%,transparent)}",
      // KPI 卡片
      ".wba-cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px}",
      ".wba-card{border:1px solid var(--wb-border);border-radius:10px;padding:12px;background:var(--wb-surface);display:flex;flex-direction:column;gap:6px}",
      ".wba-card-top{display:flex;align-items:center;justify-content:space-between;gap:8px;color:var(--wb-muted)}",
      ".wba-card-num{font-size:26px;font-weight:700;line-height:1.1;font-variant-numeric:tabular-nums}",
      ".wba-card-ico{display:flex;color:var(--wb-accent)}",
      ".wba-card-label{font-size:12px;font-weight:600}",
      ".wba-card-hint{font-size:11px;color:var(--wb-muted);margin:0}",
      // 键值 / chips
      ".wba-kv{display:grid;grid-template-columns:max-content 1fr;gap:6px 12px;font-size:12px;align-items:start}",
      ".wba-kv b{font-weight:600;color:var(--wb-muted);white-space:nowrap}",
      ".wba-kv span,.wba-kv code{min-width:0;overflow-wrap:anywhere}",
      ".wba-pills{display:flex;flex-wrap:wrap;gap:6px}",
      ".wba-chip{display:inline-flex;align-items:center;gap:4px;border:1px solid var(--wb-border);border-radius:999px;padding:2px 10px;font-size:12px;background:transparent;color:inherit;cursor:pointer;font-family:inherit}",
      ".wba-chip[aria-pressed=true]{background:var(--wb-accent);border-color:var(--wb-accent);color:var(--wb-surface)}",
      ".wba-chip.static{cursor:default}",
      ".wba-chips{display:flex;flex-wrap:wrap;gap:6px}",
      // JSON 编辑器
      ".wba-code{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:12px;line-height:1.55;width:100%;min-height:160px;resize:vertical;tab-size:2;box-sizing:border-box;padding:8px;border-radius:8px;border:1px solid var(--wb-border);background:var(--wb-line);color:inherit}",
      ".wba-code.sm{min-height:96px}",
      ".wba-code:focus-visible{outline:2px solid var(--wb-accent);outline-offset:2px}",
      ".wba-code.err{border-color:var(--wb-danger)}",
      ".wba-code-err{font-size:11px;color:var(--wb-danger);min-height:14px}",
      ".wba-pre{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:11px;line-height:1.55;margin:0;padding:10px;border-radius:8px;background:var(--wb-line);max-height:260px;overflow:auto;overflow-wrap:anywhere}",
      // 输入与按钮
      ".wba-input{width:100%;min-width:0;box-sizing:border-box;border:1px solid var(--wb-border);border-radius:8px;padding:6px 8px;font:inherit;font-size:12px;background:var(--wb-surface);color:inherit}",
      ".wba-input.err{border-color:var(--wb-danger)}",
      ".wba-toolbar{display:flex;flex-wrap:wrap;gap:8px;align-items:flex-end}",
      ".wba-toolbar .wba-field{min-width:150px}",
      ".wba-actions{display:flex;gap:4px;flex-wrap:wrap;justify-content:flex-end}",
      ".wba-icon-btn{width:28px;height:28px;display:inline-flex;align-items:center;justify-content:center;border:1px solid transparent;border-radius:7px;background:transparent;color:inherit;cursor:pointer;padding:0}",
      ".wba-icon-btn:hover{border-color:var(--wb-accent);color:var(--wb-accent)}",
      ".wba-icon-btn.danger:hover{border-color:var(--wb-danger);color:var(--wb-danger)}",
      ".wba-icon-btn:disabled{opacity:.45;cursor:default}",
      // 空态与骨架
      ".wba-empty-card{border:1px dashed var(--wb-border);border-radius:12px;padding:28px 20px;display:flex;flex-direction:column;align-items:center;gap:10px;text-align:center;background:var(--wb-surface)}",
      ".wba-empty-ico{color:var(--wb-muted);display:flex}",
      ".wba-empty-title{font-size:14px;font-weight:650;margin:0}",
      ".wba-empty-body{font-size:12px;color:var(--wb-muted);margin:0;max-width:52ch;line-height:1.55}",
      ".wba-skel{height:12px;border-radius:6px;background:var(--wb-line);animation:wba-pulse 1.2s ease-in-out infinite}",
      ".wba-skel-row{display:grid;grid-template-columns:2fr 1fr 1fr 1fr 1fr;gap:14px;padding:12px 14px;border-bottom:1px solid var(--wb-border)}",
      "@keyframes wba-pulse{50%{opacity:.45}}",
      // 模态
      ".wba-modal{position:fixed;inset:0;z-index:60;display:flex;align-items:center;justify-content:center;padding:16px;background:color-mix(in oklab,var(--wb-muted) 45%,transparent)}",
      ".wba-modal-box{width:min(760px,calc(100vw - 32px));max-height:90vh;display:flex;flex-direction:column;background:var(--wb-surface);border:1px solid var(--wb-border);border-radius:14px;overflow:hidden;box-shadow:0 24px 64px color-mix(in oklab,var(--wb-muted) 40%,transparent)}",
      ".wba-modal-head{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:12px 16px;border-bottom:1px solid var(--wb-border)}",
      ".wba-modal-head h3{font-size:15px;margin:0}",
      ".wba-modal-body{padding:16px;overflow:auto;display:flex;flex-direction:column;gap:16px}",
      ".wba-modal-foot{position:sticky;bottom:0;display:flex;align-items:center;justify-content:flex-end;gap:8px;padding:12px 16px;border-top:1px solid var(--wb-border);background:var(--wb-surface)}",
      ".wba-modal-foot .wba-grow{flex:1}",
      // 编辑器分段与栅格
      ".wba-section{display:flex;flex-direction:column;gap:10px;padding-top:14px;border-top:1px solid var(--wb-border)}",
      ".wba-section:first-child{border-top:0;padding-top:0}",
      ".wba-section-title{font-size:11px;font-weight:700;letter-spacing:.06em;color:var(--wb-muted);margin:0;text-transform:uppercase}",
      ".wba-grid-2{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}",
      ".wba-grid-3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}",
      ".wba-span-2{grid-column:span 2}",
      ".wba-seg{display:inline-flex;gap:2px;padding:2px;border:1px solid var(--wb-border);border-radius:8px;background:var(--wb-line);align-self:flex-start}",
      ".wba-seg button{border:0;background:transparent;color:inherit;border-radius:6px;padding:4px 12px;font-size:12px;font-family:inherit;cursor:pointer}",
      ".wba-seg button[aria-pressed=true]{background:var(--wb-surface);box-shadow:0 0 0 1px var(--wb-border);font-weight:600}",
      ".wba-switch{display:inline-flex;align-items:center;gap:8px;font-size:12px;cursor:pointer}",
      ".wba-block{display:flex;flex-direction:column;gap:6px;min-width:0}",
      ".wba-inline{display:flex;gap:8px;align-items:center;flex-wrap:wrap;min-width:0}",
      ".wba-grow{flex:1;min-width:0}",
      ".wba-svg{display:inline-block;vertical-align:middle;flex:none}",
      ".wba-w-120{width:120px;flex:none}",
      ".wba-w-96{width:96px;flex:none}",
      ".wba-list{margin:0;padding-left:18px;display:flex;flex-direction:column;gap:6px;font-size:12px;line-height:1.55}",
      ".wba-clickable{cursor:pointer}",
      ".wba-check{display:inline-flex;align-items:center;gap:6px;font-size:12px;cursor:pointer}",
      ".wba-check input{accent-color:var(--wb-accent);margin:0}",
      // 文本与焦点
      ".wba-ellipsis{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:100%}",
      ".wba-mono{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:11px;color:var(--wb-muted)}",
      ".wba-nowrap{white-space:nowrap}",
      ".wba-strong{font-weight:600}",
      ".wba-warn{color:var(--wb-warn)}",
      ".wba-err-text{color:var(--wb-danger);font-size:11px;margin:0}",
      ".wba-wrap :focus-visible,.wba-modal :focus-visible{outline:2px solid var(--wb-accent);outline-offset:2px}",
      // 响应式
      "@media (max-width:720px){.wba-grid-2,.wba-grid-3{grid-template-columns:1fr}.wba-span-2{grid-column:auto}.wba-modal{padding:8px}.wba-modal-box{width:calc(100vw - 16px)}.wba-toolbar .wba-field{min-width:0;flex:1 1 140px}.wba-modal-body{padding:12px}.wba-modal-foot{flex-wrap:wrap}.wba-skel-row{grid-template-columns:1fr 1fr}}"
    ].join("\n");
  }
});

// packages/addons/automation/client/ui/styles.cjs
var require_styles = __commonJS({
  "packages/addons/automation/client/ui/styles.cjs"(exports2, module2) {
    "use strict";
    module2.exports = require_client_base_styles()("wba").join("\n") + "\n" + require_layout_styles();
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

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/activity.mjs
var activity_exports = {};
__export(activity_exports, {
  __iconData: () => __iconData,
  default: () => Activity
});
var __iconData, Activity;
var init_activity = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/activity.mjs"() {
    init_createLucideIcon();
    __iconData = {
      name: "activity",
      size: 24,
      node: [
        [
          "path",
          {
            d: "M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",
            key: "169zse"
          }
        ]
      ]
    };
    __iconData.node;
    Activity = createLucideIcon(__iconData);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/zap.mjs
var zap_exports = {};
__export(zap_exports, {
  __iconData: () => __iconData2,
  default: () => Zap
});
var __iconData2, Zap;
var init_zap = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/zap.mjs"() {
    init_createLucideIcon();
    __iconData2 = {
      name: "zap",
      size: 24,
      node: [
        [
          "path",
          {
            d: "M15.914 4a1.5 1.5 0 00-2.474-1.561l-9 9A1.5 1.5 0 005.5 14h4.002a.5.5 0 01.471.666L8.086 20a1.5 1.5 0 002.475 1.56l9-9A1.5 1.5 0 0018.5 10h-3.997a.5.5 0 01-.472-.667z",
            key: "1v7up4"
          }
        ]
      ]
    };
    __iconData2.node;
    Zap = createLucideIcon(__iconData2);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/rotate-ccw-clock.mjs
var __iconData3, RotateCcwClock;
var init_rotate_ccw_clock = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/rotate-ccw-clock.mjs"() {
    init_createLucideIcon();
    __iconData3 = {
      name: "rotate-ccw-clock",
      size: 24,
      node: [
        ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", key: "1357e3" }],
        ["path", { d: "M3 3v5h5", key: "1xhq8a" }],
        ["path", { d: "M12 7v5l4 2", key: "1fdv2h" }]
      ],
      aliases: ["history"]
    };
    __iconData3.node;
    RotateCcwClock = createLucideIcon(__iconData3);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/history.mjs
var history_exports = {};
__export(history_exports, {
  default: () => RotateCcwClock
});
var init_history = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/history.mjs"() {
    init_rotate_ccw_clock();
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/sliders-horizontal.mjs
var sliders_horizontal_exports = {};
__export(sliders_horizontal_exports, {
  __iconData: () => __iconData4,
  default: () => SlidersHorizontal
});
var __iconData4, SlidersHorizontal;
var init_sliders_horizontal = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/sliders-horizontal.mjs"() {
    init_createLucideIcon();
    __iconData4 = {
      name: "sliders-horizontal",
      size: 24,
      node: [
        ["path", { d: "M10 5H3", key: "1qgfaw" }],
        ["path", { d: "M12 19H3", key: "yhmn1j" }],
        ["path", { d: "M14 3v4", key: "1sua03" }],
        ["path", { d: "M16 17v4", key: "1q0r14" }],
        ["path", { d: "M21 12h-9", key: "1o4lsq" }],
        ["path", { d: "M21 19h-5", key: "1rlt1p" }],
        ["path", { d: "M21 5h-7", key: "1oszz2" }],
        ["path", { d: "M8 10v4", key: "tgpxqk" }],
        ["path", { d: "M8 12H3", key: "a7s4jb" }]
      ]
    };
    __iconData4.node;
    SlidersHorizontal = createLucideIcon(__iconData4);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/database.mjs
var database_exports = {};
__export(database_exports, {
  __iconData: () => __iconData5,
  default: () => Database
});
var __iconData5, Database;
var init_database = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/database.mjs"() {
    init_createLucideIcon();
    __iconData5 = {
      name: "database",
      size: 24,
      node: [
        ["ellipse", { cx: "12", cy: "5", rx: "9", ry: "3", key: "msslwz" }],
        ["path", { d: "M3 5V19A9 3 0 0 0 21 19V5", key: "1wlel7" }],
        ["path", { d: "M3 12A9 3 0 0 0 21 12", key: "mv7ke4" }]
      ]
    };
    __iconData5.node;
    Database = createLucideIcon(__iconData5);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/list.mjs
var list_exports = {};
__export(list_exports, {
  __iconData: () => __iconData6,
  default: () => List
});
var __iconData6, List;
var init_list = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/list.mjs"() {
    init_createLucideIcon();
    __iconData6 = {
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
    __iconData6.node;
    List = createLucideIcon(__iconData6);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/timer.mjs
var timer_exports = {};
__export(timer_exports, {
  __iconData: () => __iconData7,
  default: () => Timer
});
var __iconData7, Timer;
var init_timer = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/timer.mjs"() {
    init_createLucideIcon();
    __iconData7 = {
      name: "timer",
      size: 24,
      node: [
        ["line", { x1: "10", x2: "14", y1: "2", y2: "2", key: "14vaq8" }],
        ["line", { x1: "12", x2: "15", y1: "14", y2: "11", key: "17fdiu" }],
        ["circle", { cx: "12", cy: "14", r: "8", key: "1e1u0o" }]
      ]
    };
    __iconData7.node;
    Timer = createLucideIcon(__iconData7);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/alarm-clock.mjs
var alarm_clock_exports = {};
__export(alarm_clock_exports, {
  __iconData: () => __iconData8,
  default: () => AlarmClock
});
var __iconData8, AlarmClock;
var init_alarm_clock = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/alarm-clock.mjs"() {
    init_createLucideIcon();
    __iconData8 = {
      name: "alarm-clock",
      size: 24,
      node: [
        ["circle", { cx: "12", cy: "13", r: "8", key: "3y4lt7" }],
        ["path", { d: "M12 9v4l2 2", key: "1c63tq" }],
        ["path", { d: "M5 3 2 6", key: "18tl5t" }],
        ["path", { d: "m22 6-3-3", key: "1opdir" }],
        ["path", { d: "M6.38 18.7 4 21", key: "17xu3x" }],
        ["path", { d: "M17.64 18.67 20 21", key: "kv2oe2" }]
      ]
    };
    __iconData8.node;
    AlarmClock = createLucideIcon(__iconData8);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/radio.mjs
var radio_exports = {};
__export(radio_exports, {
  __iconData: () => __iconData9,
  default: () => Radio
});
var __iconData9, Radio;
var init_radio = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/radio.mjs"() {
    init_createLucideIcon();
    __iconData9 = {
      name: "radio",
      size: 24,
      node: [
        ["path", { d: "M16.247 7.761a6 6 0 0 1 0 8.478", key: "1fwjs5" }],
        ["path", { d: "M19.075 4.933a10 10 0 0 1 0 14.134", key: "ehdyv1" }],
        ["path", { d: "M4.925 19.067a10 10 0 0 1 0-14.134", key: "1q22gi" }],
        ["path", { d: "M7.753 16.239a6 6 0 0 1 0-8.478", key: "r2q7qm" }],
        ["circle", { cx: "12", cy: "12", r: "2", key: "1c9p78" }]
      ]
    };
    __iconData9.node;
    Radio = createLucideIcon(__iconData9);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/hand.mjs
var hand_exports = {};
__export(hand_exports, {
  __iconData: () => __iconData10,
  default: () => Hand
});
var __iconData10, Hand;
var init_hand = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/hand.mjs"() {
    init_createLucideIcon();
    __iconData10 = {
      name: "hand",
      size: 24,
      node: [
        ["path", { d: "M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2", key: "1fvzgz" }],
        ["path", { d: "M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2", key: "1kc0my" }],
        ["path", { d: "M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8", key: "10h0bg" }],
        [
          "path",
          {
            d: "M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15",
            key: "1s1gnw"
          }
        ]
      ]
    };
    __iconData10.node;
    Hand = createLucideIcon(__iconData10);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/play.mjs
var play_exports = {};
__export(play_exports, {
  __iconData: () => __iconData11,
  default: () => Play
});
var __iconData11, Play;
var init_play = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/play.mjs"() {
    init_createLucideIcon();
    __iconData11 = {
      name: "play",
      size: 24,
      node: [
        [
          "path",
          {
            d: "M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z",
            key: "10ikf1"
          }
        ]
      ]
    };
    __iconData11.node;
    Play = createLucideIcon(__iconData11);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/pencil.mjs
var pencil_exports = {};
__export(pencil_exports, {
  __iconData: () => __iconData12,
  default: () => Pencil
});
var __iconData12, Pencil;
var init_pencil = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/pencil.mjs"() {
    init_createLucideIcon();
    __iconData12 = {
      name: "pencil",
      size: 24,
      node: [
        [
          "path",
          {
            d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
            key: "1a8usu"
          }
        ],
        ["path", { d: "m15 5 4 4", key: "1mk7zo" }]
      ]
    };
    __iconData12.node;
    Pencil = createLucideIcon(__iconData12);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/power.mjs
var power_exports = {};
__export(power_exports, {
  __iconData: () => __iconData13,
  default: () => Power
});
var __iconData13, Power;
var init_power = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/power.mjs"() {
    init_createLucideIcon();
    __iconData13 = {
      name: "power",
      size: 24,
      node: [
        ["path", { d: "M12 2v10", key: "mnfbl" }],
        ["path", { d: "M18.4 6.6a9 9 0 1 1-12.77.04", key: "obofu9" }]
      ]
    };
    __iconData13.node;
    Power = createLucideIcon(__iconData13);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/power-off.mjs
var power_off_exports = {};
__export(power_off_exports, {
  __iconData: () => __iconData14,
  default: () => PowerOff
});
var __iconData14, PowerOff;
var init_power_off = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/power-off.mjs"() {
    init_createLucideIcon();
    __iconData14 = {
      name: "power-off",
      size: 24,
      node: [
        ["path", { d: "M18.36 6.64A9 9 0 0 1 20.77 15", key: "dxknvb" }],
        ["path", { d: "M6.16 6.16a9 9 0 1 0 12.68 12.68", key: "1x7qb5" }],
        ["path", { d: "M12 2v4", key: "3427ic" }],
        ["path", { d: "m2 2 20 20", key: "1ooewy" }]
      ]
    };
    __iconData14.node;
    PowerOff = createLucideIcon(__iconData14);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/trash.mjs
var __iconData15, Trash;
var init_trash = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/trash.mjs"() {
    init_createLucideIcon();
    __iconData15 = {
      name: "trash",
      size: 24,
      node: [
        ["path", { d: "M10 11v6", key: "nco0om" }],
        ["path", { d: "M14 11v6", key: "outv1u" }],
        ["path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6", key: "miytrc" }],
        ["path", { d: "M3 6h18", key: "d0wm0j" }],
        ["path", { d: "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2", key: "e791ji" }]
      ],
      aliases: ["trash-2"]
    };
    __iconData15.node;
    Trash = createLucideIcon(__iconData15);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/trash-2.mjs
var trash_2_exports = {};
__export(trash_2_exports, {
  default: () => Trash
});
var init_trash_2 = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/trash-2.mjs"() {
    init_trash();
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/x.mjs
var x_exports = {};
__export(x_exports, {
  __iconData: () => __iconData16,
  default: () => X
});
var __iconData16, X;
var init_x = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/x.mjs"() {
    init_createLucideIcon();
    __iconData16 = {
      name: "x",
      size: 24,
      node: [
        ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
        ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
      ]
    };
    __iconData16.node;
    X = createLucideIcon(__iconData16);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/circle-check-big.mjs
var __iconData17, CircleCheckBig;
var init_circle_check_big = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/circle-check-big.mjs"() {
    init_createLucideIcon();
    __iconData17 = {
      name: "circle-check-big",
      size: 24,
      node: [
        ["path", { d: "M21.801 10A10 10 0 1 1 17 3.335", key: "yps3ct" }],
        ["path", { d: "m9 11 3 3L22 4", key: "1pflzl" }]
      ],
      aliases: ["check-circle"]
    };
    __iconData17.node;
    CircleCheckBig = createLucideIcon(__iconData17);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/check-circle.mjs
var check_circle_exports = {};
__export(check_circle_exports, {
  default: () => CircleCheckBig
});
var init_check_circle = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/check-circle.mjs"() {
    init_circle_check_big();
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/triangle-exclamation-point.mjs
var __iconData18, TriangleExclamationPoint;
var init_triangle_exclamation_point = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/triangle-exclamation-point.mjs"() {
    init_createLucideIcon();
    __iconData18 = {
      name: "triangle-exclamation-point",
      size: 24,
      node: [
        [
          "path",
          {
            d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",
            key: "wmoenq"
          }
        ],
        ["path", { d: "M12 9v4", key: "juzpu7" }],
        ["path", { d: "M12 17h.01", key: "p32p05" }]
      ],
      aliases: ["alert-triangle", "triangle-alert"]
    };
    __iconData18.node;
    TriangleExclamationPoint = createLucideIcon(__iconData18);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/alert-triangle.mjs
var alert_triangle_exports = {};
__export(alert_triangle_exports, {
  default: () => TriangleExclamationPoint
});
var init_alert_triangle = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/alert-triangle.mjs"() {
    init_triangle_exclamation_point();
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/skip-forward.mjs
var skip_forward_exports = {};
__export(skip_forward_exports, {
  __iconData: () => __iconData19,
  default: () => SkipForward
});
var __iconData19, SkipForward;
var init_skip_forward = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/skip-forward.mjs"() {
    init_createLucideIcon();
    __iconData19 = {
      name: "skip-forward",
      size: 24,
      node: [
        ["path", { d: "M21 4v16", key: "7j8fe9" }],
        [
          "path",
          {
            d: "M6.029 4.285A2 2 0 0 0 3 6v12a2 2 0 0 0 3.029 1.715l9.997-5.998a2 2 0 0 0 .003-3.432z",
            key: "zs4d6"
          }
        ]
      ]
    };
    __iconData19.node;
    SkipForward = createLucideIcon(__iconData19);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/layers.mjs
var layers_exports = {};
__export(layers_exports, {
  __iconData: () => __iconData20,
  default: () => Layers
});
var __iconData20, Layers;
var init_layers = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/layers.mjs"() {
    init_createLucideIcon();
    __iconData20 = {
      name: "layers",
      size: 24,
      node: [
        [
          "path",
          {
            d: "M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z",
            key: "zw3jo"
          }
        ],
        [
          "path",
          {
            d: "M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12",
            key: "1wduqc"
          }
        ],
        [
          "path",
          {
            d: "M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17",
            key: "kqbvx6"
          }
        ]
      ],
      aliases: ["layers-3"]
    };
    __iconData20.node;
    Layers = createLucideIcon(__iconData20);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/shield-check.mjs
var shield_check_exports = {};
__export(shield_check_exports, {
  __iconData: () => __iconData21,
  default: () => ShieldCheck
});
var __iconData21, ShieldCheck;
var init_shield_check = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/shield-check.mjs"() {
    init_createLucideIcon();
    __iconData21 = {
      name: "shield-check",
      size: 24,
      node: [
        [
          "path",
          {
            d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
            key: "oel41y"
          }
        ],
        ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
      ]
    };
    __iconData21.node;
    ShieldCheck = createLucideIcon(__iconData21);
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

// packages/addons/automation/client/ui/common.cjs
var require_common = __commonJS({
  "packages/addons/automation/client/ui/common.cjs"(exports2, module2) {
    "use strict";
    module2.exports = require_client_common()("wba");
  }
});

// packages/addons/automation/client/ui/copy.cjs
var require_copy = __commonJS({
  "packages/addons/automation/client/ui/copy.cjs"(exports2, module2) {
    "use strict";
    var WEEKDAYS = [1, 2, 3, 4, 5, 6, 7];
    var DICT = {
      zh: {
        "common.save": "\u4FDD\u5B58",
        "common.cancel": "\u53D6\u6D88",
        "common.close": "\u5173\u95ED",
        "common.refresh": "\u5237\u65B0",
        "common.retry": "\u91CD\u8BD5",
        "common.delete": "\u5220\u9664",
        "common.edit": "\u7F16\u8F91",
        "common.create": "\u65B0\u5EFA\u89C4\u5219",
        "common.run": "\u7ACB\u5373\u8FD0\u884C",
        "common.enable": "\u542F\u7528",
        "common.disable": "\u505C\u7528",
        "common.search": "\u641C\u7D22",
        "common.clear": "\u6E05\u9664",
        "common.all": "\u5168\u90E8",
        "common.loading": "\u52A0\u8F7D\u4E2D\u2026",
        "common.none": "\u2014",
        "common.saved": "\u5DF2\u4FDD\u5B58",
        "rules.title": "\u89C4\u5219",
        "rules.subtitle": "\u5B9A\u65F6\u3001\u57DF\u4E8B\u4EF6\u6216\u624B\u52A8\u89E6\u53D1\uFF1B\u53EA\u8C03\u7528\u767D\u540D\u5355 action\uFF1B\u6BCF\u89C4\u5219\u6BCF\u5C0F\u65F6\u9650\u9891\u3001\u5168\u5C40\u5E76\u53D1 2\u3002",
        "rules.searchPh": "\u641C\u7D22\u540D\u79F0\u6216 action",
        "rules.filterStatus": "\u72B6\u6001",
        "rules.filterTrigger": "\u89E6\u53D1\u65B9\u5F0F",
        "rules.triggerCol": "\u89E6\u53D1",
        "rules.status.on": "\u542F\u7528",
        "rules.status.off": "\u505C\u7528",
        "rules.col.name": "\u540D\u79F0",
        "rules.col.trigger": "\u89E6\u53D1\u65B9\u5F0F",
        "rules.col.action": "\u6267\u884C Action",
        "rules.col.status": "\u72B6\u6001",
        "rules.col.lastRun": "\u4E0A\u6B21\u8FD0\u884C",
        "rules.col.ops": "\u64CD\u4F5C",
        "rules.empty.title": "\u8FD8\u6CA1\u6709\u89C4\u5219",
        "rules.empty.body": "\u521B\u5EFA\u4E00\u6761\u89C4\u5219\uFF0C\u628A\u5B9A\u65F6\u6216\u57DF\u4E8B\u4EF6\u63A5\u5230\u767D\u540D\u5355 action \u4E0A\u3002",
        "rules.empty.backup": "\u89C4\u5219\u53EF\u4EE5\u968F\u5907\u4EFD\u5BFC\u5165\u5BFC\u51FA\uFF1B\u8FD0\u884C\u8BB0\u5F55\u53EA\u4FDD\u7559\u5728\u672C\u673A\u3002",
        "rules.empty.filtered": "\u6CA1\u6709\u5339\u914D\u7684\u89C4\u5219",
        "rules.empty.filteredBody": "\u6362\u4E2A\u5173\u952E\u8BCD\uFF0C\u6216\u6E05\u9664\u8FC7\u6EE4\u6761\u4EF6\u3002",
        "rules.confirm.delete": "\u5220\u9664\u89C4\u5219\u300C{name}\u300D\uFF1F\u5220\u9664\u540E\u4E0D\u53EF\u6062\u590D\u3002",
        "rules.running": "\u8FD0\u884C\u4E2D\u2026",
        "trigger.interval": "\u95F4\u9694",
        "trigger.dailyAt": "\u6BCF\u5929",
        "trigger.event": "\u4E8B\u4EF6",
        "trigger.manual": "\u624B\u52A8",
        "trigger.interval.text": "\u6BCF {n} \u5206\u949F",
        "trigger.interval.textHours": "\u6BCF {n} \u5C0F\u65F6",
        "trigger.daily.text": "\u6BCF\u5929 {time}\uFF08{tz}\uFF09",
        "trigger.event.text": "\u4E8B\u4EF6 {domain}/{event}",
        "trigger.manual.text": "\u624B\u52A8\u89E6\u53D1",
        "trigger.every": "\u6BCF",
        "trigger.minutes": "\u5206\u949F",
        "trigger.hours": "\u5C0F\u65F6",
        "trigger.intervalHint": "1\u201310080 \u5206\u949F\uFF1B\u5C0F\u65F6\u6309 \xD760 \u6298\u7B97\u3002",
        "trigger.time": "\u65F6\u95F4\uFF08HH:MM\uFF09",
        "trigger.tz": "\u65F6\u533A",
        "trigger.weekdays": "\u661F\u671F",
        "trigger.weekdaysHint": "\u5168\u4E0D\u9009\u8868\u793A\u6BCF\u5929\uFF1B1=\u5468\u4E00 \u2026 7=\u5468\u65E5\u3002",
        "trigger.wd.1": "\u4E00",
        "trigger.wd.2": "\u4E8C",
        "trigger.wd.3": "\u4E09",
        "trigger.wd.4": "\u56DB",
        "trigger.wd.5": "\u4E94",
        "trigger.wd.6": "\u516D",
        "trigger.wd.7": "\u65E5",
        "trigger.domain": "\u57DF id",
        "trigger.eventName": "\u4E8B\u4EF6\u540D",
        "trigger.eventHint": "\u5E38\u7528\uFF1Awb-addon-connector / wb-addon-message / wb-addon-tasks\u3002",
        "trigger.manualHint": "\u53EA\u5728\u89C4\u5219\u9875\u70B9\u300C\u8FD0\u884C\u300D\u6216\u7531\u811A\u672C\u624B\u52A8\u89E6\u53D1\u65F6\u6267\u884C\u3002",
        "editor.newTitle": "\u65B0\u5EFA\u89C4\u5219",
        "editor.editTitle": "\u7F16\u8F91\u89C4\u5219",
        "editor.section.basic": "\u57FA\u672C\u4FE1\u606F",
        "editor.section.trigger": "\u89E6\u53D1",
        "editor.section.run": "\u6267\u884C",
        "editor.section.condition": "\u6761\u4EF6\uFF08\u53EF\u9009\uFF09",
        "editor.name": "\u540D\u79F0",
        "editor.namePh": "\u4F8B\u5982\uFF1A\u6BCF\u65E5\u6D88\u606F\u6C47\u603B",
        "editor.nameRequired": "\u540D\u79F0\u4E0D\u80FD\u4E3A\u7A7A",
        "editor.enabled": "\u542F\u7528",
        "editor.action": "Action",
        "editor.showExample": "\u67E5\u770B\u53C2\u6570\u793A\u4F8B",
        "editor.fillExample": "\u586B\u5165\u793A\u4F8B",
        "editor.exampleHint": "\u793A\u4F8B\u4F1A\u8986\u76D6\u5F53\u524D JSON\uFF0C\u786E\u8BA4\u540E\u586B\u5165\u3002",
        "editor.insertVar": "\u63D2\u5165\u53D8\u91CF",
        "editor.argsHint": "JSON \u5BF9\u8C61\uFF1B\u6A21\u677F\u53D8\u91CF {{rule.name}}\u3001{{event.item.title}}\u3001{{item.url}}\u3002",
        "editor.conditionOn": "\u542F\u7528\u6761\u4EF6",
        "editor.conditionHint": "op \u53D6\u503C eq / neq / contains / gt / lt\uFF1Bfield \u53EA\u80FD\u662F\u6570\u636E\u8DEF\u5F84\uFF0C\u5982 event.item.title\u3002",
        "editor.conditionEmpty": "\u5173\u95ED\u6761\u4EF6\u65F6\u63D0\u4EA4 null\u3002",
        "editor.jsonInvalid": "JSON \u975E\u6CD5\uFF1A{msg}",
        "editor.nameEmptySave": "\u586B\u5199\u540D\u79F0\u540E\u53EF\u4FDD\u5B58",
        "editor.discard": "\u6709\u672A\u4FDD\u5B58\u7684\u4FEE\u6539\uFF0C\u786E\u5B9A\u5173\u95ED\uFF1F",
        "editor.format": "\u683C\u5F0F\u5316",
        "editor.argsObject": "actionArgs \u5FC5\u987B\u662F JSON \u5BF9\u8C61",
        "editor.conditionObject": "\u6761\u4EF6\u5FC5\u987B\u662F JSON \u5BF9\u8C61",
        "editor.exampleTitle": "\u53C2\u6570\u793A\u4F8B",
        "editor.ruleFallbackHint": "\u89E6\u53D1\u5668\u6BCF 30 \u79D2\u626B\u63CF\u4E00\u6B21\uFF0C\u5355\u6B21\u6700\u591A\u6267\u884C 3 \u6761\u3002",
        "runs.title": "\u8FD0\u884C\u8BB0\u5F55",
        "runs.subtitle": "\u53EA\u5728\u672C\u673A\u4FDD\u7559\uFF0C\u4E0D\u968F\u5907\u4EFD\u540C\u6B65\uFF1B\u70B9\u51FB\u884C\u67E5\u770B\u8BE6\u60C5\u3002",
        "runs.limitNote": "\u6700\u8FD1 200 \u6761",
        "runs.filterRule": "\u89C4\u5219",
        "runs.filterStatus": "\u72B6\u6001",
        "runs.col.status": "\u72B6\u6001",
        "runs.col.rule": "\u89C4\u5219",
        "runs.col.trigger": "\u89E6\u53D1",
        "runs.col.start": "\u5F00\u59CB",
        "runs.col.cost": "\u8017\u65F6",
        "runs.col.summary": "\u7ED3\u679C\u6458\u8981",
        "run.status.ok": "\u6210\u529F",
        "run.status.error": "\u5931\u8D25",
        "run.status.skipped": "\u8DF3\u8FC7",
        "runs.detail.title": "\u8FD0\u884C\u8BE6\u60C5",
        "runs.detail.id": "\u8FD0\u884C id",
        "runs.detail.trigger": "\u89E6\u53D1",
        "runs.detail.start": "\u5F00\u59CB",
        "runs.detail.finish": "\u7ED3\u675F",
        "runs.detail.cost": "\u8017\u65F6",
        "runs.detail.error": "\u9519\u8BEF",
        "runs.detail.result": "\u7ED3\u679C JSON",
        "runs.detail.noError": "\u65E0\u9519\u8BEF",
        "runs.empty.title": "\u8FD8\u6CA1\u6709\u8FD0\u884C\u8BB0\u5F55",
        "runs.empty.body": "\u89C4\u5219\u8FD0\u884C\u540E\uFF0C\u8FD9\u91CC\u4FDD\u7559\u6700\u8FD1 200 \u6761\u8BB0\u5F55\u4E0E\u9519\u8BEF\u4FE1\u606F\u3002",
        "stats.title": "\u81EA\u52A8\u5316",
        "stats.subtitle": "\u628A\u5B9A\u65F6\u3001\u57DF\u4E8B\u4EF6\u6216\u624B\u52A8\u64CD\u4F5C\u63A5\u5230\u767D\u540D\u5355 action\uFF1A\u6A21\u677F\u3001\u6761\u4EF6\u3001\u9650\u9891\u4E0E\u8FD0\u884C\u8BB0\u5F55\u3002",
        "stats.kpi.total": "\u89C4\u5219\u603B\u6570",
        "stats.kpi.totalHint": "\u672A\u5220\u9664\u7684\u89C4\u5219",
        "stats.kpi.enabled": "\u5DF2\u542F\u7528",
        "stats.kpi.enabledHint": "enabled=1 \u7684\u89C4\u5219",
        "stats.kpi.ok": "\u4ECA\u65E5\u6210\u529F",
        "stats.kpi.okHint": "\u8FD1 24 \u5C0F\u65F6 status=ok",
        "stats.kpi.error": "\u4ECA\u65E5\u5931\u8D25",
        "stats.kpi.errorHint": "\u8FD1 24 \u5C0F\u65F6 status=error",
        "stats.kpi.skipped": "\u4ECA\u65E5\u8DF3\u8FC7",
        "stats.kpi.skippedHint": "\u6761\u4EF6\u4E0D\u6EE1\u8DB3\u3001\u8D85\u9650\u6216\u5E76\u53D1\u5DF2\u6EE1",
        "stats.allowed": "\u5141\u8BB8\u8C03\u7528",
        "stats.allowedHint": "\u540E\u7AEF\u767D\u540D\u5355\uFF0C\u5171 5 \u4E2A action",
        "stats.denied": "\u4E0D\u5141\u8BB8\u8C03\u7528",
        "stats.deniedHint": "vault / automation / audit \u4E0E\u4EFB\u4F55\u5220\u9664\u3001\u5907\u4EFD\u7C7B action",
        "stats.triggers": "\u89E6\u53D1\u65B9\u5F0F",
        "stats.trigger.interval": "\u6BCF N \u5206\u949F\u6309 next_run_at \u5230\u671F\u6267\u884C\u3002",
        "stats.trigger.dailyAt": "\u6309\u65F6\u95F4\u4E0E\u65F6\u533A\u8BA1\u7B97\u4E0B\u4E00\u6B21\uFF0C\u53EF\u9009\u661F\u671F\u3002",
        "stats.trigger.event": "\u5BBF\u4E3B domain-event \u547D\u4E2D domainId + event \u65F6\u6267\u884C\u3002",
        "stats.trigger.manual": "\u5728\u89C4\u5219\u9875\u70B9\u300C\u8FD0\u884C\u300D\uFF0C\u4ECD\u53D7\u767D\u540D\u5355\u3001\u6761\u4EF6\u4E0E\u9650\u9891\u7EA6\u675F\u3002",
        "config.title": "\u8BBE\u7F6E",
        "config.subtitle": "\u9650\u6D41\u53C2\u6570\u4FDD\u5B58\u5728\u672C\u673A meta\uFF1B\u89C4\u5219\u4E0E\u5176\u5B83\u4E1A\u52A1\u6570\u636E\u4E00\u8D77\u53C2\u4E0E\u5907\u4EFD\u3002",
        "config.limit.title": "\u9650\u6D41",
        "config.limit.maxRules": "\u89C4\u5219\u6570\u91CF\u4E0A\u9650",
        "config.limit.perHour": "\u6BCF\u89C4\u5219\u6BCF\u5C0F\u65F6\u4E0A\u9650",
        "config.limit.hint": "\u89C4\u5219\u4E0A\u9650 1\u2013500\uFF1B\u6BCF\u5C0F\u65F6\u4E0A\u9650 1\u2013600\u3002\u8D85\u9650\u7684\u521B\u5EFA\u88AB\u62D2\uFF0C\u8D85\u9891\u7684\u8FD0\u884C\u8BB0 skipped\u3002",
        "config.limit.unchanged": "\u5F53\u524D\u503C\u4E0E\u5DF2\u4FDD\u5B58\u4E00\u81F4",
        "config.constraints.title": "\u8FD0\u884C\u7EA6\u675F",
        "config.c.strategy": "\u5B9A\u65F6\u5668\u6BCF 30 \u79D2\u68C0\u67E5\u4E00\u6B21\uFF0C\u5355\u6B21\u6700\u591A\u53D6 3 \u6761\u5230\u671F\u89C4\u5219\u3002",
        "config.c.concurrency": "\u5168\u5C40\u5E76\u53D1 2\uFF1B\u5E76\u53D1\u5DF2\u6EE1\u65F6\u5B9A\u65F6\u89E6\u53D1\u8BB0 skipped\uFF0C\u4E0D\u6392\u961F\u91CD\u8BD5\u3002",
        "config.c.event": "\u4E8B\u4EF6\u89E6\u53D1\u7531\u5BBF\u4E3B domain-event \u9A71\u52A8\uFF0Cpayload \u4E3A {domainId,event,data}\u3002",
        "config.c.condition": "\u6761\u4EF6\u4E0D\u6EE1\u8DB3\u8BB0 skipped\uFF0C\u4E0D\u8C03\u7528 action\u3002",
        "config.c.backup": "\u89C4\u5219\u968F\u5907\u4EFD\u8FC1\u79FB\uFF1B\u8FD0\u884C\u8BB0\u5F55\u53EA\u5728\u672C\u673A\uFF0C\u4E0D\u53C2\u4E0E\u4E91\u540C\u6B65\u3002",
        "config.c.safety": "\u4E0D\u5141\u8BB8\u8C03\u7528 vault.*\u3001automation.*\u3001audit.* \u6216\u4EFB\u4F55 delete/backup action\u3002"
      },
      en: {
        "common.save": "Save",
        "common.cancel": "Cancel",
        "common.close": "Close",
        "common.refresh": "Refresh",
        "common.retry": "Retry",
        "common.delete": "Delete",
        "common.edit": "Edit",
        "common.create": "New rule",
        "common.run": "Run now",
        "common.enable": "Enable",
        "common.disable": "Disable",
        "common.search": "Search",
        "common.clear": "Clear",
        "common.all": "All",
        "common.loading": "Loading\u2026",
        "common.none": "\u2014",
        "common.saved": "Saved",
        "rules.title": "Rules",
        "rules.subtitle": "Interval, domain event or manual; whitelisted actions only; per-rule hourly limit, global concurrency 2.",
        "rules.searchPh": "Search name or action",
        "rules.filterStatus": "Status",
        "rules.filterTrigger": "Trigger",
        "rules.triggerCol": "Trigger",
        "rules.status.on": "Enabled",
        "rules.status.off": "Disabled",
        "rules.col.name": "Name",
        "rules.col.trigger": "Trigger",
        "rules.col.action": "Action",
        "rules.col.status": "Status",
        "rules.col.lastRun": "Last run",
        "rules.col.ops": "Actions",
        "rules.empty.title": "No rules yet",
        "rules.empty.body": "Create a rule to connect a schedule or domain event to a whitelisted action.",
        "rules.empty.backup": "Rules travel with backups; run history stays on this device.",
        "rules.empty.filtered": "No matching rules",
        "rules.empty.filteredBody": "Try another keyword, or clear the filters.",
        "rules.confirm.delete": 'Delete rule "{name}"? This cannot be undone.',
        "rules.running": "Running\u2026",
        "trigger.interval": "Interval",
        "trigger.dailyAt": "Daily",
        "trigger.event": "Event",
        "trigger.manual": "Manual",
        "trigger.interval.text": "Every {n} min",
        "trigger.interval.textHours": "Every {n} h",
        "trigger.daily.text": "Daily at {time} ({tz})",
        "trigger.event.text": "Event {domain}/{event}",
        "trigger.manual.text": "Manual",
        "trigger.every": "Every",
        "trigger.minutes": "minutes",
        "trigger.hours": "hours",
        "trigger.intervalHint": "1\u201310080 minutes; hours are converted by \xD760.",
        "trigger.time": "Time (HH:MM)",
        "trigger.tz": "Time zone",
        "trigger.weekdays": "Weekdays",
        "trigger.weekdaysHint": "None selected means every day; 1=Mon \u2026 7=Sun.",
        "trigger.wd.1": "Mon",
        "trigger.wd.2": "Tue",
        "trigger.wd.3": "Wed",
        "trigger.wd.4": "Thu",
        "trigger.wd.5": "Fri",
        "trigger.wd.6": "Sat",
        "trigger.wd.7": "Sun",
        "trigger.domain": "Domain id",
        "trigger.eventName": "Event name",
        "trigger.eventHint": "Common: wb-addon-connector / wb-addon-message / wb-addon-tasks.",
        "trigger.manualHint": 'Runs only via "Run now" or a manual script call.',
        "editor.newTitle": "New rule",
        "editor.editTitle": "Edit rule",
        "editor.section.basic": "Basics",
        "editor.section.trigger": "Trigger",
        "editor.section.run": "Action",
        "editor.section.condition": "Condition (optional)",
        "editor.name": "Name",
        "editor.namePh": "e.g. Daily digest",
        "editor.nameRequired": "Name is required",
        "editor.enabled": "Enabled",
        "editor.action": "Action",
        "editor.showExample": "View example args",
        "editor.fillExample": "Fill example",
        "editor.exampleHint": "The example replaces the current JSON after confirmation.",
        "editor.insertVar": "Insert variable",
        "editor.argsHint": "JSON object; template variables {{rule.name}}, {{event.item.title}}, {{item.url}}.",
        "editor.conditionOn": "Enable condition",
        "editor.conditionHint": "op: eq / neq / contains / gt / lt; field is a data path such as event.item.title.",
        "editor.conditionEmpty": "Submits null when the condition is off.",
        "editor.jsonInvalid": "Invalid JSON: {msg}",
        "editor.nameEmptySave": "Enter a name to save",
        "editor.discard": "Discard unsaved changes?",
        "editor.format": "Format",
        "editor.argsObject": "actionArgs must be a JSON object",
        "editor.conditionObject": "Condition must be a JSON object",
        "editor.exampleTitle": "Example args",
        "editor.ruleFallbackHint": "The trigger scans every 30 seconds, at most 3 rules per scan.",
        "runs.title": "Run history",
        "runs.subtitle": "Local only, not synced with backups; click a row for details.",
        "runs.limitNote": "Latest 200",
        "runs.filterRule": "Rule",
        "runs.filterStatus": "Status",
        "runs.col.status": "Status",
        "runs.col.rule": "Rule",
        "runs.col.trigger": "Trigger",
        "runs.col.start": "Started",
        "runs.col.cost": "Duration",
        "runs.col.summary": "Summary",
        "run.status.ok": "OK",
        "run.status.error": "Failed",
        "run.status.skipped": "Skipped",
        "runs.detail.title": "Run details",
        "runs.detail.id": "Run id",
        "runs.detail.trigger": "Trigger",
        "runs.detail.start": "Started",
        "runs.detail.finish": "Finished",
        "runs.detail.cost": "Duration",
        "runs.detail.error": "Error",
        "runs.detail.result": "Result JSON",
        "runs.detail.noError": "No error",
        "runs.empty.title": "No runs yet",
        "runs.empty.body": "Once rules run, the latest 200 runs and errors are kept here.",
        "stats.title": "Automation",
        "stats.subtitle": "Connect schedules, domain events or manual actions to whitelisted actions: templates, conditions, limits and history.",
        "stats.kpi.total": "Rules",
        "stats.kpi.totalHint": "Not deleted",
        "stats.kpi.enabled": "Enabled",
        "stats.kpi.enabledHint": "enabled=1",
        "stats.kpi.ok": "OK today",
        "stats.kpi.okHint": "Last 24h status=ok",
        "stats.kpi.error": "Failed today",
        "stats.kpi.errorHint": "Last 24h status=error",
        "stats.kpi.skipped": "Skipped today",
        "stats.kpi.skippedHint": "Condition, rate limit or concurrency",
        "stats.allowed": "Allowed",
        "stats.allowedHint": "Backend whitelist, 5 actions",
        "stats.denied": "Denied",
        "stats.deniedHint": "vault / automation / audit and any delete or backup action",
        "stats.triggers": "Triggers",
        "stats.trigger.interval": "Runs when next_run_at is due every N minutes.",
        "stats.trigger.dailyAt": "Next run from time and time zone, optional weekdays.",
        "stats.trigger.event": "A host domain-event matching domainId + event.",
        "stats.trigger.manual": '"Run now" on the rules page, still subject to whitelist, conditions and limits.',
        "config.title": "Settings",
        "config.subtitle": "Limits are stored in local meta; rules are part of regular backups.",
        "config.limit.title": "Rate limits",
        "config.limit.maxRules": "Max rules",
        "config.limit.perHour": "Runs per rule per hour",
        "config.limit.hint": "Rules 1\u2013500; runs per hour 1\u2013600. Excess creation is rejected, excess runs are recorded as skipped.",
        "config.limit.unchanged": "Matches the saved value",
        "config.constraints.title": "Runtime constraints",
        "config.c.strategy": "The timer checks every 30 seconds and picks at most 3 due rules.",
        "config.c.concurrency": "Global concurrency 2; when full, scheduled triggers are recorded as skipped without retry.",
        "config.c.event": "Events come from the host domain-event bus; payload is {domainId,event,data}.",
        "config.c.condition": "A false condition records skipped and does not call the action.",
        "config.c.backup": "Rules travel with backups; run history stays on this device and is not synced.",
        "config.c.safety": "vault.*, automation.*, audit.* and any delete/backup action are refused."
      }
    };
    function t(lang, key, vars) {
      var table = DICT[lang === "en" ? "en" : "zh"];
      var text = table[key];
      if (text === void 0) text = DICT.zh[key];
      if (text === void 0) return key;
      if (!vars) return text;
      return text.replace(/\{(\w+)\}/g, function(m, name) {
        return vars[name] === void 0 ? m : String(vars[name]);
      });
    }
    module2.exports = { t, DICT, WEEKDAYS };
  }
});

// packages/addons/automation/client/views/stats.cjs
var require_stats = __commonJS({
  "packages/addons/automation/client/views/stats.cjs"(exports2, module2) {
    "use strict";
    var C = require_common();
    var copy = require_copy();
    var DENIED = ["vault.*", "automation.*", "audit.*", "*.delete", "*.backup"];
    function kpiRows(s) {
      var today = s && s.today || {};
      return [
        ["total", "layers", s && s.total || 0, "stats.kpi.total", "stats.kpi.totalHint"],
        ["enabled", "power", s && s.enabled || 0, "stats.kpi.enabled", "stats.kpi.enabledHint"],
        ["ok", "check-circle", today.ok || 0, "stats.kpi.ok", "stats.kpi.okHint"],
        ["error", "alert-triangle", today.error || 0, "stats.kpi.error", "stats.kpi.errorHint"],
        ["skipped", "skip-forward", today.skipped || 0, "stats.kpi.skipped", "stats.kpi.skippedHint"]
      ];
    }
    function StatsBody(props) {
      var h = props.h;
      var t = props.t;
      var icon = props.icon;
      return h(
        "div",
        { className: "wba-panel" },
        h("div", { className: "wba-cards" }, kpiRows(props.s).map(function(k) {
          return h(
            "div",
            { key: k[0], className: "wba-card" },
            h(
              "div",
              { className: "wba-card-top" },
              h("span", { className: "wba-card-label" }, t(k[3])),
              icon ? h("span", { className: "wba-card-ico" }, icon(k[1], 18)) : null
            ),
            h("div", { className: "wba-card-num" }, String(k[2])),
            h("p", { className: "wba-card-hint" }, t(k[4]))
          );
        })),
        h(
          "div",
          { className: "wba-panel" },
          h(
            "div",
            { className: "wba-panel-h" },
            h("p", { className: "wba-panel-title" }, t("stats.allowed")),
            h("span", { className: "wba-hint" }, t("stats.allowedHint"))
          ),
          h("div", { className: "wba-pills" }, (props.actions || []).map(function(a) {
            return h("span", { key: a, className: "wba-chip static" }, h("code", null, a));
          }))
        ),
        h(
          "div",
          { className: "wba-panel" },
          h(
            "div",
            { className: "wba-panel-h" },
            h("p", { className: "wba-panel-title" }, t("stats.denied")),
            h("span", { className: "wba-hint" }, t("stats.deniedHint"))
          ),
          h("div", { className: "wba-pills" }, DENIED.map(function(a) {
            return h("span", { key: a, className: "wba-chip static wba-mono" }, a);
          }))
        ),
        h(
          "div",
          { className: "wba-panel" },
          h("p", { className: "wba-panel-title" }, t("stats.triggers")),
          h("div", { className: "wba-kv" }, ["interval", "dailyAt", "event", "manual"].map(function(k) {
            return [h("b", { key: k + "-k" }, t("trigger." + k)), h("span", { key: k + "-v" }, t("stats.trigger." + k))];
          }))
        )
      );
    }
    module2.exports = function StatsView(props) {
      var h = props.h;
      var api = props.api;
      var React = props.React;
      var lang = props.lang === "en" ? "en" : "zh";
      var t = function(key, vars) {
        return copy.t(lang, key, vars);
      };
      var stats = C.useLoad(React, api, "automation.stats", {}, []);
      var opts = C.useLoad(React, api, "automation.actionOptions", {}, []);
      var s = stats.data || { total: 0, enabled: 0, today: {} };
      return h(
        "div",
        { className: "wba-wrap" },
        h(
          "div",
          { className: "wba-head" },
          h(
            "div",
            null,
            h("h2", { className: "wba-title" }, t("stats.title")),
            h("p", { className: "wba-sub" }, t("stats.subtitle"))
          ),
          h(
            "div",
            { className: "wba-row" },
            h(C.Btn, { h, onClick: function() {
              stats.refresh();
              opts.refresh();
            } }, t("common.refresh")),
            h(C.Btn, { h, kind: "primary", onClick: function() {
              if (props.onNavigate) props.onNavigate("rules", { new: true });
            } }, t("common.create"))
          )
        ),
        stats.error ? h(C.Notice, { h, kind: "error", text: stats.error }) : null,
        stats.loading ? h("div", { className: "wba-cards" }, [0, 1, 2, 3, 4].map(function(i) {
          return h("div", { key: i, className: "wba-card" }, h("div", { className: "wba-skel" }));
        })) : h(StatsBody, { h, t, icon: props.icon, s, actions: opts.data && opts.data.actions || [] })
      );
    };
    module2.exports.StatsBody = StatsBody;
    module2.exports.DENIED = DENIED;
  }
});

// packages/addons/automation/client/views/trigger-fields.cjs
var require_trigger_fields = __commonJS({
  "packages/addons/automation/client/views/trigger-fields.cjs"(exports2, module2) {
    "use strict";
    var copy = require_copy();
    var TZ_LIST = ["Asia/Shanghai", "UTC", "Asia/Tokyo", "Europe/London", "America/New_York"];
    var DOMAIN_HINTS = ["wb-addon-connector", "wb-addon-message", "wb-addon-tasks", "wb-addon-sites"];
    var EVENT_HINTS = ["item.created", "message.sent", "task.created", "site.created"];
    function daysOf(value) {
      return String(value || "").split(",").map(function(x) {
        return Number(String(x).trim());
      }).filter(function(n) {
        return n >= 1 && n <= 7;
      });
    }
    function triggerText(rule, t) {
      var c = rule && rule.triggerConfig || {};
      var kind = c.kind || rule && rule.triggerType || "manual";
      if (kind === "interval") {
        var n = Number(c.everyMinutes) || 60;
        return n % 60 === 0 && n >= 60 ? t("trigger.interval.textHours", { n: n / 60 }) : t("trigger.interval.text", { n });
      }
      if (kind === "dailyAt") return t("trigger.daily.text", { time: c.time || "09:00", tz: c.tz || "UTC" });
      if (kind === "event") return t("trigger.event.text", { domain: c.domainId || "?", event: c.event || "?" });
      return t("trigger.manual.text");
    }
    function TriggerFields(props) {
      var h = props.h;
      var t = props.t;
      var form = props.form;
      var set = props.set;
      var errs = props.errs || {};
      var icon = props.icon;
      function unitOf(minutes) {
        var n = Number(minutes) || 60;
        return n >= 60 && n % 60 === 0 ? 60 : 1;
      }
      function changeUnit(unit2) {
        var n = Number(form.everyMinutes) || 60;
        if (unit2 === 60) set("everyMinutes", Math.max(1, Math.min(10080, Math.round(n / 60) * 60)));
        else set("everyMinutes", Math.max(1, Math.min(10080, n)));
      }
      function toggleDay(day) {
        var days2 = daysOf(form.weekdays);
        var i = days2.indexOf(day);
        if (i === -1) days2.push(day);
        else days2.splice(i, 1);
        days2.sort(function(a, b) {
          return a - b;
        });
        set("weekdays", days2.join(","));
      }
      var kinds = [
        ["interval", "timer", t("trigger.interval")],
        ["dailyAt", "alarm-clock", t("trigger.dailyAt")],
        ["event", "radio", t("trigger.event")],
        ["manual", "hand", t("trigger.manual")]
      ];
      var unit = unitOf(form.everyMinutes);
      var days = daysOf(form.weekdays);
      return h(
        "div",
        { className: "wba-block" },
        h(
          "div",
          { className: "wba-seg", role: "group" },
          kinds.map(function(k) {
            return h("button", {
              key: k[0],
              type: "button",
              "aria-pressed": form.kind === k[0],
              onClick: function() {
                set("kind", k[0]);
              }
            }, icon ? h("span", { className: "wba-inline" }, icon(k[1], 12), k[2]) : k[2]);
          })
        ),
        form.kind === "interval" ? h(
          "div",
          { className: "wba-grid-2" },
          h(
            "label",
            { className: "wba-field" },
            h("span", { className: "wba-label" }, t("trigger.every")),
            h(
              "div",
              { className: "wba-inline" },
              h("input", {
                className: "wba-input wba-w-120" + (errs.everyMinutes ? " err" : ""),
                type: "number",
                min: 1,
                max: 10080,
                step: unit,
                value: form.everyMinutes,
                "aria-label": t("trigger.every"),
                onChange: function(e) {
                  set("everyMinutes", e.target.value);
                }
              }),
              h(
                "select",
                {
                  className: "wba-input wba-w-96",
                  value: unit,
                  "aria-label": t("trigger.minutes"),
                  onChange: function(e) {
                    changeUnit(Number(e.target.value));
                  }
                },
                h("option", { value: 1 }, t("trigger.minutes")),
                h("option", { value: 60 }, t("trigger.hours"))
              )
            ),
            errs.everyMinutes ? h("span", { className: "wba-err-text" }, errs.everyMinutes) : h("span", { className: "wba-hint" }, t("trigger.intervalHint"))
          )
        ) : null,
        form.kind === "dailyAt" ? h(
          "div",
          { className: "wba-grid-3" },
          h(
            "label",
            { className: "wba-field" },
            h("span", { className: "wba-label" }, t("trigger.time")),
            h("input", { className: "wba-input" + (errs.time ? " err" : ""), type: "time", value: form.time, onChange: function(e) {
              set("time", e.target.value);
            } }),
            errs.time ? h("span", { className: "wba-err-text" }, errs.time) : null
          ),
          h(
            "label",
            { className: "wba-field" },
            h("span", { className: "wba-label" }, t("trigger.tz")),
            h(
              "select",
              { className: "wba-input", value: form.tz, onChange: function(e) {
                set("tz", e.target.value);
              } },
              (TZ_LIST.indexOf(form.tz) === -1 ? [form.tz].concat(TZ_LIST) : TZ_LIST).map(function(z) {
                return h("option", { key: z, value: z }, z);
              })
            )
          ),
          h(
            "div",
            { className: "wba-field" },
            h("span", { className: "wba-label" }, t("trigger.weekdays")),
            h(
              "div",
              { className: "wba-chips" },
              copy.WEEKDAYS.map(function(d) {
                return h("button", {
                  key: d,
                  type: "button",
                  className: "wba-chip",
                  "aria-pressed": days.indexOf(d) !== -1,
                  onClick: function() {
                    toggleDay(d);
                  }
                }, t("trigger.wd." + d));
              })
            ),
            h("span", { className: "wba-hint" }, t("trigger.weekdaysHint"))
          )
        ) : null,
        form.kind === "event" ? h(
          "div",
          { className: "wba-grid-2" },
          h(
            "label",
            { className: "wba-field" },
            h("span", { className: "wba-label" }, t("trigger.domain")),
            h("input", {
              className: "wba-input" + (errs.domainId ? " err" : ""),
              value: form.domainId,
              list: "wba-domain-hints",
              placeholder: "wb-addon-connector",
              onChange: function(e) {
                set("domainId", e.target.value);
              }
            }),
            h("datalist", { id: "wba-domain-hints" }, DOMAIN_HINTS.map(function(d) {
              return h("option", { key: d, value: d });
            })),
            errs.domainId ? h("span", { className: "wba-err-text" }, errs.domainId) : h("span", { className: "wba-hint" }, t("trigger.eventHint"))
          ),
          h(
            "label",
            { className: "wba-field" },
            h("span", { className: "wba-label" }, t("trigger.eventName")),
            h("input", {
              className: "wba-input" + (errs.event ? " err" : ""),
              value: form.event,
              list: "wba-event-hints",
              placeholder: "item.created",
              onChange: function(e) {
                set("event", e.target.value);
              }
            }),
            h("datalist", { id: "wba-event-hints" }, EVENT_HINTS.map(function(d) {
              return h("option", { key: d, value: d });
            })),
            errs.event ? h("span", { className: "wba-err-text" }, errs.event) : null
          )
        ) : null,
        form.kind === "manual" ? h("p", { className: "wba-sub" }, t("trigger.manualHint")) : null
      );
    }
    module2.exports = { TriggerFields, triggerText, daysOf, TZ_LIST };
  }
});

// packages/addons/automation/client/views/json-editor.cjs
var require_json_editor = __commonJS({
  "packages/addons/automation/client/views/json-editor.cjs"(exports2, module2) {
    "use strict";
    var VARS = ["{{rule.name}}", "{{rule.id}}", "{{event.at}}", "{{event.item.title}}", "{{item.title}}", "{{item.url}}"];
    function parseJsonSafe(text) {
      var raw = String(text == null ? "" : text).trim();
      if (!raw) return { ok: true, value: void 0, error: "" };
      try {
        return { ok: true, value: JSON.parse(raw), error: "" };
      } catch (e) {
        return { ok: false, value: void 0, error: e && e.message ? e.message : String(e) };
      }
    }
    function formatJson(text) {
      var r = parseJsonSafe(text);
      if (!r.ok) return null;
      return JSON.stringify(r.value, null, 2);
    }
    function JsonEditor(props) {
      var h = props.h;
      var t = props.t;
      var React = props.React;
      var value = props.value;
      var onChange = props.onChange;
      var ref = React.useRef(null);
      var vars = props.vars === false ? [] : props.vars || VARS;
      function insert(text) {
        var el = ref.current;
        if (!el) {
          onChange(value + text);
          return;
        }
        var start = typeof el.selectionStart === "number" ? el.selectionStart : value.length;
        var end = typeof el.selectionEnd === "number" ? el.selectionEnd : start;
        onChange(value.slice(0, start) + text + value.slice(end));
        if (typeof window !== "undefined" && typeof window.requestAnimationFrame === "function") {
          window.requestAnimationFrame(function() {
            try {
              el.focus();
              el.setSelectionRange(start + text.length, start + text.length);
            } catch (e) {
            }
          });
        }
      }
      return h(
        "div",
        { className: "wba-block" },
        h(
          "div",
          { className: "wba-inline" },
          h("span", { className: "wba-label" }, props.label || ""),
          props.action ? h("span", { className: "wba-grow" }) : null,
          props.action || null
        ),
        vars.length ? h(
          "div",
          { className: "wba-inline" },
          h("span", { className: "wba-hint" }, t("editor.insertVar")),
          h("div", { className: "wba-chips" }, vars.map(function(v) {
            return h("button", {
              key: v,
              type: "button",
              className: "wba-chip",
              onClick: function() {
                insert(v);
              }
            }, v);
          }))
        ) : null,
        h("textarea", {
          ref,
          className: "wba-code" + (props.small ? " sm" : "") + (props.invalid ? " err" : ""),
          value,
          spellCheck: false,
          autoComplete: "off",
          "aria-invalid": props.invalid ? "true" : "false",
          "aria-label": props.label || "JSON",
          onChange: function(e) {
            onChange(e.target.value);
          },
          onKeyDown: function(e) {
            if (e.key === "Tab") {
              e.preventDefault();
              insert("  ");
            }
          }
        }),
        h("div", { className: "wba-code-err", "aria-live": "polite" }, props.invalid ? props.error || t("editor.jsonInvalid", { msg: "JSON" }) : ""),
        props.hint ? h("span", { className: "wba-hint" }, props.hint) : null
      );
    }
    module2.exports = { JsonEditor, parseJsonSafe, formatJson, VARS };
  }
});

// packages/addons/automation/client/views/rule-editor.cjs
var require_rule_editor = __commonJS({
  "packages/addons/automation/client/views/rule-editor.cjs"(exports2, module2) {
    "use strict";
    var trig = require_trigger_fields();
    var json = require_json_editor();
    var EXAMPLES = {
      "message.send": { title: "\u81EA\u52A8\u5316\u63D0\u9192", body: "\u89C4\u5219 {{rule.name}} \u5DF2\u8FD0\u884C" },
      "tasks.create": { title: "\u6765\u81EA\u81EA\u52A8\u5316\u7684\u8DDF\u8FDB", description: "\u89C4\u5219 {{rule.name}} \u89E6\u53D1" },
      "tags.create": { name: "\u81EA\u52A8\u5316" },
      "sites.create": { title: "{{item.title}}", url: "{{item.url}}" },
      "connector.sourceRun": { sourceId: "{{event.data.sourceId}}" }
    };
    function plain(text) {
      var r = json.parseJsonSafe(text);
      if (!r.ok) return { ok: false, error: r.error };
      if (r.value === void 0) return { ok: true, value: {} };
      if (!r.value || typeof r.value !== "object" || Array.isArray(r.value)) return { ok: false, error: "object" };
      return { ok: true, value: r.value };
    }
    function validateForm(form, t) {
      var errs = {};
      if (!String(form.name || "").trim()) errs.name = t("editor.nameRequired");
      var args = plain(form.actionArgs);
      if (!args.ok) errs.actionArgs = args.error === "object" ? t("editor.argsObject") : t("editor.jsonInvalid", { msg: args.error });
      var cond = null;
      if (form.condOn) {
        cond = plain(form.condition);
        if (!cond.ok) errs.condition = cond.error === "object" ? t("editor.conditionObject") : t("editor.jsonInvalid", { msg: cond.error });
      }
      if (form.kind === "interval") {
        var n = Number(form.everyMinutes);
        if (!n || n < 1 || n > 10080) errs.everyMinutes = t("trigger.intervalHint");
      }
      if (form.kind === "dailyAt" && !/^\d{2}:\d{2}$/.test(String(form.time || ""))) errs.time = t("trigger.time");
      if (form.kind === "event") {
        if (!String(form.domainId || "").trim()) errs.domainId = t("trigger.domain");
        if (!String(form.event || "").trim()) errs.event = t("trigger.eventName");
      }
      return { errs, valid: Object.keys(errs).length === 0 };
    }
    function buildPayload(form) {
      var triggerConfig = { kind: form.kind };
      if (form.kind === "interval") triggerConfig.everyMinutes = Number(form.everyMinutes) || 60;
      if (form.kind === "dailyAt") {
        triggerConfig.time = form.time;
        triggerConfig.tz = form.tz;
        triggerConfig.weekdays = trig.daysOf(form.weekdays);
      }
      if (form.kind === "event") {
        triggerConfig.domainId = String(form.domainId || "").trim();
        triggerConfig.event = String(form.event || "").trim();
      }
      var args = plain(form.actionArgs);
      if (!args.ok) throw new Error("actionArgs \u4E0D\u662F\u5408\u6CD5 JSON");
      var condition = null;
      if (form.condOn && String(form.condition || "").trim()) {
        var cond = plain(form.condition);
        if (!cond.ok) throw new Error("\u6761\u4EF6\u4E0D\u662F\u5408\u6CD5 JSON");
        condition = cond.value;
      }
      return {
        id: form.id || void 0,
        name: String(form.name || "").trim(),
        enabled: Boolean(form.enabled),
        triggerType: form.kind === "event" ? "event" : form.kind === "manual" ? "manual" : "schedule",
        triggerConfig,
        actionName: form.actionName,
        actionArgs: args.value,
        condition
      };
    }
    function snapshot(form) {
      try {
        return JSON.stringify(buildPayload(form));
      } catch (e) {
        return JSON.stringify({ name: form.name, actionArgs: form.actionArgs, condition: form.condition, kind: form.kind });
      }
    }
    function RuleEditor(props) {
      var h = props.h;
      var C = props.C;
      var t = props.t;
      var React = props.React;
      var form = props.form;
      var set = props.set;
      var busy = props.busy;
      var actions = props.actions || [];
      var icon = props.icon;
      var initial = props.initial;
      var validation = validateForm(form, t);
      var errs = validation.errs;
      var exampleS = React.useState(false);
      var touchedS = React.useState(Boolean(form.name));
      var showNameErr = touchedS[0] && Boolean(errs.name);
      var actionName = actions.indexOf(form.actionName) === -1 ? [form.actionName].concat(actions) : actions;
      var example = EXAMPLES[form.actionName];
      React.useEffect(function() {
        var prev = typeof document !== "undefined" ? document.body.style.overflow : "";
        if (typeof document !== "undefined") document.body.style.overflow = "hidden";
        function onKey(e) {
          if (e.key === "Escape") close();
        }
        if (typeof window !== "undefined") window.addEventListener("keydown", onKey);
        return function() {
          if (typeof document !== "undefined") document.body.style.overflow = prev;
          if (typeof window !== "undefined") window.removeEventListener("keydown", onKey);
        };
      });
      function dirty() {
        return snapshot(form) !== snapshot(initial || form);
      }
      function close() {
        if (dirty() && typeof window !== "undefined" && !window.confirm(t("editor.discard"))) return;
        props.onClose();
      }
      return h(
        "div",
        { className: "wba-modal", onClick: function(e) {
          if (e.target === e.currentTarget) close();
        } },
        h(
          "div",
          { className: "wba-modal-box", role: "dialog", "aria-modal": "true" },
          h(
            "div",
            { className: "wba-modal-head" },
            h("h3", null, form.id ? t("editor.editTitle") : t("editor.newTitle")),
            h("button", { type: "button", className: "wba-icon-btn", title: t("common.close"), onClick: close }, icon ? icon("x", 15) : "\xD7")
          ),
          h(
            "div",
            { className: "wba-modal-body" },
            h(
              "div",
              { className: "wba-section" },
              h("p", { className: "wba-section-title" }, "\u2460 " + t("editor.section.basic")),
              h(
                "div",
                { className: "wba-grid-3" },
                h(
                  "label",
                  { className: "wba-field wba-span-2" },
                  h("span", { className: "wba-label" }, t("editor.name")),
                  h("input", {
                    className: "wba-input" + (showNameErr ? " err" : ""),
                    value: form.name,
                    placeholder: t("editor.namePh"),
                    onChange: function(e) {
                      touchedS[1](true);
                      set("name", e.target.value);
                    }
                  }),
                  showNameErr ? h("span", { className: "wba-err-text" }, errs.name) : null
                ),
                h(
                  "div",
                  { className: "wba-field" },
                  h("span", { className: "wba-label" }, t("editor.enabled")),
                  h(
                    "label",
                    { className: "wba-switch" },
                    h("input", { type: "checkbox", checked: form.enabled, onChange: function(e) {
                      set("enabled", e.target.checked);
                    } }),
                    h("span", null, form.enabled ? t("rules.status.on") : t("rules.status.off"))
                  )
                )
              )
            ),
            h(
              "div",
              { className: "wba-section" },
              h("p", { className: "wba-section-title" }, "\u2461 " + t("editor.section.trigger")),
              h(trig.TriggerFields, { h, t, form, set, errs, icon })
            ),
            h(
              "div",
              { className: "wba-section" },
              h("p", { className: "wba-section-title" }, "\u2462 " + t("editor.section.run")),
              h(
                "div",
                { className: "wba-inline" },
                h(
                  "label",
                  { className: "wba-field" },
                  h("span", { className: "wba-label" }, t("editor.action")),
                  h(
                    "select",
                    { className: "wba-input", value: form.actionName, onChange: function(e) {
                      set("actionName", e.target.value);
                    } },
                    actionName.map(function(a) {
                      return h("option", { key: a, value: a }, a);
                    })
                  )
                ),
                h("span", { className: "wba-grow" }),
                example ? h(C.Btn, { h, onClick: function() {
                  exampleS[1](!exampleS[0]);
                } }, t("editor.showExample")) : null
              ),
              exampleS[0] && example ? h(
                "div",
                { className: "wba-block" },
                h("span", { className: "wba-label" }, t("editor.exampleTitle")),
                h("pre", { className: "wba-pre" }, JSON.stringify(example, null, 2)),
                h(
                  "div",
                  { className: "wba-inline" },
                  h(C.Btn, { h, onClick: function() {
                    if (typeof window !== "undefined" && !window.confirm(t("editor.exampleHint"))) return;
                    set("actionArgs", JSON.stringify(example, null, 2));
                  } }, t("editor.fillExample")),
                  h("span", { className: "wba-grow" })
                )
              ) : null,
              h(json.JsonEditor, {
                h,
                t,
                React,
                label: "actionArgs",
                hint: t("editor.argsHint"),
                value: form.actionArgs,
                invalid: Boolean(errs.actionArgs),
                error: errs.actionArgs,
                onChange: function(v) {
                  set("actionArgs", v);
                },
                action: h(C.Btn, { h, onClick: function() {
                  var next = json.formatJson(form.actionArgs);
                  if (next) set("actionArgs", next);
                } }, t("editor.format"))
              })
            ),
            h(
              "div",
              { className: "wba-section" },
              h("p", { className: "wba-section-title" }, "\u2463 " + t("editor.section.condition")),
              h(
                "label",
                { className: "wba-switch" },
                h("input", { type: "checkbox", checked: Boolean(form.condOn), onChange: function(e) {
                  set("condOn", e.target.checked);
                } }),
                h("span", null, t("editor.conditionOn"))
              ),
              h("p", { className: "wba-sub" }, t("editor.conditionHint")),
              form.condOn ? h(json.JsonEditor, {
                h,
                t,
                React,
                small: true,
                vars: false,
                label: "condition",
                value: form.condition,
                invalid: Boolean(errs.condition),
                error: errs.condition,
                onChange: function(v) {
                  set("condition", v);
                }
              }) : h("p", { className: "wba-sub" }, t("editor.conditionEmpty"))
            )
          ),
          h(
            "div",
            { className: "wba-modal-foot" },
            h("span", { className: "wba-sub wba-grow" }, validation.valid ? "" : errs.name || errs.actionArgs || errs.condition || t("editor.nameEmptySave")),
            h(C.Btn, { h, onClick: close }, t("common.cancel")),
            h(
              C.Btn,
              { h, kind: "primary", disabled: busy || !validation.valid, onClick: function() {
                props.onSave(buildPayload(form));
              } },
              busy ? t("common.loading") : t("common.save")
            )
          )
        )
      );
    }
    module2.exports = { RuleEditor, buildPayload, validateForm, EXAMPLES };
  }
});

// packages/addons/automation/client/views/rules.cjs
var require_rules = __commonJS({
  "packages/addons/automation/client/views/rules.cjs"(exports2, module2) {
    "use strict";
    var C = require_common();
    var copy = require_copy();
    var trig = require_trigger_fields();
    var editor = require_rule_editor();
    var TRIGGER_ICON = { interval: "timer", dailyAt: "alarm-clock", event: "radio", manual: "hand" };
    function emptyForm() {
      return {
        id: "",
        name: "",
        enabled: true,
        kind: "interval",
        everyMinutes: 60,
        time: "09:00",
        tz: "Asia/Shanghai",
        weekdays: "1,2,3,4,5",
        domainId: "",
        event: "",
        actionName: "message.send",
        actionArgs: '{\n  "title": "\u81EA\u52A8\u5316\u63D0\u9192",\n  "body": "\u89C4\u5219 {{rule.name}} \u5DF2\u8FD0\u884C"\n}',
        condOn: false,
        condition: '{\n  "field": "event.item.title",\n  "op": "contains",\n  "value": ""\n}'
      };
    }
    function formFromRule(rule) {
      var f = emptyForm();
      f.id = rule.id;
      f.name = rule.name;
      f.enabled = rule.enabled;
      f.actionName = rule.actionName;
      f.actionArgs = JSON.stringify(rule.actionArgs || {}, null, 2);
      f.condOn = Boolean(rule.condition);
      f.condition = rule.condition ? JSON.stringify(rule.condition, null, 2) : f.condition;
      var tc = rule.triggerConfig || {};
      f.kind = tc.kind || "manual";
      if (tc.kind === "interval") f.everyMinutes = tc.everyMinutes || 60;
      if (tc.kind === "dailyAt") {
        f.time = tc.time || "09:00";
        f.tz = tc.tz || "Asia/Shanghai";
        f.weekdays = (tc.weekdays || [1, 2, 3, 4, 5]).join(",");
      }
      if (tc.kind === "event") {
        f.domainId = tc.domainId || "";
        f.event = tc.event || "";
      }
      return f;
    }
    function filterRules(rows, filters) {
      var q = String(filters && filters.q || "").trim().toLowerCase();
      var status = filters && filters.status || "";
      var trigger = filters && filters.trigger || "";
      return rows.filter(function(r) {
        if (q && !(String(r.name).toLowerCase().indexOf(q) !== -1 || String(r.actionName).toLowerCase().indexOf(q) !== -1)) return false;
        if (status === "on" && !r.enabled) return false;
        if (status === "off" && r.enabled) return false;
        if (trigger && (r.triggerConfig && r.triggerConfig.kind ? r.triggerConfig.kind : r.triggerType) !== trigger) return false;
        return true;
      });
    }
    function resultKind(status) {
      if (status === "ok") return "ok";
      if (status === "error") return "error";
      if (status === "skipped") return "warn";
      return "";
    }
    function EmptyCard(props) {
      var h = props.h;
      var t = props.t;
      var icon = props.icon;
      return h(
        "div",
        { className: "wba-empty-card" },
        icon ? h("span", { className: "wba-empty-ico" }, icon("zap", 36)) : null,
        h("p", { className: "wba-empty-title" }, props.title),
        h("p", { className: "wba-empty-body" }, props.body),
        h(
          "div",
          { className: "wba-inline" },
          h(C.Btn, { h, kind: "primary", onClick: props.onNew }, t("common.create"))
        ),
        h("p", { className: "wba-empty-body" }, t("rules.empty.backup"))
      );
    }
    function RulesBody(props) {
      var h = props.h;
      var t = props.t;
      var icon = props.icon;
      var rows = props.rows;
      var filters = props.filters || {};
      return h(
        "div",
        { className: "wba-panel" },
        h(
          "div",
          { className: "wba-toolbar" },
          h(
            "label",
            { className: "wba-field" },
            h("span", { className: "wba-label" }, t("common.search")),
            h("input", {
              className: "wba-input",
              type: "search",
              value: filters.q || "",
              placeholder: t("rules.searchPh"),
              onChange: function(e) {
                props.onFilter({ q: e.target.value });
              }
            })
          ),
          h(
            "label",
            { className: "wba-field" },
            h("span", { className: "wba-label" }, t("rules.filterStatus")),
            h(
              "select",
              { className: "wba-input", value: filters.status || "", onChange: function(e) {
                props.onFilter({ status: e.target.value });
              } },
              h("option", { value: "" }, t("common.all")),
              h("option", { value: "on" }, t("rules.status.on")),
              h("option", { value: "off" }, t("rules.status.off"))
            )
          ),
          h(
            "label",
            { className: "wba-field" },
            h("span", { className: "wba-label" }, t("rules.filterTrigger")),
            h(
              "select",
              { className: "wba-input", value: filters.trigger || "", onChange: function(e) {
                props.onFilter({ trigger: e.target.value });
              } },
              h("option", { value: "" }, t("common.all")),
              ["interval", "dailyAt", "event", "manual"].map(function(k) {
                return h("option", { key: k, value: k }, t("trigger." + k));
              })
            )
          ),
          h("span", { className: "wba-grow" }),
          h(C.Btn, { h, onClick: props.onClear }, t("common.clear"))
        ),
        props.error ? h(C.Notice, { h, kind: "error", text: props.error }) : null,
        props.loading ? h(
          "div",
          { className: "wba-table-wrap" },
          h("div", { className: "wba-skel-row" }, [1, 2, 3, 4, 5].map(function(i) {
            return h("div", { key: i, className: "wba-skel" });
          })),
          h("div", { className: "wba-skel-row" }, [1, 2, 3, 4, 5].map(function(i) {
            return h("div", { key: i, className: "wba-skel" });
          })),
          h("div", { className: "wba-skel-row" }, [1, 2, 3, 4, 5].map(function(i) {
            return h("div", { key: i, className: "wba-skel" });
          }))
        ) : rows.length === 0 ? h(EmptyCard, {
          h,
          t,
          icon,
          title: props.hasRules ? t("rules.empty.filtered") : t("rules.empty.title"),
          body: props.hasRules ? t("rules.empty.filteredBody") : t("rules.empty.body"),
          onNew: props.onNew
        }) : h(
          "div",
          { className: "wba-table-wrap" },
          h(
            "table",
            { className: "wba-table" },
            h("thead", null, h(
              "tr",
              null,
              ["name", "trigger", "action", "status", "lastRun", "ops"].map(function(k) {
                return h("th", { key: k }, t("rules.col." + k));
              })
            )),
            h("tbody", null, rows.map(function(r) {
              var kind = r.triggerConfig && r.triggerConfig.kind || r.triggerType || "manual";
              var last = r.lastRun;
              var cells = [
                h(
                  "td",
                  null,
                  h("div", { className: "wba-strong wba-ellipsis", title: r.name }, r.name),
                  h("div", { className: "wba-mono" }, r.id)
                ),
                h(
                  "td",
                  { className: "wba-nowrap" },
                  h(
                    "span",
                    { className: "wba-inline" },
                    icon ? icon(TRIGGER_ICON[kind] || "zap", 13) : null,
                    trig.triggerText(r, t)
                  )
                ),
                h("td", null, h("code", { className: "wba-ellipsis", title: r.actionName }, r.actionName)),
                h("td", null, h(C.Pill, { h, kind: r.enabled ? "ok" : "" }, r.enabled ? t("rules.status.on") : t("rules.status.off"))),
                h(
                  "td",
                  { className: "wba-nowrap" },
                  h(
                    "div",
                    { className: "wba-inline" },
                    h("span", null, last ? C.fmtTime(last.startedAt, props.lang) : t("common.none")),
                    last ? h(C.Pill, { h, kind: resultKind(last.status) }, t("run.status." + last.status) || last.status) : null
                  )
                ),
                h("td", null, h(
                  "div",
                  { className: "wba-actions" },
                  h("button", { type: "button", className: "wba-icon-btn", title: t("common.run"), disabled: props.runningId === r.id, onClick: function() {
                    props.onRun(r);
                  } }, icon ? icon("play", 14) : "\u25B6"),
                  h("button", { type: "button", className: "wba-icon-btn", title: t("common.edit"), onClick: function() {
                    props.onEdit(r);
                  } }, icon ? icon("pencil", 14) : "\u270E"),
                  h("button", { type: "button", className: "wba-icon-btn", title: r.enabled ? t("common.disable") : t("common.enable"), onClick: function() {
                    props.onToggle(r);
                  } }, icon ? icon(r.enabled ? "power-off" : "power", 14) : "\u23FB"),
                  h("button", { type: "button", className: "wba-icon-btn danger", title: t("common.delete"), onClick: function() {
                    props.onDelete(r);
                  } }, icon ? icon("trash-2", 14) : "\u{1F5D1}")
                ))
              ];
              return h("tr", { key: r.id }, cells);
            }))
          )
        )
      );
    }
    module2.exports = function RulesView(props) {
      var h = props.h;
      var api = props.api;
      var React = props.React;
      var lang = props.lang === "en" ? "en" : "zh";
      var t = function(key, vars) {
        return copy.t(lang, key, vars);
      };
      var list = C.useLoad(React, api, "automation.ruleList", {}, []);
      var opts = C.useLoad(React, api, "automation.actionOptions", {}, []);
      var formS = React.useState(null);
      var initS = React.useState(null);
      var busyS = React.useState(false);
      var msgS = React.useState("");
      var filterS = React.useState({ q: "", status: "", trigger: "" });
      var runningS = React.useState("");
      var all = list.data && list.data.items || [];
      var rows = filterRules(all, filterS[0]);
      var actions = opts.data && opts.data.actions || ["message.send"];
      var form = formS[0];
      React.useEffect(function() {
        if (props.viewParams && props.viewParams.new && !formS[0]) openNew();
      }, [props.viewParams]);
      function fail(e) {
        msgS[1](C.errText(e));
      }
      function openNew() {
        var f = emptyForm();
        initS[1](f);
        formS[1](f);
        msgS[1]("");
      }
      function save(payload) {
        busyS[1](true);
        msgS[1]("");
        var action = payload.id ? "automation.ruleUpdate" : "automation.ruleCreate";
        C.call(api, action, payload).then(function() {
          busyS[1](false);
          formS[1](null);
          list.refresh();
          msgS[1](t("common.saved"));
        }).catch(function(e) {
          busyS[1](false);
          fail(e);
        });
      }
      function remove(rule) {
        if (typeof window !== "undefined" && !window.confirm(t("rules.confirm.delete", { name: rule.name }))) return;
        C.call(api, "automation.ruleDelete", { id: rule.id }).then(function() {
          list.refresh();
        }).catch(fail);
      }
      function run(rule) {
        runningS[1](rule.id);
        msgS[1]("");
        C.call(api, "automation.ruleRun", { id: rule.id }).then(function(r) {
          runningS[1]("");
          msgS[1](r && r.skipped ? "skipped: " + (r.reason || "") : t("common.saved"));
          list.refresh();
        }).catch(function(e) {
          runningS[1]("");
          fail(e);
        });
      }
      function toggle(rule) {
        C.call(api, "automation.ruleUpdate", { id: rule.id, enabled: !rule.enabled }).then(function() {
          list.refresh();
        }).catch(fail);
      }
      function setForm(k, v) {
        var next = Object.assign({}, formS[0]);
        next[k] = v;
        formS[1](next);
      }
      return h(
        "div",
        { className: "wba-wrap" },
        h(
          "div",
          { className: "wba-head" },
          h(
            "div",
            null,
            h("h2", { className: "wba-title" }, t("rules.title")),
            h("p", { className: "wba-sub" }, t("rules.subtitle"))
          ),
          h(
            "div",
            { className: "wba-row" },
            h(C.Btn, { h, onClick: list.refresh }, t("common.refresh")),
            h(C.Btn, { h, kind: "primary", onClick: openNew }, t("common.create"))
          )
        ),
        h(C.Notice, { h, text: msgS[0], kind: "info" }),
        h(RulesBody, {
          h,
          t,
          lang,
          icon: props.icon,
          rows,
          hasRules: all.length > 0,
          loading: list.loading,
          error: list.error,
          filters: filterS[0],
          runningId: runningS[0],
          onFilter: function(patch) {
            filterS[1](Object.assign({}, filterS[0], patch));
          },
          onClear: function() {
            filterS[1]({ q: "", status: "", trigger: "" });
          },
          onNew: openNew,
          onRun: run,
          onEdit: function(r) {
            var f = formFromRule(r);
            initS[1](f);
            formS[1](f);
          },
          onToggle: toggle,
          onDelete: remove
        }),
        form ? h(editor.RuleEditor, {
          h,
          C,
          t,
          React,
          lang,
          icon: props.icon,
          form,
          initial: initS[0],
          set: setForm,
          busy: busyS[0],
          actions,
          onClose: function() {
            formS[1](null);
          },
          onSave: save
        }) : null
      );
    };
    module2.exports.filterRules = filterRules;
    module2.exports.RulesBody = RulesBody;
    module2.exports.emptyForm = emptyForm;
    module2.exports.formFromRule = formFromRule;
  }
});

// packages/addons/automation/client/views/runs.cjs
var require_runs = __commonJS({
  "packages/addons/automation/client/views/runs.cjs"(exports2, module2) {
    "use strict";
    var C = require_common();
    var copy = require_copy();
    var LIMIT = 200;
    function cost(run) {
      if (!run || !run.finishedAt) return "\u2014";
      var ms = Math.max(0, Number(run.finishedAt) - Number(run.startedAt));
      return ms < 1e3 ? ms + "ms" : (ms / 1e3).toFixed(1) + "s";
    }
    function resultKind(status) {
      if (status === "ok") return "ok";
      if (status === "error") return "error";
      if (status === "skipped") return "warn";
      return "";
    }
    function asText(value) {
      if (value === null || value === void 0 || value === "") return "";
      if (typeof value === "string") return value;
      try {
        return JSON.stringify(value, null, 2);
      } catch (e) {
        return String(value);
      }
    }
    function summary(run) {
      var text = run.error ? run.error : asText(run.result);
      return String(text).replace(/\s+/g, " ").slice(0, 80) || "\u2014";
    }
    function RunsBody(props) {
      var h = props.h;
      var t = props.t;
      var icon = props.icon;
      var rows = props.rows;
      return h(
        "div",
        { className: "wba-panel" },
        h(
          "div",
          { className: "wba-toolbar" },
          h(
            "label",
            { className: "wba-field" },
            h("span", { className: "wba-label" }, t("runs.filterRule")),
            h(
              "select",
              { className: "wba-input", value: props.ruleId || "", onChange: function(e) {
                props.onRule(e.target.value);
              } },
              h("option", { value: "" }, t("common.all")),
              (props.rules || []).map(function(r) {
                return h("option", { key: r.id, value: r.id }, r.name);
              })
            )
          ),
          h(
            "label",
            { className: "wba-field" },
            h("span", { className: "wba-label" }, t("runs.filterStatus")),
            h(
              "select",
              { className: "wba-input", value: props.status || "", onChange: function(e) {
                props.onStatus(e.target.value);
              } },
              h("option", { value: "" }, t("common.all")),
              ["ok", "error", "skipped"].map(function(k) {
                return h("option", { key: k, value: k }, k);
              })
            )
          ),
          h("span", { className: "wba-grow" }),
          h("span", { className: "wba-mono" }, t("runs.limitNote"))
        ),
        props.error ? h(C.Notice, { h, kind: "error", text: props.error }) : null,
        props.loading ? h(
          "div",
          { className: "wba-table-wrap" },
          [0, 1, 2].map(function(i) {
            return h("div", { key: i, className: "wba-skel-row" }, [1, 2, 3, 4, 5].map(function(j) {
              return h("div", { key: j, className: "wba-skel" });
            }));
          })
        ) : rows.length === 0 ? h(
          "div",
          { className: "wba-empty-card" },
          icon ? h("span", { className: "wba-empty-ico" }, icon("history", 34)) : null,
          h("p", { className: "wba-empty-title" }, t("runs.empty.title")),
          h("p", { className: "wba-empty-body" }, t("runs.empty.body"))
        ) : h(
          "div",
          { className: "wba-table-wrap" },
          h(
            "table",
            { className: "wba-table" },
            h("thead", null, h(
              "tr",
              null,
              ["status", "rule", "trigger", "start", "cost", "summary"].map(function(k) {
                return h("th", { key: k }, t("runs.col." + k));
              })
            )),
            h("tbody", null, rows.map(function(r) {
              var open = props.expanded === r.id;
              return [
                h(
                  "tr",
                  {
                    key: r.id,
                    className: open ? "wba-row-open wba-clickable" : "wba-clickable",
                    style: { cursor: "pointer" },
                    onClick: function() {
                      props.onExpand(open ? "" : r.id);
                    }
                  },
                  h("td", null, h(C.Pill, { h, kind: resultKind(r.status) }, t("run.status." + r.status) || r.status)),
                  h("td", { className: "wba-ellipsis" }, props.ruleName ? props.ruleName(r.ruleId) : r.ruleId),
                  h("td", { className: "wba-nowrap" }, r.trigger ? t("trigger." + r.trigger) || r.trigger : "\u2014"),
                  h("td", { className: "wba-nowrap" }, C.fmtTime(r.startedAt, props.lang)),
                  h("td", { className: "wba-nowrap" }, cost(r)),
                  h("td", null, h("span", { className: "wba-ellipsis", title: r.error || summary(r) }, summary(r)))
                ),
                open ? h(
                  "tr",
                  { key: r.id + "-detail" },
                  h(
                    "td",
                    { colSpan: 6, className: "wba-detail-cell" },
                    h("p", { className: "wba-section-title" }, t("runs.detail.title")),
                    h(
                      "div",
                      { className: "wba-kv" },
                      h("b", null, t("runs.detail.id")),
                      h("code", null, r.id),
                      h("b", null, t("runs.detail.trigger")),
                      h("span", null, r.trigger ? t("trigger." + r.trigger) || r.trigger : "\u2014"),
                      h("b", null, t("runs.detail.start")),
                      h("span", null, C.fmtTime(r.startedAt, props.lang)),
                      h("b", null, t("runs.detail.finish")),
                      h("span", null, r.finishedAt ? C.fmtTime(r.finishedAt, props.lang) : "\u2014"),
                      h("b", null, t("runs.detail.cost")),
                      h("span", null, cost(r)),
                      h("b", null, t("runs.detail.error")),
                      h("span", { className: r.error ? "wba-err-text" : "" }, r.error || t("runs.detail.noError"))
                    ),
                    h("p", { className: "wba-section-title" }, t("runs.detail.result")),
                    h("pre", { className: "wba-pre" }, asText(r.result) || "\u2014")
                  )
                ) : null
              ];
            }))
          )
        )
      );
    }
    module2.exports = function RunsView(props) {
      var h = props.h;
      var api = props.api;
      var React = props.React;
      var lang = props.lang === "en" ? "en" : "zh";
      var t = function(key, vars) {
        return copy.t(lang, key, vars);
      };
      var runs = C.useLoad(React, api, "automation.runList", { limit: LIMIT }, []);
      var rules = C.useLoad(React, api, "automation.ruleList", {}, []);
      var filterS = React.useState({ ruleId: "", status: "" });
      var expandS = React.useState("");
      var ruleList = rules.data && rules.data.items || [];
      var names = {};
      ruleList.forEach(function(r) {
        names[r.id] = r.name;
      });
      var rows = (runs.data && runs.data.items || []).filter(function(r) {
        if (filterS[0].ruleId && r.ruleId !== filterS[0].ruleId) return false;
        if (filterS[0].status && r.status !== filterS[0].status) return false;
        return true;
      });
      return h(
        "div",
        { className: "wba-wrap" },
        h(
          "div",
          { className: "wba-head" },
          h(
            "div",
            null,
            h("h2", { className: "wba-title" }, t("runs.title")),
            h("p", { className: "wba-sub" }, t("runs.subtitle"))
          ),
          h(
            "div",
            { className: "wba-row" },
            h(C.Btn, { h, onClick: runs.refresh }, t("common.refresh"))
          )
        ),
        h(RunsBody, {
          h,
          t,
          lang,
          icon: props.icon,
          rows,
          rules: ruleList,
          ruleId: filterS[0].ruleId,
          status: filterS[0].status,
          expanded: expandS[0],
          loading: runs.loading,
          error: runs.error,
          ruleName: function(id) {
            return names[id] || id;
          },
          onRule: function(v) {
            filterS[1](Object.assign({}, filterS[0], { ruleId: v }));
          },
          onStatus: function(v) {
            filterS[1](Object.assign({}, filterS[0], { status: v }));
          },
          onExpand: function(id) {
            expandS[1](id);
          }
        })
      );
    };
    module2.exports.RunsBody = RunsBody;
    module2.exports.cost = cost;
    module2.exports.LIMIT = LIMIT;
  }
});

// packages/addons/automation/client/views/config.cjs
var require_config = __commonJS({
  "packages/addons/automation/client/views/config.cjs"(exports2, module2) {
    "use strict";
    var C = require_common();
    var copy = require_copy();
    var CONSTRAINTS = ["strategy", "concurrency", "event", "condition", "backup", "safety"];
    function ConfigBody(props) {
      var h = props.h;
      var t = props.t;
      var icon = props.icon;
      var form = props.form || {};
      return h(
        "div",
        { className: "wba-panel" },
        h(
          "div",
          { className: "wba-panel-h" },
          h("p", { className: "wba-panel-title" }, t("config.limit.title")),
          props.saved && !props.dirty ? h(C.Pill, { h, kind: "ok" }, t("common.saved")) : null
        ),
        h(
          "div",
          { className: "wba-grid-2" },
          h(
            "label",
            { className: "wba-field" },
            h("span", { className: "wba-label" }, t("config.limit.maxRules")),
            h("input", {
              className: "wba-input",
              type: "number",
              min: 1,
              max: 500,
              value: form.maxRules,
              "aria-label": t("config.limit.maxRules"),
              onChange: function(e) {
                props.onChange("maxRules", e.target.value);
              }
            })
          ),
          h(
            "label",
            { className: "wba-field" },
            h("span", { className: "wba-label" }, t("config.limit.perHour")),
            h("input", {
              className: "wba-input",
              type: "number",
              min: 1,
              max: 600,
              value: form.perHour,
              "aria-label": t("config.limit.perHour"),
              onChange: function(e) {
                props.onChange("perHour", e.target.value);
              }
            })
          )
        ),
        h("p", { className: "wba-sub" }, t("config.limit.hint")),
        h(
          "div",
          { className: "wba-inline" },
          h(C.Btn, {
            h,
            kind: "primary",
            disabled: props.busy || !props.dirty,
            onClick: function() {
              props.onSave({ maxRules: Number(form.maxRules), perHour: Number(form.perHour) });
            }
          }, props.busy ? t("common.loading") : t("common.save")),
          props.dirty ? null : h("span", { className: "wba-hint" }, t("config.limit.unchanged"))
        ),
        h("hr", { className: "wba-sep" }),
        h(
          "div",
          { className: "wba-panel-h" },
          h("p", { className: "wba-panel-title" }, t("config.constraints.title")),
          icon ? h("span", { className: "wba-card-ico" }, icon("shield-check", 16)) : null
        ),
        h("ul", { className: "wba-list" }, CONSTRAINTS.map(function(k) {
          return h("li", { key: k }, t("config.c." + k));
        }))
      );
    }
    module2.exports = function ConfigView(props) {
      var h = props.h;
      var api = props.api;
      var React = props.React;
      var lang = props.lang === "en" ? "en" : "zh";
      var t = function(key, vars) {
        return copy.t(lang, key, vars);
      };
      var cfg = C.useLoad(React, api, "automation.configGet", {}, []);
      var formS = React.useState(null);
      var busyS = React.useState(false);
      var msgS = React.useState(null);
      var savedS = React.useState(false);
      React.useEffect(function() {
        if (cfg.data && !formS[0]) {
          formS[1]({ maxRules: String(cfg.data.maxRules), perHour: String(cfg.data.perHour) });
        }
      }, [cfg.data]);
      var form = formS[0] || { maxRules: "", perHour: "" };
      var base = cfg.data || {};
      var dirty = String(form.maxRules) !== String(base.maxRules) || String(form.perHour) !== String(base.perHour);
      function save(payload) {
        busyS[1](true);
        msgS[1](null);
        C.call(api, "automation.configSet", payload).then(function() {
          busyS[1](false);
          savedS[1](true);
          msgS[1]({ kind: "ok", text: t("common.saved") });
          cfg.refresh();
        }).catch(function(e) {
          busyS[1](false);
          msgS[1]({ kind: "error", text: C.errText(e) });
        });
      }
      return h(
        "div",
        { className: "wba-wrap" },
        h(
          "div",
          { className: "wba-head" },
          h(
            "div",
            null,
            h("h2", { className: "wba-title" }, t("config.title")),
            h("p", { className: "wba-sub" }, t("config.subtitle"))
          ),
          h(
            "div",
            { className: "wba-row" },
            h(C.Btn, { h, onClick: cfg.refresh }, t("common.refresh"))
          )
        ),
        msgS[0] ? h(C.Notice, { h, kind: msgS[0].kind, text: msgS[0].text }) : null,
        cfg.error ? h(C.Notice, { h, kind: "error", text: cfg.error }) : null,
        cfg.loading && !cfg.data ? h("div", { className: "wba-panel" }, h("div", { className: "wba-skel" }), h("div", { className: "wba-skel" })) : h(ConfigBody, {
          h,
          t,
          icon: props.icon,
          form,
          busy: busyS[0],
          dirty,
          saved: savedS[0],
          onChange: function(k, v) {
            formS[1](Object.assign({}, form, { [k]: v }));
          },
          onSave: save
        })
      );
    };
    module2.exports.ConfigBody = ConfigBody;
    module2.exports.CONSTRAINTS = CONSTRAINTS;
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

// packages/addons/automation/client/views/data.cjs
var require_data = __commonJS({
  "packages/addons/automation/client/views/data.cjs"(exports2, module2) {
    "use strict";
    var legacy = require_legacy_data()("automation", { paged: true });
    module2.exports = require_data_view()({
      domain: "automation",
      prefix: "wbc",
      tables: ["automation_rule", "automation_run", "automation_meta"],
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
        "." + P + "-cardhead{display:flex;align-items:center;gap:8px;flex-wrap:wrap}",
        "." + P + "-cardhead code{font-weight:640}",
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
      var DOMAIN = raw.indexOf("wb-addon-") === 0 ? raw : "wb-addon-" + raw;
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
        React.useEffect(function() {
          injectCss();
        }, []);
        React.useEffect(function() {
          var alive = true;
          setLoading(true);
          setErr("");
          var pending;
          var actionName = DOMAIN.replace(/^wb-addon-/, "") + ".actionSchema";
          if (api && typeof api.call === "function") {
            pending = Promise.resolve(api.call(actionName)).then(function(r) {
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
        function card(action) {
          var rows = paramRows(action);
          var examples = Array.isArray(action.examples) ? action.examples : [];
          return h(
            "div",
            { className: P + "-card", key: action.name },
            h(
              "div",
              { className: P + "-cardhead" },
              h("code", { className: P + "-mono" }, Highlight.hit(action.name, kw)),
              // 域名在页头已展示一次，卡片内不再重复（所有条目必然同域，见 visible 过滤）。
              h("span", { className: P + "-badge" }, rows.length ? t.paramCount(rows.length) : t.noParams),
              rows.some(function(row) {
                return row.required;
              }) ? h("span", { className: P + "-badge " + P + "-req" }, t.required) : null
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

// packages/addons/automation/client/views/actions.cjs
var require_actions = __commonJS({
  "packages/addons/automation/client/views/actions.cjs"(exports2, module2) {
    "use strict";
    module2.exports = require_action_schema_view()({
      domain: "wb-addon-automation",
      prefix: "wbc"
    }).ActionSchemaView;
  }
});

// packages/addons/automation/client/client.src.cjs
(function() {
  var root = typeof window !== "undefined" ? window : null;
  var host = root && root.__WB_HOST__;
  if (!host || !host.react) {
    if (typeof console !== "undefined") console.error("[dsh-workbench-automation] \u5BBF\u4E3B\u524D\u7AEF\u672A\u5C31\u7EEA");
    module.exports = { name: "dsh-workbench-automation", inject: [], apply: function() {
    } };
    return;
  }
  var React = host.react;
  var h = host.h;
  var CSS = require_styles();
  var ICONS = {
    activity: (init_activity(), __toCommonJS(activity_exports)).default,
    zap: (init_zap(), __toCommonJS(zap_exports)).default,
    history: (init_history(), __toCommonJS(history_exports)).default,
    sliders: (init_sliders_horizontal(), __toCommonJS(sliders_horizontal_exports)).default,
    database: (init_database(), __toCommonJS(database_exports)).default,
    list: (init_list(), __toCommonJS(list_exports)).default,
    timer: (init_timer(), __toCommonJS(timer_exports)).default,
    "alarm-clock": (init_alarm_clock(), __toCommonJS(alarm_clock_exports)).default,
    radio: (init_radio(), __toCommonJS(radio_exports)).default,
    hand: (init_hand(), __toCommonJS(hand_exports)).default,
    play: (init_play(), __toCommonJS(play_exports)).default,
    pencil: (init_pencil(), __toCommonJS(pencil_exports)).default,
    power: (init_power(), __toCommonJS(power_exports)).default,
    "power-off": (init_power_off(), __toCommonJS(power_off_exports)).default,
    "trash-2": (init_trash_2(), __toCommonJS(trash_2_exports)).default,
    x: (init_x(), __toCommonJS(x_exports)).default,
    "check-circle": (init_check_circle(), __toCommonJS(check_circle_exports)).default,
    "alert-triangle": (init_alert_triangle(), __toCommonJS(alert_triangle_exports)).default,
    "skip-forward": (init_skip_forward(), __toCommonJS(skip_forward_exports)).default,
    layers: (init_layers(), __toCommonJS(layers_exports)).default,
    "shield-check": (init_shield_check(), __toCommonJS(shield_check_exports)).default
  };
  function Icon2(props) {
    var C = ICONS[props.name] || ICONS.zap;
    return h(C, { size: props.size || 14, strokeWidth: 2, "aria-hidden": "true", className: "wba-svg" });
  }
  function icon(name, size) {
    return h(Icon2, { name, size: size || 14 });
  }
  function tabIcon(name) {
    return function() {
      return h(Icon2, { name, size: 14 });
    };
  }
  function withProps(Inner, title) {
    return function Wrapped(props) {
      return h(Inner, {
        api: props.api,
        lang: props.lang === "en" ? "en" : "zh",
        h,
        React,
        title,
        icon,
        viewParams: props.viewParams,
        onNavigate: props.onNavigate
      });
    };
  }
  function ensureStyles() {
    if (typeof document === "undefined" || !document.head) return;
    if (document.getElementById("wb-automation-style")) return;
    var style = document.createElement("style");
    style.id = "wb-automation-style";
    style.textContent = CSS;
    document.head.appendChild(style);
  }
  ensureStyles();
  host.registerAddon({
    id: "wb-addon-automation",
    version: "0.2.1",
    icon: (init_zap(), __toCommonJS(zap_exports)).default,
    views: [
      { id: "stats", icon: tabIcon("activity"), title: { zh: "\u6982\u89C8", en: "Overview" }, component: withProps(require_stats(), "\u6982\u89C8") },
      { id: "rules", icon: tabIcon("zap"), title: { zh: "\u89C4\u5219", en: "Rules" }, component: withProps(require_rules(), "\u89C4\u5219") },
      { id: "runs", icon: tabIcon("history"), title: { zh: "\u8FD0\u884C\u8BB0\u5F55", en: "Runs" }, component: withProps(require_runs(), "\u8FD0\u884C\u8BB0\u5F55") },
      { id: "config", icon: tabIcon("sliders"), title: { zh: "\u8BBE\u7F6E", en: "Settings" }, component: withProps(require_config(), "\u8BBE\u7F6E") },
      { id: "data", icon: tabIcon("database"), title: { zh: "\u6570\u636E", en: "Data" }, component: withProps(require_data(), "\u6570\u636E") },
      { id: "actions", icon: tabIcon("list"), title: { zh: "Action", en: "Actions" }, component: withProps(require_actions(), "Action") }
    ]
  });
  module.exports = { name: "dsh-workbench-automation", inject: [], apply: function() {
  } };
})();
    return module.exports;
  },
});
