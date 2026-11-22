"use strict";
var GLYPHS = require("../ui/icons.cjs").ICONS;

const Paperclip = GLYPHS["paperclip"];
const MailNew = GLYPHS["mail"];
const MailSeen = GLYPHS["mail-open"];

module.exports = function messageRows(h, items, options) {
  const { current, showSource, lang, attachmentUpdates, open, sender, senderDetail, isUnread } = options;
  const locale = lang === "en" ? "en-GB" : "zh-CN";
  const dayFormat = new Intl.DateTimeFormat(locale, { year: "numeric", month: "short", day: "numeric" });
  const timeFormat = new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
  const today = options.now ?? new Date(), yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const todayKey = dayFormat.format(today), yesterdayKey = dayFormat.format(yesterday);
  const rows = [];
  let lastDay;
  for (const m of items) {
    const date = new Date(m.dateAt);
    const valid = !!m.dateAt && Number.isFinite(date.getTime());
    const day = valid ? dayFormat.format(date) : "未知日期";
    const isToday = day === todayKey, isYesterday = day === yesterdayKey;
    const yesterdayLabel = lang === "en" ? "Yesterday" : "昨天";
    if (day !== lastDay) {
      const label = isToday ? (lang === "en" ? "Today" : "今天") : isYesterday ? yesterdayLabel : day;
      rows.push(h("h3", { key: "day:" + m.id, className: "wbml-date-group", title: day }, label));
      lastDay = day;
    }
    let shortDate = "—";
    if (isToday || isYesterday) shortDate = (isYesterday ? yesterdayLabel + " " : "") + timeFormat.format(date);
    else if (valid) {
      const prefix = date.getFullYear() === today.getFullYear() ? "" : date.getFullYear() + "/";
      shortDate = prefix + (date.getMonth() + 1) + "/" + date.getDate();
    }
    const active = current?.id === m.id;
    const unread = isUnread(m);
    const statusText = unread ? (lang === "en" ? "Unread" : "未读") : (lang === "en" ? "Read" : "已读");
    const { hasAttachment, attachmentName } = attachmentUpdates.get(m.id) ?? m;
    const row = h("button", {
      type: "button", key: m.id, "data-mail-id": m.id, "aria-current": active || undefined,
      title: senderDetail(m) + " · " + (m.subject || "(无主题)"),
      className: "wbml-list-row" + (active ? " on" : "") + (unread ? " unread" : " read"),
      onClick: () => open(m),
    },
    h("span", { className: "wbml-st", role: "img", "aria-label": statusText, title: statusText },
      h(unread ? MailNew : MailSeen, { size: 14, "aria-hidden": true })),
    h("span", { className: "wbml-who" }, h("span", { className: "wbml-sender", title: senderDetail(m) }, sender(m)), showSource && m.accountName ? h("span", { className: "wbml-source", title: m.accountName }, m.accountName) : null),
    h("span", { className: "wbml-line" }, h("span", { className: "wbml-subject" }, m.subject || "(无主题)"), h("span", { className: "wbml-snippet" }, m.preview)),
    hasAttachment === true ? h("span", { className: "wbml-attachment", title: attachmentName || "有附件", role: "img", "aria-label": attachmentName ? "附件：" + attachmentName : "有附件" },
      h(Paperclip, { size: 14, "aria-hidden": true }), attachmentName ? h("span", { className: "wbml-attachment-name" }, attachmentName) : null) : null,
    h("time", { className: "wbml-time", title: valid ? date.toLocaleString(locale) : day, dateTime: valid ? date.toISOString() : undefined }, shortDate));
    rows.push(options.wrapRow ? options.wrapRow(m, row) : row);
  }
  return rows;
};
