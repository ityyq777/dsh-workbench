"use strict";
/**
 * 凭据选择器：下拉面板 + 关键字检索 + 滚动分页的单选控件。
 *
 * 设计口径见 docs/specs/51-邮箱账户接入流程设计.md 第 7 节：
 * 授权码不在邮件页填写，用户先在「凭据保险箱」新建（类型 app_password），
 * 再在这里挑一条绑定成 account.secret_id。
 *
 * 分页取舍：数据源只有 vault.secretList({ q })，客户端按每页 20 切片、触底加载。
 * 不给 secretList 加 limit/offset —— 它是跨插件契约（保险箱自己的列表页也在用），
 * 改 schema 要同步五处版本号、能力清单、文档与测试；而个人凭据量级在几十到几百条。
 * 超过 500 条再单开分页参数。
 */
var FilterChecklist = require("../../../lib/filter-checklist.cjs");

var PAGE = 20;

// 与 packages/addons/vault/client/ui/kinds.cjs 的 KIND_LABEL 同名同义。
// 不直接 require 保险箱的客户端文件：保险箱可能没安装，跨插件 require 会把邮件页拖崩。
var KIND_LABEL = {
    password: "密码",
    phone: "手机号",
    id_card: "身份证号",
    token: "Token",
    app_password: "授权码",
    api_key: "API Key",
    other: "其它",
};
var KIND_LABEL_EN = {
    password: "Password",
    phone: "Phone",
    id_card: "ID card",
    token: "Token",
    app_password: "App password",
    api_key: "API key",
    other: "Other",
};

function t(lang, zh, en) {
    return lang === "en" ? en : zh;
}

function kindText(lang, kind) {
    var map = lang === "en" ? KIND_LABEL_EN : KIND_LABEL;
    return map[kind] || kind || t(lang, "凭据", "Credential");
}

function metaOf(item) {
    var m = item && item.meta;
    if (!m || typeof m !== "object") return "";
    var u = m.username || m.user || m.login || "";
    return typeof u === "string" ? u : "";
}

