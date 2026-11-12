"use strict";
/** 选择模式底部操作条：只渲染按钮，动作由视图注入，避免视图继续膨胀。 */
module.exports = function renderSelectionBar(h, Icon, p) {
  var t = p.t;
  return h("div", { className: "wbt-selbar" },
    h("b", null, t.selected + " " + p.count),
    h("button", { className: "wbt-btn", onClick: p.openSelected }, t.selectedTasks),
    h("button", { className: "wbt-btn", onClick: p.batchTimeline }, t.batchTimeline),
    h("button", { className: "wbt-btn", onClick: p.batchMigrate }, t.batchMigrate),
    h("button", { className: "wbt-btn", onClick: p.claimSelected }, t.claimSelected),
    h("button", { className: "wbt-btn wbt-act-del", onClick: p.batchDelete }, h(Icon, { name: "trash", size: 13 }), t.batchDelete),
    h("button", { className: "wbt-btn ghost", onClick: p.clear }, t.clear));
};
