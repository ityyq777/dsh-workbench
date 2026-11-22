// 弹幕界面层的 action 调用契约：宿主 /domains/:id/actions/:action 的 action 段必须是
// 完整 action 名（danmaku.configGet）。0.2.2 及以前只发短名 configGet，宿主回 404，
// 弹幕层读不到配置就用内置默认值，「打字时暂停」开关因此永远不生效。
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import test from "node:test";

const require = createRequire(import.meta.url);
const overlay = require("../client/overlay/mount.cjs");

test("界面层调用 action 时使用完整 action 名", async () => {
  const calls = [];
  const original = globalThis.fetch;
  globalThis.fetch = (url, options) => {
    calls.push({ url, options });
    return Promise.resolve({
      status: 200,
      json: () => Promise.resolve({ ok: true, result: {} }),
    });
  };
  try {
    await overlay.call("configGet", {});
    await overlay.call("theme", { colors: {} });
  } finally {
    globalThis.fetch = original;
  }

  assert.equal(calls.length, 2);
  assert.equal(
    calls[0].url,
    "/workbench/api/domains/wb-addon-danmaku/actions/danmaku.configGet",
  );
  assert.equal(
    calls[1].url,
    "/workbench/api/domains/wb-addon-danmaku/actions/danmaku.theme",
  );
  assert.equal(calls[0].options.method, "POST");
  assert.equal(calls[0].options.headers["content-type"], "application/json");
});

test("SSE 过滤仍用插件 id，而不是 action 名前缀", () => {
  assert.equal(overlay.DOMAIN, "wb-addon-danmaku");
});
