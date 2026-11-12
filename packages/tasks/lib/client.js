// 由 scripts/build-addon-clients.mjs 生成；请修改对应 client/client.src.cjs 后重新构建。
window.__ModuleLoader__ = window.__ModuleLoader__ || { modules: {}, load: function (m) { this.modules[m.id] = m.factory; } };
window.__ModuleLoader__.load({
  id: "dsh-workbench-tasks",
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

// packages/addons/tasks/shared/tree/limits.cjs
var require_limits = __commonJS({
  "packages/addons/tasks/shared/tree/limits.cjs"(exports2, module2) {
    "use strict";
    module2.exports = Object.freeze({ NAME_MAX: 40, PATH_MAX: 32, PATH_LEN_MAX: 2048 });
  }
});

// packages/addons/tasks/client/ui/tagfilter.cjs
var require_tagfilter = __commonJS({
  "packages/addons/tasks/client/ui/tagfilter.cjs"(exports2, module2) {
    var React = require("react");
    var h = React.createElement;
    module2.exports = function TagFilter(props) {
      var api = props.api;
      var t = props.t;
      var Icon2 = props.Icon;
      var ids = props.ids || [];
      var onChange = props.onChange;
      var availS = React.useState(true);
      var available = availS[0], setAvailable = availS[1];
      var openS = React.useState(false);
      var open = openS[0], setOpen = openS[1];
      var queryS = React.useState("");
      var query = queryS[0], setQuery = queryS[1];
      var optsS = React.useState({ tags: [], total: 0, pageNumber: 0, hasMore: false });
      var opts = optsS[0], setOpts = optsS[1];
      var loadingS = React.useState(false);
      var loading = loadingS[0], setLoading = loadingS[1];
      var namesS = React.useState({});
      var names = namesS[0], setNames = namesS[1];
      var load = React.useCallback(function(text, pageNumber, append) {
        setLoading(true);
        return api.call("tasks.tagOptions", { text: text || "", pageNumber, pageSize: 20 }).then(function(r) {
          setLoading(false);
          if (!r || !r.ok) return;
          var out = r.result || {};
          setOpts(function(prev) {
            var tags = append ? (prev.tags || []).concat(out.tags || []) : out.tags || [];
            return { tags, total: out.total || 0, pageNumber: out.pageNumber || pageNumber, hasMore: !!out.hasMore };
          });
          setNames(function(prev) {
            var next = Object.assign({}, prev);
            (out.tags || []).forEach(function(x) {
              next[String(x.id)] = x.name;
            });
            return next;
          });
        }).catch(function() {
          setLoading(false);
        });
      }, [api]);
      React.useEffect(function() {
        if (!open) return;
        var timer = setTimeout(function() {
          load(query, 1, false);
        }, query ? 200 : 0);
        return function() {
          clearTimeout(timer);
        };
      }, [open, query, load, props.reloadKey]);
      React.useEffect(function() {
        api.call("tasks.tagOptions", { pageSize: 1 }).then(function(r) {
          if (r && r.ok) setAvailable(!!(r.result && r.result.available));
        }).catch(function() {
        });
      }, [api]);
      function toggle(id) {
        var key = String(id);
        var next = ids.slice();
        var idx = next.indexOf(key);
        if (idx >= 0) next.splice(idx, 1);
        else next.push(key);
        onChange(next);
      }
      if (!available) return null;
      return h(
        "div",
        { className: "wbt-tagfilter" },
        h("button", {
          className: "wbt-btn ghost" + (ids.length ? " on" : ""),
          "aria-expanded": open ? "true" : "false",
          onClick: function() {
            setOpen(!open);
          }
        }, h(Icon2, { name: "tag", size: 13 }), t.tagFilter + (ids.length ? " \xB7 " + ids.length : ""), h(Icon2, { name: "down", size: 12 })),
        open ? h(
          "div",
          { className: "wbt-tagmenu", role: "menu" },
          h(
            "div",
            { className: "wbt-tagsearch" },
            h("input", {
              className: "wbt-input",
              autoFocus: true,
              placeholder: t.tagSearchPlaceholder,
              value: query,
              onChange: function(e) {
                setQuery(e.target.value);
              },
              onKeyDown: function(e) {
                if (e.key === "Escape") {
                  e.stopPropagation();
                  setOpen(false);
                }
              }
            })
          ),
          ids.length ? h(
            "div",
            { className: "wbt-tagsel" },
            h("div", { className: "wbt-tagmenu-head" }, h("span", null, t.tagSelected + " " + ids.length), h("span", { className: "wbt-grow" })),
            h("div", { className: "wbt-tagsel-list" }, ids.map(function(id) {
              return h(
                "button",
                { key: id, className: "wbt-tagselitem", title: t.tagRemove, onClick: function() {
                  toggle(id);
                } },
                h("span", { className: "wbt-tagnm" }, names[String(id)] || "#" + id),
                h("span", { className: "wbt-tagx" }, "\xD7")
              );
            }))
          ) : null,
          h(
            "div",
            { className: "wbt-tagmenu-head" },
            h("span", null, t.allTags + (opts.total ? " \xB7 " + opts.total : "")),
            h("span", { className: "wbt-grow" }),
            h("button", { className: "wbt-mini", onClick: function() {
              onChange([]);
              setQuery("");
            } }, t.clear)
          ),
          h(
            "div",
            {
              className: "wbt-taglist",
              onScroll: function(e) {
                var el = e.currentTarget;
                if (!opts.hasMore || loading) return;
                if (el.scrollTop + el.clientHeight >= el.scrollHeight - 24) load(query, (opts.pageNumber || 1) + 1, true);
              }
            },
            opts.tags.length ? opts.tags.map(function(x) {
              var on = ids.indexOf(String(x.id)) >= 0;
              return h(
                "label",
                { key: x.id, className: "wbt-tagopt" },
                h("input", { type: "checkbox", checked: on, onChange: function() {
                  toggle(x.id);
                } }),
                h("span", { className: "wbt-tagnm" }, x.name),
                h("span", { className: "wbt-tagcnt" }, x.total)
              );
            }) : h("div", { className: "wbt-note" }, loading ? t.loadingMore : query ? t.tagNoMatch : t.noTags),
            opts.tags.length ? h("div", { className: "wbt-tagmore" }, loading ? t.loadingMore : opts.hasMore ? "" : t.noMore) : null
          )
        ) : null
      );
    };
  }
});

// packages/addons/tasks/client/ui/workspacefilter.cjs
var require_workspacefilter = __commonJS({
  "packages/addons/tasks/client/ui/workspacefilter.cjs"(exports2, module2) {
    var React = require("react");
    var h = React.createElement;
    var PAGE_SIZE = 20;
    module2.exports = function WorkspaceFilter(props) {
      var api = props.api, t = props.t, Icon2 = props.Icon;
      var ids = props.ids || [], noWorkspace = props.noWorkspace === true;
      var openState = React.useState(false), open = openState[0], setOpen = openState[1];
      var queryState = React.useState(""), query = queryState[0], setQuery = queryState[1];
      var viewState = React.useState({ records: [], total: 0, page: 0, hasMore: false }), view = viewState[0], setView = viewState[1];
      var loadingState = React.useState(false), loading = loadingState[0], setLoading = loadingState[1];
      var errorState = React.useState(""), error = errorState[0], setError = errorState[1];
      var namesState = React.useState({}), names = namesState[0], setNames = namesState[1];
      var load = React.useCallback(function(keyword, pageNumber, append) {
        setLoading(true);
        setError("");
        return api.call("taskWorkspaces.list", { keyword: keyword || "", pageNumber, pageSize: PAGE_SIZE }).then(function(res) {
          setLoading(false);
          if (!res || res.ok === false) {
            setError(res && res.error || "list failed");
            return;
          }
          var out = res.result || {}, records2 = out.records || [], page = out.pageNumber || pageNumber, total = out.total || 0;
          setView(function(prev) {
            return { records: append ? prev.records.concat(records2) : records2, total, page, hasMore: page * PAGE_SIZE < total };
          });
          if (!records2.length) return;
          setNames(function(prev) {
            var next = Object.assign({}, prev);
            records2.forEach(function(ws) {
              next[String(ws.id)] = String(ws.title || ws.name || ws.id);
            });
            return next;
          });
        }).catch(function(e) {
          setLoading(false);
          setError(String(e && e.message || e));
        });
      }, [api]);
      React.useEffect(function() {
        if (!open) return void 0;
        var timer = setTimeout(function() {
          load(query, 1, false);
        }, query ? 200 : 0);
        return function() {
          clearTimeout(timer);
        };
      }, [open, query, load, props.reloadKey]);
      function onScroll(e) {
        var el = e && e.target;
        if (!el || !view.hasMore || loading) return;
        if (el.scrollTop + el.clientHeight >= el.scrollHeight - 24) load(query, view.page + 1, true);
      }
      function name(id) {
        return names[String(id)] || String(id);
      }
      var caption = t.workspaceFilter + (ids.length ? " \xB7 " + ids.length : "") + (noWorkspace && !ids.length ? " \xB7 " + t.noWorkspace : "");
      var head = h(
        "button",
        {
          type: "button",
          className: "wbt-btn ghost" + (ids.length || noWorkspace ? " on" : ""),
          "aria-expanded": open,
          title: caption,
          onClick: function() {
            setOpen(!open);
          }
        },
        Icon2 ? h(Icon2, { name: "folder", size: 13 }) : null,
        caption,
        Icon2 ? h(Icon2, { name: "down", size: 12 }) : null
      );
      if (!open) return h("div", { className: "wbt-tagfilter wbt-wsfilter" }, head);
      var records = view.records || [];
      var menu = h(
        "div",
        { className: "wbt-tagmenu wbt-wsmenu", role: "menu" },
        h("div", { className: "wbt-tagsearch" }, h("input", {
          className: "wbt-input",
          autoFocus: true,
          value: query,
          placeholder: t.workspaceSearchPlaceholder,
          "aria-label": t.workspaceSearchPlaceholder,
          onChange: function(e) {
            setQuery(e.target.value);
          },
          onKeyDown: function(e) {
            if (e.key === "Escape") setOpen(false);
          }
        })),
        ids.length ? h(
          "div",
          { className: "wbt-tagsel" },
          h("div", { className: "wbt-tagmenu-head" }, t.workspaceSelected + " " + ids.length),
          h("div", { className: "wbt-tagsel-list" }, ids.map(function(id) {
            return h(
              "button",
              { key: String(id), type: "button", className: "wbt-tagselitem", title: t.workspaceRemove, onClick: function() {
                props.onToggle(String(id));
              } },
              h("span", { className: "wbt-tagnm" }, name(id)),
              h("span", { className: "wbt-tagx" }, "\xD7")
            );
          }))
        ) : null,
        h(
          "div",
          { className: "wbt-tagmenu-head" },
          t.allWorkspaces + " " + view.total,
          h("span", { className: "wbt-grow" }),
          h("button", { type: "button", className: "wbt-mini", onClick: function() {
            setQuery("");
            props.onClear();
          } }, t.clear)
        ),
        records.length ? h("div", { className: "wbt-taglist", onScroll }, records.map(function(ws) {
          var id = String(ws.id), checked = ids.indexOf(id) >= 0;
          return h(
            "label",
            { key: id, className: "wbt-tagopt" },
            h("input", { type: "checkbox", checked, onChange: function() {
              props.onToggle(id);
            } }),
            h("span", { className: "wbt-tagnm" }, String(ws.title || ws.name || id)),
            h("span", { className: "wbt-tagcnt" }, String(ws.taskCount || 0))
          );
        })) : h("div", { className: "wbt-note" }, loading ? t.loadingMore : error ? error : query ? t.workspaceNoMatch : t.noWorkspaces),
        error && records.length ? h("div", { className: "wbt-note" }, error) : null,
        h(
          "label",
          { className: "wbt-tagopt wbt-wsnone" },
          h("input", { type: "checkbox", checked: noWorkspace, onChange: function() {
            props.onToggleNoWorkspace();
          } }),
          h("span", { className: "wbt-tagnm" }, t.noWorkspace)
        ),
        h("div", { className: "wbt-tagmore" }, loading ? t.loadingMore : view.hasMore ? "" : t.noMore)
      );
      return h("div", { className: "wbt-tagfilter wbt-wsfilter" }, head, menu);
    };
  }
});

// packages/addons/tasks/client/stats/charts.cjs
var require_charts = __commonJS({
  "packages/addons/tasks/client/stats/charts.cjs"(exports2, module2) {
    var React = require("react");
    var h = React.createElement;
    var COLORS = [
      "var(--dsw-alias-state-business-primary, #4f6ef7)",
      "var(--dsw-alias-state-success-primary, #2f9e6e)",
      "var(--dsw-alias-state-warn-primary, #d99100)",
      "var(--dsw-alias-state-error-primary, #d9534f)",
      "var(--dsw-alias-state-done-primary, #7c5cff)",
      "var(--dsw-alias-state-idle-primary, #8f959e)"
    ];
    var STATUS_COLORS = { "0": COLORS[0], "1": COLORS[3], "2": COLORS[1], "4": COLORS[2] };
    function css(prefix) {
      return [
        ".@-table-link{border:0;padding:0;background:none;font:inherit;color:var(--dsw-alias-brand-primary,#4f6ef7);text-align:left;cursor:pointer}.@-table-link:hover{text-decoration:underline}.@-table-link:focus-visible{outline:2px solid currentColor;outline-offset:3px}.@-recent-difficulty{white-space:nowrap}.@-recent-reason{opacity:.65}",
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
        ".@-ghost{appearance:none;border:1px solid var(--dsw-alias-border-l2,#e5e6eb);background:var(--dsw-alias-bg-layer-1,#fff);color:var(--dsw-alias-label-secondary,#646a73);border-radius:8px;font-size:12px;padding:6px 10px;cursor:pointer}",
        ".@-ghost:hover{border-color:var(--dsw-alias-brand-primary,#4f6ef7);color:var(--dsw-alias-brand-primary,#4f6ef7)}",
        ".@-muted{color:var(--dsw-alias-label-tertiary,#8f959e);font-size:12px}",
        ".@-sgrid{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:12px}",
        ".@-scard{grid-column:span 6;min-width:0;background:var(--dsw-alias-bg-layer-1,#fff);border:1px solid var(--dsw-alias-border-l2,#e5e6eb);border-radius:12px;padding:14px 16px}",
        ".@-span-3{grid-column:span 3}.@-span-4{grid-column:span 4}.@-span-6{grid-column:span 6}.@-span-8{grid-column:span 8}.@-span-12{grid-column:span 12}",
        ".@-chead{display:flex;align-items:baseline;gap:8px;margin-bottom:10px;flex-wrap:wrap}",
        ".@-ctitle{font-size:13px;font-weight:600;color:var(--dsw-alias-label-primary,#1f2329)}",
        ".@-cnote{font-size:11px;color:var(--dsw-alias-label-tertiary,#8f959e)}",
        ".@-kpis{grid-column:span 12;display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:12px}",
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
        ".@-hbar-link{cursor:pointer;border-radius:6px;padding-top:2px}",
        ".@-hbar-link:hover{background:var(--dsw-alias-bg-skeleton,#f2f3f5)}",
        ".@-hbar-link:hover .@-hbar-l,.@-hbar-link:focus-visible .@-hbar-l{color:var(--dsw-alias-brand-primary,#4f6ef7)}",
        ".@-hbar-link:focus-visible{outline:2px solid var(--dsw-alias-brand-primary,#4f6ef7);outline-offset:2px}",
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
        return h(
          "section",
          { className: cls },
          props.title || props.right ? h(
            "div",
            { className: prefix + "-chead" },
            h("span", { className: prefix + "-ctitle" }, props.title),
            props.note ? h("span", { className: prefix + "-cnote" }, props.note) : null,
            props.right ? h("span", { style: { marginLeft: "auto" } }, props.right) : null
          ) : null,
          props.children
        );
      }
      function Kpi(props) {
        var tone = props.tone ? " " + prefix + "-" + props.tone : "";
        return h(
          "div",
          { className: prefix + "-kpi" + tone },
          h("div", { className: prefix + "-kpi-l" }, props.label),
          h(
            "div",
            { className: prefix + "-kpi-v" },
            props.value === null || props.value === void 0 ? "\u2014" : typeof props.value === "number" ? num(props.lang, props.value) : props.value,
            props.unit ? h("span", { className: prefix + "-kpi-u" }, props.unit) : null
          ),
          props.hint ? h("div", { className: prefix + "-kpi-h" }, props.hint) : null
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
        return h(
          "div",
          { className: prefix + "-donut" },
          h(
            "svg",
            { width: size, height: size, viewBox: "0 0 " + size + " " + size, role: "img", "aria-label": aria },
            h("circle", { cx: size / 2, cy: size / 2, r, fill: "none", stroke: "var(--dsw-alias-bg-skeleton,#f2f3f5)", strokeWidth: 18 }),
            total > 0 ? data.map(function(d, i) {
              var len = Number(d.count) / total * c;
              var seg = h("circle", {
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
              }, h("title", null, d.label + "\uFF1A" + d.count));
              offset += len;
              return seg;
            }) : null,
            h("text", { x: size / 2, y: size / 2 - 2, textAnchor: "middle", fill: "var(--dsw-alias-label-primary,#1f2329)", fontSize: 24, fontWeight: 650 }, num(props.lang, total)),
            h("text", { x: size / 2, y: size / 2 + 18, textAnchor: "middle", fill: "var(--dsw-alias-label-tertiary,#8f959e)", fontSize: 11 }, props.centerLabel || "")
          ),
          h("div", { className: prefix + "-legend" }, (props.data || []).map(function(d, i) {
            return h(
              "div",
              { key: d.key || d.label || i, className: prefix + "-leg" },
              h("span", { className: prefix + "-dot", style: { background: d.color || COLORS[i % COLORS.length] } }),
              h("span", null, d.label),
              h("b", null, num(props.lang, d.count))
            );
          }))
        );
      }
      function BarList(props) {
        var data = props.data || [];
        var max = Number(props.max || 0) || data.reduce(function(m, d) {
          return Math.max(m, Number(d.value || 0));
        }, 0) || 1;
        return h("div", { className: prefix + "-bars" }, data.map(function(d, i) {
          var v = Number(d.value || 0);
          return h(
            "div",
            { key: d.key || d.label || i, className: prefix + "-bar" },
            h("span", { className: prefix + "-bar-l", title: d.title || d.label }, d.label),
            h("span", { className: prefix + "-bar-t" }, h("span", { className: prefix + "-bar-f", style: { width: Math.max(2, v / max * 100) + "%", background: d.color || props.color || COLORS[0] } })),
            h("span", { className: prefix + "-bar-v" }, props.format ? props.format(v) : num(props.lang, v))
          );
        }));
      }
      function StackedRows(props) {
        var rows = props.rows || [];
        var keys = props.keys || [];
        return h("div", { className: prefix + "-stack" }, rows.map(function(row, ri) {
          var total = Number(row.total || 0) || 1;
          return h(
            "div",
            { key: row.key || ri },
            h("div", { className: prefix + "-srow-l" }, h("span", null, row.label), h("b", null, num(props.lang, row.total))),
            h("div", { className: prefix + "-strack" }, keys.map(function(k, i) {
              var v = Number(row.parts && row.parts[k.key] || 0);
              if (v <= 0) return null;
              return h("span", {
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
        return h(
          "div",
          null,
          h(
            "svg",
            { className: prefix + "-trend", viewBox: "0 0 " + width + " " + height, role: "img", "aria-label": props.aria || aria },
            ticks.map(function(v, i2) {
              return h(
                "g",
                { key: "t" + i2 },
                h("line", { x1: left, x2: width - right, y1: y(v), y2: y(v), stroke: "var(--dsw-alias-border-l1,#f2f3f5)", strokeWidth: 1 }),
                h("text", { x: left - 5, y: y(v) + 3, textAnchor: "end", fontSize: 9, fill: "var(--dsw-alias-label-tertiary,#8f959e)" }, num(props.lang, v))
              );
            }),
            series.map(function(s, si) {
              var pts = data.map(function(d, i2) {
                return x(i2) + "," + y(d[s.key]);
              }).join(" ");
              return h(
                "g",
                { key: s.key },
                h("polyline", { points: pts, fill: "none", stroke: s.color || COLORS[si % COLORS.length], strokeWidth: 2, strokeLinejoin: "round", strokeLinecap: "round" }),
                data.map(function(d, i2) {
                  if (data.length > 40 && i2 % 3 !== 0) return null;
                  return h(
                    "circle",
                    { key: i2, cx: x(i2), cy: y(d[s.key]), r: 2.4, fill: s.color || COLORS[si % COLORS.length] },
                    h("title", null, d.bucket + "\uFF1A" + s.label + " " + (d[s.key] || 0))
                  );
                })
              );
            }),
            labelIdx.map(function(i2) {
              return h("text", { key: "x" + i2, x: x(i2), y: height - 6, textAnchor: "middle", fontSize: 9, fill: "var(--dsw-alias-label-tertiary,#8f959e)" }, String(data[i2].bucket).slice(5));
            })
          ),
          h("div", { className: prefix + "-tlegend" }, series.map(function(s, i2) {
            return h(
              "span",
              { key: s.key, style: { display: "inline-flex", alignItems: "center", gap: 5 } },
              h("span", { className: prefix + "-dot", style: { background: s.color || COLORS[i2 % COLORS.length] } }),
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
        var interactive = typeof props.onSelect === "function";
        var hint = props.selectHint || "";
        return h(
          "div",
          { className: prefix + "-hist", role: interactive ? "group" : "img", "aria-label": props.aria || data.map(function(d) {
            return d.label + " " + d.count;
          }).join("\uFF0C") },
          data.map(function(d, i) {
            var count = Number(d.count || 0), canPick = interactive && count > 0;
            return h(
              "div",
              {
                key: d.key || d.label || i,
                className: prefix + "-hbar" + (canPick ? " " + prefix + "-hbar-link" : ""),
                title: canPick && hint ? d.label + "\uFF1A" + count + " \xB7 " + hint : d.label + "\uFF1A" + count,
                role: canPick ? "button" : void 0,
                tabIndex: canPick ? 0 : void 0,
                "aria-label": canPick ? d.label + "\uFF1A" + count + (hint ? "\uFF0C" + hint : "") : void 0,
                onClick: canPick ? function() {
                  props.onSelect(d);
                } : void 0,
                onKeyDown: canPick ? function(e) {
                  if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
                    e.preventDefault();
                    props.onSelect(d);
                  }
                } : void 0
              },
              h("span", { className: prefix + "-hbar-v" }, num(props.lang, d.count)),
              h("span", { className: prefix + "-hbar-f", style: { height: Math.max(2, count / max * 100) + "%", background: d.color || props.color || COLORS[0] } }),
              h("span", { className: prefix + "-hbar-l" }, d.label)
            );
          })
        );
      }
      function DataTable(props) {
        var cols = props.columns || [];
        var rows = props.rows || [];
        if (props.missing) return h(Missing, { text: props.missingText });
        if (!rows.length) return h("div", { className: prefix + "-empty" }, props.empty || "\u6682\u65E0\u6570\u636E");
        return h("div", { className: prefix + "-table-scroll", tabIndex: 0, role: "region", "aria-label": props.lang === "en" ? "Data table" : "\u6570\u636E\u8868\u683C" }, h(
          "table",
          { className: prefix + "-table" },
          h("thead", null, h("tr", null, cols.map(function(c) {
            return h("th", { key: c.key, className: c.num ? prefix + "-num" : "" }, c.label);
          }))),
          h("tbody", null, rows.map(function(row, ri) {
            return h("tr", { key: row.id || row.key || ri }, cols.map(function(c) {
              return h("td", { key: c.key, className: c.num ? prefix + "-num" : "" }, c.render ? c.render(row) : row[c.key]);
            }));
          }))
        ));
      }
      function DateRangePicker(props) {
        var custom = props.custom || null;
        var from = custom && custom.from ? custom.from : "";
        var to = custom && custom.to ? custom.to : "";
        function setDate(key, value, input) {
          if (input && input.validity && input.validity.badInput) {
            if (props.onInvalidInput) props.onInvalidInput();
            return;
          }
          if (typeof props.onCustomChange !== "function") return;
          var next = { from, to };
          next[key] = value;
          props.onCustomChange(next);
        }
        return h(
          "div",
          { className: prefix + "-stoolbar" },
          (props.options || []).length ? h("div", { className: prefix + "-seg", role: "group", "aria-label": props.aria || "\u65F6\u95F4\u8303\u56F4" }, (props.options || []).map(function(o) {
            return h("button", {
              key: o.key,
              type: "button",
              className: o.key === props.value ? prefix + "-on" : "",
              "aria-pressed": !!props.value && o.key === props.value,
              onClick: function() {
                props.onChange(o.key);
              }
            }, o.label);
          })) : null,
          h(
            "div",
            { className: prefix + "-range", role: "group", "aria-label": props.customAria || "\u81EA\u5B9A\u4E49\u65E5\u671F\u8303\u56F4" },
            h("input", {
              type: "date",
              className: prefix + "-date",
              value: from,
              max: to && (!props.today || to < props.today) ? to : props.today || void 0,
              "aria-label": props.fromLabel || "\u8D77\u59CB\u65E5\u671F",
              title: props.fromLabel || "\u8D77\u59CB\u65E5\u671F",
              onChange: function(e) {
                setDate("from", e.target.value, e.target);
              }
            }),
            h("span", { className: prefix + "-dash", "aria-hidden": "true" }, "\u2013"),
            h("input", {
              type: "date",
              className: prefix + "-date",
              value: to,
              min: from || void 0,
              max: props.today || void 0,
              "aria-label": props.toLabel || "\u7EC8\u6B62\u65E5\u671F",
              title: props.toLabel || "\u7EC8\u6B62\u65E5\u671F",
              onChange: function(e) {
                setDate("to", e.target.value, e.target);
              }
            }),
            from || to ? h("button", {
              type: "button",
              className: prefix + "-clear",
              "aria-label": props.clearLabel || "\u6E05\u9664\u81EA\u5B9A\u4E49\u8303\u56F4",
              title: props.clearLabel || "\u6E05\u9664\u81EA\u5B9A\u4E49\u8303\u56F4",
              onClick: function() {
                if (props.onCustomClear) props.onCustomClear();
              }
            }, "\xD7") : null
          ),
          props.customHint ? h("span", { className: prefix + "-hint", role: "status" }, props.customHint) : null
        );
      }
      function RangeSwitch(props) {
        return h(
          "div",
          { className: prefix + "-stoolbar" },
          h(DateRangePicker, props),
          h("button", { type: "button", className: prefix + "-ghost", disabled: !!props.loading, onClick: props.onRefresh }, props.refreshLabel || "\u5237\u65B0"),
          h("span", { className: prefix + "-muted" }, props.generatedAt ? (props.timeLabel || "\u622A\u81F3") + " " + timeText(props.generatedAt) : ""),
          props.right ? h("span", { style: { marginLeft: "auto" } }, props.right) : null
        );
      }
      function Missing(props) {
        return h("div", { className: prefix + "-empty " + prefix + "-missing", role: "status" }, props.text || "\u6682\u65E0\u6570\u636E");
      }
      function Empty(props) {
        return h("div", { className: prefix + "-empty" }, props.text || "\u6682\u65E0\u6570\u636E");
      }
      function Skeleton() {
        return h(
          "div",
          { className: prefix + "-sgrid" },
          h("div", { className: prefix + "-kpis" }, [0, 1, 2, 3].map(function(i) {
            return h(
              "div",
              { key: i, className: prefix + "-kpi" },
              h("div", { className: prefix + "-sk", style: { width: "40%" } }),
              h("div", { className: prefix + "-sk", style: { width: "65%", height: 26 } })
            );
          })),
          [0, 1].map(function(i) {
            return h(
              "div",
              { key: "c" + i, className: prefix + "-scard " + prefix + "-span-6" },
              h("div", { className: prefix + "-sk", style: { width: "30%" } }),
              h("div", { className: prefix + "-sk", style: { height: 120 } })
            );
          })
        );
      }
      function ErrorBar(props) {
        return h(
          "div",
          { className: prefix + "-err", role: "alert" },
          h("span", null, props.message),
          props.onRetry ? h("button", { type: "button", className: prefix + "-ghost", onClick: props.onRetry }, props.retryLabel || "\u91CD\u8BD5") : null
        );
      }
      function Warnings(props) {
        var items = props.items || [];
        if (!items.length) return null;
        return h("div", { className: prefix + "-warn", role: "status" }, items.map(function(w) {
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
        DateRangePicker,
        Empty,
        Missing,
        Skeleton,
        ErrorBar,
        Warnings,
        num,
        pct,
        timeText,
        dateText,
        colors: COLORS,
        statusColors: STATUS_COLORS
      };
    }
    module2.exports = { makeCharts };
  }
});

// packages/addons/tasks/client/views/config.cjs
var require_config = __commonJS({
  "packages/addons/tasks/client/views/config.cjs"(exports2, module2) {
    var React = require("react");
    var h = React.createElement;
    var DOMAIN = "tasks";
    var PREFIX = "wbt";
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
      React.useEffect(function() {
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
      var requestLock = React.useRef(false), mounted = React.useRef(true);
      React.useEffect(function() {
        mounted.current = true;
        return function() {
          mounted.current = false;
        };
      }, []);
      var locked = loading || busy || !!savingId;
      function acquire() {
        if (requestLock.current) return false;
        requestLock.current = true;
        return true;
      }
      function release() {
        requestLock.current = false;
      }
      React.useEffect(function() {
        injectCss();
      }, []);
      var load = React.useCallback(function() {
        if (!acquire()) return;
        setLoading(true);
        return Promise.resolve().then(function() {
          return api.call(DOMAIN + ".configGet");
        }).then(function(r) {
          var body2 = unwrap(r);
          if (r && r.ok === false) throw new Error(r && r.error || "load failed");
          setState(body2 || null);
          setErr("");
          setLoading(false);
        }).catch(function(e) {
          setErr(String(e && e.message || e));
          setLoading(false);
        }).finally(release);
      }, [api]);
      React.useEffect(function() {
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
        if (!acquire()) return;
        var prevState = state;
        setSavingId(id);
        setNotice({ id, text: t.saving, error: false });
        setValueLocal(id, value);
        return Promise.resolve().then(function() {
          return api.call(DOMAIN + ".configSet", { values: (function() {
            var o = {};
            o[id] = value;
            return o;
          })() });
        }).then(function(r) {
          var body2 = unwrap(r);
          if (r && r.ok === false) throw new Error(r && r.error || "save failed");
          setSavingId("");
          if (mounted.current && body2 && body2.state) setState(body2.state);
          setNotice({ id, text: t.saved, error: false });
        }).catch(function(e) {
          setSavingId("");
          if (prevState) setState(prevState);
          setNotice({ id, text: t.saveFail + String(e && e.message || e), error: true });
        }).finally(release);
      }
      function resetItem(id) {
        if (!acquire()) return;
        var prevState = state;
        setBusy(true);
        setNotice({ id, text: t.resetting, error: false });
        return Promise.resolve().then(function() {
          return api.call(DOMAIN + ".configReset", { ids: [id] });
        }).then(function(r) {
          var body2 = unwrap(r);
          if (r && r.ok === false) throw new Error(r && r.error || "reset failed");
          setBusy(false);
          if (mounted.current && body2 && body2.state) setState(body2.state);
          setNotice({ id, text: t.defaultValue, error: false });
        }).catch(function(e) {
          setBusy(false);
          if (prevState) setState(prevState);
          setNotice({ id, text: String(e && e.message || e), error: true });
        }).finally(release);
      }
      function resetAll() {
        if (requestLock.current) return;
        if (typeof window !== "undefined" && window.confirm && !window.confirm(t.confirmResetAll)) return;
        if (!acquire()) return;
        var prevState = state;
        setBusy(true);
        setNotice({ id: "", text: t.resetting, error: false });
        return Promise.resolve().then(function() {
          return api.call(DOMAIN + ".configReset", {});
        }).then(function(r) {
          var body2 = unwrap(r);
          if (r && r.ok === false) throw new Error(r && r.error || "reset failed");
          setBusy(false);
          if (mounted.current && body2 && body2.state) setState(body2.state);
          setNotice({ id: "", text: t.allDefault, error: false });
        }).catch(function(e) {
          setBusy(false);
          if (prevState) setState(prevState);
          setNotice({ id: "", text: String(e && e.message || e), error: true });
        }).finally(release);
      }
      function commitDraft(item) {
        if (requestLock.current) return;
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
          return h(
            "label",
            { className: PREFIX + "-cfg-switch" },
            h("input", {
              type: "checkbox",
              disabled: locked,
              checked: value === true,
              onChange: function(e) {
                save(item.id, e.target.checked);
              }
            }),
            h("span", { className: PREFIX + "-cfg-track", "aria-hidden": "true" }),
            h("span", { className: PREFIX + "-cfg-switchstate" }, value === true ? t.on : t.off)
          );
        }
        if (item.type === "enum") {
          return h("select", {
            className: PREFIX + "-cfg-select",
            disabled: locked,
            value: String(value),
            onChange: function(e) {
              var hit = (item.options || []).filter(function(o) {
                return String(o.value) === e.target.value;
              })[0];
              if (hit) save(item.id, hit.value);
            }
          }, (item.options || []).map(function(o) {
            return h("option", { key: String(o.value), value: String(o.value) }, optionLabel(o, lang));
          }));
        }
        if (item.type === "int") {
          var draft = drafts[item.id] !== void 0 ? drafts[item.id] : String(value);
          return h("input", {
            className: PREFIX + "-cfg-input",
            disabled: locked,
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
          return h("div", { className: PREFIX + "-cfg-multi" }, (item.options || []).map(function(o) {
            var on = picked.indexOf(o.value) >= 0;
            return h(
              "label",
              { key: String(o.value) },
              h("input", {
                type: "checkbox",
                disabled: locked,
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
              h("span", null, optionLabel(o, lang))
            );
          }));
        }
        return h("input", {
          className: PREFIX + "-cfg-input",
          disabled: locked,
          type: "text",
          defaultValue: value === void 0 ? "" : String(value),
          onBlur: function(e) {
            if (!sameValue(e.target.value, value)) save(item.id, e.target.value);
          }
        });
      }
      var body = [];
      if (loading && !state) body.push(h(
        "div",
        { key: "loading", className: PREFIX + "-cfg-loading", "aria-busy": "true" },
        h("span", { className: PREFIX + "-cfg-sr" }, t.loading),
        h("div", { className: PREFIX + "-cfg-sk" }),
        h("div", { className: PREFIX + "-cfg-sk" }),
        h("div", { className: PREFIX + "-cfg-sk" })
      ));
      if (!loading && err && !state) {
        body.push(h(
          "div",
          { key: "err", className: PREFIX + "-cfg-error" },
          h("span", null, t.loadFail + " " + err),
          h("button", { type: "button", className: PREFIX + "-cfg-btn", onClick: load }, t.retry)
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
          body.push(h(
            "section",
            { key: "g-" + g.id, className: PREFIX + "-cfg-group" },
            h(
              "div",
              { className: PREFIX + "-cfg-gtitle" },
              h("span", null, lang === "en" ? g.en : g.zh),
              h("span", { className: PREFIX + "-cfg-gcount" }, list.length + (lang === "en" ? " items" : " \u9879"))
            ),
            list.map(function(item) {
              var overridden = state.overrides && state.overrides[item.id] !== void 0;
              var isSaving = savingId === item.id;
              return h(
                "div",
                { key: item.id, className: PREFIX + "-cfg-row" },
                h(
                  "div",
                  { className: PREFIX + "-cfg-label" },
                  h(
                    "div",
                    { className: PREFIX + "-cfg-name" },
                    h("span", null, lang === "en" ? item.en : item.zh),
                    overridden ? h("span", { className: PREFIX + "-cfg-chip" }, t.modified) : null,
                    isSaving ? h("span", { className: PREFIX + "-cfg-chip" }, t.saving) : null
                  ),
                  (lang === "en" ? item.hintEn : item.hintZh) ? h("div", { className: PREFIX + "-cfg-hint" }, lang === "en" ? item.hintEn : item.hintZh) : null,
                  h("div", { className: PREFIX + "-cfg-id" }, item.id)
                ),
                h(
                  "div",
                  { className: PREFIX + "-cfg-control" },
                  renderControl(item),
                  overridden ? h("button", {
                    type: "button",
                    className: PREFIX + "-cfg-btn",
                    disabled: locked,
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
        if (!items.length && !loading) body.push(h("div", { key: "empty", className: PREFIX + "-cfg-empty" }, t.empty));
        var anyOverride = Object.keys(state.overrides || {}).length > 0;
        body.push(h(
          "div",
          { key: "foot", className: PREFIX + "-cfg-foot" },
          h(
            "span",
            { className: PREFIX + "-cfg-changed" },
            anyOverride ? Object.keys(state.overrides || {}).length + (lang === "en" ? " changed" : " \u9879\u5DF2\u4FEE\u6539") : lang === "en" ? "All preferences are at their defaults" : "\u5168\u90E8\u914D\u7F6E\u5747\u4E3A\u9ED8\u8BA4\u503C"
          ),
          h("span", { className: PREFIX + "-cfg-grow" }),
          anyOverride ? h("button", { type: "button", className: PREFIX + "-cfg-btn " + PREFIX + "-cfg-btn-outline", disabled: locked, onClick: resetAll }, busy ? t.resetting : t.resetAll) : null
        ));
        var warn = (state.warnings || []).filter(function(w) {
          return w && w.message;
        });
        if (warn.length) {
          body.push(h(
            "div",
            { key: "warn", className: PREFIX + "-cfg-error" },
            h("span", null, warn.map(function(w) {
              return w.message;
            }).join("\uFF1B"))
          ));
        }
      }
      return h(
        "div",
        { className: PREFIX + "-cfg" },
        h(
          "div",
          { className: PREFIX + "-cfg-head" },
          h(
            "div",
            { className: PREFIX + "-cfg-headmain" },
            h("h2", null, t.title),
            h("div", { className: PREFIX + "-cfg-note" }, t.note)
          ),
          notice.text ? h("div", { key: "notice", className: PREFIX + "-cfg-status" + (notice.error ? " err" : ""), role: "status" }, notice.text) : null
        ),
        body
      );
    }
    module2.exports = { ConfigView, useConfig, DOMAIN };
  }
});

// packages/addons/tasks/client/item/recent-columns.cjs
var require_recent_columns = __commonJS({
  "packages/addons/tasks/client/item/recent-columns.cjs"(exports2, module2) {
    var React = require("react");
    var h = React.createElement;
    module2.exports = function recentColumns(t, lang, onNavigate) {
      var en = lang === "en";
      return [
        { key: "title", label: t.colTitle },
        { key: "difficulty", label: en ? "Difficulty" : "\u96BE\u5EA6", render: function(row) {
          var n = Number(row.difficulty);
          if (!(n > 0)) return "\u2014";
          var bounded = Math.min(5, n), full = Math.floor(bounded), half = bounded - full >= 0.5;
          return h(
            "span",
            { className: "wbt-recent-difficulty", "aria-label": (en ? "Difficulty: " : "\u96BE\u5EA6\uFF1A") + n },
            h("span", { "aria-hidden": true }, "\u2605".repeat(full) + (half ? "\u2BEA" : "") + "\u2606".repeat(5 - full - (half ? 1 : 0))),
            " " + n
          );
        } },
        { key: "tableTitle", label: t.colTable, render: function(row) {
          if (row.tableDeleted || !row.tableId) return h("span", { title: en ? "Task table deleted; cannot open" : "\u4EFB\u52A1\u8868\u5DF2\u5220\u9664\uFF0C\u65E0\u6CD5\u6253\u5F00" }, row.tableTitle || (en ? "Deleted task table" : "\u5DF2\u5220\u9664\u4EFB\u52A1\u8868"));
          if (typeof onNavigate !== "function") return row.tableTitle;
          return h("button", {
            type: "button",
            className: "wbt-table-link",
            "aria-label": (en ? "Open task table: " : "\u6253\u5F00\u4EFB\u52A1\u8868\uFF1A") + row.tableTitle,
            onClick: function() {
              onNavigate("tasks", { tableId: String(row.tableId), groupId: row.groupId == null ? null : String(row.groupId), allTableTasks: true });
            }
          }, row.tableTitle);
        } },
        { key: "date", label: t.colDate, render: function(row) {
          return row.date || "\u2014";
        } }
      ];
    };
  }
});

// packages/addons/tasks/client/item/ranking-name.cjs
var require_ranking_name = __commonJS({
  "packages/addons/tasks/client/item/ranking-name.cjs"(exports2, module2) {
    var React = require("react");
    var h = React.createElement;
    module2.exports = function rankingName(t, lang, onNavigate, kind) {
      var en = lang === "en", table = kind === "table", workspace = kind === "workspace";
      return { key: "title", label: t.colName, render: function(row) {
        var none = workspace && row.id === "__none__";
        if (!row.id || row.id === "__missing__" || row.id === "__ungrouped__") {
          return h("span", { title: en ? "Deleted task table / unfiled; cannot open" : "\u5DF2\u5220\u9664\u4EFB\u52A1\u8868/\u672A\u5F52\u6863\uFF0C\u65E0\u6CD5\u6253\u5F00" }, row.title);
        }
        if (typeof onNavigate !== "function") return row.title;
        var base = none ? en ? "Open tasks without workspace: " : "\u6253\u5F00\u672A\u5173\u8054\u5DE5\u4F5C\u533A\u7684\u4EFB\u52A1\uFF1A" : en ? table ? "Open task table: " : workspace ? "Open tasks in workspace: " : "Open task group: " : table ? "\u6253\u5F00\u4EFB\u52A1\u8868\uFF1A" : workspace ? "\u6253\u5F00\u5DE5\u4F5C\u533A\u4EFB\u52A1\uFF1A" : "\u6253\u5F00\u4EFB\u52A1\u7EC4\uFF1A";
        return h("button", {
          type: "button",
          className: "wbt-table-link" + (none ? " wbt-muted-link" : ""),
          title: workspace ? row.dir || "" : void 0,
          "aria-label": base + row.title,
          onClick: function() {
            if (none) {
              onNavigate("tasks", { noWorkspace: true, workspaceIds: [], tableId: null, groupId: null });
              return;
            }
            onNavigate("tasks", workspace ? { workspaceIds: [String(row.id)], noWorkspace: false, tableId: null, groupId: null } : table ? { tableId: String(row.id), groupId: row.groupId == null ? null : String(row.groupId), allTableTasks: true } : { groupId: String(row.id), tableId: null });
          }
        }, row.title);
      } };
    };
  }
});

// packages/addons/tasks/client/stats/heatmap-model.cjs
var require_heatmap_model = __commonJS({
  "packages/addons/tasks/client/stats/heatmap-model.cjs"(exports2, module2) {
    var TYPES = ["done", "publish", "shutdown", "claimed"];
    var LEVELS = [{ min: 1, max: 1, label: "1" }, { min: 2, max: 3, label: "2\u20133" }, { min: 4, max: 6, label: "4\u20136" }, { min: 7, max: null, label: "7+" }];
    var COPY = {
      zh: { title: "\u5E74\u5EA6\u6D3B\u52A8", previous: "\u4E0A\u4E00\u5E74", next: "\u4E0B\u4E00\u5E74", done: "\u5B8C\u6210", publish: "\u53D1\u5E03", shutdown: "\u5173\u95ED", claimed: "\u63A5\u53D6", empty: { done: "\u672C\u5E74\u5EA6\u6CA1\u6709\u5B8C\u6210\u8BB0\u5F55", publish: "\u672C\u5E74\u5EA6\u6CA1\u6709\u53D1\u5E03\u8BB0\u5F55", shutdown: "\u672C\u5E74\u5EA6\u6CA1\u6709\u5173\u95ED\u8BB0\u5F55", claimed: "\u672C\u5E74\u5EA6\u6CA1\u6709\u63A5\u53D6\u8BB0\u5F55" }, loading: "\u6B63\u5728\u52A0\u8F7D\u5E74\u5EA6\u6D3B\u52A8", error: "\u5E74\u5EA6\u6D3B\u52A8\u52A0\u8F7D\u5931\u8D25", retry: "\u91CD\u8BD5", future: "\u672A\u6765\u65E5\u671F", none: "\u65E0\u6D3B\u52A8", clear: "\u6E05\u9664\u6D3B\u52A8\u7B5B\u9009", filter: "\u6D3B\u52A8\u7B5B\u9009", total: "\u6D3B\u52A8\u603B\u6570", dailyCount: "\u6BCF\u65E5\u6B21\u6570", weekdays: ["\u4E00", "\u4E8C", "\u4E09", "\u56DB", "\u4E94", "\u516D", "\u65E5"], claimedNote: "\u5DF2\u63A5\u53D6/\u5DF2\u5B8C\u6210\u4EFB\u52A1\uFF1B\u5386\u53F2\u4EFB\u52A1\u672A\u8BB0\u5F55\u63A5\u53D6\u65F6\u95F4\uFF0C\u6309\u53D1\u5E03\u65E5\u671F\u8BA1" },
      en: { title: "Annual task activity", previous: "Previous year", next: "Next year", done: "Done", publish: "Published", shutdown: "Closed", claimed: "Claimed", empty: { done: "No completed tasks this year", publish: "No published tasks this year", shutdown: "No closed tasks this year", claimed: "No claimed tasks this year" }, loading: "Loading annual activity", error: "Could not load annual activity", retry: "Retry", future: "Future date", none: "No activity", clear: "Clear activity filter", filter: "Activity filter", total: "Total events", dailyCount: "Daily count", weekdays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], claimedNote: "claimed or completed tasks; historical tasks without a claim time use the publish date" }
    };
    function localDay(d) {
      return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
    }
    function calendar(year) {
      var start = Date.UTC(year, 0, 1), count2 = (Date.UTC(year + 1, 0, 1) - start) / 864e5;
      var offset = (new Date(start).getUTCDay() + 6) % 7;
      return { weeks: Math.ceil((offset + count2) / 7), days: Array.from({ length: count2 }, function(_, i) {
        var d = new Date(start + i * 864e5);
        return { date: d.toISOString().slice(0, 10), row: (offset + i) % 7 + 1, column: Math.floor((offset + i) / 7) + 1, month: d.getUTCMonth(), first: d.getUTCDate() === 1 };
      }) };
    }
    function level(n) {
      return LEVELS.reduce(function(value, entry, index) {
        return n >= entry.min ? index + 1 : value;
      }, 1);
    }
    function legendLabel(lang) {
      return COPY[lang].dailyCount + (lang === "en" ? ": " : "\uFF1A") + LEVELS.map(function(entry) {
        if (lang === "en") return entry.max === null ? entry.min + " or more events" : entry.min === entry.max ? entry.min + " event" : entry.min + " to " + entry.max + " events";
        return entry.max === null ? entry.min + " \u6B21\u4EE5\u4E0A" : entry.min === entry.max ? entry.min + " \u6B21" : entry.min + " \u5230 " + entry.max + " \u6B21";
      }).join(lang === "en" ? "; " : "\uFF1B");
    }
    function count(day, type) {
      return Number(day[type]) || 0;
    }
    function background(day, type) {
      return count(day, type) ? "var(--hm-" + type + "-" + level(count(day, type)) + ")" : "var(--hm-empty)";
    }
    function label(date, day, t, type) {
      return date + " \xB7 " + t[type] + " " + count(day, type);
    }
    function activityParams(params) {
      if (!params || !/^\d{4}-\d{2}-\d{2}$/.test(params.activityDate || "")) return null;
      return { activityDate: params.activityDate, activityType: TYPES.indexOf(params.activityType) >= 0 ? params.activityType : "done" };
    }
    module2.exports = { TYPES, LEVELS, COPY, legendLabel, localDay, calendar, level, count, background, label, activityParams };
  }
});

// packages/addons/tasks/client/stats/heatmap-styles.cjs
var require_heatmap_styles = __commonJS({
  "packages/addons/tasks/client/stats/heatmap-styles.cjs"(exports2, module2) {
    module2.exports = ".wbt-heatmap{--hm-empty:#e9ecef;--hm-done-1:#d3f0d7;--hm-done-2:#91d69c;--hm-done-3:#51b566;--hm-done-4:#2f9e44;--hm-publish-1:#d5e7f8;--hm-publish-2:#96bee6;--hm-publish-3:#568fc7;--hm-publish-4:#2b6cb0;--hm-shutdown-1:#fbdada;--hm-shutdown-2:#f1a0a0;--hm-shutdown-3:#df6262;--hm-shutdown-4:#c92a2a;--hm-claimed-1:#ffedd5;--hm-claimed-2:#fdba74;--hm-claimed-3:#f89a3c;--hm-claimed-4:#d9600d;min-width:0;max-width:100%;border:1px solid color-mix(in srgb,currentColor 15%,transparent);border-radius:12px;padding:16px;margin-bottom:16px;color:inherit;font-size:12px;box-sizing:border-box}.wbt-hm-head,.wbt-hm-legend{display:flex;align-items:center;gap:10px;flex-wrap:wrap}.wbt-hm-head{justify-content:space-between;margin-bottom:16px}.wbt-hm-head h3{margin:0;font-size:14px}.wbt-hm-years{display:flex;align-items:center;gap:12px;font-variant-numeric:tabular-nums}.wbt-heatmap button{font:inherit;color:inherit}.wbt-hm-control{border:1px solid color-mix(in srgb,currentColor 20%,transparent);background:transparent;border-radius:5px;cursor:pointer;padding:4px 8px}.wbt-hm-control[role=tab]{border:0;outline:none;box-shadow:none}.wbt-hm-control[role=tab]:hover{background:color-mix(in srgb,currentColor 6%,transparent)}.wbt-hm-control[aria-selected=true]{font-weight:700;background:color-mix(in srgb,currentColor 10%,transparent)}.wbt-hm-control[role=tab]:focus-visible{outline:2px solid #568fc7;outline-offset:2px}.wbt-hm-scroll{overflow-x:auto;padding:3px;max-width:100%}.wbt-hm-layout{display:flex;gap:8px;min-width:max-content}.wbt-hm-weekdays{display:grid;grid-template-rows:repeat(7,12px);gap:3px;padding-top:22px;font-size:10px;line-height:12px;opacity:.65}.wbt-hm-body{flex:1;min-width:0}.wbt-hm-months{display:grid;grid-template-columns:repeat(var(--hm-weeks),12px);column-gap:3px;height:22px;font-size:10px}.wbt-hm-months span{white-space:nowrap}.wbt-hm-grid{display:grid;grid-template-columns:repeat(var(--hm-weeks),12px);grid-template-rows:repeat(7,12px);gap:3px}.wbt-hm-day{border:0;border-radius:2px;width:12px;height:12px;padding:0;cursor:pointer}.wbt-hm-day[aria-disabled=true]{cursor:default}.wbt-hm-day{outline:none}.wbt-hm-day:focus-visible{outline:2px solid #568fc7;outline-offset:1px}.wbt-hm-day:hover{filter:brightness(.92)}.wbt-hm-future{opacity:.4}.wbt-hm-legend{margin-top:14px}.wbt-hm-swatch{display:inline-block;width:12px;height:12px;border-radius:2px;vertical-align:-2px;margin-right:5px}.wbt-hm-types{display:flex;align-items:center;gap:10px}.wbt-hm-intensity{display:flex;align-items:center;flex-wrap:wrap;gap:10px;border-inline-start:1px solid color-mix(in srgb,currentColor 20%,transparent);padding-inline-start:12px;font-size:11px}.wbt-hm-intensity-label{color:color-mix(in srgb,currentColor 70%,transparent)}.wbt-hm-intensity-item{display:inline-flex;align-items:center;gap:4px;white-space:nowrap}.wbt-hm-intensity-item .wbt-hm-swatch{flex:none;margin:0}.wbt-hm-summary{font-variant-numeric:tabular-nums;overflow-wrap:anywhere}.wbt-hm-state{padding:28px 8px;text-align:center}.wbt-hm-skeleton{height:102px;border-radius:3px;background:repeating-linear-gradient(90deg,var(--hm-empty) 0 12px,transparent 12px 15px);opacity:.55}.dark .wbt-heatmap,[data-theme=dark] .wbt-heatmap,:root[style*='color-scheme:dark'] .wbt-heatmap,:root[style*='color-scheme: dark'] .wbt-heatmap,[data-color-scheme=dark] .wbt-heatmap{--hm-empty:#303740;--hm-done-1:#21452b;--hm-done-2:#2f7440;--hm-done-3:#46a75c;--hm-done-4:#72d38a;--hm-publish-1:#223e5c;--hm-publish-2:#326496;--hm-publish-3:#508ecb;--hm-publish-4:#85baf0;--hm-shutdown-1:#58292b;--hm-shutdown-2:#914146;--hm-shutdown-3:#c95c63;--hm-shutdown-4:#f58e93;--hm-claimed-1:#4a2f14;--hm-claimed-2:#7a4a16;--hm-claimed-3:#b06d1c;--hm-claimed-4:#e6952f;}@media(prefers-color-scheme:dark){:root:not([data-theme=light]):not([data-color-scheme=light]):not([style*='color-scheme:light']):not([style*='color-scheme: light']) .wbt-heatmap{--hm-empty:#303740;--hm-done-1:#21452b;--hm-done-2:#2f7440;--hm-done-3:#46a75c;--hm-done-4:#72d38a;--hm-publish-1:#223e5c;--hm-publish-2:#326496;--hm-publish-3:#508ecb;--hm-publish-4:#85baf0;--hm-shutdown-1:#58292b;--hm-shutdown-2:#914146;--hm-shutdown-3:#c95c63;--hm-shutdown-4:#f58e93;--hm-claimed-1:#4a2f14;--hm-claimed-2:#7a4a16;--hm-claimed-3:#b06d1c;--hm-claimed-4:#e6952f;}}@media(min-width:1200px){.wbt-hm-layout{min-width:0}.wbt-hm-months,.wbt-hm-grid{grid-template-columns:repeat(var(--hm-weeks),minmax(12px,1fr))}.wbt-hm-day{width:12px}}@media(prefers-reduced-motion:reduce){.wbt-heatmap *{animation:none!important;transition:none!important}}";
  }
});

// packages/addons/tasks/client/stats/heatmap.cjs
var require_heatmap = __commonJS({
  "packages/addons/tasks/client/stats/heatmap.cjs"(exports2, module2) {
    var React = require("react");
    var h = React.createElement;
    var model = require_heatmap_model();
    var css = require_heatmap_styles();
    function Heatmap(props) {
      var lang = props.lang === "en" ? "en" : "zh", t = model.COPY[lang];
      var yearState = React.useState((/* @__PURE__ */ new Date()).getFullYear()), year = yearState[0], setYear = yearState[1];
      var typeState = React.useState("done"), type = typeState[0], setType = typeState[1];
      var resultState = React.useState(null), result = resultState[0], setResult = resultState[1];
      var errorState = React.useState(false), error = errorState[0], setError = errorState[1];
      var tipState = React.useState(""), tip = tipState[0], setTip = tipState[1];
      var refreshState = React.useState(0), refresh = refreshState[0], setRefresh = refreshState[1];
      var cache = React.useMemo(function() {
        return /* @__PURE__ */ new Map();
      }, [props.api]);
      React.useEffect(function() {
        if (props.active === false) return;
        var alive = true;
        setResult(null);
        setError(false);
        setTip("");
        if (!cache.has(year)) {
          var request = Promise.resolve().then(function() {
            return props.api.call("tasks.activityCalendar", { year });
          }).then(function(r) {
            if (!r || r.ok === false) throw new Error("calendar unavailable");
            var data = r.result === void 0 ? r : r.result;
            if (data.year !== year || !Array.isArray(data.days)) throw new Error("invalid calendar");
            return data;
          });
          cache.set(year, request);
          request.catch(function() {
            if (cache.get(year) === request) cache.delete(year);
          });
        }
        cache.get(year).then(function(data) {
          if (alive) setResult(data);
        }, function() {
          if (alive) setError(true);
        });
        return function() {
          alive = false;
        };
      }, [props.api, props.active, year, cache, refresh]);
      React.useEffect(function() {
        if (!props.api.subscribe) return;
        return props.api.subscribe(function(p) {
          if (p && p.event === "tasks-changed") {
            cache.clear();
            setRefresh(function(n) {
              return n + 1;
            });
          }
        });
      }, [props.api, cache]);
      var geometry = model.calendar(year), today = model.localDay(/* @__PURE__ */ new Date()), byDate = {};
      if (result) result.days.forEach(function(d) {
        byDate[d.date] = d;
      });
      var ready = result && result.year === year;
      var total = ready ? result.days.reduce(function(n, d) {
        return n + model.count(d, type);
      }, 0) : 0;
      var content;
      if (error) content = h("div", { className: "wbt-hm-state", role: "alert" }, t.error, " \xB7 ", h("button", { className: "wbt-hm-control", onClick: function() {
        cache.delete(year);
        setRefresh(function(n) {
          return n + 1;
        });
      } }, t.retry));
      else if (!ready) content = h("div", { role: "status", "aria-label": t.loading }, h("div", { className: "wbt-hm-skeleton", "aria-hidden": true }), t.loading);
      else if (!total) content = h("div", { className: "wbt-hm-state", role: "status" }, t.empty[type]);
      else content = h(
        React.Fragment,
        null,
        h("div", { className: "wbt-hm-scroll" }, h(
          "div",
          { className: "wbt-hm-layout", style: { "--hm-weeks": geometry.weeks } },
          h("div", { className: "wbt-hm-weekdays", "aria-hidden": true }, t.weekdays.map(function(s) {
            return h("span", { key: s }, s);
          })),
          h(
            "div",
            { className: "wbt-hm-body" },
            h("div", { className: "wbt-hm-months", "aria-hidden": true }, geometry.days.filter(function(d) {
              return d.first;
            }).map(function(d) {
              return h("span", { key: d.date, style: { gridColumn: d.column } }, new Date(Date.UTC(year, d.month, 1)).toLocaleString(lang === "en" ? "en-US" : "zh-CN", { month: "short", timeZone: "UTC" }));
            })),
            h("div", { className: "wbt-hm-grid" }, geometry.days.map(function(d) {
              var day = byDate[d.date] || {}, future = d.date > today, enabled = !future && model.count(day, type) > 0;
              var title = model.label(d.date, day, t, type) + (future ? " \xB7 " + t.future : !model.count(day, type) ? " \xB7 " + t.none : "");
              return h("button", {
                key: d.date,
                type: "button",
                className: "wbt-hm-day" + (future ? " wbt-hm-future" : ""),
                "data-date": d.date,
                title,
                "aria-label": title,
                "aria-disabled": !enabled,
                style: { gridColumn: d.column, gridRow: d.row, background: future ? "var(--hm-empty)" : model.background(day, type) },
                onMouseEnter: function() {
                  setTip(title);
                },
                onMouseLeave: function() {
                  setTip("");
                },
                onFocus: function() {
                  setTip(title);
                },
                onBlur: function() {
                  setTip("");
                },
                onClick: function() {
                  if (enabled && props.onNavigate) props.onNavigate("tasks", { activityDate: d.date, activityType: type });
                }
              });
            }))
          )
        ))
      );
      return h(
        "section",
        { className: "wbt-heatmap", "aria-label": t.title },
        h("style", null, css),
        h("div", { className: "wbt-hm-head" }, h("h3", null, t.title), h(
          "div",
          { className: "wbt-hm-years" },
          h("button", { type: "button", className: "wbt-hm-control", "aria-label": t.previous, disabled: year <= 1900, onClick: function() {
            setYear(year - 1);
          } }, "\u2039"),
          h("strong", { "aria-live": "polite" }, year),
          h("button", { type: "button", className: "wbt-hm-control", "aria-label": t.next, disabled: year >= 9999, onClick: function() {
            setYear(year + 1);
          } }, "\u203A")
        )),
        content,
        h(
          "div",
          { className: "wbt-hm-legend" },
          h("div", { className: "wbt-hm-types", role: "tablist", "aria-label": t.title }, model.TYPES.map(function(k) {
            return h("button", { key: k, type: "button", className: "wbt-hm-control", role: "tab", "aria-selected": type === k, onClick: function() {
              setType(k);
              setTip("");
            } }, h("span", { className: "wbt-hm-swatch", style: { background: "var(--hm-" + k + "-4)" }, "aria-hidden": true }), t[k]);
          })),
          ready && h("span", { className: "wbt-hm-summary", "aria-live": "polite" }, tip || t.total + " \xB7 " + total),
          type === "claimed" && h("span", { className: "wbt-hm-intensity-label" }, t.claimedNote),
          h(
            "div",
            { className: "wbt-hm-intensity", role: "img", "aria-label": model.legendLabel(lang) },
            h("span", { className: "wbt-hm-intensity-label", "aria-hidden": true }, t.dailyCount),
            model.LEVELS.map(function(entry, index) {
              return h(
                "span",
                { key: entry.label, className: "wbt-hm-intensity-item", "aria-hidden": true },
                h("span", { className: "wbt-hm-swatch", style: { background: "var(--hm-" + type + "-" + (index + 1) + ")" }, "aria-hidden": true }),
                entry.label
              );
            })
          )
        )
      );
    }
    module2.exports = Heatmap;
  }
});

// packages/addons/tasks/client/stats/today.cjs
var require_today = __commonJS({
  "packages/addons/tasks/client/stats/today.cjs"(exports2, module2) {
    var React = require("react");
    var h = React.createElement;
    var COPY = {
      zh: { title: "\u4ECA\u65E5", published: "\u4ECA\u65E5\u53D1\u5E03", claimed: "\u4ECA\u65E5\u63A5\u53D6", done: "\u4ECA\u65E5\u5B8C\u6210", shutdown: "\u4ECA\u65E5\u5173\u95ED", average: "\u5E73\u5747\u96BE\u5EA6", sample: "\u6837\u672C\u6570", noSample: "\u65E0\u6837\u672C", clock: "\u4EE5\u670D\u52A1\u7AEF\u5F53\u524D\u65F6\u95F4\u4E3A\u51C6" },
      en: { title: "Today", published: "Published today", claimed: "Claimed today", done: "Completed today", shutdown: "Closed today", average: "Avg difficulty", sample: "samples", noSample: "No samples", clock: "Based on the server's current time" }
    };
    var css = ".wbt-today{margin:12px 0}";
    function Today(props) {
      var data = props.today;
      if (!data || typeof data !== "object") return null;
      var lang = props.lang === "en" ? "en" : "zh", t = COPY[lang];
      var sample = Number.isFinite(data.avgSample) && data.avgSample > 0 ? data.avgSample : 0;
      var average = sample && Number.isFinite(data.avgDifficultyDone) ? data.avgDifficultyDone.toFixed(1) : "\u2014";
      var metrics = ["published", "claimed", "done", "shutdown"].map(function(key) {
        var value = Number.isFinite(data[key]) ? data[key] : 0;
        return { key, label: t[key], value, aria: lang === "zh" ? t[key] + value + "\u6761" : t[key] + ": " + value + " tasks" };
      });
      metrics.push({
        key: "average",
        label: t.average,
        value: average,
        aria: t.average + (lang === "zh" ? "" : ": ") + average + ", " + (sample ? t.sample + " " + sample : t.noSample),
        sample
      });
      return h(
        "section",
        { className: "wbt-today", "aria-label": t.title, "aria-description": data.date, title: t.clock },
        h("style", null, css),
        h("div", { className: "wbt-kpis" }, metrics.map(function(metric) {
          return h(
            "div",
            { key: metric.key, className: "wbt-kpi", role: "group", "aria-label": metric.aria },
            h("div", { className: "wbt-kpi-l", "aria-hidden": true }, metric.label),
            h(
              "div",
              { className: "wbt-kpi-v", "aria-hidden": true },
              metric.value,
              metric.sample !== void 0 ? h("span", { className: "wbt-kpi-u" }, "\xB1" + metric.sample) : null
            )
          );
        }))
      );
    }
    module2.exports = Today;
  }
});

// packages/addons/tasks/client/stats/timeline-section.cjs
var require_timeline_section = __commonJS({
  "packages/addons/tasks/client/stats/timeline-section.cjs"(exports2, module2) {
    var React = require("react");
    var h = React.createElement;
    var COPY = {
      zh: {
        title: "\u65F6\u95F4\u7EBF",
        note: "\u5F53\u524D\u5B58\u91CF\uFF1B\u5DF2\u91CD\u542F\u4EFB\u52A1\u4E0D\u8BA1\u5165\uFF0C\u65E0\u65F6\u95F4\u7EBF\u4E0D\u662F\u9519\u8BEF",
        lines: "\u65F6\u95F4\u7EBF",
        withTasks: "\u6709\u4EFB\u52A1",
        empty: "\u7A7A\u7EBF",
        emptyRatio: "\u7A7A\u7EBF\u5360\u6BD4",
        tasks: "\u6709\u6548\u4EFB\u52A1",
        coverage: "\u5F52\u5C5E\u8986\u76D6\u7387",
        unassigned: "\u672A\u5F52\u5C5E {n} \u6761",
        distribution: "\u89C4\u6A21\u5206\u5E03",
        distributionNote: "\u6309\u6BCF\u6761\u7EBF\u6709\u6548\u4EFB\u52A1\u6570",
        ranking: "\u65F6\u95F4\u7EBF\u6392\u884C",
        rankingNote: "\u5168\u91CF\u805A\u5408\u540E\u53D6\u524D 100\uFF0C\u540C\u6570\u6309 id \u5347\u5E8F",
        overdue: "\u903E\u671F\u65F6\u95F4\u7EBF",
        overdueNote: "\u6309\u903E\u671F\u4EFB\u52A1\u6570\u964D\u5E8F",
        trend: "\u8303\u56F4\u5185\u8D8B\u52BF",
        trendNote: "\u53EA\u7EDF\u8BA1\u8303\u56F4\u5185\u4E8B\u4EF6\uFF0C\u4E0D\u6539\u53D8\u5B58\u91CF",
        colName: "\u65F6\u95F4\u7EBF",
        colTotal: "\u4EFB\u52A1",
        colOpen: "\u5DF2\u5F00\u542F",
        colDone: "\u5DF2\u5B8C\u6210",
        colShutdown: "\u5DF2\u5173\u95ED",
        colRate: "\u5B8C\u6210\u7387",
        colOverdue: "\u903E\u671F",
        colActivity: "\u6700\u8FD1\u6D3B\u52A8",
        members: "\u6210\u5458",
        memberEmpty: "\u6CA1\u6709\u6709\u6548\u6210\u5458",
        loadFail: "\u65F6\u95F4\u7EBF\u7EDF\u8BA1\u6682\u4E0D\u53EF\u7528",
        noData: "\u8FD8\u6CA1\u6709\u65F6\u95F4\u7EBF\u3002\u5728\u300C\u65F6\u95F4\u7EBF\u300D\u91CC\u521B\u5EFA\u540E\u4F1A\u51FA\u73B0\u5728\u8FD9\u91CC",
        noOverdue: "\u6CA1\u6709\u903E\u671F\u65F6\u95F4\u7EBF",
        newLines: "\u65B0\u589E\u65F6\u95F4\u7EBF",
        newTasks: "\u65B0\u589E\u4EFB\u52A1",
        doneTasks: "\u5B8C\u6210\u4EFB\u52A1"
      },
      en: {
        title: "Timelines",
        note: "Current stock; restarted tasks excluded, no timeline is not an error",
        lines: "Timelines",
        withTasks: "With tasks",
        empty: "Empty",
        emptyRatio: "Empty share",
        tasks: "Active tasks",
        coverage: "Coverage",
        unassigned: "{n} unassigned",
        distribution: "Size distribution",
        distributionNote: "By active tasks per line",
        ranking: "Timeline ranking",
        rankingNote: "Full aggregation, top 100, ties by id",
        overdue: "Overdue timelines",
        overdueNote: "By overdue count",
        trend: "In-range trend",
        trendNote: "Events only; stock unchanged",
        colName: "Timeline",
        colTotal: "Tasks",
        colOpen: "Active",
        colDone: "Done",
        colShutdown: "Closed",
        colRate: "Completion",
        colOverdue: "Overdue",
        colActivity: "Last activity",
        members: "Members",
        memberEmpty: "No active members",
        loadFail: "Timeline stats unavailable",
        noData: "No timelines yet. Create one and it appears here.",
        noOverdue: "No overdue timelines",
        newLines: "New timelines",
        newTasks: "New tasks",
        doneTasks: "Done tasks"
      }
    };
    function text(lang) {
      return COPY[lang === "en" ? "en" : "zh"];
    }
    function fmt(v) {
      return v === null || v === void 0 ? "\u2014" : v;
    }
    function buildSection(data, ctx) {
      var ch = ctx.ch, t = ctx.t, lang = ctx.lang;
      var members = ctx.members || {}, openId = ctx.openId || "", toggle = ctx.toggle || function() {
      };
      var totals = data.totals || {};
      var rows = data.top && data.top.records || [];
      var children = [];
      children.push(h(
        ch.Card,
        { key: "tl", span: 12, title: t.title, note: t.note },
        h(
          "div",
          { className: "wbt-kpis" },
          h(ch.Kpi, { label: t.lines, value: fmt(totals.timelines), hint: t.emptyRatio + " " + fmt(totals.emptyRatio) + (totals.emptyRatio === null ? "" : "%"), lang }),
          h(ch.Kpi, { label: t.withTasks, value: fmt(totals.timelinesWithTasks), hint: t.empty + " " + fmt(totals.emptyTimelines), lang }),
          h(ch.Kpi, { label: t.empty, value: fmt(totals.emptyTimelines), tone: totals.emptyTimelines > 0 ? "warn" : "", hint: t.emptyRatio + " " + fmt(totals.emptyRatio) + (totals.emptyRatio === null ? "" : "%"), lang }),
          h(ch.Kpi, { label: t.coverage, value: totals.coverage === null || totals.coverage === void 0 ? "\u2014" : ch.pct(totals.coverage / 100), hint: t.unassigned.replace("{n}", String(fmt(totals.unassignedTasks))) + " / " + fmt(totals.tasks), lang })
        ),
        totals.timelines === 0 ? h(ch.Empty, { text: t.noData }) : null,
        totals.timelines > 0 ? h(
          "table",
          { className: "wbt-table", "data-ranking": t.ranking },
          h("thead", null, h(
            "tr",
            null,
            h("th", null, t.colName),
            h("th", null, t.colTotal),
            h("th", null, t.colOpen),
            h("th", null, t.colDone),
            h("th", null, t.colShutdown),
            h("th", null, t.colRate),
            h("th", null, t.colOverdue),
            h("th", null, t.colActivity)
          )),
          h("tbody", null, rows.map(function(line) {
            var memberRows = members[line.id];
            var expanded = openId === line.id;
            return h(
              React.Fragment,
              { key: line.id },
              h(
                "tr",
                null,
                h("td", null, h("button", {
                  type: "button",
                  className: "wbt-btn ghost",
                  "aria-expanded": expanded,
                  onClick: function() {
                    toggle(line);
                  }
                }, line.title || line.id)),
                h("td", { className: "num" }, line.taskCount),
                h("td", { className: "num" }, line.openCount),
                h("td", { className: "num" }, line.doneCount),
                h("td", { className: "num" }, line.shutdownCount),
                h("td", { className: "num" }, line.doneRate === null || line.doneRate === void 0 ? "\u2014" : ch.pct(line.doneRate / 100)),
                h("td", { className: "num" }, line.overdueCount),
                h("td", null, line.lastActivityDate || "\u2014")
              ),
              expanded ? h("tr", { key: line.id + "-members" }, h(
                "td",
                { colSpan: 8 },
                h(
                  "div",
                  { className: "wbt-tl-members" },
                  h("strong", null, t.members + "\uFF1A"),
                  memberRows === void 0 ? h("span", null, "\u2026") : memberRows.length === 0 ? h("span", null, t.memberEmpty) : h("span", null, memberRows.map(function(task) {
                    return task.title;
                  }).join("\u3001"))
                )
              )) : null
            );
          })),
          h("caption", null, (data.top && data.top.truncated ? lang === "en" ? "Showing the first " + rows.length + ". " : "\u4EC5\u663E\u793A\u524D " + rows.length + " \u6761\u3002" : "") + t.rankingNote)
        ) : null
      ));
      if (totals.timelines > 0) {
        children.push(h(
          ch.Card,
          { key: "tldist", span: 6, title: t.distribution, note: t.distributionNote },
          h(ch.Histogram, { data: data.distribution || [], lang, color: ch.colors[3] })
        ));
        var overdue = data.overdue && data.overdue.lines || [];
        children.push(h(
          ch.Card,
          { key: "tloverdue", span: 6, title: t.overdue, note: t.overdueNote },
          h(ch.DataTable, {
            rows: overdue,
            lang,
            empty: t.noOverdue,
            columns: [
              { key: "title", label: t.colName },
              { key: "taskCount", label: t.colTotal, num: true },
              { key: "overdueCount", label: t.colOverdue, num: true },
              { key: "lastActivityDate", label: t.colActivity }
            ]
          })
        ));
      }
      if (data.trend) {
        children.push(h(
          ch.Card,
          { key: "tltrend", span: 12, title: t.trend, note: t.trendNote },
          h(
            "div",
            { className: "wbt-kpis" },
            h(ch.Kpi, { label: t.newLines, value: data.trend.newTimelines, hint: data.trend.from + " ~ " + data.trend.to, lang }),
            h(ch.Kpi, { label: t.newTasks, value: data.trend.newTasks, lang }),
            h(ch.Kpi, { label: t.doneTasks, value: data.trend.doneTasks, lang })
          )
        ));
      }
      return children;
    }
    function TimelineSection(props) {
      var api = props.api;
      var ch = props.ch;
      var lang = props.lang;
      var t = text(lang);
      var state = React.useState(null);
      var data = state[0], setData = state[1];
      var failPair = React.useState("");
      var err = failPair[0], setErr = failPair[1];
      var openPair = React.useState("");
      var openId = openPair[0], setOpenId = openPair[1];
      var memberPair = React.useState({});
      var members = memberPair[0], setMembers = memberPair[1];
      var load = React.useCallback(function() {
        return Promise.resolve(api.call("tasks.timelineStats", { topLimit: 100 })).then(function(r) {
          return r && r.result !== void 0 ? r.result : r;
        }).then(function(d) {
          setData(d || null);
          setErr("");
        }).catch(function(e) {
          setErr(String(e && e.message || e || "load failed"));
        });
      }, [api]);
      React.useEffect(function() {
        if (props.active !== false) load();
      }, [load, props.active]);
      React.useEffect(function() {
        if (props.active === false || !api || typeof api.subscribe !== "function") return void 0;
        var timer = null;
        var off = api.subscribe(function(payload) {
          var ev = payload && payload.event;
          if (ev !== "tasks-changed" && ev !== "task-timelines-changed") return;
          if (timer) clearTimeout(timer);
          timer = setTimeout(function() {
            load();
          }, 800);
        });
        return function() {
          if (timer) clearTimeout(timer);
          if (typeof off === "function") off();
        };
      }, [api, load, props.active]);
      function toggle(line) {
        var next = openId === line.id ? "" : line.id;
        setOpenId(next);
        if (!next || members[next]) return;
        Promise.resolve(api.call("tasks.timeline", { timelineId: line.id, pageNumber: 1, pageSize: 100 })).then(function(r) {
          return r && r.result !== void 0 ? r.result : r;
        }).then(function(r) {
          setMembers(function(prev) {
            var copy = Object.assign({}, prev);
            copy[next] = r && r.records || [];
            return copy;
          });
        }).catch(function() {
          setMembers(function(prev) {
            var copy = Object.assign({}, prev);
            copy[next] = [];
            return copy;
          });
        });
      }
      if (err && !data) {
        return h(ch.Card, { key: "tlerr", span: 12, title: t.title }, h(ch.Empty, { text: t.loadFail }));
      }
      if (!data) return h(ch.Card, { key: "tlsk", span: 12, title: t.title }, h(ch.Skeleton, {}));
      return h(React.Fragment, null, buildSection(data, { ch, t, lang, members, openId, toggle }));
    }
    module2.exports = { TimelineSection, buildSection, text };
  }
});

// packages/addons/tasks/client/stats/list-state.cjs
var require_list_state = __commonJS({
  "packages/addons/tasks/client/stats/list-state.cjs"(exports2, module2) {
    var LISTS = ["overdue", "recentPublish", "recentDone", "recentShutdown"];
    var COPY = {
      zh: "\u7EDF\u8BA1\u63A5\u53E3\u672A\u8FD4\u56DE\u300C{key}\u300D\u6E05\u5355\uFF0C\u524D\u540E\u7AEF\u7248\u672C\u53EF\u80FD\u4E0D\u4E00\u81F4\uFF1B\u8BF7\u91CD\u542F\u63D2\u4EF6\u670D\u52A1\u540E\u91CD\u8BD5",
      en: 'Stats API did not return the "{key}" list; frontend and backend versions may differ. Restart the plugin service and retry.'
    };
    function listState(data, key) {
      if (LISTS.indexOf(key) < 0) throw new Error("unknown list: " + key);
      var lists = data && data.lists;
      var declared = data && data.capabilities && Array.isArray(data.capabilities.lists) ? data.capabilities.lists : null;
      var missing = !lists || !Object.prototype.hasOwnProperty.call(lists, key);
      if (!missing && declared && declared.indexOf(key) < 0) missing = true;
      var rows = !missing && Array.isArray(lists[key]) ? lists[key] : [];
      return { key, missing, rows };
    }
    function missingText(lang, key) {
      return (lang === "en" ? COPY.en : COPY.zh).replace("{key}", key);
    }
    module2.exports = { LISTS, listState, missingText };
  }
});

// packages/addons/tasks/client/views/stats.cjs
var require_stats = __commonJS({
  "packages/addons/tasks/client/views/stats.cjs"(exports2, module2) {
    var React = require("react");
    var h = React.createElement;
    var charts = require_charts();
    var configView = require_config();
    var recentColumns = require_recent_columns();
    var rankingName = require_ranking_name();
    var Heatmap = require_heatmap();
    var Today = require_today();
    var TimelineSection = require_timeline_section().TimelineSection;
    var listState = require_list_state();
    var COPY = {
      zh: {
        title: "\u4EFB\u52A1\u7EDF\u8BA1",
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
        total: "\u603B\u4EFB\u52A1",
        active: "\u5DF2\u5F00\u542F",
        overdue: "\u903E\u671F",
        completion: "\u5B8C\u6210\u7387",
        dueToday: "\u4ECA\u65E5\u5230\u671F",
        dueNext7: "\u672A\u6765 7 \u5929\u5230\u671F",
        newInRange: "\u8303\u56F4\u5185\u65B0\u589E",
        avgCycle: "\u5E73\u5747\u5B8C\u6210\u5468\u671F",
        days: "\u5929",
        current: "\u5F53\u524D",
        inRange: "\u8303\u56F4\u5185",
        ofTotal: "\u5360\u603B\u91CF",
        ofActive: "\u5360\u5DF2\u5F00\u542F",
        trend: "\u65B0\u589E / \u5B8C\u6210 / \u5230\u671F\u8D8B\u52BF",
        trendNote: "\u6309\u81EA\u7136\u65E5 / \u5468 / \u6708\u5206\u6876",
        created: "\u65B0\u589E",
        done: "\u5B8C\u6210",
        due: "\u5230\u671F",
        status: "\u72B6\u6001\u6784\u6210",
        statusNote: "\u5F53\u524D\u5B58\u91CF",
        priority: "\u4F18\u5148\u7EA7\u5206\u5E03",
        priorityNote: "\u5F53\u524D\u5B58\u91CF\uFF1B\u4E0D\u542B\u5DF2\u5173\u95ED/\u5DF2\u5B8C\u6210\uFF1B\u70B9\u67F1\u5F62\u67E5\u770B\u4EFB\u52A1",
        pickHint: "\u70B9\u51FB\u67F1\u5F62\u67E5\u770B\u5BF9\u5E94\u4EFB\u52A1",
        difficulty: "\u96BE\u5EA6\u5206\u5E03",
        difficultyNote: "\u5F53\u524D\u5B58\u91CF\uFF1B\u5305\u542B\u672A\u8BBE\u7F6E",
        difficultyMissing: "\u672A\u586B\u96BE\u5EA6 {n} \u6761",
        difficultyMissingLink: "\u67E5\u770B\u5E76\u8865\u9F50\u96BE\u5EA6",
        aging: "\u903E\u671F\u8D26\u9F84",
        agingNote: "\u5F53\u524D\u903E\u671F\u4EFB\u52A1",
        overdueList: "\u903E\u671F\u6E05\u5355",
        overdueNote: "\u6309\u8D26\u9F84\u964D\u5E8F",
        tables: "\u4EFB\u52A1\u8868\u6392\u884C",
        tablesNote: "\u6309\u5DF2\u5F00\u542F + \u903E\u671F\u6743\u91CD",
        groups: "\u4EFB\u52A1\u7EC4\u6392\u884C",
        groupsNote: "\u4E00\u7EA7\u4EFB\u52A1\u7EC4",
        workspaces: "\u5DE5\u4F5C\u533A\u6392\u884C",
        workspacesNote: "\u5B58\u91CF\u53E3\u5F84\uFF1B\u4EFB\u52A1\u53EF\u6302\u591A\u4E2A\u5DE5\u4F5C\u533A\uFF0C\u5404\u884C\u5408\u8BA1\u53EF\u80FD\u5927\u4E8E\u4EFB\u52A1\u603B\u6570",
        noWorkspaceRow: "\u672A\u5173\u8054\u5DE5\u4F5C\u533A",
        noWorkspaceNote: "\u6B63\u5E38\u72B6\u6001\uFF1A\u8FD9\u4E9B\u4EFB\u52A1\u6CA1\u6709\u5F52\u5C5E\u4EFB\u4F55\u5DE5\u4F5C\u533A",
        noWorkspacesEmpty: "\u8FD8\u6CA1\u6709\u5DE5\u4F5C\u533A\uFF0C\u4E5F\u6CA1\u6709\u672A\u5173\u8054\u5DE5\u4F5C\u533A\u7684\u4EFB\u52A1",
        colName: "\u540D\u79F0",
        colTotal: "\u603B\u6570",
        colOpen: "\u5DF2\u5F00\u542F",
        colOverdue: "\u903E\u671F",
        colDone: "\u5DF2\u5B8C\u6210",
        colRate: "\u5B8C\u6210\u7387",
        colTitle: "\u4EFB\u52A1",
        colTarget: "\u8BA1\u5212\u5B8C\u6210",
        colAge: "\u903E\u671F\u5929\u6570",
        colTable: "\u4EFB\u52A1\u8868",
        recentPublish: "\u6700\u8FD1\u53D1\u5E03",
        recentPublishNote: "\u6309\u53D1\u5E03\u65E5\u671F\u5012\u5E8F",
        noRecentPublish: "\u8FD8\u6CA1\u6709\u53D1\u5E03\u7684\u4EFB\u52A1",
        recentDone: "\u6700\u8FD1\u5B8C\u6210",
        recentDoneNote: "\u6309\u5B8C\u6210\u65E5\u671F\u5012\u5E8F",
        recentShutdown: "\u6700\u8FD1\u5173\u95ED",
        recentShutdownNote: "\u6309\u5173\u95ED\u65E5\u671F\u5012\u5E8F",
        colDate: "\u65E5\u671F",
        noRecentDone: "\u8FD8\u6CA1\u6709\u5DF2\u5B8C\u6210\u7684\u4EFB\u52A1",
        noRecentShutdown: "\u8FD8\u6CA1\u6709\u5DF2\u5173\u95ED\u7684\u4EFB\u52A1",
        noOverdue: "\u6CA1\u6709\u903E\u671F\u4EFB\u52A1",
        noData: "\u8FD8\u6CA1\u6709\u4EFB\u52A1\u3002\u5728\u300C\u8BB0\u5F55\u300D\u91CC\u521B\u5EFA\u540E\uFF0C\u8FD9\u91CC\u4F1A\u81EA\u52A8\u6C47\u603B",
        open: "\u5DF2\u5F00\u542F",
        claimed: "\u5DF2\u63A5\u53D6",
        shutdown: "\u5DF2\u5173\u95ED",
        restarted: "\u5DF2\u91CD\u542F"
      },
      en: {
        title: "Task stats",
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
        total: "Tasks",
        active: "Active",
        overdue: "Overdue",
        completion: "Completion",
        dueToday: "Due today",
        dueNext7: "Due next 7d",
        newInRange: "New in range",
        avgCycle: "Avg cycle",
        days: "d",
        current: "Current",
        inRange: "In range",
        ofTotal: "of total",
        ofActive: "of active",
        trend: "Created / done / due trend",
        trendNote: "Bucketed by day / week / month",
        created: "Created",
        done: "Done",
        due: "Due",
        status: "Status",
        statusNote: "Current",
        priority: "Priority",
        priorityNote: "Current; excludes closed/completed; click a bar to list tasks",
        pickHint: "Click a bar to list matching tasks",
        difficulty: "Difficulty",
        difficultyNote: "Current; includes unset",
        difficultyMissing: "{n} tasks without difficulty",
        difficultyMissingLink: "Review missing difficulty",
        aging: "Overdue aging",
        agingNote: "Current overdue",
        overdueList: "Overdue list",
        overdueNote: "Oldest first",
        tables: "Task tables",
        tablesNote: "Weighted by active + overdue",
        groups: "Task groups",
        groupsNote: "First-level groups",
        workspaces: "Workspaces",
        workspacesNote: "Current stock; a task can sit in several workspaces, so rows may add up to more than the total",
        noWorkspaceRow: "No workspace",
        noWorkspaceNote: "Normal state: these tasks belong to no workspace",
        noWorkspacesEmpty: "No workspaces and no tasks without one yet",
        colName: "Name",
        colTotal: "Total",
        colOpen: "Active",
        colOverdue: "Overdue",
        colDone: "Done",
        colRate: "Completion",
        colTitle: "Task",
        colTarget: "Target",
        colAge: "Days late",
        colTable: "Table",
        recentPublish: "Recently published",
        recentPublishNote: "Newest publication first",
        noRecentPublish: "No published tasks yet",
        recentDone: "Recently completed",
        recentDoneNote: "Newest completion first",
        recentShutdown: "Recently closed",
        recentShutdownNote: "Newest closure first",
        colDate: "Date",
        noRecentDone: "No completed tasks yet",
        noRecentShutdown: "No closed tasks yet",
        noOverdue: "No overdue tasks",
        noData: "No tasks yet. Create one in Tasks and the summary appears here.",
        open: "Active",
        shutdown: "Closed",
        restarted: "Restarted"
      }
    };
    var RANGES = ["7d", "30d", "90d", "365d", "all"];
    function listProps(data, key, lang, rest) {
      var st = listState.listState(data, key);
      return Object.assign({ rows: st.rows, missing: st.missing, missingText: listState.missingText(lang, key) }, rest);
    }
    function visibleBins(list) {
      return (list || []).filter(function(b) {
        return !b.hidden;
      });
    }
    function priorityPicker(onNavigate) {
      if (typeof onNavigate !== "function") return null;
      return function(bin) {
        var n = Number(bin && bin.key);
        if (!Number.isInteger(n) || n < 1 || n > 10) return;
        onNavigate("tasks", { priorityMin: n, priorityMax: n });
      };
    }
    function difficultyPicker(onNavigate) {
      if (typeof onNavigate !== "function") return null;
      return function(bin) {
        var key = bin && bin.key;
        if (key === "unset") {
          onNavigate("tasks", { difficultyMissing: true });
          return;
        }
        var n = Number(key);
        if (!(n >= 0.5 && n <= 5)) return;
        onNavigate("tasks", { difficultyMin: n, difficultyMax: n });
      };
    }
    var CFG_FALLBACK = { "stats.range": "30d", "stats.top": 10, "stats.showKpi": true, "stats.recentPublishLimit": 10, "stats.recentDoneLimit": 10, "stats.recentShutdownLimit": 10 };
    function TasksStatsView(props) {
      var lang = props.lang === "en" ? "en" : "zh";
      var cfg = configView.useConfig(props.api, CFG_FALLBACK);
      if (!cfg.ready) {
        return h("div", { style: { padding: "48px", textAlign: "center", fontSize: "12.5px", opacity: 0.6 } }, lang === "en" ? "Loading\u2026" : "\u8F7D\u5165\u4E2D\u2026");
      }
      return h(TasksStatsBody, Object.assign({}, props, { cfg: cfg.values }));
    }
    function TasksStatsBody(props) {
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
      var ch = React.useMemo(function() {
        return charts.makeCharts("wbt");
      }, []);
      var rangePair = React.useState(cfgRange);
      var range = rangePair[0], setRange = rangePair[1];
      var dataPair = React.useState(null);
      var data = dataPair[0], setData = dataPair[1];
      var errPair = React.useState("");
      var err = errPair[0], setErr = errPair[1];
      var loadPair = React.useState(true);
      var loading = loadPair[0], setLoading = loadPair[1];
      var req = React.useRef(0);
      var customPair = React.useState(null);
      var custom = customPair[0], setCustom = customPair[1];
      var todayDay = React.useMemo(function() {
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
      function cfgLimit(key) {
        var n = Number(cfg[key]);
        if (!Number.isFinite(n)) return 10;
        return Math.max(1, Math.min(50, Math.floor(n)));
      }
      var load = React.useCallback(function(silent) {
        if ((customFrom || customTo) && !customOk) return Promise.resolve();
        var id = ++req.current;
        if (!silent) setLoading(true);
        var args = {
          top: cfgTop,
          recentPublishLimit: cfgLimit("stats.recentPublishLimit"),
          recentDoneLimit: cfgLimit("stats.recentDoneLimit"),
          recentShutdownLimit: cfgLimit("stats.recentShutdownLimit")
        };
        if (customOk) {
          args.from = customFrom;
          args.to = customTo;
        } else {
          args.range = range;
        }
        return Promise.resolve(api.call("tasks.statsReport", args)).then(function(r) {
          return r && r.result !== void 0 ? r.result : r;
        }).then(function(d) {
          if (id !== req.current) return;
          setData(d);
          setErr("");
        }).catch(function(e) {
          if (id !== req.current) return;
          setErr(String(e && e.message || e || "load failed"));
        }).then(function() {
          if (id === req.current) setLoading(false);
        });
      }, [api, range, customOk, customFrom, customTo, cfgTop, cfg]);
      React.useEffect(function() {
        if (props.active !== false) load(true);
      }, [load, props.active]);
      React.useEffect(function() {
        if (props.active === false || !api || typeof api.subscribe !== "function") return void 0;
        var timer = null;
        var pending = false;
        var off = api.subscribe(function(payload) {
          var ev = payload && payload.event;
          if (ev !== "tasks-changed" && ev !== "task-nodes-changed") return;
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
      }, [api, load, props.active]);
      var options = RANGES.map(function(key) {
        return { key, label: t["range" + (key === "all" ? "All" : key.replace("d", ""))] };
      });
      var children = [];
      if (!data && loading) children.push(h(ch.Skeleton, { key: "sk" }));
      if (!data && !loading && err) {
        children.push(h(ch.Card, { key: "err", span: 12 }, h(ch.Empty, { text: t.loadFail })));
      }
      if (data) {
        var totals = data.totals || {};
        var rates = data.rates || {};
        var b = data.breakdowns || {};
        children.push(h(
          "div",
          { key: "kpi", className: "wbt-kpis" },
          h(ch.Kpi, { label: t.total, value: totals.total, hint: t.current, lang }),
          h(ch.Kpi, { label: t.active, value: totals.active, hint: t.ofTotal + " " + ch.pct(totals.total ? totals.active / totals.total : 0), lang }),
          h(ch.Kpi, { label: t.overdue, value: totals.overdue, hint: t.ofActive + " " + ch.pct(rates.overdue), tone: totals.overdue > 0 ? "danger" : "", lang }),
          h(ch.Kpi, { label: t.completion, value: ch.pct(rates.completion), hint: totals.done + " / " + totals.total, tone: "ok", lang }),
          h(ch.Kpi, { label: t.dueToday, value: totals.dueToday, hint: t.current, tone: totals.dueToday > 0 ? "warn" : "", lang }),
          h(ch.Kpi, { label: t.dueNext7, value: totals.dueNext7, hint: t.current, lang }),
          h(ch.Kpi, { label: t.newInRange, value: totals.newInRange, hint: t.inRange, lang }),
          h(ch.Kpi, { label: t.avgCycle, value: rates.avgCycleDays === null || rates.avgCycleDays === void 0 ? "\u2014" : rates.avgCycleDays, unit: t.days, hint: t.inRange, lang })
        ));
        if (totals.total === 0) {
          children.push(h(ch.Card, { key: "empty", span: 12 }, h(ch.Empty, { text: t.noData })));
        } else {
          children.push(h(
            ch.Card,
            { key: "trend", span: 8, title: t.trend, note: t.trendNote },
            h(ch.Trend, {
              data: data.trend || [],
              lang,
              series: [
                { key: "created", label: t.created, color: ch.colors[0] },
                { key: "done", label: t.done, color: ch.colors[1] },
                { key: "due", label: t.due, color: ch.colors[2] }
              ]
            })
          ));
          var statusData = (b.status || []).filter(function(s) {
            return Object.prototype.hasOwnProperty.call(ch.statusColors, s.key);
          }).map(function(s) {
            return { key: s.key, label: String(s.key) === "0" ? t.open : String(s.key) === "1" ? t.shutdown : String(s.key) === "4" ? t.claimed : t.colDone, count: s.count, color: ch.statusColors[s.key] };
          });
          var statusTotal = statusData.reduce(function(sum, s) {
            return sum + Number(s.count || 0);
          }, 0);
          children.push(h(
            ch.Card,
            { key: "status", span: 4, title: t.status, note: t.statusNote },
            h(ch.Donut, {
              data: statusData,
              total: statusTotal,
              lang,
              centerLabel: t.total,
              aria: t.total + " " + statusTotal + "; " + statusData.map(function(s) {
                return s.label + " " + s.count;
              }).join("; ")
            })
          ));
          children.push(h(
            ch.Card,
            { key: "priority", span: 6, title: t.priority, note: t.priorityNote },
            h(ch.Histogram, { data: visibleBins(b.priority), lang, color: ch.colors[0], onSelect: priorityPicker(props.onNavigate), selectHint: lang === "en" ? "click to list" : "\u70B9\u51FB\u67E5\u770B\u4EFB\u52A1" })
          ));
          var missingBin = (b.difficulty || []).find(function(bin) {
            return bin.key === "unset";
          });
          children.push(h(
            ch.Card,
            { key: "difficulty", span: 6, title: t.difficulty, note: t.difficultyNote },
            h(ch.Histogram, { data: (b.difficulty || []).map(function(bin) {
              return bin.key === "unset" ? Object.assign({}, bin, { label: lang === "en" ? "Unset" : "\u672A\u8BBE\u7F6E" }) : bin;
            }), lang, color: ch.colors[4], onSelect: difficultyPicker(props.onNavigate), selectHint: lang === "en" ? "click to list" : "\u70B9\u51FB\u67E5\u770B\u4EFB\u52A1" }),
            h(
              "p",
              null,
              t.difficultyMissing.replace("{n}", String(missingBin ? missingBin.count : 0)),
              " ",
              typeof props.onNavigate === "function" ? h("button", { type: "button", className: "wbt-btn ghost", onClick: function() {
                props.onNavigate("tasks", { difficultyMissing: true });
              } }, t.difficultyMissingLink) : null
            )
          ));
          children.push(h(
            ch.Card,
            { key: "aging", span: 6, title: t.aging, note: t.agingNote },
            h(ch.Histogram, { data: data.aging || [], lang, color: ch.colors[2] })
          ));
          children.push(h(
            ch.Card,
            { key: "overdue", span: 6, title: t.overdueList, note: t.overdueNote },
            h(ch.DataTable, listProps(data, "overdue", lang, {
              lang,
              empty: t.noOverdue,
              columns: [
                { key: "title", label: t.colTitle },
                { key: "targetDate", label: t.colTarget },
                { key: "daysOverdue", label: t.colAge, num: true },
                { key: "tableTitle", label: t.colTable }
              ]
            }))
          ));
          children.push(h(
            ch.Card,
            { key: "tables", span: 6, title: t.tables, note: t.tablesNote },
            h(ch.DataTable, {
              rows: data.rankings && data.rankings.tables || [],
              lang,
              columns: [
                rankingName(t, lang, props.onNavigate, "table"),
                { key: "total", label: t.colTotal, num: true },
                { key: "open", label: t.colOpen, num: true },
                { key: "overdue", label: t.colOverdue, num: true },
                { key: "completion", label: t.colRate, num: true, render: function(r) {
                  return ch.pct(r.completion);
                } }
              ]
            })
          ));
          children.push(h(
            ch.Card,
            { key: "groups", span: 6, title: t.groups, note: t.groupsNote },
            h(ch.DataTable, {
              rows: data.rankings && data.rankings.groups || [],
              lang,
              columns: [
                rankingName(t, lang, props.onNavigate, "group"),
                { key: "total", label: t.colTotal, num: true },
                { key: "open", label: t.colOpen, num: true },
                { key: "overdue", label: t.colOverdue, num: true },
                { key: "completion", label: t.colRate, num: true, render: function(r) {
                  return ch.pct(r.completion);
                } }
              ]
            })
          ));
          var wsRows = (data.rankings && data.rankings.workspaces || []).slice();
          var noneRow = data.rankings && data.rankings.noWorkspace;
          if (noneRow && (wsRows.length || noneRow.total > 0)) {
            wsRows.push(Object.assign({}, noneRow, { title: t.noWorkspaceRow }));
          }
          children.push(h(
            ch.Card,
            { key: "workspaces", span: 6, title: t.workspaces, note: t.workspacesNote },
            h(ch.DataTable, {
              rows: wsRows,
              lang,
              empty: t.noWorkspacesEmpty,
              columns: [
                rankingName(t, lang, props.onNavigate, "workspace"),
                { key: "total", label: t.colTotal, num: true },
                { key: "open", label: t.colOpen, num: true },
                { key: "overdue", label: t.colOverdue, num: true },
                { key: "completion", label: t.colRate, num: true, render: function(r) {
                  return ch.pct(r.completion);
                } }
              ]
            })
          ));
          children.push(h(TimelineSection, { key: "timeline", api, lang, active: props.active, ch }));
          var recentCols = recentColumns(t, lang, props.onNavigate);
          children.push(h(
            ch.Card,
            { key: "recentPublish", span: 4, title: t.recentPublish, note: t.recentPublishNote },
            h(ch.DataTable, listProps(data, "recentPublish", lang, { lang, empty: t.noRecentPublish, columns: recentCols }))
          ));
          children.push(h(
            ch.Card,
            { key: "recentDone", span: 4, title: t.recentDone, note: t.recentDoneNote },
            h(ch.DataTable, listProps(data, "recentDone", lang, { lang, empty: t.noRecentDone, columns: recentCols }))
          ));
          children.push(h(
            ch.Card,
            { key: "recentShutdown", span: 4, title: t.recentShutdown, note: t.recentShutdownNote },
            h(ch.DataTable, listProps(data, "recentShutdown", lang, { lang, empty: t.noRecentShutdown, columns: recentCols }))
          ));
        }
        children.push(h(ch.Warnings, { key: "warn", items: data.warnings || [] }));
      }
      children = children.filter(function(node) {
        var k = node && node.key;
        if (!k || k === "sk" || k === "err" || k === "warn" || k === "empty") return true;
        if (k === "kpi") return cfg["stats.showKpi"] !== false;
        return sectionOn(k);
      });
      return h(
        "div",
        { className: "wbt-stats" },
        h(Today, { today: data && data.today, lang }),
        h(Heatmap, { api, lang, active: props.active, onNavigate: props.onNavigate }),
        h(ch.RangeSwitch, {
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
        err && data ? h(ch.ErrorBar, { message: err, onRetry: function() {
          load(false);
        }, retryLabel: t.retry }) : null,
        h("div", { className: "wbt-sgrid" }, children)
      );
    }
    module2.exports = { TasksStatsView };
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
            h("span", null, fmt(t.queryTime, { n: data ? data.queryMs : 0 }))
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
                  h("span", { className: P + "-sidecount" }, String(tb.count))
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
                    current ? fmt(t.rowCount, { n: current.count }) : "",
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

// packages/addons/tasks/client/views/data.cjs
var require_data = __commonJS({
  "packages/addons/tasks/client/views/data.cjs"(exports2, module2) {
    "use strict";
    module2.exports = require_data_view()({
      domain: "tasks",
      prefix: "wbt",
      tables: ["task", "task_node"],
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
    var React = require("react");
    var createHighlight = require_highlight()(React);
    var h = React.createElement;
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
        function card(action) {
          var rows = paramRows(action);
          var examples = Array.isArray(action.examples) ? action.examples : [];
          return h(
            "div",
            { className: P + "-card", key: action.name },
            h(
              "div",
              { className: P + "-cardhead" },
              h("code", { className: P + "-mono" }, Highlight.hit(action.name, kw)),
              h("span", { className: P + "-badge" }, action.domain),
              h("span", { className: P + "-badge" }, rows.length ? t.paramCount(rows.length) : t.noParams),
              rows.some(function(row) {
                return row.required;
              }) ? h("span", { className: P + "-badge " + P + "-req" }, t.required) : null
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

// packages/addons/tasks/client/views/actions.cjs
var require_actions = __commonJS({
  "packages/addons/tasks/client/views/actions.cjs"(exports2, module2) {
    "use strict";
    module2.exports = require_action_schema_view()({
      domain: "tasks",
      prefix: "wbt"
    });
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

// packages/addons/tasks/client/ui/copy.cjs
var require_copy = __commonJS({
  "packages/addons/tasks/client/ui/copy.cjs"(exports2, module2) {
    "use strict";
    var bodyCopy = require_body_copy();
    module2.exports = {
      zh: {
        timelineTasks: "\u4EFB\u52A1\u6570",
        timelineActivity: "\u6700\u8FD1\u6D3B\u52A8",
        timelineMerge: "\u5408\u5E76",
        timelineSingletons: "\u5305\u542B\u7A7A\u7EBF\u548C\u5355\u4EFB\u52A1\u65F6\u95F4\u7EBF",
        timelineSearch: "\u641C\u7D22\u65F6\u95F4\u7EBF\u6807\u9898\u6216\u63CF\u8FF0",
        timelineSearchButton: "\u641C\u7D22",
        timelineMembers: "\u6210\u5458\u4EFB\u52A1",
        timelineOrder: "\u6309\u53D1\u5E03\u65F6\u95F4\u6B63\u5E8F\u6392\u5217\uFF0C\u70B9\u51FB\u4EFB\u52A1\u6253\u5F00\u8BE6\u60C5",
        timelineSearchEmpty: "\u6CA1\u6709\u627E\u5230\u5305\u542B \u201C{query}\u201D \u7684\u65F6\u95F4\u7EBF",
        timelineEmpty: "\u6682\u65E0\u65F6\u95F4\u7EBF\uFF0C\u53EF\u70B9\u51FB\u201C\u65B0\u5EFA\u65F6\u95F4\u7EBF\u201D\u624B\u52A8\u5EFA\u7ACB\u3002",
        timelineOpen: "\u5F00\u542F",
        timelineDone: "\u5B8C\u6210",
        timelinePrevious: "\u4E0A\u4E00\u9875",
        timelineNext: "\u4E0B\u4E00\u9875",
        timelineTarget: "\u5408\u5E76\u5230\u65F6\u95F4\u7EBF",
        timelineMergeHint: "\u9009\u4E2D\u65F6\u95F4\u7EBF\u7684\u5168\u90E8\u6709\u6548\u4EFB\u52A1\u5C06\u5F52\u5E76\u5230\u76EE\u6807\u65F6\u95F4\u7EBF\uFF0C\u5305\u542B\u5F53\u524D\u9875\u5916\u7684\u4EFB\u52A1\uFF0C\u6392\u9664\u5DF2\u91CD\u542F\u548C\u5DF2\u5220\u9664\u4EFB\u52A1\u3002\u8BF7\u5148\u9884\u89C8\u518D\u786E\u8BA4\u3002",
        timelinePreview: "\u9884\u89C8\u5408\u5E76",
        timelinePreviewCount: "\u5C06\u79FB\u52A8 {n} \u6761\u4EFB\u52A1\u5230\u76EE\u6807\u65F6\u95F4\u7EBF\u3002",
        timelineConfirm: "\u786E\u8BA4\u5408\u5E76",
        bodyModeToggle: bodyCopy.zh.bodyModeToggle,
        bodyMode: "\u63CF\u8FF0\u4E0E\u611F\u53D7\u663E\u793A\u6A21\u5F0F",
        markdown: "Markdown \u6E32\u67D3",
        plainText: "\u7EAF\u6587\u672C",
        bodyModeLocal: "\u5DF2\u5728\u5F53\u524D\u6D4F\u89C8\u5668\u5207\u6362\uFF0C\u914D\u7F6E\u4FDD\u5B58\u5931\u8D25\uFF1A",
        title: "\u4EFB\u52A1",
        search: "\u641C\u7D22\u6807\u9898 / \u63CF\u8FF0 / \u611F\u53D7",
        newTask: "\u65B0\u5EFA\u4EFB\u52A1",
        tree: "\u4EFB\u52A1\u6811",
        select: "\u9009\u62E9",
        cancelSelect: "\u9000\u51FA\u9009\u62E9",
        list: "\u5217\u8868",
        card: "\u5361\u7247",
        all: "\u5168\u90E8",
        empty: "\u8FD9\u4E2A\u89C6\u56FE\u8FD8\u6CA1\u6709\u4EFB\u52A1",
        loading: "\u52A0\u8F7D\u4E2D\u2026",
        error: "\u64CD\u4F5C\u5931\u8D25\uFF1A",
        save: "\u4FDD\u5B58",
        cancel: "\u53D6\u6D88",
        create: "\u521B\u5EFA",
        close: "\u5173\u95ED",
        addGroup: "\u65B0\u5EFA\u7EC4",
        addTable: "\u65B0\u5EFA\u8868",
        rename: "\u91CD\u547D\u540D",
        del: "\u5220\u9664",
        editGroup: "\u7F16\u8F91\u4EFB\u52A1\u7EC4",
        editTable: "\u7F16\u8F91\u4EFB\u52A1\u8868",
        nodeName: "\u540D\u79F0",
        nodeDesc: "\u63CF\u8FF0\uFF08\u53EF\u9009\uFF09",
        nodeDescPh: "\u5199\u6E05\u8FD9\u5F20\u8868\u662F\u505A\u4EC0\u4E48\u7684\uFF0C\u4EE5\u540E\u53EF\u6309\u63CF\u8FF0\u5173\u952E\u8BCD\u68C0\u7D22\u5B9A\u4F4D",
        needName: "\u540D\u79F0\u4E0D\u80FD\u4E3A\u7A7A",
        nodeDescSave: "\u63CF\u8FF0\u5DF2\u4FDD\u5B58",
        editTitle: "\u7F16\u8F91\u4EFB\u52A1",
        deleteConfirm: "\u786E\u5B9A\u5220\u9664\u8FD9\u4E2A\u8282\u70B9\u53CA\u5176\u5B50\u6811\uFF1F\u5B50\u6811\u4E2D\u7684\u4EFB\u52A1\u4F1A\u88AB\u8F6F\u5220\u9664\u3002",
        deleteTaskConfirm: "\u786E\u5B9A\u5220\u9664\u8FD9\u6761\u4EFB\u52A1\u5417\uFF1F\u5220\u9664\u540E\u4E0D\u53EF\u6062\u590D\u3002",
        batchDelete: "\u6279\u91CF\u5220\u9664",
        batchDeleteConfirm: "\u786E\u5B9A\u5220\u9664\u9009\u4E2D\u7684 {n} \u6761\u4EFB\u52A1\u5417\uFF1F\u5220\u9664\u540E\u4E0D\u53EF\u6062\u590D\u3002",
        deletePartial: "\u90E8\u5206\u5220\u9664\u5931\u8D25",
        claimSelected: "\u63A5\u53D6\u9009\u4E2D",
        claimSummary: "\u6210\u529F {ok} \u6761\uFF1B\u5931\u8D25 {fail} \u6761\uFF1A\u5DF2\u88AB\u63A5\u53D6 {already}\u3001\u72B6\u6001\u4E0D\u652F\u6301 {notClaimable}\u3001\u4E0D\u5B58\u5728 {missing}",
        claimedCount: "\u5DF2\u63A5\u53D6 {n} \u6761\u4EFB\u52A1",
        root: "\u5168\u90E8\u4EFB\u52A1\u7EC4",
        manager: "\u7BA1\u7406\u6A21\u5F0F",
        treeSearch: "\u641C\u7D22\u4EFB\u52A1\u7EC4 / \u4EFB\u52A1\u8868",
        treeHint: "\u70B9\u4EFB\u52A1\u8868\u7B5B\u9009\u4EFB\u52A1\uFF1B\u7BA1\u7406\u6A21\u5F0F\u53EF\u62D6\u62FD\u6392\u5E8F\u3001\u6539\u540D\u6216\u5220\u9664",
        groups: "\u4E2A\u4EFB\u52A1\u7EC4",
        tables: "\u5F20\u4EFB\u52A1\u8868",
        treeNoMatch: "\u6CA1\u6709\u5339\u914D\u7684\u8282\u70B9",
        tags: "\u6807\u7B7E",
        tagsHint: "\u7528\u6807\u7B7E\u5F52\u7C7B\uFF08\u5DE5\u4F5C/\u751F\u6D3B/\u5B66\u4E60/\u5F00\u53D1 \u5DF2\u662F\u6807\u7B7E\uFF09",
        tagPlaceholder: "\u591A\u4E2A\u6807\u7B7E\u7528\u9017\u53F7\u5206\u9694\uFF0C\u4F8B\u5982\uFF1A\u5DE5\u4F5C, \u5F00\u53D1",
        tagFilter: "\u6807\u7B7E\u7B5B\u9009",
        allTags: "\u5168\u90E8\u6807\u7B7E",
        noTags: "\u6682\u65E0\u6807\u7B7E",
        tagSearchPlaceholder: "\u641C\u7D22\u6807\u7B7E\u540D\u79F0",
        tagNoMatch: "\u6CA1\u6709\u5339\u914D\u7684\u6807\u7B7E",
        loadingMore: "\u52A0\u8F7D\u4E2D\u2026",
        noMore: "\u6CA1\u6709\u66F4\u591A",
        tagSelected: "\u5DF2\u9009",
        tagRemove: "\u79FB\u9664",
        workspaceFilter: "\u5DE5\u4F5C\u533A\u7B5B\u9009",
        allWorkspaces: "\u5168\u90E8\u5DE5\u4F5C\u533A",
        noWorkspaces: "\u6682\u65E0\u5DE5\u4F5C\u533A",
        noWorkspace: "\u672A\u5173\u8054\u5DE5\u4F5C\u533A",
        workspaceSearchPlaceholder: "\u641C\u7D22\u5DE5\u4F5C\u533A\u540D\u79F0",
        workspaceNoMatch: "\u6CA1\u6709\u5339\u914D\u7684\u5DE5\u4F5C\u533A",
        workspaceSelected: "\u5DF2\u9009\u5DE5\u4F5C\u533A",
        workspaceRemove: "\u79FB\u9664",
        untagged: "\u672A\u6253\u6807\u7B7E",
        publish: "\u53D1\u5E03",
        target: "\u8BA1\u5212\u5B8C\u6210",
        done: "\u5B9E\u9645\u5B8C\u6210",
        shutdown: "\u5173\u95ED\u65F6\u95F4",
        priority: "\u4F18\u5148\u7EA7",
        difficulty: "\u96BE\u5EA6",
        desc: "\u63CF\u8FF0",
        difficultyUnset: "\u672A\u8BBE\u7F6E",
        difficultyMissing: "\u4EC5\u672A\u586B\u96BE\u5EA6",
        difficultyUnsetHint: "\u4E0D\u586B=\u672A\u8BBE\u7F6E\uFF080\uFF09\uFF0C\u4E0D\u662F\u6700\u7B80\u5355\uFF1B\u5EFA\u8BAE\u586B\u5199 1\u20135",
        difficultyGuideTitle: "\u5982\u4F55\u5224\u65AD\u96BE\u5EA6",
        difficultyGuide: "1\uFF1A\u6587\u6848/\u6837\u5F0F\u7B49\u5355\u70B9\u5C0F\u6539\uFF1B2\uFF1A\u5355\u6A21\u5757\u5185\u5C40\u90E8\u529F\u80FD\uFF1B3\uFF1A\u8DE8 2\u20133 \u4E2A\u6A21\u5757\u6216\u6570\u636E\u8BFB\u53D6\u53D8\u66F4\uFF1B4\uFF1A\u5B58\u50A8\u3001\u8FC1\u79FB\u3001\u540C\u6B65\u6216\u6784\u5EFA\u94FE\u8DEF\uFF1B5\uFF1A\u8DE8\u8FDB\u7A0B\u67B6\u6784\u91CD\u6784\u6216\u591A\u9636\u6BB5\u9A8C\u8BC1\u3002\u7ED3\u5408\u6539\u52A8\u6587\u4EF6\u6570\u3001\u662F\u5426\u6D89\u53CA\u6570\u636E\u8FC1\u79FB\u548C\u6D4B\u8BD5\u9762\u5224\u65AD\u3002",
        review: "\u611F\u53D7",
        reviewHint: "\u4EFB\u4F55\u72B6\u6001\u90FD\u53EF\u8BB0\u5F55\u611F\u53D7\uFF08\u53EF\u9009\uFF09",
        reviewPlaceholder: "\u4F8B\u5982\uFF1A\u601D\u8DEF\u5F88\u987A / \u5361\u5728\u63A5\u53E3\u8C03\u8BD5 / \u6BD4\u9884\u60F3\u8F7B\u677E",
        reviewAdd: "\u8BB0\u5F55\u611F\u53D7",
        status: "\u72B6\u6001",
        publishDate: "\u53D1\u5E03\u65E5\u671F",
        targetDate: "\u8BA1\u5212\u5B8C\u6210\u65E5\u671F",
        doneDate: "\u5B8C\u6210\u65E5\u671F",
        shutdownDate: "\u5173\u95ED\u65E5\u671F",
        table: "\u4EFB\u52A1\u8868",
        titleField: "\u6807\u9898",
        timeline: "\u65F6\u95F4\u7EBF",
        restart: "\u91CD\u542F",
        complete: "\u5B8C\u6210",
        shutdownOp: "\u5173\u95ED",
        selected: "\u5DF2\u9009",
        selectedTasks: "\u9009\u4E2D\u4EFB\u52A1",
        batchTimeline: "\u5F52\u5E76\u65F6\u95F4\u7EBF",
        batchMigrate: "\u8FC1\u79FB\u4EFB\u52A1\u8868",
        refresh: "\u5237\u65B0",
        clear: "\u6E05\u7A7A",
        chooseBase: "\u9009\u62E9\u57FA\u51C6\u4EFB\u52A1\uFF08\u4F7F\u7528\u5B83\u7684\u65F6\u95F4\u7EBF\uFF09",
        chooseTable: "\u9009\u62E9\u76EE\u6807\u4EFB\u52A1\u8868",
        searchTable: "\u641C\u7D22\u4EFB\u52A1\u8868",
        noTable: "\u6CA1\u6709\u5339\u914D\u7684\u4EFB\u52A1\u8868",
        baseLabel: "\u57FA\u51C6\u4EFB\u52A1",
        targetLabel: "\u76EE\u6807\u4EFB\u52A1\u8868",
        batchCount: "\u5DF2\u9009",
        hasTimeline: "\u6709\u65F6\u95F4\u7EBF",
        noTimelineTag: "\u65E0\u65F6\u95F4\u7EBF",
        group: "\u4EFB\u52A1\u7EC4",
        timelineTitle: "\u4EFB\u52A1\u65F6\u95F4\u7EBF",
        newTimeline: "\u65B0\u5EFA\u65F6\u95F4\u7EBF\u4EFB\u52A1",
        restartTitle: "\u91CD\u542F\u4EFB\u52A1",
        noTimeline: "\u6CA1\u6709\u5173\u8054\u65F6\u95F4\u7EBF",
        restartPriorityHint: "\u91CD\u542F\u4EFB\u52A1\u9700\u8981\u4F18\u5148\u7EA7 1\u201310\uFF0C0 \u4EC5\u7528\u4E8E\u5DF2\u5B8C\u6210/\u5DF2\u5173\u95ED",
        restartPriorityError: "\u91CD\u542F\u4EFB\u52A1\u7684\u4F18\u5148\u7EA7\u5FC5\u987B\u586B\u5199 1\u201310\uFF1B0 \u4EC5\u7528\u4E8E\u5DF2\u5B8C\u6210/\u5DF2\u5173\u95ED",
        activePriorityError: "\u5DF2\u5F00\u542F\u4EFB\u52A1\u7684\u4F18\u5148\u7EA7\u5FC5\u987B\u586B\u5199 1\u201310\uFF1B0 \u4EC5\u7528\u4E8E\u5DF2\u5B8C\u6210/\u5DF2\u5173\u95ED",
        confirm: "\u786E\u5B9A",
        difficultyHint: "\u5EFA\u8BAE\u5B8C\u6210\u524D\u586B\u5199 1\u20135 \u96BE\u5EA6\uFF1B0 \u4F1A\u7EDF\u8BA1\u4E3A\u672A\u8BBE\u7F6E",
        emptyTree: "\u4EFB\u52A1\u6811\u8FD8\u6CA1\u6709\u6570\u636E",
        appear: "\u663E\u793A",
        hide: "\u9690\u85CF",
        move: "\u79FB\u52A8\u5230",
        source: "\u6765\u6E90",
        page: "\u9875",
        total: "\u5171",
        items: "\u6761",
        doneSuccess: "\u5DF2\u5B8C\u6210",
        saved: "\u5DF2\u4FDD\u5B58",
        created: "\u5DF2\u521B\u5EFA",
        updated: "\u5DF2\u66F4\u65B0",
        edit: "\u7F16\u8F91",
        editTitle: "\u7F16\u8F91\u4EFB\u52A1",
        editHintDone: "\u5DF2\u5B8C\u6210\uFF1A\u6807\u9898\u3001\u63CF\u8FF0\u3001\u611F\u53D7\u3001\u96BE\u5EA6\u53EF\u6539\uFF1B\u4F18\u5148\u7EA7\u5728\u5B8C\u6210\u65F6\u5DF2\u6E05\u96F6\u3002",
        editHintOpen: "\u672A\u5B8C\u6210\uFF1A\u6807\u9898\u3001\u63CF\u8FF0\u3001\u4F18\u5148\u7EA7\u3001\u611F\u53D7\u548C\u96BE\u5EA6\u53EF\u6539\u3002",
        deleted: "\u5DF2\u5220\u9664",
        needTitle: "\u6807\u9898\u4E0D\u80FD\u4E3A\u7A7A",
        needTable: "\u8BF7\u9009\u62E9\u4EFB\u52A1\u8868",
        needDate: "\u65E5\u671F\u4E0D\u80FD\u4E3A\u7A7A",
        needBase: "\u8BF7\u9009\u62E9\u57FA\u51C6\u4EFB\u52A1",
        needDifficulty: "\u8BF7\u9009\u62E9\u96BE\u5EA6"
      },
      en: {
        timelineTasks: "Tasks",
        timelineActivity: "Last activity",
        timelineMerge: "Merge",
        timelineSingletons: "Include empty and single-task timelines",
        timelineSearch: "Search timeline titles or descriptions",
        timelineSearchButton: "Search",
        timelineMembers: "Member tasks",
        timelineOrder: "Oldest publication first. Click a task to open details.",
        timelineSearchEmpty: "No timelines contain \u201C{query}\u201D.",
        timelineEmpty: "No timelines yet. Use New timeline to create one manually.",
        timelineOpen: "Open",
        timelineDone: "Done",
        timelinePrevious: "Previous page",
        timelineNext: "Next page",
        timelineTarget: "Merge into timeline",
        timelineMergeHint: "Merge all valid tasks in the selected timelines, including tasks beyond the current page and excluding restarted and deleted tasks. Preview before confirming.",
        timelinePreview: "Preview merge",
        timelinePreviewCount: "{n} tasks will move into the target timeline.",
        timelineConfirm: "Confirm merge",
        bodyModeToggle: bodyCopy.en.bodyModeToggle,
        bodyMode: "Description and reflection display mode",
        markdown: "Render Markdown",
        plainText: "Plain text",
        bodyModeLocal: "Changed in this browser; could not save config:",
        title: "Tasks",
        search: "Search title / description / feeling",
        newTask: "New task",
        tree: "Task tree",
        select: "Select",
        cancelSelect: "Exit select",
        list: "List",
        card: "Cards",
        all: "All",
        empty: "No tasks in this view",
        loading: "Loading\u2026",
        error: "Failed: ",
        save: "Save",
        cancel: "Cancel",
        create: "Create",
        close: "Close",
        addGroup: "New group",
        addTable: "New table",
        rename: "Rename",
        del: "Delete",
        editGroup: "Edit group",
        editTable: "Edit table",
        nodeName: "Name",
        nodeDesc: "Description (optional)",
        nodeDescPh: "Say what this table is for; agents can find it by description keywords",
        needName: "Name is required",
        nodeDescSave: "Description saved",
        editTitle: "Edit task",
        deleteConfirm: "Delete this node and its subtree? Tasks under it will be soft-deleted.",
        deleteTaskConfirm: "Delete this task? This cannot be undone.",
        batchDelete: "Delete",
        batchDeleteConfirm: "Delete {n} selected tasks? This cannot be undone.",
        deletePartial: "some deletes failed",
        claimSelected: "Claim",
        claimSummary: "Claimed {ok}; failed {fail}: already claimed {already}, not claimable {notClaimable}, missing {missing}",
        claimedCount: "Claimed {n} task(s)",
        root: "All tasks",
        manager: "Manage",
        treeSearch: "Search groups / tables",
        treeHint: "Pick a table to filter tasks; Manage mode allows drag, rename and delete",
        groups: "groups",
        tables: "tables",
        treeNoMatch: "No matching node",
        tags: "Tags",
        tagsHint: "Group tasks with tags (Work/Life/Study/Dev are tags now)",
        tagPlaceholder: "Comma separated, e.g. Work, Dev",
        tagFilter: "Filter by tag",
        allTags: "All tags",
        noTags: "No tags",
        tagSearchPlaceholder: "Search tag name",
        tagNoMatch: "No matching tag",
        loadingMore: "Loading\u2026",
        noMore: "No more",
        tagSelected: "Selected",
        tagRemove: "Remove",
        workspaceFilter: "Filter by workspace",
        allWorkspaces: "All workspaces",
        noWorkspaces: "No workspaces",
        noWorkspace: "No workspace",
        workspaceSearchPlaceholder: "Search workspace name",
        workspaceNoMatch: "No matching workspace",
        workspaceSelected: "Selected workspaces",
        workspaceRemove: "Remove",
        untagged: "Untagged",
        publish: "Published",
        target: "Target",
        done: "Done",
        shutdown: "Closed",
        priority: "Priority",
        difficulty: "Difficulty",
        desc: "Description",
        difficultyUnset: "Unset",
        difficultyMissing: "Missing difficulty only",
        difficultyUnsetHint: "Blank = unset (0), not easiest; choose 1\u20135",
        difficultyGuideTitle: "How to rate difficulty",
        difficultyGuide: "1: a small copy/style change; 2: a local feature in one module; 3: 2\u20133 modules or data-reading changes; 4: storage, migrations, sync or build pipelines; 5: cross-process architecture changes or multi-stage validation. Consider changed file count, data migrations and test scope.",
        review: "Reflection",
        reviewHint: "Record a feeling in any status (optional)",
        reviewPlaceholder: "e.g. smooth, stuck on the API, easier than expected",
        reviewAdd: "Add feeling",
        status: "Status",
        publishDate: "Publish date",
        targetDate: "Target date",
        doneDate: "Done date",
        shutdownDate: "Close date",
        table: "Task table",
        titleField: "Title",
        timeline: "Timeline",
        restart: "Restart",
        complete: "Complete",
        shutdownOp: "Close",
        selected: "Selected",
        selectedTasks: "Selected tasks",
        batchTimeline: "Merge timeline",
        batchMigrate: "Move table",
        refresh: "Refresh",
        clear: "Clear",
        searchTable: "Search tables",
        noTable: "No matching table",
        baseLabel: "Base task",
        targetLabel: "Target table",
        batchCount: "Selected",
        hasTimeline: "has timeline",
        noTimelineTag: "no timeline",
        group: "Group",
        chooseBase: "Choose a base task (it supplies the timeline)",
        chooseTable: "Choose target table",
        timelineTitle: "Task timeline",
        newTimeline: "New timeline task",
        restartTitle: "Restart task",
        noTimeline: "No associated timeline",
        restartPriorityHint: "Restarted tasks require priority 1\u201310; 0 is only for completed or closed tasks.",
        restartPriorityError: "Enter a priority from 1 to 10 to restart; 0 is only for completed or closed tasks.",
        activePriorityError: "Active tasks require a priority from 1 to 10; 0 is only for completed or closed tasks.",
        confirm: "OK",
        difficultyHint: "Set difficulty 1\u20135 before completing; 0 is counted as unset",
        emptyTree: "Task tree is empty",
        appear: "Show",
        hide: "Hide",
        move: "Move to",
        source: "Source",
        page: "Page",
        total: "Total",
        items: "items",
        doneSuccess: "Completed",
        saved: "Saved",
        created: "Created",
        updated: "Updated",
        edit: "Edit",
        editTitle: "Edit task",
        editHintDone: "Completed: title, description, feeling and difficulty can change; priority was cleared on completion.",
        editHintOpen: "Not completed: title, description, priority, feeling and difficulty can change.",
        deleted: "Deleted",
        needTitle: "Title is required",
        needTable: "Pick a task table",
        needDate: "Date is required",
        needBase: "Pick a base task",
        needDifficulty: "Pick a difficulty"
      }
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

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/sliders-horizontal.mjs
var sliders_horizontal_exports = {};
__export(sliders_horizontal_exports, {
  __iconData: () => __iconData,
  default: () => SlidersHorizontal
});
var __iconData, SlidersHorizontal;
var init_sliders_horizontal = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/sliders-horizontal.mjs"() {
    init_createLucideIcon();
    __iconData = {
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
    __iconData.node;
    SlidersHorizontal = createLucideIcon(__iconData);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/chart-column.mjs
var chart_column_exports = {};
__export(chart_column_exports, {
  __iconData: () => __iconData2,
  default: () => ChartColumn
});
var __iconData2, ChartColumn;
var init_chart_column = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/chart-column.mjs"() {
    init_createLucideIcon();
    __iconData2 = {
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
    __iconData2.node;
    ChartColumn = createLucideIcon(__iconData2);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/settings.mjs
var settings_exports = {};
__export(settings_exports, {
  __iconData: () => __iconData3,
  default: () => Settings
});
var __iconData3, Settings;
var init_settings = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/settings.mjs"() {
    init_createLucideIcon();
    __iconData3 = {
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
    __iconData3.node;
    Settings = createLucideIcon(__iconData3);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/database.mjs
var database_exports = {};
__export(database_exports, {
  __iconData: () => __iconData4,
  default: () => Database
});
var __iconData4, Database;
var init_database = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/database.mjs"() {
    init_createLucideIcon();
    __iconData4 = {
      name: "database",
      size: 24,
      node: [
        ["ellipse", { cx: "12", cy: "5", rx: "9", ry: "3", key: "msslwz" }],
        ["path", { d: "M3 5V19A9 3 0 0 0 21 19V5", key: "1wlel7" }],
        ["path", { d: "M3 12A9 3 0 0 0 21 12", key: "mv7ke4" }]
      ]
    };
    __iconData4.node;
    Database = createLucideIcon(__iconData4);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/calendar-days.mjs
var calendar_days_exports = {};
__export(calendar_days_exports, {
  __iconData: () => __iconData5,
  default: () => CalendarDays
});
var __iconData5, CalendarDays;
var init_calendar_days = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/calendar-days.mjs"() {
    init_createLucideIcon();
    __iconData5 = {
      name: "calendar-days",
      size: 24,
      node: [
        ["path", { d: "M8 2v3", key: "1ioesn" }],
        ["path", { d: "M16 2v3", key: "otl347" }],
        ["rect", { x: "3", y: "3", width: "18", height: "18", rx: "2", key: "h1oib" }],
        ["path", { d: "M3 9h18", key: "1pudct" }],
        ["path", { d: "M8 13h.01", key: "1sbv64" }],
        ["path", { d: "M12 13h.01", key: "y0uutt" }],
        ["path", { d: "M16 13h.01", key: "wip0gl" }],
        ["path", { d: "M8 17h.01", key: "p3bg7i" }],
        ["path", { d: "M12 17h.01", key: "p32p05" }],
        ["path", { d: "M16 17h.01", key: "ql8jdd" }]
      ]
    };
    __iconData5.node;
    CalendarDays = createLucideIcon(__iconData5);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/code-xml.mjs
var code_xml_exports = {};
__export(code_xml_exports, {
  __iconData: () => __iconData6,
  default: () => CodeXml
});
var __iconData6, CodeXml;
var init_code_xml = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/code-xml.mjs"() {
    init_createLucideIcon();
    __iconData6 = {
      name: "code-xml",
      size: 24,
      node: [
        ["path", { d: "m18 16 4-4-4-4", key: "1inbqp" }],
        ["path", { d: "m6 8-4 4 4 4", key: "15zrgr" }],
        ["path", { d: "m14.5 4-5 16", key: "e7oirm" }]
      ],
      aliases: ["code-2"]
    };
    __iconData6.node;
    CodeXml = createLucideIcon(__iconData6);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/terminal.mjs
var terminal_exports = {};
__export(terminal_exports, {
  __iconData: () => __iconData7,
  default: () => Terminal
});
var __iconData7, Terminal;
var init_terminal = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/terminal.mjs"() {
    init_createLucideIcon();
    __iconData7 = {
      name: "terminal",
      size: 24,
      node: [
        ["path", { d: "M12 19h8", key: "baeox8" }],
        ["path", { d: "m4 17 6-6-6-6", key: "1yngyt" }]
      ]
    };
    __iconData7.node;
    Terminal = createLucideIcon(__iconData7);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/pilcrow.mjs
var pilcrow_exports = {};
__export(pilcrow_exports, {
  __iconData: () => __iconData8,
  default: () => Pilcrow
});
var __iconData8, Pilcrow;
var init_pilcrow = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/pilcrow.mjs"() {
    init_createLucideIcon();
    __iconData8 = {
      name: "pilcrow",
      size: 24,
      node: [
        ["path", { d: "M13 4v16", key: "8vvj80" }],
        ["path", { d: "M17 4v16", key: "7dpous" }],
        ["path", { d: "M19 4H9.5a4.5 4.5 0 0 0 0 9H13", key: "sh4n9v" }]
      ]
    };
    __iconData8.node;
    Pilcrow = createLucideIcon(__iconData8);
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

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/minus.mjs
var minus_exports = {};
__export(minus_exports, {
  __iconData: () => __iconData10,
  default: () => Minus
});
var __iconData10, Minus;
var init_minus = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/minus.mjs"() {
    init_createLucideIcon();
    __iconData10 = {
      name: "minus",
      size: 24,
      node: [["path", { d: "M5 12h14", key: "1ays0h" }]]
    };
    __iconData10.node;
    Minus = createLucideIcon(__iconData10);
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

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/square.mjs
var square_exports = {};
__export(square_exports, {
  __iconData: () => __iconData12,
  default: () => Square
});
var __iconData12, Square;
var init_square = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/square.mjs"() {
    init_createLucideIcon();
    __iconData12 = {
      name: "square",
      size: 24,
      node: [["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" }]]
    };
    __iconData12.node;
    Square = createLucideIcon(__iconData12);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/rotate-ccw.mjs
var rotate_ccw_exports = {};
__export(rotate_ccw_exports, {
  __iconData: () => __iconData13,
  default: () => RotateCcw
});
var __iconData13, RotateCcw;
var init_rotate_ccw = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/rotate-ccw.mjs"() {
    init_createLucideIcon();
    __iconData13 = {
      name: "rotate-ccw",
      size: 24,
      node: [
        ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", key: "1357e3" }],
        ["path", { d: "M3 3v5h5", key: "1xhq8a" }]
      ]
    };
    __iconData13.node;
    RotateCcw = createLucideIcon(__iconData13);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/list-tree.mjs
var list_tree_exports = {};
__export(list_tree_exports, {
  __iconData: () => __iconData14,
  default: () => ListTree
});
var __iconData14, ListTree;
var init_list_tree = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/list-tree.mjs"() {
    init_createLucideIcon();
    __iconData14 = {
      name: "list-tree",
      size: 24,
      node: [
        ["path", { d: "M8 5h13", key: "1pao27" }],
        ["path", { d: "M13 12h8", key: "h98zly" }],
        ["path", { d: "M13 19h8", key: "c3s6r1" }],
        ["path", { d: "M3 10a2 2 0 0 0 2 2h3", key: "1npucw" }],
        ["path", { d: "M3 5v12a2 2 0 0 0 2 2h3", key: "x1gjn2" }]
      ]
    };
    __iconData14.node;
    ListTree = createLucideIcon(__iconData14);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/folder-tree.mjs
var folder_tree_exports = {};
__export(folder_tree_exports, {
  __iconData: () => __iconData15,
  default: () => FolderTree
});
var __iconData15, FolderTree;
var init_folder_tree = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/folder-tree.mjs"() {
    init_createLucideIcon();
    __iconData15 = {
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
    __iconData15.node;
    FolderTree = createLucideIcon(__iconData15);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/search.mjs
var search_exports = {};
__export(search_exports, {
  __iconData: () => __iconData16,
  default: () => Search
});
var __iconData16, Search;
var init_search = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/search.mjs"() {
    init_createLucideIcon();
    __iconData16 = {
      name: "search",
      size: 24,
      node: [
        ["path", { d: "m21 21-4.34-4.34", key: "14j7rj" }],
        ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }]
      ]
    };
    __iconData16.node;
    Search = createLucideIcon(__iconData16);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/layout-grid.mjs
var layout_grid_exports = {};
__export(layout_grid_exports, {
  __iconData: () => __iconData17,
  default: () => LayoutGrid
});
var __iconData17, LayoutGrid;
var init_layout_grid = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/layout-grid.mjs"() {
    init_createLucideIcon();
    __iconData17 = {
      name: "layout-grid",
      size: 24,
      node: [
        ["rect", { width: "7", height: "7", x: "3", y: "3", rx: "1", key: "1g98yp" }],
        ["rect", { width: "7", height: "7", x: "14", y: "3", rx: "1", key: "6d4xhi" }],
        ["rect", { width: "7", height: "7", x: "14", y: "14", rx: "1", key: "nxv5o0" }],
        ["rect", { width: "7", height: "7", x: "3", y: "14", rx: "1", key: "1bb6yr" }]
      ]
    };
    __iconData17.node;
    LayoutGrid = createLucideIcon(__iconData17);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/list.mjs
var list_exports = {};
__export(list_exports, {
  __iconData: () => __iconData18,
  default: () => List
});
var __iconData18, List;
var init_list = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/list.mjs"() {
    init_createLucideIcon();
    __iconData18 = {
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
    __iconData18.node;
    List = createLucideIcon(__iconData18);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/square-check-big.mjs
var square_check_big_exports = {};
__export(square_check_big_exports, {
  __iconData: () => __iconData19,
  default: () => SquareCheckBig
});
var __iconData19, SquareCheckBig;
var init_square_check_big = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/square-check-big.mjs"() {
    init_createLucideIcon();
    __iconData19 = {
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
    __iconData19.node;
    SquareCheckBig = createLucideIcon(__iconData19);
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

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/folder.mjs
var folder_exports = {};
__export(folder_exports, {
  __iconData: () => __iconData22,
  default: () => Folder
});
var __iconData22, Folder;
var init_folder = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/folder.mjs"() {
    init_createLucideIcon();
    __iconData22 = {
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
    __iconData22.node;
    Folder = createLucideIcon(__iconData22);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/folder-open.mjs
var folder_open_exports = {};
__export(folder_open_exports, {
  __iconData: () => __iconData23,
  default: () => FolderOpen
});
var __iconData23, FolderOpen;
var init_folder_open = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/folder-open.mjs"() {
    init_createLucideIcon();
    __iconData23 = {
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
    __iconData23.node;
    FolderOpen = createLucideIcon(__iconData23);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/table-2.mjs
var table_2_exports = {};
__export(table_2_exports, {
  __iconData: () => __iconData24,
  default: () => Table2
});
var __iconData24, Table2;
var init_table_2 = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/table-2.mjs"() {
    init_createLucideIcon();
    __iconData24 = {
      name: "table-2",
      size: 24,
      node: [
        ["path", { d: "M3 9h18", key: "1pudct" }],
        ["path", { d: "M9 3v18", key: "fh3hqa" }],
        ["rect", { x: "3", y: "3", width: "18", height: "18", rx: "2", key: "h1oib" }]
      ]
    };
    __iconData24.node;
    Table2 = createLucideIcon(__iconData24);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/house.mjs
var house_exports = {};
__export(house_exports, {
  __iconData: () => __iconData25,
  default: () => House
});
var __iconData25, House;
var init_house = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/house.mjs"() {
    init_createLucideIcon();
    __iconData25 = {
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
    __iconData25.node;
    House = createLucideIcon(__iconData25);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/folder-plus.mjs
var folder_plus_exports = {};
__export(folder_plus_exports, {
  __iconData: () => __iconData26,
  default: () => FolderPlus
});
var __iconData26, FolderPlus;
var init_folder_plus = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/folder-plus.mjs"() {
    init_createLucideIcon();
    __iconData26 = {
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
    __iconData26.node;
    FolderPlus = createLucideIcon(__iconData26);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/file-plus.mjs
var file_plus_exports = {};
__export(file_plus_exports, {
  __iconData: () => __iconData27,
  default: () => FilePlus
});
var __iconData27, FilePlus;
var init_file_plus = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/file-plus.mjs"() {
    init_createLucideIcon();
    __iconData27 = {
      name: "file-plus",
      size: 24,
      node: [
        [
          "path",
          {
            d: "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",
            key: "1oefj6"
          }
        ],
        ["path", { d: "M14 2v5a1 1 0 0 0 1 1h5", key: "wfsgrz" }],
        ["path", { d: "M9 15h6", key: "cctwl0" }],
        ["path", { d: "M12 18v-6", key: "17g6i2" }]
      ]
    };
    __iconData27.node;
    FilePlus = createLucideIcon(__iconData27);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/pencil.mjs
var pencil_exports = {};
__export(pencil_exports, {
  __iconData: () => __iconData28,
  default: () => Pencil
});
var __iconData28, Pencil;
var init_pencil = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/pencil.mjs"() {
    init_createLucideIcon();
    __iconData28 = {
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
    __iconData28.node;
    Pencil = createLucideIcon(__iconData28);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/trash.mjs
var __iconData29, Trash;
var init_trash = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/trash.mjs"() {
    init_createLucideIcon();
    __iconData29 = {
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
    __iconData29.node;
    Trash = createLucideIcon(__iconData29);
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
  __iconData: () => __iconData30,
  default: () => X
});
var __iconData30, X;
var init_x = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/x.mjs"() {
    init_createLucideIcon();
    __iconData30 = {
      name: "x",
      size: 24,
      node: [
        ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
        ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
      ]
    };
    __iconData30.node;
    X = createLucideIcon(__iconData30);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/chevron-down.mjs
var chevron_down_exports = {};
__export(chevron_down_exports, {
  __iconData: () => __iconData31,
  default: () => ChevronDown
});
var __iconData31, ChevronDown;
var init_chevron_down = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/chevron-down.mjs"() {
    init_createLucideIcon();
    __iconData31 = {
      name: "chevron-down",
      size: 24,
      node: [["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]]
    };
    __iconData31.node;
    ChevronDown = createLucideIcon(__iconData31);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/tag.mjs
var tag_exports = {};
__export(tag_exports, {
  __iconData: () => __iconData32,
  default: () => Tag
});
var __iconData32, Tag;
var init_tag = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/tag.mjs"() {
    init_createLucideIcon();
    __iconData32 = {
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
    __iconData32.node;
    Tag = createLucideIcon(__iconData32);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/clock.mjs
var clock_exports = {};
__export(clock_exports, {
  __iconData: () => __iconData33,
  default: () => Clock
});
var __iconData33, Clock;
var init_clock = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/clock.mjs"() {
    init_createLucideIcon();
    __iconData33 = {
      name: "clock",
      size: 24,
      node: [
        ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
        ["path", { d: "M12 6v6l4 2", key: "mmk7yg" }]
      ]
    };
    __iconData33.node;
    Clock = createLucideIcon(__iconData33);
  }
});

// node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/refresh-cw.mjs
var refresh_cw_exports = {};
__export(refresh_cw_exports, {
  __iconData: () => __iconData34,
  default: () => RefreshCw
});
var __iconData34, RefreshCw;
var init_refresh_cw = __esm({
  "node_modules/.pnpm/lucide-react@1.70.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/refresh-cw.mjs"() {
    init_createLucideIcon();
    __iconData34 = {
      name: "refresh-cw",
      size: 24,
      node: [
        ["path", { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8", key: "v9h5vc" }],
        ["path", { d: "M21 3v5h-5", key: "1q7to0" }],
        ["path", { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16", key: "3uifl3" }],
        ["path", { d: "M8 16H3v5", key: "1cv678" }]
      ]
    };
    __iconData34.node;
    RefreshCw = createLucideIcon(__iconData34);
  }
});

// packages/addons/tasks/client/ui/icons.cjs
var require_icons = __commonJS({
  "packages/addons/tasks/client/ui/icons.cjs"(exports2, module2) {
    "use strict";
    var h = require("react").createElement;
    var ICONS = {
      "filter": (init_sliders_horizontal(), __toCommonJS(sliders_horizontal_exports)).default,
      "chart": (init_chart_column(), __toCommonJS(chart_column_exports)).default,
      "settings": (init_settings(), __toCommonJS(settings_exports)).default,
      "database": (init_database(), __toCommonJS(database_exports)).default,
      "calendar": (init_calendar_days(), __toCommonJS(calendar_days_exports)).default,
      "code-2": (init_code_xml(), __toCommonJS(code_xml_exports)).default,
      "terminal": (init_terminal(), __toCommonJS(terminal_exports)).default,
      "pilcrow": (init_pilcrow(), __toCommonJS(pilcrow_exports)).default,
      "plus": (init_plus(), __toCommonJS(plus_exports)).default,
      "minus": (init_minus(), __toCommonJS(minus_exports)).default,
      "check": (init_check(), __toCommonJS(check_exports)).default,
      "stop": (init_square(), __toCommonJS(square_exports)).default,
      "restart": (init_rotate_ccw(), __toCommonJS(rotate_ccw_exports)).default,
      "timeline": (init_list_tree(), __toCommonJS(list_tree_exports)).default,
      "tree": (init_folder_tree(), __toCommonJS(folder_tree_exports)).default,
      "search": (init_search(), __toCommonJS(search_exports)).default,
      "grid": (init_layout_grid(), __toCommonJS(layout_grid_exports)).default,
      "list": (init_list(), __toCommonJS(list_exports)).default,
      "select": (init_square_check_big(), __toCommonJS(square_check_big_exports)).default,
      "left": (init_chevron_left(), __toCommonJS(chevron_left_exports)).default,
      "right": (init_chevron_right(), __toCommonJS(chevron_right_exports)).default,
      "folder": (init_folder(), __toCommonJS(folder_exports)).default,
      "folderOpen": (init_folder_open(), __toCommonJS(folder_open_exports)).default,
      "table": (init_table_2(), __toCommonJS(table_2_exports)).default,
      "house": (init_house(), __toCommonJS(house_exports)).default,
      "folderPlus": (init_folder_plus(), __toCommonJS(folder_plus_exports)).default,
      "filePlus": (init_file_plus(), __toCommonJS(file_plus_exports)).default,
      "pencil": (init_pencil(), __toCommonJS(pencil_exports)).default,
      "trash": (init_trash_2(), __toCommonJS(trash_2_exports)).default,
      "close": (init_x(), __toCommonJS(x_exports)).default,
      "down": (init_chevron_down(), __toCommonJS(chevron_down_exports)).default,
      "tag": (init_tag(), __toCommonJS(tag_exports)).default,
      "clock": (init_clock(), __toCommonJS(clock_exports)).default,
      "refresh": (init_refresh_cw(), __toCommonJS(refresh_cw_exports)).default
    };
    function Icon2(props) {
      var C = ICONS[props.name];
      if (!C) return null;
      return h(C, { size: props.size || 14, strokeWidth: 2, "aria-hidden": "true", className: "wbt-svg" });
    }
    module2.exports = { ICONS, Icon: Icon2 };
  }
});

// packages/addons/tasks/client/views/workspace-view.cjs
var require_workspace_view = __commonJS({
  "packages/addons/tasks/client/views/workspace-view.cjs"(exports2, module2) {
    "use strict";
    module2.exports = function(deps) {
      var React = deps.React, h = React.createElement;
      var Icon2 = typeof deps.Icon === "function" ? deps.Icon : null;
      function icon(name, size) {
        return Icon2 ? h(Icon2, { name, size: size || 13 }) : null;
      }
      var COPY = {
        zh: {
          title: "\u5DE5\u4F5C\u533A",
          hint: "\u76EE\u5F55\u53EA\u4FDD\u5B58\u4E0E\u56DE\u663E\uFF0C\u4E0D\u6821\u9A8C\u662F\u5426\u5B58\u5728\uFF1B\u4EFB\u52A1\u6570\u53EF\u70B9\u5F00\u8BB0\u5F55\u9875",
          create: "\u65B0\u5EFA\u5DE5\u4F5C\u533A",
          search: "\u641C\u7D22\u6807\u9898\u3001\u6807\u8BC6\u3001\u76EE\u5F55\u4E0E\u63CF\u8FF0",
          refresh: "\u5237\u65B0",
          count: function(n) {
            return "\u5171 " + n + " \u4E2A";
          },
          match: function(n) {
            return "\u5339\u914D " + n + " \u4E2A";
          },
          tasks: function(n) {
            return n + " \u4E2A\u4EFB\u52A1";
          },
          noDir: "\u672A\u8BBE\u7F6E\u76EE\u5F55",
          edit: "\u7F16\u8F91",
          del: "\u5220\u9664",
          cancel: "\u53D6\u6D88",
          confirm: "\u786E\u8BA4\u5220\u9664",
          empty: "\u8FD8\u6CA1\u6709\u5DE5\u4F5C\u533A\u3002\u65B0\u5EFA\u4E00\u4E2A\uFF0C\u5C31\u80FD\u5728\u4EFB\u52A1\u91CC\u5173\u8054\u672C\u673A\u4F1A\u8BDD\u76EE\u5F55\u3002",
          noMatch: "\u6CA1\u6709\u5339\u914D\u7684\u5DE5\u4F5C\u533A\u3002",
          loading: "\u6B63\u5728\u8BFB\u53D6\u5DE5\u4F5C\u533A\u2026",
          error: "\u5DE5\u4F5C\u533A\u52A0\u8F7D\u5931\u8D25",
          retry: "\u91CD\u8BD5",
          formCreate: "\u65B0\u5EFA\u5DE5\u4F5C\u533A",
          formEdit: "\u7F16\u8F91\u5DE5\u4F5C\u533A",
          fTitle: "\u6807\u9898 *",
          fName: "\u6807\u8BC6\uFF08\u53EF\u7A7A\uFF09",
          fDir: "\u76EE\u5F55\uFF08\u672C\u673A\u7EDD\u5BF9\u8DEF\u5F84\uFF0C\u53EF\u7A7A\uFF09",
          fDesc: "\u63CF\u8FF0\uFF08\u53EF\u7A7A\uFF09",
          save: "\u4FDD\u5B58",
          titleRequired: "\u6807\u9898\u4E0D\u80FD\u4E3A\u7A7A",
          dirInvalid: "\u76EE\u5F55\u5FC5\u987B\u662F\u672C\u673A\u7EDD\u5BF9\u8DEF\u5F84\uFF08/ \u6216 X:\\\uFF09",
          created: "\u5DF2\u521B\u5EFA\u5DE5\u4F5C\u533A",
          updated: "\u5DF2\u66F4\u65B0\u5DE5\u4F5C\u533A",
          removed: "\u5DF2\u5220\u9664\u5DE5\u4F5C\u533A",
          deleteWithTasks: function(title, n) {
            return "\u5220\u9664\u300C" + title + "\u300D\uFF1F\u5B83\u5173\u8054\u4E86 " + n + " \u4E2A\u4EFB\u52A1\uFF0C\u5220\u9664\u540E\u8FD9\u4E9B\u4EFB\u52A1\u4F1A\u89E3\u9664\u5173\u8054\uFF0C\u4EFB\u52A1\u672C\u8EAB\u4E0D\u4F1A\u88AB\u5220\u9664\u3002";
          },
          deletePlain: function(title) {
            return "\u5220\u9664\u300C" + title + "\u300D\uFF1F\u6B64\u64CD\u4F5C\u4E0D\u53EF\u64A4\u9500\u3002";
          },
          openTasks: "\u5728\u8BB0\u5F55\u9875\u67E5\u770B\u8BE5\u5DE5\u4F5C\u533A\u7684\u4EFB\u52A1"
        },
        en: {
          title: "Workspaces",
          hint: "Directories are displayed only, never checked; click a task count to open Records",
          create: "New workspace",
          search: "Search title, name, directory and description",
          refresh: "Refresh",
          count: function(n) {
            return n + (n === 1 ? " workspace" : " workspaces");
          },
          match: function(n) {
            return n + " match" + (n === 1 ? "" : "es");
          },
          tasks: function(n) {
            return n + (n === 1 ? " task" : " tasks");
          },
          noDir: "No directory",
          edit: "Edit",
          del: "Delete",
          cancel: "Cancel",
          confirm: "Confirm delete",
          empty: "No workspaces yet. Create one to link local session directories to tasks.",
          noMatch: "No matching workspaces.",
          loading: "Loading workspaces\u2026",
          error: "Failed to load workspaces",
          retry: "Retry",
          formCreate: "New workspace",
          formEdit: "Edit workspace",
          fTitle: "Title *",
          fName: "Name (optional)",
          fDir: "Directory (absolute local path, optional)",
          fDesc: "Description (optional)",
          save: "Save",
          titleRequired: "Title is required",
          dirInvalid: "Directory must be an absolute local path (/ or X:\\)",
          created: "Workspace created",
          updated: "Workspace updated",
          removed: "Workspace deleted",
          deleteWithTasks: function(title, n) {
            return 'Delete "' + title + '"? ' + n + " task(s) will be unlinked; the tasks themselves are kept.";
          },
          deletePlain: function(title) {
            return 'Delete "' + title + '"? This cannot be undone.';
          },
          openTasks: "Open the tasks of this workspace in Records"
        }
      };
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
        ".wbt-ws-fields textarea.wbt-input{min-height:64px;resize:vertical;font:inherit}"
      ].join("");
      function result(r) {
        if (!r || !r.ok) throw new Error(r && r.error || "Request failed");
        return r.result || {};
      }
      function WorkspaceForm(props) {
        var t = props.t;
        var ws = props.workspace || {};
        var ss = React.useState({
          title: String(ws.title || ""),
          name: String(ws.name || ""),
          dir: String(ws.dir || ""),
          description: String(ws.description || "")
        });
        var draft = ss[0], setDraft = ss[1];
        var es = React.useState(""), err = es[0], setErr = es[1];
        var bs = React.useState(false), busy = bs[0], setBusy = bs[1];
        function field(key) {
          return function(event) {
            var value = event.target.value;
            setDraft(function(prev) {
              return Object.assign({}, prev, { [key]: value });
            });
          };
        }
        function submit() {
          var title = draft.title.trim();
          if (!title) {
            setErr(t.titleRequired);
            return;
          }
          var dir = draft.dir.trim();
          if (dir && !(/^\//.test(dir) || /^[A-Za-z]:[\\/]/.test(dir) || /^\\\\/.test(dir))) {
            setErr(t.dirInvalid);
            return;
          }
          setErr("");
          setBusy(true);
          var args = { title, name: draft.name.trim(), description: draft.description };
          if (props.mode === "edit") args.id = String(ws.id);
          args.dir = dir || null;
          props.api.call(props.mode === "edit" ? "taskWorkspaces.update" : "taskWorkspaces.create", args).then(function(r) {
            setBusy(false);
            try {
              result(r);
            } catch (e) {
              setErr(String(e && e.message || e));
              return;
            }
            props.onSaved(props.mode);
          }, function(e) {
            setBusy(false);
            setErr(String(e && e.message || e));
          });
        }
        return h(
          "div",
          { className: "wbt-modal-mask", role: "dialog", "aria-modal": "true", "aria-label": props.mode === "edit" ? t.formEdit : t.formCreate },
          h(
            "div",
            { className: "wbt-modal" },
            h("div", { className: "wbt-modal-head" }, h("h3", null, props.mode === "edit" ? t.formEdit : t.formCreate)),
            h(
              "div",
              { className: "wbt-ws-fields" },
              h("input", { className: "wbt-input", value: draft.title, placeholder: t.fTitle, "aria-label": t.fTitle, onChange: field("title") }),
              h("input", { className: "wbt-input", value: draft.name, placeholder: t.fName, "aria-label": t.fName, onChange: field("name") }),
              h("input", { className: "wbt-input", value: draft.dir, placeholder: t.fDir, "aria-label": t.fDir, onChange: field("dir") }),
              h("textarea", { className: "wbt-input", value: draft.description, placeholder: t.fDesc, "aria-label": t.fDesc, onChange: field("description") })
            ),
            err ? h("div", { className: "wbt-err", role: "alert" }, err) : null,
            h(
              "div",
              { className: "wbt-modal-foot" },
              h("button", { className: "wbt-btn primary", type: "button", disabled: busy, onClick: submit }, t.save),
              h("button", { className: "wbt-btn ghost", type: "button", onClick: props.onCancel }, t.cancel)
            )
          )
        );
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
        React.useEffect(function() {
          var cancelled = false;
          setBusy(true);
          setError("");
          api.call("taskWorkspaces.list", { pageSize: 100 }).then(result).then(function(r) {
            if (cancelled) return;
            setRecords(Array.isArray(r.records) ? r.records : []);
            setBusy(false);
          }).catch(function(e) {
            if (cancelled) return;
            setBusy(false);
            setError(String(e && e.message || e));
          });
          return function() {
            cancelled = true;
          };
        }, [api, tick]);
        React.useEffect(function() {
          if (!api || typeof api.subscribe !== "function") return void 0;
          var off = api.subscribe(function(p) {
            if (!p) return;
            if (p.event === "task-workspaces-changed" || p.event === "tasks-changed") setTick(function(n) {
              return n + 1;
            });
          });
          return off;
        }, [api]);
        React.useEffect(function() {
          if (!toast) return;
          var id = setTimeout(function() {
            setToast("");
          }, 2600);
          return function() {
            clearTimeout(id);
          };
        }, [toast]);
        function reload() {
          setTick(function(n) {
            return n + 1;
          });
        }
        function say(msg) {
          setToast(msg);
        }
        function openTasks(id) {
          if (typeof props.onNavigate === "function") props.onNavigate("tasks", { workspaceIds: [String(id)] });
        }
        function confirmDelete() {
          if (!ask) return;
          api.call("taskWorkspaces.delete", { id: String(ask.id) }).then(function(r) {
            try {
              result(r);
            } catch (e) {
              say(String(e && e.message || e));
              return;
            }
            setAsk(null);
            say(t.removed);
            reload();
          }, function(e) {
            say(String(e && e.message || e));
          });
        }
        var list = records || [];
        var keyword = query.trim().toLowerCase();
        var shown = list.filter(function(w) {
          if (!keyword) return true;
          return [w.title, w.name, w.dir, w.description].some(function(v) {
            return String(v || "").toLowerCase().indexOf(keyword) >= 0;
          });
        });
        function row(w) {
          var id = String(w.id), name = String(w.title || w.name || id);
          var count = Number(w.taskCount) || 0;
          return h(
            "article",
            { className: "wbt-item wbt-ws-row", key: id },
            h(
              "div",
              { className: "wbt-ws-main" },
              h(
                "div",
                { className: "wbt-ws-titleline" },
                h("span", { className: "wbt-ws-title" }, name),
                w.name && w.name !== w.title ? h("span", { className: "wbt-ws-name" }, String(w.name)) : null,
                h("button", {
                  className: "wbt-btn ghost",
                  type: "button",
                  title: t.openTasks,
                  "aria-label": t.openTasks + " " + name,
                  onClick: function() {
                    openTasks(id);
                  }
                }, icon("list"), t.tasks(count))
              ),
              h(
                "div",
                { className: "wbt-ws-dir" },
                w.dir ? h("code", null, String(w.dir)) : h("span", { className: "wbt-ws-nodir" }, t.noDir)
              ),
              w.description ? h("p", { className: "wbt-ws-desc" }, String(w.description)) : null,
              ask && String(ask.id) === id ? h(
                "div",
                { className: "wbt-ws-ask", role: "alert" },
                h("span", null, count ? t.deleteWithTasks(name, count) : t.deletePlain(name)),
                h("button", { className: "wbt-btn", type: "button", "data-danger": "1", onClick: confirmDelete }, icon("trash"), t.confirm),
                h("button", { className: "wbt-btn ghost", type: "button", onClick: function() {
                  setAsk(null);
                } }, t.cancel)
              ) : null
            ),
            h(
              "div",
              { className: "wbt-ws-ops" },
              h("button", { className: "wbt-btn ghost", type: "button", onClick: function() {
                setForm({ mode: "edit", workspace: w });
              } }, icon("pencil"), t.edit),
              h("button", { className: "wbt-btn ghost", type: "button", onClick: function() {
                setAsk({ id, title: name });
              } }, icon("trash"), t.del)
            )
          );
        }
        var body;
        if (busy) body = h("p", { className: "wbt-empty", role: "status" }, t.loading);
        else if (error) {
          body = h(
            "div",
            { className: "wbt-err", role: "alert" },
            h("div", null, t.error + "\uFF1A" + error),
            h("button", { className: "wbt-btn", type: "button", onClick: reload }, icon("refresh"), t.retry)
          );
        } else if (!list.length) body = h("p", { className: "wbt-empty", role: "status" }, t.empty);
        else if (!shown.length) body = h("p", { className: "wbt-empty", role: "status" }, t.noMatch);
        else body = shown.map(row);
        return h(
          "div",
          { className: "wbt-root wbt-ws" },
          h("style", null, CSS),
          h(
            "div",
            { className: "wbt-pathrow" },
            h(
              "div",
              { className: "wbt-ws-heading" },
              h("h2", { className: "wbt-ws-h2" }, t.title),
              h("span", { className: "wbt-ws-hint" }, t.hint)
            ),
            h("div", { className: "wbt-grow" }),
            toast ? h("span", { className: "wbt-ws-toast", "aria-live": "polite" }, toast) : null,
            h("button", { className: "wbt-btn ghost", type: "button", title: t.refresh, "aria-label": t.refresh, onClick: reload }, icon("refresh"), t.refresh),
            h("button", {
              className: "wbt-btn primary",
              type: "button",
              onClick: function() {
                setForm({ mode: "create", workspace: null });
              }
            }, icon("plus", 14), t.create)
          ),
          h(
            "div",
            { className: "wbt-ws-toolbar" },
            h("input", {
              className: "wbt-input",
              value: query,
              placeholder: t.search,
              "aria-label": t.search,
              onChange: function(e) {
                setQuery(e.target.value);
              }
            }),
            busy ? null : h("span", { className: "wbt-ws-count", role: "status" }, keyword ? t.count(list.length) + " \xB7 " + t.match(shown.length) : t.count(list.length))
          ),
          h(
            "div",
            { className: "wbt-content" },
            h("div", { className: "wbt-list-scroll" }, body)
          ),
          form ? h(WorkspaceForm, {
            api,
            t,
            mode: form.mode,
            workspace: form.workspace,
            onCancel: function() {
              setForm(null);
            },
            onSaved: function(mode) {
              setForm(null);
              say(mode === "edit" ? t.updated : t.created);
              reload();
            }
          }) : null
        );
      }
      return { WorkspaceView, CSS };
    };
  }
});

// packages/addons/tasks/client/views/commands.cjs
var require_commands = __commonJS({
  "packages/addons/tasks/client/views/commands.cjs"(exports2, module2) {
    "use strict";
    module2.exports = function(deps) {
      var React = deps.React, h = React.createElement;
      var Icon2 = deps.Icon, Body = deps.Body, BodyMode = deps.BodyMode;
      var bodyCopy = deps.bodyCopy || { zh: {}, en: {} };
      var BODY_DEFAULT = { "ui.bodyMode": "markdown" };
      var useConfig = deps.useConfig || function() {
        return { ready: true, values: BODY_DEFAULT };
      };
      var COPY = {
        zh: {
          title: "\u547D\u4EE4",
          hint: "\u53EA\u8BFB \xB7 \u6570\u636E\u6765\u81EA tasks.commands",
          loading: "\u6B63\u5728\u8BFB\u53D6\u547D\u4EE4\u76EE\u5F55\u2026",
          empty: "\u672C\u63D2\u4EF6\u8FD8\u6CA1\u6709\u6CE8\u518C\u659C\u6760\u547D\u4EE4\u3002",
          retry: "\u91CD\u8BD5",
          error: "\u547D\u4EE4\u76EE\u5F55\u52A0\u8F7D\u5931\u8D25",
          count: function(n) {
            return n + " \u6761\u547D\u4EE4";
          },
          usage: "\u7528\u6CD5",
          input: "\u8F93\u5165",
          examples: "\u793A\u4F8B",
          limit: "\u4E0A\u9650",
          attachments: "\u652F\u6301\u9644\u4EF6",
          noAttachments: "\u4E0D\u652F\u6301\u9644\u4EF6",
          notes: "\u8BF4\u660E",
          copy: "\u590D\u5236",
          copied: "\u5DF2\u590D\u5236",
          chars: function(n) {
            return "\u6700\u591A " + n + " \u5B57\u7B26";
          },
          template: "\u63D0\u793A\u8BCD\u6A21\u677F",
          templateHint: "\u53EA\u8BFB \xB7 \u9ED8\u8BA4\u6298\u53E0\uFF0C\u5C55\u5F00\u53EF\u770B\u5168\u6587\uFF1B{\u9700\u6C42\u63CF\u8FF0} \u6362\u6210\u4F60\u7684\u539F\u8BDD\uFF0C<sessionId> \u4E3A\u5F53\u524D\u4F1A\u8BDD id",
          copyTemplate: "\u590D\u5236\u6A21\u677F",
          bodyModeToggle: bodyCopy.zh.bodyModeToggle || "{field} \xB7 \u5F53\u524D\uFF1A{current}\uFF1B\u5207\u6362\u4E3A{target}",
          markdown: bodyCopy.zh.markdown || "Markdown \u6E32\u67D3",
          plainText: bodyCopy.zh.plainText || "\u7EAF\u6587\u672C"
        },
        en: {
          title: "Commands",
          hint: "Read-only \xB7 from tasks.commands",
          loading: "Loading command catalog\u2026",
          empty: "No slash commands registered yet.",
          retry: "Retry",
          error: "Failed to load command catalog",
          count: function(n) {
            return n + (n === 1 ? " command" : " commands");
          },
          usage: "Usage",
          input: "Input",
          examples: "Examples",
          limit: "Limit",
          attachments: "Attachments allowed",
          noAttachments: "No attachments",
          notes: "Notes",
          copy: "Copy",
          copied: "Copied",
          chars: function(n) {
            return "up to " + n + " characters";
          },
          template: "Prompt template",
          templateHint: "Read-only \xB7 collapsed by default; {requirement} is replaced by your words and <sessionId> by the current session id",
          copyTemplate: "Copy template",
          bodyModeToggle: bodyCopy.en.bodyModeToggle || "{field} \xB7 Current: {current}; switch to {target}",
          markdown: bodyCopy.en.markdown || "Rendered Markdown",
          plainText: bodyCopy.en.plainText || "Plain text"
        }
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
        ".wbt-cmd-body .wb-markdown,.wbt-cmd-body .wb-body-text{font-size:11.5px;line-height:1.55}"
      ].join("");
      function result(r) {
        if (!r || !r.ok) throw new Error(r && r.error || "Request failed");
        return r.result || {};
      }
      function CopyButton(p) {
        var s = React.useState(false), done = s[0], setDone = s[1];
        return h("button", {
          className: "wbt-btn",
          type: "button",
          title: p.t.copy,
          onClick: function() {
            var clip = typeof navigator !== "undefined" && navigator.clipboard;
            var write = clip && typeof clip.writeText === "function" ? clip.writeText(p.text) : Promise.reject(new Error("no clipboard"));
            write.then(function() {
              setDone(true);
              if (typeof p.onCopied === "function") p.onCopied(p.text);
              if (typeof setTimeout === "function") setTimeout(function() {
                setDone(false);
              }, 1200);
            }).catch(function() {
              setDone(false);
            });
          }
        }, done ? p.t.copied : p.t.copy);
      }
      function TemplateBlock(props) {
        var c = props.command, t = props.t;
        var text = typeof c.template === "string" ? c.template : "";
        var s = React.useState(props.mode === "text" ? "text" : "markdown"), mode = s[0], setMode = s[1];
        if (!text.trim()) return null;
        return h(
          "details",
          { className: "wbt-cmd-template" },
          h("summary", null, t.template),
          h("span", { className: "wbt-cmd-hint" }, t.templateHint),
          h(
            "div",
            { className: "wb-body-heading wbt-cmd-template-head" },
            h("span", { className: "wb-body-label" }, t.template),
            h(
              "span",
              { className: "wbt-cmd-bar" },
              h(BodyMode, { label: t.template, mode, onChange: setMode, t, Icon: Icon2 }),
              h(CopyButton, { t, text, onCopied: props.onCopied })
            )
          ),
          h("div", { className: "wbt-cmd-body" }, h(Body, { text, mode }))
        );
      }
      function CommandCard(props) {
        var c = props.command, t = props.t;
        var limit = c.limit && c.limit.max ? t.chars(c.limit.max) : "";
        return h(
          "article",
          { className: "wbt-cmd-card" },
          h(
            "div",
            { className: "wbt-cmd-name" },
            h("code", null, "/" + c.name),
            h("span", { className: "wbt-cmd-title" }, c.title.zh && t === COPY.zh ? c.title.zh : c.title.en || c.title.zh),
            h("span", { className: "wbt-cmd-badge" }, c.attachments ? t.attachments : t.noAttachments)
          ),
          h("p", { className: "wbt-cmd-summary" }, t === COPY.zh ? c.summary.zh : c.summary.en),
          h(
            "div",
            { className: "wbt-cmd-row" },
            h("span", { className: "wbt-cmd-label" }, t.usage),
            h("code", null, t === COPY.zh ? c.usage.zh : c.usage.en),
            h(CopyButton, { t, text: t === COPY.zh ? c.usage.zh : c.usage.en, onCopied: props.onCopied })
          ),
          h(
            "div",
            { className: "wbt-cmd-row" },
            h("span", { className: "wbt-cmd-label" }, t.input),
            h("code", null, t === COPY.zh ? c.inputHint.zh : c.inputHint.en)
          ),
          c.examples && c.examples.length ? h(
            "div",
            { className: "wbt-cmd-row", style: { alignItems: "flex-start" } },
            h("span", { className: "wbt-cmd-label" }, t.examples),
            h("ul", { className: "wbt-cmd-examples" }, c.examples.map(function(text, i) {
              return h(
                "li",
                { key: i },
                h("code", null, text),
                " ",
                h(CopyButton, { t, text, onCopied: props.onCopied })
              );
            }))
          ) : null,
          limit ? h("div", { className: "wbt-cmd-row" }, h("span", { className: "wbt-cmd-label" }, t.limit), h("span", null, limit)) : null,
          c.notes && (t === COPY.zh ? c.notes.zh : c.notes.en) ? h("p", { className: "wbt-cmd-notes" }, t === COPY.zh ? c.notes.zh : c.notes.en) : null,
          h(TemplateBlock, { command: c, t, mode: props.bodyMode, onCopied: props.onCopied })
        );
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
        React.useEffect(function() {
          var cancelled = false;
          setBusy(true);
          setError("");
          api.call("tasks.commands", {}).then(result).then(function(r) {
            if (cancelled) return;
            setData(Array.isArray(r.commands) ? r.commands : []);
            setBusy(false);
          }).catch(function(e) {
            if (cancelled) return;
            setBusy(false);
            setError(String(e && e.message || e));
          });
          return function() {
            cancelled = true;
          };
        }, [api, refresh]);
        var commands = data || [];
        var ready = !busy && cfg.ready;
        return h(
          "div",
          { className: "wbt-root wbt-cmd" },
          h("style", null, CSS),
          h(
            "div",
            { className: "wbt-cmd-head" },
            h("strong", null, t.title),
            h("span", { className: "wbt-cmd-hint" }, t.hint),
            ready && !error ? h("span", { className: "wbt-cmd-count" }, t.count(commands.length)) : null
          ),
          !ready && !error ? h("div", { className: "wbt-cmd-empty" }, t.loading) : null,
          error ? h(
            "div",
            { className: "wbt-cmd-error" },
            t.error + "\uFF1A" + error,
            h("button", { className: "wbt-btn", type: "button", onClick: function() {
              setRefresh(refresh + 1);
            } }, t.retry)
          ) : null,
          ready && !error && !commands.length ? h("div", { className: "wbt-cmd-empty" }, t.empty) : null,
          ready && !error && commands.length ? h("div", { className: "wbt-cmd-list" }, commands.map(function(c) {
            return h(CommandCard, { key: c.name, command: c, t, bodyMode, onCopied: function(text) {
              setToast(text);
            } });
          })) : null,
          toast ? h("span", { className: "wbt-cmd-hint", "aria-live": "polite" }, t.copied) : null
        );
      }
      return { CommandsView, CSS };
    };
  }
});

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
      var h = React.createElement;
      return function Body(props) {
        function render(items, path) {
          return items.map(function(item, i) {
            var key = path + "-" + i;
            if (typeof item === "string") return Highlight ? h(Highlight, { key, text: item, keyword: props.keyword }) : item;
            var attrs = Object.assign({ key }, item.props);
            if (item.tag === "br" || item.tag === "hr") return h(item.tag, attrs);
            return h(item.tag, attrs, render(item.children, key));
          });
        }
        return h("div", { className: props.mode === "text" ? "wb-body-text" : "wb-markdown" }, render(parse(props.text, props.mode), "md"));
      };
    }
    module2.exports = { parse, createBody };
  }
});

// packages/addons/lib/body-toggle.cjs
var require_body_toggle = __commonJS({
  "packages/addons/lib/body-toggle.cjs"(exports2, module2) {
    module2.exports = function(React) {
      var h = React.createElement;
      return function BodyMode(props) {
        var plain = props.mode === "text", t = props.t;
        var label = t.bodyModeToggle.replace("{field}", props.label).replace("{current}", t[plain ? "plainText" : "markdown"]).replace("{target}", t[plain ? "markdown" : "plainText"]);
        return h("button", {
          type: "button",
          className: "wb-body-toggle" + (props.className ? " " + props.className : ""),
          title: label,
          "aria-label": label,
          "aria-pressed": !plain,
          onClick: function(e) {
            e.stopPropagation();
            props.onChange(plain ? "markdown" : "text");
          }
        }, h("span", { key: props.mode, className: "wb-body-toggle-icon", "aria-hidden": true }, h(props.Icon, { name: plain ? "pilcrow" : "code-2", size: 14 })));
      };
    };
  }
});

// packages/addons/tasks/client/ui/body-mode.cjs
var require_body_mode = __commonJS({
  "packages/addons/tasks/client/ui/body-mode.cjs"(exports2, module2) {
    module2.exports = require_body_toggle();
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
    var h = React.createElement;
    var Body = require_markdown().createBody(React);
    var BodyMode = require_body_toggle()(React);
    var copy = require_body_copy();
    var Code = (init_code_2(), __toCommonJS(code_2_exports)).default;
    var Pilcrow2 = (init_pilcrow(), __toCommonJS(pilcrow_exports)).default;
    function BodyIcon(props) {
      return h(props.name === "pilcrow" ? Pilcrow2 : Code, { size: props.size, "aria-hidden": true, focusable: false });
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
      return h(
        "section",
        { className: "wb-body-section wb-description", "aria-labelledby": labelId },
        h(
          "div",
          { className: "wb-body-heading" },
          h("span", { id: labelId, className: "wb-body-label" }, t.desc),
          h(BodyMode, { label: t.desc, mode: mode[0], onChange: mode[1], t, Icon: props.Icon || BodyIcon })
        ),
        h(
          "div",
          { className: "wb-desc" },
          h(
            "div",
            { ref, className: "wb-desc-text" + (expanded[0] ? "" : " wb-desc-clamped") },
            h(Body, { text, mode: mode[0] })
          ),
          overflow[0] || expanded[0] ? h("button", {
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

// packages/addons/tasks/client/ui/styles.cjs
var require_styles = __commonJS({
  "packages/addons/tasks/client/ui/styles.cjs"(exports2, module2) {
    "use strict";
    module2.exports = [
      ".wbt-crumb{min-width:0;max-width:100%}.wbt-crumb button{min-width:0;max-width:100%;overflow-wrap:anywhere}.wbt-path button span{min-width:0;overflow:hidden;text-overflow:ellipsis;overflow-wrap:anywhere}.wbt-modal{box-sizing:border-box}.wbt-field>span,.wbt-ownership-preview{overflow-wrap:anywhere}.wbt-tn .wbt-input{max-width:100%;box-sizing:border-box}.wbt-table-picker .wbt-bpick{box-sizing:border-box}",
      ".wbt-date-clear{border:0;background:transparent;color:inherit;padding:5px;cursor:pointer;border-radius:4px}.wbt-date-clear:focus-visible{outline:2px solid var(--wbt-accent);outline-offset:1px}",
      ".wbt-body-section{margin-top:5px}.wbt-body-section .wbt-desc,.wbt-body-section .wbt-review{margin-top:0}",
      ".wbt-root{--wbt-hit-bg:#ffe4e6;--wbt-hit-fg:#881337}.wbt-root mark.wbt-hit{background:var(--wbt-hit-bg);color:var(--wbt-hit-fg);border-radius:2px;padding:0;font:inherit;box-decoration-break:clone;-webkit-box-decoration-break:clone}",
      ".wbt-root .wbt-item.closed:has(mark.wbt-hit){opacity:1}",
      ".wbt-root{--wbt-line:var(--wb-border);--wbt-surface:var(--dsw-alias-bg-layer-1,color-mix(in oklab,currentColor 4%,transparent));--wbt-bg:var(--dsw-alias-bg-layer-1,var(--dsw-alias-bg-base,#fff));--wbt-accent:var(--dsw-alias-brand-primary,#11a89b);display:flex;flex-direction:column;gap:10px;min-height:0;color:inherit;font-size:13px}",
      // 只接管当前可见任务视图的高度链；其他插件和统计页继续使用宿主页面滚动。
      ".wb-immersive-main:has(> .wb-inner > [data-view-id=tasks]:not([hidden]) .wbt-root){overflow:hidden;display:flex;flex-direction:column}",
      ".wb-immersive-main > .wb-inner:has(> [data-view-id=tasks]:not([hidden]) .wbt-root){flex:1;min-height:0;overflow:hidden}",
      ".wb-immersive-main > .wb-inner > [data-view-id=tasks]:not([hidden]):has(.wbt-root){display:flex;flex-direction:column;flex:1;min-height:0;overflow:hidden}",
      ".wbt-root{flex:1;overflow:hidden}.wbt-pathrow{flex:none;display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding:0 0 2px}.wbt-tabledesc{flex:none;max-height:64px;overflow:auto}",
      ".wbt-tree-slot{flex:0 0 auto;display:flex;align-items:center}",
      ".wbt-grow{flex:1;min-width:0}",
      ".wbt-btn{border:1px solid var(--wbt-line);background:var(--wbt-surface);color:inherit;border-radius:var(--wb-radius-sm);padding:6px 11px;font-size:12.5px;cursor:pointer;white-space:nowrap;line-height:1.3;display:inline-flex;align-items:center;gap:5px}",
      ".wbt-svg{display:block;flex:none}",
      ".wbt-publication-filter{min-width:0;max-width:100%}",
      ".wbt-btn:hover{border-color:var(--wbt-accent)}",
      ".wbt-btn.primary{background:var(--wbt-accent);border-color:var(--wbt-accent);color:var(--dsw-alias-label-primary-inverted,#fff);font-weight:600}",
      ".wbt-btn.ghost{background:transparent}",
      ".wbt-btn.danger{color:var(--dsw-alias-state-error-primary,#e5484d);border-color:color-mix(in oklab,var(--dsw-alias-state-error-primary,#e5484d) 45%,transparent)}",
      ".wbt-btn:disabled{opacity:.5;cursor:not-allowed}",
      ".wbt-input,.wbt-select,.wbt-textarea{border:1px solid var(--wbt-line);background:transparent;color:inherit;border-radius:8px;padding:7px 10px;font-size:13px;outline:none;min-width:0}",
      ".wbt-input:focus,.wbt-select:focus,.wbt-textarea:focus{border-color:var(--wbt-accent)}",
      ".wbt-input:focus-visible,.wbt-select:focus-visible,.wbt-textarea:focus-visible{outline:none !important;border-color:var(--wbt-accent) !important;box-shadow:0 0 0 3px color-mix(in oklab,var(--wbt-accent) 18%,transparent) !important}",
      ".wbt-btn:focus-visible,.wbt-icon:focus-visible,.wbt-tw:focus-visible,.wbt-tool:focus-visible,.wbt-tab:focus-visible,.wbt-tacts button:focus-visible,.wbt-addbtn:focus-visible,.wbt-search-clear:focus-visible{outline:2px solid color-mix(in oklab,var(--wbt-accent) 55%,transparent);outline-offset:1px}",
      ".wbt-search{width:220px;max-width:46vw}",
      ".wbt-body{display:flex;gap:14px;align-items:stretch;min-height:0;flex:1;overflow:hidden}",
      ".wbt-filter-panel{flex:0 0 248px;width:248px;min-width:0;max-height:100%;overflow-y:auto;overscroll-behavior:contain;border:1px solid var(--wbt-line);border-radius:10px;background:var(--wbt-bg);box-sizing:border-box;padding:12px}",
      ".wbt-filter-content{display:flex;flex-direction:column;gap:12px}.wbt-filter-toggle{display:none}.wbt-filter-group{display:flex;flex-direction:column;gap:8px;min-width:0;margin:0;padding:10px 0;border:0;border-bottom:1px solid var(--wbt-line)}.wbt-filter-group legend{font-weight:600;padding:0}.wbt-filter-search{display:flex;gap:4px}.wbt-filter-search input{width:100%;min-width:0}.wbt-filter-panel .wbt-check{white-space:normal}.wbt-filter-panel .wbt-tagmenu{position:static;width:100%;box-sizing:border-box;max-height:240px}.wbt-filter-panel .wbt-tagfilter{flex-wrap:wrap}.wbt-filter-panel input:disabled{opacity:.45;cursor:not-allowed}.wbt-filter-panel .wbt-mhint{margin:0;line-height:1.6}.wbt-filter-panel .wbt-field input{width:100%;box-sizing:border-box}",
      ".wbt-limit-row{display:flex;flex-direction:column;gap:4px;min-width:0}.wbt-limit-head{display:flex;align-items:baseline;gap:6px;flex-wrap:wrap;min-width:0}.wbt-limit-hint{margin:0;font-size:11.5px;line-height:1.6;opacity:.65;overflow-wrap:anywhere}.wbt-limit-head>strong{font-weight:560;font-size:12.5px;flex:none}.wbt-limit-fields{display:flex;align-items:center;gap:4px;min-width:0}.wbt-limit-fields input{flex:1 1 0;width:0;min-width:0;box-sizing:border-box;text-align:center;padding-left:6px;padding-right:6px}.wbt-limit-fields .wbt-limit-input{background-color:var(--wbt-surface);border:1px solid var(--wbt-line);border-radius:8px;padding:6px 4px;font-size:13px;color:inherit;font-variant-numeric:tabular-nums;-moz-appearance:textfield;appearance:textfield}.wbt-limit-fields .wbt-limit-input:focus{border-color:var(--wbt-accent);outline:none;box-shadow:0 0 0 3px color-mix(in oklab,var(--wbt-accent) 18%,transparent)}.wbt-limit-fields .wbt-limit-input::-webkit-outer-spin-button,.wbt-limit-fields .wbt-limit-input::-webkit-inner-spin-button{-webkit-appearance:none;margin:0}.wbt-limit-fields>span{flex:none;opacity:.55;font-size:11.5px}.wbt-limit-clear{flex:none;padding:2px 6px;line-height:1.2}.wbt-limit-unit{font-size:11px;opacity:.55;overflow-wrap:anywhere;min-width:0}",
      ".wbt-presets{gap:6px}.wbt-preset-list{display:flex;flex-wrap:wrap;gap:6px}.wbt-preset{padding:4px 9px;border:1px solid var(--wbt-line);border-radius:999px;background:var(--wbt-surface);color:inherit;font-size:12px;line-height:1.5;white-space:normal}.wbt-preset:hover{border-color:var(--wbt-accent)}.wbt-preset.active{background:var(--wbt-accent);border-color:var(--wbt-accent);color:#fff}.wbt-preset:focus-visible{outline:2px solid var(--wbt-accent);outline-offset:2px}.wbt-target-group{gap:8px}",
      ".wbt-status-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px 8px}.wbt-status-grid .wbt-check{min-width:0;overflow-wrap:anywhere}.wbt-pathrow>.wbt-sum{flex:none;white-space:nowrap}",
      ".wbt-publication-filter{width:100%}.wbt-range-entry{display:flex;gap:4px;align-items:center}.wbt-range-trigger{width:100%;min-width:0;text-align:left;white-space:normal}.wbt-range-trigger span{min-width:0;overflow-wrap:anywhere}.wbt-range-calendar{margin-top:8px;padding:6px;border:1px solid var(--wbt-line);border-radius:8px;background:var(--wbt-bg)}.wbt-range-month{display:flex;gap:4px;align-items:center;margin-bottom:8px}.wbt-range-month input{width:100%;min-width:0;padding:4px;border:1px solid var(--wbt-line);border-radius:4px;background:var(--wbt-bg);color:inherit}.wbt-range-month .wbt-btn{padding:4px 7px}.wbt-range-grid{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:2px;margin:8px 0}.wbt-range-weekday{text-align:center;font-size:11px;opacity:.7}.wbt-range-day{min-width:0;padding:6px 0;border:0;border-radius:4px;background:transparent;color:inherit;font:inherit;cursor:pointer}.wbt-range-day.between{background:color-mix(in srgb,var(--wbt-accent) 18%,transparent)}.wbt-range-day:hover{box-shadow:inset 0 0 0 1px var(--wbt-accent)}.wbt-range-day.selected{background:var(--wbt-accent);color:#fff}.wbt-range-day:focus-visible{outline:2px solid var(--wbt-accent);outline-offset:1px}.wbt-range-actions{display:flex;flex-wrap:wrap;gap:4px;margin-bottom:6px}",
      ".wbt-nav{display:flex;flex-direction:column;gap:2px;flex:0 0 138px;width:138px;padding:3px 0;border-right:1px solid var(--wbt-line)}",
      ".wbt-content{flex:1;min-width:0;min-height:0;display:flex;flex-direction:column;border:1px solid var(--wbt-line);border-radius:10px;background:var(--wbt-surface);overflow:hidden}.wbt-list-scroll{flex:1;min-height:0;overflow:auto;overscroll-behavior:contain;padding:10px;scrollbar-gutter:stable}.wbt-content>.wbt-pager{flex:none;margin:0;padding:8px 10px;border-top:1px solid var(--wbt-line)}",
      ".wbt-nav-sep{height:1px;background:var(--wbt-line);margin:5px 9px;opacity:.7}",
      ".wbt-tab{display:flex;align-items:center;text-align:left;width:100%;border:none;background:transparent;color:inherit;opacity:.62;border-radius:8px;padding:8px 10px;cursor:pointer;font-size:12.5px;line-height:1.35;transition:background .12s ease,color .12s ease,opacity .12s ease}",
      ".wbt-tab:hover{opacity:1;background:color-mix(in oklab,currentColor 7%,transparent)}",
      ".wbt-tab.on{opacity:1;font-weight:650;background:color-mix(in oklab,var(--wbt-accent) 15%,transparent);color:var(--wbt-accent);box-shadow:inset 2px 0 0 var(--wbt-accent)}",
      ".wbt-filters{display:flex;gap:10px;align-items:center;flex-wrap:wrap;font-size:12px;opacity:.85}",
      ".wbt-check{display:inline-flex;align-items:center;gap:4px;cursor:pointer;white-space:nowrap}",
      ".wbt-check input{accent-color:var(--wbt-accent)}",
      ".wbt-crumb{display:flex;align-items:center;gap:3px;flex-wrap:wrap;font-size:12px;opacity:.8}",
      ".wbt-crumb button{border:none;background:none;color:inherit;cursor:pointer;padding:2px 4px;border-radius:5px;font-size:12px}",
      ".wbt-crumb button:hover{background:color-mix(in oklab,currentColor 9%,transparent)}",
      ".wbt-crumb .sep{opacity:.35}",
      ".wbt-list{display:flex;flex-direction:column;gap:7px;min-height:0}",
      ".wbt-item{display:flex;gap:12px;align-items:flex-start;border:1px solid var(--wbt-line);border-radius:var(--wb-radius-card);background:var(--wbt-surface);padding:var(--wb-space-md);min-width:0;max-width:100%;box-sizing:border-box;min-height:0;overflow:hidden;overflow-wrap:anywhere;transition:border-color .14s ease,box-shadow .14s ease}",
      ".wbt-item:hover{border-color:color-mix(in oklab,var(--wbt-accent) 30%,var(--wbt-line));box-shadow:0 2px 10px rgba(20,30,40,.05)}",
      ".wbt-item.closed{opacity:.62}",
      ".wbt-item.closed .wbt-title{text-decoration:line-through}",
      ".wbt-main{flex:1;min-width:0;display:flex;flex-direction:column;gap:5px}",
      ".wbt-chead{display:flex;align-items:flex-start;gap:10px;min-width:0}",
      ".wbt-line1{display:flex;align-items:center;gap:6px;min-width:0;flex-wrap:wrap;flex:1 1 auto}",
      ".wbt-title{font-weight:620;font-size:14px;line-height:1.38;letter-spacing:.1px;word-break:break-word;overflow-wrap:anywhere;max-width:100%}",
      require_description().css + require_visual_tokens(),
      ".wbt-foot{display:flex;align-items:center;gap:6px 12px;flex-wrap:wrap;margin-top:1px}",
      ".wbt-meta{display:flex;gap:4px 12px;flex-wrap:wrap;font-size:11.5px;opacity:.64;min-width:0;max-width:100%;font-variant-numeric:tabular-nums}",
      ".wbt-meta b{font-weight:560;opacity:.9;margin-right:1px}",
      ".wbt-path{display:flex;gap:3px;flex-wrap:wrap;align-items:center;font-size:11.5px;opacity:.58}",
      ".wbt-taskpath{display:flex;align-items:center;gap:6px;margin-top:3px;min-width:0;max-width:100%;overflow:hidden}",
      ".wbt-taskpath .wbt-path{flex:1 1 auto;flex-wrap:nowrap;overflow:hidden;min-width:0;gap:0;opacity:.52;-webkit-mask-image:linear-gradient(90deg,#000 91%,transparent);mask-image:linear-gradient(90deg,#000 91%,transparent)}",
      ".wbt-taskpath .wbt-path button{white-space:nowrap}",
      ".wbt-taskpath .wbt-path .sep{margin:0 1px;opacity:.4}",
      ".wbt-review{margin-top:5px;font-size:12.5px;line-height:1.6;white-space:pre-wrap;word-break:break-word;overflow-wrap:anywhere;max-width:100%;box-sizing:border-box;padding:6px 10px;border-radius:0 8px 8px 0;border-left:2px solid color-mix(in oklab,var(--wbt-accent) 42%,transparent);background:color-mix(in oklab,var(--wbt-accent) 6%,transparent)}",
      ".wbt-path button{border:none;background:none;color:inherit;padding:2px 3px;border-radius:5px;cursor:pointer;font-size:11.5px;display:inline-flex;align-items:center;gap:4px;line-height:1.2;min-width:0;max-width:100%;overflow:hidden;text-overflow:ellipsis}",
      ".wbt-path button .wbt-svg{opacity:.7;margin-top:-1px}",
      ".wbt-path button:hover{background:color-mix(in oklab,currentColor 8%,transparent);text-decoration:underline}",
      ".wbt-prio{font-size:10px;font-weight:650;padding:2px 6px;border-radius:999px;border:none;background:color-mix(in oklab,currentColor 12%,transparent);opacity:.92;flex:none;font-variant-numeric:tabular-nums}",
      ".wbt-prio.high{color:var(--dsw-alias-state-error-primary,#d93a40)}.wbt-prio.mid{color:var(--dsw-alias-state-warn-primary,#cf6512)}.wbt-prio.low{color:var(--dsw-alias-label-tertiary,#77839a)}",
      ".wbt-tag{font-size:11.5px;line-height:1.5;padding:0 6px;border-radius:999px;background:color-mix(in oklab,var(--wbt-accent) 12%,transparent);color:var(--wbt-accent);cursor:pointer;white-space:nowrap}",
      ".wbt-tag:hover{background:color-mix(in oklab,var(--wbt-accent) 22%,transparent)}",
      ".wbt-tags{display:flex;flex-wrap:wrap;align-items:center;gap:5px;margin-top:5px;min-width:0;max-width:100%}",
      ".wbt-metazone{display:flex;flex-direction:column;gap:4px;min-width:0;max-width:100%;margin-top:5px}",
      ".wbt-metazone > *{margin-top:0}",
      ".wbt-metazone + .wbt-desc{margin-top:7px}",
      ".wbt-wschips{display:flex;flex-wrap:wrap;gap:4px;min-width:0}",
      ".wbt-wschip{display:inline-flex;align-items:center;gap:4px;max-width:100%;padding:1px 8px;border-radius:999px;border:1px solid var(--wbt-line);background:color-mix(in oklab,var(--wbt-accent) 8%,transparent);font-size:11.5px;line-height:1.7}",
      ".wbt-wschip b{font-weight:560;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:22em}",
      ".wbt-wschip button{border:0;background:transparent;color:inherit;cursor:pointer;font-size:13px;line-height:1;padding:0 2px;opacity:.6}",
      ".wbt-wschip button:hover{opacity:1}",
      ".wbt-wschip-ro{opacity:.85;background:transparent}",
      ".wbt-wsfilter{width:100%}",
      ".wbt-muted-link{opacity:.7;text-decoration-style:dashed}",
      ".wbt-wsmenu .wbt-tagopt{padding:5px 6px}",
      ".wbt-wsmenu .wbt-wsnone{border-top:1px dashed var(--wbt-line);margin-top:4px;padding-top:7px}",
      ".wbt-ws-group .wbt-check{min-width:0;overflow-wrap:anywhere}",
      ".wbt-ws-select{display:flex;flex-direction:column;gap:6px;min-width:0}",
      ".wbt-ws-select .wbt-picker-list{max-height:180px}",
      ".wbt-ops-block{width:100%;min-width:0;justify-content:flex-start;flex-wrap:wrap;padding-top:2px;margin-top:2px}",
      ".wbt-card .wbt-chead{row-gap:0}",
      ".wbt-card .wbt-metazone .wbt-meta{row-gap:2px}",
      ".wbt-tagfilter{position:relative;display:flex;align-items:center;gap:5px;min-width:0}",
      ".wbt-tagfilter .wbt-btn.on{border-color:var(--wbt-accent);color:var(--wbt-accent);background:color-mix(in oklab,var(--wbt-accent) 12%,transparent)}",
      ".wbt-tagsearch{padding:0 0 6px}",
      ".wbt-tagsearch .wbt-input{width:100%;box-sizing:border-box;font-size:12.5px;padding:6px 9px}",
      ".wbt-tagsel{border-bottom:1px dashed var(--wbt-line);margin-bottom:6px;padding-bottom:5px}",
      ".wbt-tagsel-list{display:flex;flex-wrap:wrap;gap:4px;padding:0 2px 2px}",
      ".wbt-tagselitem{display:inline-flex;align-items:center;gap:4px;max-width:100%;border:1px solid color-mix(in oklab,var(--wbt-accent) 40%,transparent);background:color-mix(in oklab,var(--wbt-accent) 10%,transparent);color:var(--wbt-accent);border-radius:999px;padding:2px 7px;font-size:11.5px;cursor:pointer;font-family:inherit}",
      ".wbt-tagselitem .wbt-tagnm{max-width:150px}",
      ".wbt-tagx{opacity:.7;font-size:12px;line-height:1}",
      ".wbt-taglist{max-height:236px;overflow:auto;overscroll-behavior:contain}",
      ".wbt-tagmore{font-size:11px;opacity:.5;text-align:center;padding:6px 0 2px}",
      ".wbt-card .wbt-metazone{row-gap:3px}",
      ".wbt-tagmenu{position:absolute;z-index:60;top:calc(100% + 6px);right:0;width:236px;max-height:320px;overflow:auto;padding:8px;border-radius:10px;border:1px solid var(--wbt-line);box-shadow:0 14px 34px rgba(26,20,12,.2);background-color:var(--wbt-bg);background-image:linear-gradient(var(--wbt-bg),var(--wbt-bg)),linear-gradient(var(--wbt-bg),var(--wbt-bg));-webkit-backdrop-filter:blur(24px) saturate(1.4);backdrop-filter:blur(24px) saturate(1.4)}",
      ".wbt-tagmenu-head{display:flex;align-items:center;gap:6px;font-size:11px;opacity:.6;padding:2px 4px 7px}",
      ".wbt-tagopt{display:flex;align-items:center;gap:7px;padding:6px;border-radius:6px;cursor:pointer;font-size:12.5px}",
      ".wbt-tagopt:hover{background:color-mix(in oklab,currentColor 7%,transparent)}",
      ".wbt-tagopt input{margin:0;accent-color:var(--wbt-accent)}",
      ".wbt-mini{appearance:none;border:0;background:transparent;color:inherit;border-radius:4px;cursor:pointer;font-size:11.5px;line-height:1;padding:3px 5px;font-family:inherit;opacity:.7}",
      ".wbt-mini:hover{background:color-mix(in oklab,currentColor 8%,transparent);opacity:1}",
      ".wbt-note{font-size:11.5px;opacity:.6;padding:6px}",
      ".wbt-tagcnt{font-size:10.5px;opacity:.55;font-variant-numeric:tabular-nums;margin-left:auto}",
      ".wbt-tagnm{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
      ".wbt-badge{font-size:10.5px;padding:1px 6px;border-radius:999px;border:none;background:color-mix(in oklab,currentColor 9%,transparent);opacity:.86;white-space:nowrap}",
      '.wbt-badge::before{content:"";display:inline-block;width:5px;height:5px;border-radius:50%;background:currentColor;margin-right:4px;vertical-align:1px;opacity:.8}',
      ".wbt-badge.active{color:var(--dsw-alias-brand-primary,#0b8a7f)}",
      ".wbt-badge.done{color:var(--dsw-alias-state-success-primary,#2f9e44)}",
      ".wbt-badge.shutdown{color:var(--dsw-alias-label-tertiary,#7d8698)}.wbt-badge.restarted{color:var(--dsw-alias-state-business-primary,#7048e8)}.wbt-badge.claimed{color:var(--dsw-alias-state-warning-primary,#b8860b)}",
      ".wbt-ops{display:flex;gap:3px;align-items:center;flex-wrap:wrap;flex:0 1 auto;min-width:0;max-width:100%;justify-content:flex-end;padding-top:1px}",
      ".wbt-icon{border:none;background:color-mix(in oklab,currentColor 5%,transparent);color:inherit;width:24px;height:24px;border-radius:6px;cursor:pointer;font-size:12.5px;line-height:1;display:inline-flex;align-items:center;justify-content:center;flex:none;opacity:.7;padding:0}",
      ".wbt-icon:hover{opacity:1;background:color-mix(in oklab,var(--wbt-accent) 13%,transparent);color:var(--wbt-accent)}",
      ".wbt-icon.danger:hover{background:color-mix(in oklab,var(--dsw-alias-state-error-primary,#e5484d) 12%,transparent);color:var(--dsw-alias-state-error-primary,#e5484d)}",
      ".wbt-ops .wbt-btn{border-color:transparent;background:transparent;padding:5px 8px;font-size:12px;border-radius:7px;opacity:.72}",
      ".wbt-ops .wbt-btn:hover{opacity:1;background:color-mix(in oklab,currentColor 7%,transparent)}",
      ".wbt-ops .wbt-act-done{color:var(--dsw-alias-state-success-primary,#1f8a4c);background:color-mix(in oklab,var(--dsw-alias-state-success-primary,#2f9e44) 10%,transparent);opacity:.96}",
      ".wbt-ops .wbt-act-done:hover{background:color-mix(in oklab,var(--dsw-alias-state-success-primary,#2f9e44) 16%,transparent)}",
      ".wbt-ops .wbt-act-close{color:var(--dsw-alias-state-error-primary,#b4434a)}",
      ".wbt-ops .wbt-act-close:hover{background:color-mix(in oklab,var(--dsw-alias-state-error-primary,#e5484d) 10%,transparent)}",
      ".wbt-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(300px,100%),1fr));gap:9px;min-width:0;max-width:100%}",
      ".wbt-card .wbt-main,.wbt-card .wbt-chead,.wbt-card .wbt-line1{width:100%;min-width:0;max-width:100%}",
      ".wbt-card{display:flex;flex-direction:column;align-items:stretch;gap:6px;min-height:150px;width:100%;min-width:0;max-width:100%;box-sizing:border-box;overflow:hidden}",
      ".wbt-empty{border:1px dashed var(--wbt-line);border-radius:11px;padding:34px 12px;text-align:center;opacity:.5;font-size:12.5px}",
      ".wbt-err{font-size:12.5px;color:var(--dsw-alias-state-error-primary,#e5484d);line-height:1.5}",
      ".wbt-pager{display:flex;gap:8px;align-items:center;justify-content:flex-end;font-size:12px;opacity:.8;flex-wrap:wrap}",
      ".wbt-drawer-mask{position:fixed;inset:0;z-index:800;display:flex;background:rgba(26,20,12,.26);animation:wbt-fade .16s ease}",
      ".wbt-drawer{width:max(392px,50vw);max-width:94vw;flex:none;box-sizing:border-box;height:100%;display:flex;flex-direction:column;background-color:var(--wbt-bg);background-image:linear-gradient(var(--wbt-bg),var(--wbt-bg)),linear-gradient(var(--wbt-bg),var(--wbt-bg)),linear-gradient(var(--wbt-bg),var(--wbt-bg));-webkit-backdrop-filter:blur(30px) saturate(1.4);backdrop-filter:blur(30px) saturate(1.4);border-right:1px solid var(--wbt-line);box-shadow:0 24px 70px rgba(26,20,12,.3);animation:wbt-slide .18s ease}",
      ".wbt-drawer-head{display:flex;align-items:center;gap:8px;padding:14px 16px 10px}",
      ".wbt-drawer-head>.wbt-svg{opacity:.7}",
      ".wbt-drawer-title{display:flex;align-items:baseline;gap:8px;flex:1;min-width:0}",
      ".wbt-drawer-title b{font-size:14px;font-weight:650;letter-spacing:.2px}",
      ".wbt-drawer-meta{font-size:11px;opacity:.5;white-space:nowrap;font-variant-numeric:tabular-nums}",
      ".wbt-tool{border:1px solid var(--wbt-line);background:color-mix(in oklab,currentColor 3%,transparent);color:inherit;font:inherit;font-size:11.5px;line-height:1;padding:5px 9px;border-radius:7px;cursor:pointer;opacity:.7;white-space:nowrap;flex:none}",
      ".wbt-tool:hover{opacity:.9;background:color-mix(in oklab,currentColor 7%,transparent)}",
      ".wbt-tool.on{opacity:1;border-color:color-mix(in oklab,var(--wbt-accent) 48%,transparent);background:color-mix(in oklab,var(--wbt-accent) 14%,transparent);color:var(--wbt-accent);font-weight:600}",
      ".wbt-drawer-search{padding:0 14px 8px;display:flex;align-items:center;gap:6px}",
      ".wbt-search-clear{flex:none;width:26px;height:26px;border:none;background:color-mix(in oklab,currentColor 6%,transparent);color:inherit;border-radius:7px;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;opacity:.6;padding:0}",
      ".wbt-search-clear:hover{opacity:1;background:color-mix(in oklab,currentColor 11%,transparent)}",
      ".wbt-drawer-search .wbt-input{width:100%;box-sizing:border-box;padding:6px 9px;font-size:12.5px;border-radius:8px;background:color-mix(in oklab,currentColor 4%,transparent)}",
      ".wbt-drawer-body{flex:1;overflow:auto;padding:2px 8px 18px}",
      ".wbt-drawer-foot{display:flex;flex-direction:column;gap:7px;padding:10px 14px 12px;border-top:1px solid var(--wbt-line)}",
      ".wbt-drawer-acts{display:flex;gap:6px}",
      ".wbt-addbtn{display:inline-flex;align-items:center;gap:5px;border:1px solid var(--wbt-line);background:color-mix(in oklab,currentColor 3%,transparent);color:inherit;font:inherit;font-size:11.5px;line-height:1;padding:7px 11px;border-radius:8px;cursor:pointer;opacity:.78;transition:opacity .12s ease,background .12s ease,border-color .12s ease,color .12s ease}",
      ".wbt-addbtn:hover{opacity:1;border-color:color-mix(in oklab,var(--wbt-accent) 42%,transparent);color:var(--wbt-accent);background:color-mix(in oklab,var(--wbt-accent) 10%,transparent)}",
      ".wbt-drawer-hint{font-size:10.5px;opacity:.45;line-height:1.55}",
      ".wbt-tree-row{display:flex;align-items:center;gap:1px;border-radius:8px;padding:0 4px 0 2px;height:30px;position:relative}",
      ".wbt-tree-row:hover{background:color-mix(in oklab,currentColor 6%,transparent)}",
      ".wbt-tree-row.sel{background:color-mix(in oklab,var(--wbt-accent) 13%,transparent)}",
      '.wbt-tree-row.sel::before{content:"";position:absolute;left:-4px;top:7px;bottom:7px;width:2.5px;border-radius:2px;background:var(--wbt-accent)}',
      ".wbt-tree-row.sel .nm{color:var(--wbt-accent);font-weight:620}",
      ".wbt-tree-row.drop{outline:1px dashed var(--wbt-accent);outline-offset:-1px}",
      ".wbt-tw{width:16px;height:30px;border:none;background:none;color:inherit;cursor:pointer;opacity:.45;flex:none;display:inline-flex;align-items:center;justify-content:center;padding:0}",
      ".wbt-tw:hover{opacity:.9}",
      ".wbt-tw.void{visibility:hidden;cursor:default}",
      ".wbt-ti{display:inline-flex;align-items:center;justify-content:center;width:16px;flex:none;opacity:.55}",
      ".wbt-tree-row.sel .wbt-ti{opacity:.95}",
      ".wbt-tn{flex:1;min-width:0;height:100%;display:flex;align-items:center;gap:5px;cursor:pointer;font-size:12.5px}",
      ".wbt-tn .nm{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
      ".wbt-tcnt{font-size:10px;opacity:.38;font-variant-numeric:tabular-nums;flex:none}",
      ".wbt-tdesc{font-size:11px;opacity:.42;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:0 1 auto;max-width:150px}",
      ".wbt-tabledesc{margin:0 0 8px 2px;padding:6px 10px;border-left:2px solid color-mix(in oklab,var(--wbt-accent) 32%,transparent);border-radius:0 8px 8px 0;background:color-mix(in oklab,var(--wbt-accent) 6%,transparent);font-size:12px;line-height:1.6;opacity:.8;white-space:pre-wrap;max-width:110ch}",
      ".wbt-tacts{display:flex;gap:0;opacity:0;flex:none;transition:opacity .12s ease}",
      ".wbt-tree-row:hover .wbt-tacts{opacity:1}",
      ".wbt-tacts button{border:none;background:none;color:inherit;cursor:pointer;width:23px;height:23px;border-radius:6px;display:inline-flex;align-items:center;justify-content:center;opacity:.5;padding:0}",
      ".wbt-tacts button:hover{background:color-mix(in oklab,currentColor 11%,transparent);opacity:.95}",
      ".wbt-tacts button.wbt-danger:hover{color:var(--dsw-alias-state-error-primary,#e5484d);background:color-mix(in oklab,var(--dsw-alias-state-error-primary,#e5484d) 12%,transparent)}",
      "@keyframes wbt-fade{from{opacity:0}to{opacity:1}}",
      "@keyframes wbt-slide{from{transform:translateX(-14px);opacity:.5}to{transform:none;opacity:1}}",
      ".wbt-modal-mask{position:fixed;inset:0;background:rgba(0,0,0,.28);z-index:1000;display:flex;align-items:center;justify-content:center;padding:16px}",
      ".wbt-modal{width:560px;max-width:96vw;max-height:90vh;overflow:auto;background-color:var(--wbt-bg);background-image:linear-gradient(var(--wbt-bg),var(--wbt-bg)),linear-gradient(var(--wbt-bg),var(--wbt-bg)),linear-gradient(var(--wbt-bg),var(--wbt-bg));-webkit-backdrop-filter:blur(30px) saturate(1.4);backdrop-filter:blur(30px) saturate(1.4);border:1px solid var(--wbt-line);border-radius:14px;box-shadow:0 20px 60px rgba(26,20,12,.3);padding:15px 17px;display:flex;flex-direction:column;gap:11px}",
      ".wbt-modal.wide{width:820px}",
      ".wbt-modal-head{display:flex;align-items:center;gap:8px}",
      ".wbt-modal-head h3{margin:0;font-size:14.5px;font-weight:650;flex:1}",
      ".wbt-form{display:grid;grid-template-columns:1fr 1fr;gap:9px}",
      ".wbt-field{display:flex;flex-direction:column;gap:4px;font-size:12px;min-width:0}",
      ".wbt-field.full{grid-column:1 / -1}",
      ".wbt-field>span{opacity:.62;font-size:11.5px}",
      ".wbt-modal-foot{display:flex;gap:8px;justify-content:flex-end;align-items:center;margin-top:2px}",
      ".wbt-timeline{display:flex;flex-direction:column;gap:0;margin:2px 0}",
      ".wbt-tl-item{display:flex;gap:9px;min-height:40px}",
      ".wbt-tl-rail{width:12px;display:flex;flex-direction:column;align-items:center;flex:none}",
      ".wbt-tl-dot{width:8px;height:8px;border-radius:50%;background:var(--wbt-accent);margin-top:5px}",
      ".wbt-tl-line{width:1px;flex:1;background:var(--wbt-line)}",
      ".wbt-tl-body{padding:0 0 10px;min-width:0;flex:1}",
      ".wbt-tl-title{font-weight:600;font-size:12.5px}",
      ".wbt-tl-meta{font-size:11px;opacity:.58;display:flex;gap:7px;flex-wrap:wrap;margin-top:2px}",
      ".wbt-selbar .wbt-act-del{color:var(--dsw-alias-state-error-primary,#b4434a);background:color-mix(in oklab,var(--dsw-alias-state-error-primary,#e5484d) 9%,transparent)}",
      ".wbt-selbar .wbt-act-del:hover{background:color-mix(in oklab,var(--dsw-alias-state-error-primary,#e5484d) 16%,transparent)}",
      ".wbt-selbar{position:fixed;left:50%;bottom:16px;transform:translateX(-50%);z-index:900;display:flex;gap:8px;align-items:center;background-color:var(--wbt-bg);background-image:linear-gradient(var(--wbt-bg),var(--wbt-bg)),linear-gradient(var(--wbt-bg),var(--wbt-bg)),linear-gradient(var(--wbt-bg),var(--wbt-bg));-webkit-backdrop-filter:blur(30px) saturate(1.4);backdrop-filter:blur(30px) saturate(1.4);border:1px solid var(--wbt-line);box-shadow:0 10px 34px rgba(26,20,12,.24);border-radius:12px;padding:8px 11px;max-width:94vw;flex-wrap:wrap}",
      ".wbt-toast{position:fixed;left:50%;bottom:70px;transform:translateX(-50%);z-index:1100;background:var(--dsw-alias-toast-bg,#1f2328);color:var(--dsw-alias-toast-label,#fff);border-radius:9px;padding:8px 14px;font-size:12.5px;box-shadow:0 8px 24px rgba(0,0,0,.25);max-width:90vw;text-align:center}",
      ".wbt-stars{color:var(--dsw-alias-state-warn-primary,#f59f00);font-size:11px;letter-spacing:.5px;white-space:nowrap}",
      ".wbt-sum{display:flex;gap:5px;flex-wrap:wrap;font-size:11px;opacity:.55}",
      ".wbt-nowrap{white-space:nowrap}",
      ".wbt-row{display:flex;gap:6px;align-items:center;flex-wrap:wrap}",
      ".wbt-split{display:flex;gap:12px;align-items:flex-start}",
      ".wbt-col{flex:1;min-width:0}",
      ".wbt-mono{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11px}",
      ".wbt-pill{font-size:11px;padding:2px 7px;border-radius:999px;background:color-mix(in oklab,var(--wbt-accent) 12%,transparent);color:var(--wbt-accent)}",
      ".wbt-mhint{font-size:11.5px;opacity:.62;line-height:1.5}",
      ".wbt-modal.batch{width:min(720px,96vw);gap:9px}",
      ".wbt-table-picker{display:flex;flex-direction:column;gap:8px;min-width:0}.wbt-picker-detail{white-space:pre-wrap;overflow-wrap:anywhere;min-width:0;line-height:1.6;font-size:12px}.wbt-bpick.keyboard{outline:1px solid var(--wbt-accent);outline-offset:-2px}",
      ".wbt-batch{display:flex;flex-direction:column;gap:8px;min-height:0}",
      ".wbt-batch-body{display:flex;flex-direction:column;gap:1px;border:1px solid var(--wbt-line);border-radius:10px;padding:5px;max-height:min(52vh,420px);overflow:auto;overscroll-behavior:contain}",
      ".wbt-bpick{display:flex;align-items:flex-start;gap:8px;width:100%;text-align:left;border:1px solid transparent;background:transparent;color:inherit;font:inherit;font-size:12.5px;padding:7px 9px;border-radius:8px;cursor:pointer;min-width:0;line-height:1.45}",
      ".wbt-bpick:hover{background:color-mix(in oklab,var(--wbt-accent) 8%,transparent)}",
      ".wbt-bpick.on{background:color-mix(in oklab,var(--wbt-accent) 13%,transparent);border-color:color-mix(in oklab,var(--wbt-accent) 40%,transparent)}",
      ".wbt-bpick input{margin:3px 0 0;flex:none;accent-color:var(--wbt-accent)}",
      ".wbt-bpick-ind{flex:none;align-self:stretch}",
      ".wbt-bpick-main{flex:1;min-width:0;display:flex;flex-direction:column;gap:1px}",
      ".wbt-bpick-name{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
      ".wbt-bpick.wrap .wbt-bpick-name{white-space:normal;word-break:break-word}",
      ".wbt-bpick-meta{font-size:11px;opacity:.55;font-variant-numeric:tabular-nums;display:flex;gap:6px;align-items:center;min-width:0}",
      ".wbt-bpick-meta code{font-family:inherit;opacity:.85;background:color-mix(in oklab,currentColor 8%,transparent);border-radius:4px;padding:0 4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:190px}",
      ".wbt-bpick-check{flex:none;width:16px;display:inline-flex;justify-content:center;color:var(--wbt-accent);opacity:.95;padding-top:2px}",
      ".wbt-bgroup{display:flex;align-items:center;gap:6px;font-size:11px;font-weight:560;opacity:.5;padding:7px 9px 2px}",
      ".wbt-bgroup .wbt-svg{opacity:.7}",
      ".wbt-batch-sel{display:flex;align-items:center;gap:6px;font-size:11.5px;opacity:.62;min-width:0}",
      ".wbt-batch-sel b{font-weight:600;opacity:.95;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0}",
      ".wbt-batch-empty{font-size:12px;opacity:.5;text-align:center;padding:22px 8px}",
      ".wbt-danger{color:var(--dsw-alias-state-error-primary,#e5484d)}",
      ".wbt-countdown{display:inline-flex;align-items:center;gap:3px;margin-left:5px;padding:1px 6px 1px 5px;border-radius:6px;font-size:10.5px;font-weight:600;letter-spacing:.2px;color:var(--dsw-alias-state-error-primary,#e5484d);background:color-mix(in oklab,var(--dsw-alias-state-error-primary,#e5484d) 9%,transparent);border:1px solid color-mix(in oklab,var(--dsw-alias-state-error-primary,#e5484d) 20%,transparent);vertical-align:1px}",
      '.wbt-countdown .wbt-cd-num{font-variant-numeric:tabular-nums;font-feature-settings:"tnum"}',
      ".wbt-countdown.soon{background:color-mix(in oklab,var(--dsw-alias-state-error-primary,#e5484d) 14%,transparent);border-color:color-mix(in oklab,var(--dsw-alias-state-error-primary,#e5484d) 32%,transparent)}",
      ".wbt-countdown.overdue{color:var(--dsw-alias-label-primary-inverted,#fff);background:var(--dsw-alias-state-error-primary,#e5484d);border-color:transparent}",
      "@media (max-width:760px){.wbt-body{flex-direction:column;gap:8px}.wbt-nav{flex-direction:row;width:100%;flex:0 0 auto;overflow-x:auto;border-right:none;border-bottom:1px solid var(--wbt-line);padding:0 0 6px}.wbt-tab{width:auto;white-space:nowrap;padding:6px 9px}.wbt-tab.on{box-shadow:inset 0 -2px 0 var(--wbt-accent)}.wbt-nav-sep{width:1px;height:18px;flex:none;margin:auto 4px}.wbt-tree-slot{flex:0 0 auto;width:auto;margin-right:0}.wbt-pathrow .wbt-search{flex:1 1 160px;max-width:none}}",
      "@media (max-width:760px){.wbt-filter-panel{width:100%;flex:0 0 auto;padding:8px;max-height:40%}.wbt-filter-toggle{display:inline-flex}.wbt-filter-panel:not(.expanded) .wbt-filter-content{display:none}.wbt-filter-panel.expanded .wbt-filter-content{padding-top:10px}.wbt-content{width:100%;box-sizing:border-box}}",
      "@media (max-width:420px){.wbt-grid{grid-template-columns:1fr}}",
      "@media (max-width:640px){.wbt-form{grid-template-columns:1fr}.wbt-drawer{width:94vw}.wbt-search{width:100%}.wbt-item{padding:9px}.wbt-ops{width:100%;justify-content:flex-end}}"
    ].join("\n");
  }
});

// packages/addons/tasks/client/ui/highlight.cjs
var require_highlight2 = __commonJS({
  "packages/addons/tasks/client/ui/highlight.cjs"(exports2, module2) {
    "use strict";
    module2.exports = function(React) {
      return require_highlight()(React)("wbt");
    };
  }
});

// packages/addons/tasks/client/item/task-item.cjs
var require_task_item = __commonJS({
  "packages/addons/tasks/client/item/task-item.cjs"(exports2, module2) {
    "use strict";
    module2.exports = function(deps) {
      var React = deps.React, h = React.createElement;
      var Highlight = require_highlight2()(React);
      var Body = require_markdown().createBody(React, Highlight);
      var BodyMode = require_body_mode()(React);
      var statusInfo = deps.statusInfo, stars = deps.stars, pClass = deps.pClass;
      var today = deps.today, daysBetween = deps.daysBetween, cx = deps.cx;
      var Icon2 = deps.Icon, Countdown = deps.Countdown, PathCrumbs = deps.PathCrumbs;
      function TaskItem(props) {
        var t = props.t;
        var initialMode = props.bodyMode === "text" ? "text" : "markdown";
        var descMode = React.useState(initialMode), reviewMode = React.useState(initialMode);
        var bodyId = require_body_id()(React);
        function bodySection(label, text, state, review) {
          var labelId = bodyId + (review ? "-review" : "-desc");
          if (!String(text || "").trim()) return null;
          return h(
            "section",
            { className: "wbt-body-section wb-body-section", "aria-labelledby": labelId },
            h(
              "div",
              { className: "wbt-body-heading wb-body-heading" },
              h("span", { id: labelId, className: "wb-body-label" + (review ? " wb-review-label" : "") }, label),
              h(BodyMode, { className: "wbt-body-toggle", label, mode: state[0], onChange: state[1], t, Icon: Icon2 })
            ),
            h(
              "div",
              { className: review ? "wbt-review" : "wbt-desc wb-desc" },
              h(Body, { text, mode: state[0], keyword: props.keyword })
            )
          );
        }
        var task = props.task;
        var st = statusInfo(task.status);
        var stName = props.lang === "en" ? st.en : st.zh;
        var myTags = task.tags || [];
        var openLike = String(task.status) === "0" || String(task.status) === "4";
        var isActive = openLike;
        var countdown = openLike ? daysBetween(task.targetDate) : null;
        var cdTarget = openLike && task.targetDate ? (/* @__PURE__ */ new Date(String(task.targetDate) + "T23:59:59")).getTime() : NaN;
        var tagNodes = myTags.map(function(tag) {
          return h("span", {
            key: "tag-" + String(tag.id),
            className: "wbt-tag",
            title: tag.name,
            onClick: props.onTagPick ? function(e) {
              e.stopPropagation();
              props.onTagPick(String(tag.id));
            } : null
          }, "#" + tag.name);
        });
        var meta = [];
        if (task.publishDate) meta.push(h("span", { key: "p" }, h("b", null, t.publish), " ", task.publishDate));
        if (openLike && task.targetDate) {
          meta.push(h(
            "span",
            { key: "g" },
            h("b", null, t.target),
            " ",
            task.targetDate,
            Number.isFinite(cdTarget) ? h(Countdown, { target: cdTarget }) : null
          ));
        } else if (String(task.status) === "2") {
          if (task.targetDate) meta.push(h("span", { key: "g" }, h("b", null, t.target), " ", task.targetDate));
          if (task.doneDate) meta.push(h("span", { key: "d" }, h("b", null, t.done), " ", task.doneDate));
        } else {
          if (task.targetDate) meta.push(h("span", { key: "g" }, h("b", null, t.target), " ", task.targetDate));
          if (task.shutdownDate) meta.push(h("span", { key: "s" }, h("b", null, t.shutdown), " ", task.shutdownDate));
        }
        if (Number(task.difficulty) > 0) meta.push(h("span", { key: "difficulty", className: "wbt-stars", "aria-label": t.difficulty + " " + task.difficulty + " / 5", children: stars(task.difficulty) + " " + Number(task.difficulty).toFixed(1) }));
        var ops = [];
        ops.push(h("button", {
          key: "edit",
          className: "wbt-icon",
          title: t.edit,
          "aria-label": t.edit,
          onClick: function() {
            props.onEdit(task);
          }
        }, h(Icon2, { name: "pencil", size: 14 })));
        if (isActive) {
          ops.push(h("button", { key: "p+", className: "wbt-icon", title: t.priority + " +1", onClick: function() {
            if (Number(task.priority) < 10) props.update(task, { type: "PRIORITY", priority: Math.max(1, Number(task.priority) + 1) });
          } }, h(Icon2, { name: "plus", size: 14 })));
          ops.push(h("button", { key: "p-", className: "wbt-icon", title: t.priority + " -1", onClick: function() {
            if (Number(task.priority) > 1) props.update(task, { type: "PRIORITY", priority: Number(task.priority) - 1 });
          } }, h(Icon2, { name: "minus", size: 14 })));
          ops.push(h("button", { key: "done", className: "wbt-btn wbt-act-done", onClick: function() {
            props.onDone(task);
          } }, h(Icon2, { name: "check", size: 14 }), t.complete));
          ops.push(h("button", { key: "shut", className: "wbt-btn wbt-act-close", onClick: function() {
            props.update(task, { type: "STATUS", status: "1", date: today() });
          } }, h(Icon2, { name: "stop", size: 14 }), t.shutdownOp));
        }
        ops.push(h("button", { key: "restart", className: "wbt-btn ghost", onClick: function() {
          props.onRestart(task);
        } }, h(Icon2, { name: "restart", size: 14 }), t.restart));
        ops.push(h("button", { key: "timeline", className: "wbt-btn ghost", onClick: function() {
          props.onTimeline(task);
        } }, h(Icon2, { name: "timeline", size: 14 }), t.timeline));
        if (props.onDelete) {
          ops.push(h("button", {
            key: "del",
            className: "wbt-icon wbt-danger",
            title: t.del,
            "aria-label": t.del,
            onClick: function() {
              props.onDelete(task);
            }
          }, h(Icon2, { name: "trash", size: 14 })));
        }
        var titleNode = h("div", { className: "wbt-title" }, h(Highlight, { text: task.title, keyword: props.keyword }));
        var descNode = bodySection(t.desc, task.description, descMode, false);
        var reviewNode = bodySection(t.review, task.review, reviewMode, true);
        var line1 = h(
          "div",
          { className: "wbt-line1" },
          openLike ? h("span", { className: "wbt-prio " + pClass(task.priority), children: "P" + task.priority }) : h("span", { className: "wbt-prio low", title: t.priority + " 0", children: "\u2014" }),
          h("span", { className: "wbt-badge " + st.cls, children: stName }),
          titleNode
        );
        var opsNode = h("div", { className: cx("wbt-ops", props.card && "wbt-ops-block"), key: "ops" }, ops);
        var tagBlock = tagNodes.length ? h("div", { className: "wbt-tags", key: "tags" }, tagNodes) : null;
        var wsList = Array.isArray(task.workspaces) ? task.workspaces : [];
        var wsBlock = wsList.length ? h("div", { className: "wbt-wschips", key: "workspaces" }, wsList.map(function(w) {
          return h("span", { className: "wbt-wschip wbt-wschip-ro", key: String(w.id), title: w.dir || "" }, (w.dir ? "" : "\u25E6 ") + (w.title || w.id));
        })) : null;
        var metaBlock = meta.length ? h("div", { className: "wbt-foot", key: "meta" }, h("div", { className: "wbt-meta" }, meta)) : null;
        var pathBlock = task.path && task.path.length ? h("div", { className: "wbt-taskpath", key: "path" }, h(PathCrumbs, { path: task.path, t, onPick: props.onPathPick })) : null;
        var metaZone = tagBlock || wsBlock || metaBlock || pathBlock ? h("div", { className: "wbt-metazone", key: "metazone" }, tagBlock, wsBlock, metaBlock, pathBlock) : null;
        return h(
          "div",
          { className: cx("wbt-item", props.card && "wbt-card", String(task.status) === "1" && "closed") },
          props.selectionMode ? h("input", { type: "checkbox", className: "wbt-check", checked: !!props.checked, onChange: function() {
            props.onCheck(task.id);
          } }) : null,
          h(
            "div",
            { className: "wbt-main" },
            h("div", { className: "wbt-chead" }, line1, props.card ? null : opsNode),
            metaZone,
            props.card ? opsNode : null,
            descNode,
            reviewNode
          )
        );
      }
      return TaskItem;
    };
  }
});

// packages/addons/tasks/client/timeline/timeline-copy.cjs
var require_timeline_copy = __commonJS({
  "packages/addons/tasks/client/timeline/timeline-copy.cjs"(exports2, module2) {
    "use strict";
    var english = {
      "\u5173\u95ED": "Close",
      "\u6210\u5458": "Members",
      "\u79FB\u51FA\u5F53\u524D\u4EFB\u52A1": "Remove current task",
      "\u786E\u8BA4\u79FB\u51FA\u4EFB\u52A1\uFF1F": "Remove this task from the timeline?",
      "\u4EC5\u89E3\u9664\u5173\u8054\uFF0C\u4EFB\u52A1\u4ECD\u4FDD\u7559\u3002": "Only the association is removed. The task is kept.",
      "\u786E\u8BA4\u79FB\u51FA": "Confirm removal",
      "\u5C55\u5F00\u63CF\u8FF0": "Expand description",
      "\u6536\u8D77\u63CF\u8FF0": "Collapse description",
      "\u6309\u53D1\u5E03\u65F6\u95F4\u6B63\u5E8F\u6392\u5217": "Oldest publication first",
      "\u65B0\u5EFA\u65F6\u95F4\u7EBF\u6216\u9009\u62E9\u5DF2\u6709\u65F6\u95F4\u7EBF\uFF0C\u5C06\u76F8\u5173\u4EFB\u52A1\u96C6\u4E2D\u67E5\u770B\u3002": "Create or choose a timeline to view related tasks together.",
      "\u5176\u4ED6\u65F6\u95F4\u7EBF": "Other timelines",
      "\u8BF7\u9009\u62E9\u5DF2\u6709\u65F6\u95F4\u7EBF\uFF1B\u65E0\u5339\u914D\u65F6\u53EF\u65B0\u5EFA": "Choose a timeline, or create one if there is no match",
      "\u641C\u7D22\u5DF2\u6709\u65F6\u95F4\u7EBF": "Search existing timelines",
      "\u9009\u62E9\u5DF2\u6709\u65F6\u95F4\u7EBF": "Choose an existing timeline",
      "\u4E0D\u5173\u8054\u65F6\u95F4\u7EBF": "No timeline",
      "\u5DF2\u9009\u65F6\u95F4\u7EBF": "Selected timeline",
      "\u672A\u547D\u540D\u65F6\u95F4\u7EBF": "Untitled timeline",
      " \u4E2A\u4EFB\u52A1": " tasks",
      "\u4E0A\u4E00\u9875": "Previous page",
      "\u4E0B\u4E00\u9875": "Next page",
      "\u91CD\u8BD5": "Retry",
      "\u7F16\u8F91\u65F6\u95F4\u7EBF": "Edit timeline",
      "\u65B0\u5EFA\u65F6\u95F4\u7EBF": "New timeline",
      "\u65F6\u95F4\u7EBF\u6807\u9898": "Timeline title",
      "\u65F6\u95F4\u7EBF\u63CF\u8FF0": "Timeline description",
      "\u53D6\u6D88": "Cancel",
      "\u4FDD\u5B58\u4E2D\u2026": "Saving\u2026",
      "\u4FDD\u5B58\u65F6\u95F4\u7EBF": "Save timeline",
      "\u4EFB\u52A1\u65F6\u95F4\u7EBF": "Task timeline",
      "\u52A0\u8F7D\u4E2D\u2026": "Loading\u2026",
      "\u6682\u65E0\u63CF\u8FF0": "No description",
      "\u79FB\u51FA\u65F6\u95F4\u7EBF": "Remove from timeline",
      "\u6DFB\u52A0\u65B0\u4EFB\u52A1": "Add a new task",
      "\u6682\u65E0\u53EF\u663E\u793A\u6210\u5458": "No visible members",
      "\u6CA1\u6709\u5173\u8054\u65F6\u95F4\u7EBF": "No associated timeline",
      "\u5173\u8054\u6240\u9009\u65F6\u95F4\u7EBF": "Associate selected timeline",
      "\u6DFB\u52A0\u5DF2\u6709\u4EFB\u52A1": "Add existing tasks",
      "\u9009\u4E2D\u7684\u4EFB\u52A1\u5C06\u5173\u8054\u5230\u6B64\u65F6\u95F4\u7EBF\uFF1B\u539F\u6709\u5173\u8054\u4F1A\u88AB\u66FF\u6362\u3002": "Selected tasks will join this timeline, replacing any existing association.",
      "\u641C\u7D22\u5DF2\u6709\u4EFB\u52A1": "Search existing tasks",
      "\u5173\u8054\u4EFB\u52A1 (": "Associate tasks (",
      "\u590D\u5236 ID": "Copy ID",
      "\u5220\u9664\u65F6\u95F4\u7EBF": "Delete timeline",
      "\u5220\u9664\u65F6\u95F4\u7EBF\u5C06\u79FB\u51FA\u5168\u90E8\u6210\u5458\uFF0C\u4FDD\u7559\u4EFB\u52A1\u53CA\u91CD\u542F\u94FE\u3002": "Deleting this timeline detaches all members. Tasks and restart chains are preserved.",
      "\u53D6\u6D88\u5220\u9664": "Cancel deletion",
      "\u786E\u8BA4\u5220\u9664\u65F6\u95F4\u7EBF": "Confirm timeline deletion",
      "\u8BF7\u5148\u624B\u52A8\u5EFA\u7ACB\u5E76\u5173\u8054\u65F6\u95F4\u7EBF\uFF0C\u518D\u91CD\u542F": "Manually create and associate a timeline before restarting",
      "\u8BF7\u9009\u62E9\u5DF2\u6709\u65F6\u95F4\u7EBF": "Choose an existing timeline",
      "\u5411\u5DF2\u6709\u65F6\u95F4\u7EBF\u6DFB\u52A0\u4EFB\u52A1": "Add a task to an existing timeline",
      " \xB7 \u81EA\u52A8\u7EE7\u627F\u539F\u65F6\u95F4\u7EBF": " \xB7 Inherits the original timeline",
      "\u9009\u62E9\u5DF2\u6709\u65F6\u95F4\u7EBF\uFF08\u542B\u7A7A\u7EBF\u548C\u5355\u6210\u5458\u7EBF\uFF09": "Choose an existing timeline (including empty and single-task timelines)"
    };
    module2.exports = function(t) {
      return function(text) {
        return t && t.timeline === "Timeline" ? english[text] || text : text;
      };
    };
  }
});

// packages/addons/tasks/client/timeline/timeline-controls.cjs
var require_timeline_controls = __commonJS({
  "packages/addons/tasks/client/timeline/timeline-controls.cjs"(exports2, module2) {
    "use strict";
    function result(r) {
      if (!r || !r.ok) throw Error(r && r.error || "\u8BF7\u6C42\u5931\u8D25");
      return r.result;
    }
    module2.exports = function(React) {
      var h = React.createElement;
      function Picker(p) {
        var tr = require_timeline_copy()(p.t);
        var ds = React.useState({ records: [], total: 0 }), data = ds[0], setData = ds[1];
        var ps = React.useState(1), page = ps[0], setPage = ps[1];
        var qs = React.useState(""), query = qs[0], setQuery = qs[1];
        var es = React.useState(""), error = es[0], setError = es[1];
        var bs = React.useState(false), busy = bs[0], setBusy = bs[1];
        var rs = React.useState(0), retry = rs[0], setRetry = rs[1];
        var as = React.useState(-1), active = as[0], setActive = as[1];
        var list = React.useRef(null);
        React.useEffect(function() {
          var cancelled = false;
          setBusy(true);
          setError("");
          p.api.call("tasks.timelines", { includeSingletons: true, titleKey: query, pageNumber: page, pageSize: 20 }).then(result).then(function(r) {
            if (!cancelled) {
              setData(r);
              setActive(-1);
              setBusy(false);
            }
          }).catch(function(e) {
            if (!cancelled) {
              setError(String(e.message || e));
              setBusy(false);
            }
          });
          return function() {
            cancelled = true;
          };
        }, [p.api, page, query, retry]);
        var rows = data.records || [], pages = Math.max(1, Math.ceil(data.total / 20));
        function choose(row) {
          if (row) p.onChange(row.timelineId || row.timelineKey, row.title || "");
        }
        function optionAt(index) {
          var nodes = list.current ? list.current.querySelectorAll('[role="option"]') : [];
          return nodes[index];
        }
        function move(next) {
          if (!rows.length) return;
          var index = Math.max(0, Math.min(rows.length - 1, next));
          setActive(index);
          var node = optionAt(index);
          if (node) node.focus();
        }
        function focusedIndex() {
          var nodes = list.current ? list.current.querySelectorAll('[role="option"]') : [];
          return Array.prototype.indexOf.call(nodes, document.activeElement);
        }
        function onKeyDown(e) {
          var base = focusedIndex() >= 0 ? focusedIndex() : active;
          if (e.key === "ArrowDown") {
            e.preventDefault();
            move(base + 1);
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            move(base <= 0 ? 0 : base - 1);
          } else if (e.key === "Home") {
            e.preventDefault();
            move(0);
          } else if (e.key === "End") {
            e.preventDefault();
            move(rows.length - 1);
          } else if (e.key === "Enter") {
            if (document.activeElement && document.activeElement.getAttribute("role") === "option") return;
            e.preventDefault();
            choose(rows[active < 0 ? 0 : active]);
          }
        }
        return h(
          "div",
          { className: "wbt-timeline-picker" },
          h(
            "label",
            { className: "wbt-field" },
            tr("\u641C\u7D22\u5DF2\u6709\u65F6\u95F4\u7EBF"),
            h("input", { className: "wbt-input", "aria-label": tr("\u641C\u7D22\u5DF2\u6709\u65F6\u95F4\u7EBF"), value: query, onChange: function(e) {
              setQuery(e.target.value);
              setPage(1);
            } })
          ),
          h("div", { className: "wbt-picker-selected", role: "status" }, p.value ? tr("\u5DF2\u9009\u65F6\u95F4\u7EBF") + "\uFF1A" + (p.title || p.value) : tr("\u5C1A\u672A\u9009\u62E9\u65F6\u95F4\u7EBF")),
          h(
            "div",
            { ref: list, className: "wbt-picker-list", role: "listbox", "aria-label": tr("\u9009\u62E9\u5DF2\u6709\u65F6\u95F4\u7EBF"), "aria-busy": busy ? "true" : "false", onKeyDown },
            busy ? h("p", { className: "wbt-picker-note" }, tr("\u52A0\u8F7D\u4E2D\u2026")) : null,
            error ? h("div", { className: "wbt-picker-note wbt-err", role: "alert" }, error, h("button", { type: "button", className: "wbt-btn", onClick: function() {
              setRetry(retry + 1);
            } }, tr("\u91CD\u8BD5"))) : null,
            !busy && !error && !rows.length ? h("p", { className: "wbt-picker-note" }, query ? tr("\u6CA1\u6709\u5339\u914D\u7684\u65F6\u95F4\u7EBF\uFF0C\u53EF\u5728\u4E0B\u65B9\u65B0\u5EFA\u3002") : tr("\u6682\u65E0\u65F6\u95F4\u7EBF\uFF0C\u53EF\u5728\u4E0B\u65B9\u65B0\u5EFA\u3002")) : null,
            !busy && !error ? rows.map(function(row, index) {
              var id = row.timelineId || row.timelineKey, selected = id === p.value;
              return h(
                "button",
                { key: id, type: "button", role: "option", "aria-selected": selected ? "true" : "false", "data-id": id, title: row.title || tr("\u672A\u547D\u540D\u65F6\u95F4\u7EBF"), tabIndex: index === active ? 0 : -1, className: "wbt-picker-opt" + (selected ? " selected" : ""), onMouseEnter: function() {
                  setActive(index);
                }, onClick: function() {
                  choose(row);
                } },
                h("span", { className: "wbt-picker-opt-title" }, row.title || tr("\u672A\u547D\u540D\u65F6\u95F4\u7EBF")),
                h("span", { className: "wbt-picker-opt-count" }, row.taskCount + tr(" \u4E2A\u4EFB\u52A1"))
              );
            }) : null
          ),
          h(
            "div",
            { className: "wbt-timeline-pager" },
            h("button", { type: "button", className: "wbt-btn", disabled: busy || page <= 1, onClick: function() {
              setPage(page - 1);
            } }, tr("\u4E0A\u4E00\u9875")),
            h("span", null, page + " / " + pages),
            h("button", { type: "button", className: "wbt-btn", disabled: busy || page >= pages, onClick: function() {
              setPage(page + 1);
            } }, tr("\u4E0B\u4E00\u9875"))
          )
        );
      }
      function Editor(p) {
        var tr = require_timeline_copy()(p.t);
        var item = p.item, pending = React.useRef(false);
        var ts = React.useState(item && item.title || ""), title = ts[0], setTitle = ts[1];
        var ds = React.useState(item && item.description || ""), description = ds[0], setDescription = ds[1];
        var bs = React.useState(false), busy = bs[0], setBusy = bs[1];
        var es = React.useState(""), error = es[0], setError = es[1];
        function save() {
          if (pending.current) return;
          pending.current = true;
          setBusy(true);
          setError("");
          var args = { title, description };
          if (item) args.timelineId = item.timelineId || item.timelineKey || item.id;
          p.api.call(item ? "taskTimelines.update" : "taskTimelines.create", args).then(result).then(function(r) {
            p.onSaved(r.timeline);
          }).catch(function(e) {
            pending.current = false;
            setError(String(e.message || e));
            setBusy(false);
          });
        }
        return h("div", { className: "wbt-modal-mask", onKeyDown: function(e) {
          if (e.key === "Escape" && !busy) {
            e.stopPropagation();
            p.onClose();
          }
        } }, h(
          "div",
          { className: "wbt-modal", role: "dialog", "aria-modal": true, "aria-label": item ? tr("\u7F16\u8F91\u65F6\u95F4\u7EBF") : tr("\u65B0\u5EFA\u65F6\u95F4\u7EBF") },
          h("div", { className: "wbt-modal-head" }, h("h3", null, item ? tr("\u7F16\u8F91\u65F6\u95F4\u7EBF") : tr("\u65B0\u5EFA\u65F6\u95F4\u7EBF"))),
          h("label", { className: "wbt-field" }, tr("\u65F6\u95F4\u7EBF\u6807\u9898"), h("input", { className: "wbt-input", autoFocus: true, value: title, placeholder: tr("\u672A\u547D\u540D\u65F6\u95F4\u7EBF"), onChange: function(e) {
            setTitle(e.target.value);
          } })),
          h("label", { className: "wbt-field" }, tr("\u65F6\u95F4\u7EBF\u63CF\u8FF0"), h("textarea", { className: "wbt-textarea", value: description, onChange: function(e) {
            setDescription(e.target.value);
          } })),
          error ? h("p", { role: "alert", className: "wbt-err" }, error) : null,
          h("div", { className: "wbt-modal-foot" }, h("button", { className: "wbt-btn", disabled: busy, onClick: p.onClose }, tr("\u53D6\u6D88")), h("button", { className: "wbt-btn primary", disabled: busy, onClick: save }, busy ? tr("\u4FDD\u5B58\u4E2D\u2026") : tr("\u4FDD\u5B58\u65F6\u95F4\u7EBF")))
        ));
      }
      return { Picker, Editor, result };
    };
  }
});

// packages/addons/tasks/client/workspace/workspace-select.cjs
var require_workspace_select = __commonJS({
  "packages/addons/tasks/client/workspace/workspace-select.cjs"(exports2, module2) {
    module2.exports = function createWorkspaceSelect(React) {
      var h = React.createElement;
      var COPY = {
        zh: { label: "\u5DE5\u4F5C\u533A", empty: "\u672A\u5173\u8054\u5DE5\u4F5C\u533A", search: "\u641C\u7D22\u5DE5\u4F5C\u533A", none: "\u6CA1\u6709\u5339\u914D\u7684\u5DE5\u4F5C\u533A", createHint: "\u65B0\u5EFA\u5DE5\u4F5C\u533A", title: "\u6807\u9898", dir: "\u76EE\u5F55\uFF08\u672C\u673A\u7EDD\u5BF9\u8DEF\u5F84\uFF0C\u53EF\u7A7A\uFF09", desc: "\u63CF\u8FF0\uFF08\u53EF\u7A7A\uFF09", create: "\u521B\u5EFA\u5E76\u5173\u8054", cancel: "\u53D6\u6D88", loading: "\u52A0\u8F7D\u4E2D\u2026", fail: "\u5DE5\u4F5C\u533A\u5217\u8868\u52A0\u8F7D\u5931\u8D25", remove: "\u79FB\u9664", dirInvalid: "\u76EE\u5F55\u5FC5\u987B\u662F\u672C\u673A\u7EDD\u5BF9\u8DEF\u5F84\uFF08/ \u6216 X:\\\uFF09" },
        en: { label: "Workspaces", empty: "No workspace", search: "Search workspaces", none: "No matching workspace", createHint: "New workspace", title: "Title", dir: "Directory (absolute local path, optional)", desc: "Description (optional)", create: "Create and link", cancel: "Cancel", loading: "Loading\u2026", fail: "Failed to load workspaces", remove: "Remove", dirInvalid: "Directory must be an absolute local path (/ or X:\\)" }
      };
      function text(lang, key) {
        return (COPY[lang] || COPY.zh)[key];
      }
      function useWorkspaces(api) {
        var state = React.useState({ list: [], loading: true, error: "" });
        var snap = state[0], set = state[1];
        function reload() {
          set(function(prev) {
            return Object.assign({}, prev, { loading: true, error: "" });
          });
          api.call("taskWorkspaces.list", { pageSize: 100 }).then(function(r) {
            if (!r || !r.ok) {
              set({ list: [], loading: false, error: r && r.error || "list failed" });
              return;
            }
            set({ list: r.result && r.result.records || [], loading: false, error: "" });
          }, function(e) {
            set({ list: [], loading: false, error: e && e.message || "list failed" });
          });
        }
        React.useEffect(reload, []);
        return { list: snap.list, loading: snap.loading, error: snap.error, reload };
      }
      function WorkspaceSelect(props) {
        var lang = props.lang === "en" ? "en" : "zh";
        var t = function(key) {
          return text(lang, key);
        };
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
        ws.list.forEach(function(w) {
          byId[String(w.id)] = w;
        });
        var keyword = query.trim().toLowerCase();
        var candidates = ws.list.filter(function(w) {
          if (!keyword) return true;
          return [w.title, w.name, w.description].some(function(v) {
            return String(v || "").toLowerCase().indexOf(keyword) >= 0;
          });
        });
        function toggle(id) {
          var key = String(id);
          var next = selected.indexOf(key) >= 0 ? selected.filter(function(x) {
            return x !== key;
          }) : selected.concat([key]);
          if (props.onChange) props.onChange(next);
        }
        function submitCreate() {
          if (!String(draft.title).trim()) {
            setErr(t("title") + " *");
            return;
          }
          setErr("");
          props.api.call("taskWorkspaces.create", { title: String(draft.title).trim(), dir: String(draft.dir || "").trim() || null, description: String(draft.description || "") }).then(function(r) {
            if (!r || !r.ok) {
              setErr(r && r.error || "create failed");
              return;
            }
            var id = String(r.result.workspace.id);
            setCreating(false);
            setDraft({ title: "", dir: "", description: "" });
            ws.reload();
            if (props.onChange) props.onChange(selected.concat([id]));
          }, function(e) {
            setErr(e && e.message || "create failed");
          });
        }
        return h(
          "div",
          { className: "wbt-field full wbt-wspicker" },
          h("span", null, t("label")),
          h(
            "div",
            { className: "wbt-wschips" },
            selected.length ? selected.map(function(id) {
              var w = byId[id] || { id, title: id };
              return h(
                "span",
                { className: "wbt-wschip", key: id, title: w.dir || "" },
                h("span", null, w.title || id),
                h("button", { type: "button", className: "wbt-icon", "aria-label": t("remove") + " " + (w.title || id), onClick: function() {
                  toggle(id);
                } }, "\xD7")
              );
            }) : h("span", { className: "wbt-hint" }, t("empty"))
          ),
          h(
            "div",
            { className: "wbt-wsrow" },
            h("input", { className: "wbt-input", value: query, placeholder: t("search"), onChange: function(e) {
              setQuery(e.target.value);
            } }),
            h("button", { type: "button", className: "wbt-btn ghost", onClick: function() {
              setCreating(!creating);
            } }, t("createHint"))
          ),
          ws.loading ? h("div", { className: "wbt-hint" }, t("loading")) : null,
          ws.error ? h("div", { className: "wbt-err" }, t("fail")) : null,
          h(
            "div",
            { className: "wbt-wslist", role: "listbox", "aria-multiselectable": "true" },
            !ws.loading && !candidates.length ? h("div", { className: "wbt-hint" }, t("none")) : null,
            candidates.map(function(w) {
              var id = String(w.id), on = selected.indexOf(id) >= 0;
              return h(
                "button",
                { type: "button", role: "option", key: id, "aria-selected": on, className: "wbt-wsopt" + (on ? " on" : ""), title: w.dir || "", onClick: function() {
                  toggle(id);
                } },
                h("span", { className: "wbt-wsopt-title" }, w.title || id),
                h("span", { className: "wbt-wsopt-meta" }, (w.taskCount || 0) + " \xB7 " + (w.dir || "\u2014"))
              );
            })
          ),
          creating ? h(
            "div",
            { className: "wbt-wscreate" },
            h("input", { className: "wbt-input", value: draft.title, placeholder: t("title") + " *", onChange: function(e) {
              setDraft(Object.assign({}, draft, { title: e.target.value }));
            } }),
            h("input", { className: "wbt-input", value: draft.dir, placeholder: t("dir"), onChange: function(e) {
              setDraft(Object.assign({}, draft, { dir: e.target.value }));
            } }),
            h("input", { className: "wbt-input", value: draft.description, placeholder: t("desc"), onChange: function(e) {
              setDraft(Object.assign({}, draft, { description: e.target.value }));
            } }),
            err ? h("div", { className: "wbt-err" }, err) : null,
            h(
              "div",
              { className: "wbt-wsrow" },
              h("button", { type: "button", className: "wbt-btn primary", onClick: submitCreate }, t("create")),
              h("button", { type: "button", className: "wbt-btn ghost", onClick: function() {
                setCreating(false);
                setErr("");
              } }, t("cancel"))
            )
          ) : null
        );
      }
      function WorkspaceChips(props) {
        var list = Array.isArray(props.list) ? props.list : [];
        if (!list.length) return null;
        return h("div", { className: "wbt-wschips" }, list.map(function(w) {
          return h("span", { className: "wbt-wschip", key: String(w.id), title: w.dir || "" }, w.title || w.id);
        }));
      }
      return { WorkspaceSelect, WorkspaceChips, useWorkspaces, text };
    };
  }
});

// packages/addons/tasks/client/item/difficulty-field.cjs
var require_difficulty_field = __commonJS({
  "packages/addons/tasks/client/item/difficulty-field.cjs"(exports2, module2) {
    "use strict";
    module2.exports = function(React) {
      var h = React.createElement;
      return function difficultyField(t, value, onChange, id) {
        var n = Number(value) || 0, full = Math.floor(n), half = n - full >= 0.5;
        var stars = "\u2605".repeat(full) + (half ? "\u2BEA" : "") + "\u2606".repeat(Math.max(0, 5 - full - (half ? 1 : 0)));
        return h(
          "div",
          { className: "wbt-field full" },
          h("label", { htmlFor: id }, t.difficulty + " (0\u20135)"),
          h(
            "div",
            { className: "wbt-row" },
            h("input", {
              id,
              className: "wbt-input",
              type: "number",
              min: 0,
              max: 5,
              step: 0.5,
              "aria-label": t.difficulty,
              "aria-describedby": id + "-hint",
              placeholder: t.difficultyUnsetHint,
              value,
              onChange: function(e) {
                var raw = e.target.value;
                onChange(raw === "" ? "" : Math.max(0, Math.min(5, Number(raw) || 0)));
              }
            }),
            h("span", { className: "wbt-stars", "aria-hidden": true }, n > 0 ? stars : t.difficultyUnset),
            h("b", null, n.toFixed(1))
          ),
          h("small", { id: id + "-hint" }, t.difficultyUnsetHint),
          h("details", null, h("summary", null, t.difficultyGuideTitle), h("p", null, t.difficultyGuide))
        );
      };
    };
  }
});

// packages/addons/tasks/client/modals/ownership.cjs
var require_ownership = __commonJS({
  "packages/addons/tasks/client/modals/ownership.cjs"(exports2, module2) {
    "use strict";
    var limits = require_limits();
    function tables(nodes, parents) {
      var out = [], prefix = parents || [];
      (nodes || []).forEach(function(n) {
        if (n.deletedAt || n.deleted_at) return;
        var path = prefix.concat(String(n.name || ""));
        if (String(n.type) === "1") out.push({ id: String(n.id), name: n.name, path: path.join(" / "), description: n.description || "" });
        else out = out.concat(tables(n.children, path));
      });
      return out;
    }
    function preview(tree, path, descriptions) {
      var parts = String(path || "").split("/").map(function(s) {
        return s.trim();
      });
      if (!path || path.length > limits.PATH_LEN_MAX || parts.length > limits.PATH_MAX || parts.some(function(s) {
        return !s || s === "." || s === ".." || s.length > limits.NAME_MAX;
      })) return { error: "\u8BF7\u8F93\u5165\u76F8\u5BF9\u4E8E\u6839\u7684\u6709\u6548\u8DEF\u5F84\uFF1B\u6BCF\u6BB5 1\u2013" + limits.NAME_MAX + " \u5B57\u7B26\uFF0C\u6700\u591A " + limits.PATH_MAX + " \u6BB5\u3001\u603B\u957F " + limits.PATH_LEN_MAX + " \u5B57\u7B26\uFF0C\u4E0D\u542B\u9996\u5C3E\u659C\u6760\u3002", nodes: [] };
      var roots = (tree || []).filter(function(n) {
        return String(n.type) === "2" && !n.deletedAt && !n.deleted_at;
      });
      if (roots.length !== 1) return { error: "\u4EFB\u52A1\u6811\u7F3A\u5C11\u552F\u4E00\u6709\u6548\u6839\uFF0C\u8BF7\u5237\u65B0\u6216\u4FEE\u590D\u4EFB\u52A1\u6811\u540E\u91CD\u8BD5\u3002", nodes: [] };
      var level = roots[0].children || [], nodes = [], error = "";
      parts.forEach(function(name, i) {
        var matches = level.filter(function(n) {
          return n.name === name && !n.deletedAt && !n.deleted_at;
        });
        var type = i === parts.length - 1 ? "1" : "0", existing = matches[0];
        if (matches.length > 1) error = "\u540C\u7EA7\u540D\u79F0\u5B58\u5728\u6B67\u4E49\uFF0C\u8BF7\u9009\u62E9\u5DF2\u6709\u4EFB\u52A1\u8868\u6216\u4FEE\u6B63\u8DEF\u5F84\u3002";
        if (existing && String(existing.type) !== type) error = "\u8DEF\u5F84\u7C7B\u578B\u51B2\u7A81\uFF1A\u4E2D\u95F4\u8282\u70B9\u5FC5\u987B\u4E3A\u7EC4\uFF0C\u672B\u6BB5\u5FC5\u987B\u4E3A\u8868\uFF0C\u4E0D\u80FD\u5728\u8868\u4E0B\u5EFA\u8282\u70B9\u3002";
        if (!existing && !String(descriptions[i] || "").trim()) error = error || "\u8BF7\u586B\u5199\u6BCF\u4E2A\u65B0\u8282\u70B9\u7684\u804C\u8D23\u63CF\u8FF0\u3002";
        if (String(descriptions[i] || "").length > 2e3) error = "\u804C\u8D23\u63CF\u8FF0\u6700\u591A 2000 \u5B57\u3002";
        nodes.push({ name, type, existing: !!existing });
        level = existing ? existing.children || [] : [];
      });
      return { parts, nodes, error, path: (roots[0] ? roots[0].name + " / " : "") + parts.join(" / ") };
    }
    function receipt(result) {
      var task = result && (result.task || result) || {};
      var path = task.pathSegments;
      var text = Array.isArray(path) ? path.map(function(p) {
        return p.name || p;
      }).join(" / ") : "";
      if (!text) text = Array.isArray(task.tablePath) ? task.tablePath.join(" / ") : task.tablePath || task.tableName || "";
      return (task.deduped || result && result.deduped ? "\u5DF2\u5B58\u5728" : "\u5DF2\u4FDD\u5B58") + (text ? " \xB7 \u5DF2\u653E\u5165 " + text : "") + "\uFF1B\u53EF\u5728\u7F16\u8F91\u4E2D\u7EA0\u6B63\u5F52\u5C5E";
    }
    module2.exports = { tables, preview, receipt };
  }
});

// packages/addons/tasks/client/modals/table-picker.cjs
var require_table_picker = __commonJS({
  "packages/addons/tasks/client/modals/table-picker.cjs"(exports2, module2) {
    "use strict";
    function rows(tree, parents, out) {
      var result = out || [], prefix = parents || [];
      (tree || []).forEach(function(n) {
        if (n.deletedAt || n.deleted_at) return;
        var path = prefix.concat(String(n.name || ""));
        result.push({
          id: String(n.id),
          name: String(n.name || ""),
          type: String(n.type),
          depth: prefix.length,
          path: path.join(" / "),
          groupPath: prefix.join(" / "),
          description: n.description || ""
        });
        if (String(n.type) !== "1") rows(n.children, path, result);
      });
      return result;
    }
    function visible(tree, query, recommended) {
      var keyword = String(query || "").trim().toLowerCase();
      var all = rows(tree), rec = all.find(function(n) {
        return n.type === "1" && n.id === String(recommended);
      });
      var shown = all.filter(function(n) {
        return !keyword || n.path.toLowerCase().indexOf(keyword) >= 0;
      });
      if (rec && shown.indexOf(rec) >= 0) shown = [rec].concat(shown.filter(function(n) {
        return n !== rec;
      }));
      return shown;
    }
    module2.exports = function(React) {
      var h = React.createElement;
      return function TablePicker(props) {
        var qs = React.useState(""), query = qs[0], setQuery = qs[1];
        var activeState = React.useState(""), active = activeState[0], setActive = activeState[1];
        var input = React.useRef(null), list = React.useRef(null), uid = React.useId();
        var shown = visible(props.tree, query, props.recommended), options = shown.filter(function(n) {
          return n.type === "1";
        });
        var picked = rows(props.tree).find(function(n) {
          return n.type === "1" && n.id === String(props.value);
        });
        var current = options.find(function(n) {
          return n.id === active;
        }) || options.find(function(n) {
          return n.id === String(props.value);
        }) || options[0];
        function optionId(n) {
          return uid + "-table-" + n.id;
        }
        React.useEffect(function() {
          if (input.current) input.current.focus();
        }, []);
        React.useEffect(function() {
          if (!list.current || !current) return;
          var node = list.current.ownerDocument.getElementById(optionId(current));
          if (node && node.scrollIntoView) node.scrollIntoView({ block: "nearest" });
        }, [current && current.id, query]);
        function key(e) {
          if (e.key === "Escape") {
            e.preventDefault();
            e.stopPropagation();
            if (props.onClose) props.onClose();
            return;
          }
          if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault();
            e.stopPropagation();
            var at = options.indexOf(current), delta = e.key === "ArrowDown" ? 1 : -1;
            if (options.length) setActive(options[(at + delta + options.length) % options.length].id);
          }
          if (e.key === "Enter" && current) {
            e.preventDefault();
            e.stopPropagation();
            props.onChange(current.id);
          }
        }
        return h(
          "div",
          { className: "wbt-table-picker", onKeyDown: key },
          h("input", {
            ref: input,
            className: "wbt-input",
            "aria-label": "\u641C\u7D22\u4EFB\u52A1\u8868\u540D\u79F0\u6216\u5B8C\u6574\u8DEF\u5F84",
            placeholder: "\u641C\u7D22\u4EFB\u52A1\u8868\u540D\u79F0\u6216\u5B8C\u6574\u8DEF\u5F84",
            value: query,
            role: "combobox",
            "aria-expanded": true,
            "aria-controls": uid,
            "aria-autocomplete": "list",
            "aria-activedescendant": current ? optionId(current) : void 0,
            onChange: function(e) {
              setQuery(e.target.value);
              setActive("");
            }
          }),
          h("div", { className: "wbt-batch" }, h(
            "div",
            {
              ref: list,
              id: uid,
              role: "listbox",
              "aria-label": "\u76EE\u6807\u4EFB\u52A1\u8868",
              tabIndex: 0,
              "aria-activedescendant": current ? optionId(current) : void 0,
              className: "wbt-batch-body"
            },
            shown.map(function(n) {
              var table = n.type === "1", selected = n.id === String(props.value);
              return h(
                "div",
                {
                  key: n.id,
                  title: n.path,
                  id: table ? optionId(n) : void 0,
                  role: table ? "option" : "presentation",
                  "aria-label": table ? n.name + "\uFF0C" + n.groupPath : void 0,
                  "aria-selected": table ? selected : void 0,
                  className: "wbt-bpick" + (!table ? " wbt-bgroup" : "") + (selected ? " on" : "") + (table && current && current.id === n.id ? " keyboard" : ""),
                  style: { paddingLeft: 2 + n.depth * 15 + "px", cursor: table ? "pointer" : "default" },
                  onClick: table ? function() {
                    setActive(n.id);
                    props.onChange(n.id);
                  } : void 0
                },
                !table ? h("span", { "aria-hidden": true }, "\u25B8") : null,
                h(
                  "span",
                  { className: "wbt-bpick-main" },
                  h("span", { className: "wbt-bpick-name" }, n.name),
                  table && n.id === String(props.recommended) ? h("span", { className: "wbt-mhint" }, "\u5F53\u524D\u4E0A\u4E0B\u6587\u5EFA\u8BAE") : null
                ),
                table ? h("span", { className: "wbt-bpick-check", "aria-hidden": true }, selected ? "\u2713" : "") : null
              );
            }),
            !shown.length ? h("div", { className: "wbt-batch-empty" }, "\u6CA1\u6709\u5339\u914D\u7684\u4EFB\u52A1\u8868") : null
          )),
          h("div", { className: "wbt-picker-detail", role: "status" }, picked ? h(
            React.Fragment,
            null,
            h("div", null, "\u76EE\u6807\u4EFB\u52A1\u8868\uFF1A" + picked.path),
            h("div", null, "\u804C\u8D23\uFF1A" + (picked.description || "\u6682\u65E0\u804C\u8D23\u63CF\u8FF0"))
          ) : "\u8BF7\u5148\u9009\u62E9\u76EE\u6807\u4EFB\u52A1\u8868\uFF0C\u518D\u786E\u8BA4\u63D0\u4EA4\u3002"),
          props.onClose ? h("button", { type: "button", className: "wbt-btn ghost", onClick: props.onClose }, "\u6536\u8D77\u9009\u62E9\u5668") : null
        );
      };
    };
    module2.exports.rows = rows;
    module2.exports.visible = visible;
  }
});

// packages/addons/tasks/client/modals/ownership-fields.cjs
var require_ownership_fields = __commonJS({
  "packages/addons/tasks/client/modals/ownership-fields.cjs"(exports2, module2) {
    "use strict";
    var limits = require_limits();
    var ownership = require_ownership();
    module2.exports = function(React) {
      var h = React.createElement;
      var Picker = require_table_picker()(React);
      function Selection(props) {
        var state = React.useState(false), open = state[0], setOpen = state[1], trigger = React.useRef(null);
        var chosen = ownership.tables(props.tree).find(function(x) {
          return x.id === props.form.tableId;
        });
        function close() {
          setOpen(false);
          if (trigger.current) trigger.current.focus();
        }
        return h(
          "div",
          null,
          h("div", { className: "wbt-picker-detail" }, props.edit ? "\u5F53\u524D\u5F52\u5C5E\uFF1A" + props.current : "\u76EE\u6807\u4EFB\u52A1\u8868 *"),
          h("button", {
            ref: trigger,
            type: "button",
            className: "wbt-btn",
            disabled: !!props.form.newPath,
            "aria-expanded": open,
            onClick: function() {
              setOpen(!open);
            }
          }, props.edit ? "\u66F4\u6362\u4EFB\u52A1\u8868" : "\u9009\u62E9\u76EE\u6807\u4EFB\u52A1\u8868"),
          open && !props.form.newPath ? h(Picker, {
            tree: props.tree,
            value: props.form.tableId,
            recommended: props.recommended,
            onChange: function(id) {
              props.set("tableId", props.edit && id === String(props.currentId) ? "" : id);
            },
            onClose: close
          }) : null,
          chosen ? h(
            "div",
            { className: "wbt-picker-detail", role: "status" },
            (props.edit ? "\u5C06\u79FB\u52A8\u5230\uFF1A" : "\u5DF2\u9009\u62E9\uFF1A") + chosen.path,
            props.edit ? h("button", { type: "button", className: "wbt-btn ghost", onClick: function() {
              props.set("tableId", "");
              close();
            } }, "\u64A4\u9500\uFF0C\u4FDD\u7559\u539F\u4F4D") : null
          ) : h("div", { className: "wbt-mhint" }, props.edit ? "\u672A\u66F4\u6362\uFF0C\u4FDD\u7559\u5F53\u524D\u5F52\u5C5E\u3002" : props.form.newPath ? "\u8BF7\u786E\u8BA4\u65B0\u5EFA\u8DEF\u5F84\u3002" : "\u8BF7\u5148\u9009\u62E9\u76EE\u6807\u4EFB\u52A1\u8868\uFF0C\u518D\u786E\u8BA4\u63D0\u4EA4\u3002")
        );
      }
      return function fields(props) {
        var form = props.form, set = props.set;
        var plan = ownership.preview(props.tree, form.tablePath, form.pathDescriptions || []);
        return h(
          "div",
          { className: "wbt-field full" },
          h(Selection, { form, set, tree: props.tree, recommended: props.recommended, edit: props.edit, current: props.current, currentId: props.currentId }),
          !props.edit ? h("label", { className: "wbt-check" }, h("input", {
            type: "checkbox",
            "aria-label": "\u6CA1\u6709\u5408\u9002\u7684\u8868\uFF1F\u65B0\u5EFA\u8282\u70B9",
            checked: !!form.newPath,
            onChange: function(e) {
              props.setMany({ newPath: e.target.checked, tableId: "", confirmed: false });
            }
          }), "\u6CA1\u6709\u5408\u9002\u7684\u8868\uFF1F\u65B0\u5EFA\u8282\u70B9") : null,
          form.newPath ? h(
            "div",
            null,
            h("label", { className: "wbt-field full" }, "\u65B0\u8DEF\u5F84\uFF08\u76F8\u5BF9\u4E8E\u6839\uFF1B\u4EE5 / \u5206\u9694\uFF09", h("input", {
              className: "wbt-input",
              "aria-label": "\u65B0\u8DEF\u5F84",
              value: form.tablePath,
              maxLength: limits.PATH_LEN_MAX,
              onChange: function(e) {
                props.setMany({ tablePath: e.target.value, pathDescriptions: [], confirmed: false });
              }
            })),
            h("div", { className: "wbt-mhint wbt-ownership-preview", title: plan.path }, "\u9884\u89C8\uFF1A" + (plan.path || "\u8BF7\u8F93\u5165\u8DEF\u5F84") + "\u3002\u5DF2\u6709\u8282\u70B9\u4F1A\u590D\u7528\uFF0C\u63D0\u4EA4\u524D\u4E0D\u4F1A\u5199\u5165\u3002"),
            plan.nodes.map(function(node, i) {
              return h(
                "label",
                { key: i, className: "wbt-field full" },
                h("span", { title: node.name }, (node.existing ? "\u590D\u7528" : "\u65B0\u5EFA") + (node.type === "1" ? "\u8868\uFF1A" : "\u7EC4\uFF1A") + node.name),
                !node.existing ? h("textarea", {
                  className: "wbt-textarea",
                  "aria-label": "\u8282\u70B9\u804C\u8D23 " + (i + 1),
                  maxLength: 2e3,
                  value: form.pathDescriptions[i] || "",
                  onChange: function(e) {
                    var values = form.pathDescriptions.slice();
                    values[i] = e.target.value;
                    props.setMany({ pathDescriptions: values, confirmed: false });
                  }
                }) : null
              );
            }),
            plan.error ? h("div", { className: "wbt-err", role: "alert" }, plan.error) : null,
            h("label", { className: "wbt-check" }, h("input", {
              type: "checkbox",
              "aria-label": "\u786E\u8BA4\u65B0\u5EFA\u8DEF\u5F84",
              checked: !!form.confirmed,
              disabled: !!plan.error,
              onChange: function(e) {
                set("confirmed", e.target.checked);
              }
            }), "\u786E\u8BA4\u4EE5\u4E0A\u8DEF\u5F84\u4E0E\u804C\u8D23\uFF0C\u968F\u4EFB\u52A1\u4E00\u8D77\u63D0\u4EA4")
          ) : null
        );
      };
    };
  }
});

// packages/addons/tasks/client/modals/create-modal.cjs
var require_create_modal = __commonJS({
  "packages/addons/tasks/client/modals/create-modal.cjs"(exports2, module2) {
    function initialPriority(source, origin, fallback) {
      var original = Number(origin && origin.priority);
      if (source === "2" && Number.isInteger(original) && original >= 1 && original <= 10) return original;
      var n = Number(fallback);
      return Number.isFinite(n) ? Math.min(10, Math.max(1, Math.floor(n))) : 1;
    }
    function clampInputPriority(value) {
      if (String(value).trim() === "" || Number(value) === 0 || !Number.isFinite(Number(value))) return value;
      return Math.min(10, Math.max(1, Math.floor(Number(value))));
    }
    function validatePriority(value, source, t) {
      var n = Number(value);
      return String(value).trim() !== "" && Number.isInteger(n) && n >= 1 && n <= 10 ? "" : source === "2" ? t.restartPriorityError : t.activePriorityError;
    }
    module2.exports = function createModal(deps) {
      var React = deps.React, h = React.createElement;
      var TimelinePicker = require_timeline_controls()(React).Picker;
      var WorkspaceSelect = require_workspace_select()(React).WorkspaceSelect;
      var difficultyField = require_difficulty_field()(React);
      var ownership = require_ownership(), fields = require_ownership_fields()(React);
      var allTables = deps.allTables, tagNames = deps.tagNames, splitTags = deps.splitTags;
      var today = deps.today, addDays = deps.addDays, hostHasAddon = deps.hostHasAddon;
      function CreateModal(props) {
        var t = props.t, tr = require_timeline_copy()(props.t);
        var source = String(props.source || "0");
        var origin = props.originTask || null;
        var tables = ownership.tables(props.tree);
        var initTags = origin ? tagNames(origin).join(", ") : "";
        var defaults = props.defaults || {};
        var initPriority = initialPriority(source, origin, defaults.priority);
        var initDifficulty = Math.max(0, Math.min(5, Number(defaults.difficulty) || 0));
        var initOffset = Math.floor(Number(defaults.targetOffset));
        if (!(initOffset >= 0)) initOffset = 0;
        var f = React.useState({
          title: "",
          description: "",
          timelineId: source === "1" && origin ? origin.timelineId || "" : "",
          tags: initTags,
          status: "0",
          priority: initPriority,
          difficulty: initDifficulty,
          publishDate: today(),
          targetDate: addDays(initOffset),
          doneDate: today(),
          shutdownDate: today(),
          tableId: "",
          newPath: false,
          tablePath: "",
          pathDescriptions: [],
          confirmed: false,
          workspaceIds: []
        });
        var form = f[0], setForm = f[1];
        var busy = React.useState(false);
        var isBusy = busy[0], setBusy = busy[1];
        var err = React.useState("");
        var error = err[0], setError = err[1];
        var submission = React.useState({ pending: false })[0];
        function requestClose() {
          if (!submission.pending) props.onClose();
        }
        function onModalKey(e) {
          if (e.key !== "Escape" || e.target && e.target.closest && e.target.closest(".wbt-table-picker")) return;
          e.preventDefault();
          e.stopPropagation();
          requestClose();
        }
        var active = source === "2" || form.status === "0";
        var priorityError = active ? validatePriority(form.priority, source, t) : "";
        var plan = ownership.preview(props.tree, form.tablePath, form.pathDescriptions);
        var targetValid = form.newPath ? !plan.error && form.confirmed : tables.some(function(x) {
          return x.id === form.tableId;
        });
        React.useEffect(function() {
          if (form.tableId && !tables.some(function(x) {
            return x.id === form.tableId;
          })) {
            setForm(function(prev) {
              return Object.assign({}, prev, { tableId: "" });
            });
            setError("\u76EE\u6807\u4EFB\u52A1\u8868\u5DF2\u5931\u6548\uFF0C\u8BF7\u91CD\u65B0\u9009\u62E9\uFF1B\u5DF2\u586B\u5199\u5185\u5BB9\u5DF2\u4FDD\u7559\u3002");
          }
        }, [props.tree, form.tableId]);
        function setMany(patch) {
          setForm(function(prev) {
            return Object.assign({}, prev, patch);
          });
        }
        function set(k, v) {
          var next = Object.assign({}, form);
          next[k] = k === "priority" ? clampInputPriority(v) : v;
          setForm(next);
        }
        function failed(message) {
          var text = String(message || "create failed");
          if (/TABLE_NOT_FOUND|TARGET_NOT_TABLE|TREE_CORRUPT/.test(text)) setMany({ tableId: "" });
          setError(text);
          submission.pending = false;
          setBusy(false);
        }
        function capabilityError(message) {
          var reason = String(message || "\u5F52\u5C5E\u80FD\u529B\u68C0\u67E5\u5931\u8D25");
          var upgrade = /unknown.*action|action.*not.*found|未注册|不存在.*action|未知.*action/i.test(reason);
          return new Error((upgrade ? "\u5F52\u5C5E\u80FD\u529B\u4E0D\u53EF\u7528\uFF0C\u8BF7\u5B8C\u6574\u5347\u7EA7\u4EFB\u52A1\u63D2\u4EF6\u4E0E\u5BBF\u4E3B\u5E76\u91CD\u542F\uFF1B\u5DF2\u4FDD\u7559\u8868\u5355\u3002" : "\u5F52\u5C5E\u80FD\u529B\u68C0\u67E5\u5931\u8D25\uFF0C\u5DF2\u4FDD\u7559\u8868\u5355\uFF1A") + reason);
        }
        function submit() {
          if (priorityError || isBusy || submission.pending) return;
          if (source === "2" && !(origin && origin.timelineId)) {
            setError(tr("\u8BF7\u5148\u624B\u52A8\u5EFA\u7ACB\u5E76\u5173\u8054\u65F6\u95F4\u7EBF\uFF0C\u518D\u91CD\u542F"));
            return;
          }
          if (source === "1" && !form.timelineId) {
            setError(tr("\u8BF7\u9009\u62E9\u5DF2\u6709\u65F6\u95F4\u7EBF"));
            return;
          }
          if (!String(form.title).trim()) {
            setError(t.needTitle);
            return;
          }
          if (!targetValid) {
            setError(form.newPath ? plan.error || "\u8BF7\u786E\u8BA4\u65B0\u5EFA\u8DEF\u5F84" : t.needTable);
            return;
          }
          if (!form.publishDate || !form.targetDate) {
            setError(t.needDate);
            return;
          }
          submission.pending = true;
          setBusy(true);
          setError("");
          var args = {
            title: String(form.title).trim(),
            description: String(form.description || ""),
            tags: splitTags(form.tags),
            status: source === "2" ? "0" : String(form.status),
            priority: active ? Number(form.priority) : 0,
            difficulty: Number(form.difficulty) || 0,
            publishDate: form.publishDate,
            targetDate: form.targetDate,
            source: source === "2" ? "2" : form.timelineId ? "1" : "0"
          };
          if (form.workspaceIds && form.workspaceIds.length) args.workspaceIds = form.workspaceIds.slice();
          if (form.newPath) Object.assign(args, { tablePath: plan.parts, createMissing: true, pathDescriptions: plan.parts.map(function(_, i) {
            return form.pathDescriptions[i] || "";
          }) });
          else args.tableId = String(form.tableId);
          if (source === "2" && origin) args.restartKey = String(origin.id);
          else if (form.timelineId) args.timelineId = form.timelineId;
          if (args.status === "2") {
            args.doneDate = form.doneDate || today();
          }
          if (args.status === "1") args.shutdownDate = form.shutdownDate || today();
          props.api.call("tasks.capabilities", { limit: 1 }).then(function(cap) {
            if (!cap || !cap.ok) throw capabilityError(cap && cap.error);
            return props.api.call("tasks.create", args);
          }, function(e) {
            throw capabilityError(e && e.message || e);
          }).then(function(r) {
            if (!r || !r.ok) {
              failed(r && r.error);
              return;
            }
            props.onCreated(r.result);
          }).catch(function(e) {
            failed(e && e.message || e);
          });
        }
        var title = source === "2" ? t.restartTitle : source === "1" ? tr("\u5411\u5DF2\u6709\u65F6\u95F4\u7EBF\u6DFB\u52A0\u4EFB\u52A1") : t.newTask;
        return h(
          "div",
          { className: "wbt-modal-mask", onKeyDownCapture: onModalKey, onMouseDown: function(e) {
            if (e.target === e.currentTarget) requestClose();
          } },
          h(
            "div",
            { className: "wbt-modal" },
            h("div", { className: "wbt-modal-head" }, h("h3", null, title), h("button", { className: "wbt-icon", disabled: isBusy, onClick: requestClose }, "\xD7")),
            source === "2" ? h("div", { className: "wbt-mhint" }, t.restartPriorityHint) : null,
            source !== "0" && origin ? h("div", { className: "wbt-mhint" }, "\u6765\u6E90\uFF1A" + (origin.title || origin.id) + (source === "2" ? tr(" \xB7 \u81EA\u52A8\u7EE7\u627F\u539F\u65F6\u95F4\u7EBF") : "")) : null,
            source === "2" && !(origin && origin.timelineId) ? h("p", { className: "wbt-err", role: "alert" }, tr("\u8BF7\u5148\u624B\u52A8\u5EFA\u7ACB\u5E76\u5173\u8054\u65F6\u95F4\u7EBF\uFF0C\u518D\u91CD\u542F")) : null,
            source !== "2" ? h(TimelinePicker, { api: props.api, t, value: form.timelineId, onChange: function(value) {
              set("timelineId", value);
            }, disabled: isBusy }) : null,
            h(
              "div",
              { className: "wbt-form" },
              h("label", { className: "wbt-field full" }, h("span", null, t.titleField + " *"), h("input", { className: "wbt-input", value: form.title, onChange: function(e) {
                set("title", e.target.value);
              }, autoFocus: true })),
              h("label", { className: "wbt-field full" }, h("span", null, t.desc), h("textarea", { className: "wbt-textarea", rows: 2, value: form.description, onChange: function(e) {
                set("description", e.target.value);
              } })),
              hostHasAddon("wb-addon-tags") ? h("label", { className: "wbt-field full" }, h("span", null, t.tags), h("input", { className: "wbt-input", value: form.tags, placeholder: t.tagPlaceholder, onChange: function(e) {
                set("tags", e.target.value);
              } })) : null,
              h(WorkspaceSelect, { api: props.api, lang: props.lang, value: form.workspaceIds, onChange: function(ids) {
                set("workspaceIds", ids);
              } }),
              h("label", { className: "wbt-field" }, h("span", null, t.status), h(
                "select",
                { className: "wbt-select", value: source === "2" ? "0" : form.status, disabled: source === "2", onChange: function(e) {
                  set("status", e.target.value);
                } },
                h("option", { value: "0" }, "\u5DF2\u5F00\u542F"),
                h("option", { value: "2" }, "\u5DF2\u5B8C\u6210"),
                h("option", { value: "1" }, "\u5DF2\u5173\u95ED")
              )),
              h("label", { className: "wbt-field" }, h("span", null, t.priority + "\uFF081\u201310\uFF09"), h("input", { className: "wbt-input", type: "number", min: 1, max: 10, step: 1, disabled: !active, "aria-invalid": !!priorityError, "aria-describedby": priorityError ? "wbt-create-priority-error" : void 0, value: form.priority, onChange: function(e) {
                set("priority", e.target.value);
              } })),
              fields({ form, set, setMany, tree: props.tree, recommended: props.defaultTableId || origin && origin.tableId }),
              h("label", { className: "wbt-field" }, h("span", null, t.publishDate), h("input", { className: "wbt-input", type: "date", value: form.publishDate, onChange: function(e) {
                set("publishDate", e.target.value);
              } })),
              h("label", { className: "wbt-field" }, h("span", null, t.targetDate), h("input", { className: "wbt-input", type: "date", value: form.targetDate, onChange: function(e) {
                set("targetDate", e.target.value);
              } })),
              source !== "2" && form.status === "2" ? h("label", { className: "wbt-field" }, h("span", null, t.doneDate), h("input", { className: "wbt-input", type: "date", value: form.doneDate, onChange: function(e) {
                set("doneDate", e.target.value);
              } })) : null,
              difficultyField(t, form.difficulty, function(value) {
                set("difficulty", value);
              }, "wbt-create-difficulty"),
              source !== "2" && form.status === "1" ? h("label", { className: "wbt-field" }, h("span", null, t.shutdownDate), h("input", { className: "wbt-input", type: "date", value: form.shutdownDate, onChange: function(e) {
                set("shutdownDate", e.target.value);
              } })) : null
            ),
            priorityError ? h("div", { id: "wbt-create-priority-error", className: "wbt-err", role: "alert" }, priorityError) : null,
            error ? h("div", { className: "wbt-err" }, error) : null,
            h(
              "div",
              { className: "wbt-modal-foot" },
              h("button", { className: "wbt-btn ghost", disabled: isBusy, onClick: requestClose }, t.cancel),
              h("button", { className: "wbt-btn primary", disabled: isBusy || !!priorityError || !targetValid || source === "2" && !(origin && origin.timelineId), onClick: submit }, isBusy ? "\u2026" : t.create)
            )
          )
        );
      }
      return CreateModal;
    };
  }
});

// packages/addons/tasks/client/timeline/timeline-member-rows.cjs
var require_timeline_member_rows = __commonJS({
  "packages/addons/tasks/client/timeline/timeline-member-rows.cjs"(exports2, module2) {
    "use strict";
    module2.exports = function createMemberRows(React, statusInfo) {
      var h = React.createElement;
      return function MemberRows(props) {
        var lang = props.lang === "en" ? "en" : "zh";
        return h("ol", { className: "wbt-timeline-members" }, (props.rows || []).map(function(task) {
          var status = statusInfo(task.status), title = task.title || (lang === "en" ? "Untitled task" : "\u672A\u547D\u540D\u4EFB\u52A1");
          var remove = lang === "en" ? "Remove from timeline: " + title : "\u4ECE\u65F6\u95F4\u7EBF\u79FB\u51FA\uFF1A" + title;
          return h(
            "li",
            { key: task.id, className: "wbt-timeline-member-row" },
            h("time", { className: "wbt-timeline-date", dateTime: task.publishDate || void 0 }, task.publishDate || "\u2014"),
            h("span", { className: "wbt-timeline-node", "aria-hidden": true }),
            h("button", { type: "button", className: "wbt-timeline-member", title, "aria-label": title + " \xB7 " + (task.publishDate || "") + " \xB7 " + status[lang], onClick: function(event) {
              if (props.onOpen) props.onOpen(task, event);
            } }, title),
            h("span", { className: "wbt-badge " + status.cls }, status[lang]),
            props.onRemove ? h("button", { type: "button", className: "wbt-timeline-remove", disabled: props.disabled, title: remove, "aria-label": remove, onClick: function(event) {
              props.onRemove(task, event);
            } }, h("svg", { width: 14, height: 14, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, "aria-hidden": true }, h("path", { d: "M5 12h14" }))) : null
          );
        }));
      };
    };
  }
});

// packages/addons/tasks/client/timeline/timeline-title.cjs
var require_timeline_title = __commonJS({
  "packages/addons/tasks/client/timeline/timeline-title.cjs"(exports2, module2) {
    "use strict";
    module2.exports = function splitTitle(value) {
      var text = String(value || "").trim(), at = Math.max(text.lastIndexOf("|"), text.lastIndexOf("\uFF5C"));
      return at > 0 && text.slice(at + 1).trim() ? { eyebrow: text.slice(0, at).trim(), title: text.slice(at + 1).trim() } : { eyebrow: "", title: text };
    };
  }
});

// packages/addons/tasks/client/timeline/timeline-styles.cjs
var require_timeline_styles = __commonJS({
  "packages/addons/tasks/client/timeline/timeline-styles.cjs"(exports2, module2) {
    "use strict";
    module2.exports = [
      ".wbt-timeline-view{padding:0;color:inherit;box-sizing:border-box;overflow:auto}",
      ".wbt-timeline-toolbar,.wbt-timeline-search,.wbt-timeline-pager,.wbt-timeline-actions{display:flex;align-items:center;gap:8px;flex-wrap:wrap}",
      ".wbt-timeline-toolbar{display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;margin-bottom:12px}",
      ".wbt-timeline-toolbar-main{display:flex;align-items:center;gap:8px;flex:1 1 320px;min-width:0;flex-wrap:wrap}",
      ".wbt-timeline-toolbar-main .wbt-timeline-search{flex:1 1 220px;min-width:0}",
      ".wbt-timeline-toolbar-actions{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-left:auto}",
      ".wbt-timeline-columns{display:grid;grid-template-columns:minmax(240px,32%) minmax(0,1fr);gap:12px;align-items:start}",
      ".wbt-timeline-left,.wbt-timeline-right{min-width:0;border:1px solid var(--wbt-line);border-radius:var(--wb-radius-card,10px);padding:12px}",
      ".wbt-timeline-single{display:flex;align-items:center;gap:8px;margin:0;font-size:13px;white-space:nowrap}.wbt-timeline-search input{min-width:0;flex:1}",
      ".wbt-timeline-list{max-height:840px;overflow:auto;overscroll-behavior:contain}.wbt-timeline-left>.wbt-timeline-list,.wbt-timeline-left>.wbt-err{margin-top:2px}.wbt-timeline-view .wbt-timeline-option{position:relative;box-sizing:border-box;min-height:56px;padding:10px 12px;border:0;border-bottom:1px solid var(--wbt-line);border-radius:var(--wb-radius-sm,6px);display:flex;flex-direction:column;gap:4px;cursor:pointer;color:inherit;background:transparent;background-image:none}",
      ".wbt-timeline-option-title{display:flex;gap:8px;align-items:center;min-width:0}.wbt-timeline-option-title strong{font-size:13px;font-weight:560;line-height:1.4;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;overflow-wrap:anywhere}.wbt-timeline-option>span{font-size:11.5px;opacity:.6;font-variant-numeric:tabular-nums;overflow-wrap:anywhere}",
      ".wbt-timeline-option>.wbt-timeline-excerpt{display:block;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
      ".wbt-timeline-view .wbt-timeline-option.current{box-shadow:inset 3px 0 var(--wbt-accent),inset 0 0 0 1px var(--wbt-line);background:color-mix(in oklab,var(--wbt-accent) 8%,transparent);background-image:none}.wbt-timeline-view .wbt-timeline-option:hover{background:color-mix(in oklab,var(--wbt-accent) 12%,transparent)}",
      ".wbt-timeline-option:focus-visible,.wbt-timeline-view button:focus-visible,.wbt-timeline-modal button:focus-visible{outline:2px solid var(--wbt-accent);outline-offset:2px}.wbt-timeline-option input[type=checkbox],.wbt-timeline-single input{appearance:auto;width:15px;height:15px;flex:none;accent-color:var(--wbt-accent)}",
      ".wbt-timeline-pager{justify-content:space-between;font-size:12px;margin-top:12px}.wbt-timeline-right h3,.wbt-timeline-summary h4{font-size:15px;font-weight:600;margin:0 0 8px;overflow-wrap:anywhere}.wbt-timeline-eyebrow{font-size:11.5px;opacity:.55;margin-bottom:4px;overflow-wrap:anywhere}",
      ".wbt-timeline-summary{min-width:0}.wbt-timeline-desc{max-height:64px;overflow:hidden;margin:0 0 8px;white-space:pre-wrap;overflow-wrap:anywhere}.wbt-timeline-actions{margin:8px 0}.wbt-timeline-actions>.wbt-act-del{margin-left:auto}",
      // Scoped reset defeats ordinary host button surfaces without touching unrelated task controls.
      ":is(.wbt-timeline-view,.wbt-timeline-modal) button:is(.wbt-timeline-member,.wbt-timeline-remove,.wbt-timeline-id){appearance:none;background:transparent;background-image:none;color:inherit;border:0;box-shadow:none;border-radius:var(--wb-radius-sm,6px);font:inherit;cursor:pointer;min-width:0;min-height:0;width:auto;margin:0}",
      ":is(.wbt-timeline-view,.wbt-timeline-modal) .wbt-timeline-id{display:inline-flex;align-items:center;gap:4px;padding:4px;max-width:180px}.wbt-timeline-id code{font-size:11.5px;opacity:.5;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
      ":is(.wbt-timeline-view,.wbt-timeline-modal) .wbt-act-del{color:var(--dsw-alias-state-error-primary,var(--wbt-accent));background:transparent;border-color:var(--wbt-line)}",
      '.wbt-timeline-members{list-style:none;padding:0;margin:8px 0;min-width:0}.wbt-timeline-member-row{display:grid;grid-template-columns:92px 14px minmax(0,1fr) auto 28px;gap:8px;align-items:center;min-height:40px;position:relative;padding:0;margin:0}.wbt-timeline-date{font-size:11.5px;font-variant-numeric:tabular-nums;text-align:right;white-space:nowrap;opacity:.7}.wbt-timeline-node{align-self:stretch;position:relative}.wbt-timeline-node:before{content:"";position:absolute;width:1px;left:50%;top:0;bottom:0;background:var(--wbt-line)}.wbt-timeline-node:after{content:"";position:absolute;width:6px;height:6px;left:calc(50% - 2.5px);top:calc(50% - 3px);border-radius:50%;background:var(--wbt-accent)}',
      ":is(.wbt-timeline-view,.wbt-timeline-modal) button.wbt-timeline-member{padding:8px 0;text-align:left;font-size:13px;line-height:1.5;overflow-wrap:anywhere;white-space:normal}:is(.wbt-timeline-view,.wbt-timeline-modal) button.wbt-timeline-member:hover{text-decoration:underline;text-underline-offset:3px}:is(.wbt-timeline-view,.wbt-timeline-modal) button.wbt-timeline-remove{display:flex;justify-content:center;align-items:center;width:28px;height:28px;padding:4px;opacity:.35}:is(.wbt-timeline-view,.wbt-timeline-modal) button.wbt-timeline-remove:is(:hover,:focus-visible){opacity:.9;background:var(--wbt-surface)}.wbt-timeline-member-row>.wbt-badge{white-space:nowrap;margin:0}.wbt-timeline-remove:disabled{cursor:default}",
      ".wbt-timeline-member-footer{display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;border-top:1px solid var(--wbt-line);padding-top:8px}.wbt-timeline-member-footer>span{font-size:11.5px;opacity:.65}.wbt-timeline-member-footer .wbt-timeline-pager{margin:0}",
      ".wbt-modal.wide.wbt-timeline-modal{display:flex;flex-direction:column;max-height:90vh;overflow:hidden}.wbt-timeline-modal-body{min-height:0;overflow:auto;flex:1;padding:12px}.wbt-timeline-member-section{min-width:0;margin-top:12px}.wbt-timeline-member-scroll{max-height:40vh;overflow:auto;overscroll-behavior:contain}.wbt-timeline-pick{border-top:1px solid var(--wbt-line);padding-top:12px;margin-top:12px}.wbt-timeline-empty{padding:12px 0}.wbt-picker-selected{font-size:12px;margin:6px 0;min-height:16px}.wbt-picker-list{max-height:220px;overflow:auto;overscroll-behavior:contain;border:1px solid var(--wbt-line);border-radius:var(--wb-radius-sm,6px);padding:4px;background:var(--wbt-surface)}.wbt-picker-note{margin:6px;font-size:12px;opacity:.7}.wbt-picker-opt{display:flex;align-items:center;justify-content:space-between;gap:8px;width:100%;padding:6px 8px;border:0;border-radius:var(--wb-radius-sm,6px);background:transparent;color:inherit;font:inherit;text-align:left;cursor:pointer}.wbt-picker-opt:hover,.wbt-picker-opt:focus-visible{background:color-mix(in oklab,var(--wbt-accent) 12%,transparent)}.wbt-picker-opt:focus-visible{outline:2px solid var(--wbt-accent);outline-offset:-2px}.wbt-picker-opt.selected{background:color-mix(in oklab,var(--wbt-accent) 16%,transparent);font-weight:600}.wbt-picker-opt-title{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.wbt-picker-opt-count{font-size:11px;opacity:.6;white-space:nowrap}.wbt-timeline-confirm{padding:12px;border:1px solid var(--wbt-line);border-radius:var(--wb-radius-card,10px);margin:8px 0;line-height:1.6;background:var(--wbt-surface)}.wbt-timeline-confirm .wbt-btn{margin:8px 8px 0 0}",
      ".wbt-timeline-desc.expanded{max-height:none}.wbt-timeline-selected{min-width:0;overflow-wrap:anywhere;flex:1}.wbt-modal-foot.wbt-timeline-actions{display:flex;align-items:center;gap:8px;flex-wrap:wrap;flex:none}.wbt-timeline-modal .wbt-empty{padding:12px;margin:8px 0;border:1px solid var(--wbt-line);border-radius:var(--wb-radius-card,10px);background:var(--wbt-surface);line-height:1.6}",
      "@media(max-width:720px){.wbt-timeline-selected{flex:1 1 100%}.wbt-picker-list{max-height:180px}.wbt-timeline-columns{grid-template-columns:1fr}.wbt-timeline-toolbar-main{flex:1 1 100%}.wbt-timeline-toolbar-actions{flex:1 1 100%;justify-content:flex-end;margin-left:0}.wbt-timeline-list{max-height:320px}.wbt-timeline-toolbar{flex-wrap:wrap}.wbt-timeline-member-row{grid-template-columns:76px 8px minmax(0,1fr) auto 28px;gap:4px}.wbt-timeline-left,.wbt-timeline-right{padding:12px}.wbt-timeline-date{font-size:10.5px}.wbt-timeline-member-row>.wbt-badge{font-size:10.5px;padding:2px 4px}.wbt-timeline-actions>.wbt-act-del{margin-left:0}.wbt-timeline-id{max-width:140px}}"
    ].join("\n");
  }
});

// packages/addons/tasks/client/timeline/timeline-members.cjs
var require_timeline_members = __commonJS({
  "packages/addons/tasks/client/timeline/timeline-members.cjs"(exports2, module2) {
    "use strict";
    module2.exports = function timelineMembers(api, task) {
      if (task.timelineId == null || task.timelineId === "") return Promise.resolve([]);
      return api.call("tasks.timeline", { timelineId: String(task.timelineId) }).then(function(r) {
        if (!r || !r.ok) throw new Error(r && r.error || "load failed");
        return Array.isArray(r.result) ? r.result : r.result.records || [];
      });
    };
  }
});

// packages/addons/tasks/client/timeline/task-timeline-modal.cjs
var require_task_timeline_modal = __commonJS({
  "packages/addons/tasks/client/timeline/task-timeline-modal.cjs"(exports2, module2) {
    "use strict";
    module2.exports = function(React, statusInfo) {
      var h = React.createElement, controls = require_timeline_controls()(React);
      var MemberRows = require_timeline_member_rows()(React, statusInfo);
      var splitTitle = require_timeline_title();
      var CSS = require_timeline_styles();
      return function TaskTimelineModal(p) {
        var tr = require_timeline_copy()(p.t), lang = p.t && p.t.timeline === "Timeline" ? "en" : "zh";
        var ts = React.useState(p.task), task = ts[0], setTask = ts[1];
        var ms = React.useState([]), members = ms[0], setMembers = ms[1];
        var es = React.useState(""), error = es[0], setError = es[1];
        var bs = React.useState(true), busy = bs[0], setBusy = bs[1];
        var vs = React.useState(""), value = vs[0], setValue = vs[1];
        var ls = React.useState(""), selectedTitle = ls[0], setSelectedTitle = ls[1];
        var ns = React.useState(false), creating = ns[0], setCreating = ns[1];
        var rs = React.useState(0), revision = rs[0], setRevision = rs[1];
        var ds = React.useState(false), expanded = ds[0], setExpanded = ds[1];
        var cs = React.useState(null), removing = cs[0], setRemoving = cs[1];
        var ps = React.useState(1), page = ps[0], setPage = ps[1];
        var ks = React.useState(false), picking = ks[0], setPicking = ks[1];
        var dialog = React.useRef(null), pending = React.useRef(false);
        React.useEffect(function() {
          var previous = typeof document !== "undefined" ? document.activeElement : null;
          if (dialog.current) dialog.current.focus();
          return function() {
            if (previous && previous.isConnected && previous.focus) previous.focus();
          };
        }, []);
        React.useEffect(function() {
          var cancelled = false;
          setBusy(true);
          setError("");
          p.api.call("tasks.get", { id: p.task.id }).then(controls.result).then(function(r) {
            var current = r.task;
            if (cancelled) return;
            setTask(current);
            return require_timeline_members()(p.api, current).then(function(rows) {
              if (!cancelled) {
                setMembers(rows);
                setPage(function(n) {
                  return Math.min(n, Math.max(1, Math.ceil(rows.length / 20)));
                });
                setBusy(false);
              }
            });
          }).catch(function(e) {
            if (!cancelled) {
              setError(String(e.message || e));
              setBusy(false);
            }
          });
          return function() {
            cancelled = true;
          };
        }, [p.api, p.task.id, revision]);
        function change(action, args) {
          if (busy || pending.current) return;
          pending.current = true;
          setBusy(true);
          setError("");
          p.api.call(action, args).then(controls.result).then(function() {
            pending.current = false;
            setValue("");
            setSelectedTitle("");
            setRemoving(null);
            setPicking(false);
            setRevision(function(n) {
              return n + 1;
            });
            if (p.onChanged) p.onChanged();
          }).catch(function(e) {
            pending.current = false;
            setError(String(e.message || e));
            setBusy(false);
          });
        }
        function onKeyDown(e) {
          if (e.key === "Escape") {
            if (creating) return;
            e.stopPropagation();
            if (removing) setRemoving(null);
            else p.onClose();
          }
          if (e.key !== "Tab" || !dialog.current) return;
          var dialogs = dialog.current.parentElement.querySelectorAll('[role="dialog"]');
          var activeDialog = creating ? dialogs[dialogs.length - 1] : dialog.current;
          var nodes = Array.from(activeDialog.querySelectorAll('button:not(:disabled),input:not(:disabled),textarea:not(:disabled),[tabindex="0"]')).filter(function(node) {
            return node.getClientRects().length > 0;
          });
          var first = nodes[0], last = nodes[nodes.length - 1];
          if (!first) {
            e.preventDefault();
            dialog.current.focus();
          } else if (e.shiftKey && (document.activeElement === first || document.activeElement === dialog.current)) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
        var title = splitTitle(task.timelineTitle || tr("\u672A\u547D\u540D\u65F6\u95F4\u7EBF"));
        var pages = Math.max(1, Math.ceil(members.length / 20));
        var linked = !!task.timelineId;
        var showPicker = !linked || picking;
        var newButton = h("button", { type: "button", className: "wbt-btn", disabled: busy, onClick: function() {
          setCreating(true);
        } }, tr("\u65B0\u5EFA\u65F6\u95F4\u7EBF"));
        var summaryBlock = h(
          "header",
          { className: "wbt-timeline-summary" },
          title.eyebrow ? h("div", { className: "wbt-timeline-eyebrow" }, title.eyebrow) : null,
          h("h4", null, title.title),
          h("div", { className: "wbt-desc wbt-timeline-desc" + (expanded ? " expanded" : "") }, task.timelineDescription || tr("\u6682\u65E0\u63CF\u8FF0")),
          task.timelineDescription ? h("button", { type: "button", className: "wbt-btn ghost", "aria-expanded": expanded, onClick: function() {
            setExpanded(!expanded);
          } }, tr(expanded ? "\u6536\u8D77\u63CF\u8FF0" : "\u5C55\u5F00\u63CF\u8FF0")) : null
        );
        var membersBlock = h(
          "section",
          { className: "wbt-timeline-member-section", "aria-label": tr("\u6210\u5458") },
          h(
            "div",
            { className: "wbt-timeline-actions" },
            h("strong", null, tr("\u6210\u5458"), " ", members.length),
            h("button", { type: "button", className: "wbt-btn ghost", "aria-expanded": picking, disabled: busy, onClick: function() {
              setPicking(!picking);
            } }, tr(picking ? "\u6536\u8D77\u66F4\u6362" : "\u66F4\u6362\u65F6\u95F4\u7EBF")),
            h("button", { type: "button", className: "wbt-btn ghost", disabled: busy, onClick: function() {
              setRemoving(task);
            } }, tr("\u79FB\u51FA\u5F53\u524D\u4EFB\u52A1")),
            h("button", { type: "button", className: "wbt-btn", disabled: busy, onClick: function() {
              p.onCreateTimeline(task);
            } }, tr("\u6DFB\u52A0\u65B0\u4EFB\u52A1"))
          ),
          removing ? h(
            "div",
            { className: "wbt-timeline-confirm", role: "alert" },
            h("p", null, tr("\u786E\u8BA4\u79FB\u51FA\u4EFB\u52A1\uFF1F"), " ", removing.title, " \xB7 ", tr("\u4EC5\u89E3\u9664\u5173\u8054\uFF0C\u4EFB\u52A1\u4ECD\u4FDD\u7559\u3002")),
            h(
              "div",
              { className: "wbt-timeline-actions" },
              h("button", { type: "button", className: "wbt-btn", disabled: busy, onClick: function() {
                setRemoving(null);
              } }, tr("\u53D6\u6D88")),
              h("button", { type: "button", className: "wbt-btn wbt-act-del", disabled: busy, onClick: function() {
                change("taskTimelines.detach", { taskId: removing.id });
              } }, tr("\u786E\u8BA4\u79FB\u51FA"))
            )
          ) : null,
          h("div", { className: "wbt-timeline-member-scroll" }, members.length ? h(MemberRows, { rows: members.slice((page - 1) * 20, page * 20), lang, disabled: busy, onOpen: p.onOpen, onRemove: setRemoving }) : h("p", { className: "wbt-empty" }, tr("\u6682\u65E0\u53EF\u663E\u793A\u6210\u5458"))),
          h(
            "div",
            { className: "wbt-timeline-pager" },
            h("span", null, tr("\u6309\u53D1\u5E03\u65F6\u95F4\u6B63\u5E8F\u6392\u5217")),
            h("button", { type: "button", className: "wbt-btn", disabled: busy || page <= 1, onClick: function() {
              setPage(page - 1);
            } }, tr("\u4E0A\u4E00\u9875")),
            h("span", null, page + " / " + pages),
            h("button", { type: "button", className: "wbt-btn", disabled: busy || page >= pages, onClick: function() {
              setPage(page + 1);
            } }, tr("\u4E0B\u4E00\u9875"))
          )
        );
        var linkedBody = h(React.Fragment, null, summaryBlock, membersBlock);
        var unlinkedBody = h("div", { className: "wbt-timeline-empty" }, h("strong", null, tr("\u5F53\u524D\u672A\u5173\u8054\u65F6\u95F4\u7EBF")), h("p", null, tr("\u9009\u62E9\u5DF2\u6709\u65F6\u95F4\u7EBF\uFF0C\u6216\u65B0\u5EFA\u4E00\u6761\uFF1B\u5173\u95ED\u5F39\u7A97\u4E0D\u4F1A\u81EA\u52A8\u5173\u8054\u3002")));
        var attachButton = h("button", { type: "button", className: "wbt-btn primary", disabled: busy || !value, title: busy ? tr("\u52A0\u8F7D\u4E2D\u2026") : !value ? tr("\u8BF7\u9009\u62E9\u5DF2\u6709\u65F6\u95F4\u7EBF\uFF1B\u65E0\u5339\u914D\u65F6\u53EF\u65B0\u5EFA") : selectedTitle, onClick: function() {
          change("taskTimelines.attach", { taskId: task.id, timelineId: value });
        } }, tr("\u5173\u8054\u6240\u9009\u65F6\u95F4\u7EBF"));
        return h(
          "div",
          { className: "wbt-modal-mask", onKeyDown },
          h("style", null, CSS),
          h(
            "div",
            { ref: dialog, tabIndex: -1, className: "wbt-modal wide wbt-timeline-modal", role: "dialog", "aria-modal": true, "aria-label": tr("\u4EFB\u52A1\u65F6\u95F4\u7EBF") },
            h("div", { className: "wbt-modal-head" }, h("h3", null, tr("\u4EFB\u52A1\u65F6\u95F4\u7EBF")), h("button", { type: "button", className: "wbt-icon", "aria-label": tr("\u5173\u95ED"), onClick: p.onClose }, "\xD7")),
            h(
              "div",
              { className: "wbt-timeline-modal-body", "aria-busy": busy },
              error ? h("p", { className: "wbt-err", role: "alert" }, error, h("button", { type: "button", className: "wbt-btn", onClick: function() {
                setRevision(revision + 1);
              } }, tr("\u91CD\u8BD5"))) : null,
              busy && !members.length ? h("p", { role: "status" }, tr("\u52A0\u8F7D\u4E2D\u2026")) : null,
              linked ? linkedBody : unlinkedBody,
              showPicker ? h(
                "section",
                { className: "wbt-timeline-pick", "aria-label": tr("\u9009\u62E9\u5DF2\u6709\u65F6\u95F4\u7EBF") },
                h(controls.Picker, { api: p.api, t: p.t, value, title: selectedTitle, onChange: function(id, label) {
                  setValue(id);
                  setSelectedTitle(label || "");
                }, disabled: busy })
              ) : null
            ),
            h(
              "div",
              { className: "wbt-modal-foot wbt-timeline-actions" },
              h("span", { className: "wbt-timeline-selected", role: "status" }, value ? tr("\u5DF2\u9009\u65F6\u95F4\u7EBF") + "\uFF1A" + (selectedTitle || value) : linked ? tr("\u66F4\u6362\u6216\u79FB\u51FA\u65F6\u95F4\u7EBF") : tr("\u5C1A\u672A\u9009\u62E9\u65F6\u95F4\u7EBF")),
              newButton,
              showPicker ? attachButton : null
            )
          ),
          creating ? h(controls.Editor, { api: p.api, t: p.t, onClose: function() {
            setCreating(false);
            if (dialog.current) dialog.current.focus();
          }, onSaved: function(line) {
            setCreating(false);
            setValue(line.timelineId || line.id || line.timelineKey);
            setSelectedTitle(line.title || "");
            if (dialog.current) dialog.current.focus();
          } }) : null
        );
      };
    };
  }
});

// packages/addons/tasks/client/modals/edit-modal.cjs
var require_edit_modal = __commonJS({
  "packages/addons/tasks/client/modals/edit-modal.cjs"(exports2, module2) {
    "use strict";
    module2.exports = function createEditModal(React, statusInfo, stars) {
      var h = React.createElement;
      var difficultyField = require_difficulty_field()(React);
      var WorkspaceSelect = require_workspace_select()(React).WorkspaceSelect;
      var ownership = require_ownership(), fields = require_ownership_fields()(React);
      function EditModal(props) {
        var t = props.t;
        var task = props.task;
        var done = String(task.status) === "2";
        var canPriority = !done;
        var fs = React.useState({
          tableId: "",
          title: String(task.title || ""),
          description: String(task.description || ""),
          review: String(task.review || ""),
          priority: String(task.priority === null || task.priority === void 0 ? 0 : task.priority),
          difficulty: Number(task.difficulty || 0),
          targetDate: String(task.targetDate || ""),
          workspaceIds: (task.workspaces || []).map(function(w) {
            return String(w.id);
          })
        });
        var form = fs[0], setForm = fs[1];
        var bs = React.useState(false);
        var isBusy = bs[0], setBusy = bs[1];
        var es = React.useState("");
        var err = es[0], setErr = es[1];
        var submission = React.useState({ pending: false })[0];
        function requestClose() {
          if (!submission.pending) props.onClose();
        }
        function onModalKey(e) {
          if (e.key !== "Escape" || e.target && e.target.closest && e.target.closest(".wbt-table-picker")) return;
          e.preventDefault();
          e.stopPropagation();
          requestClose();
        }
        function failed(message) {
          var text = String(message || "update failed");
          if (/TABLE_NOT_FOUND|TARGET_NOT_TABLE|TREE_CORRUPT/.test(text)) set("tableId", "");
          submission.pending = false;
          setBusy(false);
          setErr(text);
        }
        React.useEffect(function() {
          if (form.tableId && !ownership.tables(props.tree).some(function(x) {
            return x.id === form.tableId;
          })) {
            setForm(function(prev) {
              return Object.assign({}, prev, { tableId: "" });
            });
            setErr("\u6240\u9009\u76EE\u6807\u5DF2\u5931\u6548\uFF0C\u5DF2\u6E05\u7A7A\uFF1B\u8BF7\u91CD\u65B0\u9009\u62E9\u7EA0\u6B63\u76EE\u6807\u3002");
          }
        }, [props.tree, form.tableId]);
        function set(k, v) {
          setForm(function(prev) {
            var next = Object.assign({}, prev);
            next[k] = v;
            return next;
          });
        }
        var titleOk = String(form.title).trim().length > 0;
        function submit() {
          if (isBusy || submission.pending) return;
          if (!titleOk) {
            setErr(t.needTitle);
            return;
          }
          var patch = { id: task.id, title: String(form.title).trim(), description: String(form.description || "") };
          if (form.tableId && form.tableId !== String(task.tableId || "")) {
            if (!ownership.tables(props.tree).some(function(x) {
              return x.id === form.tableId;
            })) {
              setErr("\u76EE\u6807\u5DF2\u5931\u6548\uFF0C\u8BF7\u91CD\u65B0\u9009\u62E9");
              return;
            }
            patch.tableId = form.tableId;
          }
          if (canPriority) {
            var p = Math.round(Number(form.priority));
            if (!isFinite(p)) p = 1;
            if (!Number.isFinite(p)) p = 0;
            patch.priority = Math.max(1, Math.min(10, p));
            if (String(form.targetDate || "").trim()) patch.targetDate = String(form.targetDate).trim();
          }
          patch.difficulty = Math.max(0, Math.min(5, Number(form.difficulty) || 0));
          patch.workspaceIds = (form.workspaceIds || []).slice();
          if (String(form.review) !== String(task.review || "")) patch.review = String(form.review);
          submission.pending = true;
          setBusy(true);
          setErr("");
          props.api.call("tasks.update", patch).then(function(r) {
            setBusy(false);
            if (r && r.ok) props.onSaved(r.result);
            else failed(r && r.error);
          }).catch(function(e) {
            failed(e && e.message || e);
          });
        }
        var st = statusInfo(task.status);
        return h(
          "div",
          { className: "wbt-modal-mask", onKeyDownCapture: onModalKey, onMouseDown: function(e) {
            if (e.target === e.currentTarget) requestClose();
          } },
          h(
            "div",
            { className: "wbt-modal" },
            h(
              "div",
              { className: "wbt-modal-head" },
              h("h3", null, t.editTitle),
              h("span", { className: "wbt-badge " + st.cls }, props.lang === "en" ? st.en : st.zh),
              h("button", { className: "wbt-icon", disabled: isBusy, onClick: requestClose }, "\xD7")
            ),
            h("div", { className: "wbt-mhint" }, done ? t.editHintDone : t.editHintOpen),
            fields({ edit: true, form, set, tree: props.tree, currentId: task.tableId, current: (ownership.tables(props.tree).find(function(x) {
              return x.id === String(task.tableId);
            }) || {}).path || (Array.isArray(task.pathSegments) ? task.pathSegments.map(function(x) {
              return x.name || x;
            }).join(" / ") : task.tablePath || task.tableName || "\u539F\u4EFB\u52A1\u8868\u5DF2\u4E0D\u53EF\u7528") }),
            h(
              "label",
              { className: "wbt-field" },
              h("span", null, t.titleField + " *"),
              h("input", { className: "wbt-input", value: form.title, autoFocus: true, onChange: function(e) {
                set("title", e.target.value);
              } })
            ),
            h(
              "label",
              { className: "wbt-field" },
              h("span", null, t.desc),
              h("textarea", { className: "wbt-textarea", rows: 4, value: form.description, onChange: function(e) {
                set("description", e.target.value);
              } })
            ),
            h(
              "label",
              { className: "wbt-field" },
              h("span", null, t.review + " \xB7 " + t.reviewHint),
              h("textarea", { className: "wbt-textarea", rows: 3, placeholder: t.reviewPlaceholder, value: form.review, onChange: function(e) {
                set("review", e.target.value);
              } })
            ),
            canPriority ? h(
              "label",
              { className: "wbt-field" },
              h("span", null, t.targetDate),
              h("input", { className: "wbt-input", type: "date", value: form.targetDate, onChange: function(e) {
                set("targetDate", e.target.value);
              } })
            ) : null,
            canPriority ? h(
              "label",
              { className: "wbt-field" },
              h("span", null, t.priority + "\uFF081\u201310\uFF09"),
              h("input", { className: "wbt-input", type: "number", min: 1, max: 10, step: 1, value: form.priority, onChange: function(e) {
                set("priority", e.target.value);
              } })
            ) : null,
            difficultyField(t, form.difficulty, function(value) {
              set("difficulty", value);
            }, "wbt-edit-difficulty"),
            h(WorkspaceSelect, { api: props.api, lang: props.lang, value: form.workspaceIds, onChange: function(ids) {
              set("workspaceIds", ids);
            } }),
            err ? h("div", { className: "wbt-err" }, err) : null,
            h(
              "div",
              { className: "wbt-modal-foot" },
              h("button", { className: "wbt-btn ghost", disabled: isBusy, onClick: requestClose }, t.cancel),
              h("button", { className: "wbt-btn primary", disabled: isBusy || !titleOk, onClick: submit }, isBusy ? "\u2026" : t.save)
            )
          )
        );
      }
      return EditModal;
    };
  }
});

// packages/addons/tasks/client/modals/batch-modal.cjs
var require_batch_modal = __commonJS({
  "packages/addons/tasks/client/modals/batch-modal.cjs"(exports2, module2) {
    "use strict";
    module2.exports = function(React, cx, Icon2) {
      var TimelinePicker = require_timeline_controls()(React).Picker;
      var h = React.createElement, Picker = require_table_picker()(React);
      function BatchModal(props) {
        var t = props.t, tr = require_timeline_copy()(props.t);
        var items = props.items || [];
        var mode = props.mode;
        var trigger = React.useRef(typeof document === "undefined" ? null : document.activeElement);
        React.useEffect(function() {
          return function() {
            if (trigger.current) trigger.current.focus();
          };
        }, []);
        var s = React.useState("");
        var value = s[0], setValue = s[1];
        var busy = React.useState(false);
        var isBusy = busy[0], setBusy = busy[1];
        var err = React.useState("");
        var error = err[0], setError = err[1];
        return h(
          "div",
          { className: "wbt-modal-mask", onMouseDown: function(e) {
            if (e.target === e.currentTarget) props.onClose();
          } },
          h(
            "div",
            { className: "wbt-modal batch" },
            h(
              "div",
              { className: "wbt-modal-head" },
              h("h3", null, mode === "timeline" ? t.batchTimeline : t.batchMigrate),
              h("span", { className: "wbt-badge" }, t.batchCount + " " + items.length),
              h("button", { className: "wbt-icon", onClick: props.onClose }, "\xD7")
            ),
            h("div", { className: "wbt-mhint" }, mode === "timeline" ? tr("\u9009\u62E9\u5DF2\u6709\u65F6\u95F4\u7EBF\uFF08\u542B\u7A7A\u7EBF\u548C\u5355\u6210\u5458\u7EBF\uFF09") : t.chooseTable),
            mode === "migrate" ? h(Picker, { tree: props.tree, value, onChange: setValue, onClose: props.onClose }) : h(TimelinePicker, { api: props.api, t, value, onChange: setValue, disabled: isBusy }),
            error ? h("div", { className: "wbt-err" }, error) : null,
            h(
              "div",
              { className: "wbt-modal-foot" },
              h("button", { className: "wbt-btn ghost", onClick: props.onClose }, t.cancel),
              h("button", { className: "wbt-btn primary", disabled: isBusy || !value || mode === "migrate" && !require_ownership().tables(props.tree).some(function(n) {
                return n.id === value;
              }), onClick: function() {
                if (!value) {
                  setError(mode === "timeline" ? t.needBase : t.needTable);
                  return;
                }
                setBusy(true);
                if (mode === "timeline") {
                  props.api.call("tasks.timelineRefactor", { ids: items.map(function(x) {
                    return x.id;
                  }), timelineId: value }).then(function(r) {
                    setBusy(false);
                    if (r && r.ok) props.onDone();
                    else setError(r && r.error || "failed");
                  });
                } else {
                  props.api.call("tasks.migrate", { ids: items.map(function(x) {
                    return x.id;
                  }), tableId: value }).then(function(r) {
                    setBusy(false);
                    if (r && r.ok) props.onDone();
                    else setError(r && r.error || "failed");
                  });
                }
              } }, isBusy ? "\u2026" : t.confirm)
            )
          )
        );
      }
      return BatchModal;
    };
  }
});

// packages/addons/tasks/client/ui/date-filter.cjs
var require_date_filter = __commonJS({
  "packages/addons/tasks/client/ui/date-filter.cjs"(exports2, module2) {
    var React = require("react");
    var h = React.createElement;
    var Icon2 = require_icons().Icon;
    function validDate(value) {
      if (!value) return true;
      if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
      var d = /* @__PURE__ */ new Date(value + "T00:00:00Z");
      return isFinite(d.getTime()) && d.toISOString().slice(0, 10) === value && value.slice(0, 4) !== "0000";
    }
    function normalize(value) {
      var from = value.from || "", to = value.to || "";
      if (!validDate(from) || !validDate(to)) return null;
      return from && to && from > to ? { from: to, to: from, swapped: true } : { from, to, swapped: false };
    }
    function today() {
      var d = /* @__PURE__ */ new Date();
      return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
    }
    function shift(date, days) {
      var d = /* @__PURE__ */ new Date(date + "T00:00:00Z");
      d.setUTCDate(d.getUTCDate() + days);
      return d.toISOString().slice(0, 10);
    }
    function DateFilter(props) {
      var en = props.lang === "en", value = props.value;
      var names = en ? { publish: "Publication", done: "Completion", shutdown: "Closure", target: "Target" } : { publish: "\u53D1\u5E03", done: "\u5B8C\u6210", shutdown: "\u5173\u95ED", target: "\u76EE\u6807" };
      var name = names[props.kind] || names.publish, title = name + (en ? " date range" : "\u65F6\u95F4\u8303\u56F4");
      var openS = React.useState(false), open = openS[0], setOpen = openS[1];
      var startS = React.useState(""), start = startS[0], setStart = startS[1];
      var monthS = React.useState((value.from || value.to || today()).slice(0, 7)), month = monthS[0], setMonth = monthS[1];
      var focusS = React.useState(""), focus = focusS[0], setFocus = focusS[1];
      var root = React.useRef(null), trigger = React.useRef(null), id = React.useId();
      React.useEffect(function() {
        if (open && focus && root.current) {
          var b = root.current.querySelector('[data-day="' + focus + '"]');
          if (b) b.focus();
        }
      }, [open, focus, month]);
      function close() {
        setOpen(false);
        setStart("");
        if (trigger.current) trigger.current.focus();
      }
      function apply(next) {
        var result = normalize(next);
        if (result) {
          props.onChange(result);
          close();
        }
      }
      function pick(day2) {
        if (!start) setStart(day2);
        else apply({ from: start, to: day2 });
      }
      function moveMonth(delta) {
        var d = /* @__PURE__ */ new Date(month + "-01T00:00:00Z");
        d.setUTCMonth(d.getUTCMonth() + delta);
        var next = d.toISOString().slice(0, 7);
        if (/^\d{4}-\d{2}$/.test(next) && next.slice(0, 4) !== "0000") setMonth(next);
      }
      function keyDay(e, day2) {
        var delta = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[e.key];
        if (delta) {
          e.preventDefault();
          var next = shift(day2, delta);
          if (validDate(next)) {
            setMonth(next.slice(0, 7));
            setFocus(next);
          }
        }
      }
      var first = month + "-01", offset = (/* @__PURE__ */ new Date(first + "T00:00:00Z")).getUTCDay();
      var count = new Date(Number(month.slice(0, 4)), Number(month.slice(5)), 0).getDate(), cells = [];
      for (var i = 0; i < offset; i++) cells.push(h("span", { key: "empty" + i, "aria-hidden": true }));
      for (var n = 1; n <= count; n++) {
        var day = month + "-" + String(n).padStart(2, "0"), endpoint = start ? day === start : day === value.from || day === value.to;
        var inside = !start && value.from && value.to && day > value.from && day < value.to;
        cells.push(h("button", {
          key: day,
          type: "button",
          "data-day": day,
          "aria-label": day,
          "aria-pressed": !!endpoint,
          "aria-current": day === today() ? "date" : void 0,
          className: "wbt-range-day" + (endpoint ? " selected" : "") + (inside ? " between" : ""),
          onClick: pick.bind(null, day),
          onKeyDown: function(d, e) {
            keyDay(e, d);
          }.bind(null, day)
        }, n));
      }
      var summary = value.from && value.to ? value.from + " \u2014 " + value.to : value.from ? value.from + (en ? " onward" : " \u8D77") : value.to ? (en ? "Until " : "\u622A\u81F3 ") + value.to : en ? "Choose date range" : "\u9009\u62E9\u65E5\u671F\u8303\u56F4";
      return h(
        "div",
        { className: "wbt-publication-filter", ref: root, onKeyDown: function(e) {
          if (e.key === "Escape" && open) {
            e.stopPropagation();
            close();
          }
        } },
        h(
          "div",
          { className: "wbt-range-entry" },
          h("button", { ref: trigger, type: "button", className: "wbt-btn wbt-range-trigger", "aria-label": title + ": " + summary, "aria-expanded": open, "aria-controls": id, onClick: function() {
            setStart("");
            setFocus("");
            setMonth((value.from || value.to || today()).slice(0, 7));
            setOpen(!open);
          } }, h(Icon2, { name: "calendar" }), h("span", null, summary)),
          value.from || value.to ? h("button", { type: "button", className: "wbt-date-clear", "aria-label": en ? "Clear time range" : "\u6E05\u9664\u65F6\u95F4\u8303\u56F4", onClick: function() {
            apply({ from: "", to: "" });
          } }, "\xD7") : null
        ),
        open ? h(
          "div",
          { id, className: "wbt-range-calendar", role: "group", "aria-label": title },
          h(
            "div",
            { className: "wbt-range-month" },
            h("button", { type: "button", className: "wbt-btn ghost", "aria-label": en ? "Previous month" : "\u4E0A\u4E2A\u6708", onClick: function() {
              moveMonth(-1);
            } }, "\u2039"),
            h("input", { type: "month", value: month, min: "0001-01", max: "9999-12", "aria-label": en ? "Calendar month" : "\u65E5\u5386\u6708\u4EFD", onChange: function(e) {
              if (validDate(e.target.value + "-01")) setMonth(e.target.value);
            } }),
            h("button", { type: "button", className: "wbt-btn ghost", "aria-label": en ? "Next month" : "\u4E0B\u4E2A\u6708", onClick: function() {
              moveMonth(1);
            } }, "\u203A")
          ),
          h("p", { className: "wbt-mhint", role: "status" }, start ? (en ? "Start: " : "\u8D77\u59CB\uFF1A") + start + (en ? " \xB7 Choose end date" : " \xB7 \u8BF7\u9009\u62E9\u7ED3\u675F\u65E5\u671F") : en ? "Choose start, then end date" : "\u5148\u9009\u5F00\u59CB\u65E5\u671F\uFF0C\u518D\u9009\u7ED3\u675F\u65E5\u671F"),
          h("div", { className: "wbt-range-grid" }, (en ? ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"] : ["\u65E5", "\u4E00", "\u4E8C", "\u4E09", "\u56DB", "\u4E94", "\u516D"]).map(function(x) {
            return h("span", { key: x, className: "wbt-range-weekday", "aria-hidden": true }, x);
          }), cells),
          start ? h("div", { className: "wbt-range-actions" }, h("button", { type: "button", className: "wbt-btn ghost", onClick: function() {
            apply({ from: start, to: "" });
          } }, en ? "From this date" : "\u4EC5\u8D77\u59CB\u65E5\u671F"), h("button", { type: "button", className: "wbt-btn ghost", onClick: function() {
            apply({ from: "", to: start });
          } }, en ? "Until this date" : "\u4EC5\u622A\u6B62\u65E5\u671F")) : null,
          h("button", { type: "button", className: "wbt-btn ghost", onClick: close }, en ? "Cancel" : "\u53D6\u6D88")
        ) : null
      );
    }
    module2.exports = { DateFilter, normalize, validDate, today, shift };
  }
});

// packages/addons/tasks/client/views/task-filter-model.cjs
var require_task_filter_model = __commonJS({
  "packages/addons/tasks/client/views/task-filter-model.cjs"(exports2, module2) {
    var date = require_date_filter();
    var groups = ["publish", "done", "shutdown", "claimed"];
    var limits = { priority: { min: 0, max: 10, step: 1 }, difficulty: { min: 0, max: 5, step: 0.5 } };
    var STORE = "wbt.taskFilters.v3";
    function bounds(key) {
      return key === "difficulty" ? { min: "0", max: "5" } : key === "priority" ? { min: "0", max: "10" } : { min: "", max: "" };
    }
    function empty() {
      return { statuses: [], priority: bounds("priority"), difficulty: bounds("difficulty"), publish: { from: "", to: "" }, done: { from: "", to: "" }, shutdown: { from: "", to: "" }, claimed: { from: "", to: "" }, target: { from: "", to: "" }, workspaceIds: [], noWorkspace: false };
    }
    function toggleWorkspace(value, id) {
      var next = Object.assign({}, value, { workspaceIds: value.workspaceIds.slice(), noWorkspace: false });
      var index = next.workspaceIds.indexOf(id);
      if (index >= 0) next.workspaceIds.splice(index, 1);
      else next.workspaceIds.push(id);
      return next;
    }
    function toggleNoWorkspace(value) {
      var next = Object.assign({}, value, { noWorkspace: !value.noWorkspace });
      if (next.noWorkspace) next.workspaceIds = [];
      return next;
    }
    function statusFree(value) {
      return !value.statuses.length;
    }
    function fullLimits(key, box) {
      var spec = limits[key];
      return Number(box.min) === spec.min && Number(box.max) === spec.max;
    }
    function hasRange(value) {
      return groups.concat(["target"]).some(function(key) {
        return value[key].from || value[key].to;
      }) || !!(value.priority.min || value.priority.max) && !fullLimits("priority", value.priority) || !!(value.difficulty.min || value.difficulty.max) && !fullLimits("difficulty", value.difficulty) || !!(value.workspaceIds && value.workspaceIds.length) || value.noWorkspace === true;
    }
    function all(value) {
      return statusFree(value) && !hasRange(value);
    }
    var PRESETS = [
      { id: "urgent", statuses: ["0"], priority: { min: "8", max: "10" } },
      { id: "hard", statuses: ["0", "4"], difficulty: { min: "4", max: "5" } },
      { id: "overdue", statuses: ["0", "4"], target: "before" },
      { id: "dueToday", statuses: ["0", "4"], target: "today" },
      { id: "recentDone", statuses: ["2"], done: "week" },
      { id: "claimed", statuses: ["4"] }
    ];
    function presetValue(id) {
      var spec = null;
      PRESETS.forEach(function(item) {
        if (item.id === id) spec = item;
      });
      if (!spec) return null;
      var value = empty(), now = date.today();
      value.statuses = spec.statuses.slice();
      if (spec.priority) value.priority = { min: spec.priority.min, max: spec.priority.max };
      if (spec.difficulty) value.difficulty = { min: spec.difficulty.min, max: spec.difficulty.max };
      if (spec.target === "before") value.target = { from: "", to: date.shift(now, -1) };
      if (spec.target === "today") value.target = { from: now, to: now };
      if (spec.done === "week") value.done = { from: date.shift(now, -6), to: now };
      return value;
    }
    function signature(value) {
      return JSON.stringify({
        statuses: value.statuses.slice().sort(),
        priority: value.priority,
        difficulty: value.difficulty,
        publish: value.publish,
        done: value.done,
        shutdown: value.shutdown,
        claimed: value.claimed,
        target: value.target,
        workspaceIds: value.workspaceIds,
        noWorkspace: value.noWorkspace
      });
    }
    function activePreset(value) {
      var found = "", want = signature(value);
      PRESETS.forEach(function(spec) {
        if (!found && signature(presetValue(spec.id)) === want) found = spec.id;
      });
      return found;
    }
    function includes(value, status) {
      return statusFree(value) || value.statuses.indexOf(status) >= 0;
    }
    function toggle(value, key) {
      var next = Object.assign({}, value, { statuses: value.statuses.slice() });
      if (key === "all") return empty();
      else {
        var index = next.statuses.indexOf(key);
        if (index >= 0) next.statuses.splice(index, 1);
        else next.statuses.push(key);
      }
      if (key === "2" && value.statuses.indexOf("2") >= 0 || !includes(next, "2")) next.done = { from: "", to: "" };
      if (key === "1" && value.statuses.indexOf("1") >= 0 || !includes(next, "1")) next.shutdown = { from: "", to: "" };
      return next;
    }
    function enable(value, key) {
      var status = key === "done" ? "2" : "1";
      return Object.assign({}, value, { statuses: statusFree(value) ? [status] : Array.from(new Set(value.statuses.concat(status))) });
    }
    function range(value, key, input) {
      var normalized = date.normalize(input);
      if (!normalized) return null;
      var next = value;
      if (key !== "publish" && key !== "claimed" && key !== "target" && (normalized.from || normalized.to)) next = enable(value, key);
      next = Object.assign({}, next);
      next[key] = { from: normalized.from, to: normalized.to };
      return { value: next, swapped: normalized.swapped, autoSelected: key !== "publish" && key !== "claimed" && key !== "target" && value.statuses.indexOf(key === "done" ? "2" : "1") < 0 && !!(normalized.from || normalized.to) };
    }
    function parseLimit(key, input) {
      var text = String(input == null ? "" : input).trim(), spec = limits[key];
      if (!text) return "";
      if (!/^\d+(?:\.\d)?$/.test(text)) return null;
      var number = Number(text);
      if (!isFinite(number) || Math.abs(Math.round(number / spec.step) * spec.step - number) > 1e-9) return null;
      if (number < spec.min || number > spec.max) return null;
      return String(Number(number.toFixed(1)));
    }
    function limit(value, key, end, input) {
      var parsed = parseLimit(key, input), box = Object.assign({}, value[key]);
      if (parsed === null) return null;
      box[end] = parsed;
      var swapped = false;
      if (box.min && box.max && Number(box.min) > Number(box.max)) {
        var swap = box.min;
        box.min = box.max;
        box.max = swap;
        swapped = true;
      }
      var next = Object.assign({}, value);
      next[key] = box;
      return { value: next, swapped, clearsMissing: key === "difficulty" && !!(box.min || box.max) };
    }
    function clearDifficulty(value) {
      var next = Object.assign({}, value);
      next.difficulty = bounds("difficulty");
      return next;
    }
    function args(value) {
      var out = { statuses: value.statuses.map(Number) };
      groups.concat(["target"]).forEach(function(key) {
        out[key + "From"] = value[key].from || void 0;
        out[key + "To"] = value[key].to || void 0;
      });
      if (value.priority.min && !fullLimits("priority", value.priority)) out.priorityMin = Number(value.priority.min);
      if (value.priority.max && !fullLimits("priority", value.priority)) out.priorityMax = Number(value.priority.max);
      if (value.difficulty.min && !fullLimits("difficulty", value.difficulty)) out.difficultyMin = Number(value.difficulty.min);
      if (value.difficulty.max && !fullLimits("difficulty", value.difficulty)) out.difficultyMax = Number(value.difficulty.max);
      if (value.noWorkspace) out.noWorkspace = true;
      else if (value.workspaceIds && value.workspaceIds.length) out.workspaceIds = value.workspaceIds.slice();
      return out;
    }
    function readBounds(params, key, target) {
      var min = String(params[key + "Min"] == null ? "" : params[key + "Min"]), max = String(params[key + "Max"] == null ? "" : params[key + "Max"]);
      var result = limit(target, key, "min", min);
      if (!result && min) return null;
      var next = result ? result.value : target;
      result = limit(next, key, "max", max);
      if (!result && max) return null;
      return result ? result.value : next;
    }
    function navigation(params) {
      if (!params) return null;
      var value;
      if (params.activityDate && date.validDate(params.activityDate)) {
        var type = groups.indexOf(params.activityType) >= 0 ? params.activityType : "done";
        value = range(empty(), type, { from: params.activityDate, to: params.activityDate }).value;
      } else if (params.filterRoot === true) {
        value = empty();
        groups.forEach(function(key) {
          var result = range(value, key, { from: params[key + "From"] || "", to: params[key + "To"] || "" });
          if (result) value = result.value;
        });
      } else if (params.priorityMin !== void 0 || params.priorityMax !== void 0 || params.difficultyMin !== void 0 || params.difficultyMax !== void 0 || params.targetFrom !== void 0 || params.targetTo !== void 0) {
        value = empty();
      } else if (params.noWorkspace === true || Array.isArray(params.workspaceIds) && params.workspaceIds.length) {
        value = empty();
        if (params.noWorkspace === true) value.noWorkspace = true;
        else value.workspaceIds = params.workspaceIds.map(String).filter(Boolean);
      } else return null;
      var withPriority = readBounds(params, "priority", value);
      var withDifficulty = withPriority ? readBounds(params, "difficulty", withPriority) : null;
      return withDifficulty || value;
    }
    function save(value, missing, params) {
      try {
        if (typeof sessionStorage === "undefined") return;
        sessionStorage.setItem(STORE, JSON.stringify(Object.assign({ missing: missing === true, navigation: JSON.stringify(params || {}) }, value)));
      } catch (e) {
      }
    }
    function load(params) {
      try {
        if (typeof sessionStorage === "undefined") return null;
        var raw = sessionStorage.getItem(STORE);
        if (!raw) return null;
        var parsed = JSON.parse(raw), value = empty();
        if (parsed.navigation !== JSON.stringify(params || {})) return null;
        if (Array.isArray(parsed.statuses)) value.statuses = parsed.statuses.map(String).filter(function(s) {
          return /^[0-4]$/.test(s);
        });
        groups.concat(["target"]).forEach(function(key) {
          var box = parsed[key] || {};
          if (typeof box.from === "string" && date.validDate(box.from)) value[key].from = box.from;
          if (typeof box.to === "string" && date.validDate(box.to)) value[key].to = box.to;
        });
        if (Array.isArray(parsed.workspaceIds)) value.workspaceIds = parsed.workspaceIds.map(String).filter(Boolean);
        value.noWorkspace = parsed.noWorkspace === true;
        ["priority", "difficulty"].forEach(function(key) {
          var box = parsed[key] || {}, min = limit(value, key, "min", box.min), max;
          if (min) {
            value = min.value;
            max = limit(value, key, "max", box.max);
            if (max) value = max.value;
          }
        });
        return { value, missing: parsed.missing === true && !value.difficulty.min && !value.difficulty.max };
      } catch (e) {
        return null;
      }
    }
    module2.exports = {
      groups,
      all,
      empty,
      includes,
      toggle,
      enable,
      range,
      limit,
      limits,
      clearDifficulty,
      args,
      toggleWorkspace,
      toggleNoWorkspace,
      presets: PRESETS.map(function(spec) {
        return spec.id;
      }),
      presetValue,
      activePreset,
      navigation,
      save,
      load
    };
  }
});

// packages/addons/tasks/client/views/task-filter-panel.cjs
var require_task_filter_panel = __commonJS({
  "packages/addons/tasks/client/views/task-filter-panel.cjs"(exports2, module2) {
    var Icon2 = require_icons().Icon;
    var model = require_task_filter_model();
    var DateFilter = require_date_filter().DateFilter;
    var WorkspaceFilter = require_workspacefilter();
    function NumberInput(p) {
      var React = p.React, draftState = React.useState(String(p.value)), draft = draftState[0], setDraft = draftState[1];
      React.useEffect(function() {
        setDraft(String(p.value));
      }, [p.value]);
      function commit(node) {
        var result = p.commit(node.validity && node.validity.badInput ? "invalid" : draft);
        setDraft(result === void 0 ? String(p.value) : result);
      }
      return React.createElement("input", {
        type: "number",
        className: "wbt-input wbt-limit-input",
        min: p.min,
        max: p.max,
        step: p.step,
        inputMode: p.step === 1 ? "numeric" : "decimal",
        value: draft,
        "aria-label": p.label,
        placeholder: p.placeholder,
        onChange: function(e) {
          setDraft(e.target.value);
        },
        onBlur: function(e) {
          commit(e.currentTarget);
        },
        onKeyDown: function(e) {
          if (e.key === "Enter") {
            e.preventDefault();
            e.currentTarget.blur();
          }
          if (e.key === "Escape") {
            e.preventDefault();
            setDraft(String(p.value));
          }
        }
      });
    }
    module2.exports = function renderFilterPanel(React, p) {
      var h = React.createElement, en = p.lang === "en", value = p.value;
      var title = en ? "Filters" : "\u7B5B\u9009";
      var labels = en ? { publish: "Publication range", done: "Completion range", shutdown: "Closure range", claimed: "Claim range", target: "Target range" } : { publish: "\u53D1\u5E03\u65F6\u95F4\u8303\u56F4", done: "\u5B8C\u6210\u65F6\u95F4\u8303\u56F4", shutdown: "\u5173\u95ED\u65F6\u95F4\u8303\u56F4", claimed: "\u63A5\u53D6\u65F6\u95F4\u8303\u56F4", target: "\u76EE\u6807\u65E5\u671F\u8303\u56F4" };
      var options = [["all", en ? "All" : "\u5168\u90E8"], ["0", en ? "Opened" : "\u5DF2\u5F00\u542F"], ["2", en ? "Completed" : "\u5DF2\u5B8C\u6210"], ["1", en ? "Closed" : "\u5DF2\u5173\u95ED"], ["3", en ? "Restarted" : "\u5DF2\u91CD\u542F"], ["4", en ? "Claimed" : "\u5DF2\u63A5\u53D6"]];
      var presetNames = en ? { urgent: "Urgent (P8\u201310)", hard: "Hard (D4\u20135)", overdue: "Overdue", dueToday: "Due today", recentDone: "Done in 7 days", claimed: "Claimed" } : { urgent: "\u7D27\u6025\u4EFB\u52A1 P8\u201310", hard: "\u9AD8\u96BE\u5EA6 D4\u20135", overdue: "\u5DF2\u903E\u671F", dueToday: "\u4ECA\u65E5\u5230\u671F", recentDone: "\u8FD1 7 \u5929\u5B8C\u6210", claimed: "\u5DF2\u63A5\u53D6" };
      var activePreset = model.activePreset(value);
      var unitId = p.id + "-unit";
      var units = en ? { priority: "0\u201310, higher is more urgent", difficulty: "0\u20135 in half steps, higher is harder" } : { priority: "0\u201310\uFF0C\u8D8A\u5927\u8D8A\u7D27\u6025", difficulty: "0\u20135\uFF0C\u534A\u6863\u9012\u589E\uFF0C\u8D8A\u5927\u8D8A\u96BE" };
      function change(next) {
        p.onChange(next);
      }
      function pickPreset(id) {
        p.onHint("");
        if (p.onMissingChange) p.onMissingChange(false);
        change(id === activePreset ? model.empty() : model.presetValue(id));
      }
      function setRange(key, input) {
        var result = model.range(value, key, input);
        if (!result) {
          p.onHint(en ? "Enter a valid date" : "\u8BF7\u8F93\u5165\u6709\u6548\u65E5\u671F");
          return;
        }
        var hints = [];
        if (result.swapped || input.swapped) hints.push(en ? "Start was after end; dates swapped" : "\u8D77\u59CB\u665A\u4E8E\u7EC8\u6B62\uFF0C\u5DF2\u4EA4\u6362");
        if (result.autoSelected) hints.push(en ? "Corresponding status selected automatically" : "\u5DF2\u81EA\u52A8\u52FE\u9009\u5BF9\u5E94\u72B6\u6001");
        p.onHint(hints.join(" \xB7 "));
        change(result.value);
      }
      function setLimit(key, end, text) {
        var result = model.limit(value, key, end, text);
        if (!result) {
          p.onHint(en ? key === "difficulty" ? "Difficulty takes 0.5 steps from 0 to 5" : "Priority takes whole numbers 0\u201310" : key === "difficulty" ? "\u96BE\u5EA6\u4EC5\u63A5\u53D7 0\u20135 \u4E4B\u95F4\u7684\u534A\u6863\u6570\u503C" : "\u4F18\u5148\u7EA7\u4EC5\u63A5\u53D7 0\u201310 \u7684\u6574\u6570");
          return;
        }
        var hints = [];
        if (result.swapped) hints.push(en ? "Start was above end; values swapped" : "\u8D77\u59CB\u5927\u4E8E\u7EC8\u6B62\uFF0C\u5DF2\u4EA4\u6362");
        if (result.clearsMissing && p.difficultyMissing) hints.push(en ? "Cleared \u201Cdifficulty unset only\u201D" : "\u5DF2\u53D6\u6D88\u300C\u4EC5\u672A\u586B\u96BE\u5EA6\u300D");
        p.onHint(hints.join(" \xB7 "));
        if (result.clearsMissing && p.onMissingChange) p.onMissingChange(false);
        change(result.value);
        return result.value[key][end];
      }
      function limitRow(key, label) {
        var box = value[key], spec = model.limits[key];
        function field(end) {
          var labelText = en ? (end === "min" ? "Minimum " : "Maximum ") + label : (end === "min" ? "\u6700\u4F4E" : "\u6700\u9AD8") + label;
          return h(NumberInput, { React, value: box[end], min: spec.min, max: spec.max, step: spec.step, label: labelText, placeholder: String(end === "min" ? spec.min : spec.max), commit: function(text) {
            return setLimit(key, end, text);
          } });
        }
        function clear() {
          p.onHint("");
          change(Object.assign({}, value, (function() {
            var next = {};
            next[key] = { min: String(spec.min), max: String(spec.max) };
            return next;
          })()));
        }
        return h(
          "div",
          { className: "wbt-limit-row", key },
          h(
            "div",
            { className: "wbt-limit-head" },
            h("strong", null, label),
            h("span", { className: "wbt-limit-unit", id: unitId + "-" + key }, units[key])
          ),
          h(
            "div",
            { className: "wbt-limit-fields", role: "group", "aria-label": label, "aria-describedby": unitId + "-" + key },
            field("min"),
            h("span", { className: "wbt-limit-join", "aria-hidden": true }, en ? "to" : "\u81F3"),
            field("max"),
            h("button", { type: "button", className: "wbt-btn ghost wbt-limit-clear", "aria-label": (en ? "Reset " : "\u91CD\u7F6E") + label, title: (en ? "Reset " : "\u91CD\u7F6E") + label, onClick: clear }, "\xD7")
          )
        );
      }
      return h(
        "aside",
        { className: "wbt-filter-panel" + (p.open ? " expanded" : ""), "aria-label": title },
        h("button", { type: "button", className: "wbt-btn wbt-filter-toggle", "aria-label": title, title, "aria-expanded": p.open, "aria-controls": p.id, onClick: p.onToggle }, h(Icon2, { name: "filter" })),
        h(
          "div",
          { className: "wbt-filter-content", id: p.id },
          h(
            "section",
            { className: "wbt-filter-group wbt-presets", role: "group", "aria-label": en ? "Quick filters" : "\u5FEB\u6377\u7B5B\u9009" },
            h("strong", null, en ? "Quick filters" : "\u5FEB\u6377\u7B5B\u9009"),
            h("div", { className: "wbt-preset-list" }, model.presets.map(function(id) {
              var on = id === activePreset;
              return h("button", { key: id, type: "button", className: "wbt-btn wbt-preset" + (on ? " active" : ""), "aria-pressed": on, "data-preset": id, onClick: function() {
                pickPreset(id);
              } }, presetNames[id]);
            }))
          ),
          h("fieldset", { className: "wbt-filter-group wbt-status-grid" }, h("legend", null, en ? "Status (match any)" : "\u72B6\u6001"), options.map(function(option) {
            var key = option[0], checked = key === "all" ? model.all(value) : value.statuses.indexOf(key) >= 0;
            return h("label", { key, className: "wbt-check" }, h("input", { type: "checkbox", checked, "data-status": key, onChange: function() {
              change(model.toggle(value, key));
              p.onHint("");
            } }), option[1]);
          })),
          p.search,
          // 工作区与标签同为下拉多选；「未关联工作区」收在菜单里，互斥由 model.toggle* 保证。
          p.api ? h("div", { className: "wbt-filter-group wbt-ws-group" }, h(WorkspaceFilter, {
            api: p.api,
            t: p.t,
            Icon: p.Icon,
            ids: value.workspaceIds,
            noWorkspace: value.noWorkspace === true,
            onToggle: function(id) {
              change(model.toggleWorkspace(value, id));
            },
            onToggleNoWorkspace: function() {
              change(model.toggleNoWorkspace(value));
            },
            onClear: function() {
              change(Object.assign({}, value, { workspaceIds: [], noWorkspace: false }));
            }
          })) : p.workspaces || null,
          h("div", { className: "wbt-filter-group" }, p.tags, p.missing),
          h(
            "section",
            { className: "wbt-filter-group wbt-limit-group", role: "group", "aria-label": en ? "Priority and difficulty" : "\u4F18\u5148\u7EA7\u4E0E\u96BE\u5EA6" },
            limitRow("priority", en ? "Priority" : "\u4F18\u5148\u7EA7"),
            limitRow("difficulty", en ? "Difficulty" : "\u96BE\u5EA6")
          ),
          h(
            "section",
            { className: "wbt-filter-group wbt-target-group", "aria-label": labels.target },
            h("strong", null, labels.target),
            h(DateFilter, { lang: p.lang, kind: "target", value: value.target, onChange: function(next) {
              setRange("target", next);
            } })
          ),
          model.groups.map(function(key) {
            return h(
              "section",
              { key, className: "wbt-filter-group", "aria-label": labels[key] },
              h("strong", null, labels[key]),
              h(DateFilter, { lang: p.lang, kind: key, value: value[key], onChange: function(next) {
                setRange(key, next);
              } })
            );
          }),
          (value.done.from || value.done.to) && (value.shutdown.from || value.shutdown.to) ? h("div", { className: "wbt-mhint", role: "status" }, en ? "Completion and closure ranges require different statuses; their intersection is empty." : "\u5B8C\u6210\u4E0E\u5173\u95ED\u8303\u56F4\u8981\u6C42\u4E0D\u540C\u72B6\u6001\uFF0C\u540C\u65F6\u586B\u5199\u65F6\u4EA4\u96C6\u4E3A\u7A7A\u3002") : null,
          p.hint ? h("div", { className: "wbt-mhint", role: "status" }, p.hint) : null
        )
      );
    };
  }
});

// packages/addons/tasks/client/views/claim-batch.cjs
var require_claim_batch = __commonJS({
  "packages/addons/tasks/client/views/claim-batch.cjs"(exports2, module2) {
    "use strict";
    module2.exports = function claimBatch(api, ids, t) {
      return api.call("tasks.claimBatch", { ids }).then(function(r) {
        var d = r && r.result ? r.result : r;
        if (!d) return { ok: [], message: "claim failed" };
        var ok = (d.claimed || []).map(function(x) {
          return String(x.id);
        });
        var c = d.counts || {};
        var already = Number(c.alreadyClaimed || 0), notClaimable = Number(c.notClaimable || 0);
        var missing = Number(c.notFound || 0) + Number(c.deleted || 0), busy = Number(c.busy || 0);
        if (!already && !notClaimable && !missing && !busy) return { ok, message: t.claimedCount.replace("{n}", String(ok.length)) };
        return { ok, message: t.claimSummary.replace("{ok}", String(ok.length)).replace("{fail}", String(already + notClaimable + missing + busy)).replace("{already}", String(already)).replace("{notClaimable}", String(notClaimable)).replace("{missing}", String(missing)) };
      }).catch(function(e) {
        return { ok: [], message: e && e.message || "claim failed" };
      });
    };
    module2.exports.makeClaimSelected = function makeClaimSelected(d) {
      return function claimSelected() {
        var ids = d.ids();
        if (!ids.length) return;
        module2.exports(d.api, ids, d.t).then(function(r) {
          var done = new Set(r.ok);
          var left = new Set(ids.filter(function(id) {
            return !done.has(String(id));
          }));
          d.setIds(left);
          d.refreshList();
          d.refreshTagNav();
          if (!left.size) d.clear();
          d.say(r.message);
        });
      };
    };
  }
});

// packages/addons/tasks/client/views/selection-bar.cjs
var require_selection_bar = __commonJS({
  "packages/addons/tasks/client/views/selection-bar.cjs"(exports2, module2) {
    "use strict";
    module2.exports = function renderSelectionBar(h, Icon2, p) {
      var t = p.t;
      return h(
        "div",
        { className: "wbt-selbar" },
        h("b", null, t.selected + " " + p.count),
        h("button", { className: "wbt-btn", onClick: p.openSelected }, t.selectedTasks),
        h("button", { className: "wbt-btn", onClick: p.batchTimeline }, t.batchTimeline),
        h("button", { className: "wbt-btn", onClick: p.batchMigrate }, t.batchMigrate),
        h("button", { className: "wbt-btn", onClick: p.claimSelected }, t.claimSelected),
        h("button", { className: "wbt-btn wbt-act-del", onClick: p.batchDelete }, h(Icon2, { name: "trash", size: 13 }), t.batchDelete),
        h("button", { className: "wbt-btn ghost", onClick: p.clear }, t.clear)
      );
    };
  }
});

// packages/addons/tasks/client/views/tasks-view.cjs
var require_tasks_view = __commonJS({
  "packages/addons/tasks/client/views/tasks-view.cjs"(exports2, module2) {
    module2.exports = function createTasksView(deps) {
      var React = deps.React, configView = deps.configView, CFG_FALLBACK = deps.CFG_FALLBACK, COPY = deps.COPY, injectCss = deps.injectCss, allTables = deps.allTables, findFirstTable = deps.findFirstTable, treeWalk = deps.treeWalk, treeFlat = deps.treeFlat, cx = deps.cx, Icon2 = deps.Icon, TaskItem = deps.TaskItem, PathCrumbs = deps.PathCrumbs, TagFilter = deps.TagFilter, TreeNode = deps.TreeNode, CreateModal = deps.CreateModal, TimelineModal = deps.TimelineModal, NodeModal = deps.NodeModal, EditModal = deps.EditModal, DoneModal = deps.DoneModal, BatchModal = deps.BatchModal;
      var h = React.createElement, filters = require_task_filter_model(), renderFilters = require_task_filter_panel(), claimBatch = require_claim_batch(), renderSelectionBar = require_selection_bar();
      function TasksView(props) {
        var lang = props.lang === "en" ? "en" : "zh";
        var cfg = configView.useConfig(props.api, CFG_FALLBACK);
        if (!cfg.ready) {
          return h("div", { style: { padding: "48px", textAlign: "center", fontSize: "12.5px", opacity: 0.6 } }, lang === "en" ? "Loading\u2026" : "\u8F7D\u5165\u4E2D\u2026");
        }
        return h(TasksViewBody, Object.assign({}, props, { cfg: cfg.values }));
      }
      function expandedByDepth(nodes, depth) {
        var out = /* @__PURE__ */ new Set();
        (function walk(list, d) {
          (list || []).forEach(function(n) {
            if (d >= depth || !n.children || !n.children.length) return;
            out.add(String(n.id));
            walk(n.children, d + 1);
          });
        })(nodes, 0);
        return out;
      }
      function TasksViewBody(props) {
        var t = COPY[props.lang === "en" ? "en" : "zh"];
        var api = props.api;
        var cfg = props.cfg || {};
        var activityNavigation = filters.navigation(props.viewParams);
        var tableNavigation = !activityNavigation && props.viewParams && props.viewParams.tableId;
        var groupNavigation = !activityNavigation && !tableNavigation && props.viewParams && props.viewParams.groupId;
        var nodeNavigation = tableNavigation || groupNavigation;
        var cfgSize = Math.floor(Number(cfg["list.pageSize"]));
        if (!(cfgSize > 0)) cfgSize = 12;
        var cfgDepth = Math.floor(Number(cfg["ui.expandDepth"]));
        if (!(cfgDepth >= 0)) cfgDepth = 2;
        var cfgSort = typeof cfg["list.sort"] === "string" ? cfg["list.sort"] : "auto";
        var cfgConfirm = cfg["ui.confirmDelete"] !== false;
        var treeS = React.useState([]);
        var tree = treeS[0], setTree = treeS[1];
        var expS = React.useState(/* @__PURE__ */ new Set());
        var expanded = expS[0], setExpanded = expS[1];
        var expInitRef = React.useRef(false);
        var targetS = React.useState(tableNavigation ? { tableId: String(tableNavigation), groupId: props.viewParams.groupId } : { groupId: groupNavigation ? String(groupNavigation) : "1", tableId: null });
        var target = targetS[0], setTarget = targetS[1];
        var pathS = React.useState([]);
        var currentPath = pathS[0], setCurrentPath = pathS[1];
        var storedFilters = filters.load(props.viewParams);
        var initialMissing = storedFilters ? storedFilters.missing : !activityNavigation && !nodeNavigation && !!(props.viewParams && props.viewParams.difficultyMissing === true);
        var missingS = React.useState(initialMissing);
        var difficultyMissing = missingS[0], setDifficultyMissing = missingS[1];
        var defaultPreset = filters.presetValue(cfg["ui.defaultPreset"]);
        var filterState = React.useState(storedFilters && storedFilters.value || activityNavigation || defaultPreset || filters.empty());
        var filterValue = filterState[0], setFilterValue = filterState[1];
        React.useEffect(function() {
          filters.save(filterValue, difficultyMissing, props.viewParams);
        }, [filterValue, difficultyMissing, JSON.stringify(props.viewParams || {})]);
        var panelState = React.useState(false), panelOpen = panelState[0], setPanelOpen = panelState[1];
        var hintState = React.useState(""), filterHint = hintState[0], setFilterHint = hintState[1];
        var panelId = React.useId();
        var viewS = React.useState(!nodeNavigation && cfg["ui.listView"] === "card" ? "card" : "list");
        var view = viewS[0], setView = viewS[1];
        var searchS = React.useState("");
        var searchDraft = searchS[0], setSearchDraft = searchS[1];
        var tqS = React.useState("");
        var treeQuery = tqS[0], setTreeQuery = tqS[1];
        var titleS = React.useState("");
        var titleKey = titleS[0], setTitleKey = titleS[1];
        var tagReloadS = React.useState(0);
        var tagReload = tagReloadS[0], setTagReload = tagReloadS[1];
        var filterTagIdsS = React.useState([]);
        var filterTagIds = filterTagIdsS[0], setFilterTagIds = filterTagIdsS[1];
        var pageS = React.useState(1);
        var pageNumber = pageS[0], setPageNumber = pageS[1];
        var sizeS = React.useState(cfgSize);
        var pageSize = sizeS[0], setPageSize = sizeS[1];
        var dataS = React.useState({ records: [], total: 0, current: 1, size: 0, pageable: false });
        var data = dataS[0], setData = dataS[1];
        var loadingS = React.useState(true);
        var loading = loadingS[0], setLoading = loadingS[1];
        var errorS = React.useState("");
        var error = errorS[0], setError = errorS[1];
        var drawerS = React.useState(false);
        var drawer = drawerS[0], setDrawer = drawerS[1];
        var managerS = React.useState(false);
        var manager = managerS[0], setManager = managerS[1];
        var selModeS = React.useState(false);
        var selectionMode = selModeS[0], setSelectionMode = selModeS[1];
        var selS = React.useState(/* @__PURE__ */ new Set());
        var selectedIds = selS[0], setSelectedIds = selS[1];
        var selItemsS = React.useState([]);
        var selectedItems = selItemsS[0], setSelectedItems = selItemsS[1];
        var selOpenS = React.useState(false);
        var selectedOpen = selOpenS[0], setSelectedOpen = selOpenS[1];
        var batchS = React.useState(null);
        var batchMode = batchS[0], setBatchMode = batchS[1];
        var createS = React.useState(null);
        var createState = createS[0], setCreateState = createS[1];
        var timelineS = React.useState(null);
        var timelineTask = timelineS[0], setTimelineTask = timelineS[1];
        var doneS = React.useState(null);
        var doneTask = doneS[0], setDoneTask = doneS[1];
        var editTaskS = React.useState(null);
        var editTask = editTaskS[0], setEditTask = editTaskS[1];
        var editS = React.useState(null);
        var edit = editS[0], setEdit = editS[1];
        var nodeModalS = React.useState(null);
        var nodeModal = nodeModalS[0], setNodeModal = nodeModalS[1];
        var editNameS = React.useState("");
        var editName = editNameS[0], setEditName = editNameS[1];
        var dragS = React.useState(null);
        var dragId = dragS[0], setDragId = dragS[1];
        var dropS = React.useState(null);
        var dropId = dropS[0], setDropId = dropS[1];
        var toastS = React.useState("");
        var toast = toastS[0], setToast = toastS[1];
        var refreshRef = React.useRef({}), initialNavigation = React.useRef(true);
        React.useEffect(function() {
          if (initialNavigation.current) {
            initialNavigation.current = false;
            if (storedFilters) return;
          }
          if (!activityNavigation && !nodeNavigation) return;
          setFilterValue(activityNavigation || defaultPreset || filters.empty());
          setTarget(tableNavigation ? { tableId: String(tableNavigation), groupId: props.viewParams.groupId } : { groupId: groupNavigation ? String(groupNavigation) : "1", tableId: null });
          setDifficultyMissing(false);
          setFilterHint("");
          setSearchDraft("");
          setTitleKey("");
          setFilterTagIds([]);
          setPageNumber(1);
          setSelectedIds(/* @__PURE__ */ new Set());
          setSelectionMode(false);
        }, [JSON.stringify(props.viewParams || {})]);
        function say(msg) {
          setToast(String(msg || ""));
        }
        React.useEffect(function() {
          if (!toast) return;
          var id = setTimeout(function() {
            setToast("");
          }, 3200);
          return function() {
            clearTimeout(id);
          };
        }, [toast]);
        var treeSearchRef = React.useRef(null);
        React.useEffect(function() {
          if (!drawer) return;
          var id = setTimeout(function() {
            if (treeSearchRef.current) treeSearchRef.current.focus();
          }, 40);
          function onKey(e) {
            if (e.key === "Escape") setDrawer(false);
          }
          window.addEventListener("keydown", onKey);
          return function() {
            clearTimeout(id);
            window.removeEventListener("keydown", onKey);
          };
        }, [drawer]);
        var refreshTree = React.useCallback(function() {
          return api.call("taskNodes.tree").then(function(r) {
            if (r && r.ok) {
              var nodes = Array.isArray(r.result) ? r.result : [];
              setTree(nodes);
              if (!expInitRef.current) {
                let reveal2 = function(list, parents) {
                  (list || []).forEach(function(n) {
                    if (String(n.id) === String(nodeNavigation)) parents.forEach(function(id) {
                      open.add(id);
                    });
                    reveal2(n.children, parents.concat(String(n.id)));
                  });
                };
                var reveal = reveal2;
                expInitRef.current = true;
                var open = expandedByDepth(nodes, cfgDepth);
                if (nodeNavigation) reveal2(nodes, []);
                setExpanded(open);
              }
            } else setError(r && r.error || "tree load failed");
          }).catch(function(e) {
            setError(String(e && e.message || e));
          });
        }, [api]);
        var refreshTagNav = React.useCallback(function() {
          setTagReload(function(n) {
            return n + 1;
          });
        }, []);
        var refreshPath = React.useCallback(function(id) {
          if (!id) {
            setCurrentPath([]);
            return Promise.resolve();
          }
          return api.call("taskNodes.path", { id }).then(function(r) {
            if (r && r.ok) setCurrentPath(Array.isArray(r.result) ? r.result : []);
          }).catch(function() {
          });
        }, [api]);
        var refreshList = React.useCallback(function() {
          setLoading(true);
          return api.call("tasks.list", Object.assign({
            titleKey,
            tableId: target.tableId,
            groupId: target.tableId ? null : target.groupId,
            pageNumber,
            pageSize,
            tagIds: filterTagIds,
            difficultyMissing,
            sort: nodeNavigation || cfgSort === "auto" ? void 0 : cfgSort
          }, filters.args(filterValue))).then(function(r) {
            setLoading(false);
            if (r && r.ok) {
              setData(r.result || { records: [], total: 0, current: 1, size: 0, pageable: false });
              setError("");
            } else {
              setError(r && r.error || "list load failed");
            }
          }).catch(function(e) {
            setLoading(false);
            setError(String(e && e.message || e));
          });
        }, [api, titleKey, target.tableId, target.groupId, pageNumber, pageSize, filterTagIds, difficultyMissing, cfgSort, filterValue]);
        refreshRef.current = { tree: refreshTree, list: refreshList, path: refreshPath, tags: refreshTagNav };
        React.useEffect(function() {
          injectCss();
          refreshTree();
          refreshTagNav();
          refreshPath("1");
        }, [refreshTree, refreshTagNav, refreshPath]);
        React.useEffect(function() {
          refreshList();
        }, [refreshList]);
        React.useEffect(function() {
          var off = api.subscribe(function(p) {
            if (!p) return;
            if (p.event === "tasks-changed") {
              refreshRef.current.list();
              refreshRef.current.tags();
            }
            if (p.event === "task-nodes-changed") {
              refreshRef.current.tree();
              refreshRef.current.path(target.tableId || target.groupId);
            }
            if (p.event === "task-workspaces-changed") refreshRef.current.list();
          });
          return off;
        }, [api, target.tableId, target.groupId]);
        React.useEffect(function() {
          refreshPath(target.tableId || target.groupId);
        }, [target.tableId, target.groupId, refreshPath]);
        function update(task, patch) {
          var args = Object.assign({ id: task.id }, patch);
          api.call("tasks.update", args).then(function(r) {
            if (r && r.ok) refreshList();
            else say(r && r.error || "update failed");
          });
        }
        function pickNode(node) {
          if (String(node.type) === "1") setTarget({ groupId: String(node.parent || node.parentId || ""), tableId: String(node.id) });
          else setTarget({ groupId: String(node.id), tableId: null });
          setPageNumber(1);
          setDrawer(false);
        }
        function pickPath(p, i, path) {
          if (String(p.type) === "1") {
            var parent = i > 0 ? path[i - 1] : null;
            setTarget({ groupId: parent ? String(parent.id) : "", tableId: String(p.id) });
          } else {
            setTarget({ groupId: String(p.id), tableId: null });
          }
          setPageNumber(1);
        }
        function toggleExpanded(id) {
          var next = new Set(expanded);
          if (next.has(String(id))) next.delete(String(id));
          else next.add(String(id));
          setExpanded(next);
        }
        function addNode(parentId, type) {
          setNodeModal({ parentId, type, node: null });
        }
        function nodeSaved(op) {
          var cur = nodeModal;
          setNodeModal(null);
          if (cur && cur.parentId) {
            var next = new Set(expanded);
            next.add(String(cur.parentId));
            setExpanded(next);
          }
          refreshTree();
          say(op === "create" ? t.created : t.saved);
        }
        function renameNode(id, name) {
          if (!edit || String(edit.id) !== String(id)) return;
          var v = String(name || "").trim();
          if (!v || v === String(edit.name || "")) {
            setEdit(null);
            return;
          }
          api.call("taskNodes.rename", { id, name: v }).then(function(r) {
            setEdit(null);
            if (r && r.ok) {
              refreshTree();
              say(t.saved);
            } else say(r && r.error || "rename failed");
          });
        }
        function deleteTask(task) {
          if (cfgConfirm && !window.confirm(t.deleteTaskConfirm)) return;
          api.call("tasks.delete", { id: task.id }).then(function(r) {
            if (r && r.ok) {
              refreshList();
              refreshTagNav();
              say(t.deleted);
            } else say(r && r.error || "delete failed");
          });
        }
        function batchDelete() {
          var ids = Array.from(selectedIds);
          if (!ids.length) return;
          if (cfgConfirm && !window.confirm(t.batchDeleteConfirm.replace("{n}", String(ids.length)))) return;
          var ok = 0, fail = 0;
          Promise.all(ids.map(function(id) {
            return api.call("tasks.delete", { id }).then(function(r) {
              if (r && r.ok) ok++;
              else fail++;
              return r;
            }).catch(function() {
              fail++;
              return null;
            });
          })).then(function() {
            clearSelection();
            refreshList();
            refreshTagNav();
            say(fail ? t.deleted + " " + ok + " \xB7 " + t.deletePartial + " " + fail : t.deleted + " " + ok);
          });
        }
        var claimSelected = claimBatch.makeClaimSelected({
          api,
          t,
          ids: function() {
            return Array.from(selectedIds);
          },
          setIds: setSelectedIds,
          clear: clearSelection,
          say,
          refreshList,
          refreshTagNav
        });
        function deleteNode(node) {
          if (cfgConfirm && !window.confirm(t.deleteConfirm)) return;
          api.call("taskNodes.delete", { id: node.id }).then(function(r) {
            if (r && r.ok) {
              refreshTree();
              setTarget({ groupId: "1", tableId: null });
              setPageNumber(1);
              say(t.deleted);
            } else say(r && r.error || "delete failed");
          });
        }
        function moveNode(sourceId, targetId, moveType) {
          setDropId(null);
          setDragId(null);
          api.call("taskNodes.move", { sourceId, targetId, moveType }).then(function(r) {
            if (r && r.ok) {
              if (String(moveType) === "0") {
                var next = new Set(expanded);
                next.add(String(targetId));
                setExpanded(next);
              }
              refreshTree();
              say(t.updated);
            } else say(r && r.error || "move failed");
          });
        }
        function toggleTagId(id) {
          var next = filterTagIds.slice();
          var idx = next.indexOf(String(id));
          if (idx >= 0) next.splice(idx, 1);
          else next.push(String(id));
          setFilterTagIds(next);
          setPageNumber(1);
        }
        function toggleSelect(id) {
          var next = new Set(selectedIds);
          if (next.has(String(id))) next.delete(String(id));
          else next.add(String(id));
          setSelectedIds(next);
        }
        function openSelected() {
          var ids = Array.from(selectedIds);
          if (!ids.length) {
            say("\u8BF7\u5148\u52FE\u9009\u4EFB\u52A1");
            return;
          }
          api.call("tasks.selected", { ids }).then(function(r) {
            if (r && r.ok) {
              setSelectedItems(Array.isArray(r.result) ? r.result : []);
              setSelectedOpen(true);
            } else say(r && r.error || "load failed");
          });
        }
        function clearSelection() {
          setSelectedIds(/* @__PURE__ */ new Set());
          setSelectedItems([]);
          setSelectedOpen(false);
          setBatchMode(null);
        }
        function batchDone() {
          setBatchMode(null);
          setSelectedOpen(false);
          clearSelection();
          refreshList();
          say(t.updated);
        }
        var tables = allTables(tree);
        var pageable = true;
        var totalPages = pageable && data.total ? Math.ceil(data.total / pageSize) : 1;
        var treeProps = {
          t,
          expanded,
          selectedTable: target.tableId,
          selectedGroup: target.groupId,
          manager,
          dragId,
          dropId,
          edit,
          editName,
          onToggle: toggleExpanded,
          onSelect: pickNode,
          onAdd: addNode,
          onEdit: function(node) {
            setNodeModal({ parentId: node.parent || node.parentId, type: node.type, node });
          },
          onEditName: setEditName,
          onCancelEdit: function() {
            setEdit(null);
          },
          onRename: renameNode,
          onDelete: deleteNode,
          onDragStart: function(id) {
            setDragId(String(id));
          },
          onDragOver: function(id) {
            setDropId(String(id));
          },
          onMove: moveNode
        };
        function flatTreeRow(item) {
          var node = item.node;
          var isTable = String(node.type) === "1";
          var selected = String(target.tableId || "") === String(node.id) || !target.tableId && String(target.groupId || "") === String(node.id);
          return h(
            "div",
            {
              key: node.id,
              className: cx("wbt-tree-row", selected && "sel"),
              style: { paddingLeft: 3 + item.depth * 15 + "px" }
            },
            h("span", { className: "wbt-tw void" }),
            h("span", { className: "wbt-ti" }, h(Icon2, { name: isTable ? "table" : "folder", size: 13 })),
            h(
              "div",
              { className: "wbt-tn", onClick: function() {
                pickNode(node);
              }, title: node.description ? node.name + "\n" + node.description : node.name },
              h("span", { className: "nm" }, node.name),
              node.description ? h("span", { className: "wbt-tdesc" }, String(node.description).replace(/\s+/g, " ")) : null,
              !isTable && node.children && node.children.length ? h("span", { className: "wbt-tcnt" }, node.children.length) : null
            )
          );
        }
        var flatNodes = treeWalk(tree);
        var rootId = tree.length ? String(tree[0].id) : "";
        var nodeById = {};
        flatNodes.forEach(function(x) {
          nodeById[String(x.node.id)] = x.node;
        });
        var curNode = nodeById[String(target.tableId || target.groupId || "")] || null;
        var footGroupId = curNode ? String(curNode.type) === "1" ? String(curNode.parent || curNode.parentId || rootId) : String(curNode.id) : rootId;
        var groupCount = 0;
        var tableCount = 0;
        flatNodes.forEach(function(x) {
          if (String(x.node.type) === "1") tableCount++;
          else groupCount++;
        });
        var tq = treeQuery.trim().toLowerCase();
        var treeHits = tq ? flatNodes.filter(function(x) {
          return String(x.node.name || "").toLowerCase().indexOf(tq) >= 0;
        }) : [];
        var treeBody = !tree.length ? h("div", { className: "wbt-empty" }, t.emptyTree) : tq ? treeHits.length ? treeHits.map(flatTreeRow) : h("div", { className: "wbt-empty" }, t.treeNoMatch) : tree.map(function(n) {
          return h(TreeNode, Object.assign({}, treeProps, { key: n.id, node: n, depth: 0 }));
        });
        var curDesc = curNode ? String(curNode.description || "") : "";
        var filterPanel = renderFilters(React, {
          lang: props.lang,
          value: filterValue,
          open: panelOpen,
          id: panelId,
          hint: filterHint,
          onHint: setFilterHint,
          onToggle: function() {
            setPanelOpen(!panelOpen);
          },
          onChange: function(next) {
            setFilterValue(next);
            setPageNumber(1);
          },
          difficultyMissing,
          onMissingChange: function(next) {
            setDifficultyMissing(next);
            setPageNumber(1);
          },
          search: h(
            "form",
            { className: "wbt-filter-search", onSubmit: function(e) {
              e.preventDefault();
              setTitleKey(searchDraft);
              setPageNumber(1);
            } },
            h("input", { className: "wbt-input", placeholder: t.search, "aria-label": t.search, value: searchDraft, onChange: function(e) {
              setSearchDraft(e.target.value);
            } }),
            h("button", { type: "submit", className: "wbt-btn ghost", "aria-label": t.search }, h(Icon2, { name: "search", size: 14 }))
          ),
          tags: h(TagFilter, {
            api,
            t,
            Icon: Icon2,
            ids: filterTagIds,
            reloadKey: tagReload,
            onChange: function(next) {
              setFilterTagIds(next);
              setPageNumber(1);
            }
          }),
          // 与难度区间互斥：两者同时生效必然是空集，勾选「仅未填难度」时清掉难度区间。
          api,
          t,
          Icon: Icon2,
          missing: h("label", { className: "wbt-check" }, h("input", {
            type: "checkbox",
            checked: difficultyMissing,
            onChange: function(e) {
              var next = e.target.checked;
              setDifficultyMissing(next);
              if (next) setFilterValue(filters.clearDifficulty(filterValue));
              setPageNumber(1);
            }
          }), t.difficultyMissing)
        });
        var listBody = loading ? h("div", { className: "wbt-empty" }, t.loading) : error ? h("div", { className: "wbt-err" }, t.error + error) : data.records.length === 0 ? h("div", { className: "wbt-empty" }, t.empty) : h("div", { className: view === "card" ? "wbt-grid" : "wbt-list" }, data.records.map(function(task) {
          return h(TaskItem, {
            key: task.id,
            task,
            t,
            lang: props.lang,
            card: view === "card",
            keyword: titleKey.trim(),
            bodyMode: cfg["ui.bodyMode"],
            selectionMode,
            checked: selectedIds.has(String(task.id)),
            onCheck: toggleSelect,
            update,
            toast: say,
            onEdit: function(x) {
              setEditTask(x);
            },
            onDone: function(x) {
              setDoneTask(x);
            },
            onRestart: function(x) {
              setCreateState({ source: "2", originTask: x });
            },
            onTimeline: function(x) {
              setTimelineTask(x);
            },
            onDelete: deleteTask,
            onPathPick: pickPath,
            onTagPick: toggleTagId
          });
        }));
        return h(
          "div",
          { className: "wbt-root" },
          h(
            "div",
            { className: "wbt-pathrow" },
            h(
              "div",
              { className: "wbt-tree-slot" },
              h("button", { className: "wbt-btn", onClick: function() {
                setDrawer(true);
                refreshTree();
              } }, h(Icon2, { name: "tree", size: 13 }), t.tree)
            ),
            h("span", { className: "wbt-sum", role: "status", "aria-live": "polite" }, t.total + " " + data.total + " " + t.items),
            h(PathCrumbs, { path: currentPath, onPick: pickPath }),
            h("div", { className: "wbt-grow" }),
            h("button", {
              className: "wbt-btn ghost",
              title: t.refresh,
              "aria-label": t.refresh,
              disabled: loading,
              onClick: function() {
                refreshList();
                refreshTagNav();
              }
            }, h(Icon2, { name: "refresh", size: 13 }), t.refresh),
            h("button", { className: "wbt-btn " + (selectionMode ? "primary" : "ghost"), onClick: function() {
              if (selectionMode) {
                setSelectionMode(false);
                clearSelection();
              } else setSelectionMode(true);
            } }, h(Icon2, { name: "select", size: 13 }), selectionMode ? t.cancelSelect : t.select),
            h("button", { className: "wbt-btn primary", onClick: function() {
              setCreateState({ source: "0", originTask: null, defaultTableId: target.tableId });
            } }, h(Icon2, { name: "plus", size: 14 }), t.newTask),
            h("button", { className: "wbt-btn ghost", onClick: function() {
              setView(view === "list" ? "card" : "list");
            } }, h(Icon2, { name: view === "list" ? "grid" : "list", size: 13 }), view === "list" ? t.card : t.list)
          ),
          curDesc ? h("div", { className: "wbt-tabledesc", title: curDesc }, curDesc.length > 220 ? curDesc.slice(0, 220) + "\u2026" : curDesc) : null,
          h(
            "div",
            { className: "wbt-body" },
            filterPanel,
            h(
              "div",
              { className: "wbt-content" },
              h("div", { className: "wbt-list-scroll", tabIndex: 0, role: "region", "aria-label": props.lang === "en" ? "Task list" : "\u4EFB\u52A1\u5217\u8868", key: pageNumber + ":" + pageSize }, listBody),
              pageable ? h(
                "div",
                { className: "wbt-pager" },
                h("button", { className: "wbt-btn ghost", disabled: pageNumber <= 1, onClick: function() {
                  setPageNumber(Math.max(1, pageNumber - 1));
                } }, h(Icon2, { name: "left", size: 14 })),
                h("span", null, t.page + " " + pageNumber + " / " + totalPages),
                h(
                  "select",
                  { className: "wbt-select", value: pageSize, onChange: function(e) {
                    setPageSize(Number(e.target.value));
                    setPageNumber(1);
                  } },
                  [6, 12, 24].map(function(n) {
                    return h("option", { key: n, value: n }, n + " / " + t.page);
                  })
                ),
                h("button", { className: "wbt-btn ghost", disabled: pageNumber >= totalPages, onClick: function() {
                  setPageNumber(Math.min(totalPages, pageNumber + 1));
                } }, h(Icon2, { name: "right", size: 14 }))
              ) : null
            )
          ),
          selectionMode && selectedIds.size ? renderSelectionBar(h, Icon2, {
            t,
            count: selectedIds.size,
            openSelected,
            batchDelete,
            claimSelected,
            clear: clearSelection,
            batchTimeline: function() {
              setBatchMode("timeline");
              openSelected();
            },
            batchMigrate: function() {
              setBatchMode("migrate");
              openSelected();
            }
          }) : null,
          drawer ? h(
            "div",
            { className: "wbt-drawer-mask", onMouseDown: function(e) {
              if (e.target === e.currentTarget) setDrawer(false);
            } },
            h(
              "div",
              { className: "wbt-drawer", role: "dialog", "aria-label": t.tree },
              h(
                "div",
                { className: "wbt-drawer-head" },
                h(Icon2, { name: "tree", size: 15 }),
                h(
                  "div",
                  { className: "wbt-drawer-title" },
                  h("b", null, t.tree),
                  h("span", { className: "wbt-drawer-meta" }, groupCount + " " + t.groups + " \xB7 " + tableCount + " " + t.tables)
                ),
                h("button", {
                  className: "wbt-tool" + (manager ? " on" : ""),
                  onClick: function() {
                    setManager(!manager);
                  }
                }, t.manager),
                h("button", { className: "wbt-icon", title: t.close, "aria-label": t.close, onClick: function() {
                  setDrawer(false);
                } }, h(Icon2, { name: "close", size: 15 }))
              ),
              h(
                "div",
                { className: "wbt-drawer-search" },
                h("input", {
                  className: "wbt-input",
                  ref: treeSearchRef,
                  placeholder: t.treeSearch,
                  value: treeQuery,
                  onChange: function(e) {
                    setTreeQuery(e.target.value);
                  },
                  onKeyDown: function(e) {
                    if (e.key === "Escape") {
                      e.stopPropagation();
                      setTreeQuery("");
                      setDrawer(false);
                    }
                  }
                }),
                treeQuery ? h("button", {
                  className: "wbt-search-clear",
                  title: t.clear,
                  "aria-label": t.clear,
                  onClick: function() {
                    setTreeQuery("");
                    if (treeSearchRef.current) treeSearchRef.current.focus();
                  }
                }, h(Icon2, { name: "close", size: 13 })) : null
              ),
              h("div", { className: "wbt-drawer-body" }, treeBody),
              h(
                "div",
                { className: "wbt-drawer-foot" },
                h(
                  "div",
                  { className: "wbt-drawer-acts" },
                  h(
                    "button",
                    { className: "wbt-addbtn", title: t.addGroup, onClick: function() {
                      if (footGroupId) addNode(footGroupId, "0");
                    } },
                    h(Icon2, { name: "folderPlus", size: 13 }),
                    t.addGroup
                  ),
                  h(
                    "button",
                    { className: "wbt-addbtn", title: t.addTable, onClick: function() {
                      if (footGroupId) addNode(footGroupId, "1");
                    } },
                    h(Icon2, { name: "filePlus", size: 13 }),
                    t.addTable
                  )
                ),
                h("div", { className: "wbt-drawer-hint" }, t.treeHint)
              )
            )
          ) : null,
          createState ? h(CreateModal, {
            key: (createState.source || "0") + "-" + (createState.originTask && createState.originTask.id || ""),
            t,
            api,
            tree,
            source: createState.source,
            originTask: createState.originTask,
            defaultTableId: createState.defaultTableId,
            defaults: {
              priority: cfg["form.defaultPriority"],
              difficulty: cfg["form.defaultDifficulty"],
              targetOffset: cfg["form.defaultTargetOffset"]
            },
            onClose: function() {
              setCreateState(null);
            },
            onCreated: function(result) {
              setCreateState(null);
              refreshList();
              refreshTree();
              say(require_ownership().receipt(result));
            }
          }) : null,
          timelineTask ? h(TimelineModal, {
            key: timelineTask.id,
            t,
            api,
            task: timelineTask,
            onChanged: refreshList,
            onClose: function() {
              setTimelineTask(null);
            },
            onOpen: function(member) {
              api.call("tasks.get", { id: member.id }).then(function(r) {
                if (!r || !r.ok) throw Error(r && r.error || t.fail);
                setTimelineTask(null);
                setEditTask(r.result.task);
              }).catch(function(err) {
                say(String(err.message || err));
              });
            },
            onCreateTimeline: function(originTask) {
              setTimelineTask(null);
              setCreateState({ source: "1", originTask, defaultTableId: originTask.tableId });
            }
          }) : null,
          nodeModal ? h(NodeModal, {
            key: "node-" + (nodeModal.node ? nodeModal.node.id : "new"),
            t,
            api,
            node: nodeModal.node,
            parentId: nodeModal.parentId,
            type: nodeModal.type,
            onClose: function() {
              setNodeModal(null);
            },
            onSaved: nodeSaved
          }) : null,
          editTask ? h(EditModal, {
            key: "edit-" + editTask.id,
            t,
            api,
            task: editTask,
            lang: props.lang,
            tree,
            onClose: function() {
              setEditTask(null);
            },
            onSaved: function(result) {
              setEditTask(null);
              refreshList();
              say(require_ownership().receipt(result));
            }
          }) : null,
          doneTask ? h(DoneModal, {
            key: doneTask.id,
            t,
            api,
            task: doneTask,
            onClose: function() {
              setDoneTask(null);
            },
            onDone: function() {
              setDoneTask(null);
              refreshList();
              say(t.doneSuccess);
            },
            onError: function(e) {
              setDoneTask(null);
              say(e);
            }
          }) : null,
          selectedOpen && batchMode ? h(BatchModal, {
            key: batchMode,
            t,
            api,
            mode: batchMode,
            items: selectedItems,
            tables,
            tree,
            onClose: function() {
              setBatchMode(null);
            },
            onDone: batchDone
          }) : null,
          toast ? h("div", { className: "wbt-toast" }, toast) : null
        );
      }
      return TasksView;
    };
  }
});

// packages/addons/tasks/client/timeline/timeline-add-members.cjs
var require_timeline_add_members = __commonJS({
  "packages/addons/tasks/client/timeline/timeline-add-members.cjs"(exports2, module2) {
    "use strict";
    module2.exports = function(React) {
      var h = React.createElement, result = require_timeline_controls()(React).result;
      return function AddMembers(p) {
        var tr = require_timeline_copy()(p.t);
        var qs = React.useState(""), query = qs[0], setQuery = qs[1];
        var ds = React.useState({ records: [], total: 0 }), data = ds[0], setData = ds[1];
        var ps = React.useState(1), page = ps[0], setPage = ps[1];
        var ss = React.useState([]), selected = ss[0], setSelected = ss[1];
        var es = React.useState(""), error = es[0], setError = es[1];
        var bs = React.useState(false), busy = bs[0], setBusy = bs[1];
        React.useEffect(function() {
          var cancelled = false;
          setError("");
          p.api.call("tasks.list", { titleKey: query, pageNumber: page, pageSize: 20, statuses: [] }).then(result).then(function(r) {
            if (!cancelled) setData(r);
          }).catch(function(e) {
            if (!cancelled) setError(String(e.message || e));
          });
          return function() {
            cancelled = true;
          };
        }, [p.api, query, page]);
        function submit() {
          if (busy || !selected.length) return;
          setBusy(true);
          p.api.call("tasks.timelineRefactor", { ids: selected, timelineId: p.timelineId }).then(result).then(p.onSaved).catch(function(e) {
            setError(String(e.message || e));
            setBusy(false);
          });
        }
        return h("div", { className: "wbt-modal-mask" }, h(
          "div",
          { className: "wbt-modal", role: "dialog", "aria-modal": true, "aria-label": tr("\u6DFB\u52A0\u5DF2\u6709\u4EFB\u52A1") },
          h("h3", null, tr("\u6DFB\u52A0\u5DF2\u6709\u4EFB\u52A1")),
          h("p", null, tr("\u9009\u4E2D\u7684\u4EFB\u52A1\u5C06\u5173\u8054\u5230\u6B64\u65F6\u95F4\u7EBF\uFF1B\u539F\u6709\u5173\u8054\u4F1A\u88AB\u66FF\u6362\u3002")),
          h("input", { className: "wbt-input", "aria-label": tr("\u641C\u7D22\u5DF2\u6709\u4EFB\u52A1"), value: query, onChange: function(e) {
            setQuery(e.target.value);
            setPage(1);
          } }),
          h("div", { style: { maxHeight: "40vh", overflow: "auto" } }, (data.records || []).map(function(x) {
            return h("label", { key: x.id, className: "wbt-bpick" }, h("input", { type: "checkbox", checked: selected.indexOf(x.id) >= 0, onChange: function(e) {
              setSelected(e.target.checked ? selected.concat(x.id) : selected.filter(function(id) {
                return id !== x.id;
              }));
            } }), x.title);
          })),
          h("div", { className: "wbt-timeline-pager" }, h("button", { disabled: page <= 1, onClick: function() {
            setPage(page - 1);
          } }, tr("\u4E0A\u4E00\u9875")), h("span", null, page), h("button", { disabled: page * 20 >= data.total, onClick: function() {
            setPage(page + 1);
          } }, tr("\u4E0B\u4E00\u9875"))),
          error ? h("p", { role: "alert" }, error) : null,
          h("div", { className: "wbt-modal-foot" }, h("button", { className: "wbt-btn", disabled: busy, onClick: p.onClose }, tr("\u53D6\u6D88")), h("button", { className: "wbt-btn primary", disabled: busy || !selected.length, onClick: submit }, tr("\u5173\u8054\u4EFB\u52A1 (") + selected.length + ")"))
        ));
      };
    };
  }
});

// packages/addons/tasks/client/timeline/timeline-merge.cjs
var require_timeline_merge = __commonJS({
  "packages/addons/tasks/client/timeline/timeline-merge.cjs"(exports2, module2) {
    "use strict";
    module2.exports = function(React) {
      var h = React.createElement;
      return function Merge(props) {
        var t = props.t, targetS = React.useState(props.items[0].timelineKey), target = targetS[0], setTarget = targetS[1];
        var previewS = React.useState(null), preview = previewS[0], setPreview = previewS[1];
        var busyS = React.useState(false), busy = busyS[0], setBusy = busyS[1];
        var errorS = React.useState(""), error = errorS[0], setError = errorS[1];
        var pending = React.useRef(false), panel = React.useRef(null);
        function submit(dryRun) {
          if (pending.current || !dryRun && preview === null) return;
          pending.current = true;
          setBusy(true);
          setError("");
          props.api.call("tasks.timelineRefactor", { timelineKeys: props.items.map(function(x) {
            return x.timelineKey;
          }), timelineKey: target, dryRun }).then(function(r) {
            if (!r || !r.ok) throw new Error(r && r.error || "Request failed");
            if (dryRun) setPreview(r.result);
            else props.onMerged();
          }).catch(function(e) {
            setError(String(e.message || e));
            setPreview(null);
          }).finally(function() {
            pending.current = false;
            setBusy(false);
          });
        }
        function keys(e) {
          if (e.key === "Escape" && !busy) {
            e.stopPropagation();
            props.onClose();
          }
          if (e.key !== "Tab") return;
          var nodes = panel.current.querySelectorAll("button:not(:disabled),select:not(:disabled)");
          var first = nodes[0], last = nodes[nodes.length - 1];
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
          if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
        return h("div", { className: "wbt-modal-mask" }, h(
          "div",
          { ref: panel, className: "wbt-modal", role: "dialog", "aria-modal": true, "aria-label": t.timelineMerge, onKeyDown: keys },
          h("h3", null, t.timelineMerge),
          h("p", null, t.timelineMergeHint),
          h(
            "label",
            { className: "wbt-field" },
            h("span", null, t.timelineTarget),
            h("select", { className: "wbt-input", autoFocus: true, disabled: busy, value: target, onChange: function(e) {
              setTarget(e.target.value);
              setPreview(null);
            } }, props.items.map(function(x) {
              return h("option", { key: x.timelineKey, value: x.timelineKey }, x.title || x.timelineKey);
            }))
          ),
          preview !== null ? h("p", { role: "status" }, t.timelinePreviewCount.replace("{n}", preview.wouldUpdate)) : null,
          error ? h("p", { role: "alert", className: "wbt-err" }, t.error + error) : null,
          h(
            "div",
            { className: "wbt-modal-foot" },
            h("button", { className: "wbt-btn", disabled: busy, onClick: props.onClose }, t.cancel),
            h("button", { className: "wbt-btn primary", disabled: busy, onClick: function() {
              submit(preview === null);
            } }, busy ? t.loading : preview === null ? t.timelinePreview : t.timelineConfirm)
          )
        ));
      };
    };
  }
});

// packages/addons/tasks/client/views/timeline-view.cjs
var require_timeline_view = __commonJS({
  "packages/addons/tasks/client/views/timeline-view.cjs"(exports2, module2) {
    "use strict";
    module2.exports = function(deps) {
      var React = deps.React, h = React.createElement, COPY = deps.COPY;
      var controls = require_timeline_controls()(React), AddMembers = require_timeline_add_members()(React);
      var Merge = require_timeline_merge()(React);
      var CSS = require_timeline_styles();
      var MemberRows = require_timeline_member_rows()(React, deps.statusInfo);
      var splitTitle = require_timeline_title();
      var Highlight = require_highlight2()(React);
      function result(r) {
        if (!r || !r.ok) throw new Error(r && r.error || "Request failed");
        return r.result;
      }
      function pageData(r) {
        return { records: r.records || [], total: Number(r.total) || 0 };
      }
      function Pager(p) {
        return h(
          "nav",
          { className: "wbt-timeline-pager", "aria-label": p.label },
          h("button", { className: "wbt-btn", disabled: p.busy || p.page <= 1, onClick: function() {
            p.set(p.page - 1);
          }, "aria-label": p.t.timelinePrevious }, "\u2039"),
          h("span", null, p.t.page + " " + p.page + " / " + Math.max(1, Math.ceil(p.total / 20)) + " \xB7 " + p.t.total + " " + p.total),
          h("button", { className: "wbt-btn", disabled: p.busy || p.page * 20 >= p.total, onClick: function() {
            p.set(p.page + 1);
          }, "aria-label": p.t.timelineNext }, "\u203A")
        );
      }
      function TimelineView(props) {
        var lang = props.lang === "en" ? "en" : "zh", t = COPY[lang], api = props.api;
        var tr = require_timeline_copy()(t);
        var queryS = React.useState(""), query = queryS[0], setQuery = queryS[1];
        var draftS = React.useState(""), draft = draftS[0], setDraft = draftS[1];
        var singleS = React.useState(true), single = singleS[0], setSingle = singleS[1];
        var pageS = React.useState(1), page = pageS[0], setPage = pageS[1];
        var dataS = React.useState({ records: [], total: 0 }), data = dataS[0], setData = dataS[1];
        var busyS = React.useState(true), busy = busyS[0], setBusy = busyS[1];
        var errorS = React.useState(""), error = errorS[0], setError = errorS[1];
        var activeS = React.useState(null), active = activeS[0], setActive = activeS[1];
        var memberPageS = React.useState(1), memberPage = memberPageS[0], setMemberPage = memberPageS[1];
        var membersS = React.useState({ records: [], total: 0 }), members = membersS[0], setMembers = membersS[1];
        var memberBusyS = React.useState(false), memberBusy = memberBusyS[0], setMemberBusy = memberBusyS[1];
        var memberErrorS = React.useState(""), memberError = memberErrorS[0], setMemberError = memberErrorS[1];
        var refreshS = React.useState(0), refresh = refreshS[0], setRefresh = refreshS[1];
        var multiS = React.useState(false), multi = multiS[0], setMulti = multiS[1];
        var selectedS = React.useState([]), selected = selectedS[0], setSelected = selectedS[1];
        var mergeS = React.useState(false), merge = mergeS[0], setMerge = mergeS[1];
        var detailS = React.useState(null), detail = detailS[0], setDetail = detailS[1];
        var treeS = React.useState([]), tree = treeS[0], setTree = treeS[1];
        var listRef = React.useRef(null), mergeButton = React.useRef(null), detailTrigger = React.useRef(null);
        var createdRef = React.useRef(null);
        var activeKey = active && active.timelineKey;
        var heading = splitTitle(active && active.title);
        var editorS = React.useState(null), editor = editorS[0], setEditor = editorS[1];
        var addS = React.useState(false), adding = addS[0], setAdding = addS[1];
        var deleteS = React.useState(false), deleting = deleteS[0], setDeleting = deleteS[1];
        var writeS = React.useState(false), writing = writeS[0], setWriting = writeS[1];
        React.useEffect(function() {
          deps.injectCss();
        }, []);
        React.useEffect(function() {
          var cancelled = false;
          setBusy(true);
          setError("");
          api.call("tasks.timelines", { titleKey: query, includeSingletons: single, pageNumber: page, pageSize: 20 }).then(result).then(function(r) {
            if (cancelled) return;
            var next = pageData(r);
            setData(next);
            setBusy(false);
            if (page > 1 && !next.records.length) {
              setPage(Math.max(1, Math.ceil(next.total / 20)));
              return;
            }
            setActive(function(old) {
              var created = createdRef.current;
              createdRef.current = null;
              return next.records.find(function(x) {
                return (created || old) && x.timelineKey === (created || old).timelineKey;
              }) || created || next.records[0] || null;
            });
          }).catch(function(e) {
            if (!cancelled) {
              setBusy(false);
              setError(String(e.message || e));
            }
          });
          return function() {
            cancelled = true;
          };
        }, [api, query, single, page, refresh]);
        React.useEffect(function() {
          setMemberPage(1);
        }, [activeKey]);
        React.useEffect(function() {
          var cancelled = false;
          setMemberError("");
          setMembers({ records: [], total: 0 });
          if (!activeKey) {
            setMemberBusy(false);
            return;
          }
          setMemberBusy(true);
          api.call("tasks.timeline", { timelineKey: activeKey, pageNumber: memberPage, pageSize: 20 }).then(result).then(function(r) {
            if (cancelled) return;
            var next = pageData(r);
            setMembers(next);
            setMemberBusy(false);
            if (memberPage > 1 && !next.records.length) setMemberPage(Math.max(1, Math.ceil(next.total / 20)));
          }).catch(function(e) {
            if (!cancelled) {
              setMemberBusy(false);
              setMemberError(String(e.message || e));
            }
          });
          return function() {
            cancelled = true;
          };
        }, [api, activeKey, memberPage, refresh]);
        React.useEffect(function() {
          if (!detail) return;
          var cancelled = false;
          api.call("taskNodes.tree", {}).then(result).then(function(r) {
            if (!cancelled) setTree(Array.isArray(r) ? r : []);
          }).catch(function() {
          });
          return function() {
            cancelled = true;
          };
        }, [api, !!detail]);
        function reload() {
          setRefresh(function(n) {
            return n + 1;
          });
        }
        function choose(item, toggle) {
          if (busy) return;
          setActive(item);
          setMemberPage(1);
          if (toggle && item.taskCount > 0) setSelected(function(old) {
            return old.some(function(x) {
              return x.timelineKey === item.timelineKey;
            }) ? old.filter(function(x) {
              return x.timelineKey !== item.timelineKey;
            }) : old.concat(item);
          });
        }
        function keyboard(e, index) {
          if (e.target.type === "checkbox") return;
          var next = index;
          if (e.key === "ArrowDown") next = Math.min(data.records.length - 1, index + 1);
          else if (e.key === "ArrowUp") next = Math.max(0, index - 1);
          else if (e.key === "Home") next = 0;
          else if (e.key === "End") next = data.records.length - 1;
          else if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            choose(data.records[index], multi);
            return;
          } else return;
          e.preventDefault();
          choose(data.records[next], false);
          var node = listRef.current && listRef.current.querySelectorAll('[role="option"]')[next];
          if (node) {
            node.focus({ preventScroll: true });
            node.scrollIntoView({ block: "nearest" });
          }
        }
        function closeDetail() {
          setDetail(null);
          if (detailTrigger.current) detailTrigger.current.focus({ preventScroll: true });
        }
        function closeMerge() {
          setMerge(false);
          if (mergeButton.current) mergeButton.current.focus({ preventScroll: true });
        }
        return h(
          "div",
          { className: "wbt-root wbt-timeline-view" },
          h("style", null, CSS),
          h(
            "div",
            { className: "wbt-timeline-toolbar" },
            h(
              "div",
              { className: "wbt-timeline-toolbar-main" },
              h(
                "form",
                { className: "wbt-timeline-search", onSubmit: function(e) {
                  e.preventDefault();
                  setPage(1);
                  setQuery(draft.trim());
                } },
                h("input", { className: "wbt-input", value: draft, "aria-label": t.timelineSearch, placeholder: t.timelineSearch, onChange: function(e) {
                  setDraft(e.target.value);
                } }),
                h("button", { className: "wbt-btn", type: "submit" }, t.timelineSearchButton)
              ),
              h("label", { className: "wbt-timeline-single" }, h("input", { type: "checkbox", "aria-label": t.timelineSingletons, checked: single, onChange: function(e) {
                setSingle(e.target.checked);
                setPage(1);
              } }), t.timelineSingletons)
            ),
            h(
              "div",
              { className: "wbt-timeline-toolbar-actions" },
              h("button", { className: "wbt-btn primary", onClick: function() {
                setEditor({});
              } }, tr("\u65B0\u5EFA\u65F6\u95F4\u7EBF")),
              h("button", { className: "wbt-btn", onClick: function() {
                setMulti(!multi);
                setSelected([]);
              }, "aria-pressed": multi }, multi ? t.cancelSelect : t.select),
              multi ? h("button", { ref: mergeButton, className: "wbt-btn", disabled: selected.length < 2 || busy, onClick: function() {
                setMerge(true);
              } }, t.timelineMerge + " (" + selected.length + ")") : null,
              h("button", { className: "wbt-btn", disabled: busy, onClick: reload }, t.refresh)
            )
          ),
          h(
            "div",
            { className: "wbt-timeline-columns" },
            h(
              "section",
              { className: "wbt-timeline-left", "aria-label": t.timeline },
              error ? h("p", { role: "alert", className: "wbt-err" }, t.error + error) : null,
              h("div", { ref: listRef, className: "wbt-timeline-list", role: "listbox", "aria-label": t.timeline, "aria-multiselectable": multi, "aria-busy": busy }, data.records.map(function(item, i) {
                var excerpt = String(item.description || "").trim().split(/\r?\n/)[0];
                var isActive = activeKey === item.timelineKey, checked = selected.some(function(x) {
                  return x.timelineKey === item.timelineKey;
                });
                return h(
                  "div",
                  {
                    key: item.timelineKey,
                    role: "option",
                    tabIndex: isActive || !activeKey && i === 0 ? 0 : -1,
                    "aria-selected": multi ? checked : isActive,
                    "aria-current": isActive ? "true" : void 0,
                    className: "wbt-timeline-option" + (isActive ? " current" : ""),
                    onClick: function() {
                      choose(item, multi);
                      setDeleting(false);
                    },
                    onKeyDown: function(e) {
                      keyboard(e, i);
                    }
                  },
                  h("div", { className: "wbt-timeline-option-title" }, multi ? h("input", { type: "checkbox", checked, disabled: busy || !item.taskCount, "aria-label": item.title || tr("\u672A\u547D\u540D\u65F6\u95F4\u7EBF"), onClick: function(e) {
                    e.stopPropagation();
                  }, onChange: function() {
                    choose(item, true);
                  } }) : null, h("strong", null, h(Highlight, { text: item.title || tr("\u672A\u547D\u540D\u65F6\u95F4\u7EBF"), keyword: query }))),
                  excerpt ? h("span", { className: "wbt-timeline-excerpt", title: item.description }, h(Highlight, { text: Array.from(excerpt).slice(0, 90).join(""), keyword: query })) : null,
                  h("span", null, t.timelineTasks + " " + item.taskCount + " \xB7 " + t.timelineOpen + " " + item.openCount + " \xB7 " + t.timelineDone + " " + item.doneCount + " \xB7 " + t.timelineActivity + " " + (item.lastActivityDate || "\u2014"))
                );
              })),
              busy ? h("p", { role: "status" }, t.loading) : !error && !data.records.length ? h("p", { className: "wbt-empty", role: "status" }, query ? t.timelineSearchEmpty.replace("{query}", function() {
                return query;
              }) : t.timelineEmpty) : null,
              h(Pager, { t, label: t.timeline, busy, page, total: data.total, set: setPage })
            ),
            h(
              "section",
              { className: "wbt-timeline-right", "aria-label": t.timelineMembers, "aria-busy": memberBusy },
              heading.eyebrow ? h("div", { className: "wbt-timeline-eyebrow" }, heading.eyebrow) : null,
              h("h3", null, active ? heading.title || tr("\u672A\u547D\u540D\u65F6\u95F4\u7EBF") : t.timelineMembers),
              active ? h(
                "div",
                { className: "wbt-timeline-summary" },
                h("div", { className: "wbt-desc wbt-timeline-desc" }, active.description || tr("\u6682\u65E0\u63CF\u8FF0")),
                h(
                  "div",
                  { className: "wbt-timeline-actions" },
                  h("button", { className: "wbt-btn primary", onClick: function() {
                    setEditor(active);
                  } }, tr("\u7F16\u8F91\u65F6\u95F4\u7EBF")),
                  h("button", { className: "wbt-btn", onClick: function() {
                    setAdding(true);
                  } }, tr("\u6DFB\u52A0\u5DF2\u6709\u4EFB\u52A1")),
                  h("button", { className: "wbt-timeline-id", title: tr("\u590D\u5236 ID") + " \xB7 " + activeKey, "aria-label": tr("\u590D\u5236 ID"), onClick: function() {
                    navigator.clipboard.writeText(activeKey).catch(function(e) {
                      setMemberError(String(e));
                    });
                  } }, h("code", null, activeKey), h("span", { "aria-hidden": true }, "\u29C9")),
                  h("button", { className: "wbt-btn wbt-act-del", onClick: function() {
                    setDeleting(true);
                  } }, tr("\u5220\u9664\u65F6\u95F4\u7EBF"))
                ),
                deleting ? h(
                  "div",
                  { role: "alert", className: "wbt-timeline-confirm" },
                  tr("\u5220\u9664\u65F6\u95F4\u7EBF\u5C06\u79FB\u51FA\u5168\u90E8\u6210\u5458\uFF0C\u4FDD\u7559\u4EFB\u52A1\u53CA\u91CD\u542F\u94FE\u3002"),
                  h("button", { className: "wbt-btn", disabled: writing, onClick: function() {
                    setDeleting(false);
                  } }, tr("\u53D6\u6D88\u5220\u9664")),
                  h("button", { className: "wbt-btn", disabled: writing, onClick: function() {
                    setWriting(true);
                    api.call("taskTimelines.delete", { timelineId: activeKey }).then(result).then(function() {
                      setDeleting(false);
                      setSelected([]);
                      reload();
                    }).catch(function(e) {
                      setMemberError(String(e.message || e));
                    }).finally(function() {
                      setWriting(false);
                    });
                  } }, tr("\u786E\u8BA4\u5220\u9664\u65F6\u95F4\u7EBF"))
                ) : null
              ) : null,
              memberError ? h("p", { role: "alert", className: "wbt-err" }, t.error + memberError) : null,
              memberBusy ? h("p", { role: "status" }, t.loading) : h(MemberRows, {
                rows: members.records,
                lang,
                disabled: writing,
                onOpen: function(task, e) {
                  detailTrigger.current = e.currentTarget;
                  setDetail(task);
                },
                onRemove: function(task) {
                  setWriting(true);
                  api.call("taskTimelines.detach", { taskId: task.id }).then(result).then(function() {
                    createdRef.current = active;
                    reload();
                  }).catch(function(e) {
                    setMemberError(String(e.message || e));
                  }).finally(function() {
                    setWriting(false);
                  });
                }
              }),
              !memberBusy && !memberError && !members.records.length ? h("p", { className: "wbt-empty" }, active ? tr("\u6682\u65E0\u53EF\u663E\u793A\u6210\u5458") : t.timelineEmpty) : null,
              active ? h("div", { className: "wbt-timeline-member-footer" }, h("span", null, t.timelineOrder), h(Pager, { t, label: t.timelineMembers, busy: memberBusy, page: memberPage, total: members.total, set: setMemberPage })) : null
            )
          ),
          editor ? h(controls.Editor, { api, t, item: editor.timelineKey ? editor : null, onClose: function() {
            setEditor(null);
          }, onSaved: function(line) {
            setEditor(null);
            setSingle(true);
            setDraft("");
            setQuery("");
            setPage(1);
            createdRef.current = Object.assign({}, line, { timelineKey: line.timelineId || line.timelineKey || line.id });
            setActive(createdRef.current);
            reload();
          } }) : null,
          adding && active ? h(AddMembers, { api, t, timelineId: activeKey, onClose: function() {
            setAdding(false);
          }, onSaved: function() {
            setAdding(false);
            createdRef.current = active;
            reload();
          } }) : null,
          merge ? h(Merge, { api, t, items: selected, onClose: closeMerge, onMerged: function() {
            closeMerge();
            setSelected([]);
            setMulti(false);
            reload();
          } }) : null,
          detail ? h(deps.EditModal, { key: detail.id, api, t, lang, task: detail, tree, onClose: closeDetail, onSaved: function() {
            closeDetail();
            reload();
          } }) : null
        );
      }
      return TimelineView;
    };
  }
});

// packages/addons/tasks/client/client.src.cjs
(function() {
  "use strict";
  var host = window.__WB_HOST__;
  if (!host) {
    console.error("[wb-addon-tasks] \u5BBF\u4E3B\u6865 window.__WB_HOST__ \u4E0D\u5B58\u5728\uFF0C\u89C6\u56FE\u672A\u6CE8\u518C");
    module.exports = { name: "dsh-workbench-tasks", inject: [], apply: function() {
    } };
    return;
  }
  var limits = require_limits();
  var React = require("react");
  var h = React.createElement;
  var TagFilter = require_tagfilter();
  var WorkspaceFilter = require_workspacefilter();
  var statsView = require_stats();
  var configView = require_config();
  var dataView = require_data();
  var actionSchemaView = require_actions();
  var COPY = require_copy();
  function hostHasAddon(id) {
    var list = host.addons;
    if (!Array.isArray(list)) return true;
    return list.some(function(a) {
      return a && a.id === id && a.enabled !== false;
    });
  }
  var STATUS = {
    "0": { zh: "\u5DF2\u5F00\u542F", en: "Active", cls: "active" },
    "1": { zh: "\u5DF2\u5173\u95ED", en: "Closed", cls: "shutdown" },
    "2": { zh: "\u5DF2\u5B8C\u6210", en: "Done", cls: "done" },
    "3": { zh: "\u5DF2\u91CD\u542F", en: "Restarted", cls: "restarted" },
    "4": { zh: "\u5DF2\u63A5\u53D6", en: "Claimed", cls: "claimed" }
  };
  var icons = require_icons(), ICONS = icons.ICONS, Icon2 = icons.Icon;
  var workspaceView = require_workspace_view()({ React, Icon: Icon2 });
  var commandsView = require_commands()({
    React,
    Icon: Icon2,
    Body: require_markdown().createBody(React),
    BodyMode: require_body_mode()(React),
    bodyStyles: require_body_styles(),
    bodyCopy: require_body_copy(),
    useConfig: configView.useConfig
  });
  function tabIcon(name) {
    return function TasksTabIcon() {
      return React.createElement(Icon2, { name, size: 14 });
    };
  }
  function Countdown(props) {
    var s = React.useState(Date.now());
    var now = s[0];
    var setNow = s[1];
    React.useEffect(function() {
      var id = setInterval(function() {
        setNow(Date.now());
      }, 1e3);
      return function() {
        clearInterval(id);
      };
    }, []);
    var diff = props.target - now;
    var over = diff < 0;
    var total = Math.floor(Math.abs(diff) / 1e3);
    var pad = function(n) {
      return (n < 10 ? "0" : "") + n;
    };
    var text = (over ? "\u903E\u671F " : "") + pad(Math.floor(total / 3600)) + ":" + pad(Math.floor(total % 3600 / 60)) + ":" + pad(total % 60);
    return h("span", {
      className: "wbt-countdown" + (over ? " overdue" : diff < 36e5 ? " soon" : ""),
      title: over ? "\u5DF2\u8D85\u8FC7\u8BA1\u5212\u5B8C\u6210\u65F6\u95F4" : "\u8DDD\u8BA1\u5212\u5B8C\u6210"
    }, h(Icon2, { name: "clock", size: 11 }), h("span", { className: "wbt-cd-num" }, text));
  }
  var CSS = require_styles();
  function injectCss() {
    if (typeof document === "undefined") return;
    var old = document.getElementById("wb-addon-tasks-v2-css");
    if (old) {
      old.textContent = CSS;
      return;
    }
    var s = document.createElement("style");
    s.id = "wb-addon-tasks-v2-css";
    s.setAttribute("data-wb-addon", "wb-addon-tasks");
    s.textContent = CSS;
    document.head.appendChild(s);
  }
  function cx() {
    return Array.prototype.filter.call(arguments, Boolean).join(" ");
  }
  function addDays(n) {
    var d = /* @__PURE__ */ new Date();
    d.setDate(d.getDate() + Number(n || 0));
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }
  function today() {
    var d = /* @__PURE__ */ new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }
  function daysBetween(dateText) {
    if (!dateText) return null;
    var d = /* @__PURE__ */ new Date(String(dateText) + "T00:00:00");
    if (Number.isNaN(d.getTime())) return null;
    var n = /* @__PURE__ */ new Date();
    n.setHours(0, 0, 0, 0);
    return Math.round((d.getTime() - n.getTime()) / 864e5);
  }
  function splitTags(text) {
    var out = [];
    String(text || "").split(/[,，]/).forEach(function(x) {
      var v = String(x).trim();
      if (v && out.indexOf(v) < 0) out.push(v);
    });
    return out;
  }
  function tagNames(task) {
    return (task && task.tags ? task.tags : []).map(function(x) {
      return String(x.name || "");
    }).filter(Boolean);
  }
  function statusInfo(id) {
    return STATUS[String(id)] || STATUS["0"];
  }
  function treeFlat(nodes, depth, out) {
    var arr = out || [];
    for (var i = 0; i < (nodes || []).length; i++) {
      var n = nodes[i];
      arr.push({ id: String(n.id), name: n.name, type: String(n.type), depth: depth || 0 });
      if (n.children && n.children.length) treeFlat(n.children, (depth || 0) + 1, arr);
    }
    return arr;
  }
  function treeWalk(nodes, depth, out) {
    var arr = out || [];
    for (var i = 0; i < (nodes || []).length; i++) {
      var n = nodes[i];
      arr.push({ node: n, depth: depth || 0 });
      if (n.children && n.children.length) treeWalk(n.children, (depth || 0) + 1, arr);
    }
    return arr;
  }
  function findFirstTable(nodes) {
    for (var i = 0; i < (nodes || []).length; i++) {
      var n = nodes[i];
      if (String(n.type) === "1") return n;
      var found = findFirstTable(n.children || []);
      if (found) return found;
    }
    return null;
  }
  function findNode(nodes, id) {
    for (var i = 0; i < (nodes || []).length; i++) {
      var n = nodes[i];
      if (String(n.id) === String(id)) return n;
      var found = findNode(n.children || [], id);
      if (found) return found;
    }
    return null;
  }
  function allTables(nodes) {
    return treeFlat(nodes).filter(function(n) {
      return n.type === "1";
    });
  }
  function pClass(n) {
    return n >= 6 ? "high" : n >= 3 ? "mid" : "low";
  }
  function stars(n) {
    var v = Number(n || 0);
    var full = Math.floor(v);
    var half = v - full >= 0.5;
    var out = "";
    for (var i = 0; i < full; i++) out += "\u2605";
    if (half) out += "\u2BEA";
    for (var j = full + (half ? 1 : 0); j < 5; j++) out += "\u2606";
    return out;
  }
  function pathIcon(type) {
    var code = String(type);
    return code === "1" ? "table" : code === "2" ? "house" : "folder";
  }
  function PathCrumbs(props) {
    var path = props.path || [];
    if (!path.length) return null;
    return h("div", { className: "wbt-path" }, path.map(function(p, i) {
      return h(
        React.Fragment,
        { key: p.id + "-" + i },
        i > 0 ? h("span", { className: "sep", children: "\u203A" }) : null,
        h("button", {
          type: "button",
          title: p.name || p.id,
          onClick: function(e) {
            e.stopPropagation();
            if (props.onPick) props.onPick(p, i, path);
          }
        }, h(Icon2, { name: pathIcon(p.type), size: 11 }), h("span", null, p.name || p.id))
      );
    }));
  }
  var TaskItem = require_task_item()({
    React,
    statusInfo,
    stars,
    pClass,
    today,
    daysBetween,
    cx,
    Icon: Icon2,
    Countdown,
    PathCrumbs
  });
  function TreeNode(props) {
    var node = props.node;
    var t = props.t;
    var expanded = props.expanded;
    var isExpanded = expanded.has(String(node.id));
    var hasKids = node.children && node.children.length > 0;
    var selected = props.selectedTable === String(node.id) || !props.selectedTable && props.selectedGroup === String(node.id);
    var isTable = String(node.type) === "1";
    var isRoot = String(node.parent) === "0" || String(node.parentId) === "0";
    var pad = 3 + (props.depth || 0) * 15;
    var editing = props.edit && String(props.edit.id) === String(node.id);
    var kids = node.children ? node.children.length : 0;
    function toggle(e) {
      e.stopPropagation();
      props.onToggle(node.id);
    }
    function select() {
      props.onSelect(node);
    }
    function stop(fn) {
      return function(e) {
        e.stopPropagation();
        fn();
      };
    }
    function drop(e) {
      e.preventDefault();
      e.stopPropagation();
      var src = props.dragId;
      if (!src || String(src) === String(node.id)) return;
      var asChild = !isTable;
      props.onMove(src, node.id, asChild ? 0 : 2);
    }
    return h(
      "div",
      null,
      h(
        "div",
        {
          className: cx("wbt-tree-row", selected && "sel", props.dropId === String(node.id) && "drop"),
          style: { paddingLeft: pad + "px" },
          draggable: props.manager && !isRoot,
          onDragStart: function(e) {
            props.onDragStart(node.id);
          },
          onDragOver: function(e) {
            e.preventDefault();
            props.onDragOver(node.id);
          },
          onDrop: drop
        },
        isTable || !hasKids ? h("span", { className: "wbt-tw void" }) : h("button", { className: "wbt-tw", "aria-label": node.name, "aria-expanded": !!isExpanded, onClick: toggle }, h(Icon2, { name: isExpanded ? "down" : "right", size: 12 })),
        h("span", { className: "wbt-ti" }, h(Icon2, { name: isRoot ? "house" : isTable ? "table" : isExpanded ? "folderOpen" : "folder", size: 13 })),
        h(
          "div",
          { className: "wbt-tn", onClick: select, title: node.description ? node.name + "\n" + node.description : node.name },
          editing ? h("input", {
            className: "wbt-input",
            style: { padding: "2px 6px", fontSize: "12px", width: "150px" },
            value: props.editName,
            maxLength: limits.NAME_MAX,
            autoFocus: true,
            onClick: function(e) {
              e.stopPropagation();
            },
            onChange: function(e) {
              props.onEditName(e.target.value);
            },
            onKeyDown: function(e) {
              if (e.key === "Enter") {
                e.preventDefault();
                props.onRename(node.id, props.editName);
              }
              if (e.key === "Escape") props.onCancelEdit();
            },
            onBlur: function() {
              props.onRename(node.id, props.editName);
            }
          }) : h("span", { className: "nm" }, node.name),
          !editing && node.description ? h("span", { className: "wbt-tdesc" }, String(node.description).replace(/\s+/g, " ")) : null,
          !isTable && hasKids && !editing ? h("span", { className: "wbt-tcnt" }, kids) : null
        ),
        h(
          "div",
          { className: "wbt-tacts" },
          !isTable ? h("button", { title: t.addGroup, "aria-label": t.addGroup, onClick: stop(function() {
            props.onAdd(node.id, "0");
          }) }, h(Icon2, { name: "folderPlus", size: 12 })) : null,
          !isTable ? h("button", { title: t.addTable, "aria-label": t.addTable, onClick: stop(function() {
            props.onAdd(node.id, "1");
          }) }, h(Icon2, { name: "filePlus", size: 12 })) : null,
          !isRoot ? h("button", { title: t.rename, "aria-label": t.rename, onClick: stop(function() {
            props.onEdit(node);
          }) }, h(Icon2, { name: "pencil", size: 12 })) : null,
          props.manager && !isRoot ? h("button", { title: t.del, "aria-label": t.del, className: "wbt-danger", onClick: stop(function() {
            props.onDelete(node);
          }) }, h(Icon2, { name: "trash", size: 12 })) : null
        )
      ),
      isExpanded && hasKids ? h("div", null, node.children.map(function(kid) {
        return h(TreeNode, Object.assign({}, props, { key: kid.id, node: kid, depth: (props.depth || 0) + 1 }));
      })) : null
    );
  }
  function NodeModal(props) {
    var t = props.t;
    var node = props.node || null;
    var editing = !!node;
    var f = React.useState({
      name: node ? String(node.name || "") : "",
      description: node ? String(node.description || "") : ""
    });
    var form = f[0], setForm = f[1];
    var err = React.useState("");
    var error = err[0], setError = err[1];
    var busy = React.useState(false);
    var isBusy = busy[0], setBusy = busy[1];
    function set(k, v) {
      var next = Object.assign({}, form);
      next[k] = v;
      setForm(next);
    }
    function submit() {
      var name = String(form.name || "").trim();
      if (!name) {
        setError(t.needName);
        return;
      }
      if (name.length > limits.NAME_MAX) {
        setError(t === COPY.en ? "Name cannot exceed " + limits.NAME_MAX + " characters" : "\u540D\u79F0\u4E0D\u80FD\u8D85\u8FC7 " + limits.NAME_MAX + " \u4E2A\u5B57\u7B26");
        return;
      }
      setBusy(true);
      setError("");
      var desc = String(form.description || "");
      var req = editing ? props.api.call("taskNodes.update", { id: node.id, name, description: desc }) : props.api.call("taskNodes.create", { parentId: props.parentId, type: props.type, name, description: desc });
      req.then(function(r) {
        if (!r || !r.ok) {
          setError(r && r.error || "failed");
          setBusy(false);
          return;
        }
        props.onSaved(editing ? "update" : "create");
      }).catch(function(e) {
        setError(String(e && e.message || e));
        setBusy(false);
      });
    }
    var isTable = String(node ? node.type : props.type) === "1";
    var title = editing ? isTable ? t.editTable : t.editGroup : isTable ? t.addTable : t.addGroup;
    return h(
      "div",
      { className: "wbt-modal-mask", onMouseDown: function(e) {
        if (e.target === e.currentTarget) props.onClose();
      } },
      h(
        "div",
        { className: "wbt-modal" },
        h("div", { className: "wbt-modal-head" }, h("h3", null, title), h("button", { className: "wbt-icon", onClick: props.onClose }, "\xD7")),
        h(
          "div",
          { className: "wbt-form" },
          h(
            "label",
            { className: "wbt-field full" },
            h("span", null, t.nodeName + " *"),
            h("input", { className: "wbt-input", "aria-label": t.nodeName, value: form.name, maxLength: limits.NAME_MAX, autoFocus: true, onChange: function(e) {
              set("name", e.target.value);
            } })
          ),
          h(
            "label",
            { className: "wbt-field full" },
            h("span", null, t.nodeDesc),
            h("textarea", { className: "wbt-textarea", rows: 3, value: form.description, placeholder: t.nodeDescPh, onChange: function(e) {
              set("description", e.target.value);
            } })
          )
        ),
        error ? h("div", { className: "wbt-err", role: "alert" }, error) : null,
        h(
          "div",
          { className: "wbt-modal-foot" },
          h("button", { className: "wbt-btn ghost", onClick: props.onClose }, t.cancel),
          h("button", { className: "wbt-btn primary", disabled: isBusy, onClick: submit }, isBusy ? "\u2026" : editing ? t.save : t.create)
        )
      )
    );
  }
  var CreateModal = require_create_modal()({ React, allTables, tagNames, splitTags, today, addDays, hostHasAddon });
  var TimelineModal = require_task_timeline_modal()(React, statusInfo);
  function DoneModal(props) {
    var t = props.t;
    var s = React.useState(Number(props.task.difficulty) || 0);
    var value = s[0], setValue = s[1];
    var rs = React.useState(String(props.task.review || ""));
    var review = rs[0], setReview = rs[1];
    var busy = React.useState(false);
    var isBusy = busy[0], setBusy = busy[1];
    return h(
      "div",
      { className: "wbt-modal-mask", onMouseDown: function(e) {
        if (e.target === e.currentTarget) props.onClose();
      } },
      h(
        "div",
        { className: "wbt-modal", style: { width: "420px" } },
        h("div", { className: "wbt-modal-head" }, h("h3", null, t.complete + " \xB7 " + props.task.title), h("button", { className: "wbt-icon", onClick: props.onClose }, "\xD7")),
        h("div", { className: "wbt-mhint" }, t.difficultyHint),
        require_difficulty_field()(React)(t, value, setValue, "wbt-done-difficulty"),
        h(
          "label",
          { className: "wbt-field", style: { marginTop: "12px" } },
          h("span", null, t.review + " \xB7 " + t.reviewHint),
          h("textarea", { className: "wbt-textarea", rows: 3, placeholder: t.reviewPlaceholder, value: review, onChange: function(e) {
            setReview(e.target.value);
          } })
        ),
        h(
          "div",
          { className: "wbt-modal-foot" },
          h("button", { className: "wbt-btn ghost", onClick: props.onClose }, t.cancel),
          h("button", { className: "wbt-btn primary", disabled: isBusy, onClick: function() {
            var difficulty = Number(value) || 0;
            setBusy(true);
            props.api.call("tasks.update", { id: props.task.id, type: "STATUS", status: "2", date: today(), difficulty, review: String(review || "") }).then(function(r) {
              setBusy(false);
              if (r && r.ok) props.onDone();
              else props.onError(r && r.error || "update failed");
            });
          } }, isBusy ? "\u2026" : t.confirm)
        )
      )
    );
  }
  var EditModal = require_edit_modal()(React, statusInfo, stars);
  var BatchModal = require_batch_modal()(React, cx, Icon2);
  var CFG_FALLBACK = {
    "ui.listView": "list",
    "ui.expandDepth": 2,
    "ui.confirmDelete": true,
    "ui.defaultPreset": "",
    "list.pageSize": 12,
    "list.sort": "auto",
    "form.defaultPriority": 1,
    "form.defaultDifficulty": 0,
    "form.defaultTargetOffset": 0,
    "stats.range": "30d",
    "stats.top": 10,
    "stats.showKpi": true,
    "stats.recentPublishLimit": 10,
    "stats.recentDoneLimit": 10,
    "stats.recentShutdownLimit": 10,
    "stats.sections": ["trend", "status", "priority", "difficulty", "aging", "overdue", "tables", "groups", "workspaces", "recentPublish", "recentDone", "recentShutdown"]
  };
  var TasksView = require_tasks_view()({ React, configView, CFG_FALLBACK, COPY, injectCss, allTables, findFirstTable, treeWalk, treeFlat, cx, Icon: Icon2, TaskItem, PathCrumbs, TagFilter, WorkspaceFilter, TreeNode, CreateModal, TimelineModal, NodeModal, EditModal, DoneModal, BatchModal });
  var TimelineView = require_timeline_view()({ React, COPY, injectCss, statusInfo, EditModal });
  host.registerAddon({
    id: "wb-addon-tasks",
    version: "5.2.6",
    views: [
      { id: "stats", icon: tabIcon("chart"), title: { zh: "\u7EDF\u8BA1", en: "Stats" }, component: statsView.TasksStatsView, keepAlive: true },
      { id: "tasks", icon: tabIcon("list"), title: { zh: "\u8BB0\u5F55", en: "Records" }, component: TasksView },
      { id: "timeline", icon: tabIcon("timeline"), title: { zh: "\u65F6\u95F4\u7EBF", en: "Timeline" }, component: TimelineView },
      { id: "workspace", icon: tabIcon("folder"), title: { zh: "\u5DE5\u4F5C\u533A", en: "Workspaces" }, component: workspaceView.WorkspaceView },
      { id: "config", icon: tabIcon("settings"), title: { zh: "\u914D\u7F6E", en: "Config" }, component: configView.ConfigView },
      { id: "data", icon: tabIcon("database"), title: { zh: "\u6570\u636E", en: "Data" }, component: dataView.DataView },
      { id: "commands", icon: tabIcon("terminal"), title: { zh: "\u547D\u4EE4", en: "Commands" }, component: commandsView.CommandsView },
      { id: "actions", icon: tabIcon("code-2"), title: { zh: "Action", en: "Actions" }, component: actionSchemaView.ActionSchemaView }
    ]
  });
  module.exports = { name: "dsh-workbench-tasks", inject: [], apply: function() {
  } };
})();
    return module.exports;
  },
});
