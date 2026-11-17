"use strict";
/** 集合页：集合可复用（挂多个分组、装多条凭据）；这里做列表、详情与关联管理。 */
var C = require("../ui/common.cjs");
var K = require("../ui/kinds.cjs");

module.exports = function SetsView(props) {
  var h = props.h;
  var api = props.api;
  var lang = props.lang || "zh";
  var React = props.React;

  var listS = React.useState({ loading: true, items: [], error: "" });
  var secretsS = React.useState([]);
  var groupsS = React.useState([]);
  var activeS = React.useState(null); // { set, loading }
  var detailS = React.useState({ setId: "", secrets: [], groups: [], error: "" });
  var qS = React.useState("");
  var msgS = React.useState("");
  var busyS = React.useState(false);
  var draftS = React.useState(null); // { id?, name, description, color }
  var pickS = React.useState([]); // 待加入集合的凭据 id

  function load() {
    listS[1](function (old) { return Object.assign({}, old, { loading: true }); });
    Promise.all([
      C.call(api, "vault.setList", { q: qS[0] }),
      C.call(api, "vault.secretList", {}),
      C.call(api, "vault.groupList", {}),
    ]).then(function (r) {
      listS[1]({ loading: false, items: (r[0] && r[0].items) || [], error: "" });
      secretsS[1]((r[1] && (r[1].items || r[1].secrets)) || []);
      groupsS[1]((r[2] && r[2].items) || []);
      if (activeS[0]) return open(activeS[0]).then(null, function () {});
    }).catch(function (e) {
      listS[1]({ loading: false, items: [], error: C.errText(e) });
    });
  }

  React.useEffect(function () { load(); }, []);

  function secretName(id) {
    for (var i = 0; i < secretsS[0].length; i += 1) if (secretsS[0][i].id === id) return secretsS[0][i].name;
    return id;
  }

  function open(row) {
    activeS[1](row);
    detailS[1]({ setId: row.id, secrets: [], groups: [], error: "" });
    return C.call(api, "vault.setGet", { id: row.id }).then(function (r) {
      detailS[1]({ setId: row.id, secrets: (r && r.secrets) || [], groups: (r && r.groupIds) || [], error: "" });
    }).catch(function (e) {
      detailS[1]({ setId: row.id, secrets: [], groups: [], error: C.errText(e) });
    });
  }

  function startCreate() {
    draftS[1]({ name: "", description: "", color: "" });
    msgS[1]("");
  }

  function startEdit(set) {
    draftS[1]({ id: set.id, name: set.name, description: set.description || "", color: set.color || "" });
    msgS[1]("");
  }

  function saveDraft() {
    var d = draftS[0];
    if (!d || !String(d.name || "").trim()) return msgS[1]("集合名不能为空");
    busyS[1](true); msgS[1]("");
    var body = { name: String(d.name).trim(), description: d.description || "", color: d.color || "" };
    var req = d.id
      ? C.call(api, "vault.setUpdate", Object.assign({ id: d.id }, body))
      : C.call(api, "vault.setCreate", body);
    req.then(function () {
      busyS[1](false); draftS[1](null); load();
    }).catch(function (e) { busyS[1](false); msgS[1](C.errText(e)); });
  }

  function removeSet(set) {
    if (!window.confirm("删除集合「" + set.name + "」？只解除关联，凭据本身保留。")) return;
    busyS[1](true); msgS[1]("");
    C.call(api, "vault.setDelete", { id: set.id }).then(function () {
      busyS[1](false); activeS[1](null); load();
    }).catch(function (e) { busyS[1](false); msgS[1](C.errText(e)); });
  }

  function detach(secretId) {
    busyS[1](true); msgS[1]("");
    C.call(api, "vault.setDetachSecret", { setId: activeS[0].id, secretId: secretId }).then(function () {
      busyS[1](false); open(activeS[0]); load();
    }).catch(function (e) { busyS[1](false); msgS[1](C.errText(e)); });
  }

  function attachPicked() {
    if (!pickS[0].length) return;
    busyS[1](true); msgS[1]("");
    var jobs = pickS[0].map(function (secretId) {
      return C.call(api, "vault.setAttachSecret", { setId: activeS[0].id, secretId: secretId });
    });
    Promise.all(jobs).then(function () {
      busyS[1](false); pickS[1]([]); open(activeS[0]); load();
    }).catch(function (e) { busyS[1](false); msgS[1](C.errText(e)); });
  }

  function toggleGroup(groupId, on) {
    busyS[1](true); msgS[1]("");
    var action = on ? "vault.groupAttachSet" : "vault.groupDetachSet";
    C.call(api, action, { groupId: groupId, setId: activeS[0].id }).then(function () {
      busyS[1](false); open(activeS[0]); load();
    }).catch(function (e) { busyS[1](false); msgS[1](C.errText(e)); });
  }

  var items = listS[0].items.filter(function (set) {
    var q = qS[0].trim();
    if (!q) return true;
    return (set.name || "").indexOf(q) >= 0 || (set.description || "").indexOf(q) >= 0;
  });
  var detail = detailS[0];
  var inSet = {};
  detail.secrets.forEach(function (s) { inSet[s.id] = true; });
  var candidates = secretsS[0].filter(function (s) { return !inSet[s.id]; });

  return h("div", { className: "wbv" },
    h("div", { className: "wbv-row" },
      h("h2", { className: "wbv-grow" }, "凭据集合"),
      h("input", { style: { maxWidth: "200px" }, placeholder: "搜索集合名/描述", value: qS[0], onChange: function (e) { qS[1](e.target.value); } }),
      h(C.Btn, { h: h, onClick: load }, "刷新"),
      h(C.Btn, { h: h, kind: "primary", onClick: startCreate }, "新建集合")),
    h("p", { className: "wbv-muted" }, "一个集合可以挂到多个分组、装多条凭据；删除集合只断关联，不删凭据。"),
    h(C.Notice, { h: h, kind: "error", text: listS[0].error || msgS[0] }),

    h("div", { className: "wbv-split" },
      h("div", { className: "wbv-list" },
        listS[0].loading ? h(C.Empty, { h: h, text: "读取集合…" }) :
          items.length === 0 ? h("div", { className: "wbv-card" },
            h("div", { className: "wbv-muted" }, qS[0] ? "没有匹配的集合。" : "还没有集合。新建一个后，可以把凭据和分组都挂进来。"),
            h("div", { className: "wbv-row", style: { marginTop: "8px" } },
              h(C.Btn, { h: h, kind: "primary", onClick: startCreate }, "新建集合"))) :
          items.map(function (set) {
            var on = activeS[0] && activeS[0].id === set.id;
            return h("div", {
              key: set.id, className: "wbv-item" + (on ? " on" : ""), onClick: function () { open(set); },
            },
              h("div", { className: "wbv-item-top" },
                h("span", { className: "wbv-dot", style: set.color ? { background: set.color } : null }),
                h("strong", null, set.name),
                h("span", { className: "wbv-grow" }),
                h("span", { className: "wbv-pill" }, (set.secretCount || 0) + " 条凭据")),
              h("div", { className: "wbv-muted", style: { fontSize: "11px", marginTop: "2px" } },
                (set.description || "—") + " · " + (set.groupIds || []).length + " 个分组"));
          })),

      h("div", { className: "wbv-card" },
        !activeS[0] ? h(C.Empty, { h: h, text: "左侧选一个集合，查看凭据与分组。" }) :
          h(React.Fragment, null,
            h("div", { className: "wbv-row" },
              h("h3", { className: "wbv-grow" }, activeS[0].name),
              h(C.Btn, { h: h, onClick: function () { startEdit(activeS[0]); } }, "编辑"),
              h(C.Btn, { h: h, kind: "danger", onClick: function () { removeSet(activeS[0]); } }, "删除集合")),
            detail.error ? h(C.Notice, { h: h, kind: "error", text: detail.error }) : null,

            h("div", { className: "wbv-label" }, "集合内凭据"),
            detail.secrets.length === 0 ? h("div", { className: "wbv-muted" }, "还没有凭据。") :
              h("table", { className: "wbv-table" },
                h("thead", null, h("tr", null, ["名称", "类型", "更新时间", "操作"].map(function (x) { return h("th", { key: x }, x); }))),
                h("tbody", null, detail.secrets.map(function (s) {
                  return h("tr", { key: s.id },
                    h("td", null, h("strong", null, s.name)),
                    h("td", null, h("span", { className: "wbv-pill" }, K.KIND_LABEL[s.kind] || s.kind)),
                    h("td", null, C.fmtTime(s.updatedAt, lang)),
                    h("td", null, h(C.Btn, { h: h, kind: "ghost", onClick: function () { detach(s.id); } }, "移出")));
                }))),
            h("div", { className: "wbv-row" },
              h("select", {
                style: { maxWidth: "260px" }, value: "",
                onChange: function (e) { var v = e.target.value; if (v) pickS[1](pickS[0].concat([v])); e.target.value = ""; },
              },
                h("option", { value: "" }, candidates.length ? "选择要加入的凭据…" : "没有可加入的凭据"),
                candidates.map(function (s) { return h("option", { key: s.id, value: s.id }, s.name + "（" + (K.KIND_LABEL[s.kind] || s.kind) + "）"); })),
              pickS[0].length ? h("span", { className: "wbv-chips" }, pickS[0].map(function (id) {
                return h("span", { className: "wbv-chip", key: id }, secretName(id),
                  h("button", { className: "wbv-btn ghost", onClick: function () { pickS[1](pickS[0].filter(function (x) { return x !== id; })); } }, "×"));
              })) : null,
              h("span", { className: "wbv-grow" }),
              h(C.Btn, { h: h, kind: "primary", disabled: !pickS[0].length || busyS[0], onClick: attachPicked }, "加入 " + (pickS[0].length || ""))),

            h("div", { className: "wbv-label" }, "挂靠分组"),
            h("div", { className: "wbv-chips" },
              groupsS[0].length === 0 ? h("span", { className: "wbv-muted" }, "还没有分组。") :
                groupsS[0].map(function (g) {
                  var on = detail.groups.indexOf(g.id) >= 0;
                  return h("label", { key: g.id, className: "wbv-chip", style: { cursor: "pointer" } },
                    h("input", { type: "checkbox", checked: on, disabled: busyS[0], onChange: function (e) { toggleGroup(g.id, e.target.checked); } }),
                    g.name);
                }))),

        draftS[0] ? h("div", { className: "wbv-modal", onClick: function () { draftS[1](null); } },
          h("div", { className: "wbv-modal-box", onClick: function (e) { e.stopPropagation(); } },
            h("h3", null, draftS[0].id ? "编辑集合" : "新建集合"),
            h(C.Field, { h: h, label: "集合名" },
              h("input", { value: draftS[0].name, placeholder: "如 acc_1 / 工作邮箱", onChange: function (e) { draftS[1](Object.assign({}, draftS[0], { name: e.target.value })); } })),
            h(C.Field, { h: h, label: "描述" },
              h("input", { value: draftS[0].description, placeholder: "可选", onChange: function (e) { draftS[1](Object.assign({}, draftS[0], { description: e.target.value })); } })),
            h(C.Field, { h: h, label: "颜色（可选，主题 token 名或色值）" },
              h("input", { value: draftS[0].color, placeholder: "如 --wb-accent", onChange: function (e) { draftS[1](Object.assign({}, draftS[0], { color: e.target.value })); } })),
            h(C.Notice, { h: h, kind: "error", text: msgS[0] }),
            h("div", { className: "wbv-row" },
              h("span", { className: "wbv-grow" }),
              h(C.Btn, { h: h, onClick: function () { draftS[1](null); } }, "取消"),
              h(C.Btn, { h: h, kind: "primary", disabled: busyS[0], onClick: saveDraft }, busyS[0] ? "保存中…" : "保存")))) : null)));
};
