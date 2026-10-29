---
name: write-module-spec
description: "Building block for resolve-module. Write the Module spec (13 fixed sections) from grilling output, get section 12 from neome-mapping, run the done check."
upstream:
  - skills/engineering/to-spec
upstreamVersion: 1.3.1
---

# write-module-spec

## How to talk

- Simple English. No fancy words. Short.
- Be extremely concise. Sacrifice grammar for concision.

Turn one Module's grilling output into its Module spec. Synthesis, no interview: everything you write is already in the grilling output or a Source. A gap is an Open Item, never a guess.

`ENGINE` = `node neome-studio/engine/cli.mjs`, from the repo root. `<eng>` = `enterprises/<ent>/engagements/<slug>`. Module folder = `<eng>/_agent/modules/<PREFIX>-<slug>/`. Shapes and rules: [spec-template.md](references/spec-template.md); filled sample: [spec-example.md](references/spec-example.md) (Harbor Tiles QUO, made up). Runs no git: the caller (`resolve-module`) commits.

## 1. Scope

From the caller: `<ent>`, `<slug>`, `<PREFIX>`, and on a revisit the `revisitReason`.

- The ticket front-matter must say `status: claimed` and `claimedBy:` = `git config user.name`. Else stop: tell the Consultant to run `/neome-studio:resolve-module`.
- First pass: grilling output is in `ticket.md`. Revisit: it is in `spec.md`; touch only the sections the `revisitReason` and the new grilling answers touch.

Done when Module, pass (first / revisit) and the sections to write are fixed.

## 2. Read

Read whole: the grilling output, `spec-template.md`, the Enterprise `GLOSSARY.md`, `open-items.md`, the Source register `enterprises/<ent>/_agent/sources.md`, and the text copy of every Source the grilling output cites. Done when you know, per section 1–11 and 13, what is filled, what is N/A and which Open Items hang on it.

## 3. Write `spec.md`

Write the template top to bottom (revisit: edit in place):

1. **Header**: `Prefix:`, `Name:`, `Status:` (= ticket `status`), `Sources:` (every Source ID the spec cites).
2. **Sections 1–11, 13**: move every grilling fact into its section, citation and `(proposed, to confirm)` marks kept as they are. A section the grilling left empty: `N/A: <reason> [Source]` when a Source says it does not apply; else a new Open Item (step 4) as `- OI-NN: <gist>`.
3. **Section 12**: leave the heading alone; `neome-mapping` writes it (step 5). Keep an existing section 12 on a revisit.
4. **If it needs Sign-off, it is a Requirement.** Sweep sections 2–10 for what the Enterprise must approve: approval thresholds and approvers, final statuses, notifications to people, reports, integration ownership, volumes the build depends on. Each one sits under a live Requirement. Missing → new block with the next free ID, `Proposed: yes`, and its ID added to the Engagement Open Item (grill-module [grill-shapes.md](../grill-module/references/grill-shapes.md), Bulk confirm).
5. **Requirement blocks** complete as in the template: statement, acceptance bullets, priority, scope, Sources, OIs, `Proposed:` matching the text. Dropped Requirement → `Withdrawn: <reason> [Source]`, block kept, ID never reused.
6. **Terms**: the Enterprise glossary's words throughout. A new term → hand it to `enterprise-glossary` (Add terms).
7. **`ticket.md`**: once `spec.md` holds everything, cut the ticket body to its H1, `Name:` line and `Spec: [spec.md](spec.md).` Front-matter untouched.

Done when every fact of the grilling output is in `spec.md` and the ticket body is the pointer.

## 4. Open Items

Every gap found in step 3 → a row in `open-items.md` (next free `OI-NN`, shape as in grill-shapes), owner Enterprise unless Neomenta must find out, and the `- OI-NN:` bullet in its section plus section 13. Section 13 = every open Open Item of the Module (its Module(s) column, or on a live Requirement's `OIs:` line); closed ones dropped. Done when every gap has a row.

## 5. Neome mapping

Run the `neome-mapping` skill for `<PREFIX>`. It writes section 12 and any `Delivery:` override lines. Done when section 12 has its three lines.

## 6. Done check

```
ENGINE spec-check <eng> <PREFIX>
```

Each `error` line names the gap; fix the markdown (or raise an Open Item) and run again. Done at exit 0 (`spec-check: <PREFIX> done`). Never set the ticket `status`; the caller closes it.

## 7. Hand back

To the caller, short:

- Sections: filled / N/A / OI-NN per section.
- Requirements added or withdrawn; IDs added to the Engagement Open Item.
- Open Items raised.
- Neome mapping as `neome-mapping` handed it back (App, Delivery, overrides; Custom module → plan Not yet placed).
- Files written (for the caller's commit): `spec.md`, `ticket.md`, `open-items.md` if touched, `GLOSSARY.md` via `enterprise-glossary`.
