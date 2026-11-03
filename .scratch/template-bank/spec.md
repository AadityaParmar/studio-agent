# Spec: Template bank (plugin enhancement)

Locked spec for the Template bank effort. Built from the [map](map.md) decisions; each section links the ticket that holds the detail. Ticket wins on conflict. Terms per `GLOSSARY.md` § Template bank (already added: Template bank, Neome Build, Build area, Pattern, Template module, Usual need, Template).

Proven on samples: digest v2 run on all 7 sample Neome Builds ([Build digest + flowchart prototype](issues/04-build-digest-prototype.md)); bank format hand-written from NB-02 / NB-04 / NB-05 ([Bank format](issues/05-bank-format.md)).

Process per `docs/route.md`: one ticket per build slice, test first for engine work, gate below, release as v2.

---

## 1. What it adds

A Template bank: Patterns, Template modules and Templates learnt from past Neome Builds. Ships in the plugin. Four Consultant skills read it to suggest Modules, usual needs and Delivery hints. A maintainer tool builds and refines it from Neome Build JSON. Nothing from the Template bank reaches the Enterprise as a fact without their yes.

## 2. Build digest + flowchart (script, no model)

Detail: [Build digest + flowchart prototype](issues/04-build-digest-prototype.md). Prototype: `.scratch/template-bank/prototype/digest.mjs` (branch `prototype/build-digest`).

- **Input:** Neome Build JSON (`{type:"ent", payload:{studioEnt:{…*Map{keys,map}}}}`). Dedupe by `entId` + `version`, name from `details.name` ([Sample Neome Builds](issues/01-sample-neome-builds.md)). Raw JSON = only stored source; `neome-studio` MCP only for live lookup / drift ([Neome Studio MCP as Build source](issues/03-mcp-as-source.md)).
- **Parser dictionary:** `kinds.json` from `docs/studio-ai-docs/` headings (24 kinds, 297 variants). Never in prompts. Workflow flow from `workflow.edgeMap` only ([Kinds dictionary](issues/02-kinds-dictionary.md)).
- **Output per Build:** `overview.md` (2–8 KB) + one `<area>.md` per Build area (≤17 KB) + Mermaid `build.mmd`, `<area>.refs.mmd`, `<area>.wf.mmd`.
- **Build area rule:** Module tag → Group with most actions on the sheet → area of other sheets in same workflow → ref neighbours → `Orphans (maybe dead)` (low weight).
- **Kept / dropped:** as ticket. Automations dropped (legacy).

## 3. Scrub (script, before any model)

Detail: [Mining pipeline and scrub](issues/06-mining-pipeline.md).

- Per-Build gitignored word list `raw/scrub/<NB-NN>.txt`, seeded from Build name + `about`; maintainer adds the rest once.
- Removes Build name, `about`, client/people names, phone/email; message bodies → `«msg»`; sheet/field names kept unless they hold a listed word.
- Hard fail if a listed word survives. Runs on every file before commit. Unscrubbed digests never leave `raw/`.
- Build code `NB-NN` → client map only in `raw/`.

## 4. Template bank format

Detail: [Bank format](issues/05-bank-format.md). Samples: `.scratch/template-bank/prototype/bank/` (branch `prototype/bank-format`).

- One Markdown + YAML front matter file per entry; file name = ID. IDs = prefix + slug: `PAT-`, `TMOD-`, `TPL-`. No numbers.
- Evidence `seenIn: [{build: NB-NN, area: <Build area>}]`. No threshold; readers weigh count.
- Mermaid inline.
- **Pattern:** name, task, how (Neome parts), workaround yes/no + why, limits, flowchart, seenIn.
- **Template module:** name, aliases, usual needs, process steps, Patterns (IDs), usual sheets + key fields + roles, `neomeApp` (catalog slug or `none`), `delivery` hint (`standard|configuration|custom`, BRD data enum), flowchart, seenIn.
- **Template:** name, business type, Template modules (core / optional), links between them, flowchart, seenIn.
- Bank `CHANGELOG.md`: one line per applied change; `replacedBy` for retired / split / merged IDs.

