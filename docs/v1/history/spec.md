# Spec: Neome Requirements Studio (`neome-studio` skill pack)

Status: ready-for-agent
Type: spec
Source: [map.md](map.md) + resolved tickets 01–20 in [issues/](issues/)

## How to talk

- Simple English. No fancy words. Short.
- Be extremely concise. Sacrifice grammar for concision.

Terms used exactly as in [GLOSSARY.md](../../../GLOSSARY.md): Consultant, Enterprise, Engagement, Input, Source, Enterprise glossary, Module, Requirement, Engagement-wide Requirement, Acceptance criteria, Priority, Scope tag, Open Item, Neome App, Delivery, BRD, Module spec, Prototype, Questionnaire, BRD data file, BRD version, Sign-off, Eval case.

## Problem Statement

Neome Consultants turn an Enterprise's raw Inputs (decks, RFPs, call notes, WhatsApp exports, spreadsheets) into a BRD by hand. Each BRD looks different. Facts lose their Source. Gaps get filled with guesses instead of Open Items. Fit to Neome Apps is done ad hoc. Answers from the Enterprise come back by WhatsApp and email and get lost. Versions and sign-off are loose, so the build team (phase 2) does not know which version is agreed or what each Requirement means. Several Consultants on one Engagement step on each other. Nothing checks the quality of the output.

## Solution

A Claude Code plugin, `neome-studio`, in one private team repo. The Consultant drops Inputs in a folder and runs a small set of skills. The skills:

- register every Input as a Source with an ID,
- draft Modules, Requirements, Open Items and Enterprise glossary terms from Inputs,
- let the Consultant confirm the draft as a quiz,
- resolve one Module per session: grill (live or from Inputs) → Module spec → Prototype,
- send open Open Items to the Enterprise as a Questionnaire and read the replies back,
- build a fixed-template BRD (HTML, prints to A4) from one validated BRD data file, with versions, change log and Sign-off.

Nothing is assumed. Every fact cites a Source or is marked "proposed by Neomenta, to confirm". Gaps become Open Items. The signed-off BRD data file is the handoff to phase 2.

Humans only drop files and read generated views. All working files live in agent-only `_agent/` folders. Skills own git. A deterministic engine (Node CLI shipped in the plugin) does the parse, validate and render work; skills do the thinking and writing.

## User Stories

### Setup and onboarding

1. As a Consultant, I want to install the pack by cloning the team repo, so that I have no separate plugin install step.
2. As a Consultant, I want Claude Code to ask me once to trust the repo's marketplace and then enable `neome-studio`, so that the skills appear in my slash menu.
3. As a Consultant, I want `npm ci` to install the pinned Mermaid CLI, so that my diagrams match everyone else's.
4. As a Consultant, I want `studio` to check my setup on every run (git remote reachable, node modules present, Mermaid CLI version matches pin, plugin enabled), so that I learn what is missing before a skill fails.
5. As a Consultant, I want a README with a setup checklist and a first-run walkthrough using my real Inputs, so that I can start without help.
6. As a Consultant, I want a Troubleshooting section (Mermaid CLI missing, push rejected, stale lock), so that I can fix common problems myself.
7. As a Consultant, I want plugin updates to arrive with the repo pull that skills already do, so that I am always on the team version.

### Routing

8. As a Consultant, I want to run `/neome-studio:studio` at any time, so that I know what to do next.
9. As a Consultant returning to an Engagement, I want `studio` to show next Modules to take, Modules needing revisit, open Open Items and BRD readiness, so that I can pick up where I left off.
10. As a Consultant, I want `studio` to show who holds a Module claim or Engagement lock, so that I do not clash with a colleague.
11. As a Consultant, I want `studio` to offer to clear a stale lock after asking me, so that a crashed session does not block the team.
12. As a Consultant, I want `studio` to point me only at the six main skills, so that the building blocks do not confuse me.
13. As a Consultant, I want `studio` to write nothing, so that asking for status is always safe.

### Inputs and Sources

14. As a Consultant, I want to drop Inputs with any file name into the Enterprise `inputs/` folder, so that I do not have to follow naming rules.
15. As a Consultant, I want to drop confidential Inputs into a gitignored `confidential/` folder, so that originals never reach git.
16. As a Consultant, I want `ingest` to register each Input as a Source with a stable ID unique across the Enterprise, so that every fact can cite it.
17. As a Consultant, I want `ingest` to rename each dropped file to `<SOURCE-ID>-<slug>.<ext>` in place, so that I can see its ID.
18. As a Consultant, I want `ingest` to keep a text copy of every Source (confidential ones too) in the agent folder, so that skills can read and cite it.
19. As a Consultant, I want a confidential Source to still get a register row pointing at `confidential/`, so that citations to it stay valid.
20. As a Consultant, I want each Source row to list the Engagements it was ingested for, so that one Input can serve several Engagements.
21. As a Consultant, I want live sessions (WS-n), Enterprise decisions (SD-n), questionnaire replies (QA-n) and sign-off evidence (SO-n) registered as Sources with a file, so that nothing is cited without a record.

### First ingest and draft

22. As a Consultant, I want the first `ingest` on a new Enterprise to create its folders, Source register and Enterprise glossary, so that I do not set anything up by hand.
23. As a Consultant, I want the first `ingest` on a new Engagement to create its folders and Engagement map, so that the Engagement is ready to work.
24. As a Consultant, I want `ingest` to draft Modules in the Enterprise's language with ID prefixes, so that the draft reads like the Enterprise's business.
25. As a Consultant, I want `ingest` to draft Requirements, Open Items and Engagement-wide Requirements from Inputs, each citing a Source or marked proposed, so that the draft is traceable.
26. As a Consultant, I want `ingest` to seed the Enterprise glossary from Inputs only (never from catalog terms), each term citing a Source and marked proposed, so that the glossary is the Enterprise's language, not Neome's.
27. As a Consultant, I want `ingest` on a later Engagement to read the existing Enterprise glossary first and draft in those terms, so that the Enterprise speaks one language across Engagements.
28. As a Consultant, I want gaps to become Open Items and never assumptions, so that the Enterprise sees every unknown.

