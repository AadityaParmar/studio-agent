# How to run Neome Requirements Studio

Zero to Sign-off, step by step. Terms per [GLOSSARY.md](../GLOSSARY.md). Full detail: [README.md](../README.md).

You run 6 skills. They call 5 building blocks. The engine (`node neome-studio/engine/cli.mjs`) does every check, structured write and render. Every skill ends by printing "Next session": up to 3 next steps.

```
 Inputs ─▶ inputs/ (+ confidential/)
             │
             ▼
 /studio ◀── any time: "what next?"  (read-only; may clear a stale lock)
             │
             ▼
 /ingest ─────────▶ Sources + draft Modules, Requirements, Open Items ──▶ enterprise-glossary
             │ (new session)
             ▼
 /review-draft ───▶ confirmed Modules, process, roles, topics, plan ─────▶ enterprise-glossary
             │
             ▼
 /resolve-module <PREFIX>   (×N, one Module per session)
   claim ─▶ grill-module ─▶ process ─▶ write-module-spec ─▶ neome-mapping (§12)
         ─▶ build-prototype ─▶ shared edits ─▶ close
             │                                   │ Enterprise Open Items
             │                                   ▼
             │                            /questionnaire ─▶ QN-n .html / .txt
             │                                   │ reply
             │                                   ▼
             │◀── needs revisit ◀──── /ingest (reads reply, closes Open Items)
             ▼
 /build-brd ──────▶ preview ─▶ release v<N> ─▶ sign-off v<N> ─────────────▶ enterprise-glossary (agree)
             │ comments / signed copy / Prototype feedback
             └──────▶ inputs/ ─▶ /ingest  (loop)  ─▶ … ─▶ phase 2
```

---

## 0. Setup (once)

1. **Git repo with a remote.** Skills pull, commit and push, so a plain folder fails.
   - Maintainer, first time: `git init`, add the GitHub remote, push.
   - Everyone else: `git clone <team-repo-url>`. Never copy the folder.
2. **Node 20+**: `node --version`.
3. **Git name**: `git config --global user.name "Your Name"` (claims and locks show it).
4. **Packages**: `npm ci` in the repo root.
5. **Open Claude Code** from the repo root: `claude`. Trust the folder. Allow `node neome-studio/engine/cli.mjs …` when asked.
6. **Check**: type `/neome-studio:` and the skills show. Not there? Inside Claude Code:
   ```
   /plugin marketplace add "<repo-root-path>"
   /plugin install neome-studio@neome
   /reload-plugins
   ```
7. **Run `/neome-studio:studio`**. All setup lines `ok`. It names the fix for any `miss`.

### Other AI tools (Codex, Gemini CLI, Cursor, Copilot, OpenCode…)

Skills are plain `SKILL.md` folders; the engine is plain Node. Do steps 1–4, then from repo root:

1. **Link the skills** (a link, not a copy, so `git pull` updates it): `ln -s ../neome-studio/skills .agents/skills`. Tool reads only its own folder → link that instead: Gemini `.gemini/skills`, Cursor `.cursor/skills`, Copilot `.github/skills`, OpenCode `.opencode/skills`, Windsurf `.windsurf/skills`. Folder already there → `rmdir` it first. Windows: `mklink /D .agents\skills ..\neome-studio\skills`.
2. **Give it the rules**: `ln -s CLAUDE.md AGENTS.md` (Gemini: `GEMINI.md`).
3. **Run skills by name**, no prefix: `/studio` (Codex: `$studio`). Below, `/neome-studio:<skill>` = that skill. Always start the six by hand; some tools auto-start skills.
4. **Check**: run `studio`. No skill support at all → "read `neome-studio/skills/studio/SKILL.md` and follow it".

---

## 1. Drop Inputs

- Enterprise folder, kebab-case: `enterprises/harbor-tiles/inputs/`. Any file: deck, RFP, call notes, transcript, WhatsApp export, spreadsheet.
- Confidential → `enterprises/harbor-tiles/confidential/` (never pushed).

## 2. `/neome-studio:ingest`

- Give: Enterprise folder + Engagement slug (kebab-case, no dates): `crm`. First run creates the Enterprise glossary and Engagement.
- Each new Input → Source: ID by type (CE, RFP, DK, SS, WA, FRM, PF, QA, SO…), file renamed `<ID>-<slug>.<ext>`, text copy in `_agent/sources/`.
- Drafts from Inputs only, exhaustively:
  - Modules, in the Enterprise's words
  - Requirements (Priority `TBC`, Scope `Open`)
  - Engagement-wide Requirements in `general.md`
  - an Open Item for every gap or conflict
- Terms → Enterprise glossary.
- Later runs draft only into Modules still in draft. New facts about confirmed Modules → Open Items.

## 3. New session → `/neome-studio:review-draft`

