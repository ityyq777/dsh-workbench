'use strict';
const C = require('./common.cjs');
const maxBytes = 8 * 1024 * 1024;

function fits(local, selected) {
  return local.length + selected.length <= 10 &&
    local.concat(selected).reduce((n, file) => n + (Number(file.size) || 0), 0) <= maxBytes;
}
function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reader.onabort = () => reject(new Error('无法读取附件：' + file.name));
    reader.onload = () => {
      const result = String(reader.result || '');
      const marker = result.indexOf(',');
      if (marker < 0) return reject(new Error('无法读取附件：' + file.name));
      resolve({filename:file.name, mime:file.type, secretBase64:result.slice(marker + 1)});
    };
    reader.readAsDataURL(file);
  });
}
function useAttachments(R, api, value, original) {
  const [files, setFiles] = R.useState([]), [ids, setIds] = R.useState([]), [error, setError] = R.useState('');
  const origin = value?.mode === 'forward' ? value.originId : '';
  const [remote,setRemote] = R.useState({});
  R.useEffect(() => {
    if (!origin || original) return;
    let active = true;
    C.call(api,'mail.messageGet',{id:origin}).then(data=>{ if(active) setRemote({data}); }, e=>{ if(active) setRemote({error:C.errText(e)}); });
    return () => { active = false; };
  },[origin,original,api]);
  const available = origin ? (original || remote.data?.attachments || []).filter(f => f.section) : [];
  const chosen = available.filter(f => ids.includes(f.id));
  const limit = '附件合计最多 10 个、8 MiB';
  return {
    async read() {
      if (chosen.length !== ids.length) throw new Error('选中的原附件已变化，请重新选择');
      if (!fits(files, chosen)) throw new Error(limit);
      return {uploads:await Promise.all(files.map(readFile)), originalAttachmentIds:ids};
    },
    render(h, busy) {
      return h('section', null,
        h(C.Field, {h,label:'添加本机附件',hint:limit}, h('input', {type:'file',multiple:true,disabled:busy,onChange:e=>{
          const next = files.concat(Array.from(e.target.files || []));
          e.target.value = '';
          if (fits(next, chosen)) { setFiles(next); setError(''); } else setError(limit);
        }})),
        files.map((file,i)=>h('div',{key:i,className:'wbml-actions'},h('span',null,file.name),h(C.Btn,{h,disabled:busy,'aria-label':'移除 '+file.name,onClick:()=>{setFiles(files.filter((_,j)=>j!==i));setError('');}},'移除'))),
        origin && available.length ? h('fieldset',{disabled:busy},h('legend',null,'随信转发的原附件'),available.map(f=>h('div',{key:f.id},h('label',null,h('input',{type:'checkbox',checked:ids.includes(f.id),onChange:e=>{
          if (!e.target.checked) { setIds(ids.filter(id=>id!==f.id));setError(''); }
          else if (fits(files,chosen.concat(f))) { setIds(ids.concat(f.id));setError(''); }
          else setError(limit);
        }}),' '+f.filename)))) : null,
        h(C.Notice,{h,kind:'error',text:error || (origin && remote.error ? '无法读取原信附件：'+remote.error : '')}));
    },
  };
}
module.exports = useAttachments;
