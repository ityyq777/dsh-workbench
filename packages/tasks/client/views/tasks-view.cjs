// 任务列表与树导航视图；依赖由入口注入，无循环依赖。
module.exports = function createTasksView(deps) {
  var React = deps.React, configView = deps.configView, CFG_FALLBACK = deps.CFG_FALLBACK, COPY = deps.COPY, injectCss = deps.injectCss, allTables = deps.allTables, findFirstTable = deps.findFirstTable, treeWalk = deps.treeWalk, treeFlat = deps.treeFlat, cx = deps.cx, Icon = deps.Icon, TaskItem = deps.TaskItem, PathCrumbs = deps.PathCrumbs, TagFilter = deps.TagFilter, TreeNode = deps.TreeNode, CreateModal = deps.CreateModal, TimelineModal = deps.TimelineModal, NodeModal = deps.NodeModal, EditModal = deps.EditModal, DoneModal = deps.DoneModal, BatchModal = deps.BatchModal;
  var h = React.createElement, filters = require("./task-filter-model.cjs"), renderFilters = require("./task-filter-panel.cjs"), claimBatch = require("./claim-batch.cjs"), renderSelectionBar = require("./selection-bar.cjs");
  function TasksView(props) {
    var lang = props.lang === "en" ? "en" : "zh";
    var cfg = configView.useConfig(props.api, CFG_FALLBACK);
    if (!cfg.ready) {
      return h("div", { style: { padding: "48px", textAlign: "center", fontSize: "12.5px", opacity: .6 } }, lang === "en" ? "Loading…" : "载入中…");
    }
    return h(TasksViewBody, Object.assign({}, props, { cfg: cfg.values }));
  }

  function expandedByDepth(nodes, depth) {
    var out = new Set();
    (function walk(list, d) {
      (list || []).forEach(function (n) {
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
    var expS = React.useState(new Set());
    var expanded = expS[0], setExpanded = expS[1];
    var expInitRef = React.useRef(false);
    var targetS = React.useState(tableNavigation ? { tableId: String(tableNavigation), groupId: props.viewParams.groupId } : { groupId: groupNavigation ? String(groupNavigation) : "1", tableId: null });
    var target = targetS[0], setTarget = targetS[1];
    var pathS = React.useState([]);
    var currentPath = pathS[0], setCurrentPath = pathS[1];
    // 视图切走会卸载，用会话存储还原上次的筛选；显式导航（排行/热力图跳转）优先并覆盖它。
    var storedFilters = filters.load(props.viewParams);
    var initialMissing = storedFilters ? storedFilters.missing : !activityNavigation && !nodeNavigation && !!(props.viewParams && props.viewParams.difficultyMissing === true);
    var missingS = React.useState(initialMissing);
    var difficultyMissing = missingS[0], setDifficultyMissing = missingS[1];
    // 默认快捷预设（ui.defaultPreset）只在没有会话筛选记忆、也没有显式导航时套用一次。
    var defaultPreset = filters.presetValue(cfg["ui.defaultPreset"]);
    var filterState = React.useState((storedFilters && storedFilters.value) || activityNavigation || defaultPreset || filters.empty());
    var filterValue = filterState[0], setFilterValue = filterState[1];
    React.useEffect(function () { filters.save(filterValue, difficultyMissing, props.viewParams); }, [filterValue, difficultyMissing, JSON.stringify(props.viewParams || {})]);
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
    // 筛选面板的工作区清单与任务列表分开拉，失败只让该分组降级为空。
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
    React.useEffect(function () {
      if (initialNavigation.current) { initialNavigation.current = false; if (storedFilters) return; }
      if (!activityNavigation && !nodeNavigation) return;
      setFilterValue(activityNavigation || defaultPreset || filters.empty());
      setTarget(tableNavigation ? { tableId: String(tableNavigation), groupId: props.viewParams.groupId } : { groupId: groupNavigation ? String(groupNavigation) : "1", tableId: null });
      setDifficultyMissing(false); setFilterHint("");
      setSearchDraft(""); setTitleKey(""); setFilterTagIds([]); setPageNumber(1);
      setSelectedIds(new Set()); setSelectionMode(false);
    }, [JSON.stringify(props.viewParams || {})]);

    function say(msg) { setToast(String(msg || "")); }
    React.useEffect(function () {
      if (!toast) return;
      var id = setTimeout(function () { setToast(""); }, 3200);
      return function () { clearTimeout(id); };
    }, [toast]);

    var treeSearchRef = React.useRef(null);
    React.useEffect(function () {
      if (!drawer) return;
      var id = setTimeout(function () { if (treeSearchRef.current) treeSearchRef.current.focus(); }, 40);
      function onKey(e) { if (e.key === "Escape") setDrawer(false); }
      window.addEventListener("keydown", onKey);
      return function () { clearTimeout(id); window.removeEventListener("keydown", onKey); };
    }, [drawer]);

    var refreshTree = React.useCallback(function () {
      return api.call("taskNodes.tree").then(function (r) {
        if (r && r.ok) {
          var nodes = Array.isArray(r.result) ? r.result : [];
          setTree(nodes);
          if (!expInitRef.current) {
            expInitRef.current = true;
            var open = expandedByDepth(nodes, cfgDepth);
            function reveal(list, parents) { (list || []).forEach(function (n) {
              if (String(n.id) === String(nodeNavigation)) parents.forEach(function (id) { open.add(id); });
              reveal(n.children, parents.concat(String(n.id)));
            }); }
            if (nodeNavigation) reveal(nodes, []);
            setExpanded(open);
          }
        } else setError((r && r.error) || "tree load failed");
      }).catch(function (e) { setError(String(e && e.message || e)); });
    }, [api]);

    var refreshTagNav = React.useCallback(function () { setTagReload(function (n) { return n + 1; }); }, []);
    var refreshPath = React.useCallback(function (id) {
      if (!id) { setCurrentPath([]); return Promise.resolve(); }
      return api.call("taskNodes.path", { id: id }).then(function (r) {
        if (r && r.ok) setCurrentPath(Array.isArray(r.result) ? r.result : []);
      }).catch(function () {});
    }, [api]);

    var refreshList = React.useCallback(function () {
      setLoading(true);
      return api.call("tasks.list", Object.assign({
        titleKey: titleKey,
        tableId: target.tableId, groupId: target.tableId ? null : target.groupId,
        pageNumber: pageNumber, pageSize: pageSize,
        tagIds: filterTagIds, difficultyMissing: difficultyMissing,
        sort: nodeNavigation || cfgSort === "auto" ? undefined : cfgSort,
      }, filters.args(filterValue))).then(function (r) {
        setLoading(false);
        if (r && r.ok) {
          setData(r.result || { records: [], total: 0, current: 1, size: 0, pageable: false });
          setError("");
        } else {
          setError((r && r.error) || "list load failed");
        }
      }).catch(function (e) { setLoading(false); setError(String(e && e.message || e)); });
    }, [api, titleKey, target.tableId, target.groupId, pageNumber, pageSize, filterTagIds, difficultyMissing, cfgSort, filterValue]);

    refreshRef.current = { tree: refreshTree, list: refreshList, path: refreshPath, tags: refreshTagNav };

    React.useEffect(function () {
      injectCss();
      refreshTree();
      refreshTagNav();
      refreshPath("1");
    }, [refreshTree, refreshTagNav, refreshPath]);

    React.useEffect(function () {
      refreshList();
    }, [refreshList]);

    React.useEffect(function () {
      var off = api.subscribe(function (p) {
        if (!p) return;
        if (p.event === "tasks-changed") {
          refreshRef.current.list();
          refreshRef.current.tags();
        }
        if (p.event === "task-nodes-changed") {
          refreshRef.current.tree();
          refreshRef.current.path(target.tableId || target.groupId);
        }
        // 工作区改名/删除后，任务行上的工作区 chip 也要跟着换标题或消失。
        if (p.event === "task-workspaces-changed") refreshRef.current.list();
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
      setNodeModal({ parentId: parentId, type: type, node: null });
    }

    function nodeSaved(op) {
      var cur = nodeModal;
      setNodeModal(null);
      if (cur && cur.parentId) {
        var next = new Set(expanded); next.add(String(cur.parentId)); setExpanded(next);
      }
      refreshTree();
      say(op === "create" ? t.created : t.saved);
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

    function deleteTask(task) {
      if (cfgConfirm && !window.confirm(t.deleteTaskConfirm)) return;
      api.call("tasks.delete", { id: task.id }).then(function (r) {
        if (r && r.ok) {
          refreshList();
          refreshTagNav();
          say(t.deleted);
        } else say((r && r.error) || "delete failed");
      });
    }

    function batchDelete() {
      var ids = Array.from(selectedIds);
      if (!ids.length) return;
      if (cfgConfirm && !window.confirm(t.batchDeleteConfirm.replace("{n}", String(ids.length)))) return;
      var ok = 0, fail = 0;
      Promise.all(ids.map(function (id) {
        return api.call("tasks.delete", { id: id }).then(function (r) {
          if (r && r.ok) ok++; else fail++;
          return r;
        }).catch(function () { fail++; return null; });
      })).then(function () {
        clearSelection();
        refreshList();
        refreshTagNav();
        say(fail ? (t.deleted + " " + ok + " · " + t.deletePartial + " " + fail) : (t.deleted + " " + ok));
      });
    }

    var claimSelected = claimBatch.makeClaimSelected({
      api: api, t: t, ids: function () { return Array.from(selectedIds); }, setIds: setSelectedIds,
      clear: clearSelection, say: say, refreshList: refreshList, refreshTagNav: refreshTagNav,
    });

    function deleteNode(node) {
      if (cfgConfirm && !window.confirm(t.deleteConfirm)) return;
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
        if (r && r.ok) {
          if (String(moveType) === "0") {
            var next = new Set(expanded); next.add(String(targetId)); setExpanded(next);
          }
          refreshTree(); say(t.updated);
        }
        else say((r && r.error) || "move failed");
      });
    }

    /** 标签筛选：与站点模块一致，按标签 id 多选，命中任一。 */
    function toggleTagId(id) {
      var next = filterTagIds.slice();
      var idx = next.indexOf(String(id));
      if (idx >= 0) next.splice(idx, 1); else next.push(String(id));
      setFilterTagIds(next);
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
    var pageable = true;
    var totalPages = pageable && data.total ? Math.ceil(data.total / pageSize) : 1;

    var treeProps = {
      t: t, expanded: expanded, selectedTable: target.tableId, selectedGroup: target.groupId,
      manager: manager, dragId: dragId, dropId: dropId, edit: edit, editName: editName,
      onToggle: toggleExpanded, onSelect: pickNode, onAdd: addNode,
      onEdit: function (node) { setNodeModal({ parentId: node.parent || node.parentId, type: node.type, node: node }); },
      onEditName: setEditName, onCancelEdit: function () { setEdit(null); },
      onRename: renameNode, onDelete: deleteNode,
      onDragStart: function (id) { setDragId(String(id)); },
      onDragOver: function (id) { setDropId(String(id)); },
      onMove: moveNode,
    };

    function flatTreeRow(item) {
      var node = item.node;
      var isTable = String(node.type) === "1";
      var selected = String(target.tableId || "") === String(node.id) || (!target.tableId && String(target.groupId || "") === String(node.id));
      return h("div", {
        key: node.id, className: cx("wbt-tree-row", selected && "sel"),
        style: { paddingLeft: (3 + item.depth * 15) + "px" },
      },
        h("span", { className: "wbt-tw void" }),
        h("span", { className: "wbt-ti" }, h(Icon, { name: isTable ? "table" : "folder", size: 13 })),
        h("div", { className: "wbt-tn", onClick: function () { pickNode(node); }, title: node.description ? node.name + "\n" + node.description : node.name },
          h("span", { className: "nm" }, node.name),
          node.description ? h("span", { className: "wbt-tdesc" }, String(node.description).replace(/\s+/g, " ")) : null,
          !isTable && node.children && node.children.length ? h("span", { className: "wbt-tcnt" }, node.children.length) : null
        )
      );
    }

    var flatNodes = treeWalk(tree);
    var rootId = tree.length ? String(tree[0].id) : "";
    var nodeById = {};
    flatNodes.forEach(function (x) { nodeById[String(x.node.id)] = x.node; });
    var curNode = nodeById[String(target.tableId || target.groupId || "")] || null;
    var footGroupId = curNode
      ? (String(curNode.type) === "1" ? String(curNode.parent || curNode.parentId || rootId) : String(curNode.id))
      : rootId;
    var groupCount = 0;
    var tableCount = 0;
    flatNodes.forEach(function (x) { if (String(x.node.type) === "1") tableCount++; else groupCount++; });
    var tq = treeQuery.trim().toLowerCase();
    var treeHits = tq ? flatNodes.filter(function (x) { return String(x.node.name || "").toLowerCase().indexOf(tq) >= 0; }) : [];
    var treeBody = !tree.length
      ? h("div", { className: "wbt-empty" }, t.emptyTree)
      : tq
        ? (treeHits.length ? treeHits.map(flatTreeRow) : h("div", { className: "wbt-empty" }, t.treeNoMatch))
        : tree.map(function (n) {
            return h(TreeNode, Object.assign({}, treeProps, { key: n.id, node: n, depth: 0 }));
          });

    var curDesc = curNode ? String(curNode.description || "") : "";
    var filterPanel = renderFilters(React, {
      lang: props.lang, value: filterValue, open: panelOpen, id: panelId, hint: filterHint, onHint: setFilterHint,
      onToggle: function () { setPanelOpen(!panelOpen); },
      onChange: function (next) { setFilterValue(next); setPageNumber(1); },
      difficultyMissing: difficultyMissing,
      onMissingChange: function (next) { setDifficultyMissing(next); setPageNumber(1); },
      search: h("form", { className: "wbt-filter-search", onSubmit: function (e) { e.preventDefault(); setTitleKey(searchDraft); setPageNumber(1); } },
        h("input", { className: "wbt-input", placeholder: t.search, "aria-label": t.search, value: searchDraft, onChange: function (e) { setSearchDraft(e.target.value); } }),
        h("button", { type: "submit", className: "wbt-btn ghost", "aria-label": t.search }, h(Icon, { name: "search", size: 14 }))),
      tags: h(TagFilter, { api: api, t: t, Icon: Icon, ids: filterTagIds, reloadKey: tagReload,
        onChange: function (next) { setFilterTagIds(next); setPageNumber(1); } }),
      // 与难度区间互斥：两者同时生效必然是空集，勾选「仅未填难度」时清掉难度区间。
      api: api, t: t, Icon: Icon,
      missing: h("label", { className: "wbt-check" }, h("input", { type: "checkbox", checked: difficultyMissing,
        onChange: function (e) { var next = e.target.checked; setDifficultyMissing(next); if (next) setFilterValue(filters.clearDifficulty(filterValue)); setPageNumber(1); } }), t.difficultyMissing),
    });

    var listBody = loading
      ? h("div", { className: "wbt-empty" }, t.loading)
      : error
        ? h("div", { className: "wbt-err" }, t.error + error)
        : data.records.length === 0
          ? h("div", { className: "wbt-empty" }, t.empty)
          : h("div", { className: view === "card" ? "wbt-grid" : "wbt-list" }, data.records.map(function (task) {
              return h(TaskItem, {
                key: task.id, task: task, t: t, lang: props.lang, card: view === "card", keyword: titleKey.trim(),
                bodyMode: cfg["ui.bodyMode"], selectionMode: selectionMode, checked: selectedIds.has(String(task.id)),
                onCheck: toggleSelect, update: update, toast: say,
                onEdit: function (x) { setEditTask(x); },
                onDone: function (x) { setDoneTask(x); },
                onRestart: function (x) { setCreateState({ source: "2", originTask: x }); },
                onTimeline: function (x) { setTimelineTask(x); },
                onDelete: deleteTask,
                onPathPick: pickPath,
                onTagPick: toggleTagId,
              });
            }));

    return h("div", { className: "wbt-root" },
      h("div", { className: "wbt-pathrow" },
        h("div", { className: "wbt-tree-slot" },
          h("button", { className: "wbt-btn", onClick: function () { setDrawer(true); refreshTree(); } }, h(Icon, { name: "tree", size: 13 }), t.tree)
        ),
        h("span", { className: "wbt-sum", role: "status", "aria-live": "polite" }, t.total + " " + data.total + " " + t.items),
        h(PathCrumbs, { path: currentPath, onPick: pickPath }),
        h("div", { className: "wbt-grow" }),
        h("button", {
          className: "wbt-btn ghost", title: t.refresh, "aria-label": t.refresh, disabled: loading,
          onClick: function () { refreshList(); refreshTagNav(); },
        }, h(Icon, { name: "refresh", size: 13 }), t.refresh),
        h("button", { className: "wbt-btn " + (selectionMode ? "primary" : "ghost"), onClick: function () {
          if (selectionMode) { setSelectionMode(false); clearSelection(); }
          else setSelectionMode(true);
        } }, h(Icon, { name: "select", size: 13 }), selectionMode ? t.cancelSelect : t.select),
        h("button", { className: "wbt-btn primary", onClick: function () {
          setCreateState({ source: "0", originTask: null, defaultTableId: target.tableId });
        } }, h(Icon, { name: "plus", size: 14 }), t.newTask),
        h("button", { className: "wbt-btn ghost", onClick: function () { setView(view === "list" ? "card" : "list"); } }, h(Icon, { name: view === "list" ? "grid" : "list", size: 13 }), view === "list" ? t.card : t.list)
      ),
      curDesc ? h("div", { className: "wbt-tabledesc", title: curDesc }, curDesc.length > 220 ? curDesc.slice(0, 220) + "…" : curDesc) : null,
      h("div", { className: "wbt-body" },
        filterPanel,
        h("div", { className: "wbt-content" },
          h("div", { className: "wbt-list-scroll", tabIndex: 0, role: "region", "aria-label": props.lang === "en" ? "Task list" : "任务列表", key: pageNumber + ":" + pageSize }, listBody),
          pageable ? h("div", { className: "wbt-pager" },
            h("button", { className: "wbt-btn ghost", disabled: pageNumber <= 1, onClick: function () { setPageNumber(Math.max(1, pageNumber - 1)); } }, h(Icon, { name: "left", size: 14 })),
            h("span", null, t.page + " " + pageNumber + " / " + totalPages),
            h("select", { className: "wbt-select", value: pageSize, onChange: function (e) { setPageSize(Number(e.target.value)); setPageNumber(1); } },
              [6, 12, 24].map(function (n) { return h("option", { key: n, value: n }, n + " / " + t.page); })),
            h("button", { className: "wbt-btn ghost", disabled: pageNumber >= totalPages, onClick: function () { setPageNumber(Math.min(totalPages, pageNumber + 1)); } }, h(Icon, { name: "right", size: 14 }))
          ) : null
        )
      ),
      selectionMode && selectedIds.size ? renderSelectionBar(h, Icon, {
        t: t, count: selectedIds.size, openSelected: openSelected, batchDelete: batchDelete, claimSelected: claimSelected, clear: clearSelection,
        batchTimeline: function () { setBatchMode("timeline"); openSelected(); },
        batchMigrate: function () { setBatchMode("migrate"); openSelected(); },
      }) : null,
      drawer ? h("div", { className: "wbt-drawer-mask", onMouseDown: function (e) { if (e.target === e.currentTarget) setDrawer(false); } },
        h("div", { className: "wbt-drawer", role: "dialog", "aria-label": t.tree },
          h("div", { className: "wbt-drawer-head" },
            h(Icon, { name: "tree", size: 15 }),
            h("div", { className: "wbt-drawer-title" },
              h("b", null, t.tree),
              h("span", { className: "wbt-drawer-meta" }, groupCount + " " + t.groups + " · " + tableCount + " " + t.tables)
            ),
            h("button", {
              className: "wbt-tool" + (manager ? " on" : ""),
              onClick: function () { setManager(!manager); },
            }, t.manager),
            h("button", { className: "wbt-icon", title: t.close, "aria-label": t.close, onClick: function () { setDrawer(false); } }, h(Icon, { name: "close", size: 15 }))
          ),
          h("div", { className: "wbt-drawer-search" },
            h("input", {
              className: "wbt-input", ref: treeSearchRef, placeholder: t.treeSearch, value: treeQuery,
              onChange: function (e) { setTreeQuery(e.target.value); },
              onKeyDown: function (e) { if (e.key === "Escape") { e.stopPropagation(); setTreeQuery(""); setDrawer(false); } },
            }),
            treeQuery ? h("button", {
              className: "wbt-search-clear", title: t.clear, "aria-label": t.clear,
              onClick: function () { setTreeQuery(""); if (treeSearchRef.current) treeSearchRef.current.focus(); },
            }, h(Icon, { name: "close", size: 13 })) : null
          ),
          h("div", { className: "wbt-drawer-body" }, treeBody),
          h("div", { className: "wbt-drawer-foot" },
            h("div", { className: "wbt-drawer-acts" },
              h("button", { className: "wbt-addbtn", title: t.addGroup, onClick: function () { if (footGroupId) addNode(footGroupId, "0"); } },
                h(Icon, { name: "folderPlus", size: 13 }), t.addGroup),
              h("button", { className: "wbt-addbtn", title: t.addTable, onClick: function () { if (footGroupId) addNode(footGroupId, "1"); } },
                h(Icon, { name: "filePlus", size: 13 }), t.addTable)
            ),
            h("div", { className: "wbt-drawer-hint" }, t.treeHint)
          )
        )
      ) : null,
      createState ? h(CreateModal, {
        key: (createState.source || "0") + "-" + (createState.originTask && createState.originTask.id || ""),
        t: t, api: api, tree: tree, source: createState.source,
        originTask: createState.originTask, defaultTableId: createState.defaultTableId,
        defaults: {
          priority: cfg["form.defaultPriority"], difficulty: cfg["form.defaultDifficulty"],
          targetOffset: cfg["form.defaultTargetOffset"],
        },
        onClose: function () { setCreateState(null); },
        onCreated: function (result) { setCreateState(null); refreshList(); refreshTree(); say(require("../modals/ownership.cjs").receipt(result)); },
      }) : null,
      timelineTask ? h(TimelineModal, {
        key: timelineTask.id, t: t, api: api, task: timelineTask, onChanged: refreshList,
        onClose: function () { setTimelineTask(null); },
        onOpen: function (member) {
          api.call("tasks.get", { id: member.id }).then(function (r) {
            if (!r || !r.ok) throw Error(r && r.error || t.fail);
            setTimelineTask(null); setEditTask(r.result.task);
          }).catch(function (err) { say(String(err.message || err)); });
        },
        onCreateTimeline: function (originTask) {
          setTimelineTask(null);
          setCreateState({ source: "1", originTask: originTask, defaultTableId: originTask.tableId });
        },
      }) : null,
      nodeModal ? h(NodeModal, {
        key: "node-" + (nodeModal.node ? nodeModal.node.id : "new"),
        t: t, api: api, node: nodeModal.node, parentId: nodeModal.parentId, type: nodeModal.type,
        onClose: function () { setNodeModal(null); },
        onSaved: nodeSaved,
      }) : null,
      editTask ? h(EditModal, {
        key: "edit-" + editTask.id, t: t, api: api, task: editTask, lang: props.lang, tree: tree,
        onClose: function () { setEditTask(null); },
        onSaved: function (result) { setEditTask(null); refreshList(); say(require("../modals/ownership.cjs").receipt(result)); },
      }) : null,
      doneTask ? h(DoneModal, {
        key: doneTask.id, t: t, api: api, task: doneTask,
        onClose: function () { setDoneTask(null); },
        onDone: function () { setDoneTask(null); refreshList(); say(t.doneSuccess); },
        onError: function (e) { setDoneTask(null); say(e); },
      }) : null,
      (selectedOpen && batchMode) ? h(BatchModal, {
        key: batchMode, t: t, api: api, mode: batchMode, items: selectedItems, tables: tables, tree: tree,
        onClose: function () { setBatchMode(null); },
        onDone: batchDone,
      }) : null,
      toast ? h("div", { className: "wbt-toast" }, toast) : null
    );
  }

  return TasksView;
};
