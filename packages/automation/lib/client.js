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

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/bot.mjs
var bot_exports = {};
__export(bot_exports, {
  __iconData: () => __iconData2,
  default: () => Bot
});
var __iconData2, Bot;
var init_bot = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/bot.mjs"() {
    init_createLucideIcon();
    __iconData2 = {
      name: "bot",
      size: 24,
      node: [
        ["path", { d: "M12 8V4H8", key: "hb8ula" }],
        ["rect", { width: "16", height: "12", x: "4", y: "8", rx: "2", key: "enze0r" }],
        ["path", { d: "M2 14h2", key: "vft8re" }],
        ["path", { d: "M20 14h2", key: "4cs60a" }],
        ["path", { d: "M15 13v2", key: "1xurst" }],
        ["path", { d: "M9 13v2", key: "rq6x2g" }]
      ]
    };
    __iconData2.node;
    Bot = createLucideIcon(__iconData2);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/calendar-clock.mjs
var calendar_clock_exports = {};
__export(calendar_clock_exports, {
  __iconData: () => __iconData3,
  default: () => CalendarClock
});
var __iconData3, CalendarClock;
var init_calendar_clock = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/calendar-clock.mjs"() {
    init_createLucideIcon();
    __iconData3 = {
      name: "calendar-clock",
      size: 24,
      node: [
        ["path", { d: "M16 14v2.2l1.6 1", key: "fo4ql5" }],
        ["path", { d: "M16 2v3", key: "otl347" }],
        ["path", { d: "M21 7.338V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h2.338", key: "7hb8p4" }],
        ["path", { d: "M3 9h5.859", key: "numkqi" }],
        ["path", { d: "M8 2v3", key: "1ioesn" }],
        ["circle", { cx: "16", cy: "16", r: "6", key: "qoo3c4" }]
      ]
    };
    __iconData3.node;
    CalendarClock = createLucideIcon(__iconData3);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/clock.mjs
var clock_exports = {};
__export(clock_exports, {
  __iconData: () => __iconData4,
  default: () => Clock
});
var __iconData4, Clock;
var init_clock = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/clock.mjs"() {
    init_createLucideIcon();
    __iconData4 = {
      name: "clock",
      size: 24,
      node: [
        ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
        ["path", { d: "M12 6v6l4 2", key: "mmk7yg" }]
      ]
    };
    __iconData4.node;
    Clock = createLucideIcon(__iconData4);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/hourglass.mjs
var hourglass_exports = {};
__export(hourglass_exports, {
  __iconData: () => __iconData5,
  default: () => Hourglass
});
var __iconData5, Hourglass;
var init_hourglass = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/hourglass.mjs"() {
    init_createLucideIcon();
    __iconData5 = {
      name: "hourglass",
      size: 24,
      node: [
        ["path", { d: "M5 22h14", key: "ehvnwv" }],
        ["path", { d: "M5 2h14", key: "pdyrp9" }],
        [
          "path",
          {
            d: "M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22",
            key: "1d314k"
          }
        ],
        [
          "path",
          {
            d: "M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2",
            key: "1vvvr6"
          }
        ]
      ]
    };
    __iconData5.node;
    Hourglass = createLucideIcon(__iconData5);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/repeat.mjs
var repeat_exports = {};
__export(repeat_exports, {
  __iconData: () => __iconData6,
  default: () => Repeat
});
var __iconData6, Repeat;
var init_repeat = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/repeat.mjs"() {
    init_createLucideIcon();
    __iconData6 = {
      name: "repeat",
      size: 24,
      node: [
        ["path", { d: "m17 2 4 4-4 4", key: "nntrym" }],
        ["path", { d: "M3 11v-1a4 4 0 0 1 4-4h14", key: "84bu3i" }],
        ["path", { d: "m7 22-4-4 4-4", key: "1wqhfi" }],
        ["path", { d: "M21 13v1a4 4 0 0 1-4 4H3", key: "1rx37r" }]
      ]
    };
    __iconData6.node;
    Repeat = createLucideIcon(__iconData6);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/send.mjs
