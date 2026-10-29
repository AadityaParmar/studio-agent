// The fixed Prototype template: shell + proto.css + proto.js, with the page model embedded as JSON.
// No agent-written HTML: every screen is drawn by proto.js from the model. One file, no external JS or fonts
// (Roboto if installed, else system fonts). Same model in → byte-identical file out.
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const CSS = readFileSync(join(here, "proto.css"), "utf8");
const SCRIPT = readFileSync(join(here, "proto.js"), "utf8");

export function renderPrototypeHtml(model) {
  // JSON inside <script>: escape "<" so no text can close the tag.
  const json = JSON.stringify(model).replace(/</g, "\\u003c");
  const title = `PROTOTYPE · ${model.enterprise} · ${model.prefix} ${model.name}`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="generator" content="neome-studio build-prototype">
<title>${esc(title)}</title>
<style>
${CSS}
</style>
</head>
<body>
<noscript><p class="noscript">${esc(title)}: this Prototype is clickable and needs JavaScript (inline, nothing is downloaded). Turn it on and reload.</p></noscript>
<div id="app"></div>
<script type="application/json" id="proto-data">${json}</script>
<script>
${SCRIPT}
</script>
</body>
</html>
`;
}

function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}
