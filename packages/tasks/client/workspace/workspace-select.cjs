// 工作区多选：chip 列表 + 搜索候选 + 内联新建。状态由调用方持有，组件只负责取数、渲染与回传。
module.exports = function createWorkspaceSelect(React) {
  var h = React.createElement;
  var COPY = {
    zh: { label: "工作区", empty: "未关联工作区", search: "搜索工作区", none: "没有匹配的工作区", createHint: "新建工作区", title: "标题", dir: "目录（本机绝对路径，可空）", desc: "描述（可空）", create: "创建并关联", cancel: "取消", loading: "加载中…", fail: "工作区列表加载失败", remove: "移除", dirInvalid: "目录必须是本机绝对路径（/ 或 X:\\）" },
    en: { label: "Workspaces", empty: "No workspace", search: "Search workspaces", none: "No matching workspace", createHint: "New workspace", title: "Title", dir: "Directory (absolute local path, optional)", desc: "Description (optional)", create: "Create and link", cancel: "Cancel", loading: "Loading…", fail: "Failed to load workspaces", remove: "Remove", dirInvalid: "Directory must be an absolute local path (/ or X:\\)" },
  };
  function text(lang, key) { return (COPY[lang] || COPY.zh)[key]; }

  function useWorkspaces(api) {
    var state = React.useState({ list: [], loading: true, error: "" });
    var snap = state[0], set = state[1];
    function reload() {
      set(function (prev) { return Object.assign({}, prev, { loading: true, error: "" }); });
      api.call("taskWorkspaces.list", { pageSize: 100 }).then(function (r) {
        if (!r || !r.ok) { set({ list: [], loading: false, error: (r && r.error) || "list failed" }); return; }
        set({ list: (r.result && r.result.records) || [], loading: false, error: "" });
      }, function (e) { set({ list: [], loading: false, error: (e && e.message) || "list failed" }); });
    }
    React.useEffect(reload, []);
    return { list: snap.list, loading: snap.loading, error: snap.error, reload: reload };
  }

  function WorkspaceSelect(props) {
    var lang = props.lang === "en" ? "en" : "zh";
    var t = function (key) { return text(lang, key); };
    var ws = useWorkspaces(props.api);
    var qs = React.useState("");
    var query = qs[0], setQuery = qs[1];
    var cs = React.useState(false);
    var creating = cs[0], setCreating = cs[1];
    var ns = React.useState({ title: "", dir: "", description: "" });
    var draft = ns[0], setDraft = ns[1];
    var es = React.useState("");
    var err = es[0], setErr = es[1];
    var selected = Array.isArray(props.value) ? props.value.map(String) : [];
    var byId = {};
    ws.list.forEach(function (w) { byId[String(w.id)] = w; });
    var keyword = query.trim().toLowerCase();
    var candidates = ws.list.filter(function (w) {
      if (!keyword) return true;
      return [w.title, w.name, w.description].some(function (v) { return String(v || "").toLowerCase().indexOf(keyword) >= 0; });
    });
    function toggle(id) {
      var key = String(id);
      var next = selected.indexOf(key) >= 0 ? selected.filter(function (x) { return x !== key; }) : selected.concat([key]);
      if (props.onChange) props.onChange(next);
    }
    function submitCreate() {
      if (!String(draft.title).trim()) { setErr(t("title") + " *"); return; }
      setErr("");
      props.api.call("taskWorkspaces.create", { title: String(draft.title).trim(), dir: String(draft.dir || "").trim() || null, description: String(draft.description || "") }).then(function (r) {
        if (!r || !r.ok) { setErr((r && r.error) || "create failed"); return; }
        var id = String(r.result.workspace.id);
        setCreating(false); setDraft({ title: "", dir: "", description: "" });
        ws.reload();
        if (props.onChange) props.onChange(selected.concat([id]));
      }, function (e) { setErr((e && e.message) || "create failed"); });
    }
    return h("div", { className: "wbt-field full wbt-wspicker" },
      h("span", null, t("label")),
      h("div", { className: "wbt-wschips" },
        selected.length ? selected.map(function (id) {
          var w = byId[id] || { id: id, title: id };
          return h("span", { className: "wbt-wschip", key: id, title: w.dir || "" },
            h("span", null, w.title || id),
            h("button", { type: "button", className: "wbt-icon", "aria-label": t("remove") + " " + (w.title || id), onClick: function () { toggle(id); } }, "×"));
        }) : h("span", { className: "wbt-hint" }, t("empty"))),
      h("div", { className: "wbt-wsrow" },
        h("input", { className: "wbt-input", value: query, placeholder: t("search"), onChange: function (e) { setQuery(e.target.value); } }),
        h("button", { type: "button", className: "wbt-btn ghost", onClick: function () { setCreating(!creating); } }, t("createHint"))),
      ws.loading ? h("div", { className: "wbt-hint" }, t("loading")) : null,
      ws.error ? h("div", { className: "wbt-err" }, t("fail")) : null,
      h("div", { className: "wbt-wslist", role: "listbox", "aria-multiselectable": "true" },
        !ws.loading && !candidates.length ? h("div", { className: "wbt-hint" }, t("none")) : null,
        candidates.map(function (w) {
          var id = String(w.id), on = selected.indexOf(id) >= 0;
          return h("button", { type: "button", role: "option", key: id, "aria-selected": on, className: "wbt-wsopt" + (on ? " on" : ""), title: w.dir || "", onClick: function () { toggle(id); } },
            h("span", { className: "wbt-wsopt-title" }, w.title || id),
            h("span", { className: "wbt-wsopt-meta" }, (w.taskCount || 0) + " · " + (w.dir || "—")));
        })),
      creating ? h("div", { className: "wbt-wscreate" },
        h("input", { className: "wbt-input", value: draft.title, placeholder: t("title") + " *", onChange: function (e) { setDraft(Object.assign({}, draft, { title: e.target.value })); } }),
        h("input", { className: "wbt-input", value: draft.dir, placeholder: t("dir"), onChange: function (e) { setDraft(Object.assign({}, draft, { dir: e.target.value })); } }),
        h("input", { className: "wbt-input", value: draft.description, placeholder: t("desc"), onChange: function (e) { setDraft(Object.assign({}, draft, { description: e.target.value })); } }),
        err ? h("div", { className: "wbt-err" }, err) : null,
        h("div", { className: "wbt-wsrow" },
          h("button", { type: "button", className: "wbt-btn primary", onClick: submitCreate }, t("create")),
          h("button", { type: "button", className: "wbt-btn ghost", onClick: function () { setCreating(false); setErr(""); } }, t("cancel")))) : null);
  }

  function WorkspaceChips(props) {
    var list = Array.isArray(props.list) ? props.list : [];
    if (!list.length) return null;
    return h("div", { className: "wbt-wschips" }, list.map(function (w) {
      return h("span", { className: "wbt-wschip", key: String(w.id), title: w.dir || "" }, w.title || w.id);
    }));
  }

  return { WorkspaceSelect: WorkspaceSelect, WorkspaceChips: WorkspaceChips, useWorkspaces: useWorkspaces, text: text };
};