## 5. Location and Neome App catalog

Detail: [Bank location and Neome App catalog](issues/07-bank-location-catalog.md).

- `neome-studio/reference/template-bank/{patterns,template-modules,templates}/` + `CHANGELOG.md`. Ships with plugin.
- Beside the catalog. One-way link: `neomeApp` slug must be in `reference/neome-app-catalog-slugs.json` or `none`. Catalog never mentions the Template bank.
- Catalog wins on what an App can do; Template bank wins on how Neomenta usually delivers. Mismatch shown as both, never silently picked.
- Plugin stays `UNLICENSED`, internal marketplace only, while Template bank inside.

## 6. Skill integration

Detail: [Skill integration](issues/08-skill-integration.md).

- **Readers:** ingest, review-draft, grill-module, neome-mapping. Not build-prototype, not studio.
- **Fields:** Engagement `_agent/map.md` front matter `template: TPL-… | none`; Module ticket front matter `templateModule: TMOD-… | none`. `none` = checked, no match; missing = not checked.
- **Engine:** index command prints ID, name, aliases, business type, seenIn count. Model matches on index, reads only matched entries whole. ID check: must exist; ID gone = warning (suggest from `CHANGELOG.md` `replacedBy`), next resolve-module re-matches.
- **ingest:** draft stays Inputs-only. Proposes matches, writes fields, lists in report. Later runs match only new draft Modules; never change a confirmed `templateModule`.
- **review-draft:** confirms / changes matches (group 1). Suggests Modules the Template has but draft lacks (`(proposed, to confirm)`; yes → `module new`, else dropped). Suggests merge / split when a draft Module spans two Template modules. Re-match after rename / merge / split. Only place `template:` changes.
- **resolve-module:** passes `templateModule` to grill-module and neome-mapping.
- **grill-module:** tier Inputs → Template bank → catalog → always ask. Usual needs not in Sources → questions with suggested answer. Patterns + process steps → suggested answers for process topics. Always-ask facts never settled by Template bank. Usual need → Requirement only on live Enterprise yes; from-Inputs mode → Open Item with suggested answer; Enterprise no → dropped, no trace.
- **neome-mapping:** catalog picks App (unchanged). Heuristics grade Delivery first; Template module `delivery` cross-checks. App or Delivery mismatch → higher grade + Open Item, owner Neomenta, quoting both. Hint never lowers grade alone. Section 12 stays 3 lines.
- **Citation:** Template bank is not a Source. Bank-derived facts = exact `(proposed, to confirm)`. IDs only agent-side (front matter, coverage table, hand-back). Engine citation check unchanged.
- **Client-facing views:** no `TPL-` / `TMOD-` / `PAT-` IDs, Build codes or seenIn in BRD, Prototype, Questionnaire.

## 7. Bank refine tool (maintainer only)

Detail: [Bank refine skill](issues/09-bank-refine-skill.md); pipeline from [Mining pipeline and scrub](issues/06-mining-pipeline.md).

