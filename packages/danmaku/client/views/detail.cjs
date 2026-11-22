"use strict";
var GLYPHS = require("../ui/icons.cjs").ICONS;

/**
 * 弹幕详情面板：单条弹幕自己的内容、外观、动效与轮播参数。
 * 由 library.cjs 调用，props 里带当前草稿与写回函数，本文件不直接访问 api。
 */
var React = require("react");
var h = React.createElement;
var chipStyle = require("../overlay/chip-style.cjs");
var createOverlay = require("../../../lib/overlay.cjs");
// 布尔项统一走共享开关控件（lib/switch.cjs），不再自绘 track/knob。
var SW = require("../../../lib/switch.cjs");
// 数字项统一走共享数字输入控件（lib/number-field.cjs）：范围只提示，非法红字且不写回草稿。
var NF = require("../../../lib/number-field.cjs");

var REDUCED = false;
try {
  REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
} catch (error) {
  REDUCED = false;
}

var TONES = ["normal", "accent", "success", "warn", "danger"];

var ICONS = {
  x: GLYPHS["x"],
  eye: GLYPHS["eye"],
};

function glyph(Icon, size) {
  return h(Icon, { size: size || 14, strokeWidth: 1.8, "aria-hidden": "true" });
}

function numberOrText(value) {
  return value === null || value === undefined ? "" : String(value);
}

/**
 * 预览舞台：用当前草稿参数实时画一个和真实弹幕同构的气泡。
 * 不写库、不发屏，纯本地演示；参数一变就重建并重新起播。
 */
function PreviewStage(props) {
  var stageRef = React.useRef(null);
  var detail = props.detail;
  var hint = props.hint;
  var placeholder = props.placeholder || "";

  React.useEffect(
    function () {
      var stage = stageRef.current;
      if (!stage) return undefined;
      stage.innerHTML = "";
      var made = chipStyle.buildChip(
        stage.ownerDocument,
        {
          body: detail.body || placeholder,
          tone: detail.tone,
          card: detail.card,
          prefix: detail.prefix,
          fontSize: detail.fontSize,
          speed: detail.speed,
          opacity: detail.opacity,
          weight: detail.fontWeight,
          family: detail.fontFamily,
        },
        { fontSize: 15, opacity: 0.92, speed: 150 },
      );
      var chip = made.el;
      chip.style.position = "absolute";
      chip.style.left = "0";
      chip.style.top = "50%";
      chip.style.willChange = "transform";
      stage.appendChild(chip);

      var stageW = stage.clientWidth || 520;
      var chipW = chip.offsetWidth || 120;
      if (REDUCED) {
        chip.style.transform = "translate3d(" + Math.round((stageW - chipW) / 2) + "px,-50%,0)";
        return undefined;
      }
      var speed = made.style.speed;
      var anim = chip.animate(
        [
          { transform: "translate3d(" + stageW + "px,-50%,0)" },
          { transform: "translate3d(" + -(chipW + 10) + "px,-50%,0)" },
        ],
        { duration: Math.max(1400, ((stageW + chipW) / speed) * 1000), easing: "linear", iterations: Infinity },
      );
      return function () {
        anim.cancel();
      };
    },
    [
      placeholder,
      detail.body,
      detail.tone,
      detail.card,
      detail.prefix,
      detail.fontSize,
      detail.speed,
      detail.opacity,
      detail.fontWeight,
      detail.fontFamily,
    ],
  );

  return h(
    "div",
    { className: "wbdm-preview" },
    h("div", { className: "wbdm-preview-stage", ref: stageRef }),
    h("div", { className: "wbdm-preview-hint" }, hint),
  );
}

// 详情面板外壳：遮罩点击、Esc、Tab 循环与关闭后的焦点归还统一走 lib/overlay。
var DetailOverlay = createOverlay({
  maskClass: "wbdm-modal",
  dialogClass: "wbdm-modal-card",
  ariaLabelOf: function (props) {
    return props["aria-label"];
  },
});

