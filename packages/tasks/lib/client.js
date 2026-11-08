// 由 scripts/build-addon-clients.mjs 生成；请修改 client/client.src.cjs 后重新构建。
window.__ModuleLoader__ = window.__ModuleLoader__ || { modules: {}, load: function (m) { this.modules[m.id] = m.factory; } };
window.__ModuleLoader__.load({
  id: "dsh-workbench-tasks",
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

// node_modules/.pnpm/lucide-react@1.70.0_react@19.3.1/node_modules/lucide-react/dist/esm/icons/plus.mjs
var plus_exports = {};
__export(plus_exports, {
  __iconData: () => __iconData,
  default: () => Plus
});
var __iconData, Plus;
var init_plus = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.3.1/node_modules/lucide-react/dist/esm/icons/plus.mjs"() {
    init_createLucideIcon();
    __iconData = {
      name: "plus",
      size: 24,
      node: [
        ["path", { d: "M5 12h14", key: "1ays0h" }],
        ["path", { d: "M12 5v14", key: "s699le" }]
      ]
    };
    __iconData.node;
    Plus = createLucideIcon(__iconData);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.3.1/node_modules/lucide-react/dist/esm/icons/minus.mjs
var minus_exports = {};
__export(minus_exports, {
  __iconData: () => __iconData2,
  default: () => Minus
});
var __iconData2, Minus;
var init_minus = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.3.1/node_modules/lucide-react/dist/esm/icons/minus.mjs"() {
    init_createLucideIcon();
    __iconData2 = {
      name: "minus",
      size: 24,
      node: [["path", { d: "M5 12h14", key: "1ays0h" }]]
    };
    __iconData2.node;
    Minus = createLucideIcon(__iconData2);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.3.1/node_modules/lucide-react/dist/esm/icons/check.mjs
var check_exports = {};
__export(check_exports, {
  __iconData: () => __iconData3,
  default: () => Check
});
var __iconData3, Check;
var init_check = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.3.1/node_modules/lucide-react/dist/esm/icons/check.mjs"() {
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

// node_modules/.pnpm/lucide-react@1.70.0_react@19.3.1/node_modules/lucide-react/dist/esm/icons/square.mjs
var square_exports = {};
__export(square_exports, {
  __iconData: () => __iconData4,
  default: () => Square
});
var __iconData4, Square;
var init_square = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.3.1/node_modules/lucide-react/dist/esm/icons/square.mjs"() {
    init_createLucideIcon();
    __iconData4 = {
      name: "square",
      size: 24,
      node: [["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" }]]
    };
    __iconData4.node;
    Square = createLucideIcon(__iconData4);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.3.1/node_modules/lucide-react/dist/esm/icons/rotate-ccw.mjs
var rotate_ccw_exports = {};
__export(rotate_ccw_exports, {
  __iconData: () => __iconData5,
  default: () => RotateCcw
});
var __iconData5, RotateCcw;
var init_rotate_ccw = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.3.1/node_modules/lucide-react/dist/esm/icons/rotate-ccw.mjs"() {
    init_createLucideIcon();
    __iconData5 = {
      name: "rotate-ccw",
      size: 24,
      node: [
        ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", key: "1357e3" }],
        ["path", { d: "M3 3v5h5", key: "1xhq8a" }]
      ]
    };
    __iconData5.node;
    RotateCcw = createLucideIcon(__iconData5);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.3.1/node_modules/lucide-react/dist/esm/icons/list-tree.mjs
var list_tree_exports = {};
__export(list_tree_exports, {
  __iconData: () => __iconData6,
  default: () => ListTree
});
var __iconData6, ListTree;
var init_list_tree = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.3.1/node_modules/lucide-react/dist/esm/icons/list-tree.mjs"() {
    init_createLucideIcon();
    __iconData6 = {
      name: "list-tree",
      size: 24,
      node: [
        ["path", { d: "M8 5h13", key: "1pao27" }],
        ["path", { d: "M13 12h8", key: "h98zly" }],
        ["path", { d: "M13 19h8", key: "c3s6r1" }],
        ["path", { d: "M3 10a2 2 0 0 0 2 2h3", key: "1npucw" }],
        ["path", { d: "M3 5v12a2 2 0 0 0 2 2h3", key: "x1gjn2" }]
      ]
    };
    __iconData6.node;
    ListTree = createLucideIcon(__iconData6);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.3.1/node_modules/lucide-react/dist/esm/icons/folder-tree.mjs
var folder_tree_exports = {};
__export(folder_tree_exports, {
  __iconData: () => __iconData7,
  default: () => FolderTree
});
var __iconData7, FolderTree;
var init_folder_tree = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.3.1/node_modules/lucide-react/dist/esm/icons/folder-tree.mjs"() {
    init_createLucideIcon();
    __iconData7 = {
      name: "folder-tree",
      size: 24,
      node: [
        [
          "path",
          {
            d: "M20 10a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-2.5a1 1 0 0 1-.8-.4l-.9-1.2A1 1 0 0 0 15 3h-2a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1Z",
            key: "hod4my"
          }
        ],
        [
          "path",
          {
            d: "M20 21a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1h-2.9a1 1 0 0 1-.88-.55l-.42-.85a1 1 0 0 0-.92-.6H13a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1Z",
            key: "w4yl2u"
          }
        ],
        ["path", { d: "M3 5a2 2 0 0 0 2 2h3", key: "f2jnh7" }],
        ["path", { d: "M3 3v13a2 2 0 0 0 2 2h3", key: "k8epm1" }]
      ]
    };
    __iconData7.node;
    FolderTree = createLucideIcon(__iconData7);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.3.1/node_modules/lucide-react/dist/esm/icons/search.mjs
var search_exports = {};
__export(search_exports, {
  __iconData: () => __iconData8,
  default: () => Search
});
var __iconData8, Search;
var init_search = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.3.1/node_modules/lucide-react/dist/esm/icons/search.mjs"() {
    init_createLucideIcon();
    __iconData8 = {
      name: "search",
      size: 24,
      node: [
        ["path", { d: "m21 21-4.34-4.34", key: "14j7rj" }],
        ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }]
      ]
    };
    __iconData8.node;
    Search = createLucideIcon(__iconData8);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.3.1/node_modules/lucide-react/dist/esm/icons/layout-grid.mjs
var layout_grid_exports = {};
__export(layout_grid_exports, {
  __iconData: () => __iconData9,
  default: () => LayoutGrid
});
var __iconData9, LayoutGrid;
var init_layout_grid = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.3.1/node_modules/lucide-react/dist/esm/icons/layout-grid.mjs"() {
    init_createLucideIcon();
    __iconData9 = {
      name: "layout-grid",
      size: 24,
      node: [
        ["rect", { width: "7", height: "7", x: "3", y: "3", rx: "1", key: "1g98yp" }],
        ["rect", { width: "7", height: "7", x: "14", y: "3", rx: "1", key: "6d4xhi" }],
        ["rect", { width: "7", height: "7", x: "14", y: "14", rx: "1", key: "nxv5o0" }],
        ["rect", { width: "7", height: "7", x: "3", y: "14", rx: "1", key: "1bb6yr" }]
      ]
    };
    __iconData9.node;
    LayoutGrid = createLucideIcon(__iconData9);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.3.1/node_modules/lucide-react/dist/esm/icons/list.mjs
var list_exports = {};
__export(list_exports, {
  __iconData: () => __iconData10,
  default: () => List
});
var __iconData10, List;
var init_list = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.3.1/node_modules/lucide-react/dist/esm/icons/list.mjs"() {
    init_createLucideIcon();
    __iconData10 = {
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
    __iconData10.node;
    List = createLucideIcon(__iconData10);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.3.1/node_modules/lucide-react/dist/esm/icons/square-check-big.mjs
var square_check_big_exports = {};
__export(square_check_big_exports, {
  __iconData: () => __iconData11,
  default: () => SquareCheckBig
});
var __iconData11, SquareCheckBig;
var init_square_check_big = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.3.1/node_modules/lucide-react/dist/esm/icons/square-check-big.mjs"() {
    init_createLucideIcon();
    __iconData11 = {
      name: "square-check-big",
      size: 24,
      node: [
        [
          "path",
          { d: "M21 10.656V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h12.344", key: "2acyp4" }
        ],
        ["path", { d: "m9 11 3 3L22 4", key: "1pflzl" }]
      ],
      aliases: ["check-square"]
    };
    __iconData11.node;
    SquareCheckBig = createLucideIcon(__iconData11);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.3.1/node_modules/lucide-react/dist/esm/icons/chevron-left.mjs
var chevron_left_exports = {};
__export(chevron_left_exports, {
  __iconData: () => __iconData12,
  default: () => ChevronLeft
});
var __iconData12, ChevronLeft;
var init_chevron_left = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.3.1/node_modules/lucide-react/dist/esm/icons/chevron-left.mjs"() {
    init_createLucideIcon();
    __iconData12 = {
      name: "chevron-left",
      size: 24,
      node: [["path", { d: "m15 18-6-6 6-6", key: "1wnfg3" }]]
    };
    __iconData12.node;
    ChevronLeft = createLucideIcon(__iconData12);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.3.1/node_modules/lucide-react/dist/esm/icons/chevron-right.mjs
var chevron_right_exports = {};
__export(chevron_right_exports, {
  __iconData: () => __iconData13,
  default: () => ChevronRight
});
var __iconData13, ChevronRight;
var init_chevron_right = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.3.1/node_modules/lucide-react/dist/esm/icons/chevron-right.mjs"() {
    init_createLucideIcon();
    __iconData13 = {
      name: "chevron-right",
      size: 24,
      node: [["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]]
    };
    __iconData13.node;
    ChevronRight = createLucideIcon(__iconData13);
  }
});

