/** Read-only overview; independent of legacy tree/children/path contracts. */
// id=0 is a virtual parent, never a node. UNION bounds recursion on corrupt imports.
const VISIBLE = `WITH RECURSIVE visible AS (
    SELECT * FROM site_node WHERE parent_id='0' AND id<>'0' AND deleted_at IS NULL
    UNION
    SELECT n.* FROM site_node n JOIN visible p ON n.parent_id=p.id
    WHERE n.id<>'0' AND n.deleted_at IS NULL
  )`;

function descriptionLimit(args) {
  const value = args.maxDescriptionLength;
  if (value === undefined) return null;
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 0) {
    throw new Error("maxDescriptionLength 必须是非负安全整数");
  }
  return value;
}

export function overview(db, args = {}) {
  const limit = descriptionLimit(args);
  const rows = db.prepare(VISIBLE + " SELECT * FROM visible ORDER BY sort ASC, id ASC").all();
  const stats = new Map(db.prepare(VISIBLE + `, closure(ancestor, id) AS (
    SELECT id, id FROM visible
    UNION
    SELECT c.ancestor, n.id FROM closure c JOIN visible n ON n.parent_id=c.id
  )
  SELECT c.ancestor AS id, COUNT(DISTINCT s.id) AS count,
    COUNT(DISTINCT CASE WHEN c.ancestor=c.id THEN s.id END) AS directCount,
    MAX(MAX(n.updated_at, COALESCE(s.updated_at, 0), CASE WHEN s.id IS NOT NULL THEN COALESCE(m.updated_at, 0) ELSE 0 END)) AS lastUpdatedAt
  FROM closure c JOIN visible n ON n.id=c.id
  LEFT JOIN site_node_mapping m ON m.node_id=c.id AND m.deleted_at IS NULL
  LEFT JOIN site s ON s.id=m.site_id AND s.deleted_at IS NULL
  GROUP BY c.ancestor`).all().map(row => [String(row.id), row]));
  const nodes = [];
  const byId = new Map();
  let descriptionTruncated = false;
  for (const row of rows) {
    const stat = stats.get(String(row.id));
    const full = String(row.description || "");
    const chars = Array.from(full);
    const shortened = limit !== null && chars.length > limit;
    descriptionTruncated ||= shortened;
    byId.set(String(row.id), {
      id: String(row.id), name: String(row.name), type: "folder",
      typeName: "folder",
      description: shortened ? chars.slice(0, limit).join("") : full,
      descriptionSupported: true, descriptionTruncated: shortened,
      path: [], count: Number(stat?.count || 0), directCount: Number(stat?.directCount || 0),
      lastUpdatedAt: Number(stat?.lastUpdatedAt || row.updated_at),
      canContainRecords: true, children: [],
    });
  }
  for (const row of rows) {
    const node = byId.get(String(row.id));
    const parent = byId.get(String(row.parent_id));
    if (parent) parent.children.push(node);
    else nodes.push(node);
  }
  const pending = nodes.slice().reverse();
  while (pending.length) {
    const node = pending.pop();
    node.path = [...node.path, { id: node.id, name: node.name, type: node.type }];
    for (const child of node.children) child.path = node.path;
    pending.push(...node.children.slice().reverse());
  }
  return { nodes, total: rows.length, returned: rows.length, truncated: false, descriptionTruncated };
}

export function renderOverview(result) {
  const out = ["站点目录概览（节点 " + result.returned + "/" + result.total + "，truncated=" + result.truncated + "）"];
  const pending = result.nodes.slice().reverse().map(node => ({ node, depth: 0 }));
  while (pending.length) {
    const { node, depth } = pending.pop();
    const prefix = "  ".repeat(depth);
    const label = "目录，可直接放站点和子目录；子树 " + node.count + " 个站点（去重）";
    out.push(prefix + "- " + node.name + " [" + label + "] id=" + node.id);
    out.push(prefix + "  路径：" + node.path.map(part => part.name).join(" / "));
    out.push(prefix + "  最近更新（Unix毫秒）：" + node.lastUpdatedAt);
    out.push(prefix + "  描述：" + (node.description || "（空）") + (node.descriptionTruncated ? "…（已截断）" : ""));
    for (const child of node.children.slice().reverse()) pending.push({ node: child, depth: depth + 1 });
  }
  return out.join("\n");
}

export function registerOverviewAction(api) {
  api.action("siteNodes.overview", {
    description: "只读全量站点目录概览：type/typeName=folder，各层目录可放站点；description默认返回目录全文描述。返回nodes/total/returned/truncated/descriptionTruncated；count为子树去重站点数，directCount为直接站点数，含面包屑、lastUpdatedAt、children。先overview再create选dirIds。",
    input: {
      type: "object",
      properties: {
        maxDescriptionLength: {
          type: "integer", minimum: 0, maximum: Number.MAX_SAFE_INTEGER,
          description: "可选描述字符数上限（Unicode码点）；默认全文，0省略描述正文。结构化结果与文本同时生效，descriptionTruncated 标识描述截断；节点始终全量返回。",
        },
      },
    },
    execute: args => overview(api.db, args || {}),
    render: renderOverview,
  });
}