var send_exports = {};
__export(send_exports, {
  __iconData: () => __iconData7,
  default: () => Send
});
var __iconData7, Send;
var init_send = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/send.mjs"() {
    init_createLucideIcon();
    __iconData7 = {
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
    __iconData7.node;
    Send = createLucideIcon(__iconData7);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/sparkles.mjs
var sparkles_exports = {};
__export(sparkles_exports, {
  __iconData: () => __iconData8,
  default: () => Sparkles
});
var __iconData8, Sparkles;
var init_sparkles = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/sparkles.mjs"() {
    init_createLucideIcon();
    __iconData8 = {
      name: "sparkles",
      size: 24,
      node: [
        [
          "path",
          {
            d: "M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z",
            key: "1s2grr"
          }
        ],
        ["path", { d: "M20 2v4", key: "1rf3ol" }],
        ["path", { d: "M22 4h-4", key: "gwowj6" }],
        ["circle", { cx: "4", cy: "20", r: "2", key: "6kqj1y" }]
      ],
      aliases: ["stars"]
    };
    __iconData8.node;
    Sparkles = createLucideIcon(__iconData8);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/alarm-clock.mjs
var alarm_clock_exports = {};
__export(alarm_clock_exports, {
  __iconData: () => __iconData9,
  default: () => AlarmClock
});
var __iconData9, AlarmClock;
var init_alarm_clock = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/alarm-clock.mjs"() {
    init_createLucideIcon();
    __iconData9 = {
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
    __iconData9.node;
    AlarmClock = createLucideIcon(__iconData9);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/triangle-exclamation-point.mjs
var __iconData10, TriangleExclamationPoint;
var init_triangle_exclamation_point = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/triangle-exclamation-point.mjs"() {
    init_createLucideIcon();
    __iconData10 = {
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
    __iconData10.node;
    TriangleExclamationPoint = createLucideIcon(__iconData10);
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

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/circle-check-big.mjs
var __iconData11, CircleCheckBig;
var init_circle_check_big = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/circle-check-big.mjs"() {
    init_createLucideIcon();
    __iconData11 = {
      name: "circle-check-big",
      size: 24,
      node: [
        ["path", { d: "M21.801 10A10 10 0 1 1 17 3.335", key: "yps3ct" }],
        ["path", { d: "m9 11 3 3L22 4", key: "1pflzl" }]
      ],
      aliases: ["check-circle"]
    };
    __iconData11.node;
    CircleCheckBig = createLucideIcon(__iconData11);
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

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/database.mjs
var database_exports = {};
__export(database_exports, {
  __iconData: () => __iconData12,
  default: () => Database
});
var __iconData12, Database;
var init_database = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/database.mjs"() {
    init_createLucideIcon();
    __iconData12 = {
      name: "database",
      size: 24,
      node: [
        ["ellipse", { cx: "12", cy: "5", rx: "9", ry: "3", key: "msslwz" }],
        ["path", { d: "M3 5V19A9 3 0 0 0 21 19V5", key: "1wlel7" }],
        ["path", { d: "M3 12A9 3 0 0 0 21 12", key: "mv7ke4" }]
      ]
    };
    __iconData12.node;
    Database = createLucideIcon(__iconData12);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/hand.mjs
var hand_exports = {};
__export(hand_exports, {
  __iconData: () => __iconData13,
  default: () => Hand
});
var __iconData13, Hand;
var init_hand = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/hand.mjs"() {
    init_createLucideIcon();
    __iconData13 = {
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
    __iconData13.node;
    Hand = createLucideIcon(__iconData13);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/rotate-ccw-clock.mjs
var __iconData14, RotateCcwClock;
var init_rotate_ccw_clock = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/rotate-ccw-clock.mjs"() {
    init_createLucideIcon();
    __iconData14 = {
      name: "rotate-ccw-clock",
      size: 24,
      node: [
        ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", key: "1357e3" }],
        ["path", { d: "M3 3v5h5", key: "1xhq8a" }],
        ["path", { d: "M12 7v5l4 2", key: "1fdv2h" }]
      ],
      aliases: ["history"]
    };
    __iconData14.node;
    RotateCcwClock = createLucideIcon(__iconData14);
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

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/layers.mjs
var layers_exports = {};
__export(layers_exports, {
  __iconData: () => __iconData15,
  default: () => Layers
});
var __iconData15, Layers;
var init_layers = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/layers.mjs"() {
    init_createLucideIcon();
    __iconData15 = {
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
    __iconData15.node;
    Layers = createLucideIcon(__iconData15);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/list.mjs
var list_exports = {};
__export(list_exports, {
  __iconData: () => __iconData16,
  default: () => List
});
var __iconData16, List;
var init_list = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/list.mjs"() {
    init_createLucideIcon();
    __iconData16 = {
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
    __iconData16.node;
    List = createLucideIcon(__iconData16);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/pencil.mjs
var pencil_exports = {};
__export(pencil_exports, {
  __iconData: () => __iconData17,
  default: () => Pencil
});
var __iconData17, Pencil;
var init_pencil = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/pencil.mjs"() {
    init_createLucideIcon();
    __iconData17 = {
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
    __iconData17.node;
    Pencil = createLucideIcon(__iconData17);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/play.mjs
var play_exports = {};
__export(play_exports, {
  __iconData: () => __iconData18,
  default: () => Play
});
var __iconData18, Play;
var init_play = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/play.mjs"() {
    init_createLucideIcon();
    __iconData18 = {
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
    __iconData18.node;
    Play = createLucideIcon(__iconData18);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/power.mjs
var power_exports = {};
__export(power_exports, {
  __iconData: () => __iconData19,
  default: () => Power
});
var __iconData19, Power;
var init_power = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/power.mjs"() {
    init_createLucideIcon();
    __iconData19 = {
      name: "power",
      size: 24,
      node: [
        ["path", { d: "M12 2v10", key: "mnfbl" }],
        ["path", { d: "M18.4 6.6a9 9 0 1 1-12.77.04", key: "obofu9" }]
      ]
    };
    __iconData19.node;
    Power = createLucideIcon(__iconData19);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/power-off.mjs
var power_off_exports = {};
__export(power_off_exports, {
  __iconData: () => __iconData20,
  default: () => PowerOff
});
var __iconData20, PowerOff;
var init_power_off = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/power-off.mjs"() {
    init_createLucideIcon();
    __iconData20 = {
      name: "power-off",
      size: 24,
      node: [
        ["path", { d: "M18.36 6.64A9 9 0 0 1 20.77 15", key: "dxknvb" }],
        ["path", { d: "M6.16 6.16a9 9 0 1 0 12.68 12.68", key: "1x7qb5" }],
        ["path", { d: "M12 2v4", key: "3427ic" }],
        ["path", { d: "m2 2 20 20", key: "1ooewy" }]
      ]
    };
    __iconData20.node;
    PowerOff = createLucideIcon(__iconData20);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/radio.mjs
var radio_exports = {};
__export(radio_exports, {
  __iconData: () => __iconData21,
  default: () => Radio
});
var __iconData21, Radio;
var init_radio = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/radio.mjs"() {
    init_createLucideIcon();
    __iconData21 = {
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
    __iconData21.node;
    Radio = createLucideIcon(__iconData21);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/shield-check.mjs
var shield_check_exports = {};
__export(shield_check_exports, {
  __iconData: () => __iconData22,
  default: () => ShieldCheck
});
var __iconData22, ShieldCheck;
var init_shield_check = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/shield-check.mjs"() {
    init_createLucideIcon();
    __iconData22 = {
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
    __iconData22.node;
    ShieldCheck = createLucideIcon(__iconData22);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/skip-forward.mjs
var skip_forward_exports = {};
__export(skip_forward_exports, {
  __iconData: () => __iconData23,
  default: () => SkipForward
});
var __iconData23, SkipForward;
var init_skip_forward = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/skip-forward.mjs"() {
    init_createLucideIcon();
    __iconData23 = {
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
    __iconData23.node;
    SkipForward = createLucideIcon(__iconData23);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/sliders-horizontal.mjs
var sliders_horizontal_exports = {};
__export(sliders_horizontal_exports, {
  __iconData: () => __iconData24,
  default: () => SlidersHorizontal
});
var __iconData24, SlidersHorizontal;
var init_sliders_horizontal = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/sliders-horizontal.mjs"() {
    init_createLucideIcon();
    __iconData24 = {
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
    __iconData24.node;
    SlidersHorizontal = createLucideIcon(__iconData24);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/timer.mjs
var timer_exports = {};
__export(timer_exports, {
  __iconData: () => __iconData25,
  default: () => Timer
});
var __iconData25, Timer;
var init_timer = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/timer.mjs"() {
    init_createLucideIcon();
    __iconData25 = {
      name: "timer",
      size: 24,
      node: [
        ["line", { x1: "10", x2: "14", y1: "2", y2: "2", key: "14vaq8" }],
        ["line", { x1: "12", x2: "15", y1: "14", y2: "11", key: "17fdiu" }],
        ["circle", { cx: "12", cy: "14", r: "8", key: "1e1u0o" }]
      ]
    };
    __iconData25.node;
    Timer = createLucideIcon(__iconData25);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/trash.mjs
var __iconData26, Trash;
var init_trash = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/trash.mjs"() {
    init_createLucideIcon();
    __iconData26 = {
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
    __iconData26.node;
    Trash = createLucideIcon(__iconData26);
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
  __iconData: () => __iconData27,
  default: () => X
});
var __iconData27, X;
var init_x = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/x.mjs"() {
    init_createLucideIcon();
    __iconData27 = {
      name: "x",
      size: 24,
      node: [
        ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
        ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
      ]
    };
    __iconData27.node;
    X = createLucideIcon(__iconData27);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/zap.mjs
var zap_exports = {};
__export(zap_exports, {
  __iconData: () => __iconData28,
  default: () => Zap
});
var __iconData28, Zap;
var init_zap = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/zap.mjs"() {
    init_createLucideIcon();
    __iconData28 = {
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
    __iconData28.node;
    Zap = createLucideIcon(__iconData28);
  }
});

// packages/addons/automation/client/ui/icons.cjs
var require_icons2 = __commonJS({
  "packages/addons/automation/client/ui/icons.cjs"(exports2, module2) {
    "use strict";
    var icons = require_icons();
    var set = icons.create("wba", {
      "activity": (init_activity(), __toCommonJS(activity_exports)).default,
      "bot": (init_bot(), __toCommonJS(bot_exports)).default,
      "calendar-clock": (init_calendar_clock(), __toCommonJS(calendar_clock_exports)).default,
      "clock": (init_clock(), __toCommonJS(clock_exports)).default,
      "hourglass": (init_hourglass(), __toCommonJS(hourglass_exports)).default,
      "repeat": (init_repeat(), __toCommonJS(repeat_exports)).default,
      "send": (init_send(), __toCommonJS(send_exports)).default,
      "sparkles": (init_sparkles(), __toCommonJS(sparkles_exports)).default,
      "alarm-clock": (init_alarm_clock(), __toCommonJS(alarm_clock_exports)).default,
      "alert-triangle": (init_alert_triangle(), __toCommonJS(alert_triangle_exports)).default,
      "check-circle": (init_check_circle(), __toCommonJS(check_circle_exports)).default,
      "database": (init_database(), __toCommonJS(database_exports)).default,
      "hand": (init_hand(), __toCommonJS(hand_exports)).default,
      "history": (init_history(), __toCommonJS(history_exports)).default,
      "layers": (init_layers(), __toCommonJS(layers_exports)).default,
      "list": (init_list(), __toCommonJS(list_exports)).default,
      "pencil": (init_pencil(), __toCommonJS(pencil_exports)).default,
      "play": (init_play(), __toCommonJS(play_exports)).default,
      "power": (init_power(), __toCommonJS(power_exports)).default,
      "power-off": (init_power_off(), __toCommonJS(power_off_exports)).default,
      "radio": (init_radio(), __toCommonJS(radio_exports)).default,
      "shield-check": (init_shield_check(), __toCommonJS(shield_check_exports)).default,
      "skip-forward": (init_skip_forward(), __toCommonJS(skip_forward_exports)).default,
      "sliders-horizontal": (init_sliders_horizontal(), __toCommonJS(sliders_horizontal_exports)).default,
      "timer": (init_timer(), __toCommonJS(timer_exports)).default,
      "trash-2": (init_trash_2(), __toCommonJS(trash_2_exports)).default,
      "x": (init_x(), __toCommonJS(x_exports)).default,
      "zap": (init_zap(), __toCommonJS(zap_exports)).default
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
      ".wba-block{display:flex;flex-direction:column;gap:6px;min-width:0}",
      ".wba-inline{display:flex;gap:8px;align-items:center;flex-wrap:wrap;min-width:0}",
      ".wba-grow{flex:1;min-width:0}",
      ".wba-svg{display:inline-block;vertical-align:middle;flex:none}",
      ".wba-w-120{width:120px;flex:none}",
      /* 共享数字输入框在触发配置里的宽度：与原来的 120px 输入框对齐。 */
      ".wba-num{flex:none}.wba-num .wbctl-num-input{width:120px}",
      ".wba-w-96{width:96px;flex:none}",
      ".wba-list{margin:0;padding-left:18px;display:flex;flex-direction:column;gap:6px;font-size:12px;line-height:1.55}",
      ".wba-clickable{cursor:pointer}",
      ".wba-check{display:inline-flex;align-items:center;gap:6px;font-size:12px;cursor:pointer}",
      ".wba-check input{accent-color:var(--wb-accent);margin:0}",
      // 设置页：纵向堆叠的卡片与 action 多选
      ".wba-stack{display:flex;flex-direction:column;gap:12px}",
      ".wba-notice.warn{background:var(--wb-surface);color:var(--wb-warn);border:1px solid var(--wb-warn)}",
      ".wba-hist{display:flex;flex-direction:column;gap:8px;max-height:52vh;overflow:auto}",
      ".wba-hist-row{display:flex;flex-direction:column;gap:6px;padding:8px 10px;border:1px solid var(--wb-line);border-radius:8px;background:var(--wb-surface)}",
      ".wba-hist-row .wba-pre{max-height:120px}",
      ".wba-empty-inline{display:flex;align-items:center;gap:10px;flex-wrap:wrap;padding:4px 0}",
      ".wba-picker{display:flex;flex-direction:column;gap:8px;max-height:280px;overflow:auto;border:1px solid var(--wb-border);border-radius:8px;padding:8px;background:var(--wb-surface)}",
      ".wba-picker-group{display:flex;flex-direction:column;gap:2px}",
      ".wba-picker-domain{margin:4px 0 2px;font-size:11px;letter-spacing:.04em;text-transform:uppercase;color:var(--wb-muted)}",
      ".wba-picker-row{padding:3px 4px;border-radius:6px;gap:8px;min-width:0}",
      ".wba-picker-row:hover{background:var(--wb-card)}",
      ".wba-picker-row .wba-hint{flex:1;min-width:0}",
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
    var SW = require_switch();
    var NF = require_number_field();
    module2.exports = require_client_base_styles()("wba").join("\n") + "\n" + require_layout_styles() + "\n" + SW.styles.join("\n") + "\n" + NF.styles.join("\n");
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
        "common.next": "\u4E0B\u4E00\u6B65",
        "common.back": "\u4E0A\u4E00\u6B65",
        "common.more": "\u52A0\u8F7D\u66F4\u65E9\u7684\u8BB0\u5F55",
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
        "rules.empty.noActionTitle": "\u8FD8\u6CA1\u6709\u542F\u7528\u4EFB\u4F55 action",
        "rules.empty.noActionBody": "\u81EA\u52A8\u5316\u9ED8\u8BA4\u4E0D\u5141\u8BB8\u8C03\u7528\u4EFB\u4F55 action\u3002\u5148\u5230\u8BBE\u7F6E\u9875\u52FE\u9009\u9700\u8981\u7684 action\uFF0C\u518D\u521B\u5EFA\u89C4\u5219\u3002",
        "rules.empty.noActionCta": "\u53BB\u8BBE\u7F6E",
        "rules.empty.noActionHint": "\u52FE\u9009\u540E\u7ACB\u5373\u751F\u6548\uFF0C\u4E0D\u9700\u8981\u91CD\u542F\u3002",
        "rules.actionDisabled": "\u672A\u542F\u7528",
        "rules.confirm.delete": "\u5220\u9664\u89C4\u5219\u300C{name}\u300D\uFF1F\u5220\u9664\u540E\u4E0D\u53EF\u6062\u590D\u3002",
        "rules.running": "\u8FD0\u884C\u4E2D\u2026",
        "rules.exec.mode": "\u6267\u884C\u65B9\u5F0F",
        "rules.exec.action": "\u8C03\u7528 Action",
        "rules.exec.agent": "\u4EA4\u7ED9 AI",
        "rules.agentAction": "\u4EA4\u7ED9 AI \u6267\u884C",
        "rules.schedule.active": "\u8FD0\u884C\u4E2D",
        "rules.schedule.paused": "\u5DF2\u6682\u505C",
        "rules.schedule.ended": "\u5DF2\u7ED3\u675F",
        "rules.schedule.missing": "\u5BBF\u4E3B\u4EFB\u52A1\u5DF2\u5220\u9664",
        "rules.lastDelivery": "\u4E0A\u6B21\u6295\u9012",
        "rules.history": "\u6295\u9012\u5386\u53F2",
        "rules.agentOffline": "\u5F53\u524D\u5BBF\u4E3B\u6CA1\u6709\u52A0\u8F7D\u300C\u81EA\u52A8\u5316\u4EFB\u52A1\u300D\u670D\u52A1\uFF0CAI \u89C4\u5219\u6682\u65F6\u53EA\u80FD\u67E5\u770B\uFF0C\u4E0D\u80FD\u521B\u5EFA\u6216\u4FEE\u6539\u3002",
        "rules.orphans": "\u5BBF\u4E3B\u91CC\u8FD8\u6709 {n} \u4E2A\u81EA\u52A8\u5316\u4EFB\u52A1\u6CA1\u6709\u7EB3\u5165\u5DE5\u4F5C\u53F0\u89C4\u5219\uFF0C\u53EF\u5728\u300C\u81EA\u52A8\u5316\u4EFB\u52A1\u300D\u9762\u677F\u7BA1\u7406\u3002",
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
        "editor.actionRequired": "\u8BF7\u9009\u62E9\u4E00\u4E2A action",
        "editor.noActions": "\u672A\u542F\u7528\u4EFB\u4F55 action",
        "editor.noActionsHint": "\u5148\u5230\u8BBE\u7F6E\u9875\u52FE\u9009 action\uFF0C\u624D\u80FD\u4FDD\u5B58\u89C4\u5219\u3002",
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
        "editor.section.mode": "\u6267\u884C\u65B9\u5F0F",
        "editor.mode.action": "\u8C03\u7528 Action",
        "editor.mode.actionHint": "\u6309\u65F6\u95F4\u6216\u57DF\u4E8B\u4EF6\u76F4\u63A5\u8C03\u7528\u5DF2\u542F\u7528\u7684 action\uFF1A\u786E\u5B9A\u6027\u6267\u884C\uFF0C\u4E0D\u6D88\u8017 token\u3002",
        "editor.mode.agent": "\u4EA4\u7ED9 AI",
        "editor.mode.agentHint": "\u628A\u63D0\u793A\u8BCD\u4EA4\u7ED9\u5BBF\u4E3B\u300C\u81EA\u52A8\u5316\u4EFB\u52A1\u300D\uFF0C\u6309\u65F6\u6295\u8FDB\u4F1A\u8BDD\u7531 AI \u6267\u884C\uFF1A\u6BCF\u6B21\u6295\u9012\u90FD\u4F1A\u4EA7\u751F\u4E00\u6B21\u6A21\u578B\u8BF7\u6C42\uFF0C\u7ED3\u679C\u4E0D\u786E\u5B9A\u3002",
        "editor.mode.locked": "\u6267\u884C\u65B9\u5F0F\u521B\u5EFA\u540E\u4E0D\u53EF\u4FEE\u6539\uFF1B\u8981\u6362\u65B9\u5F0F\u8BF7\u65B0\u5EFA\u4E00\u6761\u89C4\u5219\u3002",
        "editor.mode.agentUnavailable": "\u5F53\u524D\u5BBF\u4E3B\u6CA1\u6709\u300C\u81EA\u52A8\u5316\u4EFB\u52A1\u300D\u670D\u52A1\uFF0C\u65E0\u6CD5\u9009\u62E9\u300C\u4EA4\u7ED9 AI\u300D\u3002",
        "editor.section.prompt": "\u63D0\u793A\u8BCD",
        "editor.prompt": "\u63D0\u793A\u8BCD",
        "editor.promptPh": "\u4F8B\u5982\uFF1A\u8BFB\u4ECA\u5929\u7684\u4EFB\u52A1\u4E0E\u6D88\u606F\uFF0C\u6C47\u603B\u6210\u4E00\u6BB5\u6458\u8981\u53D1\u7ED9\u6211\u3002",
        "editor.promptHint": "\u539F\u6837\u6295\u9012\u7ED9 agent\uFF0C\u5199\u6E05\u8981\u505A\u4EC0\u4E48\u3001\u770B\u54EA\u4E9B\u6570\u636E\u3001\u8F93\u51FA\u6210\u4EC0\u4E48\u6837\u3002",
        "editor.promptRequired": "AI \u89C4\u5219\u9700\u8981\u586B\u5199\u63D0\u793A\u8BCD",
        "editor.section.timing": "\u65F6\u95F4\uFF08\u7531\u5BBF\u4E3B\u8C03\u5EA6\uFF09",
        "editor.section.target": "\u6295\u9012\u76EE\u6807",
        "editor.target": "\u76EE\u6807",
        "editor.target.new_once": "\u65B0\u5EFA\u4F1A\u8BDD\uFF08\u4E4B\u540E\u590D\u7528\u540C\u4E00\u4E2A\uFF09",
        "editor.target.new": "\u6BCF\u6B21\u65B0\u5EFA\u4F1A\u8BDD",
        "editor.targetHint": "\u300C\u65B0\u5EFA\u4F1A\u8BDD\u300D\u7531\u5BBF\u4E3B\u628A\u63D0\u793A\u8BCD\u6295\u8FDB\u4E00\u4E2A\u7A7A\u4F1A\u8BDD\u518D\u4EA4\u7ED9 AI\uFF1B\u300C\u6BCF\u6B21\u65B0\u5EFA\u300D\u53EF\u4EE5\u5E76\u53D1\uFF0C\u4E92\u4E0D\u5F71\u54CD\u3002",
        "editor.targetCwd": "\u5DE5\u4F5C\u533A\u8DEF\u5F84\uFF08\u53EF\u9009\uFF09",
        "editor.targetPreset": "Agent \u9884\u8BBE\uFF08\u53EF\u9009\uFF09",
        "editor.targetPresetPh": "\u7559\u7A7A\u4F7F\u7528\u5BBF\u4E3B\u9ED8\u8BA4\u9884\u8BBE",
        "editor.targetSession": "\u4F1A\u8BDD ID",
        "editor.targetSessionPh": "\u8981\u6295\u9012\u5230\u7684\u73B0\u6709\u4F1A\u8BDD id",
        "editor.targetSessionRequired": "\u6295\u9012\u5230\u73B0\u6709\u4F1A\u8BDD\u65F6\u9700\u8981\u586B\u5199\u4F1A\u8BDD ID",
        "agent.every": "\u6BCF\u9694",
        "agent.after": "\u5EF6\u8FDF",
        "agent.daily": "\u6BCF\u5929",
        "agent.weekly": "\u6BCF\u5468",
        "agent.cron": "cron \u8868\u8FBE\u5F0F",
        "agent.rrule": "RRULE",
        "agent.at": "\u4E00\u6B21\u6027",
        "agent.everyHint": "\u4E0D\u80FD\u5C0F\u4E8E 1 \u5206\u949F\uFF0C\u6700\u957F 30 \u5929\u3002",
        "agent.afterHint": "\u4ECE\u4FDD\u5B58\u65F6\u8D77\u5EF6\u8FDF N \u5206\u949F\u540E\u6267\u884C\u4E00\u6B21\u3002",
        "agent.cronPh": "0 9 * * 1-5",
        "agent.cronHint": "5 \u6BB5\uFF1A\u5206 \u65F6 \u65E5 \u6708 \u5468\u3002",
        "agent.rrulePh": "DTSTART;TZID=Asia/Shanghai:20260101T090000\nRRULE:FREQ=DAILY",
        "agent.rruleHint": "\u4E24\u884C\uFF1A\u4E00\u884C DTSTART\uFF0C\u4E00\u884C RRULE\u3002",
        "agent.date": "\u65E5\u671F",
        "agent.text.every": "\u6BCF {n} \u5206\u949F",
        "agent.text.everyHours": "\u6BCF {n} \u5C0F\u65F6",
        "agent.text.daily": "\u6BCF\u5929 {time}\uFF08{tz}\uFF09",
        "agent.text.weekly": "\u6BCF\u5468 {days} {time}\uFF08{tz}\uFF09",
        "agent.text.cron": "cron {expr}\uFF08{tz}\uFF09",
        "agent.text.rrule": "RRULE {expr}",
        "agent.text.at": "\u4E00\u6B21\u6027 {at}",
        "agent.text.after": "{n} \u5206\u949F\u540E\u6267\u884C\u4E00\u6B21",
        "agent.text.missing": "\u672A\u8BBE\u7F6E\u65F6\u95F4",
        "hist.title": "\u6295\u9012\u5386\u53F2",
        "hist.subtitle": "\u7531\u5BBF\u4E3B\u8BB0\u5F55\uFF1B\u56DE\u6267\u53EA\u4EE3\u8868\u63D0\u793A\u8BCD\u8FDB\u5165\u4E86\u76EE\u6807\u4F1A\u8BDD\uFF0C\u4E0D\u4EE3\u8868 agent \u6267\u884C\u6210\u529F\u3002",
        "hist.records": "\u6700\u8FD1 {n} \u6761",
        "hist.empty": "\u8FD8\u6CA1\u6709\u6295\u9012\u8BB0\u5F55\u3002",
        "hist.pruned": "\u66F4\u65E9\u7684\u8BB0\u5F55\u5DF2\u88AB\u5BBF\u4E3B\u6E05\u7406\u3002",
        "hist.missing": "\u5BBF\u4E3B\u4EFB\u52A1\u5DF2\u4E0D\u5B58\u5728\uFF0C\u65E0\u6CD5\u8BFB\u53D6\u6295\u9012\u8BB0\u5F55\u3002",
        "hist.col.time": "\u6295\u9012\u65F6\u95F4",
        "hist.col.detail": "\u8BE6\u60C5",
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
        "stats.subtitle": "\u628A\u5B9A\u65F6\u3001\u57DF\u4E8B\u4EF6\u6216\u624B\u52A8\u64CD\u4F5C\u63A5\u5230\u5DF2\u542F\u7528\u7684 action\uFF1A\u6A21\u677F\u3001\u6761\u4EF6\u3001\u9650\u9891\u4E0E\u8FD0\u884C\u8BB0\u5F55\u3002",
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
        "stats.allowedHint": "\u5728\u8BBE\u7F6E\u9875\u52FE\u9009\uFF0C\u9ED8\u8BA4\u7A7A",
        "stats.allowedEmpty": "\u5C1A\u672A\u542F\u7528\u4EFB\u4F55 action\uFF1B\u52FE\u9009\u540E\u624D\u80FD\u521B\u5EFA\u89C4\u5219\u3002",
        "stats.gotoSettings": "\u53BB\u8BBE\u7F6E",
        "stats.staleWarning": "{n} \u6761\u89C4\u5219\u7684 action \u672A\u542F\u7528\uFF0C\u8FD0\u884C\u4F1A\u88AB\u8DF3\u8FC7\u3002",
        "stats.denied": "\u4E0D\u5141\u8BB8\u8C03\u7528",
        "stats.deniedHint": "vault / automation / audit \u4E0E\u4EFB\u4F55\u5220\u9664\u3001\u5907\u4EFD\u7C7B action",
        "stats.triggers": "\u89E6\u53D1\u65B9\u5F0F",
        "stats.trigger.interval": "\u6BCF N \u5206\u949F\u6309 next_run_at \u5230\u671F\u6267\u884C\u3002",
        "stats.trigger.dailyAt": "\u6309\u65F6\u95F4\u4E0E\u65F6\u533A\u8BA1\u7B97\u4E0B\u4E00\u6B21\uFF0C\u53EF\u9009\u661F\u671F\u3002",
        "stats.trigger.event": "\u5BBF\u4E3B domain-event \u547D\u4E2D domainId + event \u65F6\u6267\u884C\u3002",
        "stats.trigger.manual": "\u5728\u89C4\u5219\u9875\u70B9\u300C\u8FD0\u884C\u300D\uFF0C\u4ECD\u53D7\u5DF2\u542F\u7528\u6E05\u5355\u3001\u6761\u4EF6\u4E0E\u9650\u9891\u7EA6\u675F\u3002",
        "config.title": "\u8BBE\u7F6E",
        "config.subtitle": "\u9650\u6D41\u53C2\u6570\u4E0E\u5141\u8BB8\u8C03\u7528\u7684 action \u90FD\u5B58\u5728\u672C\u673A\uFF1B\u89C4\u5219\u4E0E\u5176\u5B83\u4E1A\u52A1\u6570\u636E\u4E00\u8D77\u53C2\u4E0E\u5907\u4EFD\u3002",
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
        "config.c.backup": "\u89C4\u5219\u968F\u5907\u4EFD\u8FC1\u79FB\uFF1B\u5141\u8BB8\u6E05\u5355\u4E0E\u8FD0\u884C\u8BB0\u5F55\u53EA\u5728\u672C\u673A\uFF0C\u4E0D\u53C2\u4E0E\u4E91\u540C\u6B65\u3002",
        "config.c.safety": "\u786C\u5E95\u7EBF\u4E0D\u53EF\u914D\u7F6E\uFF1Avault.*\u3001automation.*\u3001audit.* \u4E0E\u4EFB\u4F55 delete/backup action \u6C38\u8FDC\u4E0D\u5141\u8BB8\u88AB\u81EA\u52A8\u5316\u8C03\u7528\u3002",
        "config.allowed.title": "\u5141\u8BB8\u8C03\u7528\u7684 action",
        "config.allowed.hint": "\u9ED8\u8BA4\u7A7A\u3002\u53EA\u6709\u52FE\u9009\u540E\u7684 action \u624D\u80FD\u88AB\u89C4\u5219\u8C03\u7528\uFF1B\u786C\u5E95\u7EBF\u4E0D\u53D7\u6B64\u5904\u5F71\u54CD\u3002",
        "config.allowed.search": "\u641C\u7D22 action \u6216\u6240\u5C5E\u57DF",
        "config.allowed.selected": "\u5DF2\u9009 {n} \u4E2A",
        "config.allowed.empty": "\u6CA1\u6709\u5339\u914D\u7684 action\uFF0C\u53EF\u5728\u4E0B\u65B9\u624B\u52A8\u6DFB\u52A0\u3002",
        "config.allowed.extra": "\u5DF2\u9009\u4F46\u4E0D\u5728\u5019\u9009",
        "config.allowed.manual": "\u624B\u52A8\u6DFB\u52A0 action",
        "config.allowed.add": "\u6DFB\u52A0",
        "config.allowed.invalid": "\u8BF7\u8F93\u5165 namespace.action\uFF0C\u4E14\u4E0D\u80FD\u662F vault / automation / audit \u6216 delete / backup\u3002",
        "config.allowed.deniedNote": "vault / automation / audit \u4E0E\u5220\u9664\u3001\u5907\u4EFD\u7C7B action \u6C38\u8FDC\u4E0D\u53EF\u542F\u7528\u3002"
      },
      en: {
        "common.save": "Save",
        "common.cancel": "Cancel",
        "common.close": "Close",
        "common.next": "Next",
        "common.back": "Back",
        "common.more": "Load older deliveries",
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
        "rules.empty.noActionTitle": "No actions enabled yet",
        "rules.empty.noActionBody": "Automation cannot call any action by default. Pick the ones you need in Settings first.",
        "rules.empty.noActionCta": "Open settings",
        "rules.empty.noActionHint": "Changes take effect immediately; no restart needed.",
        "rules.actionDisabled": "Disabled",
        "rules.confirm.delete": 'Delete rule "{name}"? This cannot be undone.',
        "rules.running": "Running\u2026",
        "rules.exec.mode": "Mode",
        "rules.exec.action": "Run action",
        "rules.exec.agent": "Hand to AI",
        "rules.agentAction": "Handed to AI",
        "rules.schedule.active": "Active",
        "rules.schedule.paused": "Paused",
        "rules.schedule.ended": "Ended",
        "rules.schedule.missing": "Schedule deleted",
        "rules.lastDelivery": "Last delivery",
        "rules.history": "Delivery history",
        "rules.agentOffline": "This Host does not expose the Schedule service, so AI rules are read-only for now.",
        "rules.orphans": "{n} schedule task(s) in the Host are not registered as rules; manage them in the Schedule panel.",
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
        "editor.actionRequired": "Pick an action",
        "editor.noActions": "No actions enabled",
        "editor.noActionsHint": "Enable actions in Settings before saving a rule.",
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
        "editor.section.mode": "Mode",
        "editor.mode.action": "Run action",
        "editor.mode.actionHint": "Call an enabled action directly on a schedule or domain event: deterministic, no tokens.",
        "editor.mode.agent": "Hand to AI",
        "editor.mode.agentHint": "Register the prompt with the Host Schedule service; each delivery starts a model request and the result is not deterministic.",
        "editor.mode.locked": "The mode cannot change after creation; create a new rule instead.",
        "editor.mode.agentUnavailable": 'This Host does not expose the Schedule service, so "Hand to AI" is unavailable.',
        "editor.section.prompt": "Prompt",
        "editor.prompt": "Prompt",
        "editor.promptPh": "e.g. Read today's tasks and messages, then send me a short digest.",
        "editor.promptHint": "Delivered verbatim to the agent; state the goal, the data to read and the expected output.",
        "editor.promptRequired": "AI rules need a prompt",
        "editor.section.timing": "Timing (driven by the Host)",
        "editor.section.target": "Delivery target",
        "editor.target": "Target",
        "editor.target.new_once": "New session (reused afterwards)",
        "editor.target.new": "New session each time",
        "editor.targetHint": 'The Host delivers the prompt into an empty session; "each time" may run concurrently.',
        "editor.targetCwd": "Workspace path (optional)",
        "editor.targetPreset": "Agent preset (optional)",
        "editor.targetPresetPh": "Leave empty for the Host default",
        "editor.targetSession": "Session id",
        "editor.targetSessionPh": "Existing session id to deliver into",
        "editor.targetSessionRequired": "A session id is required when delivering into an existing session",
        "agent.every": "Every",
        "agent.after": "Delay",
        "agent.daily": "Daily",
        "agent.weekly": "Weekly",
        "agent.cron": "cron expression",
        "agent.rrule": "RRULE",
        "agent.at": "One-off",
        "agent.everyHint": "At least 1 minute, at most 30 days.",
        "agent.afterHint": "Runs once, N minutes after saving.",
        "agent.cronPh": "0 9 * * 1-5",
        "agent.cronHint": "Five fields: minute hour day month weekday.",
        "agent.rrulePh": "DTSTART;TZID=Asia/Shanghai:20260101T090000\nRRULE:FREQ=DAILY",
        "agent.rruleHint": "Two lines: DTSTART then RRULE.",
        "agent.date": "Date",
        "agent.text.every": "Every {n} min",
        "agent.text.everyHours": "Every {n} h",
        "agent.text.daily": "Daily at {time} ({tz})",
        "agent.text.weekly": "Every {days} at {time} ({tz})",
        "agent.text.cron": "cron {expr} ({tz})",
        "agent.text.rrule": "RRULE {expr}",
        "agent.text.at": "Once at {at}",
        "agent.text.after": "Once in {n} minutes",
        "agent.text.missing": "No timing set",
        "hist.title": "Delivery history",
        "hist.subtitle": "Recorded by the Host; a receipt only means the prompt reached the session, not that the agent succeeded.",
        "hist.records": "Latest {n}",
        "hist.empty": "No deliveries yet.",
        "hist.pruned": "Earlier records were pruned by the Host.",
        "hist.missing": "The schedule task no longer exists; history is unavailable.",
        "hist.col.time": "Delivered at",
        "hist.col.detail": "Detail",
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
        "stats.allowedHint": "Chosen in Settings; empty by default",
        "stats.allowedEmpty": "No actions enabled yet; enable some before creating rules.",
        "stats.gotoSettings": "Open settings",
        "stats.staleWarning": "{n} rule(s) use actions that are not enabled and will be skipped.",
        "stats.denied": "Denied",
        "stats.deniedHint": "vault / automation / audit and any delete or backup action",
        "stats.triggers": "Triggers",
        "stats.trigger.interval": "Runs when next_run_at is due every N minutes.",
        "stats.trigger.dailyAt": "Next run from time and time zone, optional weekdays.",
        "stats.trigger.event": "A host domain-event matching domainId + event.",
        "stats.trigger.manual": '"Run now" on the rules page, still subject to whitelist, conditions and limits.',
        "config.title": "Settings",
        "config.subtitle": "Limits and allowed actions stay on this device; rules are part of regular backups.",
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
        "config.c.backup": "Rules travel with backups; the allowed list and run history stay on this device.",
        "config.c.safety": "Hard limits are not configurable: vault.*, automation.*, audit.* and any delete/backup action can never be called.",
        "config.allowed.title": "Allowed actions",
        "config.allowed.hint": "Empty by default. Only checked actions can be called by rules; hard limits always apply.",
        "config.allowed.search": "Search action or domain",
        "config.allowed.selected": "{n} selected",
        "config.allowed.empty": "No matching action; add one manually below.",
        "config.allowed.extra": "Selected but not in catalog",
        "config.allowed.manual": "Add action manually",
        "config.allowed.add": "Add",
        "config.allowed.invalid": "Use namespace.action, and avoid vault / automation / audit or delete / backup.",
        "config.allowed.deniedNote": "vault / automation / audit and delete/backup actions can never be enabled."
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
          (props.actions || []).length ? h("div", { className: "wba-pills" }, (props.actions || []).map(function(a) {
            return h("span", { key: a, className: "wba-chip static" }, h("code", null, a));
          })) : h(
            "div",
            { className: "wba-empty-inline" },
            h("p", { className: "wba-hint" }, t("stats.allowedEmpty")),
            h(C.Btn, { h, onClick: props.onSettings }, t("stats.gotoSettings"))
          )
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
          h("div", { className: "wba-pills" }, (props.denied || DENIED).map(function(a) {
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
        s.staleCount ? h(C.Notice, { h, kind: "warn", text: t("stats.staleWarning", { n: s.staleCount }) }) : null,
        stats.loading ? h("div", { className: "wba-cards" }, [0, 1, 2, 3, 4].map(function(i) {
          return h("div", { key: i, className: "wba-card" }, h("div", { className: "wba-skel" }));
        })) : h(StatsBody, {
          h,
          t,
          icon: props.icon,
          s,
          actions: opts.data && opts.data.actions || [],
          denied: opts.data && opts.data.denied || DENIED,
          onSettings: function() {
            if (props.onNavigate) props.onNavigate("config");
          }
        })
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
    var NF = require_number_field();
    var INTERVAL = { min: 1, max: 10080, integer: true };
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
      var lang = props.lang;
      function unitOf(minutes) {
        var n = Number(minutes) || 60;
        return n >= 60 && n % 60 === 0 ? 60 : 1;
      }
      function changeUnit(unit2) {
        var n = Number(form.everyMinutes);
        if (!isFinite(n)) return;
        if (unit2 === 60) {
          var hours = Math.round(n / 60);
          set("everyMinutes", (hours < 1 ? 1 : hours) * 60);
        } else set("everyMinutes", n);
      }
      function reportValid(ok) {
        if (typeof props.onValidChange === "function") props.onValidChange(ok);
      }
      function reportDraft(raw) {
        reportValid(NF.validateNumber(raw, { min: INTERVAL.min, max: INTERVAL.max, integer: INTERVAL.integer, lang }).ok);
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
                reportValid(true);
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
              h(NF.NumberField, {
                h,
                lang,
                value: form.everyMinutes,
                min: INTERVAL.min,
                max: INTERVAL.max,
                integer: INTERVAL.integer,
                className: "wba-num",
                // 范围提示由本行下方的 wba-hint/wba-err-text 统一展示，避免出现两条提示。
                hint: false,
                ariaLabel: t("trigger.every"),
                onCommit: function(next) {
                  set("everyMinutes", next);
                },
                onDraft: reportDraft,
                onValidChange: function(ok) {
                  reportValid(ok);
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

// packages/addons/automation/client/views/agent-timing.cjs
var require_agent_timing = __commonJS({
  "packages/addons/automation/client/views/agent-timing.cjs"(exports2, module2) {
    "use strict";
    var NF = require_number_field();
    var copy = require_copy();
    var trig = require_trigger_fields();
    var EVERY = { min: 1, max: 43200, integer: true };
    var AFTER = { min: 1, max: 525600, integer: true };
    var KINDS = [
      ["every", "repeat", "agent.every"],
      ["daily", "alarm-clock", "agent.daily"],
      ["weekly", "calendar-clock", "agent.weekly"],
      ["cron", "clock", "agent.cron"],
      ["rrule", "repeat", "agent.rrule"],
      ["at", "calendar-clock", "agent.at"],
      ["after", "hourglass", "agent.after"]
    ];
    function hhmm(value) {
      var s = String(value || "").trim();
      return /^\d{2}:\d{2}$/.test(s) ? s + ":00" : s;
    }
    function buildTiming(form) {
      var kind = form.pKind || "daily";
      var tz = form.pTz || "Asia/Shanghai";
      if (kind === "every") return { kind: "every", every_seconds: (Number(form.pEvery) || 60) * 60 };
      if (kind === "after") return { kind: "after", after_seconds: (Number(form.pAfter) || 60) * 60 };
      if (kind === "daily") return { kind: "daily", daily: { time: hhmm(form.pTime), time_zone: tz } };
      if (kind === "weekly") {
        return { kind: "weekly", weekly: { time: hhmm(form.pTime), time_zone: tz, weekdays: trig.daysOf(form.pWeekdays) } };
      }
      if (kind === "cron") return { kind: "cron", cron: { expression: String(form.pCron || "").trim().replace(/\s+/g, " "), time_zone: tz } };
      if (kind === "at") return { kind: "at", at: { date: String(form.pDate || "").trim(), time: hhmm(form.pTime), time_zone: tz } };
      return { kind: "rrule", rrule: String(form.pRrule || "").replace(/\r\n/g, "\n") };
    }
    function validateTiming(form, t) {
      var errs = {};
      var kind = form.pKind || "daily";
      if (kind === "every") {
        var every = Number(form.pEvery);
        if (!isFinite(every) || every < EVERY.min || every > EVERY.max) errs.pEvery = t("agent.everyHint");
      }
      if (kind === "after") {
        var after = Number(form.pAfter);
        if (!isFinite(after) || after < AFTER.min || after > AFTER.max) errs.pAfter = t("agent.afterHint");
      }
      if (kind === "daily" || kind === "weekly" || kind === "at") {
        if (!/^\d{2}:\d{2}$/.test(String(form.pTime || ""))) errs.pTime = t("trigger.time");
      }
      if (kind === "weekly" && trig.daysOf(form.pWeekdays).length === 0) errs.pWeekdays = t("trigger.weekdaysHint");
      if (kind === "at" && !/^\d{4}-\d{2}-\d{2}$/.test(String(form.pDate || ""))) errs.pDate = t("agent.date");
      if (kind === "cron") {
        var expr = String(form.pCron || "").trim();
        if (expr.split(/\s+/).filter(Boolean).length !== 5) errs.pCron = t("agent.cronHint");
      }
      if (kind === "rrule" && !/^DTSTART[^\n]*\nRRULE:/i.test(String(form.pRrule || "").replace(/\r\n/g, "\n"))) {
        errs.pRrule = t("agent.rruleHint");
      }
      return errs;
    }
    function timingText(timing, t) {
      var c = timing || {};
      if (c.kind === "every") {
        var mins = Math.round((Number(c.every_seconds) || 60) / 60);
        return mins % 60 === 0 && mins >= 60 ? t("agent.text.everyHours", { n: mins / 60 }) : t("agent.text.every", { n: mins });
      }
      if (c.kind === "after") {
        return t("agent.text.after", { n: Math.round((Number(c.after_seconds) || 60) / 60) });
      }
      if (c.kind === "daily" && c.daily) return t("agent.text.daily", { time: String(c.daily.time || "").slice(0, 5), tz: c.daily.time_zone || "" });
      if (c.kind === "weekly" && c.weekly) {
        var days = (Array.isArray(c.weekly.weekdays) ? c.weekly.weekdays : []).map(function(d) {
          return t("trigger.wd." + d);
        }).join("\u3001");
        return t("agent.text.weekly", { days, time: String(c.weekly.time || "").slice(0, 5), tz: c.weekly.time_zone || "" });
      }
      if (c.kind === "cron" && c.cron) return t("agent.text.cron", { expr: c.cron.expression || "", tz: c.cron.time_zone || "" });
      if (c.kind === "rrule") {
        var m = String(c.rrule || "").match(/RRULE:([^\n]*)/i);
        return t("agent.text.rrule", { expr: m ? m[1] : "" });
      }
      if (c.kind === "at") {
        var at = c.at;
        if (typeof at === "string") return t("agent.text.at", { at });
        if (at && at.date) return t("agent.text.at", { at: at.date + " " + String(at.time || "").slice(0, 5) + "\uFF08" + (at.time_zone || "") + "\uFF09" });
      }
      return t("agent.text.missing");
    }
    function TimingFields(props) {
      var h = props.h;
      var t = props.t;
      var icon = props.icon;
      var lang = props.lang;
      var form = props.form;
      var set = props.set;
      var errs = props.errs || {};
      var kind = form.pKind || "daily";
      var days = trig.daysOf(form.pWeekdays);
      function reportValid(ok) {
        if (typeof props.onValidChange === "function") props.onValidChange(ok);
      }
      function toggleDay(day) {
        var list = trig.daysOf(form.pWeekdays);
        var i = list.indexOf(day);
        if (i === -1) list.push(day);
        else list.splice(i, 1);
        list.sort(function(a, b) {
          return a - b;
        });
        set("pWeekdays", list.join(","));
      }
      var tzOptions = trig.TZ_LIST.indexOf(form.pTz) === -1 ? [form.pTz].concat(trig.TZ_LIST) : trig.TZ_LIST;
      return h(
        "div",
        { className: "wba-block" },
        h(
          "div",
          { className: "wba-seg", role: "group" },
          KINDS.map(function(k) {
            return h("button", {
              key: k[0],
              type: "button",
              "aria-pressed": kind === k[0],
              onClick: function() {
                reportValid(true);
                set("pKind", k[0]);
              }
            }, icon ? h("span", { className: "wba-inline" }, icon(k[1], 12), t(k[2])) : t(k[2]));
          })
        ),
        kind === "every" ? h(
          "label",
          { className: "wba-field" },
          h("span", { className: "wba-label" }, t("agent.every")),
          h(NF.NumberField, {
            h,
            lang,
            value: form.pEvery,
            min: EVERY.min,
            max: EVERY.max,
            integer: EVERY.integer,
            className: "wba-num",
            hint: false,
            ariaLabel: t("agent.every"),
            onCommit: function(next) {
              set("pEvery", next);
            },
            onValidChange: function(ok) {
              reportValid(ok);
            }
          }),
          errs.pEvery ? h("span", { className: "wba-err-text" }, errs.pEvery) : h("span", { className: "wba-hint" }, t("agent.everyHint"))
        ) : null,
        kind === "after" ? h(
          "label",
          { className: "wba-field" },
          h("span", { className: "wba-label" }, t("agent.after")),
          h(NF.NumberField, {
            h,
            lang,
            value: form.pAfter,
            min: AFTER.min,
            max: AFTER.max,
            integer: AFTER.integer,
            className: "wba-num",
            hint: false,
            ariaLabel: t("agent.after"),
            onCommit: function(next) {
              set("pAfter", next);
            },
            onValidChange: function(ok) {
              reportValid(ok);
            }
          }),
          errs.pAfter ? h("span", { className: "wba-err-text" }, errs.pAfter) : h("span", { className: "wba-hint" }, t("agent.afterHint"))
        ) : null,
        kind === "daily" || kind === "weekly" || kind === "at" ? h(
          "div",
          { className: kind === "at" ? "wba-grid-3" : "wba-grid-2" },
          kind === "at" ? h(
            "label",
            { className: "wba-field" },
            h("span", { className: "wba-label" }, t("agent.date")),
            h("input", {
              className: "wba-input" + (errs.pDate ? " err" : ""),
              type: "date",
              value: form.pDate,
              onChange: function(e) {
                set("pDate", e.target.value);
              }
            }),
            errs.pDate ? h("span", { className: "wba-err-text" }, errs.pDate) : null
          ) : null,
          h(
            "label",
            { className: "wba-field" },
            h("span", { className: "wba-label" }, t("trigger.time")),
            h("input", {
              className: "wba-input" + (errs.pTime ? " err" : ""),
              type: "time",
              value: form.pTime,
              onChange: function(e) {
                set("pTime", e.target.value);
              }
            }),
            errs.pTime ? h("span", { className: "wba-err-text" }, errs.pTime) : null
          ),
          h(
            "label",
            { className: "wba-field" },
            h("span", { className: "wba-label" }, t("trigger.tz")),
            h(
              "select",
              { className: "wba-input", value: form.pTz, onChange: function(e) {
                set("pTz", e.target.value);
              } },
              tzOptions.map(function(z) {
                return h("option", { key: z, value: z }, z);
              })
            )
          ),
          kind === "weekly" ? h(
            "div",
            { className: "wba-field wba-span-2" },
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
          ) : null
        ) : null,
        kind === "cron" ? h(
          "div",
          { className: "wba-grid-2" },
          h(
            "label",
            { className: "wba-field" },
            h("span", { className: "wba-label" }, t("agent.cron")),
            h("input", {
              className: "wba-input" + (errs.pCron ? " err" : ""),
              value: form.pCron,
              placeholder: t("agent.cronPh"),
              spellCheck: false,
              onChange: function(e) {
                set("pCron", e.target.value);
              }
            }),
            errs.pCron ? h("span", { className: "wba-err-text" }, errs.pCron) : h("span", { className: "wba-hint" }, t("agent.cronHint"))
          ),
          h(
            "label",
            { className: "wba-field" },
            h("span", { className: "wba-label" }, t("trigger.tz")),
            h(
              "select",
              { className: "wba-input", value: form.pTz, onChange: function(e) {
                set("pTz", e.target.value);
              } },
              tzOptions.map(function(z) {
                return h("option", { key: z, value: z }, z);
              })
            )
          )
        ) : null,
        kind === "rrule" ? h(
          "label",
          { className: "wba-field" },
          h("span", { className: "wba-label" }, t("agent.rrule")),
          h("textarea", {
            className: "wba-code sm" + (errs.pRrule ? " err" : ""),
            value: form.pRrule,
            placeholder: t("agent.rrulePh"),
            spellCheck: false,
            onChange: function(e) {
              set("pRrule", e.target.value);
            }
          }),
          errs.pRrule ? h("span", { className: "wba-err-text" }, errs.pRrule) : h("span", { className: "wba-hint" }, t("agent.rruleHint"))
        ) : null
      );
    }
    module2.exports = {
      KINDS,
      buildTiming,
      validateTiming,
      timingText,
      TimingFields
    };
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
    var staged = require_staged_dialog();
    var SW = require_switch();
    var EditorDialog = staged.createStagedDialog({
      maskClass: "wba-modal",
      dialogClass: "wba-modal-box",
      displayName: "AutomationRuleDialog",
      ariaLabelOf: function(props) {
        var t = props.t;
        return props.form && props.form.id ? t("editor.editTitle") : t("editor.newTitle");
      },
      header: function(props) {
        var hh = props.h;
        return hh(
          "div",
          { className: "wba-modal-head" },
          hh("h3", null, props.form && props.form.id ? props.t("editor.editTitle") : props.t("editor.newTitle")),
          hh("button", {
            type: "button",
            className: "wba-icon-btn",
            title: props.t("common.close"),
            "aria-label": props.t("common.close"),
            disabled: !!props.submitting,
            onClick: props.onClose
          }, props.icon ? props.icon("x", 15) : "\xD7")
        );
      },
      // 有未保存改动时要先问一次，所以关掉「点遮罩直接关」的默认行为，交给 close()。
      closeOnMask: false,
      closeOnEscape: function(props) {
        return !props.submitting;
      }
    });
    var trig = require_trigger_fields();
    var atiming = require_agent_timing();
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
    function buildTarget(form) {
      var kind = form.targetKind || "new_once";
      if (kind === "session") return { kind: "session", sessionId: String(form.targetSession || "").trim() };
      var create = {};
      if (String(form.targetCwd || "").trim()) create.cwd = String(form.targetCwd).trim();
      if (String(form.targetPreset || "").trim()) create.agentPreset = String(form.targetPreset).trim();
      return Object.keys(create).length ? { kind, create } : { kind };
    }
    function isAgent(form) {
      return Boolean(form) && form.execMode === "agent";
    }
    function validateForm(form, t) {
      var errs = {};
      if (!String(form.name || "").trim()) errs.name = t("editor.nameRequired");
      if (isAgent(form)) {
        if (!String(form.prompt || "").trim()) errs.prompt = t("editor.promptRequired");
        Object.assign(errs, atiming.validateTiming(form, t));
        if (String(form.targetKind || "new_once") === "session" && !String(form.targetSession || "").trim()) {
          errs.targetSession = t("editor.targetSessionRequired");
        }
        return { errs, valid: Object.keys(errs).length === 0 };
      }
      if (!String(form.actionName || "").trim()) errs.actionName = t("editor.actionRequired");
      var args = plain(form.actionArgs);
      if (!args.ok) errs.actionArgs = args.error === "object" ? t("editor.argsObject") : t("editor.jsonInvalid", { msg: args.error });
      if (form.condOn) {
        var cond = plain(form.condition);
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
      var name = String(form.name || "").trim();
      if (isAgent(form)) {
        return {
          id: form.id || void 0,
          name,
          enabled: Boolean(form.enabled),
          execMode: "agent",
          agent: {
            prompt: String(form.prompt || "").trim(),
            timing: atiming.buildTiming(form),
            target: buildTarget(form)
          }
        };
      }
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
        name,
        enabled: Boolean(form.enabled),
        execMode: "action",
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
        return JSON.stringify({ name: form.name, actionArgs: form.actionArgs, condition: form.condition, kind: form.kind, prompt: form.prompt });
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
      var lang = props.lang;
      var actions = props.actions || [];
      var icon = props.icon;
      var initial = props.initial;
      var agentMode = isAgent(form);
      var locked = Boolean(form.id);
      var agentAvailable = props.agentAvailable !== false;
      var validation = validateForm(form, t);
      var errs = validation.errs;
      var exampleS = React.useState(false);
      var numOkS = React.useState(true);
      var touchedS = React.useState(Boolean(form.name));
      var showNameErr = touchedS[0] && Boolean(errs.name);
      var hasActions = actions.length > 0;
      var actionName = !form.actionName || actions.indexOf(form.actionName) !== -1 ? actions : [form.actionName].concat(actions);
      var actionMissing = hasActions && Boolean(form.actionName) && actions.indexOf(form.actionName) === -1;
      var example = EXAMPLES[form.actionName];
      React.useEffect(function() {
        var prev = typeof document !== "undefined" ? document.body.style.overflow : "";
        if (typeof document !== "undefined") document.body.style.overflow = "hidden";
        return function() {
          if (typeof document !== "undefined") document.body.style.overflow = prev;
        };
      });
      function dirty() {
        return snapshot(form) !== snapshot(initial || form);
      }
      function close() {
        if (dirty() && typeof window !== "undefined" && !window.confirm(t("editor.discard"))) return;
        props.onClose();
      }
      function pickMode(mode) {
        if (locked || mode === (agentMode ? "agent" : "action")) return;
        set("execMode", mode);
      }
      var modeButtons = [
        ["action", t("editor.mode.action")],
        ["agent", t("editor.mode.agent")]
      ];
      function renderBasic(hh) {
        return hh(
          "div",
          { className: "wba-section" },
          hh(
            "div",
            { className: "wba-grid-3" },
            hh(
              "label",
              { className: "wba-field wba-span-2" },
              hh("span", { className: "wba-label" }, t("editor.name")),
              hh("input", {
                className: "wba-input" + (showNameErr ? " err" : ""),
                value: form.name,
                placeholder: t("editor.namePh"),
                onChange: function(e) {
                  touchedS[1](true);
                  set("name", e.target.value);
                }
              }),
              showNameErr ? hh("span", { className: "wba-err-text" }, errs.name) : null
            ),
            hh(
              "div",
              { className: "wba-field" },
              hh("span", { className: "wba-label" }, t("editor.enabled")),
              hh(SW.Switch, {
                h: hh,
                checked: Boolean(form.enabled),
                showState: true,
                onText: t("rules.status.on"),
                offText: t("rules.status.off"),
                onChange: function(next) {
                  set("enabled", next);
                }
              })
            )
          ),
          hh("p", { className: "wba-section-title" }, t("editor.section.mode")),
          renderModeBody(hh)
        );
      }
      function renderModeBody(hh) {
        return hh(
          "div",
          null,
          hh(
            "div",
            { className: "wba-seg", role: "group" },
            modeButtons.map(function(m) {
              var off = locked || m[0] === "agent" && !agentAvailable;
              return hh("button", {
                key: m[0],
                type: "button",
                "data-mode": m[0],
                "aria-pressed": (agentMode ? "agent" : "action") === m[0],
                disabled: off,
                title: m[0] === "agent" && !agentAvailable ? t("editor.mode.agentUnavailable") : "",
                onClick: function() {
                  pickMode(m[0]);
                }
              }, m[1]);
            })
          ),
          hh("p", { className: "wba-sub" }, agentMode ? t("editor.mode.agentHint") : t("editor.mode.actionHint")),
          locked ? hh("p", { className: "wba-hint" }, t("editor.mode.locked")) : null
        );
      }
      function renderTiming(hh) {
        return hh(
          "div",
          { className: "wba-section" },
          agentMode ? hh(atiming.TimingFields, {
            h: hh,
            t,
            lang,
            form,
            set,
            errs,
            icon,
            onValidChange: function(ok) {
              numOkS[1](ok);
            }
          }) : hh(trig.TriggerFields, {
            h: hh,
            t,
            lang,
            form,
            set,
            errs,
            icon,
            onValidChange: function(ok) {
              numOkS[1](ok);
            }
          })
        );
      }
      function renderPrompt(hh) {
        return hh(
          "div",
          { className: "wba-section" },
          hh(
            "label",
            { className: "wba-field" },
            hh("span", { className: "wba-label" }, t("editor.prompt")),
            hh("textarea", {
              className: "wba-code sm" + (errs.prompt ? " err" : ""),
              value: form.prompt,
              placeholder: t("editor.promptPh"),
              onChange: function(e) {
                set("prompt", e.target.value);
              }
            }),
            errs.prompt ? hh("span", { className: "wba-err-text" }, errs.prompt) : hh("span", { className: "wba-hint" }, t("editor.promptHint"))
          ),
          hh("p", { className: "wba-section-title" }, t("editor.section.target")),
          hh(
            "div",
            { className: "wba-grid-3" },
            hh(
              "label",
              { className: "wba-field" },
              hh("span", { className: "wba-label" }, t("editor.target")),
              hh(
                "select",
                {
                  className: "wba-input",
                  value: form.targetKind || "new_once",
                  onChange: function(e) {
                    set("targetKind", e.target.value);
                  }
                },
                ["new_once", "new", "session"].map(function(k) {
                  return hh("option", { key: k, value: k }, t("editor.target." + k));
                })
              )
            ),
            (form.targetKind || "new_once") === "session" ? hh(
              "label",
              { className: "wba-field wba-span-2" },
              hh("span", { className: "wba-label" }, t("editor.targetSession")),
              hh("input", {
                className: "wba-input" + (errs.targetSession ? " err" : ""),
                value: form.targetSession || "",
                placeholder: t("editor.targetSessionPh"),
                onChange: function(e) {
                  set("targetSession", e.target.value);
                }
              }),
              errs.targetSession ? hh("span", { className: "wba-err-text" }, errs.targetSession) : null
            ) : [
              hh(
                "label",
                { key: "cwd", className: "wba-field" },
                hh("span", { className: "wba-label" }, t("editor.targetCwd")),
                hh("input", {
                  className: "wba-input",
                  value: form.targetCwd || "",
                  placeholder: "/Users/me/work",
                  onChange: function(e) {
                    set("targetCwd", e.target.value);
                  }
                })
              ),
              hh(
                "label",
                { key: "preset", className: "wba-field" },
                hh("span", { className: "wba-label" }, t("editor.targetPreset")),
                hh("input", {
                  className: "wba-input",
                  value: form.targetPreset || "",
                  placeholder: t("editor.targetPresetPh"),
                  onChange: function(e) {
                    set("targetPreset", e.target.value);
                  }
                })
              )
            ]
          ),
          hh("p", { className: "wba-hint" }, t("editor.targetHint"))
        );
      }
      function renderAction(hh) {
        return hh(
          "div",
          { className: "wba-section" },
          hh(
            "div",
            { className: "wba-inline" },
            hh(
              "label",
              { className: "wba-field" },
              hh("span", { className: "wba-label" }, t("editor.action")),
              hh(
                "select",
                {
                  className: "wba-input",
                  value: form.actionName,
                  disabled: !hasActions,
                  onChange: function(e) {
                    set("actionName", e.target.value);
                  }
                },
                hasActions ? actionName.map(function(a) {
                  return hh("option", { key: a, value: a }, a);
                }) : hh("option", { value: "" }, t("editor.noActions"))
              ),
              !hasActions || actionMissing ? hh("span", { className: "wba-err-text" }, hasActions ? t("rules.actionDisabled") : t("editor.noActionsHint")) : null
            ),
            hh("span", { className: "wba-grow" }),
            example ? hh(C.Btn, { h: hh, onClick: function() {
              exampleS[1](!exampleS[0]);
            } }, t("editor.showExample")) : null
          ),
          exampleS[0] && example ? hh(
            "div",
            { className: "wba-block" },
            hh("span", { className: "wba-label" }, t("editor.exampleTitle")),
            hh("pre", { className: "wba-pre" }, JSON.stringify(example, null, 2)),
            hh(
              "div",
              { className: "wba-inline" },
              hh(C.Btn, { h: hh, onClick: function() {
                if (typeof window !== "undefined" && !window.confirm(t("editor.exampleHint"))) return;
                set("actionArgs", JSON.stringify(example, null, 2));
              } }, t("editor.fillExample")),
              hh("span", { className: "wba-grow" })
            )
          ) : null,
          hh(json.JsonEditor, {
            h: hh,
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
            action: hh(C.Btn, { h: hh, onClick: function() {
              var next = json.formatJson(form.actionArgs);
              if (next) set("actionArgs", next);
            } }, t("editor.format"))
          })
        );
      }
      function renderCondition(hh) {
        return hh(
          "div",
          { className: "wba-section" },
          hh("p", { className: "wba-section-title" }, t("editor.section.condition")),
          hh(SW.Switch, {
            h: hh,
            checked: Boolean(form.condOn),
            label: t("editor.conditionOn"),
            onChange: function(next) {
              set("condOn", next);
            }
          }),
          hh("p", { className: "wba-sub" }, t("editor.conditionHint")),
          form.condOn ? hh(json.JsonEditor, {
            h: hh,
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
          }) : hh("p", { className: "wba-sub" }, t("editor.conditionEmpty"))
        );
      }
      function renderRun(hh) {
        return hh(
          "div",
          null,
          agentMode ? renderPrompt(hh) : renderAction(hh),
          agentMode ? null : renderCondition(hh)
        );
      }
      var steps = [
        {
          key: "basic",
          label: t("editor.section.basic"),
          render: renderBasic,
          validate: function() {
            return String(form.name || "").trim() ? "" : t("editor.nameRequired");
          }
        },
        {
          key: agentMode ? "timing" : "trigger",
          label: agentMode ? t("editor.section.timing") : t("editor.section.trigger"),
          render: renderTiming,
          validate: function() {
            if (numOkS[0]) return "";
            return errs.pEvery || errs.pAfter || errs.everyMinutes || errs.pCron || errs.pRrule || errs.pDate || errs.pTime || errs.pWeekdays || t("trigger.intervalHint");
          }
        },
        {
          key: agentMode ? "prompt" : "run",
          label: agentMode ? t("editor.section.prompt") : t("editor.section.run"),
          render: renderRun,
          validate: function() {
            if (agentMode) return String(form.prompt || "").trim() ? "" : t("editor.promptRequired");
            if (!hasActions || actionMissing) return hasActions ? t("rules.actionDisabled") : t("editor.noActionsHint");
            return errs.actionArgs || errs.condition || "";
          }
        }
      ];
      return h(EditorDialog, {
        h,
        React,
        t,
        form,
        icon,
        steps,
        // 测试与深链接需要直接落到某一步；正常打开都从第一步开始。
        initialStep: props.initialStep,
        submitting: busy,
        submitDisabled: !validation.valid || !numOkS[0],
        onClose: close,
        onSubmit: function() {
          if (!validation.valid || !numOkS[0]) return;
          props.onSave(buildPayload(form));
        },
        submitText: t("common.save"),
        cancelText: t("common.cancel"),
        nextText: t("common.next"),
        backText: t("common.back"),
        // 页脚只在用户动过字段之后给一行说明（也是「保存」禁用时的原因）；
        // 空表单首屏不再先红一片——此前一打开就显示「名称不能为空」。
        footerNote: !touchedS[0] ? "" : validation.valid ? numOkS[0] ? "" : errs.pEvery || errs.pAfter || errs.everyMinutes || t("trigger.intervalHint") : errs.name || errs.prompt || errs.actionArgs || errs.condition || errs.pCron || errs.pRrule || errs.pDate || errs.pTime || errs.pWeekdays || t("editor.nameEmptySave")
      });
    }
    module2.exports = {
      RuleEditor,
      buildPayload,
      validateForm,
      buildTarget,
      EXAMPLES
    };
  }
});

// packages/addons/automation/client/views/agent-history.cjs
var require_agent_history = __commonJS({
  "packages/addons/automation/client/views/agent-history.cjs"(exports2, module2) {
    "use strict";
    var createOverlay = require_overlay();
    var C = require_common();
    var copy = require_copy();
    var HistoryOverlay = createOverlay({
      maskClass: "wba-modal",
      dialogClass: "wba-modal-box",
      ariaLabelOf: function(props) {
        return props.t("hist.title");
      },
      closeOnMask: true,
      autoFocusDialog: false
    });
    var LIMIT = 20;
    function when(rec, lang) {
      var ts = rec && (rec.deliveredAt || rec.scheduledAt);
      if (!ts) return "";
      var ms = Date.parse(ts);
      return isNaN(ms) ? String(ts) : C.fmtTime(ms, lang);
    }
    function AgentHistory(props) {
      var h = props.h;
      var api = props.api;
      var React = props.React;
      var icon = props.icon;
      var lang = props.lang === "en" ? "en" : "zh";
      var t = function(key, vars) {
        return copy.t(lang, key, vars);
      };
      var rule = props.rule;
      var cursorS = React.useState("");
      var state = C.useLoad(React, api, "automation.ruleHistory", { id: rule.id, limit: LIMIT, before: cursorS[0] || void 0 }, [rule.id, cursorS[0]]);
      var data = state.data || {};
      var records = data.records || [];
      var missing = Boolean(rule.scheduleMissing) || data.earlierRecordsUnavailable && records.length === 0;
      var oldest = records.length ? records[records.length - 1].messageId : "";
      var canOlder = records.length === LIMIT && Boolean(oldest);
      return h(
        HistoryOverlay,
        { t, onClose: props.onClose },
        h(
          "div",
          { className: "wba-modal-head" },
          h("h3", null, t("hist.title") + " \xB7 " + rule.name),
          h("button", { type: "button", className: "wba-icon-btn", title: t("common.close"), onClick: props.onClose }, icon ? icon("x", 15) : "\xD7")
        ),
        h(
          "div",
          { className: "wba-modal-body" },
          h("p", { className: "wba-sub" }, t("hist.subtitle")),
          state.error ? h(C.Notice, { h, kind: "error", text: state.error }) : null,
          missing ? h("p", { className: "wba-sub" }, t("hist.missing")) : state.loading && records.length === 0 ? h("div", { className: "wba-hist" }, [1, 2, 3].map(function(i) {
            return h("div", { key: i, className: "wba-skel" });
          })) : records.length === 0 ? h("p", { className: "wba-sub" }, t("hist.empty")) : h(
            "div",
            { className: "wba-hist" },
            h("p", { className: "wba-sub" }, t("hist.records", { n: records.length })),
            records.map(function(rec, i) {
              return h(
                "div",
                { key: rec.messageId || i, className: "wba-hist-row" },
                h(
                  "div",
                  { className: "wba-inline" },
                  icon ? icon("send", 13) : null,
                  h("span", { className: "wba-nowrap" }, when(rec, lang)),
                  h("code", { className: "wba-mono wba-ellipsis", title: rec.targetSessionId }, rec.targetSessionId || "")
                ),
                rec.prompt ? h("pre", { className: "wba-pre" }, rec.prompt) : null
              );
            }),
            data.earlierRecordsPruned ? h("p", { className: "wba-sub" }, t("hist.pruned")) : null,
            canOlder ? h(C.Btn, { h, onClick: function() {
              cursorS[1](oldest);
            } }, t("common.more")) : null
          )
        ),
        h(
          "div",
          { className: "wba-modal-foot" },
          h("span", { className: "wba-grow" }),
          h(C.Btn, { h, onClick: props.onClose }, t("common.close"))
        )
      );
    }
    module2.exports = AgentHistory;
    module2.exports.AgentHistory = AgentHistory;
  }
});

// packages/addons/automation/client/views/rules.cjs
var require_rules = __commonJS({
  "packages/addons/automation/client/views/rules.cjs"(exports2, module2) {
    "use strict";
    var C = require_common();
    var copy = require_copy();
    var trig = require_trigger_fields();
    var atiming = require_agent_timing();
    var editor = require_rule_editor();
    var AgentHistory = require_agent_history();
    var TRIGGER_ICON = { interval: "timer", dailyAt: "alarm-clock", event: "radio", manual: "hand" };
    function emptyForm() {
      return {
        id: "",
        name: "",
        enabled: true,
        execMode: "action",
        // action 模式
        kind: "interval",
        everyMinutes: 60,
        time: "09:00",
        tz: "Asia/Shanghai",
        weekdays: "1,2,3,4,5",
        domainId: "",
        event: "",
        actionName: "",
        actionArgs: "{}",
        condOn: false,
        condition: '{\n  "field": "event.item.title",\n  "op": "contains",\n  "value": ""\n}',
        // agent 模式
        prompt: "",
        pKind: "every",
        pEvery: 60,
        pAfter: 60,
        pTime: "09:00",
        pTz: "Asia/Shanghai",
        pWeekdays: "1,2,3,4,5",
        pCron: "0 9 * * *",
        pRrule: "DTSTART;TZID=Asia/Shanghai:20260101T090000\nRRULE:FREQ=DAILY",
        pDate: "",
        targetKind: "new_once",
        targetCwd: "",
        targetPreset: "",
        targetSession: ""
      };
    }
    function timingToForm(f, timing) {
      var ti = timing && typeof timing === "object" ? timing : {};
      f.pKind = ti.kind || "every";
      if (ti.kind === "every") f.pEvery = Math.max(1, Math.round((ti.every_seconds || 3600) / 60));
      if (ti.kind === "after") f.pAfter = Math.max(1, Math.round((ti.after_seconds || 60) / 60));
      if (ti.kind === "daily" && ti.daily) {
        f.pTime = String(ti.daily.time || "09:00").slice(0, 5);
        f.pTz = ti.daily.time_zone || "Asia/Shanghai";
      }
      if (ti.kind === "weekly" && ti.weekly) {
        f.pTime = String(ti.weekly.time || "09:00").slice(0, 5);
        f.pTz = ti.weekly.time_zone || "Asia/Shanghai";
        f.pWeekdays = (ti.weekly.weekdays || [1, 2, 3, 4, 5]).join(",");
      }
      if (ti.kind === "cron" && ti.cron) {
        f.pCron = ti.cron.expression || f.pCron;
        f.pTz = ti.cron.time_zone || "Asia/Shanghai";
      }
      if (ti.kind === "rrule") f.pRrule = ti.rrule || f.pRrule;
      if (ti.kind === "at") {
        var at = ti.at;
        if (typeof at === "string") {
          f.pDate = at.slice(0, 10);
          f.pTime = at.slice(11, 16) || f.pTime;
        } else if (at && typeof at === "object") {
          f.pDate = at.date || "";
          f.pTime = String(at.time || "09:00").slice(0, 5);
          f.pTz = at.time_zone || f.pTz;
        }
      }
    }
    function formFromRule(rule) {
      var f = emptyForm();
      f.id = rule.id;
      f.name = rule.name;
      f.enabled = rule.enabled;
      f.execMode = rule.execMode === "agent" ? "agent" : "action";
      if (f.execMode === "agent") {
        var snap = rule.agent && typeof rule.agent === "object" ? rule.agent : {};
        f.prompt = String(snap.prompt || "");
        timingToForm(f, snap.timing);
        var target = snap.target && typeof snap.target === "object" ? snap.target : {};
        f.targetKind = target.kind || "new_once";
        f.targetSession = target.sessionId || "";
        var create = target.create && typeof target.create === "object" ? target.create : {};
        f.targetCwd = create.cwd || "";
        f.targetPreset = create.agentPreset || "";
        return f;
      }
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
      var mode = filters && filters.mode || "";
      return rows.filter(function(r) {
        if (q) {
          var hit = String(r.name).toLowerCase().indexOf(q) !== -1 || String(r.actionName || "").toLowerCase().indexOf(q) !== -1 || String(r.agent && r.agent.prompt || "").toLowerCase().indexOf(q) !== -1;
          if (!hit) return false;
        }
        if (status === "on" && !r.enabled) return false;
        if (status === "off" && r.enabled) return false;
        if (mode === "agent" && r.execMode !== "agent") return false;
        if (mode === "action" && r.execMode === "agent") return false;
        if (trigger) {
          var kind = r.execMode === "agent" ? "agent" : r.triggerConfig && r.triggerConfig.kind || r.triggerType;
          if (kind !== trigger) return false;
        }
        return true;
      });
    }
    function resultKind(status) {
      if (status === "ok") return "ok";
      if (status === "error") return "error";
      if (status === "skipped") return "warn";
      return "";
    }
    function scheduleKind(status) {
      if (status === "active") return "ok";
      if (status === "paused") return "warn";
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
          props.noActions ? h(C.Btn, { h, kind: "primary", onClick: props.onSettings }, t("rules.empty.noActionCta")) : h(C.Btn, { h, kind: "primary", onClick: props.onNew }, t("common.create"))
        ),
        h("p", { className: "wba-empty-body" }, props.noActions ? t("rules.empty.noActionHint") : t("rules.empty.backup"))
      );
    }
    function RuleRow(props) {
      var h = props.h;
      var t = props.t;
      var icon = props.icon;
      var r = props.rule;
      var agentRule = r.execMode === "agent";
      var snap = r.agent && typeof r.agent === "object" ? r.agent : {};
      var kind = agentRule ? "agent" : r.triggerConfig && r.triggerConfig.kind || r.triggerType || "manual";
      var last = r.lastRun;
      var deliveredAt = snap.lastDeliveryAt;
      return h(
        "tr",
        null,
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
            icon ? icon(agentRule ? "bot" : TRIGGER_ICON[kind] || "zap", 13) : null,
            agentRule ? atiming.timingText(snap.timing, t) : trig.triggerText(r, t)
          )
        ),
        h("td", null, agentRule ? h(
          "span",
          { className: "wba-inline" },
          h(C.Pill, { h, kind: "" }, t("rules.agentAction")),
          h("span", { className: "wba-ellipsis", title: snap.prompt || "" }, String(snap.prompt || "").slice(0, 48))
        ) : h(
          "span",
          { className: "wba-inline" },
          h("code", { className: "wba-ellipsis", title: r.actionName }, r.actionName),
          props.allowed.indexOf(r.actionName) === -1 ? h(C.Pill, { h, kind: "warn" }, t("rules.actionDisabled")) : null
        )),
        h("td", null, agentRule ? h(C.Pill, { h, kind: r.scheduleMissing ? "error" : scheduleKind(r.scheduleStatus) }, t("rules.schedule." + (r.scheduleMissing ? "missing" : r.scheduleStatus || "paused"))) : h(C.Pill, { h, kind: r.enabled ? "ok" : "" }, r.enabled ? t("rules.status.on") : t("rules.status.off"))),
        h("td", { className: "wba-nowrap" }, agentRule ? h("span", null, deliveredAt ? C.fmtTime(deliveredAt, props.lang) : t("common.none")) : h(
          "div",
          { className: "wba-inline" },
          h("span", null, last ? C.fmtTime(last.startedAt, props.lang) : t("common.none")),
          last ? h(C.Pill, { h, kind: resultKind(last.status) }, t("run.status." + last.status) || last.status) : null
        )),
        h("td", null, h(
          "div",
          { className: "wba-actions" },
          agentRule ? h("button", { type: "button", className: "wba-icon-btn", title: t("rules.history"), onClick: function() {
            props.onHistory(r);
          } }, icon ? icon("send", 14) : "\u2709") : null,
          h("button", { type: "button", className: "wba-icon-btn", title: t("common.run"), disabled: props.runningId === r.id || agentRule && r.scheduleMissing, onClick: function() {
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
      );
    }
    function RulesBody(props) {
      var h = props.h;
      var t = props.t;
      var icon = props.icon;
      var rows = props.rows;
      var filters = props.filters || {};
      var allowed = props.allowed || [];
      var orphans = Number(props.agentStatus && props.agentStatus.orphans && props.agentStatus.orphans.length || 0);
      var offline = props.agentStatus && props.agentStatus.available === false;
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
              }),
              h("option", { value: "agent" }, t("rules.agentAction"))
            )
          ),
          h(
            "label",
            { className: "wba-field" },
            h("span", { className: "wba-label" }, t("rules.exec.mode")),
            h(
              "select",
              { className: "wba-input", value: filters.mode || "", onChange: function(e) {
                props.onFilter({ mode: e.target.value });
              } },
              h("option", { value: "" }, t("common.all")),
              h("option", { value: "action" }, t("editor.mode.action")),
              h("option", { value: "agent" }, t("editor.mode.agent"))
            )
          ),
          h("span", { className: "wba-grow" }),
          h(C.Btn, { h, onClick: props.onClear }, t("common.clear"))
        ),
        props.error ? h(C.Notice, { h, kind: "error", text: props.error }) : null,
        offline ? h(C.Notice, { h, kind: "warn", text: t("rules.agentOffline") }) : null,
        orphans > 0 ? h(C.Notice, { h, kind: "warn", text: t("rules.orphans", { n: orphans }) }) : null,
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
          title: props.hasRules ? t("rules.empty.filtered") : props.noActions ? t("rules.empty.noActionTitle") : t("rules.empty.title"),
          body: props.hasRules ? t("rules.empty.filteredBody") : props.noActions ? t("rules.empty.noActionBody") : t("rules.empty.body"),
          noActions: !props.hasRules && props.noActions,
          onNew: props.onNew,
          onSettings: props.onSettings
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
              return h(RuleRow, {
                key: r.id,
                h,
                t,
                icon,
                lang: props.lang,
                rule: r,
                allowed,
                runningId: props.runningId,
                onRun: props.onRun,
                onEdit: props.onEdit,
                onToggle: props.onToggle,
                onDelete: props.onDelete,
                onHistory: props.onHistory
              });
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
      var status = C.useLoad(React, api, "automation.agentStatus", {}, []);
      var formS = React.useState(null);
      var initS = React.useState(null);
      var busyS = React.useState(false);
      var msgS = React.useState("");
      var filterS = React.useState({ q: "", status: "", trigger: "", mode: "" });
      var runningS = React.useState("");
      var historyS = React.useState(null);
      var all = list.data && list.data.items || [];
      var rows = filterRules(all, filterS[0]);
      var actions = opts.data && opts.data.actions || [];
      var agentStatus = status.data || null;
      var form = formS[0];
      React.useEffect(function() {
        if (props.viewParams && props.viewParams.new && !formS[0]) openNew();
      }, [props.viewParams]);
      function fail(e) {
        msgS[1](C.errText(e));
      }
      function reload() {
        list.refresh();
        status.refresh();
      }
      function openNew() {
        var f = emptyForm();
        if (agentStatus && agentStatus.available === false) f.execMode = "action";
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
          reload();
          msgS[1](t("common.saved"));
        }).catch(function(e) {
          busyS[1](false);
          fail(e);
        });
      }
      function remove(rule) {
        if (typeof window !== "undefined" && !window.confirm(t("rules.confirm.delete", { name: rule.name }))) return;
        C.call(api, "automation.ruleDelete", { id: rule.id }).then(reload).catch(fail);
      }
      function run(rule) {
        runningS[1](rule.id);
        msgS[1]("");
        C.call(api, "automation.ruleRun", { id: rule.id }).then(function(r) {
          runningS[1]("");
          msgS[1](r && r.skipped ? "skipped: " + (r.reason || "") : t("common.saved"));
          reload();
        }).catch(function(e) {
          runningS[1]("");
          fail(e);
        });
      }
      function toggle(rule) {
        C.call(api, "automation.ruleUpdate", { id: rule.id, enabled: !rule.enabled }).then(reload).catch(fail);
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
            h(C.Btn, { h, onClick: reload }, t("common.refresh")),
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
          allowed: actions,
          agentStatus,
          noActions: actions.length === 0,
          onSettings: function() {
            if (props.onNavigate) props.onNavigate("config");
          },
          filters: filterS[0],
          runningId: runningS[0],
          onFilter: function(patch) {
            filterS[1](Object.assign({}, filterS[0], patch));
          },
          onClear: function() {
            filterS[1]({ q: "", status: "", trigger: "", mode: "" });
          },
          onNew: openNew,
          onRun: run,
          onEdit: function(r) {
            var f = formFromRule(r);
            initS[1](f);
            formS[1](f);
          },
          onToggle: toggle,
          onDelete: remove,
          onHistory: function(r) {
            historyS[1](r);
          }
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
          agentAvailable: !(agentStatus && agentStatus.available === false),
          onClose: function() {
            formS[1](null);
          },
          onSave: save
        }) : null,
        historyS[0] ? h(AgentHistory, {
          h,
          api,
          React,
          t,
          lang,
          icon: props.icon,
          rule: historyS[0],
          onClose: function() {
            historyS[1](null);
          }
        }) : null
      );
    };
    module2.exports.filterRules = filterRules;
    module2.exports.RulesBody = RulesBody;
    module2.exports.RuleRow = RuleRow;
    module2.exports.emptyForm = emptyForm;
    module2.exports.formFromRule = formFromRule;
    module2.exports.timingToForm = timingToForm;
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

// packages/addons/automation/client/views/action-picker.cjs
var require_action_picker = __commonJS({
  "packages/addons/automation/client/views/action-picker.cjs"(exports2, module2) {
    "use strict";
    var C = require_common();
    var copy = require_copy();
    var DENIED = /^(vault|automation|audit)\.|\.(delete|backup)$/i;
    var NAME = /^[A-Za-z_][A-Za-z0-9_]*(\.[A-Za-z_][A-Za-z0-9_]*){1,2}$/;
    function filterCatalog(items, q) {
      var text = String(q || "").trim().toLowerCase();
      if (!text) return items || [];
      return (items || []).filter(function(row) {
        return String(row.name).toLowerCase().indexOf(text) !== -1 || String(row.domain || "").toLowerCase().indexOf(text) !== -1 || String(row.description || "").toLowerCase().indexOf(text) !== -1;
      });
    }
    function groupByDomain(items) {
      var order = [];
      var map = {};
      (items || []).forEach(function(row) {
        var key = String(row.domain || "other");
        if (!map[key]) {
          map[key] = [];
          order.push(key);
        }
        map[key].push(row);
      });
      return order.map(function(key) {
        return { domain: key, items: map[key] };
      });
    }
    function ActionPicker(props) {
      var h = props.h;
      var t = props.t;
      var icon = props.icon;
      var React = props.React;
      var qS = React.useState("");
      var manualS = React.useState("");
      var items = props.items || [];
      var selected = props.selected || [];
      var loading = Boolean(props.loading);
      var error = props.error || "";
      var rows = filterCatalog(items, qS[0]);
      var groups = groupByDomain(rows);
      var known = {};
      items.forEach(function(row) {
        known[row.name] = true;
      });
      var extra = selected.filter(function(name) {
        return !known[name];
      });
      if (extra.length) groups.push({ domain: "__extra", items: extra.map(function(name) {
        return { name, domain: "", description: "" };
      }) });
      function has(name) {
        return selected.indexOf(name) !== -1;
      }
      function toggle(name, on) {
        var next = selected.filter(function(x) {
          return x !== name;
        });
        if (on) next.push(name);
        next.sort();
        props.onChange(next);
      }
      function addManual() {
        var name = manualS[0].trim();
        if (!name) return;
        if (!NAME.test(name) || DENIED.test(name)) {
          manualS[1](name);
          return;
        }
        if (!has(name)) toggle(name, true);
        manualS[1]("");
      }
      var manualBad = manualS[0].trim() ? !NAME.test(manualS[0].trim()) || DENIED.test(manualS[0].trim()) : false;
      return h(
        "div",
        { className: "wba-panel" },
        h(
          "div",
          { className: "wba-panel-h" },
          h("p", { className: "wba-panel-title" }, t("config.allowed.title")),
          icon ? h("span", { className: "wba-card-ico" }, icon("list-checks", 16)) : null
        ),
        h("p", { className: "wba-sub" }, t("config.allowed.hint")),
        h(
          "div",
          { className: "wba-inline" },
          h(
            "label",
            { className: "wba-field wba-grow" },
            h("span", { className: "wba-label" }, t("common.search")),
            h("input", {
              className: "wba-input",
              type: "search",
              value: qS[0],
              placeholder: t("config.allowed.search"),
              "aria-label": t("config.allowed.search"),
              onChange: function(e) {
                qS[1](e.target.value);
              }
            })
          ),
          h("span", { className: "wba-hint" }, t("config.allowed.selected", { n: selected.length })),
          h(C.Btn, { h, disabled: !selected.length, onClick: function() {
            props.onChange([]);
          } }, t("common.clear"))
        ),
        error ? h(C.Notice, { h, kind: "error", text: error }) : null,
        loading ? h("div", { className: "wba-skel" }) : groups.length === 0 ? h("p", { className: "wba-hint" }, t("config.allowed.empty")) : h("div", { className: "wba-picker" }, groups.map(function(group) {
          return h(
            "div",
            { key: group.domain, className: "wba-picker-group" },
            h("p", { className: "wba-picker-domain" }, group.domain === "__extra" ? t("config.allowed.extra") : group.domain),
            group.items.map(function(row) {
              return h(
                "label",
                { key: row.name, className: "wba-check wba-picker-row", title: row.description || row.name },
                h("input", { type: "checkbox", checked: has(row.name), onChange: function(e) {
                  toggle(row.name, e.target.checked);
                } }),
                h("code", null, row.name),
                row.description ? h("span", { className: "wba-hint wba-ellipsis" }, row.description) : null
              );
            })
          );
        })),
        h(
          "div",
          { className: "wba-inline" },
          h(
            "label",
            { className: "wba-field wba-grow" },
            h("span", { className: "wba-label" }, t("config.allowed.manual")),
            h("input", {
              className: "wba-input" + (manualBad ? " err" : ""),
              value: manualS[0],
              placeholder: "namespace.action",
              "aria-label": t("config.allowed.manual"),
              onChange: function(e) {
                manualS[1](e.target.value);
              }
            })
          ),
          h(C.Btn, { h, disabled: !manualS[0].trim() || manualBad, onClick: addManual }, t("config.allowed.add"))
        ),
        manualBad ? h("span", { className: "wba-err-text" }, t("config.allowed.invalid")) : null,
        h("p", { className: "wba-hint" }, t("config.allowed.deniedNote"))
      );
    }
    module2.exports = { ActionPicker, filterCatalog, groupByDomain };
  }
});

// packages/addons/automation/client/views/config.cjs
var require_config = __commonJS({
  "packages/addons/automation/client/views/config.cjs"(exports2, module2) {
    "use strict";
    var C = require_common();
    var copy = require_copy();
    var picker = require_action_picker();
    var NF = require_number_field();
    var CONSTRAINTS = ["strategy", "concurrency", "event", "condition", "backup", "safety"];
    function ConfigBody(props) {
      var h = props.h;
      var t = props.t;
      var icon = props.icon;
      var form = props.form || {};
      var catalog = props.catalog || { items: [], error: "", loading: false };
      return h(
        "div",
        { className: "wba-stack" },
        h(
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
              h(NF.NumberField, {
                h,
                lang: props.lang,
                value: form.maxRules === void 0 ? "" : form.maxRules,
                min: 1,
                max: 500,
                integer: true,
                ariaLabel: t("config.limit.maxRules"),
                onCommit: function(next) {
                  props.onChange("maxRules", next);
                }
              })
            ),
            h(
              "label",
              { className: "wba-field" },
              h("span", { className: "wba-label" }, t("config.limit.perHour")),
              h(NF.NumberField, {
                h,
                lang: props.lang,
                value: form.perHour === void 0 ? "" : form.perHour,
                min: 1,
                max: 600,
                integer: true,
                ariaLabel: t("config.limit.perHour"),
                onCommit: function(next) {
                  props.onChange("perHour", next);
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
                props.onSave({ maxRules: Number(form.maxRules), perHour: Number(form.perHour), allowedActions: form.allowedActions || [] });
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
        ),
        h(picker.ActionPicker, {
          h,
          t,
          icon,
          React: props.React,
          items: catalog.items,
          error: catalog.error,
          loading: catalog.loading,
          selected: form.allowedActions || [],
          onChange: function(list) {
            props.onChange("allowedActions", list);
          }
        })
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
      var catalog = C.useLoad(React, api, "automation.actionCatalog", {}, []);
      var formS = React.useState(null);
      var busyS = React.useState(false);
      var msgS = React.useState(null);
      var savedS = React.useState(false);
      React.useEffect(function() {
        if (cfg.data && !formS[0]) {
          formS[1]({
            maxRules: String(cfg.data.maxRules),
            perHour: String(cfg.data.perHour),
            allowedActions: (cfg.data.allowedActions || []).slice()
          });
        }
      }, [cfg.data]);
      var form = formS[0] || { maxRules: "", perHour: "", allowedActions: [] };
      var base = cfg.data || {};
      var dirty = String(form.maxRules) !== String(base.maxRules) || String(form.perHour) !== String(base.perHour) || (form.allowedActions || []).join(",") !== (base.allowedActions || []).join(",");
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
            h(C.Btn, { h, onClick: function() {
              cfg.refresh();
              catalog.refresh();
            } }, t("common.refresh"))
          )
        ),
        msgS[0] ? h(C.Notice, { h, kind: msgS[0].kind, text: msgS[0].text }) : null,
        cfg.error ? h(C.Notice, { h, kind: "error", text: cfg.error }) : null,
        cfg.loading && !cfg.data ? h("div", { className: "wba-panel" }, h("div", { className: "wba-skel" }), h("div", { className: "wba-skel" })) : h(ConfigBody, {
          h,
          lang,
          t,
          icon: props.icon,
          form,
          React,
          busy: busyS[0],
          dirty,
          saved: savedS[0],
          catalog: { items: catalog.data && catalog.data.items || [], error: catalog.data && catalog.data.error || (catalog.error || ""), loading: catalog.loading && !catalog.data },
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
var GLYPHS = require_icons2().ICONS;
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
    activity: GLYPHS["activity"],
    zap: GLYPHS["zap"],
    history: GLYPHS["history"],
    sliders: GLYPHS["sliders-horizontal"],
    database: GLYPHS["database"],
    list: GLYPHS["list"],
    timer: GLYPHS["timer"],
    "alarm-clock": GLYPHS["alarm-clock"],
    radio: GLYPHS["radio"],
    hand: GLYPHS["hand"],
    play: GLYPHS["play"],
    pencil: GLYPHS["pencil"],
    power: GLYPHS["power"],
    "power-off": GLYPHS["power-off"],
    "trash-2": GLYPHS["trash-2"],
    x: GLYPHS["x"],
    "check-circle": GLYPHS["check-circle"],
    "alert-triangle": GLYPHS["alert-triangle"],
    "skip-forward": GLYPHS["skip-forward"],
    layers: GLYPHS["layers"],
    bot: GLYPHS["bot"],
    sparkles: GLYPHS["sparkles"],
    repeat: GLYPHS["repeat"],
    "calendar-clock": GLYPHS["calendar-clock"],
    hourglass: GLYPHS["hourglass"],
    clock: GLYPHS["clock"],
    send: GLYPHS["send"],
    "shield-check": GLYPHS["shield-check"]
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
    version: "0.4.3",
    icon: GLYPHS["zap"],
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
