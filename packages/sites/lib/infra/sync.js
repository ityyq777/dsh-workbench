/**
 * 站点域的同步声明：site / site_node_mapping / site_account / site_account_external 行级（tag_mapping 归标签域），
 * site_node 树表整表收敛（虚拟根 0，不落库），描述随快照完整保留。
 * 旧端需先升级并迁移 description 列再接收新快照：旧宿主按快照列写入，缺列会失败。
 * 账号表的敏感列在写本地库前已加密，同步上行的是密文（见 vault.js / docs/specs/22）。
 */

function stableTs(rows) {
  let max = 0;
  for (const row of rows) max = Math.max(max, Number(row.updated_at) || 0);
  return max;
}

function mergeRows(remoteRows, localRows) {
  const map = new Map();
  for (const row of localRows || []) if (row && row.id) map.set(String(row.id), row);
  for (const row of remoteRows || []) {
    if (!row || !row.id) continue;
    const id = String(row.id);
    const cur = map.get(id);
    if (!cur || (Number(row.updated_at) || 0) >= (Number(cur.updated_at) || 0)) {
      // Older clients omit this column. Preserve the local description when available.
      // They cannot display/edit descriptions, or restore one once all upgraded copies lose it.
      map.set(id, { ...row, description: row.description === undefined ? cur?.description ?? "" : row.description });
    }
  }
  return [...map.values()].map((row) => ({ ...row, description: row.description == null ? "" : String(row.description) }));
}

export function reconcileSiteTree(remoteRows, localRows) {
  const all = mergeRows(remoteRows, localRows);
  const baseTs = stableTs(all);
  const live = all.filter((row) => row.deleted_at === null || row.deleted_at === undefined);
  if (!live.length) return { rows: all.sort((a, b) => String(a.id).localeCompare(String(b.id))), dirtyRowTables: [] };

  const byId = new Map(live.map((row) => [String(row.id), Object.assign({}, row)]));
  for (const node of byId.values()) {
    const parentId = String(node.parent_id || "0");
    if (parentId !== "0" && !byId.has(parentId)) node.parent_id = "0";
  }
  for (const node of byId.values()) {
    let cur = node;
    const seen = new Set();
    while (cur && String(cur.parent_id) !== "0") {
      if (seen.has(String(cur.id))) break;
      seen.add(String(cur.id));
      const parent = byId.get(String(cur.parent_id));
      if (!parent) break;
      if (parent === node) {
        node.parent_id = "0";
        break;
      }
      cur = parent;
    }
  }

  const children = new Map();
  for (const node of byId.values()) {
    const pid = String(node.parent_id || "0");
    if (!children.has(pid)) children.set(pid, []);
    children.get(pid).push(node);
  }
  for (const list of children.values()) {
    list.sort((a, b) => Number(a.sort || 0) - Number(b.sort || 0) || Number(a.created_at || 0) - Number(b.created_at || 0) || String(a.id).localeCompare(String(b.id)));
  }

  const ordered = [];
  const queue = (children.get("0") || []).slice();
  let i = 0;
  for (const node of queue) node.sort = i++;
  while (queue.length) {
    const parent = queue.shift();
    parent.depth = String(parent.parent_id || "0") === "0" ? 0 : Number(parent.depth) || 0;
    parent.path = parent.depth === 0
      ? "/" + parent.id + "/"
      : String((byId.get(String(parent.parent_id)) || {}).path || "/") + String(parent.id) + "/";
    ordered.push(parent);
    const kids = children.get(String(parent.id)) || [];
    let index = 0;
    for (const child of kids) {
      child.parent_id = String(parent.id);
      child.sort = index++;
      child.depth = Number(parent.depth) + 1;
      child.path = String(parent.path) + String(child.id) + "/";
      queue.push(child);
    }
  }
  for (const node of byId.values()) {
    if (ordered.indexOf(node) >= 0) continue;
    node.parent_id = "0";
    node.depth = 0;
    node.path = "/" + node.id + "/";
    ordered.push(node);
  }
  for (const node of ordered) {
    const before = all.find((row) => String(row.id) === String(node.id));
    const changed =
      !before ||
      String(before.parent_id) !== String(node.parent_id) ||
      String(before.path) !== String(node.path) ||
      Number(before.sort) !== Number(node.sort) ||
      Number(before.depth) !== Number(node.depth);
    if (changed && before) {
      node.updated_at = Math.max(Number(before.updated_at) || 0, baseTs) + 1;
      node.rev = (Number(before.rev) || 1) + 1;
    }
  }
  const tombstones = all.filter((row) => row.deleted_at !== null && row.deleted_at !== undefined);
  return {
    rows: [...ordered, ...tombstones].sort((a, b) => String(a.id).localeCompare(String(b.id))),
    dirtyRowTables: [],
  };
}

export const siteSync = {
  tables: [
    { name: "site", mode: "row" },
    {
      name: "site_node_mapping",
      mode: "row",
      uniqueKeys: [["site_id", "node_id"]],
      uniquePolicy: "lww-tombstone",
    },
    // tag_mapping 归标签域同步（packages/addons/tags/lib/infra/sync.js 整表行级同步，不区分 item_type）：
    // 站点域重复声明同一张表会让两处手写同一套唯一键/墓碑策略，一处改了另一处没跟上就会分叉。
    { name: "site_node", mode: "tree", reconcile: reconcileSiteTree },
    // 二期：账号表同步的是密文（password/phone_number/identity_card 写库前加密），云端无密钥。
    { name: "site_account", mode: "row" },
    { name: "site_account_external", mode: "row" },
  ],
};
