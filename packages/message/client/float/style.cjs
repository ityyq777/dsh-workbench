"use strict";
/**
 * 全局消息悬浮按钮的样式。
 *
 * 颜色优先取 DSH 应用外壳的原生浮层 token（`--dsw-alias-button-floating-fill`、
 * `--dsw-alias-label-primary`、`--dsw-alias-border-l2`、`--dsw-alias-state-error-primary`），
 * 只有在工作台插件页之外拿不到这些 token 时才退回 `--wb-*`，最后才是中性兜底——
 * 这样按钮在深色壁纸、浅色、自定义主题下都跟着应用走，不会出现白块。
 *
 * 容器缩成 (0,0) 处的零尺寸定位点（`left/top:0;width/height:0`），不能用 `inset:0`
 * 铺满全屏：宿主浮层容器对直接子元素写了 `.overlayLayer>*{pointer-events:auto}`，
 * 与 `.wbm-float-root{pointer-events:none}` 同权重，样式注入顺序一变就会接管整页点击。
 * 零尺寸容器即使被宿主规则改成 auto 也没有可命中的面积，按钮靠绝对定位溢出继续可点。
 * 按钮自身再写内联 `pointer-events:auto`，双重保证。
 *
 * 位置不再由 CSS 写死 right/bottom：按钮的 left/top 由 javascript 按归一化坐标算成像素，
 * 自由拖拽、贴边半隐、窗口缩放都只是改这两个值。首次定位后才打开 left/top 过渡，
 * 避免挂载瞬间从 (0,0) 滑到目标位置。
 * z-index 860：高于弹幕层（780）、低于弹窗（900），浮在内容之上但不盖对话框。
 * 选择器写成 `.wbm-float-root .wbm-float-btn`：外壳对 `button` 有全局圆角规则，
 * 单类选择器会被压成圆角方块，这里提高一级确保仍是圆形。
 */
module.exports = function floatStyles() {
  return [
    ".wbm-float-root{position:fixed;left:0;top:0;width:0;height:0;z-index:860;pointer-events:none;-webkit-app-region:no-drag}",
    ".wbm-float-root .wbm-float-btn{position:absolute;left:0;top:0;right:auto;bottom:auto;display:inline-flex;align-items:center;justify-content:center;",
    "box-sizing:border-box;width:46px;height:46px;padding:0;flex:0 0 auto;border-radius:50%;",
    "--wbm-float-bg:var(--dsw-alias-button-floating-fill,var(--wb-card,#2c2c2e));",
    "--wbm-float-ink:var(--dsw-alias-label-primary,var(--wb-muted,currentColor));",
    "--wbm-float-line:var(--dsw-alias-border-l2,var(--wb-border,rgba(255,255,255,.14)));",
    "--wbm-float-danger:var(--dsw-alias-state-error-primary,var(--wb-danger,#dc2626));",
    "border:1px solid var(--wbm-float-line);background:var(--wbm-float-bg);color:var(--wbm-float-ink);",
    "cursor:grab;pointer-events:auto;-webkit-app-region:no-drag;overflow:visible;",
    // 触屏拖动时不要被页面滚动抢走指针，文字也不要被选中。
    "touch-action:none;-webkit-user-select:none;user-select:none;",
    "box-shadow:0 8px 22px rgba(0,0,0,.24),0 1px 3px rgba(0,0,0,.18);",
    "transition:transform .18s ease,box-shadow .18s ease,background .18s ease,border-color .18s ease}",
    // 首次定位完成后才允许 left/top 过渡（挂载瞬间不要从左上角滑过来）。
    ".wbm-float-root .wbm-float-btn[data-ready]{transition:left .18s ease,top .18s ease,transform .18s ease,",
    "box-shadow .18s ease,background .18s ease,border-color .18s ease}",
    // 拖拽中必须跟手：关掉过渡，hover 的位移也一并取消。
    ".wbm-float-root .wbm-float-btn[data-dragging=1]{cursor:grabbing;transition:none}",
    ".wbm-float-root .wbm-float-btn[data-dragging=1]:hover{transform:none;",
    "box-shadow:0 8px 22px rgba(0,0,0,.24),0 1px 3px rgba(0,0,0,.18)}",
    ".wbm-float-root .wbm-float-btn:hover{transform:translateY(-1px);box-shadow:0 12px 26px rgba(0,0,0,.28),0 1px 3px rgba(0,0,0,.2);",
    "background:var(--dsw-alias-button-floating-hover,var(--wbm-float-bg))}",
    ".wbm-float-root .wbm-float-btn:active{transform:translateY(0)}",
    ".wbm-float-root .wbm-float-btn:focus-visible{outline:2px solid var(--dsw-alias-brand-primary,var(--wb-accent,#2563eb));outline-offset:2px}",
    ".wbm-float-root .wbm-float-btn svg{display:block;width:21px;height:21px;flex:0 0 auto}",
    ".wbm-float-root .wbm-float-badge{position:absolute;top:-5px;right:-5px;min-width:18px;height:18px;padding:0 5px;",
    "box-sizing:border-box;border-radius:999px;display:none;align-items:center;justify-content:center;",
    "background:var(--wbm-float-danger,#dc2626);color:var(--dsw-alias-label-on-color,#fff);",
    "font-size:11px;font-weight:650;line-height:1;font-variant-numeric:tabular-nums;",
    "box-shadow:0 0 0 2px var(--wbm-float-bg)}",
    ".wbm-float-root .wbm-float-btn[data-unread] .wbm-float-badge{display:inline-flex}",
    // 半隐藏时角标会有一半在视口外，直接收起角标；来新消息会先临时展开再显示。
    ".wbm-float-root .wbm-float-btn[data-collapsed=1] .wbm-float-badge{display:none}",
    ".wbm-float-root .wbm-float-btn[data-pulse=1]{animation:wbm-float-bounce .6s cubic-bezier(.34,1.56,.64,1)}",
    "@keyframes wbm-float-bounce{0%{transform:translateY(0)}35%{transform:translateY(-7px)}70%{transform:translateY(0)}100%{transform:translateY(0)}}",
    "@media (max-width:640px){.wbm-float-root .wbm-float-btn{width:40px;height:40px}",
    ".wbm-float-root .wbm-float-btn svg{width:18px;height:18px}}",
    // 降低动态偏好：不做位移，只让描边闪一次颜色。
    "@media (prefers-reduced-motion: reduce){.wbm-float-root .wbm-float-btn[data-pulse=1]{animation:none;",
    "border-color:var(--dsw-alias-brand-primary,var(--wb-accent,#2563eb))}",
    ".wbm-float-root .wbm-float-btn{transition:none}}",
  ];
};
