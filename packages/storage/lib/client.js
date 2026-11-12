// 由 scripts/build-addon-clients.mjs 生成；请修改对应 client/client.src.cjs 后重新构建。
window.__ModuleLoader__ = window.__ModuleLoader__ || { modules: {}, load: function (m) { this.modules[m.id] = m.factory; } };
window.__ModuleLoader__.load({
  id: "dsh-workbench-storage",
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

// packages/addons/lib/markdown.cjs
var require_markdown = __commonJS({
  "packages/addons/lib/markdown.cjs"(exports2, module2) {
    "use strict";
    var cache = /* @__PURE__ */ new Map();
    var cacheChars = 0;
    function node(tag, children, props) {
      return { tag, children, props: props || {} };
    }
    function inline(text, depth) {
      if ((depth || 0) > 8) return [text];
      var out = [], re = /(\\[\\\x60*\[\]#!_>+-]|!?\[[^\[\]\n]+\]\([^\s)\[\]]*\)|\x60[^\x60\n]+\x60|\*\*[^*\n]+\*\*|\*[^*\n]+\*)/g, at = 0, m;
      while (m = re.exec(text)) {
        if (m.index > at) out.push(text.slice(at, m.index));
        var s = m[0], link = /^\[([^\]]+)\]\(([^)]*)\)$/.exec(s);
        if (s[0] === "\\") out.push(s.slice(1));
        else if (link && /^(https?:\/\/|mailto:)[^\s\u0000-\u001f\u007f]+$/i.test(link[2]))
          out.push(node("a", inline(link[1], (depth || 0) + 1), { href: link[2], target: "_blank", rel: "noopener noreferrer nofollow" }));
        else if (s[0] === "[" || s[0] === "!") out.push(s);
        else if (s[0] === "`") out.push(node("code", [s.slice(1, -1)]));
        else if (s.slice(0, 2) === "**") out.push(node("strong", inline(s.slice(2, -2), (depth || 0) + 1)));
        else out.push(node("em", inline(s.slice(1, -1), (depth || 0) + 1)));
        at = re.lastIndex;
      }
      if (at < text.length) out.push(text.slice(at));
      return out;
    }
    function blocks(lines, depth) {
      var out = [], i = 0;
      function listMatch(s) {
        return /^( *)([-+*]|\d+\.) +(.+)$/.exec(s);
      }
      function special(s) {
        return /^\s*$|^\x60\x60\x60|^#{1,6} +|^> ?|^\s*(?:---+|\*\*\*+|___+)\s*$/.test(s) || listMatch(s);
      }
      while (i < lines.length) {
        var line = lines[i], m;
        if (!line.trim()) {
          i++;
          continue;
        }
        if (/^\x60\x60\x60/.test(line)) {
          var end = i + 1;
          while (end < lines.length && !/^\x60\x60\x60\s*$/.test(lines[end])) end++;
          if (end === lines.length) {
            out.push(node("p", [lines.slice(i).join("\n")]));
            break;
          }
          out.push(node("pre", [node("code", [lines.slice(i + 1, end).join("\n")])]));
          i = end + 1;
          continue;
        }
        if (m = /^(#{1,6}) +(.+)$/.exec(line)) {
          out.push(node("h" + m[1].length, inline(m[2])));
          i++;
          continue;
        }
        if (/^\s*(?:---+|\*\*\*+|___+)\s*$/.test(line)) {
          out.push(node("hr", []));
          i++;
          continue;
        }
        if (/^> ?/.test(line) && depth < 2) {
          var quote = [];
          while (i < lines.length && /^> ?/.test(lines[i])) quote.push(lines[i++].replace(/^> ?/, ""));
          out.push(node("blockquote", blocks(quote, depth + 1)));
          continue;
        }
        if ((m = listMatch(line)) && depth < 2) {
          var base = m[1].length, ordered = /\d/.test(m[2]), items = [], start = parseInt(m[2], 10);
          while (i < lines.length) {
            m = listMatch(lines[i]);
            if (!m || m[1].length !== base || /\d/.test(m[2]) !== ordered) break;
            var children = inline(m[3]), nested = [];
            i++;
            while (i < lines.length && (m = listMatch(lines[i])) && m[1].length > base) nested.push(lines[i++].slice(base + 2));
            if (nested.length) children = children.concat(blocks(nested, depth + 1));
            items.push(node("li", children));
          }
          out.push(node(ordered ? "ol" : "ul", items, ordered ? { start } : {}));
          continue;
        }
        var paragraph = [line];
        i++;
        while (i < lines.length && !special(lines[i])) paragraph.push(lines[i++]);
        var parts = [];
        paragraph.forEach(function(s, j) {
          if (j) parts.push(node("br", []));
          var children2 = inline(s);
          for (var k = 0; k < children2.length; k++) parts.push(children2[k]);
        });
        out.push(node("p", parts));
      }
      return out;
    }
    function parse(text, mode) {
      text = String(text == null ? "" : text);
      mode = mode === "text" ? "text" : "markdown";
      var key = mode + ":" + text;
      if (cache.has(key)) return cache.get(key);
      var ast = mode === "text" ? [text] : blocks(text.replace(/\r\n?/g, "\n").split("\n"), 0);
      if (text.length <= 1e5) {
        while (cache.size >= 100 || cacheChars + key.length > 1e6) {
          var first = cache.keys().next().value;
          cacheChars -= first.length;
          cache.delete(first);
        }
        cache.set(key, ast);
        cacheChars += key.length;
      }
      return ast;
    }
    function createBody(React, Highlight) {
      var h2 = React.createElement;
      return function Body(props) {
        function render(items, path) {
          return items.map(function(item, i) {
            var key = path + "-" + i;
            if (typeof item === "string") return Highlight ? h2(Highlight, { key, text: item, keyword: props.keyword }) : item;
            var attrs = Object.assign({ key }, item.props);
            if (item.tag === "br" || item.tag === "hr") return h2(item.tag, attrs);
            return h2(item.tag, attrs, render(item.children, key));
          });
        }
        return h2("div", { className: props.mode === "text" ? "wb-body-text" : "wb-markdown" }, render(parse(props.text, props.mode), "md"));
      };
    }
    module2.exports = { parse, createBody };
  }
});

// packages/addons/lib/body-toggle.cjs
var require_body_toggle = __commonJS({
  "packages/addons/lib/body-toggle.cjs"(exports2, module2) {
    module2.exports = function(React) {
      var h2 = React.createElement;
      return function BodyMode(props) {
        var plain = props.mode === "text", t = props.t;
        var label = t.bodyModeToggle.replace("{field}", props.label).replace("{current}", t[plain ? "plainText" : "markdown"]).replace("{target}", t[plain ? "markdown" : "plainText"]);
        return h2("button", {
          type: "button",
          className: "wb-body-toggle" + (props.className ? " " + props.className : ""),
          title: label,
          "aria-label": label,
          "aria-pressed": !plain,
          onClick: function(e) {
            e.stopPropagation();
            props.onChange(plain ? "markdown" : "text");
          }
        }, h2("span", { key: props.mode, className: "wb-body-toggle-icon", "aria-hidden": true }, h2(props.Icon, { name: plain ? "pilcrow" : "code-2", size: 14 })));
      };
    };
  }
});

// packages/addons/lib/body-copy.cjs
var require_body_copy = __commonJS({
  "packages/addons/lib/body-copy.cjs"(exports2, module2) {
    module2.exports = {
      zh: { desc: "\u63CF\u8FF0", markdown: "Markdown \u6E32\u67D3", plainText: "\u7EAF\u6587\u672C", bodyModeToggle: "{field} \xB7 \u5F53\u524D\uFF1A{current}\uFF1B\u5207\u6362\u4E3A{target}" },
      en: { desc: "Description", markdown: "Rendered Markdown", plainText: "Plain text", bodyModeToggle: "{field} \xB7 Current: {current}; switch to {target}" }
    };
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

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/code-xml.mjs
var code_xml_exports = {};
__export(code_xml_exports, {
  __iconData: () => __iconData,
  default: () => CodeXml
});
var __iconData, CodeXml;
var init_code_xml = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/code-xml.mjs"() {
    init_createLucideIcon();
    __iconData = {
      name: "code-xml",
      size: 24,
      node: [
        ["path", { d: "m18 16 4-4-4-4", key: "1inbqp" }],
        ["path", { d: "m6 8-4 4 4 4", key: "15zrgr" }],
        ["path", { d: "m14.5 4-5 16", key: "e7oirm" }]
      ],
      aliases: ["code-2"]
    };
    __iconData.node;
    CodeXml = createLucideIcon(__iconData);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/code-2.mjs
var code_2_exports = {};
__export(code_2_exports, {
  default: () => CodeXml
});
var init_code_2 = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/code-2.mjs"() {
    init_code_xml();
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/pilcrow.mjs
var pilcrow_exports = {};
__export(pilcrow_exports, {
  __iconData: () => __iconData2,
  default: () => Pilcrow
});
var __iconData2, Pilcrow;
var init_pilcrow = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/pilcrow.mjs"() {
    init_createLucideIcon();
    __iconData2 = {
      name: "pilcrow",
      size: 24,
      node: [
        ["path", { d: "M13 4v16", key: "8vvj80" }],
        ["path", { d: "M17 4v16", key: "7dpous" }],
        ["path", { d: "M19 4H9.5a4.5 4.5 0 0 0 0 9H13", key: "sh4n9v" }]
      ]
    };
    __iconData2.node;
    Pilcrow = createLucideIcon(__iconData2);
  }
});

// packages/addons/lib/body-styles.cjs
var require_body_styles = __commonJS({
  "packages/addons/lib/body-styles.cjs"(exports2, module2) {
    module2.exports = `
.wb-body-label{float:left;position:relative;z-index:1;margin:1px 6px 0 0;padding:1px 4px;border-radius:4px;font-size:11px;font-weight:600;letter-spacing:.06em;line-height:1.6;color:#234783;background:color-mix(in srgb,#5b7fd6 8%,#fff);white-space:nowrap}
.wb-body-label.wb-review-label{color:#154d43;background:color-mix(in srgb,var(--wbt-accent,#11a89b) 8%,#fff)}
.wb-markdown{white-space:normal;min-width:0;overflow-wrap:anywhere}.wb-markdown:after{content:'';display:table;clear:both}
.wb-markdown p{margin:0 0 6px;white-space:pre-wrap}.wb-markdown>:last-child{margin-bottom:0}
.wb-markdown h1,.wb-markdown h2,.wb-markdown h3,.wb-markdown h4,.wb-markdown h5,.wb-markdown h6{margin:6px 0;font-weight:650;line-height:1.6}
.wb-markdown>:first-child{margin-top:0}.wb-markdown h1{font-size:16px}.wb-markdown h2{font-size:15px}.wb-markdown h3{font-size:14px}.wb-markdown h4,.wb-markdown h5,.wb-markdown h6{font-size:13px}
.wb-markdown ul,.wb-markdown ol{margin:4px 0;padding-left:24px;display:flow-root}.wb-markdown li{margin:1px 0}
.wb-markdown blockquote{border-left:2px solid currentColor;padding-left:9px;margin:4px 0;display:flow-root}
.wb-markdown pre{white-space:pre-wrap;overflow-wrap:anywhere;padding:8px;border-radius:6px;background:color-mix(in srgb,currentColor 7%,transparent);display:flow-root;margin:5px 0}
.wb-markdown code,.wb-body-text{font-family:ui-monospace,SFMono-Regular,Menlo,monospace}.wb-markdown code{background:color-mix(in srgb,currentColor 7%,transparent);border-radius:3px;padding:1px 3px}.wb-markdown pre code{padding:0;background:none}
.wb-markdown a{color:inherit;text-decoration:underline}.wb-markdown hr{border:0;border-top:1px solid currentColor;opacity:.3;clear:both}
.wb-body-text{white-space:pre-wrap;overflow-wrap:anywhere}.wb-body-text:after{content:'';display:table;clear:both}
.wb-body-section{min-width:0;overflow-anchor:none}
.wb-body-heading{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:4px;padding-left:12px;min-height:24px}
.wb-body-heading .wb-body-label{float:none;margin:0;padding:0;border-radius:0;background:none;color:inherit;font-size:11.5px;font-weight:600;letter-spacing:.06em;opacity:.72}
.wb-body-toggle{display:inline-flex;align-items:center;justify-content:center;flex:none;width:24px;height:24px;border:0;background:transparent;color:inherit;padding:0;border-radius:4px;cursor:pointer;opacity:.7}
.wb-body-toggle:hover{opacity:1;background:color-mix(in srgb,currentColor 5%,transparent)}
.wb-body-toggle:focus-visible{outline:2px solid var(--dsw-alias-brand-primary,#2563eb);outline-offset:2px}
.wb-body-toggle-icon{display:flex;animation:wb-body-icon-in 140ms ease-out}
@keyframes wb-body-icon-in{from{opacity:0}to{opacity:1}}
@media(prefers-reduced-motion:reduce){.wb-body-toggle-icon{animation:none}}
.wbt-item.closed:has(.wb-body-label){opacity:1}
`;
  }
});

// packages/addons/lib/body-id.cjs
var require_body_id = __commonJS({
  "packages/addons/lib/body-id.cjs"(exports2, module2) {
    var nextId = 0;
    module2.exports = function useBodyId(React) {
      return typeof React.useId === "function" ? React.useId() : React.useState("wb-body-" + ++nextId)[0];
    };
  }
});

// packages/addons/lib/description.cjs
var require_description = __commonJS({
  "packages/addons/lib/description.cjs"(exports2, module2) {
    var React = require("react");
    var h2 = React.createElement;
    var Body = require_markdown().createBody(React);
    var BodyMode = require_body_toggle()(React);
    var copy = require_body_copy();
    var Code = (init_code_2(), __toCommonJS(code_2_exports)).default;
    var Pilcrow2 = (init_pilcrow(), __toCommonJS(pilcrow_exports)).default;
    function BodyIcon(props) {
      return h2(props.name === "pilcrow" ? Pilcrow2 : Code, { size: props.size, "aria-hidden": true, focusable: false });
    }
    var css = require_body_styles() + `
.wb-desc{margin-top:4px;font-size:12.5px;line-height:1.6;white-space:pre-wrap;word-break:break-word;overflow-wrap:anywhere;max-width:100%;min-width:0;box-sizing:border-box;padding:6px 10px;border-radius:0 8px 8px 0;border-left:2px solid color-mix(in oklab,#5b7fd6 34%,transparent);background:color-mix(in oklab,#5b7fd6 7%,transparent);color:inherit}
.wb-description{margin-top:10px}.wb-description>.wb-desc{margin-top:0}
.wb-desc-text{display:block}.wb-desc-clamped{display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:3;overflow:hidden}
.wb-desc-toggle{display:block;border:1px solid transparent;background:transparent;color:inherit;font:inherit;font-size:12px;min-width:32px;min-height:32px;padding:3px 6px;border-radius:6px;cursor:pointer;white-space:normal}
.wb-desc-toggle:hover{background:color-mix(in oklab,currentColor 8%,transparent)}.wb-desc-toggle:focus-visible{outline:2px solid var(--dsw-alias-brand-primary,#2563eb);outline-offset:2px}
`;
    function Description(props) {
      var mode = React.useState(props.bodyMode === "text" ? "text" : "markdown");
      var labelId = require_body_id()(React) + "-desc", t = copy[props.lang === "en" ? "en" : "zh"];
      var text = props.text == null ? "" : String(props.text);
      var expanded = React.useState(false), overflow = React.useState(false), ref = React.useRef(null);
      React.useEffect(function() {
        expanded[1](false);
      }, [text]);
      React.useEffect(function() {
        var node = ref.current;
        if (!node) return;
        function measure() {
          if (!expanded[0]) overflow[1](node.scrollHeight > node.clientHeight + 1);
        }
        measure();
        var observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(measure) : null;
        if (observer) observer.observe(node);
        return function() {
          if (observer) observer.disconnect();
        };
      }, [text, expanded[0], mode[0]]);
      if (!text.trim()) return null;
      return h2(
        "section",
        { className: "wb-body-section wb-description", "aria-labelledby": labelId },
        h2(
          "div",
          { className: "wb-body-heading" },
          h2("span", { id: labelId, className: "wb-body-label" }, t.desc),
          h2(BodyMode, { label: t.desc, mode: mode[0], onChange: mode[1], t, Icon: props.Icon || BodyIcon })
        ),
        h2(
          "div",
          { className: "wb-desc" },
          h2(
            "div",
            { ref, className: "wb-desc-text" + (expanded[0] ? "" : " wb-desc-clamped") },
            h2(Body, { text, mode: mode[0] })
          ),
          overflow[0] || expanded[0] ? h2("button", {
            type: "button",
            className: "wb-desc-toggle",
            "aria-expanded": expanded[0],
            onClick: function() {
              expanded[1](!expanded[0]);
            }
          }, props.lang === "en" ? expanded[0] ? "Collapse" : "Expand" : expanded[0] ? "\u6536\u8D77" : "\u5C55\u5F00") : null
        )
      );
    }
    module2.exports = { css, Description };
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

// packages/addons/storage/client/ui/styles.cjs
var require_styles = __commonJS({
  "packages/addons/storage/client/ui/styles.cjs"(exports2, module2) {
    module2.exports = require_description().css + require_visual_tokens() + `
.wbi-root{--line:var(--wb-line,var(--dsw-alias-border-l2,#d9dfe6));--surface:var(--wb-surface,var(--dsw-alias-bg-layer-1,#fff));--muted:var(--dsw-alias-label-secondary,#64748b);--accent:var(--dsw-alias-brand-primary,#2563eb);font-size:13px;color:inherit;min-width:0;container-type:inline-size;container-name:storage}
.wbi-root *{box-sizing:border-box}.wbi-root h2{font-size:18px;margin:0}.wbi-root h3{font-size:15px;margin:0}.wbi-row{display:flex;align-items:center;gap:10px;flex-wrap:wrap}.wbi-grow{flex:1;min-width:0}.wbi-muted{color:var(--muted);font-size:12px}.wbi-root input,.wbi-root textarea,.wbi-root select{background:var(--surface);color:inherit;border:1px solid var(--line);border-radius:8px;padding:8px 10px;font:inherit;max-width:100%}.wbi-root textarea{resize:vertical;min-height:80px}.wbi-root :focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.wbi-btn,.wbi-image,.wbi-root .wb-desc-toggle{border:none;background:var(--wb-btn-bg);color:inherit;min-height:var(--wb-btn-size-sm);min-width:var(--wb-btn-size-sm);border-radius:8px;padding:7px 12px;cursor:pointer;font:inherit}
.wbi-btn:enabled:hover,.wbi-image:enabled:hover,.wbi-root .wb-desc-toggle:enabled:hover{background:var(--wb-btn-hover-bg)}
.wbi-btn:enabled:active,.wbi-image:enabled:active,.wbi-root .wb-desc-toggle:enabled:active{background:var(--wb-btn-active-bg)}
.wbi-btn:disabled{opacity:.45;cursor:default}
.wbi-btn.wbi-primary{background:var(--wb-btn-primary-bg);color:var(--dsw-alias-label-primary-inverted,#fff)}
.wbi-btn.wbi-primary:enabled:hover{background:color-mix(in oklab,var(--wb-btn-primary-bg) 92%,black)}
.wbi-btn.wbi-primary:enabled:active{background:color-mix(in oklab,var(--wb-btn-primary-bg) 84%,black)}
.wbi-btn.wbi-danger:enabled:hover{color:var(--wb-btn-danger-fg)}
.wbi-btn:focus-visible,.wbi-image:focus-visible,.wbi-root .wb-desc-toggle:focus-visible{outline:var(--wb-btn-focus);outline-offset:var(--wb-btn-focus-offset)}
.wbi-toolbar{margin:18px 0;display:flex;gap:10px;align-items:center;flex-wrap:wrap}.wbi-toolbar input[type=search]{min-width:220px;flex:1}.wbi-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(260px,100%),1fr));gap:14px}.wbi-card{padding:14px;border:1px solid var(--line);border-radius:10px;background:var(--surface);min-width:0;height:100%;display:flex;flex-direction:column;gap:8px;transition:transform .14s ease,border-color .14s ease}.wbi-card h3{font-size:14px;font-weight:650;line-height:1.4;overflow-wrap:anywhere;min-width:0;flex:1}.wbi-stock{display:inline-flex;align-items:center;gap:5px;font-size:18px;font-weight:650;overflow-wrap:anywhere;max-width:100%;font-variant-numeric:tabular-nums}.wbi-card p{margin:0;white-space:pre-wrap;overflow-wrap:anywhere}.wbi-tags{display:flex;gap:6px;flex-wrap:wrap}.wbi-chip{display:inline-flex;align-items:center;gap:5px;padding:4px 8px;border-radius:20px;font-size:12px}.wbi-images{display:flex;gap:8px;flex-wrap:wrap;align-items:center;min-width:0}.wbi-image{border-radius:8px;overflow:hidden;padding:0;background:transparent;flex-shrink:0;cursor:pointer}.wbi-image img{display:block;width:80px;aspect-ratio:4/3;height:auto;object-fit:cover}.wbi-empty{padding:50px 20px;text-align:center;color:var(--muted);border:1px dashed var(--line);border-radius:12px}.wbi-error{padding:12px;margin:10px 0;border:1px solid #ef4444;border-radius:8px;color:var(--dsw-alias-state-error-primary,#b91c1c)}.wbi-pager{margin:20px 0;display:flex;gap:10px;align-items:center;justify-content:flex-end;flex-wrap:wrap}
.wbi-mask{position:fixed;inset:0;background:#0007;z-index:10000;display:flex;align-items:center;justify-content:center;padding:20px}.wbi-modal{background:var(--surface);color:inherit;border-radius:14px;padding:22px;width:640px;max-width:100%;max-height:90vh;overflow:auto;box-shadow:0 20px 70px #0004}.wbi-form{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:20px}.wbi-field{display:flex;flex-direction:column;gap:6px;min-width:0}.wbi-wide{grid-column:1/-1}.wbi-formfoot{display:flex;justify-content:flex-end;gap:8px;margin-top:20px}.wbi-tagoptions{display:flex;gap:8px;flex-wrap:wrap;max-height:160px;overflow:auto;margin-top:8px}.wbi-tagoptions label{display:flex;gap:5px;align-items:center}.wbi-preview{display:block;max-width:100%;max-height:65vh;margin:16px auto;object-fit:contain}.wbi-kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:14px;margin:18px 0}.wbi-kpis strong{display:block;font-size:28px;margin-top:8px}.wbi-bar{height:7px;border-radius:4px;background:var(--accent);margin:8px 0 12px}.wbi-notice{padding:10px 0;color:var(--muted)}
@media(max-width:600px){.wbi-form{grid-template-columns:1fr}.wbi-wide{grid-column:auto}.wbi-mask{padding:8px}.wbi-modal{padding:16px}.wbi-toolbar input[type=search]{min-width:0;width:100%}}

.wbi-cardhead{display:flex;align-items:baseline;gap:8px;min-width:0;flex-wrap:wrap}.wbi-metazone{display:flex;flex-direction:column;gap:3px;min-width:0;overflow-wrap:anywhere}.wbi-meta{display:flex;gap:2px 10px;flex-wrap:wrap;font-size:11.5px;color:var(--muted);font-variant-numeric:tabular-nums}
.wbi-actions{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:4px;margin-top:auto;padding-top:6px;min-width:0}.wbi-btn-sm{padding:3px 9px;font-size:12px;min-height:var(--wb-btn-size-sm);min-width:var(--wb-btn-size-sm)}.wbi-chip{min-height:32px;max-width:100%;overflow-wrap:anywhere;text-align:left}.wbi-stock small{font-weight:400}.wbi-more{font-variant-numeric:tabular-nums}
.wbi-card:hover,.wbi-card:focus-within{border-color:color-mix(in oklab,var(--accent) 40%,var(--line))}.wbi-card:hover{transform:translateY(-2px)}.wbi-card:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.wbi-selectable{cursor:pointer;position:relative;padding-top:42px}.wbi-root input.wbi-check{position:absolute;left:14px;top:14px;margin:0;padding:0;accent-color:var(--accent)}.wbi-card.wbi-selected{border-color:var(--accent);background:color-mix(in srgb,var(--accent) 9%,var(--surface))}.wbi-selbar{position:fixed;left:50%;bottom:16px;transform:translateX(-50%);z-index:900;display:flex;gap:8px;align-items:center;background:var(--surface);border:1px solid var(--line);box-shadow:0 10px 34px #0004;border-radius:12px;padding:8px 11px;max-width:94vw;flex-wrap:wrap}.wbi-bulk-actions{display:flex;gap:8px}.wbi-root:has(.wbi-selbar){padding-bottom:84px}
@container storage (min-width:1280px){.wbi-grid{grid-template-columns:repeat(5,minmax(0,1fr))}}
@media(prefers-reduced-motion:reduce){.wbi-card{transition:none}.wbi-card:hover{transform:none}}
.wbi-root{--line:var(--wb-border)}.wbi-svg{display:inline-block;vertical-align:middle;flex:none}.wbi-root h2,.wbi-root h3,.wbi-inline{display:inline-flex;align-items:center;gap:var(--wb-space-sm)}.wbi-metazone .wbi-inline{margin-right:10px}
.wbi-btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;border-radius:var(--wb-radius-sm);transition:background var(--wb-motion),color var(--wb-motion)}.wbi-card{border-radius:var(--wb-radius-card);padding:var(--wb-space-md);gap:var(--wb-space-sm)}.wbi-grid{gap:var(--wb-space-md)}.wbi-icon-only{width:32px;height:32px;min-width:32px;padding:0}.wbi-empty .wbi-svg{display:block;margin:0 auto 14px}.wbi-image{position:relative;min-width:80px;min-height:60px}.wbi-image>.wbi-svg{position:absolute;inset:0;margin:auto}.wbi-image img{position:relative}
.wbi-sr{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}.wbi-skeleton{margin:18px 0}.wbi-sk{height:16px;border-radius:var(--wb-radius-sm);background:color-mix(in oklab,currentColor 9%,transparent);animation:wbi-pulse 1.4s ease-in-out infinite}.wbi-sk:nth-child(2){height:48px}.wbi-sk:last-child{width:60%}@keyframes wbi-pulse{50%{opacity:.45}}
.wbi-cfg-group{border-radius:var(--wb-radius-card)!important}.wbi-cfg{gap:var(--wb-space-md)!important}.wbi-cfg-head h2{display:flex;gap:var(--wb-space-sm);align-items:center}
@container storage (max-width:480px){.wbi-toolbar{gap:8px}.wbi-toolbar input[type=search]{flex-basis:100%;min-width:0}.wbi-toolbar select{flex:1;min-width:0}.wbi-root>.wbi-row>.wbi-icon-text .wbi-btn-label,.wbi-toolbar>.wbi-icon-text .wbi-btn-label,.wbi-cfg-head>.wbi-icon-text .wbi-btn-label{display:none}.wbi-root>.wbi-row>.wbi-icon-text,.wbi-toolbar>.wbi-icon-text,.wbi-cfg-head>.wbi-icon-text{width:32px;height:32px;padding:0}}
@media(prefers-reduced-motion:reduce){.wbi-root *,.wbi-root *::after{transition:none!important;animation:none!important}.wbi-card:hover{transform:none}}
`;
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/box.mjs
var box_exports = {};
__export(box_exports, {
  __iconData: () => __iconData3,
  default: () => Box
});
var __iconData3, Box;
var init_box = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/box.mjs"() {
    init_createLucideIcon();
    __iconData3 = {
      name: "box",
      size: 24,
      node: [
        [
          "path",
          {
            d: "M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z",
            key: "hh9hay"
          }
        ],
        ["path", { d: "m3.3 7 8.7 5 8.7-5", key: "g66t2b" }],
        ["path", { d: "M12 22V12", key: "d0xqtd" }]
      ]
    };
    __iconData3.node;
    Box = createLucideIcon(__iconData3);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/plus.mjs
var plus_exports = {};
__export(plus_exports, {
  __iconData: () => __iconData4,
  default: () => Plus
});
var __iconData4, Plus;
var init_plus = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/plus.mjs"() {
    init_createLucideIcon();
    __iconData4 = {
      name: "plus",
      size: 24,
      node: [
        ["path", { d: "M5 12h14", key: "1ays0h" }],
        ["path", { d: "M12 5v14", key: "s699le" }]
      ]
    };
    __iconData4.node;
    Plus = createLucideIcon(__iconData4);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/search.mjs
var search_exports = {};
__export(search_exports, {
  __iconData: () => __iconData5,
  default: () => Search
});
var __iconData5, Search;
var init_search = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/search.mjs"() {
    init_createLucideIcon();
    __iconData5 = {
      name: "search",
      size: 24,
      node: [
        ["path", { d: "m21 21-4.34-4.34", key: "14j7rj" }],
        ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }]
      ]
    };
    __iconData5.node;
    Search = createLucideIcon(__iconData5);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/refresh-cw.mjs
var refresh_cw_exports = {};
__export(refresh_cw_exports, {
  __iconData: () => __iconData6,
  default: () => RefreshCw
});
var __iconData6, RefreshCw;
var init_refresh_cw = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/refresh-cw.mjs"() {
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

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/pencil.mjs
var pencil_exports = {};
__export(pencil_exports, {
  __iconData: () => __iconData7,
  default: () => Pencil
});
var __iconData7, Pencil;
var init_pencil = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/pencil.mjs"() {
    init_createLucideIcon();
    __iconData7 = {
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
    __iconData7.node;
    Pencil = createLucideIcon(__iconData7);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/trash.mjs
var __iconData8, Trash;
var init_trash = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/trash.mjs"() {
    init_createLucideIcon();
    __iconData8 = {
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
    __iconData8.node;
    Trash = createLucideIcon(__iconData8);
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

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/arrow-up-down.mjs
var arrow_up_down_exports = {};
__export(arrow_up_down_exports, {
  __iconData: () => __iconData9,
  default: () => ArrowUpDown
});
var __iconData9, ArrowUpDown;
var init_arrow_up_down = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/arrow-up-down.mjs"() {
    init_createLucideIcon();
    __iconData9 = {
      name: "arrow-up-down",
      size: 24,
      node: [
        ["path", { d: "m21 16-4 4-4-4", key: "f6ql7i" }],
        ["path", { d: "M17 20V4", key: "1ejh1v" }],
        ["path", { d: "m3 8 4-4 4 4", key: "11wl7u" }],
        ["path", { d: "M7 4v16", key: "1glfcx" }]
      ]
    };
    __iconData9.node;
    ArrowUpDown = createLucideIcon(__iconData9);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/image.mjs
var image_exports = {};
__export(image_exports, {
  __iconData: () => __iconData10,
  default: () => Image
});
var __iconData10, Image;
var init_image = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/image.mjs"() {
    init_createLucideIcon();
    __iconData10 = {
      name: "image",
      size: 24,
      node: [
        ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", ry: "2", key: "1m3agn" }],
        ["circle", { cx: "9", cy: "9", r: "2", key: "af1f0g" }],
        ["path", { d: "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21", key: "1xmnt7" }]
      ]
    };
    __iconData10.node;
    Image = createLucideIcon(__iconData10);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/clock.mjs
var clock_exports = {};
__export(clock_exports, {
  __iconData: () => __iconData11,
  default: () => Clock
});
var __iconData11, Clock;
var init_clock = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/clock.mjs"() {
    init_createLucideIcon();
    __iconData11 = {
      name: "clock",
      size: 24,
      node: [
        ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
        ["path", { d: "M12 6v6l4 2", key: "mmk7yg" }]
      ]
    };
    __iconData11.node;
    Clock = createLucideIcon(__iconData11);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/tag.mjs
var tag_exports = {};
__export(tag_exports, {
  __iconData: () => __iconData12,
  default: () => Tag
});
var __iconData12, Tag;
var init_tag = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/tag.mjs"() {
    init_createLucideIcon();
    __iconData12 = {
      name: "tag",
      size: 24,
      node: [
        [
          "path",
          {
            d: "M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z",
            key: "vktsd0"
          }
        ],
        ["circle", { cx: "7.5", cy: "7.5", r: ".5", fill: "currentColor", key: "kqv944" }]
      ]
    };
    __iconData12.node;
    Tag = createLucideIcon(__iconData12);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/package.mjs
var package_exports = {};
__export(package_exports, {
  __iconData: () => __iconData13,
  default: () => Package
});
var __iconData13, Package;
var init_package = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/package.mjs"() {
    init_createLucideIcon();
    __iconData13 = {
      name: "package",
      size: 24,
      node: [
        [
          "path",
          {
            d: "M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z",
            key: "1a0edw"
          }
        ],
        ["path", { d: "M12 22V12", key: "d0xqtd" }],
        ["polyline", { points: "3.29 7 12 12 20.71 7", key: "ousv84" }],
        ["path", { d: "m7.5 4.27 9 5.15", key: "1c824w" }]
      ]
    };
    __iconData13.node;
    Package = createLucideIcon(__iconData13);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/chart-column.mjs
var chart_column_exports = {};
__export(chart_column_exports, {
  __iconData: () => __iconData14,
  default: () => ChartColumn
});
var __iconData14, ChartColumn;
var init_chart_column = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/chart-column.mjs"() {
    init_createLucideIcon();
    __iconData14 = {
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
    __iconData14.node;
    ChartColumn = createLucideIcon(__iconData14);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/list.mjs
var list_exports = {};
__export(list_exports, {
  __iconData: () => __iconData15,
  default: () => List
});
var __iconData15, List;
var init_list = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/list.mjs"() {
    init_createLucideIcon();
    __iconData15 = {
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
    __iconData15.node;
    List = createLucideIcon(__iconData15);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/settings.mjs
var settings_exports = {};
__export(settings_exports, {
  __iconData: () => __iconData16,
  default: () => Settings
});
var __iconData16, Settings;
var init_settings = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/settings.mjs"() {
    init_createLucideIcon();
    __iconData16 = {
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
    __iconData16.node;
    Settings = createLucideIcon(__iconData16);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/database.mjs
var database_exports = {};
__export(database_exports, {
  __iconData: () => __iconData17,
  default: () => Database
});
var __iconData17, Database;
var init_database = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/database.mjs"() {
    init_createLucideIcon();
    __iconData17 = {
      name: "database",
      size: 24,
      node: [
        ["ellipse", { cx: "12", cy: "5", rx: "9", ry: "3", key: "msslwz" }],
        ["path", { d: "M3 5V19A9 3 0 0 0 21 19V5", key: "1wlel7" }],
        ["path", { d: "M3 12A9 3 0 0 0 21 12", key: "mv7ke4" }]
      ]
    };
    __iconData17.node;
    Database = createLucideIcon(__iconData17);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/download.mjs
var download_exports = {};
__export(download_exports, {
  __iconData: () => __iconData18,
  default: () => Download
});
var __iconData18, Download;
var init_download = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/download.mjs"() {
    init_createLucideIcon();
    __iconData18 = {
      name: "download",
      size: 24,
      node: [
        ["path", { d: "M12 15V3", key: "m9g1x1" }],
        ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
        ["path", { d: "m7 10 5 5 5-5", key: "brsn70" }]
      ]
    };
    __iconData18.node;
    Download = createLucideIcon(__iconData18);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/package-open.mjs
var package_open_exports = {};
__export(package_open_exports, {
  __iconData: () => __iconData19,
  default: () => PackageOpen
});
var __iconData19, PackageOpen;
var init_package_open = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/package-open.mjs"() {
    init_createLucideIcon();
    __iconData19 = {
      name: "package-open",
      size: 24,
      node: [
        ["path", { d: "M12 22v-9", key: "x3hkom" }],
        [
          "path",
          {
            d: "M15.17 2.21a1.67 1.67 0 0 1 1.63 0L21 4.57a1.93 1.93 0 0 1 0 3.36L8.82 14.79a1.655 1.655 0 0 1-1.64 0L3 12.43a1.93 1.93 0 0 1 0-3.36z",
            key: "2ntwy6"
          }
        ],
        [
          "path",
          {
            d: "M20 13v3.87a2.06 2.06 0 0 1-1.11 1.83l-6 3.08a1.93 1.93 0 0 1-1.78 0l-6-3.08A2.06 2.06 0 0 1 4 16.87V13",
            key: "1pmm1c"
          }
        ],
        [
          "path",
          {
            d: "M21 12.43a1.93 1.93 0 0 0 0-3.36L8.83 2.2a1.64 1.64 0 0 0-1.63 0L3 4.57a1.93 1.93 0 0 0 0 3.36l12.18 6.86a1.636 1.636 0 0 0 1.63 0z",
            key: "12ttoo"
          }
        ]
      ]
    };
    __iconData19.node;
    PackageOpen = createLucideIcon(__iconData19);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/factory.mjs
var factory_exports = {};
__export(factory_exports, {
  __iconData: () => __iconData20,
  default: () => Factory
});
var __iconData20, Factory;
var init_factory = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/factory.mjs"() {
    init_createLucideIcon();
    __iconData20 = {
      name: "factory",
      size: 24,
      node: [
        ["path", { d: "M12 16h.01", key: "1drbdi" }],
        ["path", { d: "M16 16h.01", key: "1f9h7w" }],
        [
          "path",
          {
            d: "M3 19a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.5a.5.5 0 0 0-.769-.422l-4.462 2.844A.5.5 0 0 1 15 10.5v-2a.5.5 0 0 0-.769-.422L9.77 10.922A.5.5 0 0 1 9 10.5V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z",
            key: "1iv0i2"
          }
        ],
        ["path", { d: "M8 16h.01", key: "18s6g9" }]
      ]
    };
    __iconData20.node;
    Factory = createLucideIcon(__iconData20);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/ruler.mjs
var ruler_exports = {};
__export(ruler_exports, {
  __iconData: () => __iconData21,
  default: () => Ruler
});
var __iconData21, Ruler;
var init_ruler = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/ruler.mjs"() {
    init_createLucideIcon();
    __iconData21 = {
      name: "ruler",
      size: 24,
      node: [
        [
          "path",
          {
            d: "M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z",
            key: "icamh8"
          }
        ],
        ["path", { d: "m14.5 12.5 2-2", key: "inckbg" }],
        ["path", { d: "m11.5 9.5 2-2", key: "fmmyf7" }],
        ["path", { d: "m8.5 6.5 2-2", key: "vc6u1g" }],
        ["path", { d: "m17.5 15.5 2-2", key: "wo5hmg" }]
      ]
    };
    __iconData21.node;
    Ruler = createLucideIcon(__iconData21);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/map-pin.mjs
var map_pin_exports = {};
__export(map_pin_exports, {
  __iconData: () => __iconData22,
  default: () => MapPin
});
var __iconData22, MapPin;
var init_map_pin = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/map-pin.mjs"() {
    init_createLucideIcon();
    __iconData22 = {
      name: "map-pin",
      size: 24,
      node: [
        [
          "path",
          {
            d: "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",
            key: "1r0f0z"
          }
        ],
        ["circle", { cx: "12", cy: "10", r: "3", key: "ilqhr7" }]
      ]
    };
    __iconData22.node;
    MapPin = createLucideIcon(__iconData22);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/square-check-big.mjs
var __iconData23, SquareCheckBig;
var init_square_check_big = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/square-check-big.mjs"() {
    init_createLucideIcon();
    __iconData23 = {
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
    __iconData23.node;
    SquareCheckBig = createLucideIcon(__iconData23);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/check-square.mjs
var check_square_exports = {};
__export(check_square_exports, {
  default: () => SquareCheckBig
});
var init_check_square = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/check-square.mjs"() {
    init_square_check_big();
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/x.mjs
var x_exports = {};
__export(x_exports, {
  __iconData: () => __iconData24,
  default: () => X
});
var __iconData24, X;
var init_x = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/x.mjs"() {
    init_createLucideIcon();
    __iconData24 = {
      name: "x",
      size: 24,
      node: [
        ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
        ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
      ]
    };
    __iconData24.node;
    X = createLucideIcon(__iconData24);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/table.mjs
var table_exports = {};
__export(table_exports, {
  __iconData: () => __iconData25,
  default: () => Table
});
var __iconData25, Table;
var init_table = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/table.mjs"() {
    init_createLucideIcon();
    __iconData25 = {
      name: "table",
      size: 24,
      node: [
        ["path", { d: "M12 3v18", key: "108xh3" }],
        ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" }],
        ["path", { d: "M3 9h18", key: "1pudct" }],
        ["path", { d: "M3 15h18", key: "5xshup" }]
      ]
    };
    __iconData25.node;
    Table = createLucideIcon(__iconData25);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/rotate-ccw.mjs
var rotate_ccw_exports = {};
__export(rotate_ccw_exports, {
  __iconData: () => __iconData26,
  default: () => RotateCcw
});
var __iconData26, RotateCcw;
var init_rotate_ccw = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/rotate-ccw.mjs"() {
    init_createLucideIcon();
    __iconData26 = {
      name: "rotate-ccw",
      size: 24,
      node: [
        ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", key: "1357e3" }],
        ["path", { d: "M3 3v5h5", key: "1xhq8a" }]
      ]
    };
    __iconData26.node;
    RotateCcw = createLucideIcon(__iconData26);
  }
});

// packages/addons/storage/client/ui/icons.cjs
var require_icons = __commonJS({
  "packages/addons/storage/client/ui/icons.cjs"(exports2, module2) {
    var React = require("react");
    var ICONS = {
      box: (init_box(), __toCommonJS(box_exports)).default,
      plus: (init_plus(), __toCommonJS(plus_exports)).default,
      search: (init_search(), __toCommonJS(search_exports)).default,
      refresh: (init_refresh_cw(), __toCommonJS(refresh_cw_exports)).default,
      pencil: (init_pencil(), __toCommonJS(pencil_exports)).default,
      trash: (init_trash_2(), __toCommonJS(trash_2_exports)).default,
      sort: (init_arrow_up_down(), __toCommonJS(arrow_up_down_exports)).default,
      image: (init_image(), __toCommonJS(image_exports)).default,
      clock: (init_clock(), __toCommonJS(clock_exports)).default,
      tag: (init_tag(), __toCommonJS(tag_exports)).default,
      stock: (init_package(), __toCommonJS(package_exports)).default,
      chart: (init_chart_column(), __toCommonJS(chart_column_exports)).default,
      list: (init_list(), __toCommonJS(list_exports)).default,
      settings: (init_settings(), __toCommonJS(settings_exports)).default,
      database: (init_database(), __toCommonJS(database_exports)).default,
      "code-2": (init_code_xml(), __toCommonJS(code_xml_exports)).default,
      download: (init_download(), __toCommonJS(download_exports)).default,
      empty: (init_package_open(), __toCommonJS(package_open_exports)).default,
      brand: (init_factory(), __toCommonJS(factory_exports)).default,
      unit: (init_ruler(), __toCommonJS(ruler_exports)).default,
      location: (init_map_pin(), __toCommonJS(map_pin_exports)).default,
      check: (init_check_square(), __toCommonJS(check_square_exports)).default,
      close: (init_x(), __toCommonJS(x_exports)).default,
      table: (init_table(), __toCommonJS(table_exports)).default,
      reset: (init_rotate_ccw(), __toCommonJS(rotate_ccw_exports)).default
    };
    function Icon3(props) {
      var size = props.name === "empty" && props.size === 48 ? 48 : [11, 14, 16].includes(props.size) ? props.size : 14;
      return React.createElement(ICONS[props.name] || ICONS.box, {
        size,
        strokeWidth: 2,
        "aria-hidden": true,
        focusable: false,
        className: "wbi-svg"
      });
    }
    module2.exports = { ICONS, Icon: Icon3 };
  }
});

// packages/addons/storage/client/ui/ui.cjs
var require_ui = __commonJS({
  "packages/addons/storage/client/ui/ui.cjs"(exports2, module2) {
    var React = require("react");
    var h2 = React.createElement;
    var Icon3 = require_icons().Icon;
    function call(api, name, args) {
      return api.call(name, args || {}).then(function(r) {
        if (!r || r.ok !== true) throw new Error(r && r.error || "\u8BF7\u6C42\u5931\u8D25");
        return r.result;
      });
    }
    function tr(lang, zh, en) {
      return lang === "en" ? en : zh;
    }
    function Button(props) {
      var attrs = Object.assign({ type: "button", className: "wbi-btn" }, props);
      delete attrs.icon;
      delete attrs.iconOnly;
      if (props.icon) {
        attrs["aria-label"] = props["aria-label"] || props.children;
        attrs.title = props.title || attrs["aria-label"];
        attrs.className += props.iconOnly ? " wbi-icon-only" : " wbi-icon-text";
      }
      return h2(
        "button",
        attrs,
        props.icon ? h2(Icon3, { name: props.icon }) : null,
        props.iconOnly ? null : props.icon ? h2("span", { className: "wbi-btn-label" }, props.children) : props.children
      );
    }
    function Skeleton(props) {
      var label = props.label || tr(props.lang, "\u8BFB\u53D6\u4E2D\u2026", "Loading\u2026");
      return h2(
        "div",
        { className: "wbi-root wbi-grid wbi-skeleton", role: "status", "aria-label": label, "aria-busy": true },
        h2("span", { className: "wbi-sr" }, label),
        [0, 1, 2].map(function(i) {
          return h2(
            "div",
            { key: i, className: "wbi-card wbi-skeleton-card", "aria-hidden": true },
            h2("div", { className: "wbi-sk" }),
            h2("div", { className: "wbi-sk" }),
            h2("div", { className: "wbi-sk" })
          );
        })
      );
    }
    function ErrorBox(props) {
      return props.error ? h2("div", { className: "wbi-error", role: "alert" }, String(props.error.message || props.error)) : null;
    }
    function safeImage(url) {
      try {
        var u = new URL(url);
        return /^(https?:)$/.test(u.protocol) && !u.username && !u.password ? u.href : "";
      } catch (_) {
        return "";
      }
    }
    function Modal(props) {
      var ref = React.useRef(null);
      React.useEffect(function() {
        var previous = document.activeElement;
        if (ref.current) ref.current.focus();
        return function() {
          if (previous && previous.isConnected) previous.focus();
        };
      }, []);
      function key(e) {
        if (e.key === "Escape") {
          e.preventDefault();
          e.stopPropagation();
          if (props.onClose) props.onClose();
          return;
        }
        if (e.key !== "Tab") return;
        var els = ref.current.querySelectorAll(
          "button:not(:disabled),input:not(:disabled),textarea:not(:disabled),select:not(:disabled),a[href]"
        );
        if (!els.length) {
          e.preventDefault();
          return;
        }
        var first = els[0], last = els[els.length - 1];
        if (e.shiftKey && (document.activeElement === first || document.activeElement === ref.current)) {
          e.preventDefault();
          last.focus();
        }
        if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
      return h2(
        "div",
        {
          className: "wbi-mask",
          onMouseDown: function(e) {
            if (e.target === e.currentTarget && props.onClose) props.onClose();
          }
        },
        h2(
          "section",
          {
            className: "wbi-modal",
            role: "dialog",
            "aria-modal": true,
            "aria-label": props.title,
            ref,
            tabIndex: -1,
            onKeyDown: key
          },
          h2(
            "header",
            { className: "wbi-row" },
            h2("h2", null, props.title),
            h2("span", { className: "wbi-grow" }),
            h2(Button, { icon: "close", iconOnly: true, onClick: props.onClose, disabled: !props.onClose, "aria-label": "\u5173\u95ED / Close" }, "\xD7")
          ),
          props.children
        )
      );
    }
    module2.exports = { Icon: Icon3, Skeleton, h: h2, call, tr, Button, ErrorBox, Modal, safeImage };
  }
});

// packages/addons/storage/client/views/stats.cjs
var require_stats = __commonJS({
  "packages/addons/storage/client/views/stats.cjs"(exports2, module2) {
    var React = require("react");
    var ui = require_ui();
    var h2 = ui.h;
    var tr = ui.tr;
    function Stats(props) {
      var data = React.useState(null), error = React.useState(null), tick = React.useState(0), busy = React.useState(false), lang = props.lang;
      React.useEffect(
        function() {
          var active = true;
          busy[1](true);
          error[1](null);
          ui.call(props.api, "storage.stats").then(function(r) {
            if (active) data[1](r);
          }).catch(function(e) {
            if (active) error[1](e);
          }).finally(function() {
            if (active) busy[1](false);
          });
          return function() {
            active = false;
          };
        },
        [props.api, tick[0]]
      );
      var s = data[0];
      return h2(
        "div",
        { className: "wbi-root" },
        h2(
          "div",
          { className: "wbi-row" },
          h2("h2", null, h2(ui.Icon, { name: "chart", size: 16 }), tr(lang, "\u7EDF\u8BA1", "Statistics")),
          h2("span", { className: "wbi-grow" }),
          h2(
            ui.Button,
            {
              icon: "refresh",
              disabled: busy[0],
              onClick: function() {
                tick[1](tick[0] + 1);
              }
            },
            tr(lang, "\u5237\u65B0", "Refresh")
          )
        ),
        h2(ui.ErrorBox, { error: error[0] }),
        busy[0] ? h2(ui.Skeleton, { lang }) : null,
        s ? h2(
          React.Fragment,
          null,
          h2(
            "div",
            { className: "wbi-kpis" },
            [
              ["total", "\u7269\u54C1\u8BB0\u5F55", "Items"],
              ["tagged", "\u5DF2\u5173\u8054\u6807\u7B7E", "Tagged"],
              ["withImages", "\u9644\u6709\u56FE\u7247", "With images"]
            ].map(function(k) {
              return h2(
                "div",
                { className: "wbi-card", key: k[0] },
                h2("span", { className: "wbi-muted wbi-inline" }, h2(ui.Icon, { name: k[0] === "total" ? "stock" : k[0] === "tagged" ? "tag" : "image" }), tr(lang, k[1], k[2])),
                h2("strong", null, s[k[0]] === null ? "\u2014" : s[k[0]])
              );
            })
          ),
          h2(
            "p",
            { className: "wbi-notice" },
            tr(
              lang,
              "\u5E93\u5B58\u4EE5\u6587\u5B57\u8BB0\u5F55\uFF0C\u4E0D\u5BF9\u4E0D\u540C\u5355\u4F4D\u6216\u8303\u56F4\u6570\u91CF\u8FDB\u884C\u6C42\u548C\u3002",
              "Stock is stored as text; mixed units and ranges are not summed."
            )
          ),
          h2(
            "div",
            { className: "wbi-card" },
            h2("h3", null, h2(ui.Icon, { name: "clock" }), tr(lang, "\u6700\u8FD1\u66F4\u65B0", "Recently updated")),
            (s.recent || []).map(function(item) {
              return h2(
                "div",
                { key: item.id, className: "wbi-row" },
                h2("span", null, item.name),
                h2("span", { className: "wbi-grow" }),
                h2("span", { className: "wbi-muted" }, (item.stock || "\u2014") + " " + (item.unit || ""))
              );
            }),
            !s.total ? h2(
              "span",
              { className: "wbi-empty" },
              h2(ui.Icon, { name: "empty", size: 48 }),
              tr(lang, "\u8FD8\u6CA1\u6709\u7269\u54C1\uFF0C\u524D\u5F80\u8BB0\u5F55\u9875\u6DFB\u52A0", "No items yet. Add one in Records.")
            ) : null
          )
        ) : null
      );
    }
    module2.exports = { Stats };
  }
});

// packages/addons/storage/client/modals/editor.cjs
var require_editor = __commonJS({
  "packages/addons/storage/client/modals/editor.cjs"(exports2, module2) {
    var React = require("react");
    var ui = require_ui();
    var h2 = ui.h;
    var tr = ui.tr;
    function Editor(props) {
      var item = props.item || {}, lang = props.lang;
      var state = React.useState(function() {
        return {
          name: item.name || "",
          brand: item.brand || "",
          unit: item.unit || "",
          stock: item.stock || "",
          location: item.location || "",
          remark: item.remark || "",
          images: (item.imgList || []).join("\n"),
          tagIds: (item.tagIds || (item.tags || []).map(function(t) {
            return t.id;
          })).slice()
        };
      });
      var form = state[0], setForm = state[1];
      var err = React.useState(null), busy = React.useState(false), query = React.useState(""), options = React.useState(item.tags || []);
      var selected = React.useState(item.tags || []);
      React.useEffect(
        function() {
          if (!props.tagsEnabled) return;
          var active = true;
          var timer = setTimeout(function() {
            ui.call(props.api, "storageTags.search", { text: query[0], pageSize: 50 }).then(function(r) {
              if (active) options[1](r.records || []);
            }).catch(function(e) {
              if (active) err[1](e);
            });
          }, 200);
          return function() {
            active = false;
            clearTimeout(timer);
          };
        },
        [query[0], props.tagsEnabled, props.api]
      );
      function update(k, v) {
        setForm(function(f) {
          return Object.assign({}, f, { [k]: v });
        });
      }
      function field(k, zh, en, wide, textarea) {
        return h2(
          "label",
          { className: "wbi-field" + (wide ? " wbi-wide" : "") },
          h2("span", null, tr(lang, zh, en)),
          h2(textarea ? "textarea" : "input", {
            name: k,
            value: form[k],
            required: k === "name",
            disabled: busy[0],
            onChange: function(e) {
              update(k, e.target.value);
            }
          })
        );
      }
      function save(e) {
        e.preventDefault();
        if (busy[0]) return;
        var images = form.images.split(/\r?\n/).map(function(s) {
          return s.trim();
        }).filter(Boolean);
        if (images.some(function(s) {
          return !ui.safeImage(s);
        })) {
          err[1](tr(lang, "\u56FE\u7247\u5730\u5740\u5FC5\u987B\u662F\u5B8C\u6574\u7684 HTTP(S) URL", "Images must use full HTTP(S) URLs"));
          return;
        }
        if (!form.name.trim()) {
          err[1](tr(lang, "\u8BF7\u586B\u5199\u7269\u54C1\u540D\u79F0", "Enter an item name"));
          return;
        }
        var args = {
          name: form.name.trim(),
          brand: form.brand,
          unit: form.unit,
          stock: form.stock,
          location: form.location,
          remark: form.remark,
          imgList: images
        };
        if (item.id) args.id = item.id;
        if (props.tagsEnabled) args.tagIds = form.tagIds;
        busy[1](true);
        err[1](null);
        ui.call(props.api, item.id ? "storage.update" : "storage.create", args).then(function() {
          props.onSaved();
        }).catch(err[1]).finally(function() {
          busy[1](false);
        });
      }
      var candidates = /* @__PURE__ */ new Map();
      selected[0].concat(options[0]).forEach(function(t) {
        candidates.set(t.id, t);
      });
      return h2(
        ui.Modal,
        {
          title: item.id ? tr(lang, "\u7F16\u8F91\u7269\u54C1", "Edit item") : tr(lang, "\u65B0\u589E\u7269\u54C1", "New item"),
          onClose: busy[0] ? null : props.onClose
        },
        h2(ui.ErrorBox, { error: err[0] }),
        h2(
          "form",
          { onSubmit: save },
          h2(
            "div",
            { className: "wbi-form" },
            field("name", "\u540D\u79F0 *", "Name *", true),
            field("brand", "\u54C1\u724C", "Brand"),
            field("unit", "\u5355\u4F4D", "Unit"),
            field("stock", "\u5E93\u5B58\uFF08\u53EF\u586B\u5199 1~2 \u7B49\u6587\u5B57\uFF09", "Stock (text such as 1\u20132)", true),
            field("location", "\u5B58\u653E\u4F4D\u7F6E", "Location"),
            field("remark", "\u5907\u6CE8", "Notes", true, true),
            field("images", "\u56FE\u7247 URL\uFF08\u6BCF\u884C\u4E00\u4E2A\uFF09", "Image URLs (one per line)", true, true),
            h2(
              "div",
              { className: "wbi-field wbi-wide" },
              h2("span", null, tr(lang, "\u6807\u7B7E", "Tags")),
              props.tagsEnabled ? h2(
                React.Fragment,
                null,
                h2("input", {
                  type: "search",
                  placeholder: tr(lang, "\u641C\u7D22\u5DF2\u6709\u6807\u7B7E", "Search existing tags"),
                  "aria-label": tr(lang, "\u641C\u7D22\u5DF2\u6709\u6807\u7B7E", "Search existing tags"),
                  value: query[0],
                  disabled: busy[0],
                  onChange: function(e) {
                    query[1](e.target.value);
                  }
                }),
                h2(
                  "div",
                  { className: "wbi-tagoptions" },
                  Array.from(candidates.values()).map(function(t) {
                    return h2(
                      "label",
                      { key: t.id },
                      h2("input", {
                        type: "checkbox",
                        checked: form.tagIds.includes(t.id),
                        disabled: busy[0],
                        onChange: function(e) {
                          var checked = e.target.checked;
                          update(
                            "tagIds",
                            checked ? form.tagIds.concat(t.id) : form.tagIds.filter(function(id) {
                              return id !== t.id;
                            })
                          );
                          selected[1](function(tags) {
                            return checked ? tags.filter(function(x) {
                              return x.id !== t.id;
                            }).concat(t) : tags.filter(function(x) {
                              return x.id !== t.id;
                            });
                          });
                        }
                      }),
                      t.name
                    );
                  })
                ),
                !candidates.size ? h2(
                  "span",
                  { className: "wbi-muted" },
                  tr(lang, "\u6682\u65E0\u6807\u7B7E\uFF0C\u53EF\u5728\u6807\u7B7E\u63D2\u4EF6\u4E2D\u521B\u5EFA", "No tags. Create them in the Tags plugin.")
                ) : null
              ) : h2(
                "span",
                { className: "wbi-muted" },
                tr(lang, "\u6807\u7B7E\u63D2\u4EF6\u4E0D\u53EF\u7528\uFF0C\u4FDD\u5B58\u65F6\u4FDD\u7559\u539F\u6709\u5173\u8054", "Tags unavailable; existing links are preserved.")
              )
            )
          ),
          h2(
            "div",
            { className: "wbi-formfoot" },
            h2(ui.Button, { onClick: props.onClose, disabled: busy[0] }, tr(lang, "\u53D6\u6D88", "Cancel")),
            h2(
              ui.Button,
              { type: "submit", disabled: busy[0], className: "wbi-btn wbi-primary" },
              busy[0] ? tr(lang, "\u4FDD\u5B58\u4E2D\u2026", "Saving\u2026") : tr(lang, "\u4FDD\u5B58", "Save")
            )
          )
        )
      );
    }
    module2.exports = { Editor };
  }
});

// packages/addons/storage/client/item/card.cjs
var require_card = __commonJS({
  "packages/addons/storage/client/item/card.cjs"(exports2, module2) {
    var React = require("react");
    var ui = require_ui();
    var h2 = ui.h;
    var tr = ui.tr;
    var Description = require_description().Description;
    function StorageCard(props) {
      var item = props.item, lang = props.lang, gallery = React.useState(false);
      var images = (item.imgList || []).filter(ui.safeImage), tags = item.tags || [];
      var shown = gallery[0] ? images : images.slice(0, 1);
      var hasStock = item.stock != null && item.stock !== "";
      var meta = [
        item.brand && tr(lang, "\u54C1\u724C\uFF1A", "Brand: ") + item.brand,
        item.unit && tr(lang, "\u5355\u4F4D\uFF1A", "Unit: ") + item.unit,
        item.location && tr(lang, "\u4F4D\u7F6E\uFF1A", "Location: ") + item.location
      ].filter(Boolean);
      return h2(
        "article",
        {
          className: "wbi-card" + (props.selectionMode ? " wbi-selectable" : "") + (props.checked ? " wbi-selected" : ""),
          onClickCapture: props.selectionMode ? function(e) {
            if (e.target.type === "checkbox") return;
            e.preventDefault();
            e.stopPropagation();
            if (!props.busy) props.onCheck(item.id, e.shiftKey);
          } : void 0
        },
        props.selectionMode ? h2("input", {
          type: "checkbox",
          className: "wbi-check",
          checked: !!props.checked,
          disabled: props.busy,
          "aria-label": tr(lang, "\u9009\u62E9 ", "Select ") + item.name,
          onClick: function(e) {
            e.stopPropagation();
            props.onCheck(item.id, e.shiftKey);
          },
          onChange: function() {
          }
        }) : null,
        h2(
          "div",
          { className: "wbi-cardhead" },
          h2("h3", null, item.name),
          h2(
            "span",
            { className: "wbi-stock" },
            h2(ui.Icon, { name: "stock", size: 16 }),
            h2("span", null, hasStock ? item.stock : "\u2014"),
            hasStock && item.unit ? h2("small", { className: "wbi-muted" }, item.unit) : null
          )
        ),
        tags.length ? h2("div", { className: "wbi-tags" }, tags.map(function(t) {
          return h2(ui.Button, {
            icon: "tag",
            key: t.id,
            className: "wbi-btn wbi-chip",
            disabled: !props.caps,
            title: tr(lang, "\u6309\u6B64\u6807\u7B7E\u7B5B\u9009", "Filter by this tag"),
            onClick: function() {
              props.onTag(t);
            }
          }, t.name);
        })) : null,
        meta.length || item.createTime || item.updateTime ? h2(
          "div",
          { className: "wbi-metazone" },
          meta.length ? h2(
            "div",
            { className: "wbi-muted" },
            item.brand ? h2("span", { className: "wbi-inline" }, h2(ui.Icon, { name: "brand", size: 11 }), meta[0]) : null,
            item.unit ? h2("span", { className: "wbi-inline" }, h2(ui.Icon, { name: "unit", size: 11 }), tr(lang, "\u5355\u4F4D\uFF1A", "Unit: ") + item.unit) : null,
            item.location ? h2("span", { className: "wbi-inline" }, h2(ui.Icon, { name: "location", size: 11 }), tr(lang, "\u4F4D\u7F6E\uFF1A", "Location: ") + item.location) : null
          ) : null,
          item.createTime || item.updateTime ? h2(
            "div",
            { className: "wbi-meta" },
            item.createTime ? h2("span", null, tr(lang, "\u521B\u5EFA ", "Created ") + props.date(item.createTime)) : null,
            item.updateTime ? h2("span", null, tr(lang, "\u66F4\u65B0 ", "Updated ") + props.date(item.updateTime)) : null
          ) : null
        ) : null,
        h2(Description, { text: item.remark, lang, bodyMode: props.bodyMode }),
        images.length ? h2("div", { className: "wbi-images" }, shown.map(function(url, i) {
          return h2(
            "button",
            {
              key: i,
              type: "button",
              className: "wbi-image",
              "aria-label": tr(lang, "\u9884\u89C8\u56FE\u7247 ", "Preview image ") + (i + 1),
              title: tr(lang, "\u9884\u89C8\u56FE\u7247 ", "Preview image ") + (i + 1),
              onClick: function() {
                props.onPreview({ url, name: item.name });
              }
            },
            h2(ui.Icon, { name: "image" }),
            h2("img", { src: url, alt: item.name + " " + (i + 1), loading: "lazy", referrerPolicy: "no-referrer" })
          );
        }), images.length > 1 ? h2(ui.Button, {
          className: "wbi-btn wbi-btn-sm wbi-ghost wbi-more",
          "aria-expanded": gallery[0],
          "aria-label": tr(lang, "\u5C55\u5F00\u6216\u6536\u8D77\u7269\u54C1\u56FE\u7247", "Expand or collapse item images"),
          onClick: function() {
            gallery[1](!gallery[0]);
          }
        }, gallery[0] ? tr(lang, "\u6536\u8D77", "Collapse") : "+" + (images.length - 1)) : null) : null,
        !props.selectionMode ? h2(
          "div",
          { className: "wbi-actions" },
          h2(ui.Button, {
            icon: "pencil",
            iconOnly: true,
            "aria-label": tr(lang, "\u7F16\u8F91 ", "Edit ") + item.name,
            className: "wbi-btn wbi-btn-sm wbi-ghost",
            disabled: props.busy,
            onClick: function() {
              props.onEdit(item);
            }
          }, tr(lang, "\u7F16\u8F91", "Edit")),
          h2(ui.Button, {
            icon: "trash",
            iconOnly: true,
            "aria-label": tr(lang, "\u5220\u9664 ", "Delete ") + item.name,
            className: "wbi-btn wbi-btn-sm wbi-ghost wbi-danger",
            disabled: props.busy,
            onClick: function() {
              props.onDelete(item);
            }
          }, tr(lang, "\u5220\u9664", "Delete"))
        ) : null
      );
    }
    module2.exports = { StorageCard };
  }
});

// packages/addons/storage/client/ui/selection.cjs
var require_selection = __commonJS({
  "packages/addons/storage/client/ui/selection.cjs"(exports2, module2) {
    var React = require("react");
    var ui = require_ui();
    var h2 = ui.h;
    var tr = ui.tr;
    function useSelection(scope, rows, blocked) {
      var mode = React.useState(false), state = React.useState({ scope, ids: [] }), anchor = React.useRef(null);
      var ids = state[0].scope === scope ? state[0].ids : [];
      function set(next) {
        state[1]({ scope, ids: next });
      }
      function exit() {
        mode[1](false);
        set([]);
        anchor.current = null;
      }
      React.useEffect(function() {
        set([]);
        anchor.current = null;
      }, [scope]);
      React.useEffect(function() {
        function key(e) {
          if (e.key === "Escape" && !e.defaultPrevented && !blocked) exit();
        }
        document.addEventListener("keydown", key);
        return function() {
          document.removeEventListener("keydown", key);
        };
      }, [scope, blocked]);
      return {
        mode: mode[0],
        ids,
        exit,
        enter: function() {
          set([]);
          anchor.current = null;
          mode[1](true);
        },
        all: function() {
          if (!blocked) set(rows.map(function(r) {
            return r.id;
          }));
        },
        toggle: function(id, shift) {
          if (blocked) return;
          var next = new Set(ids), add = !next.has(id), range = [id];
          if (shift && anchor.current && anchor.current.scope === scope) {
            var a = rows.findIndex(function(r) {
              return r.id === anchor.current.id;
            });
            var b = rows.findIndex(function(r) {
              return r.id === id;
            });
            if (a >= 0 && b >= 0) range = rows.slice(Math.min(a, b), Math.max(a, b) + 1).map(function(r) {
              return r.id;
            });
          }
          range.forEach(function(v) {
            if (add) next.add(v);
            else next.delete(v);
          });
          anchor.current = { scope, id };
          set(Array.from(next));
        }
      };
    }
    function SelectionBar(p) {
      return h2(
        "div",
        { className: "wbi-selbar", role: "toolbar", "aria-label": tr(p.lang, "\u6279\u91CF\u64CD\u4F5C", "Bulk actions") },
        h2("span", { role: "status" }, tr(p.lang, "\u5DF2\u9009 ", "Selected ") + p.selection.ids.length),
        h2(ui.Button, { className: "wbi-btn wbi-btn-sm", disabled: p.busy || p.loading, onClick: p.selection.all }, tr(p.lang, "\u5168\u9009\u672C\u9875", "Select page")),
        h2(ui.Button, { className: "wbi-btn wbi-btn-sm", disabled: p.busy, onClick: p.selection.exit }, tr(p.lang, "\u9000\u51FA", "Exit")),
        h2("div", { className: "wbi-bulk-actions" }, p.children)
      );
    }
    function DeleteConfirmation(p) {
      return h2(
        ui.Modal,
        { title: tr(p.lang, "\u6279\u91CF\u5220\u9664\u7269\u54C1", "Delete selected items"), onClose: p.busy ? null : p.onClose },
        h2(ui.ErrorBox, { error: p.error }),
        h2("p", null, tr(p.lang, "\u5C06\u8F6F\u5220\u9664\u4EE5\u4E0B\u7269\u54C1\u3002\u5171 ", "Soft-delete these items. Total: ") + p.items.length + tr(p.lang, " \u6761", " items")),
        h2("ul", null, p.items.slice(0, 10).map(function(item) {
          return h2("li", { key: item.id }, item.name);
        })),
        p.items.length > 10 ? h2("p", null, tr(p.lang, "\u4EC5\u5C55\u793A\u524D 10 \u6761", "Showing first 10 items")) : null,
        h2("p", { className: "wbi-muted" }, tr(p.lang, "\u6807\u7B7E\u53EF\u7528\u65F6\u540C\u65F6\u79FB\u9664\u5173\u8054\uFF0C\u4E0D\u53EF\u7528\u65F6\u4FDD\u7559\u3002", "Tag links are removed when tags are available, otherwise preserved.")),
        h2(
          "div",
          { className: "wbi-formfoot" },
          h2(ui.Button, { className: "wbi-btn wbi-btn-sm", disabled: p.busy, onClick: p.onClose }, tr(p.lang, "\u53D6\u6D88", "Cancel")),
          h2(ui.Button, { className: "wbi-btn wbi-btn-sm wbi-danger", disabled: p.busy, onClick: p.onConfirm }, p.busy ? tr(p.lang, "\u5220\u9664\u4E2D\u2026", "Deleting\u2026") : tr(p.lang, "\u786E\u8BA4\u5220\u9664", "Confirm delete"))
        )
      );
    }
    module2.exports = { useSelection, SelectionBar, DeleteConfirmation };
  }
});

// packages/addons/storage/client/views/records.cjs
var require_records = __commonJS({
  "packages/addons/storage/client/views/records.cjs"(exports2, module2) {
    var React = require("react");
    var ui = require_ui();
    var Editor = require_editor().Editor;
    var h2 = ui.h;
    var tr = ui.tr;
    var StorageCard = require_card().StorageCard;
    var selection = require_selection();
    function Records(props) {
      var api = props.api, lang = props.lang;
      var items = React.useState(null), error = React.useState(null), loading = React.useState(true), query = React.useState(""), text = React.useState(""), page = React.useState(1), size = React.useState(12), sort = React.useState("update_time"), order = React.useState("desc"), tick = React.useState(0), editing = React.useState(null), deleting = React.useState(null), preview = React.useState(null), busy = React.useState(false), caps = React.useState(false), ready = React.useState(false), confirmDelete = React.useState(true), tag = React.useState(null), bulk = React.useState(null), bulkError = React.useState(null), notice = React.useState(""), pending = React.useRef(false), bodyMode = React.useState("markdown");
      var scope = JSON.stringify([query[0], text[0], page[0], size[0], sort[0], order[0], tag[0] && tag[0].id, tick[0]]);
      var rows = items[0] && items[0].scope === scope ? items[0].records : [];
      var selected = selection.useSelection(scope, rows, busy[0] || !!bulk[0]);
      function deleteSelected() {
        if (pending.current || !bulk[0] || !bulk[0].length) return;
        pending.current = true;
        busy[1](true);
        bulkError[1](null);
        ui.call(api, "storage.bulkDelete", { ids: bulk[0].map(function(r) {
          return r.id;
        }) }).then(function(r) {
          bulk[1](null);
          selected.exit();
          notice[1](tr(lang, "\u5DF2\u5220\u9664 ", "Deleted ") + r.deleted + tr(lang, " \u6761\uFF0C\u8DF3\u8FC7 ", " items; skipped ") + r.skipped);
          refresh();
        }).catch(bulkError[1]).finally(function() {
          pending.current = false;
          busy[1](false);
        });
      }
      React.useEffect(
        function() {
          var active = true;
          Promise.all([ui.call(api, "storage.configGet"), ui.call(api, "storage.capabilities")]).then(function(r) {
            if (!active) return;
            var v = r[0].values || {};
            size[1](v["list.pageSize"] || 12);
            sort[1](v["list.sortColumn"] || "update_time");
            order[1](v["list.sortOrder"] || "desc");
            confirmDelete[1](v["ui.confirmDelete"] !== false);
            caps[1](!!r[1].tags);
            bodyMode[1](v["ui.bodyMode"] === "text" ? "text" : "markdown");
          }).catch(function(e) {
            if (active) error[1](e);
          }).finally(function() {
            if (active) ready[1](true);
          });
          return function() {
            active = false;
          };
        },
        [api]
      );
      React.useEffect(
        function() {
          var t = setTimeout(function() {
            text[1](query[0]);
            page[1](1);
          }, 250);
          return function() {
            clearTimeout(t);
          };
        },
        [query[0]]
      );
      React.useEffect(
        function() {
          if (!ready[0] || query[0] !== text[0]) return;
          var active = true;
          loading[1](true);
          error[1](null);
          var args = { text: text[0], pageNumber: page[0], pageSize: size[0], sortColumn: sort[0], sortOrder: order[0] };
          if (tag[0]) args.tagIds = [tag[0].id];
          ui.call(api, "storage.list", args).then(function(r) {
            if (!active) return;
            if (page[0] > Math.max(1, r.pages || 1)) {
              page[1](Math.max(1, r.pages || 1));
              return;
            }
            items[1](Object.assign({}, r, { scope }));
          }).catch(function(e) {
            if (active) error[1](e);
          }).finally(function() {
            if (active) loading[1](false);
          });
          return function() {
            active = false;
          };
        },
        [api, ready[0], scope]
      );
      function refresh() {
        tick[1](function(n) {
          return n + 1;
        });
      }
      function remove(item) {
        busy[1](true);
        ui.call(api, "storage.delete", { id: item.id }).then(function() {
          deleting[1](null);
          refresh();
        }).catch(error[1]).finally(function() {
          busy[1](false);
        });
      }
      function date(v) {
        return v ? String(v).replace("T", " ").slice(0, 19) : "\u2014";
      }
      var data = items[0], pages = Math.max(1, data && data.pages || 1);
      return h2(
        "div",
        { className: "wbi-root" },
        h2(
          "div",
          { className: "wbi-row" },
          h2("h2", null, h2(ui.Icon, { name: "box", size: 16 }), tr(lang, "\u50A8\u7269", "Storage")),
          h2("span", { className: "wbi-muted" }, tr(lang, "\u8BB0\u5F55\u7269\u54C1\u3001\u5E93\u5B58\u4E0E\u5B58\u653E\u5907\u6CE8", "Track items, stock and notes")),
          h2("span", { className: "wbi-grow" }),
          h2(ui.Button, {
            icon: "check",
            className: "wbi-btn wbi-btn-sm",
            disabled: busy[0] || !!bulk[0],
            onClick: selected.mode ? selected.exit : selected.enter
          }, selected.mode ? tr(lang, "\u53D6\u6D88\u9009\u62E9", "Cancel selection") : tr(lang, "\u9009\u62E9", "Select")),
          h2(
            ui.Button,
            {
              icon: "plus",
              className: "wbi-btn wbi-primary",
              disabled: selected.mode || busy[0],
              onClick: function() {
                editing[1]({});
              }
            },
            tr(lang, "\u65B0\u589E\u7269\u54C1", "New item")
          )
        ),
        h2(
          "div",
          { className: "wbi-toolbar" },
          h2("input", {
            type: "search",
            value: query[0],
            placeholder: tr(lang, "\u641C\u7D22\u540D\u79F0\u3001\u54C1\u724C\u3001\u4F4D\u7F6E\u6216\u5907\u6CE8", "Search name, brand, location or notes"),
            "aria-label": tr(lang, "\u641C\u7D22\u7269\u54C1", "Search inventory"),
            onChange: function(e) {
              query[1](e.target.value);
            }
          }),
          h2(
            "select",
            {
              "aria-label": tr(lang, "\u6392\u5E8F\u5B57\u6BB5", "Sort field"),
              value: sort[0],
              onChange: function(e) {
                sort[1](e.target.value);
                page[1](1);
              }
            },
            [
              ["update_time", "\u6700\u8FD1\u66F4\u65B0", "Updated"],
              ["create_time", "\u521B\u5EFA\u65F6\u95F4", "Created"],
              ["name", "\u540D\u79F0", "Name"],
              ["brand", "\u54C1\u724C", "Brand"],
              ["stock", "\u5E93\u5B58\u6587\u672C", "Stock text"],
              ["location", "\u4F4D\u7F6E", "Location"]
            ].map(function(o) {
              return h2("option", { key: o[0], value: o[0] }, tr(lang, o[1], o[2]));
            })
          ),
          h2(
            ui.Button,
            {
              icon: "sort",
              onClick: function() {
                order[1](order[0] === "desc" ? "asc" : "desc");
                page[1](1);
              }
            },
            order[0] === "desc" ? tr(lang, "\u964D\u5E8F \u2193", "Descending \u2193") : tr(lang, "\u5347\u5E8F \u2191", "Ascending \u2191")
          ),
          h2(ui.Button, { icon: "refresh", onClick: refresh, disabled: loading[0] }, tr(lang, "\u5237\u65B0", "Refresh"))
        ),
        tag[0] ? h2(
          "div",
          { className: "wbi-row" },
          h2("span", { className: "wbi-chip" }, tag[0].name),
          h2(
            ui.Button,
            {
              onClick: function() {
                tag[1](null);
                page[1](1);
              }
            },
            tr(lang, "\u6E05\u9664\u6807\u7B7E\u7B5B\u9009", "Clear tag filter")
          )
        ) : null,
        selected.mode ? h2("p", { className: "wbi-muted" }, tr(
          lang,
          "\u4EC5\u9009\u62E9\u5F53\u524D\u9875\uFF1B\u641C\u7D22\u3001\u7B5B\u9009\u3001\u6392\u5E8F\u3001\u7FFB\u9875\u6216\u5237\u65B0\u4F1A\u6E05\u7A7A\u9009\u62E9\u3002Shift+\u70B9\u51FB\u8FDE\u9009\uFF0CEsc\u9000\u51FA\u3002",
          "Current page only. Search, filters, sorting, paging or refresh clear selection. Shift-click selects a range; Esc exits."
        )) : null,
        notice[0] ? h2("p", { role: "status" }, notice[0]) : null,
        h2(ui.ErrorBox, { error: error[0] }),
        loading[0] ? h2(ui.Skeleton, { lang }) : null,
        !loading[0] && !error[0] && data && !data.records.length ? h2(
          "div",
          { className: "wbi-empty" },
          h2(ui.Icon, { name: "empty", size: 48 }),
          text[0] || tag[0] ? tr(lang, "\u6CA1\u6709\u5339\u914D\u7684\u7269\u54C1\uFF0C\u8BD5\u8BD5\u5176\u4ED6\u641C\u7D22\u6761\u4EF6", "No matching items. Try another filter.") : tr(lang, "\u8FD8\u6CA1\u6709\u7269\u54C1\uFF0C\u70B9\u51FB\u201C\u65B0\u589E\u7269\u54C1\u201D\u5F00\u59CB\u8BB0\u5F55", "No items yet. Add your first item.")
        ) : null,
        h2(
          "div",
          { className: "wbi-grid", "aria-busy": loading[0] },
          !loading[0] && !error[0] && data ? rows.map(function(item) {
            return h2(StorageCard, {
              key: item.id,
              item,
              lang,
              bodyMode: bodyMode[0],
              caps: caps[0],
              busy: busy[0] || !!bulk[0],
              date,
              selectionMode: selected.mode,
              checked: selected.ids.includes(item.id),
              onCheck: selected.toggle,
              onTag: function(t) {
                tag[1](t);
                page[1](1);
              },
              onPreview: preview[1],
              onEdit: editing[1],
              onDelete: function(v) {
                if (confirmDelete[0]) deleting[1](v);
                else remove(v);
              }
            });
          }) : null
        ),
        data ? h2(
          "div",
          { className: "wbi-pager" },
          h2(
            "span",
            { className: "wbi-muted" },
            data.total + tr(lang, " \u6761\u7269\u54C1 \xB7 ", " items \xB7 ") + page[0] + " / " + pages
          ),
          h2(
            ui.Button,
            {
              disabled: page[0] <= 1 || loading[0],
              onClick: function() {
                page[1](page[0] - 1);
              }
            },
            tr(lang, "\u4E0A\u4E00\u9875", "Previous")
          ),
          h2(
            ui.Button,
            {
              disabled: page[0] >= pages || loading[0],
              onClick: function() {
                page[1](page[0] + 1);
              }
            },
            tr(lang, "\u4E0B\u4E00\u9875", "Next")
          ),
          h2(
            "select",
            {
              "aria-label": tr(lang, "\u6BCF\u9875\u6761\u6570", "Page size"),
              value: size[0],
              onChange: function(e) {
                size[1](Number(e.target.value));
                page[1](1);
              }
            },
            Array.from(/* @__PURE__ */ new Set([4, 12, 24, 50, size[0]])).sort(function(a, b) {
              return a - b;
            }).map(function(n) {
              return h2("option", { key: n, value: n }, n + tr(lang, " / \u9875", " / page"));
            })
          )
        ) : null,
        selected.mode ? h2(
          selection.SelectionBar,
          { selection: selected, lang, busy: busy[0] || !!bulk[0], loading: loading[0] },
          h2(ui.Button, {
            className: "wbi-btn wbi-btn-sm wbi-danger",
            disabled: !selected.ids.length || loading[0] || busy[0] || !!bulk[0],
            onClick: function() {
              bulkError[1](null);
              bulk[1](rows.filter(function(r) {
                return selected.ids.includes(r.id);
              }).map(function(r) {
                return { id: r.id, name: r.name };
              }));
            }
          }, tr(lang, "\u5220\u9664", "Delete"))
        ) : null,
        bulk[0] ? h2(selection.DeleteConfirmation, {
          items: bulk[0],
          lang,
          busy: busy[0],
          error: bulkError[0],
          onClose: function() {
            bulk[1](null);
          },
          onConfirm: deleteSelected
        }) : null,
        editing[0] ? h2(Editor, {
          api,
          lang,
          item: editing[0],
          tagsEnabled: caps[0],
          onClose: function() {
            editing[1](null);
          },
          onSaved: function() {
            editing[1](null);
            refresh();
          }
        }) : null,
        deleting[0] ? h2(
          ui.Modal,
          {
            title: tr(lang, "\u5220\u9664\u7269\u54C1", "Delete item"),
            onClose: busy[0] ? null : function() {
              deleting[1](null);
            }
          },
          h2(ui.ErrorBox, { error: error[0] }),
          h2(
            "p",
            null,
            tr(lang, "\u786E\u8BA4\u5220\u9664\u300C", "Delete \u201C") + deleting[0].name + tr(lang, "\u300D\uFF1F\u5C06\u8F6F\u5220\u9664\u8BB0\u5F55\u5E76\u79FB\u9664\u6807\u7B7E\u5173\u8054\u3002", "\u201D? This soft-deletes the record and removes tag links.")
          ),
          h2(
            "div",
            { className: "wbi-formfoot" },
            h2(
              ui.Button,
              {
                disabled: busy[0],
                onClick: function() {
                  deleting[1](null);
                }
              },
              tr(lang, "\u53D6\u6D88", "Cancel")
            ),
            h2(
              ui.Button,
              {
                disabled: busy[0],
                className: "wbi-btn wbi-danger",
                onClick: function() {
                  remove(deleting[0]);
                }
              },
              busy[0] ? tr(lang, "\u5220\u9664\u4E2D\u2026", "Deleting\u2026") : tr(lang, "\u786E\u8BA4\u5220\u9664", "Confirm delete")
            )
          )
        ) : null,
        preview[0] ? h2(
          ui.Modal,
          {
            title: preview[0].name,
            onClose: function() {
              preview[1](null);
            }
          },
          h2("img", {
            className: "wbi-preview",
            src: preview[0].url,
            alt: preview[0].name,
            referrerPolicy: "no-referrer"
          }),
          h2(
            "a",
            { href: preview[0].url, target: "_blank", rel: "noopener noreferrer" },
            tr(lang, "\u6253\u5F00\u539F\u56FE", "Open original")
          )
        ) : null
      );
    }
    module2.exports = { Records, StorageCard };
  }
});

// packages/addons/storage/client/ui/config-copy.cjs
var require_config_copy = __commonJS({
  "packages/addons/storage/client/ui/config-copy.cjs"(exports2, module2) {
    var COPY = {
      zh: {
        title: "\u914D\u7F6E",
        note: "\u8FD9\u4E9B\u504F\u597D\u53EA\u4FDD\u5B58\u5728\u672C\u673A\uFF0C\u4E0D\u53C2\u4E0E\u4E91\u7AEF\u540C\u6B65",
        loading: "\u8BFB\u53D6\u914D\u7F6E\u4E2D\u2026",
        loadFail: "\u914D\u7F6E\u670D\u52A1\u672A\u5C31\u7EEA\uFF08\u63D2\u4EF6\u7248\u672C\u8FC7\u65E7\uFF1F\uFF09",
        retry: "\u91CD\u8BD5",
        saveFail: "\u4FDD\u5B58\u5931\u8D25\uFF1A",
        saved: "\u5DF2\u4FDD\u5B58",
        saving: "\u4FDD\u5B58\u4E2D\u2026",
        reset: "\u6062\u590D\u9ED8\u8BA4",
        resetAll: "\u5168\u90E8\u6062\u590D\u9ED8\u8BA4",
        resetting: "\u6062\u590D\u4E2D\u2026",
        modified: "\u5DF2\u4FEE\u6539",
        defaultValue: "\u9ED8\u8BA4",
        allDefault: "\u5168\u90E8\u4F7F\u7528\u9ED8\u8BA4\u503C",
        on: "\u5F00",
        off: "\u5173",
        empty: "\u6CA1\u6709\u53EF\u914D\u7F6E\u9879",
        confirmResetAll: "\u786E\u5B9A\u628A\u5168\u90E8\u914D\u7F6E\u6062\u590D\u9ED8\u8BA4\u503C\uFF1F",
        min: "\u6700\u5C0F",
        max: "\u6700\u5927"
      },
      en: {
        title: "Config",
        note: "Preferences stay on this machine; they are not synced to the cloud",
        loading: "Loading config\u2026",
        loadFail: "Config service not ready (plugin too old?)",
        retry: "Retry",
        saveFail: "Save failed: ",
        saved: "Saved",
        saving: "Saving\u2026",
        reset: "Reset",
        resetAll: "Reset all",
        resetting: "Resetting\u2026",
        modified: "Modified",
        defaultValue: "Default",
        allDefault: "All defaults",
        on: "On",
        off: "Off",
        empty: "Nothing to configure",
        confirmResetAll: "Reset every setting to its default?",
        min: "Min",
        max: "Max"
      }
    };
    module2.exports = COPY;
  }
});

// packages/addons/storage/client/views/config.cjs
var require_config = __commonJS({
  "packages/addons/storage/client/views/config.cjs"(exports2, module2) {
    var React = require("react");
    var h2 = React.createElement;
    var ui = require_ui();
    var DOMAIN = "storage";
    var PREFIX = "wbi";
    var COPY = require_config_copy();
    var CSS = [
      ".__P__-cfg{--cfg-line:var(--wb-line,var(--dsw-alias-border-l2,color-mix(in oklab,currentColor 16%,transparent)));--cfg-surface:var(--wb-surface,var(--dsw-alias-bg-layer-1,transparent));--cfg-muted:var(--dsw-alias-label-secondary,color-mix(in oklab,currentColor 62%,transparent));--cfg-faint:var(--dsw-alias-label-tertiary,color-mix(in oklab,currentColor 42%,transparent));--cfg-hover:var(--dsw-alias-interactive-bg-hover,color-mix(in oklab,currentColor 5%,transparent));display:flex;flex-direction:column;gap:16px;width:100%;min-width:0;padding-bottom:6px;color:inherit;font-size:13.5px}",
      ".__P__-cfg-head{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;flex-wrap:wrap}",
      ".__P__-cfg-headmain{min-width:0}",
      ".__P__-cfg-head h2{margin:0;font-size:17px;font-weight:660;letter-spacing:.1px}",
      ".__P__-cfg-note{font-size:12px;color:var(--cfg-muted);margin-top:5px;line-height:1.6}",
      ".__P__-cfg-status{display:inline-flex;align-items:center;gap:7px;padding:5px 11px;border:1px solid var(--cfg-line);border-radius:999px;background:var(--cfg-surface);font-size:11.5px;color:var(--cfg-muted);max-width:100%;line-height:1.4}",
      ".__P__-cfg-status::before{content:'';width:6px;height:6px;border-radius:50%;background:var(--dsw-alias-state-success-primary,currentColor);flex:none}",
      ".__P__-cfg-status.err{color:var(--dsw-alias-state-error-primary,inherit);border-color:color-mix(in oklab,var(--dsw-alias-state-error-primary,currentColor) 35%,var(--cfg-line))}",
      ".__P__-cfg-status.err::before{background:var(--dsw-alias-state-error-primary,currentColor)}",
      ".__P__-cfg-group{border:1px solid var(--cfg-line);border-radius:14px;background:var(--cfg-surface);overflow:hidden;box-shadow:0 1px 2px color-mix(in oklab,currentColor 3%,transparent)}",
      ".__P__-cfg-gtitle{display:flex;align-items:center;gap:8px;padding:12px 18px;background:color-mix(in oklab,currentColor 3%,transparent);border-bottom:1px solid var(--cfg-line);font-size:12.5px;font-weight:660;letter-spacing:.1px}",
      ".__P__-cfg-gcount{margin-left:auto;font-size:11px;font-weight:500;color:var(--cfg-muted);font-variant-numeric:tabular-nums}",
      ".__P__-cfg-row{display:grid;grid-template-columns:minmax(0,1fr) minmax(200px,300px);gap:28px;align-items:center;padding:15px 18px;border-top:1px solid color-mix(in oklab,currentColor 7%,transparent);transition:background .12s ease}",
      ".__P__-cfg-gtitle+.__P__-cfg-row{border-top:none}",
      ".__P__-cfg-row:hover{background:var(--cfg-hover)}",
      ".__P__-cfg-label{min-width:0}",
      ".__P__-cfg-name{display:flex;align-items:center;gap:8px;font-size:13.5px;font-weight:600;line-height:1.4;flex-wrap:wrap}",
      ".__P__-cfg-hint{font-size:12px;color:var(--cfg-muted);line-height:1.55;margin-top:4px}",
      ".__P__-cfg-id{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11px;color:var(--cfg-muted);margin-top:5px;letter-spacing:.2px;word-break:break-all}",
      ".__P__-cfg-control{display:flex;align-items:center;justify-content:flex-end;gap:8px;min-width:0;flex-wrap:wrap}",
      ".__P__-cfg-select,.__P__-cfg-input{border:1px solid var(--cfg-line);background:var(--dsw-alias-bg-base,transparent);color:inherit;border-radius:9px;padding:7px 11px;font:inherit;font-size:13px;line-height:1.4;outline:none;min-width:132px;max-width:100%;transition:border-color .15s ease,box-shadow .15s ease}",
      ".__P__-cfg-select:hover,.__P__-cfg-input:hover{border-color:color-mix(in oklab,currentColor 28%,var(--cfg-line))}",
      ".__P__-cfg-select:focus,.__P__-cfg-input:focus{border-color:var(--dsw-alias-brand-primary,currentColor);box-shadow:0 0 0 3px color-mix(in oklab,var(--dsw-alias-brand-primary,currentColor) 14%,transparent)}",
      ".__P__-cfg-select{min-width:152px;padding-right:10px}",
      ".__P__-cfg-input{width:132px}",
      ".__P__-cfg-switch{position:relative;display:inline-flex;align-items:center;gap:9px;cursor:pointer;font-size:12.5px;color:var(--cfg-muted);user-select:none}",
      ".__P__-cfg-switch input{position:absolute;inset:0;width:100%;height:100%;margin:0;opacity:0;cursor:pointer}",
      ".__P__-cfg-track{position:relative;width:38px;height:22px;border-radius:999px;background:color-mix(in oklab,currentColor 18%,transparent);transition:background .16s ease;flex:none}",
      ".__P__-cfg-track::after{content:'';position:absolute;top:2px;left:2px;width:18px;height:18px;border-radius:50%;background:var(--dsw-alias-label-primary,currentColor);transition:transform .16s ease,background .16s ease}",
      ".__P__-cfg-switch input:checked+.__P__-cfg-track{background:var(--dsw-alias-brand-primary,currentColor)}",
      ".__P__-cfg-switch input:checked+.__P__-cfg-track::after{transform:translateX(16px);background:var(--dsw-alias-label-primary-inverted,var(--dsw-alias-bg-base))}",
      ".__P__-cfg-switch input:focus-visible+.__P__-cfg-track{outline:2px solid var(--dsw-alias-brand-primary,currentColor);outline-offset:2px}",
      ".__P__-cfg-multi{display:flex;flex-wrap:wrap;gap:6px;justify-content:flex-end;max-width:100%}",
      ".__P__-cfg-multi label{position:relative;display:inline-flex;align-items:center;padding:5px 11px;border:1px solid var(--cfg-line);border-radius:999px;font-size:12px;color:var(--cfg-muted);cursor:pointer;line-height:1.4;transition:color .12s ease,border-color .12s ease,background .12s ease}",
      ".__P__-cfg-multi label:hover{background:var(--cfg-hover);color:var(--dsw-alias-label-primary,inherit)}",
      ".__P__-cfg-multi input{position:absolute;inset:0;width:100%;height:100%;margin:0;opacity:0;cursor:pointer}",
      ".__P__-cfg-multi label:has(input:checked){color:var(--dsw-alias-label-primary,inherit);border-color:color-mix(in oklab,currentColor 40%,var(--cfg-line));background:color-mix(in oklab,currentColor 7%,transparent);font-weight:600}",
      ".__P__-cfg-multi input:focus-visible+span{outline:2px solid var(--dsw-alias-brand-primary,currentColor);outline-offset:2px;border-radius:4px}",
      ".__P__-cfg-chip{font-size:10.5px;line-height:1.5;padding:1px 7px;border-radius:999px;background:color-mix(in oklab,currentColor 8%,transparent);color:var(--cfg-muted);font-weight:600;white-space:nowrap}",
      ".__P__-cfg-btn{display:inline-flex;align-items:center;gap:4px;border:none;min-height:var(--wb-btn-size-sm);min-width:var(--wb-btn-size-sm);background:var(--wb-btn-bg);color:var(--cfg-muted);border-radius:8px;padding:5px 9px;font:inherit;font-size:11.5px;cursor:pointer;white-space:nowrap;transition:background .12s ease,color .12s ease,border-color .12s ease}",
      ".__P__-cfg-btn:enabled:hover{background:var(--wb-btn-hover-bg);color:var(--dsw-alias-label-primary,inherit)}.__P__-cfg-btn:enabled:active{background:var(--wb-btn-active-bg)}",
      ".__P__-cfg-btn:focus-visible{outline:var(--wb-btn-focus);outline-offset:var(--wb-btn-focus-offset)}",
      ".__P__-cfg-btn:disabled{opacity:.45;cursor:not-allowed}",
      ".__P__-cfg-btn-outline{color:var(--dsw-alias-label-primary,inherit)}",
      ".__P__-cfg-foot{display:flex;align-items:center;gap:12px;flex-wrap:wrap;padding:2px 2px 0;min-height:32px}",
      ".__P__-cfg-changed{font-size:12px;color:var(--cfg-muted)}",
      ".__P__-cfg-grow{flex:1}",
      ".__P__-cfg-loading{display:flex;flex-direction:column;gap:10px;padding:6px 2px}",
      ".__P__-cfg-sk{height:14px;border-radius:7px;background:var(--dsw-alias-bg-skeleton,color-mix(in oklab,currentColor 6%,transparent));animation:__P__-cfg-pulse 1.4s ease-in-out infinite}",
      ".__P__-cfg-sk:nth-child(3){width:72%}",
      ".__P__-cfg-sk:nth-child(4){width:48%}",
      "@keyframes __P__-cfg-pulse{0%,100%{opacity:.65}50%{opacity:1}}",
      ".__P__-cfg-sr{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}",
      ".__P__-cfg-empty{border:1px dashed var(--cfg-line);border-radius:14px;padding:40px 16px;text-align:center;font-size:12.5px;color:var(--cfg-muted)}",
      ".__P__-cfg-error{display:flex;align-items:center;gap:10px;flex-wrap:wrap;border:1px solid color-mix(in oklab,var(--dsw-alias-state-error-primary,currentColor) 32%,var(--cfg-line));border-radius:10px;padding:10px 13px;color:var(--dsw-alias-state-error-primary,inherit);font-size:12.5px;line-height:1.5}",
      "@media (max-width:820px){.__P__-cfg-row{grid-template-columns:1fr;gap:10px;padding:13px 16px}.__P__-cfg-control{justify-content:flex-start}.__P__-cfg-multi{justify-content:flex-start}.__P__-cfg-gtitle{padding:11px 16px}}",
      "@media (prefers-reduced-motion:reduce){.__P__-cfg-track,.__P__-cfg-track::after,.__P__-cfg-sk{animation:none;transition:none}}"
    ].join("\n").split("__P__").join(PREFIX);
    function injectCss() {
      if (typeof document === "undefined") return;
      var old = document.getElementById("wb-addon-" + DOMAIN + "-config-css");
      if (old) {
        old.textContent = CSS;
        return;
      }
      var s = document.createElement("style");
      s.id = "wb-addon-" + DOMAIN + "-config-css";
      s.setAttribute("data-wb-addon", "wb-addon-" + DOMAIN);
      s.textContent = CSS;
      document.head.appendChild(s);
    }
    function unwrap(r) {
      return r && r.result !== void 0 ? r.result : r;
    }
    function optionLabel(opt, lang) {
      return lang === "en" ? String(opt.en || opt.zh || opt.value) : String(opt.zh || opt.en || opt.value);
    }
    function sameValue(a, b) {
      return JSON.stringify(a) === JSON.stringify(b);
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
      var state = stateS[0], setState = stateS[1];
      React.useEffect(
        function() {
          var alive = true;
          Promise.resolve(api.call(DOMAIN + ".configGet")).then(function(r) {
            if (!alive) return;
            var body = unwrap(r);
            if (r && r.ok === false) throw new Error(r && r.error || "load failed");
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
            setState({
              ready: true,
              values: Object.assign({}, fb),
              items: [],
              groups: [],
              overrides: {},
              error: String(e && e.message || e),
              state: null
            });
          });
          return function() {
            alive = false;
          };
        },
        [api]
      );
      return state;
    }
    function ConfigView(props) {
      var api = props.api;
      var lang = props.lang === "en" ? "en" : "zh";
      var t = COPY[lang];
      var loadS = React.useState(true);
      var loading = loadS[0], setLoading = loadS[1];
      var stateS = React.useState(null);
      var state = stateS[0], setState = stateS[1];
      var errS = React.useState("");
      var err = errS[0], setErr = errS[1];
      var noticeS = React.useState({ id: "", text: "", error: false });
      var notice = noticeS[0], setNotice = noticeS[1];
      var savingS = React.useState("");
      var savingId = savingS[0], setSavingId = savingS[1];
      var draftsS = React.useState({});
      var drafts = draftsS[0], setDrafts = draftsS[1];
      var busyS = React.useState(false);
      var busy = busyS[0], setBusy = busyS[1];
      React.useEffect(function() {
        injectCss();
      }, []);
      var load = React.useCallback(
        function() {
          setLoading(true);
          return Promise.resolve(api.call(DOMAIN + ".configGet")).then(function(r) {
            var body2 = unwrap(r);
            if (r && r.ok === false) throw new Error(r && r.error || "load failed");
            setState(body2 || null);
            setErr("");
            setLoading(false);
          }).catch(function(e) {
            setErr(String(e && e.message || e));
            setLoading(false);
          });
        },
        [api]
      );
      React.useEffect(
        function() {
          load();
        },
        [load]
      );
      function setValueLocal(id, value) {
        setState(function(prev) {
          if (!prev) return prev;
          var values = Object.assign({}, prev.values);
          values[id] = value;
          var overrides = Object.assign({}, prev.overrides);
          overrides[id] = value;
          return Object.assign({}, prev, { values, overrides });
        });
      }
      function save(id, value) {
        var prevState = state;
        setSavingId(id);
        setNotice({ id, text: t.saving, error: false });
        setValueLocal(id, value);
        return Promise.resolve(
          api.call(DOMAIN + ".configSet", {
            values: (function() {
              var o = {};
              o[id] = value;
              return o;
            })()
          })
        ).then(function(r) {
          var body2 = unwrap(r);
          if (r && r.ok === false) throw new Error(r && r.error || "save failed");
          setSavingId("");
          if (body2 && body2.state) setState(body2.state);
          setNotice({ id, text: t.saved, error: false });
        }).catch(function(e) {
          setSavingId("");
          if (prevState) setState(prevState);
          setNotice({ id, text: t.saveFail + String(e && e.message || e), error: true });
        });
      }
      function resetItem(id) {
        var prevState = state;
        setBusy(true);
        setNotice({ id, text: t.resetting, error: false });
        return Promise.resolve(api.call(DOMAIN + ".configReset", { ids: [id] })).then(function(r) {
          var body2 = unwrap(r);
          if (r && r.ok === false) throw new Error(r && r.error || "reset failed");
          setBusy(false);
          if (body2 && body2.state) setState(body2.state);
          setNotice({ id, text: t.defaultValue, error: false });
        }).catch(function(e) {
          setBusy(false);
          if (prevState) setState(prevState);
          setNotice({ id, text: String(e && e.message || e), error: true });
        });
      }
      function resetAll() {
        if (typeof window !== "undefined" && window.confirm && !window.confirm(t.confirmResetAll)) return;
        var prevState = state;
        setBusy(true);
        setNotice({ id: "", text: t.resetting, error: false });
        Promise.resolve(api.call(DOMAIN + ".configReset", {})).then(function(r) {
          var body2 = unwrap(r);
          if (r && r.ok === false) throw new Error(r && r.error || "reset failed");
          setBusy(false);
          if (body2 && body2.state) setState(body2.state);
          setNotice({ id: "", text: t.allDefault, error: false });
        }).catch(function(e) {
          setBusy(false);
          if (prevState) setState(prevState);
          setNotice({ id: "", text: String(e && e.message || e), error: true });
        });
      }
      function commitDraft(item) {
        var raw = drafts[item.id];
        if (raw === void 0) return;
        var next = String(raw).trim();
        setDrafts(function(prev) {
          var copy = Object.assign({}, prev);
          delete copy[item.id];
          return copy;
        });
        if (next === "") return;
        var value = Number(next);
        if (!Number.isFinite(value)) return;
        if (sameValue(value, state.values[item.id])) return;
        save(item.id, value);
      }
      function renderControl(item) {
        var value = state.values[item.id];
        var label = lang === "en" ? item.en : item.zh;
        if (item.type === "bool") {
          return h2(
            "label",
            { className: PREFIX + "-cfg-switch" },
            h2("input", {
              type: "checkbox",
              checked: value === true,
              onChange: function(e) {
                save(item.id, e.target.checked);
              }
            }),
            h2("span", { className: PREFIX + "-cfg-track", "aria-hidden": "true" }),
            h2("span", { className: PREFIX + "-cfg-switchstate" }, value === true ? t.on : t.off)
          );
        }
        if (item.type === "enum") {
          return h2(
            "select",
            {
              className: PREFIX + "-cfg-select",
              value: String(value),
              onChange: function(e) {
                var hit = (item.options || []).filter(function(o) {
                  return String(o.value) === e.target.value;
                })[0];
                if (hit) save(item.id, hit.value);
              }
            },
            (item.options || []).map(function(o) {
              return h2("option", { key: String(o.value), value: String(o.value) }, optionLabel(o, lang));
            })
          );
        }
        if (item.type === "int") {
          var draft = drafts[item.id] !== void 0 ? drafts[item.id] : String(value);
          return h2("input", {
            className: PREFIX + "-cfg-input",
            type: "number",
            value: draft,
            min: item.min,
            max: item.max,
            "aria-label": label,
            onChange: function(e) {
              var v = e.target.value;
              setDrafts(function(prev) {
                var c = Object.assign({}, prev);
                c[item.id] = v;
                return c;
              });
            },
            onBlur: function() {
              commitDraft(item);
            },
            onKeyDown: function(e) {
              if (e.key === "Enter") {
                e.preventDefault();
                commitDraft(item);
              }
            }
          });
        }
        if (item.type === "multi") {
          var picked = Array.isArray(value) ? value : [];
          return h2(
            "div",
            { className: PREFIX + "-cfg-multi" },
            (item.options || []).map(function(o) {
              var on = picked.indexOf(o.value) >= 0;
              return h2(
                "label",
                { key: String(o.value) },
                h2("input", {
                  type: "checkbox",
                  checked: on,
                  onChange: function() {
                    var next = picked.slice();
                    if (on) {
                      if (next.length <= 1) return;
                      next = next.filter(function(x) {
                        return x !== o.value;
                      });
                    } else next.push(o.value);
                    save(item.id, next);
                  }
                }),
                h2("span", null, optionLabel(o, lang))
              );
            })
          );
        }
        return h2("input", {
          className: PREFIX + "-cfg-input",
          type: "text",
          defaultValue: value === void 0 ? "" : String(value),
          onBlur: function(e) {
            if (!sameValue(e.target.value, value)) save(item.id, e.target.value);
          }
        });
      }
      var body = [];
      if (loading && !state)
        body.push(
          h2(ui.Skeleton, { key: "loading", lang })
        );
      if (!loading && err && !state) {
        body.push(
          h2(
            "div",
            { key: "err", className: PREFIX + "-cfg-error" },
            h2("span", null, t.loadFail + " " + err),
            h2("button", { type: "button", className: PREFIX + "-cfg-btn", onClick: load }, t.retry)
          )
        );
      }
      if (state) {
        var items = state.items || [];
        var groups = state.groups || [];
        var byGroup = {};
        items.forEach(function(item) {
          (byGroup[item.group] = byGroup[item.group] || []).push(item);
        });
        var order = groups.length ? groups : Object.keys(byGroup).map(function(id) {
          return { id, zh: id, en: id };
        });
        order.forEach(function(g) {
          var list = byGroup[g.id] || [];
          if (!list.length) return;
          body.push(
            h2(
              "section",
              { key: "g-" + g.id, className: PREFIX + "-cfg-group" },
              h2(
                "div",
                { className: PREFIX + "-cfg-gtitle" },
                h2(ui.Icon, { name: g.id === "list" ? "list" : "settings" }),
                h2("span", null, lang === "en" ? g.en : g.zh),
                h2("span", { className: PREFIX + "-cfg-gcount" }, list.length + (lang === "en" ? " items" : " \u9879"))
              ),
              list.map(function(item) {
                var overridden = state.overrides && state.overrides[item.id] !== void 0;
                var isSaving = savingId === item.id;
                return h2(
                  "div",
                  { key: item.id, className: PREFIX + "-cfg-row" },
                  h2(
                    "div",
                    { className: PREFIX + "-cfg-label" },
                    h2(
                      "div",
                      { className: PREFIX + "-cfg-name" },
                      h2("span", null, lang === "en" ? item.en : item.zh),
                      overridden ? h2("span", { className: PREFIX + "-cfg-chip" }, t.modified) : null,
                      isSaving ? h2("span", { className: PREFIX + "-cfg-chip" }, t.saving) : null
                    ),
                    (lang === "en" ? item.hintEn : item.hintZh) ? h2("div", { className: PREFIX + "-cfg-hint" }, lang === "en" ? item.hintEn : item.hintZh) : null,
                    h2("div", { className: PREFIX + "-cfg-id" }, item.id)
                  ),
                  h2(
                    "div",
                    { className: PREFIX + "-cfg-control" },
                    renderControl(item),
                    overridden ? h2(
                      ui.Button,
                      {
                        icon: "reset",
                        type: "button",
                        className: PREFIX + "-cfg-btn",
                        disabled: busy,
                        onClick: function() {
                          resetItem(item.id);
                        },
                        title: t.reset
                      },
                      t.reset
                    ) : null
                  )
                );
              })
            )
          );
        });
        if (!items.length && !loading) body.push(h2("div", { key: "empty", className: PREFIX + "-cfg-empty" }, t.empty));
        var anyOverride = Object.keys(state.overrides || {}).length > 0;
        body.push(
          h2(
            "div",
            { key: "foot", className: PREFIX + "-cfg-foot" },
            h2(
              "span",
              { className: PREFIX + "-cfg-changed" },
              anyOverride ? Object.keys(state.overrides || {}).length + (lang === "en" ? " changed" : " \u9879\u5DF2\u4FEE\u6539") : lang === "en" ? "All preferences are at their defaults" : "\u5168\u90E8\u914D\u7F6E\u5747\u4E3A\u9ED8\u8BA4\u503C"
            ),
            h2("span", { className: PREFIX + "-cfg-grow" }),
            anyOverride ? h2(
              ui.Button,
              {
                icon: "reset",
                type: "button",
                className: PREFIX + "-cfg-btn " + PREFIX + "-cfg-btn-outline",
                disabled: busy,
                onClick: resetAll
              },
              busy ? t.resetting : t.resetAll
            ) : null
          )
        );
        var warn = (state.warnings || []).filter(function(w) {
          return w && w.message;
        });
        if (warn.length) {
          body.push(
            h2(
              "div",
              { key: "warn", className: PREFIX + "-cfg-error" },
              h2(
                "span",
                null,
                warn.map(function(w) {
                  return w.message;
                }).join("\uFF1B")
              )
            )
          );
        }
      }
      return h2(
        "div",
        { className: "wbi-root " + PREFIX + "-cfg" },
        h2(
          "div",
          { className: PREFIX + "-cfg-head" },
          h2(
            "div",
            { className: PREFIX + "-cfg-headmain" },
            h2("h2", null, h2(ui.Icon, { name: "settings", size: 16 }), t.title),
            h2("div", { className: PREFIX + "-cfg-note" }, h2(ui.Icon, { name: "database", size: 11 }), t.note)
          ),
          h2(ui.Button, { icon: "refresh", onClick: load, disabled: loading || busy }, ui.tr(lang, "\u5237\u65B0", "Refresh")),
          notice.text ? h2(
            "div",
            { key: "notice", className: PREFIX + "-cfg-status" + (notice.error ? " err" : ""), role: "status" },
            notice.text
          ) : null
        ),
        body
      );
    }
    module2.exports = { ConfigView, useConfig, DOMAIN };
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
        var style2 = document.createElement("style");
        style2.id = "wb-addon-" + DOMAIN + "-data-css";
        style2.setAttribute("data-wb-addon", "wb-addon-" + DOMAIN);
        style2.textContent = CSS;
        document.head.appendChild(style2);
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
    var h2 = React.createElement;
    var COPY = require_data_copy();
    module2.exports = function createDataView(options) {
      var DOMAIN = options.domain;
      function icon(name) {
        return options.Icon ? h2(options.Icon, { name }) : null;
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
          Promise.resolve(api.call(DOMAIN + ".dataTables")).then(function(r) {
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
          Promise.resolve(api.call(DOMAIN + ".dataQuery", args)).then(function(r) {
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
          return h2(
            "div",
            { className: P + "-idx" },
            h2(
              "div",
              { className: P + "-head" },
              h2(
                "div",
                { className: P + "-headmain" },
                h2("h2", null, icon("database"), tableLabel(tb), h2("span", { className: P + "-code" }, active)),
                h2("div", { className: P + "-idxsub" }, t.indexSub)
              ),
              h2("button", {
                type: "button",
                className: P + "-btn",
                "aria-label": t.refresh,
                title: t.refresh,
                "aria-busy": indexBusy ? "true" : "false",
                onClick: function() {
                  loadIndex();
                }
              }, icon("refresh"), h2("span", { className: P + "-btnlabel" }, t.refresh))
            ),
            st ? h2(
              "div",
              { className: P + "-idxsum" },
              h2("span", null, t.idxRows, " ", h2("b", null, String(count))),
              h2("span", null, t.idxCols, " ", h2("b", null, String(st.columnCount === void 0 ? (tb.columns || []).length : st.columnCount))),
              h2("span", null, fmt(t.idxCount, { n: indexes.length }))
            ) : null,
            indexBusy ? options.Skeleton ? h2(options.Skeleton, { lang, label: t.loading }) : h2("div", { className: P + "-empty", role: "status", "aria-busy": "true" }, t.loading) : !st ? h2("div", { className: P + "-empty" }, t.idxEmpty) : !hasExtra ? h2("div", { className: P + "-empty" }, t.idxNoExtra) : h2(
              "div",
              { className: P + "-tablewrap" },
              h2(
                "table",
                { className: P + "-table " + P + "-idxtable" },
                h2("thead", null, h2(
                  "tr",
                  null,
                  [t.idxName, t.idxColumns, t.idxType, t.idxSource, t.idxRows].map(function(label) {
                    return h2("th", { scope: "col", key: label }, h2("span", { className: P + "-thbtn" }, label));
                  })
                )),
                h2("tbody", null, indexes.map(function(ix) {
                  return h2(
                    "tr",
                    { className: P + "-tr", key: ix.name },
                    h2("td", { className: P + "-cell mono" }, ix.name),
                    h2("td", { className: P + "-cell mono" }, (ix.columns || []).join(", ") || t.idxNone),
                    h2("td", { className: P + "-cell" }, ix.origin === "pk" ? t.idxKey : ix.unique ? t.idxUnique : t.idxNormal),
                    h2("td", { className: P + "-cell" }, /^sqlite_autoindex_/.test(ix.name) ? t.idxAuto : t.idxCreated),
                    h2("td", { className: P + "-cell num", title: t.idxRowsHelp }, String(count))
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
          if (text === null) content = h2("span", { className: "v" }, t.nullText);
          else if (text === "") content = h2("span", { className: "v" }, '""');
          else content = h2("span", { className: "v" }, text);
          if (hook && hook.render) content = hook.render({ value, row, col, lang, prefix: P, openDetail });
          return h2("td", {
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
          return h2(
            "th",
            { key: col.name, scope: "col", className: P + "-fth" },
            h2(
              "span",
              { className: P + "-fcell" },
              h2("input", {
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
              val ? h2("button", {
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
          if (loadingRows && !data && options.Skeleton) return h2(options.Skeleton, { lang, label: t.loading });
          if (loadingRows && !data) {
            return h2(
              "div",
              { className: P + "-skwrap", "aria-busy": "true" },
              h2("span", { className: P + "-sr" }, t.loading),
              [0, 1, 2, 3, 4, 5, 6, 7].map(function(i2) {
                return h2("div", { key: i2, className: P + "-sk" });
              })
            );
          }
          if (error) {
            return h2(
              "div",
              { className: P + "-err", role: "alert" },
              h2("span", null, t.queryFail + error),
              h2("button", { type: "button", className: P + "-btn", onClick: refresh }, t.retry)
            );
          }
          if (!data) return h2("div", { className: P + "-empty" }, t.empty);
          var cols = visibleColumns();
          var rows = data.rows || [];
          var narrowing = !!search || activeFilterCount() > 0;
          return h2(
            "div",
            { className: P + "-tablewrap" },
            h2(
              "table",
              { className: P + "-table" },
              h2(
                "thead",
                null,
                h2(
                  "tr",
                  null,
                  h2("th", { className: P + "-rownum", scope: "col" }, "#"),
                  cols.map(function(col) {
                    return h2(
                      "th",
                      { key: col.name, scope: "col", "aria-sort": ariaSort(col.name) },
                      h2(
                        "button",
                        {
                          type: "button",
                          className: P + "-thbtn",
                          title: colLabel(col) + " \xB7 " + col.type,
                          onClick: function() {
                            toggleSort(col.name);
                          }
                        },
                        h2("span", null, colLabel(col)),
                        h2("span", { className: P + "-coltype" }, String(col.type || "").toLowerCase()),
                        sort === col.name ? h2("span", { className: P + "-sortmark", "aria-hidden": "true" }, order === "asc" ? "\u25B2" : "\u25BC") : null
                      )
                    );
                  })
                ),
                h2(
                  "tr",
                  { className: P + "-frow" },
                  h2("th", { className: P + "-rownum", scope: "col" }, ""),
                  cols.map(filterCell)
                )
              ),
              h2("tbody", null, rows.length ? rows.map(function(row, idx) {
                row.__i = idx;
                var deleted = row.deleted_at !== null && row.deleted_at !== void 0;
                return h2(
                  "tr",
                  { key: row.id || idx, className: P + "-tr" + (deleted ? " deleted" : "") },
                  h2("td", { className: P + "-rownum" }, (data.page - 1) * data.pageSize + idx + 1),
                  cols.map(function(col) {
                    var cell = renderCell(row, col);
                    if (deleted && col.name === "id") {
                      return React.cloneElement(cell, { key: col.name }, cell.props.children, h2("span", { className: P + "-delbadge" }, t.deleted));
                    }
                    return cell;
                  })
                );
              }) : h2("tr", null, h2("td", { className: P + "-emptycell", colSpan: cols.length + 1 }, narrowing ? t.noRows : t.empty)))
            )
          );
        }
        function renderFoot() {
          var pages = data ? data.pages : 1;
          var total = data ? data.total : 0;
          return h2(
            "div",
            { className: P + "-foot" },
            h2("span", null, fmt(t.total, { n: total })),
            h2("span", { className: P + "-grow" }),
            h2("button", { type: "button", className: P + "-btn", disabled: !data || page <= 1, onClick: function() {
              setPage(Math.max(1, page - 1));
            } }, "\u2039 " + t.prev),
            h2("span", { className: P + "-pageinfo" }, fmt(t.pageInfo, { page: data ? data.page : 1, pages })),
            h2("button", { type: "button", className: P + "-btn", disabled: !data || page >= pages, onClick: function() {
              setPage(Math.min(pages, page + 1));
            } }, t.next + " \u203A"),
            h2("input", {
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
            h2("span", null, fmt(t.queryTime, { n: data ? data.queryMs : 0 }))
          );
        }
        if (!tables && loadingTables && options.Skeleton) return h2(options.Skeleton, { lang, label: t.loading });
        if (!tables && loadingTables) {
          return h2("div", { className: P + "-skwrap", "aria-busy": "true" }, h2("span", { className: P + "-sr" }, t.loading), [0, 1, 2, 3].map(function(i2) {
            return h2("div", { key: i2, className: P + "-sk" });
          }));
        }
        if (!tables) {
          return h2("div", { className: P + "-err", role: "alert" }, h2("span", null, t.loadFail), h2("button", { type: "button", className: P + "-btn", onClick: loadTables }, t.retry));
        }
        if (!tables.length) return h2("div", { className: P + "-empty" }, t.emptyTable);
        return h2(
          "div",
          { className: P },
          h2(
            "div",
            { className: P + "-side" },
            h2("div", { className: P + "-sidetitle" }, h2("span", null, icon("table"), t.tables), h2("span", null, String(tables.length))),
            tables.map(function(tb) {
              return h2(
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
                h2(
                  "span",
                  { className: P + "-stabname" },
                  h2("span", null, tableLabel(tb)),
                  h2("span", { className: P + "-sidecount" }, String(tb.count))
                ),
                h2("span", { className: P + "-sidetable" }, tb.name)
              );
            })
          ),
          h2(
            "div",
            { className: P + "-main" },
            h2(
              "div",
              { className: P + "-tabs", role: "tablist", "aria-label": t.title },
              h2("button", { type: "button", role: "tab", className: P + "-btn", "aria-selected": !index, onClick: leaveIndex }, icon("list"), lang === "en" ? "Row data" : "\u884C\u6570\u636E"),
              h2("button", { type: "button", role: "tab", className: P + "-btn", "aria-selected": !!index, onClick: loadIndex }, icon("database"), t.index)
            ),
            index && error ? h2("div", { className: P + "-err", role: "alert" }, error) : null,
            index ? renderIndex() : [
              h2(
                "div",
                { className: P + "-head" },
                h2(
                  "div",
                  { className: P + "-headmain" },
                  h2("h2", null, icon("database"), tableLabel(current), h2("span", { className: P + "-code" }, active)),
                  h2(
                    "div",
                    { className: P + "-sub" },
                    current ? fmt(t.rowCount, { n: current.count }) : "",
                    current && current.deletedCount ? " \xB7 " + fmt(t.deletedCount, { n: current.deletedCount }) : "",
                    " \xB7 " + t.subtitle
                  )
                ),
                h2("button", {
                  type: "button",
                  className: P + "-btn",
                  "aria-label": t.refresh,
                  title: t.refresh,
                  "aria-busy": loadingRows ? "true" : "false",
                  onClick: refresh
                }, icon("refresh"), h2("span", { className: P + "-btnlabel" }, t.refresh))
              ),
              h2(
                "div",
                { className: P + "-toolbar" },
                h2(
                  "div",
                  { className: P + "-search" },
                  icon("search"),
                  h2("input", {
                    type: "search",
                    value: searchDraft,
                    placeholder: t.search,
                    "aria-label": t.search,
                    onChange: function(e) {
                      setSearchDraft(e.target.value);
                    }
                  })
                ),
                h2(
                  "label",
                  { className: P + "-switch" },
                  h2("input", { type: "checkbox", checked: includeDeleted, onChange: function(e) {
                    setIncludeDeleted(e.target.checked);
                    setPage(1);
                  } }),
                  h2("span", { className: P + "-track" }),
                  h2("span", null, t.includeDeleted)
                ),
                h2(
                  "label",
                  { className: P + "-switch" },
                  h2("input", { type: "checkbox", checked: showSystem, onChange: function(e) {
                    setShowSystem(e.target.checked);
                  } }),
                  h2("span", { className: P + "-track" }),
                  h2("span", null, t.showSystem)
                ),
                h2("span", { className: P + "-grow" }),
                h2(
                  "label",
                  { style: { display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "11.5px", color: "var(--cfg-muted)" } },
                  h2("span", null, t.pageSize),
                  h2("select", {
                    className: P + "-select",
                    value: size,
                    onChange: function(e) {
                      setPageSize(Number(e.target.value));
                      setPage(1);
                    }
                  }, PAGE_SIZES.map(function(n) {
                    return h2("option", { key: n, value: n }, String(n));
                  }))
                )
              ),
              renderRows(),
              renderFoot()
            ]
          ),
          drawer ? h2(
            "div",
            null,
            h2("div", { className: P + "-mask", onClick: function() {
              setDrawer(null);
            } }),
            h2(
              "aside",
              { className: P + "-drawer", role: "dialog", "aria-modal": "true", "aria-label": drawer.column },
              h2("h3", null, fmt(t.drawerTitle, { column: drawer.column, row: drawer.row }), h2("span", { className: P + "-code" }, drawer.name)),
              columnHooks[drawer.name] && columnHooks[drawer.name].detail ? columnHooks[drawer.name].detail({ value: drawer.value, lang, prefix: P }) : h2("pre", null, drawerText(drawer.value)),
              h2(
                "div",
                { className: P + "-drawerfoot" },
                h2("button", { type: "button", className: P + "-btn", onClick: function() {
                  copyCell(drawer.value);
                } }, t.copy),
                h2("button", { type: "button", className: P + "-btn", onClick: function() {
                  setDrawer(null);
                } }, t.close)
              )
            )
          ) : null,
          toast ? h2("div", { className: P + "-toast", role: "status" }, toast) : null
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

// packages/addons/storage/client/ui/data-columns.cjs
var require_data_columns = __commonJS({
  "packages/addons/storage/client/ui/data-columns.cjs"(exports2, module2) {
    "use strict";
    var h2 = require("react").createElement;
    var safeImage = require_ui().safeImage;
    function images(value) {
      try {
        var list = typeof value === "string" ? JSON.parse(value) : value;
        if (!Array.isArray(list) || !list.length) return [];
        var urls = list.map(function(url) {
          return typeof url === "string" ? safeImage(url) : "";
        });
        return urls.every(Boolean) ? urls : [];
      } catch (_) {
        return [];
      }
    }
    function text(value) {
      return value == null ? "NULL" : String(value);
    }
    function picture(url, index, lang) {
      return h2("img", { key: index, src: url, alt: (lang === "en" ? "Image " : "\u56FE\u7247 ") + (index + 1), loading: "lazy", referrerPolicy: "no-referrer" });
    }
    module2.exports = {
      img_list: {
        render: function(ctx) {
          var urls = images(ctx.value);
          if (!urls.length) return h2("span", { className: "v" }, text(ctx.value));
          return h2(
            "button",
            {
              type: "button",
              className: ctx.prefix + "-btn " + ctx.prefix + "-images",
              "aria-label": (ctx.lang === "en" ? "Preview images: " : "\u9884\u89C8\u56FE\u7247\uFF1A") + urls.length,
              onClick: function(e) {
                e.stopPropagation();
                ctx.openDetail();
              }
            },
            urls.slice(0, 3).map(function(url, i) {
              return picture(url, i, ctx.lang);
            }),
            urls.length > 3 ? h2("span", null, "+" + (urls.length - 3)) : null
          );
        },
        detail: function(ctx) {
          var urls = images(ctx.value);
          return urls.length ? h2("div", { className: ctx.prefix + "-gallery" }, urls.map(function(url, i) {
            return picture(url, i, ctx.lang);
          })) : h2("pre", null, text(ctx.value));
        }
      },
      stock: {
        kind: "text",
        type: "TEXT",
        render: function(ctx) {
          return h2("span", { className: "v" }, text(ctx.value));
        }
      },
      remark: {
        render: function(ctx) {
          var value = text(ctx.value);
          return h2("span", { className: "v", title: value }, value.length > 80 ? value.slice(0, 80) + "\u2026" : value);
        }
      }
    };
  }
});

// packages/addons/storage/client/views/data.cjs
var require_data = __commonJS({
  "packages/addons/storage/client/views/data.cjs"(exports2, module2) {
    "use strict";
    module2.exports = require_data_view()({
      domain: "storage",
      Icon: require_icons().Icon,
      Skeleton: require_ui().Skeleton,
      prefix: "wbi",
      tables: ["storage"],
      useConfig: require_config().useConfig,
      columns: require_data_columns()
    });
  }
});

// packages/addons/lib/highlight.cjs
var require_highlight = __commonJS({
  "packages/addons/lib/highlight.cjs"(exports2, module2) {
    "use strict";
    module2.exports = function(React) {
      var h2 = React.createElement;
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
            parts.push(h2("mark", { className, key: match.index }, match[0]));
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
        "." + P + "-cardhead{display:flex;align-items:center;gap:8px;flex-wrap:wrap}",
        "." + P + "-cardhead code{font-weight:640}",
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
        var style2 = document.createElement("style");
        style2.id = id;
        style2.setAttribute("data-wb-addon", "wb-addon-" + DOMAIN);
        style2.textContent = CSS;
        document.head.appendChild(style2);
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
    var h2 = React.createElement;
    var COPY = {
      zh: {
        title: "Action",
        hint: "\u8FD0\u884C\u65F6\u6CE8\u518C \xB7 \u53EA\u8BFB",
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
      var DOMAIN = raw.indexOf("wb-addon-") === 0 ? raw : "wb-addon-" + raw;
      var prefix = options.prefix;
      var P = prefix + "-as";
      var Icon3 = options.Icon || null;
      var injectCss = require_action_schema_style()(prefix, DOMAIN);
      var Highlight = createHighlight(P);
      function icon(name, size) {
        return Icon3 ? h2(Icon3, { name, size: size || 14 }) : null;
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
        React.useEffect(function() {
          injectCss();
        }, []);
        React.useEffect(function() {
          var alive = true;
          setLoading(true);
          setErr("");
          var pending;
          var actionName = DOMAIN.replace(/^wb-addon-/, "") + ".actionSchema";
          if (api && typeof api.call === "function") {
            pending = Promise.resolve(api.call(actionName)).then(function(r) {
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
          return h2(
            "tr",
            { key: row.name },
            h2("td", { className: P + "-mono" }, Highlight.hit(row.name, kw)),
            h2("td", { className: P + "-mono" }, Highlight.hit(row.type, kw)),
            h2("td", { className: row.required ? P + "-req" : P + "-opt" }, row.required ? t.required : t.optional),
            // extra（默认 / 枚举 / 约束）不在过滤 haystack 里，因此也不高亮，保持「显示即命中」口径。
            h2("td", { className: P + "-mono" }, extra),
            h2("td", null, Highlight.hit(row.description, kw))
          );
        }
        function card(action) {
          var rows = paramRows(action);
          var examples = Array.isArray(action.examples) ? action.examples : [];
          return h2(
            "div",
            { className: P + "-card", key: action.name },
            h2(
              "div",
              { className: P + "-cardhead" },
              h2("code", { className: P + "-mono" }, Highlight.hit(action.name, kw)),
              h2("span", { className: P + "-badge" }, action.domain),
              h2("span", { className: P + "-badge" }, rows.length ? t.paramCount(rows.length) : t.noParams),
              rows.some(function(row) {
                return row.required;
              }) ? h2("span", { className: P + "-badge " + P + "-req" }, t.required) : null
            ),
            action.description ? h2("p", { className: P + "-desc" }, Highlight.hit(action.description, kw)) : null,
            rows.length ? h2(
              "table",
              { className: P + "-table" },
              h2("thead", null, h2(
                "tr",
                null,
                h2("th", null, t.colName),
                h2("th", null, t.colType),
                h2("th", null, t.colReq),
                h2("th", null, t.colExtra),
                h2("th", null, t.colDesc)
              )),
              h2("tbody", null, rows.map(paramRow))
            ) : h2("div", { className: P + "-none" }, t.noParams),
            h2(
              "div",
              { className: P + "-example" },
              h2(
                "div",
                { className: P + "-examplehead" },
                h2("span", { className: P + "-none" }, t.examples),
                examples.length ? h2("button", {
                  type: "button",
                  className: P + "-copy",
                  "data-copy-example": action.name,
                  onClick: function() {
                    copy(JSON.stringify(examples.length === 1 ? examples[0] : examples, null, 2));
                  }
                }, t.copy) : null
              ),
              examples.length ? examples.map(function(example, index) {
                return h2("pre", { className: P + "-pre", key: index }, JSON.stringify(example, null, 2));
              }) : h2("div", { className: P + "-none" }, t.noExamples)
            ),
            h2(
              "details",
              null,
              h2("summary", null, t.raw),
              h2("pre", { className: P + "-pre" }, JSON.stringify(action.input || {}, null, 2))
            )
          );
        }
        var body;
        if (loading) {
          body = h2("div", { className: P + "-empty", role: "status" }, t.loading);
        } else if (err) {
          body = h2(
            "div",
            { className: P + "-error", role: "alert" },
            h2("span", null, t.loadFail + "\uFF1A" + err),
            h2("button", { type: "button", className: P + "-copy", onClick: function() {
              setReload(reload + 1);
            } }, t.retry)
          );
        } else if (!all.length) {
          body = h2("div", { className: P + "-empty" }, t.emptyRegistry);
        } else if (!visible.length) {
          body = h2("div", { className: P + "-empty" }, t.empty);
        } else {
          body = h2("div", { className: P + "-list" }, visible.map(card));
        }
        return h2(
          "div",
          { className: P },
          h2(
            "div",
            { className: P + "-head" },
            h2("h3", { className: P + "-title" }, t.title),
            h2("span", { className: P + "-badge" }, t.domain + " " + DOMAIN),
            info && info.version ? h2("span", { className: P + "-badge" }, t.versionLabel + " v" + info.version) : null,
            snap && snap.shellVersion ? h2("span", { className: P + "-badge" }, t.shell + " v" + snap.shellVersion) : null,
            h2("span", { className: P + "-badge" }, t.count(visible.length, all.length)),
            h2("span", { className: P + "-none" }, t.hint)
          ),
          snap ? h2(
            "div",
            { className: P + "-toolbar" },
            h2(
              "label",
              { className: P + "-search" },
              icon("search", 14),
              h2("input", {
                type: "search",
                value: query,
                placeholder: t.search,
                "aria-label": t.search,
                onChange: function(e) {
                  setQuery(e.target.value);
                }
              })
            ),
            h2(
              "label",
              { className: P + "-none" },
              t.filterReq + " ",
              h2(
                "select",
                { value: reqMode, "aria-label": t.filterReq, onChange: function(e) {
                  setReqMode(e.target.value);
                } },
                h2("option", { value: "all" }, t.all),
                h2("option", { value: "required" }, t.onlyRequired),
                h2("option", { value: "optional" }, t.onlyOptional)
              )
            ),
            h2(
              "label",
              { className: P + "-none" },
              t.filterType + " ",
              h2(
                "select",
                { value: typePick, "aria-label": t.filterType, onChange: function(e) {
                  setTypePick(e.target.value);
                } },
                h2("option", { value: "" }, t.allTypes),
                typeOptions.map(function(name) {
                  return h2("option", { value: name, key: name }, name);
                })
              )
            )
          ) : null,
          body,
          toast ? h2("div", { className: P + "-toast", role: "status" }, toast) : null
        );
      }
      return { ActionSchemaView, DOMAIN, typeLabel, paramRows };
    };
  }
});

// packages/addons/storage/client/views/actions.cjs
var require_actions = __commonJS({
  "packages/addons/storage/client/views/actions.cjs"(exports2, module2) {
    "use strict";
    module2.exports = require_action_schema_view()({
      domain: "storage",
      prefix: "wbi"
    });
  }
});

// packages/addons/storage/client/client.src.cjs
var host = window.__WB_HOST__;
if (host) {
  let tabIcon2 = function(name) {
    return function StorageTabIcon() {
      return h(Icon2, { name, size: 14 });
    };
  };
  tabIcon = tabIcon2;
  styleId = "wb-addon-storage-style";
  if (!document.getElementById(styleId)) {
    style = document.createElement("style");
    style.id = styleId;
    style.textContent = require_styles();
    document.head.appendChild(style);
  }
  h = require("react").createElement, Icon2 = require_icons().Icon;
  host.registerAddon({
    id: "wb-addon-storage",
    version: "1.5.1",
    views: [
      { id: "stats", icon: tabIcon2("chart"), title: { zh: "\u7EDF\u8BA1", en: "Statistics" }, component: require_stats().Stats },
      { id: "storage", icon: tabIcon2("list"), title: { zh: "\u8BB0\u5F55", en: "Records" }, component: require_records().Records },
      { id: "config", icon: tabIcon2("settings"), title: { zh: "\u914D\u7F6E", en: "Config" }, component: require_config().ConfigView },
      { id: "data", icon: tabIcon2("database"), title: { zh: "\u6570\u636E", en: "Data" }, component: require_data().DataView },
      { id: "actions", icon: tabIcon2("code-2"), title: { zh: "Action", en: "Actions" }, component: require_actions().ActionSchemaView }
    ]
  });
} else console.error("[wb-addon-storage] Missing workbench host");
var styleId;
var style;
var h;
var Icon2;
var tabIcon;
module.exports = { name: "dsh-workbench-storage", inject: [], apply: function() {
} };
    return module.exports;
  },
});
