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

// packages/addons/lib/icons.cjs
var require_icons = __commonJS({
  "packages/addons/lib/icons.cjs"(exports2, module2) {
    "use strict";
    var h = require("react").createElement;
    function create(prefix, glyphs, options) {
      var opts = options || {};
      var ICONS = Object.assign({}, glyphs);
      function Icon2(props) {
        var C = ICONS[props.name] || (opts.fallback ? ICONS[opts.fallback] : null);
        if (!C) return null;
        var size = typeof opts.sizeOf === "function" ? opts.sizeOf(props) : props.size || 14;
        var cls = prefix + "-svg" + (opts.classNameAppend && props.className ? " " + props.className : "");
        var attrs = {
          size,
          strokeWidth: props.strokeWidth || 2,
          "aria-hidden": "true",
          className: cls
        };
        if (opts.focusable) attrs.focusable = false;
        return h(C, attrs);
      }
      var set = { ICONS, Icon: Icon2 };
      if (opts.tabIcon) {
        set.tabIcon = function(name) {
          return function TabIcon() {
            return h(Icon2, { name, size: 14 });
          };
        };
      }
      return set;
    }
    module2.exports = { create };
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

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/chart-column.mjs
var chart_column_exports = {};
__export(chart_column_exports, {
  __iconData: () => __iconData,
  default: () => ChartColumn
});
var __iconData, ChartColumn;
var init_chart_column = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/chart-column.mjs"() {
    init_createLucideIcon();
    __iconData = {
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
    __iconData.node;
    ChartColumn = createLucideIcon(__iconData);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/database.mjs
var database_exports = {};
__export(database_exports, {
  __iconData: () => __iconData2,
  default: () => Database
});
var __iconData2, Database;
var init_database = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/database.mjs"() {
    init_createLucideIcon();
    __iconData2 = {
      name: "database",
      size: 24,
      node: [
        ["ellipse", { cx: "12", cy: "5", rx: "9", ry: "3", key: "msslwz" }],
        ["path", { d: "M3 5V19A9 3 0 0 0 21 19V5", key: "1wlel7" }],
        ["path", { d: "M3 12A9 3 0 0 0 21 12", key: "mv7ke4" }]
      ]
    };
    __iconData2.node;
    Database = createLucideIcon(__iconData2);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/list.mjs
var list_exports = {};
__export(list_exports, {
  __iconData: () => __iconData3,
  default: () => List
});
var __iconData3, List;
var init_list = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/list.mjs"() {
    init_createLucideIcon();
    __iconData3 = {
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
    __iconData3.node;
    List = createLucideIcon(__iconData3);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/wallet.mjs
var wallet_exports = {};
__export(wallet_exports, {
  __iconData: () => __iconData4,
  default: () => Wallet
});
var __iconData4, Wallet;
var init_wallet = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/wallet.mjs"() {
    init_createLucideIcon();
    __iconData4 = {
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
    __iconData4.node;
    Wallet = createLucideIcon(__iconData4);
  }
});

// packages/addons/salary/client/ui/icons.cjs
var require_icons2 = __commonJS({
  "packages/addons/salary/client/ui/icons.cjs"(exports2, module2) {
    "use strict";
    var icons = require_icons();
    var set = icons.create("wbsal", {
      "chart-column": (init_chart_column(), __toCommonJS(chart_column_exports)).default,
      "database": (init_database(), __toCommonJS(database_exports)).default,
      "list": (init_list(), __toCommonJS(list_exports)).default,
      "wallet": (init_wallet(), __toCommonJS(wallet_exports)).default
    });
    module2.exports = { ICONS: set.ICONS, Icon: set.Icon };
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

// packages/addons/lib/stepper.cjs
var require_stepper = __commonJS({
  "packages/addons/lib/stepper.cjs"(exports2, module2) {
    "use strict";
    function stepState(index, current, maxVisited) {
      if (index === current) return "current";
      if (index < current) return "done";
      if (index <= maxVisited) return "visited";
      return "todo";
    }
    function Steps(props) {
      var h = props.h;
      var steps = props.steps || [];
      var current = props.current || 0;
      var maxVisited = props.maxVisited === void 0 ? current : props.maxVisited;
      var invalid = props.invalid || {};
      var disabled = !!props.disabled;
      var label = props.label || "\u6B65\u9AA4";
      return h(
        "nav",
        { className: "wbctl-steps" + (props.className ? " " + props.className : ""), "aria-label": label },
        h(
          "ol",
          { className: "wbctl-step-list" },
          steps.map(function(step, index) {
            var state = stepState(index, current, maxVisited);
            var canJump = !disabled && typeof props.onJump === "function" && state !== "current" && state !== "todo";
            var isInvalid = !!invalid[index] || !!invalid[step.key];
            return h(
              "li",
              { key: step.key || index, className: "wbctl-step-item" },
              h(
                "button",
                {
                  type: "button",
                  className: "wbctl-step",
                  "data-state": state,
                  "data-invalid": isInvalid ? "true" : null,
                  "aria-current": state === "current" ? "step" : void 0,
                  "aria-label": index + 1 + " \xB7 " + step.label + (state === "done" ? "\uFF08\u5DF2\u5B8C\u6210\uFF09" : ""),
                  disabled: disabled || state === "todo",
                  title: step.hint || "",
                  onClick: function() {
                    if (canJump) props.onJump(index);
                  }
                },
                h("span", { className: "wbctl-step-index", "aria-hidden": "true" }, state === "done" ? "\u2713" : String(index + 1)),
                h("span", { className: "wbctl-step-label" }, step.label),
                step.hint ? h("span", { className: "wbctl-step-hint" }, step.hint) : null,
                step.optional ? h("span", { className: "wbctl-step-opt" }, "\u53EF\u9009") : null
              )
            );
          })
        )
      );
    }
    var STYLES = [
      ".wbctl-steps{display:block;min-width:0}",
      ".wbctl-step-list{display:flex;align-items:stretch;gap:6px;list-style:none;margin:0 0 14px;padding:0;min-width:0}",
      ".wbctl-step-item{display:flex;flex:1 1 0;min-width:0}",
      ".wbctl-step{display:flex;align-items:center;gap:7px;flex:1 1 auto;min-width:0;padding:7px 9px;border:1px solid var(--wb-line,var(--wb-border));border-radius:10px;background:transparent;color:var(--wb-muted,inherit);font:inherit;font-size:12px;line-height:1.35;text-align:left;cursor:default;transition:background .14s ease,border-color .14s ease,color .14s ease}",
      ".wbctl-step[data-state=done],.wbctl-step[data-state=visited]{color:inherit;cursor:pointer}",
      ".wbctl-step[data-state=done]{border-color:color-mix(in oklab,var(--wb-ok,var(--wb-accent,#2563eb)) 36%,var(--wb-border))}",
      ".wbctl-step[data-state=current]{border-color:color-mix(in oklab,var(--wb-accent,#2563eb) 58%,var(--wb-border));background:color-mix(in oklab,var(--wb-accent,#2563eb) 8%,transparent);color:inherit;font-weight:600}",
      ".wbctl-step[data-state=visited]:hover,.wbctl-step[data-state=done]:hover{background:color-mix(in oklab,currentColor 7%,transparent)}",
      ".wbctl-step[data-invalid=true]{border-color:var(--wb-danger,#d33)}",
      ".wbctl-step:focus-visible{outline:2px solid var(--wb-accent,#2563eb);outline-offset:2px}",
      ".wbctl-step:disabled{cursor:default;opacity:.72}",
      ".wbctl-step-index{display:inline-flex;align-items:center;justify-content:center;flex:none;width:20px;height:20px;border-radius:50%;font-size:11px;font-variant-numeric:tabular-nums;background:color-mix(in oklab,currentColor 15%,transparent)}",
      ".wbctl-step[data-state=current] .wbctl-step-index{background:var(--wb-accent,#2563eb);color:var(--wb-on-accent,#fff)}",
      ".wbctl-step[data-state=done] .wbctl-step-index{background:color-mix(in oklab,var(--wb-ok,var(--wb-accent,#2563eb)) 20%,transparent);color:var(--wb-ok,var(--wb-accent,#2563eb))}",
      ".wbctl-step-label{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
      ".wbctl-step-hint{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:11px;font-weight:400;opacity:.62}",
      ".wbctl-step-opt{flex:none;font-size:10px;font-weight:400;opacity:.55}",
      "@media (max-width:760px){.wbctl-step{padding:6px 7px;font-size:11.5px}.wbctl-step-hint,.wbctl-step-opt{display:none}.wbctl-step-index{width:18px;height:18px;font-size:10px}}",
      "@media (max-width:520px){.wbctl-step-list{gap:4px}.wbctl-step-label{white-space:normal}.wbctl-step{gap:5px}}",
      "@media (prefers-reduced-motion:reduce){.wbctl-step{transition:none}}"
    ];
    module2.exports = { Steps, stepState, styles: STYLES };
  }
});

// packages/addons/lib/overlay.cjs
var require_overlay = __commonJS({
  "packages/addons/lib/overlay.cjs"(exports2, module2) {
    "use strict";
    var defaultReact = require("react");
    var FOCUSABLE = "button:not(:disabled),input:not(:disabled),textarea:not(:disabled),select:not(:disabled),a[href]";
    module2.exports = function createOverlay(options) {
      var opts = options || {};
      var React = opts.React || defaultReact;
      var h = React.createElement;
      var tag = opts.tag || "section";
      var maskClass = opts.maskClass;
      var dialogClass = opts.dialogClass;
      var dialogClassOf = opts.dialogClassOf || function() {
        return "";
      };
      var ariaLabelOf = opts.ariaLabelOf || function(props) {
        return props["aria-label"] || props.title;
      };
      var ariaLabelledByOf = opts.ariaLabelledByOf || function() {
        return null;
      };
      var header = opts.header || null;
      var closeOnEscape = opts.closeOnEscape || function() {
        return true;
      };
      var closeOnMask = opts.closeOnMask || function() {
        return true;
      };
      var extraKeyDown = opts.onKeyDown || null;
      var autoFocusDialog = opts.autoFocusDialog !== false;
      var focusableSelector = opts.focusableSelector || FOCUSABLE;
      function Modal(props) {
        var R = props.React || React;
        var ref = R.useRef(null);
        R.useEffect(function() {
          var previous = typeof document !== "undefined" ? document.activeElement : null;
          var focusIt = props.autoFocus !== void 0 ? props.autoFocus : autoFocusDialog;
          if (focusIt && ref.current) ref.current.focus();
          return function() {
            if (previous && previous.isConnected) previous.focus();
          };
        }, []);
        function onKeyDown(e) {
          if (extraKeyDown && extraKeyDown(e, props, ref)) return;
          if (e.key === "Escape") {
            if (!(props.closeOnEscape !== void 0 ? props.closeOnEscape : closeOnEscape(props))) return;
            e.preventDefault();
            e.stopPropagation();
            if (props.onClose) props.onClose();
            return;
          }
          if (e.key !== "Tab" || !ref.current) return;
          var els = ref.current.querySelectorAll(focusableSelector);
          if (!els.length) {
            e.preventDefault();
            return;
          }
          var first = els[0];
          var last = els[els.length - 1];
          if (e.shiftKey && (document.activeElement === first || document.activeElement === ref.current)) {
            e.preventDefault();
            last.focus();
          }
          if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
        var labelledBy = ariaLabelledByOf(props);
        return h(
          "div",
          {
            className: maskClass,
            onMouseDown: function(e) {
              var allowed = props.closeOnMask !== void 0 ? props.closeOnMask : closeOnMask(props);
              if (e.target === e.currentTarget && props.onClose && allowed) props.onClose();
            }
          },
          h(
            tag,
            {
              className: dialogClass + dialogClassOf(props),
              role: "dialog",
              "aria-modal": true,
              "aria-label": labelledBy ? null : ariaLabelOf(props),
              "aria-labelledby": labelledBy || null,
              ref,
              tabIndex: -1,
              onKeyDown
            },
            header ? header(props) : null,
            props.children
          )
        );
      }
      return Modal;
    };
  }
});

// packages/addons/lib/staged-dialog.cjs
var require_staged_dialog = __commonJS({
  "packages/addons/lib/staged-dialog.cjs"(exports2, module2) {
    "use strict";
    var defaultReact = require("react");
    var overlayFactory = require_overlay();
    var stepper = require_stepper();
    function validateStep(step) {
      if (!step || typeof step.validate !== "function") return "";
      var message = step.validate();
      return message ? String(message) : "";
    }
    function firstFailing(steps) {
      var list = steps || [];
      for (var i = 0; i < list.length; i += 1) {
        var message = validateStep(list[i]);
        if (message) return { index: i, key: list[i] && list[i].key, message };
      }
      return null;
    }
    function createStagedDialog(options) {
      var opts = options || {};
      var React = opts.React || defaultReact;
      var h = React.createElement;
      var dialogClass = ((opts.dialogClass || "") + " wbctl-dialog").trim();
      var Overlay = overlayFactory(
        Object.assign({}, opts, {
          React,
          dialogClass,
          // 首焦点由外壳送进对话框，字段由 focusStep 负责，避免打开瞬间落进第一个输入框。
          autoFocusDialog: opts.autoFocusDialog !== false
        })
      );
      function StagedDialog(props) {
        var R = props.React || React;
        var steps = props.steps || [];
        var count = steps.length;
        var busy = !!props.submitting || !!props.busy;
        var indexState = R.useState(props.initialStep || 0);
        var rawIndex = indexState[0];
        var setIndex = indexState[1];
        var index = count === 0 ? 0 : Math.min(Math.max(rawIndex, 0), count - 1);
        var visitedState = R.useState(props.initialStep || 0);
        var maxVisited = count === 0 ? 0 : Math.min(Math.max(visitedState[0], index), count - 1);
        var setMaxVisited = visitedState[1];
        var errorState = R.useState("");
        var stepError = errorState[0];
        var setStepError = errorState[1];
        var invalidState = R.useState({});
        var invalid = invalidState[0];
        var setInvalid = invalidState[1];
        var bodyRef = R.useRef(null);
        var mounted = R.useRef(true);
        function runValidate(step) {
          return validateStep(step);
        }
        function markInvalid(i, bad) {
          setInvalid(function(prev) {
            var next2 = Object.assign({}, prev);
            if (bad) next2[i] = true;
            else delete next2[i];
            return next2;
          });
        }
        function focusBody() {
          var el = bodyRef.current;
          if (el && typeof el.focus === "function") el.focus();
        }
        R.useEffect(
          function() {
            if (!mounted.current) return;
            focusBody();
          },
          [index]
        );
        R.useEffect(function() {
          mounted.current = true;
          return function() {
            mounted.current = false;
          };
        }, []);
        function goTo(i) {
          if (busy || i < 0 || i >= count) return;
          setIndex(i);
          if (i > maxVisited) setMaxVisited(i);
          setStepError("");
        }
        function fail(i, message) {
          markInvalid(i, true);
          goTo(i);
          setStepError(message);
          focusBody();
        }
        function next() {
          if (busy) return;
          var message = runValidate(steps[index]);
          if (message) {
            fail(index, message);
            return;
          }
          markInvalid(index, false);
          goTo(Math.min(index + 1, count - 1));
        }
        function back() {
          if (busy || index === 0) return;
          goTo(index - 1);
        }
        function jump(i) {
          if (busy || i > maxVisited) return;
          goTo(i);
        }
        function submit() {
          if (busy) return;
          var bad = firstFailing(steps);
          if (bad) {
            fail(bad.index, bad.message);
            return;
          }
          for (var i = 0; i < count; i++) markInvalid(i, false);
          setStepError("");
          if (typeof props.onSubmit === "function") props.onSubmit();
        }
        function cancel() {
          if (busy) return;
          if (typeof props.onClose === "function") props.onClose();
        }
        var current = steps[index];
        var isLast = index >= count - 1;
        var saveText = props.submitText || "\u4FDD\u5B58";
        var shownError = stepError || props.error || "";
        return h(
          Overlay,
          props,
          count > 1 ? h(stepper.Steps, {
            h,
            steps: steps.map(function(step) {
              return { key: step.key, label: step.label, hint: step.hint, optional: step.optional };
            }),
            current: index,
            maxVisited,
            onJump: jump,
            invalid,
            disabled: busy,
            label: props.stepsLabel || "\u521B\u5EFA\u6B65\u9AA4"
          }) : null,
          h(
            "div",
            {
              className: "wbctl-dialog-body" + (props.bodyClassName ? " " + props.bodyClassName : ""),
              ref: bodyRef,
              tabIndex: -1
            },
            current ? current.render(h, props) : null
          ),
          props.footerExtra || null,
          shownError ? h("div", { className: "wbctl-dialog-err", role: "alert" }, shownError) : null,
          h(
            "div",
            { className: "wbctl-dialog-foot" },
            count > 1 ? h("span", { className: "wbctl-dialog-progress" }, index + 1 + " / " + count) : null,
            props.footerNote ? h("span", { className: "wbctl-dialog-note" }, props.footerNote) : null,
            h("span", { className: "wbctl-dialog-spacer" }),
            index > 0 ? h(
              "button",
              { type: "button", className: "wbctl-btn", onClick: back, disabled: busy },
              props.backText || "\u4E0A\u4E00\u6B65"
            ) : null,
            h("button", { type: "button", className: "wbctl-btn", onClick: cancel, disabled: busy }, props.cancelText || "\u53D6\u6D88"),
            h(
              "button",
              {
                type: "button",
                className: "wbctl-btn wbctl-btn-p",
                onClick: isLast ? submit : next,
                // submitDisabled 只作用于末步的保存：插件据此把「结构性不合法」（JSON 语法、无可选 action）
                // 提前反映成禁用态，避免用户点到保存才被弹回第一步。
                disabled: busy || isLast && !!props.submitDisabled
              },
              busy ? saveText + "\u4E2D\u2026" : isLast ? saveText : props.nextText || "\u4E0B\u4E00\u6B65"
            )
          )
        );
      }
      StagedDialog.displayName = opts.displayName || "StagedDialog";
      return StagedDialog;
    }
    var STYLES = [
      // 宽表单：内容多时给足横向空间，窄屏留 16px 边距后铺满。
      ".wbctl-dialog{width:min(880px,calc(100vw - 32px));max-height:min(92vh,760px);display:flex;flex-direction:column;overflow:hidden}",
      ".wbctl-dialog-body{flex:1 1 auto;min-height:0;overflow:auto;overscroll-behavior:contain;padding:2px 2px 10px;outline:none}",
      ".wbctl-dialog-body:focus-visible{outline:none}",
      ".wbctl-dialog-foot{display:flex;flex-wrap:wrap;align-items:center;gap:8px;padding-top:10px;margin-top:10px;border-top:1px solid var(--wb-line,var(--wb-border))}",
      ".wbctl-dialog-progress{font-size:11.5px;color:var(--wb-muted,#666);font-variant-numeric:tabular-nums}",
      ".wbctl-dialog-note{font-size:11.5px;color:var(--wb-muted,#666);min-width:0}",
      ".wbctl-dialog-spacer{flex:1 1 auto}",
      ".wbctl-dialog-err{margin-top:8px;padding:7px 10px;border-radius:8px;border:1px solid color-mix(in oklab,var(--wb-danger,#d33) 45%,transparent);background:color-mix(in oklab,var(--wb-danger,#d33) 8%,transparent);color:var(--wb-danger,#d33);font-size:12px}",
      ".wbctl-btn{padding:6px 14px;border:1px solid var(--wb-border,#d0d5dd);border-radius:8px;background:var(--wb-card,#fff);color:inherit;font:inherit;font-size:12.5px;cursor:pointer}",
      ".wbctl-btn:hover:not(:disabled){background:color-mix(in oklab,currentColor 7%,transparent)}",
      ".wbctl-btn:focus-visible{outline:2px solid var(--wb-accent,#2563eb);outline-offset:2px}",
      ".wbctl-btn:disabled{opacity:.55;cursor:default}",
      ".wbctl-btn.wbctl-btn-p{background:var(--wb-accent,#2563eb);border-color:transparent;color:var(--wb-on-accent,#fff)}",
      ".wbctl-btn.wbctl-btn-p:hover:not(:disabled){background:color-mix(in oklab,var(--wb-accent,#2563eb) 86%,#000)}",
      // 确认步：键值对清单，各插件共用，避免再各写一套只读摘要。\n  ".wbctl-review{display:flex;flex-direction:column;border:1px solid var(--wb-line,var(--wb-border));border-radius:10px;overflow:hidden}",\n  ".wbctl-review-row{display:grid;grid-template-columns:96px minmax(0,1fr);gap:10px;padding:8px 12px;font-size:12.5px;background:var(--wb-surface,transparent)}",\n  ".wbctl-review-row+.wbctl-review-row{border-top:1px solid var(--wb-line,var(--wb-border))}",\n  ".wbctl-review-k{color:var(--wb-muted,inherit);font-size:11.5px;line-height:1.6}",\n  ".wbctl-review-v{min-width:0;word-break:break-word;line-height:1.6}",\n  ".wbctl-note{margin:10px 0 0;font-size:11.5px;color:var(--wb-muted,inherit)}",\n  // 两列字段布局：内容多的弹窗不再单列拉长，窄屏回落单列。
      ".wbctl-form{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px 14px}",
      ".wbctl-form>.full{grid-column:1/-1}",
      "@media (max-width:760px){.wbctl-dialog{width:calc(100vw - 16px);max-height:94vh}.wbctl-form{grid-template-columns:1fr}.wbctl-form>.full{grid-column:auto}}",
      "@media (prefers-reduced-motion:reduce){.wbctl-btn{transition:none}}"
    ];
    module2.exports = {
      createStagedDialog,
      validateStep,
      firstFailing,
      styles: STYLES
    };
  }
});

// packages/addons/lib/number-field.cjs
var require_number_field = __commonJS({
  "packages/addons/lib/number-field.cjs"(exports2, module2) {
    "use strict";
    var React = require("react");
    var NUM = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/;
    var TEXT = {
      zh: {
        required: "\u8BF7\u586B\u5199\u6570\u5B57",
        invalid: "\u8BF7\u8F93\u5165\u6570\u5B57",
        integer: "\u9700\u8981\u662F\u6574\u6570",
        min: "\u4E0D\u80FD\u5C0F\u4E8E {min}",
        max: "\u4E0D\u80FD\u5927\u4E8E {max}",
        range: "\u9700\u8981\u5728 {min}\u2013{max} \u4E4B\u95F4",
        step: "\u9700\u8981\u662F {step} \u7684\u500D\u6570",
        unit: "\u5355\u4F4D"
      },
      en: {
        required: "Please enter a number",
        invalid: "Please enter a number",
        integer: "Must be a whole number",
        min: "Must be at least {min}",
        max: "Must be at most {max}",
        range: "Must be between {min} and {max}",
        step: "Must be a multiple of {step}",
        unit: "unit"
      }
    };
    function messages(lang) {
      return lang === "en" ? TEXT.en : TEXT.zh;
    }
    function fill(text, vars) {
      return String(text).replace(/\{(\w+)\}/g, function(m, key) {
        return vars && vars[key] !== void 0 ? String(vars[key]) : m;
      });
    }
    function validateNumber(raw, opts) {
      var o = opts || {};
      var M = messages(o.lang);
      var text = raw === null || raw === void 0 ? "" : String(raw).trim();
      if (text === "") {
        return o.allowEmpty ? { ok: true, value: null, error: "" } : { ok: false, value: null, error: M.required };
      }
      if (!NUM.test(text)) return { ok: false, value: null, error: M.invalid };
      var n = Number(text);
      if (!isFinite(n)) return { ok: false, value: null, error: M.invalid };
      if (o.integer && Math.round(n) !== n) return { ok: false, value: null, error: M.integer };
      var hasMin = o.min !== void 0 && o.min !== null && o.min !== "";
      var hasMax = o.max !== void 0 && o.max !== null && o.max !== "";
      if (hasMin && hasMax && n >= o.min && n <= o.max) {
      } else if (hasMin && hasMax) {
        return { ok: false, value: null, error: fill(M.range, { min: o.min, max: o.max }) };
      } else if (hasMin && n < o.min) {
        return { ok: false, value: null, error: fill(M.min, { min: o.min }) };
      } else if (hasMax && n > o.max) {
        return { ok: false, value: null, error: fill(M.max, { max: o.max }) };
      }
      if (o.step && Number(o.step) > 0) {
        var q = n / Number(o.step);
        if (Math.abs(q - Math.round(q)) > 1e-9) {
          return { ok: false, value: null, error: fill(M.step, { step: o.step }) };
        }
      }
      return { ok: true, value: n, error: "" };
    }
    function rangeHint(opts, lang) {
      var o = opts || {};
      var M = messages(lang);
      var en = lang === "en";
      var hasMin = o.min !== void 0 && o.min !== null && o.min !== "";
      var hasMax = o.max !== void 0 && o.max !== null && o.max !== "";
      var parts = [];
      if (hasMin && hasMax) parts.push(String(o.min) + "\u2013" + String(o.max));
      else if (hasMin) parts.push((en ? "\u2265 " : "\u2265 ") + String(o.min));
      else if (hasMax) parts.push((en ? "\u2264 " : "\u2264 ") + String(o.max));
      if (o.integer) parts.push(en ? "whole numbers" : "\u6574\u6570");
      else if (o.step && Number(o.step) > 0) parts.push((en ? "step " : "\u6B65\u957F ") + String(o.step));
      return parts.join(en ? ", " : "\uFF0C");
    }
    function NumberField(props) {
      var h = props.h || React.createElement;
      var lang = props.lang;
      var M = messages(lang);
      var text = props.value === null || props.value === void 0 ? "" : String(props.value);
      var draftS = React.useState(text);
      var draft = draftS[0];
      var setDraft = draftS[1];
      var focusS = React.useState(false);
      var focused = focusS[0];
      var setFocused = focusS[1];
      var errS = React.useState("");
      var err = errS[0];
      var setErr = errS[1];
      var lastRef = React.useRef(text);
      var skipBlurRef = React.useRef(false);
      React.useEffect(
        function() {
          if (focused) return;
          if (lastRef.current === text) return;
          lastRef.current = text;
          setDraft(text);
          setErr("");
        },
        [text, focused]
      );
      function commit(raw) {
        var r = validateNumber(raw, props);
        if (!r.ok) {
          setErr(r.error);
          if (typeof props.onValidChange === "function") props.onValidChange(false, r.error);
          return false;
        }
        setErr("");
        if (typeof props.onValidChange === "function") props.onValidChange(true, "");
        var cur = props.value === null || props.value === void 0 ? null : Number(props.value);
        if (r.value !== cur) {
          lastRef.current = r.value === null ? "" : String(r.value);
          if (typeof props.onCommit === "function") props.onCommit(r.value);
        }
        return true;
      }
      var hint = props.hint !== void 0 ? props.hint : rangeHint(props, lang);
      var shown = props.hint === false ? "" : hint;
      return h(
        "span",
        { className: "wbctl-num" + (props.wide ? " is-wide" : "") + (props.className ? " " + props.className : "") },
        h(
          "span",
          { className: "wbctl-num-box" },
          h("input", {
            className: "wbctl-num-input" + (err ? " is-invalid" : ""),
            type: "text",
            inputMode: props.integer || Number(props.step) === 1 ? "numeric" : "decimal",
            value: draft,
            disabled: !!props.disabled,
            placeholder: props.placeholder,
            title: props.title,
            "aria-label": props.ariaLabel,
            "aria-invalid": err ? "true" : void 0,
            onFocus: function() {
              setFocused(true);
            },
            onChange: function(e) {
              setDraft(e.target.value);
              if (err) setErr("");
              if (typeof props.onDraft === "function") props.onDraft(e.target.value);
            },
            onBlur: function() {
              setFocused(false);
              if (skipBlurRef.current) {
                skipBlurRef.current = false;
                return;
              }
              commit(draft);
            },
            onKeyDown: function(e) {
              if (e.key === "Enter") {
                e.preventDefault();
                if (e.target && e.target.blur) e.target.blur();
              } else if (e.key === "Escape") {
                e.preventDefault();
                skipBlurRef.current = true;
                setDraft(text);
                setErr("");
                if (e.target && e.target.blur) e.target.blur();
              }
            }
          }),
          props.unit ? h("span", { className: "wbctl-num-unit" }, props.unit) : null
        ),
        err ? h("span", { className: "wbctl-num-err", role: "alert" }, err) : shown ? h("span", { className: "wbctl-num-hint" }, shown) : null
      );
    }
    var NUMBER_STYLES = [
      ".wbctl-num{display:inline-flex;flex-direction:column;gap:3px;min-width:0;max-width:100%}",
      ".wbctl-num.is-wide{display:flex;width:100%}",
      ".wbctl-num-box{display:inline-flex;align-items:center;gap:6px;min-width:0}",
      ".wbctl-num-input{box-sizing:border-box;width:96px;min-width:0;padding:6px 9px;border:1px solid var(--wb-line,rgba(127,127,127,.35));border-radius:6px;background:var(--wb-surface,var(--wb-card,transparent));color:inherit;font:inherit;font-size:13px;font-variant-numeric:tabular-nums;transition:border-color .14s ease,outline-color .14s ease}",
      ".wbctl-num-input:hover:not(:disabled){border-color:var(--wb-border,var(--wb-line))}",
      ".wbctl-num-input:focus{outline:2px solid color-mix(in oklab,var(--wb-accent,#2563eb) 55%,transparent);outline-offset:1px;border-color:var(--wb-accent,#2563eb)}",
      ".wbctl-num-input.is-invalid{border-color:var(--wb-danger,#dc2626)}",
      ".wbctl-num-input.is-invalid:focus{outline-color:color-mix(in oklab,var(--wb-danger,#dc2626) 55%,transparent)}",
      ".wbctl-num-input:disabled{opacity:.5;cursor:not-allowed}",
      ".wbctl-num-unit{color:var(--wb-muted,inherit);font-size:12px;white-space:nowrap}",
      ".wbctl-num-hint{color:var(--wb-muted,inherit);font-size:11px;line-height:1.4}",
      ".wbctl-num-err{color:var(--wb-danger,#dc2626);font-size:11px;line-height:1.4}",
      "@media (prefers-reduced-motion:reduce){.wbctl-num-input{transition:none}}"
    ];
    module2.exports = {
      NumberField,
      validateNumber,
      rangeHint,
      messages,
      styles: NUMBER_STYLES
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
      ".wbsal-stack{display:flex;flex-direction:column;gap:16px}",
      ".wbsal-section-note{font-size:11.5px;color:var(--wb-muted,#8b94a6);font-variant-numeric:tabular-nums}",
      ".wbsal-linechart .wbsalc-trend-wrap{width:100%}",
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
    var AMOUNT = [
      ".wbsal-form-grid .wbctl-num{width:100%}",
      ".wbsal-form-grid .wbctl-num-box{width:100%}",
      ".wbsal-form-grid .wbctl-num-input{width:100%;box-sizing:border-box;text-align:right}",
      // 分阶段表单：每组金额之间留出间距，步骤内容区不再被外层卡片裁切。
      ".wbsal-steps-groups{display:flex;flex-direction:column;gap:16px}"
    ];
    module2.exports = BASE.concat(PAGE, [DATE], AMOUNT, require_stepper().styles, require_staged_dialog().styles, require_number_field().styles).join("\n");
  }
});

// packages/addons/lib/switch.cjs
var require_switch = __commonJS({
  "packages/addons/lib/switch.cjs"(exports2, module2) {
    "use strict";
    var SWITCH_STYLES = [
      ".wbctl-switch{display:inline-flex;align-items:center;gap:7px;min-height:24px;padding:2px;border:0;background:transparent;font:inherit;font-size:12px;color:var(--wb-muted,#6b7280);cursor:pointer;user-select:none;border-radius:999px}",
      ".wbctl-switch-track{position:relative;display:inline-flex;align-items:center;box-sizing:border-box;width:34px;height:20px;padding:2px;border-radius:999px;background:color-mix(in oklab,currentColor 22%,transparent);transition:background .16s ease;flex:none}",
      ".wbctl-switch-knob{display:block;width:16px;height:16px;border-radius:50%;background:var(--wb-card,#fff);box-shadow:0 1px 2px rgba(0,0,0,.25);transition:transform .16s ease}",
      ".wbctl-switch[aria-checked=true]{color:var(--wb-accent,#2563eb)}",
      ".wbctl-switch[aria-checked=true] .wbctl-switch-track{background:var(--wb-accent,#2563eb)}",
      ".wbctl-switch[aria-checked=true] .wbctl-switch-knob{transform:translateX(14px)}",
      ".wbctl-switch:hover:not(:disabled) .wbctl-switch-track{outline:1px solid var(--wb-accent,#2563eb)}",
      ".wbctl-switch:focus-visible{outline:2px solid var(--wb-accent,#2563eb);outline-offset:2px}",
      ".wbctl-switch:disabled{opacity:.45;cursor:not-allowed}",
      ".wbctl-switch-text{white-space:nowrap}",
      "@media (prefers-reduced-motion:reduce){.wbctl-switch-track,.wbctl-switch-knob{transition:none}}"
    ];
    function Switch(props) {
      var h = props.h;
      var on = props.checked === true || props.checked === "true";
      var disabled = !!props.disabled;
      var text = props.label;
      if (props.showState) text = on ? props.onText || "\u5F00" : props.offText || "\u5173";
      return h(
        "button",
        {
          type: "button",
          role: "switch",
          "aria-checked": on ? "true" : "false",
          className: "wbctl-switch" + (props.className ? " " + props.className : ""),
          disabled,
          title: props.title,
          "aria-label": text ? void 0 : props.ariaLabel,
          onClick: function(e) {
            e.preventDefault();
            if (disabled) return;
            if (typeof props.onChange === "function") props.onChange(!on);
          }
        },
        h(
          "span",
          { className: "wbctl-switch-track", "aria-hidden": "true" },
          h("span", { className: "wbctl-switch-knob" })
        ),
        text ? h("span", { className: "wbctl-switch-text" }, text) : null
      );
    }
    module2.exports = { Switch, styles: SWITCH_STYLES };
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
        Switch: require_switch().Switch,
        switchStyles: require_switch().styles,
        NumberField: require_number_field().NumberField,
        numberFieldStyles: require_number_field().styles,
        validateNumber: require_number_field().validateNumber,
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
    var EMPLOYMENT_TYPES = [
      { value: "", label: "\u672A\u8BBE\u7F6E" },
      { value: "temp", label: "\u4E34\u65F6" },
      { value: "parttime", label: "\u517C\u804C" },
      { value: "side", label: "\u5916\u5FEB" },
      { value: "intern", label: "\u5B9E\u4E60" },
      { value: "probation", label: "\u8BD5\u7528" },
      { value: "regular", label: "\u6B63\u5F0F" }
    ];
    function employmentLabel(value) {
      for (var i = 0; i < EMPLOYMENT_TYPES.length; i += 1) {
        if (EMPLOYMENT_TYPES[i].value === value) return EMPLOYMENT_TYPES[i].label;
      }
      return "\u672A\u8BBE\u7F6E";
    }
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
      EMPLOYMENT_TYPES,
      employmentLabel,
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

// packages/addons/salary/client/views/stats-parts.cjs
var require_stats_parts = __commonJS({
  "packages/addons/salary/client/views/stats-parts.cjs"(exports2, module2) {
    "use strict";
    var TONE_COLOR = {
      s1: "var(--wb-accent,#2563eb)",
      s2: "var(--wb-ok,#16a34a)",
      s3: "var(--wb-warn,#d97706)",
      s4: "color-mix(in oklab,var(--wb-accent,#2563eb) 45%,var(--wb-danger,#dc2626))",
      s5: "color-mix(in oklab,var(--wb-ok,#16a34a) 55%,var(--wb-accent,#2563eb))",
      s6: "color-mix(in oklab,var(--wb-warn,#d97706) 60%,var(--wb-danger,#dc2626))",
      sum: "color-mix(in oklab,var(--wb-muted,#8b94a6) 45%,var(--wb-accent,#2563eb))",
      t1: "var(--wb-accent,#2563eb)",
      t2: "color-mix(in oklab,var(--wb-ok,#16a34a) 60%,var(--wb-muted,#8b94a6))",
      t3: "color-mix(in oklab,var(--wb-warn,#d97706) 55%,var(--wb-muted,#8b94a6))"
    };
    function segGroup(h, options, value, onPick, ariaLabel) {
      return h("div", { className: "wbsal-metric", role: "group", "aria-label": ariaLabel }, options.map(function(option) {
        return h("button", {
          key: option[0],
          type: "button",
          className: value === option[0] ? "on" : "",
          "aria-pressed": value === option[0],
          onClick: function() {
            onPick(option[0]);
          }
        }, option[1]);
      }));
    }
    function seriesSwitch(h, series, shown, onToggle, ariaLabel) {
      return h("div", { className: "wbsal-series", role: "group", "aria-label": ariaLabel }, series.map(function(m) {
        return h("button", {
          key: m.key,
          type: "button",
          className: shown[m.key] === false ? "off" : "",
          "aria-pressed": shown[m.key] !== false,
          title: (shown[m.key] === false ? "\u663E\u793A" : "\u9690\u85CF") + m.label,
          onClick: function() {
            onToggle(m.key);
          }
        }, h("i", { className: m.tone }), m.label);
      }));
    }
    function anyShown(series, shown) {
      return series.some(function(m) {
        return shown[m.key] !== false;
      });
    }
    function tipCard(h, ctx) {
      if (ctx.index === null || ctx.index === void 0) return null;
      var kids = [h("strong", { key: "t" }, ctx.title)];
      (ctx.rows || []).forEach(function(row) {
        kids.push(h(
          "div",
          { key: row.key, className: "wbsal-tip-row" },
          h("i", { className: row.tone }),
          h("span", null, row.label),
          h("b", null, ctx.fmt(row.value))
        ));
      });
      if (ctx.note) kids.push(h("em", { key: "n" }, ctx.note));
      var length = ctx.length || 1;
      var ratio = length > 1 ? ctx.index / (length - 1) : 0;
      return h("div", {
        className: "wbsal-tip" + (ratio > 0.62 ? " is-right" : ""),
        style: { left: ratio * 100 + "%" }
      }, kids);
    }
    function trendCard(opts) {
      var h = opts.h, CH = opts.CH;
      var rows = opts.rows || [];
      var series = (opts.series || []).map(function(s) {
        return { key: s.key, label: s.label, className: s.tone, color: s.color || TONE_COLOR[s.tone] || void 0 };
      });
      var shown = opts.visible || {};
      var empty = rows.length === 0;
      var idx = typeof opts.hover === "number" && opts.hover >= 0 && opts.hover < rows.length ? opts.hover : null;
      var row = idx === null ? null : rows[idx];
      return h(
        "div",
        { className: "wbsal-card wbsal-section" },
        h(
          "div",
          { className: "wbsal-section-head" },
          h("h3", null, opts.title),
          h(
            "div",
            { className: "wbsal-section-tools" },
            opts.note ? h("span", { className: "wbsal-section-note" }, opts.note) : null,
            seriesSwitch(h, opts.series || [], shown, opts.onToggle, (opts.title || "\u6298\u7EBF") + "\u663E\u793A\u5F00\u5173")
          )
        ),
        empty ? h(CH.Empty, { text: opts.emptyText || "\u8FD8\u6CA1\u6709\u53EF\u753B\u7684\u8BB0\u5F55" }) : h(
          "div",
          { className: "wbsal-linechart" },
          h(CH.Trend, {
            data: rows.map(function(row2) {
              return row2;
            }),
            series,
            lang: opts.lang,
            height: opts.height || 210,
            showLegend: false,
            visible: shown,
            active: idx,
            onHover: opts.onHover,
            format: opts.fmt,
            label: opts.label,
            note: opts.noteOf,
            aria: opts.ariaLabel,
            emptyText: opts.emptyText
          }),
          empty || idx === null ? null : tipCard(h, {
            index: idx,
            length: rows.length,
            title: opts.tipTitle ? opts.tipTitle(row) : "",
            rows: opts.tipRows ? opts.tipRows(row) : [],
            note: opts.tipNote ? opts.tipNote(row) : "",
            fmt: opts.fmt
          })
        ),
        !empty && anyShown(opts.series || [], shown) ? null : h("div", { className: "wbsal-chart-hint" }, opts.allOffHint || "\u6240\u6709\u7EBF\u90FD\u5173\u6389\u4E86\uFF0C\u70B9\u4E0A\u65B9\u7684\u6807\u7B7E\u4EFB\u610F\u4E00\u4E2A\u6062\u590D\u663E\u793A"),
        h(
          "div",
          { className: "wbsal-chart-foot" },
          h("span", null, opts.footLeft || ""),
          h("span", null, opts.footRight || "")
        )
      );
    }
    function barChart(opts) {
      var h = opts.h, F = opts.F;
      var rows = opts.rows || [];
      var values = rows.map(function(b) {
        return opts.value(b);
      });
      var max = Math.max(1, Math.max.apply(null, values));
      var topIndex = -1;
      values.forEach(function(v, i) {
        if (v > 0 && (topIndex < 0 || v > values[topIndex])) topIndex = i;
      });
      var top = rows[topIndex];
      return h(
        "div",
        null,
        h("div", { className: "wbsal-chart" }, rows.map(function(bucket, i) {
          var value = values[i];
          var ratio = value > 0 ? value / max : 0;
          var height = Math.round(Math.max(ratio * 150, value > 0 ? 6 : 0));
          return h(
            "div",
            {
              key: bucket.month,
              className: "wbsal-bar",
              title: bucket.month + " \u6708 \xB7 \u57FA\u672C " + F.money(bucket.basePay) + " / \u7EE9\u6548 " + F.money(bucket.performancePay) + " / \u8865\u8D34 " + F.money(bucket.allowance) + " / \u7EE9\u6548\u5956\u60E9 " + F.money(bucket.performanceBonus) + " / \u5E94\u53D1 " + F.money(bucket.grossPay) + " / \u5B9E\u53D1 " + F.money(bucket.netPay)
            },
            h("div", { className: "wbsal-bar-value" }, value > 0 ? Math.round(value).toLocaleString("zh-CN") : ""),
            h("div", { className: "wbsal-bar-fill" + (i === topIndex ? " top" : ""), style: { height: height + "px" } }),
            h("div", { className: "wbsal-bar-label" }, "")
          );
        })),
        h("div", { className: "wbsal-axis" }, rows.map(function(bucket) {
          return h("span", { key: bucket.month }, bucket.month);
        })),
        h(
          "div",
          { className: "wbsal-chart-foot" },
          h("span", { className: "wbsal-legend" }, h("i", null), "\u6700\u9AD8\u6708", h("i", { className: "soft" }), "\u5176\u4ED6\u6708\u4EFD"),
          h("span", null, top ? "\u6700\u9AD8 " + F.monthLabel(top.period) + " \xB7 " + F.money(Math.max(0, values[topIndex] || 0)) : "")
        ),
        h(
          "div",
          { className: "wbsal-chart-foot" },
          h("span", null, "\u67F1\u9AD8\u6309" + opts.metricLabel + "\u53D6\u503C\uFF0C\u60AC\u505C\u770B\u8BE5\u6708\u5168\u90E8\u7EF4\u5EA6"),
          h("span", null, "\u5355\u4F4D\uFF1A\u5143 \xB7 " + opts.basisLabel)
        )
      );
    }
    function kpi(h, label, value, sub) {
      return h("div", { className: "wbsal-card wbsal-kpi" }, h("span", null, label), h("strong", null, value), h("em", null, sub));
    }
    function compRows(h, F, fields, keys, total, deduction) {
      var rows = keys.filter(function(key) {
        return (fields[key] || 0) !== 0;
      });
      if (rows.length === 0) return null;
      return h("div", { className: "wbsal-comp" }, rows.map(function(key) {
        var amount = fields[key] || 0;
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
    module2.exports = {
      TONE_COLOR,
      segGroup,
      seriesSwitch,
      anyShown,
      trendCard,
      barChart,
      kpi,
      compRows
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

// packages/addons/lib/stats-charts.cjs
var require_stats_charts = __commonJS({
  "packages/addons/lib/stats-charts.cjs"(exports2, module2) {
    "use strict";
    var React = require("react");
    var h = React.createElement;
    var DP = require_date_picker();
    var COLORS = [
      "var(--dsw-alias-state-business-primary, #4f6ef7)",
      "var(--dsw-alias-state-success-primary, #2f9e6e)",
      "var(--dsw-alias-state-warn-primary, #d99100)",
      "var(--dsw-alias-state-error-primary, #d9534f)",
      "var(--dsw-alias-state-done-primary, #7c5cff)",
      "var(--dsw-alias-state-idle-primary, #8f959e)"
    ];
    function css(prefix, extra) {
      return [
        ".@-stats{display:flex;flex-direction:column;gap:14px;padding:4px 2px 24px;color:var(--dsw-alias-label-primary,#1f2329)}",
        ".@-stoolbar{display:flex;align-items:center;gap:8px;flex-wrap:wrap}",
        ".@-seg{display:inline-flex;border:1px solid var(--dsw-alias-border-l2,#e5e6eb);border-radius:9px;overflow:hidden;background:var(--dsw-alias-bg-layer-1,#fff)}",
        ".@-seg button{appearance:none;border:0;background:transparent;color:var(--dsw-alias-label-secondary,#646a73);font-size:12px;padding:6px 10px;cursor:pointer;white-space:nowrap}",
        ".@-seg button.@-on{background:var(--dsw-alias-brand-primary,#4f6ef7);color:var(--dsw-alias-label-primary-inverted,#fff)}",
        ".@-range{display:inline-flex;align-items:center;gap:4px}",
        ".@-date{appearance:none;border:0;background:transparent;color:var(--dsw-alias-label-secondary,#646a73);font-family:inherit;font-size:12px;padding:4px 2px;width:116px;outline:none}",
        ".@-date::-webkit-calendar-picker-indicator{opacity:.55;cursor:pointer}",
        ".@-dash{color:var(--dsw-alias-label-tertiary,#8f959e);font-size:12px}",
        ".@-clear{appearance:none;border:0;background:transparent;color:var(--dsw-alias-label-tertiary,#8f959e);font-size:14px;line-height:1;padding:2px 4px;cursor:pointer;border-radius:4px}",
        ".@-clear:hover{color:var(--dsw-alias-state-error-primary,#d9534f);background:var(--dsw-alias-bg-skeleton,#f2f3f5)}",
        ".@-hint{font-size:11px;color:var(--dsw-alias-state-error-primary,#d9534f);white-space:nowrap}",
        ".@-ghost{appearance:none;border:1px solid var(--dsw-alias-border-l2,#e5e6eb);background:var(--dsw-alias-bg-layer-1,#fff);color:var(--dsw-alias-label-secondary,#646a73);border-radius:8px;font-size:12px;padding:6px 10px;cursor:pointer;display:inline-flex;align-items:center;gap:5px;font-family:inherit}",
        ".@-ghost:disabled{opacity:.6;cursor:progress}",
        ".@-ico{display:block;flex:none}",
        ".@-kpi-l .@-ico{opacity:.7}",
        ".@-ghost:hover{border-color:var(--dsw-alias-brand-primary,#4f6ef7);color:var(--dsw-alias-brand-primary,#4f6ef7)}",
        ".@-muted{color:var(--dsw-alias-label-tertiary,#8f959e);font-size:12px}",
        ".@-sgrid{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:12px}",
        ".@-scard{grid-column:span 6;min-width:0;background:var(--dsw-alias-bg-layer-1,#fff);border:1px solid var(--dsw-alias-border-l2,#e5e6eb);border-radius:12px;padding:14px 16px}",
        ".@-span-3{grid-column:span 3}.@-span-4{grid-column:span 4}.@-span-6{grid-column:span 6}.@-span-8{grid-column:span 8}.@-span-12{grid-column:span 12}",
        ".@-chead{display:flex;align-items:baseline;gap:8px;margin-bottom:10px;flex-wrap:wrap}",
        ".@-ctitle{font-size:13px;font-weight:600;color:var(--dsw-alias-label-primary,#1f2329)}",
        ".@-cnote{font-size:11px;color:var(--dsw-alias-label-tertiary,#8f959e)}",
        ".@-kpis{grid-column:span 12;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}",
        ".@-kpi{background:var(--dsw-alias-bg-layer-1,#fff);border:1px solid var(--dsw-alias-border-l2,#e5e6eb);border-radius:12px;padding:12px 14px;min-width:0}",
        ".@-kpi-l{font-size:12px;color:var(--dsw-alias-label-tertiary,#8f959e);display:flex;align-items:center;gap:6px}",
        ".@-kpi-v{font-size:26px;line-height:1.25;font-weight:650;margin-top:4px;font-variant-numeric:tabular-nums}",
        ".@-kpi-u{font-size:12px;font-weight:400;color:var(--dsw-alias-label-tertiary,#8f959e);margin-left:3px}",
        ".@-kpi-h{font-size:11px;color:var(--dsw-alias-label-tertiary,#8f959e);margin-top:3px}",
        ".@-kpi.@-danger .@-kpi-v{color:var(--dsw-alias-state-error-primary,#d9534f)}",
        ".@-kpi.@-warn .@-kpi-v{color:var(--dsw-alias-state-warn-primary,#d99100)}",
        ".@-kpi.@-ok .@-kpi-v{color:var(--dsw-alias-state-success-primary,#2f9e6e)}",
        ".@-donut{display:flex;align-items:center;gap:16px;flex-wrap:wrap}",
        ".@-donut svg{flex:0 0 auto}",
        ".@-legend{display:flex;flex-direction:column;gap:7px;min-width:120px;flex:1}",
        ".@-leg{display:flex;align-items:center;gap:7px;font-size:12px;color:var(--dsw-alias-label-secondary,#646a73)}",
        ".@-dot{width:8px;height:8px;border-radius:50%;flex:0 0 auto}",
        ".@-leg b{margin-left:auto;font-weight:600;color:var(--dsw-alias-label-primary,#1f2329);font-variant-numeric:tabular-nums}",
        ".@-bars{display:flex;flex-direction:column;gap:9px}",
        ".@-bar{display:grid;grid-template-columns:minmax(72px,1.2fr) 3fr auto;gap:8px;align-items:center;font-size:12px}",
        ".@-bar-l{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--dsw-alias-label-secondary,#646a73)}",
        ".@-bar-t{display:block;height:8px;border-radius:6px;background:var(--dsw-alias-bg-skeleton,#f2f3f5);overflow:hidden}",
        ".@-bar-f{display:block;height:100%;border-radius:6px;background:var(--dsw-alias-state-business-primary,#4f6ef7);min-width:2px}",
        ".@-bar-v{font-variant-numeric:tabular-nums;color:var(--dsw-alias-label-primary,#1f2329);font-weight:600;min-width:34px;text-align:right}",
        ".@-stack{display:flex;flex-direction:column;gap:10px}",
        ".@-srow-l{font-size:12px;color:var(--dsw-alias-label-secondary,#646a73);margin-bottom:4px;display:flex}",
        ".@-srow-l b{margin-left:auto;color:var(--dsw-alias-label-primary,#1f2329);font-variant-numeric:tabular-nums}",
        ".@-strack{display:flex;height:10px;border-radius:6px;overflow:hidden;background:var(--dsw-alias-bg-skeleton,#f2f3f5)}",
        ".@-seg-f{height:100%}",
        ".@-hist{display:flex;align-items:flex-end;gap:8px;height:150px;padding-top:16px}",
        ".@-hbar{flex:1;display:flex;flex-direction:column;justify-content:flex-end;align-items:center;gap:5px;min-width:0;height:100%}",
        ".@-hbar-v{font-size:11px;color:var(--dsw-alias-label-secondary,#646a73);font-variant-numeric:tabular-nums}",
        ".@-hbar-f{width:100%;max-width:44px;border-radius:5px 5px 0 0;background:var(--dsw-alias-state-business-primary,#4f6ef7);min-height:2px}",
        ".@-hbar-l{font-size:11px;color:var(--dsw-alias-label-tertiary,#8f959e);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}",
        ".@-trend{width:100%;height:auto;display:block}",
        ".@-tlegend{display:flex;gap:14px;flex-wrap:wrap;margin-top:6px;font-size:11px;color:var(--dsw-alias-label-tertiary,#8f959e)}",
        ".@-trend-wrap{position:relative}",
        ".@-trend-hit{fill:transparent}",
        ".@-trend-slot{fill:transparent;cursor:crosshair}",
        ".@-trend-cross{stroke:var(--dsw-alias-border-l2,#e5e6eb);stroke-width:1;stroke-dasharray:3 3}",
        ".@-tlegend{display:flex;gap:10px;flex-wrap:wrap;margin-top:6px;font-size:11px;color:var(--dsw-alias-label-tertiary,#8f959e)}",
        ".@-tleg-item{appearance:none;border:0;background:transparent;color:inherit;font:inherit;display:inline-flex;align-items:center;gap:5px;padding:2px 4px;border-radius:5px;cursor:pointer}",
        ".@-tleg-item.off{opacity:.45;text-decoration:line-through}",
        ".@-tleg-item:hover{background:var(--dsw-alias-bg-skeleton,#f2f3f5)}",
        ".@-table-scroll{max-width:100%;overflow-x:auto}.@-table{width:100%;border-collapse:collapse;font-size:12px}",
        ".@-table th{text-align:left;font-weight:500;color:var(--dsw-alias-label-tertiary,#8f959e);padding:6px 8px;border-bottom:1px solid var(--dsw-alias-border-l2,#e5e6eb);white-space:nowrap}",
        ".@-table td{padding:7px 8px;border-bottom:1px solid var(--dsw-alias-border-l1,#f2f3f5);color:var(--dsw-alias-label-secondary,#646a73);vertical-align:top}",
        ".@-table tr:last-child td{border-bottom:0}",
        ".@-table th.@-num,.@-table td.@-num{text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap}",
        ".@-empty{padding:26px 8px;text-align:center;color:var(--dsw-alias-label-tertiary,#8f959e);font-size:12px}",
        ".@-err{display:flex;align-items:center;gap:10px;background:color-mix(in srgb,var(--dsw-alias-state-error-primary,#d9534f) 8%,transparent);border:1px solid color-mix(in srgb,var(--dsw-alias-state-error-primary,#d9534f) 30%,transparent);color:var(--dsw-alias-state-error-primary,#d9534f);border-radius:10px;padding:10px 12px;font-size:12px}",
        ".@-warn{grid-column:span 12;border:1px dashed var(--dsw-alias-state-warn-primary,#d99100);border-radius:10px;padding:9px 12px;font-size:12px;color:var(--dsw-alias-state-warn-primary,#d99100);background:color-mix(in srgb,var(--dsw-alias-state-warn-primary,#d99100) 6%,transparent)}",
        ".@-sk{height:14px;border-radius:6px;background:var(--dsw-alias-bg-skeleton,#f2f3f5);margin:7px 0;animation:@-pulse 1.2s ease-in-out infinite}",
        "@keyframes @-pulse{0%,100%{opacity:.55}50%{opacity:1}}",
        "@media (max-width:900px){.@-scard{grid-column:span 12}.@-span-3,.@-span-4,.@-span-6,.@-span-8{grid-column:span 12}.@-kpis{grid-template-columns:repeat(2,minmax(0,1fr))}}",
        "@media (max-width:600px){.@-stats{padding-bottom:16px}.@-hist{height:130px}.@-kpi-v{font-size:22px}}",
        "@media (prefers-reduced-motion:reduce){.@-sk{animation:none}}"
      ].concat(extra || []).concat([require_date_picker_styles()(prefix)]).join("\n").replace(/@-/g, prefix + "-");
    }
    function primitives(prefix, options) {
      var opts = options || {};
      var ICONS = opts.icons || {};
      var showNote = !!opts.showNote;
      function ico(name, size) {
        var C = ICONS[name];
        if (!C) return null;
        return h(C, { size: size || 13, strokeWidth: 2, "aria-hidden": "true", className: prefix + "-ico" });
      }
      function num(lang, n) {
        var v = Number(n);
        if (!isFinite(v)) return "\u2014";
        try {
          return new Intl.NumberFormat(lang === "en" ? "en-US" : "zh-CN").format(v);
        } catch (e) {
          return String(v);
        }
      }
      function pct(v, digits) {
        if (v === null || v === void 0 || !isFinite(Number(v))) return "\u2014";
        return (Number(v) * 100).toFixed(digits === void 0 ? 1 : digits) + "%";
      }
      function timeText(ms) {
        if (!ms) return "";
        var d = new Date(Number(ms));
        function p(n) {
          return String(n).padStart(2, "0");
        }
        return p(d.getHours()) + ":" + p(d.getMinutes()) + ":" + p(d.getSeconds());
      }
      function dateText(ms) {
        if (!ms) return "\u2014";
        var d = new Date(Number(ms));
        function p(n) {
          return String(n).padStart(2, "0");
        }
        return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate());
      }
      function Card(props) {
        var cls = prefix + "-scard" + (props.span ? " " + prefix + "-span-" + props.span : "");
        return h(
          "section",
          { className: cls },
          props.title || props.right ? h(
            "div",
            { className: prefix + "-chead" },
            h("span", { className: prefix + "-ctitle" }, props.title),
            props.note ? h("span", { className: prefix + "-cnote" }, props.note) : null,
            props.right ? h("span", { style: { marginLeft: "auto" } }, props.right) : null
          ) : null,
          props.children
        );
      }
      function Kpi(props) {
        var tone = props.tone ? " " + prefix + "-" + props.tone : "";
        return h(
          "div",
          { className: prefix + "-kpi" + tone },
          h("div", { className: prefix + "-kpi-l" }, ico(props.icon, 13), props.label),
          h(
            "div",
            { className: prefix + "-kpi-v" },
            props.value === null || props.value === void 0 ? "\u2014" : typeof props.value === "number" ? num(props.lang, props.value) : props.value,
            props.unit ? h("span", { className: prefix + "-kpi-u" }, props.unit) : null
          ),
          props.hint ? h("div", { className: prefix + "-kpi-h" }, props.hint) : null
        );
      }
      function Donut(props) {
        var data = (props.data || []).filter(function(d) {
          return Number(d.count) > 0;
        });
        var total = Number(props.total || 0);
        var size = props.size || 168;
        var r = size / 2 - 16;
        var c = 2 * Math.PI * r;
        var offset = 0;
        var aria = props.aria || data.map(function(d) {
          return d.label + " " + d.count;
        }).join("\uFF0C");
        return h(
          "div",
          { className: prefix + "-donut" },
          h(
            "svg",
            { width: size, height: size, viewBox: "0 0 " + size + " " + size, role: "img", "aria-label": aria },
            h("circle", { cx: size / 2, cy: size / 2, r, fill: "none", stroke: "var(--dsw-alias-bg-skeleton,#f2f3f5)", strokeWidth: 18 }),
            total > 0 ? data.map(function(d, i) {
              var len = Number(d.count) / total * c;
              var seg = h("circle", {
                key: d.key || d.label || i,
                cx: size / 2,
                cy: size / 2,
                r,
                fill: "none",
                stroke: d.color || COLORS[i % COLORS.length],
                strokeWidth: 18,
                strokeDasharray: len + " " + (c - len),
                strokeDashoffset: -offset,
                transform: "rotate(-90 " + size / 2 + " " + size / 2 + ")",
                strokeLinecap: "butt"
              }, h("title", null, d.label + "\uFF1A" + d.count + (showNote && d.note ? "\uFF08" + d.note + "\uFF09" : "")));
              offset += len;
              return seg;
            }) : null,
            h("text", { x: size / 2, y: size / 2 - 2, textAnchor: "middle", fill: "var(--dsw-alias-label-primary,#1f2329)", fontSize: 24, fontWeight: 650 }, num(props.lang, total)),
            h("text", { x: size / 2, y: size / 2 + 18, textAnchor: "middle", fill: "var(--dsw-alias-label-tertiary,#8f959e)", fontSize: 11 }, props.centerLabel || "")
          ),
          h("div", { className: prefix + "-legend" }, (props.data || []).map(function(d, i) {
            return h(
              "div",
              { key: d.key || d.label || i, className: prefix + "-leg" },
              h("span", { className: prefix + "-dot", style: { background: d.color || COLORS[i % COLORS.length] } }),
              h("span", null, d.label, showNote && d.note ? h("i", { className: prefix + "-leg-note" }, "\xB7 " + d.note) : null),
              h("b", null, num(props.lang, d.count))
            );
          }))
        );
      }
      function BarList(props) {
        var data = props.data || [];
        var max = Number(props.max || 0) || data.reduce(function(m, d) {
          return Math.max(m, Number(d.value || 0));
        }, 0) || 1;
        return h("div", { className: prefix + "-bars" }, data.map(function(d, i) {
          var v = Number(d.value || 0);
          return h(
            "div",
            { key: d.key || d.label || i, className: prefix + "-bar" },
            h("span", { className: prefix + "-bar-l", title: d.title || d.label }, d.label),
            h("span", { className: prefix + "-bar-t" }, h("span", { className: prefix + "-bar-f", style: { width: Math.max(2, v / max * 100) + "%", background: d.color || props.color || COLORS[0] } })),
            h("span", { className: prefix + "-bar-v" }, props.format ? props.format(v) : num(props.lang, v))
          );
        }));
      }
      function StackedRows(props) {
        var rows = props.rows || [];
        var keys = props.keys || [];
        return h("div", { className: prefix + "-stack" }, rows.map(function(row, ri) {
          var total = Number(row.total || 0) || 1;
          return h(
            "div",
            { key: row.key || ri },
            h("div", { className: prefix + "-srow-l" }, h("span", null, row.label), h("b", null, num(props.lang, row.total))),
            h("div", { className: prefix + "-strack" }, keys.map(function(k, i) {
              var v = Number(row.parts && row.parts[k.key] || 0);
              if (v <= 0) return null;
              return h("span", {
                key: k.key,
                className: prefix + "-seg-f",
                title: k.label + " " + v,
                style: { width: v / total * 100 + "%", background: k.color || COLORS[i % COLORS.length] }
              });
            }))
          );
        }));
      }
      function useWidth() {
        if (typeof React.useRef !== "function" || typeof React.useEffect !== "function") return [null, 0];
        var state = React.useState(0);
        var ref = React.useRef(null);
        var setWidth = state[1];
        var useIso = React.useLayoutEffect || React.useEffect;
        useIso(function() {
          var node = ref.current;
          if (!node) return void 0;
          function read() {
            var w = node.clientWidth || 0;
            if (w > 0) setWidth(w);
          }
          read();
          if (typeof ResizeObserver === "undefined") return void 0;
          var ro = new ResizeObserver(read);
          ro.observe(node);
          return function() {
            ro.disconnect();
          };
        }, []);
        return [ref, state[0]];
      }
      function Trend(props) {
        var data = props.data || [];
        var series = props.series || [];
        var lang = props.lang;
        var fmt = typeof props.format === "function" ? props.format : function(v) {
          return num(lang, v);
        };
        var visible = props.visible || null;
        var shown = series.filter(function(s) {
          return !visible || visible[s.key] !== false;
        });
        if (!data.length) return h("div", { className: prefix + "-empty" }, props.emptyText || "\u6682\u65E0\u6570\u636E");
        var size = useWidth();
        var width = Math.max(260, size[1] || props.width || 640);
        var height = props.height || 200;
        var left = props.left || 60, right = 12, top = 14, bottom = 26;
        var pw = width - left - right, ph = height - top - bottom;
        var max = 0;
        data.forEach(function(d) {
          shown.forEach(function(s) {
            max = Math.max(max, Math.abs(Number(d[s.key] || 0)));
          });
        });
        var raw = Math.max(max, 1) / 4;
        var exp = Math.pow(10, Math.floor(Math.log(raw) / Math.LN10));
        var norm = raw / exp;
        var mult = norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 2.5 ? 2.5 : norm <= 5 ? 5 : 10;
        var step = mult * exp;
        var axisMax = step * 4;
        function x(i2) {
          return left + (data.length <= 1 ? pw / 2 : i2 / (data.length - 1) * pw);
        }
        function y(v) {
          return top + ph - Math.max(0, Number(v) || 0) / axisMax * ph;
        }
        var active = typeof props.active === "number" ? props.active : null;
        var band = data.length > 1 ? pw / (data.length - 1) : pw;
        var labelIdx = [];
        var labelStep = Math.max(1, Math.ceil(data.length / 8));
        for (var i = 0; i < data.length; i += labelStep) labelIdx.push(i);
        if (labelIdx[labelIdx.length - 1] !== data.length - 1) labelIdx.push(data.length - 1);
        var aria = props.aria || shown.map(function(s) {
          return s.label + " " + data.reduce(function(n, d) {
            return n + Number(d[s.key] || 0);
          }, 0);
        }).join("\uFF0C");
        var ticks = [];
        for (var t = 0; t <= 4; t++) ticks.push(step * t);
        var children = [];
        if (typeof props.onHover === "function") {
          children.push(h("rect", {
            key: "hit-area",
            x: left,
            y: top,
            width: pw,
            height: ph,
            className: prefix + "-trend-hit",
            onMouseLeave: function() {
              props.onHover(null);
            }
          }));
          data.forEach(function(d, di) {
            children.push(h("rect", {
              key: "hit" + di,
              x: x(di) - band / 2,
              y: top,
              width: band,
              height: ph,
              className: prefix + "-trend-slot",
              onMouseEnter: function() {
                props.onHover(di);
              }
            }));
          });
        }
        ticks.forEach(function(v, ti) {
          children.push(h(
            "g",
            { key: "t" + ti },
            h("line", { x1: left, x2: width - right, y1: y(v), y2: y(v), stroke: "var(--dsw-alias-border-l1,#f2f3f5)", strokeWidth: 1 }),
            h("text", { x: left - 8, y: y(v) + 3, textAnchor: "end", fontSize: 11, fill: "var(--dsw-alias-label-tertiary,#8f959e)" }, fmt(v))
          ));
        });
        if (active !== null && data[active]) {
          children.push(h("line", {
            key: "cross",
            x1: x(active),
            y1: top,
            x2: x(active),
            y2: top + ph,
            className: prefix + "-trend-cross"
          }));
        }
        shown.forEach(function(s, si) {
          var color = s.color || COLORS[series.indexOf(s) % COLORS.length];
          var pts = data.map(function(d, di) {
            return x(di) + "," + y(d[s.key]);
          }).join(" ");
          if (data.length > 1) {
            children.push(h("polyline", {
              key: "line" + s.key,
              points: pts,
              fill: "none",
              stroke: color,
              strokeWidth: 2,
              strokeLinejoin: "round",
              strokeLinecap: "round",
              // className 供插件用自有色调样式挂靠，也方便测试按系列归类
              className: prefix + "-trend-line" + (s.className ? " " + s.className : "")
            }));
          }
          data.forEach(function(d, di) {
            children.push(h("circle", {
              key: "dot" + s.key + di,
              cx: x(di),
              cy: y(d[s.key]),
              fill: color,
              r: di === active ? 5 : 3,
              className: prefix + "-trend-dot" + (di === active ? " is-hot" : "")
            }, h("title", null, labelOf(d, di) + " \xB7 " + s.label + " " + fmt(d[s.key]) + (props.note ? " \xB7 " + props.note(d) : ""))));
          });
        });
        function labelOf(d, di) {
          if (typeof props.label === "function") return props.label(d, di);
          return String(d.bucket === void 0 ? di + 1 : d.bucket).slice(5);
        }
        labelIdx.forEach(function(di) {
          children.push(h("text", { key: "x" + di, x: x(di), y: height - 8, textAnchor: "middle", fontSize: 11, fill: "var(--dsw-alias-label-tertiary,#8f959e)" }, labelOf(data[di], di)));
        });
        var legend = props.showLegend === false ? null : h("div", { className: prefix + "-tlegend" }, series.map(function(s, si) {
          var off = !!(visible && visible[s.key] === false);
          var color = s.color || COLORS[si % COLORS.length];
          var inner = [h("span", { key: "d", className: prefix + "-dot", style: { background: color } }), s.label];
          if (typeof props.onToggle !== "function") {
            return h("span", { key: s.key, className: prefix + "-tleg-item" + (off ? " off" : "") }, inner);
          }
          return h("button", {
            key: s.key,
            type: "button",
            className: prefix + "-tleg-item" + (off ? " off" : ""),
            "aria-pressed": !off,
            title: (off ? "\u663E\u793A" : "\u9690\u85CF") + s.label,
            onClick: function() {
              props.onToggle(s.key);
            }
          }, inner);
        }));
        return h(
          "div",
          { className: prefix + "-trend-wrap", ref: size[0] },
          h("svg", { className: prefix + "-trend", viewBox: "0 0 " + width + " " + height, width, height, role: "img", "aria-label": aria }, children),
          legend
        );
      }
      function Histogram(props) {
        var data = props.data || [];
        var max = data.reduce(function(m, d) {
          return Math.max(m, Number(d.count || 0));
        }, 0) || 1;
        return h(
          "div",
          { className: prefix + "-hist", role: "img", "aria-label": props.aria || data.map(function(d) {
            return d.label + " " + d.count;
          }).join("\uFF0C") },
          data.map(function(d, i) {
            return h(
              "div",
              { key: d.key || d.label || i, className: prefix + "-hbar", title: d.label + "\uFF1A" + d.count },
              h("span", { className: prefix + "-hbar-v" }, num(props.lang, d.count)),
              h("span", { className: prefix + "-hbar-f", style: { height: Math.max(2, Number(d.count || 0) / max * 100) + "%", background: d.color || props.color || COLORS[0] } }),
              h("span", { className: prefix + "-hbar-l" }, d.label)
            );
          })
        );
      }
      function DataTable(props) {
        var cols = props.columns || [];
        var rows = props.rows || [];
        if (!rows.length) return h("div", { className: prefix + "-empty" }, props.empty || "\u6682\u65E0\u6570\u636E");
        return h("div", { className: prefix + "-table-scroll", tabIndex: 0, role: "region", "aria-label": props.lang === "en" ? "Data table" : "\u6570\u636E\u8868\u683C" }, h(
          "table",
          { className: prefix + "-table" },
          h("thead", null, h("tr", null, cols.map(function(c) {
            return h("th", { key: c.key, className: c.num ? prefix + "-num" : "" }, c.label);
          }))),
          h("tbody", null, rows.map(function(row, ri) {
            return h("tr", { key: row.id || row.key || ri }, cols.map(function(c) {
              return h("td", { key: c.key, className: c.num ? prefix + "-num" : "" }, c.render ? c.render(row) : row[c.key]);
            }));
          }))
        ));
      }
      function RangeSwitch(props) {
        var custom = props.custom || null;
        var from = custom && custom.from ? custom.from : "";
        var to = custom && custom.to ? custom.to : "";
        function setDate(key, value) {
          if (typeof props.onCustomChange !== "function") return;
          var next = { from, to };
          next[key] = value;
          props.onCustomChange(next);
        }
        return h(
          "div",
          { className: prefix + "-stoolbar" },
          h("div", { className: prefix + "-seg", role: "group", "aria-label": props.aria || "\u65F6\u95F4\u8303\u56F4" }, (props.options || []).map(function(o) {
            return h("button", {
              key: o.key,
              type: "button",
              className: o.key === props.value ? prefix + "-on" : "",
              "aria-pressed": !!props.value && o.key === props.value,
              onClick: function() {
                props.onChange(o.key);
              }
            }, o.label);
          })),
          h(
            "div",
            { className: prefix + "-range", role: "group", "aria-label": props.customAria || "\u81EA\u5B9A\u4E49\u65E5\u671F\u8303\u56F4" },
            h(DP.RangePicker, {
              React,
              h,
              prefix,
              lang: props.lang,
              label: props.customAria || "\u81EA\u5B9A\u4E49\u65E5\u671F\u8303\u56F4",
              value: { from, to },
              max: props.today || void 0,
              clearable: false,
              onChange: function(next) {
                if (typeof props.onCustomChange !== "function") return;
                props.onCustomChange({ from: next.from, to: next.to });
              }
            }),
            from || to ? h("button", {
              type: "button",
              className: prefix + "-clear",
              "aria-label": props.clearLabel || "\u6E05\u9664\u81EA\u5B9A\u4E49\u8303\u56F4",
              title: props.clearLabel || "\u6E05\u9664\u81EA\u5B9A\u4E49\u8303\u56F4",
              onClick: function() {
                if (props.onCustomClear) props.onCustomClear();
              }
            }, "\xD7") : null
          ),
          props.customHint ? h("span", { className: prefix + "-hint", role: "status" }, props.customHint) : null,
          h("button", { type: "button", className: prefix + "-ghost", disabled: !!props.loading, onClick: props.onRefresh }, ico("refresh", 13), props.refreshLabel || "\u5237\u65B0"),
          h("span", { className: prefix + "-muted" }, props.generatedAt ? (props.timeLabel || "\u622A\u81F3") + " " + timeText(props.generatedAt) : ""),
          props.right ? h("span", { style: { marginLeft: "auto" } }, props.right) : null
        );
      }
      function Empty(props) {
        return h("div", { className: prefix + "-empty" }, props.text || "\u6682\u65E0\u6570\u636E");
      }
      function Skeleton() {
        return h(
          "div",
          { className: prefix + "-sgrid" },
          h("div", { className: prefix + "-kpis" }, [0, 1, 2, 3].map(function(i) {
            return h(
              "div",
              { key: i, className: prefix + "-kpi" },
              h("div", { className: prefix + "-sk", style: { width: "40%" } }),
              h("div", { className: prefix + "-sk", style: { width: "65%", height: 26 } })
            );
          })),
          [0, 1].map(function(i) {
            return h(
              "div",
              { key: "c" + i, className: prefix + "-scard " + prefix + "-span-6" },
              h("div", { className: prefix + "-sk", style: { width: "30%" } }),
              h("div", { className: prefix + "-sk", style: { height: 120 } })
            );
          })
        );
      }
      function ErrorBar(props) {
        return h(
          "div",
          { className: prefix + "-err", role: "alert" },
          h("span", null, props.message),
          props.onRetry ? h("button", { type: "button", className: prefix + "-ghost", onClick: props.onRetry }, props.retryLabel || "\u91CD\u8BD5") : null
        );
      }
      function Warnings(props) {
        var items = props.items || [];
        if (!items.length) return null;
        return h("div", { className: prefix + "-warn", role: "status" }, items.map(function(w) {
          return w.message;
        }).join("\uFF1B"));
      }
      return {
        Card,
        Kpi,
        Donut,
        BarList,
        StackedRows,
        Trend,
        Histogram,
        DataTable,
        RangeSwitch,
        Empty,
        Skeleton,
        ErrorBar,
        Warnings,
        num,
        pct,
        timeText,
        dateText,
        colors: COLORS,
        useWidth
      };
    }
    function makeCharts(prefix, options) {
      var opts = options || {};
      if (typeof document !== "undefined" && !document.getElementById(prefix + "-charts-css")) {
        var el = document.createElement("style");
        el.id = prefix + "-charts-css";
        el.textContent = css(prefix, opts.styles);
        document.head.appendChild(el);
      }
      return primitives(prefix, opts);
    }
    module2.exports = { makeCharts, primitives, css, colors: COLORS };
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
      var P = require_stats_parts();
      var charts = require_stats_charts();
      var ch = React.useMemo(function() {
        return charts.makeCharts("wbsalc");
      }, []);
      var yearState = React.useState(props.initialYear || (/* @__PURE__ */ new Date()).getFullYear());
      var year = yearState[0], setYear = yearState[1];
      var basisState = React.useState(props.initialBasis || "arrival");
      var basis = basisState[0], setBasis = basisState[1];
      var basisLabel = basis === "income" ? "\u6309\u6240\u5C5E\u6708" : "\u6309\u5230\u8D26\u6708";
      var amountState = React.useState(props.initialAmount || "net");
      var amount = amountState[0], setAmount = amountState[1];
      var amountLabel = amount === "gross" ? "\u5E94\u53D1" : "\u5B9E\u53D1";
      var load = C.useLoad(React, api, "salary.stats", { year, basis }, [year, basis]);
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
      var recordedMonths = monthly.filter(function(bucket) {
        return bucket.records > 0;
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
      function toggleIn(state, series) {
        return function(key) {
          var next = {};
          series.forEach(function(m) {
            next[m.key] = state[0][m.key] !== false;
          });
          next[key] = !next[key];
          state[1](next);
        };
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
      var DEDUCT_TOTAL_ALL = round2((data && data.socialTotal || 0) + (data && data.incomeTaxTotal || 0));
      var DEDUCT_SERIES = F.SOCIAL_KEYS.map(function(key, index) {
        return { key, label: F.LABELS[key], tone: "s" + (index + 1) };
      }).concat([
        { key: "incomeTax", label: "\u4E2A\u7A0E", tone: "s5" },
        { key: "deductTotal", label: "\u5408\u8BA1", tone: "sum", get: deductOf }
      ]);
      var socialState = React.useState(Object.assign({ pension: true, medical: true, unemployment: true, housingFund: true, incomeTax: true, deductTotal: true }, props.initialSocialVisible || {}));
      var socialVisible = socialState[0];
      var hoverState = React.useState(typeof props.initialHover === "number" ? props.initialHover : null);
      var socialHoverState = React.useState(typeof props.initialSocialHover === "number" ? props.initialSocialHover : null);
      var yearHoverState = React.useState(null);
      var quarterHoverState = React.useState(null);
      var yoyHoverState = React.useState(null);
      function monthIndexOf(value) {
        if (typeof value !== "number") return null;
        for (var i = 0; i < recordedMonths.length; i += 1) {
          if (recordedMonths[i].month === value) return i;
        }
        return null;
      }
      function monthOfIndex(index) {
        if (index === null || index === void 0 || !recordedMonths[index]) return null;
        return recordedMonths[index].month;
      }
      function sumSeries() {
        return [
          { key: "total", label: "\u5408\u8BA1", tone: "s1" },
          { key: "max", label: "\u5355\u7B14\u6700\u9AD8", tone: "s3" },
          { key: "avg", label: "\u5355\u7B14\u5747\u503C", tone: "s2" }
        ];
      }
      var SUM_SERIES = sumSeries();
      var yearVisibleState = React.useState({ total: true, max: true, avg: true });
      var quarterVisibleState = React.useState({ total: true, max: true, avg: true });
      var yoyVisibleState = React.useState({ now: true, prior: true });
      var YOY_SERIES = [
        { key: "now", label: year + " \u5E74", tone: "s1" },
        { key: "prior", label: year - 1 + " \u5E74", tone: "s2" }
      ];
      function flatten(list, suffix) {
        return (list || []).map(function(item) {
          return {
            bucket: item.bucket,
            count: item.count || 0,
            total: Number(item[amount + "Total"] !== void 0 ? item[amount + "Total"] : 0) || 0,
            max: Number(item[amount + "Max"] !== void 0 ? item[amount + "Max"] : 0) || 0,
            avg: Number(item[amount + "Avg"] !== void 0 ? item[amount + "Avg"] : 0) || 0,
            suffix
          };
        });
      }
      var yearlyRows = flatten(data && data.yearly, "\u5E74");
      var quarterRows = flatten(data && data.quarterly, "");
      var priorByMonth = {};
      (data && data.priorMonthly || []).forEach(function(item) {
        priorByMonth[item.month] = item;
      });
      var yoyRows = (data && data.monthly || []).map(function(bucket) {
        var prior = priorByMonth[bucket.month] || {};
        return {
          bucket: bucket.period || year + "-" + String(bucket.month).padStart(2, "0"),
          month: bucket.month,
          count: bucket.records || 0,
          now: amount === "gross" ? Number(bucket.grossPay) || 0 : Number(bucket.netPay) || 0,
          prior: amount === "gross" ? Number(prior.grossPay) || 0 : Number(prior.netPay) || 0,
          priorRecords: prior.records || 0
        };
      }).filter(function(row) {
        return row.count > 0 || row.prior > 0;
      });
      function money(v) {
        return F.money(v);
      }
      function axisFmt(v) {
        var n = Number(v) || 0;
        if (Math.abs(n) >= 1e4) return Number((n / 1e4).toFixed(1)) + "\u4E07";
        return String(Math.round(n));
      }
      function monthLabel(bucket) {
        return String(bucket).slice(5) + " \u6708";
      }
      function quarterLabel(bucket) {
        return String(bucket).replace("-Q", " Q");
      }
      var yearNet = Number(data && data.netTotal) || 0;
      var yearGross = Number(data && data.grossTotal) || 0;
      var yearTax = Number(data && data.incomeTaxTotal) || 0;
      var yearSocial = Number(data && data.socialTotal) || 0;
      var yearMax = 0, yearMin = null;
      recordedMonths.forEach(function(bucket) {
        var value = Number(bucket.netPay) || 0;
        if (value > yearMax) yearMax = value;
        if (value > 0 && (yearMin === null || value < yearMin)) yearMin = value;
      });
      var mom = data && data.mom;
      var momText = mom && mom.percent !== null && mom.percent !== void 0 ? (mom.percent >= 0 ? "+" : "") + mom.percent + "%" : "\u2014";
      var body;
      if (load.loading || data && (data.year !== year || data.basis !== basis)) {
        body = h("div", { className: "wbsal-card" }, h(ch.Skeleton, { text: "\u52A0\u8F7D\u4E2D\u2026" }));
      } else if (!data) {
        body = h(
          "div",
          { className: "wbsal-card wbsal-empty" },
          h("strong", null, "\u7EDF\u8BA1\u52A0\u8F7D\u5931\u8D25"),
          h("span", null, load.error || "\u8BF7\u7A0D\u540E\u91CD\u8BD5"),
          h("div", { className: "wbsal-empty-actions" }, h(C.Btn, { h, onClick: function() {
            load.refresh();
          } }, "\u91CD\u8BD5"))
        );
      } else {
        var hasYear = data.records > 0;
        var latest = data.latestMonth;
        var latestBreakdown = latest && latest.breakdown ? latest.breakdown : null;
        var deductionTotal = Number(data.deductionTotal) || 0;
        var sections = [];
        sections.push(P.trendCard({
          h,
          CH: ch,
          lang: props.lang,
          title: "\u5E74\u5EA6\u8D8B\u52BF",
          note: "\u5168\u90E8\u5E74\u4EFD \xB7 \u4E09\u6761\u7EBF\u5747\u6309" + amountLabel,
          series: SUM_SERIES,
          rows: yearlyRows,
          visible: yearVisibleState[0],
          onToggle: toggleIn(yearVisibleState, SUM_SERIES),
          hover: yearHoverState[0],
          onHover: yearHoverState[1],
          fmt: money,
          label: function(row) {
            return row.bucket + " \u5E74";
          },
          tipTitle: function(row) {
            return row.bucket + " \u5E74 \xB7 " + amountLabel;
          },
          tipRows: function(row) {
            return [
              { key: "total", label: "\u5408\u8BA1", tone: "s1", value: row.total },
              { key: "max", label: "\u5355\u7B14\u6700\u9AD8", tone: "s3", value: row.max },
              { key: "avg", label: "\u5355\u7B14\u5747\u503C", tone: "s2", value: row.avg }
            ];
          },
          tipNote: function(row) {
            return "\u5171 " + row.count + " \u7B14";
          },
          ariaLabel: "\u5E74\u5EA6\u5408\u8BA1\u3001\u5355\u7B14\u6700\u9AD8\u4E0E\u5355\u7B14\u5747\u503C\u6298\u7EBF\u56FE",
          emptyText: "\u8FD8\u6CA1\u6709\u8DE8\u5E74\u5EA6\u7684\u5DE5\u8D44\u8BB0\u5F55",
          allOffHint: "\u4E09\u6761\u7EBF\u90FD\u5173\u6389\u4E86\uFF0C\u70B9\u4E0A\u65B9\u300C\u5408\u8BA1 / \u5355\u7B14\u6700\u9AD8 / \u5355\u7B14\u5747\u503C\u300D\u4EFB\u610F\u4E00\u4E2A\u6062\u590D\u663E\u793A",
          footLeft: "\u6BCF\u6761\u7EBF\u53EF\u70B9\u4E0A\u65B9\u6807\u7B7E\u5355\u72EC\u5F00\u5173 \xB7 \u9F20\u6807\u79FB\u5230\u67D0\u4E00\u5E74\u770B\u5408\u8BA1\u3001\u6700\u9AD8\u4E0E\u5747\u503C",
          footRight: "\u5355\u4F4D\uFF1A\u5143 \xB7 " + basisLabel,
          height: 200
        }));
        sections.push(P.trendCard({
          h,
          CH: ch,
          lang: props.lang,
          title: "\u5B63\u5EA6\u8D8B\u52BF",
          note: "\u6700\u8FD1 8 \u4E2A\u6709\u8BB0\u5F55\u7684\u5B63\u5EA6",
          series: SUM_SERIES,
          rows: quarterRows,
          visible: quarterVisibleState[0],
          onToggle: toggleIn(quarterVisibleState, SUM_SERIES),
          hover: quarterHoverState[0],
          onHover: quarterHoverState[1],
          fmt: money,
          label: function(row) {
            return quarterLabel(row.bucket);
          },
          tipTitle: function(row) {
            return quarterLabel(row.bucket) + " \xB7 " + amountLabel;
          },
          tipRows: function(row) {
            return [
              { key: "total", label: "\u5408\u8BA1", tone: "s1", value: row.total },
              { key: "max", label: "\u5355\u7B14\u6700\u9AD8", tone: "s3", value: row.max },
              { key: "avg", label: "\u5355\u7B14\u5747\u503C", tone: "s2", value: row.avg }
            ];
          },
          tipNote: function(row) {
            return "\u5171 " + row.count + " \u7B14";
          },
          ariaLabel: "\u5B63\u5EA6\u5408\u8BA1\u3001\u5355\u7B14\u6700\u9AD8\u4E0E\u5355\u7B14\u5747\u503C\u6298\u7EBF\u56FE",
          emptyText: "\u8FD8\u6CA1\u6709\u5E26\u65E5\u671F\u7684\u5DE5\u8D44\u8BB0\u5F55",
          allOffHint: "\u4E09\u6761\u7EBF\u90FD\u5173\u6389\u4E86\uFF0C\u70B9\u4E0A\u65B9\u300C\u5408\u8BA1 / \u5355\u7B14\u6700\u9AD8 / \u5355\u7B14\u5747\u503C\u300D\u4EFB\u610F\u4E00\u4E2A\u6062\u590D\u663E\u793A",
          footLeft: "\u5B63\u5EA6\u6309" + (basis === "income" ? "\u5DE5\u8D44\u6240\u5C5E\u671F" : "\u5230\u8D26\u65E5\u671F") + "\u5F52\u96C6 \xB7 \u672A\u6765\u5B63\u5EA6\u4E0D\u753B 0",
          footRight: "\u5355\u4F4D\uFF1A\u5143 \xB7 " + amountLabel,
          height: 200
        }));
        if (hasYear) {
          sections.push(h(
            "div",
            { key: "kpi", className: "wbsal-kpis" },
            P.kpi(h, "\u5E74\u5EA6\u5B9E\u53D1\u5408\u8BA1", money(yearNet), data.records + " \u7B14 \xB7 \u8986\u76D6 " + data.months + " \u4E2A\u6708"),
            P.kpi(h, "\u5E74\u5EA6\u5E94\u53D1\u5408\u8BA1", money(yearGross), "\u4E2A\u7A0E " + money(yearTax) + " \xB7 \u4E94\u9669\u4E00\u91D1 " + money(yearSocial)),
            P.kpi(h, "\u6708\u5747\u5B9E\u53D1", money(data.avgNetPay), "\u5355\u7B14\u6700\u9AD8 " + money(yearMax)),
            P.kpi(h, "\u793E\u4FDD\u4E0E\u4E2A\u7A0E", money(DEDUCT_TOTAL_ALL), yearGross ? "\u5360\u5E94\u53D1 " + Math.round(DEDUCT_TOTAL_ALL / yearGross * 100) + "%" : "\u65E0\u5E94\u53D1\u8BB0\u5F55"),
            P.kpi(h, "\u73AF\u6BD4\u4E0A\u6708", momText, data.previousMonth ? F.monthLabel(data.previousMonth.period) + " \u2192 " + F.monthLabel((data.latestMonth || {}).period || "") : "\u6682\u65E0\u4E0A\u6708\u6570\u636E"),
            P.kpi(h, "\u6700\u9AD8 / \u6700\u4F4E\u5355\u6708", money(yearMax) + " / " + money(yearMin === null ? 0 : yearMin), data.peakMonth ? "\u5CF0\u503C " + F.monthLabel(data.peakMonth.period) : "\u6682\u65E0\u8BB0\u5F55")
          ));
          sections.push(h(
            "div",
            { key: "bar", className: "wbsal-card wbsal-section" },
            h(
              "div",
              { className: "wbsal-section-head" },
              h("h3", null, "\u6708\u5EA6" + metricLabel + "\u5206\u5E03"),
              h(
                "div",
                { className: "wbsal-section-tools" },
                h("span", { className: "wbsal-section-note" }, "\u6700\u9AD8 " + (data.peakMonth ? F.monthLabel(data.peakMonth.period) : "\u2014")),
                P.segGroup(h, METRICS.map(function(m) {
                  return [m.key, m.label];
                }), metric, setMetric, "\u67F1\u72B6\u56FE\u53E3\u5F84")
              )
            ),
            P.barChart({
              h,
              F,
              rows: monthly,
              value: function(bucket) {
                return Number(bucket[metric]) || 0;
              },
              metricLabel,
              basisLabel: basisLabel + " \xB7 " + year + " \u5E74"
            })
          ));
          sections.push(P.trendCard({
            h,
            CH: ch,
            lang: props.lang,
            title: "\u6708\u5EA6\u8D8B\u52BF\u5BF9\u6BD4",
            note: "\u516D\u6761\u53E3\u5F84\u7EBF",
            series: LINE_SERIES,
            rows: recordedMonths,
            visible,
            onToggle: toggleIn(visibleState, LINE_SERIES),
            hover: monthIndexOf(hoverState[0]),
            onHover: function(index) {
              hoverState[1](monthOfIndex(index));
            },
            fmt: money,
            label: function(row) {
              return F.monthLabel(row.period || year + "-" + String(row.month).padStart(2, "0"));
            },
            tipTitle: function(row) {
              return F.monthLabel(row.period || year + "-" + String(row.month).padStart(2, "0")) + " \u6536\u5165\u9762";
            },
            tipRows: function(row) {
              return LINE_SERIES.map(function(m) {
                return { key: m.key, label: m.label, tone: m.tone, value: seriesValue(m, row) };
              });
            },
            tipNote: function(row) {
              return "\u5171 " + row.records + " \u7B14";
            },
            ariaLabel: "\u6708\u5EA6\u5B9E\u53D1/\u5E94\u53D1/\u57FA\u672C/\u7EE9\u6548/\u8865\u8D34/\u7EE9\u6548\u5956\u60E9\u6298\u7EBF\u56FE",
            emptyText: year + " \u5E74\u8FD8\u6CA1\u6709\u5DE5\u8D44\u8BB0\u5F55",
            allOffHint: "\u516D\u6761\u7EBF\u90FD\u5173\u6389\u4E86\uFF0C\u70B9\u4E0A\u65B9\u7684\u300C\u5B9E\u53D1 / \u5E94\u53D1 / \u57FA\u672C / \u7EE9\u6548 / \u8865\u8D34 / \u7EE9\u6548\u5956\u60E9\u300D\u4EFB\u610F\u4E00\u4E2A\u6062\u590D\u663E\u793A",
            footLeft: "\u516D\u6761\u7EBF\u53EF\u5355\u72EC\u5F00\u5173 \xB7 \u9F20\u6807\u79FB\u5230\u67D0\u4E2A\u6708\u4EFD\u770B\u8BE5\u6708\u5168\u90E8\u7EF4\u5EA6",
            footRight: "\u5355\u4F4D\uFF1A\u5143 \xB7 \u4EC5\u8FDE\u63A5\u6709\u8BB0\u5F55\u7684\u6708\u4EFD",
            height: 220
          }));
          sections.push(h(
            "div",
            { key: "social", className: "wbsal-card wbsal-section" },
            h(
              "div",
              { className: "wbsal-section-head" },
              h("h3", null, "\u793E\u4FDD\u4E0E\u4E2A\u7A0E"),
              h(
                "div",
                { className: "wbsal-section-tools" },
                h("span", { className: "wbsal-section-note" }, "\u5E74\u5EA6\u5408\u8BA1 " + money(DEDUCT_TOTAL_ALL)),
                P.seriesSwitch(h, DEDUCT_SERIES, socialVisible, toggleIn(socialState, DEDUCT_SERIES), "\u793E\u4FDD\u4E0E\u4E2A\u7A0E\u6298\u7EBF\u663E\u793A\u5F00\u5173")
              )
            ),
            h("div", { className: "wbsal-social" }, F.SOCIAL_KEYS.concat(["incomeTax"]).map(function(key) {
              var amount2 = key === "incomeTax" ? yearTax : Number((data.social || {})[key]) || 0;
              var share = DEDUCT_TOTAL_ALL ? Math.round(amount2 / DEDUCT_TOTAL_ALL * 100) : 0;
              return h(
                "div",
                { key, className: "wbsal-social-item" },
                h("span", null, F.LABELS[key]),
                h("b", null, money(amount2)),
                h("em", null, "\u5360\u793E\u4FDD\u4E0E\u4E2A\u7A0E " + share + "%")
              );
            })),
            h("div", { className: "wbsal-linechart" }, h(ch.Trend, {
              data: recordedMonths,
              series: DEDUCT_SERIES.map(function(m) {
                return { key: m.key, label: m.label, className: m.tone, color: P.TONE_COLOR[m.tone] };
              }),
              lang: props.lang,
              height: 200,
              showLegend: false,
              visible: socialVisible,
              active: monthIndexOf(socialHoverState[0]),
              onHover: function(index) {
                socialHoverState[1](monthOfIndex(index));
              },
              format: money,
              label: function(row) {
                return F.monthLabel(row.period || year + "-" + String(row.month).padStart(2, "0"));
              },
              note: function(row) {
                return row.records + " \u7B14";
              },
              aria: "\u6708\u5EA6\u517B\u8001/\u533B\u7597/\u5931\u4E1A/\u516C\u79EF\u91D1/\u4E2A\u7A0E\u6298\u7EBF\u56FE",
              emptyText: "\u8FD8\u6CA1\u6709\u793E\u4FDD\u4E0E\u4E2A\u7A0E\u8BB0\u5F55"
            })),
            P.anyShown(DEDUCT_SERIES, socialVisible) ? null : h("div", { className: "wbsal-chart-hint" }, "\u6240\u6709\u7EBF\u90FD\u5173\u6389\u4E86\uFF0C\u70B9\u4E0A\u65B9\u300C\u517B\u8001 / \u533B\u7597 / \u5931\u4E1A / \u516C\u79EF\u91D1 / \u4E2A\u7A0E / \u5408\u8BA1\u300D\u4EFB\u610F\u4E00\u4E2A\u6062\u590D\u663E\u793A"),
            h(
              "div",
              { className: "wbsal-chart-foot" },
              h("span", null, "\u4E94\u6761\u5206\u9879\u7EBF + \u5408\u8BA1\u7EBF\u53EF\u5355\u72EC\u5F00\u5173 \xB7 \u5408\u8BA1\u4E3A\u4E94\u9879\u4E4B\u548C"),
              h("span", null, "\u5355\u4F4D\uFF1A\u5143 \xB7 " + basisLabel)
            )
          ));
          sections.push(P.trendCard({
            h,
            CH: ch,
            lang: props.lang,
            title: "\u540C\u6BD4\u5BF9\u7167",
            note: year + " \u5E74 vs " + (year - 1) + " \u5E74",
            series: YOY_SERIES,
            rows: yoyRows,
            visible: yoyVisibleState[0],
            onToggle: toggleIn(yoyVisibleState, YOY_SERIES),
            hover: yoyHoverState[0],
            onHover: yoyHoverState[1],
            fmt: money,
            label: function(row) {
              return row.month + " \u6708";
            },
            tipTitle: function(row) {
              return row.month + " \u6708 \xB7 " + amountLabel + "\u540C\u6BD4";
            },
            tipRows: function(row) {
              return [
                { key: "now", label: year + " \u5E74", tone: "s1", value: row.now },
                { key: "prior", label: year - 1 + " \u5E74", tone: "s2", value: row.prior }
              ];
            },
            tipNote: function(row) {
              return "\u4ECA\u5E74 " + row.count + " \u7B14 \xB7 \u53BB\u5E74 " + row.priorRecords + " \u7B14";
            },
            ariaLabel: "\u4ECA\u5E74\u4E0E\u53BB\u5E74\u540C\u6708\u5B9E\u53D1\u5BF9\u7167\u6298\u7EBF\u56FE",
            emptyText: "\u8FD9\u4E24\u5E74\u90FD\u8FD8\u6CA1\u6709\u5DE5\u8D44\u8BB0\u5F55",
            allOffHint: "\u4E24\u6761\u7EBF\u90FD\u5173\u6389\u4E86\uFF0C\u70B9\u4E0A\u65B9\u5E74\u4EFD\u6807\u7B7E\u6062\u590D\u663E\u793A",
            footLeft: "\u53BB\u5E74\u540C\u6708\u6309\u540C\u53E3\u5F84\u6C47\u603B \xB7 \u53EA\u753B\u4E24\u5E74\u91CC\u81F3\u5C11\u6709\u4E00\u7B14\u7684\u6708\u4EFD",
            footRight: "\u5355\u4F4D\uFF1A\u5143 \xB7 " + amountLabel,
            height: 200
          }));
          sections.push(h(
            "div",
            { key: "dist", className: "wbsal-card wbsal-section" },
            h(
              "div",
              { className: "wbsal-section-head" },
              h("h3", null, "\u5355\u7B14\u5B9E\u53D1\u5206\u5E03"),
              h("span", { className: "wbsal-section-note" }, "\u5171 " + data.records + " \u7B14")
            ),
            h(ch.Histogram, {
              data: (data.distribution || []).map(function(item) {
                return { key: item.key, label: item.label, count: item.count || 0 };
              }),
              lang: props.lang,
              aria: "\u5355\u7B14\u5B9E\u53D1\u91D1\u989D\u5206\u5E03\u76F4\u65B9\u56FE"
            }),
            h(
              "div",
              { className: "wbsal-chart-foot" },
              h("span", null, "\u6309\u5355\u7B14\u5B9E\u53D1\u91D1\u989D\u5206\u4E94\u6863\uFF0C\u6863\u4F4D\u56FA\u5B9A\u4FBF\u4E8E\u8DE8\u5E74\u5BF9\u6BD4"),
              h("span", null, "\u8BA1\u6570\u5355\u4F4D\uFF1A\u7B14")
            )
          ));
          if (latest && latestBreakdown) {
            sections.push(h(
              "div",
              { key: "comp", className: "wbsal-card wbsal-section" },
              h(
                "div",
                { className: "wbsal-section-head" },
                h("h3", null, F.monthLabel(latest.period) + " \u6536\u5165\u4E0E\u6263\u6B3E\u6784\u6210"),
                h("span", { className: "wbsal-section-note" }, "\u5171 " + latest.records + " \u7B14")
              ),
              h(
                "div",
                { className: "wbsal-comp-grid" },
                h(
                  "div",
                  null,
                  h("div", { className: "wbsal-group-title" }, "\u6536\u5165\u9879 \xB7 \u5408\u8BA1 " + money(latestBreakdown.income)),
                  P.compRows(h, F, latestBreakdown.fields, F.INCOME_KEYS, latestBreakdown.income, false)
                ),
                h(
                  "div",
                  null,
                  h("div", { className: "wbsal-group-title" }, "\u6263\u6B3E\u9879 \xB7 \u5408\u8BA1 " + money(deductionTotal)),
                  P.compRows(h, F, latestBreakdown.fields, F.PRETAX_KEYS.concat(F.SOCIAL_KEYS, F.TAX_KEYS), deductionTotal, true)
                )
              )
            ));
          }
        } else {
          sections.push(h(
            "div",
            { key: "empty", className: "wbsal-card wbsal-empty" },
            h("strong", null, year + " \u5E74\u8FD8\u6CA1\u6709\u5DE5\u8D44\u8BB0\u5F55"),
            h("span", null, "\u4E0A\u9762\u4E24\u5F20\u8DE8\u5E74\u5EA6\u8D8B\u52BF\u4ECD\u6309\u5168\u90E8\u5386\u53F2\u6570\u636E\u5C55\u793A\uFF1B\u6362\u4E00\u4E2A\u5E74\u4EFD\u6216\u5148\u8BB0\u4E00\u7B14\u5DE5\u8D44\u3002")
          ));
        }
        body = h("div", { className: "wbsal-stack" }, sections);
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
              { className: "wbsal-metric", role: "group", "aria-label": "\u5DE5\u8D44\u5F52\u6708\u53E3\u5F84" },
              [["arrival", "\u6309\u5230\u8D26\u6708"], ["income", "\u6309\u6240\u5C5E\u6708"]].map(function(option) {
                return h("button", {
                  key: option[0],
                  type: "button",
                  "aria-pressed": basis === option[0],
                  className: basis === option[0] ? "on" : "",
                  onClick: function() {
                    setBasis(option[0]);
                    hoverState[1](null);
                    socialHoverState[1](null);
                  }
                }, option[1]);
              })
            ),
            P.segGroup(h, [["net", "\u5B9E\u53D1"], ["gross", "\u5E94\u53D1"]], amount, setAmount, "\u8D8B\u52BF\u91D1\u989D\u53E3\u5F84"),
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
        basis === "income" && data && data.year === year && data.basis === basis && data.unassignedRecords > 0 ? h(C.Notice, { h, text: "\u5168\u90E8\u5E74\u4EFD\u5171 " + data.unassignedRecords + " \u7B14\u5DE5\u8D44\u672A\u586B\u5199\u6240\u5C5E\u671F\uFF0C\u672A\u8BA1\u5165\u6240\u5C5E\u6708\u7EDF\u8BA1\u3002" }) : null,
        data && (data.year !== year || data.basis !== basis) ? null : body,
        load.error ? h(C.Notice, { h, kind: "error", text: load.error }) : null
      );
    };
  }
});

// packages/addons/salary/client/views/records.cjs
var require_records = __commonJS({
  "packages/addons/salary/client/views/records.cjs"(exports2, module2) {
    "use strict";
    var staged = require_staged_dialog();
    var salaryCommon = require_common();
    var NF = require_number_field();
    var FormDialog = staged.createStagedDialog({
      maskClass: "wbsal-mask",
      dialogClass: "wbsal-modal",
      displayName: "SalaryFormDialog",
      ariaLabelOf: function(props) {
        return props["aria-label"] || props.title;
      },
      header: function(props) {
        var h = props.h;
        var C = salaryCommon;
        return h(
          "div",
          { className: "wbsal-form-head" },
          h(
            "div",
            null,
            h("div", { className: "wbsal-eyebrow" }, props.eyebrow || ""),
            h("h3", null, props.title)
          ),
          h(
            C.Btn,
            { h, kind: "ghost", onClick: props.onClose, disabled: !!props.submitting },
            "\u5173\u95ED"
          )
        );
      },
      closeOnEscape: function(props) {
        return !props.submitting;
      },
      closeOnMask: function(props) {
        return !props.submitting;
      }
    });
    module2.exports = function Records(props) {
      var h = props.h, React = props.React, api = props.api, lang = props.lang;
      var C = require_common();
      var DP = require_date_picker();
      var F = require_fields();
      var status = C.useLoad(React, api, "salary.status", {}, []);
      var filterState = React.useState({ year: String((/* @__PURE__ */ new Date()).getFullYear()), cycle: "", employmentType: "" });
      var filter = filterState[0], setFilter = filterState[1];
      var list = C.useLoad(React, api, "salary.recordList", {
        year: filter.year ? Number(filter.year) : void 0,
        cycle: filter.cycle || void 0,
        employmentType: filter.employmentType || void 0,
        limit: 400
      }, [filter.year, filter.cycle, filter.employmentType]);
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
      var badState = React.useState({});
      var badKeys = badState[0], setBadKeys = badState[1];
      var moneyInvalid = Object.keys(badKeys).length > 0;
      var modalOpen = !!form;
      React.useEffect(function() {
        if (!modalOpen || typeof document === "undefined" || typeof document.addEventListener !== "function" || !document.body) return void 0;
        var previous = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return function() {
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
        setBadKeys({});
        var payDate = pickDate("monthly");
        setForm({ mode: "create", id: "", payDate, incomePeriod: defaultPeriod(payDate, "monthly"), cycle: "monthly", employmentType: "", note: F.defaultNote(payDate, "monthly"), values: F.blankValues(), lockGross: false });
      }
      function openEdit(item) {
        var values = F.blankValues();
        F.KEYS.forEach(function(key) {
          values[key] = key === "grossPay" || key === "netPay" ? F.fmtAmount(item[key]) : item[key] ? F.fmtAmount(item[key]) : "";
        });
        var incomeZero = F.INCOME_KEYS.every(function(key) {
          return !F.num(item[key]);
        });
        setBadKeys({});
        setConfirmId("");
        setOpenId("");
        setMsg(null);
        setForm({ mode: "edit", id: item.id, payDate: item.payDate, incomePeriod: item.incomePeriod || "", cycle: item.cycle || "monthly", employmentType: item.employmentType || "", note: item.note || "", values, original: item, lockGross: incomeZero && F.num(item.grossPay) > 0 });
      }
      function defaultPeriod(payDate, cycle) {
        return cycle === "daily" ? payDate : payDate === "" || payDate.startsWith("2000-01-") ? "" : F.incomePeriod(payDate);
      }
      function closeForm() {
        setForm(null);
        setMsg(null);
        setBadKeys({});
      }
      function setField(key, value) {
        setForm(function(prev) {
          var next = Object.assign({}, prev);
          next[key] = value;
          if (key === "incomePeriod") next.periodTouched = true;
          if (key === "note") next.noteTouched = true;
          if (prev.mode === "create" && (key === "payDate" || key === "cycle")) {
            if (!prev.periodTouched) next.incomePeriod = defaultPeriod(next.payDate, next.cycle);
            else if (key === "cycle" && next.cycle !== prev.cycle && prev.incomePeriod) {
              next.incomePeriod = next.cycle === "monthly" ? prev.incomePeriod.slice(0, 7) : "";
            }
          }
          if (prev.mode === "create" && !next.noteTouched) {
            next.note = next.cycle === "monthly" && next.incomePeriod ? F.monthLabel(next.incomePeriod.slice(0, 7)) + "\u5DE5\u8D44" : "";
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
      function markAmount(key, ok) {
        setBadKeys(function(prev) {
          var known = !!prev[key];
          if (known === !ok) return prev;
          var next = Object.assign({}, prev);
          if (ok) delete next[key];
          else next[key] = true;
          return next;
        });
      }
      function firstBadAmount() {
        var keys = F.KEYS;
        for (var i = 0; i < keys.length; i += 1) {
          var check = NF.validateNumber(form.values[keys[i]], amountRules(keys[i]));
          if (!check.ok) return { key: keys[i], error: check.error };
        }
        return null;
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
        var bad = firstBadAmount();
        if (bad) {
          setMsg({ kind: "error", text: F.LABELS[bad.key] + "\uFF1A" + bad.error });
          return;
        }
        var computed = F.totals(form.values);
        var payload = {
          payDate: form.payDate,
          cycle: form.cycle,
          incomePeriod: form.incomePeriod || "",
          employmentType: form.employmentType || "",
          note: form.note || ""
        };
        var moneyChanged = !form.original || F.KEYS.some(function(key) {
          return F.num(form.values[key]) !== F.num(form.original[key]);
        });
        if (moneyChanged) F.KEYS.forEach(function(key) {
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
      function amountRules(key) {
        return { min: key === "performanceBonus" ? void 0 : 0, step: 0.01, allowEmpty: true, lang };
      }
      function amountInput(key, disabled) {
        return h(NF.NumberField, {
          h,
          lang,
          wide: true,
          className: "wbsal-amount",
          value: form.values[key],
          disabled,
          hint: false,
          min: amountRules(key).min,
          step: 0.01,
          allowEmpty: true,
          ariaLabel: F.LABELS[key],
          onDraft: function(raw) {
            setValue(key, raw);
            markAmount(key, NF.validateNumber(raw, amountRules(key)).ok);
          },
          onCommit: function(next) {
            setValue(key, next === null ? "" : String(next));
            markAmount(key, true);
          }
        });
      }
      function renderModal() {
        var label = form.mode === "edit" ? "\u7F16\u8F91\u5DE5\u8D44" : "\u8BB0\u4E00\u7B14\u5DE5\u8D44";
        var computed = F.totals(form.values);
        var lockedGross = form.lockGross;
        var sameDayCount = items.filter(function(item) {
          return item.payDate === form.payDate && item.id !== form.id;
        }).length;
        function groupsBlock(hh, groups2) {
          return hh("div", { className: "wbsal-steps-groups" }, groups2.map(function(group) {
            return hh(
              "div",
              { key: group.id, className: "wbsal-form-group" },
              hh(
                "div",
                { className: "wbsal-group-head" },
                hh("div", { className: "wbsal-group-title" }, group.title),
                hh("span", null, group.hint)
              ),
              hh("div", { className: "wbsal-form-grid" }, group.keys.map(function(key) {
                return hh(C.Field, { key, h: hh, label: F.LABELS[key] }, amountInput(key, false));
              }))
            );
          }));
        }
        return h(FormDialog, {
          h,
          React,
          title: label,
          eyebrow: form.mode === "edit" ? "EDIT RECORD" : "NEW RECORD",
          // 测试按步渲染校验金额控件，正常打开仍从第一步开始。
          initialStep: props.initialStep,
          submitting: saving,
          error: msg && msg.kind === "error" ? msg.text : "",
          onClose: saving ? null : closeForm,
          onSubmit: submit,
          submitText: form.mode === "edit" ? "\u4FDD\u5B58\u4FEE\u6539" : "\u4FDD\u5B58",
          cancelText: "\u53D6\u6D88",
          nextText: "\u4E0B\u4E00\u6B65",
          backText: "\u4E0A\u4E00\u6B65",
          steps: [
            {
              key: "basic",
              label: "\u57FA\u7840\u4FE1\u606F",
              hint: "\u65E5\u671F\u4E0E\u5F52\u5C5E",
              render: function(hh) {
                return hh(
                  "div",
                  { className: "wbsal-form-meta" },
                  hh(
                    C.Field,
                    { h: hh, label: "\u5230\u8D26\u65E5" },
                    hh(DP.DatePicker, { React, h: hh, prefix: "wbsal", lang, label: "\u5230\u8D26\u65E5", value: form.payDate, onChange: function(next) {
                      setField("payDate", next);
                    } })
                  ),
                  hh(
                    C.Field,
                    { h: hh, label: "\u7ED3\u7B97\u65B9\u5F0F" },
                    hh(
                      "select",
                      { className: "wbsal-input", value: form.cycle, onChange: function(e) {
                        setField("cycle", e.target.value);
                      } },
                      hh("option", { value: "monthly" }, "\u6708\u7ED3"),
                      hh("option", { value: "daily" }, "\u65E5\u7ED3")
                    )
                  ),
                  hh(
                    C.Field,
                    { h: hh, label: "\u7528\u5DE5\u7C7B\u578B" },
                    hh(
                      "select",
                      { className: "wbsal-input", value: form.employmentType, onChange: function(e) {
                        setField("employmentType", e.target.value);
                      } },
                      F.EMPLOYMENT_TYPES.map(function(t) {
                        return hh("option", { key: t.value || "none", value: t.value }, t.label);
                      })
                    )
                  ),
                  hh(
                    C.Field,
                    { h: hh, label: "\u5DE5\u8D44\u6240\u5C5E\u671F" },
                    hh((form.incomePeriod ? form.incomePeriod.length === 10 : form.cycle === "daily") ? DP.DatePicker : DP.MonthPicker, {
                      React,
                      h: hh,
                      prefix: "wbsal",
                      lang,
                      label: "\u5DE5\u8D44\u6240\u5C5E\u671F",
                      placeholder: "\u672A\u5F52\u5C5E",
                      value: form.incomePeriod || "",
                      onChange: function(next) {
                        setField("incomePeriod", next);
                      }
                    })
                  ),
                  hh(
                    C.Field,
                    { h: hh, label: "\u5907\u6CE8" },
                    hh("input", { className: "wbsal-input", value: form.note, onChange: function(e) {
                      setField("note", e.target.value);
                    } })
                  )
                );
              }
            },
            {
              key: "amount",
              label: "\u91D1\u989D\u660E\u7EC6",
              hint: "\u6309\u5206\u7EC4\u586B\u6536\u5165\u4E0E\u6263\u6B3E",
              render: function(hh) {
                return groupsBlock(hh, F.GROUPS);
              },
              validate: function() {
                var bad = firstBadAmount();
                return bad ? F.LABELS[bad.key] + "\uFF1A" + bad.error : "";
              }
            },
            {
              key: "summary",
              label: "\u6C47\u603B\u786E\u8BA4",
              hint: "\u9ED8\u8BA4\u6309\u660E\u7EC6\u5B9E\u65F6\u8BA1\u7B97",
              render: function(hh) {
                return hh(
                  "div",
                  { className: "wbsal-steps-groups" },
                  hh(
                    "div",
                    { className: "wbsal-form-group" },
                    hh(
                      "div",
                      { className: "wbsal-group-head" },
                      hh("div", { className: "wbsal-group-title" }, "\u6C47\u603B"),
                      hh("span", null, "\u9ED8\u8BA4\u6309\u660E\u7EC6\u5B9E\u65F6\u8BA1\u7B97\uFF0C\u4E5F\u53EF\u4EE5\u76F4\u63A5\u6539")
                    ),
                    hh(
                      "div",
                      { className: "wbsal-form-grid" },
                      hh(C.Field, { h: hh, label: "\u5E94\u53D1\u7A0E\u524D\u5DE5\u8D44" }, amountInput("grossPay", lockedGross)),
                      hh(C.Field, { h: hh, label: "\u5B9E\u53D1\u5DE5\u8D44" }, amountInput("netPay", false))
                    )
                  ),
                  sameDayCount > 0 ? hh(C.Notice, { h: hh, text: "\u8BE5\u65E5\u5DF2\u6709 " + sameDayCount + " \u7B14\u8BB0\u5F55\uFF1B\u4FDD\u5B58\u4F1A\u65B0\u589E\u4E00\u6761\uFF0C\u4E0D\u4F1A\u8986\u76D6\u3002" }) : null,
                  hh(
                    "div",
                    { className: "wbsal-summary" },
                    hh("div", null, hh("span", null, "\u6536\u5165\u5408\u8BA1"), hh("b", null, F.money(computed.income))),
                    hh("div", null, hh("span", null, "\u7A0E\u524D\u6263\u6B3E"), hh("b", null, F.money(computed.preTax))),
                    hh("div", null, hh("span", null, "\u793E\u4FDD\u516C\u79EF\u91D1"), hh("b", null, F.money(computed.social))),
                    hh("div", null, hh("span", null, "\u4E2A\u7A0E+\u7A0E\u540E"), hh("b", null, F.money(computed.tax))),
                    hh("div", null, hh("span", null, "\u5E94\u53D1"), hh("b", null, F.money(F.num(form.values.grossPay)))),
                    hh("div", null, hh("span", null, "\u5B9E\u53D1"), hh("b", null, F.money(F.num(form.values.netPay)))),
                    lockedGross ? hh(
                      "div",
                      { className: "wbsal-lock" },
                      hh("span", { className: "wbsal-muted" }, "\u8FD9\u6761\u5386\u53F2\u8BB0\u5F55\u53EA\u6709\u6C47\u603B\u503C\uFF0C\u5E94\u53D1\u5DF2\u9501\u5B9A\uFF0C\u907F\u514D\u88AB\u660E\u7EC6\u91CD\u7B97\u6E05\u96F6\u3002"),
                      hh(C.Btn, { h: hh, onClick: recalcFromDetail }, "\u6309\u660E\u7EC6\u91CD\u7B97")
                    ) : null
                  )
                );
              }
            }
          ]
        });
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
              "\u7528\u5DE5\u7C7B\u578B\uFF1A" + F.employmentLabel(item.employmentType) + " \xB7 \u7ED3\u7B97\u65B9\u5F0F\uFF1A" + (item.cycle === "daily" ? "\u65E5\u7ED3" : "\u6708\u7ED3") + " \xB7 \u5DE5\u8D44\u6240\u5C5E\u671F\uFF1A" + (item.incomePeriod ? F.monthLabel(item.incomePeriod) : "\u672A\u5F52\u5C5E") + " \xB7 " + (item.note ? "\u5907\u6CE8\uFF1A" + item.note + " \xB7 " : "") + "\u66F4\u65B0\u4E8E " + C.fmtTime(item.updatedAt, lang)
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
            h(
              "td",
              { className: "left" },
              h(C.Pill, { h, kind: item.cycle === "daily" ? "warn" : "ok" }, item.cycle === "daily" ? "\u65E5\u7ED3" : "\u6708\u7ED3"),
              h("div", { className: "wbsal-muted" }, item.incomePeriod ? F.monthLabel(item.incomePeriod) : "\u672A\u5F52\u5C5E")
            ),
            h("td", { className: "left" }, h(C.Pill, { h, kind: item.employmentType === "regular" ? "ok" : item.employmentType === "probation" ? "warn" : "" }, F.employmentLabel(item.employmentType))),
            h("td", null, h("span", { className: "wbsal-net" }, F.money(item.netPay))),
            h("td", { className: "wbsal-opt" }, F.money(item.grossPay)),
            h("td", { className: "wbsal-opt hide-md" }, F.money(F.sumValues(item, F.SOCIAL_KEYS))),
            h("td", { className: "wbsal-opt hide-md" }, F.money(item.incomeTax)),
            h("td", null, h("span", { className: "wbsal-caret" }, "\u203A"))
          ),
          expanded ? h("tr", { key: item.id + "-detail" }, h("td", { className: "wbsal-detail-cell", colSpan: 8 }, renderDetail(item))) : null
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
          h("div", null, filter.year || filter.cycle || filter.employmentType ? "\u8FD9\u4E2A\u7B5B\u9009\u6761\u4EF6\u4E0B\u6CA1\u6709\u8BB0\u5F55" : "\u8FD8\u6CA1\u6709\u5DE5\u8D44\u8BB0\u5F55\uFF0C\u5148\u8BB0\u4E00\u7B14"),
          h(
            "div",
            { className: "wbsal-empty-actions" },
            filter.year || filter.cycle || filter.employmentType ? h(C.Btn, { h, onClick: function() {
              setFilter({ year: "", cycle: "", employmentType: "" });
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
                  h("th", { className: "left" }, "\u7ED3\u7B97"),
                  h("th", { className: "left" }, "\u7528\u5DE5\u7C7B\u578B"),
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
          h(C.Field, { h, label: "\u7ED3\u7B97\u65B9\u5F0F" }, h(
            "select",
            { className: "wbsal-input", value: filter.cycle, onChange: function(e) {
              setFilter(Object.assign({}, filter, { cycle: e.target.value }));
            } },
            h("option", { value: "" }, "\u5168\u90E8"),
            h("option", { value: "monthly" }, "\u6708\u7ED3"),
            h("option", { value: "daily" }, "\u65E5\u7ED3")
          )),
          h(C.Field, { h, label: "\u7528\u5DE5\u7C7B\u578B" }, h(
            "select",
            { className: "wbsal-input", value: filter.employmentType, onChange: function(e) {
              setFilter(Object.assign({}, filter, { employmentType: e.target.value }));
            } },
            h("option", { value: "" }, "\u5168\u90E8"),
            F.EMPLOYMENT_TYPES.slice(1).map(function(t) {
              return h("option", { key: t.value, value: t.value }, t.label);
            })
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
        "." + P + "-jump .wbctl-num-input{width:56px;padding:4px 7px;font-size:11.5px;text-align:right}",
        "." + P + "-jump .wbctl-num-hint{display:none}",
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
      ].concat(require_switch().styles).concat(require_number_field().styles).join("\n");
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
    var NF = require_number_field();
    var h = React.createElement;
    var COPY = require_data_copy();
    var SW = require_switch();
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
            h(NF.NumberField, {
              h,
              lang,
              className: P + "-jump",
              value: page,
              min: 1,
              max: pages,
              integer: true,
              ariaLabel: t.jump,
              hint: false,
              onCommit: function(next) {
                if (next !== null) setPage(next);
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
                h(SW.Switch, {
                  h,
                  checked: includeDeleted,
                  label: t.includeDeleted,
                  onChange: function(next) {
                    setIncludeDeleted(next);
                    setPage(1);
                  }
                }),
                h(SW.Switch, {
                  h,
                  checked: showSystem,
                  label: t.showSystem,
                  onChange: function(next) {
                    setShowSystem(next);
                  }
                }),
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
        "." + P + "-origins{display:inline-flex;align-items:center;gap:10px;flex-wrap:wrap;justify-content:flex-end}",
        "." + P + "-origins-label{font-size:11px;color:var(--wb-muted);white-space:nowrap}",
        "." + P + "-origin{display:inline-flex;align-items:center;gap:4px;font-size:11.5px;color:var(--wb-muted);cursor:pointer;user-select:none}",
        // 该 action 本身不支持的来源：整项置灰、不可点，示意「不是没开，是开不了」。
        "." + P + "-origin-off{opacity:.55;cursor:not-allowed}",
        "." + P + "-origin input[type=checkbox]{width:13px;height:13px;margin:0;accent-color:var(--wb-accent);cursor:inherit}",
        "." + P + "-origin input[type=checkbox]:focus-visible{outline:2px solid var(--wb-accent);outline-offset:2px}",
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
        switchHint: "\u5141\u8BB8\u6765\u6E90\u843D\u672C\u673A\u3001\u5373\u6539\u5373\u751F\u6548\uFF1A\u52FE\u4E0A\u7684\u6765\u6E90\u624D\u80FD\u8C03\u7528\u8BE5 action\uFF0C\u5176\u4F59\u4F1A\u88AB ACTION_ORIGIN_DENIED \u62E6\u4E0B\u3002",
        hostHint: "\u5BBF\u4E3B action \u7684\u5141\u8BB8\u6765\u6E90\uFF1B\u6807\u300C\u6765\u6E90\u56FA\u5B9A\u300D\u7684\u4E0D\u53EF\u4FEE\u6539\u3002",
        originsLabel: "\u5141\u8BB8\u6765\u6E90",
        originUi: "\u754C\u9762",
        originPlugin: "\u63D2\u4EF6",
        originAgent: "agent",
        originSync: "\u540C\u6B65",
        originsSaving: "\u4FDD\u5B58\u4E2D\u2026",
        originsToast: "\u5DF2\u66F4\u65B0\u5141\u8BB8\u6765\u6E90",
        originsFail: "\u66F4\u65B0\u5141\u8BB8\u6765\u6E90\u5931\u8D25",
        originsEmpty: "\u81F3\u5C11\u8981\u4FDD\u7559\u4E00\u4E2A\u6765\u6E90",
        originsUnsupported: "\u8BE5 action \u672C\u8EAB\u4E0D\u652F\u6301\u8FD9\u4E2A\u6765\u6E90",
        originsPinned: "\u6765\u6E90\u56FA\u5B9A",
        originsPinnedHint: "\u8BE5 action \u7684\u5141\u8BB8\u6765\u6E90\u88AB\u56FA\u5B9A\uFF08\u5B89\u5168\u7EA6\u675F\uFF09\uFF0C\u4E0D\u80FD\u4FEE\u6539",
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
        filterOrigin: "\u5141\u8BB8\u6765\u6E90",
        allOrigins: "\u5168\u90E8\u6765\u6E90",
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
        switchHint: "Allowed origins are stored locally and apply immediately: only checked origins may call the action; others get ACTION_ORIGIN_DENIED.",
        hostHint: "Allowed origins for host actions; items marked pinned cannot be changed.",
        originsLabel: "Origins",
        originUi: "UI",
        originPlugin: "Plugin",
        originAgent: "Agent",
        originSync: "Sync",
        originsSaving: "Saving\u2026",
        originsToast: "Allowed origins updated",
        originsFail: "Failed to update allowed origins",
        originsEmpty: "Keep at least one origin",
        originsUnsupported: "This action does not support this origin",
        originsPinned: "Pinned",
        originsPinnedHint: "Allowed origins are pinned for this action (security constraint) and cannot be changed",
        originsDefaultOn: "Allowed by default",
        originsDefaultOff: "Off by default, can be enabled",
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
        filterOrigin: "Origins",
        allOrigins: "All origins",
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
        var originFilterState = React.useState("");
        var originPick = originFilterState[0], setOriginPick = originFilterState[1];
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
        var ORIGINS = ["ui", "plugin", "agent", "sync"];
        var originText = { ui: t.originUi, plugin: t.originPlugin, agent: t.originAgent, sync: t.originSync };
        function setOrigins(action, origin) {
          var name = action.name;
          var current = Array.isArray(action.origins) ? action.origins.slice() : [];
          var index = current.indexOf(origin);
          var next = index >= 0 ? current.filter(function(o) {
            return o !== origin;
          }) : current.concat([origin]);
          if (next.length === 0) {
            setToast(t.originsEmpty);
            return;
          }
          next = ORIGINS.filter(function(o) {
            return next.indexOf(o) >= 0;
          });
          setSaving(name);
          setToast("");
          var fail = function(e) {
            setSaving("");
            setToast(t.originsFail + "\uFF1A" + String(e && e.message || e || ""));
          };
          var done = function(r) {
            setSaving("");
            var payload = r && typeof r === "object" && Object.prototype.hasOwnProperty.call(r, "result") ? r.result : r;
            if (r && r.ok === false) {
              setToast(t.originsFail + "\uFF1A" + String(r.error || r.text || ""));
              return;
            }
            var value = payload && Array.isArray(payload.origins) ? payload.origins : next;
            var source = payload && typeof payload.source === "string" ? payload.source : action.originsSource;
            setSnap(function(prev) {
              if (!prev || !Array.isArray(prev.actions)) return prev;
              return Object.assign({}, prev, {
                actions: prev.actions.map(function(a) {
                  if (!a || a.name !== name) return a;
                  return Object.assign({}, a, { origins: value, originsSource: source });
                })
              });
            });
            setToast(t.originsToast);
          };
          if (!api || typeof api.call !== "function") {
            fail(new Error("no call api"));
            return;
          }
          Promise.resolve(api.call("actions.setActionOrigins", { action: name, origins: next })).then(done, fail);
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
          if (originPick && (!Array.isArray(a.origins) || a.origins.indexOf(originPick) < 0)) return false;
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
        function originsChips(action) {
          if (!Array.isArray(action.origins)) return null;
          if (action.originsSource === "invalid") {
            return h("span", { className: P + "-badge " + P + "-locked", title: t.originsPinnedHint, "data-origins-invalid": action.name }, t.originsPinned);
          }
          var busy = saving === action.name;
          var pinned = action.name === "actions.setActionOrigins";
          var supported = Array.isArray(action.originsDeclared) ? action.originsDeclared : action.origins;
          return h(
            "div",
            { className: P + "-origins", "data-origins-row": action.name },
            h("span", { className: P + "-origins-label" }, t.originsLabel),
            ORIGINS.map(function(origin) {
              var on = action.origins.indexOf(origin) >= 0;
              var allowed = supported.indexOf(origin) >= 0;
              var preset = Array.isArray(action.originsDefault) ? action.originsDefault : supported;
              var byDefault = preset.indexOf(origin) >= 0;
              return h(
                "label",
                {
                  key: origin,
                  className: P + "-origin" + (allowed ? "" : " " + P + "-origin-off"),
                  title: pinned ? t.originsPinnedHint : !allowed ? t.originsUnsupported : originText[origin] + " \xB7 " + action.name + " \xB7 " + (byDefault ? t.originsDefaultOn : t.originsDefaultOff)
                },
                h("input", {
                  type: "checkbox",
                  checked: on,
                  disabled: busy || pinned || !allowed,
                  "data-origin": origin,
                  "data-origin-row": action.name,
                  "data-origin-supported": allowed ? "1" : "0",
                  onChange: function() {
                    setOrigins(action, origin);
                  }
                }),
                h("span", null, originText[origin])
              );
            }),
            busy ? h("span", { className: P + "-origins-label" }, t.originsSaving) : null
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
              originsChips(action)
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
            ),
            h(
              "label",
              { className: P + "-none" },
              t.filterOrigin + " ",
              h(
                "select",
                { value: originPick, "aria-label": t.filterOrigin, "data-origin-filter": "", onChange: function(e) {
                  setOriginPick(e.target.value);
                } },
                h("option", { value: "" }, t.allOrigins),
                ORIGINS.map(function(origin) {
                  return h("option", { value: origin, key: origin }, originText[origin]);
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
var GLYPHS = require_icons2().ICONS;
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
    records: GLYPHS["wallet"],
    stats: GLYPHS["chart-column"],
    data: GLYPHS["database"],
    actions: GLYPHS["list"]
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
    version: "0.4.5",
    icon: GLYPHS["wallet"],
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
