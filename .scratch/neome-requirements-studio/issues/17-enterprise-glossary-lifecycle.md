# 17: Enterprise glossary lifecycle

Type: grilling
Status: resolved
Blocked by: None

## Question

How does the Enterprise glossary live across Engagements? Decide: how it is seeded (ingest of first Engagement, catalog terms), how a second Engagement reuses and extends it, how conflicts are handled (same term, new meaning; term renamed), who approves terms, and how the BRD shows the glossary as of a signed version.

## Constraints from earlier tickets

- From ticket 13: Enterprise `GLOSSARY.md` lives in Enterprise `_agent/`.
- From ticket 12: signed BRD versions are frozen.
- Map Notes: the BRD renders the Enterprise glossary.

## Answer

Consultant said to take all recommended options and only ask on critical points. None were critical, so all were taken as recommended.

- **One glossary per Enterprise**, shared by all its Engagements, at `enterprises/<ent>/_agent/GLOSSARY.md` (ticket 13). There is no glossary per Engagement. The Enterprise speaks one language.
- **Seeding:** the first `ingest` drafts terms from the Inputs, each citing its Source and marked `proposed`. Grilling adds more terms through `enterprise-glossary`. **Catalog terms are not seeded.** Neome App names are Neome's language, not the Enterprise's. A mapping from a term to a Neome entity belongs in spec section 12, never in the glossary.
- **Entry format:** domain-modeling style (term, definition, _Avoid_), plus one metadata line: `_Source_: CE-1, QA-2 · _Status_: proposed|agreed · _Used in_: <engagement slugs>`.
- **Reuse by a later Engagement:** its `ingest` reads the existing glossary first and drafts Modules in those terms. A term the new Engagement uses gets that slug added to _Used in_. New terms are added as `proposed`.
- **One term, one meaning per Enterprise.** If a second Engagement finds a different meaning for an existing term:
  - The agent never overwrites the meaning. It raises an Open Item (owner Enterprise), and the term shows "disputed" until the Open Item closes.
  - If both meanings are real (for example two departments), the agent splits the term into two qualified terms (for example Sales Order and Service Order). The bare word goes into _Avoid_ on both.
- **Rename:** the new name becomes the entry and the old name goes into its _Avoid_. The agent rewrites the specs of open Engagements. Signed BRD versions are never touched (ticket 12).
- **Who approves:** the agent proposes, and the Consultant accepts during grilling. The Enterprise confirms in one of two ways: answering a Questionnaire item about the term, or Sign-off of a BRD that shows the term. Either way the term becomes `agreed`. A later Engagement can only change an agreed term through the conflict or rename path above, which needs an Open Item.
- **BRD glossary:** `build-brd` renders only the terms whose _Used in_ includes this Engagement. This matches how `sources[]` is filtered. Proposed terms are marked like other proposed facts.
- **As of a signed version:** the frozen `versions/v<N>.json` already holds a copy of the glossary. That copy is the glossary as of sign-off, so no separate glossary versioning is needed (git has the history). The change log diffs the glossary like any other part.
- **Concurrency:** this file is shared across Engagements. `enterprise-glossary` pulls before it writes and commits right after (ticket 15 git rules). It needs no Engagement lock.
- **Schema (ticket 08) change, minor semver bump:** `glossary[] {term, definition, avoid[], sources, proposed, disputed?}`. Only this Engagement's terms are included. Cross-reference check: every Source ID exists, and every disputed term has an open Open Item.

Glossary: added **Enterprise glossary**. GLOSSARY-MAP Enterprise → BRD line updated.
