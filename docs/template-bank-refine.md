# How to refine the Template bank

Maintainer guide. The Template bank (`neome-studio/reference/template-bank/`) learns Patterns, Template modules and Templates from past Neome Builds. The refine tool builds it and keeps it up to date. Terms per [GLOSSARY.md](../GLOSSARY.md) § Template bank. Agent driver: [refine-template-bank.md](../neome-studio/maintainer/refine-template-bank.md). Script: [refine-template-bank.mjs](../neome-studio/maintainer/refine-template-bank.mjs) (its header lists every command).

Not a Consultant skill. `studio` never shows it. Same tool for the first run (empty Template bank) and every later refine.

## When to run

- New Neome Build JSON exported from Neome Studio.
- Updated export of a Build already in the Template bank.
- A Build should leave the Template bank (delete its JSON).

No time schedule. Run by hand.

## Before you start

- Claude Code in **T3 Code** (needs `delegate_task`). Claude-sales provider set up; default Claude is the fallback.
- `npm ci` done. On `main`, clean Template bank folder.
- Raw dir `.scratch/template-bank/raw/` (gitignored). Holds client data. Never commit from it, never paste from it.

## Steps

1. **Drop the JSON.** Put Neome Build JSON files in `.scratch/template-bank/raw/`. Same Build again = replace the old file (dedupe by `entId` + `version`; newest `versionCode` wins). Neome App JSON (Neomenta's own catalog Apps) goes in `raw/neome-template/` instead; see [Neome App Builds](#neome-app-builds).
2. **Start.** Tell Claude: `follow neome-studio/maintainer/refine-template-bank.md`.
3. **Fill the word lists** (first run per Build only). Claude stops with `words | NB-NN | <path> | seeded`. Open each `raw/scrub/NB-NN.txt`. Add one per line: client, company, people, place and brand names you see in that Build. Then a last line `# checked`. Tell Claude to go on. Claude never reads these lists.
4. **Wait.** Claude runs tag (one child per Build, parallel), cluster (one child), review (one fresh child). Takes minutes to an hour.
5. **Answer the asks.** Claude asks only on `split` / `merge` / `retire`, or when the reviewer is unsure. Answer apply or drop, with a short reason.
6. **Check the branch.** Claude commits on `template-bank-refine-<date>` and gives you a summary. Read `neome-studio/reference/template-bank/reports/<date>.md`. Skim new entries for real names (see below). `npm test` must pass.
7. **Merge** the branch to `main` yourself. Revert = git.

## Word lists: do them properly

The scrub removes only words in the list (plus Build name, `about` text, phones, emails). Anything you leave out can reach a model and the committed Template bank.

- Look for: client and company names, short codes (e.g. 3–4 letter company initials), people in role, option or user names, towns, plant or site names, brand names.
- Short words match inside longer words (a code like `ESL` also hits `Timeslot`). If a short code causes a false alarm, write the longer form instead, or tell Claude the line number from the `leak` output.
- Lists stay in the raw dir. Later runs reuse them; update when a Build changes.
- After the run: `node neome-studio/maintainer/refine-template-bank.mjs check` re-checks the Template bank against all lists any time.

## Neome App Builds

Neomenta's own JSON of a catalog Neome App (one Module). Becomes an App baseline (`apps/APP-<slug>.md`: what the App gives out of the box) and adds evidence to existing entries. Code `NA-<catalog slug>`.

- Drop the JSON in `raw/neome-template/`.
- Keep `raw/neome-template/app-slugs.txt`: one line per App, `<catalog slug> | <App name as in the JSON>`. Slug from `neome-studio/reference/neome-app-catalog-slugs.json`. A JSON whose name is not listed stops the run (`stop | unknown App name …`): add the line, go on.
- No word list (Neome-owned). Emails, phones and message bodies are still scrubbed.
- New App version = `updated`, re-tagged like a client Build.
- Apps with no JSON have no APP entry; skills use the catalog page.

## What you get

| Where | What |
|---|---|
| `reference/template-bank/patterns/PAT-*.md` | how a task is done in Neome; workaround yes/no |
| `reference/template-bank/template-modules/TMOD-*.md` | usual needs, steps, sheets, roles, Delivery hint |
| `reference/template-bank/templates/TPL-*.md` | business type → core / optional Template modules |
| `reference/template-bank/apps/APP-*.md` | App baseline: what a Neome App gives out of the box; linked from a Template module's `neomeApp` |
| `reference/template-bank/CHANGELOG.md` | one line per change; `replacedBy` for retired, split, merged, renamed IDs |
| `reference/template-bank/reports/<date>.md` | the run: each change + reason + who decided, tokens |
| `.scratch/template-bank/raw/runs/<date>/` | gitignored run files: tag sheets, changes, verdicts, `tokens.tsv` |

## Rules the tool keeps

- No model reads raw JSON or unscrubbed digests. Scrub fail = hard stop.
- Entries retire only when `seenIn` hits zero or you ask. Never for age.
- Updated Build keeps its NB code; its old `seenIn` rows are replaced.
- Never merges, never pushes.
- Re-cluster everything from all tag sheets: ask Claude for a `--full` run. Entries that would retire need your yes.

## Gate

Refine → `npm test` only. Changing the Template bank **format** (`reference/template-bank/README.md`, `engine/template-bank.mjs`) → also `node neome-studio/evals/run.mjs run --all`.

## Troubleshooting

| You see | Do |
|---|---|
| `words … not checked` | add `# checked` as the last line of that list |
| `leak | NB-NN | <file>:<line>` | a listed word survived; fix the list (false alarm from a short word: use a longer form) and re-run |
| child hits a rate limit | Claude moves to the next provider (Claude-sales → Claude → ZCode GLM) and tells you |
| every Build shows `updated` | the export changed `version`; fine, it re-tags those Builds |
| tokens marked `estimate` | the child did not report counts; size-based guess |

## First run (2026-11-03)

7 Builds → 113 entries (63 PAT, 45 TMOD, 5 TPL), 14 asks, 0 retired, ~580k in / 140k out tokens (mostly estimates). The word lists held made-up names, so real names were caught only by the child agents and a later scan. Next run: fill the lists with real names first.
