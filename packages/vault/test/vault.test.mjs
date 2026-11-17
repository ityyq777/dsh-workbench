import { test } from "node:test";
import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import { mkdtempSync, existsSync, statSync } from "node:fs";
import { randomBytes } from "node:crypto";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createRequire } from "node:module";

process.env.WB_HOME = mkdtempSync(join(tmpdir(), "wb-vault-test-"));

const { ensureSchema, headerGet, headerSet, deviceGet, deviceSet } = await import("../lib/db/db.js");
const { createVault } = await import("../lib/domain/vault.js");
const { createGroups } = await import("../lib/domain/groups.js");
const { createSets } = await import("../lib/domain/sets.js");
const { registerVaultActions } = await import("../lib/domain/actions.js");
const { KDF_DEFAULT, deriveKey, open, seal, secretAad } = await import("../lib/infra/crypto.js");

function makeVault() {
  const db = new DatabaseSync(":memory:");
  ensureSchema(db);
  const vault = createVault({ db });
  const groups = createGroups({ db });
  const actions = new Map();
  registerVaultActions(
    { db, now: () => Date.now(), action: (name, def) => actions.set(name, def) },
    vault,
    groups,
  );
  const run = (name, args = {}, origin = "ui") => actions.get(name).execute(args, { origin });
  return { db, vault, groups, actions, run };
}

const PASS = "correct-horse-1";

test("A 模式初始化、加密落库、解锁/失败锁", () => {
  const { db, run } = makeVault();
  run("vault.setup", { passphrase: PASS, mode: "A" });
  const st = run("vault.status");
  assert.equal(st.initialized, true);
  assert.equal(st.locked, false);
  assert.equal(st.unlockMode, "A");
  assert.equal(st.schemaVersion, 3);
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM vault_header").get().n, 1);
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM vault_device").get().n, 1);

  run("vault.secretCreate", { name: "rss", kind: "password", secret: "s3cret-value", meta: { username: "me" } });
  const row = db.prepare("SELECT * FROM vault_secret").get();
  assert.ok(row.ciphertext.startsWith("v1:"));
  assert.ok(!row.ciphertext.includes("s3cret-value"));
  assert.ok(!JSON.stringify(row).includes("s3cret-value"));

  const listed = run("vault.secretList", {}, "agent");
  assert.equal(listed.items.length, 1);
  assert.equal(listed.items[0].name, "rss");
  assert.equal(listed.items[0].ciphertext, undefined);
  assert.equal(listed.items[0].lastUsedAt, null);

  assert.equal(run("vault.secretReveal", { id: row.id }).secret, "s3cret-value");
  assert.equal(run("vault.secretList").items[0].lastUsedAt > 0, true);
  assert.throws(() => run("vault.secretReveal", { id: row.id }, "agent"), /不允许 agent/);

  run("vault.lock");
  assert.equal(run("vault.status").locked, true);
  assert.throws(() => run("vault.unlock", { passphrase: "wrong-pass-1" }), /口令错误/);
  run("vault.unlock", { passphrase: PASS });
  assert.equal(run("vault.status").locked, false);
});

test("B 模式 device key 自动解锁，reveal 仍要口令", () => {
  process.env.WB_HOME = mkdtempSync(join(tmpdir(), "wb-vault-test-b-"));
  const { run } = makeVault();
  run("vault.setup", { passphrase: PASS, mode: "B" });
  const keyPath = join(process.env.WB_HOME, "vault-device.key");
  assert.equal(existsSync(keyPath), true);
  assert.equal(statSync(keyPath).mode & 0o777, 0o600);

  run("vault.secretCreate", { name: "imap", kind: "app_password", secret: "app-pass" });
  run("vault.lock");
  assert.equal(run("vault.status").locked, false, "B 模式 status 应自动解锁");
  const id = run("vault.secretList").items[0].id;
  assert.throws(() => run("vault.secretReveal", { id }), /需要口令/);
  assert.equal(run("vault.secretReveal", { id, passphrase: PASS }).secret, "app-pass");
});

