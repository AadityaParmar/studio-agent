# 22 — BRD data file build + validation

**What to build:** Engine `build-brd <engagement> --mode preview` reads an Engagement's `_agent/` markdown (map, Module tickets and specs, open-items, Enterprise Source register and glossary) and writes a valid BRD data file. Schema errors and broken references fail with clear messages; completeness gaps fail for resolved Modules and warn for in-progress ones. This is the phase-2 contract. Spec: BRD data file (phase-2 contract), Module spec, Folder layout.

**Blocked by:** 21 — Repo + plugin scaffold, pack lint, CI

**Status:** resolved

- [x] JSON Schema (draft 2020-12) with `schemaVersion` semver + markdown schema docs shipped with `build-brd`
- [x] Data file carries every Module spec section (roles, records/fields with types, statuses, transitions, rules, exceptions, reports, integrations, volumes, Requirements, mapping), Sources (only this Engagement's), glossary (only this Engagement's terms), Open Items, process
- [x] Every fact object has `sources[]` + `proposed`; any proposed part → whole object proposed; non-proposed facts need ≥1 Source
- [x] Derived values (fit table, metrics, progress, counts, Mermaid) never stored
- [x] Withdrawn Requirements and merged/renamed Modules kept
- [x] Layer 2 cross-ref errors: missing Source, missing OI, duplicate/mis-prefixed Requirement ID, transition to unknown status, step to unknown lane/Module, unknown catalog slug, `GEN` as Module prefix, disputed term without open OI
- [x] Resolved Module missing acceptance → error; in-progress → warning
- [x] Non-zero exit + clear message per error class; warnings printed
- [x] Fixtures: valid in-progress, valid fully resolved, each broken-ref case, completeness case

## Comments

- Done 2026-10-29. Engine `build-brd <engagement-dir> [--mode preview]` in `neome-studio/engine/build-brd.mjs` (+ `brd/read-engagement.mjs`, `brd/validate.mjs`, `markdown.mjs`). Writes `_agent/brd/brd-data.json` only when no errors. Release / sign-off modes exit 2 "not built yet" (tickets 26, 27). Schema `skills/build-brd/references/brd-data.schema.json` (2020-12, `schemaVersion` 1.0.0) + docs `brd-data-schema.md` (fields, ID rules, error classes, and the markdown shapes the reader expects). Validated with `ajv` 8.20.0 (added, pinned exact). Catalog slug list shipped early at `reference/neome-app-catalog-slugs.json` (30 slugs from research ticket 01); ticket 32 can reuse it.
- Fixtures in `engine/test/fixtures/brd/`: `resolved` (incl. merged ENQ, renamed QUO `formerly: QT`, withdrawn QUO-03, confidential Source, Source + term of another Engagement filtered out) and `in-progress` (claimed QUO with gaps, open SVC with ticket only). Broken-ref and completeness cases = fixture copy + one edit per test. 40 build-brd tests.
- Implementation choices (small, my call; revisit if wrong):
  - Preview `engagement` = `version: null`, `status: working-draft` (spec lists only draft-for-review / signed-off for released versions).
  - Enterprise name = H1 of Enterprise `GLOSSARY.md`; Engagement title = H1 of `map.md` (`Map:` dropped); Module order = order of prefixes under map `## Modules`.
  - Module name from spec `Name:` line, else ticket front-matter `name`. A Module with no `spec.md` is read from its ticket body (same section grammar); it gets a "spec.md missing" completeness gap.
  - Additive fields beyond the spec shape: module `asIs[]` (spec section 3 AS-IS bullets, so every section is carried); `sources` + `proposed` on lanes, steps and edges (every fact object rule); `oi?` on steps (diagram needs it, ticket 24); glossary `disputed` holds the OI ID; extra error classes `unknown-step`, `duplicate-source`, `duplicate-oi`, `duplicate-module`.
  - Requirement prefix may equal the Module's `formerly` prefix (renamed Modules keep old IDs).
  - Missing priority / scope = schema error always (write `TBC` / `Open`, never omit). Uncited non-proposed fact = error always, any Module status.
  - Completeness (error if resolved, warning if open / claimed / needs-revisit, merged skipped): spec missing, any of 13 sections missing or empty (`N/A: reason` counts as filled), no purpose, no mapping, no live Requirements, Requirement without acceptance.
  - `general` and `plan` defined in schema (optional) but not built yet: ticket 25.
- Not verified: real skill-written markdown (tickets 28, 32 must write the shapes in `brd-data-schema.md`); GEN topic rules and plan cross-refs (ticket 25). npm audit not re-checked after adding ajv.
