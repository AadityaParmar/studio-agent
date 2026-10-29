# Questionnaire shapes

What `questionnaire` reads, writes and sends. Paths from `enterprises/<ent>/engagements/<slug>/`. The engine writes the master, the `asked in` cells and both views; the skill writes only the register cells below.

## Register cells the skill fills

`_agent/open-items.md` (header: `ID | question | Module(s) | owner | ask to | suggested | status | asked in | answer Source`):

- **ask to**: the Enterprise role that knows (their words: `Accounts`, `Sales head`). From a Source, else the role the Module's spec says owns that work.
- **suggested**: an answer the Enterprise can say Yes to. From a Source (`15 days [CE-2]`) or the catalog reference (`… (proposed, to confirm)`). No defendable answer → leave empty; the item then asks openly (`Reply: Answer: ___ / Don't know`).
- **question**: one line. Reword only to make it plain to the Enterprise; keep its meaning.
- **asked in**: engine only.

## Item

Items = open Open Items with owner `Enterprise`; item ID = OI ID. The engine strips Source IDs, `(proposed, to confirm)` and markdown marks from what the Enterprise reads.

```
OI-07 · For: Finance · asked before (QN-2026-10-01)
<question, one line>
Suggested: <answer>
Reply: Yes / Edit: ___ / Don't know
```

`asked before (…)` = every earlier QN in the item's `asked in`. No suggested answer → no `Suggested:` line, `Reply: Answer: ___ / Don't know`.

Order: sections by Module, `All` first, then map order. In a section, Must first (Open Item on a live Must Requirement, Module or GEN), then register order. An item naming several Modules sits in `All` if it names `All`, else in its first Module in map order (of those selected).

## Master

`_agent/questionnaires/QN-<date>.md`; a second one the same day is `QN-<date>-2`. Never edited after it is written: a fix is a new Questionnaire.

```markdown
# Questionnaire QN-2026-10-29

To: Meera Shah (Sales head)
From: Asha, Neomenta
Enterprise: Harbor Tiles
Engagement: Sales CRM (crm)
Date: 2026-10-29
Modules: all
Items: 10

## All — Across all Modules

### OI-07 · For: Sales head
Any hosting, data residency or single sign-on needs?
Suggested: Neome cloud, no single sign-on
Reply: Yes / Edit: ___ / Don't know

## QUO — Quotations

### OI-10 · For: Sales head · asked before (QN-2026-10-01)
...
```

- One `To:` = one named contact. `Modules:` = `all` or the `--module` list.
- `ingest` (reply loop) matches a reply to items by OI ID through this file (`ENGINE reply items`); the reply's Source notes name the QN; a Yes accepts the `Suggested:` text written here. See [reply-loop.md](../../ingest/references/reply-loop.md).

## Views

`questionnaires/QN-<date>.html` (Neome look, prints to A4, no script) and `questionnaires/QN-<date>.txt` (WhatsApp / email: numbered items, no tables). Built from the master only; rebuild any time with `ENGINE export-questionnaire <eng> <QN>`.
