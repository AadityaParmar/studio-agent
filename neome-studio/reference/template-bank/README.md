# Template bank

Patterns, Template modules and Templates learnt from past Neome Builds. Agent-facing. Terms per `GLOSSARY.md` § Template bank. Spec: Template bank effort `spec.md` (`.scratch/template-bank/`, later `docs/v2/history/`).

Readers: ingest, review-draft, grill-module, neome-mapping. Writer: maintainer refine tool only. Never hand-edit entries outside that tool. Checked by `engine/template-bank.mjs` (`checkBank`, run in `npm test` via `cli.mjs check`).

## Files

- One Markdown file per entry, file name = ID: `patterns/PAT-<slug>.md`, `template-modules/TMOD-<slug>.md`, `templates/TPL-<slug>.md`.
- Slug: lowercase words joined by `-`, starts with a letter. No sequence numbers.
- YAML front matter (scripts read it) + Markdown body (models read it). No other front matter keys.
- `CHANGELOG.md`: one line per applied change; `replacedBy` for split / merge / rename. Shape at its top.
- IDs never reused: an ID retired or replaced in `CHANGELOG.md` must not come back as a file.

## Front matter, all kinds

- `id`: same as file name.
- `kind`: `pattern` | `template-module` | `template` (must match folder).
- `name`: text.
- `seenIn`: non-empty list of `{build: NB-NN, area: <Build area>}`. Build code only, never a client name. `area: "*"` = whole Build. No threshold; readers weigh the count.

## Pattern

Front matter: + `workaround: true | false`.

Body sections (`## `, this order): `Task`, `How` (Neome parts), `Workaround` (yes/no + why), `Limits`, `Flowchart`.

## Template module

Front matter: + `aliases` (list, may be empty), `patterns` (list of `PAT-` IDs, may be empty), `neomeApp` (slug in `reference/neome-app-catalog-slugs.json`, or `none`), `delivery` (`Standard` | `Configuration` | `Custom module`).

Body sections: `Usual needs`, `Process steps`, `Usual sheets, key fields, roles`, `Neome App / Delivery hint`, `Flowchart`.

## Template

Front matter: + `businessType` (text), `modules: {core: [TMOD-…], optional: [TMOD-…]}` (core non-empty; optional may be empty or left out).

Body sections: `Modules`, `Links between modules`, `Flowchart`.

## Flowchart

Every `## Flowchart` section holds a fenced ```` ```mermaid ```` block.

## Checks (`npm test`)

Errors: front matter shape, body sections, file name = ID, prefix matches folder, unique IDs, `PAT-` / `TMOD-` references resolve, `neomeApp` slug, `seenIn` rows, `CHANGELOG.md` lines, retired ID still on file, any scrub word (case-insensitive) in an entry or `CHANGELOG.md`. Scrub words: `*.txt` in `NEOME_SCRUB_DIR`, else gitignored `.scratch/template-bank/raw/scrub/` when present.

Warning: `replacedBy` target not in Template bank and not replaced later.

"ID gone" (`checkTemplateRef`): a `template:` / `templateModule:` ID not in Template bank = warning, never error; suggests live IDs found by following `replacedBy`.
