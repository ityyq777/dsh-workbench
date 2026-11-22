// 由 scripts/build-addon-clients.mjs 生成；请修改对应 client/client.src.cjs 后重新构建。
window.__ModuleLoader__ = window.__ModuleLoader__ || { modules: {}, load: function (m) { this.modules[m.id] = m.factory; } };
window.__ModuleLoader__.load({
  id: "dsh-workbench-danmaku",
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

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/arrow-down.mjs
var arrow_down_exports = {};
__export(arrow_down_exports, {
  __iconData: () => __iconData,
  default: () => ArrowDown
});
var __iconData, ArrowDown;
var init_arrow_down = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/arrow-down.mjs"() {
    init_createLucideIcon();
    __iconData = {
      name: "arrow-down",
      size: 24,
      node: [
        ["path", { d: "M12 5v14", key: "s699le" }],
        ["path", { d: "m19 12-7 7-7-7", key: "1idqje" }]
      ]
    };
    __iconData.node;
    ArrowDown = createLucideIcon(__iconData);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/arrow-up.mjs
var arrow_up_exports = {};
__export(arrow_up_exports, {
  __iconData: () => __iconData2,
  default: () => ArrowUp
});
var __iconData2, ArrowUp;
var init_arrow_up = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/arrow-up.mjs"() {
    init_createLucideIcon();
    __iconData2 = {
      name: "arrow-up",
      size: 24,
      node: [
        ["path", { d: "m5 12 7-7 7 7", key: "hav0vg" }],
        ["path", { d: "M12 19V5", key: "x0mq9r" }]
      ]
    };
    __iconData2.node;
    ArrowUp = createLucideIcon(__iconData2);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/check.mjs
var check_exports = {};
__export(check_exports, {
  __iconData: () => __iconData3,
  default: () => Check
});
var __iconData3, Check;
var init_check = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/check.mjs"() {
    init_createLucideIcon();
    __iconData3 = {
      name: "check",
      size: 24,
      node: [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]]
    };
    __iconData3.node;
    Check = createLucideIcon(__iconData3);
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

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/eye.mjs
var eye_exports = {};
__export(eye_exports, {
  __iconData: () => __iconData5,
  default: () => Eye
});
var __iconData5, Eye;
var init_eye = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/eye.mjs"() {
    init_createLucideIcon();
    __iconData5 = {
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
    __iconData5.node;
    Eye = createLucideIcon(__iconData5);
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

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/megaphone.mjs
var megaphone_exports = {};
__export(megaphone_exports, {
  __iconData: () => __iconData7,
  default: () => Megaphone
});
var __iconData7, Megaphone;
var init_megaphone = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/megaphone.mjs"() {
    init_createLucideIcon();
    __iconData7 = {
      name: "megaphone",
      size: 24,
      node: [
        [
          "path",
          {
            d: "M11 6a13 13 0 0 0 8.4-2.8A1 1 0 0 1 21 4v12a1 1 0 0 1-1.6.8A13 13 0 0 0 11 14H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z",
            key: "q8bfy3"
          }
        ],
        ["path", { d: "M6 14a12 12 0 0 0 2.4 7.2 2 2 0 0 0 3.2-2.4A8 8 0 0 1 10 14", key: "1853fq" }],
        ["path", { d: "M8 6v8", key: "15ugcq" }]
      ]
    };
    __iconData7.node;
    Megaphone = createLucideIcon(__iconData7);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/monitor.mjs
var monitor_exports = {};
__export(monitor_exports, {
  __iconData: () => __iconData8,
  default: () => Monitor
});
var __iconData8, Monitor;
var init_monitor = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/monitor.mjs"() {
    init_createLucideIcon();
    __iconData8 = {
      name: "monitor",
      size: 24,
      node: [
        ["rect", { width: "20", height: "14", x: "2", y: "3", rx: "2", key: "48i651" }],
        ["line", { x1: "8", x2: "16", y1: "21", y2: "21", key: "1svkeh" }],
        ["line", { x1: "12", x2: "12", y1: "17", y2: "21", key: "vw1qmm" }]
      ]
    };
    __iconData8.node;
    Monitor = createLucideIcon(__iconData8);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/pencil.mjs
var pencil_exports = {};
__export(pencil_exports, {
  __iconData: () => __iconData9,
  default: () => Pencil
});
var __iconData9, Pencil;
var init_pencil = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/pencil.mjs"() {
    init_createLucideIcon();
    __iconData9 = {
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
    __iconData9.node;
    Pencil = createLucideIcon(__iconData9);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/play.mjs
var play_exports = {};
__export(play_exports, {
  __iconData: () => __iconData10,
  default: () => Play
});
var __iconData10, Play;
var init_play = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/play.mjs"() {
    init_createLucideIcon();
    __iconData10 = {
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
    __iconData10.node;
    Play = createLucideIcon(__iconData10);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/plus.mjs
var plus_exports = {};
__export(plus_exports, {
  __iconData: () => __iconData11,
  default: () => Plus
});
var __iconData11, Plus;
var init_plus = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/plus.mjs"() {
    init_createLucideIcon();
    __iconData11 = {
      name: "plus",
      size: 24,
      node: [
        ["path", { d: "M5 12h14", key: "1ays0h" }],
        ["path", { d: "M12 5v14", key: "s699le" }]
      ]
    };
    __iconData11.node;
    Plus = createLucideIcon(__iconData11);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/power.mjs
var power_exports = {};
__export(power_exports, {
  __iconData: () => __iconData12,
  default: () => Power
});
var __iconData12, Power;
var init_power = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/power.mjs"() {
    init_createLucideIcon();
    __iconData12 = {
      name: "power",
      size: 24,
      node: [
        ["path", { d: "M12 2v10", key: "mnfbl" }],
        ["path", { d: "M18.4 6.6a9 9 0 1 1-12.77.04", key: "obofu9" }]
      ]
    };
    __iconData12.node;
    Power = createLucideIcon(__iconData12);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/refresh-cw.mjs
var refresh_cw_exports = {};
__export(refresh_cw_exports, {
  __iconData: () => __iconData13,
  default: () => RefreshCw
});
var __iconData13, RefreshCw;
var init_refresh_cw = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/refresh-cw.mjs"() {
    init_createLucideIcon();
    __iconData13 = {
      name: "refresh-cw",
      size: 24,
      node: [
        ["path", { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8", key: "v9h5vc" }],
        ["path", { d: "M21 3v5h-5", key: "1q7to0" }],
        ["path", { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16", key: "3uifl3" }],
        ["path", { d: "M8 16H3v5", key: "1cv678" }]
      ]
    };
    __iconData13.node;
    RefreshCw = createLucideIcon(__iconData13);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/settings.mjs
var settings_exports = {};
__export(settings_exports, {
  __iconData: () => __iconData14,
  default: () => Settings
});
var __iconData14, Settings;
var init_settings = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/settings.mjs"() {
    init_createLucideIcon();
    __iconData14 = {
      name: "settings",
      size: 24,
      node: [
        [
          "path",
          {
            d: "M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",
            key: "1i5ecw"
          }
        ],
        ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
      ]
    };
    __iconData14.node;
    Settings = createLucideIcon(__iconData14);
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

// packages/addons/danmaku/client/ui/icons.cjs
var require_icons2 = __commonJS({
  "packages/addons/danmaku/client/ui/icons.cjs"(exports2, module2) {
    "use strict";
    var icons2 = require_icons();
    var set = icons2.create("wbdm", {
      "arrow-down": (init_arrow_down(), __toCommonJS(arrow_down_exports)).default,
      "arrow-up": (init_arrow_up(), __toCommonJS(arrow_up_exports)).default,
      "check": (init_check(), __toCommonJS(check_exports)).default,
      "database": (init_database(), __toCommonJS(database_exports)).default,
      "eye": (init_eye(), __toCommonJS(eye_exports)).default,
      "list": (init_list(), __toCommonJS(list_exports)).default,
      "megaphone": (init_megaphone(), __toCommonJS(megaphone_exports)).default,
      "monitor": (init_monitor(), __toCommonJS(monitor_exports)).default,
      "pencil": (init_pencil(), __toCommonJS(pencil_exports)).default,
      "play": (init_play(), __toCommonJS(play_exports)).default,
      "plus": (init_plus(), __toCommonJS(plus_exports)).default,
      "power": (init_power(), __toCommonJS(power_exports)).default,
      "refresh-cw": (init_refresh_cw(), __toCommonJS(refresh_cw_exports)).default,
      "settings": (init_settings(), __toCommonJS(settings_exports)).default,
      "trash-2": (init_trash_2(), __toCommonJS(trash_2_exports)).default,
      "x": (init_x(), __toCommonJS(x_exports)).default
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

// packages/addons/danmaku/client/styles.cjs
var require_styles = __commonJS({
  "packages/addons/danmaku/client/styles.cjs"(exports2, module2) {
    "use strict";
    var baseStyles = require_client_base_styles();
    var SW = require_switch();
    var NF = require_number_field();
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
        "@media (prefers-color-scheme:dark){.wbdm-kpi,.wbdm-card,.wbdm-status-cell{background:var(--wb-surface,#16181d)}}"
      ];
    }
    module2.exports = function styles2() {
      return baseStyles("wbdm").concat(pageStyles(), SW.styles, NF.styles);
    };
    module2.exports.pageStyles = pageStyles;
  }
});

// packages/addons/danmaku/client/overlay/style.cjs
var require_style = __commonJS({
  "packages/addons/danmaku/client/overlay/style.cjs"(exports2, module2) {
    "use strict";
    module2.exports = function overlayStyles() {
      return [
        ".wbdm-dm-root{position:fixed;inset:0;z-index:780;pointer-events:none;overflow:hidden;contain:layout paint;-webkit-app-region:no-drag}",
        ".wbdm-dm-root[data-layer=overlay]{position:absolute;inset:0;z-index:20}",
        ".wbdm-dm-field{position:absolute;inset:0;overflow:hidden}",
        ".wbdm-dm-chip{position:absolute;left:0;top:0;display:inline-flex;align-items:center;gap:7px;padding:4px 13px 4px 11px;border-radius:999px;",
        "border:1px solid var(--wbdm-border,rgba(0,0,0,.10));background:var(--wbdm-chip-bg,rgba(255,255,255,.82));",
        "color:var(--wbdm-fg,#1f2328);font-size:var(--wbdm-font-size,15px);font-weight:480;line-height:1.45;white-space:nowrap;letter-spacing:.012em;",
        "opacity:var(--wbdm-opacity,1);box-shadow:0 3px 12px var(--wbdm-shadow,rgba(0,0,0,.10)),0 1px 2px rgba(0,0,0,.06);",
        "backdrop-filter:blur(7px) saturate(1.15);-webkit-backdrop-filter:blur(7px) saturate(1.15);",
        "will-change:transform;backface-visibility:hidden;contain:layout style}",
        ".wbdm-dm-tone-normal{color:var(--wbdm-fg,#1f2328)}",
        ".wbdm-dm-tone-accent{color:var(--wbdm-accent,#1d4ed8);border-color:var(--wbdm-accent,#2563eb)}",
        ".wbdm-dm-tone-success{color:var(--wbdm-ok,#15803d);border-color:var(--wbdm-ok,#15803d)}",
        ".wbdm-dm-tone-warn{color:var(--wbdm-warn,#b45309);border-color:var(--wbdm-warn,#b45309)}",
        ".wbdm-dm-tone-danger{color:var(--wbdm-danger,#b91c1c);border-color:var(--wbdm-danger,#b91c1c)}",
        ".wbdm-dm-chip.wbdm-dm-plain{background:none;border-color:transparent;box-shadow:none;padding:2px 3px;",
        "backdrop-filter:none;-webkit-backdrop-filter:none;text-shadow:0 1px 3px var(--wbdm-shadow,rgba(0,0,0,.35))}",
        "@media (prefers-reduced-motion: reduce){.wbdm-dm-chip{transition:none}}"
      ];
    };
  }
});

// packages/addons/danmaku/client/overlay/chip-style.cjs
var require_chip_style = __commonJS({
  "packages/addons/danmaku/client/overlay/chip-style.cjs"(exports2, module2) {
    "use strict";
    var FAMILY = {
      rounded: '"SF Pro Rounded", "PingFang SC", "Hiragino Sans GB", system-ui, sans-serif',
      serif: 'Georgia, "Songti SC", "Noto Serif CJK SC", serif',
      mono: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
    };
    var TEXT_LIMIT = 140;
    function num(value, fallback) {
      if (value === "" || value === null || value === void 0) return fallback;
      var n = Number(value);
      return isFinite(n) ? n : fallback;
    }
    function clamp(n, min, max) {
      return Math.min(max, Math.max(min, n));
    }
    function textOf(payload) {
      var prefix = payload && payload.prefix ? payload.prefix + " " : "";
      return prefix + String(payload && payload.body || "").slice(0, TEXT_LIMIT);
    }
    function styleOf(payload, config) {
      var base = config || {};
      var p = payload || {};
      return {
        text: textOf(p),
        plain: p.card === false,
        fontSize: clamp(num(p.fontSize, num(base.fontSize, 15)), 10, 48),
        fontWeight: clamp(num(p.weight, 0) || 480, 300, 800),
        fontFamily: FAMILY[p.family] || "",
        opacity: clamp(num(p.opacity, num(base.opacity, 1)), 0.15, 1),
        speed: clamp(num(p.speed, num(base.speed, 150)), 30, 800)
      };
    }
    function buildChip(doc, payload, config) {
      var style = styleOf(payload, config);
      var el = doc.createElement("span");
      el.className = "wbdm-dm-chip wbdm-dm-tone-" + (payload && payload.tone ? payload.tone : "normal") + (style.plain ? " wbdm-dm-plain" : "");
      el.style.fontSize = style.fontSize + "px";
      el.style.fontWeight = String(style.fontWeight);
      if (style.fontFamily) el.style.fontFamily = style.fontFamily;
      el.style.opacity = String(style.opacity);
      el.textContent = style.text;
      return { el, style };
    }
    module2.exports = {
      FAMILY,
      textOf,
      styleOf,
      buildChip
    };
  }
});

// packages/addons/danmaku/client/overlay/layer.cjs
var require_layer = __commonJS({
  "packages/addons/danmaku/client/overlay/layer.cjs"(exports2, module2) {
    "use strict";
    var chipStyle = require_chip_style();
    var ACTIVE_LIMIT = 160;
    var LATE_LIMIT = 2e3;
    function num(value, fallback) {
      var n = Number(value);
      return isFinite(n) ? n : fallback;
    }
    function clamp(n, min, max) {
      return Math.min(max, Math.max(min, n));
    }
    function createWebLayer(options) {
      var root = options.root;
      var doc = root.ownerDocument;
      var win = doc.defaultView || window;
      var field = doc.createElement("div");
      field.className = "wbdm-dm-field";
      root.appendChild(field);
      var config = { speed: 150, lanes: 7, band: "full", fontSize: 15, opacity: 1, motion: "auto", enabled: true };
      var timers = /* @__PURE__ */ new Set();
      var anims = /* @__PURE__ */ new Set();
      var paused = false;
      var reduced = false;
      var disposed = false;
      try {
        reduced = win.matchMedia("(prefers-reduced-motion: reduce)").matches;
      } catch (error) {
        reduced = false;
      }
      function metrics(bandOverride) {
        var vw = field.clientWidth || win.innerWidth || 1200;
        var vh = field.clientHeight || win.innerHeight || 800;
        var lanes = clamp(Math.round(num(config.lanes, 7)), 1, 12);
        var bandTop = 6;
        var bandBottom = vh * 0.92;
        var band = bandOverride || config.band;
        if (band === "upper") bandBottom = vh * 0.5;
        else if (band === "lower") {
          bandTop = vh * 0.45;
          bandBottom = vh * 0.92;
        }
        var available = Math.max(120, bandBottom - bandTop);
        return { vw, lanes, laneH: clamp(available / lanes, 24, 4e3), top: bandTop };
      }
      function removeChip(el, anim) {
        if (anim) {
          anims.delete(anim);
          try {
            anim.cancel();
          } catch (error) {
          }
        }
        if (el && el.parentNode) el.parentNode.removeChild(el);
      }
      function spawn(payload) {
        if (disposed || !config.enabled) return;
        if (!payload || !payload.body) return;
        if (anims.size >= ACTIVE_LIMIT) return;
        var m = metrics(payload.band);
        var made = chipStyle.buildChip(doc, payload, config);
        var el = made.el;
        field.appendChild(el);
        var width = el.offsetWidth || 120;
        var lane = Math.abs(Math.floor(num(payload.lane, 0))) % m.lanes;
        var height = el.offsetHeight || 30;
        el.style.top = Math.round(m.top + lane * m.laneH + Math.max(0, (m.laneH - height) / 2)) + "px";
        var still = reduced || config.motion === "off";
        var anim;
        if (still) {
          el.style.left = "6%";
          anim = el.animate(
            [
              { opacity: 0, transform: "translateY(6px)" },
              { opacity: made.style.opacity, transform: "translateY(0)", offset: 0.12 },
              { opacity: made.style.opacity, offset: 0.82 },
              { opacity: 0, transform: "translateY(-6px)" }
            ],
            { duration: 4200, easing: "ease-out", fill: "forwards" }
          );
        } else {
          var speed = made.style.speed;
          var startX = m.vw + 8;
          var endX = -(width + 8);
          var duration = Math.max(1200, (startX - endX) / speed * 1e3);
          anim = el.animate(
            [
              { transform: "translate3d(" + startX + "px,0,0)" },
              { transform: "translate3d(" + endX + "px,0,0)" }
            ],
            { duration, easing: "linear", fill: "forwards" }
          );
        }
        anims.add(anim);
        if (paused) anim.pause();
        anim.onfinish = function() {
          removeChip(el, anim);
        };
        anim.oncancel = function() {
          anims.delete(anim);
        };
      }
      function schedule(payload) {
        if (disposed) return;
        if (payload.preview) {
          spawn(payload);
          return;
        }
        var at = num(payload.at, 0);
        var delay = at > 0 ? at - Date.now() : 0;
        if (at > 0 && delay < -LATE_LIMIT) return;
        if (delay <= 0) {
          spawn(payload);
          return;
        }
        var timer = win.setTimeout(function() {
          timers.delete(timer);
          spawn(payload);
        }, delay);
        timers.add(timer);
      }
      function setPaused(next) {
        paused = Boolean(next);
        anims.forEach(function(anim) {
          try {
            if (paused) anim.pause();
            else anim.play();
          } catch (error) {
          }
        });
      }
      function setVar(name, value) {
        if (value === void 0 || value === null || value === "") return;
        root.style.setProperty(name, String(value));
      }
      function update(next) {
        var cfg = next || {};
        config = {
          speed: num(cfg.speed, config.speed),
          lanes: num(cfg.lanes, config.lanes),
          band: typeof cfg.band === "string" ? cfg.band : config.band,
          fontSize: num(cfg.fontSize, config.fontSize),
          opacity: num(cfg.opacity, config.opacity),
          motion: typeof cfg.motion === "string" ? cfg.motion : config.motion,
          enabled: cfg.enabled === void 0 ? config.enabled : Boolean(cfg.enabled)
        };
        setVar("--wbdm-font-size", clamp(config.fontSize, 11, 28) + "px");
        setVar("--wbdm-opacity", String(clamp(config.opacity, 0.2, 1)));
      }
      function applyTheme(theme) {
        if (!theme) return;
        setVar("--wbdm-fg", theme.fg);
        setVar("--wbdm-bg", theme.bg);
        setVar("--wbdm-border", theme.border);
        setVar("--wbdm-accent", theme.accent);
        setVar("--wbdm-ok", theme.ok);
        setVar("--wbdm-warn", theme.warn);
        setVar("--wbdm-danger", theme.danger);
        if (theme.bg) {
          setVar("--wbdm-chip-bg", "color-mix(in srgb, " + theme.bg + " 74%, transparent)");
        }
        if (theme.dark) setVar("--wbdm-shadow", "rgba(0,0,0,.45)");
        else setVar("--wbdm-shadow", "rgba(0,0,0,.12)");
      }
      function destroy() {
        disposed = true;
        timers.forEach(function(timer) {
          win.clearTimeout(timer);
        });
        timers.clear();
        anims.forEach(function(anim) {
          try {
            anim.cancel();
          } catch (error) {
          }
        });
        anims.clear();
        if (field.parentNode) field.parentNode.removeChild(field);
      }
      return {
        play: schedule,
        update,
        theme: applyTheme,
        pause: setPaused,
        destroy,
        get size() {
          return anims.size;
        }
      };
    }
    module2.exports = { createWebLayer };
  }
});

// packages/addons/danmaku/client/overlay/mount.cjs
var require_mount = __commonJS({
  "packages/addons/danmaku/client/overlay/mount.cjs"(exports2, module2) {
    "use strict";
    var overlayStyle = require_style();
    var layerModule = require_layer();
    var DOMAIN = "wb-addon-danmaku";
    var ACTION_PREFIX = "danmaku.";
    var STYLE_ID2 = "wbdm-dm-styles";
    var THEME_DEBOUNCE = 700;
    var DEFAULTS = {
      enabled: true,
      surface: "both",
      layer: "body",
      speed: 150,
      lanes: 7,
      band: "full",
      fontSize: 15,
      opacity: 0.92,
      motion: "auto",
      pauseOnInput: true
    };
    var THEME_VARS = {
      fg: ["--dsw-alias-label-primary"],
      bg: ["--dsw-alias-bg-layer-1", "--dsw-alias-bg-base", "--wb-card"],
      border: ["--dsw-alias-border-l2", "--dsw-alias-border-l3", "--wb-border"],
      accent: ["--dsw-alias-brand-primary", "--wb-accent"],
      ok: ["--dsw-alias-state-success-primary", "--wb-ok"],
      warn: ["--dsw-alias-state-warn-primary", "--wb-warn"],
      danger: ["--dsw-alias-state-error-primary", "--wb-danger"]
    };
    function injectStyles2() {
      if (document.getElementById(STYLE_ID2)) return;
      var style = document.createElement("style");
      style.id = STYLE_ID2;
      style.textContent = overlayStyle().join("");
      (document.head || document.documentElement).appendChild(style);
    }
    function call(action, args) {
      return fetch("/workbench/api/domains/" + DOMAIN + "/actions/" + encodeURIComponent(ACTION_PREFIX + action), {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(args || {})
      }).then(function(res) {
        return res.json().catch(function() {
          return { ok: false, error: "HTTP " + res.status };
        });
      });
    }
    function readTheme() {
      var probe = document.body || document.documentElement;
      var cs = window.getComputedStyle(probe);
      var out = {};
      Object.keys(THEME_VARS).forEach(function(key) {
        var names = THEME_VARS[key];
        for (var i = 0; i < names.length; i += 1) {
          var value = cs.getPropertyValue(names[i]).trim();
          if (value) {
            out[key] = value;
            return;
          }
        }
      });
      var bg = out.bg || "";
      var rgb = /rgba?\(([^)]+)\)/.exec(bg);
      if (rgb) {
        var parts = rgb[1].split(",").map(function(part) {
          return parseFloat(part);
        });
        if (parts.length >= 3) {
          var l = (0.2126 * parts[0] + 0.7152 * parts[1] + 0.0722 * parts[2]) / 255;
          out.dark = l < 0.45;
        }
      }
      if (out.dark === void 0) {
        out.dark = document.documentElement.classList.contains("dark");
      }
      return out;
    }
    function mount() {
      if (window.__WB_DANMAKU_MOUNTED__) return window.__WB_DANMAKU_MOUNTED__;
      injectStyles2();
      var root = document.createElement("div");
      root.className = "wbdm-dm-root";
      root.setAttribute("data-danmaku-root", "1");
      root.setAttribute("aria-hidden", "true");
      document.body.appendChild(root);
      var layer = layerModule.createWebLayer({ root });
      var config = Object.assign({}, DEFAULTS);
      var surface = null;
      var sse = null;
      var retries = 0;
      var configLoaded = false;
      var themeTimer = null;
      var lastThemeKey = "";
      var typingTimer = null;
      var TYPING_IDLE_MS = 3e3;
      function place(nextLayer) {
        var target = document.body;
        var mode = "body";
        if (nextLayer === "overlay") {
          var host = document.querySelector("[data-shell-overlay]");
          if (host) {
            target = host;
            mode = "overlay";
          }
        }
        root.setAttribute("data-layer", mode);
        if (root.parentNode !== target) target.appendChild(root);
      }
      function apply(values) {
        if (!values) return;
        config = Object.assign(config, values);
        layer.update(config);
        surface = config.surface || "both";
        var visible = config.enabled !== false && surface !== "desktop" && surface !== "none";
        root.style.display = visible ? "" : "none";
        root.style.zIndex = config.layer === "overlay" ? "" : "780";
        if (visible) place(config.layer);
      }
      function refresh() {
        return call("configGet", {}).then(function(res) {
          var result = res && res.result ? res.result : res;
          if (res && res.ok && result && result.values) {
            retries = 0;
            configLoaded = true;
            apply(result.values);
            return;
          }
          throw new Error(res && res.error || "\u914D\u7F6E\u8BFB\u53D6\u5931\u8D25");
        }).catch(function() {
          if (retries < 5) {
            retries += 1;
            window.setTimeout(refresh, 1500 * retries);
          }
        });
      }
      function syncTheme() {
        window.clearTimeout(themeTimer);
        themeTimer = window.setTimeout(function() {
          var theme = readTheme();
          var key = JSON.stringify(theme);
          if (key === lastThemeKey) return;
          lastThemeKey = key;
          layer.theme(theme);
          call("theme", { colors: theme }).catch(function() {
          });
        }, THEME_DEBOUNCE);
      }
      function editableFrom(target) {
        if (!target || !target.closest) return null;
        return target.closest('input, textarea, [contenteditable=""], [contenteditable="true"], [contenteditable="plaintext-only"]');
      }
      function onTyping(event) {
        if (!configLoaded || !config.pauseOnInput) return;
        if (!editableFrom(event.target)) return;
        window.clearTimeout(typingTimer);
        layer.pause(true);
        typingTimer = window.setTimeout(function() {
          typingTimer = null;
          layer.pause(false);
        }, TYPING_IDLE_MS);
      }
      function onFocusOut(event) {
        if (!configLoaded || !config.pauseOnInput) return;
        if (!editableFrom(event.target)) return;
        window.clearTimeout(typingTimer);
        typingTimer = null;
        window.setTimeout(function() {
          layer.pause(false);
        }, 120);
      }
      function onVisible() {
        if (document.hidden) layer.pause(true);
        else {
          layer.pause(false);
          refresh();
        }
      }
      function connect() {
        if (sse) return;
        sse = new EventSource("/workbench/api/events");
        sse.addEventListener("domain-event", function(event) {
          var payload;
          try {
            payload = JSON.parse(event.data);
          } catch (error) {
            return;
          }
          if (!payload || payload.domainId !== DOMAIN) return;
          if (payload.event === "play") {
            layer.play(payload.data || {});
          } else if (payload.event === "changed") {
            refresh();
          }
        });
        sse.onopen = function() {
          if (!configLoaded) {
            retries = 0;
            refresh();
          }
        };
        sse.onerror = function() {
        };
      }
      document.addEventListener("input", onTyping, true);
      document.addEventListener("focusout", onFocusOut, true);
      document.addEventListener("visibilitychange", onVisible);
      try {
        var mq = window.matchMedia("(prefers-color-scheme: dark)");
        if (mq && mq.addEventListener) mq.addEventListener("change", syncTheme);
      } catch (error) {
      }
      var themeObserver = new MutationObserver(syncTheme);
      themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "style", "data-theme"] });
      function destroy() {
        if (sse) sse.close();
        themeObserver.disconnect();
        layer.destroy();
        if (root.parentNode) root.parentNode.removeChild(root);
        document.removeEventListener("input", onTyping, true);
        document.removeEventListener("focusout", onFocusOut, true);
        document.removeEventListener("visibilitychange", onVisible);
        window.__WB_DANMAKU_MOUNTED__ = null;
      }
      var api = { refresh, destroy, layer, root };
      window.__WB_DANMAKU_MOUNTED__ = api;
      syncTheme();
      refresh();
      connect();
      return api;
    }
    module2.exports = { mount, call, DOMAIN };
  }
});

// packages/addons/danmaku/client/copy.cjs
var require_copy = __commonJS({
  "packages/addons/danmaku/client/copy.cjs"(exports2, module2) {
    "use strict";
    var ZH = {
      title: "\u5F39\u5E55",
      hint: "\u6574\u4E2A DSH \u7A97\u53E3 \xB7 \u684C\u9762\u900F\u660E\u5C42 \xB7 \u81EA\u5DF1\u7EF4\u62A4\u5F39\u5E55\u5E93",
      tabs: { library: "\u5F39\u5E55\u5E93", config: "\u914D\u7F6E", data: "\u6570\u636E", actions: "Action" },
      loading: "\u6B63\u5728\u8BFB\u53D6\u5F39\u5E55\u2026",
      loadFail: "\u5F39\u5E55\u8BFB\u53D6\u5931\u8D25",
      retry: "\u91CD\u8BD5",
      addPlaceholder: "\u5199\u4E00\u6761\u4F1A\u53CD\u590D\u98D8\u8FC7\u7684\u5F39\u5E55\uFF0C\u6700\u591A 100 \u5B57",
      add: "\u6DFB\u52A0\u5F39\u5E55",
      adding: "\u6DFB\u52A0\u4E2D\u2026",
      added: "\u5DF2\u6DFB\u52A0",
      duplicate: "\u8FD9\u6761\u5F39\u5E55\u5DF2\u7ECF\u5728\u5E93\u91CC\u4E86",
      empty: "\u5F39\u5E55\u5E93\u8FD8\u662F\u7A7A\u7684\u3002\u5148\u52A0\u4E00\u6761\uFF0C\u5B83\u4F1A\u6309\u914D\u7F6E\u7684\u8282\u594F\u5728\u6574\u4E2A\u7A97\u53E3\u91CC\u5FAA\u73AF\u98D8\u8FC7\u3002",
      enabled: "\u542F\u7528\u4E2D",
      pausedTag: "\u5DF2\u505C\u7528",
      enable: "\u542F\u7528",
      disable: "\u505C\u7528",
      preview: "\u9884\u89C8",
      previewing: "\u5DF2\u53D1\u51FA",
      previewTooOften: "\u9884\u89C8\u592A\u9891\u7E41\uFF0C\u8BF7\u7A0D\u540E\u518D\u8BD5",
      edit: "\u7F16\u8F91",
      save: "\u4FDD\u5B58",
      cancel: "\u53D6\u6D88",
      remove: "\u5220\u9664",
      confirmRemove: "\u5220\u9664\u540E\u4E0D\u518D\u53C2\u4E0E\u8F6E\u64AD\uFF08\u53EF\u91CD\u65B0\u6DFB\u52A0\u76F8\u540C\u5185\u5BB9\uFF09\uFF0C\u786E\u5B9A\u5220\u9664\uFF1F",
      removed: "\u5DF2\u5220\u9664",
      moveUp: "\u4E0A\u79FB",
      moveDown: "\u4E0B\u79FB",
      tone: "\u989C\u8272",
      tones: { normal: "\u5E38\u89C4", accent: "\u4E3B\u9898\u8272", success: "\u6210\u529F", warn: "\u63D0\u9192", danger: "\u8B66\u793A" },
      card: "\u5361\u7247\u80CC\u666F",
      createTitle: "\u65B0\u5EFA\u5F39\u5E55",
      createHint: "\u65B0\u5EFA\u4E00\u6761\u5F39\u5E55\uFF0C\u53EF\u9009\u914D\u7F6E\u5916\u89C2\uFF1B\u4FDD\u5B58\u540E\u7ACB\u5373\u8FDB\u5165\u8F6E\u64AD\u3002",
      createSave: "\u6DFB\u52A0",
      detailTitle: "\u5F39\u5E55\u8BE6\u60C5",
      detailHint: "\u8FD9\u6761\u5F39\u5E55\u81EA\u5DF1\u7684\u5916\u89C2\uFF0C\u6539\u5B8C\u53EA\u5F71\u54CD\u5B83\u4E00\u6761\u3002",
      previewStage: "\u5B9E\u65F6\u9884\u89C8 \xB7 \u6539\u53C2\u6570\u7ACB\u5373\u751F\u6548\uFF0C\u4E0D\u5199\u5E93\u4E0D\u53D1\u5C4F",
      previewPlaceholder: "\u8F93\u5165\u5185\u5BB9\uFF0C\u8FD9\u91CC\u4F1A\u5B9E\u65F6\u9884\u89C8",
      sectionContent: "\u5185\u5BB9",
      sectionLook: "\u5916\u89C2",
      sectionMotion: "\u52A8\u6548",
      sectionRotate: "\u8F6E\u64AD",
      followGlobal: "\u8DDF\u968F\u5168\u5C40",
      fontSize: "\u5B57\u53F7",
      speed: "\u901F\u5EA6",
      opacity: "\u4E0D\u900F\u660E\u5EA6",
      weight: "\u5B57\u91CD",
      family: "\u5B57\u4F53",
      band: "\u6CF3\u9053\u533A\u57DF",
      prefix: "\u524D\u7F00",
      chance: "\u51FA\u73B0\u6743\u91CD",
      chanceHint: "\u8D8A\u5927\u8D8A\u5E38\u51FA\u73B0",
      weights: { 400: "\u5E38\u89C4", 500: "\u4E2D\u7B49", 600: "\u534A\u7C97", 700: "\u7C97" },
      families: { "": "\u7CFB\u7EDF\u9ED8\u8BA4", rounded: "\u5706\u6DA6", serif: "\u886C\u7EBF", mono: "\u7B49\u5BBD" },
      bands: { "": "\u8DDF\u968F\u5168\u5C40", full: "\u6574\u5C4F", upper: "\u4E0A\u534A\u5C4F", lower: "\u4E0B\u534A\u5C4F" },
      saveDetail: "\u4FDD\u5B58",
      saving: "\u4FDD\u5B58\u4E2D\u2026",
      prefixHint: "\u53EF\u9009\uFF0C\u6BD4\u5982 emoji \u524D\u7F00",
      bandHint: "\u8FD9\u6761\u5F39\u5E55\u8D70\u6574\u5C4F\u8FD8\u662F\u534A\u5C4F",
      saveAndPreview: "\u4FDD\u5B58\u5E76\u9884\u89C8",
      unitPx: "px",
      unitSpeed: "px/s",
      deleteLine: "\u5220\u9664\u8FD9\u6761",
      cardOn: "\u5361\u7247",
      cardOff: "\u7EAF\u6587\u5B57",
      cardHint: "\u5E26\u80CC\u666F\u5361\u7247\uFF0C\u6216\u53EA\u4FDD\u7559\u6587\u5B57\uFF08\u9002\u5408\u538B\u5728\u56FE\u4E0A\u770B\uFF09",
      stats: "\u5171 {total} \u6761 \xB7 \u542F\u7528 {enabled} \u6761 \xB7 \u505C\u7528 {paused} \u6761",
      kpiTotal: "\u5168\u90E8",
      kpiEnabled: "\u542F\u7528",
      kpiPaused: "\u505C\u7528",
      charCount: "{n}/100",
      configTitle: "\u5F39\u5E55\u914D\u7F6E",
      configHint: "\u914D\u7F6E\u5B58\u5BBF\u4E3B meta \u8868\uFF0C\u968F\u5DE5\u4F5C\u53F0\u4E00\u8D77\u8D70\uFF1B\u4FEE\u6539\u5373\u751F\u6548\u3002",
      resetAll: "\u5168\u90E8\u6062\u590D\u9ED8\u8BA4",
      resetDone: "\u5DF2\u6062\u590D\u9ED8\u8BA4\u914D\u7F6E",
      saved: "\u5DF2\u4FDD\u5B58",
      saveFail: "\u4FDD\u5B58\u5931\u8D25",
      desktopTitle: "\u684C\u9762\u5F39\u5E55",
      desktopHint: "\u684C\u9762\u5C42\u662F\u4E00\u4E2A\u900F\u660E\u3001\u7F6E\u9876\u3001\u9F20\u6807\u7A7F\u900F\u7684\u72EC\u7ACB\u7A97\u53E3\uFF1B\u9996\u6B21\u4F7F\u7528\u4F1A\u590D\u7528 ~/.dsh/electron\uFF0C\u627E\u4E0D\u5230\u624D\u4E0B\u8F7D\u4E00\u6B21\u3002",
      desktopPhase: {
        stopped: "\u672A\u8FD0\u884C",
        resolving: "\u51C6\u5907\u8FD0\u884C\u65F6",
        installing: "\u4E0B\u8F7D\u8FD0\u884C\u65F6",
        starting: "\u542F\u52A8\u4E2D",
        running: "\u8FD0\u884C\u4E2D",
        retrying: "\u7B49\u5F85\u91CD\u8BD5",
        error: "\u51FA\u9519"
      },
      desktopDisplays: "\u8986\u76D6 {n} \u5757\u5C4F\u5E55",
      desktopRestart: "\u91CD\u542F\u684C\u9762\u5F39\u5E55",
      desktopStop: "\u672C\u6B21\u505C\u6B62",
      desktopResume: "\u6062\u590D\u684C\u9762\u5F39\u5E55",
      desktopSuppressed: "\u5DF2\u901A\u8FC7\u6258\u76D8\u505C\u6B62\uFF08\u70B9\u300C\u6062\u590D\u300D\u91CD\u65B0\u62C9\u8D77\uFF09",
      desktopProtocol: "\u534F\u8BAE v{n}",
      desktopTheme: "\u4E3B\u9898\u5DF2\u540C\u6B65",
      desktopThemeMissing: "\u4E3B\u9898\u5C1A\u672A\u540C\u6B65\uFF08\u6253\u5F00\u4E00\u6B21\u8BBE\u7F6E\u9875\u5373\u53EF\uFF09",
      dataTitle: "\u6570\u636E",
      actionsTitle: "Action",
      charLimit: "\u6700\u591A 100 \u5B57\uFF0C\u7A7A\u767D\u4F1A\u5408\u5E76",
      loadAgain: "\u5237\u65B0"
    };
    var EN = {
      title: "Danmaku",
      hint: "Whole DSH window \xB7 desktop overlay \xB7 your own library",
      tabs: { library: "Library", config: "Config", data: "Data", actions: "Actions" },
      loading: "Loading danmaku\u2026",
      loadFail: "Failed to load danmaku",
      retry: "Retry",
      addPlaceholder: "Write a line that keeps flying by (max 100 chars)",
      add: "Add",
      adding: "Adding\u2026",
      added: "Added",
      duplicate: "That line is already in the library",
      empty: "The library is empty. Add one line and it will loop across the whole window.",
      enabled: "On",
      pausedTag: "Paused",
      enable: "Enable",
      disable: "Disable",
      preview: "Preview",
      previewing: "Sent",
      previewTooOften: "Too many previews, try again shortly",
      edit: "Edit",
      save: "Save",
      cancel: "Cancel",
      remove: "Delete",
      confirmRemove: "Delete this line from rotation? You can add the same text again later.",
      removed: "Deleted",
      moveUp: "Up",
      moveDown: "Down",
      tone: "Tone",
      tones: { normal: "Normal", accent: "Accent", success: "Success", warn: "Warn", danger: "Danger" },
      card: "Card background",
      createTitle: "New danmaku",
      createHint: "Create a danmaku with its own look; it joins the rotation right away.",
      createSave: "Add",
      detailTitle: "Danmaku details",
      detailHint: "Per-line look and motion; only this line changes.",
      previewStage: "Live preview \xB7 updates as you tweak, nothing is saved or sent",
      previewPlaceholder: "Type something to preview it here",
      sectionContent: "Content",
      sectionLook: "Look",
      sectionMotion: "Motion",
      sectionRotate: "Rotation",
      followGlobal: "Follow global",
      fontSize: "Font size",
      speed: "Speed",
      opacity: "Opacity",
      weight: "Weight",
      family: "Typeface",
      band: "Lane area",
      prefix: "Prefix",
      chance: "Weight",
      chanceHint: "Higher shows more often",
      weights: { 400: "Regular", 500: "Medium", 600: "Semibold", 700: "Bold" },
      families: { "": "System", rounded: "Rounded", serif: "Serif", mono: "Mono" },
      bands: { "": "Follow global", full: "Full", upper: "Upper half", lower: "Lower half" },
      saveDetail: "Save",
      saving: "Saving\u2026",
      prefixHint: "Optional emoji or tag prefix",
      bandHint: "Lanes this line may use",
      saveAndPreview: "Save & preview",
      unitPx: "px",
      unitSpeed: "px/s",
      deleteLine: "Delete this line",
      cardOn: "Card",
      cardOff: "Text only",
      cardHint: "Show a background card, or keep the text only",
      stats: "{total} total \xB7 {enabled} on \xB7 {paused} off",
      kpiTotal: "Total",
      kpiEnabled: "Live",
      kpiPaused: "Paused",
      charCount: "{n}/100",
      configTitle: "Danmaku settings",
      configHint: "Stored in the host meta table; changes apply immediately.",
      resetAll: "Reset to defaults",
      resetDone: "Settings reset",
      saved: "Saved",
      saveFail: "Save failed",
      desktopTitle: "Desktop danmaku",
      desktopHint: "A transparent, always-on-top, click-through window. Reuses ~/.dsh/electron; downloads only when missing.",
      desktopPhase: {
        stopped: "Stopped",
        resolving: "Resolving runtime",
        installing: "Downloading runtime",
        starting: "Starting",
        running: "Running",
        retrying: "Retrying soon",
        error: "Error"
      },
      desktopDisplays: "Across {n} display(s)",
      desktopRestart: "Restart desktop layer",
      desktopStop: "Stop for this run",
      desktopResume: "Resume desktop layer",
      desktopSuppressed: "Stopped from the tray menu (click Resume to restart)",
      desktopProtocol: "protocol v{n}",
      desktopTheme: "Theme synced",
      desktopThemeMissing: "Theme not synced yet (open the config tab once)",
      dataTitle: "Data",
      actionsTitle: "Actions",
      charLimit: "Max 100 chars; whitespace is collapsed",
      loadAgain: "Refresh"
    };
    function fmt(text, vars) {
      return String(text).replace(/\{(\w+)\}/g, function(all, key) {
        return vars && vars[key] !== void 0 ? String(vars[key]) : all;
      });
    }
    function pick(lang) {
      return lang === "en" ? EN : ZH;
    }
    module2.exports = { zh: ZH, en: EN, pick, fmt };
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

// packages/addons/danmaku/client/views/detail.cjs
var require_detail = __commonJS({
  "packages/addons/danmaku/client/views/detail.cjs"(exports2, module2) {
    "use strict";
    var GLYPHS2 = require_icons2().ICONS;
    var React = require("react");
    var h = React.createElement;
    var chipStyle = require_chip_style();
    var createOverlay = require_overlay();
    var SW = require_switch();
    var NF = require_number_field();
    var REDUCED = false;
    try {
      REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch (error) {
      REDUCED = false;
    }
    var TONES = ["normal", "accent", "success", "warn", "danger"];
    var ICONS = {
      x: GLYPHS2["x"],
      eye: GLYPHS2["eye"]
    };
    function glyph(Icon2, size) {
      return h(Icon2, { size: size || 14, strokeWidth: 1.8, "aria-hidden": "true" });
    }
    function numberOrText(value) {
      return value === null || value === void 0 ? "" : String(value);
    }
    function PreviewStage(props) {
      var stageRef = React.useRef(null);
      var detail = props.detail;
      var hint = props.hint;
      var placeholder = props.placeholder || "";
      React.useEffect(
        function() {
          var stage = stageRef.current;
          if (!stage) return void 0;
          stage.innerHTML = "";
          var made = chipStyle.buildChip(
            stage.ownerDocument,
            {
              body: detail.body || placeholder,
              tone: detail.tone,
              card: detail.card,
              prefix: detail.prefix,
              fontSize: detail.fontSize,
              speed: detail.speed,
              opacity: detail.opacity,
              weight: detail.fontWeight,
              family: detail.fontFamily
            },
            { fontSize: 15, opacity: 0.92, speed: 150 }
          );
          var chip = made.el;
          chip.style.position = "absolute";
          chip.style.left = "0";
          chip.style.top = "50%";
          chip.style.willChange = "transform";
          stage.appendChild(chip);
          var stageW = stage.clientWidth || 520;
          var chipW = chip.offsetWidth || 120;
          if (REDUCED) {
            chip.style.transform = "translate3d(" + Math.round((stageW - chipW) / 2) + "px,-50%,0)";
            return void 0;
          }
          var speed = made.style.speed;
          var anim = chip.animate(
            [
              { transform: "translate3d(" + stageW + "px,-50%,0)" },
              { transform: "translate3d(" + -(chipW + 10) + "px,-50%,0)" }
            ],
            { duration: Math.max(1400, (stageW + chipW) / speed * 1e3), easing: "linear", iterations: Infinity }
          );
          return function() {
            anim.cancel();
          };
        },
        [
          placeholder,
          detail.body,
          detail.tone,
          detail.card,
          detail.prefix,
          detail.fontSize,
          detail.speed,
          detail.opacity,
          detail.fontWeight,
          detail.fontFamily
        ]
      );
      return h(
        "div",
        { className: "wbdm-preview" },
        h("div", { className: "wbdm-preview-stage", ref: stageRef }),
        h("div", { className: "wbdm-preview-hint" }, hint)
      );
    }
    var DetailOverlay = createOverlay({
      maskClass: "wbdm-modal",
      dialogClass: "wbdm-modal-card",
      ariaLabelOf: function(props) {
        return props["aria-label"];
      }
    });
    module2.exports = function renderDetail(props) {
      var C = props.C;
      var detail = props.detail;
      var patch = props.patch;
      var busy = props.busy;
      var mode = props.mode === "create" ? "create" : "edit";
      var title = mode === "create" ? C.createTitle : C.detailTitle;
      var subtitle = mode === "create" ? C.createHint : C.detailHint;
      var saveLabel = mode === "create" ? C.createSave : C.saveDetail;
      function set(key, value) {
        var next = {};
        next[key] = value;
        patch(next);
      }
      function toneChip(name) {
        return h(
          "button",
          {
            key: name,
            type: "button",
            className: "wbdm-tone-chip" + (detail.tone === name ? " on" : ""),
            onClick: function() {
              set("tone", name);
            }
          },
          h("span", { className: "wbdm-dot " + name }),
          C.tones[name]
        );
      }
      function numField(key, label, hint, step, min, max) {
        var showHint = min + "\u2013" + max + (step === 1 ? "\uFF0C\u6574\u6570" : "\uFF0C\u6B65\u957F " + step);
        return h(
          "label",
          { className: "wbdm-crow" },
          h(
            "span",
            { className: "wbdm-crow-label" },
            h("span", { className: "wbdm-crow-t" }, label),
            h("span", { className: "wbdm-crow-h" }, hint)
          ),
          h(NF.NumberField, {
            h,
            value: numberOrText(detail[key]),
            min,
            max,
            integer: Math.round(step) === step,
            allowEmpty: true,
            ariaLabel: label,
            placeholder: C.followGlobal,
            hint: showHint,
            onCommit: function(next) {
              set(key, next === null ? "" : String(next));
            }
          })
        );
      }
      function selectField(key, label, options, hint) {
        return h(
          "label",
          { className: "wbdm-crow" },
          h(
            "span",
            { className: "wbdm-crow-label" },
            h("span", { className: "wbdm-crow-t" }, label),
            hint ? h("span", { className: "wbdm-crow-h" }, hint) : null
          ),
          h(
            "select",
            {
              className: "wbdm-select",
              value: detail[key],
              onChange: function(e) {
                set(key, e.target.value);
              }
            },
            options.map(function(option) {
              return h("option", { key: option.value, value: option.value }, option.label);
            })
          )
        );
      }
      function switchField(key, label) {
        return h(
          "div",
          { className: "wbdm-crow" },
          h("span", { className: "wbdm-crow-label" }, h("span", { className: "wbdm-crow-t" }, label)),
          // 共享开关自带 role="switch"/aria-checked；左侧已有文案，这里不再重复显示状态。
          h(SW.Switch, {
            h,
            checked: Boolean(detail[key]),
            ariaLabel: label,
            onChange: function(next) {
              set(key, next);
            }
          })
        );
      }
      var weights = [{ value: "", label: C.followGlobal }];
      [400, 500, 600, 700].forEach(function(value) {
        weights.push({ value: String(value), label: C.weights[value] });
      });
      var families = Object.keys(C.families).map(function(value) {
        return { value, label: C.families[value] };
      });
      var bands = ["", "full", "upper", "lower"].map(function(value) {
        return { value, label: C.bands[value] };
      });
      var chances = [1, 2, 3, 4, 5].map(function(n) {
        return { value: String(n), label: "\xD7" + n };
      });
      return h(
        DetailOverlay,
        { "aria-label": title, onClose: props.cancel },
        h(
          "div",
          { className: "wbdm-modal-h" },
          h(
            "div",
            null,
            h("div", { className: "wbdm-modal-t" }, title),
            h("div", { className: "wbdm-modal-s" }, subtitle)
          ),
          h(
            "button",
            {
              type: "button",
              className: "wbdm-icon-btn",
              title: C.cancel,
              "aria-label": C.cancel,
              onClick: props.cancel
            },
            glyph(ICONS.x, 15)
          )
        ),
        h(PreviewStage, { detail, hint: C.previewStage, placeholder: C.previewPlaceholder }),
        h(
          "div",
          { className: "wbdm-modal-body" },
          h(
            "section",
            { className: "wbdm-section" },
            h("div", { className: "wbdm-section-t" }, C.sectionContent),
            h("textarea", {
              className: "wbdm-textarea",
              value: detail.body,
              maxLength: 100,
              rows: 2,
              onChange: function(e) {
                set("body", e.target.value);
              }
            }),
            h("div", { className: "wbdm-counter" }, String(detail.body.length) + "/100")
          ),
          h(
            "section",
            { className: "wbdm-section" },
            h("div", { className: "wbdm-section-t" }, C.sectionLook),
            h(
              "div",
              { className: "wbdm-crow" },
              h("span", { className: "wbdm-crow-label" }, h("span", { className: "wbdm-crow-t" }, C.tone)),
              h("div", { className: "wbdm-tones" }, TONES.map(toneChip))
            ),
            h(
              "div",
              { className: "wbdm-crow" },
              h(
                "span",
                { className: "wbdm-crow-label" },
                h("span", { className: "wbdm-crow-t" }, C.card),
                h("span", { className: "wbdm-crow-h" }, C.cardHint)
              ),
              h(SW.Switch, {
                h,
                checked: Boolean(detail.card),
                ariaLabel: C.card,
                onChange: function(next) {
                  set("card", next);
                }
              })
            ),
            numField("fontSize", C.fontSize, C.unitPx + " \xB7 " + C.followGlobal, 1, 10, 48),
            selectField("fontWeight", C.weight, weights),
            selectField("fontFamily", C.family, families),
            numField("opacity", C.opacity, C.followGlobal, 0.02, 0.15, 1)
          ),
          h(
            "section",
            { className: "wbdm-section" },
            h("div", { className: "wbdm-section-t" }, C.sectionMotion),
            numField("speed", C.speed, C.unitSpeed + " \xB7 " + C.followGlobal, 10, 30, 800),
            selectField("band", C.band, bands, C.bandHint)
          ),
          h(
            "section",
            { className: "wbdm-section" },
            h("div", { className: "wbdm-section-t" }, C.sectionRotate),
            h(
              "label",
              { className: "wbdm-crow" },
              h(
                "span",
                { className: "wbdm-crow-label" },
                h("span", { className: "wbdm-crow-t" }, C.prefix),
                h("span", { className: "wbdm-crow-h" }, C.prefixHint)
              ),
              h("input", {
                className: "wbdm-input",
                type: "text",
                value: detail.prefix,
                maxLength: 8,
                placeholder: "\u2728",
                onChange: function(e) {
                  set("prefix", e.target.value);
                }
              })
            ),
            selectField("chance", C.chance, chances, C.chanceHint),
            switchField("enabled", C.enable)
          )
        ),
        h(
          "div",
          { className: "wbdm-modal-foot" },
          h(
            "button",
            {
              type: "button",
              className: "wbdm-btn ghost",
              onClick: props.cancel
            },
            C.cancel
          ),
          h(
            "button",
            {
              type: "button",
              className: "wbdm-btn",
              disabled: Boolean(busy),
              onClick: function() {
                props.save(true);
              }
            },
            glyph(ICONS.eye),
            C.saveAndPreview
          ),
          h(
            "button",
            {
              type: "button",
              className: "wbdm-btn primary",
              disabled: Boolean(busy) || !detail.body.trim(),
              onClick: function() {
                props.save(false);
              }
            },
            busy ? C.saving : saveLabel
          )
        )
      );
    };
  }
});

// packages/addons/danmaku/client/views/library.cjs
var require_library = __commonJS({
  "packages/addons/danmaku/client/views/library.cjs"(exports2, module2) {
    "use strict";
    var GLYPHS2 = require_icons2().ICONS;
    var React = require("react");
    var h = React.createElement;
    var copy = require_copy();
    var SW = require_switch();
    var ICONS = {
      up: GLYPHS2["arrow-up"],
      down: GLYPHS2["arrow-down"],
      eye: GLYPHS2["eye"],
      trash: GLYPHS2["trash-2"],
      check: GLYPHS2["check"],
      x: GLYPHS2["x"],
      plus: GLYPHS2["plus"],
      pencil: GLYPHS2["pencil"],
      megaphone: GLYPHS2["megaphone"]
    };
    function glyph(Icon2, size) {
      return h(Icon2, { size: size || 14, strokeWidth: 1.8, "aria-hidden": "true" });
    }
    function unwrap(r) {
      return r && r.result !== void 0 ? r.result : r;
    }
    function errText(e, fallback) {
      return String(e && e.message || e || fallback);
    }
    function payloadOf(r) {
      if (!r) throw new Error("empty response");
      if (r.ok === false) throw new Error(r.error || "request failed");
      return unwrap(r);
    }
    function numberOrNull(raw) {
      if (raw === "" || raw === null || raw === void 0) return null;
      var n = Number(raw);
      return isFinite(n) ? n : null;
    }
    function detailOf(item) {
      return {
        id: item.id,
        body: item.body,
        tone: item.tone || "normal",
        card: item.card !== false,
        enabled: item.enabled !== false,
        fontSize: item.fontSize === null || item.fontSize === void 0 ? "" : String(item.fontSize),
        speed: item.speed === null || item.speed === void 0 ? "" : String(item.speed),
        opacity: item.opacity === null || item.opacity === void 0 ? "" : String(item.opacity),
        fontWeight: item.fontWeight === null || item.fontWeight === void 0 ? "" : String(item.fontWeight),
        fontFamily: item.fontFamily || "",
        band: item.band || "",
        prefix: item.prefix || "",
        chance: String(item.chance || 1)
      };
    }
    function LibraryView(props) {
      var api = props.api;
      var lang = props.lang;
      var C = copy.pick(lang);
      var listS = React.useState({ loading: true, error: "", items: [], total: 0, paused: 0 });
      var list = listS[0];
      var setList = listS[1];
      var createS = React.useState(null);
      var creating = createS[0];
      var setCreating = createS[1];
      var busyS = React.useState("");
      var busy = busyS[0];
      var setBusy = busyS[1];
      var detailS = React.useState(null);
      var detail = detailS[0];
      var setDetail = detailS[1];
      var sayS = React.useState("");
      var say = sayS[0];
      var setSay = sayS[1];
      var aliveRef = React.useRef(true);
      function notify(text) {
        setSay(text);
        window.setTimeout(function() {
          if (aliveRef.current) setSay("");
        }, 2400);
      }
      var refresh = React.useCallback(function() {
        return api.call("danmaku.list", {}).then(payloadOf).then(function(body) {
          if (!aliveRef.current) return;
          setList({
            loading: false,
            error: "",
            items: body && body.items || [],
            total: body && body.total || 0,
            paused: body && body.paused || 0
          });
        }).catch(function(e) {
          if (!aliveRef.current) return;
          setList(function(prev) {
            return Object.assign({}, prev, { loading: false, error: errText(e, C.loadFail) });
          });
        });
      }, [api]);
      React.useEffect(function() {
        aliveRef.current = true;
        refresh();
        var off = null;
        if (api && typeof api.subscribe === "function") {
          off = api.subscribe(function(message) {
            if (message && message.domainId === "wb-addon-danmaku") refresh();
          });
        }
        return function() {
          aliveRef.current = false;
          if (typeof off === "function") off();
        };
      }, [refresh]);
      function act(name, args, after) {
        setBusy(name);
        return api.call("danmaku." + name, args || {}).then(payloadOf).then(function(body) {
          if (typeof after === "function") after(body);
          return refresh();
        }).catch(function(e) {
          notify(errText(e, C.loadFail));
        }).then(function() {
          if (aliveRef.current) setBusy("");
        });
      }
      function toggle(item) {
        act("update", { id: item.id, enabled: !item.enabled });
      }
      function toggleCard(item) {
        act("update", { id: item.id, card: !item.card });
      }
      function preview(item) {
        act("preview", { id: item.id });
      }
      function remove(item) {
        if (!window.confirm(C.confirmRemove)) return;
        act("remove", { id: item.id }, function() {
          notify(C.removed);
        });
      }
      function move(index, delta) {
        var items = list.items.slice();
        var target = index + delta;
        if (target < 0 || target >= items.length) return;
        var moved = items.splice(index, 1)[0];
        items.splice(target, 0, moved);
        setList(Object.assign({}, list, { items }));
        act("reorder", {
          ids: items.map(function(item) {
            return item.id;
          })
        });
      }
      function defaultDraft() {
        return {
          id: "",
          body: "",
          tone: "normal",
          card: false,
          enabled: true,
          fontSize: "",
          speed: "",
          opacity: "",
          fontWeight: "",
          fontFamily: "",
          band: "",
          prefix: "",
          chance: "1"
        };
      }
      function openCreate() {
        setCreating(defaultDraft());
      }
      function patchCreating(patch) {
        setCreating(function(prev) {
          return Object.assign({}, prev, patch);
        });
      }
      function createArgs() {
        var d = creating;
        return {
          body: d.body.trim(),
          tone: d.tone,
          card: Boolean(d.card),
          enabled: Boolean(d.enabled),
          fontSize: numberOrNull(d.fontSize),
          speed: numberOrNull(d.speed),
          opacity: numberOrNull(d.opacity),
          fontWeight: numberOrNull(d.fontWeight),
          fontFamily: d.fontFamily,
          band: d.band,
          prefix: d.prefix,
          chance: numberOrNull(d.chance) || 1
        };
      }
      function submitCreate(thenPreview) {
        if (!creating || !creating.body.trim()) return;
        act("create", createArgs(), function(result) {
          setCreating(null);
          notify(C.added);
          if (thenPreview && result && result.item && result.item.id) {
            act("preview", { id: result.item.id });
          }
        });
      }
      function openDetail(item) {
        setDetail(detailOf(item));
      }
      function patchDetail(patch) {
        setDetail(function(prev) {
          return Object.assign({}, prev, patch);
        });
      }
      function detailArgs() {
        return {
          id: detail.id,
          body: detail.body.trim(),
          tone: detail.tone,
          card: Boolean(detail.card),
          enabled: Boolean(detail.enabled),
          fontSize: numberOrNull(detail.fontSize),
          speed: numberOrNull(detail.speed),
          opacity: numberOrNull(detail.opacity),
          fontWeight: numberOrNull(detail.fontWeight),
          fontFamily: detail.fontFamily,
          band: detail.band,
          prefix: detail.prefix,
          chance: numberOrNull(detail.chance) || 1
        };
      }
      function saveDetail(thenPreview) {
        if (!detail || !detail.body.trim()) return;
        act("update", detailArgs(), function() {
          var id = detail.id;
          setDetail(null);
          notify(C.saved);
          if (thenPreview) act("preview", { id });
        });
      }
      var empty = h(
        "div",
        { className: "wbdm-empty-card" },
        h("span", { className: "wbdm-empty-icon" }, glyph(ICONS.megaphone, 17)),
        h("div", null, C.empty),
        h("div", null, C.addPlaceholder)
      );
      var rows = list.items.map(function(item, index) {
        var ops = [
          h(
            "button",
            {
              key: "up",
              type: "button",
              className: "wbdm-icon-btn",
              title: C.moveUp,
              "aria-label": C.moveUp,
              disabled: index === 0,
              onClick: function() {
                move(index, -1);
              }
            },
            glyph(ICONS.up)
          ),
          h(
            "button",
            {
              key: "down",
              type: "button",
              className: "wbdm-icon-btn",
              title: C.moveDown,
              "aria-label": C.moveDown,
              disabled: index === list.items.length - 1,
              onClick: function() {
                move(index, 1);
              }
            },
            glyph(ICONS.down)
          ),
          h(
            "button",
            {
              key: "eye",
              type: "button",
              className: "wbdm-icon-btn",
              title: C.preview,
              "aria-label": C.preview,
              onClick: function() {
                preview(item);
              }
            },
            glyph(ICONS.eye)
          ),
          h(
            "button",
            {
              key: "edit",
              type: "button",
              className: "wbdm-icon-btn",
              title: C.detailTitle,
              "aria-label": C.detailTitle,
              onClick: function() {
                openDetail(item);
              }
            },
            glyph(ICONS.pencil)
          ),
          h(
            "button",
            {
              key: "del",
              type: "button",
              className: "wbdm-icon-btn danger",
              title: C.remove,
              "aria-label": C.remove,
              onClick: function() {
                remove(item);
              }
            },
            glyph(ICONS.trash)
          )
        ];
        var meta = [];
        if (item.fontSize) meta.push(item.fontSize + C.unitPx);
        if (item.speed) meta.push(item.speed + C.unitSpeed);
        if (item.chance > 1) meta.push("\xD7" + item.chance);
        return h(
          "div",
          { key: item.id, className: "wbdm-item" + (item.enabled ? "" : " off") },
          h("span", { className: "wbdm-order" }, String(index + 1)),
          h(SW.Switch, {
            h,
            checked: Boolean(item.enabled),
            title: item.enabled ? C.disable : C.enable,
            // 开关的可访问名称用「启用」这个设置名；title 只作为点击后的动作提示。
            ariaLabel: C.enable,
            onChange: function() {
              toggle(item);
            }
          }),
          h(
            "span",
            { className: "wbdm-tag" },
            h("span", { className: "wbdm-dot " + (item.tone || "normal") }),
            C.tones[item.tone] || item.tone
          ),
          h(
            "button",
            {
              type: "button",
              className: "wbdm-cardtag" + (item.card === false ? " plain" : ""),
              title: item.card === false ? C.cardOn : C.cardOff,
              onClick: function() {
                toggleCard(item);
              }
            },
            item.card === false ? C.cardOff : C.cardOn
          ),
          h(
            "button",
            {
              type: "button",
              className: "wbdm-body",
              title: C.detailTitle,
              onClick: function() {
                openDetail(item);
              }
            },
            item.prefix ? item.prefix + " " : "",
            item.body
          ),
          h("span", { className: "wbdm-meta" }, meta.join(" \xB7 ")),
          h("div", { className: "wbdm-ops" }, ops)
        );
      });
      var enabledCount = list.total - list.paused;
      var listCard = h(
        "div",
        { className: "wbdm-card" },
        h(
          "div",
          { className: "wbdm-card-h" },
          h("span", { className: "wbdm-card-t" }, C.tabs.library),
          h(
            "span",
            { className: "wbdm-card-s" },
            copy.fmt(C.stats, { total: list.total, enabled: enabledCount, paused: list.paused })
          ),
          h(
            "button",
            {
              type: "button",
              className: "wbdm-btn primary wbdm-card-action",
              disabled: Boolean(busy),
              onClick: openCreate
            },
            glyph(ICONS.plus, 13),
            C.add
          )
        ),
        list.loading ? h("div", { className: "wbdm-empty" }, C.loading) : list.error ? h(
          "div",
          { className: "wbdm-notice error" },
          list.error,
          " ",
          h(
            "button",
            {
              type: "button",
              className: "wbdm-link",
              onClick: function() {
                refresh();
              }
            },
            C.retry
          )
        ) : list.items.length ? h("div", { className: "wbdm-list" }, rows) : empty
      );
      var hero = h(
        "div",
        { className: "wbdm-hero" },
        h(
          "div",
          { className: "wbdm-hero-text" },
          h("div", { className: "wbdm-page-title" }, C.title),
          h("div", { className: "wbdm-page-sub" }, C.hint)
        ),
        h(
          "div",
          { className: "wbdm-kpis" },
          kpi(C.kpiTotal, list.total, ""),
          kpi(C.kpiEnabled, enabledCount, "ok"),
          kpi(C.kpiPaused, list.paused, list.paused ? "warn" : "")
        )
      );
      function kpi(label, value, toneName) {
        return h(
          "div",
          { key: label, className: "wbdm-kpi" },
          h("span", { className: "wbdm-kpi-n" + (toneName ? " " + toneName : "") }, String(value)),
          h("span", { className: "wbdm-kpi-l" }, label)
        );
      }
      var sheet = detail ? {
        mode: "edit",
        draft: detail,
        patch: patchDetail,
        save: saveDetail,
        close: function() {
          setDetail(null);
        }
      } : creating ? {
        mode: "create",
        draft: creating,
        patch: patchCreating,
        save: submitCreate,
        close: function() {
          setCreating(null);
        }
      } : null;
      var modal = sheet ? require_detail()({
        C,
        lang,
        mode: sheet.mode,
        detail: sheet.draft,
        patch: sheet.patch,
        save: sheet.save,
        cancel: sheet.close,
        busy
      }) : null;
      return h(
        "div",
        { className: "wbdm-wrap" },
        hero,
        say ? h("div", { className: "wbdm-notice ok" }, say) : null,
        listCard,
        modal
      );
    }
    module2.exports = LibraryView;
  }
});

// packages/addons/danmaku/client/views/config.cjs
var require_config = __commonJS({
  "packages/addons/danmaku/client/views/config.cjs"(exports2, module2) {
    "use strict";
    var GLYPHS2 = require_icons2().ICONS;
    var React = require("react");
    var h = React.createElement;
    var copy = require_copy();
    var SW = require_switch();
    var NF = require_number_field();
    var DOMAIN = "danmaku";
    var ICONS = {
      check: GLYPHS2["check"],
      power: GLYPHS2["power"],
      refresh: GLYPHS2["refresh-cw"],
      monitor: GLYPHS2["monitor"]
    };
    function glyph(Icon2, size) {
      return h(Icon2, { size: size || 14, strokeWidth: 1.8, "aria-hidden": "true" });
    }
    function unwrap(r) {
      return r && r.result !== void 0 ? r.result : r;
    }
    function useConfig(api, fallback) {
      var stateS = React.useState({
        ready: false,
        values: Object.assign({}, fallback || {}),
        items: [],
        groups: [],
        overrides: {},
        warnings: [],
        error: ""
      });
      var state = stateS[0];
      var setState = stateS[1];
      React.useEffect(function() {
        var alive = true;
        Promise.resolve(api.call(DOMAIN + ".configGet")).then(function(r) {
          if (!alive) return;
          if (r && r.ok === false) throw new Error(r && r.error || "load failed");
          var body = unwrap(r);
          if (!body || !body.values) throw new Error("empty config");
          setState({
            ready: true,
            values: Object.assign({}, fallback || {}, body.values),
            items: body.items || [],
            groups: body.groups || [],
            overrides: body.overrides || {},
            warnings: body.warnings || [],
            error: ""
          });
        }).catch(function(e) {
          if (!alive) return;
          setState(function(prev) {
            return Object.assign({}, prev, { ready: true, error: String(e && e.message || e) });
          });
        });
        return function() {
          alive = false;
        };
      }, [api]);
      function setValues(next) {
        if (!next || typeof next !== "object") return;
        setState(function(prev) {
          return Object.assign({}, prev, { values: Object.assign({}, prev.values, next) });
        });
      }
      return Object.assign({}, state, { setValues });
    }
    function labelOf(item, lang) {
      return lang === "en" ? item.en || item.zh || item.id : item.zh || item.en || item.id;
    }
    function hintOf(item, lang) {
      return lang === "en" ? item.hintEn || "" : item.hintZh || "";
    }
    function useDesktop(api, enabled) {
      var stateS = React.useState({ data: null, error: "" });
      var state = stateS[0];
      var setState = stateS[1];
      React.useEffect(function() {
        if (!enabled) return void 0;
        var alive = true;
        function tick() {
          Promise.resolve(api.call(DOMAIN + ".desktop", { op: "status" })).then(function(r) {
            if (!alive) return;
            if (r && r.ok === false) throw new Error(r && r.error || "status failed");
            setState({ data: unwrap(r), error: "" });
          }).catch(function(e) {
            if (!alive) return;
            setState({ data: null, error: String(e && e.message || e) });
          });
        }
        tick();
        var timer = window.setInterval(tick, 4e3);
        return function() {
          alive = false;
          window.clearInterval(timer);
        };
      }, [api, enabled]);
      return state;
    }
    function statusCell(key, value) {
      return h(
        "div",
        { className: "wbdm-status-cell", key },
        h("div", { className: "wbdm-status-k" }, key),
        h("div", { className: "wbdm-status-v" }, value)
      );
    }
    function DesktopCard(props) {
      var api = props.api;
      var lang = props.lang;
      var C = copy.pick(lang);
      var state = useDesktop(api, true);
      var busyS = React.useState("");
      var busy = busyS[0];
      var setBusy = busyS[1];
      var sayS = React.useState("");
      var say = sayS[0];
      var setSay = sayS[1];
      var data = state.data || {};
      function op(name) {
        setBusy(name);
        Promise.resolve(api.call(DOMAIN + ".desktop", { op: name })).then(function(r) {
          if (r && r.ok === false) throw new Error(r && r.error || "failed");
          setSay("");
          return unwrap(r);
        }).catch(function(e) {
          setSay(String(e && e.message || e));
        }).then(function() {
          setBusy("");
        });
      }
      var phase = data.phase || "stopped";
      var phaseLabel = C.desktopPhase[phase] || phase;
      return h(
        "div",
        { className: "wbdm-card" },
        h(
          "div",
          { className: "wbdm-card-h" },
          h(
            "span",
            { className: "wbdm-card-t" },
            glyph(ICONS.monitor),
            " ",
            C.desktopTitle
          ),
          h("span", { className: "wbdm-card-s" }, C.desktopHint)
        ),
        h(
          "div",
          { className: "wbdm-status" },
          statusCell(lang === "en" ? "State" : "\u72B6\u6001", phaseLabel + (data.suppressed ? " \xB7 " + C.desktopSuppressed : "")),
          statusCell(lang === "en" ? "Protocol" : "\u534F\u8BAE", copy.fmt(C.desktopProtocol, { n: data.protocol || 1 })),
          statusCell(lang === "en" ? "Displays" : "\u5C4F\u5E55", copy.fmt(C.desktopDisplays, { n: data.displays || 0 })),
          statusCell(
            lang === "en" ? "Theme" : "\u4E3B\u9898",
            data.themeSynced ? C.desktopTheme : C.desktopThemeMissing
          )
        ),
        state.error ? h("div", { className: "wbdm-notice error" }, state.error) : null,
        say ? h("div", { className: "wbdm-notice error" }, say) : null,
        h(
          "div",
          { className: "wbdm-status-actions" },
          h(
            "button",
            {
              type: "button",
              className: "wbdm-btn",
              disabled: Boolean(busy),
              onClick: function() {
                op("restart");
              }
            },
            glyph(ICONS.refresh),
            C.desktopRestart
          ),
          h(
            "button",
            {
              type: "button",
              className: "wbdm-btn",
              disabled: Boolean(busy),
              onClick: function() {
                op("stop");
              }
            },
            C.desktopStop
          ),
          h(
            "button",
            {
              type: "button",
              className: "wbdm-btn primary",
              disabled: Boolean(busy),
              onClick: function() {
                op("resume");
              }
            },
            glyph(ICONS.power),
            C.desktopResume
          )
        )
      );
    }
    function ConfigView(props) {
      var api = props.api;
      var lang = props.lang;
      var t = props.t;
      var C = copy.pick(lang);
      var cfg = useConfig(api, {});
      var localS = React.useState({});
      var local = localS[0];
      var setLocal = localS[1];
      var toastS = React.useState("");
      var toast = toastS[0];
      var setToast = toastS[1];
      var seqRef = React.useRef(0);
      var aliveRef = React.useRef(true);
      React.useEffect(function() {
        aliveRef.current = true;
        return function() {
          aliveRef.current = false;
        };
      }, []);
      function values() {
        return Object.assign({}, cfg.values, local);
      }
      function toastOnce(text) {
        setToast(text);
        window.setTimeout(function() {
          if (aliveRef.current) setToast("");
        }, 2200);
      }
      function save(id, value) {
        var seq = ++seqRef.current;
        var patch = {};
        patch[id] = value;
        setLocal(function(prev) {
          return Object.assign({}, prev, patch);
        });
        Promise.resolve(api.call(DOMAIN + ".configSet", { values: patch })).then(function(r) {
          if (r && r.ok === false) throw new Error(r && r.error || C.saveFail);
          var body = unwrap(r) || {};
          if (seq !== seqRef.current) return;
          if (typeof cfg.setValues === "function") cfg.setValues(body.values);
          setLocal({});
          toastOnce(C.saved);
        }).catch(function(e) {
          setLocal(function(prev) {
            var next = Object.assign({}, prev);
            delete next[id];
            return next;
          });
          toastOnce(String(e && e.message || e));
        });
      }
      function resetAll() {
        Promise.resolve(api.call(DOMAIN + ".configReset", {})).then(function(r) {
          if (r && r.ok === false) throw new Error(r && r.error || C.saveFail);
          var body = unwrap(r) || {};
          if (typeof cfg.setValues === "function") cfg.setValues(body.values);
          seqRef.current += 1;
          setLocal({});
          toastOnce(C.resetDone);
        }).catch(function(e) {
          toastOnce(String(e && e.message || e));
        });
      }
      function switchControl(item, value) {
        return h(SW.Switch, {
          h,
          checked: value === true,
          title: labelOf(item, lang),
          ariaLabel: labelOf(item, lang),
          onChange: function(next) {
            save(item.id, next);
          }
        });
      }
      function control(item) {
        var value = values()[item.id];
        if (item.type === "bool") return switchControl(item, value);
        if (item.type === "enum") {
          return h(
            "select",
            {
              className: "wbdm-select",
              value: value === void 0 ? "" : String(value),
              "aria-label": labelOf(item, lang),
              onChange: function(e) {
                var hit = (item.values || []).filter(function(option) {
                  return String(option.value) === e.target.value;
                })[0];
                save(item.id, hit ? hit.value : e.target.value);
              }
            },
            (item.values || []).map(function(option) {
              return h(
                "option",
                { key: String(option.value), value: String(option.value) },
                lang === "en" ? option.en || option.zh || String(option.value) : option.zh || option.en || String(option.value)
              );
            })
          );
        }
        if (item.type === "int" || item.type === "number") {
          return h(NF.NumberField, {
            h,
            lang,
            value: value === void 0 ? "" : value,
            min: item.min,
            max: item.max,
            integer: item.type === "int",
            ariaLabel: labelOf(item, lang),
            onCommit: function(next) {
              save(item.id, next);
            }
          });
        }
        return h("input", {
          className: "wbdm-input",
          type: "text",
          value: value === void 0 ? "" : String(value),
          "aria-label": labelOf(item, lang),
          onChange: function(e) {
            save(item.id, e.target.value);
          }
        });
      }
      var head = h(
        "div",
        { className: "wbdm-hero" },
        h(
          "div",
          { className: "wbdm-hero-main" },
          h("div", { className: "wbdm-title" }, C.configTitle),
          h("div", { className: "wbdm-sub" }, C.configHint)
        ),
        h(
          "button",
          { type: "button", className: "wbdm-btn ghost", onClick: resetAll, disabled: !cfg.ready },
          C.resetAll
        )
      );
      if (!cfg.ready) return h("div", { className: "wbdm-wrap" }, h("div", { className: "wbdm-empty" }, C.loading));
      if (cfg.error && !cfg.items.length) {
        return h("div", { className: "wbdm-wrap" }, h("div", { className: "wbdm-notice error" }, cfg.error));
      }
      var groups = cfg.groups.length ? cfg.groups : [{ id: "all", zh: "\u5168\u90E8", en: "All" }];
      var sections = groups.map(function(group) {
        var items = cfg.items.filter(function(item) {
          return (item.group || "all") === group.id;
        });
        if (!items.length) return null;
        return h(
          "div",
          { className: "wbdm-card", key: group.id },
          h(
            "div",
            { className: "wbdm-card-h" },
            h("span", { className: "wbdm-card-t" }, lang === "en" ? group.en || group.zh : group.zh || group.en),
            h("span", { className: "wbdm-card-s" }, String(items.length) + (lang === "en" ? " options" : " \u9879"))
          ),
          items.map(function(item) {
            return h(
              "div",
              { className: "wbdm-crow", key: item.id },
              h(
                "div",
                null,
                h("div", { className: "wbdm-clabel" }, labelOf(item, lang)),
                hintOf(item, lang) ? h("div", { className: "wbdm-chint" }, hintOf(item, lang)) : null
              ),
              h("div", { className: "wbdm-ctl" }, control(item))
            );
          })
        );
      });
      return h(
        "div",
        { className: "wbdm-wrap" },
        head,
        toast ? h("div", { className: "wbdm-notice ok" }, toast) : null,
        cfg.warnings && cfg.warnings.length ? h("div", { className: "wbdm-notice warn" }, cfg.warnings.join("\uFF1B")) : null,
        sections,
        h(DesktopCard, { api, lang, t })
      );
    }
    module2.exports = ConfigView;
    module2.exports.useConfig = useConfig;
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

// packages/addons/danmaku/client/views/data.cjs
var require_data = __commonJS({
  "packages/addons/danmaku/client/views/data.cjs"(exports2, module2) {
    "use strict";
    module2.exports = require_data_view()({
      domain: "danmaku",
      prefix: "wbdm",
      tables: ["danmaku"],
      useConfig: require_config().useConfig
    });
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

// packages/addons/danmaku/client/views/actions.cjs
var require_actions = __commonJS({
  "packages/addons/danmaku/client/views/actions.cjs"(exports2, module2) {
    "use strict";
    module2.exports = require_action_schema_view()({
      domain: "danmaku",
      prefix: "wbdm"
    });
  }
});

// packages/addons/danmaku/client/client.src.cjs
var GLYPHS = require_icons2().ICONS;
var styles = require_styles();
var overlay = require_mount();
var STYLE_ID = "wbdm-styles";
function injectStyles() {
  if (document.getElementById(STYLE_ID)) return;
  var style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = styles().join("\n");
  (document.head || document.documentElement).appendChild(style);
}
injectStyles();
if (document.body) overlay.mount();
else document.addEventListener("DOMContentLoaded", function() {
  overlay.mount();
});
var ADDON_ID = "wb-addon-danmaku";
function hasAddon(host) {
  try {
    var list = host.addons || [];
    for (var i = 0; i < list.length; i += 1) {
      if (list[i] && list[i].id === ADDON_ID) return true;
    }
  } catch (error) {
    return false;
  }
  return false;
}
var icons = {
  megaphone: GLYPHS["megaphone"],
  list: GLYPHS["list"],
  settings: GLYPHS["settings"],
  database: GLYPHS["database"],
  play: GLYPHS["play"]
};
function makeTab(React) {
  return function tab(name) {
    var Icon2 = icons[name];
    return function TabIcon(props) {
      return React.createElement(Icon2, props);
    };
  };
}
function definition(host) {
  var tab = makeTab(host.react);
  return {
    id: ADDON_ID,
    version: "0.2.6",
    icon: tab("megaphone"),
    views: [
      {
        id: "library",
        icon: tab("list"),
        title: { zh: "\u5F39\u5E55\u5E93", en: "Library" },
        component: require_library()
      },
      {
        id: "config",
        icon: tab("settings"),
        title: { zh: "\u914D\u7F6E", en: "Settings" },
        component: require_config()
      },
      {
        id: "data",
        icon: tab("database"),
        title: { zh: "\u6570\u636E", en: "Data" },
        component: require_data()
      },
      {
        id: "actions",
        icon: tab("play"),
        title: { zh: "Action", en: "Actions" },
        component: require_actions()
      }
    ]
  };
}
var tries = 0;
function boot() {
  var host = window.__WB_HOST__;
  if (!host || typeof host.registerAddon !== "function" || !host.react) {
    if (tries < 120) {
      tries += 1;
      window.setTimeout(boot, 150);
    }
    return;
  }
  if (hasAddon(host)) return;
  host.registerAddon(definition(host));
  [300, 900, 1800, 3600].forEach(function(delay) {
    window.setTimeout(function() {
      var h = window.__WB_HOST__;
      if (h && typeof h.registerAddon === "function" && !hasAddon(h)) h.registerAddon(definition(h));
    }, delay);
  });
}
boot();
module.exports = { name: "dsh-workbench-danmaku", inject: [], apply: function() {
} };
    return module.exports;
  },
});
