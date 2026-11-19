import { test } from "node:test";
import assert from "node:assert/strict";
import { parseMime, htmlToText, parseParams, splitMultipart } from "../lib/infra/mime.js";

function crlf(lines) { return lines.join("\r\n"); }
function raw(lines) { return Buffer.from(crlf(lines) + "\r\n", "utf8"); }

test("gbk + base64 纯文本正文不乱码", () => {
  const body = Buffer.from([0xd6, 0xd0, 0xce, 0xc4]).toString("base64"); // 「中文」
  const part = parseMime(raw([
    "From: a@b.test",
    "Subject: =?gbk?B?" + body + "?=",
    "Content-Type: text/plain; charset=gbk",
    "Content-Transfer-Encoding: base64",
    "",
    body,
  ]));
  assert.equal(part.text, "中文");
  assert.equal(part.attachments.length, 0);
});

test("quoted-printable 的 utf-8 中文被还原", () => {
  const part = parseMime(raw([
    "Content-Type: text/plain; charset=utf-8",
    "Content-Transfer-Encoding: quoted-printable",
    "",
    "=E4=BD=A0=E5=A5=BD=EF=BC=8C=E4=B8=96=E7=95=8C",
  ]));
  assert.equal(part.text, "你好，世界");
});

test("multipart/alternative 优先纯文本，同时保留 html", () => {
  const part = parseMime(raw([
    'Content-Type: multipart/alternative; boundary="alt1"',
    "",
    "--alt1",
    "Content-Type: text/plain; charset=utf-8",
    "",
    "这是纯文本版本",
    "--alt1",
    "Content-Type: text/html; charset=utf-8",
    "",
    "<p>这是 <b>HTML</b> 版本</p>",
    "--alt1--",
  ]));
  assert.equal(part.text, "这是纯文本版本");
  assert.match(part.html, /HTML/);
});

test("只有 HTML 的营销邮件能提出可读正文", () => {
  const html = [
    "<html><head><style>p{color:red}</style><script>alert(1)</script></head><body>",
    "<p>你好&nbsp;世界</p><p>&amp; 优惠 &mdash; 立即购买</p>",
    "</body></html>",
  ].join("");
  const part = parseMime(raw([
    "Content-Type: text/html; charset=utf-8",
    "",
    html,
  ]));
  assert.match(part.text, /你好 世界/);
  assert.match(part.text, /& 优惠 — 立即购买/);
  assert.doesNotMatch(part.text, /<p>|<\/p>|alert\(1\)|color:red/);
  assert.ok(part.text.indexOf("HTML") >= 0 || part.text.length > 0);
});

test("multipart/mixed 带附件：正文出文本，附件只留元信息", () => {
  const filename = "报告.pdf";
  const encoded = Buffer.from(filename, "utf8").toString("base64");
  const part = parseMime(raw([
    'Content-Type: multipart/mixed; boundary="mix1"',
    "",
    "--mix1",
    "Content-Type: text/plain; charset=utf-8",
    "",
    "见附件中的数据。",
    "--mix1",
    "Content-Type: application/pdf",
    'Content-Disposition: attachment; filename="=?utf-8?B?' + encoded + '?="',
    "Content-Transfer-Encoding: base64",
    "",
    "JVBERi0xLjQK",
    "--mix1--",
  ]));
  assert.equal(part.text, "见附件中的数据。");
  assert.equal(part.attachments.length, 1);
  assert.equal(part.attachments[0].filename, filename);
  assert.equal(part.attachments[0].mime, "application/pdf");
  assert.equal(part.attachments[0].size, 9);
});

test("嵌套 multipart：mixed 里再包 alternative", () => {
  const part = parseMime(raw([
    'Content-Type: multipart/mixed; boundary="outer"',
    "",
    "--outer",
    'Content-Type: multipart/alternative; boundary="inner"',
    "",
    "--inner",
    "Content-Type: text/plain; charset=gbk",
    "Content-Transfer-Encoding: base64",
    "",
    Buffer.from([0xd6, 0xd0, 0xce, 0xc4]).toString("base64"),
    "--inner",
    "Content-Type: text/html; charset=utf-8",
    "",
    "<p>html 版</p>",
    "--inner--",
    "--outer--",
  ]));
  assert.equal(part.text, "中文");
});

test("htmlToText 解实体、去标签、去脚本", () => {
  const text = htmlToText("<style>x</style><p>a &lt; b</p><p>c&#65;</p><script>bad()</script>");
  assert.equal(text, "a < b\n\ncA");
});

test("参数解析支持引号与 RFC2231", () => {
  const p = parseParams('text/html; charset="gbk"; name*=utf-8\'\'%E4%B8%AD%E6%96%87.txt');
  assert.equal(p.value, "text/html");
  assert.equal(p.params.charset, "gbk");
  assert.equal(p.params.name, "中文.txt");
});

test("splitMultipart 按 boundary 切段并丢掉首尾", () => {
  const body = Buffer.from("preamble\r\n--b\r\n\r\none\r\n--b\r\n\r\ntwo\r\n--b--\r\n", "utf8");
  const segs = splitMultipart(body, "b");
  assert.equal(segs.length, 2);
  assert.match(segs[0].toString("utf8"), /one/);
  assert.match(segs[1].toString("utf8"), /two/);
});