### Review draft

29. As a Consultant, I want `review-draft` to walk me through the draft as a quiz in a fresh session, so that I confirm it before deep work.
30. As a Consultant, I want to confirm, merge, split or rename Modules in `review-draft`, so that the Module set is right.
31. As a Consultant, I want a merged or split Module's old folder kept and marked `merged-into <PREFIX>`, so that old Requirement IDs stay traceable.
32. As a Consultant, I want a renamed Module to record its former prefix, so that history is clear.
33. As a Consultant, I want `review-draft` to sketch the end-to-end process skeleton and the roles, so that each Module has context.
34. As a Consultant, I want `review-draft` to ask the Engagement-wide topics once (access, localisation, hosting, migration, training, support), so that I do not repeat them per Module.
35. As a Consultant, I want `review-draft` to write one Module ticket per confirmed Module, so that the Engagement map has a frontier.
36. As a Consultant, I want `review-draft` to draft an implementation plan skeleton (4 default phases, Modules placed, no week numbers), so that I can set weeks later.
37. As a Consultant, I want to re-run `review-draft` when a later `ingest` adds new Modules, so that new Modules get confirmed too.

### Resolving a Module

38. As a Consultant, I want `resolve-module` to claim a Module by pushing the claim before any work, so that two Consultants never resolve the same Module.
39. As a Consultant, I want a rejected claim push to tell me someone else claimed it and suggest another Module, so that I lose no work.
40. As a Consultant, I want `resolve-module` to run grill → spec → Prototype in one session, so that one Module is done end to end.
41. As a Consultant, I want grilling to cover 11 topics (purpose and pain, roles, process, records and data, statuses, rules, exceptions, reports, integrations, volumes and NFRs, priority confirm) in the order that suits the talk, so that coverage is complete without a rigid script.
42. As a Consultant, I want the agent to pre-answer topics from Inputs with a citation, and ask only if Sources conflict or are thin, so that the Enterprise is not asked what it already said.
43. As a Consultant, I want catalog-based defaults offered as "proposed by Neomenta, to confirm", so that the Enterprise can just say yes or edit.
44. As a Consultant, I want goals, roles and headcount, approval thresholds and approvers, final status lists, volumes, system of record, integration ownership and priority always asked of the Enterprise, so that key facts are never guessed.
45. As a Consultant, I want questions in rounds of up to 5, each with a suggested answer, so that a live call moves fast.
46. As a Consultant in a live call, I want what the Enterprise says logged in the session Source with the speaker's name, so that live answers are cited.
47. As a Consultant, I want my own opinion recorded as proposed plus an Open Item, so that it is never passed off as the Enterprise's answer.
48. As a Consultant, I want grilling to challenge answers against the Inputs, so that contradictions surface.
49. As a Consultant, I want acceptance criteria and MoSCoW drafted by the agent and confirmed in one bulk step per Module, so that I do not ask about each Requirement.
50. As a Consultant, I want anything not confirmed in the bulk step rolled into one Engagement Open Item, so that it is tracked.
51. As a Consultant, I want grilling done only when every topic is answered with a Source, N/A with a reason, or an Open Item, so that nothing is left blank.
52. As a Consultant, I want new Enterprise terms added to the Enterprise glossary during grilling, so that specs use the Enterprise's words.
53. As a Consultant, I want `write-module-spec` to write a Module spec with 13 fixed sections, so that every spec has the same shape.
54. As a Consultant, I want each Requirement as a block with ID, title, statement, acceptance criteria, priority, scope tag, Sources, Open Items, proposed flag and optional Delivery override, so that each one is testable and traceable.
55. As a Consultant, I want Requirement IDs `<PREFIX>-NN` that are never reused, and withdrawn Requirements kept with a reason, so that IDs stay stable for phase 2.
56. As a Consultant, I want `neome-mapping` to propose an indicative Neome App and Delivery (Standard / Configuration / Custom module) per Module from the public catalog and heuristics, so that fit is consistent.
57. As a Consultant, I want "no App fits" expressed as no App plus Custom module, so that gaps are honest.
58. As a Consultant, I want the spec's done check run before the ticket closes (13 headings, each filled / N/A / OI, every Requirement complete, no uncited facts), so that weak specs do not close.
59. As a Consultant, I want `resolve-module` to refine this Module's section of the process skeleton, so that the end-to-end process grows Module by Module.
60. As a Consultant, I want `resolve-module` to add an Engagement-wide Requirement under the Engagement lock when grilling surfaces an ask no single Module owns, so that it has a home.
61. As a Consultant, I want `build-prototype` to build the Module's Prototype, so that the Enterprise can react to behaviour.
62. As a Consultant, I want the ticket closed once the spec and Prototype exist, even with Open Items still open, so that progress is visible.
63. As a Consultant, I want a revisit of a needs-revisit Module to be a shorter pass covering only what changed, so that I do not redo the Module.

### Prototype

