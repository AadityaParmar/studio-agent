# Module spec template

File: `enterprises/<ent>/engagements/<slug>/_agent/modules/<PREFIX>-<slug>/spec.md`. Filled sample: [spec-example.md](spec-example.md). Full grammar the engine reads: [brd-data-schema.md](../../build-brd/references/brd-data-schema.md) ("Where each field comes from").

## Rules

- **Header**: four lines before the first H2: `Prefix:`, `Name:`, `Status:` (= ticket `status`), `Sources:` (every Source ID the spec cites, comma-separated).
- **13 H2 sections**, written `## <n> <title>`, in this order, never deleted, nothing else at H2. A section is **filled** (rows / bullets), **N/A** (`N/A: <reason> [Source]`, the reason from a Source), or **open** (`- OI-NN: <gist>` bullets, alone or under the filled part).
- **Provenance**: every row, bullet and Requirement cites `[CE-1]` / `[CE-1, WS-2]` inline, or says `(proposed, to confirm)`. Unknown → Open Item, never a guess. Source column cells may be empty when the row says `(proposed, to confirm)`.
- **Terms** as in the Enterprise `GLOSSARY.md`. No glossary in the spec.
- **If it needs Sign-off, it is a Requirement.** Sections 2–10 are build detail; anything in them the Enterprise must approve is also a Requirement in section 11.
- **Owners**: `write-module-spec` writes everything except section 12 and the `Delivery:` override lines in section 11; `neome-mapping` writes those.
- **Revisit**: edit in place. No change section; history = git + BRD change log.

## Template

```markdown
# <PREFIX> — <Module name>

Prefix: <PREFIX>
Name: <Module name, Enterprise's words>
Status: <claimed | resolved | needs-revisit, same as ticket>
Sources: <CE-1, WS-2, ...>

## 1 Purpose and KPIs

- Purpose: <why this Module exists, one line> [Source]
- KPI: <measurable goal> [Source]

## 2 Roles

| role | does what | headcount | Source |
|---|---|---|---|
| <role> | <what they do here> | <number from a Source, else empty + OI> | [Source] |

## 3 Process

- <AS-IS step or pain> [Source]
- TO-BE: see this Module's section of `process.md`.

## 4 Records and data

| entity | field | type | required | notes | Source |
|---|---|---|---|---|---|
| <entity> | <field> | <text\|number\|money\|date\|choice\|person\|link-to-entity\|file> | <yes\|no> | <Values: A / B / C> or <Links to: Entity> or note | [Source] |

## 5 Statuses

| id | start/end | open (OI) | Source |
|---|---|---|---|
| <kebab-id> | <start\|end\|empty> | <OI-NN if the status hangs on one> | [Source] |

| from | to | trigger | Source |
|---|---|---|---|
| <status id> | <status id> | <what moves it> | [Source] |

## 6 Rules and notifications

| rule | when | action/notify whom | Source |
|---|---|---|---|
| <rule name> | <condition> | <what happens; who is told> | [Source] |

## 7 Exceptions

- <case off the happy path and what happens> [Source]

## 8 Reports

| name | audience | measures/filters | Source |
|---|---|---|---|
| <report> | <role> | <measures; filters> | [Source] |

## 9 Integrations

| system | direction | data | owner | Source |
|---|---|---|---|---|
| <system> | <in\|out\|both> | <what moves; system of record> | <who builds/owns it, else OI-NN> | [Source] |

## 10 Volumes and NFRs

- <volume, peak, device, speed, retention> [Source]

## 11 Requirements

### <PREFIX>-01 — <title>

Statement: <one testable sentence: what the solution must do> [Source]
Acceptance:
- <observable condition UAT checks> [Source]
Priority: <Must | Should | Could | Won't | TBC>
Scope: <Neome | Neome TBC | Third-party system | Enterprise | Out of scope | Open>
Sources: <CE-1, WS-2> or (proposed, to confirm)
OIs: <OI-NN, ...>
Proposed: <yes | no>
Delivery: <Standard | Configuration | Custom module, only where it differs from section 12>

### <PREFIX>-02 — <title of a dropped Requirement>

Statement: <as it was> [Source]
Acceptance:
- <as it was> [Source]
Priority: <as it was>
Scope: <as it was>
Sources: <as it was>
Proposed: <as it was>
Withdrawn: <reason> [Source of the decision]

## 12 Neome mapping

Neome App: `<catalog slug>` (or `none` when no App fits)
Delivery: <Standard | Configuration | Custom module>
How: <how the App covers this Module: Enterprise term → App entity, what is set up, what is added; OIs> (proposed, to confirm)

## 13 Open Items

- OI-NN: <one-line gist; the register `open-items.md` holds the full row>
```

## Requirement block

- Heading `### <PREFIX>-NN — <title>`. `NN` = 2 digits, 3 after 99. Next free number; **never reused**, never renumbered.
- `Statement:` one sentence. `Acceptance:` ≥1 bullet. `Priority:` and `Scope:` always written (`TBC` / `Open` when unknown, never left out).
- `Sources:` Source IDs, or `(proposed, to confirm)` for an agent proposal. `OIs:` optional. `Proposed: no` only when no part of the block says `(proposed, to confirm)`.
- `Delivery:` only where it differs from the Module Delivery in section 12.
- **Withdrawn**: the block stays where it is, as it was, plus `Withdrawn: <reason> [Source]`. Its ID is never used again. Merge / move write `Withdrawn: Merged into X-NN` / `Moved to X-NN` (via `ENGINE module`).

## Section 13

Lists every **open** Open Item that names this Module in its Module(s) column or sits on a live Requirement's `OIs:` line (including Engagement OIs with Module `All`). ID + one-line gist only. Closed ones are dropped here and stay on `OIs:` lines. None open → `N/A: no open Open Items`.

## Done check

Run before the Module ticket closes, after section 12 exists:

```
ENGINE spec-check <eng> <PREFIX>
```

It passes (exit 0) only when:

- [ ] the four header lines are present; `Prefix:` = the ticket prefix; `Sources:` lists every Source the spec cites
- [ ] all 13 headings are present, numbered, in order, nothing else at H2
- [ ] each section is filled, `N/A: <reason>`, or lists its Open Items
- [ ] every live Requirement has statement, acceptance, priority, scope, Sources and a `Proposed:` line that matches its text
- [ ] no Requirement ID from an earlier build or released BRD version is missing (withdrawn ones stay)
- [ ] section 12 has one Neome App (catalog slug or `none`), one Delivery, a How line; `none` ⇒ Custom module; no override equal to the Module Delivery
- [ ] section 13 lists every open Open Item of the Module and no closed one
- [ ] no uncited facts, and the whole Engagement builds (`build-brd --check` rules, this Module held to resolved strictness)
