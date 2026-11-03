---
id: TMOD-project-management
kind: template-module
name: Project management
aliases: []
patterns: [PAT-copy-fields-from-ref, PAT-pick-from-report-ref, PAT-running-total-by-log-field, PAT-act-on-status-change, PAT-calculated-field, PAT-error-field-check, PAT-show-field-by-value, PAT-admin-kept-pick-list, PAT-composite-report, PAT-query-report-with-filter, PAT-sheet-row-drives-app-user]
neomeApp: project-management
delivery: standard
seenIn:
  - {build: NA-project-management, area: ProjectManagement}
---

# Project management

## Usual needs

- Usually has to set up a project with customer, team, phases, priority and budget.
- Usually has to add tasks for a phase and team member, with time and status.
- Usually has to work out time taken, delay and billable cost per task.
- Usually has to log expenses against a project with category and files.
- Usually has to keep project totals of tasks, hours, expenses and cost.
- Usually has to show project and task dashboards.

## Process steps

1. Admin adds employees, customers and expense categories.
2. Manager adds a project with team and phases.
3. Manager adds tasks for a phase.
4. Team member updates task status and time.
5. Expenses added; project totals update.
6. Manager reads dashboards.

## Usual sheets, key fields, roles

- Project: Customer ref, Priority, Status, team grid with rates, phase grid, ContractValue, BudgetCost, ActualCost, totals (log numbers)
- Task: Project ref, phase, TeamMember, ETC, TimeTaken, Status
- Expense: Project ref, Category, Amount, Documents
- Customer and ExpenseCategory lists
- Roles: Project manager, Team member, Admin.

## Neome App / Delivery hint

Neome App: project-management. Delivery: standard (App gives it out of the box; only Neome App Build evidence so far, no client Build). Hint only; grilling decides.

## Flowchart

```mermaid
flowchart TD
  A["Admin adds employees, customers and expense categories."]
  B["Manager adds a project with team and phases."]
  C["Manager adds tasks for a phase."]
  D["Team member updates task status and time."]
  E["Expenses added project totals update."]
  F["Manager reads dashboards."]
  A --> B
  B --> C
  C --> D
  D --> E
  E --> F
```