64. As an Enterprise, I want a single-file HTML Prototype per Module that looks like Neome, so that I can see how my process will work.
65. As an Enterprise, I want an App tab with sheet, kanban by status, record drawer, role switcher and working actions per transition, so that I can click through the flow.
66. As an Enterprise, I want a Scenarios tab of guided step-by-step stories showing the actor, what they do, the screen and what the step proves, so that I can check behaviour against Requirements.
67. As an Enterprise, I want a Mobile + trace tab with phone screens per key role, so that I see the field and approver view.
68. As a Consultant, I want a Requirement trace panel that highlights where each Requirement shows, so that I can prove coverage.
69. As an Enterprise, I want each state change to push a bot notification to the next role, so that I see Neome's conversational side.
70. As an Enterprise, I want proposed fields, roles and scenarios to show a "proposed" chip and open Open Items an orange OI chip, so that I know what is not agreed.
71. As a Consultant, I want sample records (4–8, spread over every status, marked sample) and scenarios proposed by the agent, so that the Prototype feels real.
72. As an Enterprise, I want the Prototype to work offline with no external JS and a reset button, so that it opens anywhere.
73. As a Consultant, I want the Prototype built from a fixed template plus a per-Module data object (no agent-written HTML), so that every Prototype is consistent.
74. As a Consultant, I want the Prototype done check (every Requirement in at least one tab, every transition in at least one scenario), so that coverage is complete.
75. As a Consultant, I want the Prototype rebuilt on any spec change and renamed or removed when its Module is renamed or merged, so that views never go stale.
76. As a Consultant, I want Prototype feedback to come back as an ordinary Input, so that it is cited like everything else.
77. As a Consultant, I want the guessed approve-from-bot-chat screen marked as guessed, so that nobody takes it as real Neome UI.

### Questionnaire loop

78. As a Consultant, I want `questionnaire` to export open Enterprise-owned Open Items, by default all and narrowed by Module if I ask, so that answers can come async.
79. As an Enterprise contact, I want one questionnaire addressed to me, grouped by Module with `All` first and Must items first, so that I can answer the important things first.
80. As an Enterprise contact, I want each item to show "For: <role>", the question, a suggested answer and "Reply: Yes / Edit / Don't know", so that I can forward it and answer fast.
81. As an Enterprise contact, I want a printable HTML version and a WhatsApp/email text version, so that I can answer the way I like.
82. As a Consultant, I want re-asked items marked "asked before (QN-…)", so that the Enterprise sees it is a chase.
83. As a Consultant, I want a warning over ~25 items with a suggestion to split by Module, so that questionnaires stay short.
84. As a Consultant, I want the Open Items register to record suggested answer, ask to, and asked in, so that I know what was sent where.
85. As a Consultant, I want a reply in any form saved as a QA-n Source and `ingest` to propose an OI-by-OI match list that I confirm before anything is written, so that misreadings do not change the record.
86. As a Consultant, I want a Yes to close the Open Item and turn the proposed fact into an agreed fact citing QA-n, with no revisit, so that confirmations are cheap.
87. As a Consultant, I want an Edit or new info to close the Open Item and set the Module to needs-revisit with a reason, so that the spec gets updated.
88. As a Consultant, I want Don't know or no answer to keep the Open Item open with a note, so that it is chased again.
89. As a Consultant, I want a new question in a reply to become a new Open Item, so that nothing is dropped.
90. As a Consultant, I want replies to `All` Open Items to land in the Engagement-wide Requirements, so that they have a home.

### Enterprise glossary

91. As a Consultant, I want one Enterprise glossary shared by all Engagements, each term with definition, Avoid list, Sources, status (proposed / agreed) and Used in, so that terms are consistent.
92. As a Consultant, I want a new meaning for an existing term to raise an Open Item and mark the term disputed, never overwrite it, so that conflicts are settled by the Enterprise.
93. As a Consultant, I want a term with two real meanings split into two qualified terms with the bare word in Avoid, so that each meaning is clear.
94. As a Consultant, I want a rename to move the old name to Avoid and rewrite specs of open Engagements, never signed versions, so that history is safe.
95. As a Consultant, I want a term to become agreed when the Enterprise confirms it in a Questionnaire or signs off a BRD that shows it, so that agreement is recorded.

### Engagement-wide Requirements

96. As a Consultant, I want Requirements no single Module owns stored as Engagement-wide Requirements with `GEN-NN` IDs and a fixed topic tag, so that they are not forced into a Module.
97. As an Enterprise, I want them in an "Across all Modules" BRD section grouped by topic, with no Neome App mapping and not in the fit table, so that they read as shared asks.
98. As a Consultant, I want release to warn and Sign-off to block when a topic is not covered (Requirement, N/A with Source, or Open Item), so that nothing shared is forgotten.

### Implementation plan

99. As a Consultant, I want an optional, indicative Implementation plan of phases on relative weeks plus a Not yet placed list, so that the Enterprise sees the shape of delivery.
100. As a Consultant, I want only me to set week numbers, never the agent, so that estimates are mine.
101. As a Consultant, I want Custom Modules, third-party integrations and scope on open Open Items placed in Not yet placed, so that the plan does not over-promise.
102. As a Consultant, I want release to warn if a phase has no weeks, is still proposed, or a resolved Module is unplaced, so that I fix the plan before sending.
103. As an Enterprise, I want the plan to carry no pricing and no calendar dates, so that it is clearly an estimate.

### BRD build

104. As a Consultant, I want `build-brd` to work at any time, with unresolved Modules shown "In progress", so that I can share progress early.
105. As a Consultant, I want a normal `build-brd` run to make an unnumbered working preview labelled "Working draft — not for circulation", so that drafts are not mistaken for releases.
106. As a Consultant, I want `build-brd` to build the BRD data file from the agent markdown and never from hand edits, so that markdown stays the source of truth.
107. As a Consultant, I want the build to fail on schema errors and broken references, and warn on completeness gaps in in-progress Modules, so that I can preview early but never ship broken links.
108. As a Consultant, I want a clear failure message when the Mermaid CLI is missing, so that I know to run `npm ci`.
109. As an Enterprise, I want a BRD that works like an app on screen: sidebar with Overview, Modules (Delivery chip and progress bar each), Across all Modules, Implementation plan, and Register (Open Items, Glossary, Sources, Versions and sign-off), so that I can explore it.
110. As an Enterprise, I want a summary with 4 metrics, scope at a glance, the fit table and a How to read legend, so that I see the whole picture fast.
111. As an Enterprise, I want each Module view to show a mapping card, filters (All / Must / Open scope / Has Open Item) and Requirement cards with folded acceptance criteria, so that I can review one Module at a time.
112. As an Enterprise, I want proposed items to carry a "proposed, to confirm" chip, so that I know what I am agreeing to.
113. As an Enterprise, I want an end-to-end process diagram with lanes and per-Module status diagrams, with steps hanging on Open Items in dashed orange with the OI ID, so that I see the flow and its gaps.
114. As an Enterprise, I want any OI link to jump to its row in the register, so that I can read the question.
115. As an Enterprise, I want the BRD to show only the glossary terms this Engagement uses, so that the glossary is relevant.
116. As an Enterprise, I want the BRD to print to A4 as a full linear document whatever is on screen, each section and Module on a new page, table headers repeated, rows not split, and a footer with Engagement, version, status and page x / y, so that I can sign a paper copy.
117. As an Enterprise, I want the BRD to be one self-contained HTML file with no external JS and static diagram SVGs, so that it opens offline and prints like the screen.
118. As a Consultant, I want the same diagrams in every build of the same data (pinned Mermaid CLI), so that versions do not shift because of tools.
119. As an Enterprise, I want the BRD in the Vendorgate look (Neome blue, orange accent, Schibsted Grotesk and JetBrains Mono), so that it reads as a Neomenta document.
120. As an Enterprise, I want Delivery shown as indicative with consistent colours (Standard green, Configuration blue, Custom orange, Open dashed orange), so that I do not read it as a commitment.

