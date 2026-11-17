import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const h = React.createElement;

const Sources = require("../client/views/sources.cjs");

const rss = {
  id: "rss",
  title: "RSS",
  configFields: [
    { name: "url", label: "Feed URL", type: "url", placeholder: "https://example.com/feed.xml" },
    { name: "limit", label: "单次最多条数", type: "number", default: 20 },
  ],
};
const webhook = {
  id: "webhook",
  title: "Webhook",
  configFields: [
    { name: "authMode", label: "鉴权方式", type: "select", options: ["token", "hmac"], default: "token" },
    { name: "header", label: "token 请求头", type: "text", default: "x-webhook-token" },
    { name: "timestampHeader", label: "HMAC 时间戳头", type: "text", default: "x-webhook-timestamp" },
    { name: "signatureHeader", label: "HMAC 签名头", type: "text", default: "x-webhook-signature" },
    { name: "windowSec", label: "时间窗（秒）", type: "number", default: 300 },
    { name: "ipAllowlist", label: "IP 允许列表", type: "text", default: "" },
    { name: "ratePerMin", label: "每分钟上限", type: "number", default: 60 },
    { name: "trustProxy", label: "信任反代转发头", type: "boolean", default: false },
    { name: "allowPublic", label: "允许非回环（仍建议反代）", type: "boolean", default: false },
  ],
};

const drivers = [rss, webhook];
const secrets = [{ id: "sec1", name: "token", kind: "token" }];

function form(driver, over) {
  const conf = {};
  (driver.configFields || []).forEach((f) => {
    conf[f.name] = f.default !== undefined ? f.default : "";
  });
  return Object.assign(
    {
      id: "",
      name: "",
      driver: driver.id,
      config: conf,
      scheduleSec: 900,
      sink: "message",
      enabled: true,
      secretId: "",
    },
    over || {},
  );
}

function render(driver, over) {
  return renderToStaticMarkup(
    h(Sources.SourceForm, {
      h,
      C: require("../client/ui/common.cjs"),
      form: form(driver, over),
      driver,
      drivers,
      secrets,
      setField: () => {},
      setConfig: () => {},
      save: () => {},
      busy: false,
      onCancel: () => {},
    }),
  );
}

const countFields = (html) => (html.match(/class="wbc-field"/g) || []).length;

test("来源表单：固定字段 + RSS 配置字段全部渲染，不抛错", () => {
  const html = render(rss);
  // 6 个固定字段 + rss 两个 configFields
  assert.equal(countFields(html), 8);
  assert.match(html, /Feed URL/);
  assert.match(html, /单次最多条数/);
  assert.doesNotMatch(html, /wbc-field">undefined/);
});

test("来源表单：Webhook 的 9 个配置字段（含 select/boolean）都能渲染", () => {
  const html = render(webhook);
  assert.equal(countFields(html), 15);
  assert.match(html, /鉴权方式/);
  assert.match(html, /信任反代转发头/);
  assert.match(html, />是</);
  assert.match(html, />否</);
});

test("来源表单：编辑态标题与取消按钮", () => {
  const html = render(rss, { id: "src1", name: "少数派" });
  assert.match(html, /编辑来源/);
  assert.match(html, /取消/);
  assert.match(html, /value="少数派"/);
});

test("来源表单：C.Field 漏传 h 会抛错（回归守门）", () => {
  assert.throws(
    () =>
      renderToStaticMarkup(
        h(Sources.SourceForm, {
          h: undefined,
          C: require("../client/ui/common.cjs"),
          form: form(rss),
          driver: rss,
          drivers,
          secrets,
          setField: () => {},
          setConfig: () => {},
          save: () => {},
          busy: false,
          onCancel: () => {},
        }),
      ),
    /h is not a function/,
  );
});
