"use strict";
/**
 * 保险箱门禁：账户表单提交前，保险箱必须「已安装 + 已初始化 + 未锁定」。
 * 三种状态各给一条出路：未安装 → 装好插件后重新检测；未初始化 → 现场设主口令；
 * 锁定 → 现场解锁。这里只渲染，状态与调用都在 account-form.cjs。
 * 0.2.2 起不再提供「手填凭据 id」的旁路：授权码只能在保险箱里新建。
 */
function t(lang, zh, en) {
  return lang === "en" ? en : zh;
}

module.exports = function VaultGate(props) {
  var h = props.h;
  var C = props.C;
  var lang = props.lang;
  var vault = props.vault || "loading";
  if (vault === "ready" || vault === "loading") return null;
  var SecretField = props.SecretField;
  var busy = !!props.busy;

  function secret(value, onChange, show, onToggle, id, autoComplete) {
    return h(SecretField, {
      h: h,
      value: value,
      onChange: onChange,
      show: show,
      onToggle: onToggle,
      id: id,
      autoComplete: autoComplete,
      disabled: busy,
      showLabel: t(lang, "显示明文", "Show plain text"),
      hideLabel: t(lang, "隐藏明文", "Hide plain text"),
    });
  }

  var body;
  if (vault === "missing") {
    body = h(
      "div",
      { className: "wbml-gate" },
      h("div", { className: "wbml-gate-title" }, t(lang, "保险箱插件未安装", "Vault plugin is not installed")),
      h(
        "p",
        { className: "wbml-gate-text" },
        t(
          lang,
          "邮件授权码只能保存在保险箱里。先安装并初始化「凭据保险箱」插件，再回到本页选择凭据。",
          "Mail credentials can only live in the vault. Install and initialise the Vault plugin, then come back and pick one.",
        ),
      ),
      h(
        "button",
        { type: "button", className: "wbml-btn", onClick: props.onRetry },
        t(lang, "重新检测", "Check again"),
      ),
    );
  } else if (vault === "init") {
    body = h(
      "div",
      { className: "wbml-gate" },
      h("div", { className: "wbml-gate-title" }, t(lang, "保险箱还没有主口令", "The vault has no master password yet")),
      h(
        "p",
        { className: "wbml-gate-text" },
        t(
          lang,
          "设置一个主口令（至少 12 位），用于加密这台机器上的所有凭据。设置后不能找回，请记牢。",
          "Set a master password (12+ characters) that encrypts every credential on this machine. It cannot be recovered, so keep it safe.",
        ),
      ),
      h("div", { className: "wbml-gate-row" }, secret(props.pass, props.onPass, props.showPass, props.onTogglePass, "wbml-vault-pass", "new-password")),
      h("div", { className: "wbml-gate-row" }, secret(props.pass2, props.onPass2, props.showPass2, props.onTogglePass2, "wbml-vault-pass2", "new-password")),
      h(
        "button",
        { type: "button", className: "wbml-btn primary", disabled: busy, onClick: props.onSubmit },
        busy ? t(lang, "处理中…", "Working…") : t(lang, "初始化保险箱并继续", "Initialize vault and continue"),
      ),
    );
  } else {
    body = h(
      "div",
      { className: "wbml-gate" },
      h("div", { className: "wbml-gate-title" }, t(lang, "保险箱已锁定", "The vault is locked")),
      h("p", { className: "wbml-gate-text" }, t(lang, "输入主口令解锁后即可保存账户。", "Unlock with your master password to save the account.")),
      h("div", { className: "wbml-gate-row" }, secret(props.pass, props.onPass, props.showPass, props.onTogglePass, "wbml-vault-pass", "current-password")),
      h(
        "button",
        { type: "button", className: "wbml-btn primary", disabled: busy, onClick: props.onSubmit },
        busy ? t(lang, "解锁中…", "Unlocking…") : t(lang, "解锁并继续", "Unlock and continue"),
      ),
    );
  }

  return h("div", { className: "wbml-gate-wrap" }, body, props.error ? h(C.Notice, { h: h, text: props.error, kind: "warn" }) : null);
};