### Versions and Sign-off

121. As a Consultant, I want release mode to freeze an integer BRD version with its HTML and data snapshot, so that what I sent is fixed.
122. As a Consultant, I want to add one summary line at release, so that the change log says why.
123. As an Enterprise, I want a change log auto-diffed from the previous version (Modules resolved / merged / renamed / needs-revisit; Requirements added / changed with field-level detail / withdrawn; Open Items raised / closed with answer Source), complete in every version, so that I see exactly what changed.
124. As a Consultant, I want Sign-off to be a `build-brd` mode that stamps an existing released version with two signers and an evidence Source, so that agreement is recorded.
125. As a Consultant, I want Sign-off blocked unless every Module is resolved or merged, every Engagement-wide topic is covered, and no Must Requirement has priority TBC or scope Open, so that nothing half-done is signed.
126. As an Enterprise, I want the sign-off block to list Open Items open at sign-off and proposed items accepted on sign-off, so that I know what I agreed to.
127. As an Enterprise, I want an unsigned version to show empty signature boxes ready to print, so that I can sign on paper.
128. As a Consultant, I want a signed version never to change, and later changes to go into a new draft-for-review version, so that agreements are stable.
129. As a Consultant, I want the next build after Sign-off to clear `proposed` on everything that was in the signed version, so that agreed items stop showing chips.
130. As a Consultant, I want no partial Sign-off (split early Modules into their own Engagement), so that one BRD has one status.

### Phase 2 handoff

131. As a phase-2 developer, I want to take the latest signed-off data snapshot, never the live file, so that I build what was agreed.
132. As a phase-2 developer, I want a documented JSON Schema with `schemaVersion` (semver), so that I can refuse a major version I do not know.
133. As a phase-2 developer, I want the data file to carry every Module spec section (roles, records and fields with types, statuses, transitions, rules, exceptions, reports, integrations, volumes, Requirements, mapping), not just what the BRD shows, so that I never need to read the markdown.
134. As a phase-2 developer, I want every fact object to carry Sources and a proposed flag, so that I know where it came from.
135. As a phase-2 developer, I want withdrawn Requirements and merged or renamed Modules kept in the data, so that IDs stay traceable.

### Collaboration and git

136. As a Consultant, I want every skill I run to pull at start and commit and push at end with a generated message, so that I never type git.
137. As a Consultant, I want a skill to stop and tell me what to do on a pull or push failure, and never force-push, so that no one's work is lost.
138. As a Consultant, I want `ingest`, `review-draft` and `build-brd` to take an Engagement lock (who, skill, since) pushed first and cleared at end, so that shared files are not edited at once.
139. As a Consultant, I want the Enterprise glossary edited with pull-before-write and commit-right-after, without an Engagement lock, so that Engagements of one Enterprise can run in parallel.
140. As a Consultant, I want never to edit `_agent/` or views by hand, and views always rebuildable from `_agent/`, so that the record stays consistent.

### Maintainer: quality and upstream

141. As the plugin maintainer, I want deterministic checks on every push touching the plugin or fixtures (GitHub Action and `npm test` locally), so that broken skills never reach Consultants.
142. As the plugin maintainer, I want a lint that every skill carries the How to talk block verbatim and valid front-matter, so that tone and metadata stay consistent.
143. As the plugin maintainer, I want golden-replay evals (anglo-gulf full flow, tiny-synthetic mechanics) with a simulated Enterprise answering only from an answer key, so that I can measure skill quality.
144. As the plugin maintainer, I want an LLM-judged scorecard with hard gates (valid data, zero uncited non-proposed facts, zero invented facts) and soft thresholds (recall ≥80%, Open Items ≥70%, Module set ≥80%, mapping ≥70%, no regression >5 points), so that I can approve or block a skill change.
145. As the plugin maintainer, I want a "don't know" from the simulated Enterprise to end as an Open Item, so that the eval catches assumptions.
146. As the plugin maintainer, I want an eyeball checklist for Prototype and BRD look, so that visual quality is checked by a human.
147. As the plugin maintainer, I want each cloned skill to pin its upstream path and version in front-matter, so that I know what to diff.
148. As the plugin maintainer, I want an `upstream-check` tool that diffs upstream old pin → new tag and proposes a re-adapted edit that keeps How to talk, studio terms and facade paths, for me to accept per skill, so that upstream fixes reach the pack safely.
149. As the plugin maintainer, I want to mark a skill `upstreamDiverged` with a reason, so that the check skips it.
150. As the plugin maintainer, I want the upstream MIT notice shipped with the plugin, so that attribution is correct.
151. As a Consultant, I want every user skill to end with "Next session:" and up to 3 next steps, most urgent first, so that I know what to run next without calling `studio`.
152. As a Consultant, I want each next step as a runnable line `/neome-studio:<skill> <engagement-path> [<PREFIX>]` with a short why, so that I can copy-paste it into a fresh session.
153. As a Consultant, I want those next steps to match what `studio` would say, so that the two never disagree.

