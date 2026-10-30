# BEAT — Beat Planning

Prefix: BEAT
Name: Beat Planning
Status: resolved
Sources: RFP-1, IN-1, WS-1

## 1 Purpose and KPIs

- Purpose: Sales Supervisor assigns Beats to employees so they visit and order only from their Beat's customers. [RFP-1]
- KPI: Every order and visit comes from the agent's own Beat; every active Beat has one Sales Agent; the weekly plan is ready before Monday. [WS-1]

## 2 Roles

| role | does what | headcount | Source |
|---|---|---|---|
| Sales Supervisor | Assigns Beats to employees; makes the Weekly Beat Plan; moves customers of an inactive Beat | 8 | [RFP-1, WS-1] |
| Area Sales Manager | Same as Sales Supervisor, for own area only | 3 | [WS-1] |
| Owner | Adds Beats; makes a Beat inactive | 1 | [WS-1] |
| Sales Agent | Works the customers of the assigned Beats; sees today's Beat | 60 | [RFP-1, WS-1] |
| Tricycle Rider | Mapped to Beats like a Sales Agent; Marketing Visit picks a Beat | 25 | [WS-1] |

## 3 Process

- Supervisor: Assign Beats (Employee Master, Beat Master) → Employee - Beat Mapping. [RFP-1]
- Sales Agent picks customers from the assigned Beat when placing an order. [RFP-1]
- Beat allocation is done in the neome app, not SAP. [IN-1]
- Beat Planning marked Completed in RFP-1 scope; the Enterprise says Completed was an old pilot, all is built new. [RFP-1, WS-1]
- Pain today: Beats kept in Excel; two agents work the same Beat, some Beats have nobody. [WS-1]
- Both an Employee - Beat Mapping and a Weekly Beat Plan (which Beat on which weekday) are kept; the Sales Supervisor makes both. [WS-1]
- TO-BE: see this Module's section of `process.md`.

## 4 Records and data

| entity | field | type | required | notes | Source |
|---|---|---|---|---|---|
| Beat | Beat | text | yes | Kept in Masters | [RFP-1] |
| Beat | Route | link-to-entity | no | Links to: Route | [RFP-1] |
| Beat | Beat Status | choice | yes | Values: Active / Inactive. No delete | [WS-1] |
| Employee - Beat Mapping | Employee | link-to-entity | yes | Links to: Employee. Sales Agent or Tricycle Rider | [RFP-1, WS-1] |
| Employee - Beat Mapping | Beat | link-to-entity | yes | Links to: Beat. Many Beats per Sales Agent; one Sales Agent per Beat | [RFP-1, WS-1] |
| Employee - Beat Mapping | Assigned By | person | no | (proposed, to confirm) | |
| Employee - Beat Mapping | Assigned On | date | no | (proposed, to confirm) | |
| Weekly Beat Plan | Employee | link-to-entity | yes | Links to: Employee | [WS-1] |
| Weekly Beat Plan | Weekday | choice | yes | Values: Monday / Tuesday / Wednesday / Thursday / Friday / Saturday | [WS-1] |
| Weekly Beat Plan | Beat | link-to-entity | yes | Links to: Beat. Must be a Beat mapped to the Employee (proposed, to confirm) | [WS-1] |
| Weekly Beat Plan | Planned By | person | no | Sales Supervisor | [WS-1] |

## 5 Statuses

| id | start/end | open (OI) | Source |
|---|---|---|---|
| active | start | | [WS-1] |
| inactive | | | [WS-1] |

| from | to | trigger | Source |
|---|---|---|---|
| active | inactive | Owner makes the Beat inactive; its employees are unmapped | [WS-1] |
| inactive | active | Owner makes the Beat active again | (proposed, to confirm) |

## 6 Rules and notifications

| rule | when | action/notify whom | Source |
|---|---|---|---|
| One Beat, one Sales Agent | A Beat is mapped to a Sales Agent | A second Sales Agent cannot be mapped until the first is unmapped; a Sales Agent may have many Beats; a Tricycle Rider may share a Beat with a Sales Agent | [WS-1] |
| Customers of assigned Beats only | Sales Agent places an order | Only customers of the Beats mapped to the agent can be picked; today's planned Beat shown first | [RFP-1, WS-1] |
| Inactive Beat | Owner makes a Beat inactive | Its employees are unmapped; its customers stay on it; Sales Supervisor moves them | [WS-1] |
| No approval | Sales Supervisor assigns Beats or makes the Weekly Beat Plan | Takes effect at once; no approval; no extra notification | [WS-1] |

## 7 Exceptions

