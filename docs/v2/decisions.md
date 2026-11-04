# v2 Decisions: Neome Requirements Studio

New design decisions of v2 (Template bank effort, tickets 01–12). v1 decisions D00–D44 stay valid unless named here: [../v1/decisions.md](../v1/decisions.md). Terms per [GLOSSARY.md](../../GLOSSARY.md) § Template bank.

Full history: [map.md](history/map.md), [spec.md](history/spec.md), [issues/](history/issues/).

---

## D45 Sample Neome Builds ([01](history/issues/01-sample-neome-builds.md))

- Source = Neome Build JSON export: `{type:"ent", payload:{studioEnt:{…*Map{keys,map}}}}`. 0.7–3.4 MB each.
- Dedupe by `entId` + `version`. Name from `details.name`. Build code `NB-NN`; code → client map only in gitignored raw dir.
- Build JSON `version` = text ID; `versionCode` = number that orders exports (build-time fix).

## D46 Kinds dictionary ([02](history/issues/02-kinds-dictionary.md))

- `kinds.json` from `docs/studio-ai-docs/` headings: 24 kinds, 297 variants. Parser only, never in prompts.
- Workflow flow from `workflow.edgeMap` only.

## D47 Neome Studio MCP as Build source ([03](history/issues/03-mcp-as-source.md))

- Complement only. Raw JSON = only stored source. MCP for live lookup, schema, drift.

## D48 Build digest + flowchart ([04](history/issues/04-build-digest-prototype.md))

- Script, no model. Per Build: `overview.md` (2–8 KB) + one `<area>.md` per Build area (≤17 KB) + Mermaid `build.mmd`, `<area>.refs.mmd`, `<area>.wf.mmd`.
- Build area rule: Module tag → Group with most actions on the sheet → area of other sheets in same workflow → ref neighbours → `Orphans (maybe dead)` (low weight).
- Automations dropped (legacy). Layouts, styles, IDs, per-field rights, NeoQL text dropped.

## D49 Template bank format ([05](history/issues/05-bank-format.md))

Amended by D55 (`app` kind, `APP-` IDs, `## Execute`).

- One Markdown + YAML front matter file per entry; file name = ID. IDs `PAT-`, `TMOD-`, `TPL-` + slug, no numbers.
- Evidence `seenIn: [{build: NB-NN, area}]`. No threshold; readers weigh count. Mermaid inline.
- Pattern: name, task, how, workaround yes/no + why (why only when yes), limits, flowchart, seenIn.
- Template module: name, aliases, usual needs, steps, Patterns, sheets + key fields + roles, `neomeApp` (catalog slug or `none`), `delivery` (`standard|configuration|custom`, BRD data enum), flowchart, seenIn.
- Template: name, business type, Template modules core / optional, links, flowchart, seenIn.
- New terms: Template bank, Usual need, Pattern, Template module, Template; Build area redefined.

## D50 Mining pipeline + scrub ([06](history/issues/06-mining-pipeline.md))

- digest → scrub (script, before any model) → tag (Sonnet 5.5, medium, per Build area) → cluster (Opus 5.5, high, tag sheets only) → review (fresh Opus 5.5).
- Scrub: per-Build word list `raw/scrub/<NB-NN>.txt`, seeded from Build name + `about`, maintainer adds names, ends with `# checked`. Removes listed words, phone, email; message bodies → `«msg»`. Listed word left = hard fail.
- Run via `delegate_task`: Claude-sales → default Claude → ZCode GLM. Tokens logged per stage per Build, no cap.
- "Human yes per entry" superseded by D53.

## D51 Location + Neome App catalog ([07](history/issues/07-bank-location-catalog.md))

Amended by D55 (`apps/` folder).

- `neome-studio/reference/template-bank/{patterns,template-modules,templates}/` + `CHANGELOG.md` + `reports/`. Ships with plugin.
- One-way link: `neomeApp` slug in `reference/neome-app-catalog-slugs.json` or `none`. Catalog never names the Template bank.
- Catalog wins on what an App can do; Template bank wins on how Neomenta usually delivers. Mismatch shown as both.
- Plugin stays `UNLICENSED`, internal marketplace only.

