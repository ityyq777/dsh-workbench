// dsh-workbench-tags 浏览器侧源码。构建：node scripts/build-addon-clients.mjs → lib/client.js
var React = require("react");
var h = React.createElement;

(function () {
  "use strict";

  var host = window.__WB_HOST__;
  if (!host) {
    console.error("[wb-addon-tags] 宿主桥 window.__WB_HOST__ 不存在，视图未注册");
    module.exports = { name: "dsh-workbench-tags", inject: [], apply: function () {} };
    return;
  }
  var React = require("react");
  var h = React.createElement;
  var statsView = require("./views/stats.cjs");
  var configView = require("./views/config.cjs");
  var dataView = require("./views/data.cjs");

  // 标签插件自带 lucide-react 图标；每个图标按需引入，随 client.js 一起打包。
  var ICONS = {
    "search": require("lucide-react/icons/search").default,
    "x": require("lucide-react/icons/x").default,
    "plus": require("lucide-react/icons/plus").default,
    "trash": require("lucide-react/icons/trash-2").default,
    "pencil": require("lucide-react/icons/pencil").default,
    "check": require("lucide-react/icons/check").default,
    "refresh": require("lucide-react/icons/refresh-cw").default,
    "chart": require("lucide-react/icons/chart-column").default,
    "settings": require("lucide-react/icons/settings").default,
    "database": require("lucide-react/icons/database").default,
    "tags": require("lucide-react/icons/tags").default,
    "code-2": require("lucide-react/icons/code-xml").default,
  };
  // 标签页标题左侧图标：与储物/任务/站点保持同语义、同尺寸。
  function tabIcon(name) { return function TagsTabIcon() { return h(Icon, { name: name, size: 14 }); }; }
  // 统一的小尺寸图标调用方式，保持各视图里的 Icon({ name, size }) 不变。
  function Icon(props) {
    var C = ICONS[props.name];
    if (!C) return null;
    return h(C, { size: props.size || 14, strokeWidth: 2, "aria-hidden": "true", className: "wbg-svg" });
  }

  var COPY = {
    zh: {
      title: "标签", hint: "标签用于给站点等业务归类；所有数据保存在本地。",
      search: "搜索标签名称", find: "搜索", clear: "清空", create: "新建标签",
      name: "标签名称", namePlaceholder: "输入标签名称，最多 64 字",
      createTime: "创建时间", ops: "操作", empty: "还没有标签，先创建一个吧",
      noMatch: "没有匹配的标签", loading: "加载中…", error: "加载失败：",
      retry: "重试", save: "创建", cancel: "取消", del: "删除",
      confirmDel: "确认删除", confirmBatch: "确认删除选中", selected: "已选",
      selectAll: "全选", total: "共", items: "个标签", page: "第", pageUnit: "页",
      prev: "上一页", next: "下一页", created: "已创建", deleted: "已删除",
      needName: "标签名称不能为空", tooLong: "标签名称不能超过 64 个字符",
      rename: "重命名", renameSave: "保存", renameHint: "回车保存，Esc 取消；名称不能与其它标签重复",
      renamed: "已重命名", dupExisting: "标签已存在，已选中", refresh: "刷新", batchHint: "删除只移除标签，关联数据保留在业务表中",
    },
    en: {
      title: "Tags", hint: "Tags classify sites and other business data; everything stays local.",
      search: "Search tag name", find: "Search", clear: "Clear", create: "New tag",
      name: "Tag name", namePlaceholder: "Tag name, up to 64 characters",
      createTime: "Created", ops: "Actions", empty: "No tags yet. Create the first one.",
      noMatch: "No matching tags", loading: "Loading…", error: "Failed to load: ",
      retry: "Retry", save: "Create", cancel: "Cancel", del: "Delete",
      confirmDel: "Confirm delete", confirmBatch: "Delete selected", selected: "Selected",
      selectAll: "Select all", total: "Total", items: "tags", page: "Page", pageUnit: "",
      prev: "Prev", next: "Next", created: "Created", deleted: "Deleted",
      needName: "Tag name is required", tooLong: "Tag name cannot exceed 64 characters",
      rename: "Rename", renameSave: "Save", renameHint: "Enter to save, Esc to cancel; the name must be unique",
      renamed: "Renamed", dupExisting: "Tag already exists; selected", refresh: "Refresh", batchHint: "Deleting a tag keeps business data in place",
    },
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
    ".wbg-rename{width:100%;padding:4px 9px;font-size:12.5px;border-radius:999px}",
    ".wbg-time{font-size:12px;opacity:.55;white-space:nowrap;font-variant-numeric:tabular-nums}",
    ".wbg-ops{display:flex;align-items:center;gap:6px;flex:none}",
    ".wbg-empty,.wbg-loading{border:1px dashed var(--wbg-line);border-radius:10px;padding:38px 16px;text-align:center;font-size:12.5px;opacity:.6}",
    ".wbg-error{border:1px solid color-mix(in oklab,var(--dsw-alias-state-error-primary,#e5484d) 40%,transparent);border-radius:10px;padding:12px 14px;color:var(--dsw-alias-state-error-primary,#e5484d);font-size:12.5px;display:flex;gap:10px;align-items:center;flex-wrap:wrap}",
    ".wbg-pager{display:flex;align-items:center;gap:10px;flex-wrap:wrap;font-size:12px;opacity:.72;padding-top:2px}",
    ".wbg-pager .wbg-grow{flex:1}",
    ".wbg-batch{display:flex;align-items:center;gap:8px;flex-wrap:wrap;font-size:12px;border:1px solid color-mix(in oklab,var(--wbg-accent) 35%,transparent);background:color-mix(in oklab,var(--wbg-accent) 7%,transparent);border-radius:9px;padding:7px 10px}",
    ".wbg-hint{font-size:11.5px;opacity:.55;line-height:1.5}",
    ".wbg-toast{position:fixed;left:50%;bottom:26px;transform:translateX(-50%);z-index:820;background:var(--dsw-alias-toast-bg,rgba(20,20,20,.88));color:var(--dsw-alias-toast-label,#fff);border-radius:9px;padding:9px 14px;font-size:12.5px;box-shadow:0 8px 24px rgba(0,0,0,.18);pointer-events:none}",
    "@media (max-width:760px){.wbg-search{width:100%;max-width:none}.wbg-toolbar .wbg-grow{display:none}.wbg-time{display:none}.wbg-row{padding:9px 10px}.wbg-ops .wbg-btn{padding:6px 8px}}",
  ].join("\n");

  function injectCss() {
    if (typeof document === "undefined") return;
    var old = document.getElementById("wb-addon-tags-css");
    if (old) { old.textContent = CSS; return; }
    var s = document.createElement("style");
    s.id = "wb-addon-tags-css";
    s.setAttribute("data-wb-addon", "wb-addon-tags");
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  function colorFor(seed) {
    var s = String(seed || "");
    var n = 0;
    for (var i = 0; i < s.length; i++) n = (n * 31 + s.charCodeAt(i)) >>> 0;
    return PALETTE[n % PALETTE.length];
  }

  var CFG_FALLBACK = {
    "list.pageSize": 18, "form.maxNameLength": 64, "ui.confirmDelete": true, "ui.toastDuration": 2600,
    "stats.range": "30d", "stats.top": 10, "stats.showKpi": true,
    "stats.sections": ["usage", "top", "types", "trend", "stale", "recent"],
  };

  function TagsView(props) {
    var lang = props.lang === "en" ? "en" : "zh";
    var cfg = configView.useConfig(props.api, CFG_FALLBACK);
    if (!cfg.ready) {
      return h("div", { style: { padding: "48px", textAlign: "center", fontSize: "12.5px", opacity: .6 } }, lang === "en" ? "Loading…" : "载入中…");
    }
    return h(TagsViewBody, Object.assign({}, props, { cfg: cfg.values }));
  }

  function TagsViewBody(props) {
    var api = props.api;
    var lang = props.lang === "en" ? "en" : "zh";
    var t = COPY[lang];

    var rowsS = React.useState([]);
    var rows = rowsS[0], setRows = rowsS[1];
    var totalS = React.useState(0);
    var total = totalS[0], setTotal = totalS[1];
    var pagesS = React.useState(0);
    var pages = pagesS[0], setPages = pagesS[1];
    var pageS = React.useState(1);
    var page = pageS[0], setPage = pageS[1];
    var initialText = String((props.viewParams && props.viewParams.text) || "");
    var textS = React.useState(initialText);
    var text = textS[0], setText = textS[1];
    var queryS = React.useState(initialText);
    var query = queryS[0], setQuery = queryS[1];
    var loadingS = React.useState(true);
    var loading = loadingS[0], setLoading = loadingS[1];
    var errorS = React.useState("");
    var error = errorS[0], setError = errorS[1];
    var toastS = React.useState("");
    var toast = toastS[0], setToast = toastS[1];
    var creatingS = React.useState(false);
    var creating = creatingS[0], setCreating = creatingS[1];
    var nameS = React.useState("");
    var name = nameS[0], setName = nameS[1];
    var formErrorS = React.useState("");
    var formError = formErrorS[0], setFormError = formErrorS[1];
    var savingS = React.useState(false);
    var saving = savingS[0], setSaving = savingS[1];
    var selectedS = React.useState([]);
    var selected = selectedS[0], setSelected = selectedS[1];
    var confirmS = React.useState("");
    var confirmId = confirmS[0], setConfirmId = confirmS[1];
    var confirmAllS = React.useState(false);
    var confirmAll = confirmAllS[0], setConfirmAll = confirmAllS[1];
    var busyS = React.useState(false);
    var busy = busyS[0], setBusy = busyS[1];
    var editIdS = React.useState("");
    var editId = editIdS[0], setEditId = editIdS[1];
    var editNameS = React.useState("");
    var editName = editNameS[0], setEditName = editNameS[1];
    var editRef = React.useRef(null);
    var editCancelRef = React.useRef(false);
    var renameDoneRef = React.useRef(false);
    var refreshRef = React.useRef(null);
    var cfg = props.cfg || {};
    var cfgSize = Math.floor(Number(cfg["list.pageSize"]));
    if (!(cfgSize > 0)) cfgSize = 18;
    var pageSize = cfgSize;
    var cfgMaxName = Math.floor(Number(cfg["form.maxNameLength"]));
    if (!(cfgMaxName >= 8)) cfgMaxName = 64;
    var cfgConfirm = cfg["ui.confirmDelete"] !== false;
    var cfgToast = Math.floor(Number(cfg["ui.toastDuration"]));
    if (!(cfgToast >= 800)) cfgToast = 2600;

    function say(msg) { setToast(String(msg || "")); }

    React.useEffect(function () {
      if (!editId || !editRef.current) return;
      editRef.current.focus();
      editRef.current.select();
    }, [editId]);

    function beginRename(row) {
      setConfirmId("");
      editCancelRef.current = false;
      // 上一次保存的请求可能还没回来；重开编辑态时清掉“已提交”标记，否则这次回车会被吞掉。
      renameDoneRef.current = false;
      setEditId(String(row.id));
      setEditName(String(row.name || ""));
    }

    function cancelRename() {
      editCancelRef.current = true;
      closeRename();
    }

    function saveRename() {
      if (editCancelRef.current) { editCancelRef.current = false; return; }
      if (renameDoneRef.current) return;
      var id = editId;
      if (!id) return;
      var value = String(editName || "").trim();
      if (!value) { say(t.needName); return; }
      if (value.length > cfgMaxName) { say(t.tooLong); return; }
      var cur = rows.filter(function (r) { return String(r.id) === String(id); })[0];
      if (cur && value === String(cur.name || "")) { closeRename(); return; }
      // 先关掉编辑态再发请求，避免 blur 与 Enter 重复提交。
      renameDoneRef.current = true;
      closeRename();
      api.call("tags.update", { id: id, name: value }).then(function (r) {
        renameDoneRef.current = false;
        if (r && r.ok) {
          say(t.renamed + "：" + value);
          if (refreshRef.current) refreshRef.current();
        } else {
          say((r && r.error) || "rename failed");
        }
      }).catch(function (e) {
        renameDoneRef.current = false;
        say(String((e && e.message) || e));
      });
    }

    function closeRename() {
      setEditId("");
      setEditName("");
    }

    React.useEffect(function () {
      if (!toast) return;
      var id = setTimeout(function () { setToast(""); }, cfgToast);
      return function () { clearTimeout(id); };
    }, [toast, cfgToast]);

    var refreshList = React.useCallback(function () {
      setLoading(true);
      return api.call("tags.list", { pageNumber: page, pageSize: pageSize, text: query }).then(function (r) {
        setLoading(false);
        if (r && r.ok) {
          var data = r.result || {};
          setRows(Array.isArray(data.records) ? data.records : []);
          setTotal(Number(data.total || 0));
          setPages(Number(data.pages || 0));
          setError("");
        } else {
          setError((r && r.error) || "load failed");
        }
      }).catch(function (e) {
        setLoading(false);
        setError(String((e && e.message) || e));
      });
    }, [api, page, query]);

    refreshRef.current = refreshList;

    React.useEffect(function () {
      injectCss();
    }, []);

    React.useEffect(function () {
      refreshList();
    }, [refreshList]);

    React.useEffect(function () {
      var off = api.subscribe(function (p) {
        if (p && p.event === "tags-changed" && refreshRef.current) refreshRef.current();
      });
      return off;
    }, [api]);

    React.useEffect(function () {
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
      if (!value) { setFormError(t.needName); return; }
      if (value.length > cfgMaxName) { setFormError(t.tooLong); return; }
      setSaving(true);
      setFormError("");
      api.call("tags.create", { name: value }).then(function (r) {
        setSaving(false);
        if (r && r.ok) {
          setCreating(false);
          setName("");
          setText("");
          setQuery("");
          setPage(1);
          var existed = r.result && r.result.existing;
          say((existed ? t.dupExisting : t.created) + "：" + value);
          setTimeout(function () { if (refreshRef.current) refreshRef.current(); }, 0);
        } else {
          var msg = (r && r.error) || "create failed";
          setFormError(msg);
        }
      }).catch(function (e2) {
        setSaving(false);
        setFormError(String((e2 && e2.message) || e2));
      });
    }

    function toggle(id) {
      setSelected(function (prev) {
        var i = prev.indexOf(id);
        if (i >= 0) return prev.filter(function (x) { return x !== id; });
        return prev.concat([id]);
      });
    }

    function toggleAll() {
      if (rows.length && selected.length === rows.length) setSelected([]);
      else setSelected(rows.map(function (r) { return r.id; }));
    }

    function deleteOne(id) {
      setBusy(true);
      api.call("tags.delete", { id: id }).then(function (r) {
        setBusy(false);
        setConfirmId("");
        if (r && r.ok) {
          say(t.deleted);
          if (rows.length === 1 && page > 1) setPage(page - 1);
          else if (refreshRef.current) refreshRef.current();
        } else {
          say((r && r.error) || "delete failed");
        }
      }).catch(function (e) {
        setBusy(false);
        setConfirmId("");
        say(String((e && e.message) || e));
      });
    }

    function deleteSelected() {
      var ids = selected.slice();
      if (!ids.length) return;
      setBusy(true);
      var chain = Promise.resolve();
      var failed = 0;
      ids.forEach(function (id) {
        chain = chain.then(function () {
          return api.call("tags.delete", { id: id }).then(function (r) {
            if (!r || !r.ok) failed += 1;
          }).catch(function () { failed += 1; });
        });
      });
      chain.then(function () {
        setBusy(false);
        setConfirmAll(false);
        setSelected([]);
        say(failed ? "部分删除失败：" + failed + " 个" : t.deleted + " " + ids.length + " 个");
        if (refreshRef.current) refreshRef.current();
      });
    }

    var allChecked = rows.length > 0 && selected.length === rows.length;

    return h("div", { className: "wbg-root" },
      h("div", { className: "wbg-top" },
        h("div", { className: "wbg-grow" },
          h("h2", null, t.title),
          h("div", { className: "wbg-sub" }, t.hint)
        ),
        h("div", { className: "wbg-toolbar" },
          h("input", {
            className: "wbg-input wbg-search", value: text, placeholder: t.search,
            onChange: function (e) { setText(e.target.value); },
            onKeyDown: function (e) { if (e.key === "Enter") applySearch(); },
          }),
          h("button", { type: "button", className: "wbg-btn", onClick: applySearch }, h(Icon, { name: "search", size: 13 }), t.find),
          (text || query) ? h("button", { type: "button", className: "wbg-btn ghost", onClick: clearSearch }, h(Icon, { name: "x", size: 13 }), t.clear) : null,
          h("button", {
            type: "button", className: "wbg-btn ghost", title: t.refresh, "aria-label": t.refresh,
            disabled: loading, onClick: function () { if (refreshRef.current) refreshRef.current(); },
          }, h(Icon, { name: "refresh", size: 13 }), t.refresh),
          h("button", {
            type: "button", className: "wbg-btn primary",
            onClick: function () { setCreating(!creating); setFormError(""); },
          }, h(Icon, { name: creating ? "x" : "plus", size: 13 }), creating ? t.cancel : t.create)
        )
      ),

      creating ? h("form", { className: "wbg-create", onSubmit: submitCreate },
        h("input", {
          className: "wbg-input", value: name, placeholder: t.namePlaceholder, autoFocus: true,
          maxLength: 64, onChange: function (e) { setName(e.target.value); setFormError(""); },
        }),
        h("button", { type: "submit", className: "wbg-btn primary", disabled: saving }, saving ? "…" : t.save),
        h("button", { type: "button", className: "wbg-btn ghost", onClick: function () { setCreating(false); setName(""); setFormError(""); } }, t.cancel),
        formError ? h("div", { className: "wbg-formerr" }, formError) : null
      ) : null,

      selected.length ? h("div", { className: "wbg-batch" },
        h("span", null, t.selected + " " + selected.length),
        (confirmAll || !cfgConfirm)
          ? h("button", { type: "button", className: "wbg-btn danger", disabled: busy, onClick: deleteSelected }, busy ? "…" : (cfgConfirm ? t.confirmBatch : t.del))
          : h("button", { type: "button", className: "wbg-btn danger", onClick: function () { setConfirmAll(true); } }, t.del),
        confirmAll ? h("button", { type: "button", className: "wbg-btn ghost", onClick: function () { setConfirmAll(false); } }, t.cancel) : null,
        h("span", { className: "wbg-hint" }, t.batchHint)
      ) : null,

      error ? h("div", { className: "wbg-error" },
        h("span", null, t.error + error),
        h("button", { type: "button", className: "wbg-btn", onClick: function () { if (refreshRef.current) refreshRef.current(); } }, t.retry)
      ) : null,

      h("div", { className: "wbg-listhead" },
        h("input", {
          type: "checkbox", className: "wbg-check", checked: allChecked,
          onChange: toggleAll, "aria-label": t.selectAll, disabled: !rows.length,
        }),
        h("span", { className: "wbg-hname" }, t.name),
        h("span", { className: "wbg-time" }, t.createTime),
        h("span", { style: { width: "56px", textAlign: "right" } }, t.ops)
      ),

      loading ? h("div", { className: "wbg-loading" }, t.loading)
        : rows.length === 0 ? h("div", { className: "wbg-empty" }, query ? t.noMatch : t.empty)
        : h("div", { className: "wbg-list" }, rows.map(function (row) {
          var color = colorFor(row.id || row.name);
          var editing = String(editId) === String(row.id);
          return h("div", {
            key: row.id, className: "wbg-row", style: { "--tag-color": color },
          },
            h("input", {
              type: "checkbox", className: "wbg-check", checked: selected.indexOf(row.id) >= 0,
              onChange: function () { toggle(row.id); }, "aria-label": row.name,
            }),
            editing
              ? h("div", { className: "wbg-name" },
                  h("input", {
                    ref: editRef, type: "text", className: "wbg-input wbg-rename", value: editName,
                    maxLength: cfgMaxName, "aria-label": t.name, title: t.renameHint,
                    onChange: function (e) { setEditName(e.target.value); },
                    onKeyDown: function (e) {
                      if (e.key === "Enter") { e.preventDefault(); saveRename(); }
                      if (e.key === "Escape") { e.preventDefault(); cancelRename(); }
                    },
                    onBlur: function () { saveRename(); },
                  })
                )
              : h("div", { className: "wbg-name" },
                  h("span", {
                    className: "wbg-chip", title: t.renameHint, style: { cursor: "text" },
                    onDoubleClick: function () { beginRename(row); },
                  }, row.name)
                ),
            h("div", { className: "wbg-time" }, row.createTime || ""),
            h("div", { className: "wbg-ops" },
              editing
                ? [
                    h("button", { key: "ok", type: "button", className: "wbg-btn primary", onClick: saveRename }, h(Icon, { name: "check", size: 13 }), t.renameSave),
                    h("button", { key: "no", type: "button", className: "wbg-btn ghost", onClick: cancelRename }, t.cancel),
                  ]
                : h("button", { type: "button", className: "wbg-btn ghost", title: t.rename, "aria-label": t.rename, onClick: function () { beginRename(row); } }, h(Icon, { name: "pencil", size: 13 })),
              (confirmId === row.id || !cfgConfirm)
                ? h("button", { type: "button", className: "wbg-btn danger", disabled: busy, onClick: function () { deleteOne(row.id); } }, busy ? "…" : (cfgConfirm ? t.confirmDel : t.del))
                : h("button", { type: "button", className: "wbg-btn danger", onClick: function () { setConfirmId(row.id); } }, h(Icon, { name: "trash", size: 13 }), t.del),
              confirmId === row.id
                ? h("button", { type: "button", className: "wbg-btn ghost", onClick: function () { setConfirmId(""); } }, t.cancel)
                : null
            )
          );
        })),

      h("div", { className: "wbg-pager" },
        h("span", null, t.total + " " + total + " " + t.items),
        h("span", { className: "wbg-grow" }),
        h("button", {
          type: "button", className: "wbg-btn", disabled: page <= 1 || loading,
          onClick: function () { setPage(page - 1); },
        }, t.prev),
        h("span", null, t.page + " " + page + " / " + Math.max(pages, 1) + " " + t.pageUnit),
        h("button", {
          type: "button", className: "wbg-btn", disabled: page >= pages || !pages || loading,
          onClick: function () { setPage(page + 1); },
        }, t.next)
      ),

      toast ? h("div", { className: "wbg-toast" }, toast) : null
    );
  }

  host.registerAddon({
    id: "wb-addon-tags",
    version: "1.7.0",
    views: [
      { id: "stats", icon: tabIcon("chart"), title: { zh: "统计", en: "Stats" }, component: statsView.TagsStatsView },
      { id: "tags", icon: tabIcon("tags"), title: { zh: "记录", en: "Records" }, component: TagsView },
      { id: "config", icon: tabIcon("settings"), title: { zh: "配置", en: "Config" }, component: configView.ConfigView },
      { id: "data", icon: tabIcon("database"), title: { zh: "数据", en: "Data" }, component: dataView.DataView },
      { id: "actions", icon: tabIcon("code-2"), title: { zh: "Action", en: "Actions" }, component: require("./views/actions.cjs").ActionSchemaView },
    ],
  });

  module.exports = { name: "dsh-workbench-tags", inject: [], apply: function () {} };
})();