- Beat made inactive: employees unmapped, customers stay, Sales Supervisor moves them. [WS-1]
- Agent has no Beat mapped: cannot pick customers for an order. (proposed, to confirm)
- OI-72: Beat moved to another Route: what happens to its customers and employees (Masters).

## 8 Reports

| name | audience | measures/filters | Source |
|---|---|---|---|
| Beat plan list | Sales Supervisor, Area Sales Manager, Regional Sales Manager, Sales Head, Owner | Employee - Beat Mapping and Weekly Beat Plan; filters supervisor, agent, beat | [WS-1] |

## 9 Integrations

N/A: Beat allocation is done in the neome app, not SAP [IN-1]; Beats live in neome only [WS-1].

## 10 Volumes and NFRs

- About 90 Beats, about 15 Routes, about 4,000 customers; 60 Sales Agents and 25 Tricycle Riders to map. [WS-1]
- Works offline: Sales Agent sees the mapping and today's plan with no network; syncs when online. [WS-1]

## 11 Requirements

### BEAT-01 — Assign Beats to employees

Statement: A Sales Supervisor assigns one or more Beats to an employee, making the Employee - Beat Mapping, with no approval. [RFP-1, IN-1, WS-1]
Acceptance:
- After the Supervisor assigns Beat A to an agent, Beat A shows in that agent's mapping at once. [WS-1]
- A Tricycle Rider can be mapped to Beats the same way. [WS-1]
Priority: Must
Scope: Neome
Sources: RFP-1, IN-1, WS-1
OIs: OI-23
Proposed: no

### BEAT-02 — Customers limited to assigned Beat

Statement: When placing an order, a Sales Agent selects a customer only from the Beats mapped to them, today's planned Beat first. [RFP-1, WS-1]
Acceptance:
- An agent mapped only to Beat A sees only Beat A customers when placing an order. [RFP-1, WS-1]
- An agent with no Beat mapped cannot pick a customer. [WS-1]
Priority: Must
Scope: Neome
Sources: RFP-1, WS-1
Proposed: no

### BEAT-03 — Weekly Beat Plan

Statement: A Sales Supervisor sets which Beat each employee works on each weekday, Monday to Saturday. [WS-1]
Acceptance:
- Supervisor plans Beat A for an agent on Monday and Beat B on Tuesday; the agent sees Beat A as today's Beat on Monday. [WS-1]
- A Beat that is not mapped to the agent cannot be put in the agent's plan. [WS-1]
Priority: Must
Scope: Neome
Sources: WS-1
OIs: OI-23
Proposed: no

### BEAT-04 — One Beat, one Sales Agent

Statement: A Beat is mapped to only one Sales Agent at a time; a Sales Agent may have many Beats. [WS-1]
Acceptance:
- Mapping Beat A to a second Sales Agent while a first holds it is refused. [WS-1]
- After the first agent is unmapped, Beat A can be mapped to the second. [WS-1]
- A Tricycle Rider can be mapped to a Beat that has a Sales Agent. [WS-1]
Priority: Must
Scope: Neome
Sources: WS-1
OIs: OI-24
Proposed: no

### BEAT-05 — Inactive Beat

Statement: When the Owner makes a Beat inactive, its employees are unmapped and its customers stay on it for the Sales Supervisor to move. [WS-1]
Acceptance:
- After the Owner makes Beat A inactive, no employee is mapped to Beat A and its customers still show Beat A. [WS-1]
- Supervisor moves those customers to another Beat. [WS-1]
Priority: Should
Scope: Neome
Sources: WS-1
OIs: OI-72
Proposed: no

### BEAT-06 — Beat plan offline

Statement: A Sales Agent sees their Employee - Beat Mapping and today's Beat with no network. [WS-1]
Acceptance:
- With the phone offline, the agent opens today's Beat and its customers. [WS-1]
Priority: Should
Scope: Neome
Sources: WS-1
Proposed: no

### BEAT-07 — Beat plan list

Statement: Supervisors and managers see a list of Employee - Beat Mapping and Weekly Beat Plan, filtered by supervisor, agent or beat. [WS-1]
Acceptance:
- Supervisor filters the list by agent and sees that agent's Beats and weekday plan. [WS-1]
Priority: Should
Scope: Neome
Sources: WS-1
Proposed: no

## 12 Neome mapping

Neome App: `fmcg-field-sales-and-distribution`
Delivery: Configuration
How: Beat → Beat / route; Employee - Beat Mapping and Weekly Beat Plan → daily beat assignment per executive, set up with one-agent-per-Beat check and Active / Inactive Beat status; Sales Agent customer pick limited to mapped Beats, offline sync as platform mechanics; Employee Directory holds the Employee side (proposed, to confirm)

## 13 Open Items

- OI-72: Beat moved to another Route (and inactive Beat) in Masters.
