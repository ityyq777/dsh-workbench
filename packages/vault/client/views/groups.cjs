"use strict";
/** 分组与关联：vault 持有引用，业务模块用自身标识注册；这里只做管理与查看。 */
var C = require("../ui/common.cjs");
var P = require("../ui/page.cjs");
var FilterChecklist = require("../../../lib/filter-checklist.cjs");
var Dialog = require("../ui/dialog.cjs").Dialog;
var ConfirmDialog = require("../ui/dialog.cjs").ConfirmDialog;
var Lock = require("../ui/lock.cjs");
var iconLabel = require("../../../lib/icon-label.cjs");
var GLYPHS = require("../ui/icons.cjs").ICONS;

var Plus = GLYPHS["plus"];
var Refresh = GLYPHS["refresh-cw"];

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
  // 未解锁守卫：锁定期间不发列表/关联查询，也不渲染列表与弹窗；在途响应按序号丢弃。
  var guard = Lock.use({ api: api, C: C, React: React });
  var inflight = React.useState({ seq: 0 })[0];

  function load() {
    if (guard.locked) {
      listS[1]({ loading: false, rows: [], error: "" });
      return;
    }
    var seq = (inflight.seq += 1);
    listS[1](function (old) { return Object.assign({}, old, { loading: true }); });
    Promise.all([
      C.call(api, "vault.groupList"),
      C.call(api, "vault.setList", {}).catch(function () { return { items: [] }; }),
    ]).then(function (r) {
      if (inflight.seq !== seq) return;
      listS[1]({ loading: false, rows: (r[0] && r[0].items) || [], error: "" });
      setsS[1]((r[1] && r[1].items) || []);
    }).catch(function (e) {
      if (inflight.seq !== seq) return;
      listS[1]({ loading: false, rows: [], error: C.errText(e) });
    });
  }

  // 锁定时收起新建/删除/查看关联等全部弹窗并清空列表；解锁后自动重载。
  React.useEffect(function () {
    if (!guard.ready) return;
    inflight.seq += 1;
    if (guard.locked) {
      listS[1]({ loading: false, rows: [], error: "" });
      setsS[1]([]);
      openS[1](null);
      createS[1](null);
      delS[1](null);
      pickS[1]({ q: "", rows: [], page: 1, loading: false });
      msgS[1]("");
      return;
    }
    load();
  }, [guard.ready, guard.locked]);

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
        msgS[1](failed ? "分组已创建，" + failed + " 个集合与账号挂载失败，可在「查看关联」里补挂" : "");
        load();
      });
    }).catch(function (e) { patchCreate({ busy: false, error: C.errText(e) }); });
  }

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
    if (guard.locked) return;
    openS[1]({ group: row, items: [], loading: true, error: "" });
    var seq = (inflight.seq += 1);
    C.call(api, "vault.subjectsOf", { groupId: row.id }).then(function (r) {
      if (inflight.seq !== seq) return;
      openS[1]({ group: row, items: (r && r.items) || [], loading: false, error: "" });
    }).catch(function (e) {
      if (inflight.seq !== seq) return;
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

  var rows = listS[0].rows;
  var columns = [
    { key: "name", label: "分组" },
    { key: "description", label: "描述" },
    { key: "sets", label: "集合与账号" },
    { key: "secrets", label: "凭据", align: "right" },
    { key: "bindings", label: "关联对象", align: "right" },
    { key: "ops", label: "操作", align: "right" },
  ];

  function renderRow(row) {
    var sets = setsOfGroup(row);
    return h("tr", { key: row.id },
      h("td", null, h("div", { className: "wbv-cell-main" }, row.name), h("div", { className: "wbv-cell-sub" }, row.id)),
      h("td", null, row.description || "—"),
      h("td", null, sets.length
        ? h("div", { className: "wbv-chips" }, sets.map(function (set) { return h("span", { key: set.id, className: "wbv-chip" }, set.name); }))
        : h("span", { className: "wbv-muted" }, "未挂集合与账号")),
      h("td", { className: "wbv-right" }, row.secretCount || 0),
      h("td", { className: "wbv-right" }, row.bindingCount || 0),
      h("td", null, h("div", { className: "wbv-actions" },
        h(C.Btn, { h: h, kind: "ghost", onClick: function () { open(row); } }, "查看关联"),
        h(C.Btn, { h: h, kind: "ghost wbv-delete", onClick: function () { remove(row); } }, "删除"))));
  }

  if (!guard.ready) return h("div", { className: "wbv" }, h(C.Empty, { h: h, text: "正在读取保险箱状态…" }));
  if (guard.locked) return h(Lock.Panel, { h: h, C: C, lang: lang, error: guard.error });

  return h("div", { className: "wbv" },
    h(P.PageHead, {
      h: h,
      title: "分组与关联",
      sub: "业务模块（站点、连接器等）把自己的对象关联到分组，再按组取用组内凭据；关联引用保存在保险箱，不要求模块依赖 sites。",
      actions: [
        h(C.Btn, { h: h, key: "refresh", onClick: load }, iconLabel(h, Refresh, "刷新")),
        h(C.Btn, { h: h, key: "create", kind: "primary", onClick: openCreate }, iconLabel(h, Plus, "新建分组")),
      ],
    }),
    h(C.Notice, { h: h, kind: "error", text: listS[0].error || msgS[0] }),

    listS[0].loading ? h(C.Empty, { h: h, text: "读取分组…" })
      : rows.length === 0 ? h(P.EmptyState, {
          h: h,
          title: "还没有分组",
          hint: "建一个组，把集合挂进来，再把模块对象关联到组。",
        }, h(C.Btn, { h: h, kind: "primary", onClick: openCreate }, "新建分组"))
      : h(P.DataTable, { h: h, label: "分组列表", columns: columns, rows: rows, renderRow: renderRow }),

    createS[0] ? h(Dialog, {
      h: h,
      React: React,
      title: "新建分组",
      titleId: "wbv-group-create-title",
      busy: createS[0].busy,
      onClose: closeCreate,
      closeOnEscape: !createS[0].busy,
      closeOnMask: !createS[0].busy,
      autoFocus: false,
    },
      h("div", { className: "wbv-modal-body" },
        h(C.Field, { h: h, label: "分组名称" },
          h(P.Input, {
            h: h,
            value: createS[0].name,
            placeholder: "如 少数派 / 工作邮箱",
            disabled: createS[0].busy,
            autoFocus: true,
            onChange: function (e) { patchCreate({ name: e.target.value }); },
          })),
        h(C.Field, { h: h, label: "描述" },
          h(P.Input, {
            h: h,
            value: createS[0].description,
            placeholder: "可选",
            disabled: createS[0].busy,
            onChange: function (e) { patchCreate({ description: e.target.value }); },
          })),
        h(C.Field, { h: h, label: "集合与账号（可多选）", hint: "勾选的集合会一并挂到这个分组" },
          h(FilterChecklist, {
            items: pickS[0].rows.slice(0, pickS[0].page * PICK_PAGE).map(function (set) {
              return { id: set.id, name: set.name, meta: (set.secretCount || 0) + " 条" };
            }),
            selected: createS[0].setIds || [],
            onToggle: toggleCreateSet,
            query: pickS[0].q,
            onQuery: pickQuery,
            title: "全部集合与账号",
            total: pickS[0].rows.length,
            selectedText: "已选",
            clearText: "清空",
            onClear: pickClear,
            searchPlaceholder: "搜索集合名、账号或描述",
            loading: pickS[0].loading,
            hasMore: pickS[0].page * PICK_PAGE < pickS[0].rows.length,
            onLoadMore: pickMore,
            emptyText: "还没有集合与账号，可先建组，再到「集合与账号」页新建",
            noMatchText: "没有匹配的集合与账号",
            noMoreText: pickS[0].rows.length > PICK_PAGE ? "没有更多" : "",
            loadingText: "加载中…",
            disabled: createS[0].busy,
            autoFocus: false,
          })),
        h(C.Notice, { h: h, kind: "error", text: createS[0].error })),
      h("div", { className: "wbv-modal-foot" },
        h("span", { className: "wbv-grow" }),
        h(C.Btn, { h: h, disabled: createS[0].busy, onClick: closeCreate }, "取消"),
        h(C.Btn, { h: h, kind: "primary", disabled: createS[0].busy, onClick: create }, createS[0].busy ? "创建中…" : "创建"))) : null,

    delS[0] ? h(ConfirmDialog, {
      h: h,
      React: React,
      title: "删除分组「" + delS[0].row.name + "」？",
      message: "只删除分组与集合、关联对象的绑定，凭据与集合本身都保留。",
      confirmText: "确认删除",
      busyText: "删除中…",
      busy: busyS[0],
      onCancel: function () { if (!busyS[0]) delS[1](null); },
      onConfirm: confirmRemove,
    },
      h(C.Field, { h: h, label: "组内集合改挂到", hint: "留空表示从所有分组移出（集合与凭据不删）" },
        h(P.Select, {
          h: h,
          value: delS[0].moveTo,
          disabled: busyS[0],
          onChange: function (e) { delS[1]({ row: delS[0].row, moveTo: e.target.value }); },
        },
          h("option", { value: "" }, "不转移（移出分组）"),
          rows.filter(function (g) { return g.id !== delS[0].row.id; }).map(function (g) {
            return h("option", { key: g.id, value: g.id }, g.name);
          })))) : null,

    openS[0] ? h(Dialog, {
      h: h,
      React: React,
      title: "「" + openS[0].group.name + "」的关联对象",
      titleId: "wbv-group-open-title",
      onClose: function () { openS[1](null); },
    },
      h("div", { className: "wbv-modal-body" },
        h("p", { className: "wbv-modal-sub" }, "挂载集合（勾选即挂载，取消即摘除，只改关联不动凭据）"),
        h("div", { className: "wbv-check-list" }, setsS[0].length ? setsS[0].map(function (set) {
          var on = (set.groupIds || []).indexOf(openS[0].group.id) >= 0;
          return h("label", { key: set.id, className: "wbv-check" },
            h("input", { type: "checkbox", checked: on, disabled: busyS[0], onChange: function () { toggleSet(openS[0].group, set); } }),
            h("span", { className: "wbv-dot", style: { background: set.color || "var(--wb-accent)" } }),
            h("span", null, set.name),
            h("span", { className: "wbv-muted" }, " · " + (set.secretCount || 0) + " 条"));
        }) : h("span", { className: "wbv-muted" }, "还没有集合与账号")),
        openS[0].loading ? h(C.Empty, { h: h, text: "读取中…" })
          : openS[0].error ? h(C.Notice, { h: h, kind: "error", text: openS[0].error })
          : openS[0].items.length === 0 ? h(P.EmptyState, { h: h, title: "还没有模块关联到这个分组", hint: "关联由业务模块通过 vault.bind 注册，这里只读。" })
          : h(P.DataTable, {
              h: h,
              label: "关联对象",
              columns: [{ key: "type", label: "类型" }, { key: "id", label: "对象 id" }, { key: "title", label: "标题" }],
              rows: openS[0].items,
              renderRow: function (item, i) {
                return h("tr", { key: i },
                  h("td", null, h("span", { className: "wbv-pill" }, item.subjectType)),
                  h("td", null, h("span", { className: "wbv-code" }, item.subjectId)),
                  h("td", null, item.title || "—"));
              },
            })),
      h("div", { className: "wbv-modal-foot" },
        h("span", { className: "wbv-muted wbv-grow" }, "关联由业务模块通过 vault.bind 注册；这里只读。"),
        h(C.Btn, { h: h, onClick: function () { openS[1](null); } }, "关闭"))) : null);
};
