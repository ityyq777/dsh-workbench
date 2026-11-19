import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";

const require = createRequire(import.meta.url);
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const h = React.createElement;
const C = require("../../lib/client-common.cjs")("wbv");

const SecretField = require("../../lib/secret-field.cjs");
const AskPassphrase = require("../client/ui/ask-passphrase.cjs");
const SecretsView = require("../client/views/secrets.cjs");

const dir = path.join(process.cwd(), "packages/addons/vault/client");

function render(field, over) {
  return renderToStaticMarkup(
    h(field, Object.assign({
      h,
      C,
      value: "",
      onChange: () => {},
      onToggle: () => {},
      onCancel: () => {},
      onConfirm: () => {},
    }, over || {})),
  );
}

test("明文框默认 password，点击后切 text 且 aria-pressed 同步", () => {
  const hidden = render(SecretField, { value: "s3cret", placeholder: "密码" });
  assert.match(hidden, /type="password"/);
  assert.match(hidden, /aria-pressed="false"/);
  assert.match(hidden, /aria-label="显示明文"/);
  assert.match(hidden, /class="wb-secret-field"/);
  assert.match(hidden, /class="wb-eye"/);

  const shown = render(SecretField, { show: true, value: "s3cret" });
  assert.match(shown, /type="text"/);
  assert.doesNotMatch(shown, /type="password"/);
  assert.match(shown, /aria-pressed="true"/);
  assert.match(shown, /aria-label="隐藏明文"/);
});

test("切换明文只改 type，value 原样保留", () => {
  const hidden = render(SecretField, { value: "p@ss<&>ok" });
  const shown = render(SecretField, { show: true, value: "p@ss<&>ok" });
  const valueOf = (html) => html.match(/value="([^"]*)"/)[1];
  assert.equal(valueOf(hidden), valueOf(shown));
  assert.match(valueOf(hidden), /p@ss/);
});

test("明文框的眼睛是 type=button，不会提交表单", () => {
  const html = render(SecretField, { value: "" });
  assert.match(html, /<button[^>]*type="button"/);
  // 点击时先 preventDefault，再切状态并回焦输入框
  const src = fs.readFileSync(path.join(process.cwd(), "packages/addons/lib/secret-field.cjs"), "utf8");
  assert.match(src, /e\.preventDefault\(\)/);
  assert.match(src, /input\.focus\(\)/);
});

test("小眼睛只有一份实现：vault 私有版本已删除，vault 与 sites 都引用共享控件", () => {
  assert.equal(fs.existsSync(path.join(dir, "ui/secret-field.cjs")), false);
  const vaultFiles = ["views/secrets.cjs", "views/status.cjs", "ui/ask-passphrase.cjs"];
  for (const f of vaultFiles) {
    const src = fs.readFileSync(path.join(dir, f), "utf8");
    assert.match(src, /lib\/secret-field\.cjs/, `${f} 未引用共享控件`);
    assert.doesNotMatch(src, /type:\s*"password"/, `${f} 仍有裸密码框`);
  }
  const sitesModal = fs.readFileSync(path.join(process.cwd(), "packages/addons/sites/client/ui/accounts-modal.cjs"), "utf8");
  assert.match(sitesModal, /lib\/secret-field\.cjs/);
  assert.doesNotMatch(sitesModal, /type:\s*"password"/);
});

