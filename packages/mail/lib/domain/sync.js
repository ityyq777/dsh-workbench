import { newId, now } from "../db/db.js";
import { imapRecent, imapSeen, imapMove, imapSearchHeaders } from "../infra/imap.js";
import { visibleMessage } from "../db/visibility.js";

export function createSync({ db, account, password, message }) {
  const all = (sql, ...args) => db.prepare(sql).all(...args);
  const one = (sql, ...args) => db.prepare(sql).get(...args);
  const run = (sql, ...args) => db.prepare(sql).run(...args);
  const queues = new Map();
  async function serial(key, fn) {
    const job = (queues.get(key) || Promise.resolve()).catch(() => {}).then(fn);
    queues.set(key, job);
    try {
      return await job;
    } finally {
      if (queues.get(key) === job) queues.delete(key);
    }
  }
  function tx(fn) {
    db.exec("SAVEPOINT mail_sync_op");
    try {
      const out = fn();
      db.exec("RELEASE mail_sync_op");
      return out;
    } catch (e) {
      db.exec("ROLLBACK TO mail_sync_op; RELEASE mail_sync_op");
      throw e;
    }
  }
  async function login(id) {
    const a = account(id),
      p = await password(a);
    if (account(id).rev !== a.rev) throw new Error("邮箱账户已变更，请重试");
    return [{ host: a.imap_host, port: a.imap_port, secure: !!a.imap_tls, user: p.user }, p.secret];
  }
  const byId = (id) => visibleMessage(db, id);
  function discard(id) {
    run("DELETE FROM mail_attachment WHERE message_id=?", id);
    run("DELETE FROM mail_message WHERE id=?", id);
  }
  function retire(row) {
    if (!row.body_at && !row.body) {
      discard(row.id);
      return;
    }
    const box = "本地历史副本：" + row.mailbox;
    const n = one("SELECT MIN(uid) n FROM mail_message WHERE account_id=? AND mailbox=?", row.account_id, box).n;
    run(
      "UPDATE mail_message SET mailbox=?,uid=?,uid_validity=0,updated_at=? WHERE id=?",
      box,
      Math.min(0, n || 0) - 1,
      now(),
      row.id,
    );
  }
  function normalizeBox(value) {
    return /^inbox$/i.test(String(value)) ? "INBOX" : String(value || "");
  }
  async function sync(id, input = {}) {
    return serial(id, async () => {
      const mailbox = normalizeBox(input.mailbox || "INBOX");
      if ((input.beforeUid != null) !== (input.uidValidity != null))
        throw new Error("翻页需要同时提供 beforeUid 与 uidValidity");
      const cached = all(
        "SELECT id,uid,uid_validity,body_at,length(body) body,account_id,mailbox FROM mail_message WHERE account_id=? AND mailbox=? AND uid>0",
        id,
        mailbox,
      );
      const connection = await login(id);
      const res = await imapRecent(...connection, mailbox, Number(input.limit) || 20, {
        cached,
        beforeUid: input.beforeUid,
        uidValidity: input.uidValidity,
      });
      return tx(() => {
        const a = account(id),
          prev = connection[0];
        if (
          a.imap_host !== prev.host ||
          a.imap_port !== prev.port ||
          !!a.imap_tls !== prev.secure ||
          (a.username || a.email) !== prev.user
        )
          throw new Error("邮箱账户已变更，请重新同步");
        let inserted = 0;
        for (const row of all(
          "SELECT id,uid,uid_validity,body_at,length(body) body,account_id,mailbox FROM mail_message WHERE account_id=? AND mailbox=? AND uid>0",
          id,
          mailbox,
        )) {
          if (row.uid_validity !== res.uidValidity) retire(row);
          else if (!res.existing.has(row.uid)) discard(row.id);
          else if (res.flags.has(row.uid))
            run(
              "UPDATE mail_message SET flags=?,updated_at=? WHERE id=? AND flags<>?",
              res.flags.get(row.uid),
              now(),
              row.id,
              res.flags.get(row.uid),
            );
        }
        for (const it of res.items) {
          const old = one(
            "SELECT id FROM mail_message WHERE account_id=? AND mailbox=? AND uid=?",
            id,
            mailbox,
            it.uid,
          );
          if (!old) inserted++;
          run(
            `INSERT INTO mail_message(id,account_id,mailbox,uid,uid_validity,message_id,subject,from_addr,from_name,to_addr,cc_addr,date_at,flags,created_at,updated_at,reply_to,thread_refs) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(account_id,mailbox,uid) DO UPDATE SET flags=excluded.flags,reply_to=excluded.reply_to,thread_refs=excluded.thread_refs,updated_at=excluded.updated_at`,
            newId("msg"),
            id,
            mailbox,
            it.uid,
            res.uidValidity,
            it.messageId,
            it.subject,
            it.from,
            it.fromName || "",
            it.to,
            it.cc,
            Date.parse(it.date) || now(),
            it.flags,
            now(),
            now(),
            it.replyTo,
            it.threadRefs,
          );
        }
        return {
          mailbox,
          exists: res.exists,
          fetched: res.items.length,
          inserted,
          nextBeforeUid: res.nextBeforeUid,
          uidValidity: res.uidValidity,
        };
      });
    });
  }
  async function serverSearch({ accountId, mailbox: selection, q, unread } = {}) {
    const mailbox = normalizeBox(selection);
    q = String(q || '').trim();
    if (!accountId || !mailbox || !q || q.length > 256 || /[\x00-\x1f\x7f]/.test(q))
      throw new Error('请选择账户和远端文件夹，并输入 1–256 个字符的关键词');
    return serial(accountId, async () => {
      const a = account(accountId);
      if (!a.enabled || (mailbox !== 'INBOX' && !one('SELECT id FROM mail_mailbox WHERE account_id=? AND name=?', accountId, mailbox)))
        throw new Error('请选择启用的账户和已识别的远端文件夹');
      const res = await imapSearchHeaders(...(await login(accountId)), mailbox, q, !!unread);
      return tx(() => {
        if (account(accountId).rev !== a.rev) throw new Error('邮箱账户已变更，请重新搜索');
        const items = res.items.map(it => {
          let old = one('SELECT id,uid_validity,body_at,length(body) body,account_id,mailbox FROM mail_message WHERE account_id=? AND mailbox=? AND uid=?', accountId, mailbox, it.uid);
          if (old && old.uid_validity !== res.uidValidity) {
            retire(old);
            old = null;
          }
          const id = old?.id || newId('msg');
          const stamp = now();
          const dateAt = Date.parse(it.date) || stamp;
          run(`INSERT INTO mail_message(id,account_id,mailbox,uid,uid_validity,message_id,subject,from_addr,from_name,to_addr,cc_addr,date_at,flags,created_at,updated_at,reply_to,thread_refs)
            VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(account_id,mailbox,uid) DO UPDATE SET flags=excluded.flags,updated_at=excluded.updated_at`,
          id, accountId, mailbox, it.uid, res.uidValidity, it.messageId, it.subject, it.from, it.fromName || '', it.to,
          it.cc, dateAt, it.flags, stamp, stamp, it.replyTo, it.threadRefs);
          return { id, accountId, accountName: a.name || a.email, mailbox, uid: it.uid, uidValidity: res.uidValidity, subject: it.subject, from: it.from,
            fromName: it.fromName, dateAt, flags: it.flags };
        });
        return { source: 'server', items, truncated: res.truncated };
      });
    });
  }
  function writable(row) {
    if (row.uid <= 0 || !row.uid_validity) throw new Error("本地副本没有可确认的远端身份，请先同步");
  }
  async function markRead(input = {}) {
    const ids = [...new Set(Array.isArray(input.ids) ? input.ids : [input.id])];
    let updated = 0;
    for (const id of ids) {
      const first = byId(id);
      await serial(first.account_id, async () => {
        const row = byId(id);
        writable(row);
        const flags = await imapSeen(...(await login(row.account_id)), row, input.read !== false);
        byId(id);
        run("UPDATE mail_message SET flags=?,updated_at=? WHERE id=?", flags, now(), id);
        updated++;
      });
    }
    return { updated };
  }
  async function move(input = {}) {
    const id = input.id;
    return serial(byId(id).account_id, async () => {
      const row = byId(id),
        dest = normalizeBox(input.mailbox);
      writable(row);
      if (!dest) throw new Error("请选择目标文件夹");
      if (row.mailbox === dest) return message(id);
      const remote = await imapMove(...(await login(row.account_id)), row, dest);
      return tx(() => {
        byId(id);
        const clash = one(
          "SELECT * FROM mail_message WHERE account_id=? AND mailbox=? AND uid=?",
          row.account_id,
          dest,
          remote.uid,
        );
        if (clash) retire(clash);
        run(
          "UPDATE mail_message SET mailbox=?,uid=?,uid_validity=?,updated_at=? WHERE id=?",
          dest,
          remote.uid,
          remote.uidValidity,
          now(),
          id,
        );
        return message(id);
      });
    });
  }
  async function remove(input = {}) {
    const row = byId(input.id);
    const trash = one(
      "SELECT name FROM mail_mailbox WHERE account_id=? AND role='trash' ORDER BY name LIMIT 1",
      row.account_id,
    );
    if (!trash) throw new Error("未识别废纸篓，请先同步文件夹");
    await move({ id: row.id, mailbox: trash.name });
    return { deleted: false, trashed: true, id: row.id };
  }
  return { sync, serverSearch, markRead, move, remove };
}