test("plugin lease 可用，ui/agent 不可用；改口令后可解锁", () => {
  const { run, vault } = makeVault();
  run("vault.setup", { passphrase: PASS, mode: "A" });
  run("vault.secretCreate", { name: "token1", kind: "token", secret: "tok-123" });
  const id = run("vault.secretList").items[0].id;
  assert.equal(run("vault.lease", { id, purpose: "test" }, "plugin").secret, "tok-123");
  assert.throws(() => run("vault.lease", { id }, "ui"), /不允许 ui/);
  assert.throws(() => run("vault.lease", { id }, "agent"), /不允许 agent/);

  run("vault.changePassphrase", { oldPassphrase: PASS, newPassphrase: "next-pass-22" });
  run("vault.lock");
  assert.throws(() => run("vault.unlock", { passphrase: PASS }), /口令错误/);
  run("vault.unlock", { passphrase: "next-pass-22" });
  assert.equal(run("vault.status").locked, false);
  assert.deepEqual(vault.exportData().secrets, []);
});

test("分组、关联与按组可见凭据", () => {
  const { db, run } = makeVault();
  run("vault.setup", { passphrase: PASS, mode: "A" });
  const groupId = run("vault.groupCreate", { name: "sspai", description: "少数派账号" }).id;
  const otherId = run("vault.groupCreate", { name: "mail" }).id;
  assert.throws(() => run("vault.groupCreate", { name: "sspai" }), /同名分组/);

  const secId = run("vault.secretCreate", {
    name: "sspai-basic",
    kind: "password",
    secret: "pw-1",
    groupId,
    meta: { username: "me" },
  }).id;
  run("vault.secretCreate", { name: "imap", kind: "app_password", secret: "pw-2", groupId: otherId });
  assert.equal(run("vault.secretList", { groupId }).items.length, 1);
  assert.equal(run("vault.groupList").items.length, 2);
  const sspai = run("vault.groupList").items.find((g) => g.id === groupId);
  assert.equal(sspai.secretCount, 1);

  run("vault.subjectRegister", { type: "site", title: "站点" }, "plugin");
  const bound = run("vault.bind", { subjectType: "site", subjectId: "site_1", groupId }, "plugin");
  assert.ok(bound.id);
  assert.equal(run("vault.bind", { subjectType: "site", subjectId: "site_1", groupId }, "plugin").existing, true);
  assert.equal(run("vault.bind", { subjectType: "site", subjectId: "site_1", groupId }, "ui").existing, true);

  const bindings = run("vault.bindingsOf", { subjectType: "site", subjectId: "site_1" }, "agent");
  assert.equal(bindings.items.length, 1);
  assert.equal(bindings.items[0].groupName, "sspai");
  assert.equal(bindings.items[0].secretCount, 1);

  const visible = run("vault.subjectSecrets", { subjectType: "site", subjectId: "site_1" }, "plugin");
  assert.deepEqual(visible.items.map((item) => item.id), [secId]);
  assert.equal(visible.items[0].ciphertext, undefined);

  assert.equal(run("vault.lease", { id: secId, subjectType: "site", subjectId: "site_1" }, "plugin").secret, "pw-1");
  assert.throws(
    () => run("vault.lease", { id: secId, subjectType: "site", subjectId: "site_404" }, "plugin"),
    /未绑定任何凭据组/,
  );

  run("vault.unbind", { subjectType: "site", subjectId: "site_1", groupId }, "plugin");
  assert.equal(run("vault.bindingsOf", { subjectType: "site", subjectId: "site_1" }).items.length, 0);

  run("vault.groupDelete", { id: otherId, moveTo: groupId });
  assert.equal(run("vault.secretList", { groupId }).items.length, 2);
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM vault_group WHERE deleted_at IS NOT NULL").get().n, 1);
  run("vault.groupDelete", { id: groupId });
  assert.equal(
    db.prepare("SELECT COUNT(*) AS n FROM vault_group_set WHERE deleted_at IS NULL").get().n,
    0,
    "删组后集合关联应清空",
  );
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM vault_secret").get().n, 2, "凭据本身不随分组删除");
});

