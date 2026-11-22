"use strict";
/**
 * 凭据库：全局列表 + 搜索/类型筛选 + 所属集合；明文只在 reveal 弹层里出现。
 *
 * 页面结构走 ui/page.cjs（页头 / 工具条 / 表格 / 空态），弹层走 ui/dialog.cjs
 * （共享 overlay 的键盘契约），删除改成应用内二次确认——桌面端 webview 没有可用的
 * window.confirm。
 */
var GLYPHS = require("../ui/icons.cjs").ICONS;
var C = require("../ui/common.cjs");
var P = require("../ui/page.cjs");
var AskPassphrase = require("../ui/ask-passphrase.cjs");
var Dialog = require("../ui/dialog.cjs").Dialog;
var ConfirmDialog = require("../ui/dialog.cjs").ConfirmDialog;
var FormDialog = require("../ui/dialog.cjs").FormDialog;
var iconLabel = require("../../../lib/icon-label.cjs");
var SecretField = require("../../../lib/secret-field.cjs");
var Lock = require("../ui/lock.cjs");

var Refresh = GLYPHS["refresh-cw"];
var Unlock = GLYPHS["lock-open"];
var Plus = GLYPHS["plus"];
var Eye = GLYPHS["eye"];
var Pencil = GLYPHS["pencil"];
var Trash = GLYPHS["trash-2"];
var KeyIcon = GLYPHS["key-round"];

var K = require("../ui/kinds.cjs");
var KIND_LABEL = K.KIND_LABEL;

