# Agent conventions

How engineering skills (mattpocock-skills etc.) use this repo: issue tracker, triage labels, domain docs. Merged from the old `docs/agents/{issue-tracker,triage-labels,domain}.md`.

## How to talk

- Simple English. No fancy words. Short.
- Be extremely concise. Sacrifice grammar for concision.

## Issue tracker: local markdown

Issues and specs live as markdown under `.scratch/` (created on demand; one folder per live effort). Finished efforts move to `docs/v<N>/history/` at release.

- One effort per folder: `.scratch/<effort-slug>/`.
- Spec: `.scratch/<effort-slug>/spec.md`.
- Tickets: one file each, `.scratch/<effort-slug>/issues/NN-<slug>.md`, numbered from `01`. Never one combined file.
- Triage state: `Status:` line near the top (labels below).
- Comments: append under `## Comments` at the bottom.
- "Publish to the issue tracker" = create a file under `.scratch/<effort-slug>/` (make the folder if needed).
- "Fetch the ticket" = read the file at the given path or number.

### Wayfinding (`/wayfinder`)

- **Map**: `.scratch/<effort>/map.md`: Notes / Decisions-so-far / Fog.
- **Child ticket**: `issues/NN-<slug>.md`. `Type:` line = `research` / `prototype` / `grilling` / `task`. `Status:` = `claimed` / `resolved`.
- **Blocking**: `Blocked by: NN, NN` near the top. Unblocked when every listed ticket is `resolved`.
- **Frontier**: open, unblocked, unclaimed tickets; lowest number wins.
- **Claim**: set `Status: claimed`, save, then work.
- **Resolve**: add `## Answer`, set `Status: resolved`, add gist + link to `map.md` Decisions-so-far.

## Triage labels

Same strings as mattpocock/skills defaults, used as the `Status:` value:

| Label | Meaning |
|---|---|
| `needs-triage` | Maintainer must evaluate |
| `needs-info` | Waiting on reporter |
| `ready-for-agent` | Fully specified, AFK agent can take it |
| `ready-for-human` | Needs human implementation |
| `wontfix` | Will not be actioned |

## Domain docs

Read before exploring (skip silently if missing):

- `GLOSSARY-MAP.md`: points at each glossary.
- `GLOSSARY.md`: studio terms (Consultant, Enterprise, Engagement, Module, Requirement, Open Item…). Fixed.
- `enterprises/<ent>/_agent/GLOSSARY.md`: one per Enterprise, its business terms. Never redefines studio terms.
- `docs/v<N>/decisions.md`: design decisions (D-numbers). Latest version wins.

Rules:

- Name domain concepts exactly as the glossary does. No synonyms.
- Concept missing from glossary = inventing language (reconsider) or real gap (note it for `/domain-modeling`).
- Output contradicts a decision? Say so: _Contradicts D08 (…), but worth reopening because…_ Changes to a decision follow [route.md](route.md) section 1.
