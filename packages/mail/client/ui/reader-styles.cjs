"use strict";
module.exports = `
.wbml-htmwrap{display:grid;gap:8px;margin:10px 0}
.wbml-htmlbar{display:flex;align-items:center;flex-wrap:wrap;gap:8px;font-size:12px}
.wbml-htmlbar .wbml-muted{flex:1 1 220px;min-width:0}
.wbml-htmlpad{padding:12px;border:1px solid var(--wb-line);border-radius:12px;background:var(--wb-card)}
.wbml-htmlframe{display:block;width:100%;min-height:120px;border:0;border-radius:8px;background:var(--wb-card)}
@media (max-width:760px){.wbml-htmlpad{padding:8px;border-radius:8px}.wbml-htmlframe{border-radius:6px}}
.wbml-read-bar{display:flex;flex:none;align-items:center;flex-wrap:wrap;gap:6px;padding:8px 12px;border-bottom:1px solid var(--wb-line)}
.wbml-read-bar .wbml-reader-nav{margin-inline-start:auto}
.wbml-read-scroll{min-height:0;overflow:auto;overscroll-behavior:contain}
.wbml-read-header{padding:14px;display:grid;gap:6px;overflow-wrap:anywhere;font-size:13px}
.wbml-read-header h3{font-size:1.2rem;line-height:1.45;margin:0 0 4px}
.wbml-read-sender{display:flex;align-items:baseline;flex-wrap:wrap;gap:6px}
.wbml-read-sender span,.wbml-read-stamp{color:var(--wb-muted)}
.wbml-read-header summary{cursor:pointer;color:var(--wb-accent);width:fit-content}
.wbml-read-header summary:focus-visible{outline:2px solid var(--wb-accent);outline-offset:2px}
.wbml-read-header details>div{padding-block:3px}
@media (min-width:901px){.wbml-layout.has-detail:has(>.wbml-detailpane.is-expanded){grid-template-columns:clamp(200px,21%,300px) minmax(0,1fr)}.wbml-layout:has(>.wbml-detailpane.is-expanded)>.wbml-listpane{display:none}}
@media (max-width:900px){.wbml-read-bar .wbml-expand{display:none}.wbml-layout.has-detail>.wbml-detailpane{max-height:none}.wbml-read-scroll{overflow:visible}.wbml-read-bar{position:sticky;top:0;z-index:1;background:var(--wb-surface)}}
`;
