# 03: Enterprise and Engagement folder layout

Type: grilling
Status: resolved
Assignee: aditya
Blocked by: 02

## Question

What is the exact tree under `enterprises/<ent>/` and `engagements/<slug>/`? Settle where Inputs, the Source register, the Enterprise GLOSSARY, the Engagement map, Module tickets, Module specs, Prototypes, questionnaires, the BRD data file and rendered BRD versions live. Also settle the file format for the Source register and for Module tickets.

## Answer

```
enterprises/<ent>/                       kebab-case, picked at first ingest (e.g. anglo-gulf)
  GLOSSARY.md                            Enterprise language
  sources.md                             Source register (whole Enterprise)
  inputs/                                in git
    <SOURCE-ID>-<slug>.<ext>             original
    <SOURCE-ID>-<slug>.md                text copy the skills read
  confidential/                          gitignored; Consultant drops confidential files here
  engagements/<slug>/                    kebab-case, no dates (e.g. crm)
    map.md                               Destination, Notes, Modules index, change log
    process.md                           process skeleton, one section per Module
    open-items.md                        Open Items register
    modules/<PREFIX>-<slug>/
      ticket.md  spec.md  prototype.html
    questionnaires/QN-<date>.<ext>
    brd/
      brd-data.<ext>                     phase-2 contract (format: ticket 08)
      versions/v<N>.html                 rendered BRDs (numbering: ticket 12)
```

Decisions:
- **Inputs and Sources are Enterprise-level.** Source IDs are unique across the Enterprise. Each register row lists the Engagement(s) it was ingested for.
- **`sources.md`** is a markdown table: ID | type | title | date | file | engagement(s) | notes.
- **Every Source has a file**, including live sessions (WS-n) and Enterprise decisions (SD), which get a `.md` in `inputs/`.
- **Confidential:** each Enterprise has a gitignored `confidential/` folder. Everything else, large files included, is pushed to git. A confidential Source still gets a row in `sources.md` pointing at `confidential/`. Only the original is gitignored: its `.md` text copy goes in `inputs/` and is committed, and content from it may appear in specs, Prototypes and the BRD.
- **One folder per Module.** `ticket.md` is markdown with the header lines `Status:` (open / claimed / resolved / needs-revisit / merged-into <PREFIX>), `Prefix:`, `Blocked by:`, `Revisit reason:` and `Formerly:`, then a draft Requirements section.
- **Renaming** a Module renames its folder and records `Formerly: <old prefix>`. On a merge or split, the old folder is kept and marked `Status: merged-into <PREFIX>`, never deleted, so Requirement IDs stay traceable.
- **`open-items.md`** is one register per Engagement: ID | question | Module(s) | owner | status | answer Source.
- **`map.md`** is an index only. Open Items live in `open-items.md`.
- **Questionnaire answers** come back as a new Input in the Enterprise `inputs/` folder.
- **Questionnaires** follow the How to talk rule (simple English, short, concise). This is a constraint for ticket 11.

**Change from ticket 11:** `open-items.md` columns are now ID | question | Module(s) | owner | ask to | suggested | status | asked in | answer Source. Questionnaire exports are `QN-<date>.md` (master) + `.html` + `.txt`.
**Superseded by ticket 13:** paths moved under the facade layout (`_agent/` folders). See [13](13-facade-layout-human-vs-agent-files.md).