module.exports = function SecretPicker(props) {
    var h = props.h;
    var C = props.C;
    var api = props.api;
    var lang = props.lang || "zh";
    var React = props.React || require("react");
    var vault = props.vault || "ready";
    var disabled = props.disabled === true;
    // 0.6.0：传了 accountSetId 就只列这个账号集合里的凭据；否则退回全库检索（兼容旧调用）。
    var accountSetId = String(props.accountSetId || "").trim();

    var S = React.useState;
    var openS = S(false);
    var qS = S("");
    var rowsS = S([]);
    var allS = S([]);
    var pageS = S(1);
    var loadS = S(false);
    var errS = S("");
    var knownS = S({});
    var boxRef = React.useRef ? React.useRef(null) : { current: null };

    var open = openS[0];
    var rows = rowsS[0];
    var all = allS[0];
    var value = String(props.value || "");

    function call(query) {
        if (accountSetId) {
            return C.call(api, "vault.setGet", { id: accountSetId }).then(function (r) {
                var set = r && r.result !== undefined ? r.result : r;
                var secrets = set && Array.isArray(set.secrets) ? set.secrets : [];
                var q = String(query || "").trim().toLowerCase();
                return secrets
                    .filter(function (x) {
                        if (!q) return true;
                        return (String(x.name || "") + " " + String(x.kind || "")).toLowerCase().indexOf(q) >= 0;
                    })
                    .map(function (x) {
                        return { id: x.id, name: x.name, kind: x.kind, meta: x.meta };
                    });
            });
        }
        return C.call(api, "vault.secretList", { q: query || "" }).then(function (r) {
            var items = (r && Array.isArray(r.items) ? r.items : []).map(function (x) {
                return { id: x.id, name: x.name, kind: x.kind, meta: x.meta };
            });
            return items;
        });
    }

    function remember(items) {
        knownS[1](function (prev) {
            var next = Object.assign({}, prev);
            items.forEach(function (x) { next[x.id] = x; });
            return next;
        });
    }

    // 首次挂载就把整表拉一次：既用于回显已绑定凭据的名称，也用于判断「原凭据已失效」。
    React.useEffect(function () {
        if (vault !== "ready") return;
        var alive = true;
        loadS[1](true);
        call("")
            .then(function (items) {
                if (!alive) return;
                allS[1](items);
                remember(items);
                loadS[1](false);
            })
            .catch(function (e) {
                if (!alive) return;
                loadS[1](false);
                errS[1](C.errText(e));
            });
        return function () { alive = false; };
    }, [vault, accountSetId]);

    // 展开面板时按关键字取数：入口唯一是 secretList 的 q（名称 / 备注模糊）。
    React.useEffect(function () {
        if (!open) return;
        var alive = true;
        loadS[1](true);
        errS[1]("");
        var timer = setTimeout(function () {
            call(qS[0])
                .then(function (items) {
                    if (!alive) return;
                    rowsS[1](items);
                    pageS[1](1);
                    remember(items);
                    loadS[1](false);
                })
                .catch(function (e) {
                    if (!alive) return;
                    rowsS[1]([]);
                    loadS[1](false);
                    errS[1](C.errText(e));
                });
        }, 180);
        return function () {
            alive = false;
            clearTimeout(timer);
        };
    }, [open, qS[0], accountSetId]);

    // 点外部 / Esc 收起。
    React.useEffect(function () {
        if (!open) return;
        function onDown(e) {
            var box = boxRef.current;
            if (box && !box.contains(e.target)) openS[1](false);
        }
        function onKey(e) {
            if (e.key === "Escape") {
                e.preventDefault();
                e.stopPropagation();
                openS[1](false);
            }
        }
        document.addEventListener("mousedown", onDown);
        document.addEventListener("keydown", onKey);
        return function () {
            document.removeEventListener("mousedown", onDown);
            document.removeEventListener("keydown", onKey);
        };
    }, [open]);

    var known = knownS[0];
    var picked = known[value] || null;
    var missing = !!value && !picked && !loadS[0];
    var label = !value
        ? (accountSetId
            ? t(lang, "选择集合里的授权码", "Choose a credential in this set")
            : t(lang, "选择保险箱凭据", "Choose a vault credential"))
        : picked
            ? picked.name + " · " + kindText(lang, picked.kind)
            : t(lang, "凭据 " + value.slice(0, 8), "Credential " + value.slice(0, 8));

    if (vault === "missing") {
        return h("div", { className: "wbml-picker" },
            h("div", { className: "wbml-picker-note", role: "status" },
                t(lang, "没有检测到凭据保险箱，无法选择凭据。安装并初始化保险箱后刷新本页。",
                    "No vault plugin detected. Install and initialise the vault, then reload.")));
    }
    if (vault === "locked" || vault === "init" || vault === "loading") {
        return h("div", { className: "wbml-picker" },
            h("div", { className: "wbml-picker-note", role: "status" },
                vault === "loading"
                    ? t(lang, "正在检查保险箱状态…", "Checking the vault…")
                    : t(lang, "保险箱已锁定或未初始化，先在那里建好凭据；解锁后即可在这里选择。",
                        "The vault is locked or uninitialised — create the credential there first, then unlock to pick it.")));
    }

    var shown = rows.slice(0, pageS[0] * PAGE);
    var hasMore = pageS[0] * PAGE < rows.length;
    var noRows = !loadS[0] && !rows.length;

    function pick(id) {
        var item = known[id] || null;
        openS[1](false);
        if (props.onChange) props.onChange(id, item);
    }

    function goVault() {
        openS[1](false);
        var host = typeof window !== "undefined" ? window.__WB_HOST__ : null;
        if (host && typeof host.navigateAddon === "function") host.navigateAddon("wb-addon-vault");
    }

    return h("div", { className: "wbml-picker", ref: boxRef },
        h("button", {
            type: "button",
            className: "wbml-picker-trigger" + (value && !missing ? " is-set" : "") + (missing ? " is-missing" : ""),
            disabled: disabled,
            "aria-haspopup": "listbox",
            "aria-expanded": open ? "true" : "false",
            onClick: function () { openS[1](!open); },
        },
        h("span", { className: "wbml-picker-label" }, label),
        h("span", { className: "wbml-picker-caret", "aria-hidden": "true" }, "▾")),
        missing
            ? h("p", { className: "wbml-picker-warn" },
                t(lang, "原凭据已失效，请重新选择", "The bound credential is gone — pick another one"))
            : null,
        open
            ? h("div", { className: "wbml-picker-panel", role: "dialog", "aria-label": t(lang, "选择凭据", "Choose a credential") },
                h(FilterChecklist, {
                    mode: "single",
                    items: shown.map(function (x) {
                        var sub = metaOf(x);
                        return { id: x.id, name: x.name, meta: kindText(lang, x.kind) + (sub ? " · " + sub : "") };
                    }),
                    selected: value ? [value] : [],
                    onPick: pick,
                    query: qS[0],
                    onQuery: function (v) { qS[1](v); },
                    title: t(lang, "保险箱凭据", "Vault credentials"),
                    total: rows.length,
                    searchPlaceholder: t(lang, "搜索凭据名称或备注", "Search by name or note"),
                    groupLabel: t(lang, "保险箱凭据", "Vault credentials"),
                    loading: loadS[0],
                    hasMore: hasMore,
                    onLoadMore: function () { pageS[1](pageS[0] + 1); },
                    emptyText: accountSetId
                        ? t(lang, "这个账号集合里还没有凭据", "This account set has no credentials yet")
                        : t(lang, "还没有凭据", "No credentials yet"),
                    noMatchText: t(lang, "没有匹配的凭据", "No matching credential"),
                    noMoreText: rows.length > PAGE ? t(lang, "没有更多", "No more") : "",
                    loadingText: t(lang, "加载中…", "Loading…"),
                    disabled: disabled,
                }),
                errS[0] ? h(C.Notice, { h: h, kind: "error", text: errS[0] }) : null,
                rows.length
                    ? h("div", { className: "wbml-picker-foot" },
                        t(lang, "已加载 " + shown.length + " / 共 " + rows.length,
                            "Loaded " + shown.length + " of " + rows.length))
                    : null,
                noRows && !qS[0] && !accountSetId
                    ? h("div", { className: "wbml-picker-empty" },
                        h("span", null, t(lang, "还没有凭据，去保险箱新建", "No credentials yet — create one in the vault")),
                        h("button", { type: "button", className: "wbml-btn", onClick: goVault },
                            t(lang, "去保险箱", "Open vault")))
                    : null)
            : null);
};

module.exports.PAGE = PAGE;
module.exports.KIND_LABEL = KIND_LABEL;
