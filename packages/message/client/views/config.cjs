"use strict";
/**
 * 配置视图：按 message.configGet 返回的 items/groups 动态渲染。
 * 每次改动立即写入（message.configSet），写入失败保留原值并提示；
 * 「全部恢复默认」调 message.configReset。useConfig 同时供数据页读取分页配置。
 */
var React = require("react");
var h = React.createElement;
var notifier = require("../notify/notifier.cjs");
var DOMAIN = "message";

  function unwrap(r) {
    return r && r.result !== undefined ? r.result : r;
  }

  function useConfig(api, fallback) {
    var fb = fallback || {};
    var stateS = React.useState({
      ready: false, values: Object.assign({}, fb), items: [], groups: [], overrides: {}, error: "", state: null,
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
            values: Object.assign({}, fb, body.values),
            items: body.items || [],
            groups: body.groups || [],
            overrides: body.overrides || {},
            error: "",
            state: body,
          });
        })
        .catch(function (e) {
          if (!alive) return;
          setState({ ready: true, values: Object.assign({}, fb), items: [], groups: [], overrides: {}, error: String((e && e.message) || e), state: null });
        });
      return function () { alive = false; };
    }, [api]);
    // 服务端回包是权威值：写成功后把 configSet 返回的 values 合并回视图状态。
    // 只清本地乐观值而不回填，界面会退回写入前的旧值（音量拉高又回弹的根因）。
    function setValues(next) {
      if (!next || typeof next !== "object") return;
      setState(function (prev) {
        var values = Object.assign({}, prev.values, next);
        var body = prev.state;
        if (body && typeof body === "object") body = Object.assign({}, body, { values: values });
        return Object.assign({}, prev, { values: values, state: body });
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

function ConfigView(props) {
    var api = props.api;
    var t = props.t;
    var lang = props.lang;
    var cfg = useConfig(api, {});
    var toastS = React.useState("");
    var toast = toastS[0];
    var setToast = toastS[1];
    var localS = React.useState({});
    var local = localS[0];
    var setLocal = localS[1];

    function values() {
      return Object.assign({}, cfg.values, local);
    }

    function toastOnce(message) {
      setToast(message);
      setTimeout(function () { setToast(""); }, 2000);
    }

    // 连续拖动会产生并发的 configSet：只让最后一次回包改写权威值，
    // 避免先发的旧回包把刚拖到的新值又覆盖回去。
    var seqRef = React.useRef(0);

    function dropLocal(id, value) {
      setLocal(function (prev) {
        if (!(id in prev)) return prev;
        if (JSON.stringify(prev[id]) !== JSON.stringify(value)) return prev;
        var next = Object.assign({}, prev);
        delete next[id];
        return next;
      });
    }

    function save(id, value) {
      var seq = ++seqRef.current;
      var patch = {};
      patch[id] = value;
      setLocal(function (prev) {
        var next = Object.assign({}, prev);
        next[id] = value;
        return next;
      });
      return Promise.resolve(api.call(DOMAIN + ".configSet", { values: patch }))
        .then(function (r) {
          if (r && r.ok === false) throw new Error((r && r.error) || t.loadFail);
          var body = unwrap(r) || {};
          // 更晚的写入还在路上：不回填、不清乐观值，等最新那次落地。
          if (seq !== seqRef.current) return body;
          if (typeof cfg.setValues === "function") cfg.setValues(body.values);
          setLocal({});
          toastOnce(t.saved);
          if (notifier && typeof notifier.refreshConfig === "function") notifier.refreshConfig();
          return body;
        })
        .catch(function (e) {
          dropLocal(id, value);
          toastOnce(String((e && e.message) || e));
        });
    }

    function resetAll() {
      Promise.resolve(api.call(DOMAIN + ".configReset", {}))
        .then(function (r) {
          if (r && r.ok === false) throw new Error((r && r.error) || t.loadFail);
          var body = unwrap(r) || {};
          if (typeof cfg.setValues === "function") cfg.setValues(body.values);
          seqRef.current += 1; // 重置后作废仍在路上的单条写入
          setLocal({});
          toastOnce(t.saved);
          if (notifier && typeof notifier.refreshConfig === "function") notifier.refreshConfig();
        })
        .catch(function (e) { toastOnce(String((e && e.message) || e)); });
    }

    function control(item) {
      var value = values()[item.id];
      if (item.type === "bool") {
        return h("input", {
          type: "checkbox",
          "aria-label": labelOf(item, lang),
          checked: value === true,
          onChange: function (e) { save(item.id, e.target.checked); },
        });
      }
      if (item.type === "number") {
        var pct = Math.round((Number(value) || 0) * 100);
        return h(
          "span",
          { className: "wbm-field-ctl" },
          h("input", {
            className: "wbm-range",
            type: "range",
            min: item.min === undefined ? 0 : item.min,
            max: item.max === undefined ? 1 : item.max,
            step: 0.05,
            value: Number(value) || 0,
            "aria-label": labelOf(item, lang),
            onChange: function (e) { save(item.id, Number(e.target.value)); },
          }),
          h("span", { className: "wbm-note" }, String(pct) + "%"),
        );
      }
      if (item.type === "int") {
        return h("input", {
          className: "wbm-num",
          type: "number",
          min: item.min,
          max: item.max,
          value: value === undefined ? "" : value,
          "aria-label": labelOf(item, lang),
          onChange: function (e) { save(item.id, Number(e.target.value)); },
        });
      }
      if (item.type === "time") {
        return h("input", {
          className: "wbm-time",
          type: "time",
          value: value || "",
          "aria-label": labelOf(item, lang),
          onChange: function (e) { save(item.id, e.target.value); },
        });
      }
      if (item.type === "enum") {
        return h(
          "select",
          {
            className: "wbm-select",
            value: String(value === undefined ? "" : value),
            "aria-label": labelOf(item, lang),
            onChange: function (e) {
              var hit = (item.values || []).filter(function (option) { return String(option.value) === e.target.value; })[0];
              save(item.id, hit ? hit.value : e.target.value);
            },
          },
          (item.values || []).map(function (option) {
            return h("option", { key: String(option.value), value: String(option.value) }, lang === "en" ? option.en : option.zh);
          }),
        );
      }
      if (item.type === "multi") {
        var picked = Array.isArray(value) ? value : [];
        return h(
          "span",
          { className: "wbm-multis" },
          (item.values || []).map(function (option) {
            var on = picked.indexOf(option.value) >= 0;
            return h(
              "label",
              { className: "wbm-check", key: option.value },
              h("input", {
                type: "checkbox",
                checked: on,
                onChange: function () {
                  var next = picked.slice();
                  if (on) next = next.filter(function (x) { return x !== option.value; });
                  else next.push(option.value);
                  save(item.id, next);
                },
              }),
              h("span", null, lang === "en" ? option.en : option.zh),
            );
          }),
        );
      }
      return h("input", {
        className: "wbm-input",
        type: "text",
        value: String(value === undefined ? "" : value),
        "aria-label": labelOf(item, lang),
        onChange: function (e) { save(item.id, e.target.value); },
      });
    }

    if (cfg.error) return h("div", { className: "wbm-err", role: "alert" }, h("span", null, cfg.error));
    if (!cfg.ready) return h("div", { className: "wbm-empty", role: "status", "aria-busy": "true" }, t.loading);
    if (!cfg.items.length) return h("div", { className: "wbm-empty" }, t.noData);

    var groups = cfg.groups.length ? cfg.groups : [{ id: "", zh: "", en: "" }];

    return h(
      "div",
      { className: "wbm-root wbm-config" },
      h(
        "div",
        { className: "wbm-toolbar" },
        h("span", { className: "wbm-grow" }),
        h(
          "button",
          { type: "button", className: "wbm-btn", onClick: resetAll },
          props.Icon ? h(props.Icon, { name: "reset", size: 13 }) : null,
          h("span", null, t.resetAll),
        ),
      ),
      h(
        "div",
        { className: "wbm-note" },
        t.configHint,
      ),
      groups.map(function (group) {
        var items = cfg.items.filter(function (item) { return item.group === group.id; });
        if (!items.length) return null;
        return h(
          "div",
          { className: "wbm-section", key: group.id || "all" },
          group.zh || group.en ? h("h3", null, lang === "en" ? group.en || group.zh : group.zh || group.en) : null,
          items.map(function (item) {
            return h(
              "div",
              { className: "wbm-field", key: item.id, "data-config": item.id },
              h(
                "div",
                { className: "wbm-field-main" },
                h("span", { className: "wbm-field-label" }, labelOf(item, lang)),
                hintOf(item, lang) ? h("span", { className: "wbm-field-hint" }, hintOf(item, lang)) : null,
              ),
              h(
                "div",
                { className: "wbm-field-ctl" },
                control(item),
                item.id.indexOf("sound.") === 0 && notifier && typeof notifier.preview === "function"
                  ? h(
                      "button",
                      { type: "button", className: "wbm-btn", onClick: function () { notifier.preview("info"); } },
                      props.Icon ? h(props.Icon, { name: "play", size: 12 }) : null,
                      h("span", null, t.preview),
                    )
                  : null,
              ),
            );
          }),
        );
      }),
      h("div", { className: "wbm-note" }, t.quietNote),
      h("div", { className: "wbm-note" }, t.readDaysNote),
      toast ? h("div", { className: "wbm-toast", role: "status" }, toast) : null,
    );
}

module.exports = { ConfigView: ConfigView, useConfig: useConfig, DOMAIN: DOMAIN };
