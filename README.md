# Neome Requirements Studio

A Claude Code plugin (`neome-studio`) for Neome Consultants. You drop an Enterprise's Inputs in a folder. The skills turn them into Modules, Requirements and Open Items, then Module specs and Prototypes, then a BRD the Enterprise signs off. The BRD data file is the handoff to phase 2 (the Neome build).

Terms (Enterprise, Engagement, Module, Requirement, Open Item, Input, Source, BRD, Prototype, Questionnaire…) mean exactly what [GLOSSARY.md](GLOSSARY.md) says. Plugin maintainer? Read [neome-studio/README.md](neome-studio/README.md).

---

## Setup checklist

Some terminal comfort needed. No setup script: tick each line.

- [ ] **Claude Code** installed and signed in.
- [ ] **Node LTS** (20 or later): `node --version`.
- [ ] **git** installed, and your name set once: `git config --global user.name "Your Name"`. Claims and locks show this name.
- [ ] **GitHub access** to the team repo. Ask the maintainer.
- [ ] **Clone** the team repo: `git clone <team-repo-url>`. Clone it; never copy the folder (skills need the git remote).
- [ ] **`npm ci`** in the repo root. Installs the pinned Mermaid CLI (BRD diagrams) and the engine's packages.
- [ ] **Open the repo root in Claude Code** (`claude` from the repo root).
- [ ] **Trust the folder** when Claude Code asks. This registers the `neome` marketplace and turns on `neome-studio`. Check: type `/neome-studio:` and the skills show.
- [ ] **Run `/neome-studio:studio`.** It checks git remote, `git user.name`, `npm ci` done, Mermaid CLI pin, plugin enabled, and says the fix for each.

Claude Code may ask before it runs `node neome-studio/engine/cli.mjs …`. That is the studio engine; skills call it to read and write files the same way every time. Allow it.

### Updates

Plugin updates come with the repo. Every skill you run pulls first, so you always have the team version. No separate install or update step. New skill text loads in your next session (or run `/reload-plugins`). If `studio` says `node_modules` is out of date after a pull, run `npm ci` again.

---

## First run

Use your real Inputs. No demo Enterprise.

1. Open the repo in Claude Code. Run `/neome-studio:studio` (checks setup).
2. Pick an Enterprise folder name, kebab-case (for example `harbor-tiles`). Create `enterprises/<ent>/inputs/` and drop the Inputs there, any file name. Confidential ones go in `enterprises/<ent>/confidential/` (never pushed). Same Enterprise later? Same folder.
3. Run `/neome-studio:ingest`. Give the Enterprise folder name and an Engagement slug (kebab-case, no dates, for example `crm`). It creates the Enterprise glossary, the Engagement map, one Source per Input (renamed to `<SOURCE-ID>-<slug>.<ext>`) and draft Modules, Requirements and Open Items. Then it pushes.
4. Start a **new session**. Run `/neome-studio:review-draft`.
5. Run `/neome-studio:studio`. It tells you which Module to take with `/neome-studio:resolve-module`.

---

## The cycle at a glance

```
 Inputs ─▶ ingest ─▶ review-draft ─▶ resolve-module ×N ─▶ build-brd ─▶ Sign-off ─▶ phase 2
              ▲                           │    ▲
              │                           ▼    │ (Module needs revisit)
              └──── ingest ◀── Enterprise answers ◀── Questionnaire / Prototype feedback

 /neome-studio:studio  ← between every step: "what's next?"
```

1. **Start:** `ingest` the first Inputs.
2. **Confirm the draft:** `review-draft`, in a new session.
3. **Work the Modules:** `resolve-module`, one Module per session.
4. **Chase answers:** `questionnaire` goes out; the reply comes back through `ingest`.
5. **Publish:** `build-brd`. Preview any time, release a BRD version for review, then Sign-off.

Unsure at any point? Run `/neome-studio:studio`.

---

## Skills you run

Six skills. Each one pulls at start and commits and pushes at end. You never type git.

### `/neome-studio:studio`

- **When:** unsure what next, or back on an Engagement.
- **Does:** checks setup, then shows where things stand: next Modules (revisits first), who holds a claim or the Engagement lock, Inputs waiting, Open Items, BRD readiness. Names the next skill.
- **Writes:** nothing. One exception: it clears a stale lock or claim after you say yes.

### `/neome-studio:ingest`

- **When:** start of an Engagement, and every time a new Input arrives: deck, RFP, call notes, transcript, WhatsApp export, spreadsheet, Questionnaire reply, Prototype feedback, signed copy of the BRD.
- **First run:** creates the Enterprise and Engagement folders, the Enterprise glossary and the Engagement map.
- **Every run:** registers each Input as a Source with an ID and drafts Modules, Requirements and Open Items. Every fact cites a Source or is marked "proposed, to confirm". Gaps become Open Items.
- **Questionnaire reply:** reply in any form → drop it in `inputs/` (or paste it in the chat) → `/neome-studio:ingest` → confirm the match list. It shows how it reads each answer, Open Item by Open Item. Nothing changes before you confirm. Then answered Open Items close, and Modules the answers change are marked needs revisit.

