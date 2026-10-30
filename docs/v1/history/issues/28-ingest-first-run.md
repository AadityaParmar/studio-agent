# 28 — `ingest` first run + shared git/lock protocol

**What to build:** A Consultant drops Inputs (any name) into a new Enterprise's `inputs/` (and `confidential/`) and runs `ingest`. It creates the Enterprise and Engagement, registers each Input as a Source, and drafts Modules, Requirements, Engagement-wide Requirements, Open Items and a seed Enterprise glossary — all cited or marked proposed. It pulls, takes the Engagement lock, commits and pushes. Output passes engine validation. Spec: stories 14–28, 136–140; Git and concurrency; Folder layout.

**Blocked by:** 22 — BRD data file build + validation

**Status:** resolved

- [x] Shared plugin reference for git protocol (pull at start, commit + push `<skill>: <ent>/<slug> <what>`, stop + explain on failure, never force-push) and Engagement lock (who, skill, since; pushed first, cleared at end)
- [x] Shared map-logic reference (frontier, claim, close)
- [x] First run creates Enterprise folders, Source register, Enterprise glossary; Engagement folders and map
- [x] Source IDs stable, unique across Enterprise; files renamed in place to `<SOURCE-ID>-<slug>.<ext>`; text copy kept for every Source incl. confidential
- [x] Confidential Source gets a register row pointing at `confidential/`; rows list Engagements
- [x] Modules drafted in Enterprise language with ID prefixes; Requirements, GEN Requirements, OIs drafted, each cited or proposed
- [x] Glossary seeded from Inputs only (never catalog terms), cited, proposed — via `enterprise-glossary` (pull before write, commit right after, no lock)
- [x] Gaps become Open Items, never assumptions
- [x] Manual run on a sample Input set → engine preview build passes

## Comments

- Done 2026-10-29. Engine helpers `neome-studio/engine/ingest.mjs` (wired in `cli.mjs`): `init-engagement <ent-dir> <slug> --name --title` (creates Enterprise `_agent/` GLOSSARY + Source register + `sources/`, `inputs/`, `confidential/`, Engagement `_agent/` map, process, open-items, general (7 topic H2s), `modules/`; never overwrites), `add-source <ent-dir> <file> --engagement --prefix --type --title [--slug] [--date] [--notes]` (next free `<PREFIX>-n` across register + files, rename in place to `<ID>-<slug>.<ext>`, register row, `confidential` note for `confidential/`, text copy for .md/.txt/.csv/.tsv else prints `(needed)` + header for the agent; re-run on a registered file adds the Engagement to its row), `lock` / `unlock` (`lock: <who> · <skill> · <UTC since>` under the map H1; refuses other holder; `unlock --force` for `studio`). `build-brd --check` (preview only): validate, write nothing, no mmdc. References: `neome-studio/reference/git-protocol.md`, `neome-studio/reference/map-logic.md`, `skills/ingest/references/draft-shapes.md`. Skills: `ingest/SKILL.md` (7 steps), `enterprise-glossary/SKILL.md` (entry shape + add terms + own pull/commit/push; dispute/split/rename/agree left for ticket 29). Schema docs: `--check`, extra ticket keys. Tests `engine/test/ingest.test.mjs` (14) + fixture `engine/test/fixtures/ingest/first-run/` (hand-run output). `npm test`: 170 pass, check 11 skills OK.
- Small choices (my call; revisit if wrong):
  - Draft Modules are real ticket folders with `status: open` + `draft: true` (and map Status `draft`); `review-draft` removes `draft` on confirm, and the frontier skips drafts. Lets the preview build show the draft, and lets review-draft re-runs find only new Modules.
  - Source ID prefix table (CE, RFP, DK, SS, WA, FRM, PF, WS, SD, QA, SO, IN) in draft-shapes; IDs always numbered (`SD-1`, not bare `SD`). `--date` only when the Input states its date; else empty.
  - Text copy at `_agent/sources/<ID>.md` = header (`# ID — title`, type/date/file) + verbatim text; images as `[image: …]`, unreadable parts → ask Consultant + map Note.
  - ingest validates with `build-brd --check` so it never writes views (`brd/preview.html` stays `build-brd`'s job).
  - Pull = `git pull --rebase --autostash`; push rejected → one pull+retry, then stop (abort rebase, keep local commit). Lock commit = `map.md` only (plus new folders on first run), pushed before drafting.
  - `ingest` drafts no process.md (review-draft) and no Neome mapping (neome-mapping). Draft Requirements: `Priority: TBC`, `Scope: Open` unless the Input says; agent acceptance marked proposed.
  - Later runs on an existing Engagement: only into `draft` tickets; changes to confirmed Modules → Open Item. Questionnaire replies refused (ticket 36). Glossary conflict → term returned to raise an OI (ticket 29 does dispute/split/rename).
- Not verified: a live `/neome-studio:ingest` Claude session (the "manual run" was me following the SKILL steps by hand on a made-up Input set: 2 Inputs + 1 confidential CSV → 3 Sources, ENQ + QUO draft, 2 GEN, 6 OIs, 5 terms; `--check` and full preview build both exit 0, 4 completeness warnings expected). Git pull/push/lock flow untested (repo has no git remote). PDF/docx text extraction left to the agent; untested.