test("plugin 写入受绑定约束：按 setName 建集合、按 name 幂等写凭据", () => {
  const { db, run } = makeVault();
  run("vault.setup", { passphrase: PASS, mode: "A" });
  const groupId = run("vault.groupCreate", { name: "站点账号 · 少数派" }).id;
  const otherId = run("vault.groupCreate", { name: "别的组" }).id;
  run("vault.subjectRegister", { type: "site", title: "站点" }, "plugin");
  run("vault.bind", { subjectType: "site", subjectId: "site_1", groupId }, "plugin");

  const base = { subjectType: "site", subjectId: "site_1", setName: "acc_1" };
  const name = "acc_1 · 密码";
  const meta = { siteId: "site_1", accountId: "acc_1", field: "password" };
  const created = run("vault.pluginSecretUpsert", { ...base, name, kind: "password", secret: "pw-a", meta }, "plugin");
  assert.equal(created.created, true);
  const row = db.prepare("SELECT * FROM vault_secret WHERE id = ?").get(created.id);
  assert.ok(row.ciphertext.startsWith("v1:"));
  assert.ok(!row.ciphertext.includes("pw-a"));
  assert.ok(created.setId, "返回值应带集合 id");

  const set = run("vault.pluginSetGet", base, "plugin").set;
  assert.equal(set.name, "acc_1");
  assert.equal(run("vault.setGet", { id: set.id }, "plugin").secrets.length, 1);

  const visible = run("vault.subjectSecrets", { subjectType: "site", subjectId: "site_1" }, "plugin");
  assert.equal(visible.items.length, 1);
  assert.deepEqual(visible.items[0].meta, meta);
  assert.equal(visible.items[0].setId, created.setId, "subject 侧应能拿到集合 id");

  const updated = run("vault.pluginSecretUpsert", { ...base, name, kind: "password", secret: "pw-b", meta }, "plugin");
  assert.equal(updated.created, false);
  assert.equal(updated.id, created.id);
  assert.equal(run("vault.secretReveal", { id: created.id }).secret, "pw-b");
  assert.equal(db.prepare("SELECT rev FROM vault_secret WHERE id = ?").get(created.id).rev, 2);
  assert.equal(run("vault.pluginSetGet", base, "plugin").set.id, created.setId, "setName 复用同一集合");

  assert.throws(
    () => run("vault.pluginSecretUpsert", { subjectType: "site", subjectId: "site_404", setName: "a", name, secret: "pw" }, "plugin"),
    /未绑定任何凭据组/,
  );
  assert.throws(
    () => run("vault.pluginSecretUpsert", { ...base, groupId: otherId, name, secret: "pw" }, "plugin"),
    /未绑定到此对象/,
  );
  assert.throws(
    () => run("vault.pluginSecretUpsert", { ...base, name, secret: "pw" }, "agent"),
    /不允许 agent/,
  );

  // plugin 不能把凭据塞进别人组下的集合
  const foreignSet = run("vault.setCreate", { name: "外部集合" }).id;
  run("vault.groupAttachSet", { groupId: otherId, setId: foreignSet });
  assert.throws(
    () => run("vault.setAttachSecret", { ...base, setId: foreignSet, secretId: created.id }, "plugin"),
    /不属于此对象已绑定的凭据组/,
  );

  assert.equal(run("vault.pluginSecretDelete", { ...base, name }, "plugin").removed, true);
  assert.equal(run("vault.pluginSecretDelete", { ...base, name }, "plugin").removed, false);
  assert.equal(run("vault.subjectSecrets", { subjectType: "site", subjectId: "site_1" }, "plugin").items.length, 0);
});

