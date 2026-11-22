"use strict";
var GLYPHS = require("../ui/icons.cjs").ICONS;

/**
 * 配置视图：按 danmaku.configGet 的 groups/items 动态渲染，改动立即写入；
 * 每个分组一张卡片、组内一行一个设置项；下方附桌面弹幕状态卡片。
 * useConfig 同时供数据页读取分页配置。
 */
var React = require("react");
var h = React.createElement;
var copy = require("../copy.cjs");
// 布尔项统一走共享开关控件（lib/switch.cjs）。
var SW = require("../../../lib/switch.cjs");
// 数字项统一走共享数字输入控件（范围只作提示，非法红字且不提交）。
var NF = require("../../../lib/number-field.cjs");

var DOMAIN = "danmaku";

var ICONS = {
  check: GLYPHS["check"],
  power: GLYPHS["power"],
  refresh: GLYPHS["refresh-cw"],
  monitor: GLYPHS["monitor"],
};

function glyph(Icon, size) {
  return h(Icon, { size: size || 14, strokeWidth: 1.8, "aria-hidden": "true" });
}

function unwrap(r) {
  return r && r.result !== undefined ? r.result : r;
}

function useConfig(api, fallback) {
  var stateS = React.useState({
    ready: false,
    values: Object.assign({}, fallback || {}),
    items: [],
    groups: [],
    overrides: {},
    warnings: [],
    error: "",
  });
  var state = stateS[0];
  var setState = stateS[1];

  React.useEffect(function () {
    var alive = true;
    Promise.resolve(api.call(DOMAIN + ".configGet"))
      .then(function (r) {
        if (!alive) return;
        if (r && r.ok === false) throw new Error((r && r.error) || "load failed");
        var body = unwrap(r);
        if (!body || !body.values) throw new Error("empty config");
        setState({
          ready: true,
          values: Object.assign({}, fallback || {}, body.values),
          items: body.items || [],
          groups: body.groups || [],
          overrides: body.overrides || {},
          warnings: body.warnings || [],
          error: "",
        });
      })
      .catch(function (e) {
        if (!alive) return;
        setState(function (prev) {
          return Object.assign({}, prev, { ready: true, error: String((e && e.message) || e) });
        });
      });
    return function () {
      alive = false;
    };
  }, [api]);

  function setValues(next) {
    if (!next || typeof next !== "object") return;
    setState(function (prev) {
      return Object.assign({}, prev, { values: Object.assign({}, prev.values, next) });
    });
  }

  return Object.assign({}, state, { setValues: setValues });
}

function labelOf(item, lang) {
  return lang === "en" ? item.en || item.zh || item.id : item.zh || item.en || item.id;
}

function hintOf(item, lang) {
  return lang === "en" ? item.hintEn || "" : item.hintZh || "";
}

function useDesktop(api, enabled) {
  var stateS = React.useState({ data: null, error: "" });
  var state = stateS[0];
  var setState = stateS[1];

  React.useEffect(function () {
    if (!enabled) return undefined;
    var alive = true;
    function tick() {
      Promise.resolve(api.call(DOMAIN + ".desktop", { op: "status" }))
        .then(function (r) {
          if (!alive) return;
          if (r && r.ok === false) throw new Error((r && r.error) || "status failed");
          setState({ data: unwrap(r), error: "" });
        })
        .catch(function (e) {
          if (!alive) return;
          setState({ data: null, error: String((e && e.message) || e) });
        });
    }
    tick();
    var timer = window.setInterval(tick, 4000);
    return function () {
      alive = false;
      window.clearInterval(timer);
    };
  }, [api, enabled]);

  return state;
}

function statusCell(key, value) {
  return h(
    "div",
    { className: "wbdm-status-cell", key: key },
    h("div", { className: "wbdm-status-k" }, key),
    h("div", { className: "wbdm-status-v" }, value),
  );
}

