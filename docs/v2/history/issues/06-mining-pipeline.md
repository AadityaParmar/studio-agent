# Mining pipeline and scrub

Type: grilling (HITL)
Status: resolved
Blocked by: 04, 05

## Question

How digests become bank entries: GLM-5.3-Flash tagging prompt + output shape, GLM-5.3 clustering step, Claude review gate, scrub rules, token budget per Build.


## Answer

Locked with user (2026-11-03).

- **Stages:** digest (script) → scrub (script) → tag (Sonnet) → cluster (Opus) → review (fresh Opus) → human yes/no → bank.
- **Scrub:** script, right after digest, before any model (any provider). Per-Build gitignored word list `raw/scrub/<NB-NN>.txt`, seeded from Build name + `about`; human adds the rest once. Removes Build name, `about`, client/people names, phone/email; message bodies → `«msg»`; sheet/field names kept unless they hold a listed word. Fails if a listed word survives. Unscrubbed digests never leave `raw/`.
- **Tag:** Sonnet 5.5, effort medium. One call per Build area digest (+ overview as context). Output = YAML tag sheet: guessed Template module name + Patterns (name, task, how in Neome parts, workaround yes/no, proof lines from digest). Orphans area tagged, low weight. First run open names; later runs seeded with bank Pattern / Template module names (reuse or mark `new`).
- **Cluster:** Opus 5.5, effort high. Reads only tag sheets (all Builds), never digests. Writes draft PAT-/TMOD-/TPL- files in the locked bank format.
- **Review:** fresh Opus 5.5 session (not the clusterer). Checks each draft vs proof lines; opens cited area digest only on doubt; flags weak/wrong. ~~Then human yes/no per entry.~~ **Superseded by [Bank refine skill](09-bank-refine-skill.md):** human asked only when reviewer unsure or change is split/merge/retire; rest auto-applied on a branch, maintainer merges.
- **Run:** `delegate_task`, provider Claude-sales: 7 tagging children in parallel (one per Build) → 1 cluster child → 1 review child. Main session orchestrates, reads summaries only.
- **Fallback:** Claude-sales limit hit → same models on the default Claude provider; if that is also out → GLM/ZCode (GLM-5.3-Flash for tag, GLM-5.3 for cluster/review).
- **Files:** tag sheets + drafts in gitignored `raw/`; only approved entries committed; scrub check runs on every file before commit.
- **Tokens:** measure, no cap. Log per stage per Build. Rough: 10–35K tokens into tagging per Build.