module.exports = function SecretsView(props) {
  var h = props.h;
  var api = props.api;
  var lang = props.lang || "zh";
  var React = props.React;

  var listS = React.useState({ loading: true, rows: [], error: "" });
  var qS = React.useState("");
  var kindS = React.useState("");
  var statusS = React.useState(null);
  var setsS = React.useState([]);
  var formS = React.useState(emptyForm());
  var editingS = React.useState(false);
  var showSecretS = React.useState(false);
  var busyS = React.useState(false);
  var msgS = React.useState("");
  var revealS = React.useState(null);
  var askS = React.useState(null); // { row, value, busy, error }
  var unlockS = React.useState(null); // { value, busy, error } 解锁弹层
  var delS = React.useState(null); // { row } 删除确认弹层
  // 未解锁守卫：锁定期间不请求列表；在途请求用序号作废，返回时若已锁定/已重载就丢弃。
  var guard = Lock.use({ api: api, C: C, React: React });
  var inflight = React.useState({ seq: 0 })[0];

  var rows = listS[0].rows;

  function load() {
    if (guard.locked) {
      listS[1]({ loading: false, rows: [], error: "" });
      return;
    }
    var seq = (inflight.seq += 1);
    listS[1](function (old) { return Object.assign({}, old, { loading: true }); });
    Promise.all([
      C.call(api, "vault.secretList", { q: qS[0], kind: kindS[0] || undefined }),
      C.call(api, "vault.status").catch(function () { return null; }),
      C.call(api, "vault.setList", {}).catch(function () { return { items: [] }; }),
    ]).then(function (r) {
      if (inflight.seq !== seq) return; // 已被锁定或重新加载，旧响应不许回填
      listS[1]({ loading: false, rows: (r[0] && (r[0].items || r[0].secrets)) || [], error: "" });
      statusS[1](r[1]);
      setsS[1]((r[2] && r[2].items) || []);
    }).catch(function (e) {
      if (inflight.seq !== seq) return;
      listS[1]({ loading: false, rows: [], error: C.errText(e) });
    });
  }

  // 锁定 -> 清空所有可能残留明文的展示面（列表、明文弹层、解锁弹层、编辑表单、删除确认）；
  // 解锁 -> 自动重载，用户不用手动点刷新。
  React.useEffect(function () {
    if (!guard.ready) return;
    inflight.seq += 1;
    if (guard.locked) {
      listS[1]({ loading: false, rows: [], error: "" });
      revealS[1](null);
      askS[1](null);
      unlockS[1](null);
      delS[1](null);
      formS[1](emptyForm());
      editingS[1](false);
      showSecretS[1](false);
      msgS[1]("");
      return;
    }
    load();
  }, [guard.ready, guard.locked]);

  function startCreate() {
    formS[1](emptyForm());
    showSecretS[1](false);
    editingS[1](true);
    msgS[1]("");
  }

  function startEdit(row) {
    showSecretS[1](false);
    var meta = {};
    try { meta = JSON.parse(row.meta || "{}"); } catch (e) { meta = {}; }
    formS[1]({
      id: row.id,
      name: row.name,
      kind: row.kind,
      secret: "",
      setIds: (row.setIds || []).slice(),
      note: noteOf(meta),
    });
    editingS[1](true);
    msgS[1]("");
  }

  function closeForm() {
    editingS[1](false);
    showSecretS[1](false);
  }

  function toggleSet(id) {
    var cur = formS[0].setIds || [];
    var next = cur.indexOf(id) >= 0 ? cur.filter(function (x) { return x !== id; }) : cur.concat([id]);
    formS[1](Object.assign({}, formS[0], { setIds: next }));
  }

  /** 服务端拒绝（锁定）时的原文，用来识别「要不要顺手弹解锁框」。 */
  function isLockedText(text) {
    return /保险箱已锁定|请先解锁/.test(String(text || ""));
  }

  function askUnlock(hint) {
    unlockS[1]({ value: "", busy: false, error: hint || "" });
  }

  function confirmUnlock() {
    var u = unlockS[0];
    if (!u || !u.value) return;
    unlockS[1](Object.assign({}, u, { busy: true, error: "" }));
    C.call(api, "vault.unlock", { passphrase: u.value }).then(function () {
      unlockS[1](null);
      msgS[1]("");
      if (editingS[0]) save(true);
      else load();
    }).catch(function (e) {
      unlockS[1](Object.assign({}, u, { busy: false, error: C.errText(e) }));
    });
  }

  /**
   * 保存凭据。
   *
   * 三条硬约定（都来自「保存后列表不新增」这个线上问题）：
   * 1. 锁定态必须当场说清楚，并给出解锁入口，不能点了保存什么都不发生；
   * 2. 写入成功后**无条件** load()，集合挂载失败只提示、不回滚、不跳过刷新；
   * 3. 失败时保留弹窗和用户输入，错误原文留在弹窗内。
   */
  function save(alreadyUnlocked) {
    var f = formS[0];
    if (!f.name.trim()) return msgS[1]("名称不能为空");
    if (!f.id && !f.secret) return msgS[1]("新增凭据必须填写明文");
    if (!alreadyUnlocked && statusS[0] && statusS[0].locked) {
      msgS[1]("保险箱已锁定，请先解锁再保存");
      askUnlock("保险箱已锁定，输入主口令后会自动继续保存。");
      return;
    }
    busyS[1](true); msgS[1]("");
    var meta = {};
    var note = (f.note || "").trim();
    if (note) meta.note = note;
    var picked = f.setIds || [];
    // create 的 payload 里不能出现 id 键：schema 是 additionalProperties:false，多带一个键就会被拒。
    var payload = {
      name: f.name.trim(),
      kind: f.kind,
      meta: meta,
    };
    if (f.secret) payload.secret = f.secret;
    if (f.id) payload.id = f.id;
    if (!f.id && picked.length) payload.setId = picked[0];
    var p = f.id
      ? C.call(api, "vault.secretUpdate", payload)
      : C.call(api, "vault.secretCreate", payload);
    p.then(function (r) {
      var createdId = (r && r.id) || f.id;
      return syncSets(createdId, f.setIds || [], f.id ? rowSetIds(f.id) : []).catch(function (e) {
        msgS[1]("凭据已保存，但集合挂载失败：" + C.errText(e));
      }).then(function () {
        busyS[1](false); editingS[1](false); showSecretS[1](false); formS[1](emptyForm()); load();
      });
    }).catch(function (e) {
      busyS[1](false);
      var text = C.errText(e);
      msgS[1](text);
      // 失败也要刷新：锁定状态和服务端对齐后，顶部才会出现解锁入口。
      load();
      if (isLockedText(text)) askUnlock("保险箱已锁定，输入主口令后会自动继续保存。");
    });
  }

  function rowSetIds(id) {
    for (var i = 0; i < rows.length; i += 1) if (rows[i].id === id) return (rows[i].setIds || []).slice();
    return [];
  }

  function syncSets(secretId, next, prev) {
    var added = next.filter(function (x) { return prev.indexOf(x) < 0; });
    var removed = prev.filter(function (x) { return next.indexOf(x) < 0; });
    var jobs = added.map(function (setId) {
      return C.call(api, "vault.setAttachSecret", { setId: setId, secretId: secretId });
    }).concat(removed.map(function (setId) {
      return C.call(api, "vault.setDetachSecret", { setId: setId, secretId: secretId });
    }));
    return Promise.all(jobs);
  }

  function remove(row) {
    delS[1]({ row: row });
  }

  function confirmRemove() {
    var d = delS[0];
    if (!d) return;
    busyS[1](true); msgS[1]("");
    C.call(api, "vault.secretDelete", { id: d.row.id }).then(function () {
      busyS[1](false); delS[1](null); load();
    }).catch(function (e) {
      busyS[1](false);
      msgS[1](C.errText(e));
    });
  }

  function reveal(row) {
    msgS[1]("");
    var mode = statusS[0] && statusS[0].unlockMode;
    if (mode === "B") { askS[1]({ row: row, value: "", busy: false, error: "" }); return; }
    doReveal(row, undefined);
  }

  function doReveal(row, passphrase) {
    busyS[1](true);
    C.call(api, "vault.secretReveal", { id: row.id, passphrase: passphrase }).then(function (r) {
      busyS[1](false); askS[1](null); revealS[1]({ name: row.name, secret: r.secret });
    }).catch(function (e) {
      busyS[1](false);
      if (askS[0]) askS[1](Object.assign({}, askS[0], { busy: false, error: C.errText(e) }));
      else msgS[1](C.errText(e));
    });
  }

  function confirmPassphrase() {
    var a = askS[0];
    if (!a || !a.value) return;
    askS[1](Object.assign({}, a, { busy: true, error: "" }));
    doReveal(a.row, a.value);
  }

  function copyRevealed() {
    if (!revealS[0] || !navigator.clipboard) return;
    navigator.clipboard.writeText(revealS[0].secret).then(function () {
      msgS[1]("已复制");
    }, function () {
      msgS[1]("复制失败，请手动选中复制");
    });
  }

  var setIndex = {};
  setsS[0].forEach(function (s) { setIndex[s.id] = s.name; });

  if (!guard.ready) return h("div", { className: "wbv" }, h(C.Empty, { h: h, text: "正在读取保险箱状态…" }));
  if (guard.locked) return h(Lock.Panel, { h: h, C: C, lang: lang, error: guard.error });

  var locked = statusS[0] && statusS[0].locked;
  var filtered = Boolean(qS[0] || kindS[0]);
  var columns = [
    { key: "name", label: "名称" },
    { key: "kind", label: "类型" },
    { key: "sets", label: "所属集合" },
    { key: "note", label: "备注" },
    { key: "used", label: "最近使用" },
    { key: "ops", label: "操作", align: "right" },
  ];

  function renderRow(row) {
    var meta = {};
    try { meta = JSON.parse(row.meta || "{}"); } catch (e) { meta = {}; }
    var chips = (row.setIds || []).map(function (id) {
      return h("span", { key: id, className: "wbv-chip" }, h("span", null, setIndex[id] || id));
    });
    return h("tr", { key: row.id },
      h("td", null, h("div", { className: "wbv-cell-main" }, row.name), h("div", { className: "wbv-cell-sub" }, row.id)),
      h("td", null, h("span", { className: "wbv-pill" }, KIND_LABEL[row.kind] || row.kind)),
      h("td", null, chips.length ? h("div", { className: "wbv-chips" }, chips) : h("span", { className: "wbv-muted" }, "未加入集合")),
      h("td", null, noteOf(meta) || "—"),
      h("td", null, C.fmtTime(row.lastUsedAt, lang)),
      h("td", null, h("div", { className: "wbv-actions" },
        h(C.Btn, { h: h, kind: "ghost", onClick: function () { reveal(row); } }, iconLabel(h, Eye, "查看")),
        h(C.Btn, { h: h, kind: "ghost", onClick: function () { startEdit(row); } }, iconLabel(h, Pencil, "编辑")),
        h(C.Btn, { h: h, kind: "ghost wbv-delete", onClick: function () { remove(row); } }, iconLabel(h, Trash, "删除")))));
  }

  return h("div", { className: "wbv" },
    h(P.PageHead, {
      h: h,
      title: "凭据库",
      sub: "凭据按「集合与账号」组织：一条凭据可以进多个集合，一个集合可以标一个账号、挂到多个分组。明文只在本机解锁后可见。",
      actions: [
        h(C.Btn, { h: h, key: "refresh", onClick: load }, iconLabel(h, Refresh, "刷新")),
        locked ? h(C.Btn, { h: h, key: "unlock", kind: "primary", onClick: function () { askUnlock(""); } }, iconLabel(h, Unlock, "解锁")) : null,
        h(C.Btn, { h: h, key: "create", kind: "primary", onClick: startCreate }, iconLabel(h, Plus, "新增凭据")),
      ],
    }),
    h(P.Toolbar, { h: h },
      h(P.Input, {
        h: h,
        className: "wbv-search",
        placeholder: "搜索名称、备注或集合与账号",
        "aria-label": "搜索凭据",
        value: qS[0],
        onChange: function (e) { qS[1](e.target.value); },
        onKeyDown: function (e) { if (e.key === "Enter") load(); },
      }),
      h(P.Select, {
        h: h,
        value: kindS[0],
        "aria-label": "按类型筛选",
        onChange: function (e) { kindS[1](e.target.value); setTimeout(load, 0); },
      }, h("option", { value: "" }, "全部类型"),
        K.CREATABLE_KINDS.map(function (k) { return h("option", { key: k, value: k }, KIND_LABEL[k]); })),
      h("span", { className: "wbv-toolbar-tail" }),
      h("span", { className: "wbv-muted" }, listS[0].loading ? "读取中…" : rows.length + " 条")),

    locked
      ? h(C.Notice, { h: h, kind: "error", text: "保险箱已锁定（" + (statusS[0].unlockMode || "A") + " 模式）：新增、编辑和查看明文都需要先解锁。点右上角「解锁」，或直接保存时按提示解锁。" })
      : null,
    h(C.Notice, { h: h, kind: "error", text: listS[0].error || msgS[0] }),

    listS[0].loading
      ? h(C.Empty, { h: h, text: "读取中…" })
      : rows.length === 0
        ? h(P.EmptyState, {
            h: h,
            icon: KeyIcon,
            title: filtered ? "没有匹配的凭据" : "还没有凭据",
            hint: filtered
              ? "换个关键词或类型试试。"
              : "新增一条后，把它加入集合；站点账号会自动用账号 id 作为集合名，并把登录名写进账号。",
          },
            filtered ? null : h(C.Btn, { h: h, kind: "primary", onClick: startCreate }, iconLabel(h, Plus, "新增凭据")))
        : h(P.DataTable, { h: h, label: "凭据列表", columns: columns, rows: rows, renderRow: renderRow }),

    editingS[0] ? h(FormDialog, {
      h: h,
      React: React,
      title: formS[0].id ? "编辑凭据" : "新增凭据",
      titleId: "wbv-secret-form-title",
      bodyClassName: "wbv-modal-body",
      steps: [
        {
          key: "basic", label: "基本信息", hint: "名称与类型",
          render: function (hh) {
            return hh("div", { className: "wbctl-form" },
              hh(C.Field, { h: hh, label: "名称" },
                hh(P.Input, {
                  h: hh,
                  value: formS[0].name,
                  placeholder: "如 工作邮箱 / GitHub",
                  onChange: function (e) { formS[1](Object.assign({}, formS[0], { name: e.target.value })); },
                })),
              hh(C.Field, { h: hh, label: "类型" },
                hh(P.Select, {
                  h: hh,
                  value: formS[0].kind,
                  onChange: function (e) { formS[1](Object.assign({}, formS[0], { kind: e.target.value })); },
                }, K.CREATABLE_KINDS.map(function (k) { return hh("option", { key: k, value: k }, KIND_LABEL[k]); }))));
          },
          validate: function () { return formS[0].name.trim() ? "" : "名称不能为空"; },
        },
        {
          key: "secret", label: "明文", hint: formS[0].id ? "留空不轮换" : "必填",
          render: function (hh) {
            return hh("div", { className: "wbctl-form" },
              hh("div", { className: "full" },
                hh(C.Field, { h: hh, label: formS[0].id ? "新明文（留空不轮换）" : "明文", hint: "明文只在保存时发给保险箱，界面不回显已存值" },
                  hh(SecretField, {
                    h: hh,
                    show: showSecretS[0],
                    value: formS[0].secret,
                    placeholder: formS[0].id ? "不修改请留空" : "密码 / 手机号 / 证件号 / token",
                    onChange: function (v) { formS[1](Object.assign({}, formS[0], { secret: v })); },
                    onToggle: function () { showSecretS[1](!showSecretS[0]); },
                  }))));
          },
          validate: function () { return formS[0].id || formS[0].secret ? "" : "新增凭据必须填写明文"; },
        },
        {
          key: "meta", label: "集合与备注", optional: true,
          render: function (hh) {
            return hh("div", { className: "wbctl-form" },
              hh("div", { className: "full" },
                hh(C.Field, { h: hh, label: "所属集合（可多选）", hint: setsS[0].length ? "勾选后保存时同步挂载/摘除" : "还没有集合，可先在「集合」页新建" },
                  setsS[0].length ? hh("div", { className: "wbv-check-list" }, setsS[0].map(function (s) {
                    var on = (formS[0].setIds || []).indexOf(s.id) >= 0;
                    return hh("label", { key: s.id, className: "wbv-check" },
                      hh("input", { type: "checkbox", checked: on, onChange: function () { toggleSet(s.id); } }),
                      hh("span", { className: "wbv-dot", style: { background: s.color || "var(--wb-accent)" } }),
                      hh("span", null, s.name),
                      hh("span", { className: "wbv-muted" }, " · " + (s.secretCount || 0) + " 条"));
                  })) : hh("span", { className: "wbv-muted" }, "—"))),
              hh("div", { className: "full" },
                hh(C.Field, { h: hh, label: "备注", hint: "非敏感信息（用户名、URL、过期提醒）" },
                  hh(P.Input, {
                    h: hh,
                    value: formS[0].note || "",
                    placeholder: "例如：用户名、URL、过期提醒",
                    onChange: function (e) { formS[1](Object.assign({}, formS[0], { note: e.target.value })); },
                  }))));
          },
        },
      ],
      submitting: busyS[0],
      error: msgS[0],
      onClose: busyS[0] ? null : closeForm,
      onSubmit: function () { save(false); },
      submitText: "保存",
      cancelText: "取消",
      nextText: "下一步",
      backText: "上一步",
    }) : null,

    unlockS[0] ? h(AskPassphrase, {
      h: h,
      React: React,
      C: C,
      title: "解锁保险箱",
      hint: "解锁状态只保存在当前进程内存，空闲超时会自动锁定。",
      label: "主口令",
      value: unlockS[0].value,
      busy: unlockS[0].busy,
      error: unlockS[0].error,
      show: unlockS[0].show,
      onChange: function (v) { unlockS[1](Object.assign({}, unlockS[0], { value: v })); },
      onToggle: function () { unlockS[1](Object.assign({}, unlockS[0], { show: !unlockS[0].show })); },
      onCancel: function () { if (!unlockS[0].busy) unlockS[1](null); },
      onConfirm: confirmUnlock,
    }) : null,

    askS[0] ? h(AskPassphrase, {
      h: h,
      React: React,
      C: C,
      title: "查看凭据明文",
      hint: "当前是 B 模式，查看明文需要再次输入主口令。",
      label: "主口令（" + askS[0].row.name + "）",
      value: askS[0].value,
      busy: askS[0].busy,
      error: askS[0].error,
      show: askS[0].show,
      onChange: function (v) { askS[1](Object.assign({}, askS[0], { value: v })); },
      onToggle: function () { askS[1](Object.assign({}, askS[0], { show: !askS[0].show })); },
      onCancel: function () { if (!askS[0].busy) askS[1](null); },
      onConfirm: confirmPassphrase,
    }) : null,

    revealS[0] ? h(Dialog, {
      h: h,
      React: React,
      title: "凭据明文 · " + revealS[0].name,
      titleId: "wbv-reveal-title",
      onClose: function () { revealS[1](null); },
    },
      h("div", { className: "wbv-modal-body" },
        h("div", { className: "wbv-secret" }, revealS[0].secret),
        h("p", { className: "wbv-modal-sub" }, "明文不会写入日志；复制后请尽快用到目标处。")),
      h("div", { className: "wbv-modal-foot" },
        h(C.Btn, { h: h, onClick: copyRevealed }, "复制"),
        h("span", { className: "wbv-grow" }),
        h(C.Btn, { h: h, onClick: function () { revealS[1](null); } }, "关闭"))) : null,

    delS[0] ? h(ConfirmDialog, {
      h: h,
      React: React,
      title: "删除凭据「" + delS[0].row.name + "」？",
      message: "绑定它的连接器会失效；删除后明文无法恢复。",
      confirmText: "确认删除",
      busyText: "删除中…",
      busy: busyS[0],
      onCancel: function () { if (!busyS[0]) delS[1](null); },
      onConfirm: confirmRemove,
    }) : null);
};

/** 备注：新数据统一用 meta.note；旧数据回退「用户名 · URL」。 */
function noteOf(meta) {
  if (!meta) return "";
  if (meta.note) return String(meta.note);
  return [meta.username, meta.url].filter(Boolean).join(" · ");
}

function emptyForm() {
  return { id: "", name: "", kind: "password", secret: "", setIds: [], note: "" };
}

module.exports.noteOf = noteOf;