test("集合 action：增删改、挂载/摘除与权限", () => {
  const { db, run } = makeVault();
  run("vault.setup", { passphrase: PASS, mode: "A" });
  const g1 = run("vault.groupCreate", { name: "组一" }).id;
  const g2 = run("vault.groupCreate", { name: "组二" }).id;
  const set = run("vault.setCreate", { name: "共享集合", description: "给两个组用" });
  assert.ok(set.id);
  assert.throws(() => run("vault.setCreate", { name: "共享集合" }), /同名集合/);

  const setB = run("vault.setCreate", { name: "另一集合" }).id;
  run("vault.groupAttachSet", { groupId: g1, setId: set.id });
  run("vault.groupAttachSet", { groupId: g2, setId: set.id });
  assert.equal(run("vault.groupAttachSet", { groupId: g1, setId: set.id }).existing, true, "重复挂载幂等");
  assert.equal(run("vault.setList", { groupId: g1 }).items.length, 1);
  assert.deepEqual(run("vault.setGet", { id: set.id }).groupIds.sort(), [g1, g2].sort());

  const phoneA = run("vault.secretCreate", { name: "手机号 A", kind: "phone", secret: "13800000001", setId: set.id });
  const phoneB = run("vault.secretCreate", { name: "手机号 B", kind: "phone", secret: "13800000002", setId: set.id });
  assert.equal(run("vault.setGet", { id: set.id }).secrets.length, 2, "同一集合可放两条 phone");
  run("vault.setAttachSecret", { setId: setB, secretId: phoneA.id });
  assert.equal(run("vault.setAttachSecret", { setId: setB, secretId: phoneA.id }).existing, true, "重复挂载幂等");
  assert.equal(run("vault.secretList", { setId: setB }).items.length, 1);
  assert.equal(run("vault.secretList", { groupId: g2 }).items.length, 2);

  assert.equal(run("vault.setDetachSecret", { setId: setB, secretId: phoneA.id }).removed, true);
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM vault_secret WHERE deleted_at IS NULL").get().n, 2, "摘除不删凭据");

  run("vault.setDelete", { id: set.id });
  assert.equal(run("vault.setList", {}).items.length, 1);
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM vault_secret WHERE deleted_at IS NULL").get().n, 2, "删集合不删凭据");
  assert.equal(run("vault.secretList", { setId: set.id }).items.length, 0);
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM vault_group_set WHERE deleted_at IS NULL").get().n, 0);

  // 权限：集合读取 agent 可、写入 agent 不可
  assert.ok(run("vault.setList", {}, "agent").items.length >= 1);
  assert.throws(() => run("vault.setCreate", { name: "agent 建的" }, "agent"), /不允许 agent/);
  assert.throws(() => run("vault.groupAttachSet", { groupId: g1, setId: setB }, "plugin"), /不允许 plugin/);
  assert.ok(Array.isArray(run("vault.setList", {}, "plugin").items), "集合读取对 plugin 开放");
});

test("并发改口令：LWW + 提示", () => {
  const { db, run } = makeVault();
  run("vault.setup", { passphrase: PASS, mode: "A" });
  run("vault.changePassphrase", { oldPassphrase: PASS, newPassphrase: "second-pass-2" });
  // 模拟另一台设备已用新口令、而本机 device 记录还停在第 1 版
  deviceSet(db, { passphrase_rev_seen: 1 });
  run("vault.lock");
  assert.throws(() => run("vault.unlock", { passphrase: PASS }), /口令已在其他设备修改/);
  const ok = run("vault.unlock", { passphrase: "second-pass-2" });
  assert.match(String(ok.notice || ""), /口令已在其他设备修改/);
  assert.equal(headerGet(db).passphrase_rev, 2);
  assert.equal(deviceGet(db).passphrase_rev_seen, 2);
});

test("0.1.0 的 vault_meta 迁移到 header/device/usage", () => {
  const db = new DatabaseSync(":memory:");
  db.exec(
    "CREATE TABLE vault_meta(key TEXT PRIMARY KEY, value TEXT NOT NULL, updated_at INTEGER NOT NULL)",
  );
  db.exec(
    "CREATE TABLE vault_secret(id TEXT PRIMARY KEY, name TEXT NOT NULL, kind TEXT NOT NULL, meta TEXT NOT NULL DEFAULT '{}', " +
      "ciphertext TEXT NOT NULL, created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL, last_used_at INTEGER, " +
      "deleted_at INTEGER, rev INTEGER NOT NULL DEFAULT 1)",
  );
  const salt = randomBytes(16);
  const dek = randomBytes(32);
  const kek = deriveKey(PASS, salt.toString("base64"), KDF_DEFAULT);
  const wrapped = seal(kek, dek, "vault:dek");
  const ts = 1700000000000;
  const put = db.prepare("INSERT INTO vault_meta(key, value, updated_at) VALUES(?, ?, ?)");
  put.run("schema_version", "1", ts);
  put.run("salt", salt.toString("base64"), ts);
  put.run("kdf", JSON.stringify(KDF_DEFAULT), ts);
  put.run("wrapped_dek", wrapped, ts);
  put.run("unlock_mode", "A", ts);
  put.run("auto_unlock", "0", ts);
  put.run("reveal_policy", "session", ts);
  put.run("idle_timeout_sec", "900", ts);
  put.run("created_at", String(ts), ts);
  put.run("last_unlock_at", String(ts), ts);
  db.prepare(
    "INSERT INTO vault_secret(id, name, kind, meta, ciphertext, created_at, updated_at, last_used_at, rev) " +
      "VALUES(?, ?, ?, ?, ?, ?, ?, ?, 3)",
  ).run("sec_old", "legacy", "password", "{}", seal(dek, "old-secret", secretAad("sec_old", "legacy", "password")), ts, ts, ts + 5);

  ensureSchema(db);
  assert.equal(headerGet(db).salt, salt.toString("base64"));
  assert.equal(deviceGet(db).unlock_mode, "A");
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM vault_secret_usage").get().n, 1);
  assert.equal(db.prepare("SELECT 1 FROM sqlite_master WHERE name = 'vault_meta'").get(), undefined);
  assert.ok(db.prepare("SELECT 1 FROM sqlite_master WHERE name = 'vault_meta_legacy'").get());
  ensureSchema(db); // 幂等

  const vault = createVault({ db });
  const actions = new Map();
  registerVaultActions(
    { db, now: () => Date.now(), action: (name, def) => actions.set(name, def) },
    vault,
    createGroups({ db }),
  );
  const run = (name, args = {}, origin = "ui") => actions.get(name).execute(args, { origin });
  assert.throws(() => run("vault.unlock", { passphrase: "short" }), /口令错误/);
  run("vault.unlock", { passphrase: PASS });
  const items = run("vault.secretList").items;
  assert.equal(items.length, 1);
  assert.equal(items[0].name, "legacy");
  assert.equal(items[0].lastUsedAt, ts + 5);
  assert.equal(run("vault.secretReveal", { id: "sec_old" }).secret, "old-secret");
});

