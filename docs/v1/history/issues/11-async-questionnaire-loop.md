# 11: Async questionnaire loop

Type: grilling
Status: resolved
Blocked by: 03

## Question

How do open questions reach the Enterprise and come back? Settle:
- the export format: markdown, HTML form, or something WhatsApp-friendly
- grouping, and who it is addressed to
- how answers are ingested as a new Source and close the Open Items they affect

## Constraints from earlier tickets

- From ticket 03: the questionnaire text follows the How to talk rule: "Simple English. No fancy words. Short. Be extremely concise. Sacrifice grammar for concision." Paths: `engagements/<slug>/questionnaires/QN-<date>.<ext>`, and answers come back as a new Input in `enterprises/<ent>/inputs/`.
- From ticket 04: questions are written as items with a suggested answer, so the Enterprise mostly says yes or edits. The same items export unchanged from a live grilling round to a questionnaire. Engagement-wide questions (Module = `All`) come from `review-draft`.

## Answer

**One master, two exports, matched by OI ID.** The `questionnaire` skill builds `QN-<date>.md` (master) → `QN-<date>.html` (Neome look, prints to A4, no JS) + `QN-<date>.txt` (WhatsApp/email: numbered, short, no tables). No interactive form in v1. Exact folder placement depends on ticket 13 (facade layout).

Decisions:
- **Items = Open Items only.** These are open OIs with owner = Enterprise, and the item ID = OI-NN. No other question types.
- **`open-items.md` gains columns:** `suggested` (may be empty), `ask to` (optional role, e.g. Finance), `asked in` (list of QN files). Schema change to ticket 08 `openItems[]`: `suggested?`, `askTo?`, `askedIn[]`. These are additive, so no major bump.
- **One file per send**, addressed to one named Enterprise contact in the header. Sections by Module, `All` first, Must-priority OIs first within each section. Each item shows "For: <role>" so the contact can forward it.
- **Selection:** by default, every open Enterprise-owned OI. The Consultant can narrow it by Module. Re-asked OIs are marked "asked before (QN-…)". Soft cap ~25 items; over that, the skill suggests splitting by Module.
- **Item shape:**
  ```
  OI-07 · For: Finance
  <question, one line>
  Suggested: <answer>
  Reply: Yes / Edit: ___ / Don't know
  ```
- **Text** follows the How to talk rule.
- **Return:** the reply comes back in any form and is saved as a new Source `QA-n` in `inputs/`, with the QN file in its notes. `ingest` proposes a match list (OI → reading of the reply). The Consultant confirms it before anything is written. Then:
  - Yes → close the OI (answer Source = QA-n), patch the spec fact: `proposed` → false, add QA-n to its Sources. No revisit.
  - Edit or new info → close the OI with the answer. The Module goes `needs-revisit`, `Revisit reason: OI-07 changed by QA-3`.
  - Don't know, unclear, or no answer → the OI stays open, and a note is added.
  - A new question in the reply → a new OI.
- **Glossary:** added **Questionnaire**.
