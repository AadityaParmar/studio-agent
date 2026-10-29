---
status: open
prefix: SAP
name: SAP Integration
draft: true
blockedBy: []
---

# SAP — SAP Integration

Name: SAP Integration

## 1 Purpose and KPIs

- Purpose: Two-way sync between neome and SAP / ERP for customers, products, employees, stock and invoices, through a plugin. [RFP-1, IN-1]

## 2 Roles

| role | does what | headcount | Source |
|---|---|---|---|
| Neome team | Writes the plugin for the SAP integration | | [RFP-1, IN-1] |

## 3 Process

- Plugin is configured using the neome dashboard. [RFP-1, IN-1]
- ERP/SAP Integration marked Pending in RFP-1 scope. [RFP-1]

## 9 Integrations

| system | direction | data | owner | Source |
|---|---|---|---|---|
| SAP | both | Customer master | Neome team | [RFP-1, IN-1] |
| SAP | both | Product master | Neome team | [RFP-1, IN-1] |
| SAP | both | Employee master | Neome team | [RFP-1, IN-1] |
| ERP | both | Stock details | Neome team; OI-09 | [RFP-1] |
| SAP | out | Order invoice | Neome team | [RFP-1, IN-1] |

## 11 Requirements

### SAP-01 — Customer sync both ways

Statement: Customers created or changed in SAP are fetched by the plugin and shown in neome; customers created or changed in neome are pushed by the plugin to SAP. [RFP-1, IN-1]
Acceptance:
- A customer added in SAP is visible in the neome app after sync, and one added in neome is in SAP after sync. (proposed, to confirm)
Priority: TBC
Scope: Open
Sources: RFP-1, IN-1
OIs: OI-10, OI-65
Proposed: yes

### SAP-02 — Product sync both ways

Statement: Products created or changed in SAP are fetched by the plugin and shown in neome; products created or changed in neome are pushed to SAP. [RFP-1, IN-1]
Acceptance:
- A product added in SAP is visible in the neome app after sync. (proposed, to confirm)
Priority: TBC
Scope: Open
Sources: RFP-1, IN-1
OIs: OI-10, OI-65
Proposed: yes

### SAP-03 — Employee sync both ways

Statement: Employees created or changed in SAP are fetched by the plugin and shown in neome; employees created or changed in neome are pushed to SAP. [RFP-1, IN-1]
Acceptance:
- An employee added in SAP is visible in the neome app after sync. (proposed, to confirm)
Priority: TBC
Scope: Open
Sources: RFP-1, IN-1
OIs: OI-10, OI-65
Proposed: yes

### SAP-04 — Stock sync both ways

Statement: Stock created or changed in ERP syncs to neome, and stock created or changed in neome syncs to ERP, through the plugin. [RFP-1]
Acceptance:
- A stock change in ERP is visible in neome after sync. (proposed, to confirm)
Priority: TBC
Scope: Open
Sources: RFP-1
OIs: OI-09
Proposed: yes

### SAP-05 — Invoice to SAP

Statement: An invoice generated in neome for a new order is sent by the plugin to SAP and is visible in SAP. [RFP-1, IN-1]
Acceptance:
- The invoice of an order placed in neome is visible in SAP after sync. (proposed, to confirm)
Priority: TBC
Scope: Open
Sources: RFP-1, IN-1
OIs: OI-38
Proposed: yes

### SAP-06 — Plugin set up from neome dashboard

Statement: The plugin is configured in the neome dashboard, including data sync frequency. [RFP-1, IN-1]
Acceptance:
- An admin changes product sync frequency in the dashboard and the next sync follows it. (proposed, to confirm)
Priority: TBC
Scope: Open
Sources: RFP-1, IN-1
OIs: OI-11
Proposed: yes

### SAP-07 — Neome builds the plugin

Statement: The Neome team writes the plugin for the SAP integration. [RFP-1, IN-1]
Acceptance:
- The plugin is delivered by the Neome team. (proposed, to confirm)
Priority: TBC
Scope: Neome
Sources: RFP-1, IN-1
OIs: OI-08
Proposed: yes

## 13 Open Items

- OI-08: Which SAP / ERP, version, API access.
- OI-09: Stock sync in scope?
- OI-10: System of record; clash rule.
- OI-11: Sync frequency per data type.
- OI-12: Existing SAP data to load.
- OI-16: Who makes Customer Code.
- OI-38: Invoice format, numbering, tax.
- OI-48: Does closing stock feed SAP / ERP?
- OI-57: Source of customer debt.
- OI-65: Checks before neome-made masters reach SAP.
