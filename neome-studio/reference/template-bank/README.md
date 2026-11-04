# Template bank

Patterns, Template modules, Templates and App baselines learnt from past Neome Builds and Neome App Builds. Agent-facing. Terms per `GLOSSARY.md` § Template bank. Spec: Template bank effort `spec.md` (`docs/v2/history/`).

Readers: ingest, review-draft, grill-module, neome-mapping. Writer: maintainer refine tool only. Never hand-edit entries outside that tool. Checked by `engine/template-bank.mjs` (`checkBank`, run in `npm test` via `cli.mjs check`).

## Files

- One Markdown file per entry, file name = ID: `patterns/PAT-<slug>.md`, `template-modules/TMOD-<slug>.md`, `templates/TPL-<slug>.md`, `apps/APP-<catalog slug>.md`.
- Slug: lowercase words joined by `-`, starts with a letter. No sequence numbers.
- YAML front matter (scripts read it) + Markdown body (models read it). No other front matter keys.
- `CHANGELOG.md`: one line per applied change; `replacedBy` for split / merge / rename. Shape at its top.
- IDs never reused: an ID retired or replaced in `CHANGELOG.md` must not come back as a file.

## Front matter, all kinds

- `id`: same as file name.
- `kind`: `pattern` | `template-module` | `template` | `app` (must match folder).
- `name`: text.
- `seenIn`: non-empty list of `{build: <Build code>, area: <Build area>}`. Build code only, never a client name: `NB-NN` = client Neome Build, `NA-<catalog slug>` = Neome App Build (slug in `reference/neome-app-catalog-slugs.json`). `area: "*"` = whole Build. No threshold; readers weigh the count.

## Pattern

Front matter: + `workaround: true | false`.

Body sections (`## `, this order): `Task`, `How` (Neome parts), `Workaround` (yes/no + why), `Limits`, `Flowchart`.

## Template module

Front matter: + `aliases` (list, may be empty), `patterns` (list of `PAT-` IDs, may be empty), `neomeApp` (slug in `reference/neome-app-catalog-slugs.json`, or `none`), `delivery` (`standard` | `configuration` | `custom`, same enum as BRD data `delivery`).

Body sections: `Usual needs`, `Process steps`, `Usual sheets, key fields, roles`, `Neome App / Delivery hint`, `Flowchart`.

## Template

Front matter: + `businessType` (text), `modules: {core: [TMOD-…], optional: [TMOD-…]}` (core non-empty; optional may be empty or left out).

Body sections: `Modules`, `Links between modules`, `Flowchart`.

## App baseline

What one Neome App gives out of the box, learnt from its Neome App Build (`NA-<slug>`). ID = `APP-<catalog slug>`; slug must be in `reference/neome-app-catalog-slugs.json`. Front matter: only the keys above (`id`, `kind: app`, `name`, `seenIn`); `seenIn` rows name only its own `NA-<slug>`.

Body sections: `Gives` (what the App does out of the box, one line each), `Sheets, key fields, roles`, `Workflows` (steps), `Flowchart`.

Link: a Template module with `neomeApp: <slug>` links to `APP-<slug>` when that file exists. No other field links them. Apps with no Neome App Build have no APP entry; readers use the catalog page then.

Wins: APP entry wins on what the App has (catalog page = fallback). Template bank Template module wins on usual Delivery. Mismatch shown as both, never silently picked.

## Flowchart

Every `## Flowchart` section holds a fenced ```` ```mermaid ```` block.

## Execute

Optional, any kind. When present, `## Execute` is the last body section (after `## Flowchart`). Steps to build the entry in a live Enterprise via `neome-studio` MCP (`add` / `set` / `validate` calls, in create order). How to write it: `EXECUTE.md` (MCP build guide, learnt from `docs/studio-ai-docs/`).

- First body line must be exactly: `Only use this to apply this into a Studio Enterprise via MCP.` Nothing else on that line.
- Only MCP apply work reads it. Ingest, review-draft, grill-module, neome-mapping ignore it.
- Writes hit the live draft: confirm with user before the first `add` / `set` / `remove` (root `CLAUDE.md`).
- Nothing buildable: keep the section with the guard line + one line why, no steps. Contract: `EXECUTE.md`.
- Refine drafts keep `## Execute` of an existing entry; update steps when `How` / sheets / workflows change.

## Checks (`npm test`)

Errors: front matter shape, body sections, `## Execute` when present (last section, first body line = guard exactly), file name = ID, prefix matches folder, unique IDs, `PAT-` / `TMOD-` references resolve, `neomeApp` slug, APP slug in catalog, `seenIn` rows (`NA-` slug in catalog; APP rows = own `NA-<slug>` only), `CHANGELOG.md` lines, retired ID still on file, any scrub word (case-insensitive) in an entry or `CHANGELOG.md`. Scrub words: `*.txt` in `NEOME_SCRUB_DIR`, else gitignored `.scratch/template-bank/raw/scrub/` when present.

Warnings: `replacedBy` target not in Template bank and not replaced later; APP entry no Template module links to (`neomeApp`).

"ID gone" (`checkTemplateRef`): a `template:` / `templateModule:` ID not in Template bank = warning, never error; suggests live IDs found by following `replacedBy`.

`reports/<run>.md`: refine run report (each change + reason + who decided), committed by the refine tool. Not read by skills.
