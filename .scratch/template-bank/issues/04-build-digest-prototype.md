# Build digest + flowchart prototype

Type: prototype (HITL)
Status: resolved
Blocked by: 01, 02, 03

## Question

What goes in a Build digest and its flowchart? Rough Node script on the samples: size target (~20–50 KB), what is kept (Build areas, forms + field types, sheets, refs, roles, actions, reports, workflow node chains), what dropped. React to output.

## Comments

- 2026-11-03: Took over a stale claim (no work done). v1 = one file per Build: 32–110 KB, too big for NB-04 and HRMS. v2 split per Build area. Locked with user.

## Answer

Locked: digest **v2**. Prototype on throwaway branch `prototype/build-digest` (commit ead48ef), `.scratch/template-bank/prototype/digest.mjs`. Run `node .scratch/template-bank/prototype/digest.mjs` → `raw/digests/<NN>/` (gitignored, client data).

**Shape, per Neome Build** (dedupe by entId+version):

- `overview.md` (2–8 KB): about, counts, roles, list of Build areas (size each), chat-only Groups, cross-area ref counts, option lists (setOfText).
- `<area>.md` per Build area (≤17 KB on all 7 samples): actions (kind → target @roles), sheets (fields `Name:type`, `→RefSheet(other area)`, `{pickText options}`, `@roles`, `⇐copied from ref`, `*` required; form logic: formulas, visibility rules, events; insert/update/read/remove roles), reports (kind, from, merge, in/out form), other forms, workflows.
- Workflows: tree from `edgeMap` (NEXT/TRUE/FALSE/ITERATE), each node = kind(sheet/report) + builder's name (skip `Neo*` defaults) + condition (`Curr.HRStatus equalTo "Approved"`, option ids → text) + message/recipient/schedule/deeplink/plugin.
- Mermaid, no model: `build.mmd` (areas + cross-area ref counts), `<area>.refs.mmd` (sheet refs, outside targets marked), `<area>.wf.mmd` (one flowchart per workflow).

**Build area rule:** per item: Module tag → else Group whose actions target the sheet (most votes) → else area of the other sheets in the same workflow → else ref neighbours → else `Orphans (maybe dead)` area, flagged "low weight for Pattern tagging". Modules used in only 2 of 7 Builds (and partly); Groups = builder's menu, reads well as Build areas (Leave, Attendance, Payroll…).

**Dropped:** automations (legacy engine; in HRMS all "Migrated…" and inactive, replaced by workflows), layouts, styles, IDs, positions, per-field permissions, NeoQL text, deeplink/driveSheet/translation detail, dividers/labels.

**Facts for later tickets:**

- Sizes: overview + areas total 33–123 KB per Build; one area digest fits small-model input easily → Pattern tagging can run per area.
- Orphan sheets: HRMS 13/51, NB-07 22/47, NB-04 9/62.
- Digests still carry client text: Build name, about, sheet/field names, message bodies (`msg "…"`). Scrub rules must cover message text.
- Text-tree shows workflow merges as `↺`; Mermaid shows them right. Fine for now.
- GLOSSARY "Build area" says "builder's own grouping name"; in practice = Module or Group. Worth a /domain-modeling touch when bank format is set.
