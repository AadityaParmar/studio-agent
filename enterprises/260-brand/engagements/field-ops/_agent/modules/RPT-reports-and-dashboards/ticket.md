---
status: open
prefix: RPT
name: Reports and Dashboards
draft: true
blockedBy: []
---

# RPT — Reports and Dashboards

Name: Reports and Dashboards

## 1 Purpose and KPIs

- Purpose: Custom reports, daily summaries and dashboards for sales performance, efficiency, targets and incentives. [RFP-1]

## 2 Roles

| role | does what | headcount | Source |
|---|---|---|---|
| Admin | Views reports | | [RFP-1] |
| Owner | Full access to analytics | | [RFP-1] |
| Sales Supervisor | Monitors performance | | [RFP-1] |

## 3 Process

- Admin: View reports → End. [RFP-1]
- Sales Reports and Visit Reports marked Completed; Debt VS Collection, Total VS Productive VS Non-Productive calls, Target VS Achieved Sales, dashboards with Target & Incentive Structure and Customer Master Heat Map marked Pending in RFP-1 scope. [RFP-1]

## 8 Reports

| name | audience | measures/filters | Source |
|---|---|---|---|
| Sales Reports | | OI-53 | [RFP-1] |
| Visit Reports | | OI-53 | [RFP-1] |
| Daily summaries | | OI-53 | [RFP-1] |
| Debt VS Collection | | Debt vs amount collected; OI-57 | [RFP-1] |
| Total VS Productive VS Non-Productive calls | | Calls by type; OI-54 | [RFP-1] |
| Target VS Achieved Sales | | Sales vs target; OI-55 | [RFP-1] |
| Performance, Efficiency Dashboards | | OI-53 | [RFP-1] |
| Customer Master Heat Map | | Geo-based; OI-58 | [RFP-1] |

## 11 Requirements

### RPT-01 — Custom reports

Statement: Users can view custom reports, including sales and visit reports and auto-made daily summaries and sales insights. [RFP-1]
Acceptance:
- A permitted user opens the sales report and filters by date. (proposed, to confirm)
Priority: TBC
Scope: Open
Sources: RFP-1
OIs: OI-53
Proposed: yes

### RPT-02 — Debt VS Collection

Statement: The system shows a Debt VS Collection report. [RFP-1]
Acceptance:
- The report shows per customer what is owed and what was collected in a period. (proposed, to confirm)
Priority: TBC
Scope: Open
Sources: RFP-1
OIs: OI-57
Proposed: yes

### RPT-03 — Total VS Productive VS Non-Productive calls

Statement: The system shows total, productive and non-productive calls. [RFP-1]
Acceptance:
- The report counts each visit as productive or non-productive by the agreed rule. (proposed, to confirm)
Priority: TBC
Scope: Open
Sources: RFP-1
OIs: OI-54, OI-39
Proposed: yes

### RPT-04 — Target VS Achieved Sales

Statement: The system shows Target VS Achieved Sales. [RFP-1]
Acceptance:
- For an agent with a set target, the report shows target, achieved and the gap. (proposed, to confirm)
Priority: TBC
Scope: Open
Sources: RFP-1
OIs: OI-55
Proposed: yes

### RPT-05 — Performance dashboards with targets and incentives

Statement: Visual dashboards track sales performance, efficiency metrics, targets and incentives, with a Target & Incentive Structure. [RFP-1]
Acceptance:
- A dashboard shows each agent's sales, target and earned incentive. (proposed, to confirm)
Priority: TBC
Scope: Open
Sources: RFP-1
OIs: OI-55, OI-56
Proposed: yes

### RPT-06 — Customer Master Heat Map

Statement: The system shows a geo-based heat map of the Customer Master. [RFP-1]
Acceptance:
- The map shows customer density by area from GEO tags. (proposed, to confirm)
Priority: TBC
Scope: Open
Sources: RFP-1
OIs: OI-58
Proposed: yes

## 13 Open Items

- OI-39: Visit without order; reason.
- OI-53: Full report list with audience, measures, filters.
- OI-54: Productive call definition.
- OI-55: Targets: who sets, per whom, period, basis.
- OI-56: Incentive rules.
- OI-57: Source of customer debt.
- OI-58: What the heat map shows.
