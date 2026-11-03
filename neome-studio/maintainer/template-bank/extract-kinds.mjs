#!/usr/bin/env node
// Parser dictionary for the Build digest (ticket .scratch/template-bank/issues/02-kinds-dictionary.md).
// Reads "## `kind`" and "### `kind / variant`" headings in docs/studio-ai-docs/*.md → kinds.json
// ({kind: [variants…]}, kinds with no variants → []). Never goes into a prompt. Re-run when the docs change;
// npm test fails while kinds.json and the docs disagree.
//
//   node neome-studio/maintainer/template-bank/extract-kinds.mjs [<docs-dir>]   (default docs/studio-ai-docs)
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
export const DEFAULT_DOCS = join(here, "..", "..", "..", "docs", "studio-ai-docs");
const HEADING = /^(#{2,3})\s+`([^`]+)`/;

/** → {kinds, skipped: [text…]} (duplicates, variants before their kind, malformed headings). */
export function extractKinds(docsDir) {
  const kinds = {};
  const skipped = [];
  for (const file of readdirSync(docsDir).filter((f) => f.endsWith(".md")).sort()) {
    for (const line of readFileSync(join(docsDir, file), "utf8").split("\n")) {
      const m = HEADING.exec(line);
      if (!m) continue;
      const [, level, name] = m;
      if (level === "##") {
        if (!(name in kinds)) kinds[name] = [];
        else skipped.push(`${file}: duplicate "## \`${name}\`"`);
        continue;
      }
      const [kind, variant] = name.split(" / ").map((s) => s.trim());
      if (!(kind in kinds)) {
        skipped.push(`${file}: variant "### \`${name}\`" seen before its kind section`);
        kinds[kind] = [];
      }
      if (!variant) { skipped.push(`${file}: malformed variant heading "### \`${name}\`"`); continue; }
      if (kinds[kind].includes(variant)) skipped.push(`${file}: duplicate variant \`${name}\``);
      else kinds[kind].push(variant);
    }
  }
  return { kinds, skipped };
}

export function main(argv) {
  const docs = resolve(argv[0] || DEFAULT_DOCS);
  const { kinds, skipped } = extractKinds(docs);
  const out = join(here, "kinds.json");
  writeFileSync(out, JSON.stringify(kinds, null, 2) + "\n");
  console.log(`wrote ${out}`);
  console.log(`kinds: ${Object.keys(kinds).length}, variants: ${Object.values(kinds).flat().length}`);
  for (const [k, v] of Object.entries(kinds)) console.log(`  ${k}: ${v.length}`);
  for (const s of skipped) console.log(`skipped: ${s}`);
  return 0;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) process.exit(main(process.argv.slice(2)));
