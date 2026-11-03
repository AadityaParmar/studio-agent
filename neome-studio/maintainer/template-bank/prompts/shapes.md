# Template bank refine: YAML shapes

Agent-facing. Shared by the tag, cluster and review children and the driver (`maintainer/refine-template-bank.md`). The script `maintainer/refine-template-bank.mjs` checks every shape (`validate-tags`, `validate-changes`, `decide`); anything not listed here is an error. Terms per `GLOSSARY.md` § Template bank. Entry format: `reference/template-bank/README.md`.

All text: plain English, short, no client words. Never copy a name that looks like a client, person, place, phone or email; the scrubbed digest already replaced them with `«build»`, `«name»`, `«about»`, `«email»`, `«phone»`, `«msg»`. Keep those tokens as they are when you quote.

**Proof line** = one line copied exactly from the source file (a scrubbed digest for tag sheets, a tag sheet for change lists). Part of a line is fine; never two lines, never your own words. The script looks each one up and fails the file when it is not found.

## Tag sheet: `tags/<NB-NN>/<area>.yaml` (one per Build area)

```yaml
build: NB-01                  # the Build code
area: Sales                   # Build area name, exactly as in the digest heading "# Build area: <name>"
file: sales.md                # the scrubbed area file it was made from
weight: normal                # normal | low ("Orphans (maybe dead)" area = low)
templateModule:               # guessed Template module, or null when the area holds no Module shape
  name: Sales orders          # reuse a Template bank name when it fits; else a short open name
  id: new                     # new | a TMOD- ID from the Template bank names list
  needs:                      # usual needs: what the Module has to do (short, may be empty)
    - Rep raises an order for a customer.
  steps:                      # process steps in order (may be empty)
    - Rep adds order.
    - Manager approves or rejects.
  sheets:                     # usual sheets + key fields (may be empty)
    - "Order: Customer →Customer, Status {Draft|Approved|Rejected}, Approver @Manager"
  roles: [Sales Rep, Manager] # may be empty
  proof:                      # non-empty; lines from the area file
    - "### Order — update@Manager"
patterns:                     # may be empty
  - name: Approval by status
    id: new                   # new | a PAT- ID from the Template bank names list
    task: Manager approves an order.
    how: Status pickText + workflow branch on Status + message to the asker.   # Neome parts
    workaround: true          # true = Neome has no direct feature; this is a way round it
    why: No approval step; status list + branch stand in.
    proof:                    # non-empty; lines from the area file
      - '- branchIfElse "Approved?" [if Curr.Status equalTo "Approved"]'
```

## Build tag sheet: `tags/<NB-NN>/_build.yaml` (one per Build, from `overview.md`)

```yaml
build: NB-01
file: overview.md
template:                     # guessed Template, or null when the Build is no small enterprise
  name: Small trading company
  id: new                     # new | a TPL- ID from the Template bank names list
  businessType: Sells goods to shops.
  core: [Sales]               # Build area names (must be areas of this Build)
  optional: [Quotes]          # may be empty
  links:                      # how the core / optional areas link (may be empty)
    - "Quotes → Sales: quote refs customer"
  proof:                      # non-empty; lines from overview.md
    - "- Quotes → Sales (1)"
```

## Change list: `runs/<run>/changes.yaml` (cluster child)

```yaml
changes:                      # may be empty; applied in this order
  - change: add               # new entry; draft required
    id: TMOD-sales-orders
    seenIn: [{build: NB-01, area: Sales}]     # non-empty
    reason: Order + approval flow seen in NB-01.
    proof:                    # non-empty; lines from tag sheets
      - {build: NB-01, area: Sales, line: "name: Sales orders"}
  - change: enhance           # more evidence and / or new content; draft optional (no draft = seenIn only)
    id: PAT-approval-by-status
    seenIn: [{build: NB-01, area: Sales}]     # may be empty
    reason: …
    proof: [ … ]
  - change: rename            # new ID; draft optional (no draft = id + name + heading change only)
    from: PAT-flag-sign-off
    to: PAT-sign-off-by-flag
    name: Sign-off by flag    # optional new name
    seenIn: []                # optional
    reason: …
    proof: [ … ]
  - change: split             # one entry → two or more new; one draft per part
    from: TMOD-sales
    into:
      - {id: TMOD-sales-orders, seenIn: [{build: NB-01, area: Sales}]}
      - {id: TMOD-sales-quotes, seenIn: [{build: NB-01, area: Quotes}]}
    reason: …
    proof: [ … ]
  - change: merge             # near-duplicates → one kept ID; other names go to its aliases; draft optional
    from: [TMOD-order-desk]
    into: TMOD-sales-orders
    seenIn: []                # optional
    reason: …
    proof: [ … ]
  - change: retire            # entry goes, nothing replaces it; proof optional
    id: PAT-dusty
    reason: …
```

Rules the script checks:

- `seenIn` rows: Builds of this run's tag sheets only (`split` parts may also keep the old entry's rows of other Builds). `area` = a Build area name of that Build's tag sheets, or `"*"` (whole Build, from `_build.yaml`).
- `proof` rows: `{build, area, line}`; `line` found in the tag sheet of that Build + area (`area: "*"` = `_build.yaml`).
- IDs: `PAT-` / `TMOD-` / `TPL-` + lowercase words joined by `-`, no numbers as sequence. New IDs (`add`, `rename` to, `split` into) never used before (not live, not in `CHANGELOG.md`). One change per ID. All IDs of one change are the same kind.
- `reason`: one line, no client words. It becomes the `CHANGELOG.md` line.
- Drafts: `runs/<run>/drafts/<ID>.md`, a full entry in the Template bank format (front matter + body sections + Mermaid flowchart). The script sets `id`, `kind` and `seenIn`; merge adds the merged names to `aliases`; rename of a Template module adds the old name to `aliases`.

What `apply` does on its own (do not list these as changes):

- Drops every old `seenIn` row of this run's Builds (updated or removed; with `--full`, every row), then adds the rows the change list gives. So an `enhance` must list the rows of this run's Builds for every entry they still show.
- References follow ID changes: rename / merge → new ID, split → all parts, retire → removed from `patterns` / `modules`.
- Entry whose `seenIn` hits zero → retired (CHANGELOG `retire | <ID> | seenIn hit zero`).
- A Template whose `core` ends up empty fails the check: fix it in the change list.

## Review verdicts: `runs/<run>/verdicts.yaml` (review child)

```yaml
verdicts:                     # exactly one per change
  - ref: add TMOD-sales-orders # "<change> <ID>"; ID = id (add, enhance, retire), from (rename, split), into (merge)
    verdict: apply            # apply | ask | drop
    backed: true              # the proof lines really back the change
    agrees: true              # you agree with the change as the clusterer wrote it
    note: Proof shows order + approval.        # one line
    question: Keep quotes inside sales?        # one line; needed when verdict is ask or drop, or when backed / agrees is false
```

Review rule (script `decide`): `add` / `enhance` / `rename` with `verdict: apply`, `backed: true`, `agrees: true` → applied without asking. Everything else (any `split` / `merge` / `retire`, any `ask` / `drop`, not backed, disagrees) → the maintainer answers yes / no.
