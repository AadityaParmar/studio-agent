# v1 Build: Neome Requirements Studio

What tickets 21–45 built, where it lives, key build-time calls, and what is not verified. Design reasons: [decisions.md](decisions.md). Full notes per ticket: [issues/](history/issues/).

## How to talk

- Simple English. No fancy words. Short.
- Be extremely concise. Sacrifice grammar for concision.

---

## Architecture

- **Skills think and write markdown** under `_agent/`. **Engine** (`node neome-studio/engine/cli.mjs`) parses, validates, renders, and does deterministic edits (claim, lock, module moves, reply rules, glossary actions).
- Engine never writes views from skills' hand; views come only from engine render.
- `ENGINE` in skills = `node neome-studio/engine/cli.mjs`.

## Ticket → what was built

| # | Built | Main files |
|---|---|---|
| 21 | Repo + plugin scaffold, `check` lint, CI | `.claude/settings.json`, `.claude-plugin/marketplace.json`, `neome-studio/.claude-plugin/plugin.json`, `engine/check.mjs`, `reference/how-to-talk.md`, `.github/workflows/` |
| 22 | BRD data file build + 2-layer validation | `engine/build-brd.mjs`, `engine/brd/read-engagement.mjs`, `engine/brd/validate.mjs`, `engine/markdown.mjs`, `skills/build-brd/references/brd-data.schema.json` |
| 23 | BRD preview HTML (screen app + A4 print) | `engine/brd/render-html.mjs`, `page.css`, `page.js`, `reference/fonts/` |
| 24 | Mermaid → SVG diagrams, pinned mmdc | `engine/brd/diagrams.mjs` |
| 25 | Across all Modules (`general.md`) + Implementation plan (`plan.md`) | `read-engagement.mjs`, `validate.mjs`, `render-html.mjs` |
| 26 | Release mode + change log | `engine/brd/changelog.mjs` |
| 27 | Sign-off mode | `engine/brd/signoff.mjs` |
| 28 | `ingest` first run, git + lock protocol | `skills/ingest/`, `engine/ingest.mjs`, `reference/git-protocol.md`, `reference/map-logic.md` |
| 29 | `enterprise-glossary` lifecycle | `skills/enterprise-glossary/`, `engine/glossary.mjs` |
| 30 | `review-draft` | `skills/review-draft/`, `engine/modules.mjs` |
| 31 | `grill-module` + question bank | `skills/grill-module/` |
| 32 | `write-module-spec` + `neome-mapping` + done check | `skills/write-module-spec/`, `skills/neome-mapping/`, `engine/spec-check.mjs` |
| 33 | Module Prototype | `skills/build-prototype/`, `engine/build-prototype.mjs`, `engine/prototype/` |
| 34 | `resolve-module` orchestrator | `skills/resolve-module/`, `modules.mjs` (frontier, claim, release, revisit) |
| 35 | `questionnaire` | `skills/questionnaire/`, `engine/questionnaire.mjs`, `engine/questionnaire/` |
| 36 | `ingest` reply loop | `skills/ingest/references/reply-loop.md`, `engine/reply.mjs` |
| 37 | `build-brd` skill | `skills/build-brd/SKILL.md`, `references/problems.md` |
| 38 | `studio` router + setup check | `skills/studio/`, `engine/status.mjs`, `engine/setup-check.mjs` |
| 39 | READMEs | `README.md` (Consultant), `neome-studio/README.md` (maintainer), `neome-studio/HOW-TO-RUN.md` |
| 40 | Anonymised eval Inputs + golden | `neome-studio/evals/anglo-gulf-crm/` |
| 41 | Eval runner + scorecard + `tiny-synthetic` | `neome-studio/evals/run.mjs`, `evals/lib/`, `evals/prompts/`, `evals/tiny-synthetic/` |
| 42 | `anglo-gulf-crm` eval + baseline | `evals/results/2026-10-30-anglo-gulf-crm.md` (`petrostar-crm` dropped) |
| 43 | `upstream-check` | `neome-studio/maintainer/upstream-check.mjs` + `.md` |
| 45 | Next-step handoff | `engine/status.mjs` (`step` 4 cells), `reference/next-session.md` |

Paths under `neome-studio/` unless rooted.

## Engine CLI (main commands)

| Command | Use |
|---|---|
| `check <plugin>` | pack lint |
| `setup-check` | studio setup lines |
| `status [<eng>] --who` | state + `step` lines |
| `init-engagement`, `add-source` | ingest |
| `module list/confirm/rename/merge/new/move/frontier/claim/release/close/revisit` | Module lifecycle |
| `lock` / `unlock [--force]` | Engagement lock |
| `spec-check <eng> <P>` | spec done check |
| `build-prototype <eng> <P>` | Prototype |
| `new-questionnaire`, `export-questionnaire` | Questionnaire |
| `reply items/close/note/new-oi/confirm` | reply loop |
| `glossary agree/dispute/settle/split/rename` | glossary |
| `build-brd <eng> [--check] [--mode preview\|release\|sign-off]` | BRD |
| `mmdc-check` | Mermaid CLI pin check |

Exact flags: header of each `engine/*.mjs`.

## Build-time calls (my call during build, keep unless reason)

- Preview data: `version: null`, `status: working-draft`.
- Draft Modules = real ticket folders `status: open` + `draft: true`; frontier skips drafts.
- Source ID prefixes: CE, RFP, DK, SS, WA, FRM, PF, WS, SD, QA, SO, IN. Always numbered.
- Missing priority/scope = schema error (write `TBC` / `Open`). Uncited non-proposed fact = error always.
- Renamed Module keeps old Req IDs (prefix = `formerly`). Second rename refused.
- Split = new Modules + move + merge old into main part.
- Plan phase IDs fixed: `masters`, `workflow`, `uat`, `go-live`.
- Release: `--summary` required; never overwrites existing `v<N>`; module change kind `added` exists.
- Sign-off signs latest released version only; preconditions read from snapshot, not markdown.
- After sign-off, engine clears `proposed` in data only; markdown marks stay.
- Engine writes Questionnaire master (deterministic selection/order); agent only fills `ask to`, `suggested`, wording.
- Reply rules depend on Module status (draft/open → write in place; resolved → Yes edits spec, Edit → revisit).
- Pull = `git pull --rebase --autostash`; push rejected → one retry then stop.
- Linux CI: puppeteer `--no-sandbox`.

## Tests and evals state at v1

- `npm test` = engine tests (`engine/test/*.test.mjs`, fixtures in `engine/test/fixtures/`) + live `check`. 355/355 at v1 (2026-10-30).
- Eval `anglo-gulf-crm` baseline 2026-10-30: Req recall 96.4%, OIs 92.9%, Module set 81.8%, all hard gates pass except 1 "Don't know without OI" (accepted by maintainer, spot-checked).
- `tiny-synthetic` covers mechanics (questionnaire loop, glossary conflict, GEN, release + sign-off, claim/lock).

## Not verified at v1 (known risks)

- Safari / Firefox print (footer needs Chrome 131+ `@page` margin boxes).
- Windows (`mmdc.cmd` path).
- Large real processes: diagram legibility at A4; wide kanban for big Modules.
- `npm test` flake: `mmdc-failed` under parallel load (puppeteer launch). Mitigated with `--test-concurrency=2`; build-brd skill retries once.
- OI IDs inside SVG not clickable.
- WhatsApp TXT paste on real phone; PDF/photo replies (text extraction left to agent).
- Real Neome approval screens (Prototype guess).
- Rollout step pending: one real Engagement shadowed by maintainer (`history/260-brand-trial/` = trial run).