## Implementation Decisions

### Packaging and repo

- One private GitHub repo shared by the team. Root holds: Claude Code project settings (registers the repo as a local marketplace, enables `neome-studio`, allows `npx mmdc` and git), the marketplace manifest, the `neome-studio` plugin folder, `enterprises/`, a package manifest + lock pinning `@mermaid-js/mermaid-cli` to an exact version and defining `test`, a gitignore (`enterprises/*/confidential/`, `node_modules/`), a CI workflow for checks, a short root CLAUDE.md, and the Consultant README.
- `skills-main/` is not part of the shared repo. Upstream is never edited in place.
- Claude Code only. No AGENTS.md.
- Root CLAUDE.md (agent-facing, short): How to talk block; terms per GLOSSARY.md; facade rules; never assume, gaps become Open Items; one Module per session; start with `studio` when unsure; skills own git.
- Consultant README = README-draft trimmed. Order: what it is · Setup checklist · First run · The cycle at a glance · Skills you run (6) · Where things live · Rules of thumb · Troubleshooting. Building blocks table and origins table move to the plugin README (maintainer doc).
- No demo Enterprises in `enterprises/`. Eval cases live only inside the plugin's evals folder and run in a temp copy.

### Skills (11)

Invoked as `/neome-studio:<skill>`. Every skill, including cloned ones, carries the How to talk block verbatim.

| Skill | Invoked | Origin | Job |
|---|---|---|---|
| `studio` | user | `ask-matt` | Router + setup check + locks/claims. Writes nothing (except clearing a stale lock after asking). |
| `ingest` | user | new (modelled on wayfinder charting) | Inputs → Sources; draft/update Modules, Requirements, GEN Requirements, Open Items, glossary; close answered OIs; set needs-revisit. First run creates Enterprise/Engagement. Engagement lock. |
| `review-draft` | user | new (grilling rounds) | Quiz on draft; merge/split/rename; process skeleton; roles; Engagement-wide topics; one ticket per Module; plan skeleton. Fresh session. Engagement lock. |
| `resolve-module` | user | new (wayfinder work-through) | Claim → `grill-module` → `write-module-spec` (+ `neome-mapping`) → `build-prototype` → close. Revisit = shorter pass. |
| `questionnaire` | user | `to-questionnaire` | Open Enterprise-owned OIs → master + HTML + TXT exports. |
| `build-brd` | user | new | Modes: preview (default), release, sign-off. Calls the engine. Engagement lock. |
| `grill-module` | model | `grilling` + `domain-modeling` + `grill-with-docs` | Grill one Module, live or from Inputs, against the question bank. |
| `write-module-spec` | model | `to-spec` | Writes the Module spec (all sections except Neome mapping). |
| `build-prototype` | model | `prototype` | Writes per-Module Prototype data; calls the engine to render. |
| `enterprise-glossary` | model | `domain-modeling` (glossary only, no ADRs) | Maintains the Enterprise glossary. Pull before write, commit after. |
| `neome-mapping` | model | new | Writes spec section 12 from the catalog reference + Delivery heuristics. |

- Model-invoked blocks stay visible in the slash menu but `studio` never points at them. They do not touch git; their parent skill does.
- Map logic (frontier, claim, close) lives in one shared reference file in the plugin. No wayfinder clone for Consultants.
- Prototype feedback and sign-off evidence have no dedicated skill: they are Inputs.
- Shared plugin reference files: Neome App catalog reference (from research ticket 01, includes Delivery heuristics) plus a machine-readable catalog slug list; question bank (in `grill-module`); spec template + filled example (in `write-module-spec`); general.md template; BRD data JSON Schema + schema docs (in `build-brd`); Prototype and BRD templates; UI tokens (Neome product look for Prototype and questionnaire HTML; Vendorgate look for BRD).
- Maintainer-only tools (not skills, not shown by `studio`): eval runner, `upstream-check`.

### Git and concurrency

- Every user-invoked skill: pull at start; commit + push at end, message `<skill>: <ent>/<slug> <what>`. On pull/push failure: stop, explain, never force-push.
- Module claim: `resolve-module` commits + pushes `status: claimed` + `claimedBy` before any work. Push rejected → someone else claimed; pick another.
- Engagement lock: `lock:` line (who, skill, since) in the Engagement map, pushed first, cleared at end. Taken by `ingest`, `review-draft`, `build-brd`, and by `resolve-module` only for GEN / process-wide edits.

### Folder layout (facade, strict one-way)

Humans touch 2 drop folders and read 3 view folders. Everything else is agent-only under `_agent/` at both levels. Skills never read a view back; any view can be deleted and rebuilt.

```
enterprises/<ent>/
  inputs/              HUMAN drop (in git); ingest renames to <SOURCE-ID>-<slug>.<ext>
  confidential/        HUMAN drop, gitignored
  _agent/
    GLOSSARY.md        Enterprise glossary
    sources.md         Source register
    sources/<ID>.md    text copy of every Source
  engagements/<slug>/
    brd/               HUMAN view: preview.html, v<N>.html
    prototypes/        HUMAN view: <PREFIX>-<slug>.html
    questionnaires/    HUMAN view: QN-<date>.html|.txt
    _agent/
      map.md  process.md  open-items.md  general.md  plan.md
      modules/<PREFIX>-<slug>/ ticket.md  spec.md  prototype-data.json
      questionnaires/QN-<date>.md
      brd/brd-data.json
      brd/versions/v<N>.json
```