- Driver prompt `neome-studio/maintainer/refine-template-bank.md` + script `refine-template-bank.mjs` (like `upstream-check`). `studio` never names it.
- Same tool does first mining (empty Template bank) and every later refine. Trigger: by hand, new or updated Build JSON in `raw/`.
- **Stages:** digest → scrub → tag → cluster → review → branch + report.
  - Tag: Sonnet 5.5, effort medium, one call per Build area (+ overview). YAML tag sheet: guessed Template module + Patterns (name, task, how, workaround, proof lines). Seeded with current bank names after first run.
  - Cluster: Opus 5.5, effort high. Reads tag sheets + current bank entries only (incremental); `--full` re-clusters from all tag sheets. Tag sheets kept in `raw/`.
  - Review: fresh Opus 5.5. Auto-applies `add` / `enhance` / `rename` that pass. Asks human only when unsure (proof lines don't back it, disagrees with clusterer) or change is `split` / `merge` / `retire`.
- **Change kinds:** `add`, `enhance`, `split`, `merge`, `rename`, `retire`, each with reason + proof lines.
- **IDs:** retire / split → file deleted. Merge keeps one ID, other name → `aliases`. `CHANGELOG.md` records `replacedBy`. Retire when `seenIn` hits zero or maintainer asks; never for age. Updated Build keeps its NB code; its old `seenIn` rows replaced.
- **Output:** commits on branch `template-bank-refine-<date>` + report (change + reason). Maintainer skims, merges. Revert = git.
- **Run:** `delegate_task`, provider Claude-sales: tag children in parallel per Build → 1 cluster child → 1 review child. Fallback: default Claude → GLM/ZCode (GLM-5.3-Flash tag, GLM-5.3 cluster / review). Tokens measured and logged per stage per Build, no cap.

## 8. Checks and evals

Detail: [Template matching evals](issues/10-template-matching-evals.md).

- **`npm test` bank checks:** front matter shape, unique IDs, PAT / TMOD refs resolve, catalog slug, scrub word check, "ID gone" warning (unit test).
- **New Eval case `template-hr-small`:** own fixture Template bank swapped in by `prepare` (`TPL-hr-small`, decoy `TPL-sales-crm`, `TMOD-leave`, `TMOD-expenses`, `TMOD-attendance`, `TMOD-employee-master`, `PAT-approval-by-status`). Inputs: Leave, Expenses, Visitor log. 6-step replay: ingest → review-draft → resolve-module Leave (live) → resolve-module Expenses (from Inputs) → build-brd → questionnaire. Traps and mechanics as ticket.
- **New eval features:** golden field `forbidden` + hard gate `forbidden` max 0; mechanic type `absent` (regex `TPL-|TMOD-|PAT-|NB-\d|seen in` on `brd/**`, `prototypes/**`, `questionnaires/**`).
- **Gate:** skill text change to the 4 readers → `npm test` + `run --all`. Refine → `npm test` only (incl. fixture `check`); `run --all` only if bank format changes. tiny-synthetic and anglo-gulf-crm untouched.

## 9. Out of scope

- No limit model ([Neome limits](issues/11-neome-limits.md), skipped). Neome facts stay in map Notes.
- No Capability map.
- Raw JSON never read by a model.

---

## Build slices (suggested order)

Each = one ticket in a new build effort, gate per `docs/route.md` §1.

1. **Bank format + checks:** `reference/template-bank/` skeleton, `CHANGELOG.md`, engine bank checks + "ID gone" warning in `npm test`. Test first.
2. **Digest + scrub scripts:** port prototype `digest.mjs` + `kinds.json` + scrub into `neome-studio/maintainer/`. Tests on a small synthetic Build JSON (no client data in repo).
3. **Refine tool:** `refine-template-bank.md` + `.mjs`, delegate pipeline, branch + report.
4. **First mining run:** refine tool on the 7 sample Builds → first real Template bank (execution; needs Claude-sales).
5. **Engine reader support:** index command, `template:` / `templateModule:` fields + ID check, `route.md` rows.
6. **Eval case `template-hr-small`:** fixture, `forbidden` gate, `absent` mechanic. Lands before slice 7 so skill changes are gated.
7. **Skill text:** ingest, review-draft, resolve-module, grill-module, neome-mapping per §6. Gate `npm test` + `run --all`.
8. **Release v2:** plugin version bump, `docs/v2/decisions.md` (new D-numbers for this spec), move effort to `docs/v2/history/`, tag `v2`.

## Builder's choices (not decisions, pick in slice)

- Exact file names / folder for digest + scrub scripts and `kinds.json` under `neome-studio/maintainer/`.
- Final gitignored `raw/` path for the refine tool (today `.scratch/template-bank/raw/`); must stay gitignored.
