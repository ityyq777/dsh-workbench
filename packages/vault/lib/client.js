// 由 scripts/build-addon-clients.mjs 生成；请修改对应 client/client.src.cjs 后重新构建。
window.__ModuleLoader__ = window.__ModuleLoader__ || { modules: {}, load: function (m) { this.modules[m.id] = m.factory; } };
window.__ModuleLoader__.load({
  id: "dsh-workbench-vault",
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

// packages/addons/lib/filter-checklist-styles.cjs
var require_filter_checklist_styles = __commonJS({
  "packages/addons/lib/filter-checklist-styles.cjs"(exports2, module2) {
    "use strict";
    module2.exports = [
      ".wbck{display:flex;flex-direction:column;min-width:0}",
      ".wbck-search{padding:0 0 6px}",
      ".wbck-input{width:100%;box-sizing:border-box;font:inherit;font-size:12.5px;padding:6px 9px;border:1px solid var(--wb-border);border-radius:8px;background:var(--wb-surface);color:inherit}",
      ".wbck-input:focus-visible{outline:2px solid var(--wb-accent);outline-offset:1px}",
      ".wbck-input:disabled{opacity:.6;cursor:not-allowed}",
      ".wbck-head{display:flex;align-items:center;gap:6px;font-size:11.5px;color:var(--wb-muted);padding:2px 4px 7px}",
      ".wbck-grow{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
      ".wbck-sel{flex:none;color:var(--wb-accent)}",
      ".wbck-clear{appearance:none;flex:none;border:0;background:transparent;color:inherit;border-radius:4px;margin:0;padding:3px 5px;font:inherit;font-size:11.5px;line-height:1;cursor:pointer;opacity:.75}",
      ".wbck-clear:hover:enabled{opacity:1;background:color-mix(in srgb, currentColor 8%, transparent)}",
      ".wbck-clear:focus-visible{outline:2px solid var(--wb-accent);outline-offset:1px}",
      ".wbck-clear:disabled{opacity:.4;cursor:not-allowed}",
      ".wbck-list{max-height:220px;overflow:auto;overscroll-behavior:contain;border:1px solid var(--wb-border);border-radius:10px;padding:2px}",
      ".wbck-opt{display:flex;align-items:center;gap:7px;padding:6px;border-radius:6px;font-size:12.5px;cursor:pointer}",
      ".wbck-opt:hover{background:color-mix(in srgb, currentColor 7%, transparent)}",
      ".wbck-opt.is-on{background:color-mix(in srgb, var(--wb-accent) 10%, transparent)}",
      ".wbck-opt input{margin:0;flex:none;accent-color:var(--wb-accent)}",
      // 单选变体用 button 渲染（role="radio"），这里把浏览器默认按钮样式清掉，视觉与多选行一致。
      '.wbck-opt[role="radio"]{appearance:none;width:100%;box-sizing:border-box;border:0;background:transparent;color:inherit;font:inherit;text-align:left}',
      '.wbck-opt[role="radio"]:disabled{opacity:.55;cursor:not-allowed}',
      '.wbck-opt[role="radio"]:focus-visible{outline:2px solid var(--wb-accent);outline-offset:-2px}',
      ".wbck-nm{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
      ".wbck-meta{margin-left:auto;flex:none;font-size:11.5px;color:var(--wb-muted)}",
      ".wbck-note{font-size:12px;color:var(--wb-muted);padding:8px 6px}",
      ".wbck-more{font-size:11px;color:var(--wb-muted);text-align:center;padding:6px 0 2px;opacity:.8}",
      "@media (max-width:760px){.wbck-list{max-height:200px}}"
    ];
  }
});

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

// packages/addons/vault/client/ui/styles.cjs
var require_styles = __commonJS({
  "packages/addons/vault/client/ui/styles.cjs"(exports2, module2) {
    "use strict";
    module2.exports = [
      ".wbv{display:flex;flex-direction:column;gap:14px;font-size:13px;min-height:100%;padding:2px}",
      ".wbv h2{font-size:17px;margin:0}.wbv h3{font-size:14px;margin:0}",
      ".wbv-muted{opacity:.62}.wbv-row{display:flex;gap:8px;align-items:center;flex-wrap:wrap}",
      ".wbv-grow{flex:1}.wbv-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px}",
      ".wbv-card{border:1px solid var(--wb-border);border-radius:10px;padding:12px;background:var(--wb-card)}",
      ".wbv-card h3{margin-bottom:6px}.wbv-kpi{font-size:22px;font-weight:650;line-height:1.2}",
      ".wbv-btn{border:1px solid var(--wb-border);background:var(--wb-card);color:inherit;border-radius:7px;padding:5px 10px;cursor:pointer;font-size:12px;line-height:1.4}",
      ".wbv-btn:hover{border-color:var(--wb-accent)}.wbv-btn:disabled{opacity:.45;cursor:not-allowed}",
      ".wbv-btn.primary{background:var(--wb-accent);border-color:var(--wb-accent);color:var(--wb-on-accent,inherit)}",
      ".wbv-btn.danger{color:var(--wb-danger);border-color:color-mix(in srgb,var(--wb-danger) 45%,transparent)}",
      ".wbv-btn.ghost{background:transparent;border-color:transparent;color:var(--wb-accent);padding:2px 4px}",
      ".wbv-field{display:flex;flex-direction:column;gap:4px;min-width:180px;flex:1}",
      ".wbv-label{font-size:11px;font-weight:600;opacity:.75}.wbv-hint{font-size:11px;opacity:.55}",
      ".wbv input,.wbv select,.wbv textarea{border:1px solid var(--wb-border);border-radius:7px;padding:6px 8px;font:inherit;background:var(--wb-surface);color:inherit;width:100%;box-sizing:border-box}",
      ".wbv input[type=checkbox]{width:auto}",
      ".wbv textarea{min-height:70px;resize:vertical}",
      ".wbv-notice{border-radius:8px;padding:8px 10px;font-size:12px;border:1px solid var(--wb-border);background:color-mix(in srgb,var(--wb-accent) 8%,transparent);color:inherit}",
      ".wbv-notice.error{border-color:color-mix(in srgb,var(--wb-danger) 45%,transparent);background:color-mix(in srgb,var(--wb-danger) 10%,transparent);color:var(--wb-danger)}",
      ".wbv-notice.ok{border-color:color-mix(in srgb,var(--wb-ok) 45%,transparent);background:color-mix(in srgb,var(--wb-ok) 10%,transparent);color:var(--wb-ok)}",
      ".wbv-empty{padding:22px;text-align:center;opacity:.55;border:1px dashed var(--wb-border);border-radius:10px}",
      ".wbv-table{width:100%;border-collapse:collapse;font-size:12px}",
      ".wbv-table th,.wbv-table td{text-align:left;padding:7px 8px;border-bottom:1px solid var(--wb-line);vertical-align:top}",
      ".wbv-table th{font-weight:600;opacity:.65;white-space:nowrap}.wbv-table code{font-size:11px;opacity:.8}",
      ".wbv-table tbody tr:hover{background:color-mix(in srgb,var(--wb-muted) 8%,transparent)}",
      ".wbv-pill{display:inline-block;border-radius:999px;padding:1px 8px;font-size:11px;background:color-mix(in srgb,var(--wb-muted) 14%,transparent);color:inherit}",
      ".wbv-pill.ok{background:color-mix(in srgb,var(--wb-ok) 16%,transparent);color:var(--wb-ok)}",
      ".wbv-pill.warn{background:color-mix(in srgb,var(--wb-warn) 18%,transparent);color:var(--wb-warn)}",
      ".wbv-pill.bad{background:color-mix(in srgb,var(--wb-danger) 16%,transparent);color:var(--wb-danger)}",
      ".wbv-tabs{display:flex;gap:6px;flex-wrap:wrap}.wbv-tab{border:none;background:transparent;padding:4px 8px;border-radius:6px;cursor:pointer;font-size:12px}",
      ".wbv-tab.on{background:color-mix(in srgb,var(--wb-accent) 12%,transparent);color:var(--wb-accent);font-weight:600}",
      ".wbv-secret{font-family:ui-monospace,Menlo,Consolas,monospace;background:var(--wb-surface);border:1px solid var(--wb-border);border-radius:6px;padding:6px 8px;word-break:break-all}",
      ".wbv-inline{display:flex;gap:6px;align-items:center;flex-wrap:wrap}",
      ".wbv-modal{position:fixed;inset:0;background:color-mix(in srgb,var(--wb-muted) 45%,transparent);display:flex;align-items:center;justify-content:center;z-index:50;padding:18px}",
      ".wbv-modal-box{background:var(--wb-card);border:1px solid var(--wb-border);border-radius:12px;padding:16px;width:min(520px,100%);max-height:88vh;overflow:auto;display:flex;flex-direction:column;gap:10px;box-shadow:0 12px 40px color-mix(in srgb,var(--wb-muted) 30%,transparent)}",
      ".wbv-code{font-family:ui-monospace,Menlo,Consolas,monospace;font-size:11px;white-space:pre-wrap;word-break:break-word;background:var(--wb-surface);border:1px solid var(--wb-border);border-radius:8px;padding:10px;max-height:320px;overflow:auto}",
      ".wbv-split{display:grid;grid-template-columns:minmax(260px,1fr) minmax(320px,1.6fr);gap:12px;align-items:start}",
      ".wbv-list{display:flex;flex-direction:column;gap:6px}",
      ".wbv-item{border:1px solid var(--wb-border);border-radius:10px;padding:9px 10px;background:var(--wb-card);cursor:pointer}",
      ".wbv-item:hover{border-color:var(--wb-accent)}",
      ".wbv-item.on{border-color:var(--wb-accent);box-shadow:inset 3px 0 0 var(--wb-accent)}",
      ".wbv-item-top{display:flex;gap:8px;align-items:center}",
      ".wbv-dot{width:10px;height:10px;border-radius:999px;flex:none;background:var(--wb-accent)}",
      ".wbv-chips{display:flex;gap:6px;flex-wrap:wrap}",
      ".wbv-chip{display:inline-flex;gap:6px;align-items:center;border:1px solid var(--wb-border);border-radius:999px;padding:2px 8px;font-size:11px;background:var(--wb-surface)}",
      ".wbv-check{display:flex;gap:6px;align-items:center;padding:3px 0;font-size:12px}",
      ".wbv-scroll{max-height:220px;overflow:auto;border:1px solid var(--wb-border);border-radius:8px;padding:8px}",
      "@media (max-width:820px){.wbv-split{grid-template-columns:1fr}}",
      ".wbv-search{flex:0 0 220px;width:220px}",
      ".wbv-row>input:not([type=checkbox]),.wbv-row>select{width:auto;flex:0 1 220px;min-width:120px}",
      ".wbv-sub{font-size:12px;opacity:.65;margin-top:2px}",
      ".wbv-table tbody tr:hover{background:color-mix(in srgb,var(--wb-accent) 6%,transparent)}",
      ".wbv-table td{vertical-align:top}",
      ".wbv-empty-card{border:1px dashed var(--wb-border);border-radius:10px;padding:28px 16px;display:flex;flex-direction:column;gap:8px;align-items:center;text-align:center;background:var(--wb-card)}",
      ".wbv-empty-title{font-size:14px;font-weight:600}",
      ".wbv-check-list{display:flex;flex-wrap:wrap;gap:6px 14px;margin:4px 0}",
      ".wbv-check{display:inline-flex;align-items:center;gap:6px;font-size:12px;cursor:pointer}",
      ".wbv-dot{width:8px;height:8px;border-radius:50%;display:inline-block;flex:none}"
    ].concat(require_filter_checklist_styles()).concat(require_client_base_styles().secretFieldStyles);
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

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/shield.mjs
var shield_exports = {};
__export(shield_exports, {
  __iconData: () => __iconData,
  default: () => Shield
});
var __iconData, Shield;
var init_shield = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/shield.mjs"() {
    init_createLucideIcon();
    __iconData = {
      name: "shield",
      size: 24,
      node: [
        [
          "path",
          {
            d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
            key: "oel41y"
          }
        ]
      ]
    };
    __iconData.node;
    Shield = createLucideIcon(__iconData);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/key-round.mjs
var key_round_exports = {};
__export(key_round_exports, {
  __iconData: () => __iconData2,
  default: () => KeyRound
});
var __iconData2, KeyRound;
var init_key_round = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/key-round.mjs"() {
    init_createLucideIcon();
    __iconData2 = {
      name: "key-round",
      size: 24,
      node: [
        [
          "path",
          {
            d: "M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z",
            key: "1s6t7t"
          }
        ],
        ["circle", { cx: "16.5", cy: "7.5", r: ".5", fill: "currentColor", key: "w0ekpg" }]
      ]
    };
    __iconData2.node;
    KeyRound = createLucideIcon(__iconData2);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/folder.mjs
var folder_exports = {};
__export(folder_exports, {
  __iconData: () => __iconData3,
  default: () => Folder
});
var __iconData3, Folder;
var init_folder = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/folder.mjs"() {
    init_createLucideIcon();
    __iconData3 = {
      name: "folder",
      size: 24,
      node: [
        [
          "path",
          {
            d: "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z",
            key: "1kt360"
          }
        ]
      ]
    };
    __iconData3.node;
    Folder = createLucideIcon(__iconData3);
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

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/layers.mjs
var layers_exports = {};
__export(layers_exports, {
  __iconData: () => __iconData7,
  default: () => Layers
});
var __iconData7, Layers;
var init_layers = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/layers.mjs"() {
    init_createLucideIcon();
    __iconData7 = {
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
    __iconData7.node;
    Layers = createLucideIcon(__iconData7);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/shield-check.mjs
var shield_check_exports = {};
__export(shield_check_exports, {
  __iconData: () => __iconData8,
  default: () => ShieldCheck
});
var __iconData8, ShieldCheck;
var init_shield_check = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/shield-check.mjs"() {
    init_createLucideIcon();
    __iconData8 = {
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
    __iconData8.node;
    ShieldCheck = createLucideIcon(__iconData8);
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

// packages/addons/vault/client/ui/common.cjs
var require_common = __commonJS({
  "packages/addons/vault/client/ui/common.cjs"(exports2, module2) {
    "use strict";
    module2.exports = require_client_common()("wbv");
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/eye.mjs
var eye_exports = {};
__export(eye_exports, {
  __iconData: () => __iconData9,
  default: () => Eye
});
var __iconData9, Eye;
var init_eye = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/eye.mjs"() {
    init_createLucideIcon();
    __iconData9 = {
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
    __iconData9.node;
    Eye = createLucideIcon(__iconData9);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/eye-off.mjs
var eye_off_exports = {};
__export(eye_off_exports, {
  __iconData: () => __iconData10,
  default: () => EyeOff
});
var __iconData10, EyeOff;
var init_eye_off = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/eye-off.mjs"() {
    init_createLucideIcon();
    __iconData10 = {
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
    __iconData10.node;
    EyeOff = createLucideIcon(__iconData10);
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

// packages/addons/vault/client/ui/ask-passphrase.cjs
var require_ask_passphrase = __commonJS({
  "packages/addons/vault/client/ui/ask-passphrase.cjs"(exports2, module2) {
    "use strict";
    var SecretField = require_secret_field();
    module2.exports = function AskPassphraseModal(props) {
      var h = props.h, C = props.C;
      return h(
        "div",
        { className: "wbv-modal", onClick: function() {
          if (!props.busy) props.onCancel();
        } },
        h(
          "div",
          { className: "wbv-modal-box", onClick: function(e) {
            e.stopPropagation();
          } },
          h("h3", null, props.title || "\u8F93\u5165\u4E3B\u53E3\u4EE4"),
          props.hint ? h("p", { className: "wbv-sub" }, props.hint) : null,
          h(
            C.Field,
            { h, label: props.label || "\u4E3B\u53E3\u4EE4" },
            h(SecretField, {
              h,
              autoFocus: true,
              autoComplete: "current-password",
              value: props.value,
              disabled: props.busy,
              show: props.show,
              ariaLabel: props.label || "\u4E3B\u53E3\u4EE4",
              onChange: props.onChange,
              onToggle: props.onToggle,
              onKeyDown: function(e) {
                if (e.key === "Enter" && props.value && !props.busy) props.onConfirm();
              }
            })
          ),
          props.error ? h(C.Notice, { h, kind: "error", text: props.error }) : null,
          h(
            "div",
            { className: "wbv-row", style: { justifyContent: "flex-end" } },
            h(C.Btn, { h, disabled: props.busy, onClick: props.onCancel }, "\u53D6\u6D88"),
            h(C.Btn, { h, kind: "primary", disabled: props.busy || !props.value, onClick: props.onConfirm }, props.busy ? "\u5904\u7406\u4E2D\u2026" : "\u786E\u8BA4")
          )
        )
      );
    };
  }
});

// packages/addons/vault/client/views/status.cjs
var require_status = __commonJS({
  "packages/addons/vault/client/views/status.cjs"(exports2, module2) {
    "use strict";
    var C = require_common();
    var AskPassphrase = require_ask_passphrase();
    var SecretField = require_secret_field();
    module2.exports = function StatusView(props) {
      var h = props.h;
      var api = props.api;
      var lang = props.lang || "zh";
      var React = props.React;
      var st = React.useState({ loading: true, data: null, error: "" });
      var status = st[0].data;
      var error = st[0].error;
      var busy = React.useState(false);
      var pass = React.useState("");
      var pass2 = React.useState("");
      var mode = React.useState("A");
      var msg = React.useState("");
      var askS = React.useState(null);
      var showMainS = React.useState(false);
      var showConfirmS = React.useState(false);
      var showUnlockS = React.useState(false);
      var refreshTick = React.useState(0);
      var refresh = function() {
        refreshTick[1](refreshTick[0] + 1);
      };
      React.useEffect(function() {
        var alive = true;
        C.call(api, "vault.status").then(function(data) {
          if (alive) st[1]({ loading: false, data, error: "" });
        }).catch(function(e) {
          if (alive) st[1]({ loading: false, data: null, error: C.errText(e) });
        });
        return function() {
          alive = false;
        };
      }, [refreshTick[0]]);
      function run(fn) {
        busy[1](true);
        msg[1]("");
        return fn().then(function() {
          pass[1]("");
          pass2[1]("");
          busy[1](false);
          refresh();
        }).catch(function(e) {
          msg[1](C.errText(e));
          busy[1](false);
        });
      }
      if (st[0].loading) return h("div", { className: "wbv" }, h(C.Empty, { h, text: "\u6B63\u5728\u8BFB\u53D6\u4FDD\u9669\u7BB1\u72B6\u6001\u2026" }));
      if (error) {
        let confirmAsk2 = function() {
          var a = askS[0];
          if (!a || !a.value) return;
          askS[1](Object.assign({}, a, { busy: true, error: "" }));
          busy[1](true);
          msg[1]("");
          C.call(api, "vault.unlock", { passphrase: a.value }).then(function() {
            return C.call(api, "vault.setUnlockMode", { mode: "A" });
          }).then(function() {
            askS[1](null);
            busy[1](false);
            refresh();
          }).catch(function(e) {
            askS[1](Object.assign({}, a, { busy: false, error: C.errText(e) }));
          });
        };
        var modal = askS[0] ? h(AskPassphrase, {
          h,
          C,
          title: "\u5207\u56DE A \u6A21\u5F0F",
          hint: "\u5207\u6362\u540E\u4E0B\u6B21\u542F\u52A8\u9700\u8981\u91CD\u65B0\u89E3\u9501\uFF0C\u8BF7\u9A8C\u8BC1\u4E3B\u53E3\u4EE4\u3002",
          value: askS[0].value,
          busy: askS[0].busy,
          error: askS[0].error,
          onChange: function(v) {
            askS[1](Object.assign({}, askS[0], { value: v }));
          },
          show: askS[0].show,
          onToggle: function() {
            askS[1](Object.assign({}, askS[0], { show: !askS[0].show }));
          },
          onCancel: function() {
            if (!askS[0].busy) askS[1](null);
          },
          onConfirm: confirmAsk2
        }) : null;
        return h(
          "div",
          { className: "wbv" },
          h("h2", null, "\u51ED\u636E\u4FDD\u9669\u7BB1"),
          h(C.Notice, { h, kind: "error", text: error }),
          h(C.Btn, { h, onClick: refresh }, "\u91CD\u8BD5")
        );
      }
      if (!status || !status.initialized) {
        let confirmAsk2 = function() {
          var a = askS[0];
          if (!a || !a.value) return;
          askS[1](Object.assign({}, a, { busy: true, error: "" }));
          busy[1](true);
          msg[1]("");
          C.call(api, "vault.unlock", { passphrase: a.value }).then(function() {
            return C.call(api, "vault.setUnlockMode", { mode: "A" });
          }).then(function() {
            askS[1](null);
            busy[1](false);
            refresh();
          }).catch(function(e) {
            askS[1](Object.assign({}, a, { busy: false, error: C.errText(e) }));
          });
        };
        var modal = askS[0] ? h(AskPassphrase, {
          h,
          C,
          title: "\u5207\u56DE A \u6A21\u5F0F",
          hint: "\u5207\u6362\u540E\u4E0B\u6B21\u542F\u52A8\u9700\u8981\u91CD\u65B0\u89E3\u9501\uFF0C\u8BF7\u9A8C\u8BC1\u4E3B\u53E3\u4EE4\u3002",
          value: askS[0].value,
          busy: askS[0].busy,
          error: askS[0].error,
          onChange: function(v) {
            askS[1](Object.assign({}, askS[0], { value: v }));
          },
          show: askS[0].show,
          onToggle: function() {
            askS[1](Object.assign({}, askS[0], { show: !askS[0].show }));
          },
          onCancel: function() {
            if (!askS[0].busy) askS[1](null);
          },
          onConfirm: confirmAsk2
        }) : null;
        return h(
          "div",
          { className: "wbv" },
          h("h2", null, "\u521D\u59CB\u5316\u51ED\u636E\u4FDD\u9669\u7BB1"),
          h("p", { className: "wbv-muted" }, "\u53E3\u4EE4\u53EA\u7528\u4E8E\u6D3E\u751F\u5BC6\u94A5\uFF0C\u4E0D\u4F1A\u843D\u5E93\uFF1B\u5FD8\u8BB0\u53E3\u4EE4\u65E0\u6CD5\u6062\u590D\u5DF2\u4FDD\u5B58\u7684\u51ED\u636E\u3002\u53E3\u4EE4\u5305\u88F9\u4E0E\u5BC6\u6587\u4F1A\u968F\u4E91\u540C\u6B65\u4E0A\u4F20\uFF0C\u4E91\u7AEF\u6CA1\u6709\u53E3\u4EE4\u89E3\u4E0D\u5F00\u3002"),
          h(C.Notice, { h, kind: "info", text: "\u9ED8\u8BA4 A \u6A21\u5F0F\uFF1A\u6BCF\u6B21\u542F\u52A8\u540E\u9700\u8981\u91CD\u65B0\u89E3\u9501\u3002\u53EF\u7A0D\u540E\u5728\u8BBE\u7F6E\u91CC\u6539\u6210\u81EA\u52A8\u89E3\u9501\u3002" }),
          h(
            "div",
            { className: "wbv-card wbv-row" },
            h(
              C.Field,
              { h, label: "\u4E3B\u53E3\u4EE4\uFF08\u81F3\u5C11 12 \u4F4D\uFF09" },
              h(SecretField, {
                h,
                autoComplete: "new-password",
                ariaLabel: "\u4E3B\u53E3\u4EE4",
                value: pass[0],
                show: showMainS[0],
                onChange: pass[1],
                onToggle: function() {
                  showMainS[1](!showMainS[0]);
                }
              })
            ),
            h(
              C.Field,
              { h, label: "\u786E\u8BA4\u53E3\u4EE4" },
              h(SecretField, {
                h,
                autoComplete: "new-password",
                ariaLabel: "\u786E\u8BA4\u53E3\u4EE4",
                value: pass2[0],
                show: showConfirmS[0],
                onChange: pass2[1],
                onToggle: function() {
                  showConfirmS[1](!showConfirmS[0]);
                }
              })
            ),
            h(
              C.Field,
              { h, label: "\u89E3\u9501\u6A21\u5F0F" },
              h(
                "select",
                { value: mode[0], onChange: function(e) {
                  mode[1](e.target.value);
                } },
                h("option", { value: "A" }, "A \u5168\u9501\uFF08\u63A8\u8350\uFF09"),
                h("option", { value: "B" }, "B \u81EA\u52A8\u89E3\u9501\uFF0C\u67E5\u770B\u51ED\u636E\u518D\u8F93\u53E3\u4EE4"),
                h("option", { value: "C" }, "C \u81EA\u52A8\u89E3\u9501\uFF0C\u67E5\u770B\u514D\u53E3\u4EE4\uFF08\u4E0D\u5EFA\u8BAE\uFF09")
              )
            )
          ),
          h(C.Notice, { h, kind: "error", text: msg[0] }),
          h(
            "div",
            { className: "wbv-row" },
            h(C.Btn, { h, kind: "primary", disabled: busy[0], onClick: function() {
              if (pass[0].length < 12) return msg[1]("\u53E3\u4EE4\u81F3\u5C11 12 \u4E2A\u5B57\u7B26");
              if (pass[0] !== pass2[0]) return msg[1]("\u4E24\u6B21\u8F93\u5165\u4E0D\u4E00\u81F4");
              run(function() {
                return C.call(api, "vault.setup", { passphrase: pass[0], mode: mode[0] });
              });
            } }, busy[0] ? "\u521D\u59CB\u5316\u4E2D\u2026" : "\u521B\u5EFA\u4FDD\u9669\u7BB1")
          )
        );
      }
      if (status.locked) {
        let confirmAsk2 = function() {
          var a = askS[0];
          if (!a || !a.value) return;
          askS[1](Object.assign({}, a, { busy: true, error: "" }));
          busy[1](true);
          msg[1]("");
          C.call(api, "vault.unlock", { passphrase: a.value }).then(function() {
            return C.call(api, "vault.setUnlockMode", { mode: "A" });
          }).then(function() {
            askS[1](null);
            busy[1](false);
            refresh();
          }).catch(function(e) {
            askS[1](Object.assign({}, a, { busy: false, error: C.errText(e) }));
          });
        };
        var modal = askS[0] ? h(AskPassphrase, {
          h,
          C,
          title: "\u5207\u56DE A \u6A21\u5F0F",
          hint: "\u5207\u6362\u540E\u4E0B\u6B21\u542F\u52A8\u9700\u8981\u91CD\u65B0\u89E3\u9501\uFF0C\u8BF7\u9A8C\u8BC1\u4E3B\u53E3\u4EE4\u3002",
          value: askS[0].value,
          busy: askS[0].busy,
          error: askS[0].error,
          onChange: function(v) {
            askS[1](Object.assign({}, askS[0], { value: v }));
          },
          show: askS[0].show,
          onToggle: function() {
            askS[1](Object.assign({}, askS[0], { show: !askS[0].show }));
          },
          onCancel: function() {
            if (!askS[0].busy) askS[1](null);
          },
          onConfirm: confirmAsk2
        }) : null;
        return h(
          "div",
          { className: "wbv" },
          h("h2", null, "\u4FDD\u9669\u7BB1\u5DF2\u9501\u5B9A"),
          h("p", { className: "wbv-muted" }, "\u8F93\u5165\u4E3B\u53E3\u4EE4\u89E3\u9501\u3002\u89E3\u9501\u72B6\u6001\u53EA\u4FDD\u5B58\u5728\u5F53\u524D\u8FDB\u7A0B\u5185\u5B58\uFF0C\u7A7A\u95F2\u8D85\u65F6\u4F1A\u81EA\u52A8\u9501\u5B9A\u3002"),
          h(
            "div",
            { className: "wbv-card wbv-row" },
            h(
              C.Field,
              { h, label: "\u4E3B\u53E3\u4EE4" },
              h(SecretField, {
                h,
                autoComplete: "current-password",
                ariaLabel: "\u4E3B\u53E3\u4EE4",
                value: pass[0],
                show: showUnlockS[0],
                onChange: pass[1],
                onToggle: function() {
                  showUnlockS[1](!showUnlockS[0]);
                }
              })
            ),
            h(C.Btn, { h, kind: "primary", disabled: busy[0], onClick: function() {
              if (!pass[0]) return msg[1]("\u8BF7\u8F93\u5165\u53E3\u4EE4");
              run(function() {
                return C.call(api, "vault.unlock", { passphrase: pass[0] });
              });
            } }, busy[0] ? "\u89E3\u9501\u4E2D\u2026" : "\u89E3\u9501")
          ),
          h(C.Notice, { h, kind: "error", text: msg[0] }),
          h("p", { className: "wbv-muted" }, "\u6A21\u5F0F\uFF1A" + modeName(status.unlockMode) + "\uFF1B\u8FDE\u7EED\u5931\u8D25 5 \u6B21\u4F1A\u9501\u5B9A 5 \u5206\u949F\u3002")
        );
      }
      var modeText = modeName(status.unlockMode);
      function confirmAsk() {
        var a = askS[0];
        if (!a || !a.value) return;
        askS[1](Object.assign({}, a, { busy: true, error: "" }));
        busy[1](true);
        msg[1]("");
        C.call(api, "vault.unlock", { passphrase: a.value }).then(function() {
          return C.call(api, "vault.setUnlockMode", { mode: "A" });
        }).then(function() {
          askS[1](null);
          busy[1](false);
          refresh();
        }).catch(function(e) {
          askS[1](Object.assign({}, a, { busy: false, error: C.errText(e) }));
        });
      }
      var modal = askS[0] ? h(AskPassphrase, {
        h,
        C,
        title: "\u5207\u56DE A \u6A21\u5F0F",
        hint: "\u5207\u6362\u540E\u4E0B\u6B21\u542F\u52A8\u9700\u8981\u91CD\u65B0\u89E3\u9501\uFF0C\u8BF7\u9A8C\u8BC1\u4E3B\u53E3\u4EE4\u3002",
        value: askS[0].value,
        busy: askS[0].busy,
        error: askS[0].error,
        onChange: function(v) {
          askS[1](Object.assign({}, askS[0], { value: v }));
        },
        show: askS[0].show,
        onToggle: function() {
          askS[1](Object.assign({}, askS[0], { show: !askS[0].show }));
        },
        onCancel: function() {
          if (!askS[0].busy) askS[1](null);
        },
        onConfirm: confirmAsk
      }) : null;
      return h(
        "div",
        { className: "wbv" },
        h("div", { className: "wbv-row" }, h("h2", { className: "wbv-grow" }, "\u51ED\u636E\u4FDD\u9669\u7BB1"), h("span", { className: "wbv-pill ok" }, "\u5DF2\u89E3\u9501")),
        h(
          "div",
          { className: "wbv-grid" },
          h("div", { className: "wbv-card" }, h("div", { className: "wbv-muted" }, "\u51ED\u636E\u6570\u91CF"), h("div", { className: "wbv-kpi" }, status.secretCount || 0)),
          h("div", { className: "wbv-card" }, h("div", { className: "wbv-muted" }, "\u5206\u7EC4\u6570\u91CF"), h("div", { className: "wbv-kpi" }, status.groupCount || 0)),
          h("div", { className: "wbv-card" }, h("div", { className: "wbv-muted" }, "\u89E3\u9501\u6A21\u5F0F"), h("div", { className: "wbv-kpi" }, status.unlockMode), h("div", { className: "wbv-muted" }, modeText)),
          h("div", { className: "wbv-card" }, h("div", { className: "wbv-muted" }, "\u4E0A\u6B21\u89E3\u9501"), h("div", null, C.fmtTime(status.lastUnlockAt, lang)))
        ),
        h(C.Notice, { h, kind: "info", text: "agent \u53EA\u80FD\u770B\u5230\u540D\u79F0\u548C\u5907\u6CE8\uFF1B\u67E5\u770B\u660E\u6587\u5FC5\u987B\u7531\u4F60\u5728\u754C\u9762\u4E0A\u64CD\u4F5C\u3002" }),
        h(
          "div",
          { className: "wbv-row" },
          h(C.Btn, { h, onClick: function() {
            run(function() {
              return C.call(api, "vault.lock");
            });
          } }, "\u7ACB\u5373\u9501\u5B9A"),
          h(C.Btn, { h, onClick: function() {
            askS[1]({ value: "", busy: false, error: "" });
          } }, "\u5207\u56DE A \u6A21\u5F0F")
        ),
        h(C.Notice, { h, kind: "error", text: msg[0] }),
        modal
      );
    };
    function modeName(mode) {
      if (mode === "B") return "\u542F\u52A8\u81EA\u52A8\u89E3\u9501\uFF0C\u67E5\u770B\u51ED\u636E\u9700\u53E3\u4EE4";
      if (mode === "C") return "\u542F\u52A8\u81EA\u52A8\u89E3\u9501\uFF0C\u67E5\u770B\u514D\u53E3\u4EE4";
      return "\u5168\u9501\uFF1A\u6BCF\u6B21\u542F\u52A8\u9700\u89E3\u9501";
    }
  }
});

// packages/addons/vault/client/ui/kinds.cjs
var require_kinds = __commonJS({
  "packages/addons/vault/client/ui/kinds.cjs"(exports2, module2) {
    "use strict";
    var KIND_LABEL = {
      password: "\u5BC6\u7801",
      phone: "\u624B\u673A\u53F7",
      id_card: "\u8EAB\u4EFD\u8BC1\u53F7",
      token: "Token",
      app_password: "\u5E94\u7528\u4E13\u7528\u5BC6\u7801",
      api_key: "API Key",
      other: "\u5176\u5B83"
    };
    var CREATABLE_KINDS = ["password", "phone", "id_card", "token", "app_password", "api_key", "other"];
    function kindOptions(current) {
      return current && CREATABLE_KINDS.indexOf(current) === -1 ? [current].concat(CREATABLE_KINDS) : CREATABLE_KINDS;
    }
    module2.exports = { KIND_LABEL, CREATABLE_KINDS, kindOptions };
  }
});

// packages/addons/vault/client/views/secrets.cjs
var require_secrets = __commonJS({
  "packages/addons/vault/client/views/secrets.cjs"(exports2, module2) {
    "use strict";
    var C = require_common();
    var AskPassphrase = require_ask_passphrase();
    var SecretField = require_secret_field();
    var K = require_kinds();
    var KIND_LABEL = K.KIND_LABEL;
    module2.exports = function SecretsView(props) {
      var h = props.h;
      var api = props.api;
      var lang = props.lang || "zh";
      var React = props.React;
      var listS = React.useState({ loading: true, rows: [], error: "" });
      var qS = React.useState("");
      var kindS = React.useState("");
      var statusS = React.useState(null);
      var setsS = React.useState([]);
      var formS = React.useState(emptyForm());
      var editingS = React.useState(false);
      var showSecretS = React.useState(false);
      var busyS = React.useState(false);
      var msgS = React.useState("");
      var revealS = React.useState(null);
      var askS = React.useState(null);
      var unlockS = React.useState(null);
      var rows = listS[0].rows;
      function load() {
        listS[1](function(old) {
          return Object.assign({}, old, { loading: true });
        });
        Promise.all([
          C.call(api, "vault.secretList", { q: qS[0], kind: kindS[0] || void 0 }),
          C.call(api, "vault.status").catch(function() {
            return null;
          }),
          C.call(api, "vault.setList", {}).catch(function() {
            return { items: [] };
          })
        ]).then(function(r) {
          listS[1]({ loading: false, rows: r[0] && (r[0].items || r[0].secrets) || [], error: "" });
          statusS[1](r[1]);
          setsS[1](r[2] && r[2].items || []);
        }).catch(function(e) {
          listS[1]({ loading: false, rows: [], error: C.errText(e) });
        });
      }
      React.useEffect(function() {
        load();
      }, []);
      function startCreate() {
        formS[1](emptyForm());
        showSecretS[1](false);
        editingS[1](true);
        msgS[1]("");
      }
      function startEdit(row) {
        showSecretS[1](false);
        var meta = {};
        try {
          meta = JSON.parse(row.meta || "{}");
        } catch (e) {
          meta = {};
        }
        formS[1]({
          id: row.id,
          name: row.name,
          kind: row.kind,
          secret: "",
          setIds: (row.setIds || []).slice(),
          note: noteOf(meta)
        });
        editingS[1](true);
        msgS[1]("");
      }
      function toggleSet(id) {
        var cur = formS[0].setIds || [];
        var next = cur.indexOf(id) >= 0 ? cur.filter(function(x) {
          return x !== id;
        }) : cur.concat([id]);
        formS[1](Object.assign({}, formS[0], { setIds: next }));
      }
      function isLockedText(text) {
        return /保险箱已锁定|请先解锁/.test(String(text || ""));
      }
      function askUnlock(hint) {
        unlockS[1]({ value: "", busy: false, error: hint || "" });
      }
      function confirmUnlock() {
        var u = unlockS[0];
        if (!u || !u.value) return;
        unlockS[1](Object.assign({}, u, { busy: true, error: "" }));
        C.call(api, "vault.unlock", { passphrase: u.value }).then(function() {
          unlockS[1](null);
          msgS[1]("");
          if (editingS[0]) save(true);
          else load();
        }).catch(function(e) {
          unlockS[1](Object.assign({}, u, { busy: false, error: C.errText(e) }));
        });
      }
      function save(alreadyUnlocked) {
        var f = formS[0];
        if (!f.name.trim()) return msgS[1]("\u540D\u79F0\u4E0D\u80FD\u4E3A\u7A7A");
        if (!f.id && !f.secret) return msgS[1]("\u65B0\u589E\u51ED\u636E\u5FC5\u987B\u586B\u5199\u660E\u6587");
        if (!alreadyUnlocked && statusS[0] && statusS[0].locked) {
          msgS[1]("\u4FDD\u9669\u7BB1\u5DF2\u9501\u5B9A\uFF0C\u8BF7\u5148\u89E3\u9501\u518D\u4FDD\u5B58");
          askUnlock("\u4FDD\u9669\u7BB1\u5DF2\u9501\u5B9A\uFF0C\u8F93\u5165\u4E3B\u53E3\u4EE4\u540E\u4F1A\u81EA\u52A8\u7EE7\u7EED\u4FDD\u5B58\u3002");
          return;
        }
        busyS[1](true);
        msgS[1]("");
        var meta = {};
        var note = (f.note || "").trim();
        if (note) meta.note = note;
        var picked = f.setIds || [];
        var payload = {
          name: f.name.trim(),
          kind: f.kind,
          meta
        };
        if (f.secret) payload.secret = f.secret;
        if (f.id) payload.id = f.id;
        if (!f.id && picked.length) payload.setId = picked[0];
        var p = f.id ? C.call(api, "vault.secretUpdate", payload) : C.call(api, "vault.secretCreate", payload);
        p.then(function(r) {
          var createdId = r && r.id || f.id;
          return syncSets(createdId, f.setIds || [], f.id ? rowSetIds(f.id) : []).catch(function(e) {
            msgS[1]("\u51ED\u636E\u5DF2\u4FDD\u5B58\uFF0C\u4F46\u96C6\u5408\u6302\u8F7D\u5931\u8D25\uFF1A" + C.errText(e));
          }).then(function() {
            busyS[1](false);
            editingS[1](false);
            showSecretS[1](false);
            formS[1](emptyForm());
            load();
          });
        }).catch(function(e) {
          busyS[1](false);
          var text = C.errText(e);
          msgS[1](text);
          load();
          if (isLockedText(text)) askUnlock("\u4FDD\u9669\u7BB1\u5DF2\u9501\u5B9A\uFF0C\u8F93\u5165\u4E3B\u53E3\u4EE4\u540E\u4F1A\u81EA\u52A8\u7EE7\u7EED\u4FDD\u5B58\u3002");
        });
      }
      function rowSetIds(id) {
        for (var i = 0; i < rows.length; i += 1) if (rows[i].id === id) return (rows[i].setIds || []).slice();
        return [];
      }
      function syncSets(secretId, next, prev) {
        var added = next.filter(function(x) {
          return prev.indexOf(x) < 0;
        });
        var removed = prev.filter(function(x) {
          return next.indexOf(x) < 0;
        });
        var jobs = added.map(function(setId) {
          return C.call(api, "vault.setAttachSecret", { setId, secretId });
        }).concat(removed.map(function(setId) {
          return C.call(api, "vault.setDetachSecret", { setId, secretId });
        }));
        return Promise.all(jobs);
      }
      function del(row) {
        if (!window.confirm("\u5220\u9664\u51ED\u636E\u300C" + row.name + "\u300D\uFF1F\u7ED1\u5B9A\u5B83\u7684\u8FDE\u63A5\u5668\u4F1A\u5931\u6548\u3002")) return;
        busyS[1](true);
        msgS[1]("");
        C.call(api, "vault.secretDelete", { id: row.id }).then(function() {
          busyS[1](false);
          load();
        }).catch(function(e) {
          busyS[1](false);
          msgS[1](C.errText(e));
        });
      }
      function reveal(row) {
        msgS[1]("");
        var mode = statusS[0] && statusS[0].unlockMode;
        if (mode === "B") {
          askS[1]({ row, value: "", busy: false, error: "" });
          return;
        }
        doReveal(row, void 0);
      }
      function doReveal(row, passphrase) {
        busyS[1](true);
        C.call(api, "vault.secretReveal", { id: row.id, passphrase }).then(function(r) {
          busyS[1](false);
          askS[1](null);
          revealS[1]({ name: row.name, secret: r.secret });
        }).catch(function(e) {
          busyS[1](false);
          if (askS[0]) askS[1](Object.assign({}, askS[0], { busy: false, error: C.errText(e) }));
          else msgS[1](C.errText(e));
        });
      }
      function confirmPassphrase() {
        var a = askS[0];
        if (!a || !a.value) return;
        askS[1](Object.assign({}, a, { busy: true, error: "" }));
        doReveal(a.row, a.value);
      }
      var setIndex = {};
      setsS[0].forEach(function(s) {
        setIndex[s.id] = s.name;
      });
      return h(
        "div",
        { className: "wbv" },
        h(
          "div",
          { className: "wbv-row" },
          h("h2", { className: "wbv-grow" }, "\u51ED\u636E\u5E93"),
          h("input", {
            className: "wbv-search",
            placeholder: "\u641C\u7D22\u540D\u79F0\u3001\u5907\u6CE8\u6216\u96C6\u5408",
            value: qS[0],
            onChange: function(e) {
              qS[1](e.target.value);
            },
            onKeyDown: function(e) {
              if (e.key === "Enter") load();
            }
          }),
          h(
            "select",
            {
              value: kindS[0],
              onChange: function(e) {
                kindS[1](e.target.value);
                setTimeout(load, 0);
              }
            },
            h("option", { value: "" }, "\u5168\u90E8\u7C7B\u578B"),
            K.CREATABLE_KINDS.map(function(k) {
              return h("option", { key: k, value: k }, KIND_LABEL[k]);
            })
          ),
          h(C.Btn, { h, onClick: load }, "\u5237\u65B0"),
          statusS[0] && statusS[0].locked ? h(C.Btn, { h, kind: "primary", onClick: function() {
            askUnlock("");
          } }, "\u89E3\u9501") : null,
          h(C.Btn, { h, kind: "primary", onClick: startCreate }, "\u65B0\u589E\u51ED\u636E")
        ),
        h("p", { className: "wbv-muted" }, "\u51ED\u636E\u6309\u300C\u96C6\u5408\u300D\u7EC4\u7EC7\uFF1A\u4E00\u6761\u51ED\u636E\u53EF\u4EE5\u8FDB\u591A\u4E2A\u96C6\u5408\uFF0C\u4E00\u4E2A\u96C6\u5408\u53EF\u4EE5\u6302\u5230\u591A\u4E2A\u5206\u7EC4\u3002\u660E\u6587\u53EA\u5728\u672C\u673A\u89E3\u9501\u540E\u53EF\u89C1\u3002"),
        statusS[0] && statusS[0].locked ? h(C.Notice, { h, kind: "error", text: "\u4FDD\u9669\u7BB1\u5DF2\u9501\u5B9A\uFF08" + (statusS[0].unlockMode || "A") + " \u6A21\u5F0F\uFF09\uFF1A\u65B0\u589E\u3001\u7F16\u8F91\u548C\u67E5\u770B\u660E\u6587\u90FD\u9700\u8981\u5148\u89E3\u9501\u3002\u70B9\u53F3\u4E0A\u89D2\u300C\u89E3\u9501\u300D\uFF0C\u6216\u76F4\u63A5\u4FDD\u5B58\u65F6\u6309\u63D0\u793A\u89E3\u9501\u3002" }) : null,
        h(C.Notice, { h, kind: "error", text: listS[0].error || msgS[0] }),
        listS[0].loading ? h(C.Empty, { h, text: "\u8BFB\u53D6\u4E2D\u2026" }) : rows.length === 0 ? h(
          "div",
          { className: "wbv-empty-card" },
          h("div", { className: "wbv-empty-title" }, qS[0] || kindS[0] ? "\u6CA1\u6709\u5339\u914D\u7684\u51ED\u636E" : "\u8FD8\u6CA1\u6709\u51ED\u636E"),
          h("div", { className: "wbv-muted" }, qS[0] || kindS[0] ? "\u6362\u4E2A\u5173\u952E\u8BCD\u6216\u7C7B\u578B\u8BD5\u8BD5\u3002" : "\u65B0\u589E\u4E00\u6761\u540E\uFF0C\u628A\u5B83\u52A0\u5165\u96C6\u5408\uFF1B\u7AD9\u70B9\u8D26\u53F7\u4F1A\u81EA\u52A8\u7528\u8D26\u53F7 id \u4F5C\u4E3A\u96C6\u5408\u540D\u3002"),
          h("div", { className: "wbv-row" }, h(C.Btn, { h, kind: "primary", onClick: startCreate }, "\u65B0\u589E\u51ED\u636E"))
        ) : h(
          "table",
          { className: "wbv-table" },
          h("thead", null, h("tr", null, ["\u540D\u79F0", "\u7C7B\u578B", "\u6240\u5C5E\u96C6\u5408", "\u5907\u6CE8", "\u6700\u8FD1\u4F7F\u7528", "\u64CD\u4F5C"].map(function(x) {
            return h("th", { key: x }, x);
          }))),
          h("tbody", null, rows.map(function(row) {
            var meta = {};
            try {
              meta = JSON.parse(row.meta || "{}");
            } catch (e) {
              meta = {};
            }
            var chips = (row.setIds || []).map(function(id) {
              return h("span", { key: id, className: "wbv-chip" }, setIndex[id] || id);
            });
            return h(
              "tr",
              { key: row.id },
              h("td", null, h("strong", null, row.name), h("div", { className: "wbv-muted" }, row.id)),
              h("td", null, h("span", { className: "wbv-pill" }, KIND_LABEL[row.kind] || row.kind)),
              h("td", null, chips.length ? h("div", { className: "wbv-chips" }, chips) : h("span", { className: "wbv-muted" }, "\u672A\u52A0\u5165\u96C6\u5408")),
              h("td", null, noteOf(meta) || "\u2014"),
              h("td", null, C.fmtTime(row.lastUsedAt, lang)),
              h("td", null, h(
                "div",
                { className: "wbv-inline" },
                h(C.Btn, { h, kind: "ghost", onClick: function() {
                  reveal(row);
                } }, "\u67E5\u770B"),
                h(C.Btn, { h, kind: "ghost", onClick: function() {
                  startEdit(row);
                } }, "\u7F16\u8F91"),
                h(C.Btn, { h, kind: "ghost", onClick: function() {
                  del(row);
                } }, "\u5220\u9664")
              ))
            );
          }))
        ),
        editingS[0] ? h(
          "div",
          { className: "wbv-modal", onClick: function() {
            editingS[1](false);
            showSecretS[1](false);
          } },
          h(
            "div",
            { className: "wbv-modal-box", onClick: function(e) {
              e.stopPropagation();
            } },
            h("h3", null, formS[0].id ? "\u7F16\u8F91\u51ED\u636E" : "\u65B0\u589E\u51ED\u636E"),
            h(C.Field, { h, label: "\u540D\u79F0" }, h("input", { value: formS[0].name, onChange: function(e) {
              formS[1](Object.assign({}, formS[0], { name: e.target.value }));
            } })),
            h(
              C.Field,
              { h, label: "\u7C7B\u578B" },
              h(
                "select",
                { value: formS[0].kind, onChange: function(e) {
                  formS[1](Object.assign({}, formS[0], { kind: e.target.value }));
                } },
                K.CREATABLE_KINDS.map(function(k) {
                  return h("option", { key: k, value: k }, KIND_LABEL[k]);
                })
              )
            ),
            h(
              C.Field,
              { h, label: formS[0].id ? "\u65B0\u660E\u6587\uFF08\u7559\u7A7A\u4E0D\u8F6E\u6362\uFF09" : "\u660E\u6587" },
              h(SecretField, {
                h,
                show: showSecretS[0],
                value: formS[0].secret,
                placeholder: formS[0].id ? "\u4E0D\u4FEE\u6539\u8BF7\u7559\u7A7A" : "\u5BC6\u7801 / \u624B\u673A\u53F7 / \u8BC1\u4EF6\u53F7 / token",
                onChange: function(v) {
                  formS[1](Object.assign({}, formS[0], { secret: v }));
                },
                onToggle: function() {
                  showSecretS[1](!showSecretS[0]);
                }
              })
            ),
            h(
              C.Field,
              { h, label: "\u6240\u5C5E\u96C6\u5408\uFF08\u53EF\u591A\u9009\uFF09", hint: setsS[0].length ? "\u52FE\u9009\u540E\u4FDD\u5B58\u65F6\u540C\u6B65\u6302\u8F7D/\u6458\u9664" : "\u8FD8\u6CA1\u6709\u96C6\u5408\uFF0C\u53EF\u5148\u5728\u300C\u96C6\u5408\u300D\u9875\u65B0\u5EFA" },
              setsS[0].length ? h("div", { className: "wbv-check-list" }, setsS[0].map(function(s) {
                var on = (formS[0].setIds || []).indexOf(s.id) >= 0;
                return h(
                  "label",
                  { key: s.id, className: "wbv-check" },
                  h("input", { type: "checkbox", checked: on, onChange: function() {
                    toggleSet(s.id);
                  } }),
                  h("span", { className: "wbv-dot", style: { background: s.color || "var(--wb-accent)" } }),
                  h("span", null, s.name),
                  h("span", { className: "wbv-muted" }, " \xB7 " + (s.secretCount || 0) + " \u6761")
                );
              })) : h("span", { className: "wbv-muted" }, "\u2014")
            ),
            h(
              C.Field,
              { h, label: "\u5907\u6CE8", hint: "\u975E\u654F\u611F\u4FE1\u606F\uFF08\u7528\u6237\u540D\u3001URL\u3001\u8FC7\u671F\u63D0\u9192\uFF09" },
              h("input", {
                value: formS[0].note || "",
                placeholder: "\u4F8B\u5982\uFF1A\u7528\u6237\u540D\u3001URL\u3001\u8FC7\u671F\u63D0\u9192",
                onChange: function(e) {
                  formS[1](Object.assign({}, formS[0], { note: e.target.value }));
                }
              })
            ),
            h(C.Notice, { h, kind: "error", text: msgS[0] }),
            h(
              "div",
              { className: "wbv-row" },
              h("span", { className: "wbv-grow" }),
              h(C.Btn, { h, onClick: function() {
                editingS[1](false);
                showSecretS[1](false);
              } }, "\u53D6\u6D88"),
              h(C.Btn, { h, kind: "primary", disabled: busyS[0], onClick: function() {
                save(false);
              } }, busyS[0] ? "\u4FDD\u5B58\u4E2D\u2026" : "\u4FDD\u5B58")
            )
          )
        ) : null,
        unlockS[0] ? h(AskPassphrase, {
          h,
          C,
          title: "\u89E3\u9501\u4FDD\u9669\u7BB1",
          hint: "\u89E3\u9501\u72B6\u6001\u53EA\u4FDD\u5B58\u5728\u5F53\u524D\u8FDB\u7A0B\u5185\u5B58\uFF0C\u7A7A\u95F2\u8D85\u65F6\u4F1A\u81EA\u52A8\u9501\u5B9A\u3002",
          label: "\u4E3B\u53E3\u4EE4",
          value: unlockS[0].value,
          busy: unlockS[0].busy,
          error: unlockS[0].error,
          onChange: function(v) {
            unlockS[1](Object.assign({}, unlockS[0], { value: v }));
          },
          show: unlockS[0].show,
          onToggle: function() {
            unlockS[1](Object.assign({}, unlockS[0], { show: !unlockS[0].show }));
          },
          onCancel: function() {
            if (!unlockS[0].busy) unlockS[1](null);
          },
          onConfirm: confirmUnlock
        }) : null,
        askS[0] ? h(AskPassphrase, { h, C, title: "\u67E5\u770B\u51ED\u636E\u660E\u6587", hint: "\u5F53\u524D\u662F B \u6A21\u5F0F\uFF0C\u67E5\u770B\u660E\u6587\u9700\u8981\u518D\u6B21\u8F93\u5165\u4E3B\u53E3\u4EE4\u3002", label: "\u4E3B\u53E3\u4EE4\uFF08" + askS[0].row.name + "\uFF09", value: askS[0].value, busy: askS[0].busy, error: askS[0].error, onChange: function(v) {
          askS[1](Object.assign({}, askS[0], { value: v }));
        }, show: askS[0].show, onToggle: function() {
          askS[1](Object.assign({}, askS[0], { show: !askS[0].show }));
        }, onCancel: function() {
          if (!askS[0].busy) askS[1](null);
        }, onConfirm: confirmPassphrase }) : null,
        revealS[0] ? h(
          "div",
          { className: "wbv-modal", onClick: function() {
            revealS[1](null);
          } },
          h(
            "div",
            { className: "wbv-modal-box", onClick: function(e) {
              e.stopPropagation();
            } },
            h("h3", null, "\u51ED\u636E\u660E\u6587 \xB7 " + revealS[0].name),
            h("div", { className: "wbv-secret" }, revealS[0].secret),
            h(
              "div",
              { className: "wbv-row" },
              h(C.Btn, { h, onClick: function() {
                if (navigator.clipboard) navigator.clipboard.writeText(revealS[0].secret).then(function() {
                  msgS[1]("\u5DF2\u590D\u5236");
                });
              } }, "\u590D\u5236"),
              h("span", { className: "wbv-grow" }),
              h(C.Btn, { h, onClick: function() {
                revealS[1](null);
              } }, "\u5173\u95ED")
            )
          )
        ) : null
      );
    };
    function noteOf(meta) {
      if (!meta) return "";
      if (meta.note) return String(meta.note);
      return [meta.username, meta.url].filter(Boolean).join(" \xB7 ");
    }
    function emptyForm() {
      return { id: "", name: "", kind: "password", secret: "", setIds: [], note: "" };
    }
    module2.exports.noteOf = noteOf;
  }
});

// packages/addons/vault/client/views/sets.cjs
var require_sets = __commonJS({
  "packages/addons/vault/client/views/sets.cjs"(exports2, module2) {
    "use strict";
    var C = require_common();
    var K = require_kinds();
    module2.exports = function SetsView(props) {
      var h = props.h;
      var api = props.api;
      var lang = props.lang || "zh";
      var React = props.React;
      var listS = React.useState({ loading: true, items: [], error: "" });
      var secretsS = React.useState([]);
      var groupsS = React.useState([]);
      var activeS = React.useState(null);
      var detailS = React.useState({ setId: "", secrets: [], groups: [], error: "" });
      var qS = React.useState("");
      var msgS = React.useState("");
      var busyS = React.useState(false);
      var draftS = React.useState(null);
      var pickS = React.useState([]);
      function load() {
        listS[1](function(old) {
          return Object.assign({}, old, { loading: true });
        });
        Promise.all([
          C.call(api, "vault.setList", { q: qS[0] }),
          C.call(api, "vault.secretList", {}),
          C.call(api, "vault.groupList", {})
        ]).then(function(r) {
          listS[1]({ loading: false, items: r[0] && r[0].items || [], error: "" });
          secretsS[1](r[1] && (r[1].items || r[1].secrets) || []);
          groupsS[1](r[2] && r[2].items || []);
          if (activeS[0]) return open(activeS[0]).then(null, function() {
          });
        }).catch(function(e) {
          listS[1]({ loading: false, items: [], error: C.errText(e) });
        });
      }
      React.useEffect(function() {
        load();
      }, []);
      function secretName(id) {
        for (var i = 0; i < secretsS[0].length; i += 1) if (secretsS[0][i].id === id) return secretsS[0][i].name;
        return id;
      }
      function open(row) {
        activeS[1](row);
        detailS[1]({ setId: row.id, secrets: [], groups: [], error: "" });
        return C.call(api, "vault.setGet", { id: row.id }).then(function(r) {
          detailS[1]({ setId: row.id, secrets: r && r.secrets || [], groups: r && r.groupIds || [], error: "" });
        }).catch(function(e) {
          detailS[1]({ setId: row.id, secrets: [], groups: [], error: C.errText(e) });
        });
      }
      function startCreate() {
        draftS[1]({ name: "", description: "", color: "" });
        msgS[1]("");
      }
      function startEdit(set) {
        draftS[1]({ id: set.id, name: set.name, description: set.description || "", color: set.color || "" });
        msgS[1]("");
      }
      function saveDraft() {
        var d = draftS[0];
        if (!d || !String(d.name || "").trim()) return msgS[1]("\u96C6\u5408\u540D\u4E0D\u80FD\u4E3A\u7A7A");
        busyS[1](true);
        msgS[1]("");
        var body = { name: String(d.name).trim(), description: d.description || "", color: d.color || "" };
        var req = d.id ? C.call(api, "vault.setUpdate", Object.assign({ id: d.id }, body)) : C.call(api, "vault.setCreate", body);
        req.then(function() {
          busyS[1](false);
          draftS[1](null);
          load();
        }).catch(function(e) {
          busyS[1](false);
          msgS[1](C.errText(e));
        });
      }
      function removeSet(set) {
        if (!window.confirm("\u5220\u9664\u96C6\u5408\u300C" + set.name + "\u300D\uFF1F\u53EA\u89E3\u9664\u5173\u8054\uFF0C\u51ED\u636E\u672C\u8EAB\u4FDD\u7559\u3002")) return;
        busyS[1](true);
        msgS[1]("");
        C.call(api, "vault.setDelete", { id: set.id }).then(function() {
          busyS[1](false);
          activeS[1](null);
          load();
        }).catch(function(e) {
          busyS[1](false);
          msgS[1](C.errText(e));
        });
      }
      function detach(secretId) {
        busyS[1](true);
        msgS[1]("");
        C.call(api, "vault.setDetachSecret", { setId: activeS[0].id, secretId }).then(function() {
          busyS[1](false);
          open(activeS[0]);
          load();
        }).catch(function(e) {
          busyS[1](false);
          msgS[1](C.errText(e));
        });
      }
      function attachPicked() {
        if (!pickS[0].length) return;
        busyS[1](true);
        msgS[1]("");
        var jobs = pickS[0].map(function(secretId) {
          return C.call(api, "vault.setAttachSecret", { setId: activeS[0].id, secretId });
        });
        Promise.all(jobs).then(function() {
          busyS[1](false);
          pickS[1]([]);
          open(activeS[0]);
          load();
        }).catch(function(e) {
          busyS[1](false);
          msgS[1](C.errText(e));
        });
      }
      function toggleGroup(groupId, on) {
        busyS[1](true);
        msgS[1]("");
        var action = on ? "vault.groupAttachSet" : "vault.groupDetachSet";
        C.call(api, action, { groupId, setId: activeS[0].id }).then(function() {
          busyS[1](false);
          open(activeS[0]);
          load();
        }).catch(function(e) {
          busyS[1](false);
          msgS[1](C.errText(e));
        });
      }
      var items = listS[0].items.filter(function(set) {
        var q = qS[0].trim();
        if (!q) return true;
        return (set.name || "").indexOf(q) >= 0 || (set.description || "").indexOf(q) >= 0;
      });
      var detail = detailS[0];
      var inSet = {};
      detail.secrets.forEach(function(s) {
        inSet[s.id] = true;
      });
      var candidates = secretsS[0].filter(function(s) {
        return !inSet[s.id];
      });
      return h(
        "div",
        { className: "wbv" },
        h(
          "div",
          { className: "wbv-row" },
          h("h2", { className: "wbv-grow" }, "\u51ED\u636E\u96C6\u5408"),
          h("input", { style: { maxWidth: "200px" }, placeholder: "\u641C\u7D22\u96C6\u5408\u540D/\u63CF\u8FF0", value: qS[0], onChange: function(e) {
            qS[1](e.target.value);
          } }),
          h(C.Btn, { h, onClick: load }, "\u5237\u65B0"),
          h(C.Btn, { h, kind: "primary", onClick: startCreate }, "\u65B0\u5EFA\u96C6\u5408")
        ),
        h("p", { className: "wbv-muted" }, "\u4E00\u4E2A\u96C6\u5408\u53EF\u4EE5\u6302\u5230\u591A\u4E2A\u5206\u7EC4\u3001\u88C5\u591A\u6761\u51ED\u636E\uFF1B\u5220\u9664\u96C6\u5408\u53EA\u65AD\u5173\u8054\uFF0C\u4E0D\u5220\u51ED\u636E\u3002"),
        h(C.Notice, { h, kind: "error", text: listS[0].error || msgS[0] }),
        h(
          "div",
          { className: "wbv-split" },
          h(
            "div",
            { className: "wbv-list" },
            listS[0].loading ? h(C.Empty, { h, text: "\u8BFB\u53D6\u96C6\u5408\u2026" }) : items.length === 0 ? h(
              "div",
              { className: "wbv-card" },
              h("div", { className: "wbv-muted" }, qS[0] ? "\u6CA1\u6709\u5339\u914D\u7684\u96C6\u5408\u3002" : "\u8FD8\u6CA1\u6709\u96C6\u5408\u3002\u65B0\u5EFA\u4E00\u4E2A\u540E\uFF0C\u53EF\u4EE5\u628A\u51ED\u636E\u548C\u5206\u7EC4\u90FD\u6302\u8FDB\u6765\u3002"),
              h(
                "div",
                { className: "wbv-row", style: { marginTop: "8px" } },
                h(C.Btn, { h, kind: "primary", onClick: startCreate }, "\u65B0\u5EFA\u96C6\u5408")
              )
            ) : items.map(function(set) {
              var on = activeS[0] && activeS[0].id === set.id;
              return h(
                "div",
                {
                  key: set.id,
                  className: "wbv-item" + (on ? " on" : ""),
                  onClick: function() {
                    open(set);
                  }
                },
                h(
                  "div",
                  { className: "wbv-item-top" },
                  h("span", { className: "wbv-dot", style: set.color ? { background: set.color } : null }),
                  h("strong", null, set.name),
                  h("span", { className: "wbv-grow" }),
                  h("span", { className: "wbv-pill" }, (set.secretCount || 0) + " \u6761\u51ED\u636E")
                ),
                h(
                  "div",
                  { className: "wbv-muted", style: { fontSize: "11px", marginTop: "2px" } },
                  (set.description || "\u2014") + " \xB7 " + (set.groupIds || []).length + " \u4E2A\u5206\u7EC4"
                )
              );
            })
          ),
          h(
            "div",
            { className: "wbv-card" },
            !activeS[0] ? h(C.Empty, { h, text: "\u5DE6\u4FA7\u9009\u4E00\u4E2A\u96C6\u5408\uFF0C\u67E5\u770B\u51ED\u636E\u4E0E\u5206\u7EC4\u3002" }) : h(
              React.Fragment,
              null,
              h(
                "div",
                { className: "wbv-row" },
                h("h3", { className: "wbv-grow" }, activeS[0].name),
                h(C.Btn, { h, onClick: function() {
                  startEdit(activeS[0]);
                } }, "\u7F16\u8F91"),
                h(C.Btn, { h, kind: "danger", onClick: function() {
                  removeSet(activeS[0]);
                } }, "\u5220\u9664\u96C6\u5408")
              ),
              detail.error ? h(C.Notice, { h, kind: "error", text: detail.error }) : null,
              h("div", { className: "wbv-label" }, "\u96C6\u5408\u5185\u51ED\u636E"),
              detail.secrets.length === 0 ? h("div", { className: "wbv-muted" }, "\u8FD8\u6CA1\u6709\u51ED\u636E\u3002") : h(
                "table",
                { className: "wbv-table" },
                h("thead", null, h("tr", null, ["\u540D\u79F0", "\u7C7B\u578B", "\u66F4\u65B0\u65F6\u95F4", "\u64CD\u4F5C"].map(function(x) {
                  return h("th", { key: x }, x);
                }))),
                h("tbody", null, detail.secrets.map(function(s) {
                  return h(
                    "tr",
                    { key: s.id },
                    h("td", null, h("strong", null, s.name)),
                    h("td", null, h("span", { className: "wbv-pill" }, K.KIND_LABEL[s.kind] || s.kind)),
                    h("td", null, C.fmtTime(s.updatedAt, lang)),
                    h("td", null, h(C.Btn, { h, kind: "ghost", onClick: function() {
                      detach(s.id);
                    } }, "\u79FB\u51FA"))
                  );
                }))
              ),
              h(
                "div",
                { className: "wbv-row" },
                h(
                  "select",
                  {
                    style: { maxWidth: "260px" },
                    value: "",
                    onChange: function(e) {
                      var v = e.target.value;
                      if (v) pickS[1](pickS[0].concat([v]));
                      e.target.value = "";
                    }
                  },
                  h("option", { value: "" }, candidates.length ? "\u9009\u62E9\u8981\u52A0\u5165\u7684\u51ED\u636E\u2026" : "\u6CA1\u6709\u53EF\u52A0\u5165\u7684\u51ED\u636E"),
                  candidates.map(function(s) {
                    return h("option", { key: s.id, value: s.id }, s.name + "\uFF08" + (K.KIND_LABEL[s.kind] || s.kind) + "\uFF09");
                  })
                ),
                pickS[0].length ? h("span", { className: "wbv-chips" }, pickS[0].map(function(id) {
                  return h(
                    "span",
                    { className: "wbv-chip", key: id },
                    secretName(id),
                    h("button", { className: "wbv-btn ghost", onClick: function() {
                      pickS[1](pickS[0].filter(function(x) {
                        return x !== id;
                      }));
                    } }, "\xD7")
                  );
                })) : null,
                h("span", { className: "wbv-grow" }),
                h(C.Btn, { h, kind: "primary", disabled: !pickS[0].length || busyS[0], onClick: attachPicked }, "\u52A0\u5165 " + (pickS[0].length || ""))
              ),
              h("div", { className: "wbv-label" }, "\u6302\u9760\u5206\u7EC4"),
              h(
                "div",
                { className: "wbv-chips" },
                groupsS[0].length === 0 ? h("span", { className: "wbv-muted" }, "\u8FD8\u6CA1\u6709\u5206\u7EC4\u3002") : groupsS[0].map(function(g) {
                  var on = detail.groups.indexOf(g.id) >= 0;
                  return h(
                    "label",
                    { key: g.id, className: "wbv-chip", style: { cursor: "pointer" } },
                    h("input", { type: "checkbox", checked: on, disabled: busyS[0], onChange: function(e) {
                      toggleGroup(g.id, e.target.checked);
                    } }),
                    g.name
                  );
                })
              )
            ),
            draftS[0] ? h(
              "div",
              { className: "wbv-modal", onClick: function() {
                draftS[1](null);
              } },
              h(
                "div",
                { className: "wbv-modal-box", onClick: function(e) {
                  e.stopPropagation();
                } },
                h("h3", null, draftS[0].id ? "\u7F16\u8F91\u96C6\u5408" : "\u65B0\u5EFA\u96C6\u5408"),
                h(
                  C.Field,
                  { h, label: "\u96C6\u5408\u540D" },
                  h("input", { value: draftS[0].name, placeholder: "\u5982 acc_1 / \u5DE5\u4F5C\u90AE\u7BB1", onChange: function(e) {
                    draftS[1](Object.assign({}, draftS[0], { name: e.target.value }));
                  } })
                ),
                h(
                  C.Field,
                  { h, label: "\u63CF\u8FF0" },
                  h("input", { value: draftS[0].description, placeholder: "\u53EF\u9009", onChange: function(e) {
                    draftS[1](Object.assign({}, draftS[0], { description: e.target.value }));
                  } })
                ),
                h(
                  C.Field,
                  { h, label: "\u989C\u8272\uFF08\u53EF\u9009\uFF0C\u4E3B\u9898 token \u540D\u6216\u8272\u503C\uFF09" },
                  h("input", { value: draftS[0].color, placeholder: "\u5982 --wb-accent", onChange: function(e) {
                    draftS[1](Object.assign({}, draftS[0], { color: e.target.value }));
                  } })
                ),
                h(C.Notice, { h, kind: "error", text: msgS[0] }),
                h(
                  "div",
                  { className: "wbv-row" },
                  h("span", { className: "wbv-grow" }),
                  h(C.Btn, { h, onClick: function() {
                    draftS[1](null);
                  } }, "\u53D6\u6D88"),
                  h(C.Btn, { h, kind: "primary", disabled: busyS[0], onClick: saveDraft }, busyS[0] ? "\u4FDD\u5B58\u4E2D\u2026" : "\u4FDD\u5B58")
                )
              )
            ) : null
          )
        )
      );
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

// packages/addons/vault/client/views/groups.cjs
var require_groups = __commonJS({
  "packages/addons/vault/client/views/groups.cjs"(exports2, module2) {
    "use strict";
    var C = require_common();
    var FilterChecklist = require_filter_checklist();
    module2.exports = function GroupsView(props) {
      var h = props.h;
      var api = props.api;
      var lang = props.lang || "zh";
      var React = props.React;
      var listS = React.useState({ loading: true, rows: [], error: "" });
      var msgS = React.useState("");
      var busyS = React.useState(false);
      var createS = React.useState(null);
      var openS = React.useState(null);
      var setsS = React.useState([]);
      var delS = React.useState(null);
      var pickS = React.useState({ q: "", rows: [], page: 1, loading: false });
      function load() {
        listS[1](function(old) {
          return Object.assign({}, old, { loading: true });
        });
        Promise.all([
          C.call(api, "vault.groupList"),
          C.call(api, "vault.setList", {}).catch(function() {
            return { items: [] };
          })
        ]).then(function(r) {
          listS[1]({ loading: false, rows: r[0] && r[0].items || [], error: "" });
          setsS[1](r[1] && r[1].items || []);
        }).catch(function(e) {
          listS[1]({ loading: false, rows: [], error: C.errText(e) });
        });
      }
      React.useEffect(function() {
        load();
      }, []);
      function openCreate() {
        createS[1]({ name: "", description: "", setIds: [], error: "", busy: false });
      }
      function closeCreate() {
        if (createS[0] && createS[0].busy) return;
        createS[1](null);
      }
      function patchCreate(patch) {
        createS[1](function(old) {
          return old ? Object.assign({}, old, patch) : old;
        });
      }
      function toggleCreateSet(id) {
        var cur = createS[0] && createS[0].setIds || [];
        var next = cur.indexOf(id) >= 0 ? cur.filter(function(x) {
          return x !== id;
        }) : cur.concat([id]);
        patchCreate({ setIds: next });
      }
      var PICK_PAGE = 20;
      var pickOpen = Boolean(createS[0]);
      var pickQ = pickS[0].q;
      React.useEffect(function() {
        if (!pickOpen) return void 0;
        var alive = true;
        var timer = setTimeout(function() {
          pickS[1](function(old) {
            return Object.assign({}, old, { loading: true });
          });
          C.call(api, "vault.setList", pickQ ? { q: pickQ } : {}).then(function(r) {
            if (!alive) return;
            pickS[1]({ q: pickQ, rows: r && r.items || [], page: 1, loading: false });
          }).catch(function() {
            if (alive) pickS[1](function(old) {
              return Object.assign({}, old, { loading: false });
            });
          });
        }, pickQ ? 200 : 0);
        return function() {
          alive = false;
          clearTimeout(timer);
        };
      }, [pickOpen, pickQ]);
      function pickQuery(v) {
        pickS[1](function(old) {
          return Object.assign({}, old, { q: v, loading: true });
        });
      }
      function pickMore() {
        pickS[1](function(old) {
          return old.page * PICK_PAGE >= old.rows.length ? old : Object.assign({}, old, { page: old.page + 1 });
        });
      }
      function pickClear() {
        patchCreate({ setIds: [] });
        pickS[1](function(old) {
          return Object.assign({}, old, { q: "", page: 1 });
        });
      }
      function create() {
        var c = createS[0];
        if (!c) return;
        if (!c.name.trim()) return patchCreate({ error: "\u5206\u7EC4\u540D\u79F0\u4E0D\u80FD\u4E3A\u7A7A" });
        patchCreate({ busy: true, error: "" });
        C.call(api, "vault.groupCreate", { name: c.name.trim(), description: c.description.trim() }).then(function(r) {
          var groupId = r && r.id;
          var picks = c.setIds || [];
          return Promise.all(picks.map(function(setId) {
            return C.call(api, "vault.groupAttachSet", { groupId, setId }).then(
              function() {
                return true;
              },
              function() {
                return false;
              }
            );
          })).then(function(results) {
            var failed = results.filter(function(ok) {
              return !ok;
            }).length;
            createS[1](null);
            msgS[1](failed ? "\u5206\u7EC4\u5DF2\u521B\u5EFA\uFF0C" + failed + " \u4E2A\u96C6\u5408\u6302\u8F7D\u5931\u8D25\uFF0C\u53EF\u5728\u300C\u67E5\u770B\u5173\u8054\u300D\u91CC\u8865\u6302" : "");
            load();
          });
        }).catch(function(e) {
          patchCreate({ busy: false, error: C.errText(e) });
        });
      }
      var createOpen = Boolean(createS[0]);
      React.useEffect(function() {
        if (!createOpen) return void 0;
        function onKey(e) {
          if (e.key === "Escape") closeCreate();
        }
        window.addEventListener("keydown", onKey);
        return function() {
          window.removeEventListener("keydown", onKey);
        };
      }, [createOpen]);
      function remove(row) {
        delS[1]({ row, moveTo: "" });
      }
      function confirmRemove() {
        var d = delS[0];
        if (!d) return;
        busyS[1](true);
        msgS[1]("");
        C.call(api, "vault.groupDelete", { id: d.row.id, moveTo: d.moveTo || void 0 }).then(function() {
          busyS[1](false);
          delS[1](null);
          if (openS[0] && openS[0].group.id === d.row.id) openS[1](null);
          load();
        }).catch(function(e) {
          busyS[1](false);
          msgS[1](C.errText(e));
        });
      }
      function open(row) {
        openS[1]({ group: row, items: [], loading: true, error: "" });
        C.call(api, "vault.subjectsOf", { groupId: row.id }).then(function(r) {
          openS[1]({ group: row, items: r && r.items || [], loading: false, error: "" });
        }).catch(function(e) {
          openS[1]({ group: row, items: [], loading: false, error: C.errText(e) });
        });
      }
      function setsOfGroup(row) {
        return setsS[0].filter(function(set) {
          return (set.groupIds || []).indexOf(row.id) >= 0;
        });
      }
      function toggleSet(row, set) {
        var linked = (set.groupIds || []).indexOf(row.id) >= 0;
        busyS[1](true);
        msgS[1]("");
        var call = linked ? C.call(api, "vault.groupDetachSet", { groupId: row.id, setId: set.id }) : C.call(api, "vault.groupAttachSet", { groupId: row.id, setId: set.id });
        call.then(function() {
          busyS[1](false);
          setsS[1](function(old) {
            return old.map(function(item) {
              if (item.id !== set.id) return item;
              var ids = (item.groupIds || []).slice();
              var i = ids.indexOf(row.id);
              if (linked && i >= 0) ids.splice(i, 1);
              if (!linked && i < 0) ids.push(row.id);
              return Object.assign({}, item, { groupIds: ids });
            });
          });
          load();
        }).catch(function(e) {
          busyS[1](false);
          msgS[1](C.errText(e));
        });
      }
      return h(
        "div",
        { className: "wbv" },
        h(
          "div",
          { className: "wbv-row" },
          h("h2", { className: "wbv-grow" }, "\u5206\u7EC4\u4E0E\u5173\u8054"),
          h(C.Btn, { h, onClick: load }, "\u5237\u65B0"),
          h(C.Btn, { h, kind: "primary", onClick: openCreate }, "\u65B0\u5EFA\u5206\u7EC4")
        ),
        h(
          "p",
          { className: "wbv-muted" },
          "\u4E1A\u52A1\u6A21\u5757\uFF08\u7AD9\u70B9\u3001\u8FDE\u63A5\u5668\u7B49\uFF09\u628A\u81EA\u5DF1\u7684\u5BF9\u8C61\u5173\u8054\u5230\u5206\u7EC4\uFF0C\u518D\u6309\u7EC4\u53D6\u7528\u7EC4\u5185\u51ED\u636E\uFF1B\u5173\u8054\u5F15\u7528\u4FDD\u5B58\u5728\u4FDD\u9669\u7BB1\uFF0C\u4E0D\u8981\u6C42\u6A21\u5757\u4F9D\u8D56 sites\u3002"
        ),
        h(C.Notice, { h, kind: "error", text: listS[0].error || msgS[0] }),
        listS[0].loading ? h(C.Empty, { h, text: "\u8BFB\u53D6\u5206\u7EC4\u2026" }) : listS[0].rows.length === 0 ? h(
          "div",
          { className: "wbv-empty-card" },
          h("div", { className: "wbv-empty-title" }, "\u8FD8\u6CA1\u6709\u5206\u7EC4"),
          h("div", { className: "wbv-muted" }, "\u5EFA\u4E00\u4E2A\u7EC4\uFF0C\u628A\u96C6\u5408\u6302\u8FDB\u6765\uFF0C\u518D\u628A\u6A21\u5757\u5BF9\u8C61\u5173\u8054\u5230\u7EC4\u3002"),
          h("div", { className: "wbv-row" }, h(C.Btn, { h, kind: "primary", onClick: openCreate }, "\u65B0\u5EFA\u5206\u7EC4"))
        ) : h(
          "table",
          { className: "wbv-table" },
          h("thead", null, h("tr", null, ["\u5206\u7EC4", "\u63CF\u8FF0", "\u96C6\u5408", "\u51ED\u636E", "\u5173\u8054\u5BF9\u8C61", "\u64CD\u4F5C"].map(function(x) {
            return h("th", { key: x }, x);
          }))),
          h("tbody", null, listS[0].rows.map(function(row) {
            return h(
              "tr",
              { key: row.id },
              h("td", null, h("strong", null, row.name), h("div", { className: "wbv-muted" }, row.id)),
              h("td", null, row.description || "\u2014"),
              h("td", null, setsOfGroup(row).length ? h("div", { className: "wbv-chips" }, setsOfGroup(row).map(function(set) {
                return h("span", { key: set.id, className: "wbv-chip" }, set.name);
              })) : h("span", { className: "wbv-muted" }, "\u672A\u6302\u96C6\u5408")),
              h("td", null, row.secretCount || 0),
              h("td", null, row.bindingCount || 0),
              h("td", null, h(
                "div",
                { className: "wbv-inline" },
                h(C.Btn, { h, kind: "ghost", onClick: function() {
                  open(row);
                } }, "\u67E5\u770B\u5173\u8054"),
                h(C.Btn, { h, kind: "ghost", onClick: function() {
                  remove(row);
                } }, "\u5220\u9664")
              ))
            );
          }))
        ),
        createS[0] ? h(
          "div",
          { className: "wbv-modal", onClick: closeCreate },
          h(
            "div",
            { className: "wbv-modal-box", onClick: function(e) {
              e.stopPropagation();
            } },
            h("h3", null, "\u65B0\u5EFA\u5206\u7EC4"),
            h(
              C.Field,
              { h, label: "\u5206\u7EC4\u540D\u79F0" },
              h("input", {
                value: createS[0].name,
                placeholder: "\u5982 \u5C11\u6570\u6D3E / \u5DE5\u4F5C\u90AE\u7BB1",
                disabled: createS[0].busy,
                autoFocus: true,
                onChange: function(e) {
                  patchCreate({ name: e.target.value });
                }
              })
            ),
            h(
              C.Field,
              { h, label: "\u63CF\u8FF0" },
              h("input", {
                value: createS[0].description,
                placeholder: "\u53EF\u9009",
                disabled: createS[0].busy,
                onChange: function(e) {
                  patchCreate({ description: e.target.value });
                }
              })
            ),
            h(
              C.Field,
              { h, label: "\u96C6\u5408\uFF08\u53EF\u591A\u9009\uFF09", hint: "\u52FE\u9009\u7684\u96C6\u5408\u4F1A\u4E00\u5E76\u6302\u5230\u8FD9\u4E2A\u5206\u7EC4" },
              h(FilterChecklist, {
                items: pickS[0].rows.slice(0, pickS[0].page * PICK_PAGE).map(function(set) {
                  return { id: set.id, name: set.name, meta: (set.secretCount || 0) + " \u6761" };
                }),
                selected: createS[0].setIds || [],
                onToggle: toggleCreateSet,
                query: pickS[0].q,
                onQuery: pickQuery,
                title: "\u5168\u90E8\u96C6\u5408",
                total: pickS[0].rows.length,
                selectedText: "\u5DF2\u9009",
                clearText: "\u6E05\u7A7A",
                onClear: pickClear,
                searchPlaceholder: "\u641C\u7D22\u96C6\u5408\u540D\u79F0\u6216\u63CF\u8FF0",
                loading: pickS[0].loading,
                hasMore: pickS[0].page * PICK_PAGE < pickS[0].rows.length,
                onLoadMore: pickMore,
                emptyText: "\u8FD8\u6CA1\u6709\u96C6\u5408\uFF0C\u53EF\u5148\u5EFA\u7EC4\uFF0C\u518D\u5230\u300C\u96C6\u5408\u300D\u9875\u65B0\u5EFA",
                noMatchText: "\u6CA1\u6709\u5339\u914D\u7684\u96C6\u5408",
                noMoreText: pickS[0].rows.length > PICK_PAGE ? "\u6CA1\u6709\u66F4\u591A" : "",
                loadingText: "\u52A0\u8F7D\u4E2D\u2026",
                disabled: createS[0].busy,
                autoFocus: false
              })
            ),
            h(C.Notice, { h, kind: "error", text: createS[0].error }),
            h(
              "div",
              { className: "wbv-row", style: { justifyContent: "flex-end" } },
              h(C.Btn, { h, disabled: createS[0].busy, onClick: closeCreate }, "\u53D6\u6D88"),
              h(C.Btn, { h, kind: "primary", disabled: createS[0].busy, onClick: create }, createS[0].busy ? "\u521B\u5EFA\u4E2D\u2026" : "\u521B\u5EFA")
            )
          )
        ) : null,
        delS[0] ? h(
          "div",
          { className: "wbv-modal", onClick: function() {
            if (!busyS[0]) delS[1](null);
          } },
          h(
            "div",
            { className: "wbv-modal-box", onClick: function(e) {
              e.stopPropagation();
            } },
            h("h3", null, "\u5220\u9664\u5206\u7EC4\u300C" + delS[0].row.name + "\u300D\uFF1F"),
            h("p", { className: "wbv-sub" }, "\u53EA\u5220\u9664\u5206\u7EC4\u4E0E\u96C6\u5408\u3001\u5173\u8054\u5BF9\u8C61\u7684\u7ED1\u5B9A\uFF0C\u51ED\u636E\u4E0E\u96C6\u5408\u672C\u8EAB\u90FD\u4FDD\u7559\u3002"),
            h(
              C.Field,
              { h, label: "\u7EC4\u5185\u96C6\u5408\u6539\u6302\u5230", hint: "\u7559\u7A7A\u8868\u793A\u4ECE\u6240\u6709\u5206\u7EC4\u79FB\u51FA\uFF08\u96C6\u5408\u4E0E\u51ED\u636E\u4E0D\u5220\uFF09" },
              h(
                "select",
                { value: delS[0].moveTo, disabled: busyS[0], onChange: function(e) {
                  delS[1]({ row: delS[0].row, moveTo: e.target.value });
                } },
                h("option", { value: "" }, "\u4E0D\u8F6C\u79FB\uFF08\u79FB\u51FA\u5206\u7EC4\uFF09"),
                listS[0].rows.filter(function(g) {
                  return g.id !== delS[0].row.id;
                }).map(function(g) {
                  return h("option", { key: g.id, value: g.id }, g.name);
                })
              )
            ),
            h(
              "div",
              { className: "wbv-row", style: { justifyContent: "flex-end" } },
              h(C.Btn, { h, disabled: busyS[0], onClick: function() {
                delS[1](null);
              } }, "\u53D6\u6D88"),
              h(C.Btn, { h, kind: "danger", disabled: busyS[0], onClick: confirmRemove }, busyS[0] ? "\u5220\u9664\u4E2D\u2026" : "\u786E\u8BA4\u5220\u9664")
            )
          )
        ) : null,
        openS[0] ? h(
          "div",
          { className: "wbv-modal", onClick: function() {
            openS[1](null);
          } },
          h(
            "div",
            { className: "wbv-modal-box", onClick: function(e) {
              e.stopPropagation();
            } },
            h("h3", null, "\u300C" + openS[0].group.name + "\u300D\u7684\u5173\u8054\u5BF9\u8C61"),
            h("div", { className: "wbv-sub" }, "\u6302\u8F7D\u96C6\u5408\uFF08\u52FE\u9009\u5373\u6302\u8F7D\uFF0C\u53D6\u6D88\u5373\u6458\u9664\uFF0C\u53EA\u6539\u5173\u8054\u4E0D\u52A8\u51ED\u636E\uFF09"),
            h("div", { className: "wbv-check-list" }, setsS[0].length ? setsS[0].map(function(set) {
              var on = (set.groupIds || []).indexOf(openS[0].group.id) >= 0;
              return h(
                "label",
                { key: set.id, className: "wbv-check" },
                h("input", { type: "checkbox", checked: on, disabled: busyS[0], onChange: function() {
                  toggleSet(openS[0].group, set);
                } }),
                h("span", { className: "wbv-dot", style: { background: set.color || "var(--wb-accent)" } }),
                h("span", null, set.name),
                h("span", { className: "wbv-muted" }, " \xB7 " + (set.secretCount || 0) + " \u6761")
              );
            }) : h("span", { className: "wbv-muted" }, "\u8FD8\u6CA1\u6709\u96C6\u5408")),
            openS[0].loading ? h(C.Empty, { h, text: "\u8BFB\u53D6\u4E2D\u2026" }) : openS[0].error ? h(C.Notice, { h, kind: "error", text: openS[0].error }) : openS[0].items.length === 0 ? h(C.Empty, { h, text: "\u8FD8\u6CA1\u6709\u6A21\u5757\u5173\u8054\u5230\u8FD9\u4E2A\u5206\u7EC4\u3002" }) : h(
              "table",
              { className: "wbv-table" },
              h("thead", null, h("tr", null, ["\u7C7B\u578B", "\u5BF9\u8C61 id", "\u6807\u9898"].map(function(x) {
                return h("th", { key: x }, x);
              }))),
              h("tbody", null, openS[0].items.map(function(item, i) {
                return h(
                  "tr",
                  { key: i },
                  h("td", null, item.subjectType),
                  h("td", null, item.subjectId),
                  h("td", null, item.title || "\u2014")
                );
              }))
            ),
            h(
              "div",
              { className: "wbv-row" },
              h("span", { className: "wbv-muted wbv-grow" }, "\u5173\u8054\u7531\u4E1A\u52A1\u6A21\u5757\u901A\u8FC7 vault.bind \u6CE8\u518C\uFF1B\u8FD9\u91CC\u53EA\u8BFB\u3002"),
              h(C.Btn, { h, onClick: function() {
                openS[1](null);
              } }, "\u5173\u95ED")
            )
          )
        ) : null
      );
    };
  }
});

// packages/addons/vault/client/views/config.cjs
var require_config = __commonJS({
  "packages/addons/vault/client/views/config.cjs"(exports2, module2) {
    "use strict";
    var C = require_common();
    var AskPassphrase = require_ask_passphrase();
    var MODES = [
      { id: "A", title: "A \u5168\u9501\uFF08\u63A8\u8350\uFF09", desc: "\u6BCF\u6B21 DSH \u542F\u52A8\u540E\u9700\u8981\u8F93\u5165\u4E3B\u53E3\u4EE4\uFF1B\u660E\u6587\u53EA\u5728\u5F53\u524D\u8FDB\u7A0B\u5185\u5B58\u3002" },
      { id: "B", title: "B \u81EA\u52A8\u89E3\u9501\uFF0C\u67E5\u770B\u9700\u53E3\u4EE4", desc: "\u542F\u52A8\u65F6\u7528\u672C\u673A device key \u81EA\u52A8\u89E3\u9501\uFF1B\u6BCF\u6B21\u67E5\u770B/\u7F16\u8F91\u51ED\u636E\u518D\u8F93\u4E3B\u53E3\u4EE4\u3002" },
      { id: "C", title: "C \u81EA\u52A8\u89E3\u9501\uFF0C\u67E5\u770B\u514D\u53E3\u4EE4", desc: "\u542F\u52A8\u81EA\u52A8\u89E3\u9501\uFF0C\u754C\u9762\u4E0A\u53EF\u76F4\u63A5\u67E5\u770B\u660E\u6587\uFF1B\u9002\u5408\u5355\u4EBA\u53D7\u63A7\u673A\u5668\u3002" }
    ];
    module2.exports = function ConfigView(props) {
      var h = props.h;
      var api = props.api;
      var React = props.React;
      var st = React.useState(null);
      var mode = React.useState("A");
      var oldPass = React.useState("");
      var newPass = React.useState("");
      var msg = React.useState("");
      var busy = React.useState(false);
      var tick = React.useState(0);
      var askS = React.useState(null);
      React.useEffect(function() {
        C.call(api, "vault.status").then(function(s) {
          st[1](s);
          if (s && s.unlockMode) mode[1](s.unlockMode);
        }).catch(function(e) {
          msg[1](C.errText(e));
        });
      }, [tick[0]]);
      function run(p) {
        busy[1](true);
        msg[1]("");
        p.then(function() {
          busy[1](false);
          tick[1](tick[0] + 1);
        }).catch(function(e) {
          busy[1](false);
          msg[1](C.errText(e));
        });
      }
      function applyMode() {
        var target = mode[0];
        if (target === "B" || target === "C") {
          if (!st[0] || st[0].locked) {
            askS[1]({ kind: "mode", value: "", busy: false, error: "" });
            return;
          }
        }
        run(C.call(api, "vault.setUnlockMode", { mode: target }));
      }
      function confirmAsk() {
        var a = askS[0];
        if (!a || !a.value) return;
        askS[1](Object.assign({}, a, { busy: true, error: "" }));
        var p = a.kind === "mode" ? C.call(api, "vault.setUnlockMode", { mode: mode[0], passphrase: a.value }) : C.call(api, "vault.rotateDeviceKey", { passphrase: a.value });
        p.then(function() {
          askS[1](null);
          busy[1](false);
          tick[1](tick[0] + 1);
        }).catch(function(e) {
          askS[1](Object.assign({}, a, { busy: false, error: C.errText(e) }));
        });
      }
      function changePass() {
        if (newPass[0].length < 10) return msg[1]("\u65B0\u53E3\u4EE4\u81F3\u5C11 10 \u4E2A\u5B57\u7B26");
        run(C.call(api, "vault.changePassphrase", { oldPassphrase: oldPass[0], newPassphrase: newPass[0] }));
        oldPass[1]("");
        newPass[1]("");
      }
      function rotate() {
        askS[1]({ kind: "rotate", value: "", busy: false, error: "" });
      }
      var status = st[0];
      var modal = askS[0] ? h(AskPassphrase, {
        h,
        C,
        title: askS[0].kind === "mode" ? "\u5207\u6362\u5230 " + mode[0] + " \u6A21\u5F0F" : "\u8F6E\u6362 device key",
        hint: askS[0].kind === "mode" ? "\u5207\u6362\u89E3\u9501\u6A21\u5F0F\u9700\u8981\u9A8C\u8BC1\u4E3B\u53E3\u4EE4\u3002" : "\u65E7 device key \u6587\u4EF6\u4F1A\u88AB\u8986\u76D6\uFF0C\u4E4B\u540E\u7528\u65B0 key \u81EA\u52A8\u89E3\u9501\u3002",
        value: askS[0].value,
        busy: askS[0].busy,
        error: askS[0].error,
        onChange: function(v) {
          askS[1](Object.assign({}, askS[0], { value: v }));
        },
        show: askS[0].show,
        onToggle: function() {
          askS[1](Object.assign({}, askS[0], { show: !askS[0].show }));
        },
        onCancel: function() {
          if (!askS[0].busy) askS[1](null);
        },
        onConfirm: confirmAsk
      }) : null;
      return h(
        "div",
        { className: "wbv" },
        h("h2", null, "\u4FDD\u9669\u7BB1\u8BBE\u7F6E"),
        h(C.Notice, { h, kind: "error", text: msg[0] }),
        h(
          "div",
          { className: "wbv-card" },
          h("h3", null, "\u89E3\u9501\u6A21\u5F0F"),
          MODES.map(function(m) {
            return h(
              "label",
              { key: m.id, className: "wbv-row", style: { padding: "6px 0", alignItems: "flex-start", cursor: "pointer" } },
              h("input", { type: "radio", name: "vault-mode", checked: mode[0] === m.id, onChange: function() {
                mode[1](m.id);
              } }),
              h("span", null, h("strong", null, m.title), h("br"), h("span", { className: "wbv-muted" }, m.desc))
            );
          }),
          h(
            "div",
            { className: "wbv-row" },
            h("span", { className: "wbv-muted" }, status ? "\u5F53\u524D\uFF1A" + status.unlockMode + (status.locked ? "\uFF08\u5DF2\u9501\u5B9A\uFF09" : "\uFF08\u5DF2\u89E3\u9501\uFF09") : ""),
            h("span", { className: "wbv-grow" }),
            h(C.Btn, { h, kind: "primary", disabled: busy[0], onClick: applyMode }, busy[0] ? "\u5E94\u7528\u4E2D\u2026" : "\u5E94\u7528\u6A21\u5F0F")
          )
        ),
        h(
          "div",
          { className: "wbv-card" },
          h("h3", null, "\u4FEE\u6539\u4E3B\u53E3\u4EE4"),
          h("p", { className: "wbv-muted" }, "\u53EA\u91CD\u5305 DEK\uFF0C\u4E0D\u4F1A\u91CD\u65B0\u52A0\u5BC6\u6240\u6709\u51ED\u636E\uFF1Bdevice key \u4E0D\u53D7\u5F71\u54CD\u3002"),
          h(
            "div",
            { className: "wbv-row" },
            h(C.Field, { h, label: "\u5F53\u524D\u53E3\u4EE4" }, h("input", { type: "password", value: oldPass[0], onChange: function(e) {
              oldPass[1](e.target.value);
            } })),
            h(C.Field, { h, label: "\u65B0\u53E3\u4EE4\uFF08\u81F3\u5C11 10 \u4F4D\uFF09" }, h("input", { type: "password", value: newPass[0], onChange: function(e) {
              newPass[1](e.target.value);
            } }))
          ),
          h(C.Btn, { h, disabled: busy[0], onClick: changePass }, "\u4FEE\u6539\u53E3\u4EE4")
        ),
        h(
          "div",
          { className: "wbv-card" },
          h("h3", null, "Device key"),
          h("p", { className: "wbv-muted" }, "B/C \u6A21\u5F0F\u7528\u6765\u5728\u542F\u52A8\u65F6\u81EA\u52A8\u89E3\u9501\u3002key \u6587\u4EF6\u4F4D\u4E8E $WB_HOME/vault-device.key\uFF0C\u6743\u9650 0600\uFF1B\u5220\u9664\u5B83\u7B49\u540C\u56DE\u5230\u9501\u5B9A\u72B6\u6001\u3002"),
          h(C.Btn, { h, disabled: busy[0] || !status || status.unlockMode === "A", onClick: rotate }, "\u8F6E\u6362 device key")
        ),
        modal
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

// packages/addons/vault/client/views/data.cjs
var require_data = __commonJS({
  "packages/addons/vault/client/views/data.cjs"(exports2, module2) {
    "use strict";
    var legacy = require_legacy_data()("vault", { paged: true });
    module2.exports = require_data_view()({
      domain: "vault",
      prefix: "wbv",
      tables: ["vault_secret", "vault_group", "vault_set", "vault_group_set", "vault_set_secret", "vault_binding"],
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

// packages/addons/vault/client/views/actions.cjs
var require_actions = __commonJS({
  "packages/addons/vault/client/views/actions.cjs"(exports2, module2) {
    "use strict";
    module2.exports = require_action_schema_view()({
      domain: "wb-addon-vault",
      prefix: "wbv"
    }).ActionSchemaView;
  }
});

// packages/addons/vault/client/client.src.cjs
(function() {
  var root = typeof window !== "undefined" ? window : null;
  var host = root && root.__WB_HOST__;
  if (!host || !host.react) {
    if (typeof console !== "undefined") console.error("[dsh-workbench-vault] \u5BBF\u4E3B\u524D\u7AEF\u672A\u5C31\u7EEA\uFF0C\u65E0\u6CD5\u6CE8\u518C\u63D2\u4EF6\u754C\u9762");
    module.exports = { name: "dsh-workbench-vault", inject: [], apply: function() {
    } };
    return;
  }
  var React = host.react;
  var h = host.h;
  var CSS_ARR = require_styles();
  var CSS = Array.isArray(CSS_ARR) ? CSS_ARR.join("\n") : String(CSS_ARR || "");
  var ICONS = {
    shield: (init_shield(), __toCommonJS(shield_exports)).default,
    key: (init_key_round(), __toCommonJS(key_round_exports)).default,
    folder: (init_folder(), __toCommonJS(folder_exports)).default,
    sliders: (init_sliders_horizontal(), __toCommonJS(sliders_horizontal_exports)).default,
    database: (init_database(), __toCommonJS(database_exports)).default,
    list: (init_list(), __toCommonJS(list_exports)).default,
    layers: (init_layers(), __toCommonJS(layers_exports)).default
  };
  function Icon2(props) {
    var C = ICONS[props.name] || ICONS.shield;
    return h(C, { size: props.size || 14, strokeWidth: 2, "aria-hidden": "true", className: "wbg-svg" });
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
        title
      });
    };
  }
  function ensureStyles() {
    if (typeof document === "undefined" || !document.head) return;
    if (document.getElementById("wb-vault-style")) return;
    var style = document.createElement("style");
    style.id = "wb-vault-style";
    style.textContent = CSS;
    document.head.appendChild(style);
  }
  ensureStyles();
  host.registerAddon({
    id: "wb-addon-vault",
    version: "0.3.7",
    icon: (init_shield_check(), __toCommonJS(shield_check_exports)).default,
    views: [
      { id: "status", icon: tabIcon("shield"), title: { zh: "\u4FDD\u9669\u7BB1", en: "Vault" }, component: withProps(require_status(), "\u4FDD\u9669\u7BB1") },
      { id: "secrets", icon: tabIcon("key"), title: { zh: "\u51ED\u636E", en: "Secrets" }, component: withProps(require_secrets(), "\u51ED\u636E") },
      { id: "sets", icon: tabIcon("layers"), title: { zh: "\u96C6\u5408", en: "Sets" }, component: withProps(require_sets(), "\u96C6\u5408") },
      { id: "groups", icon: tabIcon("folder"), title: { zh: "\u5206\u7EC4\u4E0E\u5173\u8054", en: "Groups" }, component: withProps(require_groups(), "\u5206\u7EC4\u4E0E\u5173\u8054") },
      { id: "config", icon: tabIcon("sliders"), title: { zh: "\u8BBE\u7F6E", en: "Settings" }, component: withProps(require_config(), "\u8BBE\u7F6E") },
      { id: "data", icon: tabIcon("database"), title: { zh: "\u6570\u636E", en: "Data" }, component: withProps(require_data(), "\u6570\u636E") },
      { id: "actions", icon: tabIcon("list"), title: { zh: "Action", en: "Actions" }, component: withProps(require_actions(), "Action") }
    ]
  });
  module.exports = { name: "dsh-workbench-vault", inject: [], apply: function() {
  } };
})();
    return module.exports;
  },
});
