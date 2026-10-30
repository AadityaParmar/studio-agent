# 40 — Anonymised eval Inputs and golden docs

**What to build:** The Consultant supplies Anglo Gulf raw Inputs (CE-1..4, QA-1..6, SD, TL) and the PetroStar RFP, anonymised (client, people, phones), with golden docs anonymised to match, committed as eval fixtures. Spec: Further Notes.

**Blocked by:** None — can start immediately.

**Status:** resolved

- [x] Anglo Gulf Inputs anonymised and committed in the plugin's evals area (reconstructed, see Answer)
- [x] PetroStar RFP anonymised and committed (reconstructed, see Answer)
- [x] Golden Anglo Gulf BRD and PetroStar proposal anonymised consistently
- [x] No real names or phones remain (spot-checked; case folder names excepted)

## Answer

Real raw Inputs not available. Consultant chose (2026-10-29) to **reconstruct** them from the golden docs: Anglo Gulf Inputs rebuilt from the BRD's cited facts (4 files for CE, QA, SD, TL); PetroStar RFP rebuilt from the proposal's requirement column. Gaps left out so Open Items still test. Bias: recall reads high on anglo-gulf-crm. Swap in real Inputs when supplied (resets baseline). Name map: [eval-anonymisation.md](../research/eval-anonymisation.md). Cases: `neome-studio/evals/anglo-gulf-crm/`, `neome-studio/evals/petrostar-crm/`.
