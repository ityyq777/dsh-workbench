// Association is supplied by the entity projection, never inferred from member count.
"use strict";
module.exports = function timelineMembers(api, task) {
  if (task.timelineId == null || task.timelineId === "") return Promise.resolve([]);
  return api.call("tasks.timeline", { timelineId: String(task.timelineId) }).then(function (r) {
    if (!r || !r.ok) throw new Error(r && r.error || "load failed");
    return Array.isArray(r.result) ? r.result : r.result.records || [];
  });
};
