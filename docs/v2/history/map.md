# Map: Template bank (Labels: wayfinder:map)

## Destination

Locked plugin enhancement spec, proven on 1–2 sample Neome Builds: Build digest + flowchart script, bank format (Pattern / Template module / Template), and how ingest, review-draft, grill-module, neome-mapping use the bank, and a bank refine skill for adding new Neome Builds later. Building the full bank and editing skills come after.

## Spec

Combined spec: [spec.md](spec.md) (gists all decisions + build slices). Route clear again 2026-11-03 after [Neome App Builds as a source](issues/12-neome-app-builds.md) (spec §10 + slices 9–11).

## Notes

- Plugin change: follow `docs/route.md`. Gate `npm test` + evals. Terms per `GLOSSARY.md` (§ Template bank).
- No model reads raw JSON. Script digests first; models read digests only.
- Raw Neome Build JSON = client data → `.scratch/template-bank/raw/` (gitignored). Scrub client names before commit.
- No Capability map. No limit model (see Neome facts below).
- studio-ai-docs = parser dictionary (kind/type names → `kinds.json`), never in prompts.
- Flowchart per Neome Build and per Template: Mermaid, from digest, no model.
- Models: script (parse + scrub) → Sonnet 5.5 (per-area tagging) → Opus 5.5 (clustering) → fresh Opus 5.5 (review) → human only when unsure / split / merge / retire. Provider Claude-sales via `delegate_task`; fallback default Claude, then GLM/ZCode.
- `neome-studio` MCP can read live Neome Builds: possible source beside JSON files.
- Skills: /grilling, /domain-modeling, /prototype.
- Neome facts (user, 2026-11-03): Enterprise set up + deployed from Neome Studio only, then ready for users; no server or cloud. Limited modules, described as JSON; beyond them = development change or workaround. Structured JSON covers most work; Requirement doesn't fit → ask / grill more to fit. Plugins connect to external systems.

## Decisions so far

- [Sample Neome Builds](issues/01-sample-neome-builds.md) — 7 unique Builds in raw/ (3 files are misnamed copies); 0.7–3.4 MB; shape `studioEnt.*Map{keys,map}`
- [Kinds dictionary from studio-ai-docs](issues/02-kinds-dictionary.md) — kinds.json built (24 kinds, 297 variants); workflow flow from edgeMap only
- [Neome Studio MCP as Build source](issues/03-mcp-as-source.md) — complement only; raw JSON stays source; MCP for live lookup / drift
- [Build digest + flowchart prototype](issues/04-build-digest-prototype.md) — v2 locked: overview + one digest per Build area (≤17 KB), area = Module → Group → workflow/ref neighbours → Orphans; automations dropped; Mermaid per Build/area/workflow
- [Bank format](issues/05-bank-format.md) — one MD + YAML file per entry, IDs `PAT-`/`TMOD-`/`TPL-` slug; evidence `seenIn` NB-code + area, no threshold; Mermaid inline; Template modules hold usual needs + Neome App/Delivery hints
- [Mining pipeline and scrub](issues/06-mining-pipeline.md) — script scrub before any model → Sonnet tags per area → Opus clusters → fresh Opus review → human yes per entry (later relaxed by Bank refine skill); Claude-sales, fallback Claude then GLM
- [Bank location and Neome App catalog](issues/07-bank-location-catalog.md) — `neome-studio/reference/template-bank/`, ships with plugin; beside catalog, one-way slug link, slug checked in `npm test`; catalog wins on App ability, bank on usual Delivery; internal only
- [Skill integration](issues/08-skill-integration.md) — 4 readers; `template:` on map, `templateModule:` on Module ticket (`none` = checked); ingest proposes, review-draft confirms; grill tier Inputs → Template bank → catalog; mismatch = Open Item (Neomenta); IDs never cited or client-facing
- [Bank refine skill](issues/09-bank-refine-skill.md) — maintainer-only tool, also does first mining; incremental (`--full` optional); 6 change kinds; Opus review auto-applies, human asked only when unsure or split/merge/retire; branch + report; CHANGELOG `replacedBy`; npm test + evals gate
- [Template matching evals](issues/10-template-matching-evals.md) — new case `template-hr-small` with own fixture Template bank; 6-step replay; new hard gate `forbidden` (refused usual need) + mechanic `absent` (no IDs in views); refine gate = `npm test` only
- [Neome App Builds as a source](issues/12-neome-app-builds.md) — App JSON = App baseline, code `NA-<slug>`, new `APP-` entry kind; JSON beats catalog page; mining merges into existing PAT/TMOD/TPL; cap 25 KB; APP = 2nd Delivery cross-check

## Not yet specified

## Out of scope

- [Neome limits](issues/11-neome-limits.md): skipped by user. No limit model; Neome facts kept in Notes.
- Mining all Neome Builds into the full bank (execution, after map).
- Editing skills / engine for real (after map).
