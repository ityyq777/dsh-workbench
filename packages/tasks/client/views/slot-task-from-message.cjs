"use strict";
/**
 * 插槽贡献：在邮件详情里加一个「建任务」按钮。
 *
 * 为什么要点开才建：
 * tasks.create 的契约是「必须显式给 tableId 或 tablePath，否则 TABLE_REQUIRED 且零写入」。
 * 所以这里必须先让用户选目标表——顺手也避免把邮件一键塞进错误的表里。
 *
 * 创建时写入两条信息：
 *  - dedupeKey = "mail.message:<id>"：同一封信重复点不会建出两个任务；
 *  - 描述里写一行 `来源邮件：wb-mail:<id>`：由邮件自己的插槽贡献渲染「原邮件」回链
 *    （见 mail/client/views/slot-back-to-message.cjs），任务侧不解析这个标记。
 */
module.exports = function (deps) {
  var React = deps.React;
  var h = React.createElement;
  var Icon = deps.Icon;
  var injectCss = deps.injectCss;
  var KIND = "mail.message";

  /** 节点树里的任务表（type=1）拍平成一维，供下拉选择。 */
  function flattenTables(nodes, out) {
    var list = out || [];
    (nodes || []).forEach(function (node) {
      if (!node) return;
      if (String(node.type) === "1") list.push({ id: String(node.id), name: String(node.name || node.path || node.id) });
      if (node.children && node.children.length) flattenTables(node.children, list);
    });
    return list;
  }

  function defaultTitle(item, en) {
    var subject = String((item && item.title) || "").trim();
    if (subject) return subject;
    return en ? "Follow up: (no subject)" : "跟进：（无主题）";
  }

  function buildDescription(item, en) {
    var lines = [en ? "Created from a mail message." : "由邮件创建。"];
    if (item.subtitle) lines.push((en ? "From: " : "发件人：") + item.subtitle);
    if (item.title) lines.push((en ? "Subject: " : "主题：") + item.title);
    lines.push((en ? "Source mail: " : "来源邮件：") + "wb-mail:" + item.id);
    return lines.join("\n");
  }

  return function TaskFromMessage(props) {
    React.useEffect(function () { injectCss(); }, []);
    var item = props.item;
    var en = props.lang === "en";
    var api = props.api;
    var open = React.useState(false);
    var tables = React.useState(null); // null=未加载；[]=加载完但没有表
    var tableId = React.useState("");
    var title = React.useState("");
    var busy = React.useState(false);
    var error = React.useState("");
    var created = React.useState(null);

    // 不是邮件条目就什么都不做：贡献方只认自己声明过的 kind。
    if (!item || item.kind !== KIND || !item.id) return null;

    function loadTables() {
      if (tables[0] !== null) return;
      tables[1](undefined);
      api.call("taskNodes.tree").then(function (r) {
        if (!r || !r.ok) throw new Error((r && r.error) || "tree load failed");
        var list = flattenTables(Array.isArray(r.result) ? r.result : []);
        tables[1](list);
        if (list.length === 1) tableId[1](list[0].id);
      }).catch(function (e) {
        tables[1]([]);
        error[1](String((e && e.message) || e));
      });
    }

    function toggle() {
      if (!open[0]) {
        title[1](defaultTitle(item, en));
        loadTables();
      }
      open[1](!open[0]);
    }

    function submit() {
      if (busy[0]) return;
      var name = String(title[0] || "").trim();
      if (!name) { error[1](en ? "Title is required" : "标题不能为空"); return; }
      if (!tableId[0]) { error[1](en ? "Pick a target table" : "请选择目标表"); return; }
      busy[1](true);
      error[1]("");
      api.call("tasks.create", {
        title: name,
        description: buildDescription(item, en),
        tableId: tableId[0],
        dedupeKey: KIND + ":" + item.id,
      }).then(function (r) {
        if (!r || !r.ok) throw new Error((r && r.error) || "create failed");
        created[1](r.result || {});
        open[1](false);
      }).catch(function (e) {
        error[1](String((e && e.message) || e));
      }).finally(function () { busy[1](false); });
    }

    if (created[0]) {
      var task = created[0];
      var shortId = String(task.id || "").slice(0, 8);
      return h("span", { className: "wbtx-slot-done" },
        h("span", { className: "wbtx-slot-note" }, (en ? "Task created" : "已建任务") + (shortId ? " · " + shortId : "")),
        h("button", {
          type: "button", className: "wbtx-slot-link",
          onClick: function (e) { e.stopPropagation(); props.onNavigate("tasks"); },
        }, en ? "Open tasks" : "去任务页"));
    }

    var loading = tables[0] === undefined;
    var options = Array.isArray(tables[0]) ? tables[0] : [];
    return h("span", { className: "wbtx-slot" },
      h("button", {
        type: "button",
        className: "wbt-btn wbtx-slot-btn",
        "aria-expanded": !!open[0],
        disabled: busy[0],
        title: en ? "Create a task from this message" : "把这封邮件变成任务",
        onClick: function (e) { e.stopPropagation(); toggle(); },
      }, h(Icon, { name: "plus", size: 13 }), en ? "New task" : "建任务"),
      open[0] ? h("span", { className: "wbtx-slot-panel" },
        h("label", { className: "wbtx-slot-row" }, h("span", null, en ? "Title" : "标题"),
          h("input", {
            className: "wbt-input wbtx-slot-input", value: title[0], autoFocus: true,
            onChange: function (e) { title[1](e.target.value); },
            onKeyDown: function (e) { if (e.key === "Enter") { e.preventDefault(); submit(); } if (e.key === "Escape") open[1](false); },
          })),
        h("label", { className: "wbtx-slot-row" }, h("span", null, en ? "Table" : "目标表"),
          loading
            ? h("span", { className: "wbtx-slot-muted" }, en ? "Loading…" : "读取中…")
            : options.length
              ? h("select", {
                  className: "wbt-input wbtx-slot-input", value: tableId[0],
                  onChange: function (e) { tableId[1](e.target.value); },
                }, [h("option", { key: "", value: "" }, en ? "Pick a table" : "选择目标表")].concat(
                  options.map(function (o) { return h("option", { key: o.id, value: o.id }, o.name); })))
              : h("span", { className: "wbtx-slot-muted" }, en ? "No task table yet" : "还没有任务表")),
        error[0] ? h("span", { className: "wbt-err", role: "alert" }, error[0]) : null,
        h("span", { className: "wbtx-slot-foot" },
          h("button", { type: "button", className: "wbt-btn ghost", onClick: function (e) { e.stopPropagation(); open[1](false); } }, en ? "Cancel" : "取消"),
          h("button", {
            type: "button", className: "wbt-btn primary",
            disabled: busy[0] || loading || !options.length,
            onClick: function (e) { e.stopPropagation(); submit(); },
          }, busy[0] ? "…" : en ? "Create" : "创建"))
      ) : null);
  };
};
