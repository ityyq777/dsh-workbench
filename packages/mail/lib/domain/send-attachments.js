import { Buffer } from 'node:buffer';

const MAX_FILES = 10;
const MAX_BYTES = 8 * 1024 * 1024;
const base64Pattern = /^[A-Za-z0-9+/]*={0,2}$/;

export function createAttachmentLoader({ message, attachmentDownload }) {
  return async function loadAttachments(input, accountId) {
    const uploads = input.uploads ?? [], ids = input.originalAttachmentIds ?? [];
    if (!Array.isArray(uploads) || !Array.isArray(ids) || uploads.length + ids.length > MAX_FILES) throw new Error('附件最多 10 个');
    if (new Set(ids).size !== ids.length) throw new Error('原附件不能重复选择');
    let bytes = 0;
    const files = [];
    function add(file, base64) {
      if (typeof base64 !== 'string' || base64.length > Math.ceil((MAX_BYTES - bytes) / 3) * 4) throw new Error('附件合计不能超过 8 MiB');
      if (base64.length % 4 || !base64Pattern.test(base64)) throw new Error('附件读取不完整，请重新选择');
      const size = Buffer.byteLength(base64, 'base64');
      bytes += size;
      if (bytes > MAX_BYTES) throw new Error('附件合计不能超过 8 MiB');
      const filename = Buffer.from(String(file.filename || 'attachment').split(/[/\\]/).pop()).toString().replace(/[\x00-\x1f\x7f]/g, '_');
      if (!filename || Buffer.byteLength(filename) > 250) throw new Error('附件文件名为空或过长');
      const mime = /^[a-z\d!#$&^_.+-]+\/[a-z\d!#$&^_.+-]+$/i.test(file.mime || '') ? file.mime : 'application/octet-stream';
      files.push({ filename, mime, base64, size });
    }
    for (const f of uploads) add(f, f.secretBase64);
    if (ids.length) {
      if (input.mode !== 'forward' || !input.originId) throw new Error('只可在转发时选择原邮件附件');
      const original = message(input.originId);
      const available = new Set(original.attachments.filter(f => f.section).map(f => f.id));
      if (original.accountId !== accountId || ids.some(id => !available.has(id))) throw new Error('转发附件不属于当前账户的这封原信，或索引已失效');
      for (const id of ids) {
        const f = await attachmentDownload({ id });
        add(f, f.base64);
      }
    }
    return files;
  };
}
