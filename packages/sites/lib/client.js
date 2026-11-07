/* 站点子插件：浏览器侧视图。通过 window.__WB_HOST__ 注入 React，不打包。 */
(function () {
  window.__ModuleLoader__ = window.__ModuleLoader__ || { modules: {}, load: function (m) { this.modules[m.id] = m.factory; } };
  window.__ModuleLoader__.load({
    id: "dsh-workbench-sites",
    factory: function (require) {
  var host = window.__WB_HOST__;
  if (!host) {
    console.error("[wb-addon-sites] 缺少 window.__WB_HOST__，无法注册站点视图");
    return { name: "dsh-workbench-sites", inject: [], apply: function () {} };
  }
  var React = host.react || host.React;
  var h = host.h || (React && React.createElement);
  if (!React || !h) {
    console.error("[wb-addon-sites] 宿主未提供 React");
    return { name: "dsh-workbench-sites", inject: [], apply: function () {} };
  }
  var useState = React.useState;
  var useEffect = React.useEffect;
  var useRef = React.useRef;
  var useMemo = React.useMemo;

  var COPY = {
    zh: {
      title: "站点",
      all: "全部站点",
      directory: "目录",
      addDir: "新建目录",
      addChild: "新建子目录",
      rename: "重命名",
      remove: "删除目录",
      search: "搜索站点名称或描述",
      newSite: "＋ 新建站点",
      siteCol: "站点 / 平台",
      tagCol: "标签",
      createTime: "创建时间",
      updateTime: "更新时间",
      actions: "操作",
      links: "链接",
      dirs: "目录",
      edit: "编辑",
      del: "删除",
      default: "默认",
      noLink: "暂无链接",
      noDesc: "暂无描述",
      empty: "还没有站点",
      emptyHint: "点击右上角“新建站点”，或在当前目录下创建第一条记录。",
      loading: "加载中…",
      prev: "上一页",
      next: "下一页",
      total: "共 {n} 个",
      deleteTitle: "删除站点",
      deleteText: "确定删除「{name}」吗？站点会被软删除，目录与标签关联也会清理。",
      cancel: "取消",
      confirm: "确定删除",
      createTitle: "新建站点",
      editTitle: "编辑站点",
      step1: "基础信息",
      step2: "关联目录",
      step3: "关联标签",
      siteName: "站点名称",
      siteNamePh: "例如：MDN",
      desc: "一句话描述",
      descPh: "这个站点是做什么的",
      linkList: "链接",
      linkDesc: "描述",
      linkUrl: "网址",
      addLink: "＋ 添加链接",
      setDefault: "设为默认",
      removeLink: "移除",
      chooseDirs: "选择目录（至少一个）",
      chooseTags: "选择标签",
      tagSearch: "搜索标签",
      noTags: "没有匹配的标签",
      noDirs: "还没有目录，请先在左侧新建目录",
      back: "上一步",
      nextStep: "下一步",
      save: "保存",
      saving: "保存中…",
      requiredName: "请填写站点名称",
      requiredDirs: "请至少选择一个目录",
      tagFilter: "标签筛选",
      allTags: "全部标签",
      clear: "清除",
      refresh: "刷新",
      selected: "已选 {n} 项",
      deleteSelected: "删除所选",
      removeDirTitle: "删除目录",
      removeDirText: "确定删除「{name}」及其所有子目录吗？目录下的站点不会被删除，只会解除目录关联。",
      dirName: "目录名称",
      create: "创建",
      renameTitle: "重命名目录",
      bulkConfirm: "确定删除选中的 {n} 个站点吗？",
      opFail: "操作失败：{msg}",
      loadFail: "加载失败：{msg}",
      saved: "已保存",
      deleted: "已删除",
      moved: "已移动",
    },
    en: {
      title: "Sites",
      all: "All sites",
      directory: "Folders",
      addDir: "New folder",
      addChild: "New subfolder",
      rename: "Rename",
      remove: "Delete folder",
      search: "Search site name or description",
      newSite: "+ New site",
      siteCol: "Site",
      tagCol: "Tags",
      createTime: "Created",
      updateTime: "Updated",
      actions: "Actions",
      links: "Links",
      dirs: "Folders",
      edit: "Edit",
      del: "Delete",
      default: "Default",
      noLink: "No link",
      noDesc: "No description",
      empty: "No sites yet",
      emptyHint: "Use “New site” in the top right to add the first one.",
      loading: "Loading…",
      prev: "Prev",
      next: "Next",
      total: "{n} sites",
      deleteTitle: "Delete site",
      deleteText: "Delete “{name}”? The site is soft deleted and its folder/tag links are cleaned up.",
      cancel: "Cancel",
      confirm: "Delete",
      createTitle: "New site",
      editTitle: "Edit site",
      step1: "Basics",
      step2: "Folders",
      step3: "Tags",
      siteName: "Site name",
      siteNamePh: "e.g. MDN",
      desc: "Description",
      descPh: "What is this site for?",
      linkList: "Links",
      linkDesc: "Label",
      linkUrl: "URL",
      addLink: "+ Add link",
      setDefault: "Default",
      removeLink: "Remove",
      chooseDirs: "Choose at least one folder",
      chooseTags: "Choose tags",
      tagSearch: "Search tags",
      noTags: "No matching tags",
      noDirs: "No folders yet. Create one on the left first.",
      back: "Back",
      nextStep: "Next",
      save: "Save",
      saving: "Saving…",
      requiredName: "Site name is required",
      requiredDirs: "Choose at least one folder",
      tagFilter: "Filter by tag",
      allTags: "All tags",
      clear: "Clear",
      refresh: "Refresh",
      selected: "{n} selected",
      deleteSelected: "Delete selected",
      removeDirTitle: "Delete folder",
      removeDirText: "Delete “{name}” and all subfolders? Sites are kept; only folder links are removed.",
      dirName: "Folder name",
      create: "Create",
      renameTitle: "Rename folder",
      bulkConfirm: "Delete {n} selected sites?",
      opFail: "Operation failed: {msg}",
      loadFail: "Load failed: {msg}",
      saved: "Saved",
      deleted: "Deleted",
      moved: "Moved",
    },
  };

  function text(lang, key, vars) {
    var dict = COPY[lang] || COPY.zh;
    var value = dict[key] !== undefined ? dict[key] : COPY.zh[key] || key;
    if (vars) {
      Object.keys(vars).forEach(function (k) {
        value = value.split("{" + k + "}").join(String(vars[k]));
      });
    }
    return value;
  }

  // 站点依赖标签子插件：以宿主已安装/启用列表为准；旧宿主没有列表时返回 true，交给后端 capabilities 判断。
  function hostHasAddon(id) {
    var list = host.addons;
    if (!Array.isArray(list)) return true;
    return list.some(function (a) { return a && a.id === id && a.enabled !== false; });
  }

  var cssText = [
    ".wbs-root{--wbs-line:color-mix(in srgb, var(--dsw-alias-label-primary,#1f2328) 13%, transparent);--wbs-soft:color-mix(in srgb, var(--dsw-alias-label-primary,#1f2328) 4.5%, transparent);--wbs-accent:var(--dsw-alias-accent,#0a8f7d);--wbs-muted:color-mix(in srgb, var(--dsw-alias-label-primary,#1f2328) 58%, transparent);display:flex;flex-direction:column;min-height:560px;color:var(--dsw-alias-label-primary,#1f2328);font-size:13px}",
    ".wbs-grow{flex:1;min-width:0}",
    ".wbs-head{display:flex;align-items:center;gap:10px;margin:2px 0 14px}",
    ".wbs-head h2{margin:0;font-size:21px;font-weight:650;letter-spacing:.01em}",
    ".wbs-count{font-size:12px;color:var(--wbs-muted)}",
    ".wbs-btn{appearance:none;border:1px solid var(--wbs-line);background:transparent;color:inherit;border-radius:8px;padding:6px 10px;font-size:12px;cursor:pointer;line-height:1.35;white-space:nowrap;font-family:inherit}",
    ".wbs-btn:hover{background:var(--wbs-soft)}",
    ".wbs-btn.primary{background:var(--wbs-accent);color:#fff;border-color:transparent}",
    ".wbs-btn.primary:hover{filter:brightness(1.06)}",
    ".wbs-btn.danger{color:#bd3b32;border-color:color-mix(in srgb,#bd3b32 34%,transparent)}",
    ".wbs-btn.danger:hover{background:color-mix(in srgb,#bd3b32 8%,transparent)}",
    ".wbs-btn.sm{padding:3px 7px;font-size:11px;border-radius:6px}",
    ".wbs-btn:disabled{opacity:.5;cursor:not-allowed}",
    ".wbs-body{display:flex;gap:16px;align-items:flex-start;flex:1;min-height:0}",
    ".wbs-tree{width:236px;flex:none;border:1px solid var(--wbs-line);border-radius:12px;background:color-mix(in srgb,var(--dsw-alias-bg-layer-1,#fff) 62%,transparent);padding:8px;max-height:calc(100vh - 220px);overflow:auto}",
    ".wbs-tree-top{display:flex;align-items:center;gap:6px;padding:3px 4px 8px;border-bottom:1px solid var(--wbs-line);margin-bottom:6px}",
    ".wbs-tree-title{font-size:12px;font-weight:600;color:var(--wbs-muted);flex:1}",
    ".wbs-node{display:flex;align-items:center;gap:3px;padding:4px 5px;border-radius:7px;cursor:pointer;min-height:27px;box-sizing:border-box}",
    ".wbs-node:hover{background:var(--wbs-soft)}",
    ".wbs-node.active{background:color-mix(in srgb,var(--wbs-accent) 13%,transparent);color:var(--wbs-accent);font-weight:600}",
    ".wbs-caret{width:16px;flex:none;text-align:center;font-size:10px;opacity:.65}",
    ".wbs-node-name{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
    ".wbs-node-actions{display:none;align-items:center;gap:1px;flex:none}",
    ".wbs-node:hover .wbs-node-actions{display:flex}",
    ".wbs-mini{appearance:none;border:0;background:transparent;color:var(--wbs-muted);border-radius:4px;cursor:pointer;font-size:12px;line-height:1;padding:3px 4px;font-family:inherit}",
    ".wbs-mini:hover{background:var(--wbs-line);color:inherit}",
    ".wbs-main{flex:1;min-width:0;display:flex;flex-direction:column;gap:10px}",
    ".wbs-crumbs{display:flex;align-items:center;gap:4px;flex-wrap:wrap;font-size:12px;min-height:22px}",
    ".wbs-crumb{appearance:none;border:0;background:transparent;color:var(--wbs-muted);padding:3px 4px;border-radius:5px;cursor:pointer;font-family:inherit;font-size:12px}",
    ".wbs-crumb:hover{background:var(--wbs-soft);color:inherit}",
    ".wbs-crumb.cur{color:inherit;font-weight:600}",
    ".wbs-sep{opacity:.4;font-size:10px}",
    ".wbs-toolbar{display:flex;align-items:center;gap:8px;flex-wrap:wrap}",
    ".wbs-search{display:flex;align-items:center;gap:6px;border:1px solid var(--wbs-line);border-radius:8px;padding:0 8px;background:color-mix(in srgb,var(--dsw-alias-bg-layer-1,#fff) 58%,transparent);min-width:210px;flex:0 1 300px}",
    ".wbs-search input{border:0;outline:0;background:transparent;color:inherit;font:inherit;padding:7px 0;flex:1;min-width:0}",
    ".wbs-search button{border:0;background:transparent;color:var(--wbs-muted);cursor:pointer;font-size:12px;padding:3px}",
    ".wbs-tagfilter{position:relative}",
    ".wbs-tagmenu{position:absolute;z-index:30;top:calc(100% + 6px);left:0;width:230px;max-height:300px;overflow:auto;background:var(--dsw-alias-bg-layer-1,#fffdf7);border:1px solid var(--wbs-line);border-radius:10px;box-shadow:0 12px 30px rgba(0,0,0,.14);padding:8px}",
    ".wbs-tagmenu-head{display:flex;align-items:center;gap:6px;font-size:11px;color:var(--wbs-muted);padding:2px 4px 7px}",
    ".wbs-tagopt{display:flex;align-items:center;gap:7px;padding:6px;border-radius:6px;cursor:pointer;font-size:12px}",
    ".wbs-tagopt:hover{background:var(--wbs-soft)}",
    ".wbs-tablewrap{border:1px solid var(--wbs-line);border-radius:12px;overflow:auto;background:color-mix(in srgb,var(--dsw-alias-bg-layer-1,#fff) 55%,transparent)}",
    ".wbs-table{width:100%;border-collapse:collapse;table-layout:fixed}",
    ".wbs-table th{font-size:11px;font-weight:600;color:var(--wbs-muted);text-align:left;padding:9px 9px;border-bottom:1px solid var(--wbs-line);white-space:nowrap;background:color-mix(in srgb,var(--dsw-alias-bg-layer-2,#f4f1e4) 55%,transparent)}",
    ".wbs-table td{padding:10px 9px;border-bottom:1px solid color-mix(in srgb,var(--wbs-line) 68%,transparent);vertical-align:top}",
    ".wbs-table tr:last-child td{border-bottom:0}",
    ".wbs-table tbody tr:hover td{background:color-mix(in srgb,var(--wbs-accent) 3.5%,transparent)}",
    ".wbs-th-sort{cursor:pointer;user-select:none}",
    ".wbs-th-sort:hover{color:inherit}",
    ".wbs-site-name{font-weight:600;font-size:13px;word-break:break-word}",
    ".wbs-site-desc{font-size:12px;color:var(--wbs-muted);margin-top:3px;word-break:break-word}",
    ".wbs-site-link{display:inline-block;margin-top:4px;font-size:11.5px;color:var(--wbs-accent);text-decoration:none;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;vertical-align:top}",
    ".wbs-site-link:hover{text-decoration:underline}",
    ".wbs-muted{color:var(--wbs-muted)}",
    ".wbs-chip{display:inline-flex;align-items:center;gap:4px;border:1px solid var(--wbs-line);border-radius:999px;padding:2px 7px;font-size:11px;margin:0 4px 3px 0;background:color-mix(in srgb,var(--wbs-accent) 6%,transparent);max-width:100%}",
    ".wbs-chip button{border:0;background:transparent;color:inherit;cursor:pointer;padding:0;font-size:11px;opacity:.65}",
    ".wbs-actions{display:flex;gap:4px;flex-wrap:wrap}",
    ".wbs-expand td{background:color-mix(in srgb,var(--dsw-alias-bg-layer-2,#f4f1e4) 52%,transparent);padding:10px 12px}",
    ".wbs-subtable{width:100%;border-collapse:collapse;font-size:12px}",
    ".wbs-subtable th{font-size:10px;color:var(--wbs-muted);text-align:left;padding:3px 6px;border-bottom:1px solid var(--wbs-line)}",
    ".wbs-subtable td{padding:5px 6px;border-bottom:1px solid color-mix(in srgb,var(--wbs-line) 45%,transparent);word-break:break-all}",
    ".wbs-dirpath{line-height:1.7}",
    ".wbs-empty{text-align:center;padding:52px 12px;color:var(--wbs-muted)}",
    ".wbs-empty b{display:block;color:inherit;font-size:14px;margin-bottom:6px}",
    ".wbs-pager{display:flex;align-items:center;gap:8px;justify-content:flex-end;padding:2px 0;font-size:12px;color:var(--wbs-muted);flex-wrap:wrap}",
    ".wbs-pager select{border:1px solid var(--wbs-line);border-radius:6px;background:transparent;color:inherit;font:inherit;padding:4px 6px}",
    ".wbs-loading{padding:24px;text-align:center;color:var(--wbs-muted);font-size:12px}",
    ".wbs-error{padding:10px 12px;border:1px solid color-mix(in srgb,#bd3b32 30%,transparent);background:color-mix(in srgb,#bd3b32 6%,transparent);border-radius:8px;color:#a4312a;font-size:12px}",
    ".wbs-toast{position:fixed;left:50%;bottom:38px;transform:translateX(-50%);z-index:1200;background:#26302d;color:#fff;border-radius:8px;padding:8px 14px;font-size:12px;box-shadow:0 8px 24px rgba(0,0,0,.22);max-width:80vw}",
    ".wbs-toast.err{background:#9d332b}",
    ".wbs-mask{position:fixed;inset:0;z-index:900;background:rgba(24,28,26,.34);display:flex;align-items:center;justify-content:center;padding:22px}",
    ".wbs-modal{width:min(700px,96vw);max-height:88vh;overflow:auto;background:var(--dsw-alias-bg-layer-1,#fffdf7);border:1px solid var(--wbs-line);border-radius:14px;box-shadow:0 24px 70px rgba(0,0,0,.24);padding:18px}",
    ".wbs-modal.small{width:min(430px,94vw)}",
    ".wbs-modal-title{display:flex;align-items:center;gap:8px;font-size:16px;font-weight:650;margin-bottom:4px}",
    ".wbs-modal-sub{font-size:12px;color:var(--wbs-muted);margin-bottom:14px;line-height:1.6}",
    ".wbs-steps{display:flex;gap:6px;margin:2px 0 16px;flex-wrap:wrap}",
    ".wbs-step{font-size:11px;color:var(--wbs-muted);padding:4px 8px;border-radius:999px;border:1px solid transparent}",
    ".wbs-step.on{color:var(--wbs-accent);border-color:color-mix(in srgb,var(--wbs-accent) 30%,transparent);background:color-mix(in srgb,var(--wbs-accent) 8%,transparent);font-weight:600}",
    ".wbs-label{font-size:12px;font-weight:600;margin:12px 0 5px;display:block}",
    ".wbs-input,.wbs-textarea,.wbs-select{width:100%;box-sizing:border-box;border:1px solid var(--wbs-line);border-radius:8px;background:color-mix(in srgb,var(--dsw-alias-bg-layer-1,#fff) 55%,transparent);color:inherit;font:inherit;font-size:13px;padding:8px 9px;outline:0}",
    ".wbs-input:focus,.wbs-textarea:focus{border-color:var(--wbs-accent)}",
    ".wbs-textarea{min-height:70px;resize:vertical;line-height:1.6}",
    ".wbs-linkrow{display:grid;grid-template-columns:1fr 1.5fr auto auto;gap:6px;align-items:center;margin-bottom:6px}",
    ".wbs-linkrow .wbs-input{font-size:12px;padding:6px 8px}",
    ".wbs-radio{display:flex;align-items:center;gap:4px;font-size:11px;white-space:nowrap;color:var(--wbs-muted);cursor:pointer}",
    ".wbs-dirlist{border:1px solid var(--wbs-line);border-radius:9px;max-height:300px;overflow:auto;padding:5px}",
    ".wbs-dircheck{display:flex;align-items:center;gap:6px;padding:5px 6px;border-radius:6px;cursor:pointer;font-size:12px}",
    ".wbs-dircheck:hover{background:var(--wbs-soft)}",
    ".wbs-dircheck input{margin:0}",
    ".wbs-tagsearch{display:flex;gap:6px;align-items:center}",
    ".wbs-tagresults{border:1px solid var(--wbs-line);border-radius:9px;max-height:190px;overflow:auto;margin-top:7px;padding:4px}",
    ".wbs-tagresult{width:100%;text-align:left;border:0;background:transparent;color:inherit;padding:6px;border-radius:6px;cursor:pointer;font:inherit;font-size:12px}",
    ".wbs-tagresult:hover{background:var(--wbs-soft)}",
    ".wbs-tagresult.on{background:color-mix(in srgb,var(--wbs-accent) 10%,transparent);color:var(--wbs-accent)}",
    ".wbs-chips{display:flex;flex-wrap:wrap;gap:5px;margin-top:7px;min-height:10px}",
    ".wbs-formfoot{display:flex;align-items:center;gap:8px;margin-top:18px;padding-top:14px;border-top:1px solid var(--wbs-line)}",
    ".wbs-formerr{color:#b5392f;font-size:12px;flex:1;min-width:0}",
    ".wbs-note{font-size:11px;color:var(--wbs-muted);line-height:1.6}",
    "@media(max-width:860px){.wbs-body{flex-direction:column}.wbs-tree{width:100%;max-height:220px}.wbs-table{min-width:760px}.wbs-root{min-height:0}}",
    "@media(max-width:600px){.wbs-head h2{font-size:18px}.wbs-linkrow{grid-template-columns:1fr 1fr}.wbs-modal{padding:14px}}"
  ].join("\n");

  function injectCss() {
    var id = "wb-addon-sites-css";
    var el = document.getElementById(id);
    if (!el) {
      el = document.createElement("style");
      el.id = id;
      document.head.appendChild(el);
    }
    if (el.textContent !== cssText) el.textContent = cssText;
  }

  function errText(e) {
    if (!e) return "未知错误";
    return String(e.message || e);
  }

  function callApi(api, name, args) {
    return api.call(name, args || {}).then(function (r) {
      if (!r || r.ok !== true) throw new Error((r && r.error) || "请求失败");
      return r.result;
    });
  }

  function pathLabel(path) {
    return (path || []).map(function (p) { return p.name; }).join(" / ");
  }

  function flattenTree(nodes, depth, out) {
    out = out || [];
    (nodes || []).forEach(function (node) {
      out.push({ node: node, depth: depth || 0 });
      if (node.children && node.children.length) flattenTree(node.children, (depth || 0) + 1, out);
    });
    return out;
  }

  function Modal(props) {
    return h("div", {
      className: "wbs-mask",
      onMouseDown: function (e) {
        if (e.target === e.currentTarget && props.onClose) props.onClose();
      },
    }, h("div", { className: "wbs-modal" + (props.small ? " small" : "") }, props.children));
  }

  function SiteFormModal(props) {
    var api = props.api;
    var lang = props.lang || "zh";
    var mode = props.mode;
    var site = props.site;
    var current = props.current || { id: "0", path: [] };
    var tagOn = !!props.tagOn;
    var maxStep = tagOn ? 2 : 1;
    var [step, setStep] = useState(0);
    var [name, setName] = useState(site ? site.siteName : "");
    var [desc, setDesc] = useState(site ? site.description : "");
    var [links, setLinks] = useState(function () {
      if (site && site.siteLinks && site.siteLinks.length) {
        return site.siteLinks.map(function (l) {
          return { description: l.description || "", link: l.link || "" };
        });
      }
      return [{ description: "", link: "" }];
    });
    var [defaultIdx, setDefaultIdx] = useState(function () {
      if (site && site.siteLinks) {
        var idx = site.siteLinks.findIndex(function (l) { return l.isDefault; });
        if (idx >= 0) return idx;
      }
      return 0;
    });
    var [dirTree, setDirTree] = useState([]);
    var [dirIds, setDirIds] = useState(function () {
      if (site && site.dirs && site.dirs.length) return site.dirs.map(function (d) { return d.id; });
      return current.id !== "0" ? [current.id] : [];
    });
    var [tags, setTags] = useState(site && site.tags ? site.tags.slice() : []);
    var [tagQuery, setTagQuery] = useState("");
    var [tagResults, setTagResults] = useState([]);
    var [error, setError] = useState("");
    var [saving, setSaving] = useState(false);

    useEffect(function () {
      callApi(api, "siteNodes.tree").then(function (rows) { setDirTree(rows || []); }).catch(function (e) {
        setError(errText(e));
      });
    }, []);

    useEffect(function () {
      if (!tagOn) {
        setTagResults([]);
        return;
      }
      var alive = true;
      var timer = setTimeout(function () {
        callApi(api, "siteTags.search", { text: tagQuery, pageSize: 50 }).then(function (r) {
          if (alive) setTagResults(r.records || []);
        }).catch(function () {
          if (alive) setTagResults([]);
        });
      }, 220);
      return function () { alive = false; clearTimeout(timer); };
    }, [tagQuery, tagOn]);

    var flatDirs = useMemo(function () { return flattenTree(dirTree, 0); }, [dirTree]);

    function toggleDir(id) {
      setDirIds(function (prev) {
        if (prev.indexOf(id) >= 0) return prev.filter(function (x) { return x !== id; });
        return prev.concat([id]);
      });
    }

    function toggleTag(tag) {
      setTags(function (prev) {
        if (prev.some(function (x) { return x.id === tag.id; })) {
          return prev.filter(function (x) { return x.id !== tag.id; });
        }
        return prev.concat([tag]);
      });
    }

    function updateLink(index, key, value) {
      setLinks(function (prev) {
        return prev.map(function (l, i) { return i === index ? Object.assign({}, l, { [key]: value }) : l; });
      });
    }

    function addLink() {
      setLinks(function (prev) { return prev.concat([{ description: "", link: "" }]); });
    }

    function removeLink(index) {
      setLinks(function (prev) {
        var next = prev.filter(function (_, i) { return i !== index; });
        return next.length ? next : [{ description: "", link: "" }];
      });
      if (defaultIdx === index) setDefaultIdx(0);
      else if (defaultIdx > index) setDefaultIdx(defaultIdx - 1);
    }

    function validate(toStep) {
      if (toStep >= 1 && !String(name).trim()) {
        setError(text(lang, "requiredName"));
        return false;
      }
      if (toStep >= 2 && !dirIds.length) {
        setError(text(lang, "requiredDirs"));
        return false;
      }
      setError("");
      return true;
    }

    function next() {
      if (step >= maxStep) return;
      if (!validate(step + 1)) return;
      setStep(step + 1);
    }

    function save() {
      if (!validate(2)) return;
      setSaving(true);
      setError("");
      var siteLinks = links.filter(function (l) {
        return String(l.link || "").trim() || String(l.description || "").trim();
      }).map(function (l, i) {
        return { description: String(l.description || "").trim(), link: String(l.link || "").trim(), isDefault: i === defaultIdx };
      });
      var payload = {
        siteName: String(name).trim(),
        description: String(desc || "").trim(),
        siteLinks: siteLinks,
        dirIds: dirIds,
      };
      if (tagOn) payload.tagIds = tags.map(function (t) { return t.id; });
      var p;
      if (mode === "edit" && site) {
        p = callApi(api, "sites.update", Object.assign({ id: site.id }, payload));
      } else {
        p = callApi(api, "sites.create", payload);
      }
      p.then(function () {
        setSaving(false);
        props.onSaved();
      }).catch(function (e) {
        setSaving(false);
        setError(errText(e));
      });
    }

    var steps = tagOn
      ? [text(lang, "step1"), text(lang, "step2"), text(lang, "step3")]
      : [text(lang, "step1"), text(lang, "step2")];
    var title = mode === "edit" ? text(lang, "editTitle") : text(lang, "createTitle");

    return h(Modal, { onClose: saving ? null : props.onClose },
      h("div", { className: "wbs-modal-title" }, title),
      h("div", { className: "wbs-steps" }, steps.map(function (s, i) {
        return h("span", { key: i, className: "wbs-step" + (i === step ? " on" : "") }, (i + 1) + " · " + s);
      })),

      step === 0 ? h("div", null,
        h("label", { className: "wbs-label" }, text(lang, "siteName")),
        h("input", {
          className: "wbs-input",
          value: name,
          autoFocus: true,
          placeholder: text(lang, "siteNamePh"),
          onChange: function (e) { setName(e.target.value); },
        }),
        h("label", { className: "wbs-label" }, text(lang, "desc")),
        h("textarea", {
          className: "wbs-textarea",
          value: desc,
          placeholder: text(lang, "descPh"),
          onChange: function (e) { setDesc(e.target.value); },
        }),
        h("label", { className: "wbs-label" }, text(lang, "linkList")),
        links.map(function (l, i) {
          return h("div", { className: "wbs-linkrow", key: i },
            h("input", {
              className: "wbs-input",
              value: l.description,
              placeholder: text(lang, "linkDesc"),
              onChange: function (e) { updateLink(i, "description", e.target.value); },
            }),
            h("input", {
              className: "wbs-input",
              value: l.link,
              placeholder: text(lang, "linkUrl"),
              onChange: function (e) { updateLink(i, "link", e.target.value); },
            }),
            h("label", { className: "wbs-radio", title: text(lang, "setDefault") },
              h("input", {
                type: "radio",
                name: "wbs-default-link",
                checked: defaultIdx === i,
                onChange: function () { setDefaultIdx(i); },
              }),
              text(lang, "default"),
            ),
            h("button", { type: "button", className: "wbs-mini", onClick: function () { removeLink(i); } }, text(lang, "removeLink")),
          );
        }),
        h("button", { type: "button", className: "wbs-btn sm", onClick: addLink }, text(lang, "addLink")),
      ) : null,

      step === 1 ? h("div", null,
        h("div", { className: "wbs-label" }, text(lang, "chooseDirs")),
        !flatDirs.length ? h("div", { className: "wbs-note" }, text(lang, "noDirs")) : h("div", { className: "wbs-dirlist" },
          flatDirs.map(function (item) {
            var id = String(item.node.id);
            return h("label", {
              key: id,
              className: "wbs-dircheck",
              style: { paddingLeft: 6 + item.depth * 16 },
            },
              h("input", {
                type: "checkbox",
                checked: dirIds.indexOf(id) >= 0,
                onChange: function () { toggleDir(id); },
              }),
              h("span", null, item.node.name),
            );
          }),
        ),
        h("div", { className: "wbs-note", style: { marginTop: 8 } }, "站点可同时挂在多个目录下；列表会按目录子树过滤。"),
      ) : null,

      tagOn && step === 2 ? h("div", null,
        h("div", { className: "wbs-label" }, text(lang, "chooseTags")),
        tags.length ? h("div", { className: "wbs-chips" }, tags.map(function (t) {
          return h("span", { className: "wbs-chip", key: t.id }, t.name,
            h("button", { type: "button", onClick: function () { toggleTag(t); }, title: "移除" }, "×"));
        })) : h("div", { className: "wbs-note" }, "暂未选择标签"),
        h("div", { className: "wbs-tagsearch", style: { marginTop: 10 } },
          h("input", {
            className: "wbs-input",
            value: tagQuery,
            placeholder: text(lang, "tagSearch"),
            onChange: function (e) { setTagQuery(e.target.value); },
          }),
        ),
        h("div", { className: "wbs-tagresults" }, tagResults.length ? tagResults.map(function (t) {
          var on = tags.some(function (x) { return x.id === t.id; });
          return h("button", {
            key: t.id,
            type: "button",
            className: "wbs-tagresult" + (on ? " on" : ""),
            onClick: function () { toggleTag(t); },
          }, (on ? "✓ " : "＋ ") + t.name);
        }) : h("div", { className: "wbs-note", style: { padding: 6 } }, text(lang, "noTags"))),
        h("div", { className: "wbs-note", style: { marginTop: 8 } }, "标签由标签子插件提供，可多选。"),
      ) : null,

      h("div", { className: "wbs-formfoot" },
        h("div", { className: "wbs-formerr" }, error || ""),
        step > 0 ? h("button", { type: "button", className: "wbs-btn", disabled: saving, onClick: function () { setStep(step - 1); } }, text(lang, "back")) : null,
        h("button", { type: "button", className: "wbs-btn", disabled: saving, onClick: props.onClose }, text(lang, "cancel")),
        step < maxStep
          ? h("button", { type: "button", className: "wbs-btn primary", onClick: next }, text(lang, "nextStep"))
          : h("button", { type: "button", className: "wbs-btn primary", disabled: saving, onClick: save }, saving ? text(lang, "saving") : text(lang, "save")),
      ),
    );
  }

  function DirModal(props) {
    var api = props.api;
    var lang = props.lang || "zh";
    var dlg = props.dlg;
    var [name, setName] = useState(dlg.name || "");
    var [error, setError] = useState("");
    var [saving, setSaving] = useState(false);
    var isDelete = dlg.mode === "delete";
    var title = isDelete ? text(lang, "removeDirTitle") : dlg.mode === "rename" ? text(lang, "renameTitle") : text(lang, "addDir");

    function submit() {
      if (!isDelete && !String(name).trim()) {
        setError(text(lang, "requiredName"));
        return;
      }
      setSaving(true);
      setError("");
      var p;
      if (isDelete) p = callApi(api, "siteNodes.delete", { id: dlg.id });
      else if (dlg.mode === "rename") p = callApi(api, "siteNodes.rename", { id: dlg.id, name: String(name).trim() });
      else p = callApi(api, "siteNodes.create", { parentId: dlg.parentId || "0", name: String(name).trim() });
      p.then(function () {
        setSaving(false);
        props.onDone();
      }).catch(function (e) {
        setSaving(false);
        setError(errText(e));
      });
    }

    return h(Modal, { small: true, onClose: saving ? null : props.onClose },
      h("div", { className: "wbs-modal-title" }, title),
      isDelete
        ? h("div", { className: "wbs-modal-sub" }, text(lang, "removeDirText", { name: dlg.name || "" }))
        : h("div", null,
          h("label", { className: "wbs-label" }, text(lang, "dirName")),
          h("input", {
            className: "wbs-input",
            value: name,
            autoFocus: true,
            placeholder: "未命名",
            onChange: function (e) { setName(e.target.value); },
            onKeyDown: function (e) { if (e.key === "Enter") submit(); },
          }),
        ),
      h("div", { className: "wbs-formfoot" },
        h("div", { className: "wbs-formerr" }, error || ""),
        h("button", { className: "wbs-btn", disabled: saving, onClick: props.onClose }, text(lang, "cancel")),
        h("button", { className: "wbs-btn primary" + (isDelete ? " danger" : ""), disabled: saving, onClick: submit },
          saving ? "…" : isDelete ? text(lang, "confirm") : dlg.mode === "rename" ? text(lang, "save") : text(lang, "create")),
      ),
    );
  }

  function DeleteSiteModal(props) {
    var api = props.api;
    var lang = props.lang || "zh";
    var site = props.site;
    var [saving, setSaving] = useState(false);
    var [error, setError] = useState("");

    function submit() {
      setSaving(true);
      setError("");
      callApi(api, "sites.delete", { id: site.id }).then(function () {
        setSaving(false);
        props.onDone();
      }).catch(function (e) {
        setSaving(false);
        setError(errText(e));
      });
    }

    return h(Modal, { small: true, onClose: saving ? null : props.onClose },
      h("div", { className: "wbs-modal-title" }, text(lang, "deleteTitle")),
      h("div", { className: "wbs-modal-sub" }, text(lang, "deleteText", { name: site.siteName })),
      error ? h("div", { className: "wbs-error" }, error) : null,
      h("div", { className: "wbs-formfoot" },
        h("div", { className: "wbs-grow" }),
        h("button", { className: "wbs-btn", disabled: saving, onClick: props.onClose }, text(lang, "cancel")),
        h("button", { className: "wbs-btn danger", disabled: saving, onClick: submit }, saving ? "…" : text(lang, "confirm")),
      ),
    );
  }

  function SitesView(props) {
    var api = props.api;
    var lang = props.lang || "zh";
    var [kids, setKids] = useState({});
    var kidsRef = useRef({});
    var [expanded, setExpanded] = useState({});
    var [current, setCurrent] = useState({ id: "0", path: [] });
    var [sites, setSites] = useState([]);
    var [total, setTotal] = useState(0);
    var [page, setPage] = useState(1);
    var [pageSize, setPageSize] = useState(16);
    var [textQuery, setTextQuery] = useState("");
    var [searchInput, setSearchInput] = useState("");
    var [tagFilter, setTagFilter] = useState([]);
    var [allTags, setAllTags] = useState([]);
    var [tagMenu, setTagMenu] = useState(false);
    var [tagOn, setTagOn] = useState(false);
    var tagOnRef = useRef(false);
    var [sortCol, setSortCol] = useState("update_time");
    var [sortOrder, setSortOrder] = useState("desc");
    var [loading, setLoading] = useState(false);
    var [error, setError] = useState("");
    var [tick, setTick] = useState(0);
    var [expandedRow, setExpandedRow] = useState(null);
    var [selected, setSelected] = useState({});
    var [editing, setEditing] = useState(null);
    var [dirDlg, setDirDlg] = useState(null);
    var [deleting, setDeleting] = useState(null);
    var [toast, setToast] = useState(null);
    var dragRef = useRef("");

    var tagKey = tagFilter.slice().sort().join(",");

    function showToast(msg, kind) {
      setToast({ msg: msg, kind: kind || "" });
    }

    useEffect(function () {
      if (!toast) return;
      var timer = setTimeout(function () { setToast(null); }, 2600);
      return function () { clearTimeout(timer); };
    }, [toast]);

    function refreshTree() {
      return callApi(api, "siteNodes.children", { id: 0 }).then(function (root) {
        var map = { "0": root || [] };
        var ids = Object.keys(kidsRef.current).filter(function (id) { return id !== "0"; });
        return Promise.all(ids.map(function (id) {
          return callApi(api, "siteNodes.children", { id: id }).then(function (rows) {
            map[id] = rows || [];
          }).catch(function () {});
        })).then(function () {
          kidsRef.current = map;
          setKids(map);
        });
      }).catch(function (e) {
        showToast(text(lang, "loadFail", { msg: errText(e) }), "err");
      });
    }

    function loadChildren(id) {
      return callApi(api, "siteNodes.children", { id: id }).then(function (rows) {
        var map = Object.assign({}, kidsRef.current);
        map[id] = rows || [];
        kidsRef.current = map;
        setKids(map);
      });
    }

    function loadAllTags() {
      if (!tagOnRef.current) return Promise.resolve([]);
      return callApi(api, "siteTags.search", { pageSize: 100 }).then(function (r) {
        setAllTags(r.records || []);
      }).catch(function () {});
    }

    useEffect(function () {
      refreshTree();
      callApi(api, "sites.capabilities").then(function (r) {
        var on = !!(r && r.tags) && hostHasAddon("wb-addon-tags");
        tagOnRef.current = on;
        setTagOn(on);
        if (!on) {
          setTagFilter([]);
          setTagMenu(false);
        } else {
          loadAllTags();
        }
      }).catch(function () {
        tagOnRef.current = false;
        setTagOn(false);
      });
    }, []);

    useEffect(function () {
      var off = api.subscribe(function (msg) {
        if (!msg) return;
        if (msg.event === "sites-changed") setTick(function (x) { return x + 1; });
        if (msg.event === "tags-changed") loadAllTags();
        if (msg.event === "site-nodes-changed") {
          setTick(function (x) { return x + 1; });
          refreshTree();
        }
      });
      return function () { if (typeof off === "function") off(); };
    }, []);

    useEffect(function () {
      var alive = true;
      setLoading(true);
      setError("");
      callApi(api, "sites.list", {
        nodeId: current.id,
        text: textQuery,
        tagIds: tagFilter,
        pageNumber: page,
        pageSize: pageSize,
        sortColumn: sortCol,
        sortOrder: sortOrder,
      }).then(function (r) {
        if (!alive) return;
        setSites(r.records || []);
        setTotal(Number(r.total || 0));
      }).catch(function (e) {
        if (!alive) return;
        setSites([]);
        setTotal(0);
        setError(text(lang, "loadFail", { msg: errText(e) }));
      }).finally(function () {
        if (alive) setLoading(false);
      });
      return function () { alive = false; };
    }, [current.id, textQuery, tagKey, page, pageSize, sortCol, sortOrder, tick]);

    useEffect(function () {
      if (current.id === "0") return;
      var alive = true;
      callApi(api, "siteNodes.path", { id: current.id }).then(function (rows) {
        if (!alive) return;
        if (!rows || !rows.length) {
          setCurrent({ id: "0", path: [] });
          return;
        }
        setCurrent({ id: current.id, path: rows });
      }).catch(function () {});
      return function () { alive = false; };
    }, [current.id, tick]);

    function selectDir(id) {
      if (id === "0") {
        setCurrent({ id: "0", path: [] });
        setPage(1);
        return;
      }
      callApi(api, "siteNodes.path", { id: id }).then(function (rows) {
        if (!rows || !rows.length) return;
        setCurrent({ id: id, path: rows });
        setPage(1);
      }).catch(function (e) {
        showToast(text(lang, "opFail", { msg: errText(e) }), "err");
      });
    }

    function toggleNode(node) {
      var open = !!expanded[node.id];
      if (!open && !Object.prototype.hasOwnProperty.call(kidsRef.current, node.id)) {
        loadChildren(node.id).catch(function (e) { showToast(errText(e), "err"); });
      }
      setExpanded(function (prev) {
        var next = Object.assign({}, prev);
        if (open) delete next[node.id];
        else next[node.id] = true;
        return next;
      });
    }

    function onDropNode(e, target) {
      e.preventDefault();
      e.stopPropagation();
      var sourceId = dragRef.current;
      dragRef.current = "";
      if (!sourceId || sourceId === target.id) return;
      var moveType = expanded[target.id] ? 0 : 2;
      callApi(api, "siteNodes.move", { sourceId: sourceId, targetId: target.id, moveType: moveType }).then(function () {
        showToast(text(lang, "moved"));
        refreshTree();
        setTick(function (x) { return x + 1; });
      }).catch(function (e) {
        showToast(text(lang, "opFail", { msg: errText(e) }), "err");
      });
    }

    function renderNode(node, depth) {
      var open = !!expanded[node.id];
      var list = kids[node.id] || [];
      return h("div", { key: node.id },
        h("div", {
          className: "wbs-node" + (current.id === String(node.id) ? " active" : ""),
          style: { paddingLeft: 4 + depth * 14 },
          draggable: true,
          onDragStart: function (e) { dragRef.current = String(node.id); e.dataTransfer.effectAllowed = "move"; },
          onDragOver: function (e) { e.preventDefault(); },
          onDrop: function (e) { onDropNode(e, node); },
        },
          h("span", { className: "wbs-caret", onClick: function (e) { e.stopPropagation(); toggleNode(node); } }, open ? "▾" : "▸"),
          h("span", { className: "wbs-node-name", onClick: function () { selectDir(String(node.id)); }, title: node.name }, node.name),
          h("span", { className: "wbs-node-actions" },
            h("button", { className: "wbs-mini", title: text(lang, "addChild"), onClick: function (e) { e.stopPropagation(); setDirDlg({ mode: "create", parentId: String(node.id), name: "" }); } }, "＋"),
            h("button", { className: "wbs-mini", title: text(lang, "rename"), onClick: function (e) { e.stopPropagation(); setDirDlg({ mode: "rename", id: String(node.id), name: node.name }); } }, "✎"),
            h("button", { className: "wbs-mini", title: text(lang, "remove"), onClick: function (e) { e.stopPropagation(); setDirDlg({ mode: "delete", id: String(node.id), name: node.name }); } }, "×"),
          ),
        ),
        open ? list.map(function (child) { return renderNode(child, depth + 1); }) : null,
      );
    }

    function openCreate() { setEditing({ mode: "create", site: null }); }
    function openEdit(site) { setEditing({ mode: "edit", site: site }); }

    function onSaved() {
      setEditing(null);
      showToast(text(lang, "saved"));
      setTick(function (x) { return x + 1; });
    }

    function onDirDone() {
      var dlg = dirDlg;
      setDirDlg(null);
      setTick(function (x) { return x + 1; });
      refreshTree();
      if (dlg && dlg.mode === "create") {
        var parentId = String(dlg.parentId || "0");
        setExpanded(function (prev) {
          var next = Object.assign({}, prev);
          next[parentId] = true;
          return next;
        });
        loadChildren(parentId).catch(function () {});
      }
      if (dlg && dlg.mode === "delete" && current.path.some(function (p) { return String(p.id) === String(dlg.id); })) {
        setCurrent({ id: "0", path: [] });
      }
    }

    function onSiteDeleted() {
      setDeleting(null);
      showToast(text(lang, "deleted"));
      setTick(function (x) { return x + 1; });
      refreshTree();
    }

    function toggleSelected(id) {
      setSelected(function (prev) {
        var next = Object.assign({}, prev);
        if (next[id]) delete next[id];
        else next[id] = true;
        return next;
      });
    }

    var selectedIds = Object.keys(selected).filter(function (id) { return selected[id]; });
    var allSelected = sites.length > 0 && sites.every(function (s) { return selected[s.id]; });

    function toggleAll() {
      if (allSelected) {
        setSelected(function (prev) {
          var next = Object.assign({}, prev);
          sites.forEach(function (s) { delete next[s.id]; });
          return next;
        });
        return;
      }
      setSelected(function (prev) {
        var next = Object.assign({}, prev);
        sites.forEach(function (s) { next[s.id] = true; });
        return next;
      });
    }

    function deleteSelected() {
      if (!selectedIds.length) return;
      if (!window.confirm(text(lang, "bulkConfirm", { n: selectedIds.length }))) return;
      var chain = Promise.resolve();
      selectedIds.forEach(function (id) {
        chain = chain.then(function () { return callApi(api, "sites.delete", { id: id }); });
      });
      chain.then(function () {
        setSelected({});
        setTick(function (x) { return x + 1; });
        refreshTree();
        showToast(text(lang, "deleted"));
      }).catch(function (e) {
        showToast(text(lang, "opFail", { msg: errText(e) }), "err");
      });
    }

    function sortBy(col) {
      if (sortCol === col) setSortOrder(function (o) { return o === "asc" ? "desc" : "asc"; });
      else { setSortCol(col); setSortOrder("desc"); }
      setPage(1);
    }

    function arrow(col) {
      if (sortCol !== col) return "";
      return sortOrder === "asc" ? " ↑" : " ↓";
    }

    var pages = Math.max(1, Math.ceil(total / pageSize));
    var tagsVisible = tagOn && hostHasAddon("wb-addon-tags");
    var colCount = tagsVisible ? 6 : 5;

    return h("div", { className: "wbs-root" },
      h("div", { className: "wbs-head" },
        h("h2", null, text(lang, "title")),
        h("span", { className: "wbs-count" }, text(lang, "total", { n: total })),
        h("div", { className: "wbs-grow" }),
        h("button", { className: "wbs-btn primary", onClick: openCreate }, text(lang, "newSite")),
      ),
      h("div", { className: "wbs-body" },
        h("aside", { className: "wbs-tree" },
          h("div", { className: "wbs-tree-top" },
            h("span", { className: "wbs-tree-title" }, text(lang, "directory")),
            h("button", { className: "wbs-mini", title: text(lang, "addDir"), onClick: function () { setDirDlg({ mode: "create", parentId: "0", name: "" }); } }, "＋"),
            h("button", { className: "wbs-mini", title: text(lang, "refresh"), onClick: refreshTree }, "↻"),
          ),
          h("div", {
            className: "wbs-node" + (current.id === "0" ? " active" : ""),
            style: { paddingLeft: 4 },
          },
            h("span", { className: "wbs-caret" }, "▾"),
            h("span", { className: "wbs-node-name", onClick: function () { selectDir("0"); } }, text(lang, "all")),
            h("span", { className: "wbs-node-actions" },
              h("button", { className: "wbs-mini", title: text(lang, "addDir"), onClick: function (e) { e.stopPropagation(); setDirDlg({ mode: "create", parentId: "0", name: "" }); } }, "＋"),
            ),
          ),
          (kids["0"] || []).map(function (node) { return renderNode(node, 1); }),
        ),
        h("section", { className: "wbs-main" },
          h("div", { className: "wbs-crumbs" },
            h("button", { className: "wbs-crumb" + (current.id === "0" ? " cur" : ""), onClick: function () { selectDir("0"); } }, text(lang, "all")),
            (current.path || []).map(function (p, i) {
              return h(React.Fragment, { key: String(p.id) },
                h("span", { className: "wbs-sep" }, "›"),
                h("button", {
                  className: "wbs-crumb" + (i === current.path.length - 1 ? " cur" : ""),
                  onClick: function () { setCurrent({ id: String(p.id), path: current.path.slice(0, i + 1) }); setPage(1); },
                }, p.name),
              );
            }),
          ),
          h("div", { className: "wbs-toolbar" },
            h("div", { className: "wbs-search" },
              h("input", {
                value: searchInput,
                placeholder: text(lang, "search"),
                onChange: function (e) { setSearchInput(e.target.value); },
                onKeyDown: function (e) {
                  if (e.key === "Enter") { setTextQuery(searchInput.trim()); setPage(1); }
                },
              }),
              h("button", { title: "搜索", onClick: function () { setTextQuery(searchInput.trim()); setPage(1); } }, "⌕"),
              searchInput ? h("button", { title: "清空", onClick: function () { setSearchInput(""); setTextQuery(""); setPage(1); } }, "×") : null,
            ),
            tagsVisible ? h("div", { className: "wbs-tagfilter" },
              h("button", {
                className: "wbs-btn",
                onClick: function () { setTagMenu(!tagMenu); },
              }, text(lang, "tagFilter") + (tagFilter.length ? " · " + tagFilter.length : "") + " ▾"),
              tagMenu ? h("div", { className: "wbs-tagmenu" },
                h("div", { className: "wbs-tagmenu-head" },
                  h("span", null, text(lang, "allTags")),
                  h("span", { className: "wbs-grow" }),
                  h("button", { className: "wbs-mini", onClick: function () { setTagFilter([]); setPage(1); } }, text(lang, "clear")),
                ),
                allTags.length ? allTags.map(function (t) {
                  var on = tagFilter.indexOf(t.id) >= 0;
                  return h("label", { key: t.id, className: "wbs-tagopt" },
                    h("input", {
                      type: "checkbox",
                      checked: on,
                      onChange: function () {
                        setTagFilter(function (prev) {
                          return on ? prev.filter(function (x) { return x !== t.id; }) : prev.concat([t.id]);
                        });
                        setPage(1);
                      },
                    }),
                    h("span", null, t.name),
                  );
                }) : h("div", { className: "wbs-note", style: { padding: 6 } }, "暂无标签"),
              ) : null,
            ) : null,
            h("div", { className: "wbs-grow" }),
            selectedIds.length ? h("button", { className: "wbs-btn danger", onClick: deleteSelected }, text(lang, "deleteSelected") + " (" + selectedIds.length + ")") : null,
          ),
          error ? h("div", { className: "wbs-error" }, error) : null,
          h("div", { className: "wbs-tablewrap" },
            h("table", { className: "wbs-table" },
              h("colgroup", null,
                h("col", { style: { width: 34 } }),
                h("col", null),
                tagsVisible ? h("col", { style: { width: 150 } }) : null,
                h("col", { style: { width: 112 } }),
                h("col", { style: { width: 112 } }),
                h("col", { style: { width: 190 } }),
              ),
              h("thead", null,
                h("tr", null,
                  h("th", null, h("input", { type: "checkbox", checked: allSelected, onChange: toggleAll, "aria-label": "全选" })),
                  h("th", null, text(lang, "siteCol")),
                  tagsVisible ? h("th", null, text(lang, "tagCol")) : null,
                  h("th", { className: "wbs-th-sort", onClick: function () { sortBy("create_time"); } }, text(lang, "createTime") + arrow("create_time")),
                  h("th", { className: "wbs-th-sort", onClick: function () { sortBy("update_time"); } }, text(lang, "updateTime") + arrow("update_time")),
                  h("th", null, text(lang, "actions")),
                ),
              ),
              h("tbody", null,
                loading ? h("tr", null, h("td", { colSpan: colCount }, h("div", { className: "wbs-loading" }, text(lang, "loading")))) : null,
                !loading && !sites.length ? h("tr", null, h("td", { colSpan: colCount },
                  h("div", { className: "wbs-empty" },
                    h("b", null, text(lang, "empty")),
                    h("span", null, text(lang, "emptyHint")),
                  ),
                )) : null,
                !loading ? sites.map(function (s) {
                  var row = h("tr", { key: s.id },
                    h("td", null, h("input", { type: "checkbox", checked: !!selected[s.id], onChange: function () { toggleSelected(s.id); }, "aria-label": "选择" })),
                    h("td", null,
                      h("div", { className: "wbs-site-name" }, s.siteName),
                      s.description ? h("div", { className: "wbs-site-desc" }, s.description) : h("div", { className: "wbs-site-desc wbs-muted" }, text(lang, "noDesc")),
                      s.defaultLink ? h("a", { className: "wbs-site-link", href: s.defaultLink, target: "_blank", rel: "noreferrer noopener" }, s.defaultLink) : h("div", { className: "wbs-site-desc wbs-muted" }, text(lang, "noLink")),
                    ),
                    tagsVisible ? h("td", null, s.tags && s.tags.length ? s.tags.map(function (t) {
                      return h("span", { className: "wbs-chip", key: t.id }, t.name);
                    }) : h("span", { className: "wbs-muted" }, "—")) : null,
                    h("td", { className: "wbs-muted" }, s.createTime || "—"),
                    h("td", { className: "wbs-muted" }, s.updateTime || "—"),
                    h("td", null,
                      h("div", { className: "wbs-actions" },
                        h("button", { className: "wbs-btn sm", onClick: function () { setExpandedRow(expandedRow && expandedRow.id === s.id && expandedRow.type === "links" ? null : { id: s.id, type: "links" }); } }, text(lang, "links") + " " + (s.siteLinks ? s.siteLinks.length : 0)),
                        h("button", { className: "wbs-btn sm", onClick: function () { setExpandedRow(expandedRow && expandedRow.id === s.id && expandedRow.type === "dirs" ? null : { id: s.id, type: "dirs" }); } }, text(lang, "dirs") + " " + (s.dirs ? s.dirs.length : 0)),
                        h("button", { className: "wbs-btn sm", onClick: function () { openEdit(s); } }, text(lang, "edit")),
                        h("button", { className: "wbs-btn sm danger", onClick: function () { setDeleting(s); } }, text(lang, "del")),
                      ),
                    ),
                  );
                  if (!expandedRow || expandedRow.id !== s.id) return row;
                  var detail = expandedRow.type === "links"
                    ? (s.siteLinks && s.siteLinks.length ? h("table", { className: "wbs-subtable" },
                      h("thead", null, h("tr", null, h("th", null, "描述"), h("th", null, "网址"))),
                      h("tbody", null, s.siteLinks.map(function (l, i) {
                        return h("tr", { key: i },
                          h("td", null, (l.isDefault ? "★ " : "") + (l.description || "—")),
                          h("td", null, l.link ? h("a", { href: l.link, target: "_blank", rel: "noreferrer noopener" }, l.link) : "—"),
                        );
                      })),
                    ) : h("div", { className: "wbs-muted" }, text(lang, "noLink")))
                    : (s.dirs && s.dirs.length ? h("div", { className: "wbs-dirpath" }, s.dirs.map(function (d) {
                      return h("div", { key: d.id }, "📁 " + (d.path || []).map(function (p) { return p.name; }).join(" / "));
                    })) : h("div", { className: "wbs-muted" }, "未关联目录"));
                  return h(React.Fragment, { key: s.id + ":detail" },
                    row,
                    h("tr", { className: "wbs-expand" }, h("td", { colSpan: colCount }, detail)),
                  );
                }) : null,
              ),
            ),
          ),
          h("div", { className: "wbs-pager" },
            h("span", null, "共 " + total + " 条 · 第 " + page + " / " + pages + " 页"),
            h("button", { className: "wbs-btn sm", disabled: page <= 1, onClick: function () { setPage(Math.max(1, page - 1)); } }, text(lang, "prev")),
            h("button", { className: "wbs-btn sm", disabled: page >= pages, onClick: function () { setPage(Math.min(pages, page + 1)); } }, text(lang, "next")),
            h("select", {
              value: pageSize,
              onChange: function (e) { setPageSize(Number(e.target.value)); setPage(1); },
            }, [16, 30, 50].map(function (n) { return h("option", { key: n, value: n }, n + " / 页"); })),
          ),
        ),
      ),

      editing ? h(SiteFormModal, {
        api: api,
        lang: lang,
        mode: editing.mode,
        site: editing.site,
        current: current,
        tagOn: tagsVisible,
        onClose: function () { setEditing(null); },
        onSaved: onSaved,
      }) : null,
      dirDlg ? h(DirModal, {
        api: api,
        lang: lang,
        dlg: dirDlg,
        onClose: function () { setDirDlg(null); },
        onDone: onDirDone,
      }) : null,
      deleting ? h(DeleteSiteModal, {
        api: api,
        lang: lang,
        site: deleting,
        onClose: function () { setDeleting(null); },
        onDone: onSiteDeleted,
      }) : null,
      toast ? h("div", { className: "wbs-toast" + (toast.kind === "err" ? " err" : "") }, toast.msg) : null,
    );
  }

  injectCss();

  host.registerAddon({
    id: "wb-addon-sites",
    version: "1.2.1",
    views: [
      { id: "sites", title: { zh: "站点", en: "Sites" }, component: SitesView },
    ],
  });
      return { name: "dsh-workbench-sites", inject: [], apply: function () {} };
    },
  });
})();
