#!/usr/bin/env node
// Extract a kinds dictionary from docs/studio-ai-docs headings.
// Parses "## `kind`" and "### `kind / variant`" headings and writes kinds.json
// shaped as { kind: [variants...] }. Top-level kinds with no variants map to [].

import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const docsDir = join(here, '..', '..', '..', 'docs', 'studio-ai-docs');

const headingRe = /^(#{2,3})\s+`([^`]+)`/;

const kinds = Object.create(null);
const skipped = [];

for (const file of readdirSync(docsDir).filter((f) => f.endsWith('.md')).sort()) {
  const lines = readFileSync(join(docsDir, file), 'utf8').split('\n');
  for (const line of lines) {
    const m = headingRe.exec(line);
    if (!m) continue;
    const [, level, name] = m;
    if (level === '##') {
      if (!(name in kinds)) kinds[name] = [];
      else skipped.push(`${file}: duplicate "## \`${name}\`"`);
    } else {
      const [kind, variant] = name.split(' / ').map((s) => s.trim());
      if (!(kind in kinds)) {
        skipped.push(`${file}: variant "### \`${name}\`" seen before its kind section`);
        kinds[kind] = [];
      }
      if (!variant) {
        skipped.push(`${file}: malformed variant heading "### \`${name}\`"`);
        continue;
      }
      const list = kinds[kind];
      if (list.includes(variant)) skipped.push(`${file}: duplicate variant \`${name}\``);
      else list.push(variant);
    }
  }
}

const outPath = join(here, 'kinds.json');
writeFileSync(outPath, JSON.stringify(kinds, null, 2) + '\n');

const kindsCount = Object.keys(kinds).length;
const variantsCount = Object.values(kinds).reduce((n, v) => n + v.length, 0);
console.log(`wrote ${outPath}`);
console.log(`kinds: ${kindsCount}, variants: ${variantsCount}`);
for (const [kind, variants] of Object.entries(kinds)) {
  console.log(`  ${kind}: ${variants.length}`);
}
if (skipped.length) {
  console.log('skipped:');
  for (const s of skipped) console.log(`  ${s}`);
}
