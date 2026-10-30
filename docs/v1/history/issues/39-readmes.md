# 39 — Consultant README + plugin README

**What to build:** A Consultant can set up and do a first run with real Inputs without help, and fix common problems. The maintainer has a plugin README with building blocks and origins. Spec: Packaging and repo, stories 5–7; README-draft.md is the start.

**Blocked by:** 36 — `ingest` reply loop; 37 — `build-brd` skill; 38 — `studio` router

**Status:** resolved

- [x] Consultant README order: what it is · Setup checklist · First run · The cycle at a glance · Skills you run (6) · Where things live · Rules of thumb · Troubleshooting
- [x] Troubleshooting: Mermaid CLI missing, push rejected, stale lock
- [x] Plugin updates via repo pull explained
- [x] Plugin README: building blocks table, origins table (skill → upstream name, no version), eyeball checklist, maintainer tools

## Comments

- Done 2026-10-29. Consultant README `README.md` (repo root), from README-draft.md trimmed: what it is (3 lines + GLOSSARY link + pointer to plugin README) · Setup checklist (Claude Code, Node LTS 20+, git + `git config --global user.name`, GitHub access, clone, `npm ci`, open repo root, trust, `/neome-studio:studio` with its 5 checks) + "Updates" (plugin loads in place from the repo; skills pull at start; new skill text next session or `/reload-plugins`; `npm ci` again if studio says `node_modules` out of date) · First run (ticket 15 walkthrough, real Inputs, no demo) · The cycle at a glance (`studio` between every step) · Skills you run (the 6; ingest reply flow per 36, build-brd modes per 37) · Where things live (facade tree, views per 33/35/37) · Rules of thumb · Troubleshooting (Mermaid CLI / node_modules → `npm ci`, `mmdc-failed` → run again, push rejected incl. claim (map-logic Claim step 4), stale lock per 38, skills not in slash menu, "start a new session", Prototype gap). Plugin README `neome-studio/README.md` (maintainer doc): layout · building blocks table (Called by from the SKILL texts) · origins table (skill → upstream name, no version; pins only in front-matter) · changing a skill · engine command table (every `cli.mjs` command + who calls it; read-only ones named) · maintainer tools (`npm test` + CI, `upstream-check` per 43, eval runner not built (41–42), eyeball checklist) · Eyeball checklist (pointer + 3 summaries) · Gate. New test `neome-studio/engine/test/readmes.test.mjs` (5): Consultant section order; only the 6 user skills named, one `###` each, no building block named; setup / Troubleshooting / Where things live cover the agreed cases; plugin building blocks = skills without `disable-model-invocation`; origins rows = all 11 skills, match front-matter `upstream` last segment, `new` when no pin, `diverged` said, no versions; engine table = exactly the `cli.mjs` commands; maintainer tools + eyeball sections present (and in `evals/README.md`); links and backticked repo paths resolve in both. `npm test`: 335 pass, check 11 skills OK.
- Small choices (my call; revisit if wrong):
  - "Updates" sits as a `###` under Setup checklist, so the 8-section order stays exact.
  - Eyeball checklist lives in `evals/README.md` (tickets 23–35 extend it there); plugin README points at it with a 3-line summary instead of copying it, so the two never drift.
  - Clone line uses `<team-repo-url>` (no remote exists yet). Fill in when the GitHub repo exists.
  - Consultant README tells Consultants to allow `node neome-studio/engine/cli.mjs …` when Claude Code asks: `.claude/settings.json` allows only `npx mmdc` and git (ticket 15), so every engine call prompts. Not changed (permission choice for the human); see gap below.
  - Engine table lists callers from the SKILL / reference texts; read-only = `setup-check`, `status`, `mmdc-check`, `spec-check`, `check`, any `build-brd --check` (checked: those modules write nothing).
  - README-draft.md left as is (history); the READMEs supersede it.
- Gaps found in code (not built here):
  - Engine calls are not in `.claude/settings.json` allow list → a permission prompt per call. Adding `Bash(node neome-studio/engine/cli.mjs:*)` would stop that; human call.
  - `claude plugin validate` (passes) suggests a `/plugin install` line in the plugin README. Not added: install = clone (ticket 15).
- Verified: every command, path, skill name and engine command named in both READMEs against the code (test enforces most); plugin loads in place from a local-directory marketplace and picks up edits at next session or `/reload-plugins` (Claude Code docs, plugins/loading); `claude plugin validate` passes for `neome-studio` and the repo marketplace. Not verified: a fresh Consultant following the README end to end (trust prompt, slash menu, first `ingest`) in a live Claude Code session; clone / push / pull lines (repo is not a git repo, no remote); Windows.
- Handoffs:
  - 41 (eval runner): when built, update plugin README "Maintainer tools" row "Eval runner" (now "Not built yet (tickets 41–42)") with its one-line command, and the Gate; `readmes.test.mjs` checks the row exists. Eval cases live only in `neome-studio/evals/`; never under `enterprises/` (Consultant README promises no demo Enterprise).
  - 42 (anglo-gulf / petrostar): if evals add an eyeball section to `evals/README.md`, add its one-line summary under plugin README "Eyeball checklist" (test checks the three current ones).