test("主口令弹层有输入框、取消与确认，且不依赖 window.prompt", () => {
  const html = render(AskPassphrase, {
    title: "查看凭据明文",
    hint: "B 模式需要主口令",
    value: "p",
    busy: false,
  });
  assert.match(html, /type="password"/);
  assert.match(html, /取消/);
  assert.match(html, /确认/);
  const ask = fs.readFileSync(path.join(dir, "ui/ask-passphrase.cjs"), "utf8");
  assert.doesNotMatch(ask, /window\.prompt\(/);
});

test("vault 客户端不再使用 window.prompt（桌面端不支持，会静默失效）", () => {
  const files = [];
  const walk = (d) => {
    for (const name of fs.readdirSync(d)) {
      const full = path.join(d, name);
      if (fs.statSync(full).isDirectory()) walk(full);
      else if (name.endsWith(".cjs")) files.push(full);
    }
  };
  walk(path.join(dir, "views"));
  walk(path.join(dir, "ui"));
  for (const file of files) {
    const src = fs.readFileSync(file, "utf8");
    assert.doesNotMatch(src, /window\.prompt\(/, `${path.relative(dir, file)} 仍有 window.prompt`);
  }
});

test("备注合并：新数据读 note，旧数据回退「用户名 · URL」", () => {
  const noteOf = SecretsView.noteOf;
  assert.equal(noteOf({ username: "neo", url: "https://a.b" }), "neo · https://a.b");
  assert.equal(noteOf({ note: "工作邮箱", username: "neo" }), "工作邮箱");
  assert.equal(noteOf({}), "");
  assert.equal(noteOf(null), "");
});

test("保存路径只写 meta.note，不再写 username/url", () => {
  const src = fs.readFileSync(path.join(dir, "views/secrets.cjs"), "utf8");
  assert.doesNotMatch(src, /username:\s*f\.username/);
  assert.doesNotMatch(src, /url:\s*f\.url/);
  assert.match(src, /meta\.note = note/);
  assert.match(src, /label: "备注"/);
  assert.doesNotMatch(src, /备注用户名|备注 URL/);
});

test("分组页：建组走弹窗，顶部不再有内联建组表单", () => {
  const src = fs.readFileSync(path.join(dir, "views/groups.cjs"), "utf8");
  assert.doesNotMatch(src, /新分组名称/);
  assert.doesNotMatch(src, /wbv-card wbv-row/);
  assert.match(src, /className: "wbv-modal-box"/);
  assert.match(src, /label: "集合（可多选）"/);
  assert.match(src, /kind: "primary", onClick: openCreate/);
});

test("分组页：集合选择器复用共享清单，搜索走后端、本地每页 20 条", () => {
  const src = fs.readFileSync(path.join(dir, "views/groups.cjs"), "utf8");
  assert.match(src, /require\("\.\.\/\.\.\/\.\.\/lib\/filter-checklist\.cjs"\)/);
  assert.match(src, /h\(FilterChecklist, \{/);
  assert.match(src, /title: "全部集合"/);
  assert.match(src, /searchPlaceholder: "搜索集合名称或描述"/);
  assert.match(src, /"vault\.setList", pickQ \? \{ q: pickQ \} : \{\}/);
  assert.match(src, /var PICK_PAGE = 20;/);
  assert.match(src, /slice\(0, pickS\[0\]\.page \* PICK_PAGE\)/);
  assert.match(src, /onClear: pickClear/);
  // 已选跨搜索保留：搜索与页码只动 pickS，不重置 createS.setIds
  assert.match(src, /function pickQuery\(v\)/);
  assert.doesNotMatch(src, /pickQuery[\s\S]{0,200}setIds: \[\]/);
});

test("分组页：创建时先 groupCreate 再逐个 groupAttachSet，Esc 可关、创建中不可关", () => {
  const src = fs.readFileSync(path.join(dir, "views/groups.cjs"), "utf8");
  assert.match(src, /vault\.groupCreate/);
  assert.match(src, /vault\.groupAttachSet/);
  assert.match(src, /e\.key === "Escape"/);
  assert.match(src, /if \(createS\[0\] && createS\[0\]\.busy\) return;/);
  assert.match(src, /个集合挂载失败/);
});

test("共享 call：服务端 ok:false 必须 reject，不能当成功返回", async () => {
  const locked = { call: () => Promise.resolve({ ok: false, error: "保险箱已锁定，请先解锁" }) };
  await assert.rejects(() => C.call(locked, "vault.secretCreate", {}), /保险箱已锁定/);

  const bad = { call: () => Promise.reject(new Error("网络异常")) };
  await assert.rejects(() => C.call(bad, "vault.secretList", {}), /网络异常/);

  // 业务结果里自带的 ok 字段在 result 里，不能被当成失败
  const okApi = { call: () => Promise.resolve({ ok: true, result: { id: "sec_1", ok: true, setId: null } }) };
  assert.deepEqual(await C.call(okApi, "vault.secretCreate", {}), { id: "sec_1", ok: true, setId: null });
});

test("凭据页：create 参数不含 id，保存成功后无条件刷新列表", () => {
  const src = fs.readFileSync(path.join(dir, "views/secrets.cjs"), "utf8");
  // 回归：曾经把 id/secret 写成 undefined 参与 payload，schema 是 additionalProperties:false
  assert.doesNotMatch(src, /id: f\.id \|\| undefined/);
  assert.doesNotMatch(src, /secret: f\.secret \|\| undefined/);
  assert.match(src, /if \(f\.id\) payload\.id = f\.id;/);
  assert.match(src, /if \(f\.secret\) payload\.secret = f\.secret;/);
  // 集合同步失败只提示，仍然关闭弹窗并刷新列表
  assert.match(src, /凭据已保存，但集合挂载失败/);
  assert.match(src, /formS\[1\]\(emptyForm\(\)\);\s*load\(\);/);
});

test("凭据页：锁定态有提示和解锁入口，失败时保留弹窗", () => {
  const src = fs.readFileSync(path.join(dir, "views/secrets.cjs"), "utf8");
  assert.match(src, /保险箱已锁定，请先解锁再保存/);
  assert.match(src, /statusS\[0\] && statusS\[0\]\.locked/);
  assert.match(src, /"解锁"/);
  assert.match(src, /C\.call\(api, "vault\.unlock"/);
  assert.match(src, /if \(isLockedText\(text\)\) askUnlock\(/);
  // 失败分支不能关弹窗（editingS 保持 true），且要和后端对齐状态
  assert.match(src, /var text = C\.errText\(e\);\s*msgS\[1\]\(text\);\s*\/\/ 失败也要刷新/);
  assert.match(src, /if \(isLockedText\(text\)\) askUnlock\("保险箱已锁定，输入主口令后会自动继续保存。"\);/);
});

/** 极简 hook 宿主：让视图函数能被反复调用（重绘），便于验证 save() 的真实行为。 */
function mountSecrets(api) {
  const slots = [];
  const effects = [];
  let idx = 0;
  const FakeReact = {
    useState(init) {
      const i = idx;
      idx += 1;
      if (slots.length <= i) slots.push(typeof init === "function" ? init() : init);
      return [slots[i], function (v) { slots[i] = typeof v === "function" ? v(slots[i]) : v; }, i];
    },
    useEffect(fn) {
      const i = idx;
      idx += 1;
      if (!effects[i]) { effects[i] = true; fn(); }
    },
  };
  function paint() {
    idx = 0;
    return SecretsView({ h, api, lang: "zh", React: FakeReact });
  }
  return { paint };
}

function walk(node, out) {
  if (!node || typeof node !== "object") return out;
  if (Array.isArray(node)) {
    node.forEach(function (n) { walk(n, out); });
    return out;
  }
  if (typeof node.type === "function") return walk(node.type(node.props), out);
  out.push(node);
  if (node.props && node.props.children !== undefined) walk(node.props.children, out);
  return out;
}

function texts(tree) {
  return walk(tree, []).map(function (n) {
    const c = n.props && n.props.children;
    return typeof c === "string" ? c : "";
  }).join(" | ");
}

function button(tree, label) {
  const hit = walk(tree, []).filter(function (n) { return n.type === "button" && n.props.children === label; });
  return hit[hit.length - 1] || null;
}

function fieldInput(tree, i) {
  return walk(tree, []).filter(function (n) { return n.type === "input"; })[i];
}

async function flush() {
  for (let i = 0; i < 12; i += 1) await Promise.resolve();
}

test("保存成功后弹窗关闭、列表出现新凭据；失败时保留弹窗并显示错误原文", async () => {
  const calls = [];
  let created = null;
  const api = {
    call(action, args) {
      calls.push({ action: action, args: args });
      if (action === "vault.secretCreate") {
        if (created) return Promise.resolve({ ok: false, error: "保险箱已锁定，请先解锁" });
        created = { id: "sec_1", name: args.name, kind: args.kind, meta: JSON.stringify(args.meta || {}), setIds: [] };
        return Promise.resolve({ ok: true, result: { id: "sec_1", ok: true, setId: null } });
      }
      if (action === "vault.secretList") {
        return Promise.resolve({ ok: true, result: { items: created ? [created] : [] } });
      }
      if (action === "vault.status") return Promise.resolve({ ok: true, result: { locked: false, unlockMode: "B" } });
      return Promise.resolve({ ok: true, result: { items: [] } });
    },
  };

  const view = mountSecrets(api);
  let tree = view.paint();
  await flush();
  tree = view.paint();
  assert.match(texts(tree), /还没有凭据/);

  button(tree, "新增凭据").props.onClick();
  tree = view.paint();
  fieldInput(tree, 1).props.onChange({ target: { value: "ID_CARD" } });
  tree = view.paint();
  fieldInput(tree, 2).props.onChange({ target: { value: "123456789012345678" } });
  tree = view.paint();
  button(tree, "保存").props.onClick();

  await flush();
  tree = view.paint();

  const create = calls.filter(function (c) { return c.action === "vault.secretCreate"; })[0];
  assert.ok(create, "应该真的调用了 secretCreate");
  assert.equal("id" in create.args, false, "create 参数不能带 id 键");
  assert.equal(create.args.name, "ID_CARD");
  assert.equal(create.args.kind, "password");
  // 成功：弹窗关闭 + 列表里出现这条
  assert.doesNotMatch(texts(tree), /保存中…/);
  assert.match(texts(tree), /ID_CARD/);
  assert.doesNotMatch(texts(tree), /还没有凭据/);

  // 失败：保留弹窗、显示服务端原文、并弹出解锁框
  button(tree, "新增凭据").props.onClick();
  tree = view.paint();
  fieldInput(tree, 1).props.onChange({ target: { value: "ID_CARD2" } });
  tree = view.paint();
  fieldInput(tree, 2).props.onChange({ target: { value: "123456789012345678" } });
  tree = view.paint();
  button(tree, "保存").props.onClick();
  await flush();
  tree = view.paint();
  assert.match(texts(tree), /保险箱已锁定，请先解锁/);
  assert.match(texts(tree), /解锁保险箱/);
});
