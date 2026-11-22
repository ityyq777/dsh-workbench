"use strict";
/**
 * 账户表单：选账号集合（账号自动带出）→ 服务商主机按账号的域名带出 → 选集合内凭据 → 保存前自检 → 落库。
 *
 * 0.6.0 起邮箱地址不再手填：用户在「凭据保险箱 / 集合与账号」里建一个账号集合并填上账号，
 * 这里只负责选集合、把集合的 account 绑定成账户邮箱，再从同一个集合里挑一条授权码。
 * 所以保存链路里没有 vault.secretCreate / secretUpdate / secretDelete，
 * 表单也不再持有任何明文密码，自检同样只传 secretId。
 */
var util = require("./provider-util.cjs");
var VaultGate = require("./vault-gate.cjs");
var SetPicker = require("./set-picker.cjs");
var SecretPicker = require("./secret-picker.cjs");
var probe = require("../../lib/domain/probe-error.js");
// 布尔项统一使用共享开关控件。
var SW = require("../../../lib/switch.cjs");
// 端口这类数字项统一使用共享数字输入控件（输入自由、失焦校验、非法红字不提交）。
var NF = require("../../../lib/number-field.cjs");

/** 端口的合法范围；只作提示与校验，不夹取键入值。 */
var PORT = { min: 1, max: 65535, integer: true };

function t(lang, zh, en) {
  return lang === "en" ? en : zh;
}