function DesktopCard(props) {
  var api = props.api;
  var lang = props.lang;
  var C = copy.pick(lang);
  var state = useDesktop(api, true);
  var busyS = React.useState("");
  var busy = busyS[0];
  var setBusy = busyS[1];
  var sayS = React.useState("");
  var say = sayS[0];
  var setSay = sayS[1];
  var data = state.data || {};

  function op(name) {
    setBusy(name);
    Promise.resolve(api.call(DOMAIN + ".desktop", { op: name }))
      .then(function (r) {
        if (r && r.ok === false) throw new Error((r && r.error) || "failed");
        setSay("");
        return unwrap(r);
      })
      .catch(function (e) {
        setSay(String((e && e.message) || e));
      })
      .then(function () {
        setBusy("");
      });
  }

  var phase = data.phase || "stopped";
  var phaseLabel = C.desktopPhase[phase] || phase;

  return h(
    "div",
    { className: "wbdm-card" },
    h(
      "div",
      { className: "wbdm-card-h" },
      h(
        "span",
        { className: "wbdm-card-t" },
        glyph(ICONS.monitor),
        " ",
        C.desktopTitle,
      ),
      h("span", { className: "wbdm-card-s" }, C.desktopHint),
    ),
    h(
      "div",
      { className: "wbdm-status" },
      statusCell(lang === "en" ? "State" : "状态", phaseLabel + (data.suppressed ? " · " + C.desktopSuppressed : "")),
      statusCell(lang === "en" ? "Protocol" : "协议", copy.fmt(C.desktopProtocol, { n: data.protocol || 1 })),
      statusCell(lang === "en" ? "Displays" : "屏幕", copy.fmt(C.desktopDisplays, { n: data.displays || 0 })),
      statusCell(
        lang === "en" ? "Theme" : "主题",
        data.themeSynced ? C.desktopTheme : C.desktopThemeMissing,
      ),
    ),
    state.error ? h("div", { className: "wbdm-notice error" }, state.error) : null,
    say ? h("div", { className: "wbdm-notice error" }, say) : null,
    h(
      "div",
      { className: "wbdm-status-actions" },
      h(
        "button",
        {
          type: "button",
          className: "wbdm-btn",
          disabled: Boolean(busy),
          onClick: function () {
            op("restart");
          },
        },
        glyph(ICONS.refresh),
        C.desktopRestart,
      ),
      h(
        "button",
        {
          type: "button",
          className: "wbdm-btn",
          disabled: Boolean(busy),
          onClick: function () {
            op("stop");
          },
        },
        C.desktopStop,
      ),
      h(
        "button",
        {
          type: "button",
          className: "wbdm-btn primary",
          disabled: Boolean(busy),
          onClick: function () {
            op("resume");
          },
        },
        glyph(ICONS.power),
        C.desktopResume,
      ),
    ),
  );
}

