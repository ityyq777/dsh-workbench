// 由 scripts/build-addon-clients.mjs 生成；请修改 client/client.src.cjs 后重新构建。
window.__ModuleLoader__ = window.__ModuleLoader__ || { modules: {}, load: function (m) { this.modules[m.id] = m.factory; } };
window.__ModuleLoader__.load({
  id: "dsh-workbench-tags",
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

// node_modules/.pnpm/lucide-react@1.70.0_react@19.3.1/node_modules/lucide-react/dist/esm/icons/search.mjs
var search_exports = {};
__export(search_exports, {
  __iconData: () => __iconData,
  default: () => Search
});
var __iconData, Search;
var init_search = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.3.1/node_modules/lucide-react/dist/esm/icons/search.mjs"() {
    init_createLucideIcon();
    __iconData = {
      name: "search",
      size: 24,
      node: [
        ["path", { d: "m21 21-4.34-4.34", key: "14j7rj" }],
        ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }]
      ]
    };
    __iconData.node;
    Search = createLucideIcon(__iconData);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.3.1/node_modules/lucide-react/dist/esm/icons/x.mjs
var x_exports = {};
__export(x_exports, {
  __iconData: () => __iconData2,
  default: () => X
});
var __iconData2, X;
var init_x = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.3.1/node_modules/lucide-react/dist/esm/icons/x.mjs"() {
    init_createLucideIcon();
    __iconData2 = {
      name: "x",
      size: 24,
      node: [
        ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
        ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
      ]
    };
    __iconData2.node;
    X = createLucideIcon(__iconData2);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.3.1/node_modules/lucide-react/dist/esm/icons/plus.mjs
var plus_exports = {};
__export(plus_exports, {
  __iconData: () => __iconData3,
  default: () => Plus
});
var __iconData3, Plus;
var init_plus = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.3.1/node_modules/lucide-react/dist/esm/icons/plus.mjs"() {
    init_createLucideIcon();
    __iconData3 = {
      name: "plus",
      size: 24,
      node: [
        ["path", { d: "M5 12h14", key: "1ays0h" }],
        ["path", { d: "M12 5v14", key: "s699le" }]
      ]
    };
    __iconData3.node;
    Plus = createLucideIcon(__iconData3);
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

