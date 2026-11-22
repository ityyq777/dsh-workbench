// The SQL expressions passed here are static column references, not user input.
export const activeAccount = (id) => `EXISTS (SELECT 1 FROM mail_account a WHERE a.id=${id} AND a.deleted_at IS NULL)`;
export const visibleDraft = `(
  COALESCE(json_extract(d.payload,'$.accountId'),'')='' OR ${activeAccount("json_extract(d.payload,'$.accountId')")}
) AND (
  COALESCE(json_extract(d.payload,'$.originId'),'')='' OR
  EXISTS (SELECT 1 FROM mail_message m WHERE m.id=json_extract(d.payload,'$.originId') AND ${activeAccount('m.account_id')})
)`;

export function visibleMessage(db, id) {
  const row = db.prepare(`SELECT m.* FROM mail_message m WHERE m.id=? AND ${activeAccount('m.account_id')}`).get(id);
  if (!row) throw new Error('邮件不存在');
  return row;
}
