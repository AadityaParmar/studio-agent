# Reply loop

What `ingest` does with a Questionnaire reply (a `QA-n` Source). Paths from `enterprises/<ent>/engagements/<slug>/`. `<eng>` = that folder. Item and master shapes: [questionnaire-shapes.md](../../questionnaire/references/questionnaire-shapes.md). Provenance: [draft-shapes.md](draft-shapes.md). Every `ENGINE reply …` call needs `--source QA-n`; it refuses a Source whose register notes name no `QN-…`.

## 1. Match list

```
ENGINE reply items <eng> --source QA-n
```

Read-only. One line per sent item: `item | <n> | <OI> | <Module(s)> | open | yes: <where> | edit: <where> | suggested: <text>`. `<n>` = the item number the contact saw in the TXT / HTML; the OI ID is the key. Read the reply's text copy whole and give every item one reading:

- **Yes**: accepts the suggested answer as sent.
- **Edit**: anything else they state for the item: a changed answer, the answer to an item with no suggested answer, a Yes with a condition.
- **Don't know**: they say they do not know.
- **No answer**: the item is not in the reply.
- **Unclear**: you cannot tell which item, or the answer contradicts itself → put the question to the Consultant in the table.

Then the reply text tied to no item, one extra row each:

- **New question** they ask → new Open Item.
- **New info** on a Module or topic → handled like an Edit where it lands (no Open Item to close).
- **Term** whose meaning they confirm, as the Enterprise glossary has it → agree it. A different meaning → new Open Item + dispute.
- An item the engine marks `already answered` → new info.

Show the Consultant one table, items in order, extra rows last:

```
| # | OI | they said (short, their words) | read as | action |
|---|---|---|---|---|
| 7 | OI-10 | "Yes" | Yes | close; QUO spec in place, no revisit |
| 9 | OI-09 | "sales head can reopen a lost quotation within 30 days" | Edit | close; QUO revisit |
| – | new | "can the PDF show our GST number?" | New question | OI, QUO, owner Neomenta |
```

`action` = the engine's `yes:` / `edit:` text for that reading, `note` for Don't know / No answer.

Write nothing to the record until the Consultant confirms the table; apply their fixes to it first. Done when the Consultant has confirmed every row.

## 2. Apply

Per confirmed row: the register command first, then the answer where it lands.

### Yes

