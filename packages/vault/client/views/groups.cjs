"use strict";
/** 分组与关联：vault 持有引用，业务模块用自身标识注册；这里只做管理与查看。 */
var C = require("../ui/common.cjs");
var FilterChecklist = require("../../../lib/filter-checklist.cjs");

module.exports = function GroupsView(props) {
  var h = props.h;
  var api = props.api;
  var lang = props.lang || "zh";
  var React = props.React;

  var listS = React.useState({ loading: true, rows: [], error: "" });
  var msgS = React.useState("");
  var busyS = React.useState(false);
  var createS = React.useState(null); // { name, description, setIds, error, busy }
  var openS = React.useState(null); // { group, items, loading, error }
  var setsS = React.useState([]);
  var delS = React.useState(null); // { row, moveTo }
  var pickS = React.useState({ q: "", rows: [], page: 1, loading: false });

  function load() {
    listS[1](function (old) { return Object.assign({}, old, { loading: true }); });
    Promise.all([
      C.call(api, "vault.groupList"),
      C.call(api, "vault.setList", {}).catch(function () { return { items: [] }; }),
    ]).then(function (r) {
      listS[1]({ loading: false, rows: (r[0] && r[0].items) || [], error: "" });
      setsS[1]((r[1] && r[1].items) || []);
    }).catch(function (e) {
      listS[1]({ loading: false, rows: [], error: C.errText(e) });
    });
  }

  React.useEffect(function () { load(); }, []);

  function openCreate() {
    createS[1]({ name: "", description: "", setIds: [], error: "", busy: false });
  }
  function closeCreate() {
    if (createS[0] && createS[0].busy) return;
    createS[1](null);
  }
  function patchCreate(patch) {
    createS[1](function (old) { return old ? Object.assign({}, old, patch) : old; });
  }
  function toggleCreateSet(id) {
    var cur = (createS[0] && createS[0].setIds) || [];
    var next = cur.indexOf(id) >= 0 ? cur.filter(function (x) { return x !== id; }) : cur.concat([id]);
    patchCreate({ setIds: next });
  }

  // 建组弹窗的集合清单：200ms 防抖走后端模糊搜索；接口不分页，本地每页 20 条切片。
  var PICK_PAGE = 20;
  var pickOpen = Boolean(createS[0]);
  var pickQ = pickS[0].q;
  React.useEffect(function () {
    if (!pickOpen) return undefined;
    var alive = true;
    var timer = setTimeout(function () {
      pickS[1](function (old) { return Object.assign({}, old, { loading: true }); });
      C.call(api, "vault.setList", pickQ ? { q: pickQ } : {}).then(function (r) {
        if (!alive) return;
        pickS[1]({ q: pickQ, rows: (r && r.items) || [], page: 1, loading: false });
      }).catch(function () {
        if (alive) pickS[1](function (old) { return Object.assign({}, old, { loading: false }); });
      });
    }, pickQ ? 200 : 0);
    return function () { alive = false; clearTimeout(timer); };
  }, [pickOpen, pickQ]);

  function pickQuery(v) {
    pickS[1](function (old) { return Object.assign({}, old, { q: v, loading: true }); });
  }
  function pickMore() {
    pickS[1](function (old) {
      return old.page * PICK_PAGE >= old.rows.length ? old : Object.assign({}, old, { page: old.page + 1 });
    });
  }
  function pickClear() {
    patchCreate({ setIds: [] });
    pickS[1](function (old) { return Object.assign({}, old, { q: "", page: 1 }); });
  }

  // 建组 + 挂集合：groupCreate 拿 id 后逐个 groupAttachSet（幂等）；部分失败只提示，不回滚分组。
  function create() {
    var c = createS[0];
    if (!c) return;
    if (!c.name.trim()) return patchCreate({ error: "分组名称不能为空" });
    patchCreate({ busy: true, error: "" });
    C.call(api, "vault.groupCreate", { name: c.name.trim(), description: c.description.trim() }).then(function (r) {
      var groupId = r && r.id;
      var picks = c.setIds || [];
      return Promise.all(picks.map(function (setId) {
        return C.call(api, "vault.groupAttachSet", { groupId: groupId, setId: setId }).then(
          function () { return true; },
          function () { return false; },
        );
      })).then(function (results) {
        var failed = results.filter(function (ok) { return !ok; }).length;
        createS[1](null);
        msgS[1](failed ? "分组已创建，" + failed + " 个集合挂载失败，可在「查看关联」里补挂" : "");
        load();
      });
    }).catch(function (e) { patchCreate({ busy: false, error: C.errText(e) }); });
  }

  // Esc 关闭建组弹窗（创建中忽略）。
  var createOpen = Boolean(createS[0]);
  React.useEffect(function () {
    if (!createOpen) return undefined;
    function onKey(e) { if (e.key === "Escape") closeCreate(); }
    window.addEventListener("keydown", onKey);
    return function () { window.removeEventListener("keydown", onKey); };
  }, [createOpen]);

  // 桌面端 webview 不支持 window.prompt，删除分组用应用内确认弹层（可选接收分组）。
  function remove(row) { delS[1]({ row: row, moveTo: "" }); }
  function confirmRemove() {
    var d = delS[0];
    if (!d) return;
    busyS[1](true); msgS[1]("");
    C.call(api, "vault.groupDelete", { id: d.row.id, moveTo: d.moveTo || undefined }).then(function () {
      busyS[1](false); delS[1](null);
      if (openS[0] && openS[0].group.id === d.row.id) openS[1](null);
      load();
    }).catch(function (e) { busyS[1](false); msgS[1](C.errText(e)); });
  }

  function open(row) {
    openS[1]({ group: row, items: [], loading: true, error: "" });
    C.call(api, "vault.subjectsOf", { groupId: row.id }).then(function (r) {
      openS[1]({ group: row, items: (r && r.items) || [], loading: false, error: "" });
    }).catch(function (e) {
      openS[1]({ group: row, items: [], loading: false, error: C.errText(e) });
    });
  }

  function setsOfGroup(row) {
    return setsS[0].filter(function (set) { return (set.groupIds || []).indexOf(row.id) >= 0; });
  }

  function toggleSet(row, set) {
    var linked = (set.groupIds || []).indexOf(row.id) >= 0;
    busyS[1](true); msgS[1]("");
    var call = linked
      ? C.call(api, "vault.groupDetachSet", { groupId: row.id, setId: set.id })
      : C.call(api, "vault.groupAttachSet", { groupId: row.id, setId: set.id });
    call.then(function () {
      busyS[1](false);
      setsS[1](function (old) {
        return old.map(function (item) {
          if (item.id !== set.id) return item;
          var ids = (item.groupIds || []).slice();
          var i = ids.indexOf(row.id);
          if (linked && i >= 0) ids.splice(i, 1);
          if (!linked && i < 0) ids.push(row.id);
          return Object.assign({}, item, { groupIds: ids });
        });
      });
      load();
    }).catch(function (e) { busyS[1](false); msgS[1](C.errText(e)); });
  }

  return h("div", { className: "wbv" },
    h("div", { className: "wbv-row" },
      h("h2", { className: "wbv-grow" }, "分组与关联"),
      h(C.Btn, { h: h, onClick: load }, "刷新"),
      h(C.Btn, { h: h, kind: "primary", onClick: openCreate }, "新建分组")),
    h("p", { className: "wbv-muted" },
      "业务模块（站点、连接器等）把自己的对象关联到分组，再按组取用组内凭据；关联引用保存在保险箱，不要求模块依赖 sites。"),
    h(C.Notice, { h: h, kind: "error", text: listS[0].error || msgS[0] }),

    listS[0].loading ? h(C.Empty, { h: h, text: "读取分组…" }) :
      listS[0].rows.length === 0 ? h("div", { className: "wbv-empty-card" },
        h("div", { className: "wbv-empty-title" }, "还没有分组"),
        h("div", { className: "wbv-muted" }, "建一个组，把集合挂进来，再把模块对象关联到组。"),
        h("div", { className: "wbv-row" }, h(C.Btn, { h: h, kind: "primary", onClick: openCreate }, "新建分组"))) :
      h("table", { className: "wbv-table" },
        h("thead", null, h("tr", null, ["分组", "描述", "集合", "凭据", "关联对象", "操作"].map(function (x) { return h("th", { key: x }, x); }))),
        h("tbody", null, listS[0].rows.map(function (row) {
          return h("tr", { key: row.id },
            h("td", null, h("strong", null, row.name), h("div", { className: "wbv-muted" }, row.id)),
            h("td", null, row.description || "—"),
            h("td", null, setsOfGroup(row).length ? h("div", { className: "wbv-chips" }, setsOfGroup(row).map(function (set) {
              return h("span", { key: set.id, className: "wbv-chip" }, set.name);
            })) : h("span", { className: "wbv-muted" }, "未挂集合")),
            h("td", null, row.secretCount || 0),
            h("td", null, row.bindingCount || 0),
            h("td", null, h("div", { className: "wbv-inline" },
              h(C.Btn, { h: h, kind: "ghost", onClick: function () { open(row); } }, "查看关联"),
              h(C.Btn, { h: h, kind: "ghost", onClick: function () { remove(row); } }, "删除"))));
        }))),

    createS[0] ? h("div", { className: "wbv-modal", onClick: closeCreate },
      h("div", { className: "wbv-modal-box", onClick: function (e) { e.stopPropagation(); } },
        h("h3", null, "新建分组"),
        h(C.Field, { h: h, label: "分组名称" },
          h("input", {
            value: createS[0].name,
            placeholder: "如 少数派 / 工作邮箱",
            disabled: createS[0].busy,
            autoFocus: true,
            onChange: function (e) { patchCreate({ name: e.target.value }); },
          })),
        h(C.Field, { h: h, label: "描述" },
          h("input", {
            value: createS[0].description,
            placeholder: "可选",
            disabled: createS[0].busy,
            onChange: function (e) { patchCreate({ description: e.target.value }); },
          })),
        h(C.Field, { h: h, label: "集合（可多选）", hint: "勾选的集合会一并挂到这个分组" },
          h(FilterChecklist, {
            items: pickS[0].rows.slice(0, pickS[0].page * PICK_PAGE).map(function (set) {
              return { id: set.id, name: set.name, meta: (set.secretCount || 0) + " 条" };
            }),
            selected: createS[0].setIds || [],
            onToggle: toggleCreateSet,
            query: pickS[0].q,
            onQuery: pickQuery,
            title: "全部集合",
            total: pickS[0].rows.length,
            selectedText: "已选",
            clearText: "清空",
            onClear: pickClear,
            searchPlaceholder: "搜索集合名称或描述",
            loading: pickS[0].loading,
            hasMore: pickS[0].page * PICK_PAGE < pickS[0].rows.length,
            onLoadMore: pickMore,
            emptyText: "还没有集合，可先建组，再到「集合」页新建",
            noMatchText: "没有匹配的集合",
            noMoreText: pickS[0].rows.length > PICK_PAGE ? "没有更多" : "",
            loadingText: "加载中…",
            disabled: createS[0].busy,
            autoFocus: false,
          })),
        h(C.Notice, { h: h, kind: "error", text: createS[0].error }),
        h("div", { className: "wbv-row", style: { justifyContent: "flex-end" } },
          h(C.Btn, { h: h, disabled: createS[0].busy, onClick: closeCreate }, "取消"),
          h(C.Btn, { h: h, kind: "primary", disabled: createS[0].busy, onClick: create }, createS[0].busy ? "创建中…" : "创建")))) : null,

    delS[0] ? h("div", { className: "wbv-modal", onClick: function () { if (!busyS[0]) delS[1](null); } },
      h("div", { className: "wbv-modal-box", onClick: function (e) { e.stopPropagation(); } },
        h("h3", null, "删除分组「" + delS[0].row.name + "」？"),
        h("p", { className: "wbv-sub" }, "只删除分组与集合、关联对象的绑定，凭据与集合本身都保留。"),
        h(C.Field, { h: h, label: "组内集合改挂到", hint: "留空表示从所有分组移出（集合与凭据不删）" },
          h("select", { value: delS[0].moveTo, disabled: busyS[0], onChange: function (e) { delS[1]({ row: delS[0].row, moveTo: e.target.value }); } },
            h("option", { value: "" }, "不转移（移出分组）"),
            listS[0].rows.filter(function (g) { return g.id !== delS[0].row.id; }).map(function (g) {
              return h("option", { key: g.id, value: g.id }, g.name);
            }))),
        h("div", { className: "wbv-row", style: { justifyContent: "flex-end" } },
          h(C.Btn, { h: h, disabled: busyS[0], onClick: function () { delS[1](null); } }, "取消"),
          h(C.Btn, { h: h, kind: "danger", disabled: busyS[0], onClick: confirmRemove }, busyS[0] ? "删除中…" : "确认删除")))) : null,

    openS[0] ? h("div", { className: "wbv-modal", onClick: function () { openS[1](null); } },
      h("div", { className: "wbv-modal-box", onClick: function (e) { e.stopPropagation(); } },
        h("h3", null, "「" + openS[0].group.name + "」的关联对象"),
        h("div", { className: "wbv-sub" }, "挂载集合（勾选即挂载，取消即摘除，只改关联不动凭据）"),
        h("div", { className: "wbv-check-list" }, setsS[0].length ? setsS[0].map(function (set) {
          var on = (set.groupIds || []).indexOf(openS[0].group.id) >= 0;
          return h("label", { key: set.id, className: "wbv-check" },
            h("input", { type: "checkbox", checked: on, disabled: busyS[0], onChange: function () { toggleSet(openS[0].group, set); } }),
            h("span", { className: "wbv-dot", style: { background: set.color || "var(--wb-accent)" } }),
            h("span", null, set.name),
            h("span", { className: "wbv-muted" }, " · " + (set.secretCount || 0) + " 条"));
        }) : h("span", { className: "wbv-muted" }, "还没有集合")),
        openS[0].loading ? h(C.Empty, { h: h, text: "读取中…" }) :
          openS[0].error ? h(C.Notice, { h: h, kind: "error", text: openS[0].error }) :
          openS[0].items.length === 0 ? h(C.Empty, { h: h, text: "还没有模块关联到这个分组。" }) :
          h("table", { className: "wbv-table" },
            h("thead", null, h("tr", null, ["类型", "对象 id", "标题"].map(function (x) { return h("th", { key: x }, x); }))),
            h("tbody", null, openS[0].items.map(function (item, i) {
              return h("tr", { key: i },
                h("td", null, item.subjectType),
                h("td", null, item.subjectId),
                h("td", null, item.title || "—"));
            }))),
        h("div", { className: "wbv-row" },
          h("span", { className: "wbv-muted wbv-grow" }, "关联由业务模块通过 vault.bind 注册；这里只读。"),
          h(C.Btn, { h: h, onClick: function () { openS[1](null); } }, "关闭")))) : null);
};
