"use strict";
var GLYPHS = require("../ui/icons.cjs").ICONS;

/**
 * 弹幕库视图：清单、快速添加，以及每条弹幕自己的详情面板（内容/外观/动效/轮播）。
 * 版式与其他插件对齐：hero + 指标卡，下面是「添加」和「清单」两张卡片。
 */
var React = require("react");
var h = React.createElement;
var copy = require("../copy.cjs");
// 布尔项统一走共享开关控件（lib/switch.cjs）。
var SW = require("../../../lib/switch.cjs");

var TONES = ["normal", "accent", "success", "warn", "danger"];
var MAX_LEN = 100;

var ICONS = {
  up: GLYPHS["arrow-up"],
  down: GLYPHS["arrow-down"],
  eye: GLYPHS["eye"],
  trash: GLYPHS["trash-2"],
  check: GLYPHS["check"],
  x: GLYPHS["x"],
  plus: GLYPHS["plus"],
  pencil: GLYPHS["pencil"],
  megaphone: GLYPHS["megaphone"],
};

function glyph(Icon, size) {
  return h(Icon, { size: size || 14, strokeWidth: 1.8, "aria-hidden": "true" });
}

function unwrap(r) {
  return r && r.result !== undefined ? r.result : r;
}

function errText(e, fallback) {
  return String((e && e.message) || e || fallback);
}

function payloadOf(r) {
  if (!r) throw new Error("empty response");
  if (r.ok === false) throw new Error(r.error || "request failed");
  return unwrap(r);
}

function numberOrNull(raw) {
  if (raw === "" || raw === null || raw === undefined) return null;
  var n = Number(raw);
  return isFinite(n) ? n : null;
}

function detailOf(item) {
  return {
    id: item.id,
    body: item.body,
    tone: item.tone || "normal",
    card: item.card !== false,
    enabled: item.enabled !== false,
    fontSize: item.fontSize === null || item.fontSize === undefined ? "" : String(item.fontSize),
    speed: item.speed === null || item.speed === undefined ? "" : String(item.speed),
    opacity: item.opacity === null || item.opacity === undefined ? "" : String(item.opacity),
    fontWeight: item.fontWeight === null || item.fontWeight === undefined ? "" : String(item.fontWeight),
    fontFamily: item.fontFamily || "",
    band: item.band || "",
    prefix: item.prefix || "",
    chance: String(item.chance || 1),
  };
}

