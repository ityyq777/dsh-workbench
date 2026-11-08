// 由 scripts/build-addon-clients.mjs 生成；请修改 client/client.src.cjs 后重新构建。
window.__ModuleLoader__ = window.__ModuleLoader__ || { modules: {}, load: function (m) { this.modules[m.id] = m.factory; } };
window.__ModuleLoader__.load({
  id: "dsh-workbench-sites",
  factory: function (require) {
    var module = { exports: {} };
    var exports = module.exports;
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

// node_modules/.pnpm/lucide-react@1.70.0_react@19.3.1/node_modules/lucide-react/dist/esm/shared/src/utils/toKebabCase.mjs
var toKebabCase;
var init_toKebabCase = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.3.1/node_modules/lucide-react/dist/esm/shared/src/utils/toKebabCase.mjs"() {
    toKebabCase = (string) => string?.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.3.1/node_modules/lucide-react/dist/esm/shared/src/utils/toLucideIconData.mjs
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
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.3.1/node_modules/lucide-react/dist/esm/shared/src/utils/toLucideIconData.mjs"() {
    init_toKebabCase();
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.3.1/node_modules/lucide-react/dist/esm/shared/src/utils/toCamelCase.mjs
var toCamelCase;
var init_toCamelCase = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.3.1/node_modules/lucide-react/dist/esm/shared/src/utils/toCamelCase.mjs"() {
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

// node_modules/.pnpm/lucide-react@1.70.0_react@19.3.1/node_modules/lucide-react/dist/esm/shared/src/utils/toPascalCase.mjs
var toPascalCase;
var init_toPascalCase = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.3.1/node_modules/lucide-react/dist/esm/shared/src/utils/toPascalCase.mjs"() {
    init_toCamelCase();
    toPascalCase = (string) => {
      const camelCase = toCamelCase(string);
      return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
    };
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.3.1/node_modules/lucide-react/dist/esm/shared/src/utils/mergeClasses.mjs
var mergeClasses;
var init_mergeClasses = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.3.1/node_modules/lucide-react/dist/esm/shared/src/utils/mergeClasses.mjs"() {
    mergeClasses = (...classes) => classes.filter((className, index, array) => {
      return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
    }).join(" ").trim();
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.3.1/node_modules/lucide-react/dist/esm/shared/src/build/defaultAttributes.mjs
var defaultAttributes;
var init_defaultAttributes = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.3.1/node_modules/lucide-react/dist/esm/shared/src/build/defaultAttributes.mjs"() {
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

// node_modules/.pnpm/lucide-react@1.70.0_react@19.3.1/node_modules/lucide-react/dist/esm/shared/src/build/buildLucideIconNode.mjs
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
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.3.1/node_modules/lucide-react/dist/esm/shared/src/build/buildLucideIconNode.mjs"() {
    init_defaultAttributes();
    init_mergeClasses();
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.3.1/node_modules/lucide-react/dist/esm/shared/src/build/buildLucideIconForReact.mjs
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
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.3.1/node_modules/lucide-react/dist/esm/shared/src/build/buildLucideIconForReact.mjs"() {
    init_buildLucideIconNode();
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.3.1/node_modules/lucide-react/dist/esm/shared/src/utils/hasA11yProp.mjs
var hasA11yProp;
var init_hasA11yProp = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.3.1/node_modules/lucide-react/dist/esm/shared/src/utils/hasA11yProp.mjs"() {
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

// node_modules/.pnpm/lucide-react@1.70.0_react@19.3.1/node_modules/lucide-react/dist/esm/context.mjs
var import_react, LucideContext, useLucideContext;
var init_context = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.3.1/node_modules/lucide-react/dist/esm/context.mjs"() {
    "use strict";
    "use client";
    import_react = require("react");
    LucideContext = (0, import_react.createContext)({});
    useLucideContext = () => (0, import_react.useContext)(LucideContext);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.3.1/node_modules/lucide-react/dist/esm/Icon.mjs
var import_react2, Icon;
var init_Icon = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.3.1/node_modules/lucide-react/dist/esm/Icon.mjs"() {
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

// node_modules/.pnpm/lucide-react@1.70.0_react@19.3.1/node_modules/lucide-react/dist/esm/createLucideIcon.mjs
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
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.3.1/node_modules/lucide-react/dist/esm/createLucideIcon.mjs"() {
    import_react3 = require("react");
    init_toLucideIconData();
    init_toPascalCase();
    init_Icon();
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.3.1/node_modules/lucide-react/dist/esm/icons/x.mjs
var x_exports = {};
__export(x_exports, {
  __iconData: () => __iconData,
  default: () => X
});
var __iconData, X;
var init_x = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.3.1/node_modules/lucide-react/dist/esm/icons/x.mjs"() {
    init_createLucideIcon();
    __iconData = {
      name: "x",
      size: 24,
      node: [
        ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
        ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
      ]
    };
    __iconData.node;
    X = createLucideIcon(__iconData);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.3.1/node_modules/lucide-react/dist/esm/icons/plus.mjs
var plus_exports = {};
__export(plus_exports, {
  __iconData: () => __iconData2,
  default: () => Plus
});
var __iconData2, Plus;
var init_plus = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.3.1/node_modules/lucide-react/dist/esm/icons/plus.mjs"() {
    init_createLucideIcon();
    __iconData2 = {
      name: "plus",
      size: 24,
      node: [
        ["path", { d: "M5 12h14", key: "1ays0h" }],
        ["path", { d: "M12 5v14", key: "s699le" }]
      ]
    };
    __iconData2.node;
    Plus = createLucideIcon(__iconData2);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.3.1/node_modules/lucide-react/dist/esm/icons/pencil.mjs
var pencil_exports = {};
__export(pencil_exports, {
  __iconData: () => __iconData3,
  default: () => Pencil
});
var __iconData3, Pencil;
var init_pencil = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.3.1/node_modules/lucide-react/dist/esm/icons/pencil.mjs"() {
    init_createLucideIcon();
    __iconData3 = {
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
    __iconData3.node;
    Pencil = createLucideIcon(__iconData3);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.3.1/node_modules/lucide-react/dist/esm/icons/trash.mjs
var __iconData4, Trash;
var init_trash = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.3.1/node_modules/lucide-react/dist/esm/icons/trash.mjs"() {
    init_createLucideIcon();
    __iconData4 = {
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
    __iconData4.node;
    Trash = createLucideIcon(__iconData4);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.3.1/node_modules/lucide-react/dist/esm/icons/trash-2.mjs
var trash_2_exports = {};
__export(trash_2_exports, {
  default: () => Trash
});
var init_trash_2 = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.3.1/node_modules/lucide-react/dist/esm/icons/trash-2.mjs"() {
    init_trash();
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.3.1/node_modules/lucide-react/dist/esm/icons/folder-plus.mjs
var folder_plus_exports = {};
__export(folder_plus_exports, {
  __iconData: () => __iconData5,
  default: () => FolderPlus
});
var __iconData5, FolderPlus;
var init_folder_plus = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.3.1/node_modules/lucide-react/dist/esm/icons/folder-plus.mjs"() {
    init_createLucideIcon();
    __iconData5 = {
      name: "folder-plus",
      size: 24,
      node: [
        ["path", { d: "M12 10v6", key: "1bos4e" }],
        ["path", { d: "M9 13h6", key: "1uhe8q" }],
        [
          "path",
          {
            d: "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z",
            key: "1kt360"
          }
        ]
      ]
    };
    __iconData5.node;
    FolderPlus = createLucideIcon(__iconData5);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.3.1/node_modules/lucide-react/dist/esm/icons/refresh-cw.mjs
var refresh_cw_exports = {};
__export(refresh_cw_exports, {
  __iconData: () => __iconData6,
  default: () => RefreshCw
});
var __iconData6, RefreshCw;
var init_refresh_cw = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.3.1/node_modules/lucide-react/dist/esm/icons/refresh-cw.mjs"() {
    init_createLucideIcon();
    __iconData6 = {
      name: "refresh-cw",
      size: 24,
      node: [
        ["path", { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8", key: "v9h5vc" }],
        ["path", { d: "M21 3v5h-5", key: "1q7to0" }],
        ["path", { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16", key: "3uifl3" }],
        ["path", { d: "M8 16H3v5", key: "1cv678" }]
      ]
    };
    __iconData6.node;
    RefreshCw = createLucideIcon(__iconData6);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.3.1/node_modules/lucide-react/dist/esm/icons/search.mjs
var search_exports = {};
__export(search_exports, {
  __iconData: () => __iconData7,
  default: () => Search
});
var __iconData7, Search;
var init_search = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.3.1/node_modules/lucide-react/dist/esm/icons/search.mjs"() {
    init_createLucideIcon();
    __iconData7 = {
      name: "search",
      size: 24,
      node: [
        ["path", { d: "m21 21-4.34-4.34", key: "14j7rj" }],
        ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }]
      ]
    };
    __iconData7.node;
    Search = createLucideIcon(__iconData7);
  }
});

// packages/addons/sites/client/client.src.cjs
var React = require("react");
var h = React.createElement;
(function() {
  var host = window.__WB_HOST__;
  if (!host) {
    console.error("[wb-addon-sites] \u7F3A\u5C11 window.__WB_HOST__\uFF0C\u65E0\u6CD5\u6CE8\u518C\u7AD9\u70B9\u89C6\u56FE");
    return { name: "dsh-workbench-sites", inject: [], apply: function() {
    } };
  }
  var React2 = require("react");
  var h2 = React2.createElement;
  var ICONS = {
    "x": (init_x(), __toCommonJS(x_exports)).default,
    "plus": (init_plus(), __toCommonJS(plus_exports)).default,
    "edit": (init_pencil(), __toCommonJS(pencil_exports)).default,
    "trash": (init_trash_2(), __toCommonJS(trash_2_exports)).default,
    "folder-plus": (init_folder_plus(), __toCommonJS(folder_plus_exports)).default,
    "refresh": (init_refresh_cw(), __toCommonJS(refresh_cw_exports)).default,
    "search": (init_search(), __toCommonJS(search_exports)).default
  };
  function Icon2(props) {
    var C = ICONS[props.name];
    if (!C) return null;
    return h2(C, { size: props.size || 14, strokeWidth: 2, "aria-hidden": "true", className: "wbs-svg" });
  }
  var useState = React2.useState;
  var useEffect = React2.useEffect;
  var useRef = React2.useRef;
  var useMemo2 = React2.useMemo;
  var COPY = {
    zh: {
      title: "\u7AD9\u70B9",
      all: "\u5168\u90E8\u7AD9\u70B9",
      directory: "\u76EE\u5F55",
      addDir: "\u65B0\u5EFA\u76EE\u5F55",
      addChild: "\u65B0\u5EFA\u5B50\u76EE\u5F55",
      rename: "\u91CD\u547D\u540D",
      remove: "\u5220\u9664\u76EE\u5F55",
      search: "\u641C\u7D22\u7AD9\u70B9\u540D\u79F0\u6216\u63CF\u8FF0",
      newSite: "\uFF0B \u65B0\u5EFA\u7AD9\u70B9",
      siteCol: "\u7AD9\u70B9 / \u5E73\u53F0",
      tagCol: "\u6807\u7B7E",
      createTime: "\u521B\u5EFA\u65F6\u95F4",
      updateTime: "\u66F4\u65B0\u65F6\u95F4",
      actions: "\u64CD\u4F5C",
      links: "\u94FE\u63A5",
      dirs: "\u76EE\u5F55",
      edit: "\u7F16\u8F91",
      del: "\u5220\u9664",
      default: "\u9ED8\u8BA4",
      noLink: "\u6682\u65E0\u94FE\u63A5",
      noDesc: "\u6682\u65E0\u63CF\u8FF0",
      empty: "\u8FD8\u6CA1\u6709\u7AD9\u70B9",
      emptyHint: "\u70B9\u51FB\u53F3\u4E0A\u89D2\u201C\u65B0\u5EFA\u7AD9\u70B9\u201D\uFF0C\u6216\u5728\u5F53\u524D\u76EE\u5F55\u4E0B\u521B\u5EFA\u7B2C\u4E00\u6761\u8BB0\u5F55\u3002",
      loading: "\u52A0\u8F7D\u4E2D\u2026",
      prev: "\u4E0A\u4E00\u9875",
      next: "\u4E0B\u4E00\u9875",
      total: "\u5171 {n} \u4E2A",
      deleteTitle: "\u5220\u9664\u7AD9\u70B9",
      deleteText: "\u786E\u5B9A\u5220\u9664\u300C{name}\u300D\u5417\uFF1F\u7AD9\u70B9\u4F1A\u88AB\u8F6F\u5220\u9664\uFF0C\u76EE\u5F55\u4E0E\u6807\u7B7E\u5173\u8054\u4E5F\u4F1A\u6E05\u7406\u3002",
      cancel: "\u53D6\u6D88",
      confirm: "\u786E\u5B9A\u5220\u9664",
      createTitle: "\u65B0\u5EFA\u7AD9\u70B9",
      editTitle: "\u7F16\u8F91\u7AD9\u70B9",
      step1: "\u57FA\u7840\u4FE1\u606F",
      step2: "\u5173\u8054\u76EE\u5F55",
      step3: "\u5173\u8054\u6807\u7B7E",
      siteName: "\u7AD9\u70B9\u540D\u79F0",
      siteNamePh: "\u4F8B\u5982\uFF1AMDN",
      desc: "\u4E00\u53E5\u8BDD\u63CF\u8FF0",
      descPh: "\u8FD9\u4E2A\u7AD9\u70B9\u662F\u505A\u4EC0\u4E48\u7684",
      linkList: "\u94FE\u63A5",
      linkDesc: "\u63CF\u8FF0",
      linkUrl: "\u7F51\u5740",
      addLink: "\uFF0B \u6DFB\u52A0\u94FE\u63A5",
      setDefault: "\u8BBE\u4E3A\u9ED8\u8BA4",
      removeLink: "\u79FB\u9664",
      chooseDirs: "\u9009\u62E9\u76EE\u5F55\uFF08\u81F3\u5C11\u4E00\u4E2A\uFF09",
      chooseTags: "\u9009\u62E9\u6807\u7B7E",
      tagSearch: "\u641C\u7D22\u6807\u7B7E",
      noTags: "\u6CA1\u6709\u5339\u914D\u7684\u6807\u7B7E",
      noDirs: "\u8FD8\u6CA1\u6709\u76EE\u5F55\uFF0C\u8BF7\u5148\u5728\u5DE6\u4FA7\u65B0\u5EFA\u76EE\u5F55",
      back: "\u4E0A\u4E00\u6B65",
      nextStep: "\u4E0B\u4E00\u6B65",
      save: "\u4FDD\u5B58",
      saving: "\u4FDD\u5B58\u4E2D\u2026",
      requiredName: "\u8BF7\u586B\u5199\u7AD9\u70B9\u540D\u79F0",
      requiredDirs: "\u8BF7\u81F3\u5C11\u9009\u62E9\u4E00\u4E2A\u76EE\u5F55",
      tagFilter: "\u6807\u7B7E\u7B5B\u9009",
      allTags: "\u5168\u90E8\u6807\u7B7E",
      clear: "\u6E05\u9664",
      refresh: "\u5237\u65B0",
      selected: "\u5DF2\u9009 {n} \u9879",
      deleteSelected: "\u5220\u9664\u6240\u9009",
      removeDirTitle: "\u5220\u9664\u76EE\u5F55",
      removeDirText: "\u786E\u5B9A\u5220\u9664\u300C{name}\u300D\u53CA\u5176\u6240\u6709\u5B50\u76EE\u5F55\u5417\uFF1F\u76EE\u5F55\u4E0B\u7684\u7AD9\u70B9\u4E0D\u4F1A\u88AB\u5220\u9664\uFF0C\u53EA\u4F1A\u89E3\u9664\u76EE\u5F55\u5173\u8054\u3002",
      dirName: "\u76EE\u5F55\u540D\u79F0",
      create: "\u521B\u5EFA",
      renameTitle: "\u91CD\u547D\u540D\u76EE\u5F55",
      bulkConfirm: "\u786E\u5B9A\u5220\u9664\u9009\u4E2D\u7684 {n} \u4E2A\u7AD9\u70B9\u5417\uFF1F",
      opFail: "\u64CD\u4F5C\u5931\u8D25\uFF1A{msg}",
      loadFail: "\u52A0\u8F7D\u5931\u8D25\uFF1A{msg}",
      saved: "\u5DF2\u4FDD\u5B58",
      deleted: "\u5DF2\u5220\u9664",
      moved: "\u5DF2\u79FB\u52A8"
    },
    en: {
      title: "Sites",
      all: "All sites",
      directory: "Folders",
      addDir: "New folder",
      addChild: "New subfolder",
      rename: "Rename",
      remove: "Delete folder",
      search: "Search site name or description",
      newSite: "+ New site",
      siteCol: "Site",
      tagCol: "Tags",
      createTime: "Created",
      updateTime: "Updated",
      actions: "Actions",
      links: "Links",
      dirs: "Folders",
      edit: "Edit",
      del: "Delete",
      default: "Default",
      noLink: "No link",
      noDesc: "No description",
      empty: "No sites yet",
      emptyHint: "Use \u201CNew site\u201D in the top right to add the first one.",
      loading: "Loading\u2026",
      prev: "Prev",
      next: "Next",
      total: "{n} sites",
      deleteTitle: "Delete site",
      deleteText: "Delete \u201C{name}\u201D? The site is soft deleted and its folder/tag links are cleaned up.",
      cancel: "Cancel",
      confirm: "Delete",
      createTitle: "New site",
      editTitle: "Edit site",
      step1: "Basics",
      step2: "Folders",
      step3: "Tags",
      siteName: "Site name",
      siteNamePh: "e.g. MDN",
      desc: "Description",
      descPh: "What is this site for?",
      linkList: "Links",
      linkDesc: "Label",
      linkUrl: "URL",
      addLink: "+ Add link",
      setDefault: "Default",
      removeLink: "Remove",
      chooseDirs: "Choose at least one folder",
      chooseTags: "Choose tags",
      tagSearch: "Search tags",
      noTags: "No matching tags",
      noDirs: "No folders yet. Create one on the left first.",
      back: "Back",
      nextStep: "Next",
      save: "Save",
      saving: "Saving\u2026",
      requiredName: "Site name is required",
      requiredDirs: "Choose at least one folder",
      tagFilter: "Filter by tag",
      allTags: "All tags",
      clear: "Clear",
      refresh: "Refresh",
      selected: "{n} selected",
      deleteSelected: "Delete selected",
      removeDirTitle: "Delete folder",
      removeDirText: "Delete \u201C{name}\u201D and all subfolders? Sites are kept; only folder links are removed.",
      dirName: "Folder name",
      create: "Create",
      renameTitle: "Rename folder",
      bulkConfirm: "Delete {n} selected sites?",
      opFail: "Operation failed: {msg}",
      loadFail: "Load failed: {msg}",
      saved: "Saved",
      deleted: "Deleted",
      moved: "Moved"
    }
  };
  function text(lang, key, vars) {
    var dict = COPY[lang] || COPY.zh;
    var value = dict[key] !== void 0 ? dict[key] : COPY.zh[key] || key;
    if (vars) {
      Object.keys(vars).forEach(function(k) {
        value = value.split("{" + k + "}").join(String(vars[k]));
      });
    }
    return value;
  }
  function hostHasAddon(id) {
    var list = host.addons;
    if (!Array.isArray(list)) return true;
    return list.some(function(a) {
      return a && a.id === id && a.enabled !== false;
    });
  }
  var cssText = [
    ".wbs-root{--wbs-line:var(--dsw-alias-border-l2, color-mix(in srgb, var(--dsw-alias-label-primary,#1f2328) 13%, transparent));--wbs-soft:var(--dsw-alias-interactive-bg-hover, color-mix(in srgb, var(--dsw-alias-label-primary,#1f2328) 4.5%, transparent));--wbs-accent:var(--dsw-alias-brand-primary,#0a8f7d);--wbs-muted:var(--dsw-alias-label-secondary, color-mix(in srgb, var(--dsw-alias-label-primary,#1f2328) 58%, transparent));display:flex;flex-direction:column;min-height:560px;color:var(--dsw-alias-label-primary,#1f2328);font-size:13px}",
    ".wbs-grow{flex:1;min-width:0}",
    ".wbs-head{display:flex;align-items:center;gap:10px;margin:2px 0 14px}",
    ".wbs-head h2{margin:0;font-size:21px;font-weight:650;letter-spacing:.01em}",
    ".wbs-count{font-size:12px;color:var(--wbs-muted)}",
    ".wbs-btn{appearance:none;border:1px solid var(--wbs-line);background:transparent;color:inherit;border-radius:8px;padding:6px 10px;font-size:12px;cursor:pointer;line-height:1.35;white-space:nowrap;font-family:inherit}",
    ".wbs-btn:hover{background:var(--wbs-soft)}",
    ".wbs-btn.primary{background:var(--wbs-accent);color:var(--dsw-alias-label-primary-inverted,#fff);border-color:transparent}",
    ".wbs-btn.primary:hover{filter:brightness(1.06)}",
    ".wbs-btn.danger{color:var(--dsw-alias-state-error-primary,#bd3b32);border-color:color-mix(in srgb,var(--dsw-alias-state-error-primary,#bd3b32) 34%,transparent)}",
    ".wbs-btn.danger:hover{background:color-mix(in srgb,var(--dsw-alias-state-error-primary,#bd3b32) 8%,transparent)}",
    ".wbs-btn.sm{padding:3px 7px;font-size:11px;border-radius:6px}",
    ".wbs-btn:disabled{opacity:.5;cursor:not-allowed}",
    ".wbs-body{display:flex;gap:16px;align-items:flex-start;flex:1;min-height:0}",
    ".wbs-tree{width:236px;flex:none;border:1px solid var(--wbs-line);border-radius:12px;background:color-mix(in srgb,var(--dsw-alias-bg-layer-1,#fff) 62%,transparent);padding:8px;max-height:calc(100vh - 220px);overflow:auto}",
    ".wbs-tree-top{display:flex;align-items:center;gap:6px;padding:3px 4px 8px;border-bottom:1px solid var(--wbs-line);margin-bottom:6px}",
    ".wbs-tree-title{font-size:12px;font-weight:600;color:var(--wbs-muted);flex:1}",
    ".wbs-node{display:flex;align-items:center;gap:3px;padding:4px 5px;border-radius:7px;cursor:pointer;min-height:27px;box-sizing:border-box}",
    ".wbs-node:hover{background:var(--wbs-soft)}",
    ".wbs-node.active{background:color-mix(in srgb,var(--wbs-accent) 13%,transparent);color:var(--wbs-accent);font-weight:600}",
    ".wbs-caret{width:16px;flex:none;text-align:center;font-size:10px;opacity:.65}",
    ".wbs-node-name{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
    ".wbs-node-actions{display:none;align-items:center;gap:1px;flex:none}",
    ".wbs-node:hover .wbs-node-actions{display:flex}",
    ".wbs-mini{appearance:none;border:0;background:transparent;color:var(--wbs-muted);border-radius:4px;cursor:pointer;font-size:12px;line-height:1;padding:3px 4px;font-family:inherit;display:inline-flex;align-items:center;justify-content:center}",
    ".wbs-mini:hover{background:var(--wbs-line);color:inherit}",
    ".wbs-svg{display:block;flex:none}",
    ".wbs-main{flex:1;min-width:0;display:flex;flex-direction:column;gap:10px}",
    ".wbs-crumbs{display:flex;align-items:center;gap:4px;flex-wrap:wrap;font-size:12px;min-height:22px}",
    ".wbs-crumb{appearance:none;border:0;background:transparent;color:var(--wbs-muted);padding:3px 4px;border-radius:5px;cursor:pointer;font-family:inherit;font-size:12px}",
    ".wbs-crumb:hover{background:var(--wbs-soft);color:inherit}",
    ".wbs-crumb.cur{color:inherit;font-weight:600}",
    ".wbs-sep{opacity:.4;font-size:10px}",
    ".wbs-toolbar{display:flex;align-items:center;gap:8px;flex-wrap:wrap}",
    ".wbs-search{display:flex;align-items:center;gap:6px;border:1px solid var(--wbs-line);border-radius:8px;padding:0 8px;background:color-mix(in srgb,var(--dsw-alias-bg-layer-1,#fff) 58%,transparent);min-width:210px;flex:0 1 300px}",
    ".wbs-search input{border:0;outline:0;background:transparent;color:inherit;font:inherit;padding:7px 0;flex:1;min-width:0}",
    ".wbs-search button{border:0;background:transparent;color:var(--wbs-muted);cursor:pointer;font-size:12px;padding:3px}",
    ".wbs-tagfilter{position:relative}",
    ".wbs-tagmenu{position:absolute;z-index:30;top:calc(100% + 6px);left:0;width:230px;max-height:300px;overflow:auto;background:var(--dsw-alias-bg-layer-1,#fffdf7);border:1px solid var(--wbs-line);border-radius:10px;box-shadow:0 12px 30px rgba(0,0,0,.14);padding:8px}",
    ".wbs-tagmenu-head{display:flex;align-items:center;gap:6px;font-size:11px;color:var(--wbs-muted);padding:2px 4px 7px}",
    ".wbs-tagopt{display:flex;align-items:center;gap:7px;padding:6px;border-radius:6px;cursor:pointer;font-size:12px}",
    ".wbs-tagopt:hover{background:var(--wbs-soft)}",
    ".wbs-tablewrap{border:1px solid var(--wbs-line);border-radius:12px;overflow:auto;background:color-mix(in srgb,var(--dsw-alias-bg-layer-1,#fff) 55%,transparent)}",
    ".wbs-table{width:100%;border-collapse:collapse;table-layout:fixed}",
    ".wbs-table th{font-size:11px;font-weight:600;color:var(--wbs-muted);text-align:left;padding:9px 9px;border-bottom:1px solid var(--wbs-line);white-space:nowrap;background:color-mix(in srgb,var(--dsw-alias-bg-layer-2,#f4f1e4) 55%,transparent)}",
    ".wbs-table td{padding:10px 9px;border-bottom:1px solid color-mix(in srgb,var(--wbs-line) 68%,transparent);vertical-align:top}",
    ".wbs-table tr:last-child td{border-bottom:0}",
    ".wbs-table tbody tr:hover td{background:color-mix(in srgb,var(--wbs-accent) 3.5%,transparent)}",
    ".wbs-th-sort{cursor:pointer;user-select:none}",
    ".wbs-th-sort:hover{color:inherit}",
    ".wbs-site-name{font-weight:600;font-size:13px;word-break:break-word}",
    ".wbs-site-desc{font-size:12px;color:var(--wbs-muted);margin-top:3px;word-break:break-word}",
    ".wbs-site-link{display:inline-block;margin-top:4px;font-size:11.5px;color:var(--wbs-accent);text-decoration:none;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;vertical-align:top}",
    ".wbs-site-link:hover{text-decoration:underline}",
    ".wbs-muted{color:var(--wbs-muted)}",
    ".wbs-chip{display:inline-flex;align-items:center;gap:4px;border:1px solid var(--wbs-line);border-radius:999px;padding:2px 7px;font-size:11px;margin:0 4px 3px 0;background:color-mix(in srgb,var(--wbs-accent) 6%,transparent);max-width:100%}",
    ".wbs-chip button{border:0;background:transparent;color:inherit;cursor:pointer;padding:0;font-size:11px;opacity:.65}",
    ".wbs-actions{display:flex;gap:4px;flex-wrap:wrap}",
    ".wbs-expand td{background:color-mix(in srgb,var(--dsw-alias-bg-layer-2,#f4f1e4) 52%,transparent);padding:10px 12px}",
    ".wbs-subtable{width:100%;border-collapse:collapse;font-size:12px}",
    ".wbs-subtable th{font-size:10px;color:var(--wbs-muted);text-align:left;padding:3px 6px;border-bottom:1px solid var(--wbs-line)}",
    ".wbs-subtable td{padding:5px 6px;border-bottom:1px solid color-mix(in srgb,var(--wbs-line) 45%,transparent);word-break:break-all}",
    ".wbs-dirpath{line-height:1.7}",
    ".wbs-empty{text-align:center;padding:52px 12px;color:var(--wbs-muted)}",
    ".wbs-empty b{display:block;color:inherit;font-size:14px;margin-bottom:6px}",
    ".wbs-pager{display:flex;align-items:center;gap:8px;justify-content:flex-end;padding:2px 0;font-size:12px;color:var(--wbs-muted);flex-wrap:wrap}",
    ".wbs-pager select{border:1px solid var(--wbs-line);border-radius:6px;background:transparent;color:inherit;font:inherit;padding:4px 6px}",
    ".wbs-loading{padding:24px;text-align:center;color:var(--wbs-muted);font-size:12px}",
    ".wbs-error{padding:10px 12px;border:1px solid color-mix(in srgb,var(--dsw-alias-state-error-primary,#bd3b32) 30%,transparent);background:color-mix(in srgb,var(--dsw-alias-state-error-primary,#bd3b32) 6%,transparent);border-radius:8px;color:var(--dsw-alias-state-error-primary,#a4312a);font-size:12px}",
    ".wbs-toast{position:fixed;left:50%;bottom:38px;transform:translateX(-50%);z-index:1200;background:var(--dsw-alias-toast-bg,#26302d);color:var(--dsw-alias-toast-label,#fff);border-radius:8px;padding:8px 14px;font-size:12px;box-shadow:0 8px 24px rgba(0,0,0,.22);max-width:80vw}",
    ".wbs-toast.err{background:var(--dsw-alias-state-error-primary,#9d332b)}",
    ".wbs-mask{position:fixed;inset:0;z-index:900;background:rgba(24,28,26,.34);display:flex;align-items:center;justify-content:center;padding:22px}",
    ".wbs-modal{width:min(700px,96vw);max-height:88vh;overflow:auto;background:var(--dsw-alias-bg-layer-1,#fffdf7);border:1px solid var(--wbs-line);border-radius:14px;box-shadow:0 24px 70px rgba(0,0,0,.24);padding:18px}",
    ".wbs-modal.small{width:min(430px,94vw)}",
    ".wbs-modal-title{display:flex;align-items:center;gap:8px;font-size:16px;font-weight:650;margin-bottom:4px}",
    ".wbs-modal-sub{font-size:12px;color:var(--wbs-muted);margin-bottom:14px;line-height:1.6}",
    ".wbs-steps{display:flex;gap:6px;margin:2px 0 16px;flex-wrap:wrap}",
    ".wbs-step{font-size:11px;color:var(--wbs-muted);padding:4px 8px;border-radius:999px;border:1px solid transparent}",
    ".wbs-step.on{color:var(--wbs-accent);border-color:color-mix(in srgb,var(--wbs-accent) 30%,transparent);background:color-mix(in srgb,var(--wbs-accent) 8%,transparent);font-weight:600}",
    ".wbs-label{font-size:12px;font-weight:600;margin:12px 0 5px;display:block}",
    ".wbs-input,.wbs-textarea,.wbs-select{width:100%;box-sizing:border-box;border:1px solid var(--wbs-line);border-radius:8px;background:color-mix(in srgb,var(--dsw-alias-bg-layer-1,#fff) 55%,transparent);color:inherit;font:inherit;font-size:13px;padding:8px 9px;outline:0}",
    ".wbs-input:focus,.wbs-textarea:focus{border-color:var(--wbs-accent)}",
    ".wbs-textarea{min-height:70px;resize:vertical;line-height:1.6}",
    ".wbs-linkrow{display:grid;grid-template-columns:1fr 1.5fr auto auto;gap:6px;align-items:center;margin-bottom:6px}",
    ".wbs-linkrow .wbs-input{font-size:12px;padding:6px 8px}",
    ".wbs-radio{display:flex;align-items:center;gap:4px;font-size:11px;white-space:nowrap;color:var(--wbs-muted);cursor:pointer}",
    ".wbs-dirlist{border:1px solid var(--wbs-line);border-radius:9px;max-height:300px;overflow:auto;padding:5px}",
    ".wbs-dircheck{display:flex;align-items:center;gap:6px;padding:5px 6px;border-radius:6px;cursor:pointer;font-size:12px}",
    ".wbs-dircheck:hover{background:var(--wbs-soft)}",
    ".wbs-dircheck input{margin:0}",
    ".wbs-tagsearch{display:flex;gap:6px;align-items:center}",
    ".wbs-tagresults{border:1px solid var(--wbs-line);border-radius:9px;max-height:190px;overflow:auto;margin-top:7px;padding:4px}",
    ".wbs-tagresult{width:100%;text-align:left;border:0;background:transparent;color:inherit;padding:6px;border-radius:6px;cursor:pointer;font:inherit;font-size:12px}",
    ".wbs-tagresult:hover{background:var(--wbs-soft)}",
    ".wbs-tagresult.on{background:color-mix(in srgb,var(--wbs-accent) 10%,transparent);color:var(--wbs-accent)}",
    ".wbs-chips{display:flex;flex-wrap:wrap;gap:5px;margin-top:7px;min-height:10px}",
    ".wbs-formfoot{display:flex;align-items:center;gap:8px;margin-top:18px;padding-top:14px;border-top:1px solid var(--wbs-line)}",
    ".wbs-formerr{color:var(--dsw-alias-state-error-primary,#b5392f);font-size:12px;flex:1;min-width:0}",
    ".wbs-note{font-size:11px;color:var(--wbs-muted);line-height:1.6}",
    "@media(max-width:860px){.wbs-body{flex-direction:column}.wbs-tree{width:100%;max-height:220px}.wbs-table{min-width:760px}.wbs-root{min-height:0}}",
    "@media(max-width:600px){.wbs-head h2{font-size:18px}.wbs-linkrow{grid-template-columns:1fr 1fr}.wbs-modal{padding:14px}}"
  ].join("\n");
  function injectCss() {
    var id = "wb-addon-sites-css";
    var el = document.getElementById(id);
    if (!el) {
      el = document.createElement("style");
      el.id = id;
      document.head.appendChild(el);
    }
    if (el.textContent !== cssText) el.textContent = cssText;
  }
  function errText(e) {
    if (!e) return "\u672A\u77E5\u9519\u8BEF";
    return String(e.message || e);
  }
  function callApi(api, name, args) {
    return api.call(name, args || {}).then(function(r) {
      if (!r || r.ok !== true) throw new Error(r && r.error || "\u8BF7\u6C42\u5931\u8D25");
      return r.result;
    });
  }
  function pathLabel(path) {
    return (path || []).map(function(p) {
      return p.name;
    }).join(" / ");
  }
  function flattenTree(nodes, depth, out) {
    out = out || [];
    (nodes || []).forEach(function(node) {
      out.push({ node, depth: depth || 0 });
      if (node.children && node.children.length) flattenTree(node.children, (depth || 0) + 1, out);
    });
    return out;
  }
  function Modal(props) {
    return h2("div", {
      className: "wbs-mask",
      onMouseDown: function(e) {
        if (e.target === e.currentTarget && props.onClose) props.onClose();
      }
    }, h2("div", { className: "wbs-modal" + (props.small ? " small" : "") }, props.children));
  }
  function SiteFormModal(props) {
    var api = props.api;
    var lang = props.lang || "zh";
    var mode = props.mode;
    var site = props.site;
    var current = props.current || { id: "0", path: [] };
    var tagOn = !!props.tagOn;
    var maxStep = tagOn ? 2 : 1;
    var [step, setStep] = useState(0);
    var [name, setName] = useState(site ? site.siteName : "");
    var [desc, setDesc] = useState(site ? site.description : "");
    var [links, setLinks] = useState(function() {
      if (site && site.siteLinks && site.siteLinks.length) {
        return site.siteLinks.map(function(l) {
          return { description: l.description || "", link: l.link || "" };
        });
      }
      return [{ description: "", link: "" }];
    });
    var [defaultIdx, setDefaultIdx] = useState(function() {
      if (site && site.siteLinks) {
        var idx = site.siteLinks.findIndex(function(l) {
          return l.isDefault;
        });
        if (idx >= 0) return idx;
      }
      return 0;
    });
    var [dirTree, setDirTree] = useState([]);
    var [dirIds, setDirIds] = useState(function() {
      if (site && site.dirs && site.dirs.length) return site.dirs.map(function(d) {
        return d.id;
      });
      return current.id !== "0" ? [current.id] : [];
    });
    var [tags, setTags] = useState(site && site.tags ? site.tags.slice() : []);
    var [tagQuery, setTagQuery] = useState("");
    var [tagResults, setTagResults] = useState([]);
    var [error, setError] = useState("");
    var [saving, setSaving] = useState(false);
    useEffect(function() {
      callApi(api, "siteNodes.tree").then(function(rows) {
        setDirTree(rows || []);
      }).catch(function(e) {
        setError(errText(e));
      });
    }, []);
    useEffect(function() {
      if (!tagOn) {
        setTagResults([]);
        return;
      }
      var alive = true;
      var timer = setTimeout(function() {
        callApi(api, "siteTags.search", { text: tagQuery, pageSize: 50 }).then(function(r) {
          if (alive) setTagResults(r.records || []);
        }).catch(function() {
          if (alive) setTagResults([]);
        });
      }, 220);
      return function() {
        alive = false;
        clearTimeout(timer);
      };
    }, [tagQuery, tagOn]);
    var flatDirs = useMemo2(function() {
      return flattenTree(dirTree, 0);
    }, [dirTree]);
    function toggleDir(id) {
      setDirIds(function(prev) {
        if (prev.indexOf(id) >= 0) return prev.filter(function(x) {
          return x !== id;
        });
        return prev.concat([id]);
      });
    }
    function toggleTag(tag) {
      setTags(function(prev) {
        if (prev.some(function(x) {
          return x.id === tag.id;
        })) {
          return prev.filter(function(x) {
            return x.id !== tag.id;
          });
        }
        return prev.concat([tag]);
      });
    }
    function updateLink(index, key, value) {
      setLinks(function(prev) {
        return prev.map(function(l, i) {
          return i === index ? Object.assign({}, l, { [key]: value }) : l;
        });
      });
    }
    function addLink() {
      setLinks(function(prev) {
        return prev.concat([{ description: "", link: "" }]);
      });
    }
    function removeLink(index) {
      setLinks(function(prev) {
        var next2 = prev.filter(function(_, i) {
          return i !== index;
        });
        return next2.length ? next2 : [{ description: "", link: "" }];
      });
      if (defaultIdx === index) setDefaultIdx(0);
      else if (defaultIdx > index) setDefaultIdx(defaultIdx - 1);
    }
    function validate(toStep) {
      if (toStep >= 1 && !String(name).trim()) {
        setError(text(lang, "requiredName"));
        return false;
      }
      if (toStep >= 2 && !dirIds.length) {
        setError(text(lang, "requiredDirs"));
        return false;
      }
      setError("");
      return true;
    }
    function next() {
      if (step >= maxStep) return;
      if (!validate(step + 1)) return;
      setStep(step + 1);
    }
    function save() {
      if (!validate(2)) return;
      setSaving(true);
      setError("");
      var siteLinks = links.filter(function(l) {
        return String(l.link || "").trim() || String(l.description || "").trim();
      }).map(function(l, i) {
        return { description: String(l.description || "").trim(), link: String(l.link || "").trim(), isDefault: i === defaultIdx };
      });
      var payload = {
        siteName: String(name).trim(),
        description: String(desc || "").trim(),
        siteLinks,
        dirIds
      };
      if (tagOn) payload.tagIds = tags.map(function(t) {
        return t.id;
      });
      var p;
      if (mode === "edit" && site) {
        p = callApi(api, "sites.update", Object.assign({ id: site.id }, payload));
      } else {
        p = callApi(api, "sites.create", payload);
      }
      p.then(function() {
        setSaving(false);
        props.onSaved();
      }).catch(function(e) {
        setSaving(false);
        setError(errText(e));
      });
    }
    var steps = tagOn ? [text(lang, "step1"), text(lang, "step2"), text(lang, "step3")] : [text(lang, "step1"), text(lang, "step2")];
    var title = mode === "edit" ? text(lang, "editTitle") : text(lang, "createTitle");
    return h2(
      Modal,
      { onClose: saving ? null : props.onClose },
      h2("div", { className: "wbs-modal-title" }, title),
      h2("div", { className: "wbs-steps" }, steps.map(function(s, i) {
        return h2("span", { key: i, className: "wbs-step" + (i === step ? " on" : "") }, i + 1 + " \xB7 " + s);
      })),
      step === 0 ? h2(
        "div",
        null,
        h2("label", { className: "wbs-label" }, text(lang, "siteName")),
        h2("input", {
          className: "wbs-input",
          value: name,
          autoFocus: true,
          placeholder: text(lang, "siteNamePh"),
          onChange: function(e) {
            setName(e.target.value);
          }
        }),
        h2("label", { className: "wbs-label" }, text(lang, "desc")),
        h2("textarea", {
          className: "wbs-textarea",
          value: desc,
          placeholder: text(lang, "descPh"),
          onChange: function(e) {
            setDesc(e.target.value);
          }
        }),
        h2("label", { className: "wbs-label" }, text(lang, "linkList")),
        links.map(function(l, i) {
          return h2(
            "div",
            { className: "wbs-linkrow", key: i },
            h2("input", {
              className: "wbs-input",
              value: l.description,
              placeholder: text(lang, "linkDesc"),
              onChange: function(e) {
                updateLink(i, "description", e.target.value);
              }
            }),
            h2("input", {
              className: "wbs-input",
              value: l.link,
              placeholder: text(lang, "linkUrl"),
              onChange: function(e) {
                updateLink(i, "link", e.target.value);
              }
            }),
            h2(
              "label",
              { className: "wbs-radio", title: text(lang, "setDefault") },
              h2("input", {
                type: "radio",
                name: "wbs-default-link",
                checked: defaultIdx === i,
                onChange: function() {
                  setDefaultIdx(i);
                }
              }),
              text(lang, "default")
            ),
            h2("button", { type: "button", className: "wbs-mini", onClick: function() {
              removeLink(i);
            } }, text(lang, "removeLink"))
          );
        }),
        h2("button", { type: "button", className: "wbs-btn sm", onClick: addLink }, text(lang, "addLink"))
      ) : null,
      step === 1 ? h2(
        "div",
        null,
        h2("div", { className: "wbs-label" }, text(lang, "chooseDirs")),
        !flatDirs.length ? h2("div", { className: "wbs-note" }, text(lang, "noDirs")) : h2(
          "div",
          { className: "wbs-dirlist" },
          flatDirs.map(function(item) {
            var id = String(item.node.id);
            return h2(
              "label",
              {
                key: id,
                className: "wbs-dircheck",
                style: { paddingLeft: 6 + item.depth * 16 }
              },
              h2("input", {
                type: "checkbox",
                checked: dirIds.indexOf(id) >= 0,
                onChange: function() {
                  toggleDir(id);
                }
              }),
              h2("span", null, item.node.name)
            );
          })
        ),
        h2("div", { className: "wbs-note", style: { marginTop: 8 } }, "\u7AD9\u70B9\u53EF\u540C\u65F6\u6302\u5728\u591A\u4E2A\u76EE\u5F55\u4E0B\uFF1B\u5217\u8868\u4F1A\u6309\u76EE\u5F55\u5B50\u6811\u8FC7\u6EE4\u3002")
      ) : null,
      tagOn && step === 2 ? h2(
        "div",
        null,
        h2("div", { className: "wbs-label" }, text(lang, "chooseTags")),
        tags.length ? h2("div", { className: "wbs-chips" }, tags.map(function(t) {
          return h2(
            "span",
            { className: "wbs-chip", key: t.id },
            t.name,
            h2("button", { type: "button", onClick: function() {
              toggleTag(t);
            }, title: "\u79FB\u9664" }, h2(Icon2, { name: "x", size: 12 }))
          );
        })) : h2("div", { className: "wbs-note" }, "\u6682\u672A\u9009\u62E9\u6807\u7B7E"),
        h2(
          "div",
          { className: "wbs-tagsearch", style: { marginTop: 10 } },
          h2("input", {
            className: "wbs-input",
            value: tagQuery,
            placeholder: text(lang, "tagSearch"),
            onChange: function(e) {
              setTagQuery(e.target.value);
            }
          })
        ),
        h2("div", { className: "wbs-tagresults" }, tagResults.length ? tagResults.map(function(t) {
          var on = tags.some(function(x) {
            return x.id === t.id;
          });
          return h2("button", {
            key: t.id,
            type: "button",
            className: "wbs-tagresult" + (on ? " on" : ""),
            onClick: function() {
              toggleTag(t);
            }
          }, (on ? "\u2713 " : "\uFF0B ") + t.name);
        }) : h2("div", { className: "wbs-note", style: { padding: 6 } }, text(lang, "noTags"))),
        h2("div", { className: "wbs-note", style: { marginTop: 8 } }, "\u6807\u7B7E\u7531\u6807\u7B7E\u5B50\u63D2\u4EF6\u63D0\u4F9B\uFF0C\u53EF\u591A\u9009\u3002")
      ) : null,
      h2(
        "div",
        { className: "wbs-formfoot" },
        h2("div", { className: "wbs-formerr" }, error || ""),
        step > 0 ? h2("button", { type: "button", className: "wbs-btn", disabled: saving, onClick: function() {
          setStep(step - 1);
        } }, text(lang, "back")) : null,
        h2("button", { type: "button", className: "wbs-btn", disabled: saving, onClick: props.onClose }, text(lang, "cancel")),
        step < maxStep ? h2("button", { type: "button", className: "wbs-btn primary", onClick: next }, text(lang, "nextStep")) : h2("button", { type: "button", className: "wbs-btn primary", disabled: saving, onClick: save }, saving ? text(lang, "saving") : text(lang, "save"))
      )
    );
  }
  function DirModal(props) {
    var api = props.api;
    var lang = props.lang || "zh";
    var dlg = props.dlg;
    var [name, setName] = useState(dlg.name || "");
    var [error, setError] = useState("");
    var [saving, setSaving] = useState(false);
    var isDelete = dlg.mode === "delete";
    var title = isDelete ? text(lang, "removeDirTitle") : dlg.mode === "rename" ? text(lang, "renameTitle") : text(lang, "addDir");
    function submit() {
      if (!isDelete && !String(name).trim()) {
        setError(text(lang, "requiredName"));
        return;
      }
      setSaving(true);
      setError("");
      var p;
      if (isDelete) p = callApi(api, "siteNodes.delete", { id: dlg.id });
      else if (dlg.mode === "rename") p = callApi(api, "siteNodes.rename", { id: dlg.id, name: String(name).trim() });
      else p = callApi(api, "siteNodes.create", { parentId: dlg.parentId || "0", name: String(name).trim() });
      p.then(function() {
        setSaving(false);
        props.onDone();
      }).catch(function(e) {
        setSaving(false);
        setError(errText(e));
      });
    }
    return h2(
      Modal,
      { small: true, onClose: saving ? null : props.onClose },
      h2("div", { className: "wbs-modal-title" }, title),
      isDelete ? h2("div", { className: "wbs-modal-sub" }, text(lang, "removeDirText", { name: dlg.name || "" })) : h2(
        "div",
        null,
        h2("label", { className: "wbs-label" }, text(lang, "dirName")),
        h2("input", {
          className: "wbs-input",
          value: name,
          autoFocus: true,
          placeholder: "\u672A\u547D\u540D",
          onChange: function(e) {
            setName(e.target.value);
          },
          onKeyDown: function(e) {
            if (e.key === "Enter") submit();
          }
        })
      ),
      h2(
        "div",
        { className: "wbs-formfoot" },
        h2("div", { className: "wbs-formerr" }, error || ""),
        h2("button", { className: "wbs-btn", disabled: saving, onClick: props.onClose }, text(lang, "cancel")),
        h2(
          "button",
          { className: "wbs-btn primary" + (isDelete ? " danger" : ""), disabled: saving, onClick: submit },
          saving ? "\u2026" : isDelete ? text(lang, "confirm") : dlg.mode === "rename" ? text(lang, "save") : text(lang, "create")
        )
      )
    );
  }
  function DeleteSiteModal(props) {
    var api = props.api;
    var lang = props.lang || "zh";
    var site = props.site;
    var [saving, setSaving] = useState(false);
    var [error, setError] = useState("");
    function submit() {
      setSaving(true);
      setError("");
      callApi(api, "sites.delete", { id: site.id }).then(function() {
        setSaving(false);
        props.onDone();
      }).catch(function(e) {
        setSaving(false);
        setError(errText(e));
      });
    }
    return h2(
      Modal,
      { small: true, onClose: saving ? null : props.onClose },
      h2("div", { className: "wbs-modal-title" }, text(lang, "deleteTitle")),
      h2("div", { className: "wbs-modal-sub" }, text(lang, "deleteText", { name: site.siteName })),
      error ? h2("div", { className: "wbs-error" }, error) : null,
      h2(
        "div",
        { className: "wbs-formfoot" },
        h2("div", { className: "wbs-grow" }),
        h2("button", { className: "wbs-btn", disabled: saving, onClick: props.onClose }, text(lang, "cancel")),
        h2("button", { className: "wbs-btn danger", disabled: saving, onClick: submit }, saving ? "\u2026" : text(lang, "confirm"))
      )
    );
  }
  function SitesView(props) {
    var api = props.api;
    var lang = props.lang || "zh";
    var [kids, setKids] = useState({});
    var kidsRef = useRef({});
    var [expanded, setExpanded] = useState({});
    var [current, setCurrent] = useState({ id: "0", path: [] });
    var [sites, setSites] = useState([]);
    var [total, setTotal] = useState(0);
    var [page, setPage] = useState(1);
    var [pageSize, setPageSize] = useState(16);
    var [textQuery, setTextQuery] = useState("");
    var [searchInput, setSearchInput] = useState("");
    var [tagFilter, setTagFilter] = useState([]);
    var [allTags, setAllTags] = useState([]);
    var [tagMenu, setTagMenu] = useState(false);
    var [tagOn, setTagOn] = useState(false);
    var tagOnRef = useRef(false);
    var [sortCol, setSortCol] = useState("update_time");
    var [sortOrder, setSortOrder] = useState("desc");
    var [loading, setLoading] = useState(false);
    var [error, setError] = useState("");
    var [tick, setTick] = useState(0);
    var [expandedRow, setExpandedRow] = useState(null);
    var [selected, setSelected] = useState({});
    var [editing, setEditing] = useState(null);
    var [dirDlg, setDirDlg] = useState(null);
    var [deleting, setDeleting] = useState(null);
    var [toast, setToast] = useState(null);
    var dragRef = useRef("");
    var tagKey = tagFilter.slice().sort().join(",");
    function showToast(msg, kind) {
      setToast({ msg, kind: kind || "" });
    }
    useEffect(function() {
      if (!toast) return;
      var timer = setTimeout(function() {
        setToast(null);
      }, 2600);
      return function() {
        clearTimeout(timer);
      };
    }, [toast]);
    function refreshTree() {
      return callApi(api, "siteNodes.children", { id: 0 }).then(function(root) {
        var map = { "0": root || [] };
        var ids = Object.keys(kidsRef.current).filter(function(id) {
          return id !== "0";
        });
        return Promise.all(ids.map(function(id) {
          return callApi(api, "siteNodes.children", { id }).then(function(rows) {
            map[id] = rows || [];
          }).catch(function() {
          });
        })).then(function() {
          kidsRef.current = map;
          setKids(map);
        });
      }).catch(function(e) {
        showToast(text(lang, "loadFail", { msg: errText(e) }), "err");
      });
    }
    function loadChildren(id) {
      return callApi(api, "siteNodes.children", { id }).then(function(rows) {
        var map = Object.assign({}, kidsRef.current);
        map[id] = rows || [];
        kidsRef.current = map;
        setKids(map);
      });
    }
    function loadAllTags() {
      if (!tagOnRef.current) return Promise.resolve([]);
      return callApi(api, "siteTags.search", { pageSize: 100 }).then(function(r) {
        setAllTags(r.records || []);
      }).catch(function() {
      });
    }
    useEffect(function() {
      refreshTree();
      callApi(api, "sites.capabilities").then(function(r) {
        var on = !!(r && r.tags) && hostHasAddon("wb-addon-tags");
        tagOnRef.current = on;
        setTagOn(on);
        if (!on) {
          setTagFilter([]);
          setTagMenu(false);
        } else {
          loadAllTags();
        }
      }).catch(function() {
        tagOnRef.current = false;
        setTagOn(false);
      });
    }, []);
    useEffect(function() {
      var off = api.subscribe(function(msg) {
        if (!msg) return;
        if (msg.event === "sites-changed") setTick(function(x) {
          return x + 1;
        });
        if (msg.event === "tags-changed") loadAllTags();
        if (msg.event === "site-nodes-changed") {
          setTick(function(x) {
            return x + 1;
          });
          refreshTree();
        }
      });
      return function() {
        if (typeof off === "function") off();
      };
    }, []);
    useEffect(function() {
      var alive = true;
      setLoading(true);
      setError("");
      callApi(api, "sites.list", {
        nodeId: current.id,
        text: textQuery,
        tagIds: tagFilter,
        pageNumber: page,
        pageSize,
        sortColumn: sortCol,
        sortOrder
      }).then(function(r) {
        if (!alive) return;
        setSites(r.records || []);
        setTotal(Number(r.total || 0));
      }).catch(function(e) {
        if (!alive) return;
        setSites([]);
        setTotal(0);
        setError(text(lang, "loadFail", { msg: errText(e) }));
      }).finally(function() {
        if (alive) setLoading(false);
      });
      return function() {
        alive = false;
      };
    }, [current.id, textQuery, tagKey, page, pageSize, sortCol, sortOrder, tick]);
    useEffect(function() {
      if (current.id === "0") return;
      var alive = true;
      callApi(api, "siteNodes.path", { id: current.id }).then(function(rows) {
        if (!alive) return;
        if (!rows || !rows.length) {
          setCurrent({ id: "0", path: [] });
          return;
        }
        setCurrent({ id: current.id, path: rows });
      }).catch(function() {
      });
      return function() {
        alive = false;
      };
    }, [current.id, tick]);
    function selectDir(id) {
      if (id === "0") {
        setCurrent({ id: "0", path: [] });
        setPage(1);
        return;
      }
      callApi(api, "siteNodes.path", { id }).then(function(rows) {
        if (!rows || !rows.length) return;
        setCurrent({ id, path: rows });
        setPage(1);
      }).catch(function(e) {
        showToast(text(lang, "opFail", { msg: errText(e) }), "err");
      });
    }
    function toggleNode(node) {
      var open = !!expanded[node.id];
      if (!open && !Object.prototype.hasOwnProperty.call(kidsRef.current, node.id)) {
        loadChildren(node.id).catch(function(e) {
          showToast(errText(e), "err");
        });
      }
      setExpanded(function(prev) {
        var next = Object.assign({}, prev);
        if (open) delete next[node.id];
        else next[node.id] = true;
        return next;
      });
    }
    function onDropNode(e, target) {
      e.preventDefault();
      e.stopPropagation();
      var sourceId = dragRef.current;
      dragRef.current = "";
      if (!sourceId || sourceId === target.id) return;
      var moveType = expanded[target.id] ? 0 : 2;
      callApi(api, "siteNodes.move", { sourceId, targetId: target.id, moveType }).then(function() {
        showToast(text(lang, "moved"));
        refreshTree();
        setTick(function(x) {
          return x + 1;
        });
      }).catch(function(e2) {
        showToast(text(lang, "opFail", { msg: errText(e2) }), "err");
      });
    }
    function renderNode(node, depth) {
      var open = !!expanded[node.id];
      var list = kids[node.id] || [];
      return h2(
        "div",
        { key: node.id },
        h2(
          "div",
          {
            className: "wbs-node" + (current.id === String(node.id) ? " active" : ""),
            style: { paddingLeft: 4 + depth * 14 },
            draggable: true,
            onDragStart: function(e) {
              dragRef.current = String(node.id);
              e.dataTransfer.effectAllowed = "move";
            },
            onDragOver: function(e) {
              e.preventDefault();
            },
            onDrop: function(e) {
              onDropNode(e, node);
            }
          },
          h2("span", { className: "wbs-caret", onClick: function(e) {
            e.stopPropagation();
            toggleNode(node);
          } }, open ? "\u25BE" : "\u25B8"),
          h2("span", { className: "wbs-node-name", onClick: function() {
            selectDir(String(node.id));
          }, title: node.name }, node.name),
          h2(
            "span",
            { className: "wbs-node-actions" },
            h2("button", { className: "wbs-mini", title: text(lang, "addChild"), onClick: function(e) {
              e.stopPropagation();
              setDirDlg({ mode: "create", parentId: String(node.id), name: "" });
            } }, h2(Icon2, { name: "plus", size: 13 })),
            h2("button", { className: "wbs-mini", title: text(lang, "rename"), onClick: function(e) {
              e.stopPropagation();
              setDirDlg({ mode: "rename", id: String(node.id), name: node.name });
            } }, h2(Icon2, { name: "edit", size: 13 })),
            h2("button", { className: "wbs-mini", title: text(lang, "remove"), onClick: function(e) {
              e.stopPropagation();
              setDirDlg({ mode: "delete", id: String(node.id), name: node.name });
            } }, h2(Icon2, { name: "trash", size: 13 }))
          )
        ),
        open ? list.map(function(child) {
          return renderNode(child, depth + 1);
        }) : null
      );
    }
    function openCreate() {
      setEditing({ mode: "create", site: null });
    }
    function openEdit(site) {
      setEditing({ mode: "edit", site });
    }
    function onSaved() {
      setEditing(null);
      showToast(text(lang, "saved"));
      setTick(function(x) {
        return x + 1;
      });
    }
    function onDirDone() {
      var dlg = dirDlg;
      setDirDlg(null);
      setTick(function(x) {
        return x + 1;
      });
      refreshTree();
      if (dlg && dlg.mode === "create") {
        var parentId = String(dlg.parentId || "0");
        setExpanded(function(prev) {
          var next = Object.assign({}, prev);
          next[parentId] = true;
          return next;
        });
        loadChildren(parentId).catch(function() {
        });
      }
      if (dlg && dlg.mode === "delete" && current.path.some(function(p) {
        return String(p.id) === String(dlg.id);
      })) {
        setCurrent({ id: "0", path: [] });
      }
    }
    function onSiteDeleted() {
      setDeleting(null);
      showToast(text(lang, "deleted"));
      setTick(function(x) {
        return x + 1;
      });
      refreshTree();
    }
    function toggleSelected(id) {
      setSelected(function(prev) {
        var next = Object.assign({}, prev);
        if (next[id]) delete next[id];
        else next[id] = true;
        return next;
      });
    }
    var selectedIds = Object.keys(selected).filter(function(id) {
      return selected[id];
    });
    var allSelected = sites.length > 0 && sites.every(function(s) {
      return selected[s.id];
    });
    function toggleAll() {
      if (allSelected) {
        setSelected(function(prev) {
          var next = Object.assign({}, prev);
          sites.forEach(function(s) {
            delete next[s.id];
          });
          return next;
        });
        return;
      }
      setSelected(function(prev) {
        var next = Object.assign({}, prev);
        sites.forEach(function(s) {
          next[s.id] = true;
        });
        return next;
      });
    }
    function deleteSelected() {
      if (!selectedIds.length) return;
      if (!window.confirm(text(lang, "bulkConfirm", { n: selectedIds.length }))) return;
      var chain = Promise.resolve();
      selectedIds.forEach(function(id) {
        chain = chain.then(function() {
          return callApi(api, "sites.delete", { id });
        });
      });
      chain.then(function() {
        setSelected({});
        setTick(function(x) {
          return x + 1;
        });
        refreshTree();
        showToast(text(lang, "deleted"));
      }).catch(function(e) {
        showToast(text(lang, "opFail", { msg: errText(e) }), "err");
      });
    }
    function sortBy(col) {
      if (sortCol === col) setSortOrder(function(o) {
        return o === "asc" ? "desc" : "asc";
      });
      else {
        setSortCol(col);
        setSortOrder("desc");
      }
      setPage(1);
    }
    function arrow(col) {
      if (sortCol !== col) return "";
      return sortOrder === "asc" ? " \u2191" : " \u2193";
    }
    var pages = Math.max(1, Math.ceil(total / pageSize));
    var tagsVisible = tagOn && hostHasAddon("wb-addon-tags");
    var colCount = tagsVisible ? 6 : 5;
    return h2(
      "div",
      { className: "wbs-root" },
      h2(
        "div",
        { className: "wbs-head" },
        h2("h2", null, text(lang, "title")),
        h2("span", { className: "wbs-count" }, text(lang, "total", { n: total })),
        h2("div", { className: "wbs-grow" }),
        h2("button", { className: "wbs-btn primary", onClick: openCreate }, text(lang, "newSite"))
      ),
      h2(
        "div",
        { className: "wbs-body" },
        h2(
          "aside",
          { className: "wbs-tree" },
          h2(
            "div",
            { className: "wbs-tree-top" },
            h2("span", { className: "wbs-tree-title" }, text(lang, "directory")),
            h2("button", { className: "wbs-mini", title: text(lang, "addDir"), onClick: function() {
              setDirDlg({ mode: "create", parentId: "0", name: "" });
            } }, h2(Icon2, { name: "folder-plus", size: 13 })),
            h2("button", { className: "wbs-mini", title: text(lang, "refresh"), onClick: refreshTree }, h2(Icon2, { name: "refresh", size: 13 }))
          ),
          h2(
            "div",
            {
              className: "wbs-node" + (current.id === "0" ? " active" : ""),
              style: { paddingLeft: 4 }
            },
            h2("span", { className: "wbs-caret" }, "\u25BE"),
            h2("span", { className: "wbs-node-name", onClick: function() {
              selectDir("0");
            } }, text(lang, "all")),
            h2(
              "span",
              { className: "wbs-node-actions" },
              h2("button", { className: "wbs-mini", title: text(lang, "addDir"), onClick: function(e) {
                e.stopPropagation();
                setDirDlg({ mode: "create", parentId: "0", name: "" });
              } }, h2(Icon2, { name: "folder-plus", size: 13 }))
            )
          ),
          (kids["0"] || []).map(function(node) {
            return renderNode(node, 1);
          })
        ),
        h2(
          "section",
          { className: "wbs-main" },
          h2(
            "div",
            { className: "wbs-crumbs" },
            h2("button", { className: "wbs-crumb" + (current.id === "0" ? " cur" : ""), onClick: function() {
              selectDir("0");
            } }, text(lang, "all")),
            (current.path || []).map(function(p, i) {
              return h2(
                React2.Fragment,
                { key: String(p.id) },
                h2("span", { className: "wbs-sep" }, "\u203A"),
                h2("button", {
                  className: "wbs-crumb" + (i === current.path.length - 1 ? " cur" : ""),
                  onClick: function() {
                    setCurrent({ id: String(p.id), path: current.path.slice(0, i + 1) });
                    setPage(1);
                  }
                }, p.name)
              );
            })
          ),
          h2(
            "div",
            { className: "wbs-toolbar" },
            h2(
              "div",
              { className: "wbs-search" },
              h2("input", {
                value: searchInput,
                placeholder: text(lang, "search"),
                onChange: function(e) {
                  setSearchInput(e.target.value);
                },
                onKeyDown: function(e) {
                  if (e.key === "Enter") {
                    setTextQuery(searchInput.trim());
                    setPage(1);
                  }
                }
              }),
              h2("button", { title: "\u641C\u7D22", onClick: function() {
                setTextQuery(searchInput.trim());
                setPage(1);
              } }, h2(Icon2, { name: "search", size: 14 })),
              searchInput ? h2("button", { title: "\u6E05\u7A7A", onClick: function() {
                setSearchInput("");
                setTextQuery("");
                setPage(1);
              } }, h2(Icon2, { name: "x", size: 14 })) : null
            ),
            tagsVisible ? h2(
              "div",
              { className: "wbs-tagfilter" },
              h2("button", {
                className: "wbs-btn",
                onClick: function() {
                  setTagMenu(!tagMenu);
                }
              }, text(lang, "tagFilter") + (tagFilter.length ? " \xB7 " + tagFilter.length : "") + " \u25BE"),
              tagMenu ? h2(
                "div",
                { className: "wbs-tagmenu" },
                h2(
                  "div",
                  { className: "wbs-tagmenu-head" },
                  h2("span", null, text(lang, "allTags")),
                  h2("span", { className: "wbs-grow" }),
                  h2("button", { className: "wbs-mini", onClick: function() {
                    setTagFilter([]);
                    setPage(1);
                  } }, text(lang, "clear"))
                ),
                allTags.length ? allTags.map(function(t) {
                  var on = tagFilter.indexOf(t.id) >= 0;
                  return h2(
                    "label",
                    { key: t.id, className: "wbs-tagopt" },
                    h2("input", {
                      type: "checkbox",
                      checked: on,
                      onChange: function() {
                        setTagFilter(function(prev) {
                          return on ? prev.filter(function(x) {
                            return x !== t.id;
                          }) : prev.concat([t.id]);
                        });
                        setPage(1);
                      }
                    }),
                    h2("span", null, t.name)
                  );
                }) : h2("div", { className: "wbs-note", style: { padding: 6 } }, "\u6682\u65E0\u6807\u7B7E")
              ) : null
            ) : null,
            h2("div", { className: "wbs-grow" }),
            selectedIds.length ? h2("button", { className: "wbs-btn danger", onClick: deleteSelected }, text(lang, "deleteSelected") + " (" + selectedIds.length + ")") : null
          ),
          error ? h2("div", { className: "wbs-error" }, error) : null,
          h2(
            "div",
            { className: "wbs-tablewrap" },
            h2(
              "table",
              { className: "wbs-table" },
              h2(
                "colgroup",
                null,
                h2("col", { style: { width: 34 } }),
                h2("col", null),
                tagsVisible ? h2("col", { style: { width: 150 } }) : null,
                h2("col", { style: { width: 112 } }),
                h2("col", { style: { width: 112 } }),
                h2("col", { style: { width: 190 } })
              ),
              h2(
                "thead",
                null,
                h2(
                  "tr",
                  null,
                  h2("th", null, h2("input", { type: "checkbox", checked: allSelected, onChange: toggleAll, "aria-label": "\u5168\u9009" })),
                  h2("th", null, text(lang, "siteCol")),
                  tagsVisible ? h2("th", null, text(lang, "tagCol")) : null,
                  h2("th", { className: "wbs-th-sort", onClick: function() {
                    sortBy("create_time");
                  } }, text(lang, "createTime") + arrow("create_time")),
                  h2("th", { className: "wbs-th-sort", onClick: function() {
                    sortBy("update_time");
                  } }, text(lang, "updateTime") + arrow("update_time")),
                  h2("th", null, text(lang, "actions"))
                )
              ),
              h2(
                "tbody",
                null,
                loading ? h2("tr", null, h2("td", { colSpan: colCount }, h2("div", { className: "wbs-loading" }, text(lang, "loading")))) : null,
                !loading && !sites.length ? h2("tr", null, h2(
                  "td",
                  { colSpan: colCount },
                  h2(
                    "div",
                    { className: "wbs-empty" },
                    h2("b", null, text(lang, "empty")),
                    h2("span", null, text(lang, "emptyHint"))
                  )
                )) : null,
                !loading ? sites.map(function(s) {
                  var row = h2(
                    "tr",
                    { key: s.id },
                    h2("td", null, h2("input", { type: "checkbox", checked: !!selected[s.id], onChange: function() {
                      toggleSelected(s.id);
                    }, "aria-label": "\u9009\u62E9" })),
                    h2(
                      "td",
                      null,
                      h2("div", { className: "wbs-site-name" }, s.siteName),
                      s.description ? h2("div", { className: "wbs-site-desc" }, s.description) : h2("div", { className: "wbs-site-desc wbs-muted" }, text(lang, "noDesc")),
                      s.defaultLink ? h2("a", { className: "wbs-site-link", href: s.defaultLink, target: "_blank", rel: "noreferrer noopener" }, s.defaultLink) : h2("div", { className: "wbs-site-desc wbs-muted" }, text(lang, "noLink"))
                    ),
                    tagsVisible ? h2("td", null, s.tags && s.tags.length ? s.tags.map(function(t) {
                      return h2("span", { className: "wbs-chip", key: t.id }, t.name);
                    }) : h2("span", { className: "wbs-muted" }, "\u2014")) : null,
                    h2("td", { className: "wbs-muted" }, s.createTime || "\u2014"),
                    h2("td", { className: "wbs-muted" }, s.updateTime || "\u2014"),
                    h2(
                      "td",
                      null,
                      h2(
                        "div",
                        { className: "wbs-actions" },
                        h2("button", { className: "wbs-btn sm", onClick: function() {
                          setExpandedRow(expandedRow && expandedRow.id === s.id && expandedRow.type === "links" ? null : { id: s.id, type: "links" });
                        } }, text(lang, "links") + " " + (s.siteLinks ? s.siteLinks.length : 0)),
                        h2("button", { className: "wbs-btn sm", onClick: function() {
                          setExpandedRow(expandedRow && expandedRow.id === s.id && expandedRow.type === "dirs" ? null : { id: s.id, type: "dirs" });
                        } }, text(lang, "dirs") + " " + (s.dirs ? s.dirs.length : 0)),
                        h2("button", { className: "wbs-btn sm", onClick: function() {
                          openEdit(s);
                        } }, text(lang, "edit")),
                        h2("button", { className: "wbs-btn sm danger", onClick: function() {
                          setDeleting(s);
                        } }, text(lang, "del"))
                      )
                    )
                  );
                  if (!expandedRow || expandedRow.id !== s.id) return row;
                  var detail = expandedRow.type === "links" ? s.siteLinks && s.siteLinks.length ? h2(
                    "table",
                    { className: "wbs-subtable" },
                    h2("thead", null, h2("tr", null, h2("th", null, "\u63CF\u8FF0"), h2("th", null, "\u7F51\u5740"))),
                    h2("tbody", null, s.siteLinks.map(function(l, i) {
                      return h2(
                        "tr",
                        { key: i },
                        h2("td", null, (l.isDefault ? "\u2605 " : "") + (l.description || "\u2014")),
                        h2("td", null, l.link ? h2("a", { href: l.link, target: "_blank", rel: "noreferrer noopener" }, l.link) : "\u2014")
                      );
                    }))
                  ) : h2("div", { className: "wbs-muted" }, text(lang, "noLink")) : s.dirs && s.dirs.length ? h2("div", { className: "wbs-dirpath" }, s.dirs.map(function(d) {
                    return h2("div", { key: d.id }, "\u{1F4C1} " + (d.path || []).map(function(p) {
                      return p.name;
                    }).join(" / "));
                  })) : h2("div", { className: "wbs-muted" }, "\u672A\u5173\u8054\u76EE\u5F55");
                  return h2(
                    React2.Fragment,
                    { key: s.id + ":detail" },
                    row,
                    h2("tr", { className: "wbs-expand" }, h2("td", { colSpan: colCount }, detail))
                  );
                }) : null
              )
            )
          ),
          h2(
            "div",
            { className: "wbs-pager" },
            h2("span", null, "\u5171 " + total + " \u6761 \xB7 \u7B2C " + page + " / " + pages + " \u9875"),
            h2("button", { className: "wbs-btn sm", disabled: page <= 1, onClick: function() {
              setPage(Math.max(1, page - 1));
            } }, text(lang, "prev")),
            h2("button", { className: "wbs-btn sm", disabled: page >= pages, onClick: function() {
              setPage(Math.min(pages, page + 1));
            } }, text(lang, "next")),
            h2("select", {
              value: pageSize,
              onChange: function(e) {
                setPageSize(Number(e.target.value));
                setPage(1);
              }
            }, [16, 30, 50].map(function(n) {
              return h2("option", { key: n, value: n }, n + " / \u9875");
            }))
          )
        )
      ),
      editing ? h2(SiteFormModal, {
        api,
        lang,
        mode: editing.mode,
        site: editing.site,
        current,
        tagOn: tagsVisible,
        onClose: function() {
          setEditing(null);
        },
        onSaved
      }) : null,
      dirDlg ? h2(DirModal, {
        api,
        lang,
        dlg: dirDlg,
        onClose: function() {
          setDirDlg(null);
        },
        onDone: onDirDone
      }) : null,
      deleting ? h2(DeleteSiteModal, {
        api,
        lang,
        site: deleting,
        onClose: function() {
          setDeleting(null);
        },
        onDone: onSiteDeleted
      }) : null,
      toast ? h2("div", { className: "wbs-toast" + (toast.kind === "err" ? " err" : "") }, toast.msg) : null
    );
  }
  injectCss();
  host.registerAddon({
    id: "wb-addon-sites",
    version: "1.3.2",
    views: [
      { id: "sites", title: { zh: "\u7AD9\u70B9", en: "Sites" }, component: SitesView }
    ]
  });
  module.exports = { name: "dsh-workbench-sites", inject: [], apply: function() {
  } };
})();
    return module.exports;
  },
});
