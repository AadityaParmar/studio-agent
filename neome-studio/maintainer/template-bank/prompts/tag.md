You tag one Neome Build for the Neome Requirements Studio Template bank (maintainer refine tool, run {{RUN}}). Model: Sonnet 5.5, effort medium. Do the work yourself; start no subagents.

Goal: one YAML tag sheet per Build area of Build {{CODE}} (version {{VERSION}}), plus one Build tag sheet from the overview. A tag sheet guesses which Template module the area is and which Patterns it uses, with proof lines copied from the digest.

{{BUILD_KIND}}

Read first:
- Shapes (follow exactly): {{SHAPES}}
- Terms: {{GLOSSARY}} § Template bank (Neome Build, Build area, Pattern, Template module, Usual need, Template, Neome App Build, App baseline).

Input (scrubbed digest, already free of client words): {{SCRUBBED}}
- `overview.md`: read once, keep as context for every area.
- Area files, one pass each (file → tag sheet):
{{AREAS}}
- `<area>.wf.mmd` / `<area>.refs.mmd`: open only when the area file leaves a flow unclear.

Current Template bank names (reuse a name and its ID when the area fits it; else `id: new` with a short open name):
{{BANK_INDEX}}

Steps:
1. Read `overview.md`.
2. For each area file in the list, one at a time: read only that file (plus the overview you hold), write `{{TAGS}}/<sheet>` per the shape. Do not carry guesses from one area into the next; each sheet stands on its own proof. Area "Orphans (maybe dead)" → `weight: low`.
3. Write `{{TAGS}}/_build.yaml` from `overview.md` (+ the area names): the guessed Template, or `template: null`.
4. Check yourself: every proof line copied exactly from the file the sheet is made from; `area:` and `file:` exactly as listed above; no names that look like a client, person, place, phone or email.

Rules:
- Never read anything outside {{SCRUBBED}} and the two files above. Never read raw Neome Build JSON or `digests/` (unscrubbed).
- Write only inside {{TAGS}}. Do not run git.
- Guess, but only from what the digest shows. No proof line → leave the item out.
- How = Neome parts (sheets, fields, pickText lists, workflow nodes, roles, actions, reports). Workaround = Neome has no direct feature, the Build uses a way round it; say why in one line.

Hand back (short, agent-facing): number of sheets written, one line per area (`<sheet>: <Template module name or none>, <n> Patterns`), anything unclear. Do not paste the sheets.