function LibraryView(props) {
  var api = props.api;
  var lang = props.lang;
  var C = copy.pick(lang);

  var listS = React.useState({ loading: true, error: "", items: [], total: 0, paused: 0 });
  var list = listS[0];
  var setList = listS[1];

  var createS = React.useState(null);
  var creating = createS[0];
  var setCreating = createS[1];

  var busyS = React.useState("");
  var busy = busyS[0];
  var setBusy = busyS[1];

  var detailS = React.useState(null);
  var detail = detailS[0];
  var setDetail = detailS[1];

  var sayS = React.useState("");
  var say = sayS[0];
  var setSay = sayS[1];

  var aliveRef = React.useRef(true);

  function notify(text) {
    setSay(text);
    window.setTimeout(function () {
      if (aliveRef.current) setSay("");
    }, 2400);
  }

  var refresh = React.useCallback(function () {
    return api
      .call("danmaku.list", {})
      .then(payloadOf)
      .then(function (body) {
        if (!aliveRef.current) return;
        setList({
          loading: false,
          error: "",
          items: (body && body.items) || [],
          total: (body && body.total) || 0,
          paused: (body && body.paused) || 0,
        });
      })
      .catch(function (e) {
        if (!aliveRef.current) return;
        setList(function (prev) {
          return Object.assign({}, prev, { loading: false, error: errText(e, C.loadFail) });
        });
      });
  }, [api]);

  React.useEffect(function () {
    aliveRef.current = true;
    refresh();
    var off = null;
    if (api && typeof api.subscribe === "function") {
      off = api.subscribe(function (message) {
        if (message && message.domainId === "wb-addon-danmaku") refresh();
      });
    }
    return function () {
      aliveRef.current = false;
      if (typeof off === "function") off();
    };
  }, [refresh]);

  function act(name, args, after) {
    setBusy(name);
    return api
      .call("danmaku." + name, args || {})
      .then(payloadOf)
      .then(function (body) {
        if (typeof after === "function") after(body);
        return refresh();
      })
      .catch(function (e) {
        notify(errText(e, C.loadFail));
      })
      .then(function () {
        if (aliveRef.current) setBusy("");
      });
  }

  function toggle(item) {
    act("update", { id: item.id, enabled: !item.enabled });
  }

  function toggleCard(item) {
    act("update", { id: item.id, card: !item.card });
  }

  function preview(item) {
    act("preview", { id: item.id });
  }

  function remove(item) {
    if (!window.confirm(C.confirmRemove)) return;
    act("remove", { id: item.id }, function () {
      notify(C.removed);
    });
  }

  function move(index, delta) {
    var items = list.items.slice();
    var target = index + delta;
    if (target < 0 || target >= items.length) return;
    var moved = items.splice(index, 1)[0];
    items.splice(target, 0, moved);
    setList(Object.assign({}, list, { items: items }));
    act("reorder", {
      ids: items.map(function (item) {
        return item.id;
      }),
    });
  }

  function defaultDraft() {
    return {
      id: "",
      body: "",
      tone: "normal",
      card: false,
      enabled: true,
      fontSize: "",
      speed: "",
      opacity: "",
      fontWeight: "",
      fontFamily: "",
      band: "",
      prefix: "",
      chance: "1",
    };
  }

  function openCreate() {
    setCreating(defaultDraft());
  }

  function patchCreating(patch) {
    setCreating(function (prev) {
      return Object.assign({}, prev, patch);
    });
  }

  function createArgs() {
    var d = creating;
    return {
      body: d.body.trim(),
      tone: d.tone,
      card: Boolean(d.card),
      enabled: Boolean(d.enabled),
      fontSize: numberOrNull(d.fontSize),
      speed: numberOrNull(d.speed),
      opacity: numberOrNull(d.opacity),
      fontWeight: numberOrNull(d.fontWeight),
      fontFamily: d.fontFamily,
      band: d.band,
      prefix: d.prefix,
      chance: numberOrNull(d.chance) || 1,
    };
  }

  function submitCreate(thenPreview) {
    if (!creating || !creating.body.trim()) return;
    act("create", createArgs(), function (result) {
      setCreating(null);
      notify(C.added);
      if (thenPreview && result && result.item && result.item.id) {
        act("preview", { id: result.item.id });
      }
    });
  }

  function openDetail(item) {
    setDetail(detailOf(item));
  }

  function patchDetail(patch) {
    setDetail(function (prev) {
      return Object.assign({}, prev, patch);
    });
  }

  function detailArgs() {
    return {
      id: detail.id,
      body: detail.body.trim(),
      tone: detail.tone,
      card: Boolean(detail.card),
      enabled: Boolean(detail.enabled),
      fontSize: numberOrNull(detail.fontSize),
      speed: numberOrNull(detail.speed),
      opacity: numberOrNull(detail.opacity),
      fontWeight: numberOrNull(detail.fontWeight),
      fontFamily: detail.fontFamily,
      band: detail.band,
      prefix: detail.prefix,
      chance: numberOrNull(detail.chance) || 1,
    };
  }

  function saveDetail(thenPreview) {
    if (!detail || !detail.body.trim()) return;
    act("update", detailArgs(), function () {
      var id = detail.id;
      setDetail(null);
      notify(C.saved);
      if (thenPreview) act("preview", { id: id });
    });
  }

  var empty = h(
    "div",
    { className: "wbdm-empty-card" },
    h("span", { className: "wbdm-empty-icon" }, glyph(ICONS.megaphone, 17)),
    h("div", null, C.empty),
    h("div", null, C.addPlaceholder),
  );

  var rows = list.items.map(function (item, index) {
    var ops = [
      h(
        "button",
        {
          key: "up",
          type: "button",
          className: "wbdm-icon-btn",
          title: C.moveUp,
          "aria-label": C.moveUp,
          disabled: index === 0,
          onClick: function () {
            move(index, -1);
          },
        },
        glyph(ICONS.up),
      ),
      h(
        "button",
        {
          key: "down",
          type: "button",
          className: "wbdm-icon-btn",
          title: C.moveDown,
          "aria-label": C.moveDown,
          disabled: index === list.items.length - 1,
          onClick: function () {
            move(index, 1);
          },
        },
        glyph(ICONS.down),
      ),
      h(
        "button",
        {
          key: "eye",
          type: "button",
          className: "wbdm-icon-btn",
          title: C.preview,
          "aria-label": C.preview,
          onClick: function () {
            preview(item);
          },
        },
        glyph(ICONS.eye),
      ),
      h(
        "button",
        {
          key: "edit",
          type: "button",
          className: "wbdm-icon-btn",
          title: C.detailTitle,
          "aria-label": C.detailTitle,
          onClick: function () {
            openDetail(item);
          },
        },
        glyph(ICONS.pencil),
      ),
      h(
        "button",
        {
          key: "del",
          type: "button",
          className: "wbdm-icon-btn danger",
          title: C.remove,
          "aria-label": C.remove,
          onClick: function () {
            remove(item);
          },
        },
        glyph(ICONS.trash),
      ),
    ];

    var meta = [];
    if (item.fontSize) meta.push(item.fontSize + C.unitPx);
    if (item.speed) meta.push(item.speed + C.unitSpeed);
    if (item.chance > 1) meta.push("×" + item.chance);

    return h(
      "div",
      { key: item.id, className: "wbdm-item" + (item.enabled ? "" : " off") },
      h("span", { className: "wbdm-order" }, String(index + 1)),
      h(SW.Switch, {
        h: h,
        checked: Boolean(item.enabled),
        title: item.enabled ? C.disable : C.enable,
        // 开关的可访问名称用「启用」这个设置名；title 只作为点击后的动作提示。
        ariaLabel: C.enable,
        onChange: function () {
          toggle(item);
        },
      }),
      h(
        "span",
        { className: "wbdm-tag" },
        h("span", { className: "wbdm-dot " + (item.tone || "normal") }),
        C.tones[item.tone] || item.tone,
      ),
      h(
        "button",
        {
          type: "button",
          className: "wbdm-cardtag" + (item.card === false ? " plain" : ""),
          title: item.card === false ? C.cardOn : C.cardOff,
          onClick: function () {
            toggleCard(item);
          },
        },
        item.card === false ? C.cardOff : C.cardOn,
      ),
      h(
        "button",
        {
          type: "button",
          className: "wbdm-body",
          title: C.detailTitle,
          onClick: function () {
            openDetail(item);
          },
        },
        item.prefix ? item.prefix + " " : "",
        item.body,
      ),
      h("span", { className: "wbdm-meta" }, meta.join(" · ")),
      h("div", { className: "wbdm-ops" }, ops),
    );
  });

  var enabledCount = list.total - list.paused;

  var listCard = h(
    "div",
    { className: "wbdm-card" },
    h(
      "div",
      { className: "wbdm-card-h" },
      h("span", { className: "wbdm-card-t" }, C.tabs.library),
      h(
        "span",
        { className: "wbdm-card-s" },
        copy.fmt(C.stats, { total: list.total, enabled: enabledCount, paused: list.paused }),
      ),
      h(
        "button",
        {
          type: "button",
          className: "wbdm-btn primary wbdm-card-action",
          disabled: Boolean(busy),
          onClick: openCreate,
        },
        glyph(ICONS.plus, 13),
        C.add,
      ),
    ),
    list.loading
      ? h("div", { className: "wbdm-empty" }, C.loading)
      : list.error
        ? h(
            "div",
            { className: "wbdm-notice error" },
            list.error,
            " ",
            h(
              "button",
              {
                type: "button",
                className: "wbdm-link",
                onClick: function () {
                  refresh();
                },
              },
              C.retry,
            ),
          )
        : list.items.length
          ? h("div", { className: "wbdm-list" }, rows)
          : empty,
  );

  var hero = h(
    "div",
    { className: "wbdm-hero" },
    h(
      "div",
      { className: "wbdm-hero-text" },
      h("div", { className: "wbdm-page-title" }, C.title),
      h("div", { className: "wbdm-page-sub" }, C.hint),
    ),
    h(
      "div",
      { className: "wbdm-kpis" },
      kpi(C.kpiTotal, list.total, ""),
      kpi(C.kpiEnabled, enabledCount, "ok"),
      kpi(C.kpiPaused, list.paused, list.paused ? "warn" : ""),
    ),
  );

  function kpi(label, value, toneName) {
    return h(
      "div",
      { key: label, className: "wbdm-kpi" },
      h("span", { className: "wbdm-kpi-n" + (toneName ? " " + toneName : "") }, String(value)),
      h("span", { className: "wbdm-kpi-l" }, label),
    );
  }

  var sheet = detail
    ? {
        mode: "edit",
        draft: detail,
        patch: patchDetail,
        save: saveDetail,
        close: function () {
          setDetail(null);
        },
      }
    : creating
      ? {
          mode: "create",
          draft: creating,
          patch: patchCreating,
          save: submitCreate,
          close: function () {
            setCreating(null);
          },
        }
      : null;

  var modal = sheet
    ? require("./detail.cjs")({
        C: C,
        lang: lang,
        mode: sheet.mode,
        detail: sheet.draft,
        patch: sheet.patch,
        save: sheet.save,
        cancel: sheet.close,
        busy: busy,
      })
    : null;

  return h(
    "div",
    { className: "wbdm-wrap" },
    hero,
    say ? h("div", { className: "wbdm-notice ok" }, say) : null,
    listCard,
    modal,
  );
}

module.exports = LibraryView;
