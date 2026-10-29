---
name: questionnaire
description: "Export open Enterprise-owned Open Items as a Questionnaire (printable HTML + WhatsApp/email text) for one named Enterprise contact."
disable-model-invocation: true
upstream:
  - skills/productivity/to-questionnaire
upstreamVersion: 1.3.1
---

# questionnaire

## How to talk

- Simple English. No fancy words. Short.
- Be extremely concise. Sacrifice grammar for concision.

Send the Enterprise its open Open Items as one Questionnaire, addressed to one named contact, so answers come back async. **Grill the send, not the subject**: ask the Consultant only who it goes to and which Modules; the Open Items already hold the questions. Each item carries a suggested answer the contact can say Yes to, or none when you cannot defend one.

`ENGINE` = `node neome-studio/engine/cli.mjs`, from the repo root. `<eng>` = `enterprises/<ent>/engagements/<slug>`. Git: [git-protocol.md](../../reference/git-protocol.md) (no Engagement lock). Item, order, master and views: [questionnaire-shapes.md](references/questionnaire-shapes.md).

## 1. The send

Need `<ent>` and `<slug>`; ask if not given. Pull (git-protocol Start). Ask in one go:

- **To**: the one named Enterprise contact, and their role.
- **Modules**: all (default), or the Modules to narrow to (`All` = the Engagement-wide ones).

Done when contact name and Module scope are fixed.

## 2. Check the list

```
ENGINE new-questionnaire <eng> --to "<name>" --role "<role>" [--module "QUO, All"] --check
```

Exit 1 `nothing to ask` → tell the Consultant no open Enterprise-owned Open Items are in scope; stop. Other errors → the Engagement does not build; name them and suggest the skill that owns the file; stop.

`warning [size]` (over ~25 items) → show the per-Module counts it lists and offer one Questionnaire per Module; the Consultant picks. Done when the Consultant has seen the item count and agreed the scope.

## 3. Fill the gaps

Read the register row, the Module spec (or ticket) or `general.md` block that names each warned item, the cited Sources' text copies (`enterprises/<ent>/_agent/sources/<ID>.md`), and the catalog reference ([neome-app-catalog.md](../../reference/neome-app-catalog.md)). Then, in `open-items.md` (shapes reference, "Register cells"):

- `warning [no-ask-to]` → write the role that knows.
- `warning [no-suggested]` → write a suggested answer you can defend (cite it, or `(proposed, to confirm)` from the catalog); none defendable → leave it empty.
- A question that would confuse the contact → reword it plainly, same meaning.

Run the step 2 check again. Done when no `no-ask-to` warning is left and every `no-suggested` one is an item you chose to ask openly.

## 4. Build

```
ENGINE new-questionnaire <eng> --to "<name>" --role "<role>" --from "<who>" [--module "..."]
ENGINE export-questionnaire <eng> <QN>
```

`<who>` = `git config user.name`. `<QN>` = the id the first command prints. The first writes the master, adds `<QN>` to each item's `asked in`, and logs it in `map.md`; the second writes both views. Done when `questionnaires/<QN>.html` and `.txt` exist.

## 5. Report and end

Tell the Consultant, short:

- `<QN>` to `<name>`: item count per section; how many re-asked.
- Send `questionnaires/<QN>.txt` by WhatsApp or email (paste as is), or `<QN>.html` to print / save as PDF.
- Reply in any form: drop it in `enterprises/<ent>/inputs/`, then run `/neome-studio:ingest`; it reads the reply as a QA Source and proposes the answers OI by OI.

End (git-protocol): `questionnaire: <ent>/<slug> <QN> to <name>, <n> items`. Stage `open-items.md`, `map.md`, `_agent/questionnaires/<QN>.md`, `questionnaires/<QN>.html`, `questionnaires/<QN>.txt`.
