"use strict";
/**
 * 站点账号弹窗：列表、新建/编辑、显形与复制、外联。
 * 敏感字段显形走 vault.secretReveal；本模块不持有密钥、不读密文。
 */
module.exports = function createAccountsModal(deps) {
  var h = deps.h;
  var React = deps.React;
  var useState = deps.useState;
  var useEffect = deps.useEffect;
  var Modal = deps.Modal;
  var Icon = deps.Icon;
  var text = deps.text;
  var callApi = deps.callApi;
  var errText = deps.errText;

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
    var [binding, setBinding] = useState(null);

    function mapVault(st) {
      var r = st || {};
      var idle = Number(r.idleTimeoutSec) > 0 ? Math.round(Number(r.idleTimeoutSec) / 60) : 15;
      return {
        installed: true,
        enabled: Boolean(r.initialized),
        unlocked: !r.locked,
        locked: Boolean(r.locked),
        unlockMode: r.unlockMode,
        idleMinutes: idle,
        remainingMs: r.locked ? 0 : idle * 60 * 1000,
      };
    }

    function reload() {
      setLoading(true);
      return Promise.all([
        callApi(api, "sites.accounts.list", { siteId: site.id }),
        callApi(api, "vault.status", {}),
        callApi(api, "vault.bindingsOf", { subjectType: "site", subjectId: site.id }),
      ]).then(function (out) {
        setAccounts(out[0].accounts || []);
        setVault(mapVault(out[1]));
        setBinding((out[2] && out[2].items && out[2].items[0]) || null);
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
      if (!pass || pass.length < 12) { setError(text(lang, "passTooShort")); return; }
      if (!vault.enabled && pass !== pass2) { setError(text(lang, "passMismatch")); return; }
      guard(function () {
        var req = vault.enabled
          ? callApi(api, "vault.unlock", { passphrase: pass })
          : callApi(api, "vault.setup", { passphrase: pass, mode: "A" });
        return req.then(function () { setPass(""); setPass2(""); return reload(); });
      });
    }

    function lockVault() {
      guard(function () { return callApi(api, "vault.lock", {}).then(function () { setShown({}); return reload(); }); });
    }

    function bindGroup() {
      guard(function () {
        return callApi(api, "vault.groupCreate", { name: "站点账号 · " + (site.siteName || site.id) })
          .then(function (g) {
            return callApi(api, "vault.bind", { subjectType: "site", subjectId: site.id, groupId: g.id });
          })
          .then(function () { return reload(); });
      });
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
        return callApi(api, "sites.accounts.get", { id: acc.id }).then(function (r) {
          var ids = r.secretIds || {};
          var jobs = [["password", "password"], ["phone", "phoneNumber"], ["identity", "identityCard"]]
            .filter(function (pair) { return ids[pair[0]]; })
            .map(function (pair) {
              return callApi(api, "vault.secretReveal", { id: ids[pair[0]] })
                .then(function (res) { var v = {}; v[pair[1]] = res && res.secret !== undefined ? res.secret : ""; return v; })
                .catch(function () { return null; });
            });
          return Promise.all(jobs).then(function (list) {
            var out = {};
            list.forEach(function (v) { if (v) Object.assign(out, v); });
            setShown(function (prev) { var next = Object.assign({}, prev); next[acc.id] = out; return next; });
          });
        });
      });
    }

    function copyText(value) {
      if (!value) return;
      try { navigator.clipboard.writeText(value); if (typeof showToast === "function") showToast(text(lang, "copied")); } catch (e) { setError(String(e && e.message || e)); }
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
        h("div", { className: "wbs-grow" }),
        binding
          ? h("span", { className: "wbs-chip" }, "凭据组：" + (binding.groupName || binding.groupId))
          : h(React.Fragment, null,
            h("span", { className: "wbs-vault-hint" }, "本站点尚未关联凭据组"),
            h("button", { className: "wbs-btn sm", disabled: busy, onClick: bindGroup }, h(Icon, { name: "plus", size: 12 }), "创建并关联"),
          ),
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
            acc.vaultInvalid ? h("div", { className: "wbs-error" }, text(lang, "vaultInvalid")) : null,
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
  return AccountModal;
};