`ENGINE reply close <eng> OI-NN --source QA-n --yes` (answer = the master's suggested text). The proposed fact becomes agreed: write the answer as a fact citing `[QA-n]` where the Open Item bit, dropping `(proposed, to confirm)` from what the answer confirms.

- Module `draft` / `open`: in its ticket (`spec.md` if it has one).
- Module `resolved` / `needs-revisit`: `spec.md` in place. Status unchanged; no revisit. Add `QA-n` to the spec header `Sources:`.
- `All`: see [`All` Open Items](#all-open-items).
- Engagement OI (`Confirm the proposed priority, Scope tag and acceptance criteria of: …`): `ENGINE reply confirm <eng> <IDs> --source QA-n`. It drops every mark in those Requirements, cites `QA-n`, sets `Proposed: no`.

### Edit and new info

`ENGINE reply close <eng> OI-NN --source QA-n --answer "<their answer, plain, one line>"` (new info: no close). Then by landing:

- Module `draft` / `open`: write it where the Open Item bit, citing `[QA-n]`, same as a Yes. No status change.
- Module `resolved` / `needs-revisit`: leave its files. `ENGINE module revisit <eng> <PREFIX> --reason "OI-NN answered: <gist> [QA-n]"` (new info: `<gist> [QA-n]`). `resolve-module` writes it on the revisit.
- `All`: see [`All` Open Items](#all-open-items).
- Engagement OI: `reply confirm` the IDs they accept as proposed; each other ID by its Module as above, reason `<ID>: <what they changed> [QA-n]`.

### Don't know and no answer

`ENGINE reply note <eng> OI-NN --source QA-n --note "Don't know"` (or `"no answer"`). The Open Item stays open; the next Questionnaire re-asks it as `asked before`. They name who knows → add it to the note (`"Don't know; ask Joel (accounts)"`) and set the row's `ask to` to that role.

### New question

`ENGINE reply new-oi <eng> --source QA-n --question "<one line>" --modules "<PREFIX>|All" --owner Enterprise|Neomenta [--ask-to "<role>"] [--suggested "<text>"]`. Owner `Neomenta` when they ask us. Name it where it bites: a Requirement's `OIs:` line + a `## 13 Open Items` bullet, or a `general.md` topic bullet.

### `All` Open Items

Replies to `All` Open Items land in Engagement-wide Requirements, Yes and Edit alike (no ticket, so no revisit). The topic is the one the engine names (`general.md <Topic>`); not named → the topic the question is about.

- Open Item on a GEN Requirement's `OIs:` line → fold the answer into that Requirement's statement or acceptance, cite `[QA-n]`, add `QA-n` to `Sources:`.
- Topic bullet `- OI-NN: …` → replace it with the next free `GEN-NN` block (draft-shapes shape: statement citing `[QA-n]`, acceptance `(proposed, to confirm)`, `Priority: TBC` unless they said, `Scope:`, `Sources: QA-n`, `OIs: OI-NN`, `Proposed: yes`), or with `N/A: <their reason> [QA-n]` when they say the topic does not apply.

### Claimed Module: hold

Its files belong to the Consultant who claimed it. Run only the register command (`close` / `note` / `new-oi`); the engine leaves its files and prints `hold:`. `reply confirm` refuses its Requirements. Add a map `## Notes` bullet: `- QA-n answers OI-NN (<PREFIX>, claimed by <who>): <answer>. Apply in the open resolve-module session.`

### What `reply close` prints

It drops the Open Item from every `## 13 Open Items` (an emptied one says `N/A: no open Open Items.`) and every `prototype-data.json` `"oi"`, except a claimed Module's. Then:

- `named: keep | …`: a Requirement's `OIs:` line. Closed Open Items stay there.
- `named: rewrite | …`: a section bullet, table `OI` cell or text naming it. Yes, `All`, or `draft` / `open` Module → write the answer there (bullet → the fact; `OI` cell → empty). Resolved Module Edit → leave it for the revisit.
- `named: drop | …`: only for a held Module or JSON the engine could not edit; leave held ones, fix the JSON by hand.
- `rebuild: …` → `ENGINE build-prototype <eng> <PREFIX>`.
- `glossary: …` → the closed Open Item was a term dispute: enterprise-glossary Settle, `--source QA-n`.

### Glossary

Term confirmed (a Yes to its Open Item, or they state its meaning as written) → enterprise-glossary Agree: `ENGINE glossary agree enterprises/<ent> --term "<T>" --source QA-n`.

Done when every row of the table is applied.

## 3. Check

`ENGINE build-brd <eng> --check` exits 0, and `ENGINE spec-check <eng> <PREFIX>` exits 0 for every `resolved` Module whose `spec.md` you edited. Then `ENGINE reply items <eng> --source QA-n`: every Yes / Edit item shows `closed by QA-n`; every Don't know / no answer item shows `open`. Done when all three hold.

Map change-log line: `- <date>: ingest: QA-n (reply to QN-…): <n> Open Items closed, <n> still open, <n> raised[; <PREFIX> needs revisit].`

## Report

Closed (Yes / Edit), still open (Don't know / no answer), new Open Items, Modules set needs-revisit (reason), GEN Requirements added or changed, terms agreed, holds. Next: `/neome-studio:resolve-module` for each revisit; `/neome-studio:questionnaire` to chase what is still open.

Commit: the reply in `inputs/`, `_agent/sources.md`, `_agent/sources/QA-n.md`, `open-items.md`, `general.md`, `process.md`, `map.md`, every ticket, `spec.md` and `prototype-data.json` touched, rebuilt Prototype views.
