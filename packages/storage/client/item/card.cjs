var React = require("react"), ui = require("../ui/ui.cjs"), h = ui.h, tr = ui.tr;
var Description = require("../../../lib/description.cjs").Description;
function StorageCard(props) {
  var item = props.item, lang = props.lang, gallery = React.useState(false);
  var images = (item.imgList || []).filter(ui.safeImage), tags = item.tags || [];
  var shown = gallery[0] ? images : images.slice(0, 1);
  var hasStock = item.stock != null && item.stock !== "";
  var meta = [item.brand && tr(lang, "品牌：", "Brand: ") + item.brand,
    item.unit && tr(lang, "单位：", "Unit: ") + item.unit,
    item.location && tr(lang, "位置：", "Location: ") + item.location].filter(Boolean);
  return h("article", {
    className: "wbi-card" + (props.selectionMode ? " wbi-selectable" : "") + (props.checked ? " wbi-selected" : ""),
    onClickCapture: props.selectionMode ? function (e) {
      if (e.target.type === "checkbox") return;
      e.preventDefault(); e.stopPropagation();
      if (!props.busy) props.onCheck(item.id, e.shiftKey);
    } : undefined
  },
    props.selectionMode ? h("input", { type: "checkbox", className: "wbi-check", checked: !!props.checked,
      disabled: props.busy, "aria-label": tr(lang, "选择 ", "Select ") + item.name,
      onClick: function (e) { e.stopPropagation(); props.onCheck(item.id, e.shiftKey); },
      onChange: function () {} }) : null,
    h("div", { className: "wbi-cardhead" }, h("h3", null, item.name),
      h("span", { className: "wbi-stock" }, h(ui.Icon, { name: "stock", size: 16 }),
        h("span", null, hasStock ? item.stock : "—"),
        hasStock && item.unit ? h("small", { className: "wbi-muted" }, item.unit) : null)),
    tags.length ? h("div", { className: "wbi-tags" }, tags.map(function (t) {
      return h(ui.Button, { icon: "tag", key: t.id, className: "wbi-btn wbi-chip", disabled: !props.caps,
        title: tr(lang, "按此标签筛选", "Filter by this tag"),
        onClick: function () { props.onTag(t); } }, t.name);
    })) : null,
    meta.length || item.createTime || item.updateTime ? h("div", { className: "wbi-metazone" },
      meta.length ? h("div", { className: "wbi-muted" }, item.brand ? h("span", { className: "wbi-inline" }, h(ui.Icon, { name: "brand", size: 11 }), meta[0]) : null,
        item.unit ? h("span", { className: "wbi-inline" }, h(ui.Icon, { name: "unit", size: 11 }), tr(lang, "单位：", "Unit: ") + item.unit) : null,
        item.location ? h("span", { className: "wbi-inline" }, h(ui.Icon, { name: "location", size: 11 }), tr(lang, "位置：", "Location: ") + item.location) : null) : null,
      item.createTime || item.updateTime ? h("div", { className: "wbi-meta" },
        item.createTime ? h("span", null, tr(lang, "创建 ", "Created ") + props.date(item.createTime)) : null,
        item.updateTime ? h("span", null, tr(lang, "更新 ", "Updated ") + props.date(item.updateTime)) : null) : null) : null,
    h(Description, { text: item.remark, lang: lang, bodyMode: props.bodyMode }),
    images.length ? h("div", { className: "wbi-images" }, shown.map(function (url, i) {
      return h("button", { key: i, type: "button", className: "wbi-image",
        "aria-label": tr(lang, "预览图片 ", "Preview image ") + (i + 1),
        title: tr(lang, "预览图片 ", "Preview image ") + (i + 1),
        onClick: function () { props.onPreview({ url: url, name: item.name }); } },
        h(ui.Icon, { name: "image" }), h("img", { src: url, alt: item.name + " " + (i + 1), loading: "lazy", referrerPolicy: "no-referrer" }));
    }), images.length > 1 ? h(ui.Button, { className: "wbi-btn wbi-btn-sm wbi-ghost wbi-more",
      "aria-expanded": gallery[0], "aria-label": tr(lang, "展开或收起物品图片", "Expand or collapse item images"),
      onClick: function () { gallery[1](!gallery[0]); }
    }, gallery[0] ? tr(lang, "收起", "Collapse") : "+" + (images.length - 1)) : null) : null,
    !props.selectionMode ? h("div", { className: "wbi-actions" },
      h(ui.Button, { icon: "pencil", iconOnly: true, "aria-label": tr(lang, "编辑 ", "Edit ") + item.name, className: "wbi-btn wbi-btn-sm wbi-ghost", disabled: props.busy,
        onClick: function () { props.onEdit(item); } }, tr(lang, "编辑", "Edit")),
      h(ui.Button, { icon: "trash", iconOnly: true, "aria-label": tr(lang, "删除 ", "Delete ") + item.name, className: "wbi-btn wbi-btn-sm wbi-ghost wbi-danger", disabled: props.busy,
        onClick: function () { props.onDelete(item); } }, tr(lang, "删除", "Delete"))) : null);
}
module.exports = { StorageCard: StorageCard };
