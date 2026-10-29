# Grill shapes

What `grill-module` shows and writes. Full grammar: [brd-data-schema.md](../../build-brd/references/brd-data-schema.md) ("Where each field comes from"). Provenance as in [draft-shapes.md](../../ingest/references/draft-shapes.md): cite `[ID]` or write `(proposed, to confirm)`; unknown → Open Item. Paths from `enterprises/<ent>/engagements/<slug>/` unless they start with `enterprises/`.

## Round item

Same shape as a Questionnaire item, so an unanswered item becomes an Open Item and exports unchanged:

```
3 · For: Sales head
Above what discount must you approve a quotation?
Suggested: Above 10% (proposed, to confirm)
Reply: Yes / Edit / Don't know
```

- Number = item in this round. Once it becomes an Open Item, the ID is the OI ID.
- `For:` = the role that knows (Enterprise's words).
- One question, one line. Suggested = from a Source (`15 days [CE-2]`), from the catalog (`… (proposed, to confirm)`), or empty if you cannot defend one.
- A pre-answer from Inputs that needs no question is shown as a statement, not an item: `Quotation valid 15 days [CE-2].`

## Session log Source (WS-n)

Write while the session runs, one bullet per answer, then register it at Write:

`enterprises/<ent>/inputs/grill-module-session-<prefix>.md` (prefix lowercase)

```markdown
grill-module session, <ent>/<slug>, Module <PREFIX>, <YYYY-MM-DD>. <Live call | Consultant relaying>. Present: Meera (sales head), Joel (accounts), Harbor Tiles; Asha (Neomenta, Consultant).
Only what the Enterprise said. Consultant's own views are proposals + Open Items, not recorded here.

- Approvals — Meera (sales head): Discounts above 8% need my approval.
- Volumes — Asha (Neomenta), relaying Joel (accounts), phone call 27 Oct: about 120 quotations a month.
```

- Speaker = name (role), as said. Relayed = who relays, who said it, where and when.
- Words close to what was said; no summary of several speakers in one bullet.

```
ENGINE add-source enterprises/<ent> enterprises/<ent>/inputs/grill-module-session-<prefix>.md --engagement <slug> --prefix WS --type "session log" --title "grill-module session <PREFIX>" --date <today>
```

The engine renames it `WS-n-grill-module-session-<prefix>.md` and writes the text copy. Facts from it cite `[WS-n]`.

## Where answers land

Into `modules/<PREFIX>-<slug>/spec.md` if it exists (revisit: edit touched sections in place), else `ticket.md`. Section headings, columns and Requirement lines exactly as the spec template (13 H2 sections, `## 1 Purpose and KPIs` … `## 13 Open Items`), in number order. Never write `## 12 Neome mapping` (`neome-mapping` does).

| Topic | Section | Shape |
|---|---|---|
| 1 Purpose and pain | 1 Purpose and KPIs | `- Purpose: …`, `- KPI: …`, pain bullets go to 3 |
| 2 Roles | 2 Roles | table role \| does what \| headcount \| Source |
| 3 Process | 3 Process | AS-IS / pain bullets. TO-BE steps → hand back (caller writes `process.md`) |
| 4 Records and data | 4 Records and data | table entity \| field \| type \| required \| notes \| Source; `Values: A / B / C`, `Links to: X` |
| 5 Statuses | 5 Statuses | states table id \| start/end \| open (OI) \| Source; transitions table from \| to \| trigger \| Source |
| 6 Rules | 6 Rules and notifications | table rule \| when \| action/notify whom \| Source |
| 7 Exceptions | 7 Exceptions | bullets |
| 8 Reports | 8 Reports | table name \| audience \| measures/filters \| Source |
| 9 Integrations | 9 Integrations | table system \| direction \| data \| owner \| Source |
| 10 Volumes and NFRs | 10 Volumes and NFRs | bullets |
| 11 Priority and Scope tag | 11 Requirements | H3 blocks; see Bulk confirm |
| any open | 13 Open Items | `- OI-NN: gist` |

Each topic ends in one of three states:

- **Answered**: rows / bullets, each citing a Source or `(proposed, to confirm)`.
- **N/A**: `N/A: <reason> [Source]`. The reason must come from a Source (the Enterprise said it does not apply).
- **Open**: `- OI-NN: <gist>` as the section body (alone, or under the answered part), plus the bullet in `## 13 Open Items`. An `OI-NN:` bullet counts as filled and is never read as a fact.

## Open Items `open-items.md`

- New: next free `OI-NN`, row as in draft-shapes. owner `Enterprise` unless Neomenta must find out. ask to = the item's `For:` role. suggested = the item's suggested answer.
- Consultant's own view: the fact is written `(proposed, to confirm)` and an OI asks the Enterprise to confirm it (suggested = the view).
- Clash: question quotes both sides and their Sources: `Is a quotation valid 15 days (CE-2, Joel) or 30 days for contractors (WS-2, Meera)?`
- Answered live: `status` `closed`, `answer Source` `WS-n`. Keep its references.
- Name every new OI where it bites: a Requirement's `OIs:` line and `## 13 Open Items`.

## Bulk confirm (topic 11)

Draft every live Requirement of the Module (new ones `<PREFIX>-NN`, next free number, never reused): statement, acceptance bullets, `Priority:` Must / Should / Could / Won't, `Scope:`. Show one table:

```
| ID | title | priority | scope | acceptance (short) |
|---|---|---|---|---|
| QUO-02 | Discount approval | Must | Neome | Over 8% cannot be sent until the sales head approves |
```

Reply "yes to all" or edits by ID. Then per Requirement:

- **Confirmed by the Enterprise** (said or relayed): `(proposed, to confirm)` removed from statement and acceptance; Sources gain `WS-n` (cite it inline too); `Proposed: no`. A statement that has no Source of its own now cites `[WS-n]`.
- **Not confirmed** (no answer, "don't know", from-Inputs mode, Consultant's view): keep proposed, `Proposed: yes`, add the Engagement OI to `OIs:`.

One Engagement Open Item holds every unconfirmed Requirement of the Engagement:

`| OI-12 | Confirm the proposed priority, Scope tag and acceptance criteria of: QUO-04, QUO-06, QUO-07 | All | Enterprise | Sales head | As proposed in the BRD (proposed, to confirm) | open | | |`

Exists and open (another Module made it) → append this Module's IDs to its question. None → create it. Remove IDs confirmed now.
