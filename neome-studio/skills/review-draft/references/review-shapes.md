# Review shapes

What `review-draft` writes, so `build-brd` reads it. Full grammar: [brd-data-schema.md](../../build-brd/references/brd-data-schema.md) ("Where each field comes from"). Provenance rules as in [draft-shapes.md](../../ingest/references/draft-shapes.md): cite `[ID]` or write `(proposed, to confirm)`; unknown → Open Item. Paths from `enterprises/<ent>/engagements/<slug>/`.

## Session log Source (WS-n)

Only when the Consultant relayed something the Enterprise said that no Source holds yet. Write `enterprises/<ent>/inputs/review-draft-session.md`, then register it:

```
ENGINE add-source enterprises/<ent> enterprises/<ent>/inputs/review-draft-session.md --engagement <slug> --prefix WS --type "session log" --title "review-draft session" --date <today>
```

```markdown
review-draft session, <ent>/<slug>, <YYYY-MM-DD>. Consultant: <who> (Neomenta).
Consultant relays what the Enterprise said; Consultant's own views are proposals + Open Items, not recorded here.

- <Topic> (<who>, relaying <Enterprise person, role>, <where/when said>): <what they said>.
```

One bullet per relayed answer, speaker named. Facts from it cite `[WS-n]`.

## Process skeleton `_agent/process.md`

```markdown
# Process

Skeleton from `review-draft`. Each `resolve-module` refines its Module's section.

## Lanes

| id | name | who | kind | OI | Source |
|---|---|---|---|---|---|
| sales | Sales execs | Sales exec | person | | CE-1 |
| tally | Tally | Accounts | external | OI-03 | CE-1 |

## QUO — Quotations

| id | lane | Module | label | note | kind | OI | Source |
|---|---|---|---|---|---|---|---|
| make-quotation | sales | QUO | Make quotation | | step | | CE-1 |
| approve-discount | head | QUO | Approve discount | Above the usual | decision | OI-01 | CE-1 |
| invoice | tally | | Raise invoice | After acceptance | external | OI-03 | CE-1 |

## Edges

| from | to | label | alternate | Source |
|---|---|---|---|---|
| make-quotation | approve-discount | discount above usual | yes | CE-1 |
```

- Lane per role or system (`kind` person | system | external). `who` = role in the Enterprise's words.
- One H2 per live Module, in map order, 2–5 steps: the Module's main path end to end. Step `id` kebab-case, unique across the file. External steps (other parties' systems) have no Module.
- Edges link steps across Modules so the whole process reads start to end. `alternate: yes` for side paths.
- A step or lane that hangs on an unknown → its `OI` cell.

## Roles

Per Module ticket, `## 2 Roles` table `| role | does what | headcount | Source |` (add the section if missing, in number order). Headcount only from a Source; else empty (grilling asks it). Same role names as the process lanes.

## Engagement-wide topics `_agent/general.md`

Topic H2s exist (`## Access` … `## Other`). Each topic ends **covered** by one or more of:

- a Requirement block (`### GEN-NN — Title`, next free GEN number, same lines as a Module Requirement):

  ```markdown
  ### GEN-03 — Own login per role

  Statement: Sales execs, the sales head and accounts staff each log in with their own access. [CE-1, WS-1]
  Acceptance:
  - Each role logs in and sees only what it is allowed to. (proposed, to confirm)
  Priority: TBC
  Scope: Open
  Sources: CE-1, WS-1
  Proposed: yes
  ```

- `N/A: <reason> [Source]` — only when a Source says the topic does not apply (never with Requirements in the same topic);
- `- OI-NN: <gist>` bullet, and the Open Item row has Module(s) = `All`.

Topics: Access (users, roles, permission matrix) · Localisation (currencies, languages) · Hosting (hosting, data residency, SSO, security) · Migration · Training · Support · Other (anything else no single Module owns).

## Plan skeleton `_agent/plan.md`

```markdown
# Implementation plan

Skeleton from `review-draft`. All proposed. Weeks: Consultant only.

## Phases

| ID | name | week from | week to | covers | Modules | Source |
|---|---|---|---|---|---|---|
| masters | Masters and core set-up | | | Users, roles, master data, core set-up | ENQ, QUO, GEN | (proposed, to confirm) |
| workflow | Workflow and process set-up | | | Statuses, approvals, rules, notifications | ENQ, QUO | (proposed, to confirm) |
| uat | Testing and UAT | | | Testing with the Enterprise's users | ENQ, QUO | (proposed, to confirm) |
| go-live | Go-live and training | | | Data migration, training, hand-over | GEN | (proposed, to confirm) |

## Not yet placed

| what | OIs | Modules | Source |
|---|---|---|---|
| Accepted quotations to Tally | OI-03 | QUO | (proposed, to confirm) |
```

- Always these 4 phases, this order, these IDs. Week cells stay empty.
- Every live Module sits in a phase or in Not yet placed. Default: live Modules in `masters`, `workflow`, `uat`; `GEN` in `masters` (access) and `go-live` (migration, training, support).
- Not yet placed: third-party integrations, and a Module or part whose scope hangs on an open Open Item (name the OI).
- Re-run: add new Modules to the same phases; leave rows the Consultant already edited (weeks set, Source not proposed) as they are.