Quizzes you in rounds of up to 5, each item with a suggested answer:

1. Module set: confirm, rename, merge, split, missing
2. Process and roles
3. Module order (blocked by)
4. Engagement-wide topics: Access, Localisation, Hosting, Migration, Training, Support, Other
5. Plan skeleton (never weeks)

Done when no Module is left in draft.

## 4. `/neome-studio:resolve-module` (repeat per Module)

**One Module per session.** Mode: live with the Enterprise, or from Inputs. `/neome-studio:studio` names the next Module (revisits first).

1. **Claim** the Module (pushed, so colleagues see it).
2. **Grill** (`grill-module`): 11 topics, each answered, N/A or an Open Item. Facts from Inputs first, catalog as the suggested answer, then always-ask items (KPIs, roles, approvers, statuses, volumes, integrations, priority). Requirements are confirmed in one table at the end.
3. **Process**: this Module's steps in `process.md`.
4. **Spec** (`write-module-spec`): 13 sections. Anything that needs Sign-off becomes a Requirement. Section 12 comes from `neome-mapping`: indicative Neome App and Delivery (Standard / Configuration / Custom module).
5. **Prototype** (`build-prototype`): `engagements/<slug>/prototypes/<PREFIX>-<slug>.html`, with sample rows and scenarios.
6. **Shared edits** (under lock): Engagement-wide Requirements, plan, other Modules' process, rename / merge / split.
7. **Close**. Open Items may stay open.

Stopped early → work is pushed and the claim kept. Run it again to resume.

## 5. Open Items left? `/neome-studio:questionnaire`

- Asks: one named contact + role, and which Modules.
- Writes `engagements/<slug>/questionnaires/QN-<date>.html` (print) and `.txt` (WhatsApp / email). Send it.

## 6. Reply or feedback → `inputs/` → `/neome-studio:ingest`

- Drop the reply (any form) in `inputs/`, or paste it in the chat. Prototype feedback works the same way.
- It shows how it reads each answer, Open Item by Open Item. Nothing changes until you confirm.
- Answered Open Items close. Affected Modules are marked needs revisit → `resolve-module` again (a shorter pass, only what changed).

Repeat steps 4–6 until the Open Items are cleared.

## 7. `/neome-studio:build-brd`

| Mode | When | Writes |
|---|---|---|
| preview (default) | Any time | `brd/preview.html`. Working draft; unresolved Modules show "In progress". |
| release | Ready for Enterprise review | `brd/v<N>.html` + change log. Asks one summary line; weeks only if you give them. |
| sign-off | Signed copy ingested | Stamps latest `v<N>` with two signers + evidence. Frozen after. Glossary terms shown become agreed. |

## 8. Sign-off

1. Enterprise signs `brd/v<N>.html` (or approves in writing).
2. Signed copy → `inputs/` → `/neome-studio:ingest` (becomes the `SO-n` Source).
3. `/neome-studio:build-brd` sign-off. It suggests the two signers and asks for what it can't see.
4. Later changes → a new release.

## 9. Phase 2

The BRD data file in `engagements/<slug>/_agent/` is the handoff to the Neome build.

---

## Where things live

```
enterprises/<ent>/
  inputs/              DROP Inputs here
  confidential/        DROP confidential Inputs here (never pushed)
  _agent/              skills only (Sources, GLOSSARY.md)
  engagements/<slug>/
    brd/               VIEW: preview.html, v<N>.html
    prototypes/        VIEW: one per Module
    questionnaires/    VIEW: QN-<date>.html / .txt
    _agent/            skills only (map, Modules, Open Items, process, plan)
```

## Rules

- Unsure → `/neome-studio:studio`.
- Touch only `inputs/` and `confidential/`. Never edit `_agent/` or views; skills rebuild them.
- One Module per session. `review-draft` needs a new session too.
- Never guess. Every fact cites a Source or says "proposed, to confirm". A gap becomes an Open Item.
- Don't run git by hand while a skill runs.
- Neome App and Delivery are indicative only.

## If stuck

| Problem | Fix |
|---|---|
| Mermaid CLI missing / `node_modules` out of date | `npm ci`, run the skill again |
| `mmdc-failed` | Run `build-brd` again. Fails twice → tell the maintainer |
| Push rejected | The skill retries once. Still failing → fix network/access, or ask the maintainer about the conflict. Never force-push |
| Lock held by someone else | `ingest`, `review-draft`, `build-brd` wait for it; `resolve-module`, `questionnaire` can run |
| Stale lock or claim | `/neome-studio:studio`, say yes to clear. Tell the holder to pull |
| Skills not in slash menu | Open the repo root, trust it, check `/plugin`, then `/reload-plugins` |
| Prototype missing for a resolved Module | The next `resolve-module` pass rebuilds it |
