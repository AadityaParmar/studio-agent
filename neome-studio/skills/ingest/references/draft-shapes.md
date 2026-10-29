# Draft shapes

What `ingest` writes, so `build-brd` reads it. Full grammar: [brd-data-schema.md](../../build-brd/references/brd-data-schema.md) ("Where each field comes from"). Paths from `enterprises/<ent>/`.

## Provenance (every line, row, block)

- Fact from an Input: cite inline `[CE-1]` or `[CE-1, RFP-1]`.
- Agent's idea, not in any Input: `(proposed, to confirm)`. Never both missing.
- Unknown: write nothing as fact; raise an Open Item and point at it.

## Source ID prefixes

`ENGINE add-source --prefix`. Pick by what the Input is:

| Prefix | Input |
|---|---|
| CE | call notes, meeting notes, transcript, Enterprise email |
| RFP | RFP, tender, requirements list from the Enterprise |
| DK | deck, brochure, company profile |
| SS | spreadsheet, data export, price list |
| WA | WhatsApp / chat export |
| FRM | sample form, report, screenshot of a current tool |
| PF | Prototype feedback |
| WS | live session log (written by `grill-module`) |
| SD | Enterprise decision record |
| QA | Questionnaire reply (notes `reply to QN-…`; [reply-loop.md](reply-loop.md)) |
| SO | Sign-off evidence |
| IN | anything else |

`--type` = plain words (`call notes`, `RFP`, `deck`). `--title` = what it is, in a few words. `--date` only when the Input states its own date.

## Text copy `_agent/sources/<ID>.md`

The engine writes it for `.md .txt .csv .tsv`. For other files it prints `(needed)` and a header; write the header, then the Input's full text, verbatim, in reading order. Tables → markdown tables. Images / charts → `[image: <what it shows>]`. Text you cannot read → `[unreadable: <where>]` and an Open Item (owner Neomenta, ask Consultant for a readable copy). No summary, no cleanup.

## Module ticket `engagements/<slug>/_agent/modules/<PREFIX>-<slug>/ticket.md`

Prefix: 2–5 capitals from the Enterprise's own word (`QUO` for Quotes), unique, never `GEN`. Folder slug: kebab-case Module name.

```markdown
---
status: open
prefix: QUO
name: Quotes
draft: true
blockedBy: []
---

# QUO — Quotes

Name: Quotes

## 1 Purpose and KPIs

- Purpose: Send priced offers for tiles to Leads. [CE-1]

## 11 Requirements

### QUO-01 — Discount approval

Statement: A discount over the limit needs the sales head's approval. [CE-1]
Acceptance:
- A Quote with a discount over the limit cannot be sent until the sales head approves. (proposed, to confirm)
Priority: TBC
Scope: Open
Sources: CE-1
OIs: OI-02
Proposed: yes

## 13 Open Items

- OI-02: What discount needs approval?
```

- Write only sections the Inputs feed (any of the 13 spec headings, same names and table columns as the spec). Others stay out; `write-module-spec` fills them.
- Requirement IDs `<PREFIX>-01` up, never reused. `Priority:` = `TBC` unless the Input states it. `Scope:` = `Open` unless the Input states who delivers it. Acceptance drafted by the agent = `(proposed, to confirm)`.
- No `## 12 Neome mapping` here (that is `neome-mapping`'s job).

## Engagement map `_agent/map.md`

Add one row per Module to `## Modules`: `| QUO | Quotes | draft |`, in the order the Enterprise's process runs. `## Notes`: one bullet per thing the Consultant should know (scope hints, Inputs not readable). Change log line: `- YYYY-MM-DD: ingest: <n> Sources, <n> Modules drafted.`

## Engagement-wide Requirements `_agent/general.md`

Topic H2s exist already. Under a topic: H3 blocks `### GEN-01 — Title` (same lines as a Module Requirement) and/or `- OI-NN: gist` bullets (OI Module(s) = `All`). Write `N/A: <reason> [Source]` only when an Input says the topic does not apply. Leave a topic empty when the Inputs say nothing; `review-draft` asks it.

## Open Items `_agent/open-items.md`

One row each, IDs `OI-01` up across the Engagement:

`| OI-03 | Which discount needs the sales head to approve? | QUO | Enterprise | Sales head | Over 10% (proposed, to confirm) | open | | |`

- owner `Enterprise` (they must answer) or `Neomenta` (we must find out). Module(s) = prefixes, or `All`.
- ask to = role or name when the Input says who knows; else empty. suggested = only a proposal you can defend; else empty.
- Every OI is named where it bites: a Requirement's `OIs:` line, the ticket's `## 13 Open Items`, or a `general.md` topic.

## Process `_agent/process.md`

Leave as created. `review-draft` sketches the skeleton.
