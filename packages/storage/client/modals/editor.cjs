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
    options = React.useState(item.tags || []);
  var selected = React.useState(item.tags || []);
  React.useEffect(
    function () {
      if (!props.tagsEnabled) return;
      var active = true;
      var timer = setTimeout(function () {
        ui.call(props.api, "storageTags.search", { text: query[0], pageSize: 50 })
          .then(function (r) {
            if (active) options[1](r.records || []);
          })
          .catch(function (e) {
            if (active) err[1](e);
          });
      }, 200);
      return function () {
        active = false;
        clearTimeout(timer);
      };
    },
    [query[0], props.tagsEnabled, props.api],
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
                  { className: "wbi-tagoptions" },
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
                      t.name,
                    );
                  }),
                ),
                !candidates.size
                  ? h(
                      "span",
                      { className: "wbi-muted" },
                      tr(lang, "暂无标签，可在标签插件中创建", "No tags. Create them in the Tags plugin."),
                    )
                  : null,
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
