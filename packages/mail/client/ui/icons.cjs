"use strict";
// 图标表：用哪个引哪个，图标随本插件 client.js 打包（共享层只放渲染工厂）。
var icons = require("../../../lib/icons.cjs");

var set = icons.create("wbml", {
  "database": require("lucide-react/icons/database").default,
  "download": require("lucide-react/icons/download").default,
  "folder": require("lucide-react/icons/folder").default,
  "folder-input": require("lucide-react/icons/folder-input").default,
  "forward": require("lucide-react/icons/forward").default,
  "inbox": require("lucide-react/icons/inbox").default,
  "list": require("lucide-react/icons/list").default,
  "lock": require("lucide-react/icons/lock").default,
  "mail": require("lucide-react/icons/mail").default,
  "mail-open": require("lucide-react/icons/mail-open").default,
  "paperclip": require("lucide-react/icons/paperclip").default,
  "refresh-cw": require("lucide-react/icons/refresh-cw").default,
  "reply": require("lucide-react/icons/reply").default,
  "reply-all": require("lucide-react/icons/reply-all").default,
  "search": require("lucide-react/icons/search").default,
  "sliders": require("lucide-react/icons/sliders").default,
  "send": require("lucide-react/icons/send").default,
  "trash-2": require("lucide-react/icons/trash-2").default,
  "users": require("lucide-react/icons/users").default,
});

module.exports = { ICONS: set.ICONS, Icon: set.Icon };