- Slugs kebab-case, no dates (except `QN-<date>`).
- Formats in `_agent/`: markdown is the source of truth. Registers are markdown tables. Module ticket uses YAML front-matter: `status` (open | claimed | resolved | needs-revisit | merged-into:<PREFIX>), `prefix`, `blockedBy`, `revisitReason`, `formerly`, `claimedBy`. `prototype-data.json` is agent-written (sample rows + scenarios) and may be edited only via the agent.
- Source register columns: ID | type | title | date | file | engagement(s) | notes.
- Open Items register columns: ID | question | Module(s) | owner | ask to | suggested | status | asked in | answer Source.
- Engagement map: Destination, Notes, Modules index, change log, optional lock. Open Items live only in the register.
- Rename a Module → rename its folder and Prototype view, record `formerly`. Merge/split → old folder kept with `merged-into`; old Prototype view removed.

### Module spec (markdown, fixed)

- Header: Prefix, Name, Status, Sources. 13 H2 sections, fixed order, never deleted; unused says `N/A: <reason>`:
  1 Purpose and KPIs · 2 Roles (role | does what | headcount | Source) · 3 Process (AS-IS/pain bullets + pointer to this Module's section of the process file; TO-BE lives only there) · 4 Records and data (entity | field | type | required | notes | Source; types text, number, money, date, choice, person, link-to-entity, file; notes use `Values: A / B / C` and `Links to: <entity>`) · 5 Statuses (states: id | start/end | open OI | Source; transitions: from | to | trigger | Source) · 6 Rules and notifications · 7 Exceptions · 8 Reports · 9 Integrations (system | direction | data | owner | Source) · 10 Volumes and NFRs · 11 Requirements (H3 block each) · 12 Neome mapping · 13 Open Items (ID + gist only).
- Every fact cites a Source inline (`[CE-1]`); agent proposals marked `(proposed, to confirm)`.
- If it needs Sign-off, it is a Requirement. Spec-only sections are phase-2 detail.
- One Delivery per Module, per-Requirement override only where it differs.
- Spec edited in place on revisit; history from git + BRD change log.
- `general.md`: one H2 per topic (access, localisation, hosting, migration, training, support, other), Requirements as H3 in the same block format plus topic; a topic with nothing says N/A with Source or lists its OIs.
- `plan.md`: ordered phases (id, name, weekFrom, weekTo, covers, Modules) + Not yet placed list. Agent never writes week numbers.

### Question bank

- Coverage list, not a script: 11 topics (above). Each topic has aim, 2–4 sample questions, pre-fill sources, target spec section. App-specific hints read live from the catalog reference, not copied.
- Pre-answer tiers: from Inputs (cite) · from catalog (proposed, to confirm) · always asked (goals/KPIs, roles/headcount, approval thresholds/approvers, final statuses, volumes, system of record, integration ownership, priority).
- Rounds of ≤5 items with suggested answers. Same item shape exports unchanged to a Questionnaire.
- Engagement-wide topics asked once in `review-draft`; their OIs use Module = `All`.

### Deterministic engine (new seam)

One Node CLI shipped in the plugin. Skills call it; Consultants never do directly. It does all parsing, validation and rendering so outputs are repeatable. Subcommands (names indicative):

- `build-brd <engagement> --mode preview|release|sign-off [--summary "..."] [--signers ...] [--evidence <SourceID>]`: parse `_agent/` markdown (+ Enterprise register and glossary) → BRD data file → validate → generate Mermaid → `mmdc` → static SVG → render HTML. Release freezes `v<N>.json` + `v<N>.html` and builds the change log by diffing against `v<N-1>.json`. Sign-off stamps an existing released `v<N>` once. Exit non-zero on errors; prints warnings.
- `build-prototype <engagement> <PREFIX>`: spec + `prototype-data.json` → Prototype HTML from the fixed template.
- `export-questionnaire <engagement> <QN-date>`: master markdown → HTML (Neome look, A4, no JS) + TXT (numbered, no tables).
- `check`: pack lint (How to talk verbatim, front-matter valid, `upstream` ⇒ `upstreamVersion`, upstream licence present if any `upstream`).
- Fails clearly if `mmdc` is missing or its version does not match the pin.

### BRD data file (phase-2 contract)

- JSON, JSON Schema draft 2020-12 + markdown docs, shipped in `build-brd`. Built, never hand-edited. Live file overwritten each build; snapshot frozen per release. Phase 2 takes the latest signed-off snapshot.
- Facts only: fit table, metrics, progress %, scope counts, total weeks, Mermaid text are derived by the renderer, never stored.
- `schemaVersion` semver; breaking change = major bump. Tickets 11, 16, 17, 19 additions are minor.
- Shape (trimmed from tickets 08, 11, 12, 16, 17, 19):

```
schemaVersion
enterprise   {id, name}
engagement   {slug, title, version, status: draft-for-review|signed-off, date}
sources[]    {id, type, title, date, file, engagements[], confidential}     # only cited/ingested for this Engagement
glossary[]   {term, definition, avoid[], sources, proposed, disputed?}       # only this Engagement's terms
process      {lanes[] {id, name, who, kind: person|system|external, oi?},
              steps[] {id, lane, module, label, note, kind: step|decision|external},
              edges[] {from, to, label, alternate}}
modules[]    {prefix, name, status, formerly?, purpose, kpis[], roles[], records[], statuses[],
              transitions[], rules[], exceptions[], reports[], integrations[], volumes[],
              requirements[], mapping, oiRefs[]}
  records[]      {entity, fields[] {name, type, required, choices?, linkTo?, notes, sources, proposed}}
  statuses[]     {id, start, end, oi?, sources, proposed}
  transitions[]  {from, to, trigger, sources, proposed}
  mapping        {neomeApp: <catalog slug>|null, delivery: standard|configuration|custom, how, indicative: true}
general      {requirements[] (Requirement + topic), na[] {topic, sources}, oiRefs[]}
plan?        {phases[] {id, name, weekFrom|null, weekTo|null, covers, modules[], sources, proposed},
              notPlaced[] {text, ois[], modules[], sources, proposed}}
openItems[]  {id, question, modules[] (prefixes|"All"), owner: enterprise|neomenta, status: open|closed,
              answer?, answerSource?, raisedIn?, suggested?, askTo?, askedIn[]}
changelog[]  {version, date, status, summary, changes[]}
signOff?     {enterpriseSigner {name, role, date}, neomentaSigner {name, role, date},
              evidence: <SourceID>, openAtSignOff[], acceptedProposed[]}

Requirement  {id, title, statement, acceptance[], priority: Must|Should|Could|Won't|TBC,
              scope: neome|neome-tbc|third-party|enterprise|out-of-scope|open,
              sources[], ois[], proposed, delivery?, withdrawn?}
```

- Every fact object carries `sources[]` + `proposed`. Any proposed part → whole object proposed. Non-proposed facts must have ≥1 Source.
- Dead things stay in (withdrawn Requirements, merged/renamed Modules); renderer hides or greys them.
- ID rules: Module prefix `^[A-Z]{2,5}$`, unique, `GEN` reserved · Requirement `<PREFIX>-NN` (3 digits after 99), never reused · GEN `^GEN-\d{2,3}$` · Open Item `OI-NN` across the Engagement · Source `^[A-Z]{2,4}(-\d+)?$` unique across the Enterprise · lane/step/status/phase IDs kebab-case local to parent.
- Strings allow inline markdown only. Dates ISO `YYYY-MM-DD`. Enums lowercase kebab-case except priority.
- Validation layer 1: JSON Schema. Layer 2: cross-reference: every cited Source and OI exists; Requirement IDs unique and match prefix; transitions reference existing statuses; steps reference existing lanes and Modules; `neomeApp` in catalog slug list; no Module uses `GEN`; every disputed term has an open OI; plan Module prefixes (incl. `GEN`) and OI IDs exist; `weekFrom <= weekTo`.
- Strictness: broken references always errors. Completeness gaps are errors for resolved Modules (and GEN at release), warnings for in-progress Modules.

### Release and Sign-off rules

- Preview: no number, "Working draft — not for circulation", schema + cross-ref only.
- Release: next integer N; may include in-progress Modules; Consultant summary line; change log = diff `v<N-1>` vs `v<N>` (Modules resolved/merged/renamed/needs-revisit; Requirements added/changed with fields listed, e.g. `QUO-06: priority Should→Must`/withdrawn; OIs raised/closed with answer Source; plan and glossary diffed too) + earlier entries copied forward. Warnings: uncovered GEN topic; plan phase without weeks or still proposed; resolved Module not placed.
- "Changed" Requirement = any change to statement, acceptance, priority, scope, delivery or withdrawn.
- Sign-off: stamps an existing released version; needs evidence Source (via `ingest`); hard preconditions: all Modules resolved or merged, every GEN topic covered, no Must Requirement with priority TBC or scope open. Lists open OIs and accepted proposed items. Re-render once, then frozen forever. Superseded is derived, not stored.
- After Sign-off: next build clears `proposed` on everything in the signed version; glossary terms shown in it become agreed.

### BRD page

- Screen: one self-contained HTML, no external JS, no mermaid.js (diagrams are static SVG). Inline script allowed only for sidebar nav and filters; all content and print must work with script off. Sidebar: Overview (Summary and fit, Process) · Modules (Delivery chip + progress bar = share of Requirements with no open OI) · Across all Modules · Implementation plan (if any) · Register (Open Items with count, Glossary, Sources, Versions and sign-off).
- Fixed section order, same on screen and print: Cover/Summary → How to read → Scope and Neome fit → Process → Modules → Across all Modules → Implementation plan (optional) → Open Items register → Glossary → Sources → Versions (change log) and sign-off.
- Summary metrics: Requirements in N Modules, proposed Must, Open Items to close, Modules resolved x/N (+ total weeks if plan).
- Module view: prefix eyebrow, name, In progress chip, purpose; mapping card (Neome App, Delivery marked indicative, how); status diagram; filters; Requirement cards (ID, title, statement, acceptance under toggle; side: priority, scope tag, Sources mono, OI links; proposed chip); Module Open Items box.
- Process: Mermaid `flowchart TB`, subgraph per lane, steps tagged with Module prefix, decisions as diamonds, alternate paths dotted and labelled, externals grey. Status flows: `stateDiagram-v2`, `direction LR`, `[*]` start/end, triggers as labels. OI-dependent nodes dashed orange with OI ID. Lanes are a hint only. Mermaid theme set to BRD tokens; page CSS must not leak into SVG. Step table under the diagram is optional.
- Print: full linear A4 doc from a hidden print container rendered from the same data; new page per section and Module; repeated table headers; no split rows; footer Engagement · version · status · page x / y.
- Look: Vendorgate tokens. Delivery colours: Standard green, Configuration blue, Custom orange; Open = dashed orange chip.

### Prototype

- One HTML per Module, 3 tabs: App · Scenarios · Mobile + trace. Banner: PROTOTYPE, Enterprise, prefix, Req/OI counts, indicative Neome App + Delivery.
- Look: Neome product (Material-style, Roboto, tile launcher, grey title bar, tinted kanban columns, right drawer with DETAILS/ACTIVITY, outlined fields, blue FAB, bot notifications, status as coloured text). Requirement / OI / proposed chips are a Studio overlay.
- Data: from spec (roles, records/fields, statuses, transitions, gating rules, Requirements, OI gists, mapping) + `prototype-data.json` (4–8 sample rows over every status, scenarios; all proposed). Each field/role carries `reqs[]`, `oi`, `proposed`.
- In memory only, reset button, no external JS, fonts fall back to system.
- Approve-from-bot-chat marked guessed.

### Questionnaire

- Items = open OIs with owner Enterprise only; item ID = OI ID. Shape:
  ```
  OI-07 · For: Finance
  <question, one line>
  Suggested: <answer>
  Reply: Yes / Edit: ___ / Don't know
  ```
- One file per send, one named contact in the header. Sections by Module, `All` first, Must first. Re-asked marked. Soft cap ~25.
- Return: reply saved as QA-n (QN file in notes); `ingest` proposes match list; Consultant confirms; then Yes / Edit / Don't know / new question rules (see stories 86–89).

### Enterprise glossary

- Entry: term, definition, _Avoid_, plus `_Source_: … · _Status_: proposed|agreed · _Used in_: <slugs>`.
- No catalog terms. Term → Neome entity mapping belongs only in spec section 12.
- Conflict → OI + disputed, or split into qualified terms. Rename → old name to Avoid; rewrite specs of open Engagements only.

### Upstream pins

- Cloned skills carry front-matter `upstream: <path(s)>` + `upstreamVersion: <package version>` (current snapshot 1.3.1). Optional `upstreamDiverged: <reason>`. "Modelled on" and new skills carry no `upstream`.
- `upstream-check` (maintainer-only, script + driver prompt): fetch upstream tags to a temp dir, diff old pin → new tag, read CHANGELOG, agent proposes re-adapt keeping How to talk, studio terms, facade paths; maintainer accepts per skill; never auto-merge. Unchanged or rejected → pin-only bump.
- Plugin README origins table: skill → upstream name only (no version).
- Upstream MIT notice file in the plugin, required while any cloned text remains.

## Testing Decisions

- Good tests check external behaviour only: given an input folder, what files, content, exit codes and messages come out. No tests on parser internals, private helpers or intermediate structures. A refactor of the engine must not break a test unless outputs change.
- Seams (confirmed with the Consultant):
  1. **Engine seam (deterministic).** Run the CLI against fixture Engagement folders (`_agent/` markdown + Enterprise register/glossary). Assert on: BRD data file content and validity; preview / `v<N>` HTML present, contains static SVG, no external JS, print CSS present, required sections in fixed order; change log entries after a second release; sign-off stamping and freeze (re-run refuses to change a signed version); Prototype HTML present with every Requirement traced and every transition in a scenario; questionnaire HTML + TXT shape; exit code non-zero and clear message on each error class; warnings on release gaps.
  2. **Pack lint (deterministic).** `check` over the plugin: How to talk verbatim in every skill, front-matter valid, upstream pin rules, licence present.
  3. **Eval seam (golden replay).** Whole-skill replay of each Eval case with a simulated Enterprise subagent answering only from its answer key → scorecard by LLM judge. Not a unit test; gates merges to `main`.
- Fixture cases for the engine (hand-written, small, in the plugin test folder): valid in-progress Engagement; valid fully resolved Engagement; broken references (missing Source, missing OI, bad transition, unknown catalog slug, `GEN` used as Module prefix, disputed term without open OI, bad plan refs, `weekFrom > weekTo`); resolved Module with missing acceptance (error) vs in-progress (warning); sign-off blocked (unresolved Module, uncovered GEN topic, Must with TBC/open); two releases for change-log diff; signed version then new build clears proposed; missing / wrong-version `mmdc`.
- Checks run on every push touching the plugin or fixtures (GitHub Action) and locally via `npm test`.
- Eval cases: `anglo-gulf-crm` (full flow; golden 59 Requirements, 28 OIs), `tiny-synthetic` (questionnaire loop, glossary conflict, GEN, release + sign-off + change log, claim/lock). Each has anonymised Inputs, answer key, golden JSON in BRD-data shape, README. Results written per date and case with a per-item match table.
- Scorecard: schema + cross-ref valid (hard 100%), uncited non-proposed facts (hard 0), invented facts (hard 0), Requirement recall ≥80%, Open Items caught ≥70%, Module set ≥80%, mapping Delivery class ≥70%, extra Requirements listed and tagged plausible/noise, no metric drop >5 points vs last `main` result. Thresholds are starting values; maintainer may adjust with a reason.
- Gate: skill text change → checks + evals + maintainer approval (spot-check ~10 matches) before merge to `main`. Pin-only bump → checks only. Prototype and BRD look → eyeball checklist (tabs work, Neome look, prints A4).
- Prior art: none in this repo yet (greenfield). Upstream `skills-main` has no test suite to copy. Throwaway prototypes (BRD layout, process diagram, Module Prototype, Neome look) are visual references for templates, not tests. Anglo Gulf BRD text is the golden reference.
- Rollout: after evals pass, one real Engagement shadowed by the maintainer before team use.

## Out of Scope

- Low-level Neome build mapping (internal capability docs, Studio configuration, enterprise-building MCP). Phase 2; the signed-off BRD data file is the handoff.
- RFP-response proposal genre (PetroStar style) as a separate output.
- Pricing and commercials (plan has no prices, no calendar dates).
- Multi-language BRDs. v1 is English only.
- Interactive questionnaire forms; v1 is HTML + TXT only.
- Partial Sign-off.
- Real Neome approval screens in the Prototype (approve-from-bot-chat stays marked guessed until screenshots exist).
- Persistence or a real backend in Prototypes.
- Clickable OI links inside diagram SVGs (nice to have).
- Agents other than Claude Code; setup scripts (README checklist only).
- Automated upstream monitoring.

## Further Notes

- Build prerequisite (not a decision): the Consultant supplies Anglo Gulf raw Inputs (CE-1..4, QA-1..6, SD, TL), anonymised (client, people, phones) and committed as eval fixtures; golden docs anonymised to match. Evals cannot run before this.
- Reference material to carry into the plugin: Neome App catalog reference (30 Apps, building blocks, cross-App index, Delivery heuristics, gaps) and UI tokens. The throwaway HTML prototypes for tickets 05, 06, 10 and 14 are the visual starting point for the BRD and Prototype templates.
- Not yet specified: real Neome approval screens (revisit when screenshots exist).
- Design history: [map.md](map.md) and tickets 01–20 in [issues/](issues/). README-draft.md is the starting point for both READMEs.
- No ADRs exist yet; nothing here contradicts one.
