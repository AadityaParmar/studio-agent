---
id: TMOD-management-reports
kind: template-module
name: Management reports
aliases: [Admin reports, Manager reports, Reports menu]
patterns: [PAT-composite-report, PAT-query-report-with-filter, PAT-menu-by-button-form, PAT-role-copy-of-report]
neomeApp: none
delivery: configuration
seenIn:
  - {build: NB-01, area: Dashboard}
  - {build: NB-01, area: Reporting}
  - {build: NB-02, area: Reporting}
  - {build: NB-04, area: AdminReports}
  - {build: NB-04, area: AllReporting}
  - {build: NB-04, area: ManagerReports}
  - {build: NB-05, area: Reporting}
  - {build: NB-05, area: HRReporting}
  - {build: NB-06, area: Reporting}
---

# Management reports

## Usual needs

- Usually has to give admin and owner dashboards and reports by date, zone, team and user.
- Usually has to give managers the same reports for their team.
- Usually has to open many reports from one menu.
- Usually has to show planning figures such as how much to produce.

## Process steps

1. Admin or manager opens the menu or a report.
2. Sets the filter.
3. Reads the dashboard or list.

## Usual sheets, key fields, roles

- No own sheets; filter and output forms only.
- Roles: Admin, Owner, HR, Manager.

## Neome App / Delivery hint

Neome App: none. Delivery: configuration (reports). Hint only; grilling decides.

## Flowchart

```mermaid
flowchart TD
  A["Admin or manager opens the menu or a report."]
  B["Sets the filter."]
  C["Reads the dashboard or list."]
  A --> B
  B --> C
```
