"use strict";

const roleLabels = { inbox: "收件箱", drafts: "草稿箱", sent: "已发送", trash: "废纸篓" };

module.exports = function FolderShortcuts({ h, folders, accountId, selected, onChange }) {
  const entries = [];
  for (const role of Object.keys(roleLabels)) {
    const boxes = folders.filter((box) => box.account_id === accountId && box.name &&
      (box.role === role || (role === "sent" && box.localOnly && box.name === "Sent")));
    for (const box of boxes) {
      let label = roleLabels[role];
      if (boxes.length > 1) label += " · " + box.name;
      if (box.localOnly) label += "（仅本地）";
      const active = box.name === selected;
      entries.push(h("button", {
        type: "button", key: box.name, title: box.name,
        className: "wbml-btn" + (active ? " primary" : ""),
        "aria-current": active ? "page" : undefined,
        onClick: () => { if (!active) onChange(box.name); },
      }, label));
    }
  }
  return entries.length ? h("nav", { className: "wbml-body-tools", "aria-label": "常用文件夹" }, entries) : null;
};
