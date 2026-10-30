# 01: Neome App catalog reference

Type: research
Status: resolved
Blocked by: None

## Question

What does each of the 30 public Neome Apps provide? For every App: entities, statuses, roles, automations, reports and integrations. The answer should take the shape of a catalog reference file that the mapping step can read to propose a Neome App + Delivery per Module, along with the platform-wide building blocks that hold across every App. Sources: neome.ai (scrape in `../sources/neome-site/`).

## Answer

- neome.ai has **30 unique App pages**. The "31" comes from a duplicate sitemap entry (`whatsapp-inquiry-management`), confirmed live on 2026-10-28.
- 28 Apps are self-serve on the per-user plan (₹299 / $9.99). Vehicle & Driver Management and FMCG Field Sales & Distribution are licensed verticals, sold by demo + quote + implementation.
- Every App page follows the same pattern: entities with demo record codes (QT-, SO-, PO-, GRN-, TKT-, SR-, WO-, EMP-...), statuses, a role set (usually executive / manager / admin), automations, approvals, and exactly three named reports.
- Platform building blocks shared by all Apps: sheet, forms, kanban, admin-owned master lists, Bulk data insert from Excel, bulk update, approval chains by request type and value band with escalation and delegation, maker-checker governance, reminders / nudges / SLA escalation / auto-close, effective dating and versioning, Android/iOS, offline (field Apps), GPS check-in, photo and signature capture, AI (lead agent, inquiry classifier, conversational AI, MCP), and email / WhatsApp / Slack integrations.
- Main gaps on the public site:
  - No finance, invoicing or ERP App, and no named ERP connectors.
  - No public description of the workflow-builder or custom-field limits.
  - The template store appears only in blog vision posts.
  - Permission granularity (field-level security, record sharing) is not published.
  - Several pages reuse other Apps' mock-ups.
- Section 4 has Standard / Configuration / Custom module heuristics drawn from the 17 PetroStar mappings.
- Reference: [research/neome-app-catalog.md](../research/neome-app-catalog.md)
