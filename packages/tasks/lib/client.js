// wb-addon-tasks 浏览器侧：任务树 / 9 tab / 时间线 / 重启 / 批量迁表。
// 通过 window.__WB_HOST__ 注册，不打包 React。
(function () {
  window.__ModuleLoader__ = window.__ModuleLoader__ || { modules: {}, load: function (m) { this.modules[m.id] = m.factory; } };
  window.__ModuleLoader__.load({
    id: "dsh-workbench-tasks",
    factory: function (require) {
  "use strict";

  var host = window.__WB_HOST__;
  if (!host) {
    console.error("[wb-addon-tasks] 宿主桥 window.__WB_HOST__ 不存在，视图未注册");
    return { name: "dsh-workbench-tasks", inject: [], apply: function () {} };
  }
  var React = host.react;
  var h = host.h;

  var COPY = {
    zh: {
      title: "任务记录", search: "搜索任务标题", newTask: "新建任务", tree: "任务树",
      select: "筛选", cancelSelect: "退出筛选", list: "列表", card: "卡片",
      all: "全部", empty: "这个视图还没有任务", loading: "加载中…",
      error: "操作失败：", save: "保存", cancel: "取消", create: "创建", close: "关闭",
      addGroup: "新建组", addTable: "新建表", rename: "重命名", del: "删除",
      deleteConfirm: "确定删除这个节点及其子树？子树中的任务会被软删除。",
      root: "全部任务组", manager: "管理模式", filterRestarted: "过滤已重启",
      types: "任务类型", publish: "发布", target: "计划完成", done: "实际完成",
      shutdown: "关闭时间", priority: "优先级", difficulty: "难度", desc: "描述",
      status: "状态", type: "类型", publishDate: "发布日期", targetDate: "计划完成日期",
      doneDate: "完成日期", shutdownDate: "关闭日期", table: "任务表", titleField: "标题",
      timeline: "时间线", restart: "重启", complete: "完成", shutdownOp: "关闭",
      selected: "已选", selectedTasks: "选中任务", batchTimeline: "归并时间线",
      batchMigrate: "迁移任务表", refresh: "刷新", clear: "清空",
      chooseBase: "选择基准任务（使用它的时间线）", chooseTable: "选择目标任务表",
      timelineTitle: "任务时间线", newTimeline: "新建时间线任务",
      restartTitle: "重启任务", noTimeline: "这条任务还没有时间线",
      confirm: "确定", difficultyHint: "完成任务前请选择难度（0.5–5）",
      emptyTree: "任务树还没有数据", appear: "显示", hide: "隐藏",
      move: "移动到", source: "来源", page: "页", total: "共", items: "条",
      doneSuccess: "已完成", saved: "已保存", created: "已创建", updated: "已更新",
      deleted: "已删除", needTitle: "标题不能为空", needTable: "请选择任务表",
      needDate: "日期不能为空", needBase: "请选择基准任务", needDifficulty: "请选择难度",
    },
    en: {
      title: "Tasks", search: "Search title", newTask: "New task", tree: "Task tree",
      select: "Select", cancelSelect: "Exit select", list: "List", card: "Cards",
      all: "All", empty: "No tasks in this view", loading: "Loading…",
      error: "Failed: ", save: "Save", cancel: "Cancel", create: "Create", close: "Close",
      addGroup: "New group", addTable: "New table", rename: "Rename", del: "Delete",
      deleteConfirm: "Delete this node and its subtree? Tasks under it will be soft-deleted.",
      root: "All tasks", manager: "Manage", filterRestarted: "Hide restarted",
      types: "Types", publish: "Published", target: "Target", done: "Done",
      shutdown: "Closed", priority: "Priority", difficulty: "Difficulty", desc: "Description",
      status: "Status", type: "Type", publishDate: "Publish date", targetDate: "Target date",
      doneDate: "Done date", shutdownDate: "Close date", table: "Task table", titleField: "Title",
      timeline: "Timeline", restart: "Restart", complete: "Complete", shutdownOp: "Close",
      selected: "Selected", selectedTasks: "Selected tasks", batchTimeline: "Merge timeline",
      batchMigrate: "Move table", refresh: "Refresh", clear: "Clear",
      chooseBase: "Choose a base task (it supplies the timeline)", chooseTable: "Choose target table",
      timelineTitle: "Task timeline", newTimeline: "New timeline task",
      restartTitle: "Restart task", noTimeline: "No timeline for this task",
      confirm: "OK", difficultyHint: "Pick a difficulty (0.5–5) before completing",
      emptyTree: "Task tree is empty", appear: "Show", hide: "Hide",
      move: "Move to", source: "Source", page: "Page", total: "Total", items: "items",
      doneSuccess: "Completed", saved: "Saved", created: "Created", updated: "Updated",
      deleted: "Deleted", needTitle: "Title is required", needTable: "Pick a task table",
      needDate: "Date is required", needBase: "Pick a base task", needDifficulty: "Pick a difficulty",
    },
  };

  var TABS = [
    { id: 0, zh: "紧急任务", en: "Urgent" },
    { id: 1, zh: "工作任务", en: "Work" },
    { id: 2, zh: "生活任务", en: "Life" },
    { id: 3, zh: "学习任务", en: "Study" },
    { id: 4, zh: "开发任务", en: "Dev" },
    { id: 5, zh: "已关闭", en: "Closed" },
    { id: 6, zh: "已开启", en: "Active" },
    { id: 7, zh: "已完成", en: "Done" },
    { id: 8, zh: "总览", en: "Overview" },
  ];
  var TYPES = [
    { id: "0", zh: "工作", en: "Work", icon: "▣" },
    { id: "1", zh: "生活", en: "Life", icon: "⌂" },
    { id: "2", zh: "学习", en: "Study", icon: "▤" },
    { id: "3", zh: "开发", en: "Dev", icon: "⌘" },
  ];
  var STATUS = {
    "0": { zh: "已开启", en: "Active", cls: "active" },
    "1": { zh: "已关闭", en: "Closed", cls: "shutdown" },
    "2": { zh: "已完成", en: "Done", cls: "done" },
    "3": { zh: "已重启", en: "Restarted", cls: "restarted" },
  };

  var CSS = [
    ".wbt-root{--wbt-line:var(--dsw-alias-border-l2,color-mix(in oklab,currentColor 16%,transparent));--wbt-surface:var(--dsw-alias-bg-layer-1,color-mix(in oklab,currentColor 4%,transparent));--wbt-bg:var(--dsw-alias-bg-layer-1,var(--dsw-alias-bg-base,#fff));--wbt-accent:var(--dsw-alias-accent,#11a89b);display:flex;flex-direction:column;gap:10px;min-height:0;color:inherit;font-size:13px}",
    ".wbt-top{display:flex;align-items:center;gap:10px;flex-wrap:wrap}",
    ".wbt-top h2{margin:0;font-size:16px;font-weight:680;letter-spacing:.2px}",
    ".wbt-pathrow{display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding:0 0 2px}",
    ".wbt-grow{flex:1;min-width:0}",
    ".wbt-btn{border:1px solid var(--wbt-line);background:var(--wbt-surface);color:inherit;border-radius:8px;padding:6px 11px;font-size:12.5px;cursor:pointer;white-space:nowrap;line-height:1.3}",
    ".wbt-btn:hover{border-color:var(--wbt-accent)}",
    ".wbt-btn.primary{background:var(--wbt-accent);border-color:var(--wbt-accent);color:#fff;font-weight:600}",
    ".wbt-btn.ghost{background:transparent}",
    ".wbt-btn.danger{color:#e5484d;border-color:color-mix(in oklab,#e5484d 45%,transparent)}",
    ".wbt-btn:disabled{opacity:.5;cursor:not-allowed}",
    ".wbt-input,.wbt-select,.wbt-textarea{border:1px solid var(--wbt-line);background:transparent;color:inherit;border-radius:8px;padding:7px 10px;font-size:13px;outline:none;min-width:0}",
    ".wbt-input:focus,.wbt-select:focus,.wbt-textarea:focus{border-color:var(--wbt-accent)}",
    ".wbt-search{width:220px;max-width:46vw}",
    ".wbt-body{display:flex;gap:14px;align-items:flex-start;min-height:0;flex:1}",
    ".wbt-nav{display:flex;flex-direction:column;gap:2px;flex:0 0 138px;width:138px;padding:3px 0;border-right:1px solid var(--wbt-line)}",
    ".wbt-content{flex:1;min-width:0;display:flex;flex-direction:column;gap:8px}",
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
    ".wbt-list{display:flex;flex-direction:column;gap:8px;min-height:0}",
    ".wbt-item{display:flex;gap:10px;align-items:flex-start;border:1px solid var(--wbt-line);border-radius:11px;background:var(--wbt-surface);padding:10px 12px;min-height:0}",
    ".wbt-item.done{opacity:.62}",
    ".wbt-item.done .wbt-title{text-decoration:line-through}",
    ".wbt-main{flex:1;min-width:0;display:flex;flex-direction:column;gap:5px}",
    ".wbt-line1{display:flex;align-items:center;gap:7px;min-width:0}",
    ".wbt-title{font-weight:600;font-size:13.5px;line-height:1.4;word-break:break-word}",
    ".wbt-desc{font-size:12px;opacity:.62;line-height:1.5;word-break:break-word;white-space:pre-wrap}",
    ".wbt-meta{display:flex;gap:10px;flex-wrap:wrap;font-size:11.5px;opacity:.6}",
    ".wbt-meta b{font-weight:600;opacity:.85}",
    ".wbt-path{display:flex;gap:4px;flex-wrap:wrap;align-items:center;font-size:12px;opacity:.72}",
    ".wbt-path button{border:none;background:none;color:inherit;padding:2px 3px;border-radius:5px;cursor:pointer;font-size:12px}",
    ".wbt-path button:hover{background:color-mix(in oklab,currentColor 8%,transparent)}",
    ".wbt-path button:hover{text-decoration:underline}",
    ".wbt-prio{font-size:10.5px;font-weight:700;padding:2px 6px;border-radius:999px;border:1px solid currentColor;opacity:.85;flex:none;font-variant-numeric:tabular-nums}",
    ".wbt-prio.high{color:#e5484d}.wbt-prio.mid{color:#f76b15}.wbt-prio.low{color:#8a93a2}",
    ".wbt-type{min-width:23px;height:23px;padding:0 6px;box-sizing:border-box;border-radius:7px;display:inline-flex;align-items:center;justify-content:center;border:1px solid var(--wbt-line);flex:none;font-size:10.5px;font-weight:600;line-height:1;white-space:nowrap;opacity:.8}",
    ".wbt-badge{font-size:10.5px;padding:1px 6px;border-radius:999px;border:1px solid var(--wbt-line);opacity:.72;white-space:nowrap}",
    ".wbt-badge.active{color:var(--wbt-accent);border-color:color-mix(in oklab,var(--wbt-accent) 45%,transparent)}",
    ".wbt-badge.done{color:#2f9e44;border-color:color-mix(in oklab,#2f9e44 45%,transparent)}",
    ".wbt-badge.shutdown{color:#8a93a2}.wbt-badge.restarted{color:#7048e8}",
    ".wbt-ops{display:flex;gap:4px;align-items:center;flex-wrap:wrap;flex:none}",
    ".wbt-icon{border:1px solid var(--wbt-line);background:transparent;color:inherit;width:26px;height:26px;border-radius:7px;cursor:pointer;font-size:13px;line-height:1;display:inline-flex;align-items:center;justify-content:center;flex:none}",
    ".wbt-icon:hover{border-color:var(--wbt-accent);color:var(--wbt-accent)}",
    ".wbt-icon.danger:hover{border-color:#e5484d;color:#e5484d}",
    ".wbt-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:8px}",
    ".wbt-card{display:flex;flex-direction:column;gap:6px;min-height:150px}",
    ".wbt-card .wbt-ops{margin-top:auto}",
    ".wbt-empty{border:1px dashed var(--wbt-line);border-radius:11px;padding:34px 12px;text-align:center;opacity:.5;font-size:12.5px}",
    ".wbt-err{font-size:12.5px;color:#e5484d;line-height:1.5}",
    ".wbt-pager{display:flex;gap:8px;align-items:center;justify-content:flex-end;font-size:12px;opacity:.8;flex-wrap:wrap}",
    ".wbt-drawer-mask{position:fixed;inset:0;background:rgba(0,0,0,.22);z-index:800;display:flex}",
    ".wbt-drawer{width:440px;max-width:92vw;height:100%;background:var(--wbt-bg);border-right:1px solid var(--wbt-line);display:flex;flex-direction:column;box-shadow:0 12px 40px rgba(0,0,0,.22)}",
    ".wbt-drawer-head{display:flex;align-items:center;gap:8px;padding:12px 14px;border-bottom:1px solid var(--wbt-line)}",
    ".wbt-drawer-body{flex:1;overflow:auto;padding:8px 10px 20px}",
    ".wbt-drawer-foot{padding:9px 13px;border-top:1px solid var(--wbt-line);font-size:11.5px;opacity:.55}",
    ".wbt-tree-row{display:flex;align-items:center;gap:3px;border-radius:7px;padding:2px 3px;min-height:29px}",
    ".wbt-tree-row:hover{background:color-mix(in oklab,currentColor 7%,transparent)}",
    ".wbt-tree-row.sel{background:color-mix(in oklab,var(--wbt-accent) 14%,transparent)}",
    ".wbt-tree-row.drop{outline:1px dashed var(--wbt-accent);outline-offset:-1px}",
    ".wbt-tw{width:18px;height:22px;border:none;background:none;color:inherit;cursor:pointer;opacity:.6;flex:none;font-size:10px}",
    ".wbt-tn{flex:1;min-width:0;display:flex;align-items:center;gap:5px;cursor:pointer;font-size:12.5px;padding:2px 0}",
    ".wbt-tn .nm{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
    ".wbt-tacts{display:flex;gap:1px;opacity:0;flex:none}",
    ".wbt-tree-row:hover .wbt-tacts{opacity:.9}",
    ".wbt-tacts button{border:none;background:none;color:inherit;cursor:pointer;font-size:10.5px;padding:2px 3px;border-radius:4px;opacity:.7}",
    ".wbt-tacts button:hover{background:color-mix(in oklab,currentColor 10%,transparent);opacity:1}",
    ".wbt-modal-mask{position:fixed;inset:0;background:rgba(0,0,0,.28);z-index:1000;display:flex;align-items:center;justify-content:center;padding:16px}",
    ".wbt-modal{width:560px;max-width:96vw;max-height:90vh;overflow:auto;background:var(--wbt-bg);border:1px solid var(--wbt-line);border-radius:14px;box-shadow:0 20px 60px rgba(0,0,0,.3);padding:15px 17px;display:flex;flex-direction:column;gap:11px}",
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
    ".wbt-selbar{position:fixed;left:50%;bottom:16px;transform:translateX(-50%);z-index:900;display:flex;gap:8px;align-items:center;background:var(--wbt-bg);border:1px solid var(--wbt-line);box-shadow:0 10px 34px rgba(0,0,0,.24);border-radius:12px;padding:8px 11px;max-width:94vw;flex-wrap:wrap}",
    ".wbt-toast{position:fixed;left:50%;bottom:70px;transform:translateX(-50%);z-index:1100;background:#1f2328;color:#fff;border-radius:9px;padding:8px 14px;font-size:12.5px;box-shadow:0 8px 24px rgba(0,0,0,.25);max-width:90vw;text-align:center}",
    ".wbt-stars{color:#f59f00;font-size:11px;letter-spacing:.5px;white-space:nowrap}",
    ".wbt-sum{display:flex;gap:5px;flex-wrap:wrap;font-size:11px;opacity:.55}",
    ".wbt-nowrap{white-space:nowrap}",
    ".wbt-row{display:flex;gap:6px;align-items:center;flex-wrap:wrap}",
    ".wbt-split{display:flex;gap:12px;align-items:flex-start}",
    ".wbt-col{flex:1;min-width:0}",
    ".wbt-mono{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11px}",
    ".wbt-pill{font-size:11px;padding:2px 7px;border-radius:999px;background:color-mix(in oklab,var(--wbt-accent) 12%,transparent);color:var(--wbt-accent)}",
    ".wbt-hint{font-size:11.5px;opacity:.55;line-height:1.5}",
    ".wbt-danger{color:#e5484d}",
    "@media (max-width:760px){.wbt-body{flex-direction:column;gap:8px}.wbt-nav{flex-direction:row;width:100%;flex:0 0 auto;overflow-x:auto;border-right:none;border-bottom:1px solid var(--wbt-line);padding:0 0 6px}.wbt-tab{width:auto;white-space:nowrap;padding:6px 9px}.wbt-tab.on{box-shadow:inset 0 -2px 0 var(--wbt-accent)}.wbt-nav-sep{width:1px;height:18px;flex:none;margin:auto 4px}.wbt-pathrow .wbt-search{flex:1 1 160px;max-width:none}}",
    "@media (max-width:640px){.wbt-form{grid-template-columns:1fr}.wbt-drawer{width:94vw}.wbt-search{width:100%}.wbt-top h2{font-size:15px}.wbt-item{padding:9px}.wbt-ops{width:100%;justify-content:flex-end}}",
  ].join("\n");

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
  function typeInfo(id) {
    for (var i = 0; i < TYPES.length; i++) if (TYPES[i].id === String(id)) return TYPES[i];
    return TYPES[0];
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

  function PathCrumbs(props) {
    var path = props.path || [];
    if (!path.length) return null;
    return h("div", { className: "wbt-path" }, path.map(function (p, i) {
      return h(React.Fragment, { key: p.id + "-" + i },
        i > 0 ? h("span", { className: "sep", children: "›" }) : null,
        h("button", {
          type: "button",
          onClick: function (e) {
            e.stopPropagation();
            if (props.onPick) props.onPick(p, i, path);
          },
        }, p.name || p.id)
      );
    }));
  }

  function TaskItem(props) {
    var t = props.t;
    var task = props.task;
    var st = statusInfo(task.status);
    var ti = typeInfo(task.type);
    var typeName = props.lang === "en" ? ti.en : ti.zh;
    var isActive = String(task.status) === "0";
    var titleState = React.useState(null);
    var editingTitle = titleState[0], setEditingTitle = titleState[1];
    var descState = React.useState(null);
    var editingDesc = descState[0], setEditingDesc = descState[1];
    var titleRef = React.useRef(null);
    var descRef = React.useRef(null);

    React.useEffect(function () {
      if (editingTitle !== null && titleRef.current) titleRef.current.focus();
    }, [editingTitle]);
    React.useEffect(function () {
      if (editingDesc !== null && descRef.current) descRef.current.focus();
    }, [editingDesc]);

    function beginTitle() {
      if (!isActive) return;
      setEditingTitle(String(task.title || ""));
    }
    function saveTitle() {
      if (editingTitle === null) return;
      var v = String(editingTitle).trim();
      if (!v) {
        props.toast(t.needTitle);
        setEditingTitle(null);
        return;
      }
      if (v !== String(task.title || "")) props.update(task, { type: "TITLE", title: v });
      setEditingTitle(null);
    }
    function beginDesc() {
      if (!isActive) return;
      setEditingDesc(String(task.description || ""));
    }
    function saveDesc() {
      if (editingDesc === null) return;
      if (String(editingDesc) !== String(task.description || "")) {
        props.update(task, { type: "DESCRIPTION", description: String(editingDesc) });
      }
      setEditingDesc(null);
    }

    var countdown = String(task.status) === "0" ? daysBetween(task.targetDate) : null;
    var meta = [];
    if (task.publishDate) meta.push(h("span", { key: "p" }, h("b", null, t.publish), " ", task.publishDate));
    if (String(task.status) === "0" && task.targetDate) {
      meta.push(h("span", { key: "g" }, h("b", null, t.target), " ", task.targetDate,
        countdown !== null ? h("span", { className: countdown <= 1 ? "wbt-danger" : "", children: "（" + (countdown < 0 ? "已逾期" : "剩 " + countdown + " 天") + "）" }) : null));
    } else if (String(task.status) === "2") {
      if (task.targetDate) meta.push(h("span", { key: "g" }, h("b", null, t.target), " ", task.targetDate));
      if (task.doneDate) meta.push(h("span", { key: "d" }, h("b", null, t.done), " ", task.doneDate));
      meta.push(h("span", { key: "s", className: "wbt-stars", children: stars(task.difficulty) + " " + Number(task.difficulty || 0).toFixed(1) }));
    } else {
      if (task.targetDate) meta.push(h("span", { key: "g" }, h("b", null, t.target), " ", task.targetDate));
      if (task.shutdownDate) meta.push(h("span", { key: "s" }, h("b", null, t.shutdown), " ", task.shutdownDate));
    }

    var ops = [];
    if (isActive) {
      ops.push(h("button", { key: "p+", className: "wbt-icon", title: t.priority + " +1", onClick: function () { if (task.priority < 10) props.update(task, { type: "PRIORITY", priority: Number(task.priority) + 1 }); } }, "＋"));
      ops.push(h("button", { key: "p-", className: "wbt-icon", title: t.priority + " -1", onClick: function () { if (task.priority > 0) props.update(task, { type: "PRIORITY", priority: Number(task.priority) - 1 }); } }, "－"));
      ops.push(h("button", { key: "done", className: "wbt-btn", onClick: function () { props.onDone(task); } }, "✓ " + t.complete));
      ops.push(h("button", { key: "shut", className: "wbt-btn", onClick: function () { props.update(task, { type: "STATUS", status: "1", date: today() }); } }, "■ " + t.shutdownOp));
    }
    ops.push(h("button", { key: "restart", className: "wbt-btn ghost", onClick: function () { props.onRestart(task); } }, "↻ " + t.restart));
    ops.push(h("button", { key: "timeline", className: "wbt-btn ghost", onClick: function () { props.onTimeline(task); } }, "☰ " + t.timeline));

    var titleNode = editingTitle !== null
      ? h("input", {
          ref: titleRef, className: "wbt-input", style: { fontSize: "13px", padding: "4px 7px" },
          value: editingTitle,
          onChange: function (e) { setEditingTitle(e.target.value); },
          onKeyDown: function (e) {
            if (e.key === "Enter") { e.preventDefault(); saveTitle(); }
            if (e.key === "Escape") setEditingTitle(null);
          },
          onBlur: saveTitle,
        })
      : h("div", { className: "wbt-title", onDoubleClick: beginTitle, title: isActive ? "双击编辑标题" : "" }, task.title);

    var descNode = editingDesc !== null
      ? h("textarea", {
          ref: descRef, className: "wbt-textarea", rows: 2,
          value: editingDesc,
          onChange: function (e) { setEditingDesc(e.target.value); },
          onKeyDown: function (e) {
            if (e.key === "Escape") setEditingDesc(null);
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); saveDesc(); }
          },
          onBlur: saveDesc,
        })
      : (task.description ? h("div", { className: "wbt-desc", onDoubleClick: beginDesc }, task.description) : (isActive ? h("div", { className: "wbt-desc", style: { opacity: .35 }, onDoubleClick: beginDesc }, "＋ " + t.desc) : null));

    return h("div", { className: cx("wbt-item", props.card && "wbt-card", String(task.status) === "2" && "done") },
      props.selectionMode ? h("input", { type: "checkbox", className: "wbt-check", checked: !!props.checked, onChange: function () { props.onCheck(task.id); } }) : null,
      h("div", { className: "wbt-type", title: typeName, "aria-label": typeName }, typeName),
      h("div", { className: "wbt-main" },
        h("div", { className: "wbt-line1" },
          h("span", { className: "wbt-prio " + pClass(task.priority), children: "P" + task.priority }),
          h("span", { className: "wbt-badge " + st.cls, children: st.zh }),
          titleNode
        ),
        descNode,
        meta.length ? h("div", { className: "wbt-meta" }, meta) : null,
        h(PathCrumbs, { path: task.path, t: t, onPick: props.onPathPick })
      ),
      h("div", { className: "wbt-ops" }, ops)
    );
  }

  function TreeNode(props) {
    var node = props.node;
    var t = props.t;
    var expanded = props.expanded;
    var isExpanded = expanded.has(String(node.id));
    var hasKids = node.children && node.children.length > 0;
    var selected = props.selectedTable === String(node.id) || (!props.selectedTable && props.selectedGroup === String(node.id));
    var isTable = String(node.type) === "1";
    var isRoot = String(node.parent) === "0" || String(node.parentId) === "0";
    var pad = 4 + (props.depth || 0) * 13;
    var editing = props.edit && String(props.edit.id) === String(node.id);

    function toggle(e) {
      e.stopPropagation();
      props.onToggle(node.id);
    }
    function select() {
      props.onSelect(node);
    }
    function drop(e) {
      e.preventDefault();
      e.stopPropagation();
      var src = props.dragId;
      if (!src || String(src) === String(node.id)) return;
      var asChild = !isTable && isExpanded;
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
        h("button", { className: "wbt-tw", onClick: toggle, style: { visibility: isTable ? "hidden" : "visible" } }, isExpanded ? "▾" : "▸"),
        h("div", { className: "wbt-tn", onClick: select, title: node.name },
          h("span", { style: { opacity: .65, fontSize: "10px" }, children: isRoot ? "◆" : isTable ? "▤" : "▸" }),
          editing ? h("input", {
            className: "wbt-input", style: { padding: "2px 5px", fontSize: "12px", width: "130px" },
            value: props.editName,
            autoFocus: true,
            onClick: function (e) { e.stopPropagation(); },
            onChange: function (e) { props.onEditName(e.target.value); },
            onKeyDown: function (e) {
              if (e.key === "Enter") { e.preventDefault(); props.onRename(node.id, props.editName); }
              if (e.key === "Escape") props.onCancelEdit();
            },
            onBlur: function () { props.onRename(node.id, props.editName); },
          }) : h("span", { className: "nm" }, node.name)
        ),
        h("div", { className: "wbt-tacts" },
          !isTable ? h("button", { title: t.addGroup, onClick: function (e) { e.stopPropagation(); props.onAdd(node.id, "0"); } }, "＋组") : null,
          !isTable ? h("button", { title: t.addTable, onClick: function (e) { e.stopPropagation(); props.onAdd(node.id, "1"); } }, "＋表") : null,
          !isRoot ? h("button", { title: t.rename, onClick: function (e) { e.stopPropagation(); props.onEdit(node); } }, "✎") : null,
          props.manager && !isRoot ? h("button", { title: t.del, className: "wbt-danger", onClick: function (e) { e.stopPropagation(); props.onDelete(node); } }, "×") : null
        )
      ),
      isExpanded && hasKids ? h("div", null, node.children.map(function (kid) {
        return h(TreeNode, Object.assign({}, props, { key: kid.id, node: kid, depth: (props.depth || 0) + 1 }));
      })) : null
    );
  }

  function CreateModal(props) {
    var t = props.t;
    var source = props.source || "0";
    var origin = props.originTask || null;
    var tables = allTables(props.tree);
    var first = props.defaultTableId || (origin && origin.tableId) || (tables[0] && tables[0].id) || "";
    var initType = origin ? String(origin.type || "0") : "0";
    var initTable = origin ? String(origin.tableId || first) : String(first);
    var f = React.useState({
      title: "", description: "",
      type: initType, status: "0", priority: 1, difficulty: 1,
      publishDate: today(), targetDate: today(), doneDate: today(), shutdownDate: today(),
      tableId: initTable,
    });
    var form = f[0], setForm = f[1];
    var busy = React.useState(false);
    var isBusy = busy[0], setBusy = busy[1];
    var err = React.useState("");
    var error = err[0], setError = err[1];

    function set(k, v) {
      var next = Object.assign({}, form);
      next[k] = v;
      if (k === "type" && source === "0") {
        var defaults = { "0": 8, "1": 6, "2": 4, "3": 2 };
        next.priority = defaults[v] !== undefined ? defaults[v] : 1;
      }
      setForm(next);
    }
    function submit() {
      if (!String(form.title).trim()) { setError(t.needTitle); return; }
      if (!form.tableId) { setError(t.needTable); return; }
      if (!form.publishDate || !form.targetDate) { setError(t.needDate); return; }
      setBusy(true); setError("");
      var args = {
        title: String(form.title).trim(),
        description: String(form.description || ""),
        type: String(form.type), status: source === "2" ? "0" : String(form.status),
        priority: Number(form.priority) || 0,
        tableId: String(form.tableId),
        publishDate: form.publishDate,
        targetDate: form.targetDate,
        source: source,
      };
      if (source !== "0" && origin) {
        args.timelineKey = String(origin.timelineKey || origin.id);
        args.restartKey = source === "2" ? String(origin.id) : undefined;
      }
      if (args.status === "2") {
        args.doneDate = form.doneDate || today();
        args.difficulty = Number(form.difficulty) || 0;
      }
      if (args.status === "1") args.shutdownDate = form.shutdownDate || today();
      props.api.call("tasks.create", args).then(function (r) {
        if (!r || !r.ok) { setError((r && r.error) || "create failed"); setBusy(false); return; }
        props.onCreated();
      }).catch(function (e) { setError(String(e && e.message || e)); setBusy(false); });
    }

    var title = source === "2" ? t.restartTitle : source === "1" ? t.newTimeline : t.newTask;
    return h("div", { className: "wbt-modal-mask", onMouseDown: function (e) { if (e.target === e.currentTarget) props.onClose(); } },
      h("div", { className: "wbt-modal" },
        h("div", { className: "wbt-modal-head" }, h("h3", null, title), h("button", { className: "wbt-icon", onClick: props.onClose }, "×")),
        source !== "0" && origin ? h("div", { className: "wbt-hint" }, "来源：" + (origin.title || origin.id) + (source === "2" ? " · 重启链 " + (origin.restartKey || origin.id) : " · 时间线 " + (origin.timelineKey || origin.id))) : null,
        h("div", { className: "wbt-form" },
          h("label", { className: "wbt-field full" }, h("span", null, t.titleField + " *"), h("input", { className: "wbt-input", value: form.title, onChange: function (e) { set("title", e.target.value); }, autoFocus: true })),
          h("label", { className: "wbt-field full" }, h("span", null, t.desc), h("textarea", { className: "wbt-textarea", rows: 2, value: form.description, onChange: function (e) { set("description", e.target.value); } })),
          h("label", { className: "wbt-field" }, h("span", null, t.type), h("select", { className: "wbt-select", value: form.type, onChange: function (e) { set("type", e.target.value); } }, TYPES.map(function (x) { return h("option", { key: x.id, value: x.id }, x.zh); }))),
          h("label", { className: "wbt-field" }, h("span", null, t.status), h("select", { className: "wbt-select", value: source === "2" ? "0" : form.status, disabled: source === "2", onChange: function (e) { set("status", e.target.value); } },
            h("option", { value: "0" }, "已开启"), h("option", { value: "2" }, "已完成"), h("option", { value: "1" }, "已关闭"))),
          h("label", { className: "wbt-field" }, h("span", null, t.priority + "（0–10）"), h("input", { className: "wbt-input", type: "number", min: 0, max: 10, value: form.priority, onChange: function (e) { set("priority", e.target.value); } })),
          h("label", { className: "wbt-field" }, h("span", null, t.table + " *"), h("select", { className: "wbt-select", value: form.tableId, onChange: function (e) { set("tableId", e.target.value); } }, tables.map(function (x) { return h("option", { key: x.id, value: x.id }, "　".repeat(x.depth) + x.name); }))),
          h("label", { className: "wbt-field" }, h("span", null, t.publishDate), h("input", { className: "wbt-input", type: "date", value: form.publishDate, onChange: function (e) { set("publishDate", e.target.value); } })),
          h("label", { className: "wbt-field" }, h("span", null, t.targetDate), h("input", { className: "wbt-input", type: "date", value: form.targetDate, onChange: function (e) { set("targetDate", e.target.value); } })),
          (source !== "2" && form.status === "2") ? h("label", { className: "wbt-field" }, h("span", null, t.doneDate), h("input", { className: "wbt-input", type: "date", value: form.doneDate, onChange: function (e) { set("doneDate", e.target.value); } })) : null,
          (source !== "2" && form.status === "2") ? h("label", { className: "wbt-field" }, h("span", null, t.difficulty + "（0–5）"), h("input", { className: "wbt-input", type: "number", min: 0, max: 5, step: 0.5, value: form.difficulty, onChange: function (e) { set("difficulty", e.target.value); } })) : null,
          (source !== "2" && form.status === "1") ? h("label", { className: "wbt-field" }, h("span", null, t.shutdownDate), h("input", { className: "wbt-input", type: "date", value: form.shutdownDate, onChange: function (e) { set("shutdownDate", e.target.value); } })) : null
        ),
        error ? h("div", { className: "wbt-err" }, error) : null,
        h("div", { className: "wbt-modal-foot" },
          h("button", { className: "wbt-btn ghost", onClick: props.onClose }, t.cancel),
          h("button", { className: "wbt-btn primary", disabled: isBusy, onClick: submit }, isBusy ? "…" : t.create)
        )
      )
    );
  }

  function TimelineModal(props) {
    var t = props.t;
    var task = props.task;
    var s = React.useState({ items: [], loading: true, error: "" });
    var state = s[0], setState = s[1];
    React.useEffect(function () {
      props.api.call("tasks.timeline", { timelineKey: task.timelineKey }).then(function (r) {
        if (r && r.ok) setState({ items: Array.isArray(r.result) ? r.result : [], loading: false, error: "" });
        else setState({ items: [], loading: false, error: (r && r.error) || "load failed" });
      }).catch(function (e) { setState({ items: [], loading: false, error: String(e && e.message || e) }); });
    }, [task.timelineKey]);
    var items = state.items;
    var last = items.length ? items[items.length - 1] : task;
    return h("div", { className: "wbt-modal-mask", onMouseDown: function (e) { if (e.target === e.currentTarget) props.onClose(); } },
      h("div", { className: "wbt-modal wide" },
        h("div", { className: "wbt-modal-head" },
          h("h3", null, t.timelineTitle),
          h("button", { className: "wbt-btn", onClick: function () { props.onCreateTimeline(last); } }, "＋ " + t.newTimeline),
          h("button", { className: "wbt-icon", onClick: props.onClose }, "×")
        ),
        state.loading ? h("div", { className: "wbt-hint" }, t.loading) : state.error ? h("div", { className: "wbt-err" }, t.error + state.error) : (items.length === 0 ? h("div", { className: "wbt-empty" }, t.noTimeline) : h("div", { className: "wbt-timeline" }, items.map(function (x, i) {
          var st = statusInfo(x.status);
          return h("div", { className: "wbt-tl-item", key: x.id },
            h("div", { className: "wbt-tl-rail" }, h("div", { className: "wbt-tl-dot" }), i < items.length - 1 ? h("div", { className: "wbt-tl-line" }) : null),
            h("div", { className: "wbt-tl-body" },
              h("div", { className: "wbt-row" },
                h("span", { className: "wbt-badge " + st.cls }, st.zh),
                h("span", { className: "wbt-tl-title" }, x.title),
                h("span", { className: "wbt-pill" }, "P" + x.priority)
              ),
              h("div", { className: "wbt-tl-meta" },
                h("span", null, "发布 " + (x.publishDate || "-")),
                h("span", null, "计划 " + (x.targetDate || "-")),
                x.doneDate ? h("span", null, "完成 " + x.doneDate) : null,
                x.shutdownDate ? h("span", null, "关闭 " + x.shutdownDate) : null
              ),
              h(PathCrumbs, { path: x.path })
            )
          );
        })))
      )
    );
  }

  function DoneModal(props) {
    var t = props.t;
    var s = React.useState(1);
    var value = s[0], setValue = s[1];
    var busy = React.useState(false);
    var isBusy = busy[0], setBusy = busy[1];
    return h("div", { className: "wbt-modal-mask", onMouseDown: function (e) { if (e.target === e.currentTarget) props.onClose(); } },
      h("div", { className: "wbt-modal", style: { width: "380px" } },
        h("div", { className: "wbt-modal-head" }, h("h3", null, t.complete + " · " + props.task.title), h("button", { className: "wbt-icon", onClick: props.onClose }, "×")),
        h("div", { className: "wbt-hint" }, t.difficultyHint),
        h("div", { className: "wbt-row" },
          h("span", { className: "wbt-stars", style: { fontSize: "22px" } }, stars(value)),
          h("input", { type: "range", min: 0.5, max: 5, step: 0.5, value: value, onChange: function (e) { setValue(Number(e.target.value)); }, style: { flex: 1 } }),
          h("b", null, value.toFixed(1))
        ),
        h("div", { className: "wbt-modal-foot" },
          h("button", { className: "wbt-btn ghost", onClick: props.onClose }, t.cancel),
          h("button", { className: "wbt-btn primary", disabled: isBusy, onClick: function () {
            if (!value || value <= 0) return;
            setBusy(true);
            props.api.call("tasks.update", { id: props.task.id, type: "STATUS", status: "2", date: today(), difficulty: value }).then(function (r) {
              setBusy(false);
              if (r && r.ok) props.onDone();
              else props.onError((r && r.error) || "update failed");
            });
          } }, isBusy ? "…" : t.confirm)
        )
      )
    );
  }

  function BatchModal(props) {
    var t = props.t;
    var items = props.items || [];
    var mode = props.mode;
    var s = React.useState(mode === "timeline" ? (items[0] && items[0].id) || "" : (props.tables[0] && props.tables[0].id) || "");
    var value = s[0], setValue = s[1];
    var busy = React.useState(false);
    var isBusy = busy[0], setBusy = busy[1];
    var err = React.useState("");
    var error = err[0], setError = err[1];
    return h("div", { className: "wbt-modal-mask", onMouseDown: function (e) { if (e.target === e.currentTarget) props.onClose(); } },
      h("div", { className: "wbt-modal" },
        h("div", { className: "wbt-modal-head" }, h("h3", null, mode === "timeline" ? t.batchTimeline : t.batchMigrate), h("button", { className: "wbt-icon", onClick: props.onClose }, "×")),
        h("div", { className: "wbt-hint" }, mode === "timeline" ? t.chooseBase : t.chooseTable),
        mode === "timeline"
          ? h("div", { className: "wbt-list" }, items.map(function (x) {
              return h("label", { key: x.id, className: "wbt-check", style: { padding: "6px 2px" } },
                h("input", { type: "radio", name: "base", checked: String(value) === String(x.id), onChange: function () { setValue(String(x.id)); } }),
                h("span", null, x.title + "（timeline " + (x.timelineKey || "-") + "）")
              );
            }))
          : h("select", { className: "wbt-select", value: value, onChange: function (e) { setValue(e.target.value); } }, props.tables.map(function (x) {
              return h("option", { key: x.id, value: x.id }, "　".repeat(x.depth) + x.name);
            })),
        error ? h("div", { className: "wbt-err" }, error) : null,
        h("div", { className: "wbt-modal-foot" },
          h("button", { className: "wbt-btn ghost", onClick: props.onClose }, t.cancel),
          h("button", { className: "wbt-btn primary", disabled: isBusy, onClick: function () {
            if (!value) { setError(mode === "timeline" ? t.needBase : t.needTable); return; }
            setBusy(true);
            if (mode === "timeline") {
              var base = null;
              for (var i = 0; i < items.length; i++) if (String(items[i].id) === String(value)) base = items[i];
              if (!base || !base.timelineKey) { setError(t.needBase); setBusy(false); return; }
              props.api.call("tasks.timelineRefactor", { ids: items.map(function (x) { return x.id; }), timelineKey: base.timelineKey }).then(function (r) {
                setBusy(false);
                if (r && r.ok) props.onDone();
                else setError((r && r.error) || "failed");
              });
            } else {
              props.api.call("tasks.migrate", { ids: items.map(function (x) { return x.id; }), tableId: value }).then(function (r) {
                setBusy(false);
                if (r && r.ok) props.onDone();
                else setError((r && r.error) || "failed");
              });
            }
          } }, isBusy ? "…" : t.confirm)
        )
      )
    );
  }

  function TasksView(props) {
    var t = COPY[props.lang === "en" ? "en" : "zh"];
    var api = props.api;

    var treeS = React.useState([]);
    var tree = treeS[0], setTree = treeS[1];
    var expS = React.useState(new Set(["1", "2"]));
    var expanded = expS[0], setExpanded = expS[1];
    var targetS = React.useState({ groupId: "1", tableId: null });
    var target = targetS[0], setTarget = targetS[1];
    var pathS = React.useState([]);
    var currentPath = pathS[0], setCurrentPath = pathS[1];
    var tabS = React.useState(0);
    var tab = tabS[0], setTab = tabS[1];
    var viewS = React.useState("list");
    var view = viewS[0], setView = viewS[1];
    var searchS = React.useState("");
    var searchDraft = searchS[0], setSearchDraft = searchS[1];
    var titleS = React.useState("");
    var titleKey = titleS[0], setTitleKey = titleS[1];
    var filterS = React.useState(true);
    var filterRestarted = filterS[0], setFilterRestarted = filterS[1];
    var typesS = React.useState(["0", "1", "2", "3"]);
    var checkedTypes = typesS[0], setCheckedTypes = typesS[1];
    var pageS = React.useState(1);
    var pageNumber = pageS[0], setPageNumber = pageS[1];
    var sizeS = React.useState(12);
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
    var selS = React.useState(new Set());
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
    var editS = React.useState(null);
    var edit = editS[0], setEdit = editS[1];
    var editNameS = React.useState("");
    var editName = editNameS[0], setEditName = editNameS[1];
    var dragS = React.useState(null);
    var dragId = dragS[0], setDragId = dragS[1];
    var dropS = React.useState(null);
    var dropId = dropS[0], setDropId = dropS[1];
    var toastS = React.useState("");
    var toast = toastS[0], setToast = toastS[1];
    var refreshRef = React.useRef({});

    function say(msg) { setToast(String(msg || "")); }
    React.useEffect(function () {
      if (!toast) return;
      var id = setTimeout(function () { setToast(""); }, 3200);
      return function () { clearTimeout(id); };
    }, [toast]);

    var refreshTree = React.useCallback(function () {
      return api.call("taskNodes.tree").then(function (r) {
        if (r && r.ok) setTree(Array.isArray(r.result) ? r.result : []);
        else setError((r && r.error) || "tree load failed");
      }).catch(function (e) { setError(String(e && e.message || e)); });
    }, [api]);

    var refreshPath = React.useCallback(function (id) {
      if (!id) { setCurrentPath([]); return Promise.resolve(); }
      return api.call("taskNodes.path", { id: id }).then(function (r) {
        if (r && r.ok) setCurrentPath(Array.isArray(r.result) ? r.result : []);
      }).catch(function () {});
    }, [api]);

    var refreshList = React.useCallback(function () {
      setLoading(true);
      return api.call("tasks.list", {
        tab: tab, titleKey: titleKey,
        tableId: target.tableId, groupId: target.tableId ? null : target.groupId,
        pageNumber: pageNumber, pageSize: pageSize,
        filterRestarted: filterRestarted, checkedTypes: checkedTypes,
      }).then(function (r) {
        setLoading(false);
        if (r && r.ok) {
          setData(r.result || { records: [], total: 0, current: 1, size: 0, pageable: false });
          setError("");
        } else {
          setError((r && r.error) || "list load failed");
        }
      }).catch(function (e) { setLoading(false); setError(String(e && e.message || e)); });
    }, [api, tab, titleKey, target.tableId, target.groupId, pageNumber, pageSize, filterRestarted, checkedTypes]);

    refreshRef.current = { tree: refreshTree, list: refreshList, path: refreshPath };

    React.useEffect(function () {
      injectCss();
      refreshTree();
      refreshPath("1");
    }, [refreshTree, refreshPath]);

    React.useEffect(function () {
      refreshList();
    }, [refreshList]);

    React.useEffect(function () {
      var off = api.subscribe(function (p) {
        if (!p) return;
        if (p.event === "tasks-changed") refreshRef.current.list();
        if (p.event === "task-nodes-changed") {
          refreshRef.current.tree();
          refreshRef.current.path(target.tableId || target.groupId);
        }
      });
      return off;
    }, [api, target.tableId, target.groupId]);

    React.useEffect(function () {
      refreshPath(target.tableId || target.groupId);
    }, [target.tableId, target.groupId, refreshPath]);

    function update(task, patch) {
      var args = Object.assign({ id: task.id }, patch);
      api.call("tasks.update", args).then(function (r) {
        if (r && r.ok) refreshList();
        else say((r && r.error) || "update failed");
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
      if (next.has(String(id))) next.delete(String(id)); else next.add(String(id));
      setExpanded(next);
    }

    function addNode(parentId, type) {
      api.call("taskNodes.create", { parentId: parentId, type: type }).then(function (r) {
        if (r && r.ok) {
          var next = new Set(expanded); next.add(String(parentId)); setExpanded(next);
          refreshTree();
          say(t.created);
        } else say((r && r.error) || "create failed");
      });
    }

    function renameNode(id, name) {
      if (!edit || String(edit.id) !== String(id)) return;
      var v = String(name || "").trim();
      if (!v || v === String(edit.name || "")) { setEdit(null); return; }
      api.call("taskNodes.rename", { id: id, name: v }).then(function (r) {
        setEdit(null);
        if (r && r.ok) { refreshTree(); say(t.saved); }
        else say((r && r.error) || "rename failed");
      });
    }

    function deleteNode(node) {
      if (!window.confirm(t.deleteConfirm)) return;
      api.call("taskNodes.delete", { id: node.id }).then(function (r) {
        if (r && r.ok) {
          refreshTree();
          setTarget({ groupId: "1", tableId: null });
          setPageNumber(1);
          say(t.deleted);
        } else say((r && r.error) || "delete failed");
      });
    }

    function moveNode(sourceId, targetId, moveType) {
      setDropId(null); setDragId(null);
      api.call("taskNodes.move", { sourceId: sourceId, targetId: targetId, moveType: moveType }).then(function (r) {
        if (r && r.ok) { refreshTree(); say(t.updated); }
        else say((r && r.error) || "move failed");
      });
    }

    function toggleType(id) {
      var next = checkedTypes.slice();
      var idx = next.indexOf(id);
      if (idx >= 0) next.splice(idx, 1); else next.push(id);
      if (!next.length) next = [id];
      setCheckedTypes(next);
      setPageNumber(1);
    }

    function toggleSelect(id) {
      var next = new Set(selectedIds);
      if (next.has(String(id))) next.delete(String(id)); else next.add(String(id));
      setSelectedIds(next);
    }

    function openSelected() {
      var ids = Array.from(selectedIds);
      if (!ids.length) { say("请先勾选任务"); return; }
      api.call("tasks.selected", { ids: ids }).then(function (r) {
        if (r && r.ok) { setSelectedItems(Array.isArray(r.result) ? r.result : []); setSelectedOpen(true); }
        else say((r && r.error) || "load failed");
      });
    }

    function clearSelection() {
      setSelectedIds(new Set()); setSelectedItems([]); setSelectedOpen(false); setBatchMode(null);
    }

    function batchDone() {
      setBatchMode(null); setSelectedOpen(false); clearSelection(); refreshList(); say(t.updated);
    }

    var tables = allTables(tree);
    var firstTable = findFirstTable(tree);
    var pageable = tab > 4 && tab < 9;
    var totalPages = pageable && data.total ? Math.ceil(data.total / pageSize) : 1;

    var treeProps = {
      t: t, expanded: expanded, selectedTable: target.tableId, selectedGroup: target.groupId,
      manager: manager, dragId: dragId, dropId: dropId, edit: edit, editName: editName,
      onToggle: toggleExpanded, onSelect: pickNode, onAdd: addNode,
      onEdit: function (node) { setEdit({ id: node.id, name: node.name }); setEditName(node.name); },
      onEditName: setEditName, onCancelEdit: function () { setEdit(null); },
      onRename: renameNode, onDelete: deleteNode,
      onDragStart: function (id) { setDragId(String(id)); },
      onDragOver: function (id) { setDropId(String(id)); },
      onMove: moveNode,
    };

    var treeBody = tree.length ? tree.map(function (n) {
      return h(TreeNode, Object.assign({}, treeProps, { key: n.id, node: n, depth: 0 }));
    }) : h("div", { className: "wbt-empty" }, t.emptyTree);

    var filterBar = h("div", { className: "wbt-filters" },
      pageable ? h("span", { className: "wbt-sum" }, t.total + " " + data.total + " " + t.items) : null,
      tab >= 5 ? h("span", { className: "wbt-check" }, h("span", null, t.types + "："), TYPES.map(function (x) {
        return h("label", { key: x.id, className: "wbt-check" },
          h("input", { type: "checkbox", checked: checkedTypes.indexOf(x.id) >= 0, onChange: function () { toggleType(x.id); } }),
          x.zh);
      })) : null,
      (tab === 5 || tab === 8) ? h("label", { className: "wbt-check" },
        h("input", { type: "checkbox", checked: filterRestarted, onChange: function (e) { setFilterRestarted(e.target.checked); setPageNumber(1); } }),
        t.filterRestarted) : null
    );

    var listBody = loading
      ? h("div", { className: "wbt-empty" }, t.loading)
      : error
        ? h("div", { className: "wbt-err" }, t.error + error)
        : data.records.length === 0
          ? h("div", { className: "wbt-empty" }, t.empty)
          : h("div", { className: view === "card" ? "wbt-grid" : "wbt-list" }, data.records.map(function (task) {
              return h(TaskItem, {
                key: task.id, task: task, t: t, lang: props.lang, card: view === "card",
                selectionMode: selectionMode, checked: selectedIds.has(String(task.id)),
                onCheck: toggleSelect, update: update, toast: say,
                onDone: function (x) { setDoneTask(x); },
                onRestart: function (x) { setCreateState({ source: "2", originTask: x }); },
                onTimeline: function (x) { setTimelineTask(x); },
                onPathPick: pickPath,
              });
            }));

    return h("div", { className: "wbt-root" },
      h("div", { className: "wbt-top" },
        h("h2", null, t.title),
        h("button", { className: "wbt-btn", onClick: function () { setDrawer(true); refreshTree(); } }, "▤ " + t.tree),
        h("div", { className: "wbt-grow" }),
        h("button", { className: "wbt-btn ghost", onClick: function () { setView(view === "list" ? "card" : "list"); } }, view === "list" ? "▦ " + t.card : "☷ " + t.list)
      ),
      h("div", { className: "wbt-pathrow" },
        h(PathCrumbs, { path: currentPath, onPick: pickPath }),
        h("div", { className: "wbt-grow" }),
        h("input", {
          className: "wbt-input wbt-search", placeholder: t.search, value: searchDraft,
          onChange: function (e) { setSearchDraft(e.target.value); },
          onKeyDown: function (e) { if (e.key === "Enter") { setTitleKey(searchDraft); setPageNumber(1); } },
        }),
        h("button", { className: "wbt-btn ghost", onClick: function () { setTitleKey(searchDraft); setPageNumber(1); } }, "⌕"),
        h("button", { className: "wbt-btn " + (selectionMode ? "primary" : "ghost"), onClick: function () {
          if (selectionMode) { setSelectionMode(false); clearSelection(); }
          else setSelectionMode(true);
        } }, selectionMode ? t.cancelSelect : t.select),
        h("button", { className: "wbt-btn primary", onClick: function () {
          setCreateState({ source: "0", originTask: null, defaultTableId: target.tableId || (firstTable && firstTable.id) });
        } }, "＋ " + t.newTask)
      ),
      h("div", { className: "wbt-body" },
        h("nav", { className: "wbt-nav" }, TABS.map(function (x, i) {
          var btn = h("button", {
            key: x.id, className: "wbt-tab" + (tab === x.id ? " on" : ""),
            onClick: function () { setTab(x.id); setPageNumber(1); },
          }, t === COPY.zh ? x.zh : x.en);
          if (i !== 5) return btn;
          return [h("div", { key: "nav-sep", className: "wbt-nav-sep" }), btn];
        })),
        h("div", { className: "wbt-content" },
          filterBar,
          listBody,
          pageable ? h("div", { className: "wbt-pager" },
            h("button", { className: "wbt-btn ghost", disabled: pageNumber <= 1, onClick: function () { setPageNumber(Math.max(1, pageNumber - 1)); } }, "‹"),
            h("span", null, t.page + " " + pageNumber + " / " + totalPages),
            h("select", { className: "wbt-select", value: pageSize, onChange: function (e) { setPageSize(Number(e.target.value)); setPageNumber(1); } },
              [6, 12, 24].map(function (n) { return h("option", { key: n, value: n }, n + " / " + t.page); })),
            h("button", { className: "wbt-btn ghost", disabled: pageNumber >= totalPages, onClick: function () { setPageNumber(Math.min(totalPages, pageNumber + 1)); } }, "›")
          ) : null
        )
      ),
      selectionMode && selectedIds.size ? h("div", { className: "wbt-selbar" },
        h("b", null, t.selected + " " + selectedIds.size),
        h("button", { className: "wbt-btn", onClick: openSelected }, t.selectedTasks),
        h("button", { className: "wbt-btn", onClick: function () { setBatchMode("timeline"); openSelected(); } }, t.batchTimeline),
        h("button", { className: "wbt-btn", onClick: function () { setBatchMode("migrate"); openSelected(); } }, t.batchMigrate),
        h("button", { className: "wbt-btn ghost", onClick: clearSelection }, t.clear)
      ) : null,
      drawer ? h("div", { className: "wbt-drawer-mask", onMouseDown: function (e) { if (e.target === e.currentTarget) setDrawer(false); } },
        h("div", { className: "wbt-drawer" },
          h("div", { className: "wbt-drawer-head" },
            h("b", { style: { flex: 1 } }, t.tree),
            h("label", { className: "wbt-check", title: t.manager },
              h("input", { type: "checkbox", checked: manager, onChange: function (e) { setManager(e.target.checked); } }),
              t.manager),
            h("button", { className: "wbt-icon", onClick: function () { setDrawer(false); } }, "×")
          ),
          h("div", { className: "wbt-drawer-body" }, treeBody),
          h("div", { className: "wbt-drawer-foot" }, "点击任务表筛选任务；管理模式可拖拽、删除节点")
        )
      ) : null,
      createState ? h(CreateModal, {
        key: (createState.source || "0") + "-" + (createState.originTask && createState.originTask.id || ""),
        t: t, api: api, tree: tree, source: createState.source,
        originTask: createState.originTask, defaultTableId: createState.defaultTableId,
        onClose: function () { setCreateState(null); },
        onCreated: function () { setCreateState(null); refreshList(); refreshTree(); say(t.created); },
      }) : null,
      timelineTask ? h(TimelineModal, {
        key: timelineTask.id, t: t, api: api, task: timelineTask,
        onClose: function () { setTimelineTask(null); },
        onCreateTimeline: function (originTask) {
          setTimelineTask(null);
          setCreateState({ source: "1", originTask: originTask, defaultTableId: originTask.tableId });
        },
      }) : null,
      doneTask ? h(DoneModal, {
        key: doneTask.id, t: t, api: api, task: doneTask,
        onClose: function () { setDoneTask(null); },
        onDone: function () { setDoneTask(null); refreshList(); say(t.doneSuccess); },
        onError: function (e) { setDoneTask(null); say(e); },
      }) : null,
      (selectedOpen && batchMode) ? h(BatchModal, {
        key: batchMode, t: t, api: api, mode: batchMode, items: selectedItems, tables: tables,
        onClose: function () { setBatchMode(null); },
        onDone: batchDone,
      }) : null,
      toast ? h("div", { className: "wbt-toast" }, toast) : null
    );
  }

  host.registerAddon({
    id: "wb-addon-tasks",
    version: "2.0.5",
    views: [{
      id: "tasks",
      title: { zh: "任务记录", en: "Tasks" },
      component: TasksView,
    }],
  });
      return { name: "dsh-workbench-tasks", inject: [], apply: function () {} };
    },
  });
})();
