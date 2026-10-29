# 32 — `write-module-spec` + `neome-mapping` + spec done check

**What to build:** From grilling output, the agent writes a Module spec with 13 fixed sections and Requirement blocks, and `neome-mapping` fills section 12 with an indicative Neome App + Delivery. A done check blocks weak specs. The spec parses cleanly into the BRD data file. Spec: Module spec, stories 53–58.

**Blocked by:** 22 — BRD data file build + validation; 31 — `grill-module` + question bank

**Status:** resolved

- [x] Spec template + filled example shipped; 13 H2 sections fixed order, unused = `N/A: <reason>`
- [x] Requirement block: ID, title, statement, acceptance, priority, scope tag, Sources, OIs, proposed flag, optional Delivery override
- [x] IDs `<PREFIX>-NN`, never reused; withdrawn kept with reason
- [x] Every fact cites a Source inline or is `(proposed, to confirm)`
- [x] Catalog reference (from research ticket 01, incl. Delivery heuristics) + machine-readable slug list shipped
- [x] Mapping: one Delivery per Module; "no App fits" = no App + Custom module; indicative
- [x] Done check: 13 headings, each filled/N/A/OI, every Requirement complete, no uncited facts
- [x] Written spec → engine build passes with no completeness errors when resolved

## Comments

- Done 2026-10-29. Skills `neome-studio/skills/write-module-spec/SKILL.md` (7 steps: scope, read, write spec.md, OIs, call neome-mapping, done check, hand back; upstream pin to-spec @ 1.3.1 kept, idea "synthesis, no interview" adapted, `skills-main/` untouched) + `references/spec-template.md` (rules, template, Requirement block, section 13 rule, done-check checklist) + `references/spec-example.md`; `skills/neome-mapping/SKILL.md` (5 steps: read catalog, App, Delivery, write, hand back). Engine `neome-studio/engine/spec-check.mjs` (`ENGINE spec-check <eng> <PREFIX>`, wired in `cli.mjs`): read-only done check, exit 0/1/2, new error class `spec`. Schema docs `brd-data-schema.md`: spec header lines, `spec` class, "Spec done check" section. `grill-module/SKILL.md` step 2: other Modules' hand-offs read from `spec.md`, else `ticket.md`. Fixture `engine/test/fixtures/write-module-spec/after-spec/` (grill fixture + QUO `spec.md` written + mapped by hand, ticket body cut to a pointer). Tests `engine/test/write-module-spec.test.mjs` (34). `npm test`: 238 pass, check 11 skills OK.
- Catalog reference + slug list: already shipped by tickets 22/31 (`reference/neome-app-catalog.md` incl. section 4 Delivery heuristics, `reference/neome-app-catalog-slugs.json`); reviewed, unchanged; tests now assert both.
- Small choices (my call; revisit if wrong):
  - Filled example = made-up Harbor Tiles QUO (byte-identical to the fixture spec, test enforces), not Anglo Gulf Quotation as ticket 07 said: Anglo Gulf Inputs are not anonymised yet (ticket 40). Swap later if wanted.
  - `neome-mapping` writes section 12 **and** the per-Requirement `Delivery:` override lines in section 11 (the only section-11 lines it touches). Module Delivery = grade of the Module as a whole; override only where a Requirement differs; equal override = done-check error.
  - `write-module-spec` calls `neome-mapping` itself, then runs the done check (spec table: "write-module-spec (+ neome-mapping)"). It never sets ticket `status`; `resolve-module` closes.
  - Header `Status:` = ticket status, written but not read by the engine and not compared (ticket front-matter is the truth). `Sources:` header must list every cited Source.
  - Done check = `build-brd --check` rules + this Module's completeness as if resolved + spec-only rules: header lines; exactly 13 `## <n> <title>` in order, no other H2; N/A needs a reason; sections 11–12 never N/A; live Requirement needs Statement, Acceptance bullet(s), Priority, Scope, Sources (IDs or `(proposed, to confirm)`), `Proposed: yes|no` (`no` refused when block has a proposed mark); Withdrawn needs a reason; section 12 exactly one Neome App / Delivery / How line; section 13 = every open OI naming the Module or on a live Requirement's `OIs:` (incl. `All` Engagement OI), no closed ones; "never reused / withdrawn kept" = every Requirement ID this Module (or its `formerly` prefix) had in live `brd-data.json` or any `versions/v<N>.json` must still exist. Any error elsewhere in the Engagement also fails it (build must pass). TBC priority / Open scope allowed (Sign-off blocks those).
  - After `spec.md` exists the ticket body is cut to H1 + `Name:` + `Spec: [spec.md](spec.md).` (no two copies; engine already reads spec.md first).
  - Mapping writes no Source citation (catalog is not a Source); `How:` ends `(proposed, to confirm)`; mapping is always `indicative: true`.
- Not verified: live Claude session of either skill (simulated: I followed write-module-spec + neome-mapping steps by hand on the grill fixture → the after-spec fixture; `spec-check` exit 0, `build-brd` with QUO resolved exit 0, no QUO warnings). Revisit pass, Custom module path in a real Engagement, and the "sweep 2–10 for sign-off items" step not exercised (QUO had none missing). Older fixtures (`brd/resolved`) lack the new header lines, so `spec-check` would fail on them; build unaffected.
- Handoffs:
  - 34 (`resolve-module`): call `write-module-spec` after `grill-module` (it runs `neome-mapping` and `spec-check`); close only after `spec-check` exit 0; when closing, update spec header `Status:` too; Module Delivery Custom module → add it to `plan.md` Not yet placed (`(proposed, to confirm)`); commit `spec.md`, `ticket.md`, `open-items.md`, `GLOSSARY.md` from the hand-back. Rename/merge after Prototype still needs Prototype view rename/removal (ticket 30 note).
  - 33 (`build-prototype`): read mapping (App + Delivery + overrides) from `spec.md` section 12 / the data file; sample spec `skills/write-module-spec/references/spec-example.md` and fixture `after-spec` are a ready input.
  - 36 (`ingest` reply loop): flipping Requirements to `Proposed: no` must also drop their `(proposed, to confirm)` marks, else `spec-check` refuses.
  - 42 (PetroStar eval, mapping only): `neome-mapping` grades per Requirement then picks one Module Delivery; scorecard "mapping Delivery class" compares the Module Delivery.
