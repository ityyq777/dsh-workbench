/**
 * 邮件自动同步：后台把"收信"从界面动作变成域内能力。
 *
 * 三件事：
 * 1. 调度：定时循环（默认，每账户独立到期）或 IMAP IDLE（服务器推 EXISTS）。
 * 2. 闸门：每一轮都先问 `vault.status`，保险箱锁着就整轮跳过——绝不为后台同步缓存明文密码。
 * 3. 通知：真正插入了新信才发 `mail.synced` 事件；装了消息插件再推一条消息中心提醒。
 *
 * 设计见 `docs/邮件自动同步设计.md`。
 */
import { configValues } from "../infra/config.js";
import { IDLE_REFRESH_MS, openIdle } from "../infra/imap-idle.js";

const SCHED_TICK_MS = 5000; // 调度粒度：每 5 秒看一次谁到期，避免多账户同时握手
const START_DELAY_MS = 3000; // 应用启动后先让界面把首屏加载完
const MAX_BACKOFF_MS = 5 * 60 * 1000;

const defaults = { enabled: true, mode: "interval", intervalSec: 300, pageSize: 20, notify: true };

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function message(error) {
  return String((error && error.message) || error || "").slice(0, 200);
}

export function createAutoSync({ db, engine, api, log }) {
  const states = new Map(); // accountId -> { nextAt, lastAt, lastInserted, lastError, connected, mode }
  const status = { running: false, mode: "interval", skippedLocked: 0, lastAt: 0, busy: false };
  let timer = null;
  let startTimer = null;
  let idleStops = [];

  function config() {
    try {
      const v = configValues(db);
      return {
        enabled: v["autosync.enabled"] !== false,
        mode: v["autosync.mode"] === "idle" ? "idle" : "interval",
        intervalSec: Math.min(Math.max(Number(v["autosync.intervalSec"]) || defaults.intervalSec, 60), 1800),
        pageSize: Math.min(Math.max(Number(v["list.pageSize"]) || defaults.pageSize, 10), 50),
        notify: v["autosync.notify"] !== false,
      };
    } catch {
      return { ...defaults };
    }
  }
  function accounts() {
    try {
      return db.prepare("SELECT id,name,email FROM mail_account WHERE deleted_at IS NULL AND enabled=1 ORDER BY created_at").all();
    } catch {
      return [];
    }
  }
  function stateOf(id) {
    let st = states.get(id);
    if (!st) {
      st = { nextAt: 0, lastAt: 0, lastInserted: 0, lastError: "", connected: false, mode: "interval" };
      states.set(id, st);
    }
    return st;
  }
  async function vaultLocked() {
    try {
      const r = await api.call("vault.status", {});
      const v = r && r.result !== undefined ? r.result : r;
      return !v || v.locked !== false;
    } catch {
      // 状态读不到按锁定处理：fail-closed，绝不因为保险箱插件不在就裸连 IMAP。
      return true;
    }
  }

  /**
   * 同步一个账户的收件箱。
   *
   * 闸门放在这里而不是调度器里：无论是定时循环、IDLE 推送还是界面手动触发，都先问一次保险箱，
   * 锁着就整轮跳过。这样「后台不缓存密码」是结构保证，而不是调用方的自觉。
   */
  async function syncNew(acc, cfg) {
    if (await vaultLocked()) {
      status.skippedLocked += 1;
      return { inserted: 0, exists: 0, locked: true };
    }
    const probe = await engine.probeRecent(acc.id, "INBOX");
    const grew = probe.uidNext > 0 ? probe.uidNext - 1 > probe.localUid : probe.exists > probe.localCount;
    if (!grew) return { inserted: 0, exists: probe.exists };
    const res = await engine.sync(acc.id, { mailbox: "INBOX", limit: cfg.pageSize });
    if (res.inserted > 0) await announce(acc, res, cfg);
    return { inserted: res.inserted, exists: res.exists };
  }

  async function announce(acc, res, cfg) {
    api.emit("mail.synced", {
      accountId: acc.id,
      mailbox: res.mailbox,
      inserted: res.inserted,
      exists: res.exists,
    });
    if (!cfg.notify || typeof api.hasDomain !== "function" || !api.hasDomain("wb-addon-message")) return;
    let rows = [];
    try {
      rows = db
        .prepare(
          "SELECT subject,from_name,from_addr,uid FROM mail_message WHERE account_id=? AND mailbox=? AND uid>0 ORDER BY uid DESC LIMIT 3",
        )
        .all(acc.id, res.mailbox);
    } catch {
      rows = [];
    }
    const latest = rows[0];
    const title = "新邮件（" + (acc.name || acc.email) + "）：" + (latest?.subject || "（无主题）");
    const body = rows
      .map((r) => (r.from_name || r.from_addr || "未知发件人") + " · " + (r.subject || "（无主题）"))
      .join("\n");
    try {
      await api.call(
        "message.send",
        {
          title: title.slice(0, 120),
          body: body.slice(0, 3000),
          level: "info",
          source: "mail",
          audience: "user",
          // 同一批新信只提醒一次：uid 最大的那封变了才会生成新键。
          dedupeKey: "mail:new:" + acc.id + ":" + (latest?.uid || res.exists || 0),
          meta: { accountId: acc.id, inserted: res.inserted },
        },
      );
    } catch (error) {
      log("mail: 推送到消息中心失败", message(error));
    }
  }

  function dueAccounts(cfg) {
    const now = Date.now();
    const due = [];
    for (const acc of accounts()) {
      const st = stateOf(acc.id);
      if (now < st.nextAt) continue;
      st.nextAt = now + cfg.intervalSec * 1000;
      due.push(acc);
    }
    return due;
  }

  async function runAccount(acc, cfg) {
    const st = stateOf(acc.id);
    try {
      const res = await syncNew(acc, cfg);
      st.lastAt = Date.now();
      st.lastInserted = res.inserted;
      st.lastError = "";
      status.lastAt = st.lastAt;
    } catch (error) {
      st.lastError = message(error);
      // 失败下次早点再试，但别让坏账户每分钟撞一次服务器。
      st.nextAt = Date.now() + Math.min(cfg.intervalSec * 2000, MAX_BACKOFF_MS);
      log("mail: 自动同步失败", acc.name || acc.email, st.lastError);
    }
  }

  async function tickInterval() {
    if (status.busy) return;
    status.busy = true;
    try {
      const cfg = config();
      if (!cfg.enabled || status.mode !== "interval") return;
      for (const acc of dueAccounts(cfg)) await runAccount(acc, cfg);
    } finally {
      status.busy = false;
    }
  }

  // IDLE 模式下仍按 intervalSec 跑一次探测：服务器漏推、连接被中间设备静默掐断都能兜住。
  async function tickBackstop(cfg) {
    if (status.busy) return;
    status.busy = true;
    try {
      for (const acc of dueAccounts(cfg)) await runAccount(acc, cfg);
    } finally {
      status.busy = false;
    }
  }

  function startIdleAccount(acc, cfg, stopSignal) {
    const st = stateOf(acc.id);
    st.mode = "idle";
    void (async () => {
      let backoff = 5000;
      while (!stopSignal.stopped && st.mode === "idle") {
        try {
          // 长连接要靠密码建连：解锁前先安静等待，别让每轮都记一条"认证失败"。
          if (await vaultLocked()) {
            await sleep(Math.min(cfg.intervalSec * 1000, 60000));
            continue;
          }
          const cred = await engine.sessionFor(acc.id);
          const watcher = await openIdle(cred.account, cred.secret, "INBOX");
          st.connected = true;
          st.lastError = "";
          backoff = 5000;
          await watcher.select();
          for (;;) {
            const { timedOut } = await watcher.waitForNew({ timeoutMs: IDLE_REFRESH_MS });
            // 25 分钟无事发生：主动重连，避免连接被中间设备静默掐断。
            if (timedOut) break;
            await runAccount(acc, cfg);
          }
          await watcher.close();
        } catch (error) {
          st.connected = false;
          st.lastError = message(error);
          if (stopSignal.stopped) return;
          log("mail: IDLE 连接中断，稍后重连", acc.name || acc.email, st.lastError);
          await sleep(backoff);
          backoff = Math.min(backoff * 2, MAX_BACKOFF_MS);
        }
      }
    })();
  }

  function start() {
    restart();
  }
  function stop() {
    if (timer) clearInterval(timer);
    if (startTimer) clearTimeout(startTimer);
    timer = null;
    startTimer = null;
    idleStops.forEach((s) => {
      s.stopped = true;
    });
    idleStops = [];
    status.running = false;
  }
  function restart() {
    stop();
    const cfg = config();
    status.mode = cfg.mode;
    if (!cfg.enabled) {
      log("mail: 自动同步已关闭");
      return;
    }
    status.running = true;
    startTimer = setTimeout(() => {
      // 定时循环与 IDLE 共用同一个按到期时间排队的探测器；IDLE 模式下它是兜底。
      timer = setInterval(() => {
        if (status.mode === "idle") void tickBackstop(config());
        else void tickInterval();
      }, SCHED_TICK_MS);
      if (status.mode === "interval") void tickInterval();
      else {
        for (const acc of accounts()) {
          const stopSignal = { stopped: false };
          idleStops.push(stopSignal);
          startIdleAccount(acc, cfg, stopSignal);
        }
        void tickBackstop(cfg);
      }
    }, START_DELAY_MS);
    log("mail: 自动同步已启动", cfg.mode, cfg.intervalSec + "s");
  }
  function statusReport() {
    const cfg = config();
    return {
      enabled: cfg.enabled,
      mode: cfg.mode,
      intervalSec: cfg.intervalSec,
      running: status.running,
      skippedLocked: status.skippedLocked,
      lastAt: status.lastAt,
      accounts: accounts().map((acc) => {
        const st = stateOf(acc.id);
        return {
          id: acc.id,
          name: acc.name || acc.email,
          mode: st.mode,
          connected: st.connected,
          lastAt: st.lastAt,
          lastInserted: st.lastInserted,
          lastError: st.lastError,
        };
      }),
    };
  }
  return { start, stop, restart, statusReport, syncNew };
}

/**
 * 只读状态：界面上要能看到"自动同步开没开、上一次什么时候成功、有没有因为保险箱锁着被跳过"。
 * 刻意不给任何写操作——开关和间隔都走 mail.configSet，避免两套配置入口。
 */
export function registerAutoSyncActions(api, autoSync) {
  api.action("mail.autoSyncStatus", {
    description: "只读：邮件自动同步的开关、方式、上次成功时间与每账户状态（受保险箱锁定影响时 counted 在 skippedLocked）",
    input: { type: "object", properties: {}, additionalProperties: false },
    execute: () => autoSync.statusReport(),
    render: (r) => {
      const mode = r.mode === "idle" ? "IMAP 推送" : "定时循环";
      const why = r.enabled ? mode : "已关闭";
      const locked = r.skippedLocked ? "；因保险箱锁定跳过 " + r.skippedLocked + " 次" : "";
      return "邮件自动同步：" + why + "，账户 " + (r.accounts || []).length + " 个" + locked + "。";
    },
  });
}
