---
name: ingest
description: "Register dropped Inputs as Sources and draft Modules, Requirements, Open Items and Enterprise glossary terms. First run creates the Enterprise and Engagement. Also reads Questionnaire replies back."
disable-model-invocation: true
---

# ingest

## How to talk

- Simple English. No fancy words. Short.
- Be extremely concise. Sacrifice grammar for concision.

Turn Inputs dropped in `enterprises/<ent>/inputs/` and `confidential/` into Sources and a cited draft, and read Questionnaire replies back into the record. Every fact cites a Source or is `(proposed, to confirm)`. Every gap becomes an Open Item.

`ENGINE` = `node neome-studio/engine/cli.mjs`, from the repo root. Git and lock: [git-protocol.md](../../reference/git-protocol.md). Draft file shapes: [draft-shapes.md](references/draft-shapes.md). Ticket fields: [map-logic.md](../../reference/map-logic.md). Questionnaire replies: [reply-loop.md](references/reply-loop.md).

## 1. Scope

Need `<ent>` (Enterprise folder, kebab-case) and `<slug>` (Engagement, kebab-case, no dates). Ask the Consultant if not given. List files in `inputs/` and `confidential/` whose path is not in the `file` column of `_agent/sources.md`: these are the **new Inputs**.

- No new Inputs → say so, stop.
- A new Input is a Questionnaire **reply** (names a `QN-…`, quotes OI IDs, or answers the numbered items of a sent Questionnaire in `_agent/questionnaires/`) → note which QN it answers; ask the Consultant when unsure. A reply pasted into the chat → save it verbatim as `inputs/<contact>-reply.md` first.
- Engagement `map.md` already exists (later run) → this version drafts only into tickets still `draft: true`. Anything a non-reply Input says about a confirmed Module → Open Item; tell the Consultant. Replies follow reply-loop instead.
- Enterprise glossary already exists (later Engagement) → read it whole first; draft in its terms (an Input word listed in an _Avoid_ → write the term).

Done when `<ent>`, `<slug>` and the new Input list are fixed, each Input marked reply (with its QN) or not.

## 2. Start

Pull (git-protocol Start). New Enterprise or Engagement: ask the Consultant for the Enterprise name and Engagement title (suggest from the Inputs), then:

```
ENGINE init-engagement enterprises/<ent> <slug> --name "<Enterprise name>" --title "<Engagement title>"
```

Take the Engagement lock and push it (git-protocol Engagement lock). Done when the lock push succeeds.

## 3. Register Sources

Per new Input, pick prefix and title (draft-shapes Source ID prefixes), then:

```
ENGINE add-source enterprises/<ent> <file> --engagement <slug> --prefix <XX> --type "<type>" --title "<title>" [--date YYYY-MM-DD]
```

A reply: `--prefix QA --type "questionnaire reply" --title "<contact> reply to <QN>" --notes "reply to <QN>"` (every QN it answers, comma-separated). It renames the file to `<ID>-<slug>.<ext>`, adds the register row (confidential ones point at `confidential/`) and writes the text copy for text files. `(needed)` → write `_agent/sources/<ID>.md` yourself (draft-shapes Text copy). A file you cannot read → ask the Consultant for a readable copy; record it in map Notes.

Done when every new Input has an ID, a register row and a full text copy.

## 4. Replies

No reply → step 5. Per reply, follow [reply-loop.md](references/reply-loop.md): match list, Consultant confirms, apply, check. The record changes only after the Consultant confirms the match list. Done when reply-loop's Check holds for every reply.

## 5. Draft

Only the new Inputs that are not replies; none → step 6. Read every text copy of this Engagement's Sources, whole. Then write, per draft-shapes:

- **Modules**: groups of related needs, named in the Enterprise's words, each with a prefix; one draft ticket each + a map row.
- **Requirements**: one testable statement each, in the Module that owns it.
- **Engagement-wide Requirements**: asks no single Module owns (access, localisation, hosting, migration, training, support, other) → `general.md`.
- **Open Items**: every gap, conflict between Sources, vague number, unknown owner, unknown approver, unknown volume.

Draft is **exhaustive**: every need, pain, rule, number, role and system named in the Inputs sits in a Requirement, a Module section or an Open Item. Two Sources disagree → Open Item quoting both. Done when you can point each sentence of the Inputs that states a need at the line that holds it.

## 6. Glossary

No Inputs drafted in step 5 → only the terms replies confirmed (reply-loop Glossary); step 7. Collect the Enterprise's own terms from the Inputs (words they use for their things, roles, documents, statuses), each with a definition from the Inputs and its Source. Include existing glossary terms this Engagement uses, so their _Used in_ gets this slug. Input gives an existing term a different meaning → raise the Open Item it asks for. Hand all of them to the `enterprise-glossary` skill (it pulls, writes, commits and pushes `GLOSSARY.md` itself). Done when it reports every term written or disputed.

## 7. Check

```
ENGINE build-brd enterprises/<ent>/engagements/<slug> --check
```

Errors → fix your markdown, run again. Done at exit 0. Warnings about missing sections in draft Modules are expected.

## 8. Report and end

Tell the Consultant, short:

- Sources: ID · title (confidential marked).
- Replies: reply-loop Report.
- Modules: prefix · name · Requirements count.
- Engagement-wide Requirements count; Open Items count (top 5 questions).
- Glossary terms added, updated, disputed.
- Next: new session, `/neome-studio:review-draft` (after drafting); reply-loop Report's next step (after replies only).

Add the map change-log line(s). Clear the lock, then End (git-protocol): `ingest: <ent>/<slug> <n> Sources, <n> Modules drafted` (replies only: `ingest: <ent>/<slug> QA-n reply to <QN>, <n> Open Items closed`). Include renamed Inputs, `_agent/` files and the Engagement folder.
