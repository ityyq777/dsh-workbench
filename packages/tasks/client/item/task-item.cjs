// 列表与卡片共用只读文本；编辑统一通过任务面板，依赖从入口注入。
"use strict";
module.exports = function (deps) {
  var React = deps.React, h = React.createElement;
  var Highlight = require("../ui/highlight.cjs")(React);
  var Body = require("../../../lib/markdown.cjs").createBody(React, Highlight);
  var BodyMode = require("../ui/body-mode.cjs")(React);
  var statusInfo = deps.statusInfo, stars = deps.stars, pClass = deps.pClass;
  var today = deps.today, daysBetween = deps.daysBetween, cx = deps.cx;
  var Icon = deps.Icon, Countdown = deps.Countdown, PathCrumbs = deps.PathCrumbs;
  function TaskItem(props) {
    var t = props.t;
    var initialMode = props.bodyMode === "text" ? "text" : "markdown";
    var descMode = React.useState(initialMode), reviewMode = React.useState(initialMode);
    var bodyId = require("../../../lib/body-id.cjs")(React);
    function bodySection(label, text, state, review) {
      var labelId = bodyId + (review ? "-review" : "-desc");
      if (!String(text || "").trim()) return null;
      return h("section", { className: "wbt-body-section wb-body-section", "aria-labelledby": labelId },
        h("div", { className: "wbt-body-heading wb-body-heading" },
          h("span", { id: labelId, className: "wb-body-label" + (review ? " wb-review-label" : "") }, label),
          h(BodyMode, { className: "wbt-body-toggle", label: label, mode: state[0], onChange: state[1], t: t, Icon: Icon })),
        h("div", { className: review ? "wbt-review" : "wbt-desc wb-desc" },
          h(Body, { text: text, mode: state[0], keyword: props.keyword })));
    }
    var task = props.task;
    var st = statusInfo(task.status);
    var stName = props.lang === "en" ? st.en : st.zh;
    var myTags = task.tags || [];
    // 已接取仍处于「开启类」：保留优先级、截止倒计时，并可完成/关闭。
    var openLike = String(task.status) === "0" || String(task.status) === "4";
    var isActive = openLike;

    var countdown = openLike ? daysBetween(task.targetDate) : null;
    var cdTarget = openLike && task.targetDate ? new Date(String(task.targetDate) + "T23:59:59").getTime() : NaN;
    var tagNodes = myTags.map(function (tag) {
      return h("span", {
        key: "tag-" + String(tag.id), className: "wbt-tag", title: tag.name,
        onClick: props.onTagPick ? function (e) { e.stopPropagation(); props.onTagPick(String(tag.id)); } : null,
      }, "#" + tag.name);
    });
    var meta = [];
    if (task.publishDate) meta.push(h("span", { key: "p" }, h("b", null, t.publish), " ", task.publishDate));
    if (openLike && task.targetDate) {
      meta.push(h("span", { key: "g" }, h("b", null, t.target), " ", task.targetDate,
        Number.isFinite(cdTarget) ? h(Countdown, { target: cdTarget }) : null));
    } else if (String(task.status) === "2") {
      if (task.targetDate) meta.push(h("span", { key: "g" }, h("b", null, t.target), " ", task.targetDate));
      if (task.doneDate) meta.push(h("span", { key: "d" }, h("b", null, t.done), " ", task.doneDate));

    } else {
      if (task.targetDate) meta.push(h("span", { key: "g" }, h("b", null, t.target), " ", task.targetDate));
      if (task.shutdownDate) meta.push(h("span", { key: "s" }, h("b", null, t.shutdown), " ", task.shutdownDate));
    }

    if (Number(task.difficulty) > 0) meta.push(h("span", { key: "difficulty", className: "wbt-stars", "aria-label": t.difficulty + " " + task.difficulty + " / 5", children: stars(task.difficulty) + " " + Number(task.difficulty).toFixed(1) }));

    var ops = [];
    ops.push(h("button", {
      key: "edit", className: "wbt-icon", title: t.edit, "aria-label": t.edit,
      onClick: function () { props.onEdit(task); },
    }, h(Icon, { name: "pencil", size: 14 })));
    if (isActive) {
      ops.push(h("button", { key: "p+", className: "wbt-icon", title: t.priority + " +1", onClick: function () { if (Number(task.priority) < 10) props.update(task, { type: "PRIORITY", priority: Math.max(1, Number(task.priority) + 1) }); } }, h(Icon, { name: "plus", size: 14 })));
      ops.push(h("button", { key: "p-", className: "wbt-icon", title: t.priority + " -1", onClick: function () { if (Number(task.priority) > 1) props.update(task, { type: "PRIORITY", priority: Number(task.priority) - 1 }); } }, h(Icon, { name: "minus", size: 14 })));
      ops.push(h("button", { key: "done", className: "wbt-btn wbt-act-done", onClick: function () { props.onDone(task); } }, h(Icon, { name: "check", size: 14 }), t.complete));
      ops.push(h("button", { key: "shut", className: "wbt-btn wbt-act-close", onClick: function () { props.update(task, { type: "STATUS", status: "1", date: today() }); } }, h(Icon, { name: "stop", size: 14 }), t.shutdownOp));
    }
    ops.push(h("button", { key: "restart", className: "wbt-btn ghost", onClick: function () { props.onRestart(task); } }, h(Icon, { name: "restart", size: 14 }), t.restart));
    ops.push(h("button", { key: "timeline", className: "wbt-btn ghost", onClick: function () { props.onTimeline(task); } }, h(Icon, { name: "timeline", size: 14 }), t.timeline));
    if (props.onDelete) {
      ops.push(h("button", {
        key: "del", className: "wbt-icon wbt-danger", title: t.del, "aria-label": t.del,
        onClick: function () { props.onDelete(task); },
      }, h(Icon, { name: "trash", size: 14 })));
    }

    var titleNode = h("div", { className: "wbt-title" }, h(Highlight, { text: task.title, keyword: props.keyword }));

    var descNode = bodySection(t.desc, task.description, descMode, false);
    var reviewNode = bodySection(t.review, task.review, reviewMode, true);


    // 信息层级：标题 → 标签/时间/路径（元信息区）→ [卡片] 操作按钮 → 描述 → 复核。
    // 列表态操作按钮仍在标题行右侧；两种形态共用同一套节点，避免两套布局再次跑偏。
    var line1 = h("div", { className: "wbt-line1" },
      openLike
        ? h("span", { className: "wbt-prio " + pClass(task.priority), children: "P" + task.priority })
        : h("span", { className: "wbt-prio low", title: t.priority + " 0", children: "—" }),
      h("span", { className: "wbt-badge " + st.cls, children: stName }),
      titleNode
    );
    var opsNode = h("div", { className: cx("wbt-ops", props.card && "wbt-ops-block"), key: "ops" }, ops);
    var tagBlock = tagNodes.length ? h("div", { className: "wbt-tags", key: "tags" }, tagNodes) : null;
    // 工作区 chip：目录只是保存的绝对路径，无目录时只显示标题，完整路径放 title。
    var wsList = Array.isArray(task.workspaces) ? task.workspaces : [];
    var wsBlock = wsList.length
      ? h("div", { className: "wbt-wschips", key: "workspaces" }, wsList.map(function (w) {
          return h("span", { className: "wbt-wschip wbt-wschip-ro", key: String(w.id), title: w.dir || "" }, (w.dir ? "" : "◦ ") + (w.title || w.id));
        }))
      : null;
    var metaBlock = meta.length ? h("div", { className: "wbt-foot", key: "meta" }, h("div", { className: "wbt-meta" }, meta)) : null;
    var pathBlock = (task.path && task.path.length) ? h("div", { className: "wbt-taskpath", key: "path" }, h(PathCrumbs, { path: task.path, t: t, onPick: props.onPathPick })) : null;
    var metaZone = (tagBlock || wsBlock || metaBlock || pathBlock)
      ? h("div", { className: "wbt-metazone", key: "metazone" }, tagBlock, wsBlock, metaBlock, pathBlock)
      : null;

    return h("div", { className: cx("wbt-item", props.card && "wbt-card", String(task.status) === "1" && "closed") },
      props.selectionMode ? h("input", { type: "checkbox", className: "wbt-check", checked: !!props.checked, onChange: function () { props.onCheck(task.id); } }) : null,
      h("div", { className: "wbt-main" },
        h("div", { className: "wbt-chead" }, line1, props.card ? null : opsNode),
        metaZone,
        props.card ? opsNode : null,
        descNode,
        reviewNode
      )
    );
  }

  return TaskItem;
};
