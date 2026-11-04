# Kinds dictionary from studio-ai-docs

Type: research (AFK)
Status: resolved
Blocked by: —

## Question

Can every resource kind and variant (form, composite, field types, layouts, var kinds, report/action/deeplink kinds, workflow node types) be pulled from `docs/studio-ai-docs/*.md` headings into a `kinds.json` dictionary? List counts per kind, any doc gaps, and the key properties per kind a digest needs (refs, parent, spreadsheet, role links, node next-links).

## Comments

- Yes — done. `research/extract-kinds.mjs` parses `## \`kind\`` / `### \`kind / variant\`` headings and wrote `research/kinds.json`: 24 kinds, 297 variants, exact match to README's kind list.
- Largest: node 117, field 84, var 49; 9 kinds are polymorphic (open schema omits variant properties).
- Parent links are prose ("Needs parent X") in every section intro; refs (spreadsheet/role/var/layout) are "Resource name" properties.
- Key gap: workflow node next/branch links are undocumented — only `workflow.edgeMap` "keyed as describe prints"; no `next` property on any node variant.
- Full table + 7 gaps/oddities: `.scratch/template-bank/research/02-kinds-dictionary.md`.


## Answer

Yes. `research/extract-kinds.mjs` → `research/kinds.json`: 24 kinds, 297 variants (matches README list). Parent + ref properties tabulated per kind. Gap: workflow topology only in `workflow.edgeMap`, not on nodes; digest must read edgeMap from JSON. Detail: [research/02-kinds-dictionary.md](../../../../.scratch/template-bank/research/02-kinds-dictionary.md).