### `/neome-studio:review-draft`

- **When:** once after the first `ingest`, in a **new session**. Again if a later `ingest` adds Modules.
- **Does:** quizzes you on the draft, with a suggested answer each time: confirm, merge, split or rename Modules; process and roles; Module order; Engagement-wide topics (Access, Localisation, Hosting, Migration, Training, Support, Other); plan skeleton.
- **Writes:** one confirmed Module ticket per Module on the Engagement map.

### `/neome-studio:resolve-module`

- **When:** once per Module, **one Module per session**. Live with the Enterprise if you can, or from Inputs.
- **Does:** claims the Module first (pushed, so colleagues see it). Then grills it, writes the Module spec with an indicative Neome App and Delivery, and builds its Prototype. Closes the Module when spec and Prototype exist; Open Items may stay open.
- **Revisit:** a Module marked needs revisit gets a shorter pass, only on what changed.

### `/neome-studio:questionnaire`

- **When:** the Enterprise can't answer live, or Open Items pile up.
- **Does:** asks you who it goes to (one named contact) and which Modules. Exports the open Enterprise Open Items, each with a suggested answer, as `questionnaires/QN-<date>.html` (print) and `.txt` (paste into WhatsApp or email).
- **Answers:** come back as an Input. Drop the reply in `inputs/`, then `/neome-studio:ingest`.

### `/neome-studio:build-brd`

Three modes:

- **preview** (default): any time. Writes `brd/preview.html`, a working draft, not for circulation. Modules not resolved yet show "In progress".
- **release**: makes the next BRD version `brd/v<N>.html` with a change log, for the Enterprise to review. Asks you for one summary line. No plan weeks set yet → asks if you want to set them (plan weeks are set only here).
- **sign-off**: stamps the latest BRD version as signed. Needs the signed copy (or written approval) ingested first, as an `SO-n` Source. Suggests the two signers from it; asks what it doesn't show. After Sign-off that version never changes; later changes go into a new release.

---

## Where things live

You touch only the two drop folders and read the three view folders. Never edit `_agent/` or the views: skills own them, and views rebuild from `_agent/`.

```
enterprises/<ent>/
  inputs/              DROP Inputs here (any name; ingest renames to <SOURCE-ID>-<slug>.<ext>)
  confidential/        DROP confidential Inputs here (never pushed)
  _agent/              skills only: Enterprise glossary, Source register, text copies
  engagements/<slug>/
    brd/               VIEW: preview.html (working draft, not for circulation)
                             v<N>.html (send / print; signature boxes)
    prototypes/        VIEW: <PREFIX>-<slug>.html, one per Module
    questionnaires/    VIEW: QN-<date>.html (print), QN-<date>.txt (paste)
    _agent/            skills only: map, process, Open Items, Module specs, BRD data file
```

Replies, Prototype feedback and signed copies go back into `inputs/`, then `/neome-studio:ingest`.

---

## Rules of thumb

- Start with `/neome-studio:studio` when unsure.
- One Module per session. `review-draft` wants a new session too.
- Never fill a gap with a guess. Make it an Open Item.
- Every Requirement cites a Source, or says "proposed, to confirm".
- Skills own git. Don't commit, pull or push by hand while a skill runs.
- Neome App and Delivery are indicative only. The build mapping happens in phase 2.
- Out of scope: pricing, RFP-response proposals, Neome build configuration.

---

## Troubleshooting

**Mermaid CLI missing or wrong version** (`build-brd` or `studio` says so), or `node_modules` out of date: run `npm ci` in the repo root, then run the skill again.

**`mmdc-failed`** (diagram tool could not draw): run `build-brd` again. Fails twice → send the message to the maintainer.

**Push rejected.** The skill pulls and pushes once more by itself. Still rejected, or the pull hits a conflict → it stops and says so. Your work stays committed on your machine. Never force-push.
- No network, VPN or GitHub access → fix it, run the skill again.
- Conflict → ask the maintainer.
- On a Module claim (`resolve-module`) → the skill handles it. If a colleague claimed the Module first, it says so and offers the next one. Nothing is lost.

**Stale lock.** `ingest`, `review-draft` and `build-brd` lock the Engagement while they run. A crashed session can leave the lock behind. Run `/neome-studio:studio`: it shows who, which skill, since when and how old. It clears the lock (or a stale Module claim) only after you say yes. Then tell the holder to pull before any skill. Lock held by a colleague still working → wait. `resolve-module` and `questionnaire` can still run.

**Skills not in the slash menu.** Open the repo root (not a subfolder) in Claude Code and trust it. In `/plugin`, check `neome-studio` is enabled. Then `/reload-plugins` or a new session.

**"Start a new session".** Expected: `review-draft` after `ingest`, and one Module per `resolve-module` session.

**Prototype missing for a resolved Module** (`studio` shows a gap): the next `resolve-module` pass on that Module rebuilds it. Need it sooner → the maintainer.
