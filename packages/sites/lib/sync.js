/**
 * 站点域的同步声明：site / site_node_mapping / tag_mapping 行级，
 * site_node 树表整表收敛（虚拟根 0，不落库）。
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
    if (!cur || (Number(row.updated_at) || 0) >= (Number(cur.updated_at) || 0)) map.set(id, row);
  }
  return [...map.values()];
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
    {
      name: "tag_mapping",
      mode: "row",
      uniqueKeys: [["tag_id", "item_id", "item_type"]],
      uniquePolicy: "lww-tombstone",
    },
    { name: "site_node", mode: "tree", reconcile: reconcileSiteTree },
  ],
};
