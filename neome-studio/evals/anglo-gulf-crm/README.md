# Eval case: anglo-gulf-crm

Full flow on a real-world CRM Engagement: ingest → review-draft → resolve-module per Module → release v1 → Questionnaire send. Golden: 56 Requirements (51 in 11 Modules + 5 Engagement-wide), 28 Open Items, all left open (the golden BRD is a draft for review).

Run: `node neome-studio/evals/run.mjs run anglo-gulf-crm` (see [../README.md](../README.md)).

## Reconstructed Inputs (read first)

The real raw Inputs (expectations deck CE-1..4, clarifications QA-1..6, scope decisions SD, estimate TL) were not available (ticket 40). The Inputs here are **rebuilt from the golden BRD**: each fact the BRD cites is written back into the Input it cited, in plain business words, with no IDs, MoSCoW or acceptance criteria. Gaps the BRD raised as Open Items are left out, or left ambiguous where the BRD says the Inputs conflicted (lead statuses, stages, CIS). Some noise added (repeated lines, a sample figure, a call answer with no facts).

Effect: recall runs higher than on real Inputs, because the Inputs were shaped by the answer. Open Items caught is the more honest metric here. Swap in the real Inputs when they arrive; that resets the regression baseline.

Anonymised: the client is renamed Crescent Gulf Chemicals everywhere (Inputs, key, golden). The BRD named no people; the key's Rania Haddad is made up. Product, molecule and country names are generic and kept. Name map: `.scratch/neome-requirements-studio/research/eval-anonymisation.md` (not shipped).

## Files

| File | Holds | Golden BRD Source it replaces |
|---|---|---|
| `inputs/crm-expectations-deck.txt` | Expectations deck, 4 slides | CE-1..4 |
| `inputs/crm-solution-clarifications.md` | Call Q&A, 6 questions | QA-1..6 |
| `inputs/neomenta-scope-decisions.md` | Neomenta scope decisions | SD |
| `inputs/implementation-estimate.txt` | 4-week estimate | TL |
| `answer-key.md` | Little beyond the Inputs, on purpose; Consultant choices | |
| `golden.json` | Modules, Requirements, Open Items (no mapping: the BRD had none) + mechanics | |
| `replay.yaml` | 6 steps | |

## Golden vs the BRD

- BRD sections map to Modules one to one, except: section 09 (MI-01, CMP-01, REG-01) is one Module `MKT` (MKT-01..03); MOB-01 joins `COM` as COM-04.
- Section 12 moves to Engagement-wide (ticket 19): ACC-01 → GEN-01 access, IMP-06 → GEN-02 migration, IMP-04 → GEN-03 training, IMP-07 → GEN-04 support, IMP-05 → GEN-05 other.
- IMP-01..03 (week 1–3 work) are dropped: in this design they are Implementation plan phases (ticket 16), not Requirements. Hence 56, not 59.
- Priorities are the BRD's proposed MoSCoW (OI-28: none confirmed).
- `mapping` is n/a: the BRD has scope tags, not Neome App + Delivery.

## Changing this case

Golden, key and Inputs move together; `run.mjs check anglo-gulf-crm` checks links and shapes. A change resets the regression baseline: say so in the results commit.
