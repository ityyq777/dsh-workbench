"use strict";
/**
 * 邮件 HTML 正文渲染：白名单清洗 + 沙箱 iframe 隔离排版 + 内联图（cid）走本地附件通道 + 远程图片按需加载。
 * 安全边界有两层：这里的字符串清洗只做收敛，真正的兜底是 iframe 的 sandbox（不给 allow-scripts）
 * 与文档内 CSP（default-src 'none'），所以即使清洗漏掉脚本，邮件脚本也不会在宿主里执行。
 */
var C = require("./common.cjs");

/** 连同内容一起丢弃的标签：脚本、嵌套文档、可执行插件、以及不参与排版的容器。 */
var SKIP_CONTENT = ["script", "iframe", "object", "applet", "svg", "math", "template", "noscript", "canvas", "audio", "video", "form", "select", "textarea", "button"];
/** 没有闭合标签、只丢自身标签的可执行/表单控件。 */
var SKIP_VOID = ["input", "embed", "keygen"];
/** 只丢标签、保留内部的标签（外链样式表、base、meta 刷新等）。 */
var VOID_DROP = ["link", "meta", "base", "frame", "frameset", "area", "source", "track", "col", "colgroup"];
/** 自闭合标签，输出时补 "/"。 */
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
  var out = String(css || "").replace(/expression\s*\(/gi, "").replace(/behavior\s*:/gi, "")
    .replace(/url\s*\(\s*['"]?\s*(?:javascript|vbscript|data:text\/html)[^)]*\)/gi, "none");
  if (!allowRemote) out = out.replace(/url\s*\(\s*['"]?(?:https?:)?\/\/[^)]*\)/gi, "none");
  return out;
}
/** 从 `{` 起做括号配平，返回闭合 `}` 的下标（找不到返回 -1）；跳过注释与字符串里的括号。 */
function matchBrace(css, open) {
  var depth = 0, quote = "", i;
  for (i = open; i < css.length; i += 1) {
    var ch = css[i];
    if (quote) { if (ch === "\\") i += 1; else if (ch === quote) quote = ""; continue; }
    if (ch === "/" && css[i + 1] === "*") { var end = css.indexOf("*/", i + 2); i = end < 0 ? css.length : end + 1; continue; }
    if (ch === '"' || ch === "'") { quote = ch; continue; }
    if (ch === "{") depth += 1;
    else if (ch === "}") { depth -= 1; if (!depth) return i; }
  }
  return -1;
}

/**
 * 把邮件自带的 prefers-color-scheme 适配块按**应用主题**求值，而不是操作系统：
 * 与当前主题一致的分支直接内联（去掉媒体查询），不一致的整块丢弃。
 * @media 里还嵌着 @media 时递归处理。
 */
function rewriteScheme(css, scheme) {
  var out = "", rest = String(css || ""), re = /@media\s*([^{]*prefers-color-scheme[^{]*)\{/gi, m;
  re.lastIndex = 0;
  while ((m = re.exec(rest))) {
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
  return String(html).replace(/(<style\b[^>]*>)([\s\S]*?)(<\/style>)/gi, function (all, open, body, close) {
    var css = body.replace(/@import[^;]*;?/gi, "");
    if (scheme) css = rewriteScheme(css, scheme);
    return open + cssSafe(css, allowRemote) + close;
  });
}

/**
 * 白名单清洗。allowRemote=true 时保留远程图片地址，否则换成透明占位并记录数量。
 * 返回 { html, remoteCount, cidIds }：cidIds 是正文引用到的 Content-ID，交给调用方按需下载。
 */
function sanitize(html, opts) {
  var allowRemote = !!(opts && opts.allowRemote);
  var src = cleanStyleBlocks(String(html == null ? "" : html), allowRemote, opts && opts.scheme);
  var out = [], remoteCount = 0, cidIds = [], last = 0, m, skipUntil = null;
  TOKEN.lastIndex = 0;
  while ((m = TOKEN.exec(src))) {
    // 丢弃标签块（script 等）内部是纯文本，不能当作正文追加。
    if (!skipUntil) out.push(src.slice(last, m.index));
    last = m.index + m[0].length;
    if (m[0].slice(0, 4) === "<!--" || m[0].slice(0, 2) === "<!") continue; // 注释与 doctype 直接丢
    var name = String(m[1] || "").toLowerCase(), closing = m[0].charAt(1) === "/", attrs = m[2] || "";
    if (!name) continue;
    if (skipUntil) { if (closing && name === skipUntil) skipUntil = null; continue; }
    if (!closing && SKIP_VOID.indexOf(name) >= 0) continue;
    if (!closing && SKIP_CONTENT.indexOf(name) >= 0) {
      skipUntil = /\/>$/.test(m[0]) ? null : name; // 自闭合标签不影响后续内容
      continue;
    }
    if (VOID_DROP.indexOf(name) >= 0) continue;
    if (closing) { out.push("</" + name + ">"); continue; }
    var keep = [];
    ATTR.lastIndex = 0;
    var a;
    while ((a = ATTR.exec(attrs))) {
      var attr = a[1].toLowerCase(), value = attrValue(a);
      if (!attr || attr.slice(0, 2) === "on") continue;
      if (attr === "srcset") continue;
      if (attr === "style") { value = cssSafe(value, allowRemote); if (value) keep.push('style="' + escapeAttr(value) + '"'); continue; }
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
        if (isHttp(value)) { remoteCount++; if (!allowRemote) value = PLACEHOLDER; }
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
  return { html: out.join(""), remoteCount: remoteCount, cidIds: cidIds };
}

function escapeAttr(v) {
  return String(v).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** 把清洗后的 cid 引用换成已下载的 data URL，没有对应图片时保留透明占位。 */
function replaceCid(html, cidMap) {
  return String(html || "").replace(/(src\s*=\s*["'])cid:([^"']*)(["'])/gi, function (all, open, cid, close) {
    var key = String(cid).toLowerCase(), url = cidMap && cidMap[key];
    return open + (url || PLACEHOLDER) + close;
  });
}

/** 颜色解析：只认 #rgb/#rrggbb/rgb()/rgba()，够判纸面明暗，不必支持全部 CSS 颜色。 */
function parseColor(value) {
  var v = String(value || "").trim().toLowerCase();
  var m = /^#([0-9a-f]{3})$/.exec(v);
  if (m) return [0, 1, 2].map(function (i) { return parseInt(m[1][i] + m[1][i], 16); });
  m = /^#([0-9a-f]{6})$/.exec(v);
  if (m) return [0, 1, 2].map(function (i) { return parseInt(m[1].slice(i * 2, i * 2 + 2), 16); });
  m = /^rgba?\(([^)]*)\)$/.exec(v);
  if (m) {
    var parts = m[1].split(/[,\s/]+/).filter(Boolean).map(Number);
    if (parts.length >= 3 && parts.every(function (n) { return isFinite(n); })) return parts.slice(0, 3).map(function (n) { return Math.max(0, Math.min(255, Math.round(n))); });
  }
  return null;
}

/** sRGB 相对亮度（WCAG），0 全黑、1 全白。 */
function luminance(rgb) {
  if (!rgb) return 0.5;
  var channel = function (n) {
    var c = n / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * channel(rgb[0]) + 0.7152 * channel(rgb[1]) + 0.0722 * channel(rgb[2]);
}

function luminanceOf(color) {
  return luminance(parseColor(color));
}

/** 纸面配色：浅底配深字、深底配浅字，两套都用固定的近白/近黑，不跟界面主题混。 */
var PAPER = { light: { paper: "#ffffff", ink: "#1f2328" }, dark: { paper: "#16181d", ink: "#e6e8ec" } };

function inkFor(color) {
  return luminanceOf(color) < 0.5 ? PAPER.dark.ink : PAPER.light.ink;
}

/**
 * 判断这封邮件是给什么纸面设计的：看 html/body/首个 table/首个 div 的 bgcolor 或
 * style 里的 background(-color)。判不出来（unknown）就跟随界面主题。
 * @returns {{kind:'light'|'dark'|'unknown', paper:string, ink:string}}
 */
function detectPaper(html, theme) {
  var source = String(html == null ? "" : html), re = /<(html|body|table|div)\b([^>]*)>/gi, m;
  while ((m = re.exec(source))) {
    var attrs = m[2] || "";
    var raw = (/bgcolor\s*=\s*["']?([^"'\s>]+)/i.exec(attrs) || []).pop() ||
      (/background-color\s*:\s*([^;"'}]+)/i.exec(attrs) || []).pop() ||
      (/(?:^|[;"'\s])background\s*:\s*([^;"'}]+)/i.exec(attrs) || []).pop();
    var rgb = raw ? parseColor(raw) : null;
    if (!rgb) continue;
    var l = luminance(rgb);
    if (l >= 0.55) return { kind: "light", paper: PAPER.light.paper, ink: PAPER.light.ink };
    if (l <= 0.28) return { kind: "dark", paper: PAPER.dark.paper, ink: PAPER.dark.ink };
  }
  return { kind: "unknown", paper: (theme && theme.paper) || PAPER.light.paper, ink: (theme && theme.ink) || PAPER.light.ink };
}

/** 宿主主题色，透传给 iframe，避免在邮件视图里另立色板。 */
function themeVars() {
  if (typeof document === "undefined" || !document.documentElement) return {};
  var cs = typeof getComputedStyle === "function" ? getComputedStyle(document.documentElement) : null;
  var root = document.querySelector ? document.querySelector(".wb-root") : null;
  var rs = root && typeof getComputedStyle === "function" ? getComputedStyle(root) : null;
  var pick = function (name, fallback) {
    var v = (cs && cs.getPropertyValue(name)) || (rs && rs.getPropertyValue(name)) || "";
    return String(v).trim() || fallback;
  };
  return {
    paper: pick("--wb-surface", "#fff"),
    line: pick("--wb-line", "#e5e7eb"),
    link: pick("--wb-accent", "#0a66c2"),
    ink: (rs && String(rs.color || "").trim()) || (cs && String(cs.color || "").trim()) || "#1f2328",
  };
}

/** 组装 iframe 文档：CSP 兜底 + 主题化的基础排版，邮件自带样式继续生效。 */
function buildDoc(html, opts) {
  var allowRemote = !!(opts && opts.allowRemote), theme = (opts && opts.theme) || {};
  var csp = "default-src 'none'; img-src data:" + (allowRemote ? " https: http:" : "") +
    "; style-src 'unsafe-inline'; font-src data:; media-src 'none'; object-src 'none'; frame-src 'none'; base-uri 'none'; form-action 'none'";
  var source = String(html || "");
  // 应用主题（决定邮件自适配走哪一支）；mode=original 时纸面按原信设计，mode=app 时跟随界面。
  var scheme = (opts && opts.scheme) || (luminanceOf(theme.paper) < 0.5 ? "dark" : "light");
  var mode = (opts && opts.mode) === "app" ? "app" : "original";
  var detected = detectPaper(source, theme);
  var follow = mode === "app" || detected.kind === "unknown";
  var paper = follow ? theme.paper || PAPER.light.paper : detected.paper;
  var ink = follow ? inkFor(paper) : detected.ink;
  var link = theme.link || "#0a66c2", line = follow ? theme.line || "#e5e7eb" : "rgba(0,0,0,.12)";
  var tone = luminanceOf(paper) < 0.5 ? "dark" : "light";
  return "<!doctype html><html class=\"wbml-" + scheme + "\"><head><meta charset=\"utf-8\">" +
    "<meta http-equiv=\"Content-Security-Policy\" content=\"" + csp + "\">" +
    "<style>html{color-scheme:" + tone + "}html,body{margin:0;padding:0}body{padding:2px;font:13px/1.65 -apple-system,BlinkMacSystemFont,\"Segoe UI\",\"PingFang SC\",\"Hiragino Sans GB\",\"Microsoft YaHei\",sans-serif;color:" + ink + ";background:" + paper + ";overflow-x:hidden;word-break:break-word;overflow-wrap:anywhere}" +
    "img{max-width:100%;height:auto}a{color:" + link + "}table{max-width:100%;border-collapse:collapse}td,th{vertical-align:top}pre{white-space:pre-wrap;overflow-wrap:anywhere}" +
    "blockquote{margin:0 0 0 12px;padding-left:10px;border-left:2px solid " + line + ";color:inherit}</style></head><body>" + source + "</body></html>";
}

/** 每封邮件记住配色选择：重开同一封时沿用上次的「按原信配色 / 跟随界面主题」。 */
var modeByMail = {};

function initialMode(props) {
  var key = String(props.mailId || "");
  if (modeByMail[key]) return modeByMail[key];
  // 配置项 display.mailTheme 给默认值，单封邮件上的切换优先。
  return props.mailTheme === "app" ? "app" : "original";
}

module.exports = function MailHtml(props) {
  var h = props.h, React = props.React, api = props.api;
  // 远程图片默认是否加载由配置（images.remote，默认加载）决定；个别邮件仍可临时切换。
  var allowDefault = props.remoteDefault !== false;
  var expanded = React.useState(allowDefault);
  var images = React.useState({});
  var frame = React.useRef(null);
  var theme = React.useMemo(themeVars, []);
  // 应用主题（不是操作系统主题）：决定邮件自带 prefers-color-scheme 走哪一支。
  var scheme = luminanceOf(theme.paper) < 0.5 ? "dark" : "light";
  var mode = React.useState(function () { return initialMode(props); });
  var meta = React.useMemo(function () { return sanitize(props.html, { allowRemote: expanded[0], scheme: scheme }); }, [props.html, expanded[0], scheme]);
  var byCid = React.useMemo(function () {
    var map = {};
    (props.attachments || []).forEach(function (a) {
      if (a && a.contentId) map[String(a.contentId).toLowerCase()] = a;
      else if (a && a.content_id) map[String(a.content_id).toLowerCase()] = a;
    });
    return map;
  }, [props.attachments]);
  var hasRemote = React.useMemo(function () {
    return sanitize(props.html, { allowRemote: true, scheme: scheme }).remoteCount;
  }, [props.html, scheme]);
  React.useEffect(function () {
    if (!api) return;
    var alive = true, want = [];
    meta.cidIds.forEach(function (cid) {
      var item = byCid[cid];
      if (!item || images[0][cid] || want.some(function (w) { return w.cid === cid; })) return;
      if (item.size > MAX_INLINE_BYTES) return;
      want.push({ cid: cid, item: item });
    });
    if (!want.length) return;
    want.forEach(function (w) {
      C.call(api, "mail.attachmentDownload", { id: w.item.id }).then(function (file) {
        if (!alive || !file || !file.base64) return;
        var url = "data:" + String(file.mime || w.item.mime || "image/png") + ";base64," + file.base64;
        images[1](function (prev) { var next = Object.assign({}, prev); next[w.cid] = url; return next; });
      }).catch(function () { /* 内联图取不到时保持占位，正文仍可读 */ });
    });
    return function () { alive = false; };
  }, [meta.cidIds, byCid, api]);
  var doc = React.useMemo(function () {
    return buildDoc(replaceCid(meta.html, images[0]), { allowRemote: expanded[0], theme: theme, scheme: scheme, mode: mode[0] });
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
    } catch (e) { /* 拿不到文档就保持默认高度 */ }
  }
  React.useEffect(measure, [doc]);
  return h("div", { className: "wbml-htmwrap" },
    h("div", { className: "wbml-htmlbar" },
      h("span", { className: "wbml-muted" }, expanded[0] ? (hasRemote ? "已加载远程图片，内容由发件方服务器提供。" : "已按原信排版显示，图片来自本地附件。") : "此邮件含 " + hasRemote + " 个远程图片，已按设置拦截。"),
      h(C.Btn, { h: h, onClick: toggleMode }, mode[0] === "app" ? "按原信配色" : "跟随界面主题"),
      hasRemote
        ? h(C.Btn, { h: h, onClick: function () { expanded[1](!expanded[0]); } }, expanded[0] ? "本次不加载" : "显示图片")
        : null,
    ),
    // 纸面与界面主题不同色时，外面这层 --wb-card 内边距把白块/暗块与边框隔开，避免贴边。
    h("div", { className: "wbml-htmlpad" },
      h("iframe", {
        ref: frame,
        className: "wbml-htmlframe",
        title: props.title || "邮件正文",
        sandbox: "allow-same-origin allow-popups allow-popups-to-escape-sandbox",
        referrerPolicy: "no-referrer",
        srcDoc: doc,
        onLoad: measure,
      })),
  );
};

module.exports.sanitize = sanitize;
module.exports.detectPaper = detectPaper;
module.exports.rewriteScheme = rewriteScheme;
module.exports.buildDoc = buildDoc;
module.exports.replaceCid = replaceCid;
module.exports.PLACEHOLDER = PLACEHOLDER;
