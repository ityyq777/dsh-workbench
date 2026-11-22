/**
 * 账号集合选择器的锁定态回归：集合名与账号是明文元数据，未解锁也必须能选。
 *
 * 覆盖：
 * - 锁定态照常渲染选择按钮，不出现“已锁定或未初始化，先解锁再选账号集合”的占位；
 * - 挂载即发 vault.setList（服务端该接口不要求解锁）；
 * - 保险箱没装（missing）时仍退化成说明文案；
 * - 账户表单源码里不再有「登录名」输入与必填校验（登录名统一跟随邮箱地址）。
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import { loadCjs, createReact } from "../../../../scripts/data-ui-harness.mjs";

const require = createRequire(import.meta.url);
const root = path.resolve(import.meta.dirname, "..", "..", "..", "..");
const text = (node) =>
  Array.isArray(node) ? node.map(text).join("") : node && typeof node === "object" ? text(node.children) : String(node ?? "");
const classes = (node) => {
  if (Array.isArray(node)) return node.flatMap(classes);
  if (!node || typeof node !== "object") return [];
  const own = typeof (node.props?.className) === "string" ? [node.props.className] : [];
  return own.concat(classes(node.children));
};

function mountPicker(vault) {
  const rt = createReact();
  const calls = [];
  const C = {
    call(api, name, args) {
      calls.push({ name, args });
      return Promise.resolve({ items: [{ id: "s1", name: "QQ 账号 - 1", account: "3036897074@qq.com", type: "account" }] });
    },
    errText: (e) => String((e && e.message) || e),
    Notice: () => null,
  };
  const SetPicker = loadCjs(path.join(root, "packages/addons/mail/client/ui/set-picker.cjs"), { react: rt.React });
  const tree = rt.mount(SetPicker, {
    h: rt.React.createElement,
    React: rt.React,
    C,
    api: {},
    lang: "zh",
    vault,
    value: "",
    onChange: () => {},
  });
  return { tree, calls };
}

test("锁定态：不渲染解锁占位，直接发 vault.setList", () => {
  const { tree, calls } = mountPicker("locked");
  assert.doesNotMatch(text(tree), /先解锁再选账号集合/);
  assert.ok(classes(tree).includes("wbml-picker-trigger"), "锁定态仍应渲染选择按钮");
  assert.ok(
    calls.some((c) => c.name === "vault.setList" && c.args && c.args.type === "account"),
    "锁定态应照常请求账号集合",
  );
});

test("未初始化（init）同样可读", () => {
  const { tree, calls } = mountPicker("init");
  assert.doesNotMatch(text(tree), /先解锁再选账号集合/);
  assert.ok(calls.some((c) => c.name === "vault.setList"));
});

test("状态未定时只显示检查中，不发请求", () => {
  const { tree, calls } = mountPicker("loading");
  assert.match(text(tree), /正在检查保险箱状态/);
  assert.equal(calls.length, 0);
});

test("保险箱未安装仍给说明文案", () => {
  const { tree, calls } = mountPicker("missing");
  assert.match(text(tree), /没有检测到凭据保险箱/);
  assert.equal(calls.length, 0);
});

test("账户表单不再有登录名输入与必填校验", () => {
  const src = fs.readFileSync(path.join(root, "packages/addons/mail/client/ui/account-form.cjs"), "utf8");
  assert.doesNotMatch(src, /textInput\("username"/, "不应再渲染登录名输入框");
  assert.doesNotMatch(src, /请填写登录名/, "不应再要求单独填写登录名");
  assert.match(src, /其他设置（主机 \/ 端口）/, "高级区标题应只剩主机与端口");
  // 提交与自检都以邮箱地址作为登录名
  const persist = src.slice(src.indexOf("username:"), src.indexOf("username:") + 80);
  assert.match(persist, /f\.email/, "提交的 username 应取自邮箱地址");
});
