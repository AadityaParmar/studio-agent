# Evals

Golden replay of the skills (tickets 18, 41–42). Maintainer-only: not a skill, not an engine command; `studio` never shows it. Never runs in `npm test` or CI: it costs tokens and needs a logged-in Claude Code.

## Run

From the repo root, on the branch with the skill change:

```
node neome-studio/evals/run.mjs run --all
```

Or tell Claude: "follow `neome-studio/evals/eval.md`" (runs it, then walks you through the spot-check). One case: `run tiny-synthetic`. Options: `--model`, `--judge-model`, `--budget <usd>` (per `claude` call). Needs `claude` on PATH, logged in (or `NEOME_EVAL_CLAUDE=<path>`), `npm ci` done. The [run.mjs](run.mjs) header lists every command and output line; the steps can also run one by one: `prepare`, `replay`, `judge`, `score`.

`node neome-studio/evals/run.mjs check` checks every case's files and links (no LLM, seconds). `npm test` runs it too.

## Cases

One folder per Eval case: `inputs/` (anonymised raw Inputs), `answer-key.md` (facts K-NN the simulated client may give, Consultant choices), `golden.json` (expected Modules, Requirements, Open Items, mapping; shape [lib/golden.schema.json](lib/golden.schema.json); optional `mechanics` checks on the end state; optional `score` lists the soft metrics the case scores, the rest show n/a), `replay.yaml` (steps; shape [lib/replay.schema.json](lib/replay.schema.json)), `README.md` (what it covers).

| Case | Covers |
|---|---|
| [tiny-synthetic](tiny-synthetic/README.md) | Flow mechanics: Questionnaire loop, glossary conflict, GEN, release + Sign-off + change log, claim/lock |
| [anglo-gulf-crm](anglo-gulf-crm/README.md) | Full flow on a real CRM BRD (56 Requirements, 28 Open Items). Inputs reconstructed from the golden BRD: recall reads high |
| [petrostar-crm](petrostar-crm/README.md) | Mapping only (`score`): 17 RFP Modules → Delivery class. RFP reconstructed from the proposal |

## How a run works

1. **prepare**: temp folder with a local bare remote and two Consultant clones (`a`, `b`) of this repo, the plugin without `evals/` and `engine/test/` (no skill can read a golden file or key), the case Inputs in clone `a`. The real repo is never touched.
2. **replay**: each `replay.yaml` step. Skill steps run `/neome-studio:<skill>` headless (`claude -p`, plugin loaded, permissions bypassed) in a clone. Every skill message goes to the **simulated client** ([prompts/simulated-client.md](prompts/simulated-client.md) + the answer key, no tools): it answers as the Enterprise from the key only (anything else → Don't know) and makes Consultant choices per the step brief. Engine steps act as a Consultant without a skill (Ben's claim and lock). Enterprise steps write an Input (Questionnaire reply, signed copy). `status` snapshot after each step. Log: `run/log.jsonl`, readable `run/transcript.md`.
3. **judge**: one tool-less call ([prompts/judge.md](prompts/judge.md)) gets golden, the replay's BRD data, the cited Source text copies and every Don't know; it matches by meaning only → `run/judge.json`.
4. **score**: deterministic. Rejects judge output that skips or repeats an item. Writes `results/<date>-<case>.md`.

## Scorecard