module.exports = function AccountForm(props) {
  var h = props.h;
  var React = props.React;
  var C = props.C;
  var api = props.api;
  var lang = props.lang;
  var SecretField = props.SecretField;
  var providers = props.providers || { providers: [] };
  var editing = props.account || null;
  var S = React.useState;

  function domainsOf(id) {
    var p = util.providerById(providers, id);
    return (p && p.domains) || [];
  }
  function compose(local, domain) {
    var l = String(local || "").trim();
    return l ? l + "@" + domain : "";
  }

  function initial() {
    var base = util.presetFor(providers, "qq", "") || {
      provider: "qq",
      imapHost: "",
      imapPort: 993,
      imapTls: true,
      smtpHost: "",
      smtpPort: 465,
      smtpTls: true,
    };
    base.email = "";
    base.name = "";
    base.accountSetId = "";
    base.secretId = "";
    base.advanced = false;
    // 预设服务商的域名由预设提供，用户只填 @ 前面的本地部分；"other" 才填整条地址。
    var baseDoms = domainsOf("qq");
    base.domain = baseDoms.length ? baseDoms[0] : "";
    if (!editing) return base;
    var hitProvider = util.detect(providers, editing.email);
    return Object.assign(base, {
      provider: hitProvider ? hitProvider.id : "other",
      domain: util.domainOf(editing.email) || base.domain,
      email: editing.email || "",
      name: editing.name || "",
      accountSetId: editing.accountSetId || "",
      imapHost: editing.imapHost || "",
      imapPort: editing.imapPort || 993,
      imapTls: editing.imapTls !== false,
      smtpHost: editing.smtpHost || "",
      smtpPort: editing.smtpPort || 465,
      smtpTls: editing.smtpTls !== false,
      secretId: editing.secretId || "",
      advanced: true,
    });
  }

  var fs = S(initial);
  var f = fs[0];
  var setF = fs[1];
  var touchedS = S(!!editing);
  var vaultS = S("loading");
  var passS = S("");
  var pass2S = S("");
  var showS = S({ pass: false, pass2: false });
  var vaultErrS = S("");
  var afterS = S("");
  var probeS = S(null);
  var busyS = S({ save: false, probe: false, vault: false });
  var errS = S("");
  var noticeS = S("");
  // 端口数字框的草稿合法性：非法草稿不会写进 form，所以要单独记一份来禁用保存。
  var portS = S({ imap: true, smtp: true });

  var vault = vaultS[0];
  var busy = busyS[0];

  function upd(patch) {
    setF(function (prev) {
      return Object.assign({}, prev, patch);
    });
  }
  function setBusy(key, on) {
    setBusyState(function (prev) {
      var next = Object.assign({}, prev);
      next[key] = on;
      return next;
    });
  }
  var setBusyState = busyS[1];

  function setProbe(value) {
    probeS[1](value);
  }
  function setErr(value) {
    errS[1](value);
  }
  function setNotice(value) {
    noticeS[1](value);
  }
  function setPortOk(key, ok) {
    var field = key === "imapPort" ? "imap" : "smtp";
    if (portS[0][field] === ok) return;
    var next = Object.assign({}, portS[0]);
    next[field] = ok;
    portS[1](next);
  }
  function portOk() {
    return portS[0].imap !== false && portS[0].smtp !== false;
  }

  function checkVault() {
    return C.call(api, "vault.status")
      .then(function (r) {
        var state = !r || !r.initialized ? "init" : r.locked ? "locked" : "ready";
        vaultS[1](state);
        return state;
      })
      .catch(function () {
        vaultS[1]("missing");
        return "missing";
      });
  }

  React.useEffect(function () {
    checkVault();
  }, []);

  function applyPreset(id, email) {
    var doms = domainsOf(id);
    var local = util.localOf(email);
    var dom = util.domainOf(email);
    if (id !== "other" && doms.length && doms.indexOf(dom) < 0) dom = doms[0];
    var next = id === "other" ? String(email || "") : compose(local, dom);
    var p = util.presetFor(providers, id, next);
    if (!p) return;
    upd({ provider: id, email: next, domain: id === "other" ? "" : dom, imapHost: p.imapHost, imapPort: p.imapPort, imapTls: p.imapTls, smtpHost: p.smtpHost, smtpPort: p.smtpPort, smtpTls: p.smtpTls, advanced: id === "other" });
    // 切换预设会整体换掉主机与端口，之前的非法草稿状态一并清掉。
    portS[1]({ imap: true, smtp: true });
  }

  function onPick(id) {
    touchedS[1](true);
    setProbe(null);
    applyPreset(id, f.email);
  }

  // 选中账号集合：邮箱地址由集合账号带出，服务商主机按域名推导；换集合时清掉旧凭据。
  function onPickSet(id, set) {
    var address = String((set && set.account) || "").trim();
    touchedS[1](true);
    setProbe(null);
    var patch = { accountSetId: id, secretId: "", secretName: "" };
    if (address) {
      var hit = util.detect(providers, address);
      var p = hit ? util.presetFor(providers, hit.id, address) : null;
      patch.email = address;
      if (p) {
        patch.provider = hit.id;
        patch.imapHost = p.imapHost;
        patch.imapPort = p.imapPort;
        patch.imapTls = p.imapTls;
        patch.smtpHost = p.smtpHost;
        patch.smtpPort = p.smtpPort;
        patch.smtpTls = p.smtpTls;
        patch.advanced = false;
      } else {
        patch.provider = "other";
        patch.advanced = true;
      }
      portS[1]({ imap: true, smtp: true });
    }
    upd(patch);
  }

  function validate() {
    if (!String(f.accountSetId || "").trim()) return t(lang, "请先选择账号集合（保险箱「集合与账号」）", "Pick an account set in the vault first");
    if (!/^\S+@\S+\.\S+$/.test(String(f.email || "").trim())) return t(lang, "所选账号集合没有可用的邮箱账号，请先到保险箱填写", "The selected account set has no usable email account");
    if (!String(f.name || "").trim()) return t(lang, "请填写账户名称", "Enter an account name");
    if (!String(f.imapHost || "").trim()) return t(lang, "请填写 IMAP 服务器", "Enter the IMAP server");
    if (!String(f.secretId || "").trim()) {
      return t(lang, "请先在保险箱新建并选择凭据", "Create a credential in the vault and pick it here");
    }
    var ports = [f.imapPort, f.smtpPort];
    for (var i = 0; i < ports.length; i += 1) {
      var n = Number(ports[i]);
      if (!(n >= 1 && n <= 65535)) return t(lang, "端口需在 1–65535 之间", "Port must be between 1 and 65535");
    }
    return "";
  }

  function persist() {
    setErr("");
    setBusy("save", true);
    var payload = {
      name: String(f.name || "").trim(),
      email: String(f.email || "").trim(),
      accountSetId: String(f.accountSetId || "").trim(),
      imapHost: String(f.imapHost || "").trim(),
      imapPort: Number(f.imapPort),
      imapTls: !!f.imapTls,
      smtpHost: String(f.smtpHost || "").trim(),
      smtpPort: Number(f.smtpPort),
      smtpTls: !!f.smtpTls,
      username: String(f.email || "").trim(),
      secretId: String(f.secretId || "").trim(),
    };
    var step = editing
      ? C.call(api, "mail.accountUpdate", Object.assign({ id: editing.id }, payload))
      : C.call(api, "mail.accountCreate", payload);
    step
      .then(function () {
        setBusy("save", false);
        setNotice(t(lang, "已保存", "Saved"));
        if (props.onSaved) props.onSaved();
      })
      .catch(function (e) {
        setBusy("save", false);
        setErr(C.errText(e));
      });
  }

  function submit() {
    // 端口框里可能还是非法草稿（没提交进 form），这里再挡一次，避免把旧端口存下去。
    if (!portOk()) {
      setErr(t(lang, "端口需在 1–65535 之间", "Port must be between 1 and 65535"));
      return;
    }
    var msg = validate();
    if (msg) {
      setErr(msg);
      return;
    }
    setErr("");
    if (vault !== "ready") {
      afterS[1]("save");
      setNotice("");
      if (vault === "loading") checkVault();
      return;
    }
    persist();
  }

  function onVaultSubmit() {
    var p = passS[0];
    if (!p) {
      vaultErrS[1](t(lang, "请输入主口令", "Enter the master password"));
      return;
    }
    if (vault === "init" && p !== pass2S[0]) {
      vaultErrS[1](t(lang, "两次输入的主口令不一致", "The two passwords do not match"));
      return;
    }
    vaultErrS[1]("");
    setBusy("vault", true);
    var call = vault === "init" ? C.call(api, "vault.setup", { passphrase: p, mode: "A" }) : C.call(api, "vault.unlock", { passphrase: p });
    call
      .then(function () {
        setBusy("vault", false);
        passS[1]("");
        pass2S[1]("");
        vaultS[1]("ready");
        if (afterS[0] === "save") {
          afterS[1]("");
          persist();
        }
      })
      .catch(function (e) {
        setBusy("vault", false);
        vaultErrS[1](C.errText(e));
      });
  }

  function runProbe() {
    if (!portOk()) {
      setErr(t(lang, "端口需在 1–65535 之间", "Port must be between 1 and 65535"));
      return;
    }
    var msg = validate();
    if (msg) {
      setErr(msg);
      return;
    }
    setErr("");
    setBusy("probe", true);
    C.call(api, "mail.accountProbe", {
      email: f.email,
      username: f.email,
      imapHost: f.imapHost,
      imapPort: Number(f.imapPort),
      imapTls: !!f.imapTls,
      smtpHost: f.smtpHost,
      smtpPort: Number(f.smtpPort),
      smtpTls: !!f.smtpTls,
      secretId: f.secretId,
    })
      .then(function (r) {
        setBusy("probe", false);
        setProbe(r);
      })
      .catch(function (e) {
        setBusy("probe", false);
        setErr(C.errText(e));
      });
  }

  function field(label, input, hint) {
    return h(C.Field, { h: h, label: label, hint: hint }, input);
  }
  function textInput(key, opts) {
    var o = opts || {};
    return h("input", {
      className: "wbml-input",
      type: o.type || "text",
      value: f[key],
      placeholder: o.placeholder || "",
      autoComplete: o.autoComplete || "off",
      onChange: function (e) {
        upd({ [key]: e.target.value });
      },
    });
  }
  function portField(key, label) {
    return h(NF.NumberField, {
      h: h,
      lang: lang,
      value: f[key],
      min: PORT.min,
      max: PORT.max,
      integer: PORT.integer,
      wide: true,
      ariaLabel: label,
      hint: t(lang, "1–65535", "1–65535"),
      onCommit: function (next) { upd({ [key]: next }); },
      // 键入过程中就判断草稿合法性，非法时立刻禁用保存/自检。
      onDraft: function (raw) { setPortOk(key, NF.validateNumber(raw, { min: PORT.min, max: PORT.max, integer: PORT.integer, lang: lang }).ok); },
      onValidChange: function (ok) { setPortOk(key, ok); },
    });
  }
  function tlsRow(key, label) {
    // 开关文本即字段名，改动仍写回同一个键。
    return h(SW.Switch, {
      h: h,
      checked: !!f[key],
      label: label,
      onChange: function (next) {
        upd({ [key]: next });
      },
    });
  }

  var provider = util.providerById(providers, f.provider);
  var probeText = "";
  if (probeS[0]) {
    var r = probeS[0];
    if (r.ok) probeText = t(lang, "自检通过：IMAP 登录成功" + (r.imap ? "，列出 " + r.imap.mailboxes + " 个文件夹" : "") + (r.smtp ? "；SMTP 认证成功" : ""), "Check passed: IMAP login succeeded" + (r.smtp ? " and SMTP authenticated" : ""));
    else {
      var cls = r.errorClass || "unknown";
      var tx = probe.ERROR_TEXT[cls] || probe.ERROR_TEXT.unknown;
      probeText = (lang === "en" ? tx.en : tx.zh) + " " + t(lang, "（" + cls + "）", "(" + cls + ")");
    }
  }

  return h(
    "div",
    { className: "wbml-acct-form" },
    h(
      "div",
      { className: "wbml-acct-head" },
      h("strong", null, editing ? t(lang, "编辑账户", "Edit account") : t(lang, "新增账户", "New account")),
      h("button", { type: "button", className: "wbml-icon-btn", onClick: props.onCancel, title: t(lang, "关闭", "Close") }, "×"),
    ),
    h(require("./provider-chips.cjs"), { h: h, lang: lang, providers: providers, value: f.provider, onPick: onPick }),
    !f.accountSetId && editing
      ? h("p", { className: "wbml-hint-line" }, t(lang, "这个账户是旧版账户，还没有绑定账号集合；保存前请先选择一个。", "This legacy account has no account set yet — pick one before saving."))
      : null,
    h("div", { className: "wbml-acct-grid" },
      field(t(lang, "账号集合", "Account set"), h(SetPicker, {
        h: h,
        C: C,
        api: api,
        React: React,
        lang: lang,
        vault: vault,
        value: f.accountSetId,
        disabled: busy.save,
        onChange: onPickSet,
      }), t(lang, "先选一个账号集合；邮箱地址由它上面的账号自动带出。", "Pick an account set; the email address comes from its account.")),
      field(t(lang, "账户名称", "Account name"), textInput("name", { placeholder: t(lang, "例如 工作邮箱", "e.g. Work mail") })),
    ),
    field(t(lang, "邮箱账号（自动带出）", "Email account (auto)"),
      h("input", {
        className: "wbml-input",
        type: "text",
        value: f.email,
        readOnly: true,
        placeholder: t(lang, "选择账号集合后自动填入", "Filled after picking an account set"),
      }),
      f.accountSetId
        ? t(lang, "账号来自所选集合，要改地址请去保险箱改集合账号。", "The address comes from the selected set — change the set account in the vault.")
        : null),
    f.accountSetId
      ? field(
          t(lang, "授权码（集合内凭据）", "App password (in this set)"),
          h(SecretPicker, {
            h: h,
            React: React,
            C: C,
            api: api,
            lang: lang,
            vault: vault,
            accountSetId: f.accountSetId,
            value: f.secretId,
            disabled: busy.save || !f.accountSetId,
            onChange: function (id, item) {
              upd({ secretId: id, secretName: item ? item.name : "" });
              setProbe(null);
            },
          }),
          t(lang, "只列这个账号集合里的凭据；先把授权码放进这个集合。",
            "Only credentials in this set are listed here."),
        )
      : field(
          t(lang, "授权码（集合内凭据）", "App password (in this set)"),
          h("p", { className: "wbml-hint-line" }, t(lang, "请先选择账号集合，再从集合里选授权码。", "Pick an account set first, then choose a credential.")),
        ),
    provider && util.hintOf(provider, lang) ? h("p", { className: "wbml-hint-line" }, util.hintOf(provider, lang)) : null,
    !f.advanced && f.imapHost
      ? h("p", { className: "wbml-hint-line" }, "IMAP " + f.imapHost + ":" + f.imapPort + (f.imapTls ? " TLS" : "") + " · SMTP " + (f.smtpHost || "—") + ":" + f.smtpPort + (f.smtpTls ? " TLS" : " STARTTLS"))
      : null,
    !f.advanced
      ? h("button", { type: "button", className: "wbml-btn", onClick: function () { upd({ advanced: true }); } }, t(lang, "其他设置（主机 / 端口）", "Advanced (hosts / ports)"))
      : h("div", { className: "wbml-acct-grid" },
          field(t(lang, "IMAP 服务器", "IMAP server"), textInput("imapHost")),
          field(t(lang, "IMAP 端口", "IMAP port"), portField("imapPort", t(lang, "IMAP 端口", "IMAP port"))),
          field("", tlsRow("imapTls", t(lang, "IMAP 隐式 TLS", "IMAP implicit TLS"))),
          field(t(lang, "SMTP 服务器", "SMTP server"), textInput("smtpHost")),
          field(t(lang, "SMTP 端口", "SMTP port"), portField("smtpPort", t(lang, "SMTP 端口", "SMTP port"))),
          field("", tlsRow("smtpTls", t(lang, "SMTP 隐式 TLS（关掉走 STARTTLS）", "SMTP implicit TLS (off = STARTTLS)"))),
        ),
    h(VaultGate, {
      h: h, C: C, lang: lang, SecretField: SecretField, vault: vault,
      pass: passS[0], pass2: pass2S[0],
      showPass: showS[0].pass, showPass2: showS[0].pass2,
      onPass: function (v) { passS[1](v); },
      onPass2: function (v) { pass2S[1](v); },
      onTogglePass: function () { showS[1](Object.assign({}, showS[0], { pass: !showS[0].pass })); },
      onTogglePass2: function () { showS[1](Object.assign({}, showS[0], { pass2: !showS[0].pass2 })); },
      onSubmit: onVaultSubmit,
      busy: busy.vault,
      error: vaultErrS[0],
      onRetry: function () { checkVault(); },
    }),
    probeS[0] ? h(C.Notice, { h: h, text: probeText, kind: probeS[0].ok ? "ok" : "warn" }) : null,
    errS[0] ? h(C.Notice, { h: h, text: errS[0], kind: "warn" }) : null,
    noticeS[0] ? h(C.Notice, { h: h, text: noticeS[0], kind: "ok" }) : null,
    !f.accountSetId
      ? h("p", { className: "wbml-hint-line" }, t(lang, "请先选择账号集合，未选时不能保存。", "Pick an account set before saving."))
      : !f.secretId
        ? h("p", { className: "wbml-hint-line" }, t(lang, "请从所选集合里选一条授权码，未选时不能保存。", "Pick a credential from the selected set before saving."))
        : null,
    h(
      "div",
      { className: "wbml-acct-foot" },
      h(C.Btn, { h: h, onClick: runProbe, disabled: busy.probe || busy.save || !f.accountSetId || !f.secretId || !portOk() }, busy.probe ? t(lang, "自检中…", "Checking…") : t(lang, "保存前自检", "Check connection")),
      h(C.Btn, { h: h, kind: "primary", onClick: submit, disabled: busy.save || !f.accountSetId || !f.secretId || !portOk() }, busy.save ? t(lang, "保存中…", "Saving…") : t(lang, "保存", "Save")),
      h(C.Btn, { h: h, onClick: props.onCancel }, t(lang, "取消", "Cancel")),
    ),
  );
};
