# 31 — `grill-module` + question bank

**What to build:** For one Module, grilling (live or from Inputs) covers all 11 topics, pre-answers from Inputs with citations, offers catalog defaults as proposed, always asks the key facts, and ends only when every topic is answered, N/A with reason, or an Open Item. Spec: Question bank, stories 41–52.

**Blocked by:** 28 — `ingest` first run + shared git/lock protocol

**Status:** resolved

- [x] Question bank: 11 topics, each with aim, 2–4 sample questions, pre-fill sources, target spec section; App hints read live from catalog reference
- [x] Pre-answer tiers: Inputs (cite) · catalog (proposed, to confirm) · always asked (goals/KPIs, roles/headcount, approval thresholds/approvers, final statuses, volumes, system of record, integration ownership, priority)
- [x] Rounds of ≤5 items, each with suggested answer, same shape as a Questionnaire item
- [x] Live session logged as WS-n Source with speaker names; Consultant opinion → proposed + OI
- [x] Challenges answers against Inputs; conflicts surface
- [x] Acceptance criteria + MoSCoW drafted, confirmed in one bulk step; unconfirmed → one Engagement OI
- [x] New Enterprise terms added via `enterprise-glossary`
- [x] Does not touch git (parent does)

## Comments

- Done 2026-10-29. Skill `neome-studio/skills/grill-module/SKILL.md` (6 steps: scope, read + pre-answer tiers, rounds, bulk confirm, write + `build-brd --check`, hand back) + `references/question-bank.md` (11 topics: Aim, Ask 2–4, Pre-fill, Always ask, Feeds) + `references/grill-shapes.md` (round item = Questionnaire item shape, WS session log, where answers land, OI rows, bulk confirm + Engagement OI). Upstream pins kept as in stub (grilling, domain-modeling, grill-with-docs @ 1.3.1); text adapted from upstream grilling (rounds, recommended answer worded so "yes" accepts, facts found not asked), `skills-main/` untouched. Catalog reference shipped early: `neome-studio/reference/neome-app-catalog.md` = research `neome-app-catalog.md` verbatim except line 3 (link to issues replaced). Engine: `brd/read-engagement.mjs` now skips `- OI-NN: gist` bullets in bullet sections (Purpose/KPIs, Process, Exceptions, Volumes) so an open topic counts as filled and is not an uncited fact (table sections already did); documented in `brd-data-schema.md`. Tests `engine/test/grill-module.test.mjs` (10) + hand-run fixture `engine/test/fixtures/grill-module/after-grill/` (review-draft fixture, QUO claimed by Asha, grilled live: WS-2 with Meera/Joel, OI-01/04 closed, OI-09 open exception, OI-10 Consultant's view, OI-11 clash CE-2 vs WS-2, OI-12 Engagement OI for QUO-04/06/07, term "Revised quotation"). `npm test`: 204 pass, check 11 skills OK.
- Small choices (my call; revisit if wrong):
  - Grill output goes into the Module's `spec.md` if it exists (revisit), else `ticket.md`, in spec section shapes (sections 1–11, 13; never 12). `write-module-spec` then completes the spec from it. No separate notes file (layout has none).
  - Always-ask facts: an Enterprise statement in an Input counts (cite it); never settled by catalog or Consultant view; live mode still confirms it. From-Inputs mode: rest → OIs; bulk confirm confirms nothing.
  - Bulk confirm: agent drafts MoSCoW (never `TBC`) + Scope + acceptance for every live Requirement. Confirmed → `Proposed: no`, cites WS-n, `(proposed, to confirm)` removed. Unconfirmed → `Proposed: yes` + one Engagement OI (Module(s) `All`, question `Confirm the proposed priority, Scope tag and acceptance criteria of: <IDs>`), reused/appended by later Modules, IDs removed once confirmed.
  - Live answers closing an existing OI: `status closed`, `answer Source` WS-n (no answer column added). Closed OIs dropped from section 13, kept on Requirement `OIs:` lines.
  - Session log: `inputs/grill-module-session-<prefix>.md`, written as the session runs, registered at Write via `add-source --prefix WS` (ticket 30 pattern). Speaker = `Name (role)`; relayed = who relays, who said, where/when.
  - grill-module writes no `process.md` and no `general.md`: TO-BE steps and asks no Module owns are handed back to `resolve-module` (ticket 34 checkboxes; GEN needs the Engagement lock).
  - Guard: refuses unless ticket `status: claimed` + `claimedBy` = `git config user.name` (since it runs no git, the claim must come first).
- Not verified: live Claude session (simulated by following the steps by hand on the review-draft fixture, result = the fixture; `build-brd --check` exit 0, only spec.md/mapping warnings). From-Inputs mode and revisit pass not simulated. Fixture QUO is `blockedBy: [ENQ]` with ENQ still open (frontier would not offer it; irrelevant to grill output). Concurrent edits of the shared Engagement OI row by two Consultants may conflict on rebase; untested.
- Handoffs: 32 — catalog reference already shipped at `reference/neome-app-catalog.md` (tick that box after review; trim if wanted); `write-module-spec` reads grill output from `ticket.md` (or `spec.md`) in the same section shapes; spec done check should accept `- OI-NN:` bullets as a filled section. 34 — call grill-module after the claim with mode + `revisitReason`; write the handed-back TO-BE into `process.md` and GEN asks under the lock; commit the files in the hand-back list (WS input, its text copy, `sources.md`, Module file, `open-items.md`). 35 — the Engagement OI and grill OIs export as normal items. 36 — a Yes to the Engagement OI should flip the listed Requirements to `Proposed: no` citing QA-n.