// packages/addons/tasks/client/client.src.cjs
var React = require("react");
var h = React.createElement;
(function() {
  "use strict";
  var host = window.__WB_HOST__;
  if (!host) {
    console.error("[wb-addon-tasks] \u5BBF\u4E3B\u6865 window.__WB_HOST__ \u4E0D\u5B58\u5728\uFF0C\u89C6\u56FE\u672A\u6CE8\u518C");
    return { name: "dsh-workbench-tasks", inject: [], apply: function() {
    } };
  }
  var React2 = require("react");
  var h2 = React2.createElement;
  var COPY = {
    zh: {
      title: "\u4EFB\u52A1\u8BB0\u5F55",
      search: "\u641C\u7D22\u4EFB\u52A1\u6807\u9898",
      newTask: "\u65B0\u5EFA\u4EFB\u52A1",
      tree: "\u4EFB\u52A1\u6811",
      select: "\u7B5B\u9009",
      cancelSelect: "\u9000\u51FA\u7B5B\u9009",
      list: "\u5217\u8868",
      card: "\u5361\u7247",
      all: "\u5168\u90E8",
      empty: "\u8FD9\u4E2A\u89C6\u56FE\u8FD8\u6CA1\u6709\u4EFB\u52A1",
      loading: "\u52A0\u8F7D\u4E2D\u2026",
      error: "\u64CD\u4F5C\u5931\u8D25\uFF1A",
      save: "\u4FDD\u5B58",
      cancel: "\u53D6\u6D88",
      create: "\u521B\u5EFA",
      close: "\u5173\u95ED",
      addGroup: "\u65B0\u5EFA\u7EC4",
      addTable: "\u65B0\u5EFA\u8868",
      rename: "\u91CD\u547D\u540D",
      del: "\u5220\u9664",
      deleteConfirm: "\u786E\u5B9A\u5220\u9664\u8FD9\u4E2A\u8282\u70B9\u53CA\u5176\u5B50\u6811\uFF1F\u5B50\u6811\u4E2D\u7684\u4EFB\u52A1\u4F1A\u88AB\u8F6F\u5220\u9664\u3002",
      root: "\u5168\u90E8\u4EFB\u52A1\u7EC4",
      manager: "\u7BA1\u7406\u6A21\u5F0F",
      filterRestarted: "\u8FC7\u6EE4\u5DF2\u91CD\u542F",
      types: "\u4EFB\u52A1\u7C7B\u578B",
      publish: "\u53D1\u5E03",
      target: "\u8BA1\u5212\u5B8C\u6210",
      done: "\u5B9E\u9645\u5B8C\u6210",
      shutdown: "\u5173\u95ED\u65F6\u95F4",
      priority: "\u4F18\u5148\u7EA7",
      difficulty: "\u96BE\u5EA6",
      desc: "\u63CF\u8FF0",
      status: "\u72B6\u6001",
      type: "\u7C7B\u578B",
      publishDate: "\u53D1\u5E03\u65E5\u671F",
      targetDate: "\u8BA1\u5212\u5B8C\u6210\u65E5\u671F",
      doneDate: "\u5B8C\u6210\u65E5\u671F",
      shutdownDate: "\u5173\u95ED\u65E5\u671F",
      table: "\u4EFB\u52A1\u8868",
      titleField: "\u6807\u9898",
      timeline: "\u65F6\u95F4\u7EBF",
      restart: "\u91CD\u542F",
      complete: "\u5B8C\u6210",
      shutdownOp: "\u5173\u95ED",
      selected: "\u5DF2\u9009",
      selectedTasks: "\u9009\u4E2D\u4EFB\u52A1",
      batchTimeline: "\u5F52\u5E76\u65F6\u95F4\u7EBF",
      batchMigrate: "\u8FC1\u79FB\u4EFB\u52A1\u8868",
      refresh: "\u5237\u65B0",
      clear: "\u6E05\u7A7A",
      chooseBase: "\u9009\u62E9\u57FA\u51C6\u4EFB\u52A1\uFF08\u4F7F\u7528\u5B83\u7684\u65F6\u95F4\u7EBF\uFF09",
      chooseTable: "\u9009\u62E9\u76EE\u6807\u4EFB\u52A1\u8868",
      timelineTitle: "\u4EFB\u52A1\u65F6\u95F4\u7EBF",
      newTimeline: "\u65B0\u5EFA\u65F6\u95F4\u7EBF\u4EFB\u52A1",
      restartTitle: "\u91CD\u542F\u4EFB\u52A1",
      noTimeline: "\u8FD9\u6761\u4EFB\u52A1\u8FD8\u6CA1\u6709\u65F6\u95F4\u7EBF",
      confirm: "\u786E\u5B9A",
      difficultyHint: "\u5B8C\u6210\u4EFB\u52A1\u524D\u8BF7\u9009\u62E9\u96BE\u5EA6\uFF080.5\u20135\uFF09",
      emptyTree: "\u4EFB\u52A1\u6811\u8FD8\u6CA1\u6709\u6570\u636E",
      appear: "\u663E\u793A",
      hide: "\u9690\u85CF",
      move: "\u79FB\u52A8\u5230",
      source: "\u6765\u6E90",
      page: "\u9875",
      total: "\u5171",
      items: "\u6761",
      doneSuccess: "\u5DF2\u5B8C\u6210",
      saved: "\u5DF2\u4FDD\u5B58",
      created: "\u5DF2\u521B\u5EFA",
      updated: "\u5DF2\u66F4\u65B0",
      deleted: "\u5DF2\u5220\u9664",
      needTitle: "\u6807\u9898\u4E0D\u80FD\u4E3A\u7A7A",
      needTable: "\u8BF7\u9009\u62E9\u4EFB\u52A1\u8868",
      needDate: "\u65E5\u671F\u4E0D\u80FD\u4E3A\u7A7A",
      needBase: "\u8BF7\u9009\u62E9\u57FA\u51C6\u4EFB\u52A1",
      needDifficulty: "\u8BF7\u9009\u62E9\u96BE\u5EA6"
    },
    en: {
      title: "Tasks",
      search: "Search title",
      newTask: "New task",
      tree: "Task tree",
      select: "Select",
      cancelSelect: "Exit select",
      list: "List",
      card: "Cards",
      all: "All",
      empty: "No tasks in this view",
      loading: "Loading\u2026",
      error: "Failed: ",
      save: "Save",
      cancel: "Cancel",
      create: "Create",
      close: "Close",
      addGroup: "New group",
      addTable: "New table",
      rename: "Rename",
      del: "Delete",
      deleteConfirm: "Delete this node and its subtree? Tasks under it will be soft-deleted.",
      root: "All tasks",
      manager: "Manage",
      filterRestarted: "Hide restarted",
      types: "Types",
      publish: "Published",
      target: "Target",
      done: "Done",
      shutdown: "Closed",
      priority: "Priority",
      difficulty: "Difficulty",
      desc: "Description",
      status: "Status",
      type: "Type",
      publishDate: "Publish date",
      targetDate: "Target date",
      doneDate: "Done date",
      shutdownDate: "Close date",
      table: "Task table",
      titleField: "Title",
      timeline: "Timeline",
      restart: "Restart",
      complete: "Complete",
      shutdownOp: "Close",
      selected: "Selected",
      selectedTasks: "Selected tasks",
      batchTimeline: "Merge timeline",
      batchMigrate: "Move table",
      refresh: "Refresh",
      clear: "Clear",
      chooseBase: "Choose a base task (it supplies the timeline)",
      chooseTable: "Choose target table",
      timelineTitle: "Task timeline",
      newTimeline: "New timeline task",
      restartTitle: "Restart task",
      noTimeline: "No timeline for this task",
      confirm: "OK",
      difficultyHint: "Pick a difficulty (0.5\u20135) before completing",
      emptyTree: "Task tree is empty",
      appear: "Show",
      hide: "Hide",
      move: "Move to",
      source: "Source",
      page: "Page",
      total: "Total",
      items: "items",
      doneSuccess: "Completed",
      saved: "Saved",
      created: "Created",
      updated: "Updated",
      deleted: "Deleted",
      needTitle: "Title is required",
      needTable: "Pick a task table",
      needDate: "Date is required",
      needBase: "Pick a base task",
      needDifficulty: "Pick a difficulty"
    }
  };
  var TABS = [
    { id: 0, zh: "\u7D27\u6025\u4EFB\u52A1", en: "Urgent" },
    { id: 1, zh: "\u5DE5\u4F5C\u4EFB\u52A1", en: "Work" },
    { id: 2, zh: "\u751F\u6D3B\u4EFB\u52A1", en: "Life" },
    { id: 3, zh: "\u5B66\u4E60\u4EFB\u52A1", en: "Study" },
    { id: 4, zh: "\u5F00\u53D1\u4EFB\u52A1", en: "Dev" },
    { id: 5, zh: "\u5DF2\u5173\u95ED", en: "Closed" },
    { id: 6, zh: "\u5DF2\u5F00\u542F", en: "Active" },
    { id: 7, zh: "\u5DF2\u5B8C\u6210", en: "Done" },
    { id: 8, zh: "\u603B\u89C8", en: "Overview" }
  ];
  var TYPES = [
    { id: "0", zh: "\u5DE5\u4F5C", en: "Work", icon: "\u25A3" },
    { id: "1", zh: "\u751F\u6D3B", en: "Life", icon: "\u2302" },
    { id: "2", zh: "\u5B66\u4E60", en: "Study", icon: "\u25A4" },
    { id: "3", zh: "\u5F00\u53D1", en: "Dev", icon: "\u2318" }
  ];
  var STATUS = {
    "0": { zh: "\u5DF2\u5F00\u542F", en: "Active", cls: "active" },
    "1": { zh: "\u5DF2\u5173\u95ED", en: "Closed", cls: "shutdown" },
    "2": { zh: "\u5DF2\u5B8C\u6210", en: "Done", cls: "done" },
    "3": { zh: "\u5DF2\u91CD\u542F", en: "Restarted", cls: "restarted" }
  };
  var ICONS = {
    "plus": (init_plus(), __toCommonJS(plus_exports)).default,
    "minus": (init_minus(), __toCommonJS(minus_exports)).default,
    "check": (init_check(), __toCommonJS(check_exports)).default,
    "stop": (init_square(), __toCommonJS(square_exports)).default,
    "restart": (init_rotate_ccw(), __toCommonJS(rotate_ccw_exports)).default,
    "timeline": (init_list_tree(), __toCommonJS(list_tree_exports)).default,
    "tree": (init_folder_tree(), __toCommonJS(folder_tree_exports)).default,
    "search": (init_search(), __toCommonJS(search_exports)).default,
    "grid": (init_layout_grid(), __toCommonJS(layout_grid_exports)).default,
    "list": (init_list(), __toCommonJS(list_exports)).default,
    "select": (init_square_check_big(), __toCommonJS(square_check_big_exports)).default,
    "left": (init_chevron_left(), __toCommonJS(chevron_left_exports)).default,
    "right": (init_chevron_right(), __toCommonJS(chevron_right_exports)).default
  };
  function Icon2(props) {
    var C = ICONS[props.name];
    if (!C) return null;
    return h2(C, { size: props.size || 14, strokeWidth: 2, "aria-hidden": "true", className: "wbt-svg" });
  }
  var CSS = [
    ".wbt-root{--wbt-line:var(--dsw-alias-border-l2,color-mix(in oklab,currentColor 16%,transparent));--wbt-surface:var(--dsw-alias-bg-layer-1,color-mix(in oklab,currentColor 4%,transparent));--wbt-bg:var(--dsw-alias-bg-layer-1,var(--dsw-alias-bg-base,#fff));--wbt-accent:var(--dsw-alias-brand-primary,#11a89b);display:flex;flex-direction:column;gap:10px;min-height:0;color:inherit;font-size:13px}",
    ".wbt-pathrow{display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding:0 0 2px}",
    ".wbt-tree-slot{flex:0 0 138px;width:138px;margin-right:6px;display:flex;align-items:center}",
    ".wbt-grow{flex:1;min-width:0}",
    ".wbt-btn{border:1px solid var(--wbt-line);background:var(--wbt-surface);color:inherit;border-radius:8px;padding:6px 11px;font-size:12.5px;cursor:pointer;white-space:nowrap;line-height:1.3;display:inline-flex;align-items:center;gap:5px}",
    ".wbt-svg{display:block;flex:none}",
    ".wbt-btn:hover{border-color:var(--wbt-accent)}",
    ".wbt-btn.primary{background:var(--wbt-accent);border-color:var(--wbt-accent);color:var(--dsw-alias-label-primary-inverted,#fff);font-weight:600}",
    ".wbt-btn.ghost{background:transparent}",
    ".wbt-btn.danger{color:var(--dsw-alias-state-error-primary,#e5484d);border-color:color-mix(in oklab,var(--dsw-alias-state-error-primary,#e5484d) 45%,transparent)}",
    ".wbt-btn:disabled{opacity:.5;cursor:not-allowed}",
    ".wbt-input,.wbt-select,.wbt-textarea{border:1px solid var(--wbt-line);background:transparent;color:inherit;border-radius:8px;padding:7px 10px;font-size:13px;outline:none;min-width:0}",
    ".wbt-input:focus,.wbt-select:focus,.wbt-textarea:focus{border-color:var(--wbt-accent)}",
    ".wbt-search{width:220px;max-width:46vw}",
    ".wbt-body{display:flex;gap:14px;align-items:flex-start;min-height:0;flex:1}",
    ".wbt-nav{display:flex;flex-direction:column;gap:2px;flex:0 0 138px;width:138px;padding:3px 0;border-right:1px solid var(--wbt-line)}",
    ".wbt-content{flex:1;min-width:0;display:flex;flex-direction:column;gap:8px}",
    ".wbt-nav-sep{height:1px;background:var(--wbt-line);margin:5px 9px;opacity:.7}",
    ".wbt-tab{display:flex;align-items:center;text-align:left;width:100%;border:none;background:transparent;color:inherit;opacity:.62;border-radius:8px;padding:8px 10px;cursor:pointer;font-size:12.5px;line-height:1.35;transition:background .12s ease,color .12s ease,opacity .12s ease}",
    ".wbt-tab:hover{opacity:1;background:color-mix(in oklab,currentColor 7%,transparent)}",
    ".wbt-tab.on{opacity:1;font-weight:650;background:color-mix(in oklab,var(--wbt-accent) 15%,transparent);color:var(--wbt-accent);box-shadow:inset 2px 0 0 var(--wbt-accent)}",
    ".wbt-filters{display:flex;gap:10px;align-items:center;flex-wrap:wrap;font-size:12px;opacity:.85}",
    ".wbt-check{display:inline-flex;align-items:center;gap:4px;cursor:pointer;white-space:nowrap}",
    ".wbt-check input{accent-color:var(--wbt-accent)}",
    ".wbt-crumb{display:flex;align-items:center;gap:3px;flex-wrap:wrap;font-size:12px;opacity:.8}",
    ".wbt-crumb button{border:none;background:none;color:inherit;cursor:pointer;padding:2px 4px;border-radius:5px;font-size:12px}",
    ".wbt-crumb button:hover{background:color-mix(in oklab,currentColor 9%,transparent)}",
    ".wbt-crumb .sep{opacity:.35}",
    ".wbt-list{display:flex;flex-direction:column;gap:7px;min-height:0}",
    ".wbt-item{display:flex;gap:12px;align-items:flex-start;border:1px solid var(--wbt-line);border-radius:12px;background:var(--wbt-surface);padding:11px 13px;min-height:0;transition:border-color .14s ease,box-shadow .14s ease}",
    ".wbt-item:hover{border-color:color-mix(in oklab,var(--wbt-accent) 30%,var(--wbt-line));box-shadow:0 2px 10px rgba(20,30,40,.05)}",
    ".wbt-item.done{opacity:.62}",
    ".wbt-item.done .wbt-title{text-decoration:line-through}",
    ".wbt-main{flex:1;min-width:0;display:flex;flex-direction:column;gap:4px}",
    ".wbt-line1{display:flex;align-items:center;gap:6px;min-width:0;flex-wrap:wrap}",
    ".wbt-title{font-weight:620;font-size:14px;line-height:1.38;letter-spacing:.1px;word-break:break-word}",
    ".wbt-desc{font-size:12.5px;opacity:.66;line-height:1.55;word-break:break-word;white-space:pre-wrap;max-width:80ch}",
    ".wbt-foot{display:flex;align-items:center;gap:6px 12px;flex-wrap:wrap;margin-top:1px}",
    ".wbt-meta{display:flex;gap:4px 12px;flex-wrap:wrap;font-size:11.5px;opacity:.64;font-variant-numeric:tabular-nums}",
    ".wbt-meta b{font-weight:560;opacity:.9;margin-right:1px}",
    ".wbt-add-desc{border:none;background:none;color:inherit;font:inherit;font-size:12px;line-height:1;opacity:.3;padding:2px 4px;border-radius:5px;cursor:pointer;flex:none}",
    ".wbt-add-desc:hover{opacity:.85;background:color-mix(in oklab,currentColor 7%,transparent)}",
    ".wbt-path{display:flex;gap:3px;flex-wrap:wrap;align-items:center;font-size:11.5px;opacity:.58}",
    ".wbt-foot .wbt-path{margin-left:2px}",
    ".wbt-path button{border:none;background:none;color:inherit;padding:2px 3px;border-radius:5px;cursor:pointer;font-size:11.5px}",
    ".wbt-path button:hover{background:color-mix(in oklab,currentColor 8%,transparent);text-decoration:underline}",
    ".wbt-prio{font-size:10px;font-weight:650;padding:2px 6px;border-radius:999px;border:none;background:color-mix(in oklab,currentColor 12%,transparent);opacity:.92;flex:none;font-variant-numeric:tabular-nums}",
    ".wbt-prio.high{color:var(--dsw-alias-state-error-primary,#d93a40)}.wbt-prio.mid{color:var(--dsw-alias-state-warn-primary,#cf6512)}.wbt-prio.low{color:var(--dsw-alias-label-tertiary,#77839a)}",
    ".wbt-kind{font-size:11.5px;font-weight:600;line-height:1;opacity:.9;flex:none}",
    ".wbt-kind.t0{color:var(--dsw-alias-brand-primary,#0f8f84)}.wbt-kind.t1{color:var(--dsw-alias-state-warn-primary,#bf6818)}.wbt-kind.t2{color:var(--dsw-alias-state-business-primary,#2f6fdb)}.wbt-kind.t3{color:#7c4dcc}",
    ".wbt-badge{font-size:10.5px;padding:1px 6px;border-radius:999px;border:none;background:color-mix(in oklab,currentColor 9%,transparent);opacity:.86;white-space:nowrap}",
    '.wbt-badge::before{content:"";display:inline-block;width:5px;height:5px;border-radius:50%;background:currentColor;margin-right:4px;vertical-align:1px;opacity:.8}',
    ".wbt-badge.active{color:var(--dsw-alias-brand-primary,#0b8a7f)}",
    ".wbt-badge.done{color:var(--dsw-alias-state-success-primary,#2f9e44)}",
    ".wbt-badge.shutdown{color:var(--dsw-alias-label-tertiary,#7d8698)}.wbt-badge.restarted{color:var(--dsw-alias-state-business-primary,#7048e8)}",
    ".wbt-ops{display:flex;gap:3px;align-items:center;flex-wrap:wrap;flex:none;padding-top:1px}",
    ".wbt-icon{border:none;background:color-mix(in oklab,currentColor 5%,transparent);color:inherit;width:24px;height:24px;border-radius:6px;cursor:pointer;font-size:12.5px;line-height:1;display:inline-flex;align-items:center;justify-content:center;flex:none;opacity:.7;padding:0}",
    ".wbt-icon:hover{opacity:1;background:color-mix(in oklab,var(--wbt-accent) 13%,transparent);color:var(--wbt-accent)}",
    ".wbt-icon.danger:hover{background:color-mix(in oklab,var(--dsw-alias-state-error-primary,#e5484d) 12%,transparent);color:var(--dsw-alias-state-error-primary,#e5484d)}",
    ".wbt-ops .wbt-btn{border-color:transparent;background:transparent;padding:5px 8px;font-size:12px;border-radius:7px;opacity:.72}",
    ".wbt-ops .wbt-btn:hover{opacity:1;background:color-mix(in oklab,currentColor 7%,transparent)}",
    ".wbt-ops .wbt-act-done{color:var(--dsw-alias-state-success-primary,#1f8a4c);background:color-mix(in oklab,var(--dsw-alias-state-success-primary,#2f9e44) 10%,transparent);opacity:.96}",
    ".wbt-ops .wbt-act-done:hover{background:color-mix(in oklab,var(--dsw-alias-state-success-primary,#2f9e44) 16%,transparent)}",
    ".wbt-ops .wbt-act-close{color:var(--dsw-alias-state-error-primary,#b4434a)}",
    ".wbt-ops .wbt-act-close:hover{background:color-mix(in oklab,var(--dsw-alias-state-error-primary,#e5484d) 10%,transparent)}",
    ".wbt-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:9px}",
    ".wbt-card{display:flex;flex-direction:column;gap:6px;min-height:150px}",
    ".wbt-card .wbt-ops{margin-top:auto}",
    ".wbt-empty{border:1px dashed var(--wbt-line);border-radius:11px;padding:34px 12px;text-align:center;opacity:.5;font-size:12.5px}",
    ".wbt-err{font-size:12.5px;color:var(--dsw-alias-state-error-primary,#e5484d);line-height:1.5}",
    ".wbt-pager{display:flex;gap:8px;align-items:center;justify-content:flex-end;font-size:12px;opacity:.8;flex-wrap:wrap}",
    ".wbt-drawer-mask{position:fixed;inset:0;background:rgba(0,0,0,.22);z-index:800;display:flex}",
    ".wbt-drawer{width:440px;max-width:92vw;height:100%;background:var(--wbt-bg);border-right:1px solid var(--wbt-line);display:flex;flex-direction:column;box-shadow:0 12px 40px rgba(0,0,0,.22)}",
    ".wbt-drawer-head{display:flex;align-items:center;gap:8px;padding:12px 14px;border-bottom:1px solid var(--wbt-line)}",
    ".wbt-drawer-body{flex:1;overflow:auto;padding:8px 10px 20px}",
    ".wbt-drawer-foot{padding:9px 13px;border-top:1px solid var(--wbt-line);font-size:11.5px;opacity:.55}",
    ".wbt-tree-row{display:flex;align-items:center;gap:3px;border-radius:7px;padding:2px 3px;min-height:29px}",
    ".wbt-tree-row:hover{background:color-mix(in oklab,currentColor 7%,transparent)}",
    ".wbt-tree-row.sel{background:color-mix(in oklab,var(--wbt-accent) 14%,transparent)}",
    ".wbt-tree-row.drop{outline:1px dashed var(--wbt-accent);outline-offset:-1px}",
    ".wbt-tw{width:18px;height:22px;border:none;background:none;color:inherit;cursor:pointer;opacity:.6;flex:none;font-size:10px}",
    ".wbt-tn{flex:1;min-width:0;display:flex;align-items:center;gap:5px;cursor:pointer;font-size:12.5px;padding:2px 0}",
    ".wbt-tn .nm{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
    ".wbt-tacts{display:flex;gap:1px;opacity:0;flex:none}",
    ".wbt-tree-row:hover .wbt-tacts{opacity:.9}",
    ".wbt-tacts button{border:none;background:none;color:inherit;cursor:pointer;font-size:10.5px;padding:2px 3px;border-radius:4px;opacity:.7}",
    ".wbt-tacts button:hover{background:color-mix(in oklab,currentColor 10%,transparent);opacity:1}",
    ".wbt-modal-mask{position:fixed;inset:0;background:rgba(0,0,0,.28);z-index:1000;display:flex;align-items:center;justify-content:center;padding:16px}",
    ".wbt-modal{width:560px;max-width:96vw;max-height:90vh;overflow:auto;background:var(--wbt-bg);border:1px solid var(--wbt-line);border-radius:14px;box-shadow:0 20px 60px rgba(0,0,0,.3);padding:15px 17px;display:flex;flex-direction:column;gap:11px}",
    ".wbt-modal.wide{width:820px}",
    ".wbt-modal-head{display:flex;align-items:center;gap:8px}",
    ".wbt-modal-head h3{margin:0;font-size:14.5px;font-weight:650;flex:1}",
    ".wbt-form{display:grid;grid-template-columns:1fr 1fr;gap:9px}",
    ".wbt-field{display:flex;flex-direction:column;gap:4px;font-size:12px;min-width:0}",
    ".wbt-field.full{grid-column:1 / -1}",
    ".wbt-field>span{opacity:.62;font-size:11.5px}",
    ".wbt-modal-foot{display:flex;gap:8px;justify-content:flex-end;align-items:center;margin-top:2px}",
    ".wbt-timeline{display:flex;flex-direction:column;gap:0;margin:2px 0}",
    ".wbt-tl-item{display:flex;gap:9px;min-height:40px}",
    ".wbt-tl-rail{width:12px;display:flex;flex-direction:column;align-items:center;flex:none}",
    ".wbt-tl-dot{width:8px;height:8px;border-radius:50%;background:var(--wbt-accent);margin-top:5px}",
    ".wbt-tl-line{width:1px;flex:1;background:var(--wbt-line)}",
    ".wbt-tl-body{padding:0 0 10px;min-width:0;flex:1}",
    ".wbt-tl-title{font-weight:600;font-size:12.5px}",
    ".wbt-tl-meta{font-size:11px;opacity:.58;display:flex;gap:7px;flex-wrap:wrap;margin-top:2px}",
    ".wbt-selbar{position:fixed;left:50%;bottom:16px;transform:translateX(-50%);z-index:900;display:flex;gap:8px;align-items:center;background:var(--wbt-bg);border:1px solid var(--wbt-line);box-shadow:0 10px 34px rgba(0,0,0,.24);border-radius:12px;padding:8px 11px;max-width:94vw;flex-wrap:wrap}",
    ".wbt-toast{position:fixed;left:50%;bottom:70px;transform:translateX(-50%);z-index:1100;background:var(--dsw-alias-toast-bg,#1f2328);color:var(--dsw-alias-toast-label,#fff);border-radius:9px;padding:8px 14px;font-size:12.5px;box-shadow:0 8px 24px rgba(0,0,0,.25);max-width:90vw;text-align:center}",
    ".wbt-stars{color:var(--dsw-alias-state-warn-primary,#f59f00);font-size:11px;letter-spacing:.5px;white-space:nowrap}",
    ".wbt-sum{display:flex;gap:5px;flex-wrap:wrap;font-size:11px;opacity:.55}",
    ".wbt-nowrap{white-space:nowrap}",
    ".wbt-row{display:flex;gap:6px;align-items:center;flex-wrap:wrap}",
    ".wbt-split{display:flex;gap:12px;align-items:flex-start}",
    ".wbt-col{flex:1;min-width:0}",
    ".wbt-mono{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11px}",
    ".wbt-pill{font-size:11px;padding:2px 7px;border-radius:999px;background:color-mix(in oklab,var(--wbt-accent) 12%,transparent);color:var(--wbt-accent)}",
    ".wbt-hint{font-size:11.5px;opacity:.55;line-height:1.5}",
    ".wbt-danger{color:var(--dsw-alias-state-error-primary,#e5484d)}",
    "@media (max-width:760px){.wbt-body{flex-direction:column;gap:8px}.wbt-nav{flex-direction:row;width:100%;flex:0 0 auto;overflow-x:auto;border-right:none;border-bottom:1px solid var(--wbt-line);padding:0 0 6px}.wbt-tab{width:auto;white-space:nowrap;padding:6px 9px}.wbt-tab.on{box-shadow:inset 0 -2px 0 var(--wbt-accent)}.wbt-nav-sep{width:1px;height:18px;flex:none;margin:auto 4px}.wbt-tree-slot{flex:0 0 auto;width:auto;margin-right:0}.wbt-pathrow .wbt-search{flex:1 1 160px;max-width:none}}",
    "@media (max-width:640px){.wbt-form{grid-template-columns:1fr}.wbt-drawer{width:94vw}.wbt-search{width:100%}.wbt-item{padding:9px}.wbt-ops{width:100%;justify-content:flex-end}}"
  ].join("\n");
  function injectCss() {
    if (typeof document === "undefined") return;
    var old = document.getElementById("wb-addon-tasks-v2-css");
    if (old) {
      old.textContent = CSS;
      return;
    }
    var s = document.createElement("style");
    s.id = "wb-addon-tasks-v2-css";
    s.setAttribute("data-wb-addon", "wb-addon-tasks");
    s.textContent = CSS;
    document.head.appendChild(s);
  }
  function cx() {
    return Array.prototype.filter.call(arguments, Boolean).join(" ");
  }
  function today() {
    var d = /* @__PURE__ */ new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }
  function daysBetween(dateText) {
    if (!dateText) return null;
    var d = /* @__PURE__ */ new Date(String(dateText) + "T00:00:00");
    if (Number.isNaN(d.getTime())) return null;
    var n = /* @__PURE__ */ new Date();
    n.setHours(0, 0, 0, 0);
    return Math.round((d.getTime() - n.getTime()) / 864e5);
  }
  function typeInfo(id) {
    for (var i = 0; i < TYPES.length; i++) if (TYPES[i].id === String(id)) return TYPES[i];
    return TYPES[0];
  }
  function statusInfo(id) {
    return STATUS[String(id)] || STATUS["0"];
  }
  function treeFlat(nodes, depth, out) {
    var arr = out || [];
    for (var i = 0; i < (nodes || []).length; i++) {
      var n = nodes[i];
      arr.push({ id: String(n.id), name: n.name, type: String(n.type), depth: depth || 0 });
      if (n.children && n.children.length) treeFlat(n.children, (depth || 0) + 1, arr);
    }
    return arr;
  }
  function findFirstTable(nodes) {
    for (var i = 0; i < (nodes || []).length; i++) {
      var n = nodes[i];
      if (String(n.type) === "1") return n;
      var found = findFirstTable(n.children || []);
      if (found) return found;
    }
    return null;
  }
  function findNode(nodes, id) {
    for (var i = 0; i < (nodes || []).length; i++) {
      var n = nodes[i];
      if (String(n.id) === String(id)) return n;
      var found = findNode(n.children || [], id);
      if (found) return found;
    }
    return null;
  }
  function allTables(nodes) {
    return treeFlat(nodes).filter(function(n) {
      return n.type === "1";
    });
  }
  function pClass(n) {
    return n >= 6 ? "high" : n >= 3 ? "mid" : "low";
  }
  function stars(n) {
    var v = Number(n || 0);
    var full = Math.floor(v);
    var half = v - full >= 0.5;
    var out = "";
    for (var i = 0; i < full; i++) out += "\u2605";
    if (half) out += "\u2BEA";
    for (var j = full + (half ? 1 : 0); j < 5; j++) out += "\u2606";
    return out;
  }
  function PathCrumbs(props) {
    var path = props.path || [];
    if (!path.length) return null;
    return h2("div", { className: "wbt-path" }, path.map(function(p, i) {
      return h2(
        React2.Fragment,
        { key: p.id + "-" + i },
        i > 0 ? h2("span", { className: "sep", children: "\u203A" }) : null,
        h2("button", {
          type: "button",
          onClick: function(e) {
            e.stopPropagation();
            if (props.onPick) props.onPick(p, i, path);
          }
        }, p.name || p.id)
      );
    }));
  }
  function TaskItem(props) {
    var t = props.t;
    var task = props.task;
    var st = statusInfo(task.status);
    var ti = typeInfo(task.type);
    var typeName = props.lang === "en" ? ti.en : ti.zh;
    var isActive = String(task.status) === "0";
    var titleState = React2.useState(null);
    var editingTitle = titleState[0], setEditingTitle = titleState[1];
    var descState = React2.useState(null);
    var editingDesc = descState[0], setEditingDesc = descState[1];
    var titleRef = React2.useRef(null);
    var descRef = React2.useRef(null);
    React2.useEffect(function() {
      if (editingTitle !== null && titleRef.current) titleRef.current.focus();
    }, [editingTitle]);
    React2.useEffect(function() {
      if (editingDesc !== null && descRef.current) descRef.current.focus();
    }, [editingDesc]);
    function beginTitle() {
      if (!isActive) return;
      setEditingTitle(String(task.title || ""));
    }
    function saveTitle() {
      if (editingTitle === null) return;
      var v = String(editingTitle).trim();
      if (!v) {
        props.toast(t.needTitle);
        setEditingTitle(null);
        return;
      }
      if (v !== String(task.title || "")) props.update(task, { type: "TITLE", title: v });
      setEditingTitle(null);
    }
    function beginDesc() {
      if (!isActive) return;
      setEditingDesc(String(task.description || ""));
    }
    function saveDesc() {
      if (editingDesc === null) return;
      if (String(editingDesc) !== String(task.description || "")) {
        props.update(task, { type: "DESCRIPTION", description: String(editingDesc) });
      }
      setEditingDesc(null);
    }
    var countdown = String(task.status) === "0" ? daysBetween(task.targetDate) : null;
    var meta = [];
    meta.push(h2("span", { key: "kind", className: "wbt-kind t" + String(task.type || "0"), title: typeName, children: typeName }));
    if (task.publishDate) meta.push(h2("span", { key: "p" }, h2("b", null, t.publish), " ", task.publishDate));
    if (String(task.status) === "0" && task.targetDate) {
      meta.push(h2(
        "span",
        { key: "g" },
        h2("b", null, t.target),
        " ",
        task.targetDate,
        countdown !== null ? h2("span", { className: countdown <= 1 ? "wbt-danger" : "", children: "\uFF08" + (countdown < 0 ? "\u5DF2\u903E\u671F" : "\u5269 " + countdown + " \u5929") + "\uFF09" }) : null
      ));
    } else if (String(task.status) === "2") {
      if (task.targetDate) meta.push(h2("span", { key: "g" }, h2("b", null, t.target), " ", task.targetDate));
      if (task.doneDate) meta.push(h2("span", { key: "d" }, h2("b", null, t.done), " ", task.doneDate));
      meta.push(h2("span", { key: "s", className: "wbt-stars", children: stars(task.difficulty) + " " + Number(task.difficulty || 0).toFixed(1) }));
    } else {
      if (task.targetDate) meta.push(h2("span", { key: "g" }, h2("b", null, t.target), " ", task.targetDate));
      if (task.shutdownDate) meta.push(h2("span", { key: "s" }, h2("b", null, t.shutdown), " ", task.shutdownDate));
    }
    var ops = [];
    if (isActive) {
      ops.push(h2("button", { key: "p+", className: "wbt-icon", title: t.priority + " +1", onClick: function() {
        if (task.priority < 10) props.update(task, { type: "PRIORITY", priority: Number(task.priority) + 1 });
      } }, h2(Icon2, { name: "plus", size: 14 })));
      ops.push(h2("button", { key: "p-", className: "wbt-icon", title: t.priority + " -1", onClick: function() {
        if (task.priority > 0) props.update(task, { type: "PRIORITY", priority: Number(task.priority) - 1 });
      } }, h2(Icon2, { name: "minus", size: 14 })));
      ops.push(h2("button", { key: "done", className: "wbt-btn wbt-act-done", onClick: function() {
        props.onDone(task);
      } }, h2(Icon2, { name: "check", size: 14 }), t.complete));
      ops.push(h2("button", { key: "shut", className: "wbt-btn wbt-act-close", onClick: function() {
        props.update(task, { type: "STATUS", status: "1", date: today() });
      } }, h2(Icon2, { name: "stop", size: 14 }), t.shutdownOp));
    }
    ops.push(h2("button", { key: "restart", className: "wbt-btn ghost", onClick: function() {
      props.onRestart(task);
    } }, h2(Icon2, { name: "restart", size: 14 }), t.restart));
    ops.push(h2("button", { key: "timeline", className: "wbt-btn ghost", onClick: function() {
      props.onTimeline(task);
    } }, h2(Icon2, { name: "timeline", size: 14 }), t.timeline));
    var titleNode = editingTitle !== null ? h2("input", {
      ref: titleRef,
      className: "wbt-input",
      style: { fontSize: "13px", padding: "4px 7px" },
      value: editingTitle,
      onChange: function(e) {
        setEditingTitle(e.target.value);
      },
      onKeyDown: function(e) {
        if (e.key === "Enter") {
          e.preventDefault();
          saveTitle();
        }
        if (e.key === "Escape") setEditingTitle(null);
      },
      onBlur: saveTitle
    }) : h2("div", { className: "wbt-title", onDoubleClick: beginTitle, title: isActive ? "\u53CC\u51FB\u7F16\u8F91\u6807\u9898" : "" }, task.title);
    var descNode = editingDesc !== null ? h2("textarea", {
      ref: descRef,
      className: "wbt-textarea",
      rows: 2,
      value: editingDesc,
      onChange: function(e) {
        setEditingDesc(e.target.value);
      },
      onKeyDown: function(e) {
        if (e.key === "Escape") setEditingDesc(null);
        if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
          e.preventDefault();
          saveDesc();
        }
      },
      onBlur: saveDesc
    }) : task.description ? h2("div", { className: "wbt-desc", onDoubleClick: beginDesc }, task.description) : null;
    var addDesc = !task.description && isActive && editingDesc === null ? h2("button", { key: "add-desc", className: "wbt-add-desc", title: t.desc, onClick: beginDesc }, "\uFF0B") : null;
    return h2(
      "div",
      { className: cx("wbt-item", props.card && "wbt-card", String(task.status) === "2" && "done") },
      props.selectionMode ? h2("input", { type: "checkbox", className: "wbt-check", checked: !!props.checked, onChange: function() {
        props.onCheck(task.id);
      } }) : null,
      h2(
        "div",
        { className: "wbt-main" },
        h2(
          "div",
          { className: "wbt-line1" },
          h2("span", { className: "wbt-prio " + pClass(task.priority), children: "P" + task.priority }),
          h2("span", { className: "wbt-badge " + st.cls, children: st.zh }),
          titleNode,
          addDesc
        ),
        descNode,
        h2(
          "div",
          { className: "wbt-foot" },
          meta.length ? h2("div", { className: "wbt-meta", key: "meta" }, meta) : null,
          h2(PathCrumbs, { key: "path", path: task.path, t, onPick: props.onPathPick })
        )
      ),
      h2("div", { className: "wbt-ops" }, ops)
    );
  }
  function TreeNode(props) {
    var node = props.node;
    var t = props.t;
    var expanded = props.expanded;
    var isExpanded = expanded.has(String(node.id));
    var hasKids = node.children && node.children.length > 0;
    var selected = props.selectedTable === String(node.id) || !props.selectedTable && props.selectedGroup === String(node.id);
    var isTable = String(node.type) === "1";
    var isRoot = String(node.parent) === "0" || String(node.parentId) === "0";
    var pad = 4 + (props.depth || 0) * 13;
    var editing = props.edit && String(props.edit.id) === String(node.id);
    function toggle(e) {
      e.stopPropagation();
      props.onToggle(node.id);
    }
    function select() {
      props.onSelect(node);
    }
    function drop(e) {
      e.preventDefault();
      e.stopPropagation();
      var src = props.dragId;
      if (!src || String(src) === String(node.id)) return;
      var asChild = !isTable && isExpanded;
      props.onMove(src, node.id, asChild ? 0 : 2);
    }
    return h2(
      "div",
      null,
      h2(
        "div",
        {
          className: cx("wbt-tree-row", selected && "sel", props.dropId === String(node.id) && "drop"),
          style: { paddingLeft: pad + "px" },
          draggable: props.manager && !isRoot,
          onDragStart: function(e) {
            props.onDragStart(node.id);
          },
          onDragOver: function(e) {
            e.preventDefault();
            props.onDragOver(node.id);
          },
          onDrop: drop
        },
        h2("button", { className: "wbt-tw", onClick: toggle, style: { visibility: isTable ? "hidden" : "visible" } }, isExpanded ? "\u25BE" : "\u25B8"),
        h2(
          "div",
          { className: "wbt-tn", onClick: select, title: node.name },
          h2("span", { style: { opacity: 0.65, fontSize: "10px" }, children: isRoot ? "\u25C6" : isTable ? "\u25A4" : "\u25B8" }),
          editing ? h2("input", {
            className: "wbt-input",
            style: { padding: "2px 5px", fontSize: "12px", width: "130px" },
            value: props.editName,
            autoFocus: true,
            onClick: function(e) {
              e.stopPropagation();
            },
            onChange: function(e) {
              props.onEditName(e.target.value);
            },
            onKeyDown: function(e) {
              if (e.key === "Enter") {
                e.preventDefault();
                props.onRename(node.id, props.editName);
              }
              if (e.key === "Escape") props.onCancelEdit();
            },
            onBlur: function() {
              props.onRename(node.id, props.editName);
            }
          }) : h2("span", { className: "nm" }, node.name)
        ),
        h2(
          "div",
          { className: "wbt-tacts" },
          !isTable ? h2("button", { title: t.addGroup, onClick: function(e) {
            e.stopPropagation();
            props.onAdd(node.id, "0");
          } }, "\uFF0B\u7EC4") : null,
          !isTable ? h2("button", { title: t.addTable, onClick: function(e) {
            e.stopPropagation();
            props.onAdd(node.id, "1");
          } }, "\uFF0B\u8868") : null,
          !isRoot ? h2("button", { title: t.rename, onClick: function(e) {
            e.stopPropagation();
            props.onEdit(node);
          } }, "\u270E") : null,
          props.manager && !isRoot ? h2("button", { title: t.del, className: "wbt-danger", onClick: function(e) {
            e.stopPropagation();
            props.onDelete(node);
          } }, "\xD7") : null
        )
      ),
      isExpanded && hasKids ? h2("div", null, node.children.map(function(kid) {
        return h2(TreeNode, Object.assign({}, props, { key: kid.id, node: kid, depth: (props.depth || 0) + 1 }));
      })) : null
    );
  }
  function CreateModal(props) {
    var t = props.t;
    var source = props.source || "0";
    var origin = props.originTask || null;
    var tables = allTables(props.tree);
    var first = props.defaultTableId || origin && origin.tableId || tables[0] && tables[0].id || "";
    var initType = origin ? String(origin.type || "0") : "0";
    var initTable = origin ? String(origin.tableId || first) : String(first);
    var f = React2.useState({
      title: "",
      description: "",
      type: initType,
      status: "0",
      priority: 1,
      difficulty: 1,
      publishDate: today(),
      targetDate: today(),
      doneDate: today(),
      shutdownDate: today(),
      tableId: initTable
    });
    var form = f[0], setForm = f[1];
    var busy = React2.useState(false);
    var isBusy = busy[0], setBusy = busy[1];
    var err = React2.useState("");
    var error = err[0], setError = err[1];
    function set(k, v) {
      var next = Object.assign({}, form);
      next[k] = v;
      if (k === "type" && source === "0") {
        var defaults = { "0": 8, "1": 6, "2": 4, "3": 2 };
        next.priority = defaults[v] !== void 0 ? defaults[v] : 1;
      }
      setForm(next);
    }
    function submit() {
      if (!String(form.title).trim()) {
        setError(t.needTitle);
        return;
      }
      if (!form.tableId) {
        setError(t.needTable);
        return;
      }
      if (!form.publishDate || !form.targetDate) {
        setError(t.needDate);
        return;
      }
      setBusy(true);
      setError("");
      var args = {
        title: String(form.title).trim(),
        description: String(form.description || ""),
        type: String(form.type),
        status: source === "2" ? "0" : String(form.status),
        priority: Number(form.priority) || 0,
        tableId: String(form.tableId),
        publishDate: form.publishDate,
        targetDate: form.targetDate,
        source
      };
      if (source !== "0" && origin) {
        args.timelineKey = String(origin.timelineKey || origin.id);
        args.restartKey = source === "2" ? String(origin.id) : void 0;
      }
      if (args.status === "2") {
        args.doneDate = form.doneDate || today();
        args.difficulty = Number(form.difficulty) || 0;
      }
      if (args.status === "1") args.shutdownDate = form.shutdownDate || today();
      props.api.call("tasks.create", args).then(function(r) {
        if (!r || !r.ok) {
          setError(r && r.error || "create failed");
          setBusy(false);
          return;
        }
        props.onCreated();
      }).catch(function(e) {
        setError(String(e && e.message || e));
        setBusy(false);
      });
    }
    var title = source === "2" ? t.restartTitle : source === "1" ? t.newTimeline : t.newTask;
    return h2(
      "div",
      { className: "wbt-modal-mask", onMouseDown: function(e) {
        if (e.target === e.currentTarget) props.onClose();
      } },
      h2(
        "div",
        { className: "wbt-modal" },
        h2("div", { className: "wbt-modal-head" }, h2("h3", null, title), h2("button", { className: "wbt-icon", onClick: props.onClose }, "\xD7")),
        source !== "0" && origin ? h2("div", { className: "wbt-hint" }, "\u6765\u6E90\uFF1A" + (origin.title || origin.id) + (source === "2" ? " \xB7 \u91CD\u542F\u94FE " + (origin.restartKey || origin.id) : " \xB7 \u65F6\u95F4\u7EBF " + (origin.timelineKey || origin.id))) : null,
        h2(
          "div",
          { className: "wbt-form" },
          h2("label", { className: "wbt-field full" }, h2("span", null, t.titleField + " *"), h2("input", { className: "wbt-input", value: form.title, onChange: function(e) {
            set("title", e.target.value);
          }, autoFocus: true })),
          h2("label", { className: "wbt-field full" }, h2("span", null, t.desc), h2("textarea", { className: "wbt-textarea", rows: 2, value: form.description, onChange: function(e) {
            set("description", e.target.value);
          } })),
          h2("label", { className: "wbt-field" }, h2("span", null, t.type), h2("select", { className: "wbt-select", value: form.type, onChange: function(e) {
            set("type", e.target.value);
          } }, TYPES.map(function(x) {
            return h2("option", { key: x.id, value: x.id }, x.zh);
          }))),
          h2("label", { className: "wbt-field" }, h2("span", null, t.status), h2(
            "select",
            { className: "wbt-select", value: source === "2" ? "0" : form.status, disabled: source === "2", onChange: function(e) {
              set("status", e.target.value);
            } },
            h2("option", { value: "0" }, "\u5DF2\u5F00\u542F"),
            h2("option", { value: "2" }, "\u5DF2\u5B8C\u6210"),
            h2("option", { value: "1" }, "\u5DF2\u5173\u95ED")
          )),
          h2("label", { className: "wbt-field" }, h2("span", null, t.priority + "\uFF080\u201310\uFF09"), h2("input", { className: "wbt-input", type: "number", min: 0, max: 10, value: form.priority, onChange: function(e) {
            set("priority", e.target.value);
          } })),
          h2("label", { className: "wbt-field" }, h2("span", null, t.table + " *"), h2("select", { className: "wbt-select", value: form.tableId, onChange: function(e) {
            set("tableId", e.target.value);
          } }, tables.map(function(x) {
            return h2("option", { key: x.id, value: x.id }, "\u3000".repeat(x.depth) + x.name);
          }))),
          h2("label", { className: "wbt-field" }, h2("span", null, t.publishDate), h2("input", { className: "wbt-input", type: "date", value: form.publishDate, onChange: function(e) {
            set("publishDate", e.target.value);
          } })),
          h2("label", { className: "wbt-field" }, h2("span", null, t.targetDate), h2("input", { className: "wbt-input", type: "date", value: form.targetDate, onChange: function(e) {
            set("targetDate", e.target.value);
          } })),
          source !== "2" && form.status === "2" ? h2("label", { className: "wbt-field" }, h2("span", null, t.doneDate), h2("input", { className: "wbt-input", type: "date", value: form.doneDate, onChange: function(e) {
            set("doneDate", e.target.value);
          } })) : null,
          source !== "2" && form.status === "2" ? h2("label", { className: "wbt-field" }, h2("span", null, t.difficulty + "\uFF080\u20135\uFF09"), h2("input", { className: "wbt-input", type: "number", min: 0, max: 5, step: 0.5, value: form.difficulty, onChange: function(e) {
            set("difficulty", e.target.value);
          } })) : null,
          source !== "2" && form.status === "1" ? h2("label", { className: "wbt-field" }, h2("span", null, t.shutdownDate), h2("input", { className: "wbt-input", type: "date", value: form.shutdownDate, onChange: function(e) {
            set("shutdownDate", e.target.value);
          } })) : null
        ),
        error ? h2("div", { className: "wbt-err" }, error) : null,
        h2(
          "div",
          { className: "wbt-modal-foot" },
          h2("button", { className: "wbt-btn ghost", onClick: props.onClose }, t.cancel),
          h2("button", { className: "wbt-btn primary", disabled: isBusy, onClick: submit }, isBusy ? "\u2026" : t.create)
        )
      )
    );
  }
  function TimelineModal(props) {
    var t = props.t;
    var task = props.task;
    var s = React2.useState({ items: [], loading: true, error: "" });
    var state = s[0], setState = s[1];
    React2.useEffect(function() {
      props.api.call("tasks.timeline", { timelineKey: task.timelineKey }).then(function(r) {
        if (r && r.ok) setState({ items: Array.isArray(r.result) ? r.result : [], loading: false, error: "" });
        else setState({ items: [], loading: false, error: r && r.error || "load failed" });
      }).catch(function(e) {
        setState({ items: [], loading: false, error: String(e && e.message || e) });
      });
    }, [task.timelineKey]);
    var items = state.items;
    var last = items.length ? items[items.length - 1] : task;
    return h2(
      "div",
      { className: "wbt-modal-mask", onMouseDown: function(e) {
        if (e.target === e.currentTarget) props.onClose();
      } },
      h2(
        "div",
        { className: "wbt-modal wide" },
        h2(
          "div",
          { className: "wbt-modal-head" },
          h2("h3", null, t.timelineTitle),
          h2("button", { className: "wbt-btn", onClick: function() {
            props.onCreateTimeline(last);
          } }, "\uFF0B " + t.newTimeline),
          h2("button", { className: "wbt-icon", onClick: props.onClose }, "\xD7")
        ),
        state.loading ? h2("div", { className: "wbt-hint" }, t.loading) : state.error ? h2("div", { className: "wbt-err" }, t.error + state.error) : items.length === 0 ? h2("div", { className: "wbt-empty" }, t.noTimeline) : h2("div", { className: "wbt-timeline" }, items.map(function(x, i) {
          var st = statusInfo(x.status);
          return h2(
            "div",
            { className: "wbt-tl-item", key: x.id },
            h2("div", { className: "wbt-tl-rail" }, h2("div", { className: "wbt-tl-dot" }), i < items.length - 1 ? h2("div", { className: "wbt-tl-line" }) : null),
            h2(
              "div",
              { className: "wbt-tl-body" },
              h2(
                "div",
                { className: "wbt-row" },
                h2("span", { className: "wbt-badge " + st.cls }, st.zh),
                h2("span", { className: "wbt-tl-title" }, x.title),
                h2("span", { className: "wbt-pill" }, "P" + x.priority)
              ),
              h2(
                "div",
                { className: "wbt-tl-meta" },
                h2("span", null, "\u53D1\u5E03 " + (x.publishDate || "-")),
                h2("span", null, "\u8BA1\u5212 " + (x.targetDate || "-")),
                x.doneDate ? h2("span", null, "\u5B8C\u6210 " + x.doneDate) : null,
                x.shutdownDate ? h2("span", null, "\u5173\u95ED " + x.shutdownDate) : null
              ),
              h2(PathCrumbs, { path: x.path })
            )
          );
        }))
      )
    );
  }
  function DoneModal(props) {
    var t = props.t;
    var s = React2.useState(1);
    var value = s[0], setValue = s[1];
    var busy = React2.useState(false);
    var isBusy = busy[0], setBusy = busy[1];
    return h2(
      "div",
      { className: "wbt-modal-mask", onMouseDown: function(e) {
        if (e.target === e.currentTarget) props.onClose();
      } },
      h2(
        "div",
        { className: "wbt-modal", style: { width: "380px" } },
        h2("div", { className: "wbt-modal-head" }, h2("h3", null, t.complete + " \xB7 " + props.task.title), h2("button", { className: "wbt-icon", onClick: props.onClose }, "\xD7")),
        h2("div", { className: "wbt-hint" }, t.difficultyHint),
        h2(
          "div",
          { className: "wbt-row" },
          h2("span", { className: "wbt-stars", style: { fontSize: "22px" } }, stars(value)),
          h2("input", { type: "range", min: 0.5, max: 5, step: 0.5, value, onChange: function(e) {
            setValue(Number(e.target.value));
          }, style: { flex: 1 } }),
          h2("b", null, value.toFixed(1))
        ),
        h2(
          "div",
          { className: "wbt-modal-foot" },
          h2("button", { className: "wbt-btn ghost", onClick: props.onClose }, t.cancel),
          h2("button", { className: "wbt-btn primary", disabled: isBusy, onClick: function() {
            if (!value || value <= 0) return;
            setBusy(true);
            props.api.call("tasks.update", { id: props.task.id, type: "STATUS", status: "2", date: today(), difficulty: value }).then(function(r) {
              setBusy(false);
              if (r && r.ok) props.onDone();
              else props.onError(r && r.error || "update failed");
            });
          } }, isBusy ? "\u2026" : t.confirm)
        )
      )
    );
  }
  function BatchModal(props) {
    var t = props.t;
    var items = props.items || [];
    var mode = props.mode;
    var s = React2.useState(mode === "timeline" ? items[0] && items[0].id || "" : props.tables[0] && props.tables[0].id || "");
    var value = s[0], setValue = s[1];
    var busy = React2.useState(false);
    var isBusy = busy[0], setBusy = busy[1];
    var err = React2.useState("");
    var error = err[0], setError = err[1];
    return h2(
      "div",
      { className: "wbt-modal-mask", onMouseDown: function(e) {
        if (e.target === e.currentTarget) props.onClose();
      } },
      h2(
        "div",
        { className: "wbt-modal" },
        h2("div", { className: "wbt-modal-head" }, h2("h3", null, mode === "timeline" ? t.batchTimeline : t.batchMigrate), h2("button", { className: "wbt-icon", onClick: props.onClose }, "\xD7")),
        h2("div", { className: "wbt-hint" }, mode === "timeline" ? t.chooseBase : t.chooseTable),
        mode === "timeline" ? h2("div", { className: "wbt-list" }, items.map(function(x) {
          return h2(
            "label",
            { key: x.id, className: "wbt-check", style: { padding: "6px 2px" } },
            h2("input", { type: "radio", name: "base", checked: String(value) === String(x.id), onChange: function() {
              setValue(String(x.id));
            } }),
            h2("span", null, x.title + "\uFF08timeline " + (x.timelineKey || "-") + "\uFF09")
          );
        })) : h2("select", { className: "wbt-select", value, onChange: function(e) {
          setValue(e.target.value);
        } }, props.tables.map(function(x) {
          return h2("option", { key: x.id, value: x.id }, "\u3000".repeat(x.depth) + x.name);
        })),
        error ? h2("div", { className: "wbt-err" }, error) : null,
        h2(
          "div",
          { className: "wbt-modal-foot" },
          h2("button", { className: "wbt-btn ghost", onClick: props.onClose }, t.cancel),
          h2("button", { className: "wbt-btn primary", disabled: isBusy, onClick: function() {
            if (!value) {
              setError(mode === "timeline" ? t.needBase : t.needTable);
              return;
            }
            setBusy(true);
            if (mode === "timeline") {
              var base = null;
              for (var i = 0; i < items.length; i++) if (String(items[i].id) === String(value)) base = items[i];
              if (!base || !base.timelineKey) {
                setError(t.needBase);
                setBusy(false);
                return;
              }
              props.api.call("tasks.timelineRefactor", { ids: items.map(function(x) {
                return x.id;
              }), timelineKey: base.timelineKey }).then(function(r) {
                setBusy(false);
                if (r && r.ok) props.onDone();
                else setError(r && r.error || "failed");
              });
            } else {
              props.api.call("tasks.migrate", { ids: items.map(function(x) {
                return x.id;
              }), tableId: value }).then(function(r) {
                setBusy(false);
                if (r && r.ok) props.onDone();
                else setError(r && r.error || "failed");
              });
            }
          } }, isBusy ? "\u2026" : t.confirm)
        )
      )
    );
  }
  function TasksView(props) {
    var t = COPY[props.lang === "en" ? "en" : "zh"];
    var api = props.api;
    var treeS = React2.useState([]);
    var tree = treeS[0], setTree = treeS[1];
    var expS = React2.useState(/* @__PURE__ */ new Set(["1", "2"]));
    var expanded = expS[0], setExpanded = expS[1];
    var targetS = React2.useState({ groupId: "1", tableId: null });
    var target = targetS[0], setTarget = targetS[1];
    var pathS = React2.useState([]);
    var currentPath = pathS[0], setCurrentPath = pathS[1];
    var tabS = React2.useState(0);
    var tab = tabS[0], setTab = tabS[1];
    var viewS = React2.useState("list");
    var view = viewS[0], setView = viewS[1];
    var searchS = React2.useState("");
    var searchDraft = searchS[0], setSearchDraft = searchS[1];
    var titleS = React2.useState("");
    var titleKey = titleS[0], setTitleKey = titleS[1];
    var filterS = React2.useState(true);
    var filterRestarted = filterS[0], setFilterRestarted = filterS[1];
    var typesS = React2.useState(["0", "1", "2", "3"]);
    var checkedTypes = typesS[0], setCheckedTypes = typesS[1];
    var pageS = React2.useState(1);
    var pageNumber = pageS[0], setPageNumber = pageS[1];
    var sizeS = React2.useState(12);
    var pageSize = sizeS[0], setPageSize = sizeS[1];
    var dataS = React2.useState({ records: [], total: 0, current: 1, size: 0, pageable: false });
    var data = dataS[0], setData = dataS[1];
    var loadingS = React2.useState(true);
    var loading = loadingS[0], setLoading = loadingS[1];
    var errorS = React2.useState("");
    var error = errorS[0], setError = errorS[1];
    var drawerS = React2.useState(false);
    var drawer = drawerS[0], setDrawer = drawerS[1];
    var managerS = React2.useState(false);
    var manager = managerS[0], setManager = managerS[1];
    var selModeS = React2.useState(false);
    var selectionMode = selModeS[0], setSelectionMode = selModeS[1];
    var selS = React2.useState(/* @__PURE__ */ new Set());
    var selectedIds = selS[0], setSelectedIds = selS[1];
    var selItemsS = React2.useState([]);
    var selectedItems = selItemsS[0], setSelectedItems = selItemsS[1];
    var selOpenS = React2.useState(false);
    var selectedOpen = selOpenS[0], setSelectedOpen = selOpenS[1];
    var batchS = React2.useState(null);
    var batchMode = batchS[0], setBatchMode = batchS[1];
    var createS = React2.useState(null);
    var createState = createS[0], setCreateState = createS[1];
    var timelineS = React2.useState(null);
    var timelineTask = timelineS[0], setTimelineTask = timelineS[1];
    var doneS = React2.useState(null);
    var doneTask = doneS[0], setDoneTask = doneS[1];
    var editS = React2.useState(null);
    var edit = editS[0], setEdit = editS[1];
    var editNameS = React2.useState("");
    var editName = editNameS[0], setEditName = editNameS[1];
    var dragS = React2.useState(null);
    var dragId = dragS[0], setDragId = dragS[1];
    var dropS = React2.useState(null);
    var dropId = dropS[0], setDropId = dropS[1];
    var toastS = React2.useState("");
    var toast = toastS[0], setToast = toastS[1];
    var refreshRef = React2.useRef({});
    function say(msg) {
      setToast(String(msg || ""));
    }
    React2.useEffect(function() {
      if (!toast) return;
      var id = setTimeout(function() {
        setToast("");
      }, 3200);
      return function() {
        clearTimeout(id);
      };
    }, [toast]);
    var refreshTree = React2.useCallback(function() {
      return api.call("taskNodes.tree").then(function(r) {
        if (r && r.ok) setTree(Array.isArray(r.result) ? r.result : []);
        else setError(r && r.error || "tree load failed");
      }).catch(function(e) {
        setError(String(e && e.message || e));
      });
    }, [api]);
    var refreshPath = React2.useCallback(function(id) {
      if (!id) {
        setCurrentPath([]);
        return Promise.resolve();
      }
      return api.call("taskNodes.path", { id }).then(function(r) {
        if (r && r.ok) setCurrentPath(Array.isArray(r.result) ? r.result : []);
      }).catch(function() {
      });
    }, [api]);
    var refreshList = React2.useCallback(function() {
      setLoading(true);
      return api.call("tasks.list", {
        tab,
        titleKey,
        tableId: target.tableId,
        groupId: target.tableId ? null : target.groupId,
        pageNumber,
        pageSize,
        filterRestarted,
        checkedTypes
      }).then(function(r) {
        setLoading(false);
        if (r && r.ok) {
          setData(r.result || { records: [], total: 0, current: 1, size: 0, pageable: false });
          setError("");
        } else {
          setError(r && r.error || "list load failed");
        }
      }).catch(function(e) {
        setLoading(false);
        setError(String(e && e.message || e));
      });
    }, [api, tab, titleKey, target.tableId, target.groupId, pageNumber, pageSize, filterRestarted, checkedTypes]);
    refreshRef.current = { tree: refreshTree, list: refreshList, path: refreshPath };
    React2.useEffect(function() {
      injectCss();
      refreshTree();
      refreshPath("1");
    }, [refreshTree, refreshPath]);
    React2.useEffect(function() {
      refreshList();
    }, [refreshList]);
    React2.useEffect(function() {
      var off = api.subscribe(function(p) {
        if (!p) return;
        if (p.event === "tasks-changed") refreshRef.current.list();
        if (p.event === "task-nodes-changed") {
          refreshRef.current.tree();
          refreshRef.current.path(target.tableId || target.groupId);
        }
      });
      return off;
    }, [api, target.tableId, target.groupId]);
    React2.useEffect(function() {
      refreshPath(target.tableId || target.groupId);
    }, [target.tableId, target.groupId, refreshPath]);
    function update(task, patch) {
      var args = Object.assign({ id: task.id }, patch);
      api.call("tasks.update", args).then(function(r) {
        if (r && r.ok) refreshList();
        else say(r && r.error || "update failed");
      });
    }
    function pickNode(node) {
      if (String(node.type) === "1") setTarget({ groupId: String(node.parent || node.parentId || ""), tableId: String(node.id) });
      else setTarget({ groupId: String(node.id), tableId: null });
      setPageNumber(1);
      setDrawer(false);
    }
    function pickPath(p, i, path) {
      if (String(p.type) === "1") {
        var parent = i > 0 ? path[i - 1] : null;
        setTarget({ groupId: parent ? String(parent.id) : "", tableId: String(p.id) });
      } else {
        setTarget({ groupId: String(p.id), tableId: null });
      }
      setPageNumber(1);
    }
    function toggleExpanded(id) {
      var next = new Set(expanded);
      if (next.has(String(id))) next.delete(String(id));
      else next.add(String(id));
      setExpanded(next);
    }
    function addNode(parentId, type) {
      api.call("taskNodes.create", { parentId, type }).then(function(r) {
        if (r && r.ok) {
          var next = new Set(expanded);
          next.add(String(parentId));
          setExpanded(next);
          refreshTree();
          say(t.created);
        } else say(r && r.error || "create failed");
      });
    }
    function renameNode(id, name) {
      if (!edit || String(edit.id) !== String(id)) return;
      var v = String(name || "").trim();
      if (!v || v === String(edit.name || "")) {
        setEdit(null);
        return;
      }
      api.call("taskNodes.rename", { id, name: v }).then(function(r) {
        setEdit(null);
        if (r && r.ok) {
          refreshTree();
          say(t.saved);
        } else say(r && r.error || "rename failed");
      });
    }
    function deleteNode(node) {
      if (!window.confirm(t.deleteConfirm)) return;
      api.call("taskNodes.delete", { id: node.id }).then(function(r) {
        if (r && r.ok) {
          refreshTree();
          setTarget({ groupId: "1", tableId: null });
          setPageNumber(1);
          say(t.deleted);
        } else say(r && r.error || "delete failed");
      });
    }
    function moveNode(sourceId, targetId, moveType) {
      setDropId(null);
      setDragId(null);
      api.call("taskNodes.move", { sourceId, targetId, moveType }).then(function(r) {
        if (r && r.ok) {
          refreshTree();
          say(t.updated);
        } else say(r && r.error || "move failed");
      });
    }
    function toggleType(id) {
      var next = checkedTypes.slice();
      var idx = next.indexOf(id);
      if (idx >= 0) next.splice(idx, 1);
      else next.push(id);
      if (!next.length) next = [id];
      setCheckedTypes(next);
      setPageNumber(1);
    }
    function toggleSelect(id) {
      var next = new Set(selectedIds);
      if (next.has(String(id))) next.delete(String(id));
      else next.add(String(id));
      setSelectedIds(next);
    }
    function openSelected() {
      var ids = Array.from(selectedIds);
      if (!ids.length) {
        say("\u8BF7\u5148\u52FE\u9009\u4EFB\u52A1");
        return;
      }
      api.call("tasks.selected", { ids }).then(function(r) {
        if (r && r.ok) {
          setSelectedItems(Array.isArray(r.result) ? r.result : []);
          setSelectedOpen(true);
        } else say(r && r.error || "load failed");
      });
    }
    function clearSelection() {
      setSelectedIds(/* @__PURE__ */ new Set());
      setSelectedItems([]);
      setSelectedOpen(false);
      setBatchMode(null);
    }
    function batchDone() {
      setBatchMode(null);
      setSelectedOpen(false);
      clearSelection();
      refreshList();
      say(t.updated);
    }
    var tables = allTables(tree);
    var firstTable = findFirstTable(tree);
    var pageable = tab > 4 && tab < 9;
    var totalPages = pageable && data.total ? Math.ceil(data.total / pageSize) : 1;
    var treeProps = {
      t,
      expanded,
      selectedTable: target.tableId,
      selectedGroup: target.groupId,
      manager,
      dragId,
      dropId,
      edit,
      editName,
      onToggle: toggleExpanded,
      onSelect: pickNode,
      onAdd: addNode,
      onEdit: function(node) {
        setEdit({ id: node.id, name: node.name });
        setEditName(node.name);
      },
      onEditName: setEditName,
      onCancelEdit: function() {
        setEdit(null);
      },
      onRename: renameNode,
      onDelete: deleteNode,
      onDragStart: function(id) {
        setDragId(String(id));
      },
      onDragOver: function(id) {
        setDropId(String(id));
      },
      onMove: moveNode
    };
    var treeBody = tree.length ? tree.map(function(n) {
      return h2(TreeNode, Object.assign({}, treeProps, { key: n.id, node: n, depth: 0 }));
    }) : h2("div", { className: "wbt-empty" }, t.emptyTree);
    var filterBar = h2(
      "div",
      { className: "wbt-filters" },
      pageable ? h2("span", { className: "wbt-sum" }, t.total + " " + data.total + " " + t.items) : null,
      tab >= 5 ? h2("span", { className: "wbt-check" }, h2("span", null, t.types + "\uFF1A"), TYPES.map(function(x) {
        return h2(
          "label",
          { key: x.id, className: "wbt-check" },
          h2("input", { type: "checkbox", checked: checkedTypes.indexOf(x.id) >= 0, onChange: function() {
            toggleType(x.id);
          } }),
          x.zh
        );
      })) : null,
      tab === 5 || tab === 8 ? h2(
        "label",
        { className: "wbt-check" },
        h2("input", { type: "checkbox", checked: filterRestarted, onChange: function(e) {
          setFilterRestarted(e.target.checked);
          setPageNumber(1);
        } }),
        t.filterRestarted
      ) : null
    );
    var listBody = loading ? h2("div", { className: "wbt-empty" }, t.loading) : error ? h2("div", { className: "wbt-err" }, t.error + error) : data.records.length === 0 ? h2("div", { className: "wbt-empty" }, t.empty) : h2("div", { className: view === "card" ? "wbt-grid" : "wbt-list" }, data.records.map(function(task) {
      return h2(TaskItem, {
        key: task.id,
        task,
        t,
        lang: props.lang,
        card: view === "card",
        selectionMode,
        checked: selectedIds.has(String(task.id)),
        onCheck: toggleSelect,
        update,
        toast: say,
        onDone: function(x) {
          setDoneTask(x);
        },
        onRestart: function(x) {
          setCreateState({ source: "2", originTask: x });
        },
        onTimeline: function(x) {
          setTimelineTask(x);
        },
        onPathPick: pickPath
      });
    }));
    return h2(
      "div",
      { className: "wbt-root" },
      h2(
        "div",
        { className: "wbt-pathrow" },
        h2(
          "div",
          { className: "wbt-tree-slot" },
          h2("button", { className: "wbt-btn", onClick: function() {
            setDrawer(true);
            refreshTree();
          } }, h2(Icon2, { name: "tree", size: 13 }), t.tree)
        ),
        h2(PathCrumbs, { path: currentPath, onPick: pickPath }),
        h2("div", { className: "wbt-grow" }),
        h2("input", {
          className: "wbt-input wbt-search",
          placeholder: t.search,
          value: searchDraft,
          onChange: function(e) {
            setSearchDraft(e.target.value);
          },
          onKeyDown: function(e) {
            if (e.key === "Enter") {
              setTitleKey(searchDraft);
              setPageNumber(1);
            }
          }
        }),
        h2("button", { className: "wbt-btn ghost", title: t.search, "aria-label": t.search, onClick: function() {
          setTitleKey(searchDraft);
          setPageNumber(1);
        } }, h2(Icon2, { name: "search", size: 14 })),
        h2("button", { className: "wbt-btn " + (selectionMode ? "primary" : "ghost"), onClick: function() {
          if (selectionMode) {
            setSelectionMode(false);
            clearSelection();
          } else setSelectionMode(true);
        } }, h2(Icon2, { name: "select", size: 13 }), selectionMode ? t.cancelSelect : t.select),
        h2("button", { className: "wbt-btn primary", onClick: function() {
          setCreateState({ source: "0", originTask: null, defaultTableId: target.tableId || firstTable && firstTable.id });
        } }, h2(Icon2, { name: "plus", size: 14 }), t.newTask),
        h2("button", { className: "wbt-btn ghost", onClick: function() {
          setView(view === "list" ? "card" : "list");
        } }, h2(Icon2, { name: view === "list" ? "grid" : "list", size: 13 }), view === "list" ? t.card : t.list)
      ),
      h2(
        "div",
        { className: "wbt-body" },
        h2("nav", { className: "wbt-nav" }, TABS.map(function(x, i) {
          var btn = h2("button", {
            key: x.id,
            className: "wbt-tab" + (tab === x.id ? " on" : ""),
            onClick: function() {
              setTab(x.id);
              setPageNumber(1);
            }
          }, t === COPY.zh ? x.zh : x.en);
          if (i !== 5) return btn;
          return [h2("div", { key: "nav-sep", className: "wbt-nav-sep" }), btn];
        })),
        h2(
          "div",
          { className: "wbt-content" },
          filterBar,
          listBody,
          pageable ? h2(
            "div",
            { className: "wbt-pager" },
            h2("button", { className: "wbt-btn ghost", disabled: pageNumber <= 1, onClick: function() {
              setPageNumber(Math.max(1, pageNumber - 1));
            } }, h2(Icon2, { name: "left", size: 14 })),
            h2("span", null, t.page + " " + pageNumber + " / " + totalPages),
            h2(
              "select",
              { className: "wbt-select", value: pageSize, onChange: function(e) {
                setPageSize(Number(e.target.value));
                setPageNumber(1);
              } },
              [6, 12, 24].map(function(n) {
                return h2("option", { key: n, value: n }, n + " / " + t.page);
              })
            ),
            h2("button", { className: "wbt-btn ghost", disabled: pageNumber >= totalPages, onClick: function() {
              setPageNumber(Math.min(totalPages, pageNumber + 1));
            } }, h2(Icon2, { name: "right", size: 14 }))
          ) : null
        )
      ),
      selectionMode && selectedIds.size ? h2(
        "div",
        { className: "wbt-selbar" },
        h2("b", null, t.selected + " " + selectedIds.size),
        h2("button", { className: "wbt-btn", onClick: openSelected }, t.selectedTasks),
        h2("button", { className: "wbt-btn", onClick: function() {
          setBatchMode("timeline");
          openSelected();
        } }, t.batchTimeline),
        h2("button", { className: "wbt-btn", onClick: function() {
          setBatchMode("migrate");
          openSelected();
        } }, t.batchMigrate),
        h2("button", { className: "wbt-btn ghost", onClick: clearSelection }, t.clear)
      ) : null,
      drawer ? h2(
        "div",
        { className: "wbt-drawer-mask", onMouseDown: function(e) {
          if (e.target === e.currentTarget) setDrawer(false);
        } },
        h2(
          "div",
          { className: "wbt-drawer" },
          h2(
            "div",
            { className: "wbt-drawer-head" },
            h2("b", { style: { flex: 1 } }, t.tree),
            h2(
              "label",
              { className: "wbt-check", title: t.manager },
              h2("input", { type: "checkbox", checked: manager, onChange: function(e) {
                setManager(e.target.checked);
              } }),
              t.manager
            ),
            h2("button", { className: "wbt-icon", onClick: function() {
              setDrawer(false);
            } }, "\xD7")
          ),
          h2("div", { className: "wbt-drawer-body" }, treeBody),
          h2("div", { className: "wbt-drawer-foot" }, "\u70B9\u51FB\u4EFB\u52A1\u8868\u7B5B\u9009\u4EFB\u52A1\uFF1B\u7BA1\u7406\u6A21\u5F0F\u53EF\u62D6\u62FD\u3001\u5220\u9664\u8282\u70B9")
        )
      ) : null,
      createState ? h2(CreateModal, {
        key: (createState.source || "0") + "-" + (createState.originTask && createState.originTask.id || ""),
        t,
        api,
        tree,
        source: createState.source,
        originTask: createState.originTask,
        defaultTableId: createState.defaultTableId,
        onClose: function() {
          setCreateState(null);
        },
        onCreated: function() {
          setCreateState(null);
          refreshList();
          refreshTree();
          say(t.created);
        }
      }) : null,
      timelineTask ? h2(TimelineModal, {
        key: timelineTask.id,
        t,
        api,
        task: timelineTask,
        onClose: function() {
          setTimelineTask(null);
        },
        onCreateTimeline: function(originTask) {
          setTimelineTask(null);
          setCreateState({ source: "1", originTask, defaultTableId: originTask.tableId });
        }
      }) : null,
      doneTask ? h2(DoneModal, {
        key: doneTask.id,
        t,
        api,
        task: doneTask,
        onClose: function() {
          setDoneTask(null);
        },
        onDone: function() {
          setDoneTask(null);
          refreshList();
          say(t.doneSuccess);
        },
        onError: function(e) {
          setDoneTask(null);
          say(e);
        }
      }) : null,
      selectedOpen && batchMode ? h2(BatchModal, {
        key: batchMode,
        t,
        api,
        mode: batchMode,
        items: selectedItems,
        tables,
        onClose: function() {
          setBatchMode(null);
        },
        onDone: batchDone
      }) : null,
      toast ? h2("div", { className: "wbt-toast" }, toast) : null
    );
  }
  host.registerAddon({
    id: "wb-addon-tasks",
    version: "2.4.2",
    views: [{
      id: "tasks",
      title: { zh: "\u4EFB\u52A1\u8BB0\u5F55", en: "Tasks" },
      component: TasksView
    }]
  });
  module.exports = { name: "dsh-workbench-tasks", inject: [], apply: function() {
  } };
})();
    return module.exports;
  },
});