// packages/addons/tags/client/client.src.cjs
var React = require("react");
var h = React.createElement;
(function() {
  "use strict";
  var host = window.__WB_HOST__;
  if (!host) {
    console.error("[wb-addon-tags] \u5BBF\u4E3B\u6865 window.__WB_HOST__ \u4E0D\u5B58\u5728\uFF0C\u89C6\u56FE\u672A\u6CE8\u518C");
    return { name: "dsh-workbench-tags", inject: [], apply: function() {
    } };
  }
  var React2 = require("react");
  var h2 = React2.createElement;
  var ICONS = {
    "search": (init_search(), __toCommonJS(search_exports)).default,
    "x": (init_x(), __toCommonJS(x_exports)).default,
    "plus": (init_plus(), __toCommonJS(plus_exports)).default,
    "trash": (init_trash_2(), __toCommonJS(trash_2_exports)).default
  };
  function Icon2(props) {
    var C = ICONS[props.name];
    if (!C) return null;
    return h2(C, { size: props.size || 14, strokeWidth: 2, "aria-hidden": "true", className: "wbg-svg" });
  }
  var COPY = {
    zh: {
      title: "\u6807\u7B7E",
      hint: "\u6807\u7B7E\u7528\u4E8E\u7ED9\u7AD9\u70B9\u7B49\u4E1A\u52A1\u5F52\u7C7B\uFF1B\u6240\u6709\u6570\u636E\u4FDD\u5B58\u5728\u672C\u5730\u3002",
      search: "\u641C\u7D22\u6807\u7B7E\u540D\u79F0",
      find: "\u641C\u7D22",
      clear: "\u6E05\u7A7A",
      create: "\u65B0\u5EFA\u6807\u7B7E",
      name: "\u6807\u7B7E\u540D\u79F0",
      namePlaceholder: "\u8F93\u5165\u6807\u7B7E\u540D\u79F0\uFF0C\u6700\u591A 64 \u5B57",
      createTime: "\u521B\u5EFA\u65F6\u95F4",
      ops: "\u64CD\u4F5C",
      empty: "\u8FD8\u6CA1\u6709\u6807\u7B7E\uFF0C\u5148\u521B\u5EFA\u4E00\u4E2A\u5427",
      noMatch: "\u6CA1\u6709\u5339\u914D\u7684\u6807\u7B7E",
      loading: "\u52A0\u8F7D\u4E2D\u2026",
      error: "\u52A0\u8F7D\u5931\u8D25\uFF1A",
      retry: "\u91CD\u8BD5",
      save: "\u521B\u5EFA",
      cancel: "\u53D6\u6D88",
      del: "\u5220\u9664",
      confirmDel: "\u786E\u8BA4\u5220\u9664",
      confirmBatch: "\u786E\u8BA4\u5220\u9664\u9009\u4E2D",
      selected: "\u5DF2\u9009",
      selectAll: "\u5168\u9009",
      total: "\u5171",
      items: "\u4E2A\u6807\u7B7E",
      page: "\u7B2C",
      pageUnit: "\u9875",
      prev: "\u4E0A\u4E00\u9875",
      next: "\u4E0B\u4E00\u9875",
      created: "\u5DF2\u521B\u5EFA",
      deleted: "\u5DF2\u5220\u9664",
      needName: "\u6807\u7B7E\u540D\u79F0\u4E0D\u80FD\u4E3A\u7A7A",
      tooLong: "\u6807\u7B7E\u540D\u79F0\u4E0D\u80FD\u8D85\u8FC7 64 \u4E2A\u5B57\u7B26",
      duplicate: "\u6807\u7B7E\u5DF2\u5B58\u5728",
      batchHint: "\u5220\u9664\u53EA\u79FB\u9664\u6807\u7B7E\uFF0C\u5173\u8054\u6570\u636E\u4FDD\u7559\u5728\u4E1A\u52A1\u8868\u4E2D"
    },
    en: {
      title: "Tags",
      hint: "Tags classify sites and other business data; everything stays local.",
      search: "Search tag name",
      find: "Search",
      clear: "Clear",
      create: "New tag",
      name: "Tag name",
      namePlaceholder: "Tag name, up to 64 characters",
      createTime: "Created",
      ops: "Actions",
      empty: "No tags yet. Create the first one.",
      noMatch: "No matching tags",
      loading: "Loading\u2026",
      error: "Failed to load: ",
      retry: "Retry",
      save: "Create",
      cancel: "Cancel",
      del: "Delete",
      confirmDel: "Confirm delete",
      confirmBatch: "Delete selected",
      selected: "Selected",
      selectAll: "Select all",
      total: "Total",
      items: "tags",
      page: "Page",
      pageUnit: "",
      prev: "Prev",
      next: "Next",
      created: "Created",
      deleted: "Deleted",
      needName: "Tag name is required",
      tooLong: "Tag name cannot exceed 64 characters",
      duplicate: "Tag already exists",
      batchHint: "Deleting a tag keeps business data in place"
    }
  };
  var PALETTE = ["#5B8FF9", "#5AD8A6", "#F6BD16", "#E8684A", "#6DC8EC", "#9270CA", "#FF9D4D", "#269A99"];
  var CSS = [
    ".wbg-root{--wbg-line:var(--dsw-alias-border-l2,color-mix(in oklab,currentColor 16%,transparent));--wbg-surface:var(--dsw-alias-bg-layer-1,color-mix(in oklab,currentColor 4%,transparent));--wbg-accent:var(--dsw-alias-brand-primary,#11a89b);display:flex;flex-direction:column;gap:12px;min-height:0;color:inherit;font-size:13px}",
    ".wbg-top{display:flex;align-items:flex-start;gap:12px;flex-wrap:wrap}",
    ".wbg-top h2{margin:0;font-size:16px;font-weight:680;letter-spacing:.2px}",
    ".wbg-sub{font-size:12px;opacity:.58;line-height:1.6;margin-top:3px}",
    ".wbg-grow{flex:1;min-width:0}",
    ".wbg-toolbar{display:flex;align-items:center;gap:8px;flex-wrap:wrap}",
    ".wbg-input{border:1px solid var(--wbg-line);background:transparent;color:inherit;border-radius:8px;padding:7px 10px;font-size:13px;outline:none;min-width:0}",
    ".wbg-input:focus{border-color:var(--wbg-accent)}",
    ".wbg-search{width:240px;max-width:46vw}",
    ".wbg-btn{border:1px solid var(--wbg-line);background:var(--wbg-surface);color:inherit;border-radius:8px;padding:7px 11px;font-size:12.5px;cursor:pointer;white-space:nowrap;line-height:1.3;display:inline-flex;align-items:center;gap:5px}",
    ".wbg-svg{display:block;flex:none}",
    ".wbg-btn:hover{border-color:var(--wbg-accent)}",
    ".wbg-btn.primary{background:var(--wbg-accent);border-color:var(--wbg-accent);color:var(--dsw-alias-label-primary-inverted,#fff);font-weight:600}",
    ".wbg-btn.ghost{background:transparent}",
    ".wbg-btn.danger{color:var(--dsw-alias-state-error-primary,#e5484d);border-color:color-mix(in oklab,var(--dsw-alias-state-error-primary,#e5484d) 45%,transparent)}",
    ".wbg-btn:disabled{opacity:.5;cursor:not-allowed}",
    ".wbg-create{display:flex;align-items:center;gap:8px;flex-wrap:wrap;border:1px solid var(--wbg-line);border-radius:10px;padding:10px 12px;background:color-mix(in oklab,var(--wbg-accent) 5%,transparent)}",
    ".wbg-create .wbg-input{flex:1;min-width:200px}",
    ".wbg-formerr{font-size:12px;color:var(--dsw-alias-state-error-primary,#e5484d);flex-basis:100%}",
    ".wbg-listhead{display:flex;align-items:center;gap:8px;font-size:11.5px;opacity:.55;padding:0 4px}",
    ".wbg-listhead .wbg-hname{flex:1;min-width:0}",
    ".wbg-list{display:flex;flex-direction:column;gap:6px;min-height:0}",
    ".wbg-row{display:flex;align-items:center;gap:10px;border:1px solid var(--wbg-line);border-left:3px solid var(--tag-color,#999);border-radius:10px;padding:10px 12px;background:color-mix(in oklab,var(--tag-color,#999) 7%,transparent)}",
    ".wbg-row:hover{background:color-mix(in oklab,var(--tag-color,#999) 11%,transparent)}",
    ".wbg-check{width:15px;height:15px;accent-color:var(--wbg-accent);flex:none;cursor:pointer}",
    ".wbg-chip{display:inline-flex;align-items:center;max-width:100%;border-radius:999px;padding:4px 10px;font-size:12.5px;font-weight:600;line-height:1.2;color:var(--tag-color,#333);background:color-mix(in oklab,var(--tag-color,#999) 18%,transparent);border:1px solid color-mix(in oklab,var(--tag-color,#999) 35%,transparent);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
    ".wbg-name{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
    ".wbg-time{font-size:12px;opacity:.55;white-space:nowrap;font-variant-numeric:tabular-nums}",
    ".wbg-ops{display:flex;align-items:center;gap:6px;flex:none}",
    ".wbg-empty,.wbg-loading{border:1px dashed var(--wbg-line);border-radius:10px;padding:38px 16px;text-align:center;font-size:12.5px;opacity:.6}",
    ".wbg-error{border:1px solid color-mix(in oklab,var(--dsw-alias-state-error-primary,#e5484d) 40%,transparent);border-radius:10px;padding:12px 14px;color:var(--dsw-alias-state-error-primary,#e5484d);font-size:12.5px;display:flex;gap:10px;align-items:center;flex-wrap:wrap}",
    ".wbg-pager{display:flex;align-items:center;gap:10px;flex-wrap:wrap;font-size:12px;opacity:.72;padding-top:2px}",
    ".wbg-pager .wbg-grow{flex:1}",
    ".wbg-batch{display:flex;align-items:center;gap:8px;flex-wrap:wrap;font-size:12px;border:1px solid color-mix(in oklab,var(--wbg-accent) 35%,transparent);background:color-mix(in oklab,var(--wbg-accent) 7%,transparent);border-radius:9px;padding:7px 10px}",
    ".wbg-hint{font-size:11.5px;opacity:.55;line-height:1.5}",
    ".wbg-toast{position:fixed;left:50%;bottom:26px;transform:translateX(-50%);z-index:820;background:var(--dsw-alias-toast-bg,rgba(20,20,20,.88));color:var(--dsw-alias-toast-label,#fff);border-radius:9px;padding:9px 14px;font-size:12.5px;box-shadow:0 8px 24px rgba(0,0,0,.18);pointer-events:none}",
    "@media (max-width:760px){.wbg-search{width:100%;max-width:none}.wbg-toolbar .wbg-grow{display:none}.wbg-time{display:none}.wbg-row{padding:9px 10px}.wbg-ops .wbg-btn{padding:6px 8px}}"
  ].join("\n");
  function injectCss() {
    if (typeof document === "undefined") return;
    var old = document.getElementById("wb-addon-tags-css");
    if (old) {
      old.textContent = CSS;
      return;
    }
    var s = document.createElement("style");
    s.id = "wb-addon-tags-css";
    s.setAttribute("data-wb-addon", "wb-addon-tags");
    s.textContent = CSS;
    document.head.appendChild(s);
  }
  function colorFor(seed) {
    var s = String(seed || "");
    var n = 0;
    for (var i = 0; i < s.length; i++) n = n * 31 + s.charCodeAt(i) >>> 0;
    return PALETTE[n % PALETTE.length];
  }
  function TagsView(props) {
    var api = props.api;
    var lang = props.lang === "en" ? "en" : "zh";
    var t = COPY[lang];
    var rowsS = React2.useState([]);
    var rows = rowsS[0], setRows = rowsS[1];
    var totalS = React2.useState(0);
    var total = totalS[0], setTotal = totalS[1];
    var pagesS = React2.useState(0);
    var pages = pagesS[0], setPages = pagesS[1];
    var pageS = React2.useState(1);
    var page = pageS[0], setPage = pageS[1];
    var textS = React2.useState("");
    var text = textS[0], setText = textS[1];
    var queryS = React2.useState("");
    var query = queryS[0], setQuery = queryS[1];
    var loadingS = React2.useState(true);
    var loading = loadingS[0], setLoading = loadingS[1];
    var errorS = React2.useState("");
    var error = errorS[0], setError = errorS[1];
    var toastS = React2.useState("");
    var toast = toastS[0], setToast = toastS[1];
    var creatingS = React2.useState(false);
    var creating = creatingS[0], setCreating = creatingS[1];
    var nameS = React2.useState("");
    var name = nameS[0], setName = nameS[1];
    var formErrorS = React2.useState("");
    var formError = formErrorS[0], setFormError = formErrorS[1];
    var savingS = React2.useState(false);
    var saving = savingS[0], setSaving = savingS[1];
    var selectedS = React2.useState([]);
    var selected = selectedS[0], setSelected = selectedS[1];
    var confirmS = React2.useState("");
    var confirmId = confirmS[0], setConfirmId = confirmS[1];
    var confirmAllS = React2.useState(false);
    var confirmAll = confirmAllS[0], setConfirmAll = confirmAllS[1];
    var busyS = React2.useState(false);
    var busy = busyS[0], setBusy = busyS[1];
    var refreshRef = React2.useRef(null);
    var pageSize = 18;
    function say(msg) {
      setToast(String(msg || ""));
    }
    React2.useEffect(function() {
      if (!toast) return;
      var id = setTimeout(function() {
        setToast("");
      }, 2600);
      return function() {
        clearTimeout(id);
      };
    }, [toast]);
    var refreshList = React2.useCallback(function() {
      setLoading(true);
      return api.call("tags.list", { pageNumber: page, pageSize, text: query }).then(function(r) {
        setLoading(false);
        if (r && r.ok) {
          var data = r.result || {};
          setRows(Array.isArray(data.records) ? data.records : []);
          setTotal(Number(data.total || 0));
          setPages(Number(data.pages || 0));
          setError("");
        } else {
          setError(r && r.error || "load failed");
        }
      }).catch(function(e) {
        setLoading(false);
        setError(String(e && e.message || e));
      });
    }, [api, page, query]);
    refreshRef.current = refreshList;
    React2.useEffect(function() {
      injectCss();
    }, []);
    React2.useEffect(function() {
      refreshList();
    }, [refreshList]);
    React2.useEffect(function() {
      var off = api.subscribe(function(p) {
        if (p && p.event === "tags-changed" && refreshRef.current) refreshRef.current();
      });
      return off;
    }, [api]);
    React2.useEffect(function() {
      setSelected([]);
      setConfirmId("");
      setConfirmAll(false);
    }, [rows]);
    function applySearch() {
      var next = String(text || "").trim();
      setPage(1);
      setQuery(next);
    }
    function clearSearch() {
      setText("");
      setQuery("");
      setPage(1);
    }
    function submitCreate(e) {
      if (e && e.preventDefault) e.preventDefault();
      var value = String(name || "").trim();
      if (!value) {
        setFormError(t.needName);
        return;
      }
      if (value.length > 64) {
        setFormError(t.tooLong);
        return;
      }
      setSaving(true);
      setFormError("");
      api.call("tags.create", { name: value }).then(function(r) {
        setSaving(false);
        if (r && r.ok) {
          setCreating(false);
          setName("");
          setText("");
          setQuery("");
          setPage(1);
          say(t.created + "\uFF1A" + value);
          setTimeout(function() {
            if (refreshRef.current) refreshRef.current();
          }, 0);
        } else {
          var msg = r && r.error || "create failed";
          setFormError(String(msg).indexOf("\u5DF2\u5B58\u5728") >= 0 ? t.duplicate : msg);
        }
      }).catch(function(e2) {
        setSaving(false);
        setFormError(String(e2 && e2.message || e2));
      });
    }
    function toggle(id) {
      setSelected(function(prev) {
        var i = prev.indexOf(id);
        if (i >= 0) return prev.filter(function(x) {
          return x !== id;
        });
        return prev.concat([id]);
      });
    }
    function toggleAll() {
      if (rows.length && selected.length === rows.length) setSelected([]);
      else setSelected(rows.map(function(r) {
        return r.id;
      }));
    }
    function deleteOne(id) {
      setBusy(true);
      api.call("tags.delete", { id }).then(function(r) {
        setBusy(false);
        setConfirmId("");
        if (r && r.ok) {
          say(t.deleted);
          if (rows.length === 1 && page > 1) setPage(page - 1);
          else if (refreshRef.current) refreshRef.current();
        } else {
          say(r && r.error || "delete failed");
        }
      }).catch(function(e) {
        setBusy(false);
        setConfirmId("");
        say(String(e && e.message || e));
      });
    }
    function deleteSelected() {
      var ids = selected.slice();
      if (!ids.length) return;
      setBusy(true);
      var chain = Promise.resolve();
      var failed = 0;
      ids.forEach(function(id) {
        chain = chain.then(function() {
          return api.call("tags.delete", { id }).then(function(r) {
            if (!r || !r.ok) failed += 1;
          }).catch(function() {
            failed += 1;
          });
        });
      });
      chain.then(function() {
        setBusy(false);
        setConfirmAll(false);
        setSelected([]);
        say(failed ? "\u90E8\u5206\u5220\u9664\u5931\u8D25\uFF1A" + failed + " \u4E2A" : t.deleted + " " + ids.length + " \u4E2A");
        if (refreshRef.current) refreshRef.current();
      });
    }
    var allChecked = rows.length > 0 && selected.length === rows.length;
    return h2(
      "div",
      { className: "wbg-root" },
      h2(
        "div",
        { className: "wbg-top" },
        h2(
          "div",
          { className: "wbg-grow" },
          h2("h2", null, t.title),
          h2("div", { className: "wbg-sub" }, t.hint)
        ),
        h2(
          "div",
          { className: "wbg-toolbar" },
          h2("input", {
            className: "wbg-input wbg-search",
            value: text,
            placeholder: t.search,
            onChange: function(e) {
              setText(e.target.value);
            },
            onKeyDown: function(e) {
              if (e.key === "Enter") applySearch();
            }
          }),
          h2("button", { type: "button", className: "wbg-btn", onClick: applySearch }, h2(Icon2, { name: "search", size: 13 }), t.find),
          text || query ? h2("button", { type: "button", className: "wbg-btn ghost", onClick: clearSearch }, h2(Icon2, { name: "x", size: 13 }), t.clear) : null,
          h2("button", {
            type: "button",
            className: "wbg-btn primary",
            onClick: function() {
              setCreating(!creating);
              setFormError("");
            }
          }, h2(Icon2, { name: creating ? "x" : "plus", size: 13 }), creating ? t.cancel : t.create)
        )
      ),
      creating ? h2(
        "form",
        { className: "wbg-create", onSubmit: submitCreate },
        h2("input", {
          className: "wbg-input",
          value: name,
          placeholder: t.namePlaceholder,
          autoFocus: true,
          maxLength: 64,
          onChange: function(e) {
            setName(e.target.value);
            setFormError("");
          }
        }),
        h2("button", { type: "submit", className: "wbg-btn primary", disabled: saving }, saving ? "\u2026" : t.save),
        h2("button", { type: "button", className: "wbg-btn ghost", onClick: function() {
          setCreating(false);
          setName("");
          setFormError("");
        } }, t.cancel),
        formError ? h2("div", { className: "wbg-formerr" }, formError) : null
      ) : null,
      selected.length ? h2(
        "div",
        { className: "wbg-batch" },
        h2("span", null, t.selected + " " + selected.length),
        confirmAll ? h2("button", { type: "button", className: "wbg-btn danger", disabled: busy, onClick: deleteSelected }, busy ? "\u2026" : t.confirmBatch) : h2("button", { type: "button", className: "wbg-btn danger", onClick: function() {
          setConfirmAll(true);
        } }, t.del),
        confirmAll ? h2("button", { type: "button", className: "wbg-btn ghost", onClick: function() {
          setConfirmAll(false);
        } }, t.cancel) : null,
        h2("span", { className: "wbg-hint" }, t.batchHint)
      ) : null,
      error ? h2(
        "div",
        { className: "wbg-error" },
        h2("span", null, t.error + error),
        h2("button", { type: "button", className: "wbg-btn", onClick: function() {
          if (refreshRef.current) refreshRef.current();
        } }, t.retry)
      ) : null,
      h2(
        "div",
        { className: "wbg-listhead" },
        h2("input", {
          type: "checkbox",
          className: "wbg-check",
          checked: allChecked,
          onChange: toggleAll,
          "aria-label": t.selectAll,
          disabled: !rows.length
        }),
        h2("span", { className: "wbg-hname" }, t.name),
        h2("span", { className: "wbg-time" }, t.createTime),
        h2("span", { style: { width: "56px", textAlign: "right" } }, t.ops)
      ),
      loading ? h2("div", { className: "wbg-loading" }, t.loading) : rows.length === 0 ? h2("div", { className: "wbg-empty" }, query ? t.noMatch : t.empty) : h2("div", { className: "wbg-list" }, rows.map(function(row) {
        var color = colorFor(row.id || row.name);
        return h2(
          "div",
          {
            key: row.id,
            className: "wbg-row",
            style: { "--tag-color": color }
          },
          h2("input", {
            type: "checkbox",
            className: "wbg-check",
            checked: selected.indexOf(row.id) >= 0,
            onChange: function() {
              toggle(row.id);
            },
            "aria-label": row.name
          }),
          h2("div", { className: "wbg-name" }, h2("span", { className: "wbg-chip" }, row.name)),
          h2("div", { className: "wbg-time" }, row.createTime || ""),
          h2(
            "div",
            { className: "wbg-ops" },
            confirmId === row.id ? h2("button", { type: "button", className: "wbg-btn danger", disabled: busy, onClick: function() {
              deleteOne(row.id);
            } }, busy ? "\u2026" : t.confirmDel) : h2("button", { type: "button", className: "wbg-btn danger", onClick: function() {
              setConfirmId(row.id);
            } }, h2(Icon2, { name: "trash", size: 13 }), t.del),
            confirmId === row.id ? h2("button", { type: "button", className: "wbg-btn ghost", onClick: function() {
              setConfirmId("");
            } }, t.cancel) : null
          )
        );
      })),
      h2(
        "div",
        { className: "wbg-pager" },
        h2("span", null, t.total + " " + total + " " + t.items),
        h2("span", { className: "wbg-grow" }),
        h2("button", {
          type: "button",
          className: "wbg-btn",
          disabled: page <= 1 || loading,
          onClick: function() {
            setPage(page - 1);
          }
        }, t.prev),
        h2("span", null, t.page + " " + page + " / " + Math.max(pages, 1) + " " + t.pageUnit),
        h2("button", {
          type: "button",
          className: "wbg-btn",
          disabled: page >= pages || !pages || loading,
          onClick: function() {
            setPage(page + 1);
          }
        }, t.next)
      ),
      toast ? h2("div", { className: "wbg-toast" }, toast) : null
    );
  }
  host.registerAddon({
    id: "wb-addon-tags",
    version: "1.3.2",
    views: [{
      id: "tags",
      title: { zh: "\u6807\u7B7E", en: "Tags" },
      component: TagsView
    }]
  });
  module.exports = { name: "dsh-workbench-tags", inject: [], apply: function() {
  } };
})();
    return module.exports;
  },
});
