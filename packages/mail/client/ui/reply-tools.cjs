'use strict';
const C = require('./common.cjs');
const M = require('./compose-model.cjs');
const Editor = require('../views/compose.cjs').Editor;
const iconLabel = require('../../../lib/icon-label.cjs');
const GLYPHS = require('./icons.cjs').ICONS;
const icons = { reply: GLYPHS.reply, replyAll: GLYPHS['reply-all'], forward: GLYPHS.forward };
module.exports = function ReplyTools(p) {
  const {React:R,h,api,message:m} = p;
  const accounts = C.useLoad(R,api,'mail.accountList',{},[]);
  const [mode,setMode] = R.useState(''), [sent,setSent] = R.useState('');
  const rows = accounts.data && accounts.data.items || [];
  const owner = rows.some(a=>a.id===m.accountId);
  const initial = mode && M.initial(mode,m,p.body || '',rows);
  return h('section',null,h('div',{className:'wbml-actions'},Object.keys(icons).map(v=>h(C.Btn,{key:v,h,disabled:!owner||(v==='forward'&&!p.bodyReady),onClick:()=>{setSent('');setMode(v);}},iconLabel(h,icons[v],M.labels[v]))),mode?h(C.Btn,{h,onClick:()=>setMode('')},'收起草稿'):null),
    h(C.Notice,{h,kind:'error',text:accounts.error}),h(C.Notice,{h,kind:'ok',text:sent}),
    initial?h(Editor,Object.assign({},p,{key:initial.key,draftKey:initial.key,initial,accounts:rows,onSent:(outcome)=>{setMode('');setSent(outcome);}})):null);
};
