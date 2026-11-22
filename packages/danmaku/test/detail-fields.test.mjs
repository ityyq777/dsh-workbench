// 详情面板的数字项（字号/不透明度/速度）统一走共享数字输入控件：
// 范围与步长只写成提示，不再用 type="number" 让浏览器在输入期把值夹回边界。
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import test from "node:test";

const require = createRequire(import.meta.url);
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const h = React.createElement;

const renderDetail = require("../client/views/detail.cjs");
const copy = require("../client/copy.cjs");

function render(detail) {
  return renderToStaticMarkup(
    h(renderDetail, {
      C: copy.zh,
      detail: Object.assign({ body: "测试弹幕", fontSize: "", opacity: "", speed: "" }, detail),
      patch: () => {},
      busy: false,
      mode: "edit",
    }),
  );
}

test("详情数字项：三个输入都用共享数字控件", () => {
  const html = render({});
  assert.equal((html.match(/wbctl-num-input/g) || []).length, 3, "字号/不透明度/速度各一个");
  assert.doesNotMatch(html, /type="number"/);
});

test("详情数字项：min/max/step 写成提示，空值表示跟随全局", () => {
  const html = render({});
  assert.match(html, /wbctl-num-hint">10–48，整数</, "字号提示范围与整数");
  assert.match(html, /wbctl-num-hint">0\.15–1，步长 0\.02</, "不透明度提示步长");
  assert.match(html, /wbctl-num-hint">30–800，步长 10</, "速度提示步长");
  assert.match(html, /px · 跟随全局/, "左侧标签仍显示单位与跟随全局");
  assert.equal((html.match(/placeholder="跟随全局"/g) || []).length, 3);
});

test("详情数字项：整数用数字键盘，小数用小数键盘", () => {
  const html = render({});
  assert.match(html, /aria-label="字号"[^>]*inputMode="numeric"|inputMode="numeric"[^>]*aria-label="字号"/);
  assert.match(html, /aria-label="不透明度"[^>]*inputMode="decimal"|inputMode="decimal"[^>]*aria-label="不透明度"/);
});

test("详情数字项：已填值原样回填", () => {
  const html = render({ fontSize: "20", opacity: "0.5", speed: "120" });
  for (const value of ['value="20"', 'value="0.5"', 'value="120"']) assert.ok(html.includes(value), value);
});
