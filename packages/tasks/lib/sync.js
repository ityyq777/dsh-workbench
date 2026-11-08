/**
 * 任务域的同步声明：task/task_dep 行级，task_node 树表整表收敛。
 *
 * reconcile 只做数据结构收敛（合并版本、修孤儿、重排 sort、重算 path/depth），
 * 不写数据库；宿主拿到 rows 后整表替换并 full push。
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

export function reconcileTaskTree(remoteRows, localRows) {
  const all = mergeRows(remoteRows, localRows);
  const baseTs = stableTs(all);
  const live = all.filter((row) => row.deleted_at === null || row.deleted_at === undefined);
  if (!live.length) return { rows: all.sort((a, b) => String(a.id).localeCompare(String(b.id))), dirtyRowTables: [] };

  const byId = new Map(live.map((row) => [String(row.id), Object.assign({}, row)]));
  let roots = [...byId.values()].filter((row) => String(row.parent_id || "0") === "0");
  roots.sort((a, b) => Number(a.sort || 0) - Number(b.sort || 0) || String(a.id).localeCompare(String(b.id)));
  let root = roots[0];
  if (!root) {
    root = {
      id: "1",
      name: "任务",
      type: "0",
      parent_id: "0",
      path: "/1/",
      sort: 0,
      depth: 0,
      created_at: baseTs,
      updated_at: baseTs,
      deleted_at: null,
      rev: 1,
    };
    byId.set("1", root);
    roots = [root];
  }
  root.parent_id = "0";
  root.depth = 0;
  root.sort = 0;
  root.path = "/" + root.id + "/";

  // 其他根级节点挂到唯一根下，保证单树；孤儿也挂到根。
  for (const node of byId.values()) {
    if (node === root) continue;
    const parent = byId.get(String(node.parent_id || "0"));
    if (!parent || node.parent_id === "0" || node.parent_id === undefined) node.parent_id = String(root.id);
  }
  // 断环：沿 parent 链走，遇到自己则挂回根。
  for (const node of byId.values()) {
    if (node === root) continue;
    let cur = node;
    const seen = new Set();
    while (cur && String(cur.parent_id) !== "0") {
      if (seen.has(String(cur.id))) break;
      seen.add(String(cur.id));
      const parent = byId.get(String(cur.parent_id));
      if (!parent) break;
      if (parent === node) {
        node.parent_id = String(root.id);
        break;
      }
      cur = parent;
    }
  }

  const children = new Map();
  for (const node of byId.values()) {
    if (node === root) continue;
    const pid = String(node.parent_id);
    if (!children.has(pid)) children.set(pid, []);
    children.get(pid).push(node);
  }
  for (const list of children.values()) {
    list.sort((a, b) => Number(a.sort || 0) - Number(b.sort || 0) || Number(a.created_at || 0) - Number(b.created_at || 0) || String(a.id).localeCompare(String(b.id)));
  }

  const ordered = [root];
  const queue = [root];
  while (queue.length) {
    const parent = queue.shift();
    const kids = children.get(String(parent.id)) || [];
    let index = 0;
    for (const child of kids) {
      child.parent_id = String(parent.id);
      child.sort = index++;
      child.depth = Number(parent.depth) + 1;
      child.path = String(parent.path) + String(child.id) + "/";
      ordered.push(child);
      queue.push(child);
    }
  }

  // 不可达节点（数据损坏）挂根并追加。
  for (const node of byId.values()) {
    if (ordered.indexOf(node) >= 0) continue;
    node.parent_id = String(root.id);
    node.depth = 1;
    node.path = String(root.path) + String(node.id) + "/";
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

export const taskSync = {
  tables: [
    { name: "task", mode: "row" },
    { name: "task_dep", mode: "row" },
    { name: "task_node", mode: "tree", reconcile: reconcileTaskTree },
  ],
};
