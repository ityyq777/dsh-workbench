var React = require("react"),
  ui = require("../ui/ui.cjs");
var h = ui.h,
  tr = ui.tr;
function Editor(props) {
  var item = props.item || {},
    lang = props.lang;
  var state = React.useState(function () {
    return {
      name: item.name || "",
      brand: item.brand || "",
      unit: item.unit || "",
      stock: item.stock || "",
      location: item.location || "",
      remark: item.remark || "",
      images: (item.imgList || []).join("\n"),
      tagIds: (
        item.tagIds ||
        (item.tags || []).map(function (t) {
          return t.id;
        })
      ).slice(),
    };
  });
  var form = state[0],
    setForm = state[1];
  var err = React.useState(null),
    busy = React.useState(false),
    query = React.useState(""),
    options = React.useState([]),
    page = React.useState(0),
    total = React.useState(0),
    hasMore = React.useState(false),
    loading = React.useState(false),
    names = React.useState(function () {
      var map = {};
      (item.tags || []).forEach(function (t) {
        map[String(t.id)] = t.name;
      });
      return map;
    });
  var selected = React.useState(item.tags || []);
  var seq = React.useRef(0);
  // 每页 20 个标签：搜索回到第一页，滚动到底追加下一页；已选标签不随搜索/翻页丢失。
  var load = React.useCallback(
    function (text, pageNumber, append) {
      var mine = ++seq.current;
      loading[1](true);
      return ui
        .call(props.api, "storageTags.search", { text: text || "", pageNumber: pageNumber, pageSize: 20 })
        .then(function (r) {
          if (mine !== seq.current) return;
          loading[1](false);
          var records = (r && r.records) || [];
          total[1]((r && r.total) || 0);
          page[1]((r && r.current) || pageNumber);
          hasMore[1](((r && r.current) || pageNumber) < ((r && r.pages) || 0));
          options[1](function (prev) {
            var list = append ? prev.slice() : [];
            var seen = {};
            list.forEach(function (x) {
              seen[String(x.id)] = true;
            });
            records.forEach(function (x) {
              if (!seen[String(x.id)]) list.push(x);
            });
            return list;
          });
          names[1](function (prev) {
            var next = Object.assign({}, prev);
            records.forEach(function (x) {
              next[String(x.id)] = x.name;
            });
            return next;
          });
        })
        .catch(function (e) {
          if (mine !== seq.current) return;
          loading[1](false);
          err[1](e);
        });
    },
    [props.api],
  );
  React.useEffect(
    function () {
      if (!props.tagsEnabled) return undefined;
      var timer = setTimeout(
        function () {
          load(query[0], 1, false);
        },
        query[0] ? 200 : 0,
      );
      return function () {
        clearTimeout(timer);
      };
    },
    [query[0], props.tagsEnabled, load],
  );
  // 已选项可能不在当前页或当前搜索词里，按 id 补齐名字，保证保存前的勾选可读。
  React.useEffect(
    function () {
      if (!props.tagsEnabled) return undefined;
      var missing = form.tagIds.filter(function (id) {
        return !names[0][String(id)];
      });
      if (!missing.length) return undefined;
      var active = true;
      ui.call(props.api, "storageTags.byIds", { ids: missing })
        .then(function (r) {
          if (!active) return;
          var next = {};
          ((r && r.records) || []).forEach(function (x) {
            next[String(x.id)] = x.name;
          });
          if (!Object.keys(next).length) return;
          names[1](function (prev) {
            return Object.assign({}, prev, next);
          });
        })
        .catch(function () {});
      return function () {
        active = false;
      };
    },
    [props.api, props.tagsEnabled, form.tagIds.join(",")],
  );
  function update(k, v) {
    setForm(function (f) {
      return Object.assign({}, f, { [k]: v });
    });
  }
  function field(k, zh, en, wide, textarea) {
    return h(
      "label",
      { className: "wbi-field" + (wide ? " wbi-wide" : "") },
      h("span", null, tr(lang, zh, en)),
      h(textarea ? "textarea" : "input", {
        name: k,
        value: form[k],
        required: k === "name",
        disabled: busy[0],
        onChange: function (e) {
          update(k, e.target.value);
        },
      }),
    );
  }
  function save(e) {
    e.preventDefault();
    if (busy[0]) return;
    var images = form.images
      .split(/\r?\n/)
      .map(function (s) {
        return s.trim();
      })
      .filter(Boolean);
    if (
      images.some(function (s) {
        return !ui.safeImage(s);
      })
    ) {
      err[1](tr(lang, "图片地址必须是完整的 HTTP(S) URL", "Images must use full HTTP(S) URLs"));
      return;
    }
    if (!form.name.trim()) {
      err[1](tr(lang, "请填写物品名称", "Enter an item name"));
      return;
    }
    var args = {
      name: form.name.trim(),
      brand: form.brand,
      unit: form.unit,
      stock: form.stock,
      location: form.location,
      remark: form.remark,
      imgList: images,
    };
    if (item.id) args.id = item.id;
    if (props.tagsEnabled) args.tagIds = form.tagIds;
    busy[1](true);
    err[1](null);
    ui.call(props.api, item.id ? "storage.update" : "storage.create", args)
      .then(function () {
        props.onSaved();
      })
      .catch(err[1])
      .finally(function () {
        busy[1](false);
      });
  }
  var candidates = new Map();
  selected[0].concat(options[0]).forEach(function (t) {
    candidates.set(t.id, t);
  });
  function onListScroll(e) {
    var el = e.currentTarget;
    if (!hasMore[0] || loading[0]) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 24) load(query[0], (page[0] || 1) + 1, true);
  }
  var tagsNote = loading[0]
    ? tr(lang, "加载中…", "Loading…")
    : !candidates.size
      ? query[0]
        ? tr(lang, "没有匹配的标签", "No matching tags")
        : tr(lang, "暂无标签，可在标签插件中创建", "No tags. Create them in the Tags plugin.")
      : hasMore[0]
        ? ""
        : tr(lang, "没有更多", "No more");
  return h(
    ui.Modal,
    {
      title: item.id ? tr(lang, "编辑物品", "Edit item") : tr(lang, "新增物品", "New item"),
      onClose: busy[0] ? null : props.onClose,
    },
    h(ui.ErrorBox, { error: err[0] }),
    h(
      "form",
      { onSubmit: save },
      h(
        "div",
        { className: "wbi-form" },
        field("name", "名称 *", "Name *", true),
        field("brand", "品牌", "Brand"),
        field("unit", "单位", "Unit"),
        field("stock", "库存（可填写 1~2 等文字）", "Stock (text such as 1–2)", true),
        field("location", "存放位置", "Location"),
        field("remark", "备注", "Notes", true, true),
        field("images", "图片 URL（每行一个）", "Image URLs (one per line)", true, true),
        h(
          "div",
          { className: "wbi-field wbi-wide" },
          h("span", null, tr(lang, "标签", "Tags")),
          props.tagsEnabled
            ? h(
                React.Fragment,
                null,
                h("input", {
                  type: "search",
                  placeholder: tr(lang, "搜索已有标签", "Search existing tags"),
                  "aria-label": tr(lang, "搜索已有标签", "Search existing tags"),
                  value: query[0],
                  disabled: busy[0],
                  onChange: function (e) {
                    query[1](e.target.value);
                  },
                }),
                h(
                  "div",
                  { className: "wbi-tagoptions", onScroll: onListScroll },
                  Array.from(candidates.values()).map(function (t) {
                    return h(
                      "label",
                      { key: t.id },
                      h("input", {
                        type: "checkbox",
                        checked: form.tagIds.includes(t.id),
                        disabled: busy[0],
                        onChange: function (e) {
                          var checked = e.target.checked;
                          update(
                            "tagIds",
                            checked
                              ? form.tagIds.concat(t.id)
                              : form.tagIds.filter(function (id) {
                                  return id !== t.id;
                                }),
                          );
                          selected[1](function (tags) {
                            return checked
                              ? tags
                                  .filter(function (x) {
                                    return x.id !== t.id;
                                  })
                                  .concat(t)
                              : tags.filter(function (x) {
                                  return x.id !== t.id;
                                });
                          });
                        },
                      }),
                      names[0][String(t.id)] || t.name,
                    );
                  }),
                ),
                h("div", { className: "wbi-tagmore" }, tagsNote),
              )
            : h(
                "span",
                { className: "wbi-muted" },
                tr(lang, "标签插件不可用，保存时保留原有关联", "Tags unavailable; existing links are preserved."),
              ),
        ),
      ),
      h(
        "div",
        { className: "wbi-formfoot" },
        h(ui.Button, { onClick: props.onClose, disabled: busy[0] }, tr(lang, "取消", "Cancel")),
        h(
          ui.Button,
          { type: "submit", disabled: busy[0], className: "wbi-btn wbi-primary" },
          busy[0] ? tr(lang, "保存中…", "Saving…") : tr(lang, "保存", "Save"),
        ),
      ),
    ),
  );
}
module.exports = { Editor: Editor };