function ConfigView(props) {
  var api = props.api;
  var lang = props.lang;
  var t = props.t;
  var C = copy.pick(lang);
  var cfg = useConfig(api, {});

  var localS = React.useState({});
  var local = localS[0];
  var setLocal = localS[1];
  var toastS = React.useState("");
  var toast = toastS[0];
  var setToast = toastS[1];
  var seqRef = React.useRef(0);
  var aliveRef = React.useRef(true);

  React.useEffect(function () {
    aliveRef.current = true;
    return function () {
      aliveRef.current = false;
    };
  }, []);

  function values() {
    return Object.assign({}, cfg.values, local);
  }

  function toastOnce(text) {
    setToast(text);
    window.setTimeout(function () {
      if (aliveRef.current) setToast("");
    }, 2200);
  }

  function save(id, value) {
    var seq = ++seqRef.current;
    var patch = {};
    patch[id] = value;
    setLocal(function (prev) {
      return Object.assign({}, prev, patch);
    });
    Promise.resolve(api.call(DOMAIN + ".configSet", { values: patch }))
      .then(function (r) {
        if (r && r.ok === false) throw new Error((r && r.error) || C.saveFail);
        var body = unwrap(r) || {};
        if (seq !== seqRef.current) return;
        if (typeof cfg.setValues === "function") cfg.setValues(body.values);
        setLocal({});
        toastOnce(C.saved);
      })
      .catch(function (e) {
        setLocal(function (prev) {
          var next = Object.assign({}, prev);
          delete next[id];
          return next;
        });
        toastOnce(String((e && e.message) || e));
      });
  }

  function resetAll() {
    Promise.resolve(api.call(DOMAIN + ".configReset", {}))
      .then(function (r) {
        if (r && r.ok === false) throw new Error((r && r.error) || C.saveFail);
        var body = unwrap(r) || {};
        if (typeof cfg.setValues === "function") cfg.setValues(body.values);
        seqRef.current += 1;
        setLocal({});
        toastOnce(C.resetDone);
      })
      .catch(function (e) {
        toastOnce(String((e && e.message) || e));
      });
  }

  function switchControl(item, value) {
    return h(SW.Switch, {
      h: h,
      checked: value === true,
      title: labelOf(item, lang),
      ariaLabel: labelOf(item, lang),
      onChange: function (next) {
        save(item.id, next);
      },
    });
  }

  function control(item) {
    var value = values()[item.id];
    if (item.type === "bool") return switchControl(item, value);
    if (item.type === "enum") {
      return h(
        "select",
        {
          className: "wbdm-select",
          value: value === undefined ? "" : String(value),
          "aria-label": labelOf(item, lang),
          onChange: function (e) {
            var hit = (item.values || []).filter(function (option) {
              return String(option.value) === e.target.value;
            })[0];
            save(item.id, hit ? hit.value : e.target.value);
          },
        },
        (item.values || []).map(function (option) {
          return h(
            "option",
            { key: String(option.value), value: String(option.value) },
            lang === "en" ? option.en || option.zh || String(option.value) : option.zh || option.en || String(option.value),
          );
        }),
      );
    }
    if (item.type === "int" || item.type === "number") {
      // int 要求整数；number（不透明度等）允许小数，不传 step 以免 0.93 被判非法。
      return h(NF.NumberField, {
        h: h,
        lang: lang,
        value: value === undefined ? "" : value,
        min: item.min,
        max: item.max,
        integer: item.type === "int",
        ariaLabel: labelOf(item, lang),
        onCommit: function (next) {
          save(item.id, next);
        },
      });
    }
    return h("input", {
      className: "wbdm-input",
      type: "text",
      value: value === undefined ? "" : String(value),
      "aria-label": labelOf(item, lang),
      onChange: function (e) {
        save(item.id, e.target.value);
      },
    });
  }

  var head = h(
    "div",
    { className: "wbdm-hero" },
    h(
      "div",
      { className: "wbdm-hero-main" },
      h("div", { className: "wbdm-title" }, C.configTitle),
      h("div", { className: "wbdm-sub" }, C.configHint),
    ),
    h(
      "button",
      { type: "button", className: "wbdm-btn ghost", onClick: resetAll, disabled: !cfg.ready },
      C.resetAll,
    ),
  );

  if (!cfg.ready) return h("div", { className: "wbdm-wrap" }, h("div", { className: "wbdm-empty" }, C.loading));
  if (cfg.error && !cfg.items.length) {
    return h("div", { className: "wbdm-wrap" }, h("div", { className: "wbdm-notice error" }, cfg.error));
  }

  var groups = cfg.groups.length ? cfg.groups : [{ id: "all", zh: "全部", en: "All" }];
  var sections = groups.map(function (group) {
    var items = cfg.items.filter(function (item) {
      return (item.group || "all") === group.id;
    });
    if (!items.length) return null;
    return h(
      "div",
      { className: "wbdm-card", key: group.id },
      h(
        "div",
        { className: "wbdm-card-h" },
        h("span", { className: "wbdm-card-t" }, lang === "en" ? group.en || group.zh : group.zh || group.en),
        h("span", { className: "wbdm-card-s" }, String(items.length) + (lang === "en" ? " options" : " 项")),
      ),
      items.map(function (item) {
        return h(
          "div",
          { className: "wbdm-crow", key: item.id },
          h(
            "div",
            null,
            h("div", { className: "wbdm-clabel" }, labelOf(item, lang)),
            hintOf(item, lang) ? h("div", { className: "wbdm-chint" }, hintOf(item, lang)) : null,
          ),
          h("div", { className: "wbdm-ctl" }, control(item)),
        );
      }),
    );
  });

  return h(
    "div",
    { className: "wbdm-wrap" },
    head,
    toast ? h("div", { className: "wbdm-notice ok" }, toast) : null,
    cfg.warnings && cfg.warnings.length
      ? h("div", { className: "wbdm-notice warn" }, cfg.warnings.join("；"))
      : null,
    sections,
    h(DesktopCard, { api: api, lang: lang, t: t }),
  );
}

module.exports = ConfigView;
module.exports.useConfig = useConfig;
