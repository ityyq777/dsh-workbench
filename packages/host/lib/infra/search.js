const TIMEOUT_MS = 500;
const MAX_QUERY = 100;
function normalize(q) {
    return String(q ?? "").trim().slice(0, MAX_QUERY);
}
function scoreHit(hit, q) {
    const needle = q.toLowerCase();
    const title = String(hit.title || "").toLowerCase();
    let score = 0;
    if (title === needle)
        score = 100;
    else if (title.startsWith(needle))
        score = 80;
    else if (title.includes(needle))
        score = 60;
    if (String(hit.snippet || "").toLowerCase().includes(needle))
        score += 20;
    if (hit.url)
        score += 1;
    return score;
}
export function createSearch(providers, log = () => { }) {
    function list() {
        return [...providers.values()].map((p) => ({
            domainId: p.domainId,
            search: typeof p.search === "function",
        })).filter((p) => p.search);
    }
    async function query(input) {
        const started = Date.now();
        const args = input && typeof input === "object" ? input : {};
        const q = normalize(String(args.q ?? ""));
        const limit = Math.max(1, Math.min(50, Number(args.limit) || 20));
        const wanted = Array.isArray(args.domains)
            ? args.domains.map(String).filter(Boolean)
            : [];
        if (!q)
            return { q, items: [], domains: list().map((p) => p.domainId), partial: false, failed: [], tookMs: 0 };
        const active = [...providers.values()].filter((p) => typeof p.search === "function" && (wanted.length === 0 || wanted.includes(p.domainId)));
        const failed = [];
        const batches = await Promise.all(active.map(async (provider) => {
            let timer = null;
            const timeout = new Promise((resolve) => {
                timer = setTimeout(() => {
                    failed.push(provider.domainId);
                    resolve([]);
                }, TIMEOUT_MS);
                if (typeof timer.unref === "function")
                    timer.unref();
            });
            try {
                const hits = await Promise.race([
                    Promise.resolve(provider.search(q, { limit })).then((x) => (Array.isArray(x) ? x : [])),
                    timeout,
                ]);
                return hits.map((hit) => ({ ...hit, domainId: provider.domainId }));
            }
            catch (error) {
                failed.push(provider.domainId);
                log("search provider failed", provider.domainId, error?.message);
                return [];
            }
            finally {
                if (timer)
                    clearTimeout(timer);
            }
        }));
        const items = batches
            .flat()
            .filter((hit) => hit && hit.id && hit.title)
            .map((hit) => ({ ...hit, score: scoreHit(hit, q) }))
            .sort((a, b) => b.score - a.score || Number(b.at || 0) - Number(a.at || 0) || String(a.title).localeCompare(String(b.title)));
        return {
            q,
            items: items.slice(0, limit * Math.max(1, active.length)).slice(0, 100),
            domains: list().map((p) => p.domainId),
            partial: failed.length > 0,
            failed,
            tookMs: Date.now() - started,
        };
    }
    return { query, list };
}
