# Neome Requirements Studio

The skill pack Neome consultants use to turn an Enterprise's raw business requirements into a Neome-mapped BRD, by way of grilling, modules, specs and prototypes.

## People

**Consultant**:
The Neome person who runs the skills in an agent session and speaks to the Enterprise.
_Avoid_: User, analyst, operator

**Enterprise**:
The SME business whose requirements are being captured, whether or not it is on Neome yet. Never runs the skills; answers questions live or by questionnaire. Has its own folder and its own domain glossary.
_Avoid_: Client, customer, user, SME

**Engagement**:
One requirements effort for an Enterprise that ends in one BRD (for example a CRM BRD now, an inventory BRD later). An Enterprise can have several.
_Avoid_: Project, deal, opportunity

## Inputs and traceability

**Input**:
Any raw material the Enterprise hands over: deck, RFP, call notes, transcript, WhatsApp export, spreadsheet.
_Avoid_: Document, file, brief

**Source**:
An Input or decision registered with a stable Source ID (for example CE-1, QA-1, SD, TL) that requirements cite.
_Avoid_: Reference, citation

## Requirements

**Enterprise glossary**:
The one list of an Enterprise's own terms, shared by all its Engagements. Each term has one meaning and becomes agreed when the Enterprise confirms it or signs off a BRD that shows it.
_Avoid_: Engagement glossary, dictionary

**Module**:
An Enterprise-side group of related requirements, named in the Enterprise's language, with its own ID prefix (for example LEAD, QUO).
_Avoid_: App, feature, section

**Requirement**:
One numbered, testable statement of what the solution must do, with acceptance criteria, priority, scope tag and source.
_Avoid_: Feature, story, ask

**Engagement-wide Requirement**:
A Requirement no single Module owns, such as roles and permissions, data migration, training or support. Shown in the BRD under "Across all Modules", never mapped to a Neome App.
_Avoid_: General module, NFR, non-functional requirement, implementation requirement

**Acceptance criteria**:
The observable condition UAT checks to accept a Requirement.
_Avoid_: Test, definition of done

**Priority**:
A MoSCoW rating (Must, Should, Could, Won't, TBC) on a Requirement, proposed by Neomenta until the Enterprise confirms it.
_Avoid_: Importance, severity

**Scope tag**:
Who delivers a Requirement: Neome, Neome TBC, third-party system, Enterprise, Out of scope, or Open.
_Avoid_: Status, owner

**Open Item**:
A question the Enterprise or Neomenta must answer before the Requirements it affects are final. Never replaced by an assumption.
_Avoid_: Assumption, TBD, gap, question

## Neome mapping

**Neome App**:
A product from Neome's catalog (for example CRM, Quotation and Order Flow) that a Module maps onto.
_Avoid_: Module (for catalog products), product

**Delivery**:
How Neome meets a Requirement, indicative until the build phase: Standard (catalog app with field set-up), Configuration (custom fields, stages, workflows), or Custom module (built by Neomenta on the platform).
_Avoid_: Fit, build type

## Template bank

**Template bank**:
The set of Patterns, Template modules and Templates learnt from Neome Builds. Sits beside the Neome App catalog: the catalog says what a Neome App can do; the bank says how Neomenta usually builds it.
_Avoid_: Catalog (for the bank), library, "bank" alone (clashes with question bank)

**Neome Build**:
One app built on Neome for a past client, already running (its enterprise JSON). Source of Patterns and Templates.
_Avoid_: Enterprise (for a built app), app, instance

**Build area**:
A grouping of forms, sheets and workflows inside a Neome Build, taken from the builder's Module tags or Groups.
_Avoid_: Module (for the builder's grouping)

**Pattern**:
A reusable way Neome Builds do one task, including workarounds (for example approval by a status list, a workflow branch and a role). Seen in at least one Neome Build.
_Avoid_: Recipe, best practice, feature

**Template module**:
A Module shape seen across Neome Builds: its usual needs, Patterns and process steps. Suggested to an Enterprise, never assumed.
_Avoid_: Standard module, Neome App

**Usual need**:
One thing a Template module usually has to do, seen in Neome Builds. Not a Requirement: it has no Source, priority or acceptance criteria until grilling with the Enterprise turns it into one.
_Avoid_: Requirement (for bank entries), feature

**Template**:
A set of Template modules that runs as a small enterprise (for example a trading company: CRM, Quotation, Order, Invoice).
_Avoid_: Blueprint, starter kit, package

**Neome App Build**:
Neome's own build of one catalog Neome App (its enterprise JSON, one Module). Build code `NA-<catalog slug>`. Source of an App baseline; also evidence for Patterns, Template modules and Templates.
_Avoid_: Template (for the App JSON), client Build

**App baseline**:
Template bank entry (`APP-<catalog slug>`) saying what one Neome App gives out of the box: sheets, key fields, roles, workflows, a "gives" list. Learnt from its Neome App Build. Wins over the catalog page on what the App has; the Template module still wins on usual Delivery.
_Avoid_: App template, catalog entry

## Outputs

**BRD**:
The single self-contained HTML page that presents an Engagement's Modules, Requirements, Neome mapping and Open Items for review and sign-off.
_Avoid_: Proposal, report, spec

**Module spec**:
The full written answer for one Module: everything its grilling settled, each fact citing a Source. The BRD shows only part of it.
_Avoid_: Module doc, design, PRD

**Prototype**:
A throwaway clickable HTML mock of one Module in Neome's look, used to confirm behaviour with the Enterprise.
_Avoid_: Demo, mockup, POC

**Questionnaire**:
A batch of open Open Items sent to the Enterprise to answer async, each with a suggested answer.
_Avoid_: Survey, form, question list

**BRD data file**:
The structured record of an Engagement behind each BRD, built from the Module specs and registers. It is the handoff to the build phase and holds more than the BRD shows.
_Avoid_: BRD JSON, export, payload

**BRD version**:
A numbered BRD (v1, v2…) released to the Enterprise and then frozen. Its status is Draft for review or Signed off. Working previews between releases have no number.
_Avoid_: Revision, draft N, release candidate

**Sign-off**:
The Enterprise and Neomenta agreeing to one BRD version as a whole. After sign-off that version never changes, and its proposed items count as agreed. Later changes go into a new version.
_Avoid_: Approval, acceptance, freeze

## Testing the studio

**Eval case**:
A past or made-up Engagement kept as a test: its Inputs, an answer key for a simulated Enterprise, and the golden BRD it should produce. Used to check the skills before a change reaches Consultants.
_Avoid_: Demo Enterprise, test client, sample
