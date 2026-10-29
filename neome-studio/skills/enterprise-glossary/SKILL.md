---
name: enterprise-glossary
description: "Building block. Maintain the Enterprise glossary: add, dispute, settle, split, rename and agree terms. Pull before write, commit right after."
upstream:
  - skills/engineering/domain-modeling
upstreamVersion: 1.3.1
---

# enterprise-glossary

## How to talk

- Simple English. No fancy words. Short.
- Be extremely concise. Sacrifice grammar for concision.

Keeps `enterprises/<ent>/_agent/GLOSSARY.md`: the one list of the Enterprise's own terms, shared by all its Engagements. One term, one meaning per Enterprise. Called by `ingest` (new Inputs, Questionnaire replies), grilling (`grill-module`, `resolve-module`) and `build-brd` (after Sign-off).

`ENGINE` = `node neome-studio/engine/cli.mjs`, from the repo root. Every `ENGINE glossary …` command edits only `GLOSSARY.md`; exit 1 = refused (message says why; nothing written), exit 2 = bad arguments.

## Entry

Under `## Language`, one entry per term:

```markdown
**Quote**:
A priced offer for tiles sent to a Lead.
_Avoid_: Quotation, estimate
_Source_: CE-1 · _Status_: proposed · _Used in_: crm · _Disputed_: warehouse/OI-07
```

- Term and definition in the Enterprise's words, from a Source.
- _Avoid_: other words for the same thing. Empty → leave the line out.
- _Source_: every Source ID that shows the term.
- _Status_: `proposed` when written; `agreed` only through [Agree](#agree), [Settle](#settle) or an agreed term's [Split](#split) / [Rename](#rename).
- _Used in_: Engagement slugs that use the term.
- _Disputed_: only while an Open Item holds a dispute: `<slug>/OI-NN` (Open Item IDs are per Engagement).

Enterprise language only: Neome App names and catalog words stay out, and a term → Neome mapping lives in Module spec section 12. `build-brd` warns (`catalog-term`) on both.

## Git

Every write: `git pull --rebase --autostash` first (fails → stop, tell the caller). After: `git add enterprises/<ent>/_agent/GLOSSARY.md`; `git commit -m "enterprise-glossary: <ent>/<slug> <what>"`; `git push`. Rejected → End step 4 of [git-protocol.md](../../reference/git-protocol.md). No Engagement lock. Rewritten Engagement markdown (split, rename) is committed by the caller with its own work.

## Add terms

Caller hands in terms with definition, Source and Engagement slug. Per term:

- New term → add the entry by hand, `proposed`.
- Same term, same meaning (or the Inputs use an _Avoid_ word for it) → add missing Source IDs and the slug to _Used in_. Keep _Status_.
- Same term, different meaning → [Dispute](#dispute). Leave the meaning as is.

Done when every term handed in is written or disputed. Report: added, updated, disputed.

## Dispute

1. Caller raises the Open Item in its Engagement: owner Enterprise, question quotes both meanings and their Sources, suggested answer = the existing meaning (or a split if both look real).
2. `ENGINE glossary dispute enterprises/<ent> --term "<T>" --engagement <slug> --oi OI-NN`. Adds the slug to _Used in_ and the _Disputed_ mark.

The Engagement keeps drafting with the existing meaning. Done when the command exits 0. A disputed term blocks the build once its Open Item closes (`disputed-term`), so settle it in the same session the answer lands.

## Settle

When the dispute Open Item closes, apply the Enterprise's answer (the answer Source = `<ID>`), one of:

- **One meaning.** `ENGINE glossary settle enterprises/<ent> --term "<T>" --source <ID> [--definition "<the answer's meaning>"]`. Agreed.
- **Two real meanings** → [Split](#split) with `--source <ID>`.
- **New name** → [Rename](#rename) with `--source <ID>`.

Done when no _Disputed_ mark points at a closed Open Item.

## Split

Two real meanings (for example two departments) → two qualified terms, bare word in both _Avoid_ lists:

```
ENGINE glossary split enterprises/<ent> --term "Order" --into "Sales Order | <definition> | <slugs>" "Service Order | <definition> | <slugs>" [--source <ID>]
```

`--source` is needed when the term is disputed or agreed (the Enterprise's answer); result agreed. Else result proposed. Then [Rewrite](#rewrite).

## Rename

```
ENGINE glossary rename enterprises/<ent> --term "<Old>" --to "<New>" [--source <ID>]
```

New name becomes the entry; old name goes into its _Avoid_. Agreed or disputed term: only on the Enterprise's answer to an Open Item (`--source` needed; stays agreed). Proposed term: on the Consultant's word in grilling. Then [Rewrite](#rewrite).

## Rewrite

Split and rename print `rewrite: <path>:<line>: <text>` for every line in open Engagements' `_agent/` markdown that still says the old word, and `skipped: <slug>` for Engagements whose latest BRD version is signed off. Rewrite each listed line to the new term where it means this term; leave other senses, quotes from Sources and `_agent/brd/` alone. Signed versions (`versions/v<N>.json`, `brd/v<N>.html`) are frozen; the glossary as of a Sign-off lives in that snapshot.

Done when every listed line is rewritten or judged another sense, and `ENGINE build-brd <engagement> --check` exits 0 for each open Engagement touched. Hand the changed paths to the caller.

## Agree

- **Questionnaire reply confirms a term** (answer Yes, or Edit that keeps the term): `ENGINE glossary agree enterprises/<ent> --term "<T>" --source <QA-n>`. An Edit that changes the meaning → [Settle](#settle) path instead (raise the Open Item if none).
- **After Sign-off** (`build-brd` sign-off mode): `ENGINE glossary agree enterprises/<ent> --signed`. Every term shown in a signed-off version becomes agreed, citing the evidence Source; terms disputed or changed since stay as they are (printed).

Done when the command exits 0. Report the terms agreed.