const KINDS = ["password", "phone", "id_card", "token", "app_password", "api_key", "other"];
const clientKinds = createRequire(import.meta.url)("../client/ui/kinds.cjs");

test("kind 契约：schema、能力清单与界面标签三处同口径 7 种", async () => {
  const { createDomain } = await import("../lib/index.js");
  const kindField = createDomain().capability.fields.find((f) => f.name === "kind");
  assert.match(kindField.type, /\bphone\b/);
  assert.match(kindField.type, /\bid_card\b/);
  assert.doesNotMatch(kindField.type, /site-account/);

  const { actions } = makeVault();
  for (const name of ["vault.secretList", "vault.secretCreate", "vault.secretUpdate", "vault.pluginSecretUpsert"]) {
    assert.deepEqual(actions.get(name).input.properties.kind.enum, KINDS, name + " 的 kind 枚举必须覆盖 7 种");
  }

  assert.deepEqual(Object.keys(clientKinds.KIND_LABEL), KINDS);
  assert.equal(clientKinds.KIND_LABEL.phone, "手机号");
  assert.equal(clientKinds.KIND_LABEL.id_card, "身份证号");
  assert.deepEqual(clientKinds.CREATABLE_KINDS, KINDS);
  assert.deepEqual(clientKinds.kindOptions("site-account"), ["site-account"].concat(KINDS), "历史类型只读保留");
  assert.deepEqual(clientKinds.kindOptions("password"), KINDS);
});

test("集合层：一条凭据进多个集合、一个集合挂多个分组、删除只断关联", () => {
  const { db, run } = makeVault();
  run("vault.setup", { passphrase: PASS, mode: "A" });
  const g1 = run("vault.groupCreate", { name: "组一" }).id;
  const g2 = run("vault.groupCreate", { name: "组二" }).id;
  const created = run("vault.secretCreate", { name: "共用密码", kind: "password", secret: "shared-pw", groupId: g1 });
  assert.ok(created.setId, "按分组写入应自动落进默认集合");

  // 直接建集合 + 关联，P1 没有 action，走 domain 层
  const sets = createSets({ db });
  const setB = sets.ensureSet("共享集合");
  sets.linkSecret(created.setId, created.id);
  sets.linkSecret(setB.id, created.id);
  sets.linkGroupSet(g2, setB.id);

  assert.equal(run("vault.secretList", { setId: setB.id }).items.length, 1);
  assert.equal(run("vault.secretList", { groupId: g2 }).items.length, 1);
  assert.equal(run("vault.secretList", { groupId: g1 }).items.length, 1);
  assert.equal(sets.secretCountOfSet(setB.id), 1);
  assert.equal(run("vault.secretReveal", { id: created.id }).secret, "shared-pw");
  assert.equal(run("vault.lease", { id: created.id, purpose: "t" }, "plugin").setId, created.setId);

  // 幂等
  sets.linkSecret(setB.id, created.id);
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM vault_set_secret WHERE deleted_at IS NULL").get().n, 2);

  run("vault.secretDelete", { id: created.id });
  assert.equal(run("vault.secretList", { setId: setB.id }).items.length, 0);
  assert.equal(sets.secretCountOfSet(setB.id), 0, "删凭据后集合不再显示它");
});