module.exports = function renderDetail(props) {
  var C = props.C;
  var detail = props.detail;
  var patch = props.patch;
  var busy = props.busy;
  var mode = props.mode === "create" ? "create" : "edit";
  var title = mode === "create" ? C.createTitle : C.detailTitle;
  var subtitle = mode === "create" ? C.createHint : C.detailHint;
  var saveLabel = mode === "create" ? C.createSave : C.saveDetail;

  function set(key, value) {
    var next = {};
    next[key] = value;
    patch(next);
  }

  function toneChip(name) {
    return h(
      "button",
      {
        key: name,
        type: "button",
        className: "wbdm-tone-chip" + (detail.tone === name ? " on" : ""),
        onClick: function () {
          set("tone", name);
        },
      },
      h("span", { className: "wbdm-dot " + name }),
      C.tones[name],
    );
  }

  /**
   * 数字项：min/max/step 只转成提示文字，不交给控件做输入期夹取；
   * 空串表示跟随全局，所以允许留空。
   */
  function numField(key, label, hint, step, min, max) {
    // 行左右两处各给一句：左侧标签下是单位/跟随全局，输入框下是范围与步长。
    var showHint = min + "–" + max + (step === 1 ? "，整数" : "，步长 " + step);
    return h(
      "label",
      { className: "wbdm-crow" },
      h(
        "span",
        { className: "wbdm-crow-label" },
        h("span", { className: "wbdm-crow-t" }, label),
        h("span", { className: "wbdm-crow-h" }, hint),
      ),
      h(NF.NumberField, {
        h: h,
        value: numberOrText(detail[key]),
        min: min,
        max: max,
        integer: Math.round(step) === step,
        allowEmpty: true,
        ariaLabel: label,
        placeholder: C.followGlobal,
        hint: showHint,
        onCommit: function (next) {
          set(key, next === null ? "" : String(next));
        },
      }),
    );
  }

  function selectField(key, label, options, hint) {
    return h(
      "label",
      { className: "wbdm-crow" },
      h(
        "span",
        { className: "wbdm-crow-label" },
        h("span", { className: "wbdm-crow-t" }, label),
        hint ? h("span", { className: "wbdm-crow-h" }, hint) : null,
      ),
      h(
        "select",
        {
          className: "wbdm-select",
          value: detail[key],
          onChange: function (e) {
            set(key, e.target.value);
          },
        },
        options.map(function (option) {
          return h("option", { key: option.value, value: option.value }, option.label);
        }),
      ),
    );
  }

  function switchField(key, label) {
    return h(
      "div",
      { className: "wbdm-crow" },
      h("span", { className: "wbdm-crow-label" }, h("span", { className: "wbdm-crow-t" }, label)),
      // 共享开关自带 role="switch"/aria-checked；左侧已有文案，这里不再重复显示状态。
      h(SW.Switch, {
        h: h,
        checked: Boolean(detail[key]),
        ariaLabel: label,
        onChange: function (next) {
          set(key, next);
        },
      }),
    );
  }

  var weights = [{ value: "", label: C.followGlobal }];
  [400, 500, 600, 700].forEach(function (value) {
    weights.push({ value: String(value), label: C.weights[value] });
  });

  var families = Object.keys(C.families).map(function (value) {
    return { value: value, label: C.families[value] };
  });

  var bands = ["", "full", "upper", "lower"].map(function (value) {
    return { value: value, label: C.bands[value] };
  });

  var chances = [1, 2, 3, 4, 5].map(function (n) {
    return { value: String(n), label: "×" + n };
  });

  return h(
    DetailOverlay,
    { "aria-label": title, onClose: props.cancel },
      h(
        "div",
        { className: "wbdm-modal-h" },
        h(
          "div",
          null,
          h("div", { className: "wbdm-modal-t" }, title),
          h("div", { className: "wbdm-modal-s" }, subtitle),
        ),
        h(
          "button",
          {
            type: "button",
            className: "wbdm-icon-btn",
            title: C.cancel,
            "aria-label": C.cancel,
            onClick: props.cancel,
          },
          glyph(ICONS.x, 15),
        ),
      ),
      h(PreviewStage, { detail: detail, hint: C.previewStage, placeholder: C.previewPlaceholder }),
      h(
        "div",
        { className: "wbdm-modal-body" },
        h(
          "section",
          { className: "wbdm-section" },
          h("div", { className: "wbdm-section-t" }, C.sectionContent),
          h("textarea", {
            className: "wbdm-textarea",
            value: detail.body,
            maxLength: 100,
            rows: 2,
            onChange: function (e) {
              set("body", e.target.value);
            },
          }),
          h("div", { className: "wbdm-counter" }, String(detail.body.length) + "/100"),
        ),
        h(
          "section",
          { className: "wbdm-section" },
          h("div", { className: "wbdm-section-t" }, C.sectionLook),
          h(
            "div",
            { className: "wbdm-crow" },
            h("span", { className: "wbdm-crow-label" }, h("span", { className: "wbdm-crow-t" }, C.tone)),
            h("div", { className: "wbdm-tones" }, TONES.map(toneChip)),
          ),
          h(
            "div",
            { className: "wbdm-crow" },
            h(
              "span",
              { className: "wbdm-crow-label" },
              h("span", { className: "wbdm-crow-t" }, C.card),
              h("span", { className: "wbdm-crow-h" }, C.cardHint),
            ),
            h(SW.Switch, {
              h: h,
              checked: Boolean(detail.card),
              ariaLabel: C.card,
              onChange: function (next) {
                set("card", next);
              },
            }),
          ),
          numField("fontSize", C.fontSize, C.unitPx + " · " + C.followGlobal, 1, 10, 48),
          selectField("fontWeight", C.weight, weights),
          selectField("fontFamily", C.family, families),
          numField("opacity", C.opacity, C.followGlobal, 0.02, 0.15, 1),
        ),
        h(
          "section",
          { className: "wbdm-section" },
          h("div", { className: "wbdm-section-t" }, C.sectionMotion),
          numField("speed", C.speed, C.unitSpeed + " · " + C.followGlobal, 10, 30, 800),
          selectField("band", C.band, bands, C.bandHint),
        ),
        h(
          "section",
          { className: "wbdm-section" },
          h("div", { className: "wbdm-section-t" }, C.sectionRotate),
          h(
            "label",
            { className: "wbdm-crow" },
            h(
              "span",
              { className: "wbdm-crow-label" },
              h("span", { className: "wbdm-crow-t" }, C.prefix),
              h("span", { className: "wbdm-crow-h" }, C.prefixHint),
            ),
            h("input", {
              className: "wbdm-input",
              type: "text",
              value: detail.prefix,
              maxLength: 8,
              placeholder: "✨",
              onChange: function (e) {
                set("prefix", e.target.value);
              },
            }),
          ),
          selectField("chance", C.chance, chances, C.chanceHint),
          switchField("enabled", C.enable),
        ),
      ),
      h(
        "div",
        { className: "wbdm-modal-foot" },
        h(
          "button",
          {
            type: "button",
            className: "wbdm-btn ghost",
            onClick: props.cancel,
          },
          C.cancel,
        ),
        h(
          "button",
          {
            type: "button",
            className: "wbdm-btn",
            disabled: Boolean(busy),
            onClick: function () {
              props.save(true);
            },
          },
          glyph(ICONS.eye),
          C.saveAndPreview,
        ),
        h(
          "button",
          {
            type: "button",
            className: "wbdm-btn primary",
            disabled: Boolean(busy) || !detail.body.trim(),
            onClick: function () {
              props.save(false);
            },
          },
          busy ? C.saving : saveLabel,
        ),
      ),
  );
};
