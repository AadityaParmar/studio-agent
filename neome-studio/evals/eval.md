# eval (maintainer only)

## How to talk

- Simple English. No fancy words. Short.
- Be extremely concise. Sacrifice grammar for concision.

Driver prompt for the plugin maintainer. Run the Eval cases on the current branch, then help the maintainer judge the judge. Not a Consultant skill; `studio` never names it. Run before merging any skill text change to `main`, and on demand.

`TOOL` = `node neome-studio/evals/run.mjs`, from the repo root. Its header lists every command and output line; [README.md](README.md) has the scorecard and the Thresholds table.

## 1. Start

1. `git status`: note the branch. Uncommitted skill edits are fine (the replay copies the working tree); say they will be judged as they are.
2. `npm test` must pass. Fails → stop, show it.
3. `TOOL check` must print `ok` per case.

Done when the tests pass and every case checks `ok`.

## 2. Run

`TOOL run --all` (or the cases the maintainer names). Long: every skill session runs headless with a simulated client. Let it finish; relay `step |` problem lines as they come.

- `problem | … | claude did not run …` → Claude Code missing or logged out; stop, tell the maintainer.
- `problem | … | judge …` → the judge skipped or repeated items; re-run only the judge and score on that workspace: `TOOL judge <work>` then `TOOL score <work>`.

Done when the `done` line prints and every case has a `result` line.

## 3. Read each result

Open each `results/<date>-<case>.md`. Show the maintainer: verdict, failures, the soft metrics table, mechanics that failed.

Then the spot-check: pick ~10 rows across the match tables (some match, some missed, some extras, every Don't know with no Open Item, every invented fact). For each, read the golden statement, the replay's Requirement or Open Item in `<work>/a/enterprises/…/_agent/`, and the cited Source text copy; say whether the judge was right, one line each. Failures that trace to a step: quote the lines from `<work>/run/transcript.md`.

Done when the maintainer has ~10 checked rows with your one-line verdicts.

## 4. Report

One line per case: verdict, recall / Open Items / Module set / mapping, failed gates, judge errors found. Ask the maintainer to tick the spot-check box (name, wrong rows) in each result file. Commit the result files with the change they judged: `git add neome-studio/evals/results/`, `eval: <case> <date> <pass|fail>`. Merge to `main` only on pass and the maintainer's approval.

Done when the report is given and the results are committed.
