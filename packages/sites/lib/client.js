// 由 scripts/build-addon-clients.mjs 生成；请修改对应 client/client.src.cjs 后重新构建。
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

// packages/addons/sites/client/ui/tagfilter.cjs
var require_tagfilter = __commonJS({
  "packages/addons/sites/client/ui/tagfilter.cjs"(exports2, module2) {
    var React2 = require("react");
    var h2 = React2.createElement;
    var useState = React2.useState;
    var useEffect = React2.useEffect;
    var useCallback = React2.useCallback;
    module2.exports = function TagFilter2(props) {
      var api = props.api;
      var text = props.text;
      var Icon2 = props.Icon;
      var ids = props.ids || [];
      var onChange = props.onChange;
      var visible = props.visible !== false;
      var [open, setOpen] = useState(false);
      var [query, setQuery] = useState("");
      var [rows, setRows] = useState([]);
      var [total, setTotal] = useState(0);
      var [page, setPage] = useState(0);
      var [hasMore, setHasMore] = useState(false);
      var [loading, setLoading] = useState(false);
      var [names, setNames] = useState({});
      var load = useCallback(function(q, pageNumber, append) {
        setLoading(true);
        return api.call("siteTags.search", { text: q || "", pageNumber, pageSize: 20 }).then(function(r) {
          setLoading(false);
          if (!r || !r.ok) return;
          var out = r.result || {};
          var records = out.records || [];
          setRows(function(prev) {
            return append ? prev.concat(records) : records;
          });
          setTotal(out.total || 0);
          setPage(out.current || pageNumber);
          setHasMore(!!out.hasNext || (out.current || pageNumber) * 20 < (out.total || 0));
          setNames(function(prev) {
            var next = Object.assign({}, prev);
            records.forEach(function(x) {
              next[String(x.id)] = x.name;
            });
            return next;
          });
        }).catch(function() {
          setLoading(false);
        });
      }, [api]);
      useEffect(function() {
        if (!open) return void 0;
        var timer = setTimeout(function() {
          load(query, 1, false);
        }, query ? 200 : 0);
        return function() {
          clearTimeout(timer);
        };
      }, [open, query, load, props.reloadKey]);
      useEffect(function() {
        if (!open) return void 0;
        function onKey(e) {
          if (e.key === "Escape") setOpen(false);
        }
        document.addEventListener("keydown", onKey);
        return function() {
          document.removeEventListener("keydown", onKey);
        };
      }, [open]);
      if (!visible) return null;
      function toggle(id) {
        var key = String(id);
        var next = ids.slice();
        var i = next.indexOf(key);
        if (i >= 0) next.splice(i, 1);
        else next.push(key);
        onChange(next);
      }
      return h2(
        "div",
        { className: "wbs-tagfilter" },
        h2("button", {
          className: "wbs-btn" + (ids.length ? " on" : ""),
          onClick: function(e) {
            e.stopPropagation();
            setOpen(!open);
          }
        }, h2(Icon2, { name: "tag", size: 13 }), text("tagFilter") + (ids.length ? " \xB7 " + ids.length : ""), h2(Icon2, { name: "chevron-down", size: 12 })),
        open ? h2(
          "div",
          { className: "wbs-tagmenu", style: { width: 260 }, onClick: function(e) {
            e.stopPropagation();
          } },
          h2(
            "div",
            { style: { padding: "2px 4px 6px" } },
            h2("input", {
              className: "wbs-input",
              autoFocus: true,
              value: query,
              placeholder: text("tagSearchPlaceholder"),
              onChange: function(e) {
                setQuery(e.target.value);
              }
            })
          ),
          ids.length ? h2(
            "div",
            { style: { padding: "0 4px 4px", display: "flex", flexDirection: "column", gap: 3 } },
            h2("div", { className: "wbs-tagmenu-head" }, h2("span", null, text("tagSelected") + " " + ids.length)),
            ids.map(function(id) {
              return h2(
                "button",
                { key: id, className: "wbs-mini", style: { justifyContent: "space-between" }, onClick: function() {
                  toggle(id);
                } },
                h2("span", { style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, names[String(id)] || "#" + id),
                h2("span", null, "\xD7")
              );
            })
          ) : null,
          h2(
            "div",
            { className: "wbs-tagmenu-head" },
            h2("span", null, text("allTags") + (total ? " \xB7 " + total : "")),
            h2("span", { className: "wbs-grow" }),
            h2("button", { className: "wbs-mini", title: text("clear"), onClick: function() {
              onChange([]);
              setQuery("");
            } }, h2(Icon2, { name: "x", size: 12 }), text("clear"))
          ),
          h2(
            "div",
            {
              style: { maxHeight: 240, overflow: "auto" },
              onScroll: function(e) {
                var el = e.currentTarget;
                if (!hasMore || loading) return;
                if (el.scrollTop + el.clientHeight >= el.scrollHeight - 24) load(query, (page || 1) + 1, true);
              }
            },
            rows.length ? rows.map(function(t) {
              var on = ids.indexOf(String(t.id)) >= 0;
              return h2(
                "label",
                { key: t.id, className: "wbs-tagopt" },
                h2("input", { type: "checkbox", checked: on, onChange: function() {
                  toggle(t.id);
                } }),
                h2("span", null, t.name)
              );
            }) : h2("div", { className: "wbs-note", style: { padding: 6 } }, loading ? text("loadingMore") : query ? text("tagNoMatch") : text("allTags")),
            rows.length ? h2("div", { className: "wbs-note", style: { padding: 6, textAlign: "center" } }, loading ? text("loadingMore") : hasMore ? "" : text("noMore")) : null
          )
        ) : null
      );
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

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/refresh-cw.mjs
var refresh_cw_exports = {};
__export(refresh_cw_exports, {
  __iconData: () => __iconData,
  default: () => RefreshCw
});
var __iconData, RefreshCw;
var init_refresh_cw = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/refresh-cw.mjs"() {
    init_createLucideIcon();
    __iconData = {
      name: "refresh-cw",
      size: 24,
      node: [
        ["path", { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8", key: "v9h5vc" }],
        ["path", { d: "M21 3v5h-5", key: "1q7to0" }],
        ["path", { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16", key: "3uifl3" }],
        ["path", { d: "M8 16H3v5", key: "1cv678" }]
      ]
    };
    __iconData.node;
    RefreshCw = createLucideIcon(__iconData);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/globe.mjs
var globe_exports = {};
__export(globe_exports, {
  __iconData: () => __iconData2,
  default: () => Globe
});
var __iconData2, Globe;
var init_globe = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/globe.mjs"() {
    init_createLucideIcon();
    __iconData2 = {
      name: "globe",
      size: 24,
      node: [
        ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
        ["path", { d: "M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20", key: "13o1zl" }],
        ["path", { d: "M2 12h20", key: "9i4pu4" }]
      ]
    };
    __iconData2.node;
    Globe = createLucideIcon(__iconData2);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/link-2.mjs
var link_2_exports = {};
__export(link_2_exports, {
  __iconData: () => __iconData3,
  default: () => Link2
});
var __iconData3, Link2;
var init_link_2 = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/link-2.mjs"() {
    init_createLucideIcon();
    __iconData3 = {
      name: "link-2",
      size: 24,
      node: [
        ["path", { d: "M9 17H7A5 5 0 0 1 7 7h2", key: "8i5ue5" }],
        ["path", { d: "M15 7h2a5 5 0 1 1 0 10h-2", key: "1b9ql8" }],
        ["line", { x1: "8", x2: "16", y1: "12", y2: "12", key: "1jonct" }]
      ]
    };
    __iconData3.node;
    Link2 = createLucideIcon(__iconData3);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/tag.mjs
var tag_exports = {};
__export(tag_exports, {
  __iconData: () => __iconData4,
  default: () => Tag
});
var __iconData4, Tag;
var init_tag = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/tag.mjs"() {
    init_createLucideIcon();
    __iconData4 = {
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
    __iconData4.node;
    Tag = createLucideIcon(__iconData4);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/chart-pie.mjs
var __iconData5, ChartPie;
var init_chart_pie = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/chart-pie.mjs"() {
    init_createLucideIcon();
    __iconData5 = {
      name: "chart-pie",
      size: 24,
      node: [
        [
          "path",
          {
            d: "M21 12c.552 0 1.005-.449.95-.998a10 10 0 0 0-8.953-8.951c-.55-.055-.998.398-.998.95v8a1 1 0 0 0 1 1z",
            key: "pzmjnu"
          }
        ],
        ["path", { d: "M21.21 15.89A10 10 0 1 1 8 2.83", key: "k2fpak" }]
      ],
      aliases: ["pie-chart"]
    };
    __iconData5.node;
    ChartPie = createLucideIcon(__iconData5);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/pie-chart.mjs
var pie_chart_exports = {};
__export(pie_chart_exports, {
  default: () => ChartPie
});
var init_pie_chart = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/pie-chart.mjs"() {
    init_chart_pie();
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/folder-tree.mjs
var folder_tree_exports = {};
__export(folder_tree_exports, {
  __iconData: () => __iconData6,
  default: () => FolderTree
});
var __iconData6, FolderTree;
var init_folder_tree = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/folder-tree.mjs"() {
    init_createLucideIcon();
    __iconData6 = {
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
    __iconData6.node;
    FolderTree = createLucideIcon(__iconData6);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/unlink.mjs
var unlink_exports = {};
__export(unlink_exports, {
  __iconData: () => __iconData7,
  default: () => Unlink
});
var __iconData7, Unlink;
var init_unlink = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/unlink.mjs"() {
    init_createLucideIcon();
    __iconData7 = {
      name: "unlink",
      size: 24,
      node: [
        [
          "path",
          {
            d: "m18.84 12.25 1.72-1.71h-.02a5.004 5.004 0 0 0-.12-7.07 5.006 5.006 0 0 0-6.95 0l-1.72 1.71",
            key: "yqzxt4"
          }
        ],
        [
          "path",
          {
            d: "m5.17 11.75-1.71 1.71a5.004 5.004 0 0 0 .12 7.07 5.006 5.006 0 0 0 6.95 0l1.71-1.71",
            key: "4qinb0"
          }
        ],
        ["line", { x1: "8", x2: "8", y1: "2", y2: "5", key: "1041cp" }],
        ["line", { x1: "2", x2: "5", y1: "8", y2: "8", key: "14m1p5" }],
        ["line", { x1: "16", x2: "16", y1: "19", y2: "22", key: "rzdirn" }],
        ["line", { x1: "19", x2: "22", y1: "16", y2: "16", key: "ox905f" }]
      ]
    };
    __iconData7.node;
    Unlink = createLucideIcon(__iconData7);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/layers.mjs
var layers_exports = {};
__export(layers_exports, {
  __iconData: () => __iconData8,
  default: () => Layers
});
var __iconData8, Layers;
var init_layers = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/layers.mjs"() {
    init_createLucideIcon();
    __iconData8 = {
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
    __iconData8.node;
    Layers = createLucideIcon(__iconData8);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/plus.mjs
var plus_exports = {};
__export(plus_exports, {
  __iconData: () => __iconData9,
  default: () => Plus
});
var __iconData9, Plus;
var init_plus = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/plus.mjs"() {
    init_createLucideIcon();
    __iconData9 = {
      name: "plus",
      size: 24,
      node: [
        ["path", { d: "M5 12h14", key: "1ays0h" }],
        ["path", { d: "M12 5v14", key: "s699le" }]
      ]
    };
    __iconData9.node;
    Plus = createLucideIcon(__iconData9);
  }
});

// packages/addons/sites/client/stats/charts.cjs
var require_charts = __commonJS({
  "packages/addons/sites/client/stats/charts.cjs"(exports2, module2) {
    var React2 = require("react");
    var h2 = React2.createElement;
    var ICONS = {
      "refresh": (init_refresh_cw(), __toCommonJS(refresh_cw_exports)).default,
      "globe": (init_globe(), __toCommonJS(globe_exports)).default,
      "link": (init_link_2(), __toCommonJS(link_2_exports)).default,
      "tag": (init_tag(), __toCommonJS(tag_exports)).default,
      "pie": (init_pie_chart(), __toCommonJS(pie_chart_exports)).default,
      "folder": (init_folder_tree(), __toCommonJS(folder_tree_exports)).default,
      "unlink": (init_unlink(), __toCommonJS(unlink_exports)).default,
      "layers": (init_layers(), __toCommonJS(layers_exports)).default,
      "plus": (init_plus(), __toCommonJS(plus_exports)).default
    };
    var COLORS = [
      "var(--dsw-alias-state-business-primary, #4f6ef7)",
      "var(--dsw-alias-state-success-primary, #2f9e6e)",
      "var(--dsw-alias-state-warn-primary, #d99100)",
      "var(--dsw-alias-state-error-primary, #d9534f)",
      "var(--dsw-alias-state-done-primary, #7c5cff)",
      "var(--dsw-alias-state-idle-primary, #8f959e)"
    ];
    function css(prefix) {
      return [
        ".@-stats{display:flex;flex-direction:column;gap:14px;padding:4px 2px 24px;color:var(--dsw-alias-label-primary,#1f2329)}",
        ".@-stoolbar{display:flex;align-items:center;gap:8px;flex-wrap:wrap}",
        ".@-seg{display:inline-flex;border:1px solid var(--dsw-alias-border-l2,#e5e6eb);border-radius:9px;overflow:hidden;background:var(--dsw-alias-bg-layer-1,#fff)}",
        ".@-seg button{appearance:none;border:0;background:transparent;color:var(--dsw-alias-label-secondary,#646a73);font-size:12px;padding:6px 10px;cursor:pointer;white-space:nowrap}",
        ".@-seg button.@-on{background:var(--dsw-alias-brand-primary,#4f6ef7);color:var(--dsw-alias-label-primary-inverted,#fff)}",
        ".@-range{display:inline-flex;align-items:center;gap:4px;border:1px solid var(--dsw-alias-border-l2,#e5e6eb);border-radius:9px;padding:2px 6px;background:var(--dsw-alias-bg-layer-1,#fff)}",
        ".@-range:focus-within{border-color:var(--dsw-alias-brand-primary,#4f6ef7)}",
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
      ].join("\n").replace(/@-/g, prefix + "-");
    }
    function makeCharts(prefix) {
      if (typeof document !== "undefined" && !document.getElementById(prefix + "-charts-css")) {
        var el = document.createElement("style");
        el.id = prefix + "-charts-css";
        el.textContent = css(prefix);
        document.head.appendChild(el);
      }
      function ico(name, size) {
        var C = ICONS[name];
        if (!C) return null;
        return h2(C, { size: size || 13, strokeWidth: 2, "aria-hidden": "true", className: prefix + "-ico" });
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
        return h2(
          "section",
          { className: cls },
          props.title || props.right ? h2(
            "div",
            { className: prefix + "-chead" },
            h2("span", { className: prefix + "-ctitle" }, props.title),
            props.note ? h2("span", { className: prefix + "-cnote" }, props.note) : null,
            props.right ? h2("span", { style: { marginLeft: "auto" } }, props.right) : null
          ) : null,
          props.children
        );
      }
      function Kpi(props) {
        var tone = props.tone ? " " + prefix + "-" + props.tone : "";
        return h2(
          "div",
          { className: prefix + "-kpi" + tone },
          h2("div", { className: prefix + "-kpi-l" }, ico(props.icon, 13), props.label),
          h2(
            "div",
            { className: prefix + "-kpi-v" },
            props.value === null || props.value === void 0 ? "\u2014" : typeof props.value === "number" ? num(props.lang, props.value) : props.value,
            props.unit ? h2("span", { className: prefix + "-kpi-u" }, props.unit) : null
          ),
          props.hint ? h2("div", { className: prefix + "-kpi-h" }, props.hint) : null
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
        return h2(
          "div",
          { className: prefix + "-donut" },
          h2(
            "svg",
            { width: size, height: size, viewBox: "0 0 " + size + " " + size, role: "img", "aria-label": aria },
            h2("circle", { cx: size / 2, cy: size / 2, r, fill: "none", stroke: "var(--dsw-alias-bg-skeleton,#f2f3f5)", strokeWidth: 18 }),
            total > 0 ? data.map(function(d, i) {
              var len = Number(d.count) / total * c;
              var seg = h2("circle", {
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
              }, h2("title", null, d.label + "\uFF1A" + d.count));
              offset += len;
              return seg;
            }) : null,
            h2("text", { x: size / 2, y: size / 2 - 2, textAnchor: "middle", fill: "var(--dsw-alias-label-primary,#1f2329)", fontSize: 24, fontWeight: 650 }, num(props.lang, total)),
            h2("text", { x: size / 2, y: size / 2 + 18, textAnchor: "middle", fill: "var(--dsw-alias-label-tertiary,#8f959e)", fontSize: 11 }, props.centerLabel || "")
          ),
          h2("div", { className: prefix + "-legend" }, (props.data || []).map(function(d, i) {
            return h2(
              "div",
              { key: d.key || d.label || i, className: prefix + "-leg" },
              h2("span", { className: prefix + "-dot", style: { background: d.color || COLORS[i % COLORS.length] } }),
              h2("span", null, d.label),
              h2("b", null, num(props.lang, d.count))
            );
          }))
        );
      }
      function BarList(props) {
        var data = props.data || [];
        var max = Number(props.max || 0) || data.reduce(function(m, d) {
          return Math.max(m, Number(d.value || 0));
        }, 0) || 1;
        return h2("div", { className: prefix + "-bars" }, data.map(function(d, i) {
          var v = Number(d.value || 0);
          return h2(
            "div",
            { key: d.key || d.label || i, className: prefix + "-bar" },
            h2("span", { className: prefix + "-bar-l", title: d.title || d.label }, d.label),
            h2("span", { className: prefix + "-bar-t" }, h2("span", { className: prefix + "-bar-f", style: { width: Math.max(2, v / max * 100) + "%", background: d.color || props.color || COLORS[0] } })),
            h2("span", { className: prefix + "-bar-v" }, props.format ? props.format(v) : num(props.lang, v))
          );
        }));
      }
      function StackedRows(props) {
        var rows = props.rows || [];
        var keys = props.keys || [];
        return h2("div", { className: prefix + "-stack" }, rows.map(function(row, ri) {
          var total = Number(row.total || 0) || 1;
          return h2(
            "div",
            { key: row.key || ri },
            h2("div", { className: prefix + "-srow-l" }, h2("span", null, row.label), h2("b", null, num(props.lang, row.total))),
            h2("div", { className: prefix + "-strack" }, keys.map(function(k, i) {
              var v = Number(row.parts && row.parts[k.key] || 0);
              if (v <= 0) return null;
              return h2("span", {
                key: k.key,
                className: prefix + "-seg-f",
                title: k.label + " " + v,
                style: { width: v / total * 100 + "%", background: k.color || COLORS[i % COLORS.length] }
              });
            }))
          );
        }));
      }
      function Trend(props) {
        var data = props.data || [];
        var series = props.series || [];
        var width = 640;
        var height = props.height || 200;
        var left = 30, right = 10, top = 12, bottom = 24;
        var pw = width - left - right, ph = height - top - bottom;
        var max = 1;
        data.forEach(function(d) {
          series.forEach(function(s) {
            max = Math.max(max, Number(d[s.key] || 0));
          });
        });
        max = Math.ceil(max * 1.15) || 1;
        function x(i2) {
          return left + (data.length <= 1 ? pw / 2 : i2 / (data.length - 1) * pw);
        }
        function y(v) {
          return top + ph - Number(v || 0) / max * ph;
        }
        var ticks = [];
        for (var t = 0; t <= 3; t++) ticks.push(Math.round(max / 3 * t));
        var labelIdx = [];
        if (data.length) {
          var step = Math.max(1, Math.floor(data.length / 5));
          for (var i = 0; i < data.length; i += step) labelIdx.push(i);
          if (labelIdx[labelIdx.length - 1] !== data.length - 1) labelIdx.push(data.length - 1);
        }
        var aria = series.map(function(s) {
          return s.label + " " + data.reduce(function(n, d) {
            return n + Number(d[s.key] || 0);
          }, 0);
        }).join("\uFF0C");
        return h2(
          "div",
          null,
          h2(
            "svg",
            { className: prefix + "-trend", viewBox: "0 0 " + width + " " + height, role: "img", "aria-label": props.aria || aria },
            ticks.map(function(v, i2) {
              return h2(
                "g",
                { key: "t" + i2 },
                h2("line", { x1: left, x2: width - right, y1: y(v), y2: y(v), stroke: "var(--dsw-alias-border-l1,#f2f3f5)", strokeWidth: 1 }),
                h2("text", { x: left - 5, y: y(v) + 3, textAnchor: "end", fontSize: 9, fill: "var(--dsw-alias-label-tertiary,#8f959e)" }, num(props.lang, v))
              );
            }),
            series.map(function(s, si) {
              var pts = data.map(function(d, i2) {
                return x(i2) + "," + y(d[s.key]);
              }).join(" ");
              return h2(
                "g",
                { key: s.key },
                h2("polyline", { points: pts, fill: "none", stroke: s.color || COLORS[si % COLORS.length], strokeWidth: 2, strokeLinejoin: "round", strokeLinecap: "round" }),
                data.map(function(d, i2) {
                  if (data.length > 40 && i2 % 3 !== 0) return null;
                  return h2(
                    "circle",
                    { key: i2, cx: x(i2), cy: y(d[s.key]), r: 2.4, fill: s.color || COLORS[si % COLORS.length] },
                    h2("title", null, d.bucket + "\uFF1A" + s.label + " " + (d[s.key] || 0))
                  );
                })
              );
            }),
            labelIdx.map(function(i2) {
              return h2("text", { key: "x" + i2, x: x(i2), y: height - 6, textAnchor: "middle", fontSize: 9, fill: "var(--dsw-alias-label-tertiary,#8f959e)" }, String(data[i2].bucket).slice(5));
            })
          ),
          h2("div", { className: prefix + "-tlegend" }, series.map(function(s, i2) {
            return h2(
              "span",
              { key: s.key, style: { display: "inline-flex", alignItems: "center", gap: 5 } },
              h2("span", { className: prefix + "-dot", style: { background: s.color || COLORS[i2 % COLORS.length] } }),
              s.label
            );
          }))
        );
      }
      function Histogram(props) {
        var data = props.data || [];
        var max = data.reduce(function(m, d) {
          return Math.max(m, Number(d.count || 0));
        }, 0) || 1;
        return h2(
          "div",
          { className: prefix + "-hist", role: "img", "aria-label": props.aria || data.map(function(d) {
            return d.label + " " + d.count;
          }).join("\uFF0C") },
          data.map(function(d, i) {
            return h2(
              "div",
              { key: d.key || d.label || i, className: prefix + "-hbar", title: d.label + "\uFF1A" + d.count },
              h2("span", { className: prefix + "-hbar-v" }, num(props.lang, d.count)),
              h2("span", { className: prefix + "-hbar-f", style: { height: Math.max(2, Number(d.count || 0) / max * 100) + "%", background: d.color || props.color || COLORS[0] } }),
              h2("span", { className: prefix + "-hbar-l" }, d.label)
            );
          })
        );
      }
      function DataTable(props) {
        var cols = props.columns || [];
        var rows = props.rows || [];
        if (!rows.length) return h2("div", { className: prefix + "-empty" }, props.empty || "\u6682\u65E0\u6570\u636E");
        return h2("div", { className: prefix + "-table-scroll", tabIndex: 0, role: "region", "aria-label": props.lang === "en" ? "Data table" : "\u6570\u636E\u8868\u683C" }, h2(
          "table",
          { className: prefix + "-table" },
          h2("thead", null, h2("tr", null, cols.map(function(c) {
            return h2("th", { key: c.key, className: c.num ? prefix + "-num" : "" }, c.label);
          }))),
          h2("tbody", null, rows.map(function(row, ri) {
            return h2("tr", { key: row.id || row.key || ri }, cols.map(function(c) {
              return h2("td", { key: c.key, className: c.num ? prefix + "-num" : "" }, c.render ? c.render(row) : row[c.key]);
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
        return h2(
          "div",
          { className: prefix + "-stoolbar" },
          h2("div", { className: prefix + "-seg", role: "group", "aria-label": props.aria || "\u65F6\u95F4\u8303\u56F4" }, (props.options || []).map(function(o) {
            return h2("button", {
              key: o.key,
              type: "button",
              className: o.key === props.value ? prefix + "-on" : "",
              "aria-pressed": !!props.value && o.key === props.value,
              onClick: function() {
                props.onChange(o.key);
              }
            }, o.label);
          })),
          h2(
            "div",
            { className: prefix + "-range", role: "group", "aria-label": props.customAria || "\u81EA\u5B9A\u4E49\u65E5\u671F\u8303\u56F4" },
            h2("input", {
              type: "date",
              className: prefix + "-date",
              value: from,
              max: props.today || void 0,
              "aria-label": props.fromLabel || "\u8D77\u59CB\u65E5\u671F",
              title: props.fromLabel || "\u8D77\u59CB\u65E5\u671F",
              onChange: function(e) {
                setDate("from", e.target.value);
              }
            }),
            h2("span", { className: prefix + "-dash", "aria-hidden": "true" }, "\u2013"),
            h2("input", {
              type: "date",
              className: prefix + "-date",
              value: to,
              min: from || void 0,
              max: props.today || void 0,
              "aria-label": props.toLabel || "\u7EC8\u6B62\u65E5\u671F",
              title: props.toLabel || "\u7EC8\u6B62\u65E5\u671F",
              onChange: function(e) {
                setDate("to", e.target.value);
              }
            }),
            from || to ? h2("button", {
              type: "button",
              className: prefix + "-clear",
              "aria-label": props.clearLabel || "\u6E05\u9664\u81EA\u5B9A\u4E49\u8303\u56F4",
              title: props.clearLabel || "\u6E05\u9664\u81EA\u5B9A\u4E49\u8303\u56F4",
              onClick: function() {
                if (props.onCustomClear) props.onCustomClear();
              }
            }, "\xD7") : null
          ),
          props.customHint ? h2("span", { className: prefix + "-hint", role: "status" }, props.customHint) : null,
          h2("button", { type: "button", className: prefix + "-ghost", disabled: !!props.loading, onClick: props.onRefresh }, ico("refresh", 13), props.refreshLabel || "\u5237\u65B0"),
          h2("span", { className: prefix + "-muted" }, props.generatedAt ? (props.timeLabel || "\u622A\u81F3") + " " + timeText(props.generatedAt) : ""),
          props.right ? h2("span", { style: { marginLeft: "auto" } }, props.right) : null
        );
      }
      function Empty(props) {
        return h2("div", { className: prefix + "-empty" }, props.text || "\u6682\u65E0\u6570\u636E");
      }
      function Skeleton() {
        return h2(
          "div",
          { className: prefix + "-sgrid" },
          h2("div", { className: prefix + "-kpis" }, [0, 1, 2, 3].map(function(i) {
            return h2(
              "div",
              { key: i, className: prefix + "-kpi" },
              h2("div", { className: prefix + "-sk", style: { width: "40%" } }),
              h2("div", { className: prefix + "-sk", style: { width: "65%", height: 26 } })
            );
          })),
          [0, 1].map(function(i) {
            return h2(
              "div",
              { key: "c" + i, className: prefix + "-scard " + prefix + "-span-6" },
              h2("div", { className: prefix + "-sk", style: { width: "30%" } }),
              h2("div", { className: prefix + "-sk", style: { height: 120 } })
            );
          })
        );
      }
      function ErrorBar(props) {
        return h2(
          "div",
          { className: prefix + "-err", role: "alert" },
          h2("span", null, props.message),
          props.onRetry ? h2("button", { type: "button", className: prefix + "-ghost", onClick: props.onRetry }, props.retryLabel || "\u91CD\u8BD5") : null
        );
      }
      function Warnings(props) {
        var items = props.items || [];
        if (!items.length) return null;
        return h2("div", { className: prefix + "-warn", role: "status" }, items.map(function(w) {
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
        colors: COLORS
      };
    }
    module2.exports = { makeCharts };
  }
});

// packages/addons/sites/client/views/config.cjs
var require_config = __commonJS({
  "packages/addons/sites/client/views/config.cjs"(exports2, module2) {
    var React2 = require("react");
    var h2 = React2.createElement;
    var DOMAIN = "sites";
    var PREFIX = "wbs";
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
      ".__P__-cfg-btn{display:inline-flex;align-items:center;gap:4px;border:1px solid transparent;background:transparent;color:var(--cfg-muted);border-radius:8px;padding:5px 9px;font:inherit;font-size:11.5px;cursor:pointer;white-space:nowrap;transition:background .12s ease,color .12s ease,border-color .12s ease}",
      ".__P__-cfg-btn:hover{background:var(--cfg-hover);color:var(--dsw-alias-label-primary,inherit)}",
      ".__P__-cfg-btn:focus-visible{outline:2px solid var(--dsw-alias-brand-primary,currentColor);outline-offset:2px}",
      ".__P__-cfg-btn:disabled{opacity:.45;cursor:not-allowed}",
      ".__P__-cfg-btn-outline{border-color:var(--cfg-line);color:var(--dsw-alias-label-primary,inherit)}",
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
      var stateS = React2.useState({
        ready: false,
        values: Object.assign({}, fb),
        items: [],
        groups: [],
        overrides: {},
        error: "",
        state: null
      });
      var state = stateS[0], setState = stateS[1];
      React2.useEffect(function() {
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
      }, [api]);
      return state;
    }
    function ConfigView(props) {
      var api = props.api;
      var lang = props.lang === "en" ? "en" : "zh";
      var t = COPY[lang];
      var loadS = React2.useState(true);
      var loading = loadS[0], setLoading = loadS[1];
      var stateS = React2.useState(null);
      var state = stateS[0], setState = stateS[1];
      var errS = React2.useState("");
      var err = errS[0], setErr = errS[1];
      var noticeS = React2.useState({ id: "", text: "", error: false });
      var notice = noticeS[0], setNotice = noticeS[1];
      var savingS = React2.useState("");
      var savingId = savingS[0], setSavingId = savingS[1];
      var draftsS = React2.useState({});
      var drafts = draftsS[0], setDrafts = draftsS[1];
      var busyS = React2.useState(false);
      var busy = busyS[0], setBusy = busyS[1];
      React2.useEffect(function() {
        injectCss();
      }, []);
      var load = React2.useCallback(function() {
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
      }, [api]);
      React2.useEffect(function() {
        load();
      }, [load]);
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
        return Promise.resolve(api.call(DOMAIN + ".configSet", { values: (function() {
          var o = {};
          o[id] = value;
          return o;
        })() })).then(function(r) {
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
          return h2("select", {
            className: PREFIX + "-cfg-select",
            value: String(value),
            onChange: function(e) {
              var hit = (item.options || []).filter(function(o) {
                return String(o.value) === e.target.value;
              })[0];
              if (hit) save(item.id, hit.value);
            }
          }, (item.options || []).map(function(o) {
            return h2("option", { key: String(o.value), value: String(o.value) }, optionLabel(o, lang));
          }));
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
          return h2("div", { className: PREFIX + "-cfg-multi" }, (item.options || []).map(function(o) {
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
          }));
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
      if (loading && !state) body.push(h2(
        "div",
        { key: "loading", className: PREFIX + "-cfg-loading", "aria-busy": "true" },
        h2("span", { className: PREFIX + "-cfg-sr" }, t.loading),
        h2("div", { className: PREFIX + "-cfg-sk" }),
        h2("div", { className: PREFIX + "-cfg-sk" }),
        h2("div", { className: PREFIX + "-cfg-sk" })
      ));
      if (!loading && err && !state) {
        body.push(h2(
          "div",
          { key: "err", className: PREFIX + "-cfg-error" },
          h2("span", null, t.loadFail + " " + err),
          h2("button", { type: "button", className: PREFIX + "-cfg-btn", onClick: load }, t.retry)
        ));
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
          body.push(h2(
            "section",
            { key: "g-" + g.id, className: PREFIX + "-cfg-group" },
            h2(
              "div",
              { className: PREFIX + "-cfg-gtitle" },
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
                  overridden ? h2("button", {
                    type: "button",
                    className: PREFIX + "-cfg-btn",
                    disabled: busy,
                    onClick: function() {
                      resetItem(item.id);
                    },
                    title: t.reset
                  }, t.reset) : null
                )
              );
            })
          ));
        });
        if (!items.length && !loading) body.push(h2("div", { key: "empty", className: PREFIX + "-cfg-empty" }, t.empty));
        var anyOverride = Object.keys(state.overrides || {}).length > 0;
        body.push(h2(
          "div",
          { key: "foot", className: PREFIX + "-cfg-foot" },
          h2(
            "span",
            { className: PREFIX + "-cfg-changed" },
            anyOverride ? Object.keys(state.overrides || {}).length + (lang === "en" ? " changed" : " \u9879\u5DF2\u4FEE\u6539") : lang === "en" ? "All preferences are at their defaults" : "\u5168\u90E8\u914D\u7F6E\u5747\u4E3A\u9ED8\u8BA4\u503C"
          ),
          h2("span", { className: PREFIX + "-cfg-grow" }),
          anyOverride ? h2("button", { type: "button", className: PREFIX + "-cfg-btn " + PREFIX + "-cfg-btn-outline", disabled: busy, onClick: resetAll }, busy ? t.resetting : t.resetAll) : null
        ));
        var warn = (state.warnings || []).filter(function(w) {
          return w && w.message;
        });
        if (warn.length) {
          body.push(h2(
            "div",
            { key: "warn", className: PREFIX + "-cfg-error" },
            h2("span", null, warn.map(function(w) {
              return w.message;
            }).join("\uFF1B"))
          ));
        }
      }
      return h2(
        "div",
        { className: PREFIX + "-cfg" },
        h2(
          "div",
          { className: PREFIX + "-cfg-head" },
          h2(
            "div",
            { className: PREFIX + "-cfg-headmain" },
            h2("h2", null, t.title),
            h2("div", { className: PREFIX + "-cfg-note" }, t.note)
          ),
          notice.text ? h2("div", { key: "notice", className: PREFIX + "-cfg-status" + (notice.error ? " err" : ""), role: "status" }, notice.text) : null
        ),
        body
      );
    }
    module2.exports = { ConfigView, useConfig, DOMAIN };
  }
});

// packages/addons/sites/client/views/stats.cjs
var require_stats = __commonJS({
  "packages/addons/sites/client/views/stats.cjs"(exports2, module2) {
    var React2 = require("react");
    var h2 = React2.createElement;
    var charts = require_charts();
    var configView = require_config();
    var COPY = {
      zh: {
        range7: "\u8FD1 7 \u5929",
        range30: "\u8FD1 30 \u5929",
        range90: "\u8FD1 90 \u5929",
        range365: "\u8FD1 1 \u5E74",
        rangeAll: "\u5168\u90E8",
        refresh: "\u5237\u65B0",
        asOf: "\u622A\u81F3",
        retry: "\u91CD\u8BD5",
        loadFail: "\u7EDF\u8BA1\u670D\u52A1\u672A\u5C31\u7EEA\uFF0C\u8BF7\u5347\u7EA7\u63D2\u4EF6\u540E\u91CD\u8BD5",
        rangeFrom: "\u8D77\u59CB\u65E5\u671F",
        rangeTo: "\u7EC8\u6B62\u65E5\u671F",
        rangeClear: "\u6E05\u9664\u81EA\u5B9A\u4E49\u8303\u56F4",
        rangeCustom: "\u81EA\u5B9A\u4E49\u65E5\u671F\u8303\u56F4",
        rangeIncomplete: "\u8BF7\u9009\u62E9\u5B8C\u6574\u7684\u8D77\u59CB\u4E0E\u7EC8\u6B62\u65E5\u671F",
        rangeInvalid: "\u8D77\u59CB\u65E5\u671F\u4E0D\u80FD\u665A\u4E8E\u7EC8\u6B62\u65E5\u671F",
        sites: "\u7AD9\u70B9\u603B\u6570",
        bindable: "\u53EF\u7ED1\u5B9A",
        tagged: "\u6709\u6807\u7B7E",
        coverage: "\u6807\u7B7E\u8986\u76D6\u7387",
        nodes: "\u76EE\u5F55\u6570",
        noLink: "\u65E0\u94FE\u63A5",
        multiLink: "\u591A\u94FE\u63A5",
        newSites: "\u8303\u56F4\u5185\u65B0\u589E\u7AD9\u70B9",
        current: "\u5F53\u524D",
        inRange: "\u8303\u56F4\u5185",
        ofTotal: "\u5360\u603B\u91CF",
        links: "\u94FE\u63A5\u5065\u5EB7",
        linksNote: "\u6309\u7AD9\u70B9\u94FE\u63A5\u6570\u5206\u6876",
        freshness: "\u66F4\u65B0\u65B0\u9C9C\u5EA6",
        freshnessNote: "\u8DDD\u6700\u8FD1\u4E00\u6B21\u66F4\u65B0",
        nodeDist: "\u76EE\u5F55\u5206\u5E03",
        nodeNote: "\u542B\u5B50\u6811\u7AD9\u70B9\u6570",
        topTags: "\u6807\u7B7E Top",
        topTagsNote: "\u6309\u5173\u8054\u7AD9\u70B9\u6570\u6392\u5E8F",
        trend: "\u65B0\u589E\u7AD9\u70B9 / \u76EE\u5F55\u8D8B\u52BF",
        trendNote: "\u6309\u81EA\u7136\u65E5 / \u5468 / \u6708\u5206\u6876",
        siteSeries: "\u65B0\u589E\u7AD9\u70B9",
        nodeSeries: "\u65B0\u589E\u76EE\u5F55",
        stale: "\u6700\u4E45\u672A\u66F4\u65B0",
        staleNote: "\u6309\u672A\u66F4\u65B0\u5929\u6570\u964D\u5E8F",
        duplicates: "\u91CD\u590D URL",
        duplicatesNote: "\u5F52\u4E00\u5316\u540E\u8BA1\u6570 > 1",
        orphans: "\u65E0\u76EE\u5F55\u7AD9\u70B9",
        orphansNote: "\u7F3A\u5C11\u76EE\u5F55\u6620\u5C04",
        emptyNodes: "\u7A7A\u76EE\u5F55",
        emptyNodesNote: "\u542B\u5B50\u6811 0 \u4E2A\u7AD9\u70B9",
        colName: "\u540D\u79F0",
        colSubtree: "\u5B50\u6811\u7AD9\u70B9",
        colShare: "\u5360\u6BD4",
        colDirect: "\u76F4\u63A5",
        colDepth: "\u5C42\u7EA7",
        colUpdated: "\u6700\u8FD1\u66F4\u65B0",
        colAge: "\u672A\u66F4\u65B0\u5929\u6570",
        colUrl: "URL",
        colSites: "\u7AD9\u70B9",
        noStale: "\u6CA1\u6709\u9648\u65E7\u7AD9\u70B9",
        noDup: "\u6CA1\u6709\u91CD\u590D URL",
        noOrphan: "\u6240\u6709\u7AD9\u70B9\u90FD\u5DF2\u5F52\u6863",
        noEmpty: "\u6CA1\u6709\u7A7A\u76EE\u5F55",
        noData: "\u8FD8\u6CA1\u6709\u7AD9\u70B9\u3002\u5728\u300C\u7AD9\u70B9\u300D\u9875\u6536\u85CF\u540E\uFF0C\u8FD9\u91CC\u4F1A\u81EA\u52A8\u6C47\u603B",
        noTagDomain: "\u6807\u7B7E\u63D2\u4EF6\u672A\u542F\u7528\uFF0C\u6807\u7B7E\u76F8\u5173\u533A\u5757\u5DF2\u9690\u85CF"
      },
      en: {
        range7: "7 days",
        range30: "30 days",
        range90: "90 days",
        range365: "1 year",
        rangeAll: "All",
        refresh: "Refresh",
        asOf: "As of",
        retry: "Retry",
        loadFail: "Stats service not ready. Upgrade the plugin and retry.",
        rangeFrom: "Start date",
        rangeTo: "End date",
        rangeClear: "Clear custom range",
        rangeCustom: "Custom date range",
        rangeIncomplete: "Pick both start and end dates",
        rangeInvalid: "Start date must not be after end date",
        sites: "Sites",
        bindable: "Bindable",
        tagged: "Tagged",
        coverage: "Tag coverage",
        nodes: "Folders",
        noLink: "No link",
        multiLink: "Multi-link",
        newSites: "New sites",
        current: "Current",
        inRange: "In range",
        ofTotal: "of total",
        links: "Link health",
        linksNote: "Sites by link count",
        freshness: "Freshness",
        freshnessNote: "Since last update",
        nodeDist: "Folder distribution",
        nodeNote: "Sites in subtree",
        topTags: "Top tags",
        topTagsNote: "By linked sites",
        trend: "New sites / folders",
        trendNote: "Bucketed by day / week / month",
        siteSeries: "Sites",
        nodeSeries: "Folders",
        stale: "Stalest sites",
        staleNote: "Oldest update first",
        duplicates: "Duplicate URLs",
        duplicatesNote: "Normalized count > 1",
        orphans: "Sites without folder",
        orphansNote: "Missing folder mapping",
        emptyNodes: "Empty folders",
        emptyNodesNote: "0 sites in subtree",
        colName: "Name",
        colSubtree: "Sites",
        colShare: "Share",
        colDirect: "Direct",
        colDepth: "Depth",
        colUpdated: "Updated",
        colAge: "Days idle",
        colUrl: "URL",
        colSites: "Sites",
        noStale: "No stale sites",
        noDup: "No duplicate URLs",
        noOrphan: "All sites are filed",
        noEmpty: "No empty folders",
        noData: "No sites yet. Save one on the Sites page and the summary appears here.",
        noTagDomain: "Tag plugin is not enabled; tag blocks are hidden."
      }
    };
    var RANGES = ["7d", "30d", "90d", "365d", "all"];
    var CFG_FALLBACK = { "stats.range": "30d", "stats.top": 10, "stats.showKpi": true };
    function SitesStatsView(props) {
      var lang = props.lang === "en" ? "en" : "zh";
      var cfg = configView.useConfig(props.api, CFG_FALLBACK);
      if (!cfg.ready) {
        return h2("div", { style: { padding: "48px", textAlign: "center", fontSize: "12.5px", opacity: 0.6 } }, lang === "en" ? "Loading\u2026" : "\u8F7D\u5165\u4E2D\u2026");
      }
      return h2(SitesStatsBody, Object.assign({}, props, { cfg: cfg.values }));
    }
    function SitesStatsBody(props) {
      var lang = props.lang === "en" ? "en" : "zh";
      var t = COPY[lang];
      var api = props.api;
      var cfg = props.cfg || {};
      var cfgRange = RANGES.indexOf(cfg["stats.range"]) >= 0 ? cfg["stats.range"] : "30d";
      var cfgTop = Math.floor(Number(cfg["stats.top"]));
      if (!(cfgTop >= 5)) cfgTop = 10;
      if (cfgTop > 20) cfgTop = 20;
      var cfgSections = Array.isArray(cfg["stats.sections"]) ? cfg["stats.sections"] : null;
      function sectionOn(key) {
        return !cfgSections || cfgSections.indexOf(key) >= 0;
      }
      var ch = React2.useMemo(function() {
        return charts.makeCharts("wbs");
      }, []);
      var rangePair = React2.useState(cfgRange);
      var range = rangePair[0], setRange = rangePair[1];
      var dataPair = React2.useState(null);
      var data = dataPair[0], setData = dataPair[1];
      var errPair = React2.useState("");
      var err = errPair[0], setErr = errPair[1];
      var loadPair = React2.useState(true);
      var loading = loadPair[0], setLoading = loadPair[1];
      var req = React2.useRef(0);
      var customPair = React2.useState(null);
      var custom = customPair[0], setCustom = customPair[1];
      var todayDay = React2.useMemo(function() {
        var d = /* @__PURE__ */ new Date();
        function p(n) {
          return String(n).padStart(2, "0");
        }
        return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate());
      }, []);
      var customFrom = custom && custom.from ? custom.from : "";
      var customTo = custom && custom.to ? custom.to : "";
      var customOk = !!(customFrom && customTo && customFrom <= customTo);
      var customHint = "";
      if (!customOk && (customFrom || customTo)) {
        customHint = customFrom && customTo ? t.rangeInvalid : t.rangeIncomplete;
      }
      var load = React2.useCallback(function(silent) {
        if ((customFrom || customTo) && !customOk) return Promise.resolve();
        var id = ++req.current;
        if (!silent) setLoading(true);
        var args = { top: cfgTop };
        if (customOk) {
          args.from = customFrom;
          args.to = customTo;
        } else {
          args.range = range;
        }
        return Promise.resolve(api.call("sites.statsReport", args)).then(function(r) {
          return r && r.result !== void 0 ? r.result : r;
        }).then(function(d) {
          if (id === req.current) {
            setData(d);
            setErr("");
          }
        }).catch(function(e) {
          if (id === req.current) setErr(String(e && e.message || e || "load failed"));
        }).then(function() {
          if (id === req.current) setLoading(false);
        });
      }, [api, range, customOk, customFrom, customTo]);
      React2.useEffect(function() {
        load(false);
      }, [load]);
      React2.useEffect(function() {
        if (!api || typeof api.subscribe !== "function") return void 0;
        var timer = null;
        var pending = false;
        var off = api.subscribe(function(payload) {
          var ev = payload && payload.event;
          if (ev !== "sites-changed" && ev !== "site-nodes-changed" && ev !== "tags-changed") return;
          if (typeof document !== "undefined" && document.visibilityState && document.visibilityState !== "visible") {
            pending = true;
            return;
          }
          if (timer) clearTimeout(timer);
          timer = setTimeout(function() {
            load(true);
          }, 800);
        });
        function onVisible() {
          if (typeof document !== "undefined" && document.visibilityState === "visible" && pending) {
            pending = false;
            load(true);
          }
        }
        if (typeof document !== "undefined") document.addEventListener("visibilitychange", onVisible);
        return function() {
          if (timer) clearTimeout(timer);
          if (typeof document !== "undefined") document.removeEventListener("visibilitychange", onVisible);
          if (typeof off === "function") off();
        };
      }, [api, load]);
      var options = RANGES.map(function(key) {
        return { key, label: t["range" + (key === "all" ? "All" : key.replace("d", ""))] };
      });
      var children = [];
      if (!data && loading) children.push(h2(ch.Skeleton, { key: "sk" }));
      if (!data && !loading && err) children.push(h2(ch.Card, { key: "err", span: 12 }, h2(ch.Empty, { text: t.loadFail })));
      if (data && data.totals) {
        var totals = data.totals;
        var rates = data.rates || {};
        var b = data.breakdowns || {};
        var tagMissing = rates.tagCoverage === null || rates.tagCoverage === void 0;
        children.push(h2(
          "div",
          { key: "kpi", className: "wbs-kpis" },
          h2(ch.Kpi, { label: t.sites, icon: "globe", value: totals.sites, hint: t.current, lang }),
          h2(ch.Kpi, { label: t.bindable, icon: "link", value: totals.bindable, hint: ch.pct(rates.bindableRatio) + " " + t.ofTotal, lang }),
          h2(ch.Kpi, { label: t.tagged, icon: "tag", value: tagMissing ? "\u2014" : totals.tagged, hint: tagMissing ? t.noTagDomain : ch.pct(rates.tagCoverage) + " " + t.ofTotal, lang }),
          h2(ch.Kpi, { label: t.coverage, icon: "pie", value: tagMissing ? "\u2014" : ch.pct(rates.tagCoverage), hint: t.current, tone: tagMissing ? "" : "ok", lang }),
          h2(ch.Kpi, { label: t.nodes, icon: "folder", value: totals.nodes, hint: t.current, lang }),
          h2(ch.Kpi, { label: t.noLink, icon: "unlink", value: totals.noLink, hint: ch.pct(rates.linkCoverage) + " " + t.ofTotal, tone: totals.noLink > 0 ? "warn" : "", lang }),
          h2(ch.Kpi, { label: t.multiLink, icon: "layers", value: totals.multiLink, hint: t.current, lang }),
          h2(ch.Kpi, { label: t.newSites, icon: "plus", value: totals.newSites, hint: t.inRange, lang })
        ));
        if (totals.sites === 0 && totals.nodes === 0) {
          children.push(h2(ch.Card, { key: "empty", span: 12 }, h2(ch.Empty, { text: t.noData })));
        } else {
          children.push(h2(
            ch.Card,
            { key: "links", span: 4, title: t.links, note: t.linksNote },
            h2(ch.Donut, {
              data: (b.links || []).map(function(x, i) {
                return { key: x.key, label: x.label, count: x.count, color: ch.colors[i] };
              }),
              total: totals.sites,
              lang,
              centerLabel: t.sites,
              aria: (b.links || []).map(function(x) {
                return x.label + " " + x.count;
              }).join("\uFF0C")
            })
          ));
          children.push(h2(
            ch.Card,
            { key: "fresh", span: 4, title: t.freshness, note: t.freshnessNote },
            h2(ch.Histogram, { data: b.freshness || [], lang, color: ch.colors[2] })
          ));
          children.push(h2(
            ch.Card,
            { key: "nodes", span: 4, title: t.nodeDist, note: t.nodeNote },
            h2(ch.BarList, {
              data: (data.rankings && data.rankings.topNodes || []).map(function(x) {
                return { key: x.id, label: x.name, value: x.subtree, title: x.name };
              }),
              lang,
              color: ch.colors[0]
            })
          ));
          children.push(h2(
            ch.Card,
            { key: "trend", span: 8, title: t.trend, note: t.trendNote },
            h2(ch.Trend, {
              data: data.trend || [],
              lang,
              series: [
                { key: "sites", label: t.siteSeries, color: ch.colors[0] },
                { key: "nodes", label: t.nodeSeries, color: ch.colors[1] }
              ]
            })
          ));
          children.push(h2(
            ch.Card,
            { key: "topTags", span: 4, title: t.topTags, note: t.topTagsNote },
            tagMissing ? h2(ch.Empty, { text: t.noTagDomain }) : h2(ch.BarList, {
              data: (data.rankings && data.rankings.topTags || []).map(function(x) {
                return { key: x.id, label: x.name, value: x.count, title: x.name };
              }),
              lang,
              color: ch.colors[4]
            })
          ));
          children.push(h2(
            ch.Card,
            { key: "stale", span: 6, title: t.stale, note: t.staleNote },
            h2(ch.DataTable, {
              rows: data.lists && data.lists.stale || [],
              lang,
              empty: t.noStale,
              columns: [
                { key: "name", label: t.colName },
                { key: "ageDays", label: t.colAge, num: true },
                { key: "updatedAt", label: t.colUpdated, render: function(r) {
                  return ch.dateText(r.updatedAt);
                } }
              ]
            })
          ));
          children.push(h2(
            ch.Card,
            { key: "dup", span: 6, title: t.duplicates, note: t.duplicatesNote },
            h2(ch.DataTable, {
              rows: data.lists && data.lists.duplicates || [],
              lang,
              empty: t.noDup,
              columns: [
                { key: "url", label: t.colUrl, render: function(r) {
                  return h2("span", { title: r.url }, String(r.url).slice(0, 46) + (String(r.url).length > 46 ? "\u2026" : ""));
                } },
                { key: "sites", label: t.colSites, render: function(r) {
                  return (r.sites || []).map(function(s) {
                    return s.name;
                  }).join("\u3001");
                } }
              ]
            })
          ));
          children.push(h2(
            ch.Card,
            { key: "orphan", span: 6, title: t.orphans, note: t.orphansNote },
            h2(ch.DataTable, {
              rows: data.lists && data.lists.orphanSites || [],
              lang,
              empty: t.noOrphan,
              columns: [{ key: "name", label: t.colName }]
            })
          ));
          children.push(h2(
            ch.Card,
            { key: "emptyNodes", span: 6, title: t.emptyNodes, note: t.emptyNodesNote },
            h2(ch.DataTable, {
              rows: data.lists && data.lists.emptyNodes || [],
              lang,
              empty: t.noEmpty,
              columns: [
                { key: "name", label: t.colName },
                { key: "depth", label: t.colDepth, num: true }
              ]
            })
          ));
        }
        children.push(h2(ch.Warnings, { key: "warn", items: data.warnings || [] }));
      }
      children = children.filter(function(node) {
        var k = node && node.key;
        if (!k || k === "sk" || k === "err" || k === "warn" || k === "empty") return true;
        if (k === "kpi") return cfg["stats.showKpi"] !== false;
        return sectionOn(k);
      });
      return h2(
        "div",
        { className: "wbs-stats" },
        h2(ch.RangeSwitch, {
          options,
          value: customFrom || customTo ? null : range,
          onChange: function(key) {
            setCustom(null);
            setRange(key);
          },
          custom: { from: customFrom, to: customTo },
          onCustomChange: function(next) {
            setCustom({ from: next.from || "", to: next.to || "" });
          },
          onCustomClear: function() {
            setCustom(null);
          },
          customHint,
          today: todayDay,
          fromLabel: t.rangeFrom,
          toLabel: t.rangeTo,
          clearLabel: t.rangeClear,
          customAria: t.rangeCustom,
          onRefresh: function() {
            load(false);
          },
          loading,
          generatedAt: data && data.generatedAt,
          refreshLabel: t.refresh,
          timeLabel: t.asOf
        }),
        err && data ? h2(ch.ErrorBar, { message: err, onRetry: function() {
          load(false);
        }, retryLabel: t.retry }) : null,
        h2("div", { className: "wbs-sgrid" }, children)
      );
    }
    module2.exports = { SitesStatsView };
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
    var React2 = require("react");
    var h2 = React2.createElement;
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
        var tablesS = React2.useState(null);
        var tables = tablesS[0], setTables = tablesS[1];
        var activeS = React2.useState("");
        var active = activeS[0], setActive = activeS[1];
        var dataS = React2.useState(null);
        var data = dataS[0], setData = dataS[1];
        var loadingS = React2.useState(false);
        var loadingRows = loadingS[0], setLoadingRows = loadingS[1];
        var loadingTablesS = React2.useState(true);
        var loadingTables = loadingTablesS[0], setLoadingTables = loadingTablesS[1];
        var errorS = React2.useState("");
        var error = errorS[0], setError = errorS[1];
        var pageS = React2.useState(1);
        var page = pageS[0], setPage = pageS[1];
        var sizeS = React2.useState(0);
        var pageSize = sizeS[0], setPageSize = sizeS[1];
        var sortS = React2.useState("");
        var sort = sortS[0], setSort = sortS[1];
        var orderS = React2.useState("desc");
        var order = orderS[0], setOrder = orderS[1];
        var searchDraftS = React2.useState("");
        var searchDraft = searchDraftS[0], setSearchDraft = searchDraftS[1];
        var searchS = React2.useState("");
        var search = searchS[0], setSearch = searchS[1];
        var filterDraftS = React2.useState({});
        var filterDraft = filterDraftS[0], setFilterDraft = filterDraftS[1];
        var filtersS = React2.useState({});
        var filters = filtersS[0], setFilters = filtersS[1];
        var includeDeletedS = React2.useState(null);
        var includeDeletedRaw = includeDeletedS[0], setIncludeDeleted = includeDeletedS[1];
        var showSystemS = React2.useState(null);
        var showSystemRaw = showSystemS[0], setShowSystem = showSystemS[1];
        var drawerS = React2.useState(null);
        var drawer = drawerS[0], setDrawer = drawerS[1];
        var toastS = React2.useState("");
        var toast = toastS[0], setToast = toastS[1];
        var filtersKey = JSON.stringify(filters);
        var reqRef = React2.useRef(0);
        var toastTimer = React2.useRef(null);
        var refreshS = React2.useState(0);
        function refresh() {
          loadTables();
          refreshS[1](function(n) {
            return n + 1;
          });
        }
        var indexReqRef = React2.useRef(0);
        var indexS = React2.useState(null);
        var index = indexS[0], setIndex = indexS[1];
        var indexBusyS = React2.useState(false);
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
        React2.useEffect(function() {
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
        React2.useEffect(function() {
          if (searchDraft === search) return void 0;
          var timer = setTimeout(function() {
            setSearch(searchDraft);
            setPage(1);
          }, 280);
          return function() {
            clearTimeout(timer);
          };
        }, [searchDraft]);
        React2.useEffect(function() {
          if (JSON.stringify(filterDraft) === JSON.stringify(filters)) return void 0;
          var timer = setTimeout(function() {
            setFilters(filterDraft);
            setPage(1);
          }, 280);
          return function() {
            clearTimeout(timer);
          };
        }, [filterDraft]);
        React2.useEffect(function() {
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
        React2.useEffect(function() {
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
                      return React2.cloneElement(cell, { key: col.name }, cell.props.children, h2("span", { className: P + "-delbadge" }, t.deleted));
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

// packages/addons/sites/client/views/data.cjs
var require_data = __commonJS({
  "packages/addons/sites/client/views/data.cjs"(exports2, module2) {
    "use strict";
    module2.exports = require_data_view()({
      domain: "sites",
      prefix: "wbs",
      tables: ["site", "site_node", "site_node_mapping", "site_account", "site_account_external"],
      useConfig: require_config().useConfig
    });
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/x.mjs
var x_exports = {};
__export(x_exports, {
  __iconData: () => __iconData10,
  default: () => X
});
var __iconData10, X;
var init_x = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/x.mjs"() {
    init_createLucideIcon();
    __iconData10 = {
      name: "x",
      size: 24,
      node: [
        ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
        ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
      ]
    };
    __iconData10.node;
    X = createLucideIcon(__iconData10);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/check.mjs
var check_exports = {};
__export(check_exports, {
  __iconData: () => __iconData11,
  default: () => Check
});
var __iconData11, Check;
var init_check = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/check.mjs"() {
    init_createLucideIcon();
    __iconData11 = {
      name: "check",
      size: 24,
      node: [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]]
    };
    __iconData11.node;
    Check = createLucideIcon(__iconData11);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/pencil.mjs
var pencil_exports = {};
__export(pencil_exports, {
  __iconData: () => __iconData12,
  default: () => Pencil
});
var __iconData12, Pencil;
var init_pencil = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/pencil.mjs"() {
    init_createLucideIcon();
    __iconData12 = {
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
    __iconData12.node;
    Pencil = createLucideIcon(__iconData12);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/trash.mjs
var __iconData13, Trash;
var init_trash = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/trash.mjs"() {
    init_createLucideIcon();
    __iconData13 = {
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
    __iconData13.node;
    Trash = createLucideIcon(__iconData13);
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

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/folder.mjs
var folder_exports = {};
__export(folder_exports, {
  __iconData: () => __iconData14,
  default: () => Folder
});
var __iconData14, Folder;
var init_folder = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/folder.mjs"() {
    init_createLucideIcon();
    __iconData14 = {
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
    __iconData14.node;
    Folder = createLucideIcon(__iconData14);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/folder-open.mjs
var folder_open_exports = {};
__export(folder_open_exports, {
  __iconData: () => __iconData15,
  default: () => FolderOpen
});
var __iconData15, FolderOpen;
var init_folder_open = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/folder-open.mjs"() {
    init_createLucideIcon();
    __iconData15 = {
      name: "folder-open",
      size: 24,
      node: [
        [
          "path",
          {
            d: "m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2",
            key: "usdka0"
          }
        ]
      ]
    };
    __iconData15.node;
    FolderOpen = createLucideIcon(__iconData15);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/folder-plus.mjs
var folder_plus_exports = {};
__export(folder_plus_exports, {
  __iconData: () => __iconData16,
  default: () => FolderPlus
});
var __iconData16, FolderPlus;
var init_folder_plus = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/folder-plus.mjs"() {
    init_createLucideIcon();
    __iconData16 = {
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
    __iconData16.node;
    FolderPlus = createLucideIcon(__iconData16);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/house.mjs
var house_exports = {};
__export(house_exports, {
  __iconData: () => __iconData17,
  default: () => House
});
var __iconData17, House;
var init_house = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/house.mjs"() {
    init_createLucideIcon();
    __iconData17 = {
      name: "house",
      size: 24,
      node: [
        ["path", { d: "M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8", key: "5wwlr5" }],
        [
          "path",
          {
            d: "M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
            key: "r6nss1"
          }
        ]
      ],
      aliases: ["home"]
    };
    __iconData17.node;
    House = createLucideIcon(__iconData17);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/star.mjs
var star_exports = {};
__export(star_exports, {
  __iconData: () => __iconData18,
  default: () => Star
});
var __iconData18, Star;
var init_star = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/star.mjs"() {
    init_createLucideIcon();
    __iconData18 = {
      name: "star",
      size: 24,
      node: [
        [
          "path",
          {
            d: "M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z",
            key: "r04s7s"
          }
        ]
      ]
    };
    __iconData18.node;
    Star = createLucideIcon(__iconData18);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/search.mjs
var search_exports = {};
__export(search_exports, {
  __iconData: () => __iconData19,
  default: () => Search
});
var __iconData19, Search;
var init_search = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/search.mjs"() {
    init_createLucideIcon();
    __iconData19 = {
      name: "search",
      size: 24,
      node: [
        ["path", { d: "m21 21-4.34-4.34", key: "14j7rj" }],
        ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }]
      ]
    };
    __iconData19.node;
    Search = createLucideIcon(__iconData19);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/chevron-left.mjs
var chevron_left_exports = {};
__export(chevron_left_exports, {
  __iconData: () => __iconData20,
  default: () => ChevronLeft
});
var __iconData20, ChevronLeft;
var init_chevron_left = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/chevron-left.mjs"() {
    init_createLucideIcon();
    __iconData20 = {
      name: "chevron-left",
      size: 24,
      node: [["path", { d: "m15 18-6-6 6-6", key: "1wnfg3" }]]
    };
    __iconData20.node;
    ChevronLeft = createLucideIcon(__iconData20);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/chevron-right.mjs
var chevron_right_exports = {};
__export(chevron_right_exports, {
  __iconData: () => __iconData21,
  default: () => ChevronRight
});
var __iconData21, ChevronRight;
var init_chevron_right = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/chevron-right.mjs"() {
    init_createLucideIcon();
    __iconData21 = {
      name: "chevron-right",
      size: 24,
      node: [["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]]
    };
    __iconData21.node;
    ChevronRight = createLucideIcon(__iconData21);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/chevron-down.mjs
var chevron_down_exports = {};
__export(chevron_down_exports, {
  __iconData: () => __iconData22,
  default: () => ChevronDown
});
var __iconData22, ChevronDown;
var init_chevron_down = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/chevron-down.mjs"() {
    init_createLucideIcon();
    __iconData22 = {
      name: "chevron-down",
      size: 24,
      node: [["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]]
    };
    __iconData22.node;
    ChevronDown = createLucideIcon(__iconData22);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/arrow-up.mjs
var arrow_up_exports = {};
__export(arrow_up_exports, {
  __iconData: () => __iconData23,
  default: () => ArrowUp
});
var __iconData23, ArrowUp;
var init_arrow_up = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/arrow-up.mjs"() {
    init_createLucideIcon();
    __iconData23 = {
      name: "arrow-up",
      size: 24,
      node: [
        ["path", { d: "m5 12 7-7 7 7", key: "hav0vg" }],
        ["path", { d: "M12 19V5", key: "x0mq9r" }]
      ]
    };
    __iconData23.node;
    ArrowUp = createLucideIcon(__iconData23);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/arrow-down.mjs
var arrow_down_exports = {};
__export(arrow_down_exports, {
  __iconData: () => __iconData24,
  default: () => ArrowDown
});
var __iconData24, ArrowDown;
var init_arrow_down = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/arrow-down.mjs"() {
    init_createLucideIcon();
    __iconData24 = {
      name: "arrow-down",
      size: 24,
      node: [
        ["path", { d: "M12 5v14", key: "s699le" }],
        ["path", { d: "m19 12-7 7-7-7", key: "1idqje" }]
      ]
    };
    __iconData24.node;
    ArrowDown = createLucideIcon(__iconData24);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/arrow-up-down.mjs
var arrow_up_down_exports = {};
__export(arrow_up_down_exports, {
  __iconData: () => __iconData25,
  default: () => ArrowUpDown
});
var __iconData25, ArrowUpDown;
var init_arrow_up_down = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/arrow-up-down.mjs"() {
    init_createLucideIcon();
    __iconData25 = {
      name: "arrow-up-down",
      size: 24,
      node: [
        ["path", { d: "m21 16-4 4-4-4", key: "f6ql7i" }],
        ["path", { d: "M17 20V4", key: "1ejh1v" }],
        ["path", { d: "m3 8 4-4 4 4", key: "11wl7u" }],
        ["path", { d: "M7 4v16", key: "1glfcx" }]
      ]
    };
    __iconData25.node;
    ArrowUpDown = createLucideIcon(__iconData25);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/key-round.mjs
var key_round_exports = {};
__export(key_round_exports, {
  __iconData: () => __iconData26,
  default: () => KeyRound
});
var __iconData26, KeyRound;
var init_key_round = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/key-round.mjs"() {
    init_createLucideIcon();
    __iconData26 = {
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
    __iconData26.node;
    KeyRound = createLucideIcon(__iconData26);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/lock.mjs
var lock_exports = {};
__export(lock_exports, {
  __iconData: () => __iconData27,
  default: () => Lock
});
var __iconData27, Lock;
var init_lock = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/lock.mjs"() {
    init_createLucideIcon();
    __iconData27 = {
      name: "lock",
      size: 24,
      node: [
        ["rect", { width: "18", height: "11", x: "3", y: "11", rx: "2", ry: "2", key: "1w4ew1" }],
        ["path", { d: "M7 11V7a5 5 0 0 1 10 0v4", key: "fwvmzm" }]
      ]
    };
    __iconData27.node;
    Lock = createLucideIcon(__iconData27);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/eye.mjs
var eye_exports = {};
__export(eye_exports, {
  __iconData: () => __iconData28,
  default: () => Eye
});
var __iconData28, Eye;
var init_eye = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/eye.mjs"() {
    init_createLucideIcon();
    __iconData28 = {
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
    __iconData28.node;
    Eye = createLucideIcon(__iconData28);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/eye-off.mjs
var eye_off_exports = {};
__export(eye_off_exports, {
  __iconData: () => __iconData29,
  default: () => EyeOff
});
var __iconData29, EyeOff;
var init_eye_off = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/eye-off.mjs"() {
    init_createLucideIcon();
    __iconData29 = {
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
    __iconData29.node;
    EyeOff = createLucideIcon(__iconData29);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/chart-column.mjs
var chart_column_exports = {};
__export(chart_column_exports, {
  __iconData: () => __iconData30,
  default: () => ChartColumn
});
var __iconData30, ChartColumn;
var init_chart_column = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/chart-column.mjs"() {
    init_createLucideIcon();
    __iconData30 = {
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
    __iconData30.node;
    ChartColumn = createLucideIcon(__iconData30);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/settings.mjs
var settings_exports = {};
__export(settings_exports, {
  __iconData: () => __iconData31,
  default: () => Settings
});
var __iconData31, Settings;
var init_settings = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/settings.mjs"() {
    init_createLucideIcon();
    __iconData31 = {
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
    __iconData31.node;
    Settings = createLucideIcon(__iconData31);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/database.mjs
var database_exports = {};
__export(database_exports, {
  __iconData: () => __iconData32,
  default: () => Database
});
var __iconData32, Database;
var init_database = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/database.mjs"() {
    init_createLucideIcon();
    __iconData32 = {
      name: "database",
      size: 24,
      node: [
        ["ellipse", { cx: "12", cy: "5", rx: "9", ry: "3", key: "msslwz" }],
        ["path", { d: "M3 5V19A9 3 0 0 0 21 19V5", key: "1wlel7" }],
        ["path", { d: "M3 12A9 3 0 0 0 21 12", key: "mv7ke4" }]
      ]
    };
    __iconData32.node;
    Database = createLucideIcon(__iconData32);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/code-xml.mjs
var code_xml_exports = {};
__export(code_xml_exports, {
  __iconData: () => __iconData33,
  default: () => CodeXml
});
var __iconData33, CodeXml;
var init_code_xml = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/code-xml.mjs"() {
    init_createLucideIcon();
    __iconData33 = {
      name: "code-xml",
      size: 24,
      node: [
        ["path", { d: "m18 16 4-4-4-4", key: "1inbqp" }],
        ["path", { d: "m6 8-4 4 4 4", key: "15zrgr" }],
        ["path", { d: "m14.5 4-5 16", key: "e7oirm" }]
      ],
      aliases: ["code-2"]
    };
    __iconData33.node;
    CodeXml = createLucideIcon(__iconData33);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/copy.mjs
var copy_exports = {};
__export(copy_exports, {
  __iconData: () => __iconData34,
  default: () => Copy
});
var __iconData34, Copy;
var init_copy = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/copy.mjs"() {
    init_createLucideIcon();
    __iconData34 = {
      name: "copy",
      size: 24,
      node: [
        ["rect", { width: "14", height: "14", x: "8", y: "8", rx: "2", ry: "2", key: "17jyea" }],
        ["path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2", key: "zix9uf" }]
      ]
    };
    __iconData34.node;
    Copy = createLucideIcon(__iconData34);
  }
});

// packages/addons/sites/client/ui/icons.cjs
var require_icons = __commonJS({
  "packages/addons/sites/client/ui/icons.cjs"(exports2, module2) {
    "use strict";
    var h2 = require("react").createElement;
    var ICONS = {
      "x": (init_x(), __toCommonJS(x_exports)).default,
      "plus": (init_plus(), __toCommonJS(plus_exports)).default,
      "check": (init_check(), __toCommonJS(check_exports)).default,
      "edit": (init_pencil(), __toCommonJS(pencil_exports)).default,
      "trash": (init_trash_2(), __toCommonJS(trash_2_exports)).default,
      "folder": (init_folder(), __toCommonJS(folder_exports)).default,
      "folder-open": (init_folder_open(), __toCommonJS(folder_open_exports)).default,
      "folder-plus": (init_folder_plus(), __toCommonJS(folder_plus_exports)).default,
      "folder-tree": (init_folder_tree(), __toCommonJS(folder_tree_exports)).default,
      "house": (init_house(), __toCommonJS(house_exports)).default,
      "link": (init_link_2(), __toCommonJS(link_2_exports)).default,
      "tag": (init_tag(), __toCommonJS(tag_exports)).default,
      "star": (init_star(), __toCommonJS(star_exports)).default,
      "search": (init_search(), __toCommonJS(search_exports)).default,
      "refresh": (init_refresh_cw(), __toCommonJS(refresh_cw_exports)).default,
      "chevron-left": (init_chevron_left(), __toCommonJS(chevron_left_exports)).default,
      "chevron-right": (init_chevron_right(), __toCommonJS(chevron_right_exports)).default,
      "chevron-down": (init_chevron_down(), __toCommonJS(chevron_down_exports)).default,
      "arrow-up": (init_arrow_up(), __toCommonJS(arrow_up_exports)).default,
      "arrow-down": (init_arrow_down(), __toCommonJS(arrow_down_exports)).default,
      "arrow-up-down": (init_arrow_up_down(), __toCommonJS(arrow_up_down_exports)).default,
      "key": (init_key_round(), __toCommonJS(key_round_exports)).default,
      "lock": (init_lock(), __toCommonJS(lock_exports)).default,
      "eye": (init_eye(), __toCommonJS(eye_exports)).default,
      "eye-off": (init_eye_off(), __toCommonJS(eye_off_exports)).default,
      "chart": (init_chart_column(), __toCommonJS(chart_column_exports)).default,
      "settings": (init_settings(), __toCommonJS(settings_exports)).default,
      "database": (init_database(), __toCommonJS(database_exports)).default,
      "code-2": (init_code_xml(), __toCommonJS(code_xml_exports)).default,
      "globe": (init_globe(), __toCommonJS(globe_exports)).default,
      "copy": (init_copy(), __toCommonJS(copy_exports)).default
    };
    function Icon2(props) {
      var C = ICONS[props.name];
      if (!C) return null;
      return h2(C, {
        size: props.size || 14,
        strokeWidth: props.strokeWidth || 2,
        "aria-hidden": "true",
        className: "wbs-svg" + (props.className ? " " + props.className : "")
      });
    }
    function tabIcon(name) {
      return function SitesTabIcon() {
        return h2(Icon2, { name, size: 14 });
      };
    }
    module2.exports = { ICONS, Icon: Icon2, tabIcon };
  }
});

// packages/addons/sites/client/ui/copy.cjs
var require_copy = __commonJS({
  "packages/addons/sites/client/ui/copy.cjs"(exports2, module2) {
    "use strict";
    module2.exports = {
      zh: {
        title: "\u7AD9\u70B9",
        all: "\u5168\u90E8\u7AD9\u70B9",
        directory: "\u76EE\u5F55",
        addDir: "\u65B0\u5EFA\u76EE\u5F55",
        addChild: "\u65B0\u5EFA\u5B50\u76EE\u5F55",
        rename: "\u91CD\u547D\u540D",
        remove: "\u5220\u9664\u76EE\u5F55",
        search: "\u641C\u7D22\u7AD9\u70B9\u540D\u79F0\u6216\u63CF\u8FF0",
        newSite: "\u65B0\u5EFA\u7AD9\u70B9",
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
        addLink: "\u6DFB\u52A0\u94FE\u63A5",
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
        tagSearchPlaceholder: "\u641C\u7D22\u6807\u7B7E\u2026",
        tagSelected: "\u5DF2\u9009",
        tagNoMatch: "\u6CA1\u6709\u5339\u914D\u7684\u6807\u7B7E",
        loadingMore: "\u52A0\u8F7D\u4E2D\u2026",
        noMore: "\u6CA1\u6709\u66F4\u591A\u4E86",
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
        moved: "\u5DF2\u79FB\u52A8",
        accounts: "\u8D26\u53F7",
        accountsTitle: "\u7AD9\u70B9\u8D26\u53F7 \xB7 {name}",
        accountsSub: "\u654F\u611F\u5B57\u6BB5\u53EA\u4FDD\u5B58\u5728\u672C\u673A\uFF0C\u5E76\u5728\u5199\u5E93\u524D\u52A0\u5BC6\uFF1B\u4E91\u7AEF\u540C\u6B65\u7684\u662F\u5BC6\u6587\u3002",
        accountKey: "\u6807\u8BC6",
        loginName: "\u767B\u5F55\u540D",
        password: "\u5BC6\u7801",
        phone: "\u624B\u673A\u53F7",
        identity: "\u8EAB\u4EFD\u8BC1",
        remark: "\u5907\u6CE8",
        reveal: "\u663E\u5F62",
        copied: "\u5DF2\u590D\u5236",
        addAccount: "\u65B0\u589E\u8D26\u53F7",
        editAccount: "\u7F16\u8F91\u8D26\u53F7",
        externalPick: "\u9009\u62E9\u8981\u5916\u8054\u7684\u8D26\u53F7",
        externalAdd: "\u6DFB\u52A0\u5916\u8054",
        unlink: "\u89E3\u9664\u5916\u8054",
        accountEmpty: "\u8FD9\u4E2A\u7AD9\u70B9\u8FD8\u6CA1\u6709\u8D26\u53F7",
        cancel: "\u53D6\u6D88",
        close: "\u5173\u95ED",
        sensitiveHint: "\u5BC6\u7801/\u624B\u673A\u53F7/\u8EAB\u4EFD\u8BC1\u5199\u5E93\u524D\u52A0\u5BC6\uFF0C\u4EC5\u5728\u754C\u9762\u89E3\u9501\u4FDD\u9669\u7BB1\u540E\u53EF\u67E5\u770B\u4E0E\u590D\u5236\u3002",
        vaultNotSet: "\u8D26\u53F7\u4FDD\u9669\u7BB1\u5C1A\u672A\u8BBE\u7F6E\u53E3\u4EE4\uFF1A\u8BBE\u7F6E\u53E3\u4EE4\u540E\u624D\u80FD\u586B\u5199\u5BC6\u7801\u3001\u624B\u673A\u53F7\u4E0E\u8EAB\u4EFD\u8BC1\u3002",
        vaultLocked: "\u8D26\u53F7\u4FDD\u9669\u7BB1\u5DF2\u9501\u5B9A\uFF1A\u8F93\u5165\u53E3\u4EE4\u540E\u5373\u53EF\u67E5\u770B\u4E0E\u586B\u5199\u654F\u611F\u5B57\u6BB5\u3002",
        vaultUnlocked: "\u8D26\u53F7\u4FDD\u9669\u7BB1\u5DF2\u89E3\u9501\uFF0C\u7A7A\u95F2 {min} \u5206\u949F\u81EA\u52A8\u9501\u5B9A\u3002",
        vaultSetup: "\u8BBE\u7F6E\u53E3\u4EE4",
        vaultUnlock: "\u89E3\u9501",
        vaultLock: "\u7ACB\u5373\u9501\u5B9A",
        passphrase: "\u8F93\u5165\u53E3\u4EE4\uFF08\u81F3\u5C11 8 \u4F4D\uFF09",
        passphraseAgain: "\u518D\u8F93\u4E00\u6B21\u53E3\u4EE4",
        passTooShort: "\u53E3\u4EE4\u81F3\u5C11 8 \u4F4D",
        passMismatch: "\u4E24\u6B21\u53E3\u4EE4\u4E0D\u4E00\u81F4"
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
        newSite: "New site",
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
        addLink: "Add link",
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
        tagSearchPlaceholder: "Search tags\u2026",
        tagSelected: "Selected",
        tagNoMatch: "No matching tags",
        loadingMore: "Loading\u2026",
        noMore: "No more",
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
        moved: "Moved",
        accounts: "Accounts",
        accountsTitle: "Site accounts \xB7 {name}",
        accountsSub: "Sensitive fields stay on this machine and are encrypted before writing; the cloud only receives ciphertext.",
        accountKey: "Key",
        loginName: "Login",
        password: "Password",
        phone: "Phone",
        identity: "ID card",
        remark: "Remark",
        reveal: "Reveal",
        copied: "Copied",
        addAccount: "New account",
        editAccount: "Edit account",
        externalPick: "Pick an account to link",
        externalAdd: "Add link",
        unlink: "Unlink",
        accountEmpty: "No accounts yet",
        cancel: "Cancel",
        close: "Close",
        sensitiveHint: "Password / phone / ID card are encrypted before writing and can only be read after unlocking the vault.",
        vaultNotSet: "Vault passphrase is not set yet: set one before filling in password, phone or ID card.",
        vaultLocked: "Vault is locked: unlock to view or edit sensitive fields.",
        vaultUnlocked: "Vault unlocked; it locks after {min} idle minutes.",
        vaultSetup: "Set passphrase",
        vaultUnlock: "Unlock",
        vaultLock: "Lock now",
        passphrase: "Passphrase (8+ characters)",
        passphraseAgain: "Repeat passphrase",
        passTooShort: "Passphrase must be at least 8 characters",
        passMismatch: "Passphrases do not match"
      }
    };
  }
});

// packages/addons/sites/client/ui/styles.cjs
var require_styles = __commonJS({
  "packages/addons/sites/client/ui/styles.cjs"(exports2, module2) {
    "use strict";
    module2.exports = [
      ".wbs-root{--wbs-line:var(--dsw-alias-border-l2, color-mix(in srgb, var(--dsw-alias-label-primary,#1f2328) 13%, transparent));--wbs-soft:var(--dsw-alias-interactive-bg-hover, color-mix(in srgb, var(--dsw-alias-label-primary,#1f2328) 4.5%, transparent));--wbs-accent:var(--dsw-alias-brand-primary,#0a8f7d);--wbs-muted:var(--dsw-alias-label-secondary, color-mix(in srgb, var(--dsw-alias-label-primary,#1f2328) 58%, transparent));display:flex;flex-direction:column;min-height:560px;color:var(--dsw-alias-label-primary,#1f2328);font-size:13px}",
      ".wbs-grow{flex:1;min-width:0}",
      ".wbs-head{display:flex;align-items:center;gap:10px;margin:2px 0 14px}",
      ".wbs-badge{width:27px;height:27px;flex:none;border-radius:8px;display:inline-flex;align-items:center;justify-content:center;background:color-mix(in srgb,var(--wbs-accent) 12%,transparent);color:var(--wbs-accent)}",
      ".wbs-head h2{margin:0;font-size:21px;font-weight:650;letter-spacing:.01em}",
      ".wbs-count{font-size:12px;color:var(--wbs-muted)}",
      ".wbs-btn{appearance:none;border:1px solid var(--wbs-line);background:transparent;color:inherit;border-radius:8px;padding:6px 10px;font-size:12px;cursor:pointer;line-height:1.35;white-space:nowrap;font-family:inherit;display:inline-flex;align-items:center;justify-content:center;gap:5px;transition:background .12s ease,border-color .12s ease,color .12s ease}",
      ".wbs-btn:hover{background:var(--wbs-soft)}",
      ".wbs-btn.on{border-color:color-mix(in srgb,var(--wbs-accent) 45%,transparent);color:var(--wbs-accent);background:color-mix(in srgb,var(--wbs-accent) 8%,transparent)}",
      ".wbs-btn.icononly{padding:4px;gap:0}",
      ".wbs-btn:focus-visible,.wbs-mini:focus-visible,.wbs-caret:focus-visible,.wbs-crumb:focus-visible,.wbs-search input:focus-visible,.wbs-th-sort:focus-visible{outline:2px solid color-mix(in srgb,var(--wbs-accent) 55%,transparent);outline-offset:1px}",
      ".wbs-btn.primary{background:var(--wbs-accent);color:var(--dsw-alias-label-primary-inverted,#fff);border-color:transparent}",
      ".wbs-btn.primary:hover{filter:brightness(1.06)}",
      ".wbs-btn.danger{color:var(--dsw-alias-state-error-primary,#bd3b32);border-color:color-mix(in srgb,var(--dsw-alias-state-error-primary,#bd3b32) 34%,transparent)}",
      ".wbs-btn.danger:hover{background:color-mix(in srgb,var(--dsw-alias-state-error-primary,#bd3b32) 8%,transparent)}",
      ".wbs-btn.sm{padding:3px 7px;font-size:11px;border-radius:6px}",
      ".wbs-btn:disabled{opacity:.5;cursor:not-allowed}",
      ".wbs-body{display:flex;gap:16px;align-items:flex-start;flex:1;min-height:0}",
      ".wbs-tree{width:236px;flex:none;border:1px solid var(--wbs-line);border-radius:12px;background:color-mix(in srgb,var(--dsw-alias-bg-layer-1,#fff) 62%,transparent);padding:8px;max-height:calc(100vh - 220px);overflow:auto}",
      ".wbs-tree-top{display:flex;align-items:center;gap:6px;padding:3px 4px 8px;border-bottom:1px solid var(--wbs-line);margin-bottom:6px}",
      ".wbs-tree-title{display:flex;align-items:center;gap:5px;font-size:12px;font-weight:600;color:var(--wbs-muted);flex:1}",
      ".wbs-tree-title .wbs-svg{opacity:.75}",
      ".wbs-node{display:flex;align-items:center;gap:3px;padding:4px 5px;border-radius:7px;cursor:pointer;min-height:27px;box-sizing:border-box;transition:background .12s ease}",
      ".wbs-node:hover{background:var(--wbs-soft)}",
      ".wbs-node.active{background:color-mix(in srgb,var(--wbs-accent) 13%,transparent);color:var(--wbs-accent);font-weight:600}",
      ".wbs-caret{width:17px;height:17px;flex:none;display:inline-flex;align-items:center;justify-content:center;border-radius:4px;color:var(--wbs-muted);cursor:pointer;opacity:.8}",
      ".wbs-caret:hover{background:var(--wbs-soft);color:inherit;opacity:1}",
      ".wbs-caret.plain{cursor:default;opacity:.7}",
      ".wbs-caret.plain:hover{background:transparent}",
      ".wbs-caret .wbs-svg{transition:transform .13s ease}",
      ".wbs-caret.open .wbs-svg{transform:rotate(90deg)}",
      ".wbs-node-ico{display:inline-flex;align-items:center;flex:none;color:var(--wbs-muted);margin-right:1px}",
      ".wbs-node.active .wbs-node-ico{color:inherit}",
      ".wbs-node-name{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
      ".wbs-node-actions{display:none;align-items:center;gap:1px;flex:none}",
      ".wbs-node:hover .wbs-node-actions{display:flex}",
      ".wbs-mini{appearance:none;border:0;background:transparent;color:var(--wbs-muted);border-radius:5px;cursor:pointer;font-size:12px;line-height:1;padding:3px 4px;font-family:inherit;display:inline-flex;align-items:center;justify-content:center;gap:4px;transition:background .12s ease,color .12s ease}",
      ".wbs-mini:hover{background:var(--wbs-line);color:inherit}",
      ".wbs-svg{display:block;flex:none}",
      ".wbs-main{flex:1;min-width:0;display:flex;flex-direction:column;gap:10px}",
      ".wbs-crumbs{display:flex;align-items:center;gap:4px;flex-wrap:wrap;font-size:12px;min-height:22px}",
      ".wbs-crumb{appearance:none;border:0;background:transparent;color:var(--wbs-muted);padding:3px 4px;border-radius:5px;cursor:pointer;font-family:inherit;font-size:12px}",
      ".wbs-crumb:hover{background:var(--wbs-soft);color:inherit}",
      ".wbs-crumb.cur{color:inherit;font-weight:600}",
      ".wbs-sep{display:inline-flex;align-items:center;color:var(--wbs-muted);opacity:.45}",
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
      ".wbs-th-label{display:inline-flex;align-items:center;gap:3px}",
      ".wbs-sort-ico{opacity:.3}",
      ".wbs-th-sort:hover .wbs-sort-ico{opacity:.6}",
      ".wbs-th-sort.on{color:var(--wbs-accent)}",
      ".wbs-th-sort.on .wbs-sort-ico{opacity:1}",
      ".wbs-site-name{font-weight:600;font-size:13px;word-break:break-word}",
      ".wbs-site-desc{font-size:12px;color:var(--wbs-muted);margin-top:3px;word-break:break-word}",
      ".wbs-site-link{display:inline-flex;align-items:center;gap:4px;margin-top:4px;font-size:11.5px;color:var(--wbs-accent);text-decoration:none;max-width:100%;overflow:hidden;white-space:nowrap;vertical-align:top}",
      ".wbs-site-link .wbs-svg{opacity:.75}",
      ".wbs-site-link span{overflow:hidden;text-overflow:ellipsis}",
      ".wbs-site-link:hover{text-decoration:underline}",
      ".wbs-muted{color:var(--wbs-muted)}",
      ".wbs-vaultbar{display:flex;align-items:center;gap:10px;flex-wrap:wrap;padding:8px 10px;border-radius:9px;margin:10px 0;border:1px solid var(--wbs-line);background:color-mix(in oklab,#5b7fd6 7%,transparent)}",
      ".wbs-vaultbar.locked{background:color-mix(in oklab,#e0a33a 9%,transparent);border-color:color-mix(in oklab,#e0a33a 30%,var(--wbs-line))}",
      ".wbs-vaultbar.unlocked{background:color-mix(in oklab,#3aa66a 8%,transparent);border-color:color-mix(in oklab,#3aa66a 26%,var(--wbs-line))}",
      ".wbs-vault-hint{font-size:11.5px;color:var(--wbs-muted);flex:1 1 220px;line-height:1.6}",
      ".wbs-vault-form{display:flex;gap:6px;align-items:center;flex:0 1 320px}",
      ".wbs-vault-form .wbs-input{font-size:12px;padding:5px 8px}",
      ".wbs-accrow{border:1px solid var(--wbs-line);border-radius:10px;padding:8px 10px;margin-bottom:8px;background:color-mix(in srgb,var(--dsw-alias-bg-layer-1,#fff) 40%,transparent)}",
      ".wbs-accrow-head{display:flex;align-items:center;gap:8px;flex-wrap:wrap}",
      ".wbs-accrow-head b{font-size:13px}",
      ".wbs-acc-login{font-size:12px;color:var(--wbs-muted)}",
      ".wbs-accrow-fields{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:4px 12px;margin:6px 0 4px}",
      ".wbs-accrow-fields > div{display:flex;align-items:center;gap:5px;font-size:11.5px;min-width:0}",
      ".wbs-accrow-fields i{font-style:normal;color:var(--wbs-muted);flex:0 0 auto}",
      ".wbs-accrow-fields span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
      ".wbs-acc-remark{grid-column:1/-1}",
      ".wbs-accrow-ext{display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-top:4px}",
      ".wbs-acc-extsel{width:auto;flex:1 1 200px;font-size:11.5px;padding:4px 6px}",
      ".wbs-accdraft{border:1px solid var(--wbs-line);border-radius:10px;padding:10px 12px;margin-top:8px}",
      ".wbs-accdraft-title{font-size:12.5px;font-weight:600}",
      ".wbs-acc-empty{padding:18px;text-align:center;font-size:12px;color:var(--wbs-muted)}",
      ".wbs-mini{border:0;background:transparent;color:var(--wbs-muted);cursor:pointer;padding:1px 3px;border-radius:4px;display:inline-flex;align-items:center}",
      ".wbs-mini:hover{background:color-mix(in srgb,var(--wbs-accent) 12%,transparent);color:var(--wbs-accent)}",
      ".wbs-chip{display:inline-flex;align-items:center;gap:4px;border:1px solid var(--wbs-line);border-radius:999px;padding:2px 7px;font-size:11px;margin:0 4px 3px 0;background:color-mix(in srgb,var(--wbs-accent) 6%,transparent);max-width:100%}",
      ".wbs-chip button{border:0;background:transparent;color:inherit;cursor:pointer;padding:0;display:inline-flex;align-items:center;opacity:.6}",
      ".wbs-chip button:hover{opacity:1}",
      ".wbs-actions{display:flex;gap:4px;flex-wrap:nowrap;align-items:center}",
      ".wbs-expand td{background:color-mix(in srgb,var(--dsw-alias-bg-layer-2,#f4f1e4) 52%,transparent);padding:10px 12px}",
      ".wbs-subtable{width:100%;border-collapse:collapse;font-size:12px}",
      ".wbs-subtable th{font-size:10px;color:var(--wbs-muted);text-align:left;padding:3px 6px;border-bottom:1px solid var(--wbs-line)}",
      ".wbs-subtable td{padding:5px 6px;border-bottom:1px solid color-mix(in srgb,var(--wbs-line) 45%,transparent);word-break:break-all}",
      ".wbs-dirpath{line-height:1.7}",
      ".wbs-dirpath>div{display:flex;align-items:center;gap:5px}",
      ".wbs-dirpath .wbs-svg{color:var(--wbs-muted);flex:none}",
      ".wbs-def{display:inline-flex;align-items:center;vertical-align:-2px;margin-right:4px;color:var(--wbs-accent)}",
      ".wbs-empty{text-align:center;padding:52px 12px;color:var(--wbs-muted)}",
      ".wbs-empty-ico{display:inline-flex;align-items:center;justify-content:center;width:44px;height:44px;border-radius:12px;margin-bottom:10px;background:var(--wbs-soft);opacity:.75}",
      ".wbs-empty b{display:block;color:inherit;font-size:14px;margin-bottom:6px}",
      ".wbs-pager{display:flex;align-items:center;gap:8px;justify-content:flex-end;padding:2px 0;font-size:12px;color:var(--wbs-muted);flex-wrap:wrap}",
      ".wbs-pager-pos{min-width:52px;text-align:center;font-variant-numeric:tabular-nums}",
      ".wbs-pager select{border:1px solid var(--wbs-line);border-radius:6px;background:transparent;color:inherit;font:inherit;padding:4px 6px}",
      ".wbs-loading{padding:24px;text-align:center;color:var(--wbs-muted);font-size:12px}",
      ".wbs-error{padding:10px 12px;border:1px solid color-mix(in srgb,var(--dsw-alias-state-error-primary,#bd3b32) 30%,transparent);background:color-mix(in srgb,var(--dsw-alias-state-error-primary,#bd3b32) 6%,transparent);border-radius:8px;color:var(--dsw-alias-state-error-primary,#a4312a);font-size:12px}",
      ".wbs-toast{position:fixed;left:50%;bottom:38px;transform:translateX(-50%);z-index:1200;background:var(--dsw-alias-toast-bg,#26302d);color:var(--dsw-alias-toast-label,#fff);border-radius:8px;padding:8px 14px;font-size:12px;box-shadow:0 8px 24px rgba(0,0,0,.22);max-width:80vw}",
      ".wbs-toast.err{background:var(--dsw-alias-state-error-primary,#9d332b)}",
      ".wbs-mask{position:fixed;inset:0;z-index:900;background:rgba(24,28,26,.34);display:flex;align-items:center;justify-content:center;padding:22px}",
      ".wbs-modal{width:min(700px,96vw);max-height:88vh;overflow:auto;background:var(--dsw-alias-bg-layer-1,#fffdf7);border:1px solid var(--wbs-line);border-radius:14px;box-shadow:0 24px 70px rgba(0,0,0,.24);padding:18px}",
      ".wbs-modal.small{width:min(430px,94vw)}",
      ".wbs-modal-title{display:flex;align-items:center;gap:8px;font-size:16px;font-weight:650;margin-bottom:4px}",
      ".wbs-modal-title .wbs-svg{color:var(--wbs-accent);opacity:.85;flex:none}",
      ".wbs-modal-x{margin-left:auto;color:var(--wbs-muted);flex:none}",
      ".wbs-modal-x:hover{background:var(--wbs-soft);color:inherit}",
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
      ".wbs-tagresult{width:100%;display:flex;align-items:center;gap:7px;text-align:left;border:0;background:transparent;color:inherit;padding:6px;border-radius:6px;cursor:pointer;font:inherit;font-size:12px}",
      ".wbs-tagresult:hover{background:var(--wbs-soft)}",
      ".wbs-tagresult.on{background:color-mix(in srgb,var(--wbs-accent) 10%,transparent);color:var(--wbs-accent)}",
      ".wbs-chips{display:flex;flex-wrap:wrap;gap:5px;margin-top:7px;min-height:10px}",
      ".wbs-formfoot{display:flex;align-items:center;gap:8px;margin-top:18px;padding-top:14px;border-top:1px solid var(--wbs-line)}",
      ".wbs-formerr{color:var(--dsw-alias-state-error-primary,#b5392f);font-size:12px;flex:1;min-width:0}",
      ".wbs-note{font-size:11px;color:var(--wbs-muted);line-height:1.6}",
      "@media(max-width:860px){.wbs-body{flex-direction:column}.wbs-tree{width:100%;max-height:220px}.wbs-table{min-width:760px}.wbs-root{min-height:0}}",
      "@media(max-width:600px){.wbs-head h2{font-size:18px}.wbs-linkrow{grid-template-columns:1fr 1fr}.wbs-modal{padding:14px}}"
    ].join("\n");
  }
});

// packages/addons/lib/highlight.cjs
var require_highlight = __commonJS({
  "packages/addons/lib/highlight.cjs"(exports2, module2) {
    "use strict";
    module2.exports = function(React2) {
      var h2 = React2.createElement;
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
    var React2 = require("react");
    var createHighlight = require_highlight()(React2);
    var h2 = React2.createElement;
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
      var Icon2 = options.Icon || null;
      var injectCss = require_action_schema_style()(prefix, DOMAIN);
      var Highlight = createHighlight(P);
      function icon(name, size) {
        return Icon2 ? h2(Icon2, { name, size: size || 14 }) : null;
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
        var snapState = React2.useState(null);
        var snap = snapState[0], setSnap = snapState[1];
        var errState = React2.useState("");
        var err = errState[0], setErr = errState[1];
        var loadingState = React2.useState(true);
        var loading = loadingState[0], setLoading = loadingState[1];
        var reloadState = React2.useState(0);
        var reload = reloadState[0], setReload = reloadState[1];
        var queryState = React2.useState("");
        var query = queryState[0], setQuery = queryState[1];
        var reqState = React2.useState("all");
        var reqMode = reqState[0], setReqMode = reqState[1];
        var typeState = React2.useState("");
        var typePick = typeState[0], setTypePick = typeState[1];
        var toastState = React2.useState("");
        var toast = toastState[0], setToast = toastState[1];
        React2.useEffect(function() {
          injectCss();
        }, []);
        React2.useEffect(function() {
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

// packages/addons/sites/client/views/actions.cjs
var require_actions = __commonJS({
  "packages/addons/sites/client/views/actions.cjs"(exports2, module2) {
    "use strict";
    module2.exports = require_action_schema_view()({
      domain: "sites",
      prefix: "wbs"
    });
  }
});

// packages/addons/sites/client/client.src.cjs
var React = require("react");
var h = React.createElement;
var TagFilter = require_tagfilter();
(function() {
  var host = window.__WB_HOST__;
  if (!host) {
    console.error("[wb-addon-sites] \u7F3A\u5C11 window.__WB_HOST__\uFF0C\u65E0\u6CD5\u6CE8\u518C\u7AD9\u70B9\u89C6\u56FE");
    module.exports = { name: "dsh-workbench-sites", inject: [], apply: function() {
    } };
    return;
  }
  var React2 = require("react");
  var h2 = React2.createElement;
  var statsView = require_stats();
  var configView = require_config();
  var dataView = require_data();
  var icons = require_icons(), Icon2 = icons.Icon, tabIcon = icons.tabIcon;
  var useState = React2.useState;
  var useEffect = React2.useEffect;
  var useRef = React2.useRef;
  var useMemo2 = React2.useMemo;
  var COPY = require_copy();
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
  var cssText = require_styles();
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
      h2(
        "div",
        { className: "wbs-modal-title" },
        h2(Icon2, { name: mode === "edit" ? "edit" : "plus", size: 15 }),
        title,
        h2("button", { type: "button", className: "wbs-mini wbs-modal-x", title: text(lang, "cancel"), onClick: props.onClose }, h2(Icon2, { name: "x", size: 15 }))
      ),
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
            h2("button", { type: "button", className: "wbs-mini", title: text(lang, "removeLink"), onClick: function() {
              removeLink(i);
            } }, h2(Icon2, { name: "x", size: 13 }))
          );
        }),
        h2("button", { type: "button", className: "wbs-btn sm", onClick: addLink }, h2(Icon2, { name: "plus", size: 13 }), text(lang, "addLink"))
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
          return h2(
            "button",
            {
              key: t.id,
              type: "button",
              className: "wbs-tagresult" + (on ? " on" : ""),
              onClick: function() {
                toggleTag(t);
              }
            },
            h2(Icon2, { name: on ? "check" : "plus", size: 12 }),
            h2("span", null, t.name)
          );
        }) : h2("div", { className: "wbs-note", style: { padding: 6 } }, text(lang, "noTags"))),
        h2("div", { className: "wbs-note", style: { marginTop: 8 } }, "\u6807\u7B7E\u7531\u6807\u7B7E\u5B50\u63D2\u4EF6\u63D0\u4F9B\uFF0C\u53EF\u591A\u9009\u3002")
      ) : null,
      h2(
        "div",
        { className: "wbs-formfoot" },
        h2("div", { className: "wbs-formerr" }, error || ""),
        step > 0 ? h2("button", { type: "button", className: "wbs-btn", disabled: saving, onClick: function() {
          setStep(step - 1);
        } }, h2(Icon2, { name: "chevron-left", size: 13 }), text(lang, "back")) : null,
        h2("button", { type: "button", className: "wbs-btn", disabled: saving, onClick: props.onClose }, text(lang, "cancel")),
        step < maxStep ? h2("button", { type: "button", className: "wbs-btn primary", onClick: next }, text(lang, "nextStep"), h2(Icon2, { name: "chevron-right", size: 13 })) : h2("button", { type: "button", className: "wbs-btn primary", disabled: saving, onClick: save }, h2(Icon2, { name: "check", size: 13 }), saving ? text(lang, "saving") : text(lang, "save"))
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
      h2(
        "div",
        { className: "wbs-modal-title" },
        h2(Icon2, { name: isDelete ? "trash" : dlg.mode === "rename" ? "edit" : "folder-plus", size: 15 }),
        title,
        h2("button", { type: "button", className: "wbs-mini wbs-modal-x", title: text(lang, "cancel"), onClick: props.onClose }, h2(Icon2, { name: "x", size: 15 }))
      ),
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
          h2(Icon2, { name: isDelete ? "trash" : dlg.mode === "rename" ? "check" : "plus", size: 13 }),
          saving ? "\u2026" : isDelete ? text(lang, "confirm") : dlg.mode === "rename" ? text(lang, "save") : text(lang, "create")
        )
      )
    );
  }
  function AccountModal(props) {
    var api = props.api;
    var lang = props.lang || "zh";
    var site = props.site;
    var [accounts, setAccounts] = useState([]);
    var [vault, setVault] = useState({});
    var [loading, setLoading] = useState(true);
    var [error, setError] = useState("");
    var [busy, setBusy] = useState(false);
    var [draft, setDraft] = useState(null);
    var [pass, setPass] = useState("");
    var [pass2, setPass2] = useState("");
    var [cascade, setCascade] = useState([]);
    var [pickKey, setPickKey] = useState("");
    var [pendingDelete, setPendingDelete] = useState("");
    var [shown, setShown] = useState({});
    function reload() {
      setLoading(true);
      return Promise.all([
        callApi(api, "sites.accounts.list", { siteId: site.id }),
        callApi(api, "sites.vault.status", {})
      ]).then(function(out) {
        setAccounts(out[0].accounts || []);
        setVault(out[1] || {});
        setError("");
      }).catch(function(e) {
        setError(errText(e));
      }).finally(function() {
        setLoading(false);
      });
    }
    function loadCascade() {
      callApi(api, "sites.accounts.cascade", { excludeSiteId: site.id }).then(function(r) {
        var list = [];
        (r.groups || []).forEach(function(g) {
          g.accounts.forEach(function(a) {
            list.push({ id: a.id, label: g.siteName + " \xB7 " + a.accountKey });
          });
        });
        setCascade(list);
      }).catch(function() {
        setCascade([]);
      });
    }
    useEffect(function() {
      reload();
      loadCascade();
    }, [site.id]);
    function guard(fn) {
      setBusy(true);
      setError("");
      return Promise.resolve().then(fn).catch(function(e) {
        setError(errText(e));
      }).finally(function() {
        setBusy(false);
      });
    }
    function submitVault() {
      if (!pass || pass.length < 8) {
        setError(text(lang, "passTooShort"));
        return;
      }
      if (!vault.enabled && pass !== pass2) {
        setError(text(lang, "passMismatch"));
        return;
      }
      guard(function() {
        var name = vault.enabled ? "sites.vault.unlock" : "sites.vault.setup";
        var args = vault.enabled ? { passphrase: pass } : { passphrase: pass };
        return callApi(api, name, args).then(function() {
          setPass("");
          setPass2("");
          return reload();
        });
      });
    }
    function lockVault() {
      guard(function() {
        return callApi(api, "sites.vault.lock", {}).then(function() {
          setShown({});
          return reload();
        });
      });
    }
    function saveDraft() {
      var body = {
        accountKey: draft.accountKey,
        account: draft.account,
        remark: draft.remark
      };
      if (draft.password) body.password = draft.password;
      if (draft.phoneNumber) body.phoneNumber = draft.phoneNumber;
      if (draft.identityCard) body.identityCard = draft.identityCard;
      guard(function() {
        var req = draft.id ? callApi(api, "sites.accounts.update", Object.assign({ id: draft.id }, body)) : callApi(api, "sites.accounts.create", Object.assign({ siteId: site.id }, body));
        return req.then(function() {
          setDraft(null);
          props.onChanged && props.onChanged();
          return reload();
        });
      });
    }
    function removeAccount(id) {
      guard(function() {
        return callApi(api, "sites.accounts.delete", { id }).then(function() {
          setPendingDelete("");
          props.onChanged && props.onChanged();
          return reload();
        });
      });
    }
    function reveal(acc) {
      guard(function() {
        return callApi(api, "sites.accounts.reveal", { id: acc.id }).then(function(r) {
          setShown(function(prev) {
            var next = Object.assign({}, prev);
            next[acc.id] = r;
            return next;
          });
        });
      });
    }
    function copyText(value) {
      if (!value) return;
      try {
        navigator.clipboard.writeText(value);
        showToast(text(lang, "copied"));
      } catch (e) {
        setError(String(e && e.message || e));
      }
    }
    function linkExternal(acc) {
      if (!pickKey) return;
      guard(function() {
        return callApi(api, "sites.accounts.link", { nativeAccountId: acc.id, externalAccountId: pickKey }).then(function() {
          setPickKey("");
          return reload();
        });
      });
    }
    function unlink(acc, rel) {
      guard(function() {
        return callApi(api, "sites.accounts.unlink", { nativeAccountId: acc.id, externalAccountId: rel.accountId }).then(function() {
          return reload();
        });
      });
    }
    function renderVaultBar() {
      if (!vault.enabled) {
        return h2(
          "div",
          { className: "wbs-vaultbar" },
          h2("div", { className: "wbs-vault-hint" }, text(lang, "vaultNotSet")),
          h2(
            "div",
            { className: "wbs-vault-form" },
            h2("input", { className: "wbs-input", type: "password", placeholder: text(lang, "passphrase"), value: pass, onChange: function(e) {
              setPass(e.target.value);
            } }),
            h2("input", { className: "wbs-input", type: "password", placeholder: text(lang, "passphraseAgain"), value: pass2, onChange: function(e) {
              setPass2(e.target.value);
            } }),
            h2("button", { className: "wbs-btn", disabled: busy, onClick: submitVault }, text(lang, "vaultSetup"))
          )
        );
      }
      if (!vault.unlocked) {
        return h2(
          "div",
          { className: "wbs-vaultbar locked" },
          h2("div", { className: "wbs-vault-hint" }, text(lang, "vaultLocked")),
          h2(
            "div",
            { className: "wbs-vault-form" },
            h2("input", { className: "wbs-input", type: "password", placeholder: text(lang, "passphrase"), value: pass, onChange: function(e) {
              setPass(e.target.value);
            } }),
            h2("button", { className: "wbs-btn", disabled: busy, onClick: submitVault }, text(lang, "vaultUnlock"))
          )
        );
      }
      return h2(
        "div",
        { className: "wbs-vaultbar unlocked" },
        h2("div", { className: "wbs-vault-hint" }, text(lang, "vaultUnlocked", { min: vault.idleMinutes || 15 })),
        h2("button", { className: "wbs-btn sm", disabled: busy, onClick: lockVault }, h2(Icon2, { name: "lock", size: 12 }), text(lang, "vaultLock"))
      );
    }
    function renderDraft() {
      var d = draft;
      function field(key, label, type, ph) {
        return h2(
          React2.Fragment,
          null,
          h2("label", { className: "wbs-label" }, label),
          h2("input", {
            className: "wbs-input",
            type: type || "text",
            placeholder: ph || "",
            value: d[key] || "",
            onChange: function(e) {
              var v = e.target.value;
              setDraft(function(prev) {
                var next = Object.assign({}, prev);
                next[key] = v;
                return next;
              });
            }
          })
        );
      }
      return h2(
        "div",
        { className: "wbs-accdraft" },
        h2("div", { className: "wbs-accdraft-title" }, d.id ? text(lang, "editAccount") : text(lang, "addAccount")),
        field("accountKey", text(lang, "accountKey") + " *", "text", "prod-admin"),
        field("account", text(lang, "loginName")),
        field("password", text(lang, "password"), "password"),
        field("phoneNumber", text(lang, "phone")),
        field("identityCard", text(lang, "identity")),
        field("remark", text(lang, "remark")),
        h2("div", { className: "wbs-vault-hint" }, text(lang, "sensitiveHint")),
        h2(
          "div",
          { className: "wbs-formfoot" },
          h2("div", { className: "wbs-grow" }),
          h2("button", { className: "wbs-btn", disabled: busy, onClick: function() {
            setDraft(null);
          } }, text(lang, "cancel")),
          h2("button", { className: "wbs-btn primary", disabled: busy, onClick: saveDraft }, text(lang, "save"))
        )
      );
    }
    return h2(
      Modal,
      { onClose: props.onClose },
      h2(
        "div",
        { className: "wbs-modal-title" },
        h2(Icon2, { name: "key", size: 15 }),
        text(lang, "accountsTitle", { name: site.siteName }),
        h2("button", { type: "button", className: "wbs-mini wbs-modal-x", title: text(lang, "cancel"), onClick: props.onClose }, h2(Icon2, { name: "x", size: 15 }))
      ),
      h2("div", { className: "wbs-modal-sub" }, text(lang, "accountsSub")),
      renderVaultBar(),
      error ? h2("div", { className: "wbs-error" }, error) : null,
      draft ? renderDraft() : h2(
        React2.Fragment,
        null,
        loading ? h2("div", { className: "wbs-loading" }, text(lang, "loading")) : null,
        !loading && !accounts.length ? h2("div", { className: "wbs-acc-empty" }, text(lang, "accountEmpty")) : null,
        !loading ? accounts.map(function(acc) {
          var plain = shown[acc.id] || null;
          return h2(
            "div",
            { className: "wbs-accrow", key: acc.id },
            h2(
              "div",
              { className: "wbs-accrow-head" },
              h2("b", null, acc.accountKey || "\u2014"),
              acc.account ? h2("span", { className: "wbs-acc-login" }, acc.account) : null,
              h2("div", { className: "wbs-grow" }),
              h2("button", { className: "wbs-btn sm icononly", title: text(lang, "edit"), onClick: function() {
                setDraft({ id: acc.id, accountKey: acc.accountKey, account: acc.account, remark: acc.remark, password: "", phoneNumber: "", identityCard: "" });
              } }, h2(Icon2, { name: "edit", size: 12 })),
              pendingDelete === acc.id ? h2(
                React2.Fragment,
                null,
                h2("button", { className: "wbs-btn sm danger", disabled: busy, onClick: function() {
                  removeAccount(acc.id);
                } }, text(lang, "confirm")),
                h2("button", { className: "wbs-btn sm", onClick: function() {
                  setPendingDelete("");
                } }, text(lang, "cancel"))
              ) : h2("button", { className: "wbs-btn sm danger icononly", title: text(lang, "del"), onClick: function() {
                setPendingDelete(acc.id);
              } }, h2(Icon2, { name: "trash", size: 12 }))
            ),
            h2(
              "div",
              { className: "wbs-accrow-fields" },
              h2(
                "div",
                null,
                h2("i", null, text(lang, "password")),
                h2("span", null, plain ? plain.password || "\u2014" : acc.hasPassword ? "\u2022\u2022\u2022\u2022\u2022\u2022" : "\u2014"),
                acc.hasPassword ? h2("button", { className: "wbs-mini", title: text(lang, "reveal"), onClick: function() {
                  if (plain) {
                    setShown(function(prev) {
                      var next = Object.assign({}, prev);
                      delete next[acc.id];
                      return next;
                    });
                  } else {
                    reveal(acc);
                  }
                } }, h2(Icon2, { name: plain ? "eye-off" : "eye", size: 11 })) : null,
                acc.hasPassword ? h2("button", { className: "wbs-mini", title: text(lang, "copy"), onClick: function() {
                  if (plain) copyText(plain.password);
                  else reveal(acc);
                } }, h2(Icon2, { name: "copy", size: 11 })) : null
              ),
              h2("div", null, h2("i", null, text(lang, "phone")), h2("span", null, plain ? plain.phoneNumber || "\u2014" : acc.phoneNumber || "\u2014")),
              h2("div", null, h2("i", null, text(lang, "identity")), h2("span", null, plain ? plain.identityCard || "\u2014" : acc.identityCard || "\u2014")),
              acc.remark ? h2("div", { className: "wbs-acc-remark" }, h2("i", null, text(lang, "remark")), h2("span", null, acc.remark)) : null
            ),
            h2(
              "div",
              { className: "wbs-accrow-ext" },
              (acc.externals || []).map(function(rel) {
                return h2(
                  "span",
                  { className: "wbs-chip", key: rel.relationId },
                  rel.siteName + " \xB7 " + rel.accountKey,
                  h2("button", { className: "wbs-mini", title: text(lang, "unlink"), onClick: function() {
                    unlink(acc, rel);
                  } }, h2(Icon2, { name: "x", size: 10 }))
                );
              }),
              h2(
                "select",
                { className: "wbs-select wbs-acc-extsel", value: pickKey, onChange: function(e) {
                  setPickKey(e.target.value);
                } },
                h2("option", { value: "" }, text(lang, "externalPick")),
                cascade.map(function(o) {
                  return h2("option", { key: o.id, value: o.id }, o.label);
                })
              ),
              h2("button", { className: "wbs-btn sm", disabled: !pickKey || busy, onClick: function() {
                linkExternal(acc);
              } }, text(lang, "externalAdd"))
            )
          );
        }) : null,
        !loading ? h2(
          "div",
          { className: "wbs-formfoot" },
          h2("button", { className: "wbs-btn primary", disabled: busy, onClick: function() {
            setDraft({ id: "", accountKey: "", account: "", password: "", phoneNumber: "", identityCard: "", remark: "" });
          } }, h2(Icon2, { name: "plus", size: 12 }), text(lang, "addAccount")),
          h2("div", { className: "wbs-grow" }),
          h2("button", { className: "wbs-btn", onClick: props.onClose }, text(lang, "close"))
        ) : null
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
      h2(
        "div",
        { className: "wbs-modal-title" },
        h2(Icon2, { name: "trash", size: 15 }),
        text(lang, "deleteTitle"),
        h2("button", { type: "button", className: "wbs-mini wbs-modal-x", title: text(lang, "cancel"), onClick: props.onClose }, h2(Icon2, { name: "x", size: 15 }))
      ),
      h2("div", { className: "wbs-modal-sub" }, text(lang, "deleteText", { name: site.siteName })),
      error ? h2("div", { className: "wbs-error" }, error) : null,
      h2(
        "div",
        { className: "wbs-formfoot" },
        h2("div", { className: "wbs-grow" }),
        h2("button", { className: "wbs-btn", disabled: saving, onClick: props.onClose }, text(lang, "cancel")),
        h2("button", { className: "wbs-btn danger", disabled: saving, onClick: submit }, h2(Icon2, { name: "trash", size: 13 }), saving ? "\u2026" : text(lang, "confirm"))
      )
    );
  }
  var CFG_FALLBACK = {
    "list.pageSize": 16,
    "list.sortColumn": "update_time",
    "list.sortOrder": "desc",
    "ui.confirmDelete": true,
    "ui.toastDuration": 2600,
    "stats.range": "30d",
    "stats.top": 10,
    "stats.showKpi": true,
    "stats.sections": ["links", "fresh", "nodes", "trend", "topTags", "stale", "dup", "orphan", "emptyNodes"]
  };
  function SitesView(props) {
    var lang = props.lang === "en" ? "en" : "zh";
    var cfg = configView.useConfig(props.api, CFG_FALLBACK);
    if (!cfg.ready) {
      return h2("div", { style: { padding: "48px", textAlign: "center", fontSize: "12.5px", opacity: 0.6 } }, lang === "en" ? "Loading\u2026" : "\u8F7D\u5165\u4E2D\u2026");
    }
    return h2(SitesViewBody, Object.assign({}, props, { cfg: cfg.values }));
  }
  function SitesViewBody(props) {
    var api = props.api;
    var lang = props.lang || "zh";
    var cfg = props.cfg || {};
    var cfgSize = Math.floor(Number(cfg["list.pageSize"]));
    if (!(cfgSize > 0)) cfgSize = 16;
    var cfgSortCol = ["update_time", "create_time", "site_name"].indexOf(cfg["list.sortColumn"]) >= 0 ? cfg["list.sortColumn"] : "update_time";
    var cfgSortOrder = cfg["list.sortOrder"] === "asc" ? "asc" : "desc";
    var cfgConfirm = cfg["ui.confirmDelete"] !== false;
    var cfgToast = Math.floor(Number(cfg["ui.toastDuration"]));
    if (!(cfgToast >= 800)) cfgToast = 2600;
    var [kids, setKids] = useState({});
    var kidsRef = useRef({});
    var [expanded, setExpanded] = useState({});
    var [current, setCurrent] = useState({ id: "0", path: [] });
    var [sites, setSites] = useState([]);
    var [total, setTotal] = useState(0);
    var [page, setPage] = useState(1);
    var [pageSize, setPageSize] = useState(cfgSize);
    var [textQuery, setTextQuery] = useState("");
    var [searchInput, setSearchInput] = useState("");
    var [tagFilter, setTagFilter] = useState([]);
    var [tagReload, setTagReload] = useState(0);
    var [tagOn, setTagOn] = useState(false);
    var tagOnRef = useRef(false);
    var [sortCol, setSortCol] = useState(cfgSortCol);
    var [sortOrder, setSortOrder] = useState(cfgSortOrder);
    var [loading, setLoading] = useState(false);
    var [error, setError] = useState("");
    var [tick, setTick] = useState(0);
    var [expandedRow, setExpandedRow] = useState(null);
    var [selected, setSelected] = useState({});
    var [editing, setEditing] = useState(null);
    var [accSite, setAccSite] = useState(null);
    var [dirDlg, setDirDlg] = useState(null);
    var [deleting, setDeleting] = useState(null);
    var [toast, setToast] = useState(null);
    var dragRef = useRef("");
    var tagKey = tagFilter.slice().sort().join(",");
    function showToast2(msg, kind) {
      setToast({ msg, kind: kind || "" });
    }
    useEffect(function() {
      if (!toast) return;
      var timer = setTimeout(function() {
        setToast(null);
      }, cfgToast);
      return function() {
        clearTimeout(timer);
      };
    }, [toast, cfgToast]);
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
        showToast2(text(lang, "loadFail", { msg: errText(e) }), "err");
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
    useEffect(function() {
      refreshTree();
      callApi(api, "sites.capabilities").then(function(r) {
        var on = !!(r && r.tags) && hostHasAddon("wb-addon-tags");
        tagOnRef.current = on;
        setTagOn(on);
        if (!on) setTagFilter([]);
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
        if (msg.event === "tags-changed") setTagReload(function(x) {
          return x + 1;
        });
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
        showToast2(text(lang, "opFail", { msg: errText(e) }), "err");
      });
    }
    function toggleNode(node) {
      var open = !!expanded[node.id];
      if (!open && !Object.prototype.hasOwnProperty.call(kidsRef.current, node.id)) {
        loadChildren(node.id).catch(function(e) {
          showToast2(errText(e), "err");
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
        showToast2(text(lang, "moved"));
        refreshTree();
        setTick(function(x) {
          return x + 1;
        });
      }).catch(function(e2) {
        showToast2(text(lang, "opFail", { msg: errText(e2) }), "err");
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
          h2("span", { className: "wbs-caret" + (open ? " open" : ""), onClick: function(e) {
            e.stopPropagation();
            toggleNode(node);
          } }, h2(Icon2, { name: "chevron-right", size: 13 })),
          h2("span", { className: "wbs-node-ico" }, h2(Icon2, { name: open ? "folder-open" : "folder", size: 13 })),
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
      showToast2(text(lang, "saved"));
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
      showToast2(text(lang, "deleted"));
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
    function removeSite(site) {
      callApi(api, "sites.delete", { id: site.id }).then(function() {
        onSiteDeleted();
      }).catch(function(e) {
        showToast2(text(lang, "opFail", { msg: errText(e) }), "err");
      });
    }
    function deleteSelected() {
      if (!selectedIds.length) return;
      if (cfgConfirm && !window.confirm(text(lang, "bulkConfirm", { n: selectedIds.length }))) return;
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
        showToast2(text(lang, "deleted"));
      }).catch(function(e) {
        showToast2(text(lang, "opFail", { msg: errText(e) }), "err");
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
    function sortIcon(col) {
      var on = sortCol === col;
      var name = !on ? "arrow-up-down" : sortOrder === "asc" ? "arrow-up" : "arrow-down";
      return h2(Icon2, { name, size: 12, className: "wbs-sort-ico" });
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
        h2("span", { className: "wbs-badge" }, h2(Icon2, { name: "folder-tree", size: 15 })),
        h2("h2", null, text(lang, "title")),
        h2("span", { className: "wbs-count" }, text(lang, "total", { n: total })),
        h2("div", { className: "wbs-grow" }),
        h2("button", { className: "wbs-btn primary", onClick: openCreate }, h2(Icon2, { name: "plus", size: 14 }), text(lang, "newSite"))
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
            h2("span", { className: "wbs-tree-title" }, h2(Icon2, { name: "folder-tree", size: 13 }), text(lang, "directory")),
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
            h2("span", { className: "wbs-caret plain" }, h2(Icon2, { name: "house", size: 13 })),
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
                h2("span", { className: "wbs-sep" }, h2(Icon2, { name: "chevron-right", size: 12 })),
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
            h2(TagFilter, {
              api,
              text: function(k) {
                return text(lang, k);
              },
              Icon: Icon2,
              visible: tagsVisible,
              ids: tagFilter,
              reloadKey: tagReload,
              onChange: function(next) {
                setTagFilter(next);
                setPage(1);
              }
            }),
            h2("div", { className: "wbs-grow" }),
            selectedIds.length ? h2("button", { className: "wbs-btn danger", onClick: deleteSelected }, h2(Icon2, { name: "trash", size: 13 }), text(lang, "deleteSelected") + " (" + selectedIds.length + ")") : null
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
                h2("col", { style: { width: 214 } })
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
                  h2("th", { className: "wbs-th-sort" + (sortCol === "create_time" ? " on" : ""), onClick: function() {
                    sortBy("create_time");
                  } }, h2("span", { className: "wbs-th-label" }, text(lang, "createTime"), sortIcon("create_time"))),
                  h2("th", { className: "wbs-th-sort" + (sortCol === "update_time" ? " on" : ""), onClick: function() {
                    sortBy("update_time");
                  } }, h2("span", { className: "wbs-th-label" }, text(lang, "updateTime"), sortIcon("update_time"))),
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
                    h2("span", { className: "wbs-empty-ico" }, h2(Icon2, { name: "folder-open", size: 24 })),
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
                      s.defaultLink ? h2("a", { className: "wbs-site-link", href: s.defaultLink, target: "_blank", rel: "noreferrer noopener", title: s.defaultLink }, h2(Icon2, { name: "link", size: 11 }), h2("span", null, s.defaultLink)) : h2("div", { className: "wbs-site-desc wbs-muted" }, text(lang, "noLink"))
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
                        h2("button", { className: "wbs-btn sm", title: text(lang, "links"), onClick: function() {
                          setExpandedRow(expandedRow && expandedRow.id === s.id && expandedRow.type === "links" ? null : { id: s.id, type: "links" });
                        } }, h2(Icon2, { name: "link", size: 12 }), text(lang, "links") + " " + (s.siteLinks ? s.siteLinks.length : 0)),
                        h2("button", { className: "wbs-btn sm", title: text(lang, "dirs"), onClick: function() {
                          setExpandedRow(expandedRow && expandedRow.id === s.id && expandedRow.type === "dirs" ? null : { id: s.id, type: "dirs" });
                        } }, h2(Icon2, { name: "folder", size: 12 }), text(lang, "dirs") + " " + (s.dirs ? s.dirs.length : 0)),
                        h2("button", { className: "wbs-btn sm", title: text(lang, "accounts"), onClick: function() {
                          setAccSite(s);
                        } }, h2(Icon2, { name: "key", size: 12 }), text(lang, "accounts") + " " + (s.accountCount || 0)),
                        h2("button", { className: "wbs-btn sm icononly", title: text(lang, "edit"), onClick: function() {
                          openEdit(s);
                        } }, h2(Icon2, { name: "edit", size: 13 })),
                        h2("button", { className: "wbs-btn sm danger icononly", title: text(lang, "del"), onClick: function() {
                          if (cfgConfirm) setDeleting(s);
                          else removeSite(s);
                        } }, h2(Icon2, { name: "trash", size: 13 }))
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
                        h2("td", null, l.isDefault ? h2("span", { className: "wbs-def", title: text(lang, "default") }, h2(Icon2, { name: "star", size: 11 })) : null, l.description || "\u2014"),
                        h2("td", null, l.link ? h2("a", { href: l.link, target: "_blank", rel: "noreferrer noopener" }, l.link) : "\u2014")
                      );
                    }))
                  ) : h2("div", { className: "wbs-muted" }, text(lang, "noLink")) : s.dirs && s.dirs.length ? h2("div", { className: "wbs-dirpath" }, s.dirs.map(function(d) {
                    return h2("div", { key: d.id }, h2(Icon2, { name: "folder", size: 12 }), (d.path || []).map(function(p) {
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
            h2("span", null, "\u5171 " + total + " \u6761"),
            h2("button", { className: "wbs-btn sm icononly", title: text(lang, "prev"), "aria-label": text(lang, "prev"), disabled: page <= 1, onClick: function() {
              setPage(Math.max(1, page - 1));
            } }, h2(Icon2, { name: "chevron-left", size: 14 })),
            h2("span", { className: "wbs-pager-pos" }, page + " / " + pages),
            h2("button", { className: "wbs-btn sm icononly", title: text(lang, "next"), "aria-label": text(lang, "next"), disabled: page >= pages, onClick: function() {
              setPage(Math.min(pages, page + 1));
            } }, h2(Icon2, { name: "chevron-right", size: 14 })),
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
      accSite ? h2(AccountModal, {
        api,
        lang,
        site: accSite,
        onClose: function() {
          setAccSite(null);
        },
        onChanged: function() {
          setTick(function(x) {
            return x + 1;
          });
        }
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
    version: "1.10.0",
    views: [
      { id: "stats", icon: tabIcon("chart"), title: { zh: "\u7EDF\u8BA1", en: "Stats" }, component: statsView.SitesStatsView },
      { id: "sites", icon: tabIcon("globe"), title: { zh: "\u8BB0\u5F55", en: "Records" }, component: SitesView },
      { id: "config", icon: tabIcon("settings"), title: { zh: "\u914D\u7F6E", en: "Config" }, component: configView.ConfigView },
      { id: "data", icon: tabIcon("database"), title: { zh: "\u6570\u636E", en: "Data" }, component: dataView.DataView },
      { id: "actions", icon: tabIcon("code-2"), title: { zh: "Action", en: "Actions" }, component: require_actions().ActionSchemaView }
    ]
  });
  module.exports = { name: "dsh-workbench-sites", inject: [], apply: function() {
  } };
})();
    return module.exports;
  },
});
