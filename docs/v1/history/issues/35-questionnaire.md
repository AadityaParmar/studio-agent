# 35 — `questionnaire`

**What to build:** The Consultant runs `questionnaire` to export open Enterprise-owned Open Items (all, or narrowed by Module) as one questionnaire addressed to a named contact, as printable HTML and WhatsApp/email text. Spec: Questionnaire, stories 78–84.

**Blocked by:** 28 — `ingest` first run + shared git/lock protocol

**Status:** resolved

- [x] Master markdown `QN-<date>` in agent folder; engine `export-questionnaire` → HTML (Neome look, A4, no JS) + TXT (numbered, no tables)
- [x] Items: owner Enterprise, open only; item ID = OI ID; shape `OI-07 · For: <role>` / question / Suggested / `Reply: Yes / Edit: ___ / Don't know`
- [x] Sections by Module, `All` first, Must first; one named contact in header
- [x] Re-asked items marked "asked before (QN-…)"
- [x] Warning over ~25 items suggesting split by Module
- [x] OI register updated: suggested, ask to, asked in
- [x] Pull, commit, push; engine tests for HTML + TXT shape

## Comments

- Done 2026-10-29. Engine `neome-studio/engine/questionnaire.mjs` (wired in `cli.mjs`): `new-questionnaire <eng> --to "<name>" [--role] [--from] [--module "QUO, All"] [--check]` (select open Enterprise-owned OIs, order, write master `_agent/questionnaires/QN-<date>[-n].md`, append QN to `asked in`, map change-log line; `--check` = list + warnings, writes nothing) and `export-questionnaire <eng> <QN>` (master only → `questionnaires/QN-….html` + `.txt`; views overwritten, master never). Renderer `engine/questionnaire/render.mjs` + `qn.css` (Neome product tokens from Prototype, Roboto/system font, no script, `@page` A4 + footer `QN-… · page n / N`, cards don't split). Skill `skills/questionnaire/SKILL.md` (5 steps: the send, check list, fill gaps, build, report+end; upstream pin to-questionnaire @ 1.3.1 kept, idea "grill the send, not the subject" adapted, `skills-main/` untouched) + `references/questionnaire-shapes.md` (register cells, item, order, master, views). Docs: `brd-data-schema.md` open-items row notes `asked in`; eyeball checklist "Questionnaire look" in `evals/README.md`. Hand-run fixture `engine/test/fixtures/questionnaire/after-questionnaire/` (after-resolve + OI-05 suggested filled + QN-2026-10-29 to Meera Shah, 10 items; views not stored). Tests `engine/test/questionnaire.test.mjs` (13). `npm test`: 287 pass, check 11 skills OK.
- Small choices (my call; revisit if wrong):
  - Engine, not agent, writes the master (selection + order deterministic). Agent's only writes: `ask to` / `suggested` / plain rewording of `question` in `open-items.md` before the build (that is the "register updated: suggested, ask to" part); engine writes `asked in`.
  - Must = OI listed on a live Must Requirement (Module or GEN). Must not shown to the contact (spec item shape has no Must tag); only order.
  - Multi-Module OI: `All` section if it names `All`, else first of its (selected) Modules in map order. `--module` narrows by any named Module; `All` must be named to be included when narrowing.
  - Empty suggested → no `Suggested:` line, `Reply: Answer: ___ / Don't know` (a Yes makes no sense). No `ask to` → no `For:` part + warning; skill must fill it.
  - Contact sees plain text: Source IDs, `(proposed, to confirm)`, markdown marks stripped (master too, so master = exactly what was sent).
  - Same-day second QN = `QN-<date>-2` (schema pattern already allows a suffix). Re-asked = every earlier QN in `asked in`, shown `asked before (QN-a, QN-b)`.
  - Over 25 = `warning [size]` with per-Module counts; still writes (soft cap); skill shows it at `--check` and lets the Consultant split.
  - Engagement must pass parse + schema + cross-ref (like build-prototype), else exit 1. No Engagement lock (spec lock list excludes questionnaire); pull/commit/push per git-protocol; views committed with the master.
  - HTML header label "About" (Enterprise · Engagement), not "For", so it doesn't clash with item `For:`. TXT uses WhatsApp `*bold*` for title and section heads.
- Verified headless Chrome (puppeteer from mermaid-cli): no console errors, no network requests, no script; PDF 3 A4 pages for 10 items, footer shows, no card split; re-asked chip renders. Not verified: live `/neome-studio:questionnaire` Claude session (simulated: followed steps 2–4 by hand on after-resolve → the fixture), git pull/commit/push (no remote), WhatsApp paste rendering on a phone, Safari/Firefox print (`@page` margin boxes need Chrome 131+).
- Handoffs:
  - 36 (`ingest` reply loop): match replies by OI ID through `_agent/questionnaires/<QN>.md` (shape in `questionnaire-shapes.md`; `readMaster` exported from `engine/questionnaire.mjs`); QA-n Source notes name the QN; reply numbers in the TXT are positions, OI IDs are the key. A Yes accepts the master's plain suggested text; write the register answer/fact citing QA-n. Yes to the Engagement OI (OI-12 style) flips the listed Requirements per ticket 31/32 notes.
  - 38 (`studio`): open Enterprise OIs with empty `asked in` → suggest `/neome-studio:questionnaire`; `new-questionnaire --check --to x` lists them read-only.
  - 39 (READMEs): "Where things live": `questionnaires/` view (HTML to print, TXT to paste); reply goes into `inputs/` then `ingest`.
  - 41/42 (evals, tiny-synthetic questionnaire loop): fixture `questionnaire/after-questionnaire` is a ready start state.

