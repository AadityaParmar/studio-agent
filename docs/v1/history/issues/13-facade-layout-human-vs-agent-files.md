# 13: Facade layout: human files vs agent files

Type: grilling
Status: resolved
Assignee: aditya
Blocked by: None

## Question

Apply a facade pattern to the repo layout. Files the Consultant (or Enterprise) touches stay few and simple. Everything only agents read or write goes in a separate `_`-prefixed folder (e.g. `_agent/`), shaped for agents: easy to parse, stable paths, no human polish. Settle:
- which files are human-facing (likely: Inputs drop folder, rendered BRD versions, Prototypes, questionnaire exports, maybe `open-items.md`, Enterprise `GLOSSARY.md`) vs agent-only (likely: `sources.md`, Module `ticket.md`/`spec.md`, `process.md`, `map.md`, questionnaire master, `brd-data.json`, text copies of Inputs)
- the `_` folder name and its level (Enterprise, Engagement, or both)
- agent-optimised formats inside it (markdown vs JSON/YAML, one file vs many, front-matter)
- whether human files are generated views over agent files (one-way) or edited by hand and re-ingested
- what this changes in the paths of tickets 03, 07, 08, 10, 11, 12

## Constraints from earlier tickets

- From the user (ticket 11 session): "use facade pattern for files; files that the user will interact with should be simple; agent files in a separate folder starting with `_`, solely for agents, optimised for agents."
- From ticket 03: current tree (Enterprise `inputs/`, `sources.md`, `confidential/`; Engagement `map.md`, `process.md`, `open-items.md`, `modules/<PREFIX>-<slug>/`, `questionnaires/`, `brd/`). Confidential originals stay gitignored.
- From ticket 08: markdown is the source of truth; `brd-data.json` is built, never hand-edited.
- From ticket 11: questionnaire master `QN-<date>.md` + `.html` + `.txt` exports; the Consultant confirms the ingest match list.
- From ticket 12: the BRD has an unnumbered `preview.html` (working draft) plus frozen `versions/v<N>.html` + `v<N>.json`. The sent and signed versions face humans; the snapshots are what phase 2 reads. The sign-off evidence is registered as a Source (e.g. `SO-1`).

## Answer

**Strict one-way facade.** Humans drop files and talk to skills. Everything else a human sees is a generated view. `_agent/` is the only source of truth. Nobody hand-edits anything.

```
enterprises/<ent>/
  inputs/                                HUMAN drop folder (in git)
    <SOURCE-ID>-<slug>.<ext>             original; ingest renames it in place
  confidential/                          HUMAN drop folder, gitignored
  _agent/
    GLOSSARY.md                          Enterprise language
    sources.md                           Source register
    sources/<SOURCE-ID>.md               text copy of every Source (confidential ones too)
  engagements/<slug>/
    brd/                                 HUMAN views
      preview.html                       working draft
      v<N>.html                          released / signed versions
    prototypes/<PREFIX>-<slug>.html      HUMAN views
    questionnaires/QN-<date>.html|.txt   HUMAN views (to send)
    _agent/
      map.md  process.md  open-items.md
      modules/<PREFIX>-<slug>/ticket.md  spec.md
      questionnaires/QN-<date>.md        master
      brd/brd-data.json
      brd/versions/v<N>.json
```

Decisions:
- **One-way.** Human files are views built by `build-brd`, `build-prototype` and `questionnaire`. Skills never read a view back. Any view can be deleted and rebuilt from `_agent/`. Human input enters only through `inputs/`, `confidential/`, or a live session (registered as a Source).
- **Human-facing = 2 drop folders + 3 view folders.** `inputs/`, `confidential/`, `brd/`, `prototypes/`, `questionnaires/`. Nothing else at the top level.
- **Folder name `_agent/`**, at both levels (Enterprise and Engagement), so each Engagement stays self-contained.
- **Open Items register and Enterprise GLOSSARY.md are agent-only.** Humans see them in the BRD (Open Items register + Glossary sections) and in questionnaires. Status for Consultants comes from the `studio` skill.
- **Inputs:** the Consultant drops a file with any name. `ingest` registers it and renames it to `<SOURCE-ID>-<slug>.<ext>` in place, so humans see the ID. The text copy moves to `_agent/sources/<SOURCE-ID>.md` (no longer next to the original). Sign-off evidence (`SO-n`) and questionnaire replies (`QA-n`) are ordinary Inputs.
- **Formats inside `_agent/`:** stay markdown (ticket 08: markdown is the source of truth, JSON is built). `ticket.md` header lines become YAML front-matter (`status`, `prefix`, `blockedBy`, `revisitReason`, `formerly`) so they parse with a standard parser. Registers stay markdown tables. One file per Module, one register per kind. Stable paths: no dates in names except `QN-<date>`.
- **Views follow Modules.** Rename a Module → rename its Prototype file. On merge, the old Module's Prototype view is removed (its `_agent/modules/` folder stays, per ticket 03).

Path changes:
- **03:** tree above replaces the ticket 03 tree. `sources.md`, `GLOSSARY.md` → Enterprise `_agent/`; text copies → `_agent/sources/`; `map.md`, `process.md`, `open-items.md`, `modules/` → Engagement `_agent/`; `prototype.html` leaves the Module folder.
- **07:** `spec.md` at `_agent/modules/<PREFIX>-<slug>/spec.md`. The register reference stays `open-items.md` (now under `_agent/`).
- **08:** `brd-data.json` and `v<N>.json` under Engagement `_agent/brd/`. Inputs to the build are read from `_agent/` only.
- **10:** Prototype is written to `prototypes/<PREFIX>-<slug>.html`, built from `_agent/.../spec.md`.
- **11:** master `_agent/questionnaires/QN-<date>.md`; exports in `questionnaires/`.
- **12:** `brd/preview.html` + `brd/v<N>.html` (human); `_agent/brd/versions/v<N>.json` (snapshots for phase 2).
- **GLOSSARY-MAP:** Enterprise glossary path → `enterprises/<ent>/_agent/GLOSSARY.md`.