test("0.2.x → 0.3.0 迁移：分组直属凭据收进默认集合，site-account 收口为通用类型", async () => {
  const { db, run, vault } = makeVault();
  run("vault.setup", { passphrase: PASS, mode: "A" });
  const groupId = run("vault.groupCreate", { name: "站点账号 · 少数派" }).id;

  const head = headerGet(db);
  const kek = deriveKey(PASS, head.salt, JSON.parse(head.kdf));
  const dek = open(kek, head.wrapped_dek, "vault:dek");
  const ts = Date.now();

  // 还原成 0.2.x 形态：补回 group_id 列并写三行站点专属凭据
  db.exec("ALTER TABLE vault_secret ADD COLUMN group_id TEXT");
  headerSet(db, { schema_version: 2 });
  const rows = [
    ["sec_pw", "site.site_1.acc_1.password", "dev-pass"],
    ["sec_ph", "site.site_1.acc_1.phone", "13800000000"],
    ["sec_id", "site.site_1.acc_1.identity", "110101199001011234"],
  ];
  for (const [id, name, plain] of rows) {
    db.prepare(
      "INSERT INTO vault_secret(id, name, kind, group_id, meta, ciphertext, created_at, updated_at, rev) " +
        "VALUES(?, ?, 'site-account', ?, '{}', ?, ?, ?, 1)",
    ).run(id, name, groupId, seal(dek, plain, secretAad(id, name, "site-account")), ts, ts);
  }

  vault.lock();
  const res = run("vault.unlock", { passphrase: PASS });
  assert.match(String(res.notice || ""), /集合层/);
  assert.equal(headerGet(db).schema_version, 3);
  assert.equal(
    db.prepare("SELECT COUNT(*) AS n FROM pragma_table_info('vault_secret') WHERE name = 'group_id'").get().n,
    0,
    "迁移后应删掉 group_id 列",
  );

  const items = run("vault.secretList").items;
  assert.equal(items.length, 3);
  assert.ok(items.every((item) => item.kind !== "site-account"));
  assert.deepEqual(
    new Set(items.map((item) => item.name)),
    new Set(["acc_1 · 密码", "acc_1 · 手机号", "acc_1 · 身份证号"]),
  );
  const kinds = Object.fromEntries(items.map((item) => [item.name, item.kind]));
  assert.equal(kinds["acc_1 · 密码"], "password");
  assert.equal(kinds["acc_1 · 手机号"], "phone");
  assert.equal(kinds["acc_1 · 身份证号"], "id_card");
  for (const [id, , plain] of rows) assert.equal(run("vault.secretReveal", { id }).secret, plain);

  const sets = createSets({ db });
  const accSet = sets.listSets({}).items.find((item) => item.name === "acc_1");
  assert.ok(accSet, "同一 accountId 的凭据应进同一个集合");
  assert.equal(accSet.secretCount, 3);
  assert.deepEqual(accSet.groupIds, [groupId]);
  const defaultSet = sets.setsOfGroup(groupId).find((item) => item.name === "站点账号 · 少数派 · 默认");
  assert.ok(defaultSet, "旧分组应得到默认集合");

  // 重复解锁不重复迁移
  const before = db.prepare("SELECT COUNT(*) AS n FROM vault_set").get().n;
  vault.lock();
  const again = run("vault.unlock", { passphrase: PASS });
  assert.equal(again.notice, undefined);
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM vault_set").get().n, before);
});

