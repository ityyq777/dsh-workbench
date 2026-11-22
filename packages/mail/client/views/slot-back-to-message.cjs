"use strict";
/**
 * 插槽贡献：在任务详情里显示「原邮件」回链。
 *
 * 方向是反的——任务提供 `item.actions` 落点，邮件自己认出描述里的 `wb-mail:<messageId>`，
 * 任务侧不需要知道任何来源格式。以后加「从站点建任务」「从日历建任务」时，各自写自己的
 * 贡献组件即可，任务客户端零改动。
 *
 * 只对 `item.kind === "task"` 生效；没有标记时返回 null，不占位。
 */
module.exports = function (deps) {
  var React = deps.React;
  var h = deps.h || React.createElement;
  var C = deps.C;
  var Icon = deps.Icon;

  var REF = /wb-mail:([A-Za-z0-9_.:-]+)/;

  return function MailBackToMessage(props) {
    var item = props.item;
    if (!item || item.kind !== "task") return null;
    var m = REF.exec(String(item.description || ""));
    if (!m) return null;
    var messageId = m[1];
    var en = props.lang === "en";
    return h(
      C.Btn,
      {
        h: h,
        kind: "ghost",
        onClick: function (e) {
          if (e && e.stopPropagation) e.stopPropagation();
          // onNavigate 由宿主按"贡献方的域"绑定，只传视图 id 与参数，不用自己拼 addonId。
          props.onNavigate("messages", { messageId: messageId });
        },
      },
      h("span", { className: "wbml-slot-back", title: en ? "Back to the message this task came from" : "回到创建这条任务的邮件" },
        h(Icon, { name: "mail" }),
        en ? "Original mail" : "原邮件"),
    );
  };
};
