# Eval case: petrostar-crm

Neome mapping on a real-world RFP: ingest → review-draft → resolve-module per Module. Scores **Module set and mapping only** (`golden.json` `score`): does each Module land on the right Delivery class (standard / configuration / custom)? Golden: 17 Modules from the RFP's Section 5 with the Neome App and Delivery from Neomenta's proposal; one Requirement per Module and 7 Engagement-wide ones for the judge, not scored.

Run: `node neome-studio/evals/run.mjs run petrostar-crm` (see [../README.md](../README.md)).

## Reconstructed Input (read first)

The real RFP was not available (ticket 40). `inputs/rfp-crm-system-implementation.md` is **rebuilt from Neomenta's proposal**: its "Your requirement" column, the process it restates from RFP Section 4, and the asks behind Sections 6–10. Neome's answers (Apps, Delivery, hosting, certifications, timeline) are left out, so the skill must map on its own. Mapping is scored against the proposal, so the bias of rebuilding is small here.

Anonymised: client renamed Falcon Ridge Trading, contact Daniel Sousa (made up), country and operator names dropped ("oil and gas operators in the Gulf"). Name map: `.scratch/neome-requirements-studio/research/eval-anonymisation.md` (not shipped).

## Files

| File | Holds |
|---|---|
| `inputs/rfp-crm-system-implementation.md` | The RFP, Sections 1–11 |
| `answer-key.md` | Business facts the RFP states; Consultant choices |
| `golden.json` | 17 Modules with mapping, `score: [modules, mapping]` |
| `replay.yaml` | 4 steps |

## Golden mapping

From the proposal's fit table. "Standard" → standard, "Configuration" → configuration, "Custom module" → custom. Neome base Apps without a catalog slug take the nearest one (Inquiry → `product-catalog`, Dashboards / Conversational AI → `crm`, Order Flow → `quotation-and-order-flow`); only Delivery is scored. Custom: APRV (product approval), COMM (commission orders), DOC (post-order documents).

## Changing this case

Golden, key and Input move together; `run.mjs check petrostar-crm` checks links and shapes. A change resets the regression baseline: say so in the results commit.
