'use strict';
const C = require('./common.cjs');
const labels = { sending:'正在发送', accepted:'服务器已接收，尚未留档', archived:'已发送并留档', rejected:'服务器明确拒收', not_sent:'未提交到服务器', unknown:'投递结果未知，请核对邮箱，勿重发' };
function DeliveryLog({h, React:R, api, refreshKey}) {
  const rows = C.useLoad(R, api, 'mail.deliveryList', {}, [refreshKey]);
  const [busy, setBusy] = R.useState(''), [error, setError] = R.useState('');
  async function archive(id) {
    setBusy(id); setError('');
    try { await C.call(api,'mail.deliveryArchive',{id}); rows.refresh(); }
    catch(e) { setError(C.errText(e)); }
    finally { setBusy(''); }
  }
  return h('details', {className:'wbml-card'}, h('summary',null,'投递记录'),
    h(C.Notice,{h,kind:'error',text:error||rows.error}),
    rows.loading ? h('p',{role:'status'},'读取中…') : rows.data?.items.length === 0 ? h('p',null,'没有待处理的投递记录') : null,
    (rows.data?.items||[]).map(r=>h('div',{key:r.id,className:'wbml-actions'},
      h('span',null,(r.subject||'(无主题)')+' · '+(labels[r.status]||r.status)),
      h('small',null,r.messageId),
      r.status==='accepted' ? h(C.Btn,{h,disabled:!!busy,onClick:()=>archive(r.id)},'补记本地已发送') : null)));
}
module.exports = { DeliveryLog, labels };
