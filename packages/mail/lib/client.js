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

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/download.mjs
var download_exports = {};
__export(download_exports, {
  __iconData: () => __iconData2,
  default: () => Download
});
var __iconData2, Download;
var init_download = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/download.mjs"() {
    init_createLucideIcon();
    __iconData2 = {
      name: "download",
      size: 24,
      node: [
        ["path", { d: "M12 15V3", key: "m9g1x1" }],
        ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
        ["path", { d: "m7 10 5 5 5-5", key: "brsn70" }]
      ]
    };
    __iconData2.node;
    Download = createLucideIcon(__iconData2);
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

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/folder-input.mjs
var folder_input_exports = {};
__export(folder_input_exports, {
  __iconData: () => __iconData4,
  default: () => FolderInput
});
var __iconData4, FolderInput;
var init_folder_input = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/folder-input.mjs"() {
    init_createLucideIcon();
    __iconData4 = {
      name: "folder-input",
      size: 24,
      node: [
        [
          "path",
          {
            d: "M2 9V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-1",
            key: "fm4g5t"
          }
        ],
        ["path", { d: "M2 13h10", key: "pgb2dq" }],
        ["path", { d: "m9 16 3-3-3-3", key: "6m91ic" }]
      ]
    };
    __iconData4.node;
    FolderInput = createLucideIcon(__iconData4);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/forward.mjs
var forward_exports = {};
__export(forward_exports, {
  __iconData: () => __iconData5,
  default: () => Forward
});
var __iconData5, Forward;
var init_forward = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/forward.mjs"() {
    init_createLucideIcon();
    __iconData5 = {
      name: "forward",
      size: 24,
      node: [
        ["path", { d: "m15 17 5-5-5-5", key: "nf172w" }],
        ["path", { d: "M4 18v-2a4 4 0 0 1 4-4h12", key: "jmiej9" }]
      ]
    };
    __iconData5.node;
    Forward = createLucideIcon(__iconData5);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/inbox.mjs
var inbox_exports = {};
__export(inbox_exports, {
  __iconData: () => __iconData6,
  default: () => Inbox
});
var __iconData6, Inbox;
var init_inbox = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/inbox.mjs"() {
    init_createLucideIcon();
    __iconData6 = {
      name: "inbox",
      size: 24,
      node: [
        ["polyline", { points: "22 12 16 12 14 15 10 15 8 12 2 12", key: "o97t9d" }],
        [
          "path",
          {
            d: "M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z",
            key: "oot6mr"
          }
        ]
      ]
    };
    __iconData6.node;
    Inbox = createLucideIcon(__iconData6);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/list.mjs
