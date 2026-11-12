// 由 scripts/build-addon-clients.mjs 生成；请修改对应 client/client.src.cjs 后重新构建。
window.__ModuleLoader__ = window.__ModuleLoader__ || { modules: {}, load: function (m) { this.modules[m.id] = m.factory; } };
window.__ModuleLoader__.load({
  id: "dsh-workbench-host",
  factory: function (require) {
    var module = { exports: {} };
    var exports = module.exports;
"use strict";
var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};

// packages/shell/client/locale.cjs
var require_locale = __commonJS({
  "packages/shell/client/locale.cjs"(exports2, module2) {
    "use strict";
    var LOCALE2 = {
      zh: {
        nav: "\u5DE5\u4F5C\u53F0",
        title: "\u5DE5\u4F5C\u53F0",
        tagline: "\u79BB\u7EBF\u4F18\u5148 \xB7 \u4E1A\u52A1\u63D2\u4EF6\u7531 DSH \u5B89\u88C5",
        tab_account: "\u8D26\u53F7\u4E0E\u540C\u6B65",
        tab_addons: "\u5B50\u63D2\u4EF6",
        tab_backup: "\u6570\u636E\u5907\u4EFD",
        backup_desc: "\u6309\u6A21\u5757\u5BFC\u51FA\u6216\u5BFC\u5165\u672C\u5730\u6570\u636E\uFF1B\u5BFC\u5165\u53EA\u5408\u5E76\uFF0C\u4E0D\u5220\u9664\u5DF2\u6709\u6570\u636E",
        backup_modules: "\u9009\u62E9\u8981\u5BFC\u51FA\u7684\u6A21\u5757",
        backup_export_result: "\u5BFC\u51FA\u7ED3\u679C",
        backup_select_all: "\u5168\u9009",
        backup_clear: "\u6E05\u7A7A",
        backup_export: "\u5BFC\u51FA\u5907\u4EFD",
        backup_import: "\u5BFC\u5165\u5907\u4EFD",
        backup_exporting: "\u6B63\u5728\u5BFC\u51FA\u2026",
        backup_importing: "\u6B63\u5728\u5BFC\u5165\u2026",
        backup_no_modules: "\u5F53\u524D\u6CA1\u6709\u53EF\u5BFC\u51FA\u7684\u6A21\u5757",
        backup_select_required: "\u81F3\u5C11\u9009\u62E9\u4E00\u4E2A\u6A21\u5757",
        backup_import_result: "\u5BFC\u5165\u7ED3\u679C",
        backup_summary: "\u6C47\u603B",
        backup_detail: "\u6A21\u5757\u660E\u7EC6",
        backup_status: "\u72B6\u6001",
        backup_imported: "\u5BFC\u5165",
        backup_skipped: "\u8DF3\u8FC7",
        backup_failed: "\u5931\u8D25",
        backup_ok: "\u6210\u529F",
        backup_partial: "\u90E8\u5206\u6210\u529F",
        backup_failed_status: "\u5931\u8D25",
        backup_skipped_status: "\u8DF3\u8FC7",
        backup_exported_at: "\u5BFC\u51FA\u65F6\u95F4",
        backup_shell_version: "\u58F3\u7248\u672C",
        backup_format: "\u5907\u4EFD\u683C\u5F0F",
        backup_incompatible: "\u5907\u4EFD\u683C\u5F0F\u7248\u672C\u4E0D\u517C\u5BB9\uFF0C\u8BF7\u5347\u7EA7\u5DE5\u4F5C\u53F0\u540E\u518D\u5BFC\u5165",
        backup_invalid: "\u5907\u4EFD\u6587\u4EF6\u65E0\u6548",
        backup_file_hint: "\u652F\u6301 .zip \u5907\u4EFD\u5305",
        backup_download_started: "\u5DF2\u5F00\u59CB\u4E0B\u8F7D\u5907\u4EFD",
        backup_import_done: "\u5BFC\u5165\u5B8C\u6210",
        backup_export_failed: "\u5BFC\u51FA\u5931\u8D25",
        backup_import_failed: "\u5BFC\u5165\u5931\u8D25",
        backup_no_import: "\u672A\u5B9E\u73B0\u5BFC\u5165",
        backup_no_export: "\u672A\u5B9E\u73B0\u5BFC\u51FA",
        backup_refresh: "\u91CD\u65B0\u8BFB\u53D6\u6A21\u5757",
        backup_cap_export: "\u53EF\u5BFC\u51FA",
        backup_cap_import: "\u53EF\u5BFC\u5165",
        backup_dup_policy: "\u91CD\u590D ID \u65F6",
        backup_dup_newest: "\u4EE5\u65F6\u95F4\u6700\u65B0\u4E3A\u4E3B",
        backup_dup_skip: "\u4FDD\u7559\u672C\u5730\uFF08\u8DF3\u8FC7\uFF09",
        backup_dup_overwrite: "\u7528\u5907\u4EFD\u8986\u76D6",
        backup_dup_hint: "\u5BFC\u5165\u65F6\u5BF9\u540C ID \u8BB0\u5F55\u7684\u5904\u7406\u65B9\u5F0F",
        backup_policy: "\u7B56\u7565",
        back_home: "\u8FD4\u56DE\u9996\u9875",
        open: "\u6253\u5F00",
        manage: "\u5DE5\u4F5C\u53F0\u7BA1\u7406",
        home_hint: "\u70B9\u5F00\u5361\u7247\u8FDB\u5165\u4E1A\u52A1\u63D2\u4EF6\uFF1B\u5B89\u88C5\u4E0E\u5378\u8F7D\u5728 DSH \u63D2\u4EF6\u7BA1\u7406\u91CC",
        account_desc: "\u767B\u5F55\u4E91\u7AEF\u8D26\u53F7\uFF0C\u5907\u4EFD\u4E0E\u540C\u6B65\u6570\u636E",
        tab_audit: "\u5BA1\u8BA1\u65E5\u5FD7",
        audit_desc: "\u672C\u673A\u884C\u4E3A\u8D26\u672C\uFF1A\u8C01\u5728\u4F55\u65F6\u8C03\u7528\u4E86\u54EA\u4E2A action\u3001\u6210\u529F\u4E0E\u5426\uFF1B\u5BC6\u7801\u4E0E token \u7B49\u53C2\u6570\u5DF2\u8131\u654F",
        audit_filters: "\u7B5B\u9009",
        audit_action_prefix: "action \u524D\u7F00",
        audit_actor: "\u5165\u53E3",
        audit_ok: "\u7ED3\u679C",
        audit_all: "\u5168\u90E8",
        audit_ok_only: "\u53EA\u770B\u6210\u529F",
        audit_fail_only: "\u53EA\u770B\u5931\u8D25",
        audit_q: "\u5173\u952E\u5B57",
        audit_since: "\u8D77\u59CB\u65E5\u671F",
        audit_until: "\u7ED3\u675F\u65E5\u671F",
        audit_search: "\u67E5\u8BE2",
        audit_refresh: "\u5237\u65B0",
        audit_empty: "\u5F53\u524D\u7B5B\u9009\u65E0\u8BB0\u5F55",
        audit_load_failed: "\u8BFB\u53D6\u5BA1\u8BA1\u65E5\u5FD7\u5931\u8D25",
        audit_time: "\u65F6\u95F4",
        audit_action: "action",
        audit_target: "\u76EE\u6807",
        audit_duration: "\u8017\u65F6",
        audit_detail: "\u53C2\u6570\u4E0E\u7ED3\u679C",
        audit_error: "\u9519\u8BEF",
        audit_active: "\u7B5B\u9009\u4E2D",
        audit_clear: "\u6E05\u9664\u7B5B\u9009",
        audit_loading: "\u67E5\u8BE2\u4E2D\u2026",
        audit_page_size: "\u6BCF\u9875\u6761\u6570",
        audit_stats: "\u8FD1 30 \u5929\uFF08\u4E0D\u53D7\u4E0A\u65B9\u7B5B\u9009\u5F71\u54CD\uFF09",
        audit_total: "\u5171",
        audit_failed: "\u5931\u8D25",
        audit_prev: "\u4E0A\u4E00\u9875",
        audit_next: "\u4E0B\u4E00\u9875",
        audit_page: "\u9875",
        audit_retention: "\u9ED8\u8BA4\u4FDD\u7559 90 \u5929\uFF1B\u53EF\u7528 audit.prune \u8C03\u6574\u4FDD\u7559\u671F",
        audit_reads_hint: "\u53EA\u8BFB action \u9ED8\u8BA4\u4E0D\u8BB0\uFF1Bmeta.audit.recordReads=1 \u65F6\u8BB0\u5F55",
        addons_desc: "\u5B89\u88C5\u3001\u5347\u7EA7\u6216\u5378\u8F7D\u5B50\u63D2\u4EF6",
        no_views: "\u8BE5\u5B50\u63D2\u4EF6\u6CA1\u6709\u6CE8\u518C\u754C\u9762",
        addon_loading: "\u6B63\u5728\u52A0\u8F7D\u5B50\u63D2\u4EF6\u754C\u9762\u2026",
        addon_unavailable: "\u5B50\u63D2\u4EF6\u754C\u9762\u4E0D\u53EF\u7528",
        views: "\u4E2A\u89C6\u56FE",
        addons_installed: "\u5DF2\u5B89\u88C5\u7684\u5B50\u63D2\u4EF6",
        addons_cloud: "\u4E91\u7AEF\u76EE\u5F55",
        install: "\u5B89\u88C5",
        upgrade: "\u5347\u7EA7",
        installed: "\u5DF2\u5B89\u88C5",
        uninstall: "\u5378\u8F7D",
        confirm_uninstall: "\u786E\u8BA4\u5378\u8F7D",
        installing: "\u6B63\u5728\u5B89\u88C5\u2026",
        refresh: "\u5237\u65B0\u76EE\u5F55",
        no_installed: "\u8FD8\u6CA1\u6709\u5B89\u88C5\u4E1A\u52A1\u63D2\u4EF6\u2014\u2014\u5728 DSH \u63D2\u4EF6\u7BA1\u7406\u91CC\u5B89\u88C5\u4EFB\u52A1\u8BB0\u5F55\u3001\u6807\u7B7E\u6216\u7AD9\u70B9",
        no_catalog: "\u4E91\u7AEF\u76EE\u5F55\u4E3A\u7A7A\u6216\u4E0D\u53EF\u8FBE",
        catalog_loading: "\u6B63\u5728\u8BFB\u53D6\u4E91\u7AEF\u76EE\u5F55\u2026",
        cached_notice: "\u4E91\u7AEF\u4E0D\u53EF\u8FBE\uFF0C\u663E\u793A\u4E0A\u6B21\u7F13\u5B58\u7684\u76EE\u5F55",
        install_failed: "\u5B89\u88C5\u5931\u8D25",
        uninstall_failed: "\u5378\u8F7D\u5931\u8D25",
        load_failed: "\u5BA2\u6237\u7AEF\u52A0\u8F7D\u5931\u8D25",
        data_kept: "\u5378\u8F7D\u53EA\u5220\u4EE3\u7801\uFF0C\u6570\u636E\u4FDD\u7559\uFF1B\u91CD\u88C5\u540E\u6570\u636E\u4ECD\u5728",
        addon_error: "\u52A0\u8F7D\u5F02\u5E38",
        source_cloud: "\u4E91\u7AEF",
        source_local: "\u672C\u5730\u76EE\u5F55",
        version: "\u7248\u672C",
        latest: "\u6700\u65B0",
        shell_version: "\u58F3\u7248\u672C",
        delete: "\u5220\u9664",
        login: "\u767B\u5F55",
        signup: "\u6CE8\u518C",
        email: "\u90AE\u7BB1",
        password: "\u5BC6\u7801",
        logout: "\u9000\u51FA\u767B\u5F55",
        logged_in_as: "\u5DF2\u767B\u5F55",
        not_logged_in: "\u672A\u767B\u5F55\u2014\u2014\u6570\u636E\u4EC5\u5B58\u672C\u673A SQLite",
        sync_now: "\u7ACB\u5373\u540C\u6B65",
        sync_pushed: "\u63A8\u9001",
        sync_pulled: "\u62C9\u53D6",
        device_name: "\u672C\u8BBE\u5907",
        sync_status: "\u540C\u6B65\u72B6\u6001",
        sync_last: "\u4E0A\u6B21\u540C\u6B65",
        sync_never: "\u5C1A\u672A\u540C\u6B65",
        sync_conflicts: "\u51B2\u7A81",
        sync_failed_tables: "\u5931\u8D25\u7684\u8868",
        sync_clock: "\u65F6\u949F\u504F\u79FB",
        sync_no_conflicts: "\u6CA1\u6709\u5F85\u5904\u7406\u7684\u51B2\u7A81",
        sync_conflict_hint: "\u540C\u4E00\u884C\u5728\u672C\u5730\u548C\u4E91\u7AEF\u90FD\u88AB\u4FEE\u6539\uFF0C\u9009\u62E9\u4FDD\u7559\u54EA\u4E2A\u7248\u672C",
        sync_keep_local: "\u4FDD\u7559\u672C\u5730",
        sync_keep_server: "\u91C7\u7528\u4E91\u7AEF",
        sync_dismiss: "\u5FFD\u7565",
        sync_resolve_failed: "\u51B2\u7A81\u5904\u7406\u5931\u8D25",
        sync_ok: "\u540C\u6B65\u5B8C\u6210",
        sync_partial: "\u90E8\u5206\u8868\u540C\u6B65\u5931\u8D25",
        cloud_status: "\u4E91\u7AEF\u8FDE\u63A5\u72B6\u6001",
        cloud_checking: "\u68C0\u67E5\u4E91\u7AEF\u2026",
        cloud_checking_hint: "\u6B63\u5728\u68C0\u67E5\u4E91\u7AEF\u8FDE\u63A5",
        cloud_local: "\u672C\u5730\u6A21\u5F0F",
        cloud_local_hint: "\u672A\u767B\u5F55\u4E91\u7AEF\uFF1B\u6570\u636E\u53EA\u4FDD\u5B58\u5728\u672C\u673A\uFF0C\u4ECD\u53EF\u6B63\u5E38\u4F7F\u7528",
        cloud_syncing: "\u6B63\u5728\u540C\u6B65\u2026",
        cloud_syncing_hint: "\u6B63\u5728\u4E0E\u4E91\u7AEF\u540C\u6B65\u6570\u636E",
        cloud_online: "\u4E91\u7AEF\u5DF2\u8FDE\u63A5",
        cloud_online_hint: "\u8D26\u53F7\u5DF2\u8FDE\u63A5\uFF0C\u6570\u636E\u4F1A\u81EA\u52A8\u540C\u6B65",
        cloud_offline: "\u4E91\u7AEF\u8FDE\u63A5\u5931\u8D25",
        cloud_offline_hint: "\u65E0\u6CD5\u8FDE\u63A5\u5230\u4E91\u7AEF\uFF1B\u672C\u5730\u6570\u636E\u4ECD\u53EF\u6B63\u5E38\u4F7F\u7528",
        cloud_never: "\u7B49\u5F85\u9996\u6B21\u540C\u6B65",
        cloud_never_hint: "\u5DF2\u767B\u5F55\u4E91\u7AEF\uFF0C\u6B63\u5728\u7B49\u5F85\u9996\u8F6E\u540C\u6B65",
        cloud_sync_failed: "\u540C\u6B65\u5F02\u5E38",
        cloud_sync_failed_hint: "\u4E91\u7AEF\u53EF\u8FDE\u63A5\uFF0C\u4F46\u4E0A\u6B21\u540C\u6B65\u672A\u5B8C\u5168\u6210\u529F",
        cloud_open: "\u6253\u5F00\u8D26\u53F7\u4E0E\u540C\u6B65",
        record_label: "\u8BB0\u5F55\u6A21\u5F0F",
        record_on: "\u8BB0\u5F55\u4E2D",
        record_off: "\u8BB0\u5F55",
        record_on_title: "\u672C\u4F1A\u8BDD\u8BB0\u5F55\u6A21\u5F0F\u5DF2\u5F00\u542F\uFF0C\u70B9\u51FB\u5173\u95ED",
        record_off_title: "\u5F00\u542F\u540E\u628A\u5B8C\u6210\u7684\u53EF\u4EA4\u4ED8\u5185\u5BB9\u8BB0\u5230\u5DE5\u4F5C\u53F0\uFF08\u4EC5\u672C\u4F1A\u8BDD\uFF09",
        record_busy: "\u5207\u6362\u4E2D",
        record_error: "\u5207\u6362\u5931\u8D25",
        record_failed_short: "\u8BB0\u5F55\u5931\u8D25"
      },
      en: {
        nav: "Workbench",
        title: "Workbench",
        tagline: "Offline-first \xB7 addons installed by DSH",
        tab_account: "Account & Sync",
        tab_addons: "Addons",
        tab_backup: "Data backup",
        backup_desc: "Export or import local data per module; import merges and never deletes existing rows",
        backup_modules: "Modules to export",
        backup_export_result: "Export result",
        backup_select_all: "Select all",
        backup_clear: "Clear",
        backup_export: "Export backup",
        backup_import: "Import backup",
        backup_exporting: "Exporting\u2026",
        backup_importing: "Importing\u2026",
        backup_no_modules: "No exportable modules",
        backup_select_required: "Select at least one module",
        backup_import_result: "Import result",
        backup_summary: "Summary",
        backup_detail: "Module details",
        backup_status: "Status",
        backup_imported: "imported",
        backup_skipped: "skipped",
        backup_failed: "failed",
        backup_ok: "ok",
        backup_partial: "partial",
        backup_failed_status: "failed",
        backup_skipped_status: "skipped",
        backup_exported_at: "Exported at",
        backup_shell_version: "Shell version",
        backup_format: "Format",
        backup_incompatible: "Backup format is incompatible; update the workbench before importing",
        backup_invalid: "Invalid backup file",
        backup_file_hint: "Supports .zip backups",
        backup_download_started: "Backup download started",
        backup_import_done: "Import finished",
        backup_export_failed: "Export failed",
        backup_import_failed: "Import failed",
        backup_no_import: "Import not implemented",
        backup_no_export: "Export not implemented",
        backup_refresh: "Reload modules",
        backup_cap_export: "export",
        backup_cap_import: "import",
        backup_dup_policy: "On duplicate ID",
        backup_dup_newest: "Keep newest by time",
        backup_dup_skip: "Keep local (skip)",
        backup_dup_overwrite: "Overwrite with backup",
        backup_dup_hint: "How to handle rows with the same ID on import",
        backup_policy: "Policy",
        back_home: "Back to home",
        open: "Open",
        manage: "Manage",
        home_hint: "Open a card to enter a domain; install or remove plugins in DSH",
        account_desc: "Sign in to back up and sync your data",
        tab_audit: "Audit log",
        audit_desc: "A local ledger of who called which action and how it went; passwords and tokens are redacted",
        audit_filters: "Filters",
        audit_action_prefix: "Action prefix",
        audit_actor: "Actor",
        audit_ok: "Result",
        audit_all: "All",
        audit_ok_only: "Succeeded",
        audit_fail_only: "Failed",
        audit_q: "Keyword",
        audit_since: "Since",
        audit_until: "Until",
        audit_search: "Search",
        audit_refresh: "Refresh",
        audit_empty: "No audit records match",
        audit_load_failed: "Failed to load the audit log",
        audit_time: "Time",
        audit_action: "Action",
        audit_target: "Target",
        audit_duration: "Duration",
        audit_detail: "Arguments & result",
        audit_error: "Error",
        audit_active: "Filtering",
        audit_clear: "Clear filters",
        audit_loading: "Loading\u2026",
        audit_page_size: "Records per page",
        audit_stats: "Last 30 days (unaffected by filters)",
        audit_total: "total",
        audit_failed: "failed",
        audit_prev: "Previous",
        audit_next: "Next",
        audit_page: "page",
        audit_retention: "Retained for 90 days by default; adjust with audit.prune",
        audit_reads_hint: "Read-only actions are not recorded unless meta.audit.recordReads=1",
        addons_desc: "Install, update or uninstall addons",
        no_views: "This addon has no UI",
        addon_loading: "Loading addon UI\u2026",
        addon_unavailable: "Addon UI unavailable",
        views: "views",
        addons_installed: "Installed addons",
        addons_cloud: "Cloud catalog",
        install: "Install",
        upgrade: "Update",
        installed: "Installed",
        uninstall: "Uninstall",
        confirm_uninstall: "Confirm uninstall",
        installing: "Installing\u2026",
        refresh: "Refresh catalog",
        no_installed: "No domains yet \u2014 install Tasks, Tags or Sites from DSH plugins",
        no_catalog: "Catalog is empty or unreachable",
        catalog_loading: "Loading catalog\u2026",
        cached_notice: "Cloud unreachable \u2014 showing the cached catalog",
        install_failed: "Install failed",
        uninstall_failed: "Uninstall failed",
        load_failed: "client failed to load",
        data_kept: "Uninstall removes code only; data is kept and reappears after reinstall",
        addon_error: "load error",
        source_cloud: "cloud",
        source_local: "local dir",
        version: "version",
        latest: "latest",
        shell_version: "shell",
        delete: "Delete",
        login: "Login",
        signup: "Sign up",
        email: "Email",
        password: "Password",
        logout: "Log out",
        logged_in_as: "Signed in",
        not_logged_in: "Not signed in \u2014 data stays local",
        sync_now: "Sync now",
        sync_pushed: "pushed",
        sync_pulled: "pulled",
        device_name: "This device",
        sync_status: "Sync status",
        sync_last: "Last sync",
        sync_never: "Never synced",
        sync_conflicts: "Conflicts",
        sync_failed_tables: "Failed tables",
        sync_clock: "Clock offset",
        sync_no_conflicts: "No pending conflicts",
        sync_conflict_hint: "The same row changed locally and remotely; choose which version to keep",
        sync_keep_local: "Keep local",
        sync_keep_server: "Use remote",
        sync_dismiss: "Dismiss",
        sync_resolve_failed: "Failed to resolve conflict",
        sync_ok: "Sync complete",
        sync_partial: "Some tables failed",
        cloud_status: "Cloud connection",
        cloud_checking: "Checking cloud\u2026",
        cloud_checking_hint: "Checking the cloud connection",
        cloud_local: "Local only",
        cloud_local_hint: "Not signed in; data stays on this device",
        cloud_syncing: "Syncing\u2026",
        cloud_syncing_hint: "Syncing data with the cloud",
        cloud_online: "Cloud connected",
        cloud_online_hint: "Signed in; data syncs automatically",
        cloud_offline: "Cloud unreachable",
        cloud_offline_hint: "Cannot reach the cloud; local data still works",
        cloud_never: "Waiting for first sync",
        cloud_never_hint: "Signed in; waiting for the first sync",
        cloud_sync_failed: "Sync issue",
        cloud_sync_failed_hint: "Cloud is reachable but the last sync did not fully succeed",
        cloud_open: "Open Account & Sync",
        record_label: "Record mode",
        record_on: "Recording",
        record_off: "Record",
        record_on_title: "Record mode is on for this session; click to turn it off",
        record_off_title: "Record finished deliverables to the workbench (this session only)",
        record_busy: "Switching",
        record_error: "Switch failed",
        record_failed_short: "Failed"
      }
    };
    module2.exports = LOCALE2;
  }
});

// packages/shell/client/styles.cjs
var require_styles = __commonJS({
  "packages/shell/client/styles.cjs"(exports2, module2) {
    "use strict";
    var CSS2 = [
      ".wb-root{--wb-line:var(--dsw-alias-border-l2,color-mix(in oklab,currentColor 16%,transparent));--wb-surface:var(--dsw-alias-bg-layer-1,color-mix(in oklab,currentColor 4%,transparent));display:flex;flex-direction:column;height:100%;box-sizing:border-box;overflow:auto;color:inherit;font-size:13px;background:var(--dsw-alias-bg-base,var(--dsw-alias-bg-layer-2,color-mix(in oklab,currentColor 4%,transparent)));padding:24px 28px}",
      ".wb-inner{display:flex;flex-direction:column;gap:16px;width:100%;max-width:1040px;margin:0 auto}",
      ".wb-hero{display:flex;align-items:flex-end;justify-content:space-between;gap:16px;flex-wrap:wrap}",
      ".wb-hero h2{margin:0;font-size:18px;font-weight:650;letter-spacing:.2px}",
      ".wb-tag{font-size:12px;opacity:.62;margin-top:4px;display:block;line-height:1.5}",
      ".wb-cloud{display:inline-flex;align-items:center;gap:7px;max-width:100%;padding:6px 11px;border:1px solid var(--wb-line);border-radius:999px;background:var(--wb-surface);color:inherit;font:inherit;font-size:12px;line-height:1.2;cursor:pointer;white-space:nowrap;transition:border-color .15s ease,background .15s ease}",
      ".wb-cloud:hover{border-color:var(--dsw-alias-brand-primary,#11a89b)}",
      ".wb-cloud:focus-visible{outline:2px solid var(--dsw-alias-brand-primary,#11a89b);outline-offset:2px}",
      ".wb-cloud-dot{width:7px;height:7px;border-radius:50%;background:currentColor;opacity:.4;flex:none}",
      ".wb-cloud.local{opacity:.7}",
      ".wb-cloud.on .wb-cloud-dot{background:var(--dsw-alias-state-success-primary,#18a058);opacity:1;box-shadow:0 0 0 3px color-mix(in oklab,var(--dsw-alias-state-success-primary,#18a058) 16%,transparent)}",
      ".wb-cloud.off{border-color:color-mix(in oklab,var(--dsw-alias-state-error-primary,#e5484d) 35%,var(--wb-line));background:color-mix(in oklab,var(--dsw-alias-state-error-primary,#e5484d) 5%,var(--wb-surface))}",
      ".wb-cloud.off .wb-cloud-dot{background:var(--dsw-alias-state-error-primary,#e5484d);opacity:1}",
      ".wb-cloud.warn{border-color:color-mix(in oklab,var(--dsw-alias-state-warn-primary,#d48806) 35%,var(--wb-line))}",
      ".wb-cloud.warn .wb-cloud-dot{background:var(--dsw-alias-state-warn-primary,#d48806);opacity:1}",
      ".wb-cloud.syncing .wb-cloud-dot{background:var(--dsw-alias-brand-primary,#11a89b);opacity:1;animation:wb-cloud-pulse 1.2s ease-in-out infinite}",
      "@keyframes wb-cloud-pulse{0%,100%{box-shadow:0 0 0 0 color-mix(in oklab,var(--dsw-alias-brand-primary,#11a89b) 0%,transparent)}50%{box-shadow:0 0 0 4px color-mix(in oklab,var(--dsw-alias-brand-primary,#11a89b) 18%,transparent)}}",
      "@media (prefers-reduced-motion:reduce){.wb-cloud.syncing .wb-cloud-dot{animation:none}}",
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
      ".wb-immersive-main>.wb-inner{max-width:none}",
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
      ".wb-audit-filters{display:flex;flex-wrap:wrap;gap:10px;align-items:flex-end;margin-top:10px}",
      ".wb-audit-field{display:flex;flex:1 1 150px;min-width:0;flex-direction:column;gap:5px;font-size:12px}",
      ".wb-audit-field .wb-input,.wb-audit-field .wb-select{width:100%;min-width:0;box-sizing:border-box;height:36px;padding:6px 9px;font-size:12px}",
      ".wb-audit-summary{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-top:12px;font-size:12px;overflow-wrap:anywhere}",
      ".wb-audit-summary span{min-width:0}.wb-audit-row:focus-visible{outline:2px solid var(--dsw-alias-brand-primary,#11a89b);outline-offset:-2px}",
      "@media(max-width:480px){.wb-audit-field{flex-basis:100%}.wb-audit-pager{flex-wrap:wrap}.wb-audit-filters .wb-btn{flex:1}}",
      ".wb-audit-table{width:100%;border-collapse:collapse;font-size:12px}",
      ".wb-audit-table th{text-align:left;font-weight:600;opacity:.6;padding:6px 8px;border-bottom:1px solid var(--wb-line);white-space:nowrap}",
      ".wb-audit-table td{padding:7px 8px;border-bottom:1px solid var(--wb-line);vertical-align:top}",
      ".wb-audit-row{cursor:pointer}",
      ".wb-audit-row:hover td{background:color-mix(in oklab,var(--dsw-alias-brand-primary,#11a89b) 5%,transparent)}",
      ".wb-audit-mono{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11px}",
      ".wb-audit-ok{color:#1a9c6a;font-weight:600}",
      ".wb-audit-fail{color:#d0483c;font-weight:600}",
      ".wb-audit-dim{opacity:.55}",
      ".wb-audit-pre{white-space:pre-wrap;word-break:break-word;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11px;line-height:1.6;background:color-mix(in oklab,var(--wb-line) 18%,transparent);border-radius:8px;padding:9px 11px;margin:6px 0 4px}",
      ".wb-audit-pager{display:flex;align-items:center;gap:10px;margin-top:12px}",
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
      ".wb-record-pill.on .wb-record-dot{background:var(--dsw-alias-brand-primary,#11a89b);opacity:1;box-shadow:0 0 0 3px color-mix(in oklab,var(--dsw-alias-brand-primary,#11a89b) 18%,transparent)}"
    ].join("\n");
    module2.exports = CSS2;
  }
});

// packages/shell/client/system-tabs.cjs
var require_system_tabs = __commonJS({
  "packages/shell/client/system-tabs.cjs"(exports2, module2) {
    "use strict";
    module2.exports = function createSystemTabs(react2, jsx2, useApi2) {
      function AccountTab2(props) {
        var t = props.t;
        var api = useApi2();
        var st = react2.useState(null);
        var me = st[0];
        var setMe = st[1];
        var st2 = react2.useState({ email: "", password: "", signup: false });
        var form = st2[0];
        var setForm = st2[1];
        var st3 = react2.useState("");
        var msg = st3[0];
        var setMsg = st3[1];
        var st4 = react2.useState(false);
        var syncing = st4[0];
        var setSyncing = st4[1];
        var st5 = react2.useState(null);
        var syncStatus = st5[0];
        var setSyncStatus = st5[1];
        var st6 = react2.useState([]);
        var conflicts = st6[0];
        var setConflicts = st6[1];
        function refreshSync() {
          api.get("/sync/status").then(function(r) {
            if (r && r.ok) setSyncStatus(r);
          });
          api.get("/sync/conflicts?limit=20").then(function(r) {
            setConflicts(r && Array.isArray(r.conflicts) ? r.conflicts : []);
          });
        }
        function refresh() {
          api.get("/account").then(function(r) {
            setMe(r);
            if (r && r.logged_in) refreshSync();
          });
        }
        react2.useEffect(function() {
          refresh();
        }, []);
        react2.useEffect(function() {
          if (!me || !me.logged_in) return void 0;
          var es = new EventSource("/workbench/api/events");
          function onSync() {
            refreshSync();
          }
          es.addEventListener("sync-done", onSync);
          es.addEventListener("sync-status", onSync);
          return function() {
            es.close();
          };
        }, [me && me.logged_in]);
        function submit() {
          api.post("/account/login", { email: form.email, password: form.password, signup: form.signup }).then(function(r) {
            setMsg(r.ok ? "" : r.error || "failed");
            refresh();
          });
        }
        function resolve(id, action) {
          api.post("/sync/conflicts/" + id + "/resolve", { action }).then(function(r) {
            if (!r || !r.ok) setMsg(t("sync_resolve_failed"));
            refreshSync();
          });
        }
        if (!me) return jsx2.jsx("div", { className: "wb-card", children: jsx2.jsx("span", { className: "wb-msg", children: "\u2026" }) });
        if (!me.logged_in) {
          return jsx2.jsxs("div", { className: "wb-card", children: [
            jsx2.jsx("div", { className: "wb-msg", style: { marginBottom: 10 }, children: t("not_logged_in") }),
            jsx2.jsxs("div", { className: "wb-form", children: [
              jsx2.jsx("input", { className: "wb-input", placeholder: t("email"), value: form.email, onChange: function(e) {
                setForm(Object.assign({}, form, { email: e.target.value }));
              } }),
              jsx2.jsx("input", { className: "wb-input", type: "password", placeholder: t("password"), value: form.password, onChange: function(e) {
                setForm(Object.assign({}, form, { password: e.target.value }));
              }, onKeyDown: function(e) {
                if (e.key === "Enter") submit();
              } }),
              jsx2.jsx("label", { className: "wb-msg", children: jsx2.jsxs("span", { children: [
                jsx2.jsx("input", { type: "checkbox", checked: form.signup, onChange: function(e) {
                  setForm(Object.assign({}, form, { signup: e.target.checked }));
                } }),
                " ",
                t("signup")
              ] }) }),
              jsx2.jsx("button", { className: "wb-btn", onClick: submit, children: form.signup ? t("signup") : t("login") })
            ] }),
            msg ? jsx2.jsx("div", { className: "wb-err", style: { marginTop: 8 }, children: msg }) : null
          ] });
        }
        var failed = syncStatus && Array.isArray(syncStatus.failed_tables) ? syncStatus.failed_tables : [];
        return jsx2.jsxs("div", { className: "wb-stack", children: [
          jsx2.jsxs("div", { className: "wb-card", children: [
            jsx2.jsxs("div", { children: [t("logged_in_as"), " ", me.user ? me.user.email : "", " (", t("device_name"), ")"] }),
            jsx2.jsxs("div", { className: "wb-form", style: { marginTop: 10 }, children: [
              jsx2.jsx("button", { className: "wb-btn", disabled: syncing, onClick: function() {
                setSyncing(true);
                api.post("/sync/now").then(function(r) {
                  setSyncing(false);
                  if (r && r.ok && Array.isArray(r.failed_tables) && r.failed_tables.length) {
                    setMsg(t("sync_partial") + ": " + r.failed_tables.join(", "));
                  } else {
                    setMsg(r && r.ok ? t("sync_ok") + " \xB7 " + t("sync_pushed") + " " + r.pushed + " \xB7 " + t("sync_pulled") + " " + r.pulled : r && r.error || "fail");
                  }
                  refreshSync();
                });
              }, children: syncing ? "\u2026" : t("sync_now") }),
              jsx2.jsx("button", { className: "wb-btn ghost", onClick: function() {
                api.post("/account/logout").then(refresh);
              }, children: t("logout") })
            ] }),
            msg ? jsx2.jsx("div", { className: "wb-msg", style: { marginTop: 8 }, children: msg }) : null,
            syncStatus ? jsx2.jsxs("div", { className: "wb-sync-status", children: [
              jsx2.jsxs("span", { children: [t("sync_last"), ": ", jsx2.jsx("b", { children: syncStatus.last_sync_at ? new Date(syncStatus.last_sync_at).toLocaleString() : t("sync_never") })] }),
              jsx2.jsxs("span", { children: [t("sync_conflicts"), ": ", jsx2.jsx("b", { children: syncStatus.conflicts || 0 })] }),
              failed.length ? jsx2.jsxs("span", { children: [t("sync_failed_tables"), ": ", jsx2.jsx("b", { children: failed.join(", ") })] }) : null,
              syncStatus.clock_offset ? jsx2.jsxs("span", { children: [t("sync_clock"), ": ", jsx2.jsx("b", { children: syncStatus.clock_offset + "ms" })] }) : null
            ] }) : null
          ] }),
          jsx2.jsxs("div", { className: "wb-card", children: [
            jsx2.jsxs("div", { className: "wb-sec", children: [
              jsx2.jsx("h3", { children: t("sync_conflicts") + " (" + conflicts.length + ")" }),
              jsx2.jsx("span", { className: "wb-hint", children: t("sync_conflict_hint") })
            ] }),
            conflicts.length ? conflicts.map(function(c) {
              return jsx2.jsxs("div", { className: "wb-conflict", children: [
                jsx2.jsxs("div", { className: "wb-conflict-main", children: [
                  jsx2.jsx("div", { children: (c.table_name || "") + " \xB7 " + (c.row_id || "") }),
                  jsx2.jsx("div", { className: "wb-conflict-meta", children: (c.kind || "") + (c.server_updated_at ? " \xB7 " + new Date(c.server_updated_at).toLocaleString() : "") })
                ] }),
                jsx2.jsxs("div", { className: "wb-conflict-actions", children: [
                  jsx2.jsx("button", { className: "wb-btn ghost", onClick: function() {
                    resolve(c.id, "keep_local");
                  }, children: t("sync_keep_local") }),
                  jsx2.jsx("button", { className: "wb-btn ghost", onClick: function() {
                    resolve(c.id, "keep_server");
                  }, children: t("sync_keep_server") }),
                  jsx2.jsx("button", { className: "wb-btn ghost", onClick: function() {
                    resolve(c.id, "dismiss");
                  }, children: t("sync_dismiss") })
                ] })
              ] }, c.id);
            }) : jsx2.jsx("div", { className: "wb-msg", children: t("sync_no_conflicts") })
          ] })
        ] });
      }
      function BackupTab2(props) {
        var t = props.t;
        var lang = props.lang;
        var addons = props.addons || [];
        var exportable = addons.filter(function(a) {
          return a && a.backup && a.backup.export;
        });
        var idsKey = exportable.map(function(a) {
          return a.id;
        }).join(",");
        var st = react2.useState({});
        var selected = st[0];
        var setSelected = st[1];
        var st2 = react2.useState("");
        var busy = st2[0];
        var setBusy = st2[1];
        var st3 = react2.useState("");
        var msg = st3[0];
        var setMsg = st3[1];
        var st4 = react2.useState(null);
        var report = st4[0];
        var setReport = st4[1];
        var st5 = react2.useState(null);
        var exported = st5[0];
        var setExported = st5[1];
        var st6 = react2.useState({});
        var policies = st6[0];
        var setPolicies = st6[1];
        var st7 = react2.useState({});
        var openConfig = st7[0];
        var setOpenConfig = st7[1];
        var fileRef = react2.useRef(null);
        react2.useEffect(function() {
          setSelected(function(prev) {
            var next = {};
            var changed = false;
            exportable.forEach(function(a) {
              if (prev[a.id]) next[a.id] = true;
              else next[a.id] = true;
              if (!prev[a.id]) changed = true;
            });
            Object.keys(prev).forEach(function(id) {
              if (!exportable.some(function(a) {
                return a.id === id;
              })) changed = true;
            });
            return changed ? next : prev;
          });
        }, [idsKey]);
        var allSelected = exportable.length > 0 && exportable.every(function(a) {
          return selected[a.id];
        });
        function toggle(id) {
          var next = Object.assign({}, selected);
          next[id] = !next[id];
          setSelected(next);
        }
        function selectAll(flag) {
          var next = {};
          exportable.forEach(function(a) {
            next[a.id] = flag;
          });
          setSelected(next);
        }
        function policyOf(id) {
          return policies[id] || "newest";
        }
        function policyLabel(policy) {
          if (policy === "skip") return t("backup_dup_skip");
          if (policy === "overwrite") return t("backup_dup_overwrite");
          return t("backup_dup_newest");
        }
        function setPolicy(id, value) {
          setPolicies(function(prev) {
            var next = Object.assign({}, prev);
            next[id] = value;
            return next;
          });
        }
        function toggleConfig(id) {
          setOpenConfig(function(prev) {
            var next = Object.assign({}, prev);
            next[id] = !next[id];
            return next;
          });
        }
        function statusLabel(status) {
          if (status === "ok") return t("backup_ok");
          if (status === "partial") return t("backup_partial");
          if (status === "skipped") return t("backup_skipped_status");
          return t("backup_failed_status");
        }
        function doExport() {
          if (busy) return;
          var chosen = exportable.filter(function(a) {
            return selected[a.id];
          });
          var ids = chosen.map(function(a) {
            return a.id;
          });
          if (!ids.length) {
            setMsg(t("backup_select_required"));
            return;
          }
          setBusy("export");
          setMsg("");
          setReport(null);
          setExported(null);
          var url = "/workbench/api/backup/export?modules=" + ids.map(encodeURIComponent).join(",");
          fetch(url).then(function(r) {
            if (!r.ok) {
              return r.json().catch(function() {
                return {};
              }).then(function(j) {
                throw new Error(j && j.error || "HTTP " + r.status);
              });
            }
            var cd = r.headers.get("content-disposition") || "";
            var m = /filename="?([^";]+)"?/.exec(cd);
            var name = m ? m[1] : "dsh-workbench-backup.zip";
            return r.blob().then(function(blob) {
              var href = URL.createObjectURL(blob);
              var a = document.createElement("a");
              a.href = href;
              a.download = name;
              document.body.appendChild(a);
              a.click();
              a.remove();
              setTimeout(function() {
                URL.revokeObjectURL(href);
              }, 1500);
              setMsg(t("backup_download_started"));
              var rows = [];
              chosen.forEach(function(a2) {
                var tables = a2.tables || [];
                if (!tables.length) rows.push({ id: a2.id + ":*", table: "\u2014", module: a2.title || a2.id, version: a2.version });
                tables.forEach(function(table) {
                  rows.push({ id: a2.id + ":" + table, table, module: a2.title || a2.id, version: a2.version });
                });
              });
              setExported(rows);
            });
          }).catch(function(e) {
            setMsg(t("backup_export_failed") + ": " + String(e && e.message || e));
          }).then(function() {
            setBusy("");
          });
        }
        function doImport(ev) {
          var file = ev.target.files && ev.target.files[0];
          ev.target.value = "";
          if (!file || busy) return;
          setBusy("import");
          setMsg("");
          setReport(null);
          var policyMap = {};
          exportable.forEach(function(a) {
            policyMap[a.id] = policyOf(a.id);
          });
          fetch("/workbench/api/backup/import", { method: "POST", headers: { "content-type": "application/zip", "x-wb-backup-policy": JSON.stringify(policyMap) }, body: file }).then(function(r) {
            if (r.status === 422) {
              return r.json().catch(function() {
                return {};
              }).then(function() {
                setMsg(t("backup_incompatible"));
                return null;
              });
            }
            return r.json().catch(function() {
              return null;
            }).then(function(j) {
              if (!r.ok) throw new Error(j && j.error || "HTTP " + r.status);
              if (!j) throw new Error(t("backup_invalid"));
              setReport(j);
              setMsg(j.ok ? t("backup_import_done") : t("backup_import_result"));
              return j;
            });
          }).catch(function(e) {
            setMsg(t("backup_import_failed") + ": " + String(e && e.message || e));
          }).then(function() {
            setBusy("");
          });
        }
        function moduleCaps(a) {
          var caps = [];
          if (a.backup && a.backup.export) caps.push(t("backup_cap_export"));
          if (a.backup && a.backup.import) caps.push(t("backup_cap_import"));
          return caps.join(" \xB7 ");
        }
        return jsx2.jsxs("div", { className: "wb-backup", children: [
          jsx2.jsxs("div", { className: "wb-card", children: [
            jsx2.jsxs("div", { className: "wb-sec", children: [
              jsx2.jsx("h3", { children: t("backup_modules") }),
              jsx2.jsxs("div", { className: "wb-backup-actions", children: [
                jsx2.jsx("button", { className: "wb-btn ghost", disabled: !exportable.length, onClick: function() {
                  selectAll(true);
                }, children: t("backup_select_all") }),
                jsx2.jsx("button", { className: "wb-btn ghost", disabled: !exportable.length, onClick: function() {
                  selectAll(false);
                }, children: t("backup_clear") })
              ] })
            ] }),
            exportable.length ? jsx2.jsx("div", { className: "wb-stack", style: { marginTop: 10 }, children: exportable.map(function(a) {
              var open = !!openConfig[a.id];
              return jsx2.jsxs(react2.Fragment, { children: [
                jsx2.jsxs("div", { className: "wb-backup-row" + (open ? " open" : ""), children: [
                  jsx2.jsxs("label", { className: "wb-backup-row-main", children: [
                    jsx2.jsx("input", { type: "checkbox", checked: !!selected[a.id], onChange: function() {
                      toggle(a.id);
                    } }),
                    jsx2.jsxs("span", { className: "wb-backup-main", children: [
                      jsx2.jsxs("span", { className: "wb-backup-name", children: [a.title || a.id, jsx2.jsx("span", { className: "wb-badge", children: "v" + (a.version || "?") })] }),
                      jsx2.jsx("span", { className: "wb-backup-meta", children: moduleCaps(a) }),
                      a.description ? jsx2.jsx("span", { className: "wb-backup-meta", children: a.description }) : null
                    ] })
                  ] }),
                  jsx2.jsx("button", {
                    type: "button",
                    className: "wb-backup-gear" + (open ? " active" : ""),
                    title: t("backup_dup_policy"),
                    "aria-label": t("backup_dup_policy"),
                    "aria-expanded": open,
                    onClick: function() {
                      toggleConfig(a.id);
                    },
                    children: "\u2699"
                  })
                ] }),
                open ? jsx2.jsxs("div", { className: "wb-backup-config", children: [
                  jsx2.jsx("span", { className: "wb-backup-config-label", children: t("backup_dup_policy") }),
                  jsx2.jsx("select", {
                    className: "wb-select",
                    value: policyOf(a.id),
                    onChange: function(e) {
                      setPolicy(a.id, e.target.value);
                    },
                    children: [
                      jsx2.jsx("option", { value: "newest", children: t("backup_dup_newest") }),
                      jsx2.jsx("option", { value: "skip", children: t("backup_dup_skip") }),
                      jsx2.jsx("option", { value: "overwrite", children: t("backup_dup_overwrite") })
                    ]
                  }),
                  jsx2.jsx("span", { className: "wb-backup-note", children: t("backup_dup_hint") })
                ] }) : null
              ] }, a.id);
            }) }) : jsx2.jsx("div", { className: "wb-msg", children: t("backup_no_modules") }),
            jsx2.jsxs("div", { className: "wb-backup-actions", style: { marginTop: 12 }, children: [
              jsx2.jsx("button", { className: "wb-btn", disabled: !!busy || !exportable.length, onClick: doExport, children: busy === "export" ? t("backup_exporting") : t("backup_export") }),
              jsx2.jsx("button", { className: "wb-btn ghost", disabled: !!busy, onClick: function() {
                if (fileRef.current) fileRef.current.click();
              }, children: busy === "import" ? t("backup_importing") : t("backup_import") }),
              jsx2.jsx("span", { className: "wb-backup-note", children: t("backup_file_hint") })
            ] }),
            jsx2.jsx("input", { ref: fileRef, type: "file", accept: ".zip,application/zip", className: "wb-backup-file", onChange: doImport }),
            msg ? jsx2.jsx("div", { className: "wb-msg", style: { textAlign: "left", padding: "10px 0 0", opacity: 0.8 }, children: msg }) : null
          ] }),
          exported ? jsx2.jsxs("div", { className: "wb-card wb-backup-report", children: [
            jsx2.jsxs("div", { className: "wb-sec", children: [
              jsx2.jsx("h3", { children: t("backup_export_result") }),
              jsx2.jsx("span", { className: "wb-hint", children: t("backup_download_started") })
            ] }),
            jsx2.jsx("div", { className: "wb-stack", children: exported.map(function(a) {
              return jsx2.jsxs("div", { className: "wb-backup-result-row", children: [
                jsx2.jsx("span", { className: "wb-backup-table", children: a.table }),
                jsx2.jsxs("span", { className: "wb-backup-meta", children: [a.module, jsx2.jsx("span", { className: "wb-badge", children: "v" + (a.version || "?") })] })
              ] }, a.id);
            }) })
          ] }) : null,
          report ? jsx2.jsxs("div", { className: "wb-card wb-backup-report", children: [
            jsx2.jsxs("div", { className: "wb-sec", children: [
              jsx2.jsx("h3", { children: t("backup_import_result") }),
              jsx2.jsxs("span", { className: "wb-hint", children: [
                t("backup_summary"),
                ": ",
                t("backup_ok") + " " + report.summary.ok + " \xB7 ",
                t("backup_partial") + " " + report.summary.partial + " \xB7 ",
                t("backup_failed") + " " + report.summary.failed + " \xB7 ",
                t("backup_skipped") + " " + report.summary.skipped
              ] })
            ] }),
            jsx2.jsxs("div", { className: "wb-backup-meta", children: [
              t("backup_exported_at") + ": " + (report.exportedAt || "?"),
              " \xB7 " + t("backup_shell_version") + ": " + (report.shellVersion || "?"),
              " \xB7 " + t("backup_format") + ": v" + report.formatVersion
            ] }),
            jsx2.jsx("table", { className: "wb-backup-table", children: [
              jsx2.jsxs("thead", { children: [
                jsx2.jsxs("tr", { children: [
                  jsx2.jsx("th", { children: t("backup_detail") }),
                  jsx2.jsx("th", { children: t("backup_status") }),
                  jsx2.jsx("th", { children: t("backup_policy") }),
                  jsx2.jsx("th", { children: t("backup_imported") }),
                  jsx2.jsx("th", { children: t("backup_skipped") }),
                  jsx2.jsx("th", { children: t("backup_failed") })
                ] })
              ] }),
              jsx2.jsxs("tbody", { children: (report.results || []).map(function(r) {
                return jsx2.jsxs("tr", { children: [
                  jsx2.jsxs("td", { children: [
                    jsx2.jsx("div", { children: r.title || r.id }),
                    r.message ? jsx2.jsx("div", { className: "wb-backup-meta", children: r.message }) : null
                  ] }),
                  jsx2.jsx("td", { children: jsx2.jsx("span", { className: "wb-backup-status " + r.status, children: statusLabel(r.status) }) }),
                  jsx2.jsx("td", { className: "wb-backup-meta", children: policyLabel(r.policy) }),
                  jsx2.jsx("td", { className: "num", children: r.imported || 0 }),
                  jsx2.jsx("td", { className: "num", children: r.skipped || 0 }),
                  jsx2.jsx("td", { className: "num", children: r.failed || 0 })
                ] }, r.id);
              }) })
            ] })
          ] }) : null
        ] });
      }
      function AuditTab2(props) {
        var t = props.t;
        var fst = react2.useState({ action: "", actor: "", ok: "", q: "", since: "", until: "" });
        var filters = fst[0];
        var setFilters = fst[1];
        var pst = react2.useState(1);
        var page = pst[0];
        var setPage = pst[1];
        var zst = react2.useState(50);
        var pageSize = zst[0];
        var setPageSize = zst[1];
        var dst = react2.useState(null);
        var data = dst[0];
        var setData = dst[1];
        var sst = react2.useState(null);
        var stats = sst[0];
        var setStats = sst[1];
        var bst = react2.useState(false);
        var busy = bst[0];
        var setBusy = bst[1];
        var est = react2.useState("");
        var err = est[0];
        var setErr = est[1];
        var ost = react2.useState(null);
        var openId = ost[0];
        var setOpenId = ost[1];
        var latest = react2.useRef(0);
        var currentFilters = react2.useRef(filters);
        function query(p, size, filters2) {
          var qs = new URLSearchParams();
          if (filters2.action) qs.set("actionPrefix", filters2.action);
          if (filters2.actor) qs.set("actor", filters2.actor);
          if (filters2.ok !== "") qs.set("ok", filters2.ok);
          if (filters2.q) qs.set("q", filters2.q);
          if (filters2.since) qs.set("since", filters2.since);
          if (filters2.until) qs.set("until", filters2.until);
          qs.set("page", String(p));
          qs.set("pageSize", String(size || pageSize));
          qs.set("stats", "1");
          qs.set("rangeDays", "30");
          return qs.toString();
        }
        function load(p, size, selected) {
          var request = ++latest.current;
          setData(null);
          setOpenId(null);
          setPage(p || page);
          setBusy(true);
          setErr("");
          fetch("/workbench/api/audit?" + query(p || page, size, selected || currentFilters.current)).then(function(r) {
            return r.json();
          }).then(function(j) {
            if (request !== latest.current) return;
            if (!j || j.ok === false) throw new Error(j && j.error || t("audit_load_failed"));
            setData(j);
            setStats(j.stats || null);
            setPage(j.page || 1);
          }).catch(function(e) {
            if (request === latest.current) setErr(String(e && e.message || e));
          }).then(function() {
            if (request === latest.current) setBusy(false);
          });
        }
        react2.useEffect(function() {
          load(1);
          return function() {
            latest.current++;
          };
        }, []);
        function applyFilters(next) {
          currentFilters.current = next;
          setFilters(next);
          load(1, pageSize, next);
        }
        function field(key, value) {
          applyFilters(Object.assign({}, currentFilters.current, { [key]: value }));
        }
        function clearFilters() {
          applyFilters({ action: "", actor: "", ok: "", q: "", since: "", until: "" });
        }
        function search() {
          load(1);
        }
        function setSize(n) {
          var size = Math.max(10, Math.min(200, Number(n) || 50));
          setPageSize(size);
          load(1, size);
        }
        function fmtTime(ms) {
          try {
            var d = new Date(Number(ms));
            return d.toLocaleString();
          } catch (e) {
            return String(ms);
          }
        }
        function shortJson(text, limit) {
          if (!text) return "";
          return String(text).length > (limit || 400) ? String(text).slice(0, limit || 400) + "\u2026" : String(text);
        }
        var active = Object.keys(filters).filter(function(key) {
          return filters[key] !== "";
        });
        var labels = { action: "audit_action_prefix", actor: "audit_actor", ok: "audit_ok", q: "audit_q", since: "audit_since", until: "audit_until" };
        function labeled(key, control) {
          return jsx2.jsxs("label", { className: "wb-audit-field", children: [jsx2.jsx("span", { children: t(labels[key]) }), control] }, key);
        }
        var summary = active.map(function(key) {
          return t(labels[key]) + "=" + (key === "ok" ? t(filters.ok === "true" ? "audit_ok_only" : "audit_fail_only") : filters[key]);
        }).join(" \xB7 ");
        var records = data && data.records || [];
        var total = data ? data.total : 0;
        var totalPages = Math.max(1, Math.ceil(total / pageSize));
        var statsText = stats ? t("audit_stats") + "\uFF1A" + totalOf(stats) + " \xB7 " + t("audit_failed") + " " + (stats.failed || 0) : "";
        function totalOf(s) {
          return t("audit_total") + " " + (s.total || 0);
        }
        return jsx2.jsxs(react2.Fragment, { children: [
          jsx2.jsxs("div", { className: "wb-card", children: [
            jsx2.jsxs("div", { className: "wb-sec", children: [
              jsx2.jsx("h3", { children: t("audit_filters") }),
              jsx2.jsx("span", { className: "wb-hint", children: statsText })
            ] }),
            jsx2.jsxs("form", { className: "wb-audit-filters", onSubmit: function(e) {
              e.preventDefault();
              search();
            }, children: [
              labeled("action", jsx2.jsx("input", { className: "wb-input", placeholder: t("audit_action_prefix"), value: filters.action, onChange: function(e) {
                field("action", e.target.value);
              } })),
              labeled("actor", jsx2.jsx("select", { className: "wb-select", "aria-label": t("audit_actor"), value: filters.actor, onChange: function(e) {
                field("actor", e.target.value);
              }, children: [
                jsx2.jsx("option", { value: "", children: t("audit_all") + " \xB7 " + t("audit_actor") }),
                jsx2.jsx("option", { value: "agent", children: "agent" }),
                jsx2.jsx("option", { value: "ui", children: "ui" }),
                jsx2.jsx("option", { value: "sync", children: "sync" })
              ] })),
              labeled("ok", jsx2.jsx("select", { className: "wb-select", "aria-label": t("audit_ok"), value: filters.ok, onChange: function(e) {
                field("ok", e.target.value);
              }, children: [
                jsx2.jsx("option", { value: "", children: t("audit_all") + " \xB7 " + t("audit_ok") }),
                jsx2.jsx("option", { value: "true", children: t("audit_ok_only") }),
                jsx2.jsx("option", { value: "false", children: t("audit_fail_only") })
              ] })),
              labeled("q", jsx2.jsx("input", { className: "wb-input", placeholder: t("audit_q"), value: filters.q, onChange: function(e) {
                field("q", e.target.value);
              } })),
              labeled("since", jsx2.jsx("input", { className: "wb-input", type: "date", title: t("audit_since"), value: filters.since, onChange: function(e) {
                field("since", e.target.value);
              } })),
              labeled("until", jsx2.jsx("input", { className: "wb-input", type: "date", title: t("audit_until"), value: filters.until, onChange: function(e) {
                field("until", e.target.value);
              } })),
              jsx2.jsx("button", { className: "wb-btn", type: "submit", disabled: busy, children: busy ? "\u2026" : t("audit_search") }),
              jsx2.jsx("button", { className: "wb-btn ghost", type: "button", disabled: busy, onClick: function() {
                load(page);
              }, children: t("audit_refresh") })
            ] }),
            jsx2.jsxs("div", { className: "wb-audit-summary", role: "status", "aria-live": "polite", children: [
              jsx2.jsx("span", { children: (summary ? t("audit_active") + "\uFF1A" + summary : t("audit_all")) + " \xB7 " + (busy ? t("audit_loading") : err ? t("audit_load_failed") : t("audit_total") + " " + total) }),
              active.length ? jsx2.jsx("button", { type: "button", className: "wb-btn ghost", onClick: clearFilters, children: t("audit_clear") }) : null
            ] }),
            err ? jsx2.jsx("div", { className: "wb-err", style: { marginTop: 10 }, children: err }) : null,
            jsx2.jsx("div", { className: "wb-hint", style: { marginTop: 10 }, children: t("audit_reads_hint") + " \xB7 " + t("audit_retention") })
          ] }),
          jsx2.jsxs("div", { className: "wb-card", children: [
            jsx2.jsxs("div", { className: "wb-sec", children: [
              jsx2.jsx("h3", { children: t("tab_audit") }),
              jsx2.jsx("span", { className: "wb-hint", children: (busy ? t("audit_loading") : err ? t("audit_load_failed") : t("audit_total") + " " + total) + " \xB7 " + page + " / " + totalPages + " " + t("audit_page") })
            ] }),
            records.length ? jsx2.jsx("div", { style: { overflowX: "auto" }, children: jsx2.jsxs("table", { className: "wb-audit-table", children: [
              jsx2.jsx("thead", { children: jsx2.jsxs("tr", { children: [
                jsx2.jsx("th", { children: t("audit_time") }),
                jsx2.jsx("th", { children: t("audit_actor") }),
                jsx2.jsx("th", { children: t("audit_action") }),
                jsx2.jsx("th", { children: t("audit_ok") }),
                jsx2.jsx("th", { children: t("audit_target") }),
                jsx2.jsx("th", { children: t("audit_duration") })
              ] }) }),
              jsx2.jsx("tbody", { children: records.map(function(r) {
                var open = openId === r.id;
                return jsx2.jsxs(react2.Fragment, { children: [
                  jsx2.jsxs("tr", { className: "wb-audit-row", tabIndex: 0, "aria-expanded": open, onKeyDown: function(e) {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setOpenId(open ? null : r.id);
                    }
                  }, onClick: function() {
                    setOpenId(open ? null : r.id);
                  }, children: [
                    jsx2.jsx("td", { className: "wb-audit-mono", children: fmtTime(r.at) }),
                    jsx2.jsx("td", { children: jsx2.jsx("span", { className: "wb-badge", children: r.actor }) }),
                    jsx2.jsx("td", { className: "wb-audit-mono", children: r.action }),
                    jsx2.jsx("td", { children: r.ok ? jsx2.jsx("span", { className: "wb-audit-ok", children: "\u2713" }) : jsx2.jsx("span", { className: "wb-audit-fail", children: "\u2717" }) }),
                    jsx2.jsx("td", { className: "wb-audit-mono wb-audit-dim", children: r.target || "\u2014" }),
                    jsx2.jsx("td", { className: "wb-audit-dim", children: (r.durationMs || 0) + " ms" })
                  ] }),
                  open ? jsx2.jsx("tr", { children: jsx2.jsx("td", { colSpan: 6, children: jsx2.jsxs("div", { children: [
                    r.error ? jsx2.jsxs("div", { children: [jsx2.jsx("div", { className: "wb-audit-dim", children: t("audit_error") }), jsx2.jsx("div", { className: "wb-audit-pre", children: r.error })] }) : null,
                    jsx2.jsxs("div", { children: [jsx2.jsx("div", { className: "wb-audit-dim", children: t("audit_detail") + " \xB7 id=" + r.id }), jsx2.jsx("div", { className: "wb-audit-pre", children: shortJson(r.args, 1200) || "{}" }), r.result ? jsx2.jsx("div", { className: "wb-audit-pre", children: shortJson(r.result, 1200) }) : null] })
                  ] }) }) }) : null
                ] }, r.id);
              }) })
            ] }) }) : jsx2.jsxs("div", { className: "wb-msg", children: [busy ? t("audit_loading") : err ? t("audit_load_failed") : t("audit_empty"), !busy && !err && active.length ? jsx2.jsx("button", { className: "wb-btn ghost", onClick: clearFilters, children: t("audit_clear") }) : null] }),
            jsx2.jsxs("div", { className: "wb-audit-pager", children: [
              jsx2.jsx("button", { className: "wb-btn ghost", disabled: busy || page <= 1, onClick: function() {
                load(page - 1);
              }, children: t("audit_prev") }),
              jsx2.jsx("button", { className: "wb-btn ghost", disabled: busy || page >= totalPages, onClick: function() {
                load(page + 1);
              }, children: t("audit_next") }),
              jsx2.jsx("select", { className: "wb-select", "aria-label": t("audit_page_size"), value: String(pageSize), onChange: function(e) {
                setSize(e.target.value);
              }, children: [20, 50, 100, 200].map(function(n) {
                return jsx2.jsx("option", { value: String(n), children: n + " / " + t("audit_page") }, n);
              }) })
            ] })
          ] })
        ] });
      }
      return { AccountTab: AccountTab2, BackupTab: BackupTab2, AuditTab: AuditTab2 };
    };
  }
});

