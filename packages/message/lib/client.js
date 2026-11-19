// 由 scripts/build-addon-clients.mjs 生成；请修改对应 client/client.src.cjs 后重新构建。
window.__ModuleLoader__ = window.__ModuleLoader__ || { modules: {}, load: function (m) { this.modules[m.id] = m.factory; } };
window.__ModuleLoader__.load({
  id: "dsh-workbench-message",
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

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/bell.mjs
var bell_exports = {};
__export(bell_exports, {
  __iconData: () => __iconData,
  default: () => Bell
});
var __iconData, Bell;
var init_bell = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/bell.mjs"() {
    init_createLucideIcon();
    __iconData = {
      name: "bell",
      size: 24,
      node: [
        ["path", { d: "M10.268 21a2 2 0 0 0 3.464 0", key: "vwvbt9" }],
        [
          "path",
          {
            d: "M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",
            key: "11g9vi"
          }
        ]
      ]
    };
    __iconData.node;
    Bell = createLucideIcon(__iconData);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/bell-off.mjs
var bell_off_exports = {};
__export(bell_off_exports, {
  __iconData: () => __iconData2,
  default: () => BellOff
});
var __iconData2, BellOff;
var init_bell_off = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/bell-off.mjs"() {
    init_createLucideIcon();
    __iconData2 = {
      name: "bell-off",
      size: 24,
      node: [
        ["path", { d: "M10.268 21a2 2 0 0 0 3.464 0", key: "vwvbt9" }],
        [
          "path",
          {
            d: "M17 17H4a1 1 0 0 1-.74-1.673C4.59 13.956 6 12.499 6 8a6 6 0 0 1 .258-1.742",
            key: "178tsu"
          }
        ],
        ["path", { d: "m2 2 20 20", key: "1ooewy" }],
        ["path", { d: "M8.668 3.01A6 6 0 0 1 18 8c0 2.687.77 4.653 1.707 6.05", key: "1hqiys" }]
      ]
    };
    __iconData2.node;
    BellOff = createLucideIcon(__iconData2);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/inbox.mjs
var inbox_exports = {};
__export(inbox_exports, {
  __iconData: () => __iconData3,
  default: () => Inbox
});
var __iconData3, Inbox;
var init_inbox = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/inbox.mjs"() {
    init_createLucideIcon();
    __iconData3 = {
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
    __iconData3.node;
    Inbox = createLucideIcon(__iconData3);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/mail.mjs
var mail_exports = {};
__export(mail_exports, {
  __iconData: () => __iconData4,
  default: () => Mail
});
var __iconData4, Mail;
var init_mail = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/mail.mjs"() {
    init_createLucideIcon();
    __iconData4 = {
      name: "mail",
      size: 24,
      node: [
        ["path", { d: "m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7", key: "132q7q" }],
        ["rect", { x: "2", y: "4", width: "20", height: "16", rx: "2", key: "izxlao" }]
      ]
    };
    __iconData4.node;
    Mail = createLucideIcon(__iconData4);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/mail-open.mjs
var mail_open_exports = {};
__export(mail_open_exports, {
  __iconData: () => __iconData5,
  default: () => MailOpen
});
var __iconData5, MailOpen;
var init_mail_open = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/mail-open.mjs"() {
    init_createLucideIcon();
    __iconData5 = {
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
    __iconData5.node;
    MailOpen = createLucideIcon(__iconData5);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/chart-column.mjs
var chart_column_exports = {};
__export(chart_column_exports, {
  __iconData: () => __iconData6,
  default: () => ChartColumn
});
var __iconData6, ChartColumn;
var init_chart_column = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/chart-column.mjs"() {
    init_createLucideIcon();
    __iconData6 = {
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
    __iconData6.node;
    ChartColumn = createLucideIcon(__iconData6);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/settings.mjs
var settings_exports = {};
__export(settings_exports, {
  __iconData: () => __iconData7,
  default: () => Settings
});
var __iconData7, Settings;
var init_settings = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/settings.mjs"() {
    init_createLucideIcon();
    __iconData7 = {
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
    __iconData7.node;
    Settings = createLucideIcon(__iconData7);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/database.mjs
var database_exports = {};
__export(database_exports, {
  __iconData: () => __iconData8,
  default: () => Database
});
var __iconData8, Database;
var init_database = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/database.mjs"() {
    init_createLucideIcon();
    __iconData8 = {
      name: "database",
      size: 24,
      node: [
        ["ellipse", { cx: "12", cy: "5", rx: "9", ry: "3", key: "msslwz" }],
        ["path", { d: "M3 5V19A9 3 0 0 0 21 19V5", key: "1wlel7" }],
        ["path", { d: "M3 12A9 3 0 0 0 21 12", key: "mv7ke4" }]
      ]
    };
    __iconData8.node;
    Database = createLucideIcon(__iconData8);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/list.mjs
var list_exports = {};
__export(list_exports, {
  __iconData: () => __iconData9,
  default: () => List
});
var __iconData9, List;
var init_list = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/list.mjs"() {
    init_createLucideIcon();
    __iconData9 = {
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
    __iconData9.node;
    List = createLucideIcon(__iconData9);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/check.mjs
var check_exports = {};
__export(check_exports, {
  __iconData: () => __iconData10,
  default: () => Check
});
var __iconData10, Check;
var init_check = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/check.mjs"() {
    init_createLucideIcon();
    __iconData10 = {
      name: "check",
      size: 24,
      node: [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]]
    };
    __iconData10.node;
    Check = createLucideIcon(__iconData10);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/check-check.mjs
var check_check_exports = {};
__export(check_check_exports, {
  __iconData: () => __iconData11,
  default: () => CheckCheck
});
var __iconData11, CheckCheck;
var init_check_check = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/check-check.mjs"() {
    init_createLucideIcon();
    __iconData11 = {
      name: "check-check",
      size: 24,
      node: [
        ["path", { d: "M18 6 7 17l-5-5", key: "116fxf" }],
        ["path", { d: "m22 10-7.5 7.5L13 16", key: "ke71qq" }]
      ]
    };
    __iconData11.node;
    CheckCheck = createLucideIcon(__iconData11);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/search.mjs
var search_exports = {};
__export(search_exports, {
  __iconData: () => __iconData12,
  default: () => Search
});
var __iconData12, Search;
var init_search = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/search.mjs"() {
    init_createLucideIcon();
    __iconData12 = {
      name: "search",
      size: 24,
      node: [
        ["path", { d: "m21 21-4.34-4.34", key: "14j7rj" }],
        ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }]
      ]
    };
    __iconData12.node;
    Search = createLucideIcon(__iconData12);
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

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/plus.mjs
var plus_exports = {};
__export(plus_exports, {
  __iconData: () => __iconData14,
  default: () => Plus
});
var __iconData14, Plus;
var init_plus = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/plus.mjs"() {
    init_createLucideIcon();
    __iconData14 = {
      name: "plus",
      size: 24,
      node: [
        ["path", { d: "M5 12h14", key: "1ays0h" }],
        ["path", { d: "M12 5v14", key: "s699le" }]
      ]
    };
    __iconData14.node;
    Plus = createLucideIcon(__iconData14);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/volume-2.mjs
var volume_2_exports = {};
__export(volume_2_exports, {
  __iconData: () => __iconData15,
  default: () => Volume2
});
var __iconData15, Volume2;
var init_volume_2 = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/volume-2.mjs"() {
    init_createLucideIcon();
    __iconData15 = {
      name: "volume-2",
      size: 24,
      node: [
        [
          "path",
          {
            d: "M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z",
            key: "uqj9uw"
          }
        ],
        ["path", { d: "M16 9a5 5 0 0 1 0 6", key: "1q6k2b" }],
        ["path", { d: "M19.364 18.364a9 9 0 0 0 0-12.728", key: "ijwkga" }]
      ]
    };
    __iconData15.node;
    Volume2 = createLucideIcon(__iconData15);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/volume-x.mjs
var volume_x_exports = {};
__export(volume_x_exports, {
  __iconData: () => __iconData16,
  default: () => VolumeX
});
var __iconData16, VolumeX;
var init_volume_x = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/volume-x.mjs"() {
    init_createLucideIcon();
    __iconData16 = {
      name: "volume-x",
      size: 24,
      node: [
        [
          "path",
          {
            d: "M11 4.702a.7.7 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.7.7 0 0 0 11 19.298z",
            key: "1p7khw"
          }
        ],
        ["path", { d: "m16.5 14.5 5-5", key: "cul3yw" }],
        ["path", { d: "m16.5 9.5 5 5", key: "1akey5" }]
      ]
    };
    __iconData16.node;
    VolumeX = createLucideIcon(__iconData16);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/moon.mjs
var moon_exports = {};
__export(moon_exports, {
  __iconData: () => __iconData17,
  default: () => Moon
});
var __iconData17, Moon;
var init_moon = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/moon.mjs"() {
    init_createLucideIcon();
    __iconData17 = {
      name: "moon",
      size: 24,
      node: [
        [
          "path",
          {
            d: "M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401",
            key: "kfwtm"
          }
        ]
      ]
    };
    __iconData17.node;
    Moon = createLucideIcon(__iconData17);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/clock.mjs
var clock_exports = {};
__export(clock_exports, {
  __iconData: () => __iconData18,
  default: () => Clock
});
var __iconData18, Clock;
var init_clock = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/clock.mjs"() {
    init_createLucideIcon();
    __iconData18 = {
      name: "clock",
      size: 24,
      node: [
        ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
        ["path", { d: "M12 6v6l4 2", key: "mmk7yg" }]
      ]
    };
    __iconData18.node;
    Clock = createLucideIcon(__iconData18);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/info.mjs
var info_exports = {};
__export(info_exports, {
  __iconData: () => __iconData19,
  default: () => Info
});
var __iconData19, Info;
var init_info = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/info.mjs"() {
    init_createLucideIcon();
    __iconData19 = {
      name: "info",
      size: 24,
      node: [
        ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
        ["path", { d: "M12 16v-4", key: "1dtifu" }],
        ["path", { d: "M12 8h.01", key: "e9boi3" }]
      ]
    };
    __iconData19.node;
    Info = createLucideIcon(__iconData19);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/circle-check.mjs
var circle_check_exports = {};
__export(circle_check_exports, {
  __iconData: () => __iconData20,
  default: () => CircleCheck
});
var __iconData20, CircleCheck;
var init_circle_check = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/circle-check.mjs"() {
    init_createLucideIcon();
    __iconData20 = {
      name: "circle-check",
      size: 24,
      node: [
        ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
        ["path", { d: "m16 9-5.5 5.5L8 12", key: "xofnsj" }]
      ],
      aliases: ["check-circle-2"]
    };
    __iconData20.node;
    CircleCheck = createLucideIcon(__iconData20);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/triangle-exclamation-point.mjs
var __iconData21, TriangleExclamationPoint;
var init_triangle_exclamation_point = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/triangle-exclamation-point.mjs"() {
    init_createLucideIcon();
    __iconData21 = {
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
    __iconData21.node;
    TriangleExclamationPoint = createLucideIcon(__iconData21);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/triangle-alert.mjs
var triangle_alert_exports = {};
__export(triangle_alert_exports, {
  default: () => TriangleExclamationPoint
});
var init_triangle_alert = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/triangle-alert.mjs"() {
    init_triangle_exclamation_point();
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/circle-exclamation-point.mjs
var __iconData22, CircleExclamationPoint;
var init_circle_exclamation_point = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/circle-exclamation-point.mjs"() {
    init_createLucideIcon();
    __iconData22 = {
      name: "circle-exclamation-point",
      size: 24,
      node: [
        ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
        ["line", { x1: "12", x2: "12", y1: "8", y2: "12", key: "1pkeuh" }],
        ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16", key: "4dfq90" }]
      ],
      aliases: ["alert-circle", "circle-alert"]
    };
    __iconData22.node;
    CircleExclamationPoint = createLucideIcon(__iconData22);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/circle-alert.mjs
var circle_alert_exports = {};
__export(circle_alert_exports, {
  default: () => CircleExclamationPoint
});
var init_circle_alert = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/circle-alert.mjs"() {
    init_circle_exclamation_point();
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/rotate-ccw.mjs
var rotate_ccw_exports = {};
__export(rotate_ccw_exports, {
  __iconData: () => __iconData23,
  default: () => RotateCcw
});
var __iconData23, RotateCcw;
var init_rotate_ccw = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/rotate-ccw.mjs"() {
    init_createLucideIcon();
    __iconData23 = {
      name: "rotate-ccw",
      size: 24,
      node: [
        ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", key: "1357e3" }],
        ["path", { d: "M3 3v5h5", key: "1xhq8a" }]
      ]
    };
    __iconData23.node;
    RotateCcw = createLucideIcon(__iconData23);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/play.mjs
var play_exports = {};
__export(play_exports, {
  __iconData: () => __iconData24,
  default: () => Play
});
var __iconData24, Play;
var init_play = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/play.mjs"() {
    init_createLucideIcon();
    __iconData24 = {
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
    __iconData24.node;
    Play = createLucideIcon(__iconData24);
  }
});

// packages/addons/message/client/ui/copy.cjs
var require_copy = __commonJS({
  "packages/addons/message/client/ui/copy.cjs"(exports2, module2) {
    "use strict";
    module2.exports = {
      zh: {
        title: "\u6D88\u606F",
        hint: "\u7EDF\u4E00\u6D88\u606F\u5165\u53E3 \xB7 \u4EC5\u672C\u673A\u4FDD\u5B58",
        tabs: { stats: "\u7EDF\u8BA1", inbox: "\u6536\u4EF6\u7BB1", config: "\u914D\u7F6E", data: "\u6570\u636E", actions: "Action" },
        loading: "\u6B63\u5728\u8BFB\u53D6\u6D88\u606F\u2026",
        loadFail: "\u6D88\u606F\u52A0\u8F7D\u5931\u8D25",
        retry: "\u91CD\u8BD5",
        empty: "\u8FD8\u6CA1\u6709\u6D88\u606F\u3002\u5B50\u63D2\u4EF6\u6216 agent \u8C03\u7528 message.send \u540E\u4F1A\u51FA\u73B0\u5728\u8FD9\u91CC\u3002",
        unreadOnly: "\u53EA\u770B\u672A\u8BFB",
        searchPlaceholder: "\u641C\u7D22\u6807\u9898\u6216\u6B63\u6587",
        noMatch: "\u6CA1\u6709\u5339\u914D\u7684\u6D88\u606F",
        markAll: "\u5168\u90E8\u5DF2\u8BFB",
        markRead: "\u6807\u8BB0\u5DF2\u8BFB",
        marked: "\u5DF2\u6807\u8BB0 {n} \u6761\u4E3A\u5DF2\u8BFB",
        allRead: "\u6CA1\u6709\u672A\u8BFB\u6D88\u606F\u4E86",
        unread: "\u672A\u8BFB",
        unreadCount: "\u672A\u8BFB {n} \u6761",
        total: "\u5171 {n} \u6761",
        pageInfo: "\u7B2C {page} / {pages} \u9875",
        prev: "\u4E0A\u4E00\u9875",
        next: "\u4E0B\u4E00\u9875",
        levelAll: "\u5168\u90E8\u7EA7\u522B",
        sourceAll: "\u5168\u90E8\u6765\u6E90",
        level: { info: "\u63D0\u793A", success: "\u6210\u529F", warning: "\u8B66\u544A", error: "\u9519\u8BEF" },
        audience: { user: "\u7528\u6237", agent: "Agent", all: "\u5168\u90E8" },
        from: "\u6765\u6E90",
        at: "\u65F6\u95F4",
        read: "\u5DF2\u8BFB",
        bodyEmpty: "\uFF08\u65E0\u6B63\u6587\uFF09",
        soundOn: "\u63D0\u793A\u97F3\u5DF2\u5F00\u542F",
        soundOff: "\u63D0\u793A\u97F3\u5DF2\u5173\u95ED",
        statsTitle: "\u6D88\u606F\u7EDF\u8BA1",
        statsHint: "\u53EA\u7EDF\u8BA1\u672C\u673A\u6D88\u606F\uFF1B\u672A\u8BFB\u4E0D\u6309\u65F6\u95F4\u6E05\u7406",
        statTotal: "\u603B\u6D88\u606F",
        statUnread: "\u672A\u8BFB",
        statRead: "\u5DF2\u8BFB",
        statOldest: "\u6700\u65E9\u672A\u8BFB",
        byLevel: "\u6309\u7EA7\u522B",
        bySource: "\u6309\u6765\u6E90",
        trend: "\u6700\u8FD1 {days} \u5929",
        noSource: "\uFF08\u672A\u6807\u6CE8\uFF09",
        noData: "\u6682\u65E0\u6570\u636E",
        configTitle: "\u6D88\u606F\u914D\u7F6E",
        configHint: "\u914D\u7F6E\u5B58\u672C\u5730 meta \u8868\uFF1B\u63D0\u793A\u97F3\u4E0E\u672C\u673A\u504F\u597D\u4E0D\u4F1A\u540C\u6B65\u5230\u5176\u4ED6\u8BBE\u5907",
        save: "\u4FDD\u5B58",
        saved: "\u5DF2\u4FDD\u5B58",
        resetAll: "\u5168\u90E8\u6062\u590D\u9ED8\u8BA4",
        resetOne: "\u6062\u590D\u9ED8\u8BA4",
        preview: "\u8BD5\u542C",
        quietNote: "\u514D\u6253\u6270\u65F6\u95F4\u6BB5\u5185\u4E0D\u53D1\u58F0\uFF0C\u6D88\u606F\u7167\u5E38\u5165\u5E93\uFF1B\u300C\u514D\u6253\u6270\u4ECD\u54CD\u7684\u7EA7\u522B\u300D\u53EF\u4EE5\u653E\u884C\u91CD\u8981\u6D88\u606F",
        readDaysNote: "\u5DF2\u8BFB\u6D88\u606F\u8D85\u8FC7\u4FDD\u7559\u5929\u6570\u4F1A\u88AB\u6E05\u7406\uFF1B\u672A\u8BFB\u6D88\u606F\u6C38\u4E0D\u6309\u65F6\u95F4\u6E05\u7406",
        volumeLabel: "\u97F3\u91CF {n}%",
        dataTitle: "\u6570\u636E",
        actionsTitle: "Action",
        openInbox: "\u6253\u5F00\u6536\u4EF6\u7BB1"
      },
      en: {
        title: "Messages",
        hint: "Single entry point \xB7 stored locally",
        tabs: { stats: "Stats", inbox: "Inbox", config: "Config", data: "Data", actions: "Actions" },
        loading: "Loading messages\u2026",
        loadFail: "Failed to load messages",
        retry: "Retry",
        empty: "No messages yet. Plugins or agents calling message.send will show up here.",
        unreadOnly: "Unread only",
        searchPlaceholder: "Search title or body",
        noMatch: "No matching messages",
        markAll: "Mark all read",
        markRead: "Mark read",
        marked: "Marked {n} as read",
        allRead: "Nothing unread",
        unread: "Unread",
        unreadCount: "{n} unread",
        total: "{n} total",
        pageInfo: "Page {page} / {pages}",
        prev: "Previous",
        next: "Next",
        levelAll: "All levels",
        sourceAll: "All sources",
        level: { info: "Info", success: "Success", warning: "Warning", error: "Error" },
        audience: { user: "User", agent: "Agent", all: "All" },
        from: "Source",
        at: "Time",
        read: "Read",
        bodyEmpty: "(no body)",
        soundOn: "Sound on",
        soundOff: "Sound off",
        statsTitle: "Message stats",
        statsHint: "Local messages only; unread never expires by time",
        statTotal: "Messages",
        statUnread: "Unread",
        statRead: "Read",
        statOldest: "Oldest unread",
        byLevel: "By level",
        bySource: "By source",
        trend: "Last {days} days",
        noSource: "(unlabelled)",
        noData: "No data",
        configTitle: "Message settings",
        configHint: "Stored in the local meta table; sound and list preferences are not synced",
        save: "Save",
        saved: "Saved",
        resetAll: "Reset all",
        resetOne: "Reset",
        preview: "Preview",
        quietNote: "Inside quiet hours nothing plays, but messages are still stored. Levels above can pass through.",
        readDaysNote: "Read messages older than the retention window are pruned; unread ones never expire by time.",
        volumeLabel: "Volume {n}%",
        dataTitle: "Data",
        actionsTitle: "Actions",
        openInbox: "Open inbox"
      }
    };
  }
});

// packages/addons/message/client/ui/styles.cjs
var require_styles = __commonJS({
  "packages/addons/message/client/ui/styles.cjs"(exports2, module2) {
    "use strict";
    module2.exports = [
      ".wbm-root{--wbm-line:var(--dsw-alias-border-l2,color-mix(in oklab,currentColor 16%,transparent));--wbm-surface:var(--dsw-alias-bg-layer-1,color-mix(in oklab,currentColor 4%,transparent));--wbm-accent:var(--dsw-alias-brand-primary,#11a89b);display:flex;flex-direction:column;gap:12px;min-height:0;color:inherit;font-size:13px}",
      ".wbm-toolbar{display:flex;flex-wrap:wrap;align-items:center;gap:8px}",
      ".wbm-grow{flex:1;min-width:0}",
      ".wbm-input{flex:1;min-width:140px;max-width:280px;border:1px solid var(--wbm-line);border-radius:8px;background:transparent;color:inherit;padding:6px 9px;font-size:12.5px}",
      ".wbm-select{border:1px solid var(--wbm-line);border-radius:8px;background:transparent;color:inherit;padding:5px 8px;font-size:12.5px}",
      ".wbm-btn{display:inline-flex;align-items:center;gap:5px;border:1px solid var(--wbm-line);background:transparent;color:inherit;border-radius:8px;padding:5px 10px;font-size:12.5px;cursor:pointer}",
      ".wbm-btn:hover{border-color:color-mix(in oklab,var(--wbm-accent) 45%,var(--wbm-line))}",
      ".wbm-btn.primary{background:var(--wbm-accent);border-color:var(--wbm-accent);color:var(--dsw-alias-label-primary-inverted,#fff);font-weight:600}",
      ".wbm-btn:disabled{opacity:.5;cursor:default}",
      ".wbm-check{display:inline-flex;align-items:center;gap:5px;font-size:12.5px;cursor:pointer}",
      ".wbm-sumbox{display:flex;gap:10px;flex-wrap:wrap;font-size:11.5px;opacity:.7}",
      ".wbm-list{display:flex;flex-direction:column;gap:8px;min-height:0;overflow:auto;overscroll-behavior:contain;padding:2px}",
      ".wbm-card{border:1px solid var(--wbm-line);border-left-width:3px;border-radius:10px;padding:9px 11px;background:var(--wbm-surface);display:flex;flex-direction:column;gap:4px}",
      ".wbm-card.lv-info{border-left-color:color-mix(in oklab,var(--wbm-accent) 60%,transparent)}",
      ".wbm-card.lv-success{border-left-color:var(--dsw-alias-state-success-primary,#2fa84f)}",
      ".wbm-card.lv-warning{border-left-color:var(--dsw-alias-state-warning-primary,#d9822b)}",
      ".wbm-card.lv-error{border-left-color:var(--dsw-alias-state-error-primary,#e5484d)}",
      ".wbm-card.is-unread{box-shadow:inset 0 0 0 1px color-mix(in oklab,var(--wbm-accent) 22%,transparent)}",
      ".wbm-card-top{display:flex;align-items:center;gap:6px;flex-wrap:wrap}",
      ".wbm-title{font-weight:600;font-size:12.8px;min-width:0;overflow-wrap:anywhere}",
      ".wbm-badge{font-size:10.5px;border-radius:999px;padding:1px 7px;border:1px solid var(--wbm-line);opacity:.8}",
      ".wbm-badge.lv-warning{color:var(--dsw-alias-state-warning-primary,#d9822b);border-color:color-mix(in oklab,var(--dsw-alias-state-warning-primary,#d9822b) 45%,transparent)}",
      ".wbm-badge.lv-error{color:var(--dsw-alias-state-error-primary,#e5484d);border-color:color-mix(in oklab,var(--dsw-alias-state-error-primary,#e5484d) 45%,transparent)}",
      ".wbm-badge.lv-success{color:var(--dsw-alias-state-success-primary,#2fa84f);border-color:color-mix(in oklab,var(--dsw-alias-state-success-primary,#2fa84f) 45%,transparent)}",
      ".wbm-meta{display:flex;gap:8px;flex-wrap:wrap;font-size:11px;opacity:.6}",
      ".wbm-body{font-size:12px;line-height:1.55;white-space:pre-wrap;overflow-wrap:anywhere;opacity:.9}",
      ".wbm-ops{display:flex;gap:6px;flex-wrap:wrap}",
      ".wbm-pager{display:flex;align-items:center;gap:8px;justify-content:flex-end;font-size:11.5px}",
      ".wbm-empty{border:1px dashed var(--wbm-line);border-radius:10px;padding:26px 12px;text-align:center;opacity:.6;font-size:12.5px}",
      ".wbm-err{border:1px solid color-mix(in oklab,var(--dsw-alias-state-error-primary,#e5484d) 40%,transparent);border-radius:10px;padding:10px 12px;color:var(--dsw-alias-state-error-primary,#e5484d);font-size:12.5px;display:flex;gap:8px;align-items:center;flex-wrap:wrap}",
      ".wbm-toast{position:fixed;left:50%;bottom:26px;transform:translateX(-50%);z-index:820;background:var(--dsw-alias-toast-bg,rgba(20,20,20,.88));color:var(--dsw-alias-toast-label,#fff);border-radius:9px;padding:9px 14px;font-size:12.5px;pointer-events:none}",
      ".wbm-cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:8px}",
      ".wbm-kpi{border:1px solid var(--wbm-line);border-radius:10px;padding:9px 11px;background:var(--wbm-surface);display:flex;flex-direction:column;gap:2px}",
      ".wbm-kpi b{font-size:19px;font-weight:600}",
      ".wbm-kpi span{font-size:11px;opacity:.65}",
      ".wbm-section{border:1px solid var(--wbm-line);border-radius:10px;padding:10px 12px;background:var(--wbm-surface);display:flex;flex-direction:column;gap:7px}",
      ".wbm-section h3{margin:0;font-size:12.5px;font-weight:600}",
      ".wbm-bars{display:flex;flex-direction:column;gap:5px}",
      ".wbm-bar{display:grid;grid-template-columns:88px 1fr 46px;gap:7px;align-items:center;font-size:11.5px}",
      ".wbm-bar-track{height:7px;border-radius:999px;background:color-mix(in oklab,currentColor 10%,transparent);overflow:hidden}",
      ".wbm-bar-fill{height:100%;border-radius:999px;background:var(--wbm-accent)}",
      ".wbm-bar-fill.lv-warning{background:var(--dsw-alias-state-warning-primary,#d9822b)}",
      ".wbm-bar-fill.lv-error{background:var(--dsw-alias-state-error-primary,#e5484d)}",
      ".wbm-bar-fill.lv-success{background:var(--dsw-alias-state-success-primary,#2fa84f)}",
      ".wbm-trend{display:flex;align-items:flex-end;gap:3px;height:64px}",
      ".wbm-trend-col{flex:1;display:flex;flex-direction:column;justify-content:flex-end;gap:3px;align-items:center;font-size:9px;opacity:.75}",
      ".wbm-trend-bar{width:100%;min-height:2px;border-radius:3px 3px 0 0;background:color-mix(in oklab,var(--wbm-accent) 65%,transparent)}",
      ".wbm-field{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;align-items:center;padding:7px 0;border-bottom:1px dashed color-mix(in oklab,var(--wbm-line) 70%,transparent)}",
      ".wbm-field:last-child{border-bottom:none}",
      ".wbm-field-main{display:flex;flex-direction:column;gap:2px;min-width:0}",
      ".wbm-field-label{font-size:12.5px;font-weight:500}",
      ".wbm-field-hint{font-size:11px;opacity:.6;line-height:1.45}",
      ".wbm-field-ctl{display:flex;align-items:center;gap:6px}",
      ".wbm-range{width:130px}",
      ".wbm-note{font-size:11.5px;opacity:.62;line-height:1.5}",
      ".wbm-time{width:86px;border:1px solid var(--wbm-line);border-radius:7px;background:transparent;color:inherit;padding:4px 6px;font-size:12px}",
      ".wbm-num{width:74px;border:1px solid var(--wbm-line);border-radius:7px;background:transparent;color:inherit;padding:4px 6px;font-size:12px}",
      ".wbm-multis{display:flex;gap:6px;flex-wrap:wrap}",
      "@media (max-width:760px){.wbm-toolbar{gap:6px}.wbm-input{max-width:none}.wbm-bar{grid-template-columns:70px 1fr 38px}}"
    ].join("");
  }
});

// packages/addons/message/client/notify/notifier.cjs
var require_notifier = __commonJS({
  "packages/addons/message/client/notify/notifier.cjs"(exports2, module2) {
    "use strict";
    var DOMAIN = "wb-addon-message";
    var BASE = "/workbench/api";
    var CFG_TTL = 3e4;
    var SUPPRESS_MS = 5e3;
    var LEVELS = ["info", "success", "warning", "error"];
    var state = {
      running: false,
      source: null,
      cfg: { at: 0, values: null },
      audio: null,
      lastKey: "",
      lastAt: 0
    };
    function unwrap(r) {
      return r && r.result !== void 0 ? r.result : r;
    }
    function call(action, args) {
      return fetch(BASE + "/domains/" + DOMAIN + "/actions/" + action, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(args || {})
      }).then(function(r) {
        return r.json();
      }).then(unwrap);
    }
    function loadConfig(force) {
      var fresh = state.cfg.values && Date.now() - state.cfg.at < CFG_TTL;
      if (!force && fresh) return Promise.resolve(state.cfg.values);
      return call("message.configGet").then(function(body) {
        if (!body || !body.values) return state.cfg.values || {};
        state.cfg = { at: Date.now(), values: body.values };
        return body.values;
      }).catch(function() {
        return state.cfg.values || {};
      });
    }
    function ensureAudio() {
      if (state.audio) return state.audio;
      var Ctor = typeof window !== "undefined" && (window.AudioContext || window.webkitAudioContext) || null;
      if (!Ctor) return null;
      try {
        state.audio = new Ctor();
      } catch (e) {
        state.audio = null;
      }
      return state.audio;
    }
    function unlock() {
      var audio = ensureAudio();
      if (audio && audio.state === "suspended" && typeof audio.resume === "function") audio.resume();
    }
    function installUnlock() {
      if (typeof document === "undefined" || !document.addEventListener) return;
      document.addEventListener("pointerdown", unlock, { once: true, capture: true, passive: true });
    }
    function inWindow(from, to, date) {
      var minutes = date.getHours() * 60 + date.getMinutes();
      var parse = function(text) {
        var parts = String(text || "").split(":");
        var h = Number(parts[0]);
        var m = Number(parts[1]);
        if (!Number.isFinite(h) || !Number.isFinite(m)) return null;
        return h * 60 + m;
      };
      var start2 = parse(from);
      var end = parse(to);
      if (start2 === null || end === null) return false;
      if (start2 === end) return true;
      if (start2 < end) return minutes >= start2 && minutes < end;
      return minutes >= start2 || minutes < end;
    }
    function isQuiet(values, date) {
      if (!values || values["quiet.enabled"] !== true) return false;
      return inWindow(values["quiet.from"], values["quiet.to"], date);
    }
    function passQuiet(values, level) {
      var levels = values && Array.isArray(values["quiet.levels"]) ? values["quiet.levels"] : ["warning", "error"];
      return levels.indexOf(level) >= 0;
    }
    function playTone(level, volume) {
      var audio = ensureAudio();
      if (!audio) return false;
      unlock();
      var pattern;
      var freq;
      if (level === "error") {
        freq = 520;
        pattern = [130, 70, 130, 70, 130];
      } else if (level === "warning") {
        freq = 660;
        pattern = [110, 60, 110, 60, 110];
      } else {
        freq = 880;
        pattern = [90, 60, 90];
      }
      var gain = Math.max(0, Math.min(1, Number(volume === void 0 ? 0.4 : volume))) * 0.22;
      var t = audio.currentTime + 0.01;
      for (var i = 0; i < pattern.length; i += 1) {
        var dur = pattern[i] / 1e3;
        if (i % 2 === 0) {
          var osc = audio.createOscillator();
          var amp = audio.createGain();
          osc.type = "sine";
          osc.frequency.value = freq;
          amp.gain.setValueAtTime(1e-4, t);
          amp.gain.exponentialRampToValueAtTime(Math.max(2e-4, gain), t + 0.012);
          amp.gain.exponentialRampToValueAtTime(1e-4, t + dur);
          osc.connect(amp);
          amp.connect(audio.destination);
          osc.start(t);
          osc.stop(t + dur + 0.02);
        }
        t += dur;
      }
      return true;
    }
    function maybePlay(values, message) {
      if (!values) return false;
      if (values["sound.enabled"] === false) return false;
      if (!message || message.audience === "agent") return false;
      var hidden = typeof document !== "undefined" && document.visibilityState === "hidden";
      if (hidden && values["sound.whileHidden"] !== true) return false;
      var level = LEVELS.indexOf(message.level) >= 0 ? message.level : "info";
      if (isQuiet(values, /* @__PURE__ */ new Date()) && !passQuiet(values, level)) return false;
      return playTone(level, values["sound.volume"]);
    }
    function handleEvent(payload) {
      if (!payload || payload.domainId !== DOMAIN || payload.event !== "message.created") return;
      var message = payload.data && payload.data.message;
      if (!message || !message.id) return;
      var now = Date.now();
      if (state.lastKey === message.id && now - state.lastAt < SUPPRESS_MS) return;
      state.lastKey = message.id;
      state.lastAt = now;
      loadConfig(false).then(function(values) {
        maybePlay(values, message);
      });
    }
    function start() {
      if (state.running) return;
      state.running = true;
      installUnlock();
      if (typeof window === "undefined" || typeof window.EventSource !== "function") return;
      try {
        state.source = new window.EventSource(BASE + "/events");
        state.source.addEventListener("domain-event", function(event) {
          try {
            handleEvent(JSON.parse(event.data));
          } catch (e) {
          }
        });
      } catch (e) {
        state.source = null;
      }
      loadConfig(true);
    }
    function stop() {
      state.running = false;
      if (state.source && typeof state.source.close === "function") state.source.close();
      state.source = null;
    }
    function preview(level) {
      var lv = LEVELS.indexOf(level) >= 0 ? level : "info";
      return loadConfig(false).then(function(values) {
        return playTone(lv, values["sound.volume"] === void 0 ? 0.4 : values["sound.volume"]);
      });
    }
    module2.exports = { start, stop, preview, refreshConfig: function() {
      return loadConfig(true);
    } };
  }
});

// packages/addons/message/client/views/config.cjs
var require_config = __commonJS({
  "packages/addons/message/client/views/config.cjs"(exports2, module2) {
    "use strict";
    var React = require("react");
    var h = React.createElement;
    var notifier = require_notifier();
    var DOMAIN = "message";
    function unwrap(r) {
      return r && r.result !== void 0 ? r.result : r;
    }
    function useConfig(api, fallback) {
      var fb = fallback || {};
      var stateS = React.useState({
        ready: false,
        values: Object.assign({}, fb),
        items: [],
        groups: [],
        overrides: {},
        error: "",
        state: null
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
            values: Object.assign({}, fb, body.values),
            items: body.items || [],
            groups: body.groups || [],
            overrides: body.overrides || {},
            error: "",
            state: body
          });
        }).catch(function(e) {
          if (!alive) return;
          setState({ ready: true, values: Object.assign({}, fb), items: [], groups: [], overrides: {}, error: String(e && e.message || e), state: null });
        });
        return function() {
          alive = false;
        };
      }, [api]);
      function setValues(next) {
        if (!next || typeof next !== "object") return;
        setState(function(prev) {
          var values = Object.assign({}, prev.values, next);
          var body = prev.state;
          if (body && typeof body === "object") body = Object.assign({}, body, { values });
          return Object.assign({}, prev, { values, state: body });
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
    function ConfigView(props) {
      var api = props.api;
      var t = props.t;
      var lang = props.lang;
      var cfg = useConfig(api, {});
      var toastS = React.useState("");
      var toast = toastS[0];
      var setToast = toastS[1];
      var localS = React.useState({});
      var local = localS[0];
      var setLocal = localS[1];
      function values() {
        return Object.assign({}, cfg.values, local);
      }
      function toastOnce(message) {
        setToast(message);
        setTimeout(function() {
          setToast("");
        }, 2e3);
      }
      var seqRef = React.useRef(0);
      function dropLocal(id, value) {
        setLocal(function(prev) {
          if (!(id in prev)) return prev;
          if (JSON.stringify(prev[id]) !== JSON.stringify(value)) return prev;
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
          var next = Object.assign({}, prev);
          next[id] = value;
          return next;
        });
        return Promise.resolve(api.call(DOMAIN + ".configSet", { values: patch })).then(function(r) {
          if (r && r.ok === false) throw new Error(r && r.error || t.loadFail);
          var body = unwrap(r) || {};
          if (seq !== seqRef.current) return body;
          if (typeof cfg.setValues === "function") cfg.setValues(body.values);
          setLocal({});
          toastOnce(t.saved);
          if (notifier && typeof notifier.refreshConfig === "function") notifier.refreshConfig();
          return body;
        }).catch(function(e) {
          dropLocal(id, value);
          toastOnce(String(e && e.message || e));
        });
      }
      function resetAll() {
        Promise.resolve(api.call(DOMAIN + ".configReset", {})).then(function(r) {
          if (r && r.ok === false) throw new Error(r && r.error || t.loadFail);
          var body = unwrap(r) || {};
          if (typeof cfg.setValues === "function") cfg.setValues(body.values);
          seqRef.current += 1;
          setLocal({});
          toastOnce(t.saved);
          if (notifier && typeof notifier.refreshConfig === "function") notifier.refreshConfig();
        }).catch(function(e) {
          toastOnce(String(e && e.message || e));
        });
      }
      function control(item) {
        var value = values()[item.id];
        if (item.type === "bool") {
          return h("input", {
            type: "checkbox",
            "aria-label": labelOf(item, lang),
            checked: value === true,
            onChange: function(e) {
              save(item.id, e.target.checked);
            }
          });
        }
        if (item.type === "number") {
          var pct = Math.round((Number(value) || 0) * 100);
          return h(
            "span",
            { className: "wbm-field-ctl" },
            h("input", {
              className: "wbm-range",
              type: "range",
              min: item.min === void 0 ? 0 : item.min,
              max: item.max === void 0 ? 1 : item.max,
              step: 0.05,
              value: Number(value) || 0,
              "aria-label": labelOf(item, lang),
              onChange: function(e) {
                save(item.id, Number(e.target.value));
              }
            }),
            h("span", { className: "wbm-note" }, String(pct) + "%")
          );
        }
        if (item.type === "int") {
          return h("input", {
            className: "wbm-num",
            type: "number",
            min: item.min,
            max: item.max,
            value: value === void 0 ? "" : value,
            "aria-label": labelOf(item, lang),
            onChange: function(e) {
              save(item.id, Number(e.target.value));
            }
          });
        }
        if (item.type === "time") {
          return h("input", {
            className: "wbm-time",
            type: "time",
            value: value || "",
            "aria-label": labelOf(item, lang),
            onChange: function(e) {
              save(item.id, e.target.value);
            }
          });
        }
        if (item.type === "enum") {
          return h(
            "select",
            {
              className: "wbm-select",
              value: String(value === void 0 ? "" : value),
              "aria-label": labelOf(item, lang),
              onChange: function(e) {
                var hit = (item.values || []).filter(function(option) {
                  return String(option.value) === e.target.value;
                })[0];
                save(item.id, hit ? hit.value : e.target.value);
              }
            },
            (item.values || []).map(function(option) {
              return h("option", { key: String(option.value), value: String(option.value) }, lang === "en" ? option.en : option.zh);
            })
          );
        }
        if (item.type === "multi") {
          var picked = Array.isArray(value) ? value : [];
          return h(
            "span",
            { className: "wbm-multis" },
            (item.values || []).map(function(option) {
              var on = picked.indexOf(option.value) >= 0;
              return h(
                "label",
                { className: "wbm-check", key: option.value },
                h("input", {
                  type: "checkbox",
                  checked: on,
                  onChange: function() {
                    var next = picked.slice();
                    if (on) next = next.filter(function(x) {
                      return x !== option.value;
                    });
                    else next.push(option.value);
                    save(item.id, next);
                  }
                }),
                h("span", null, lang === "en" ? option.en : option.zh)
              );
            })
          );
        }
        return h("input", {
          className: "wbm-input",
          type: "text",
          value: String(value === void 0 ? "" : value),
          "aria-label": labelOf(item, lang),
          onChange: function(e) {
            save(item.id, e.target.value);
          }
        });
      }
      if (cfg.error) return h("div", { className: "wbm-err", role: "alert" }, h("span", null, cfg.error));
      if (!cfg.ready) return h("div", { className: "wbm-empty", role: "status", "aria-busy": "true" }, t.loading);
      if (!cfg.items.length) return h("div", { className: "wbm-empty" }, t.noData);
      var groups = cfg.groups.length ? cfg.groups : [{ id: "", zh: "", en: "" }];
      return h(
        "div",
        { className: "wbm-root wbm-config" },
        h(
          "div",
          { className: "wbm-toolbar" },
          h("span", { className: "wbm-grow" }),
          h(
            "button",
            { type: "button", className: "wbm-btn", onClick: resetAll },
            props.Icon ? h(props.Icon, { name: "reset", size: 13 }) : null,
            h("span", null, t.resetAll)
          )
        ),
        h(
          "div",
          { className: "wbm-note" },
          t.configHint
        ),
        groups.map(function(group) {
          var items = cfg.items.filter(function(item) {
            return item.group === group.id;
          });
          if (!items.length) return null;
          return h(
            "div",
            { className: "wbm-section", key: group.id || "all" },
            group.zh || group.en ? h("h3", null, lang === "en" ? group.en || group.zh : group.zh || group.en) : null,
            items.map(function(item) {
              return h(
                "div",
                { className: "wbm-field", key: item.id, "data-config": item.id },
                h(
                  "div",
                  { className: "wbm-field-main" },
                  h("span", { className: "wbm-field-label" }, labelOf(item, lang)),
                  hintOf(item, lang) ? h("span", { className: "wbm-field-hint" }, hintOf(item, lang)) : null
                ),
                h(
                  "div",
                  { className: "wbm-field-ctl" },
                  control(item),
                  item.id.indexOf("sound.") === 0 && notifier && typeof notifier.preview === "function" ? h(
                    "button",
                    { type: "button", className: "wbm-btn", onClick: function() {
                      notifier.preview("info");
                    } },
                    props.Icon ? h(props.Icon, { name: "play", size: 12 }) : null,
                    h("span", null, t.preview)
                  ) : null
                )
              );
            })
          );
        }),
        h("div", { className: "wbm-note" }, t.quietNote),
        h("div", { className: "wbm-note" }, t.readDaysNote),
        toast ? h("div", { className: "wbm-toast", role: "status" }, toast) : null
      );
    }
    module2.exports = { ConfigView, useConfig, DOMAIN };
  }
});

// packages/addons/message/client/views/inbox.cjs
var require_inbox = __commonJS({
  "packages/addons/message/client/views/inbox.cjs"(exports2, module2) {
    "use strict";
    module2.exports = function(deps) {
      var React = deps.React;
      var h = React.createElement;
      function fmt(template, vars) {
        return String(template).replace(/\{(\w+)\}/g, function(m, key) {
          return vars[key] === void 0 ? m : String(vars[key]);
        });
      }
      function unwrap(r) {
        return r && r.result !== void 0 ? r.result : r;
      }
      function timeText(ts, lang) {
        if (!ts) return "";
        try {
          return new Date(ts).toLocaleString(lang === "en" ? "en-US" : "zh-CN", { hour12: false });
        } catch (e) {
          return String(ts);
        }
      }
      function icon(props, name, size) {
        return props.Icon ? h(props.Icon, { name, size: size || 13 }) : null;
      }
      function MessageCard(props) {
        var m = props.message;
        var t = props.t;
        var lang = props.lang;
        var level = m.level || "info";
        return h(
          "article",
          { className: "wbm-card lv-" + level + (m.read ? "" : " is-unread") + " wbm-msg", "data-id": m.id },
          h(
            "div",
            { className: "wbm-card-top" },
            h("span", { className: "wbm-badge lv-" + level }, t.level && t.level[level] || level),
            h("span", { className: "wbm-title" }, m.title),
            h("span", { className: "wbm-grow" }),
            m.read ? h("span", { className: "wbm-badge" }, t.read) : null
          ),
          h(
            "div",
            { className: "wbm-meta" },
            m.source ? h("span", null, t.from + "\uFF1A" + m.source) : null,
            h("span", null, timeText(m.createdAt, lang)),
            m.audience && m.audience !== "all" ? h("span", null, t.audience && t.audience[m.audience] || m.audience) : null
          ),
          h("div", { className: "wbm-body" }, m.body || t.bodyEmpty),
          m.read ? null : h(
            "div",
            { className: "wbm-ops" },
            h(
              "button",
              { type: "button", className: "wbm-btn", onClick: function() {
                props.onMark([m.id]);
              } },
              icon(props, "check"),
              h("span", null, t.markRead)
            )
          )
        );
      }
      return function InboxView(props) {
        var api = props.api;
        var t = props.t;
        var lang = props.lang;
        var pageSize = 20;
        var dataS = React.useState(null);
        var data = dataS[0];
        var setData = dataS[1];
        var busyS = React.useState(true);
        var busy = busyS[0];
        var setBusy = busyS[1];
        var errS = React.useState("");
        var error = errS[0];
        var setError = errS[1];
        var pageS = React.useState(1);
        var page = pageS[0];
        var setPage = pageS[1];
        var unreadS = React.useState(false);
        var unreadOnly = unreadS[0];
        var setUnreadOnly = unreadS[1];
        var levelS = React.useState("");
        var level = levelS[0];
        var setLevel = levelS[1];
        var textS = React.useState("");
        var text = textS[0];
        var setText = textS[1];
        var draftS = React.useState("");
        var draft = draftS[0];
        var setDraft = draftS[1];
        var tickS = React.useState(0);
        var tick = tickS[0];
        var setTick = tickS[1];
        var toastS = React.useState("");
        var toast = toastS[0];
        var setToast = toastS[1];
        React.useEffect(function() {
          var timer = setTimeout(function() {
            setText(draft.trim());
            setPage(1);
          }, 260);
          return function() {
            clearTimeout(timer);
          };
        }, [draft]);
        React.useEffect(function() {
          var alive = true;
          setBusy(true);
          var args = { pageNumber: page, pageSize };
          if (unreadOnly) args.unreadOnly = true;
          if (level) args.level = level;
          if (text) args.text = text;
          Promise.resolve(api.call("message.list", args)).then(function(r) {
            if (!alive) return;
            if (r && r.ok === false) throw new Error(r && r.error || t.loadFail);
            setData(unwrap(r) || { records: [], total: 0, unread: 0, pageNumber: 1 });
            setError("");
          }).catch(function(e) {
            if (!alive) return;
            setError(String(e && e.message || e) || t.loadFail);
          }).then(function() {
            if (alive) setBusy(false);
          });
          return function() {
            alive = false;
          };
        }, [api, page, unreadOnly, level, text, tick]);
        var unsubscribe = null;
        React.useEffect(function() {
          if (!api || typeof api.subscribe !== "function") return void 0;
          unsubscribe = api.subscribe(function(evt) {
            if (!evt || evt.domainId !== "wb-addon-message") return;
            setTick(function(x) {
              return x + 1;
            });
          });
          return function() {
            if (unsubscribe) unsubscribe();
          };
        }, [api]);
        function toastOnce(message) {
          setToast(message);
          setTimeout(function() {
            setToast("");
          }, 2200);
        }
        function mark(ids, all) {
          var args = all ? { all: true } : { ids };
          Promise.resolve(api.call("message.markRead", args)).then(function(r) {
            if (r && r.ok === false) throw new Error(r && r.error || t.loadFail);
            var body = unwrap(r) || {};
            toastOnce(fmt(t.marked, { n: body.updated || 0 }));
            setTick(function(x) {
              return x + 1;
            });
          }).catch(function(e) {
            toastOnce(String(e && e.message || e));
          });
        }
        var records = data && data.records || [];
        var total = data ? data.total : 0;
        var unread = data ? data.unread : 0;
        var pages = Math.max(1, Math.ceil(total / pageSize));
        return h(
          "div",
          { className: "wbm-root wbm-inbox" },
          h(
            "div",
            { className: "wbm-toolbar" },
            h(
              "label",
              { className: "wbm-check" },
              h("input", { type: "checkbox", checked: unreadOnly, onChange: function(e) {
                setUnreadOnly(e.target.checked);
                setPage(1);
              } }),
              h("span", null, t.unreadOnly)
            ),
            h(
              "select",
              { className: "wbm-select", value: level, "aria-label": t.levelAll, onChange: function(e) {
                setLevel(e.target.value);
                setPage(1);
              } },
              h("option", { value: "" }, t.levelAll),
              ["info", "success", "warning", "error"].map(function(lv) {
                return h("option", { key: lv, value: lv }, t.level[lv]);
              })
            ),
            h("input", {
              className: "wbm-input",
              type: "search",
              value: draft,
              placeholder: t.searchPlaceholder,
              "aria-label": t.searchPlaceholder,
              onChange: function(e) {
                setDraft(e.target.value);
              }
            }),
            h("span", { className: "wbm-grow" }),
            h("span", { className: "wbm-sumbox" }, h("span", null, fmt(t.total, { n: total })), h("span", null, fmt(t.unreadCount, { n: unread }))),
            h(
              "button",
              { type: "button", className: "wbm-btn", disabled: !unread, onClick: function() {
                mark(null, true);
              } },
              icon(props, "check-check"),
              h("span", null, t.markAll)
            ),
            h(
              "button",
              { type: "button", className: "wbm-btn", onClick: function() {
                setTick(function(x) {
                  return x + 1;
                });
              } },
              icon(props, "refresh"),
              h("span", null, t.retry)
            )
          ),
          error ? h("div", { className: "wbm-err", role: "alert" }, h("span", null, error), h("button", { type: "button", className: "wbm-btn", onClick: function() {
            setTick(function(x) {
              return x + 1;
            });
          } }, t.retry)) : null,
          busy && !data ? h("div", { className: "wbm-empty", role: "status", "aria-busy": "true" }, t.loading) : null,
          !busy && !records.length ? h("div", { className: "wbm-empty" }, text || level || unreadOnly ? t.noMatch : t.empty) : null,
          records.length ? h(
            "div",
            { className: "wbm-list" },
            records.map(function(m) {
              return h(MessageCard, { key: m.id, message: m, t, lang, Icon: props.Icon, onMark: mark });
            })
          ) : null,
          pages > 1 ? h(
            "div",
            { className: "wbm-pager" },
            h("span", null, fmt(t.pageInfo, { page, pages })),
            h("button", { type: "button", className: "wbm-btn", disabled: page <= 1, onClick: function() {
              setPage(page - 1);
            } }, t.prev),
            h("button", { type: "button", className: "wbm-btn", disabled: page >= pages, onClick: function() {
              setPage(page + 1);
            } }, t.next)
          ) : null,
          toast ? h("div", { className: "wbm-toast", role: "status" }, toast) : null
        );
      };
    };
  }
});

// packages/addons/message/client/views/stats.cjs
var require_stats = __commonJS({
  "packages/addons/message/client/views/stats.cjs"(exports2, module2) {
    "use strict";
    module2.exports = function(deps) {
      var React = deps.React;
      var h = React.createElement;
      function fmt(template, vars) {
        return String(template).replace(/\{(\w+)\}/g, function(m, key) {
          return vars[key] === void 0 ? m : String(vars[key]);
        });
      }
      function unwrap(r) {
        return r && r.result !== void 0 ? r.result : r;
      }
      return function StatsView(props) {
        var api = props.api;
        var t = props.t;
        var lang = props.lang;
        var dataS = React.useState(null);
        var data = dataS[0];
        var setData = dataS[1];
        var busyS = React.useState(true);
        var busy = busyS[0];
        var setBusy = busyS[1];
        var errS = React.useState("");
        var error = errS[0];
        var setError = errS[1];
        var tickS = React.useState(0);
        var tick = tickS[0];
        var setTick = tickS[1];
        React.useEffect(function() {
          var alive = true;
          setBusy(true);
          Promise.resolve(api.call("message.stats", { days: 14 })).then(function(r) {
            if (!alive) return;
            if (r && r.ok === false) throw new Error(r && r.error || t.loadFail);
            setData(unwrap(r) || null);
            setError("");
          }).catch(function(e) {
            if (!alive) return;
            setError(String(e && e.message || e) || t.loadFail);
          }).then(function() {
            if (alive) setBusy(false);
          });
          return function() {
            alive = false;
          };
        }, [api, tick]);
        if (busy && !data) return h("div", { className: "wbm-empty", role: "status", "aria-busy": "true" }, t.loading);
        if (error) return h("div", { className: "wbm-err", role: "alert" }, h("span", null, error), h("button", { type: "button", className: "wbm-btn", onClick: function() {
          setTick(tick + 1);
        } }, t.retry));
        if (!data) return h("div", { className: "wbm-empty" }, t.noData);
        var totals = data.totals || { total: 0, unread: 0, read: 0 };
        var maxLevel = Math.max(1, (data.byLevel || []).reduce(function(max, row) {
          return Math.max(max, row.total);
        }, 0));
        var maxTrend = Math.max(1, (data.trend || []).reduce(function(max, row) {
          return Math.max(max, row.count);
        }, 0));
        return h(
          "div",
          { className: "wbm-root wbm-stats" },
          h(
            "div",
            { className: "wbm-cards" },
            h("div", { className: "wbm-kpi" }, h("b", null, String(totals.total)), h("span", null, t.statTotal)),
            h("div", { className: "wbm-kpi" }, h("b", null, String(totals.unread)), h("span", null, t.statUnread)),
            h("div", { className: "wbm-kpi" }, h("b", null, String(totals.read)), h("span", null, t.statRead)),
            h(
              "div",
              { className: "wbm-kpi" },
              h("b", { style: { fontSize: "13px" } }, data.oldestUnread ? new Date(data.oldestUnread.createdAt).toLocaleDateString(lang === "en" ? "en-US" : "zh-CN") : "\u2014"),
              h("span", null, t.statOldest)
            )
          ),
          h(
            "div",
            { className: "wbm-section" },
            h("h3", null, t.byLevel),
            h(
              "div",
              { className: "wbm-bars" },
              (data.byLevel || []).map(function(row) {
                return h(
                  "div",
                  { className: "wbm-bar", key: row.level },
                  h("span", null, t.level && t.level[row.level] || row.level),
                  h("span", { className: "wbm-bar-track" }, h("span", { className: "wbm-bar-fill lv-" + row.level, style: { width: Math.round(row.total / maxLevel * 100) + "%" } })),
                  h("span", null, String(row.total))
                );
              })
            )
          ),
          h(
            "div",
            { className: "wbm-section" },
            h("h3", null, t.bySource),
            (data.bySource || []).length ? h(
              "div",
              { className: "wbm-bars" },
              data.bySource.map(function(row) {
                var max = Math.max(1, data.bySource[0].total);
                return h(
                  "div",
                  { className: "wbm-bar", key: row.source },
                  h("span", null, row.source || t.noSource),
                  h("span", { className: "wbm-bar-track" }, h("span", { className: "wbm-bar-fill", style: { width: Math.round(row.total / max * 100) + "%" } })),
                  h("span", null, String(row.total))
                );
              })
            ) : h("div", { className: "wbm-note" }, t.noData)
          ),
          h(
            "div",
            { className: "wbm-section" },
            h("h3", null, fmt(t.trend, { days: data.days })),
            h(
              "div",
              { className: "wbm-trend" },
              (data.trend || []).map(function(row) {
                return h(
                  "div",
                  { className: "wbm-trend-col", key: row.date, title: row.date + " \xB7 " + row.count },
                  h("span", { className: "wbm-trend-bar", style: { height: Math.max(2, Math.round(row.count / maxTrend * 56)) + "px" } }),
                  h("span", null, row.date.slice(5))
                );
              })
            ),
            h("div", { className: "wbm-note" }, t.statsHint)
          )
        );
      };
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

// packages/addons/message/client/views/data.cjs
var require_data = __commonJS({
  "packages/addons/message/client/views/data.cjs"(exports2, module2) {
    "use strict";
    module2.exports = require_data_view()({
      domain: "message",
      prefix: "wbm",
      tables: ["message"],
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

// packages/addons/message/client/views/actions.cjs
var require_actions = __commonJS({
  "packages/addons/message/client/views/actions.cjs"(exports2, module2) {
    "use strict";
    module2.exports = require_action_schema_view()({
      domain: "message",
      prefix: "wbm"
    });
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/message-square.mjs
var message_square_exports = {};
__export(message_square_exports, {
  __iconData: () => __iconData25,
  default: () => MessageSquare
});
var __iconData25, MessageSquare;
var init_message_square = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/message-square.mjs"() {
    init_createLucideIcon();
    __iconData25 = {
      name: "message-square",
      size: 24,
      node: [
        [
          "path",
          {
            d: "M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z",
            key: "18887p"
          }
        ]
      ]
    };
    __iconData25.node;
    MessageSquare = createLucideIcon(__iconData25);
  }
});

// packages/addons/message/client/client.src.cjs
(function() {
  var root = typeof window !== "undefined" ? window : null;
  var host = root && root.__WB_HOST__;
  if (!host || !host.react) {
    if (typeof console !== "undefined") console.error("[dsh-workbench-message] \u5BBF\u4E3B\u524D\u7AEF\u672A\u5C31\u7EEA\uFF0C\u65E0\u6CD5\u6CE8\u518C\u63D2\u4EF6\u754C\u9762");
    module.exports = { name: "dsh-workbench-message", inject: [], apply: function() {
    } };
    return;
  }
  var React = host.react;
  var h = host.h;
  var ICONS = {
    bell: (init_bell(), __toCommonJS(bell_exports)).default,
    "bell-off": (init_bell_off(), __toCommonJS(bell_off_exports)).default,
    inbox: (init_inbox(), __toCommonJS(inbox_exports)).default,
    mail: (init_mail(), __toCommonJS(mail_exports)).default,
    "mail-open": (init_mail_open(), __toCommonJS(mail_open_exports)).default,
    chart: (init_chart_column(), __toCommonJS(chart_column_exports)).default,
    settings: (init_settings(), __toCommonJS(settings_exports)).default,
    database: (init_database(), __toCommonJS(database_exports)).default,
    list: (init_list(), __toCommonJS(list_exports)).default,
    check: (init_check(), __toCommonJS(check_exports)).default,
    "check-check": (init_check_check(), __toCommonJS(check_check_exports)).default,
    search: (init_search(), __toCommonJS(search_exports)).default,
    refresh: (init_refresh_cw(), __toCommonJS(refresh_cw_exports)).default,
    plus: (init_plus(), __toCommonJS(plus_exports)).default,
    volume: (init_volume_2(), __toCommonJS(volume_2_exports)).default,
    mute: (init_volume_x(), __toCommonJS(volume_x_exports)).default,
    moon: (init_moon(), __toCommonJS(moon_exports)).default,
    clock: (init_clock(), __toCommonJS(clock_exports)).default,
    info: (init_info(), __toCommonJS(info_exports)).default,
    success: (init_circle_check(), __toCommonJS(circle_check_exports)).default,
    warning: (init_triangle_alert(), __toCommonJS(triangle_alert_exports)).default,
    error: (init_circle_alert(), __toCommonJS(circle_alert_exports)).default,
    reset: (init_rotate_ccw(), __toCommonJS(rotate_ccw_exports)).default,
    play: (init_play(), __toCommonJS(play_exports)).default
  };
  function Icon2(props) {
    var C = ICONS[props.name] || ICONS.info;
    return h(C, { size: props.size || 14, strokeWidth: 2, "aria-hidden": "true", className: "wbg-svg" });
  }
  function tabIcon(name) {
    return function() {
      return h(Icon2, { name, size: 14 });
    };
  }
  var COPY = require_copy();
  var CSS = require_styles();
  var configView = require_config();
  var inboxFactory = require_inbox();
  var statsFactory = require_stats();
  var DataView = require_data().DataView;
  var ActionSchemaView = require_actions().ActionSchemaView;
  var notifier = require_notifier();
  var InboxView = inboxFactory({ React });
  var StatsView = statsFactory({ React });
  function langOf(props) {
    return props.lang === "en" ? "en" : "zh";
  }
  function withCopy(Inner, extra) {
    return function Wrapped(props) {
      var lang = langOf(props);
      var view = Object.assign(
        { api: props.api, lang, t: COPY[lang], Icon: Icon2 },
        typeof extra === "function" ? extra(props) : extra || {}
      );
      return h(Inner, view);
    };
  }
  var Inbox2 = withCopy(InboxView, null);
  var Stats = withCopy(StatsView, null);
  var Config = withCopy(configView.ConfigView, null);
  function ensureStyles() {
    if (typeof document === "undefined" || !document.head) return;
    if (document.getElementById("wb-message-style")) return;
    var style = document.createElement("style");
    style.id = "wb-message-style";
    style.textContent = CSS;
    document.head.appendChild(style);
  }
  ensureStyles();
  host.registerAddon({
    id: "wb-addon-message",
    version: "0.1.1",
    icon: (init_message_square(), __toCommonJS(message_square_exports)).default,
    views: [
      { id: "stats", icon: tabIcon("chart"), title: { zh: "\u7EDF\u8BA1", en: "Stats" }, component: Stats },
      { id: "inbox", icon: tabIcon("inbox"), title: { zh: "\u6536\u4EF6\u7BB1", en: "Inbox" }, component: Inbox2 },
      { id: "config", icon: tabIcon("settings"), title: { zh: "\u914D\u7F6E", en: "Config" }, component: Config },
      { id: "data", icon: tabIcon("database"), title: { zh: "\u6570\u636E", en: "Data" }, component: DataView },
      { id: "actions", icon: tabIcon("list"), title: { zh: "Action", en: "Actions" }, component: ActionSchemaView }
    ]
  });
  try {
    notifier.start();
  } catch (e) {
    if (typeof console !== "undefined") console.warn("[dsh-workbench-message] \u63D0\u793A\u97F3\u542F\u52A8\u5931\u8D25", e);
  }
  module.exports = {
    name: "dsh-workbench-message",
    inject: [],
    apply: function() {
    }
  };
})();
    return module.exports;
  },
});
