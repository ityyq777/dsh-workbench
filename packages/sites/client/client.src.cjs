// dsh-workbench-sites 浏览器侧源码。构建：node scripts/build-addon-clients.mjs → lib/client.js
var React = require("react");
var h = React.createElement;
var TagFilter = require("./ui/tagfilter.cjs");

(function () {
  var host = window.__WB_HOST__;
  if (!host) {
    console.error("[wb-addon-sites] 缺少 window.__WB_HOST__，无法注册站点视图");
    module.exports = { name: "dsh-workbench-sites", inject: [], apply: function () {} };
    return;
  }
  var React = require("react");
  var h = React.createElement;
  var statsView = require("./views/stats.cjs");
  var configView = require("./views/config.cjs");
  var dataView = require("./views/data.cjs");

  // 图标定义收在 ui/icons.cjs：标签页图标与客户端共用同一份映射。
  var icons = require("./ui/icons.cjs"), Icon = icons.Icon, tabIcon = icons.tabIcon;

  var useState = React.useState;
  var useEffect = React.useEffect;
  var useRef = React.useRef;
  var useMemo = React.useMemo;

  var COPY = require("./ui/copy.cjs");

  function text(lang, key, vars) {
    var dict = COPY[lang] || COPY.zh;
    var value = dict[key] !== undefined ? dict[key] : COPY.zh[key] || key;
    if (vars) {
      Object.keys(vars).forEach(function (k) {
        value = value.split("{" + k + "}").join(String(vars[k]));
      });
    }
    return value;
  }

  // 站点依赖标签子插件：以宿主已安装/启用列表为准；旧宿主没有列表时返回 true，交给后端 capabilities 判断。
  function hostHasAddon(id) {
    var list = host.addons;
    if (!Array.isArray(list)) return true;
    return list.some(function (a) { return a && a.id === id && a.enabled !== false; });
  }

  var cssText = require("./ui/styles.cjs");

  function injectCss() {
    var id = "wb-addon-sites-css";
    var el = document.getElementById(id);
    if (!el) {
      el = document.createElement("style");
      el.id = id;
      document.head.appendChild(el);
    }
    if (el.textContent !== cssText) el.textContent = cssText;
  }

  function errText(e) {
    if (!e) return "未知错误";
    return String(e.message || e);
  }

  function callApi(api, name, args) {
    return api.call(name, args || {}).then(function (r) {
      if (!r || r.ok !== true) throw new Error((r && r.error) || "请求失败");
      return r.result;
    });
  }

  function pathLabel(path) {
    return (path || []).map(function (p) { return p.name; }).join(" / ");
  }

  function flattenTree(nodes, depth, out) {
    out = out || [];
    (nodes || []).forEach(function (node) {
      out.push({ node: node, depth: depth || 0 });
      if (node.children && node.children.length) flattenTree(node.children, (depth || 0) + 1, out);
    });
    return out;
  }

  function Modal(props) {
    return h("div", {
      className: "wbs-mask",
      onMouseDown: function (e) {
        if (e.target === e.currentTarget && props.onClose) props.onClose();
      },
    }, h("div", { className: "wbs-modal" + (props.small ? " small" : "") }, props.children));
  }

  function SiteFormModal(props) {
    var api = props.api;
    var lang = props.lang || "zh";
    var mode = props.mode;
    var site = props.site;
    var current = props.current || { id: "0", path: [] };
    var tagOn = !!props.tagOn;
    var maxStep = tagOn ? 2 : 1;
    var [step, setStep] = useState(0);
    var [name, setName] = useState(site ? site.siteName : "");
    var [desc, setDesc] = useState(site ? site.description : "");
    var [links, setLinks] = useState(function () {
      if (site && site.siteLinks && site.siteLinks.length) {
        return site.siteLinks.map(function (l) {
          return { description: l.description || "", link: l.link || "" };
        });
      }
      return [{ description: "", link: "" }];
    });
    var [defaultIdx, setDefaultIdx] = useState(function () {
      if (site && site.siteLinks) {
        var idx = site.siteLinks.findIndex(function (l) { return l.isDefault; });
        if (idx >= 0) return idx;
      }
      return 0;
    });
    var [dirTree, setDirTree] = useState([]);
    var [dirIds, setDirIds] = useState(function () {
      if (site && site.dirs && site.dirs.length) return site.dirs.map(function (d) { return d.id; });
      return current.id !== "0" ? [current.id] : [];
    });
    var [tags, setTags] = useState(site && site.tags ? site.tags.slice() : []);
    var [tagQuery, setTagQuery] = useState("");
    var [tagResults, setTagResults] = useState([]);
    var [error, setError] = useState("");
    var [saving, setSaving] = useState(false);

    useEffect(function () {
      callApi(api, "siteNodes.tree").then(function (rows) { setDirTree(rows || []); }).catch(function (e) {
        setError(errText(e));
      });
    }, []);

    useEffect(function () {
      if (!tagOn) {
        setTagResults([]);
        return;
      }
      var alive = true;
      var timer = setTimeout(function () {
        callApi(api, "siteTags.search", { text: tagQuery, pageSize: 50 }).then(function (r) {
          if (alive) setTagResults(r.records || []);
        }).catch(function () {
          if (alive) setTagResults([]);
        });
      }, 220);
      return function () { alive = false; clearTimeout(timer); };
    }, [tagQuery, tagOn]);

    var flatDirs = useMemo(function () { return flattenTree(dirTree, 0); }, [dirTree]);

    function toggleDir(id) {
      setDirIds(function (prev) {
        if (prev.indexOf(id) >= 0) return prev.filter(function (x) { return x !== id; });
        return prev.concat([id]);
      });
    }

    function toggleTag(tag) {
      setTags(function (prev) {
        if (prev.some(function (x) { return x.id === tag.id; })) {
          return prev.filter(function (x) { return x.id !== tag.id; });
        }
        return prev.concat([tag]);
      });
    }

    function updateLink(index, key, value) {
      setLinks(function (prev) {
        return prev.map(function (l, i) { return i === index ? Object.assign({}, l, { [key]: value }) : l; });
      });
    }

    function addLink() {
      setLinks(function (prev) { return prev.concat([{ description: "", link: "" }]); });
    }

    function removeLink(index) {
      setLinks(function (prev) {
        var next = prev.filter(function (_, i) { return i !== index; });
        return next.length ? next : [{ description: "", link: "" }];
      });
      if (defaultIdx === index) setDefaultIdx(0);
      else if (defaultIdx > index) setDefaultIdx(defaultIdx - 1);
    }

    function validate(toStep) {
      if (toStep >= 1 && !String(name).trim()) {
        setError(text(lang, "requiredName"));
        return false;
      }
      if (toStep >= 2 && !dirIds.length) {
        setError(text(lang, "requiredDirs"));
        return false;
      }
      setError("");
      return true;
    }

    function next() {
      if (step >= maxStep) return;
      if (!validate(step + 1)) return;
      setStep(step + 1);
    }

    function save() {
      if (!validate(2)) return;
      setSaving(true);
      setError("");
      var siteLinks = links.filter(function (l) {
        return String(l.link || "").trim() || String(l.description || "").trim();
      }).map(function (l, i) {
        return { description: String(l.description || "").trim(), link: String(l.link || "").trim(), isDefault: i === defaultIdx };
      });
      var payload = {
        siteName: String(name).trim(),
        description: String(desc || "").trim(),
        siteLinks: siteLinks,
        dirIds: dirIds,
      };
      if (tagOn) payload.tagIds = tags.map(function (t) { return t.id; });
      var p;
      if (mode === "edit" && site) {
        p = callApi(api, "sites.update", Object.assign({ id: site.id }, payload));
      } else {
        p = callApi(api, "sites.create", payload);
      }
      p.then(function () {
        setSaving(false);
        props.onSaved();
      }).catch(function (e) {
        setSaving(false);
        setError(errText(e));
      });
    }

    var steps = tagOn
      ? [text(lang, "step1"), text(lang, "step2"), text(lang, "step3")]
      : [text(lang, "step1"), text(lang, "step2")];
    var title = mode === "edit" ? text(lang, "editTitle") : text(lang, "createTitle");

    return h(Modal, { onClose: saving ? null : props.onClose },
      h("div", { className: "wbs-modal-title" },
        h(Icon, { name: mode === "edit" ? "edit" : "plus", size: 15 }),
        title,
        h("button", { type: "button", className: "wbs-mini wbs-modal-x", title: text(lang, "cancel"), onClick: props.onClose }, h(Icon, { name: "x", size: 15 })),
      ),
      h("div", { className: "wbs-steps" }, steps.map(function (s, i) {
        return h("span", { key: i, className: "wbs-step" + (i === step ? " on" : "") }, (i + 1) + " · " + s);
      })),

      step === 0 ? h("div", null,
        h("label", { className: "wbs-label" }, text(lang, "siteName")),
        h("input", {
          className: "wbs-input",
          value: name,
          autoFocus: true,
          placeholder: text(lang, "siteNamePh"),
          onChange: function (e) { setName(e.target.value); },
        }),
        h("label", { className: "wbs-label" }, text(lang, "desc")),
        h("textarea", {
          className: "wbs-textarea",
          value: desc,
          placeholder: text(lang, "descPh"),
          onChange: function (e) { setDesc(e.target.value); },
        }),
        h("label", { className: "wbs-label" }, text(lang, "linkList")),
        links.map(function (l, i) {
          return h("div", { className: "wbs-linkrow", key: i },
            h("input", {
              className: "wbs-input",
              value: l.description,
              placeholder: text(lang, "linkDesc"),
              onChange: function (e) { updateLink(i, "description", e.target.value); },
            }),
            h("input", {
              className: "wbs-input",
              value: l.link,
              placeholder: text(lang, "linkUrl"),
              onChange: function (e) { updateLink(i, "link", e.target.value); },
            }),
            h("label", { className: "wbs-radio", title: text(lang, "setDefault") },
              h("input", {
                type: "radio",
                name: "wbs-default-link",
                checked: defaultIdx === i,
                onChange: function () { setDefaultIdx(i); },
              }),
              text(lang, "default"),
            ),
            h("button", { type: "button", className: "wbs-mini", title: text(lang, "removeLink"), onClick: function () { removeLink(i); } }, h(Icon, { name: "x", size: 13 })),
          );
        }),
        h("button", { type: "button", className: "wbs-btn sm", onClick: addLink }, h(Icon, { name: "plus", size: 13 }), text(lang, "addLink")),
      ) : null,

      step === 1 ? h("div", null,
        h("div", { className: "wbs-label" }, text(lang, "chooseDirs")),
        !flatDirs.length ? h("div", { className: "wbs-note" }, text(lang, "noDirs")) : h("div", { className: "wbs-dirlist" },
          flatDirs.map(function (item) {
            var id = String(item.node.id);
            return h("label", {
              key: id,
              className: "wbs-dircheck",
              style: { paddingLeft: 6 + item.depth * 16 },
            },
              h("input", {
                type: "checkbox",
                checked: dirIds.indexOf(id) >= 0,
                onChange: function () { toggleDir(id); },
              }),
              h("span", null, item.node.name),
            );
          }),
        ),
        h("div", { className: "wbs-note", style: { marginTop: 8 } }, "站点可同时挂在多个目录下；列表会按目录子树过滤。"),
      ) : null,

      tagOn && step === 2 ? h("div", null,
        h("div", { className: "wbs-label" }, text(lang, "chooseTags")),
        tags.length ? h("div", { className: "wbs-chips" }, tags.map(function (t) {
          return h("span", { className: "wbs-chip", key: t.id }, t.name,
            h("button", { type: "button", onClick: function () { toggleTag(t); }, title: "移除" }, h(Icon, { name: "x", size: 12 })));
        })) : h("div", { className: "wbs-note" }, "暂未选择标签"),
        h("div", { className: "wbs-tagsearch", style: { marginTop: 10 } },
          h("input", {
            className: "wbs-input",
            value: tagQuery,
            placeholder: text(lang, "tagSearch"),
            onChange: function (e) { setTagQuery(e.target.value); },
          }),
        ),
        h("div", { className: "wbs-tagresults" }, tagResults.length ? tagResults.map(function (t) {
          var on = tags.some(function (x) { return x.id === t.id; });
          return h("button", {
            key: t.id,
            type: "button",
            className: "wbs-tagresult" + (on ? " on" : ""),
            onClick: function () { toggleTag(t); },
          },
            h(Icon, { name: on ? "check" : "plus", size: 12 }),
            h("span", null, t.name),
          );
        }) : h("div", { className: "wbs-note", style: { padding: 6 } }, text(lang, "noTags"))),
        h("div", { className: "wbs-note", style: { marginTop: 8 } }, "标签由标签子插件提供，可多选。"),
      ) : null,

      h("div", { className: "wbs-formfoot" },
        h("div", { className: "wbs-formerr" }, error || ""),
        step > 0 ? h("button", { type: "button", className: "wbs-btn", disabled: saving, onClick: function () { setStep(step - 1); } }, h(Icon, { name: "chevron-left", size: 13 }), text(lang, "back")) : null,
        h("button", { type: "button", className: "wbs-btn", disabled: saving, onClick: props.onClose }, text(lang, "cancel")),
        step < maxStep
          ? h("button", { type: "button", className: "wbs-btn primary", onClick: next }, text(lang, "nextStep"), h(Icon, { name: "chevron-right", size: 13 }))
          : h("button", { type: "button", className: "wbs-btn primary", disabled: saving, onClick: save }, h(Icon, { name: "check", size: 13 }), saving ? text(lang, "saving") : text(lang, "save")),
      ),
    );
  }

  function DirModal(props) {
    var api = props.api;
    var lang = props.lang || "zh";
    var dlg = props.dlg;
    var [name, setName] = useState(dlg.name || "");
    var [error, setError] = useState("");
    var [saving, setSaving] = useState(false);
    var isDelete = dlg.mode === "delete";
    var title = isDelete ? text(lang, "removeDirTitle") : dlg.mode === "rename" ? text(lang, "renameTitle") : text(lang, "addDir");

    function submit() {
      if (!isDelete && !String(name).trim()) {
        setError(text(lang, "requiredName"));
        return;
      }
      setSaving(true);
      setError("");
      var p;
      if (isDelete) p = callApi(api, "siteNodes.delete", { id: dlg.id });
      else if (dlg.mode === "rename") p = callApi(api, "siteNodes.rename", { id: dlg.id, name: String(name).trim() });
      else p = callApi(api, "siteNodes.create", { parentId: dlg.parentId || "0", name: String(name).trim() });
      p.then(function () {
        setSaving(false);
        props.onDone();
      }).catch(function (e) {
        setSaving(false);
        setError(errText(e));
      });
    }

    return h(Modal, { small: true, onClose: saving ? null : props.onClose },
      h("div", { className: "wbs-modal-title" },
        h(Icon, { name: isDelete ? "trash" : dlg.mode === "rename" ? "edit" : "folder-plus", size: 15 }),
        title,
        h("button", { type: "button", className: "wbs-mini wbs-modal-x", title: text(lang, "cancel"), onClick: props.onClose }, h(Icon, { name: "x", size: 15 })),
      ),
      isDelete
        ? h("div", { className: "wbs-modal-sub" }, text(lang, "removeDirText", { name: dlg.name || "" }))
        : h("div", null,
          h("label", { className: "wbs-label" }, text(lang, "dirName")),
          h("input", {
            className: "wbs-input",
            value: name,
            autoFocus: true,
            placeholder: "未命名",
            onChange: function (e) { setName(e.target.value); },
            onKeyDown: function (e) { if (e.key === "Enter") submit(); },
          }),
        ),
      h("div", { className: "wbs-formfoot" },
        h("div", { className: "wbs-formerr" }, error || ""),
        h("button", { className: "wbs-btn", disabled: saving, onClick: props.onClose }, text(lang, "cancel")),
        h("button", { className: "wbs-btn primary" + (isDelete ? " danger" : ""), disabled: saving, onClick: submit },
          h(Icon, { name: isDelete ? "trash" : dlg.mode === "rename" ? "check" : "plus", size: 13 }),
          saving ? "…" : isDelete ? text(lang, "confirm") : dlg.mode === "rename" ? text(lang, "save") : text(lang, "create")),
      ),
    );
  }

  function AccountModal(props) {
    var api = props.api;
    var lang = props.lang || "zh";
    var site = props.site;
    var [accounts, setAccounts] = useState([]);
    var [vault, setVault] = useState({});
    var [loading, setLoading] = useState(true);
    var [error, setError] = useState("");
    var [busy, setBusy] = useState(false);
    var [draft, setDraft] = useState(null);
    var [pass, setPass] = useState("");
    var [pass2, setPass2] = useState("");
    var [cascade, setCascade] = useState([]);
    var [pickKey, setPickKey] = useState("");
    var [pendingDelete, setPendingDelete] = useState("");
    var [shown, setShown] = useState({});

    function reload() {
      setLoading(true);
      return Promise.all([
        callApi(api, "sites.accounts.list", { siteId: site.id }),
        callApi(api, "sites.vault.status", {}),
      ]).then(function (out) {
        setAccounts(out[0].accounts || []);
        setVault(out[1] || {});
        setError("");
      }).catch(function (e) {
        setError(errText(e));
      }).finally(function () {
        setLoading(false);
      });
    }

    function loadCascade() {
      callApi(api, "sites.accounts.cascade", { excludeSiteId: site.id }).then(function (r) {
        var list = [];
        (r.groups || []).forEach(function (g) {
          g.accounts.forEach(function (a) { list.push({ id: a.id, label: g.siteName + " · " + a.accountKey }); });
        });
        setCascade(list);
      }).catch(function () { setCascade([]); });
    }

    useEffect(function () { reload(); loadCascade(); }, [site.id]);

    function guard(fn) {
      setBusy(true);
      setError("");
      return Promise.resolve().then(fn).catch(function (e) {
        setError(errText(e));
      }).finally(function () { setBusy(false); });
    }

    function submitVault() {
      if (!pass || pass.length < 8) { setError(text(lang, "passTooShort")); return; }
      if (!vault.enabled && pass !== pass2) { setError(text(lang, "passMismatch")); return; }
      guard(function () {
        var name = vault.enabled ? "sites.vault.unlock" : "sites.vault.setup";
        var args = vault.enabled ? { passphrase: pass } : { passphrase: pass };
        return callApi(api, name, args).then(function () { setPass(""); setPass2(""); return reload(); });
      });
    }

    function lockVault() {
      guard(function () { return callApi(api, "sites.vault.lock", {}).then(function () { setShown({}); return reload(); }); });
    }

    function saveDraft() {
      var body = {
        accountKey: draft.accountKey, account: draft.account, remark: draft.remark,
      };
      if (draft.password) body.password = draft.password;
      if (draft.phoneNumber) body.phoneNumber = draft.phoneNumber;
      if (draft.identityCard) body.identityCard = draft.identityCard;
      guard(function () {
        var req = draft.id
          ? callApi(api, "sites.accounts.update", Object.assign({ id: draft.id }, body))
          : callApi(api, "sites.accounts.create", Object.assign({ siteId: site.id }, body));
        return req.then(function () { setDraft(null); props.onChanged && props.onChanged(); return reload(); });
      });
    }

    function removeAccount(id) {
      guard(function () {
        return callApi(api, "sites.accounts.delete", { id: id }).then(function () {
          setPendingDelete("");
          props.onChanged && props.onChanged();
          return reload();
        });
      });
    }

    function reveal(acc) {
      guard(function () {
        return callApi(api, "sites.accounts.reveal", { id: acc.id }).then(function (r) {
          setShown(function (prev) { var next = Object.assign({}, prev); next[acc.id] = r; return next; });
        });
      });
    }

    function copyText(value) {
      if (!value) return;
      try { navigator.clipboard.writeText(value); showToast(text(lang, "copied")); } catch (e) { setError(String(e && e.message || e)); }
    }

    function linkExternal(acc) {
      if (!pickKey) return;
      guard(function () {
        return callApi(api, "sites.accounts.link", { nativeAccountId: acc.id, externalAccountId: pickKey }).then(function () { setPickKey(""); return reload(); });
      });
    }

    function unlink(acc, rel) {
      guard(function () {
        return callApi(api, "sites.accounts.unlink", { nativeAccountId: acc.id, externalAccountId: rel.accountId }).then(function () { return reload(); });
      });
    }

    function renderVaultBar() {
      if (!vault.enabled) {
        return h("div", { className: "wbs-vaultbar" },
          h("div", { className: "wbs-vault-hint" }, text(lang, "vaultNotSet")),
          h("div", { className: "wbs-vault-form" },
            h("input", { className: "wbs-input", type: "password", placeholder: text(lang, "passphrase"), value: pass, onChange: function (e) { setPass(e.target.value); } }),
            h("input", { className: "wbs-input", type: "password", placeholder: text(lang, "passphraseAgain"), value: pass2, onChange: function (e) { setPass2(e.target.value); } }),
            h("button", { className: "wbs-btn", disabled: busy, onClick: submitVault }, text(lang, "vaultSetup")),
          ),
        );
      }
      if (!vault.unlocked) {
        return h("div", { className: "wbs-vaultbar locked" },
          h("div", { className: "wbs-vault-hint" }, text(lang, "vaultLocked")),
          h("div", { className: "wbs-vault-form" },
            h("input", { className: "wbs-input", type: "password", placeholder: text(lang, "passphrase"), value: pass, onChange: function (e) { setPass(e.target.value); } }),
            h("button", { className: "wbs-btn", disabled: busy, onClick: submitVault }, text(lang, "vaultUnlock")),
          ),
        );
      }
      return h("div", { className: "wbs-vaultbar unlocked" },
        h("div", { className: "wbs-vault-hint" }, text(lang, "vaultUnlocked", { min: vault.idleMinutes || 15 })),
        h("button", { className: "wbs-btn sm", disabled: busy, onClick: lockVault }, h(Icon, { name: "lock", size: 12 }), text(lang, "vaultLock")),
      );
    }

    function renderDraft() {
      var d = draft;
      function field(key, label, type, ph) {
        return h(React.Fragment, null,
          h("label", { className: "wbs-label" }, label),
          h("input", {
            className: "wbs-input", type: type || "text", placeholder: ph || "", value: d[key] || "",
            onChange: function (e) { var v = e.target.value; setDraft(function (prev) { var next = Object.assign({}, prev); next[key] = v; return next; }); },
          }),
        );
      }
      return h("div", { className: "wbs-accdraft" },
        h("div", { className: "wbs-accdraft-title" }, d.id ? text(lang, "editAccount") : text(lang, "addAccount")),
        field("accountKey", text(lang, "accountKey") + " *", "text", "prod-admin"),
        field("account", text(lang, "loginName")),
        field("password", text(lang, "password"), "password"),
        field("phoneNumber", text(lang, "phone")),
        field("identityCard", text(lang, "identity")),
        field("remark", text(lang, "remark")),
        h("div", { className: "wbs-vault-hint" }, text(lang, "sensitiveHint")),
        h("div", { className: "wbs-formfoot" },
          h("div", { className: "wbs-grow" }),
          h("button", { className: "wbs-btn", disabled: busy, onClick: function () { setDraft(null); } }, text(lang, "cancel")),
          h("button", { className: "wbs-btn primary", disabled: busy, onClick: saveDraft }, text(lang, "save")),
        ),
      );
    }

    return h(Modal, { onClose: props.onClose },
      h("div", { className: "wbs-modal-title" },
        h(Icon, { name: "key", size: 15 }),
        text(lang, "accountsTitle", { name: site.siteName }),
        h("button", { type: "button", className: "wbs-mini wbs-modal-x", title: text(lang, "cancel"), onClick: props.onClose }, h(Icon, { name: "x", size: 15 })),
      ),
      h("div", { className: "wbs-modal-sub" }, text(lang, "accountsSub")),
      renderVaultBar(),
      error ? h("div", { className: "wbs-error" }, error) : null,
      draft ? renderDraft() : h(React.Fragment, null,
        loading ? h("div", { className: "wbs-loading" }, text(lang, "loading")) : null,
        !loading && !accounts.length ? h("div", { className: "wbs-acc-empty" }, text(lang, "accountEmpty")) : null,
        !loading ? accounts.map(function (acc) {
          var plain = shown[acc.id] || null;
          return h("div", { className: "wbs-accrow", key: acc.id },
            h("div", { className: "wbs-accrow-head" },
              h("b", null, acc.accountKey || "—"),
              acc.account ? h("span", { className: "wbs-acc-login" }, acc.account) : null,
              h("div", { className: "wbs-grow" }),
              h("button", { className: "wbs-btn sm icononly", title: text(lang, "edit"), onClick: function () { setDraft({ id: acc.id, accountKey: acc.accountKey, account: acc.account, remark: acc.remark, password: "", phoneNumber: "", identityCard: "" }); } }, h(Icon, { name: "edit", size: 12 })),
              pendingDelete === acc.id
                ? h(React.Fragment, null,
                  h("button", { className: "wbs-btn sm danger", disabled: busy, onClick: function () { removeAccount(acc.id); } }, text(lang, "confirm")),
                  h("button", { className: "wbs-btn sm", onClick: function () { setPendingDelete(""); } }, text(lang, "cancel")),
                )
                : h("button", { className: "wbs-btn sm danger icononly", title: text(lang, "del"), onClick: function () { setPendingDelete(acc.id); } }, h(Icon, { name: "trash", size: 12 })),
            ),
            h("div", { className: "wbs-accrow-fields" },
              h("div", null, h("i", null, text(lang, "password")), h("span", null, plain ? (plain.password || "—") : (acc.hasPassword ? "••••••" : "—")),
                acc.hasPassword ? h("button", { className: "wbs-mini", title: text(lang, "reveal"), onClick: function () { if (plain) { setShown(function (prev) { var next = Object.assign({}, prev); delete next[acc.id]; return next; }); } else { reveal(acc); } } }, h(Icon, { name: plain ? "eye-off" : "eye", size: 11 })) : null,
                acc.hasPassword ? h("button", { className: "wbs-mini", title: text(lang, "copy"), onClick: function () { if (plain) copyText(plain.password); else reveal(acc); } }, h(Icon, { name: "copy", size: 11 })) : null,
              ),
              h("div", null, h("i", null, text(lang, "phone")), h("span", null, plain ? (plain.phoneNumber || "—") : (acc.phoneNumber || "—"))),
              h("div", null, h("i", null, text(lang, "identity")), h("span", null, plain ? (plain.identityCard || "—") : (acc.identityCard || "—"))),
              acc.remark ? h("div", { className: "wbs-acc-remark" }, h("i", null, text(lang, "remark")), h("span", null, acc.remark)) : null,
            ),
            h("div", { className: "wbs-accrow-ext" },
              (acc.externals || []).map(function (rel) {
                return h("span", { className: "wbs-chip", key: rel.relationId },
                  rel.siteName + " · " + rel.accountKey,
                  h("button", { className: "wbs-mini", title: text(lang, "unlink"), onClick: function () { unlink(acc, rel); } }, h(Icon, { name: "x", size: 10 })),
                );
              }),
              h("select", { className: "wbs-select wbs-acc-extsel", value: pickKey, onChange: function (e) { setPickKey(e.target.value); } },
                h("option", { value: "" }, text(lang, "externalPick")),
                cascade.map(function (o) { return h("option", { key: o.id, value: o.id }, o.label); }),
              ),
              h("button", { className: "wbs-btn sm", disabled: !pickKey || busy, onClick: function () { linkExternal(acc); } }, text(lang, "externalAdd")),
            ),
          );
        }) : null,
        !loading ? h("div", { className: "wbs-formfoot" },
          h("button", { className: "wbs-btn primary", disabled: busy, onClick: function () { setDraft({ id: "", accountKey: "", account: "", password: "", phoneNumber: "", identityCard: "", remark: "" }); } }, h(Icon, { name: "plus", size: 12 }), text(lang, "addAccount")),
          h("div", { className: "wbs-grow" }),
          h("button", { className: "wbs-btn", onClick: props.onClose }, text(lang, "close")),
        ) : null,
      ),
    );
  }

  function DeleteSiteModal(props) {
    var api = props.api;
    var lang = props.lang || "zh";
    var site = props.site;
    var [saving, setSaving] = useState(false);
    var [error, setError] = useState("");

    function submit() {
      setSaving(true);
      setError("");
      callApi(api, "sites.delete", { id: site.id }).then(function () {
        setSaving(false);
        props.onDone();
      }).catch(function (e) {
        setSaving(false);
        setError(errText(e));
      });
    }

    return h(Modal, { small: true, onClose: saving ? null : props.onClose },
      h("div", { className: "wbs-modal-title" },
        h(Icon, { name: "trash", size: 15 }),
        text(lang, "deleteTitle"),
        h("button", { type: "button", className: "wbs-mini wbs-modal-x", title: text(lang, "cancel"), onClick: props.onClose }, h(Icon, { name: "x", size: 15 })),
      ),
      h("div", { className: "wbs-modal-sub" }, text(lang, "deleteText", { name: site.siteName })),
      error ? h("div", { className: "wbs-error" }, error) : null,
      h("div", { className: "wbs-formfoot" },
        h("div", { className: "wbs-grow" }),
        h("button", { className: "wbs-btn", disabled: saving, onClick: props.onClose }, text(lang, "cancel")),
        h("button", { className: "wbs-btn danger", disabled: saving, onClick: submit }, h(Icon, { name: "trash", size: 13 }), saving ? "…" : text(lang, "confirm")),
      ),
    );
  }

  var CFG_FALLBACK = {
    "list.pageSize": 16, "list.sortColumn": "update_time", "list.sortOrder": "desc",
    "ui.confirmDelete": true, "ui.toastDuration": 2600,
    "stats.range": "30d", "stats.top": 10, "stats.showKpi": true,
    "stats.sections": ["links", "fresh", "nodes", "trend", "topTags", "stale", "dup", "orphan", "emptyNodes"],
  };

  function SitesView(props) {
    var lang = props.lang === "en" ? "en" : "zh";
    var cfg = configView.useConfig(props.api, CFG_FALLBACK);
    if (!cfg.ready) {
      return h("div", { style: { padding: "48px", textAlign: "center", fontSize: "12.5px", opacity: .6 } }, lang === "en" ? "Loading…" : "载入中…");
    }
    return h(SitesViewBody, Object.assign({}, props, { cfg: cfg.values }));
  }

  function SitesViewBody(props) {
    var api = props.api;
    var lang = props.lang || "zh";
    var cfg = props.cfg || {};
    var cfgSize = Math.floor(Number(cfg["list.pageSize"]));
    if (!(cfgSize > 0)) cfgSize = 16;
    var cfgSortCol = ["update_time", "create_time", "site_name"].indexOf(cfg["list.sortColumn"]) >= 0 ? cfg["list.sortColumn"] : "update_time";
    var cfgSortOrder = cfg["list.sortOrder"] === "asc" ? "asc" : "desc";
    var cfgConfirm = cfg["ui.confirmDelete"] !== false;
    var cfgToast = Math.floor(Number(cfg["ui.toastDuration"]));
    if (!(cfgToast >= 800)) cfgToast = 2600;
    var [kids, setKids] = useState({});
    var kidsRef = useRef({});
    var [expanded, setExpanded] = useState({});
    var [current, setCurrent] = useState({ id: "0", path: [] });
    var [sites, setSites] = useState([]);
    var [total, setTotal] = useState(0);
    var [page, setPage] = useState(1);
    var [pageSize, setPageSize] = useState(cfgSize);
    var [textQuery, setTextQuery] = useState("");
    var [searchInput, setSearchInput] = useState("");
    var [tagFilter, setTagFilter] = useState([]);
    var [tagReload, setTagReload] = useState(0);
    var [tagOn, setTagOn] = useState(false);
    var tagOnRef = useRef(false);
    var [sortCol, setSortCol] = useState(cfgSortCol);
    var [sortOrder, setSortOrder] = useState(cfgSortOrder);
    var [loading, setLoading] = useState(false);
    var [error, setError] = useState("");
    var [tick, setTick] = useState(0);
    var [expandedRow, setExpandedRow] = useState(null);
    var [selected, setSelected] = useState({});
    var [editing, setEditing] = useState(null);
    var [accSite, setAccSite] = useState(null);
    var [dirDlg, setDirDlg] = useState(null);
    var [deleting, setDeleting] = useState(null);
    var [toast, setToast] = useState(null);
    var dragRef = useRef("");

    var tagKey = tagFilter.slice().sort().join(",");

    function showToast(msg, kind) {
      setToast({ msg: msg, kind: kind || "" });
    }

    useEffect(function () {
      if (!toast) return;
      var timer = setTimeout(function () { setToast(null); }, cfgToast);
      return function () { clearTimeout(timer); };
    }, [toast, cfgToast]);

    function refreshTree() {
      return callApi(api, "siteNodes.children", { id: 0 }).then(function (root) {
        var map = { "0": root || [] };
        var ids = Object.keys(kidsRef.current).filter(function (id) { return id !== "0"; });
        return Promise.all(ids.map(function (id) {
          return callApi(api, "siteNodes.children", { id: id }).then(function (rows) {
            map[id] = rows || [];
          }).catch(function () {});
        })).then(function () {
          kidsRef.current = map;
          setKids(map);
        });
      }).catch(function (e) {
        showToast(text(lang, "loadFail", { msg: errText(e) }), "err");
      });
    }

    function loadChildren(id) {
      return callApi(api, "siteNodes.children", { id: id }).then(function (rows) {
        var map = Object.assign({}, kidsRef.current);
        map[id] = rows || [];
        kidsRef.current = map;
        setKids(map);
      });
    }

    useEffect(function () {
      refreshTree();
      callApi(api, "sites.capabilities").then(function (r) {
        var on = !!(r && r.tags) && hostHasAddon("wb-addon-tags");
        tagOnRef.current = on;
        setTagOn(on);
        if (!on) setTagFilter([]);
      }).catch(function () {
        tagOnRef.current = false;
        setTagOn(false);
      });
    }, []);

    useEffect(function () {
      var off = api.subscribe(function (msg) {
        if (!msg) return;
        if (msg.event === "sites-changed") setTick(function (x) { return x + 1; });
        if (msg.event === "tags-changed") setTagReload(function (x) { return x + 1; });
        if (msg.event === "site-nodes-changed") {
          setTick(function (x) { return x + 1; });
          refreshTree();
        }
      });
      return function () { if (typeof off === "function") off(); };
    }, []);

    useEffect(function () {
      var alive = true;
      setLoading(true);
      setError("");
      callApi(api, "sites.list", {
        nodeId: current.id,
        text: textQuery,
        tagIds: tagFilter,
        pageNumber: page,
        pageSize: pageSize,
        sortColumn: sortCol,
        sortOrder: sortOrder,
      }).then(function (r) {
        if (!alive) return;
        setSites(r.records || []);
        setTotal(Number(r.total || 0));
      }).catch(function (e) {
        if (!alive) return;
        setSites([]);
        setTotal(0);
        setError(text(lang, "loadFail", { msg: errText(e) }));
      }).finally(function () {
        if (alive) setLoading(false);
      });
      return function () { alive = false; };
    }, [current.id, textQuery, tagKey, page, pageSize, sortCol, sortOrder, tick]);

    useEffect(function () {
      if (current.id === "0") return;
      var alive = true;
      callApi(api, "siteNodes.path", { id: current.id }).then(function (rows) {
        if (!alive) return;
        if (!rows || !rows.length) {
          setCurrent({ id: "0", path: [] });
          return;
        }
        setCurrent({ id: current.id, path: rows });
      }).catch(function () {});
      return function () { alive = false; };
    }, [current.id, tick]);

    function selectDir(id) {
      if (id === "0") {
        setCurrent({ id: "0", path: [] });
        setPage(1);
        return;
      }
      callApi(api, "siteNodes.path", { id: id }).then(function (rows) {
        if (!rows || !rows.length) return;
        setCurrent({ id: id, path: rows });
        setPage(1);
      }).catch(function (e) {
        showToast(text(lang, "opFail", { msg: errText(e) }), "err");
      });
    }

    function toggleNode(node) {
      var open = !!expanded[node.id];
      if (!open && !Object.prototype.hasOwnProperty.call(kidsRef.current, node.id)) {
        loadChildren(node.id).catch(function (e) { showToast(errText(e), "err"); });
      }
      setExpanded(function (prev) {
        var next = Object.assign({}, prev);
        if (open) delete next[node.id];
        else next[node.id] = true;
        return next;
      });
    }

    function onDropNode(e, target) {
      e.preventDefault();
      e.stopPropagation();
      var sourceId = dragRef.current;
      dragRef.current = "";
      if (!sourceId || sourceId === target.id) return;
      var moveType = expanded[target.id] ? 0 : 2;
      callApi(api, "siteNodes.move", { sourceId: sourceId, targetId: target.id, moveType: moveType }).then(function () {
        showToast(text(lang, "moved"));
        refreshTree();
        setTick(function (x) { return x + 1; });
      }).catch(function (e) {
        showToast(text(lang, "opFail", { msg: errText(e) }), "err");
      });
    }

    function renderNode(node, depth) {
      var open = !!expanded[node.id];
      var list = kids[node.id] || [];
      return h("div", { key: node.id },
        h("div", {
          className: "wbs-node" + (current.id === String(node.id) ? " active" : ""),
          style: { paddingLeft: 4 + depth * 14 },
          draggable: true,
          onDragStart: function (e) { dragRef.current = String(node.id); e.dataTransfer.effectAllowed = "move"; },
          onDragOver: function (e) { e.preventDefault(); },
          onDrop: function (e) { onDropNode(e, node); },
        },
          h("span", { className: "wbs-caret" + (open ? " open" : ""), onClick: function (e) { e.stopPropagation(); toggleNode(node); } }, h(Icon, { name: "chevron-right", size: 13 })),
          h("span", { className: "wbs-node-ico" }, h(Icon, { name: open ? "folder-open" : "folder", size: 13 })),
          h("span", { className: "wbs-node-name", onClick: function () { selectDir(String(node.id)); }, title: node.name }, node.name),
          h("span", { className: "wbs-node-actions" },
            h("button", { className: "wbs-mini", title: text(lang, "addChild"), onClick: function (e) { e.stopPropagation(); setDirDlg({ mode: "create", parentId: String(node.id), name: "" }); } }, h(Icon, { name: "plus", size: 13 })),
            h("button", { className: "wbs-mini", title: text(lang, "rename"), onClick: function (e) { e.stopPropagation(); setDirDlg({ mode: "rename", id: String(node.id), name: node.name }); } }, h(Icon, { name: "edit", size: 13 })),
            h("button", { className: "wbs-mini", title: text(lang, "remove"), onClick: function (e) { e.stopPropagation(); setDirDlg({ mode: "delete", id: String(node.id), name: node.name }); } }, h(Icon, { name: "trash", size: 13 })),
          ),
        ),
        open ? list.map(function (child) { return renderNode(child, depth + 1); }) : null,
      );
    }

    function openCreate() { setEditing({ mode: "create", site: null }); }
    function openEdit(site) { setEditing({ mode: "edit", site: site }); }

    function onSaved() {
      setEditing(null);
      showToast(text(lang, "saved"));
      setTick(function (x) { return x + 1; });
    }

    function onDirDone() {
      var dlg = dirDlg;
      setDirDlg(null);
      setTick(function (x) { return x + 1; });
      refreshTree();
      if (dlg && dlg.mode === "create") {
        var parentId = String(dlg.parentId || "0");
        setExpanded(function (prev) {
          var next = Object.assign({}, prev);
          next[parentId] = true;
          return next;
        });
        loadChildren(parentId).catch(function () {});
      }
      if (dlg && dlg.mode === "delete" && current.path.some(function (p) { return String(p.id) === String(dlg.id); })) {
        setCurrent({ id: "0", path: [] });
      }
    }

    function onSiteDeleted() {
      setDeleting(null);
      showToast(text(lang, "deleted"));
      setTick(function (x) { return x + 1; });
      refreshTree();
    }

    function toggleSelected(id) {
      setSelected(function (prev) {
        var next = Object.assign({}, prev);
        if (next[id]) delete next[id];
        else next[id] = true;
        return next;
      });
    }

    var selectedIds = Object.keys(selected).filter(function (id) { return selected[id]; });
    var allSelected = sites.length > 0 && sites.every(function (s) { return selected[s.id]; });

    function toggleAll() {
      if (allSelected) {
        setSelected(function (prev) {
          var next = Object.assign({}, prev);
          sites.forEach(function (s) { delete next[s.id]; });
          return next;
        });
        return;
      }
      setSelected(function (prev) {
        var next = Object.assign({}, prev);
        sites.forEach(function (s) { next[s.id] = true; });
        return next;
      });
    }

    function removeSite(site) {
      callApi(api, "sites.delete", { id: site.id }).then(function () {
        onSiteDeleted();
      }).catch(function (e) {
        showToast(text(lang, "opFail", { msg: errText(e) }), "err");
      });
    }

    function deleteSelected() {
      if (!selectedIds.length) return;
      if (cfgConfirm && !window.confirm(text(lang, "bulkConfirm", { n: selectedIds.length }))) return;
      var chain = Promise.resolve();
      selectedIds.forEach(function (id) {
        chain = chain.then(function () { return callApi(api, "sites.delete", { id: id }); });
      });
      chain.then(function () {
        setSelected({});
        setTick(function (x) { return x + 1; });
        refreshTree();
        showToast(text(lang, "deleted"));
      }).catch(function (e) {
        showToast(text(lang, "opFail", { msg: errText(e) }), "err");
      });
    }

    function sortBy(col) {
      if (sortCol === col) setSortOrder(function (o) { return o === "asc" ? "desc" : "asc"; });
      else { setSortCol(col); setSortOrder("desc"); }
      setPage(1);
    }

    function sortIcon(col) {
      var on = sortCol === col;
      var name = !on ? "arrow-up-down" : sortOrder === "asc" ? "arrow-up" : "arrow-down";
      return h(Icon, { name: name, size: 12, className: "wbs-sort-ico" });
    }

    var pages = Math.max(1, Math.ceil(total / pageSize));
    var tagsVisible = tagOn && hostHasAddon("wb-addon-tags");
    var colCount = tagsVisible ? 6 : 5;

    return h("div", { className: "wbs-root" },
      h("div", { className: "wbs-head" },
        h("span", { className: "wbs-badge" }, h(Icon, { name: "folder-tree", size: 15 })),
        h("h2", null, text(lang, "title")),
        h("span", { className: "wbs-count" }, text(lang, "total", { n: total })),
        h("div", { className: "wbs-grow" }),
        h("button", { className: "wbs-btn primary", onClick: openCreate }, h(Icon, { name: "plus", size: 14 }), text(lang, "newSite")),
      ),
      h("div", { className: "wbs-body" },
        h("aside", { className: "wbs-tree" },
          h("div", { className: "wbs-tree-top" },
            h("span", { className: "wbs-tree-title" }, h(Icon, { name: "folder-tree", size: 13 }), text(lang, "directory")),
            h("button", { className: "wbs-mini", title: text(lang, "addDir"), onClick: function () { setDirDlg({ mode: "create", parentId: "0", name: "" }); } }, h(Icon, { name: "folder-plus", size: 13 })),
            h("button", { className: "wbs-mini", title: text(lang, "refresh"), onClick: refreshTree }, h(Icon, { name: "refresh", size: 13 })),
          ),
          h("div", {
            className: "wbs-node" + (current.id === "0" ? " active" : ""),
            style: { paddingLeft: 4 },
          },
            h("span", { className: "wbs-caret plain" }, h(Icon, { name: "house", size: 13 })),
            h("span", { className: "wbs-node-name", onClick: function () { selectDir("0"); } }, text(lang, "all")),
            h("span", { className: "wbs-node-actions" },
              h("button", { className: "wbs-mini", title: text(lang, "addDir"), onClick: function (e) { e.stopPropagation(); setDirDlg({ mode: "create", parentId: "0", name: "" }); } }, h(Icon, { name: "folder-plus", size: 13 })),
            ),
          ),
          (kids["0"] || []).map(function (node) { return renderNode(node, 1); }),
        ),
        h("section", { className: "wbs-main" },
          h("div", { className: "wbs-crumbs" },
            h("button", { className: "wbs-crumb" + (current.id === "0" ? " cur" : ""), onClick: function () { selectDir("0"); } }, text(lang, "all")),
            (current.path || []).map(function (p, i) {
              return h(React.Fragment, { key: String(p.id) },
                h("span", { className: "wbs-sep" }, h(Icon, { name: "chevron-right", size: 12 })),
                h("button", {
                  className: "wbs-crumb" + (i === current.path.length - 1 ? " cur" : ""),
                  onClick: function () { setCurrent({ id: String(p.id), path: current.path.slice(0, i + 1) }); setPage(1); },
                }, p.name),
              );
            }),
          ),
          h("div", { className: "wbs-toolbar" },
            h("div", { className: "wbs-search" },
              h("input", {
                value: searchInput,
                placeholder: text(lang, "search"),
                onChange: function (e) { setSearchInput(e.target.value); },
                onKeyDown: function (e) {
                  if (e.key === "Enter") { setTextQuery(searchInput.trim()); setPage(1); }
                },
              }),
              h("button", { title: "搜索", onClick: function () { setTextQuery(searchInput.trim()); setPage(1); } }, h(Icon, { name: "search", size: 14 })),
              searchInput ? h("button", { title: "清空", onClick: function () { setSearchInput(""); setTextQuery(""); setPage(1); } }, h(Icon, { name: "x", size: 14 })) : null,
            ),
            h(TagFilter, {
              api: api, text: function (k) { return text(lang, k); }, Icon: Icon, visible: tagsVisible,
              ids: tagFilter, reloadKey: tagReload,
              onChange: function (next) { setTagFilter(next); setPage(1); },
            }),
            h("div", { className: "wbs-grow" }),
            selectedIds.length ? h("button", { className: "wbs-btn danger", onClick: deleteSelected }, h(Icon, { name: "trash", size: 13 }), text(lang, "deleteSelected") + " (" + selectedIds.length + ")") : null,
          ),
          error ? h("div", { className: "wbs-error" }, error) : null,
          h("div", { className: "wbs-tablewrap" },
            h("table", { className: "wbs-table" },
              h("colgroup", null,
                h("col", { style: { width: 34 } }),
                h("col", null),
                tagsVisible ? h("col", { style: { width: 150 } }) : null,
                h("col", { style: { width: 112 } }),
                h("col", { style: { width: 112 } }),
                h("col", { style: { width: 214 } }),
              ),
              h("thead", null,
                h("tr", null,
                  h("th", null, h("input", { type: "checkbox", checked: allSelected, onChange: toggleAll, "aria-label": "全选" })),
                  h("th", null, text(lang, "siteCol")),
                  tagsVisible ? h("th", null, text(lang, "tagCol")) : null,
                  h("th", { className: "wbs-th-sort" + (sortCol === "create_time" ? " on" : ""), onClick: function () { sortBy("create_time"); } }, h("span", { className: "wbs-th-label" }, text(lang, "createTime"), sortIcon("create_time"))),
                  h("th", { className: "wbs-th-sort" + (sortCol === "update_time" ? " on" : ""), onClick: function () { sortBy("update_time"); } }, h("span", { className: "wbs-th-label" }, text(lang, "updateTime"), sortIcon("update_time"))),
                  h("th", null, text(lang, "actions")),
                ),
              ),
              h("tbody", null,
                loading ? h("tr", null, h("td", { colSpan: colCount }, h("div", { className: "wbs-loading" }, text(lang, "loading")))) : null,
                !loading && !sites.length ? h("tr", null, h("td", { colSpan: colCount },
                  h("div", { className: "wbs-empty" },
                    h("span", { className: "wbs-empty-ico" }, h(Icon, { name: "folder-open", size: 24 })),
                    h("b", null, text(lang, "empty")),
                    h("span", null, text(lang, "emptyHint")),
                  ),
                )) : null,
                !loading ? sites.map(function (s) {
                  var row = h("tr", { key: s.id },
                    h("td", null, h("input", { type: "checkbox", checked: !!selected[s.id], onChange: function () { toggleSelected(s.id); }, "aria-label": "选择" })),
                    h("td", null,
                      h("div", { className: "wbs-site-name" }, s.siteName),
                      s.description ? h("div", { className: "wbs-site-desc" }, s.description) : h("div", { className: "wbs-site-desc wbs-muted" }, text(lang, "noDesc")),
                      s.defaultLink ? h("a", { className: "wbs-site-link", href: s.defaultLink, target: "_blank", rel: "noreferrer noopener", title: s.defaultLink }, h(Icon, { name: "link", size: 11 }), h("span", null, s.defaultLink)) : h("div", { className: "wbs-site-desc wbs-muted" }, text(lang, "noLink")),
                    ),
                    tagsVisible ? h("td", null, s.tags && s.tags.length ? s.tags.map(function (t) {
                      return h("span", { className: "wbs-chip", key: t.id }, t.name);
                    }) : h("span", { className: "wbs-muted" }, "—")) : null,
                    h("td", { className: "wbs-muted" }, s.createTime || "—"),
                    h("td", { className: "wbs-muted" }, s.updateTime || "—"),
                    h("td", null,
                      h("div", { className: "wbs-actions" },
                        h("button", { className: "wbs-btn sm", title: text(lang, "links"), onClick: function () { setExpandedRow(expandedRow && expandedRow.id === s.id && expandedRow.type === "links" ? null : { id: s.id, type: "links" }); } }, h(Icon, { name: "link", size: 12 }), text(lang, "links") + " " + (s.siteLinks ? s.siteLinks.length : 0)),
                        h("button", { className: "wbs-btn sm", title: text(lang, "dirs"), onClick: function () { setExpandedRow(expandedRow && expandedRow.id === s.id && expandedRow.type === "dirs" ? null : { id: s.id, type: "dirs" }); } }, h(Icon, { name: "folder", size: 12 }), text(lang, "dirs") + " " + (s.dirs ? s.dirs.length : 0)),
                        h("button", { className: "wbs-btn sm", title: text(lang, "accounts"), onClick: function () { setAccSite(s); } }, h(Icon, { name: "key", size: 12 }), text(lang, "accounts") + " " + (s.accountCount || 0)),
                        h("button", { className: "wbs-btn sm icononly", title: text(lang, "edit"), onClick: function () { openEdit(s); } }, h(Icon, { name: "edit", size: 13 })),
                        h("button", { className: "wbs-btn sm danger icononly", title: text(lang, "del"), onClick: function () { if (cfgConfirm) setDeleting(s); else removeSite(s); } }, h(Icon, { name: "trash", size: 13 })),
                      ),
                    ),
                  );
                  if (!expandedRow || expandedRow.id !== s.id) return row;
                  var detail = expandedRow.type === "links"
                    ? (s.siteLinks && s.siteLinks.length ? h("table", { className: "wbs-subtable" },
                      h("thead", null, h("tr", null, h("th", null, "描述"), h("th", null, "网址"))),
                      h("tbody", null, s.siteLinks.map(function (l, i) {
                        return h("tr", { key: i },
                          h("td", null, l.isDefault ? h("span", { className: "wbs-def", title: text(lang, "default") }, h(Icon, { name: "star", size: 11 })) : null, l.description || "—"),
                          h("td", null, l.link ? h("a", { href: l.link, target: "_blank", rel: "noreferrer noopener" }, l.link) : "—"),
                        );
                      })),
                    ) : h("div", { className: "wbs-muted" }, text(lang, "noLink")))
                    : (s.dirs && s.dirs.length ? h("div", { className: "wbs-dirpath" }, s.dirs.map(function (d) {
                      return h("div", { key: d.id }, h(Icon, { name: "folder", size: 12 }), (d.path || []).map(function (p) { return p.name; }).join(" / "));
                    })) : h("div", { className: "wbs-muted" }, "未关联目录"));
                  return h(React.Fragment, { key: s.id + ":detail" },
                    row,
                    h("tr", { className: "wbs-expand" }, h("td", { colSpan: colCount }, detail)),
                  );
                }) : null,
              ),
            ),
          ),
          h("div", { className: "wbs-pager" },
            h("span", null, "共 " + total + " 条"),
            h("button", { className: "wbs-btn sm icononly", title: text(lang, "prev"), "aria-label": text(lang, "prev"), disabled: page <= 1, onClick: function () { setPage(Math.max(1, page - 1)); } }, h(Icon, { name: "chevron-left", size: 14 })),
            h("span", { className: "wbs-pager-pos" }, page + " / " + pages),
            h("button", { className: "wbs-btn sm icononly", title: text(lang, "next"), "aria-label": text(lang, "next"), disabled: page >= pages, onClick: function () { setPage(Math.min(pages, page + 1)); } }, h(Icon, { name: "chevron-right", size: 14 })),
            h("select", {
              value: pageSize,
              onChange: function (e) { setPageSize(Number(e.target.value)); setPage(1); },
            }, [16, 30, 50].map(function (n) { return h("option", { key: n, value: n }, n + " / 页"); })),
          ),
        ),
      ),

      editing ? h(SiteFormModal, {
        api: api,
        lang: lang,
        mode: editing.mode,
        site: editing.site,
        current: current,
        tagOn: tagsVisible,
        onClose: function () { setEditing(null); },
        onSaved: onSaved,
      }) : null,
      dirDlg ? h(DirModal, {
        api: api,
        lang: lang,
        dlg: dirDlg,
        onClose: function () { setDirDlg(null); },
        onDone: onDirDone,
      }) : null,
      accSite ? h(AccountModal, {
        api: api,
        lang: lang,
        site: accSite,
        onClose: function () { setAccSite(null); },
        onChanged: function () { setTick(function (x) { return x + 1; }); },
      }) : null,
      deleting ? h(DeleteSiteModal, {
        api: api,
        lang: lang,
        site: deleting,
        onClose: function () { setDeleting(null); },
        onDone: onSiteDeleted,
      }) : null,
      toast ? h("div", { className: "wbs-toast" + (toast.kind === "err" ? " err" : "") }, toast.msg) : null,
    );
  }

  injectCss();

  host.registerAddon({
    id: "wb-addon-sites",
    version: "1.10.0",
    views: [
      { id: "stats", icon: tabIcon("chart"), title: { zh: "统计", en: "Stats" }, component: statsView.SitesStatsView },
      { id: "sites", icon: tabIcon("globe"), title: { zh: "记录", en: "Records" }, component: SitesView },
      { id: "config", icon: tabIcon("settings"), title: { zh: "配置", en: "Config" }, component: configView.ConfigView },
      { id: "data", icon: tabIcon("database"), title: { zh: "数据", en: "Data" }, component: dataView.DataView },
      { id: "actions", icon: tabIcon("code-2"), title: { zh: "Action", en: "Actions" }, component: require("./views/actions.cjs").ActionSchemaView },
    ],
  });

  module.exports = { name: "dsh-workbench-sites", inject: [], apply: function () {} };
})();
