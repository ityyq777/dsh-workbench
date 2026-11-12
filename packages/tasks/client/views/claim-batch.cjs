"use strict";
/** 批量接取：把 claimBatch 回执整理成「成功 id + 提示文案」，视图只更新选中态与列表。 */
module.exports = function claimBatch(api, ids, t) {
  return api.call("tasks.claimBatch", { ids: ids }).then(function (r) {
    var d = r && r.result ? r.result : r;
    if (!d) return { ok: [], message: "claim failed" };
    var ok = (d.claimed || []).map(function (x) { return String(x.id); });
    var c = d.counts || {};
    var already = Number(c.alreadyClaimed || 0), notClaimable = Number(c.notClaimable || 0);
    var missing = Number(c.notFound || 0) + Number(c.deleted || 0), busy = Number(c.busy || 0);
    if (!already && !notClaimable && !missing && !busy) return { ok: ok, message: t.claimedCount.replace("{n}", String(ok.length)) };
    return { ok: ok, message: t.claimSummary
      .replace("{ok}", String(ok.length))
      .replace("{fail}", String(already + notClaimable + missing + busy))
      .replace("{already}", String(already))
      .replace("{notClaimable}", String(notClaimable))
      .replace("{missing}", String(missing)) };
  }).catch(function (e) { return { ok: [], message: (e && e.message) || "claim failed" }; });
};

/** 组合视图里的批量接取动作：成功项取消勾选，全部成功后退出选择模式。 */
module.exports.makeClaimSelected = function makeClaimSelected(d) {
  return function claimSelected() {
    var ids = d.ids();
    if (!ids.length) return;
    module.exports(d.api, ids, d.t).then(function (r) {
      var done = new Set(r.ok);
      var left = new Set(ids.filter(function (id) { return !done.has(String(id)); }));
      d.setIds(left);
      d.refreshList();
      d.refreshTagNav();
      if (!left.size) d.clear();
      d.say(r.message);
    });
  };
};
