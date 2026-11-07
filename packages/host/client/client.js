// dsh-workbench 客户端：宿主壳 + 子插件动态视图容器。
// 业务插件（任务/标签/站点）由 DSH 作为独立客户端插件加载，启动时注册到 window.__WB_HOST__。
(function () {
  window.__ModuleLoader__ = window.__ModuleLoader__ || { modules: {}, load: function (m) { this.modules[m.id] = m.factory; } };
  window.__ModuleLoader__.load({
    id: "dsh-workbench-host",
    factory: function (require) {
      "use strict";
      var react = require("react");
      var jsx = require("react/jsx-runtime");
      var h = react.createElement;
      var NS = "workbench";

      var LOCALE = {
        zh: {
          nav: "个人工作台", title: "个人工作台", tagline: "离线优先 · 业务插件由 DSH 安装",
          tab_account: "账号与同步", tab_addons: "子插件",
          back_home: "返回首页", open: "打开", manage: "工作台管理",
          home_hint: "点开卡片进入业务插件；安装与卸载在 DSH 插件管理里",
          account_desc: "登录云端账号，备份与同步数据",
          addons_desc: "安装、升级或卸载子插件",
          no_views: "该子插件没有注册界面", addon_loading: "正在加载子插件界面…", addon_unavailable: "子插件界面不可用",
          views: "个视图",
          addons_installed: "已安装的子插件", addons_cloud: "云端目录",
          install: "安装", upgrade: "升级", installed: "已安装", uninstall: "卸载",
          confirm_uninstall: "确认卸载", installing: "正在安装…", refresh: "刷新目录",
          no_installed: "还没有安装业务插件——在 DSH 插件管理里安装任务记录、标签或站点",
          no_catalog: "云端目录为空或不可达", catalog_loading: "正在读取云端目录…",
          cached_notice: "云端不可达，显示上次缓存的目录", install_failed: "安装失败",
          uninstall_failed: "卸载失败", load_failed: "客户端加载失败", data_kept: "卸载只删代码，数据保留；重装后数据仍在",
          addon_error: "加载异常", source_cloud: "云端", source_local: "本地目录",
          version: "版本", latest: "最新", shell_version: "壳版本", delete: "删除",
          login: "登录", signup: "注册", email: "邮箱", password: "密码", logout: "退出登录",
          logged_in_as: "已登录", not_logged_in: "未登录——数据仅存本机 SQLite",
          sync_now: "立即同步", sync_pushed: "推送", sync_pulled: "拉取", device_name: "本设备",
        },
        en: {
          nav: "Workbench", title: "Personal Workbench", tagline: "Offline-first · addons installed by DSH",
          tab_account: "Account & Sync", tab_addons: "Addons",
          back_home: "Back to home", open: "Open", manage: "Manage",
          home_hint: "Open a card to enter a domain; install or remove plugins in DSH",
          account_desc: "Sign in to back up and sync your data",
          addons_desc: "Install, update or uninstall addons",
          no_views: "This addon has no UI", addon_loading: "Loading addon UI…", addon_unavailable: "Addon UI unavailable",
          views: "views",
          addons_installed: "Installed addons", addons_cloud: "Cloud catalog",
          install: "Install", upgrade: "Update", installed: "Installed", uninstall: "Uninstall",
          confirm_uninstall: "Confirm uninstall", installing: "Installing…", refresh: "Refresh catalog",
          no_installed: "No domains yet — install Tasks, Tags or Sites from DSH plugins",
          no_catalog: "Catalog is empty or unreachable", catalog_loading: "Loading catalog…",
          cached_notice: "Cloud unreachable — showing the cached catalog", install_failed: "Install failed",
          uninstall_failed: "Uninstall failed", load_failed: "client failed to load", data_kept: "Uninstall removes code only; data is kept and reappears after reinstall",
          addon_error: "load error", source_cloud: "cloud", source_local: "local dir",
          version: "version", latest: "latest", shell_version: "shell", delete: "Delete",
          login: "Login", signup: "Sign up", email: "Email", password: "Password", logout: "Log out",
          logged_in_as: "Signed in", not_logged_in: "Not signed in — data stays local",
          sync_now: "Sync now", sync_pushed: "pushed", sync_pulled: "pulled", device_name: "This device",
        },
      };

      // 样式：只用宿主 --dsw-* token，深浅主题自适应（03 文档）
      var CSS = [
        ".wb-root{--wb-line:var(--dsw-alias-border-l2,color-mix(in oklab,currentColor 16%,transparent));--wb-surface:color-mix(in oklab,currentColor 4%,transparent);display:flex;flex-direction:column;height:100%;box-sizing:border-box;overflow:auto;color:inherit;font-size:13px;background:var(--dsw-alias-bg-layer-2,color-mix(in oklab,currentColor 4%,transparent));padding:24px 28px}",
        ".wb-inner{display:flex;flex-direction:column;gap:16px;width:100%;max-width:1040px;margin:0 auto}",
        ".wb-hero{display:flex;align-items:flex-end;justify-content:space-between;gap:16px;flex-wrap:wrap}",
        ".wb-hero h2{margin:0;font-size:18px;font-weight:650;letter-spacing:.2px}",
        ".wb-tag{font-size:12px;opacity:.62;margin-top:4px;display:block;line-height:1.5}",
        ".wb-tabs{display:flex;gap:6px;border-bottom:1px solid var(--wb-line);margin-bottom:2px}",
        ".wb-tab{border:none;background:transparent;color:inherit;opacity:.6;padding:9px 14px;cursor:pointer;font-size:13px;border-bottom:2px solid transparent;margin-bottom:-1px;transition:opacity .15s ease,border-color .15s ease}",
        ".wb-tab:hover{opacity:.9}",
        ".wb-tab.on{opacity:1;border-bottom-color:var(--dsw-alias-accent,#11a89b);font-weight:600}",
        ".wb-card{background:var(--wb-surface);border:1px solid var(--wb-line);border-radius:12px;padding:14px 16px}",
        ".wb-form{display:flex;gap:8px;align-items:center;background:var(--wb-surface);border:1px solid var(--wb-line);border-radius:12px;padding:10px;flex-wrap:wrap}",
        ".wb-input,.wb-select{background:transparent;color:inherit;border:1px solid var(--wb-line);border-radius:8px;padding:8px 11px;font-size:13px;outline:none;transition:border-color .15s ease}",
        ".wb-input:focus,.wb-select:focus{border-color:var(--dsw-alias-accent,#11a89b)}",
        ".wb-btn{background:var(--dsw-alias-accent,#11a89b);color:#fff;border:none;border-radius:8px;padding:8px 16px;cursor:pointer;font-size:13px;font-weight:600;transition:filter .15s ease}",
        ".wb-btn:hover{filter:brightness(1.08)}",
        ".wb-btn:disabled{opacity:.55;cursor:default;filter:none}",
        ".wb-btn.ghost{background:transparent;border:1px solid var(--wb-line);color:inherit;font-weight:400;opacity:.8}",
        ".wb-btn.danger{background:transparent;border:1px solid #e5484d;color:#e5484d;font-weight:500}",
        ".wb-sec{display:flex;align-items:center;justify-content:space-between;gap:10px;margin:2px 0 0}",
        ".wb-sec h3{margin:0;font-size:13px;font-weight:650;letter-spacing:.2px}",
        ".wb-sec .wb-hint{font-size:11.5px;opacity:.5}",
        ".wb-addon{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;padding:12px 14px;border:1px solid var(--wb-line);border-radius:10px;background:var(--wb-surface)}",
        ".wb-addon+.wb-addon{margin-top:8px}",
        ".wb-addon-main{min-width:0;display:flex;flex-direction:column;gap:2px}",
        ".wb-addon-title{font-weight:600;font-size:13.5px}",
        ".wb-addon-meta{font-size:11.5px;opacity:.52;margin-top:3px;line-height:1.5;word-break:break-word}",
        ".wb-addon-desc{font-size:12px;opacity:.66;margin-top:2px;line-height:1.5}",
        ".wb-actions{display:flex;gap:6px;align-items:center;flex:none;flex-wrap:wrap;justify-content:flex-end}",
        ".wb-badge{font-size:10.5px;padding:2px 7px;border-radius:999px;border:1px solid var(--wb-line);opacity:.7;margin-left:6px;white-space:nowrap}",
        ".wb-err{font-size:12px;color:#e5484d;margin-top:4px;line-height:1.5;word-break:break-word}",
        ".wb-msg{font-size:12.5px;opacity:.55;padding:20px 0;text-align:center;line-height:1.6}",
        ".wb-empty-cta{padding:26px 14px}",
        ".wb-stack{display:flex;flex-direction:column;gap:10px}",
        ".wb-home-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(236px,1fr));gap:12px}",
        ".wb-home-card{display:flex;flex-direction:column;gap:6px;text-align:left;background:var(--wb-surface);border:1px solid var(--wb-line);border-radius:14px;padding:16px 16px 14px;color:inherit;font:inherit;cursor:pointer;transition:transform .12s ease,border-color .12s ease,background .12s ease}",
        ".wb-home-card:hover{border-color:var(--dsw-alias-accent,#11a89b);transform:translateY(-1px)}",
        ".wb-home-card:focus-visible{outline:2px solid var(--dsw-alias-accent,#11a89b);outline-offset:2px}",
        ".wb-home-top{display:flex;align-items:center;justify-content:space-between;gap:8px}",
        ".wb-home-icon{width:34px;height:34px;border-radius:10px;display:inline-flex;align-items:center;justify-content:center;background:color-mix(in oklab,var(--dsw-alias-accent,#11a89b) 14%,transparent);color:var(--dsw-alias-accent,#11a89b);font-size:16px;font-weight:650;flex:none}",
        ".wb-home-title{font-size:14px;font-weight:650;margin-top:4px;line-height:1.4}",
        ".wb-home-desc{font-size:12px;opacity:.62;line-height:1.55;min-height:34px}",
        ".wb-home-foot{display:flex;align-items:center;justify-content:space-between;font-size:12px;color:var(--dsw-alias-accent,#11a89b);margin-top:2px;opacity:.9}",
        ".wb-home-arrow{font-size:14px;transition:transform .12s ease}",
        ".wb-home-card:hover .wb-home-arrow{transform:translateX(2px)}",
        ".wb-home-card.dim{opacity:.72}",
        ".wb-home-grid.manage{margin-top:2px}",
        ".wb-wide{max-width:1280px}",
        ".wb-page-head{display:flex;flex-direction:column;gap:8px;padding-bottom:2px}",
        ".wb-page-top{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap}",
        ".wb-back{border:1px solid var(--wb-line);background:transparent;color:inherit;border-radius:8px;padding:6px 11px;cursor:pointer;font:inherit;font-size:12px;opacity:.75;display:inline-flex;align-items:center;gap:5px}",
        ".wb-back:hover{opacity:1;border-color:var(--dsw-alias-accent,#11a89b)}",
        ".wb-page-title{display:flex;align-items:center;gap:8px;flex-wrap:wrap}",
        ".wb-page-title h2{margin:0;font-size:19px;font-weight:650;letter-spacing:.2px}",
        ".wb-page-desc{font-size:12px;opacity:.6;line-height:1.5}",
        ".wb-page-tabs{display:flex;gap:6px;flex-wrap:wrap;border-bottom:1px solid var(--wb-line)}",
        ".wb-page-loading{display:flex;flex-direction:column;gap:8px;align-items:flex-start}",
        ".wb-grow{flex:1;min-width:0}",
        ".wb-immersive{position:fixed;inset:0;z-index:700;height:100vh;box-sizing:border-box;padding:var(--dsh-frame-top-clearance,0px) 0 0;background:linear-gradient(var(--dsw-alias-bg-layer-1,#faf7ea),var(--dsw-alias-bg-layer-1,#faf7ea)),linear-gradient(var(--dsw-alias-bg-layer-2,#f7f3df),var(--dsw-alias-bg-layer-2,#f7f3df)),linear-gradient(var(--dsw-alias-bg-layer-3,#f0e8d8),var(--dsw-alias-bg-layer-3,#f0e8d8));overflow:hidden}",
        ".wb-immersive-bar{display:flex;align-items:center;gap:10px;padding:9px 22px;border-bottom:1px solid var(--wb-line);flex:none;background:transparent}",
        ".wb-immersive-title{display:flex;align-items:center;gap:8px;font-size:12px;font-weight:600;opacity:.85}",
        ".wb-immersive-title .wb-home-icon{width:24px;height:24px;border-radius:7px;font-size:12px}",
        ".wb-immersive-main{flex:1;min-height:0;overflow:auto;overscroll-behavior:contain;padding:18px 24px 24px}",
        "@media (max-width:760px){.wb-root{padding:16px}.wb-home-grid{grid-template-columns:1fr}.wb-page-title h2{font-size:17px}.wb-immersive{padding:var(--dsh-frame-top-clearance,0px) 0 0}.wb-immersive-bar{padding:8px 14px}.wb-immersive-main{padding:14px 16px 20px}.wb-immersive-title span:not(.wb-home-icon):not(.wb-badge){display:none}}",
      ].join("\n");

      // ── 子插件宿主桥（必须在任何 addon client.js 之前就位）──
      var registry = new Map();     // addonId -> AddonClientModule
      var listeners = new Set();    // 子插件事件订阅者
      var apiCache = new Map();
      var addonState = { addons: [], loaded: false, shellVersion: "" };
      var storeListeners = new Set();
      var stream = null;
      var lastAddonError = null;

      function notifyStore() {
        storeListeners.forEach(function (fn) { try { fn(); } catch (e) { console.error(e); } });
      }
      function broadcast(payload) {
        listeners.forEach(function (fn) { try { fn(payload); } catch (e) { console.error(e); } });
      }
      function apiFor(id) {
        var cached = apiCache.get(id);
        if (cached) return cached;
        var api = {
          call: function (action, args) {
            return fetch("/workbench/api/domains/" + encodeURIComponent(id) + "/actions/" + encodeURIComponent(action), {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify(args || {}),
            }).then(function (r) { return r.json(); })
              .catch(function (e) { return { ok: false, error: String((e && e.message) || e) }; });
          },
          subscribe: function (fn) { listeners.add(fn); return function () { listeners.delete(fn); }; },
        };
        apiCache.set(id, api);
        return api;
      }
      function registerAddon(mod) {
        if (!mod || typeof mod.id !== "string" || !Array.isArray(mod.views)) {
          console.error("[dsh-workbench] registerAddon 参数不合法", mod);
          return;
        }
        registry.set(mod.id, mod);
        notifyStore();
      }
      function setAddons(list) {
        addonState.addons = Array.isArray(list) ? list : [];
        addonState.loaded = true;
        var alive = {};
        addonState.addons.forEach(function (a) { alive[a.id] = a; });
        registry.forEach(function (_m, id) { if (!alive[id]) registry.delete(id); });
        notifyStore();
      }
      function refreshAddons() {
        return fetch("/workbench/api/domains")
          .then(function (r) { return r.json(); })
          .then(function (j) { if (j && j.domains) { addonState.shellVersion = j.shellVersion || addonState.shellVersion; setAddons(j.domains); } return j; })
          .catch(function (e) { console.warn("[dsh-workbench] 读取业务插件失败", e); return null; });
      }
      function ensureStream() {
        if (stream) return;
        stream = new EventSource("/workbench/api/events");
        stream.addEventListener("domains-changed", function (e) {
          try { setAddons(JSON.parse(e.data)); } catch (err) { console.warn(err); }
        });
        stream.addEventListener("domain-event", function (e) {
          try { broadcast(JSON.parse(e.data)); } catch (err) { console.warn(err); }
        });
      }
      function useAddonStore() {
        var st = react.useState(0);
        var bump = st[1];
        react.useEffect(function () {
          ensureStream();
          var fn = function () { bump(function (x) { return x + 1; }); };
          storeListeners.add(fn);
          if (!addonState.loaded) refreshAddons();
          return function () { storeListeners.delete(fn); };
        }, []);
        return addonState;
      }

      window.__WB_HOST__ = {
        react: react,
        jsx: jsx,
        h: h,
        registerAddon: registerAddon,
        get addons() { return addonState.addons; },
        error: function () { return lastAddonError; },
      };

      function useApi() {
        var base = "/workbench/api";
        return react.useMemo(function () {
          return {
            get: function (p) { return fetch(base + p).then(function (r) { return r.json(); }); },
            post: function (p, b) { return fetch(base + p, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(b || {}) }).then(function (r) { return r.json(); }); },
            del: function (p) { return fetch(base + p, { method: "DELETE" }).then(function (r) { return r.json(); }); },
          };
        }, []);
      }
      function pickTitle(title, lang) {
        if (!title) return "";
        if (typeof title === "string") return title;
        return title[lang] || title.zh || title.en || "";
      }
      function currentLang() {
        var raw = (document && document.documentElement && document.documentElement.lang) || (typeof navigator !== "undefined" && navigator.language) || "zh";
        return String(raw).toLowerCase().indexOf("zh") === 0 ? "zh" : "en";
      }

      function AccountTab(props) {
        var t = props.t;
        var api = useApi();
        var st = react.useState(null); var me = st[0]; var setMe = st[1];
        var st2 = react.useState({ email: "", password: "", signup: false }); var form = st2[0]; var setForm = st2[1];
        var st3 = react.useState(""); var msg = st3[0]; var setMsg = st3[1];
        var st4 = react.useState(false); var syncing = st4[0]; var setSyncing = st4[1];
        function refresh() { api.get("/account").then(function (r) { setMe(r); }); }
        react.useEffect(function () { refresh(); }, []);
        function submit() {
          api.post("/account/login", { email: form.email, password: form.password, signup: form.signup }).then(function (r) {
            setMsg(r.ok ? "" : (r.error || "failed"));
            refresh();
          });
        }
        if (!me) return jsx.jsx("div", { className: "wb-card", children: jsx.jsx("span", { className: "wb-msg", children: "…" }) });
        if (!me.logged_in) {
          return jsx.jsxs("div", { className: "wb-card", children: [
            jsx.jsx("div", { className: "wb-msg", style: { marginBottom: 10 }, children: t("not_logged_in") }),
            jsx.jsxs("div", { className: "wb-form", children: [
              jsx.jsx("input", { className: "wb-input", placeholder: t("email"), value: form.email, onChange: function (e) { setForm(Object.assign({}, form, { email: e.target.value })); } }),
              jsx.jsx("input", { className: "wb-input", type: "password", placeholder: t("password"), value: form.password, onChange: function (e) { setForm(Object.assign({}, form, { password: e.target.value })); }, onKeyDown: function (e) { if (e.key === "Enter") submit(); } }),
              jsx.jsx("label", { className: "wb-msg", children: jsx.jsxs("span", { children: [
                jsx.jsx("input", { type: "checkbox", checked: form.signup, onChange: function (e) { setForm(Object.assign({}, form, { signup: e.target.checked })); } }), " ", t("signup") ] }) }),
              jsx.jsx("button", { className: "wb-btn", onClick: submit, children: form.signup ? t("signup") : t("login") }),
            ] }),
            msg ? jsx.jsx("div", { className: "wb-err", style: { marginTop: 8 }, children: msg }) : null,
          ] });
        }
        return jsx.jsxs("div", { className: "wb-card", children: [
          jsx.jsxs("div", { children: [t("logged_in_as"), " ", me.user ? me.user.email : "", " (", t("device_name"), ")"] }),
          jsx.jsxs("div", { className: "wb-form", style: { marginTop: 10 }, children: [
            jsx.jsx("button", { className: "wb-btn", disabled: syncing, onClick: function () { setSyncing(true); api.post("/sync/now").then(function (r) { setSyncing(false); setMsg(r.ok ? t("sync_pushed") + " " + r.pushed + " · " + t("sync_pulled") + " " + r.pulled : (r.error || "fail")); }); }, children: syncing ? "…" : t("sync_now") }),
            jsx.jsx("button", { className: "wb-btn ghost", onClick: function () { api.post("/account/logout").then(refresh); }, children: t("logout") }),
          ] }),
          msg ? jsx.jsx("div", { className: "wb-msg", style: { marginTop: 8 }, children: msg }) : null,
        ] });
      }

      function WorkbenchPage(props) {
        var t = props.t;
        var store = useAddonStore();
        var rs = react.useState("home"); var route = rs[0]; var setRoute = rs[1];
        var lang = currentLang();
        react.useEffect(function () {
          if (document.getElementById("wb-css")) return;
          var s = document.createElement("style");
          s.id = "wb-css";
          s.setAttribute("data-plugin-css", NS);
          s.textContent = CSS;
          document.head.appendChild(s);
        }, []);

        var addons = (store.addons || []).filter(function (a) { return a && a.enabled; });
        var currentAddon = null;
        if (route.indexOf("addon:") === 0) {
          var parts = route.split(":");
          var wanted = parts[1] || "";
          addons.forEach(function (a) { if (a.id === wanted) currentAddon = a; });
        }
        var mod = currentAddon ? registry.get(currentAddon.id) : null;
        var clientViews = mod && Array.isArray(mod.views) ? mod.views : [];
        var manifestViews = currentAddon && Array.isArray(currentAddon.views) ? currentAddon.views : [];
        var viewList = clientViews.length ? clientViews : manifestViews;
        var wantedView = route.indexOf("addon:") === 0 ? (route.split(":")[2] || "") : "";
        var activeView = null;
        viewList.forEach(function (v) { if (v.id === wantedView) activeView = v; });
        if (!activeView && viewList.length) activeView = viewList[0];

        function go(next) { setRoute(next); }
        function cardIcon(title) { return String(title || "?").slice(0, 1); }
        function openAddon(a) {
          var m = registry.get(a.id);
          var v = (m && m.views && m.views[0]) || (a.views && a.views[0]) || null;
          go("addon:" + a.id + ":" + (v && v.id ? v.id : ""));
        }
        function pageHead(title, desc) {
          return jsx.jsxs("div", { className: "wb-page-head", children: [
            jsx.jsx("div", { className: "wb-page-top", children: [
              jsx.jsx("button", { className: "wb-back", onClick: function () { go("home"); }, children: "← " + t("back_home") }),
            ] }),
            jsx.jsxs("div", { className: "wb-page-title", children: [
              jsx.jsx("span", { className: "wb-home-icon", children: cardIcon(title) }),
              jsx.jsx("h2", { children: title }),
            ] }),
            desc ? jsx.jsx("div", { className: "wb-page-desc", children: desc }) : null,
          ] });
        }
        function addonCard(a) {
          var m = registry.get(a.id);
          var v = (m && m.views && m.views[0]) || (a.views && a.views[0]) || null;
          var title = pickTitle(v && v.title, lang) || a.title || a.id;
          var count = (m && m.views ? m.views.length : (a.views ? a.views.length : 0));
          return jsx.jsxs("button", { type: "button", className: "wb-home-card" + (a.error ? " dim" : ""), onClick: function () { openAddon(a); }, children: [
            jsx.jsxs("div", { className: "wb-home-top", children: [
              jsx.jsx("span", { className: "wb-home-icon", children: cardIcon(a.title || title) }),
              jsx.jsx("span", { className: "wb-badge", children: "v" + (a.version || "?") }),
            ] }),
            jsx.jsx("div", { className: "wb-home-title", children: title }),
            jsx.jsx("div", { className: "wb-home-desc", children: a.description || (count > 1 ? count + " " + t("views") : "") }),
            a.error ? jsx.jsx("div", { className: "wb-err", children: t("addon_error") + ": " + a.error }) : null,
            jsx.jsxs("div", { className: "wb-home-foot", children: [
              jsx.jsx("span", { children: a.error ? t("addon_unavailable") : t("open") }),
              jsx.jsx("span", { className: "wb-home-arrow", children: "→" }),
            ] }),
          ] }, a.id);
        }
        function systemCard(key, icon, title, desc) {
          return jsx.jsxs("button", { type: "button", className: "wb-home-card", onClick: function () { go(key); }, children: [
            jsx.jsxs("div", { className: "wb-home-top", children: [
              jsx.jsx("span", { className: "wb-home-icon", children: icon }),
            ] }),
            jsx.jsx("div", { className: "wb-home-title", children: title }),
            jsx.jsx("div", { className: "wb-home-desc", children: desc }),
            jsx.jsxs("div", { className: "wb-home-foot", children: [
              jsx.jsx("span", { children: t("open") }),
              jsx.jsx("span", { className: "wb-home-arrow", children: "→" }),
            ] }),
          ] }, key);
        }

        if (route === "account") {
          return jsx.jsxs("div", { className: "wb-root", children: [
            jsx.jsxs("div", { className: "wb-inner wb-wide", children: [pageHead(t("tab_account"), t("account_desc")), jsx.jsx(AccountTab, { t: t })] }),
          ] });
        }
        if (currentAddon) {
          var canRender = activeView && typeof activeView.component === "function";
          var addonTitle = pickTitle(activeView && activeView.title, lang) || currentAddon.title || currentAddon.id;
          return jsx.jsxs("div", { className: "wb-root wb-immersive", children: [
            jsx.jsxs("div", { className: "wb-immersive-bar", children: [
              jsx.jsx("button", { className: "wb-back", onClick: function () { go("home"); }, children: "← " + t("back_home") }),
              jsx.jsx("div", { className: "wb-grow" }),
              jsx.jsxs("div", { className: "wb-immersive-title", children: [
                jsx.jsx("span", { className: "wb-home-icon", children: cardIcon(addonTitle) }),
                jsx.jsx("span", { children: addonTitle }),
                jsx.jsx("span", { className: "wb-badge", children: "v" + (currentAddon.version || "?") }),
              ] }),
            ] }),
            jsx.jsxs("div", { className: "wb-immersive-main", children: [
              jsx.jsxs("div", { className: "wb-inner wb-wide", children: [
                viewList.length > 1 ? jsx.jsx("div", { className: "wb-page-tabs", children: viewList.map(function (v) {
                  var on = activeView && v.id === activeView.id;
                  return jsx.jsx("button", { className: "wb-tab" + (on ? " on" : ""), onClick: function () { go("addon:" + currentAddon.id + ":" + v.id); }, children: pickTitle(v.title, lang) || v.id }, v.id);
                }) }) : null,
                currentAddon.error
                  ? jsx.jsx("div", { className: "wb-card", children: jsx.jsx("div", { className: "wb-err", children: t("addon_error") + ": " + currentAddon.error }) })
                  : canRender
                    ? jsx.jsx(activeView.component, { api: apiFor(currentAddon.id), lang: lang, addonId: currentAddon.id, t: t })
                    : !viewList.length
                      ? jsx.jsx("div", { className: "wb-card", children: jsx.jsx("div", { className: "wb-msg", children: t("no_views") }) })
                      : jsx.jsx("div", { className: "wb-card", children: jsx.jsx("div", { className: "wb-page-loading", children: jsx.jsx("div", { className: "wb-msg", style: { padding: "4px 0" }, children: lastAddonError ? t("addon_unavailable") + " · " + lastAddonError : t("addon_loading") }) }) }),
              ] }),
            ] }),
          ] });
        }

        return jsx.jsxs("div", { className: "wb-root", children: [
          jsx.jsxs("div", { className: "wb-inner", children: [
            jsx.jsx("div", { className: "wb-hero", children: jsx.jsxs("div", { children: [jsx.jsx("h2", { children: t("title") }), jsx.jsx("span", { className: "wb-tag", children: t("tagline") })] }) }),
            addons.length
              ? jsx.jsx("div", { className: "wb-home-grid", children: addons.map(addonCard) })
              : jsx.jsx("div", { className: "wb-card", children: jsx.jsx("div", { className: "wb-msg wb-empty-cta", children: t("no_installed") }) }),
            jsx.jsxs("div", { className: "wb-sec", children: [
              jsx.jsx("h3", { children: t("manage") }),
              jsx.jsx("span", { className: "wb-hint", children: t("home_hint") }),
            ] }),
            jsx.jsxs("div", { className: "wb-home-grid manage", children: [
              systemCard("account", "☁", t("tab_account"), t("account_desc")),
            ] }),
          ] }),
        ] });
      }

      var exports_ = {
        name: NS,
        inject: ["slots", "locale", "theme"],
        apply: function (ctx) {
          try {
            var PanellistIcon = function () {
              return h("svg", { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": 2, "stroke-linecap": "round", "stroke-linejoin": "round" },
                h("rect", { x: 3, y: 3, width: 7, height: 7, rx: 1 }),
                h("rect", { x: 14, y: 3, width: 7, height: 7, rx: 1 }),
                h("rect", { x: 3, y: 14, width: 7, height: 7, rx: 1 }),
                h("rect", { x: 14, y: 14, width: 7, height: 7, rx: 1 })
              );
            };
            ctx.effect(function () { return ctx.locale.register(NS, LOCALE); }, "wb-locale");
            var t = ctx.locale.bind(NS);
            ctx.slots.inject("sidebar.panellist", function () {
              return ctx.slots.register(
                { name: "sidebar.panellist", id: NS, order: 62, label: function () { return t("nav"); } },
                function () { return h(PanellistIcon, {}); }
              );
            });
            ctx.slots.inject("main", function () {
              return ctx.slots.register(
                { name: "main", key: NS, locale: NS, inject: function () { return { t: t }; } },
                function () { try { return jsx.jsx(WorkbenchPage, { t: t }); } catch (e) { window.__wbSlotErr = String((e && e.stack) || e); throw e; } }
              );
            });
            ctx.slots.inject("settings.plugins.tab", function () {
              return ctx.slots.register(
                { name: "settings.plugins.tab", id: NS, order: 65, label: function () { return t("nav"); }, locale: NS, inject: function () { return { t: t }; } },
                function () { return h(WorkbenchPage, { t: t }); }
              );
            });
          } catch (e) { console.error("[dsh-workbench] apply crashed:", e, e && e.stack); throw e; }
        },
      };
      return exports_;
    },
  });
})();