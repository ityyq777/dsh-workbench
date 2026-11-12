// 归属控件仅编辑本地表单；建节点随 tasks.create 一次提交。
"use strict";
var limits = require('../../shared/tree/limits.cjs');
var ownership = require("./ownership.cjs");
module.exports = function (React) {
  var h = React.createElement;
  var Picker = require("./table-picker.cjs")(React);
  function Selection(props) {
    var state = React.useState(false), open = state[0], setOpen = state[1], trigger = React.useRef(null);
    var chosen = ownership.tables(props.tree).find(function (x) { return x.id === props.form.tableId; });
    function close() { setOpen(false); if (trigger.current) trigger.current.focus(); }
    return h("div", null,
      h("div", { className: "wbt-picker-detail" }, props.edit ? "当前归属：" + props.current : "目标任务表 *"),
      h("button", { ref: trigger, type: "button", className: "wbt-btn", disabled: !!props.form.newPath, "aria-expanded": open,
        onClick: function () { setOpen(!open); } }, props.edit ? "更换任务表" : "选择目标任务表"),
      open && !props.form.newPath ? h(Picker, { tree: props.tree, value: props.form.tableId, recommended: props.recommended,
        onChange: function (id) { props.set("tableId", props.edit && id === String(props.currentId) ? "" : id); }, onClose: close }) : null,
      chosen ? h("div", { className: "wbt-picker-detail", role: "status" }, (props.edit ? "将移动到：" : "已选择：") + chosen.path,
        props.edit ? h("button", { type: "button", className: "wbt-btn ghost", onClick: function () { props.set("tableId", ""); close(); } }, "撤销，保留原位") : null) :
        h("div", { className: "wbt-mhint" }, props.edit ? "未更换，保留当前归属。" : props.form.newPath ? "请确认新建路径。" : "请先选择目标任务表，再确认提交。"));
  }
  return function fields(props) {
    var form = props.form, set = props.set;
    var plan = ownership.preview(props.tree, form.tablePath, form.pathDescriptions || []);
    return h("div", { className: "wbt-field full" },
      h(Selection, { form: form, set: set, tree: props.tree, recommended: props.recommended, edit: props.edit, current: props.current, currentId: props.currentId }),
      !props.edit ? h("label", { className: "wbt-check" }, h("input", { type: "checkbox", "aria-label": "没有合适的表？新建节点", checked: !!form.newPath,
        onChange: function (e) { props.setMany({ newPath: e.target.checked, tableId: "", confirmed: false }); } }), "没有合适的表？新建节点") : null,
      form.newPath ? h("div", null,
        h("label", { className: "wbt-field full" }, "新路径（相对于根；以 / 分隔）", h("input", { className: "wbt-input", "aria-label": "新路径", value: form.tablePath, maxLength: limits.PATH_LEN_MAX,
          onChange: function (e) { props.setMany({ tablePath: e.target.value, pathDescriptions: [], confirmed: false }); } })),
        h("div", { className: "wbt-mhint wbt-ownership-preview", title: plan.path }, "预览：" + (plan.path || "请输入路径") + "。已有节点会复用，提交前不会写入。"),
        plan.nodes.map(function (node, i) { return h("label", { key: i, className: "wbt-field full" },
          h("span", { title: node.name }, (node.existing ? "复用" : "新建") + (node.type === "1" ? "表：" : "组：") + node.name),
          !node.existing ? h("textarea", { className: "wbt-textarea", "aria-label": "节点职责 " + (i + 1), maxLength: 2000, value: form.pathDescriptions[i] || "",
            onChange: function (e) { var values = form.pathDescriptions.slice(); values[i] = e.target.value; props.setMany({ pathDescriptions: values, confirmed: false }); } }) : null); }),
        plan.error ? h("div", { className: "wbt-err", role: "alert" }, plan.error) : null,
        h("label", { className: "wbt-check" }, h("input", { type: "checkbox", "aria-label": "确认新建路径", checked: !!form.confirmed, disabled: !!plan.error,
          onChange: function (e) { set("confirmed", e.target.checked); } }), "确认以上路径与职责，随任务一起提交")) : null
    );
  };
};