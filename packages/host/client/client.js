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
          tab_account: "账号与同步", tab_addons: "子插件", tab_backup: "数据备份",
          backup_desc: "按模块导出或导入本地数据；导入只合并，不删除已有数据",
          backup_modules: "选择要导出的模块", backup_export_result: "导出结果", backup_select_all: "全选", backup_clear: "清空",
          backup_export: "导出备份", backup_import: "导入备份", backup_exporting: "正在导出…", backup_importing: "正在导入…",
          backup_no_modules: "当前没有可导出的模块", backup_select_required: "至少选择一个模块",
          backup_import_result: "导入结果", backup_summary: "汇总", backup_detail: "模块明细",
          backup_status: "状态", backup_imported: "导入", backup_skipped: "跳过", backup_failed: "失败",
          backup_ok: "成功", backup_partial: "部分成功", backup_failed_status: "失败", backup_skipped_status: "跳过",
          backup_exported_at: "导出时间", backup_shell_version: "壳版本", backup_format: "备份格式",
          backup_incompatible: "备份格式版本不兼容，请升级工作台后再导入",
          backup_invalid: "备份文件无效", backup_file_hint: "支持 .zip 备份包",
          backup_download_started: "已开始下载备份", backup_import_done: "导入完成",
          backup_export_failed: "导出失败", backup_import_failed: "导入失败",
          backup_no_import: "未实现导入", backup_no_export: "未实现导出",
          backup_refresh: "重新读取模块", backup_cap_export: "可导出", backup_cap_import: "可导入",
          backup_dup_policy: "重复 ID 时", backup_dup_newest: "以时间最新为主", backup_dup_skip: "保留本地（跳过）",
          backup_dup_overwrite: "用备份覆盖", backup_dup_hint: "导入时对同 ID 记录的处理方式", backup_policy: "策略",
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
          sync_status: "同步状态", sync_last: "上次同步", sync_never: "尚未同步", sync_conflicts: "冲突",
          sync_failed_tables: "失败的表", sync_clock: "时钟偏移", sync_no_conflicts: "没有待处理的冲突",
          sync_conflict_hint: "同一行在本地和云端都被修改，选择保留哪个版本",
          sync_keep_local: "保留本地", sync_keep_server: "采用云端", sync_dismiss: "忽略",
          sync_resolve_failed: "冲突处理失败", sync_ok: "同步完成", sync_partial: "部分表同步失败",
          record_label: "记录模式", record_on: "记录中", record_off: "记录",
          record_on_title: "本会话记录模式已开启，点击关闭", record_off_title: "开启后把完成的可交付内容记到工作台（仅本会话）",
          record_busy: "切换中", record_error: "切换失败", record_failed_short: "记录失败",
        },
        en: {
          nav: "Workbench", title: "Personal Workbench", tagline: "Offline-first · addons installed by DSH",
          tab_account: "Account & Sync", tab_addons: "Addons", tab_backup: "Data backup",
          backup_desc: "Export or import local data per module; import merges and never deletes existing rows",
          backup_modules: "Modules to export", backup_export_result: "Export result", backup_select_all: "Select all", backup_clear: "Clear",
          backup_export: "Export backup", backup_import: "Import backup", backup_exporting: "Exporting…", backup_importing: "Importing…",
          backup_no_modules: "No exportable modules", backup_select_required: "Select at least one module",
          backup_import_result: "Import result", backup_summary: "Summary", backup_detail: "Module details",
          backup_status: "Status", backup_imported: "imported", backup_skipped: "skipped", backup_failed: "failed",
          backup_ok: "ok", backup_partial: "partial", backup_failed_status: "failed", backup_skipped_status: "skipped",
          backup_exported_at: "Exported at", backup_shell_version: "Shell version", backup_format: "Format",
          backup_incompatible: "Backup format is incompatible; update the workbench before importing",
          backup_invalid: "Invalid backup file", backup_file_hint: "Supports .zip backups",
          backup_download_started: "Backup download started", backup_import_done: "Import finished",
          backup_export_failed: "Export failed", backup_import_failed: "Import failed",
          backup_no_import: "Import not implemented", backup_no_export: "Export not implemented",
          backup_refresh: "Reload modules", backup_cap_export: "export", backup_cap_import: "import",
          backup_dup_policy: "On duplicate ID", backup_dup_newest: "Keep newest by time", backup_dup_skip: "Keep local (skip)",
          backup_dup_overwrite: "Overwrite with backup", backup_dup_hint: "How to handle rows with the same ID on import", backup_policy: "Policy",
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
          sync_status: "Sync status", sync_last: "Last sync", sync_never: "Never synced", sync_conflicts: "Conflicts",
          sync_failed_tables: "Failed tables", sync_clock: "Clock offset", sync_no_conflicts: "No pending conflicts",
          sync_conflict_hint: "The same row changed locally and remotely; choose which version to keep",
          sync_keep_local: "Keep local", sync_keep_server: "Use remote", sync_dismiss: "Dismiss",
          sync_resolve_failed: "Failed to resolve conflict", sync_ok: "Sync complete", sync_partial: "Some tables failed",
          record_label: "Record mode", record_on: "Recording", record_off: "Record",
          record_on_title: "Record mode is on for this session; click to turn it off", record_off_title: "Record finished deliverables to the workbench (this session only)",
          record_busy: "Switching", record_error: "Switch failed", record_failed_short: "Failed",
        },
      };

      // 样式：只用宿主 --dsw-* token，深浅主题自适应（03 文档）
      var CSS = [
        ".wb-root{--wb-line:var(--dsw-alias-border-l2,color-mix(in oklab,currentColor 16%,transparent));--wb-surface:var(--dsw-alias-bg-layer-1,color-mix(in oklab,currentColor 4%,transparent));display:flex;flex-direction:column;height:100%;box-sizing:border-box;overflow:auto;color:inherit;font-size:13px;background:var(--dsw-alias-bg-base,var(--dsw-alias-bg-layer-2,color-mix(in oklab,currentColor 4%,transparent)));padding:24px 28px}",
        ".wb-inner{display:flex;flex-direction:column;gap:16px;width:100%;max-width:1040px;margin:0 auto}",
        ".wb-hero{display:flex;align-items:flex-end;justify-content:space-between;gap:16px;flex-wrap:wrap}",
        ".wb-hero h2{margin:0;font-size:18px;font-weight:650;letter-spacing:.2px}",
        ".wb-tag{font-size:12px;opacity:.62;margin-top:4px;display:block;line-height:1.5}",
        ".wb-tabs{display:flex;gap:6px;border-bottom:1px solid var(--wb-line);margin-bottom:2px}",
        ".wb-tab{border:none;background:transparent;color:inherit;opacity:.6;padding:9px 14px;cursor:pointer;font-size:13px;border-bottom:2px solid transparent;margin-bottom:-1px;transition:opacity .15s ease,border-color .15s ease}",
        ".wb-tab:hover{opacity:.9}",
        ".wb-tab.on{opacity:1;border-bottom-color:var(--dsw-alias-brand-primary,#11a89b);font-weight:600}",
        ".wb-card{background:var(--wb-surface);border:1px solid var(--wb-line);border-radius:12px;padding:14px 16px}",
        ".wb-form{display:flex;gap:8px;align-items:center;background:var(--wb-surface);border:1px solid var(--wb-line);border-radius:12px;padding:10px;flex-wrap:wrap}",
        ".wb-input,.wb-select{background:transparent;color:inherit;border:1px solid var(--wb-line);border-radius:8px;padding:8px 11px;font-size:13px;outline:none;transition:border-color .15s ease}",
        ".wb-input:focus,.wb-select:focus{border-color:var(--dsw-alias-brand-primary,#11a89b)}",
        ".wb-btn{background:var(--dsw-alias-brand-primary,#11a89b);color:var(--dsw-alias-label-primary-inverted,#fff);border:none;border-radius:8px;padding:8px 16px;cursor:pointer;font-size:13px;font-weight:600;transition:filter .15s ease}",
        ".wb-btn:hover{filter:brightness(1.08)}",
        ".wb-btn:disabled{opacity:.55;cursor:default;filter:none}",
        ".wb-btn.ghost{background:transparent;border:1px solid var(--wb-line);color:inherit;font-weight:400;opacity:.8}",
        ".wb-btn.danger{background:transparent;border:1px solid var(--dsw-alias-state-error-primary,#e5484d);color:var(--dsw-alias-state-error-primary,#e5484d);font-weight:500}",
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
        ".wb-err{font-size:12px;color:var(--dsw-alias-state-error-primary,#e5484d);margin-top:4px;line-height:1.5;word-break:break-word}",
        ".wb-msg{font-size:12.5px;opacity:.55;padding:20px 0;text-align:center;line-height:1.6}",
        ".wb-empty-cta{padding:26px 14px}",
        ".wb-stack{display:flex;flex-direction:column;gap:10px}",
        ".wb-home-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(236px,1fr));gap:12px}",
        ".wb-home-card{display:flex;flex-direction:column;gap:6px;text-align:left;background:var(--wb-surface);border:1px solid var(--wb-line);border-radius:14px;padding:16px 16px 14px;color:inherit;font:inherit;cursor:pointer;transition:transform .12s ease,border-color .12s ease,background .12s ease}",
        ".wb-home-card:hover{border-color:var(--dsw-alias-brand-primary,#11a89b);transform:translateY(-1px)}",
        ".wb-home-card:focus-visible{outline:2px solid var(--dsw-alias-brand-primary,#11a89b);outline-offset:2px}",
        ".wb-home-top{display:flex;align-items:center;justify-content:space-between;gap:8px}",
        ".wb-home-icon{width:34px;height:34px;border-radius:10px;display:inline-flex;align-items:center;justify-content:center;background:color-mix(in oklab,var(--dsw-alias-brand-primary,#11a89b) 14%,transparent);color:var(--dsw-alias-brand-primary,#11a89b);font-size:16px;font-weight:650;flex:none}",
        ".wb-home-title{font-size:14px;font-weight:650;margin-top:4px;line-height:1.4}",
        ".wb-home-desc{font-size:12px;opacity:.62;line-height:1.55;min-height:34px}",
        ".wb-home-foot{display:flex;align-items:center;justify-content:space-between;font-size:12px;color:var(--dsw-alias-brand-primary,#11a89b);margin-top:2px;opacity:.9}",
        ".wb-home-arrow{font-size:14px;transition:transform .12s ease}",
        ".wb-home-card:hover .wb-home-arrow{transform:translateX(2px)}",
        ".wb-home-card.dim{opacity:.72}",
        ".wb-home-grid.manage{margin-top:2px}",
        ".wb-wide{max-width:1280px}",
        ".wb-page-head{display:flex;flex-direction:column;gap:8px;padding-bottom:2px}",
        ".wb-page-top{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap}",
        ".wb-back{border:1px solid var(--wb-line);background:transparent;color:inherit;border-radius:8px;padding:6px 11px;cursor:pointer;font:inherit;font-size:12px;opacity:.75;display:inline-flex;align-items:center;gap:5px}",
        ".wb-back:hover{opacity:1;border-color:var(--dsw-alias-brand-primary,#11a89b)}",
        ".wb-page-title{display:flex;align-items:center;gap:8px;flex-wrap:wrap}",
        ".wb-page-title h2{margin:0;font-size:19px;font-weight:650;letter-spacing:.2px}",
        ".wb-page-desc{font-size:12px;opacity:.6;line-height:1.5}",
        ".wb-page-tabs{display:flex;gap:6px;flex-wrap:wrap;border-bottom:1px solid var(--wb-line)}",
        ".wb-page-loading{display:flex;flex-direction:column;gap:8px;align-items:flex-start}",
        ".wb-grow{flex:1;min-width:0}",
        ".wb-immersive{position:fixed;inset:0;z-index:700;height:100vh;box-sizing:border-box;padding:var(--dsh-frame-top-clearance,0px) 0 0;background:var(--dsw-alias-bg-layer-2,var(--dsw-alias-bg-layer-1,#faf7ea));backdrop-filter:saturate(1.05) blur(10px);overflow:hidden}",
        ".wb-immersive-bar{display:flex;align-items:center;gap:10px;padding:9px 22px;border-bottom:1px solid var(--wb-line);flex:none;background:transparent}",
        ".wb-immersive-title{display:flex;align-items:center;gap:8px;font-size:12px;font-weight:600;opacity:.85}",
        ".wb-immersive-title .wb-home-icon{width:24px;height:24px;border-radius:7px;font-size:12px}",
        ".wb-immersive-main{flex:1;min-height:0;overflow:auto;overscroll-behavior:contain;padding:18px 24px 24px}",
        "@media (max-width:760px){.wb-root{padding:16px}.wb-home-grid{grid-template-columns:1fr}.wb-page-title h2{font-size:17px}.wb-immersive{padding:var(--dsh-frame-top-clearance,0px) 0 0}.wb-immersive-bar{padding:8px 14px}.wb-immersive-main{padding:14px 16px 20px}.wb-immersive-title span:not(.wb-home-icon):not(.wb-badge){display:none}}",
        ".wb-backup{display:flex;flex-direction:column;gap:14px}",
        ".wb-backup-item{display:flex;flex-direction:column}",
        ".wb-backup-row{display:flex;align-items:flex-start;gap:10px;padding:11px 13px;border:1px solid var(--wb-line);border-radius:10px;background:var(--wb-surface)}",
        ".wb-backup-row.open{border-radius:10px 10px 0 0}",
        ".wb-backup-row-main{display:flex;align-items:flex-start;gap:10px;flex:1;min-width:0;cursor:pointer}",
        ".wb-backup-row input{margin-top:3px;accent-color:var(--dsw-alias-brand-primary,#11a89b)}",
        ".wb-backup-gear{flex:none;width:28px;height:28px;border-radius:8px;border:1px solid transparent;background:transparent;color:inherit;opacity:.5;cursor:pointer;font-size:14px;line-height:1;display:inline-flex;align-items:center;justify-content:center;padding:0;margin-top:-3px}",
        ".wb-backup-gear:hover,.wb-backup-gear.active{opacity:1;border-color:var(--wb-line);background:color-mix(in oklab,var(--dsw-alias-brand-primary,#11a89b) 10%,transparent)}",
        ".wb-backup-config{display:flex;align-items:center;gap:10px;flex-wrap:wrap;padding:9px 13px 11px;border:1px solid var(--wb-line);border-top:none;border-radius:0 0 10px 10px;margin-top:-1px;background:color-mix(in oklab,var(--dsw-alias-brand-primary,#11a89b) 5%,var(--wb-surface))}",
        ".wb-backup-config-label{font-size:12px;font-weight:600;opacity:.8}",
        ".wb-backup-config .wb-select{padding:6px 9px;font-size:12px;background:var(--wb-surface)}",
        ".wb-backup-main{min-width:0;display:flex;flex-direction:column;gap:2px}",
        ".wb-backup-name{font-weight:600;font-size:13px}",
        ".wb-backup-meta{font-size:11.5px;opacity:.52;line-height:1.5}",
        ".wb-backup-table-list{display:flex;flex-direction:column;gap:1px}",
        ".wb-backup-table{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:10.5px;line-height:1.8;opacity:.62;white-space:nowrap}",
        ".wb-backup-result-row{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:8px 0;border-top:1px solid var(--wb-line)}",
        ".wb-backup-result-row:first-of-type{border-top:0;padding-top:0}",
        ".wb-backup-actions{display:flex;gap:8px;align-items:center;flex-wrap:wrap}",
        ".wb-backup-note{font-size:12px;opacity:.6;line-height:1.55}",
        ".wb-backup-report{display:flex;flex-direction:column;gap:8px}",
        ".wb-backup-table{width:100%;border-collapse:collapse;font-size:12px}",
        ".wb-backup-table th,.wb-backup-table td{text-align:left;padding:7px 8px;border-bottom:1px solid var(--wb-line);vertical-align:top}",
        ".wb-backup-table th{font-weight:600;opacity:.66;font-size:11.5px}",
        ".wb-backup-table td.num{white-space:nowrap;opacity:.8}",
        ".wb-backup-status{font-weight:600}",
        ".wb-backup-status.ok{color:var(--dsw-alias-state-success-primary,#18a058)}",
        ".wb-backup-status.partial{color:var(--dsw-alias-state-warn-primary,#d48806)}",
        ".wb-backup-status.failed{color:var(--dsw-alias-state-error-primary,#e5484d)}",
        ".wb-backup-status.skipped{opacity:.55}",
        ".wb-backup-file{position:absolute;width:1px;height:1px;opacity:0;pointer-events:none}",
        ".wb-sync-status{display:flex;gap:16px;flex-wrap:wrap;font-size:12px;opacity:.7;margin-top:10px;line-height:1.6}",
        ".wb-sync-status b{font-weight:600;opacity:.9}",
        ".wb-conflict{display:flex;align-items:center;gap:10px;justify-content:space-between;flex-wrap:wrap;padding:9px 0;border-top:1px solid var(--wb-line);font-size:12px}",
        ".wb-conflict:first-of-type{border-top:0;padding-top:0}",
        ".wb-conflict-main{min-width:0;display:flex;flex-direction:column;gap:2px}",
        ".wb-conflict-meta{font-size:11px;opacity:.55;word-break:break-word}",
        ".wb-conflict-actions{display:flex;gap:6px;flex:none}",
        ".wb-record-pill{display:inline-flex;align-items:center;gap:6px;height:28px;padding:0 10px;border:1px solid var(--wb-line,var(--dsw-alias-border-l2,color-mix(in oklab,currentColor 16%,transparent)));border-radius:999px;background:color-mix(in oklab,currentColor 3%,transparent);color:inherit;cursor:pointer;font:inherit;font-size:12px;line-height:1;opacity:.62;white-space:nowrap;transition:opacity .15s ease,border-color .15s ease,background .15s ease}",
        ".wb-record-pill:hover{opacity:.95;border-color:color-mix(in oklab,var(--dsw-alias-brand-primary,#11a89b) 35%,var(--wb-line,var(--dsw-alias-border-l2,color-mix(in oklab,currentColor 16%,transparent))))}",
        ".wb-record-pill.on{opacity:1;border-color:color-mix(in oklab,var(--dsw-alias-brand-primary,#11a89b) 45%,transparent);background:color-mix(in oklab,var(--dsw-alias-brand-primary,#11a89b) 10%,transparent)}",
        ".wb-record-pill:disabled{opacity:.4;cursor:default}",
        ".wb-record-pill.err{opacity:1;border-color:var(--dsw-alias-state-error-primary,#e5484d);color:var(--dsw-alias-state-error-primary,#e5484d)}",
        ".wb-record-pill.err .wb-record-dot{background:currentColor;opacity:1}",
        ".wb-record-dot{width:6px;height:6px;border-radius:50%;background:currentColor;opacity:.5;flex:none}",
        ".wb-record-pill.on .wb-record-dot{background:var(--dsw-alias-brand-primary,#11a89b);opacity:1;box-shadow:0 0 0 3px color-mix(in oklab,var(--dsw-alias-brand-primary,#11a89b) 18%,transparent)}",
      ].join("\n");

      // ── 子插件宿主桥（必须在任何 addon client.js 之前就位）──
      var registry = new Map();     // addonId -> AddonClientModule
      var listeners = new Set();    // 子插件事件订阅者
      var apiCache = new Map();
      var addonState = { addons: [], loaded: false, shellVersion: "" };
      var storeListeners = new Set();
      var recordModes = {};         // sessionId -> enabled
      var recordListeners = new Set();
      var stream = null;
      var lastAddonError = null;

      function setRecordMode(sessionId, enabled) {
        if (!sessionId) return;
        recordModes[sessionId] = !!enabled;
        recordListeners.forEach(function (fn) { try { fn(sessionId, !!enabled); } catch (e) { console.error(e); } });
      }

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
        stream.addEventListener("record-mode", function (e) {
          try {
            var payload = JSON.parse(e.data);
            if (payload && payload.sessionId) setRecordMode(payload.sessionId, payload.enabled);
          } catch (err) { console.warn(err); }
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
        var st5 = react.useState(null); var syncStatus = st5[0]; var setSyncStatus = st5[1];
        var st6 = react.useState([]); var conflicts = st6[0]; var setConflicts = st6[1];
        function refreshSync() {
          api.get("/sync/status").then(function (r) { if (r && r.ok) setSyncStatus(r); });
          api.get("/sync/conflicts?limit=20").then(function (r) { setConflicts(r && Array.isArray(r.conflicts) ? r.conflicts : []); });
        }
        function refresh() {
          api.get("/account").then(function (r) {
            setMe(r);
            if (r && r.logged_in) refreshSync();
          });
        }
        react.useEffect(function () { refresh(); }, []);
        react.useEffect(function () {
          if (!me || !me.logged_in) return undefined;
          var es = new EventSource("/workbench/api/events");
          function onSync() { refreshSync(); }
          es.addEventListener("sync-done", onSync);
          es.addEventListener("sync-status", onSync);
          return function () { es.close(); };
        }, [me && me.logged_in]);
        function submit() {
          api.post("/account/login", { email: form.email, password: form.password, signup: form.signup }).then(function (r) {
            setMsg(r.ok ? "" : (r.error || "failed"));
            refresh();
          });
        }
        function resolve(id, action) {
          api.post("/sync/conflicts/" + id + "/resolve", { action: action }).then(function (r) {
            if (!r || !r.ok) setMsg(t("sync_resolve_failed"));
            refreshSync();
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
        var failed = syncStatus && Array.isArray(syncStatus.failed_tables) ? syncStatus.failed_tables : [];
        return jsx.jsxs("div", { className: "wb-stack", children: [
          jsx.jsxs("div", { className: "wb-card", children: [
            jsx.jsxs("div", { children: [t("logged_in_as"), " ", me.user ? me.user.email : "", " (", t("device_name"), ")"] }),
            jsx.jsxs("div", { className: "wb-form", style: { marginTop: 10 }, children: [
              jsx.jsx("button", { className: "wb-btn", disabled: syncing, onClick: function () {
                setSyncing(true);
                api.post("/sync/now").then(function (r) {
                  setSyncing(false);
                  if (r && r.ok && Array.isArray(r.failed_tables) && r.failed_tables.length) {
                    setMsg(t("sync_partial") + ": " + r.failed_tables.join(", "));
                  } else {
                    setMsg(r && r.ok ? t("sync_ok") + " · " + t("sync_pushed") + " " + r.pushed + " · " + t("sync_pulled") + " " + r.pulled : (r && r.error || "fail"));
                  }
                  refreshSync();
                });
              }, children: syncing ? "…" : t("sync_now") }),
              jsx.jsx("button", { className: "wb-btn ghost", onClick: function () { api.post("/account/logout").then(refresh); }, children: t("logout") }),
            ] }),
            msg ? jsx.jsx("div", { className: "wb-msg", style: { marginTop: 8 }, children: msg }) : null,
            syncStatus ? jsx.jsxs("div", { className: "wb-sync-status", children: [
              jsx.jsxs("span", { children: [t("sync_last"), ": ", jsx.jsx("b", { children: syncStatus.last_sync_at ? new Date(syncStatus.last_sync_at).toLocaleString() : t("sync_never") })] }),
              jsx.jsxs("span", { children: [t("sync_conflicts"), ": ", jsx.jsx("b", { children: syncStatus.conflicts || 0 })] }),
              failed.length ? jsx.jsxs("span", { children: [t("sync_failed_tables"), ": ", jsx.jsx("b", { children: failed.join(", ") })] }) : null,
              syncStatus.clock_offset ? jsx.jsxs("span", { children: [t("sync_clock"), ": ", jsx.jsx("b", { children: syncStatus.clock_offset + "ms" })] }) : null,
            ] }) : null,
          ] }),
          jsx.jsxs("div", { className: "wb-card", children: [
            jsx.jsxs("div", { className: "wb-sec", children: [
              jsx.jsx("h3", { children: t("sync_conflicts") + " (" + conflicts.length + ")" }),
              jsx.jsx("span", { className: "wb-hint", children: t("sync_conflict_hint") }),
            ] }),
            conflicts.length ? conflicts.map(function (c) {
              return jsx.jsxs("div", { className: "wb-conflict", children: [
                jsx.jsxs("div", { className: "wb-conflict-main", children: [
                  jsx.jsx("div", { children: (c.table_name || "") + " · " + (c.row_id || "") }),
                  jsx.jsx("div", { className: "wb-conflict-meta", children: (c.kind || "") + (c.server_updated_at ? " · " + new Date(c.server_updated_at).toLocaleString() : "") }),
                ] }),
                jsx.jsxs("div", { className: "wb-conflict-actions", children: [
                  jsx.jsx("button", { className: "wb-btn ghost", onClick: function () { resolve(c.id, "keep_local"); }, children: t("sync_keep_local") }),
                  jsx.jsx("button", { className: "wb-btn ghost", onClick: function () { resolve(c.id, "keep_server"); }, children: t("sync_keep_server") }),
                  jsx.jsx("button", { className: "wb-btn ghost", onClick: function () { resolve(c.id, "dismiss"); }, children: t("sync_dismiss") }),
                ] }),
              ] }, c.id);
            }) : jsx.jsx("div", { className: "wb-msg", children: t("sync_no_conflicts") }),
          ] }),
        ] });
      }

      function BackupTab(props) {
        var t = props.t;
        var lang = props.lang;
        var addons = props.addons || [];
        var exportable = addons.filter(function (a) { return a && a.backup && a.backup.export; });
        var idsKey = exportable.map(function (a) { return a.id; }).join(",");
        var st = react.useState({}); var selected = st[0]; var setSelected = st[1];
        var st2 = react.useState(""); var busy = st2[0]; var setBusy = st2[1];
        var st3 = react.useState(""); var msg = st3[0]; var setMsg = st3[1];
        var st4 = react.useState(null); var report = st4[0]; var setReport = st4[1];
        var st5 = react.useState(null); var exported = st5[0]; var setExported = st5[1];
        var st6 = react.useState({}); var policies = st6[0]; var setPolicies = st6[1];
        var st7 = react.useState({}); var openConfig = st7[0]; var setOpenConfig = st7[1];
        var fileRef = react.useRef(null);

        react.useEffect(function () {
          setSelected(function (prev) {
            var next = {};
            var changed = false;
            exportable.forEach(function (a) {
              if (prev[a.id]) next[a.id] = true;
              else next[a.id] = true;
              if (!prev[a.id]) changed = true;
            });
            Object.keys(prev).forEach(function (id) {
              if (!exportable.some(function (a) { return a.id === id; })) changed = true;
            });
            return changed ? next : prev;
          });
        }, [idsKey]);

        var allSelected = exportable.length > 0 && exportable.every(function (a) { return selected[a.id]; });
        function toggle(id) {
          var next = Object.assign({}, selected);
          next[id] = !next[id];
          setSelected(next);
        }
        function selectAll(flag) {
          var next = {};
          exportable.forEach(function (a) { next[a.id] = flag; });
          setSelected(next);
        }
        function policyOf(id) { return policies[id] || "newest"; }
        function policyLabel(policy) {
          if (policy === "skip") return t("backup_dup_skip");
          if (policy === "overwrite") return t("backup_dup_overwrite");
          return t("backup_dup_newest");
        }
        function setPolicy(id, value) {
          setPolicies(function (prev) { var next = Object.assign({}, prev); next[id] = value; return next; });
        }
        function toggleConfig(id) {
          setOpenConfig(function (prev) { var next = Object.assign({}, prev); next[id] = !next[id]; return next; });
        }
        function statusLabel(status) {
          if (status === "ok") return t("backup_ok");
          if (status === "partial") return t("backup_partial");
          if (status === "skipped") return t("backup_skipped_status");
          return t("backup_failed_status");
        }
        function doExport() {
          if (busy) return;
          var chosen = exportable.filter(function (a) { return selected[a.id]; });
          var ids = chosen.map(function (a) { return a.id; });
          if (!ids.length) { setMsg(t("backup_select_required")); return; }
          setBusy("export");
          setMsg("");
          setReport(null);
          setExported(null);
          var url = "/workbench/api/backup/export?modules=" + ids.map(encodeURIComponent).join(",");
          fetch(url).then(function (r) {
            if (!r.ok) {
              return r.json().catch(function () { return {}; }).then(function (j) {
                throw new Error((j && j.error) || ("HTTP " + r.status));
              });
            }
            var cd = r.headers.get("content-disposition") || "";
            var m = /filename="?([^";]+)"?/.exec(cd);
            var name = m ? m[1] : "dsh-workbench-backup.zip";
            return r.blob().then(function (blob) {
              var href = URL.createObjectURL(blob);
              var a = document.createElement("a");
              a.href = href;
              a.download = name;
              document.body.appendChild(a);
              a.click();
              a.remove();
              setTimeout(function () { URL.revokeObjectURL(href); }, 1500);
              setMsg(t("backup_download_started"));
              var rows = [];
              chosen.forEach(function (a) {
                var tables = a.tables || [];
                if (!tables.length) rows.push({ id: a.id + ":*", table: "—", module: a.title || a.id, version: a.version });
                tables.forEach(function (table) {
                  rows.push({ id: a.id + ":" + table, table: table, module: a.title || a.id, version: a.version });
                });
              });
              setExported(rows);
            });
          }).catch(function (e) {
            setMsg(t("backup_export_failed") + ": " + String((e && e.message) || e));
          }).then(function () { setBusy(""); });
        }
        function doImport(ev) {
          var file = ev.target.files && ev.target.files[0];
          ev.target.value = "";
          if (!file || busy) return;
          setBusy("import");
          setMsg("");
          setReport(null);
          var policyMap = {};
          exportable.forEach(function (a) { policyMap[a.id] = policyOf(a.id); });
          fetch("/workbench/api/backup/import", { method: "POST", headers: { "content-type": "application/zip", "x-wb-backup-policy": JSON.stringify(policyMap) }, body: file })
            .then(function (r) {
              if (r.status === 422) {
                return r.json().catch(function () { return {}; }).then(function () {
                  setMsg(t("backup_incompatible"));
                  return null;
                });
              }
              return r.json().catch(function () { return null; }).then(function (j) {
                if (!r.ok) throw new Error((j && j.error) || ("HTTP " + r.status));
                if (!j) throw new Error(t("backup_invalid"));
                setReport(j);
                setMsg(j.ok ? t("backup_import_done") : t("backup_import_result"));
                return j;
              });
            })
            .catch(function (e) {
              setMsg(t("backup_import_failed") + ": " + String((e && e.message) || e));
            })
            .then(function () { setBusy(""); });
        }
        function moduleCaps(a) {
          var caps = [];
          if (a.backup && a.backup.export) caps.push(t("backup_cap_export"));
          if (a.backup && a.backup.import) caps.push(t("backup_cap_import"));
          return caps.join(" · ");
        }

        return jsx.jsxs("div", { className: "wb-backup", children: [
          jsx.jsxs("div", { className: "wb-card", children: [
            jsx.jsxs("div", { className: "wb-sec", children: [
              jsx.jsx("h3", { children: t("backup_modules") }),
              jsx.jsxs("div", { className: "wb-backup-actions", children: [
                jsx.jsx("button", { className: "wb-btn ghost", disabled: !exportable.length, onClick: function () { selectAll(true); }, children: t("backup_select_all") }),
                jsx.jsx("button", { className: "wb-btn ghost", disabled: !exportable.length, onClick: function () { selectAll(false); }, children: t("backup_clear") }),
              ] }),
            ] }),
            exportable.length
              ? jsx.jsx("div", { className: "wb-stack", style: { marginTop: 10 }, children: exportable.map(function (a) {
                  var open = !!openConfig[a.id];
                  return jsx.jsxs(react.Fragment, { children: [
                    jsx.jsxs("div", { className: "wb-backup-row" + (open ? " open" : ""), children: [
                      jsx.jsxs("label", { className: "wb-backup-row-main", children: [
                        jsx.jsx("input", { type: "checkbox", checked: !!selected[a.id], onChange: function () { toggle(a.id); } }),
                        jsx.jsxs("span", { className: "wb-backup-main", children: [
                          jsx.jsxs("span", { className: "wb-backup-name", children: [a.title || a.id, jsx.jsx("span", { className: "wb-badge", children: "v" + (a.version || "?") })] }),
                          jsx.jsx("span", { className: "wb-backup-meta", children: moduleCaps(a) }),
                          a.description ? jsx.jsx("span", { className: "wb-backup-meta", children: a.description }) : null,
                        ] }),
                      ] }),
                      jsx.jsx("button", {
                        type: "button",
                        className: "wb-backup-gear" + (open ? " active" : ""),
                        title: t("backup_dup_policy"),
                        "aria-label": t("backup_dup_policy"),
                        "aria-expanded": open,
                        onClick: function () { toggleConfig(a.id); },
                        children: "⚙",
                      }),
                    ] }),
                    open ? jsx.jsxs("div", { className: "wb-backup-config", children: [
                      jsx.jsx("span", { className: "wb-backup-config-label", children: t("backup_dup_policy") }),
                      jsx.jsx("select", {
                        className: "wb-select",
                        value: policyOf(a.id),
                        onChange: function (e) { setPolicy(a.id, e.target.value); },
                        children: [
                          jsx.jsx("option", { value: "newest", children: t("backup_dup_newest") }),
                          jsx.jsx("option", { value: "skip", children: t("backup_dup_skip") }),
                          jsx.jsx("option", { value: "overwrite", children: t("backup_dup_overwrite") }),
                        ],
                      }),
                      jsx.jsx("span", { className: "wb-backup-note", children: t("backup_dup_hint") }),
                    ] }) : null,
                  ] }, a.id);
                }) })
              : jsx.jsx("div", { className: "wb-msg", children: t("backup_no_modules") }),
            jsx.jsxs("div", { className: "wb-backup-actions", style: { marginTop: 12 }, children: [
              jsx.jsx("button", { className: "wb-btn", disabled: !!busy || !exportable.length, onClick: doExport, children: busy === "export" ? t("backup_exporting") : t("backup_export") }),
              jsx.jsx("button", { className: "wb-btn ghost", disabled: !!busy, onClick: function () { if (fileRef.current) fileRef.current.click(); }, children: busy === "import" ? t("backup_importing") : t("backup_import") }),
              jsx.jsx("span", { className: "wb-backup-note", children: t("backup_file_hint") }),
            ] }),
            jsx.jsx("input", { ref: fileRef, type: "file", accept: ".zip,application/zip", className: "wb-backup-file", onChange: doImport }),
            msg ? jsx.jsx("div", { className: "wb-msg", style: { textAlign: "left", padding: "10px 0 0", opacity: 0.8 }, children: msg }) : null,
          ] }),
          exported ? jsx.jsxs("div", { className: "wb-card wb-backup-report", children: [
            jsx.jsxs("div", { className: "wb-sec", children: [
              jsx.jsx("h3", { children: t("backup_export_result") }),
              jsx.jsx("span", { className: "wb-hint", children: t("backup_download_started") }),
            ] }),
            jsx.jsx("div", { className: "wb-stack", children: exported.map(function (a) {
              return jsx.jsxs("div", { className: "wb-backup-result-row", children: [
                jsx.jsx("span", { className: "wb-backup-table", children: a.table }),
                jsx.jsxs("span", { className: "wb-backup-meta", children: [a.module, jsx.jsx("span", { className: "wb-badge", children: "v" + (a.version || "?") })] }),
              ] }, a.id);
            }) }),
          ] }) : null,
          report ? jsx.jsxs("div", { className: "wb-card wb-backup-report", children: [
            jsx.jsxs("div", { className: "wb-sec", children: [
              jsx.jsx("h3", { children: t("backup_import_result") }),
              jsx.jsxs("span", { className: "wb-hint", children: [
                t("backup_summary"), ": ",
                t("backup_ok") + " " + report.summary.ok + " · ",
                t("backup_partial") + " " + report.summary.partial + " · ",
                t("backup_failed") + " " + report.summary.failed + " · ",
                t("backup_skipped") + " " + report.summary.skipped,
              ] }),
            ] }),
            jsx.jsxs("div", { className: "wb-backup-meta", children: [
              t("backup_exported_at") + ": " + (report.exportedAt || "?"),
              " · " + t("backup_shell_version") + ": " + (report.shellVersion || "?"),
              " · " + t("backup_format") + ": v" + report.formatVersion,
            ] }),
            jsx.jsx("table", { className: "wb-backup-table", children: [
              jsx.jsxs("thead", { children: [
                jsx.jsxs("tr", { children: [
                  jsx.jsx("th", { children: t("backup_detail") }),
                  jsx.jsx("th", { children: t("backup_status") }),
                  jsx.jsx("th", { children: t("backup_policy") }),
                  jsx.jsx("th", { children: t("backup_imported") }),
                  jsx.jsx("th", { children: t("backup_skipped") }),
                  jsx.jsx("th", { children: t("backup_failed") }),
                ] }),
              ] }),
              jsx.jsxs("tbody", { children: (report.results || []).map(function (r) {
                return jsx.jsxs("tr", { children: [
                  jsx.jsxs("td", { children: [
                    jsx.jsx("div", { children: r.title || r.id }),
                    r.message ? jsx.jsx("div", { className: "wb-backup-meta", children: r.message }) : null,
                  ] }),
                  jsx.jsx("td", { children: jsx.jsx("span", { className: "wb-backup-status " + r.status, children: statusLabel(r.status) }) }),
                  jsx.jsx("td", { className: "wb-backup-meta", children: policyLabel(r.policy) }),
                  jsx.jsx("td", { className: "num", children: r.imported || 0 }),
                  jsx.jsx("td", { className: "num", children: r.skipped || 0 }),
                  jsx.jsx("td", { className: "num", children: r.failed || 0 }),
                ] }, r.id);
              }) }),
            ] }),
          ] }) : null,
        ] });
      }

      function ensureCss() {
        if (typeof document === "undefined") return;
        if (document.getElementById("wb-css")) return;
        var s = document.createElement("style");
        s.id = "wb-css";
        s.setAttribute("data-plugin-css", NS);
        s.textContent = CSS;
        document.head.appendChild(s);
      }

      function WorkbenchPage(props) {
        var t = props.t;
        var store = useAddonStore();
        var rs = react.useState("home"); var route = rs[0]; var setRoute = rs[1];
        var lang = currentLang();
        react.useEffect(function () { ensureCss(); }, []);

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

        if (route === "backup") {
          return jsx.jsxs("div", { className: "wb-root", children: [
            jsx.jsxs("div", { className: "wb-inner wb-wide", children: [pageHead(t("tab_backup"), t("backup_desc")), jsx.jsx(BackupTab, { t: t, lang: lang, addons: addons })] }),
          ] });
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
              systemCard("backup", "⤓", t("tab_backup"), t("backup_desc")),
              systemCard("account", "☁", t("tab_account"), t("account_desc")),
            ] }),
          ] }),
        ] });
      }

      var RecordToggle = function (props) {
        var sid = props && props.sessionId;
        var st = react.useState(false); var on = st[0]; var setOn = st[1];
        var bst = react.useState(false); var busy = bst[0]; var setBusy = bst[1];
        var est = react.useState(""); var err = est[0]; var setErr = est[1];
        var t = props && props.t;

        react.useEffect(function () {
          if (!sid) return;
          var fn = function (changed, value) { if (changed === sid) setOn(!!value); };
          recordListeners.add(fn);
          ensureStream();
          fetch("/workbench/api/record?sessionId=" + encodeURIComponent(sid))
            .then(function (r) { return r.json(); })
            .then(function (j) { if (j && j.ok) setRecordMode(sid, !!j.enabled); })
            .catch(function () { /* 宿主不可达时保持关闭态，不打扰输入 */ });
          return function () { recordListeners.delete(fn); };
        }, [sid]);

        function toggle() {
          if (!sid || busy) return;
          setBusy(true); setErr("");
          fetch("/workbench/api/record", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ sessionId: sid, enabled: !on }),
          })
            .then(function (r) { return r.json(); })
            .then(function (j) {
              if (!j || !j.ok) throw new Error((j && j.error) || "request failed");
              setRecordMode(sid, !!j.enabled);
            })
            .catch(function (e) { var msg = String((e && e.message) || e); setErr(msg); try { console.warn("[dsh-workbench] record toggle failed:", msg); } catch (_) {} })
            .then(function () { setBusy(false); });
        }

        if (!sid) return null;
        var label = busy ? t("record_busy") : err ? t("record_failed_short") : on ? t("record_on") : t("record_off");
        var title = err ? t("record_error") + ": " + err : on ? t("record_on_title") : t("record_off_title");
        return h("button", {
          type: "button",
          className: "wb-record-pill" + (on ? " on" : "") + (err ? " err" : ""),
          onClick: toggle,
          disabled: busy,
          title: title,
          "aria-label": t("record_label") + ": " + label,
          "aria-pressed": on ? "true" : "false",
        },
          h("span", { className: "wb-record-dot" }),
          h("span", { className: "wb-record-label", children: label })
        );
      };

      var exports_ = {
        name: NS,
        inject: ["slots", "locale", "theme"],
        apply: function (ctx) {
          try {
            ensureCss();
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
            ctx.slots.inject("conversation.input.left", function () {
              return ctx.slots.register(
                { name: "conversation.input.left", id: NS + "-record", order: 40, label: function () { return t("record_label"); } },
                function (props) { return h(RecordToggle, { sessionId: props && props.sessionId, t: t }); }
              );
            });
          } catch (e) { console.error("[dsh-workbench] apply crashed:", e, e && e.stack); throw e; }
        },
      };
      return exports_;
    },
  });
})();
