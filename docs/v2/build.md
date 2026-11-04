# v2 Build: Neome Requirements Studio

What the Template bank build slices built, where, build-time calls, not verified. Design reasons: [decisions.md](decisions.md). v1 build: [../v1/build.md](../v1/build.md).

---

## Slice → what was built

Paths under `neome-studio/` unless rooted.

| Slice | Built | Main files |
|---|---|---|
| 1 | Template bank format + checks, "ID gone" warning | `reference/template-bank/` (README, CHANGELOG), `engine/template-bank.mjs` |
| 2 | Digest + scrub scripts, kinds dictionary | `maintainer/template-bank/{digest,build-json,areas,render,mermaid,scrub,raw-dir,extract-kinds}.mjs`, `kinds.json`, fixture `engine/test/fixtures/template-bank/acme-build.json` (made-up) |
| 3 | Bank refine tool | `maintainer/refine-template-bank.{md,mjs}`, `maintainer/template-bank/refine-{state,shapes,apply}.mjs`, `prompts/{tag,cluster,review,shapes}.md` |
| 4 | First mining run: 7 Builds → 113 entries (63 PAT, 45 TMOD, 5 TPL) | `reference/template-bank/**`, `reports/2026-11-03.md` |
| 5 | Engine reader support | `engine/template-bank-match.mjs` (`template-bank index` / `fields` / `set`), `engine/status.mjs` |
| 6 | Eval case + gates | `evals/template-hr-small/`, `forbidden` gate, `absent` mechanic in `evals/lib/` |
| 7 | Skill text | `skills/{ingest,review-draft,resolve-module,grill-module,neome-mapping}/` |
| 8 | Release | `.claude-plugin/plugin.json` 2.0.0, `docs/v2/`, maintainer guide `docs/template-bank-refine.md` |
| 9 | App baseline format + checks: `kind: app`, `APP-` IDs, `apps/` folder, `NA-<slug>` codes, area cap 17 → 25 KB | `engine/template-bank.mjs`, `engine/template-bank-match.mjs`, `maintainer/template-bank/digest.mjs`, `reference/template-bank/README.md`, `GLOSSARY.md` |
| 10 | Refine tool reads Neome App Builds (`NA-<slug>`, app-slugs map, gives, APP entries) | `maintainer/template-bank/apps.mjs`, `refine-{state,shapes,apply}.mjs`, `prompts/{tag,cluster,review,shapes}.md`, `docs/template-bank-refine.md` |
| 11 | Readers use App baselines: neome-mapping 2nd cross-check, grill-module gives; `absent` regex + APP fixture | `skills/{neome-mapping,grill-module}/`, `reference/map-logic.md`, `evals/template-hr-small/` (`APP-attendance-and-leave`) |

## Build-time calls

- Template module `delivery` uses the BRD data Delivery enum (`standard|configuration|custom`).
- Pattern `why` required only when `workaround: true`.
- Build `version` is a text ID; same ID = duplicate; `versionCode` orders.
- Word list must end with `# checked` before any model sees that Build.
- `--full` run never retires without `--confirm-retire`.
- Report copied into `reference/template-bank/reports/<date>.md` and committed.
- Fixture Template bank checks run inside `run.mjs check` (so in `npm test`).

## Tests and evals at v2

- `npm test` 456/456 (2026-11-04). `check`: 11 skills OK, Template bank 142 entries OK.
- Evals `run --all`: see [evals README](../../neome-studio/evals/README.md).

## Not verified at v2 (known risks)

- First run word lists held made-up names. Real names caught only by tag children and a later name scan (clean). Next run: real names in lists first.
- Scrub / leak check matches inside words (short codes give false alarms).
- Token counts of the first run mostly size estimates.
- Template bank match quality on real Engagements (only the made-up `template-hr-small` case tested).
- ZCode GLM fallback never exercised.
