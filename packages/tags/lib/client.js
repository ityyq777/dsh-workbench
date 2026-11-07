// wb-addon-tags 浏览器侧：标签搜索 / 创建 / 删除 / 分页。
// 通过 window.__WB_HOST__ 注册，不打包 React。
(function () {
  window.__ModuleLoader__ = window.__ModuleLoader__ || { modules: {}, load: function (m) { this.modules[m.id] = m.factory; } };
  window.__ModuleLoader__.load({
    id: "dsh-workbench-tags",
    factory: function (require) {
  "use strict";

  var host = window.__WB_HOST__;
  if (!host) {
    console.error("[wb-addon-tags] 宿主桥 window.__WB_HOST__ 不存在，视图未注册");
    return { name: "dsh-workbench-tags", inject: [], apply: function () {} };
  }
  var React = host.react;
  var h = host.h;

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
      duplicate: "标签已存在", batchHint: "删除只移除标签，关联数据保留在业务表中",
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
      duplicate: "Tag already exists", batchHint: "Deleting a tag keeps business data in place",
    },
  };

  var PALETTE = ["#5B8FF9", "#5AD8A6", "#F6BD16", "#E8684A", "#6DC8EC", "#9270CA", "#FF9D4D", "#269A99"];

  var CSS = [
    ".wbg-root{--wbg-line:var(--dsw-alias-border-l2,color-mix(in oklab,currentColor 16%,transparent));--wbg-surface:var(--dsw-alias-bg-layer-1,color-mix(in oklab,currentColor 4%,transparent));--wbg-accent:var(--dsw-alias-accent,#11a89b);display:flex;flex-direction:column;gap:12px;min-height:0;color:inherit;font-size:13px}",
    ".wbg-top{display:flex;align-items:flex-start;gap:12px;flex-wrap:wrap}",
    ".wbg-top h2{margin:0;font-size:16px;font-weight:680;letter-spacing:.2px}",
    ".wbg-sub{font-size:12px;opacity:.58;line-height:1.6;margin-top:3px}",
    ".wbg-grow{flex:1;min-width:0}",
    ".wbg-toolbar{display:flex;align-items:center;gap:8px;flex-wrap:wrap}",
    ".wbg-input{border:1px solid var(--wbg-line);background:transparent;color:inherit;border-radius:8px;padding:7px 10px;font-size:13px;outline:none;min-width:0}",
    ".wbg-input:focus{border-color:var(--wbg-accent)}",
    ".wbg-search{width:240px;max-width:46vw}",
    ".wbg-btn{border:1px solid var(--wbg-line);background:var(--wbg-surface);color:inherit;border-radius:8px;padding:7px 11px;font-size:12.5px;cursor:pointer;white-space:nowrap;line-height:1.3}",
    ".wbg-btn:hover{border-color:var(--wbg-accent)}",
    ".wbg-btn.primary{background:var(--wbg-accent);border-color:var(--wbg-accent);color:#fff;font-weight:600}",
    ".wbg-btn.ghost{background:transparent}",
    ".wbg-btn.danger{color:#e5484d;border-color:color-mix(in oklab,#e5484d 45%,transparent)}",
    ".wbg-btn:disabled{opacity:.5;cursor:not-allowed}",
    ".wbg-create{display:flex;align-items:center;gap:8px;flex-wrap:wrap;border:1px solid var(--wbg-line);border-radius:10px;padding:10px 12px;background:color-mix(in oklab,var(--wbg-accent) 5%,transparent)}",
    ".wbg-create .wbg-input{flex:1;min-width:200px}",
    ".wbg-formerr{font-size:12px;color:#e5484d;flex-basis:100%}",
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
    ".wbg-error{border:1px solid color-mix(in oklab,#e5484d 40%,transparent);border-radius:10px;padding:12px 14px;color:#e5484d;font-size:12.5px;display:flex;gap:10px;align-items:center;flex-wrap:wrap}",
    ".wbg-pager{display:flex;align-items:center;gap:10px;flex-wrap:wrap;font-size:12px;opacity:.72;padding-top:2px}",
    ".wbg-pager .wbg-grow{flex:1}",
    ".wbg-batch{display:flex;align-items:center;gap:8px;flex-wrap:wrap;font-size:12px;border:1px solid color-mix(in oklab,var(--wbg-accent) 35%,transparent);background:color-mix(in oklab,var(--wbg-accent) 7%,transparent);border-radius:9px;padding:7px 10px}",
    ".wbg-hint{font-size:11.5px;opacity:.55;line-height:1.5}",
    ".wbg-toast{position:fixed;left:50%;bottom:26px;transform:translateX(-50%);z-index:820;background:rgba(20,20,20,.88);color:#fff;border-radius:9px;padding:9px 14px;font-size:12.5px;box-shadow:0 8px 24px rgba(0,0,0,.18);pointer-events:none}",
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

  function TagsView(props) {
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
    var textS = React.useState("");
    var text = textS[0], setText = textS[1];
    var queryS = React.useState("");
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
    var refreshRef = React.useRef(null);
    var pageSize = 18;

    function say(msg) { setToast(String(msg || "")); }

    React.useEffect(function () {
      if (!toast) return;
      var id = setTimeout(function () { setToast(""); }, 2600);
      return function () { clearTimeout(id); };
    }, [toast]);

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
      if (value.length > 64) { setFormError(t.tooLong); return; }
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
          say(t.created + "：" + value);
          setTimeout(function () { if (refreshRef.current) refreshRef.current(); }, 0);
        } else {
          var msg = (r && r.error) || "create failed";
          setFormError(String(msg).indexOf("已存在") >= 0 ? t.duplicate : msg);
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
          h("button", { type: "button", className: "wbg-btn", onClick: applySearch }, t.find),
          (text || query) ? h("button", { type: "button", className: "wbg-btn ghost", onClick: clearSearch }, t.clear) : null,
          h("button", {
            type: "button", className: "wbg-btn primary",
            onClick: function () { setCreating(!creating); setFormError(""); },
          }, creating ? t.cancel : t.create)
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
        confirmAll
          ? h("button", { type: "button", className: "wbg-btn danger", disabled: busy, onClick: deleteSelected }, busy ? "…" : t.confirmBatch)
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
          return h("div", {
            key: row.id, className: "wbg-row", style: { "--tag-color": color },
          },
            h("input", {
              type: "checkbox", className: "wbg-check", checked: selected.indexOf(row.id) >= 0,
              onChange: function () { toggle(row.id); }, "aria-label": row.name,
            }),
            h("div", { className: "wbg-name" }, h("span", { className: "wbg-chip" }, row.name)),
            h("div", { className: "wbg-time" }, row.createTime || ""),
            h("div", { className: "wbg-ops" },
              confirmId === row.id
                ? h("button", { type: "button", className: "wbg-btn danger", disabled: busy, onClick: function () { deleteOne(row.id); } }, busy ? "…" : t.confirmDel)
                : h("button", { type: "button", className: "wbg-btn danger", onClick: function () { setConfirmId(row.id); } }, t.del),
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
    version: "1.0.0",
    views: [{
      id: "tags",
      title: { zh: "标签", en: "Tags" },
      component: TagsView,
    }],
  });
      return { name: "dsh-workbench-tags", inject: [], apply: function () {} };
    },
  });
})();
