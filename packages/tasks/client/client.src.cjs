// dsh-workbench-tasks 浏览器侧源码。构建：node scripts/build-addon-clients.mjs → lib/client.js
(function () {
  "use strict";

  var host = window.__WB_HOST__;
  if (!host) {
    console.error("[wb-addon-tasks] 宿主桥 window.__WB_HOST__ 不存在，视图未注册");
    module.exports = { name: "dsh-workbench-tasks", inject: [], apply: function () {} };
    return;
  }
  var limits = require('../shared/tree/limits.cjs');
  var React = require("react");
  var h = React.createElement;
  var TagFilter = require("./ui/tagfilter.cjs");
  var WorkspaceFilter = require("./ui/workspacefilter.cjs");
  var statsView = require("./views/stats.cjs");
  var configView = require("./views/config.cjs");
  var dataView = require("./views/data.cjs");
  var actionSchemaView = require("./views/actions.cjs");

  var COPY = require("./ui/copy.cjs");
  // 标签是可选子插件：以宿主已安装/启用列表为准；旧宿主没有列表时返回 true，交给后端降级。
  function hostHasAddon(id) {
    var list = host.addons;
    if (!Array.isArray(list)) return true;
    return list.some(function (a) { return a && a.id === id && a.enabled !== false; });
  }

  var STATUS = {
    "0": { zh: "已开启", en: "Active", cls: "active" },
    "1": { zh: "已关闭", en: "Closed", cls: "shutdown" },
    "2": { zh: "已完成", en: "Done", cls: "done" },
    "3": { zh: "已重启", en: "Restarted", cls: "restarted" },
    "4": { zh: "已接取", en: "Claimed", cls: "claimed" },
  };

  var icons = require("./ui/icons.cjs"), ICONS = icons.ICONS, Icon = icons.Icon;
  var workspaceView = require("./views/workspace-view.cjs")({ React: React, Icon: Icon });
  // 命令页的模板正文复用描述/感受的渲染与切换控件，由入口注入；视图自身保持零 require。
  var commandsView = require("./views/commands.cjs")({
    React: React,
    Icon: Icon,
    Body: require("../../lib/markdown.cjs").createBody(React),
    BodyMode: require("./ui/body-mode.cjs")(React),
    bodyStyles: require("../../lib/body-styles.cjs"),
    bodyCopy: require("../../lib/body-copy.cjs"),
    useConfig: configView.useConfig,
  });
  // 标签页标题左侧图标：宿主统一按 size 14 渲染，两边都传 14 兜底。
  function tabIcon(name) { return function TasksTabIcon() { return React.createElement(Icon, { name: name, size: 14 }); }; }

  // 计划完成倒计时：按秒刷新，超过计划完成时间后转为「逾期 hh:mm:ss」。
  function Countdown(props) {
    var s = React.useState(Date.now());
    var now = s[0];
    var setNow = s[1];
    React.useEffect(function () {
      var id = setInterval(function () { setNow(Date.now()); }, 1000);
      return function () { clearInterval(id); };
    }, []);
    var diff = props.target - now;
    var over = diff < 0;
    var total = Math.floor(Math.abs(diff) / 1000);
    var pad = function (n) { return (n < 10 ? "0" : "") + n; };
    var text = (over ? "逾期 " : "") + pad(Math.floor(total / 3600)) + ":" + pad(Math.floor((total % 3600) / 60)) + ":" + pad(total % 60);
    return h("span", {
      className: "wbt-countdown" + (over ? " overdue" : diff < 3600000 ? " soon" : ""),
      title: over ? "已超过计划完成时间" : "距计划完成",
    }, h(Icon, { name: "clock", size: 11 }), h("span", { className: "wbt-cd-num" }, text));
  }

  var CSS = require("./ui/styles.cjs");

  function injectCss() {
    if (typeof document === "undefined") return;
    var old = document.getElementById("wb-addon-tasks-v2-css");
    if (old) { old.textContent = CSS; return; }
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
    var d = new Date();
    d.setDate(d.getDate() + Number(n || 0));
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }
  function today() {
    var d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }
  function daysBetween(dateText) {
    if (!dateText) return null;
    var d = new Date(String(dateText) + "T00:00:00");
    if (Number.isNaN(d.getTime())) return null;
    var n = new Date();
    n.setHours(0, 0, 0, 0);
    return Math.round((d.getTime() - n.getTime()) / 86400000);
  }
  /** "工作, 开发" → ["工作","开发"]（去空、去重，保留顺序）。 */
  function splitTags(text) {
    var out = [];
    String(text || "").split(/[,，]/).forEach(function (x) {
      var v = String(x).trim();
      if (v && out.indexOf(v) < 0) out.push(v);
    });
    return out;
  }
  function tagNames(task) {
    return (task && task.tags ? task.tags : []).map(function (x) { return String(x.name || ""); }).filter(Boolean);
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
    return treeFlat(nodes).filter(function (n) { return n.type === "1"; });
  }
  function pClass(n) {
    return n >= 6 ? "high" : n >= 3 ? "mid" : "low";
  }
  function stars(n) {
    var v = Number(n || 0);
    var full = Math.floor(v);
    var half = v - full >= 0.5;
    var out = "";
    for (var i = 0; i < full; i++) out += "★";
    if (half) out += "⯪";
    for (var j = full + (half ? 1 : 0); j < 5; j++) out += "☆";
    return out;
  }

  // 路径图标与任务树保持一致：根=屋、组=文件夹、表=表格。
  function pathIcon(type) {
    var code = String(type);
    return code === "1" ? "table" : code === "2" ? "house" : "folder";
  }

  function PathCrumbs(props) {
    var path = props.path || [];
    if (!path.length) return null;
    return h("div", { className: "wbt-path" }, path.map(function (p, i) {
      return h(React.Fragment, { key: p.id + "-" + i },
        i > 0 ? h("span", { className: "sep", children: "›" }) : null,
        h("button", {
          type: "button",
          title: p.name || p.id,
          onClick: function (e) {
            e.stopPropagation();
            if (props.onPick) props.onPick(p, i, path);
          },
        }, h(Icon, { name: pathIcon(p.type), size: 11 }), h("span", null, p.name || p.id))
      );
    }));
  }

  var TaskItem = require("./item/task-item.cjs")({ React: React, statusInfo: statusInfo, stars: stars, pClass: pClass,
    today: today, daysBetween: daysBetween, cx: cx, Icon: Icon, Countdown: Countdown, PathCrumbs: PathCrumbs });

  function TreeNode(props) {
    var node = props.node;
    var t = props.t;
    var expanded = props.expanded;
    var isExpanded = expanded.has(String(node.id));
    var hasKids = node.children && node.children.length > 0;
    var selected = props.selectedTable === String(node.id) || (!props.selectedTable && props.selectedGroup === String(node.id));
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
      return function (e) { e.stopPropagation(); fn(); };
    }
    function drop(e) {
      e.preventDefault();
      e.stopPropagation();
      var src = props.dragId;
      if (!src || String(src) === String(node.id)) return;
      // 任务组（含没有任何子节点的空组）一律接收为子节点；停到任务表上则作为同级插入
      var asChild = !isTable;
      props.onMove(src, node.id, asChild ? 0 : 2);
    }
    return h("div", null,
      h("div", {
        className: cx("wbt-tree-row", selected && "sel", props.dropId === String(node.id) && "drop"),
        style: { paddingLeft: pad + "px" },
        draggable: props.manager && !isRoot,
        onDragStart: function (e) { props.onDragStart(node.id); },
        onDragOver: function (e) { e.preventDefault(); props.onDragOver(node.id); },
        onDrop: drop,
      },
        isTable || !hasKids
          ? h("span", { className: "wbt-tw void" })
          : h("button", { className: "wbt-tw", "aria-label": node.name, "aria-expanded": !!isExpanded, onClick: toggle }, h(Icon, { name: isExpanded ? "down" : "right", size: 12 })),
        h("span", { className: "wbt-ti" }, h(Icon, { name: isRoot ? "house" : isTable ? "table" : isExpanded ? "folderOpen" : "folder", size: 13 })),
        h("div", { className: "wbt-tn", onClick: select, title: node.description ? node.name + "\n" + node.description : node.name },
          editing ? h("input", {
            className: "wbt-input", style: { padding: "2px 6px", fontSize: "12px", width: "150px" },
            value: props.editName, maxLength: limits.NAME_MAX,
            autoFocus: true,
            onClick: function (e) { e.stopPropagation(); },
            onChange: function (e) { props.onEditName(e.target.value); },
            onKeyDown: function (e) {
              if (e.key === "Enter") { e.preventDefault(); props.onRename(node.id, props.editName); }
              if (e.key === "Escape") props.onCancelEdit();
            },
            onBlur: function () { props.onRename(node.id, props.editName); },
          }) : h("span", { className: "nm" }, node.name),
          !editing && node.description ? h("span", { className: "wbt-tdesc" }, String(node.description).replace(/\s+/g, " ")) : null,
          !isTable && hasKids && !editing ? h("span", { className: "wbt-tcnt" }, kids) : null
        ),
        h("div", { className: "wbt-tacts" },
          !isTable ? h("button", { title: t.addGroup, "aria-label": t.addGroup, onClick: stop(function () { props.onAdd(node.id, "0"); }) }, h(Icon, { name: "folderPlus", size: 12 })) : null,
          !isTable ? h("button", { title: t.addTable, "aria-label": t.addTable, onClick: stop(function () { props.onAdd(node.id, "1"); }) }, h(Icon, { name: "filePlus", size: 12 })) : null,
          !isRoot ? h("button", { title: t.rename, "aria-label": t.rename, onClick: stop(function () { props.onEdit(node); }) }, h(Icon, { name: "pencil", size: 12 })) : null,
          props.manager && !isRoot ? h("button", { title: t.del, "aria-label": t.del, className: "wbt-danger", onClick: stop(function () { props.onDelete(node); }) }, h(Icon, { name: "trash", size: 12 })) : null
        )
      ),
      isExpanded && hasKids ? h("div", null, node.children.map(function (kid) {
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
      description: node ? String(node.description || "") : "",
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
      if (!name) { setError(t.needName); return; }
      if (name.length > limits.NAME_MAX) { setError(t === COPY.en ? "Name cannot exceed " + limits.NAME_MAX + " characters" : "名称不能超过 " + limits.NAME_MAX + " 个字符"); return; }
      setBusy(true);
      setError("");
      var desc = String(form.description || "");
      var req = editing
        ? props.api.call("taskNodes.update", { id: node.id, name: name, description: desc })
        : props.api.call("taskNodes.create", { parentId: props.parentId, type: props.type, name: name, description: desc });
      req.then(function (r) {
        if (!r || !r.ok) { setError((r && r.error) || "failed"); setBusy(false); return; }
        props.onSaved(editing ? "update" : "create");
      }).catch(function (e) { setError(String((e && e.message) || e)); setBusy(false); });
    }

    var isTable = String(node ? node.type : props.type) === "1";
    var title = editing ? (isTable ? t.editTable : t.editGroup) : (isTable ? t.addTable : t.addGroup);
    return h("div", { className: "wbt-modal-mask", onMouseDown: function (e) { if (e.target === e.currentTarget) props.onClose(); } },
      h("div", { className: "wbt-modal" },
        h("div", { className: "wbt-modal-head" }, h("h3", null, title), h("button", { className: "wbt-icon", onClick: props.onClose }, "×")),
        h("div", { className: "wbt-form" },
          h("label", { className: "wbt-field full" }, h("span", null, t.nodeName + " *"),
            h("input", { className: "wbt-input", "aria-label": t.nodeName, value: form.name, maxLength: limits.NAME_MAX, autoFocus: true, onChange: function (e) { set("name", e.target.value); } })),
          h("label", { className: "wbt-field full" }, h("span", null, t.nodeDesc),
            h("textarea", { className: "wbt-textarea", rows: 3, value: form.description, placeholder: t.nodeDescPh, onChange: function (e) { set("description", e.target.value); } }))
        ),
        error ? h("div", { className: "wbt-err", role: "alert" }, error) : null,
        h("div", { className: "wbt-modal-foot" },
          h("button", { className: "wbt-btn ghost", onClick: props.onClose }, t.cancel),
          h("button", { className: "wbt-btn primary", disabled: isBusy, onClick: submit }, isBusy ? "…" : (editing ? t.save : t.create))
        )
      )
    );
  }

  var CreateModal = require("./modals/create-modal.cjs")({ React: React, allTables: allTables, tagNames: tagNames, splitTags: splitTags, today: today, addDays: addDays, hostHasAddon: hostHasAddon });

  var TimelineModal = require("./timeline/task-timeline-modal.cjs")(React, statusInfo);

  function DoneModal(props) {
    var t = props.t;
    var s = React.useState(Number(props.task.difficulty) || 0);
    var value = s[0], setValue = s[1];
    var rs = React.useState(String(props.task.review || ""));
    var review = rs[0], setReview = rs[1];
    var busy = React.useState(false);
    var isBusy = busy[0], setBusy = busy[1];
    return h("div", { className: "wbt-modal-mask", onMouseDown: function (e) { if (e.target === e.currentTarget) props.onClose(); } },
      h("div", { className: "wbt-modal", style: { width: "420px" } },
        h("div", { className: "wbt-modal-head" }, h("h3", null, t.complete + " · " + props.task.title), h("button", { className: "wbt-icon", onClick: props.onClose }, "×")),
        h("div", { className: "wbt-mhint" }, t.difficultyHint),
        require("./item/difficulty-field.cjs")(React)(t, value, setValue, "wbt-done-difficulty"),
        h("label", { className: "wbt-field", style: { marginTop: "12px" } },
          h("span", null, t.review + " · " + t.reviewHint),
          h("textarea", { className: "wbt-textarea", rows: 3, placeholder: t.reviewPlaceholder, value: review, onChange: function (e) { setReview(e.target.value); } })
        ),
        h("div", { className: "wbt-modal-foot" },
          h("button", { className: "wbt-btn ghost", onClick: props.onClose }, t.cancel),
          h("button", { className: "wbt-btn primary", disabled: isBusy, onClick: function () {
            var difficulty = Number(value) || 0;
            setBusy(true);
            props.api.call("tasks.update", { id: props.task.id, type: "STATUS", status: "2", date: today(), difficulty: difficulty, review: String(review || "") }).then(function (r) {
              setBusy(false);
              if (r && r.ok) props.onDone();
              else props.onError((r && r.error) || "update failed");
            });
          } }, isBusy ? "…" : t.confirm)
        )
      )
    );
  }

  var EditModal = require("./modals/edit-modal.cjs")(React, statusInfo, stars);

  var BatchModal = require("./modals/batch-modal.cjs")(React, cx, Icon);

  var CFG_FALLBACK = {
    "ui.listView": "list", "ui.expandDepth": 2, "ui.confirmDelete": true, "ui.defaultPreset": "",
    "list.pageSize": 12, "list.sort": "auto",
    "form.defaultPriority": 1, "form.defaultDifficulty": 0, "form.defaultTargetOffset": 0,
    "stats.range": "30d", "stats.top": 10, "stats.showKpi": true,
    "stats.recentPublishLimit": 10, "stats.recentDoneLimit": 10, "stats.recentShutdownLimit": 10,
    "stats.sections": ["trend", "status", "priority", "difficulty", "aging", "overdue", "tables", "groups", "workspaces", "recentPublish", "recentDone", "recentShutdown"],
  };

  var TasksView = require("./views/tasks-view.cjs")({ React: React, configView: configView, CFG_FALLBACK: CFG_FALLBACK, COPY: COPY, injectCss: injectCss, allTables: allTables, findFirstTable: findFirstTable, treeWalk: treeWalk, treeFlat: treeFlat, cx: cx, Icon: Icon, TaskItem: TaskItem, PathCrumbs: PathCrumbs, TagFilter: TagFilter, WorkspaceFilter: WorkspaceFilter, TreeNode: TreeNode, CreateModal: CreateModal, TimelineModal: TimelineModal, NodeModal: NodeModal, EditModal: EditModal, DoneModal: DoneModal, BatchModal: BatchModal });

  var TimelineView = require("./views/timeline-view.cjs")({ React: React, COPY: COPY, injectCss: injectCss, statusInfo: statusInfo, EditModal: EditModal });

  host.registerAddon({
    id: "wb-addon-tasks",
    version: "5.2.6",
    views: [
      { id: "stats", icon: tabIcon("chart"), title: { zh: "统计", en: "Stats" }, component: statsView.TasksStatsView, keepAlive: true },
      { id: "tasks", icon: tabIcon("list"), title: { zh: "记录", en: "Records" }, component: TasksView },
      { id: "timeline", icon: tabIcon("timeline"), title: { zh: "时间线", en: "Timeline" }, component: TimelineView },
      { id: "workspace", icon: tabIcon("folder"), title: { zh: "工作区", en: "Workspaces" }, component: workspaceView.WorkspaceView },
      { id: "config", icon: tabIcon("settings"), title: { zh: "配置", en: "Config" }, component: configView.ConfigView },
      { id: "data", icon: tabIcon("database"), title: { zh: "数据", en: "Data" }, component: dataView.DataView },
      { id: "commands", icon: tabIcon("terminal"), title: { zh: "命令", en: "Commands" }, component: commandsView.CommandsView },
      { id: "actions", icon: tabIcon("code-2"), title: { zh: "Action", en: "Actions" }, component: actionSchemaView.ActionSchemaView },
    ],
  });

  module.exports = { name: "dsh-workbench-tasks", inject: [], apply: function () {} };
})();