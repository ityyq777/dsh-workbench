"use strict";
// 邮件详情动作条：标为已读 / 移动到文件夹 / 移入废纸篓，末尾留一个跨插件插槽落点。
//
// 抽成独立模块的理由：messages.cjs 已经接近单文件上限，而这段是纯渲染、只依赖少数几个
// 局部 helper，搬出来不影响状态逻辑。落点只传 item 引用，不传正文——贡献方要正文自己调
// 自己的 action，走它自己的审计。
module.exports = function detailTools(o) {
  var h = o.h;
  var button = o.button;
  var current = o.current;
  var unread = o.unread;

  return h(
    "div",
    { className: "wbml-tools" },
    button(
      unread ? "标为已读" : "标为未读",
      function () { o.mutate("mail.messageMarkRead", { id: current.id, read: unread }, false, o.selected); },
      o.busy,
      undefined,
      unread ? o.MailOpen : o.Mail,
    ),
    h(
      "select",
      {
        "aria-label": "目标文件夹",
        className: "wbml-input",
        value: o.target,
        onChange: function (e) { o.setTarget(e.target.value); },
      },
      h("option", { value: "" }, "选择目标文件夹"),
      o.folders
        .filter(function (f) {
          return !f.localOnly && f.account_id === current.accountId && f.name !== current.mailbox;
        })
        .map(function (f) {
          return h("option", { key: f.id, value: f.name }, f.name);
        }),
    ),
    button(
      "移动",
      function () { o.mutate("mail.messageMove", { id: current.id, mailbox: o.target }, true, o.selected); },
      o.busy || !o.target,
      undefined,
      o.Move,
    ),
    button(
      "移入废纸篓",
      function () { o.mutate("mail.messageDelete", { id: current.id }, true, o.selected); },
      o.busy,
      undefined,
      o.Trash,
    ),
    // 跨插件插槽：别的插件（目前是任务）把按钮挂到邮件详情动作条上。
    // 没装贡献方时落点自己渲染 null，不占位。
    h(o.Slot, {
      slot: "item.actions",
      ownerId: "wb-addon-mail",
      lang: o.lang,
      item: {
        kind: "mail.message",
        id: String(current.id),
        title: String(current.subject || ""),
        subtitle: o.senderDetail(current),
      },
    }),
  );
};
