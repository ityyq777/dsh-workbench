var React = require("react"),
  ui = require("../ui/ui.cjs"),
  Editor = require("../modals/editor.cjs").Editor;
var h = ui.h,
  tr = ui.tr;
var StorageCard = require("../item/card.cjs").StorageCard;
var selection = require("../ui/selection.cjs");
function Records(props) {
  var api = props.api,
    lang = props.lang;
  var items = React.useState(null),
    error = React.useState(null),
    loading = React.useState(true),
    query = React.useState(""),
    text = React.useState(""),
    page = React.useState(1),
    size = React.useState(12),
    sort = React.useState("update_time"),
    order = React.useState("desc"),
    tick = React.useState(0),
    editing = React.useState(null),
    deleting = React.useState(null),
    preview = React.useState(null),
    busy = React.useState(false),
    caps = React.useState(false),
    ready = React.useState(false),
    confirmDelete = React.useState(true),
    tag = React.useState(null),
    bulk = React.useState(null), bulkError = React.useState(null), notice = React.useState(""),
    pending = React.useRef(false), bodyMode = React.useState("markdown");
  var scope = JSON.stringify([query[0], text[0], page[0], size[0], sort[0], order[0], tag[0] && tag[0].id, tick[0]]);
  var rows = items[0] && items[0].scope === scope ? items[0].records : [];
  var selected = selection.useSelection(scope, rows, busy[0] || !!bulk[0]);
  function deleteSelected() {
    if (pending.current || !bulk[0] || !bulk[0].length) return;
    pending.current = true; busy[1](true); bulkError[1](null);
    ui.call(api, "storage.bulkDelete", { ids: bulk[0].map(function (r) { return r.id; }) })
      .then(function (r) {
        bulk[1](null); selected.exit();
        notice[1](tr(lang,"已删除 ","Deleted ") + r.deleted + tr(lang," 条，跳过 "," items; skipped ") + r.skipped);
        refresh();
      }).catch(bulkError[1]).finally(function () { pending.current = false; busy[1](false); });
  }
  React.useEffect(
    function () {
      var active = true;
      Promise.all([ui.call(api, "storage.configGet"), ui.call(api, "storage.capabilities")])
        .then(function (r) {
          if (!active) return;
          var v = r[0].values || {};
          size[1](v["list.pageSize"] || 12);
          sort[1](v["list.sortColumn"] || "update_time");
          order[1](v["list.sortOrder"] || "desc");
          confirmDelete[1](v["ui.confirmDelete"] !== false);
          caps[1](!!r[1].tags);
          bodyMode[1](v["ui.bodyMode"] === "text" ? "text" : "markdown");
        })
        .catch(function (e) {
          if (active) error[1](e);
        })
        .finally(function () {
          if (active) ready[1](true);
        });
      return function () {
        active = false;
      };
    },
    [api],
  );
  React.useEffect(
    function () {
      var t = setTimeout(function () {
        text[1](query[0]);
        page[1](1);
      }, 250);
      return function () {
        clearTimeout(t);
      };
    },
    [query[0]],
  );
  React.useEffect(
    function () {
      if (!ready[0] || query[0] !== text[0]) return;
      var active = true;
      loading[1](true);
      error[1](null);
      var args = { text: text[0], pageNumber: page[0], pageSize: size[0], sortColumn: sort[0], sortOrder: order[0] };
      if (tag[0]) args.tagIds = [tag[0].id];
      ui.call(api, "storage.list", args)
        .then(function (r) {
          if (!active) return;
          if (page[0] > Math.max(1, r.pages || 1)) {
            page[1](Math.max(1, r.pages || 1));
            return;
          }
          items[1](Object.assign({}, r, { scope: scope }));
        })
        .catch(function (e) {
          if (active) error[1](e);
        })
        .finally(function () {
          if (active) loading[1](false);
        });
      return function () {
        active = false;
      };
    },
    [api, ready[0], scope],
  );
  function refresh() {
    tick[1](function (n) {
      return n + 1;
    });
  }
  function remove(item) {
    busy[1](true);
    ui.call(api, "storage.delete", { id: item.id })
      .then(function () {
        deleting[1](null);
        refresh();
      })
      .catch(error[1])
      .finally(function () {
        busy[1](false);
      });
  }
  function date(v) {
    return v ? String(v).replace("T", " ").slice(0, 19) : "—";
  }
  var data = items[0],
    pages = Math.max(1, (data && data.pages) || 1);
  return h(
    "div",
    { className: "wbi-root" },
    h(
      "div",
      { className: "wbi-row" },
      h("h2", null, h(ui.Icon, { name: "box", size: 16 }), tr(lang, "储物", "Storage")),
      h("span", { className: "wbi-muted" }, tr(lang, "记录物品、库存与存放备注", "Track items, stock and notes")),
      h("span", { className: "wbi-grow" }),
      h(ui.Button, { icon: "check", className: "wbi-btn wbi-btn-sm", disabled: busy[0] || !!bulk[0],
        onClick: selected.mode ? selected.exit : selected.enter }, selected.mode ? tr(lang,"取消选择","Cancel selection") : tr(lang,"选择","Select")),
      h(
        ui.Button,
        {
          icon: "plus", className: "wbi-btn wbi-primary",
          disabled: selected.mode || busy[0],
          onClick: function () {
            editing[1]({});
          },
        },
        tr(lang, "新增物品", "New item"),
      ),
    ),
    h(
      "div",
      { className: "wbi-toolbar" },
      h("input", {
        type: "search",
        value: query[0],
        placeholder: tr(lang, "搜索名称、品牌、位置或备注", "Search name, brand, location or notes"),
        "aria-label": tr(lang, "搜索物品", "Search inventory"),
        onChange: function (e) {
          query[1](e.target.value);
        },
      }),
      h(
        "select",
        {
          "aria-label": tr(lang, "排序字段", "Sort field"),
          value: sort[0],
          onChange: function (e) {
            sort[1](e.target.value);
            page[1](1);
          },
        },
        [
          ["update_time", "最近更新", "Updated"],
          ["create_time", "创建时间", "Created"],
          ["name", "名称", "Name"],
          ["brand", "品牌", "Brand"],
          ["stock", "库存文本", "Stock text"],
          ["location", "位置", "Location"],
        ].map(function (o) {
          return h("option", { key: o[0], value: o[0] }, tr(lang, o[1], o[2]));
        }),
      ),
      h(
        ui.Button,
        {
          icon: "sort",
          onClick: function () {
            order[1](order[0] === "desc" ? "asc" : "desc");
            page[1](1);
          },
        },
        order[0] === "desc" ? tr(lang, "降序 ↓", "Descending ↓") : tr(lang, "升序 ↑", "Ascending ↑"),
      ),
      h(ui.Button, { icon: "refresh", onClick: refresh, disabled: loading[0] }, tr(lang, "刷新", "Refresh")),
    ),
    tag[0]
      ? h(
          "div",
          { className: "wbi-row" },
          h("span", { className: "wbi-chip" }, tag[0].name),
          h(
            ui.Button,
            {
              onClick: function () {
                tag[1](null);
                page[1](1);
              },
            },
            tr(lang, "清除标签筛选", "Clear tag filter"),
          ),
        )
      : null,
    selected.mode ? h("p", { className: "wbi-muted" }, tr(lang,
      "仅选择当前页；搜索、筛选、排序、翻页或刷新会清空选择。Shift+点击连选，Esc退出。",
      "Current page only. Search, filters, sorting, paging or refresh clear selection. Shift-click selects a range; Esc exits.")) : null,
    notice[0] ? h("p", { role: "status" }, notice[0]) : null,
    h(ui.ErrorBox, { error: error[0] }),
    loading[0] ? h(ui.Skeleton, { lang: lang }) : null,
    !loading[0] && !error[0] && data && !data.records.length
      ? h(
          "div",
          { className: "wbi-empty" },
          h(ui.Icon, { name: "empty", size: 48 }),
          text[0] || tag[0]
            ? tr(lang, "没有匹配的物品，试试其他搜索条件", "No matching items. Try another filter.")
            : tr(lang, "还没有物品，点击“新增物品”开始记录", "No items yet. Add your first item."),
        )
      : null,
    h(
      "div",
      { className: "wbi-grid", "aria-busy": loading[0] },
      !loading[0] && !error[0] && data
        ? rows.map(function (item) {
            return h(StorageCard, {
              key: item.id, item: item, lang: lang, bodyMode: bodyMode[0], caps: caps[0], busy: busy[0] || !!bulk[0], date: date,
              selectionMode: selected.mode, checked: selected.ids.includes(item.id), onCheck: selected.toggle,
              onTag: function (t) { tag[1](t); page[1](1); },
              onPreview: preview[1], onEdit: editing[1],
              onDelete: function (v) { if (confirmDelete[0]) deleting[1](v); else remove(v); }
            });
          })
        : null,
    ),
    data
      ? h(
          "div",
          { className: "wbi-pager" },
          h(
            "span",
            { className: "wbi-muted" },
            data.total + tr(lang, " 条物品 · ", " items · ") + page[0] + " / " + pages,
          ),
          h(
            ui.Button,
            {
              disabled: page[0] <= 1 || loading[0],
              onClick: function () {
                page[1](page[0] - 1);
              },
            },
            tr(lang, "上一页", "Previous"),
          ),
          h(
            ui.Button,
            {
              disabled: page[0] >= pages || loading[0],
              onClick: function () {
                page[1](page[0] + 1);
              },
            },
            tr(lang, "下一页", "Next"),
          ),
          h(
            "select",
            {
              "aria-label": tr(lang, "每页条数", "Page size"),
              value: size[0],
              onChange: function (e) {
                size[1](Number(e.target.value));
                page[1](1);
              },
            },
            Array.from(new Set([4, 12, 24, 50, size[0]]))
              .sort(function (a, b) {
                return a - b;
              })
              .map(function (n) {
                return h("option", { key: n, value: n }, n + tr(lang, " / 页", " / page"));
              }),
          ),
        )
      : null,
    selected.mode ? h(selection.SelectionBar, { selection: selected, lang: lang, busy: busy[0] || !!bulk[0], loading: loading[0] },
      h(ui.Button, { className: "wbi-btn wbi-btn-sm wbi-danger", disabled: !selected.ids.length || loading[0] || busy[0] || !!bulk[0],
        onClick: function () {
          bulkError[1](null);
          bulk[1](rows.filter(function (r) { return selected.ids.includes(r.id); }).map(function(r) { return { id: r.id, name: r.name }; }));
        } }, tr(lang,"删除","Delete"))) : null,
    bulk[0] ? h(selection.DeleteConfirmation, { items: bulk[0], lang: lang, busy: busy[0], error: bulkError[0],
      onClose: function () { bulk[1](null); }, onConfirm: deleteSelected }) : null,
    editing[0]
      ? h(Editor, {
          api: api,
          lang: lang,
          item: editing[0],
          tagsEnabled: caps[0],
          onClose: function () {
            editing[1](null);
          },
          onSaved: function () {
            editing[1](null);
            refresh();
          },
        })
      : null,
    deleting[0]
      ? h(
          ui.Modal,
          {
            title: tr(lang, "删除物品", "Delete item"),
            onClose: busy[0]
              ? null
              : function () {
                  deleting[1](null);
                },
          },
          h(ui.ErrorBox, { error: error[0] }),
          h(
            "p",
            null,
            tr(lang, "确认删除「", "Delete “") +
              deleting[0].name +
              tr(lang, "」？将软删除记录并移除标签关联。", "”? This soft-deletes the record and removes tag links."),
          ),
          h(
            "div",
            { className: "wbi-formfoot" },
            h(
              ui.Button,
              {
                disabled: busy[0],
                onClick: function () {
                  deleting[1](null);
                },
              },
              tr(lang, "取消", "Cancel"),
            ),
            h(
              ui.Button,
              {
                disabled: busy[0],
                className: "wbi-btn wbi-danger",
                onClick: function () {
                  remove(deleting[0]);
                },
              },
              busy[0] ? tr(lang, "删除中…", "Deleting…") : tr(lang, "确认删除", "Confirm delete"),
            ),
          ),
        )
      : null,
    preview[0]
      ? h(
          ui.Modal,
          {
            title: preview[0].name,
            onClose: function () {
              preview[1](null);
            },
          },
          h("img", {
            className: "wbi-preview",
            src: preview[0].url,
            alt: preview[0].name,
            referrerPolicy: "no-referrer",
          }),
          h(
            "a",
            { href: preview[0].url, target: "_blank", rel: "noopener noreferrer" },
            tr(lang, "打开原图", "Open original"),
          ),
        )
      : null,
  );
}
module.exports = { Records: Records, StorageCard: StorageCard };
