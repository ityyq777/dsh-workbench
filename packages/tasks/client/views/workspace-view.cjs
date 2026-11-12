// 「工作区」页：工作区实体的列表 / 新建 / 编辑 / 删除，并显示每个工作区下的任务数。
// 数据只走本插件自己的 taskWorkspaces.* action；目录只回显不校验（与 action 语义一致）。
// 点任务数会通过宿主 onNavigate 跳到「记录」页并带上 workspaceIds 筛选。
// 结构对齐记录页：.wbt-pathrow 工具栏 + .wbt-content / .wbt-item 列表容器（见 docs/specs/44）。
"use strict";
module.exports = function (deps) {
  var React = deps.React, h = React.createElement;
  // 视图本身不 require：图标由入口注入；测试里没传时退化为无图标，结构不变。
  var Icon = typeof deps.Icon === "function" ? deps.Icon : null;
  function icon(name, size) { return Icon ? h(Icon, { name: name, size: size || 13 }) : null; }

  var COPY = {
    zh: {
      title: "工作区", hint: "目录只保存与回显，不校验是否存在；任务数可点开记录页",
      create: "新建工作区", search: "搜索标题、标识、目录与描述", refresh: "刷新",
      count: function (n) { return "共 " + n + " 个"; },
      match: function (n) { return "匹配 " + n + " 个"; },
      tasks: function (n) { return n + " 个任务"; },
      noDir: "未设置目录", edit: "编辑", del: "删除", cancel: "取消", confirm: "确认删除",
      empty: "还没有工作区。新建一个，就能在任务里关联本机会话目录。",
      noMatch: "没有匹配的工作区。", loading: "正在读取工作区…",
      error: "工作区加载失败", retry: "重试",
      formCreate: "新建工作区", formEdit: "编辑工作区",
      fTitle: "标题 *", fName: "标识（可空）", fDir: "目录（本机绝对路径，可空）", fDesc: "描述（可空）",
      save: "保存", titleRequired: "标题不能为空", dirInvalid: "目录必须是本机绝对路径（/ 或 X:\\）",
      created: "已创建工作区", updated: "已更新工作区", removed: "已删除工作区",
      deleteWithTasks: function (title, n) { return "删除「" + title + "」？它关联了 " + n + " 个任务，删除后这些任务会解除关联，任务本身不会被删除。"; },
      deletePlain: function (title) { return "删除「" + title + "」？此操作不可撤销。"; },
      openTasks: "在记录页查看该工作区的任务",
    },
    en: {
      title: "Workspaces", hint: "Directories are displayed only, never checked; click a task count to open Records",
      create: "New workspace", search: "Search title, name, directory and description", refresh: "Refresh",
      count: function (n) { return n + (n === 1 ? " workspace" : " workspaces"); },
      match: function (n) { return n + " match" + (n === 1 ? "" : "es"); },
      tasks: function (n) { return n + (n === 1 ? " task" : " tasks"); },
      noDir: "No directory", edit: "Edit", del: "Delete", cancel: "Cancel", confirm: "Confirm delete",
      empty: "No workspaces yet. Create one to link local session directories to tasks.",
      noMatch: "No matching workspaces.", loading: "Loading workspaces…",
      error: "Failed to load workspaces", retry: "Retry",
      formCreate: "New workspace", formEdit: "Edit workspace",
      fTitle: "Title *", fName: "Name (optional)", fDir: "Directory (absolute local path, optional)", fDesc: "Description (optional)",
      save: "Save", titleRequired: "Title is required", dirInvalid: "Directory must be an absolute local path (/ or X:\\)",
      created: "Workspace created", updated: "Workspace updated", removed: "Workspace deleted",
      deleteWithTasks: function (title, n) { return "Delete \"" + title + "\"? " + n + " task(s) will be unlinked; the tasks themselves are kept."; },
      deletePlain: function (title) { return "Delete \"" + title + "\"? This cannot be undone."; },
      openTasks: "Open the tasks of this workspace in Records",
    },
  };

  // 只补共享样式没覆盖到的结构间距；容器、行卡片、按钮、输入框、空态与错误态都复用 styles.cjs。
  var CSS = [
    ".wbt-ws-heading{display:flex;flex-direction:column;gap:2px;min-width:0}",
    ".wbt-ws-h2{margin:0;font-size:17px;line-height:1.3;font-weight:600}",
    ".wbt-ws-hint{font-size:12px;line-height:1.4;color:var(--dsw-alias-label-secondary,inherit);overflow-wrap:anywhere}",
    ".wbt-ws-toolbar{display:flex;align-items:center;gap:8px;flex-wrap:wrap;flex:none}",
    ".wbt-ws-toolbar .wbt-input{flex:1 1 220px;min-width:0}",
    ".wbt-ws-count{font-size:12px;color:var(--dsw-alias-label-secondary,inherit);white-space:nowrap}",
    ".wbt-ws-row{align-items:flex-start}",
    ".wbt-ws-main{flex:1;min-width:0;display:flex;flex-direction:column;gap:5px}",
    ".wbt-ws-titleline{display:flex;align-items:center;gap:8px;flex-wrap:wrap;min-width:0}",
    ".wbt-ws-title{font-weight:600;font-size:13.5px;line-height:1.4;overflow-wrap:anywhere}",
    ".wbt-ws-name{font-size:11px;line-height:1.6;border:1px solid var(--wbt-line);border-radius:999px;padding:0 8px;color:var(--dsw-alias-label-secondary,inherit)}",
    ".wbt-ws-dir{font-size:12px;line-height:1.5;overflow-wrap:anywhere}",
    ".wbt-ws-dir code{background:color-mix(in oklab,currentColor 6%,transparent);padding:1px 6px;border-radius:4px}",
    ".wbt-ws-nodir{color:var(--dsw-alias-label-secondary,inherit)}",
    ".wbt-ws-desc{margin:0;font-size:12.5px;line-height:1.55;color:var(--dsw-alias-label-secondary,inherit);overflow-wrap:anywhere}",
    ".wbt-ws-ops{display:flex;gap:6px;flex:none;flex-wrap:wrap;justify-content:flex-end}",
    ".wbt-ws-ask{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-top:2px;border:1px solid color-mix(in oklab,var(--dsw-alias-state-error-primary,#e5484d) 45%,transparent);border-radius:var(--wb-radius-sm);padding:7px 9px;font-size:12.5px;line-height:1.5}",
    ".wbt-ws-ask .wbt-btn[data-danger]{color:var(--dsw-alias-state-error-primary,#e5484d)}",
    ".wbt-ws-toast{font-size:12px;color:var(--dsw-alias-label-secondary,inherit);white-space:nowrap}",
    ".wbt-ws-fields{display:flex;flex-direction:column;gap:8px}",
    ".wbt-ws-fields .wbt-input{width:100%;box-sizing:border-box}",
    ".wbt-ws-fields textarea.wbt-input{min-height:64px;resize:vertical;font:inherit}",
  ].join("");

  function result(r) {
    if (!r || !r.ok) throw new Error((r && r.error) || "Request failed");
    return r.result || {};
  }

  function WorkspaceForm(props) {
    var t = props.t;
    var ws = props.workspace || {};
    var ss = React.useState({
      title: String(ws.title || ""), name: String(ws.name || ""),
      dir: String(ws.dir || ""), description: String(ws.description || ""),
    });
    var draft = ss[0], setDraft = ss[1];
    var es = React.useState(""), err = es[0], setErr = es[1];
    var bs = React.useState(false), busy = bs[0], setBusy = bs[1];
    function field(key) {
      // 用函数式更新：同一次渲染内的连续输入不能互相覆盖。
      return function (event) {
        var value = event.target.value;
        setDraft(function (prev) { return Object.assign({}, prev, { [key]: value }); });
      };
    }
    function submit() {
      var title = draft.title.trim();
      if (!title) { setErr(t.titleRequired); return; }
      var dir = draft.dir.trim();
      if (dir && !(/^\//.test(dir) || /^[A-Za-z]:[\\/]/.test(dir) || /^\\\\/.test(dir))) { setErr(t.dirInvalid); return; }
      setErr(""); setBusy(true);
      var args = { title: title, name: draft.name.trim(), description: draft.description };
      if (props.mode === "edit") args.id = String(ws.id);
      args.dir = dir || null;
      props.api.call(props.mode === "edit" ? "taskWorkspaces.update" : "taskWorkspaces.create", args).then(function (r) {
        setBusy(false);
        try { result(r); } catch (e) { setErr(String((e && e.message) || e)); return; }
        props.onSaved(props.mode);
      }, function (e) { setBusy(false); setErr(String((e && e.message) || e)); });
    }
    return h("div", { className: "wbt-modal-mask", role: "dialog", "aria-modal": "true", "aria-label": props.mode === "edit" ? t.formEdit : t.formCreate },
      h("div", { className: "wbt-modal" },
        h("div", { className: "wbt-modal-head" }, h("h3", null, props.mode === "edit" ? t.formEdit : t.formCreate)),
        h("div", { className: "wbt-ws-fields" },
          h("input", { className: "wbt-input", value: draft.title, placeholder: t.fTitle, "aria-label": t.fTitle, onChange: field("title") }),
          h("input", { className: "wbt-input", value: draft.name, placeholder: t.fName, "aria-label": t.fName, onChange: field("name") }),
          h("input", { className: "wbt-input", value: draft.dir, placeholder: t.fDir, "aria-label": t.fDir, onChange: field("dir") }),
          h("textarea", { className: "wbt-input", value: draft.description, placeholder: t.fDesc, "aria-label": t.fDesc, onChange: field("description") })),
        err ? h("div", { className: "wbt-err", role: "alert" }, err) : null,
        h("div", { className: "wbt-modal-foot" },
          h("button", { className: "wbt-btn primary", type: "button", disabled: busy, onClick: submit }, t.save),
          h("button", { className: "wbt-btn ghost", type: "button", onClick: props.onCancel }, t.cancel))));
  }

  function WorkspaceView(props) {
    var lang = props.lang === "en" ? "en" : "zh", t = COPY[lang];
    var api = props.api;
    var listS = React.useState(null), records = listS[0], setRecords = listS[1];
    var busyS = React.useState(true), busy = busyS[0], setBusy = busyS[1];
    var errS = React.useState(""), error = errS[0], setError = errS[1];
    var tickS = React.useState(0), tick = tickS[0], setTick = tickS[1];
    var queryS = React.useState(""), query = queryS[0], setQuery = queryS[1];
    var formS = React.useState(null), form = formS[0], setForm = formS[1];
    var askS = React.useState(null), ask = askS[0], setAsk = askS[1];
    var toastS = React.useState(""), toast = toastS[0], setToast = toastS[1];

    React.useEffect(function () {
      var cancelled = false;
      setBusy(true); setError("");
      api.call("taskWorkspaces.list", { pageSize: 100 }).then(result).then(function (r) {
        if (cancelled) return;
        setRecords(Array.isArray(r.records) ? r.records : []);
        setBusy(false);
      }).catch(function (e) {
        if (cancelled) return;
        setBusy(false);
        setError(String((e && e.message) || e));
      });
      return function () { cancelled = true; };
    }, [api, tick]);

    // 工作区改名/删除或任务挂接变化时，列表与任务数一起刷新；切走视图时退订。
    React.useEffect(function () {
      if (!api || typeof api.subscribe !== "function") return undefined;
      var off = api.subscribe(function (p) {
        if (!p) return;
        if (p.event === "task-workspaces-changed" || p.event === "tasks-changed") setTick(function (n) { return n + 1; });
      });
      return off;
    }, [api]);

    React.useEffect(function () {
      if (!toast) return;
      var id = setTimeout(function () { setToast(""); }, 2600);
      return function () { clearTimeout(id); };
    }, [toast]);

    function reload() { setTick(function (n) { return n + 1; }); }
    function say(msg) { setToast(msg); }
    function openTasks(id) {
      if (typeof props.onNavigate === "function") props.onNavigate("tasks", { workspaceIds: [String(id)] });
    }
    function confirmDelete() {
      if (!ask) return;
      api.call("taskWorkspaces.delete", { id: String(ask.id) }).then(function (r) {
        try { result(r); } catch (e) { say(String((e && e.message) || e)); return; }
        setAsk(null); say(t.removed); reload();
      }, function (e) { say(String((e && e.message) || e)); });
    }

    var list = records || [];
    var keyword = query.trim().toLowerCase();
    var shown = list.filter(function (w) {
      if (!keyword) return true;
      return [w.title, w.name, w.dir, w.description].some(function (v) { return String(v || "").toLowerCase().indexOf(keyword) >= 0; });
    });

    function row(w) {
      var id = String(w.id), name = String(w.title || w.name || id);
      var count = Number(w.taskCount) || 0;
      return h("article", { className: "wbt-item wbt-ws-row", key: id },
        h("div", { className: "wbt-ws-main" },
          h("div", { className: "wbt-ws-titleline" },
            h("span", { className: "wbt-ws-title" }, name),
            w.name && w.name !== w.title ? h("span", { className: "wbt-ws-name" }, String(w.name)) : null,
            h("button", {
              className: "wbt-btn ghost", type: "button", title: t.openTasks,
              "aria-label": t.openTasks + " " + name,
              onClick: function () { openTasks(id); },
            }, icon("list"), t.tasks(count))),
          h("div", { className: "wbt-ws-dir" },
            w.dir ? h("code", null, String(w.dir)) : h("span", { className: "wbt-ws-nodir" }, t.noDir)),
          w.description ? h("p", { className: "wbt-ws-desc" }, String(w.description)) : null,
          ask && String(ask.id) === id
            ? h("div", { className: "wbt-ws-ask", role: "alert" },
              h("span", null, count ? t.deleteWithTasks(name, count) : t.deletePlain(name)),
              h("button", { className: "wbt-btn", type: "button", "data-danger": "1", onClick: confirmDelete }, icon("trash"), t.confirm),
              h("button", { className: "wbt-btn ghost", type: "button", onClick: function () { setAsk(null); } }, t.cancel))
            : null),
        h("div", { className: "wbt-ws-ops" },
          h("button", { className: "wbt-btn ghost", type: "button", onClick: function () { setForm({ mode: "edit", workspace: w }); } }, icon("pencil"), t.edit),
          h("button", { className: "wbt-btn ghost", type: "button", onClick: function () { setAsk({ id: id, title: name }); } }, icon("trash"), t.del)));
    }

    var body;
    if (busy) body = h("p", { className: "wbt-empty", role: "status" }, t.loading);
    else if (error) {
      body = h("div", { className: "wbt-err", role: "alert" },
        h("div", null, t.error + "：" + error),
        h("button", { className: "wbt-btn", type: "button", onClick: reload }, icon("refresh"), t.retry));
    } else if (!list.length) body = h("p", { className: "wbt-empty", role: "status" }, t.empty);
    else if (!shown.length) body = h("p", { className: "wbt-empty", role: "status" }, t.noMatch);
    else body = shown.map(row);

    return h("div", { className: "wbt-root wbt-ws" },
      h("style", null, CSS),
      h("div", { className: "wbt-pathrow" },
        h("div", { className: "wbt-ws-heading" },
          h("h2", { className: "wbt-ws-h2" }, t.title),
          h("span", { className: "wbt-ws-hint" }, t.hint)),
        h("div", { className: "wbt-grow" }),
        toast ? h("span", { className: "wbt-ws-toast", "aria-live": "polite" }, toast) : null,
        h("button", { className: "wbt-btn ghost", type: "button", title: t.refresh, "aria-label": t.refresh, onClick: reload }, icon("refresh"), t.refresh),
        h("button", {
          className: "wbt-btn primary", type: "button",
          onClick: function () { setForm({ mode: "create", workspace: null }); },
        }, icon("plus", 14), t.create)),
      h("div", { className: "wbt-ws-toolbar" },
        h("input", {
          className: "wbt-input", value: query, placeholder: t.search, "aria-label": t.search,
          onChange: function (e) { setQuery(e.target.value); },
        }),
        busy ? null : h("span", { className: "wbt-ws-count", role: "status" }, keyword ? t.count(list.length) + " · " + t.match(shown.length) : t.count(list.length))),
      h("div", { className: "wbt-content" },
        h("div", { className: "wbt-list-scroll" }, body)),
      form
        ? h(WorkspaceForm, {
          api: api, t: t, mode: form.mode, workspace: form.workspace,
          onCancel: function () { setForm(null); },
          onSaved: function (mode) {
            setForm(null);
            say(mode === "edit" ? t.updated : t.created);
            reload();
          },
        })
        : null);
  }

  return { WorkspaceView: WorkspaceView, CSS: CSS };
};