// packages/shell/client/view-tabs.cjs
var require_view_tabs = __commonJS({
  "packages/shell/client/view-tabs.cjs"(exports2, module2) {
    "use strict";
    module2.exports = function createViewTabs(react2, pickTitle2) {
      var h2 = react2.createElement;
      return function ViewTabs2(props) {
        if (props.views.length < 2) return null;
        return h2("div", { className: "wb-page-tabs" }, props.views.map(function(view) {
          var title = pickTitle2(view.title, props.lang) || view.id;
          var on = props.activeView && view.id === props.activeView.id;
          var Icon = typeof view.icon === "function" ? view.icon : null;
          return h2("button", {
            key: view.id,
            type: "button",
            className: "wb-tab" + (on ? " on" : ""),
            "aria-label": title,
            onClick: function() {
              props.go("addon:" + props.addonId + ":" + view.id);
            }
          }, Icon ? h2("span", {
            "aria-hidden": true,
            style: { display: "inline-flex", verticalAlign: "middle", marginRight: 6 }
          }, h2(Icon, { size: 14, strokeWidth: 2, "aria-hidden": true })) : null, title);
        }));
      };
    };
  }
});

// packages/shell/client/view-outlet.cjs
var require_view_outlet = __commonJS({
  "packages/shell/client/view-outlet.cjs"(exports2, module2) {
    "use strict";
    var React = require("react");
    var h2 = React.createElement;
    function Slot(props) {
      var root = React.useRef(null), scroll = React.useRef([]);
      React.useLayoutEffect(function() {
        if (!props.active) return;
        var positions = scroll.current.slice();
        function restore() {
          positions.forEach(function(p) {
            p.node.scrollTop = p.top;
            p.node.scrollLeft = p.left;
          });
        }
        restore();
        var frame = typeof requestAnimationFrame === "function" ? requestAnimationFrame(restore) : null;
        function remember() {
          var positions2 = [], node = root.current;
          while (node) {
            positions2.push({ node, top: node.scrollTop, left: node.scrollLeft });
            node = node.parentElement;
          }
          scroll.current = positions2;
        }
        document.addEventListener("scroll", remember, true);
        return function() {
          if (frame !== null) cancelAnimationFrame(frame);
          document.removeEventListener("scroll", remember, true);
        };
      }, [props.active]);
      return h2(
        "div",
        { ref: root, hidden: !props.active, "data-view-id": props.view.id },
        h2(props.view.component, Object.assign({}, props.viewProps, { active: props.active }))
      );
    }
    module2.exports = function ViewOutlet2(props) {
      var kept = React.useRef({});
      if (props.view.keepAlive) kept.current[props.view.id] = props;
      var entries = Object.keys(kept.current).map(function(id) {
        return kept.current[id];
      });
      if (!props.view.keepAlive) entries.push(props);
      return h2(React.Fragment, null, entries.map(function(entry) {
        return h2(Slot, { key: entry.view.id, view: entry.view, viewProps: entry.viewProps, active: entry.view.id === props.view.id });
      }));
    };
  }
});

