# Template bank: digest, scrub, refine helpers

Maintainer only. Scripts, no model. Spec: Template bank §2 Build digest, §3 Scrub. Terms per `GLOSSARY.md` § Template bank.

Raw dir (`--raw`, default `.scratch/template-bank/raw/`) holds client data. Must be gitignored; scripts refuse otherwise and write nowhere else. Never commit anything from it. Build codes only as `NB-NN`.

## Run

1. Drop Neome Build JSON into the raw dir.
2. `node neome-studio/maintainer/template-bank/digest.mjs [--raw <dir>] [<build.json> …]`
   → `<raw>/digests/<NB-NN>/`: `overview.md`, `<area>.md`, `build.mmd`, `<area>.refs.mmd`, `<area>.wf.mmd`, `meta.json`. Code map: `<raw>/builds.json`.
3. `node neome-studio/maintainer/template-bank/scrub.mjs [--raw <dir>] [NB-NN …]`
   → first run seeds `<raw>/scrub/<NB-NN>.txt`. Add client, people and place names. Re-run.
   → `<raw>/scrubbed/<NB-NN>/`. Any leak = exit 1, that Build's scrubbed dir removed.
4. Only `scrubbed/` goes to a model.

Normally you do not run these by hand: the refine tool (`../refine-template-bank.md` driver + `../refine-template-bank.mjs`) runs digest + scrub in `prepare`, then the model stages.

Docs changed? `node neome-studio/maintainer/template-bank/extract-kinds.mjs` rebuilds `kinds.json` (`npm test` fails while they disagree). Digest prints `kinds | NB-NN | unknown: …` for kinds the dictionary lacks.

## Files

| File | What |
|---|---|
| `digest.mjs` | CLI + `digestBuild(ent)`, `assignCodes` |
| `build-json.mjs` | `parseBuild`, `pickBuilds` (dedupe entId + version, newest version wins), `buildIndex`, `unknownKinds` |
| `areas.mjs` | Build area rule: Module tag → Group votes → workflow → refs → `Orphans (maybe dead)` |
| `render.mjs` | Markdown: field notation, workflow tree, area file, overview |
| `mermaid.mjs` | `build.mmd`, `<area>.refs.mmd`, `<area>.wf.mmd` |
| `scrub.mjs` | CLI + `seedWordList`, `parseWordList`, `scrubText`, `scrubFiles`, `findLeaks`, `termsFor` |
| `raw-dir.mjs` | raw dir guard (gitignored, writes inside only) |
| `extract-kinds.mjs`, `kinds.json` | parser dictionary from `docs/studio-ai-docs/` headings |
| `refine-state.mjs` | refine tool: raw dir layout, Build status (new / updated / current / removed), runs, scrub words |
| `refine-shapes.mjs` | refine tool: tag sheet, change list, verdict checks; review rule (`decide`) |
| `refine-apply.mjs` | refine tool: apply a change list on a copy, check, then the Template bank; report |
| `prompts/` | refine tool child prompts (`tag.md`, `cluster.md`, `review.md`) + YAML shapes (`shapes.md`) |

Tests: `neome-studio/engine/test/template-bank-digest.test.mjs`, `template-bank-scrub.test.mjs`, `refine-template-bank.test.mjs`, synthetic fixture `fixtures/template-bank/acme-build.json` (made-up; regenerate with `make-fixture.mjs`).
