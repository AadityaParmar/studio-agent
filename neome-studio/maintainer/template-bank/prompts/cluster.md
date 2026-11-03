You cluster tag sheets into a change list for the Neome Requirements Studio Template bank (maintainer refine tool, run {{RUN}}, mode {{MODE}}). Model: Opus 5.5, effort high. Do the work yourself; start no subagents.

Goal: a change list (`add`, `enhance`, `split`, `merge`, `rename`, `retire`, each with reason + proof lines) and one draft entry file per new or rewritten entry, so the Template bank says how Neomenta usually builds things, learnt from the Neome Builds' tag sheets.

Read first:
- Shapes (follow exactly; it also says what `apply` does on its own): {{SHAPES}}
- Entry format: {{BANK_README}}
- Terms: {{GLOSSARY}} § Template bank.

Builds in this run: 
{{BUILDS}}

Input (read all; never read digests, raw JSON or anything else under the raw dir):
- Tag sheets of {{CLUSTER_BUILDS}}:
{{TAG_SHEETS}}
- Current Template bank entries: {{BANK_DIR}}/patterns/, template-modules/, templates/ and CHANGELOG.md. Index:
{{BANK_INDEX}}

Mode:
- incremental: the tag sheets above are only this run's new / updated Builds. The current entries hold what older Builds showed; keep it. `apply` first drops every old `seenIn` row of this run's Builds, so list again (as `enhance` or in `add`) every entry these Builds still show.
- full: the tag sheets above are every Build. `apply` drops every `seenIn` row first; every entry you keep needs its rows again (`enhance` with `seenIn`, no draft needed when only evidence changes), or it retires at zero.

Steps:
1. Group tag sheet items across Builds: same task done the same way = one Pattern; same Module shape = one Template module; Build tag sheets with a similar business = one Template. Weight count of Builds; `weight: low` items count less. One Build is enough for an entry.
2. Compare each group with the current entries: same thing → `enhance` (new rows, new usual needs / Patterns / steps); one entry covering two things → `split`; two entries that are one → `merge` (keep the clearer ID); clearer name needed → `rename`; nothing backs it any more → `retire` (never for age).
3. Write drafts to {{DRAFTS}}/<ID>.md for every `add`, every `split` part, and every `enhance` / `merge` / `rename` that changes content. Full entry in the format of {{BANK_README}}: all front matter keys, all body sections, a Mermaid flowchart. Template modules: `neomeApp` = a slug from `neome-studio/reference/neome-app-catalog-slugs.json` or `none`; `delivery` = standard | configuration | custom (hint only). Template `modules.core` / `optional` = TMOD- IDs that exist after this run.
4. Write {{CHANGES}}. Each change: one-line reason, proof rows quoted exactly from the tag sheets.
5. Check: `node neome-studio/maintainer/refine-template-bank.mjs validate-changes --run {{RUN}}` from the repo root (add `--raw {{RAW}}` and `--bank {{BANK_DIR}}` if not the defaults). Fix until it prints `ok`. It also dry-runs apply + the Template bank check.

Rules:
- IDs: prefix + slug (`PAT-approval-by-status`), lowercase words joined by `-`, no sequence numbers. Never reuse an ID that is or was in the Template bank. Retired / replaced, never reuse: {{USED_IDS}}.
- Usual needs are not Requirements: plain "usually has to …" lines, no priority, no acceptance criteria.
- No client words; Build codes only as NB-NN. Keep `«…»` tokens out of entries (write around them).
- Write only {{CHANGES}} and inside {{DRAFTS}}. Never edit {{BANK_DIR}}. Do not run git.

Hand back (short, agent-facing): counts per change kind, one line per change (`<change> <IDs>: <reason>`), anything you were unsure about. Do not paste drafts.