// packages/shell/client/client.src.cjs
var react = require("react");
var jsx = require("react/jsx-runtime");
var h = react.createElement;
var NS = "workbench";
var LOCALE = require_locale();
var CSS = require_styles();
var registry = /* @__PURE__ */ new Map();
var listeners = /* @__PURE__ */ new Set();
var apiCache = /* @__PURE__ */ new Map();
var addonState = { addons: [], loaded: false, shellVersion: "" };
var storeListeners = /* @__PURE__ */ new Set();
var cloudStatusListeners = /* @__PURE__ */ new Set();
var recordModes = {};
var recordListeners = /* @__PURE__ */ new Set();
var stream = null;
var lastAddonError = null;
function setRecordMode(sessionId, enabled) {
  if (!sessionId) return;
  recordModes[sessionId] = !!enabled;
  recordListeners.forEach(function(fn) {
    try {
      fn(sessionId, !!enabled);
    } catch (e) {
      console.error(e);
    }
  });
}
function notifyStore() {
  storeListeners.forEach(function(fn) {
    try {
      fn();
    } catch (e) {
      console.error(e);
    }
  });
}
function notifyCloudStatus() {
  cloudStatusListeners.forEach(function(fn) {
    try {
      fn();
    } catch (e) {
      console.error(e);
    }
  });
}
function broadcast(payload) {
  listeners.forEach(function(fn) {
    try {
      fn(payload);
    } catch (e) {
      console.error(e);
    }
  });
}
function apiFor(id) {
  var cached = apiCache.get(id);
  if (cached) return cached;
  var api = {
    call: function(action, args) {
      var targetId = id;
      var name = String(action || "");
      var dot = name.indexOf(".");
      if (dot > 0) {
        var hinted = "wb-addon-" + name.slice(0, dot);
        if (hinted !== id && registry.has(hinted)) targetId = hinted;
      }
      return fetch("/workbench/api/domains/" + encodeURIComponent(targetId) + "/actions/" + encodeURIComponent(action), {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(args || {})
      }).then(function(r) {
        return r.json();
      }).catch(function(e) {
        return { ok: false, error: String(e && e.message || e) };
      });
    },
    // 只读 schema 快照：宿主 /workbench/api/schema 与 actions.list(detail=true) 同源，
    // 供工作台 Action 页渲染运行时注册；不走 action 执行链路，也不会产生审计记录。
    schema: function(domain) {
      var q = domain ? "?domain=" + encodeURIComponent(domain) : "";
      return fetch("/workbench/api/schema" + q).then(function(r) {
        return r.json();
      }).catch(function(e) {
        return { ok: false, error: String(e && e.message || e) };
      });
    },
    subscribe: function(fn) {
      listeners.add(fn);
      return function() {
        listeners.delete(fn);
      };
    }
  };
  apiCache.set(id, api);
  return api;
}
function registerAddon(mod) {
  if (!mod || typeof mod.id !== "string" || !Array.isArray(mod.views)) {
    console.error("[dsh-workbench] registerAddon \u53C2\u6570\u4E0D\u5408\u6CD5", mod);
    return;
  }
  registry.set(mod.id, mod);
  notifyStore();
}
function setAddons(list) {
  addonState.addons = Array.isArray(list) ? list : [];
  addonState.loaded = true;
  var alive = {};
  addonState.addons.forEach(function(a) {
    alive[a.id] = a;
  });
  registry.forEach(function(_m, id) {
    if (!alive[id]) registry.delete(id);
  });
  notifyStore();
}
function refreshAddons() {
  return fetch("/workbench/api/domains").then(function(r) {
    return r.json();
  }).then(function(j) {
    if (j && j.domains) {
      addonState.shellVersion = j.shellVersion || addonState.shellVersion;
      setAddons(j.domains);
    }
    return j;
  }).catch(function(e) {
    console.warn("[dsh-workbench] \u8BFB\u53D6\u4E1A\u52A1\u63D2\u4EF6\u5931\u8D25", e);
    return null;
  });
}
function ensureStream() {
  if (stream) return;
  stream = new EventSource("/workbench/api/events");
  stream.addEventListener("domains-changed", function(e) {
    try {
      setAddons(JSON.parse(e.data));
    } catch (err) {
      console.warn(err);
    }
  });
  stream.addEventListener("domain-event", function(e) {
    try {
      broadcast(JSON.parse(e.data));
    } catch (err) {
      console.warn(err);
    }
  });
  stream.addEventListener("record-mode", function(e) {
    try {
      var payload = JSON.parse(e.data);
      if (payload && payload.sessionId) setRecordMode(payload.sessionId, payload.enabled);
    } catch (err) {
      console.warn(err);
    }
  });
  stream.addEventListener("sync-done", notifyCloudStatus);
  stream.addEventListener("account-changed", notifyCloudStatus);
}
function useAddonStore() {
  var st = react.useState(0);
  var bump = st[1];
  react.useEffect(function() {
    ensureStream();
    var fn = function() {
      bump(function(x) {
        return x + 1;
      });
    };
    storeListeners.add(fn);
    if (!addonState.loaded) refreshAddons();
    return function() {
      storeListeners.delete(fn);
    };
  }, []);
  return addonState;
}
window.__WB_HOST__ = {
  react,
  jsx,
  h,
  registerAddon,
  get addons() {
    return addonState.addons;
  },
  error: function() {
    return lastAddonError;
  }
};
function useApi() {
  var base = "/workbench/api";
  return react.useMemo(function() {
    return {
      get: function(p) {
        return fetch(base + p).then(function(r) {
          return r.json();
        });
      },
      post: function(p, b) {
        return fetch(base + p, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(b || {}) }).then(function(r) {
          return r.json();
        });
      },
      del: function(p) {
        return fetch(base + p, { method: "DELETE" }).then(function(r) {
          return r.json();
        });
      }
    };
  }, []);
}
function useCloudStatus() {
  var api = useApi();
  var st = react.useState(null);
  var status = st[0];
  var setStatus = st[1];
  react.useEffect(function() {
    var alive = true;
    function load() {
      api.get("/sync/status").then(function(r) {
        if (alive && r && r.ok) setStatus(r);
      }).catch(function() {
      });
    }
    load();
    var timer = setInterval(load, 15e3);
    function onVisible() {
      if (typeof document !== "undefined" && document.visibilityState === "visible") load();
    }
    if (typeof document !== "undefined") document.addEventListener("visibilitychange", onVisible);
    cloudStatusListeners.add(load);
    return function() {
      alive = false;
      clearInterval(timer);
      if (typeof document !== "undefined") document.removeEventListener("visibilitychange", onVisible);
      cloudStatusListeners.delete(load);
    };
  }, [api]);
  return status;
}
function cloudView(status, t) {
  if (!status) return { kind: "local", label: t("cloud_checking"), hint: t("cloud_checking_hint") };
  var failed = Array.isArray(status.failed_tables) ? status.failed_tables : [];
  if (!status.logged_in) return { kind: "local", label: t("cloud_local"), hint: t("cloud_local_hint") };
  if (status.running) return { kind: "syncing", label: t("cloud_syncing"), hint: t("cloud_syncing_hint") };
  if (status.cloud && status.cloud.reachable === false) return { kind: "off", label: t("cloud_offline"), hint: t("cloud_offline_hint") };
  if (!status.last_sync_at) return { kind: "warn", label: t("cloud_never"), hint: t("cloud_never_hint") };
  if (status.last_sync_ok === false || failed.length) return { kind: "warn", label: t("cloud_sync_failed"), hint: t("cloud_sync_failed_hint") };
  return { kind: "on", label: t("cloud_online"), hint: t("cloud_online_hint") };
}
function cloudTitle(view, status, t) {
  var parts = [view.hint];
  if (status && status.logged_in) {
    parts.push(t("sync_last") + ": " + (status.last_sync_at ? new Date(status.last_sync_at).toLocaleString() : t("sync_never")));
    if (status.conflicts) parts.push(t("sync_conflicts") + ": " + status.conflicts);
    var failed = Array.isArray(status.failed_tables) ? status.failed_tables : [];
    if (failed.length) parts.push(t("sync_failed_tables") + ": " + failed.join(", "));
    if (status.last_sync_error) parts.push(status.last_sync_error);
    if (status.cloud && status.cloud.error) parts.push(status.cloud.error);
  }
  return parts.join(" \xB7 ");
}
function CloudStatusPill(props) {
  var t = props.t;
  var status = useCloudStatus();
  var view = cloudView(status, t);
  var title = cloudTitle(view, status, t);
  return jsx.jsxs("button", {
    type: "button",
    className: "wb-cloud " + view.kind,
    onClick: props.onOpen,
    title,
    "aria-label": t("cloud_status") + ": " + view.label + " \u2014 " + view.hint + " \xB7 " + t("cloud_open"),
    "data-cloud-state": view.kind,
    children: [
      jsx.jsx("span", { className: "wb-cloud-dot" }),
      jsx.jsx("span", { className: "wb-cloud-label", children: view.label })
    ]
  });
}
function pickTitle(title, lang) {
  if (!title) return "";
  if (typeof title === "string") return title;
  return title[lang] || title.zh || title.en || "";
}
function currentLang() {
  var raw = document && document.documentElement && document.documentElement.lang || typeof navigator !== "undefined" && navigator.language || "zh";
  return String(raw).toLowerCase().indexOf("zh") === 0 ? "zh" : "en";
}
var systemTabs = require_system_tabs()(react, jsx, useApi);
var AccountTab = systemTabs.AccountTab;
var BackupTab = systemTabs.BackupTab;
var AuditTab = systemTabs.AuditTab;
var ViewTabs = require_view_tabs()(react, pickTitle);
var ViewOutlet = require_view_outlet();
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
  var rs = react.useState("home");
  var route = rs[0];
  var setRoute = rs[1];
  var navigation = react.useState({});
  var viewParams = navigation[0];
  var lang = currentLang();
  react.useEffect(function() {
    ensureCss();
  }, []);
  var addons = (store.addons || []).filter(function(a) {
    return a && a.enabled;
  });
  var currentAddon = null;
  if (route.indexOf("addon:") === 0) {
    var parts = route.split(":");
    var wanted = parts[1] || "";
    addons.forEach(function(a) {
      if (a.id === wanted) currentAddon = a;
    });
  }
  var mod = currentAddon ? registry.get(currentAddon.id) : null;
  var clientViews = mod && Array.isArray(mod.views) ? mod.views : [];
  var manifestViews = currentAddon && Array.isArray(currentAddon.views) ? currentAddon.views : [];
  var viewList = clientViews.length ? clientViews : manifestViews;
  var wantedView = route.indexOf("addon:") === 0 ? route.split(":")[2] || "" : "";
  var activeView = null;
  viewList.forEach(function(v) {
    if (v.id === wantedView) activeView = v;
  });
  if (!activeView && viewList.length) activeView = viewList[0];
  function go(next, params) {
    navigation[1](params || {});
    setRoute(next);
  }
  function navigateView(viewId, params) {
    if (currentAddon && viewList.some(function(v) {
      return v.id === viewId;
    })) {
      go("addon:" + currentAddon.id + ":" + viewId, params);
    }
  }
  function cardIcon(title) {
    return String(title || "?").slice(0, 1);
  }
  function openAddon(a) {
    var m = registry.get(a.id);
    var v = m && m.views && m.views[0] || a.views && a.views[0] || null;
    go("addon:" + a.id + ":" + (v && v.id ? v.id : ""));
  }
  function pageHead(title, desc) {
    return jsx.jsxs("div", { className: "wb-page-head", children: [
      jsx.jsx("div", { className: "wb-page-top", children: [
        jsx.jsx("button", { className: "wb-back", onClick: function() {
          go("home");
        }, children: "\u2190 " + t("back_home") })
      ] }),
      jsx.jsxs("div", { className: "wb-page-title", children: [
        jsx.jsx("span", { className: "wb-home-icon", children: cardIcon(title) }),
        jsx.jsx("h2", { children: title })
      ] }),
      desc ? jsx.jsx("div", { className: "wb-page-desc", children: desc }) : null
    ] });
  }
  function addonCard(a) {
    var m = registry.get(a.id);
    var v = m && m.views && m.views[0] || a.views && a.views[0] || null;
    var title = a.title || pickTitle(v && v.title, lang) || a.id;
    var count = m && m.views ? m.views.length : a.views ? a.views.length : 0;
    return jsx.jsxs("button", { type: "button", className: "wb-home-card" + (a.error ? " dim" : ""), onClick: function() {
      openAddon(a);
    }, children: [
      jsx.jsxs("div", { className: "wb-home-top", children: [
        jsx.jsx("span", { className: "wb-home-icon", children: cardIcon(a.title || title) }),
        jsx.jsx("span", { className: "wb-badge", children: "v" + (a.version || "?") })
      ] }),
      jsx.jsx("div", { className: "wb-home-title", children: title }),
      jsx.jsx("div", { className: "wb-home-desc", children: a.description || (count > 1 ? count + " " + t("views") : "") }),
      a.error ? jsx.jsx("div", { className: "wb-err", children: t("addon_error") + ": " + a.error }) : null
    ] }, a.id);
  }
  function systemCard(key, icon, title, desc) {
    return jsx.jsxs("button", { type: "button", className: "wb-home-card", onClick: function() {
      go(key);
    }, children: [
      jsx.jsxs("div", { className: "wb-home-top", children: [
        jsx.jsx("span", { className: "wb-home-icon", children: icon })
      ] }),
      jsx.jsx("div", { className: "wb-home-title", children: title }),
      jsx.jsx("div", { className: "wb-home-desc", children: desc })
    ] }, key);
  }
  if (route === "backup") {
    return jsx.jsxs("div", { className: "wb-root", children: [
      jsx.jsxs("div", { className: "wb-inner wb-wide", children: [pageHead(t("tab_backup"), t("backup_desc")), jsx.jsx(BackupTab, { t, lang, addons })] })
    ] });
  }
  if (route === "audit") {
    return jsx.jsxs("div", { className: "wb-root", children: [
      jsx.jsxs("div", { className: "wb-inner wb-wide", children: [pageHead(t("tab_audit"), t("audit_desc")), jsx.jsx(AuditTab, { t })] })
    ] });
  }
  if (route === "account") {
    return jsx.jsxs("div", { className: "wb-root", children: [
      jsx.jsxs("div", { className: "wb-inner wb-wide", children: [pageHead(t("tab_account"), t("account_desc")), jsx.jsx(AccountTab, { t })] })
    ] });
  }
  if (currentAddon) {
    var canRender = activeView && typeof activeView.component === "function";
    var addonTitle = currentAddon.title || pickTitle(activeView && activeView.title, lang) || currentAddon.id;
    return jsx.jsxs("div", { className: "wb-root wb-immersive", children: [
      jsx.jsxs("div", { className: "wb-immersive-bar", children: [
        jsx.jsx("button", { className: "wb-back", onClick: function() {
          go("home");
        }, children: "\u2190 " + t("back_home") }),
        jsx.jsx("div", { className: "wb-grow" }),
        jsx.jsxs("div", { className: "wb-immersive-title", children: [
          jsx.jsx("span", { className: "wb-home-icon", children: cardIcon(addonTitle) }),
          jsx.jsx("span", { children: addonTitle }),
          jsx.jsx("span", { className: "wb-badge", children: "v" + (currentAddon.version || "?") })
        ] })
      ] }),
      jsx.jsxs("div", { className: "wb-immersive-main", children: [
        jsx.jsxs("div", { className: "wb-inner wb-wide", children: [
          jsx.jsx(ViewTabs, { views: viewList, activeView, addonId: currentAddon.id, lang, go }),
          currentAddon.error ? jsx.jsx("div", { className: "wb-card", children: jsx.jsx("div", { className: "wb-err", children: t("addon_error") + ": " + currentAddon.error }) }) : canRender ? jsx.jsx(ViewOutlet, { view: activeView, viewProps: { api: apiFor(currentAddon.id), lang, addonId: currentAddon.id, t, viewParams, onNavigate: navigateView } }, currentAddon.id) : !viewList.length ? jsx.jsx("div", { className: "wb-card", children: jsx.jsx("div", { className: "wb-msg", children: t("no_views") }) }) : jsx.jsx("div", { className: "wb-card", children: jsx.jsx("div", { className: "wb-page-loading", children: jsx.jsx("div", { className: "wb-msg", style: { padding: "4px 0" }, children: lastAddonError ? t("addon_unavailable") + " \xB7 " + lastAddonError : t("addon_loading") }) }) })
        ] })
      ] })
    ] });
  }
  return jsx.jsxs("div", { className: "wb-root", children: [
    jsx.jsxs("div", { className: "wb-inner", children: [
      jsx.jsxs("div", { className: "wb-hero", children: [
        jsx.jsxs("div", { children: [jsx.jsx("h2", { children: t("title") }), jsx.jsx("span", { className: "wb-tag", children: t("tagline") })] }),
        jsx.jsx(CloudStatusPill, { t, onOpen: function() {
          go("account");
        } })
      ] }),
      addons.length ? jsx.jsx("div", { className: "wb-home-grid", children: addons.map(addonCard) }) : jsx.jsx("div", { className: "wb-card", children: jsx.jsx("div", { className: "wb-msg wb-empty-cta", children: t("no_installed") }) }),
      jsx.jsxs("div", { className: "wb-sec", children: [
        jsx.jsx("h3", { children: t("manage") }),
        jsx.jsx("span", { className: "wb-hint", children: t("home_hint") })
      ] }),
      jsx.jsxs("div", { className: "wb-home-grid manage", children: [
        systemCard("backup", "\u2913", t("tab_backup"), t("backup_desc")),
        systemCard("audit", "\u25A4", t("tab_audit"), t("audit_desc")),
        systemCard("account", "\u2601", t("tab_account"), t("account_desc"))
      ] })
    ] })
  ] });
}
var RecordToggle = function(props) {
  var sid = props && props.sessionId;
  var st = react.useState(false);
  var on = st[0];
  var setOn = st[1];
  var bst = react.useState(false);
  var busy = bst[0];
  var setBusy = bst[1];
  var est = react.useState("");
  var err = est[0];
  var setErr = est[1];
  var t = props && props.t;
  react.useEffect(function() {
    if (!sid) return;
    var fn = function(changed, value) {
      if (changed === sid) setOn(!!value);
    };
    recordListeners.add(fn);
    ensureStream();
    fetch("/workbench/api/record?sessionId=" + encodeURIComponent(sid)).then(function(r) {
      return r.json();
    }).then(function(j) {
      if (j && j.ok) setRecordMode(sid, !!j.enabled);
    }).catch(function() {
    });
    return function() {
      recordListeners.delete(fn);
    };
  }, [sid]);
  function toggle() {
    if (!sid || busy) return;
    setBusy(true);
    setErr("");
    fetch("/workbench/api/record", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ sessionId: sid, enabled: !on })
    }).then(function(r) {
      return r.json();
    }).then(function(j) {
      if (!j || !j.ok) throw new Error(j && j.error || "request failed");
      setRecordMode(sid, !!j.enabled);
    }).catch(function(e) {
      var msg = String(e && e.message || e);
      setErr(msg);
      try {
        console.warn("[dsh-workbench] record toggle failed:", msg);
      } catch (_) {
      }
    }).then(function() {
      setBusy(false);
    });
  }
  if (!sid) return null;
  var label = busy ? t("record_busy") : err ? t("record_failed_short") : on ? t("record_on") : t("record_off");
  var title = err ? t("record_error") + ": " + err : on ? t("record_on_title") : t("record_off_title");
  return h(
    "button",
    {
      type: "button",
      className: "wb-record-pill" + (on ? " on" : "") + (err ? " err" : ""),
      onClick: toggle,
      disabled: busy,
      title,
      "aria-label": t("record_label") + ": " + label,
      "aria-pressed": on ? "true" : "false"
    },
    h("span", { className: "wb-record-dot" }),
    h("span", { className: "wb-record-label", children: label })
  );
};
var exports_ = {
  name: NS,
  inject: ["slots", "locale", "theme"],
  apply: function(ctx) {
    try {
      ensureCss();
      var PanellistIcon = function() {
        return h(
          "svg",
          { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": 2, "stroke-linecap": "round", "stroke-linejoin": "round" },
          h("rect", { x: 3, y: 3, width: 7, height: 7, rx: 1 }),
          h("rect", { x: 14, y: 3, width: 7, height: 7, rx: 1 }),
          h("rect", { x: 3, y: 14, width: 7, height: 7, rx: 1 }),
          h("rect", { x: 14, y: 14, width: 7, height: 7, rx: 1 })
        );
      };
      ctx.effect(function() {
        return ctx.locale.register(NS, LOCALE);
      }, "wb-locale");
      var t = ctx.locale.bind(NS);
      ctx.slots.inject("sidebar.panellist", function() {
        return ctx.slots.register(
          { name: "sidebar.panellist", id: NS, order: 62, label: function() {
            return t("nav");
          } },
          function() {
            return h(PanellistIcon, {});
          }
        );
      });
      ctx.slots.inject("main", function() {
        return ctx.slots.register(
          { name: "main", key: NS, locale: NS, inject: function() {
            return { t };
          } },
          function() {
            try {
              return jsx.jsx(WorkbenchPage, { t });
            } catch (e) {
              window.__wbSlotErr = String(e && e.stack || e);
              throw e;
            }
          }
        );
      });
      ctx.slots.inject("settings.plugins.tab", function() {
        return ctx.slots.register(
          { name: "settings.plugins.tab", id: NS, order: 65, label: function() {
            return t("nav");
          }, locale: NS, inject: function() {
            return { t };
          } },
          function() {
            return h(WorkbenchPage, { t });
          }
        );
      });
      ctx.slots.inject("conversation.input.left", function() {
        return ctx.slots.register(
          { name: "conversation.input.left", id: NS + "-record", order: 40, label: function() {
            return t("record_label");
          } },
          function(props) {
            return h(RecordToggle, { sessionId: props && props.sessionId, t });
          }
        );
      });
    } catch (e) {
      console.error("[dsh-workbench] apply crashed:", e, e && e.stack);
      throw e;
    }
  }
};
module.exports = exports_;
    return module.exports;
  },
});
