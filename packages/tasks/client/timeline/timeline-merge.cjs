"use strict";
module.exports = function (React) {
  var h = React.createElement;
  return function Merge(props) {
    var t = props.t, targetS = React.useState(props.items[0].timelineKey), target = targetS[0], setTarget = targetS[1];
    var previewS = React.useState(null), preview = previewS[0], setPreview = previewS[1];
    var busyS = React.useState(false), busy = busyS[0], setBusy = busyS[1];
    var errorS = React.useState(""), error = errorS[0], setError = errorS[1];
    var pending = React.useRef(false), panel = React.useRef(null);
    function submit(dryRun) {
      if (pending.current || (!dryRun && preview === null)) return;
      pending.current = true; setBusy(true); setError("");
      // Send whole timeline keys: the member page is never a source of merge ids.
      props.api.call("tasks.timelineRefactor", { timelineKeys: props.items.map(function (x) { return x.timelineKey; }), timelineKey: target, dryRun: dryRun }).then(function (r) {
        if (!r || !r.ok) throw new Error(r && r.error || "Request failed");
        if (dryRun) setPreview(r.result); else props.onMerged();
      }).catch(function (e) { setError(String(e.message || e)); setPreview(null); }).finally(function () { pending.current = false; setBusy(false); });
    }
    function keys(e) {
      if (e.key === "Escape" && !busy) { e.stopPropagation(); props.onClose(); }
      if (e.key !== "Tab") return;
      var nodes = panel.current.querySelectorAll('button:not(:disabled),select:not(:disabled)');
      var first = nodes[0], last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
    return h("div", { className: "wbt-modal-mask" }, h("div", { ref: panel, className: "wbt-modal", role: "dialog", "aria-modal": true, "aria-label": t.timelineMerge, onKeyDown: keys },
      h("h3", null, t.timelineMerge),
      h("p", null, t.timelineMergeHint),
      h("label", { className: "wbt-field" }, h("span", null, t.timelineTarget),
        h("select", { className: "wbt-input", autoFocus: true, disabled: busy, value: target, onChange: function (e) { setTarget(e.target.value); setPreview(null); } }, props.items.map(function (x) { return h("option", { key: x.timelineKey, value: x.timelineKey }, x.title || x.timelineKey); }))),
      preview !== null ? h("p", { role: "status" }, t.timelinePreviewCount.replace("{n}", preview.wouldUpdate)) : null,
      error ? h("p", { role: "alert", className: "wbt-err" }, t.error + error) : null,
      h("div", { className: "wbt-modal-foot" },
        h("button", { className: "wbt-btn", disabled: busy, onClick: props.onClose }, t.cancel),
        h("button", { className: "wbt-btn primary", disabled: busy, onClick: function () { submit(preview === null); } }, busy ? t.loading : preview === null ? t.timelinePreview : t.timelineConfirm))));
  };
};
