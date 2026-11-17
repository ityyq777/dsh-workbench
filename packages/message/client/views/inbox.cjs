"use strict";
/**
 * 收件箱视图：分页列表 + 未读过滤 + 级别/关键词筛选 + 单条/全部标记已读。
 * 只通过本插件注册的 message.list / message.markRead 取数与写库。
 */
module.exports = function (deps) {
  var React = deps.React;
  var h = React.createElement;

  function fmt(template, vars) {
    return String(template).replace(/\{(\w+)\}/g, function (m, key) {
      return vars[key] === undefined ? m : String(vars[key]);
    });
  }

  function unwrap(r) {
    return r && r.result !== undefined ? r.result : r;
  }

  function timeText(ts, lang) {
    if (!ts) return "";
    try {
      return new Date(ts).toLocaleString(lang === "en" ? "en-US" : "zh-CN", { hour12: false });
    } catch (e) {
      return String(ts);
    }
  }

  function icon(props, name, size) {
    return props.Icon ? h(props.Icon, { name: name, size: size || 13 }) : null;
  }

  function MessageCard(props) {
    var m = props.message;
    var t = props.t;
    var lang = props.lang;
    var level = m.level || "info";
    return h(
      "article",
      { className: "wbm-card lv-" + level + (m.read ? "" : " is-unread") + " wbm-msg", "data-id": m.id },
      h(
        "div",
        { className: "wbm-card-top" },
        h("span", { className: "wbm-badge lv-" + level }, (t.level && t.level[level]) || level),
        h("span", { className: "wbm-title" }, m.title),
        h("span", { className: "wbm-grow" }),
        m.read ? h("span", { className: "wbm-badge" }, t.read) : null,
      ),
      h(
        "div",
        { className: "wbm-meta" },
        m.source ? h("span", null, t.from + "：" + m.source) : null,
        h("span", null, timeText(m.createdAt, lang)),
        m.audience && m.audience !== "all" ? h("span", null, (t.audience && t.audience[m.audience]) || m.audience) : null,
      ),
      h("div", { className: "wbm-body" }, m.body || t.bodyEmpty),
      m.read
        ? null
        : h(
            "div",
            { className: "wbm-ops" },
            h(
              "button",
              { type: "button", className: "wbm-btn", onClick: function () { props.onMark([m.id]); } },
              icon(props, "check"),
              h("span", null, t.markRead),
            ),
          ),
    );
  }

  return function InboxView(props) {
    var api = props.api;
    var t = props.t;
    var lang = props.lang;
    var pageSize = 20;
    var dataS = React.useState(null);
    var data = dataS[0];
    var setData = dataS[1];
    var busyS = React.useState(true);
    var busy = busyS[0];
    var setBusy = busyS[1];
    var errS = React.useState("");
    var error = errS[0];
    var setError = errS[1];
    var pageS = React.useState(1);
    var page = pageS[0];
    var setPage = pageS[1];
    var unreadS = React.useState(false);
    var unreadOnly = unreadS[0];
    var setUnreadOnly = unreadS[1];
    var levelS = React.useState("");
    var level = levelS[0];
    var setLevel = levelS[1];
    var textS = React.useState("");
    var text = textS[0];
    var setText = textS[1];
    var draftS = React.useState("");
    var draft = draftS[0];
    var setDraft = draftS[1];
    var tickS = React.useState(0);
    var tick = tickS[0];
    var setTick = tickS[1];
    var toastS = React.useState("");
    var toast = toastS[0];
    var setToast = toastS[1];

    React.useEffect(function () {
      var timer = setTimeout(function () { setText(draft.trim()); setPage(1); }, 260);
      return function () { clearTimeout(timer); };
    }, [draft]);

    React.useEffect(function () {
      var alive = true;
      setBusy(true);
      var args = { pageNumber: page, pageSize: pageSize };
      if (unreadOnly) args.unreadOnly = true;
      if (level) args.level = level;
      if (text) args.text = text;
      Promise.resolve(api.call("message.list", args))
        .then(function (r) {
          if (!alive) return;
          if (r && r.ok === false) throw new Error((r && r.error) || t.loadFail);
          setData(unwrap(r) || { records: [], total: 0, unread: 0, pageNumber: 1 });
          setError("");
        })
        .catch(function (e) {
          if (!alive) return;
          setError(String((e && e.message) || e) || t.loadFail);
        })
        .then(function () { if (alive) setBusy(false); });
      return function () { alive = false; };
    }, [api, page, unreadOnly, level, text, tick]);

    var unsubscribe = null;
    React.useEffect(function () {
      if (!api || typeof api.subscribe !== "function") return undefined;
      unsubscribe = api.subscribe(function (evt) {
        if (!evt || evt.domainId !== "wb-addon-message") return;
        setTick(function (x) { return x + 1; });
      });
      return function () { if (unsubscribe) unsubscribe(); };
    }, [api]);

    function toastOnce(message) {
      setToast(message);
      setTimeout(function () { setToast(""); }, 2200);
    }

    function mark(ids, all) {
      var args = all ? { all: true } : { ids: ids };
      Promise.resolve(api.call("message.markRead", args))
        .then(function (r) {
          if (r && r.ok === false) throw new Error((r && r.error) || t.loadFail);
          var body = unwrap(r) || {};
          toastOnce(fmt(t.marked, { n: body.updated || 0 }));
          setTick(function (x) { return x + 1; });
        })
        .catch(function (e) { toastOnce(String((e && e.message) || e)); });
    }

    var records = (data && data.records) || [];
    var total = data ? data.total : 0;
    var unread = data ? data.unread : 0;
    var pages = Math.max(1, Math.ceil(total / pageSize));

    return h(
      "div",
      { className: "wbm-root wbm-inbox" },
      h(
        "div",
        { className: "wbm-toolbar" },
        h(
          "label",
          { className: "wbm-check" },
          h("input", { type: "checkbox", checked: unreadOnly, onChange: function (e) { setUnreadOnly(e.target.checked); setPage(1); } }),
          h("span", null, t.unreadOnly),
        ),
        h(
          "select",
          { className: "wbm-select", value: level, "aria-label": t.levelAll, onChange: function (e) { setLevel(e.target.value); setPage(1); } },
          h("option", { value: "" }, t.levelAll),
          ["info", "success", "warning", "error"].map(function (lv) { return h("option", { key: lv, value: lv }, t.level[lv]); }),
        ),
        h("input", {
          className: "wbm-input",
          type: "search",
          value: draft,
          placeholder: t.searchPlaceholder,
          "aria-label": t.searchPlaceholder,
          onChange: function (e) { setDraft(e.target.value); },
        }),
        h("span", { className: "wbm-grow" }),
        h("span", { className: "wbm-sumbox" }, h("span", null, fmt(t.total, { n: total })), h("span", null, fmt(t.unreadCount, { n: unread }))),
        h(
          "button",
          { type: "button", className: "wbm-btn", disabled: !unread, onClick: function () { mark(null, true); } },
          icon(props, "check-check"),
          h("span", null, t.markAll),
        ),
        h(
          "button",
          { type: "button", className: "wbm-btn", onClick: function () { setTick(function (x) { return x + 1; }); } },
          icon(props, "refresh"),
          h("span", null, t.retry),
        ),
      ),
      error
        ? h("div", { className: "wbm-err", role: "alert" }, h("span", null, error), h("button", { type: "button", className: "wbm-btn", onClick: function () { setTick(function (x) { return x + 1; }); } }, t.retry))
        : null,
      busy && !data
        ? h("div", { className: "wbm-empty", role: "status", "aria-busy": "true" }, t.loading)
        : null,
      !busy && !records.length
        ? h("div", { className: "wbm-empty" }, text || level || unreadOnly ? t.noMatch : t.empty)
        : null,
      records.length
        ? h(
            "div",
            { className: "wbm-list" },
            records.map(function (m) {
              return h(MessageCard, { key: m.id, message: m, t: t, lang: lang, Icon: props.Icon, onMark: mark });
            }),
          )
        : null,
      pages > 1
        ? h(
            "div",
            { className: "wbm-pager" },
            h("span", null, fmt(t.pageInfo, { page: page, pages: pages })),
            h("button", { type: "button", className: "wbm-btn", disabled: page <= 1, onClick: function () { setPage(page - 1); } }, t.prev),
            h("button", { type: "button", className: "wbm-btn", disabled: page >= pages, onClick: function () { setPage(page + 1); } }, t.next),
          )
        : null,
      toast ? h("div", { className: "wbm-toast", role: "status" }, toast) : null,
    );
  };
};
