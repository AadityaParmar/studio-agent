# refine-template-bank (maintainer only)

Driver prompt for the plugin maintainer's main Claude Code session (in T3 Code). Builds and refines the Template bank (`neome-studio/reference/template-bank/`) from Neome Build JSON. Same tool for the first mining run (empty Template bank) and every later refine. Not a Consultant skill; `studio` never names it. Run by hand when the maintainer drops new or updated Neome Build JSON into the raw dir. Spec: Template bank §3, §7 (`.scratch/template-bank/spec.md`, later `docs/v2/history/`). Terms per `GLOSSARY.md` § Template bank.

`TOOL` = `node neome-studio/maintainer/refine-template-bank.mjs`, from the repo root. Its header lists every command and output line. Raw dir = `.scratch/template-bank/raw/` (gitignored; `--raw` to change; layout in `template-bank/refine-state.mjs`). YAML shapes: `template-bank/prompts/shapes.md`. Child prompts: `template-bank/prompts/{tag,cluster,review}.md`, filled by `TOOL prompt`.

Stages: status → prepare (digest + scrub) → tag → cluster → review → decide → apply → report → commit. You (main session) run the script steps and launch the model stages as `delegate_task` children.

## Never

- Never read raw Neome Build JSON, `<raw>/digests/` (unscrubbed), `<raw>/builds.json` or `<raw>/scrub/*.txt`. You read script output, child hand-backs and `report.md` only. Open a tag sheet or draft only when the maintainer asks to see one.
- Never let any model see a Build before `prepare` printed `scrub | NB-NN | … clean` for it. Scrub fail = hard stop, never a judgement call.
- Never hand-edit the Template bank, `changes.yaml`, `verdicts.yaml` or `decisions.json`. Children write their files; `TOOL answer` records the maintainer.
- Never merge, never push. Never `--force`.

## 0. Start

1. `git status`: the Template bank folder must be clean; else stop and tell the maintainer.
2. `git switch main && git pull --rebase --autostash`; fails → stop, tell the maintainer.
3. `orchestrator_capabilities` once (search `GLM` too, to learn the ZCode model IDs for the fallback).

Done when on an up-to-date `main` with providers known.

## 1. Status

`TOOL status`. One `build` line per Build: `new`, `updated` (JSON version differs from the tagged one), `current`, `removed` (no JSON any more). Nothing new, updated or removed → tell the maintainer; stop unless they ask for a full re-cluster (`--full`).

`removed` → ask the maintainer to confirm: its `seenIn` rows go, and entries left with none retire. No → they put the JSON back; stop.

## 2. Prepare

`TOOL prepare` (`--full` when the maintainer asks to re-cluster from all tag sheets).

- Exit 3, `words | NB-NN | <path> | seeded`: first run for that Build. Ask the maintainer to open the list, add client, people and place names, save. Then re-run prepare. You never read or write the list.
- Exit 3, `words | NB-NN | <path> | not checked`: the list has no `# checked` line. Ask the maintainer to finish the list and add a line `# checked`. Then re-run prepare.
- Exit 1, `leak` / `stop` lines: hard stop. Show the lines (they name a word by number, never the word). The maintainer fixes the word list or digest; re-run prepare.
- Exit 0: note the `run` id and the `tag` lines.

Done when prepare printed a `run` line.

## 3. Tag (one child per Build, in parallel)

For every `tag | NB-NN` line without `sheets ready`: `TOOL prompt tag NB-NN --run <run>` → its output is the child task. Launch all at once:

```
delegate_task(task: <prompt output>, title: "Template bank tag NB-NN", role: "general", isolation: "shared", mode: "async",
  target: {providerInstanceId: "claudeAgent_claude_sales", model: "claude-sonnet-5-5", options: {effort: "medium"}})
```

`isolation: "shared"` always: children must see the gitignored raw dir. Follow each child's `next`; do not poll. When one is done: `TOOL validate-tags NB-NN --run <run>`. Errors → send the error lines to a new tag child for that Build with the same prompt plus "Fix these: …"; repeat until `ok`. Then log tokens (section 8).

Done when `TOOL validate-tags --run <run>` prints `ok` for every Build of the run.

No `tag` lines (only `removed` Builds, or `--full` with nothing new): skip to cluster.

## 4. Cluster (one child)

