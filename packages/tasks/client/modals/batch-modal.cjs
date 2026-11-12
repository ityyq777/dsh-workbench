// Batch dialog extracted to keep the registration entry below its line budget.
"use strict";
module.exports = function (React, cx, Icon) {
  var TimelinePicker = require("../timeline/timeline-controls.cjs")(React).Picker;
  var h = React.createElement, Picker = require("./table-picker.cjs")(React);
  function BatchModal(props) {
    var t = props.t, tr = require("../timeline/timeline-copy.cjs")(props.t);
    var items = props.items || [];
    var mode = props.mode;
    var trigger = React.useRef(typeof document === "undefined" ? null : document.activeElement);
    React.useEffect(function () { return function () { if (trigger.current) trigger.current.focus(); }; }, []);
    var s = React.useState("");
    var value = s[0], setValue = s[1];
    var busy = React.useState(false);
    var isBusy = busy[0], setBusy = busy[1];
    var err = React.useState("");
    var error = err[0], setError = err[1];

    return h("div", { className: "wbt-modal-mask", onMouseDown: function (e) { if (e.target === e.currentTarget) props.onClose(); } },
      h("div", { className: "wbt-modal batch" },
        h("div", { className: "wbt-modal-head" },
          h("h3", null, mode === "timeline" ? t.batchTimeline : t.batchMigrate),
          h("span", { className: "wbt-badge" }, t.batchCount + " " + items.length),
          h("button", { className: "wbt-icon", onClick: props.onClose }, "×")
        ),
        h("div", { className: "wbt-mhint" }, mode === "timeline" ? tr("选择已有时间线（含空线和单成员线）") : t.chooseTable),
        mode === "migrate" ? h(Picker, { tree: props.tree, value: value, onChange: setValue, onClose: props.onClose }) : h(TimelinePicker, { api: props.api, t: t, value: value, onChange: setValue, disabled: isBusy }),
        error ? h("div", { className: "wbt-err" }, error) : null,
        h("div", { className: "wbt-modal-foot" },
          h("button", { className: "wbt-btn ghost", onClick: props.onClose }, t.cancel),
          h("button", { className: "wbt-btn primary", disabled: isBusy || !value || (mode === "migrate" && !require("./ownership.cjs").tables(props.tree).some(function (n) { return n.id === value; })), onClick: function () {
            if (!value) { setError(mode === "timeline" ? t.needBase : t.needTable); return; }
            setBusy(true);
            if (mode === "timeline") {
              props.api.call("tasks.timelineRefactor", { ids: items.map(function (x) { return x.id; }), timelineId: value }).then(function (r) {
                setBusy(false);
                if (r && r.ok) props.onDone();
                else setError((r && r.error) || "failed");
              });
            } else {
              props.api.call("tasks.migrate", { ids: items.map(function (x) { return x.id; }), tableId: value }).then(function (r) {
                setBusy(false);
                if (r && r.ok) props.onDone();
                else setError((r && r.error) || "failed");
              });
            }
          } }, isBusy ? "…" : t.confirm)
        )
      )
    );
  }

  return BatchModal;
};