## D52 Skill integration ([08](history/issues/08-skill-integration.md))

- Readers: ingest, review-draft, grill-module, neome-mapping (+ resolve-module passes `templateModule`). Not build-prototype, not studio.
- Fields: `map.md` `template: TPL-… | none`; Module ticket `templateModule: TMOD-… | none`. `none` = checked, missing = not checked. ID gone = warning, suggest from `CHANGELOG.md` `replacedBy`.
- Engine `template-bank index` prints ID, name, aliases, business type, seenIn count; model reads matched entries only.
- ingest proposes, review-draft confirms (only place `template:` changes; suggests missing Modules, merge / split).
- grill-module tier: Inputs → Template bank → catalog → always ask. Usual need → Requirement only on live Enterprise yes; from Inputs → Open Item; no → dropped.
- neome-mapping: Template module `delivery` cross-checks; mismatch → higher grade + Open Item (owner Neomenta). Hint never lowers grade.
- Template bank is not a Source: bank facts = `(proposed, to confirm)`. No IDs, Build codes or seenIn in BRD, Prototype, Questionnaire. Supersedes nothing in D00; extends the citation rule.

## D53 Bank refine tool ([09](history/issues/09-bank-refine-skill.md))

- Maintainer-only: driver `maintainer/refine-template-bank.md` + script `.mjs`. Same tool for first mining and every refine. By hand.
- Incremental; `--full` re-clusters from all tag sheets (retires need `--confirm-retire`).
- Changes: `add`, `enhance`, `split`, `merge`, `rename`, `retire`, each with reason + proof lines.
- Review auto-applies passing `add` / `enhance` / `rename`; asks maintainer on doubt and every `split` / `merge` / `retire`.
- Retire / split → file deleted; merge keeps one ID, other → `aliases`; `CHANGELOG.md` `replacedBy`. Retire at zero `seenIn` or on ask, never for age. Updated Build keeps NB code, old rows replaced.
- Output: branch `template-bank-refine-<date>` + report. Never merges, never pushes. Maintainer guide: [../template-bank-refine.md](../template-bank-refine.md).

## D54 Template matching evals ([10](history/issues/10-template-matching-evals.md))

- New case `template-hr-small`, own fixture Template bank swapped in by `prepare`. 6-step replay.
- New golden field `forbidden` + hard gate `forbidden` max 0. New mechanic `absent` (no IDs in views).
- Gate: reader skill text → `npm test` + `run --all`. Refine → `npm test` only; `run --all` only if format changes.

## D55 App baselines + Execute section ([12](history/issues/12-neome-app-builds.md))

Amends D49 (IDs, kinds) and D51 (folders).

- Neome App Build = App baseline. Own code `NA-<catalog slug>`, not NB. Still evidence: `seenIn` rows `{build: NA-<slug>, area}`.
- New kind `app`, ID `APP-<catalog slug>`, folder `reference/template-bank/apps/`. Body: Gives, sheets + key fields + roles, workflows, flowchart. `seenIn` = own `NA-<slug>` only.
- Link: TMOD `neomeApp: <slug>` → `APP-<slug>` when the file exists. TMODs not folded into APPs.
- Wins: APP entry wins on what the App has (catalog page = fallback). Template module wins on usual Delivery. Mismatch shown as both.
- NA: no scrub word list; email / phone leak check still runs. Raw + digests gitignored. Area cap 17 → 25 KB, all Builds.
- Optional `## Execute`, any kind: MCP build steps. When present = last section; first body line exactly `Only use this to apply this into a Studio Enterprise via MCP.` (engine checks both). Nothing buildable → guard + one line why. Contract: `reference/template-bank/EXECUTE.md`. Only MCP apply work reads it.

## Out of scope

- [Neome limits](history/issues/11-neome-limits.md): skipped. No limit model; Neome facts in map Notes.
- No Capability map. No model reads raw JSON.
