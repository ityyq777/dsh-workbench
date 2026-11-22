import test from 'node:test';
import assert from 'node:assert/strict';
import MailHtml from '../client/ui/mail-html.cjs';

const { sanitize, buildDoc, replaceCid, PLACEHOLDER } = MailHtml;

test('清洗：脚本、事件属性、javascript: 与外链样式一律丢弃', () => {
  const r = sanitize('<p>hi</p><script>alert(1)</script><img src="/x.png" onerror="alert(1)"><a href="javascript:alert(1)">点我</a><link rel="stylesheet" href="https://evil/x.css">', {});
  assert.equal(r.html.includes('<script'), false);
  assert.equal(r.html.includes('alert(1)'), false);
  assert.equal(r.html.includes('onerror'), false);
  assert.equal(r.html.includes('javascript:'), false);
  assert.equal(r.html.includes('<link'), false);
  assert.match(r.html, /^<p>hi<\/p>/);
  assert.match(r.html, /点我/);
});

test('清洗：http 链接保留并强制新窗口，远程图片默认换占位且计数', () => {
  const r = sanitize('<a href="https://a.example/p">链接</a><img src="https://img.example/a.png" width="20">', {});
  assert.match(r.html, /<a target="_blank" rel="noopener noreferrer nofollow" href="https:\/\/a\.example\/p">/);
  assert.equal(r.remoteCount, 1);
  assert.ok(r.html.includes(PLACEHOLDER));
  assert.equal(r.html.includes('img.example'), false);
  const allowed = sanitize('<img src="https://img.example/a.png">', { allowRemote: true });
  assert.equal(allowed.remoteCount, 1);
  assert.match(allowed.html, /src="https:\/\/img\.example\/a\.png"/);
});

test('清洗：cid 内联图收集，样式里的远程地址与脚本协议被清掉', () => {
  const r = sanitize('<img src="cid:Logo@Example"><style>@import url(https://e/a.css);p{background:url(https://e/b.png)}</style><p style="background:url(javascript:1);color:#333">t</p>', {});
  assert.deepEqual(r.cidIds, ['logo@example']);
  assert.equal(r.html.includes('@import'), false);
  assert.equal(r.html.includes('url(https://e/b.png)'), false);
  assert.equal(r.html.includes('javascript:'), false);
  assert.match(r.html, /color:#333/);
});

test('清洗：表格排版属性保留，输入控件不会吞掉后文', () => {
  const r = sanitize('<table cellpadding="0"><tr><td colspan="2" class="c">格子</td></tr></table><input type="text"><p>尾巴</p>', {});
  assert.match(r.html, /<td colspan="2" class="c">格子<\/td>/);
  assert.equal(r.html.includes('<input'), false);
  assert.match(r.html, /<p>尾巴<\/p>$/);
});

test('cid 映射：有本地图片换 data URL，缺图保留占位', () => {
  const html = '<img src="cid:abc"><img src="cid:missing">';
  const out = replaceCid(html, { abc: 'data:image/png;base64,AAA' });
  assert.match(out, /src="data:image\/png;base64,AAA"/);
  assert.ok(out.includes(PLACEHOLDER));
});

test('文档：CSP 默认禁一切外链，允许远程图片时只放开图片协议', () => {
  const blocked = buildDoc('<img src="https://e/a.png">', { allowRemote: false, theme: { paper: '#101010', ink: '#eee', link: '#0af', line: '#333' } });
  assert.match(blocked, /default-src 'none'/);
  assert.match(blocked, /img-src data:;/);
  // 纸面深就用深色纸面配浅字，文字色由纸面亮度决定，不再直接抄主题 ink。
  assert.match(blocked, /color-scheme:dark/);
  assert.match(blocked, /color:#e6e8ec/);
  const allowed = buildDoc('<img src="https://e/a.png">', { allowRemote: true });
  assert.match(allowed, /img-src data: https: http:;/);
  assert.equal(/@import/.test(allowed), false);
});

function fakeReact() {
  return {
    useState: v => [typeof v === 'function' ? v() : v, () => {}],
    useMemo: fn => fn(),
    useRef: () => ({ current: null }),
    useEffect: fn => { fn(); },
  };
}
const h = (type, props, ...children) => ({ type, props: props || {}, children });
const walk = n => (typeof n === 'object' && n ? [n, ...n.children.flatMap(walk)] : []);
const text = n => (typeof n === 'string' ? n : (n?.children || []).map(text).join(''));

test('组件：HTML 正文渲染在沙箱 iframe 里，正文标签可见且不放行脚本', async () => {
  const calls = [];
  const api = { call: async (action, args) => { calls.push([action, args]); return { ok: true, mime: 'image/png', base64: 'AAAA' }; } };
  const node = MailHtml({
    h, React: fakeReact(), api,
    html: '<h1>标题</h1><img src="cid:logo@example"><script>alert(1)</script><p>正文</p>',
    attachments: [{ id: 'att1', mime: 'image/png', size: 4, contentId: 'logo@example', inline: true }],
    title: '邮件正文',
  });
  const iframe = walk(node).find(n => n.type === 'iframe');
  assert.ok(iframe, '应渲染 iframe');
  assert.equal(iframe.props.sandbox, 'allow-same-origin allow-popups allow-popups-to-escape-sandbox');
  assert.equal(iframe.props.sandbox.includes('allow-scripts'), false);
  assert.match(iframe.props.srcDoc, /<h1>标题<\/h1>/);
  assert.match(iframe.props.srcDoc, /<p>正文<\/p>/);
  assert.equal(iframe.props.srcDoc.includes('alert(1)'), false);
  assert.match(iframe.props.srcDoc, /Content-Security-Policy/);
  await new Promise(r => setTimeout(r, 0));
  assert.equal(calls.length, 1, '内联图应走本地附件下载通道');
  assert.match(calls[0][0], /mail\.attachmentDownload/);
  assert.equal(text(node).includes('邮件含'), false);
});

test('组件：纯文本邮件不出现图片提示，无远程图时只说明按原信排版', () => {
  const node = MailHtml({ h, React: fakeReact(), api: null, html: '<p>只有文字</p>', attachments: [] });
  assert.equal(text(node).startsWith('已按原信排版显示，图片来自本地附件。'), true);
  assert.equal(text(node).includes('远程图片'), false);
  // 页头始终提供配色切换按钮（此处无图，只剩它一个）。
  assert.equal(text(node).includes('跟随界面主题'), true);
});
