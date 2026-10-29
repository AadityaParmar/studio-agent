# How to run Neome Requirements Studio

Zero to Sign-off, step by step. Terms per [GLOSSARY.md](../GLOSSARY.md). Full detail: [README.md](../README.md).

```
 Inputs ─▶ ingest ─▶ review-draft ─▶ resolve-module ×N ─▶ build-brd ─▶ Sign-off ─▶ phase 2
              ▲                           │    ▲
              │                           ▼    │ (Module needs revisit)
              └──── ingest ◀── Enterprise answers ◀── Questionnaire / Prototype feedback

 /neome-studio:studio  ← between every step: "what's next?"
```

---

## 0. Setup (once)

1. **Git repo with a remote.** Skills pull, commit and push, so a plain folder fails.
   - Maintainer, first time: `git init`, add the GitHub remote, push.
   - Everyone else: `git clone <team-repo-url>`. Never copy the folder.
2. **Node 20+**: `node --version`.
3. **Git name**: `git config --global user.name "Your Name"` (claims and locks show it).
4. **Packages**: `npm ci` in the repo root.
5. **Open Claude Code** from the repo root: `claude`. Trust the folder.
6. **Check**: type `/neome-studio:` and the skills show.
7. **Run `/neome-studio:studio`**. All setup lines should be `ok`. It names the fix for any `miss`.

Claude Code may ask to run `node neome-studio/engine/cli.mjs …`. Allow it.

---

## 1. Drop Inputs

- Pick an Enterprise folder name, kebab-case: `harbor-tiles`.
- Put Inputs in `enterprises/harbor-tiles/inputs/`. Any file name: deck, RFP, call notes, transcript, WhatsApp export, spreadsheet.
- Confidential Inputs go in `enterprises/harbor-tiles/confidential/` (never pushed).

## 2. `/neome-studio:ingest`

- Give: Enterprise folder name + Engagement slug (kebab-case, no dates): `crm`.
- Creates: Enterprise glossary, Engagement map, one Source per Input (renamed `<SOURCE-ID>-<slug>.<ext>`).
- Drafts Modules, Requirements, Open Items. Every fact cites a Source or says "proposed, to confirm".
- Pushes.

## 3. New session → `/neome-studio:review-draft`

- Quizzes you on the draft, with a suggested answer each time:
  - confirm, merge, split or rename Modules
  - process and roles
  - Module order
  - Engagement-wide topics: Access, Localisation, Hosting, Migration, Training, Support, Other
  - plan skeleton
- Writes one confirmed Module ticket per Module.

## 4. `/neome-studio:studio`

Shows where things stand. Names the next Module.

## 5. `/neome-studio:resolve-module` (repeat per Module)

**One Module per session.** Live with the Enterprise if you can, or from Inputs.

1. Claims the Module (pushed, so colleagues see it).
2. Grills it until every topic is answered, N/A or an Open Item.
3. Writes the Module spec (13 sections, indicative Neome App + Delivery).
4. Builds the Prototype: `engagements/<slug>/prototypes/<PREFIX>-<slug>.html`.
5. Closes the Module. Open Items may stay open.

Back to step 4 for the next Module.

## 6. Open Items left? `/neome-studio:questionnaire`

- Asks: one named contact, which Modules.
- Writes `engagements/<slug>/questionnaires/QN-<date>.html` (print) and `.txt` (paste into WhatsApp / email).
- Send it to the Enterprise.

## 7. Reply comes back → `inputs/` → `/neome-studio:ingest`

- Drop the reply (any form) in `inputs/`, or paste it in the chat.
- Shows how it reads each answer, Open Item by Open Item. Nothing changes before you confirm.
- Answered Open Items close. Changed Modules get marked needs revisit.
- Run `resolve-module` on those (shorter pass, only what changed).

Repeat steps 5–7 until the Open Items are cleared. Prototype feedback follows the same path.

## 8. `/neome-studio:build-brd`

| Mode | When | Writes |
|---|---|---|
| preview (default) | Any time | `brd/preview.html`. Working draft, not for circulation. Unresolved Modules show "In progress". |
| release | Ready for Enterprise review | `brd/v<N>.html` + change log. Asks one summary line. Sets plan weeks if not set. |
| sign-off | After signed copy ingested | Stamps latest version as signed. Frozen after. |

## 9. Sign-off

1. Enterprise signs `brd/v<N>.html` (or approves in writing).
2. Drop the signed copy in `inputs/` → `/neome-studio:ingest` (becomes `SO-n` Source).
3. `/neome-studio:build-brd` → sign-off. Suggests the two signers; asks what it can't see.
4. Later changes → new release.

## 10. Phase 2

The BRD data file in `engagements/<slug>/_agent/` is the handoff to the Neome build.

---

## Where things live

```
enterprises/<ent>/
  inputs/              DROP Inputs here
  confidential/        DROP confidential Inputs here (never pushed)
  _agent/              skills only
  engagements/<slug>/
    brd/               VIEW: preview.html, v<N>.html
    prototypes/        VIEW: one per Module
    questionnaires/    VIEW: QN-<date>.html / .txt
    _agent/            skills only
```

## Rules

- Unsure → `/neome-studio:studio`.
- Touch only `inputs/` and `confidential/`. Never edit `_agent/` or views; skills rebuild them.
- One Module per session. `review-draft` wants a new session too.
- Never guess. A gap becomes an Open Item.
- Don't run git by hand while a skill runs.
- Neome App and Delivery are indicative only.

## If stuck

| Problem | Fix |
|---|---|
| Mermaid CLI missing / `node_modules` out of date | `npm ci`, run skill again |
| `mmdc-failed` | Run `build-brd` again. Twice → tell maintainer |
| Push rejected | Skill retries once. Still failing → fix network/access, or ask maintainer on conflict. Never force-push |
| Stale lock or claim | `/neome-studio:studio`, say yes to clear. Tell holder to pull |
| Skills not in slash menu | Open repo root, trust it, check `/plugin`, then `/reload-plugins` |
| Prototype missing for resolved Module | Next `resolve-module` pass rebuilds it |
