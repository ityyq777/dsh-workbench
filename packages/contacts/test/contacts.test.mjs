import { test } from "node:test";
import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
const { ensureSchema } = await import("../lib/db/db.js");
const { createContacts } = await import("../lib/domain/contacts.js");

function make() {
  const db = new DatabaseSync(":memory:");
  ensureSchema(db);
  return { db, c: createContacts({ db, host: { call: async () => ({}) } }) };
}

test("创建联系人、字段与分组", () => {
  const { c } = make();
  const g = c.createGroup({ name: "同事" });
  const ct = c.create({ name: "张三", org: "Acme", fields: [{ kind: "email", value: "z@a.test" }, { kind: "phone", value: "123" }], groups: [g.id] });
  assert.equal(ct.name, "张三");
  assert.equal(ct.fields.length, 2);
  assert.equal(ct.groups[0].name, "同事");
  assert.equal(c.stats().contacts, 1);
});

test("更新局部字段、软删除", () => {
  const { c } = make();
  const ct = c.create({ name: "李四", fields: [{ kind: "email", value: "l@a.test" }] });
  const up = c.update({ id: ct.id, title: "工程师" });
  assert.equal(up.title, "工程师");
  assert.equal(up.fields.length, 1);
  c.remove(ct.id);
  assert.equal(c.list({}).items.length, 0);
});

test("搜索姓名/组织/字段", () => {
  const { c } = make();
  c.create({ name: "王五", org: "Beta", fields: [{ kind: "email", value: "w@beta.test" }] });
  assert.equal(c.search("王五").length, 1);
  assert.equal(c.search("Beta").length, 1);
  assert.equal(c.search("w@beta").length, 1);
  assert.equal(c.search("不存在").length, 0);
});

test("vCard 导入导出往返", () => {
  const { c } = make();
  const vcf = ["BEGIN:VCARD", "VERSION:3.0", "FN:Alice", "ORG:Wonder", "EMAIL:alice@w.test", "TEL:555", "END:VCARD"].join("\r\n");
  const r = c.importVcf(vcf);
  assert.deepEqual(r, { imported: 1, skipped: 0 });
  const out = c.exportVcf();
  assert.equal(out.count, 1);
  assert.ok(out.vcf.includes("FN:Alice"));
  assert.ok(out.vcf.includes("EMAIL:alice@w.test"));
});

test("非法导入被跳过", () => {
  const { c } = make();
  const r = c.importVcf("BEGIN:VCARD\r\nFN:\r\nEND:VCARD");
  assert.equal(r.imported, 0);
  assert.equal(r.skipped, 0);
});
