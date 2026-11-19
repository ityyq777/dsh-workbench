"use strict";
/**
 * 服务商预设的客户端工具：识别域名、按预设算出表单字段。
 *
 * 预设数据只有一份（服务端 lib/domain/providers.js，经 mail.providerList 下发），
 * 这里只复刻「怎么用这份表」，不复制任何主机/端口常量。
 */
function domainOf(email) {
  var raw = String(email || "").trim().toLowerCase();
  var at = raw.lastIndexOf("@");
  if (at < 0) return "";
  return raw.slice(at + 1).replace(/\.+$/, "");
}

function localOf(email) {
  var raw = String(email || "").trim();
  var at = raw.lastIndexOf("@");
  return at < 0 ? raw : raw.slice(0, at);
}

function list(table) {
  return (table && table.providers) || [];
}

function providerById(table, id) {
  var arr = list(table);
  for (var i = 0; i < arr.length; i += 1) if (arr[i].id === id) return arr[i];
  return null;
}

/** 精确命中优先，再做后缀命中，多个命中取最长域名（vip.qq.com 胜过 qq.com）。 */
function detect(table, email) {
  var domain = domainOf(email);
  if (!domain) return null;
  var best = null;
  var arr = list(table);
  for (var i = 0; i < arr.length; i += 1) {
    var domains = arr[i].domains || [];
    for (var j = 0; j < domains.length; j += 1) {
      var d = domains[j];
      if (domain !== d && domain.slice(-(d.length + 1)) !== "." + d) continue;
      if (!best || d.length > best.domain.length) best = { id: arr[i].id, domain: d };
    }
  }
  return best;
}

function hostOf(tpl, domain) {
  return String(tpl || "").replace("{domain}", domain);
}

/** 按预设生成表单字段；域名缺失时用预设第一条域名兜底（网易派生主机需要它）。 */
function presetFor(table, id, email) {
  var p = providerById(table, id);
  if (!p) return null;
  var domain = domainOf(email) || (p.domains && p.domains[0]) || "";
  return {
    provider: p.id,
    imapHost: hostOf(p.imapHost, domain),
    imapPort: p.imapPort,
    imapTls: p.imapTls,
    smtpHost: hostOf(p.smtpHost, domain),
    smtpPort: p.smtpPort,
    smtpTls: p.smtpTls,
    username: p.usernameMode === "local" ? localOf(email) : String(email || "").trim(),
  };
}

function labelOf(provider, lang) {
  if (!provider) return "";
  var l = provider.label || {};
  return lang === "en" ? l.en || l.zh || provider.id : l.zh || l.en || provider.id;
}

function hintOf(provider, lang) {
  if (!provider) return "";
  var h = provider.hint || {};
  return lang === "en" ? h.en || h.zh || "" : h.zh || h.en || "";
}

module.exports = {
  domainOf: domainOf,
  localOf: localOf,
  providerById: providerById,
  detect: detect,
  presetFor: presetFor,
  labelOf: labelOf,
  hintOf: hintOf,
};
