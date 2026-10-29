# Eval case: tiny-synthetic

Fast smoke of flow mechanics the real golden docs do not cover (ticket 18). Made up, hand-written: Marlin Marine Services, a boat engine workshop with a parts counter, Engagement `service-crm`. Two Modules (workshop service jobs, parts orders), 20 Requirements incl. 5 Engagement-wide, 7 Open Items.

Run: `node neome-studio/evals/run.mjs run tiny-synthetic` (see [../README.md](../README.md)).

## Files

| File | Holds |
|---|---|
| `inputs/workshop-call-notes.md` | Call notes with the Owner and Workshop Manager (dated, no Source ID: ingest assigns it) |
| `inputs/parts-counter-whatsapp.txt` | WhatsApp export, Owner and Sales Lead |
| `answer-key.md` | Every fact the simulated client may give (K-NN), Consultant choices, how Leena replies, sign-off signers |
| `golden.json` | Expected Modules, Requirements, Open Items, mapping, glossary (BRD data shape where possible) + `mechanics` checks |
| `replay.yaml` | The 16 replay steps and the client brief for each |

## What it covers

| Mechanic | Where in the replay | Checked by |
|---|---|---|
| Glossary conflict raises an Open Item (ticket 17) | "job" = a boat's workshop visit (call notes) vs a parts order (WhatsApp); ingest | mechanic `glossary-conflict`, golden OI-01 |
| Engagement-wide Requirements (ticket 19) | access + migration + localisation in the Inputs; training, support from the key in review-draft; hosting left unknown | mechanic `gen`, golden GEN-01..05, OI-06 |
| Claim / lock (ticket 15) | Ben (clone b) claims the first frontier Module and takes the lock, then vanishes; Asha's `resolve-module` is refused; `studio` clears the stale lock and claim after asking | mechanics `claim-held`, `stale-lock-cleared`, `stale-claim-released` |
| Questionnaire send → QA reply → ingest (ticket 11) | `questionnaire` to Leena; Leena's reply covers Yes, Edit, Don't know, skip and a new question; `ingest` reply loop; revisit | mechanics `questionnaire-sent`, `reply-closes-oi`, `reply-dont-know`, `reply-new-question`, `needs-revisit` |
| Release + Sign-off + change log (ticket 12) | release v1 before the Questionnaire, v2 after the reply (change log closes Open Items), signed copy ingested as Sign-off evidence, v2 signed | mechanics `v1-released`, `v2-change-log`, `v2-signed`, `all-resolved` |

## Left out of the key on purpose

These must end as Open Items, never as facts: Tally stock link (Leena skips it), hosting / data residency / single sign-on, job volumes beyond K-07, anything about boat owners seeing status online (her new question). A replay that states any of them as a fact fails the invented-facts gate or the Don't know gate.

## Changing this case

Golden, key and Inputs move together: a fact in golden needs an Input or a key fact in its `sources`; `run.mjs check tiny-synthetic` checks the links and shapes. A change here resets the regression baseline: say so in the results commit.
