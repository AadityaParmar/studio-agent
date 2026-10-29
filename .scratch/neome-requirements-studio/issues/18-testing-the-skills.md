# 18: Testing the skills

Type: grilling
Status: resolved
Blocked by: 16, 17, 19

## Question

How are the skills evaluated before rollout? Candidate: replay Anglo Gulf and PetroStar Inputs through the pack and compare the drafted BRD against the real documents. Decide: test cases, what counts as a pass (Requirement recall, Open Items caught, no uncited facts, schema valid), who judges, and when tests run (before each skill change?).

## Constraints from earlier tickets

- From ticket 08: JSON Schema + cross-reference check already gives a hard validity test.
- Reference docs: `sources/examples/` (Anglo Gulf BRD, PetroStar proposal).

## Answer

Grilled with the Consultant: fixture source and test answerer asked; the rest are recommended defaults, accepted.

**Two layers.**

1. **Checks** (cheap, deterministic, AFK). Run on every push touching `neome-studio/` or a fixture, via GitHub Action in the shared repo; also runnable locally (`npm test`).
   - Every skill has the "How to talk" block verbatim and valid front-matter.
   - Fixture `brd-data.json` files pass JSON Schema + cross-reference check (ticket 08), strict mode for resolved Modules.
   - `build-brd` render step on a fixture data file: produces HTML, `mmdc` SVGs, no JS (ticket 06); print CSS present.
   - Trace checks: every fact object has `sources` (none empty unless `proposed: true`); every Requirement ID appears in its Module's `prototype-data.json` trace (ticket 10); every OI referenced exists in `open-items.md`.
   - Release-mode rules (ticket 12/16/19): sign-off blocked with unresolved Module or uncovered GEN topic; plan gaps warn.
2. **Evals** (golden replay, token-costly, AFK run + human verdict). Run before merging any change to a skill's text into `main` (ticket 15: `main` = what Consultants pull), and on demand.

**Eval cases** live in `neome-studio/evals/<case>/`: `inputs/` (raw Inputs, anonymised), `answer-key.md` (facts the simulated client may give, built from golden doc + QA answers), `golden.json` (expected Requirements, OIs, Modules, mapping, in BRD-data-file shape where possible), `README.md` (what it covers).
- **anglo-gulf-crm** (primary): full flow ingest → review-draft → resolve-module ×N → build-brd. Golden = Anglo Gulf BRD (59 Reqs, 28 OIs).
- **petrostar-crm**: tests `neome-mapping` only — golden = PetroStar fit-gap (Standard / Configuration / Custom per Module).
- **tiny-synthetic** (1–2 Modules, hand-written): fast smoke of flow mechanics the golden docs don't cover: questionnaire send → QA reply → ingest closes OI / sets needs-revisit (ticket 11), glossary conflict raises OI (17), GEN Requirements (19), release + sign-off + change log (12), claim/lock (15).

**Simulated client.** A subagent plays Enterprise (and Consultant on review choices). Answers only from `answer-key.md`; anything else → "don't know". A "don't know" must end as an Open Item, never an assumed fact.

**Scorecard** (LLM judge matches by meaning, writes `evals/results/<date>-<case>.md` with per-item match table):
| Metric | Pass |
|---|---|
| Schema + cross-ref valid | hard, 100% |
| Uncited non-proposed facts | hard, 0 |
| Invented facts (cited but not in the Source; judge checks every Requirement's Source) | hard, 0 |
| Requirement recall vs golden | ≥ 80% |
| Open Items caught (golden OIs covered by an OI or a correctly answered Req) | ≥ 70% |
| Module set (golden Modules matched, merge/split allowed) | ≥ 80% |
| Mapping (PetroStar: Delivery class matches) | ≥ 70% |
| Extra Requirements not in golden | listed, not failed; judge tags each plausible / noise |
| Regression | no metric drops > 5 pts vs last result on `main` |

Thresholds are starting values; first runs calibrate them (maintainer may adjust in `evals/README.md`, with reason).

**Who judges.** LLM judge produces the scorecard; the plugin maintainer (lead Consultant) reads it, spot-checks ~10 matches, and approves the merge. Prototype quality and BRD look: not auto-scored; maintainer opens the outputs against a short eyeball checklist in `evals/README.md` (tabs work, Neome look, prints to A4).

**Rollout.** After evals pass: one real Engagement shadowed by the maintainer before the team uses the pack.

**Prerequisite for build (not a decision, so no ticket):** the Consultant supplies Anglo Gulf raw Inputs (CRM Expectations deck CE-1..4, QA-1..6, SD, TL) and the PetroStar RFP; they are anonymised (client, people, phones; e.g. "Gulf Distributor A") and committed as fixtures. Golden docs anonymised to match.

**Changes to earlier tickets:**
- **15:** repo root gains `.github/workflows/checks.yml`; `package.json` gains `test` script. Ticket 15 left demo Enterprises to this ticket: none in `enterprises/`; eval cases live only under `neome-studio/evals/`, run in a temp copy, never committed as Enterprises.
- **02:** maintainer-only `eval` runner (script + driver prompt in `neome-studio/evals/`), not a Consultant skill, not shown by `studio`.