`TOOL prompt cluster --run <run>` → task. `delegate_task`, same as tag but `title: "Template bank cluster <run>"`, `model: "claude-opus-5-5"`, `options: {effort: "high"}`, `mode: "async"`.

When done: `TOOL validate-changes --run <run>` must print `ok` (it also dry-runs apply and the Template bank check). Errors → new cluster child with the errors appended; repeat. Log tokens.

## 5. Review (one fresh child)

`TOOL prompt review --run <run>` → task. New `delegate_task` (never the cluster thread): `title: "Template bank review <run>"`, `role: "review"`, `model: "claude-opus-5-5"`, `options: {effort: "high"}`. When done, log tokens.

## 6. Decide, then ask only what the rule says

`TOOL decide --run <run>`. Rule (ticket 09): `add` / `enhance` / `rename` that the reviewer passes (apply, backed, agrees) → `auto`. Every `split` / `merge` / `retire`, and anything the reviewer is unsure of, disagrees with or would drop → `ask`.

For each `ask` line: ask the maintainer the question, in plain short words, one at a time, with the reviewer's why. Record: `TOOL answer "<ref>" apply|drop --run <run> [--note "<their reason>"]`. Never answer for them.

Done when `decide` / `answer` leave no `ask`.

## 7. Apply

`TOOL apply --run <run>`. It drops old `seenIn` rows of this run's Builds, applies approved changes, follows references, retires entries at zero `seenIn`, appends `CHANGELOG.md` lines (with `replacedBy` for split / merge / rename), then runs the Template bank check with the scrub words, all on a copy. The real Template bank changes only when the copy passes. `--full` run: if entries would retire because the cluster did not list them again, apply prints `retire? | <ID>` lines and stops; show the maintainer the list, and only on their yes re-run with `--confirm-retire`.

`error` lines → Template bank unchanged. A broken reference or empty Template `core` after a dropped change → tell the maintainer; either answer the linked change differently (`answer`) or re-run cluster with the error. Never patch files.

## 8. Tokens (after every child)

`TOOL tokens <tag|cluster|review> <NB-NN|all> --run <run> --provider <id> --model <id> [--in <n> --out <n>]`. Give `--in` / `--out` when the child's result reports token use; else leave them out (the script estimates from file sizes, marked `estimate`). No cap; log every attempt, retries and fallbacks too.

## 9. Report and commit

1. `TOOL report --run <run>` → `runs/<run>/report.md`: each applied change + reason + who decided, retired at zero, `seenIn` rows replaced, not applied, tokens.
2. `TOOL commit --run <run>`: runs `check` (scrub words from `<raw>/scrub/*.txt`) and the leak check on report and commit message; any fail → nothing committed (fix, re-run). Then creates branch `template-bank-refine-<run>`, copies the report to `reference/template-bank/reports/<run>.md`, stages the Template bank folder only, commits `template-bank: refine <run> (<n> changes)`.
3. `npm test` on the branch must pass. `TOOL check` runs the same Template bank check with the scrub words any time.

Tell the maintainer: branch, commit, counts per change kind, asks and their answers, retired at zero, tokens total, test result, and the report path. They skim the report and merge. Revert = git.

Done when the commit is on the branch and the maintainer has the summary.

## Providers and fallback

| Stage | Claude-sales (first) | Default Claude (limit hit) | ZCode (also out) |
|---|---|---|---|
| tag | `claudeAgent_claude_sales`, `claude-sonnet-5-5`, effort medium | `claudeAgent`, same model + effort | `acpRegistry_local_acp`, GLM-5.3-Flash |
| cluster | `claudeAgent_claude_sales`, `claude-opus-5-5`, effort high | `claudeAgent`, same | `acpRegistry_local_acp`, GLM-5.3 |
| review | `claudeAgent_claude_sales`, `claude-opus-5-5`, effort high | `claudeAgent`, same | `acpRegistry_local_acp`, GLM-5.3 |

Move down a row only when the child fails on a usage or rate limit; tell the maintainer each time. Any other failure: retry once on the same provider, then stop and tell the maintainer. GLM model IDs: from `orchestrator_capabilities` (search `GLM`); not found → stop and tell the maintainer, never pick another model. The same prompt text works for every provider.

## Gate

`npm test` must pass on the branch (Template bank checks, incl. the `template-hr-small` eval fixture). `node neome-studio/evals/run.mjs run --all` only if this run changed the Template bank format (it does not: the format lives in `reference/template-bank/README.md` and `engine/template-bank.mjs`).
