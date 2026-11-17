/** 时区与每日触发时间计算；不引第三方依赖。 */

const formatterCache = new Map();

function formatter(tz) {
  if (!formatterCache.has(tz)) {
    formatterCache.set(
      tz,
      new Intl.DateTimeFormat("en-CA", {
        timeZone: tz,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hourCycle: "h23",
      }),
    );
  }
  return formatterCache.get(tz);
}

export function zoneParts(ts, tz) {
  const parts = formatter(tz).formatToParts(new Date(ts));
  const out = {};
  for (const part of parts) if (part.type !== "literal") out[part.type] = Number(part.value);
  return out;
}

function zoneOffset(ts, tz) {
  const p = zoneParts(ts, tz);
  return Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second) - ts;
}

function zonedToUtc(year, month, day, hour, minute, tz) {
  const target = Date.UTC(year, month - 1, day, hour, minute, 0);
  let guess = target;
  for (let i = 0; i < 3; i += 1) {
    const offset = zoneOffset(guess, tz);
    const next = target - offset;
    if (next === guess) break;
    guess = next;
  }
  return guess;
}

export function weekdayOf(year, month, day) {
  const d = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
  return ((d + 6) % 7) + 1;
}

/** 返回严格大于 now 的下一次每日触发时间；weekdays 为 1(周一)..7(周日)。 */
export function nextDailyAt(nowMs, time, tz, weekdays) {
  const [hour, minute] = String(time).split(":").map(Number);
  const allowed = Array.isArray(weekdays) && weekdays.length ? new Set(weekdays.map(Number)) : null;
  const base = new Date(nowMs);
  for (let i = 0; i < 9; i += 1) {
    const dayTs = nowMs + i * 86400000;
    const p = zoneParts(dayTs, tz);
    const wd = weekdayOf(p.year, p.month, p.day);
    if (allowed && !allowed.has(wd)) continue;
    const candidate = zonedToUtc(p.year, p.month, p.day, hour, minute, tz);
    if (candidate > nowMs) return candidate;
  }
  return nowMs + 86400000;
}

export function validTimeZone(tz) {
  try {
    formatter(String(tz));
    return true;
  } catch {
    return false;
  }
}

export function localTimeText(ts, tz) {
  const p = zoneParts(ts, tz);
  const pad = (n) => String(n).padStart(2, "0");
  return p.year + "-" + pad(p.month) + "-" + pad(p.day) + " " + pad(p.hour) + ":" + pad(p.minute);
}
