# Bank format

Type: grilling (HITL)
Status: resolved
Blocked by: 04

## Question

File shape of Pattern, Template module, Template: fields, IDs, evidence (which Builds), flowchart link, Neome App / Delivery hints. One file each or one per Template? Must support later refine (split / merge / enhance) — see Bank refine skill.


## Answer

Locked with user (2026-11-03). Samples: throwaway branch `prototype/bank-format` (commit 1f38565), `.scratch/template-bank/prototype/bank/`: `PAT-approval-by-status`, `TMOD-leave`, `TPL-hr-small`.

- **Files:** one file per entry, file name = ID. Patterns and Template modules shared, so no copies.
- **IDs:** slug + prefix: `PAT-`, `TMOD-`, `TPL-`. No numbers.
- **Format:** Markdown + YAML front matter (scripts read front matter, models read body). No JSON.
- **Evidence:** `seenIn: [{build: NB-NN, area: <Build area>}]`. Scrubbed Build code; code → client map only in gitignored `raw/`. No link to digests. Area names scrubbed if they name the client.
- **Thresholds:** none. Skills weigh `seenIn` count.
- **Flowchart:** Mermaid inline, fenced.
- **Pattern:** name, task, how (Neome parts), workaround yes/no + why, limits, flowchart, seenIn. No Neome App / Delivery.
- **Template module:** name, aliases, usual needs, process steps, Patterns (IDs), usual sheets + key fields + roles, Neome App hint (catalog slug or `none`) + Delivery hint, flowchart, seenIn.
- **Template:** name, business type, Template modules (core / optional), links between modules, flowchart, seenIn.
- **Glossary:** new term **Usual need** (not a Requirement: no Source, priority, acceptance criteria). Template module now says "usual needs". **Build area** redefined: grouping from the builder's Module tags or Groups.

**Facts for later tickets:**

- Approval in all 3 Leave Builds (and NB-05 Expenses) = status field + workflow branch. Catalog lists an Approval Workflows app (chains, escalation); no sample Build uses it. Feeds Neome limits.
- Per-field rights not in digests → "who may change status" unknowable from bank.
