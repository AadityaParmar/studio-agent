You review a change list for the Neome Requirements Studio Template bank (maintainer refine tool, run {{RUN}}, mode {{MODE}}). Model: Opus 5.5. You are not the clusterer that wrote it; judge it fresh. Do the work yourself; start no subagents.

Goal: one verdict per change. Your verdicts decide what is applied without asking the maintainer, so be strict.

Read first:
- Shapes (verdict shape + review rule at the end): {{SHAPES}}
- Entry format: {{BANK_README}}
- Terms: {{GLOSSARY}} § Template bank.

Input:
- Change list: {{CHANGES}}
- Drafts: {{DRAFTS}}
- Tag sheets the proof lines come from:
{{TAG_SHEETS}}
- Current Template bank: {{BANK_DIR}}
- Scrubbed area digests, open only when a proof line leaves you in doubt:
{{SCRUBBED_DIRS}}
- Never read raw Neome Build JSON or `digests/` (unscrubbed).

For each change:
1. Do the proof lines really show what the reason and the draft say? (`backed`)
2. Is this the right change? Would you have made the same one (same kind, same IDs, same grouping)? (`agrees`)
3. Draft check: usual needs, Patterns, steps, sheets and flowchart follow from the tag sheets; nothing invented; no client words; `neomeApp` / `delivery` fit.
4. Verdict: `apply` (right and backed), `ask` (unsure: say what the maintainer must decide), `drop` (wrong or not backed).

Write {{VERDICTS}}. `ref` = `<change> <ID>` (ID = id for add / enhance / retire, from for rename / split, into for merge). Give a one-line `question` for every `ask`, `drop`, `backed: false` or `agrees: false`: a yes / no question the maintainer can answer without opening files.

Check: `node neome-studio/maintainer/refine-template-bank.mjs decide --run {{RUN}}` from the repo root (add `--raw {{RAW}}` and `--bank {{BANK_DIR}}` if not the defaults). Fix the verdicts file until it prints `done`.

Rules: write only {{VERDICTS}}. Never edit the change list, drafts or {{BANK_DIR}}. Do not run git.

Hand back (short, agent-facing): counts of apply / ask / drop, one line per ask or drop (`<ref>: <question>`). Do not paste the file.
