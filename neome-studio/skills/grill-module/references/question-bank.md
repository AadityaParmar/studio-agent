# Question bank

A **coverage list, not a script**. Every Module covers all 11 topics. Default order below (process early: roles and records fall out of it); follow the talk, skip what Sources already answer.

Per topic:

- **Aim**: what the topic must settle.
- **Ask**: sample questions in simple English. Reword in the Enterprise's terms (Enterprise `GLOSSARY.md`).
- **Pre-fill**: where a suggested answer can come from before asking.
- **Always ask**: facts the Enterprise must state itself, even when a Source or the catalog suggests one. Pre-fill becomes the suggested answer; only the Enterprise's reply settles it.
- **Feeds**: the spec section (`write-module-spec`) and ticket section it lands in.

**App hints.** Read the App(s) this Module resembles in [`reference/neome-app-catalog.md`](../../../reference/neome-app-catalog.md), live, every run: its `## App:` section (entities, key fields, statuses, roles, automations, approvals, reports) and section 1 building blocks. Catalog-based answers are always `(proposed, to confirm)`; Neome App names and catalog words stay out of questions and answers (say it in the Enterprise's words).

Engagement-wide topics (access and permission matrix, currencies, languages, hosting, SSO, migration, training, support) are `review-draft`'s; here only note an ask no single Module owns and hand it back.

## 1 Purpose and pain

Aim: Why the Module exists, what fails today, how success is measured.
Ask:
- What goes wrong today with <Module> that this must fix?
- How will you know it works? Which number should move (for example time to quote, follow-ups missed)?
- Who feels the pain most?
Pre-fill: Inputs (pain stories, goals in decks or RFPs).
Always ask: goals and KPIs
Feeds: spec 1 Purpose and KPIs

## 2 Roles

Aim: Who touches this Module, what each does, how many people per role.
Ask:
- Who does each step (role names you use)?
- How many people in each role?
- Who only views, and who must never see it?
Pre-fill: Inputs; process lanes in `process.md`; `## 2 Roles` from `review-draft`; catalog App roles (proposed).
Always ask: roles and headcount
Feeds: spec 2 Roles

## 3 Process

Aim: How the work runs today (AS-IS, pain) and how it should run (TO-BE), with hand-offs to other Modules and outside parties.
Ask:
- Walk me through the last real <record>: who started it, what happened next, where it ended?
- Where does it wait, get lost or get done twice?
- What comes in from before, and where does it go after (which Module, which system)?
Pre-fill: Inputs; this Module's section of `process.md` (skeleton).
Feeds: spec 3 Process + this Module's section of `process.md`

## 4 Records and data

Aim: The records this Module keeps, their key fields, master lists, numbering.
Ask:
- What do you write down for each <record> today (show a sample form or sheet)?
- Which fields are a fixed list of choices, and what are the values?
- How is a <record> numbered today?
Pre-fill: Inputs (forms, sheets, sample exports); catalog App entities and key fields (proposed).
Feeds: spec 4 Records and data

## 5 Statuses

Aim: The full status list of the main record, which are start and end, and what moves a record between them.
Ask:
- What stages does a <record> go through, first to last?
- Which ones are final (won, lost, cancelled…)?
- What moves it from one stage to the next, and who does it?
Pre-fill: Inputs; catalog App statuses (proposed).
Always ask: final status list
Feeds: spec 5 Statuses

## 6 Rules

Aim: Approvals, limits, automatic steps and who gets told what, when.
Ask:
- What needs someone's approval? Above what amount or limit, and who approves?
- What should happen by itself (reminders, expiry, auto-assign)?
- Who must be told when <event>, and how (app, WhatsApp, email)?
Pre-fill: Inputs; catalog building blocks (approvals, automations; proposed).
Always ask: approval thresholds and approvers
Feeds: spec 6 Rules and notifications

## 7 Exceptions

Aim: What breaks the normal path and what people do then.
Ask:
- What happens when <approver> is away, or the buyer changes their mind?
- Can a closed <record> be reopened or changed? By whom?
- What goes wrong most often today?
Pre-fill: Inputs.
Feeds: spec 7 Exceptions

## 8 Reports

Aim: What each role needs to see, summed or listed, and how often.
Ask:
- What do you check every week or month for <Module>?
- Which list or number does the boss ask for?
- Split by what (person, showroom, month)?
Pre-fill: Inputs (current reports, sheets); catalog App reports (proposed).
Feeds: spec 8 Reports

## 9 Integrations

Aim: Other systems and channels this Module talks to: what data, which way, who owns the link, which system holds the truth.
Ask:
- Which other system (ERP, accounts, WhatsApp, email, website) must this talk to, and which data goes which way?
- Which system is the master for <data> (system of record)?
- Who on your side owns that system and the link?
Pre-fill: Inputs; process lanes of kind external.
Always ask: system of record; integration ownership
Feeds: spec 9 Integrations

## 10 Volumes and NFRs

Aim: How much, how often, peaks, and needs special to this Module (speed, mobile, offline, retention).
Ask:
- How many <records> a day or month, and in peak season?
- Where are users when they do this (desk, phone, site with weak network)?
- How long must records be kept?
Pre-fill: Inputs.
Always ask: volumes
Feeds: spec 10 Volumes and NFRs

## 11 Priority and Scope tag

Aim: MoSCoW, Scope tag and acceptance criteria for every Requirement, confirmed in one bulk step.
Ask:
- Here are the Requirements with my proposed priority, scope and acceptance. Yes to all, or which do you change?
- Anything here you would leave out of the first go-live?
Pre-fill: drafted by the agent from the topics above (proposed).
Always ask: priority
Feeds: spec 11 Requirements
