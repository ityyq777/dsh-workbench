// 「命令」页：只读展示本插件注册的斜杠命令及其提示词模板。
// 数据来自本插件自己的 action tasks.commands（目录在 lib/publisher/catalog.js），
// 模板由 buildBrief 用占位符现场渲染，页面不另存一份正文；
// 不读宿主统一接口；action 不可用（旧版本）时按错误态降级，不伪造空目录。
"use strict";
module.exports = function (deps) {
  var React = deps.React, h = React.createElement;
  // 共享正文渲染与配置钩子由客户端入口注入：本视图保持零 require，便于测试装载。
  var Icon = deps.Icon, Body = deps.Body, BodyMode = deps.BodyMode;
  var bodyCopy = deps.bodyCopy || { zh: {}, en: {} };
  var BODY_DEFAULT = { "ui.bodyMode": "markdown" };
  var useConfig = deps.useConfig || function () { return { ready: true, values: BODY_DEFAULT }; };

  var COPY = {
    zh: {
      title: "命令", hint: "只读 · 数据来自 tasks.commands",
      loading: "正在读取命令目录…", empty: "本插件还没有注册斜杠命令。",
      retry: "重试", error: "命令目录加载失败",
      count: function (n) { return n + " 条命令"; },
      usage: "用法", input: "输入", examples: "示例", limit: "上限",
      attachments: "支持附件", noAttachments: "不支持附件", notes: "说明", copy: "复制", copied: "已复制",
      chars: function (n) { return "最多 " + n + " 字符"; },
      template: "提示词模板",
      templateHint: "只读 · 默认折叠，展开可看全文；{需求描述} 换成你的原话，<sessionId> 为当前会话 id",
      copyTemplate: "复制模板",
      bodyModeToggle: bodyCopy.zh.bodyModeToggle || "{field} · 当前：{current}；切换为{target}",
      markdown: bodyCopy.zh.markdown || "Markdown 渲染",
      plainText: bodyCopy.zh.plainText || "纯文本",
    },
    en: {
      title: "Commands", hint: "Read-only · from tasks.commands",
      loading: "Loading command catalog…", empty: "No slash commands registered yet.",
      retry: "Retry", error: "Failed to load command catalog",
      count: function (n) { return n + (n === 1 ? " command" : " commands"); },
      usage: "Usage", input: "Input", examples: "Examples", limit: "Limit",
      attachments: "Attachments allowed", noAttachments: "No attachments", notes: "Notes", copy: "Copy", copied: "Copied",
      chars: function (n) { return "up to " + n + " characters"; },
      template: "Prompt template",
      templateHint: "Read-only · collapsed by default; {requirement} is replaced by your words and <sessionId> by the current session id",
      copyTemplate: "Copy template",
      bodyModeToggle: bodyCopy.en.bodyModeToggle || "{field} · Current: {current}; switch to {target}",
      markdown: bodyCopy.en.markdown || "Rendered Markdown",
      plainText: bodyCopy.en.plainText || "Plain text",
    },
  };

  var CSS = String(deps.bodyStyles || "") + [
    ".wbt-cmd{display:flex;flex-direction:column;gap:10px;min-height:0}",
    ".wbt-cmd-head{display:flex;align-items:baseline;gap:8px;flex-wrap:wrap}",
    ".wbt-cmd-hint,.wbt-cmd-count{color:var(--dsw-alias-label-secondary,inherit);font-size:12px}",
    ".wbt-cmd-list{display:flex;flex-direction:column;gap:10px;overflow:auto;min-height:0}",
    ".wbt-cmd-card{border:1px solid var(--wb-border);border-radius:var(--wb-radius-sm);padding:10px 12px;display:flex;flex-direction:column;gap:6px}",
    ".wbt-cmd-name{display:flex;align-items:center;gap:8px;flex-wrap:wrap}",
    ".wbt-cmd-name code{font-size:13px}",
    ".wbt-cmd-title{font-weight:600}",
    ".wbt-cmd-badge{border:1px solid var(--wb-border);border-radius:999px;padding:0 8px;font-size:11px;color:var(--dsw-alias-label-secondary,inherit)}",
    ".wbt-cmd-summary,.wbt-cmd-notes{margin:0;line-height:1.55;font-size:12.5px;color:var(--dsw-alias-label-secondary,inherit)}",
    ".wbt-cmd-row{display:flex;align-items:center;gap:8px;flex-wrap:wrap;min-width:0}",
    ".wbt-cmd-label{font-size:11.5px;color:var(--dsw-alias-label-secondary,inherit);flex:none}",
    ".wbt-cmd-row code{min-width:0;overflow-wrap:anywhere;background:var(--dsw-alias-bg-layer-1,color-mix(in oklab,currentColor 4%,transparent));padding:2px 6px;border-radius:4px}",
    ".wbt-cmd-examples{margin:0;padding-left:18px;font-size:12.5px;display:flex;flex-direction:column;gap:4px}",
    ".wbt-cmd-examples li{overflow-wrap:anywhere}",
    ".wbt-cmd-empty,.wbt-cmd-error{padding:12px;border:1px dashed var(--wb-border);border-radius:var(--wb-radius-sm);font-size:12.5px}",
    ".wbt-cmd-error{border-style:solid;color:var(--dsw-alias-status-danger,inherit)}",
    ".wbt-cmd-template{border-top:1px dashed var(--wb-border);padding-top:8px;display:flex;flex-direction:column;gap:8px}",
    ".wbt-cmd-template>summary{cursor:pointer;font-size:12.5px;font-weight:600;list-style:revert}",
    ".wbt-cmd-template-head{padding-left:0;margin:0}",
    ".wbt-cmd-bar{display:inline-flex;align-items:center;gap:6px}",
    ".wbt-cmd-body{max-height:340px;overflow:auto;background:var(--dsw-alias-bg-layer-1,color-mix(in oklab,currentColor 4%,transparent));border-radius:var(--wb-radius-sm);padding:10px}",
    ".wbt-cmd-body .wb-markdown,.wbt-cmd-body .wb-body-text{font-size:11.5px;line-height:1.55}",
  ].join("");

  function result(r) {
    if (!r || !r.ok) throw new Error((r && r.error) || "Request failed");
    return r.result || {};
  }

  function CopyButton(p) {
    var s = React.useState(false), done = s[0], setDone = s[1];
    return h("button", {
      className: "wbt-btn", type: "button", title: p.t.copy,
      onClick: function () {
        var clip = typeof navigator !== "undefined" && navigator.clipboard;
        var write = clip && typeof clip.writeText === "function" ? clip.writeText(p.text) : Promise.reject(new Error("no clipboard"));
        write.then(function () {
          setDone(true);
          if (typeof p.onCopied === "function") p.onCopied(p.text);
          if (typeof setTimeout === "function") setTimeout(function () { setDone(false); }, 1200);
        }).catch(function () { setDone(false); });
      },
    }, done ? p.t.copied : p.t.copy);
  }

  // 提示词模板与任务描述共用同一套正文显示：Markdown 渲染 / 纯文本逐块切换。
  // 初始模式跟随 ui.bodyMode 配置，切换只影响当前块（与描述、感受一致）。
  function TemplateBlock(props) {
    var c = props.command, t = props.t;
    var text = typeof c.template === "string" ? c.template : "";
    var s = React.useState(props.mode === "text" ? "text" : "markdown"), mode = s[0], setMode = s[1];
    if (!text.trim()) return null;
    return h("details", { className: "wbt-cmd-template" },
      h("summary", null, t.template),
      h("span", { className: "wbt-cmd-hint" }, t.templateHint),
      h("div", { className: "wb-body-heading wbt-cmd-template-head" },
        h("span", { className: "wb-body-label" }, t.template),
        h("span", { className: "wbt-cmd-bar" },
          h(BodyMode, { label: t.template, mode: mode, onChange: setMode, t: t, Icon: Icon }),
          h(CopyButton, { t: t, text: text, onCopied: props.onCopied }))),
      h("div", { className: "wbt-cmd-body" }, h(Body, { text: text, mode: mode })));
  }

  function CommandCard(props) {
    var c = props.command, t = props.t;
    var limit = c.limit && c.limit.max ? t.chars(c.limit.max) : "";
    return h("article", { className: "wbt-cmd-card" },
      h("div", { className: "wbt-cmd-name" },
        h("code", null, "/" + c.name),
        h("span", { className: "wbt-cmd-title" }, c.title.zh && t === COPY.zh ? c.title.zh : c.title.en || c.title.zh),
        h("span", { className: "wbt-cmd-badge" }, c.attachments ? t.attachments : t.noAttachments)),
      h("p", { className: "wbt-cmd-summary" }, t === COPY.zh ? c.summary.zh : c.summary.en),
      h("div", { className: "wbt-cmd-row" },
        h("span", { className: "wbt-cmd-label" }, t.usage),
        h("code", null, (t === COPY.zh ? c.usage.zh : c.usage.en)),
        h(CopyButton, { t: t, text: (t === COPY.zh ? c.usage.zh : c.usage.en), onCopied: props.onCopied })),
      h("div", { className: "wbt-cmd-row" },
        h("span", { className: "wbt-cmd-label" }, t.input),
        h("code", null, (t === COPY.zh ? c.inputHint.zh : c.inputHint.en))),
      c.examples && c.examples.length
        ? h("div", { className: "wbt-cmd-row", style: { alignItems: "flex-start" } },
          h("span", { className: "wbt-cmd-label" }, t.examples),
          h("ul", { className: "wbt-cmd-examples" }, c.examples.map(function (text, i) {
            return h("li", { key: i },
              h("code", null, text),
              " ",
              h(CopyButton, { t: t, text: text, onCopied: props.onCopied }));
          })))
        : null,
      limit ? h("div", { className: "wbt-cmd-row" }, h("span", { className: "wbt-cmd-label" }, t.limit), h("span", null, limit)) : null,
      c.notes && (t === COPY.zh ? c.notes.zh : c.notes.en)
        ? h("p", { className: "wbt-cmd-notes" }, t === COPY.zh ? c.notes.zh : c.notes.en)
        : null,
      h(TemplateBlock, { command: c, t: t, mode: props.bodyMode, onCopied: props.onCopied }));
  }

  function CommandsView(props) {
    var lang = props.lang === "en" ? "en" : "zh", t = COPY[lang];
    var api = props.api;
    var cfg = useConfig(api, BODY_DEFAULT);
    var bodyMode = cfg.values && cfg.values["ui.bodyMode"] === "text" ? "text" : "markdown";
    var dataS = React.useState(null), data = dataS[0], setData = dataS[1];
    var busyS = React.useState(true), busy = busyS[0], setBusy = busyS[1];
    var errorS = React.useState(""), error = errorS[0], setError = errorS[1];
    var refreshS = React.useState(0), refresh = refreshS[0], setRefresh = refreshS[1];
    var toastS = React.useState(""), toast = toastS[0], setToast = toastS[1];

    React.useEffect(function () {
      var cancelled = false;
      setBusy(true);
      setError("");
      api.call("tasks.commands", {}).then(result).then(function (r) {
        if (cancelled) return;
        setData(Array.isArray(r.commands) ? r.commands : []);
        setBusy(false);
      }).catch(function (e) {
        if (cancelled) return;
        setBusy(false);
        setError(String((e && e.message) || e));
      });
      return function () { cancelled = true; };
    }, [api, refresh]);

    var commands = data || [];
    var ready = !busy && cfg.ready;
    return h("div", { className: "wbt-root wbt-cmd" },
      h("style", null, CSS),
      h("div", { className: "wbt-cmd-head" },
        h("strong", null, t.title),
        h("span", { className: "wbt-cmd-hint" }, t.hint),
        ready && !error ? h("span", { className: "wbt-cmd-count" }, t.count(commands.length)) : null),
      !ready && !error ? h("div", { className: "wbt-cmd-empty" }, t.loading) : null,
      error
        ? h("div", { className: "wbt-cmd-error" },
          (t.error + "：" + error),
          h("button", { className: "wbt-btn", type: "button", onClick: function () { setRefresh(refresh + 1); } }, t.retry))
        : null,
      ready && !error && !commands.length ? h("div", { className: "wbt-cmd-empty" }, t.empty) : null,
      ready && !error && commands.length
        ? h("div", { className: "wbt-cmd-list" }, commands.map(function (c) {
          return h(CommandCard, { key: c.name, command: c, t: t, bodyMode: bodyMode, onCopied: function (text) { setToast(text); } });
        }))
        : null,
      toast ? h("span", { className: "wbt-cmd-hint", "aria-live": "polite" }, t.copied) : null);
  }

  return { CommandsView: CommandsView, CSS: CSS };
};
