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

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/database.mjs
var database_exports = {};
__export(database_exports, {
  __iconData: () => __iconData,
  default: () => Database
});
var __iconData, Database;
var init_database = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/database.mjs"() {
    init_createLucideIcon();
    __iconData = {
      name: "database",
      size: 24,
      node: [
        ["ellipse", { cx: "12", cy: "5", rx: "9", ry: "3", key: "msslwz" }],
        ["path", { d: "M3 5V19A9 3 0 0 0 21 19V5", key: "1wlel7" }],
        ["path", { d: "M3 12A9 3 0 0 0 21 12", key: "mv7ke4" }]
      ]
    };
    __iconData.node;
    Database = createLucideIcon(__iconData);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/eye.mjs
var eye_exports = {};
__export(eye_exports, {
  __iconData: () => __iconData2,
  default: () => Eye
});
var __iconData2, Eye;
var init_eye = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/eye.mjs"() {
    init_createLucideIcon();
    __iconData2 = {
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
    __iconData2.node;
    Eye = createLucideIcon(__iconData2);
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

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/key-round.mjs
var key_round_exports = {};
__export(key_round_exports, {
  __iconData: () => __iconData4,
  default: () => KeyRound
});
var __iconData4, KeyRound;
var init_key_round = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/key-round.mjs"() {
    init_createLucideIcon();
    __iconData4 = {
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
    __iconData4.node;
    KeyRound = createLucideIcon(__iconData4);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/layers.mjs
var layers_exports = {};
__export(layers_exports, {
  __iconData: () => __iconData5,
  default: () => Layers
});
var __iconData5, Layers;
var init_layers = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/layers.mjs"() {
    init_createLucideIcon();
    __iconData5 = {
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
    __iconData5.node;
    Layers = createLucideIcon(__iconData5);
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

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/lock.mjs
var lock_exports = {};
__export(lock_exports, {
  __iconData: () => __iconData7,
  default: () => Lock
});
var __iconData7, Lock;
var init_lock = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/lock.mjs"() {
    init_createLucideIcon();
    __iconData7 = {
      name: "lock",
      size: 24,
      node: [
        ["rect", { width: "18", height: "11", x: "3", y: "11", rx: "2", ry: "2", key: "1w4ew1" }],
        ["path", { d: "M7 11V7a5 5 0 0 1 10 0v4", key: "fwvmzm" }]
      ]
    };
    __iconData7.node;
    Lock = createLucideIcon(__iconData7);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/lock-open.mjs
var lock_open_exports = {};
__export(lock_open_exports, {
  __iconData: () => __iconData8,
  default: () => LockOpen
});
var __iconData8, LockOpen;
var init_lock_open = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/lock-open.mjs"() {
    init_createLucideIcon();
    __iconData8 = {
      name: "lock-open",
      size: 24,
      node: [
        ["rect", { width: "18", height: "11", x: "3", y: "11", rx: "2", ry: "2", key: "1w4ew1" }],
        ["path", { d: "M7 11V7a5 5 0 0 1 9.9-1", key: "1mm8w8" }]
      ],
      aliases: ["unlock"]
    };
    __iconData8.node;
    LockOpen = createLucideIcon(__iconData8);
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

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/plus.mjs
var plus_exports = {};
__export(plus_exports, {
  __iconData: () => __iconData10,
  default: () => Plus
});
var __iconData10, Plus;
var init_plus = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/plus.mjs"() {
    init_createLucideIcon();
    __iconData10 = {
      name: "plus",
      size: 24,
      node: [
        ["path", { d: "M5 12h14", key: "1ays0h" }],
        ["path", { d: "M12 5v14", key: "s699le" }]
      ]
    };
    __iconData10.node;
    Plus = createLucideIcon(__iconData10);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/refresh-cw.mjs
var refresh_cw_exports = {};
__export(refresh_cw_exports, {
  __iconData: () => __iconData11,
  default: () => RefreshCw
});
var __iconData11, RefreshCw;
var init_refresh_cw = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/refresh-cw.mjs"() {
    init_createLucideIcon();
    __iconData11 = {
      name: "refresh-cw",
      size: 24,
      node: [
        ["path", { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8", key: "v9h5vc" }],
        ["path", { d: "M21 3v5h-5", key: "1q7to0" }],
        ["path", { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16", key: "3uifl3" }],
        ["path", { d: "M8 16H3v5", key: "1cv678" }]
      ]
    };
    __iconData11.node;
    RefreshCw = createLucideIcon(__iconData11);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/shield.mjs
var shield_exports = {};
__export(shield_exports, {
  __iconData: () => __iconData12,
  default: () => Shield
});
var __iconData12, Shield;
var init_shield = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/shield.mjs"() {
    init_createLucideIcon();
    __iconData12 = {
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
    __iconData12.node;
    Shield = createLucideIcon(__iconData12);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/shield-check.mjs
var shield_check_exports = {};
__export(shield_check_exports, {
  __iconData: () => __iconData13,
  default: () => ShieldCheck
});
var __iconData13, ShieldCheck;
var init_shield_check = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/shield-check.mjs"() {
    init_createLucideIcon();
    __iconData13 = {
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
    __iconData13.node;
    ShieldCheck = createLucideIcon(__iconData13);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/shield-plus.mjs
var shield_plus_exports = {};
__export(shield_plus_exports, {
  __iconData: () => __iconData14,
  default: () => ShieldPlus
});
var __iconData14, ShieldPlus;
var init_shield_plus = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/shield-plus.mjs"() {
    init_createLucideIcon();
    __iconData14 = {
      name: "shield-plus",
      size: 24,
      node: [
        [
          "path",
          {
            d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
            key: "oel41y"
          }
        ],
        ["path", { d: "M9 12h6", key: "1c52cq" }],
        ["path", { d: "M12 9v6", key: "199k2o" }]
      ]
    };
    __iconData14.node;
    ShieldPlus = createLucideIcon(__iconData14);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/sliders-horizontal.mjs
var sliders_horizontal_exports = {};
__export(sliders_horizontal_exports, {
  __iconData: () => __iconData15,
  default: () => SlidersHorizontal
});
var __iconData15, SlidersHorizontal;
var init_sliders_horizontal = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/sliders-horizontal.mjs"() {
    init_createLucideIcon();
    __iconData15 = {
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
    __iconData15.node;
    SlidersHorizontal = createLucideIcon(__iconData15);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/trash.mjs
var __iconData16, Trash;
var init_trash = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/trash.mjs"() {
    init_createLucideIcon();
    __iconData16 = {
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
    __iconData16.node;
    Trash = createLucideIcon(__iconData16);
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
  __iconData: () => __iconData17,
  default: () => X
});
var __iconData17, X;
var init_x = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/x.mjs"() {
    init_createLucideIcon();
    __iconData17 = {
      name: "x",
      size: 24,
      node: [
        ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
        ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
      ]
    };
    __iconData17.node;
    X = createLucideIcon(__iconData17);
  }
});

// packages/addons/vault/client/ui/icons.cjs
var require_icons2 = __commonJS({
  "packages/addons/vault/client/ui/icons.cjs"(exports2, module2) {
    "use strict";
    var icons = require_icons();
    var set = icons.create("wbv", {
      "database": (init_database(), __toCommonJS(database_exports)).default,
      "eye": (init_eye(), __toCommonJS(eye_exports)).default,
      "folder": (init_folder(), __toCommonJS(folder_exports)).default,
      "key-round": (init_key_round(), __toCommonJS(key_round_exports)).default,
      "layers": (init_layers(), __toCommonJS(layers_exports)).default,
      "list": (init_list(), __toCommonJS(list_exports)).default,
      "lock": (init_lock(), __toCommonJS(lock_exports)).default,
      "lock-open": (init_lock_open(), __toCommonJS(lock_open_exports)).default,
      "pencil": (init_pencil(), __toCommonJS(pencil_exports)).default,
      "plus": (init_plus(), __toCommonJS(plus_exports)).default,
      "refresh-cw": (init_refresh_cw(), __toCommonJS(refresh_cw_exports)).default,
      "shield": (init_shield(), __toCommonJS(shield_exports)).default,
      "shield-check": (init_shield_check(), __toCommonJS(shield_check_exports)).default,
      "shield-plus": (init_shield_plus(), __toCommonJS(shield_plus_exports)).default,
      "sliders-horizontal": (init_sliders_horizontal(), __toCommonJS(sliders_horizontal_exports)).default,
      "trash-2": (init_trash_2(), __toCommonJS(trash_2_exports)).default,
      "x": (init_x(), __toCommonJS(x_exports)).default
    });
    module2.exports = { ICONS: set.ICONS, Icon: set.Icon };
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

// packages/addons/lib/vault-lock.cjs
var require_vault_lock = __commonJS({
  "packages/addons/lib/vault-lock.cjs"(exports2, module2) {
    "use strict";
    var POLL_MS = 4e3;
    function create(options) {
      var cfg = options || {};
      var prefix = String(cfg.prefix || "wb");
      var wrapClass = String(cfg.wrapClass || prefix);
      var lock = {
        POLL_MS: Number(cfg.pollMs) > 0 ? Number(cfg.pollMs) : POLL_MS,
        prefix,
        use,
        Panel,
        styles
      };
      function use(opts) {
        var React = opts.React;
        var api = opts.api;
        var C = opts.C;
        var every = Number(opts.pollMs) > 0 ? Number(opts.pollMs) : Number(lock.POLL_MS) || POLL_MS;
        var action = opts.action || "vault.status";
        var st = React.useState({ ready: false, locked: true, initialized: false, error: "" });
        var tick = React.useState(0);
        function read() {
          return C.call(api, action).then(function(data) {
            st[1](function(old) {
              var next = {
                ready: true,
                locked: !(data && data.locked === false),
                initialized: !!(data && data.initialized),
                error: ""
              };
              if (old.ready === next.ready && old.locked === next.locked && old.initialized === next.initialized && !old.error) return old;
              return next;
            });
          }).catch(function(e) {
            st[1](function(old) {
              return Object.assign({}, old, { ready: true, locked: true, error: C.errText(e) });
            });
          });
        }
        React.useEffect(function() {
          var alive = true;
          function poll() {
            if (alive) read();
          }
          poll();
          var timer = setInterval(poll, every);
          if (timer && typeof timer.unref === "function") timer.unref();
          return function() {
            alive = false;
            clearInterval(timer);
          };
        }, [tick[0]]);
        return {
          ready: st[0].ready,
          locked: st[0].locked,
          initialized: st[0].initialized,
          error: st[0].error,
          refresh: function() {
            tick[1](tick[0] + 1);
          }
        };
      }
      function Panel(props) {
        var h = props.h;
        var C = props.C;
        var lang = props.lang === "en" ? "en" : "zh";
        var Icon2 = props.Icon || cfg.Icon || null;
        function pick(custom, fallback) {
          var v = custom !== void 0 ? custom : fallback;
          if (v && typeof v === "object") return v[lang] || v.zh || v.en || "";
          return v || "";
        }
        return h(
          "div",
          { className: props.wrapClass || wrapClass },
          h(
            "div",
            { className: prefix + "-lock-card", role: "status", "aria-live": "polite" },
            Icon2 ? h(Icon2, { size: 22, strokeWidth: 2, "aria-hidden": "true", className: prefix + "-lock-ico" }) : null,
            h("div", { className: prefix + "-lock-title" }, pick(props.title, cfg.title)),
            h("div", { className: prefix + "-muted" }, pick(props.hint, cfg.hint)),
            props.error ? h(C.Notice, { h, kind: "error", text: props.error }) : null
          )
        );
      }
      function styles() {
        return [
          "." + prefix + "-lock-card{max-width:560px;margin:28px auto;padding:26px 24px;border:1px solid var(--wb-border);border-radius:12px;background:var(--wb-card);display:flex;flex-direction:column;gap:8px;align-items:flex-start}",
          "." + prefix + "-lock-ico{color:var(--wb-muted)}",
          "." + prefix + "-lock-title{font-size:15px;font-weight:600}"
        ];
      }
      return lock;
    }
    module2.exports = { create, POLL_MS };
  }
});

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

// packages/addons/lib/icon-label.cjs
var require_icon_label = __commonJS({
  "packages/addons/lib/icon-label.cjs"(exports2, module2) {
    "use strict";
    module2.exports = function iconLabel(h, Icon2, text) {
      return h(
        "span",
        { className: "wb-icon-label" },
        Icon2 ? h(Icon2, { size: 14, strokeWidth: 2, "aria-hidden": true, focusable: false }) : null,
        h("span", null, text)
      );
    };
    module2.exports.styles = ".wb-icon-label{display:inline-flex;align-items:center;gap:5px;max-width:100%;vertical-align:middle;text-align:start}.wb-icon-label>svg{flex:none}.wb-icon-label>span{min-width:0;overflow-wrap:anywhere}";
  }
});

// packages/addons/vault/client/ui/styles.cjs
var require_styles = __commonJS({
  "packages/addons/vault/client/ui/styles.cjs"(exports2, module2) {
    "use strict";
    module2.exports = [
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
      "@media (max-width:900px){.wbv-split{grid-template-columns:1fr}.wbv-head{flex-direction:column;align-items:stretch}.wbv-head-actions{justify-content:flex-start}.wbv-toolbar>.wbv-search{flex:1 1 100%;width:100%}}"
    ].concat(require_stepper().styles, require_staged_dialog().styles).concat(require_vault_lock().create({ prefix: "wbv" }).styles()).concat(require_filter_checklist_styles()).concat(require_client_base_styles().secretFieldStyles, require_icon_label().styles);
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

// packages/addons/vault/client/ui/common.cjs
var require_common = __commonJS({
  "packages/addons/vault/client/ui/common.cjs"(exports2, module2) {
    "use strict";
    module2.exports = require_client_common()("wbv");
  }
});

// packages/addons/vault/client/ui/page.cjs
var require_page = __commonJS({
  "packages/addons/vault/client/ui/page.cjs"(exports2, module2) {
    "use strict";
    function PageHead(props) {
      var h = props.h;
      return h(
        "div",
        { className: "wbv-head" },
        h(
          "div",
          { className: "wbv-head-main" },
          h("div", { className: "wbv-title-row" }, h("h2", { className: "wbv-title" }, props.title), props.pill || null),
          props.sub ? h("p", { className: "wbv-sub" }, props.sub) : null
        ),
        props.actions ? h("div", { className: "wbv-head-actions" }, props.actions) : null
      );
    }
    function Toolbar(props) {
      var h = props.h;
      return h("div", { className: "wbv-toolbar" }, props.children);
    }
    function Card(props) {
      var h = props.h;
      return h(
        "section",
        { className: "wbv-card" + (props.className ? " " + props.className : "") },
        props.title || props.actions ? h(
          "div",
          { className: "wbv-card-head" },
          props.title ? h("h3", { className: "wbv-card-title" }, props.title) : h("span", null),
          props.actions ? h("div", { className: "wbv-card-actions" }, props.actions) : null
        ) : null,
        props.children
      );
    }
    function Stat(props) {
      var h = props.h;
      return h(
        "div",
        { className: "wbv-stat" },
        h("div", { className: "wbv-stat-label" }, props.label),
        h("div", { className: "wbv-stat-value" }, props.value),
        props.hint ? h("div", { className: "wbv-stat-hint" }, props.hint) : null
      );
    }
    function EmptyState(props) {
      var h = props.h;
      var Icon2 = props.icon;
      return h(
        "div",
        { className: "wbv-empty-card" },
        Icon2 ? h("span", { className: "wbv-empty-icon" }, h(Icon2, { size: 22, strokeWidth: 1.6, "aria-hidden": true, focusable: false })) : null,
        props.title ? h("div", { className: "wbv-empty-title" }, props.title) : null,
        props.hint ? h("div", { className: "wbv-muted" }, props.hint) : null,
        props.children ? h("div", { className: "wbv-empty-actions" }, props.children) : null
      );
    }
    function DataTable(props) {
      var h = props.h;
      var cols = props.columns || [];
      var rows = props.rows || [];
      return h(
        "div",
        { className: "wbv-table-wrap", role: "region", "aria-label": props.label || "\u6570\u636E\u8868", tabIndex: 0 },
        h(
          "table",
          { className: "wbv-table" },
          h(
            "thead",
            null,
            h(
              "tr",
              null,
              cols.map(function(c) {
                return h(
                  "th",
                  { key: c.key, scope: "col", className: c.align === "right" ? "wbv-right" : void 0, style: c.width ? { width: c.width } : null },
                  c.label
                );
              })
            )
          ),
          h(
            "tbody",
            null,
            rows.length ? rows.map(function(row, i) {
              return props.renderRow(row, i);
            }) : h("tr", null, h("td", { className: "wbv-table-empty", colSpan: cols.length || 1 }, props.empty || "\u6682\u65E0\u6570\u636E"))
          )
        )
      );
    }
    function control(tag) {
      return function Control(props) {
        var h = props.h;
        var rest = {};
        for (var k in props) {
          if (k !== "h" && k !== "className") rest[k] = props[k];
        }
        rest.className = ("wbv-" + tag + " " + (props.className || "")).trim();
        return h(tag, rest);
      };
    }
    module2.exports = {
      PageHead,
      Toolbar,
      Card,
      Stat,
      EmptyState,
      DataTable,
      Input: control("input"),
      Select: control("select"),
      Textarea: control("textarea")
    };
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/eye-off.mjs
var eye_off_exports = {};
__export(eye_off_exports, {
  __iconData: () => __iconData18,
  default: () => EyeOff
});
var __iconData18, EyeOff;
var init_eye_off = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/eye-off.mjs"() {
    init_createLucideIcon();
    __iconData18 = {
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
    __iconData18.node;
    EyeOff = createLucideIcon(__iconData18);
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

// packages/addons/vault/client/ui/dialog.cjs
var require_dialog = __commonJS({
  "packages/addons/vault/client/ui/dialog.cjs"(exports2, module2) {
    "use strict";
    var createOverlay = require_overlay();
    var stagedFactory = require_staged_dialog();
    var GLYPHS2 = require_icons2().ICONS;
    var Dialog = createOverlay({
      tag: "div",
      maskClass: "wbv-modal",
      dialogClass: "wbv-modal-box",
      ariaLabelledByOf: function(props) {
        return props.titleId || null;
      },
      header: function(props) {
        var h = props.h;
        if (!props.title && !props.onClose) return null;
        var Close = GLYPHS2["x"];
        return h(
          "div",
          { className: "wbv-modal-head" },
          props.title ? h("h3", { className: "wbv-modal-title", id: props.titleId }, props.title) : h("span", null),
          props.onClose ? h(
            "button",
            {
              type: "button",
              className: "wbv-icon-btn",
              "aria-label": props.closeLabel || "\u5173\u95ED",
              title: props.closeLabel || "\u5173\u95ED",
              disabled: props.busy,
              onClick: props.onClose
            },
            Close ? h(Close, { size: 15, strokeWidth: 2, "aria-hidden": true, focusable: false }) : "\xD7"
          ) : null
        );
      }
    });
    function ConfirmDialog(props) {
      var h = props.h;
      return h(
        Dialog,
        {
          h,
          React: props.React,
          title: props.title || "\u8BF7\u786E\u8BA4",
          titleId: props.titleId || "wbv-confirm-title",
          onClose: props.busy ? null : props.onCancel,
          closeOnEscape: !props.busy,
          closeOnMask: !props.busy,
          busy: props.busy
        },
        props.message ? h("p", { className: "wbv-modal-sub" }, props.message) : null,
        props.children ? h("div", { className: "wbv-modal-body" }, props.children) : null,
        h(
          "div",
          { className: "wbv-modal-foot" },
          h("button", { type: "button", className: "wbv-btn", disabled: props.busy, onClick: props.onCancel }, props.cancelText || "\u53D6\u6D88"),
          h(
            "button",
            {
              type: "button",
              className: "wbv-btn " + (props.primary ? "primary" : "danger"),
              disabled: props.busy,
              onClick: props.onConfirm
            },
            props.busy ? props.busyText || "\u5904\u7406\u4E2D\u2026" : props.confirmText || "\u786E\u8BA4"
          )
        )
      );
    }
    var FormDialog = stagedFactory.createStagedDialog({
      tag: "div",
      maskClass: "wbv-modal",
      dialogClass: "wbv-modal-box",
      displayName: "VaultFormDialog",
      ariaLabelledByOf: function(props) {
        return props.titleId || null;
      },
      header: function(props) {
        var h = props.h;
        if (!props.title && !props.onClose) return null;
        var Close = GLYPHS2["x"];
        return h(
          "div",
          { className: "wbv-modal-head" },
          props.title ? h("h3", { className: "wbv-modal-title", id: props.titleId }, props.title) : h("span", null),
          props.onClose ? h(
            "button",
            {
              type: "button",
              className: "wbv-icon-btn",
              "aria-label": props.closeLabel || "\u5173\u95ED",
              title: props.closeLabel || "\u5173\u95ED",
              disabled: !!props.submitting,
              onClick: props.onClose
            },
            Close ? h(Close, { size: 15, strokeWidth: 2, "aria-hidden": true, focusable: false }) : "\xD7"
          ) : null
        );
      },
      closeOnEscape: function(props) {
        return !props.submitting;
      },
      closeOnMask: function(props) {
        return !props.submitting;
      }
    });
    module2.exports = { Dialog, ConfirmDialog, FormDialog };
  }
});

// packages/addons/vault/client/ui/ask-passphrase.cjs
var require_ask_passphrase = __commonJS({
  "packages/addons/vault/client/ui/ask-passphrase.cjs"(exports2, module2) {
    "use strict";
    var SecretField = require_secret_field();
    var Dialog = require_dialog().Dialog;
    module2.exports = function AskPassphraseModal(props) {
      var h = props.h;
      var C = props.C;
      return h(
        Dialog,
        {
          h,
          React: props.React,
          title: props.title || "\u8F93\u5165\u4E3B\u53E3\u4EE4",
          titleId: "wbv-ask-passphrase-title",
          onClose: props.busy ? null : props.onCancel,
          closeOnEscape: !props.busy,
          closeOnMask: !props.busy,
          busy: props.busy,
          // 首焦点交给输入框（下面 SecretField 的 autoFocus），不要落在对话框容器上。
          autoFocus: false
        },
        props.hint ? h("p", { className: "wbv-modal-sub" }, props.hint) : null,
        h(
          "div",
          { className: "wbv-modal-body" },
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
          props.error ? h(C.Notice, { h, kind: "error", text: props.error }) : null
        ),
        h(
          "div",
          { className: "wbv-modal-foot" },
          h(C.Btn, { h, disabled: props.busy, onClick: props.onCancel }, "\u53D6\u6D88"),
          h(C.Btn, { h, kind: "primary", disabled: props.busy || !props.value, onClick: props.onConfirm }, props.busy ? "\u5904\u7406\u4E2D\u2026" : "\u786E\u8BA4")
        )
      );
    };
  }
});

// packages/addons/vault/client/views/status.cjs
var require_status = __commonJS({
  "packages/addons/vault/client/views/status.cjs"(exports2, module2) {
    "use strict";
    var GLYPHS2 = require_icons2().ICONS;
    var C = require_common();
    var P = require_page();
    var iconLabel = require_icon_label();
    var SecretField = require_secret_field();
    var AskPassphrase = require_ask_passphrase();
    var Lock2 = GLYPHS2["lock"];
    var Unlock = GLYPHS2["lock-open"];
    var ShieldPlus2 = GLYPHS2["shield-plus"];
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
      var askModal = askS[0] ? h(AskPassphrase, {
        h,
        React,
        C,
        title: "\u5207\u56DE A \u6A21\u5F0F",
        hint: "\u5207\u6362\u540E\u4E0B\u6B21\u542F\u52A8\u9700\u8981\u91CD\u65B0\u89E3\u9501\uFF0C\u8BF7\u9A8C\u8BC1\u4E3B\u53E3\u4EE4\u3002",
        value: askS[0].value,
        busy: askS[0].busy,
        error: askS[0].error,
        show: askS[0].show,
        onChange: function(v) {
          askS[1](Object.assign({}, askS[0], { value: v }));
        },
        onToggle: function() {
          askS[1](Object.assign({}, askS[0], { show: !askS[0].show }));
        },
        onCancel: function() {
          if (!askS[0].busy) askS[1](null);
        },
        onConfirm: confirmAsk
      }) : null;
      function pageHead(title, sub, extra) {
        return h(P.PageHead, { h, title, sub, actions: extra });
      }
      if (st[0].loading) {
        return h(
          "div",
          { className: "wbv" },
          pageHead("\u51ED\u636E\u4FDD\u9669\u7BB1", "\u6B63\u5728\u8BFB\u53D6\u4FDD\u9669\u7BB1\u72B6\u6001\u2026"),
          h(C.Empty, { h, text: "\u6B63\u5728\u8BFB\u53D6\u4FDD\u9669\u7BB1\u72B6\u6001\u2026" })
        );
      }
      if (error) {
        return h(
          "div",
          { className: "wbv" },
          pageHead("\u51ED\u636E\u4FDD\u9669\u7BB1", "\u8BFB\u53D6\u72B6\u6001\u5931\u8D25\uFF0C\u53EF\u4EE5\u91CD\u8BD5\uFF1B\u53E3\u4EE4\u4E0E\u51ED\u636E\u4E0D\u4F1A\u56E0\u6B64\u4E22\u5931\u3002"),
          h(C.Notice, { h, kind: "error", text: error }),
          h("div", { className: "wbv-row" }, h(C.Btn, { h, onClick: refresh }, iconLabel(h, GLYPHS2["refresh-cw"], "\u91CD\u8BD5"))),
          askModal
        );
      }
      if (!status || !status.initialized) {
        return h(
          "div",
          { className: "wbv" },
          pageHead("\u521D\u59CB\u5316\u51ED\u636E\u4FDD\u9669\u7BB1", "\u53E3\u4EE4\u53EA\u7528\u4E8E\u6D3E\u751F\u5BC6\u94A5\uFF0C\u4E0D\u4F1A\u843D\u5E93\uFF1B\u5FD8\u8BB0\u53E3\u4EE4\u65E0\u6CD5\u6062\u590D\u5DF2\u4FDD\u5B58\u7684\u51ED\u636E\u3002"),
          h(C.Notice, { h, kind: "info", text: "\u9ED8\u8BA4 A \u6A21\u5F0F\uFF1A\u6BCF\u6B21\u542F\u52A8\u540E\u9700\u8981\u91CD\u65B0\u89E3\u9501\u3002\u53EF\u7A0D\u540E\u5728\u8BBE\u7F6E\u91CC\u6539\u6210\u81EA\u52A8\u89E3\u9501\u3002" }),
          h(
            P.Card,
            { h, title: "\u521B\u5EFA\u4FDD\u9669\u7BB1" },
            h(
              "div",
              { className: "wbv-form-grid" },
              h(
                C.Field,
                { h, label: "\u4E3B\u53E3\u4EE4\uFF08\u81F3\u5C11 12 \u4F4D\uFF09", hint: "\u7528\u4E8E\u6D3E\u751F\u5BC6\u94A5\uFF0C\u8BF7\u81EA\u884C\u59A5\u5584\u4FDD\u5B58" },
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
                { h, label: "\u89E3\u9501\u6A21\u5F0F", hint: "\u4E4B\u540E\u53EF\u5728\u300C\u8BBE\u7F6E\u300D\u9875\u8C03\u6574" },
                h(
                  P.Select,
                  {
                    h,
                    value: mode[0],
                    onChange: function(e) {
                      mode[1](e.target.value);
                    }
                  },
                  h("option", { value: "A" }, "A \u5168\u9501\uFF08\u63A8\u8350\uFF09"),
                  h("option", { value: "B" }, "B \u81EA\u52A8\u89E3\u9501\uFF0C\u67E5\u770B\u51ED\u636E\u518D\u8F93\u53E3\u4EE4"),
                  h("option", { value: "C" }, "C \u81EA\u52A8\u89E3\u9501\uFF0C\u67E5\u770B\u514D\u53E3\u4EE4\uFF08\u4E0D\u5EFA\u8BAE\uFF09")
                )
              )
            ),
            h(C.Notice, { h, kind: "error", text: msg[0] }),
            h(
              "div",
              { className: "wbv-form-actions" },
              h("span", { className: "wbv-grow" }),
              h(C.Btn, { h, kind: "primary", disabled: busy[0], onClick: function() {
                if (pass[0].length < 12) return msg[1]("\u53E3\u4EE4\u81F3\u5C11 12 \u4E2A\u5B57\u7B26");
                if (pass[0] !== pass2[0]) return msg[1]("\u4E24\u6B21\u8F93\u5165\u4E0D\u4E00\u81F4");
                run(function() {
                  return C.call(api, "vault.setup", { passphrase: pass[0], mode: mode[0] });
                });
              } }, iconLabel(h, ShieldPlus2, busy[0] ? "\u521D\u59CB\u5316\u4E2D\u2026" : "\u521B\u5EFA\u4FDD\u9669\u7BB1"))
            )
          ),
          askModal
        );
      }
      if (status.locked) {
        return h(
          "div",
          { className: "wbv" },
          pageHead("\u4FDD\u9669\u7BB1\u5DF2\u9501\u5B9A", "\u8F93\u5165\u4E3B\u53E3\u4EE4\u89E3\u9501\u3002\u89E3\u9501\u72B6\u6001\u53EA\u4FDD\u5B58\u5728\u5F53\u524D\u8FDB\u7A0B\u5185\u5B58\uFF0C\u7A7A\u95F2\u8D85\u65F6\u4F1A\u81EA\u52A8\u9501\u5B9A\u3002"),
          h(
            P.Card,
            { h, title: "\u89E3\u9501" },
            h(
              "div",
              { className: "wbv-form-grid" },
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
              )
            ),
            h(
              "div",
              { className: "wbv-form-actions" },
              h("span", { className: "wbv-grow wbv-muted" }, "\u6A21\u5F0F\uFF1A" + modeName(status.unlockMode) + "\uFF1B\u8FDE\u7EED\u5931\u8D25 5 \u6B21\u4F1A\u9501\u5B9A 5 \u5206\u949F\u3002"),
              h(C.Btn, { h, kind: "primary", disabled: busy[0], onClick: function() {
                if (!pass[0]) return msg[1]("\u8BF7\u8F93\u5165\u53E3\u4EE4");
                run(function() {
                  return C.call(api, "vault.unlock", { passphrase: pass[0] });
                });
              } }, iconLabel(h, Unlock, busy[0] ? "\u89E3\u9501\u4E2D\u2026" : "\u89E3\u9501"))
            )
          ),
          h(C.Notice, { h, kind: "error", text: msg[0] }),
          askModal
        );
      }
      var modeText = modeName(status.unlockMode);
      return h(
        "div",
        { className: "wbv" },
        pageHead("\u51ED\u636E\u4FDD\u9669\u7BB1", "\u660E\u6587\u53EA\u5728\u672C\u673A\u89E3\u9501\u540E\u53EF\u89C1\uFF1B\u4E0B\u65B9\u662F\u6982\u51B5\u4E0E\u5FEB\u6377\u64CD\u4F5C\u3002", [
          h(C.Pill, { h, kind: "ok", key: "state" }, iconLabel(h, Unlock, "\u5DF2\u89E3\u9501")),
          h(C.Btn, { h, key: "lock", onClick: function() {
            run(function() {
              return C.call(api, "vault.lock");
            });
          } }, iconLabel(h, Lock2, "\u7ACB\u5373\u9501\u5B9A")),
          h(C.Btn, { h, key: "mode", onClick: function() {
            askS[1]({ value: "", busy: false, error: "", show: false });
          } }, "\u5207\u56DE A \u6A21\u5F0F")
        ]),
        h(
          "div",
          { className: "wbv-stats" },
          h(P.Stat, { h, label: "\u51ED\u636E\u6570\u91CF", value: status.secretCount || 0 }),
          h(P.Stat, { h, label: "\u5206\u7EC4\u6570\u91CF", value: status.groupCount || 0 }),
          h(P.Stat, { h, label: "\u89E3\u9501\u6A21\u5F0F", value: status.unlockMode, hint: modeText }),
          h(P.Stat, { h, label: "\u4E0A\u6B21\u89E3\u9501", value: C.fmtTime(status.lastUnlockAt, lang) })
        ),
        h(C.Notice, { h, kind: "info", text: "agent \u53EA\u80FD\u770B\u5230\u540D\u79F0\u548C\u5907\u6CE8\uFF1B\u67E5\u770B\u660E\u6587\u5FC5\u987B\u7531\u4F60\u5728\u754C\u9762\u4E0A\u64CD\u4F5C\u3002" }),
        h(C.Notice, { h, kind: "error", text: msg[0] }),
        askModal
      );
    };
    function modeName(mode) {
      if (mode === "B") return "\u542F\u52A8\u81EA\u52A8\u89E3\u9501\uFF0C\u67E5\u770B\u51ED\u636E\u9700\u53E3\u4EE4";
      if (mode === "C") return "\u542F\u52A8\u81EA\u52A8\u89E3\u9501\uFF0C\u67E5\u770B\u514D\u53E3\u4EE4";
      return "\u5168\u9501\uFF1A\u6BCF\u6B21\u542F\u52A8\u9700\u89E3\u9501";
    }
  }
});

// packages/addons/vault/client/ui/lock.cjs
var require_lock = __commonJS({
  "packages/addons/vault/client/ui/lock.cjs"(exports2, module2) {
    "use strict";
    module2.exports = require_vault_lock().create({
      prefix: "wbv",
      Icon: require_icons2().ICONS.lock,
      title: { zh: "\u4FDD\u9669\u7BB1\u5DF2\u9501\u5B9A", en: "Vault is locked" },
      hint: {
        zh: "\u8BF7\u5148\u5728\u300C\u4FDD\u9669\u7BB1\u300D\u9875\u89E3\u9501\uFF1B\u89E3\u9501\u540E\u672C\u9875\u4F1A\u81EA\u52A8\u6062\u590D\u5217\u8868\u4E0E\u8BE6\u60C5\u3002",
        en: "Unlock it on the Vault page first; this page recovers automatically once unlocked."
      }
    });
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
      app_password: "\u6388\u6743\u7801",
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
    var GLYPHS2 = require_icons2().ICONS;
    var C = require_common();
    var P = require_page();
    var AskPassphrase = require_ask_passphrase();
    var Dialog = require_dialog().Dialog;
    var ConfirmDialog = require_dialog().ConfirmDialog;
    var FormDialog = require_dialog().FormDialog;
    var iconLabel = require_icon_label();
    var SecretField = require_secret_field();
    var Lock2 = require_lock();
    var Refresh = GLYPHS2["refresh-cw"];
    var Unlock = GLYPHS2["lock-open"];
    var Plus2 = GLYPHS2["plus"];
    var Eye2 = GLYPHS2["eye"];
    var Pencil2 = GLYPHS2["pencil"];
    var Trash2 = GLYPHS2["trash-2"];
    var KeyIcon = GLYPHS2["key-round"];
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
      var delS = React.useState(null);
      var guard = Lock2.use({ api, C, React });
      var inflight = React.useState({ seq: 0 })[0];
      var rows = listS[0].rows;
      function load() {
        if (guard.locked) {
          listS[1]({ loading: false, rows: [], error: "" });
          return;
        }
        var seq = inflight.seq += 1;
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
          if (inflight.seq !== seq) return;
          listS[1]({ loading: false, rows: r[0] && (r[0].items || r[0].secrets) || [], error: "" });
          statusS[1](r[1]);
          setsS[1](r[2] && r[2].items || []);
        }).catch(function(e) {
          if (inflight.seq !== seq) return;
          listS[1]({ loading: false, rows: [], error: C.errText(e) });
        });
      }
      React.useEffect(function() {
        if (!guard.ready) return;
        inflight.seq += 1;
        if (guard.locked) {
          listS[1]({ loading: false, rows: [], error: "" });
          revealS[1](null);
          askS[1](null);
          unlockS[1](null);
          delS[1](null);
          formS[1](emptyForm());
          editingS[1](false);
          showSecretS[1](false);
          msgS[1]("");
          return;
        }
        load();
      }, [guard.ready, guard.locked]);
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
      function closeForm() {
        editingS[1](false);
        showSecretS[1](false);
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
      function remove(row) {
        delS[1]({ row });
      }
      function confirmRemove() {
        var d = delS[0];
        if (!d) return;
        busyS[1](true);
        msgS[1]("");
        C.call(api, "vault.secretDelete", { id: d.row.id }).then(function() {
          busyS[1](false);
          delS[1](null);
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
      function copyRevealed() {
        if (!revealS[0] || !navigator.clipboard) return;
        navigator.clipboard.writeText(revealS[0].secret).then(function() {
          msgS[1]("\u5DF2\u590D\u5236");
        }, function() {
          msgS[1]("\u590D\u5236\u5931\u8D25\uFF0C\u8BF7\u624B\u52A8\u9009\u4E2D\u590D\u5236");
        });
      }
      var setIndex = {};
      setsS[0].forEach(function(s) {
        setIndex[s.id] = s.name;
      });
      if (!guard.ready) return h("div", { className: "wbv" }, h(C.Empty, { h, text: "\u6B63\u5728\u8BFB\u53D6\u4FDD\u9669\u7BB1\u72B6\u6001\u2026" }));
      if (guard.locked) return h(Lock2.Panel, { h, C, lang, error: guard.error });
      var locked = statusS[0] && statusS[0].locked;
      var filtered = Boolean(qS[0] || kindS[0]);
      var columns = [
        { key: "name", label: "\u540D\u79F0" },
        { key: "kind", label: "\u7C7B\u578B" },
        { key: "sets", label: "\u6240\u5C5E\u96C6\u5408" },
        { key: "note", label: "\u5907\u6CE8" },
        { key: "used", label: "\u6700\u8FD1\u4F7F\u7528" },
        { key: "ops", label: "\u64CD\u4F5C", align: "right" }
      ];
      function renderRow(row) {
        var meta = {};
        try {
          meta = JSON.parse(row.meta || "{}");
        } catch (e) {
          meta = {};
        }
        var chips = (row.setIds || []).map(function(id) {
          return h("span", { key: id, className: "wbv-chip" }, h("span", null, setIndex[id] || id));
        });
        return h(
          "tr",
          { key: row.id },
          h("td", null, h("div", { className: "wbv-cell-main" }, row.name), h("div", { className: "wbv-cell-sub" }, row.id)),
          h("td", null, h("span", { className: "wbv-pill" }, KIND_LABEL[row.kind] || row.kind)),
          h("td", null, chips.length ? h("div", { className: "wbv-chips" }, chips) : h("span", { className: "wbv-muted" }, "\u672A\u52A0\u5165\u96C6\u5408")),
          h("td", null, noteOf(meta) || "\u2014"),
          h("td", null, C.fmtTime(row.lastUsedAt, lang)),
          h("td", null, h(
            "div",
            { className: "wbv-actions" },
            h(C.Btn, { h, kind: "ghost", onClick: function() {
              reveal(row);
            } }, iconLabel(h, Eye2, "\u67E5\u770B")),
            h(C.Btn, { h, kind: "ghost", onClick: function() {
              startEdit(row);
            } }, iconLabel(h, Pencil2, "\u7F16\u8F91")),
            h(C.Btn, { h, kind: "ghost wbv-delete", onClick: function() {
              remove(row);
            } }, iconLabel(h, Trash2, "\u5220\u9664"))
          ))
        );
      }
      return h(
        "div",
        { className: "wbv" },
        h(P.PageHead, {
          h,
          title: "\u51ED\u636E\u5E93",
          sub: "\u51ED\u636E\u6309\u300C\u96C6\u5408\u4E0E\u8D26\u53F7\u300D\u7EC4\u7EC7\uFF1A\u4E00\u6761\u51ED\u636E\u53EF\u4EE5\u8FDB\u591A\u4E2A\u96C6\u5408\uFF0C\u4E00\u4E2A\u96C6\u5408\u53EF\u4EE5\u6807\u4E00\u4E2A\u8D26\u53F7\u3001\u6302\u5230\u591A\u4E2A\u5206\u7EC4\u3002\u660E\u6587\u53EA\u5728\u672C\u673A\u89E3\u9501\u540E\u53EF\u89C1\u3002",
          actions: [
            h(C.Btn, { h, key: "refresh", onClick: load }, iconLabel(h, Refresh, "\u5237\u65B0")),
            locked ? h(C.Btn, { h, key: "unlock", kind: "primary", onClick: function() {
              askUnlock("");
            } }, iconLabel(h, Unlock, "\u89E3\u9501")) : null,
            h(C.Btn, { h, key: "create", kind: "primary", onClick: startCreate }, iconLabel(h, Plus2, "\u65B0\u589E\u51ED\u636E"))
          ]
        }),
        h(
          P.Toolbar,
          { h },
          h(P.Input, {
            h,
            className: "wbv-search",
            placeholder: "\u641C\u7D22\u540D\u79F0\u3001\u5907\u6CE8\u6216\u96C6\u5408\u4E0E\u8D26\u53F7",
            "aria-label": "\u641C\u7D22\u51ED\u636E",
            value: qS[0],
            onChange: function(e) {
              qS[1](e.target.value);
            },
            onKeyDown: function(e) {
              if (e.key === "Enter") load();
            }
          }),
          h(
            P.Select,
            {
              h,
              value: kindS[0],
              "aria-label": "\u6309\u7C7B\u578B\u7B5B\u9009",
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
          h("span", { className: "wbv-toolbar-tail" }),
          h("span", { className: "wbv-muted" }, listS[0].loading ? "\u8BFB\u53D6\u4E2D\u2026" : rows.length + " \u6761")
        ),
        locked ? h(C.Notice, { h, kind: "error", text: "\u4FDD\u9669\u7BB1\u5DF2\u9501\u5B9A\uFF08" + (statusS[0].unlockMode || "A") + " \u6A21\u5F0F\uFF09\uFF1A\u65B0\u589E\u3001\u7F16\u8F91\u548C\u67E5\u770B\u660E\u6587\u90FD\u9700\u8981\u5148\u89E3\u9501\u3002\u70B9\u53F3\u4E0A\u89D2\u300C\u89E3\u9501\u300D\uFF0C\u6216\u76F4\u63A5\u4FDD\u5B58\u65F6\u6309\u63D0\u793A\u89E3\u9501\u3002" }) : null,
        h(C.Notice, { h, kind: "error", text: listS[0].error || msgS[0] }),
        listS[0].loading ? h(C.Empty, { h, text: "\u8BFB\u53D6\u4E2D\u2026" }) : rows.length === 0 ? h(
          P.EmptyState,
          {
            h,
            icon: KeyIcon,
            title: filtered ? "\u6CA1\u6709\u5339\u914D\u7684\u51ED\u636E" : "\u8FD8\u6CA1\u6709\u51ED\u636E",
            hint: filtered ? "\u6362\u4E2A\u5173\u952E\u8BCD\u6216\u7C7B\u578B\u8BD5\u8BD5\u3002" : "\u65B0\u589E\u4E00\u6761\u540E\uFF0C\u628A\u5B83\u52A0\u5165\u96C6\u5408\uFF1B\u7AD9\u70B9\u8D26\u53F7\u4F1A\u81EA\u52A8\u7528\u8D26\u53F7 id \u4F5C\u4E3A\u96C6\u5408\u540D\uFF0C\u5E76\u628A\u767B\u5F55\u540D\u5199\u8FDB\u8D26\u53F7\u3002"
          },
          filtered ? null : h(C.Btn, { h, kind: "primary", onClick: startCreate }, iconLabel(h, Plus2, "\u65B0\u589E\u51ED\u636E"))
        ) : h(P.DataTable, { h, label: "\u51ED\u636E\u5217\u8868", columns, rows, renderRow }),
        editingS[0] ? h(FormDialog, {
          h,
          React,
          title: formS[0].id ? "\u7F16\u8F91\u51ED\u636E" : "\u65B0\u589E\u51ED\u636E",
          titleId: "wbv-secret-form-title",
          bodyClassName: "wbv-modal-body",
          steps: [
            {
              key: "basic",
              label: "\u57FA\u672C\u4FE1\u606F",
              hint: "\u540D\u79F0\u4E0E\u7C7B\u578B",
              render: function(hh) {
                return hh(
                  "div",
                  { className: "wbctl-form" },
                  hh(
                    C.Field,
                    { h: hh, label: "\u540D\u79F0" },
                    hh(P.Input, {
                      h: hh,
                      value: formS[0].name,
                      placeholder: "\u5982 \u5DE5\u4F5C\u90AE\u7BB1 / GitHub",
                      onChange: function(e) {
                        formS[1](Object.assign({}, formS[0], { name: e.target.value }));
                      }
                    })
                  ),
                  hh(
                    C.Field,
                    { h: hh, label: "\u7C7B\u578B" },
                    hh(P.Select, {
                      h: hh,
                      value: formS[0].kind,
                      onChange: function(e) {
                        formS[1](Object.assign({}, formS[0], { kind: e.target.value }));
                      }
                    }, K.CREATABLE_KINDS.map(function(k) {
                      return hh("option", { key: k, value: k }, KIND_LABEL[k]);
                    }))
                  )
                );
              },
              validate: function() {
                return formS[0].name.trim() ? "" : "\u540D\u79F0\u4E0D\u80FD\u4E3A\u7A7A";
              }
            },
            {
              key: "secret",
              label: "\u660E\u6587",
              hint: formS[0].id ? "\u7559\u7A7A\u4E0D\u8F6E\u6362" : "\u5FC5\u586B",
              render: function(hh) {
                return hh(
                  "div",
                  { className: "wbctl-form" },
                  hh(
                    "div",
                    { className: "full" },
                    hh(
                      C.Field,
                      { h: hh, label: formS[0].id ? "\u65B0\u660E\u6587\uFF08\u7559\u7A7A\u4E0D\u8F6E\u6362\uFF09" : "\u660E\u6587", hint: "\u660E\u6587\u53EA\u5728\u4FDD\u5B58\u65F6\u53D1\u7ED9\u4FDD\u9669\u7BB1\uFF0C\u754C\u9762\u4E0D\u56DE\u663E\u5DF2\u5B58\u503C" },
                      hh(SecretField, {
                        h: hh,
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
                    )
                  )
                );
              },
              validate: function() {
                return formS[0].id || formS[0].secret ? "" : "\u65B0\u589E\u51ED\u636E\u5FC5\u987B\u586B\u5199\u660E\u6587";
              }
            },
            {
              key: "meta",
              label: "\u96C6\u5408\u4E0E\u5907\u6CE8",
              optional: true,
              render: function(hh) {
                return hh(
                  "div",
                  { className: "wbctl-form" },
                  hh(
                    "div",
                    { className: "full" },
                    hh(
                      C.Field,
                      { h: hh, label: "\u6240\u5C5E\u96C6\u5408\uFF08\u53EF\u591A\u9009\uFF09", hint: setsS[0].length ? "\u52FE\u9009\u540E\u4FDD\u5B58\u65F6\u540C\u6B65\u6302\u8F7D/\u6458\u9664" : "\u8FD8\u6CA1\u6709\u96C6\u5408\uFF0C\u53EF\u5148\u5728\u300C\u96C6\u5408\u300D\u9875\u65B0\u5EFA" },
                      setsS[0].length ? hh("div", { className: "wbv-check-list" }, setsS[0].map(function(s) {
                        var on = (formS[0].setIds || []).indexOf(s.id) >= 0;
                        return hh(
                          "label",
                          { key: s.id, className: "wbv-check" },
                          hh("input", { type: "checkbox", checked: on, onChange: function() {
                            toggleSet(s.id);
                          } }),
                          hh("span", { className: "wbv-dot", style: { background: s.color || "var(--wb-accent)" } }),
                          hh("span", null, s.name),
                          hh("span", { className: "wbv-muted" }, " \xB7 " + (s.secretCount || 0) + " \u6761")
                        );
                      })) : hh("span", { className: "wbv-muted" }, "\u2014")
                    )
                  ),
                  hh(
                    "div",
                    { className: "full" },
                    hh(
                      C.Field,
                      { h: hh, label: "\u5907\u6CE8", hint: "\u975E\u654F\u611F\u4FE1\u606F\uFF08\u7528\u6237\u540D\u3001URL\u3001\u8FC7\u671F\u63D0\u9192\uFF09" },
                      hh(P.Input, {
                        h: hh,
                        value: formS[0].note || "",
                        placeholder: "\u4F8B\u5982\uFF1A\u7528\u6237\u540D\u3001URL\u3001\u8FC7\u671F\u63D0\u9192",
                        onChange: function(e) {
                          formS[1](Object.assign({}, formS[0], { note: e.target.value }));
                        }
                      })
                    )
                  )
                );
              }
            }
          ],
          submitting: busyS[0],
          error: msgS[0],
          onClose: busyS[0] ? null : closeForm,
          onSubmit: function() {
            save(false);
          },
          submitText: "\u4FDD\u5B58",
          cancelText: "\u53D6\u6D88",
          nextText: "\u4E0B\u4E00\u6B65",
          backText: "\u4E0A\u4E00\u6B65"
        }) : null,
        unlockS[0] ? h(AskPassphrase, {
          h,
          React,
          C,
          title: "\u89E3\u9501\u4FDD\u9669\u7BB1",
          hint: "\u89E3\u9501\u72B6\u6001\u53EA\u4FDD\u5B58\u5728\u5F53\u524D\u8FDB\u7A0B\u5185\u5B58\uFF0C\u7A7A\u95F2\u8D85\u65F6\u4F1A\u81EA\u52A8\u9501\u5B9A\u3002",
          label: "\u4E3B\u53E3\u4EE4",
          value: unlockS[0].value,
          busy: unlockS[0].busy,
          error: unlockS[0].error,
          show: unlockS[0].show,
          onChange: function(v) {
            unlockS[1](Object.assign({}, unlockS[0], { value: v }));
          },
          onToggle: function() {
            unlockS[1](Object.assign({}, unlockS[0], { show: !unlockS[0].show }));
          },
          onCancel: function() {
            if (!unlockS[0].busy) unlockS[1](null);
          },
          onConfirm: confirmUnlock
        }) : null,
        askS[0] ? h(AskPassphrase, {
          h,
          React,
          C,
          title: "\u67E5\u770B\u51ED\u636E\u660E\u6587",
          hint: "\u5F53\u524D\u662F B \u6A21\u5F0F\uFF0C\u67E5\u770B\u660E\u6587\u9700\u8981\u518D\u6B21\u8F93\u5165\u4E3B\u53E3\u4EE4\u3002",
          label: "\u4E3B\u53E3\u4EE4\uFF08" + askS[0].row.name + "\uFF09",
          value: askS[0].value,
          busy: askS[0].busy,
          error: askS[0].error,
          show: askS[0].show,
          onChange: function(v) {
            askS[1](Object.assign({}, askS[0], { value: v }));
          },
          onToggle: function() {
            askS[1](Object.assign({}, askS[0], { show: !askS[0].show }));
          },
          onCancel: function() {
            if (!askS[0].busy) askS[1](null);
          },
          onConfirm: confirmPassphrase
        }) : null,
        revealS[0] ? h(
          Dialog,
          {
            h,
            React,
            title: "\u51ED\u636E\u660E\u6587 \xB7 " + revealS[0].name,
            titleId: "wbv-reveal-title",
            onClose: function() {
              revealS[1](null);
            }
          },
          h(
            "div",
            { className: "wbv-modal-body" },
            h("div", { className: "wbv-secret" }, revealS[0].secret),
            h("p", { className: "wbv-modal-sub" }, "\u660E\u6587\u4E0D\u4F1A\u5199\u5165\u65E5\u5FD7\uFF1B\u590D\u5236\u540E\u8BF7\u5C3D\u5FEB\u7528\u5230\u76EE\u6807\u5904\u3002")
          ),
          h(
            "div",
            { className: "wbv-modal-foot" },
            h(C.Btn, { h, onClick: copyRevealed }, "\u590D\u5236"),
            h("span", { className: "wbv-grow" }),
            h(C.Btn, { h, onClick: function() {
              revealS[1](null);
            } }, "\u5173\u95ED")
          )
        ) : null,
        delS[0] ? h(ConfirmDialog, {
          h,
          React,
          title: "\u5220\u9664\u51ED\u636E\u300C" + delS[0].row.name + "\u300D\uFF1F",
          message: "\u7ED1\u5B9A\u5B83\u7684\u8FDE\u63A5\u5668\u4F1A\u5931\u6548\uFF1B\u5220\u9664\u540E\u660E\u6587\u65E0\u6CD5\u6062\u590D\u3002",
          confirmText: "\u786E\u8BA4\u5220\u9664",
          busyText: "\u5220\u9664\u4E2D\u2026",
          busy: busyS[0],
          onCancel: function() {
            if (!busyS[0]) delS[1](null);
          },
          onConfirm: confirmRemove
        }) : null
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

// packages/addons/lib/search-picker.cjs
var require_search_picker = __commonJS({
  "packages/addons/lib/search-picker.cjs"(exports2, module2) {
    "use strict";
    var React = require("react");
    var h = React.createElement;
    var FilterChecklist = require_filter_checklist();
    var DEFAULT_TEXTS = {
      all: "\u5168\u90E8",
      selected: "\u5DF2\u9009",
      clear: "\u6E05\u7A7A",
      searchPlaceholder: "\u641C\u7D22",
      empty: "\u6682\u65E0\u6570\u636E",
      noMatch: "\u6CA1\u6709\u5339\u914D\u9879",
      loading: "\u52A0\u8F7D\u4E2D\u2026",
      noMore: "\u6CA1\u6709\u66F4\u591A"
    };
    function asText(x) {
      return String(x == null ? "" : x).toLowerCase();
    }
    function filterLocal(items, query) {
      var q = String(query || "").trim();
      if (!q) return items;
      var needle = asText(q);
      return items.filter(function(x) {
        return asText(x.name).indexOf(needle) >= 0 || asText(x.meta).indexOf(needle) >= 0;
      });
    }
    function useRemoteSource(conf) {
      var RT = conf.React || React;
      var open = conf.open;
      var query = conf.query;
      var fetchPage = conf.fetchPage;
      var pageSize = conf.pageSize;
      var debounce = conf.debounce;
      var dedupe = conf.dedupe;
      var mapPage = conf.mapPage;
      var reloadKey = conf.reloadKey;
      var rowsS = RT.useState([]);
      var totalS = RT.useState(0);
      var pageS = RT.useState(0);
      var moreS = RT.useState(false);
      var loadS = RT.useState(false);
      var seq = RT.useRef ? RT.useRef(0) : { current: 0 };
      function load(q, pageNumber, append) {
        var mine = ++seq.current;
        loadS[1](true);
        return Promise.resolve(fetchPage(q, pageNumber)).then(function(raw) {
          if (mine !== seq.current) return;
          loadS[1](false);
          var next = mapPage ? mapPage(raw, pageNumber) : raw || {};
          var list = next.rows || [];
          rowsS[1](function(prev) {
            if (!append) return list;
            var joined = dedupe === false ? prev.concat(list) : prev.concat(list);
            if (dedupe === false) return joined;
            var seen = {};
            return joined.filter(function(x) {
              var key = String(x.id);
              if (seen[key]) return false;
              seen[key] = true;
              return true;
            });
          });
          totalS[1](typeof next.total === "number" ? next.total : list.length);
          pageS[1](next.page || pageNumber);
          moreS[1](!!next.hasMore);
        }).catch(function() {
          if (mine === seq.current) loadS[1](false);
        });
      }
      RT.useEffect(
        function() {
          if (!open) return void 0;
          var timer = setTimeout(
            function() {
              load(query, 1, false);
            },
            query ? debounce : 0
          );
          return function() {
            clearTimeout(timer);
          };
        },
        [open, query, reloadKey]
      );
      return {
        rows: rowsS[0],
        total: totalS[0],
        page: pageS[0],
        hasMore: moreS[0],
        loading: loadS[0],
        loadQuery: load,
        reset: function() {
          seq.current += 1;
          rowsS[1]([]);
          totalS[1](0);
          pageS[1](0);
          moreS[1](false);
          loadS[1](false);
        }
      };
    }
    function SearchPicker(props) {
      var RT = props.React || React;
      var texts = Object.assign({}, DEFAULT_TEXTS, props.texts || {});
      var classes = props.classes || {};
      var mode = props.mode === "single" ? "single" : "multi";
      var disabled = props.disabled === true;
      var selected = (props.selected || []).map(String);
      var items = props.items || null;
      var fetchPage = props.fetchPage || null;
      var pageSize = props.pageSize || 20;
      var debounce = props.debounce === void 0 ? 200 : props.debounce;
      var allItems = items || [];
      var openS = RT.useState(false);
      var open = openS[0];
      var queryS = RT.useState("");
      var query = queryS[0];
      var boxRef = RT.useRef ? RT.useRef(null) : { current: null };
      var remote = fetchPage ? useRemoteSource({
        React: RT,
        open,
        query,
        fetchPage,
        pageSize,
        debounce,
        dedupe: props.dedupe,
        mapPage: props.mapPage,
        reloadKey: props.reloadKey
      }) : null;
      var rows = remote ? remote.rows : filterLocal(allItems, query);
      var loading = remote ? remote.loading : false;
      var total = remote ? remote.total : rows.length;
      var hasMore = remote ? remote.hasMore : false;
      RT.useEffect(function() {
        if (!open || typeof document === "undefined") return void 0;
        function onDown(e) {
          var box = boxRef.current;
          if (box && !box.contains(e.target)) openS[1](false);
        }
        function onKey(e) {
          if (e.key === "Escape") openS[1](false);
        }
        document.addEventListener("mousedown", onDown);
        document.addEventListener("keydown", onKey);
        return function() {
          document.removeEventListener("mousedown", onDown);
          document.removeEventListener("keydown", onKey);
        };
      }, [open]);
      function commit(next) {
        if (props.onChange) props.onChange(next);
      }
      function toggle(id) {
        if (disabled) return;
        var key = String(id);
        if (mode === "single") {
          openS[1](false);
          if (props.onPick) props.onPick(key, rowOf(key));
          commit([key]);
          return;
        }
        var next = selected.slice();
        var i = next.indexOf(key);
        if (i >= 0) next.splice(i, 1);
        else next.push(key);
        commit(next);
      }
      function rowOf(id) {
        var hit = rows.filter(function(x) {
          return String(x.id) === String(id);
        })[0];
        if (hit) return hit;
        return (allItems || []).filter(function(x) {
          return String(x.id) === String(id);
        })[0] || null;
      }
      var label = props.label || texts.all;
      var caret = props.caret === void 0 ? "\u25BE" : props.caret;
      var count = selected.length;
      var chips = props.renderSelected ? props.renderSelected({ ids: selected, toggle, nameOf: props.nameOf || rowOf, texts }) : null;
      return h(
        "div",
        { className: classes.root, ref: boxRef },
        h(
          "button",
          {
            type: "button",
            className: classes.btn + (count ? " " + (classes.btnOn || "is-on") : ""),
            "aria-haspopup": "dialog",
            "aria-expanded": open ? "true" : "false",
            disabled,
            onClick: function(e) {
              if (props.stopPropagation) e.stopPropagation();
              openS[1](!open);
            }
          },
          props.icon ? props.icon : null,
          label + (count ? " \xB7 " + count : ""),
          typeof caret === "function" ? caret : caret
        ),
        chips,
        open ? h(
          "div",
          {
            className: classes.menu,
            role: props.menuRole,
            style: props.menuStyle,
            onClick: props.stopPropagation ? function(e) {
              e.stopPropagation();
            } : void 0
          },
          h(FilterChecklist, {
            mode,
            items: rows,
            selected,
            onToggle: toggle,
            onPick: toggle,
            query,
            onQuery: queryS[1],
            title: props.title || label,
            total,
            selectedText: texts.selected,
            clearText: texts.clear,
            onClear: function() {
              commit([]);
              queryS[1]("");
            },
            searchPlaceholder: texts.searchPlaceholder,
            loading,
            hasMore,
            onLoadMore: remote ? function() {
              remote.loadQuery(query, (remote.page || 1) + 1, true);
            } : void 0,
            emptyText: texts.empty,
            noMatchText: texts.noMatch,
            loadingText: texts.loading,
            noMoreText: texts.noMore,
            groupLabel: props.title || label,
            autoFocus: props.autoFocus,
            beforeHead: props.beforeHead || null
          }),
          props.footer || null
        ) : null
      );
    }
    module2.exports = SearchPicker;
    module2.exports.filterLocal = filterLocal;
    module2.exports.DEFAULT_TEXTS = DEFAULT_TEXTS;
  }
});

// packages/addons/vault/client/views/sets.cjs
var require_sets = __commonJS({
  "packages/addons/vault/client/views/sets.cjs"(exports2, module2) {
    "use strict";
    var C = require_common();
    var P = require_page();
    var K = require_kinds();
    var Lock2 = require_lock();
    var Dialog = require_dialog().Dialog;
    var ConfirmDialog = require_dialog().ConfirmDialog;
    var GLYPHS2 = require_icons2().ICONS;
    var SearchPicker = require_search_picker();
    var Layers2 = GLYPHS2["layers"];
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
      var typeS = React.useState("");
      var msgS = React.useState("");
      var busyS = React.useState(false);
      var draftS = React.useState(null);
      var nsD = React.useState({ name: "", kind: "password", secret: "" });
      var pickS = React.useState([]);
      var delS = React.useState(null);
      var guard = Lock2.use({ api, C, React });
      var inflight = React.useState({ seq: 0 })[0];
      function load() {
        var seq = inflight.seq += 1;
        listS[1](function(old) {
          return Object.assign({}, old, { loading: true });
        });
        Promise.all([
          C.call(api, "vault.setList", { q: qS[0], type: typeS[0] || void 0 }),
          C.call(api, "vault.secretList", {}),
          C.call(api, "vault.groupList", {})
        ]).then(function(r) {
          if (inflight.seq !== seq) return;
          listS[1]({ loading: false, items: r[0] && r[0].items || [], error: "" });
          secretsS[1](r[1] && (r[1].items || r[1].secrets) || []);
          groupsS[1](r[2] && r[2].items || []);
          if (activeS[0]) return open(activeS[0]).then(null, function() {
          });
        }).catch(function(e) {
          if (inflight.seq !== seq) return;
          listS[1]({ loading: false, items: [], error: C.errText(e) });
        });
      }
      React.useEffect(function() {
        if (!guard.ready) return;
        inflight.seq += 1;
        if (guard.locked) {
          draftS[1](null);
          pickS[1]([]);
          delS[1](null);
          msgS[1]("");
        }
        load();
      }, [guard.ready, guard.locked]);
      function secretName(id) {
        for (var i = 0; i < secretsS[0].length; i += 1) if (secretsS[0][i].id === id) return secretsS[0][i].name;
        return id;
      }
      function open(row) {
        activeS[1](row);
        detailS[1]({ setId: row.id, secrets: [], groups: [], error: "" });
        var seq = inflight.seq += 1;
        return C.call(api, "vault.setGet", { id: row.id }).then(function(r) {
          if (inflight.seq !== seq) return;
          detailS[1]({ setId: row.id, secrets: r && r.secrets || [], groups: r && r.groupIds || [], error: "" });
        }).catch(function(e) {
          if (inflight.seq !== seq) return;
          detailS[1]({ setId: row.id, secrets: [], groups: [], error: C.errText(e) });
        });
      }
      function startCreate() {
        draftS[1]({ name: "", type: "common", account: "", description: "", color: "", secretIds: [], newSecrets: [] });
        nsD[1]({ name: "", kind: "password", secret: "" });
        msgS[1]("");
      }
      function startEdit(set) {
        draftS[1]({
          id: set.id,
          name: set.name,
          type: set.type === "account" ? "account" : "common",
          account: set.account || "",
          description: set.description || "",
          color: set.color || "",
          secretIds: [],
          newSecrets: []
        });
        nsD[1]({ name: "", kind: "password", secret: "" });
        msgS[1]("");
      }
      function addNewSecret() {
        var row = nsD[0];
        var name = String(row.name || "").trim();
        if (!name) return msgS[1]("\u65B0\u51ED\u636E\u540D\u79F0\u4E0D\u80FD\u4E3A\u7A7A");
        if (!String(row.secret || "")) return msgS[1]("\u65B0\u51ED\u636E\u9700\u8981\u586B\u5199\u660E\u6587");
        var list = (draftS[0].newSecrets || []).concat([{ name, kind: row.kind || "other", secret: String(row.secret) }]);
        draftS[1](Object.assign({}, draftS[0], { newSecrets: list }));
        nsD[1]({ name: "", kind: "password", secret: "" });
        msgS[1]("");
      }
      function saveDraft() {
        var d = draftS[0];
        if (!d || !String(d.name || "").trim()) return msgS[1]("\u96C6\u5408\u540D\u4E0D\u80FD\u4E3A\u7A7A");
        var isAccount = d.type === "account";
        var account = isAccount ? String(d.account || "").trim() : "";
        if (isAccount && !account) return msgS[1]("\u8D26\u53F7\u96C6\u5408\u9700\u8981\u586B\u5199\u8D26\u53F7\uFF1B\u8D26\u53F7\u7559\u7A7A\u8BF7\u6539\u9009\u666E\u901A\u96C6\u5408");
        busyS[1](true);
        msgS[1]("");
        var secrets = [];
        (d.secretIds || []).forEach(function(id) {
          secrets.push({ id });
        });
        (d.newSecrets || []).forEach(function(s) {
          if (!String(s.name || "").trim() || !String(s.secret || "")) return;
          secrets.push({ name: String(s.name).trim(), kind: s.kind || "other", secret: String(s.secret) });
        });
        var body = {
          name: String(d.name).trim(),
          account,
          description: d.description || "",
          color: d.color || ""
        };
        if (secrets.length) body.secrets = secrets;
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
        delS[1]({ set });
      }
      function confirmRemoveSet() {
        var d = delS[0];
        if (!d) return;
        busyS[1](true);
        msgS[1]("");
        C.call(api, "vault.setDelete", { id: d.set.id }).then(function() {
          busyS[1](false);
          delS[1](null);
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
        return (set.name || "").indexOf(q) >= 0 || (set.account || "").indexOf(q) >= 0 || (set.description || "").indexOf(q) >= 0;
      });
      var detail = detailS[0];
      var inSet = {};
      detail.secrets.forEach(function(s) {
        inSet[s.id] = true;
      });
      var candidates = secretsS[0].filter(function(s) {
        return !inSet[s.id];
      });
      if (!guard.ready) return h("div", { className: "wbv" }, h(C.Empty, { h, text: "\u6B63\u5728\u8BFB\u53D6\u4FDD\u9669\u7BB1\u72B6\u6001\u2026" }));
      var readOnly = guard.locked;
      var lockNote = readOnly ? h(C.Notice, {
        h,
        kind: "warn",
        text: "\u4FDD\u9669\u7BB1\u5DF2\u9501\u5B9A\uFF1A\u96C6\u5408\u3001\u8D26\u53F7\u4E0E\u51ED\u636E\u540D\u7167\u5E38\u53EF\u89C1\uFF1B\u65B0\u5EFA\u3001\u7F16\u8F91\u3001\u52A0\u5165\u51ED\u636E\u4E0E\u660E\u6587\u5F55\u5165\u9700\u5148\u5230\u300C\u4FDD\u9669\u7BB1\u300D\u9875\u89E3\u9501\u3002"
      }) : null;
      var active = activeS[0];
      var secretColumns = [
        { key: "name", label: "\u540D\u79F0" },
        { key: "kind", label: "\u7C7B\u578B" },
        { key: "updated", label: "\u66F4\u65B0\u65F6\u95F4" },
        { key: "ops", label: "\u64CD\u4F5C", align: "right" }
      ];
      return h(
        "div",
        { className: "wbv" },
        h(P.PageHead, {
          h,
          title: "\u96C6\u5408\u4E0E\u8D26\u53F7",
          sub: "\u4E00\u4E2A\u96C6\u5408\u53EF\u4EE5\u6807\u4E00\u4E2A\u8D26\u53F7\uFF08\u53EF\u91CD\u590D\u3001\u53EF\u7559\u7A7A\uFF09\uFF0C\u5E76\u6302\u5230\u591A\u4E2A\u5206\u7EC4\u3001\u88C5\u591A\u6761\u51ED\u636E\uFF1B\u5220\u9664\u96C6\u5408\u53EA\u65AD\u5173\u8054\uFF0C\u4E0D\u5220\u51ED\u636E\u3002",
          actions: [
            h(C.Btn, { h, key: "refresh", onClick: load }, "\u5237\u65B0"),
            h(C.Btn, { h, key: "create", kind: "primary", disabled: readOnly, onClick: startCreate }, "\u65B0\u5EFA\u96C6\u5408\u4E0E\u8D26\u53F7")
          ]
        }),
        lockNote,
        h(
          P.Toolbar,
          { h },
          h(P.Input, {
            h,
            className: "wbv-search",
            placeholder: "\u641C\u7D22\u96C6\u5408\u540D\u3001\u8D26\u53F7\u6216\u63CF\u8FF0",
            "aria-label": "\u641C\u7D22\u96C6\u5408\u4E0E\u8D26\u53F7",
            value: qS[0],
            onChange: function(e) {
              qS[1](e.target.value);
            }
          }),
          h(
            P.Select,
            {
              h,
              "aria-label": "\u6309\u96C6\u5408\u7C7B\u578B\u7B5B\u9009",
              value: typeS[0],
              onChange: function(e) {
                typeS[1](e.target.value);
                load();
              }
            },
            h("option", { value: "" }, "\u5168\u90E8\u7C7B\u578B"),
            h("option", { value: "account" }, "\u8D26\u53F7\u96C6\u5408"),
            h("option", { value: "common" }, "\u666E\u901A\u96C6\u5408")
          ),
          h("span", { className: "wbv-toolbar-tail" }),
          h("span", { className: "wbv-muted" }, listS[0].loading ? "\u8BFB\u53D6\u4E2D\u2026" : items.length + " \u4E2A\u96C6\u5408")
        ),
        h(C.Notice, { h, kind: "error", text: listS[0].error || msgS[0] }),
        h(
          "div",
          { className: "wbv-split" },
          h(
            "div",
            { className: "wbv-list" },
            listS[0].loading ? h(C.Empty, { h, text: "\u8BFB\u53D6\u96C6\u5408\u2026" }) : items.length === 0 ? h(P.EmptyState, {
              h,
              icon: Layers2,
              title: qS[0] || typeS[0] ? "\u6CA1\u6709\u5339\u914D\u7684\u96C6\u5408\u4E0E\u8D26\u53F7" : "\u8FD8\u6CA1\u6709\u96C6\u5408\u4E0E\u8D26\u53F7",
              hint: qS[0] || typeS[0] ? "\u6362\u4E2A\u5173\u952E\u8BCD\u6216\u7C7B\u578B\u8BD5\u8BD5\u3002" : "\u65B0\u5EFA\u4E00\u4E2A\u540E\uFF0C\u53EF\u4EE5\u628A\u8D26\u53F7\u3001\u51ED\u636E\u548C\u5206\u7EC4\u90FD\u6302\u8FDB\u6765\u3002"
            }, h(C.Btn, { h, kind: "primary", disabled: readOnly, onClick: startCreate }, "\u65B0\u5EFA\u96C6\u5408\u4E0E\u8D26\u53F7")) : items.map(function(set) {
              var on = active && active.id === set.id;
              return h(
                "button",
                {
                  key: set.id,
                  type: "button",
                  className: "wbv-item" + (on ? " on" : ""),
                  onClick: function() {
                    open(set);
                  }
                },
                h(
                  "div",
                  { className: "wbv-item-top" },
                  h("span", { className: "wbv-dot", style: set.color ? { background: set.color } : null }),
                  h("span", { className: "wbv-item-title" }, set.name),
                  h("span", { className: "wbv-pill" }, set.type === "account" ? "\u8D26\u53F7\u96C6\u5408" : "\u666E\u901A\u96C6\u5408"),
                  h("span", { className: "wbv-grow" }),
                  h("span", { className: "wbv-pill" }, (set.secretCount || 0) + " \u6761")
                ),
                h(
                  "div",
                  { className: "wbv-item-sub" },
                  (set.account ? "\u8D26\u53F7 " + set.account : "\u672A\u586B\u8D26\u53F7") + " \xB7 " + (set.description || "\u2014") + " \xB7 " + (set.groupIds || []).length + " \u4E2A\u5206\u7EC4"
                )
              );
            })
          ),
          h(
            P.Card,
            { h },
            !active ? h(C.Empty, { h, text: "\u5DE6\u4FA7\u9009\u4E00\u4E2A\u96C6\u5408\uFF0C\u67E5\u770B\u51ED\u636E\u4E0E\u5206\u7EC4\u3002" }) : h(
              React.Fragment,
              null,
              h(
                "div",
                { className: "wbv-card-head" },
                h("h3", { className: "wbv-card-title" }, active.name),
                h(
                  "div",
                  { className: "wbv-card-actions" },
                  h(C.Btn, { h, disabled: readOnly, onClick: function() {
                    startEdit(active);
                  } }, "\u7F16\u8F91"),
                  h(C.Btn, { h, kind: "danger", disabled: readOnly, onClick: function() {
                    removeSet(active);
                  } }, "\u5220\u9664\u96C6\u5408")
                )
              ),
              h(
                "div",
                { className: "wbv-muted", style: { marginBottom: "10px" } },
                (active.type === "account" ? "\u8D26\u53F7\u96C6\u5408" : "\u666E\u901A\u96C6\u5408") + " \xB7 \u8D26\u53F7\uFF1A" + (active.account || "\u672A\u586B")
              ),
              detail.error ? h(C.Notice, { h, kind: "error", text: detail.error }) : null,
              h("div", { className: "wbv-label" }, "\u96C6\u5408\u5185\u51ED\u636E"),
              detail.secrets.length === 0 ? h("div", { className: "wbv-muted" }, "\u8FD8\u6CA1\u6709\u51ED\u636E\u3002") : h(P.DataTable, {
                h,
                label: "\u96C6\u5408\u5185\u51ED\u636E",
                columns: secretColumns,
                rows: detail.secrets,
                renderRow: function(s) {
                  return h(
                    "tr",
                    { key: s.id },
                    h("td", null, h("div", { className: "wbv-cell-main" }, s.name)),
                    h("td", null, h("span", { className: "wbv-pill" }, K.KIND_LABEL[s.kind] || s.kind)),
                    h("td", null, C.fmtTime(s.updatedAt, lang)),
                    h("td", null, h(
                      "div",
                      { className: "wbv-actions" },
                      h(C.Btn, { h, kind: "ghost", disabled: readOnly, onClick: function() {
                        detach(s.id);
                      } }, "\u79FB\u51FA")
                    ))
                  );
                }
              }),
              h("div", { className: "wbv-card-title", style: { marginTop: "14px" } }, "\u52A0\u5165\u51ED\u636E"),
              readOnly ? h("div", { className: "wbv-muted" }, "\u89E3\u9501\u540E\u53EF\u628A\u51ED\u636E\u52A0\u5165\u8FD9\u4E2A\u96C6\u5408\u3002") : h(
                "div",
                { className: "wbv-row" },
                h(SearchPicker, {
                  h,
                  React,
                  mode: "multi",
                  label: "\u51ED\u636E",
                  title: "\u53EF\u52A0\u5165\u7684\u51ED\u636E",
                  items: candidates.map(function(s) {
                    return { id: s.id, name: s.name, meta: K.KIND_LABEL[s.kind] || s.kind };
                  }),
                  selected: pickS[0],
                  onChange: function(ids) {
                    pickS[1](ids);
                  },
                  disabled: busyS[0],
                  classes: { root: "wbv-picker", btn: "wbv-picker-btn", btnOn: "on", menu: "wbv-picker-menu" },
                  texts: {
                    all: "\u9009\u62E9\u8981\u52A0\u5165\u7684\u51ED\u636E",
                    selected: "\u5DF2\u9009",
                    clear: "\u6E05\u7A7A",
                    searchPlaceholder: "\u641C\u7D22\u51ED\u636E\u540D\u6216\u7C7B\u578B",
                    empty: "\u6CA1\u6709\u53EF\u52A0\u5165\u7684\u51ED\u636E",
                    noMatch: "\u6CA1\u6709\u5339\u914D\u7684\u51ED\u636E"
                  },
                  renderSelected: function(ctx) {
                    return ctx.ids.length ? h("span", { className: "wbv-chips" }, ctx.ids.map(function(id) {
                      return h(
                        "span",
                        { className: "wbv-chip", key: id },
                        h("span", null, secretName(id)),
                        h("button", { type: "button", className: "wbv-btn ghost", onClick: function() {
                          ctx.toggle(id);
                        } }, "\xD7")
                      );
                    })) : null;
                  }
                }),
                h("span", { className: "wbv-grow" }),
                h(C.Btn, { h, kind: "primary", disabled: !pickS[0].length || busyS[0], onClick: attachPicked }, "\u52A0\u5165 " + (pickS[0].length || ""))
              ),
              h("div", { className: "wbv-card-title", style: { marginTop: "14px" } }, "\u6302\u9760\u5206\u7EC4"),
              h(
                "div",
                { className: "wbv-chips" },
                groupsS[0].length === 0 ? h("span", { className: "wbv-muted" }, "\u8FD8\u6CA1\u6709\u5206\u7EC4\u3002") : groupsS[0].map(function(g) {
                  var on = detail.groups.indexOf(g.id) >= 0;
                  return h(
                    "label",
                    { key: g.id, className: "wbv-chip", style: { cursor: "pointer" } },
                    h("input", { type: "checkbox", checked: on, disabled: busyS[0] || readOnly, onChange: function(e) {
                      toggleGroup(g.id, e.target.checked);
                    } }),
                    h("span", null, g.name)
                  );
                })
              )
            )
          )
        ),
        draftS[0] ? h(
          Dialog,
          {
            h,
            React,
            title: draftS[0].id ? "\u7F16\u8F91\u96C6\u5408\u4E0E\u8D26\u53F7" : "\u65B0\u5EFA\u96C6\u5408\u4E0E\u8D26\u53F7",
            titleId: "wbv-set-form-title",
            busy: busyS[0],
            onClose: busyS[0] ? null : function() {
              draftS[1](null);
            },
            closeOnEscape: !busyS[0],
            closeOnMask: !busyS[0],
            autoFocus: false
          },
          h(
            "div",
            { className: "wbv-modal-body" },
            h(
              C.Field,
              { h, label: "\u96C6\u5408\u540D" },
              h(P.Input, {
                h,
                autoFocus: true,
                value: draftS[0].name,
                placeholder: "\u5982 acc_1 / \u5DE5\u4F5C\u90AE\u7BB1",
                onChange: function(e) {
                  draftS[1](Object.assign({}, draftS[0], { name: e.target.value }));
                }
              })
            ),
            h(
              C.Field,
              { h, label: "\u96C6\u5408\u7C7B\u578B", hint: "\u8D26\u53F7\u96C6\u5408\u53EF\u6807\u4E00\u4E2A\u8D26\u53F7\uFF1B\u666E\u901A\u96C6\u5408\u4E0D\u7ED1\u5B9A\u8D26\u53F7" },
              h(
                P.Select,
                {
                  h,
                  "aria-label": "\u9009\u62E9\u96C6\u5408\u7C7B\u578B",
                  value: draftS[0].type,
                  onChange: function(e) {
                    var type = e.target.value === "account" ? "account" : "common";
                    draftS[1](Object.assign({}, draftS[0], { type, account: type === "common" ? "" : draftS[0].account }));
                  }
                },
                h("option", { value: "account" }, "\u8D26\u53F7\u96C6\u5408"),
                h("option", { value: "common" }, "\u666E\u901A\u96C6\u5408")
              )
            ),
            draftS[0].type === "account" ? h(
              C.Field,
              { h, label: "\u8D26\u53F7", hint: "\u53EF\u91CD\u590D\uFF0C\u4E0D\u540C\u6761\u76EE\u53EA\u6309 id \u533A\u5206\uFF1B\u4E00\u4E2A\u96C6\u5408\u53EA\u6807\u4E00\u4E2A\u8D26\u53F7" },
              h(P.Input, {
                h,
                value: draftS[0].account,
                placeholder: "\u5982 ops@example.com",
                onChange: function(e) {
                  draftS[1](Object.assign({}, draftS[0], { account: e.target.value }));
                }
              })
            ) : null,
            h(
              C.Field,
              { h, label: "\u63CF\u8FF0" },
              h(P.Input, {
                h,
                value: draftS[0].description,
                placeholder: "\u53EF\u9009",
                onChange: function(e) {
                  draftS[1](Object.assign({}, draftS[0], { description: e.target.value }));
                }
              })
            ),
            h(
              C.Field,
              { h, label: "\u989C\u8272\uFF08\u53EF\u9009\uFF0C\u4E3B\u9898 token \u540D\u6216\u8272\u503C\uFF09", hint: "\u7559\u7A7A\u4F7F\u7528\u4E3B\u9898\u5F3A\u8C03\u8272\uFF1B\u5EFA\u8BAE\u586B --wb-accent \u4E00\u7C7B token" },
              h(P.Input, {
                h,
                value: draftS[0].color,
                placeholder: "\u5982 --wb-accent",
                onChange: function(e) {
                  draftS[1](Object.assign({}, draftS[0], { color: e.target.value }));
                }
              })
            ),
            h(
              C.Field,
              {
                h,
                label: "\u51ED\u636E",
                hint: "\u641C\u7D22\u540E\u52FE\u9009\u8981\u6302\u5230\u8FD9\u4E2A\u96C6\u5408\u4E0A\u7684\u51ED\u636E\uFF1B\u4FDD\u5B58\u96C6\u5408\u65F6\u4E00\u5E76\u5EFA\u7ACB\u5173\u8054"
              },
              h(SearchPicker, {
                h,
                React,
                mode: "multi",
                label: "\u9009\u62E9\u51ED\u636E",
                title: "\u4FDD\u9669\u7BB1\u91CC\u7684\u51ED\u636E",
                items: secretsS[0].map(function(sec) {
                  return { id: sec.id, name: sec.name, meta: K.KIND_LABEL[sec.kind] || sec.kind };
                }),
                selected: draftS[0].secretIds,
                onChange: function(ids) {
                  draftS[1](Object.assign({}, draftS[0], { secretIds: ids }));
                },
                disabled: busyS[0],
                classes: { root: "wbv-picker", btn: "wbv-picker-btn", btnOn: "on", menu: "wbv-picker-menu" },
                texts: {
                  all: "\u9009\u62E9\u51ED\u636E",
                  selected: "\u5DF2\u9009",
                  clear: "\u6E05\u7A7A",
                  searchPlaceholder: "\u641C\u7D22\u51ED\u636E\u540D\u6216\u7C7B\u578B",
                  empty: "\u4FDD\u9669\u7BB1\u8FD8\u6CA1\u6709\u51ED\u636E",
                  noMatch: "\u6CA1\u6709\u5339\u914D\u7684\u51ED\u636E"
                },
                renderSelected: function(ctx) {
                  return ctx.ids.length ? h("span", { className: "wbv-chips" }, ctx.ids.map(function(id) {
                    var sec = ctx.nameOf(id) || { name: id };
                    return h(
                      "span",
                      { className: "wbv-chip", key: id },
                      h("span", null, sec.name),
                      h("button", { type: "button", className: "wbv-btn ghost", onClick: function() {
                        ctx.toggle(id);
                      } }, "\xD7")
                    );
                  })) : null;
                }
              })
            ),
            h("div", { className: "wbv-card-title", style: { marginTop: "10px" } }, "\u6216\u76F4\u63A5\u65B0\u5EFA\u4E00\u6761\u51ED\u636E"),
            h(
              "div",
              { className: "wbv-inline" },
              h(P.Input, {
                h,
                placeholder: "\u65B0\u51ED\u636E\u540D\u79F0",
                value: nsD[0].name,
                onChange: function(e) {
                  nsD[1](Object.assign({}, nsD[0], { name: e.target.value }));
                }
              }),
              h(P.Select, {
                h,
                "aria-label": "\u65B0\u51ED\u636E\u7C7B\u578B",
                value: nsD[0].kind,
                onChange: function(e) {
                  nsD[1](Object.assign({}, nsD[0], { kind: e.target.value }));
                }
              }, K.kindOptions("").map(function(kind) {
                return h("option", { key: kind, value: kind }, K.KIND_LABEL[kind] || kind);
              })),
              h(P.Input, {
                h,
                type: "password",
                placeholder: "\u660E\u6587\uFF08\u53EA\u5728\u672C\u673A\u52A0\u5BC6\u4FDD\u5B58\uFF09",
                value: nsD[0].secret,
                onChange: function(e) {
                  nsD[1](Object.assign({}, nsD[0], { secret: e.target.value }));
                }
              }),
              h(C.Btn, { h, disabled: !String(nsD[0].name || "").trim() || !String(nsD[0].secret || ""), onClick: addNewSecret }, "\u6DFB\u52A0")
            ),
            (draftS[0].newSecrets || []).length ? h("div", { className: "wbv-chips" }, draftS[0].newSecrets.map(function(sec, index) {
              return h(
                "span",
                { className: "wbv-chip", key: index },
                h("span", null, sec.name + " \xB7 " + (K.KIND_LABEL[sec.kind] || sec.kind)),
                h("button", {
                  type: "button",
                  className: "wbv-btn ghost",
                  onClick: function() {
                    var list = draftS[0].newSecrets.slice();
                    list.splice(index, 1);
                    draftS[1](Object.assign({}, draftS[0], { newSecrets: list }));
                  }
                }, "\xD7")
              );
            })) : null,
            h(C.Notice, { h, kind: "error", text: msgS[0] })
          ),
          h(
            "div",
            { className: "wbv-modal-foot" },
            h("span", { className: "wbv-grow" }),
            h(C.Btn, { h, disabled: busyS[0], onClick: function() {
              draftS[1](null);
            } }, "\u53D6\u6D88"),
            h(C.Btn, { h, kind: "primary", disabled: busyS[0], onClick: saveDraft }, busyS[0] ? "\u4FDD\u5B58\u4E2D\u2026" : "\u4FDD\u5B58")
          )
        ) : null,
        delS[0] ? h(ConfirmDialog, {
          h,
          React,
          title: "\u5220\u9664\u96C6\u5408\u300C" + delS[0].set.name + "\u300D\uFF1F",
          message: "\u53EA\u89E3\u9664\u4E0E\u51ED\u636E\u3001\u5206\u7EC4\u7684\u5173\u8054\uFF0C\u51ED\u636E\u672C\u8EAB\u4FDD\u7559\u3002",
          confirmText: "\u786E\u8BA4\u5220\u9664",
          busyText: "\u5220\u9664\u4E2D\u2026",
          busy: busyS[0],
          onCancel: function() {
            if (!busyS[0]) delS[1](null);
          },
          onConfirm: confirmRemoveSet
        }) : null
      );
    };
  }
});

// packages/addons/vault/client/views/groups.cjs
var require_groups = __commonJS({
  "packages/addons/vault/client/views/groups.cjs"(exports2, module2) {
    "use strict";
    var C = require_common();
    var P = require_page();
    var FilterChecklist = require_filter_checklist();
    var Dialog = require_dialog().Dialog;
    var ConfirmDialog = require_dialog().ConfirmDialog;
    var Lock2 = require_lock();
    var iconLabel = require_icon_label();
    var GLYPHS2 = require_icons2().ICONS;
    var Plus2 = GLYPHS2["plus"];
    var Refresh = GLYPHS2["refresh-cw"];
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
      var guard = Lock2.use({ api, C, React });
      var inflight = React.useState({ seq: 0 })[0];
      function load() {
        if (guard.locked) {
          listS[1]({ loading: false, rows: [], error: "" });
          return;
        }
        var seq = inflight.seq += 1;
        listS[1](function(old) {
          return Object.assign({}, old, { loading: true });
        });
        Promise.all([
          C.call(api, "vault.groupList"),
          C.call(api, "vault.setList", {}).catch(function() {
            return { items: [] };
          })
        ]).then(function(r) {
          if (inflight.seq !== seq) return;
          listS[1]({ loading: false, rows: r[0] && r[0].items || [], error: "" });
          setsS[1](r[1] && r[1].items || []);
        }).catch(function(e) {
          if (inflight.seq !== seq) return;
          listS[1]({ loading: false, rows: [], error: C.errText(e) });
        });
      }
      React.useEffect(function() {
        if (!guard.ready) return;
        inflight.seq += 1;
        if (guard.locked) {
          listS[1]({ loading: false, rows: [], error: "" });
          setsS[1]([]);
          openS[1](null);
          createS[1](null);
          delS[1](null);
          pickS[1]({ q: "", rows: [], page: 1, loading: false });
          msgS[1]("");
          return;
        }
        load();
      }, [guard.ready, guard.locked]);
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
            msgS[1](failed ? "\u5206\u7EC4\u5DF2\u521B\u5EFA\uFF0C" + failed + " \u4E2A\u96C6\u5408\u4E0E\u8D26\u53F7\u6302\u8F7D\u5931\u8D25\uFF0C\u53EF\u5728\u300C\u67E5\u770B\u5173\u8054\u300D\u91CC\u8865\u6302" : "");
            load();
          });
        }).catch(function(e) {
          patchCreate({ busy: false, error: C.errText(e) });
        });
      }
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
        if (guard.locked) return;
        openS[1]({ group: row, items: [], loading: true, error: "" });
        var seq = inflight.seq += 1;
        C.call(api, "vault.subjectsOf", { groupId: row.id }).then(function(r) {
          if (inflight.seq !== seq) return;
          openS[1]({ group: row, items: r && r.items || [], loading: false, error: "" });
        }).catch(function(e) {
          if (inflight.seq !== seq) return;
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
      var rows = listS[0].rows;
      var columns = [
        { key: "name", label: "\u5206\u7EC4" },
        { key: "description", label: "\u63CF\u8FF0" },
        { key: "sets", label: "\u96C6\u5408\u4E0E\u8D26\u53F7" },
        { key: "secrets", label: "\u51ED\u636E", align: "right" },
        { key: "bindings", label: "\u5173\u8054\u5BF9\u8C61", align: "right" },
        { key: "ops", label: "\u64CD\u4F5C", align: "right" }
      ];
      function renderRow(row) {
        var sets = setsOfGroup(row);
        return h(
          "tr",
          { key: row.id },
          h("td", null, h("div", { className: "wbv-cell-main" }, row.name), h("div", { className: "wbv-cell-sub" }, row.id)),
          h("td", null, row.description || "\u2014"),
          h("td", null, sets.length ? h("div", { className: "wbv-chips" }, sets.map(function(set) {
            return h("span", { key: set.id, className: "wbv-chip" }, set.name);
          })) : h("span", { className: "wbv-muted" }, "\u672A\u6302\u96C6\u5408\u4E0E\u8D26\u53F7")),
          h("td", { className: "wbv-right" }, row.secretCount || 0),
          h("td", { className: "wbv-right" }, row.bindingCount || 0),
          h("td", null, h(
            "div",
            { className: "wbv-actions" },
            h(C.Btn, { h, kind: "ghost", onClick: function() {
              open(row);
            } }, "\u67E5\u770B\u5173\u8054"),
            h(C.Btn, { h, kind: "ghost wbv-delete", onClick: function() {
              remove(row);
            } }, "\u5220\u9664")
          ))
        );
      }
      if (!guard.ready) return h("div", { className: "wbv" }, h(C.Empty, { h, text: "\u6B63\u5728\u8BFB\u53D6\u4FDD\u9669\u7BB1\u72B6\u6001\u2026" }));
      if (guard.locked) return h(Lock2.Panel, { h, C, lang, error: guard.error });
      return h(
        "div",
        { className: "wbv" },
        h(P.PageHead, {
          h,
          title: "\u5206\u7EC4\u4E0E\u5173\u8054",
          sub: "\u4E1A\u52A1\u6A21\u5757\uFF08\u7AD9\u70B9\u3001\u8FDE\u63A5\u5668\u7B49\uFF09\u628A\u81EA\u5DF1\u7684\u5BF9\u8C61\u5173\u8054\u5230\u5206\u7EC4\uFF0C\u518D\u6309\u7EC4\u53D6\u7528\u7EC4\u5185\u51ED\u636E\uFF1B\u5173\u8054\u5F15\u7528\u4FDD\u5B58\u5728\u4FDD\u9669\u7BB1\uFF0C\u4E0D\u8981\u6C42\u6A21\u5757\u4F9D\u8D56 sites\u3002",
          actions: [
            h(C.Btn, { h, key: "refresh", onClick: load }, iconLabel(h, Refresh, "\u5237\u65B0")),
            h(C.Btn, { h, key: "create", kind: "primary", onClick: openCreate }, iconLabel(h, Plus2, "\u65B0\u5EFA\u5206\u7EC4"))
          ]
        }),
        h(C.Notice, { h, kind: "error", text: listS[0].error || msgS[0] }),
        listS[0].loading ? h(C.Empty, { h, text: "\u8BFB\u53D6\u5206\u7EC4\u2026" }) : rows.length === 0 ? h(P.EmptyState, {
          h,
          title: "\u8FD8\u6CA1\u6709\u5206\u7EC4",
          hint: "\u5EFA\u4E00\u4E2A\u7EC4\uFF0C\u628A\u96C6\u5408\u6302\u8FDB\u6765\uFF0C\u518D\u628A\u6A21\u5757\u5BF9\u8C61\u5173\u8054\u5230\u7EC4\u3002"
        }, h(C.Btn, { h, kind: "primary", onClick: openCreate }, "\u65B0\u5EFA\u5206\u7EC4")) : h(P.DataTable, { h, label: "\u5206\u7EC4\u5217\u8868", columns, rows, renderRow }),
        createS[0] ? h(
          Dialog,
          {
            h,
            React,
            title: "\u65B0\u5EFA\u5206\u7EC4",
            titleId: "wbv-group-create-title",
            busy: createS[0].busy,
            onClose: closeCreate,
            closeOnEscape: !createS[0].busy,
            closeOnMask: !createS[0].busy,
            autoFocus: false
          },
          h(
            "div",
            { className: "wbv-modal-body" },
            h(
              C.Field,
              { h, label: "\u5206\u7EC4\u540D\u79F0" },
              h(P.Input, {
                h,
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
              h(P.Input, {
                h,
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
              { h, label: "\u96C6\u5408\u4E0E\u8D26\u53F7\uFF08\u53EF\u591A\u9009\uFF09", hint: "\u52FE\u9009\u7684\u96C6\u5408\u4F1A\u4E00\u5E76\u6302\u5230\u8FD9\u4E2A\u5206\u7EC4" },
              h(FilterChecklist, {
                items: pickS[0].rows.slice(0, pickS[0].page * PICK_PAGE).map(function(set) {
                  return { id: set.id, name: set.name, meta: (set.secretCount || 0) + " \u6761" };
                }),
                selected: createS[0].setIds || [],
                onToggle: toggleCreateSet,
                query: pickS[0].q,
                onQuery: pickQuery,
                title: "\u5168\u90E8\u96C6\u5408\u4E0E\u8D26\u53F7",
                total: pickS[0].rows.length,
                selectedText: "\u5DF2\u9009",
                clearText: "\u6E05\u7A7A",
                onClear: pickClear,
                searchPlaceholder: "\u641C\u7D22\u96C6\u5408\u540D\u3001\u8D26\u53F7\u6216\u63CF\u8FF0",
                loading: pickS[0].loading,
                hasMore: pickS[0].page * PICK_PAGE < pickS[0].rows.length,
                onLoadMore: pickMore,
                emptyText: "\u8FD8\u6CA1\u6709\u96C6\u5408\u4E0E\u8D26\u53F7\uFF0C\u53EF\u5148\u5EFA\u7EC4\uFF0C\u518D\u5230\u300C\u96C6\u5408\u4E0E\u8D26\u53F7\u300D\u9875\u65B0\u5EFA",
                noMatchText: "\u6CA1\u6709\u5339\u914D\u7684\u96C6\u5408\u4E0E\u8D26\u53F7",
                noMoreText: pickS[0].rows.length > PICK_PAGE ? "\u6CA1\u6709\u66F4\u591A" : "",
                loadingText: "\u52A0\u8F7D\u4E2D\u2026",
                disabled: createS[0].busy,
                autoFocus: false
              })
            ),
            h(C.Notice, { h, kind: "error", text: createS[0].error })
          ),
          h(
            "div",
            { className: "wbv-modal-foot" },
            h("span", { className: "wbv-grow" }),
            h(C.Btn, { h, disabled: createS[0].busy, onClick: closeCreate }, "\u53D6\u6D88"),
            h(C.Btn, { h, kind: "primary", disabled: createS[0].busy, onClick: create }, createS[0].busy ? "\u521B\u5EFA\u4E2D\u2026" : "\u521B\u5EFA")
          )
        ) : null,
        delS[0] ? h(
          ConfirmDialog,
          {
            h,
            React,
            title: "\u5220\u9664\u5206\u7EC4\u300C" + delS[0].row.name + "\u300D\uFF1F",
            message: "\u53EA\u5220\u9664\u5206\u7EC4\u4E0E\u96C6\u5408\u3001\u5173\u8054\u5BF9\u8C61\u7684\u7ED1\u5B9A\uFF0C\u51ED\u636E\u4E0E\u96C6\u5408\u672C\u8EAB\u90FD\u4FDD\u7559\u3002",
            confirmText: "\u786E\u8BA4\u5220\u9664",
            busyText: "\u5220\u9664\u4E2D\u2026",
            busy: busyS[0],
            onCancel: function() {
              if (!busyS[0]) delS[1](null);
            },
            onConfirm: confirmRemove
          },
          h(
            C.Field,
            { h, label: "\u7EC4\u5185\u96C6\u5408\u6539\u6302\u5230", hint: "\u7559\u7A7A\u8868\u793A\u4ECE\u6240\u6709\u5206\u7EC4\u79FB\u51FA\uFF08\u96C6\u5408\u4E0E\u51ED\u636E\u4E0D\u5220\uFF09" },
            h(
              P.Select,
              {
                h,
                value: delS[0].moveTo,
                disabled: busyS[0],
                onChange: function(e) {
                  delS[1]({ row: delS[0].row, moveTo: e.target.value });
                }
              },
              h("option", { value: "" }, "\u4E0D\u8F6C\u79FB\uFF08\u79FB\u51FA\u5206\u7EC4\uFF09"),
              rows.filter(function(g) {
                return g.id !== delS[0].row.id;
              }).map(function(g) {
                return h("option", { key: g.id, value: g.id }, g.name);
              })
            )
          )
        ) : null,
        openS[0] ? h(
          Dialog,
          {
            h,
            React,
            title: "\u300C" + openS[0].group.name + "\u300D\u7684\u5173\u8054\u5BF9\u8C61",
            titleId: "wbv-group-open-title",
            onClose: function() {
              openS[1](null);
            }
          },
          h(
            "div",
            { className: "wbv-modal-body" },
            h("p", { className: "wbv-modal-sub" }, "\u6302\u8F7D\u96C6\u5408\uFF08\u52FE\u9009\u5373\u6302\u8F7D\uFF0C\u53D6\u6D88\u5373\u6458\u9664\uFF0C\u53EA\u6539\u5173\u8054\u4E0D\u52A8\u51ED\u636E\uFF09"),
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
            }) : h("span", { className: "wbv-muted" }, "\u8FD8\u6CA1\u6709\u96C6\u5408\u4E0E\u8D26\u53F7")),
            openS[0].loading ? h(C.Empty, { h, text: "\u8BFB\u53D6\u4E2D\u2026" }) : openS[0].error ? h(C.Notice, { h, kind: "error", text: openS[0].error }) : openS[0].items.length === 0 ? h(P.EmptyState, { h, title: "\u8FD8\u6CA1\u6709\u6A21\u5757\u5173\u8054\u5230\u8FD9\u4E2A\u5206\u7EC4", hint: "\u5173\u8054\u7531\u4E1A\u52A1\u6A21\u5757\u901A\u8FC7 vault.bind \u6CE8\u518C\uFF0C\u8FD9\u91CC\u53EA\u8BFB\u3002" }) : h(P.DataTable, {
              h,
              label: "\u5173\u8054\u5BF9\u8C61",
              columns: [{ key: "type", label: "\u7C7B\u578B" }, { key: "id", label: "\u5BF9\u8C61 id" }, { key: "title", label: "\u6807\u9898" }],
              rows: openS[0].items,
              renderRow: function(item, i) {
                return h(
                  "tr",
                  { key: i },
                  h("td", null, h("span", { className: "wbv-pill" }, item.subjectType)),
                  h("td", null, h("span", { className: "wbv-code" }, item.subjectId)),
                  h("td", null, item.title || "\u2014")
                );
              }
            })
          ),
          h(
            "div",
            { className: "wbv-modal-foot" },
            h("span", { className: "wbv-muted wbv-grow" }, "\u5173\u8054\u7531\u4E1A\u52A1\u6A21\u5757\u901A\u8FC7 vault.bind \u6CE8\u518C\uFF1B\u8FD9\u91CC\u53EA\u8BFB\u3002"),
            h(C.Btn, { h, onClick: function() {
              openS[1](null);
            } }, "\u5173\u95ED")
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
    var P = require_page();
    var AskPassphrase = require_ask_passphrase();
    var SecretField = require_secret_field();
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
      var show = React.useState({ old: false, next: false });
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
        React,
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
        h(P.PageHead, {
          h,
          title: "\u4FDD\u9669\u7BB1\u8BBE\u7F6E",
          sub: "\u89E3\u9501\u6A21\u5F0F\u51B3\u5B9A\u542F\u52A8\u65F6\u8981\u4E0D\u8981\u8F93\u4E3B\u53E3\u4EE4\u3001\u67E5\u770B\u660E\u6587\u8981\u4E0D\u8981\u518D\u9A8C\u8BC1\uFF1B\u6539\u4E3B\u53E3\u4EE4\u53EA\u91CD\u5305 DEK\u3002",
          pill: status ? h("span", { className: "wbv-pill" + (status.locked ? " warn" : " ok") }, status.locked ? "\u5DF2\u9501\u5B9A" : "\u5DF2\u89E3\u9501") : null
        }),
        h(C.Notice, { h, kind: "error", text: msg[0] }),
        h(
          P.Card,
          { h, title: "\u89E3\u9501\u6A21\u5F0F" },
          h("div", { className: "wbv-check-list" }, MODES.map(function(m) {
            return h(
              "label",
              { key: m.id, className: "wbv-choice" },
              h("input", { type: "radio", name: "vault-mode", checked: mode[0] === m.id, onChange: function() {
                mode[1](m.id);
              } }),
              h(
                "span",
                { className: "wbv-choice-text" },
                h("span", { className: "wbv-choice-title" }, m.title),
                h("span", { className: "wbv-choice-desc" }, m.desc)
              )
            );
          })),
          h(
            "div",
            { className: "wbv-form-actions" },
            h("span", { className: "wbv-muted wbv-grow" }, status ? "\u5F53\u524D\uFF1A" + status.unlockMode + (status.locked ? "\uFF08\u5DF2\u9501\u5B9A\uFF09" : "\uFF08\u5DF2\u89E3\u9501\uFF09") : "\u8BFB\u53D6\u4E2D\u2026"),
            h(C.Btn, { h, kind: "primary", disabled: busy[0], onClick: applyMode }, busy[0] ? "\u5E94\u7528\u4E2D\u2026" : "\u5E94\u7528\u6A21\u5F0F")
          )
        ),
        h(
          P.Card,
          { h, title: "\u4FEE\u6539\u4E3B\u53E3\u4EE4" },
          h("p", { className: "wbv-sub" }, "\u53EA\u91CD\u5305 DEK\uFF0C\u4E0D\u4F1A\u91CD\u65B0\u52A0\u5BC6\u6240\u6709\u51ED\u636E\uFF1Bdevice key \u4E0D\u53D7\u5F71\u54CD\u3002"),
          h(
            "div",
            { className: "wbv-form-grid" },
            h(
              C.Field,
              { h, label: "\u5F53\u524D\u53E3\u4EE4" },
              h(SecretField, {
                h,
                show: show[0].old,
                value: oldPass[0],
                autoComplete: "current-password",
                onChange: function(v) {
                  oldPass[1](v);
                },
                onToggle: function() {
                  show[1](Object.assign({}, show[0], { old: !show[0].old }));
                }
              })
            ),
            h(
              C.Field,
              { h, label: "\u65B0\u53E3\u4EE4\uFF08\u81F3\u5C11 10 \u4F4D\uFF09" },
              h(SecretField, {
                h,
                show: show[0].next,
                value: newPass[0],
                autoComplete: "new-password",
                onChange: function(v) {
                  newPass[1](v);
                },
                onToggle: function() {
                  show[1](Object.assign({}, show[0], { next: !show[0].next }));
                }
              })
            )
          ),
          h(
            "div",
            { className: "wbv-form-actions" },
            h(C.Btn, { h, kind: "primary", disabled: busy[0], onClick: changePass }, "\u4FEE\u6539\u53E3\u4EE4")
          )
        ),
        h(
          P.Card,
          { h, title: "Device key" },
          h("p", { className: "wbv-sub" }, "B/C \u6A21\u5F0F\u7528\u6765\u5728\u542F\u52A8\u65F6\u81EA\u52A8\u89E3\u9501\u3002key \u6587\u4EF6\u4F4D\u4E8E $WB_HOME/vault-device.key\uFF0C\u6743\u9650 0600\uFF1B\u5220\u9664\u5B83\u7B49\u540C\u56DE\u5230\u9501\u5B9A\u72B6\u6001\u3002"),
          h(
            "div",
            { className: "wbv-form-actions" },
            h("span", { className: "wbv-muted wbv-grow" }, status && status.unlockMode === "A" ? "A \u6A21\u5F0F\u4E0B\u4E0D\u4F7F\u7528 device key" : ""),
            h(C.Btn, { h, disabled: busy[0] || !status || status.unlockMode === "A", onClick: rotate }, "\u8F6E\u6362 device key")
          )
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
var GLYPHS = require_icons2().ICONS;
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
    shield: GLYPHS["shield"],
    key: GLYPHS["key-round"],
    folder: GLYPHS["folder"],
    sliders: GLYPHS["sliders-horizontal"],
    database: GLYPHS["database"],
    list: GLYPHS["list"],
    layers: GLYPHS["layers"]
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
    version: "0.4.4",
    icon: GLYPHS["shield-check"],
    views: [
      { id: "status", icon: tabIcon("shield"), title: { zh: "\u4FDD\u9669\u7BB1", en: "Vault" }, component: withProps(require_status(), "\u4FDD\u9669\u7BB1") },
      { id: "secrets", icon: tabIcon("key"), title: { zh: "\u51ED\u636E", en: "Secrets" }, component: withProps(require_secrets(), "\u51ED\u636E") },
      { id: "sets", icon: tabIcon("layers"), title: { zh: "\u96C6\u5408\u4E0E\u8D26\u53F7", en: "Sets & Accounts" }, component: withProps(require_sets(), "\u96C6\u5408\u4E0E\u8D26\u53F7") },
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