Hard gates: BRD data (live build + every `v<N>.json`) passes schema + cross-ref; no fact `proposed: false` with empty `sources`; no invented fact (judge reads each Requirement's cited Source); every Don't know ended as an Open Item; every `mechanics` check passes; no replay problem (turn limit, engine step failed, unusable client answer).

Soft: Requirement recall (golden Requirements matched), Open Items caught (golden Open Items asked, or answered correctly in a Requirement), Module set (merge/split allowed), mapping (matched Modules carry the golden Delivery class; n/a when golden has no mapping). Extra Requirements are listed and tagged plausible / noise, never failed.

Regression: no soft metric drops more than the threshold vs the latest result of the same case recorded on branch `main` (results record their branch; none yet → no check).

## Thresholds

Starting values from ticket 18; first runs calibrate them. The runner reads this table. Change a Pass value only with a reason in its row.

| Metric | Key | Kind | Pass | Reason |
|---|---|---|---|---|
| Schema + cross-ref valid (errors) | `valid` | hard, max | 0 | ticket 18 |
| Uncited non-proposed facts | `uncited` | hard, max | 0 | ticket 18 |
| Invented facts | `invented` | hard, max | 0 | ticket 18 |
| Don't know without an Open Item | `dontKnow` | hard, max | 0 | ticket 18: a Don't know must end as an Open Item |
| Case mechanics failed | `mechanics` | hard, max | 0 | ticket 41: tiny-synthetic smoke |
| Replay problems | `replay` | hard, max | 0 | ticket 41: a broken replay scores nothing real |
| Requirement recall % | `recall` | soft, min | 80 | ticket 18 |
| Open Items caught % | `openItems` | soft, min | 70 | ticket 18 |
| Module set % | `modules` | soft, min | 80 | ticket 18 |
| Mapping Delivery class % | `mapping` | soft, min | 70 | ticket 18 |
| Regression: max drop in pts vs last `main` | `regression` | max | 5 | ticket 18 |

## Results

`results/<date>-<case>.md` (a second run that day gets `-2`, `-3`): verdict and failures, gates, soft metrics with last-`main` baseline and drop, mechanics, one match table each for Requirements, Open Items, Modules + mapping, extras, invented facts, Don't know → Open Item, problems, the spot-check box, and a `## Data` JSON block the next run reads for regression. Commit the result with the change it judged.

## Gate

Skill text change → `npm test` + `run --all` passes + maintainer reads the result, spot-checks ~10 matches, ticks the box, approves the merge to `main`. Pin-only bump → `npm test` only. Template look change → `npm test` + eyeball checklist below. After evals pass the first time: one real Engagement shadowed by the maintainer before team use.

## Eyeball checklist

Look is not auto-scored. Maintainer opens the outputs and ticks each line before merging a change to a template.

### BRD look

Build a preview of the `resolved` and `in-progress` fixtures (`engine/test/fixtures/brd/`, copy to a temp folder, run `node neome-studio/engine/cli.mjs build-brd <copy>/engagements/crm`), open `brd/preview.html`:

- [ ] Neome look: Schibsted Grotesk + JetBrains Mono load offline, Neome blue, orange accent, mono eyebrows, split rule
- [ ] "Working draft — not for circulation" shows on screen and on the printed cover and footer
- [ ] Sidebar: each entry opens its view; Module entries show Delivery chip + progress bar; Open Items count right
- [ ] Module view: filters (All / Must / Open scope / Has Open Item) work; acceptance folds open; "proposed, to confirm" and "In progress" chips readable
- [ ] Any OI link jumps to its row in the register; back button returns
- [ ] Delivery colours: Standard green, Configuration blue, Custom orange, Open dashed orange
- [ ] Diagrams: process (lanes, Module prefix in each box, diamonds, dotted labelled alternates, grey externals) and one status flow per Module; OI-dependent boxes dashed orange with OI ID; labels readable, not clipped, not uppercase; same look on screen and in print
- [ ] Across all Modules: topics in order (Access … Other), GEN cards + filters, N/A reason + Source, topic Open Items; no mapping card; not in the fit table
- [ ] Implementation plan (resolved fixture only): indicative header, weeks read right, Not yet placed list, no prices or calendar dates; total weeks metric on the summary; no plan entry in the in-progress fixture
- [ ] Script off: every section shows one after another, nothing missing
- [ ] Print (Cmd+P, A4): full linear document whatever is on screen; each section and Module on a new page; table headers repeat; no row split; footer Engagement · version · status · page x / y
- [ ] Release (`--mode release --summary "..."` twice, with an edit between): `brd/v2.html` cover + footer say `v2 · Draft for review`, no working-draft banner; Versions and sign-off lists v2 above v1 with grouped changes; two empty signature boxes (Name, Role, Signature, Date lines) print clearly on A4 with room to sign
- [ ] Sign-off (`--mode sign-off --signers ... --evidence SO-1` after a release): `brd/v<N>.html` says `Signed off`; signer names, roles, dates in both boxes; Evidence, Open at sign-off and Accepted on sign-off lists readable on screen and A4; chips read "proposed, accepted on sign-off"; next release shows the signed entry as `Signed off · superseded`

### Questionnaire look

Copy `engine/test/fixtures/questionnaire/after-questionnaire/` to a temp folder, run `node neome-studio/engine/cli.mjs export-questionnaire <copy>/engagements/crm QN-2026-10-29`, open `questionnaires/QN-2026-10-29.html` offline and print it; read the `.txt`:

- [ ] Neome look: Roboto or system font, slate title bar, blue section heads with Module key, white item cards
- [ ] Header: one named contact, From, About (Enterprise · Engagement), date, question count; "How to reply" box
- [ ] Items: number, OI ID, For: role, orange "asked before (QN-…)" on re-asked ones, one-line question, Suggested box, Reply row with tick boxes and a write-in line
- [ ] Print: A4, no card split across pages, footer `QN-… · page n / N`
- [ ] TXT pastes cleanly into WhatsApp: bold title and section heads, numbered items, no tables

### Prototype look

Build the fixture Prototype (`engine/test/fixtures/build-prototype/after-prototype/`, copy to a temp folder, run `node neome-studio/engine/cli.mjs build-prototype <copy>/engagements/crm QUO`), open `prototypes/QUO-quotations.html`, offline:

- [ ] Neome look: Roboto or system font, grey title bars, tile launcher (green data, blue report, grey Rules; other Modules greyed), tinted kanban columns, status as coloured text, right drawer with DETAILS / ACTIVITY, outlined fields, blue FAB
- [ ] Banner: PROTOTYPE, Enterprise, prefix, Requirement and Open Item counts, Neome App + Delivery marked indicative
- [ ] App: role switcher changes actions and notifications; each action moves the record; the next role gets a bot notification; a guarded action is disabled with its rule shown; Reset puts the sample data back
- [ ] Scenarios: each step shows actor, what they do, the screen, "This step proves" with acceptance criteria, OI callout, the next role's phone; coverage lists all ✓
- [ ] Mobile + trace: phones per key role (home, record, bot chat); bot chat marked guessed; clicking a Requirement lights up where it shows, its places jump to the right tab
- [ ] Chips readable: proposed (dashed), orange OI, sample on every record, guessed on bot chat; "show Requirement tags" puts Req chips on fields