var list_exports = {};
__export(list_exports, {
  __iconData: () => __iconData7,
  default: () => List
});
var __iconData7, List;
var init_list = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/list.mjs"() {
    init_createLucideIcon();
    __iconData7 = {
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
    __iconData7.node;
    List = createLucideIcon(__iconData7);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/lock.mjs
var lock_exports = {};
__export(lock_exports, {
  __iconData: () => __iconData8,
  default: () => Lock
});
var __iconData8, Lock;
var init_lock = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/lock.mjs"() {
    init_createLucideIcon();
    __iconData8 = {
      name: "lock",
      size: 24,
      node: [
        ["rect", { width: "18", height: "11", x: "3", y: "11", rx: "2", ry: "2", key: "1w4ew1" }],
        ["path", { d: "M7 11V7a5 5 0 0 1 10 0v4", key: "fwvmzm" }]
      ]
    };
    __iconData8.node;
    Lock = createLucideIcon(__iconData8);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/mail.mjs
var mail_exports = {};
__export(mail_exports, {
  __iconData: () => __iconData9,
  default: () => Mail
});
var __iconData9, Mail;
var init_mail = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/mail.mjs"() {
    init_createLucideIcon();
    __iconData9 = {
      name: "mail",
      size: 24,
      node: [
        ["path", { d: "m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7", key: "132q7q" }],
        ["rect", { x: "2", y: "4", width: "20", height: "16", rx: "2", key: "izxlao" }]
      ]
    };
    __iconData9.node;
    Mail = createLucideIcon(__iconData9);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/mail-open.mjs
var mail_open_exports = {};
__export(mail_open_exports, {
  __iconData: () => __iconData10,
  default: () => MailOpen
});
var __iconData10, MailOpen;
var init_mail_open = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/mail-open.mjs"() {
    init_createLucideIcon();
    __iconData10 = {
      name: "mail-open",
      size: 24,
      node: [
        [
          "path",
          {
            d: "M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 .8-1.6l8-6a2 2 0 0 1 2.4 0l8 6Z",
            key: "1jhwl8"
          }
        ],
        ["path", { d: "m22 10-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 10", key: "1qfld7" }]
      ]
    };
    __iconData10.node;
    MailOpen = createLucideIcon(__iconData10);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/paperclip.mjs
var paperclip_exports = {};
__export(paperclip_exports, {
  __iconData: () => __iconData11,
  default: () => Paperclip
});
var __iconData11, Paperclip;
var init_paperclip = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/paperclip.mjs"() {
    init_createLucideIcon();
    __iconData11 = {
      name: "paperclip",
      size: 24,
      node: [
        [
          "path",
          {
            d: "m16 6-8.414 8.586a2 2 0 0 0 2.829 2.829l8.414-8.586a4 4 0 1 0-5.657-5.657l-8.379 8.551a6 6 0 1 0 8.485 8.485l8.379-8.551",
            key: "1miecu"
          }
        ]
      ]
    };
    __iconData11.node;
    Paperclip = createLucideIcon(__iconData11);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/refresh-cw.mjs
var refresh_cw_exports = {};
__export(refresh_cw_exports, {
  __iconData: () => __iconData12,
  default: () => RefreshCw
});
var __iconData12, RefreshCw;
var init_refresh_cw = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/refresh-cw.mjs"() {
    init_createLucideIcon();
    __iconData12 = {
      name: "refresh-cw",
      size: 24,
      node: [
        ["path", { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8", key: "v9h5vc" }],
        ["path", { d: "M21 3v5h-5", key: "1q7to0" }],
        ["path", { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16", key: "3uifl3" }],
        ["path", { d: "M8 16H3v5", key: "1cv678" }]
      ]
    };
    __iconData12.node;
    RefreshCw = createLucideIcon(__iconData12);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/reply.mjs
var reply_exports = {};
__export(reply_exports, {
  __iconData: () => __iconData13,
  default: () => Reply
});
var __iconData13, Reply;
var init_reply = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/reply.mjs"() {
    init_createLucideIcon();
    __iconData13 = {
      name: "reply",
      size: 24,
      node: [
        ["path", { d: "M20 18v-2a4 4 0 0 0-4-4H4", key: "5vmcpk" }],
        ["path", { d: "m9 17-5-5 5-5", key: "nvlc11" }]
      ]
    };
    __iconData13.node;
    Reply = createLucideIcon(__iconData13);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/reply-all.mjs
var reply_all_exports = {};
__export(reply_all_exports, {
  __iconData: () => __iconData14,
  default: () => ReplyAll
});
var __iconData14, ReplyAll;
var init_reply_all = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/reply-all.mjs"() {
    init_createLucideIcon();
    __iconData14 = {
      name: "reply-all",
      size: 24,
      node: [
        ["path", { d: "m12 17-5-5 5-5", key: "1s3y5u" }],
        ["path", { d: "M22 18v-2a4 4 0 0 0-4-4H7", key: "1fcyog" }],
        ["path", { d: "m7 17-5-5 5-5", key: "1ed8i2" }]
      ]
    };
    __iconData14.node;
    ReplyAll = createLucideIcon(__iconData14);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/search.mjs
var search_exports = {};
__export(search_exports, {
  __iconData: () => __iconData15,
  default: () => Search
});
var __iconData15, Search;
var init_search = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/search.mjs"() {
    init_createLucideIcon();
    __iconData15 = {
      name: "search",
      size: 24,
      node: [
        ["path", { d: "m21 21-4.34-4.34", key: "14j7rj" }],
        ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }]
      ]
    };
    __iconData15.node;
    Search = createLucideIcon(__iconData15);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/sliders-vertical.mjs
var __iconData16, SlidersVertical;
var init_sliders_vertical = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/sliders-vertical.mjs"() {
    init_createLucideIcon();
    __iconData16 = {
      name: "sliders-vertical",
      size: 24,
      node: [
        ["path", { d: "M10 8h4", key: "1sr2af" }],
        ["path", { d: "M12 21v-9", key: "17s77i" }],
        ["path", { d: "M12 8V3", key: "13r4qs" }],
        ["path", { d: "M17 16h4", key: "h1uq16" }],
        ["path", { d: "M19 12V3", key: "o1uvq1" }],
        ["path", { d: "M19 21v-5", key: "qua636" }],
        ["path", { d: "M3 14h4", key: "bcjad9" }],
        ["path", { d: "M5 10V3", key: "cb8scm" }],
        ["path", { d: "M5 21v-7", key: "1w1uti" }]
      ],
      aliases: ["sliders"]
    };
    __iconData16.node;
    SlidersVertical = createLucideIcon(__iconData16);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/sliders.mjs
var sliders_exports = {};
__export(sliders_exports, {
  default: () => SlidersVertical
});
var init_sliders = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/sliders.mjs"() {
    init_sliders_vertical();
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/send.mjs
var send_exports = {};
__export(send_exports, {
  __iconData: () => __iconData17,
  default: () => Send
});
var __iconData17, Send;
var init_send = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/send.mjs"() {
    init_createLucideIcon();
    __iconData17 = {
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
    __iconData17.node;
    Send = createLucideIcon(__iconData17);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/trash.mjs
var __iconData18, Trash;
var init_trash = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/trash.mjs"() {
    init_createLucideIcon();
    __iconData18 = {
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
    __iconData18.node;
    Trash = createLucideIcon(__iconData18);
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

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/users.mjs
var users_exports = {};
__export(users_exports, {
  __iconData: () => __iconData19,
  default: () => Users
});
var __iconData19, Users;
var init_users = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/users.mjs"() {
    init_createLucideIcon();
    __iconData19 = {
      name: "users",
      size: 24,
      node: [
        ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
        ["path", { d: "M16 3.128a4 4 0 0 1 0 7.744", key: "16gr8j" }],
        ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87", key: "kshegd" }],
        ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
      ]
    };
    __iconData19.node;
    Users = createLucideIcon(__iconData19);
  }
});

// packages/addons/mail/client/ui/icons.cjs
var require_icons2 = __commonJS({
  "packages/addons/mail/client/ui/icons.cjs"(exports2, module2) {
    "use strict";
    var icons = require_icons();
    var set = icons.create("wbml", {
      "database": (init_database(), __toCommonJS(database_exports)).default,
      "download": (init_download(), __toCommonJS(download_exports)).default,
      "folder": (init_folder(), __toCommonJS(folder_exports)).default,
      "folder-input": (init_folder_input(), __toCommonJS(folder_input_exports)).default,
      "forward": (init_forward(), __toCommonJS(forward_exports)).default,
      "inbox": (init_inbox(), __toCommonJS(inbox_exports)).default,
      "list": (init_list(), __toCommonJS(list_exports)).default,
      "lock": (init_lock(), __toCommonJS(lock_exports)).default,
      "mail": (init_mail(), __toCommonJS(mail_exports)).default,
      "mail-open": (init_mail_open(), __toCommonJS(mail_open_exports)).default,
      "paperclip": (init_paperclip(), __toCommonJS(paperclip_exports)).default,
      "refresh-cw": (init_refresh_cw(), __toCommonJS(refresh_cw_exports)).default,
      "reply": (init_reply(), __toCommonJS(reply_exports)).default,
      "reply-all": (init_reply_all(), __toCommonJS(reply_all_exports)).default,
      "search": (init_search(), __toCommonJS(search_exports)).default,
      "sliders": (init_sliders(), __toCommonJS(sliders_exports)).default,
      "send": (init_send(), __toCommonJS(send_exports)).default,
      "trash-2": (init_trash_2(), __toCommonJS(trash_2_exports)).default,
      "users": (init_users(), __toCommonJS(users_exports)).default
    });
    module2.exports = { ICONS: set.ICONS, Icon: set.Icon };
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

// packages/addons/mail/client/ui/styles.cjs
var require_styles = __commonJS({
  "packages/addons/mail/client/ui/styles.cjs"(exports2, module2) {
    "use strict";
    var SW = require_switch();
    var NF = require_number_field();
    module2.exports = require_client_base_styles()("wbml").concat(require_vault_lock().create({ prefix: "wbml" }).styles()).concat([
      ".wbml-page{display:flex;flex-direction:column;gap:12px;padding:16px;overflow:auto;height:100%;box-sizing:border-box}",
      ".wbml-input{border:1px solid var(--wb-border,#d1d5db);border-radius:7px;padding:6px 8px;font:inherit;background:var(--wb-surface,#fff);color:inherit;min-width:120px}",
      ".wbml-addr{display:flex;align-items:stretch;min-width:0}",
      ".wbml-addr .wbml-input{border-top-right-radius:0;border-bottom-right-radius:0;min-width:0;flex:1}",
      ".wbml-addr-at{display:flex;align-items:center;padding:0 4px;color:var(--wb-muted,#6b7280);border:1px solid var(--wb-border,#d1d5db);border-left:0;border-right:0;background:var(--wb-surface,#fff)}",
      ".wbml-addr-dom{border-top-left-radius:0;border-bottom-left-radius:0;border-left:0;min-width:96px}",
      ".wbml-addr>span.wbml-addr-dom{display:flex;align-items:center;padding:0 8px;border:1px solid var(--wb-border,#d1d5db);border-top-right-radius:7px;border-bottom-right-radius:7px;background:var(--wb-surface,#fff);color:var(--wb-muted,#6b7280)}",
      ".wbml-actions{display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap;margin-top:8px}",
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
      '.wbml-list-row{position:relative;display:grid;grid-template-columns:18px minmax(0,1fr) auto;grid-template-areas:"st who time" "st line line";gap:1px 10px;padding:8px 12px;align-items:center;border:0;border-bottom:1px solid var(--wb-line,#eef0f3);background:transparent;color:inherit;font:inherit;text-align:left;cursor:pointer;min-height:56px;box-sizing:border-box}',
      ".wbml-list-row:hover{background:var(--wb-surface,#f8fafc)}",
      ".wbml-list-row.on{background:color-mix(in srgb,var(--wb-accent,#2563eb) 12%,transparent)}",
      ".wbml-st{grid-area:st;justify-self:center;align-self:center;display:inline-flex;color:var(--wb-accent,#2563eb)}",
      ".wbml-st svg{display:block}",
      ".wbml-list-row.unread .wbml-sender,.wbml-list-row.unread .wbml-subject{font-weight:650;color:inherit}",
      ".wbml-list-row.read .wbml-st{color:var(--wb-muted,#6b7280);opacity:.7}",
      ".wbml-list-row.read .wbml-sender,.wbml-list-row.read .wbml-subject{font-weight:400;color:color-mix(in srgb,currentColor 72%,transparent)}",
      ".wbml-who{grid-area:who;font-size:13px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
      ".wbml-line{grid-area:line;display:flex;align-items:baseline;gap:8px;min-width:0}",
      ".wbml-subject{font-size:13px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:0 1 auto;min-width:0}",
      ".wbml-snippet{font-size:12px;color:var(--wb-muted,#6b7280);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1 1 0;min-width:0}",
      ".wbml-time{grid-area:time;font-size:11px;color:var(--wb-muted,#6b7280);white-space:nowrap}",
      ".wbml-listpane{min-height:0;container:mail-list / inline-size}",
      ".wbml-date-group{flex:none;margin:0;padding:6px 12px;font-size:11px;font-weight:650;color:var(--wb-muted);background:var(--wb-card);border-bottom:1px solid var(--wb-line)}",
      ".wbml-list-row{--wbml-date-width:8rem;flex:none;align-items:center;grid-template-columns:18px minmax(0,1fr) 18px var(--wbml-date-width);grid-template-areas:'st who attachment time' 'st line line line'}",
      ".wbml-attachment-name{display:none;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.wbml-attachment svg{flex:none}",
      ".wbml-who{display:flex;align-items:center;gap:5px;min-width:0}.wbml-sender,.wbml-source{overflow:hidden;white-space:nowrap;text-overflow:ellipsis;min-width:0}.wbml-source{max-width:45%;font-size:11px;font-weight:400;color:var(--wb-muted)}",
      ".wbml-attachment{grid-area:attachment;justify-self:center;display:inline-flex;color:var(--wb-muted)}.wbml-time{text-align:right;font-variant-numeric:tabular-nums;font-weight:400}",
      "@container mail-list (min-width:620px){.wbml-list-row{min-height:42px;grid-template-columns:18px clamp(132px,20%,240px) minmax(0,1fr) clamp(72px,16%,180px) var(--wbml-date-width);grid-template-areas:'st who line attachment time'}.wbml-attachment{justify-self:start;max-width:100%;min-width:0;align-items:center;gap:4px}.wbml-attachment-name{display:block;font-size:11px}}",
      ".wbml-detailpane{min-height:0}",
      ".wbml-detail-head{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;padding:10px 12px;border-bottom:1px solid var(--wb-border,#eef0f3);background:var(--wb-surface,#fff)}",
      ".wbml-detail-head{flex-direction:column}.wbml-reader-nav{display:flex;gap:6px;flex-wrap:wrap}.wbml-detail-meta{overflow-wrap:anywhere}",
      "@media (max-width:900px){.wbml-layout.has-detail>.wbml-listpane,.wbml-layout.has-detail>.wbml-rail{display:none}}",
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
      /* 插槽贡献：渲染在任务详情里，不能假设外层有 .wbml-tools 的间距 */
      ".wbml-slot-back{display:inline-flex;align-items:center;gap:5px;white-space:nowrap}",
      ".wbml-sync-status{margin:0 0 12px;padding:8px 10px;border:1px solid var(--wb-line);border-radius:8px;background:var(--wb-surface);color:var(--wb-muted);font-size:12px}",
      ".wbml-paging,.wbml-tools,.wbml-search{display:flex;align-items:center;gap:8px;flex-wrap:wrap}",
      ".wbml-paging,.wbml-tools{padding:8px 12px;color:var(--wb-muted);border-top:1px solid var(--wb-line)}",
      ".wbml-search .wbml-field{flex:1;min-width:0}.wbml-input{max-width:100%;box-sizing:border-box}",
      ".wbml-detail-content{min-height:0;overflow:auto}.wbml-tools>.wbml-input{flex:1;min-width:100px}",
      ".wbml-rail input[type=checkbox]{accent-color:var(--wb-accent)}",
      ".wbml-page.is-split :is(button,input,select):focus-visible{outline:2px solid var(--wb-accent);outline-offset:-2px}",
      ".wbml-list-row:hover:not(.on){background:color-mix(in srgb,var(--wb-accent) 7%,var(--wb-surface))}",
      ".wbml-bulk{flex:none;display:flex;align-items:center;flex-wrap:wrap;gap:6px;padding:6px 12px;color:inherit;background:var(--wb-card);border-bottom:1px solid var(--wb-line);font-size:12px}",
      ".wbml-bulk-report{flex-basis:100%;display:flex;align-items:center;flex-wrap:wrap;gap:8px;overflow-wrap:anywhere}.wbml-bulk-report details{max-width:100%;max-height:8rem;overflow:auto}",
      ".wbml-bulk-row{display:grid;flex:none;grid-template-columns:30px minmax(0,1fr);align-items:stretch}.wbml-bulk-row>input{justify-self:center;align-self:center;accent-color:var(--wb-accent)}",
      ".wbml-bulk-row:has(>input:checked){background:color-mix(in srgb,var(--wb-accent) 9%,var(--wb-card))}",
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
      ".wbml-picker-note{margin:0;font-size:12px;line-height:1.6;color:var(--wb-muted,#6b7280);border:1px dashed var(--wb-border,#d4d4d8);border-radius:8px;padding:8px 10px}",
      // 配置页：分组卡片 + 行内控件，颜色全部取自主题 token。
      ".wbml-config{display:grid;gap:14px}",
      ".wbml-cfg-group{border:1px solid var(--wb-line,#e5e7eb);border-radius:12px;background:var(--wb-card,#fff);padding:4px 14px}",
      ".wbml-cfg-group h3{margin:10px 0 2px;font-size:12px;font-weight:650;letter-spacing:.02em;color:var(--wb-muted,#6b7280);text-transform:none}",
      ".wbml-cfg-row{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:10px 16px;align-items:center;padding:11px 0;border-top:1px solid var(--wb-line,#e5e7eb)}",
      ".wbml-cfg-group h3+.wbml-cfg-row{border-top:0}",
      ".wbml-cfg-main{display:grid;gap:3px;min-width:0}",
      ".wbml-cfg-label{display:flex;align-items:center;gap:6px;font-size:13px}",
      ".wbml-cfg-badge{font-size:10px;padding:1px 6px;border-radius:999px;border:1px solid var(--wb-line,#e5e7eb);color:var(--wb-accent,#2563eb)}",
      ".wbml-cfg-hint{font-size:11px;line-height:1.55;color:var(--wb-muted,#6b7280)}",
      ".wbml-cfg-ctl{display:flex;align-items:center;justify-content:flex-end;gap:8px}",
      ".wbml-toast{position:sticky;bottom:8px;justify-self:start;font-size:12px;padding:6px 12px;border-radius:999px;border:1px solid var(--wb-line,#e5e7eb);background:var(--wb-card,#fff);box-shadow:0 6px 18px rgba(0,0,0,.08)}",
      "@media(max-width:760px){.wbml-cfg-row{grid-template-columns:1fr}.wbml-cfg-ctl{justify-content:flex-start}.wbml-cfg-group{padding:4px 10px}}"
    ]).concat(SW.styles).concat(NF.styles).concat(require_icon_label().styles).join("\n");
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

// packages/addons/mail/client/ui/common.cjs
var require_common = __commonJS({
  "packages/addons/mail/client/ui/common.cjs"(exports2, module2) {
    "use strict";
    module2.exports = require_client_common()("wbml");
  }
});

// packages/addons/mail/client/ui/lock-gate.cjs
var require_lock_gate = __commonJS({
  "packages/addons/mail/client/ui/lock-gate.cjs"(exports2, module2) {
    "use strict";
    var Lock2 = require_vault_lock().create({
      prefix: "wbml",
      wrapClass: "wbml-page",
      Icon: require_icons2().ICONS.lock,
      title: { zh: "\u4FDD\u9669\u7BB1\u5DF2\u9501\u5B9A\uFF0C\u90AE\u4EF6\u6682\u4E0D\u53EF\u67E5\u770B", en: "The vault is locked" },
      hint: {
        zh: "\u9501\u5B9A\u671F\u95F4\u4E0D\u663E\u793A\u53D1\u4EF6\u4EBA\u3001\u4E3B\u9898\u3001\u6B63\u6587\u4E0E\u9644\u4EF6\u3002\u8BF7\u5148\u5728\u300C\u4FDD\u9669\u7BB1\u300D\u9875\u89E3\u9501\uFF1B\u89E3\u9501\u540E\u672C\u9875\u4F1A\u81EA\u52A8\u6062\u590D\u3002",
        en: "Sender, subject, body and attachments stay hidden while the vault is locked. Unlock it on the Vault page and this page recovers automatically."
      }
    });
    function gate(Inner, h, React, C) {
      return function Guarded(props) {
        var guard = Lock2.use({ React, api: props.api, C });
        if (guard.locked) return h(Lock2.Panel, { h, C, lang: props.lang, error: guard.error });
        return h(Inner, props);
      };
    }
    module2.exports = { lock: Lock2, gate };
  }
});

// packages/addons/mail/client/views/slot-back-to-message.cjs
var require_slot_back_to_message = __commonJS({
  "packages/addons/mail/client/views/slot-back-to-message.cjs"(exports2, module2) {
    "use strict";
    module2.exports = function(deps) {
      var React = deps.React;
      var h = deps.h || React.createElement;
      var C = deps.C;
      var Icon2 = deps.Icon;
      var REF = /wb-mail:([A-Za-z0-9_.:-]+)/;
      return function MailBackToMessage(props) {
        var item = props.item;
        if (!item || item.kind !== "task") return null;
        var m = REF.exec(String(item.description || ""));
        if (!m) return null;
        var messageId = m[1];
        var en = props.lang === "en";
        return h(
          C.Btn,
          {
            h,
            kind: "ghost",
            onClick: function(e) {
              if (e && e.stopPropagation) e.stopPropagation();
              props.onNavigate("messages", { messageId });
            }
          },
          h(
            "span",
            { className: "wbml-slot-back", title: en ? "Back to the message this task came from" : "\u56DE\u5230\u521B\u5EFA\u8FD9\u6761\u4EFB\u52A1\u7684\u90AE\u4EF6" },
            h(Icon2, { name: "mail" }),
            en ? "Original mail" : "\u539F\u90AE\u4EF6"
          )
        );
      };
    };
  }
});

// packages/addons/mail/client/ui/attachments.cjs
var require_attachments = __commonJS({
  "packages/addons/mail/client/ui/attachments.cjs"(exports2, module2) {
    "use strict";
    var C = require_common();
    function size(n) {
      return n >= 1048576 ? (n / 1048576).toFixed(1) + " MiB" : n >= 1024 ? Math.ceil(n / 1024) + " KiB" : n + " B";
    }
    function save(file) {
      var binary = atob(file.base64), bytes = Uint8Array.from(binary, function(c) {
        return c.charCodeAt(0);
      });
      if (bytes.length !== file.size) throw new Error("\u9644\u4EF6\u4F20\u8F93\u4E0D\u5B8C\u6574\uFF0C\u8BF7\u91CD\u8BD5");
      var url = URL.createObjectURL(new Blob([bytes], { type: "application/octet-stream" }));
      var a = document.createElement("a");
      try {
        a.href = url;
        a.download = String(file.filename || "\u9644\u4EF6").split(/[\\/]/).pop().replace(/[\u0000-\u001f\u007f<>:"|?*\u202a-\u202e\u2066-\u2069]/g, "_").replace(/^[. ]+|[. ]+$/g, "") || "\u9644\u4EF6";
        document.body.appendChild(a);
        a.click();
      } finally {
        a.remove();
        setTimeout(function() {
          URL.revokeObjectURL(url);
        }, 3e4);
      }
    }
    module2.exports = function Attachments(props) {
      var h = props.h, items = props.items || [];
      var busy = props.React.useState(""), error = props.React.useState("");
      if (!items.length) return null;
      async function download(item) {
        busy[1](item.id);
        error[1]("");
        try {
          save(await C.call(props.api, "mail.attachmentDownload", { id: item.id }));
        } catch (e) {
          error[1](C.errText(e));
        } finally {
          busy[1]("");
        }
      }
      return h(
        "div",
        { className: "wbml-attach" },
        h("strong", { className: "wbml-attach-title" }, "\u9644\u4EF6\uFF08" + items.length + "\uFF09"),
        h("div", { className: "wbml-attach-list" }, items.map(function(item) {
          return h(
            "div",
            { className: "wbml-row", key: item.id },
            h("span", { title: item.mime }, item.filename + " \xB7 " + (item.section ? "\u4F20\u8F93 " : "") + size(item.size)),
            h(C.Btn, { h, disabled: !!busy[0] || props.localOnly || !item.section, onClick: function() {
              download(item);
            } }, props.localOnly ? "\u4EC5\u9644\u4EF6\u4FE1\u606F" : !item.section ? "\u8BF7\u91CD\u65B0\u4E0B\u8F7D\u6B63\u6587" : busy[0] === item.id ? "\u4E0B\u8F7D\u4E2D\u2026" : "\u4FDD\u5B58\u9644\u4EF6")
          );
        })),
        h(C.Notice, { h, kind: "error", text: error[0] })
      );
    };
  }
});

// packages/addons/mail/client/ui/compose-model.cjs
var require_compose_model = __commonJS({
  "packages/addons/mail/client/ui/compose-model.cjs"(exports2, module2) {
    "use strict";
    var labels = { new: "\u5199\u4FE1", reply: "\u56DE\u590D", replyAll: "\u5168\u90E8\u56DE\u590D", forward: "\u8F6C\u53D1" };
    function addresses(value, strict) {
      const out = [];
      let token = "", quoted = false, angle = false, escaped = false;
      function add() {
        const s = token.trim();
        token = "";
        if (!s) return;
        const hit = /<([^<>]+)>$/.exec(s);
        const addr = (hit ? hit[1] : s).trim();
        if (!/^[^\s<>,;@\x00-\x1f]+@[^\s<>,;@\x00-\x1f]+$/.test(addr)) {
          if (strict) throw new Error("\u90AE\u7BB1\u5730\u5740\u683C\u5F0F\u65E0\u6548\uFF1A" + s);
          return;
        }
        out.push(addr);
      }
      for (const c of String(value || "")) {
        if (!quoted && !angle && /[,，;；\n]/.test(c)) {
          add();
          continue;
        }
        token += c;
        if (escaped) {
          escaped = false;
          continue;
        }
        if (quoted && c === "\\") escaped = true;
        else if (c === '"') quoted = !quoted;
        else if (!quoted && c === "<") angle = true;
        else if (!quoted && c === ">") angle = false;
      }
      add();
      return out;
    }
    function unique(list, seen) {
      return list.filter((a) => {
        const key = a.toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    }
    function initial(mode, m, body, accounts) {
      if (!m) return { key: "new", mode: "new", originId: "", accountId: "", to: "", cc: "", subject: "", text: "" };
      const self = new Set(accounts.map((a) => a.email.toLowerCase()));
      const seen = new Set(self);
      const senders = addresses(m.from);
      const fromSelf = senders.length && senders.every((a) => self.has(a.toLowerCase()));
      const forward = mode === "forward";
      const replyTo = addresses(m.replyTo);
      const primary = fromSelf ? addresses(m.to) : replyTo.length ? replyTo : senders;
      const to = forward ? [] : unique(mode === "replyAll" ? primary.concat(addresses(m.to)) : primary, seen);
      const cc = mode === "replyAll" ? unique(addresses(m.cc), seen) : [];
      const prefix = forward ? "Fwd:" : "Re:";
      const subject = m.subject || "";
      return {
        key: mode + ":" + m.id,
        accountId: m.accountId,
        originId: m.id,
        mode,
        to: to.join(", "),
        cc: cc.join(", "),
        subject: (forward ? /^(fwd?|转发):/i : /^(re|回复):/i).test(subject) ? subject : prefix + " " + subject,
        text: forward ? "\n\n---------- \u8F6C\u53D1\u90AE\u4EF6 ----------\n\u53D1\u4EF6\u4EBA\uFF1A" + m.from + "\n\u6536\u4EF6\u4EBA\uFF1A" + m.to + "\n\u4E3B\u9898\uFF1A" + subject + "\n\n" + body : ""
      };
    }
    module2.exports = { labels, addresses, unique, initial };
  }
});

// packages/addons/mail/client/ui/send-attachments.cjs
var require_send_attachments = __commonJS({
  "packages/addons/mail/client/ui/send-attachments.cjs"(exports2, module2) {
    "use strict";
    var C = require_common();
    var maxBytes = 8 * 1024 * 1024;
    function fits(local, selected) {
      return local.length + selected.length <= 10 && local.concat(selected).reduce((n, file) => n + (Number(file.size) || 0), 0) <= maxBytes;
    }
    function readFile(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = reader.onabort = () => reject(new Error("\u65E0\u6CD5\u8BFB\u53D6\u9644\u4EF6\uFF1A" + file.name));
        reader.onload = () => {
          const result = String(reader.result || "");
          const marker = result.indexOf(",");
          if (marker < 0) return reject(new Error("\u65E0\u6CD5\u8BFB\u53D6\u9644\u4EF6\uFF1A" + file.name));
          resolve({ filename: file.name, mime: file.type, secretBase64: result.slice(marker + 1) });
        };
        reader.readAsDataURL(file);
      });
    }
    function useAttachments(R, api, value, original) {
      const [files, setFiles] = R.useState([]), [ids, setIds] = R.useState([]), [error, setError] = R.useState("");
      const origin = value?.mode === "forward" ? value.originId : "";
      const [remote, setRemote] = R.useState({});
      R.useEffect(() => {
        if (!origin || original) return;
        let active = true;
        C.call(api, "mail.messageGet", { id: origin }).then((data) => {
          if (active) setRemote({ data });
        }, (e) => {
          if (active) setRemote({ error: C.errText(e) });
        });
        return () => {
          active = false;
        };
      }, [origin, original, api]);
      const available = origin ? (original || remote.data?.attachments || []).filter((f) => f.section) : [];
      const chosen = available.filter((f) => ids.includes(f.id));
      const limit = "\u9644\u4EF6\u5408\u8BA1\u6700\u591A 10 \u4E2A\u30018 MiB";
      return {
        async read() {
          if (chosen.length !== ids.length) throw new Error("\u9009\u4E2D\u7684\u539F\u9644\u4EF6\u5DF2\u53D8\u5316\uFF0C\u8BF7\u91CD\u65B0\u9009\u62E9");
          if (!fits(files, chosen)) throw new Error(limit);
          return { uploads: await Promise.all(files.map(readFile)), originalAttachmentIds: ids };
        },
        render(h, busy) {
          return h(
            "section",
            null,
            h(C.Field, { h, label: "\u6DFB\u52A0\u672C\u673A\u9644\u4EF6", hint: limit }, h("input", { type: "file", multiple: true, disabled: busy, onChange: (e) => {
              const next = files.concat(Array.from(e.target.files || []));
              e.target.value = "";
              if (fits(next, chosen)) {
                setFiles(next);
                setError("");
              } else setError(limit);
            } })),
            files.map((file, i) => h("div", { key: i, className: "wbml-actions" }, h("span", null, file.name), h(C.Btn, { h, disabled: busy, "aria-label": "\u79FB\u9664 " + file.name, onClick: () => {
              setFiles(files.filter((_, j) => j !== i));
              setError("");
            } }, "\u79FB\u9664"))),
            origin && available.length ? h("fieldset", { disabled: busy }, h("legend", null, "\u968F\u4FE1\u8F6C\u53D1\u7684\u539F\u9644\u4EF6"), available.map((f) => h("div", { key: f.id }, h("label", null, h("input", { type: "checkbox", checked: ids.includes(f.id), onChange: (e) => {
              if (!e.target.checked) {
                setIds(ids.filter((id) => id !== f.id));
                setError("");
              } else if (fits(files, chosen.concat(f))) {
                setIds(ids.concat(f.id));
                setError("");
              } else setError(limit);
            } }), " " + f.filename)))) : null,
            h(C.Notice, { h, kind: "error", text: error || (origin && remote.error ? "\u65E0\u6CD5\u8BFB\u53D6\u539F\u4FE1\u9644\u4EF6\uFF1A" + remote.error : "") })
          );
        }
      };
    }
    module2.exports = useAttachments;
  }
});

// packages/addons/mail/client/ui/delivery-log.cjs
var require_delivery_log = __commonJS({
  "packages/addons/mail/client/ui/delivery-log.cjs"(exports2, module2) {
    "use strict";
    var C = require_common();
    var labels = { sending: "\u6B63\u5728\u53D1\u9001", accepted: "\u670D\u52A1\u5668\u5DF2\u63A5\u6536\uFF0C\u5C1A\u672A\u7559\u6863", archived: "\u5DF2\u53D1\u9001\u5E76\u7559\u6863", rejected: "\u670D\u52A1\u5668\u660E\u786E\u62D2\u6536", not_sent: "\u672A\u63D0\u4EA4\u5230\u670D\u52A1\u5668", unknown: "\u6295\u9012\u7ED3\u679C\u672A\u77E5\uFF0C\u8BF7\u6838\u5BF9\u90AE\u7BB1\uFF0C\u52FF\u91CD\u53D1" };
    function DeliveryLog({ h, React: R, api, refreshKey }) {
      const rows = C.useLoad(R, api, "mail.deliveryList", {}, [refreshKey]);
      const [busy, setBusy] = R.useState(""), [error, setError] = R.useState("");
      async function archive(id) {
        setBusy(id);
        setError("");
        try {
          await C.call(api, "mail.deliveryArchive", { id });
          rows.refresh();
        } catch (e) {
          setError(C.errText(e));
        } finally {
          setBusy("");
        }
      }
      return h(
        "details",
        { className: "wbml-card" },
        h("summary", null, "\u6295\u9012\u8BB0\u5F55"),
        h(C.Notice, { h, kind: "error", text: error || rows.error }),
        rows.loading ? h("p", { role: "status" }, "\u8BFB\u53D6\u4E2D\u2026") : rows.data?.items.length === 0 ? h("p", null, "\u6CA1\u6709\u5F85\u5904\u7406\u7684\u6295\u9012\u8BB0\u5F55") : null,
        (rows.data?.items || []).map((r) => h(
          "div",
          { key: r.id, className: "wbml-actions" },
          h("span", null, (r.subject || "(\u65E0\u4E3B\u9898)") + " \xB7 " + (labels[r.status] || r.status)),
          h("small", null, r.messageId),
          r.status === "accepted" ? h(C.Btn, { h, disabled: !!busy, onClick: () => archive(r.id) }, "\u8865\u8BB0\u672C\u5730\u5DF2\u53D1\u9001") : null
        ))
      );
    }
    module2.exports = { DeliveryLog, labels };
  }
});

// packages/addons/mail/client/views/compose.cjs
var require_compose = __commonJS({
  "packages/addons/mail/client/views/compose.cjs"(exports2, module2) {
    "use strict";
    var C = require_common();
    var M = require_compose_model();
    var useAttachments = require_send_attachments();
    var { DeliveryLog, labels } = require_delivery_log();
    var writes = /* @__PURE__ */ new Map();
    function queued(key, operation) {
      const prev = writes.get(key) || Promise.resolve();
      const next = prev.catch(() => {
      }).then(operation);
      writes.set(key, next);
      next.finally(() => {
        if (writes.get(key) === next) writes.delete(key);
      }).catch(() => {
      });
      return next;
    }
    function Editor(p) {
      const { h, React: R, api, draftKey: key, accounts } = p;
      const [value, setValue] = R.useState(null), [notice, setNotice] = R.useState("");
      const [busy, setBusy] = R.useState(false), [status, setStatus] = R.useState("");
      const attachments = useAttachments(R, api, value, p.originalAttachments);
      const latest = R.useRef(null), pending = R.useRef(null), timer = R.useRef(null), revision = R.useRef(0), locked = R.useRef(false), alive = R.useRef(false);
      function flush() {
        clearTimeout(timer.current);
        const draft = pending.current;
        if (!draft) return writes.get(key) || Promise.resolve();
        pending.current = null;
        const rev = revision.current;
        return queued(key, () => C.call(api, "mail.draftSave", draft)).then(() => {
          if (alive.current && revision.current === rev) setStatus("\u8349\u7A3F\u5DF2\u4FDD\u5B58");
        }, (e) => {
          if (revision.current === rev) {
            pending.current = draft;
            if (alive.current) setStatus("\u8349\u7A3F\u672A\u4FDD\u5B58\uFF1A" + C.errText(e));
          }
          throw e;
        });
      }
      R.useEffect(() => {
        let current = true;
        alive.current = true;
        (writes.get(key) || Promise.resolve()).catch(() => {
        }).then(() => C.call(api, "mail.draftGet", { key })).then((r) => {
          if (!current) return;
          latest.current = r.draft || p.initial;
          setValue(latest.current);
          if (!latest.current) setNotice("\u8349\u7A3F\u5DF2\u4E0D\u5B58\u5728");
        }).catch((e) => {
          if (current) setNotice("\u8349\u7A3F\u8BFB\u53D6\u5931\u8D25\uFF1A" + C.errText(e));
        });
        const onHide = () => {
          flush().catch(() => {
          });
        };
        if (typeof window !== "undefined") window.addEventListener("pagehide", onHide);
        return () => {
          current = false;
          alive.current = false;
          if (typeof window !== "undefined") window.removeEventListener("pagehide", onHide);
          onHide();
        };
      }, [key]);
      function change(field2, v) {
        if (locked.current) return;
        const next = Object.assign({}, latest.current, { [field2]: v });
        latest.current = next;
        pending.current = next;
        revision.current++;
        setValue(next);
        setStatus("\u6B63\u5728\u4FDD\u5B58\u8349\u7A3F\u2026");
        clearTimeout(timer.current);
        timer.current = setTimeout(() => flush().catch(() => {
        }), 350);
      }
      async function send() {
        if (locked.current) return;
        let terminal = false;
        locked.current = true;
        setBusy(true);
        setNotice("");
        try {
          const d = latest.current;
          const seen = /* @__PURE__ */ new Set();
          const to = M.unique(M.addresses(d.to, true), seen), cc = M.unique(M.addresses(d.cc, true), seen);
          if (!d.accountId || !to.length) throw new Error("\u8BF7\u9009\u62E9\u8D26\u6237\u5E76\u586B\u5199\u6536\u4EF6\u4EBA");
          await flush();
          const files = await attachments.read();
          let r;
          try {
            r = await C.call(api, "mail.composeSend", { accountId: d.accountId, to, cc, subject: d.subject, text: d.text, mode: d.mode, originId: d.originId, ...files });
          } catch (e) {
            throw new Error(C.errText(e) + "\uFF1B\u672A\u53D6\u5F97\u6295\u9012\u7ED3\u679C\u65F6\u8BF7\u5148\u6838\u5BF9\u6295\u9012\u8BB0\u5F55");
          }
          p.onDelivery?.();
          if (!r.sent && r.status !== "unknown") throw new Error((labels[r.status] || "\u53D1\u9001\u5931\u8D25") + "\uFF1A" + (r.reason || ""));
          terminal = true;
          await queued(key, () => C.call(api, "mail.draftDelete", { key }));
          p.onSent(labels[r.status]);
        } catch (e) {
          if (alive.current) setNotice((terminal ? "\u672C\u6B21\u6295\u9012\u8BF7\u52FF\u91CD\u53D1\uFF0C\u4F46\u672A\u80FD\u6E05\u7406\u8349\u7A3F\uFF1A" : "") + C.errText(e));
        } finally {
          if (!terminal) {
            locked.current = false;
            if (alive.current) setBusy(false);
          }
        }
      }
      const field = (name, label, area) => h(C.Field, { h, label }, h(area ? "textarea" : "input", { className: "wbml-input", value: value[name], rows: area ? 8 : void 0, disabled: busy, onChange: (e) => change(name, e.target.value) }));
      if (!value) return h("p", { role: "status" }, notice || "\u6B63\u5728\u8BFB\u53D6\u8349\u7A3F\u2026");
      return h(
        "div",
        { className: "wbml-card" },
        h("strong", null, M.labels[value.mode]),
        h(C.Field, { h, label: "\u53D1\u4EF6\u8D26\u6237" }, h("select", { className: "wbml-input", value: value.accountId, disabled: busy || value.mode !== "new", onChange: (e) => change("accountId", e.target.value) }, h("option", { value: "" }, "\u8BF7\u9009\u62E9"), accounts.map((a) => h("option", { key: a.id, value: a.id }, a.name + " <" + a.email + ">")))),
        field("to", "\u6536\u4EF6\u4EBA"),
        field("cc", "\u6284\u9001"),
        field("subject", "\u4E3B\u9898"),
        field("text", "\u6B63\u6587", true),
        attachments.render(h, busy),
        h(C.Notice, { h, kind: "error", text: notice }),
        h(
          "div",
          { className: "wbml-actions" },
          h(C.Btn, { h, kind: "primary", disabled: busy, onClick: send }, busy ? "\u5904\u7406\u4E2D\u2026" : "\u53D1\u9001"),
          h(C.Btn, { h, disabled: busy || !pending.current, onClick: () => flush().catch(() => {
          }) }, "\u4FDD\u5B58\u8349\u7A3F"),
          h("span", { role: "status" }, status)
        )
      );
    }
    function Compose(p) {
      const { h, React: R, api } = p;
      const accounts = C.useLoad(R, api, "mail.accountList", {}, []), drafts = C.useLoad(R, api, "mail.draftList", {}, []);
      const [deliveryRev, refreshDelivery] = R.useState(0);
      const [key, setKey] = R.useState("new"), [reset, setReset] = R.useState(0), [message, setMessage] = R.useState("");
      return h(
        "div",
        { className: "wbml-page" },
        h("h2", null, "\u5199\u4FE1"),
        h(C.Notice, { h, kind: "ok", text: message }),
        h(DeliveryLog, { h, React: R, api, refreshKey: deliveryRev }),
        h(C.Notice, { h, kind: "error", text: accounts.error || drafts.error }),
        h(C.Field, { h, label: "\u672C\u5730\u8349\u7A3F" }, h("select", { className: "wbml-input", value: key, onChange: (e) => {
          setKey(e.target.value);
          setMessage("");
        } }, h("option", { value: "new" }, "\u65B0\u90AE\u4EF6\u8349\u7A3F"), (drafts.data && drafts.data.items || []).filter((d) => d.key !== "new").map((d) => h("option", { key: d.key, value: d.key }, M.labels[d.mode] + " \xB7 " + (d.subject || "(\u65E0\u4E3B\u9898)"))))),
        h(Editor, Object.assign({}, p, { key: key + ":" + reset, draftKey: key, initial: key === "new" ? M.initial() : null, accounts: accounts.data && accounts.data.items || [], onDelivery: () => refreshDelivery((n) => n + 1), onSent: (outcome) => {
          setMessage(outcome);
          setKey("new");
          setReset((n) => n + 1);
          drafts.refresh();
        } }))
      );
    }
    module2.exports = Compose;
    module2.exports.Editor = Editor;
  }
});

// packages/addons/mail/client/ui/reply-tools.cjs
var require_reply_tools = __commonJS({
  "packages/addons/mail/client/ui/reply-tools.cjs"(exports2, module2) {
    "use strict";
    var C = require_common();
    var M = require_compose_model();
    var Editor = require_compose().Editor;
    var iconLabel = require_icon_label();
    var GLYPHS2 = require_icons2().ICONS;
    var icons = { reply: GLYPHS2.reply, replyAll: GLYPHS2["reply-all"], forward: GLYPHS2.forward };
    module2.exports = function ReplyTools(p) {
      const { React: R, h, api, message: m } = p;
      const accounts = C.useLoad(R, api, "mail.accountList", {}, []);
      const [mode, setMode] = R.useState(""), [sent, setSent] = R.useState("");
      const rows = accounts.data && accounts.data.items || [];
      const owner = rows.some((a) => a.id === m.accountId);
      const initial = mode && M.initial(mode, m, p.body || "", rows);
      return h(
        "section",
        null,
        h("div", { className: "wbml-actions" }, Object.keys(icons).map((v) => h(C.Btn, { key: v, h, disabled: !owner || v === "forward" && !p.bodyReady, onClick: () => {
          setSent("");
          setMode(v);
        } }, iconLabel(h, icons[v], M.labels[v]))), mode ? h(C.Btn, { h, onClick: () => setMode("") }, "\u6536\u8D77\u8349\u7A3F") : null),
        h(C.Notice, { h, kind: "error", text: accounts.error }),
        h(C.Notice, { h, kind: "ok", text: sent }),
        initial ? h(Editor, Object.assign({}, p, { key: initial.key, draftKey: initial.key, initial, accounts: rows, onSent: (outcome) => {
          setMode("");
          setSent(outcome);
        } })) : null
      );
    };
  }
});

// packages/addons/mail/client/ui/mail-html.cjs
var require_mail_html = __commonJS({
  "packages/addons/mail/client/ui/mail-html.cjs"(exports2, module2) {
    "use strict";
    var C = require_common();
    var SKIP_CONTENT = ["script", "iframe", "object", "applet", "svg", "math", "template", "noscript", "canvas", "audio", "video", "form", "select", "textarea", "button"];
    var SKIP_VOID = ["input", "embed", "keygen"];
    var VOID_DROP = ["link", "meta", "base", "frame", "frameset", "area", "source", "track", "col", "colgroup"];
    var VOID_KEEP = ["br", "hr", "img", "wbr"];
    var PLACEHOLDER = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
    var MAX_INLINE_BYTES = 8 * 1024 * 1024;
    var TOKEN = /<!--[\s\S]*?-->|<![^>]*>|<\?[^>]*\?>|<\/?([a-zA-Z][a-zA-Z0-9]*)((?:[^>"']|"[^"]*"|'[^']*')*?)\/?>/g;
    var ATTR = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)(?:\s*=\s*("([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g;
    function attrValue(m) {
      return m[3] != null ? m[3] : m[4] != null ? m[4] : m[5] != null ? m[5] : "";
    }
    function isHttp(url) {
      return /^\s*(?:https?|\/\/)/i.test(url);
    }
    function safeUrl(url, kind) {
      var v = String(url || "").replace(/[\u0000-\u001f\u007f]/g, "").trim();
      if (!v) return "";
      if (/^javascript:/i.test(v) || /^data:/i.test(v) && !/^data:image\//i.test(v) && kind !== "href") return "";
      if (/^(?:https?:|mailto:)/i.test(v)) return v;
      if (/^cid:/i.test(v)) return v;
      if (/^data:image\//i.test(v)) return v;
      if (/^\.{0,2}\//.test(v) || /^#/.test(v)) return "";
      return "";
    }
    function cssSafe(css, allowRemote) {
      var out = String(css || "").replace(/expression\s*\(/gi, "").replace(/behavior\s*:/gi, "").replace(/url\s*\(\s*['"]?\s*(?:javascript|vbscript|data:text\/html)[^)]*\)/gi, "none");
      if (!allowRemote) out = out.replace(/url\s*\(\s*['"]?(?:https?:)?\/\/[^)]*\)/gi, "none");
      return out;
    }
    function matchBrace(css, open) {
      var depth = 0, quote = "", i;
      for (i = open; i < css.length; i += 1) {
        var ch = css[i];
        if (quote) {
          if (ch === "\\") i += 1;
          else if (ch === quote) quote = "";
          continue;
        }
        if (ch === "/" && css[i + 1] === "*") {
          var end = css.indexOf("*/", i + 2);
          i = end < 0 ? css.length : end + 1;
          continue;
        }
        if (ch === '"' || ch === "'") {
          quote = ch;
          continue;
        }
        if (ch === "{") depth += 1;
        else if (ch === "}") {
          depth -= 1;
          if (!depth) return i;
        }
      }
      return -1;
    }
    function rewriteScheme(css, scheme) {
      var out = "", rest = String(css || ""), re = /@media\s*([^{]*prefers-color-scheme[^{]*)\{/gi, m;
      re.lastIndex = 0;
      while (m = re.exec(rest)) {
        var open = re.lastIndex - 1, close = matchBrace(rest, open);
        if (close < 0) break;
        var query = m[1].toLowerCase(), body = rest.slice(open + 1, close);
        var wants = query.indexOf("dark") >= 0 && query.indexOf("light") < 0 ? "dark" : query.indexOf("light") >= 0 && query.indexOf("dark") < 0 ? "light" : "";
        var keep = wants ? wants === scheme : true;
        out += rest.slice(0, m.index) + (keep ? rewriteScheme(body, scheme) : "");
        rest = rest.slice(close + 1);
        re.lastIndex = 0;
      }
      return out + rest;
    }
    function cleanStyleBlocks(html, allowRemote, scheme) {
      return String(html).replace(/(<style\b[^>]*>)([\s\S]*?)(<\/style>)/gi, function(all, open, body, close) {
        var css = body.replace(/@import[^;]*;?/gi, "");
        if (scheme) css = rewriteScheme(css, scheme);
        return open + cssSafe(css, allowRemote) + close;
      });
    }
    function sanitize(html, opts) {
      var allowRemote = !!(opts && opts.allowRemote);
      var src = cleanStyleBlocks(String(html == null ? "" : html), allowRemote, opts && opts.scheme);
      var out = [], remoteCount = 0, cidIds = [], last = 0, m, skipUntil = null;
      TOKEN.lastIndex = 0;
      while (m = TOKEN.exec(src)) {
        if (!skipUntil) out.push(src.slice(last, m.index));
        last = m.index + m[0].length;
        if (m[0].slice(0, 4) === "<!--" || m[0].slice(0, 2) === "<!") continue;
        var name = String(m[1] || "").toLowerCase(), closing = m[0].charAt(1) === "/", attrs = m[2] || "";
        if (!name) continue;
        if (skipUntil) {
          if (closing && name === skipUntil) skipUntil = null;
          continue;
        }
        if (!closing && SKIP_VOID.indexOf(name) >= 0) continue;
        if (!closing && SKIP_CONTENT.indexOf(name) >= 0) {
          skipUntil = /\/>$/.test(m[0]) ? null : name;
          continue;
        }
        if (VOID_DROP.indexOf(name) >= 0) continue;
        if (closing) {
          out.push("</" + name + ">");
          continue;
        }
        var keep = [];
        ATTR.lastIndex = 0;
        var a;
        while (a = ATTR.exec(attrs)) {
          var attr = a[1].toLowerCase(), value = attrValue(a);
          if (!attr || attr.slice(0, 2) === "on") continue;
          if (attr === "srcset") continue;
          if (attr === "style") {
            value = cssSafe(value, allowRemote);
            if (value) keep.push('style="' + escapeAttr(value) + '"');
            continue;
          }
          if (attr === "href") {
            value = safeUrl(value, "href");
            if (!value) continue;
            keep.push('href="' + escapeAttr(value) + '"');
            continue;
          }
          if (attr === "src") {
            if (/^cid:/i.test(value)) {
              var cid = value.slice(4).replace(/^<|>$/g, "").toLowerCase();
              if (cid && cidIds.indexOf(cid) < 0) cidIds.push(cid);
              keep.push('src="cid:' + escapeAttr(cid) + '"');
              continue;
            }
            value = safeUrl(value, "src");
            if (!value) continue;
            if (isHttp(value)) {
              remoteCount++;
              if (!allowRemote) value = PLACEHOLDER;
            }
            keep.push('src="' + escapeAttr(value) + '"');
            continue;
          }
          if (attr === "background" || attr === "poster" || attr === "data") continue;
          if (attr === "class" || attr === "id" || attr === "width" || attr === "height" || attr === "alt" || attr === "title" || attr === "colspan" || attr === "rowspan" || attr === "align" || attr === "valign" || attr === "dir" || attr === "lang" || attr === "border" || attr === "cellpadding" || attr === "cellspacing" || attr === "bgcolor") {
            keep.push(attr + '="' + escapeAttr(value) + '"');
          }
        }
        var tagName = name === "a" ? 'a target="_blank" rel="noopener noreferrer nofollow"' : name;
        var tail = VOID_KEEP.indexOf(name) >= 0 ? " />" : ">";
        out.push("<" + tagName + (keep.length ? " " + keep.join(" ") : "") + tail);
      }
      out.push(src.slice(last));
      return { html: out.join(""), remoteCount, cidIds };
    }
    function escapeAttr(v) {
      return String(v).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }
    function replaceCid(html, cidMap) {
      return String(html || "").replace(/(src\s*=\s*["'])cid:([^"']*)(["'])/gi, function(all, open, cid, close) {
        var key = String(cid).toLowerCase(), url = cidMap && cidMap[key];
        return open + (url || PLACEHOLDER) + close;
      });
    }
    function parseColor(value) {
      var v = String(value || "").trim().toLowerCase();
      var m = /^#([0-9a-f]{3})$/.exec(v);
      if (m) return [0, 1, 2].map(function(i) {
        return parseInt(m[1][i] + m[1][i], 16);
      });
      m = /^#([0-9a-f]{6})$/.exec(v);
      if (m) return [0, 1, 2].map(function(i) {
        return parseInt(m[1].slice(i * 2, i * 2 + 2), 16);
      });
      m = /^rgba?\(([^)]*)\)$/.exec(v);
      if (m) {
        var parts = m[1].split(/[,\s/]+/).filter(Boolean).map(Number);
        if (parts.length >= 3 && parts.every(function(n) {
          return isFinite(n);
        })) return parts.slice(0, 3).map(function(n) {
          return Math.max(0, Math.min(255, Math.round(n)));
        });
      }
      return null;
    }
    function luminance(rgb) {
      if (!rgb) return 0.5;
      var channel = function(n) {
        var c = n / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      };
      return 0.2126 * channel(rgb[0]) + 0.7152 * channel(rgb[1]) + 0.0722 * channel(rgb[2]);
    }
    function luminanceOf(color) {
      return luminance(parseColor(color));
    }
    var PAPER = { light: { paper: "#ffffff", ink: "#1f2328" }, dark: { paper: "#16181d", ink: "#e6e8ec" } };
    function inkFor(color) {
      return luminanceOf(color) < 0.5 ? PAPER.dark.ink : PAPER.light.ink;
    }
    function detectPaper(html, theme) {
      var source = String(html == null ? "" : html), re = /<(html|body|table|div)\b([^>]*)>/gi, m;
      while (m = re.exec(source)) {
        var attrs = m[2] || "";
        var raw = (/bgcolor\s*=\s*["']?([^"'\s>]+)/i.exec(attrs) || []).pop() || (/background-color\s*:\s*([^;"'}]+)/i.exec(attrs) || []).pop() || (/(?:^|[;"'\s])background\s*:\s*([^;"'}]+)/i.exec(attrs) || []).pop();
        var rgb = raw ? parseColor(raw) : null;
        if (!rgb) continue;
        var l = luminance(rgb);
        if (l >= 0.55) return { kind: "light", paper: PAPER.light.paper, ink: PAPER.light.ink };
        if (l <= 0.28) return { kind: "dark", paper: PAPER.dark.paper, ink: PAPER.dark.ink };
      }
      return { kind: "unknown", paper: theme && theme.paper || PAPER.light.paper, ink: theme && theme.ink || PAPER.light.ink };
    }
    function themeVars() {
      if (typeof document === "undefined" || !document.documentElement) return {};
      var cs = typeof getComputedStyle === "function" ? getComputedStyle(document.documentElement) : null;
      var root = document.querySelector ? document.querySelector(".wb-root") : null;
      var rs = root && typeof getComputedStyle === "function" ? getComputedStyle(root) : null;
      var pick = function(name, fallback) {
        var v = cs && cs.getPropertyValue(name) || rs && rs.getPropertyValue(name) || "";
        return String(v).trim() || fallback;
      };
      return {
        paper: pick("--wb-surface", "#fff"),
        line: pick("--wb-line", "#e5e7eb"),
        link: pick("--wb-accent", "#0a66c2"),
        ink: rs && String(rs.color || "").trim() || cs && String(cs.color || "").trim() || "#1f2328"
      };
    }
    function buildDoc(html, opts) {
      var allowRemote = !!(opts && opts.allowRemote), theme = opts && opts.theme || {};
      var csp = "default-src 'none'; img-src data:" + (allowRemote ? " https: http:" : "") + "; style-src 'unsafe-inline'; font-src data:; media-src 'none'; object-src 'none'; frame-src 'none'; base-uri 'none'; form-action 'none'";
      var source = String(html || "");
      var scheme = opts && opts.scheme || (luminanceOf(theme.paper) < 0.5 ? "dark" : "light");
      var mode = (opts && opts.mode) === "app" ? "app" : "original";
      var detected = detectPaper(source, theme);
      var follow = mode === "app" || detected.kind === "unknown";
      var paper = follow ? theme.paper || PAPER.light.paper : detected.paper;
      var ink = follow ? inkFor(paper) : detected.ink;
      var link = theme.link || "#0a66c2", line = follow ? theme.line || "#e5e7eb" : "rgba(0,0,0,.12)";
      var tone = luminanceOf(paper) < 0.5 ? "dark" : "light";
      return '<!doctype html><html class="wbml-' + scheme + '"><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="' + csp + '"><style>html{color-scheme:' + tone + '}html,body{margin:0;padding:0}body{padding:2px;font:13px/1.65 -apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif;color:' + ink + ";background:" + paper + ";overflow-x:hidden;word-break:break-word;overflow-wrap:anywhere}img{max-width:100%;height:auto}a{color:" + link + "}table{max-width:100%;border-collapse:collapse}td,th{vertical-align:top}pre{white-space:pre-wrap;overflow-wrap:anywhere}blockquote{margin:0 0 0 12px;padding-left:10px;border-left:2px solid " + line + ";color:inherit}</style></head><body>" + source + "</body></html>";
    }
    var modeByMail = {};
    function initialMode(props) {
      var key = String(props.mailId || "");
      if (modeByMail[key]) return modeByMail[key];
      return props.mailTheme === "app" ? "app" : "original";
    }
    module2.exports = function MailHtml(props) {
      var h = props.h, React = props.React, api = props.api;
      var allowDefault = props.remoteDefault !== false;
      var expanded = React.useState(allowDefault);
      var images = React.useState({});
      var frame = React.useRef(null);
      var theme = React.useMemo(themeVars, []);
      var scheme = luminanceOf(theme.paper) < 0.5 ? "dark" : "light";
      var mode = React.useState(function() {
        return initialMode(props);
      });
      var meta = React.useMemo(function() {
        return sanitize(props.html, { allowRemote: expanded[0], scheme });
      }, [props.html, expanded[0], scheme]);
      var byCid = React.useMemo(function() {
        var map = {};
        (props.attachments || []).forEach(function(a) {
          if (a && a.contentId) map[String(a.contentId).toLowerCase()] = a;
          else if (a && a.content_id) map[String(a.content_id).toLowerCase()] = a;
        });
        return map;
      }, [props.attachments]);
      var hasRemote = React.useMemo(function() {
        return sanitize(props.html, { allowRemote: true, scheme }).remoteCount;
      }, [props.html, scheme]);
      React.useEffect(function() {
        if (!api) return;
        var alive = true, want = [];
        meta.cidIds.forEach(function(cid) {
          var item = byCid[cid];
          if (!item || images[0][cid] || want.some(function(w) {
            return w.cid === cid;
          })) return;
          if (item.size > MAX_INLINE_BYTES) return;
          want.push({ cid, item });
        });
        if (!want.length) return;
        want.forEach(function(w) {
          C.call(api, "mail.attachmentDownload", { id: w.item.id }).then(function(file) {
            if (!alive || !file || !file.base64) return;
            var url = "data:" + String(file.mime || w.item.mime || "image/png") + ";base64," + file.base64;
            images[1](function(prev) {
              var next = Object.assign({}, prev);
              next[w.cid] = url;
              return next;
            });
          }).catch(function() {
          });
        });
        return function() {
          alive = false;
        };
      }, [meta.cidIds, byCid, api]);
      var doc = React.useMemo(function() {
        return buildDoc(replaceCid(meta.html, images[0]), { allowRemote: expanded[0], theme, scheme, mode: mode[0] });
      }, [meta.html, images[0], expanded[0], theme, scheme, mode[0]]);
      function toggleMode() {
        var next = mode[0] === "app" ? "original" : "app";
        modeByMail[String(props.mailId || "")] = next;
        mode[1](next);
      }
      function measure() {
        var f = frame.current;
        if (!f) return;
        try {
          var d = f.contentDocument;
          if (!d) return;
          var height = Math.max(d.documentElement ? d.documentElement.scrollHeight : 0, d.body ? d.body.scrollHeight : 0);
          f.style.height = Math.max(height + 2, 72) + "px";
        } catch (e) {
        }
      }
      React.useEffect(measure, [doc]);
      return h(
        "div",
        { className: "wbml-htmwrap" },
        h(
          "div",
          { className: "wbml-htmlbar" },
          h("span", { className: "wbml-muted" }, expanded[0] ? hasRemote ? "\u5DF2\u52A0\u8F7D\u8FDC\u7A0B\u56FE\u7247\uFF0C\u5185\u5BB9\u7531\u53D1\u4EF6\u65B9\u670D\u52A1\u5668\u63D0\u4F9B\u3002" : "\u5DF2\u6309\u539F\u4FE1\u6392\u7248\u663E\u793A\uFF0C\u56FE\u7247\u6765\u81EA\u672C\u5730\u9644\u4EF6\u3002" : "\u6B64\u90AE\u4EF6\u542B " + hasRemote + " \u4E2A\u8FDC\u7A0B\u56FE\u7247\uFF0C\u5DF2\u6309\u8BBE\u7F6E\u62E6\u622A\u3002"),
          h(C.Btn, { h, onClick: toggleMode }, mode[0] === "app" ? "\u6309\u539F\u4FE1\u914D\u8272" : "\u8DDF\u968F\u754C\u9762\u4E3B\u9898"),
          hasRemote ? h(C.Btn, { h, onClick: function() {
            expanded[1](!expanded[0]);
          } }, expanded[0] ? "\u672C\u6B21\u4E0D\u52A0\u8F7D" : "\u663E\u793A\u56FE\u7247") : null
        ),
        // 纸面与界面主题不同色时，外面这层 --wb-card 内边距把白块/暗块与边框隔开，避免贴边。
        h(
          "div",
          { className: "wbml-htmlpad" },
          h("iframe", {
            ref: frame,
            className: "wbml-htmlframe",
            title: props.title || "\u90AE\u4EF6\u6B63\u6587",
            sandbox: "allow-same-origin allow-popups allow-popups-to-escape-sandbox",
            referrerPolicy: "no-referrer",
            srcDoc: doc,
            onLoad: measure
          })
        )
      );
    };
    module2.exports.sanitize = sanitize;
    module2.exports.detectPaper = detectPaper;
    module2.exports.rewriteScheme = rewriteScheme;
    module2.exports.buildDoc = buildDoc;
    module2.exports.replaceCid = replaceCid;
    module2.exports.PLACEHOLDER = PLACEHOLDER;
  }
});

// packages/addons/mail/client/views/config.cjs
var require_config = __commonJS({
  "packages/addons/mail/client/views/config.cjs"(exports2, module2) {
    "use strict";
    module2.exports = function Config(props) {
      var h = props.h;
      var React = props.React;
      var api = props.api;
      var lang = props.lang === "en" ? "en" : "zh";
      var C = require_common();
      var icons = require_icons2();
      var SW = require_switch();
      var NF = require_number_field();
      var cfg = module2.exports.useConfig(React, api);
      var toastS = React.useState("");
      var toast = toastS[0];
      var setToast = toastS[1];
      var localS = React.useState({});
      var local = localS[0];
      var setLocal = localS[1];
      var seqRef = React.useRef(0);
      var syncS = React.useState(null);
      var sync = syncS[0];
      var setSync = syncS[1];
      function values() {
        return Object.assign({}, cfg.values, local);
      }
      React.useEffect(
        function() {
          if (!api) return void 0;
          var alive = true;
          C.call(api, "mail.autoSyncStatus", {}).then(function(r) {
            if (alive) setSync(r);
          }).catch(function() {
            if (alive) setSync(null);
          });
          return function() {
            alive = false;
          };
        },
        [api]
      );
      function syncSummary() {
        if (!sync) return "";
        var en = lang === "en";
        if (!sync.enabled) return en ? "Auto-sync is off; nothing is fetched in the background." : "\u81EA\u52A8\u540C\u6B65\u5DF2\u5173\u95ED\uFF0C\u540E\u53F0\u4E0D\u4F1A\u6536\u53D6\u65B0\u90AE\u4EF6\u3002";
        var mode = sync.mode === "idle" ? en ? "IMAP push" : "IMAP \u63A8\u9001" : en ? "Interval" : "\u5B9A\u65F6\u5FAA\u73AF";
        var head = (en ? "Running: " : "\u6B63\u5728\u8FD0\u884C\uFF1A") + mode;
        if (sync.mode !== "idle") head += "\uFF0C" + sync.intervalSec + "s";
        if (sync.lastAt) {
          var when = new Date(sync.lastAt);
          head += (en ? " \xB7 last " : " \xB7 \u4E0A\u6B21 ") + when.toLocaleTimeString(en ? "en-US" : "zh-CN");
        }
        if (sync.skippedLocked) {
          head += en ? " \xB7 skipped " + sync.skippedLocked + " time(s) because the vault is locked" : " \xB7 \u56E0\u4FDD\u9669\u7BB1\u9501\u5B9A\u8DF3\u8FC7 " + sync.skippedLocked + " \u6B21";
        }
        var failed = (sync.accounts || []).filter(function(a) {
          return a.lastError;
        });
        if (failed.length) head += (en ? " \xB7 " : " \xB7 ") + (en ? failed.length + " account(s) failing" : failed.length + " \u4E2A\u8D26\u6237\u540C\u6B65\u5931\u8D25");
        return head;
      }
      function toastOnce(text) {
        setToast(text);
        setTimeout(function() {
          setToast("");
        }, 2e3);
      }
      function labelOf(item) {
        return lang === "en" ? item.en || item.zh || item.id : item.zh || item.en || item.id;
      }
      function hintOf(item) {
        return lang === "en" ? item.hintEn || "" : item.hintZh || "";
      }
      function dropLocal(id, value) {
        setLocal(function(prev) {
          if (!(id in prev) || JSON.stringify(prev[id]) !== JSON.stringify(value)) return prev;
          var next = Object.assign({}, prev);
          delete next[id];
          return next;
        });
      }
      function save(id, value) {
        var seq = ++seqRef.current;
        var patch = {};
        patch[id] = value;
        setLocal(function(prev) {
          return Object.assign({}, prev, patch);
        });
        return C.call(api, "mail.configSet", { values: patch }).then(function(r) {
          if (seq !== seqRef.current) return r;
          if (r && r.values) cfg.setValues(r.values);
          setLocal({});
          toastOnce(lang === "en" ? "Saved" : "\u5DF2\u4FDD\u5B58");
        }).catch(function(e) {
          dropLocal(id, value);
          toastOnce(C.errText(e));
        });
      }
      function resetAll() {
        C.call(api, "mail.configReset", {}).then(function(r) {
          if (r && r.values) cfg.setValues(r.values);
          seqRef.current += 1;
          setLocal({});
          toastOnce(lang === "en" ? "Restored defaults" : "\u5DF2\u6062\u590D\u9ED8\u8BA4");
        }).catch(function(e) {
          toastOnce(C.errText(e));
        });
      }
      function multiLabel(item, v) {
        var table = item.valueLabels || {};
        var hit = table[v];
        if (hit) return lang === "en" ? hit.en || hit.zh : hit.zh;
        if (v === "original") return lang === "en" ? "Original design" : "\u6309\u539F\u4FE1\u914D\u8272";
        if (v === "app") return lang === "en" ? "Follow app theme" : "\u8DDF\u968F\u754C\u9762\u4E3B\u9898";
        return v;
      }
      function control(item) {
        var value = values()[item.id];
        if (item.type === "bool") {
          return h(SW.Switch, {
            h,
            checked: value === true,
            showState: true,
            onText: lang === "en" ? "On" : "\u5F00\u542F",
            offText: lang === "en" ? "Off" : "\u5173\u95ED",
            onChange: function(next) {
              save(item.id, next);
            }
          });
        }
        if (item.type === "int" || item.type === "number") {
          return h(NF.NumberField, {
            h,
            lang,
            value: value === void 0 ? "" : value,
            min: item.min,
            max: item.max,
            integer: item.type === "int",
            ariaLabel: labelOf(item),
            onCommit: function(next) {
              save(item.id, next);
            }
          });
        }
        if (item.type === "multi" && Array.isArray(item.values)) {
          return h(
            "select",
            {
              className: "wbml-input wbml-select",
              value: value === void 0 ? item.default : value,
              "aria-label": labelOf(item),
              onChange: function(e) {
                save(item.id, e.target.value);
              }
            },
            item.values.map(function(v) {
              return h("option", { key: v, value: v }, multiLabel(item, v));
            })
          );
        }
        return h("span", { className: "wbml-muted" }, String(value === void 0 ? "" : value));
      }
      if (cfg.error) return h("div", { className: "wbml-page" }, h(C.Notice, { h, kind: "warn", text: cfg.error }));
      if (!cfg.ready) return h("div", { className: "wbml-page" }, h(C.Empty, { h, text: lang === "en" ? "Loading settings\u2026" : "\u6B63\u5728\u8BFB\u53D6\u914D\u7F6E\u2026" }));
      if (!cfg.items.length) return h("div", { className: "wbml-page" }, h(C.Empty, { h, text: lang === "en" ? "No settings available." : "\u6682\u65E0\u53EF\u914D\u7F6E\u9879\u3002" }));
      var groups = cfg.groups.length ? cfg.groups : [{ id: "", zh: "", en: "" }];
      var overrides = cfg.overrides || {};
      return h(
        "div",
        { className: "wbml-page wbml-config" },
        h(
          "div",
          { className: "wbml-head" },
          h(
            "div",
            null,
            h("h2", null, lang === "en" ? "Mail settings" : "\u90AE\u4EF6\u8BBE\u7F6E"),
            h("p", { className: "wbml-sub" }, lang === "en" ? "Changes apply immediately and are stored on this machine only (not synced, not backed up)." : "\u6539\u52A8\u5373\u65F6\u751F\u6548\uFF0C\u53EA\u5B58\u5728\u672C\u673A meta \u8868\uFF08\u4E0D\u8FDB\u540C\u6B65\u3001\u4E0D\u8FDB\u5907\u4EFD\uFF09\u3002")
          ),
          h(C.Btn, { h, onClick: resetAll }, h(icons.Icon, { name: "refresh-cw", size: 13 }), h("span", null, lang === "en" ? "Restore defaults" : "\u5168\u90E8\u6062\u590D\u9ED8\u8BA4"))
        ),
        syncSummary() ? h("p", { className: "wbml-sync-status", role: "status" }, syncSummary()) : null,
        groups.map(function(group) {
          var items = cfg.items.filter(function(item) {
            return item.group === group.id;
          });
          if (!items.length) return null;
          return h(
            "section",
            { className: "wbml-cfg-group", key: group.id || "all" },
            group.zh || group.en ? h("h3", null, lang === "en" ? group.en || group.zh : group.zh || group.en) : null,
            items.map(function(item) {
              var overridden = Object.prototype.hasOwnProperty.call(overrides, item.id);
              return h(
                "div",
                { className: "wbml-cfg-row", key: item.id, "data-config": item.id },
                h(
                  "div",
                  { className: "wbml-cfg-main" },
                  h(
                    "span",
                    { className: "wbml-cfg-label" },
                    labelOf(item),
                    overridden ? h("span", { className: "wbml-cfg-badge", title: lang === "en" ? "Changed from default" : "\u5DF2\u6539\u52A8" }, lang === "en" ? "changed" : "\u5DF2\u6539") : null
                  ),
                  hintOf(item) ? h("span", { className: "wbml-cfg-hint" }, hintOf(item)) : null
                ),
                h("div", { className: "wbml-cfg-ctl" }, control(item))
              );
            })
          );
        }),
        toast ? h("div", { className: "wbml-toast", role: "status" }, toast) : null
      );
    };
    module2.exports.useConfig = function useConfig(React, api, fallback) {
      var fb = fallback || {};
      var s = React.useState({ ready: false, values: Object.assign({}, fb), items: [], groups: [], overrides: {}, error: "", seq: 0 });
      var state = s[0];
      React.useEffect(function() {
        var alive = true;
        require_common().call(api, "mail.configGet").then(function(body) {
          if (!alive) return;
          var values = Object.assign({}, fb, body && body.values || {});
          s[1]({
            ready: true,
            values,
            items: body && body.items || [],
            groups: body && body.groups || [],
            overrides: body && body.overrides || {},
            error: "",
            seq: 0
          });
        }).catch(function(e) {
          if (!alive) return;
          s[1]({ ready: true, values: Object.assign({}, fb), items: [], groups: [], overrides: {}, error: require_common().errText(e), seq: 0 });
        });
        return function() {
          alive = false;
        };
      }, []);
      function setValues(next) {
        if (!next || typeof next !== "object") return;
        s[1](function(prev) {
          return Object.assign({}, prev, { values: Object.assign({}, prev.values, next) });
        });
      }
      return Object.assign({}, state, { setValues });
    };
  }
});

// packages/addons/mail/client/views/prefs.cjs
var require_prefs = __commonJS({
  "packages/addons/mail/client/views/prefs.cjs"(exports2, module2) {
    "use strict";
    var useConfig = require_config().useConfig;
    var PREFS = { "images.remote": true, "display.html": true, "read.autoSeen": true, "list.pageSize": 20, "display.mailTheme": "original" };
    function clampPageSize(value) {
      var n = Math.round(Number(value));
      if (!Number.isFinite(n)) n = PREFS["list.pageSize"];
      return Math.min(Math.max(n, 10), 50);
    }
    function usePrefs(React, api) {
      var cfg = useConfig(React, api, PREFS);
      var prefs = Object.assign({}, PREFS, cfg.values || {});
      prefs.pageSize = clampPageSize(prefs["list.pageSize"]);
      return prefs;
    }
    function readBody(prefs, data, current) {
      var html = prefs["display.html"] === false ? "" : data.html || current.html || "";
      var all = data.attachments || current.attachments || [];
      return { html, files: all.filter(function(a) {
        return !a.inline;
      }), hasText: !!(data.body || current.body) };
    }
    module2.exports = { PREFS, clampPageSize, usePrefs, readBody };
  }
});

// packages/addons/mail/client/views/message-rows.cjs
var require_message_rows = __commonJS({
  "packages/addons/mail/client/views/message-rows.cjs"(exports2, module2) {
    "use strict";
    var GLYPHS2 = require_icons2().ICONS;
    var Paperclip2 = GLYPHS2["paperclip"];
    var MailNew = GLYPHS2["mail"];
    var MailSeen = GLYPHS2["mail-open"];
    module2.exports = function messageRows(h, items, options) {
      const { current, showSource, lang, attachmentUpdates, open, sender, senderDetail, isUnread } = options;
      const locale = lang === "en" ? "en-GB" : "zh-CN";
      const dayFormat = new Intl.DateTimeFormat(locale, { year: "numeric", month: "short", day: "numeric" });
      const timeFormat = new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
      const today = options.now ?? /* @__PURE__ */ new Date(), yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      const todayKey = dayFormat.format(today), yesterdayKey = dayFormat.format(yesterday);
      const rows = [];
      let lastDay;
      for (const m of items) {
        const date = new Date(m.dateAt);
        const valid = !!m.dateAt && Number.isFinite(date.getTime());
        const day = valid ? dayFormat.format(date) : "\u672A\u77E5\u65E5\u671F";
        const isToday = day === todayKey, isYesterday = day === yesterdayKey;
        const yesterdayLabel = lang === "en" ? "Yesterday" : "\u6628\u5929";
        if (day !== lastDay) {
          const label = isToday ? lang === "en" ? "Today" : "\u4ECA\u5929" : isYesterday ? yesterdayLabel : day;
          rows.push(h("h3", { key: "day:" + m.id, className: "wbml-date-group", title: day }, label));
          lastDay = day;
        }
        let shortDate = "\u2014";
        if (isToday || isYesterday) shortDate = (isYesterday ? yesterdayLabel + " " : "") + timeFormat.format(date);
        else if (valid) {
          const prefix = date.getFullYear() === today.getFullYear() ? "" : date.getFullYear() + "/";
          shortDate = prefix + (date.getMonth() + 1) + "/" + date.getDate();
        }
        const active = current?.id === m.id;
        const unread = isUnread(m);
        const statusText = unread ? lang === "en" ? "Unread" : "\u672A\u8BFB" : lang === "en" ? "Read" : "\u5DF2\u8BFB";
        const { hasAttachment, attachmentName } = attachmentUpdates.get(m.id) ?? m;
        const row = h(
          "button",
          {
            type: "button",
            key: m.id,
            "data-mail-id": m.id,
            "aria-current": active || void 0,
            title: senderDetail(m) + " \xB7 " + (m.subject || "(\u65E0\u4E3B\u9898)"),
            className: "wbml-list-row" + (active ? " on" : "") + (unread ? " unread" : " read"),
            onClick: () => open(m)
          },
          h(
            "span",
            { className: "wbml-st", role: "img", "aria-label": statusText, title: statusText },
            h(unread ? MailNew : MailSeen, { size: 14, "aria-hidden": true })
          ),
          h("span", { className: "wbml-who" }, h("span", { className: "wbml-sender", title: senderDetail(m) }, sender(m)), showSource && m.accountName ? h("span", { className: "wbml-source", title: m.accountName }, m.accountName) : null),
          h("span", { className: "wbml-line" }, h("span", { className: "wbml-subject" }, m.subject || "(\u65E0\u4E3B\u9898)"), h("span", { className: "wbml-snippet" }, m.preview)),
          hasAttachment === true ? h(
            "span",
            { className: "wbml-attachment", title: attachmentName || "\u6709\u9644\u4EF6", role: "img", "aria-label": attachmentName ? "\u9644\u4EF6\uFF1A" + attachmentName : "\u6709\u9644\u4EF6" },
            h(Paperclip2, { size: 14, "aria-hidden": true }),
            attachmentName ? h("span", { className: "wbml-attachment-name" }, attachmentName) : null
          ) : null,
          h("time", { className: "wbml-time", title: valid ? date.toLocaleString(locale) : day, dateTime: valid ? date.toISOString() : void 0 }, shortDate)
        );
        rows.push(options.wrapRow ? options.wrapRow(m, row) : row);
      }
      return rows;
    };
  }
});

// packages/addons/mail/client/views/reader-context.cjs
var require_reader_context = __commonJS({
  "packages/addons/mail/client/views/reader-context.cjs"(exports2, module2) {
    "use strict";
    function neighbor(order, live, id, step) {
      const start = order.indexOf(id);
      if (start < 0) return null;
      const byId = new Map(live.map((m) => [m.id, m]));
      for (let i = start + step; i >= 0 && i < order.length; i += step) {
        if (byId.has(order[i])) return byId.get(order[i]);
      }
      return null;
    }
    function capture(pane, items, id) {
      const box = pane?.querySelector(".wbml-state-box"), list = pane?.querySelector(".wbml-list");
      const host = pane?.closest(".wb-immersive-main");
      return { order: items.map((m) => m.id), id, box: box?.scrollTop || 0, list: list?.scrollTop || 0, host: host?.scrollTop || 0 };
    }
    function restore(pane, saved) {
      if (!pane) return;
      const row = Array.from(pane.querySelectorAll("[data-mail-id]")).find((el) => el.dataset.mailId === String(saved.id));
      (row || pane).focus({ preventScroll: true });
      for (const [node, top] of [[pane.querySelector(".wbml-state-box"), saved.box], [pane.querySelector(".wbml-list"), saved.list], [pane.closest(".wb-immersive-main"), saved.host]]) {
        if (node) node.scrollTop = top;
      }
    }
    function accountLabel(accounts, m) {
      const a = accounts.find((it) => it.id === m.accountId);
      if (!a) return m.accountName || "\u672A\u77E5\u8D26\u6237";
      return a.name && a.email && a.name !== a.email ? a.name + " <" + a.email + ">" : a.email || a.name || "\u672A\u77E5\u8D26\u6237";
    }
    module2.exports = { neighbor, capture, restore, accountLabel };
  }
});

// packages/addons/mail/client/views/detail-tools.cjs
var require_detail_tools = __commonJS({
  "packages/addons/mail/client/views/detail-tools.cjs"(exports2, module2) {
    "use strict";
    module2.exports = function detailTools(o) {
      var h = o.h;
      var button = o.button;
      var current = o.current;
      var unread = o.unread;
      return h(
        "div",
        { className: "wbml-tools" },
        button(
          unread ? "\u6807\u4E3A\u5DF2\u8BFB" : "\u6807\u4E3A\u672A\u8BFB",
          function() {
            o.mutate("mail.messageMarkRead", { id: current.id, read: unread }, false, o.selected);
          },
          o.busy,
          void 0,
          unread ? o.MailOpen : o.Mail
        ),
        h(
          "select",
          {
            "aria-label": "\u76EE\u6807\u6587\u4EF6\u5939",
            className: "wbml-input",
            value: o.target,
            onChange: function(e) {
              o.setTarget(e.target.value);
            }
          },
          h("option", { value: "" }, "\u9009\u62E9\u76EE\u6807\u6587\u4EF6\u5939"),
          o.folders.filter(function(f) {
            return !f.localOnly && f.account_id === current.accountId && f.name !== current.mailbox;
          }).map(function(f) {
            return h("option", { key: f.id, value: f.name }, f.name);
          })
        ),
        button(
          "\u79FB\u52A8",
          function() {
            o.mutate("mail.messageMove", { id: current.id, mailbox: o.target }, true, o.selected);
          },
          o.busy || !o.target,
          void 0,
          o.Move
        ),
        button(
          "\u79FB\u5165\u5E9F\u7EB8\u7BD3",
          function() {
            o.mutate("mail.messageDelete", { id: current.id }, true, o.selected);
          },
          o.busy,
          void 0,
          o.Trash
        ),
        // 跨插件插槽：别的插件（目前是任务）把按钮挂到邮件详情动作条上。
        // 没装贡献方时落点自己渲染 null，不占位。
        h(o.Slot, {
          slot: "item.actions",
          ownerId: "wb-addon-mail",
          lang: o.lang,
          item: {
            kind: "mail.message",
            id: String(current.id),
            title: String(current.subject || ""),
            subtitle: o.senderDetail(current)
          }
        })
      );
    };
  }
});

// packages/addons/mail/client/ui/reader-styles.cjs
var require_reader_styles = __commonJS({
  "packages/addons/mail/client/ui/reader-styles.cjs"(exports2, module2) {
    "use strict";
    module2.exports = `
.wbml-htmwrap{display:grid;gap:8px;margin:10px 0}
.wbml-htmlbar{display:flex;align-items:center;flex-wrap:wrap;gap:8px;font-size:12px}
.wbml-htmlbar .wbml-muted{flex:1 1 220px;min-width:0}
.wbml-htmlpad{padding:12px;border:1px solid var(--wb-line);border-radius:12px;background:var(--wb-card)}
.wbml-htmlframe{display:block;width:100%;min-height:120px;border:0;border-radius:8px;background:var(--wb-card)}
@media (max-width:760px){.wbml-htmlpad{padding:8px;border-radius:8px}.wbml-htmlframe{border-radius:6px}}
.wbml-read-bar{display:flex;flex:none;align-items:center;flex-wrap:wrap;gap:6px;padding:8px 12px;border-bottom:1px solid var(--wb-line)}
.wbml-read-bar .wbml-reader-nav{margin-inline-start:auto}
.wbml-read-scroll{min-height:0;overflow:auto;overscroll-behavior:contain}
.wbml-read-header{padding:14px;display:grid;gap:6px;overflow-wrap:anywhere;font-size:13px}
.wbml-read-header h3{font-size:1.2rem;line-height:1.45;margin:0 0 4px}
.wbml-read-sender{display:flex;align-items:baseline;flex-wrap:wrap;gap:6px}
.wbml-read-sender span,.wbml-read-stamp{color:var(--wb-muted)}
.wbml-read-header summary{cursor:pointer;color:var(--wb-accent);width:fit-content}
.wbml-read-header summary:focus-visible{outline:2px solid var(--wb-accent);outline-offset:2px}
.wbml-read-header details>div{padding-block:3px}
@media (min-width:901px){.wbml-layout.has-detail:has(>.wbml-detailpane.is-expanded){grid-template-columns:clamp(200px,21%,300px) minmax(0,1fr)}.wbml-layout:has(>.wbml-detailpane.is-expanded)>.wbml-listpane{display:none}}
@media (max-width:900px){.wbml-read-bar .wbml-expand{display:none}.wbml-layout.has-detail>.wbml-detailpane{max-height:none}.wbml-read-scroll{overflow:visible}.wbml-read-bar{position:sticky;top:0;z-index:1;background:var(--wb-surface)}}
`;
  }
});

// packages/addons/mail/client/views/detail-pane.cjs
var require_detail_pane = __commonJS({
  "packages/addons/mail/client/views/detail-pane.cjs"(exports2, module2) {
    "use strict";
    var C = require_common();
    var styles = require_reader_styles();
    module2.exports = function detailPane(h, options, tools, content) {
      const { current, back, toggle, previous, next, expanded, accountLabel, time } = options;
      const subject = current.subject || "(\u65E0\u4E3B\u9898)";
      const sender = current.fromName || current.from || "\u672A\u77E5\u53D1\u4EF6\u4EBA";
      const action = (label, onClick) => h(C.Btn, { h, onClick, disabled: !onClick }, label);
      return h(
        "section",
        { className: "wbml-pane wbml-detailpane" + (expanded ? " is-expanded" : ""), "aria-label": "\u90AE\u4EF6\u8BE6\u60C5" },
        h("style", null, styles),
        h(
          "nav",
          { className: "wbml-read-bar", "aria-label": "\u9605\u8BFB\u5BFC\u822A" },
          action("\u8FD4\u56DE\u5217\u8868", back),
          h("button", { className: "wbml-btn wbml-expand", type: "button", onClick: toggle, "aria-pressed": expanded }, expanded ? "\u6536\u8D77\u9605\u8BFB" : "\u5C55\u5F00\u9605\u8BFB"),
          h("div", { className: "wbml-reader-nav" }, action("\u4E0A\u4E00\u5C01", previous), action("\u4E0B\u4E00\u5C01", next))
        ),
        h(
          "div",
          { className: "wbml-read-scroll", key: current.id },
          h(
            "header",
            { className: "wbml-read-header" },
            h("h3", null, subject),
            h(
              "div",
              { className: "wbml-read-sender" },
              h("strong", null, sender),
              current.from && current.from !== sender ? h("span", null, "<" + current.from + ">") : null
            ),
            h("div", null, "\u6536\u4EF6\u8D26\u6237\uFF1A" + accountLabel),
            h("div", { className: "wbml-read-stamp" }, time, current.mailbox ? " \xB7 " + current.mailbox : ""),
            current.to && !current.cc && current.to.length <= 64 && !/[,;\n]/.test(current.to.replace(/"(?:\\.|[^"\\])*"/g, "")) ? h("div", null, "\u6536\u4EF6\u4EBA\uFF1A" + current.to) : current.to || current.cc ? h(
              "details",
              null,
              h("summary", null, current.cc ? "\u6536\u4EF6\u4EBA\u548C\u6284\u9001" : "\u6536\u4EF6\u4EBA"),
              current.to ? h("div", null, "\u6536\u4EF6\u4EBA\uFF1A" + current.to) : null,
              current.cc ? h("div", null, "\u6284\u9001\uFF1A" + current.cc) : null
            ) : null
          ),
          tools,
          content
        )
      );
    };
  }
});

// packages/addons/mail/client/views/bulk.cjs
var require_bulk = __commonJS({
  "packages/addons/mail/client/views/bulk.cjs"(exports2, module2) {
    "use strict";
    var C = require_common();
    var labels = { trash: "\u79FB\u5165\u5E9F\u7EB8\u7BD3", read: "\u6807\u4E3A\u5DF2\u8BFB" };
    var remote = (m) => Boolean(m?.id && m.accountId && m.mailbox && m.uid > 0 && m.uidValidity > 0);
    var unread = (m) => !/\\Seen\b/i.test(String(m.flags || ""));
    function snapshot(items, kind, checked) {
      const result = /* @__PURE__ */ new Map();
      for (const m of items) {
        if (!remote(m) || (kind === "trash" ? !checked.has(m.id) : !unread(m))) continue;
        result.set(m.id, Object.freeze({
          id: m.id,
          accountId: m.accountId,
          accountName: m.accountName || m.accountId,
          subject: m.subject || "(\u65E0\u4E3B\u9898)",
          mailbox: m.mailbox,
          uid: m.uid,
          uidValidity: m.uidValidity
        }));
      }
      return [...result.values()];
    }
    async function executeBatch(api, kind, targets, active) {
      const done = [], failed = [];
      for (const item of targets) {
        if (!active()) break;
        try {
          const m = await C.call(api, "mail.messageGet", { id: item.id });
          if (!active()) break;
          if (!remote(m) || ["id", "accountId", "mailbox", "uid", "uidValidity"].some((k) => m[k] !== item[k])) {
            throw new Error("\u90AE\u4EF6\u4F4D\u7F6E\u6216\u8FDC\u7AEF\u8EAB\u4EFD\u5DF2\u53D8\u5316\uFF0C\u8BF7\u5237\u65B0\u5217\u8868");
          }
          if (kind === "read" && unread(m)) {
            const ack = await C.call(api, "mail.messageMarkRead", { id: item.id, read: true });
            if (ack?.updated !== 1) throw new Error("\u672A\u6536\u5230\u5DF2\u8BFB\u56DE\u6267");
          } else if (kind === "trash") {
            const ack = await C.call(api, "mail.messageDelete", { id: item.id });
            if (ack?.trashed !== true) throw new Error("\u672A\u6536\u5230\u79FB\u5165\u5E9F\u7EB8\u7BD3\u56DE\u6267");
          }
          done.push(item.id);
        } catch (error) {
          failed.push({ item, error: C.errText(error) });
        }
      }
      return { done, failed };
    }
    function accountCounts(targets, accounts) {
      const counts = /* @__PURE__ */ new Map();
      for (const m of targets) {
        const name = accounts.find((a) => a.id === m.accountId)?.email || m.accountName;
        const entry = counts.get(m.accountId) || { name, count: 0 };
        counts.set(m.accountId, { name, count: entry.count + 1 });
      }
      return [...counts.values()].map(({ name, count }) => `${name} ${count} \u5C01`).join("\u3001");
    }
    function useBulk({ React, h, api, items, scope, accounts, blocked, refresh }) {
      const [, setRev] = React.useState(0);
      const ref = React.useRef(null), mounted = React.useRef(true);
      React.useEffect(() => {
        mounted.current = true;
        return () => {
          mounted.current = false;
        };
      }, []);
      if (!ref.current || ref.current.scope !== scope) ref.current = { scope, checked: /* @__PURE__ */ new Set(), selecting: false };
      const state = ref.current;
      const active = () => mounted.current && ref.current === state;
      const redraw = () => setRev((v) => v + 1);
      const available = items.filter(remote);
      const selected = available.filter((m) => state.checked.has(m.id));
      const button = (text, onClick, disabled) => h(C.Btn, { h, onClick, disabled }, text);
      function prepare(kind) {
        if (blocked || state.running || ref.current !== state) return;
        const targets = snapshot(items, kind, state.checked);
        if (!targets.length) return;
        state.plan = { kind, targets, done: 0 };
        redraw();
      }
      async function run() {
        const plan2 = state.plan;
        if (!plan2 || blocked || state.running || ref.current !== state) return;
        state.running = true;
        redraw();
        const result = await executeBatch(api, plan2.kind, plan2.targets, active);
        if (!active()) return;
        state.running = false;
        state.checked.clear();
        state.selecting = false;
        state.plan = null;
        state.report = { kind: plan2.kind, done: plan2.done + result.done.length, failed: result.failed };
        if (result.done.length) refresh(plan2.kind, result.done);
        redraw();
      }
      const plan = state.plan, report = state.report;
      const controls = plan ? [
        h("strong", null, `\u786E\u8BA4\u5C06 ${plan.targets.length} \u5C01\u90AE\u4EF6${labels[plan.kind]}\uFF1F`),
        h("span", null, accountCounts(plan.targets, accounts)),
        button(state.running ? "\u6B63\u5728\u5904\u7406\u2026" : "\u786E\u8BA4" + labels[plan.kind], run, blocked || state.running),
        button("\u53D6\u6D88", () => {
          state.plan = null;
          redraw();
        }, state.running)
      ] : [
        button(state.selecting ? "\u9000\u51FA\u9009\u62E9" : "\u9009\u62E9\u90AE\u4EF6", () => {
          state.selecting = !state.selecting;
          state.checked.clear();
          redraw();
        }, blocked || !available.length),
        state.selecting && button(selected.length && selected.length === available.length ? "\u6E05\u9664\u9009\u62E9" : "\u672C\u9875\u5168\u9009", () => {
          state.checked = selected.length === available.length ? /* @__PURE__ */ new Set() : new Set(available.map((m) => m.id));
          redraw();
        }, blocked || !available.length),
        state.selecting && button(`\u9009\u4E2D\u90AE\u4EF6\u79FB\u5165\u5E9F\u7EB8\u7BD3\uFF08${selected.length}\uFF09`, () => prepare("trash"), blocked || !selected.length),
        button("\u672C\u9875\u5168\u90E8\u6807\u4E3A\u5DF2\u8BFB", () => prepare("read"), blocked || !available.some(unread)),
        state.selecting && items.length > available.length && h("span", null, "\u672C\u5730\u526F\u672C\u6216\u8FDC\u7AEF\u8EAB\u4EFD\u672A\u786E\u8BA4\u7684\u90AE\u4EF6\u4E0D\u53EF\u9009\u62E9")
      ];
      function wrapRow(m, row) {
        if (!state.selecting) return row;
        return h(
          "div",
          { className: "wbml-bulk-row", key: m.id },
          h("input", {
            type: "checkbox",
            "aria-label": "\u9009\u62E9\u90AE\u4EF6\uFF1A" + (m.subject || "(\u65E0\u4E3B\u9898)"),
            checked: state.checked.has(m.id),
            disabled: blocked || !remote(m) || !!plan,
            onChange: (e) => {
              if (e.target.checked) state.checked.add(m.id);
              else state.checked.delete(m.id);
              redraw();
            }
          }),
          row
        );
      }
      return {
        wrapRow,
        locked: () => !!state.plan,
        toolbar: h(
          "div",
          { className: "wbml-bulk" },
          ...controls,
          !plan && report && h(
            "div",
            { className: "wbml-bulk-report", role: "status" },
            `${labels[report.kind]}\uFF1A\u6210\u529F ${report.done} \u5C01\uFF0C\u5931\u8D25 ${report.failed.length} \u5C01`,
            report.failed.length > 0 && h(
              "details",
              null,
              h("summary", null, "\u67E5\u770B\u5931\u8D25\u539F\u56E0"),
              ...report.failed.map(({ item, error }) => h("div", { key: item.id }, `${item.accountName} \xB7 ${item.subject}\uFF1A${error}`))
            ),
            report.failed.length > 0 && button("\u4EC5\u91CD\u8BD5\u5931\u8D25\u9879", () => {
              state.plan = { kind: report.kind, targets: report.failed.map((f) => f.item), done: report.done };
              redraw();
            }, blocked),
            button("\u6536\u8D77\u7ED3\u679C", () => {
              state.report = null;
              redraw();
            })
          )
        )
      };
    }
    function updateSearch(server, kind, ids, unreadOnly) {
      const done = new Set(ids);
      const items = server.data.items.flatMap((m) => {
        if (!done.has(m.id)) return [m];
        if (kind === "trash" || unreadOnly) return [];
        return [{ ...m, flags: unread(m) ? `${m.flags || ""} \\Seen`.trim() : m.flags }];
      });
      return { ...server, data: { ...server.data, items } };
    }
    module2.exports = { snapshot, executeBatch, useBulk, updateSearch };
  }
});

// packages/addons/mail/client/views/folder-shortcuts.cjs
var require_folder_shortcuts = __commonJS({
  "packages/addons/mail/client/views/folder-shortcuts.cjs"(exports2, module2) {
    "use strict";
    var roleLabels = { inbox: "\u6536\u4EF6\u7BB1", drafts: "\u8349\u7A3F\u7BB1", sent: "\u5DF2\u53D1\u9001", trash: "\u5E9F\u7EB8\u7BD3" };
    module2.exports = function FolderShortcuts({ h, folders, accountId, selected, onChange }) {
      const entries = [];
      for (const role of Object.keys(roleLabels)) {
        const boxes = folders.filter((box) => box.account_id === accountId && box.name && (box.role === role || role === "sent" && box.localOnly && box.name === "Sent"));
        for (const box of boxes) {
          let label = roleLabels[role];
          if (boxes.length > 1) label += " \xB7 " + box.name;
          if (box.localOnly) label += "\uFF08\u4EC5\u672C\u5730\uFF09";
          const active = box.name === selected;
          entries.push(h("button", {
            type: "button",
            key: box.name,
            title: box.name,
            className: "wbml-btn" + (active ? " primary" : ""),
            "aria-current": active ? "page" : void 0,
            onClick: () => {
              if (!active) onChange(box.name);
            }
          }, label));
        }
      }
      return entries.length ? h("nav", { className: "wbml-body-tools", "aria-label": "\u5E38\u7528\u6587\u4EF6\u5939" }, entries) : null;
    };
  }
});

// packages/addons/mail/client/views/messages.cjs
var require_messages = __commonJS({
  "packages/addons/mail/client/views/messages.cjs"(exports2, module2) {
    "use strict";
    var GLYPHS2 = require_icons2().ICONS;
    var C = require_common();
    var Attachments = require_attachments();
    var ReplyTools = require_reply_tools();
    var MailHtml = require_mail_html();
    var prefsApi = require_prefs();
    var iconLabel = require_icon_label();
    var SW = require_switch();
    var Folder2 = GLYPHS2["folder"];
    var InboxIcon = GLYPHS2["inbox"];
    var Refresh = GLYPHS2["refresh-cw"];
    var Download2 = GLYPHS2["download"];
    var Search2 = GLYPHS2["search"];
    var messageRows = require_message_rows();
    var Reader = require_reader_context();
    var detailTools = require_detail_tools();
    var detailPane = require_detail_pane();
    var Mail2 = GLYPHS2["mail"];
    var MailOpen2 = GLYPHS2["mail-open"];
    var Move = GLYPHS2["folder-input"];
    var Trash2 = GLYPHS2["trash-2"];
    module2.exports = function Messages(props) {
      var h = props.h, React = props.React;
      var accounts = C.useLoad(React, props.api, "mail.accountList", {}, []);
      var account = React.useState("");
      return h(Inbox2, Object.assign({}, props, { key: account[0], accountId: account, accounts }));
    };
    function Inbox2(props) {
      var h = props.h, React = props.React, api = props.api, accountId = props.accountId;
      var accs = props.accounts.data && props.accounts.data.items || [];
      var prefs = prefsApi.usePrefs(React, api), pageSize = prefs.pageSize;
      var boxes = C.useLoad(React, api, "mail.mailboxList", { accountId: accountId[0] || void 0 }, [accountId[0]]);
      var folders = boxes.data && boxes.data.items || [];
      var unified = React.useState(true), server = React.useState(null), searchRev = React.useRef(0);
      var folder = React.useState(accountId[0] ? "INBOX" : "");
      var search = React.useState(""), q = React.useState(""), unseen = React.useState(false);
      var page = React.useState([]), tokens = page[0];
      var list = C.useLoad(
        React,
        api,
        "mail.messageList",
        {
          accountId: accountId[0] || void 0,
          mailbox: folder[0] || void 0,
          unifiedInbox: !accountId[0] && unified[0],
          q: q[0],
          unread: unseen[0],
          limit: pageSize,
          cursor: tokens.at(-1)
        },
        [folder[0], q[0], unseen[0], tokens, unified[0], pageSize]
      );
      var sel = React.useState(null), msg = React.useState(null), target = React.useState("");
      var bodyState = React.useState({}), busy = React.useState(false), remote = React.useState(null);
      var generation = React.useRef(0), selected = React.useRef(0), busyRef = React.useRef(false);
      React.useEffect(function() {
        return function() {
          generation.current++;
          selected.current++;
          searchRev.current++;
        };
      }, []);
      React.useEffect(
        function() {
          if (!api || typeof api.subscribe !== "function") return void 0;
          var off = api.subscribe(function(payload) {
            if (!payload || payload.event !== "mail.synced") return;
            var data2 = payload.data || {};
            if (data2.accountId && accountId[0] && data2.accountId !== accountId[0]) return;
            var box = String(folder[0] || "INBOX").toUpperCase();
            if (!unified[0] && data2.mailbox && String(data2.mailbox).toUpperCase() !== box) return;
            list.refresh();
          });
          return function() {
            if (typeof off === "function") off();
          };
        },
        [api, accountId[0], folder[0], unified[0]]
      );
      var pane = React.useRef(null), reading = React.useRef(null), returning = React.useRef(null);
      var attachmentUpdates = React.useRef(/* @__PURE__ */ new Map());
      function back() {
        var saved = reading.current;
        close();
        returning.current = saved;
      }
      var expanded = React.useState(false);
      function close() {
        expanded[1](false);
        reading.current = null;
        returning.current = null;
        selected.current++;
        sel[1](null);
        target[1]("");
        bodyState[1]({});
      }
      function clearServer() {
        searchRev.current++;
        server[1](null);
      }
      function searchServer() {
        close();
        var rev = ++searchRev.current;
        server[1]({ loading: true });
        C.call(api, "mail.serverSearch", { accountId: accountId[0], mailbox: folder[0], q: search[0].trim(), unread: unseen[0] }).then(function(r) {
          if (rev !== searchRev.current) return;
          server[1]({ data: r });
          list.refresh();
        }).catch(function(e) {
          if (rev === searchRev.current) server[1]({ error: "\u670D\u52A1\u5668\u641C\u7D22\u5931\u8D25\uFF1A" + C.errText(e) });
        });
      }
      function reset() {
        clearServer();
        close();
        page[1]([]);
        msg[1](null);
      }
      function changeFolder(v) {
        generation.current++;
        busyRef.current = false;
        busy[1](false);
        remote[1](null);
        folder[1](v);
        reset();
      }
      function report(e) {
        msg[1]({ kind: "error", text: C.errText(e) });
      }
      function button(text, click, disabled, kind, Icon2) {
        return h(C.Btn, { h, onClick: click, disabled, kind }, Icon2 ? iconLabel(h, Icon2, text) : text);
      }
      function isUnread(m) {
        return !/\\Seen/.test(String(m.flags || ""));
      }
      function sender(m) {
        return m.fromName || m.from || "\u672A\u77E5\u53D1\u4EF6\u4EBA";
      }
      function senderDetail(m) {
        return m.from && m.fromName && m.from !== m.fromName ? m.fromName + " <" + m.from + ">" : sender(m);
      }
      var upgraded = React.useRef(/* @__PURE__ */ new Set());
      function loadBody(m, force, rev) {
        bodyState[1]({ loading: true });
        C.call(api, "mail.messageBody", { id: m.id, force: !!force }).then(function(r) {
          if (rev !== selected.current) return;
          if (!r || r.ok === false) throw new Error(r && r.message || "\u6B63\u6587\u4E0B\u8F7D\u5931\u8D25");
          if (Array.isArray(r.attachments)) attachmentUpdates.current.set(m.id, {
            hasAttachment: r.attachments.length > 0,
            attachmentName: r.attachments[0]?.filename || ""
          });
          bodyState[1]({ data: r });
          if (!force && r && r.htmlStale && !upgraded.current.has(m.id)) {
            upgraded.current.add(m.id);
            loadBody(m, true, rev);
          }
        }).catch(function(e) {
          if (rev === selected.current) bodyState[1]({ error: C.errText(e) });
        });
      }
      function open(m, continuing) {
        if (bulk.locked()) return;
        if (!continuing || !reading.current) reading.current = Reader.capture(pane.current, items, m.id);
        returning.current = null;
        target[1]("");
        var rev = ++selected.current;
        sel[1](m);
        bodyState[1]({ loading: true });
        C.call(api, "mail.messageGet", { id: m.id }).then(function(d) {
          if (rev !== selected.current) return;
          sel[1](Object.assign({}, m, d));
          loadBody(d, false, rev);
          if (prefs["read.autoSeen"] !== false && isUnread(d) && d.uid > 0) mutate("mail.messageMarkRead", { id: d.id, read: true }, false, rev);
        }).catch(function(e) {
          if (rev === selected.current) bodyState[1]({ error: C.errText(e) });
        });
      }
      var deepId = props.viewParams && props.viewParams.messageId ? String(props.viewParams.messageId) : "";
      var deepDone = React.useRef("");
      React.useEffect(function() {
        if (!deepId || deepDone.current === deepId) return;
        deepDone.current = deepId;
        var rev = ++selected.current;
        bodyState[1]({ loading: true });
        C.call(api, "mail.messageGet", { id: deepId }).then(function(d) {
          if (rev !== selected.current) return;
          sel[1](d);
          loadBody(d, false, rev);
        }).catch(function(e) {
          if (rev !== selected.current) bodyState[1]({ error: "\u6253\u5F00\u6765\u6E90\u90AE\u4EF6\u5931\u8D25\uFF1A" + C.errText(e) });
        });
      }, [deepId]);
      function mutate(action, args, leave, rev) {
        if (busyRef.current) return;
        var epoch = generation.current;
        busyRef.current = true;
        busy[1](true);
        C.call(api, action, args).then(function() {
          if (epoch !== generation.current) return;
          list.refresh();
          if (rev !== selected.current) return;
          if (leave) back();
          else
            sel[1](function(m) {
              if (!m) return m;
              return Object.assign({}, m, {
                flags: (String(m.flags || "").replace(/\\Seen\b/gi, "") + (args.read ? " \\Seen" : "")).trim()
              });
            });
        }).catch(function(e) {
          if (epoch === generation.current) report(e);
        }).finally(function() {
          if (epoch === generation.current) {
            busyRef.current = false;
            busy[1](false);
          }
        });
      }
      function sync(older, onlyFolders) {
        if (!accountId[0] || busyRef.current || !onlyFolders && !canRemote) return;
        var epoch = generation.current, args = { id: accountId[0] };
        if (!onlyFolders) {
          args.mailbox = folder[0];
          args.limit = pageSize;
          if (older) {
            if (!remote[0] || !remote[0].nextBeforeUid) return;
            args.beforeUid = remote[0].nextBeforeUid;
            args.uidValidity = remote[0].uidValidity;
          }
        }
        busyRef.current = true;
        busy[1](true);
        msg[1](null);
        C.call(api, onlyFolders ? "mail.mailboxSync" : "mail.sync", args).then(function(r) {
          if (epoch !== generation.current) return;
          if (onlyFolders) {
            boxes.refresh();
            return;
          }
          remote[1](r);
          list.refresh();
          msg[1]({ kind: "ok", text: "\u6293\u53D6 " + r.fetched + " \u5C01\uFF0C\u65B0\u589E " + r.inserted + " \u5C01" });
        }).catch(function(e) {
          if (epoch === generation.current) report(e);
        }).finally(function() {
          if (epoch === generation.current) {
            busyRef.current = false;
            busy[1](false);
          }
        });
      }
      function changePage(stack) {
        close();
        page[1](stack);
      }
      var current = sel[0], state = bodyState[0], data = state.data || {};
      var result = server[0] || list;
      var items = result.data && result.data.items || [], canSync = !!accountId[0];
      var bulk = require_bulk().useBulk({
        React,
        h,
        api,
        accounts: accs,
        items,
        scope: JSON.stringify([accountId[0], folder[0], unified[0], q[0], unseen[0], tokens, searchRev.current]),
        blocked: !!(busy[0] || result.loading || result.error || current),
        refresh: (kind, ids) => {
          list.refresh();
          if (server[0]?.data) server[1](require_bulk().updateSearch(server[0], kind, ids, unseen[0]));
        }
      });
      var order = reading.current?.order || [];
      var previous = current && Reader.neighbor(order, items, current.id, -1);
      var next = current && Reader.neighbor(order, items, current.id, 1);
      (React.useLayoutEffect || React.useEffect)(function() {
        if (current || !returning.current || result.loading) return;
        Reader.restore(pane.current, returning.current);
        if (!busy[0]) returning.current = null;
      }, [current, result.data, result.loading, busy[0]]);
      var localOnly = folders.some(function(f) {
        return f.name === folder[0] && f.localOnly;
      });
      var canRemote = canSync && !localOnly;
      var names = Array.from(
        new Set(
          ["INBOX"].concat(
            folders.map(function(f) {
              return f.name;
            })
          )
        )
      );
      function bodyNode() {
        var picked = prefsApi.readBody(prefs, data, current), html = picked.html, files = picked.files, hasText = picked.hasText;
        if (state.loading && !html && !hasText) return h("div", { className: "wbml-state" }, "\u6B63\u6587\u4E0B\u8F7D\u4E2D\u2026");
        if (state.error && !html && !hasText)
          return h(
            "div",
            { className: "wbml-body-fail" },
            "\u6B63\u6587\u4E0B\u8F7D\u5931\u8D25\uFF1A" + state.error,
            // 失败多半是服务器声明的分段尺寸与真实字节不一致，重新同步会整段重抓并重新解析结构。
            button("\u91CD\u65B0\u540C\u6B65", function() {
              loadBody(current, true, selected.current);
            })
          );
        return h(
          "div",
          { className: "wbml-body-wrap" },
          html ? h(MailHtml, { h, React, api, html, attachments: data.attachments || current.attachments || [], title: current.subject, mailId: current.id, remoteDefault: prefs["images.remote"] !== false, mailTheme: prefs["display.mailTheme"] }) : h("pre", { className: "wbml-body" }, data.body || current.body || "\u6B64\u90AE\u4EF6\u65E0\u6587\u5B57\u6B63\u6587"),
          h(Attachments, { h, React, api, localOnly: current.uid <= 0 || !current.uidValidity, items: files }),
          data.truncated || current.bodyTruncated ? h("p", { className: "wbml-body-note" }, "\u6B63\u6587\u8F83\u957F\uFF0C\u5DF2\u622A\u65AD\u663E\u793A\u3002") : null,
          current.uid > 0 ? button("\u91CD\u65B0\u4E0B\u8F7D\u6B63\u6587", function() {
            loadBody(current, true, ++selected.current);
          }) : null
        );
      }
      var body = result.loading ? h("div", { className: "wbml-state" }, "\u52A0\u8F7D\u4E2D\u2026") : result.error ? h(C.Notice, { h, kind: "error", text: result.error }) : h(
        React.Fragment,
        null,
        !items.length ? h(C.Empty, {
          h,
          text: server[0] ? "\u670D\u52A1\u5668\u6CA1\u6709\u5339\u914D\u7684\u90AE\u4EF6" : !accs.length ? "\u8FD8\u6CA1\u6709\u8D26\u6237" : q[0] || unseen[0] ? "\u672A\u627E\u5230\u7B26\u5408\u6761\u4EF6\u7684\u672C\u5730\u90AE\u4EF6" : "\u6CA1\u6709\u672C\u5730\u90AE\u4EF6"
        }) : null,
        h(
          "div",
          { className: "wbml-list" },
          messageRows(h, items, {
            current,
            wrapRow: bulk.wrapRow,
            showSource: !accountId[0],
            lang: props.lang,
            attachmentUpdates: attachmentUpdates.current,
            open,
            sender,
            senderDetail,
            isUnread
          })
        ),
        !server[0] && h(
          "div",
          { className: "wbml-paging" },
          button(
            "\u4E0A\u4E00\u9875",
            function() {
              changePage(tokens.slice(0, -1));
            },
            !tokens.length
          ),
          h("span", null, "\u7B2C " + (tokens.length + 1) + " \u9875"),
          button(
            "\u4E0B\u4E00\u9875",
            function() {
              changePage(tokens.concat(list.data.nextCursor));
            },
            !list.data || !list.data.hasMore
          )
        )
      );
      return h(
        "div",
        { className: "wbml-page is-split wb-fill" },
        h(
          "div",
          { className: "wbml-head" },
          h("h2", null, "\u90AE\u4EF6"),
          button("\u5237\u65B0\u672C\u5730\u5217\u8868", function() {
            reset();
            list.refresh();
          }, void 0, void 0, Refresh)
        ),
        h(C.Notice, { h, kind: "error", text: props.accounts.error || boxes.error }),
        h(C.Notice, { h, kind: msg[0] && msg[0].kind, text: msg[0] && msg[0].text }),
        h(
          "div",
          { className: "wbml-layout" + (current ? " has-detail" : "") },
          h(
            "aside",
            { className: "wbml-rail" },
            h(
              "div",
              { className: "wbml-rail-card" },
              h(
                C.Field,
                { h, label: "\u6536\u4EF6\u8D26\u6237" },
                h(
                  "select",
                  {
                    className: "wbml-input",
                    value: accountId[0],
                    onChange: function(e) {
                      accountId[1](e.target.value);
                    }
                  },
                  h("option", { value: "" }, "\u5168\u90E8\u8D26\u6237"),
                  accs.map(function(a) {
                    return h("option", { key: a.id, value: a.id }, a.name);
                  })
                )
              ),
              !canSync && h(C.Field, { h, label: "\u90AE\u4EF6\u8303\u56F4" }, h("select", {
                className: "wbml-input",
                value: unified[0] ? "inbox" : "all",
                onChange: function(e) {
                  unified[1](e.target.value === "inbox");
                  reset();
                }
              }, h("option", { value: "inbox" }, "\u7EDF\u4E00\u6536\u4EF6\u7BB1"), h("option", { value: "all" }, "\u5168\u90E8\u90AE\u4EF6"))),
              canSync && h(require_folder_shortcuts(), {
                h,
                folders,
                accountId: accountId[0],
                selected: folder[0],
                onChange: changeFolder
              }),
              canSync && h(
                C.Field,
                { h, label: iconLabel(h, Folder2, "\u6587\u4EF6\u5939") },
                h(
                  "select",
                  {
                    className: "wbml-input",
                    value: folder[0],
                    disabled: !canSync,
                    onChange: function(e) {
                      changeFolder(e.target.value);
                    }
                  },
                  !canSync ? h("option", { value: "" }, "\u5168\u90E8\u6587\u4EF6\u5939") : null,
                  names.map(function(n) {
                    return h("option", { key: n, value: n }, n);
                  })
                )
              ),
              h(
                "div",
                { className: "wbml-body-tools" },
                button(
                  "\u66F4\u65B0\u6587\u4EF6\u5939",
                  function() {
                    sync(false, true);
                  },
                  !canSync || busy[0],
                  void 0,
                  Folder2
                ),
                button(
                  "\u540C\u6B65\u6700\u65B0\u90AE\u4EF6",
                  function() {
                    sync(false, false);
                  },
                  !canRemote || busy[0],
                  "primary",
                  Download2
                )
              ),
              canRemote && remote[0] ? button(
                remote[0].nextBeforeUid ? "\u4ECE\u670D\u52A1\u5668\u52A0\u8F7D\u66F4\u65E9\u90AE\u4EF6" : "\u5DF2\u5230\u670D\u52A1\u5668\u6700\u65E9\u90AE\u4EF6",
                function() {
                  sync(true, false);
                },
                !remote[0].nextBeforeUid || busy[0]
              ) : null,
              localOnly ? h("small", { className: "wbml-muted" }, "\u6B64\u6587\u4EF6\u5939\u4EC5\u4FDD\u7559\u672C\u5730\u526F\u672C") : !canSync ? h("small", { className: "wbml-muted" }, "\u9009\u62E9\u5177\u4F53\u8D26\u6237\u540E\u53EF\u540C\u6B65") : null,
              h(
                "form",
                {
                  className: "wbml-search",
                  onSubmit: function(e) {
                    e.preventDefault();
                    q[1](search[0].trim());
                    reset();
                  }
                },
                h(
                  C.Field,
                  { h, label: "\u641C\u7D22\u672C\u5730\u526F\u672C", hint: "\u4EC5\u5339\u914D\u5DF2\u4E0B\u8F7D\u4FE1\u5934\u7684\u4E3B\u9898\u548C\u53D1\u4EF6\u5730\u5740" },
                  h("input", {
                    className: "wbml-input",
                    type: "search",
                    value: search[0],
                    onChange: function(e) {
                      clearServer();
                      close();
                      search[1](e.target.value);
                    }
                  })
                ),
                h(C.Btn, { h, type: "submit" }, iconLabel(h, Search2, "\u641C\u7D22")),
                button("\u5728\u670D\u52A1\u5668\u641C\u7D22", searchServer, !canRemote || !folder[0] || !search[0].trim() || !!server[0]?.loading, void 0, Search2),
                server[0] && button("\u8FD4\u56DE\u672C\u5730\u5217\u8868", function() {
                  clearServer();
                  close();
                })
              ),
              h(SW.Switch, {
                h,
                checked: unseen[0],
                label: "\u53EA\u770B\u672A\u8BFB",
                onChange: function(next2) {
                  unseen[1](next2);
                  reset();
                }
              })
            )
          ),
          h(
            "section",
            { className: "wbml-pane wbml-listpane", ref: pane, tabIndex: -1 },
            h(
              "div",
              { className: "wbml-pane-head" },
              h("strong", null, iconLabel(
                h,
                server[0] ? Search2 : folder[0] && folder[0] !== "INBOX" ? Folder2 : folder[0] || unified[0] ? InboxIcon : Mail2,
                server[0] ? "\u670D\u52A1\u5668\u641C\u7D22 \xB7 " + folder[0] : folder[0] || (unified[0] ? "\u7EDF\u4E00\u6536\u4EF6\u7BB1" : "\u5168\u90E8\u90AE\u4EF6")
              )),
              h(
                "span",
                { className: "wbml-muted" },
                result.error || result.loading ? null : (server[0] ? "\u663E\u793A " : "\u672C\u9875 ") + items.length + " \u5C01 \xB7 " + items.filter(isUnread).length + " \u672A\u8BFB" + (server[0]?.data?.truncated ? " \xB7 \u4EC5\u663E\u793A\u6700\u8FD1 50 \u5C01" : "")
              )
            ),
            !current && bulk.toolbar,
            h("div", { className: "wbml-state-box" }, body)
          ),
          current ? detailPane(
            h,
            {
              current,
              accountLabel: Reader.accountLabel(accs, current),
              time: C.fmtTime(current.dateAt, props.lang),
              back,
              expanded: expanded[0],
              toggle: () => expanded[1](!expanded[0]),
              previous: previous && !busy[0] ? () => open(previous, true) : null,
              next: next && !busy[0] ? () => open(next, true) : null
            },
            current.uid > 0 ? detailTools({
              h,
              button,
              current,
              unread: isUnread(current),
              busy: busy[0],
              target: target[0],
              setTarget: function(v) {
                target[1](v);
              },
              folders,
              mutate,
              selected: selected.current,
              lang: props.lang,
              senderDetail,
              Slot: props.Slot,
              Mail: Mail2,
              MailOpen: MailOpen2,
              Move,
              Trash: Trash2
            }) : null,
            h(
              "div",
              { className: "wbml-detail-content", key: current.id },
              bodyNode(),
              h(
                ReplyTools,
                Object.assign({}, props, {
                  key: current.id,
                  message: current,
                  body: data.body || current.body || "",
                  bodyReady: !!state.data,
                  originalAttachments: data.attachments || current.attachments || []
                })
              )
            )
          ) : null
        )
      );
    }
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

// packages/addons/mail/client/ui/set-picker.cjs
var require_set_picker = __commonJS({
  "packages/addons/mail/client/ui/set-picker.cjs"(exports2, module2) {
    "use strict";
    var FilterChecklist = require_filter_checklist();
    function t(lang, zh, en) {
      return lang === "en" ? en : zh;
    }
    module2.exports = function SetPicker(props) {
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
      var loadS = S(false);
      var errS = S("");
      var knownS = S({});
      var boxRef = React.useRef ? React.useRef(null) : { current: null };
      var open = openS[0];
      var rows = rowsS[0];
      var value = String(props.value || "");
      function call(query) {
        return C.call(api, "vault.setList", { type: "account", q: query || "" }).then(function(r) {
          var items = (r && Array.isArray(r.items) ? r.items : []).map(function(x) {
            return { id: x.id, name: x.name, account: x.account || "", type: x.type || "account" };
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
      var canRead = vault !== "loading" && vault !== "missing";
      React.useEffect(function() {
        if (!canRead) return;
        var alive = true;
        loadS[1](true);
        call("").then(function(items) {
          if (!alive) return;
          rowsS[1](items);
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
      }, [vault, canRead]);
      React.useEffect(function() {
        if (!open) return;
        var alive = true;
        loadS[1](true);
        errS[1]("");
        var timer = setTimeout(function() {
          call(qS[0]).then(function(items) {
            if (!alive) return;
            rowsS[1](items);
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
      var picked = knownS[0][value] || null;
      var missing = !!value && !picked && !loadS[0];
      var label = !value ? t(lang, "\u9009\u62E9\u8D26\u53F7\u96C6\u5408", "Choose an account set") : picked ? picked.name + (picked.account ? " \xB7 @" + picked.account : "") : t(lang, "\u96C6\u5408 " + value.slice(0, 8), "Set " + value.slice(0, 8));
      if (vault === "missing") {
        return h(
          "div",
          { className: "wbml-picker" },
          h(
            "div",
            { className: "wbml-picker-note", role: "status" },
            t(
              lang,
              "\u6CA1\u6709\u68C0\u6D4B\u5230\u51ED\u636E\u4FDD\u9669\u7BB1\uFF0C\u65E0\u6CD5\u9009\u62E9\u8D26\u53F7\u96C6\u5408\u3002\u5B89\u88C5\u5E76\u521D\u59CB\u5316\u4FDD\u9669\u7BB1\u540E\u5237\u65B0\u672C\u9875\u3002",
              "No vault plugin detected. Install and initialise the vault, then reload."
            )
          )
        );
      }
      if (vault === "loading") {
        return h(
          "div",
          { className: "wbml-picker" },
          h("div", { className: "wbml-picker-note", role: "status" }, t(lang, "\u6B63\u5728\u68C0\u67E5\u4FDD\u9669\u7BB1\u72B6\u6001\u2026", "Checking the vault\u2026"))
        );
      }
      function pick(id) {
        var item = knownS[0][id] || rows.filter(function(x) {
          return x.id === id;
        })[0] || null;
        openS[1](false);
        if (props.onChange) props.onChange(id, item);
      }
      function goVault() {
        openS[1](false);
        var host = typeof window !== "undefined" ? window.__WB_HOST__ : null;
        if (host && typeof host.navigateAddon === "function") host.navigateAddon("wb-addon-vault");
      }
      var emptyText = qS[0] ? t(lang, "\u6CA1\u6709\u5339\u914D\u7684\u8D26\u53F7\u96C6\u5408", "No matching account set") : t(lang, "\u8FD8\u6CA1\u6709\u8D26\u53F7\u96C6\u5408", "No account sets yet");
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
          t(lang, "\u539F\u8D26\u53F7\u96C6\u5408\u5DF2\u5931\u6548\uFF0C\u8BF7\u91CD\u65B0\u9009\u62E9", "The bound account set is gone \u2014 pick another one")
        ) : null,
        open ? h(
          "div",
          { className: "wbml-picker-panel", role: "listbox", "aria-label": t(lang, "\u9009\u62E9\u8D26\u53F7\u96C6\u5408", "Choose an account set") },
          h(FilterChecklist, {
            mode: "single",
            items: rows.map(function(x) {
              return { id: x.id, name: x.name, meta: x.account ? "@" + x.account : t(lang, "\u672A\u586B\u8D26\u53F7", "No account") };
            }),
            selected: value ? [value] : [],
            onPick: pick,
            query: qS[0],
            onQuery: function(v) {
              qS[1](v);
            },
            title: t(lang, "\u8D26\u53F7\u96C6\u5408", "Account sets"),
            total: rows.length,
            searchPlaceholder: t(lang, "\u641C\u7D22\u96C6\u5408\u540D\u6216\u8D26\u53F7", "Search by set name or account"),
            groupLabel: t(lang, "\u8D26\u53F7\u96C6\u5408", "Account sets"),
            loading: loadS[0],
            emptyText,
            noMatchText: t(lang, "\u6CA1\u6709\u5339\u914D\u7684\u8D26\u53F7\u96C6\u5408", "No matching account set"),
            loadingText: t(lang, "\u52A0\u8F7D\u4E2D\u2026", "Loading\u2026"),
            disabled
          }),
          errS[0] ? h(C.Notice, { h, kind: "error", text: errS[0] }) : null,
          !rows.length && !loadS[0] ? h(
            "div",
            { className: "wbml-picker-empty" },
            h("span", null, t(lang, "\u8FD8\u6CA1\u6709\u8D26\u53F7\u96C6\u5408\uFF0C\u53BB\u4FDD\u9669\u7BB1\u65B0\u5EFA\u4E00\u4E2A\u5E76\u586B\u4E0A\u8D26\u53F7", "No account sets yet \u2014 create one in the vault and fill in its account")),
            h(
              "button",
              { type: "button", className: "wbml-btn", onClick: goVault },
              t(lang, "\u53BB\u4FDD\u9669\u7BB1", "Open vault")
            )
          ) : null
        ) : null
      );
    };
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
      app_password: "\u6388\u6743\u7801",
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
      var accountSetId = String(props.accountSetId || "").trim();
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
        if (accountSetId) {
          return C.call(api, "vault.setGet", { id: accountSetId }).then(function(r) {
            var set = r && r.result !== void 0 ? r.result : r;
            var secrets = set && Array.isArray(set.secrets) ? set.secrets : [];
            var q = String(query || "").trim().toLowerCase();
            return secrets.filter(function(x) {
              if (!q) return true;
              return (String(x.name || "") + " " + String(x.kind || "")).toLowerCase().indexOf(q) >= 0;
            }).map(function(x) {
              return { id: x.id, name: x.name, kind: x.kind, meta: x.meta };
            });
          });
        }
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
      }, [vault, accountSetId]);
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
      }, [open, qS[0], accountSetId]);
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
      var label = !value ? accountSetId ? t(lang, "\u9009\u62E9\u96C6\u5408\u91CC\u7684\u6388\u6743\u7801", "Choose a credential in this set") : t(lang, "\u9009\u62E9\u4FDD\u9669\u7BB1\u51ED\u636E", "Choose a vault credential") : picked ? picked.name + " \xB7 " + kindText(lang, picked.kind) : t(lang, "\u51ED\u636E " + value.slice(0, 8), "Credential " + value.slice(0, 8));
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
            emptyText: accountSetId ? t(lang, "\u8FD9\u4E2A\u8D26\u53F7\u96C6\u5408\u91CC\u8FD8\u6CA1\u6709\u51ED\u636E", "This account set has no credentials yet") : t(lang, "\u8FD8\u6CA1\u6709\u51ED\u636E", "No credentials yet"),
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
          noRows && !qS[0] && !accountSetId ? h(
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
  if (code === "EFRAME" || /分段长度与服务器声明不符|尺寸与声明|分段不存在|邮件结构(?:已改变|不完整)|无法解析 IMAP 分段/.test(msg)) return "eframe";
  return "unknown";
}
var ERROR_CLASSES, AUTH_RE, TLS_CODE, REFUSED_CODE, DNS_CODE, ERROR_TEXT;
var init_probe_error = __esm({
  "packages/addons/mail/lib/domain/probe-error.js"() {
    ERROR_CLASSES = ["auth", "dns", "refused", "timeout", "tls", "starttls", "eframe", "unknown"];
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
        zh: "\u8D26\u53F7\u6216\u6388\u6743\u7801\u4E0D\u5BF9\u3002QQ/\u7F51\u6613/Gmail/iCloud \u9700\u8981\u300C\u6388\u6743\u7801\u300D\uFF0C\u4E0D\u662F\u7F51\u9875\u767B\u5F55\u5BC6\u7801\u3002",
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
      eframe: {
        zh: "\u670D\u52A1\u5668\u8FD4\u56DE\u7684\u6B63\u6587\u5C3A\u5BF8\u4E0E\u5B83\u58F0\u660E\u7684\u7ED3\u6784\u4E0D\u4E00\u81F4\uFF0C\u8FD9\u5C01\u90AE\u4EF6\u9700\u8981\u91CD\u65B0\u540C\u6B65\u4E00\u6B21\u3002",
        en: "The server returned body bytes that do not match the declared structure; re-sync this mail."
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
    var SetPicker = require_set_picker();
    var SecretPicker = require_secret_picker();
    var probe = (init_probe_error(), __toCommonJS(probe_error_exports));
    var SW = require_switch();
    var NF = require_number_field();
    var PORT = { min: 1, max: 65535, integer: true };
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
      function domainsOf(id) {
        var p = util.providerById(providers, id);
        return p && p.domains || [];
      }
      function compose(local, domain) {
        var l = String(local || "").trim();
        return l ? l + "@" + domain : "";
      }
      function initial() {
        var base = util.presetFor(providers, "qq", "") || {
          provider: "qq",
          imapHost: "",
          imapPort: 993,
          imapTls: true,
          smtpHost: "",
          smtpPort: 465,
          smtpTls: true
        };
        base.email = "";
        base.name = "";
        base.accountSetId = "";
        base.secretId = "";
        base.advanced = false;
        var baseDoms = domainsOf("qq");
        base.domain = baseDoms.length ? baseDoms[0] : "";
        if (!editing) return base;
        var hitProvider = util.detect(providers, editing.email);
        return Object.assign(base, {
          provider: hitProvider ? hitProvider.id : "other",
          domain: util.domainOf(editing.email) || base.domain,
          email: editing.email || "",
          name: editing.name || "",
          accountSetId: editing.accountSetId || "",
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
      var portS = S({ imap: true, smtp: true });
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
      function setPortOk(key, ok) {
        var field2 = key === "imapPort" ? "imap" : "smtp";
        if (portS[0][field2] === ok) return;
        var next = Object.assign({}, portS[0]);
        next[field2] = ok;
        portS[1](next);
      }
      function portOk() {
        return portS[0].imap !== false && portS[0].smtp !== false;
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
        var doms = domainsOf(id);
        var local = util.localOf(email);
        var dom = util.domainOf(email);
        if (id !== "other" && doms.length && doms.indexOf(dom) < 0) dom = doms[0];
        var next = id === "other" ? String(email || "") : compose(local, dom);
        var p = util.presetFor(providers, id, next);
        if (!p) return;
        upd({ provider: id, email: next, domain: id === "other" ? "" : dom, imapHost: p.imapHost, imapPort: p.imapPort, imapTls: p.imapTls, smtpHost: p.smtpHost, smtpPort: p.smtpPort, smtpTls: p.smtpTls, advanced: id === "other" });
        portS[1]({ imap: true, smtp: true });
      }
      function onPick(id) {
        touchedS[1](true);
        setProbe(null);
        applyPreset(id, f.email);
      }
      function onPickSet(id, set) {
        var address = String(set && set.account || "").trim();
        touchedS[1](true);
        setProbe(null);
        var patch = { accountSetId: id, secretId: "", secretName: "" };
        if (address) {
          var hit = util.detect(providers, address);
          var p = hit ? util.presetFor(providers, hit.id, address) : null;
          patch.email = address;
          if (p) {
            patch.provider = hit.id;
            patch.imapHost = p.imapHost;
            patch.imapPort = p.imapPort;
            patch.imapTls = p.imapTls;
            patch.smtpHost = p.smtpHost;
            patch.smtpPort = p.smtpPort;
            patch.smtpTls = p.smtpTls;
            patch.advanced = false;
          } else {
            patch.provider = "other";
            patch.advanced = true;
          }
          portS[1]({ imap: true, smtp: true });
        }
        upd(patch);
      }
      function validate() {
        if (!String(f.accountSetId || "").trim()) return t(lang, "\u8BF7\u5148\u9009\u62E9\u8D26\u53F7\u96C6\u5408\uFF08\u4FDD\u9669\u7BB1\u300C\u96C6\u5408\u4E0E\u8D26\u53F7\u300D\uFF09", "Pick an account set in the vault first");
        if (!/^\S+@\S+\.\S+$/.test(String(f.email || "").trim())) return t(lang, "\u6240\u9009\u8D26\u53F7\u96C6\u5408\u6CA1\u6709\u53EF\u7528\u7684\u90AE\u7BB1\u8D26\u53F7\uFF0C\u8BF7\u5148\u5230\u4FDD\u9669\u7BB1\u586B\u5199", "The selected account set has no usable email account");
        if (!String(f.name || "").trim()) return t(lang, "\u8BF7\u586B\u5199\u8D26\u6237\u540D\u79F0", "Enter an account name");
        if (!String(f.imapHost || "").trim()) return t(lang, "\u8BF7\u586B\u5199 IMAP \u670D\u52A1\u5668", "Enter the IMAP server");
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
          accountSetId: String(f.accountSetId || "").trim(),
          imapHost: String(f.imapHost || "").trim(),
          imapPort: Number(f.imapPort),
          imapTls: !!f.imapTls,
          smtpHost: String(f.smtpHost || "").trim(),
          smtpPort: Number(f.smtpPort),
          smtpTls: !!f.smtpTls,
          username: String(f.email || "").trim(),
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
        if (!portOk()) {
          setErr(t(lang, "\u7AEF\u53E3\u9700\u5728 1\u201365535 \u4E4B\u95F4", "Port must be between 1 and 65535"));
          return;
        }
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
        if (!portOk()) {
          setErr(t(lang, "\u7AEF\u53E3\u9700\u5728 1\u201365535 \u4E4B\u95F4", "Port must be between 1 and 65535"));
          return;
        }
        var msg = validate();
        if (msg) {
          setErr(msg);
          return;
        }
        setErr("");
        setBusy("probe", true);
        C.call(api, "mail.accountProbe", {
          email: f.email,
          username: f.email,
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
            upd({ [key]: e.target.value });
          }
        });
      }
      function portField(key, label) {
        return h(NF.NumberField, {
          h,
          lang,
          value: f[key],
          min: PORT.min,
          max: PORT.max,
          integer: PORT.integer,
          wide: true,
          ariaLabel: label,
          hint: t(lang, "1\u201365535", "1\u201365535"),
          onCommit: function(next) {
            upd({ [key]: next });
          },
          // 键入过程中就判断草稿合法性，非法时立刻禁用保存/自检。
          onDraft: function(raw) {
            setPortOk(key, NF.validateNumber(raw, { min: PORT.min, max: PORT.max, integer: PORT.integer, lang }).ok);
          },
          onValidChange: function(ok) {
            setPortOk(key, ok);
          }
        });
      }
      function tlsRow(key, label) {
        return h(SW.Switch, {
          h,
          checked: !!f[key],
          label,
          onChange: function(next) {
            upd({ [key]: next });
          }
        });
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
        !f.accountSetId && editing ? h("p", { className: "wbml-hint-line" }, t(lang, "\u8FD9\u4E2A\u8D26\u6237\u662F\u65E7\u7248\u8D26\u6237\uFF0C\u8FD8\u6CA1\u6709\u7ED1\u5B9A\u8D26\u53F7\u96C6\u5408\uFF1B\u4FDD\u5B58\u524D\u8BF7\u5148\u9009\u62E9\u4E00\u4E2A\u3002", "This legacy account has no account set yet \u2014 pick one before saving.")) : null,
        h(
          "div",
          { className: "wbml-acct-grid" },
          field(t(lang, "\u8D26\u53F7\u96C6\u5408", "Account set"), h(SetPicker, {
            h,
            C,
            api,
            React,
            lang,
            vault,
            value: f.accountSetId,
            disabled: busy.save,
            onChange: onPickSet
          }), t(lang, "\u5148\u9009\u4E00\u4E2A\u8D26\u53F7\u96C6\u5408\uFF1B\u90AE\u7BB1\u5730\u5740\u7531\u5B83\u4E0A\u9762\u7684\u8D26\u53F7\u81EA\u52A8\u5E26\u51FA\u3002", "Pick an account set; the email address comes from its account.")),
          field(t(lang, "\u8D26\u6237\u540D\u79F0", "Account name"), textInput("name", { placeholder: t(lang, "\u4F8B\u5982 \u5DE5\u4F5C\u90AE\u7BB1", "e.g. Work mail") }))
        ),
        field(
          t(lang, "\u90AE\u7BB1\u8D26\u53F7\uFF08\u81EA\u52A8\u5E26\u51FA\uFF09", "Email account (auto)"),
          h("input", {
            className: "wbml-input",
            type: "text",
            value: f.email,
            readOnly: true,
            placeholder: t(lang, "\u9009\u62E9\u8D26\u53F7\u96C6\u5408\u540E\u81EA\u52A8\u586B\u5165", "Filled after picking an account set")
          }),
          f.accountSetId ? t(lang, "\u8D26\u53F7\u6765\u81EA\u6240\u9009\u96C6\u5408\uFF0C\u8981\u6539\u5730\u5740\u8BF7\u53BB\u4FDD\u9669\u7BB1\u6539\u96C6\u5408\u8D26\u53F7\u3002", "The address comes from the selected set \u2014 change the set account in the vault.") : null
        ),
        f.accountSetId ? field(
          t(lang, "\u6388\u6743\u7801\uFF08\u96C6\u5408\u5185\u51ED\u636E\uFF09", "App password (in this set)"),
          h(SecretPicker, {
            h,
            React,
            C,
            api,
            lang,
            vault,
            accountSetId: f.accountSetId,
            value: f.secretId,
            disabled: busy.save || !f.accountSetId,
            onChange: function(id, item) {
              upd({ secretId: id, secretName: item ? item.name : "" });
              setProbe(null);
            }
          }),
          t(
            lang,
            "\u53EA\u5217\u8FD9\u4E2A\u8D26\u53F7\u96C6\u5408\u91CC\u7684\u51ED\u636E\uFF1B\u5148\u628A\u6388\u6743\u7801\u653E\u8FDB\u8FD9\u4E2A\u96C6\u5408\u3002",
            "Only credentials in this set are listed here."
          )
        ) : field(
          t(lang, "\u6388\u6743\u7801\uFF08\u96C6\u5408\u5185\u51ED\u636E\uFF09", "App password (in this set)"),
          h("p", { className: "wbml-hint-line" }, t(lang, "\u8BF7\u5148\u9009\u62E9\u8D26\u53F7\u96C6\u5408\uFF0C\u518D\u4ECE\u96C6\u5408\u91CC\u9009\u6388\u6743\u7801\u3002", "Pick an account set first, then choose a credential."))
        ),
        provider && util.hintOf(provider, lang) ? h("p", { className: "wbml-hint-line" }, util.hintOf(provider, lang)) : null,
        !f.advanced && f.imapHost ? h("p", { className: "wbml-hint-line" }, "IMAP " + f.imapHost + ":" + f.imapPort + (f.imapTls ? " TLS" : "") + " \xB7 SMTP " + (f.smtpHost || "\u2014") + ":" + f.smtpPort + (f.smtpTls ? " TLS" : " STARTTLS")) : null,
        !f.advanced ? h("button", { type: "button", className: "wbml-btn", onClick: function() {
          upd({ advanced: true });
        } }, t(lang, "\u5176\u4ED6\u8BBE\u7F6E\uFF08\u4E3B\u673A / \u7AEF\u53E3\uFF09", "Advanced (hosts / ports)")) : h(
          "div",
          { className: "wbml-acct-grid" },
          field(t(lang, "IMAP \u670D\u52A1\u5668", "IMAP server"), textInput("imapHost")),
          field(t(lang, "IMAP \u7AEF\u53E3", "IMAP port"), portField("imapPort", t(lang, "IMAP \u7AEF\u53E3", "IMAP port"))),
          field("", tlsRow("imapTls", t(lang, "IMAP \u9690\u5F0F TLS", "IMAP implicit TLS"))),
          field(t(lang, "SMTP \u670D\u52A1\u5668", "SMTP server"), textInput("smtpHost")),
          field(t(lang, "SMTP \u7AEF\u53E3", "SMTP port"), portField("smtpPort", t(lang, "SMTP \u7AEF\u53E3", "SMTP port"))),
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
        !f.accountSetId ? h("p", { className: "wbml-hint-line" }, t(lang, "\u8BF7\u5148\u9009\u62E9\u8D26\u53F7\u96C6\u5408\uFF0C\u672A\u9009\u65F6\u4E0D\u80FD\u4FDD\u5B58\u3002", "Pick an account set before saving.")) : !f.secretId ? h("p", { className: "wbml-hint-line" }, t(lang, "\u8BF7\u4ECE\u6240\u9009\u96C6\u5408\u91CC\u9009\u4E00\u6761\u6388\u6743\u7801\uFF0C\u672A\u9009\u65F6\u4E0D\u80FD\u4FDD\u5B58\u3002", "Pick a credential from the selected set before saving.")) : null,
        h(
          "div",
          { className: "wbml-acct-foot" },
          h(C.Btn, { h, onClick: runProbe, disabled: busy.probe || busy.save || !f.accountSetId || !f.secretId || !portOk() }, busy.probe ? t(lang, "\u81EA\u68C0\u4E2D\u2026", "Checking\u2026") : t(lang, "\u4FDD\u5B58\u524D\u81EA\u68C0", "Check connection")),
          h(C.Btn, { h, kind: "primary", onClick: submit, disabled: busy.save || !f.accountSetId || !f.secretId || !portOk() }, busy.save ? t(lang, "\u4FDD\u5B58\u4E2D\u2026", "Saving\u2026") : t(lang, "\u4FDD\u5B58", "Save")),
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
          h(
            "div",
            { className: "wbml-card-meta" },
            a.accountSetName ? t(lang, "\u8D26\u53F7\u96C6\u5408\uFF1A", "Account set: ") + a.accountSetName : a.accountSetId ? t(lang, "\u8D26\u53F7\u96C6\u5408\u5DF2\u5931\u6548\uFF0C\u8BF7\u91CD\u9009", "The account set is gone \u2014 pick another one") : t(lang, "\u672A\u7ED1\u5B9A\u8D26\u53F7\u96C6\u5408", "No account set bound")
          ),
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
  __iconData: () => __iconData20,
  default: () => Eye
});
var __iconData20, Eye;
var init_eye = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/eye.mjs"() {
    init_createLucideIcon();
    __iconData20 = {
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
    __iconData20.node;
    Eye = createLucideIcon(__iconData20);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/eye-off.mjs
var eye_off_exports = {};
__export(eye_off_exports, {
  __iconData: () => __iconData21,
  default: () => EyeOff
});
var __iconData21, EyeOff;
var init_eye_off = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/eye-off.mjs"() {
    init_createLucideIcon();
    __iconData21 = {
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
    __iconData21.node;
    EyeOff = createLucideIcon(__iconData21);
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
      var setNameS = React.useState({});
      React.useEffect(function() {
        C.call(api, "vault.setList", { type: "account", q: "" }).then(function(r) {
          var map = {};
          (r && r.items || []).forEach(function(x) {
            map[x.id] = x.name;
          });
          setNameS[1](map);
        }).catch(function() {
          setNameS[1]({});
        });
      }, []);
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
          h("div", null, h("h2", null, lang === "en" ? "Mail accounts" : "\u90AE\u7BB1\u8D26\u6237"), h("p", { className: "wbml-sub" }, lang === "en" ? "Pick a provider, then choose an app-password credential from the vault; this page only stores its id." : "\u5148\u9009\u4FDD\u9669\u7BB1\u91CC\u7684\u8D26\u53F7\u96C6\u5408\uFF0C\u8D26\u53F7\u81EA\u52A8\u5E26\u51FA\uFF0C\u518D\u4ECE\u96C6\u5408\u91CC\u6311\u4E00\u6761\u6388\u6743\u7801\uFF1B\u90AE\u4EF6\u9875\u53EA\u4FDD\u5B58\u51ED\u636E id\u3002")),
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
              accountSetName: setNameS[0][a.accountSetId] || "",
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
var GLYPHS = require_icons2().ICONS;
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
  var I = { mail: GLYPHS["mail"], send: GLYPHS["send"], users: GLYPHS["users"], db: GLYPHS["database"], list: GLYPHS["list"], sliders: GLYPHS["sliders"] };
  function Icon2(p) {
    var C2 = I[p.name] || I.mail;
    return h(C2, { size: 14, strokeWidth: 2, className: "wbg-svg" });
  }
  function tab(n) {
    return function() {
      return h(Icon2, { name: n });
    };
  }
  function withProps(Inner, title) {
    return function(p) {
      return h(Inner, { api: p.api, lang: p.lang === "en" ? "en" : "zh", h, React, title, Slot: host.Slot, viewParams: p.viewParams });
    };
  }
  var C = require_common();
  var Gate = require_lock_gate();
  function gated(Inner, title) {
    return Gate.gate(withProps(Inner, title), h, React, C);
  }
  if (typeof document !== "undefined" && document.head && !document.getElementById("wb-mail-style")) {
    var s = document.createElement("style");
    s.id = "wb-mail-style";
    s.textContent = CSS;
    document.head.appendChild(s);
  }
  var slotBackToMessage = require_slot_back_to_message()({ React, h, C, Icon: Icon2 });
  host.registerAddon({
    id: "wb-addon-mail",
    version: "0.6.0",
    icon: GLYPHS["mail"],
    slots: [{ slot: "item.actions", id: "mail.back-to-message", order: 100, component: slotBackToMessage }],
    views: [
      { id: "messages", icon: tab("mail"), title: { zh: "\u90AE\u4EF6", en: "Messages" }, component: gated(require_messages(), "\u90AE\u4EF6") },
      { id: "compose", icon: tab("send"), title: { zh: "\u5199\u4FE1", en: "Compose" }, component: gated(require_compose(), "\u5199\u4FE1") },
      { id: "accounts", icon: tab("users"), title: { zh: "\u8D26\u6237", en: "Accounts" }, component: gated(require_accounts(), "\u8D26\u6237") },
      { id: "data", icon: tab("db"), title: { zh: "\u6570\u636E", en: "Data" }, component: gated(require_data(), "\u6570\u636E") },
      { id: "actions", icon: tab("list"), title: { zh: "Action", en: "Actions" }, component: withProps(require_actions(), "Action") },
      // 配置页排在最后：它是策略入口，不该挡在每天要用的邮件前面。锁定时仍可进入（不涉及邮件内容）。
      { id: "config", icon: tab("sliders"), title: { zh: "\u914D\u7F6E", en: "Settings" }, component: withProps(require_config(), "\u914D\u7F6E") }
    ]
  });
  module.exports = { name: "dsh-workbench-mail", inject: [], apply: function() {
  } };
})();
    return module.exports;
  },
});