test("迁移失败整批回滚，schema_version 保持 2", async () => {
  const { db, run, vault } = makeVault();
  run("vault.setup", { passphrase: PASS, mode: "A" });
  const groupId = run("vault.groupCreate", { name: "组三" }).id;
  const head = headerGet(db);
  const kek = deriveKey(PASS, head.salt, JSON.parse(head.kdf));
  const dek = open(kek, head.wrapped_dek, "vault:dek");
  db.exec("ALTER TABLE vault_secret ADD COLUMN group_id TEXT");
  headerSet(db, { schema_version: 2 });
  // 密文与 AAD 不匹配：迁移时解密失败应走兜底而不是抛错；这里构造真的异常（集合名超长）
  db.prepare(
    "INSERT INTO vault_secret(id, name, kind, group_id, meta, ciphertext, created_at, updated_at, rev) " +
      "VALUES('sec_bad', ?, 'site-account', ?, '{}', ?, ?, ?, 1)",
  ).run(
    "site.site_1." + "x".repeat(120) + ".password",
    groupId,
    seal(dek, "pw", secretAad("sec_bad", "site.site_1." + "x".repeat(120) + ".password", "site-account")),
    Date.now(),
    Date.now(),
  );
  vault.lock();
  const res = run("vault.unlock", { passphrase: PASS });
  assert.match(String(res.notice || ""), /升级失败，已回滚/);
  assert.equal(headerGet(db).schema_version, 2);
});

test("两设备同步：复制同步表后集合、关联与凭据一致", () => {
  const TABLES = [
    "vault_header",
    "vault_secret",
    "vault_group",
    "vault_set",
    "vault_group_set",
    "vault_set_secret",
    "vault_binding",
    "vault_subject_type",
  ];
  const a = makeVault();
  a.run("vault.setup", { passphrase: PASS, mode: "A" });
  const groupId = a.run("vault.groupCreate", { name: "同步组" }).id;
  const setId = a.run("vault.setCreate", { name: "同步集合", description: "跨设备" }).id;
  a.run("vault.groupAttachSet", { groupId, setId });
  a.run("vault.subjectRegister", { type: "site", title: "站点" }, "plugin");
  a.run("vault.bind", { subjectType: "site", subjectId: "site_9", groupId }, "plugin");
  const secret = a.run("vault.secretCreate", { name: "同步密码", kind: "password", secret: "pw-sync", setId });

  // 设备 B：先建空库，再把 A 的同步表整表拷过去（等价宿主同步后的状态）
  const b = makeVault();
  b.run("vault.setup", { passphrase: PASS, mode: "A" });
  b.vault.lock();
  for (const table of TABLES) {
    b.db.exec("DELETE FROM " + table);
    const rows = a.db.prepare("SELECT * FROM " + table).all();
    for (const row of rows) {
      const cols = Object.keys(row);
      b.db
        .prepare(
          "INSERT INTO " + table + "(" + cols.join(",") + ") VALUES(" + cols.map(() => "?").join(",") + ")",
        )
        .run(...cols.map((c) => row[c]));
    }
  }

  const unlocked = b.run("vault.unlock", { passphrase: PASS });
  assert.ok(unlocked);
  assert.equal(b.run("vault.secretReveal", { id: secret.id }).secret, "pw-sync", "同一密文在 B 可显形");
  const setB = b.run("vault.setGet", { id: setId });
  assert.equal(setB.name, "同步集合");
  assert.equal(setB.secrets.length, 1, "集合内凭据随同步一致");
  assert.deepEqual(setB.groupIds, [groupId], "集合与分组关联随同步一致");
  assert.equal(b.run("vault.subjectSecrets", { subjectType: "site", subjectId: "site_9" }, "plugin").items.length, 1);
  assert.equal(b.run("vault.unlock", { passphrase: PASS }).notice, undefined, "同步后的库不触发迁移");
});

test("凭据列表关键字搜索：名称与备注都能命中，不再报 SQL 语法错误", () => {
  const { run } = makeVault();
  run("vault.setup", { passphrase: PASS, mode: "A" });
  run("vault.secretCreate", {
    name: "ID_CARD",
    kind: "id_card",
    secret: "110101199001011234",
    meta: { note: "身份证" },
  });
  run("vault.secretCreate", { name: "rss-token", kind: "token", secret: "tok-abc", meta: { note: "阅读器" } });

  assert.deepEqual(
    run("vault.secretList", { q: "ID_CAR" }, "agent").items.map((i) => i.name),
    ["ID_CARD"],
    "按名称搜索能命中",
  );
  assert.deepEqual(
    run("vault.secretList", { q: "阅读器" }, "agent").items.map((i) => i.name),
    ["rss-token"],
    "按 meta.note 搜索能命中",
  );
  assert.equal(run("vault.secretList", { q: "ID", kind: "token" }, "agent").items.length, 0, "关键字与类型同时生效");
  assert.equal(run("vault.secretList", { q: "ID" }, "agent").items.length, 1);
});
