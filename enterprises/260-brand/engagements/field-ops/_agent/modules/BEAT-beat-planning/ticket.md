---
status: open
prefix: BEAT
name: Beat Planning
blockedBy: [MST]
revisitReason:
formerly:
claimedBy:
---

# BEAT — Beat Planning

Name: Beat Planning

## 1 Purpose and KPIs

- Purpose: Sales Supervisor assigns Beats to employees so they visit and order only from their Beat's customers. [RFP-1]

## 2 Roles

| role | does what | headcount | Source |
|---|---|---|---|
| Sales Supervisor | Assigns Beats to employees | | [RFP-1] |
| Sales Agent | Works the customers of the assigned Beat | | [RFP-1] |

## 3 Process

- Supervisor: Assign Beats (Employee Master, Beat Master) → Empoyee - Beat Mapping. [RFP-1]
- Sales Agent picks customers from the assigned Beat when placing an order. [RFP-1]
- Beat allocation is done in the neome app, not SAP. [IN-1]
- Beat Planning marked Completed in RFP-1 scope. [RFP-1]

## 11 Requirements

### BEAT-01 — Assign Beats to employees

Statement: A Sales Supervisor assigns one or more Beats to an employee, making the Employee - Beat Mapping. [RFP-1, IN-1]
Acceptance:
- After the Supervisor assigns Beat A to an agent, Beat A shows in that agent's mapping. (proposed, to confirm)
Priority: TBC
Scope: Open
Sources: RFP-1, IN-1
OIs: OI-23, OI-24
Proposed: yes

### BEAT-02 — Customers limited to assigned Beat

Statement: When placing an order, a Sales Agent selects a customer from the assigned Beat. [RFP-1]
Acceptance:
- An agent mapped only to Beat A sees only Beat A customers when placing an order. (proposed, to confirm)
Priority: TBC
Scope: Open
Sources: RFP-1
Proposed: yes

## 13 Open Items

- OI-23: Mapping only, or day-wise beat plan?
- OI-24: One Beat to many employees?
