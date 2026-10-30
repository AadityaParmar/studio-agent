# 04: Module elicitation question bank

Type: grilling
Status: resolved
Assignee: aditya
Blocked by: None

## Question

What does grilling cover for one Module, and in what order? For example: goals and KPIs, roles, AS-IS walkthrough, events and policies, data, exceptions, reports, integrations, volumes and NFRs, MoSCoW.

Which questions can the agent pre-answer from Inputs and the Neome App catalog? Which always go to the Enterprise?

## Answer

The bank is a **coverage list, not a script**. Every Module must cover the topics below. The agent picks the order to suit the talk and skips topics the Inputs already answer.

Topics, in default order (process comes early because roles and records fall out of it):
1. Purpose and pain: the goal, KPIs, what fails today
2. Roles: who does what, rough headcount per role
3. Process: walk through how it works today (AS-IS), then how it should work (TO-BE), including hand-offs to other Modules (this refines the Module's section of `process.md`)
4. Records and data: entities, key fields, master data, numbering
5. Statuses and stages
6. Rules: approvals, thresholds, automations, notifications
7. Exceptions and edge cases
8. Reports and dashboards
9. Integrations and channels: ERP, WhatsApp, email, mobile, calendar
10. Volumes, plus NFRs specific to this Module
11. Confirm priority and Scope tag (one bulk confirm per Module)

Decisions:
- **Engagement-wide topics are asked once, in `review-draft`**, not repeated for each Module. These are user count and permission matrix, currencies, languages, hosting and SSO, data migration, and support (Anglo Gulf OI-21 to OI-26). Their Open Items get Module = `All`.
- **What the agent pre-answers** falls into three tiers:
  - From Inputs: the agent states the answer and cites the Source. It asks only if Sources conflict or the answer is thin.
  - From the catalog: the agent offers a default marked "proposed by Neomenta, to confirm" (statuses, fields, automations, reports). The Enterprise confirms or edits it.
  - Always asked of the Enterprise: goals and KPIs, roles and headcount, approval thresholds and approvers, final status and stage lists, volumes, system of record, integration ownership, and priority.
- **The Consultant in a live session** can answer only by relaying what the Enterprise said, and that is logged in the WS-n Source with the speaker's name. The Consultant's own opinion counts as "proposed by Neomenta, to confirm" and also creates an Open Item.
- **Done rule:** grilling a Module is done when every topic is either answered with a Source, marked N/A with a reason, or raised as an Open Item. Nothing is left blank or assumed.
- **Where the bank lives:** `grill-module/references/question-bank.md`. Each topic has its aim, 2–4 sample questions in simple English, what it can pre-fill from, and which spec section it feeds. App-specific hints (for example, Quotation → discount approval bands) are read live from the catalog research file, not copied into the bank.
- **Style:** rounds of up to 5 questions, each with a suggested answer, so the Enterprise mostly says yes or edits. The same items can be exported unchanged to the questionnaire.
- **Acceptance criteria and MoSCoW** are drafted by the agent and not asked about one by one. Topic 11 is a single bulk confirm per Module. Anything not confirmed rolls into one Engagement Open Item (like Anglo Gulf OI-28).
