"use strict";
var GLYPHS = require("../ui/icons.cjs").ICONS;

var C = require("../ui/common.cjs");
var Attachments = require("../ui/attachments.cjs");
var ReplyTools = require("../ui/reply-tools.cjs");
var MailHtml = require("../ui/mail-html.cjs");
var prefsApi = require("./prefs.cjs");
var iconLabel = require("../../../lib/icon-label.cjs");
// 「只看未读」布尔筛选用共享开关控件。
var SW = require("../../../lib/switch.cjs");
var Folder = GLYPHS["folder"];
var InboxIcon = GLYPHS["inbox"];
var Refresh = GLYPHS["refresh-cw"];
var Download = GLYPHS["download"];
var Search = GLYPHS["search"];
var messageRows = require("./message-rows.cjs");
var Reader = require("./reader-context.cjs");
var detailTools = require("./detail-tools.cjs");
var detailPane = require("./detail-pane.cjs");
var Mail = GLYPHS["mail"];
var MailOpen = GLYPHS["mail-open"];
var Move = GLYPHS["folder-input"];
var Trash = GLYPHS["trash-2"];

module.exports = function Messages(props) {
  var h = props.h,
    React = props.React;
  var accounts = C.useLoad(React, props.api, "mail.accountList", {}, []);
  var account = React.useState("");
  return h(Inbox, Object.assign({}, props, { key: account[0], accountId: account, accounts: accounts }));
};
function Inbox(props) {
  var h = props.h,
    React = props.React,
    api = props.api,
    accountId = props.accountId;
  var accs = (props.accounts.data && props.accounts.data.items) || [];
  var prefs = prefsApi.usePrefs(React, api), pageSize = prefs.pageSize; // 配置只影响呈现策略
  var boxes = C.useLoad(React, api, "mail.mailboxList", { accountId: accountId[0] || undefined }, [accountId[0]]);
  var folders = (boxes.data && boxes.data.items) || [];
  var unified = React.useState(true), server = React.useState(null), searchRev = React.useRef(0);
  var folder = React.useState(accountId[0] ? "INBOX" : "");
  var search = React.useState(""),
    q = React.useState(""),
    unseen = React.useState(false);
  var page = React.useState([]),
    tokens = page[0];
  var list = C.useLoad(
    React,
    api,
    "mail.messageList",
    {
      accountId: accountId[0] || undefined,
      mailbox: folder[0] || undefined,
      unifiedInbox: !accountId[0] && unified[0],
      q: q[0],
      unread: unseen[0],
      limit: pageSize,
      cursor: tokens.at(-1),
    },
    [folder[0], q[0], unseen[0], tokens, unified[0], pageSize],
  );
  var sel = React.useState(null),
    msg = React.useState(null),
    target = React.useState("");
  var bodyState = React.useState({}),
    busy = React.useState(false),
    remote = React.useState(null);
  var generation = React.useRef(0),
    selected = React.useRef(0),
    busyRef = React.useRef(false);
  React.useEffect(function () {
    return function () {
      generation.current++;
      selected.current++;
      searchRev.current++;
    };
  }, []);
  // 后台自动同步抓到新信时刷新列表：当前文件夹/账户匹配才刷，别打断正在读别的账户的人。
  React.useEffect(
    function () {
      if (!api || typeof api.subscribe !== "function") return undefined;
      var off = api.subscribe(function (payload) {
        if (!payload || payload.event !== "mail.synced") return;
        var data = payload.data || {};
        if (data.accountId && accountId[0] && data.accountId !== accountId[0]) return;
        var box = String(folder[0] || "INBOX").toUpperCase();
        if (!unified[0] && data.mailbox && String(data.mailbox).toUpperCase() !== box) return;
        list.refresh();
      });
      return function () {
        if (typeof off === "function") off();
      };
    },
    [api, accountId[0], folder[0], unified[0]],
  );
  var pane = React.useRef(null), reading = React.useRef(null), returning = React.useRef(null);
  var attachmentUpdates = React.useRef(new Map());
  function back() {
    var saved = reading.current;
    close();
    returning.current = saved;
  }
  var expanded = React.useState(false);
  function close() {
    expanded[1](false);
    reading.current = null;
    returning.current = null;
    selected.current++;
    sel[1](null);
    target[1]("");
    bodyState[1]({});
  }
  function clearServer() { searchRev.current++; server[1](null); }
  function searchServer() {
    close();
    var rev = ++searchRev.current;
    server[1]({ loading: true });
    C.call(api, "mail.serverSearch", { accountId: accountId[0], mailbox: folder[0], q: search[0].trim(), unread: unseen[0] })
      .then(function (r) {
        if (rev !== searchRev.current) return;
        server[1]({ data: r });
        list.refresh();
      }).catch(function (e) {
        if (rev === searchRev.current) server[1]({ error: "服务器搜索失败：" + C.errText(e) });
      });
  }
  function reset() {
    clearServer();
    close();
    page[1]([]);
    msg[1](null);
  }
  function changeFolder(v) {
    generation.current++;
    busyRef.current = false;
    busy[1](false);
    remote[1](null);
    folder[1](v);
    reset();
  }
  function report(e) {
    msg[1]({ kind: "error", text: C.errText(e) });
  }
  function button(text, click, disabled, kind, Icon) {
    return h(C.Btn, { h: h, onClick: click, disabled: disabled, kind: kind }, Icon ? iconLabel(h, Icon, text) : text);
  }
  function isUnread(m) {
    return !/\\Seen/.test(String(m.flags || ""));
  }
  function sender(m) {
    return m.fromName || m.from || "未知发件人";
  }
  function senderDetail(m) {
    return m.from && m.fromName && m.from !== m.fromName ? m.fromName + " <" + m.from + ">" : sender(m);
  }
  var upgraded = React.useRef(new Set());
  function loadBody(m, force, rev) {
    bodyState[1]({ loading: true });
    C.call(api, "mail.messageBody", { id: m.id, force: !!force })
      .then(function (r) {
        if (rev !== selected.current) return;
        if (!r || r.ok === false) throw new Error((r && r.message) || "正文下载失败");
        if (Array.isArray(r.attachments)) attachmentUpdates.current.set(m.id, {
          hasAttachment: r.attachments.length > 0, attachmentName: r.attachments[0]?.filename || "",
        });
        bodyState[1]({ data: r });
        // 老缓存只有纯文本（htmlStale）：静默补拉一次富文本，失败时保留已显示的纯文本。
        if (!force && r && r.htmlStale && !upgraded.current.has(m.id)) {
          upgraded.current.add(m.id);
          loadBody(m, true, rev);
        }
      })
      .catch(function (e) {
        if (rev === selected.current) bodyState[1]({ error: C.errText(e) });
      });
  }
  function open(m, continuing) {
    if (bulk.locked()) return;
    if (!continuing || !reading.current) reading.current = Reader.capture(pane.current, items, m.id);
    returning.current = null;
    target[1]("");
    var rev = ++selected.current;
    sel[1](m);
    bodyState[1]({ loading: true });
    C.call(api, "mail.messageGet", { id: m.id })
      .then(function (d) {
        if (rev !== selected.current) return;
        sel[1](Object.assign({}, m, d));
        loadBody(d, false, rev);
        if (prefs["read.autoSeen"] !== false && isUnread(d) && d.uid > 0) mutate("mail.messageMarkRead", { id: d.id, read: true }, false, rev);
      })
      .catch(function (e) {
        if (rev === selected.current) bodyState[1]({ error: C.errText(e) });
      });
  }
  // 跨插件跳转（任务里的「原邮件」）：带 messageId 进来就直接打开那封信。
  // 不要求它在当前列表里——messageGet 按 id 取，跨账户、跨文件夹都能读到。
  var deepId = props.viewParams && props.viewParams.messageId ? String(props.viewParams.messageId) : "";
  var deepDone = React.useRef("");
  React.useEffect(function () {
    if (!deepId || deepDone.current === deepId) return;
    deepDone.current = deepId;
    var rev = ++selected.current;
    bodyState[1]({ loading: true });
    C.call(api, "mail.messageGet", { id: deepId })
      .then(function (d) {
        if (rev !== selected.current) return;
        sel[1](d);
        loadBody(d, false, rev);
      })
      .catch(function (e) {
        if (rev !== selected.current) bodyState[1]({ error: "打开来源邮件失败：" + C.errText(e) });
      });
  }, [deepId]);

  function mutate(action, args, leave, rev) {
    if (busyRef.current) return;
    var epoch = generation.current;
    busyRef.current = true;
    busy[1](true);
    C.call(api, action, args)
      .then(function () {
        if (epoch !== generation.current) return;
        list.refresh();
        if (rev !== selected.current) return;
        if (leave) back();
        else
          sel[1](function (m) {
            if (!m) return m;
            return Object.assign({}, m, {
              flags: (String(m.flags || "").replace(/\\Seen\b/gi, "") + (args.read ? " \\Seen" : "")).trim(),
            });
          });
      })
      .catch(function (e) {
        if (epoch === generation.current) report(e);
      })
      .finally(function () {
        if (epoch === generation.current) {
          busyRef.current = false;
          busy[1](false);
        }
      });
  }
  function sync(older, onlyFolders) {
    if (!accountId[0] || busyRef.current || (!onlyFolders && !canRemote)) return;
    var epoch = generation.current,
      args = { id: accountId[0] };
    if (!onlyFolders) {
      args.mailbox = folder[0];
      args.limit = pageSize;
      if (older) {
        if (!remote[0] || !remote[0].nextBeforeUid) return;
        args.beforeUid = remote[0].nextBeforeUid;
        args.uidValidity = remote[0].uidValidity;
      }
    }
    busyRef.current = true;
    busy[1](true);
    msg[1](null);
    C.call(api, onlyFolders ? "mail.mailboxSync" : "mail.sync", args)
      .then(function (r) {
        if (epoch !== generation.current) return;
        if (onlyFolders) {
          boxes.refresh();
          return;
        }
        remote[1](r);
        list.refresh();
        msg[1]({ kind: "ok", text: "抓取 " + r.fetched + " 封，新增 " + r.inserted + " 封" });
      })
      .catch(function (e) {
        if (epoch === generation.current) report(e);
      })
      .finally(function () {
        if (epoch === generation.current) {
          busyRef.current = false;
          busy[1](false);
        }
      });
  }
  function changePage(stack) {
    close();
    page[1](stack);
  }
  var current = sel[0],
    state = bodyState[0],
    data = state.data || {};
  var result = server[0] || list;
  var items = (result.data && result.data.items) || [],
    canSync = !!accountId[0];
  var bulk = require("./bulk.cjs").useBulk({ React, h, api, accounts: accs, items,
    scope: JSON.stringify([accountId[0], folder[0], unified[0], q[0], unseen[0], tokens, searchRev.current]),
    blocked: !!(busy[0] || result.loading || result.error || current),
    refresh: (kind, ids) => {
      list.refresh();
      if (server[0]?.data) server[1](require("./bulk.cjs").updateSearch(server[0], kind, ids, unseen[0]));
    },
  });
  var order = reading.current?.order || [];
  var previous = current && Reader.neighbor(order, items, current.id, -1);
  var next = current && Reader.neighbor(order, items, current.id, 1);
  (React.useLayoutEffect || React.useEffect)(function () {
    if (current || !returning.current || result.loading) return;
    Reader.restore(pane.current, returning.current);
    if (!busy[0]) returning.current = null;
  }, [current, result.data, result.loading, busy[0]]);
  var localOnly = folders.some(function (f) {
    return f.name === folder[0] && f.localOnly;
  });
  var canRemote = canSync && !localOnly;
  var names = Array.from(
    new Set(
      ["INBOX"].concat(
        folders.map(function (f) {
          return f.name;
        }),
      ),
    ),
  );
  function bodyNode() {
    // HTML 邮件（含详情里缓存的富文本）优先按原信渲染，纯文本邮件仍走 <pre>。
    var picked = prefsApi.readBody(prefs, data, current), html = picked.html, files = picked.files, hasText = picked.hasText;
    if (state.loading && !html && !hasText) return h("div", { className: "wbml-state" }, "正文下载中…");
    if (state.error && !html && !hasText)
      return h(
        "div",
        { className: "wbml-body-fail" },
        "正文下载失败：" + state.error,
        // 失败多半是服务器声明的分段尺寸与真实字节不一致，重新同步会整段重抓并重新解析结构。
        button("重新同步", function () {
          loadBody(current, true, selected.current);
        }),
      );
    return h(
      "div",
      { className: "wbml-body-wrap" },
      html
        ? h(MailHtml, { h: h, React: React, api: api, html: html, attachments: data.attachments || current.attachments || [], title: current.subject, mailId: current.id, remoteDefault: prefs["images.remote"] !== false, mailTheme: prefs["display.mailTheme"] })
        : h("pre", { className: "wbml-body" }, data.body || current.body || "此邮件无文字正文"),
      h(Attachments, { h: h, React: React, api: api, localOnly: current.uid <= 0 || !current.uidValidity, items: files }),
      data.truncated || current.bodyTruncated
        ? h("p", { className: "wbml-body-note" }, "正文较长，已截断显示。")
        : null,
      current.uid > 0
        ? button("重新下载正文", function () {
            loadBody(current, true, ++selected.current);
          })
        : null,
    );
  }
  var body = result.loading
    ? h("div", { className: "wbml-state" }, "加载中…")
    : result.error
      ? h(C.Notice, { h: h, kind: "error", text: result.error })
      : h(
          React.Fragment,
          null,
          !items.length
            ? h(C.Empty, {
                h: h,
                text: server[0] ? "服务器没有匹配的邮件" : !accs.length ? "还没有账户" : q[0] || unseen[0] ? "未找到符合条件的本地邮件" : "没有本地邮件",
              })
            : null,
          h(
            "div",
            { className: "wbml-list" },
            messageRows(h, items, { current, wrapRow: bulk.wrapRow, showSource: !accountId[0], lang: props.lang,
              attachmentUpdates: attachmentUpdates.current, open, sender, senderDetail, isUnread }),
          ),
          !server[0] && h(
            "div",
            { className: "wbml-paging" },
            button(
              "上一页",
              function () {
                changePage(tokens.slice(0, -1));
              },
              !tokens.length,
            ),
            h("span", null, "第 " + (tokens.length + 1) + " 页"),
            button(
              "下一页",
              function () {
                changePage(tokens.concat(list.data.nextCursor));
              },
              !list.data || !list.data.hasMore,
            ),
          ),
        );
  return h(
    "div",
    { className: "wbml-page is-split wb-fill" },
    h(
      "div",
      { className: "wbml-head" },
      h("h2", null, "邮件"),
      button("刷新本地列表", function () {
        reset();
        list.refresh();
      }, undefined, undefined, Refresh),
    ),
    h(C.Notice, { h: h, kind: "error", text: props.accounts.error || boxes.error }),
    h(C.Notice, { h: h, kind: msg[0] && msg[0].kind, text: msg[0] && msg[0].text }),
    h(
      "div",
      { className: "wbml-layout" + (current ? " has-detail" : "") },
      h(
        "aside",
        { className: "wbml-rail" },
        h(
          "div",
          { className: "wbml-rail-card" },
          h(
            C.Field,
            { h: h, label: "收件账户" },
            h(
              "select",
              {
                className: "wbml-input",
                value: accountId[0],
                onChange: function (e) {
                  accountId[1](e.target.value);
                },
              },
              h("option", { value: "" }, "全部账户"),
              accs.map(function (a) {
                return h("option", { key: a.id, value: a.id }, a.name);
              }),
            ),
          ),
          !canSync && h(C.Field, { h: h, label: "邮件范围" }, h("select", {
            className: "wbml-input", value: unified[0] ? "inbox" : "all",
            onChange: function (e) { unified[1](e.target.value === "inbox"); reset(); },
          }, h("option", { value: "inbox" }, "统一收件箱"), h("option", { value: "all" }, "全部邮件"))),
          canSync && h(require("./folder-shortcuts.cjs"), {
            h, folders, accountId: accountId[0], selected: folder[0], onChange: changeFolder,
          }),
          canSync && h(
            C.Field,
            { h: h, label: iconLabel(h, Folder, "文件夹") },
            h(
              "select",
              {
                className: "wbml-input",
                value: folder[0],
                disabled: !canSync,
                onChange: function (e) {
                  changeFolder(e.target.value);
                },
              },
              !canSync ? h("option", { value: "" }, "全部文件夹") : null,
              names.map(function (n) {
                return h("option", { key: n, value: n }, n);
              }),
            ),
          ),
          h(
            "div",
            { className: "wbml-body-tools" },
            button(
              "更新文件夹",
              function () {
                sync(false, true);
              },
              !canSync || busy[0],
              undefined,
              Folder,
            ),
            button(
              "同步最新邮件",
              function () {
                sync(false, false);
              },
              !canRemote || busy[0],
              "primary",
              Download,
            ),
          ),
          canRemote && remote[0]
            ? button(
                remote[0].nextBeforeUid ? "从服务器加载更早邮件" : "已到服务器最早邮件",
                function () {
                  sync(true, false);
                },
                !remote[0].nextBeforeUid || busy[0],
              )
            : null,
          localOnly
            ? h("small", { className: "wbml-muted" }, "此文件夹仅保留本地副本")
            : !canSync
              ? h("small", { className: "wbml-muted" }, "选择具体账户后可同步")
              : null,
          h(
            "form",
            {
              className: "wbml-search",
              onSubmit: function (e) {
                e.preventDefault();
                q[1](search[0].trim());
                reset();
              },
            },
            h(
              C.Field,
              { h: h, label: "搜索本地副本", hint: "仅匹配已下载信头的主题和发件地址" },
              h("input", {
                className: "wbml-input",
                type: "search",
                value: search[0],
                onChange: function (e) {
                  clearServer();
                  close();
                  search[1](e.target.value);
                },
              }),
            ),
            h(C.Btn, { h: h, type: "submit" }, iconLabel(h, Search, "搜索")),
            button("在服务器搜索", searchServer, !canRemote || !folder[0] || !search[0].trim() || !!server[0]?.loading, undefined, Search),
            server[0] && button("返回本地列表", function () { clearServer(); close(); }),
          ),
          h(SW.Switch, {
            h: h,
            checked: unseen[0],
            label: "只看未读",
            onChange: function (next) {
              unseen[1](next);
              reset();
            },
          }),
        ),
      ),
      h(
        "section",
        { className: "wbml-pane wbml-listpane", ref: pane, tabIndex: -1 },
        h(
          "div",
          { className: "wbml-pane-head" },
          h("strong", null, iconLabel(h,
            server[0] ? Search : folder[0] && folder[0] !== "INBOX" ? Folder : folder[0] || unified[0] ? InboxIcon : Mail,
            server[0] ? "服务器搜索 · " + folder[0] : folder[0] || (unified[0] ? "统一收件箱" : "全部邮件"))),
          h(
            "span",
            { className: "wbml-muted" },
            result.error || result.loading ? null : (server[0] ? "显示 " : "本页 ") + items.length + " 封 · " + items.filter(isUnread).length + " 未读" + (server[0]?.data?.truncated ? " · 仅显示最近 50 封" : ""),
          ),
        ),
        !current && bulk.toolbar,
        h("div", { className: "wbml-state-box" }, body),
      ),
      current
        ? detailPane(h, {
            current, accountLabel: Reader.accountLabel(accs, current), time: C.fmtTime(current.dateAt, props.lang),
            back, expanded: expanded[0], toggle: () => expanded[1](!expanded[0]),
            previous: previous && !busy[0] ? () => open(previous, true) : null,
            next: next && !busy[0] ? () => open(next, true) : null,
          },
            current.uid > 0
              ? detailTools({
                  h, button, current, unread: isUnread(current), busy: busy[0],
                  target: target[0], setTarget: function (v) { target[1](v); },
                  folders: folders, mutate: mutate, selected: selected.current,
                  lang: props.lang, senderDetail: senderDetail, Slot: props.Slot,
                  Mail: Mail, MailOpen: MailOpen, Move: Move, Trash: Trash,
                })
              : null,
            h(
              "div",
              { className: "wbml-detail-content", key: current.id },
              bodyNode(),
              h(
                ReplyTools,
                Object.assign({}, props, {
                  key: current.id,
                  message: current,
                  body: data.body || current.body || "",
                  bodyReady: !!state.data,
                   originalAttachments: data.attachments || current.attachments || [],
                }),
              ),
            ),
          )
        : null,
    ),
  );
}
