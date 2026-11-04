---
id: TMOD-machine-maintenance
kind: template-module
name: Machine and tool maintenance
aliases: []
patterns: [PAT-per-row-scheduler, PAT-calculated-field, PAT-copy-fields-from-ref, PAT-pick-from-report-ref, PAT-insert-row-in-other-sheet, PAT-shared-sub-workflow, PAT-act-on-status-change, PAT-message-on-event, PAT-update-linked-rows, PAT-running-total-by-log-field, PAT-low-stock-alert, PAT-lock-fields-by-visibility, PAT-show-field-by-value, PAT-composite-report, PAT-query-report-with-filter, PAT-menu-by-button-form, PAT-sheet-row-drives-app-user]
neomeApp: machine-tools-maintenance
delivery: standard
seenIn:
  - {build: NA-machine-tools-maintenance, area: MachineAndToolMaintenance}
---

# Machine and tool maintenance

## Usual needs

- Usually has to keep a machine register with category, location and install date.
- Usually has to plan preventive maintenance by frequency and remind before it is due.
- Usually has to let a technician do maintenance with a checklist and spare parts used.
- Usually has to log breakdowns and add downtime to the machine.
- Usually has to keep spare part stock and warn at reorder level.
- Usually has to show machines, breakdowns and maintenance cost for a date range.

## Process steps

1. Admin adds machine with maintenance frequency.
2. Next date set; scheduled maintenance row made.
3. Manager assigns a technician; technician told.
4. Technician ticks checklist and enters spare parts.
5. Machine dates, downtime and part stock updated.
6. Breakdown logged, machine down, later resolved.

## Usual sheets, key fields, roles

- Machine: MachineCode, Category, Location, InstallationDate, MaintenanceFrequency, NextMaintenanceDate, RemainderDate, Status, TotalBreakdownHr
- Maintenance: Machine ref, MaintenanceType, AssignedTo, Cost, DowntimeHours, Status, spare parts grid, checklist grid
- Breakdown: Machine ref, ReportedOn, Status, ResolvedBy, ResolvedOn, DowntimeHours, RootCauseAnalysis
- SparePart: PartName, AvailableQuantity (log number), ReorderQuantity
- Roles: Maintenance technician, Maintenance manager, Admin.

## Neome App / Delivery hint

Neome App: machine-tools-maintenance. Delivery: standard (App gives it out of the box; only Neome App Build evidence so far, no client Build). Hint only; grilling decides.

## Flowchart

```mermaid
flowchart TD
  A["Admin adds machine with maintenance frequency."]
  B["Next date set scheduled maintenance row made."]
  C["Manager assigns a technician technician told."]
  D["Technician ticks checklist and enters spare parts."]
  E["Machine dates, downtime and part stock updated."]
  F["Breakdown logged, machine down, later resolved."]
  A --> B
  B --> C
  C --> D
  D --> E
  E --> F
```
